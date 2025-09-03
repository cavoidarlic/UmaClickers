// game state
window.gameState = {
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
    },

    // Carat system
    carats: 0,
    caratChance: 0.05,
    caratAmount: 1
};

// Extra upgrades object kept separate so it's easier to split later
window.extraUpgrades = {
    caratChance: { cost: 200, level: 0, costMultiplier: 1.9 },
    caratAmount: { cost: 300, level: 0, costMultiplier: 2.2 }
};

// persistence helpers
window.saveGameState = function() {
    localStorage.setItem('umaClickerSave', JSON.stringify(window.gameState));
};

window.loadGameState = function() {
    const saved = localStorage.getItem('umaClickerSave');
    if (saved) {
        window.gameState = {...window.gameState, ...JSON.parse(saved)};
    }
};
