import React from 'react';

function AuthorProfile() {
  return (
    <section id="about" className="about-section">
      <h1>Author Profile</h1>
      <img className="profile-pic" src="/passport-photo.png" alt="Profile photo" />
      <p className="about-bio">
        I am a student passionate about web development and technology. I enjoy learning how to code, build web pages, and experiment with electronic circuits.
      </p>
      <hr />
      <h2>Here's what I've done so far</h2>
    </section>
  );
}

export default AuthorProfile;
