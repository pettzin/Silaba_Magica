class GameController {
  constructor(model, views) {
    this.model = model
    this.views = views // {home, levelSelect, game, shop}

    // Garante que o 'this' dentro das funções sempre se refira ao controller
    this.showLevelSelect = this.showLevelSelect.bind(this)
    this.showGame = this.showGame.bind(this)
    this.handleLevelComplete = this.handleLevelComplete.bind(this)
    this.showShop = this.showShop.bind(this)
    this.showHome = this.showHome.bind(this)
  }

  // Inicializa o jogo
  init() {
    // 1. Vincula o botão "Jogar" da HomeView para chamar a função showLevelSelect
    this.views.home.bindPlayButton(this.showLevelSelect)

    // 2. Vincula os botões de voltar para a tela de seleção de fases
    this.views.shop.bindBackButton(this.showLevelSelect)
    // O botão de voltar da GameView será vinculado quando a fase for renderizada

    // 3. Vincula o botão da loja na seleção de fases
    this.views.levelSelect.bindShopButton(this.showShop)

    // 4. Inicia na tela inicial
    this.views.shop.bindBackButton(this.showLevelSelect)
    this.showHome()
  }

  // Define o background do body conforme a fase
  _setBodyBackground(levelId = null) {
    const body = document.body

    // Remove todas as classes de background
    body.classList.remove("default-background", "game-background", "game-background-2")

    if (levelId === 1) {
      // Fase 1: usa a imagem blur como background
      body.classList.add("game-background")
    } else if (levelId === 2) {
      // Fase 2: usa a imagem blur do menino e cachorro
      body.classList.add("game-background-2")
    } else {
      // Todas as outras telas: background padrão #333
      body.classList.add("default-background")
    }
  }

  // Atualiza a exibição de créditos em todas as telas
  _updateAllCredits() {
    const credits = this.model.state.credits
    this.views.home.updateCredits(credits)
    this.views.levelSelect.updateCredits(credits)
    this.views.shop.updateCredits(credits)
  }

  // Esconde todas as telas
  _hideAllViews() {
    this.views.home.hide()
    this.views.levelSelect.hide()
    this.views.game.hide()
    this.views.shop.hide()
  }

  showHome() {
    this._hideAllViews()
    this._updateAllCredits()
    this._setBodyBackground()
    this.views.home.show()
  }

  showLevelSelect() {
    this._hideAllViews()
    this._updateAllCredits()
    this._setBodyBackground()

    // Renderiza a grade de fases com os dados mais recentes do modelo
    this.views.levelSelect.render(
      this.model.levels,
      this.model.state.unlockedLevel,
      this.showGame
    )

    this.views.levelSelect.show()
  }

  showGame(levelId) {
    const levelData = this.model.getLevelData(levelId)
    if (!levelData) return

    this._hideAllViews()
    this._setBodyBackground(levelId)

    // Renderiza a tela do jogo
    this.views.game.render(levelData, () => this.handleLevelComplete(levelId))
    this.views.game.bindBackButton(this.showLevelSelect)
    this.views.game.show()
  }

  showShop() {
    this._hideAllViews()
    this._updateAllCredits()
    this._setBodyBackground()
    this.views.shop.show()
  }

  handleLevelComplete(levelId) {
    console.log(`Fase ${levelId} completa!`)
    this.model.completeLevel(levelId)
    this.showLevelSelect()
  }
}
