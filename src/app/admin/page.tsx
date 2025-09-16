"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, CheckCircle, Clock, Mail, GraduationCap } from "lucide-react";
import Header from "@/components/Header";
import GameCard from "@/components/GameCard";
import { UserSubmission } from "@/types";

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "completed" | "in-progress">("all");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/users");
      const result = await response.json();

      if (result.success) {
        setSubmissions(result.users);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    if (filter === "completed") return submission.completed;
    if (filter === "in-progress") return !submission.completed;
    return true;
  });

  const completedCount = submissions.filter((s) => s.completed).length;
  const totalCount = submissions.length;

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-green-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto"></div>
            <p className="text-green-400 mt-4">Loading submissions...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-green-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-400 mb-2">🏆 Admin Portal 🏆</h1>
            <p className="text-gray-300">Monitor all password game submissions</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <GameCard>
              <div className="flex items-center space-x-4">
                <Users className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-blue-400">{totalCount}</p>
                  <p className="text-gray-300">Total Participants</p>
                </div>
              </div>
            </GameCard>

            <GameCard>
              <div className="flex items-center space-x-4">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-yellow-400">{completedCount}</p>
                  <p className="text-gray-300">Winners</p>
                </div>
              </div>
            </GameCard>

            <GameCard>
              <div className="flex items-center space-x-4">
                <Clock className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-green-400">{totalCount - completedCount}</p>
                  <p className="text-gray-300">In Progress</p>
                </div>
              </div>
            </GameCard>
          </div>

          {/* Filter Buttons */}
          <div className="mb-6">
            <div className="flex space-x-4 justify-center">
              {(["all", "completed", "in-progress"] as const).map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 ${
                    filter === filterOption ? "bg-green-500 text-white" : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                  }`}
                >
                  {filterOption === "all" ? "All" : filterOption === "completed" ? "Completed" : "In Progress"}
                </button>
              ))}
            </div>
          </div>

          {/* Submissions List */}
          <GameCard>
            <h2 className="text-2xl font-bold text-green-400 mb-6">Submissions ({filteredSubmissions.length})</h2>

            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No submissions found for the selected filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left py-3 px-4 text-green-400">Status</th>
                      <th className="text-left py-3 px-4 text-green-400">Name</th>
                      <th className="text-left py-3 px-4 text-green-400">Email</th>
                      <th className="text-left py-3 px-4 text-green-400">Level</th>
                      <th className="text-left py-3 px-4 text-green-400">Department</th>
                      <th className="text-left py-3 px-4 text-green-400">Started</th>
                      <th className="text-left py-3 px-4 text-green-400">Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.map((submission, index) => (
                      <motion.tr
                        key={submission.id}
                        className="border-b border-slate-700 hover:bg-slate-700/30"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <td className="py-3 px-4">
                          {submission.completed ? (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-green-400 text-sm">Winner</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4 text-yellow-400" />
                              <span className="text-yellow-400 text-sm">Playing</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-white font-bold">{submission.name}</td>
                        <td className="py-3 px-4 text-gray-300">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm">{submission.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          <div className="flex items-center space-x-1">
                            <GraduationCap className="w-4 h-4" />
                            <span>
                              L{submission.level} T{submission.term}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-300 text-sm">{submission.dept}</td>
                        <td className="py-3 px-4 text-gray-400 text-sm">
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-gray-400 text-sm">
                          {submission.completedAt ? new Date(submission.completedAt).toLocaleDateString() : "-"}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GameCard>

          {/* Winners Section */}
          {completedCount > 0 && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <GameCard>
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">🏆 Winners - VIP Ticket Recipients 🏆</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {submissions
                    .filter((s) => s.completed)
                    .map((winner, index) => (
                      <motion.div
                        key={winner.id}
                        className="bg-gradient-to-r from-yellow-600/20 to-yellow-400/20 border border-yellow-400 rounded-lg p-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <Trophy className="w-5 h-5 text-yellow-400" />
                          <span className="font-bold text-yellow-400">#{index + 1}</span>
                        </div>
                        <h3 className="font-bold text-white">{winner.name}</h3>
                        <p className="text-sm text-gray-300">
                          Level {winner.level} • {winner.dept}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Completed: {new Date(winner.completedAt!).toLocaleString()}
                        </p>
                      </motion.div>
                    ))}
                </div>
              </GameCard>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
