# 🏴‍☠️ Fase Secreta - Tesouro Escondido

## 📋 Resumo das Mudanças

A fase 6 secreta foi implementada com desbloqueio automático ao comprar a skin do pirata.

### Arquivos Alterados

1. **`js/models/GameModel.js`**
   - ✅ Fase 6 criada com história de tesouro
   - ✅ Função `checkSecretLevels()` para verificar skins e desbloquear fases secretas
   - ✅ Função `isSecretLevelUnlocked(levelId)` para verificar se uma fase secreta está desbloqueada

2. **`js/controllers/GameController.js`**
   - ✅ Chama `checkSecretLevels()` ao renderizar seleção de fases
   - ✅ Chama `checkSecretLevels()` após comprar uma skin
   - ✅ Suporte para background da fase 6 (`game-background-6`)
   - ✅ Passa função de validação para `LevelSelectView`

3. **`js/views/LevelSelectView.js`**
   - ✅ Renderiza fase 6 (emoji 🏴‍☠️) se desbloqueada
   - ✅ Estilo especial com animação pulsante

4. **`css/style.css`**
   - ✅ Estilos para botão da fase secreta (`.level-button.secret-level`)
   - ✅ Animação pulsante (`pulse-secret`)
   - ✅ Background especial para fase 6

## 🎮 Como Testar

### Pré-requisitos
- Ter o jogo rodando no navegador
- Estar logado com um usuário

### Passo 1: Abrir a Loja
1. Clique em "JOGAR"
2. Clique em "🛒 Loja"

### Passo 2: Comprar a Skin do Pirata
1. Procure pela skin **"Pirata"** (preço: 250 créditos)
2. Clique em "Comprar"
3. Um **popup deve aparecer** informando:
   - 🏴‍☠️ 🗺️ 💎 "FASE SECRETA DESBLOQUEADA!"
   - "Você desbloqueou a Fase 6: 🏴‍☠️ Tesouro Escondido (FASE SECRETA) 🏴‍☠️"
   - "Uma aventura mágica te espera. Procure por ela na seleção de fases."
   - Recompensa: 750 créditos extras

### Passo 3: Verificar na Seleção de Fases
1. Clique em "⬅ Voltar" (voltará à seleção de fases)
2. Ou clique em "JOGAR" na home
3. Você deve ver um **botão 🏴‍☠️ pulsante** após as 5 fases normais
4. Clique nele para jogar a fase secreta

### Passo 4: Jogar a Fase Secreta
- **Título:** 🏴‍☠️ Tesouro Escondido (FASE SECRETA) 🏴‍☠️
- **Sílabas:** RA, MA, LHE, ROU
- **Recompensa:** 750 créditos
- **Background:** Gradiente marrom especial com emoji de tesouro/pirata/mapa

### Passo 5: Verificar Persistência
- Abra as Developer Tools (F12)
- Vá em **Application → Local Storage**
- Procure por chave: `secret_level_6_unlocked` (deve ser `"true"`)
- Recarregue a página: a fase 6 deve continuar desbloqueada

## 🔧 Detalhes Técnicos

### Fluxo de Desbloqueio
```
Comprar Skin Pirata (avatar_pirata)
    ↓
GameModel.buySkin() retorna { unlockedSecret: {...} }
    ↓
GameController.handleBuySkin() chama checkSecretLevels()
    ↓
checkSecretLevels() verifica ownedSkins e seta flag em localStorage
    ↓
Popup exibido ao usuário
    ↓
Fase 6 aparece na seleção de fases
```

### Chaves de localStorage
- `secret_level_6_unlocked` - Flag de desbloqueio (valor: `"true"` ou inexistente)

### Métodos do GameModel
```javascript
checkSecretLevels()                    // Verifica e marca fases secretas desbloqueadas
isSecretLevelUnlocked(levelId)        // Retorna boolean se fase secreta está desbloqueada
```

## 🎨 Personalizações Possíveis

1. **Mudar emoji do botão:** Editar em `LevelSelectView.js` linha com `secretButton.textContent = "🏴‍☠️"`
2. **Alterar cores do background:** Editar `game-background-6` em `style.css`
3. **Modificar sílabas:** Editar array `syllables` na fase 6 em `GameModel.js`
4. **Mudar história:** Editar propriedade `story` da fase 6 em `GameModel.js`
5. **Alterar skin desbloqueadora:** Editar `unlockedBySkin: "avatar_pirata"` em `GameModel.js` (fase 6)

## 🐛 Possíveis Problemas

**P: Comprei a skin do pirata, mas a fase 6 não aparece**
- R: Recarregue a página e volte à seleção de fases

**P: O popup apareceu, mas cliquei em fechar e não vejo a fase**
- R: Clique em "⬅ Voltar" e depois "JOGAR" novamente para recarregar a seleção

**P: Perdi a skin do pirata ou a fase desapareceu**
- R: Verifique em localStorage se a chave `secret_level_6_unlocked` existe

**P: Quero testar novamente sem recomprar a skin**
- R: DevTools → Application → Local Storage → adicione manualmente a chave `secret_level_6_unlocked` com valor `"true"`

## 📝 Notas

- A fase 6 **não** incrementa o `unlockedLevel` (é independente)
- A fase 6 **não** é necessária para progredir em outras fases
- O desbloqueio é **permanente** enquanto a chave em localStorage existir
- Múltiplas fases secretas podem ser adicionadas seguindo o mesmo padrão
