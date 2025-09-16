// Test script for Roman numeral detection
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

  // Use original password (don't convert to uppercase) to preserve case sensitivity
  const foundPositions = new Set();

  // Look for each pattern
  for (const pattern of romanPatterns) {
    let searchIndex = 0;
    while (true) {
      const index = password.indexOf(pattern, searchIndex);
      if (index === -1) break;

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

      searchIndex = index + 1;
    }
  }

  return Array.from(matches);
};

// Test the function
const testPassword = "hello1A#888marchVTECHious";
console.log(`Testing password: "${testPassword}"`);
console.log("Roman numerals found:", getRomanNumerals(testPassword));
console.log("Should find 'V' from 'TECHious'");

// Test some other cases
const testCases = [
  "V",
  "TECHVious", 
  "IVXLCDM",
  "HelloIworld",
  "TestXpro",
  "MyPasswordL",
  "CodeMproject"
];

testCases.forEach(test => {
  const result = getRomanNumerals(test);
  console.log(`"${test}" -> [${result.join(', ')}]`);
});