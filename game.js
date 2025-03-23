import { gameConfig } from './config.js';
import { addBattlePassXP } from './battle-pass.js';
import { initHintSystem, resetHintState } from './hint-system.js';
import { hasValidMoves, swapHerbs, findMatches } from './game-utils.js';

// Game state variables
let score = 0;
let moves = 0;
let level = 1;
let timeLeft = gameConfig.initialTime;
let timerInterval;
let gameBoard = [];
let selectedHerb = null;
let canPlay = false;
let username = '';

// DOM elements
const gameBoardEl = document.getElementById('game-board');
const scoreEl = document.getElementById('score');
const movesEl = document.getElementById('moves');
const timeEl = document.getElementById('time');
const levelEl = document.getElementById('level');
const targetEl = document.getElementById('target');
const startModal = document.getElementById('start-modal');
const levelCompleteModal = document.getElementById('level-complete-modal');
const gameOverModal = document.getElementById('game-over-modal');
const finalScoreEl = document.getElementById('final-score');
const gameOverScoreEl = document.getElementById('game-over-score');

// Show start modal when page loads
window.addEventListener('load', () => {
    showModal(startModal);
    updateTarget();
    
    // Initialize hint system
    initHintSystem();
    
    // Expose game state to window for hint system
    window.gameBoard = gameBoard;
    window.gameConfig = gameConfig;
    window.canPlay = canPlay;
});

// Event listeners for buttons
document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('next-level-button').addEventListener('click', nextLevel);
document.getElementById('restart-button').addEventListener('click', restartGame);

function startGame() {
    hideModal(startModal);
    resetGame();
    initializeBoard();
    startTimer();
    canPlay = true;
    window.canPlay = canPlay;
    
    // Load saved settings
    loadSettings();
}

function nextLevel() {
    hideModal(levelCompleteModal);
    level++;
    levelEl.textContent = level;
    timeLeft += gameConfig.timeBonus;
    timeEl.textContent = timeLeft;
    updateTarget();
    initializeBoard();
    startTimer();
    canPlay = true;
    
    // Add XP for level completion
    addBattlePassXP(gameConfig.xpForLevelUp);
}

function restartGame() {
    hideModal(gameOverModal);
    level = 1;
    score = 0;
    moves = 0;
    levelEl.textContent = level;
    scoreEl.textContent = score;
    movesEl.textContent = moves;
    updateTarget();
    timeLeft = gameConfig.initialTime;
    timeEl.textContent = timeLeft;
    initializeBoard();
    startTimer();
    canPlay = true;
}

function resetGame() {
    score = 0;
    moves = 0;
    level = 1;
    timeLeft = gameConfig.initialTime;
    resetHintState(); // Use the imported function
    scoreEl.textContent = score;
    movesEl.textContent = moves;
    levelEl.textContent = level;
    timeEl.textContent = timeLeft;
}

function showModal(modal) {
    modal.classList.add('show');
}

function hideModal(modal) {
    modal.classList.remove('show');
}

function updateTarget() {
    const targetScore = gameConfig.levelTargets[level - 1] || gameConfig.levelTargets[gameConfig.levelTargets.length - 1];
    targetEl.textContent = targetScore;
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timeEl.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameOver();
        }
    }, 1000);
}

function gameOver() {
    canPlay = false;
    clearInterval(timerInterval);
    gameOverScoreEl.textContent = score;
    
    // Save score to leaderboard
    saveScore();
    
    // Add XP for game completion
    addBattlePassXP(gameConfig.xpForGameCompletion);
    
    showModal(gameOverModal);
}

function checkLevelComplete() {
    const targetScore = gameConfig.levelTargets[level - 1] || gameConfig.levelTargets[gameConfig.levelTargets.length - 1];
    if (score >= targetScore) {
        clearInterval(timerInterval);
        canPlay = false;
        finalScoreEl.textContent = score;
        showModal(levelCompleteModal);
    }
}

