// Final test with correct expectations
const getRomanNumerals = (password) => {
  const matches = new Set();
  const romanPatterns = ["M", "CM", "CD", "D", "C", "XC", "XL", "L", "X", "IX", "IV", "V", "I"];

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

  const foundPositions = new Set();

  for (const pattern of romanPatterns) {
    let patternSearchIndex = 0;
    while (true) {
      const index = password.indexOf(pattern, patternSearchIndex);
      if (index === -1) break;

      const isWithinTECHious = excludedRanges.some(range => 
        index >= range.start && index <= range.end
      );

      if (!isWithinTECHious) {
        let alreadyCovered = false;
        for (let i = index; i < index + pattern.length; i++) {
          if (foundPositions.has(i)) {
            alreadyCovered = true;
            break;
          }
        }

        if (!alreadyCovered) {
          matches.add(pattern);
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

console.log("=== TECHious Exclusion Test ===");

const tests = [
  {
    input: "hello1A#888MarchVTECHious",
    description: "Should find 'M' from March and 'V' before TECHious, but exclude C from TECHious"
  },
  {
    input: "TECHious",
    description: "Should find nothing (all Roman letters excluded)"
  },
  {
    input: "MypasswordTECHiousX",
    description: "Should find 'M' and 'X', exclude C/V from TECHious"
  }
];

tests.forEach(test => {
  const result = getRomanNumerals(test.input);
  console.log(`\nInput: "${test.input}"`);
  console.log(`Found: [${result.join(', ')}]`);
  console.log(`Expected: ${test.description}`);
});