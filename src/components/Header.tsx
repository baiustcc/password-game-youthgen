"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      className="w-full bg-slate-900 border-b-2 border-green-500 p-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Image src="/logo-white.png" alt="BAIUST Computer Club" width={50} height={50} className="rounded-full" />
          <div>
            <h1 className="text-2xl font-bold text-green-400 font-comic">Password Game Challenge</h1>
            <p className="text-sm text-gray-300">By BAIUST Computer Club × TECHious</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-yellow-400">🎁 Win 3 VIP Tickets</p>
          <p className="text-sm text-gray-300">to YouthGEN Event!</p>
        </div>
      </div>
    </motion.header>
  );
}
