import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate('/');
    } catch {
      setError('Those email and password details did not match an account. Try again or sign up for a free account.');
    } finally { setBusy(false); }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <div className="auth-card-heading">
          <h1 id="login-title">Login</h1>
          <Link className="auth-signup-link" to="/signup">Sign up</Link>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">Your email</label>
          <input id="login-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label htmlFor="login-password">Your password</label>
          <input id="login-password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <p className="form-message" role="alert">{error}</p>}
          <button className="auth-submit" type="submit" disabled={busy}>
            {busy ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
