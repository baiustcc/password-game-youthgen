"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { GameRule, GameState } from "@/types";

interface RuleDisplayProps {
  rule: GameRule;
  isViolated: boolean;
  isPassed: boolean;
  gameState: GameState;
}

export default function RuleDisplay({ rule, isViolated, isPassed, gameState }: RuleDisplayProps) {
  const getIcon = () => {
    if (isPassed) return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (isViolated) return <XCircle className="w-5 h-5 text-red-400" />;
    return <AlertCircle className="w-5 h-5 text-yellow-400" />;
  };

  const getClassName = () => {
    if (isPassed) return "rule-passed";
    if (isViolated) return "rule-violated";
    return "border-yellow-500 text-yellow-400 bg-yellow-900/20";
  };

  return (
    <motion.div
      className={`p-4 border-2 rounded-lg mb-3 flex items-start space-x-3 w-full overflow-hidden ${getClassName()}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex-shrink-0 mt-1">{getIcon()}</div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <p className="font-comic break-words word-wrap overflow-wrap-anywhere">
          <span className="font-bold">Rule {rule.id}:</span> {rule.getText ? rule.getText(gameState) : rule.text}
        </p>
        {isViolated && rule.errorMessage && (
          <p className="text-sm text-red-300 mt-1 break-words word-wrap overflow-wrap-anywhere">{rule.errorMessage}</p>
        )}
      </div>
    </motion.div>
  );
}
