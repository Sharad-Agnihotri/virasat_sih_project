import React from 'react';
import { MapPin, Camera, ShoppingBag, Calendar, Languages, Users, User, Compass, Eye } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, favoritesCount }) {
  const navItems = [
    { id: 'explore', label: 'Explore Map', icon: MapPin },
    { id: 'scan', label: 'Monument AI Scan', icon: Camera },
    { id: 'vr', label: 'VR 360° Tour', icon: Eye },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, badge: favoritesCount > 0 ? favoritesCount : null },
    { id: 'events', label: 'Cultural Events', icon: Calendar },
    { id: 'language', label: 'Language Hub', icon: Languages },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 800,
      backgroundColor: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border-light)',
      backdropFilter: 'blur(10px)',
      background: 'rgba(251, 249, 245, 0.92)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px'
      }}>
        {/* Brand Logo & Editorial Title */}
        <div 
          onClick={() => setActiveTab('explore')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--accent-terracotta)',
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Compass size={22} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.6rem',
              fontWeight: '600',
              lineHeight: 1,
              letterSpacing: '0.04em',
              fontFamily: 'var(--font-serif)',
              margin: 0
            }}>
              VIRASAT
            </h1>
            <span className="editorial-tag" style={{ fontSize: '0.65rem', letterSpacing: '0.2em' }}>
              Living Cultural Heritage
            </span>
          </div>
        </div>

        {/* Minimal Nav Items */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  background: isActive ? 'var(--bg-surface)' : 'transparent',
                  border: isActive ? '1px solid var(--border-light)' : '1px solid transparent',
                  padding: '0.55rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  color: isActive ? 'var(--accent-terracotta)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? '600' : '400',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <Icon size={16} color={isActive ? 'var(--accent-terracotta)' : 'var(--text-muted)'} />
                <span className="nav-label-text">{item.label}</span>
                {item.badge && (
                  <span style={{
                    backgroundColor: 'var(--accent-terracotta)',
                    color: '#FFF',
                    fontSize: '0.7rem',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
