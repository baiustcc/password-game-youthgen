"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";
import GameCard from "./GameCard";

interface AdminAuthProps {
  onAuthenticated: () => void;
}

// Simple admin credentials - in production, use proper authentication
const ADMIN_USERNAME = "bcc_admin";
const ADMIN_PASSWORD = "passwordgame2025";

export default function AdminAuth({ onAuthenticated }: AdminAuthProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate authentication delay
    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        onAuthenticated();
      } else {
        setError("Invalid username or password");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-green-900 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <GameCard>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-6">
              <Lock className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-green-400 mb-2">🔒 Admin Portal</h1>
              <p className="text-gray-300">Enter your credentials to access the admin panel</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-green-400 mb-2 text-left">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 bg-slate-700 border-2 border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                  placeholder="Enter admin username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-green-400 mb-2 text-left">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-slate-700 border-2 border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 pr-12"
                    placeholder="Enter admin password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-900/30 border border-red-500 rounded-lg p-3"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className={`w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  "🔓 Access Admin Panel"
                )}
              </motion.button>
            </form>
          </motion.div>
        </GameCard>
      </div>
    </main>
  );
}
