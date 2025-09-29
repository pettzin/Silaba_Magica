class GameView {
  constructor() {
    this.view = document.getElementById("game-view")
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
            
            <button id="continue-button" class="btn-continue">Continuar</button>
          </div>
        </div>
      </div>`

    this.startSyllableHunt(levelData.syllables, () =>
      this.showCompletionModal(levelData, onComplete),
    )
    this.bindHintButton(levelData.syllables)
  }

  showCompletionModal(levelData, onComplete) {
    const modal = document.getElementById("completion-modal")
    const creditsAmount = document.getElementById("credits-earned-amount")
    const continueButton = document.getElementById("continue-button")
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
    this.currentSyllableIndex = 0

    const hintButton = document.getElementById("hint-button")
    if (hintButton) {
      hintButton.addEventListener("click", () => {
        if (this.currentSyllableIndex < this.syllables.length) {
          const currentSyllable = this.syllables[this.currentSyllableIndex]
          alert(`Procure pela sílaba: ${currentSyllable}`)
        }
      })
    }
  }

  startSyllableHunt(syllablesToFind, onComplete) {
    const grid = document.getElementById("game-grid")
    const feedback = document.getElementById("feedback")

    let selectedCells = []
    const foundSyllables = []
    let currentSyllableIndex = 0

    this.currentSyllableIndex = currentSyllableIndex

    function generateGrid() {
      grid.innerHTML = ""
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      const matrix = Array.from({ length: 8 }, () =>
        Array.from({ length: 8 }, () => letters[Math.floor(Math.random() * letters.length)]),
      )

      syllablesToFind.forEach((syllable) => {
        const isHorizontal = Math.random() > 0.5
        if (isHorizontal) {
          const row = Math.floor(Math.random() * 8)
          const col = Math.floor(Math.random() * (8 - syllable.length))
          for (let i = 0; i < syllable.length; i++) {
            matrix[row][col + i] = syllable[i]
          }
        } else {
          const row = Math.floor(Math.random() * (8 - syllable.length))
          const col = Math.floor(Math.random() * 8)
          for (let i = 0; i < syllable.length; i++) {
            matrix[row + i][col] = syllable[i]
          }
        }
      })

      matrix.forEach((row) => {
        row.forEach((letter) => {
          const cell = document.createElement("div")
          cell.classList.add("cell")
          cell.textContent = letter
          grid.appendChild(cell)
        })
      })
    }

    function handleSelectionEnd() {
      if (selectedCells.length === 0) return

      const word = selectedCells.map((cell) => cell.textContent).join("")
      const currentSyllable = syllablesToFind[currentSyllableIndex]

      if (word === currentSyllable && !foundSyllables.includes(word)) {
        feedback.textContent = `Você encontrou: ${word}!`
        feedback.className = "feedback sucesso"
        foundSyllables.push(word)
        selectedCells.forEach((cell) => cell.classList.add("correta"))

        currentSyllableIndex++
        this.currentSyllableIndex = currentSyllableIndex

        if (foundSyllables.length === syllablesToFind.length) {
          feedback.textContent = "Parabéns! Fase completa!"
          feedback.className = "feedback vitoria"
          setTimeout(onComplete, 1500)
        }
      } else {
        feedback.textContent = "Tente novamente!"
        feedback.className = "feedback erro"
        selectedCells.forEach((cell) => cell.classList.remove("selecionada"))
      }
      selectedCells = []
    }

    let isSelecting = false
    grid.addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("cell")) {
        isSelecting = true
        selectedCells.forEach((cell) => cell.classList.remove("selecionada"))
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
        handleSelectionEnd.call(this)
        isSelecting = false
      }
    })

    generateGrid()
  }

  show() {
    this.view.style.display = "block"
  }
  hide() {
    this.view.style.display = "none"
  }
}
