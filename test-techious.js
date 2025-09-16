// Test script for Roman numeral detection with TECHious exclusion
const getRomanNumerals = (password) => {
  const matches = new Set();

  // Define all valid Roman numeral patterns in order of priority (longest first)
  // Only check for UPPERCASE Roman numerals
  const romanPatterns = [
    "MMMM",
    "MMM",
    "MM",
    "M",
    "CM",
    "CD",
    "DCCC",
    "DCC",
    "DC",
    "D",
    "CCCC",
    "CCC",
    "CC",
    "C",
    "XC",
    "XL",
    "LXXX",
    "LXX",
    "LX",
    "L",
    "XXXX",
    "XXX",
    "XX",
    "X",
    "IX",
    "IV",
    "VIII",
    "VII",
    "VI",
    "V",
    "IIII",
    "III",
    "II",
    "I",
  ];

  // Find all positions of "TECHious" to exclude Roman numerals within it
  const excludedRanges = [];
  let searchIndex = 0;
  while (true) {
    const techIndex = password.indexOf("TECHious", searchIndex);
    if (techIndex === -1) break;
    excludedRanges.push({
      start: techIndex,
      end: techIndex + "TECHious".length - 1
    });
    searchIndex = techIndex + 1;
  }

  // Use original password (don't convert to uppercase) to preserve case sensitivity
  const foundPositions = new Set();

  // Look for each pattern
  for (const pattern of romanPatterns) {
    let patternSearchIndex = 0;
    while (true) {
      const index = password.indexOf(pattern, patternSearchIndex);
      if (index === -1) break;

      // Check if this Roman numeral is within "TECHious"
      const isWithinTECHious = excludedRanges.some(range => 
        index >= range.start && index <= range.end
      );

      if (!isWithinTECHious) {
        // Check if this position is already covered by a longer match
        let alreadyCovered = false;
        for (let i = index; i < index + pattern.length; i++) {
          if (foundPositions.has(i)) {
            alreadyCovered = true;
            break;
          }
        }

        if (!alreadyCovered) {
          matches.add(pattern);
          // Mark these positions as used
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

// Test the function
console.log("=== Testing TECHious Exclusion ===");

const testCases = [
  {
    password: "hello1A#888marchVTECHious",
    expected: "Should find 'C' from 'march' but NOT 'C' or 'V' from 'TECHious'"
  },
  {
    password: "TECHious", 
    expected: "Should find NO Roman numerals (all excluded)"
  },
  {
    password: "MyTECHiousPassword", 
    expected: "Should find NO Roman numerals"
  },
  {
    password: "TestVpasswordTECHious", 
    expected: "Should find 'V' from outside TECHious, but not C/V from TECHious"
  },
  {
    password: "IloveTECHiousX", 
    expected: "Should find 'I' and 'X', but not C/V from TECHious"
  },
  {
    password: "marchTECHiousdecemberC", 
    expected: "Should find both 'C' (from march and end), but not C/V from TECHious"
  }
];

testCases.forEach(test => {
  const result = getRomanNumerals(test.password);
  console.log(`\nPassword: "${test.password}"`);
  console.log(`Expected: ${test.expected}`);
  console.log(`Found: [${result.join(', ')}]`);
});