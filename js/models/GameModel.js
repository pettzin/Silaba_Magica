class GameModel {
  constructor() {
    // Dados padrão para um novo jogador
    this.defaultState = {
      credits: 0,
      unlockedLevel: 1, // Começa com a fase 1 desbloqueada
    }
    // Carrega o estado do jogo ou usa o padrão
    this.state = this.loadState()

    // Dados de todas as fases do jogo
    this.levels = [
      {
        id: 1,
        title: "O Chá de Boneca",
        image: "images/1- o cha de boneca.png",
        story: `A menina tinha uma <span class="lacuna" data-silaba="BO">__</span>neca.<br>
                        Ela colocou a boneca em uma cadeira.<br>
                        Depois trouxe um copo de suco.<br>
                        "Vamos brincar de chá!", disse animada.<br>
                        A boneca parecia sorrir de alegria.`,
        objective: "Encontre a sílaba <strong>BO</strong> para completar a história!",
        syllables: ["BO"],
        reward: 50,
      },
      {
        id: 2,
        title: "O Menino e o Cachorro Brincalhão",
        image: "images/2- o menino e o cachorro brincalhao.png",
        story: `O me<span class="lacuna" data-silaba="NI">__</span>no saiu com seu cachorro.<br>
                        Levou uma bola para brincar no parque.<br>
                        O cachorro correu atrás da bola.<br>
                        O menino riu e correu também.<br>
                        No fim, os dois voltaram felizes para ca<span class="lacuna" data-silaba="SA">__</span>.`,
        objective: "Encontre as sílabas <strong>NI</strong> e <strong>SA</strong> para completar a história!",
        syllables: ["NI", "SA"],
        reward: 75,
      },
    ]
  }

  // Carrega o progresso do jogador do localStorage
  loadState() {
    const savedState = localStorage.getItem("silabasMagicasState")
    return savedState ? JSON.parse(savedState) : this.defaultState
  }

  // Salva o progresso no localStorage
  saveState() {
    localStorage.setItem("silabasMagicasState", JSON.stringify(this.state))
  }

  // Adiciona créditos ao jogador
  addCredits(amount) {
    this.state.credits += amount
    this.saveState()
  }

  // Retorna os dados de uma fase específica
  getLevelData(levelId) {
    return this.levels.find((level) => level.id === levelId)
  }

  // Desbloqueia a próxima fase
  completeLevel(levelId) {
    const levelData = this.getLevelData(levelId)
    if (levelData) {
      this.addCredits(levelData.reward)
    }

    // Se a fase completada for a última desbloqueada, avança
    if (levelId === this.state.unlockedLevel && levelId < this.levels.length) {
      this.state.unlockedLevel++
      this.saveState()
    }
  }
}
