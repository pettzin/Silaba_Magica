const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const userRoutes = require("../routes/UserRoutes");

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json())
app.use("/usuarios", userRoutes);

// Conexão com MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/silabas-magicas"

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err))

// Schema do Usuário
const UserSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  idade: {
    type: Number,
    required: true,
    min: 3,
    max: 15,
  },
  gameState: {
    credits: {
      type: Number,
      default: 0,
    },
    unlockedLevel: {
      type: Number,
      default: 1,
    },
    currentSkin: {
      type: String,
      default: "images/skins/default_male.png",
    },
    ownedSkins: {
      type: [String],
      default: ["default_male", "default_female"],
    },
  },
  dataCriacao: {
    type: Date,
    default: Date.now,
  },
  ultimoAcesso: {
    type: Date,
    default: Date.now,
  },
})

const User = mongoose.models.User || mongoose.model("User", UserSchema);

// Rotas

// Rota de cadastro
app.post("/usuarios/cadastrar", async (req, res) => {
  try {
    const { nome, idade } = req.body

    // Validações
    if (!nome || !idade) {
      return res.json({
        success: false,
        message: "Nome e idade são obrigatórios!",
      })
    }

    if (idade < 3 || idade > 15) {
      return res.json({
        success: false,
        message: "Idade deve estar entre 3 e 15 anos!",
      })
    }

   
      // Verifica se já existe usuário com o mesmo nome E idade
    const usuarioExistente = await User.findOne({ 
      nome: nome.toLowerCase(), 
      idade: idade 
    })

    if (usuarioExistente) {
      return res.json({
        success: false,
        message: "Já existe uma conta com esse nome e idade! Tente outro.",
      })
    }


    // Cria novo usuário
    const novoUsuario = new User({
      nome: nome.toLowerCase(),
      idade,
      gameState: {
        credits: 0,
        unlockedLevel: 1,
        currentSkin: "images/skins/default_male.png",
        ownedSkins: ["default_male", "default_female"],
      },
    })

    await novoUsuario.save()

    res.json({
      success: true,
      message: "Conta criada com sucesso! 🎉",
      user: {
        id: novoUsuario._id,
        nome: novoUsuario.nome,
        idade: novoUsuario.idade,
        gameState: novoUsuario.gameState,
      },
    })
  } catch (error) {
    console.error("Erro ao cadastrar:", error)
    res.status(500).json({
      success: false,
      message: "Erro ao criar conta. Tente novamente.",
    })
  }
})

// Rota de login (com validação de nome E idade)
app.post("/usuarios/login", async (req, res) => {
  try {
    const { nome, idade } = req.body

    // Validações
    if (!nome || !idade) {
      return res.json({
        success: false,
        message: "Nome e idade são obrigatórios!",
      })
    }

    // Busca usuário pelo nome E idade
    const usuario = await User.findOne({
      nome: nome.toLowerCase(),
      idade: idade,
    })

    if (!usuario) {
      return res.json({
        success: false,
        message: "Nome ou idade incorretos! Verifique seus dados.",
      })
    }

    // Atualiza último acesso
    usuario.ultimoAcesso = new Date()
    await usuario.save()

    res.json({
      success: true,
      message: `Bem-vindo de volta, ${usuario.nome}! 🎮`,
      user: {
        id: usuario._id,
        nome: usuario.nome,
        idade: usuario.idade,
        gameState: usuario.gameState,
      },
    })
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    res.status(500).json({
      success: false,
      message: "Erro ao entrar. Tente novamente.",
    })
  }
})

// Rota para salvar progresso do jogo
app.put("/usuarios/salvar-progresso/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { gameState } = req.body

    const usuario = await User.findById(id)

    if (!usuario) {
      return res.json({
        success: false,
        message: "Usuário não encontrado!",
      })
    }

    // Atualiza o estado do jogo
    usuario.gameState = gameState
    usuario.ultimoAcesso = new Date()
    await usuario.save()

    res.json({
      success: true,
      message: "Progresso salvo com sucesso!",
    })
  } catch (error) {
    console.error("Erro ao salvar progresso:", error)
    res.status(500).json({
      success: false,
      message: "Erro ao salvar progresso.",
    })
  }
})

// Rota para buscar dados do usuário
app.get("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params

    const usuario = await User.findById(id)

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado!",
      })
    }

    res.json({
      success: true,
      user: {
        id: usuario._id,
        nome: usuario.nome,
        idade: usuario.idade,
        gameState: usuario.gameState,
      },
    })
  } catch (error) {
    console.error("Erro ao buscar usuário:", error)
    res.status(500).json({
      success: false,
      message: "Erro ao buscar dados do usuário.",
    })
  }
})

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📡 API disponível em http://localhost:${PORT}`)
})
