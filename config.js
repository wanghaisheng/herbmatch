export const gameConfig = {
    // Game settings
    boardSize: 6,
    initialTime: 60,
    timeBonus: 10,
    hintCooldown: 10, // Seconds to wait before hint can be used again
    
    // Scoring
    matchScore: {
        3: 100,
        4: 200,
        5: 500,
        6: 1000
    },
    
    // Level progression
    levelTargets: [
        1000,  // Level 1
        2500,  // Level 2
        5000,  // Level 3
        7500,  // Level 4
        10000  // Level 5
    ],
    
    // Herbs with emojis
    herbs: [
        { emoji: "🌿", name: "Mint" },
        { emoji: "🌱", name: "Sprout" },
        { emoji: "🍃", name: "Leaf" },
        { emoji: "☘️", name: "Clover" },
        { emoji: "🍀", name: "Four Leaf Clover" },
        { emoji: "🌵", name: "Cactus" },
        { emoji: "🌴", name: "Palm" },
        { emoji: "🍄", name: "Mushroom" }
    ],
    
    // Battle Pass system
    activeBattlePass: 'detox', // default active battle pass
    xpForGameCompletion: 50,   // XP earned for completing a game
    xpForLevelUp: 20,          // XP earned for leveling up in the game
    xpForMatch: 5,             // XP earned per match made
    
    // Level system
    xpForLevelCompletion: 30, // Base XP for completing a level (multiplied by stars earned)
    
    // Predefined levels (first 10 levels as examples, rest will be dynamically generated)
    levels: [
        {
            level: 1,
            targetScore: 1000,
            timeLimit: 60,
            moveLimit: null,
            objectives: ['score'],
            specialObjectives: {}
        },
        {
            level: 2,
            targetScore: 1500,
            timeLimit: 60,
            moveLimit: null,
            objectives: ['score'],
            specialObjectives: {}
        },
        {
            level: 3,
            targetScore: 2000,
            timeLimit: 55,
            moveLimit: null,
            objectives: ['score'],
            specialObjectives: {}
        },
        {
            level: 4,
            targetScore: 2500,
            timeLimit: 55,
            moveLimit: null,
            objectives: ['score'],
            specialObjectives: {}
        },
        {
            level: 5,
            targetScore: 3000,
            timeLimit: 60, // Recovery level - slightly easier
            moveLimit: null,
            objectives: ['score'],
            specialObjectives: {}
        },
        {
            level: 6,
            targetScore: 3500,
            timeLimit: 50,
            moveLimit: null,
            objectives: ['score'],
            specialObjectives: {}
        },
        {
            level: 7,
            targetScore: 4000,
            timeLimit: 50,
            moveLimit: null,
            objectives: ['score'],
            specialObjectives: {}
        },
        {
            level: 8,
            targetScore: 4500,
            timeLimit: 45,
            moveLimit: null,
            objectives: ['score'],
            specialObjectives: {}
        },
        {
            level: 9,
            targetScore: 5000,
            timeLimit: 45,
            moveLimit: null,
            objectives: ['score'],
            specialObjectives: {}
        },
        {
            level: 10,
            targetScore: 5500,
            timeLimit: 50, // Recovery level - slightly easier
            moveLimit: null,
            objectives: ['score', 'collection'],
            specialObjectives: {
                collection: {
                    herb: { emoji: "🌿", name: "Mint" },
                    amount: 8,
                    collected: 0
                }
            }
        }
    ],
    
    // Battle Pass themes
    battlePasses: {
        // Detoxification theme
        detox: {
            title: "Detoxification Herbs",
            description: "Discover herbs that help cleanse and detoxify your body",
            maxLevel: 30,
            xpPerLevel: 100,
            premiumPrice: 4.99,
            rewards: [
                { id: "detox_1", level: 1, name: "Dandelion", icon: "🌼", description: "Supports liver detoxification", premium: false },
                { id: "detox_2", level: 3, name: "Milk Thistle", icon: "🌱", description: "Protects liver cells from toxins", premium: false },
                { id: "detox_3", level: 5, name: "Burdock Root", icon: "🌿", description: "Purifies blood and lymphatic system", premium: false },
                { id: "detox_4", level: 7, name: "Cilantro", icon: "🌿", description: "Helps remove heavy metals", premium: false },
                { id: "detox_5", level: 10, name: "Turmeric", icon: "🟡", description: "Potent anti-inflammatory and antioxidant", premium: true },
                { id: "detox_6", level: 13, name: "Ginger", icon: "🫚", description: "Stimulates digestion and circulation", premium: false },
                { id: "detox_7", level: 16, name: "Nettle", icon: "🌿", description: "Natural diuretic that supports kidneys", premium: false },
                { id: "detox_8", level: 20, name: "Red Clover", icon: "🌸", description: "Supports liver and enhances circulation", premium: true },
                { id: "detox_9", level: 25, name: "Parsley", icon: "🌿", description: "Natural diuretic rich in antioxidants", premium: false },
                { id: "detox_10", level: 30, name: "Chlorella", icon: "🟢", description: "Powerful detoxifier and nutrient source", premium: true }
            ]
        },
        
        // Anti-Humidity theme
        antiHumidity: {
            title: "Anti-Humidity Herbs",
            description: "Herbs that help combat dampness in the body",
            maxLevel: 30,
            xpPerLevel: 100,
            premiumPrice: 4.99,
            rewards: [
                { id: "humidity_1", level: 1, name: "White Atractylodes", icon: "🌾", description: "Dries dampness and strengthens the spleen", premium: false },
                { id: "humidity_2", level: 3, name: "Coix Seed", icon: "🌰", description: "Removes dampness and promotes water metabolism", premium: false },
                { id: "humidity_3", level: 5, name: "Poria", icon: "🍄", description: "Drains dampness and calms the mind", premium: false },
                { id: "humidity_4", level: 7, name: "Magnolia Bark", icon: "🌿", description: "Resolves dampness and improves digestion", premium: false },
                { id: "humidity_5", level: 10, name: "Agastache", icon: "🌱", description: "Disperses dampness and stops vomiting", premium: true },
                { id: "humidity_6", level: 13, name: "Cardamom", icon: "🌰", description: "Warms the stomach and dispels dampness", premium: false },
                { id: "humidity_7", level: 16, name: "Ginger", icon: "🫚", description: "Warms the body and eliminates coldness", premium: false },
                { id: "humidity_8", level: 20, name: "Cinnamon", icon: "🌿", description: "Warms and invigorates circulation", premium: true },
                { id: "humidity_9", level: 25, name: "Euryale Seed", icon: "🌰", description: "Strengthens the spleen and stops diarrhea", premium: false },
                { id: "humidity_10", level: 30, name: "Astragalus", icon: "🌱", description: "Strengthens Qi and supports metabolism", premium: true }
            ]
        },
        
        // Kidney Health theme
        kidneyHealth: {
            title: "Kidney Health Herbs",
            description: "Herbs that support and strengthen kidney function",
            maxLevel: 30,
            xpPerLevel: 100,
            premiumPrice: 4.99,
            rewards: [
                { id: "kidney_1", level: 1, name: "Rehmannia", icon: "🌱", description: "Nourishes kidney yin", premium: false },
                { id: "kidney_2", level: 3, name: "Goji Berries", icon: "🍇", description: "Strengthens kidney and liver", premium: false },
                { id: "kidney_3", level: 5, name: "Eucommia Bark", icon: "🌳", description: "Tonifies kidney yang", premium: false },
                { id: "kidney_4", level: 7, name: "Schisandra", icon: "🍒", description: "Helps the kidneys retain essence", premium: false },
                { id: "kidney_5", level: 10, name: "Cordyceps", icon: "🍄", description: "Strengthens kidney yang and boosts energy", premium: true },
                { id: "kidney_6", level: 13, name: "He Shou Wu", icon: "🌿", description: "Nourishes kidney essence and blood", premium: false },
                { id: "kidney_7", level: 16, name: "Korean Red Ginseng", icon: "🌱", description: "Boosts energy and kidney yang", premium: false },
                { id: "kidney_8", level: 20, name: "Morinda Root", icon: "🌿", description: "Nourishes kidney yang and essence", premium: true },
                { id: "kidney_9", level: 25, name: "Epimedium", icon: "🌿", description: "Fortifies kidney yang and bones", premium: false },
                { id: "kidney_10", level: 30, name: "Deer Antler", icon: "🦌", description: "Powerful kidney yang tonic", premium: true }
            ]
        },
        
        // Anti-Hair Loss theme
        hairLoss: {
            title: "Anti-Hair Loss Herbs",
            description: "Herbs that help prevent hair loss and promote growth",
            maxLevel: 30,
            xpPerLevel: 100,
            premiumPrice: 4.99,
            rewards: [
                { id: "hair_1", level: 1, name: "Nettle", icon: "🌿", description: "Rich in silica and nutrients for hair", premium: false },
                { id: "hair_2", level: 3, name: "Saw Palmetto", icon: "🌴", description: "Blocks DHT hormone that causes hair loss", premium: false },
                { id: "hair_3", level: 5, name: "Horsetail", icon: "🌱", description: "High silica content strengthens hair", premium: false },
                { id: "hair_4", level: 7, name: "Rosemary", icon: "🌿", description: "Improves circulation to hair follicles", premium: false },
                { id: "hair_5", level: 10, name: "He Shou Wu", icon: "🌿", description: "Traditional Chinese herb for healthy hair", premium: true },
                { id: "hair_6", level: 13, name: "Pumpkin Seed", icon: "🎃", description: "Contains zinc and phytosterols", premium: false },
                { id: "hair_7", level: 16, name: "Ginseng", icon: "🌱", description: "Stimulates scalp and encourages growth", premium: false },
                { id: "hair_8", level: 20, name: "Eclipta Alba", icon: "🌼", description: "Ayurvedic herb for hair rejuvenation", premium: true },
                { id: "hair_9", level: 25, name: "Aloe Vera", icon: "🌵", description: "Soothes scalp and promotes healthy growth", premium: false },
                { id: "hair_10", level: 30, name: "Bhringaraj", icon: "🌿", description: "Known as 'King of Hair' in Ayurveda", premium: true }
            ]
        }
    }
};

// Load active battle pass from localStorage if available
const savedBattlePass = localStorage.getItem('herbMatchActiveBattlePass');
if (savedBattlePass && gameConfig.battlePasses[savedBattlePass]) {
    gameConfig.activeBattlePass = savedBattlePass;
}