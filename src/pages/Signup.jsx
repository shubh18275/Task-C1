import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Signup() {
  const navigate = useNavigate();

  // Form input states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status and error states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    let accountCreated = false;

    try {
      // 1. Create user in Firebase Auth
      const newUser = await createUserWithEmailAndPassword(auth, email.trim(), password);
      accountCreated = true;

      // 2. Save user profile into Firestore database
      await setDoc(doc(db, 'users', newUser.user.uid), {
        fullName: name,
        email: newUser.user.email,
      });

      // 3. Sign out and redirect to login page
      await signOut(auth);
      navigate('/login');

    } catch (err) {
      if (accountCreated) {
        await signOut(auth).catch(() => {});
        setError('Your account was created, but Firestore could not save your profile. Publish the rules in firestore.rules, then log in with this account. Do not sign up again.');
      } else {
        if (err.code === 'auth/email-already-in-use') {
          setError('An account already uses this email. Log in with it instead.');
        } else if (err.code === 'auth/invalid-email') {
          setError('Enter a valid email address.');
        } else if (err.code === 'auth/weak-password') {
          setError('Choose a password with at least 6 characters.');
        } else {
          setError('Unable to create your account. Please try again.');
        }
      }
    } finally {
      setLoading(false);
    }
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

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}

export default Signup;

