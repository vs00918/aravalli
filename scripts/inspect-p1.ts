import { compileBankingCaRegistry } from './compile-banking-ca';

function main() {
  const { registry } = compileBankingCaRegistry();
  
  const augTopicIds = registry.indexes.byYearMonth['2026-08'] || [];
  const augP1s = augTopicIds.map(id => registry.topics[id]).filter(t => t && t.priority.startsWith('P1'));
  
  console.log('========================================================');
  console.log('AUGUST 2026 P1 AUDIT:');
  console.log('Total August P1 Count:', augP1s.length);
  console.log('Total August P1 Minutes:', augP1s.reduce((sum, t) => sum + t.revisionMinutes, 0));
  augP1s.forEach((t, i) => {
    console.log(` ${i+1}. [${t.priority}] ${t.title} (${t.revisionMinutes} min)`);
  });
  
  const janTopicIds = registry.indexes.byYearMonth['2026-01'] || [];
  const janP1s = janTopicIds.map(id => registry.topics[id]).filter(t => t && t.priority.startsWith('P1'));
  
  console.log('\n========================================================');
  console.log('JANUARY 2026 P1 AUDIT:');
  console.log('Total January P1 Count:', janP1s.length);
  console.log('Total January P1 Minutes:', janP1s.reduce((sum, t) => sum + t.revisionMinutes, 0));
  janP1s.forEach((t, i) => {
    console.log(` ${i+1}. [${t.priority}] ${t.title} (${t.revisionMinutes} min)`);
  });
  
  console.log('\n========================================================');
  console.log('COMBINED MASTER REGISTRY SUMMARY:');
  console.log('Total Canonical Topics :', registry.summary.totalCanonicalTopics);
  console.log('Total Active P1 Topics  :', registry.summary.activeP1Count);
  console.log('Total P1 Revision Mins  :', registry.summary.activeP1RevisionMinutes);
  console.log('Total P2 Topics         :', registry.summary.totalP2Count);
  console.log('Total P3 Topics         :', registry.summary.totalP3Count);
  console.log('========================================================');
}

main();
