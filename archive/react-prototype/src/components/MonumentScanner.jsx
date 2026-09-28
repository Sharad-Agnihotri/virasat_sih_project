import React, { useState } from 'react';
import { Camera, Upload, Sparkles, CheckCircle2, RefreshCw, ArrowRight, ShieldCheck, Landmark, MapPin, Feather, Utensils, Calendar } from 'lucide-react';
import { MONUMENTS_AI_DATA } from '../data/mockData';

export default function MonumentScanner({ onExploreCity }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedMonument, setDetectedMonument] = useState(null);

  const handleSelectSample = (monument) => {
    setSelectedImage(monument.image);
    triggerScan(monument);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        // Pick a random or match monument for demonstration
        const matched = MONUMENTS_AI_DATA[Math.floor(Math.random() * MONUMENTS_AI_DATA.length)];
        triggerScan(matched);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerScan = (monument) => {
    setIsScanning(true);
    setDetectedMonument(null);

    setTimeout(() => {
      setIsScanning(false);
      setDetectedMonument(monument);
    }, 2200);
  };

  const resetScan = () => {
    setSelectedImage(null);
    setDetectedMonument(null);
    setIsScanning(false);
  };

  return (
    <div className="container section-spacing">
      {/* Editorial Title */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem auto' }}>
        <span className="editorial-tag">AI Visual Recognition</span>
        <h1 style={{ margin: '0.75rem 0 1rem 0' }}>Scan Monument Photo & Uncover Heritage</h1>
        <p className="text-lead">
          Upload any photograph of an Indian monument or ancient temple. Our computer vision model identifies architectural features, stone dynasties, associated crafts, and historical narratives.
        </p>
      </div>

      {!selectedImage ? (
        <div>
          {/* File Upload Drop Area */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '2px dashed var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            maxWidth: '720px',
            margin: '0 auto 3rem auto',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease'
          }}>
            <input 
              type="file" 
              accept="image/*"
              id="monument-upload-input"
              style={{ display: 'none' }} 
              onChange={handleFileUpload}
            />
            <label htmlFor="monument-upload-input" style={{ cursor: 'pointer' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#FFF',
                border: '1px solid var(--border-light)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.2rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <Upload size={28} color="var(--accent-terracotta)" />
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>Upload Monument Photograph</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 1.2rem 0' }}>
                Drag and drop your file here or click to browse (JPG, PNG, WEBP)
              </p>
              <span className="btn-primary" style={{ display: 'inline-flex' }}>
                <Camera size={16} /> Choose Image
              </span>
            </label>
          </div>

          {/* Quick Pre-loaded Sample Monuments */}
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
              — Or select an iconic sample photograph to test AI recognition —
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.2rem'
            }}>
              {MONUMENTS_AI_DATA.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectSample(item)}
                  style={{
                    background: '#FFF',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '0.85rem' }}>
                    <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{item.name}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Image Preview & Scanning Stage */
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isScanning || detectedMonument ? '1fr 1.2fr' : '1fr',
            gap: '2rem',
            alignItems: 'start'
          }}>
            {/* Left Photo Container with Scanning Grid overlay */}
            <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
              <img 
                src={selectedImage} 
                alt="Selected Monument"
                style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }}
              />

              {/* Laser Scanning Animation Overlay */}
              {isScanning && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(30, 28, 26, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFF'
                }}>
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '4px',
                    background: 'var(--accent-terracotta)',
                    boxShadow: '0 0 12px var(--accent-terracotta)',
                    animation: 'scanSweep 2.2s ease-in-out infinite'
                  }} />
                  <Sparkles size={36} color="var(--accent-gold)" style={{ marginBottom: '1rem', animation: 'spin 2s linear infinite' }} />
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#FFF' }}>
                    Analyzing Architectural Features...
                  </p>
                  <span style={{ fontSize: '0.8rem', color: '#E0D8CE' }}>
                    Extracting stone carvings, era signatures & dome geometry
                  </span>
                </div>
              )}
            </div>

            {/* Right Result Container */}
            {detectedMonument && (
              <div className="editorial-card" style={{ padding: '2rem', animation: 'fadeIn 0.4s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="story-badge" style={{ backgroundColor: 'var(--bg-surface)' }}>
                    <ShieldCheck size={14} color="var(--accent-terracotta)" /> AI Detection Confirmed ({detectedMonument.confidence}%)
                  </span>
                  <button 
                    onClick={resetScan} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}
                  >
                    <RefreshCw size={14} /> Scan Another
                  </button>
                </div>

                <h2 style={{ margin: '0 0 0.3rem 0' }}>{detectedMonument.name}</h2>
                <span className="editorial-tag" style={{ display: 'block', marginBottom: '1rem' }}>
                  {detectedMonument.location} • {detectedMonument.builtBy}
                </span>

                <div className="divider" style={{ margin: '1rem 0' }} />

                {/* 1. History & Architectural Story */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--accent-terracotta)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Landmark size={16} /> Heritage & Architectural History
                  </h4>
                  <p style={{ fontSize: '0.92rem', lineHeight: '1.7' }}>
                    {detectedMonument.historyStory}
                  </p>
                </div>

                {/* 2. Associated Crafts */}
                <div style={{ marginBottom: '1.2rem' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Feather size={14} /> Living Crafts of this Region
                  </h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {detectedMonument.craftsAssociated.map((craft, idx) => (
                      <span key={idx} style={{
                        padding: '0.3rem 0.8rem',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.8rem'
                      }}>
                        {craft}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3. Regional Cuisine & Festivals */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Utensils size={14} /> Local Food
                    </h4>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {detectedMonument.foodAssociated.join(', ')}
                    </span>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={14} /> Key Festivals
                    </h4>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {detectedMonument.festivalsAssociated.join(', ')}
                    </span>
                  </div>
                </div>

                {/* Direct CTA to map city page */}
                <button
                  onClick={() => onExploreCity(detectedMonument.cityId)}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Explore Full City Page & Artisans <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
