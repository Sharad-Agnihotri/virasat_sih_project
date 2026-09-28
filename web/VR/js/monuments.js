// ============================================================
// monuments.js — Monument Data Layer (India Focus)
// Complete data for 5 Indian monuments with viewpoints,
// hotspots, chatbot knowledge, and time-travel info.
// ============================================================

const MONUMENTS_DATA = {
  'taj-mahal': {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    emoji: '🕌',
    location: 'Agra, Uttar Pradesh',
    year: '1632–1653',
    description: 'An ivory-white marble mausoleum on the right bank of the river Yamuna. Commissioned by Mughal emperor Shah Jahan to house the tomb of his favourite wife, Mumtaz Mahal.',
    shortDesc: 'Crown of the Palace',
    architect: 'Ustad Ahmad Lahauri',
    category: 'Mausoleum',
    coordinates: { lat: 27.1751, lng: 78.0421 },
    panoramaBase: 'assets/images/taj_mahal_panorama.webp',
    cardGradient: 'linear-gradient(135deg, #f5e6d3, #d4a574)',
    viewpoints: [
      {
        id: 'main-gate',
        name: 'Main Gateway',
        panorama: 'assets/images/taj_mahal_panorama.webp',
        rotation: '0 -90 0',
        description: 'The Great Gate (Darwaza-i-Rauza) — the main entrance to the Taj Mahal complex.',
        hotspots: [
          { id: 'hs-garden', type: 'navigation', target: 'garden-path', position: '-3 0 -8', label: 'Garden Path', icon: '→' },
          { id: 'hs-gate-info', type: 'info', position: '5 2 -6', label: 'Gate Architecture', icon: 'ℹ', info: 'The Great Gate is 30 meters tall, built in red sandstone with white marble decorations.' }
        ]
      },
      {
        id: 'garden-path',
        name: 'Charbagh Gardens',
        panorama: 'assets/images/taj_mahal_panorama.webp',
        rotation: '0 -130 0',
        description: 'The Mughal Charbagh (four-part) garden divided by walkways and water channels.',
        hotspots: [
          { id: 'hs-platform', type: 'navigation', target: 'main-platform', position: '0 0 -10', label: 'Main Platform', icon: '→' },
          { id: 'hs-back', type: 'navigation', target: 'main-gate', position: '0 0 8', label: 'Back to Gate', icon: '←' }
        ]
      },
      {
        id: 'main-platform',
        name: 'Main Mausoleum',
        panorama: 'assets/images/taj_mahal_panorama.webp',
        rotation: '0 -180 0',
        description: 'The white marble mausoleum stands on a square plinth with a large dome and four minarets.',
        hotspots: [
          { id: 'hs-dome-info', type: 'info', position: '0 4 -8', label: 'The Dome', icon: 'ℹ', info: 'The onion-shaped marble dome is 35 meters high. It is topped by a gilded finial.' },
          { id: 'hs-garden-back', type: 'navigation', target: 'garden-path', position: '0 0 8', label: 'Back to Gardens', icon: '←' }
        ]
      }
    ],
    chatbotKnowledge: {
      greeting: "Namaste! 🙏 I'm your virtual guide to the Taj Mahal. What would you like to know?",
      facts: [
        "The Taj Mahal was built over 21 years by over 20,000 artisans.",
        "It cost approximately 32 million rupees in the 1600s.",
        "The Taj Mahal changes color throughout the day — pinkish in the morning, white during the day, and golden at night.",
        "The four minarets are intentionally tilted outward as an earthquake safety measure."
      ],
      qa: [
        { q: ['who built', 'architect', 'designer', 'created'], a: "The Taj Mahal was commissioned by Mughal Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal. The chief architect is believed to be Ustad Ahmad Lahauri." },
        { q: ['how old', 'when built', 'year', 'age'], a: "Construction began in 1632 and the mausoleum was largely complete by 1643. The entire complex was finished around 1653." },
        { q: ['material', 'marble', 'stone', 'made of'], a: "It is primarily built of translucent white Makrana marble from Rajasthan, with inlays of 28 types of precious stones." }
      ]
    },
    historicalInfo: {
      era: '17th Century Mughal Empire',
      pastDescription: 'In its original glory during the 1650s, the Taj Mahal complex featured elaborate gardens with exotic plants, and gold finials atop the dome and minarets.',
      changes: 'The British removed many precious stones and the gold railing during colonial rule. Modern pollution has required ongoing marble restoration.'
    },
    recommendations: ['red-fort', 'mysore-palace']
  },

  'hampi': {
    id: 'hampi',
    name: 'Hampi (Vijayanagara)',
    emoji: '🛕',
    location: 'Hampi, Karnataka',
    year: '14th Century',
    description: 'The spectacular ruins of Vijayanagara, the former capital of the Vijayanagara Empire. Known for its mesmerizing boulder-strewn landscape and ornate Dravidian temples.',
    shortDesc: 'City of Victory',
    architect: 'Vijayanagara Empire',
    category: 'Temple Complex / Ruins',
    coordinates: { lat: 15.3350, lng: 76.4600 },
    panoramaBase: 'assets/images/hampi_panorama.webp',
    cardGradient: 'linear-gradient(135deg, #c49a6c, #8c5b35)',
    viewpoints: [
      {
        id: 'stone-chariot',
        name: 'The Stone Chariot',
        panorama: 'assets/images/hampi_panorama.webp',
        rotation: '0 -90 0',
        description: 'The iconic Stone Chariot in the Vittala Temple complex, a shrine dedicated to Garuda built in the form of a temple chariot.',
        hotspots: [
          { id: 'hs-chariot-info', type: 'info', position: '0 2 -6', label: 'Stone Chariot', icon: 'ℹ', info: 'Though it looks monolithic, it is built with many giant granite blocks seamlessly jointed. The wheels once actually rotated!' },
          { id: 'hs-pillars', type: 'navigation', target: 'musical-pillars', position: '5 0 -4', label: 'Musical Pillars', icon: '→' }
        ]
      },
      {
        id: 'musical-pillars',
        name: 'Maha Mandapa',
        panorama: 'assets/images/hampi_panorama.webp',
        rotation: '0 -180 0',
        description: 'The main hall (Maha Mandapa) of the Vittala Temple, famous for its delicately carved musical pillars.',
        hotspots: [
          { id: 'hs-pillar-info', type: 'info', position: '-3 1 -5', label: 'Musical Pillars', icon: 'ℹ', info: 'The 56 musical pillars, also known as SAREGAMA pillars, emit musical tones when tapped. They are carved from solid granite.' },
          { id: 'hs-back-chariot', type: 'navigation', target: 'stone-chariot', position: '0 0 8', label: 'Back to Chariot', icon: '←' }
        ]
      }
    ],
    chatbotKnowledge: {
      greeting: "Namaskara! 🙏 Welcome to the magnificent ruins of Hampi. What would you like to discover about the Vijayanagara Empire?",
      facts: [
        "In the 1500s, Hampi-Vijayanagara was the world's second-largest medieval-era city after Beijing.",
        "The Vittala Temple's musical pillars emit different musical notes when struck gently.",
        "The entire landscape is defined by massive heaps of boulders which the artisans used directly to carve the temples.",
        "The Stone Chariot is one of only three famous stone chariots in India (others are in Konark and Mahabalipuram)."
      ],
      qa: [
        { q: ['who built', 'empire', 'king'], a: "Hampi was the capital of the Vijayanagara Empire, founded by Harihara I and Bukka Raya I in 1336. It reached its zenith under Emperor Krishnadevaraya in the early 1500s." },
        { q: ['destroyed', 'ruins', 'what happened', 'fall'], a: "The empire fell in 1565 after the Battle of Talikota. A coalition of Deccan sultanates defeated the Vijayanagara army and spent months pillaging, burning, and destroying the city." },
        { q: ['chariot', 'stone chariot'], a: "The Stone Chariot is actually a shrine dedicated to Garuda (the eagle mount of Lord Vishnu). Its wheels were originally free to rotate, though they have now been cemented for preservation." }
      ]
    },
    historicalInfo: {
      era: '16th Century Vijayanagara Empire',
      pastDescription: 'During the reign of Krishnadevaraya, Hampi was a fabulously wealthy, thriving metropolis. Markets overflowed with diamonds, pearls, and silks. The temples were brilliantly painted and adorned with gold and jewels.',
      changes: 'The city was systematically destroyed and burned over 6 months in 1565 by invading armies. Today, it remains an evocative landscape of spectacular, weathered granite ruins.'
    },
    recommendations: ['mysore-palace']
  },

  'mysore-palace': {
    id: 'mysore-palace',
    name: 'Mysore Palace',
    emoji: '🏰',
    location: 'Mysuru, Karnataka',
    year: '1912',
    description: 'The Amba Vilas Palace is a historical palace and a royal residence. It is one of the most magnificent palaces in India, blending Hindu, Muslim, Rajput, and Gothic architectural styles.',
    shortDesc: 'Amba Vilas Palace',
    architect: 'Henry Irwin',
    category: 'Palace',
    coordinates: { lat: 12.3052, lng: 76.6552 },
    panoramaBase: 'assets/images/mysore_palace_panorama.webp',
    cardGradient: 'linear-gradient(135deg, #ffd700, #b8860b)',
    viewpoints: [
      {
        id: 'palace-front',
        name: 'Palace Facade',
        panorama: 'assets/images/mysore_palace_panorama.webp',
        rotation: '0 0 0',
        description: 'The magnificent front facade of the Amba Vilas Palace, characterized by its golden domes, arches, and grand courtyards.',
        hotspots: [
          { id: 'hs-dome-info', type: 'info', position: '0 4 -8', label: 'Indo-Saracenic Style', icon: 'ℹ', info: 'The architecture blends Hindu, Mughal, Rajput, and Gothic styles. It is a three-story stone structure with marble domes and a 145-foot five-story tower.' }
        ]
      }
    ],
    chatbotKnowledge: {
      greeting: "Namaskara! 🙏 Welcome to the royal Mysore Palace. What would you like to know about the Wadiyar dynasty's residence?",
      facts: [
        "Mysore Palace is the second most visited historical monument in India after the Taj Mahal.",
        "The palace is illuminated with exactly 97,000 incandescent bulbs on Sundays and public holidays.",
        "The original wooden palace burned down completely in 1897 during a royal wedding."
      ],
      qa: [
        { q: ['who built', 'architect', 'king'], a: "The current palace was commissioned by Maharaja Krishnaraja Wadiyar IV in 1897 and designed by the British architect Lord Henry Irwin. It was completed in 1912." },
        { q: ['lights', 'illumination', 'bulbs'], a: "The palace is famous for its illumination. It is lit up with 97,000 bulbs every Sunday and during the Dasara festival, creating a breathtaking golden glow against the night sky." }
      ]
    },
    historicalInfo: {
      era: 'Early 20th Century (Wadiyar Dynasty)',
      pastDescription: 'The current palace replaced a much older wooden palace that was destroyed by fire in 1897. During the Dasara festival in the early 1900s, the Maharajas would hold grand durbars (assemblies) sitting on the Golden Throne.',
      changes: 'The palace remains meticulously maintained. While the royals no longer rule, they still reside in a portion of the palace, and the grand traditions of Dasara are still celebrated annually.'
    },
    recommendations: ['hampi', 'gateway-of-india']
  },

  'gateway-of-india': {
    id: 'gateway-of-india',
    name: 'Gateway of India',
    emoji: '🏛️',
    location: 'Mumbai, Maharashtra',
    year: '1924',
    description: 'An iconic arch monument built during the 20th century in Bombay to commemorate the landing of King-Emperor George V and Queen-Empress Mary in 1911.',
    shortDesc: 'Mumbai\'s Iconic Arch',
    architect: 'George Wittet',
    category: 'Monumental Arch',
    coordinates: { lat: 18.9220, lng: 72.8347 },
    panoramaBase: 'assets/images/gateway_of_india_panorama.webp',
    cardGradient: 'linear-gradient(135deg, #718096, #2d3748)',
    viewpoints: [
      {
        id: 'gateway-plaza',
        name: 'Apollo Bunder Plaza',
        panorama: 'assets/images/gateway_of_india_panorama.webp',
        rotation: '0 0 0',
        description: 'Standing on the bustling plaza looking at the majestic basalt arch overlooking the Arabian Sea.',
        hotspots: [
          { id: 'hs-arch-info', type: 'info', position: '0 3 -6', label: 'The Arch', icon: 'ℹ', info: 'Built in Indo-Saracenic style with yellow basalt and concrete. The central dome is 48 feet in diameter and 83 feet above ground at its highest point.' }
        ]
      }
    ],
    chatbotKnowledge: {
      greeting: "Hello! 👋 Welcome to the Gateway of India, the iconic symbol of Mumbai. What would you like to know?",
      facts: [
        "It was built to welcome King George V, but he only saw a cardboard model of it when he arrived in 1911!",
        "The last British troops left India through this very gateway in 1948 following India's independence.",
        "The Taj Mahal Palace Hotel stands opposite to it, completing the iconic Mumbai waterfront view."
      ],
      qa: [
        { q: ['why built', 'purpose', 'george'], a: "It was erected to commemorate the landing of King George V and Queen Mary at Apollo Bunder on their visit to India in 1911. However, the actual monument wasn't finished until 1924." },
        { q: ['british left', 'independence'], a: "Historically, it served as the monumental entrance to India for British viceroys. Ironically, the last British troops (the First Battalion of the Somerset Light Infantry) passed through this gateway as they left India on February 28, 1948." }
      ]
    },
    historicalInfo: {
      era: 'British Raj (1924)',
      pastDescription: 'In the 1920s and 30s, this was the primary landing point for P&O steamers arriving from England. It was literally the "Gateway to India" for British governors, prominent figures, and colonial officials arriving by sea.',
      changes: 'Today it is no longer a colonial entry point but Mumbai\'s top tourist attraction, bustling with photographers, balloon sellers, and tourists waiting for ferries to Elephanta Caves.'
    },
    recommendations: ['taj-mahal', 'mysore-palace']
  },

  'red-fort': {
    id: 'red-fort',
    name: 'Red Fort',
    emoji: '🏰',
    location: 'Delhi',
    year: '1639',
    description: 'A historic fort in Old Delhi that served as the main residence of the Mughal Emperors. Known for its massive enclosing walls of red sandstone.',
    shortDesc: 'Lal Qila',
    architect: 'Ustad Ahmad Lahauri',
    category: 'Fortress',
    coordinates: { lat: 28.6562, lng: 77.2410 },
    panoramaBase: 'assets/images/red_fort_panorama.webp',
    cardGradient: 'linear-gradient(135deg, #c53030, #742a2a)',
    viewpoints: [
      {
        id: 'lahori-gate',
        name: 'Lahori Gate',
        panorama: 'assets/images/red_fort_panorama.webp',
        rotation: '0 0 0',
        description: 'The main gate to the Red Fort, named for its orientation towards Lahore.',
        hotspots: [
          { id: 'hs-fort-info', type: 'info', position: '0 2 -6', label: 'Red Sandstone', icon: 'ℹ', info: 'The fort is octagonal with the north-south axis longer than the east-west axis. The massive walls are built entirely of red sandstone, giving it the name Lal Qila.' }
        ]
      }
    ],
    chatbotKnowledge: {
      greeting: "Namaste! 🙏 Welcome to the historic Red Fort (Lal Qila) in Delhi. What history would you like to explore?",
      facts: [
        "The Prime Minister of India hoists the national flag here every year on Independence Day (August 15).",
        "It was built by Shah Jahan when he decided to shift his capital from Agra to Delhi.",
        "The Koh-i-Noor diamond was once part of Shah Jahan's Peacock Throne, located inside this fort."
      ],
      qa: [
        { q: ['who built', 'shah jahan'], a: "The fort was commissioned by Emperor Shah Jahan in 1638 when he decided to shift his capital from Agra to Delhi (Shahjahanabad). The architect was Ustad Ahmad Lahauri, who also designed the Taj Mahal." },
        { q: ['independence', 'flag', 'august 15'], a: "The Red Fort is deeply tied to Indian independence. India's first Prime Minister, Jawaharlal Nehru, raised the Indian flag above the Lahori Gate on August 15, 1947, a tradition that continues to this day." }
      ]
    },
    historicalInfo: {
      era: '17th Century Mughal Empire',
      pastDescription: 'During Shah Jahan\'s reign, the Red Fort was a city within a city, housing the emperor\'s family, thousands of courtiers, and elite guards. The interior palaces were richly decorated with silver ceilings, silk carpets, and the legendary jewel-encrusted Peacock Throne.',
      changes: 'The fort was severely plundered during Nadir Shah\'s invasion in 1739. Following the 1857 rebellion, the British destroyed many pavilions and replaced them with colonial barracks. It is now a UNESCO World Heritage site and symbol of modern India.'
    },
    recommendations: ['taj-mahal', 'hampi']
  }
};

