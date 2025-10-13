class ShopView {
  constructor() {
    this.view = document.getElementById("shop-view")
    this.backButton = document.getElementById("back-to-levels-button")
    this.creditsDisplay = document.getElementById("credits-display-shop")
    this.skinsGrid = null
  }

  render(skins, ownedSkins, currentSkin, onBuy, onEquip) {
    // Busca ou cria a grid
    this.skinsGrid = document.getElementById("skins-grid")
    
    if (!this.skinsGrid) {
      console.error("Elemento skins-grid não encontrado!")
      return
    }
    
    // Garante que ownedSkins é um array
    if (!ownedSkins || !Array.isArray(ownedSkins)) {
      ownedSkins = ["default_male", "default_female"]
    }
    
    // Garante que currentSkin tem um valor
    if (!currentSkin) {
      currentSkin = "images/skins/default_male.png"
    }
    
    this.skinsGrid.innerHTML = ""
    
    skins.forEach(skin => {
      const isOwned = ownedSkins.includes(skin.id)
      const isEquipped = currentSkin === skin.image
      const isLocked = !skin.isDefault && !isOwned
      
      const skinCard = document.createElement("div")
      skinCard.className = "skin-card"
      
      if (isEquipped) skinCard.classList.add("equipped")
      if (isLocked) skinCard.classList.add("locked")
      
      skinCard.innerHTML = `
        <div class="skin-image-container">
          <img src="${skin.image}" alt="${skin.name}" class="skin-image">
          ${isEquipped ? '<div class="equipped-badge">EQUIPADO</div>' : ''}
          ${isLocked ? '<div class="locked-overlay">🔒</div>' : ''}
        </div>
        <div class="skin-info">
          <h3 class="skin-name">${skin.name}</h3>
          ${skin.unlockLevel > 0 ? `<p class="skin-unlock">Fase ${skin.unlockLevel}+</p>` : ''}
        </div>
        <div class="skin-action">
          ${isEquipped ? '<button class="btn-equipped" disabled>Equipado</button>' : 
            isOwned ? '<button class="btn-equip">Equipar</button>' :
            skin.isDefault ? '<button class="btn-equip">Equipar</button>' :
            `<button class="btn-buy">Comprar (${skin.price}💰)</button>`}
        </div>
      `
      
      const button = skinCard.querySelector("button")
      if (button && !button.disabled) {
        button.addEventListener("click", () => {
          if (isOwned || skin.isDefault) {
            onEquip(skin.id)
          } else {
            onBuy(skin.id)
          }
        })
      }
      
      this.skinsGrid.appendChild(skinCard)
    })
  }

  bindBackButton(handler) {
    if (this.backButton) {
      this.backButton.addEventListener("click", handler)
    }
  }

  updateCredits(credits) {
    if (this.creditsDisplay) {
      this.creditsDisplay.textContent = `💰 ${credits}`
    }
  }

  show() {
    this.view.style.display = "flex"
  }

  hide() {
    this.view.style.display = "none"
  }

  showMessage(message, type = "info") {
    // Remove mensagens anteriores
    const oldMessages = document.querySelectorAll('.shop-message')
    oldMessages.forEach(msg => msg.remove())
    
    const messageDiv = document.createElement("div")
    messageDiv.className = `shop-message ${type}`
    messageDiv.textContent = message
    
    document.body.appendChild(messageDiv)
    
    setTimeout(() => {
      messageDiv.classList.add("show")
    }, 10)
    
    setTimeout(() => {
      messageDiv.classList.remove("show")
      setTimeout(() => messageDiv.remove(), 300)
    }, 2500)
  }
}