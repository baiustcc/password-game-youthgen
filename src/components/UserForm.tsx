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
  term: yup
    .string()
    .required("Term is required")
    .oneOf(["I", "II"] as const),
  dept: yup.string().required("Department is required").min(2, "Department must be at least 2 characters"),
  email: yup.string().required("Email is required").email("Invalid email format"),
});

type FormData = yup.InferType<typeof schema>;

interface UserFormProps {
  onSubmit: (data: Partial<UserSubmission>) => void;
  loading?: boolean;
}

export default function UserForm({ onSubmit, loading = false }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleFormSubmit = (data: FormData) => {
    const submissionData: Partial<UserSubmission> = {
      name: data.name,
      level: Number(data.level),
      term: data.term as "I" | "II",
      dept: data.dept,
      email: data.email,
    };
    onSubmit(submissionData);
  };

  return (
    <GameCard className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h2
          className="text-3xl font-bold text-center text-gray-800 mb-2 font-sketch"
          style={{ transform: "rotate(-0.3deg)" }}
        >
          🎮 Welcome to the Password Game! 🎮
        </h2>
        <p className="text-center text-gray-700 mb-6 font-handwritten" style={{ transform: "rotate(0.1deg)" }}>
          Enter your information to start the password challenge!
        </p>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-sm font-bold text-gray-800 mb-2 font-sketch"
                style={{ transform: "rotate(-0.1deg)" }}
              >
                Full Name *
              </label>
              <input {...register("name")} className="game-input" placeholder="Enter your full name" />
              {errors.name && (
                <p className="text-red-700 text-sm mt-1 font-handwritten" style={{ transform: "rotate(0.1deg)" }}>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-bold text-gray-800 mb-2 font-sketch"
                style={{ transform: "rotate(-0.1deg)" }}
              >
                Email *
              </label>
              <input {...register("email")} type="email" className="game-input" placeholder="your.email@example.com" />
              {errors.email && (
                <p className="text-red-700 text-sm mt-1 font-handwritten" style={{ transform: "rotate(0.1deg)" }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-bold text-gray-800 mb-2 font-sketch"
                style={{ transform: "rotate(-0.1deg)" }}
              >
                Level *
              </label>
              <select {...register("level")} className="game-input">
                <option value="">Select Level</option>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
                <option value="4">Level 4</option>
              </select>
              {errors.level && (
                <p className="text-red-700 text-sm mt-1 font-handwritten" style={{ transform: "rotate(0.1deg)" }}>
                  {errors.level.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-bold text-gray-800 mb-2 font-sketch"
                style={{ transform: "rotate(-0.1deg)" }}
              >
                Term *
              </label>
              <select {...register("term")} className="game-input">
                <option value="">Select Term</option>
                <option value="I">Term I</option>
                <option value="II">Term II</option>
              </select>
              {errors.term && (
                <p className="text-red-700 text-sm mt-1 font-handwritten" style={{ transform: "rotate(0.1deg)" }}>
                  {errors.term.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                className="block text-sm font-bold text-gray-800 mb-2 font-sketch"
                style={{ transform: "rotate(-0.1deg)" }}
              >
                Department *
              </label>
              <input {...register("dept")} className="game-input" placeholder="e.g., Computer Science & Engineering" />
              {errors.dept && (
                <p className="text-red-700 text-sm mt-1 font-handwritten" style={{ transform: "rotate(0.1deg)" }}>
                  {errors.dept.message}
                </p>
              )}
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full game-button ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            whileHover={!loading ? { scale: 1.05 } : {}}
            whileTap={!loading ? { scale: 0.95 } : {}}
            style={{
              boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 0.2)",
              transform: "rotate(0.3deg)",
            }}
          >
            {loading ? "Starting Game..." : "🚀 Start the Password Challenge!"}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-700">
          <p className="font-handwritten" style={{ transform: "rotate(-0.1deg)" }}>
            🏆 Complete all rules to master the password challenge!
          </p>
          <p className="mt-2 font-handwritten" style={{ transform: "rotate(0.1deg)" }}>
            Organized by BAIUST Computer Club
          </p>
        </div>
      </motion.div>
    </GameCard>
  );
}
