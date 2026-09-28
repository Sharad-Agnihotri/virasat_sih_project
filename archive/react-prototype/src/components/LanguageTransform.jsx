import React, { useState } from 'react';
import { Volume2, Languages, CheckCircle2, HelpCircle, RefreshCw, Award, BookOpen } from 'lucide-react';
import { LANGUAGE_LESSONS } from '../data/mockData';

export default function LanguageTransform() {
  const [selectedLangId, setSelectedLangId] = useState('lang-raj');
  const [quizSelectedOption, setQuizSelectedOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(null);

  const activeLesson = LANGUAGE_LESSONS.find(l => l.id === selectedLangId) || LANGUAGE_LESSONS[0];

  const handleSpeak = (text, idx) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.onstart = () => setIsPlayingAudio(idx);
      utterance.onend = () => setIsPlayingAudio(null);
      utterance.onerror = () => setIsPlayingAudio(null);
      window.speechSynthesis.speak(utterance);
    } else {
      alert(`Audio synthesis simulation: "${text}"`);
    }
  };

  const handleQuizSubmit = (option) => {
    setQuizSelectedOption(option);
    setQuizSubmitted(true);
  };

  const resetQuiz = () => {
    setQuizSelectedOption(null);
    setQuizSubmitted(false);
  };

  return (
    <div className="container section-spacing">
      {/* Editorial Title */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem auto' }}>
        <span className="editorial-tag">Linguistic Heritage Transformation</span>
        <h1 style={{ margin: '0.75rem 0 1rem 0' }}>Learn Native Dialects & Regional Phrases</h1>
        <p className="text-lead">
          Connect meaningfully with local heritage artisans and villagers. Learn essential expressions, native pronunciations, and script translations in your own language.
        </p>

        {/* Dialect Selector Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.6rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '2rem'
        }}>
          {LANGUAGE_LESSONS.map(lang => (
            <button
              key={lang.id}
              onClick={() => {
                setSelectedLangId(lang.id);
                resetQuiz();
              }}
              style={{
                background: selectedLangId === lang.id ? 'var(--accent-terracotta)' : 'var(--bg-card)',
                color: selectedLangId === lang.id ? '#FFF' : 'var(--text-main)',
                border: '1px solid var(--border-light)',
                padding: '0.6rem 1.4rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {lang.language} ({lang.region})
            </button>
          ))}
        </div>
      </div>

      {/* Lesson Details Container */}
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        <div className="editorial-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <span className="editorial-tag">{activeLesson.script}</span>
              <h2 style={{ margin: '0.2rem 0' }}>{activeLesson.language}</h2>
            </div>
            <span className="story-badge" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <Languages size={14} color="var(--accent-terracotta)" /> {activeLesson.region}
            </span>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1.8rem' }}>
            {activeLesson.intro}
          </p>

          {/* Interactive Phrase Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeLesson.phrases.map((phrase, idx) => (
              <div 
                key={idx} 
                style={{
                  background: 'var(--bg-surface)',
                  padding: '1.2rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.78rem', uppercase: true, letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: '600' }}>
                    {phrase.english}
                  </span>
                  <h3 style={{ fontSize: '1.4rem', margin: '0.2rem 0 0.1rem 0', color: 'var(--text-main)', fontFamily: 'var(--font-serif)' }}>
                    {phrase.local}
                  </h3>
                  <span style={{ fontSize: '0.88rem', fontStyle: 'italic', color: 'var(--accent-terracotta)' }}>
                    Phonetic: "{phrase.phonetics || phrase.phonetic}"
                  </span>
                  {phrase.response && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      <strong>Expected Response:</strong> {phrase.response}
                    </div>
                  )}
                </div>

                {/* Speech Synthesis Audio Button */}
                <button
                  onClick={() => handleSpeak(phrase.audioText || phrase.local, idx)}
                  className="btn-secondary"
                  style={{
                    borderRadius: '50%',
                    width: '46px',
                    height: '46px',
                    padding: 0,
                    justifyContent: 'center',
                    backgroundColor: isPlayingAudio === idx ? 'var(--accent-terracotta)' : '#FFF',
                    color: isPlayingAudio === idx ? '#FFF' : 'var(--text-main)'
                  }}
                  title="Listen to native audio pronunciation"
                >
                  <Volume2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Practice Quiz */}
        {activeLesson.quiz && (
          <div className="editorial-card" style={{ padding: '2rem', backgroundColor: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Award size={20} color="var(--accent-gold)" />
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Knowledge Check: {activeLesson.language}</h3>
            </div>

            <p style={{ fontSize: '0.98rem', fontWeight: '500', marginBottom: '1.2rem' }}>
              {activeLesson.quiz.question}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.2rem' }}>
              {activeLesson.quiz.options.map((opt, idx) => {
                const isSelected = quizSelectedOption === opt;
                const isCorrect = opt === activeLesson.quiz.answer;

                let btnBg = '#FFF';
                let btnBorder = 'var(--border-light)';

                if (quizSubmitted) {
                  if (isCorrect) {
                    btnBg = '#E8F5E9';
                    btnBorder = '#4CAF50';
                  } else if (isSelected && !isCorrect) {
                    btnBg = '#FFEBEE';
                    btnBorder = '#F44336';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => !quizSubmitted && handleQuizSubmit(opt)}
                    style={{
                      padding: '0.85rem 1rem',
                      background: btnBg,
                      border: `1px solid ${btnBorder}`,
                      borderRadius: 'var(--radius-sm)',
                      textAlign: 'left',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.9rem',
                      cursor: quizSubmitted ? 'default' : 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {quizSubmitted && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.8rem',
                borderTop: '1px solid var(--border-light)'
              }}>
                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: quizSelectedOption === activeLesson.quiz.answer ? '#2E7D32' : '#C62828'
                }}>
                  {quizSelectedOption === activeLesson.quiz.answer ? '✓ Excellent! That is correct.' : `✕ Incorrect. The right answer is "${activeLesson.quiz.answer}".`}
                </span>
                <button 
                  onClick={resetQuiz}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <RefreshCw size={14} /> Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
