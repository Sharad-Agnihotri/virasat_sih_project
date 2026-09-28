// ============================================================
// budget-data.js — Shared destination table for the Budget Planner
//
// The planner is embedded in six pages, and each used to carry its own
// copy of a six-city list. This is the single source: one flagship
// heritage destination for every state and major union territory. Any
// page that includes this script gets its #budgetCitySelect populated
// automatically, grouped by region.
//
// Pages that keep a local `CITIES_BUDGET_DATA` should alias it:
//     const CITIES_BUDGET_DATA = window.VIRASAT_BUDGET_CITIES;
// ============================================================

/* One flagship heritage destination for every state and major union
   territory, grouped by region. `cost` is a relative price index (Jaipur
   = 1.0) — Goa, Leh and Port Blair run dearer than Hampi or Bodh Gaya. */
window.VIRASAT_BUDGET_CITIES = {
  // ── North ──
  jaipur:      { name: "Jaipur",       state: "Rajasthan",           region: "North", cost: 1.00, places: "Amber Fort, Hawa Mahal, City Palace, Panna Meena Kund" },
  jodhpur:     { name: "Jodhpur",      state: "Rajasthan",           region: "North", cost: 0.95, places: "Mehrangarh Fort, Umaid Bhawan, Jaswant Thada, Clock Tower bazaar" },
  udaipur:     { name: "Udaipur",      state: "Rajasthan",           region: "North", cost: 1.10, places: "City Palace, Lake Pichola, Jag Mandir, Sajjangarh" },
  delhi:       { name: "Delhi",        state: "Delhi",               region: "North", cost: 1.15, places: "Red Fort, Qutub Minar, Humayun's Tomb, Jama Masjid" },
  agra:        { name: "Agra",         state: "Uttar Pradesh",       region: "North", cost: 1.00, places: "Taj Mahal, Agra Fort, Fatehpur Sikri, Mehtab Bagh" },
  varanasi:    { name: "Varanasi",     state: "Uttar Pradesh",       region: "North", cost: 0.85, places: "Dashashwamedh Ghat, Kashi Vishwanath, Sarnath, Manikarnika Ghat" },
  lucknow:     { name: "Lucknow",      state: "Uttar Pradesh",       region: "North", cost: 0.90, places: "Bara Imambara, Rumi Darwaza, Residency, Chowk" },
  srinagar:    { name: "Srinagar",     state: "Jammu & Kashmir",     region: "North", cost: 1.20, places: "Dal Lake, Shalimar Bagh, Pari Mahal, Jamia Masjid" },
  leh:         { name: "Leh",          state: "Ladakh",              region: "North", cost: 1.25, places: "Leh Palace, Thiksey Monastery, Shanti Stupa, Hemis" },
  amritsar:    { name: "Amritsar",     state: "Punjab",              region: "North", cost: 0.90, places: "Golden Temple, Jallianwala Bagh, Wagah Border, Gobindgarh Fort" },
  chandigarh:  { name: "Chandigarh",   state: "Chandigarh",          region: "North", cost: 1.00, places: "Rock Garden, Capitol Complex, Sukhna Lake, Rose Garden" },
  kurukshetra: { name: "Kurukshetra",  state: "Haryana",             region: "North", cost: 0.80, places: "Brahma Sarovar, Jyotisar, Sheikh Chilli's Tomb, Panorama" },
  shimla:      { name: "Shimla",       state: "Himachal Pradesh",    region: "North", cost: 1.10, places: "Viceregal Lodge, The Ridge, Christ Church, Jakhoo Temple" },
  haridwar:    { name: "Haridwar & Rishikesh", state: "Uttarakhand", region: "North", cost: 0.85, places: "Har Ki Pauri, Ganga Aarti, Lakshman Jhula, Beatles Ashram" },
  // ── West ──
  kutch:       { name: "Kutch",        state: "Gujarat",             region: "West",  cost: 0.95, places: "White Rann, Dhordo Village, Prag Mahal, Kala Dungar" },
  ahmedabad:   { name: "Ahmedabad",    state: "Gujarat",             region: "West",  cost: 0.90, places: "Sabarmati Ashram, Adalaj Stepwell, Sidi Saiyyed Mosque, Pols" },
  mumbai:      { name: "Mumbai",       state: "Maharashtra",         region: "West",  cost: 1.35, places: "Gateway of India, Elephanta Caves, CST, Kanheri Caves" },
  aurangabad:  { name: "Aurangabad",   state: "Maharashtra",         region: "West",  cost: 0.90, places: "Ajanta Caves, Ellora Caves, Bibi Ka Maqbara, Daulatabad Fort" },
  goa:         { name: "Old Goa",      state: "Goa",                 region: "West",  cost: 1.20, places: "Basilica of Bom Jesus, Se Cathedral, Fontainhas, Chapora Fort" },
  // ── Central ──
  khajuraho:   { name: "Khajuraho",    state: "Madhya Pradesh",      region: "Central", cost: 0.90, places: "Western Group temples, Kandariya Mahadev, Raneh Falls, Panna" },
  bhopal:      { name: "Bhopal & Sanchi", state: "Madhya Pradesh",   region: "Central", cost: 0.85, places: "Sanchi Stupa, Bhimbetka rock shelters, Taj-ul-Masajid, Bhojpur" },
  raipur:      { name: "Raipur & Sirpur", state: "Chhattisgarh",     region: "Central", cost: 0.80, places: "Sirpur Laxman Temple, Bhoramdeo, Purkhouti Muktangan, Chitrakote" },
  // ── East ──
  kolkata:     { name: "Kolkata",      state: "West Bengal",         region: "East",  cost: 1.00, places: "Victoria Memorial, Howrah Bridge, Dakshineswar, Kumartuli" },
  bhubaneswar: { name: "Bhubaneswar & Puri", state: "Odisha",        region: "East",  cost: 0.85, places: "Lingaraj Temple, Konark Sun Temple, Jagannath Puri, Udayagiri Caves" },
  bodhgaya:    { name: "Bodh Gaya & Nalanda", state: "Bihar",        region: "East",  cost: 0.75, places: "Mahabodhi Temple, Nalanda ruins, Rajgir, Vishnupad" },
  ranchi:      { name: "Ranchi & Deoghar", state: "Jharkhand",       region: "East",  cost: 0.75, places: "Baidyanath Dham, Hundru Falls, Jagannath Temple Ranchi, Netarhat" },
  // ── North-East ──
  guwahati:    { name: "Guwahati",     state: "Assam",               region: "North-East", cost: 0.90, places: "Kamakhya Temple, Sivasagar Ahom sites, Majuli, Kaziranga" },
  shillong:    { name: "Shillong",     state: "Meghalaya",           region: "North-East", cost: 0.95, places: "Living Root Bridges, Mawlynnong, Ward's Lake, Don Bosco Museum" },
  gangtok:     { name: "Gangtok",      state: "Sikkim",              region: "North-East", cost: 1.05, places: "Rumtek Monastery, Tsomgo Lake, Pelling, Enchey Monastery" },
  tawang:      { name: "Tawang",       state: "Arunachal Pradesh",   region: "North-East", cost: 1.10, places: "Tawang Monastery, Sela Pass, Bomdila, Bum La" },
  imphal:      { name: "Imphal",       state: "Manipur",             region: "North-East", cost: 0.85, places: "Kangla Fort, Loktak Lake, Ima Keithel market, Shree Govindajee" },
  kohima:      { name: "Kohima",       state: "Nagaland",            region: "North-East", cost: 0.90, places: "Kisama Heritage Village, WWII Cemetery, Khonoma, Dzukou Valley" },
  aizawl:      { name: "Aizawl",       state: "Mizoram",             region: "North-East", cost: 0.85, places: "Solomon's Temple, Reiek, Durtlang Hills, Mizoram State Museum" },
  agartala:    { name: "Agartala",     state: "Tripura",             region: "North-East", cost: 0.80, places: "Ujjayanta Palace, Neermahal, Unakoti, Tripura Sundari" },
  // ── South ──
  hampi:       { name: "Hampi",        state: "Karnataka",           region: "South", cost: 0.85, places: "Virupaksha Temple, Stone Chariot, Elephant Stables, Matanga Hill" },
  mysuru:      { name: "Mysuru",       state: "Karnataka",           region: "South", cost: 0.95, places: "Mysore Palace, Chamundi Hill, Srirangapatna, Devaraja Market" },
  madurai:     { name: "Madurai",      state: "Tamil Nadu",          region: "South", cost: 0.85, places: "Meenakshi Amman Temple, Thirumalai Nayakkar Palace, Gandhi Museum" },
  thanjavur:   { name: "Thanjavur",    state: "Tamil Nadu",          region: "South", cost: 0.85, places: "Brihadeeswarar Temple, Saraswathi Mahal, Gangaikonda Cholapuram" },
  mahabalipuram: { name: "Mahabalipuram", state: "Tamil Nadu",       region: "South", cost: 0.95, places: "Shore Temple, Pancha Rathas, Arjuna's Penance, Krishna's Butterball" },
  kochi:       { name: "Kochi",        state: "Kerala",              region: "South", cost: 1.05, places: "Fort Kochi, Mattancherry Palace, Jewish Synagogue, Chinese fishing nets" },
  hyderabad:   { name: "Hyderabad",    state: "Telangana",           region: "South", cost: 1.05, places: "Charminar, Golconda Fort, Qutb Shahi Tombs, Chowmahalla" },
  warangal:    { name: "Warangal",     state: "Telangana",           region: "South", cost: 0.80, places: "Warangal Fort, Thousand Pillar Temple, Ramappa Temple, Bhadrakali" },
  tirupati:    { name: "Tirupati & Amaravati", state: "Andhra Pradesh", region: "South", cost: 0.90, places: "Tirumala, Chandragiri Fort, Amaravati Stupa, Lepakshi" },
  puducherry:  { name: "Puducherry",   state: "Puducherry",          region: "South", cost: 1.00, places: "French Quarter, Auroville, Sri Aurobindo Ashram, Promenade" },
  portblair:   { name: "Port Blair",   state: "Andaman & Nicobar",   region: "South", cost: 1.30, places: "Cellular Jail, Ross Island, Havelock, Chatham Saw Mill" }
};

/* Build the destination <select> from the data so the list and the
   calculation can never drift apart, grouped by region for scanning. */
function buildBudgetCityOptions() {
  const sel = document.getElementById('budgetCitySelect');
  if (!sel || sel.dataset.noAutofill !== undefined) return;
  const previous = sel.value;
  const groups = {};
  Object.entries(window.VIRASAT_BUDGET_CITIES).forEach(([key, c]) => {
    (groups[c.region] = groups[c.region] || []).push([key, c]);
  });
  sel.innerHTML = '';
  ['North', 'West', 'Central', 'East', 'North-East', 'South'].forEach(region => {
    if (!groups[region]) return;
    const og = document.createElement('optgroup');
    og.label = region + ' India';
    groups[region]
      .sort((a, b) => a[1].state.localeCompare(b[1].state) || a[1].name.localeCompare(b[1].name))
      .forEach(([key, c]) => {
        const o = document.createElement('option');
        o.value = key;
        o.textContent = c.name + ' (' + c.state + ')';
        og.appendChild(o);
      });
    sel.appendChild(og);
  });
  sel.value = window.VIRASAT_BUDGET_CITIES[previous] ? previous : 'jaipur';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', buildBudgetCityOptions);
} else {
  buildBudgetCityOptions();
}
