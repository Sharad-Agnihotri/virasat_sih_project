import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ExploreMap from './components/ExploreMap';
import MonumentScanner from './components/MonumentScanner';
import Marketplace from './components/Marketplace';
import CulturalEvents from './components/CulturalEvents';
import LanguageTransform from './components/LanguageTransform';
import CommunityHub from './components/CommunityHub';
import UserProfile from './components/UserProfile';
import AIChatWidget from './components/AIChatWidget';

export default function App() {
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedCityId, setSelectedCityId] = useState(null);
  
  // Persistent Favorites State
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('virasat_favs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('virasat_favs', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const handleToggleFavorite = (product) => {
    setFavorites(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleExploreCityFromScanner = (cityId) => {
    setSelectedCityId(cityId);
    setActiveTab('explore');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Editorial Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        favoritesCount={favorites.length}
      />

      {/* Main Content Router */}
      <main style={{ flex: 1 }}>
        {activeTab === 'explore' && (
          <ExploreMap 
            selectedCityId={selectedCityId}
            setSelectedCityId={setSelectedCityId}
            onSelectCity={(city) => setSelectedCityId(city.id)}
          />
        )}

        {activeTab === 'scan' && (
          <MonumentScanner 
            onExploreCity={handleExploreCityFromScanner}
          />
        )}

        {activeTab === 'vr' && (
          <div style={{ width: '100%', height: 'calc(100vh - 76px)', position: 'relative', overflow: 'hidden' }}>
            <iframe 
              src="http://localhost:8081/vr.html" 
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }} 
              title="VIRASAT VR 360° Explorer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; vr; xr-spatial-tracking"
            />
          </div>
        )}

        {activeTab === 'marketplace' && (
          <Marketplace 
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'events' && (
          <CulturalEvents />
        )}

        {activeTab === 'language' && (
          <LanguageTransform />
        )}

        {activeTab === 'community' && (
          <CommunityHub />
        )}

        {activeTab === 'profile' && (
          <UserProfile 
            favorites={favorites}
            onRemoveFavorite={handleToggleFavorite}
          />
        )}
      </main>

      {/* Floating AI Assistant Chatbot & Budget Planner */}
      <AIChatWidget />

      {/* Minimal Editorial Footer */}
      <footer style={{
        backgroundColor: 'var(--bg-dark)',
        color: 'var(--text-on-dark)',
        padding: '3rem 0 2rem 0',
        marginTop: '4rem',
        borderTop: '1px solid var(--border-dark)'
      }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: '400', fontSize: '1.8rem', letterSpacing: '0.05em' }}>
            VIRASAT — Heritage India
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#AAA49B', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Preserving centuries of Indian craft lineages, monument cartography, regional dialects, and direct artisan livelihoods.
          </p>
          <div className="divider" style={{ background: 'var(--border-dark)', margin: '1rem 0' }} />
          <div style={{ fontSize: '0.78rem', color: '#777269' }}>
            © {new Date().getFullYear()} Virasat Platform • Built with Minimalist Editorial Craftsmanship
          </div>
        </div>
      </footer>
    </div>
  );
}
