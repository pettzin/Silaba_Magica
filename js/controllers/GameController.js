class GameController {
    constructor(model, views) {
        this.model = model;
        this.views = views; // {home, levelSelect, game, shop}

        // Garante que o 'this' dentro das funções sempre se refira ao controller
        this.showLevelSelect = this.showLevelSelect.bind(this);
        this.showGame = this.showGame.bind(this);
        this.handleLevelComplete = this.handleLevelComplete.bind(this);
        this.showShop = this.showShop.bind(this);
        this.showHome = this.showHome.bind(this);
    }

    // Método inicial para configurar o jogo
    init() {
        // 1. Vincula o botão "Jogar" da HomeView para chamar a função showLevelSelect
        this.views.home.bindPlayButton(this.showLevelSelect);

        // 2. Vincula os botões de voltar para a tela de seleção de fases
        this.views.shop.bindBackButton(this.showLevelSelect);
        // O botão de voltar da GameView será vinculado quando a fase for renderizada
        
        // 3. Vincula o botão da loja
        this.views.levelSelect.bindShopButton(this.showShop);

        // 4. Inicia na tela inicial
        this.showHome();
    }
    
    // Atualiza a exibição de créditos em todas as telas visíveis
    _updateAllCredits() {
        const credits = this.model.state.credits;
        this.views.home.updateCredits(credits);
        this.views.levelSelect.updateCredits(credits);
        this.views.shop.updateCredits(credits);
    }

    // Esconde todas as telas
    _hideAllViews() {
        this.views.home.hide();
        this.views.levelSelect.hide();
        this.views.game.hide();
        this.views.shop.hide();
    }

    showHome() {
        this._hideAllViews();
        this._updateAllCredits();
        this.views.home.show();
    }

    showLevelSelect() {
        this._hideAllViews();
        this._updateAllCredits();
        
        // Renderiza a grade de fases com os dados mais recentes do modelo
        this.views.levelSelect.render(
            this.model.levels,
            this.model.state.unlockedLevel,
            this.showGame // Passa a função que deve ser chamada ao clicar numa fase
        );
        
        this.views.levelSelect.show();
    }

    showGame(levelId) {
        const levelData = this.model.getLevelData(levelId);
        if (levelData) {
            this._hideAllViews();
            
            // Renderiza a tela do jogo com os dados da fase específica
            this.views.game.render(levelData, () => this.handleLevelComplete(levelId));
            this.views.game.bindBackButton(this.showLevelSelect); // Vincula o botão voltar
            this.views.game.show();
        }
    }
    
    showShop() {
        this._hideAllViews();
        this._updateAllCredits();
        this.views.shop.show();
    }

    handleLevelComplete(levelId) {
        console.log(`Fase ${levelId} completa!`);
        this.model.completeLevel(levelId);
        // Volta para a tela de seleção de fases, que será re-renderizada com o progresso atualizado
        this.showLevelSelect();
    }
}