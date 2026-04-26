import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function MainLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/' && (location.pathname === '/' || location.pathname === '/secure-chat')) return 'active';
    return location.pathname === path ? 'active' : '';
  };

  const navLinks = [
    { name: 'dashboard', path: '/' },
    { name: 'threat detection', path: '/detect' },
    { name: 'payload analytics', path: '/analytics' },
    { name: 'defense policies', path: '/policies' },
    { name: 'red teaming', path: '/redteam' },
  ];

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
        {/* Left: Hamburger (Mobile Only) */}
        <button className="hamburger-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>

        {/* Left Side: Desktop Tabs */}
        <nav className="nav-menu-top">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className={`nav-link ${isActive(link.path)}`}>{link.name}</Link>
          ))}
        </nav>
        
        {/* Right Side: Toggle & Profile Avatar */}
        <div className="top-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
              padding: '8px'
            }}
          >
            {isLight ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              className="user-avatar-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </button>
            
            {dropdownOpen && (
              <div className="dropdown-menu-premium">
                <button className="dropdown-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  Settings
                </button>
                <button onClick={handleLogout} className="dropdown-item" style={{ color: 'var(--red)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMenuOpen && <div className="mobile-overlay" onClick={() => setIsMenuOpen(false)} />}
      <div className={`mobile-sidebar ${isMenuOpen ? 'open' : ''}`}>
        {navLinks.map(link => (
          <Link 
            key={link.path} 
            to={link.path} 
            className={`nav-link ${isActive(link.path)}`}
            onClick={() => setIsMenuOpen(false)}
            style={{ fontSize: '1.1rem', padding: '10px 0' }}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <main className="main-content">
        {children}
      </main>
      
      <div id="antigravity-bg"></div>
    </div>
  );
}
