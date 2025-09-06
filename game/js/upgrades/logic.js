window.applyUpgrade = function (upgradeType) {
  if (window.gameState.upgrades[upgradeType]) {
    const upgrade = window.gameState.upgrades[upgradeType];
    if (window.gameState.money >= upgrade.cost) {
      window.gameState.money -= upgrade.cost;
      upgrade.level++;
      switch (upgradeType) {
        case 'power':
          window.gameState.clickPower = upgrade.baseEffect + upgrade.level;
          break;
        case 'speed':
          break;
        case 'stamina':
          window.gameState.autoClickRate = upgrade.baseEffect + upgrade.level * 0.1;
          window.gameState.autoClickSpeed = Math.max(1000, 5000 - upgrade.level * 200);
          if (window.restartAutoClicker) {
            window.restartAutoClicker();
          }
          break;
        case 'guts':
          window.gameState.criticalChance = upgrade.baseEffect + upgrade.level * 0.02;
          break;
        case 'wit':
          window.gameState.caratChance = upgrade.baseEffect + upgrade.level * 0.03;
          break;
      }
      upgrade.cost = Math.floor(upgrade.cost * upgrade.costMultiplier);
      window.playBuySound();
      window.updateDisplay();
      window.saveGameState();
      return true;
    }
  }
  return false;
};
window.getStatValue = function (statType) {
  const upgrade = window.gameState.upgrades[statType];
  if (!upgrade) return 0;
  switch (statType) {
    case 'power':
      return upgrade.baseEffect + upgrade.level;
    case 'speed':
      return upgrade.level * 0.5;
    case 'stamina':
      return (upgrade.baseEffect + upgrade.level * 0.1).toFixed(1);
    case 'guts':
      return ((upgrade.baseEffect + upgrade.level * 0.02) * 100).toFixed(1) + '%';
    case 'wit':
      return ((upgrade.baseEffect + upgrade.level * 0.03) * 100).toFixed(1) + '%';
    default:
      return upgrade.level;
  }
};