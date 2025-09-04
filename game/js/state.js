// game state
window.gameState = {
    money: 0, // Back to 0 starting money
    clickPower: 1,
    autoClickRate: 0.2, // 1 auto click per 5 seconds (0.2 per second)
    autoClickSpeed: 5000, // milliseconds between auto clicks
    criticalChance: 0.05, // 5% chance for critical click
    criticalMultiplier: 3, // 3x money on critical
    
    // Uma Stats System
    upgrades: {
        power: {
            cost: 5, // Lowered for testing
            level: 0,
            costMultiplier: 1.6,
            baseEffect: 1 // base click power
        },
        speed: {
            cost: 10, // Lowered for testing
            level: 0,
            costMultiplier: 1.5,
            baseEffect: 0 // passive money per second
        },
        stamina: {
            cost: 20, // Lowered for testing
            level: 0,
            costMultiplier: 1.8,
            baseEffect: 0.2 // base auto click rate
        },
        guts: {
            cost: 30, // Lowered for testing
            level: 0,
            costMultiplier: 2.0,
            baseEffect: 0.05 // critical chance
        },
        wit: {
            cost: 50, // Lowered for testing
            level: 0,
            costMultiplier: 1.9,
            baseEffect: 0.05 // carat chance
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
    ,
    goldship: {
        name: 'Gold Ship',
        defaultSprite: 'assets/images/characters/default/GoldShipChibi1.webp',
        clickedSprite: 'assets/images/characters/default2/Gold_Ship_Chibi1-2.webp'
    }
};

// Extra upgrades object kept separate so it's easier to split later
window.extraUpgrades = {
    // Removed old carat upgrades - now handled by Wit stat
};

// Buy sound effects pool
window.buySounds = [
    'assets/sounds/Buy/buy1.mp3',
    'assets/sounds/Buy/buy2.mp3',
    'assets/sounds/Buy/buy3.mp3'
];

// Function to play random buy sound
window.playBuySound = function() {
    try {
        const randomSound = window.buySounds[Math.floor(Math.random() * window.buySounds.length)];
        const audio = new Audio(randomSound);
        audio.volume = 0.8;
        audio.play().catch(() => {});
    } catch (err) {
        console.warn('Buy sound failed:', err);
    }
};

// persistence helpers
window.saveGameState = function() {
    localStorage.setItem('umaClickerSave', JSON.stringify(window.gameState));
};

window.loadGameState = function() {
    const saved = localStorage.getItem('umaClickerSave');
    if (saved) {
        const parsedSave = JSON.parse(saved);
        
        // Check if this is an old save format and migrate it
        if (parsedSave.upgrades && parsedSave.upgrades.clickPower) {
            console.log('Migrating old save format to new Uma stats system');
            // Clear the old save and use default state
            localStorage.removeItem('umaClickerSave');
            return;
        }
        
        // Merge with default state to ensure all new properties exist
        window.gameState = {...window.gameState, ...parsedSave};
        
        // Ensure all upgrade properties exist
        const defaultUpgrades = {
            power: { cost: 5, level: 0, costMultiplier: 1.6, baseEffect: 1 },
            speed: { cost: 10, level: 0, costMultiplier: 1.5, baseEffect: 0 },
            stamina: { cost: 20, level: 0, costMultiplier: 1.8, baseEffect: 0.2 },
            guts: { cost: 30, level: 0, costMultiplier: 2.0, baseEffect: 0.05 },
            wit: { cost: 50, level: 0, costMultiplier: 1.9, baseEffect: 0.05 }
        };
        
        // Ensure upgrades exist and have all required properties
        if (!window.gameState.upgrades) {
            window.gameState.upgrades = defaultUpgrades;
        } else {
            // Merge each upgrade with defaults
            Object.keys(defaultUpgrades).forEach(statType => {
                if (!window.gameState.upgrades[statType]) {
                    window.gameState.upgrades[statType] = defaultUpgrades[statType];
                } else {
                    // Ensure all properties exist
                    window.gameState.upgrades[statType] = {
                        ...defaultUpgrades[statType],
                        ...window.gameState.upgrades[statType]
                    };
                }
            });
        }
        
        // Recalculate all stats based on upgrade levels
        window.recalculateStatsFromUpgrades();
    }
};

// Recalculate all game stats based on current upgrade levels
window.recalculateStatsFromUpgrades = function() {
    if (!window.gameState.upgrades) return;
    
    // Recalculate Power
    if (window.gameState.upgrades.power) {
        const powerUpgrade = window.gameState.upgrades.power;
        window.gameState.clickPower = powerUpgrade.baseEffect + powerUpgrade.level;
    }
    
    // Recalculate Stamina effects
    if (window.gameState.upgrades.stamina) {
        const staminaUpgrade = window.gameState.upgrades.stamina;
        window.gameState.autoClickRate = staminaUpgrade.baseEffect + (staminaUpgrade.level * 0.1);
        window.gameState.autoClickSpeed = Math.max(1000, 5000 - (staminaUpgrade.level * 200));
    }
    
    // Recalculate Guts effects
    if (window.gameState.upgrades.guts) {
        const gutsUpgrade = window.gameState.upgrades.guts;
        window.gameState.criticalChance = gutsUpgrade.baseEffect + (gutsUpgrade.level * 0.02);
    }
    
    // Recalculate Wit effects
    if (window.gameState.upgrades.wit) {
        const witUpgrade = window.gameState.upgrades.wit;
        window.gameState.caratChance = witUpgrade.baseEffect + (witUpgrade.level * 0.03);
    }
    
    console.log('Stats recalculated from upgrade levels');
};
