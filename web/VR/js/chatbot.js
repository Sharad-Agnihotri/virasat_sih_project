// ============================================================
// chatbot.js — AI Guide Chatbot Controller
// Live LLM guide grounded in the current monument, with the original
// pattern-matching responder kept as an offline fallback.
// ============================================================

class MonumentChatbot {
  constructor() {
    this.messages = [];
    this.currentMonument = null;
    this.isTyping = false;
    this.onMessage = null; // callback(message)
    this.onTypingStart = null;
    this.onTypingEnd = null;
  }

  // Set the active monument for context
  setMonument(monumentId) {
    this.currentMonument = monumentId;
    this.messages = [];
    
    const monument = getMonument(monumentId);
    if (monument && monument.chatbotKnowledge) {
      this.addBotMessage(monument.chatbotKnowledge.greeting);
    }
  }

  // Process user input
  async processUserMessage(text) {
    const question = (text || '').trim();
    if (!question) return;

    this.addMessage({ type: 'user', text: question });

    this.isTyping = true;
    if (this.onTypingStart) this.onTypingStart();

    // Ask the live model first, grounded in this monument. The keyword matcher
    // below is now only the offline fallback — on its own it answered most
    // questions with "here's a random fact instead", which is not an answer.
    let response = await this.askLiveGuide(question);
    if (!response) {
      const local = this.generateResponse(question);
      response = this._offlineNote() + local;
    }

    this.isTyping = false;
    if (this.onTypingEnd) this.onTypingEnd();
    this.addBotMessage(response);
  }

  /* ── Live AI guide ─────────────────────────────────────────────────────
     Same proxy the rest of Virasat uses. Everything the data layer knows
     about the current monument and viewpoint goes into the system prompt,
     so the answer is specific to what the visitor is looking at. */
  static get PROXY_ENDPOINTS() {
    const host = window.location.hostname || 'localhost';
    return ['/api/chat', 'http://localhost:3005/api/chat'];
  }

  _buildSystemPrompt() {
    const m = getMonument(this.currentMonument);
    if (!m) return 'You are Virasat, a friendly expert guide to Indian heritage monuments. Answer in 2–4 sentences.';

    const vp = (typeof app !== 'undefined' && app.state && app.state.currentViewpoint)
      ? (m.viewpoints || []).find(v => v.id === app.state.currentViewpoint)
      : null;
    const k = m.chatbotKnowledge || {};
    const h = m.historicalInfo || {};
    const lang = (typeof getCurrentLanguage === 'function') ? getCurrentLanguage() : 'en';
    const langNames = { en: 'English', hi: 'Hindi (Devanagari script)', es: 'Spanish', fr: 'French', ja: 'Japanese' };

    return [
      `You are Virasat, an expert, warm heritage guide standing beside a visitor inside a 360° virtual tour of ${m.name}.`,
      `Reply in ${langNames[lang] || 'English'}. Keep answers to 2–4 sentences unless the visitor asks for detail. No markdown headings; short bold is fine.`,
      `Answer the visitor's actual question directly first, then add one vivid detail. If you genuinely don't know, say so briefly — never substitute an unrelated fact.`,
      '',
      `MONUMENT: ${m.name} — ${m.location}. Built ${m.year}. ${m.category || ''}. Architect: ${m.architect || 'unknown'}.`,
      `DESCRIPTION: ${m.description}`,
      vp ? `VISITOR IS CURRENTLY LOOKING AT: ${vp.name} — ${vp.description}` : '',
      k.facts && k.facts.length ? `KEY FACTS:\n- ${k.facts.join('\n- ')}` : '',
      k.qa && k.qa.length ? `CURATED ANSWERS:\n${k.qa.map(x => `- Q(${x.q.join('/')}): ${x.a}`).join('\n')}` : '',
      h.era ? `HISTORICAL CONTEXT (${h.era}): ${h.pastDescription} Changes since: ${h.changes}` : '',
      `Other monuments in this tour: ${(typeof getMonumentIds === 'function' ? getMonumentIds() : []).filter(id => id !== m.id).map(id => getMonument(id)?.name).filter(Boolean).join(', ')}.`
    ].filter(Boolean).join('\n');
  }

