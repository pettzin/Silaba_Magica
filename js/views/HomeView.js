class HomeView {
  constructor() {
    this.view = document.getElementById("home-view")
    this.playButton = document.getElementById("play-button")
    this.creditsDisplay = document.getElementById("credits-display-home")
  }

  // Adiciona um "ouvinte" ao botão Jogar. Quando clicado, ele chamará a função
  // que o Controller nos enviar (o handler).
  bindPlayButton(handler) {
    this.playButton.addEventListener("click", handler)
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
