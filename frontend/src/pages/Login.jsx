import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { demoLogin } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDemoLogin = () => {
    setIsLoading(true);
    // Simulate slight delay for "demo" effect
    setTimeout(() => {
      demoLogin();
      navigate('/');
    }, 500);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>ShadowVault</h1>
          <p className="subtitle">AI Security & Threat Detection Dashboard</p>
        </div>

        <div className="login-content">
          <p className="description">
            Secure your AI applications with advanced prompt injection detection and real-time threat analysis.
          </p>

          <div className="google-signin-wrapper">
            <button 
              className="demo-google-btn" 
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              <div className="google-icon">
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.49h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.25h2.91c1.7-1.56 2.68-3.86 2.68-6.6z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.25c-.81.54-1.85.86-3.05.86-2.34 0-4.32-1.58-5.03-3.7H.95v2.3C2.43 15.89 5.5 18 9 18z"/>
                  <path fill="#FBBC05" d="M3.97 10.73c-.18-.54-.28-1.12-.28-1.73s.1-1.19.28-1.73V4.97H.95C.35 6.19 0 7.56 0 9s.35 2.81.95 4.03l3.02-2.3z"/>
                  <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.89 11.43 0 9 0 5.5 0 2.43 2.11.95 5.08L3.97 7.4c.71-2.13 2.69-3.82 5.03-3.82z"/>
                </svg>
              </div>
              <span>Sign in with Google</span>
            </button>
          </div>


          {isLoading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Signing in...</p>
            </div>
          )}

          <div className="features-list">
            <h3>Key Features:</h3>
            <ul>
              <li>🛡️ Multi-layer threat detection (regex + AI)</li>
              <li>⚡ Real-time prompt analysis</li>
              <li>📊 Detailed threat analytics</li>
              <li>🎯 Defense policy management</li>
              <li>🔴 Red team simulation</li>
            </ul>
          </div>
        </div>

        <div className="login-footer">
          <p className="terms">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      <div className="background-animation">
        <div className="glow-1"></div>
        <div className="glow-2"></div>
        <div className="glow-3"></div>
      </div>
    </div>
  );
}
