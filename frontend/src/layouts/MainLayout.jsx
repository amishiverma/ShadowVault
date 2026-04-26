import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function MainLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/' && (location.pathname === '/' || location.pathname === '/secure-chat')) return 'active';
    return location.pathname === path ? 'active' : '';
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isLight = theme === 'light';

  return (
    <div className="app-container">
      <header className="top-nav">
        {/* Left Side: No Space Tabs (img2) */}
        <nav className="nav-menu-top">
          <Link to="/" className={`nav-link ${isActive('/')}`}>dashboard</Link>
          <Link to="/detect" className={`nav-link ${isActive('/detect')}`}>threat detection</Link>
          <Link to="/analytics" className={`nav-link ${isActive('/analytics')}`}>payload analytics</Link>
          <Link to="/policies" className={`nav-link ${isActive('/policies')}`}>defense policies</Link>
          <Link to="/redteam" className={`nav-link ${isActive('/redteam')}`}>red teaming</Link>
        </nav>
        
        {/* Right Side: Toggle & User (img3) */}
        <div className="top-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme} 
            title="Toggle Theme"
            style={{
              background: 'none',
              border: 'none',
              color: isLight ? '#000000' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0'
            }}
          >
            {isLight ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.8 }}>
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>

          <div style={{ position: 'relative' }}>
            <button 
              className="user-button-exact"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>{user?.name || 'Demo User'}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            {dropdownOpen && (
              <div style={{ 
                position: 'absolute', 
                top: '100%', 
                right: 0, 
                marginTop: '10px',
                background: isLight ? 'white' : '#13151a',
                border: '1px solid ' + (isLight ? '#dadce0' : 'rgba(255, 255, 255, 0.1)'),
                borderRadius: '8px',
                padding: '8px',
                minWidth: '140px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                zIndex: 1000
              }}>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: isLight ? '#1a1a1a' : '#ffffff', cursor: 'pointer', width: '100%', textAlign: 'left', padding: '8px', fontSize: '0.9rem' }}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>
      
      <div id="antigravity-bg"></div>
    </div>
  );
}
