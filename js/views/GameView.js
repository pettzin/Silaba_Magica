class GameView {
    constructor() {
        this.view = document.getElementById('game-view');
    }

    // Este método irá construir toda a tela da fase dinamicamente
    render(levelData, onComplete) {
        this.view.innerHTML = `
            <div id="game-view-content">
                <div class="fase-header"><h2>${levelData.title}</h2></div>
                <div class="imagem-historia"><img src="${levelData.image}" alt="${levelData.title}"></div>
                <div class.texto-historia"><p>${levelData.story}</p></div>
                <div class="objetivo">${levelData.objective}</div>
                <div class="progresso"><strong>Sílabas a encontrar:</strong> <span id="syllables-status"></span></div>
                <div class="caca-silabas">
                    <h3>Caça-Sílabas</h3>
                    <div class="grid" id="game-grid"></div>
                    <div id="feedback" class="feedback"></div>
                </div>
                 <button id="back-to-levels-from-game" class="btn-back">⬅ Voltar</button>
            </div>`;
        
        // Agora, adaptamos a lógica do caça-sílabas
        this.startSyllableHunt(levelData.syllables, onComplete);
    }
    
    bindBackButton(handler) {
        // Precisamos garantir que o botão exista antes de adicionar o listener
        const backButton = document.getElementById('back-to-levels-from-game');
        if (backButton) {
            backButton.addEventListener('click', handler);
        }
    }

    // Lógica do Caça-Sílabas (adaptada do seu script.js)
    startSyllableHunt(syllablesToFind, onComplete) {
        const grid = document.getElementById('game-grid');
        const feedback = document.getElementById('feedback');
        const syllablesStatus = document.getElementById('syllables-status');
        
        let selectedCells = [];
        let foundSyllables = [];

        syllablesStatus.textContent = syllablesToFind.join(', ');

        // Função para gerar a grade (simplificada, você pode melhorar)
        function generateGrid() {
            grid.innerHTML = '';
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let matrix = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => letters[Math.floor(Math.random() * letters.length)]));

            // Lógica para inserir as sílabas na matriz (pode ser melhorada)
            syllablesToFind.forEach(syllable => {
                const isHorizontal = Math.random() > 0.5;
                if (isHorizontal) {
                    const row = Math.floor(Math.random() * 8);
                    const col = Math.floor(Math.random() * (8 - syllable.length));
                    for (let i = 0; i < syllable.length; i++) {
                        matrix[row][col + i] = syllable[i];
                    }
                } else {
                    const row = Math.floor(Math.random() * (8 - syllable.length));
                    const col = Math.floor(Math.random() * 8);
                     for (let i = 0; i < syllable.length; i++) {
                        matrix[row + i][col] = syllable[i];
                    }
                }
            });

            matrix.forEach(row => {
                row.forEach(letter => {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');
                    cell.textContent = letter;
                    grid.appendChild(cell);
                });
            });
        }

        function handleSelectionEnd() {
            if (selectedCells.length === 0) return;
            
            const word = selectedCells.map(cell => cell.textContent).join('');
            
            if (syllablesToFind.includes(word) && !foundSyllables.includes(word)) {
                feedback.textContent = `Você encontrou: ${word}!`;
                feedback.className = 'feedback sucesso';
                foundSyllables.push(word);
                selectedCells.forEach(cell => cell.classList.add('correta'));

                if (foundSyllables.length === syllablesToFind.length) {
                    feedback.textContent = 'Parabéns! Fase completa!';
                    feedback.className = 'feedback vitoria';
                    setTimeout(onComplete, 1500); // Chama a função de completar nível
                }
            } else {
                feedback.textContent = 'Tente novamente!';
                feedback.className = 'feedback erro';
                selectedCells.forEach(cell => cell.classList.remove('selecionada'));
            }
            selectedCells = [];
        }

        let isSelecting = false;
        grid.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('cell')) {
                isSelecting = true;
                selectedCells.forEach(cell => cell.classList.remove('selecionada'));
                selectedCells = [e.target];
                e.target.classList.add('selecionada');
            }
        });
        grid.addEventListener('mouseover', (e) => {
             if (isSelecting && e.target.classList.contains('cell') && !selectedCells.includes(e.target)) {
                 selectedCells.push(e.target);
                 e.target.classList.add('selecionada');
             }
        });
        document.addEventListener('mouseup', () => {
            if (isSelecting) {
                handleSelectionEnd();
                isSelecting = false;
            }
        });
        
        generateGrid();
    }

    show() { this.view.style.display = 'block'; }
    hide() { this.view.style.display = 'none'; }
}