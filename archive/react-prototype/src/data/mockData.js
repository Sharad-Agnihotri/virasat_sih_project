// Comprehensive Mock Dataset for Virasat Platform

export const CITIES_DATA = [
  {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    mapCoords: { x: 32, y: 38 }, // SVG Percentage Coordinates
    shortDesc: "The Royal Pink City — Cradle of Block Prints, Blue Pottery & Rajput Lore",
    historyStory: `In 1727 AD, Maharaja Sawai Jai Singh II envisioned a city designed according to Shilpa Shastra — ancient Vedic principles of architecture. Wrapped in rose-pink terracotta plaster symbolizing hospitality, Jaipur became a sanctuary for master craftsmen, astronomers, and weavers fleeing chaotic empires. The city's grid layout, nine blocks representing the nine treasure divisions of the universe, preserves living heritage where ancient brass hammer clicks still echo through ancestral havelis.`,
    placesToVisit: [
      {
        name: "Hawa Mahal (Palace of Winds)",
        desc: "A 5-story honeycomb facade crafted with 953 delicate lattice jharokhas for royal women to observe street processions without being seen.",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Amber Fort & Palace",
        desc: "Perched atop Cheel ka Teela (Hill of Eagles), featuring the legendary Sheesh Mahal adorned with thousands of hand-cut convex mirrors.",
        image: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Jantar Mantar Observatory",
        desc: "UNESCO World Heritage site housing 19 architectural astronomical instruments, including the world's largest stone sundial.",
        image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80"
      }
    ],
    crafts: [
      {
        id: "craft-jp-1",
        name: "Jaipur Blue Pottery",
        desc: "Turquoise quartz-based pottery fired without clay, decorated with intricate Persian floral motifs.",
        story: "Derived from Turko-Persian origins, Turko-Persian artisans migrated to Jaipur under Maharaja Ram Singh II. Unlike standard pottery, it uses ground quartz stone, glass, and natural copper oxide dyes.",
        image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "craft-jp-2",
        name: "Bagru & Sanganeri Block Print",
        desc: "Hand-carved teakwood blocks dipped in natural vegetable indigo and madder dyes stamped onto unbleached cotton.",
        story: "Practiced for over 400 years by the Chippa community along the Sanjaria River, relying on sun-baked riverbeds for color fixation.",
        image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80"
      }
    ],
    festivals: [
      {
        name: "Teej Festival",
        month: "August (Monsoon)",
        desc: "Celebrating Goddess Parvati's union with Lord Shiva with grand palanquin processions, swings in royal gardens, and traditional ghevar sweets.",
        image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Jaipur International Literature & Heritage Mela",
        month: "January",
        desc: "Gathering of world authors, folk musicians, puppet masters, and traditional artisans at Diggi Palace.",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80"
      }
    ],
    food: [
      {
        name: "Dal Baati Churma",
        desc: "Baked whole-wheat dough balls dipped in pure desi ghee, served with five-lentil curry and sweet crushed wheat churma.",
        story: "Created by warrior Marwari soldiers who buried dough balls in desert sand under sun heat before riding to battle.",
        image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Pyaaz Kachori & Ghevar",
        desc: "Flaky deep-fried pastry filled with spiced onions served with disc-shaped honeycombed dessert soaked in saffron syrup.",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80"
      }
    ],
    languageSpoken: ["Rajasthani (Marwari)", "Hindi", "English"],
    artisans: [
      {
        id: "art-1",
        name: "Master Kirpal Singh Shekhawat Studio",
        craftSpecialty: "Jaipur Blue Pottery",
        bio: "National Awardee 4th generation artisan family keeping the quartz-pottery glaze legacy alive.",
        yearsOfExperience: 38,
        photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
        productsCount: 4
      },
      {
        id: "art-2",
        name: "Ramprasad Chippa",
        craftSpecialty: "Bagru Block Printing",
        bio: "Woodblock carver and natural dye master preserving 200-year-old wooden blocks.",
        yearsOfExperience: 29,
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        productsCount: 3
      }
    ]
  },
  {
    id: "varanasi",
    name: "Varanasi (Kashi)",
    state: "Uttar Pradesh",
    mapCoords: { x: 55, y: 44 },
    shortDesc: "The Eternal City — Sacred Ghats, Banarasi Zari Silk & Classical Ragas",
    historyStory: `Older than history, older than tradition, Varanasi sits on the sacred crescent bend of the River Ganges. Mentioned in the Rigveda, Kashi has been the spiritual heartland of India for 3,000 years. It is where Buddha delivered his first sermon at Sarnath, where Tulsidas composed the Ramcharitmanas, and where master Muslim and Hindu weavers forged the world's most intricate silk brocades using gold and silver threads (Zari).`,
    placesToVisit: [
      {
        name: "Dashashwamedh Ghat",
        desc: "The primary ghat renowned for the grand evening Ganga Aarti performed with massive brass lamps, incense, and Vedic chants.",
        image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Sarnath Deer Park & Stupa",
        desc: "Where Gautama Buddha taught the Four Noble Truths. Houses the Ashoka Pillar with four lions emblem.",
        image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Kashi Vishwanath Corridor",
        desc: "Historic Jyotirlinga temple connecting ancient stone architecture directly with the ghats of the Holy Ganga.",
        image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=800&q=80"
      }
    ],
    crafts: [
      {
        id: "craft-vns-1",
        name: "Banarasi Silk Brocade",
        desc: "Heavy silk sarees handwoven on pit looms featuring gold silver brocades (Kinkhab), floral floral motifs (Jaal), and foliage.",
        story: "Brought to prominence during Mughal emperor Akbar's reign, blending Persian floral aesthetics with traditional Indian motifs.",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "craft-vns-2",
        name: "Varanasi Wooden Lacquerware Toys",
        desc: "Hand-turned wooden toys coated with natural non-toxic lacquer extracted from tree resins.",
        story: "Practiced by the ancestral craft communities along the narrow alleyways of Khojwa.",
        image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80"
      }
    ],
    festivals: [
      {
        name: "Dev Deepawali",
        month: "November (Kartik Purnima)",
        desc: "Over one million earthenware oil lamps (diyas) illuminate every single step of the 84 ghats along the Ganges.",
        image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80"
      }
    ],
    food: [
      {
        name: "Banarasi Paan & Malaiyyo",
        desc: "Foamy milk dessert infused with saffron, pistachio, and cardamom served in clay pots alongside betel leaf paan.",
        story: "Malaiyyo is a winter miracle dessert made by leaving sweetened milk in open air overnight for dew drops to foam it.",
        image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80"
      }
    ],
    languageSpoken: ["Bhojpuri", "Hindi", "Sanskrit"],
    artisans: [
      {
        id: "art-3",
        name: "Ustad Mukhtar Ansari & Family",
        craftSpecialty: "Pure Zari Banarasi Weaving",
        bio: "5th generation Master Weaver operating traditional wooden handlooms in Madanpura.",
        yearsOfExperience: 42,
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        productsCount: 5
      }
    ]
  },
  {
    id: "srinagar",
    name: "Srinagar",
    state: "Jammu & Kashmir",
    mapCoords: { x: 26, y: 15 },
    shortDesc: "Paradise on Earth — Dal Lake Shikaras, Fine Pashmina & Papier-Mâché Art",
    historyStory: `Founded by Emperor Ashoka in the 3rd century BC, Srinagar sits cradled in the Kashmir valley along the Jhelum river. Famed for Mughal gardens laid out by Shah Jahan, Kashmir served as the silk route hub connecting Central Asia with India. The Persian king Zain-ul-Abidin invited artisans from Samarkand, giving birth to Pashmina weaving, carpet knotting, and walnut wood carving.`,
    placesToVisit: [
      {
        name: "Dal Lake & Floating Market",
        desc: "Iconic body of water filled with carved wooden houseboats and floating vegetable markets navigated by Shikaras.",
        image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Shalimar Bagh & Nishat Bagh",
        desc: "Terraced Mughal gardens built in 1619 with cascading fountains and centuries-old Chinar trees.",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80"
      }
    ],
    crafts: [
      {
        id: "craft-sr-1",
        name: "Kashmiri Hand-Embroidered Pashmina",
        desc: "Ultra-soft cashmere fleece spun from Changthangi goats, embroidered with needle Sozni floral motifs.",
        story: "Each shawl takes between 6 months to 2 years of meticulous single-needle hand stitching.",
        image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "craft-sr-2",
        name: "Kashmiri Papier-Mâché",
        desc: "Paper pulp moulded into boxes, vases, and trays, hand-painted with gold leaf and miniature bird art.",
        story: "Introduced by Sufi saint Mir Sayyid Ali Hamadani from Persia in the 14th century.",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
      }
    ],
    festivals: [
      {
        name: "Tulip Festival",
        month: "April",
        desc: "Asia's largest tulip garden blossoms with millions of tulips of over 60 varieties against the Zabarwan range.",
        image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=800&q=80"
      }
    ],
    food: [
      {
        name: "Wazwan & Kahwa Tea",
        desc: "Traditional 36-course royal meal served on copper platters (Trami) accompanied by green tea infused with saffron and almonds.",
        story: "Wazwan cooking is an artform passed down exclusively among hereditary master cooks (Wazas).",
        image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80"
      }
    ],
    languageSpoken: ["Kashmiri (Koshur)", "Urdu", "Hindi"],
    artisans: [
      {
        id: "art-4",
        name: "Ghulam Nabi & Sons",
        craftSpecialty: "Authentic Pashmina & Sozni Needlework",
        bio: "Heritable artisan workshop located in Downtown Srinagar.",
        yearsOfExperience: 35,
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
        productsCount: 3
      }
    ]
  },
  {
    id: "madurai",
    name: "Madurai",
    state: "Tamil Nadu",
    mapCoords: { x: 42, y: 84 },
    shortDesc: "The Temple City — Meenakshi Temple Towers, Sungudi Cotton & Jasmine Fragrance",
    historyStory: `Known as the Athens of the East, Madurai has been continuously inhabited for over 2,500 years. Governed by the ancient Sangam Pandyan dynasty, Madurai was the capital where Tamil literature flourished. Centered around the majestic Meenakshi Sundareswarar temple with its 14 soaring gopurams encrusted with thousands of painted deities, it is famous for tie-and-dye Sungudi sarees brought by Saurashtrian weavers centuries ago.`,
    placesToVisit: [
      {
        name: "Meenakshi Amman Temple",
        desc: "Architectural wonder featuring 14 gopuram towers, the Hall of 1000 Pillars, and sacred Golden Lotus Tank.",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Thirumalai Nayakkar Mahal",
        desc: "17th-century palace built by King Thirumalai Nayak blending Dravidian, Islamic, and Italian Renaissance styles.",
        image: "https://images.unsplash.com/photo-1621831985871-7442c92e7033?auto=format&fit=crop&w=800&q=80"
      }
    ],
    crafts: [
      {
        id: "craft-md-1",
        name: "Madurai Sungudi Saree",
        desc: "Traditional cotton saree created using micro tie-and-dye ring dots inspired by cosmic night stars.",
        story: "Crafted by Saurashtrian migrants who settled under Nayak royal patronage, using natural indigo and alizarin dyes.",
        image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
      }
    ],
    festivals: [
      {
        name: "Chithirai Festival",
        month: "April / May",
        desc: "Re-enactment of the divine wedding of Goddess Meenakshi with Lord Sundareswarar drawn on golden chariots.",
        image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80"
      }
    ],
    food: [
      {
        name: "Jigarthanda & Madurai Bun Parotta",
        desc: "Cooling beverage made with tree gum, nannari syrup, and ice cream alongside multi-layered fluffy bun parotta.",
        story: "Jigarthanda literally means 'Heart Cooler', introduced as a refreshing elixir for southern summers.",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80"
      }
    ],
    languageSpoken: ["Tamil", "Saurashtra", "English"],
    artisans: [
      {
        id: "art-5",
        name: "S. K. Ramanathan Weaver Collective",
        craftSpecialty: "Traditional Madurai Sungudi",
        bio: "Master tie-dye artisan practicing ring-dot technique for over 4 decades.",
        yearsOfExperience: 40,
        photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
        productsCount: 4
      }
    ]
  },
  {
    id: "kutch",
    name: "Rann of Kutch",
    state: "Gujarat",
    mapCoords: { x: 18, y: 48 },
    shortDesc: "The White Desert — Mirror Embroidery, Ajrakh Print & Rogue Salt Marshes",
    historyStory: `Extending to the Arabian Sea, Kutch is a cradle of resilient desert civilizations dating back to Dholavira of the Indus Valley. Communities like the Rabaris, Mutwas, and Meghwals developed intricate mirrorwork embroidery (Abhla Bharat) so women could reflect sunlight and ward off desert evil spirits.`,
    placesToVisit: [
      {
        name: "Great Rann White Salt Desert",
        desc: "Surreal salt marsh landscape shining silvery white under full moon light.",
        image: "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Dhamadka & Ajrakhpur Craft Village",
        desc: "Dedicated artisan village where 16-stage block printing using mud resist and natural indigo takes place.",
        image: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80"
      }
    ],
    crafts: [
      {
        id: "craft-kt-1",
        name: "Kutchi Mirrorwork & Rabari Embroidery",
        desc: "Hand-stitched geometric patterns studded with tiny mirrors, silk thread tassels, and chain stitching.",
        story: "Each nomadic tribe possesses a distinct stitch signature passed from mother to daughter as dowry heirlooms.",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "craft-kt-2",
        name: "Ajrakh Block Printing",
        desc: "Complex double-sided block printing featuring geometric star grids printed using pomegranate skin, iron, and indigo.",
        story: "Dating back 4,000 years to Sindhu valley civilization.",
        image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80"
      }
    ],
    festivals: [
      {
        name: "Rann Utsav",
        month: "November – February",
        desc: "Cultural carnival of Gujarati folk dance (Garba, Raas), desert camping, and handicraft fairs.",
        image: "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&w=800&q=80"
      }
    ],
    food: [
      {
        name: "Kutchi Dabeli & Bajra No Rotlo",
        desc: "Spiced potato burger garnished with pomegranate seeds, roasted peanuts, and served with millet flatbread.",
        story: "Invented in Mandvi in 1960 by Keshavji Gabha Chhudasma.",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80"
      }
    ],
    languageSpoken: ["Kutchi", "Gujarati", "Hindi"],
    artisans: [
      {
        id: "art-6",
        name: "Dr. Ismail Khatri Ajrakh Studio",
        craftSpecialty: "Natural Dye Ajrakh Block Print",
        bio: "Master craftsman awarded honorary doctorate for preserving natural dye chemistry.",
        yearsOfExperience: 45,
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        productsCount: 6
      }
    ]
  },
  {
    id: "bodhgaya",
    name: "Bodh Gaya",
    state: "Bihar",
    mapCoords: { x: 64, y: 46 },
    shortDesc: "Land of Enlightenment — Mahabodhi Tree, Madhubani Art & Ancient Wisdom",
    historyStory: `Under the shade of the sacred Peepal tree at Bodh Gaya, Siddhartha Gautama attained Supreme Enlightenment 2,500 years ago, becoming the Buddha. Located in Bihar — the ancient land of Magadha, Nalanda University, and Emperor Ashoka — it is a universal beacon of peace. Nearby Mithila region is home to Madhubani painting, traditionally painted on mud walls by women using twigs and natural pigment paste.`,
    placesToVisit: [
      {
        name: "Mahabodhi Temple Complex",
        desc: "UNESCO World Heritage 50-meter grand pyramidal temple housing the sacred Vajrasana (Diamond Throne) and Bodhi Tree descendant.",
        image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Great Buddha Statue",
        desc: "25-meter tall stone statue depicting Lord Buddha in meditation pose, unveiled by the Dalai Lama.",
        image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80"
      }
    ],
    crafts: [
      {
        id: "craft-bg-1",
        name: "Mithila / Madhubani Painting",
        desc: "Intricate line art drawn with bamboo twigs depicting Hindu deities, peacocks, flora, and geometric borders.",
        story: "Originated when King Janaka commissioned artists to paint the town of Mithila for Sita's royal wedding to Rama.",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
      }
    ],
    festivals: [
      {
        name: "Buddha Jayanti / Purnima",
        month: "May",
        desc: "International gathering of Buddhist monks, candle light vigils, and sutra chanting around the sacred Bodhi Tree.",
        image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80"
      }
    ],
    food: [
      {
        name: "Litti Chokha & Khaja",
        desc: "Whole-wheat dough balls stuffed with roasted gram flour (sattu) cooked over cow dung embers, served with roasted eggplant chokha.",
        story: "Litti was the staple food of ancient Mauryan soldiers due to its long shelf-life and nutritional value.",
        image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80"
      }
    ],
    languageSpoken: ["Magahi", "Maithili", "Hindi"],
    artisans: [] // Demonstrating the required requirement: "if there is none artisans it should say none"
  }
];

