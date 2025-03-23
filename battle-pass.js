import { gameConfig } from './config.js';
import { isPremium } from './shop.js';

// Battle pass state
let currentPass = null;
let userProgress = {
    level: 1,
    xp: 0,
    rewards: []
};

// Initialize battle pass system
export function initBattlePass() {
    loadBattlePassProgress();
    renderBattlePassUI();
}

// Load saved battle pass progress
function loadBattlePassProgress() {
    const savedProgress = JSON.parse(localStorage.getItem('herbMatchBattlePass')) || null;
    
    if (savedProgress) {
        userProgress = savedProgress;
    } else {
        // Initialize new progress
        userProgress = {
            level: 1,
            xp: 0,
            rewards: []
        };
    }
    
    // Always load the current active battle pass
    if (gameConfig && gameConfig.battlePasses && gameConfig.activeBattlePass) {
        currentPass = gameConfig.battlePasses[gameConfig.activeBattlePass];
    }
}

// Save battle pass progress
export function saveBattlePassProgress() {
    localStorage.setItem('herbMatchBattlePass', JSON.stringify(userProgress));
}

// Add XP to battle pass - add null checks to prevent errors
export function addBattlePassXP(amount) {
    // Initialize battle pass if not already done
    if (!currentPass) {
        loadBattlePassProgress();
    }
    
    // Ensure we have valid data before proceeding
    if (!currentPass || !userProgress) {
        console.warn("Battle pass not properly initialized");
        return;
    }
    
    userProgress.xp += amount;
    
    // Check for level ups
    const xpForNextLevel = currentPass.xpPerLevel * userProgress.level;
    
    if (userProgress.xp >= xpForNextLevel && userProgress.level < currentPass.maxLevel) {
        userProgress.level++;
        userProgress.xp -= xpForNextLevel;
        
        // Unlock reward for the level
        const reward = currentPass.rewards.find(r => r.level === userProgress.level);
        if (reward && !userProgress.rewards.includes(reward.id)) {
            userProgress.rewards.push(reward.id);
            showRewardNotification(reward);
        }
    }
    
    saveBattlePassProgress();
    
    // Only try to update UI if we're on the battle pass page
    if (document.getElementById('battle-pass-container')) {
        updateBattlePassUI();
    }
}

// Check if user has a specific reward
export function hasReward(rewardId) {
    return userProgress.rewards.includes(rewardId);
}

// Render the battle pass UI
function renderBattlePassUI() {
    const container = document.getElementById('battle-pass-container');
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Add premium status indicator
    const premiumStatus = document.createElement('div');
    premiumStatus.className = 'premium-status';
    premiumStatus.innerHTML = isPremium() 
        ? '<div class="premium-badge">👑 Premium Pass Active</div>'
        : '<div class="free-badge">Free Pass Active</div><a href="shop.html" class="upgrade-button">Upgrade to Premium</a>';
    container.appendChild(premiumStatus);
    
    // Add title
    const title = document.createElement('div');
    title.className = 'battle-pass-title';
    title.innerHTML = `<h2>${currentPass.title}</h2>
                       <p>${currentPass.description}</p>`;
    container.appendChild(title);
    
    // Add progress bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'battle-pass-progress';
    
    const xpForCurrentLevel = currentPass.xpPerLevel * userProgress.level;
    const progressPercentage = (userProgress.xp / xpForCurrentLevel) * 100;
    
    progressContainer.innerHTML = `
        <div class="progress-info">
            <span>Level ${userProgress.level}</span>
            <span>${userProgress.xp}/${xpForCurrentLevel} XP</span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
        </div>
    `;
    container.appendChild(progressContainer);
    
    // Add rewards track
    const rewardsTrack = document.createElement('div');
    rewardsTrack.className = 'battle-pass-rewards';
    
    // Create reward items
    currentPass.rewards.forEach(reward => {
        const rewardItem = document.createElement('div');
        rewardItem.className = 'reward-item';
        
        // Add locked/unlocked class
        if (reward.level <= userProgress.level) {
            rewardItem.classList.add('unlocked');
        } else {
            rewardItem.classList.add('locked');
        }
        
        // Add premium class if premium
        if (reward.premium) {
            rewardItem.classList.add('premium');
        }
        
        rewardItem.innerHTML = `
            <div class="reward-level">Level ${reward.level}</div>
            <div class="reward-icon">${reward.icon}</div>
            <div class="reward-name">${reward.name}</div>
        `;
        
        rewardsTrack.appendChild(rewardItem);
    });
    
    container.appendChild(rewardsTrack);
}

// Update battle pass UI
function updateBattlePassUI() {
    // Re-render the UI
    renderBattlePassUI();
}

// Show notification for unlocked reward
function showRewardNotification(reward) {
    // Create a notification element
    const notification = document.createElement('div');
    notification.className = 'reward-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h3>New Reward Unlocked!</h3>
            <div class="reward-icon large">${reward.icon}</div>
            <div class="reward-name">${reward.name}</div>
            <p>${reward.description}</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add show class for animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 5000);
}

// Get active battle pass info for display
export function getActiveBattlePassInfo() {
    return {
        title: currentPass.title,
        level: userProgress.level,
        xp: userProgress.xp,
        xpForNextLevel: currentPass.xpPerLevel * userProgress.level
    };
}