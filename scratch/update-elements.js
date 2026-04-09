const fs = require('fs');
const path = require('path');

// Running from the root directory of the project
const elementsPath = path.join(process.cwd(), 'lib/elements.ts');
const elementsDataPath = path.join(process.cwd(), 'lib/elements-data.ts');

const mappings = {
  1: { cat: 'nonmetal', grp: 1 },
  2: { cat: 'noble-gas', grp: 18 },
  3: { cat: 'alkali-metal', grp: 1 },
  4: { cat: 'alkaline-earth-metal', grp: 2 },
  5: { cat: 'metalloid', grp: 13 },
  6: { cat: 'nonmetal', grp: 14 },
  7: { cat: 'nonmetal', grp: 15 },
  8: { cat: 'nonmetal', grp: 16 },
  9: { cat: 'halogen', grp: 17 },
  10: { cat: 'noble-gas', grp: 18 },
  11: { cat: 'alkali-metal', grp: 1 },
  12: { cat: 'alkaline-earth-metal', grp: 2 },
  13: { cat: 'post-transition-metal', grp: 13 },
  14: { cat: 'metalloid', grp: 14 },
  15: { cat: 'nonmetal', grp: 15 },
  16: { cat: 'nonmetal', grp: 16 },
  17: { cat: 'halogen', grp: 17 },
  18: { cat: 'noble-gas', grp: 18 },
  19: { cat: 'alkali-metal', grp: 1 },
  20: { cat: 'alkaline-earth-metal', grp: 2 },
  31: { cat: 'post-transition-metal', grp: 13 },
  32: { cat: 'metalloid', grp: 14 },
  33: { cat: 'metalloid', grp: 15 },
  34: { cat: 'nonmetal', grp: 16 },
  35: { cat: 'halogen', grp: 17 },
  36: { cat: 'noble-gas', grp: 18 },
  49: { cat: 'post-transition-metal', grp: 13 },
  50: { cat: 'post-transition-metal', grp: 14 },
  51: { cat: 'metalloid', grp: 15 },
  52: { cat: 'metalloid', grp: 16 },
  53: { cat: 'halogen', grp: 17 },
  54: { cat: 'noble-gas', grp: 18 },
  71: { cat: 'lanthanide', grp: 0 },
  81: { cat: 'post-transition-metal', grp: 13 },
  82: { cat: 'post-transition-metal', grp: 14 },
  83: { cat: 'post-transition-metal', grp: 15 },
  84: { cat: 'post-transition-metal', grp: 16 },
  85: { cat: 'halogen', grp: 17 },
  86: { cat: 'noble-gas', grp: 18 },
  103: { cat: 'actinide', grp: 0 },
  113: { cat: 'unknown', grp: 13 },
  114: { cat: 'unknown', grp: 14 },
  115: { cat: 'unknown', grp: 15 },
  116: { cat: 'unknown', grp: 16 },
  117: { cat: 'halogen', grp: 17 },
  118: { cat: 'noble-gas', grp: 18 }
};

let content = fs.readFileSync(elementsDataPath, 'utf8');

const updatedContent = content.replace(/\{\s*atomicNum:\s*(\d+),([\s\S]*?)\}/g, (match, atomicNum, body) => {
  const map = mappings[atomicNum];
  if (!map) return match;

  let newBody = body;
  // Update category
  newBody = newBody.replace(/category:\s*".*?"/, `category: "${map.cat}"`);
  // Update group
  newBody = newBody.replace(/group:\s*\d+/, `group: ${map.grp}`);

  return `{
    atomicNum: ${atomicNum},${newBody}}`;
});

fs.writeFileSync(elementsDataPath, updatedContent);
console.log('Successfully updated lib/elements-data.ts');
