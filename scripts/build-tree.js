const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'c:/Users/visha/OneDrive/Documents/mind of aravalli';
const DOMAINS_DIR = path.join(ROOT_DIR, 'knowledge-tree', 'domains');
const OUTPUT_FILE = path.join(ROOT_DIR, 'data', 'knowledge-registry.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(ROOT_DIR, 'data'))) {
    fs.mkdirSync(path.join(ROOT_DIR, 'data'), { recursive: true });
}

function parseDomainMetadata(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relPath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
    const filename = path.basename(filePath, '.md');
    
    // Extract Title (# Heading)
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].replace(/Domain\s+\d+:\s*/i, '').trim() : filename;

    // Extract Kernel Blockquote
    const quoteMatch = content.match(/>\s*\*\*Domain Kernel\*\*:\s*([^\n]+)/i) || content.match(/>\s*([^\n]+)/);
    const summary = quoteMatch ? quoteMatch[1].replace(/\*\*|\[|\]/g, '').trim() : 'Master comprehensive synthesis across foundational physical and cognitive systems.';

    // Assign Domain Metadata and Icons
    let icon = '🌌';
    let domainName = 'Physical Sciences';
    let tierLabel = 'Master Knowledge Domain';

    if (filename.includes('physics')) {
        icon = '🌌';
        domainName = 'Physics & Quantum Spacetime';
    } else if (filename.includes('energy')) {
        icon = '⚡';
        domainName = 'Energy & Electrification';
    } else if (filename.includes('biology')) {
        icon = '🧬';
        domainName = 'Biology & Synthetic Life';
    } else if (filename.includes('complex')) {
        icon = '🕸️';
        domainName = 'Complex Systems & Holobionts';
    } else if (filename.includes('political')) {
        icon = '🏛️';
        domainName = 'Political Economy & Society';
    }

    // Extract Sections (H2 headings for sub-table of contents)
    const sectionMatches = content.matchAll(/^##\s+(\d+\.\s+[^#\n]+)$/gm);
    const sections = [];
    for (const match of sectionMatches) {
        sections.push(match[1].trim());
    }

    // Estimate Read Time & Word Count
    const wordCount = content.split(/\s+/).length;
    const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

    return {
        id: filename,
        title: title,
        tier: 'domain',
        tierLabel: tierLabel,
        icon: icon,
        domain: domainName,
        summary: summary,
        path: relPath,
        wordCount: wordCount,
        readTime: `${readTimeMin} min read`,
        sections: sections,
        connections: []
    };
}

function buildRegistry() {
    console.log('Scanning Domain Volumes in:', DOMAINS_DIR);
    
    if (!fs.existsSync(DOMAINS_DIR)) {
        console.error('Domains directory does not exist!');
        return;
    }

    const files = fs.readdirSync(DOMAINS_DIR).filter(f => f.endsWith('.md')).sort();
    const nodes = [];

    files.forEach(file => {
        const fullPath = path.join(DOMAINS_DIR, file);
        const meta = parseDomainMetadata(fullPath);
        nodes.push(meta);
    });

    const registry = {
        generatedAt: new Date().toISOString(),
        totalDomains: nodes.length,
        nodes: nodes
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(registry, null, 2), 'utf8');
    console.log(`Knowledge Registry built successfully! Total Master Domains: ${nodes.length}`);
}

buildRegistry();
