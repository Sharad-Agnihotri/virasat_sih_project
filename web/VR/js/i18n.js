// ============================================================
// i18n.js — Multi-Language Support
// Languages: English, Hindi, Spanish, French, Japanese
// ============================================================

const TRANSLATIONS = {
  en: {
    // Top Bar
    appTitle: 'Monument Explorer',
    appSubtitle: 'Virtual Heritage Tours',
    
    // Controls
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
    audioOn: 'Sound On',
    audioOff: 'Sound Off',
    language: 'Language',
    menu: 'Menu',
    
    // Monument Selector
    selectMonument: 'Choose a Monument',
    exploreNow: 'Explore',
    builtIn: 'Built in',
    location: 'Location',
    
    // Navigation
    navigate: 'Navigate',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    resetView: 'Reset View',
    
    // Hotspots
    clickToExplore: 'Click to explore',
    clickForInfo: 'Click for info',
    
    // Info Panel
    infoTitle: 'Information',
    close: 'Close',
    architect: 'Architect',
    yearBuilt: 'Year Built',
    category: 'Category',
    
    // Chatbot
    chatTitle: 'AI Monument Guide',
    chatPlaceholder: 'Ask me anything about this monument...',
    chatSend: 'Send',
    chatThinking: 'Thinking...',
    chatWelcome: 'Hello! I\'m your AI guide. Ask me anything about the monument you\'re exploring!',
    suggestedQuestions: 'Suggested Questions',
    whoBuilt: 'Who built this?',
    howOld: 'How old is it?',
    funFacts: 'Tell me a fun fact',
    architecture: 'Tell me about the architecture',
    
    // Time Travel
    timeTravel: 'Time Travel',
    presentDay: 'Present Day',
    historical: 'Historical',
    timeTravelDesc: 'See how this monument looked in the past',
    
    // Loading
    loading: 'Loading Experience...',
    loadingTip: 'Drag to look around • Click hotspots to explore',
    enterExperience: 'Enter Experience',
    
    // Recommendations
    recommendations: 'You May Also Like',
    similarMonuments: 'Similar Monuments',
    
    // Viewpoints
    viewpoints: 'Viewpoints',
    currentView: 'Current View',
    
    // Misc
    madeWith: 'Made with ❤️ for virtual heritage exploration',
    vrMode: 'Enter VR',
    minimap: 'Map',
    help: 'Help',
    helpText: 'Drag to look around. Click glowing hotspots to navigate. Use the monument selector at the bottom to switch locations.',
    voiceGuideTitle: 'Voice Guide',
    voiceGuideOn: 'Voice Guide on — tap to stop',
    
    // Monument-specific viewpoint names (fallback to English)
    'main-gate': 'Main Gateway',
    'garden-path': 'Charbagh Gardens',
    'main-platform': 'Main Mausoleum',
    'yamuna-view': 'Yamuna Riverside',
    'arena-floor': 'Arena Floor',
    'underground': 'Hypogeum',
    'upper-tiers': 'Upper Seating',
    'citadel-overview': 'Citadel Overview',
    'temple-sun': 'Temple of the Sun',
    'agricultural': 'Agricultural Terraces',
    'watchtower': 'Watchtower View',
    'wall-path': 'Along the Wall',
    'mountain-view': 'Mountain Vista',
    'trocadero': 'Trocadéro View',
    'tower-base': 'Tower Base',
    'upper-platform': 'Summit View'
  },

  hi: {
    appTitle: 'स्मारक एक्सप्लोरर',
    appSubtitle: 'आभासी विरासत यात्रा',
    fullscreen: 'पूर्ण स्क्रीन',
    exitFullscreen: 'पूर्ण स्क्रीन से बाहर',
    audioOn: 'ध्वनि चालू',
    audioOff: 'ध्वनि बंद',
    language: 'भाषा',
    menu: 'मेनू',
    selectMonument: 'एक स्मारक चुनें',
    exploreNow: 'अन्वेषण करें',
    builtIn: 'निर्मित',
    location: 'स्थान',
    navigate: 'नेविगेट',
    zoomIn: 'ज़ूम इन',
    zoomOut: 'ज़ूम आउट',
    resetView: 'दृश्य रीसेट',
    clickToExplore: 'अन्वेषण के लिए क्लिक करें',
    clickForInfo: 'जानकारी के लिए क्लिक करें',
    infoTitle: 'जानकारी',
    close: 'बंद करें',
    architect: 'वास्तुकार',
    yearBuilt: 'निर्माण वर्ष',
    category: 'श्रेणी',
    chatTitle: 'AI स्मारक गाइड',
    chatPlaceholder: 'इस स्मारक के बारे में कुछ भी पूछें...',
    chatSend: 'भेजें',
    chatThinking: 'सोच रहा हूँ...',
    chatWelcome: 'नमस्ते! मैं आपका AI गाइड हूँ। इस स्मारक के बारे में कुछ भी पूछें!',
    suggestedQuestions: 'सुझाए गए प्रश्न',
    whoBuilt: 'इसे किसने बनाया?',
    howOld: 'यह कितना पुराना है?',
    funFacts: 'कोई रोचक तथ्य बताएं',
    architecture: 'वास्तुकला के बारे में बताएं',
    timeTravel: 'समय यात्रा',
    presentDay: 'वर्तमान',
    historical: 'ऐतिहासिक',
    timeTravelDesc: 'देखें कि अतीत में यह स्मारक कैसा दिखता था',
    loading: 'अनुभव लोड हो रहा है...',
    loadingTip: 'देखने के लिए खींचें • अन्वेषण के लिए हॉटस्पॉट पर क्लिक करें',
    enterExperience: 'अनुभव शुरू करें',
    recommendations: 'आपको यह भी पसंद आ सकता है',
    similarMonuments: 'समान स्मारक',
    viewpoints: 'दृश्य बिंदु',
    currentView: 'वर्तमान दृश्य',
    madeWith: 'आभासी विरासत अन्वेषण के लिए ❤️ से बनाया गया',
    vrMode: 'VR में प्रवेश',
    minimap: 'नक्शा',
    help: 'सहायता',
    helpText: 'चारों ओर देखने के लिए खींचें। नेविगेट करने के लिए चमकते हॉटस्पॉट पर क्लिक करें।',
    voiceGuideTitle: 'वॉयस गाइड',
    voiceGuideOn: 'वॉयस गाइड चालू — रोकने के लिए टैप करें'
  },

  es: {
    appTitle: 'Explorador de Monumentos',
    appSubtitle: 'Tours Virtuales de Patrimonio',
    fullscreen: 'Pantalla Completa',
    exitFullscreen: 'Salir de Pantalla Completa',
    audioOn: 'Sonido Activado',
    audioOff: 'Sonido Desactivado',
    language: 'Idioma',
    menu: 'Menú',
    selectMonument: 'Elige un Monumento',
    exploreNow: 'Explorar',
    builtIn: 'Construido en',
    location: 'Ubicación',
    navigate: 'Navegar',
    zoomIn: 'Acercar',
    zoomOut: 'Alejar',
    resetView: 'Restablecer Vista',
    clickToExplore: 'Clic para explorar',
    clickForInfo: 'Clic para información',
    infoTitle: 'Información',
    close: 'Cerrar',
    architect: 'Arquitecto',
    yearBuilt: 'Año de Construcción',
    category: 'Categoría',
    chatTitle: 'Guía AI de Monumentos',
    chatPlaceholder: 'Pregúntame sobre este monumento...',
    chatSend: 'Enviar',
    chatThinking: 'Pensando...',
    chatWelcome: '¡Hola! Soy tu guía de IA. ¡Pregúntame lo que quieras sobre el monumento que estás explorando!',
    suggestedQuestions: 'Preguntas Sugeridas',
    whoBuilt: '¿Quién lo construyó?',
    howOld: '¿Qué antigüedad tiene?',
    funFacts: 'Cuéntame un dato curioso',
    architecture: 'Háblame de la arquitectura',
    timeTravel: 'Viaje en el Tiempo',
    presentDay: 'Presente',
    historical: 'Histórico',
    timeTravelDesc: 'Mira cómo se veía este monumento en el pasado',
    loading: 'Cargando Experiencia...',
    loadingTip: 'Arrastra para mirar • Haz clic en los puntos para explorar',
    enterExperience: 'Entrar a la Experiencia',
    recommendations: 'También te puede gustar',
    similarMonuments: 'Monumentos Similares',
    viewpoints: 'Puntos de Vista',
    currentView: 'Vista Actual',
    madeWith: 'Hecho con ❤️ para la exploración virtual del patrimonio',
    vrMode: 'Entrar en VR',
    minimap: 'Mapa',
    help: 'Ayuda',
    helpText: 'Arrastra para mirar alrededor. Haz clic en los puntos brillantes para navegar.'
  },

  fr: {
    appTitle: 'Explorateur de Monuments',
    appSubtitle: 'Visites Virtuelles du Patrimoine',
    fullscreen: 'Plein Écran',
    exitFullscreen: 'Quitter le Plein Écran',
    audioOn: 'Son Activé',
    audioOff: 'Son Désactivé',
    language: 'Langue',
    menu: 'Menu',
    selectMonument: 'Choisir un Monument',
    exploreNow: 'Explorer',
    builtIn: 'Construit en',
    location: 'Emplacement',
    navigate: 'Naviguer',
    zoomIn: 'Zoomer',
    zoomOut: 'Dézoomer',
    resetView: 'Réinitialiser la Vue',
    clickToExplore: 'Cliquez pour explorer',
    clickForInfo: 'Cliquez pour info',
    infoTitle: 'Information',
    close: 'Fermer',
    architect: 'Architecte',
    yearBuilt: 'Année de Construction',
    category: 'Catégorie',
    chatTitle: 'Guide IA des Monuments',
    chatPlaceholder: 'Posez-moi une question sur ce monument...',
    chatSend: 'Envoyer',
    chatThinking: 'Réflexion...',
    chatWelcome: 'Bonjour ! Je suis votre guide IA. Posez-moi n\'importe quelle question sur le monument que vous explorez !',
    suggestedQuestions: 'Questions Suggérées',
    whoBuilt: 'Qui l\'a construit ?',
    howOld: 'Quel âge a-t-il ?',
    funFacts: 'Un fait amusant',
    architecture: 'Parlez-moi de l\'architecture',
    timeTravel: 'Voyage dans le Temps',
    presentDay: 'Aujourd\'hui',
    historical: 'Historique',
    timeTravelDesc: 'Voyez à quoi ressemblait ce monument dans le passé',
    loading: 'Chargement de l\'Expérience...',
    loadingTip: 'Faites glisser pour regarder • Cliquez sur les points pour explorer',
    enterExperience: 'Entrer dans l\'Expérience',
    recommendations: 'Vous aimerez aussi',
    similarMonuments: 'Monuments Similaires',
    viewpoints: 'Points de Vue',
    currentView: 'Vue Actuelle',
    madeWith: 'Fait avec ❤️ pour l\'exploration virtuelle du patrimoine',
    vrMode: 'Entrer en VR',
    minimap: 'Carte',
    help: 'Aide',
    helpText: 'Faites glisser pour regarder autour. Cliquez sur les points lumineux pour naviguer.'
  },

  ja: {
    appTitle: 'モニュメントエクスプローラー',
    appSubtitle: 'バーチャル遺産ツアー',
    fullscreen: 'フルスクリーン',
    exitFullscreen: 'フルスクリーン終了',
    audioOn: 'サウンドオン',
    audioOff: 'サウンドオフ',
    language: '言語',
    menu: 'メニュー',
    selectMonument: 'モニュメントを選択',
    exploreNow: '探索する',
    builtIn: '建設年',
    location: '場所',
    navigate: 'ナビゲート',
    zoomIn: 'ズームイン',
    zoomOut: 'ズームアウト',
    resetView: 'ビューリセット',
    clickToExplore: 'クリックして探索',
    clickForInfo: 'クリックして情報',
    infoTitle: '情報',
    close: '閉じる',
    architect: '建築家',
    yearBuilt: '建設年',
    category: 'カテゴリー',
    chatTitle: 'AIモニュメントガイド',
    chatPlaceholder: 'このモニュメントについて何でも聞いてください...',
    chatSend: '送信',
    chatThinking: '考え中...',
    chatWelcome: 'こんにちは！AIガイドです。探索中のモニュメントについて何でもお聞きください！',
    suggestedQuestions: 'おすすめの質問',
    whoBuilt: '誰が建てましたか？',
    howOld: 'どのくらい古いですか？',
    funFacts: '面白い事実を教えて',
    architecture: '建築について教えて',
    timeTravel: 'タイムトラベル',
    presentDay: '現在',
    historical: '歴史的',
    timeTravelDesc: '過去のモニュメントの姿を見る',
    loading: '体験をロード中...',
    loadingTip: 'ドラッグして見回す • ホットスポットをクリックして探索',
    enterExperience: '体験を開始',
    recommendations: 'おすすめ',
    similarMonuments: '類似のモニュメント',
    viewpoints: 'ビューポイント',
    currentView: '現在のビュー',
    madeWith: 'バーチャル遺産探索のために❤️で作られました',
    vrMode: 'VRモード',
    minimap: 'マップ',
    help: 'ヘルプ',
    helpText: 'ドラッグして見回します。光るホットスポットをクリックしてナビゲートします。'
  }
};

// Current language
let currentLanguage = 'en';

// Get translated string
function t(key) {
  const lang = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
  return lang[key] || TRANSLATIONS['en'][key] || key;
}

// Set language
function setLanguage(langCode) {
  if (TRANSLATIONS[langCode]) {
    currentLanguage = langCode;
    updateAllTranslations();
    return true;
  }
  return false;
}

// Get current language
function getCurrentLanguage() {
  return currentLanguage;
}

// Get available languages
function getAvailableLanguages() {
  return [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' }
  ];
}

// Update all DOM elements with data-i18n attribute
function updateAllTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = t(key);
    } else {
      el.textContent = t(key);
    }
  });
  
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    el.title = t(key);
  });

  // Dispatch event for other modules to react
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: currentLanguage } }));
}
