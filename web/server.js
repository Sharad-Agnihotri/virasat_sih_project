// ============================================================
// server.js — Virasat Platform AI Proxy (Groq)
//
// The browser never sees the API key. Every page posts to this
// proxy, which attaches the key server-side and forwards to Groq.
//
// Run with:  node server.js
// Key:       required. Put GROQ_API_KEY in web/.env (copy .env.example)
//            or export it in the environment. Never commit a real key.
// ============================================================

const http = require('http');
const https = require('https');

const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3005;

/* Read a key out of a local .env file, if one exists. static_server.js
   refuses to serve .env, so this keeps the secret off the web entirely. */
function keyFromEnvFile() {
  try {
    const text = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    const match = text.match(/^\s*GROQ_API_KEY\s*=\s*["']?([^"'\r\n]+)["']?\s*$/m);
    return match ? match[1].trim() : null;
  } catch (e) {
    return null;
  }
}

// Resolution order: environment > .env file. There is deliberately no
// built-in fallback: a key committed to a repo is a key already leaked.
const ENV_FILE_KEY = keyFromEnvFile();
const API_KEY = process.env.GROQ_API_KEY || ENV_FILE_KEY || '';
const KEY_SOURCE = process.env.GROQ_API_KEY ? 'environment'
  : ENV_FILE_KEY ? '.env file' : 'missing';

if (!API_KEY) {
  console.error('\n✖ No Groq API key found.\n');
  console.error('  Get one free at https://console.groq.com/keys, then either:');
  console.error('    cp .env.example .env     # paste the key into web/.env');
  console.error('  or export it for this shell:');
  console.error('    export GROQ_API_KEY=gsk_your_key_here\n');
  process.exit(1);
}

const GROQ_HOST = 'api.groq.com';
const GROQ_PATH = '/openai/v1/chat/completions';
const GROQ_SPEECH_PATH = '/openai/v1/audio/speech';

// Neural voice for the Virasat Guide. Orpheus is emotive by design — it
// reads punctuation as feeling rather than flattening it, which the
// browser's built-in SAPI voices cannot do.
const TTS_MODEL = process.env.GROQ_TTS_MODEL || 'canopylabs/orpheus-v1-english';
const TTS_VOICE = process.env.GROQ_TTS_VOICE || 'leo';
const TTS_MAX_CHARS = 1200;
let neuralVoiceReady = null; // set by the startup probe; reported on /api/health

// Vision models for /api/identify (monument recognition from a photo).
// Tried in order — a 404 (not on this key) or 429 (rate-limited) moves to
// the next — and the last one that answered is tried first next time.
// qwen3.8-27b is the only image-capable model verified on this key; the
// llama-4 entry is there for keys that do have it.
const VISION_MODELS = (process.env.GROQ_VISION_MODELS ||
  'qwen/qwen3.8-27b,qwen/qwen3.6-27b,meta-llama/llama-4-scout-17b-16e-instruct')
  .split(',').map(m => m.trim()).filter(Boolean);
let visionModelIndex = 0;
const IDENTIFY_MAX_BODY = 8e6;   // downscaled JPEG as a data URL; ~300 KB in practice

// Models this account can actually serve (verified against /v1/models).
const DEFAULT_MODEL = 'openai/gpt-oss-120b';
const FALLBACK_MODEL = 'groq/compound';
const ALLOWED_MODELS = new Set([
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'groq/compound',
  'groq/compound-mini',
  'qwen/qwen3.6-27b',
  'qwen/qwen3.8-27b'
]);

// gpt-oss models think before answering. Left unchecked they spend the
// whole token budget on reasoning and return empty content, so cap the
// effort and hold a floor under max_tokens.
const REASONING_MODELS = /^openai\/gpt-oss/;
const MIN_MAX_TOKENS = 512;

function log(...args) {
  console.log(`[${new Date().toLocaleTimeString()}]`, ...args);
}

/* Some models leak their scratchpad into the content field. */
function stripThinking(text) {
  return String(text || '')
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<think>[\s\S]*$/i, '')
    .trim();
}

