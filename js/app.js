// Aguarda o HTML da página ser completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Cria uma instância do nosso Modelo de dados
    const model = new GameModel();

    // 2. Cria instâncias de todas as nossas Views
    const views = {
        home: new HomeView(),
        levelSelect: new LevelSelectView(),
        game: new GameView(),
        shop: new ShopView()
    };

    // 3. Cria o Controller, entregando o modelo e as views para ele
    const controller = new GameController(model, views);

    // 4. Manda o Controller iniciar o jogo
    controller.init();

    console.log("Sílabas Mágicas iniciado!");
});