import React from 'react';

// Top banner component showing the header image and welcome text
function Banner() {
  return (
    <div className="banner">
      <img src="/images/banner.jpg" alt="Deakin University Banner" />
      <div className="banner-text">
        Hey, I'm Shubh
      </div>
    </div>
  );
}

export default Banner;
