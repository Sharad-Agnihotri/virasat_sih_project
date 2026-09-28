import React, { useState, useEffect } from 'react';
import { Search, MapPin, Sparkles, Navigation, X, ExternalLink, ChevronRight, Heart, Utensils, Calendar, BookOpen, Users, Compass, Feather } from 'lucide-react';
import { CITIES_DATA } from '../data/mockData';

export default function ExploreMap({ onSelectCity, onSelectArtisanProduct, selectedCityId, setSelectedCityId }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [activeStoryTab, setActiveStoryTab] = useState('history');
  const [isZoomed, setIsZoomed] = useState(false);

  // Synchronize when selectedCityId changes externally
  useEffect(() => {
    if (selectedCityId) {
      const city = CITIES_DATA.find(c => c.id === selectedCityId);
      if (city) {
        setSelectedCity(city);
        setIsZoomed(true);
      }
    }
  }, [selectedCityId]);

  const filteredCities = CITIES_DATA.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    setSelectedCityId(city.id);
    setIsZoomed(true);
    if (onSelectCity) onSelectCity(city);
  };

  const handleCloseDetail = () => {
    setSelectedCity(null);
    setSelectedCityId(null);
    setIsZoomed(false);
  };

  return (
    <div className="container section-spacing">
      {/* Hero Storytelling Banner */}
      <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 3rem auto' }}>
        <span className="editorial-tag">Interactive Cultural Geography</span>
        <h1 style={{ margin: '0.75rem 0 1rem 0' }}>Explore India's Sacred Lands & Living Crafts</h1>
        <p className="text-lead">
          Select any historic region on the map or type a city to step into its living narrative — discovering century-old craft traditions, monuments, native flavors, and master artisans.
        </p>

        {/* Search Bar */}
        <div style={{
          position: 'relative',
          maxWidth: '560px',
          margin: '2rem auto 0 auto'
        }}>
          <Search style={{
            position: 'absolute',
            left: '1.2rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} size={20} />
          <input
            type="search"
            placeholder="Type a city or place (e.g. Jaipur, Varanasi, Srinagar, Madurai, Kutch)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: '3.2rem',
              paddingRight: '1rem',
              height: '56px',
              borderRadius: 'var(--radius-full)',
              fontSize: '1rem',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-light)'
            }}
          />

          {/* Instant Search Results Dropdown */}
          {searchQuery.trim() !== '' && (
            <div style={{
              position: 'absolute',
              top: '64px',
              left: 0,
              right: 0,
              background: '#FFF',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 100,
              maxHeight: '280px',
              overflowY: 'auto',
              textAlign: 'left'
            }}>
              {filteredCities.length > 0 ? (
                filteredCities.map(city => (
                  <div
                    key={city.id}
                    onClick={() => {
                      handleSelectCity(city);
                      setSearchQuery('');
                    }}
                    style={{
                      padding: '0.85rem 1.2rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div>
                      <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{city.name}</strong>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({city.state})</span>
                    </div>
                    <Navigation size={16} color="var(--accent-terracotta)" />
                  </div>
                ))
              ) : (
                <div style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  No exact region found. Try searching Jaipur, Varanasi, Madurai, Srinagar, Kutch or Bodh Gaya.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Map & Interactive Cards Container */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: selectedCity ? '1fr 1fr' : '1fr',
        gap: '2rem',
        alignItems: 'start',
        transition: 'all 0.4s ease'
      }}>
        {/* Interactive India Map Canvas */}
        <div className="india-map-container" style={{ position: 'relative' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={18} color="var(--accent-terracotta)" />
              <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Cultural Cartography of India
              </span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Click any pin to reveal full story
            </span>
          </div>

          {/* SVG Vector Map of India */}
          <div style={{ position: 'relative', width: '100%', overflow: 'hidden', minHeight: '480px' }}>
            <svg 
              viewBox="0 0 100 100" 
              className="map-svg" 
              style={{
                width: '100%',
                transform: isZoomed && selectedCity ? `scale(1.2) translate(-${(selectedCity.mapCoords.x - 50) * 0.4}%, -${(selectedCity.mapCoords.y - 50) * 0.4}%)` : 'scale(1)',
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Detailed India Outline Paths (Simplified Aesthetic Minimal Vector) */}
              <g className="map-landmass">
                {/* Kashmir / North */}
                <path d="M 22,5 L 35,6 L 42,14 L 38,24 L 28,26 L 18,18 Z" className="map-state" />
                {/* Punjab / Rajasthan / Gujarat West */}
                <path d="M 18,18 L 28,26 L 35,32 L 30,48 L 12,50 L 10,35 Z" className="map-state" />
                {/* UP / MP / Bihar Central */}
                <path d="M 35,32 L 68,34 L 72,50 L 45,55 L 30,48 Z" className="map-state" />
                {/* East / Bengal / Assam */}
                <path d="M 68,34 L 88,36 L 95,48 L 78,54 L 72,50 Z" className="map-state" />
                {/* Deccan / Maharashtra / AP / Karnataka */}
                <path d="M 30,48 L 45,55 L 55,75 L 35,80 L 25,65 Z" className="map-state" />
                {/* Tamil Nadu / Kerala South */}
                <path d="M 35,80 L 55,75 L 48,94 L 38,95 Z" className="map-state" />
              </g>

              {/* City Coordinate Pins */}
              {CITIES_DATA.map(city => {
                const isSelected = selectedCity?.id === city.id;
                return (
                  <g 
                    key={city.id} 
                    transform={`translate(${city.mapCoords.x}, ${city.mapCoords.y})`}
                    onClick={() => handleSelectCity(city)}
                    className="map-pin"
                  >
                    {/* Ripple outer circle */}
                    <circle 
                      cx="0" 
                      cy="0" 
                      r={isSelected ? "6" : "3"} 
                      fill={isSelected ? "var(--accent-terracotta)" : "var(--accent-gold)"} 
                      opacity={isSelected ? "0.4" : "0.2"} 
                      className="map-pin-pulse"
                    />
                    {/* Pin center point */}
                    <circle 
                      cx="0" 
                      cy="0" 
                      r={isSelected ? "3.5" : "2"} 
                      fill={isSelected ? "var(--accent-terracotta)" : "#1E1C1A"} 
                      stroke="#FFF"
                      strokeWidth="0.5"
                    />
                    {/* City Label Badge */}
                    <text 
                      x="0" 
                      y="-4" 
                      textAnchor="middle" 
                      fontSize="2.8" 
                      fontWeight={isSelected ? "bold" : "normal"}
                      fill={isSelected ? "var(--accent-terracotta)" : "var(--text-main)"}
                      style={{ fontFamily: 'var(--font-sans)', pointerEvents: 'none' }}
                    >
                      {city.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Select Pill Buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginTop: '1.2rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-light)'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '0.4rem' }}>
              Quick Regions:
            </span>
            {CITIES_DATA.map(city => (
              <button
                key={city.id}
                onClick={() => handleSelectCity(city)}
                style={{
                  background: selectedCity?.id === city.id ? 'var(--accent-terracotta)' : 'var(--bg-card)',
                  color: selectedCity?.id === city.id ? '#FFF' : 'var(--text-muted)',
                  border: '1px solid var(--border-light)',
                  padding: '0.35rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {city.name} ({city.state})
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Storytelling Panel when City is Selected */}
        {selectedCity ? (
          <div className="editorial-card" style={{
            padding: '2rem',
            backgroundColor: 'var(--bg-primary)',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative'
          }}>
            {/* Close button */}
            <button 
              onClick={handleCloseDetail}
              style={{
                position: 'absolute',
                top: '1.2rem',
                right: '1.2rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            {/* Header Title */}
            <div style={{ marginBottom: '1.5rem', paddingRight: '2rem' }}>
              <span className="editorial-tag">{selectedCity.state} Region</span>
              <h2 style={{ margin: '0.3rem 0 0.5rem 0' }}>{selectedCity.name}</h2>
              <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                "{selectedCity.shortDesc}"
              </p>
            </div>

            {/* Navigation Tabs for 7 Required Storytelling Sections */}
            <div style={{
              display: 'flex',
              gap: '0.4rem',
              overflowX: 'auto',
              borderBottom: '1px solid var(--border-light)',
              marginBottom: '1.5rem',
              paddingBottom: '0.3rem'
            }}>
              {[
                { id: 'history', label: 'History & Story', icon: BookOpen },
                { id: 'places', label: 'Places to Visit', icon: MapPin },
                { id: 'crafts', label: 'Crafts', icon: Feather },
                { id: 'festivals', label: 'Festivals', icon: Calendar },
                { id: 'food', label: 'Food & Cuisine', icon: Utensils },
                { id: 'language', label: 'Language', icon: Compass },
                { id: 'artisans', label: `Artisans (${selectedCity.artisans.length})`, icon: Users }
              ].map(tab => {
                const Icon = tab.icon;
                const active = activeStoryTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveStoryTab(tab.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      borderBottom: active ? '2px solid var(--accent-terracotta)' : '2px solid transparent',
                      padding: '0.5rem 0.8rem',
                      fontSize: '0.82rem',
                      fontWeight: active ? '600' : '400',
                      color: active ? 'var(--accent-terracotta)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENTS */}

            {/* 1. History & Storytelling */}
            {activeStoryTab === 'history' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h4 style={{ marginBottom: '0.8rem', color: 'var(--accent-terracotta)' }}>Narrative History</h4>
                <p style={{ lineHeight: '1.8', fontSize: '0.98rem', color: 'var(--text-main)' }}>
                  {selectedCity.historyStory}
                </p>
              </div>
            )}

            {/* 2. Places to Visit */}
            {activeStoryTab === 'places' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', animation: 'fadeIn 0.3s ease' }}>
                {selectedCity.placesToVisit.map((place, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    gap: '1rem',
                    background: 'var(--bg-surface)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)'
                  }}>
                    <img 
                      src={place.image} 
                      alt={place.name}
                      style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.4rem 0' }}>{place.name}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{place.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Crafts Available */}
            {activeStoryTab === 'crafts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', animation: 'fadeIn 0.3s ease' }}>
                {selectedCity.crafts.map((craft) => (
                  <div key={craft.id} style={{
                    background: '#FFF',
                    padding: '1.2rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)'
                  }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.8rem' }}>
                      <img 
                        src={craft.image} 
                        alt={craft.name}
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                      />
                      <div>
                        <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{craft.name}</h4>
                        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '0.3rem 0' }}>{craft.desc}</p>
                      </div>
                    </div>
                    <div style={{
                      backgroundColor: 'var(--bg-surface)',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.82rem',
                      fontStyle: 'italic',
                      color: 'var(--text-muted)'
                    }}>
                      <strong>Origin Technique Story:</strong> {craft.story}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Festivals */}
            {activeStoryTab === 'festivals' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.3s ease' }}>
                {selectedCity.festivals.map((fest, idx) => (
                  <div key={idx} style={{
                    background: 'var(--bg-surface)',
                    padding: '1.2rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{fest.name}</h4>
                      <span className="story-badge" style={{ backgroundColor: '#FFF' }}>{fest.month}</span>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>{fest.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 5. Food Available */}
            {activeStoryTab === 'food' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', animation: 'fadeIn 0.3s ease' }}>
                {selectedCity.food.map((dish, idx) => (
                  <div key={idx} style={{
                    background: '#FFF',
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    gap: '1rem'
                  }}>
                    <img 
                      src={dish.image} 
                      alt={dish.name}
                      style={{ width: '85px', height: '85px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.3rem 0' }}>{dish.name}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 0.4rem 0' }}>{dish.desc}</p>
                      <span style={{ fontSize: '0.78rem', color: 'var(--accent-terracotta)', fontWeight: '500' }}>
                        Story: {dish.story}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 6. Language Spoken */}
            {activeStoryTab === 'language' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h4 style={{ marginBottom: '0.8rem' }}>Languages Spoken in {selectedCity.name}</h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  {selectedCity.languageSpoken.map((lang, idx) => (
                    <span key={idx} style={{
                      padding: '0.4rem 1rem',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.88rem',
                      fontWeight: '500'
                    }}>
                      {lang}
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Tip: Visit the <strong>Language Hub</strong> tab in the navigation menu to listen to audio pronunciations and learn local dialect phrases of this region.
                </p>
              </div>
            )}

            {/* 7. Artisans Available (With requirement check: if none show 'None') */}
            {activeStoryTab === 'artisans' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>
                  Registered Artisans in {selectedCity.name}
                </h4>

                {selectedCity.artisans && selectedCity.artisans.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedCity.artisans.map(artisan => (
                      <div key={artisan.id} style={{
                        background: 'var(--bg-surface)',
                        padding: '1.2rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-light)',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center'
                      }}>
                        <img 
                          src={artisan.photo} 
                          alt={artisan.name}
                          style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '1rem' }}>{artisan.name}</h4>
                          <span className="editorial-tag" style={{ fontSize: '0.7rem' }}>
                            {artisan.craftSpecialty} • {artisan.yearsOfExperience} yrs exp
                          </span>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.3rem 0 0 0' }}>
                            {artisan.bio}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* EXPLICIT USER REQUIREMENT: "if there is none artisans it should say none" */
                  <div style={{
                    padding: '2.5rem',
                    textAlign: 'center',
                    background: 'var(--bg-surface)',
                    border: '1px dashed var(--border-light)',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    <Users size={32} color="var(--text-light)" style={{ marginBottom: '0.75rem' }} />
                    <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>
                      None
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
                      No registered master artisans are currently listed for {selectedCity.name}. Artisans from neighboring rural clusters can submit their registration through our cultural foundation.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px dashed var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MapPin size={40} color="var(--accent-terracotta)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Select a Region on the Map</h3>
            <p style={{ maxWidth: '400px', fontSize: '0.92rem' }}>
              Click any city pin on the vector map to read its rich storytelling history, places to visit, crafts, festivals, cuisine, and local master artisans.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
