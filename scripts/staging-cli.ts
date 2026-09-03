import {
  StagingRepository,
  applyReviewDecision,
  promoteStagedItem,
  previewPromotion
} from '../lib/extraction/staging';
import { PriorityLevel, CategoryId } from '../lib/banking-ca/schema';

function printHelp() {
  console.log(`
Mind of Aravalli — Human Review Staging CLI

Usage:
  tsx scripts/staging-cli.ts list
  tsx scripts/staging-cli.ts inspect <stagingId>
  tsx scripts/staging-cli.ts approve <stagingId> [--priority P1|P2|P3] [--category CATEGORY] [--rationale "TEXT"]
  tsx scripts/staging-cli.ts reject <stagingId> [--rationale "TEXT"]
  tsx scripts/staging-cli.ts quarantine <stagingId> [--rationale "TEXT"]
  tsx scripts/staging-cli.ts promote <stagingId>
`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const repo = new StagingRepository();
  const items = repo.loadItems();

  if (!command || command === 'help' || command === '--help') {
    printHelp();
    return;
  }

  if (command === 'list') {
    console.log('\n📦 Current Staging Queue:');
    if (items.length === 0) {
      console.log('  (No items in staging queue)');
      return;
    }
    console.log('─'.repeat(80));
    items.forEach((item, i) => {
      console.log(`[${i + 1}] ID: ${item.stagingId} | State: ${item.state} | Class: ${item.classification.classification}`);
      console.log(`    Fact: ${item.fact.statement.slice(0, 100)}...`);
      console.log(`    Provenance: "${item.fact.provenance.quotedText.slice(0, 80)}..."`);
      console.log('─'.repeat(80));
    });
    return;
  }

  const targetId = args[1];
  if (!targetId) {
    console.error('Error: Staging ID required.');
    process.exit(1);
  }

  const itemIndex = items.findIndex(it => it.stagingId === targetId || it.stagingId.includes(targetId));
  if (itemIndex === -1) {
    console.error(`Error: Staged item "${targetId}" not found.`);
    process.exit(1);
  }

  const item = items[itemIndex];

  if (command === 'inspect') {
    console.log('\n🔍 Inspecting Staged Item:');
    console.log(JSON.stringify(item, null, 2));
    const preview = previewPromotion(item);
    console.log('\n📋 Promotion Preview:');
    console.log(JSON.stringify(preview, null, 2));
    return;
  }

  const rationaleIndex = args.indexOf('--rationale');
  const rationale = rationaleIndex !== -1 ? args[rationaleIndex + 1] : 'Manual reviewer action via CLI';

  if (command === 'approve') {
    const priorityIndex = args.indexOf('--priority');
    const assignedPriority = (priorityIndex !== -1 ? args[priorityIndex + 1] : 'P2_HIGH') as PriorityLevel;

    const categoryIndex = args.indexOf('--category');
    const assignedCategory = (categoryIndex !== -1 ? args[categoryIndex + 1] : 'BANKING_REGULATION') as CategoryId;

    const updated = applyReviewDecision(item, {
      action: 'APPROVE',
      reviewer: 'CLI_HUMAN_REVIEWER',
      rationale,
      assignedPriority,
      assignedCategory,
      timestamp: new Date().toISOString()
    });

    items[itemIndex] = updated;
    repo.saveItems(items);
    repo.appendAuditLog({ event: 'APPROVE', stagingId: updated.stagingId, timestamp: new Date().toISOString() });
    console.log(`✅ Staged item ${updated.stagingId} APPROVED.`);
    return;
  }

  if (command === 'reject') {
    const updated = applyReviewDecision(item, {
      action: 'REJECT',
      reviewer: 'CLI_HUMAN_REVIEWER',
      rationale,
      timestamp: new Date().toISOString()
    });

    items[itemIndex] = updated;
    repo.saveItems(items);
    repo.appendAuditLog({ event: 'REJECT', stagingId: updated.stagingId, timestamp: new Date().toISOString() });
    console.log(`❌ Staged item ${updated.stagingId} REJECTED.`);
    return;
  }

  if (command === 'quarantine') {
    const updated = applyReviewDecision(item, {
      action: 'QUARANTINE',
      reviewer: 'CLI_HUMAN_REVIEWER',
      rationale,
      timestamp: new Date().toISOString()
    });

    items[itemIndex] = updated;
    repo.saveItems(items);
    repo.appendAuditLog({ event: 'QUARANTINE', stagingId: updated.stagingId, timestamp: new Date().toISOString() });
    console.log(`⚠️ Staged item ${updated.stagingId} QUARANTINED.`);
    return;
  }

  if (command === 'promote') {
    const { success, result, item: promotedItem } = promoteStagedItem(item);
    if (!success) {
      console.error(`❌ Promotion failed: ${result.details}`);
      process.exit(1);
    }

    items[itemIndex] = promotedItem;
    repo.saveItems(items);
    repo.appendAuditLog({ event: 'PROMOTE', stagingId: promotedItem.stagingId, result, timestamp: new Date().toISOString() });
    console.log(`🚀 Promotion successful: ${result.details}`);
    return;
  }

  console.error(`Unknown command: ${command}`);
  printHelp();
}

main().catch(err => {
  console.error('Staging CLI error:', err);
  process.exit(1);
});
