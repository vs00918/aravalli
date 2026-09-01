const fs = require('fs');
const path = require('path');

const part1Path = path.join(__dirname, '../knowledge-tree/banking-ca/01-august-2026-cgb-part-1.md');
const part2Path = path.join(__dirname, '../knowledge-tree/banking-ca/02-august-2026-cgb-part-2.md');

const part1Content = fs.readFileSync(part1Path, 'utf8');
const part2Content = fs.readFileSync(part2Path, 'utf8');

const registry = {
  volumes: [
    {
      id: "banking-ca-2026",
      slug: "banking-ca-2026",
      number: 1,
      title: "Banking & Economy Current Affairs (April 2026 – Oct 2026)",
      shortTitle: "Banking CA 2026",
      icon: "🏦",
      tagline: "SBI PO & IBPS PO Mains Exam Intelligence",
      description: "High-yield, deduplicated, and exam-filtered current affairs covering RBI regulations, banking reforms, monetary policy, schemes, and reports.",
      chapters: [
        {
          slug: "01-august-2026-cgb-part-1",
          number: 1,
          title: "Banking & Economy CA: 1st – 11th August 2026",
          subtitle: "62nd MPC, UCB On-Tap Norms, NBFC Upper Layer, CVA & Recovery Guidelines"
        },
        {
          slug: "02-august-2026-cgb-part-2",
          number: 2,
          title: "Banking & Economy CA: 12th – 20th August 2026",
          subtitle: "RBI Interest Rate Draft Norms, Single Form A MF Reforms, Credit Risk-o-Meter, Polymer Banknotes & DEA Fund"
        }
      ]
    }
  ],
  chapters: {
    "01-august-2026-cgb-part-1": {
      slug: "01-august-2026-cgb-part-1",
      volNumber: 1,
      volTitle: "Banking & Economy Current Affairs (April 2026 – Oct 2026)",
      volSlug: "banking-ca-2026",
      chapterNumber: 1,
      totalChaptersInVol: 2,
      title: "Banking & Economy CA: 1st – 11th August 2026",
      subtitle: "62nd MPC, UCB On-Tap Norms, NBFC Upper Layer, CVA & Recovery Guidelines",
      coreTheme: "RBI Regulatory Directives, Monetary Policy, Capital Adequacy, Digital Lending, and SEBI Frameworks",
      source: "CGB Mentors & Smartkeeda (Aug 1–11, 2026)",
      contentMarkdown: part1Content
    },
    "02-august-2026-cgb-part-2": {
      slug: "02-august-2026-cgb-part-2",
      volNumber: 1,
      volTitle: "Banking & Economy Current Affairs (April 2026 – Oct 2026)",
      volSlug: "banking-ca-2026",
      chapterNumber: 2,
      totalChaptersInVol: 2,
      title: "Banking & Economy CA: 12th – 20th August 2026",
      subtitle: "RBI Interest Rate Draft Norms, Single Form A MF Reforms, Credit Risk-o-Meter, Polymer Banknotes & DEA Fund",
      coreTheme: "RBI Lending Rate Master Directions, SEBI MF Sponsor Reforms, Debt Credit Risk-o-Meter, Polymer Currency, DEA Fund & PSB Asset Quality",
      source: "CGB Mentors (Aug 12–20, 2026)",
      contentMarkdown: part2Content
    }
  }
};

fs.writeFileSync(path.join(__dirname, '../data/knowledge-registry.json'), JSON.stringify(registry, null, 2));
console.log('Successfully updated knowledge-registry.json with Chapters 1 & 2!');
