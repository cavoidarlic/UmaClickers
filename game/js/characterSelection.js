window.showCharacterSelection = function () {
  const modal = document.getElementById('characterSelectionModal');
  if (modal) {
    modal.style.display = 'flex';
  }
};
window.hideCharacterSelection = function () {
  const modal = document.getElementById('characterSelectionModal');
  if (modal) {
    modal.style.display = 'none';
  }
};
window.selectCharacter = function (characterId) {
  let selectedChar = characterId;
  if (characterId === 'random') {
    const characters = Object.keys(window.characterData);
    selectedChar = characters[Math.floor(Math.random() * characters.length)];
  }
  window.gameState.selectedCharacter = selectedChar;
  const characterElement = document.getElementById('haruUrara');
  if (characterElement && window.characterData[selectedChar]) {
    characterElement.src = window.characterData[selectedChar].defaultSprite;
    characterElement.alt = window.characterData[selectedChar].name;
  }
  window.hideCharacterSelection();
  console.log(`Selected character: ${window.characterData[selectedChar].name}`);
};
window.checkCharacterSelection = function () {
  window.showCharacterSelection();
};