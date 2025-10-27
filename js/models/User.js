const mongoose = require("mongoose")

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

module.exports = mongoose.model("User", UserSchema)
