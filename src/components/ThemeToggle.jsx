import React from "react";
import { useTheme } from "../context/theme-context";
import { FaMoon, FaSun } from "react-icons/fa";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        float: "right",
        fontSize: "1.5em",
        color: theme === "dark" ? "#ffd700" : "#333",
        margin: "0.5rem", 
        padding: "0.5rem",
      }}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <FaSun /> : <FaMoon />}
    </button>
  );
}

export default ThemeToggle;
