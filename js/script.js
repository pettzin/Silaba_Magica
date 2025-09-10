// -----------------------------
// TELA INICIAL
// -----------------------------
const btnPlay = document.getElementById("btnPlay");
if (btnPlay) {
  btnPlay.addEventListener("click", () => {
    window.location.href = "fase1.html";
  });
}

// -----------------------------
// LOJA - botão loja
// -----------------------------
const btnLoja = document.getElementById("btnLoja");
if (btnLoja) {
  btnLoja.addEventListener("click", () => {
    window.location.href = "loja.html";
  });
}

// -----------------------------
// FASE 1 - CAÇA SÍLABAS
// -----------------------------
const feedback = document.getElementById("feedback");
const grid = document.getElementById("grid");

if (grid && feedback) {
  const silabas = ["BO"];
  let selecionadas = [];
  let encontradas = [];

  function gerarGrid() {
    grid.innerHTML = "";
    encontradas = [];
    feedback.textContent = "";
    feedback.className = "feedback";

    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let matrix = Array.from({ length: 5 }, () =>
      Array.from({ length: 8 }, () => letras[Math.floor(Math.random() * letras.length)])
    );

    silabas.forEach(silaba => {
      let posX, posY, horizontal;
      let colocado = false;
      let tentativas = 0;

      while (!colocado && tentativas < 50) {
        posX = Math.floor(Math.random() * 7);
        posY = Math.floor(Math.random() * 4);
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

  function limparSelecao() {
    document.querySelectorAll(".cell.selecionada").forEach(cell => {
      if (!cell.classList.contains("correta")) {
        cell.classList.remove("selecionada");
      }
    });
  }

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

    if (encontradas.length === silabas.length) {
      setTimeout(() => {
        feedback.textContent = "🎉 Parabéns! Você completou a história!";
        feedback.className = "feedback vitoria";
      }, 500);
    }
  }

  window.addEventListener('load', () => {
    gerarGrid();
  });
}
