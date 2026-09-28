// ============================================================
// gaze-narrator.js — "look at it and the guide explains it"
//
// Every 150 ms the camera's look direction is mapped back to the
// panorama image (u = 0..1 left→right, v = 0..1 top→bottom). Each
// monument lists the sections of its panorama as u/v bands. When the
// visitor's gaze settles on a band for a moment, the voice guide
// narrates that section and a caption names it. A section is not
// repeated until the visitor has looked away from it.
//
// Sections are authored in IMAGE space, so they stay correct no matter
// which viewpoint (sky rotation) the visitor entered from.
// ============================================================

const GAZE_SECTIONS = {
  'taj-mahal': [
    { id: 'mausoleum', u: [0.40, 0.60], v: [0.20, 0.52], label: 'The Mausoleum',
      en: 'Straight ahead is the mausoleum itself: pure white Makrana marble on a raised plinth, crowned by the great onion dome, thirty-five metres high and topped with a gilded finial. Look closely at the arched iwan in the centre — it is framed with black calligraphy from the Quran, sized so the letters look even from the ground.',
      hi: 'सामने स्वयं मक़बरा है — ऊँचे चबूतरे पर सफ़ेद मकराना संगमरमर, जिसके ऊपर पैंतीस मीटर ऊँचा विशाल प्याज़ के आकार का गुंबद है। बीच के मेहराब पर क़ुरान की काली नक़्क़ाशी देखिए — अक्षर ऐसे नापे गए हैं कि नीचे से एक समान दिखें।' },
    { id: 'minarets', u: [0.32, 0.40], v: [0.22, 0.50], label: 'The Minarets',
      en: 'The four minarets stand just over forty metres tall. They lean very slightly outward — a deliberate safeguard, so that in an earthquake they would fall away from the tomb rather than onto it.',
      hi: 'चारों मीनारें लगभग चालीस मीटर ऊँची हैं और थोड़ा बाहर की ओर झुकी हैं — ताकि भूकंप में वे मक़बरे पर नहीं, बाहर की ओर गिरें।' },
    { id: 'minarets-r', u: [0.60, 0.68], v: [0.22, 0.50], label: 'The Minarets',
      en: 'Each minaret has three balconies and a small domed chhatri on top. They were used to call the faithful to prayer at the mosque beside the tomb.',
      hi: 'हर मीनार में तीन छज्जे और ऊपर एक छोटी गुंबददार छतरी है। इनसे पास की मस्जिद में नमाज़ की अज़ान दी जाती थी।' },
    { id: 'mosque', u: [0.02, 0.22], v: [0.28, 0.50], label: 'The Mosque',
      en: 'To the west stands the red sandstone mosque. It faces Mecca and is still used for Friday prayers, which is why the Taj is closed to visitors on Fridays.',
      hi: 'पश्चिम में लाल बलुआ पत्थर की मस्जिद है। यह मक्का की ओर है और आज भी जुमे की नमाज़ यहाँ होती है, इसीलिए शुक्रवार को ताज बंद रहता है।' },
    { id: 'jawab', u: [0.78, 0.98], v: [0.28, 0.50], label: 'The Jawab (Guest House)',
      en: 'On the east side is the Jawab — literally "the answer". It mirrors the mosque exactly so the whole complex stays symmetrical, but it was never a place of prayer; it served as a guest house.',
      hi: 'पूर्व की ओर "जवाब" है — मस्जिद की हूबहू प्रतिकृति, ताकि पूरा परिसर सममित रहे। यह इबादतगाह नहीं, मेहमानख़ाना था।' },
    { id: 'reflecting-pool', u: [0.38, 0.62], v: [0.55, 0.95], label: 'The Reflecting Pool',
      en: 'Below you runs the long reflecting pool, lined with cypress trees that symbolise death, and fruit trees that symbolise life. At dawn the dome appears twice — once in marble, once in water.',
      hi: 'नीचे लंबा प्रतिबिंब-कुंड है, जिसके किनारे मृत्यु के प्रतीक सरो और जीवन के प्रतीक फलदार पेड़ हैं। भोर में गुंबद दो बार दिखता है — एक संगमरमर में, एक पानी में।' },
    { id: 'charbagh-l', u: [0.02, 0.36], v: [0.52, 0.98], label: 'Charbagh Gardens',
      en: 'These lawns are the Charbagh — the Persian four-part paradise garden. Raised walkways and water channels divide it into quarters, each once planted with roses, daffodils and fruit trees.',
      hi: 'ये लॉन चारबाग़ हैं — फ़ारसी शैली का चार भागों वाला स्वर्ग-उद्यान। ऊँचे रास्ते और नहरें इसे चार हिस्सों में बाँटती हैं।' },
    { id: 'charbagh-r', u: [0.64, 0.98], v: [0.52, 0.98], label: 'Charbagh Gardens',
      en: 'The gardens were originally far lusher than the British-era lawns you see today — a dense orchard where the tomb would appear to float above the trees.',
      hi: 'मूल बाग़ आज के लॉन से कहीं घने थे — एक बग़ीचा जिसके ऊपर मक़बरा तैरता सा दिखता था।' },
    { id: 'sky', u: [0.0, 1.0], v: [0.0, 0.2], label: 'Agra Sky',
      en: 'The Taj changes colour with the sky above it — pink at dawn, dazzling white at noon, and gold in the evening light.',
      hi: 'आसमान के साथ ताज का रंग बदलता है — भोर में गुलाबी, दोपहर में चमकता सफ़ेद, और शाम में सुनहरा।' }
  ],

  'hampi': [
    { id: 'gopuram', u: [0.40, 0.58], v: [0.22, 0.42], label: 'The Gopuram',
      en: 'The tall tiered tower ahead is the gopuram, the gateway of the Vittala Temple. Every tier is crowded with carved deities, dancers and mythical beasts, once brightly painted.',
      hi: 'सामने ऊँचा तहदार गोपुरम है — विट्ठल मंदिर का प्रवेशद्वार। हर तह पर देवता, नर्तक और पौराणिक जीव उकेरे गए हैं।' },
    { id: 'chariot', u: [0.42, 0.58], v: [0.42, 0.70], label: 'The Stone Chariot',
      en: 'This is the famous Stone Chariot, a shrine to Garuda carved to look like a single block, though it is built of many granite pieces so well joined the seams vanish. The wheels once turned — you will find it on the fifty-rupee note.',
      hi: 'यह प्रसिद्ध पत्थर का रथ है — गरुड़ का मंदिर, जो एक ही पत्थर सा दिखता है पर कई ग्रेनाइट खंडों से बना है। इसके पहिये कभी घूमते थे — यह पचास रुपये के नोट पर भी है।' },
    { id: 'mandapa-l', u: [0.0, 0.30], v: [0.30, 0.65], label: 'Kalyana Mandapa',
      en: 'The pillared hall on your left is a mandapa used for ceremonies and royal weddings. Each pillar is carved from a single granite block into clusters of slender columns.',
      hi: 'बाईं ओर स्तंभों वाला मंडप है, जहाँ उत्सव और राजसी विवाह होते थे। हर स्तंभ एक ही ग्रेनाइट खंड से तराशा गया है।' },
    { id: 'mandapa-r', u: [0.72, 1.0], v: [0.30, 0.65], label: 'The Musical Pillars',
      en: 'To your right stands the Maha Mandapa with its famous musical pillars — fifty-six slender columns that ring with different notes when tapped. The British once cut two open to find the secret; they found only solid stone.',
      hi: 'दाईं ओर महामंडप है, जिसके छप्पन संगीत-स्तंभ थपथपाने पर अलग-अलग स्वर देते हैं। अंग्रेज़ों ने रहस्य जानने के लिए दो स्तंभ काटे — अंदर सिर्फ़ ठोस पत्थर मिला।' },
    { id: 'courtyard', u: [0.25, 0.75], v: [0.70, 1.0], label: 'The Temple Courtyard',
      en: 'The granite courtyard was the heart of Vijayanagara\'s greatest temple. In the sixteenth century the empire\'s capital here was one of the largest cities in the world, richer than Rome.',
      hi: 'यह ग्रेनाइट आँगन विजयनगर के सबसे बड़े मंदिर का हृदय था। सोलहवीं सदी में यह राजधानी दुनिया के सबसे बड़े शहरों में थी।' },
    { id: 'boulders', u: [0.0, 0.42], v: [0.0, 0.30], label: 'The Boulder Hills',
      en: 'Those giant boulders are among the oldest rocks on Earth — the landscape that gave Hampi its natural fortress walls.',
      hi: 'ये विशाल चट्टानें पृथ्वी की सबसे पुरानी चट्टानों में हैं — जिन्होंने हम्पी को प्राकृतिक क़िला दिया।' }
  ],

  'mysore-palace': [
    { id: 'tower', u: [0.44, 0.56], v: [0.22, 0.42], label: 'The Central Tower',
      en: 'The five-storey central tower rises forty-four metres and is capped with a gilded dome. Beneath it sits the Durbar Hall where the Wadiyar kings held court on the golden throne.',
      hi: 'पाँच मंज़िला मध्य मीनार चवालीस मीटर ऊँची है और सोने के गुंबद से ढकी है। इसके नीचे दरबार हॉल है जहाँ वाडियार राजा स्वर्ण सिंहासन पर दरबार लगाते थे।' },
    { id: 'domes-l', u: [0.10, 0.30], v: [0.28, 0.50], label: 'The Domed Towers',
      en: 'The deep-red domes are Indo-Saracenic — a blend of Hindu, Mughal, Rajput and Gothic ideas that the British architect Henry Irwin combined after the old wooden palace burned down in 1897.',
      hi: 'गहरे लाल गुंबद इंडो-सारासेनिक शैली के हैं — हिंदू, मुग़ल, राजपूत और गोथिक का मेल, जिसे वास्तुकार हेनरी इरविन ने 1897 की आग के बाद बनाया।' },
    { id: 'domes-r', u: [0.70, 0.90], v: [0.28, 0.50], label: 'The Domed Towers',
      en: 'The matching towers on the right hold the palace\'s private wing, where descendants of the royal family still live today.',
      hi: 'दाईं ओर की मीनारों में महल का निजी भाग है, जहाँ आज भी राजपरिवार के वंशज रहते हैं।' },
    { id: 'facade', u: [0.28, 0.72], v: [0.40, 0.60], label: 'The Illuminated Facade',
      en: 'Ninety-seven thousand bulbs outline the facade. They are lit every Sunday evening and through the ten nights of Dasara, when the palace becomes a lantern for the whole city.',
      hi: 'सत्तानवे हज़ार बल्ब इस अग्रभाग को रेखांकित करते हैं। हर रविवार शाम और दशहरे की दस रातों में ये जलते हैं।' },
    { id: 'gardens', u: [0.0, 1.0], v: [0.60, 1.0], label: 'The Palace Gardens',
      en: 'The forecourt and lawns host the Dasara procession each October, when a caparisoned elephant carries the golden howdah of the goddess Chamundeshwari from these gates.',
      hi: 'हर अक्टूबर दशहरे की शोभायात्रा इन्हीं बग़ीचों से निकलती है, जब सजा हुआ हाथी देवी चामुंडेश्वरी का स्वर्ण हौदा ले जाता है।' }
  ],

  'gateway-of-india': [
    { id: 'arch', u: [0.38, 0.62], v: [0.34, 0.60], label: 'The Arch',
      en: 'The Gateway is built of yellow basalt in the Indo-Saracenic style. Its central dome is fifteen metres across and twenty-six metres high. Completed in 1924, it was meant to welcome viceroys arriving by sea.',
      hi: 'गेटवे पीले बेसाल्ट से इंडो-सारासेनिक शैली में बना है। इसका गुंबद पंद्रह मीटर चौड़ा और छब्बीस मीटर ऊँचा है। 1924 में बना यह समुद्र से आते वायसरायों के स्वागत के लिए था।' },
    { id: 'taj-hotel', u: [0.0, 0.20], v: [0.22, 0.50], label: 'Taj Mahal Palace Hotel',
      en: 'On the left, with the red dome, is the Taj Mahal Palace Hotel, opened in 1903 — twenty years before the Gateway. Legend says its founder Jamsetji Tata built it after being turned away from a whites-only hotel.',
      hi: 'बाईं ओर लाल गुंबद वाला ताज महल पैलेस होटल है, जो 1903 में खुला — गेटवे से बीस साल पहले। कहते हैं जमशेदजी टाटा ने इसे एक होटल से लौटाए जाने के बाद बनवाया।' },
    { id: 'harbour', u: [0.62, 1.0], v: [0.30, 0.75], label: 'Mumbai Harbour',
      en: 'The Arabian Sea and Mumbai harbour lie to the right. From these steps the last British troops left India in February 1948, and today ferries leave for the rock-cut caves of Elephanta Island.',
      hi: 'दाईं ओर अरब सागर और मुंबई बंदरगाह है। इन्हीं सीढ़ियों से फ़रवरी 1948 में अंतिम ब्रिटिश सैनिक भारत से गए, और आज यहाँ से एलिफेंटा की गुफाओं के लिए नावें चलती हैं।' },
    { id: 'plaza', u: [0.05, 0.75], v: [0.60, 1.0], label: 'Apollo Bunder Plaza',
      en: 'The plaza is Mumbai\'s busiest meeting place — photographers, balloon sellers and street food, with the city\'s skyline rising behind.',
      hi: 'यह चौक मुंबई की सबसे व्यस्त मिलन-स्थली है — फ़ोटोग्राफ़र, गुब्बारे वाले और स्ट्रीट फ़ूड, पीछे शहर की गगनचुंबी इमारतें।' },
    { id: 'skyline', u: [0.15, 0.60], v: [0.28, 0.40], label: 'The Colaba Skyline',
      en: 'Behind the Gateway rise the towers of Colaba and Nariman Point — the modern city that grew from seven fishing islands.',
      hi: 'गेटवे के पीछे कोलाबा और नरीमन पॉइंट की इमारतें हैं — सात मछुआरा द्वीपों से बना आधुनिक शहर।' }
  ],

  'red-fort': [
    { id: 'lahori-gate', u: [0.40, 0.60], v: [0.28, 0.62], label: 'Lahori Gate',
      en: 'This is the Lahori Gate, the fort\'s main entrance, named because it faces Lahore. Above it flies the tricolour — every Independence Day since 1947 the Prime Minister has raised the flag from this rampart.',
      hi: 'यह लाहौरी दरवाज़ा है — क़िले का मुख्य प्रवेश, जो लाहौर की ओर है। ऊपर तिरंगा लहराता है — 1947 से हर स्वतंत्रता दिवस पर प्रधानमंत्री यहीं से ध्वज फहराते हैं।' },
    { id: 'walls-l', u: [0.05, 0.38], v: [0.42, 0.58], label: 'The Ramparts',
      en: 'The red sandstone walls run for over two kilometres and rise up to thirty-three metres on the river side. They gave the fort its name — Lal Qila, the Red Fort.',
      hi: 'लाल बलुआ पत्थर की दीवारें दो किलोमीटर से लंबी और नदी की ओर तैंतीस मीटर तक ऊँची हैं। इन्हीं से इसका नाम पड़ा — लाल क़िला।' },
    { id: 'walls-r', u: [0.62, 0.95], v: [0.42, 0.58], label: 'The Ramparts',
      en: 'Behind these walls Shah Jahan built a city within a city — marble palaces, the Hall of Public Audience, and the Peacock Throne that once held the Koh-i-Noor.',
      hi: 'इन दीवारों के पीछे शाहजहाँ ने शहर के भीतर शहर बसाया — संगमरमर के महल, दीवान-ए-आम, और मयूर सिंहासन जिसमें कभी कोहिनूर जड़ा था।' },
    { id: 'chhatris', u: [0.33, 0.67], v: [0.26, 0.40], label: 'The Chhatris',
      en: 'The domed pavilions along the gate are chhatris, a Rajput touch on a Mughal fort — Shah Jahan\'s architects blended both traditions.',
      hi: 'द्वार पर गुंबददार छतरियाँ राजपूत शैली की हैं — शाहजहाँ के वास्तुकारों ने दोनों परंपराओं को मिलाया।' },
    { id: 'forecourt', u: [0.0, 1.0], v: [0.62, 1.0], label: 'The Forecourt',
      en: 'The open forecourt was once a moat and the Chhatta Chowk bazaar lay just inside the gate, where the court bought silks, jewels and perfumes.',
      hi: 'यह खुला प्रांगण कभी खाई थी, और दरवाज़े के भीतर छत्ता चौक बाज़ार था, जहाँ दरबार रेशम, जवाहरात और इत्र ख़रीदता था।' }
  ]
};

