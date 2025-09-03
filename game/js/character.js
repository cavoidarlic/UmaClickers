// character.js - handles character interactions

const haruUrara = document.getElementById('haruUrara');

const defaultSprite = 'assets/images/characters/default/HaruUraraChibi1.webp';
const clickedSprite = 'assets/images/characters/default2/Haru_Urara_Chibi1-2.webp';

window.hoverEffect = function() {
    if (haruUrara) haruUrara.style.transform = 'scale(1.1)';
};

window.resetHover = function() {
    if (haruUrara) haruUrara.style.transform = 'scale(1)';
};

window.clickCharacter = function(event) {
    // award money
    window.gameState.money += window.gameState.clickPower;

    if (haruUrara) haruUrara.src = clickedSprite;

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
    const VISUAL_MONEY_PER_CLICK = 6;
    const spawnCount = window.createFallingMoney(startX, startY, Math.min(window.gameState.clickPower, VISUAL_MONEY_PER_CLICK));

    if (Math.random() < window.gameState.caratChance) {
        let spawnedCarats = 0;
        for (let i = 0; i < window.gameState.caratAmount; i++) {
            const spawned = window.createFallingCarat(startX, startY);
            if (spawned) spawnedCarats++;
        }
        // only add carats to the account for actually-spawned visuals
        window.gameState.carats += spawnedCarats;
        if (spawnedCarats > 0) window.updateDisplay();
    }

    setTimeout(() => { if (haruUrara) haruUrara.src = defaultSprite; }, 150);

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
