// character.js - handles character interactions

const haruUrara = document.getElementById('haruUrara');

// Get current character sprites based on selection
function getCurrentSprites() {
    const selectedChar = window.gameState.selectedCharacter;
    if (selectedChar && window.characterData[selectedChar]) {
        return {
            default: window.characterData[selectedChar].defaultSprite,
            clicked: window.characterData[selectedChar].clickedSprite
        };
    }
    // Fallback to Haru Urara if no selection
    return {
        default: 'assets/images/characters/default/HaruUraraChibi1.webp',
        clicked: 'assets/images/characters/default2/Haru_Urara_Chibi1-2.webp'
    };
}

window.hoverEffect = function() {
    if (haruUrara) haruUrara.style.transform = 'scale(1.1)';
};

window.resetHover = function() {
    if (haruUrara) haruUrara.style.transform = 'scale(1)';
};

window.clickCharacter = function(event) {
    // Check for critical hit
    const isCritical = Math.random() < window.gameState.criticalChance;
    let moneyEarned = window.gameState.clickPower;
    
    if (isCritical) {
        moneyEarned *= window.gameState.criticalMultiplier;
    }
    
    // award money
    window.gameState.money += moneyEarned;

    // play click sound (small audio pool to avoid cutoffs)
    try {
        if (!window.clickSoundPool) {
            window.clickSoundPool = [];
            window.clickSoundIndex = 0;
            for (let i = 0; i < 3; i++) {
                const a = new Audio('assets/sounds/Click/shimmerClick.mp3');
                a.volume = 0.9;
                window.clickSoundPool.push(a);
            }
        }
        const snd = window.clickSoundPool[window.clickSoundIndex % window.clickSoundPool.length];
        // rewind and play
        try { snd.currentTime = 0; } catch (e) {}
        snd.play().catch(() => {});
        window.clickSoundIndex++;
    } catch (err) {
        console.warn('Click sound failed:', err);
    }

    const sprites = getCurrentSprites();
    if (haruUrara) haruUrara.src = sprites.clicked;

    // Determine start coords: prefer mouse/touch position, fallback to character center
    let startX, startY;
    if (event) {
        // touch event
        if (event.touches && event.touches[0]) {
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
        } else {
            // mouse event
            startX = typeof event.clientX === 'number' ? event.clientX : undefined;
            startY = typeof event.clientY === 'number' ? event.clientY : undefined;
        }
    }

    if (startX === undefined || startY === undefined) {
        const rect = haruUrara ? haruUrara.getBoundingClientRect() : {left:200, top:200, width:100, height:100};
        startX = rect.left + rect.width / 2;
        startY = rect.top + rect.height / 2;
    }

    // slight upward offset so the explosion looks natural under the cursor
    startY = startY - 8;

    // Limit visuals per click to avoid spawning huge amounts; visual limit is separate from awarded money
    const VISUAL_MONEY_PER_CLICK = isCritical ? 12 : 6; // More visual money on critical
    const spawnCount = window.createFallingMoney(startX, startY, Math.min(moneyEarned, VISUAL_MONEY_PER_CLICK));

    // Critical hits guarantee carat drops
    const caratDropChance = isCritical ? 1.0 : window.gameState.caratChance;
    
    if (Math.random() < caratDropChance) {
        let spawnedCarats = 0;
        const caratAmount = isCritical ? window.gameState.caratAmount + 1 : window.gameState.caratAmount;
        for (let i = 0; i < caratAmount; i++) {
            const spawned = window.createFallingCarat(startX, startY);
            if (spawned) spawnedCarats++;
        }
        // only add carats to the account for actually-spawned visuals
        window.gameState.carats += spawnedCarats;
        if (spawnedCarats > 0) window.updateDisplay();
    }

    setTimeout(() => { 
        if (haruUrara) haruUrara.src = sprites.default; 
    }, 150);

    window.updateDisplay();
    window.updateUpgradeButtons();
    window.saveGameState();
};

// keyboard shortcut
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        window.clickCharacter();
    }
});
