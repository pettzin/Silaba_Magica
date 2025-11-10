// NOTE: migrating server-side persistence to localStorage.
// Users are stored in localStorage under the key 'sm_users' as an array of objects:
// { id, nome, idade, gameState, dataCriacao, ultimoAcesso }

// constants / helpers for local storage
const USERS_KEY = 'sm_users'

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
  } catch (e) {
    console.error('Erro ao ler usuários do localStorage', e)
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users || []))
}

function findUser(nome, idade) {
  const users = getUsers()
  return users.find((u) => u.nome === nome.toLowerCase() && u.idade === idade)
}

function createUser(nome, idade) {
  const users = getUsers()
  const id = `u_${Date.now()}`
  const newUser = {
    id,
    nome: nome.toLowerCase(),
    idade,
    gameState: {
      credits: 0,
      unlockedLevel: 1,
      currentSkin: 'images/skins/default_male.png',
      ownedSkins: ['default_male', 'default_female'],
      musicEnabled: true,
      soundEffectsEnabled: true,
    },
    dataCriacao: new Date().toISOString(),
    ultimoAcesso: new Date().toISOString(),
  }
  users.push(newUser)
  saveUsers(users)
  return newUser
}

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

// Login (local usando localStorage)
btnLogin.addEventListener('click', () => {
  const nome = loginNome.value.trim();
  const idade = parseInt(loginIdade.value);

  if (!nome || !idade) {
    showMessage(loginMessage, 'Por favor, preencha nome e idade!', 'error');
    return;
  }

  btnLogin.disabled = true;
  btnLogin.classList.add('loading');

  try {
    const usuario = findUser(nome, idade)
    if (!usuario) {
      showMessage(loginMessage, 'Nome ou idade incorretos! Verifique seus dados.', 'error')
    } else {
      // atualiza último acesso
      usuario.ultimoAcesso = new Date().toISOString()
      const users = getUsers().map((u) => (u.id === usuario.id ? usuario : u))
      saveUsers(users)

      showMessage(loginMessage, `Bem-vindo de volta, ${usuario.nome}! 🎮`, 'success')

      localStorage.setItem('currentUser', JSON.stringify({
        id: usuario.id,
        nome: usuario.nome,
        idade: usuario.idade,
      }))

      localStorage.setItem('silabasMagicasState', JSON.stringify(usuario.gameState))

      setTimeout(() => {
        window.location.href = 'index.html'
      }, 800)
    }
  } catch (error) {
    console.error('Erro ao fazer login (local):', error)
    showMessage(loginMessage, 'Erro interno! Tente novamente.', 'error')
  } finally {
    btnLogin.disabled = false;
    btnLogin.classList.remove('loading');
  }
})

// Cadastro (local usando localStorage)
btnCadastro.addEventListener('click', () => {
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

  btnCadastro.disabled = true;
  btnCadastro.classList.add('loading');

  try {
    const exists = findUser(nome, idade)
    if (exists) {
      showMessage(cadastroMessage, 'Já existe uma conta com esse nome e idade! Tente outro.', 'error')
    } else {
      const novo = createUser(nome, idade)
      showMessage(cadastroMessage, 'Conta criada com sucesso! 🎉', 'success')

      localStorage.setItem('currentUser', JSON.stringify({
        id: novo.id,
        nome: novo.nome,
        idade: novo.idade,
      }))

      localStorage.setItem('silabasMagicasState', JSON.stringify(novo.gameState))

      setTimeout(() => {
        window.location.href = 'index.html'
      }, 800)
    }
  } catch (error) {
    console.error('Erro ao cadastrar (local):', error)
    showMessage(cadastroMessage, 'Erro interno! Tente novamente.', 'error')
  } finally {
    btnCadastro.disabled = false;
    btnCadastro.classList.remove('loading');
  }
})

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
