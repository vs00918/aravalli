import fs from 'fs';
import path from 'path';
import { compileBankingCaRegistry } from './compile-banking-ca';

const { registry } = compileBankingCaRegistry();
const p1s = Object.values(registry.topics).filter((t: any) => t.priority.startsWith('P1'));

console.log('=== P1 COMPREHENSION TEST SCRIPT ===');
console.log('Total P1 Topics:', p1s.length);

const sdrfTopic = Object.values(registry.topics).find((t: any) => t.title.toLowerCase().includes('sdrf'));
if (sdrfTopic) {
  console.log('\n--- SDRF Topic Analysis ---');
  console.log('Title:', sdrfTopic.title);
  console.log('whatHappened:', sdrfTopic.whatHappened);
  console.log('mustMemorizeFacts:', sdrfTopic.mustMemorizeFacts);
  console.log('knowUnderstandContext:', sdrfTopic.knowUnderstandContext);
  console.log('examFocus:', sdrfTopic.examFocus);
}