function normalisePayload(body) {
  const payload = Object.assign({}, body);

  // Any legacy or unknown model id (nemotron, meta/llama-*, ...) maps to
  // a model this key can serve, rather than failing upstream.
  const asked = payload.model;
  if (!asked || !ALLOWED_MODELS.has(asked)) {
    if (asked) log(`Model "${asked}" not available — using ${DEFAULT_MODEL}`);
    payload.model = DEFAULT_MODEL;
  }

  if (!Array.isArray(payload.messages) || payload.messages.length === 0) {
    return { error: 'Request must include a non-empty "messages" array.' };
  }

  if (REASONING_MODELS.test(payload.model) && !payload.reasoning_effort) {
    payload.reasoning_effort = 'low';
  }

  const wanted = Number(payload.max_tokens) || 0;
  payload.max_tokens = Math.max(wanted, MIN_MAX_TOKENS);

  if (typeof payload.temperature !== 'number') payload.temperature = 0.6;

  // The client must never dictate credentials or streaming here.
  delete payload.api_key;
  delete payload.stream;

  return { payload };
}

function callGroq(payload) {
  return new Promise((resolve) => {
    const data = JSON.stringify(payload);
    const req = https.request({
      hostname: GROQ_HOST,
      path: GROQ_PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        // The key is attached here and only here.
        'Authorization': `Bearer ${API_KEY}`
      },
      timeout: 30000
    }, (res) => {
      let raw = '';
      res.on('data', c => { raw += c; });
      res.on('end', () => {
        let parsed = null;
        try { parsed = JSON.parse(raw); } catch (e) { /* keep raw */ }
        resolve({ status: res.statusCode, body: parsed, raw });
      });
    });

    req.on('timeout', () => { req.destroy(new Error('Upstream timed out after 30s')); });
    req.on('error', err => resolve({ status: 0, error: err.message }));
    req.write(data);
    req.end();
  });
}

/* Ask Groq for spoken audio. Resolves with a Buffer on success, or an
   object describing why it could not speak. */
function callGroqSpeech(text, voice) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      model: TTS_MODEL,
      voice: voice || TTS_VOICE,
      input: text,
      response_format: 'wav'
    });

    const req = https.request({
      hostname: GROQ_HOST,
      path: GROQ_SPEECH_PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Authorization': `Bearer ${API_KEY}`
      },
      timeout: 45000
    }, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('error', err => resolve({ status: 0, message: err.message }));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        const type = res.headers['content-type'] || '';
        if (res.statusCode === 200 && type.startsWith('audio/')) {
          return resolve({ audio: buf, contentType: type });
        }
        let message = buf.toString('utf8').slice(0, 400);
        try { message = JSON.parse(message).error.message; } catch (e) { /* keep raw */ }
        resolve({ status: res.statusCode, message });
      });
    });

    req.on('timeout', () => { req.destroy(new Error('Speech request timed out')); });
    req.on('error', err => resolve({ status: 0, message: err.message }));
    req.write(data);
    req.end();
  });
}

