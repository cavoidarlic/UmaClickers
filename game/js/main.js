// main.js - initializes game on load

window.addEventListener('load', function() {
    // Check if character selection is needed (for debug, always show)
    window.checkCharacterSelection();

    // load state first so other modules see it
    window.loadGameState();
    window.startBackgroundAutoUpdate();
    window.updateDisplay();
    window.startAutoClicker();
    window.startPassiveIncome(); // Start passive income from Speed stat
    window.updateUpgradeButtons();

    // Immediately render upgrades section to match save state
    try {
        const contentSection = document.querySelector('.upgrade-section');
        if (contentSection && window.getTabContent) {
            contentSection.innerHTML = window.getTabContent('upgrades');
        }
    } catch (err) {
        console.warn('Could not render upgrades section on load:', err);
    }

    // Disable right-click context menu inside the game
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    // Make images non-draggable to avoid accidental dragging when clicking quickly
    document.querySelectorAll('img').forEach(img => img.setAttribute('draggable', 'false'));
    document.addEventListener('dragstart', function(e) {
        if (e.target && e.target.tagName === 'IMG') e.preventDefault();
    });

    // Prevent text/image selection and double-click highlighting globally,
    // but allow selection inside form inputs, textareas, and contentEditable elements.
    document.addEventListener('selectstart', function(e) {
        const tag = e.target && e.target.tagName;
        const isEditable = e.target && (e.target.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA');
        if (!isEditable) e.preventDefault();
    });

    document.addEventListener('dblclick', function(e) {
        const tag = e.target && e.target.tagName;
        const isEditable = e.target && (e.target.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA');
        if (!isEditable) e.preventDefault();
    });

    // Background music: attempt autoplay at 10% volume and loop. If autoplay is blocked,
    // start playback on the first user gesture (pointerdown/keydown).
    (function setupBackgroundMusic(){
        try {
            if (!window.bgAudio) {
                window.bgAudio = new Audio('assets/sounds/bgm.mp3');
                window.bgAudio.loop = true;
                window.bgAudio.volume = 0.05; // 5% volume
                window.bgAudio.preload = 'auto';
            }

            const playBg = () => {
                if (!window.bgAudio) return;
                const p = window.bgAudio.play();
                if (p && p.catch) {
                    p.catch(() => { /* ignore autoplay rejection here; gesture fallback will handle */ });
                }
            };

            // Try to autoplay now
            playBg();

            // If autoplay blocked, start on first user gesture
            const gestureStart = () => {
                playBg();
                window.removeEventListener('pointerdown', gestureStart);
                window.removeEventListener('keydown', gestureStart);
            };

            window.addEventListener('pointerdown', gestureStart, { once: true });
            window.addEventListener('keydown', gestureStart, { once: true });
        } catch (err) {
            console.error('Failed to setup background music:', err);
        }
    })();
});

// small deprecation notice if old core.js still present
console.log('Game modules loaded. core.js is deprecated and split into modules.');
