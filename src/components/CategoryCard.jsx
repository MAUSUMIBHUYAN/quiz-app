// src/components/CategoryCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function CategoryCard({ name, description, icon, color }) {
  // Format the category name to match your URL structure
  const formattedName = name.replace(/\s+/g, '-').replace('&', 'and').toLowerCase();
  
  return (
    <div 
      className="category-card"
      style={{ '--card-color': color }}
    >
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h2>{name}</h2>
        <p>{description}</p>
      </div>
      <Link 
        to={`/quiz/${formattedName}`} 
        className="start-btn"
      >
        Start Quiz
        <span className="btn-arrow">→</span>
      </Link>
    </div>
  );
}