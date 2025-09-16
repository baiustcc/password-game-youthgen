// Debug the specific test case
const password = "hello1A#888marchVTECHious";

console.log("Password:", password);
console.log("Length:", password.length);

// Check positions
console.log("\nLooking for 'march':");
const marchIndex = password.indexOf("march");
console.log("march starts at:", marchIndex);

console.log("\nLooking for 'TECHious':");
const techIndex = password.indexOf("TECHious");
console.log("TECHious starts at:", techIndex, "ends at:", techIndex + "TECHious".length - 1);

console.log("\nLooking for 'C':");
let cIndex = 0;
while (true) {
  const found = password.indexOf("C", cIndex);
  if (found === -1) break;
  console.log("C found at position:", found);
  cIndex = found + 1;
}

console.log("\nLooking for 'V':");
let vIndex = 0;
while (true) {
  const found = password.indexOf("V", vIndex);
  if (found === -1) break;
  console.log("V found at position:", found);
  vIndex = found + 1;
}