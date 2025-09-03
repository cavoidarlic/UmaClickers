// navigation.js - handles tab switching in the menu zone

window.currentTab = 'upgrades'; // default tab

window.switchTab = function(tabName) {
    // Update active state for navigation buttons
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Find and activate the clicked button
    const clickedButton = Array.from(navButtons).find(button => {
        const text = button.querySelector('.nav-button-text').textContent.toLowerCase();
        return text === tabName.toLowerCase();
    });
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
    
    // Update the content area
    const contentArea = document.querySelector('.upgrade-panel');
    const titleWrapper = contentArea.querySelector('.upgrade-title-wrapper');
    const contentSection = contentArea.querySelector('.upgrade-section');
    
    // Update the title
    const titleElement = titleWrapper.querySelector('.upgrade-pill h2');
    titleElement.textContent = getTabTitle(tabName);
    
    // Update the content
    contentSection.innerHTML = getTabContent(tabName);
    
    // Store current tab
    window.currentTab = tabName;
    
    console.log(`Switched to tab: ${tabName}`);
};

function getTabTitle(tabName) {
    const titles = {
        'jukebox': 'Jukebox',
        'upgrades': 'Upgrades',
        'store': 'Store',
        'races': 'Races',
        'logs': 'Logs',
        'stats': 'Stats',
        'menu': 'Menu'
    };
    return titles[tabName] || 'Unknown';
}

function getTabContent(tabName) {
    switch(tabName) {
        case 'jukebox':
            return `
                <div class="tab-content">
                    <h3>🎵 Music Player</h3>
                    <p>Coming soon! Listen to your favorite Uma Musume tracks.</p>
                    <div class="placeholder-content">
                        <button class="upgrade-btn" disabled>Play Music</button>
                        <button class="upgrade-btn" disabled>Sound Effects</button>
                        <button class="upgrade-btn" disabled>Volume Settings</button>
                    </div>
                </div>
            `;
        
        case 'upgrades':
            return `
                <div class="upgrade-item">
                    <h3>Training Boost</h3>
                    <p>Increase money per click</p>
                    <div class="upgrade-cost">
                        <img src="assets/images/items/Monies.png" alt="Money" class="cost-icon">
                        <span>${window.gameState.upgrades.clickPower.cost}</span>
                    </div>
                    <button class="upgrade-btn" onclick="buyUpgrade('clickPower')">Buy</button>
                </div>
                
                <div class="upgrade-item">
                    <h3>Auto Training</h3>
                    <p>Gain money automatically</p>
                    <div class="upgrade-cost">
                        <img src="assets/images/items/Monies.png" alt="Money" class="cost-icon">
                        <span>${window.gameState.upgrades.autoClick.cost}</span>
                    </div>
                    <button class="upgrade-btn" onclick="buyUpgrade('autoClick')">Buy</button>
                </div>
                
                <div class="upgrade-item">
                    <h3>Speed Training</h3>
                    <p>Faster auto money generation</p>
                    <div class="upgrade-cost">
                        <img src="assets/images/items/Monies.png" alt="Money" class="cost-icon">
                        <span>${window.gameState.upgrades.autoSpeed.cost}</span>
                    </div>
                    <button class="upgrade-btn" onclick="buyUpgrade('autoSpeed')">Buy</button>
                </div>
                
                <div class="upgrade-item">
                    <h3>Carat Chance</h3>
                    <p>Increase chance to drop carats on click</p>
                    <div class="upgrade-cost">
                        <img src="assets/images/items/Monies.png" alt="Money" class="cost-icon">
                        <span>${window.extraUpgrades.caratChance.cost}</span>
                    </div>
                    <button class="upgrade-btn" onclick="buyUpgrade('caratChance')">Buy</button>
                </div>

                <div class="upgrade-item">
                    <h3>Carat Amount</h3>
                    <p>Increase amount of carats spawned when dropped</p>
                    <div class="upgrade-cost">
                        <img src="assets/images/items/Monies.png" alt="Money" class="cost-icon">
                        <span>${window.extraUpgrades.caratAmount.cost}</span>
                    </div>
                    <button class="upgrade-btn" onclick="buyUpgrade('caratAmount')">Buy</button>
                </div>
            `;
        
        case 'store':
            return `
                <div class="tab-content">
                    <h3>🛒 Item Store</h3>
                    <p>Purchase special items and boosts for your Uma Musume!</p>
                    <div class="placeholder-content">
                        <button class="upgrade-btn" disabled>Energy Drinks</button>
                        <button class="upgrade-btn" disabled>Training Equipment</button>
                        <button class="upgrade-btn" disabled>Special Outfits</button>
                    </div>
                </div>
            `;
        
        case 'races':
            return `
                <div class="tab-content">
                    <h3>🏆 Race Management</h3>
                    <p>Enter races and compete for prizes!</p>
                    <div class="placeholder-content">
                        <button class="upgrade-btn" disabled>Enter Race</button>
                        <button class="upgrade-btn" disabled>View Results</button>
                        <button class="upgrade-btn" disabled>Race Schedule</button>
                    </div>
                </div>
            `;
        
        case 'logs':
            return `
                <div class="tab-content">
                    <h3>📝 Activity Logs</h3>
                    <p>View your training history and achievements.</p>
                    <div class="placeholder-content">
                        <button class="upgrade-btn" disabled>Training Log</button>
                        <button class="upgrade-btn" disabled>Achievement Log</button>
                        <button class="upgrade-btn" disabled>Race History</button>
                    </div>
                </div>
            `;
        
        case 'stats':
            return `
                <div class="tab-content">
                    <h3>📊 Statistics</h3>
                    <p>View detailed statistics about your gameplay.</p>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <strong>Total Money Earned:</strong> ${Math.floor(window.gameState.money)}
                        </div>
                        <div class="stat-item">
                            <strong>Total Carats:</strong> ${Math.floor(window.gameState.carats)}
                        </div>
                        <div class="stat-item">
                            <strong>Click Power:</strong> ${window.gameState.clickPower}
                        </div>
                        <div class="stat-item">
                            <strong>Auto Click Rate:</strong> ${window.gameState.autoClickRate}/sec
                        </div>
                        <div class="stat-item">
                            <strong>Selected Uma:</strong> ${window.gameState.selectedCharacter ? window.characterData[window.gameState.selectedCharacter].name : 'None'}
                        </div>
                    </div>
                </div>
            `;
        
        case 'menu':
            return `
                <div class="tab-content">
                    <h3>☰ Game Menu</h3>
                    <p>Game settings and options.</p>
                    <div class="placeholder-content">
                        <button class="upgrade-btn" onclick="window.checkCharacterSelection()">Change Character</button>
                        <button class="upgrade-btn" disabled>Save Game</button>
                        <button class="upgrade-btn" disabled>Settings</button>
                        <button class="upgrade-btn" disabled>About</button>
                    </div>
                </div>
            `;
        
        default:
            return `<div class="tab-content"><h3>Coming Soon</h3><p>This tab is under development.</p></div>`;
    }
}

// Update upgrade buttons after tab switches to upgrades
window.addEventListener('load', function() {
    // Re-update upgrade buttons when switching back to upgrades tab
    const originalUpdateUpgradeButtons = window.updateUpgradeButtons;
    window.updateUpgradeButtons = function() {
        if (window.currentTab === 'upgrades') {
            originalUpdateUpgradeButtons();
        }
    };
});
