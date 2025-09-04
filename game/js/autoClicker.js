// autoClicker.js - starts and manages auto clicker intervals and passive income

window.autoClickerInterval = null;
window.passiveIncomeInterval = null;

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

window.startPassiveIncome = function() {
    if (window.passiveIncomeInterval) clearInterval(window.passiveIncomeInterval);
    window.passiveIncomeInterval = setInterval(() => {
        // Safety check to ensure upgrades exist
        if (window.gameState.upgrades && window.gameState.upgrades.speed) {
            const speedLevel = window.gameState.upgrades.speed.level;
            if (speedLevel > 0) {
                const passiveIncome = speedLevel * 0.5; // 0.5 money per second per level
                window.gameState.money += passiveIncome;
                window.updateDisplay();
                window.saveGameState();
            }
        }
    }, 1000); // Every second
};

window.restartAutoClicker = function() {
    if (window.autoClickerInterval) clearInterval(window.autoClickerInterval);
    window.startAutoClicker();
};
