class GameController {
  constructor(model, views) {
    this.model = model
    this.views = views // {home, levelSelect, game, shop}
    this.avatar = null // Avatar será adicionado depois

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

    // 2. Vincula os botões de voltar
    this.views.shop.bindBackButton(this.showLevelSelect)
    this.views.levelSelect.bindBackButton(this.showHome)
    // O botão de voltar da GameView será vinculado quando a fase for renderizada

    // 3. Vincula o botão da loja na seleção de fases
    this.views.levelSelect.bindShopButton(this.showShop)

    // 4. Inicia na tela inicial
    this.showHome()
  }

  // Define o background do body conforme a fase
  _setBodyBackground(levelId = null) {
    const body = document.body

    body.classList.remove(
      "default-background",
      "game-background",
      "game-background-2",
      "game-background-3",
      "game-background-4",
    )

    if (levelId === 1) {
      // Fase 1: usa a imagem blur como background
      body.classList.add("game-background")
    } else if (levelId === 2) {
      // Fase 2: usa a imagem blur do menino e cachorro
      body.classList.add("game-background-2")
    } else if (levelId === 3) {
      // Fase 3: usa a imagem blur da bola da alegria
      body.classList.add("game-background-3")
    } else if (levelId === 4) {
      // Fase 4: usa a imagem blur da princesa feliz
      body.classList.add("game-background-4")
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

    // Mensagem do avatar
    if (this.avatar) {
      setTimeout(() => {
        this.avatar.showRandomMessage("home")
      }, 500)
    }
  }

  showLevelSelect() {
    this._hideAllViews()
    this._updateAllCredits()
    this._setBodyBackground()

    // Renderiza a grade de fases com os dados mais recentes do modelo
    this.views.levelSelect.render(this.model.levels, this.model.state.unlockedLevel, this.showGame)

    this.views.levelSelect.show()

    // Mensagem do avatar
    if (this.avatar) {
      setTimeout(() => {
        this.avatar.showRandomMessage("levelSelect")
      }, 500)
    }
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

    // Mensagem do avatar
    if (this.avatar) {
      setTimeout(() => {
        this.avatar.showRandomMessage("gameStart")
      }, 500)
    }
  }

  showShop() {
    console.log("Abrindo loja...")
    this._hideAllViews()
    this._updateAllCredits()
    this._setBodyBackground()

    // Renderiza a loja com as skins disponíveis
    const availableSkins = this.model.getAvailableSkins()
    const ownedSkins = this.model.state.ownedSkins
    const currentSkin = this.model.state.currentSkin

    console.log("Skins disponíveis:", availableSkins)
    console.log("Skins possuídas:", ownedSkins)
    console.log("Skin atual:", currentSkin)

    this.views.shop.render(
      availableSkins,
      ownedSkins,
      currentSkin,
      (skinId) => this.handleBuySkin(skinId),
      (skinId) => this.handleEquipSkin(skinId),
    )

    this.views.shop.show()
    console.log("Loja exibida!")

    // Mensagem do avatar
    if (this.avatar) {
      setTimeout(() => {
        this.avatar.showRandomMessage("shop")
      }, 500)
    }
  }

  handleBuySkin(skinId) {
    const result = this.model.buySkin(skinId)

    if (result.success) {
      this.views.shop.showMessage(result.message, "success")
      this._updateAllCredits()

      // Re-renderiza a loja
      setTimeout(() => {
        this.showShop()
      }, 1000)

      // Celebra com o avatar
      if (this.avatar) {
        this.avatar.celebrate()
      }
    } else {
      this.views.shop.showMessage(result.message, "error")
    }
  }

  handleEquipSkin(skinId) {
    const result = this.model.equipSkin(skinId)

    if (result.success) {
      this.views.shop.showMessage(result.message, "success")

      // Atualiza a skin do avatar
      if (this.avatar && result.skinPath) {
        this.avatar.changeSkin(result.skinPath)
        this.avatar.celebrate()
      }

      // Re-renderiza a loja
      setTimeout(() => {
        this.showShop()
      }, 800)
    } else {
      this.views.shop.showMessage(result.message, "error")
    }
  }

  handleLevelComplete(levelId) {
    console.log(`Fase ${levelId} completa!`)
    this.model.completeLevel(levelId)

    // Celebração do avatar
    if (this.avatar) {
      this.avatar.celebrate()
      this.avatar.showRandomMessage("gameComplete")
    }

    // Aguarda um pouco antes de voltar
    setTimeout(() => {
      this.showLevelSelect()
    }, 1500)
  }
}
