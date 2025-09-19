"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, CheckCircle, Clock, Mail, GraduationCap, Key, Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";
import GameCard from "@/components/GameCard";
import AdminAuth from "@/components/AdminAuth";
import { UserSubmission } from "@/types";

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "completed" | "in-progress">("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated]);

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

  // Sort completed submissions by completion time (earliest first for ranking)
  const sortedFilteredSubmissions = [...filteredSubmissions].sort((a, b) => {
    if (a.completed && b.completed && a.completedAt && b.completedAt) {
      return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime();
    }
    if (a.completed && !b.completed) return -1;
    if (!a.completed && b.completed) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const togglePasswordVisibility = (submissionId: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [submissionId]: !prev[submissionId],
    }));
  };

  const completedCount = submissions.filter((s) => s.completed).length;
  const totalCount = submissions.length;

  // Show authentication screen if not authenticated
  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
            <p className="text-gray-800 mt-4 font-sketch">Loading submissions...</p>
          </div>
        </div>
      </main>
    );
  }

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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 font-sketch" style={{ transform: "rotate(-0.3deg)" }}>
              🏆 Admin Portal 🏆
            </h1>
            <p className="text-gray-700 font-handwritten" style={{ transform: "rotate(0.1deg)" }}>
              Monitor all password game submissions
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div
              className="relative border-2 border-gray-800 rounded-none"
              style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 0.1)" }}
            >
              <GameCard className="border-2 border-gray-800">
                <div className="flex items-center space-x-4">
                  <Users className="w-8 h-8 text-blue-700" />
                  <div>
                    <p className="text-2xl font-bold text-blue-700 font-sketch">{totalCount}</p>
                    <p className="text-gray-700 font-handwritten">Total Participants</p>
                  </div>
                </div>
              </GameCard>
            </div>

            <div
              className="relative border-2 border-gray-800 rounded-none"
              style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 0.1)" }}
            >
              <GameCard className="border-2 border-gray-800">
                <div className="flex items-center space-x-4">
                  <Trophy className="w-8 h-8 text-yellow-700" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-700 font-sketch">{completedCount}</p>
                    <p className="text-gray-700 font-handwritten">Winners</p>
                  </div>
                </div>
              </GameCard>
            </div>

            <div
              className="relative border-2 border-gray-800 rounded-none"
              style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 0.1)" }}
            >
              <GameCard className="border-2 border-gray-800">
                <div className="flex items-center space-x-4">
                  <Clock className="w-8 h-8 text-green-700" />
                  <div>
                    <p className="text-2xl font-bold text-green-700 font-sketch">{totalCount - completedCount}</p>
                    <p className="text-gray-700 font-handwritten">In Progress</p>
                  </div>
                </div>
              </GameCard>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="mb-6">
            <div className="flex space-x-4 justify-center">
              {(["all", "completed", "in-progress"] as const).map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-4 py-2 rounded-none font-bold transition-all duration-200 border-2 ${
                    filter === filterOption
                      ? "bg-gray-800 text-white border-gray-800"
                      : "bg-gray-200 text-gray-800 border-gray-800 hover:bg-gray-300"
                  } font-sketch`}
                  style={{
                    boxShadow:
                      filter === filterOption ? "2px 2px 0px 0px rgba(0, 0, 0, 0.2)" : "2px 2px 0px 0px rgba(0, 0, 0, 0.1)",
                    transform: "rotate(" + (filter === filterOption ? "0.2deg" : "0deg") + ")",
                  }}
                >
                  {filterOption === "all" ? "All" : filterOption === "completed" ? "Completed" : "In Progress"}
                </button>
              ))}
            </div>
          </div>

          {/* Submissions List */}
          <div
            className="relative border-2 border-gray-800 rounded-none"
            style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 0.1)" }}
          >
            <GameCard className="border-2 border-gray-800">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 font-sketch" style={{ transform: "rotate(-0.2deg)" }}>
                Submissions ({sortedFilteredSubmissions.length})
              </h2>

              {sortedFilteredSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-700 font-handwritten">No submissions found for the selected filter.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-400">
                        <th className="text-left py-3 px-4 text-gray-800 font-sketch">Rank</th>
                        <th className="text-left py-3 px-4 text-gray-800 font-sketch">Status</th>
                        <th className="text-left py-3 px-4 text-gray-800 font-sketch">Name</th>
                        <th className="text-left py-3 px-4 text-gray-800 font-sketch">Email</th>
                        <th className="text-left py-3 px-4 text-gray-800 font-sketch">Level</th>
                        <th className="text-left py-3 px-4 text-gray-800 font-sketch">Department</th>
                        <th className="text-left py-3 px-4 text-gray-800 font-sketch">Password</th>
                        <th className="text-left py-3 px-4 text-gray-800 font-sketch">Started</th>
                        <th className="text-left py-3 px-4 text-gray-800 font-sketch">Completed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedFilteredSubmissions.map((submission, index) => {
                        const isWinner = submission.completed;
                        const completedSubmissions = submissions.filter((s) => s.completed && s.completedAt);
                        const rank =
                          isWinner && submission.completedAt
                            ? completedSubmissions
                                .sort((a, b) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime())
                                .findIndex((s) => s.id === submission.id) + 1
                            : null;

                        return (
                          <motion.tr
                            key={submission.id}
                            className="border-b border-gray-300 hover:bg-gray-100"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <td className="py-3 px-4">
                              {isWinner && rank ? (
                                <div className="flex items-center space-x-1">
                                  <Trophy className="w-4 h-4 text-yellow-700" />
                                  <span className="text-yellow-700 font-bold font-sketch">#{rank}</span>
                                </div>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {submission.completed ? (
                                <div className="flex items-center space-x-1">
                                  <CheckCircle className="w-4 h-4 text-green-700" />
                                  <span className="text-green-700 text-sm font-handwritten">Winner</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4 text-yellow-700" />
                                  <span className="text-yellow-700 text-sm font-handwritten">Playing</span>
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4 text-gray-800 font-bold font-sketch">{submission.name}</td>
                            <td className="py-3 px-4 text-gray-700">
                              <div className="flex items-center space-x-1">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm font-handwritten">{submission.email}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              <div className="flex items-center space-x-1">
                                <GraduationCap className="w-4 h-4" />
                                <span className="font-handwritten">
                                  L{submission.level} T{submission.term}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-700 text-sm font-handwritten">{submission.dept}</td>
                            <td className="py-3 px-4">
                              {submission.finalPassword ? (
                                <div className="flex items-center space-x-2">
                                  <div className="flex-1 min-w-0">
                                    {showPasswords[submission.id] ? (
                                      <span className="font-mono text-sm text-green-700 break-all font-handwritten">
                                        {submission.finalPassword}
                                      </span>
                                    ) : (
                                      <span className="text-gray-500 text-sm font-handwritten">
                                        {"•".repeat(Math.min(submission.finalPassword.length, 20))}
                                        {submission.finalPassword.length > 20 ? "..." : ""}
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => togglePasswordVisibility(submission.id)}
                                    className="flex-shrink-0 p-1 text-gray-700 hover:text-gray-900 transition-colors"
                                    title={showPasswords[submission.id] ? "Hide password" : "Show password"}
                                  >
                                    {showPasswords[submission.id] ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <span className="text-gray-500 text-sm font-handwritten">No password</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-sm font-handwritten">
                              {new Date(submission.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-sm font-handwritten">
                              {submission.completedAt ? (
                                <div>
                                  <div>{new Date(submission.completedAt).toLocaleDateString()}</div>
                                  <div className="text-xs text-gray-500 font-handwritten">
                                    {new Date(submission.completedAt).toLocaleTimeString()}
                                  </div>
                                </div>
                              ) : (
                                <span className="font-handwritten">-</span>
                              )}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </GameCard>
          </div>

          {/* Winners Section */}
          {completedCount > 0 && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div
                className="relative border-2 border-gray-800 rounded-none"
                style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 0.1)" }}
              >
                <GameCard className="border-2 border-gray-800">
                  <h2
                    className="text-2xl font-bold text-yellow-700 mb-6 font-sketch"
                    style={{ transform: "rotate(-0.2deg)" }}
                  >
                    🏆 Winners Ranking (by completion time) 🏆
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {submissions
                      .filter((s) => s.completed && s.completedAt)
                      .sort((a, b) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime())
                      .map((winner, index) => (
                        <motion.div
                          key={winner.id}
                          className="bg-yellow-50 border-2 border-yellow-700 rounded-none p-4"
                          style={{ boxShadow: "3px 3px 0px 0px rgba(234, 179, 8, 0.2)" }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <Trophy className="w-5 h-5 text-yellow-700" />
                            <span className="font-bold text-yellow-700 font-sketch">#{index + 1}</span>
                          </div>
                          <h3 className="font-bold text-gray-800 font-sketch">{winner.name}</h3>
                          <p className="text-sm text-gray-700 font-handwritten">
                            Level {winner.level} • {winner.dept}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 font-handwritten">
                            Completed: {new Date(winner.completedAt!).toLocaleString()}
                          </p>
                          {winner.finalPassword && (
                            <div className="mt-2">
                              <button
                                onClick={() => togglePasswordVisibility(winner.id)}
                                className="flex items-center space-x-1 text-xs text-blue-700 hover:text-blue-800 transition-colors font-sketch"
                                style={{ transform: "rotate(0.1deg)" }}
                              >
                                <Key className="w-3 h-3" />
                                <span>{showPasswords[winner.id] ? "Hide" : "Show"} Password</span>
                              </button>
                              {showPasswords[winner.id] && (
                                <div className="mt-1 p-2 bg-white border border-gray-400 rounded-none text-xs font-mono text-green-700 break-all font-handwritten">
                                  {winner.finalPassword}
                                </div>
                              )}
                            </div>
                          )}
                        </motion.div>
                      ))}
                  </div>
                </GameCard>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
