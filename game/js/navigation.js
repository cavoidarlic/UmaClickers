// navigation.js - handles tab switching in the menu zone

window.currentTab = 'upgrades'; // default tab
window.currentSong = 'Go This Way'; // default selected song
window.isPlaying = false;
window.currentAudio = null;
window.currentlyPlayingSong = null; // track which song is actually playing

// Song data
window.songData = {
    'GIRLS LEGEND U': {
        file: 'assets/sounds/Jukebox/GIRLS LEGEND U.mp3',
        cover: 'assets/images/jukebox/GIRLS LEGEND U.png',
        composer: 'Akihiro Honda (Cygames)',
        arrangement: 'Kenta Higashiohji',
        description: 'An epic anthem celebrating the legendary Uma Musume who paved the way for future generations.'
    },
    'Go This Way': {
        file: 'assets/sounds/Jukebox/Go This Way.mp3',
        cover: 'assets/images/jukebox/Go This Way.jpg',
        composer: 'Heart\'s Cry',
        arrangement: 'Heart\'s Cry',
        description: 'This song is about the dreams we have, and the resolve it takes to keep running toward them. It\'s about moving forward, even when you\'re lost or scared. If you ever lose your way, we\'re here to tell you, "Go this way."'
    },
    'Irodori Phantasia': {
        file: 'assets/sounds/Jukebox/Irodori Phantasia.mp3',
        cover: 'assets/images/jukebox/Irodori Phantasia.webp',
        composer: 'Akihiro Honda (Cygames)',
        arrangement: 'Masanori Akita (INSPION)',
        description: 'A colorful fantasy of dreams and aspirations, painting the track with vibrant melodies.'
    },
    'Make debut!': {
        file: 'assets/sounds/Jukebox/Make Debut.mp3',
        cover: 'assets/images/jukebox/Make debut!.jpg',
        composer: 'Shun Aratame',
        arrangement: 'Shun Aratame and Yuya Hirosawa',
        description: 'The excitement and anticipation of making your first appearance on the racing stage.'
    },
    'NEXT FRONTIER': {
        file: 'assets/sounds/Jukebox/NEXT FRONTIER.mp3',
        cover: 'assets/images/jukebox/NEXT FRONTIER.png',
        composer: 'Akihiko Yamaguchi',
        arrangement: 'Akihiko Yamaguchi',
        description: 'Breaking through barriers and exploring new possibilities beyond the horizon.'
    },
    'Our Blue Bird Days': {
        file: 'assets/sounds/Jukebox/Our Blue Bird Days.mp3',
        cover: 'assets/images/jukebox/Our Blue Bird Days.png',
        composer: 'Cygames (corochi)',
        arrangement: 'Ryota Fujii and Kotaro Odaka',
        description: 'Nostalgic memories of peaceful days filled with hope and gentle melodies.'
    },
    'Umapyoi Densetsu': {
        file: 'assets/sounds/Jukebox/Umapyoi Densetsu.mp3',
        cover: 'assets/images/jukebox/Umapyoi Densetsu.webp',
        composer: 'Akihiro Honda (Cygames)',
        arrangement: 'Akihiro Honda (Cygames)',
        description: 'The legendary tale of Uma Musume, celebrating their spirit and determination.'
    },
    'Bakushin Bakushin Bakushinshin': {
        file: 'assets/sounds/Jukebox/Bakushin Bakushin Bakushinshin.mp3',
        cover: 'assets/images/jukebox/BakushinBakushinBakushinshin.png',
        composer: 'Cygames',
        arrangement: 'Cygames',
        description: 'An energetic and catchy tune that embodies the spirit of racing forward with unstoppable momentum.'
    }
};

window.selectSong = function(songName) {
    window.currentSong = songName;
    
    // Update the jukebox display if currently on jukebox tab
    if (window.currentTab === 'jukebox') {
        const contentSection = document.querySelector('.upgrade-section');
        contentSection.innerHTML = getTabContent('jukebox');
    }
};

window.togglePlayback = function() {
    const song = window.songData[window.currentSong];
    if (!song) return;
    // If something is playing
    if (window.isPlaying) {
        // If the currently playing song is the same as the selected one -> stop
        if (window.currentlyPlayingSong === window.currentSong) {
            if (window.currentAudio) {
                window.currentAudio.pause();
                window.currentAudio = null;
            }
            window.isPlaying = false;
            window.currentlyPlayingSong = null;
        } else {
            // Different song is selected while another is playing -> stop the current playback
            // (do not auto-start the newly selected song)
            if (window.currentAudio) {
                window.currentAudio.pause();
                window.currentAudio = null;
            }
            window.isPlaying = false;
            window.currentlyPlayingSong = null;
        }
    } else {
        // Nothing is playing -> start the selected song
        window.currentAudio = new Audio(song.file);
        window.currentAudio.play().catch(error => {
            console.error('Error playing audio:', error);
            alert('Error playing audio. Please check if the audio file exists.');
            return;
        });
        window.isPlaying = true;
        window.currentlyPlayingSong = window.currentSong;

        // Reset when song ends
        window.currentAudio.addEventListener('ended', function() {
            window.isPlaying = false;
            window.currentlyPlayingSong = null;
            if (window.currentTab === 'jukebox') {
                const contentSection = document.querySelector('.upgrade-section');
                contentSection.innerHTML = getTabContent('jukebox');
            }
        });
    }
    
    // Update the play button
    if (window.currentTab === 'jukebox') {
        const contentSection = document.querySelector('.upgrade-section');
        contentSection.innerHTML = getTabContent('jukebox');
    }
};

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
            const currentSongData = window.songData[window.currentSong];
            const playButtonClass = window.isPlaying ? 'stop-button' : 'play-button';
            const playButtonIcon = window.isPlaying ? '⏹' : '▶';
            
            return `
                <div class="jukebox-content">
                    <div class="current-song-info">
                        <div class="song-cover-container">
                            <img src="${currentSongData.cover}" alt="${window.currentSong}" class="current-song-cover">
                        </div>
                        <div class="song-details">
                            <h3 class="song-title">${window.currentSong}</h3>
                            <div class="song-credits">
                                <div class="credit-line">Composer: ${currentSongData.composer}</div>
                                <div class="credit-line">Arrangement: ${currentSongData.arrangement}</div>
                            </div>
                            <div class="song-description">${currentSongData.description}</div>
                        </div>
                        <div class="play-button-container">
                            <button class="play-control-btn ${playButtonClass}" onclick="togglePlayback()">
                                ${playButtonIcon}
                            </button>
                        </div>
                    </div>

                    <div class="jukebox-separator-container">
                        <img src="assets/images/seperator thingy.png" alt="separator" class="jukebox-separator">
                    </div>

                    <div class="song-selector">
                        <div class="song-grid">
                            ${Object.keys(window.songData).map((songName, index) => {
                                const isSelected = songName === window.currentSong;
                                const song = window.songData[songName];
                                return `
                                    <div class="song-option ${isSelected ? 'selected' : ''}" onclick="selectSong('${songName}')">
                                        <img src="${song.cover}" alt="${songName}" class="song-cover">
                                        ${isSelected ? '<div class="selection-corners"></div>' : ''}
                                    </div>
                                `;
                            }).join('')}
                        </div>
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