  async askLiveGuide(question) {
    // Last few turns for continuity, trimmed so the prompt stays small.
    const history = this.messages
      .slice(-7, -1)
      .filter(msg => msg.type === 'user' || msg.type === 'bot')
      .map(msg => ({ role: msg.type === 'user' ? 'user' : 'assistant', content: String(msg.text).slice(0, 600) }));

    const body = JSON.stringify({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: this._buildSystemPrompt() },
        ...history,
        { role: 'user', content: question }
      ],
      temperature: 0.4,
      max_tokens: 320
    });

    for (const url of MonumentChatbot.PROXY_ENDPOINTS) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 12000);
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          signal: controller.signal
        });
        clearTimeout(timer);
        if (!res.ok) continue;
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text && text.trim()) {
          this._liveAvailable = true;
          return text.trim();
        }
      } catch (err) {
        /* try the next endpoint */
      }
    }
    this._liveAvailable = false;
    return null;
  }

  _offlineNote() {
    // Say so once per session rather than pretending the canned reply is AI.
    if (this._offlineNoted) return '';
    this._offlineNoted = true;
    return '⚠️ Live guide is offline (start `node server.js` to enable it). From what I have stored:\n\n';
  }

  // Generate AI-like response based on pattern matching
  generateResponse(input) {
    const monument = getMonument(this.currentMonument);
    if (!monument || !monument.chatbotKnowledge) {
      return "I'm sorry, I don't have information about this monument yet. Try selecting a different monument!";
    }
    
    const knowledge = monument.chatbotKnowledge;
    const inputLower = input.toLowerCase();
    
    // Check Q&A pairs for pattern match
    for (const qa of knowledge.qa) {
      for (const keyword of qa.q) {
        if (inputLower.includes(keyword.toLowerCase())) {
          return qa.a;
        }
      }
    }
    
    // Check for generic requests
    if (this.matchesAny(inputLower, ['fact', 'interesting', 'tell me', 'did you know', 'fun', 'surprise', 'random'])) {
      const facts = knowledge.facts;
      const usedFacts = this.messages
        .filter(m => m.type === 'bot')
        .map(m => m.text);
      
      // Find an unused fact
      const unusedFacts = facts.filter(f => !usedFacts.includes(f));
      if (unusedFacts.length > 0) {
        return unusedFacts[Math.floor(Math.random() * unusedFacts.length)];
      }
      return facts[Math.floor(Math.random() * facts.length)];
    }
    
    // Greetings
    if (this.matchesAny(inputLower, ['hello', 'hi', 'hey', 'namaste', 'hola', 'bonjour'])) {
      return `Hello! 👋 I'm excited to share the wonders of the ${monument.name} with you. What would you like to know?`;
    }
    
    // Thanks
    if (this.matchesAny(inputLower, ['thank', 'thanks', 'awesome', 'great', 'cool', 'amazing'])) {
      return `You're welcome! 😊 The ${monument.name} truly is an incredible place. Is there anything else you'd like to explore?`;
    }
    
    // Help
    if (this.matchesAny(inputLower, ['help', 'what can', 'options', 'commands'])) {
      return `You can ask me about:\n• Who built it and when\n• Its history and significance\n• Architectural details\n• Fun facts and trivia\n• Size and dimensions\n\nOr just ask me to surprise you with a fun fact! 🎯`;
    }
    
    // Location/visit
    if (this.matchesAny(inputLower, ['where', 'location', 'visit', 'how to get', 'travel', 'address'])) {
      return `The ${monument.name} is located in ${monument.location}. It's coordinates are approximately ${monument.coordinates.lat}°N, ${monument.coordinates.lng}°E. It's definitely a must-visit destination! 📍`;
    }
    
    // Time/hours
    if (this.matchesAny(inputLower, ['time', 'hours', 'open', 'close', 'ticket'])) {
      return `For the latest visiting hours and ticket prices, I recommend checking the official tourism website. Opening hours can change seasonally. Through this virtual tour, you can explore anytime! 🕐`;
    }
    
    // Photos
    if (this.matchesAny(inputLower, ['photo', 'picture', 'camera', 'instagram'])) {
      return `The ${monument.name} is one of the most photographed landmarks in the world! The best time for photos is usually during golden hour — sunrise or sunset. You're getting a great virtual view right now! 📸`;
    }
    
    // Default fallback with a random fact
    const fallbackResponses = [
      `That's a great question! While I may not have the specific answer, here's something amazing about the ${monument.name}: ${knowledge.facts[Math.floor(Math.random() * knowledge.facts.length)]}`,
      `Hmm, let me share something interesting instead: ${knowledge.facts[Math.floor(Math.random() * knowledge.facts.length)]}`,
      `I'd love to help with that! In the meantime, did you know: ${knowledge.facts[Math.floor(Math.random() * knowledge.facts.length)]}`
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  // Check if input matches any keywords
  matchesAny(input, keywords) {
    return keywords.some(kw => input.includes(kw));
  }

  // Add a bot message
  addBotMessage(text) {
    this.addMessage({ type: 'bot', text });
  }

  // Add a message to history
  addMessage(message) {
    message.timestamp = Date.now();
    this.messages.push(message);
    if (this.onMessage) this.onMessage(message);
  }

  // Get suggested questions for current monument
  getSuggestedQuestions() {
    return [
      { key: 'whoBuilt', text: t('whoBuilt') },
      { key: 'howOld', text: t('howOld') },
      { key: 'funFacts', text: t('funFacts') },
      { key: 'architecture', text: t('architecture') }
    ];
  }

  // Get all messages
  getMessages() {
    return this.messages;
  }

  // Clear chat
  clear() {
    this.messages = [];
    this.isTyping = false;
  }
}

// Singleton
const chatbot = new MonumentChatbot();