export const MONUMENTS_AI_DATA = [
  {
    id: "monument-taj",
    name: "Taj Mahal",
    location: "Agra, Uttar Pradesh",
    cityId: "varanasi",
    confidence: 99.4,
    builtBy: "Emperor Shah Jahan (1631–1653 AD)",
    architecture: "Mughal Architecture (White Marble Inlay / Pietra Dura)",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    historyStory: `Built as an eternal testament of love for Empress Mumtaz Mahal, the Taj Mahal stands on the right bank of Yamuna River. Built using pure white Makrana marble from Rajasthan, thousands of precious lapis lazuli, turquoise, and carnelian stones were inlaid into the marble using Pietra Dura technique. The monument changes color from soft pink in dawn to glowing silver under full moonlight.`,
    craftsAssociated: ["Pietra Dura Inlay Art", "Zardozi Gold Embroidery", "Agra Marble Carving"],
    foodAssociated: ["Agra Petha (Ash Gourd Sweet)", "Mughlai Bedmi Poori"],
    festivalsAssociated: ["Taj Mahotsav (February)"],
    languagesSpoken: ["Hindi", "Urdu", "Braj Bhasha"]
  },
  {
    id: "monument-hawa",
    name: "Hawa Mahal",
    location: "Jaipur, Rajasthan",
    cityId: "jaipur",
    confidence: 98.7,
    builtBy: "Maharaja Sawai Pratap Singh (1799 AD)",
    architecture: "Rajput & Mughal Fusion (Red/Pink Sandstone)",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    historyStory: `Designed by Lal Chand Ustad in the shape of Lord Krishna's crown, Hawa Mahal features 953 small windows (jharokhas) decorated with intricate latticework. The Venturi effect created by the narrow openings acts as an air conditioner, cooling the royal court during scorching desert summers.`,
    craftsAssociated: ["Jaipur Blue Pottery", "Block Printing", "Gota Patti Jewelry"],
    foodAssociated: ["Dal Baati Churma", "Pyaaz Kachori"],
    festivalsAssociated: ["Teej", "Gangaur"],
    languagesSpoken: ["Rajasthani (Marwari)", "Hindi"]
  },
  {
    id: "monument-konark",
    name: "Konark Sun Temple",
    location: "Konark, Odisha",
    cityId: "bodhgaya",
    confidence: 97.2,
    builtBy: "King Narasimhadeva I (1250 AD)",
    architecture: "Kalinga Architectural Style (Khondalite Stone)",
    image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80",
    historyStory: `Conceived as a colossal chariot driven by seven stone horses with 24 carved stone wheels symbolizing the sun god Surya. The wheels function as sun dials accurately calculating time to the minute.`,
    craftsAssociated: ["Pattachitra Palm Leaf Painting", "Stone Carving", "Appliqué Work of Pipili"],
    foodAssociated: ["Chhena Poda", "Dalma"],
    festivalsAssociated: ["Konark Dance Festival (December)"],
    languagesSpoken: ["Odia", "Hindi"]
  },
  {
    id: "monument-meenakshi",
    name: "Meenakshi Amman Temple",
    location: "Madurai, Tamil Nadu",
    cityId: "madurai",
    confidence: 98.9,
    builtBy: "Pandyan & Nayak Dynasties (6th - 17th Century AD)",
    architecture: "Dravidian Temple Architecture",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    historyStory: `Dedicated to Goddess Meenakshi (an avatar of Parvati) and her consort Sundareswarar. The temple complex covers 45 acres, housing 33,000 stone sculptures and 14 towering gopurams decorated with thousands of mythic statues re-painted every 12 years.`,
    craftsAssociated: ["Madurai Sungudi Saree", "Brass Idol Casting"],
    foodAssociated: ["Madurai Jigarthanda", "Kari Dosa"],
    festivalsAssociated: ["Chithirai Thiruvizha"],
    languagesSpoken: ["Tamil"]
  },
  {
    id: "monument-redfort",
    name: "Red Fort",
    location: "Old Delhi, Delhi",
    cityId: "delhi",
    confidence: 99.2,
    builtBy: "Mughal Emperor Shah Jahan (1638–1648 AD)",
    architecture: "Mughal Red Sandstone & Marble Palatial Architecture",
    image: "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=800&q=80",
    historyStory: `Constructed from red sandstone when the Mughal capital shifted from Agra to Shahjahanabad. Houses iconic palaces like Diwan-i-Aam and Diwan-i-Khas, where Prime Ministers unfurl the national tricolor every Independence Day.`,
    craftsAssociated: ["Zardozi Threadwork", "Ivory & Bone Carving", "Meenakari Enameling"],
    foodAssociated: ["Old Delhi Paranthas", "Daulat Ki Chaat"],
    festivalsAssociated: ["Phool Walon Ki Sair", "Independence Day"],
    languagesSpoken: ["Hindi", "Urdu"]
  },
  {
    id: "monument-gateway",
    name: "Gateway of India",
    location: "Mumbai, Maharashtra",
    cityId: "mumbai",
    confidence: 99.1,
    builtBy: "Architect George Wittet (1911–1924 AD)",
    architecture: "Indo-Saracenic Architecture (Basalt Stone)",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
    historyStory: `Erected to commemorate the landing of King George V and Queen Mary at Apollo Bunder in 1911. Designed in the Indo-Saracenic style combining Roman triumphal archways with Gujarati 16th-century architectural motifs.`,
    craftsAssociated: ["Kolhapuri Leatherwork", "Warli Folk Art"],
    foodAssociated: ["Bombay Vada Pav", "Pav Bhaji"],
    festivalsAssociated: ["Ganesh Chaturthi", "Elephanta Festival"],
    languagesSpoken: ["Marathi", "Hindi", "English"]
  },
  {
    id: "monument-mysore",
    name: "Mysore Palace",
    location: "Mysuru, Karnataka",
    cityId: "mysore",
    confidence: 98.6,
    builtBy: "Wodeyar Dynasty & Henry Irwin (1912 AD)",
    architecture: "Indo-Saracenic Revival with Rajput, Hindu, & Gothic Elements",
    image: "https://images.unsplash.com/photo-1600100397608-f010f4448ac0?auto=format&fit=crop&w=800&q=80",
    historyStory: `Official residence of the Wodeyar Maharajas. Features carved rosewood doors, stained glass peacock ceilings, and over 97,000 light bulbs illuminating the majestic facade during Dasara festivities.`,
    craftsAssociated: ["Mysore Silk Weaving", "Rosewood Inlay", "Channapatna Wooden Toys"],
    foodAssociated: ["Mysore Pak", "Mylari Dosa"],
    festivalsAssociated: ["Mysore Dasara"],
    languagesSpoken: ["Kannada", "English"]
  },
  {
    id: "monument-qutub",
    name: "Qutub Minar",
    location: "Mehrauli, New Delhi",
    cityId: "delhi",
    confidence: 99.0,
    builtBy: "Qutb-ud-din Aibak & Iltutmish (1192 AD)",
    architecture: "Indo-Islamic Fluted Red Sandstone Minaret",
    image: "https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=800&q=80",
    historyStory: `A 73-meter tall UNESCO World Heritage minaret built of red sandstone carved with Arabic calligraphic inscriptions and intricate geometric bands. Houses the famous rust-resistant 1600-year-old Iron Pillar of Chandragupta II.`,
    craftsAssociated: ["Calligraphic Stone Carving", "Pottery of Blue Art"],
    foodAssociated: ["Chole Bhature", "Nihari"],
    festivalsAssociated: ["Qutub Festival of Music & Dance"],
    languagesSpoken: ["Hindi", "Urdu"]
  },
  {
    id: "monument-hampi",
    name: "Hampi Vijayanagara",
    location: "Hampi, Karnataka",
    cityId: "hampi",
    confidence: 98.4,
    builtBy: "Vijayanagara Empire (14th–16th Century AD)",
    architecture: "Dravidian Vijayanagara Architecture (Granite Stone)",
    image: "https://images.unsplash.com/photo-1600100397608-f010f4448ac0?auto=format&fit=crop&w=800&q=80",
    historyStory: `Capital of the opulent Vijayanagara Empire situated along the Tungabhadra River. Features the stone chariot of Vittala Temple, musical pillars, royal pavilions, and monolithic Narasimha statues carved directly from granite boulders.`,
    craftsAssociated: ["Lambani Tribal Embroidery", "Banana Fiber Crafts"],
    foodAssociated: ["Bisi Bele Bath", "Jolada Rotti"],
    festivalsAssociated: ["Hampi Utsav"],
    languagesSpoken: ["Kannada"]
  },
  {
    id: "monument-charminar",
    name: "Charminar",
    location: "Hyderabad, Telangana",
    cityId: "hyderabad",
    confidence: 98.8,
    builtBy: "Sultan Muhammad Quli Qutb Shah (1591 AD)",
    architecture: "Indo-Islamic Qutb Shahi Architecture",
    image: "https://images.unsplash.com/photo-1617886903355-935478440537?auto=format&fit=crop&w=800&q=80",
    historyStory: `Built to commemorate the eradication of a historic plague epidemic. Features four grand arches supporting 56-meter tall minarets overlooking the bustling Laad Bazaar pearl and bangle markets.`,
    craftsAssociated: ["Hyderabadi Lac Bangles", "Bidriware Metalwork", "Pearl Jewelry"],
    foodAssociated: ["Hyderabadi Dum Biryani", "Double Ka Meetha"],
    festivalsAssociated: ["Bonalu", "Deccan Festival"],
    languagesSpoken: ["Telugu", "Urdu", "Dakhini"]
  }
];

