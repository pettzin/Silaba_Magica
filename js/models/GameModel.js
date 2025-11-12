class GameModel {
  constructor() {
    // Dados padrão para um novo jogador
    this.defaultState = {
      credits: 0,
      unlockedLevel: 1,
      currentSkin: "images/skins/default_male.png",
      ownedSkins: ["default_male", "default_female"],
      musicEnabled: true,
      soundEffectsEnabled: true,
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
        isDefault: true,
        rarity: "comum",
      },
      {
        id: "default_female",
        name: "Menina Padrão",
        image: "images/skins/default_female.png",
        price: 0,
        unlockLevel: 0,
        isDefault: true,
        rarity: "comum",
      },
      {
        id: "avatar_princesa",
        name: "Princesa",
        image: "images/skins/avatar_princesa.png",
        price: 100,
        unlockLevel: 2,
        isDefault: false,
        rarity: "comum",
      },
      {
        id: "avatar_rainha",
        name: "Rainha",
        image: "images/skins/avatar_rainha.png",
        price: 150,
        unlockLevel: 4,
        isDefault: false,
        rarity: "comum",
      },
      {
        id: "avatar_rei",
        name: "Rei",
        image: "images/skins/avatar_rei.png",
        price: 150,
        unlockLevel: 4,
        isDefault: false,
        rarity: "comum",
      },
      {
        id: "avatar_fada",
        name: "Fada Mágica",
        image: "images/skins/avatar_fada.png",
        price: 200,
        unlockLevel: 1,
        isDefault: false,
        rarity: "rara",
      },
      {
        id: "avatar_pirata",
        name: "Pirata",
        image: "images/skins/avatar_pirata.png",
        price: 250,
        unlockLevel: 2,
        isDefault: false,
        rarity: "rara",
      },
      {
        id: "avatar_mago",
        name: "Mago",
        image: "images/skins/avatar_mago.png",
        price: 250,
        unlockLevel: 3,
        isDefault: false,
        rarity: "rara",
      },    

      {
        id: "avatar_cavaleiro_cosmico",
        name: "Cavaleiro Cósmico",
        image: "images/skins/avatar_cavaleiro_cosmico.png",
        price: 300,
        unlockLevel: 3,
        isDefault: false,
        rarity: "lendária",
      },
      {
        id: "avatar_fada_celestial",
        name: "Fada Celestial",
        image: "images/skins/avatar_fada_celestial.png",
        price: 350,
        unlockLevel: 5,
        isDefault: false,
        rarity: "lendária",
      },
      {
        id: "avatar_dragao",
        name: "Dragão",
        image: "images/skins/avatar_dragao.png",
        price: 350,
        unlockLevel: 5,
        isDefault: false,
        rarity: "lendária",
      },
      {
        id: "avatar_guerreiro_elemental",
        name: "Guerreiro Elemental",
        image: "images/skins/avatar_guerreiro_elemental.png",
        price: 500,
        unlockLevel: 5,
        isDefault: false,
        rarity: "lendária",
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
        reward: 100,
        rewardSkin: "avatar_fada",
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
        reward: 200,
        rewardSkin: "avatar_pirata",
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
        reward: 300,
        rewardSkin: "avatar_mago",
      },
      {
        id: 4,
        title: "A Princesa Feliz",
        image: "images/imagens/princesa_feliz.png",
        story: `Era uma vez uma prin<span class="lacuna" data-silaba="CE">__</span>sa que morava em um castelo.<br>
                        Ela tinha um lindo vestido <span class="lacuna" data-silaba="RO">__</span>sa.<br>
                        No jar<span class="lacuna" data-silaba="DIM">___</span>, brincava com sua boneca.<br>
                        Ela corria entre as flores e ria sem parar.<br>
                        O sol bri<span class="lacuna" data-silaba="LHA">___</span>va forte no céu.<br>
                        E todos ficaram felizes no castelo.`,
        objective:
          "Encontre as sílabas <strong>CE</strong>, <strong>RO</strong>, <strong>DIM</strong> e <strong>LHA</strong> para completar a história!",
        syllables: ["CE", "RO", "DIM", "LHA"],
        reward: 400,
        rewardSkin: "avatar_rainha",
      },
      {
        id: 5,
        title: "A Aventura do Dinossauro",
        image: "images/imagens/dinossauro.png",
        story: `Um <span class="lacuna" data-silaba="DI">__</span>nossauro verde andava pelo campo.<br>
                        Ele viu uma árvo<span class="lacuna" data-silaba="RE">__</span> cheia de frutas.<br>
                        Pegou uma fruta e comeu devagar.<br>
                        Depois encontrou um rio <span class="lacuna" data-silaba="BRI">___</span>lhando ao sol.<br>
                        Be<span class="lacuna" data-silaba="BEU">___</span> da água e ficou refrescado.<br>
                        Um pássa<span class="lacuna" data-silaba="RO">__</span> passou voando no céu.<br>
                        O dinossauro sorriu e acenou feliz.`,
        objective:
          "Encontre as sílabas <strong>DI</strong>, <strong>RE</strong>, <strong>BRI</strong>, <strong>BEU</strong> e <strong>RO</strong> para completar a história!",
        syllables: ["DI", "RE", "BRI", "BEU", "RO"],
        reward: 500,
        rewardSkin: "avatar_fada_celestial",
      },
      {
        id: 6,
        title: "🏴‍☠️ Tesouro Escondido (FASE SECRETA) 🏴‍☠️",
        image: "images/imagens/tesouro.jpg",
        story: `Um pi<span class="lacuna" data-silaba="RA">__</span>ta famoso navegava os mares em busca do grande tesouro.<br>
                        Ele recebeu um <span class="lacuna" data-silaba="MA">__</span>pa antigo em uma garrafa flutuante.<br>
                        "X marca o local!", disse o pi<span class="lacuna" data-silaba="RA">__</span>ta com entusiasmo.<br>
                        Cavou na areia e encontrou um bau<span class="lacuna" data-silaba="LHE">___</span> cheio de ouro.<br>
                        "Eureca! Encontrei o tesouro mágico!" comemo<span class="lacuna" data-silaba="ROU">___</span> com alegria.`,
        objective:
          "Encontre as sílabas <strong>RA</strong>, <strong>MA</strong>, <strong>LHE</strong> e <strong>ROU</strong> para desvendar o tesouro secreto!",
        syllables: ["RA", "MA", "LHE", "ROU"],
        reward: 750,
        rewardSkin: "avatar_guerreiro_elemental",
        isSecret: true,
        unlockedBySkin: "avatar_pirata",
      },
    ]

    this.backgroundMusic = new Audio("audios/musica/musicaFundo.mp3")
    this.backgroundMusic.loop = true
    this.backgroundMusic.volume = 0.4
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
        ownedSkins: parsed.ownedSkins || ["default_male", "default_female"],
        musicEnabled: parsed.musicEnabled !== undefined ? parsed.musicEnabled : true,
        soundEffectsEnabled: parsed.soundEffectsEnabled !== undefined ? parsed.soundEffectsEnabled : true,
      }
    }
    return this.defaultState
  }

  // Verifica fases secretas desbloqueadas pelas skins
  checkSecretLevels() {
    const secretLevels = this.levels.filter((l) => l.isSecret)
    secretLevels.forEach((secret) => {
      if (secret.unlockedBySkin && this.hasSkin(secret.unlockedBySkin)) {
        // Marca a fase secreta como desbloqueada
        localStorage.setItem(`secret_level_${secret.id}_unlocked`, 'true')
      } else {
        // Remove a marcação se o usuário não tiver a skin necessária
        localStorage.removeItem(`secret_level_${secret.id}_unlocked`)
      }
    })
  }

  // Verifica se uma fase secreta está desbloqueada
  isSecretLevelUnlocked(levelId) {
    const level = this.levels.find((l) => l.id === levelId)
    if (!level || !level.isSecret) return false
    return localStorage.getItem(`secret_level_${levelId}_unlocked`) === 'true'
  }

  // Salva o progresso
  saveState() {
    localStorage.setItem("silabasMagicasState", JSON.stringify(this.state))

    // Sincroniza com o servidor se o usuário estiver logado
    this.syncWithServer()
  }

  // Sincroniza o progresso com o servidor
  async syncWithServer() {
    // Agora persistimos localmente no localStorage (sm_users)
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))

    if (!currentUser || !currentUser.id) {
      return // Usuário não está logado
    }

    try {
      const USERS_KEY = 'sm_users'
      const usersRaw = localStorage.getItem(USERS_KEY)
      const users = usersRaw ? JSON.parse(usersRaw) : []

      const idx = users.findIndex((u) => u.id === currentUser.id)
      if (idx !== -1) {
        users[idx].gameState = this.state
        users[idx].ultimoAcesso = new Date().toISOString()
        localStorage.setItem(USERS_KEY, JSON.stringify(users))
        console.log('Progresso salvo em localStorage para', currentUser.id)
      } else {
        // Caso não exista, cria um registro local (útil se o usuário foi criado em outro dispositivo)
        const newUser = {
          id: currentUser.id,
          nome: currentUser.nome ? currentUser.nome.toLowerCase() : 'unknown',
          idade: currentUser.idade || 0,
          gameState: this.state,
          dataCriacao: new Date().toISOString(),
          ultimoAcesso: new Date().toISOString(),
        }
        users.push(newUser)
        localStorage.setItem(USERS_KEY, JSON.stringify(users))
        console.log('Novo usuário criado em localStorage:', currentUser.id)
      }
    } catch (error) {
      console.error('Erro ao salvar progresso em localStorage:', error)
    }
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
      this.saveState()
    }
  }

  // Verifica se o jogador possui uma skin
  hasSkin(skinId) {
    return this.state.ownedSkins.includes(skinId)
  }

  // Compra uma skin
  buySkin(skinId) {
    const skin = this.skins.find((s) => s.id === skinId)

    if (!skin) return { success: false, message: "Skin não encontrada!" }

    if (this.hasSkin(skinId)) {
      return { success: false, message: "Você já possui esta skin!" }
    }

    if (this.state.credits < skin.price) {
      return { success: false, message: "Créditos insuficientes!" }
    }

    // Compra bem-sucedida
    this.removeCredits(skin.price)
    this.state.ownedSkins.push(skinId)
    this.saveState()

    // Verifica se é a skin do pirata — desbloqueia a fase secreta
    const secretLevel = this.levels.find((l) => l.isSecret && l.unlockedBySkin === skinId)
    const result = { success: true, message: "Skin comprada com sucesso!" }
    if (secretLevel) {
      result.unlockedSecret = secretLevel
    }

    return result
  }

  // Equipa uma skin
  equipSkin(skinId) {
    if (!this.hasSkin(skinId)) {
      return { success: false, message: "Você não possui esta skin!" }
    }

    const skin = this.skins.find((s) => s.id === skinId)
    if (skin) {
      this.state.currentSkin = skin.image
      this.saveState()
      return { success: true, message: "Skin equipada!", skinPath: skin.image }
    }

    return { success: false, message: "Erro ao equipar skin!" }
  }

  // Retorna skins disponíveis para o jogador
  getAvailableSkins() {
    return this.skins
  }

  // Retorna informações de uma skin
  getSkinInfo(skinId) {
    return this.skins.find((s) => s.id === skinId)
  }

  playBackgroundMusic() {
    if (this.state.musicEnabled) {
      this.backgroundMusic.play().catch((e) => console.log("Erro ao tocar música:", e))
    }
  }

  stopBackgroundMusic() {
    this.backgroundMusic.pause()
    this.backgroundMusic.currentTime = 0
  }

  toggleMusic() {
    this.state.musicEnabled = !this.state.musicEnabled
    if (this.state.musicEnabled) {
      this.playBackgroundMusic()
    } else {
      this.stopBackgroundMusic()
    }
    this.saveState()
    return this.state.musicEnabled
  }

  toggleSoundEffects() {
    this.state.soundEffectsEnabled = !this.state.soundEffectsEnabled
    this.saveState()
    return this.state.soundEffectsEnabled
  }
}

window.GameModel = GameModel
