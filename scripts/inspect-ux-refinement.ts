import fs from 'fs';
import path from 'path';

const registry = JSON.parse(fs.readFileSync('./data/banking-ca-registry.json', 'utf8'));
const augustTopics: any[] = Object.values(registry.topics).filter((t: any) => t.chronologicalMonth === '2026-08');

console.log('=== INSPECTING KEY P1 / P2 TOPICS POST-UX REFINEMENT ===\n');

// 1. SDRF / NDRF
const sdrf: any = augustTopics.find((t: any) => t.slug.includes('sdrf') || t.title.includes('SDRF'));
if (sdrf) {
  console.log(`Topic: ${sdrf.title} (${sdrf.priority})`);
  console.log(`Facts count: ${sdrf.mustMemorizeFacts?.length}`);
  sdrf.mustMemorizeFacts?.forEach((f: string, i: number) => {
    console.log(`  [Fact ${i+1}] ${f}`);
  });
}
