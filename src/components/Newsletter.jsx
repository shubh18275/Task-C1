import React from 'react';

function Newsletter() {
  return (
    <div className="newsletter-bar">
      <span className="newsletter-text">SIGN UP FOR OUR DAILY INSIDER</span>
      <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
        <input type="email" placeholder="Enter your email" required />
        <button type="submit">Subscribe</button>
      </form>
    </div>
  );
}

export default Newsletter;
