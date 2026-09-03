import fs from 'fs';
import path from 'path';
import { BankingCaMasterRegistry } from '../lib/banking-ca/schema';
import { compileAndSaveAllCapsules } from '../lib/banking-ca/capsule-engine';

async function main() {
  console.log('────────────────────────────────────────────────────────');
  console.log('🚀 Compiling Pre-Exam High-Yield Revision Capsules...');
  console.log('────────────────────────────────────────────────────────');

  const registryPath = path.join(process.cwd(), 'data/banking-ca-registry.json');
  if (!fs.existsSync(registryPath)) {
    console.error('Error: Master registry data/banking-ca-registry.json not found.');
    process.exit(1);
  }

  const registry: BankingCaMasterRegistry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  const outDir = path.join(process.cwd(), 'data/cram-capsules');

  const artifacts = compileAndSaveAllCapsules(registry, outDir);

  console.log('✅ Generated High-Yield Revision Artifacts:');
  for (const [name, filePath] of Object.entries(artifacts)) {
    const stats = fs.statSync(filePath);
    console.log(`  - ${name} (${(stats.size / 1024).toFixed(1)} KB) -> ${filePath}`);
  }

  console.log('────────────────────────────────────────────────────────\n');
}

main().catch(err => {
  console.error('Capsule compilation failed:', err);
  process.exit(1);
});
