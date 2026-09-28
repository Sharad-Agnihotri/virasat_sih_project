import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Calculator, MessageSquare, Compass, DollarSign, Calendar, MapPin } from 'lucide-react';
import { CITIES_DATA } from '../data/mockData';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'budget'

  // Chat State
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Namaste! I am Virasat Mitr, your heritage companion. Ask me any doubt about Indian regions, monuments, crafts, or let me generate a personalized budget travel plan!'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef(null);

  // Budget Planner State
  const [budgetDestination, setBudgetDestination] = useState('jaipur');
  const [budgetDays, setBudgetDays] = useState(3);
  const [budgetTier, setBudgetTier] = useState('explorer'); // 'backpacker' | 'explorer' | 'luxury'
  const [generatedItinerary, setGeneratedItinerary] = useState(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendChat = (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (textToSend === inputText) setInputText('');

    // Simulate AI Intelligence Response based on Indian heritage data
    setTimeout(() => {
      let responseText = "India's heritage is deeply interconnected. ";
      const query = textToSend.toLowerCase();

      if (query.includes('jaipur') || query.includes('pottery') || query.includes('block')) {
        responseText = "Jaipur is renowned for Blue Pottery (crafted from quartz powder without clay) and Bagru hand block printing. Don't miss visiting Hawa Mahal and trying Dal Baati Churma!";
      } else if (query.includes('varanasi') || query.includes('silk') || query.includes('ghat')) {
        responseText = "Varanasi (Kashi) is ancient India's spiritual center. Known for Kadwa Banarasi Silk brocades with real silver/gold zari thread, morning boat rides on Dashashwamedh Ghat, and saffron Malaiyyo dessert!";
      } else if (query.includes('pashmina') || query.includes('srinagar') || query.includes('kashmir')) {
        responseText = "Authentic Kashmiri Pashmina is spun from high-altitude Changthangi goat fleece in Ladakh and needle-embroidered (Sozni) in Srinagar. Visit Dal Lake houseboats and enjoy Kahwa tea!";
      } else if (query.includes('madurai') || query.includes('temple') || query.includes('sungudi')) {
        responseText = "Madurai features the iconic Meenakshi Amman Temple with 14 colorful gopuram towers, micro tie-and-dye Sungudi sarees, and the famous Jigarthanda cooling beverage.";
      } else if (query.includes('food') || query.includes('eat') || query.includes('cuisine')) {
        responseText = "Every Indian region has unique heritage dishes! Try Dal Baati Churma in Jaipur, Litti Chokha in Bihar, Wazwan & Kahwa in Kashmir, and Jigarthanda in Madurai.";
      } else {
        responseText = `I would love to guide you! Regarding "${textToSend}", Indian regions preserve unique crafts, native languages, and sacred monuments. You can explore the Interactive Map or Monument Scanner to dive deeper!`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
    }, 600);
  };

  const handleGenerateBudget = (e) => {
    e.preventDefault();
    const city = CITIES_DATA.find(c => c.id === budgetDestination) || CITIES_DATA[0];
    
    let costPerDay = 3500;
    let tierName = "Heritage Explorer";
    if (budgetTier === 'backpacker') {
      costPerDay = 1800;
      tierName = "Nomad Backpacker";
    } else if (budgetTier === 'luxury') {
      costPerDay = 12000;
      tierName = "Royal Haveli Luxury";
    }

    const totalEstimate = costPerDay * budgetDays;
    const craftBudget = Math.round(totalEstimate * 0.25);
    const stayBudget = Math.round(totalEstimate * 0.40);
    const foodBudget = Math.round(totalEstimate * 0.20);
    const travelEntryBudget = Math.round(totalEstimate * 0.15);

    setGeneratedItinerary({
      city: city.name,
      state: city.state,
      days: budgetDays,
      tierName,
      totalEstimate,
      breakdown: {
        stay: stayBudget,
        crafts: craftBudget,
        food: foodBudget,
        transit: travelEntryBudget
      },
      highlights: city.placesToVisit.slice(0, budgetDays).map(p => p.name)
    });
  };

  return (
    <>
      {/* Floating Corner Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="ai-widget-button"
        >
          <Bot size={20} color="var(--accent-gold)" />
          <span>Virasat Assistant</span>
        </button>
      )}

      {/* Floating Chat & Budget Window */}
      {isOpen && (
        <div className="ai-chat-window">
          {/* Header */}
          <div style={{
            background: 'var(--text-main)',
            color: 'var(--bg-primary)',
            padding: '1rem 1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Bot size={20} color="var(--accent-gold)" />
              <div>
                <strong style={{ fontSize: '0.95rem', fontFamily: 'var(--font-serif)' }}>Virasat Mitr AI</strong>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#B5AFA6' }}>Regional Doubts & Budget Planner</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderBottom: '1px solid var(--border-light)',
            background: 'var(--bg-surface)'
          }}>
            <button
              onClick={() => setActiveTab('chat')}
              style={{
                padding: '0.6rem',
                border: 'none',
                background: activeTab === 'chat' ? '#FFF' : 'transparent',
                borderBottom: activeTab === 'chat' ? '2px solid var(--accent-terracotta)' : 'none',
                fontWeight: activeTab === 'chat' ? '600' : '400',
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <MessageSquare size={14} /> Regional Q&A
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              style={{
                padding: '0.6rem',
                border: 'none',
                background: activeTab === 'budget' ? '#FFF' : 'transparent',
                borderBottom: activeTab === 'budget' ? '2px solid var(--accent-terracotta)' : 'none',
                fontWeight: activeTab === 'budget' ? '600' : '400',
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <Calculator size={14} /> Budget Planner
            </button>
          </div>

          {/* TAB 1: REGIONAL Q&A CHAT */}
          {activeTab === 'chat' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {messages.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '82%',
                      background: m.sender === 'user' ? 'var(--text-main)' : 'var(--bg-surface)',
                      color: m.sender === 'user' ? '#FFF' : 'var(--text-main)',
                      padding: '0.75rem 1rem',
                      borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      fontSize: '0.86rem',
                      lineHeight: 1.5,
                      border: m.sender === 'user' ? 'none' : '1px solid var(--border-light)'
                    }}
                  >
                    {m.text}
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick suggestion prompt chips */}
              <div style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.4rem', overflowX: 'auto', borderTop: '1px solid var(--border-subtle)' }}>
                {['Blue Pottery in Jaipur?', 'Varanasi Silk?', 'Madurai Food?'].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendChat(chip)}
                    style={{
                      whiteSpace: 'nowrap',
                      fontSize: '0.74rem',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.25rem 0.6rem',
                      cursor: 'pointer'
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '0.5rem', background: '#FFF' }}>
                <input
                  type="text"
                  placeholder="Ask a doubt about any region..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  style={{ height: '40px', fontSize: '0.88rem' }}
                />
                <button
                  onClick={() => handleSendChat()}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--accent-terracotta)',
                    color: '#FFF',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SMART BUDGET PLANNER */}
          {activeTab === 'budget' && (
            <div style={{ padding: '1.2rem', overflowY: 'auto', flex: 1 }}>
              <form onSubmit={handleGenerateBudget} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', display: 'block', marginBottom: '0.3rem' }}>
                    Select Region / City:
                  </label>
                  <select 
                    value={budgetDestination} 
                    onChange={(e) => setBudgetDestination(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  >
                    {CITIES_DATA.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.state})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', display: 'block', marginBottom: '0.3rem' }}>
                      Duration (Days):
                    </label>
                    <input 
                      type="number" 
                      min={1} 
                      max={14} 
                      value={budgetDays}
                      onChange={(e) => setBudgetDays(Number(e.target.value))}
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', display: 'block', marginBottom: '0.3rem' }}>
                      Travel Style:
                    </label>
                    <select 
                      value={budgetTier} 
                      onChange={(e) => setBudgetTier(e.target.value)}
                      style={{ fontSize: '0.85rem' }}
                    >
                      <option value="backpacker">Backpacker</option>
                      <option value="explorer">Explorer</option>
                      <option value="luxury">Royal Luxury</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn-terracotta" style={{ justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}>
                  <Sparkles size={14} /> Calculate Cultural Budget
                </button>
              </form>

              {/* Generated Itinerary & Cost Result */}
              {generatedItinerary && (
                <div style={{
                  marginTop: '1.2rem',
                  padding: '1rem',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.84rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{generatedItinerary.city} ({generatedItinerary.days} Days)</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-terracotta)', fontWeight: '600' }}>{generatedItinerary.tierName}</span>
                  </div>

                  <div style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', marginBottom: '0.6rem' }}>
                    Est. Total: ₹{generatedItinerary.totalEstimate.toLocaleString('en-IN')}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                    <div>• Heritage Stay: ₹{generatedItinerary.breakdown.stay.toLocaleString('en-IN')}</div>
                    <div>• Local Craft & Artisan Shopping: ₹{generatedItinerary.breakdown.crafts.toLocaleString('en-IN')}</div>
                    <div>• Regional Cuisine & Dining: ₹{generatedItinerary.breakdown.food.toLocaleString('en-IN')}</div>
                    <div>• Monument Passes & Transit: ₹{generatedItinerary.breakdown.transit.toLocaleString('en-IN')}</div>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: '500' }}>
                    Key Spots Included: {generatedItinerary.highlights.join(', ')}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
