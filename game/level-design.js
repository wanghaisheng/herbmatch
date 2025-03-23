// New file for level design functionality to reduce load on game.js
import { gameConfig } from './config.js';

// Generate dynamic level parameters based on level number
export function generateDynamicLevel(levelNumber) {
    // Base difficulty scaling factors
    const difficultyMultiplier = 1 + (levelNumber * 0.15);
    
    // Base level parameters
    let levelData = {
        level: levelNumber,
        targetScore: Math.round(1000 * difficultyMultiplier),
        timeLimit: Math.max(30, Math.round(60 - (levelNumber * 0.5))), // Gradually reduce time, minimum 30s
        moveLimit: null, // No move limit by default, only time limit
        objectives: ['score'],
        specialObjectives: {}
    };
    
    // Add collection objectives in mid to late game
    if (levelNumber > 10) {
        const herbToCollect = gameConfig.herbs[Math.floor(Math.random() * gameConfig.herbs.length)];
        const collectionAmount = Math.floor(5 + (levelNumber * 0.4));
        
        levelData.objectives.push('collection');
        levelData.specialObjectives.collection = {
            herb: herbToCollect,
            amount: collectionAmount,
            collected: 0
        };
    }
    
    // Add obstacles in late game
    if (levelNumber > 20) {
        levelData.objectives.push('obstacle');
        levelData.specialObjectives.obstacles = {
            count: Math.floor(2 + (levelNumber * 0.2)),
            remaining: Math.floor(2 + (levelNumber * 0.2))
        };
    }
    
    // Every 5th level is slightly easier (recovery level)
    if (levelNumber % 5 === 0) {
        levelData.targetScore = Math.round(levelData.targetScore * 0.85);
        levelData.timeLimit = Math.round(levelData.timeLimit * 1.2);
    }
    
    // Every 10th level is a challenge level with multiple objectives
    if (levelNumber % 10 === 0) {
        // Add special herb collection if not already present
        if (!levelData.objectives.includes('collection')) {
            const herbToCollect = gameConfig.herbs[Math.floor(Math.random() * gameConfig.herbs.length)];
            const collectionAmount = Math.floor(8 + (levelNumber * 0.6)); // Higher collection requirement
            
            levelData.objectives.push('collection');
            levelData.specialObjectives.collection = {
                herb: herbToCollect,
                amount: collectionAmount,
                collected: 0
            };
        }
        
        // Add time pressure - slightly reduced time
        levelData.timeLimit = Math.max(25, Math.round(levelData.timeLimit * 0.9));
        
        // Higher score requirement for challenge levels
        levelData.targetScore = Math.round(levelData.targetScore * 1.2);
    }
    
    // Set star thresholds
    levelData.starThresholds = {
        one: levelData.targetScore,
        two: Math.round(levelData.targetScore * 1.2),
        three: Math.round(levelData.targetScore * 1.5)
    };
    
    return levelData;
}

// Calculate board configuration based on level type
export function generateBoardConfig(levelData) {
    // Default balanced distribution
    let herbDistribution = gameConfig.herbs.map(herb => ({ herb, weight: 1 }));
    
    // Adjust for collection levels - increase weight of target herb
    if (levelData.objectives.includes('collection')) {
        const targetHerb = levelData.specialObjectives.collection.herb;
        herbDistribution = herbDistribution.map(item => {
            if (item.herb.name === targetHerb.name) {
                return { herb: item.herb, weight: 1.5 }; // 50% more likely to appear
            }
            return item;
        });
    }
    
    // Generate obstacles for obstacle levels
    let obstacles = [];
    if (levelData.objectives.includes('obstacle')) {
        const obstacleCount = levelData.specialObjectives.obstacles.count;
        // Generate obstacle positions (would contain logic to place obstacles)
    }
    
    return {
        herbDistribution,
        obstacles,
        specialTiles: []  // For future special tile types
    };
}

// Check if all level objectives are complete
export function checkLevelObjectives(levelData, gameState) {
    // Primary score objective
    const scoreComplete = gameState.score >= levelData.targetScore;
    
    // Collection objective if present
    let collectionComplete = true;
    if (levelData.objectives.includes('collection')) {
        collectionComplete = gameState.collectedHerbs[levelData.specialObjectives.collection.herb.name] >= 
                             levelData.specialObjectives.collection.amount;
    }
    
    // Obstacle objective if present
    let obstacleComplete = true;
    if (levelData.objectives.includes('obstacle')) {
        obstacleComplete = levelData.specialObjectives.obstacles.remaining <= 0;
    }
    
    // Calculate stars earned
    let stars = 0;
    if (scoreComplete && collectionComplete && obstacleComplete) {
        stars = 1; // Completed basic objectives
        
        if (gameState.score >= levelData.starThresholds.two) {
            stars = 2;
        }
        
        if (gameState.score >= levelData.starThresholds.three) {
            stars = 3;
        }
    }
    
    return {
        complete: scoreComplete && collectionComplete && obstacleComplete,
        stars: stars,
        objectives: {
            score: scoreComplete,
            collection: collectionComplete,
            obstacle: obstacleComplete
        }
    };
}
