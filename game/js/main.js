// main.js - initializes game on load

window.addEventListener('load', function() {
    // Check if character selection is needed (for debug, always show)
    window.checkCharacterSelection();
    
    // load state first so other modules see it
    window.loadGameState();
    window.startBackgroundAutoUpdate();
    window.updateDisplay();
    window.startAutoClicker();
    window.updateUpgradeButtons();

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
});

// small deprecation notice if old core.js still present
console.log('Game modules loaded. core.js is deprecated and split into modules.');