export const MARKETPLACE_PRODUCTS = [
  {
    id: "prod-1",
    name: "Royal Peacock Blue Pottery Vase (Hand-carved)",
    price: 3400,
    originalPrice: 4200,
    region: "Jaipur, Rajasthan",
    cityId: "jaipur",
    artisanName: "Master Kirpal Singh Shekhawat Studio",
    artisanId: "art-1",
    rating: 4.9,
    reviewsCount: 28,
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    originStory: "Crafted without clay using quartz stone powder, natural cobalt blue and copper oxide pigments, fired in wood furnaces for 36 hours. Each floral swirl represents Jaipur court art.",
    reviews: [
      { user: "Ananya Sharma", rating: 5, comment: "Exquisite craftsmanship! The blue glaze is so vibrant and authentic.", date: "2026-07-12" },
      { user: "David Miller", rating: 5, comment: "Shipped with extreme care. Proud to hold a piece of royal Marwari heritage.", date: "2026-06-28" }
    ]
  },
  {
    id: "prod-2",
    name: "Heritage Banarasi Kadwa Silk Saree (Gold Zari)",
    price: 18500,
    originalPrice: 22000,
    region: "Varanasi, Uttar Pradesh",
    cityId: "varanasi",
    artisanName: "Ustad Mukhtar Ansari & Family",
    artisanId: "art-3",
    rating: 5.0,
    reviewsCount: 41,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    originStory: "Woven on pit-looms using pure mulberry silk and silver-gold electroplated Zari thread. Kadwa technique requires separate hand-shuttles for each motif so there are no loose threads behind.",
    reviews: [
      { user: "Priya V.", rating: 5, comment: "Wore this for my sister's wedding. The sheen and gold thread work is legendary.", date: "2026-08-01" }
    ]
  },
  {
    id: "prod-3",
    name: "Hand-needle Embroidered Pashmina Stole",
    price: 12800,
    originalPrice: 15000,
    region: "Srinagar, Jammu & Kashmir",
    cityId: "srinagar",
    artisanName: "Ghulam Nabi & Sons",
    artisanId: "art-4",
    rating: 4.8,
    reviewsCount: 19,
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
    originStory: "Harvested from high-altitude Changthangi mountain goats in Ladakh, hand-spun on wooden charkhas and stitched with single-needle Sozni thread embroidery over 5 months.",
    reviews: [
      { user: "Sunita Roy", rating: 5, comment: "So soft it easily passes through a wedding ring. Truly divine Kashmir work.", date: "2026-07-20" }
    ]
  },
  {
    id: "prod-4",
    name: "Kutchi Mirror Embroidery Wall Hanging Tapestry",
    price: 2900,
    originalPrice: 3500,
    region: "Rann of Kutch, Gujarat",
    cityId: "kutch",
    artisanName: "Dr. Ismail Khatri Ajrakh Studio",
    artisanId: "art-6",
    rating: 4.9,
    reviewsCount: 15,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    originStory: "Embroidered by Rabari tribal women incorporating hundreds of small circular glass mirrors bound by silk chain-stitch borders.",
    reviews: [
      { user: "Rohan Kapoor", rating: 5, comment: "Transformed my living room wall with authentic Kutchi desert warmth.", date: "2026-06-15" }
    ]
  },
  {
    id: "prod-5",
    name: "Madurai Sungudi Tie-Dye Cotton Dupatta",
    price: 1450,
    originalPrice: 1800,
    region: "Madurai, Tamil Nadu",
    cityId: "madurai",
    artisanName: "S. K. Ramanathan Weaver Collective",
    artisanId: "art-5",
    rating: 4.7,
    reviewsCount: 22,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    originStory: "Hand-knotted with thousands of micro threads creating cosmic constellation dots dyed in organic pomegranate rind and indigo.",
    reviews: [
      { user: "Meenakshi K.", rating: 5, comment: "Breathable pure cotton, beautiful traditional Sungudi dots.", date: "2026-07-04" }
    ]
  }
];

