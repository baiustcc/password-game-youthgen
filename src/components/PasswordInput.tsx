"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { Calculator, Hash, AlertCircle, Atom } from "lucide-react";
import { getFoundElements, getRomanNumerals, getCurrentHexColor } from "@/lib/gameLogic";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  violatedRules: number[];
  gameState: any;
}

export default function PasswordInput({ value, onChange, violatedRules, gameState }: PasswordInputProps) {
  // Calculate helpful hints
  const digitSum = useMemo(() => {
    return value.split("").reduce((sum, char) => {
      const digit = parseInt(char);
      return isNaN(digit) ? sum : sum + digit;
    }, 0);
  }, [value]);

  const romanNumerals = useMemo(() => {
    return getRomanNumerals(value);
  }, [value]);

  const romanProduct = useMemo(() => {
    const romanToNumber = (roman: string): number => {
      const values: { [key: string]: number } = {
        I: 1,
        V: 5,
        X: 10,
        L: 50,
        C: 100,
        D: 500,
        M: 1000,
      };

      let total = 0;
      for (let i = 0; i < roman.length; i++) {
        const current = values[roman[i]];
        const next = values[roman[i + 1]];

        if (next && current < next) {
          total += next - current;
          i++;
        } else {
          total += current;
        }
      }
      return total;
    };

    if (romanNumerals.length === 0) return 0;
    return romanNumerals.reduce((prod: number, roman: string) => prod * romanToNumber(roman), 1);
  }, [romanNumerals]);

  const foundElements = useMemo(() => {
    return getFoundElements(value);
  }, [value]);

  const atomicSum = useMemo(() => {
    return foundElements.reduce((sum, element) => sum + element.atomicNumber, 0);
  }, [foundElements]);

  const isPrime = (num: number): boolean => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  };

  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <label className="block text-lg font-bold text-gray-800 font-sketch text-center" style={{transform: 'rotate(-0.3deg)'}}>Your Password:</label>

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`game-input font-mono text-lg text-center ${
            violatedRules.length > 0 ? "border-red-700 ring-red-400" : ""
          }`}
          placeholder="Start typing your password..."
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      {/* Helpful Hints */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <div className="bg-white p-3 rounded-none text-center min-w-0 border-2 border-gray-800" style={{boxShadow: '3px 3px 0px 0px rgba(0, 0, 0, 0.1)'}}>
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Hash className="w-4 h-4 text-blue-700 flex-shrink-0" />
            <span className="text-sm text-gray-700 truncate font-handwritten">Length</span>
          </div>
          <div className="text-lg font-bold text-blue-700 font-sketch">{value.length}</div>
          <div className="text-xs text-gray-600 truncate font-handwritten">{isPrime(value.length) ? "✓ Prime" : "✗ Not Prime"}</div>
        </div>

        <div className="bg-white p-3 rounded-none text-center min-w-0 border-2 border-gray-800" style={{boxShadow: '3px 3px 0px 0px rgba(0, 0, 0, 0.1)'}}>
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Calculator className="w-4 h-4 text-green-700 flex-shrink-0" />
            <span className="text-sm text-gray-700 truncate font-handwritten">Digit Sum</span>
          </div>
          <div className="text-lg font-bold text-green-700 font-sketch">{digitSum}</div>
          <div className="text-xs text-gray-600 truncate font-handwritten">
            {digitSum === 25 ? "✓ Target: 25" : `Need: ${25 - digitSum} more`}
          </div>
        </div>

        <div className="bg-white p-3 rounded-none text-center min-w-0 border-2 border-gray-800" style={{boxShadow: '3px 3px 0px 0px rgba(0, 0, 0, 0.1)'}}>
          <div className="flex items-center justify-center space-x-2 mb-1">
            <AlertCircle className="w-4 h-4 text-purple-700 flex-shrink-0" />
            <span className="text-sm text-gray-700 truncate font-handwritten">Roman Product</span>
          </div>
          <div className="text-lg font-bold text-purple-700 font-sketch">{romanProduct}</div>
          <div className="text-xs text-gray-600 truncate font-handwritten">
            {romanProduct === 35 ? "✓ Target: 35" : romanNumerals.length > 0 ? `Current: ${romanProduct}` : "No Romans"}
          </div>
        </div>

        <div className="bg-white p-3 rounded-none text-center min-w-0 border-2 border-gray-800" style={{boxShadow: '3px 3px 0px 0px rgba(0, 0, 0, 0.1)'}}>
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Atom className="w-4 h-4 text-orange-700 flex-shrink-0" />
            <span className="text-sm text-gray-700 truncate font-handwritten">Atomic Sum</span>
          </div>
          <div className="text-lg font-bold text-orange-700 font-sketch">{atomicSum}</div>
          <div className="text-xs text-gray-600 truncate font-handwritten">
            {atomicSum === 200 ? "✓ Target: 200" : foundElements.length > 0 ? `Current: ${atomicSum}` : "No Elements"}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="text-center space-y-2">
        {gameState.forbiddenLetters.length > 0 && (
          <div className="text-sm text-red-700 break-words font-handwritten" style={{transform: 'rotate(-0.2deg)'}}>
            🚫 Forbidden letters: {gameState.forbiddenLetters.join(", ")}
          </div>
        )}

        {gameState.rules.find((r: any) => r.id === 22)?.isActive && (
          <div className="text-sm text-blue-700 break-words font-handwritten" style={{transform: 'rotate(0.1deg)'}}>
            🎨 Required hex color:{" "}
            <span className="font-mono" style={{ color: getCurrentHexColor() }}>
              {getCurrentHexColor()}
            </span>
          </div>
        )}

        {romanNumerals.length > 0 && (
          <div className="text-sm text-purple-700 break-words font-handwritten" style={{transform: 'rotate(-0.1deg)'}}>
            🏛️ Roman numerals found: {romanNumerals.join(", ")}
          </div>
        )}

        {foundElements.length > 0 && (
          <div className="text-sm text-orange-700 break-words font-handwritten" style={{transform: 'rotate(0.2deg)'}}>
            ⚛️ Chemical elements found: {foundElements.map((el) => `${el.symbol}(${el.atomicNumber})`).join(", ")}
          </div>
        )}
      </div>
    </motion.div>
  );
}
