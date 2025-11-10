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

    skins.forEach((skin) => {
      const isOwned = ownedSkins.includes(skin.id)
      const isEquipped = currentSkin === skin.image
      const isLocked = !skin.isDefault && !isOwned

      const skinCard = document.createElement("div")
      skinCard.className = "skin-card"

      if (isEquipped) skinCard.classList.add("equipped")
      if (isLocked) skinCard.classList.add("locked")

      const rarityClass = `rarity-${skin.rarity || "comum"}`
      skinCard.classList.add(rarityClass)

      // Tradução de raridade para português
      const rarityNames = {
        comum: "Comum",
        rara: "Rara",
        lendária: "Lendária",
      }

      skinCard.innerHTML = `
        <div class="skin-image-container">
          <img src="${skin.image}" alt="${skin.name}" class="skin-image">
          <div class="rarity-badge ${rarityClass}">${rarityNames[skin.rarity] || "Comum"}</div>
        </div>
        <div class="skin-info">
          <h3 class="skin-name">${skin.name}</h3>
        </div>
        <div class="skin-action">
          ${
            isEquipped
              ? '<button class="btn-equipped" disabled>Equipado</button>'
              : isOwned
                ? '<button class="btn-equip">Equipar</button>'
                : skin.isDefault
                  ? '<button class="btn-equip">Equipar</button>'
                  : `<button class="btn-buy">Comprar (${skin.price}💰)</button>`
          }
        </div>
        ${isLocked ? '<div class="lock-badge">🔒</div>' : ""}
      `

      const button = skinCard.querySelector("button")
      if (button && !button.disabled) {
        button.addEventListener("click", () => {
          if (isOwned || skin.isDefault) {
            onEquip(skin.id)
          } else {
            this.showConfirmationModal(skin, onBuy)
          }
        })
      }

      this.skinsGrid.appendChild(skinCard)
    })
  }

  showConfirmationModal(skin, onBuy) {
    // Remove modais anteriores se existirem
    const oldModal = document.querySelector(".purchase-confirmation-modal")
    if (oldModal) oldModal.remove()

    // Cria o modal de confirmação
    const modal = document.createElement("div")
    modal.className = "purchase-confirmation-modal"
    modal.innerHTML = `
      <div class="confirmation-modal-content">
        <h2>Confirmar Compra</h2>
        <div class="confirmation-skin-preview">
          <img src="${skin.image}" alt="${skin.name}" class="confirmation-skin-image">
        </div>
        <p class="confirmation-skin-name">${skin.name}</p>
        <p class="confirmation-price">Preço: ${skin.price}💰</p>
        <p class="confirmation-question">Deseja comprar esta skin?</p>
        <div class="confirmation-buttons">
          <button class="btn-confirm-yes">Sim</button>
          <button class="btn-confirm-no">Não</button>
        </div>
      </div>
    `

    document.body.appendChild(modal)

    // Mostra o modal com animação
    setTimeout(() => modal.classList.add("show"), 10)

    // Botão "Sim" - confirma a compra
    const btnYes = modal.querySelector(".btn-confirm-yes")
    btnYes.addEventListener("click", () => {
      modal.classList.remove("show")
      setTimeout(() => {
        modal.remove()
        onBuy(skin.id)
      }, 300)
    })

    // Botão "Não" - cancela
    const btnNo = modal.querySelector(".btn-confirm-no")
    btnNo.addEventListener("click", () => {
      modal.classList.remove("show")
      setTimeout(() => modal.remove(), 300)
    })

    // Fecha ao clicar fora
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show")
        setTimeout(() => modal.remove(), 300)
      }
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
    const oldMessages = document.querySelectorAll(".shop-message")
    oldMessages.forEach((msg) => msg.remove())

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

window.ShopView = ShopView
