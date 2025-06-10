// src/pages/Home.jsx
import React from "react";
import CategoryCard from "../components/CategoryCard";

const categories = [
  { name: "Programming", description: "Test your coding knowledge", icon: "💻", color: "#4e79a7" },
  { name: "Web Development", description: "HTML, CSS, JavaScript and more", icon: "🌐", color: "#76b7b2" },
  { name: "ML & AI", description: "Machine Learning and Artificial Intelligence", icon: "🤖", color: "#b07aa1" },
  { name: "Electrical", description: "Explore circuits and currents", icon: "⚡", color: "#f28e2b" },
  { name: "Riddles", description: "Fun and tricky mind challenges", icon: "🤔", color: "#edc948" },
  { name: "Logical Reasoning", description: "Crack puzzles and brain teasers", icon: "🧩", color: "#59a14f" },
  { name: "Movies & TV", description: "Test your pop culture knowledge", icon: "🎬", color: "#6A5ACD" },
  { name: "General Knowledge", description: "Facts from around the world", icon: "🧠", color: "#ff9da7" },

];

export default function Home() {
  return (
    <div className="home-container">
      
      <header className="relative max-w-[1000px] mx-auto mb-10 py-16 px-5 md:px-8 text-center rounrelative max-w-[1000px] mx-auto mb-10 py-16 px-5 md:px-8 text-center rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-green-600 via-emerald-500 to-lime-400 animate-gradient-shift">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-md">
          QuizMaster 🧠
        </h1>
        <p className="text-xl md:text-2xl max-w-[600px] mx-auto mb-8 font-medium text-white/95">
          Challenge your knowledge across diverse categories 🚀
        </p>
      </header>
      
      <div className="text-center mb-12">
        <h2 className="section-title text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-lime-500">
          Explore Categories 🗂️
        </h2>
        <p className="section-subtitle text-lg text-emerald-700/100 dark:text-emerald-300/100">
          Select a topic to begin your quiz journey ✨
        </p>
        <div className="flex justify-center mt-4">
          <span className="inline-block h-1 w-20 rounded-full bg-gradient-to-r from-emerald-400 to-lime-400"></span>
        </div>
        
        <div className="category-grid">
          {categories.map((cat, index) => (
            <CategoryCard 
              key={index} 
              name={cat.name} 
              description={cat.description} 
              icon={cat.icon}
              color={cat.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}