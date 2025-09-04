// upgrades/ui.js - connects DOM buttons to upgrade logic and updates costs/disabled states

window.buyUpgrade = function(upgradeType) {
    console.log('buyUpgrade called with:', upgradeType);
    console.log('Current money:', window.gameState.money);
    console.log('Upgrade cost:', window.gameState.upgrades[upgradeType]?.cost);
    
    const applied = window.applyUpgrade(upgradeType);
    console.log('Upgrade applied:', applied);
    
    if (applied) {
        updateUpgradeButtons();
        // Refresh the upgrades tab to show updated values
        if (window.currentTab === 'upgrades') {
            console.log('Refreshing upgrades tab');
            const contentSection = document.querySelector('.upgrade-section');
            if (contentSection && window.getTabContent) {
                contentSection.innerHTML = window.getTabContent('upgrades');
            } else {
                console.error('Could not find content section or getTabContent function');
            }
        }
    } else {
        console.log('Upgrade not applied - insufficient money or invalid upgrade');
    }
};

window.updateUpgradeButtons = function() {
    // Safety check to ensure upgrades exist
    if (!window.gameState.upgrades) {
        console.warn('Game state upgrades not initialized yet');
        return;
    }
    
    // Update all Uma stat upgrades
    const statTypes = ['power', 'speed', 'stamina', 'guts', 'wit'];
    statTypes.forEach(statType => {
        // Safety check for each upgrade
        if (!window.gameState.upgrades[statType]) {
            console.warn(`Upgrade ${statType} not found in game state`);
            return;
        }
        
        const btn = document.querySelector(`[onclick="buyUpgrade('${statType}')"]`);
        if (btn) {
            const costSpan = btn.parentElement.querySelector('.upgrade-cost span');
            if (costSpan) {
                costSpan.textContent = window.gameState.upgrades[statType].cost;
            }
            btn.disabled = window.gameState.money < window.gameState.upgrades[statType].cost;
        }
    });
};

// apply subtle entrance animation for upgrade items
document.addEventListener('DOMContentLoaded', function() {
    const upgradeItems = document.querySelectorAll('.upgrade-item');
    upgradeItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.style.animation = 'fadeInUp 0.5s ease forwards';
    });
});
