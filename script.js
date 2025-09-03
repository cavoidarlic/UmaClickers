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

    // Create floating money image at cursor position
    createFloatingMoney(event.clientX, event.clientY);

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
function createFloatingMoney(x, y) {
    const img = document.createElement('img');
    img.src = 'assets/images/items/Monies.png';
    img.className = 'floating-money';
    img.style.left = x + 'px';
    img.style.top = y + 'px';

    document.body.appendChild(img);

    // Remove after animation
    setTimeout(() => {
        if (img.parentElement) img.parentElement.removeChild(img);
    }, 900);
}

// Update display
function updateDisplay() {
    caratCountElement.textContent = Math.floor(gameState.money);
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
