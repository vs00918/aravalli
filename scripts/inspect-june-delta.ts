import fs from 'fs';
import path from 'path';
import { parseCanonicalMarkdownFile } from '../lib/banking-ca/markdown-parser';

const file17 = path.resolve('./knowledge-tree/banking-ca/17-june-2026-cgb-top100-mcqs.md');
const content = fs.readFileSync(file17, 'utf8');
const { topics, batch } = parseCanonicalMarkdownFile(file17, '17-june-2026-cgb-top100-mcqs', 'CGB_MENTORS', '2026-06', 'week-1-4');

console.log(`Topics in 17-june-2026-cgb-top100-mcqs.md (${topics.length} topics):`);
topics.forEach((t, i) => {
  console.log(`${(i+1).toString().padStart(2, '0')}. [${t.priority}] [${t.primaryCategory}] ${t.title} (slug: ${t.slug})`);
});
