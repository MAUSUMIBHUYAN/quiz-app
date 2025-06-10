import React, { useState } from "react";
import {
  auth,
  provider,
  signInWithPopup,
} from "../config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function QuizMaster() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).catch((err) => {
      setMessage("Google Sign-in Error: " + err.message);
    });
  };

  const signInWithEmail = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setMessage(""); // Clear message on success
      })
      .catch((err) => {
        setMessage("Sign-in Error: " + err.message);
      });
  };

  const signUpWithEmail = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setMessage("User registered! Please sign in.");
        setIsSignUp(false); // Switch to sign in after successful sign-up
        setEmail("");
        setPassword("");
      })
      .catch((err) => {
        setMessage("Sign-up Error: " + err.message);
      });
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email address first");
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setMessage(`Password reset email sent to ${email}. Check your inbox!`);
        setIsForgotPassword(false);
      })
      .catch((err) => {
        setMessage("Error: " + err.message);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-400 to-lime-400 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-600 mb-2">QuizMaster 🧠</h1>
          <p className="text-gray-600">
            {isSignUp
              ? "Create a new account"
              : "Test your knowledge and view your score!"}
          </p>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              message.toLowerCase().includes("error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        {isForgotPassword ? (
          <form onSubmit={handlePasswordReset} className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Reset Password</h2>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition font-medium"
              >
                Send Reset Link
              </button>
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <form
              onSubmit={isSignUp ? signUpWithEmail : signInWithEmail}
              className="mb-6"
            >
              <input
                type="email"
                placeholder="Email address"
                value={email}
                className="w-full px-4 py-3 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition font-medium mb-4"
              >
                {isSignUp ? "Sign Up" : "Sign In"}
              </button>
            </form>

            {!isSignUp && (
              <div className="text-center mb-4">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            <div className="text-center mb-4">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setMessage("");
                }}
                className="text-emerald-600 hover:text-emerald-800 font-medium"
              >
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </button>
            </div>
          </>
        )}

        <div className="flex items-center mb-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium shadow-sm"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google logo"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}