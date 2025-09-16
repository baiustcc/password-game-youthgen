import { GameRule, GameState } from "@/types";

// Helper functions for rule validation
const hasNumber = (password: string): boolean => /\d/.test(password);
const hasUppercase = (password: string): boolean => /[A-Z]/.test(password);
const hasSpecialChar = (password: string): boolean => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

const getDigitSum = (password: string): number => {
  return password.split("").reduce((sum, char) => {
    const digit = parseInt(char);
    return isNaN(digit) ? sum : sum + digit;
  }, 0);
};

const hasMonth = (password: string): boolean => {
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  const lowerPassword = password.toLowerCase();
  return months.some((month) => lowerPassword.includes(month));
};

export const getRomanNumerals = (password: string): string[] => {
  const matches = new Set<string>();

  // Define all valid Roman numeral patterns in order of priority (longest first)
  // Include compound numerals like XXXV, XXIV, etc.
  // Only check for UPPERCASE Roman numerals
  const romanPatterns = [
    // Thousands
    "MMMM",
    "MMM",
    "MM",
    "M",
    // 900s
    "CM",
    // 800s, 700s, 600s, 500s
    "DCCC",
    "DCC",
    "DC",
    "D",
    // 400s
    "CD",
    // 300s, 200s, 100s
    "CCC",
    "CC",
    "C",
    // 90s
    "XC",
    // 80s, 70s, 60s, 50s with additional numbers
    "LXXXIX",
    "LXXXVIII",
    "LXXXVII",
    "LXXXVI",
    "LXXXV",
    "LXXXIV",
    "LXXXIII",
    "LXXXII",
    "LXXXI",
    "LXXX",
    "LXXIX",
    "LXXVIII",
    "LXXVII",
    "LXXVI",
    "LXXV",
    "LXXIV",
    "LXXIII",
    "LXXII",
    "LXXI",
    "LXX",
    "LXIX",
    "LXVIII",
    "LXVII",
    "LXVI",
    "LXV",
    "LXIV",
    "LXIII",
    "LXII",
    "LXI",
    "LX",
    "LIX",
    "LVIII",
    "LVII",
    "LVI",
    "LV",
    "LIV",
    "LIII",
    "LII",
    "LI",
    "L",
    // 40s
    "XL",
    // 30s with additional numbers - This should match XXXV as one unit
    "XXXIX",
    "XXXVIII",
    "XXXVII",
    "XXXVI",
    "XXXV",
    "XXXIV",
    "XXXIII",
    "XXXII",
    "XXXI",
    "XXX",
    "XXIX",
    "XXVIII",
    "XXVII",
    "XXVI",
    "XXV",
    "XXIV",
    "XXIII",
    "XXII",
    "XXI",
    "XX",
    "XIX",
    "XVIII",
    "XVII",
    "XVI",
    "XV",
    "XIV",
    "XIII",
    "XII",
    "XI",
    "X",
    // 9 and below
    "IX",
    "VIII",
    "VII",
    "VI",
    "V",
    "IV",
    "III",
    "II",
    "I",
  ];

  // Find all positions of "TECHious" to exclude Roman numerals within it
  const excludedRanges: Array<{ start: number; end: number }> = [];
  let searchIndex = 0;
  while (true) {
    const techIndex = password.indexOf("TECHious", searchIndex);
    if (techIndex === -1) break;
    excludedRanges.push({
      start: techIndex,
      end: techIndex + "TECHious".length - 1,
    });
    searchIndex = techIndex + 1;
  }

  // Use original password (don't convert to uppercase) to preserve case sensitivity
  const foundPositions = new Set<number>();

  // Look for each pattern in order (longest first)
  for (const pattern of romanPatterns) {
    let patternSearchIndex = 0;
    while (true) {
      const index = password.indexOf(pattern, patternSearchIndex);
      if (index === -1) break;

      // Check if this Roman numeral is within "TECHious"
      const isWithinTECHious = excludedRanges.some(
        (range) => index >= range.start && index + pattern.length - 1 <= range.end
      );

      if (!isWithinTECHious) {
        // Check if ANY position of this pattern overlaps with already found positions
        let hasOverlap = false;
        for (let i = index; i < index + pattern.length; i++) {
          if (foundPositions.has(i)) {
            hasOverlap = true;
            break;
          }
        }

        // Only add if no overlap (this ensures longer patterns take precedence)
        if (!hasOverlap) {
          matches.add(pattern);
          // Mark all positions of this pattern as used
          for (let i = index; i < index + pattern.length; i++) {
            foundPositions.add(i);
          }
        }
      }

      patternSearchIndex = index + 1;
    }
  }

  return Array.from(matches);
};

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

