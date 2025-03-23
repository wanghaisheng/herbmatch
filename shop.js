import { gameConfig } from './config.js';

// Shop state
let shopItems = [];
let userInventory = {
    hints: 0,
    timeBoosts: 0,
    premiumStatus: false,
    purchasedItems: []
};

// Initialize shop system
export function initShop() {
    loadShopData();
    
    // Check for simulated purchase completion (in a real app, this would be integrated with payment provider callbacks)
    const pendingPurchase = localStorage.getItem('herbMatchPendingPurchase');
    if (pendingPurchase) {
        completePurchase(JSON.parse(pendingPurchase));
        localStorage.removeItem('herbMatchPendingPurchase');
    }
    
    return {
        items: shopItems,
        inventory: userInventory
    };
}

// Load shop data from localStorage
function loadShopData() {
    shopItems = generateShopItems();
    
    const savedInventory = JSON.parse(localStorage.getItem('herbMatchInventory'));
    if (savedInventory) {
        userInventory = savedInventory;
    }
}

// Save shop data
function saveShopData() {
    localStorage.setItem('herbMatchInventory', JSON.stringify(userInventory));
}

// Generate shop items
function generateShopItems() {
    return [
        // Hint packages
        {
            id: 'hints_small',
            name: '5 Hints',
            description: 'Get 5 hints to help you with difficult levels',
            price: 0.99,
            currency: 'USD',
            category: 'hints',
            icon: '💡',
            quantity: 5
        },
        {
            id: 'hints_medium',
            name: '20 Hints',
            description: 'Get 20 hints to help you with difficult levels',
            price: 2.99,
            currency: 'USD',
            category: 'hints',
            icon: '💡',
            quantity: 20,
            bestValue: true
        },
        
        // Time boosts
        {
            id: 'time_small',
            name: 'Small Time Boost',
            description: '+15 seconds on your next 3 games',
            price: 0.99,
            currency: 'USD',
            category: 'timeBoost',
            icon: '⏱️',
            quantity: 3,
            boostAmount: 15
        },
        {
            id: 'time_large',
            name: 'Large Time Boost',
            description: '+30 seconds on your next 5 games',
            price: 1.99,
            currency: 'USD',
            category: 'timeBoost',
            icon: '⏱️',
            quantity: 5,
            boostAmount: 30
        },
        
        // Premium battle pass
        {
            id: 'premium_pass',
            name: 'Premium Battle Pass',
            description: 'Unlock premium rewards on all battle passes',
            price: 4.99,
            currency: 'USD',
            category: 'subscription',
            icon: '👑',
            duration: '1 month'
        },
        
        // Special bundles
        {
            id: 'starter_bundle',
            name: 'Starter Bundle',
            description: '10 hints, 3 time boosts, and premium battle pass access',
            price: 6.99,
            originalPrice: 9.97,
            currency: 'USD',
            category: 'bundle',
            icon: '🎁',
            contents: ['10 hints', '3 time boosts', 'Premium Pass (1 week)'],
            limitedTime: true
        }
    ];
}

// Process a purchase
export function processPurchase(itemId) {
    const item = shopItems.find(item => item.id === itemId);
    
    if (!item) return { success: false, message: 'Item not found' };
    
    // In a real app, this is where you would integrate with in-app purchases
    // For this demo, we'll simulate a successful purchase
    
    // Store pending purchase for simulation
    localStorage.setItem('herbMatchPendingPurchase', JSON.stringify(item));
    
    return { success: true, message: 'Processing purchase...' };
}

// Complete a purchase (add items to inventory)
function completePurchase(item) {
    // Add purchased items to inventory
    switch (item.category) {
        case 'hints':
            userInventory.hints += item.quantity;
            break;
        case 'timeBoost':
            userInventory.timeBoosts += item.quantity;
            break;
        case 'subscription':
            userInventory.premiumStatus = true;
            // In a real app, you would store subscription expiration date
            break;
        case 'bundle':
            // Process each item in the bundle
            if (item.id === 'starter_bundle') {
                userInventory.hints += 10;
                userInventory.timeBoosts += 3;
                userInventory.premiumStatus = true;
            }
            break;
    }
    
    // Add to purchased items
    userInventory.purchasedItems.push({
        id: item.id,
        name: item.name,
        purchaseDate: new Date().toISOString()
    });
    
    saveShopData();
    
    // Show purchase confirmation
    showPurchaseConfirmation(item);
}

// Display purchase confirmation
function showPurchaseConfirmation(item) {
    // Implementation would be in the UI file
    console.log(`Purchase completed: ${item.name}`);
}

// Use a hint from inventory
export function useHint() {
    if (userInventory.hints > 0) {
        userInventory.hints--;
        saveShopData();
        return true;
    }
    return false;
}

// Use a time boost from inventory
export function useTimeBoost() {
    if (userInventory.timeBoosts > 0) {
        userInventory.timeBoosts--;
        saveShopData();
        return true;
    }
    return false;
}

// Check premium status
export function isPremium() {
    return userInventory.premiumStatus;
}

// Simulated ad system (in a real app, this would integrate with ad networks)
export function showRewardedAd(callback) {
    // Simulate ad view
    setTimeout(() => {
        callback({ success: true, reward: 1 }); // Reward 1 hint
    }, 1000);
}