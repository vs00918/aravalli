import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Mind of Aravalli database with Master Chapters & Foundational Concepts...");

  // 1. Universe & Physics
  const ch1 = await prisma.chapter.upsert({
    where: { slug: "universe-physics" },
    update: {},
    create: {
      slug: "universe-physics",
      title: "Universe & Physics",
      icon: "🌌",
      order: 1,
      description: "The fundamental laws of space, matter, time, quantum fields, and the conservation of information.",
      overview:
        "Physics is the ultimate reductionist search for the irreducible invariants governing reality. From the deterministic second-order differential equations of Newtonian mechanics to the subatomic vacuum of quantum field theory and the holographic horizons of evaporating black holes, this domain explores the mathematical fabric of the cosmos.",
    },
  });

  // Concepts for Chapter 1
  await prisma.concept.upsert({
    where: { slug: "entropy" },
    update: {},
    create: {
      slug: "entropy",
      title: "Entropy",
      chapterId: ch1.id,
      order: 1,
      oneLiner: "A quantitative measure of how many microscopic configurations are compatible with the macroscopic state we observe.",
      intuition: "Think of a clean bedroom versus a messy bedroom. There is only one specific arrangement where every book and shirt is neatly folded (low entropy), but millions of random ways for clothes and books to be scattered across the floor (high entropy). Without active work, systems naturally drift toward the state with the most possibilities.",
      howItWorks: "In statistical mechanics (formulated by Ludwig Boltzmann), entropy S is directly proportional to the natural logarithm of the number of accessible microstates (Ω): S = k_B ln Ω. Because higher-entropy macrostates vastly outnumber lower-entropy ones, random molecular collisions statistically guarantee that closed systems evolve irreversibly toward thermodynamic equilibrium.",
      firstPrinciples: "The Second Law of Thermodynamics: The total entropy of an isolated system can never decrease over time (ΔS ≥ 0). This is not an arbitrary mechanical force, but a statistical inevitability of probability counting.",
      mathematicalModel: "S = k_B \\ln \\Omega \\quad \\text{and} \\quad dS = \\frac{dQ_{\\text{rev}}}{T}",
      commonMisconceptions: "Entropy is often described merely as 'disorder' or 'decay'. In reality, entropy is about probability and microstate multiplicity. High-entropy states can sometimes generate complex structured patterns (like gas mixing or crystallizing under specific thermal gradients).",
      whyItMatters: "Entropy defines the thermodynamic Arrow of Time—explaining why we remember the past but not the future, why heat flows spontaneously from hot to cold, and why perpetual motion machines cannot exist.",
      example: "Dropping a drop of blue ink into a glass of water. The ink molecules disperse until evenly mixed. The ink will never spontaneously re-gather into a single concentrated drop because mixed microstates overwhelmingly outnumber unmixed ones.",
    },
  });

  await prisma.concept.upsert({
    where: { slug: "quantum-unitarity" },
    update: {},
    create: {
      slug: "quantum-unitarity",
      title: "Quantum Unitarity & Information Conservation",
      chapterId: ch1.id,
      order: 2,
      oneLiner: "The fundamental physical invariant dictating that the sum of all probabilities in a quantum system must always equal 1, making physical information mathematically indestructible.",
      intuition: "If you burn a physical encyclopedia to ashes, the text seems lost forever. But in quantum physics, if you could track every single photon of heat, smoke molecule, and quantum spin released, you could mathematically reverse the equations and reconstruct the exact text. Information is never erased.",
      howItWorks: "Quantum time evolution is governed by the unitary operator U(t) = exp(-iHt/ℏ), satisfying U†U = I. This ensures that pure quantum states remain pure (Tr(ρ²) = 1) and that quantum state transformations are strictly reversible.",
      firstPrinciples: "Conservation of Information: The microscopic laws of physics are reversible. A state at time t uniquely determines all past and future states.",
      mathematicalModel: "U^\\dagger U = \\hat{I} \\quad \\text{and} \\quad \\sum_{i} P_i = 1",
      commonMisconceptions: "People confuse scrambling with destruction. Scrambling makes information practically inaccessible to humans, but quantum unitarity guarantees it is never fundamentally destroyed in the universe.",
      whyItMatters: "Unitarity is the mathematical bedrock of quantum mechanics. When Stephen Hawking proposed that black holes destroy information via thermal radiation, it triggered the 'Black Hole Information Paradox' because it threatened this core axiom.",
      example: "Hawking radiation evaporation: Susskind and 't Hooft proved through the Holographic Principle that information is preserved on the 2D event horizon boundary and eventually radiated back into the universe over the Page curve.",
    },
  });

  // 2. Energy & Technology
  const ch2 = await prisma.chapter.upsert({
    where: { slug: "energy-technology" },
    update: {},
    create: {
      slug: "energy-technology",
      title: "Energy & Technology",
      icon: "⚡",
      order: 2,
      description: "Electrochemical thermodynamics, energy storage quadrilemmas, and the converging industrial super-cycles.",
      overview:
        "Human civilization is a heat engine whose progress is bounded by how efficiently we harvest, convert, and store energy. This domain deconstructs electrochemistry, battery trade-offs, industrial manufacturing scaling laws, and the convergence of abundant power with compute.",
    },
  });

  await prisma.concept.upsert({
    where: { slug: "energy-density" },
    update: {},
    create: {
      slug: "energy-density",
      title: "Energy Density",
      chapterId: ch2.id,
      order: 1,
      oneLiner: "The amount of accessible energy stored per unit volume (volumetric: Wh/L) or per unit mass (gravimetric: Wh/kg).",
      intuition: "Imagine two suitcases of identical weight: one packed with feathers, the other with gold bullion. Gravimetric energy density determines what can fly (planes require light, dense fuel), while volumetric density determines what fits inside your pocket (smartphones need compact batteries).",
      howItWorks: "Governed by the chemical bond energy and atomic mass of active materials. Hydrocarbon fuels (jet fuel ~12,000 Wh/kg) store energy via carbon-hydrogen covalent bonds, whereas lithium-ion batteries (~250 Wh/kg) store energy through reversible intercalation of lithium ions into host crystal lattices.",
      firstPrinciples: "The fundamental limits of chemistry: Packing electrons into lighter elements (Li, Na) at higher electrochemical potentials (V) yields higher energy per kilogram according to Faraday's law: E = n F V.",
      mathematicalModel: "\\text{Specific Energy} = \\frac{\\Delta G}{M_{\\text{reactants}}} = \\frac{n F E_{\\text{cell}}}{M}",
      commonMisconceptions: "Believing batteries will soon match jet fuel density. Battery chemistry must carry the entire host crystal matrix, electrolyte, and current collectors, while combustion engines intake oxygen freely from the surrounding atmosphere.",
      whyItMatters: "Energy density is the single greatest physical bottleneck dictating the transition to electric aviation, long-haul trucking, and compact grid storage.",
      example: "A Tesla Model 3 battery pack weighs ~480 kg to store 75 kWh of energy, whereas ~6 kg of gasoline contains the equivalent chemical energy.",
    },
  });

  // 3. Biology & Life
  const ch3 = await prisma.chapter.upsert({
    where: { slug: "biology-life" },
    update: {},
    create: {
      slug: "biology-life",
      title: "Biology & Life",
      icon: "🧬",
      order: 3,
      description: "Thermodynamics of living order (negentropy), molecular software, and super-Mendelian gene drives.",
      overview:
        "Life is matter organized to resist thermodynamic decay by processing information. This domain examines cellular machinery, evolutionary algorithms, synthetic biology, and the ethical engineering of wild biospheres.",
    },
  });

  await prisma.concept.upsert({
    where: { slug: "negentropy" },
    update: {},
    create: {
      slug: "negentropy",
      title: "Schrödinger's Negentropy",
      chapterId: ch3.id,
      order: 1,
      oneLiner: "The physical process by which open living organisms maintain internal structural order by continually exporting entropy into their surrounding environment.",
      intuition: "A living animal is like a vacuum cleaner running inside a room: it keeps its own interior immaculate by blowing dust and exhaust heat out the back into the surrounding universe. Death occurs the moment the vacuum cleaner is unplugged and thermal equilibrium takes over.",
      howItWorks: "Formulated by Erwin Schrödinger in 'What Is Life?' (1944). A living organism is an open, non-equilibrium thermodynamic system. It maintains its low-entropy internal state (dS_internal < 0) by metabolizing high-grade chemical energy (food/sunlight) and dissipating low-grade thermal waste (heat/CO2), ensuring the universe's total entropy still increases (dS_total > 0).",
      firstPrinciples: "Open-system non-equilibrium thermodynamics: Living systems do not violate the Second Law; they pay for internal order by accelerating environmental entropy production.",
      mathematicalModel: "\\frac{dS}{dt} = \\frac{dS_{\\text{internal}}}{dt} + \\frac{dS_{\\text{external}}}{dt}, \\quad \\text{with} \\quad \\frac{dS_{\\text{external}}}{dt} > |\\frac{dS_{\\text{internal}}}{dt}|",
      commonMisconceptions: "Thinking life defies the laws of physics. Life obeys thermodynamics completely; it is an open dissipation structure.",
      whyItMatters: "Provides the first strictly physical, non-mystical definition of what distinguishes life from inanimate matter.",
      example: "A plant absorbing low-entropy visible photons from the sun and radiating high-entropy infrared heat into space to synthesize organized glucose molecules.",
    },
  });

  // 4. Complex Systems & Human Body
  const ch4 = await prisma.chapter.upsert({
    where: { slug: "complex-systems" },
    update: {},
    create: {
      slug: "complex-systems",
      title: "Complex Systems & Human Body",
      icon: "🕸️",
      order: 4,
      description: "How microscopic local rules produce macroscopic intelligence, allometric scaling, and the holobiont microbiome.",
      overview:
        "The universe is composed of nested networks where the whole is qualitatively different from the sum of its parts. This domain investigates emergence, biological allometry, feedback cybernetics, and the human holobiont.",
    },
  });

  await prisma.concept.upsert({
    where: { slug: "emergence" },
    update: {},
    create: {
      slug: "emergence",
      title: "Emergence",
      chapterId: ch4.id,
      order: 1,
      oneLiner: "The arising of novel macroscopic properties, patterns, and behaviors in a system that cannot be predicted by examining individual parts in isolation.",
      intuition: "A single water molecule is not 'wet'. Wetness is an emergent property that only exists when billions of water molecules interact together at room temperature.",
      howItWorks: "As physicist Philip Anderson noted in 'More is Different' (1972), at each level of complexity, entirely new fundamental laws appear. Complex adaptive systems operate through local interaction rules, feedback loops, and self-organization without any central coordinator.",
      firstPrinciples: "Non-linearity and scale-dependent symmetry breaking: Macroscopic degrees of freedom decouple from microscopic details.",
      mathematicalModel: "\\text{System Behavior } \\Psi \\neq \\sum_{i=1}^N \\psi_i",
      commonMisconceptions: "Assuming that knowing all the micro-rules makes predicting macro-behavior trivial. In non-linear systems, macroscopic computation cannot be shortcut without running the system.",
      whyItMatters: "Emergence explains how unthinking ants build sophisticated architectural mounds, how financial markets crash, and how consciousness arises from biological neurons.",
      example: "Conway's Game of Life: Four trivial grid rules generate universal Turing computation, gliders, and self-replicating virtual patterns.",
    },
  });

  // 5. Society, Money & Mind
  const ch5 = await prisma.chapter.upsert({
    where: { slug: "society-money-mind" },
    update: {},
    create: {
      slug: "society-money-mind",
      title: "Society, Money & Mind",
      icon: "🏛️",
      order: 5,
      description: "Demographic transition invariants, Bayesian signal detection, and unconditional macroeconomic floors.",
      overview:
        "Human civilization is shaped by incentives, information asymmetry, institutional architectures, and population dynamics. This domain analyzes economic welfare models, statistical signal detection, and the mechanics of human flourishing.",
    },
  });

  await prisma.concept.upsert({
    where: { slug: "demographic-transition" },
    update: {},
    create: {
      slug: "demographic-transition",
      title: "The Demographic Transition Model",
      chapterId: ch5.id,
      order: 1,
      oneLiner: "The structural 4-stage historical shift from high birth/death rates to low birth/death rates as societies develop, leading to an eventual global population peak.",
      intuition: "Throughout history, humans had many children because child mortality was high. As sanitation and medicine reduce mortality, population surges temporarily before falling fertility rates cause the population to stabilize and plateau.",
      howItWorks: "Driven by female education, urbanization, and economic development. When total fertility rate (TFR) drops below the replacement rate (2.1 births per woman), demographic momentum eventually produces population aging and stabilization.",
      firstPrinciples: "Logistic growth dynamics with negative feedback from socioeconomic development on reproductive rate.",
      mathematicalModel: "\\frac{dP}{dt} = r P \\left(1 - \\frac{P}{K}\\right)",
      commonMisconceptions: "The Malthusian myth that human population will grow exponentially forever. In reality, global fertility rates have fallen by over 50% in the last 60 years.",
      whyItMatters: "Governs the future of labor forces, sovereign pension sustainability, economic growth, and the peak humanity ceiling (~10.5 billion people).",
      example: "South Korea and Japan transitioning from post-war population booms to TFR < 1.0, reshaping societal structures and economic planning.",
    },
  });

  console.log("Database seeded successfully with 5 Master Chapters and foundational concepts!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
