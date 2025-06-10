import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/theme-context";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

import {
  FaMoon,
  FaSun,
  FaUserCircle,
  FaPowerOff,
} from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, setUser } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navGradient =
    theme === "dark"
      ? "bg-gradient-to-br from-gray-900 to-green-900"
      : "bg-gradient-to-br from-emerald-400 to-lime-400";

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logged out successfully!");
        setOpen(false);
      })
      .catch((error) => {
        toast.error("Logout failed: " + error.message);
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <nav
      className={`w-full flex justify-between items-center px-4 sm:px-6 py-4 ${navGradient} text-white shadow-lg sticky top-0 z-50`}
    >
      {/* Left section */}
      <div className="flex items-center space-x-2 text-2xl font-bold">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-lime-100">
          QuizMaster
        </span>
        <span>🧠</span>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full backdrop-blur-sm bg-white/20 hover:bg-white/30 dark:hover:bg-black/40 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <FaSun className="text-amber-300 text-xl" />
          ) : (
            <FaMoon className="text-white text-xl" />
          )}
        </button>

        {/* User section with dropdown */}
        {user && (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-sm bg-white/20 dark:bg-black/30 hover:bg-white/30 dark:hover:bg-black/40 transition-colors"
            >
              {/* Profile image or fallback icon */}
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <FaUserCircle className="text-xl text-white" />
              )}
              {/* Show name only on larger screens */}
              <span className="hidden sm:inline text-sm md:text-base font-medium text-white">
                {user.name}
              </span>
              {open ? (
                <FiChevronUp className="text-white" />
              ) : (
                <FiChevronDown className="text-white" />
              )}
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-56 shadow-xl rounded-lg overflow-hidden z-50 backdrop-blur-sm bg-white dark:bg-zinc-900 border border-white/20">
                <div className="px-4 py-3 border-b border-white/20 bg-white dark:bg-zinc-800">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {user.email}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-emerald-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200"
                >
                  <FaPowerOff className="text-emerald-600 dark:text-emerald-400" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