const hasPeriodicElement = (password: string): boolean => {
  const elements = [
    "H",
    "He",
    "Li",
    "Be",
    "B",
    "C",
    "N",
    "O",
    "F",
    "Ne",
    "Na",
    "Mg",
    "Al",
    "Si",
    "P",
    "S",
    "Cl",
    "Ar",
    "K",
    "Ca",
    "Sc",
    "Ti",
    "V",
    "Cr",
    "Mn",
    "Fe",
    "Co",
    "Ni",
    "Cu",
    "Zn",
    "Ga",
    "Ge",
    "As",
    "Se",
    "Br",
    "Kr",
    "Rb",
    "Sr",
    "Y",
    "Zr",
    "Nb",
    "Mo",
    "Tc",
    "Ru",
    "Rh",
    "Pd",
    "Ag",
    "Cd",
    "In",
    "Sn",
    "Sb",
    "Te",
    "I",
    "Xe",
    "Cs",
    "Ba",
    "La",
    "Ce",
    "Pr",
    "Nd",
    "Pm",
    "Sm",
    "Eu",
    "Gd",
    "Tb",
    "Dy",
    "Ho",
    "Er",
    "Tm",
    "Yb",
    "Lu",
    "Hf",
    "Ta",
    "W",
    "Re",
    "Os",
    "Ir",
    "Pt",
    "Au",
    "Hg",
    "Tl",
    "Pb",
    "Bi",
    "Po",
    "At",
    "Rn",
    "Fr",
    "Ra",
    "Ac",
    "Th",
    "Pa",
    "U",
    "Np",
    "Pu",
    "Am",
    "Cm",
    "Bk",
    "Cf",
    "Es",
    "Fm",
    "Md",
    "No",
    "Lr",
    "Rf",
    "Db",
    "Sg",
    "Bh",
    "Hs",
    "Mt",
    "Ds",
    "Rg",
    "Cn",
    "Nh",
    "Fl",
    "Mc",
    "Lv",
    "Ts",
    "Og",
    "Uub",
    "Uuq",
  ];
  return elements.some((element) => password.includes(element));
};

const getCurrentMoonPhase = (): string => {
  // Simplified moon phase calculation - in real app, use an API
  const phases = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];
  const dayOfMonth = new Date().getDate();
  return phases[dayOfMonth % phases.length];
};

// Generate a random hex color for rule 22
const generateRandomHexColor = (): string => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
    "#F8C471",
    "#82E0AA",
    "#F1948A",
    "#85C1E9",
    "#D7BDE2",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Store the required hex color for rule 22
let CURRENT_HEX_COLOR: string = "#AE21FF";

const hasRequiredHexColor = (password: string): boolean => {
  return password.toLowerCase().includes(CURRENT_HEX_COLOR.toLowerCase());
};

const getCurrentHexColor = (): string => {
  return CURRENT_HEX_COLOR;
};

const hasDivisibleByFour = (password: string): boolean => {
  // Find all numbers in the password
  const numberMatches = password.match(/\d+/g);
  if (!numberMatches) return false;

  return numberMatches.some((numStr) => {
    const num = parseInt(numStr);
    return num % 4 === 0;
  });
};

const getAtomicNumbers = (password: string): number[] => {
  const foundElements = getFoundElements(password);
  return foundElements.map((el) => el.atomicNumber);
};