export const CULTURAL_EVENTS = [
  {
    id: "ev-1",
    title: "Surajkund International Crafts Mela",
    location: "Faridabad / Delhi NCR",
    date: "Feb 02 – Feb 18, 2027",
    category: "Craft Mela",
    desc: "India's largest handloom and handicraft fair featuring over 1,000 master artisans, folk dancers, and traditional food stalls.",
    image: "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "ev-2",
    title: "Dev Deepawali & Ganga Aarti",
    location: "Varanasi Ghats, UP",
    date: "Nov 15, 2026",
    category: "Spiritual & Lighting Festival",
    desc: "Over 1.2 million earthen lamps lit on 84 riverbank ghats under the full moon night, accompanied by classical music.",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "ev-3",
    title: "Konark Classical Dance Festival",
    location: "Sun Temple Complex, Odisha",
    date: "Dec 01 – Dec 05, 2026",
    category: "Classical Performing Arts",
    desc: "Renowned Odissi, Bharatanatyam, Kathak, and Manipuri dancers perform against the backdrop of the illuminated 13th-century Sun Temple.",
    image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "ev-4",
    title: "Jaipur Teej Procession",
    location: "Old Pink City, Jaipur",
    date: "Aug 24, 2026",
    category: "Traditional Pageantry",
    desc: "Royal palanquin of Goddess Parvati escorted by caparisoned elephants, dancers, folk drummers, and brass bands through the Pink City.",
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80"
  }
];

