// Game state
let gameState = {
    money: 0,
    clickPower: 1,
    autoClickRate: 0,
    autoClickSpeed: 1000, // milliseconds
    upgrades: {
        clickPower: {
            cost: 10,
            level: 0,
            costMultiplier: 1.5
        },
        autoClick: {
            cost: 50,
            level: 0,
            costMultiplier: 2
        },
        autoSpeed: {
            cost: 100,
            level: 0,
            costMultiplier: 1.8
        }
    }
};

// Carat system
gameState.carats = 0;
// base chance to drop carats on click (0.05 = 5%)
gameState.caratChance = 0.05;
gameState.caratAmount = 1; // how many carats spawn per drop
// cost/upgrade details for carat upgrades will be managed in buyUpgrade

// Background settings based on time
function setBackgroundByTime() {
    const now = new Date();
    const hour = now.getHours();
    const gamePanel = document.querySelector('.game-panel');
    
    let backgroundImage;
    
    // New ranges requested by user:
    // - Early morning: 03:00 - 06:00
    // - Day:           06:00 - 16:00
    // - Evening:       17:00 - 19:00
    // - Night:         19:00 - 03:00
    // Note: 16:00-17:00 is mapped to the "noon" image because there is no separate evening image file.
    if (hour >= 3 && hour < 6) {
        // Early morning (3 AM - 6 AM)
        backgroundImage = 'assets/images/background/academy early morning.png';
    } else if (hour >= 6 && hour < 16) {
        // Day time (6 AM - 4 PM)
        backgroundImage = 'assets/images/background/academy day.png';
    } else if (hour >= 16 && hour < 19) {
        // Late afternoon / evening (4 PM - 7 PM) - use noon image for this range
        backgroundImage = 'assets/images/background/academy noon.png';
    } else {
        // Night time (7 PM - 3 AM)
        backgroundImage = 'assets/images/background/academy night.png';
    }
    
    gamePanel.style.backgroundImage = `url('${backgroundImage}')`;
    
    console.log(`Current time: ${hour}:${now.getMinutes()}, Background: ${backgroundImage}`);
}

// DOM elements
const haruUrara = document.getElementById('haruUrara');
const caratCountElement = document.getElementById('caratCount');

// Character sprites
const defaultSprite = 'assets/images/characters/default/HaruUraraChibi1.webp';
const clickedSprite = 'assets/images/characters/default2/Haru_Urara_Chibi1-2.webp';

// Initialize game
window.onload = function() {
    setBackgroundByTime();
    updateDisplay();
    startAutoClicker();
    loadGameState();
    
    // Update background every minute to handle time changes
    setInterval(setBackgroundByTime, 60000);
};

// Save game state to localStorage
function saveGameState() {
    localStorage.setItem('umaClickerSave', JSON.stringify(gameState));
}

// Load game state from localStorage
function loadGameState() {
    const saved = localStorage.getItem('umaClickerSave');
    if (saved) {
        gameState = {...gameState, ...JSON.parse(saved)};
        updateDisplay();
        updateUpgradeButtons();
    }
}

// Hover effect
function hoverEffect() {
    haruUrara.style.transform = 'scale(1.1)';
}

// Reset hover effect
function resetHover() {
    haruUrara.style.transform = 'scale(1)';
}

// Click character function
function clickCharacter(event) {
    // Add money
    gameState.money += gameState.clickPower;
    
    // Visual feedback - sprite swap
    haruUrara.src = clickedSprite;

    // Create falling money image that jumps out from the character and falls to the ground
    const rect = haruUrara.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    createFallingMoney(startX, startY, gameState.clickPower);

    // Chance to drop carats
    if (Math.random() < gameState.caratChance) {
        // spawn carat(s) near her leg visually using Monies image for now (could be carat image)
        for (let i = 0; i < gameState.caratAmount; i++) {
            createFallingCarat(startX, startY);
            gameState.carats += 1;
        }
        updateDisplay();
    }

    // Reset sprite after animation
    setTimeout(() => {
        haruUrara.src = defaultSprite;
    }, 150);

    // Update display
    updateDisplay();
    updateUpgradeButtons();
    saveGameState();
}

