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
    ]
};