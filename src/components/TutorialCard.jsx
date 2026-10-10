import React from 'react';
import { Star } from 'lucide-react';

// Single tutorial card component taking props for image, title, description, rating, and username
function TutorialCard({ image, title, description, rating, username }) {
  return (
    <div className="card">
      <img src={image} alt={title} className="card-img" />
      <h3 className="card-title">{title}</h3>
      <p className="card-desc">{description}</p>
      <div className="card-footer">
        <span className="card-rating">
          <Star size={16} fill="#f59e0b" color="#f59e0b" /> {rating}
        </span>
        <span className="card-author">{username}</span>
      </div>
    </div>
  );
}

export default TutorialCard;

