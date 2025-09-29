class LevelSelectView {
  constructor() {
    this.view = document.getElementById("level-select-view")
    this.levelGrid = document.getElementById("level-grid")
    this.creditsDisplay = document.getElementById("credits-display-levels")
    this.shopButton = document.getElementById("shop-button-from-levels")
  }

  // Desenha os botões das fases na tela
  render(levels, unlockedLevel, handler) {
    this.levelGrid.innerHTML = "" // Limpa a grade antes de desenhar
    for (let i = 1; i <= 5; i++) {
      const button = document.createElement("button")
      button.textContent = i
      button.dataset.levelId = i

      if (i <= unlockedLevel) {
        button.className = "level-button unlocked"
        // Adiciona o evento de clique apenas para fases desbloqueadas
        button.addEventListener("click", () => {
          handler(i) // Chama o handler do Controller passando o nº da fase
        })
      } else {
        button.className = "level-button locked"
        button.textContent = "🔒"
      }
      this.levelGrid.appendChild(button)
    }
  }

  bindShopButton(handler) {
    this.shopButton.addEventListener("click", handler)
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
