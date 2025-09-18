"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Flame, Heart, Volume2, VolumeX } from "lucide-react";
import confetti from "canvas-confetti";
import { GameState, UserSubmission } from "@/types";
import { createGameRules, validatePassword, getNextActiveRule } from "@/lib/gameLogic";
import GameCard from "./GameCard";
import PasswordInput from "./PasswordInput";
import RuleDisplay from "./RuleDisplay";

interface PasswordGameProps {
  userSubmission: UserSubmission;
  onGameComplete: (finalPassword: string) => void;
}

export default function PasswordGame({ userSubmission, onGameComplete }: PasswordGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    currentRule: 1,
    password: "",
    isOnFire: false,
    tanbirSayemHatched: false,
    wormCount: 0,
    forbiddenLetters: [],
    userSubmission,
    rules: createGameRules(),
  });

  const [violatedRules, setViolatedRules] = useState<number[]>([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [rule16FirePutOut, setRule16FirePutOut] = useState(false);
  const [mathProblem, setMathProblem] = useState<{ question: string; answer: number } | null>(null);
  const [mathAnswer, setMathAnswer] = useState("");
  const [mathError, setMathError] = useState(false);
  const [lastCompletedRulesCount, setLastCompletedRulesCount] = useState(0);
  // Removed tanbirSayemDeathWarning - no longer needed without automatic consumption
  const gameCompletedRef = useRef(false);
  // Removed deathWarningTimeoutRef - no longer needed
  const fireIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const feedingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fireAudioRef = useRef<HTMLAudioElement | null>(null);
  const firePutOutAudioRef = useRef<HTMLAudioElement | null>(null);
  const swiperAudioRef = useRef<HTMLAudioElement | null>(null);
  const victoryAudioRef = useRef<HTMLAudioElement | null>(null);
  const rulPassedAudioRef = useRef<HTMLAudioElement | null>(null);
  const randomFireRef = useRef<NodeJS.Timeout | null>(null);

  // Math problem generation for fire modal
  const generateMathProblem = () => {
    const operations = ["+", "-", "*"];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, answer, question;

    switch (operation) {
      case "+":
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
        break;
      case "-":
        num1 = Math.floor(Math.random() * 50) + 25; // Ensure positive result
        num2 = Math.floor(Math.random() * 25) + 1;
        answer = num1 - num2;
        question = `${num1} - ${num2}`;
        break;
      case "*":
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        question = `${num1} × ${num2}`;
        break;
      default:
        num1 = 5;
        num2 = 3;
        answer = 8;
        question = "5 + 3";
    }

    return { question, answer };
  };

  // Local storage functions
  const saveGameState = (state: GameState) => {
    try {
      // Create a serializable version of the state (without functions)
      const serializableState = {
        ...state,
        isOnFire: false, // Don't persist fire state to avoid modal without math problem
        rule16FirePutOut, // Save the rule 16 fire flag
        rules: state.rules.map((rule) => ({
          id: rule.id,
          text: rule.text,
          isActive: rule.isActive,
          // Don't save validator function - it will be restored from createGameRules()
        })),
      };

      // Validate that the state can be stringified
      const jsonString = JSON.stringify(serializableState);
      if (jsonString && jsonString.length > 0) {
        localStorage.setItem("passwordGameState", jsonString);
      } else {
        console.error("Failed to serialize game state");
      }
    } catch (error) {
      console.error("Failed to save game state:", error);
      // Try to clear corrupted data if saving fails
      try {
        localStorage.removeItem("passwordGameState");
      } catch (clearError) {
        console.error("Failed to clear corrupted game state:", clearError);
      }
    }
  };

  const loadGameState = (): GameState | null => {
    try {
      const saved = localStorage.getItem("passwordGameState");
      if (saved && saved.trim() !== "") {
        // Check if the saved data is valid JSON
        let parsed;
        try {
          parsed = JSON.parse(saved);
        } catch (parseError) {
          console.error("Failed to parse saved game state:", parseError);
          // Clear corrupted data
          localStorage.removeItem("passwordGameState");
          return null;
        }

        if (!parsed || typeof parsed !== "object") {
          console.error("Invalid game state format");
          localStorage.removeItem("passwordGameState");
          return null;
        }

        const freshRules = createGameRules();

        // Merge saved rule states with fresh rules (to preserve validator functions)
        const mergedRules = freshRules.map((freshRule) => {
          const savedRule = parsed.rules?.find((r: any) => r.id === freshRule.id);
          if (savedRule) {
            return {
              ...freshRule, // Keep validator function and other methods
              isActive: savedRule.isActive, // Restore saved state
            };
          }
          return freshRule;
        });

        // Ensure the loaded state has the correct structure
        const restoredState = {
          ...parsed,
          userSubmission, // Always use current user submission
          rules: mergedRules,
          // Ensure fire state is clean on reload
          isOnFire: false,
          password: parsed.password,
        };

        // Restore Rule 16 fire flag if it exists
        if (parsed.rule16FirePutOut !== undefined) {
          setRule16FirePutOut(parsed.rule16FirePutOut);
        }

        return restoredState;
      }
    } catch (error) {
      console.error("Failed to load game state:", error);
      // Clear potentially corrupted data
      localStorage.removeItem("passwordGameState");
    }
    return null;
  };

  // Initialize game state from local storage or create new
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      setGameState(savedState);
      // Clear any fire-related state when loading
      setMathProblem(null);
      setMathAnswer("");
      setMathError(false);
    } else {
      // Activate first rule initially for new game
      setGameState((prev) => ({
        ...prev,
        rules: prev.rules.map((rule, index) => (index === 0 ? { ...rule, isActive: true } : rule)),
      }));
    }
  }, []);

  // Save game state to local storage whenever it changes
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  // Initialize sound effects
  useEffect(() => {
    if (soundEnabled) {
      try {
        // Initialize fire sound
        fireAudioRef.current = new Audio("/sounds/gta-san-andreas-cj-on-fire-sound.mp3");
        fireAudioRef.current.volume = 0.5;
        fireAudioRef.current.loop = true; // Make fire sound loop

        // Initialize fire put out sound
        firePutOutAudioRef.current = new Audio("/sounds/soft-success.mp3");
        firePutOutAudioRef.current.volume = 0.7;

        // Initialize swiper sound for putting out fire
        swiperAudioRef.current = new Audio("/sounds/swiper.mp3");
        swiperAudioRef.current.volume = 0.7;

        // Initialize victory sound
        victoryAudioRef.current = new Audio("/sounds/victory.mp3");
        victoryAudioRef.current.volume = 0.8;

        // Initialize rule passed sound
        rulPassedAudioRef.current = new Audio("/sounds/soft-success.mp3");
        rulPassedAudioRef.current.volume = 0.6;
      } catch (error) {
        console.log("Audio files not available:", error);
      }
    } else {
      fireAudioRef.current = null;
      firePutOutAudioRef.current = null;
      swiperAudioRef.current = null;
      victoryAudioRef.current = null;
      rulPassedAudioRef.current = null;
    }
  }, [soundEnabled]);

  // Random fire triggering - simplified
  useEffect(() => {
    const triggerRandomFire = () => {
      // Only trigger if not already on fire, has some password content, and random chance
      if (!gameState.isOnFire && gameState.password.length > 5 && Math.random() < 0.2) {
        setGameState((prev) => ({ ...prev, isOnFire: true }));
      }
    };

    // Clear existing random fire interval
    if (randomFireRef.current) {
      clearInterval(randomFireRef.current);
      randomFireRef.current = null;
    }

    // Start random fire interval when password has content and game is active
    if (gameState.password.length > 0 && !showCongrats && !gameState.isOnFire) {
      randomFireRef.current = setInterval(triggerRandomFire, 12000); // Every 12 seconds
    }

    return () => {
      if (randomFireRef.current) {
        clearInterval(randomFireRef.current);
        randomFireRef.current = null;
      }
    };
  }, [gameState.password.length, gameState.isOnFire, showCongrats]);

  // Validate password whenever it changes
  useEffect(() => {
    const violations = validatePassword(gameState.password, gameState);
    setViolatedRules(violations);

    // If no violations and current rule is passed, activate next rule
    if (violations.length === 0 && gameState.password.length > 0) {
      const nextRule = getNextActiveRule(gameState.rules);
      if (nextRule) {
        setGameState((prev) => ({
          ...prev,
          rules: prev.rules.map((rule) => (rule.id === nextRule.id ? { ...rule, isActive: true } : rule)),
        }));
      } else {
        // All rules completed!
        if (!gameCompletedRef.current) {
          gameCompletedRef.current = true;
          setShowCongrats(true);

          // Trigger confetti effect
          const duration = 3000;
          const animationEnd = Date.now() + duration;
          const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

          const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
          };

          const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
              return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(
              Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
              })
            );
            confetti(
              Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
              })
            );
          }, 250);

          // Play victory sound
          if (soundEnabled && victoryAudioRef.current) {
            victoryAudioRef.current.play().catch(console.error);
          }

          // Call onGameComplete only once
          onGameComplete(gameState.password);
        }
      }
    }

    // Auto-trigger fire for Rule 16 (only if not already put out)
    const rule16 = gameState.rules.find((r) => r.id === 16);
    if (rule16?.isActive && !gameState.isOnFire && !rule16FirePutOut) {
      setGameState((prev) => ({ ...prev, isOnFire: true }));
    }
  }, [gameState.password, gameState.rules, gameState.isOnFire, rule16FirePutOut]);

  // Handle fire animation (simplified - just add one fire emoji)
  useEffect(() => {
    if (gameState.isOnFire && !gameState.password.includes("🔥")) {
      // Generate math problem when fire starts
      if (!mathProblem) {
        setMathProblem(generateMathProblem());
      }

      // Add one fire emoji at the end and play sound if enabled
      if (soundEnabled && fireAudioRef.current) {
        fireAudioRef.current.play().catch(console.error);
      }

      // Check if adding fire would replace the egg - if so, don't add fire to preserve the egg
      if (gameState.password.includes("🥚") && gameState.password.endsWith("🥚")) {
        // If the egg is at the end and fire would replace it, skip adding fire to protect the egg
        return;
      }

      setGameState((prev) => ({
        ...prev,
        password: prev.password + "🔥",
      }));
    }
  }, [gameState.isOnFire, soundEnabled, mathProblem]);

  // Handle TanbirSayem hatching (Rule 19) - Users add worms manually
  useEffect(() => {
    const rule19 = gameState.rules.find((r) => r.id === 19);
    if (rule19?.isActive && !gameState.tanbirSayemHatched) {
      // Hatch TanbirSayem
      setGameState((prev) => ({
        ...prev,
        tanbirSayemHatched: true,
        password: prev.password.replace("🥚", "🐤"),
        wormCount: 0, // Start with 0 worms, user adds manually
      }));
    }

    return () => {
      if (feedingIntervalRef.current) {
        clearInterval(feedingIntervalRef.current);
      }
      // Removed deathWarningTimeoutRef cleanup - no longer needed
    };
  }, [gameState.rules]);

  const handlePasswordChange = (newPassword: string) => {
    // Check for forbidden letters - but allow changes that remove forbidden letters
    if (gameState.forbiddenLetters.length > 0) {
      const currentForbiddenCount = gameState.forbiddenLetters.reduce((count, letter) => {
        const regex = new RegExp(letter, "gi");
        return count + (gameState.password.match(regex) || []).length;
      }, 0);

      const newForbiddenCount = gameState.forbiddenLetters.reduce((count, letter) => {
        const regex = new RegExp(letter, "gi");
        return count + (newPassword.match(regex) || []).length;
      }, 0);

      // Only block if we're adding more forbidden letters (not removing or keeping same)
      if (newForbiddenCount > currentForbiddenCount) {
        return; // Don't allow adding more forbidden letters
      }
    }

    setGameState((prev) => ({ ...prev, password: newPassword }));
  };

  const handleSacrificeLetters = () => {
    const currentLetters = gameState.forbiddenLetters.length > 0 ? gameState.forbiddenLetters.join(", ") : "";
    const promptMessage =
      gameState.forbiddenLetters.length === 2
        ? `Current sacrificed letters: ${currentLetters}\nEnter 2 new letters to sacrifice (e.g., "a,b"):`
        : 'Choose 2 letters to sacrifice (e.g., "a,b"):';

    const letters = prompt(promptMessage);
    if (letters && letters.trim()) {
      const forbidden = letters
        .split(",")
        .map((l) => l.trim()) // Trim spaces after comma separators
        .filter((l) => l.length === 1 && /^[a-zA-Z]$/.test(l)) // Only allow single letters
        .slice(0, 2); // Take only first 2 valid letters

      if (forbidden.length === 2) {
        // Check if current password contains any of the new forbidden letters
        const passwordContainsForbidden = forbidden.some((letter) =>
          gameState.password.toLowerCase().includes(letter.toLowerCase())
        );

        if (passwordContainsForbidden) {
          const conflictingLetters = forbidden.filter((letter) =>
            gameState.password.toLowerCase().includes(letter.toLowerCase())
          );
          alert(
            `Warning: Your current password contains the letter(s): ${conflictingLetters.join(
              ", "
            )}. You'll need to remove them from your password.`
          );
        }

        setGameState((prev) => {
          const newState = { ...prev, forbiddenLetters: forbidden };

          // Immediately validate password with new forbidden letters
          setTimeout(() => {
            const violations = validatePassword(newState.password, newState);
            setViolatedRules(violations);

            // Check if any new rules can be activated
            if (violations.length === 0 && newState.password.length > 0) {
              const nextRule = getNextActiveRule(newState.rules);
              if (nextRule) {
                setGameState((currentState) => ({
                  ...currentState,
                  rules: currentState.rules.map((rule) => (rule.id === nextRule.id ? { ...rule, isActive: true } : rule)),
                }));
              }
            }
          }, 0);

          return newState;
        });
      } else {
        alert('Please enter exactly 2 letters separated by a comma (e.g., "a,b")');
      }
    }
  };

  const putOutFire = () => {
    // Check if math problem is solved correctly
    if (mathProblem && parseInt(mathAnswer) !== mathProblem.answer) {
      // Wrong answer - show error and clear input
      setMathError(true);
      setMathAnswer(""); // Clear the answer
      setTimeout(() => setMathError(false), 1000); // Remove error after 1 second
      return;
    }

    setGameState((prev) => ({
      ...prev,
      isOnFire: false,
      password: prev.password.replace(/🔥/g, ""),
    }));

    // Stop fire sound if it's playing
    if (soundEnabled && fireAudioRef.current) {
      fireAudioRef.current.pause();
      fireAudioRef.current.currentTime = 0; // Reset to beginning for next time
    }

    // Play swiper sound when putting out fire
    if (soundEnabled && swiperAudioRef.current) {
      swiperAudioRef.current.play().catch(console.error);
    }

    // Play fire put out sound
    if (soundEnabled && firePutOutAudioRef.current) {
      firePutOutAudioRef.current.play().catch(console.error);
    }

    // Mark that Rule 16 fire has been put out to prevent re-triggering
    setRule16FirePutOut(true);
    // Clear math problem state
    setMathProblem(null);
    setMathAnswer("");
    setMathError(false);
  };

  // No feeding function needed - users add worms manually
  // const feedTanbirSayem = () => { ... } - REMOVED

  const activeRules = gameState.rules.filter((rule) => rule.isActive);
  const completedRules = activeRules.filter(
    (rule) => !violatedRules.includes(rule.id) && gameState.password.length > 0
  ).length;

  // Play sound when a rule is passed
  useEffect(() => {
    if (completedRules > lastCompletedRulesCount && lastCompletedRulesCount > 0) {
      // A new rule was passed
      if (soundEnabled && rulPassedAudioRef.current) {
        rulPassedAudioRef.current.currentTime = 0; // Reset to beginning
        rulPassedAudioRef.current.play().catch(console.error);
      }
    }
    setLastCompletedRulesCount(completedRules);
  }, [completedRules, lastCompletedRulesCount, soundEnabled]);

  const totalRules = 25; // We now have 25 total rules (1-25)
  const progressPercentage = totalRules > 0 ? (completedRules / totalRules) * 100 : 0;

  if (showCongrats) {
    return (
      <motion.div
        className="max-w-4xl mx-auto px-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <GameCard className="text-center">
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-green-400 mb-4">🎉 Congratulations! 🎉</h2>
          <p className="text-xl text-gray-300 mb-6">You&apos;ve completed the Password Game Challenge!</p>
          <div className="bg-slate-700 p-4 rounded-lg mb-6">
            <p className="text-lg font-bold text-green-400">Your Final Password:</p>
            <p className="font-mono text-lg break-all overflow-wrap-anywhere">{gameState.password}</p>
          </div>
          <p className="text-lg text-yellow-400 mb-4">🎁 You&apos;ve won 1 VIP tickets to the YouthGEN Event! 🎁</p>
          <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4 mb-4">
            <p className="text-blue-400 font-bold mb-2">📞 Contact Information:</p>
            <p className="text-gray-300">
              Please contact the <strong className="text-blue-400">BAIUST Computer Club Committee</strong> to collect your
              VIP ticket!
            </p>
          </div>
          <p className="text-gray-400">Congratulations from BAIUST Computer Club and TECHious!</p>
        </GameCard>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4">
      {/* Fire Modal - Blocks entire screen */}
      <AnimatePresence>
        {gameState.isOnFire && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-red-900/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={`bg-slate-800 border-4 border-red-500 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl ${
                mathError ? "animate-shake" : ""
              }`}
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="text-8xl mb-4"
              >
                🔥
              </motion.div>
              <h2 className="text-3xl font-bold text-red-400 mb-4">Password is on Fire!</h2>
              <p className="text-gray-300 mb-6">Your password is burning! Solve this math problem to put out the fire:</p>

              {mathProblem && (
                <div className="mb-6">
                  <div className="text-2xl font-bold text-yellow-400 mb-4">{mathProblem.question} = ?</div>
                  <input
                    type="number"
                    value={mathAnswer}
                    onChange={(e) => setMathAnswer(e.target.value)}
                    className={`w-32 px-4 py-2 text-center text-xl font-bold rounded-lg text-white focus:outline-none focus:ring-2 transition-colors ${
                      mathError
                        ? "bg-red-700 border-2 border-red-500 focus:ring-red-400"
                        : "bg-slate-700 border-2 border-blue-500 focus:ring-blue-400"
                    }`}
                    placeholder="?"
                    autoFocus
                  />
                  {mathError && <p className="text-red-400 text-sm mt-2 font-bold">Wrong answer! Try again.</p>}
                </div>
              )}

              <button
                onClick={putOutFire}
                disabled={!mathAnswer || !mathProblem}
                className={`px-6 py-3 font-bold rounded-lg transition-colors transform hover:scale-105 ${
                  mathAnswer && mathProblem
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-500 text-gray-300 cursor-not-allowed"
                }`}
              >
                🧯 Put Out Fire
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <GameCard>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-green-400">Progress</h3>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">
                {completedRules} / {totalRules} rules completed
              </span>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                  soundEnabled ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-500 hover:bg-gray-600 text-white"
                }`}
                title={soundEnabled ? "Disable Sound" : "Enable Sound"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>{soundEnabled ? "Sound On" : "Sound Off"}</span>
              </button>
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <motion.div
              className="bg-green-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </GameCard>

      {/* Password Input - Centered */}
      <div className="max-w-4xl mx-auto">
        <GameCard>
          <PasswordInput
            value={gameState.password}
            onChange={handlePasswordChange}
            violatedRules={violatedRules}
            gameState={gameState}
          />

          {/* Game State Indicators */}
          <div className="mt-6 space-y-3">
            {gameState.tanbirSayemHatched && (
              <motion.div
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg bg-green-900/30 border border-green-500"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <Heart className="w-5 h-5 flex-shrink-0 text-green-400" />
                  <span className="break-words text-green-400">
                    {(() => {
                      const wormEmojisInPassword = (gameState.password.match(/🐛/g) || []).length;
                      const wormsNeeded = Math.max(0, 3 - wormEmojisInPassword);
                      if (wormEmojisInPassword >= 3) {
                        return "TanbirSayem is well fed and happy! 🐤";
                      }
                      return `TanbirSayem needs ${wormsNeeded} more worm${
                        wormsNeeded > 1 ? "s" : ""
                      } in your password. (Currently: ${wormEmojisInPassword}/3)`;
                    })()}
                  </span>
                </div>
                <div
                  className={`px-3 py-1 text-white rounded text-sm flex-shrink-0 ${(() => {
                    const wormEmojisInPassword = (gameState.password.match(/🐛/g) || []).length;
                    return wormEmojisInPassword >= 3 ? "bg-green-600 text-center" : "bg-blue-600 text-center";
                  })()}`}
                >
                  {(() => {
                    const wormEmojisInPassword = (gameState.password.match(/🐛/g) || []).length;
                    const wormsNeeded = Math.max(0, 3 - wormEmojisInPassword);
                    if (wormEmojisInPassword >= 3) {
                      return "Well Fed ✓";
                    }
                    return `Need: ${"🐛".repeat(wormsNeeded)}`;
                  })()}
                </div>
              </motion.div>
            )}

            {gameState.rules.find((r) => r.id === 21)?.isActive && (
              <motion.div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-purple-900/30 border border-purple-500 rounded-lg">
                <span className="text-purple-400 break-words">
                  {gameState.forbiddenLetters.length === 0
                    ? "Choose 2 letters to sacrifice"
                    : gameState.forbiddenLetters.length === 1
                    ? `Choose 1 more letter to sacrifice (already selected: ${gameState.forbiddenLetters.join(", ")})`
                    : `Sacrificed letters: ${gameState.forbiddenLetters.join(
                        ", "
                      )} - Your password must not contain these letters`}
                </span>
                <button
                  onClick={handleSacrificeLetters}
                  className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm flex-shrink-0"
                >
                  {gameState.forbiddenLetters.length === 0
                    ? "Make Sacrifice"
                    : gameState.forbiddenLetters.length === 1
                    ? "Add Letter"
                    : "Change Letters"}
                </button>
              </motion.div>
            )}
          </div>
        </GameCard>
      </div>

      {/* Rules - Show latest first */}
      <div className="max-w-4xl mx-auto">
        <GameCard>
          <h3 className="text-xl font-bold text-green-400 mb-4">Active Rules</h3>
          <div className="space-y-3">
            <AnimatePresence>
              {[...activeRules]
                .sort((a, b) => {
                  const aViolated = violatedRules.includes(a.id);
                  const bViolated = violatedRules.includes(b.id);
                  // Failed rules first, then by rule ID (latest first)
                  if (aViolated && !bViolated) return -1;
                  if (!aViolated && bViolated) return 1;
                  return b.id - a.id; // Latest rules first within same category
                })
                .map((rule) => (
                  <RuleDisplay
                    key={rule.id}
                    rule={rule}
                    isViolated={violatedRules.includes(rule.id)}
                    isPassed={!violatedRules.includes(rule.id) && gameState.password.length > 0}
                    gameState={gameState}
                  />
                ))}
            </AnimatePresence>
          </div>
        </GameCard>
      </div>
    </div>
  );
}
