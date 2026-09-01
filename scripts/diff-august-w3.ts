import { execSync } from 'child_process';

console.log('=== DIFF OF 10-august-2026-smartkeeda-w3.md (d17a03f -> 907445d) ===\n');
const diff = execSync('git diff d17a03f..907445d -- knowledge-tree/banking-ca/10-august-2026-smartkeeda-w3.md').toString();
console.log(diff || '[NO DIFF]');
