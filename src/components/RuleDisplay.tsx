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
    if (isPassed) return <CheckCircle className="w-5 h-5 text-green-700" />;
    if (isViolated) return <XCircle className="w-5 h-5 text-red-700" />;
    return <AlertCircle className="w-5 h-5 text-yellow-700" />;
  };

  const getClassName = () => {
    if (isPassed) return "rule-passed border-2";
    if (isViolated) return "rule-violated border-2";
    return "border-yellow-700 text-yellow-700 bg-yellow-50 border-2";
  };

  return (
    <motion.div
      className={`p-4 rounded-none mb-3 flex items-start space-x-3 w-full overflow-hidden ${getClassName()}`}
      style={{
        boxShadow: isViolated 
          ? '4px 4px 0px 0px rgba(220, 38, 38, 0.2)' 
          : isPassed 
            ? '4px 4px 0px 0px rgba(72, 187, 120, 0.2)' 
            : '4px 4px 0px 0px rgba(234, 179, 8, 0.2)',
        transform: 'rotate(' + (isViolated ? '-0.5deg' : isPassed ? '0.3deg' : '0.1deg') + ')'
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex-shrink-0 mt-1">{getIcon()}</div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <p className="font-sketch break-words word-wrap overflow-wrap-anywhere" style={{transform: 'rotate(' + (isViolated ? '-0.2deg' : isPassed ? '0.1deg' : '0deg') + ')'}}>
          <span className="font-bold text-gray-800">Rule {rule.id}:</span> {rule.getText ? rule.getText(gameState) : rule.text}
        </p>
        {isViolated && rule.errorMessage && (
          <p className="text-sm text-red-700 mt-1 break-words word-wrap overflow-wrap-anywhere font-handwritten" style={{transform: 'rotate(-0.3deg)'}}>{rule.errorMessage}</p>
        )}
      </div>
    </motion.div>
  );
}
