import fs from 'fs';

const reg = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));
const seen = new Map<string, string[]>();

for (const [month, topicIds] of Object.entries(reg.indexes.byYearMonth)) {
  for (const id of topicIds as string[]) {
    if (!seen.has(id)) {
      seen.set(id, [month]);
    } else {
      seen.get(id)!.push(month);
    }
  }
}

console.log('=== CHECKING DUPLICATE TOPIC IDS ACROSS MONTHS ===');
let dupCount = 0;
for (const [id, months] of Array.from(seen.entries())) {
  if (months.length > 1) {
    dupCount++;
    console.log(`Duplicate ID: "${id}" in months: ${months.join(', ')}`);
  }
}

if (dupCount === 0) {
  console.log('✅ ZERO duplicate topic IDs found across months!');
} else {
  console.log(`❌ Found ${dupCount} duplicate topic IDs!`);
}
