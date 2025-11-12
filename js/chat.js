/* Chat UI + lightweight local "IA-like" engine (client-only prototype A)
   - Saves history in localStorage per user
   - Uses keyword/intents + retrieval from GameModel (skins/levels) to answer
   - Adds typing simulation and contextual memory window
*/

(function () {
  // Utilities
  function qs(sel, root = document) { return root.querySelector(sel) }
  function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)) }
  function now() { return new Date().toISOString() }

  class LocalAI {
    constructor() {
      this.model = new window.GameModel ? new window.GameModel() : null
      // Build small KB from model (skins and levels)
      this.kb = []
      try {
        const m = new window.GameModel()
        if (m.levels) {
          m.levels.forEach(l => this.kb.push({ type: 'level', id: l.id, title: l.title, text: stripTags(l.story) }))
        }
        if (m.skins) {
          m.skins.forEach(s => this.kb.push({ type: 'skin', id: s.id, title: s.name, text: s.description || s.name }))
        }
      } catch (e) {
        // ignore if model unavailable
      }
      this.historyWindow = 6
    }

    async respond(message, context) {
      const text = (message || '').toLowerCase().trim()
      if (!text) return "Desculpe, não entendi. Pode dizer novamente?"

      // 1) greetings
      if (/^(oi|ola|olá|bom dia|boa tarde|boa noite|e ai|ei)\b/.test(text)) {
        return this._personalityReply(`Oi! Eu sou a assistente do jogo. Como posso ajudar você hoje?`) }

      // 2) help / dicas combined behavior
      // If user asks for help in any form, first state capabilities. If the message also includes a phase number ("fase X"), append tips for that phase.
      const asksHelp = text.includes('ajuda') || text.includes('como jogar') || text.includes('como funciona') || text.includes('dicas')
      if (asksHelp) {
        const baseHelp = `Posso ajudar com: verificar seus créditos, explicar como comprar skins, mostrar qual fase está desbloqueada, dar dicas por fase, e dar informações sobre as skins e recompensas. Exemplos: "quantos créditos eu tenho", "como compro uma skin", "dicas fase 2".`

        // check if they also asked about a specific phase
        const faseMatchHelp = text.match(/fase\s*(\d+)/)
        if (faseMatchHelp) {
          const levelId = parseInt(faseMatchHelp[1], 10)
          try {
            const gm = new window.GameModel()
            const level = gm.getLevelData(levelId)
            if (level) {
              const syllables = level.syllables || []
              const story = level.story || ''
              const found = Array.from((story.matchAll(/data-silaba="([^"]+)"/gi))).map(m=>m[1])
              const uniqueFound = [...new Set(found.concat(syllables))]
              let hint = `\n\nDicas para a Fase ${levelId} (${level.title}): `
              if (level.objective) hint += `${stripTags(level.objective)} `
              if (syllables.length) hint += `Sílabas: ${syllables.join(', ')}. `
              if (level.reward) hint += `Recompensa: ${level.reward} créditos. `
              if (uniqueFound.length) hint += `Dica: procure pelas lacunas (__) perto dessas sílabas: ${uniqueFound.slice(0,6).join(', ')}.`
              else hint += 'Dica: leia as lacunas com atenção e tente completar as sílabas uma a uma.'

              return this._personalityReply(`${baseHelp}${hint}`)
            } else {
              return this._personalityReply(`${baseHelp}\n\nNão encontrei a fase ${levelId}. Posso dar dicas da sua fase atual se preferir.`)
            }
          } catch (e) {
            return this._personalityReply(`${baseHelp}\n\nNão consegui acessar os dados da fase agora, mas posso ajudar com assuntos gerais do jogo.`)
          }
        }

        // if no specific phase requested, return base help only
        return this._personalityReply(baseHelp)
      }

      // 3) credits
      if (text.includes('credito') || text.includes('crédit') || text.includes('dinheiro')) {
        const st = JSON.parse(localStorage.getItem('silabasMagicasState') || 'null')
        const credits = st?.credits ?? 0
        return this._personalityReply(`Você tem ${credits} créditos.`)
      }

  // 4) loja / comprar
      if (text.includes('loja') || text.includes('comprar') || text.includes('skin')) {
        // try to see if user asked about specific skin
        const m = new window.GameModel()
        // check for exact skin id or name
        const found = m.skins.find(s => text.includes(s.id) || text.includes((s.name || '').toLowerCase()))
        if (found) {
          return this._personalityReply(`Skin: ${found.name}. Preço: ${found.price} créditos. Necessita nível ${found.unlockLevel}.`) }
        // else list affordable
        const st = JSON.parse(localStorage.getItem('silabasMagicasState') || 'null')
        const credits = st?.credits ?? 0
        const affordable = m.skins.filter(s => s.price <= credits).map(s => `${s.name} (${s.price})`).slice(0,5)
        if (affordable.length) return this._personalityReply(`Você pode comprar: ${affordable.join(', ')}.`)
        return this._personalityReply('Posso abrir a loja para você. Vá em Loja no jogo para comprar skins.')
      }

      // 5) fase / levels
      // Dicas para fases: "dica(s) fase 2", "dicas para a fase 3", "como passar da fase 1"
      const faseMatch = text.match(/fase\s*(\d+)/)
      const asksForHint = text.includes('dica') || text.includes('dicas') || text.includes('ajuda') || text.includes('como passar') || text.includes('como completar')
      if (faseMatch && asksForHint) {
        const levelId = parseInt(faseMatch[1], 10)
        try {
          const gm = new window.GameModel()
          const level = gm.getLevelData(levelId)
          if (level) {
            // extract syllables and short story snippets for hint
            const syllables = level.syllables || []
            // try to extract occurrences from story (data-silaba attributes)
            const story = level.story || ''
            const found = Array.from((story.matchAll(/data-silaba="([^"]+)"/gi))).map(m=>m[1])
            const uniqueFound = [...new Set(found.concat(syllables))]

            let hint = `Fase ${levelId}: ${level.title}. Objetivo: ${stripTags(level.objective || level.story || '')}. `
            if (syllables.length) {
              hint += `Sílabas a encontrar: ${syllables.join(', ')}. `
            }
            if (level.reward) hint += `Recompensa: ${level.reward} créditos. `

            // gameplay tips
            if (uniqueFound.length) {
              hint += `Dica: procure pelas lacunas na história (__). As sílabas aparecem próximas às lacunas, por exemplo: ${uniqueFound.slice(0,4).join(', ')}. `
            } else {
              hint += 'Dica: leia com atenção as lacunas na história e tente completar uma sílaba de cada vez. ';
            }
            hint += 'Se preferir, peça uma dica mais específica (por exemplo: "dica da sílaba NI").'
            return this._personalityReply(hint)
          } else {
            return this._personalityReply(`Não encontrei a fase ${levelId}. Quer dica da sua fase atual?`) }
        } catch (e) {
          return this._personalityReply('Não consegui acessar os dados da fase agora, mas tente novamente.')
        }
      }

      if (text.includes('fase') || text.includes('nivel') || text.includes('desbloqueado')) {
        const st = JSON.parse(localStorage.getItem('silabasMagicasState') || 'null')
        const unlocked = st?.unlockedLevel ?? 1
        return this._personalityReply(`Seu nível desbloqueado atual é ${unlocked}. Boa sorte nas próximas fases!`)
      }

      // 6) try retrieval from KB
      const kbHit = this._kbSearch(text)
      if (kbHit) return this._personalityReply(kbHit)

      // 7) fallback with suggestions
      return this._personalityReply("Desculpe, não sei exatamente, mas posso ajudar com créditos, loja, skins, fases e dicas. Tente: 'quantos créditos eu tenho', 'como compro uma skin' ou 'dicas para a fase 3'.")
    }

    _kbSearch(text) {
      const tokens = text.split(/\s+/).filter(Boolean)
      let best = null
      let bestScore = 0
      this.kb.forEach(item => {
        let score = 0
        tokens.forEach(t => { if ((item.text || '').toLowerCase().includes(t) || (item.title || '').toLowerCase().includes(t)) score++ })
        if (score > bestScore) { bestScore = score; best = item }
      })
      if (best && bestScore > 0) {
        return `${best.type === 'level' ? 'Fase: ' + best.title : 'Skin: ' + best.title} — ${best.text.slice(0,200)}${best.text.length>200?'...':''}`
      }
      return null
    }

    _personalityReply(text) {
      // small personality tweaks can go here
      return text
    }
  }

  class ChatUI {
    constructor() {
      this.user = JSON.parse(localStorage.getItem('currentUser') || 'null') || { id: 'guest' }
      this.storageKey = `sm_chat_${this.user.id}`
      this.history = JSON.parse(localStorage.getItem(this.storageKey) || '[]')
      this.ai = new LocalAI()
      this._build()
      this._renderHistory()
    }

    _build() {
      // button
      this.btn = document.createElement('div')
      this.btn.className = 'sm-chat-btn'
      this.btn.title = 'Abrir chat'
      this.btn.innerHTML = 'IA'
      this.btn.addEventListener('click', () => this.open())
      document.body.appendChild(this.btn)

      // modal
      this.modal = document.createElement('div')
      this.modal.className = 'sm-chat-modal'
      this.modal.style.display = 'none'

      this.modal.innerHTML = `
        <div class="sm-chat-header">
          <div class="title">Assistente do Jogo</div>
          <div style="display:flex;gap:8px;align-items:center">
            <button id="sm-voice" class="sm-voice-btn" title="Voz">🔊</button>
            <button id="sm-export">Export</button>
            <button id="sm-clear">Limpar</button>
            <button id="sm-close">×</button>
          </div>
        </div>
        <div class="sm-chat-body" id="sm-chat-body"></div>
        <div class="sm-chat-footer">
          <div class="sm-chat-input"><input id="sm-input" placeholder="Escreva sua pergunta..."/></div>
          <div class="sm-send"><button id="sm-send">Enviar</button></div>
        </div>`

      document.body.appendChild(this.modal)

      qs('#sm-close', this.modal).addEventListener('click', () => this.close())
      qs('#sm-send', this.modal).addEventListener('click', () => this._onSend())
      qs('#sm-input', this.modal).addEventListener('keypress', (e) => { if (e.key==='Enter') this._onSend() })
      qs('#sm-clear', this.modal).addEventListener('click', () => this._clearHistory())
      qs('#sm-export', this.modal).addEventListener('click', () => this._exportHistory())

      // voice toggle
      this.voiceEnabled = localStorage.getItem('sm_voice_enabled') !== 'false'
      const voiceBtn = qs('#sm-voice', this.modal)
      if (voiceBtn) {
        voiceBtn.classList.toggle('active', this.voiceEnabled)
        voiceBtn.title = this.voiceEnabled ? 'Voz: ligada' : 'Voz: desligada'
        voiceBtn.addEventListener('click', () => {
          this.voiceEnabled = !this.voiceEnabled
          localStorage.setItem('sm_voice_enabled', this.voiceEnabled)
          voiceBtn.classList.toggle('active', this.voiceEnabled)
          voiceBtn.title = this.voiceEnabled ? 'Voz: ligada' : 'Voz: desligada'
        })
      }

      this.bodyEl = qs('#sm-chat-body', this.modal)
    }

    _speak(text) {
      if (!this.voiceEnabled) return
      if (!('speechSynthesis' in window)) return
      try {
        window.speechSynthesis.cancel()
        const u = new SpeechSynthesisUtterance(text)
        u.lang = 'pt-BR'
        u.rate = 0.95
        u.pitch = 1
        window.speechSynthesis.speak(u)
      } catch (e) {
        console.error('Erro na síntese de voz:', e)
      }
    }

    open() { this.modal.style.display = 'flex'; qs('#sm-input', this.modal).focus(); this._renderHistory() }
    close() { this.modal.style.display = 'none' }

    _renderHistory() {
      this.bodyEl.innerHTML = ''
      if (!this.history.length) {
        const empty = document.createElement('div'); empty.className='sm-chat-empty'; empty.textContent='Converse com a assistente. Dica: pergunte sobre créditos, loja, ou fases.'; this.bodyEl.appendChild(empty); return
      }
      this.history.forEach(m => this._appendMessage(m))
      this.bodyEl.scrollTop = this.bodyEl.scrollHeight
    }

    _appendMessage(m) {
      const wrap = document.createElement('div')
      wrap.className = `sm-msg ${m.role==='user' ? 'user':'bot'}`
      const bubble = document.createElement('div')
      bubble.className = 'bubble'
      bubble.innerHTML = escapeHtml(m.content)
      wrap.appendChild(bubble)
      this.bodyEl.appendChild(wrap)
      this.bodyEl.scrollTop = this.bodyEl.scrollHeight
    }

    async _onSend() {
      const input = qs('#sm-input', this.modal)
      const txt = (input.value || '').trim()
      if (!txt) return
      const userMsg = { role: 'user', content: txt, time: now() }
      this.history.push(userMsg)
      localStorage.setItem(this.storageKey, JSON.stringify(this.history))
      this._appendMessage(userMsg)
      input.value = ''

      // show typing
      const typingEl = document.createElement('div'); typingEl.className='sm-msg bot'; typingEl.innerHTML='<div class="bubble sm-typing">Digitando...</div>'
      this.bodyEl.appendChild(typingEl)
      this.bodyEl.scrollTop = this.bodyEl.scrollHeight

      try {
        const replyText = await this.ai.respond(txt, this._recentHistory())
        // simulate typing delay
        const delay = Math.min(1200 + replyText.length * 20, 3000)
        await new Promise(r => setTimeout(r, delay))
        typingEl.remove()
        const botMsg = { role: 'bot', content: replyText, time: now() }
        this.history.push(botMsg)
        localStorage.setItem(this.storageKey, JSON.stringify(this.history))
        this._appendMessage(botMsg)
        // speak the bot message (if enabled)
        this._speak(replyText)
      } catch (e) {
        typingEl.remove()
        const errMsg = { role: 'bot', content: 'Erro interno ao gerar resposta.', time: now() }
        this.history.push(errMsg)
        localStorage.setItem(this.storageKey, JSON.stringify(this.history))
        this._appendMessage(errMsg)
      }
    }

    _recentHistory() {
      return this.history.slice(-this.ai.historyWindow*2)
    }

    _clearHistory() {
      if (!confirm('Limpar histórico do chat?')) return
      this.history = []
      localStorage.removeItem(this.storageKey)
      this._renderHistory()
    }

    _exportHistory() {
      const data = JSON.stringify(this.history, null, 2)
      const blob = new Blob([data], {type:'application/json'})
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href=url; a.download = `chat_${this.user.id}.json`; a.click(); URL.revokeObjectURL(url)
    }
  }

  // helpers
  function escapeHtml(str){ return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
  function stripTags(s) { return (s||'').replace(/<[^>]*>/g,'') }

  // Auto init after DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    try { window._sm_chat = new ChatUI() } catch (e) { console.error('Erro ao iniciar chat UI', e) }
  })

})();
