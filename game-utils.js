// New utility file to reduce load on game.js
import { gameConfig } from './config.js';

// This function handles checking if the game board has valid moves
export function hasValidMoves(gameBoard, boardSize) {
    if (!gameBoard) return false;
    
    // Check for potential horizontal matches
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize - 1; col++) {
            // Skip if any position is null
            if (!gameBoard[row] || !gameBoard[row][col] || !gameBoard[row][col+1]) continue;
            
            // Try swapping with right neighbor
            swapHerbs(gameBoard, row, col, row, col + 1);
            const matches = findMatches(gameBoard, boardSize);
            swapHerbs(gameBoard, row, col + 1, row, col); // Swap back
            
            if (matches.length > 0) {
                return true;
            }
        }
    }
    
    // Check for potential vertical matches
    for (let row = 0; row < boardSize - 1; row++) {
        for (let col = 0; col < boardSize; col++) {
            // Skip if any position is null
            if (!gameBoard[row] || !gameBoard[row+1] || !gameBoard[row][col] || !gameBoard[row+1][col]) continue;
            
            // Try swapping with bottom neighbor
            swapHerbs(gameBoard, row, col, row + 1, col);
            const matches = findMatches(gameBoard, boardSize);
            swapHerbs(gameBoard, row + 1, col, row, col); // Swap back
            
            if (matches.length > 0) {
                return true;
            }
        }
    }
    
    return false;
}

// Helper function to swap herbs (moved from game.js)
export function swapHerbs(gameBoard, row1, col1, row2, col2) {
    // Check if positions exist
    if (!gameBoard[row1] || !gameBoard[row2] || !gameBoard[row1][col1] || !gameBoard[row2][col2]) {
        console.error("Invalid position in swapHerbs:", row1, col1, row2, col2);
        return;
    }
    
    // Swap in data structure
    const temp = gameBoard[row1][col1];
    gameBoard[row1][col1] = gameBoard[row2][col2];
    gameBoard[row2][col2] = temp;
}

// Function to find matches (moved from game.js)
export function findMatches(gameBoard, boardSize) {
    const matches = [];
    
    // Check horizontal matches
    for (let row = 0; row < boardSize; row++) {
        if (!gameBoard[row]) continue;
        let count = 1;
        let matchEmoji = gameBoard[row][0]?.emoji;
        
        for (let col = 1; col < boardSize; col++) {
            if (gameBoard[row] && gameBoard[row][col] && matchEmoji && gameBoard[row][col].emoji === matchEmoji) {
                count++;
                
                if (col === boardSize - 1 && count >= 3) {
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
    for (let col = 0; col < boardSize; col++) {
        let count = 1;
        let matchEmoji = gameBoard[0]?.[col]?.emoji;
        
        for (let row = 1; row < boardSize; row++) {
            if (gameBoard[row] && gameBoard[row][col] && matchEmoji && gameBoard[row][col].emoji === matchEmoji) {
                count++;
                
                if (row === boardSize - 1 && count >= 3) {
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