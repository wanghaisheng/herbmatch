import { gameConfig } from './config.js';
import { getLevelSelectData } from './level-system.js';
import { getLevelPreview } from './level-details.js';

document.addEventListener('DOMContentLoaded', () => {
    initLevelSelect();
});

function initLevelSelect() {
    const container = document.getElementById('level-select-container');
    const levelData = getLevelSelectData();
    
    // Create level grid
    const levelGrid = document.createElement('div');
    levelGrid.className = 'level-grid';
    
    // Calculate how many levels to show (the highest unlocked level + 3 more as preview)
    const maxLevelToShow = Math.min(levelData.highestLevel + 3, 50); // Limit to 50 levels for now
    
    for (let i = 1; i <= maxLevelToShow; i++) {
        const levelItem = createLevelItem(i, levelData);
        levelGrid.appendChild(levelItem);
        
        // Add event listeners to show level preview on hover/tap
        levelItem.addEventListener('mouseenter', () => {
            if (!levelItem.classList.contains('locked')) {
                showLevelPreview(i);
            }
        });
        
        // Also handle touch for mobile
        levelItem.addEventListener('touchstart', (e) => {
            if (!levelItem.classList.contains('locked')) {
                e.preventDefault(); // Prevent click event
                showLevelPreview(i);
            }
        });
    }
    
    container.appendChild(levelGrid);
    
    // Show preview for current level by default
    showLevelPreview(levelData.currentLevel);
}

function createLevelItem(levelNumber, levelData) {
    const levelItem = document.createElement('div');
    levelItem.className = 'level-item';
    
    // Check if level is completed or locked
    const isCompleted = levelData.completedLevels.includes(levelNumber);
    const isLocked = levelNumber > levelData.highestLevel;
    const isCurrent = levelNumber === levelData.currentLevel;
    
    if (isLocked) {
        levelItem.classList.add('locked');
    } else if (isCompleted) {
        levelItem.classList.add('completed');
    }
    
    if (isCurrent) {
        levelItem.classList.add('current');
    }
    
    // Level number and stars
    const levelNumber_el = document.createElement('div');
    levelNumber_el.className = 'level-number';
    levelNumber_el.textContent = levelNumber;
    levelItem.appendChild(levelNumber_el);
    
    // Add difficulty indicator for higher levels
    if (levelNumber % 10 === 0) {
        const challengeIndicator = document.createElement('div');
        challengeIndicator.className = 'challenge-indicator';
        challengeIndicator.textContent = '🔥';
        challengeIndicator.title = 'Challenge Level';
        levelItem.appendChild(challengeIndicator);
    } else if (levelNumber % 5 === 0) {
        const milestoneIndicator = document.createElement('div');
        milestoneIndicator.className = 'milestone-indicator';
        milestoneIndicator.textContent = '✨';
        milestoneIndicator.title = 'Milestone Level';
        levelItem.appendChild(milestoneIndicator);
    }
    
    // Add stars if level is completed
    if (isCompleted) {
        const starsContainer = document.createElement('div');
        starsContainer.className = 'stars-container';
        
        const stars = levelData.stars[levelNumber] || 0;
        for (let i = 0; i < 3; i++) {
            const star = document.createElement('span');
            star.className = i < stars ? 'star filled' : 'star empty';
            star.textContent = i < stars ? '★' : '☆';
            starsContainer.appendChild(star);
        }
        
        levelItem.appendChild(starsContainer);
    }
    
    // Add lock icon if locked
    if (isLocked) {
        const lockIcon = document.createElement('div');
        lockIcon.className = 'lock-icon';
        lockIcon.textContent = '🔒';
        levelItem.appendChild(lockIcon);
    }
    
    // Add click event to play the level
    if (!isLocked) {
        levelItem.addEventListener('click', () => {
            playLevel(levelNumber);
        });
    }
    
    return levelItem;
}

function showLevelPreview(levelNumber) {
    const previewTitle = document.getElementById('preview-title');
    const previewDetails = document.getElementById('preview-details');
    
    // Get level preview data
    const preview = getLevelPreview(levelNumber);
    
    // Update title
    previewTitle.textContent = `Level ${levelNumber}`;
    
    // Create preview content
    let previewHTML = `
        <div class="preview-content">
            <div class="preview-stat">
                <span class="preview-icon">🎯</span>
                <span>Target: ${preview.targetScore}</span>
            </div>
            <div class="preview-stat">
                <span class="preview-icon">⏱️</span>
                <span>Time: ${preview.timeLimit}s</span>
            </div>
            <div class="preview-objectives">
    `;
    
    // Add objectives
    preview.objectives.forEach(objective => {
        previewHTML += `
            <div class="objective-item">
                <span class="objective-icon">✓</span>
                <span>${objective}</span>
            </div>
        `;
    });
    
    // Add difficulty meter
    previewHTML += `
            </div>
            <div class="difficulty-meter">
                <span>Difficulty:</span>
                <div class="difficulty-dots">
    `;
    
    // Add difficulty dots
    for (let i = 1; i <= 5; i++) {
        previewHTML += `<span class="difficulty-dot ${i <= preview.difficulty ? 'active' : ''}"></span>`;
    }
    
    previewHTML += `
                </div>
            </div>
        </div>
    `;
    
    previewDetails.innerHTML = previewHTML;
}

function playLevel(levelNumber) {
    // Store the selected level
    localStorage.setItem('herbKingSelectedLevel', levelNumber);
    
    // Navigate to the game page
    window.location.href = 'index.html';
}