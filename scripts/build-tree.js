const fs = require('fs');
const path = require('path');

const selfDevDir = path.join(__dirname, '../knowledge-tree/self-development');
const dataFile = path.join(__dirname, '../data/knowledge-registry.json');
const indexHtmlFile = path.join(__dirname, '../index.html');

console.log('Building Master Knowledge Registry & Updating Live WebApp...');

// 5 Coherent Master Volumes for the 33 Treatises
const modules = [
  {
    id: "focus-dopamine",
    slug: "focus-dopamine",
    title: "Focus, Attention & Dopamine Dynamics",
    icon: "⚡",
    order: 1,
    description: "The neuroscience of deep cognitive flow, reward circuit recalibration, attention residue, and transition zones.",
    overview: "Mastering focus and cognitive endurance through dopamine baselines, Sophie Leroy's attention residue, urge surfing, and intentional cognitive buffer protocols."
  },
  {
    id: "habits-behavior",
    slug: "habits-behavior",
    title: "Habits, Compounding & Behavioral Cascades",
    icon: "🔄",
    order: 2,
    description: "The mathematical and neurological laws of habit formation, keystone triggers, and subconscious identity reversing.",
    overview: "From the 1% Compounding Formula and Steel's Procrastination Equation to the Diderot Effect and Backward Domino Root Analysis."
  },
  {
    id: "learning-memory",
    slug: "learning-memory",
    title: "Epistemology, Learning Science & Memory",
    icon: "🧠",
    order: 3,
    description: "Scientific learning frameworks, active retrieval practice, state-dependent memory, and cognitive leverage.",
    overview: "Ebbinghaus forgetting curve, Hebbian neuroplasticity, Dweck's Growth Mindset, Blurting with Gap Margins, and Whiteboard cognitive architecture."
  },
  {
    id: "metacognition-mindset",
    slug: "metacognition-mindset",
    title: "Metacognition, Self-Trust & Mindset",
    icon: "🏛️",
    order: 4,
    description: "Deconstructing overthinking, self-trust restoration, internal locus of control, and somatic confidence reframing.",
    overview: "Bandura's self-efficacy pillars, the Evidence File method, the Water & Ink overthinking model, the 80% execution rule, and internal locus of control."
  },
  {
    id: "purpose-recovery",
    slug: "purpose-recovery",
    title: "Purpose, Connection & Addiction Recovery",
    icon: "🌱",
    order: 5,
    description: "Existential connectivity, multiple intelligences purpose alignment, hedonic adaptation, and addiction neuro-restoration.",
    overview: "Gardner's 8 Intelligences, relational loneliness vs. existential isolation, the Satisfaction Equation, and overcoming compulsive sexual addiction."
  }
];

const treatiseModuleMap = {
  "07": "focus-dopamine", "11": "focus-dopamine", "13": "focus-dopamine", "19": "focus-dopamine", "24": "focus-dopamine", "28": "focus-dopamine", "32": "focus-dopamine",
  "03": "habits-behavior", "04": "habits-behavior", "05": "habits-behavior", "06": "habits-behavior", "17": "habits-behavior", "18": "habits-behavior", "33": "habits-behavior",
  "08": "learning-memory", "10": "learning-memory", "22": "learning-memory", "23": "learning-memory", "26": "learning-memory", "27": "learning-memory", "30": "learning-memory",
  "01": "metacognition-mindset", "02": "metacognition-mindset", "09": "metacognition-mindset", "12": "metacognition-mindset", "14": "metacognition-mindset", "15": "metacognition-mindset", "31": "metacognition-mindset",
  "16": "purpose-recovery", "20": "purpose-recovery", "21": "purpose-recovery", "25": "purpose-recovery", "29": "purpose-recovery"
};

const files = fs.readdirSync(selfDevDir).filter(f => f.endsWith('.md')).sort();

const chapters = modules.map(m => ({
  slug: m.slug,
  title: m.title,
  icon: m.icon,
  order: m.order,
  description: m.description,
  overview: m.overview,
  concepts: []
}));

const concepts = {};

files.forEach(file => {
  const content = fs.readFileSync(path.join(selfDevDir, file), 'utf8');
  const numMatch = file.match(/^(\d+)-/);
  const num = numMatch ? numMatch[1] : "01";
  const slug = file.replace(/\.md$/, '');
  
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : slug;

  const sourceMatch = content.match(/> \*\*Source\*\*:\s*([^\n]+)/);
  const sourceText = sourceMatch ? sourceMatch[1] : "ABrainoConscious";

  const themeMatch = content.match(/> \*\*Core Theme\*\*:\s*([^\n]+)/);
  const coreTheme = themeMatch ? themeMatch[1] : "Cognitive Neuroscience & Mindset Optimization";

  const modSlug = treatiseModuleMap[num] || "metacognition-mindset";
  const parentChapter = chapters.find(c => c.slug === modSlug);

  parentChapter.concepts.push({
    slug: slug,
    title: title.replace(/^The\s+/i, ''),
    num: parseInt(num, 10),
    difficulty: parseInt(num, 10) % 3 === 1 ? "FOUNDATION" : parseInt(num, 10) % 3 === 2 ? "CORE" : "ADVANCED",
    order: parentChapter.concepts.length + 1
  });

  concepts[slug] = {
    slug: slug,
    title: title,
    num: parseInt(num, 10),
    chapterSlug: parentChapter.slug,
    chapterTitle: parentChapter.title,
    difficulty: parseInt(num, 10) % 3 === 1 ? "FOUNDATION" : parseInt(num, 10) % 3 === 2 ? "CORE" : "ADVANCED",
    oneLiner: coreTheme,
    whyItMatters: `Provides an actionable first-principles protocol to master ${title.toLowerCase()} based on human neurobiology and cognitive psychology.`,
    contentMarkdown: content,
    sources: [
      {
        title: sourceText,
        author: "ABrainoConscious",
        type: "VIDEO / LECTURE",
        notes: coreTheme
      }
    ]
  };
});

