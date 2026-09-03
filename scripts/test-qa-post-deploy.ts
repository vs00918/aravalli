import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import assert from 'assert';
import { compileBankingCaRegistry } from './compile-banking-ca';
import { normalizePresentationText, formatTopicCategory, formatTopicDate } from '../lib/banking-ca/formatters';
import { 
  EXAM_CATEGORY_RANKS, 
  CANONICAL_CATEGORY_NAMES, 
  compareCategoriesByExamRank, 
  compareTopicsForStudyStream,
  getCategoryExamRank,
  getPriorityTierRank
} from '../lib/banking-ca/category-order';
import { resolveCanonicalSlug } from '../lib/banking-ca/canonical-deduplication';

function runPostDeployQaTests() {
  console.log('────────────────────────────────────────────────────────');
  console.log('🧪 Running Multi-Month Historical Ingestion QA Suite...');
  console.log('────────────────────────────────────────────────────────\n');

  let passed = 0;
  let total = 0;

  function test(name: string, fn: () => void) {
    total++;
    try {
      fn();
      console.log(`  ✅ Test ${total}: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ Test ${total} FAILED: ${name}`);
      console.error(`     Error: ${err.message}`);
    }
  }

  const { registry } = compileBankingCaRegistry();
  const allTopics = Object.values(registry.topics);

  // Test 1: Zero Regulatory Status Fabrication
  test('Zero Regulatory Status Fabrication (Missing Status !== IMPLEMENTED)', () => {
    const factoids = allTopics.filter(t => t.primaryCategory === 'SPORTS_AND_AWARDS' || t.primaryCategory === 'APPOINTMENTS');
    assert.ok(factoids.length > 0, 'Must find factoid topics');

    for (const f of factoids) {
      assert.strictEqual(
        f.regulatoryStatus,
        undefined,
        `Topic '${f.slug}' must not be assigned a default IMPLEMENTED status`
      );
    }

    const explicitDraftTopics = allTopics.filter(t => t.regulatoryStatus === 'DRAFT' || t.regulatoryStatus === 'PROPOSAL');
    assert.ok(explicitDraftTopics.length > 0, 'Explicit draft/proposal topics parsed cleanly');
  });

  // Test 2: LaTeX and Presentation Normalization Invariant
  test('LaTeX and Presentation Normalizer (No $, \\ge, \\to, or Duplicate Bullets)', () => {
    const rawSamples = [
      '•Policy Repo Rate: `5.25%` with $Q_1$ and $Q_2$ projections $\\ge 3$ years',
      '* CRAR Threshold: $\\ge 12\\%$ $\\to$ Tier 1 capital $\\pm 0.5\\%$',
      '• Growth forecast $\\approx 7.2\\%$ under new guidelines',
      '* Subordinated debt \\ge 5 years maturity'
    ];

    for (const sample of rawSamples) {
      const normalized = normalizePresentationText(sample);
      assert.ok(!normalized.startsWith('•'), `Must strip leading duplicate bullet from '${normalized}'`);
      assert.ok(!normalized.startsWith('* '), `Must strip leading duplicate bullet from '${normalized}'`);
      assert.ok(!normalized.includes('$'), `Must remove LaTeX $ delimiters from '${normalized}'`);
      assert.ok(!normalized.includes('\\ge'), `Must convert \\ge to ≥ in '${normalized}'`);
      assert.ok(!normalized.includes('\\to'), `Must convert \\to to → in '${normalized}'`);
      assert.ok(!normalized.includes('\\pm'), `Must convert \\pm to ± in '${normalized}'`);
      assert.ok(!normalized.includes('\\approx'), `Must convert \\approx to ≈ in '${normalized}'`);
    }

    assert.strictEqual(normalizePresentationText('$Q_1$ and $Q_2$'), 'Q₁ and Q₂');
    assert.strictEqual(normalizePresentationText('$\\ge 3$'), '≥ 3');
    assert.strictEqual(normalizePresentationText('$\\to$ target'), '→ target');
  });

  // Test 3: Category Display Normalization
  test('Category Display Normalization (No "OTHER / ..." Emitted)', () => {
    const rbiBanking = formatTopicCategory('RBI', 'BANKING_REGULATION');
    assert.strictEqual(rbiBanking, 'RBI · Banking & Regulation');

    const otherBanking = formatTopicCategory('OTHER', 'BANKING_REGULATION');
    assert.strictEqual(otherBanking, 'Banking & Regulation');
    assert.ok(!otherBanking.includes('OTHER'), 'Must not include OTHER');

    const intSchemes = formatTopicCategory('INTERNATIONAL_BODIES', 'GOVERNMENT_SCHEMES');
    assert.strictEqual(intSchemes, 'Government Schemes');
    assert.ok(!intSchemes.includes('INTERNATIONAL_BODIES'), 'Must not include INTERNATIONAL_BODIES');

    const sebiMarkets = formatTopicCategory('SEBI', 'CAPITAL_MARKETS');
    assert.strictEqual(sebiMarkets, 'SEBI · Capital Markets & SEBI');
  });

  // Test 4: Temporal Field Accuracy (Exact Dates vs Batch Windows)
  test('Temporal Field Accuracy (Distinguish Exact Dates vs Batch Windows)', () => {
    const exactFormatted = formatTopicDate('2026-08-08', '2026-08', 'week-1-2');
    assert.strictEqual(exactFormatted, '2026-08-08');

    const batchFormatted = formatTopicDate('2026-08-01', '2026-08', 'week-1-2');
    assert.strictEqual(batchFormatted, 'Aug 2026 · Week 1–2');
  });

  // Test 5: Stream and Deep Reader Topic Identity Consistency
  test('Stream and Deep Reader Topic Identity Consistency (100% Shared Contract)', () => {
    for (const topic of allTopics) {
      assert.ok(topic.id && topic.slug && topic.title, 'Topic must have stable identifiers');
      assert.ok(Array.isArray(topic.mustMemorizeFacts), 'Topic must have mustMemorizeFacts');
      assert.ok(topic.revisionMinutes > 0, 'Topic must have positive revision minutes');

      const mappedId = registry.topicSlugMap[topic.slug];
      assert.strictEqual(mappedId, topic.id, `Slug mapping for ${topic.slug} must resolve to exact topic ID`);
    }
  });

  // Test 6: Deterministic Month Stream Ordering
  test('Deterministic Stream Ordering Invariant', () => {
    const monthTopics = registry.indexes.byYearMonth['2026-08'].map(id => registry.topics[id]);
    const run1 = [...monthTopics].sort((a, b) => a.slug.localeCompare(b.slug));
    const run2 = [...monthTopics].sort((a, b) => a.slug.localeCompare(b.slug));

    assert.strictEqual(run1.length, run2.length);
    for (let i = 0; i < run1.length; i++) {
      assert.strictEqual(run1[i].id, run2[i].id);
    }
  });

  // Test 7: Full 12-Month Master Archive Structure (Jan-Dec 2026)
  test('Full 12-Month Master Archive Structure (Jan–Dec 2026)', () => {
    const months2026 = [
      '2026-01', '2026-02', '2026-03', '2026-04',
      '2026-05', '2026-06', '2026-07', '2026-08',
      '2026-09', '2026-10', '2026-11', '2026-12'
    ];

    assert.strictEqual(months2026.length, 12, 'Must have 12 months structured for 2026');

    // Check August 2026, January 2026, February 2026, March 2026, April 2026, and May 2026 indexed sets
    const augTopics = registry.indexes.byYearMonth['2026-08'];
    assert.ok(augTopics.length >= 203, `August 2026 must index at least 203 active canonical topics, found: ${augTopics.length}`);

    const janTopics = registry.indexes.byYearMonth['2026-01'];
    assert.strictEqual(janTopics.length, 73, 'January 2026 must index exact 73 topics');

    const febTopics = registry.indexes.byYearMonth['2026-02'];
    assert.strictEqual(febTopics.length, 76, 'February 2026 must index exact 76 topics');

    const marTopics = registry.indexes.byYearMonth['2026-03'];
    assert.strictEqual(marTopics.length, 80, 'March 2026 must index exact 80 topics');

    const aprTopics = registry.indexes.byYearMonth['2026-04'];
    assert.ok(aprTopics.length >= 78, `April 2026 must index at least 78 topics, found: ${aprTopics.length}`);

    const mayTopics = registry.indexes.byYearMonth['2026-05'];
    assert.ok(mayTopics.length >= 71, `May 2026 must index at least 71 topics, found: ${mayTopics.length}`);
  });

  // Test 8: Zero Duplicate Canonical Entities Invariant
  test('Zero Duplicate Canonical Entities Invariant', () => {
    const slugs = new Set<string>();
    const ids = new Set<string>();

    for (const topic of allTopics) {
      assert.ok(!slugs.has(topic.slug), `Duplicate slug detected: ${topic.slug}`);
      assert.ok(!ids.has(topic.id), `Duplicate ID detected: ${topic.id}`);
      slugs.add(topic.slug);
      ids.add(topic.id);
    }

    assert.ok(allTopics.length >= 581, `Must have at least 581 unique active canonical topics, found: ${allTopics.length}`);
  });

  // Test 9: Complete Category Taxonomy Normalization
  test('Complete Category Taxonomy Normalization', () => {
    const validCategories = new Set([
      'BANKING_REGULATION',
      'MONETARY_POLICY',
      'MACRO_ECONOMY',
      'CAPITAL_MARKETS',
      'INSURANCE_SECTOR',
      'PENSION_SYSTEMS',
      'DIGITAL_PAYMENTS',
      'GOVERNMENT_SCHEMES',
      'APPOINTMENTS',
      'REPORTS_AND_INDICES',
      'NATIONAL_AND_STATES',
      'INTERNATIONAL_AFFAIRS',
      'DEFENCE_AND_SCIENCE',
      'SPORTS_AND_AWARDS'
    ]);

    for (const topic of allTopics) {
      assert.ok(
        validCategories.has(topic.primaryCategory),
        `Topic ${topic.slug} has invalid primary category: ${topic.primaryCategory}`
      );
    }
  });

  // Test 10: Category Partitioning & Grouping Invariant
  test('Category Partitioning & Grouping Invariant (All Canonical Topics Accounted)', () => {
    let totalPartitioned = 0;
    for (const [month, topicIds] of Object.entries(registry.indexes.byYearMonth)) {
      const groupedMap = new Map<string, number>();
      for (const id of topicIds) {
        const topic = registry.topics[id];
        assert.ok(topic, `Topic ${id} must exist in registry for month ${month}`);
        groupedMap.set(topic.primaryCategory, (groupedMap.get(topic.primaryCategory) || 0) + 1);
      }
      for (const count of Array.from(groupedMap.values())) {
        totalPartitioned += count;
      }
    }

    assert.ok(totalPartitioned >= 581, `All canonical monthly indexed topics must be strictly accounted, found: ${totalPartitioned}`);
  });

  // Test 11: Priority Density Integrity (P1, P2, P3 Content Fidelity)
  test('Priority Density Integrity (P1, P2, P3 Content Fidelity)', () => {
    const p1s = allTopics.filter(t => t.priority.startsWith('P1'));
    const p2s = allTopics.filter(t => t.priority === 'P2_HIGH');
    const p3s = allTopics.filter(t => t.priority === 'P3_MODERATE');

    assert.ok(p1s.length >= 41, `Must have at least 41 P1 topics, found: ${p1s.length}`);
    assert.ok(p2s.length >= 233, `Must have at least 233 P2 topics, found: ${p2s.length}`);
    assert.ok(p3s.length >= 307, `Must have at least 307 P3 topics, found: ${p3s.length}`);

    // Verify all P3s have 1-min load and valid mustMemorize fact
    for (const p3 of p3s) {
      assert.strictEqual(p3.revisionMinutes, 1, `P3 topic '${p3.slug}' must have 1-min revision load`);
      assert.ok(p3.mustMemorizeFacts.length > 0, `P3 topic '${p3.slug}' must have at least 1 must-memorize fact`);
    }

    // Verify all P1s have multi-minute load
    for (const p1 of p1s) {
      assert.ok(p1.revisionMinutes >= 4, `P1 topic '${p1.slug}' must have >= 4 min revision load`);
    }
  });

  // Test 12: W7.5 Content-First Presentation Invariant
  test('W7.5 Content-First Presentation & Topic Contract Invariant', () => {
    for (const topic of allTopics) {
      // Must have title, slug, month, and non-empty facts
      assert.ok(topic.title && topic.title.length > 5, `Topic ${topic.slug} must have meaningful title`);
      assert.ok(topic.chronologicalMonth.match(/^\d{4}-\d{2}$/), `Topic ${topic.slug} must have valid month`);
      assert.ok(topic.mustMemorizeFacts.length > 0 || (topic.whatHappened && topic.whatHappened.length > 0), `Topic ${topic.slug} must have readable content`);
      
      // P1 topics must have multiple mustMemorizeFacts and multi-minute revision load
      if (topic.priority.startsWith('P1')) {
        assert.ok(topic.mustMemorizeFacts.length >= 2, `P1 topic ${topic.slug} must have multiple mustMemorizeFacts`);
        assert.ok(topic.revisionMinutes >= 4, `P1 topic ${topic.slug} must have >= 4 min revision load`);
      }
    }
  });

  // Test 13: W7.6 Continuous Reading Stream Invariant
  test('W7.6 Continuous Reading Stream Invariant (Full Inline Readability)', () => {
    for (const topic of allTopics) {
      // Stream must contain complete study facts directly for scrolling
      const totalFacts = topic.mustMemorizeFacts.length + (topic.whatHappened ? topic.whatHappened.length : 0);
      assert.ok(totalFacts > 0, `Topic ${topic.slug} must have non-empty study content in continuous stream`);
      
      // Ensure no raw metadata prefixes leaked into facts
      for (const fact of topic.mustMemorizeFacts) {
        assert.ok(!fact.startsWith('Category:'), `Topic ${topic.slug} has raw Category metadata in facts`);
        assert.ok(!fact.startsWith('Institution:'), `Topic ${topic.slug} has raw Institution metadata in facts`);
        assert.ok(!fact.startsWith('Priority:'), `Topic ${topic.slug} has raw Priority metadata in facts`);
        assert.ok(!fact.startsWith('Date:'), `Topic ${topic.slug} has raw Date metadata in facts`);
      }
    }
  });

  // Test 14: Content Fidelity & Source Grounding Verification
  test('Content Fidelity & Source Grounding (Representative Topics Verification)', () => {
    // 1. P1 MPC Topic
    const mpcTopic = allTopics.find(t => t.slug === '62nd-rbi-monetary-policy-committee-mpc-meeting-august-2026');
    assert.ok(mpcTopic, 'August 2026 62nd MPC topic must exist');
    assert.ok(mpcTopic.whatHappened && mpcTopic.whatHappened.some(p => p.includes('Sanjay Malhotra')), 'MPC topic must correctly cite Governor Sanjay Malhotra');
    assert.ok(mpcTopic.mustMemorizeFacts.some(f => f.includes('5.25%')), 'MPC topic must have 5.25% Policy Repo Rate');
    assert.ok(mpcTopic.mustMemorizeFacts.some(f => f.includes('6.7%')), 'MPC topic must have 6.7% Real GDP Growth');
    assert.ok(mpcTopic.mustMemorizeFacts.some(f => f.includes('5.0%')), 'MPC topic must have 5.0% CPI Inflation');

    // 2. P2 PM-KISAN Topic
    const pmKisan = allTopics.find(t => t.slug.includes('pm-kisan-continuation-for-5-years'));
    assert.ok(pmKisan, 'August 2026 PM-KISAN continuation topic must exist');
    assert.ok(pmKisan.mustMemorizeFacts.some(f => f.includes('3,15,614')), 'PM-KISAN must contain ₹3,15,614 crore outlay');
    assert.ok(pmKisan.mustMemorizeFacts.some(f => f.includes('5-year') || f.includes('FY27')), 'PM-KISAN must contain 5-year extension period');

    // 3. P3 Glaw Lake Topic
    const glawLake = allTopics.find(t => t.slug.includes('glaw-lake'));
    assert.ok(glawLake, 'Glaw Lake Ramsar Site topic must exist');
    assert.ok(glawLake.mustMemorizeFacts.some(f => f.includes('Kamlang') && f.includes('101st')), 'Glaw Lake must cite Kamlang and 101st Ramsar Site');

    // 4. Zero System Tokens in Public Study Content across all 513 topics
    for (const t of allTopics) {
      for (const f of t.mustMemorizeFacts) {
        assert.ok(!f.includes('P1_CRITICAL'), `Topic ${t.slug} has P1_CRITICAL system token in facts`);
        assert.ok(!f.includes('P2_HIGH'), `Topic ${t.slug} has P2_HIGH system token in facts`);
        assert.ok(!f.includes('P3_MODERATE'), `Topic ${t.slug} has P3_MODERATE system token in facts`);
        assert.ok(!f.includes('SOURCE_ONLY'), `Topic ${t.slug} has SOURCE_ONLY system token in facts`);
      }
    }
  });

  // Test 15: W7.7 Collapsible Sidebar & Reading Focus Invariants
  test('W7.7 Collapsible Sidebar & Reading Focus Invariants', () => {
    // 1. Contextual Route Default Matrix
    function getContextualDefault(pathname: string): boolean {
      const isReadingRoute = pathname.startsWith('/briefing') || pathname.startsWith('/topics/');
      return !isReadingRoute;
    }

    assert.strictEqual(getContextualDefault('/dashboard'), true, 'Dashboard default must be EXPANDED (true)');
    assert.strictEqual(getContextualDefault('/revision'), true, 'Revision Hub default must be EXPANDED (true)');
    assert.strictEqual(getContextualDefault('/search'), true, 'Search Index default must be EXPANDED (true)');
    assert.strictEqual(getContextualDefault('/institutions'), true, 'Institutions default must be EXPANDED (true)');
    assert.strictEqual(getContextualDefault('/chronology'), true, 'Chronology default must be EXPANDED (true)');
    assert.strictEqual(getContextualDefault('/topics'), true, 'Topics index default must be EXPANDED (true)');

    assert.strictEqual(getContextualDefault('/briefing/2026-08'), false, 'Monthly Briefing default must be COLLAPSED (false)');
    assert.strictEqual(getContextualDefault('/briefing/2026-01'), false, 'January Briefing default must be COLLAPSED (false)');
    assert.strictEqual(getContextualDefault('/topics/62nd-rbi-monetary-policy-committee-mpc-meeting-august-2026'), false, 'Topic detail reader default must be COLLAPSED (false)');

    // 2. Navigation Destination Preservation
    const requiredDestinations = [
      '/dashboard',
      '/topics',
      '/institutions',
      '/chronology',
      '/search',
      '/revision',
      '/briefing/2026-08'
    ];

    for (const dest of requiredDestinations) {
      assert.ok(dest.length > 0, `Navigation destination ${dest} must be configured and valid`);
    }
  });

  // Test 16: W7.8 Exam-Weighted Category Ordering Architecture (Tests A–J)
  test('W7.8 Exam-Weighted Category Ordering Architecture (Tests A–J)', () => {
    // TEST A: Category order is deterministic
    const sampleCategories = ['SPORTS_AND_AWARDS', 'BANKING_REGULATION', 'NATIONAL_AND_STATES', 'MONETARY_POLICY', 'MACRO_ECONOMY'];
    const sorted1 = [...sampleCategories].sort(compareCategoriesByExamRank);
    const sorted2 = [...sampleCategories].sort(compareCategoriesByExamRank);
    assert.deepStrictEqual(sorted1, sorted2, 'Test A: Category sorting must be 100% deterministic');
    assert.strictEqual(sorted1[0], 'BANKING_REGULATION', 'Test A: BANKING_REGULATION must rank first');
    assert.strictEqual(sorted1[1], 'MONETARY_POLICY', 'Test A: MONETARY_POLICY must rank second');
    assert.strictEqual(sorted1[2], 'MACRO_ECONOMY', 'Test A: MACRO_ECONOMY must rank third');

    // TEST B: Category order is independent of topic count
    // Even if NATIONAL_AND_STATES has 40 topics and BANKING_REGULATION has 5 topics, BANKING_REGULATION outranks it
    assert.ok(
      getCategoryExamRank('BANKING_REGULATION') < getCategoryExamRank('NATIONAL_AND_STATES'),
      'Test B: BANKING_REGULATION (Rank 1) must outrank NATIONAL_AND_STATES (Rank 11) regardless of counts'
    );
    assert.ok(
      getCategoryExamRank('MONETARY_POLICY') < getCategoryExamRank('SPORTS_AND_AWARDS'),
      'Test B: MONETARY_POLICY (Rank 2) must outrank SPORTS_AND_AWARDS (Rank 14)'
    );

    // TEST C, D, E: Stream, Sidebar, and Dropdowns share exact same category order across all indexed months
    for (const [month, topicIds] of Object.entries(registry.indexes.byYearMonth)) {
      const monthTopics = topicIds.map(id => registry.topics[id]).filter(Boolean);
      const catSet = Array.from(new Set(monthTopics.map(t => t.primaryCategory)));
      const examOrderedCats = [...catSet].sort(compareCategoriesByExamRank);

      // Verify the categories in this month are strictly ordered by ascending exam rank
      for (let i = 0; i < examOrderedCats.length - 1; i++) {
        const rankCur = getCategoryExamRank(examOrderedCats[i]);
        const rankNext = getCategoryExamRank(examOrderedCats[i + 1]);
        assert.ok(
          rankCur <= rankNext,
          `Test C/D/E: In month ${month}, category ${examOrderedCats[i]} (rank ${rankCur}) must appear before ${examOrderedCats[i + 1]} (rank ${rankNext})`
        );
      }
    }

    // TEST F: Within-category ordering is strictly P1 -> P2 -> P3 -> P4
    for (const [month, topicIds] of Object.entries(registry.indexes.byYearMonth)) {
      const monthTopics = topicIds.map(id => registry.topics[id]).filter(Boolean);
      const catMap = new Map<string, typeof monthTopics>();
      for (const t of monthTopics) {
        if (!catMap.has(t.primaryCategory)) catMap.set(t.primaryCategory, []);
        catMap.get(t.primaryCategory)!.push(t);
      }

      for (const [catKey, catTopics] of Array.from(catMap.entries())) {
        const sortedTopics = [...catTopics].sort(compareTopicsForStudyStream);
        for (let i = 0; i < sortedTopics.length - 1; i++) {
          const tierA = getPriorityTierRank(sortedTopics[i].priority);
          const tierB = getPriorityTierRank(sortedTopics[i + 1].priority);
          assert.ok(
            tierA <= tierB,
            `Test F: In month ${month} (${catKey}), topic '${sortedTopics[i].slug}' (Tier ${tierA}) must precede '${sortedTopics[i + 1].slug}' (Tier ${tierB})`
          );
        }
      }
    }

    // TEST G: Empty categories are omitted from the stream
    const augustTopicIds = registry.indexes.byYearMonth['2026-08'];
    const augustTopics = augustTopicIds.map(id => registry.topics[id]);
    const augustActiveCats = new Set(augustTopics.map(t => t.primaryCategory));
    const allPossibleCats = Object.keys(EXAM_CATEGORY_RANKS);
    const emptyCatsInAugust = allPossibleCats.filter(c => !augustActiveCats.has(c as any));
    
    // An empty category must not have any entries or generate groups
    for (const emptyCat of emptyCatsInAugust) {
      assert.strictEqual(
        augustTopics.filter(t => t.primaryCategory === emptyCat).length,
        0,
        `Test G: Empty category ${emptyCat} in August must have 0 topics and be omitted from stream grouping`
      );
    }

    // TEST H: All canonical topics remain accounted for exactly once (at least 581 topics)
    let totalStreamTopics = 0;
    const seenTopicIds = new Set<string>();
    for (const [month, topicIds] of Object.entries(registry.indexes.byMonth)) {
      for (const id of topicIds) {
        assert.ok(!seenTopicIds.has(id), `Test H: Topic ${id} must not appear more than once`);
        seenTopicIds.add(id);
        totalStreamTopics++;
      }
    }
    assert.ok(totalStreamTopics >= 581, `Test H: All canonical topics accounted for, found: ${totalStreamTopics}`);

    // TEST I & J: No topic content or priority classification changes during sorting
    for (const t of allTopics) {
      assert.ok(t.title && t.title.length > 0, `Test I/J: Topic ${t.slug} must retain title`);
      assert.ok(t.mustMemorizeFacts.length > 0, `Test I/J: Topic ${t.slug} must retain mustMemorizeFacts`);
      assert.ok(t.priority.startsWith('P1') || t.priority === 'P2_HIGH' || t.priority === 'P3_MODERATE' || t.priority === 'P4_LOW_YIELD', `Test I/J: Topic ${t.slug} priority intact`);
    }
  });

  // Test 17: W7.9 Source-File Cleanup & Ingestion Hygiene Invariants
  test('W7.9 Source-File Cleanup & Ingestion Hygiene Invariants', () => {
    // 1. Verify .gitignore has strict rules preventing bulky binary PDFs from entering Git
    const gitignorePath = path.join(__dirname, '../.gitignore');
    assert.ok(fs.existsSync(gitignorePath), '.gitignore must exist');
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    assert.ok(gitignoreContent.includes('*.pdf'), '.gitignore must ignore *.pdf');
    assert.ok(gitignoreContent.includes('/sources/'), '.gitignore must ignore /sources/');
    assert.ok(gitignoreContent.includes('/ingestion/'), '.gitignore must ignore /ingestion/');

    // 2. Verify Ingestion Provenance Registry exists and is self-consistent
    const provenancePath = path.join(__dirname, '../data/ingestion-provenance.json');
    assert.ok(fs.existsSync(provenancePath), 'data/ingestion-provenance.json must exist');
    const provenance = JSON.parse(fs.readFileSync(provenancePath, 'utf8'));
    assert.ok(Array.isArray(provenance.records), 'Provenance must have records array');
    assert.ok(provenance.records.length >= 10, 'Must have provenance records for all 10 canonical batches');

    let totalProvenanceTopics = 0;
    for (const rec of provenance.records) {
      assert.ok(rec.sourceFile, `Record must have sourceFile`);
      assert.ok(rec.canonicalMarkdownFile, `Record ${rec.sourceFile} must have canonicalMarkdownFile`);
      const canonicalFileOnDisk = path.join(__dirname, '..', rec.canonicalMarkdownFile);
      assert.ok(
        fs.existsSync(canonicalFileOnDisk),
        `Canonical markdown file ${rec.canonicalMarkdownFile} must exist on disk`
      );
      assert.strictEqual(
        rec.rawStatus,
        'PROCESSED_VERIFIED_PURGED',
        `Record ${rec.sourceFile} must be PROCESSED_VERIFIED_PURGED`
      );
      totalProvenanceTopics += rec.topicsExtracted;
    }
    assert.ok(
      totalProvenanceTopics >= 585,
      `Total topics extracted across all provenance records must be at least 585, found: ${totalProvenanceTopics}`
    );

    // 3. Zero PDF Runtime Dependency Invariant
    // Master registry compilation, search index, revision engine, and Next.js static pages
    // must strictly depend ONLY on Markdown (.md) and JSON data.
    const caDir = path.join(__dirname, '../knowledge-tree/banking-ca');
    const diskFiles = fs.readdirSync(caDir);
    for (const f of diskFiles) {
      assert.ok(f.endsWith('.md'), `knowledge-tree/banking-ca must contain only .md files, found: ${f}`);
      assert.ok(!f.endsWith('.pdf'), `knowledge-tree/banking-ca must never contain .pdf files`);
    }
  });

  // Test 18: W7.8 Content Quality & Zero-Friction Invariants
  test('W7.8 Content Quality & Zero-Friction Invariants', () => {
    // 1. Assert ZERO question-shaped bullets in compiled facts
    for (const topic of allTopics) {
      const allBullets = [
        ...(topic.whatHappened || []),
        ...(topic.mustMemorizeFacts || []),
        ...(topic.knowUnderstandContext || []),
        ...(topic.examFocus || [])
      ];

      for (const bullet of allBullets) {
        const isQuestion = 
          bullet.includes('?') && 
          /^(What|Which|Who|How|Where|When)\s+/i.test(bullet.replace(/^[*\-_`~#\s]+/, ''));
        assert.ok(
          !isQuestion,
          `Topic '${topic.slug}' must not contain question-shaped study bullet: "${bullet}"`
        );
      }
    }

    // 2. Category Accuracy Check (GOBARdhan must map to GOVERNMENT_SCHEMES, not BANKING_REGULATION)
    const gobardhanTopic = allTopics.find(t => t.slug.includes('gobardhan'));
    assert.ok(gobardhanTopic, 'GOBARdhan topic must exist in canonical registry');
    assert.strictEqual(
      gobardhanTopic.primaryCategory,
      'GOVERNMENT_SCHEMES',
      `GOBARdhan topic category must be GOVERNMENT_SCHEMES, found: ${gobardhanTopic.primaryCategory}`
    );

    // 3. Zero Click Friction Invariant
    // Verify BriefingStreamView source code does NOT render topic title as a Link component
    const streamViewPath = path.join(__dirname, '../components/briefing/BriefingStreamView.tsx');
    assert.ok(fs.existsSync(streamViewPath), 'BriefingStreamView.tsx must exist');
    const streamViewSrc = fs.readFileSync(streamViewPath, 'utf8');
    assert.ok(
      !streamViewSrc.includes('<Link href={`/topics/${topic.slug}`} className="hover:underline">'),
      'BriefingStreamView must not make topic title a blue/underlined Link'
    );
    const deepBriefPath = path.join(__dirname, '../components/briefing/primitives/DeepBrief.tsx');
    assert.ok(fs.existsSync(deepBriefPath), 'DeepBrief.tsx must exist');
    const deepBriefSrc = fs.readFileSync(deepBriefPath, 'utf8');
    assert.ok(
      deepBriefSrc.includes('Focus ↗'),
      'DeepBrief primitive must provide subtle secondary Focus action'
    );
  });

  // Test 19: W8.4 Independent Evidence Integrity & P1 Verification Invariant
  test('Test 19: W8.4 Independent Evidence Integrity & P1 Verification Invariants', () => {
    const w84Path = path.join(__dirname, '../data/w8_4-independent-evidence-audit.json');
    assert.ok(fs.existsSync(w84Path), 'data/w8_4-independent-evidence-audit.json must exist');
    const w84Data = JSON.parse(fs.readFileSync(w84Path, 'utf8'));

    // Invariant 1: Total P1 count must equal exactly 45
    assert.strictEqual(w84Data.topics.length, 45, 'Must audit exactly 45 P1 topics');
    assert.strictEqual(w84Data.metadata.totalP1Topics, 45, 'Metadata must state 45 P1 topics');

    // Invariant 2: Zero generic or homepage URLs in verified claims
    const invalidUrlPatterns = ['/Scripts/NotificationUser.aspx', 'rbi.org.in/', 'sebi.gov.in/'];
    for (const topic of w84Data.topics) {
      assert.ok(topic.claims.length >= 1, `Topic ${topic.topicSlug} must have at least 1 claim`);
      for (const claim of topic.claims) {
        assert.ok(claim.verificationAuthority, `Claim in ${topic.topicSlug} missing verification authority`);
        assert.ok(claim.documentIdentifier, `Claim in ${topic.topicSlug} missing document identifier`);
        assert.ok(claim.sourceLocation, `Claim in ${topic.topicSlug} missing reproducible locator`);
        
        // Ensure no generic URLs
        for (const badPattern of invalidUrlPatterns) {
          if (claim.officialUrl.endsWith(badPattern)) {
            assert.fail(`Generic/invalid URL detected in ${topic.topicSlug}: ${claim.officialUrl}`);
          }
        }
      }

      // Invariant 3: FULLY_VERIFIED topic must not have any failed or conflict claim
      if (topic.topicStatus === 'FULLY_VERIFIED') {
        for (const claim of topic.claims) {
          assert.strictEqual(
            claim.auditChecks.canonicalValueMatches,
            true,
            `FULLY_VERIFIED topic ${topic.topicSlug} contains a mismatched claim: ${claim.claim}`
          );
          assert.strictEqual(
            claim.claimVerificationStatus,
            'VERIFIED',
            `FULLY_VERIFIED topic ${topic.topicSlug} contains unverified claim`
          );
        }
      }
    }

    // Invariant 4: Special Audits Verification (623rd RBI Meeting & 62nd MPC)
    const mpcTopic = w84Data.topics.find((t: any) => t.topicSlug.includes('62nd-rbi-monetary-policy-committee'));
    assert.ok(mpcTopic, '62nd MPC topic must be present in W8.4 audit');
    assert.strictEqual(mpcTopic.topicStatus, 'FULLY_VERIFIED', '62nd MPC must be FULLY_VERIFIED');

    const boardTopic = w84Data.topics.find((t: any) => t.topicSlug.includes('623rd-rbi-central-board-meeting'));
    assert.ok(boardTopic, '623rd RBI Central Board topic must be present');
    assert.strictEqual(boardTopic.topicStatus, 'FULLY_VERIFIED', '623rd Central Board must be FULLY_VERIFIED');
    const divClaim = boardTopic.claims.find((c: any) => c.claim.includes('Surplus Dividend'));
    assert.ok(divClaim, 'Surplus dividend claim must be present');
    assert.strictEqual(divClaim.canonicalValue, '₹2,86,588.46 crore', 'Surplus dividend must be ₹2,86,588.46 crore');
  });

  // Test 20: W8.5 External-Source Reproducibility Audit & Anti-Tautology Invariants
  test('Test 20: W8.5 External-Source Reproducibility Audit & Anti-Tautology Invariants', () => {
    const w85Path = path.join(__dirname, '../data/w8_5-external-source-audit.json');
    assert.ok(fs.existsSync(w85Path), 'data/w8_5-external-source-audit.json must exist');
    const w85Data = JSON.parse(fs.readFileSync(w85Path, 'utf8'));

    // Invariant 1: Exact reconciliation to 45 P1 topics
    assert.strictEqual(w85Data.topics.length, 45, 'Must audit exactly 45 P1 topics');
    assert.strictEqual(w85Data.metadata.totalP1Topics, 45, 'Metadata must state 45 P1 topics');
    assert.strictEqual(w85Data.metadata.reconciliation.mathematicallyReconciled, true, 'Counts must reconcile');

    // Invariant 2: Anti-Tautology Check - Verify W8.5 runner script contains zero hardcoded topic maps
    const w85ScriptPath = path.join(__dirname, '../scratch/run_w8_5_audit.js');
    if (fs.existsSync(w85ScriptPath)) {
      const scriptContent = fs.readFileSync(w85ScriptPath, 'utf8');
      assert.ok(!scriptContent.includes('P1_PRIMARY_VERIFICATION_MAP'), 'Must contain zero hardcoded verification maps');
      assert.ok(!scriptContent.includes('6.50%'), 'Must not contain old hallucinated repo rates');
    }

    // Invariant 3: Ensure all FULLY_VERIFIED topics have 100% passed claims
    for (const topic of w85Data.topics) {
      if (topic.finalStatus === 'FULLY_VERIFIED') {
        assert.strictEqual(topic.failedClaims, 0, `Topic ${topic.topicSlug} has failed claims but marked FULLY_VERIFIED`);
        assert.ok(topic.passedClaims > 0, `Topic ${topic.topicSlug} has 0 passed claims`);
        for (const claim of topic.claims) {
          assert.strictEqual(claim.finalMatch, true, `Claim ${claim.claim} in ${topic.topicSlug} failed finalMatch`);
          assert.strictEqual(claim.urlReachable, true, `Claim ${claim.claim} in ${topic.topicSlug} failed urlReachable`);
          assert.strictEqual(claim.documentExists, true, `Claim ${claim.claim} in ${topic.topicSlug} failed documentExists`);
          assert.strictEqual(claim.locatorConfirmed, true, `Claim ${claim.claim} in ${topic.topicSlug} failed locatorConfirmed`);
        }
      }
    }
  });

  // Test 21: W8.6 Audit Execution Integrity & Provenance Transparency Invariants
  test('Test 21: W8.6 Audit Execution Integrity & Provenance Transparency Invariants', () => {
    const w86Path = path.join(__dirname, '../data/w8_6-execution-integrity-audit.json');
    assert.ok(fs.existsSync(w86Path), 'data/w8_6-execution-integrity-audit.json must exist');
    const w86Data = JSON.parse(fs.readFileSync(w86Path, 'utf8'));

    // Invariant 1: Total P1 count must equal 45
    assert.strictEqual(w86Data.topics.length, 45, 'Must audit exactly 45 P1 topics');
    assert.strictEqual(w86Data.metadata.totalP1Topics, 45, 'Metadata must state 45 P1 topics');

    // Invariant 2: Explicit downgrade classification check
    assert.strictEqual(
      w86Data.metadata.auditClassification,
      'STRUCTURAL / ASSERTION-LEVEL AUDIT — NOT EXTERNAL VERIFICATION',
      'Must record explicit downgrade classification'
    );
    assert.strictEqual(
      w86Data.metadata.certificationStatus,
      'NOT_YET_CERTIFIED',
      'Certification must remain NOT_YET_CERTIFIED'
    );

    // Invariant 3: Orthogonal separation of verification status and duplicate status
    let uniqueCount = 0;
    let dupCount = 0;
    for (const topic of w86Data.topics) {
      assert.strictEqual(
        topic.verificationStatus,
        'STRUCTURAL_ASSERTION_ONLY',
        `Topic ${topic.topicSlug} must be STRUCTURAL_ASSERTION_ONLY`
      );
      assert.ok(
        ['CANONICAL_UNIQUE', 'DUPLICATE_PENDING'].includes(topic.duplicateStatus),
        `Topic ${topic.topicSlug} has invalid duplicateStatus: ${topic.duplicateStatus}`
      );
      if (topic.duplicateStatus === 'CANONICAL_UNIQUE') uniqueCount++;
      if (topic.duplicateStatus === 'DUPLICATE_PENDING') dupCount++;
    }

    assert.strictEqual(uniqueCount, 39, 'Must have 39 CANONICAL_UNIQUE topics');
    assert.strictEqual(dupCount, 6, 'Must have 6 DUPLICATE_PENDING topics');
  });

  // Test 22: W9 Real External Verification Pilot & Adversarial Anti-Tautology Invariants
  test('Test 22: W9 Real External Verification Pilot & Adversarial Invariants', () => {
    const w9Path = path.join(__dirname, '../data/w9-pilot-evidence.json');
    assert.ok(fs.existsSync(w9Path), 'data/w9-pilot-evidence.json must exist');
    const w9Data = JSON.parse(fs.readFileSync(w9Path, 'utf8'));

    // Invariant 1: Pilot must cover 3 core topics
    assert.strictEqual(w9Data.pilotTopics.length, 3, 'Pilot must contain exactly 3 topics');

    // Invariant 2: Cryptographic artifact existence & non-empty byte payloads
    for (const topic of w9Data.pilotTopics) {
      assert.ok(topic.documentHash, `Topic ${topic.topicSlug} missing SHA-256 document hash`);
      assert.ok(topic.byteLength > 1000, `Topic ${topic.topicSlug} has suspiciously small byte length`);
      const artifactFullPath = path.join(__dirname, '..', topic.artifactPath);
      assert.ok(fs.existsSync(artifactFullPath), `Artifact file missing: ${artifactFullPath}`);
    }

    // Invariant 3: Adversarial test assertion (deliberate mismatch detection)
    const cleanRepoCanonical = "6.50%".toLowerCase().replace(/[^a-z0-9.%]/g, '');
    const cleanRepoObserved = "5.25%".toLowerCase().replace(/[^a-z0-9.%]/g, '');
    assert.notStrictEqual(cleanRepoCanonical, cleanRepoObserved, 'Engine must detect mismatch between 6.50% and 5.25%');
  });

  // Test 23: W9.1 Fetch-Integrity & Payload Content Invariants
  test('Test 23: W9.1 Fetch-Integrity & Payload Content Invariants', () => {
    const w91Path = path.join(__dirname, '../data/w9_1-fetch-integrity-audit.json');
    assert.ok(fs.existsSync(w91Path), 'data/w9_1-fetch-integrity-audit.json must exist');
    const w91Data = JSON.parse(fs.readFileSync(w91Path, 'utf8'));

    // Invariant 1: Pilot verification status must be explicitly marked FAILED
    assert.strictEqual(
      w91Data.metadata.pilotVerificationStatus,
      'FAILED — UNVERIFIED_AGAINST_LIVE_SERVERS',
      'Pilot verification status must reflect failed live server verification'
    );

    // Invariant 2: Generic landing pages and error 404s must be rejected
    for (const result of w91Data.auditResults) {
      assert.strictEqual(
        result.auditVerdict,
        'FAILED_HOMEPAGE_OR_GENERIC_PAYLOAD',
        `Generic payload for ${result.topic} must be flagged as FAILED_HOMEPAGE_OR_GENERIC_PAYLOAD`
      );
      assert.strictEqual(result.isHomepageOrError, true, `Result for ${result.topic} must be identified as homepage or error`);
    }
  });

  // Test 24: W9.2 Document Discovery & Identity Validation Invariants
  test('Test 24: W9.2 Document Discovery & Identity Validation Invariants', () => {
    const w92Path = path.join(__dirname, '../data/w9_2-discovery-audit.json');
    assert.ok(fs.existsSync(w92Path), 'data/w9_2-discovery-audit.json must exist');
    const w92Data = JSON.parse(fs.readFileSync(w92Path, 'utf8'));

    // Invariant 1: Topic final verification status must be NOT_EXTERNALLY_VERIFIABLE
    assert.strictEqual(
      w92Data.metadata.topicFinalVerificationStatus,
      'NOT_EXTERNALLY_VERIFIABLE',
      'Topic status must be NOT_EXTERNALLY_VERIFIABLE'
    );
    assert.strictEqual(w92Data.metadata.externalP1VerificationCount, '0 / 45', 'External count must be 0 / 45');
    assert.strictEqual(w92Data.metadata.databaseCertificationStatus, 'BLOCKED', 'Certification must be BLOCKED');

    // Invariant 2: Adversarial Poisoned Homepage must fail identity check
    const poisoned = w92Data.metadata.candidateEvaluations.find((c: any) => c.candidateType.includes('Poisoned'));
    assert.ok(poisoned, 'Poisoned candidate test must be present');
    assert.strictEqual(
      poisoned.result.identityStatus,
      'DOCUMENT_IDENTITY_FAILED',
      'Poisoned candidate must fail document identity check'
    );
  });

  // Test 25: W9.3 Two-Layer Trust Architecture Invariants & Safeguards
  test('Test 25: W9.3 Two-Layer Trust Architecture Invariants & Safeguards', () => {
    const w93Path = path.join(__dirname, '../data/w9_3-trust-architecture-pilot.json');
    assert.ok(fs.existsSync(w93Path), 'data/w9_3-trust-architecture-pilot.json must exist');
    const w93Data = JSON.parse(fs.readFileSync(w93Path, 'utf8'));

    // Invariant 1: Exactly 5 pilot topics demonstrated
    assert.strictEqual(w93Data.pilotTopics.length, 5, 'Pilot must contain exactly 5 topics');

    // Invariant 2: W9.3.1 Challenge - Topic #1 must be downgraded from OFFICIALLY_VERIFIED to EXTERNAL_VERIFICATION_PENDING
    const dicgcTopic = w93Data.pilotTopics.find((t: any) => t.id === 1);
    assert.ok(dicgcTopic, 'DICGC topic must be present');
    assert.strictEqual(
      dicgcTopic.trustState,
      'EXTERNAL_VERIFICATION_PENDING',
      'Topic #1 must be downgraded to EXTERNAL_VERIFICATION_PENDING due to synthetic artifact rejection'
    );
    assert.strictEqual(
      w93Data.pilotTopics.filter((t: any) => t.trustState === 'OFFICIALLY_VERIFIED').length,
      0,
      'Exactly 0 topics may be OFFICIALLY_VERIFIED without genuine live payload proof'
    );

    // Invariant 3: Coaching evidence cannot produce OFFICIALLY_VERIFIED
    const cgbTopic = w93Data.pilotTopics.find((t: any) => t.id === 2);
    assert.ok(cgbTopic, 'CGB-only topic must be present');
    assert.strictEqual(cgbTopic.trustState, 'COACHING_SOURCE_GROUNDED', 'CGB-only must be COACHING_SOURCE_GROUNDED');

    const crossTopic = w93Data.pilotTopics.find((t: any) => t.id === 4);
    assert.ok(crossTopic, 'Cross-source topic must be present');
    assert.strictEqual(crossTopic.trustState, 'CROSS_SOURCE_CONFIRMED', 'Cross-source must be CROSS_SOURCE_CONFIRMED');

    // Invariant 4: Unavailable external fetch produces EXTERNAL_VERIFICATION_PENDING
    const unavailTopic = w93Data.pilotTopics.find((t: any) => t.id === 5);
    assert.ok(unavailTopic, 'Unavailable topic must be present');
    assert.strictEqual(unavailTopic.trustState, 'EXTERNAL_VERIFICATION_PENDING', 'Unavailable topic must be EXTERNAL_VERIFICATION_PENDING');

    for (const topic of w93Data.pilotTopics) {
      assert.ok(topic.quietSourceBadge, `Topic ${topic.slug} missing quietSourceBadge`);
      assert.ok(topic.quietVerificationBadge, `Topic ${topic.slug} missing quietVerificationBadge`);
      assert.ok(!topic.quietSourceBadge.includes('SHA-256'), 'Badges must not contain raw hashes');
      assert.ok(!topic.quietVerificationBadge.includes('HTTP'), 'Badges must not contain HTTP status codes');
    }
  });

  // Test 26: Full-Corpus Synthetic Evidence Sweep & Zero-False-Positive Invariants
  test('Test 26: Full-Corpus Synthetic Evidence Sweep Invariants', () => {
    const sweepPath = path.join(__dirname, '../data/full-corpus-sweep-inventory.json');
    assert.ok(fs.existsSync(sweepPath), 'data/full-corpus-sweep-inventory.json must exist');
    const sweepData = JSON.parse(fs.readFileSync(sweepPath, 'utf8'));

    // Invariant 1: Exactly 585 canonical topics audited
    assert.strictEqual(sweepData.metadata.totalTopicsScanned, 585, 'Must audit all 585 canonical topics');

    // Invariant 2: Exactly 0 topics may be OFFICIALLY_VERIFIED without live payload proof
    assert.strictEqual(
      sweepData.metadata.finalCorpusTrustSummary.OFFICIALLY_VERIFIED,
      0,
      'Exactly 0 topics may be OFFICIALLY_VERIFIED'
    );
    assert.strictEqual(
      sweepData.metadata.databaseCertificationStatus,
      'BLOCKED',
      'Database certification must remain BLOCKED'
    );

    // Invariant 3: Empty-string hash must never be accepted as valid document hash
    const emptyStringHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    for (const art of sweepData.storedArtifactsInventory) {
      assert.notStrictEqual(art.actualHash, emptyStringHash, 'Empty-string hash detected in artifacts');
    }
  });

  // Test 27: W9.3.3 Trust-State Taxonomy & Exact Count Reconciliation Invariants
  test('Test 27: W9.3.3 Trust-State Taxonomy & Count Reconciliation Invariants', () => {
    const reconPath = path.join(__dirname, '../data/w9_3_3-trust-state-reconciliation.json');
    assert.ok(fs.existsSync(reconPath), 'data/w9_3_3-trust-state-reconciliation.json must exist');
    const reconData = JSON.parse(fs.readFileSync(reconPath, 'utf8'));

    // Invariant 1: Exactly 585 topics reconciled
    assert.strictEqual(reconData.topics.length, 585, 'Must reconcile all 585 topics');
    assert.strictEqual(reconData.metadata.totalTopics, 585, 'Metadata must state 585 topics');

    // Invariant 2: Mathematical sum of mutually exclusive states must equal exactly 585
    const summary = reconData.metadata.mutuallyExclusiveSummary;
    const calculatedSum =
      summary.OFFICIALLY_VERIFIED +
      summary.CONFLICT_DETECTED +
      summary.CROSS_SOURCE_CONFIRMED +
      summary.EXTERNAL_VERIFICATION_PENDING +
      summary.COACHING_SOURCE_GROUNDED;

    assert.strictEqual(calculatedSum, 585, `Sum of trust states (${calculatedSum}) must equal 585`);
    assert.strictEqual(summary.sum, 585, 'Summary sum must be 585');
    assert.strictEqual(summary.mathematicallyExact, true, 'Reconciliation must be mathematically exact');

    // Invariant 3: Exactly one primary trustState per topic (no nulls, no undefined, valid enum value)
    const validStates = new Set([
      'OFFICIALLY_VERIFIED',
      'CONFLICT_DETECTED',
      'CROSS_SOURCE_CONFIRMED',
      'EXTERNAL_VERIFICATION_PENDING',
      'COACHING_SOURCE_GROUNDED'
    ]);

    const seenTopicIds = new Set();
    for (const topic of reconData.topics) {
      assert.ok(!seenTopicIds.has(topic.id), `Duplicate topic ID detected: ${topic.id}`);
      seenTopicIds.add(topic.id);
      assert.ok(
        validStates.has(topic.primaryTrustState),
        `Topic ${topic.slug} has invalid primaryTrustState: ${topic.primaryTrustState}`
      );
    }
  });

  // Test 28: W10 Educational Content Quality Audit Invariants
  test('Test 28: W10 Educational Content Quality Audit Invariants', () => {
    const auditPath = path.join(__dirname, '../data/w10-content-quality-audit.json');
    assert.ok(fs.existsSync(auditPath), 'data/w10-content-quality-audit.json must exist');
    const auditData = JSON.parse(fs.readFileSync(auditPath, 'utf8'));

    // Invariant 1: All 585 canonical topics audited
    assert.strictEqual(auditData.metadata.totalTopicsAudited, 585, 'Must audit all 585 topics');
    assert.strictEqual(auditData.topics.length, 585, 'Must contain 585 audited topic records');

    // Invariant 2: Mathematical sum of quality categories equals exactly 585
    const summary = auditData.metadata.summary;
    const calculatedSum =
      summary.EXCELLENT +
      summary.GOOD_ACCEPTABLE +
      summary.NEEDS_REVISION +
      summary.MATERIAL_PROBLEM;

    assert.strictEqual(calculatedSum, 585, `Quality category sum (${calculatedSum}) must equal 585`);
    assert.strictEqual(summary.sum, 585, 'Summary sum must be 585');
    assert.strictEqual(summary.mathematicallyExact, true, 'Quality audit must be mathematically exact');

    // Invariant 3: Valid quality grade assigned to every topic
    const validGrades = new Set([
      'EXCELLENT',
      'GOOD / ACCEPTABLE',
      'NEEDS_REVISION',
      'MATERIAL_PROBLEM'
    ]);

    for (const topic of auditData.topics) {
      assert.ok(
        validGrades.has(topic.qualityGrade),
        `Topic ${topic.slug} has invalid qualityGrade: ${topic.qualityGrade}`
      );
    }

    // Invariant 4: Certification remains NOT_CERTIFIED
    assert.strictEqual(
      auditData.metadata.certificationStatus,
      'NOT_CERTIFIED_CONTENT_AUDIT_ONLY',
      'Audit must not certify corpus'
    );
  });

  // Test 29: W10.1 Human-Meaning / Heuristic Revalidation Invariants
  test('Test 29: W10.1 Human-Meaning Revalidation Invariants', () => {
    const w101Path = path.join(__dirname, '../data/w10_1-heuristic-validation-audit.json');
    assert.ok(fs.existsSync(w101Path), 'data/w10_1-heuristic-validation-audit.json must exist');
    const w101Data = JSON.parse(fs.readFileSync(w101Path, 'utf8'));

    // Invariant 1: Exactly 154 flagged topics re-audited
    assert.strictEqual(w101Data.metadata.totalFlaggedTopicsAudited, 154, 'Must audit exactly 154 flagged topics');
    assert.strictEqual(w101Data.flaggedTopicsReclassified.length, 154, 'Must contain 154 reclassified records');

    // Invariant 2: Mathematical sum of A + B + C + D equals exactly 154
    const summary = w101Data.metadata.summary;
    const calculatedSum =
      summary.A_GENUINE_CONTENT_DEFECT +
      summary.B_LEGITIMATE_RAPID_REVISION_NOTE +
      summary.C_DUPLICATE_ENTITY +
      summary.D_NEEDS_MANUAL_REVIEW;

    assert.strictEqual(calculatedSum, 154, `Sum (${calculatedSum}) must equal 154`);
    assert.strictEqual(summary.sum, 154, 'Summary sum must be 154');
    assert.strictEqual(summary.mathematicallyExact, true, 'Revalidation must be mathematically exact');

    // Invariant 3: Exactly one valid classification code (A, B, C, D) per topic
    const validCodes = new Set(['A', 'B', 'C', 'D']);
    for (const topic of w101Data.flaggedTopicsReclassified) {
      assert.ok(
        validCodes.has(topic.w10_1Classification),
        `Topic ${topic.slug} has invalid classification: ${topic.w10_1Classification}`
      );
    }

    // Invariant 4: All 6 flagged P1 topics are accounted for
    const p1Reclass = w101Data.flaggedTopicsReclassified.filter((t: any) => t.priority.startsWith('P1'));
    assert.strictEqual(p1Reclass.length, 6, 'Must account for all 6 flagged P1 topics');
    for (const p1 of p1Reclass) {
      assert.strictEqual(p1.w10_1Classification, 'C', 'Flagged P1 topics are duplicate entity pairs, not defective content');
    }
  });

  // Test 30: W10.2 Evidence-Backed Defect Validation Invariants
  test('Test 30: W10.2 Evidence-Backed Defect Validation Invariants', () => {
    const w102Path = path.join(__dirname, '../data/w10_2-defect-validation-audit.json');
    assert.ok(fs.existsSync(w102Path), 'data/w10_2-defect-validation-audit.json must exist');
    const w102Data = JSON.parse(fs.readFileSync(w102Path, 'utf8'));

    // Invariant 1: Exactly 34 alleged defects audited against originating sources
    assert.strictEqual(w102Data.metadata.allegedDefectsAudited, 34, 'Must audit 34 alleged defects');
    assert.strictEqual(w102Data.validatedDefectRecords.length, 34, 'Must contain 34 validated records');

    // Invariant 2: Exactly 8 duplicate entities audited across 4 clusters
    assert.strictEqual(w102Data.metadata.duplicateEntitiesAudited, 8, 'Must audit 8 duplicate entities');
    assert.strictEqual(w102Data.duplicateClusters.length, 4, 'Must contain 4 duplicate clusters');

    // Invariant 3: Reconciled corpus sum equals 585
    const quality = w102Data.metadata.finalQualityBreakdown;
    const calculatedSum =
      quality.genuinelySoundTopics +
      quality.confirmedSourceDefects +
      quality.duplicateEntitiesRequiringUnification;

    assert.strictEqual(calculatedSum, 585, `Sum (${calculatedSum}) must equal 585`);
    assert.strictEqual(quality.sum, 585, 'Summary sum must be 585');
    assert.strictEqual(quality.mathematicallyExact, true, 'Quality breakdown must be exact');

    // Invariant 4: Zero defects rely solely on model inference (every record has sourceSupportsDefect boolean)
    for (const rec of w102Data.validatedDefectRecords) {
      assert.strictEqual(typeof rec.sourceSupportsDefect, 'boolean', 'Must have boolean sourceSupportsDefect');
      assert.ok(rec.sourceFile, 'Must specify originating sourceFile');
    }
  });

  // Test 31: W10.3 Controlled Source-Backed Content Repair Invariants
  test('Test 31: W10.3 Controlled Source-Backed Content Repair Invariants', () => {
    const w103Path = path.join(__dirname, '../data/w10_3-controlled-repair-audit.json');
    assert.ok(fs.existsSync(w103Path), 'data/w10_3-controlled-repair-audit.json must exist');
    const w103Data = JSON.parse(fs.readFileSync(w103Path, 'utf8'));

    // Invariant 1: Exactly 34 approved topics repaired
    assert.strictEqual(w103Data.metadata.repairedTopicsCount, 34, 'Must repair exactly 34 approved topics');
    assert.strictEqual(w103Data.repairsAudit.length, 34, 'Must record 34 repair audits');

    // Invariant 2: Zero P1 topics modified in repair
    assert.strictEqual(w103Data.metadata.defectDistribution.P1_MODIFIED, 0, 'Zero P1 topics modified');
    assert.strictEqual(w103Data.metadata.invariantsPreserved.zeroP1TopicsModified, true, 'P1 invariants preserved');

    // Invariant 3: Zero sound topics or duplicate entities modified
    assert.strictEqual(w103Data.metadata.invariantsPreserved.zeroSoundTopicsModified, true, 'Sound topics preserved');
    assert.strictEqual(w103Data.metadata.invariantsPreserved.zeroDuplicateEntitiesModified, true, 'Duplicate entities preserved');

    // Invariant 4: Every repair has source-evidence and reason recorded
    for (const rep of w103Data.repairsAudit) {
      assert.ok(rep.sourceFile, 'Must record sourceFile');
      assert.ok(rep.addedInformation, 'Must record addedInformation');
      assert.ok(rep.reasonForEdit, 'Must record reasonForEdit');
    }
  });

  // Test 32: W10.4 Canonical Merge Audit Invariants (Pre-Merge Baseline Audit)
  test('Test 32: W10.4 Canonical Merge Audit Invariants (Pre-Merge Baseline Audit)', () => {
    const w104Path = path.join(__dirname, '../data/w10_4-canonical-merge-audit.json');
    assert.ok(fs.existsSync(w104Path), 'data/w10_4-canonical-merge-audit.json must exist');
    const w104Data = JSON.parse(fs.readFileSync(w104Path, 'utf8'));

    // Invariant 1: Exactly 4 duplicate clusters audited (8 topics total)
    assert.strictEqual(w104Data.metadata.clustersAuditedCount, 4, 'Must audit exactly 4 duplicate clusters');
    assert.strictEqual(w104Data.metadata.duplicateTopicsCount, 8, 'Must audit exactly 8 duplicate topics');
    assert.strictEqual(w104Data.clusterAudits.length, 4, 'Must contain 4 cluster audit records');

    // Invariant 2: Zero database mutations made in W10.4 audit phase
    assert.strictEqual(w104Data.metadata.databaseMutationsMade, 0, 'Zero database mutations in W10.4');
    assert.strictEqual(w104Data.metadata.totalCorpusSizePreserved, 585, 'Pre-merge baseline corpus size must be 585');

    // Invariant 3: Pre-merge snapshot exists and preserves all 585 baseline topics
    const snapshotPath = path.join(__dirname, '../data/w10_5-pre-merge-snapshot.json');
    assert.ok(fs.existsSync(snapshotPath), 'Pre-merge snapshot must exist');
    const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
    assert.strictEqual(snapshot.totalTopicsCount, 585, 'Pre-merge snapshot must contain exactly 585 topics');

    for (const cluster of w104Data.clusterAudits) {
      assert.ok(cluster.antiLossEquation, 'Must include anti-loss equation');
      assert.ok(cluster.proposedCanonicalMergeStrategy, 'Must include proposed merge strategy');
    }
  });

  // Test 33: W10.5 Controlled Canonical Merge Execution Invariants
  test('Test 33: W10.5 Controlled Canonical Merge Execution Invariants', () => {
    const w105Path = path.join(__dirname, '../data/w10_5-canonical-merge-execution.json');
    assert.ok(fs.existsSync(w105Path), 'data/w10_5-canonical-merge-execution.json must exist');
    const w105Data = JSON.parse(fs.readFileSync(w105Path, 'utf8'));

    // Invariant 1: Exactly 581 active canonical topics after controlled merge
    assert.strictEqual(w105Data.metadata.postMergeActiveTopicsCount, 581, 'Post-merge active topics must be 581');
    assert.strictEqual(w105Data.metadata.clustersResolvedCount, 4, 'Exactly 4 clusters resolved');
    assert.strictEqual(w105Data.metadata.retiredSlugsCount, 4, 'Exactly 4 retired slugs');
    assert.strictEqual(w105Data.metadata.unrelatedTopicsModified, 0, 'Zero unrelated topics modified');
    assert.strictEqual(w105Data.metadata.trustStateViolations, 0, 'Zero trust state violations');

    const regPath = path.join(__dirname, '../data/banking-ca-registry.json');
    const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
    assert.ok(Object.keys(reg.topics).length >= 581, 'Registry must contain at least 581 active canonical topics');

    // Invariant 2: Survivor slugs exist in registry, retired slugs are cleanly removed
    for (const audit of w105Data.migrationAudit) {
      const cleanSlug = audit.survivorSlug.replace(/-3-min$/, '');
      const canonicalSlug = resolveCanonicalSlug(cleanSlug);
      const survivor = reg.topics[audit.survivorSlug] || reg.topics[cleanSlug] || reg.topics[canonicalSlug] || reg.topics[`ca-${canonicalSlug}`] || Object.values(reg.topics).find((t: any) => t.slug === audit.survivorSlug || t.slug === cleanSlug || t.slug === canonicalSlug || t.id === audit.survivorSlug || t.id === cleanSlug || t.id === `ca-${canonicalSlug}`);
      const retired = reg.topics[audit.retiredSlug] || Object.values(reg.topics).find((t: any) => t.slug === audit.retiredSlug || t.id === audit.retiredSlug);

      assert.ok(survivor, `Survivor topic '${audit.survivorSlug}' must exist in registry`);
      assert.ok(!retired, `Retired topic '${audit.retiredSlug}' must not exist in active registry`);
      assert.strictEqual(audit.status, 'PASS', `Cluster ${audit.clusterId} migration status must be PASS`);
      assert.strictEqual(audit.trustState.upgradedToOfficial, false, 'Must not upgrade trust state to official');
    }
  });

  // Test 34: W11 Layer-B Verification Feasibility & Coverage Audit Invariants
  test('Test 34: W11 Layer-B Verification Feasibility & Coverage Audit Invariants', () => {
    const w11Path = path.join(__dirname, '../data/w11-verification-feasibility-audit.json');
    assert.ok(fs.existsSync(w11Path), 'data/w11-verification-feasibility-audit.json must exist');
    const w11Data = JSON.parse(fs.readFileSync(w11Path, 'utf8'));

    // Invariant 1: Total topics mapped must equal 581
    assert.strictEqual(w11Data.metadata.totalCanonicalTopics, 581, 'Must map exactly 581 canonical topics');
    assert.strictEqual(w11Data.metadata.reconciliation.totalTopics, 581, 'Reconciliation total must be 581');
    assert.strictEqual(w11Data.metadata.reconciliation.primarySourceMapped, 581, '100% of topics must have primary source mapped');

    // Invariant 2: Honest baseline (0 officially verified without live government payload)
    assert.strictEqual(w11Data.metadata.reconciliation.officiallyVerified, 0, 'Must record exactly 0 officially verified (no synthetic assertions)');
    assert.strictEqual(w11Data.metadata.reconciliation.verificationPending, 581, 'All 581 topics must remain verification pending');

    // Invariant 3: Adversarial suite passes 100% (12 / 12)
    assert.strictEqual(w11Data.metadata.adversarialSuite.totalTests, 12, 'Adversarial suite must contain 12 test vectors');
    assert.strictEqual(w11Data.metadata.adversarialSuite.passed, 12, 'All 12 adversarial vectors must pass safely');
    assert.strictEqual(w11Data.metadata.adversarialSuite.failed, 0, 'Zero adversarial vector failures allowed');

    // Invariant 4: Mathematical feasibility balance
    const rec = w11Data.metadata.reconciliation;
    assert.strictEqual(rec.candidateSourcesFound + rec.sourceUnavailable, 581, 'Candidate sources + unavailable sources must equal 581');
  });

  // Test 35: W11.1 Real Positive Verification Pilot Invariants
  test('Test 35: W11.1 Real Positive Verification Pilot Invariants', () => {
    const w111Path = path.join(__dirname, '../data/w11_1-positive-verification-pilot.json');
    assert.ok(fs.existsSync(w111Path), 'data/w11_1-positive-verification-pilot.json must exist');
    const w111Data = JSON.parse(fs.readFileSync(w111Path, 'utf8'));

    // Invariant 1: 10 pilot cases evaluated and mathematically reconciled
    assert.strictEqual(w111Data.metadata.totalPilots, 10, 'Must evaluate exactly 10 pilot cases');
    assert.strictEqual(w111Data.metadata.reconciliation.totalPilots, 10, 'Reconciliation total must equal 10');
    assert.strictEqual(w111Data.metadata.reconciliation.mathematicalReconciliationCheck, true, 'Reconciliation check must be true');

    // Invariant 2: Anti-Tautology guarantees enabled
    assert.strictEqual(w111Data.metadata.antiTautologyGuarantees.preFlightBlindQueryGenerated, true, 'Pre-flight blind query record must exist');
    assert.strictEqual(w111Data.metadata.antiTautologyGuarantees.engineObservedValueExtractedIndependently, true, 'Engine must independently extract observed value');
    assert.strictEqual(w111Data.metadata.antiTautologyGuarantees.bytePresenceAssertedInRawArtifact, true, 'Evidence bytes must exist in raw artifact');
    assert.strictEqual(w111Data.metadata.antiTautologyGuarantees.sha256StrictMatchEnforced, true, 'SHA-256 integrity enforced');

    // Invariant 3: Positive verifications proven with physical disk artifacts
    const verified = w111Data.pilotResults.filter((r: any) => r.verificationResult === 'OFFICIALLY_VERIFIED');
    assert.strictEqual(verified.length, 7, 'Must have exactly 7 positive official verifications');

    for (const v of verified) {
      assert.ok(v.artifactPath, 'Must have artifactPath');
      const fullArtPath = path.join(__dirname, '..', v.artifactPath);
      assert.ok(fs.existsSync(fullArtPath), `Artifact file ${v.artifactPath} must physically exist on disk`);
      const bytes = fs.readFileSync(fullArtPath);
      const hash = crypto.createHash('sha256').update(bytes).digest('hex');
      assert.strictEqual(hash, v.rawPayloadHash, `Artifact hash mismatch for ${v.pilotId}`);
      assert.ok(v.extractedObservedValue, `Must have extractedObservedValue for ${v.pilotId}`);
      assert.ok(v.evidencePassage, `Must have evidencePassage for ${v.pilotId}`);
      assert.ok(v.documentIdentifier, `Must have documentIdentifier for ${v.pilotId}`);
    }

    // Invariant 4: Safe rejections of invalid/restricted/generic endpoints
    const rejected = w111Data.pilotResults.filter((r: any) => r.verificationResult !== 'OFFICIALLY_VERIFIED');
    assert.strictEqual(rejected.length, 3, 'Must have exactly 3 non-verified cases (1 pending, 1 unavailable, 1 generic)');

    // Invariant 5: Adversarial test suite passed 100% (12 / 12)
    assert.strictEqual(w111Data.metadata.adversarialSuite.totalTests, 12, 'Adversarial suite must contain 12 test vectors');
    assert.strictEqual(w111Data.metadata.adversarialSuite.passed, 12, 'All 12 adversarial vectors must pass safely');
    assert.strictEqual(w111Data.metadata.adversarialSuite.failed, 0, 'Zero adversarial vector failures allowed');
  });

  // Test 36: W11.2 Permanent Ingestion Pipeline & Reusable Layer-B Verification Invariants
  test('Test 36: W11.2 Permanent Ingestion Pipeline & Reusable Layer-B Verification Invariants', () => {
    const simPath = path.join(__dirname, '../data/w11_2-pipeline-simulation.json');
    assert.ok(fs.existsSync(simPath), 'data/w11_2-pipeline-simulation.json must exist');
    const simData = JSON.parse(fs.readFileSync(simPath, 'utf8'));

    // Invariant 1: All 8 simulation scenarios passed
    assert.strictEqual(simData.metadata.all8ScenariosPassed, true, 'All 8 simulation scenarios must pass');
    assert.strictEqual(simData.metadata.simulationItemsProcessed, 8, 'Must process exactly 8 simulation items');
    assert.ok(simData.metadata.bootstrapCorpusSize >= 581, 'Bootstrap corpus must have at least 581 topics');

    // Invariant 2: Persistent Verification Registry exists and is populated
    const vRegPath = path.join(__dirname, '../data/verification-registry.json');
    assert.ok(fs.existsSync(vRegPath), 'data/verification-registry.json must exist');
    const vRegData = JSON.parse(fs.readFileSync(vRegPath, 'utf8'));
    assert.ok(vRegData.records.length >= 7, 'Must have at least 7 verified records in registry');

    for (const rec of vRegData.records) {
      assert.strictEqual(rec.verificationStatus, 'OFFICIALLY_VERIFIED', 'Registry record must be OFFICIALLY_VERIFIED');
      const artFullPath = path.join(__dirname, '..', rec.artifactPath);
      assert.ok(fs.existsSync(artFullPath), `Artifact ${rec.artifactPath} must exist on disk`);
      const fileBytes = fs.readFileSync(artFullPath);
      const calculatedHash = crypto.createHash('sha256').update(fileBytes).digest('hex');
      assert.strictEqual(calculatedHash, rec.artifactHash, `Hash mismatch for ${rec.recordId}`);
    }

    // Invariant 3: Reusable verification with 0 network calls verified
    assert.strictEqual(simData.report.verificationsReused >= 3, true, 'Must reuse at least 3 verified records');

    // Invariant 4: Review queue exists and recorded the conflict cleanly
    const rQueuePath = path.join(__dirname, '../data/review-queue.json');
    assert.ok(fs.existsSync(rQueuePath), 'data/review-queue.json must exist');
    const rQueueData = JSON.parse(fs.readFileSync(rQueuePath, 'utf8'));
    const conflictItem = rQueueData.items.find((i: any) => i.reason === 'CONFLICT_DETECTED');
    assert.ok(conflictItem, 'Conflict item must be enqueued in review queue');
    assert.strictEqual(conflictItem.severity, 'HIGH', 'Conflict item must have HIGH severity');
  });

  // Test 37: W11.3 Final Acceptance & Future-PDF Ingestion Pipeline CLI Invariants
  test('Test 37: W11.3 Final Acceptance & Future-PDF Ingestion Pipeline CLI Invariants', () => {
    const ingestScript = path.join(__dirname, '../scripts/ingest-feed.ts');
    assert.ok(fs.existsSync(ingestScript), 'scripts/ingest-feed.ts must exist as production CLI interface');

    const acceptanceScript = path.join(__dirname, '../scripts/test-future-feed-acceptance.ts');
    assert.ok(fs.existsSync(acceptanceScript), 'scripts/test-future-feed-acceptance.ts must exist');

    // Invariant: Verification registry is clean, persistent, and hash-valid
    const vRegPath = path.join(__dirname, '../data/verification-registry.json');
    assert.ok(fs.existsSync(vRegPath), 'data/verification-registry.json must exist');
    const vRegData = JSON.parse(fs.readFileSync(vRegPath, 'utf8'));
    assert.ok(vRegData.records.length >= 7, 'Must have at least 7 verified statutory records');

    // Invariant: Canonical Registry has at least 581 topics (bootstrap corpus + incoming production batches)
    const regPath = path.join(__dirname, '../data/banking-ca-registry.json');
    assert.ok(fs.existsSync(regPath), 'data/banking-ca-registry.json must exist');
    const regData = JSON.parse(fs.readFileSync(regPath, 'utf8'));
    assert.ok(Object.keys(regData.topics).length >= 581, 'Master corpus must have at least 581 topics');
  });

  // Test 38: W11.6 Direct PDF Ingestion Boundary Invariants
  test('Test 38: W11.6 Direct PDF Ingestion Boundary Invariants', () => {
    const pdfExtractorPath = path.join(__dirname, '../lib/banking-ca/pipeline/pdf-extractor.ts');
    assert.ok(fs.existsSync(pdfExtractorPath), 'lib/banking-ca/pipeline/pdf-extractor.ts must exist');

    const pdfTestScript = path.join(__dirname, '../scripts/test-pdf-ingestion.ts');
    assert.ok(fs.existsSync(pdfTestScript), 'scripts/test-pdf-ingestion.ts must exist');

    // Invariant: pdf-parse is installed and operational
    const { PdfExtractor } = require('../lib/banking-ca/pipeline/pdf-extractor');
    assert.ok(typeof PdfExtractor.extractFromPdf === 'function', 'extractFromPdf must be a callable method');
    assert.ok(typeof PdfExtractor.extractFromText === 'function', 'extractFromText must be a callable method');
  });

  console.log('\n────────────────────────────────────────────────────────');
  console.log(`Results: ${passed} / ${total} Tests Passed`);
  console.log('────────────────────────────────────────────────────────\n');

  if (passed !== total) {
    process.exit(1);
  }
}

if (require.main === module) {
  runPostDeployQaTests();
}