function initializeBoard() {
    // Clear the game board
    gameBoardEl.innerHTML = '';
    gameBoard = [];
    
    // Create a new board
    for (let row = 0; row < gameConfig.boardSize; row++) {
        gameBoard[row] = [];
        for (let col = 0; col < gameConfig.boardSize; col++) {
            // Get a random herb that doesn't create a match at initialization
            let herbIndex;
            do {
                herbIndex = Math.floor(Math.random() * gameConfig.herbs.length);
            } while (
                (row >= 2 && 
                 gameBoard[row-1] && gameBoard[row-1][col] && 
                 gameBoard[row-2] && gameBoard[row-2][col] && 
                 gameConfig.herbs[herbIndex].emoji === gameBoard[row-1][col].emoji && 
                 gameConfig.herbs[herbIndex].emoji === gameBoard[row-2][col].emoji) ||
                (col >= 2 && 
                 gameBoard[row] && gameBoard[row][col-1] && 
                 gameBoard[row][col-2] && 
                 gameConfig.herbs[herbIndex].emoji === gameBoard[row][col-1].emoji && 
                 gameConfig.herbs[herbIndex].emoji === gameBoard[row][col-2].emoji)
            );
            
            const herb = { ...gameConfig.herbs[herbIndex] };
            gameBoard[row][col] = herb;
            
            // Create the herb element
            const herbElement = document.createElement('div');
            herbElement.className = 'herb';
            herbElement.textContent = herb.emoji;
            herbElement.dataset.row = row;
            herbElement.dataset.col = col;
            
            herbElement.addEventListener('click', () => {
                if (!canPlay) return;
                handleHerbClick(row, col);
            });
            
            gameBoardEl.appendChild(herbElement);
        }
    }
    
    // Ensure there's at least one valid move on the board
    if (!hasValidMoves(gameBoard, gameConfig.boardSize)) {
        initializeBoard();
    }
}

function handleHerbClick(row, col) {
    const clickedHerb = gameBoard[row][col];
    
    // If no herb is selected, select this one
    if (!selectedHerb) {
        selectedHerb = { row, col, emoji: clickedHerb.emoji };
        getHerbElement(row, col).classList.add('selected');
        return;
    }
    
    // If the same herb is clicked, deselect it
    if (selectedHerb.row === row && selectedHerb.col === col) {
        getHerbElement(row, col).classList.remove('selected');
        selectedHerb = null;
        return;
    }
    
    // If adjacent, swap herbs
    if (isAdjacent(selectedHerb.row, selectedHerb.col, row, col)) {
        const selectedElement = getHerbElement(selectedHerb.row, selectedHerb.col);
        selectedElement.classList.remove('selected');
        
        // Swap herbs - using imported function
        swapHerbs(gameBoard, selectedHerb.row, selectedHerb.col, row, col);
        
        // Update the visual representation
        const element1 = getHerbElement(selectedHerb.row, selectedHerb.col);
        const element2 = getHerbElement(row, col);
        
        element1.textContent = gameBoard[selectedHerb.row][selectedHerb.col].emoji;
        element2.textContent = gameBoard[row][col].emoji;
        
        // Check for matches - using imported function
        const matches = findMatches(gameBoard, gameConfig.boardSize);
        
        if (matches.length > 0) {
            // Valid move with matches
            moves++;
            movesEl.textContent = moves;
            
            processMatches(matches);
            
            // After matches are processed, check for cascading matches
            setTimeout(() => {
                checkCascadingMatches();
            }, 500);
        } else {
            // Invalid move, swap back
            swapHerbs(gameBoard, row, col, selectedHerb.row, selectedHerb.col);
        }
        
        selectedHerb = null;
    } else {
        // Not adjacent, select the new herb
        getHerbElement(selectedHerb.row, selectedHerb.col).classList.remove('selected');
        selectedHerb = { row, col, emoji: clickedHerb.emoji };
        getHerbElement(row, col).classList.add('selected');
    }
}

function isAdjacent(row1, col1, row2, col2) {
    return (
        (Math.abs(row1 - row2) === 1 && col1 === col2) ||
        (row1 === row2 && Math.abs(col1 - col2) === 1)
    );
}

function getHerbElement(row, col) {
    return document.querySelector(`.herb[data-row="${row}"][data-col="${col}"]`);
}

function checkCascadingMatches() {
    const matches = findMatches(gameBoard, gameConfig.boardSize);
    
    if (matches.length > 0) {
        processMatches(matches);
        
        setTimeout(() => {
            checkCascadingMatches();
        }, 500);
    } else {
        // Check if there are valid moves after cascading
        if (!hasValidMoves(gameBoard, gameConfig.boardSize)) {
            shuffleBoard();
        }
    }
}

