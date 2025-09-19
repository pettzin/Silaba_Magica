class GameModel {
    constructor() {
        // Dados padrão para um novo jogador
        this.defaultState = {
            credits: 0,
            unlockedLevel: 1, // Começa com a fase 1 desbloqueada
        };
        // Carrega o estado do jogo ou usa o padrão
        this.state = this.loadState();

        // Dados de todas as fases do jogo
        this.levels = [
            {
                id: 1,
                title: "O Chá de Boneca",
                image: "images/1- o cha de boneca.png",
                story: `A menina tinha uma <span class="lacuna" data-silaba="BO">__</span>neca.<br>
                        Ela colocou a boneca em uma cadeira.<br>
                        Depois trouxe um copo de suco.<br>
                        “Vamos brincar de chá!”, disse animada.<br>
                        A boneca parecia sorrir de alegria.`,
                objective: "Encontre a sílaba <strong>BO</strong> para completar a história!",
                syllables: ["BO"],
                reward: 50 // Créditos ganhos ao completar
            },
            {
                id: 2,
                title: "O Gato no Telhado",
                // ... (dados da fase 2)
                syllables: ["GA", "TO"],
                reward: 75
            },
            // Adicione as fases 3, 4 e 5 aqui
        ];
    }

    // Carrega o progresso do jogador do localStorage
    loadState() {
        const savedState = localStorage.getItem('silabasMagicasState');
        return savedState ? JSON.parse(savedState) : this.defaultState;
    }

    // Salva o progresso no localStorage
    saveState() {
        localStorage.setItem('silabasMagicasState', JSON.stringify(this.state));
    }

    // Adiciona créditos ao jogador
    addCredits(amount) {
        this.state.credits += amount;
        this.saveState();
    }

    // Retorna os dados de uma fase específica
    getLevelData(levelId) {
        return this.levels.find(level => level.id === levelId);
    }

    // Desbloqueia a próxima fase
    completeLevel(levelId) {
        const levelData = this.getLevelData(levelId);
        if (levelData) {
            this.addCredits(levelData.reward);
        }
        
        // Se a fase completada for a última desbloqueada, avança
        if (levelId === this.state.unlockedLevel && levelId < this.levels.length) {
            this.state.unlockedLevel++;
            this.saveState();
        }
    }
}