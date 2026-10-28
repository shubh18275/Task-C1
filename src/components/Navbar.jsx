import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Navigation bar component displayed at the top of the website
function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <div className="site-nav-left">
          <Link className="site-brand" to="/">DEV@Deakin</Link>

          <form className="site-search" role="search" onSubmit={(event) => event.preventDefault()}>
            <input aria-label="Search" placeholder="Search..." />
          </form>
        </div>

        <div className="site-nav-actions">
          <a className="nav-page-link" href="/#about">About</a>
          <a className="nav-page-link" href="/#work">Work</a>
          <a className="nav-page-link" href="/#contact">Contact</a>
          <Link className="post-link" to="/post">Post</Link>

          {currentUser ? (
            <div className="nav-user-logged">
              <span className="nav-greeting" title={currentUser.email}>
                Welcome, {currentUser.fullName ? currentUser.fullName.split(' ')[0] : currentUser.email.split('@')[0]}
              </span>
              <button 
                type="button" 
                className="nav-logout-btn" 
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          ) : (
            <Link className="login-link" to="/login">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
