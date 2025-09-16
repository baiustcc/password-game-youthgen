// Debug character by character
const password = "hello1A#888marchVTECHious";

console.log("Character by character analysis:");
for (let i = 0; i < password.length; i++) {
  console.log(`Position ${i}: '${password[i]}'`);
}

console.log("\nBreaking down the sections:");
console.log("hello1A#888march: positions 0-15");
console.log("VTECHious: positions 16-24"); 
console.log("So 'V' at position 16 is OUTSIDE TECHious!");
console.log("And 'C' at position 19 is INSIDE TECHious (should be excluded)");

// But where is the C from march?
console.log("\nChecking for 'mar**c**h':");
const marchStart = password.indexOf("march");
console.log(`march starts at ${marchStart}, so 'c' should be at position ${marchStart + 3}`);
console.log(`Character at position ${marchStart + 3}: '${password[marchStart + 3]}'`);