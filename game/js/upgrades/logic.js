// upgrades/logic.js - contains upgrade purchasing logic separated from UI

window.applyUpgrade = function(upgradeType) {
    // handle Uma stat upgrades
    if (window.gameState.upgrades[upgradeType]) {
        const upgrade = window.gameState.upgrades[upgradeType];
        if (window.gameState.money >= upgrade.cost) {
            window.gameState.money -= upgrade.cost;
            upgrade.level++;
            
            // Apply upgrade effects based on type
            switch (upgradeType) {
                case 'power':
                    window.gameState.clickPower = upgrade.baseEffect + upgrade.level;
                    break;
                case 'speed':
                    // Speed provides passive money per second - handled by passive income system
                    break;
                case 'stamina':
                    // Stamina increases auto click efficiency
                    window.gameState.autoClickRate = upgrade.baseEffect + (upgrade.level * 0.1);
                    window.gameState.autoClickSpeed = Math.max(1000, 5000 - (upgrade.level * 200));
                    if (window.restartAutoClicker) {
                        window.restartAutoClicker();
                    }
                    break;
                case 'guts':
                    // Guts increases critical chance
                    window.gameState.criticalChance = upgrade.baseEffect + (upgrade.level * 0.02);
                    break;
                case 'wit':
                    // Wit increases carat chance
                    window.gameState.caratChance = upgrade.baseEffect + (upgrade.level * 0.03);
                    break;
            }
            
            upgrade.cost = Math.floor(upgrade.cost * upgrade.costMultiplier);
            window.playBuySound(); // Play buy sound effect
            window.updateDisplay();
            window.saveGameState();
            return true;
        }
    }

    return false;
};

// Calculate current stat values for display
window.getStatValue = function(statType) {
    const upgrade = window.gameState.upgrades[statType];
    if (!upgrade) return 0;
    
    switch (statType) {
        case 'power':
            return upgrade.baseEffect + upgrade.level;
        case 'speed':
            return upgrade.level * 0.5; // money per second
        case 'stamina':
            return (upgrade.baseEffect + (upgrade.level * 0.1)).toFixed(1);
        case 'guts':
            return ((upgrade.baseEffect + (upgrade.level * 0.02)) * 100).toFixed(1) + '%';
        case 'wit':
            return ((upgrade.baseEffect + (upgrade.level * 0.03)) * 100).toFixed(1) + '%';
        default:
            return upgrade.level;
    }
};