// Function to get found elements with their atomic numbers
const getFoundElements = (password: string): Array<{ symbol: string; atomicNumber: number }> => {
  const elementToAtomic: { [key: string]: number } = {
    H: 1,
    He: 2,
    Li: 3,
    Be: 4,
    B: 5,
    C: 6,
    N: 7,
    O: 8,
    F: 9,
    Ne: 10,
    Na: 11,
    Mg: 12,
    Al: 13,
    Si: 14,
    P: 15,
    S: 16,
    Cl: 17,
    Ar: 18,
    K: 19,
    Ca: 20,
    Sc: 21,
    Ti: 22,
    V: 23,
    Cr: 24,
    Mn: 25,
    Fe: 26,
    Co: 27,
    Ni: 28,
    Cu: 29,
    Zn: 30,
    Ga: 31,
    Ge: 32,
    As: 33,
    Se: 34,
    Br: 35,
    Kr: 36,
    Rb: 37,
    Sr: 38,
    Y: 39,
    Zr: 40,
    Nb: 41,
    Mo: 42,
    Tc: 43,
    Ru: 44,
    Rh: 45,
    Pd: 46,
    Ag: 47,
    Cd: 48,
    In: 49,
    Sn: 50,
    Sb: 51,
    Te: 52,
    I: 53,
    Xe: 54,
    Cs: 55,
    Ba: 56,
    La: 57,
    Ce: 58,
    Pr: 59,
    Nd: 60,
    Pm: 61,
    Sm: 62,
    Eu: 63,
    Gd: 64,
    Tb: 65,
    Dy: 66,
    Ho: 67,
    Er: 68,
    Tm: 69,
    Yb: 70,
    Lu: 71,
    Hf: 72,
    Ta: 73,
    W: 74,
    Re: 75,
    Os: 76,
    Ir: 77,
    Pt: 78,
    Au: 79,
    Hg: 80,
    Tl: 81,
    Pb: 82,
    Bi: 83,
    Po: 84,
    At: 85,
    Rn: 86,
    Fr: 87,
    Ra: 88,
    Ac: 89,
    Th: 90,
    Pa: 91,
    U: 92,
    Np: 93,
    Pu: 94,
    Am: 95,
    Cm: 96,
    Bk: 97,
    Cf: 98,
    Es: 99,
    Fm: 100,
    Md: 101,
    No: 102,
    Lr: 103,
    Rf: 104,
    Db: 105,
    Sg: 106,
    Bh: 107,
    Hs: 108,
    Mt: 109,
    Ds: 110,
    Rg: 111,
    Cn: 112,
    Uub: 112,
    Uuq: 114,
  };

  if (!hasPeriodicElement(password)) return [];

  // Sort elements by length (longest first) to prioritize longer symbols
  const elementSymbols = Object.keys(elementToAtomic).sort((a, b) => b.length - a.length);

  const foundElements: Array<{ symbol: string; atomicNumber: number; position: number }> = [];
  const usedPositions = new Set<number>();

  // Check each element symbol in order of length (longest first)
  for (const symbol of elementSymbols) {
    let searchIndex = 0;
    while (true) {
      const index = password.indexOf(symbol, searchIndex);
      if (index === -1) break;

      // Check if any position in this symbol is already used
      let positionUsed = false;
      for (let i = index; i < index + symbol.length; i++) {
        if (usedPositions.has(i)) {
          positionUsed = true;
          break;
        }
      }

      // If position is not used, mark this element as found
      if (!positionUsed) {
        foundElements.push({
          symbol,
          atomicNumber: elementToAtomic[symbol],
          position: index,
        });
        // Mark all positions of this symbol as used
        for (let i = index; i < index + symbol.length; i++) {
          usedPositions.add(i);
        }
      }

      searchIndex = index + 1;
    }
  }

  // Return elements sorted by position (for consistent display order)
  return foundElements
    .sort((a, b) => a.position - b.position)
    .map((el) => ({ symbol: el.symbol, atomicNumber: el.atomicNumber }));
};

