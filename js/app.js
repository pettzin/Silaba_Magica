// Aguarda o HTML da página ser completamente carregado
document.addEventListener("DOMContentLoaded", () => {
  // 1. Cria uma instância do nosso Modelo de dados
  const model = new GameModel()

  // 2. Cria instâncias de todas as nossas Views
  const views = {
    home: new HomeView(),
    levelSelect: new LevelSelectView(),
    game: new GameView(),
    shop: new ShopView(),
  }

  // 3. Cria o Controller primeiro
  const controller = new GameController(model, views)

  // 4. Manda o Controller iniciar o jogo
  controller.init()

  // 5. Cria o Avatar Assistente depois que tudo estiver pronto
  const avatar = new AvatarAssistant()
  
  // Guarda referência do avatar no controller
  controller.avatar = avatar
  
  // Carrega a skin atual do jogador
  const currentSkin = model.state.currentSkin || "images/skins/default_male.png"
  avatar.changeSkin(currentSkin)
  
  // Mostra mensagem de boas-vindas
  setTimeout(() => {
    avatar.showRandomMessage('home')
  }, 800)

  console.log("Sílabas Mágicas iniciado!")
})