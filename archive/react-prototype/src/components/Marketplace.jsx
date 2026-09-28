import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, BookOpen, Filter, Check, MessageSquare, Plus, X, ShieldCheck } from 'lucide-react';
import { MARKETPLACE_PRODUCTS } from '../data/mockData';

export default function Marketplace({ favorites, onToggleFavorite }) {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [products, setProducts] = useState(MARKETPLACE_PRODUCTS);
  const [activeStoryModalProduct, setActiveStoryModalProduct] = useState(null);
  const [activeReviewModalProduct, setActiveReviewModalProduct] = useState(null);

  // Review Form State
  const [reviewUserName, setReviewUserName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const regionsList = [
    { id: 'all', label: 'All Regions' },
    { id: 'jaipur', label: 'Jaipur (Blue Pottery & Prints)' },
    { id: 'varanasi', label: 'Varanasi (Banarasi Silk)' },
    { id: 'srinagar', label: 'Srinagar (Pashmina Shawls)' },
    { id: 'kutch', label: 'Rann of Kutch (Mirrorwork & Ajrakh)' },
    { id: 'madurai', label: 'Madurai (Sungudi Cotton)' }
  ];

  const filteredProducts = selectedRegion === 'all' 
    ? products 
    : products.filter(p => p.cityId === selectedRegion);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewUserName.trim() || !reviewComment.trim()) return;

    const newReviewObj = {
      user: reviewUserName,
      rating: Number(reviewRating),
      comment: reviewComment,
      date: new Date().toISOString().split('T')[0]
    };

    setProducts(prevProducts => prevProducts.map(prod => {
      if (prod.id === activeReviewModalProduct.id) {
        const updatedReviews = [newReviewObj, ...prod.reviews];
        const newAverageRating = (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1);
        return {
          ...prod,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: Number(newAverageRating)
        };
      }
      return prod;
    }));

    // Update active modal product
    setActiveReviewModalProduct(prev => ({
      ...prev,
      reviews: [newReviewObj, ...prev.reviews],
      reviewsCount: prev.reviews.length + 1
    }));

    setReviewUserName('');
    setReviewComment('');
  };

  return (
    <div className="container section-spacing">
      {/* Editorial Title */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
        <span className="editorial-tag">Direct Master Craftsmen Platform</span>
        <h1 style={{ margin: '0.75rem 0 1rem 0' }}>Authentic Heritage Marketplace</h1>
        <p className="text-lead">
          Every piece carries centuries of inherited skill. Buy directly from verified Indian master artisans, read the origin story of each technique, add to favorites, and post honest community reviews.
        </p>

        {/* Region Filter Buttons */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: '2rem'
        }}>
          {regionsList.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRegion(r.id)}
              style={{
                background: selectedRegion === r.id ? 'var(--accent-terracotta)' : 'var(--bg-card)',
                color: selectedRegion === r.id ? '#FFF' : 'var(--text-main)',
                border: '1px solid var(--border-light)',
                padding: '0.55rem 1.2rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        {filteredProducts.map(product => {
          const isFav = favorites.some(item => item.id === product.id);

          return (
            <div key={product.id} className="editorial-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Product Image & Wishlist Button */}
              <div style={{ position: 'relative' }}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  style={{ width: '100%', height: '260px', objectFit: 'cover' }}
                />
                <button
                  onClick={() => onToggleFavorite(product)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.2s ease'
                  }}
                  title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                >
                  <Heart size={18} fill={isFav ? "var(--accent-terracotta)" : "none"} color={isFav ? "var(--accent-terracotta)" : "var(--text-main)"} />
                </button>
                <span className="story-badge" style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(255,255,255,0.92)' }}>
                  {product.region}
                </span>
              </div>

              {/* Product Card Content */}
              <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span className="editorial-tag" style={{ fontSize: '0.7rem' }}>{product.artisanName}</span>
                  <h3 style={{ fontSize: '1.15rem', margin: '0.3rem 0 0.5rem 0', lineHeight: 1.3 }}>{product.name}</h3>
                  
                  {/* Rating & Reviews summary */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.8rem', fontSize: '0.85rem' }}>
                    <Star size={15} fill="var(--accent-gold)" color="var(--accent-gold)" />
                    <strong style={{ color: 'var(--text-main)' }}>{product.rating}</strong>
                    <span style={{ color: 'var(--text-muted)' }}>({product.reviewsCount} reviews)</span>
                  </div>
                </div>

                <div>
                  {/* Price Row */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '1.2rem' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: '700', fontFamily: 'var(--font-serif)' }}>
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span style={{ textDecoration: 'line-through', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Actions: Origin Story & Reviews Modal */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <button
                      onClick={() => setActiveStoryModalProduct(product)}
                      className="btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '0.5rem 0.6rem', justifyContent: 'center' }}
                    >
                      <BookOpen size={14} /> Origin Story
                    </button>

                    <button
                      onClick={() => setActiveReviewModalProduct(product)}
                      className="btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '0.5rem 0.6rem', justifyContent: 'center' }}
                    >
                      <MessageSquare size={14} /> Reviews
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: Origin Story Modal */}
      {activeStoryModalProduct && (
        <div className="modal-backdrop" onClick={() => setActiveStoryModalProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2.5rem' }}>
            <button 
              onClick={() => setActiveStoryModalProduct(null)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <span className="editorial-tag">Ancestral Heritage Technique</span>
            <h2 style={{ margin: '0.4rem 0 1rem 0' }}>{activeStoryModalProduct.name}</h2>
            
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <img 
                src={activeStoryModalProduct.image} 
                alt={activeStoryModalProduct.name}
                style={{ width: '140px', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
              />
              <div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>
                  <strong>Artisan Workshop:</strong> {activeStoryModalProduct.artisanName}
                </p>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>
                  <strong>Geographical Indication (GI):</strong> {activeStoryModalProduct.region}
                </p>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <h4 style={{ color: 'var(--accent-terracotta)', marginBottom: '0.5rem' }}>Origin & Crafting Process</h4>
              <p style={{ fontSize: '0.98rem', lineHeight: 1.8, color: 'var(--text-main)' }}>
                {activeStoryModalProduct.originStory}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Reviews & Add Review Modal */}
      {activeReviewModalProduct && (
        <div className="modal-backdrop" onClick={() => setActiveReviewModalProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2.5rem' }}>
            <button 
              onClick={() => setActiveReviewModalProduct(null)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <span className="editorial-tag">Community Feedback</span>
            <h2 style={{ margin: '0.4rem 0 0.5rem 0' }}>Reviews for {activeReviewModalProduct.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Star size={18} fill="var(--accent-gold)" color="var(--accent-gold)" />
              <strong style={{ fontSize: '1.1rem' }}>{activeReviewModalProduct.rating} out of 5</strong>
              <span style={{ color: 'var(--text-muted)' }}>({activeReviewModalProduct.reviews.length} customer reviews)</span>
            </div>

            {/* Submit New Review Form */}
            <form onSubmit={handleAddReview} style={{
              background: 'var(--bg-surface)',
              padding: '1.2rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.95rem' }}>Write a Review</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  value={reviewUserName}
                  onChange={(e) => setReviewUserName(e.target.value)}
                  required
                />
                <select 
                  value={reviewRating} 
                  onChange={(e) => setReviewRating(e.target.value)}
                >
                  <option value={5}>5 Stars (Exceptional)</option>
                  <option value={4}>4 Stars (Very Good)</option>
                  <option value={3}>3 Stars (Good)</option>
                  <option value={2}>2 Stars (Fair)</option>
                  <option value={1}>1 Star (Poor)</option>
                </select>
              </div>
              <textarea 
                placeholder="Share your experience with this artisan product..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
                required
                style={{ marginBottom: '0.75rem' }}
              />
              <button type="submit" className="btn-terracotta" style={{ fontSize: '0.82rem', padding: '0.4rem 1rem' }}>
                <Plus size={14} /> Submit Review
              </button>
            </form>

            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '250px', overflowY: 'auto' }}>
              {activeReviewModalProduct.reviews.map((rev, idx) => (
                <div key={idx} style={{ padding: '0.85rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <strong style={{ fontSize: '0.92rem' }}>{rev.user}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>{rev.date}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.4rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill={i < rev.rating ? "var(--accent-gold)" : "none"} color="var(--accent-gold)" />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
