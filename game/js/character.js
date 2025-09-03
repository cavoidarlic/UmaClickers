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
    window.gameState.money += window.gameState.clickPower;

    if (haruUrara) haruUrara.src = clickedSprite;

    const rect = haruUrara ? haruUrara.getBoundingClientRect() : {left:200, top:200, width:100, height:100};
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    window.createFallingMoney(startX, startY, window.gameState.clickPower);

    if (Math.random() < window.gameState.caratChance) {
        for (let i = 0; i < window.gameState.caratAmount; i++) {
            window.createFallingCarat(startX, startY);
            window.gameState.carats += 1;
        }
        window.updateDisplay();
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
