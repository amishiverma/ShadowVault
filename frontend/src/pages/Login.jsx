import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { demoLogin, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const handleDemoLogin = (e) => {
    e?.preventDefault();
    setIsLoading(true);
    // Simulate slight delay for "demo" effect
    setTimeout(() => {
      demoLogin();
      navigate('/');
    }, 500);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      await login(credentialResponse.credential);
      navigate('/');
    } catch (err) {
      console.error('Google Login Failed:', err);
      setLoginError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome to <span className="brand-text">ShadowVault</span></h1>
          <p className="subtitle">Access your account and continue your journey with us</p>
        </div>

        <div className="login-content">
          {loginError && (
            <div className="error-message">
              {loginError}
            </div>
          )}

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

          <div className="google-signin-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.log('Login Failed');
                setLoginError('Google Login failed. Please try again.');
              }}
              useOneTap
              theme="filled_black"
              shape="pill"
              width="100%"
            />
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