const connections = [
  {
    id: "conn-1",
    concept1Slug: "07-the-neurobiology-of-deep-focus-and-attention-residue",
    concept1Title: "Deep Focus & Attention Residue",
    concept2Slug: "32-the-neuroscience-of-study-breaks-and-dopamine-transition-zones",
    concept2Title: "Study Breaks & Transition Zones",
    connectionType: "ISOMORPHISM",
    explanation: "Attention residue in the Prefrontal Cortex is directly exacerbated by hyper-stimulating transition zones during study breaks."
  },
  {
    id: "conn-2",
    concept1Slug: "03-the-1-percent-habit-compounding-formula-and-identity-shifts",
    concept1Title: "1% Habit Compounding Formula",
    concept2Slug: "33-the-domino-effect-of-habits-and-identity-reversing",
    concept2Title: "The Domino Effect of Habits",
    connectionType: "CAUSAL_BRIDGE",
    explanation: "Compounding growth requires keystone habit stability; the Diderot effect explains how one new micro-habit cascades across identity."
  },
  {
    id: "conn-3",
    concept1Slug: "11-the-neurobiology-of-consistency-and-urge-surfing",
    concept1Title: "Consistency & Urge Surfing",
    concept2Slug: "24-the-neuroscience-of-urge-surfing-and-craving-mastery",
    concept2Title: "Urge Surfing & Pink Elephant Paradox",
    connectionType: "MECHANISM_SHARED",
    explanation: "Both treatises leverage Marlatt's 3-5 minute somatic crest to decondition amygdala craving loops and achieve synaptic extinction."
  },
  {
    id: "conn-4",
    concept1Slug: "13-dopamine-overload-vs-dopamine-loading-the-reward-architecture",
    concept1Title: "Dopamine Overload vs. Loading",
    concept2Slug: "25-the-hedonic-treadmill-and-the-psychology-of-true-contentment",
    concept2Title: "The Hedonic Treadmill & Satisfaction",
    connectionType: "NEUROCHEMICAL_INVERSION",
    explanation: "Hedonic adaptation is the behavioral manifestation of D2 dopamine receptor desensitization following chronic super-stimulus exposure."
  },
  {
    id: "conn-5",
    concept1Slug: "01-the-psychology-of-self-trust-and-day-1-again",
    concept1Title: "Self-Trust & Day 1 Again",
    concept2Slug: "31-the-psychology-of-self-confidence-and-the-competence-loop",
    concept2Title: "Self-Confidence & Competence Loop",
    connectionType: "EPISTEMIC_FOUNDATION",
    explanation: "Self-trust is the internal courtroom evidence log of kept micro-promises; Bandura's self-efficacy pillars translate self-trust into external execution."
  },
  {
    id: "conn-6",
    concept1Slug: "29-the-neuroscience-of-overcoming-pornography-and-compulsive-urges",
    concept1Title: "Overcoming Compulsive Addiction",
    concept2Slug: "28-the-21-day-neuroscience-hard-reset-protocol",
    concept2Title: "21-Day Neuroscience Hard Reset",
    connectionType: "RESTORATION_PROTOCOL",
    explanation: "Addiction recovery requires the 2-phase 21-day hard reset to break context conditioning traps and upregulate D2 receptors."
  }
];

const questions = [
  {
    id: "q-1",
    question: "Why does relying purely on willpower or emotional vows guarantee future habit relapse?",
    domain: "Habits & Metacognition",
    difficulty: "CORE",
    hint: "Think about the Pink Elephant Paradox and the Guilt-Relapse Flywheel."
  },
  {
    id: "q-2",
    question: "How does jumping straight from textbook reading into short-form video create 'Dopamine Deficit Shock'?",
    domain: "Neurobiology & Focus",
    difficulty: "INTERMEDIATE",
    hint: "Contrast the baseline stimulation threshold of static paper with algorithmic novelty."
  },
  {
    id: "q-3",
    question: "What is the mathematical difference between Outcome-based habits and Subconscious Identity Reversing?",
    domain: "Compounding & Identity",
    difficulty: "ADVANCED",
    hint: "Review the $1.01^{365}$ compounding curve vs. the 5-Anti-Identity micro-habits."
  },
  {
    id: "q-4",
    question: "Why do physiological symptoms of fear (racing heart, adrenaline) exactly match peak biological readiness?",
    domain: "Somatic Reframing",
    difficulty: "FOUNDATION",
    hint: "Recall Albert Bandura's perceptual filter and somatic reframing."
  }
];

const fullDB = {
  chapters,
  concepts,
  connections,
  questions,
  inbox: []
};

fs.writeFileSync(dataFile, JSON.stringify(fullDB, null, 2));
console.log(`Saved ${Object.keys(concepts).length} concepts to ${dataFile}`);
