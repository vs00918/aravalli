import assert from 'assert';
import fs from 'fs';
import path from 'path';

function runPwaTests() {
  console.log('────────────────────────────────────────────────────────');
  console.log('🧪 Running PWA, Offline Access & Manifest Test Suite...');
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

  const rootDir = process.cwd();
  const manifestPath = path.join(rootDir, 'public', 'manifest.json');
  const swPath = path.join(rootDir, 'public', 'sw.js');
  const offlinePagePath = path.join(rootDir, 'app', 'offline', 'page.tsx');

  // Test 1: Manifest Exists and is Valid JSON
  test('PWA Manifest Exists and Parses as Valid JSON', () => {
    assert.ok(fs.existsSync(manifestPath), 'manifest.json must exist');
    const content = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(content);

    assert.ok(manifest.name && manifest.name.length > 0, 'manifest must have name');
    assert.ok(manifest.short_name && manifest.short_name.length > 0, 'manifest must have short_name');
    assert.strictEqual(manifest.start_url, '/', 'start_url must be /');
    assert.strictEqual(manifest.display, 'standalone', 'display mode must be standalone');
    assert.ok(manifest.theme_color, 'manifest must define theme_color');
    assert.ok(manifest.background_color, 'manifest must define background_color');
    assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 2, 'manifest must have at least 2 icons');
  });

  // Test 2: Manifest Icon Asset Resolution
  test('Manifest Icons Resolve to Valid Files on Disk', () => {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    for (const icon of manifest.icons) {
      const relativeIconPath = icon.src.replace(/^\//, '');
      const fullIconPath = path.join(rootDir, 'public', relativeIconPath);
      assert.ok(fs.existsSync(fullIconPath), `Icon file ${icon.src} must exist at ${fullIconPath}`);
    }
  });

  // Test 3: Service Worker Script Exists & Contains Versioned Caches
  test('Service Worker Exists and Declares Versioned Caches', () => {
    assert.ok(fs.existsSync(swPath), 'sw.js must exist in public/');
    const swContent = fs.readFileSync(swPath, 'utf8');

    assert.ok(swContent.includes('ca-static-'), 'sw.js must declare static cache version');
    assert.ok(swContent.includes('ca-data-'), 'sw.js must declare data cache version');
    assert.ok(swContent.includes('ca-pages-'), 'sw.js must declare pages cache version');
  });

  // Test 4: Service Worker Cache Strategies & Offline Fallback Contract
  test('Service Worker Implements Stale-While-Revalidate and Offline Fallback', () => {
    const swContent = fs.readFileSync(swPath, 'utf8');

    assert.ok(swContent.includes('banking-ca-registry.json'), 'sw.js must handle registry caching');
    assert.ok(swContent.includes('SKIP_WAITING'), 'sw.js must support safe skip-waiting message');
    assert.ok(swContent.includes('/offline'), 'sw.js must reference /offline fallback');
    assert.ok(swContent.includes('activate'), 'sw.js must handle activate event for cache eviction');
  });

  // Test 5: Offline Fallback Page Exists
  test('Offline Fallback Page Route Exists', () => {
    assert.ok(fs.existsSync(offlinePagePath), 'app/offline/page.tsx must exist');
    const content = fs.readFileSync(offlinePagePath, 'utf8');
    assert.ok(content.includes("Offline"), 'Offline page must have clear offline message');
  });

  // Test 6: Security Audit for Public PWA Assets
  test('Security & Secret Isolation (Zero Credentials in PWA Assets)', () => {
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const swContent = fs.readFileSync(swPath, 'utf8');

    for (const text of [manifestContent, swContent]) {
      assert.ok(!text.includes('AIZA'), 'Must not contain Google API keys');
      assert.ok(!text.includes('ghp_'), 'Must not contain GitHub tokens');
      assert.ok(!text.includes('Bearer'), 'Must not contain auth headers');
      assert.ok(!text.includes('C:\\Users'), 'Must not contain filesystem paths');
    }
  });

  console.log('\n────────────────────────────────────────────────────────');
  console.log(`Results: ${passed} / ${total} Tests Passed`);
  console.log('────────────────────────────────────────────────────────\n');

  if (passed !== total) {
    process.exit(1);
  }
}

if (require.main === module) {
  runPwaTests();
}
