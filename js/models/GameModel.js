class GameModel {
  constructor() {
    // Dados padrão para um novo jogador
    this.defaultState = {
      credits: 0,
      unlockedLevel: 1,
      currentSkin: "images/skins/default_male.png",
      ownedSkins: ["default_male", "default_female"],
    }
    // Carrega o estado do jogo ou usa o padrão
    this.state = this.loadState()

    // Catálogo de skins disponíveis na loja
    this.skins = [
      // Skins padrão (gratuitas)
      {
        id: "default_male",
        name: "Menino Padrão",
        image: "images/skins/default_male.png",
        price: 0,
        unlockLevel: 0,
        isDefault: true
      },
      {
        id: "default_female",
        name: "Menina Padrão",
        image: "images/skins/default_female.png",
        price: 0,
        unlockLevel: 0,
        isDefault: true
      },
      // Skins desbloqueáveis por fase
      {
        id: "avatar_fada",
        name: "Fada Mágica",
        image: "images/skins/avatar_fada.png",
        price: 100,
        unlockLevel: 1,
        isDefault: false
      },
      {
        id: "avatar_pirata",
        name: "Pirata",
        image: "images/skins/avatar_pirata.png",
        price: 150,
        unlockLevel: 2,
        isDefault: false
      },
      {
        id: "avatar_princesa",
        name: "Princesa",
        image: "images/skins/avatar_princesa.png",
        price: 150,
        unlockLevel: 2,
        isDefault: false
      },
      {
        id: "avatar_cavaleiro_cosmico",
        name: "Cavaleiro Cósmico",
        image: "images/skins/avatar_cavaleiro_cosmico.png",
        price: 200,
        unlockLevel: 3,
        isDefault: false
      },
      {
        id: "avatar_mago",
        name: "Mago",
        image: "images/skins/avatar_mago.png",
        price: 200,
        unlockLevel: 3,
        isDefault: false
      },
      {
        id: "avatar_rainha",
        name: "Rainha",
        image: "images/skins/avatar_rainha.png",
        price: 250,
        unlockLevel: 4,
        isDefault: false
      },
      {
        id: "avatar_rei",
        name: "Rei",
        image: "images/skins/avatar_rei.png",
        price: 250,
        unlockLevel: 4,
        isDefault: false
      },
      {
        id: "avatar_fada_celestial",
        name: "Fada Celestial",
        image: "images/skins/avatar_fada_celestial.png",
        price: 300,
        unlockLevel: 5,
        isDefault: false
      },
      {
        id: "avatar_dragao",
        name: "Dragão",
        image: "images/skins/avatar_dragao.png",
        price: 350,
        unlockLevel: 5,
        isDefault: false
      },
      {
        id: "avatar_guerreiro_elemental",
        name: "Guerreiro Elemental",
        image: "images/skins/avatar_guerreiro_elemental.png",
        price: 400,
        unlockLevel: 5,
        isDefault: false
      },
    ]

    // Dados de todas as fases do jogo
    this.levels = [
      {
        id: 1,
        title: "O Chá de Boneca",
        image: "images/imagens/o_cha_de_boneca.png",
        story: `A menina tinha uma <span class="lacuna" data-silaba="BO">__</span>neca.<br>
                        Ela colocou a boneca em uma cadeira.<br>
                        Depois trouxe um copo de suco.<br>
                        "Vamos brincar de chá!", disse animada.<br>
                        A boneca parecia sorrir de alegria.`,
        objective: "Encontre a sílaba <strong>BO</strong> para completar a história!",
        syllables: ["BO"],
        reward: 50,
        rewardSkin: "avatar_fada" // Fada Mágica
      },
      {
        id: 2,
        title: "O Menino e o Cachorro",
        image: "images/imagens/menino_cachorro.png",
        story: `O me<span class="lacuna" data-silaba="NI">__</span>no saiu com seu cachorro.<br>
                        Levou uma bola para brincar no parque.<br>
                        O cachorro correu atrás da bola.<br>
                        O menino riu e correu também.<br>
                        No fim, os dois voltaram felizes para ca<span class="lacuna" data-silaba="SA">__</span>.`,
        objective: "Encontre as sílabas <strong>NI</strong> e <strong>SA</strong> para completar a história!",
        syllables: ["NI", "SA"],
        reward: 75,
        rewardSkin: "avatar_pirata" // Pirata
      },
      {
        id: 3,
        title: "A Bola da Alegria",
        image: "images/imagens/a_bola_da_alegria.png",
        story: `A bo<span class="lacuna" data-silaba="LA">__</span> vermelha gostava de pular,<br>
                        No parque corria, não parava de rolar.<br>
                        O <span class="lacuna" data-silaba="CA">__</span>chorro brincava, as crianças sorriam,<br>
                        E até as go<span class="lacuna" data-silaba="TI">__</span>nhas da poça caíam.<br>
                        Por isso diziam, com muita alegria:<br>
                        "A bola vermelha só traz fantasia!"`,
        objective:
          "Encontre as sílabas <strong>LA</strong>, <strong>CA</strong> e <strong>TI</strong> para completar a história!",
        syllables: ["LA", "CA", "TI"],
        reward: 100,
        rewardSkin: "avatar_mago" // Mago
      },
    ]
  }

  // Carrega o progresso do jogador
  loadState() {
    const savedState = localStorage.getItem("silabasMagicasState")
    if (savedState) {
      const parsed = JSON.parse(savedState)
      // Garante que os novos campos existam mesmo em saves antigos
      return {
        credits: parsed.credits || 0,
        unlockedLevel: parsed.unlockedLevel || 1,
        currentSkin: parsed.currentSkin || "images/skins/default_male.png",
        ownedSkins: parsed.ownedSkins || ["default_male", "default_female"]
      }
    }
    return this.defaultState
  }

  // Salva o progresso
  saveState() {
    localStorage.setItem("silabasMagicasState", JSON.stringify(this.state))
  }

  // Adiciona créditos ao jogador
  addCredits(amount) {
    this.state.credits += amount
    this.saveState()
  }

  // Remove créditos
  removeCredits(amount) {
    this.state.credits -= amount
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
      
      // Premia com uma skin ao completar a fase
      this.unlockLevelRewardSkin(levelId)
      
      this.saveState()
    }
  }

  // Desbloqueia a skin de recompensa da fase
  unlockLevelRewardSkin(levelId) {
    // Define qual skin é desbloqueada em cada fase
    const rewardSkins = {
      1: "avatar_fada",           // Fase 1 -> Fada Mágica
      2: "avatar_pirata",         // Fase 2 -> Pirata
      3: "avatar_mago"            // Fase 3 -> Mago
    }
    
    const rewardSkinId = rewardSkins[levelId]
    
    if (rewardSkinId && !this.hasSkin(rewardSkinId)) {
      this.state.ownedSkins.push(rewardSkinId)
      this.saveState()
      return rewardSkinId
    }
    
    return null
  }

  // Verifica se o jogador possui uma skin
  hasSkin(skinId) {
    return this.state.ownedSkins.includes(skinId)
  }

  // Compra uma skin
  buySkin(skinId) {
    const skin = this.skins.find(s => s.id === skinId)
    
    if (!skin) return { success: false, message: "Skin não encontrada!" }
    
    if (this.hasSkin(skinId)) {
      return { success: false, message: "Você já possui esta skin!" }
    }
    
    if (this.state.credits < skin.price) {
      return { success: false, message: "Créditos insuficientes!" }
    }
    
    if (this.state.unlockedLevel < skin.unlockLevel) {
      return { success: false, message: "Complete mais fases para desbloquear!" }
    }
    
    // Compra bem-sucedida
    this.removeCredits(skin.price)
    this.state.ownedSkins.push(skinId)
    this.saveState()
    
    return { success: true, message: "Skin comprada com sucesso!" }
  }

  // Equipa uma skin
  equipSkin(skinId) {
    if (!this.hasSkin(skinId)) {
      return { success: false, message: "Você não possui esta skin!" }
    }
    
    const skin = this.skins.find(s => s.id === skinId)
    if (skin) {
      this.state.currentSkin = skin.image
      this.saveState()
      return { success: true, message: "Skin equipada!", skinPath: skin.image }
    }
    
    return { success: false, message: "Erro ao equipar skin!" }
  }

  // Retorna skins disponíveis para o jogador
  getAvailableSkins() {
    return this.skins.filter(skin => 
      skin.isDefault || this.state.unlockedLevel >= skin.unlockLevel
    )
  }

  // Retorna informações de uma skin
  getSkinInfo(skinId) {
    return this.skins.find(s => s.id === skinId)
  }
}