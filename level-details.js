// New file for detailed level information and mechanics
import { gameConfig } from './config.js';
import { generateDynamicLevel } from './level-design.js';

// Generate level preview information for level select screen
export function getLevelPreview(levelNumber) {
    // For predefined levels, return stored data
    if (gameConfig.levels && gameConfig.levels[levelNumber - 1]) {
        const level = gameConfig.levels[levelNumber - 1];
        return {
            level: level.level,
            targetScore: level.targetScore,
            timeLimit: level.timeLimit,
            objectives: formatObjectives(level),
            difficulty: calculateDifficulty(level)
        };
    } 
    // For dynamic levels, generate a preview
    else {
        const level = generateDynamicLevel(levelNumber);
        return {
            level: level.level,
            targetScore: level.targetScore,
            timeLimit: level.timeLimit,
            objectives: formatObjectives(level),
            difficulty: calculateDifficulty(level)
        };
    }
}

// Format level objectives for display
function formatObjectives(level) {
    const objectives = [];
    
    // Score objective is always present
    objectives.push(`Score ${level.targetScore} points`);
    
    // Collection objectives
    if (level.objectives.includes('collection') && level.specialObjectives.collection) {
        const collection = level.specialObjectives.collection;
        objectives.push(`Collect ${collection.amount} ${collection.herb.name}`);
    }
    
    // Obstacle objectives
    if (level.objectives.includes('obstacle') && level.specialObjectives.obstacles) {
        objectives.push(`Clear ${level.specialObjectives.obstacles.count} obstacles`);
    }
    
    return objectives;
}

// Calculate difficulty rating (1-5) based on level parameters
function calculateDifficulty(level) {
    let difficultyScore = 1;
    
    // Base difficulty from level number
    difficultyScore += Math.floor(level.level / 10);
    
    // Adjust for time pressure
    if (level.timeLimit < 45) difficultyScore += 1;
    if (level.timeLimit < 30) difficultyScore += 1;
    
    // Adjust for multiple objectives
    difficultyScore += Math.max(0, level.objectives.length - 1);
    
    // Cap at 5
    return Math.min(5, difficultyScore);
}

// Get specific herb distribution for a level
export function getLevelHerbDistribution(levelNumber) {
    // Every 5th level introduces a special herb focus
    if (levelNumber % 5 === 0) {
        const herbIndex = (Math.floor(levelNumber / 5) - 1) % gameConfig.herbs.length;
        const focusHerb = gameConfig.herbs[herbIndex];
        
        return gameConfig.herbs.map(herb => {
            if (herb.name === focusHerb.name) {
                return { herb, weight: 1.8 }; // Featured herb appears more often
            }
            return { herb, weight: 0.9 };
        });
    }
    
    // Every 10th level has a varied distribution focusing on challenge
    if (levelNumber % 10 === 0) {
        // For challenge levels, create an uneven distribution to increase difficulty
        return gameConfig.herbs.map((herb, index) => {
            // Alternate between high and low frequency herbs
            const weight = index % 2 === 0 ? 1.5 : 0.7;
            return { herb, weight };
        });
    }
    
    // Default distribution
    return gameConfig.herbs.map(herb => ({ herb, weight: 1 }));
}

// Get level rewards based on star count
export function getLevelRewards(levelNumber, stars) {
    const baseXP = gameConfig.xpForLevelCompletion * stars;
    
    // Calculate bonus rewards
    let bonusHints = 0;
    let bonusTimeBoosts = 0;
    
    // Special reward for 3 stars
    if (stars === 3) {
        bonusHints = Math.floor(levelNumber / 10) + 1;
        
        // Every 5th level with 3 stars gives a time boost
        if (levelNumber % 5 === 0) {
            bonusTimeBoosts = 1;
        }
    }
    
    // Challenge level rewards (every 10th level)
    if (levelNumber % 10 === 0 && stars >= 2) {
        bonusHints += 2;
        bonusTimeBoosts += 1;
    }
    
    return {
        xp: baseXP,
        hints: bonusHints,
        timeBoosts: bonusTimeBoosts
    };
}