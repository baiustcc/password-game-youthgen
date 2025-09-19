"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      className="w-full bg-white border-b-4 border-gray-800 p-4 rounded-none relative overflow-hidden"
      style={{
        boxShadow: "0px 6px 0px 0px rgba(0, 0, 0, 0.15)",
        transform: "rotate(-0.1deg)",
        background: `linear-gradient(135deg, #ffffff 0%, #f8f9fa 25%, #f0f8ff 50%, #f5f5f5 75%, #f8f9fa 100%)`,
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 30%, rgba(173, 216, 230, 0.03) 0%, transparent 50%),
                    radial-gradient(circle at 80% 70%, rgba(240, 248, 255, 0.03) 0%, transparent 50%)`,
        }}
      ></div>

      <div className="max-w-4xl mx-auto flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Image
              src="/logo-black.png"
              alt="BAIUST Computer Club"
              width={50}
              height={50}
              className="rounded-none border-2 border-gray-800 relative"
              style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 0.15)" }}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 font-sketch" style={{ transform: "rotate(-0.3deg)" }}>
              Password Game Challenge
            </h1>
            <p className="text-sm text-gray-600 font-handwritten" style={{ transform: "rotate(0.1deg)" }}>
              By BAIUST Computer Club
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-blue-700 font-sketch" style={{ transform: "rotate(0.2deg)" }}>
            BAIUST Computer Club
          </p>
          <p className="text-sm text-gray-600 font-handwritten" style={{ transform: "rotate(-0.1deg)" }}>
            Department of CSE
          </p>
        </div>
      </div>
    </motion.header>
  );
}
