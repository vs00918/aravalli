import { ExtractionProvider, KnowledgeProposal } from "./types";

export class LocalDemonstrationProcessor implements ExtractionProvider {
  name = "Local demonstration processing";

  async process(text: string, title?: string, url?: string): Promise<KnowledgeProposal> {
    const lower = (text + " " + (title || "")).toLowerCase();

    // Concept dictionary for deterministic matching
    const conceptRules = [
      {
        slug: "energy-density",
        title: "Energy Density",
        chapterSlug: "energy-technology",
        chapterTitle: "Energy & Technology",
        keywords: ["energy density", "density", "wh/kg", "wh/l", "gravimetric", "volumetric", "battery", "batteries", "gasoline", "storage capacity"],
        connectionProposal: {
          sourceConceptSlug: "energy-density",
          targetConceptSlug: "electricity",
          relationshipType: "APPLICATION",
          explanation: "Energy density constraints dictate the physical mass and range limits of electrified battery systems.",
        },
        questionProposal: {
          question: "What physical and chemical limits prevent batteries from matching hydrocarbon fuel energy density?",
          description: "Analyzing the molecular mass differences between closed intercalation batteries and open-atmosphere hydrocarbon combustion.",
        },
      },
      {
        slug: "electricity",
        title: "Electricity & Charge Flow",
        chapterSlug: "energy-technology",
        chapterTitle: "Energy & Technology",
        keywords: ["electricity", "voltage", "current", "conductive", "electrons", "grid", "charge", "circuits"],
        connectionProposal: {
          sourceConceptSlug: "electricity",
          targetConceptSlug: "energy-density",
          relationshipType: "APPLICATION",
          explanation: "Electric charge mobility and storage efficiency govern electrical grid capacity.",
        },
        questionProposal: {
          question: "How do transmission line resistance losses constrain continent-scale power transport?",
          description: "Exploring high-voltage direct current (HVDC) transmission over long distances.",
        },
      },
      {
        slug: "entropy",
        title: "Entropy",
        chapterSlug: "universe-physics",
        chapterTitle: "Universe & Physics",
        keywords: ["entropy", "boltzmann", "second law", "thermodynamics", "microstates", "multiplicity", "disorder", "phase space"],
        connectionProposal: {
          sourceConceptSlug: "entropy",
          targetConceptSlug: "how-life-maintains-order",
          relationshipType: "DIRECT_PHYSICAL_CONNECTION",
          explanation: "Open systems preserve internal order by exporting thermal entropy into their surroundings.",
        },
        questionProposal: {
          question: "Why was the early universe in an extraordinarily low-entropy state?",
          description: "Investigating the cosmological past hypothesis and the thermodynamic arrow of time.",
        },
      },
      {
        slug: "how-life-maintains-order",
        title: "How Life Maintains Order",
        chapterSlug: "biology-life",
        chapterTitle: "Biology & Life",
        keywords: ["negentropy", "what is life", "metabolism", "open system", "cellular order", "schrodinger", "dissipation", "homeostasis"],
        connectionProposal: {
          sourceConceptSlug: "how-life-maintains-order",
          targetConceptSlug: "feedback-loops",
          relationshipType: "STRUCTURAL_ANALOGY",
          explanation: "Biological homeostasis relies on negative feedback restoring forces to preserve steady-state setpoints.",
        },
        questionProposal: {
          question: "How do living cells prevent thermodynamic equilibrium without violating the Second Law?",
          description: "Tracing free energy throughput in ATP generation and cellular waste export.",
        },
      },
      {
        slug: "emergence",
        title: "Emergence",
        chapterSlug: "complex-systems",
        chapterTitle: "Complex Systems & Human Body",
        keywords: ["emergence", "more is different", "complex system", "collective", "phase transition", "swarm", "networks"],
        connectionProposal: {
          sourceConceptSlug: "emergence",
          targetConceptSlug: "money-and-exchange",
          relationshipType: "STRUCTURAL_ANALOGY",
          explanation: "Decentralized market clearing prices emerge from millions of uncoordinated individual consumer choices.",
        },
        questionProposal: {
          question: "How do microscopic interaction rules generate macroscopic collective intelligence?",
          description: "Investigating phase transitions, swarm stigmergy, and neural networks.",
        },
      },
      {
        slug: "money-and-exchange",
        title: "Money & Mediums of Exchange",
        chapterSlug: "society-money-mind",
        chapterTitle: "Society, Money & Mind",
        keywords: ["money", "currency", "fiat", "exchange", "inflation", "ledger", "price", "coincidence of wants"],
        connectionProposal: {
          sourceConceptSlug: "money-and-exchange",
          targetConceptSlug: "needs-and-incentives",
          relationshipType: "CAUSAL_CONNECTION",
          explanation: "Monetary payoffs and transactional costs directly shape human economic incentives and labor specialization.",
        },
        questionProposal: {
          question: "How do sovereign tax obligations establish universal acceptance for fiat currency ledgers?",
          description: "Analyzing the chartalist foundations of modern monetary systems.",
        },
      },
    ];

    const matched = conceptRules.filter((rule) =>
      rule.keywords.some((kw) => lower.includes(kw))
    );

    let targetChapterSlug = "universe-physics";
    let targetChapterTitle = "Universe & Physics";
    const matchedConceptSlugs: string[] = [];
    const matchedConceptTitles: string[] = [];
    const candidateConnections: KnowledgeProposal["candidateConnections"] = [];
    const candidateQuestions: KnowledgeProposal["candidateQuestions"] = [];

    if (matched.length > 0) {
      targetChapterSlug = matched[0].chapterSlug;
      targetChapterTitle = matched[0].chapterTitle;
      for (const m of matched) {
        matchedConceptSlugs.push(m.slug);
        matchedConceptTitles.push(m.title);
        if (m.connectionProposal) {
          candidateConnections.push(m.connectionProposal);
        }
        if (m.questionProposal) {
          candidateQuestions.push(m.questionProposal);
        }
      }
    } else {
      // Default fallback match
      matchedConceptSlugs.push("matter-and-energy");
      matchedConceptTitles.push("Matter & Energy");
    }

    // Extract key sentences for insights
    const sentences = text
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20);

    const candidateInsights =
      sentences.length > 0
        ? sentences.slice(0, 3).map((s) => `Extracted principle: ${s}.`)
        : ["Captured theoretical statement requiring manual synthesis."];

    const extractedSummary =
      sentences.length > 0
        ? sentences.slice(0, 2).join(". ") + "."
        : text.slice(0, 200) + (text.length > 200 ? "..." : "");

    return {
      targetChapterSlug,
      targetChapterTitle,
      matchedConceptSlugs,
      matchedConceptTitles,
      extractedSummary,
      candidateInsights,
      candidateConnections,
      candidateQuestions,
      processorName: this.name,
      processedAt: new Date().toISOString(),
    };
  }
}

export const defaultProcessor = new LocalDemonstrationProcessor();
