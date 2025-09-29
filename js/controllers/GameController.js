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
    // Botão "Jogar" da home
    this.views.home.bindPlayButton(this.showLevelSelect)
    // Botão da loja na seleção de fases
    this.views.levelSelect.bindShopButton(this.showShop)
    // Botão de voltar da loja
    this.views.shop.bindBackButton(this.showLevelSelect)
    // Inicia na tela inicial
    this.showHome()
  }

  // Define o background do body conforme a fase
  _setBodyBackground(levelId = null) {
    const body = document.body
    body.classList.remove("default-background", "game-background", "game-background-2")

    if (levelId === 1) {
      body.classList.add("game-background") // Fase 1
    } else if (levelId === 2) {
      body.classList.add("game-background-2") // Fase 2
    } else {
      body.classList.add("default-background") // Outras telas
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