// ── Hindi Narration Data ──
// Used by the voice guide when language is set to Hindi
const HINDI_NARRATIONS = {
  'taj-mahal': {
    name: 'ताज महल',
    description: 'यमुना नदी के किनारे बना हाथीदाँत जैसे सफेद संगमरमर का मक़बरा। मुग़ल बादशाह शाहजहाँ ने अपनी प्रिय पत्नी मुमताज़ महल की याद में इसे बनवाया था।',
    viewpoints: {
      'main-gate': { name: 'मुख्य दरवाज़ा', description: 'दरवाज़ा-ए-रौज़ा — ताज महल परिसर का भव्य मुख्य प्रवेश द्वार। यह ३० मीटर ऊँचा है और लाल बलुआ पत्थर से बना है।' },
      'garden-path': { name: 'चारबाग़ उद्यान', description: 'मुग़ल शैली का चारबाग़ उद्यान, जो पैदल मार्गों और जल नालियों से चार भागों में विभाजित है। यह फ़ारसी स्वर्ग उद्यान की अवधारणा पर आधारित है।' },
      'main-platform': { name: 'मुख्य मक़बरा', description: 'सफ़ेद संगमरमर का मक़बरा एक चौकोर चबूतरे पर खड़ा है। इसका विशाल गुम्बद ३५ मीटर ऊँचा है और चारों कोनों पर सुन्दर मीनारें हैं।' }
    }
  },
  'hampi': {
    name: 'हम्पी (विजयनगर)',
    description: 'विजयनगर साम्राज्य की पूर्व राजधानी के शानदार खण्डहर। अपने विशाल पत्थरों के परिदृश्य और अलंकृत द्रविड़ मन्दिरों के लिए प्रसिद्ध।',
    viewpoints: {
      'stone-chariot': { name: 'पत्थर का रथ', description: 'विट्ठल मन्दिर परिसर का प्रतिष्ठित पत्थर का रथ। यह गरुड़ को समर्पित एक मन्दिर है जो रथ के आकार में बना है। इसके पहिये कभी सचमुच घूमते थे!' },
      'musical-pillars': { name: 'संगीत स्तम्भ', description: 'विट्ठल मन्दिर का महा मण्डप, जो अपने ५६ संगीत स्तम्भों के लिए प्रसिद्ध है। इन्हें थपथपाने पर संगीत की ध्वनि निकलती है।' }
    }
  },
  'mysore-palace': {
    name: 'मैसूर पैलेस',
    description: 'अम्बा विलास पैलेस, भारत के सबसे भव्य महलों में से एक। हिन्दू, मुस्लिम, राजपूत और गोथिक वास्तुकला शैलियों का अद्भुत मिश्रण।',
    viewpoints: {
      'palace-front': { name: 'महल का मुख्य भाग', description: 'अम्बा विलास महल का भव्य मुख्य भाग। सुनहरे गुम्बद, मेहराब और विशाल प्रांगण इसकी विशेषता हैं। रविवार को ९७ हज़ार बल्बों से यह जगमगाता है।' }
    }
  },
  'gateway-of-india': {
    name: 'गेटवे ऑफ़ इंडिया',
    description: 'मुम्बई का प्रतिष्ठित मेहराबदार स्मारक, जिसे किंग जॉर्ज पंचम के आगमन की स्मृति में बनाया गया था।',
    viewpoints: {
      'gateway-plaza': { name: 'अपोलो बन्दर चौक', description: 'अरब सागर की ओर देखते हुए भव्य बेसाल्ट पत्थर के मेहराब के सामने का चौक। यहाँ से ताज महल पैलेस होटल भी दिखता है।' }
    }
  },
  'red-fort': {
    name: 'लाल क़िला',
    description: 'पुरानी दिल्ली का ऐतिहासिक क़िला जो मुग़ल बादशाहों का मुख्य निवास था। लाल बलुआ पत्थर की विशाल दीवारों के लिए प्रसिद्ध।',
    viewpoints: {
      'lahori-gate': { name: 'लाहौरी दरवाज़ा', description: 'लाल क़िले का मुख्य द्वार, जिसका मुख लाहौर की ओर है। हर वर्ष १५ अगस्त को प्रधानमन्त्री यहाँ से तिरंगा फहराते हैं।' }
    }
  }
};

