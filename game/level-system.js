import { gameConfig } from './config.js';
import { addBattlePassXP } from './battle-pass.js';

// Level system state
let currentLevelData = null;
let levelProgress = {
    completedLevels: [],
    currentLevel: 1,
    highestLevelReached: 1,
    stars: {}
};

// Initialize level system
export function initLevelSystem() {
    loadLevelProgress();
    return levelProgress;
}

// Load level progress from localStorage
function loadLevelProgress() {
    const savedProgress = JSON.parse(localStorage.getItem('herbMatchLevelProgress')) || null;
    
    if (savedProgress) {
        levelProgress = savedProgress;
    }
}

// Save level progress
export function saveLevelProgress() {
    localStorage.setItem('herbMatchLevelProgress', JSON.stringify(levelProgress));
}

// Get level data for specific level
export function getLevelData(levelNumber) {
    // Use the configured level data or generate dynamic level if not found
    if (gameConfig.levels && gameConfig.levels[levelNumber - 1]) {
        return gameConfig.levels[levelNumber - 1];
    } else {
        // Import from level-design.js instead of using local function
        return import('./level-design.js').then(module => {
            return module.generateDynamicLevel(levelNumber);
        });
    }
}

// Mark level as completed
export function completeLevel(levelNumber, score, stars) {
    if (!levelProgress.completedLevels.includes(levelNumber)) {
        levelProgress.completedLevels.push(levelNumber);
    }
    
    // Update stars
    levelProgress.stars[levelNumber] = stars;
    
    // Update highest level reached
    if (levelNumber + 1 > levelProgress.highestLevelReached) {
        levelProgress.highestLevelReached = levelNumber + 1;
    }
    
    // Update current level to next level
    levelProgress.currentLevel = levelNumber + 1;
    
    // Save progress
    saveLevelProgress();
    
    // Add XP to battle pass based on stars earned
    addBattlePassXP(gameConfig.xpForLevelCompletion * stars);
}

// Calculate stars earned (1-3) based on score and target
export function calculateStars(score, targetScore) {
    if (score >= targetScore * 1.5) {
        return 3;
    } else if (score >= targetScore * 1.2) {
        return 2;
    } else {
        return 1;
    }
}

// Check if level objective is complete
export function checkLevelObjectiveComplete(levelData, gameState) {
    // Import the function from level-design.js
    return import('./level-design.js').then(module => {
        return module.checkLevelObjectives(levelData, gameState);
    });
}

// Get level select data for UI
export function getLevelSelectData() {
    return {
        currentLevel: levelProgress.currentLevel,
        highestLevel: levelProgress.highestLevelReached,
        completedLevels: levelProgress.completedLevels,
        stars: levelProgress.stars
    };
}