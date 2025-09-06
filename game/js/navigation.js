window.currentTab = 'upgrades';
window.currentSong = 'Go This Way';
window.isPlaying = false;
window.currentAudio = null;
window.currentlyPlayingSong = null;
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
window.selectSong = function (songName) {
  window.currentSong = songName;
  if (window.currentTab === 'jukebox') {
    const contentSection = document.querySelector('.upgrade-section');
    contentSection.innerHTML = window.getTabContent('jukebox');
  }
};
window.togglePlayback = function () {
  const song = window.songData[window.currentSong];
  if (!song) return;
  if (window.isPlaying) {
    if (window.currentlyPlayingSong === window.currentSong) {
      if (window.currentAudio) {
        window.currentAudio.pause();
        window.currentAudio = null;
      }
      window.isPlaying = false;
      window.currentlyPlayingSong = null;
    } else {
      if (window.currentAudio) {
        window.currentAudio.pause();
        window.currentAudio = null;
      }
      window.isPlaying = false;
      window.currentlyPlayingSong = null;
    }
  } else {
    window.currentAudio = new Audio(song.file);
    window.currentAudio.play().catch(error => {
      console.error('Error playing audio:', error);
      alert('Error playing audio. Please check if the audio file exists.');
      return;
    });
    window.isPlaying = true;
    window.currentlyPlayingSong = window.currentSong;
    window.currentAudio.addEventListener('ended', function () {
      window.isPlaying = false;
      window.currentlyPlayingSong = null;
      if (window.currentTab === 'jukebox') {
        const contentSection = document.querySelector('.upgrade-section');
        contentSection.innerHTML = window.getTabContent('jukebox');
      }
    });
  }
  if (window.currentTab === 'jukebox') {
    const contentSection = document.querySelector('.upgrade-section');
    contentSection.innerHTML = window.getTabContent('jukebox');
  }
};
window.switchTab = function (tabName) {
  const navButtons = document.querySelectorAll('.nav-button');
  navButtons.forEach(button => {
    button.classList.remove('active');
  });
  const clickedButton = Array.from(navButtons).find(button => {
    const text = button.querySelector('.nav-button-text').textContent.toLowerCase();
    return text === tabName.toLowerCase();
  });
  if (clickedButton) {
    clickedButton.classList.add('active');
  }
  const contentArea = document.querySelector('.menu-panel');
  const titleWrapper = contentArea.querySelector('.upgrade-title-wrapper');
  const contentSection = contentArea.querySelector('.upgrade-section');
  if (tabName === 'scout') {
    contentArea.classList.add('scout-bg');
    titleWrapper.style.display = 'none';
  } else {
    contentArea.classList.remove('scout-bg');
    titleWrapper.style.display = 'flex';
    const titleElement = titleWrapper.querySelector('.upgrade-pill h2');
    titleElement.textContent = getTabTitle(tabName);
  }
  contentSection.innerHTML = window.getTabContent(tabName);
  if (tabName === 'upgrades' && window.updateUpgradeButtons) {
    window.updateUpgradeButtons();
  }
  window.currentTab = tabName;
  console.log(`Switched to tab: ${tabName}`);
};
function getTabTitle(tabName) {
  const titles = {
    'jukebox': 'Jukebox',
    'upgrades': 'Upgrades',
    'scout': 'Scout',
    'races': 'Races',
    'inventory': 'Inventory',
    'stats': 'Stats',
    'menu': 'Menu'
  };
  return titles[tabName] || 'Unknown';
}
window.getTabContent = function (tabName) {
  switch (tabName) {
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
                    <h3><img src="assets/images/icons/power.png" alt="Power" class="upgrade-icon"> Power</h3>
                    <p>Increases money earned per click</p>
                    <div class="upgrade-level">Level ${window.gameState.upgrades.power.level} → ${window.getStatValue('power')} money per click</div>
                    <div class="upgrade-cost">
                        <img src="assets/images/items/Monies.png" alt="Money" class="cost-icon">
                        <span>${window.gameState.upgrades.power.cost}</span>
                    </div>
                    <button class="upgrade-btn" onclick="buyUpgrade('power')">Buy</button>
                </div>
                
                <div class="upgrade-item">
                    <h3><img src="assets/images/icons/speed.png" alt="Speed" class="upgrade-icon"> Speed</h3>
                    <p>Generates passive money over time</p>
                    <div class="upgrade-level">Level ${window.gameState.upgrades.speed.level} → ${window.getStatValue('speed')} money/sec</div>
                    <div class="upgrade-cost">
                        <img src="assets/images/items/Monies.png" alt="Money" class="cost-icon">
                        <span>${window.gameState.upgrades.speed.cost}</span>
                    </div>
                    <button class="upgrade-btn" onclick="buyUpgrade('speed')">Buy</button>
                </div>
                
                <div class="upgrade-item">
                    <h3><img src="assets/images/icons/stamina.png" alt="Stamina" class="upgrade-icon"> Stamina</h3>
                    <p>Improves auto-click efficiency and speed</p>
                    <div class="upgrade-level">Level ${window.gameState.upgrades.stamina.level} → ${window.getStatValue('stamina')} clicks/sec</div>
                    <div class="upgrade-cost">
                        <img src="assets/images/items/Monies.png" alt="Money" class="cost-icon">
                        <span>${window.gameState.upgrades.stamina.cost}</span>
                    </div>
                    <button class="upgrade-btn" onclick="buyUpgrade('stamina')">Buy</button>
                </div>
                
                <div class="upgrade-item">
                    <h3><img src="assets/images/icons/guts.png" alt="Guts" class="upgrade-icon"> Guts</h3>
                    <p>Increases chance of critical clicks (3x money + guaranteed carat)</p>
                    <div class="upgrade-level">Level ${window.gameState.upgrades.guts.level} → ${window.getStatValue('guts')} crit chance</div>
                    <div class="upgrade-cost">
                        <img src="assets/images/items/Monies.png" alt="Money" class="cost-icon">
                        <span>${window.gameState.upgrades.guts.cost}</span>
                    </div>
                    <button class="upgrade-btn" onclick="buyUpgrade('guts')">Buy</button>
                </div>

                <div class="upgrade-item">
                    <h3><img src="assets/images/icons/wit.png" alt="Wit" class="upgrade-icon"> Wit</h3>
                    <p>Increases chance of finding valuable carats</p>
                    <div class="upgrade-level">Level ${window.gameState.upgrades.wit.level} → ${window.getStatValue('wit')} carat chance</div>
                    <div class="upgrade-cost">
                        <img src="assets/images/items/Monies.png" alt="Money" class="cost-icon">
                        <span>${window.gameState.upgrades.wit.cost}</span>
                    </div>
                    <button class="upgrade-btn" onclick="buyUpgrade('wit')">Buy</button>
                </div>
            `;
    case 'scout':
      return `
                <div class="scout-content">
                    <div class="scout-banner-container">
                        <img src="assets/images/scouting/bannerbox.png" alt="Scout Banner" class="scout-banner-img">
                    </div>
                    <div class="scout-buttons-bottom">
                        <div class="scout-option">
                            <img src="assets/images/scouting/1x.png" alt="1x Scout" class="scout-img-btn" onclick="performScout(1)">
                        </div>
                        <div class="scout-option">
                            <img src="assets/images/scouting/10x.png" alt="10x Scout" class="scout-img-btn" onclick="performScout(10)">
                        </div>
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
    case 'inventory':
      return `
                <div class="tab-content">
                    <h3>🎒 Inventory</h3>
                    <p>Manage your Uma Musume collection. Equip up to 4 Uma to assist you!</p>
                    <div class="placeholder-content">
                        <button class="upgrade-btn" disabled>View Collection</button>
                        <button class="upgrade-btn" disabled>Equip Uma (0/4)</button>
                        <button class="upgrade-btn" disabled>Sort by Rarity</button>
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
};
window.addEventListener('load', function () {
  console.log('Navigation system loaded');
});
window.performScout = function (count) {
  const costPer = 150;
  const totalCost = count * costPer;
  if (window.gameState.carats < totalCost) {
    alert(`Not enough Carats! You need ${totalCost} Carats but only have ${window.gameState.carats}.`);
    return;
  }
  alert(`Would perform ${count}x Scout for ${totalCost} Carats${count === 10 ? ' (1 SR+ Guaranteed!)' : ''}`);
};