process.on('uncaughtException', (err) => {
  console.error('[server] Uncaught exception (prevented crash):', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('[server] Unhandled rejection (prevented crash):', reason);
});

async function handleSpeech(res, rawBody) {
  let body;
  try { body = JSON.parse(rawBody || '{}'); }
  catch (e) { return sendJson(res, 400, { error: { message: 'Request body is not valid JSON.' } }); }

  const text = String(body.text || body.input || '').trim();
  if (!text) return sendJson(res, 400, { error: { message: 'Nothing to speak: "text" is empty.' } });

  const clipped = text.length > TTS_MAX_CHARS ? text.slice(0, TTS_MAX_CHARS) : text;
  log(`→ Groq speech (${TTS_MODEL}/${body.voice || TTS_VOICE}, ${clipped.length} chars)`);

  const result = await callGroqSpeech(clipped, body.voice);

  if (result.audio) {
    log(`✓ audio ${(result.audio.length / 1024).toFixed(0)} KB`);
    res.writeHead(200, {
      'Content-Type': result.contentType,
      'Content-Length': result.audio.length,
      'Cache-Control': 'no-store'
    });
    return res.end(result.audio);
  }

  // The common case is the model needing one-time terms acceptance. Say so
  // plainly — the page falls back to the browser voice on any failure.
  const needsTerms = /terms/i.test(result.message || '');
  log(`✖ speech unavailable (${result.status}): ${String(result.message).slice(0, 140)}`);
  return sendJson(res, result.status && result.status !== 0 ? result.status : 502, {
    error: {
      message: result.message || 'Speech synthesis failed.',
      code: needsTerms ? 'model_terms_required' : 'speech_unavailable',
      hint: needsTerms
        ? `Accept the model terms once at https://console.groq.com/playground?model=${encodeURIComponent(TTS_MODEL)} to enable the natural voice.`
        : undefined
    }
  });
}

/* ── Monument identification ──
   The page sends a downscaled photo as a data URL. A vision model returns
   strict JSON naming the monument (or saying it cannot tell), which the
   page combines with its own knowledge base. */
const IDENTIFY_PROMPT = `You are an expert on Indian heritage architecture and world monuments.
Look at the photo and identify the specific monument, temple, fort, palace, mosque, tomb, church, stupa or landmark shown.

Respond with ONLY a JSON object, no prose, in exactly this shape:
{
  "identified": true or false,
  "monument": "official commonly used name, e.g. Qutub Minar",
  "city": "city or town",
  "state": "state / province",
  "country": "country",
  "confidence": 0-100 integer,
  "built_by": "who commissioned/built it and when, e.g. Mughal Emperor Shah Jahan (1632-1653)",
  "era": "century or dynasty",
  "summary": "2-3 factual sentences on its history and architecture",
  "alternatives": ["up to 2 other monuments it could be, if unsure"]
}

Rules:
- Be precise: Charminar is not Qutub Minar; Agra Fort is not Red Fort; Amer Fort is not Mehrangarh.
- If the image is not a monument or landmark, or you genuinely cannot tell which one it is, set "identified": false, "confidence" below 40 and describe what you see in "summary".
- Never invent a name to fill the field. Confidence must honestly reflect how sure you are.`;

function parseJsonLoose(text) {
  const clean = stripThinking(text).replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  try { return JSON.parse(clean); } catch (e) { /* fall through */ }
  const m = clean.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch (e) { /* give up */ } }
  return null;
}

