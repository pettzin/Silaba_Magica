// URL da API
const API_URL = 'http://localhost:3000/usuarios';

// Elementos do DOM
const loginForm = document.getElementById('login-form');
const cadastroForm = document.getElementById('cadastro-form');
const switchToCadastro = document.getElementById('switch-to-cadastro');
const switchToLogin = document.getElementById('switch-to-login');

const btnLogin = document.getElementById('btn-login');
const btnCadastro = document.getElementById('btn-cadastro');

const loginNome = document.getElementById('login-nome');
const loginIdade = document.getElementById('login-idade'); // campo de idade no login
const cadastroNome = document.getElementById('cadastro-nome');
const cadastroIdade = document.getElementById('cadastro-idade');

const loginMessage = document.getElementById('login-message');
const cadastroMessage = document.getElementById('cadastro-message');

// Alternar entre formulários
switchToCadastro.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.remove('active');
  cadastroForm.classList.add('active');
  clearMessages();
});

switchToLogin.addEventListener('click', (e) => {
  e.preventDefault();
  cadastroForm.classList.remove('active');
  loginForm.classList.add('active');
  clearMessages();
});

// Login
btnLogin.addEventListener('click', async () => {
  const nome = loginNome.value.trim();
  const idade = parseInt(loginIdade.value);

  if (!nome || !idade) {
    showMessage(loginMessage, 'Por favor, preencha nome e idade!', 'error');
    return;
  }

  try {
    btnLogin.disabled = true;
    btnLogin.classList.add('loading');

    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, idade }) // envia ambos
    });

    const data = await response.json();

    if (data.success) {
      showMessage(loginMessage, data.message, 'success');

      // Salva dados do usuário
      localStorage.setItem('currentUser', JSON.stringify({
        id: data.user.id,
        nome: data.user.nome,
        idade: data.user.idade
      }));

      localStorage.setItem('silabasMagicasState', JSON.stringify(data.user.gameState));

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } else {
      showMessage(loginMessage, data.message, 'error');
    }

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    showMessage(loginMessage, 'Erro de conexão! Tente novamente.', 'error');
  } finally {
    btnLogin.disabled = false;
    btnLogin.classList.remove('loading');
  }
});

// Cadastro
btnCadastro.addEventListener('click', async () => {
  const nome = cadastroNome.value.trim();
  const idade = parseInt(cadastroIdade.value);

  if (!nome || !idade) {
    showMessage(cadastroMessage, 'Preencha todos os campos!', 'error');
    return;
  }

  if (idade < 3 || idade > 15) {
    showMessage(cadastroMessage, 'Idade deve estar entre 3 e 15 anos!', 'error');
    return;
  }

  try {
    btnCadastro.disabled = true;
    btnCadastro.classList.add('loading');

    const response = await fetch(`${API_URL}/cadastrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, idade })
    });

    const data = await response.json();

    if (data.success) {
      showMessage(cadastroMessage, data.message, 'success');

      // Salva dados do usuário
      localStorage.setItem('currentUser', JSON.stringify({
        id: data.user.id,
        nome: data.user.nome,
        idade: data.user.idade
      }));

      localStorage.setItem('silabasMagicasState', JSON.stringify(data.user.gameState));

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);

    } else {
      showMessage(cadastroMessage, data.message, 'error');
    }

  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    showMessage(cadastroMessage, 'Erro de conexão! Tente novamente.', 'error');
  } finally {
    btnCadastro.disabled = false;
    btnCadastro.classList.remove('loading');
  }
});

// Permitir Enter para submeter
loginNome.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') btnLogin.click();
});
loginIdade.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') btnLogin.click();
});

cadastroNome.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') btnCadastro.click();
});
cadastroIdade.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') btnCadastro.click();
});

// Funções auxiliares
function showMessage(element, text, type) {
  element.textContent = text;
  element.className = `message ${type} show`;

  setTimeout(() => {
    element.classList.remove('show');
  }, 4000);
}

function clearMessages() {
  loginMessage.classList.remove('show');
  cadastroMessage.classList.remove('show');
}
