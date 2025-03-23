import { gameConfig } from './config.js';
import { initBattlePass } from './battle-pass.js';

document.addEventListener('DOMContentLoaded', () => {
    initBattlePass();
    
    // Set up theme selector event listeners
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', () => {
            const themeId = option.dataset.theme;
            selectBattlePassTheme(themeId);
        });
    });
});

function selectBattlePassTheme(themeId) {
    // Update the active battle pass in config
    gameConfig.activeBattlePass = themeId;
    
    // Save the selection to localStorage
    localStorage.setItem('herbMatchActiveBattlePass', themeId);
    
    // Reload the page to show the new battle pass
    window.location.reload();
}