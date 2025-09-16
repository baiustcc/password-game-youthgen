"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import UserForm from "@/components/UserForm";
import PasswordGame from "@/components/PasswordGame";
import GameCard from "@/components/GameCard";
import { UserSubmission } from "@/types";

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserSubmission | null>(null);
  const [existingUser, setExistingUser] = useState<UserSubmission | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPlayAgainPrompt, setShowPlayAgainPrompt] = useState(false);
  const [checkingLocalStorage, setCheckingLocalStorage] = useState(true);

  // Check localStorage for existing user data on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem("passwordGameUser");
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setCurrentUser(userData);
        setShowPlayAgainPrompt(false);
        setExistingUser(null);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("passwordGameUser");
      }
    }
    setCheckingLocalStorage(false);
  }, []);

  const handleUserSubmit = async (userData: Partial<UserSubmission>) => {
    setLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        // Store user data in localStorage
        localStorage.setItem("passwordGameUser", JSON.stringify(result.user));

        setCurrentUser(result.user);
        setShowPlayAgainPrompt(false);
        setExistingUser(null);
      } else if (response.status === 400 && result.error.includes("already exists")) {
        // User already exists, fetch their data
        const existingResponse = await fetch(`/api/users?email=${encodeURIComponent(userData.email!)}`);
        const existingResult = await existingResponse.json();

        if (existingResult.success && existingResult.users.length > 0) {
          const user = existingResult.users[0];
          setExistingUser(user);
          setShowPlayAgainPrompt(true);
        } else {
          alert(result.error || "Failed to start the game");
        }
      } else {
        alert(result.error || "Failed to start the game");
      }
    } catch (error) {
      console.error("Error submitting user data:", error);
      alert("Failed to start the game. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAgain = () => {
    if (existingUser) {
      // Store user data in localStorage when playing again
      localStorage.setItem("passwordGameUser", JSON.stringify(existingUser));

      setCurrentUser(existingUser);
      setShowPlayAgainPrompt(false);
      setExistingUser(null);
    }
  };

  const handleNewSubmission = () => {
    setShowPlayAgainPrompt(false);
    setExistingUser(null);
  };

  const handleGameComplete = async (finalPassword: string) => {
    if (!currentUser) return;

    try {
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ finalPassword }),
      });

      const result = await response.json();

      if (result.success) {
        // Update localStorage with completed game data
        localStorage.setItem("passwordGameUser", JSON.stringify(result.user));

        setCurrentUser(result.user);
      } else {
        console.error("Failed to save completion:", result.error);
      }
    } catch (error) {
      console.error("Error saving game completion:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("passwordGameUser");
    setCurrentUser(null);
    setExistingUser(null);
    setShowPlayAgainPrompt(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-green-900">
      <Header />

      {/* Logout button - only show when user is logged in */}
      {currentUser && (
        <div className="absolute top-4 right-4 z-50">
          <motion.button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🚪 Logout
          </motion.button>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {checkingLocalStorage ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center min-h-[60vh]"
          >
            <div className="text-center">
              <div className="text-6xl mb-4 animate-spin">⚡</div>
              <div className="text-xl text-white font-comic">Loading your game...</div>
            </div>
          </motion.div>
        ) : showPlayAgainPrompt && existingUser ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <GameCard>
              <div className="text-center space-y-6">
                <div className="text-6xl mb-4">🎮</div>
                <h2 className="text-3xl font-bold text-green-400 font-comic">Welcome Back, {existingUser.name}!</h2>
                <p className="text-gray-300 text-lg">We found an existing submission for your email.</p>

                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Your Previous Result:</div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">
                      Level {existingUser.level} • Term {existingUser.term} • {existingUser.dept}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        existingUser.completed
                          ? "bg-green-900/30 text-green-400 border border-green-500"
                          : "bg-yellow-900/30 text-yellow-400 border border-yellow-500"
                      }`}
                    >
                      {existingUser.completed ? "🏆 Completed" : "⏳ In Progress"}
                    </span>
                  </div>
                  {existingUser.completed && existingUser.completedAt && (
                    <div className="text-sm text-gray-400 mt-2">
                      Completed: {new Date(existingUser.completedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <p className="text-gray-300">
                    Would you like to play again for better results or try a different approach?
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.button
                      onClick={handlePlayAgain}
                      className="game-button bg-green-500 hover:bg-green-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🎯 Play Again
                    </motion.button>

                    <motion.button
                      onClick={handleNewSubmission}
                      className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-lg transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      📝 Use Different Email
                    </motion.button>
                  </div>
                </div>

                <div className="text-sm text-gray-400">
                  💡 <strong>Tip:</strong> Each attempt helps you learn the rules better!
                </div>
              </div>
            </GameCard>
          </motion.div>
        ) : !currentUser ? (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <UserForm onSubmit={handleUserSubmit} loading={loading} />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <div className="mb-6 text-center">
              <motion.h2
                className="text-2xl font-bold text-green-400 mb-2"
                animate={{
                  scale: [1, 1.05, 1],
                  color: ["#22c55e", "#16a34a", "#22c55e"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Welcome, {currentUser.name}! 🎮
              </motion.h2>
              <p className="text-gray-300">
                Level {currentUser.level} • Term {currentUser.term} • {currentUser.dept}
              </p>
            </div>

            <PasswordGame userSubmission={currentUser} onGameComplete={handleGameComplete} />
          </motion.div>
        )}
      </div>

      {/* Background Animation */}
      <div className="fixed inset-0 -z-10 overflow-hidden">{/* Animated background particles */}</div>
    </main>
  );
}
