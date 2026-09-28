import React from 'react';
import { User, Heart, Award, Bookmark, ShieldCheck, MapPin, ExternalLink, Trash2 } from 'lucide-react';

export default function UserProfile({ favorites, onRemoveFavorite, savedItineraries }) {
  return (
    <div className="container section-spacing">
      {/* Profile Header Card */}
      <div className="editorial-card" style={{ padding: '2.5rem', marginBottom: '2.5rem', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <img 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
          alt="User Profile"
          style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--border-light)' }}
        />

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>Sayed Heritage Traveler</h1>
            <ShieldCheck size={20} color="var(--accent-terracotta)" />
          </div>
          <span className="editorial-tag" style={{ fontSize: '0.78rem' }}>Master Culture Explorer • Level 3 Traveler</span>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.4rem 0 0 0' }}>
            Passionate about Indian craft preservation, regional handlooms, and ancient temple cartography.
          </p>
        </div>
      </div>

      {/* Earned Badges */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={20} color="var(--accent-gold)" /> Heritage Exploration Badges
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {[
            { title: 'Silk Trail Patron', desc: 'Discovered Varanasi Banarasi brocades', icon: '🧵' },
            { title: 'Desert Craftsman', desc: 'Explored Jaipur Blue Pottery & Kutch Ajrakh', icon: '🏺' },
            { title: 'Temple Cartographer', desc: 'Scanned 3+ UNESCO Indian Monuments', icon: '🏛️' },
            { title: 'Linguistic Traveler', desc: 'Mastered 5+ Marwari & Tamil phrases', icon: '🗣️' }
          ].map((badge, idx) => (
            <div key={idx} style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <span style={{ fontSize: '2.2rem' }}>{badge.icon}</span>
              <div>
                <h4 style={{ fontSize: '0.98rem', margin: '0 0 0.2rem 0' }}>{badge.title}</h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{badge.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Favorites Section */}
      <div>
        <h3 style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Heart size={20} color="var(--accent-terracotta)" fill="var(--accent-terracotta)" /> Saved Favorite Crafts ({favorites.length})
        </h3>

        {favorites.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {favorites.map(item => (
              <div key={item.id} className="editorial-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img 
                  src={item.image} 
                  alt={item.name}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.95rem', margin: '0 0 0.2rem 0' }}>{item.name}</h4>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>₹{item.price.toLocaleString('en-IN')}</span>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.region}</div>
                </div>
                <button
                  onClick={() => onRemoveFavorite(item)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', padding: '0.4rem' }}
                  title="Remove from favorites"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px dashed var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '2rem',
            textAlign: 'center',
            color: 'var(--text-muted)'
          }}>
            No saved favorite products yet. Visit the Marketplace to bookmark authentic artisan crafts!
          </div>
        )}
      </div>
    </div>
  );
}
