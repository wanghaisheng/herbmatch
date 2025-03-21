import { gameConfig } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    loadLeaderboard();
});

function loadLeaderboard() {
    // Get leaderboard data from localStorage
    const leaderboardData = JSON.parse(localStorage.getItem('herbMatchLeaderboard')) || [];
    
    const leaderboardBody = document.getElementById('leaderboard-body');
    const emptyState = document.getElementById('empty-leaderboard');
    
    if (leaderboardData.length === 0) {
        // Show empty state
        emptyState.style.display = 'block';
        return;
    }
    
    // Hide empty state
    emptyState.style.display = 'none';
    
    // Sort leaderboard by score (highest first)
    leaderboardData.sort((a, b) => b.score - a.score);
    
    // Populate the table
    leaderboardBody.innerHTML = '';
    leaderboardData.forEach((entry, index) => {
        const row = document.createElement('tr');
        
        const rankCell = document.createElement('td');
        rankCell.textContent = index + 1;
        
        const playerCell = document.createElement('td');
        playerCell.textContent = entry.name || 'Anonymous';
        
        const scoreCell = document.createElement('td');
        scoreCell.textContent = entry.score;
        
        const levelCell = document.createElement('td');
        levelCell.textContent = entry.level;
        
        row.appendChild(rankCell);
        row.appendChild(playerCell);
        row.appendChild(scoreCell);
        row.appendChild(levelCell);
        
        leaderboardBody.appendChild(row);
    });
}