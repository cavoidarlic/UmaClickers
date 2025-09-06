window.addEventListener('load', function () {
  window.checkCharacterSelection();
  window.loadGameState();
  window.startBackgroundAutoUpdate();
  window.updateDisplay();
  window.startAutoClicker();
  window.startPassiveIncome();
  window.updateUpgradeButtons();
  try {
    const contentSection = document.querySelector('.upgrade-section');
    if (contentSection && window.getTabContent) {
      contentSection.innerHTML = window.getTabContent('upgrades');
      window.updateUpgradeButtons();
    }
  } catch (err) {
    console.warn('Could not render upgrades section on load:', err);
  }
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });
  document.querySelectorAll('img').forEach(img => img.setAttribute('draggable', 'false'));
  document.addEventListener('dragstart', function (e) {
    if (e.target && e.target.tagName === 'IMG') e.preventDefault();
  });
  document.addEventListener('selectstart', function (e) {
    const tag = e.target && e.target.tagName;
    const isEditable = e.target && (e.target.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA');
    if (!isEditable) e.preventDefault();
  });
  document.addEventListener('dblclick', function (e) {
    const tag = e.target && e.target.tagName;
    const isEditable = e.target && (e.target.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA');
    if (!isEditable) e.preventDefault();
  });
  (function setupBackgroundMusic() {
    try {
      if (!window.bgAudio) {
        window.bgAudio = new Audio('assets/sounds/bgm.mp3');
        window.bgAudio.loop = true;
        window.bgAudio.volume = 0.05;
        window.bgAudio.preload = 'auto';
      }
      const playBg = () => {
        if (!window.bgAudio) return;
        const p = window.bgAudio.play();
        if (p && p.catch) {
          p.catch(() => {});
        }
      };
      playBg();
      const gestureStart = () => {
        playBg();
        window.removeEventListener('pointerdown', gestureStart);
        window.removeEventListener('keydown', gestureStart);
      };
      window.addEventListener('pointerdown', gestureStart, {
        once: true
      });
      window.addEventListener('keydown', gestureStart, {
        once: true
      });
    } catch (err) {
      console.error('Failed to setup background music:', err);
    }
  })();
});
console.log('Game modules loaded. core.js is deprecated and split into modules.');