export const LANGUAGE_LESSONS = [
  {
    id: "lang-raj",
    language: "Rajasthani (Marwari)",
    region: "Jaipur & Western Rajasthan",
    script: "Devanagari script",
    intro: "Learn warm desert greetings to interact with local craftsmen and elders with utmost respect.",
    phrases: [
      { english: "Hello / Respectful Greeting", local: "খম্মা ঘণী (Khamma Ghani)", phonetic: "Kham-ma Gha-nee", response: "Ghani Khamma!", audioText: "Khamma Ghani" },
      { english: "How much does this craft cost?", local: "इण री कित्ता रुपया लागसी? (In ri kitta rupya laagsi?)", phonetic: "In ree kit-ta rup-ya laag-see?", audioText: "In ri kitta rupya laagsi" },
      { english: "This is very beautiful", local: "ओ घणो फूटरो है (O ghano footro hai)", phonetic: "O gha-no foo-tro hai", audioText: "O ghano footro hai" },
      { english: "Thank you very much", local: "घणो घणो आभार (Ghano ghano aabhar)", phonetic: "Gha-no gha-no aa-bhaar", audioText: "Ghano ghano aabhar" }
    ],
    quiz: {
      question: "What is the traditional Marwari response to 'Khamma Ghani'?",
      options: ["Namaste", "Ghani Khamma!", "Dhanyawad", "Shukriya"],
      answer: "Ghani Khamma!"
    }
  },
  {
    id: "lang-tam",
    language: "Tamil",
    region: "Madurai & Tamil Nadu",
    script: "Tamil Script",
    intro: "Master classical Dravidian phrases for shopping in Madurai bazaars and dining.",
    phrases: [
      { english: "Welcome / Hello", local: "வணக்கம் (Vanakkam)", phonetic: "Va-nak-kam", response: "Vanakkam!", audioText: "Vanakkam" },
      { english: "How much is this saree?", local: "இந்த புடவை என்ன விலை? (Indha pudavai enna vilai?)", phonetic: "In-dha pu-da-vai en-na vi-lai?", audioText: "Indha pudavai enna vilai" },
      { english: "The food is delicious", local: "உணவு மிகவும் சுவையாக உள்ளது (Unavu migavum suvaiyaga ulladhu)", phonetic: "U-na-vu mi-ga-vum su-vai-ya-ga ul-la-dhu", audioText: "Unavu migavum suvaiyaga ulladhu" },
      { english: "Thank you", local: "நன்றி (Nandri)", phonetic: "Nan-dri", audioText: "Nandri" }
    ],
    quiz: {
      question: "How do you say 'Thank you' in Tamil?",
      options: ["Nandri", "Vanakkam", "Aabhar", "Dhanyawad"],
      answer: "Nandri"
    }
  },
  {
    id: "lang-ben",
    language: "Bengali (Bangla)",
    region: "Kolkata & West Bengal",
    script: "Bengali Script",
    intro: "Learn poetic Bengali phrases for exploring heritage terracotta temples and sweet shops.",
    phrases: [
      { english: "Hello", local: "নমস্কার (Nomoshkar)", phonetic: "No-mosh-kar", audioText: "Nomoshkar" },
      { english: "Where can I buy authentic crafts?", local: "খাঁটি হস্তশিল্প কোথায় পাব? (Khati hostoshilpo kothay pabo?)", phonetic: "Kha-ti hos-to-shil-po ko-thay pa-bo?", audioText: "Khati hostoshilpo kothay pabo" },
      { english: "This sweet is extraordinary", local: "এই মিষ্টিটা খুব দারুণ (Ei mishtita khub darun)", phonetic: "Ei mish-ti-ta khub da-run", audioText: "Ei mishtita khub darun" }
    ],
    quiz: {
      question: "Which word means 'Sweet' in Bengali?",
      options: ["Paan", "Mishti", "Ghevar", "Rosogolla"],
      answer: "Mishti"
    }
  }
];

export const COMMUNITY_POSTS = [
  {
    id: "post-1",
    author: "Aditi Sen",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    location: "Bagru Village, Jaipur",
    title: "A Quiet Afternoon in Master Ramprasad's Indigo Yard",
    date: "August 2, 2026",
    content: "Watching wooden blocks pressed into mud-resist paste before dipping into deep subterranean indigo vats was a spiritual experience. The scent of sun-baked earth and natural dyes fills the village air...",
    image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80",
    likes: 48,
    comments: [
      { user: "Vikram R.", text: "Did you get to try carved teakwood stamping yourself?" }
    ]
  },
  {
    id: "post-2",
    author: "Kabir Malhotra",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    location: "Madanpura, Varanasi",
    title: "Listening to Pit-Loom Rhythm under the Ghats",
    date: "July 29, 2026",
    content: "Navigating Varanasi's narrow lanes led me to Ustad Mukhtar's workshop. Two brothers move gold threads across silk warps with synchronized mastery that takes decades to master...",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    likes: 62,
    comments: []
  }
];