function processMatches(matches) {
    // Highlight matching herbs
    matches.forEach(match => {
        // Calculate score based on match length
        const matchLength = match.length;
        const matchScore = gameConfig.matchScore[matchLength] || (matchLength * 100);
        score += matchScore;
        scoreEl.textContent = score;
        
        // Add XP to battle pass
        addBattlePassXP(gameConfig.xpForMatch);
        
        // Mark matched herbs
        match.forEach(pos => {
            const herbElement = getHerbElement(pos.row, pos.col);
            herbElement.classList.add('matching');
        });
    });
    
    // After a short delay, remove matches and shift herbs down
    setTimeout(() => {
        // Remove matching herbs
        matches.forEach(match => {
            match.forEach(pos => {
                const herbElement = getHerbElement(pos.row, pos.col);
                herbElement.classList.remove('matching');
                herbElement.classList.add('eliminated');
                gameBoard[pos.row][pos.col] = null;
            });
        });
        
        // After a short delay, shift herbs down and fill in new ones
        setTimeout(() => {
            shiftHerbsDown();
            checkLevelComplete();
        }, 300);
    }, 300);
}

function shiftHerbsDown() {
    // For each column, shift herbs down
    for (let col = 0; col < gameConfig.boardSize; col++) {
        let emptyCount = 0;
        
        // Move existing herbs down
        for (let row = gameConfig.boardSize - 1; row >= 0; row--) {
            if (gameBoard[row] && gameBoard[row][col] === null) {
                emptyCount++;
            } else if (emptyCount > 0) {
                // Move herb down
                const targetRow = row + emptyCount;
                gameBoard[targetRow][col] = gameBoard[row][col];
                gameBoard[row][col] = null;
                
                // Update visual
                const targetElement = getHerbElement(targetRow, col);
                targetElement.textContent = gameBoard[targetRow][col].emoji;
                targetElement.classList.remove('eliminated');
            }
        }
        
        // Fill in new herbs at the top
        for (let row = 0; row < emptyCount; row++) {
            const herbIndex = Math.floor(Math.random() * gameConfig.herbs.length);
            gameBoard[row][col] = { ...gameConfig.herbs[herbIndex] };
            
            // Update visual
            const herbElement = getHerbElement(row, col);
            herbElement.textContent = gameBoard[row][col].emoji;
            herbElement.classList.remove('eliminated');
        }
    }
}

function shuffleBoard() {
    // Create a temporary array of all herbs
    const allHerbs = [];
    for (let row = 0; row < gameConfig.boardSize; row++) {
        for (let col = 0; col < gameConfig.boardSize; col++) {
            allHerbs.push(gameBoard[row][col]);
        }
    }
    
    // Shuffle the herbs
    for (let i = allHerbs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allHerbs[i], allHerbs[j]] = [allHerbs[j], allHerbs[i]];
    }
    
    // Redistribute the herbs
    let index = 0;
    for (let row = 0; row < gameConfig.boardSize; row++) {
        for (let col = 0; col < gameConfig.boardSize; col++) {
            gameBoard[row][col] = allHerbs[index];
            getHerbElement(row, col).textContent = allHerbs[index].emoji;
            index++;
        }
    }
    
    // If still no valid moves, reshuffle
    if (!hasValidMoves(gameBoard, gameConfig.boardSize)) {
        shuffleBoard();
    }
}

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('herbMatchSettings')) || {};
    
    // Apply difficulty settings
    if (settings.difficulty) {
        applyDifficulty(settings.difficulty);
    }
    
    // Get username
    username = settings.username || 'Player';
    
    // Apply theme if set
    if (settings.theme) {
        document.body.className = '';
        document.body.classList.add(`theme-${settings.theme}`);
    }
}

function applyDifficulty(difficulty) {
    switch(difficulty) {
        case 'easy':
            timeLeft = gameConfig.initialTime + 30;
            break;
        case 'hard':
            timeLeft = gameConfig.initialTime - 15;
            break;
        default:
            timeLeft = gameConfig.initialTime;
    }
    timeEl.textContent = timeLeft;
}

function saveScore() {
    // Get existing leaderboard
    const leaderboard = JSON.parse(localStorage.getItem('herbMatchLeaderboard')) || [];
    
    // Add new score
    leaderboard.push({
        name: username,
        score: score,
        level: level,
        date: new Date().toISOString()
    });
    
    // Sort by score (highest first)
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top 10 scores
    const topScores = leaderboard.slice(0, 10);
    
    // Save back to localStorage
    localStorage.setItem('herbMatchLeaderboard', JSON.stringify(topScores));
}