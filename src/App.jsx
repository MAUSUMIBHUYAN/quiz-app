// src/App.jsx
import React from "react";
import { ThemeProvider } from "./context/theme-context";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import QuizMaster from "./pages/QuizMaster";
import QuizPage from "./pages/QuizPage";
import ReviewPage from "./pages/ReviewPage"; 

function Content() {
  const { user } = useAuth();

  if (!user) {
    return <QuizMaster />;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz/:category" element={<QuizPage />} />
          <Route path="/review" element={<ReviewPage />} /> 
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="min-h-screen transition-colors duration-300">
          <Content />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