class GazeNarrator {
  constructor() {
    this.sections = [];
    this.monumentId = null;
    this.enabled = true;          // captions always; speech follows voiceGuide.isEnabled
    this.candidate = null;        // section under the gaze right now
    this.candidateSince = 0;
    this.spoken = null;           // last section narrated (not repeated until gaze leaves)
    this.dwellMs = 650;
    this.timer = null;
    this.onGaze = null;           // callback(section|null) for the caption
    this._dir = null;
    this._m3 = null;
    this._inv = null;
  }

  init() {
    this.camera = document.getElementById('main-camera');
    this.sky = document.getElementById('panorama-sky');
    this.caption = document.getElementById('gaze-caption');
    if (!this.caption) {
      this.caption = document.createElement('div');
      this.caption.id = 'gaze-caption';
      document.body.appendChild(this.caption);
    }
    clearInterval(this.timer);
    this.timer = setInterval(() => this.tick(), 150);
  }

  setMonument(monumentId) {
    this.monumentId = monumentId;
    this.sections = GAZE_SECTIONS[monumentId] || [];
    this.candidate = null;
    this.spoken = null;
    this._showCaption(null);
  }

  /* Reset "already told" memory, e.g. when the voice guide is switched on. */
  forget() { this.spoken = null; }

  /* Where in the panorama image is the centre of the screen looking?
     Returns { u, v } in image space, or null before the scene is ready. */
  lookUV() {
    if (!window.THREE || !this.camera || !this.sky) return null;
    const cam = this.camera.object3D, sky = this.sky.object3D;
    if (!cam || !sky) return null;
    this._dir = this._dir || new THREE.Vector3();
    this._inv = this._inv || new THREE.Matrix4();
    this._m3 = this._m3 || new THREE.Matrix3();

    cam.getWorldDirection(this._dir);
    // Into the sphere's local space (undoes the sky rotation and the
    // a-sky "-1 1 1" mirror), then invert THREE's SphereGeometry mapping:
    //   x = -cos(phi)·sin(theta), y = cos(theta), z = sin(phi)·sin(theta)
    //   u = phi / 2π,  v(top=0) = theta / π
    this._inv.copy(sky.matrixWorld).invert();
    this._m3.setFromMatrix4(this._inv);
    const d = this._dir.applyMatrix3(this._m3).normalize();
    const phi = Math.atan2(d.z, -d.x);
    // +0.5: the sphere's UV seam sits behind the image centre (verified
    // against rendered frames — no mirroring, a constant half turn).
    const u = ((phi / (2 * Math.PI) + 0.5) % 1 + 1) % 1;
    const v = Math.acos(Math.max(-1, Math.min(1, d.y))) / Math.PI;
    return { u, v };
  }

