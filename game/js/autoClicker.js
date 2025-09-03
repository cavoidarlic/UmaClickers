// autoClicker.js - starts and manages auto clicker intervals

window.autoClickerInterval = null;

window.startAutoClicker = function() {
    if (window.autoClickerInterval) clearInterval(window.autoClickerInterval);
    window.autoClickerInterval = setInterval(() => {
        if (window.gameState.autoClickRate > 0) {
            window.gameState.money += window.gameState.autoClickRate;
            window.updateDisplay();
            window.saveGameState();
            window.updateUpgradeButtons();
        }
    }, window.gameState.autoClickSpeed);
};

window.restartAutoClicker = function() {
    if (window.autoClickerInterval) clearInterval(window.autoClickerInterval);
    window.startAutoClicker();
};
