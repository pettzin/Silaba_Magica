class AvatarAssistant {
  constructor() {
    this.currentSkin = "images/skins/default_male.png"
    this.messages = {
      home: [
        "Olá! Bem-vindo ao Sílabas Mágicas!",
        "Pronto para aprender?",
        "Vamos começar a aventura!"
      ],
      levelSelect: [
        "Escolha uma fase!",
        "Qual desafio você quer enfrentar?",
        "Estou aqui para ajudar!"
      ],
      gameStart: [
        "Você consegue!",
        "Boa sorte!",
        "Vamos lá!"
      ],
      gameHint: [
        "Precisa de ajuda? Clique no botão de dica!",
        "As sílabas estão escondidas na grade!",
        "Arraste o mouse pelas letras!"
      ],
      gameComplete: [
        "Parabéns! Você é incrível!",
        "Muito bem! Continue assim!",
        "Você é um campeão!"
      ],
      shop: [
        "Veja o que temos na loja!",
        "Compre itens especiais com seus créditos!",
        "Use seus créditos com sabedoria!"
      ]
    }
    
    this.currentMessage = ""
    this.messageTimeout = null
    this.create()
  }

  create() {
    // Cria o HTML do avatar
    const avatarHTML = `
      <div class="avatar-container entering">
        <div class="avatar">
          <img src="${this.currentSkin}" alt="Avatar" class="avatar-skin">
          <div class="avatar-notification">!</div>
        </div>
        <div class="avatar-speech-bubble"></div>
      </div>
    `
    
    // Adiciona ao body
    document.body.insertAdjacentHTML('beforeend', avatarHTML)
    
    this.container = document.querySelector('.avatar-container')
    this.avatar = this.container.querySelector('.avatar')
    this.bubble = this.container.querySelector('.avatar-speech-bubble')
    this.notification = this.container.querySelector('.avatar-notification')
    
    // Eventos de clique
    this.container.addEventListener('click', () => this.onAvatarClick())
    
    // Remove a animação de entrada após terminar
    setTimeout(() => {
      this.container.classList.remove('entering')
    }, 600)
  }

  // Troca a skin do avatar
  changeSkin(skinPath) {
    this.currentSkin = skinPath
    const skinImg = this.container.querySelector('.avatar-skin')
    if (skinImg) {
      skinImg.src = skinPath
    }
  }

  // Mostra uma mensagem no balão de fala
  showMessage(message, duration = 3000) {
    this.currentMessage = message
    this.bubble.textContent = message
    this.bubble.classList.add('show')
    
    // Remove mensagem anterior se existir
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout)
    }
    
    // Esconde a mensagem após o tempo definido
    this.messageTimeout = setTimeout(() => {
      this.hideMessage()
    }, duration)
  }

  hideMessage() {
    this.bubble.classList.remove('show')
  }

  // Mostra mensagem aleatória baseada no contexto
  showRandomMessage(context) {
    const messagesForContext = this.messages[context]
    if (messagesForContext && messagesForContext.length > 0) {
      const randomMessage = messagesForContext[Math.floor(Math.random() * messagesForContext.length)]
      this.showMessage(randomMessage)
    }
  }

  // Mostra/esconde a notificação
  showNotification() {
    this.notification.classList.add('show')
  }

  hideNotification() {
    this.notification.classList.remove('show')
  }

  // Ação quando clica no avatar
  onAvatarClick() {
    this.avatar.classList.add('happy')
    setTimeout(() => {
      this.avatar.classList.remove('happy')
    }, 500)
    
    // Se não há mensagem, mostra uma aleatória
    if (!this.bubble.classList.contains('show')) {
      const contexts = Object.keys(this.messages)
      const randomContext = contexts[Math.floor(Math.random() * contexts.length)]
      this.showRandomMessage(randomContext)
    }
  }

  // Animação de empolgação
  celebrate() {
    this.avatar.classList.add('excited')
    setTimeout(() => {
      this.avatar.classList.remove('excited')
    }, 600)
  }

  // Remove o avatar
  destroy() {
    if (this.container) {
      this.container.remove()
    }
  }
}