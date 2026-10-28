import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Signup() {
  const navigate = useNavigate();
  const { signup, selectGoogleAccount } = useAuth();

  // Form input states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status and error states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Handle signup form submit
  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    // Clean up spaces in name
    const name = fullName.trim().replace(/\s+/g, ' ');

    // Validation checks
    if (name.split(' ').length < 2) {
      return setError('Enter your first and last name.');
    }
    if (password.length < 6) {
      return setError('Choose a password with at least 6 characters.');
    }
    if (password !== confirmPassword) {
      return setError('Your passwords do not match.');
    }

    setLoading(true);

    try {
      await signup(name, email, password);
      // Redirect to login page with success feedback message
      navigate('/login', { 
        state: { 
          message: 'Account created successfully! Please log in with your email and password.' 
        } 
      });
    } catch (err) {
      setError(err.message || 'Unable to create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Handle Google authentication
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

  return (
    <main className="auth-page">
      <section className="auth-card signup-card" aria-labelledby="signup-title">
        <h1 id="signup-title">Create a DEV@Deakin Account</h1>

        <form className="auth-form signup-form" onSubmit={handleSubmit}>
          <label htmlFor="signup-name">Name*</label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <label htmlFor="signup-email">Email*</label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="signup-password">Password*</label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            minLength="6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="signup-confirm-password">Confirm password*</label>
          <input
            id="signup-confirm-password"
            type="password"
            autoComplete="new-password"
            minLength="6"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p className="form-message" role="alert">{error}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create'}
          </button>
        </form>

        <div style={{ marginTop: '16px' }}>
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
        </div>

        <p className="auth-switch-text" style={{ marginTop: '12px' }}>
          Already have an account? <Link to="/login" className="auth-purple-link">Login</Link>
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

export default Signup;
