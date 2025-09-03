// game state
window.gameState = {
    money: 0,
    clickPower: 1,
    autoClickRate: 0,
    autoClickSpeed: 1000, // milliseconds
    upgrades: {
        clickPower: {
            cost: 10,
            level: 0,
            costMultiplier: 1.5
        },
        autoClick: {
            cost: 50,
            level: 0,
            costMultiplier: 2
        },
        autoSpeed: {
            cost: 100,
            level: 0,
            costMultiplier: 1.8
        }
    },

    // Carat system
    carats: 0,
    caratChance: 0.05,
    caratAmount: 1,

    // Selected character
    selectedCharacter: null
};

// Character data mapping
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
    }
};

// Extra upgrades object kept separate so it's easier to split later
window.extraUpgrades = {
    caratChance: { cost: 200, level: 0, costMultiplier: 1.9 },
    caratAmount: { cost: 300, level: 0, costMultiplier: 2.2 }
};

// persistence helpers
window.saveGameState = function() {
    localStorage.setItem('umaClickerSave', JSON.stringify(window.gameState));
};

window.loadGameState = function() {
    const saved = localStorage.getItem('umaClickerSave');
    if (saved) {
        window.gameState = {...window.gameState, ...JSON.parse(saved)};
    }
};
