import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'dark');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const handleSend = () => {
    if (!prompt.trim()) return;
    // Navigate to SecureChat with the initial message
    navigate('/secure-chat', { state: { initialMessage: prompt } });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const isLight = theme === 'light';

  return (
    <div className="hero-section" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '82vh',
      textAlign: 'center',
      padding: '0 20px'
    }}>
      {/* Standardized Orb Section */}
      <div className="orb-container">
        <div className="motion-orb"></div>
      </div>

      <h1 style={{ 
        fontSize: '3.6rem', 
        fontWeight: '500', 
        marginBottom: '45px', 
        letterSpacing: '-0.02em',
        color: isLight ? '#1a1a1a' : '#ffffff',
        fontFamily: "'Outfit', sans-serif"
      }}>
        How can I help you today?
      </h1>
      
      {/* Standardized Pill-Shaped Input */}
      <div className="chat-input-wrapper" style={{ 
        maxWidth: '750px',
      }}>
        <div className="chat-input-inner">
          <input 
            type="text" 
            style={{ 
              width: '100%', 
              background: 'transparent', 
              border: 'none', 
              fontSize: '1.2rem',
              outline: 'none',
              color: isLight ? '#1a1a1a' : '#ffffff'
            }} 
            placeholder="Ask ShadowVault..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '10px' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: isLight ? '#5f6368' : 'rgba(255,255,255,0.5)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
            </button>
            <button 
              onClick={handleSend}
              style={{ 
                background: isLight ? '#4285f4' : '#6e3cbc', 
                border: 'none', 
                borderRadius: '50%', 
                width: '38px', 
                height: '38px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'white', 
                cursor: 'pointer' 
              }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
