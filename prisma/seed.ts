import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Mind of Aravalli database with progressive knowledge architecture...");

  // Clean old records to ensure clean order & difficulty migration
  await prisma.connection.deleteMany({});
  await prisma.sourceConcept.deleteMany({});
  await prisma.concept.deleteMany({});
  await prisma.source.deleteMany({});
  await prisma.chapter.deleteMany({});

  // ==========================================
  // 1. Universe & Physics
  // ==========================================
  const ch1 = await prisma.chapter.create({
    data: {
      slug: "universe-physics",
      title: "Universe & Physics",
      icon: "🌌",
      order: 1,
      description: "The basic rules that determine how matter, energy, space and time behave.",
      overview:
        "Physics is the study of how the physical universe works at every scale—from the subatomic particles inside atomic nuclei to the curved geometry of spacetime and evaporating black holes. This volume starts with foundational concepts of matter and energy, builds up to atoms and thermodynamics, and introduces the frontiers of quantum information.",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "matter-and-energy",
      title: "Matter & Energy",
      chapterId: ch1.id,
      difficulty: "FOUNDATION",
      order: 1,
      oneLiner: "Matter is anything that has mass and takes up space; energy is the quantitative property that allows matter to move, heat up, or change state.",
      intuition: "Think of matter as the physical building blocks (like bricks) and energy as the capacity to move, lift, or rearrange those bricks. Einstein discovered that matter and energy are fundamentally two forms of the same thing (E = mc²).",
      howItWorks: "Matter is composed of elementary fermions (quarks and leptons), while energy manifests in various forms (kinetic, potential, thermal, electromagnetic). The Law of Conservation of Energy states that within an isolated system, total energy can neither be created nor destroyed—only converted between different forms.",
      firstPrinciples: "Conservation laws and mass-energy equivalence: In all physical interactions, total mass-energy and momentum remain strictly constant.",
      mathematicalModel: "E = mc^2 \\quad \\text{and} \\quad \\Delta E_{\\text{system}} = Q - W",
      commonMisconceptions: "Believing that energy is a physical fluid or tangible substance. Energy is a mathematical property and accounting tool that describes a system's state and capacity to do work.",
      whyItMatters: "Understanding that energy is conserved and transferable is the primary prerequisite for all of chemistry, engineering, biology, and astrophysics.",
      example: "A roller coaster at the top of a hill converts stored gravitational potential energy into kinetic energy (motion) as it plunges downward.",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "atoms-and-subatomic-scale",
      title: "Atoms & The Subatomic Scale",
      chapterId: ch1.id,
      difficulty: "CORE",
      order: 2,
      oneLiner: "The fundamental microscopic units of chemical elements, consisting of a dense central nucleus surrounded by a cloud of electrons.",
      intuition: "If an atom were enlarged to the size of a cathedral, the nucleus would be a tiny marble at the center, and the electrons would be faint ripples at the outer boundary. Over 99.999% of an atom is non-classical vacuum.",
      howItWorks: "An atom consists of a nucleus containing positively charged protons and neutral neutrons (bound by the strong nuclear force), surrounded by negatively charged electrons bound by electromagnetism. Electrons do not travel on fixed circular tracks, but exist as three-dimensional quantum probability clouds governed by the Schrödinger equation.",
      firstPrinciples: "Quantum wave-particle duality and the Pauli Exclusion Principle: Identical fermions cannot occupy the same quantum state, giving solid matter its apparent rigidity and chemical stability.",
      mathematicalModel: "i\\hbar \\frac{\\partial \\psi}{\\partial t} = \\hat{H}\\psi",
      commonMisconceptions: "Visualizing electrons as tiny planets orbiting a sun-like nucleus. In reality, electrons behave as continuous probability wavefunctions until measured.",
      whyItMatters: "The structure of atomic electron shells determines all chemical bonding, electricity, materials science, and biological molecular shapes.",
      example: "Two hydrogen atoms sharing their single electrons with one oxygen atom to form a stable covalent water molecule (H₂O).",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "entropy",
      title: "Entropy",
      chapterId: ch1.id,
      difficulty: "INTERMEDIATE",
      order: 3,
      oneLiner: "A quantitative measure of how many microscopic arrangements are compatible with the macroscopic state we observe.",
      intuition: "There is only one specific arrangement where a jigsaw puzzle is fully assembled (low entropy), but millions of ways for the pieces to be scattered randomly across a table (high entropy). Without deliberate work, systems naturally evolve toward states with more possibilities.",
      howItWorks: "Formulated by Ludwig Boltzmann: S = k_B ln Ω. Because states with higher numbers of microscopic configurations (Ω) vastly outnumber states with few configurations, random collisions guarantee that closed systems drift irreversibly toward thermodynamic equilibrium.",
      firstPrinciples: "The Second Law of Thermodynamics: The total entropy of an isolated system never decreases over time (ΔS ≥ 0). This is a statistical inevitability of counting microstates.",
      mathematicalModel: "S = k_B \\ln \\Omega \\quad \\text{and} \\quad dS = \\frac{dQ_{\\text{rev}}}{T}",
      commonMisconceptions: "Equating entropy purely with 'disorder' or decay. Entropy is strictly about statistical multiplicity of microstates.",
      whyItMatters: "Explains the thermodynamic Arrow of Time—why we remember the past but not the future, why heat flows spontaneously from hot to cold, and why all machines have maximum theoretical efficiency limits.",
      example: "A drop of blue ink spreading evenly throughout a glass of clear water.",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "quantum-unitarity",
      title: "Quantum Unitarity & Information Conservation",
      chapterId: ch1.id,
      difficulty: "FRONTIER",
      order: 4,
      oneLiner: "The fundamental physical rule that total quantum probability must always equal 1, meaning microscopic information is never erased from the universe.",
      intuition: "If you burn a notebook, the words seem destroyed. But in quantum physics, if you could track every escaping photon of heat and smoke molecule, the microscopic laws could theoretically be run backward to reconstruct the notebook. Information is fundamentally preserved.",
      howItWorks: "Quantum time evolution is governed by unitary operators (U†U = I). This mathematical property guarantees that pure quantum states remain pure, ensuring that the past and future can always be uniquely mapped.",
      firstPrinciples: "Microscopic reversibility and quantum probability conservation.",
      mathematicalModel: "U^\\dagger U = \\hat{I} \\quad \\text{and} \\quad \\sum_{i} P_i = 1",
      commonMisconceptions: "Confusing human scrambling of information with actual physical destruction.",
      whyItMatters: "Unitarity is a central pillar of modern physics. The apparent loss of information during black hole evaporation triggered the famous 'Black Hole Information Paradox'.",
      example: "Hawking radiation becoming quantum-entangled with the black hole horizon to preserve information as the black hole evaporates over the Page curve.",
    },
  });

  // ==========================================
  // 2. Energy & Technology
  // ==========================================
  const ch2 = await prisma.chapter.create({
    data: {
      slug: "energy-technology",
      title: "Energy & Technology",
      icon: "⚡",
      order: 2,
      description: "How we generate, store, move and use energy to power human civilization.",
      overview:
        "Energy is the fundamental currency of modern civilization. Everything from smartphones and electric vehicles to data centers and steel manufacturing depends on thermodynamics and electrical systems. This volume explores foundational energy concepts, electrical systems, energy storage trade-offs, and future power infrastructure.",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "what-is-energy",
      title: "What Is Energy?",
      chapterId: ch2.id,
      difficulty: "FOUNDATION",
      order: 1,
      oneLiner: "The quantifiable capacity of a physical system to perform work or produce heat.",
      intuition: "Energy is like universal currency in physics: it can be exchanged in many different currencies (chemical, kinetic, gravitational, electrical), but the total bank account balance in an isolated system never changes.",
      howItWorks: "Work is done when a force moves an object across a distance (W = F · d). Energy exists as kinetic (motion) or potential (stored configurations such as gravitational, chemical, or electrostatic fields).",
      firstPrinciples: "First Law of Thermodynamics: Energy cannot be created or destroyed, only transformed.",
      mathematicalModel: "W = \\int \\mathbf{F} \\cdot d\\mathbf{r} \\quad \\text{and} \\quad \\Delta U = Q - W",
      commonMisconceptions: "Assuming that consuming energy causes it to disappear. Energy is never lost; it simply degrades into low-temperature ambient thermal heat that is harder to do work with.",
      whyItMatters: "Governs the mechanical and thermodynamic limits of all transportation, heating, computation, and industrial production.",
      example: "Compressing a mechanical spring stores elastic potential energy that can later launch a ball into the air.",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "electricity",
      title: "Electricity & Charge Flow",
      chapterId: ch2.id,
      difficulty: "CORE",
      order: 2,
      oneLiner: "The movement and electrostatic potential of electric charges (electrons and ions) through conductive materials.",
      intuition: "Water flowing through a pipe: Voltage is the water pressure pushing the water, Current is the volume of water flowing per second, and Resistance is the narrowing of the pipe opposing the flow.",
      howItWorks: "Electrons drift through a metal lattice when an external electric field creates a voltage differential. Ohm's Law (V = IR) and Joule heating (P = I²R) govern the transmission and loss of electrical power.",
      firstPrinciples: "Electromagnetic interaction and charge conservation: Net electrical charge is conserved across all circuits.",
      mathematicalModel: "V = IR \\quad \\text{and} \\quad P = VI = I^2 R",
      commonMisconceptions: "Believing individual electrons travel near light speed through a wire. Individual electron drift velocity is surprisingly slow (~millimeter per second), but the electromagnetic field propagates at nearly the speed of light.",
      whyItMatters: "Electricity is the primary vector for transporting clean energy instantaneously across continental power grids.",
      example: "A high-voltage transmission line transporting megawatts of solar power from a desert array to a city hundreds of kilometers away.",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "energy-density",
      title: "Energy Density",
      chapterId: ch2.id,
      difficulty: "INTERMEDIATE",
      order: 3,
      oneLiner: "The quantity of usable energy stored per unit volume (Wh/L) or per unit mass (Wh/kg).",
      intuition: "Gravimetric energy density dictates what can fly (airplanes require light fuels), while volumetric density dictates what can fit inside your pocket (smartphones need compact batteries).",
      howItWorks: "Determined by molecular bond energy and the atomic mass of reactants. Hydrocarbon fuels (~12,000 Wh/kg) store energy via dense covalent C-H bonds, whereas lithium-ion batteries (~250 Wh/kg) store energy via intercalation of ions into a heavier host crystal matrix.",
      firstPrinciples: "Electrochemical potential and mass efficiency of active chemical bonds.",
      mathematicalModel: "\\text{Specific Energy} = \\frac{n F E_{\\text{cell}}}{M_{\\text{molar}}}",
      commonMisconceptions: "Expecting batteries to match jet fuel density soon. Combustion engines take oxygen freely from ambient air, while batteries must self-contain all active chemical reactants.",
      whyItMatters: "Energy density is the primary engineering bottleneck determining what can be electrified (cars vs long-haul commercial passenger flights).",
      example: "A Tesla battery pack weighing ~480 kg stores 75 kWh, whereas ~6 kg of gasoline contains the equivalent chemical energy.",
    },
  });

  // ==========================================
  // 3. Biology & Life
  // ==========================================
  const ch3 = await prisma.chapter.create({
    data: {
      slug: "biology-life",
      title: "Biology & Life",
      icon: "🧬",
      order: 3,
      description: "How living organisms maintain order, reproduce, and evolve across generations.",
      overview:
        "Biology is the study of matter organized to resist thermodynamic decay by processing information. This volume traces the living hierarchy from membrane-bound cells and DNA software to evolutionary algorithms, ecosystems, and synthetic biology.",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "cells-and-living-order",
      title: "The Cell as the Unit of Life",
      chapterId: ch3.id,
      difficulty: "FOUNDATION",
      order: 1,
      oneLiner: "The fundamental membrane-bound structural and functional unit of all known living organisms.",
      intuition: "A biological cell is like a self-maintaining chemical factory surrounded by a security wall (the lipid membrane). It intakes raw materials, burns fuel, manufactures parts, and exports waste.",
      howItWorks: "All cells possess a lipid bilayer membrane separating internal biochemistry from the environment, metabolic machinery for energy conversion (such as ATP generation), and genetic material encoding operational instructions.",
      firstPrinciples: "Cell Theory: All living organisms are composed of one or more cells, and all cells arise from pre-existing cells.",
      mathematicalModel: "\\Delta G = \\Delta H - T\\Delta S \\quad \\text{(Bioenergetic driving force)}",
      commonMisconceptions: "Viewing cells as static sacs of liquid. In reality, the cytoplasm is a crowded, highly organized molecular metropolis packed with motor proteins moving on microtubule highways.",
      whyItMatters: "Understanding cellular mechanics is the foundation of all medicine, pharmacology, immunology, and bioengineering.",
      example: "A human red blood cell transporting oxygen via hemoglobin molecules while maintaining osmotic equilibrium in the bloodstream.",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "dna-and-genetic-code",
      title: "DNA & The Genetic Code",
      chapterId: ch3.id,
      difficulty: "CORE",
      order: 2,
      oneLiner: "The molecular software of life: a double-helix polymer encoding hereditary instructions for synthesizing proteins.",
      intuition: "DNA is like a digital recipe book written in a four-letter alphabet (A, T, C, G). Cellular machinery reads these letters in groups of three to assemble precise chains of amino acids into working molecular tools (proteins).",
      howItWorks: "The Central Dogma of Molecular Biology: DNA is transcribed into messenger RNA (mRNA), which is then translated by ribosomes into functional proteins. Complementary base pairing (A-T, C-G) ensures faithful replication during cell division.",
      firstPrinciples: "Information storage in stable chemical polymers and template-directed enzymatic replication.",
      mathematicalModel: "4^3 = 64 \\text{ codon combinations encoding 20 standard amino acids}",
      commonMisconceptions: "Assuming 'one gene equals one single physical trait'. Most complex traits are polygenic and heavily influenced by environmental regulation and epigenetics.",
      whyItMatters: "Cracking the genetic code allows modern science to read genomes, diagnose hereditary diseases, and edit genes with tools like CRISPR.",
      example: "The sequence of nucleotide bases in the human insulin gene instructing pancreatic cells on how to fold the insulin hormone.",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "negentropy",
      title: "Schrödinger's Negentropy",
      chapterId: ch3.id,
      difficulty: "ADVANCED",
      order: 3,
      oneLiner: "The physical process by which open living organisms maintain internal structural order by continually exporting entropy into their surrounding environment.",
      intuition: "A living animal is like a refrigerator: it keeps its interior cool and organized by continuously pumping exhaust heat out the back into the surrounding kitchen. Death occurs the moment metabolism stops and the organism reaches thermal equilibrium with its environment.",
      howItWorks: "As Erwin Schrödinger articulated in 'What Is Life?' (1944), an organism maintains its non-equilibrium state by metabolizing high-grade chemical energy and radiating low-grade thermal waste, ensuring total cosmic entropy still increases.",
      firstPrinciples: "Open-system non-equilibrium thermodynamics: Life obeys the Second Law by acting as an efficient entropy-exporting dissipation structure.",
      mathematicalModel: "\\frac{dS}{dt} = \\frac{dS_{\\text{internal}}}{dt} + \\frac{dS_{\\text{external}}}{dt}, \\quad \\text{where } \\frac{dS_{\\text{external}}}{dt} > |\\frac{dS_{\\text{internal}}}{dt}|",
      commonMisconceptions: "Believing that life violates the laws of physics. Life does not violate thermodynamics; it pays for internal order by accelerating environmental entropy production.",
      whyItMatters: "Provides the first strictly physical, non-mystical explanation for what distinguishes living matter from inanimate rocks.",
      example: "A green plant absorbing low-entropy visible sunlight and radiating high-entropy infrared heat to assemble organized glucose molecules.",
    },
  });

  // ==========================================
  // 4. Complex Systems & Human Body
  // ==========================================
  const ch4 = await prisma.chapter.create({
    data: {
      slug: "complex-systems",
      title: "Complex Systems & Human Body",
      icon: "🕸️",
      order: 4,
      description: "How simple individual parts interact to produce unexpected collective behavior.",
      overview:
        "The world is full of interconnected systems where the collective whole is qualitatively different from the sum of its parts. This volume investigates feedback loops, self-regulation in the human body, allometric scaling laws, and emergence across networks.",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "feedback-loops",
      title: "Feedback Loops & Cybernetics",
      chapterId: ch4.id,
      difficulty: "FOUNDATION",
      order: 1,
      oneLiner: "A circular causal chain where a system's output is routed back as an input, either dampening changes (negative feedback) or amplifying them (positive feedback).",
      intuition: "A home thermostat: When the room gets too cold, the heater turns on; when it warms up, the heater turns off (negative feedback / stabilization). A microphone placed near a speaker: The sound gets amplified in an escalating screech (positive feedback / runaway amplification).",
      howItWorks: "Negative feedback acts as a restoring force opposing deviation from a setpoint. Positive feedback compounds deviations, often driving exponential growth until hitting an environmental ceiling or triggering a phase change.",
      firstPrinciples: "System dynamics and circular causality: Outputs modify future inputs.",
      mathematicalModel: "G_{\\text{closed}} = \\frac{A}{1 + A\\beta}",
      commonMisconceptions: "Assuming 'positive' feedback means good and 'negative' means bad. Negative feedback is essential for stability, while uncontrolled positive feedback often causes catastrophic crashes or crashes.",
      whyItMatters: "Feedback loops govern everything from blood sugar regulation in the human body to climate cycles and financial market panics.",
      example: "Insulin and glucagon hormones continuously adjusting blood sugar levels to stay within a safe physiological range.",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "emergence",
      title: "Emergence",
      chapterId: ch4.id,
      difficulty: "INTERMEDIATE",
      order: 2,
      oneLiner: "The appearance of novel macroscopic behaviors and properties in a system that cannot be predicted by analyzing individual parts in isolation.",
      intuition: "A single water molecule is not wet. Wetness is an emergent property that only exists when billions of water molecules interact together at room temperature.",
      howItWorks: "As Philip Anderson stated in 'More is Different' (1972), at each new tier of complexity, entirely new natural laws appear. Simple local rules combined with non-linear interactions give rise to spontaneous macroscopic order.",
      firstPrinciples: "Non-linearity and scale-dependent symmetry breaking: Higher-level phenomena decouple from lower-level details.",
      mathematicalModel: "\\Psi_{\\text{macro}} \\neq \\sum_{i=1}^N \\psi_i",
      commonMisconceptions: "Believing that full knowledge of micro-rules allows instant prediction of macro-outcomes. In complex systems, computational simulation is often the only way to observe what emerges.",
      whyItMatters: "Explains how unthinking ants build climate-controlled nests, how human markets set prices, and how conscious thoughts emerge from biological neurons.",
      example: "Conway's Game of Life: Four simple grid rules generating universal computation and self-replicating virtual gliders.",
    },
  });

  // ==========================================
  // 5. Society, Money & Mind
  // ==========================================
  const ch5 = await prisma.chapter.create({
    data: {
      slug: "society-money-mind",
      title: "Society, Money & Mind",
      icon: "🏛️",
      order: 5,
      description: "How human incentives, exchange, institutions, and population dynamics shape collective life.",
      overview:
        "Human societies are vast decentralized networks shaped by incentives, information asymmetry, institutional rules, and demographic transitions. This volume examines the foundational mechanics of trade and money, population momentum, and the structural design of social safety nets.",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "needs-and-incentives",
      title: "Incentives & Human Behavior",
      chapterId: ch5.id,
      difficulty: "FOUNDATION",
      order: 1,
      oneLiner: "The costs, benefits, and psychological factors that motivate individuals to choose one course of action over another.",
      intuition: "People generally do what they are rewarded for doing, and avoid what penalizes them. When policy rules change the rewards or costs, human behavior adapts, often in unintended ways.",
      howItWorks: "Economic and social systems operate through explicit payoffs (financial, legal) and implicit payoffs (social status, moral norms). Game theory models how individuals optimize choices based on expectations of others' reactions.",
      firstPrinciples: "Opportunity cost and rational self-interest subject to bounded information.",
      mathematicalModel: "\\text{Utility } U = f(\\text{Payoffs}, \\text{Risks}, \\text{Preferences})",
      commonMisconceptions: "Believing people act purely from economic selfishness. Incentives include social reputation, fairness norms, and emotional belonging.",
      whyItMatters: "Every policy, legal system, company, and social institution succeeds or fails based on whether its rules align incentives with desired outcomes.",
      example: "The Cobra Effect: A colonial government offering a bounty for dead snakes, causing citizens to breed snakes to collect more bounties.",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "money-and-exchange",
      title: "Money & Mediums of Exchange",
      chapterId: ch5.id,
      difficulty: "CORE",
      order: 2,
      oneLiner: "A social technology and shared ledger that functions as a medium of exchange, a unit of account, and a store of value.",
      intuition: "Without money, a dentist who wants bread must find a baker who needs a tooth pulled (the 'coincidence of wants'). Money allows anyone to trade time and labor for a universally accepted token.",
      howItWorks: "Money evolves from commodity forms (gold, salt) to paper notes and digital ledgers. Its value relies on collective institutional trust, legal tender laws, and sovereign tax obligations.",
      firstPrinciples: "Reduction of transaction costs and resolution of the double coincidence of wants.",
      mathematicalModel: "M \\cdot V = P \\cdot Y \\quad \\text{(Equation of Exchange)}",
      commonMisconceptions: "Thinking money must be backed by a physical commodity like gold to have value. Most modern money is fiat, backed by institutional stability and state tax-demand.",
      whyItMatters: "Understanding money is essential for understanding banking, inflation, interest rates, and global trade networks.",
      example: "Using a debit card to instantly transfer electronic bank ledger credits to buy groceries across town.",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "demographic-transition",
      title: "The Demographic Transition Model",
      chapterId: ch5.id,
      difficulty: "INTERMEDIATE",
      order: 3,
      oneLiner: "The historical shift from high birth and death rates to low birth and death rates as countries develop economically.",
      intuition: "Throughout history, families had many children because child mortality was high. As sanitation and medicine improve, death rates plunge while birth rates remain high, creating a population surge. Eventually, urbanization and education cause birth rates to drop, stabilizing the population.",
      howItWorks: "Structured into four stages: Stage 1 (Pre-industrial high birth/death), Stage 2 (Mortality falls, population booms), Stage 3 (Fertility rates fall), and Stage 4 (Low birth/death equilibrium).",
      firstPrinciples: "Logistic population dynamics influenced by female education, healthcare, and urbanization.",
      mathematicalModel: "\\frac{dP}{dt} = r P \\left(1 - \\frac{P}{K}\\right)",
      commonMisconceptions: "The Malthusian belief that human population grows exponentially forever. Global fertility rates have dropped by over 50% since the 1960s.",
      whyItMatters: "Explains global demographic aging, labor force trends, and the projected peak humanity ceiling (~10.5 billion people).",
      example: "South Korea transitioning from post-war population expansion to a fertility rate below 1.0, reshaping schools and retirement systems.",
    },
  });

  console.log("Database seeded successfully with 5 Master Chapters and progressive difficulty tiers!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
