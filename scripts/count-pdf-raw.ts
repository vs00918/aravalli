// Let's compute the exact counts of numbered items and static items in the PDF
const numberedCategories = [
  { name: 'National & States Affairs', count: 96 },
  { name: 'International Affairs', count: 14 },
  { name: 'Banking, Digital/Finance, Economic & Insurance', count: 65 },
  { name: 'Defence Affairs', count: 22 },
  { name: 'Sports & Games', count: 35 },
  { name: 'Persons in News', count: 2 },
  { name: 'Science & Technology', count: 32 },
  { name: 'Appointments & Resignations', count: 29 },
  { name: 'Awards, Rewards, Recognition & Prizes', count: 22 },
  { name: 'Schemes & Initiatives', count: 21 },
  { name: 'Meetings, Conferences and Summits', count: 7 },
  { name: 'Ranks, Reports & Surveys', count: 26 },
  { name: 'Amount & Agreements', count: 6 },
  { name: 'Ordinance, Bills & Acts', count: 6 },
  { name: 'MoUs, Collaborations & Partnerships', count: 40 }
];

const staticRoundupCategories = [
  { name: 'Important Obituaries', count: 11 },
  { name: 'One-liner Meetings, Conferences & Summits', count: 15 },
  { name: 'Important Species Found', count: 6 },
  { name: 'Important Brand Ambassadors', count: 1 },
  { name: 'Grand Prix Winners', count: 2 },
  { name: 'Important Acquisitions & Mergers', count: 10 },
  { name: 'Important Books & Authors', count: 6 },
  { name: 'Important Days & Themes', count: 22 }
];

const totalNumbered = numberedCategories.reduce((sum, c) => sum + c.count, 0);
const totalStatic = staticRoundupCategories.reduce((sum, c) => sum + c.count, 0);
const grandTotalRaw = totalNumbered + totalStatic;

console.log('=== EXACT RAW PDF ITEMS BREAKDOWN ===');
console.log('Total Numbered Article Items (15 Chapters):', totalNumbered);
console.log('Total Static Roundup Items (8 Sub-sections):', totalStatic);
console.log('Grand Total Raw Source Items in PDF:', grandTotalRaw);
