const fs = require("fs");

// Read the JSON file
const data = fs.readFileSync("usersubmissions.json", "utf8");
const users = JSON.parse(data);

// Filter for completed users and sort by updatedAt (ascending order for first winners)
const winners = users
  .filter((user) => user.completed === true)
  .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));

// Display the first 5 winners
console.log("First 5 Winners (sorted by completion time):");
console.log("============================================");

const firstFiveWinners = winners.slice(0, 10);

firstFiveWinners.forEach((user, index) => {
  console.log(`${user.name}`);
  console.log(`Email: ${user.email}`);
  console.log(`Department: ${user.dept}`);
  console.log(`Level: ${user.level}, Term: ${user.term}`);
  // time in gmt +6 (example time: 2025-09-18T13:30:00.167000)
  // console.log(`Completed at: ${new Date(user.completedAt).toLocaleString("en-US", { timeZone: "Asia/Dhaka" })}`);
  // console.log(`   Completed at: ${new Date(user.completedAt).toLocaleString("en-US", { timeZone: "Asia/Dhaka" })}`);
  // time human readable
  // console.log(`   Completed at: ${user.completedAt}`);
  // password length
  console.log(`Password length: ${user.finalPassword.toString().length}`);
  console.log("----------------------------------------");
});

console.log(`\nTotal winners: ${winners.length}`);
