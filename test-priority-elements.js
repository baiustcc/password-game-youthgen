// Test improved chemical elements detection with priority-based matching
const getFoundElementsTest = (password) => {
  const elementToAtomic = {
    H: 1, He: 2, Li: 3, Be: 4, B: 5, C: 6, N: 7, O: 8, F: 9, Ne: 10,
    Na: 11, Mg: 12, Al: 13, Si: 14, P: 15, S: 16, Cl: 17, Ar: 18, K: 19, Ca: 20,
    Sc: 21, Ti: 22, V: 23, Cr: 24, Mn: 25, Fe: 26, Co: 27, Ni: 28, Cu: 29, Zn: 30,
    Ga: 31, Ge: 32, As: 33, Se: 34, Br: 35, Kr: 36, Rb: 37, Sr: 38, Y: 39, Zr: 40,
    Nb: 41, Mo: 42, Tc: 43, Ru: 44, Rh: 45, Pd: 46, Ag: 47, Cd: 48, In: 49, Sn: 50,
    Sb: 51, Te: 52, I: 53, Xe: 54, Cs: 55, Ba: 56, La: 57, Ce: 58, Pr: 59, Nd: 60,
    Pm: 61, Sm: 62, Eu: 63, Gd: 64, Tb: 65, Dy: 66, Ho: 67, Er: 68, Tm: 69, Yb: 70,
    Lu: 71, Hf: 72, Ta: 73, W: 74, Re: 75, Os: 76, Ir: 77, Pt: 78, Au: 79, Hg: 80,
    Tl: 81, Pb: 82, Bi: 83, Po: 84, At: 85, Rn: 86, Fr: 87, Ra: 88, Ac: 89, Th: 90,
    Pa: 91, U: 92, Np: 93, Pu: 94, Am: 95, Cm: 96, Bk: 97, Cf: 98, Es: 99, Fm: 100,
    Md: 101, No: 102, Lr: 103, Rf: 104, Db: 105, Sg: 106, Bh: 107, Hs: 108, Mt: 109,
    Ds: 110, Rg: 111, Cn: 112, Uub: 112, Uuq: 114
  };
  
  // Sort elements by length (longest first) to prioritize longer symbols
  const elementSymbols = Object.keys(elementToAtomic).sort((a, b) => b.length - a.length);
  
  const foundElements = new Set();
  const usedPositions = new Set();
  
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
        foundElements.add(symbol);
        // Mark all positions of this symbol as used
        for (let i = index; i < index + symbol.length; i++) {
          usedPositions.add(i);
        }
      }
      
      searchIndex = index + 1;
    }
  }
  
  return Array.from(foundElements).map(symbol => ({ 
    symbol, 
    atomicNumber: elementToAtomic[symbol] 
  }));
};

// Test the specific string
const testString = "Hello1#688marchVIITECHiousV🌒2000🥚Uuq";
console.log(`Testing: "${testString}"`);console.log('Character positions:');
for (let i = 0; i < testString.length; i++) {
  console.log(`${i}: '${testString[i]}'`);
}

const foundElements = getFoundElementsTest(testString);
const elementList = foundElements.map(el => `${el.symbol}(${el.atomicNumber})`).join(', ');
const atomicSum = foundElements.reduce((sum, el) => sum + el.atomicNumber, 0);

console.log(`Found elements: ${elementList}`);
console.log(`Expected: H(1), He(2), C(6), V(23), I(53), U(92), Uuq(114)`);
console.log(`Atomic sum: ${atomicSum}`);
console.log(`Expected sum: ${1 + 2 + 6 + 23 + 53 + 92 + 114} = 291`);

// Additional test cases
console.log("\n=== Additional Test Cases ===");

const testCases = [
  { input: "Hello", expected: "He(2) only, not H(1)" },
  { input: "Uuq", expected: "Uuq(114) only, not U(92)" },
  { input: "HelloUuq", expected: "He(2), Uuq(114)" },
  { input: "CaFeAu", expected: "Ca(20), Fe(26), Au(79)" }
];

testCases.forEach(test => {
  const result = getFoundElementsTest(test.input);
  const resultStr = result.map(el => `${el.symbol}(${el.atomicNumber})`).join(', ');
  console.log(`"${test.input}" → ${resultStr} | Expected: ${test.expected}`);
});