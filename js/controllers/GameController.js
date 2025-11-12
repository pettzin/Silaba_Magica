class GameController {
  constructor(model, views) {
    this.model = model
    this.views = views // {home, levelSelect, game, shop}
    this.avatar = null // Avatar será adicionado depois

    this.views.home.setModel(model)
    this.views.game.setModel(model)

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
      "game-background-5",
      "game-background-6",
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
    } else if (levelId === 5) {
      // Fase 5: usa a imagem blur da nova skin
      body.classList.add("game-background-5")
    } else if (levelId === 6) {
      // Fase 6 (secreta): usa background especial tesouro
      body.classList.add("game-background-6")
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
    this.model.stopBackgroundMusic()
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
    this.model.stopBackgroundMusic()

    // Verifica fases secretas desbloqueadas
    this.model.checkSecretLevels()

    // Renderiza a grade de fases com os dados mais recentes do modelo
    this.views.levelSelect.render(this.model.levels, this.model.state.unlockedLevel, this.showGame, (levelId) => this.model.isSecretLevelUnlocked(levelId))

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
    this.model.playBackgroundMusic()

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
    this.model.stopBackgroundMusic()

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

      // Celebra com o avatar
      if (this.avatar) {
        this.avatar.celebrate()
      }

      // Se desbloqueou uma fase secreta, mostra popup e marca como desbloqueada
      if (result.unlockedSecret) {
        this.model.checkSecretLevels()
        this._showSecretLevelPopup(result.unlockedSecret)
      }

      // Re-renderiza a loja
      setTimeout(() => {
        this.showShop()
      }, 1000)
    } else {
      this.views.shop.showMessage(result.message, "error")
    }
  }

  _showSecretLevelPopup(secretLevel) {
    const popup = document.createElement('div')
    popup.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      animation: fadeIn 0.3s ease-in;
    `
    popup.innerHTML = `
      <div style="
        background: linear-gradient(135deg,#6c63ff,#00c6ff);
        padding: 40px;
        border-radius: 20px;
        max-width: 500px;
        text-align: center;
        color: white;
        box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        animation: slideUp 0.5s ease-out;
      ">
        <div style="font-size: 60px; margin-bottom: 20px;">🏴‍☠️ 🗺️ 💎</div>
        <h2 style="font-size: 28px; margin: 20px 0; font-weight: bold;">FASE SECRETA DESBLOQUEADA!</h2>
        <p style="font-size: 18px; margin: 15px 0; line-height: 1.5;">
          Parabéns! Você desbloqueou a <strong>Fase ${secretLevel.id}: ${secretLevel.title}</strong>!
        </p>
        <p style="font-size: 14px; margin: 15px 0; opacity: 0.9;">
          Uma aventura mágica te espera. Procure por ela na seleção de fases.
        </p>
        <div style="font-size: 16px; margin: 20px 0; background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px;">
          Recompensa: <strong>${secretLevel.reward} créditos extras!</strong>
        </div>
        <button style="
          background: white;
          color: #6c63ff;
          border: none;
          padding: 12px 30px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 20px;
        " onclick="this.parentElement.parentElement.remove()">
          🎉 Legal! Vou jogar!
        </button>
      </div>
      <style>
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      </style>
    `
    document.body.appendChild(popup)
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

window.GameController = GameController
