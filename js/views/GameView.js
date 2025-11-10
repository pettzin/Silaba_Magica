class GameView {
  constructor() {
    this.view = document.getElementById("game-view")
    this.successSound = new Audio("audios/acerto.mp3")
    this.errorSound = new Audio("audios/erro.mp3")
    this.successSound.volume = 0.7
    this.errorSound.volume = 0.7
    this.model = null
  }

  setModel(model) {
    this.model = model
  }

  render(levelData, onComplete) {
    this.view.innerHTML = `
      <div id="game-view-content">
        <div class="game-card">
          <div class="game-header">
            <button id="back-to-levels-from-game" class="btn-back-header">⬅</button>
            <h2>${levelData.title}</h2>
          </div>
          
          <div class="reference-image-container">
            <img src="${levelData.image}" alt="${levelData.title}" class="reference-image">
          </div>
          
          <div class="story-section">
            <div class="story-text">
              <p>${levelData.story}</p>
            </div>
          </div>
          
          <div class="objective-banner">
            <p>${levelData.objective}</p>
          </div>
          
          <div class="syllable-info">
            <span class="hint-label">DICA:</span>
            <button class="hint-button" id="hint-button">❓</button>
          </div>
          
          <div class="hunt-section">
            <div class="hunt-header">Caça-Sílabas</div>
            <div class="grid-container">
              <div class="grid" id="game-grid"></div>
            </div>
          </div>
          
          <div id="feedback" class="feedback"></div>
        </div>
        
        <!-- Adicionando botões de controle de áudio -->
        <div class="audio-controls">
          <button id="music-toggle" class="audio-control-btn">
            🎵
          </button>
          <button id="sound-toggle" class="audio-control-btn">
            ${this.model?.state.soundEffectsEnabled ? "🔊" : "🔇"} 
          </button>
        </div>
        
        <div id="completion-modal" class="completion-modal">
          <div class="modal-content">
            <div class="modal-header">
              <h2>🎉 Parabéns! 🎉</h2>
              <p class="congratulations-message">Você completou a fase com sucesso!</p>
            </div>
            
            <div class="credits-earned">
              <div class="credits-icon">💰</div>
              <div class="credits-text">
                <span>Você ganhou</span>
                <div class="credits-amount" id="credits-earned-amount">50 créditos</div>
              </div>
            </div>
            
            <div class="rating-section">
              <p>Como você avalia esta fase?</p>
              <div class="stars-container">
                <span class="star" data-rating="1">⭐</span>
                <span class="star" data-rating="2">⭐</span>
                <span class="star" data-rating="3">⭐</span>
              </div>
            </div>
            
            <!-- Adicionado botão de reiniciar fase -->
            <div class="modal-actions">
              <button id="restart-level-button" class="btn-restart" title="Reiniciar Fase">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                </svg>
              </button>
              <button id="continue-button" class="btn-continue">Continuar</button>
            </div>
          </div>
        </div>
      </div>`

    this.startSyllableHunt(levelData.syllables, () => this.showCompletionModal(levelData, onComplete))
    this.bindHintButton(levelData.syllables)
    this.bindAudioControls()
  }

  showCompletionModal(levelData, onComplete) {
    const modal = document.getElementById("completion-modal")
    const creditsAmount = document.getElementById("credits-earned-amount")
    const continueButton = document.getElementById("continue-button")
    const restartButton = document.getElementById("restart-level-button")
    const stars = document.querySelectorAll(".star")

    creditsAmount.textContent = `${levelData.reward} créditos`

    let selectedRating = 0
    stars.forEach((star) => {
      star.addEventListener("click", () => {
        selectedRating = Number.parseInt(star.dataset.rating)
        this.updateStarDisplay(stars, selectedRating)
      })
      star.addEventListener("mouseover", () => {
        const hoverRating = Number.parseInt(star.dataset.rating)
        this.updateStarDisplay(stars, hoverRating, true)
      })
    })

    const starsContainer = document.querySelector(".stars-container")
    starsContainer.addEventListener("mouseleave", () => {
      this.updateStarDisplay(stars, selectedRating)
    })

    restartButton.addEventListener("click", () => {
      modal.classList.remove("show")
      setTimeout(() => {
        // Recarrega a mesma fase
        this.render(levelData, onComplete)
      }, 300)
    })

    continueButton.addEventListener("click", () => {
      modal.classList.remove("show")
      setTimeout(() => onComplete(), 300)
    })

    setTimeout(() => modal.classList.add("show"), 100)
  }

  updateStarDisplay(stars, rating, isHover = false) {
    stars.forEach((star, index) => {
      const starRating = index + 1
      star.classList.remove("filled", "hover")
      if (starRating <= rating) {
        star.classList.add(isHover ? "hover" : "filled")
      }
    })
  }

  bindBackButton(handler) {
    const backButton = document.getElementById("back-to-levels-from-game")
    if (backButton) backButton.addEventListener("click", handler)
  }

  bindHintButton(syllables) {
    this.syllables = syllables
    const hintButton = document.getElementById("hint-button")
    if (hintButton) {
      hintButton.addEventListener("click", () => {
        const remaining = this.syllables.filter((s) => !this.foundSyllables?.includes(s))
        if (remaining.length > 0) alert(`Procure pela sílaba: ${remaining[0]}`)
      })
    }
  }

  startSyllableHunt(syllablesToFind, onComplete) {
    const grid = document.getElementById("game-grid")
    const feedback = document.getElementById("feedback")
    const size = 8

    let selectedCells = []
    const foundSyllables = []
    this.foundSyllables = foundSyllables

    // Função para criar a matriz inicial
    const matrix = Array.from({ length: size }, () => Array.from({ length: size }, () => null))

    // Insere sílaba obrigatória de forma segura
    const insertSyllable = (syllable) => {
      let placed = false
      let attempts = 0

      while (!placed && attempts < 100) {
        const isHorizontal = Math.random() > 0.5
        const row = Math.floor(Math.random() * (isHorizontal ? size : size - syllable.length))
        const col = Math.floor(Math.random() * (isHorizontal ? size - syllable.length : size))

        let canPlace = true
        for (let i = 0; i < syllable.length; i++) {
          const r = isHorizontal ? row : row + i
          const c = isHorizontal ? col + i : col
          if (matrix[r][c] !== null) {
            canPlace = false
            break
          }
        }

        if (canPlace) {
          for (let i = 0; i < syllable.length; i++) {
            const r = isHorizontal ? row : row + i
            const c = isHorizontal ? col + i : col
            matrix[r][c] = syllable[i]
          }
          placed = true
        }

        attempts++
      }

      if (!placed) console.warn(`Não foi possível posicionar a sílaba: ${syllable}`)
    }

    // Inserir todas as sílabas obrigatórias
    syllablesToFind.forEach(insertSyllable)

    // Preencher espaços vazios com letras aleatórias
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!matrix[r][c]) matrix[r][c] = letters[Math.floor(Math.random() * letters.length)]
      }
    }

    // Renderiza grid
    grid.innerHTML = ""
    matrix.forEach((row) => {
      row.forEach((letter) => {
        const cell = document.createElement("div")
        cell.classList.add("cell")
        cell.textContent = letter
        grid.appendChild(cell)
      })
    })

    // Função para lidar com seleção de sílabas
    const handleSelectionEnd = () => {
      if (selectedCells.length === 0) return

      const word = selectedCells.map((c) => c.textContent).join("")
      if (syllablesToFind.includes(word) && !foundSyllables.includes(word)) {
        // Acerto
        if (this.model?.state.soundEffectsEnabled) {
          this.successSound.currentTime = 0
          this.successSound.play().catch(() => {})
        }

        feedback.textContent = `Você encontrou: ${word}!`
        feedback.className = "feedback sucesso"
        foundSyllables.push(word)
        selectedCells.forEach((c) => c.classList.add("correta"))

        if (foundSyllables.length === syllablesToFind.length) {
          feedback.textContent = "Parabéns! Fase completa!"
          feedback.className = "feedback vitoria"
          setTimeout(onComplete, 1500)
        }
      } else {
        // Erro
        if (this.model?.state.soundEffectsEnabled) {
          this.errorSound.currentTime = 0
          this.errorSound.play().catch(() => {})
        }

        feedback.textContent = "Tente novamente!"
        feedback.className = "feedback erro"
        selectedCells.forEach((c) => c.classList.remove("selecionada"))
      }

      selectedCells = []
    }

    // Eventos de seleção
    let isSelecting = false
    grid.addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("cell")) {
        isSelecting = true
        selectedCells.forEach((c) => c.classList.remove("selecionada"))
        selectedCells = [e.target]
        e.target.classList.add("selecionada")
      }
    })

    grid.addEventListener("mouseover", (e) => {
      if (isSelecting && e.target.classList.contains("cell") && !selectedCells.includes(e.target)) {
        selectedCells.push(e.target)
        e.target.classList.add("selecionada")
      }
    })

    document.addEventListener("mouseup", () => {
      if (isSelecting) {
        handleSelectionEnd()
        isSelecting = false
      }
    })
  }

  show() {
    this.view.style.display = "block"
  }
  hide() {
    this.view.style.display = "none"
  }

  bindAudioControls() {
    const musicToggle = document.getElementById("music-toggle")
    const soundToggle = document.getElementById("sound-toggle")

    if (musicToggle) {
      musicToggle.addEventListener("click", () => {
        const enabled = this.model.toggleMusic()
        musicToggle.textContent = `${enabled ? "🎵 " : "🔇"}`
      })
    }

    if (soundToggle) {
      soundToggle.addEventListener("click", () => {
        const enabled = this.model.toggleSoundEffects()
        soundToggle.textContent = `${enabled ? "🔊" : "🔇"}`
      })
    }
  }
}

window.GameView = GameView
