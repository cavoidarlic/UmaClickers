window.gameState = {
  money: 0,
  clickPower: 1,
  autoClickRate: 0.2,
  autoClickSpeed: 5000,
  criticalChance: 0.05,
  criticalMultiplier: 3,
  upgrades: {
    power: {
      cost: 5,
      level: 0,
      costMultiplier: 1.6,
      baseEffect: 1
    },
    speed: {
      cost: 10,
      level: 0,
      costMultiplier: 1.5,
      baseEffect: 0
    },
    stamina: {
      cost: 20,
      level: 0,
      costMultiplier: 1.8,
      baseEffect: 0.2
    },
    guts: {
      cost: 30,
      level: 0,
      costMultiplier: 2.0,
      baseEffect: 0.05
    },
    wit: {
      cost: 50,
      level: 0,
      costMultiplier: 1.9,
      baseEffect: 0.05
    }
  },
  carats: 0,
  caratChance: 0.05,
  caratAmount: 1,
  selectedCharacter: null
};
window.characterData = {
  agnes: {
    name: 'Agnes Tachyon',
    defaultSprite: 'assets/images/characters/default/AgnesTachyonChibi1.webp',
    clickedSprite: 'assets/images/characters/default2/Agnes_Tachyon_Chibi1-2.webp'
  },
  haru: {
    name: 'Haru Urara',
    defaultSprite: 'assets/images/characters/default/HaruUraraChibi1.webp',
    clickedSprite: 'assets/images/characters/default2/Haru_Urara_Chibi1-2.webp'
  },
  king: {
    name: 'King Halo',
    defaultSprite: 'assets/images/characters/default/KingHaloChibi1.webp',
    clickedSprite: 'assets/images/characters/default2/King_Halo_Chibi1-2.webp'
  },
  matikane: {
    name: 'Matikanefukukitaru',
    defaultSprite: 'assets/images/characters/default/MatikanefukukitaruChibi1.webp',
    clickedSprite: 'assets/images/characters/default2/Matikanefukukitaru_Chibi1-2.webp'
  },
  mejiro: {
    name: 'Mejiro Ryan',
    defaultSprite: 'assets/images/characters/default/MejiroRyanChibi1.webp',
    clickedSprite: 'assets/images/characters/default2/Mejiro_Ryan_Chibi1-2.webp'
  },
  nice: {
    name: 'Nice Nature',
    defaultSprite: 'assets/images/characters/default/NiceNatureChibi1.webp',
    clickedSprite: 'assets/images/characters/default2/Nice_Nature_Chibi1-2.webp'
  },
  sakura: {
    name: 'Sakura Bakushin O',
    defaultSprite: 'assets/images/characters/default/SakuraBakushinOChibi1.webp',
    clickedSprite: 'assets/images/characters/default2/Sakura_Bakushin_O_Chibi1-2.webp'
  },
  twin: {
    name: 'Twin Turbo',
    defaultSprite: 'assets/images/characters/default/Twin_Turbo_Chibi1.webp',
    clickedSprite: 'assets/images/characters/default2/Twin_Turbo_Chibi1-2.webp'
  },
  winning: {
    name: 'Winning Ticket',
    defaultSprite: 'assets/images/characters/default/WinningTicketChibi1.webp',
    clickedSprite: 'assets/images/characters/default2/Winning_Ticket_Chibi1-2.webp'
  },
  goldship: {
    name: 'Gold Ship',
    defaultSprite: 'assets/images/characters/default/GoldShipChibi1.webp',
    clickedSprite: 'assets/images/characters/default2/Gold_Ship_Chibi1-2.webp'
  }
};
window.extraUpgrades = {};
window.buySounds = ['assets/sounds/Buy/buy1.mp3', 'assets/sounds/Buy/buy2.mp3', 'assets/sounds/Buy/buy3.mp3'];
window.playBuySound = function () {
  try {
    const randomSound = window.buySounds[Math.floor(Math.random() * window.buySounds.length)];
    const audio = new Audio(randomSound);
    audio.volume = 0.8;
    audio.play().catch(() => {});
  } catch (err) {
    console.warn('Buy sound failed:', err);
  }
};
window.saveGameState = function () {
  localStorage.setItem('umaClickerSave', JSON.stringify(window.gameState));
};
window.loadGameState = function () {
  const saved = localStorage.getItem('umaClickerSave');
  if (saved) {
    const parsedSave = JSON.parse(saved);
    if (parsedSave.upgrades && parsedSave.upgrades.clickPower) {
      console.log('Migrating old save format to new Uma stats system');
      localStorage.removeItem('umaClickerSave');
      return;
    }
    window.gameState = {
      ...window.gameState,
      ...parsedSave
    };
    const defaultUpgrades = {
      power: {
        cost: 5,
        level: 0,
        costMultiplier: 1.6,
        baseEffect: 1
      },
      speed: {
        cost: 10,
        level: 0,
        costMultiplier: 1.5,
        baseEffect: 0
      },
      stamina: {
        cost: 20,
        level: 0,
        costMultiplier: 1.8,
        baseEffect: 0.2
      },
      guts: {
        cost: 30,
        level: 0,
        costMultiplier: 2.0,
        baseEffect: 0.05
      },
      wit: {
        cost: 50,
        level: 0,
        costMultiplier: 1.9,
        baseEffect: 0.05
      }
    };
    if (!window.gameState.upgrades) {
      window.gameState.upgrades = defaultUpgrades;
    } else {
      Object.keys(defaultUpgrades).forEach(statType => {
        if (!window.gameState.upgrades[statType]) {
          window.gameState.upgrades[statType] = defaultUpgrades[statType];
        } else {
          window.gameState.upgrades[statType] = {
            ...defaultUpgrades[statType],
            ...window.gameState.upgrades[statType]
          };
        }
      });
    }
    window.recalculateStatsFromUpgrades();
  }
};
window.recalculateStatsFromUpgrades = function () {
  if (!window.gameState.upgrades) return;
  if (window.gameState.upgrades.power) {
    const powerUpgrade = window.gameState.upgrades.power;
    window.gameState.clickPower = powerUpgrade.baseEffect + powerUpgrade.level;
  }
  if (window.gameState.upgrades.stamina) {
    const staminaUpgrade = window.gameState.upgrades.stamina;
    window.gameState.autoClickRate = staminaUpgrade.baseEffect + staminaUpgrade.level * 0.1;
    window.gameState.autoClickSpeed = Math.max(1000, 5000 - staminaUpgrade.level * 200);
  }
  if (window.gameState.upgrades.guts) {
    const gutsUpgrade = window.gameState.upgrades.guts;
    window.gameState.criticalChance = gutsUpgrade.baseEffect + gutsUpgrade.level * 0.02;
  }
  if (window.gameState.upgrades.wit) {
    const witUpgrade = window.gameState.upgrades.wit;
    window.gameState.caratChance = witUpgrade.baseEffect + witUpgrade.level * 0.03;
  }
  console.log('Stats recalculated from upgrade levels');
};