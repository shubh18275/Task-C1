import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, selectGoogleAccount, logout, currentUser } = useAuth();

  // Form input and status states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  const [loading, setLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Handle user login form submission
  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate('/', { state: { justLoggedIn: true } });
    } catch (err) {
      setError(err.message || 'Those email and password details did not match an account. Try again or sign up for a free account.');
    } finally {
      setLoading(false);
    }
  }

  // Handle Google authentication - opens Google Account chooser modal directly
  function handleGoogleLogin() {
    setError('');
    setShowGoogleModal(true);
  }

  // Handle Google account selection
  async function handleGoogleSelect(selectedEmail) {
    setShowGoogleModal(false);
    await selectGoogleAccount({ email: selectedEmail, fullName: 'Shubh Batra' });
    navigate('/', { state: { justLoggedIn: true } });
  }

  // If the user is already logged in
  if (currentUser) {
    return (
      <main className="auth-page">
        <section className="auth-card" aria-labelledby="login-title">
          <div className="auth-card-heading">
            <h1 id="login-title">Logged In</h1>
          </div>
          <p className="form-success">
            You are currently logged in as <strong>{currentUser.fullName || currentUser.email}</strong>.
          </p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button 
              type="button" 
              className="auth-submit" 
              style={{ flex: 1, marginTop: 0 }} 
              onClick={() => navigate('/')}
            >
              Go to Home
            </button>
            <button 
              type="button" 
              className="auth-submit" 
              style={{ flex: 1, marginTop: 0, backgroundColor: '#64748b' }} 
              onClick={logout}
            >
              Log out
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <div className="auth-card-heading">
          <h1 id="login-title">Login</h1>
          <Link className="auth-signup-link" to="/signup">Sign up</Link>
        </div>

        {successMessage && !error && (
          <p className="form-success" role="status">{successMessage}</p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">Your email</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (successMessage) setSuccessMessage('');
            }}
            required
          />

          <label htmlFor="login-password">Your password</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="form-message" role="alert">{error}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <button 
          type="button" 
          className="auth-google-btn" 
          onClick={handleGoogleLogin} 
          disabled={loading}
        >
          <svg className="google-icon" viewBox="0 0 24 24" width="16" height="16">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="auth-switch-text">
          Don't have an account? <Link to="/signup" className="auth-purple-link">Sign Up</Link>
        </p>

        {/* Google Account selection modal */}
        {showGoogleModal && (
          <div className="google-modal-overlay" onClick={() => setShowGoogleModal(false)}>
            <div className="google-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="google-modal-header">
                <h2>Sign in with Google</h2>
                <p className="google-modal-subtitle">Choose an account to continue to DEV@Deakin</p>
              </div>
              <div className="google-account-list">
                <button type="button" className="google-account-item" onClick={() => handleGoogleSelect('shubhbatra2006@gmail.com')}>
                  <div className="google-avatar" style={{ background: '#1a73e8' }}>S</div>
                  <div className="google-account-text">
                    <span className="google-account-name">Shubh Batra</span>
                    <span className="google-account-email">shubhbatra2006@gmail.com</span>
                  </div>
                </button>
                <button type="button" className="google-account-item" onClick={() => handleGoogleSelect('shubh@deakin.edu.au')}>
                  <div className="google-avatar" style={{ background: '#0d9488' }}>S</div>
                  <div className="google-account-text">
                    <span className="google-account-name">Shubh Batra</span>
                    <span className="google-account-email">shubh@deakin.edu.au</span>
                  </div>
                </button>
              </div>
              <div className="google-modal-footer">
                <button type="button" className="google-cancel-btn" onClick={() => setShowGoogleModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Login;
