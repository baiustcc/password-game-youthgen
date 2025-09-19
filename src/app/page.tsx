"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import GameCard from "@/components/GameCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      {/* Enhanced paper texture background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 10% 20%, rgba(173, 216, 230, 0.04) 0%, transparent 40%),
                    radial-gradient(circle at 90% 80%, rgba(240, 248, 255, 0.04) 0%, transparent 40%),
                    radial-gradient(circle at 50% 10%, rgba(245, 245, 245, 0.04) 0%, transparent 40%)`,
        }}
      ></div>
      <Header />

      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <GameCard className="border-4 border-gray-800 relative text-center">
            <div className="absolute inset-0" style={{ boxShadow: "8px 8px 0px 0px rgba(0, 0, 0, 0.15)" }}></div>
            <div className="relative space-y-6 py-8">
              {/* Lock Icon with Animation */}
              <motion.div
                className="text-7xl"
                animate={{ 
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                🔒
              </motion.div>

              {/* Main Heading */}
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-800 font-sketch">
                  Game Temporarily Unavailable
                </h2>
                <p className="text-gray-600 font-handwritten text-lg">
                  We&apos;ll be back soon with exciting updates!
                </p>
              </div>

              {/* Message Box */}
              <div className="bg-blue-50 p-6 rounded-none border-2 border-blue-800 mx-4"
                   style={{ boxShadow: "4px 4px 0px 0px rgba(30, 64, 175, 0.1)" }}>
                <p className="text-gray-700 font-handwritten text-lg">
                  Thank you for your interest in the Password Game Challenge by BAIUST Computer Club!
                </p>
                <p className="text-gray-700 font-handwritten mt-3">
                  We&apos;re currently making improvements to enhance your gaming experience. 
                  The game will be available again soon for public access.
                </p>
              </div>

              {/* Coming Soon Section */}
              <div className="bg-yellow-50 p-6 rounded-none border-2 border-yellow-800 mx-4"
                   style={{ boxShadow: "4px 4px 0px 0px rgba(161, 98, 7, 0.1)" }}>
                <h3 className="text-xl font-bold text-gray-800 font-sketch mb-2">
                  Coming Back Soon!
                </h3>
                <p className="text-gray-700 font-handwritten">
                  Stay tuned for updates from BAIUST Computer Club.
                </p>
                <p className="text-gray-700 font-handwritten mt-2">
                  Follow our social media for the latest announcements.
                </p>
              </div>

              {/* Footer Tip */}
              <div className="text-sm text-gray-600 font-handwritten px-4">
                💡 <strong>Tip:</strong> Bookmark this page to easily return when we&apos;re back!
              </div>
            </div>
          </GameCard>
        </motion.div>
      </div>

      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Floating decorative elements */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-gray-200 opacity-50"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {['🔒', '🎮', '⚡', '⭐', '💡'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>
    </main>
  );
}