const isPrime = (num: number): boolean => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// Define all game rules based on rules.md
export const createGameRules = (): GameRule[] => [
  {
    id: 1,
    text: "Your password must be at least 5 characters.",
    isActive: true,
    validator: (password: string) => password.length >= 5,
    errorMessage: "Password must be at least 5 characters long.",
  },
  {
    id: 2,
    text: "Your password must include a number.",
    isActive: false,
    validator: hasNumber,
    errorMessage: "Password must contain at least one number.",
  },
  {
    id: 3,
    text: "Your password must include at least one uppercase letter.",
    isActive: false,
    validator: hasUppercase,
    errorMessage: "Password must contain at least one uppercase letter.",
  },
  {
    id: 4,
    text: "Your password must include a special character.",
    isActive: false,
    validator: hasSpecialChar,
    errorMessage: "Password must contain at least one special character.",
  },
  {
    id: 5,
    text: "The digits in your password must add up to 25.",
    isActive: false,
    validator: (password: string) => getDigitSum(password) === 25,
    errorMessage: "The sum of all digits in your password must equal 25.",
  },
  {
    id: 6,
    text: "Your password must include a month of the year.",
    isActive: false,
    validator: hasMonth,
    errorMessage: "Password must contain the name of a month.",
  },
  {
    id: 7,
    text: "Your password must include a Roman numeral.",
    isActive: false,
    validator: (password: string) => getRomanNumerals(password).length > 0,
    errorMessage: "Password must contain at least one Roman numeral.",
  },
  {
    id: 8,
    text: "Your password must include our community partner, TECHious",
    isActive: false,
    validator: (password: string) => password.includes("TECHious"),
    errorMessage: "Password must contain 'TECHious'.",
  },
  {
    id: 9,
    text: "The roman numerals in your password should multiply to 35.",
    isActive: false,
    validator: (password: string) => {
      const romanNumerals = getRomanNumerals(password);
      if (romanNumerals.length === 0) return false;
      const product = romanNumerals.reduce((prod, roman) => prod * romanToNumber(roman), 1);
      return product === 35;
    },
    errorMessage: "The product of all Roman numerals must equal 35.",
  },
  {
    id: 10,
    text: "Your password must include a two-letter symbol from the periodic table.",
    isActive: false,
    validator: hasPeriodicElement,
    errorMessage: "Password must contain a chemical element symbol.",
  },
  {
    id: 11,
    text: "Your password must include the current phase of the moon as an emoji",
    isActive: false,
    validator: (password: string) => password.includes(getCurrentMoonPhase()),
    errorMessage: `Password must contain the current moon phase emoji: ${getCurrentMoonPhase()}.`,
  },
  {
    id: 12,
    text: "Your password must include a number divisible by 4.",
    isActive: false,
    validator: hasDivisibleByFour,
    errorMessage: "Password must contain a number that is divisible by 4.",
  },
  {
    id: 13,
    text: "🥚 ← This is my chicken, TanbirSayem. He hasn't hatched yet. Please put him in your password and keep him safe.",
    isActive: false,
    validator: (password: string, gameState: GameState) => {
      // If TanbirSayem has hatched, this rule is automatically satisfied
      if (gameState.tanbirSayemHatched) {
        return true;
      }
      // Otherwise, require the egg emoji
      return password.includes("🥚");
    },
    errorMessage: "Password must contain the egg emoji 🥚 to keep TanbirSayem safe!",
    getText: (gameState: GameState) => {
      if (gameState.tanbirSayemHatched) {
        return "🐤 TanbirSayem has hatched! This rule is now complete.";
      }
      return "🥚 ← This is my chicken, TanbirSayem. He hasn't hatched yet. Please put him in your password and keep him safe.";
    },
  },
  {
    id: 14,
    text: "The elements in your password must have atomic numbers that add up to 200.",
    isActive: false,
    validator: (password: string) => {
      const atomicNumbers = getAtomicNumbers(password);
      return atomicNumbers.reduce((sum, num) => sum + num, 0) === 200;
    },
    errorMessage: "The sum of atomic numbers of all chemical elements must equal 200.",
  },
  {
    id: 15,
    text: "All the vowels in your password have to be bolded",
    isActive: false,
    validator: () => true, // This is handled in the UI
    errorMessage: "All vowels must be bolded.",
  },
  {
    id: 16,
    text: "Oh no! Your password is on fire. Quick, put it out!",
    isActive: false,
    validator: () => true, // This triggers the fire animation
    errorMessage: "Your password is burning! The fire will consume it from the end.",
  },
  {
    id: 17,
    text: "Your password is not strong enough.",
    isActive: false,
    validator: (password: string) => /🏋️‍♂️|🏋️‍♀️|🏋️/.test(password),
    errorMessage: "Password must contain a weightlifting emoji to make it stronger.",
  },
  {
    id: 18,
    text: "Your password must contain one of the following affirmations: (I am loved, I am worthy, I am enough)",
    isActive: false,
    validator: (password: string) => {
      const affirmations = ["I am loved", "I am worthy", "I am enough"];
      return affirmations.some((affirmation) => password.includes(affirmation));
    },
    errorMessage: "Password must contain one of the required affirmations.",
  },
  {
    id: 19,
    text: "TanbirSayem has hatched! You must add 3 🐛 emojis to your password to keep him happy.",
    isActive: false,
    validator: (password: string, gameState: GameState) => {
      if (!password.includes("🐤")) return false;
      // Count actual worm emojis in password
      const wormEmojisInPassword = (password.match(/🐛/g) || []).length;
      return wormEmojisInPassword >= 3;
    },
    errorMessage: "You must manually add at least 3 worm emojis (🐛) to your password to keep TanbirSayem (🐤) happy!",
  },
  {
    id: 20,
    text: "Your password must include the URL of any YouTube video.",
    isActive: false,
    validator: (password: string) => {
      return /https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]+/.test(password);
    },
    errorMessage: "Password must contain a valid YouTube URL.",
  },
  {
    id: 21,
    text: "A sacrifice must be made. Pick two letters that you will no longer be able to use.",
    isActive: false,
    validator: (password: string, gameState: GameState) => {
      // First check if two letters have been selected
      if (gameState.forbiddenLetters.length < 2) {
        return false;
      }
      // Then check if password doesn't contain any forbidden letters
      return !gameState.forbiddenLetters.some((letter) => password.toLowerCase().includes(letter.toLowerCase()));
    },
    errorMessage: "You must select two letters to sacrifice, then ensure your password doesn't contain them.",
  },
  {
    id: 22,
    text: `Your password must include this hex color: ${getCurrentHexColor()}`,
    isActive: false,
    validator: hasRequiredHexColor,
    errorMessage: `Password must contain the hex color code ${getCurrentHexColor()}.`,
  },
  {
    id: 23,
    text: "Uh, let's skip this one",
    isActive: false,
    validator: () => true,
    errorMessage: "",
  },
  {
    id: 24,
    text: "Your password must include the length of your password.",
    isActive: false,
    validator: (password: string) => password.includes(password.length.toString()),
    errorMessage: "Password must contain its own length.",
  },
  {
    id: 25,
    text: "The length of your password must be a prime number.",
    isActive: false,
    validator: (password: string) => isPrime(password.length),
    errorMessage: "Password length must be a prime number.",
  },
];

export const validatePassword = (password: string, gameState: GameState): number[] => {
  const violatedRules: number[] = [];

  for (const rule of gameState.rules) {
    if (rule.isActive && !rule.validator(password, gameState)) {
      violatedRules.push(rule.id);
    }
  }

  return violatedRules;
};

export const getNextActiveRule = (rules: GameRule[]): GameRule | null => {
  for (const rule of rules) {
    if (!rule.isActive) {
      return rule;
    }
  }
  return null;
};

export { getFoundElements, getCurrentHexColor };
