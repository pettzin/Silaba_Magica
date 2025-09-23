class GameView {
  constructor() {
    this.view = document.getElementById("game-view")
  }

  render(levelData, onComplete) {
    this.view.innerHTML = `
            <div id="game-view-content">
                <div class="game-card">
                    <div class="game-header">
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
                        <span class="syllable-label">Sílaba:</span>
                        <div class="current-syllable" id="current-syllable"></div>
                    </div>
                    
                    <div class="hunt-section">
                        <div class="hunt-header">Caça-Sílabas</div>
                        <div class="grid-container">
                            <div class="grid" id="game-grid"></div>
                        </div>
                    </div>
                    
                    <div id="feedback" class="feedback"></div>
                    <button id="back-to-levels-from-game" class="btn-back">⬅ Voltar</button>
                </div>
            </div>`

    this.startSyllableHunt(levelData.syllables, onComplete)
  }

  bindBackButton(handler) {
    // Precisamos garantir que o botão exista antes de adicionar o listener
    const backButton = document.getElementById("back-to-levels-from-game")
    if (backButton) {
      backButton.addEventListener("click", handler)
    }
  }

  startSyllableHunt(syllablesToFind, onComplete) {
    const grid = document.getElementById("game-grid")
    const feedback = document.getElementById("feedback")
    const currentSyllableEl = document.getElementById("current-syllable")

    let selectedCells = []
    const foundSyllables = []
    let currentSyllableIndex = 0

    // Show first syllable to find
    currentSyllableEl.textContent = syllablesToFind[currentSyllableIndex]

    function generateGrid() {
      grid.innerHTML = ""
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      const matrix = Array.from({ length: 8 }, () =>
        Array.from({ length: 8 }, () => letters[Math.floor(Math.random() * letters.length)]),
      )

      // Lógica para inserir as sílabas na matriz (pode ser melhorada)
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

        // Move to next syllable
        currentSyllableIndex++
        if (currentSyllableIndex < syllablesToFind.length) {
          currentSyllableEl.textContent = syllablesToFind[currentSyllableIndex]
        }

        if (foundSyllables.length === syllablesToFind.length) {
          feedback.textContent = "Parabéns! Fase completa!"
          feedback.className = "feedback vitoria"
          currentSyllableEl.textContent = "COMPLETO!"
          setTimeout(onComplete, 1500) // Chama a função de completar nível
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
        handleSelectionEnd()
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
