class ShopView {
    constructor() {
        this.view = document.getElementById('shop-view');
        this.backButton = document.getElementById('back-to-levels-button');
        this.creditsDisplay = document.getElementById('credits-display-shop');
    }

    bindBackButton(handler) {
        this.backButton.addEventListener('click', handler);
    }
    
    updateCredits(credits) {
        this.creditsDisplay.textContent = `💰 ${credits}`;
    }

    show() {
        this.view.style.display = 'flex';
    }

    hide() {
        this.view.style.display = 'none';
    }
}