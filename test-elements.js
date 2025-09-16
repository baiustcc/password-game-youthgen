// Test chemical elements detection
const getFoundElements = (password) => {
  const elementToAtomic = {
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
    // Add some more common ones for testing
    Fe: 26,
    Au: 79,
    Ag: 47
  };

  const foundElements = Object.keys(elementToAtomic)
    .filter((el) => password.includes(el))
    .map((el) => ({ symbol: el, atomicNumber: elementToAtomic[el] }));
  
  return foundElements;
};

// Test cases
const testCases = [
  "HelloAuSiAgCa",
  "TestHeNaClFe", 
  "MyPasswordLiBeB",
  "NoElementsHere123",
  "SingleH",
  "CaFeAuAg" // Ca(20) + Fe(26) + Au(79) + Ag(47) = 172
];

console.log("=== Chemical Elements Detection Test ===");

testCases.forEach(password => {
  const elements = getFoundElements(password);
  const atomicSum = elements.reduce((sum, el) => sum + el.atomicNumber, 0);
  
  console.log(`\nPassword: "${password}"`);
  console.log(`Elements found: ${elements.map(el => `${el.symbol}(${el.atomicNumber})`).join(', ')}`);
  console.log(`Atomic sum: ${atomicSum}`);
  console.log(`Target 200: ${atomicSum === 200 ? 'REACHED!' : `Need ${200 - atomicSum} more`}`);
});