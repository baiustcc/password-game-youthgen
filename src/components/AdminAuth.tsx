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
    <main className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* Enhanced paper texture background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 15% 25%, rgba(173, 216, 230, 0.05) 0%, transparent 45%),
                    radial-gradient(circle at 85% 75%, rgba(240, 248, 255, 0.05) 0%, transparent 45%),
                    radial-gradient(circle at 50% 15%, rgba(245, 245, 245, 0.05) 0%, transparent 45%)`,
        }}
      ></div>
      <div className="container mx-auto px-4 py-8 max-w-md">
        <GameCard className="border-4 border-gray-800 relative" animate={false}>
          <div className="absolute inset-0" style={{ boxShadow: "8px 8px 0px 0px rgba(0, 0, 0, 0.15)" }}></div>
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="mb-6">
                <Lock className="w-16 h-16 text-gray-800 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-800 mb-2 font-sketch" style={{ transform: "rotate(-0.3deg)" }}>
                  🔒 Admin Portal
                </h1>
                <p className="text-gray-700 font-handwritten" style={{ transform: "rotate(0.1deg)" }}>
                  Enter your credentials to access the admin panel
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-bold text-gray-800 mb-2 text-left font-sketch"
                    style={{ transform: "rotate(-0.1deg)" }}
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 bg-white border-2 border-gray-800 rounded-none text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-gray-900 transition-all duration-200"
                    style={{
                      boxShadow: "2px 2px 0px 0px rgba(0, 0, 0, 0.1)",
                      transform: "rotate(-0.2deg)",
                    }}
                    placeholder="Enter admin username"
                    required
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-bold text-gray-800 mb-2 text-left font-sketch"
                    style={{ transform: "rotate(-0.1deg)" }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 bg-white border-2 border-gray-800 rounded-none text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-gray-900 transition-all duration-200 pr-12"
                      style={{
                        boxShadow: "2px 2px 0px 0px rgba(0, 0, 0, 0.1)",
                        transform: "rotate(-0.2deg)",
                      }}
                      placeholder="Enter admin password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 border-2 border-red-800 rounded-none p-3"
                    style={{
                      boxShadow: "3px 3px 0px 0px rgba(220, 38, 38, 0.2)",
                      transform: "rotate(-0.2deg)",
                    }}
                  >
                    <p className="text-red-700 text-sm font-handwritten">{error}</p>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-none border-2 border-gray-800 transition-all duration-200 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  } font-sketch`}
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                  style={{
                    boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 0.2)",
                    transform: "rotate(0.3deg)",
                  }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800"></div>
                      <span className="font-handwritten">Authenticating...</span>
                    </div>
                  ) : (
                    "🔓 Access Admin Panel"
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </GameCard>
      </div>
    </main>
  );
}