// Create floating number animation
function createFallingMoney(x, y, count = 1) {
    const gamePanel = document.querySelector('.game-panel');
    const panelRect = gamePanel.getBoundingClientRect();

    for (let i = 0; i < Math.max(1, count); i++) {
        const img = document.createElement('img');
        img.src = 'assets/images/items/Monies.png';
        img.className = 'falling-money';
        img.style.left = x + 'px';
        img.style.top = y + 'px';
        img.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(img);

    // initial velocities (px per second) - reduced ranges to avoid large overshoot
    const vx = (Math.random() * 160 - 80); // left or right, smaller
    const vy = -(260 + Math.random() * 140); // upward
    const gravity = 1200; // px/s^2

        let posX = x;
        let posY = y;
        let velX = vx;
        let velY = vy;
        let last = performance.now();

        // compute landing spot near character's legs
        const charRect = haruUrara.getBoundingClientRect();
        const side = Math.random() < 0.5 ? -1 : 1;
        const landingX = charRect.left + charRect.width / 2 + side * (20 + Math.random() * (charRect.width / 3));
        const landingY = charRect.bottom - 10;

        function step(now) {
            const dt = (now - last) / 1000; // seconds
            last = now;

            // integrate without steering to avoid huge horizontal jumps
            velY += gravity * dt;
            posX += velX * dt;
            posY += velY * dt;

            img.style.left = posX + 'px';
            img.style.top = posY + 'px';

            // check for landing near character legs
            if (posY >= landingY) {
                // smoothly move to landing spot to avoid teleportation
                img.style.transition = 'left 220ms ease-out, top 220ms ease-out, transform 220ms ease-out, opacity 400ms ease-out';
                img.style.left = landingX + 'px';
                img.style.top = landingY + 'px';
                img.style.transform = 'translate(-50%, 0) scale(0.95)';
                img.style.opacity = '0.95';
                setTimeout(() => {
                    if (img.parentElement) img.parentElement.removeChild(img);
                }, 600);
                return;
            }

            requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }
}

// create a visual carat drop (uses carat image) that falls to leg similarly
function createFallingCarat(x, y) {
    const img = document.createElement('img');
    img.src = 'assets/images/items/carats.png';
    img.className = 'falling-money';
    img.style.left = x + 'px';
    img.style.top = y + 'px';
    img.style.transform = 'translate(-50%, -50%) scale(0.8)';
    document.body.appendChild(img);

    const vx = (Math.random() * 120 - 60);
    const vy = -(220 + Math.random() * 120);
    const gravity = 1200;

    let posX = x;
    let posY = y;
    let velX = vx;
    let velY = vy;
    let last = performance.now();

    const charRect = haruUrara.getBoundingClientRect();
    const side = Math.random() < 0.5 ? -1 : 1;
    const landingX = charRect.left + charRect.width / 2 + side * (10 + Math.random() * (charRect.width / 4));
    const landingY = charRect.bottom - 6;

    function step(now) {
        const dt = (now - last) / 1000;
        last = now;

        velY += gravity * dt;
        posX += velX * dt;
        posY += velY * dt;

        img.style.left = posX + 'px';
        img.style.top = posY + 'px';

        if (posY >= landingY) {
            img.style.transition = 'left 180ms ease-out, top 180ms ease-out, transform 180ms ease-out, opacity 300ms ease-out';
            img.style.left = landingX + 'px';
            img.style.top = landingY + 'px';
            img.style.transform = 'translate(-50%, 0) scale(0.75)';
            img.style.opacity = '0.95';
            setTimeout(() => { if (img.parentElement) img.parentElement.removeChild(img); }, 500);
            return;
        }

        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

// Extend buyUpgrade to support caratChance and caratAmount
const extraUpgrades = {
    caratChance: { cost: 200, level: 0, costMultiplier: 1.9 },
    caratAmount: { cost: 300, level: 0, costMultiplier: 2.2 }
};

function buyUpgrade(upgradeType) {
    // existing upgrades
    if (gameState.upgrades[upgradeType]) {
        const upgrade = gameState.upgrades[upgradeType];
        if (gameState.money >= upgrade.cost) {
            gameState.money -= upgrade.cost;
            upgrade.level++;
            switch (upgradeType) {
                case 'clickPower': gameState.clickPower++; break;
                case 'autoClick': gameState.autoClickRate++; break;
                case 'autoSpeed': gameState.autoClickSpeed = Math.max(100, gameState.autoClickSpeed - 100); restartAutoClicker(); break;
            }
            upgrade.cost = Math.floor(upgrade.cost * upgrade.costMultiplier);
            updateDisplay(); updateUpgradeButtons(); saveGameState();
        }
        return;
    }

    // extra upgrades
    if (extraUpgrades[upgradeType]) {
        const u = extraUpgrades[upgradeType];
        if (gameState.money >= u.cost) {
            gameState.money -= u.cost;
            u.level++;
            if (upgradeType === 'caratChance') {
                gameState.caratChance = Math.min(1, gameState.caratChance + 0.05);
            } else if (upgradeType === 'caratAmount') {
                gameState.caratAmount = gameState.caratAmount + 1;
            }
            u.cost = Math.floor(u.cost * u.costMultiplier);
            updateDisplay(); updateUpgradeButtons(); saveGameState();
        }
        return;
    }
}

// Update display
function updateDisplay() {
    const moneyEl = document.getElementById('moneyCount');
    const caratEl = document.getElementById('caratCount');
    moneyEl.textContent = Math.floor(gameState.money);
    caratEl.textContent = Math.floor(gameState.carats);
}

// Buy upgrade function
function buyUpgrade(upgradeType) {
    const upgrade = gameState.upgrades[upgradeType];
    
    if (gameState.money >= upgrade.cost) {
        gameState.money -= upgrade.cost;
        upgrade.level++;
        
        // Apply upgrade effects
        switch(upgradeType) {
            case 'clickPower':
                gameState.clickPower++;
                break;
            case 'autoClick':
                gameState.autoClickRate++;
                break;
            case 'autoSpeed':
                gameState.autoClickSpeed = Math.max(100, gameState.autoClickSpeed - 100);
                restartAutoClicker();
                break;
        }
        
        // Increase cost
        upgrade.cost = Math.floor(upgrade.cost * upgrade.costMultiplier);
        
        updateDisplay();
        updateUpgradeButtons();
        saveGameState();
    }
}

// Update upgrade buttons
function updateUpgradeButtons() {
    // Update click power upgrade
    const clickPowerBtn = document.querySelector('[onclick="buyUpgrade(\'clickPower\')"]');
    const clickPowerCost = clickPowerBtn.parentElement.querySelector('.upgrade-cost span');
    clickPowerCost.textContent = gameState.upgrades.clickPower.cost;
    clickPowerBtn.disabled = gameState.money < gameState.upgrades.clickPower.cost;
    
    // Update auto click upgrade
    const autoClickBtn = document.querySelector('[onclick="buyUpgrade(\'autoClick\')"]');
    const autoClickCost = autoClickBtn.parentElement.querySelector('.upgrade-cost span');
    autoClickCost.textContent = gameState.upgrades.autoClick.cost;
    autoClickBtn.disabled = gameState.money < gameState.upgrades.autoClick.cost;
    
    // Update auto speed upgrade
    const autoSpeedBtn = document.querySelector('[onclick="buyUpgrade(\'autoSpeed\')"]');
    const autoSpeedCost = autoSpeedBtn.parentElement.querySelector('.upgrade-cost span');
    autoSpeedCost.textContent = gameState.upgrades.autoSpeed.cost;
    autoSpeedBtn.disabled = gameState.money < gameState.upgrades.autoSpeed.cost;

    // Update extra upgrades
    const caratChanceBtn = document.querySelector('[onclick="buyUpgrade(\'caratChance\')"]');
    const caratAmountBtn = document.querySelector('[onclick="buyUpgrade(\'caratAmount\')"]');
    if (caratChanceBtn) {
        const el = caratChanceBtn.parentElement.querySelector('.upgrade-cost span');
        el.textContent = extraUpgrades.caratChance.cost;
        caratChanceBtn.disabled = gameState.money < extraUpgrades.caratChance.cost;
    }
    if (caratAmountBtn) {
        const el2 = caratAmountBtn.parentElement.querySelector('.upgrade-cost span');
        el2.textContent = extraUpgrades.caratAmount.cost;
        caratAmountBtn.disabled = gameState.money < extraUpgrades.caratAmount.cost;
    }
}

// Auto clicker functionality
let autoClickerInterval;

function startAutoClicker() {
    autoClickerInterval = setInterval(() => {
        if (gameState.autoClickRate > 0) {
            gameState.money += gameState.autoClickRate;
            updateDisplay();
            saveGameState();
        }
    }, gameState.autoClickSpeed);
}

function restartAutoClicker() {
    clearInterval(autoClickerInterval);
    startAutoClicker();
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        clickCharacter();
    }
});

// Add some extra visual polish
document.addEventListener('DOMContentLoaded', function() {
    // Add subtle animations to upgrade items
    const upgradeItems = document.querySelectorAll('.upgrade-item');
    upgradeItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.style.animation = 'fadeInUp 0.5s ease forwards';
    });
});

// CSS for fade in animation (add to style.css or include here)
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;
document.head.appendChild(style);
