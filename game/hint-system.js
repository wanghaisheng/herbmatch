import { gameConfig } from './config.js';
import { showRewardedAd, useHint } from './shop.js';

// State variables for hint system
let hintAvailable = true;
let hintTimeout = null;
let countdownInterval = null;
const hintButton = document.getElementById('hint-button');

// Initialize hint system
export function initHintSystem() {
    if (hintButton) {
        hintButton.addEventListener('click', showHint);
        updateHintButton();
    }
    return { hintAvailable };
}

// Reset hint state
export function resetHintState() {
    hintAvailable = true;
    clearTimeout(hintTimeout);
    clearInterval(countdownInterval); // Also clear the interval
    updateHintButton();
}

// Show hint to the player
export function showHint() {
    if (!window.canPlay) return;
    
    if (hintAvailable) {
        // Find a valid move
        let validMove = findValidMove();
        
        if (validMove) {
            highlightHintMoves(validMove);
            startHintCooldown();
        }
    } else {
        // Try to use a hint from inventory
        if (useHint()) {
            // If successful, show hint without cooldown
            let validMove = findValidMove();
            
            if (validMove) {
                highlightHintMoves(validMove);
            }
        } else {
            // No hints available, show purchase option
            showHintPurchaseOption();
        }
    }
}

// Helper function to highlight hint moves
function highlightHintMoves(validMove) {
    const firstElement = getHerbElement(validMove.row1, validMove.col1);
    const secondElement = getHerbElement(validMove.row2, validMove.col2);
    
    if (firstElement && secondElement) {
        firstElement.classList.add('hint');
        secondElement.classList.add('hint');
        
        // Remove the hint after 2 seconds
        setTimeout(() => {
            firstElement.classList.remove('hint');
            secondElement.classList.remove('hint');
        }, 2000);
    }
}

// Start hint cooldown timer
function startHintCooldown() {
    hintAvailable = false;
    updateHintButton();
    
    hintTimeout = setTimeout(() => {
        hintAvailable = true;
        updateHintButton();
    }, gameConfig.hintCooldown * 1000);
}

// Helper function to get herb element with error handling
function getHerbElement(row, col) {
    const element = document.querySelector(`.herb[data-row="${row}"][data-col="${col}"]`);
    return element; // Will return null if not found, which is handled by the caller
}

// Find valid move on the board
function findValidMove() {
    // Get game board from window object (injected by game.js)
    const { gameBoard, gameConfig } = window;
    
    if (!gameBoard || !gameConfig) return null;
    
    // Check all possible moves to find one that would create a match
    for (let row = 0; row < gameConfig.boardSize; row++) {
        for (let col = 0; col < gameConfig.boardSize; col++) {
            // Check right swap
            if (col < gameConfig.boardSize - 1) {
                // Skip if any position is null
                if (!gameBoard[row] || !gameBoard[row][col] || !gameBoard[row][col+1]) continue;
                
                // Swap
                swapHerbs(row, col, row, col + 1);
                
                // Check for matches
                const matches = findMatches();
                
                // Swap back
                swapHerbs(row, col + 1, row, col);
                
                if (matches.length > 0) {
                    return {
                        row1: row,
                        col1: col,
                        row2: row,
                        col2: col + 1
                    };
                }
            }
            
            // Check down swap
            if (row < gameConfig.boardSize - 1) {
                // Skip if any position is null
                if (!gameBoard[row] || !gameBoard[row+1] || !gameBoard[row][col] || !gameBoard[row+1][col]) continue;
                
                // Swap
                swapHerbs(row, col, row + 1, col);
                
                // Check for matches
                const matches = findMatches();
                
                // Swap back
                swapHerbs(row + 1, col, row, col);
                
                if (matches.length > 0) {
                    return {
                        row1: row,
                        col1: col,
                        row2: row + 1,
                        col2: col
                    };
                }
            }
        }
    }
    
    return null;
}

// Temp swap for checking valid moves
function swapHerbs(row1, col1, row2, col2) {
    // Check if positions exist
    if (!window.gameBoard[row1] || !window.gameBoard[row2] || 
        !window.gameBoard[row1][col1] || !window.gameBoard[row2][col2]) {
        return;
    }
    
    // Swap in data structure
    const temp = window.gameBoard[row1][col1];
    window.gameBoard[row1][col1] = window.gameBoard[row2][col2];
    window.gameBoard[row2][col2] = temp;
}

