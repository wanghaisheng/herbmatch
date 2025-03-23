import { gameConfig } from './config.js';
import { initShop, processPurchase, showRewardedAd } from './shop.js';

let shopData = null;
let selectedItem = null;

document.addEventListener('DOMContentLoaded', () => {
    initShopPage();
    
    // Add event listeners
    document.getElementById('watch-ad-button').addEventListener('click', watchRewardedAd);
    document.getElementById('confirm-purchase').addEventListener('click', confirmPurchase);
    document.getElementById('cancel-purchase').addEventListener('click', cancelPurchase);
    document.getElementById('close-success').addEventListener('click', closeSuccessModal);
});

function initShopPage() {
    // Initialize shop and get data
    shopData = initShop();
    
    // Update inventory display
    updateInventoryDisplay();
    
    // Render shop items
    renderShopItems();
}

function updateInventoryDisplay() {
    document.getElementById('hint-count').textContent = shopData.inventory.hints;
    document.getElementById('boost-count').textContent = shopData.inventory.timeBoosts;
    
    const premiumStatus = document.getElementById('premium-status');
    const premiumLabel = document.getElementById('premium-label');
    
    if (shopData.inventory.premiumStatus) {
        premiumStatus.classList.add('active');
        premiumLabel.textContent = 'Premium Account';
    } else {
        premiumStatus.classList.remove('active');
        premiumLabel.textContent = 'Free Account';
    }
}

function renderShopItems() {
    const container = document.getElementById('shop-container');
    container.innerHTML = '';
    
    shopData.items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'shop-item';
        
        if (item.bestValue) {
            itemEl.classList.add('best-value');
        }
        
        if (item.limitedTime) {
            itemEl.classList.add('limited-time');
        }
        
        itemEl.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <div class="item-name">${item.name}</div>
            <div class="item-description">${item.description}</div>
            <div class="item-price">
                ${item.originalPrice ? `<span class="original-price">$${item.originalPrice}</span>` : ''}
                $${item.price}
            </div>
        `;
        
        itemEl.addEventListener('click', () => {
            openPurchaseModal(item);
        });
        
        container.appendChild(itemEl);
    });
}

function openPurchaseModal(item) {
    selectedItem = item;
    
    const detailsEl = document.getElementById('purchase-details');
    detailsEl.innerHTML = `
        <div class="purchase-item">
            <div class="purchase-icon">${item.icon}</div>
            <div class="purchase-name">${item.name}</div>
            <div class="purchase-description">${item.description}</div>
            <div class="purchase-price">$${item.price} ${item.currency}</div>
        </div>
    `;
    
    const modal = document.getElementById('purchase-modal');
    modal.classList.add('show');
}

function confirmPurchase() {
    if (!selectedItem) return;
    
    // Process the purchase
    const result = processPurchase(selectedItem.id);
    
    if (result.success) {
        // Close purchase modal
        document.getElementById('purchase-modal').classList.remove('show');
        
        // Show success animation (in a real app, this would happen after purchase confirmation)
        setTimeout(() => {
            showSuccessModal(selectedItem);
            // Update shop data and display
            shopData = initShop();
            updateInventoryDisplay();
        }, 1000);
    } else {
        // Show error
        alert(result.message);
    }
}

function cancelPurchase() {
    document.getElementById('purchase-modal').classList.remove('show');
    selectedItem = null;
}

function showSuccessModal(item) {
    const detailsEl = document.getElementById('success-details');
    detailsEl.innerHTML = `
        <p>Thank you for your purchase!</p>
        <div class="success-item">${item.icon} ${item.name}</div>
        <p>The item has been added to your inventory.</p>
    `;
    
    document.getElementById('success-modal').classList.add('show');
}

function closeSuccessModal() {
    document.getElementById('success-modal').classList.remove('show');
}

function watchRewardedAd() {
    // Disable button during ad
    const adButton = document.getElementById('watch-ad-button');
    adButton.disabled = true;
    adButton.textContent = 'Loading Ad...';
    
    showRewardedAd(result => {
        if (result.success) {
            // Add hint to inventory
            shopData.inventory.hints += result.reward;
            
            // Update display
            updateInventoryDisplay();
            
            // Save data
            initShop();
            
            // Re-enable button
            adButton.disabled = false;
            adButton.textContent = 'Watch Ad';
            
            // Show success message
            showMessage('You earned a free hint!');
        } else {
            // Error handling
            adButton.disabled = false;
            adButton.textContent = 'Watch Ad';
            showMessage('Failed to load ad. Please try again.');
        }
    });
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