// -----------------------------
// TELA INICIAL
// -----------------------------
const btnPlay = document.getElementById("btnPlay");
if (btnPlay) {
  btnPlay.addEventListener("click", () => {
    // Redireciona para a página da fase
    window.location.href = "fase1.html";
  });
}

// -----------------------------
// FASE 1 - CAÇA SÍLABAS
// -----------------------------
const feedback = document.getElementById("feedback");
const grid = document.getElementById("grid");

if (grid && feedback) {
  // Sílabas corretas para a fase 1
  const silabas = ["BO"];
  let selecionadas = [];
  let encontradas = [];

  // Gerar grid 8x5 com sílabas escondidas
  function gerarGrid() {
    grid.innerHTML = "";
    encontradas = [];
    feedback.textContent = "";
    feedback.className = "feedback";

    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let matrix = Array.from({ length: 5 }, () =>
      Array.from({ length: 8 }, () => letras[Math.floor(Math.random() * letras.length)])
    );

    // Inserir sílabas (horizontal ou vertical)
    silabas.forEach(silaba => {
      let posX, posY, horizontal;
      let colocado = false;
      let tentativas = 0;

      while (!colocado && tentativas < 50) {
        posX = Math.floor(Math.random() * 7); // colunas 0 a 7
        posY = Math.floor(Math.random() * 4); // linhas 0 a 4
        horizontal = Math.random() > 0.5;

        if (horizontal) {
          if (posX + 1 < 8) {
            matrix[posY][posX] = silaba[0];
            matrix[posY][posX + 1] = silaba[1];
            colocado = true;
          }
        } else {
          if (posY + 1 < 5) {
            matrix[posY][posX] = silaba[0];
            matrix[posY + 1][posX] = silaba[1];
            colocado = true;
          }
        }
        tentativas++;
      }
    });

    // Renderizar grid
    matrix.forEach((linha, y) => {
      linha.forEach((letra, x) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.textContent = letra;
        cell.dataset.x = x;
        cell.dataset.y = y;
        grid.appendChild(cell);
      });
    });

    ativarSelecao();
  }

  // Controle de seleção por arrasto
  function ativarSelecao() {
    let selecionando = false;

    grid.addEventListener("mousedown", e => {
      if (e.target.classList.contains("cell")) {
        e.preventDefault();
        selecionando = true;
        limparSelecao();
        selecionadas = [e.target];
        e.target.classList.add("selecionada");
      }
    });

    grid.addEventListener("mouseover", e => {
      if (selecionando && e.target.classList.contains("cell")) {
        if (!selecionadas.includes(e.target)) {
          selecionadas.push(e.target);
          e.target.classList.add("selecionada");
        }
      }
    });

    document.addEventListener("mouseup", () => {
      if (selecionando) {
        verificarSelecao();
        selecionando = false;
      }
    });

    // Suporte para touch (mobile)
    grid.addEventListener("touchstart", e => {
      e.preventDefault();
      const touch = e.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      if (element && element.classList.contains("cell")) {
        selecionando = true;
        limparSelecao();
        selecionadas = [element];
        element.classList.add("selecionada");
      }
    });

    grid.addEventListener("touchmove", e => {
      e.preventDefault();
      if (selecionando) {
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (element && element.classList.contains("cell") && !selecionadas.includes(element)) {
          selecionadas.push(element);
          element.classList.add("selecionada");
        }
      }
    });

    document.addEventListener("touchend", () => {
      if (selecionando) {
        verificarSelecao();
        selecionando = false;
      }
    });
  }

  // Limpar seleção anterior
  function limparSelecao() {
    document.querySelectorAll(".cell.selecionada").forEach(cell => {
      if (!cell.classList.contains("correta")) {
        cell.classList.remove("selecionada");
      }
    });
  }

  // Verificar se a seleção forma uma sílaba correta
  function verificarSelecao() {
    if (selecionadas.length < 2) {
      limparSelecao();
      selecionadas = [];
      return;
    }

    let palavra = selecionadas.map(c => c.textContent).join("");

    if (silabas.includes(palavra) && !encontradas.includes(palavra)) {
      feedback.textContent = `✅ Muito bem! Você encontrou: ${palavra}`;
      feedback.className = "feedback sucesso";
      encontradas.push(palavra);
      selecionadas.forEach(c => {
        c.classList.add("correta");
        c.classList.remove("selecionada");
      });
      
      // Atualizar progresso visual
      const progresso = document.getElementById(`silaba-${palavra}`);
      if (progresso) progresso.className = "silaba-encontrada";
      
      // Preencher lacuna se for LA
      const lacuna = document.querySelector(`.lacuna[data-silaba="${palavra}"]`);
      if (lacuna) {
        lacuna.textContent = palavra === "LA" ? "LÁ" : palavra;
        lacuna.classList.add("preenchida");
      }
      
    } else if (encontradas.includes(palavra)) {
      feedback.textContent = `Você já encontrou: ${palavra}`;
      feedback.className = "feedback";
      limparSelecao();
    } else {
      feedback.textContent = `"${palavra}" não é uma sílaba válida. Tente novamente!`;
      feedback.className = "feedback erro";
      limparSelecao();
    }

    selecionadas = [];

    // Verificar vitória
    if (encontradas.length === silabas.length) {
      setTimeout(() => {
        feedback.textContent = "🎉 Parabéns! Você encontrou todas as sílabas e completou a história!";
        feedback.className = "feedback vitoria";
      }, 500);
    }
  }

  // Inicializar o jogo quando a página carregar
  window.addEventListener('load', () => {
    gerarGrid();
  });
}
