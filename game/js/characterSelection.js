// characterSelection.js - handles character selection modal and logic

window.showCharacterSelection = function() {
    const modal = document.getElementById('characterSelectionModal');
    if (modal) {
        modal.style.display = 'flex';
    }
};

window.hideCharacterSelection = function() {
    const modal = document.getElementById('characterSelectionModal');
    if (modal) {
        modal.style.display = 'none';
    }
};

window.selectCharacter = function(characterId) {
    let selectedChar = characterId;
    
    // Handle random selection
    if (characterId === 'random') {
        const characters = Object.keys(window.characterData);
        selectedChar = characters[Math.floor(Math.random() * characters.length)];
    }
    
    // Update game state
    window.gameState.selectedCharacter = selectedChar;
    
    // Update character sprite in game
    const characterElement = document.getElementById('haruUrara');
    if (characterElement && window.characterData[selectedChar]) {
        characterElement.src = window.characterData[selectedChar].defaultSprite;
        characterElement.alt = window.characterData[selectedChar].name;
    }
    
    // Hide the modal
    window.hideCharacterSelection();
    
    console.log(`Selected character: ${window.characterData[selectedChar].name}`);
};

// Check if character selection is needed on page load
window.checkCharacterSelection = function() {
    // For debug mode, always show character selection (don't save selection)
    window.showCharacterSelection();
};