// Helper: Get Hindi narration for a specific viewpoint
function getHindiNarration(monumentId, viewpointId) {
  const monument = HINDI_NARRATIONS[monumentId];
  if (!monument) return null;
  if (viewpointId && monument.viewpoints && monument.viewpoints[viewpointId]) {
    return monument.viewpoints[viewpointId];
  }
  return { name: monument.name, description: monument.description };
}

// Helper: Get monument by ID
function getMonument(id) {
  return MONUMENTS_DATA[id] || null;
}

// Helper: Get all monument IDs
function getMonumentIds() {
  return Object.keys(MONUMENTS_DATA);
}

// Helper: Get viewpoint by monument and viewpoint ID
function getViewpoint(monumentId, viewpointId) {
  const monument = MONUMENTS_DATA[monumentId];
  if (!monument) return null;
  return monument.viewpoints.find(v => v.id === viewpointId) || null;
}

// Helper: Get first viewpoint of a monument
function getDefaultViewpoint(monumentId) {
  const monument = MONUMENTS_DATA[monumentId];
  if (!monument) return null;
  return monument.viewpoints[0] || null;
}

// Helper: Get recommendations for a monument
function getRecommendations(monumentId) {
  const monument = MONUMENTS_DATA[monumentId];
  if (!monument) return [];
  return monument.recommendations.map(id => MONUMENTS_DATA[id]).filter(Boolean);
}
