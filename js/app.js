// Aguarda o HTML da página ser completamente carregado
document.addEventListener("DOMContentLoaded", () => {
  // =============================
  // Verifica se o usuário está logado
  // =============================
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const gameState = JSON.parse(localStorage.getItem("silabasMagicasState"))

  if (!currentUser) {
    // Se não estiver logado, redireciona para a tela de login
    window.location.href = "/html/login.html"
    return
  }

  console.log(`Bem-vindo, ${currentUser.nome}!`)

  // =============================
  // Atualiza créditos nas telas
  // =============================
  function updateCredits() {
    const credits = gameState?.credits ?? 0
    const homeCredits = document.getElementById("credits-display-home")
    const levelCredits = document.getElementById("credits-display-levels")
    const shopCredits = document.getElementById("credits-display-shop")

    if (homeCredits) homeCredits.textContent = `💰 ${credits}`
    if (levelCredits) levelCredits.textContent = `💰 ${credits}`
    if (shopCredits) shopCredits.textContent = `💰 ${credits}`
  }

  updateCredits()

  // =============================
  // Adiciona botão de logout na home
  // =============================
  const homeContent = document.querySelector("#home-view .content")
  if (homeContent) {
    // Saudação com nome
    const userNameDisplay = document.createElement("p")
    userNameDisplay.textContent = `Olá, ${currentUser.nome}!`
    userNameDisplay.style.fontWeight = "bold"
    userNameDisplay.style.marginTop = "10px"
    homeContent.insertBefore(userNameDisplay, document.getElementById("play-button"))

    // Botão de logout
    const logoutBtn = document.createElement("button")
    logoutBtn.textContent = "Logout"
    logoutBtn.classList.add("btn-logout")
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser")
      localStorage.removeItem("silabasMagicasState")
      window.location.href = "/html/login.html"
    })
    homeContent.appendChild(logoutBtn)
  }

  // =============================
  // Inicialização do jogo
  // =============================
  const model = new GameModel()
  const views = {
    home: new HomeView(),
    levelSelect: new LevelSelectView(),
    game: new GameView(),
    shop: new ShopView(),
  }
  const controller = new GameController(model, views)
  controller.init()

  // Cria o Avatar Assistente
  const avatar = new AvatarAssistant()
  controller.avatar = avatar

  // Carrega a skin atual do jogador
  const currentSkin = model.state.currentSkin || "images/skins/default_male.png"
  avatar.changeSkin(currentSkin)

  // Mostra mensagem de boas-vindas
  setTimeout(() => {
    avatar.showMessage(`Olá, ${currentUser.nome}! Pronto para jogar?`)
  }, 800)

  console.log("Sílabas Mágicas iniciado!")

  // =============================
  // Botão de Créditos no canto
  // =============================
  const createCreditsButton = () => {
    const existingBtn = document.querySelector(".btn-creditos")
    if (existingBtn) return // evita criar várias vezes

    const creditBtn = document.createElement("button")
    creditBtn.textContent = "Créditos"
    creditBtn.classList.add("btn-creditos")
    creditBtn.addEventListener("click", () => {
      // Abre a página de créditos
      window.location.href = "/html/credits.html"
    })
    document.body.appendChild(creditBtn)
  }

  // Cria o botão de créditos
  createCreditsButton()
})