async function handleIdentify(res, rawBody) {
  let body;
  try { body = JSON.parse(rawBody || '{}'); }
  catch (e) { return sendJson(res, 400, { error: { message: 'Request body is not valid JSON.' } }); }

  const image = String(body.image || '');
  if (!/^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(image)) {
    return sendJson(res, 400, { error: { message: '"image" must be a base64 data URL (jpeg/png/webp).' } });
  }

  const hint = body.hint ? String(body.hint).slice(0, 120) : '';
  const userText = hint
    ? `Identify the monument in this photo. The uploader's file was named "${hint}" — treat that only as a weak hint and trust what you actually see.`
    : 'Identify the monument in this photo.';

  const started = Date.now();
  let lastErr = 'no vision model available';

  for (let attempt = 0; attempt < VISION_MODELS.length; attempt++) {
    const idx = (visionModelIndex + attempt) % VISION_MODELS.length;
    const model = VISION_MODELS[idx];
    log(`→ Groq vision (${model}, ${(image.length / 1024).toFixed(0)} KB)`);

    const request = {
      model,
      temperature: 0.1,
      max_tokens: 600,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: IDENTIFY_PROMPT },
        { role: 'user', content: [
          { type: 'text', text: userText },
          { type: 'image_url', image_url: { url: image } }
        ] }
      ]
    };
    let result = await callGroq(request);

    // Some models reject strict JSON mode but still answer in JSON when
    // simply asked to; parseJsonLoose() copes with fences and stray prose.
    if (result.status === 400 && /json/i.test(String(result.body && result.body.error && result.body.error.message))) {
      log(`⚠ ${model} refused json_object mode — retrying as plain text`);
      delete request.response_format;
      result = await callGroq(request);
    }

    if (result.status === 200) {
      const choice = result.body && result.body.choices && result.body.choices[0];
      const parsed = parseJsonLoose(choice && choice.message && choice.message.content);
      if (parsed && typeof parsed === 'object') {
        visionModelIndex = idx;
        const confidence = Math.max(0, Math.min(100, Math.round(Number(parsed.confidence) || 0)));
        const out = {
          identified: Boolean(parsed.identified) && confidence >= 40 && Boolean(parsed.monument),
          monument: String(parsed.monument || '').trim(),
          city: String(parsed.city || '').trim(),
          state: String(parsed.state || '').trim(),
          country: String(parsed.country || '').trim(),
          confidence,
          builtBy: String(parsed.built_by || '').trim(),
          era: String(parsed.era || '').trim(),
          summary: String(parsed.summary || '').trim(),
          alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives.slice(0, 3).map(String) : [],
          model,
          ms: Date.now() - started
        };
        log(`✓ vision: ${out.identified ? out.monument : 'not identified'} (${confidence}%) in ${out.ms} ms`);
        return sendJson(res, 200, out);
      }
      lastErr = `${model} returned no parseable JSON`;
      log(`⚠ ${lastErr}: ${String(choice && choice.message && choice.message.content).slice(0, 300)}`);
      continue;
    }

    const msg = (result.body && result.body.error && result.body.error.message) || result.error || result.raw || 'unknown error';
    lastErr = `${model}: ${String(msg).slice(0, 320)}`;
    log(`✖ vision ${result.status}: ${lastErr}`);
    // A model this key cannot serve → try the next one; a network error → stop.
    if (result.status === 0) break;
  }

  return sendJson(res, 502, { error: { message: `Vision identification failed — ${lastErr}` } });
}

function sendJson(res, status, obj) {
  const out = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(out)
  });
  res.end(out);
}

