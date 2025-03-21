import { gameConfig } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    // Load saved settings
    loadSettings();
    
    // Set up event listeners
    document.getElementById('save-settings').addEventListener('click', saveSettings);
    document.getElementById('reset-settings').addEventListener('click', resetSettings);
    document.getElementById('theme').addEventListener('change', updateTheme);
});

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('herbMatchSettings')) || {};
    
    // Set form values based on saved settings
    document.getElementById('difficulty').value = settings.difficulty || 'medium';
    document.getElementById('sound-toggle').checked = settings.sound !== false;
    document.getElementById('music-toggle').checked = settings.music !== false;
    document.getElementById('theme').value = settings.theme || 'green';
    document.getElementById('username').value = settings.username || '';
    
    // Apply the theme
    updateTheme();
}

function saveSettings() {
    const settings = {
        difficulty: document.getElementById('difficulty').value,
        sound: document.getElementById('sound-toggle').checked,
        music: document.getElementById('music-toggle').checked,
        theme: document.getElementById('theme').value,
        username: document.getElementById('username').value
    };
    
    // Save to localStorage
    localStorage.setItem('herbMatchSettings', JSON.stringify(settings));
    
    // Show success message
    showMessage('Settings saved successfully!');
}

function resetSettings() {
    // Default settings
    const defaultSettings = {
        difficulty: 'medium',
        sound: true,
        music: true,
        theme: 'green',
        username: ''
    };
    
    // Save default settings
    localStorage.setItem('herbMatchSettings', JSON.stringify(defaultSettings));
    
    // Update form
    document.getElementById('difficulty').value = defaultSettings.difficulty;
    document.getElementById('sound-toggle').checked = defaultSettings.sound;
    document.getElementById('music-toggle').checked = defaultSettings.music;
    document.getElementById('theme').value = defaultSettings.theme;
    document.getElementById('username').value = defaultSettings.username;
    
    // Apply theme
    updateTheme();
    
    // Show success message
    showMessage('Settings reset to default!');
}

function updateTheme() {
    const theme = document.getElementById('theme').value;
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
}

function showMessage(message) {
    // Create message element if it doesn't exist
    let messageElement = document.getElementById('message');
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'message';
        messageElement.className = 'message';
        document.querySelector('.game-container').appendChild(messageElement);
    }
    
    // Show message
    messageElement.textContent = message;
    messageElement.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        messageElement.classList.remove('show');
    }, 3000);
}