  _sectionAt(uv) {
    if (!uv) return null;
    // Most specific (smallest) band wins when bands overlap.
    let best = null, bestArea = Infinity;
    for (const s of this.sections) {
      const [u0, u1] = s.u, [v0, v1] = s.v || [0, 1];
      if (uv.u >= u0 && uv.u <= u1 && uv.v >= v0 && uv.v <= v1) {
        const area = (u1 - u0) * (v1 - v0);
        if (area < bestArea) { best = s; bestArea = area; }
      }
    }
    return best;
  }

  tick() {
    if (!this.enabled || !this.sections.length) return;
    if (window.panoramaManager && panoramaManager.isTransitioning) return;
    const sec = this._sectionAt(this.lookUV());
    const now = performance.now();

    if (sec !== this.candidate) {
      this.candidate = sec;
      this.candidateSince = now;
      if (!sec) this._showCaption(null);
      // Looking somewhere new: the previous section may be told again later.
      if (sec && this.spoken && sec.id !== this.spoken.id) this.spoken = null;
      return;
    }
    if (!sec || now - this.candidateSince < this.dwellMs) return;
    if (this.spoken && this.spoken.id === sec.id) return;

    this.spoken = sec;
    this._showCaption(sec);
    if (this.onGaze) this.onGaze(sec);
  }

  textFor(sec) {
    const hi = typeof getCurrentLanguage === 'function' && getCurrentLanguage() === 'hi';
    return (hi && sec.hi) ? sec.hi : sec.en;
  }

  _showCaption(sec) {
    if (!this.caption) return;
    if (!sec) { this.caption.classList.remove('show'); return; }
    this.caption.innerHTML = `<span class="gaze-eye">👁</span> ${sec.label}`;
    this.caption.classList.add('show');
  }
}

const gazeNarrator = new GazeNarrator();
