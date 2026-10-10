import React from 'react';
import ArticleCard from './ArticleCard';

function FeaturedArticles() {
  const articles = [
    {
      id: 1,
      image: "/images/project1.jpg",
      title: "Arduino LED Control",
      description: "A basic Arduino circuit created to control and blink a single LED on a breadboard.",
      rating: 5,
      author: "Shubh Batra"
    },
    {
      id: 2,
      image: "/images/project2.jpg",
      title: "LED Control via Button",
      description: "An interactive Arduino project using push buttons to turn LEDs on and off.",
      rating: 5,
      author: "Shubh Batra"
    },
    {
      id: 3,
      image: "/images/project3.jpg",
      title: "Arduino Multi-LED Sequence",
      description: "A circuit built with multiple LEDs wired together to display sequential lighting patterns.",
      rating: 5,
      author: "Shubh Batra"
    }
  ];

  return (
    <section id="work" className="section-container">
      <h2 className="section-title">Featured Articles</h2>
      <div className="cards-grid">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            image={article.image}
            title={article.title}
            description={article.description}
            rating={article.rating}
            author={article.author}
          />
        ))}
      </div>
      <div className="center-btn">
        <button className="action-btn">See all articles</button>
      </div>
    </section>
  );
}

export default FeaturedArticles;
