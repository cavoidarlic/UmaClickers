// upgrades/logic.js - contains upgrade purchasing logic separated from UI

window.applyUpgrade = function(upgradeType) {
    // handle base upgrades
    if (window.gameState.upgrades[upgradeType]) {
        const upgrade = window.gameState.upgrades[upgradeType];
        if (window.gameState.money >= upgrade.cost) {
            window.gameState.money -= upgrade.cost;
            upgrade.level++;
            switch (upgradeType) {
                case 'clickPower': window.gameState.clickPower++; break;
                case 'autoClick': window.gameState.autoClickRate++; break;
                case 'autoSpeed': window.gameState.autoClickSpeed = Math.max(100, window.gameState.autoClickSpeed - 100); window.restartAutoClicker(); break;
            }
            upgrade.cost = Math.floor(upgrade.cost * upgrade.costMultiplier);
            window.updateDisplay();
            window.saveGameState();
        }
        return true;
    }

    // extra upgrades
    if (window.extraUpgrades[upgradeType]) {
        const u = window.extraUpgrades[upgradeType];
        if (window.gameState.money >= u.cost) {
            window.gameState.money -= u.cost;
            u.level++;
            if (upgradeType === 'caratChance') {
                window.gameState.caratChance = Math.min(1, window.gameState.caratChance + 0.05);
            } else if (upgradeType === 'caratAmount') {
                window.gameState.caratAmount = window.gameState.caratAmount + 1;
            }
            u.cost = Math.floor(u.cost * u.costMultiplier);
            window.updateDisplay();
            window.saveGameState();
            return true;
        }
    }

    return false;
};
