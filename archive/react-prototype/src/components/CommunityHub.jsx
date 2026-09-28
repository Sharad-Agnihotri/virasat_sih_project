import React, { useState } from 'react';
import { Heart, MessageSquare, Plus, Share2, MapPin, X, User } from 'lucide-react';
import { COMMUNITY_POSTS } from '../data/mockData';

export default function CommunityHub() {
  const [posts, setPosts] = useState(COMMUNITY_POSTS);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // Form inputs
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  const handleLike = (postId) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPostObj = {
      id: `post-${Date.now()}`,
      author: newAuthor.trim() || "Heritage Traveler",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      location: newLocation.trim() || "India",
      title: newTitle,
      date: "Just now",
      content: newContent,
      image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80",
      likes: 1,
      comments: []
    };

    setPosts([newPostObj, ...posts]);
    setIsCreatingPost(false);
    setNewTitle('');
    setNewLocation('');
    setNewContent('');
    setNewAuthor('');
  };

  return (
    <div className="container section-spacing">
      {/* Editorial Title */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem auto' }}>
        <span className="editorial-tag">Heritage Travelers Collective</span>
        <h1 style={{ margin: '0.75rem 0 1rem 0' }}>Community Travel Stories</h1>
        <p className="text-lead">
          Read real journeys, artisan encounters, and hidden village craft secrets documented by fellow culture explorers.
        </p>

        <button 
          onClick={() => setIsCreatingPost(true)}
          className="btn-terracotta"
          style={{ marginTop: '1.5rem' }}
        >
          <Plus size={16} /> Share Your Experience
        </button>
      </div>

      {/* Stories Feed Grid */}
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {posts.map(post => (
          <article key={post.id} className="editorial-card" style={{ padding: '2rem' }}>
            {/* Author Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img 
                  src={post.avatar} 
                  alt={post.author}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{post.author}</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <MapPin size={12} display="inline" /> {post.location} • {post.date}
                  </span>
                </div>
              </div>
            </div>

            {/* Post Image */}
            {post.image && (
              <img 
                src={post.image} 
                alt={post.title}
                style={{ width: '100%', height: '340px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '1.2rem' }}
              />
            )}

            {/* Post Title & Content */}
            <h2 style={{ fontSize: '1.6rem', margin: '0 0 0.6rem 0' }}>{post.title}</h2>
            <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-main)', marginBottom: '1.5rem' }}>
              {post.content}
            </p>

            {/* Footer Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button 
                onClick={() => handleLike(post.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}
              >
                <Heart size={18} fill="var(--accent-terracotta)" color="var(--accent-terracotta)" />
                <span>{post.likes} Likes</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <MessageSquare size={18} />
                <span>{post.comments.length} Comments</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Modal to Create New Post */}
      {isCreatingPost && (
        <div className="modal-backdrop" onClick={() => setIsCreatingPost(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2.5rem' }}>
            <button 
              onClick={() => setIsCreatingPost(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <span className="editorial-tag">Share Your Narrative</span>
            <h2 style={{ margin: '0.4rem 0 1.2rem 0' }}>Write Your Heritage Story</h2>

            <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Your Name" 
                value={newAuthor} 
                onChange={(e) => setNewAuthor(e.target.value)} 
                required 
              />
              <input 
                type="text" 
                placeholder="Location / Village (e.g. Sanganer, Jaipur)" 
                value={newLocation} 
                onChange={(e) => setNewLocation(e.target.value)} 
                required 
              />
              <input 
                type="text" 
                placeholder="Story Title" 
                value={newTitle} 
                onChange={(e) => setNewTitle(e.target.value)} 
                required 
              />
              <textarea 
                placeholder="Describe your artisan encounter, festival experience or cultural discovery..." 
                value={newContent} 
                onChange={(e) => setNewContent(e.target.value)} 
                rows={5} 
                required 
              />
              <button type="submit" className="btn-terracotta" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                Publish Story to Community
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
