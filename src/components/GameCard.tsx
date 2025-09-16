"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GameCardProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export default function GameCard({ children, className = "", animate = true }: GameCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  if (!animate) {
    return <div className={`game-card ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      className={`game-card ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {children}
    </motion.div>
  );
}
