import React, { useState } from 'react';
import { Calendar, MapPin, Tag, Bell, Check, Clock } from 'lucide-react';
import { CULTURAL_EVENTS } from '../data/mockData';

export default function CulturalEvents() {
  const [rsvpList, setRsvpList] = useState([]);

  const toggleRsvp = (eventId) => {
    if (rsvpList.includes(eventId)) {
      setRsvpList(rsvpList.filter(id => id !== eventId));
    } else {
      setRsvpList([...rsvpList, eventId]);
    }
  };

  return (
    <div className="container section-spacing">
      {/* Editorial Header */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem auto' }}>
        <span className="editorial-tag">Living Heritage Calendar</span>
        <h1 style={{ margin: '0.75rem 0 1rem 0' }}>Cultural Events & Festival Melas</h1>
        <p className="text-lead">
          Immerse yourself in India's living traditions. Track upcoming artisan craft melas, temple illuminations, classical dance festivals, and folk pageantry across Indian states.
        </p>
      </div>

      {/* Events Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2rem'
      }}>
        {CULTURAL_EVENTS.map(event => {
          const isRsvped = rsvpList.includes(event.id);

          return (
            <div key={event.id} className="editorial-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src={event.image} 
                  alt={event.title}
                  style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                />
                <span className="story-badge" style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(255,255,255,0.92)' }}>
                  <Tag size={12} color="var(--accent-terracotta)" /> {event.category}
                </span>
              </div>

              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-terracotta)', fontWeight: '600', fontSize: '0.88rem', marginBottom: '0.4rem' }}>
                    <Calendar size={15} /> {event.date}
                  </div>

                  <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.4rem 0' }}>{event.title}</h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    <MapPin size={14} /> {event.location}
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {event.desc}
                  </p>
                </div>

                <button
                  onClick={() => toggleRsvp(event.id)}
                  className={isRsvped ? "btn-secondary" : "btn-primary"}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {isRsvped ? (
                    <>
                      <Check size={16} color="var(--accent-sage)" /> Saved to My Calendar
                    </>
                  ) : (
                    <>
                      <Bell size={16} /> Set Event Reminder
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
