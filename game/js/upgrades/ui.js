// upgrades/ui.js - connects DOM buttons to upgrade logic and updates costs/disabled states

function buyUpgrade(upgradeType) {
    const applied = window.applyUpgrade(upgradeType);
    if (applied) {
        updateUpgradeButtons();
    }
}

window.updateUpgradeButtons = function() {
    // Update click power upgrade
    const clickPowerBtn = document.querySelector('[onclick="buyUpgrade(\'clickPower\')"]');
    if (clickPowerBtn) {
        const clickPowerCost = clickPowerBtn.parentElement.querySelector('.upgrade-cost span');
        clickPowerCost.textContent = window.gameState.upgrades.clickPower.cost;
        clickPowerBtn.disabled = window.gameState.money < window.gameState.upgrades.clickPower.cost;
    }

    // auto click
    const autoClickBtn = document.querySelector('[onclick="buyUpgrade(\'autoClick\')"]');
    if (autoClickBtn) {
        const autoClickCost = autoClickBtn.parentElement.querySelector('.upgrade-cost span');
        autoClickCost.textContent = window.gameState.upgrades.autoClick.cost;
        autoClickBtn.disabled = window.gameState.money < window.gameState.upgrades.autoClick.cost;
    }

    // auto speed
    const autoSpeedBtn = document.querySelector('[onclick="buyUpgrade(\'autoSpeed\')"]');
    if (autoSpeedBtn) {
        const autoSpeedCost = autoSpeedBtn.parentElement.querySelector('.upgrade-cost span');
        autoSpeedCost.textContent = window.gameState.upgrades.autoSpeed.cost;
        autoSpeedBtn.disabled = window.gameState.money < window.gameState.upgrades.autoSpeed.cost;
    }

    // extra upgrades
    const caratChanceBtn = document.querySelector('[onclick="buyUpgrade(\'caratChance\')"]');
    const caratAmountBtn = document.querySelector('[onclick="buyUpgrade(\'caratAmount\')"]');
    if (caratChanceBtn) {
        const el = caratChanceBtn.parentElement.querySelector('.upgrade-cost span');
        el.textContent = window.extraUpgrades.caratChance.cost;
        caratChanceBtn.disabled = window.gameState.money < window.extraUpgrades.caratChance.cost;
    }
    if (caratAmountBtn) {
        const el2 = caratAmountBtn.parentElement.querySelector('.upgrade-cost span');
        el2.textContent = window.extraUpgrades.caratAmount.cost;
        caratAmountBtn.disabled = window.gameState.money < window.extraUpgrades.caratAmount.cost;
    }
};

// apply subtle entrance animation for upgrade items
document.addEventListener('DOMContentLoaded', function() {
    const upgradeItems = document.querySelectorAll('.upgrade-item');
    upgradeItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.style.animation = 'fadeInUp 0.5s ease forwards';
    });
});
