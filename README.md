# Virasat

**Heritage, Live** — a cultural heritage platform for India. Explore 17 cities
as illustrated seven-chapter volumes, identify any monument from a photograph,
walk through 360° panoramas that dissolve into period photographs, talk to a
cultural guide in 11 Indian languages, buy directly from GI-tagged master
artisans, and report damage to heritage sites with on-site GPS verification.

Built for Smart India Hackathon.

---

## Repository layout

```
.
├── web/                     The platform — 12 pages, vanilla HTML/CSS/JS
│   ├── index.html           Scroll-driven landing (155-frame Mysore fly-through)
│   ├── explore.html         City volumes + live GPS distance to monuments
│   ├── scan.html            AI monument identification (upload or live camera)
│   ├── vr.html              360° VR explorer + Chronos Lens + gaze narrator
│   ├── marketplace.html     Artisan marketplace with craft origin stories
│   ├── artisan.html         Seller portal for master craftsmen
│   ├── community.html       Cultural social feed
│   ├── events.html          Festivals & craft melas, with calendar export
│   ├── language.html        12 source → 18 Indian target languages
│   ├── report.html          Heritage damage reports, GPS-verified
│   ├── profile.html         Badges, saved crafts, membership
│   ├── login.html           Tourist / Artisan Seller sign-up
│   ├── server.js            Groq AI proxy — chat, vision, translate, speech
│   ├── static_server.js     Static host; auto-starts the proxy
│   ├── VR/                  A-Frame scene, shaders, gaze narrator, i18n
│   ├── assets/              css · js · images · 155 hero frames
│   └── tools/               make_past_panoramas.py
│
├── mobile/                  Flutter app (Android / iOS)
│   ├── lib/screens/         Home, Explore, Scan ported natively
│   ├── lib/data/            17-city dataset, 11-language tour scripts
│   ├── lib/speech_polyfill.dart   Web Speech API shim for Android WebView
│   └── lib/native_bridge.dart     TTS / STT / camera bridge
│
└── archive/react-prototype/ Superseded React + Vite prototype
```

---

## Quick start

### Web platform

```bash
cd web
cp .env.example .env          # then paste your Groq key into .env
npm start                     # http://localhost:8081
```

`static_server.js` serves the site on **:8081** and automatically forks the AI
proxy on **:3005** unless `NO_AI=1` is set. A free Groq key from
[console.groq.com/keys](https://console.groq.com/keys) enables the AI features;
without one the proxy exits with instructions, and the pages fall back to
canned replies.

Check the proxy: `npm run health`

### Mobile app

```bash
cd mobile
flutter pub get
flutter run --dart-define=VIRASAT_URL=http://<your-lan-ip>:8081
```

The app hosts the web platform for pages not yet ported, so it needs to reach
a running `static_server.js`. The server address is also editable at runtime
from **More → Server address**.

---

## Features

| | |
|---|---|
| **Explore City** | 17 cities authored as seven-chapter heritage volumes — history, places, crafts, festivals, food, language, artisans — with live GPS bearing, distance and walking time to the nearest monument. |
| **Scan Monument** | Upload or live-camera capture → a vision model returns monument, city, era, who built it and a confidence score. Falls over across three models; anything under 40% confidence is reported as unidentified rather than guessed. |
| **VR Explorer** | A-Frame 360° panoramas of 5 monuments with multi-viewpoint navigation and fact-carrying hotspots. **Chronos Lens** dissolves the present into an aged period photograph via a custom GLSL shader. **Gaze Narrator** maps where you are looking back into panorama image space and narrates whatever section your gaze settles on, in English or Hindi. |
| **Virasat Mitr AI** | A cultural companion on six pages, persona-tuned per page, plus a **Budget Planner** that splits a rupee budget across stay, crafts, dining and transit for any of 44 heritage destinations — one flagship per state and major UT, each with a relative cost index. |
| **Marketplace & Artisan Portal** | Buy direct from verified master artisans. Every product carries its ancestral technique, workshop, GI region and crafting process. Artisan listings sync live to the public catalogue. |
| **Language Studio** | 12 source languages → 18 Indian targets, Sanskrit and Bhojpuri included. Type or speak; get translation plus pronunciation. |
| **Community** | A cultural feed with polls, travel alerts, entity-linked posts and elder-consent moderation norms. |
| **Report a Site** | Nine damage categories with severity and photo evidence, gated by a live GPS audit that blocks remote "certificate farming" reports. |

---

## Architecture notes

- **The browser never sees the API key.** Every AI call posts to `server.js`,
  which attaches the key server-side. There is no built-in key fallback.
- **Model resilience.** Unknown model ids remap to a served model rather than
  failing upstream; reasoning models get `reasoning_effort` capped and a
  `max_tokens` floor, because otherwise they spend the whole budget thinking
  and return empty content; empty responses retry on a fallback model.
- **Vision failover.** Three models tried in order — a 404 or 429 rolls to the
  next, and whichever answered last is tried first next time.
- **Graceful degradation throughout.** No neural voice → browser voice. No
  vision model → next model. No proxy → canned replies. No translation →
  English. The tour always plays.
- **Android WebView has no Web Speech API**, which would leave the guide, the
  VR narrator and the language studio silent inside the app. `speech_polyfill.dart`
  reinstalls `speechSynthesis` and `SpeechRecognition` with the surface the
  pages already use and forwards over a JS channel to `flutter_tts` and
  `speech_to_text`.
- **Mobile is a retrofit, not a rewrite.** `assets/css/mobile.css` loads last on
  every page and is scoped entirely to ≤768px.

---

## Tech stack

**Web** — vanilla HTML/CSS/JS, A-Frame 1.6 with custom GLSL, Node (no runtime
dependencies; `http`/`https`/`fs`/`zlib` only)
**Mobile** — Flutter 3.5+, `webview_flutter`, `flutter_tts`, `speech_to_text`,
`image_picker`, `permission_handler`, `shared_preferences`
**AI** — Groq: `openai/gpt-oss-120b` (chat), `qwen3.8-27b` (vision),
`canopylabs/orpheus-v1-english` (speech)

---

## Status & known gaps

This is a hackathon build, honestly labelled:

- All state is `localStorage`, namespaced `virasat_*` per account email. There
  is no database and no real authentication.
- The Royal Pass payment flow (₹899/yr · ₹149/mo) is simulated — no gateway.
- `web/VR/index.html` is a legacy standalone shell that requests panorama files
  that were never in its own asset folder. The working VR entry is `web/vr.html`.
- Heritage-official routing for damage reports is not wired to a real endpoint.

## License

MIT
