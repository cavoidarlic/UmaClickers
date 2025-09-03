// main.js - initializes game on load

window.addEventListener('load', function() {
    // load state first so other modules see it
    window.loadGameState();
    window.startBackgroundAutoUpdate();
    window.updateDisplay();
    window.startAutoClicker();
    window.updateUpgradeButtons();
});

// small deprecation notice if old core.js still present
console.log('Game modules loaded. core.js is deprecated and split into modules.');
