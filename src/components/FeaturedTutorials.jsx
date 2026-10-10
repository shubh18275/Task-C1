import React from 'react';
import TutorialCard from './TutorialCard';

function FeaturedTutorials() {
  const tutorials = [
    {
      id: 1,
      image: "/images/gallery1.jpg",
      title: "JS6 Fundamentals",
      description: "Modern ES6+ JavaScript concepts and syntax.",
      rating: 5,
      username: "code_master"
    },
    {
      id: 2,
      image: "/images/gallery2.jpg",
      title: "React Router Course",
      description: "Building single page application routing.",
      rating: 5,
      username: "web_dev_guru"
    },
    {
      id: 3,
      image: "/images/gallery3.jpg",
      title: "Express Backend",
      description: "RESTful API creation with Express framework.",
      rating: 4.9,
      username: "node_ninja"
    }
  ];

  return (
    <section className="section-container">
      <h2 className="section-title">Featured Tutorials</h2>
      <div className="cards-grid">
        {tutorials.map((tutorial) => (
          <TutorialCard
            key={tutorial.id}
            image={tutorial.image}
            title={tutorial.title}
            description={tutorial.description}
            rating={tutorial.rating}
            username={tutorial.username}
          />
        ))}
      </div>
      <div className="center-btn">
        <button className="action-btn">See all tutorials</button>
      </div>
    </section>
  );
}

export default FeaturedTutorials;
