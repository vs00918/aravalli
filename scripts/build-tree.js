const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'c:/Users/visha/OneDrive/Documents/mind of aravalli';
const TREE_DIR = path.join(ROOT_DIR, 'knowledge-tree');
const OUTPUT_FILE = path.join(ROOT_DIR, 'data', 'knowledge-registry.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(ROOT_DIR, 'data'))) {
    fs.mkdirSync(path.join(ROOT_DIR, 'data'), { recursive: true });
}

function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getAllFiles(fullPath, arrayOfFiles);
        } else if (file.endsWith('.md') && file !== 'INDEX.md') {
            arrayOfFiles.push(fullPath);
        }
    });
    return arrayOfFiles;
}

function parseMarkdownMetadata(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relPath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
    const filename = path.basename(filePath, '.md');
    
    // Extract Title (# Heading)
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].replace(/Leaf Node:\s*|\*|🌱|🪵|🌿|🍃/g, '').trim() : filename;

    // Extract Kernel / Blockquote
    const quoteMatch = content.match(/>\s*\*\*(?:First-Principles Kernel|Axiomatic Kernel|System Invariant|Macro Thesis|Taxonomic Thesis|Synthesized Epistemic Thesis|Core Idea).*?\*\*:\s*([^\n]+)/i) || content.match(/>\s*([^\n]+)/);
    const summary = quoteMatch ? quoteMatch[1].replace(/\*\*|\[|\]/g, '').trim() : 'Comprehensive conceptual analysis and structural deconstruction.';

    // Determine Tier & Domain
    let tier = 'leaves';
    let tierLabel = 'Leaves: Lived Experience';
    let icon = '🍃';

    if (relPath.includes('/roots/')) {
        tier = 'roots';
        tierLabel = 'Roots: First Principles';
        icon = '🌱';
    } else if (relPath.includes('/trunk/')) {
        tier = 'trunk';
        tierLabel = 'Trunk: Mental Models';
        icon = '🪵';
    } else if (relPath.includes('/branches/')) {
        tier = 'branches';
        tierLabel = 'Branches: Taxonomies';
        icon = '🌿';
    }

    // Determine Domain Cluster
    let domain = 'General Synthesis';
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('battery') || lowerContent.includes('electrochemical') || lowerContent.includes('energy') || lowerContent.includes('grid')) {
        domain = 'Energy Systems & Electrification';
    } else if (lowerContent.includes('entropy') || lowerContent.includes('schrodinger') || lowerContent.includes('negentropy') || lowerContent.includes('thermodynamics')) {
        domain = 'Physics & Thermodynamics of Life';
    } else if (lowerContent.includes('dna') || lowerContent.includes('mitochondria') || lowerContent.includes('virus') || lowerContent.includes('cellular')) {
        domain = 'Evolutionary & Cellular Biology';
    } else if (lowerContent.includes('ai') || lowerContent.includes('super-cycles') || lowerContent.includes('manufacturing') || lowerContent.includes('compute')) {
        domain = 'Macro-Economics & AI Infrastructure';
    }

    // Extract Wikilinks [[target]]
    const wikilinks = [];
    const linkMatches = content.matchAll(/\[\[(.*?)\]\]/g);
    for (const match of linkMatches) {
        const target = match[1].trim().toLowerCase().replace(/\s+/g, '-');
        if (!wikilinks.includes(target)) {
            wikilinks.push(target);
        }
    }

    // Estimate Read Time
    const wordCount = content.split(/\s+/).length;
    const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

    return {
        id: filename,
        title: title,
        tier: tier,
        tierLabel: tierLabel,
        icon: icon,
        domain: domain,
        summary: summary,
        path: relPath,
        wordCount: wordCount,
        readTime: `${readTimeMin} min read`,
        connections: wikilinks
    };
}

function buildRegistry() {
    const mdFiles = getAllFiles(TREE_DIR);
    const nodes = mdFiles.map(parseMarkdownMetadata);

    // Group domains
    const domains = [...new Set(nodes.map(n => n.domain))];

    const registry = {
        meta: {
            title: "Mind of Aravalli",
            tagline: "First-Principles Knowledge Tree & Epistemic Laboratory",
            totalNodes: nodes.length,
            domains: domains,
            lastUpdated: new Date().toISOString()
        },
        nodes: nodes
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(registry, null, 2), 'utf8');
    console.log(`Knowledge Registry built successfully! Total nodes: ${nodes.length}`);
}

buildRegistry();
