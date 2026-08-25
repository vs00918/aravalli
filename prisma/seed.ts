import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Mind of Aravalli with refined scientific Entropy concept...");

  // Clean old records for pristine state
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

  // Reference Benchmark Concept: Entropy (Scientific Depth Revision)
  await prisma.concept.create({
    data: {
      slug: "entropy",
      title: "Entropy",
      chapterId: ch1.id,
      difficulty: "INTERMEDIATE",
      order: 3,
      oneLiner:
        "Entropy measures how many microscopic arrangements can produce the larger-scale state we observe. For an isolated system, processes naturally evolve toward macroscopic states that correspond to the largest number of accessible microscopic configurations.",
      intuition:
        "Imagine a brand new deck of playing cards arranged in perfect numerical order by suit. There is only 1 exact sequence that is 'sorted', but roughly 8 × 10⁶⁷ possible ways to shuffle them randomly. If you drop the cards onto a table, they will land in a shuffled state—not because of a mysterious destructive force, but simply because the number of unsorted configurations overwhelmingly outnumbers sorted ones. The limit of this analogy is that playing cards are passive objects; physical atoms continuously vibrate and collide billions of times per second.",
      howItWorks:
        "At the microscopic level, individual particles follow deterministic, time-reversible laws of motion (like classical Newtonian mechanics or unitary quantum evolution). A gas in a container is defined macroscopically by bulk properties like temperature, volume, and pressure, while microscopically by the exact positions and momenta of ~10²³ molecules. Because macroscopic equilibrium corresponds to an astronomically vast region of microscopic phase space compared to non-equilibrium states, a system starting from a rare, low-entropy configuration will, over time, almost certainly evolve into one of the overwhelmingly abundant equilibrium configurations. Macroscopic irreversibility is therefore a statistical property of large numbers, not a fundamental asymmetry in the underlying microscopic equations.",
      firstPrinciples:
        "The Second Law of Thermodynamics states that the total entropy of an isolated system never decreases over time (ΔS ≥ 0). In statistical mechanics, this is grounded in the foundational assumption of the microcanonical ensemble: for an isolated system with fixed relevant macroscopic constraints (such as energy E, volume V, and particle number N), the equilibrium assumption assigns equal probability to all accessible microstates consistent with those constraints. Because equilibrium macrostates contain the overwhelming majority of these accessible microstates, spontaneous deviations away from equilibrium are so statistically improbable that they are physically unobservable on macroscopic timescales.",
      mathematicalModel: `### Statistical Definition (Boltzmann)

$$S = k_B \\ln \\Omega$$

- **$S$** is the thermodynamic entropy, measured in Joules per Kelvin ($\\text{J/K}$).
- **$k_B$** is Boltzmann's constant ($1.380649 \\times 10^{-23} \\text{ J/K}$), the fundamental conversion factor relating macroscopic thermal temperature units to microscopic state multiplicity.
- **$\\Omega$** (Omega) is the multiplicity—the exact count of accessible microscopic quantum states compatible with the observed macroscopic state.

**Physical Interpretation**: This equation bridges the microscopic and macroscopic worlds. The logarithm converts multiplicative microscopic multiplicities into additive macroscopic entropy. For two independent systems $A$ and $B$, their combined microstate multiplicity multiplies ($\\Omega_{AB} = \\Omega_A \\Omega_B$). Applying Boltzmann's equation:

$$S_{AB} = k_B \\ln(\\Omega_A \\Omega_B) = k_B \\ln \\Omega_A + k_B \\ln \\Omega_B = S_A + S_B$$

This explains why the logarithm appears: it ensures that doubling the physical size of a system doubles its macroscopic entropy, even though the number of microscopic configurations squares.

### Thermodynamic Relation (Clausius)

$$dS = \\frac{\\delta Q_{\\text{rev}}}{T}$$

- **$dS$** is the infinitesimal change in entropy.
- **$\\delta Q_{\\text{rev}}$** is the infinitesimal quantity of thermal energy transferred reversibly into the system.
- **$T$** is the absolute thermodynamic temperature of the system in Kelvin ($\\text{K}$).

**Physical Interpretation**: This formula defines entropy change through macroscopic thermal measurements. It reveals that adding a fixed quantity of heat to a cold system creates a significantly larger increase in entropy than adding the exact same amount of heat to an already hot system.

### Why the Two Descriptions Fit Together

Clausius formulated the thermodynamic relation macroscopically through heat and temperature ratios before the atomic nature of matter was proven. Boltzmann later showed that Clausius's heat-to-temperature ratio is the exact statistical consequence of adding thermal kinetic energy to microscopic particles and expanding their accessible phase-space multiplicity ($\\Omega$).`,
      commonMisconceptions:
        "Entropy is often casually described as 'disorder' or 'things falling apart'. This can be misleading. Entropy is strictly a measure of microstate multiplicity and statistical probability. Under specific boundary conditions and continuous energy flows, high-entropy processes can produce complex ordered structures (such as snowflakes crystallizing as heat dissipates into the cold air, or biological organisms maintaining internal organization by exporting entropy into their environment).",
      whyItMatters:
        "Understanding entropy makes heat engines, refrigeration, chemical equilibrium, statistical mechanics, data compression limits, and the directionality of physical time understandable.",
      example:
        "A drop of blue ink spreading in a glass of clear water. The ink molecules disperse until uniformly distributed throughout the liquid. They will never spontaneously re-gather into a single concentrated drop because uniformly distributed microstates astronomically outnumber clustered ones.",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "matter-and-energy",
      title: "Matter & Energy",
      chapterId: ch1.id,
      difficulty: "FOUNDATION",
      order: 1,
      oneLiner:
        "Matter is anything that has mass and occupies space; energy is the quantifiable property that allows matter to move, heat up, or change state.",
      intuition:
        "Think of matter as physical building blocks (like bricks) and energy as the capacity to move, lift, or rearrange those bricks. Einstein's special relativity revealed that matter and energy are two forms of the same underlying physical property (E = mc²).",
      howItWorks:
        "Matter is composed of elementary fermions (quarks and leptons), while energy manifests in various forms including kinetic (motion), potential (position in a field), thermal, and electromagnetic radiation. In all closed interactions, energy can change forms but total energy remains strictly constant.",
      firstPrinciples:
        "Conservation Laws and Emmy Noether's Theorem: The Law of Conservation of Energy is the mathematical consequence of time translation symmetry—the laws of physics do not change from one moment to the next.",
      mathematicalModel: `### Mass-Energy Equivalence & First Law

$$E = mc^2 \\quad \\text{and} \\quad \\Delta E_{\\text{system}} = Q - W$$

- **$E$** is energy; **$m$** is relativistic rest mass; **$c$** is the vacuum speed of light ($2.998 \\times 10^8 \\text{ m/s}$).
- **$\\Delta E_{\\text{system}}$** is internal energy change; **$Q$** is heat added; **$W$** is work performed by the system.`,
      commonMisconceptions:
        "Believing that energy is a physical fluid or material substance. Energy is a mathematical accounting property that describes a system's state and capacity to perform work.",
      whyItMatters:
        "Understanding energy conservation is the primary foundation for all of chemistry, mechanical engineering, biology, and astrophysics.",
      example:
        "A pendulum at the peak of its swing stops momentarily (all potential energy) and converts that energy into maximum speed at the bottom of its arc (all kinetic energy).",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "atoms-and-subatomic-scale",
      title: "Atoms & The Subatomic Scale",
      chapterId: ch1.id,
      difficulty: "CORE",
      order: 2,
      oneLiner:
        "The fundamental microscopic building blocks of chemical elements, composed of a dense central nucleus surrounded by a cloud of electrons.",
      intuition:
        "If an atom were enlarged to the size of a sports stadium, the nucleus would be a tiny marble at the center, and the electrons would be faint ripples in the outer stands. Over 99.999% of an atom's volume is non-classical vacuum filled with quantum fields.",
      howItWorks:
        "An atom consists of a nucleus containing positively charged protons and neutral neutrons (held together by the strong nuclear force), surrounded by negatively charged electrons bound by electromagnetism. Electrons exist as three-dimensional quantum probability wavefunctions governed by the Schrödinger equation.",
      firstPrinciples:
        "Quantum Wave-Particle Duality and the Pauli Exclusion Principle: Identical fermions cannot occupy the same quantum state, preventing electrons from collapsing into the nucleus and giving solid matter its volume and chemical diversity.",
      mathematicalModel: `### Time-Dependent Schrödinger Equation

$$i\\hbar \\frac{\\partial \\psi}{\\partial t} = \\hat{H}\\psi$$

- **$\\hbar$** is the reduced Planck constant ($1.054 \\times 10^{-34} \\text{ J}\\cdot\\text{s}$).
- **$\\psi$** is the quantum state wavefunction whose squared magnitude ($|\\psi|^2$) gives the spatial probability distribution of finding an electron.
- **$\\hat{H}$** is the Hamiltonian operator representing total system energy (kinetic + potential).`,
      commonMisconceptions:
        "Visualizing electrons as miniature planets orbiting the nucleus like a solar system. In reality, electrons are continuous probability density distributions until measured.",
      whyItMatters:
        "The geometric structure of atomic electron shells determines all chemical bonding, electricity, materials science, and biological molecular shapes.",
      example:
        "Two hydrogen atoms sharing electrons with one oxygen atom to form a stable covalent water molecule (H₂O).",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "quantum-unitarity",
      title: "Quantum Unitarity & Information Conservation",
      chapterId: ch1.id,
      difficulty: "FRONTIER",
      order: 4,
      oneLiner:
        "The fundamental physical principle that total quantum probability must always equal 1, meaning microscopic physical information is never destroyed in the universe.",
      intuition:
        "If you burn a book, the words seem permanently lost. But in quantum mechanics, if you could track every escaping photon of infrared heat and smoke particle, the equations could theoretically be run backward to reconstruct the exact text. Information is fundamentally conserved.",
      howItWorks:
        "Quantum time evolution is governed by unitary operators (U†U = I). This ensures that pure quantum states remain pure over time, guaranteeing that past and future states map to each other with 100% mathematical determinism.",
      firstPrinciples:
        "Microscopic Reversibility and Probability Conservation: The fundamental laws of quantum physics preserve distinguishability between states.",
      mathematicalModel: `### Unitary Operator & Probability Conservation

$$U^\\dagger U = \\hat{I} \\quad \\text{and} \\quad \\sum_{i} P_i = 1$$

- **$U$** is the time-evolution operator $\\exp(-i\\hat{H}t/\\hbar)$.
- **$U^\\dagger$** is its Hermitian adjoint.
- **$\\hat{I}$** is the identity matrix, preserving vector norm and inner products across Hilbert space.`,
      commonMisconceptions:
        "Confusing human inability to unscramble complex data with actual physical destruction of information.",
      whyItMatters:
        "Unitarity is a cornerstone of quantum mechanics. When Stephen Hawking showed that black holes emit thermal radiation that appeared to erase information, it sparked the 'Black Hole Information Paradox'.",
      example:
        "Hawking radiation becoming quantum-entangled with the black hole horizon, preserving information over the Page curve as the black hole evaporates.",
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
      oneLiner:
        "The quantifiable capacity of a physical system to perform work or produce heat.",
      intuition:
        "Energy is like universal currency in physics: it can be exchanged in many different currencies (chemical, kinetic, gravitational, electrical), but the total bank account balance in an isolated system never changes.",
      howItWorks:
        "Work is done when a force moves an object across a distance (W = F · d). Energy exists as kinetic (motion) or potential (stored configurations such as gravitational, chemical, or electrostatic fields).",
      firstPrinciples:
        "First Law of Thermodynamics: Energy cannot be created or destroyed, only transformed.",
      mathematicalModel: `### Work Integral & Thermodynamic Energy

$$W = \\int \\mathbf{F} \\cdot d\\mathbf{r} \\quad \\text{and} \\quad \\Delta U = Q - W$$

- **$W$** is mechanical work; **$\\mathbf{F}$** is force; **$d\\mathbf{r}$** is displacement vector.
- **$\\Delta U$** is internal energy change.`,
      commonMisconceptions:
        "Assuming that consuming energy causes it to disappear. Energy is never lost; it simply degrades into low-temperature ambient thermal heat that is harder to do work with.",
      whyItMatters:
        "Governs the mechanical and thermodynamic limits of all transportation, heating, computation, and industrial production.",
      example:
        "Compressing a mechanical spring stores elastic potential energy that can later launch a ball into the air.",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "electricity",
      title: "Electricity & Charge Flow",
      chapterId: ch2.id,
      difficulty: "CORE",
      order: 2,
      oneLiner:
        "The movement and electrostatic potential of electric charges (electrons and ions) through conductive materials.",
      intuition:
        "Water flowing through a pipe: Voltage is the water pressure pushing the water, Current is the volume of water flowing per second, and Resistance is the narrowing of the pipe opposing the flow.",
      howItWorks:
        "Electrons drift through a metal lattice when an external electric field creates a voltage differential. Ohm's Law (V = IR) and Joule heating (P = I²R) govern the transmission and loss of electrical power.",
      firstPrinciples:
        "Electromagnetic interaction and charge conservation: Net electrical charge is conserved across all circuits.",
      mathematicalModel: `### Ohm's Law & Electrical Power Dissipation

$$V = IR \\quad \\text{and} \\quad P = VI = I^2 R$$

- **$V$** is voltage (potential difference in Volts, $\\text{V}$).
- **$I$** is electrical current in Amperes ($\\text{A}$).
- **$R$** is electrical resistance in Ohms ($\\Omega$).
- **$P$** is power dissipation in Watts ($\\text{W}$).`,
      commonMisconceptions:
        "Believing individual electrons travel near light speed through a wire. Individual electron drift velocity is slow (~mm/s), but the electromagnetic field propagates at nearly light speed.",
      whyItMatters:
        "Electricity is the primary vector for transporting clean energy instantaneously across continental power grids.",
      example:
        "A high-voltage transmission line transporting megawatts of solar power from a desert array to a city hundreds of kilometers away.",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "energy-density",
      title: "Energy Density",
      chapterId: ch2.id,
      difficulty: "INTERMEDIATE",
      order: 3,
      oneLiner:
        "The quantity of usable energy stored per unit volume (Wh/L) or per unit mass (Wh/kg).",
      intuition:
        "Gravimetric energy density dictates what can fly (airplanes require light fuels), while volumetric density dictates what can fit inside your pocket (smartphones need compact batteries).",
      howItWorks:
        "Determined by molecular bond energy and the atomic mass of reactants. Hydrocarbon fuels (~12,000 Wh/kg) store energy via dense covalent C-H bonds, whereas lithium-ion batteries (~250 Wh/kg) store energy via intercalation of ions into a heavier host crystal matrix.",
      firstPrinciples:
        "Electrochemical potential and mass efficiency of active chemical bonds.",
      mathematicalModel: `### Specific Energy via Faraday's Law

$$\\text{Specific Energy} = \\frac{n F E_{\\text{cell}}}{M_{\\text{molar}}}$$

- **$n$** is number of electrons transferred per reaction molecule.
- **$F$** is Faraday's constant ($96,485 \\text{ C/mol}$).
- **$E_{\\text{cell}}$** is standard cell potential in Volts.
- **$M_{\\text{molar}}$** is combined molar mass of active chemical reactants.`,
      commonMisconceptions:
        "Expecting batteries to match jet fuel density soon. Combustion engines take oxygen freely from ambient air, while batteries must self-contain all active chemical reactants.",
      whyItMatters:
        "Energy density is the primary engineering bottleneck determining what can be electrified (cars vs long-haul commercial passenger flights).",
      example:
        "A Tesla battery pack weighing ~480 kg stores 75 kWh, whereas ~6 kg of gasoline contains the equivalent chemical energy.",
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
        "Biology is the study of matter organized to resist thermodynamic decay by processing information and energy. This volume traces the living hierarchy from membrane-bound cells and DNA software to evolutionary algorithms, ecosystems, and synthetic biology.",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "cells-and-living-order",
      title: "The Cell as the Unit of Life",
      chapterId: ch3.id,
      difficulty: "FOUNDATION",
      order: 1,
      oneLiner:
        "The fundamental membrane-bound structural and functional unit of all known living organisms.",
      intuition:
        "A biological cell is like a self-maintaining chemical factory surrounded by a security wall (the lipid membrane). It intakes raw materials, burns fuel, manufactures parts, and exports waste.",
      howItWorks:
        "All cells possess a lipid bilayer membrane separating internal biochemistry from the environment, metabolic machinery for energy conversion (such as ATP generation), and genetic material encoding operational instructions.",
      firstPrinciples:
        "Cell Theory: All living organisms are composed of one or more cells, and all cells arise from pre-existing cells.",
      mathematicalModel: `### Gibbs Free Energy Driving Cellular Reactions

$$\\Delta G = \\Delta H - T\\Delta S$$

- **$\\Delta G$** is change in Gibbs free energy (reactions are spontaneous when $\\Delta G < 0$).
- **$\\Delta H$** is enthalpy change; **$T$** is temperature; **$\\Delta S$** is entropy change.`,
      commonMisconceptions:
        "Viewing cells as static sacs of liquid. In reality, the cytoplasm is a crowded, highly organized molecular metropolis packed with motor proteins moving on microtubule highways.",
      whyItMatters:
        "Understanding cellular mechanics is the foundation of all medicine, pharmacology, immunology, and bioengineering.",
      example:
        "A human red blood cell transporting oxygen via hemoglobin molecules while maintaining osmotic equilibrium in the bloodstream.",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "dna-and-genetic-code",
      title: "DNA & The Genetic Code",
      chapterId: ch3.id,
      difficulty: "CORE",
      order: 2,
      oneLiner:
        "The molecular software of life: a double-helix polymer encoding hereditary instructions for synthesizing proteins.",
      intuition:
        "DNA is like a digital recipe book written in a four-letter alphabet (A, T, C, G). Cellular machinery reads these letters in groups of three to assemble precise chains of amino acids into working molecular tools (proteins).",
      howItWorks:
        "The Central Dogma of Molecular Biology: DNA is transcribed into messenger RNA (mRNA), which is then translated by ribosomes into functional proteins. Complementary base pairing (A-T, C-G) ensures faithful replication during cell division.",
      firstPrinciples:
        "Information storage in stable chemical polymers and template-directed enzymatic replication.",
      mathematicalModel: `### Triplet Codon Multiplicity

$$4^3 = 64 \\text{ codon combinations encoding 20 standard amino acids}$$

- **$4$** possible nucleotide bases ($A, T, C, G$).
- **$3$** positions per codon yielding $64$ possible triplets, providing redundancy (degeneracy) against point mutations.`,
      commonMisconceptions:
        "Assuming 'one gene equals one single physical trait'. Most complex traits are polygenic and heavily influenced by environmental regulation and epigenetics.",
      whyItMatters:
        "Cracking the genetic code allows modern science to read genomes, diagnose hereditary diseases, and edit genes with tools like CRISPR.",
      example:
        "The sequence of nucleotide bases in the human insulin gene instructing pancreatic cells on how to fold the insulin hormone.",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "how-life-maintains-order",
      title: "How Life Maintains Order",
      chapterId: ch3.id,
      difficulty: "ADVANCED",
      order: 3,
      oneLiner:
        "How living organisms function as open thermodynamic systems, continuously taking in energy and matter from their environment to maintain internal organization and avoid physical decay.",
      intuition:
        "A living organism is like a refrigerator: it keeps its internal contents cool and orderly by continually consuming electricity and exhausting heat out the back into the kitchen. If unplugged, thermal equilibrium takes over and the interior warms up to match the room.",
      howItWorks:
        "Living organisms are open physical systems far from thermodynamic equilibrium. Through metabolism and active transport, cells continuously convert high-grade chemical energy (glucose, sunlight) into work and dissipate low-grade thermal waste (heat) into their surroundings, ensuring total entropy in the universe increases while preserving local biological order.",
      firstPrinciples:
        "Open-system non-equilibrium thermodynamics: Living systems obey the Second Law by exporting entropy to their environment faster than they generate it internally.",
      mathematicalModel: `### Non-Equilibrium Entropy Production Balance

$$\\frac{dS}{dt} = \\frac{dS_{\\text{internal}}}{dt} + \\frac{dS_{\\text{external}}}{dt}, \\quad \\text{where } \\frac{dS_{\\text{external}}}{dt} > |\\frac{dS_{\\text{internal}}}{dt}|$$

- **$\\frac{dS_{\\text{internal}}}{dt}$** is the rate of internal entropy generation ($< 0$ during structural assembly).
- **$\\frac{dS_{\\text{external}}}{dt}$** is the rate of entropy exported into the surrounding environment ($> 0$).`,
      commonMisconceptions:
        "Assuming life violates the Second Law of Thermodynamics. Life obeys physics completely; it requires a continuous throughput of environmental energy to preserve internal structure.",
      whyItMatters:
        "Provides the foundational physical perspective on what life is—an organized, self-regulating dissipation structure processing energy and information.",
      example:
        "A photosynthetic plant capturing low-entropy visible photons from sunlight and radiating diffuse high-entropy infrared heat while synthesizing complex glucose molecules.",
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
      oneLiner:
        "A circular causal chain where a system's output is routed back as an input, either dampening changes (negative feedback) or amplifying them (positive feedback).",
      intuition:
        "A home thermostat: When the room gets too cold, the heater turns on; when it warms up, the heater turns off (negative feedback / stabilization). A microphone near a speaker: Sound gets amplified in an escalating screech (positive feedback / runaway amplification).",
      howItWorks:
        "Negative feedback acts as a restoring force opposing deviation from a setpoint. Positive feedback compounds deviations, often driving exponential growth until hitting an environmental ceiling or triggering a phase change.",
      firstPrinciples:
        "System dynamics and circular causality: Outputs modify future inputs.",
      mathematicalModel: `### Closed-Loop System Gain

$$G_{\\text{closed}} = \\frac{A}{1 + A\\beta}$$

- **$A$** is open-loop forward gain.
- **$\\beta$** is feedback factor.
- Negative feedback ($A\\beta > 0$) stabilizes system gain and suppresses noise.`,
      commonMisconceptions:
        "Assuming 'positive' feedback means good and 'negative' means bad. Negative feedback is essential for stability, while uncontrolled positive feedback often causes catastrophic crashes or runaway inflation.",
      whyItMatters:
        "Feedback loops govern everything from blood sugar regulation in the human body to climate cycles and financial market panics.",
      example:
        "Insulin and glucagon hormones continuously adjusting blood sugar levels to stay within a safe physiological range.",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "emergence",
      title: "Emergence",
      chapterId: ch4.id,
      difficulty: "INTERMEDIATE",
      order: 2,
      oneLiner:
        "The appearance of novel macroscopic behaviors and properties in a system that cannot be predicted by analyzing individual parts in isolation.",
      intuition:
        "A single water molecule is not wet. Wetness is an emergent property that only exists when billions of water molecules interact together at room temperature.",
      howItWorks:
        "As Philip Anderson stated in 'More is Different' (1972), at each new tier of complexity, entirely new natural laws appear. Simple local rules combined with non-linear interactions give rise to spontaneous macroscopic order.",
      firstPrinciples:
        "Non-linearity and scale-dependent symmetry breaking: Higher-level phenomena decouple from lower-level details.",
      mathematicalModel: `### Non-Linear Macroscopic Behavior

$$\\Psi_{\\text{macro}} \\neq \\sum_{i=1}^N \\psi_i$$

- **$\\Psi_{\\text{macro}}$** represents collective macroscopic system state.
- **$\\psi_i$** represents the microscopic state of individual component $i$.`,
      commonMisconceptions:
        "Believing that full knowledge of micro-rules allows instant prediction of macro-outcomes. In complex systems, computational simulation is often the only way to observe what emerges.",
      whyItMatters:
        "Explains how unthinking ants build climate-controlled nests, how human markets set prices, and how conscious thoughts emerge from biological neurons.",
      example:
        "Conway's Game of Life: Four simple grid rules generating universal computation and self-replicating virtual gliders.",
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
      oneLiner:
        "The costs, benefits, and psychological factors that motivate individuals to choose one course of action over another.",
      intuition:
        "People generally do what they are rewarded for doing, and avoid what penalizes them. When policy rules change the rewards or costs, human behavior adapts, often in unintended ways.",
      howItWorks:
        "Economic and social systems operate through explicit payoffs (financial, legal) and implicit payoffs (social status, moral norms). Game theory models how individuals optimize choices based on expectations of others' reactions.",
      firstPrinciples:
        "Opportunity cost and rational self-interest subject to bounded information.",
      mathematicalModel: `### Expected Utility Payoff Function

$$U(\\mathbf{x}) = \\sum_{i=1}^n p_i \\cdot u(x_i)$$

- **$p_i$** is probability of outcome $i$.
- **$u(x_i)$** is subjective utility value associated with outcome $x_i$.`,
      commonMisconceptions:
        "Believing people act purely from economic selfishness. Incentives include social reputation, fairness norms, and emotional belonging.",
      whyItMatters:
        "Every policy, legal system, company, and social institution succeeds or fails based on whether its rules align incentives with desired outcomes.",
      example:
        "The Cobra Effect: A colonial government offering a bounty for dead snakes, causing citizens to breed snakes to collect more bounties.",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "money-and-exchange",
      title: "Money & Mediums of Exchange",
      chapterId: ch5.id,
      difficulty: "CORE",
      order: 2,
      oneLiner:
        "A social technology and shared ledger that functions as a medium of exchange, a unit of account, and a store of value.",
      intuition:
        "Without money, a dentist who wants bread must find a baker who needs a tooth pulled (the 'coincidence of wants'). Money allows anyone to trade time and labor for a universally accepted token.",
      howItWorks:
        "Money evolves from commodity forms (gold, salt) to paper notes and digital ledgers. Its value relies on collective institutional trust, legal tender laws, and sovereign tax obligations.",
      firstPrinciples:
        "Reduction of transaction costs and resolution of the double coincidence of wants.",
      mathematicalModel: `### Equation of Exchange (Monetarism)

$$M \\cdot V = P \\cdot Y$$

- **$M$** is money supply in circulation.
- **$V$** is velocity of money (turnover rate).
- **$P$** is general price level.
- **$Y$** is real economic output (GDP).`,
      commonMisconceptions:
        "Thinking money must be backed by a physical commodity like gold to have value. Most modern money is fiat, backed by institutional stability and state tax-demand.",
      whyItMatters:
        "Understanding money is essential for understanding banking, inflation, interest rates, and global trade networks.",
      example:
        "Using a debit card to instantly transfer electronic bank ledger credits to buy groceries across town.",
    },
  });

  await prisma.concept.create({
    data: {
      slug: "demographic-transition",
      title: "The Demographic Transition Model",
      chapterId: ch5.id,
      difficulty: "INTERMEDIATE",
      order: 3,
      oneLiner:
        "The historical shift from high birth and death rates to low birth and death rates as countries develop economically.",
      intuition:
        "Throughout history, families had many children because child mortality was high. As sanitation and medicine improve, death rates plunge while birth rates remain high, creating a population surge. Eventually, urbanization and education cause birth rates to drop, stabilizing the population.",
      howItWorks:
        "Structured into four stages: Stage 1 (Pre-industrial high birth/death), Stage 2 (Mortality falls, population booms), Stage 3 (Fertility rates fall), and Stage 4 (Low birth/death equilibrium).",
      firstPrinciples:
        "Logistic population dynamics influenced by female education, healthcare, and urbanization.",
      mathematicalModel: `### Logistic Population Differential Growth

$$\\frac{dP}{dt} = r P \\left(1 - \\frac{P}{K}\\right)$$

- **$P$** is population size.
- **$r$** is intrinsic net growth rate.
- **$K$** is carrying capacity ceiling.`,
      commonMisconceptions:
        "The Malthusian belief that human population grows exponentially forever. Global fertility rates have dropped by over 50% since the 1960s.",
      whyItMatters:
        "Explains global demographic aging, labor force trends, and the projected peak humanity ceiling (~10.5 billion people).",
      example:
        "South Korea transitioning from post-war population expansion to a fertility rate below 1.0, reshaping schools and retirement systems.",
    },
  });

  console.log("Database seeded successfully with revised scientific depth!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