// Find matches on the board
function findMatches() {
    // This is a simplified version that uses window.gameBoard and gameConfig
    const { gameBoard, gameConfig } = window;
    const matches = [];
    
    if (!gameBoard || !gameConfig) return matches;
    
    // Check horizontal matches
    for (let row = 0; row < gameConfig.boardSize; row++) {
        if (!gameBoard[row]) continue;
        let count = 1;
        let matchEmoji = gameBoard[row][0]?.emoji;
        
        for (let col = 1; col < gameConfig.boardSize; col++) {
            if (gameBoard[row] && gameBoard[row][col] && matchEmoji && gameBoard[row][col].emoji === matchEmoji) {
                count++;
                
                if (col === gameConfig.boardSize - 1 && count >= 3) {
                    // Add match at the end of the row
                    const match = [];
                    for (let i = col - count + 1; i <= col; i++) {
                        match.push({ row, col: i });
                    }
                    matches.push(match);
                }
            } else {
                if (count >= 3) {
                    // Add match
                    const match = [];
                    for (let i = col - count; i < col; i++) {
                        match.push({ row, col: i });
                    }
                    matches.push(match);
                }
                
                count = 1;
                matchEmoji = gameBoard[row][col]?.emoji;
            }
        }
    }
    
    // Check vertical matches
    for (let col = 0; col < gameConfig.boardSize; col++) {
        let count = 1;
        let matchEmoji = gameBoard[0]?.[col]?.emoji;
        
        for (let row = 1; row < gameConfig.boardSize; row++) {
            if (gameBoard[row] && gameBoard[row][col] && matchEmoji && gameBoard[row][col].emoji === matchEmoji) {
                count++;
                
                if (row === gameConfig.boardSize - 1 && count >= 3) {
                    // Add match at the end of the column
                    const match = [];
                    for (let i = row - count + 1; i <= row; i++) {
                        match.push({ row: i, col });
                    }
                    matches.push(match);
                }
            } else {
                if (count >= 3) {
                    // Add match
                    const match = [];
                    for (let i = row - count; i < row; i++) {
                        match.push({ row: i, col });
                    }
                    matches.push(match);
                }
                
                count = 1;
                matchEmoji = gameBoard[row]?.[col]?.emoji;
            }
        }
    }
    
    return matches;
}

// Update hint button state and appearance
function updateHintButton() {
    if (!hintButton) return;
    
    // Clear any existing countdown interval
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    
    if (hintAvailable) {
        hintButton.classList.remove('disabled');
        hintButton.textContent = 'Hint';
    } else {
        hintButton.classList.add('disabled');
        let timeRemaining = Math.ceil(gameConfig.hintCooldown);
        hintButton.textContent = `Hint (${timeRemaining}s)`;
        
        // Update countdown timer
        countdownInterval = setInterval(() => {
            timeRemaining--;
            if (timeRemaining <= 0) {
                clearInterval(countdownInterval);
                countdownInterval = null;
                if (hintAvailable) {
                    hintButton.textContent = 'Hint';
                    hintButton.classList.remove('disabled');
                }
            } else {
                hintButton.textContent = `Hint (${timeRemaining}s)`;
            }
        }, 1000);
    }
}

// Show hint purchase option
function showHintPurchaseOption() {
    // Create a mini modal to offer options
    const modal = document.createElement('div');
    modal.className = 'mini-modal';
    modal.innerHTML = `
        <div class="mini-modal-content">
            <h3>Need a Hint?</h3>
            <p>You don't have any hints available.</p>
            <div class="mini-modal-buttons">
                <button id="watch-ad-for-hint">Watch Ad for Free Hint</button>
                <button id="buy-hints">Buy Hints</button>
                <button id="cancel-hint">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    document.getElementById('watch-ad-for-hint').addEventListener('click', () => {
        // Remove the modal
        document.body.removeChild(modal);
        
        // Show ad
        showRewardedAd(result => {
            if (result.success) {
                // If ad watched successfully, give a hint
                hintAvailable = true;
                showHint();
            }
        });
    });
    
    document.getElementById('buy-hints').addEventListener('click', () => {
        // Remove the modal
        document.body.removeChild(modal);
        
        // Redirect to shop
        window.location.href = 'shop.html';
    });
    
    document.getElementById('cancel-hint').addEventListener('click', () => {
        // Remove the modal
        document.body.removeChild(modal);
    });
}