import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { demoLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleDemoLogin = (e) => {
    e?.preventDefault();
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
          <h1>Welcome to <span className="brand-text">ShadowVault</span></h1>
          <p className="subtitle">Access your account and continue your journey with us</p>
        </div>

        <div className="login-content">
          <form className="login-form" onSubmit={handleDemoLogin}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email address" 
                className="form-input"
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  placeholder="Enter your password" 
                  className="form-input"
                  required 
                />
                <button 
                  type="button" 
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} color="#a0aec0" /> : <Eye size={18} color="#a0aec0" />}
                </button>
              </div>
            </div>

            <div className="form-actions">
              <label className="checkbox-container">
                <input type="checkbox" className="custom-checkbox" />
                <span className="checkmark"></span>
                <span className="checkbox-label">Keep me signed in</span>
              </label>
              <a href="#" className="reset-password-link">Reset password</a>
            </div>

            <button type="submit" className="signin-btn" disabled={isLoading}>
              {isLoading ? (
                <div className="btn-spinner"></div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="divider">
            <span>Or continue with</span>
          </div>

          <div className="google-signin-wrapper">
            <button 
              className="demo-google-btn" 
              onClick={handleDemoLogin}
              disabled={isLoading}
              type="button"
            >
              <div className="google-icon">
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.49h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.25h2.91c1.7-1.56 2.68-3.86 2.68-6.6z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.25c-.81.54-1.85.86-3.05.86-2.34 0-4.32-1.58-5.03-3.7H.95v2.3C2.43 15.89 5.5 18 9 18z"/>
                  <path fill="#FBBC05" d="M3.97 10.73c-.18-.54-.28-1.12-.28-1.73s.1-1.19.28-1.73V4.97H.95C.35 6.19 0 7.56 0 9s.35 2.81.95 4.03l3.02-2.3z"/>
                  <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.89 11.43 0 9 0 5.5 0 2.43 2.11.95 5.08L3.97 7.4c.71-2.13 2.69-3.82 5.03-3.82z"/>
                </svg>
              </div>
              <span>Continue with Google</span>
            </button>
          </div>
        </div>

        <div className="login-footer">
          <p className="terms">
            New to our platform? <a href="#" className="create-account-link">Create Account</a>
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
