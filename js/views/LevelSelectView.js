class LevelSelectView {
  constructor() {
    this.view = document.getElementById("level-select-view")
    this.levelGrid = document.getElementById("level-grid")
    this.creditsDisplay = document.getElementById("credits-display-levels")
    this.shopButton = document.getElementById("shop-button-from-levels")
    this.backButton = document.getElementById("back-to-home-button")
  }

  render(levels, unlockedLevel, handler, isSecretUnlocked) {
    this.levelGrid.innerHTML = ""
    
    // Renderiza fases normais (1-5)
    for (let i = 1; i <= 5; i++) {
      const button = document.createElement("button")
      button.textContent = i
      button.dataset.levelId = i

      if (i <= unlockedLevel) {
        button.className = "level-button unlocked"
        button.addEventListener("click", () => {
          handler(i)
        })
      } else {
        button.className = "level-button locked"
        button.textContent = "🔒"
      }
      this.levelGrid.appendChild(button)
    }

    // Renderiza fase 6 secreta se desbloqueada
    if (isSecretUnlocked && isSecretUnlocked(6)) {
      const secretButton = document.createElement("button")
      secretButton.textContent = "🏴‍☠️"
      secretButton.dataset.levelId = 6
      secretButton.className = "level-button unlocked secret-level"
      secretButton.title = "Tesouro Escondido (FASE SECRETA)"
      secretButton.addEventListener("click", () => {
        handler(6)
      })
      this.levelGrid.appendChild(secretButton)
    }
  }

  bindShopButton(handler) {
    if (this.shopButton) {
      this.shopButton.addEventListener("click", handler)
    }
  }

  bindBackButton(handler) {
    if (this.backButton) {
      this.backButton.addEventListener("click", handler)
    }
  }

  updateCredits(credits) {
    this.creditsDisplay.textContent = `💰 ${credits}`
  }

  show() {
    this.view.style.display = "flex"
  }

  hide() {
    this.view.style.display = "none"
  }
}

window.LevelSelectView = LevelSelectView