async function handleChat(res, rawBody) {
  let body;
  try {
    body = JSON.parse(rawBody || '{}');
  } catch (e) {
    return sendJson(res, 400, { error: { message: 'Request body is not valid JSON.' } });
  }

  const { payload, error } = normalisePayload(body);
  if (error) return sendJson(res, 400, { error: { message: error } });

  log(`→ Groq (${payload.model}, max_tokens=${payload.max_tokens})`);
  let result = await callGroq(payload);

  if (result.status === 0) {
    log('✖ Network error:', result.error);
    return sendJson(res, 502, { error: { message: `Could not reach Groq: ${result.error}` } });
  }

  if (result.status !== 200) {
    const msg = (result.body && result.body.error && result.body.error.message) || result.raw || 'Unknown upstream error';
    log(`✖ Groq ${result.status}: ${String(msg).slice(0, 200)}`);
    return sendJson(res, result.status, { error: { message: msg, status: result.status } });
  }

  // Clean the answer and make sure something actually came back.
  let choice = result.body && result.body.choices && result.body.choices[0];
  let content = stripThinking(choice && choice.message && choice.message.content);

  if (!content) {
    log(`⚠ Empty content from ${payload.model} — retrying on ${FALLBACK_MODEL}`);
    const retry = Object.assign({}, payload, { model: FALLBACK_MODEL, max_tokens: 1024 });
    delete retry.reasoning_effort;
    const second = await callGroq(retry);
    if (second.status === 200) {
      const c2 = second.body && second.body.choices && second.body.choices[0];
      const t2 = stripThinking(c2 && c2.message && c2.message.content);
      if (t2) {
        result = second;
        choice = c2;
        content = t2;
      }
    }
  }

  if (!content) {
    log('✖ Model returned no usable content');
    return sendJson(res, 502, { error: { message: 'The model returned an empty response.' } });
  }

  choice.message.content = content;
  delete choice.message.reasoning;

  log(`✓ ${result.body.usage ? result.body.usage.total_tokens + ' tokens' : 'ok'}`);
  return sendJson(res, 200, result.body);
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const path = (req.url || '/').split('?')[0];

  // Which model ids this key can serve — handy when a model 404s upstream.
  if (req.method === 'GET' && path === '/api/models') {
    const upstream = https.request({
      hostname: GROQ_HOST, path: '/openai/v1/models', method: 'GET',
      headers: { 'Authorization': `Bearer ${API_KEY}` }, timeout: 20000
    }, (up) => {
      let raw = '';
      up.on('data', c => { raw += c; });
      up.on('end', () => {
        let ids = [];
        try { ids = (JSON.parse(raw).data || []).map(m => m.id).sort(); } catch (e) { /* raw below */ }
        sendJson(res, up.statusCode === 200 ? 200 : 502, ids.length ? { models: ids } : { error: { message: raw.slice(0, 300) } });
      });
    });
    upstream.on('timeout', () => upstream.destroy(new Error('timeout')));
    upstream.on('error', err => sendJson(res, 502, { error: { message: err.message } }));
    return upstream.end();
  }

  if (req.method === 'GET' && path === '/api/health') {
    return sendJson(res, 200, {
      status: 'ok',
      provider: 'groq',
      model: DEFAULT_MODEL,
      keyConfigured: Boolean(API_KEY),
      keySource: KEY_SOURCE,
      voice: neuralVoiceReady
    });
  }

  if (req.method === 'POST' && (path === '/api/chat' || path === '/api/translate' || path === '/api/speech' || path === '/api/identify' || path === '/')) {
    const handler = path === '/api/speech' ? handleSpeech
      : path === '/api/identify' ? handleIdentify
      : handleChat;
    const maxBody = path === '/api/identify' ? IDENTIFY_MAX_BODY : 1e6;
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > maxBody) { req.destroy(); }   // refuse absurd bodies
    });
    req.on('end', () => {
      handler(res, raw).catch(err => {
        log('✖ Handler crash:', err.message);
        sendJson(res, 500, { error: { message: err.message } });
      });
    });
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<h1>Virasat AI Proxy</h1>
    <p>Status: active &mdash; provider <b>Groq</b>, model <b>${DEFAULT_MODEL}</b></p>
    <p>POST <code>/api/chat</code> &middot; POST <code>/api/translate</code> &middot; POST <code>/api/identify</code> &middot; GET <code>/api/health</code></p>`);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('\n============================================================');
  console.log('⚡ Virasat AI Proxy (Groq) is ACTIVE');
  console.log(`📍 Chat:      http://localhost:${PORT}/api/chat`);
  console.log(`📍 Translate: http://localhost:${PORT}/api/translate`);
  console.log(`📍 Identify:  http://localhost:${PORT}/api/identify`);
  console.log(`📍 Health:    http://localhost:${PORT}/api/health`);
  console.log(`👁  Vision:    ${VISION_MODELS.join(', ')}`);
  console.log(`🧠 Model:     ${DEFAULT_MODEL}`);
  console.log(`🔑 Key:       ${KEY_SOURCE}`);
  console.log('============================================================\n');

  // One short request tells us whether the neural voice can be used at all.
  // The usual blocker is a one-time terms acceptance on the Groq console —
  // until then every guide falls back to the browser's built-in voice.
  callGroqSpeech('Namaste.').then((r) => {
    neuralVoiceReady = Boolean(r.audio);
    if (r.audio) return console.log(`🔈 Voice:     ${TTS_MODEL} ready\n`);
    const needsTerms = /terms/i.test(r.message || '');
    console.warn(`🔇 Voice:     neural voice unavailable (${r.status || 'network'}) — guides will use the browser voice.`);
    if (needsTerms) {
      console.warn(`              One-time fix: open https://console.groq.com/playground?model=${encodeURIComponent(TTS_MODEL)}`);
      console.warn('              with the account that owns this API key, accept the model terms, then restart this server.\n');
    } else {
      console.warn(`              ${String(r.message || '').slice(0, 160)}\n`);
    }
  });
});

// Fail loudly. Silently sliding to another port is what left the pages
// hunting across 3001/3005/3006 for a server that had moved.
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n✖ Port ${PORT} is already in use.`);
    console.error('  Stop the process using it, or start this one with a different port:');
    console.error('      PORT=3007 node server.js\n');
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
