import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <Link className="site-brand" to="/">DEV@Deakin</Link>

      <form className="site-search" role="search" onSubmit={(event) => event.preventDefault()}>
        <input aria-label="Search" placeholder="Search" />
        <button type="submit" aria-label="Submit search">⌕</button>
      </form>

      <div className="site-nav-actions">
        <Link className="post-link" to="/post">Post</Link>
        <Link className="login-link" to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;

