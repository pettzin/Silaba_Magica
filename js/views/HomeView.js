class HomeView {
  constructor() {
    this.view = document.getElementById("home-view")
    this.playButton = document.getElementById("play-button")
    this.creditsDisplay = document.getElementById("credits-display-home")
    this.model = null
  }

  setModel(model) {
    this.model = model
    this.renderAudioControls()
  }

  renderAudioControls() {
    // Remove controles existentes se houver
    const existingControls = this.view.querySelector(".audio-controls")
    if (existingControls) {
      existingControls.remove()
    }

    const audioControls = document.createElement("div")
    audioControls.className = "audio-controls"
    audioControls.innerHTML = `
      <button id="home-music-toggle" class="audio-control-btn" title="${this.model?.state.musicEnabled ? "Música: ON" : "Música: OFF"}">
        ${this.model?.state.musicEnabled ? "🎵" : "🔇"}
      </button>
      <button id="home-sound-toggle" class="audio-control-btn" title="${this.model?.state.soundEffectsEnabled ? "Efeitos: ON" : "Efeitos: OFF"}">
        ${this.model?.state.soundEffectsEnabled ? "🔊" : "🔇"}
      </button>
    `
    this.view.appendChild(audioControls)

    this.bindAudioControls()
  }

  bindAudioControls() {
    const musicToggle = document.getElementById("home-music-toggle")
    const soundToggle = document.getElementById("home-sound-toggle")

    if (musicToggle) {
      musicToggle.addEventListener("click", () => {
        const enabled = this.model.toggleMusic()
        musicToggle.textContent = enabled ? "🎵" : "🔇"
        musicToggle.title = enabled ? "Música: ON" : "Música: OFF"
      })
    }

    if (soundToggle) {
      soundToggle.addEventListener("click", () => {
        const enabled = this.model.toggleSoundEffects()
        soundToggle.textContent = enabled ? "🔊" : "🔇"
        soundToggle.title = enabled ? "Efeitos: ON" : "Efeitos: OFF"
      })
    }
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

window.HomeView = HomeView
