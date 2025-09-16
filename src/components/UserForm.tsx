"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import { UserSubmission } from "@/types";
import GameCard from "./GameCard";

const schema = yup.object({
  name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  level: yup.number().required("Level is required").min(1).max(4),
  term: yup.string().required("Term is required").oneOf(["I", "II"]),
  dept: yup.string().required("Department is required").min(2, "Department must be at least 2 characters"),
  email: yup.string().required("Email is required").email("Invalid email format"),
});

interface UserFormProps {
  onSubmit: (data: Partial<UserSubmission>) => void;
  loading?: boolean;
}

export default function UserForm({ onSubmit, loading = false }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <GameCard className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h2 className="text-3xl font-bold text-center text-green-400 mb-2 font-comic">
          🎮 Welcome to the Password Game! 🎮
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Enter your information to start the challenge and win 3 VIP tickets to YouthGEN Event!
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-green-400 mb-2">Full Name *</label>
              <input {...register("name")} className="game-input" placeholder="Enter your full name" />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-green-400 mb-2">Email *</label>
              <input {...register("email")} type="email" className="game-input" placeholder="your.email@example.com" />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-green-400 mb-2">Level *</label>
              <select {...register("level")} className="game-input">
                <option value="">Select Level</option>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
                <option value="4">Level 4</option>
              </select>
              {errors.level && <p className="text-red-400 text-sm mt-1">{errors.level.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-green-400 mb-2">Term *</label>
              <select {...register("term")} className="game-input">
                <option value="">Select Term</option>
                <option value="I">Term I</option>
                <option value="II">Term II</option>
              </select>
              {errors.term && <p className="text-red-400 text-sm mt-1">{errors.term.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-green-400 mb-2">Department *</label>
              <input {...register("dept")} className="game-input" placeholder="e.g., Computer Science & Engineering" />
              {errors.dept && <p className="text-red-400 text-sm mt-1">{errors.dept.message}</p>}
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full game-button ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            whileHover={!loading ? { scale: 1.05 } : {}}
            whileTap={!loading ? { scale: 0.95 } : {}}
          >
            {loading ? "Starting Game..." : "🚀 Start the Password Challenge!"}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>🏆 Complete all rules to win 3 VIP tickets to YouthGEN Event!</p>
          <p className="mt-2">Organized by BAIUST Computer Club in collaboration with TECHious</p>
        </div>
      </motion.div>
    </GameCard>
  );
}
