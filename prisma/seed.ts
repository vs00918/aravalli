import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Beginning master textbook-grade knowledge tree seed...");

  // Clean existing records cleanly in foreign-key order
  await prisma.sourceConcept.deleteMany();
  await prisma.connection.deleteMany();
  await prisma.question.deleteMany();
  await prisma.ingestionItem.deleteMany();
  await prisma.concept.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.source.deleteMany();

  // =========================================================================
  // 1. CHAPTER 1: UNIVERSE & PHYSICS
  // =========================================================================
  const ch1 = await prisma.chapter.create({
    data: {
      slug: "universe-physics",
      title: "Universe & Physics",
      icon: "🌌",
      order: 1,
      description: "The fundamental rules that govern matter, energy, space, and time.",
      overview:
        "Physics is the study of how the physical universe works at every scale—from the subatomic particles inside atomic nuclei to the curved geometry of spacetime and evaporating black holes.",
    },
  });

  // CONCEPT 1: Entropy (The Gold Standard Reference)
  const cEntropy = await prisma.concept.create({
    data: {
      slug: "entropy",
      title: "Entropy",
      chapterId: ch1.id,
      difficulty: "INTERMEDIATE",
      order: 3,
      oneLiner:
        "Entropy measures how many microscopic arrangements can produce the larger-scale state we observe. In an isolated system, processes naturally drift toward the state that corresponds to the overwhelmingly largest number of accessible microscopic configurations.",
      whyItMatters:
        "Understanding entropy unlocks the physical foundation for heat engines, refrigeration, chemical equilibrium, data compression limits, and why time has a fixed forward direction.",
      intuition:
        `### The Physical Puzzle: Why Does Gas Spread?
Imagine a glass partition dividing a sealed box into two equal halves. The left half is filled with gas; the right half is a complete vacuum. 

When you slide the partition open, the gas molecules immediately rush across the boundary until they are evenly spread throughout the entire box. 

Why does this happen? There is no attractive force pulling molecules into the empty half. No molecule "knows" the right side is empty. Every molecule simply continues colliding and bouncing according to basic mechanical laws. 

Yet, you will never in human history see all the gas molecules spontaneously gather back into the left half of the box.

### The Mental Model: Distinguishable Coins & Shuffled Cards
Imagine a brand new deck of playing cards arranged in pristine numerical order by suit. There is only **1 exact sequence** that is considered "perfectly sorted." 

However, there are roughly $8 \\times 10^{67}$ possible ways to shuffle the cards into an unsorted arrangement. If you drop the deck onto the floor, the cards will land in an unsorted state—not because of a mysterious destructive force, but simply because unsorted configurations overwhelmingly outnumber sorted ones by an unfathomable ratio.

### Where This Mental Model Stops Being Accurate
Playing cards sitting on a floor are completely static; they have no thermal energy and do not collide with one another. Gas molecules, by contrast, are in constant, violent motion, undergoing roughly $10^9$ elastic collisions per second at room temperature. This constant thermal agitation causes the gas system to continuously explore different microscopic configurations at immense speed.`,
      example:
        `**Everyday Observation**: A drop of blue ink spreading in a glass of clear water.
- **Analogy Boundary**: The ink spreading looks continuous, but beneath the surface it is driven by trillions of random water molecule collisions (Brownian motion) pushing ink molecules into the overwhelmingly larger volume of clear water.`,
      howItWorks:
        `### The Step-by-Step Mechanism

1. **The Starting State (Low Entropy)**:
   All gas molecules are confined to the left half of the container. The number of accessible microscopic positions is strictly restricted.
2. **Partition Removed**:
   Molecules cross the boundary via ordinary thermal velocity.
3. **Randomization Through Collisions**:
   Molecules collide elastically with each other and the container walls, randomizing their positions and velocities across the entire combined volume.
4. **Statistical Dominance of Equilibrium**:
   As the molecules explore all accessible spatial coordinates, the system enters macroscopic states that have the highest number of microscopic configurations.

---

### The Concrete Worked Example: 10-Particle Toy Model

Consider a simplified container divided into a Left side ($L$) and a Right side ($R$), containing just **10 distinguishable gas particles** labeled A through J.

- A **Microstate** is the exact list of which specific particles are in which half (e.g. Particles A, B, C in Left; D through J in Right).
- A **Macrostate** is the total number of particles on the Left side ($N_L$), regardless of their identity.

The total number of possible microstates for 10 particles is:
$$2^{10} = 1024 \\text{ microstates}$$

Let us count the number of microstates (the multiplicity $\\Omega$) for each macrostate using the binomial coefficient $\\binom{10}{N_L}$:

| Macrostate ($N_L$) | Number of Microstates ($\\Omega$) | Probability | Physical State |
| :--- | :--- | :--- | :--- |
| **10 Left, 0 Right** | $\\binom{10}{10} = 1$ | $1 / 1024 \\approx 0.1\\%$ | All particles in original corner |
| **9 Left, 1 Right** | $\\binom{10}{9} = 10$ | $10 / 1024 \\approx 1.0\\%$ | Highly unbalanced |
| **8 Left, 2 Right** | $\\binom{10}{8} = 45$ | $45 / 1024 \\approx 4.4\\%$ | Unbalanced |
| **7 Left, 3 Right** | $\\binom{10}{7} = 120$ | $120 / 1024 \\approx 11.7\\%$ | Slight fluctuation |
| **6 Left, 4 Right** | $\\binom{10}{6} = 210$ | $210 / 1024 \\approx 20.5\\%$ | Near equilibrium |
| **5 Left, 5 Right** | $\\binom{10}{5} = 252$ | $252 / 1024 \\approx 24.6\\%$ | **Equilibrium (Even Spread)** |

### Key Takeaway from the Toy Model:
- The evenly distributed state ($5L, 5R$) has **252 microstates**.
- The all-in-one-corner state ($10L, 0R$) has only **1 microstate**.
- Therefore, the equilibrium state is **252 times more likely** than the initial unmixed state.

---

### Scaling to Avogadro-Scale Systems ($N = 10^{23}$)
When you scale from 10 particles to a real mole of gas ($N \\approx 6.022 \\times 10^{23}$ particles):
- The multiplicity of the 50/50 evenly distributed macrostate is roughly $2^{10^{23}}$.
- The peak around the 50/50 state becomes so unimaginably sharp that the probability of seeing even a $0.001\\%$ deviation from uniform density is less than 1 in $10^{10^{20}}$.
- **Macroscopic irreversibility is statistical certainty, not a mysterious physical force.**

---

### What Changes Microscopically vs. Macroscopically:
- **What moves?** Individual gas molecules with thermal kinetic velocity $v_{\\text{rms}} = \\sqrt{3k_B T / m}$.
- **Why does it move?** Thermal kinetic energy.
- **What changes microscopically?** The system continuously changes its specific microstate every femtosecond.
- **What changes macroscopically?** Density and pressure equalize throughout the volume; macroscopic observable properties become static.
- **What remains conserved?** Total energy $E$, total volume $V$, and total particle number $N$.`,
      firstPrinciples:
        `### Foundational Axioms of Statistical Mechanics

1. **The Fundamental Assumption of the Microcanonical Ensemble**:
   For an isolated system in equilibrium with fixed energy $E$, volume $V$, and particle number $N$, **all accessible microstates are equally probable**. No microstate is favored by the laws of physics over any other.
2. **Microscopic Reversibility vs. Macroscopic Irreversibility**:
   The underlying laws of motion (Newton's laws, Maxwell's equations, Schrödinger's equation) are strictly time-reversible. If you reverse the velocity vector of every single particle simultaneously, the system would reassemble into the left corner. However, because equilibrium microstates outnumber non-equilibrium microstates by factors of $10^{10^{23}}$, spontaneous reversal never happens in practice.

### Epistemic Categorization:
- **LAW**: The Second Law of Thermodynamics (for an isolated system, $\\Delta S \\ge 0$).
- **STATISTICAL RESULT**: Multiplicity $\\Omega$ peaks overwhelmingly at uniform spatial and thermal distribution.
- **MODEL**: The ideal gas microcanonical ensemble.
- **INTERPRETATION**: The thermodynamic arrow of time (the universe evolves from a low-entropy initial state at the Big Bang toward higher entropy).`,
      mathematicalModel:
        `### 1. What Question Is the Equation Answering?
*"How do we mathematically quantify microstate multiplicity so that entropy behaves as an extensive, additive physical property?"*

---

### 2. Motivation for the Logarithm: The Additivity Proof

Consider two completely independent physical systems, System A and System B:
- System A has $\\Omega_A$ accessible microstates.
- System B has $\\Omega_B$ accessible microstates.

Because the systems are independent, the total number of composite microstates for the combined system $(A+B)$ is multiplicative:
$$\\Omega_{AB} = \\Omega_A \\times \\Omega_B$$

However, in thermodynamics, we demand that extensive properties (like mass, volume, and total energy) are **additive**:
$$S_{AB} = S_A + S_B$$

The unique continuous mathematical function that converts multiplication into addition is the **natural logarithm**:
$$\\ln(\\Omega_A \\cdot \\Omega_B) = \\ln \\Omega_A + \\ln \\Omega_B$$

Therefore, Ludwig Boltzmann defined entropy as:
$$S = k_B \\ln \\Omega$$

$$S_{AB} = k_B \\ln(\\Omega_A \\Omega_B) = k_B \\ln \\Omega_A + k_B \\ln \\Omega_B = S_A + S_B$$

---

### 3. Variable Definitions & Units

| Variable | Definition | Units | Physical Role |
| :--- | :--- | :--- | :--- |
| **$S$** | Thermodynamic / Statistical Entropy | $\\text{J}/\\text{K}$ (Joules per Kelvin) | Quantifies extensive phase space volume |
| **$k_B$** | Boltzmann Constant | $1.380649 \\times 10^{-23} \\text{ J}/\\text{K}$ | Bridges microscopic energy ($k_B T$) to macroscopic temperature |
| **$\\Omega$** | Microstate Multiplicity | Dimensionless integer | Number of quantum/classical microstates for a given macrostate |

---

### 4. The Thermodynamic Definition (Clausius Relation)

In classical macroscopic thermodynamics (before atomic structure was proven), Rudolf Clausius defined the infinitesimal change in entropy during a reversible heat transfer as:

$$dS = \\frac{\\delta Q_{\\text{rev}}}{T}$$

- **$\\delta Q_{\\text{rev}}$**: Infinitesimal heat energy added reversibly to the system (Joules, $\\text{J}$).
- **$T$**: Absolute thermodynamic temperature (Kelvin, $\\text{K}$).

**Physical Interpretation**: Adding heat energy $\\delta Q$ to a cold system ($T$ small) increases its microstate multiplicity dramatically (large $dS$), whereas adding the same heat to a hot system ($T$ large) creates a much smaller proportional increase in multiplicity.

---

### 5. Worked Numerical Example: Isothermal Free Expansion

Calculate the entropy change when **1 mole of ideal gas** ($n = 1\\text{ mol}$) doubles its volume ($V_1 \\to 2V_1$) at constant temperature $T = 300\\text{ K}$:

$$\\Delta S = n R \\ln\\left(\\frac{V_2}{V_1}\\right) = (1\\text{ mol}) \\times (8.314\\text{ J}/\\text{mol}\\cdot\\text{K}) \\times \\ln(2)$$
$$\\Delta S = 8.314 \\times 0.69315 = +5.763 \\text{ J}/\\text{K}$$

**Physical Meaning**: Because the volume doubled, each molecule has twice as many spatial positions available, increasing total multiplicity $\\Omega$ by a factor of $2^{N_A}$, resulting in a positive entropy gain of $+5.76\\text{ J/K}$.

---

### 6. What the Equation Does NOT Tell Us:
- It does **not** tell us the *rate* or speed of expansion (thermodynamics is independent of time duration).
- It does **not** track individual particle trajectories; it is strictly an ensemble average.`,
      commonMisconceptions:
        `**MISCONCEPTION**: "Entropy is disorder or messiness."
**CORRECTION**: While "disorder" is a common visual shorthand, entropy strictly measures the mathematical multiplicity ($\\Omega$) of microscopic configurations compatible with macroscopic constraints. Highly ordered structures (like ice crystals freezing at sub-zero temperatures) form spontaneously because the latent heat released to the surrounding environment increases the surrounding microstate multiplicity by more than the crystal loses internally.
**WHY THE CONFUSION HAPPENS**: Shuffled cards, messy rooms, and broken mugs look "disordered" to human eyes, creating the false intuition that entropy is a subjective aesthetic property rather than a rigorous physical counting of states.

---

**MISCONCEPTION**: "Life violates the Second Law of Thermodynamics by creating biological order."
**CORRECTION**: The Second Law strictly applies to **isolated systems**. Living organisms are **open systems** that continuously take in low-entropy energy (food, sunlight) and dissipate high-entropy thermal waste into the environment. The net entropy change of the organism plus its surroundings is strictly positive ($\\Delta S_{\\text{total}} > 0$).
**WHY THE CONFUSION HAPPENS**: People mistakenly evaluate the cell or organism in isolation rather than including the energetic throughput from its environment.

---

### If You Remember Only Five Things:
1. **Entropy is state multiplicity**: $S = k_B \\ln \\Omega$ measures how many microscopic arrangements correspond to the macroscopic state you see.
2. **Equilibrium is statistical dominance**: Closed systems evolve toward equilibrium simply because equilibrium microstates outnumber all other microstates by astronomical proportions.
3. **The logarithm ensures additivity**: The log converts multiplicative microstate probabilities ($\\Omega_A \\cdot \\Omega_B$) into additive thermodynamic entropy ($S_A + S_B$).
4. **Irreversibility emerges from scale**: While microscopic particle collisions are reversible, macroscopic reversal is statistically impossible for $10^{23}$ particles.
5. **Life is an open entropy pump**: Living things maintain internal order by continuously exporting entropy to their surrounding environment.

---

### Questions to Test Your Understanding:
1. *Why doesn't a glass of lukewarm water spontaneously separate into boiling water on top and ice on the bottom, even though energy would be conserved?*
2. *If all accessible microstates are equally probable, why do we almost never observe a non-equilibrium state in macroscopic systems?*
3. *What would happen to the additivity of entropy if we defined $S = k_B \\Omega$ instead of $S = k_B \\ln \\Omega$?*
4. *Can entropy decrease inside a local subsystem? What must happen to the rest of the universe if it does?*`,
    },
  });

  // CONCEPT 2: Matter & Energy
  const cMatterEnergy = await prisma.concept.create({
    data: {
      slug: "matter-and-energy",
      title: "Matter & Energy",
      chapterId: ch1.id,
      difficulty: "FOUNDATION",
      order: 1,
      oneLiner:
        "Matter is anything that possesses mass and occupies physical space; energy is the conserved mathematical quantity that measures a system's capacity to perform mechanical work or transfer heat.",
      whyItMatters:
        "Understanding mass-energy equivalence ($E = mc^2$) and the First Law of Thermodynamics is the foundational basis of all chemistry, particle physics, nuclear energy, and cosmology.",
      intuition:
        `### What Should You Imagine?
Think of matter as physical building blocks and energy as the universal currency that allows those blocks to move, vibrate, or change structure. 

Before 1905, physics treated matter and energy as two separate universes: mass was conserved (Lavoisier), and energy was conserved (Joule). Albert Einstein's Special Relativity revealed that mass and energy are two different expressions of the **same single underlying physical property**. 

Mass can be converted into energy, and energy can condense into mass.

### Analogy & Its Boundaries
- **Analogy**: Ice and water vapor. They look completely different and have different mechanical properties, but both are made of the exact same chemical substance ($H_2O$) in different states.
- **Where the Analogy Stops**: Ice and water vapor are physical phases of molecules. Mass and energy are fundamental relativistic properties of spacetime itself.`,
      howItWorks:
        `### Step-by-Step Mechanism: Nuclear Binding Energy

1. **The Starting Nucleus**: A helium nucleus ($^4\\text{He}$) consists of 2 protons and 2 neutrons.
2. **Weighing the Individual Parts**: If you weigh 2 free protons and 2 free neutrons separately, their combined mass is $4.03188\\text{ u}$.
3. **Weighing the Bound Nucleus**: When bound together into a helium nucleus, the measured mass is $4.00151\\text{ u}$.
4. **The Mass Defect ($\\Delta m$)**: A mass of $0.03037\\text{ u}$ has completely disappeared!
5. **Energy Release**: The missing mass was converted into binding energy ($E = \\Delta m c^2$) and radiated away as energetic gamma photons during nucleosynthesis.

- **What moved?** Nucleons assembled under the Strong Nuclear Force.
- **What changed microscopically?** Potential energy in the nuclear field decreased.
- **What changed macroscopically?** Measurable rest mass decreased; thermal kinetic energy was released.
- **What was conserved?** Total relativistic mass-energy.`,
      firstPrinciples:
        `### Conservation Laws & Emmy Noether's Theorem

1. **Emmy Noether's First Theorem (1915)**:
   Every continuous symmetry of the laws of physics corresponds to an exact conservation law.
   - **Time Translation Symmetry** (the laws of physics do not change from Monday to Tuesday) $\\implies$ **Conservation of Energy**.
   - **Spatial Translation Symmetry** (physics is identical in New York and Tokyo) $\\implies$ **Conservation of Momentum**.
2. **Relativistic Invariant Mass**:
   $$E^2 = (pc)^2 + (m_0 c^2)^2$$
   For a stationary particle ($p = 0$), this reduces to $E = m_0 c^2$.`,
      mathematicalModel:
        `### 1. The Core Relativistic Equation

$$E = mc^2$$

- **$E$**: Energy in Joules ($\\text{J} = \\text{kg}\\cdot\\text{m}^2/\\text{s}^2$).
- **$m$**: Relativistic mass in kilograms ($\\text{kg}$).
- **$c$**: Speed of light in vacuum ($2.99792458 \\times 10^8 \\text{ m/s}$).

### 2. Numerical Calculation: Energy in 1 Gram of Matter
Convert $1\\text{ gram}$ ($10^{-3}\\text{ kg}$) of matter entirely into energy:
$$E = (10^{-3}\\text{ kg}) \\times (3 \\times 10^8 \\text{ m/s})^2 = 10^{-3} \\times 9 \\times 10^{16} = 9 \\times 10^{13} \\text{ Joules}$$
$$E \\approx 25 \\text{ million kilowatt-hours (kWh)}$$
*Equivalent to burning roughly 3 million liters of gasoline.*

### 3. The First Law of Thermodynamics:
$$\\Delta U = Q - W$$
- **$\\Delta U$**: Change in internal energy of the system.
- **$Q$**: Heat added to the system.
- **$W$**: Work performed by the system on its surroundings.`,
      commonMisconceptions:
        `**MISCONCEPTION**: "Energy is a tangible, glowing physical substance."
**CORRECTION**: Energy is not a physical fluid or material substance; it is a mathematical property and numerical scalar value assigned to a physical state that remains constant throughout all physical transformations.
**WHY THE CONFUSION HAPPENS**: Science fiction and everyday language depict energy as "pure glowing plasma."

---

### If You Remember Only Five Things:
1. **Mass and energy are equivalent**: $E = mc^2$ means mass is concentrated, localized energy.
2. **Energy is conserved by time symmetry**: Noether's theorem proves energy conservation arises because physics is invariant over time.
3. **Energy is a scalar quantity, not a substance**: It measures capacity to do work or exchange heat.
4. **Mass defect powers stars**: The sun shines because fused helium is lighter than the raw hydrogen protons that created it.
5. **First Law limits all engines**: You cannot get more work out of a system than the energy you put in ($\\Delta U = Q - W$).

---

### Questions to Test Understanding:
1. *Where did the energy go when a fast-moving car brakes to a complete stop?*
2. *Why does a stretched rubber band weigh slightly more than a relaxed rubber band?*
3. *Why does Noether's theorem connect time translation symmetry with energy conservation?*`,
      example: "Mass defect in helium nucleosynthesis and nuclear binding energy.",
    },
  });

  // CONCEPT 3: Atoms & The Subatomic Scale
  const cAtoms = await prisma.concept.create({
    data: {
      slug: "atoms-and-subatomic-scale",
      title: "Atoms & The Subatomic Scale",
      chapterId: ch1.id,
      difficulty: "CORE",
      order: 2,
      oneLiner:
        "The fundamental microscopic building blocks of chemical matter, consisting of a dense nucleus of protons and neutrons surrounded by a quantum electron probability cloud.",
      whyItMatters:
        "The geometric structure of atomic electron shells determines all chemical bonding, electricity, materials science, pharmacology, and biological structures.",
      intuition:
        `### What Should You Imagine?
If an atom were enlarged to the size of a massive sports stadium, the nucleus would be a tiny marble resting at the 50-yard line, and the electrons would be faint ripples in the highest upper deck seats. 

Over **99.999999999% of an atom's volume is non-classical empty space filled with quantum wave fields**.

### Analogy & Its Boundaries
- **Solar System Analogy**: Electrons orbiting a nucleus like planets around the sun.
- **Where It Fails**: Planetary orbits are deterministic trajectories. In quantum mechanics, electrons do not follow paths; they exist as stationary probability density wavefunctions ($|\\psi|^2$). If an electron orbited classically, it would radiate electromagnetic energy and spiral into the nucleus in $10^{-11}$ seconds.`,
      howItWorks:
        `### Step-by-Step Causal Structure
1. **The Central Nucleus**: Protons ($+e$) and neutrons ($0$) are bound by the Strong Nuclear Force (mediated by gluons), overcoming immense electrostatic repulsion.
2. **Electromagnetic Confinement**: Positively charged protons attract negatively charged electrons ($-e$) via Coulomb's Law.
3. **Quantum Wave Quantization**: Because electrons exhibit wave-particle duality (de Broglie $\\lambda = h/p$), only standing wave patterns with integer quantum numbers ($n, l, m_l, m_s$) can stably exist.
4. **Pauli Exclusion Principle**: No two identical fermions can occupy the same quantum state, forcing electrons into concentric orbital shells ($s, p, d, f$) and giving solid matter its volume and chemical diversity.`,
      firstPrinciples:
        `### Quantum Axioms
1. **Wave-Particle Duality**: Matter exhibits both particle-like and wave-like properties.
2. **Pauli Exclusion Principle**: The total wavefunction of two identical fermions is anti-symmetric under particle exchange ($\\psi(x_1, x_2) = -\\psi(x_2, x_1)$).
3. **Heisenberg Uncertainty Principle**:
   $$\\Delta x \\cdot \\Delta p \\ge \\frac{\\hbar}{2}$$
   Confinement of an electron to a tiny nuclear volume would demand enormous momentum uncertainty, creating kinetic energy that forces the electron cloud outward.`,
      mathematicalModel:
        `### 1. The Time-Independent Schrödinger Equation

$$\\hat{H}\\psi = E\\psi$$

$$\\left( -\\frac{\\hbar^2}{2m} \\nabla^2 + V(r) \\right)\\psi = E\\psi$$

- **$\\hbar$**: Reduced Planck constant ($1.0545718 \\times 10^{-34} \\text{ J}\\cdot\\text{s}$).
- **$V(r) = -\\frac{e^2}{4\\pi \\epsilon_0 r}$**: Coulomb attractive potential of the nucleus.
- **$|\\psi(r, \\theta, \\phi)|^2$**: Spatial probability density of finding the electron.

### 2. Quantized Energy Levels of Hydrogen:
$$E_n = -\\frac{13.6 \\text{ eV}}{n^2}, \\quad n \\in \\{1, 2, 3, \\dots\\}$$`,
      commonMisconceptions:
        `**MISCONCEPTION**: "Electrons orbit the nucleus like miniature planets."
**CORRECTION**: Electrons exist as stationary three-dimensional quantum probability waves (orbitals) until measured.
**WHY THE CONFUSION HAPPENS**: Rutherford-Bohr planetary diagrams remain widespread in logos and elementary textbooks.

---

### If You Remember Only Five Things:
1. **Atoms are mostly quantum field vacuum**: 99.999% of volume is empty space shaped by electron probability waves.
2. **Pauli Exclusion prevents collapse**: Matter has solid volume because identical electrons cannot occupy the same state.
3. **Orbitals are probability distributions**: $|\\psi|^2$ gives the odds of finding an electron, not a fixed orbit.
4. **Chemical bonds are electron sharing**: Chemistry is electromagnetic minimization between valence electron clouds.
5. **Nuclear force vs. Electromagnetism**: Nuclei are held together by the Strong Force, which overpowers proton repulsion at femtometer scales.

---

### Questions to Test Understanding:
1. *Why doesn't the negative electron fall directly into the positive nucleus?*
2. *Why can you not push your hand through a solid wooden table if atoms are mostly empty space?*
3. *What prevents all electrons in an atom from crowding into the lowest energy orbital ($n=1$)?*`,
      example: "Hydrogen atom 1s ground state wavefunction and electron cloud geometry.",
    },
  });

  // CONCEPT 4: Quantum Unitarity & Information Conservation
  const cQuantum = await prisma.concept.create({
    data: {
      slug: "quantum-unitarity",
      title: "Quantum Unitarity & Information Conservation",
      chapterId: ch1.id,
      difficulty: "FRONTIER",
      order: 4,
      oneLiner:
        "The fundamental quantum mechanical law that total probability must always sum to exactly 1, meaning that microscopic physical information is strictly conserved and never destroyed in the universe.",
      whyItMatters:
        "Unitarity guarantees microscopic reversibility. When Stephen Hawking proposed that black holes destroy information via thermal radiation, it created the celebrated Black Hole Information Paradox.",
      intuition:
        `### What Should You Imagine?
If you burn a paper diary in a fireplace, the pages turn to ash, smoke, and infrared light. To human eyes, the words are lost forever. 

However, according to fundamental quantum physics, if you had a super-detector tracking every escaping photon of infrared heat, every smoke molecule, and every ash particle, the equations of quantum mechanics could theoretically be run backward with 100% mathematical precision to reconstruct the exact words in the diary. 

Physical information is **fundamentally indestructible**.

### Analogy & Its Boundaries
- **Analogy**: Scrambling a Rubik's cube. The colors look chaotic, but every rotation is fully reversible.
- **Where It Fails**: Real quantum states involve entanglement across infinite Hilbert space dimensions.`,
      howItWorks:
        `### Step-by-Step Causal Sequence:
1. **Quantum State Vector**: A system's state is represented by a unit vector $|\\psi\\rangle$ in a complex Hilbert space.
2. **Time Evolution via Unitary Operators**: Time evolution is governed by the operator $U(t) = \\exp(-i\\hat{H}t/\\hbar)$.
3. **Inner Product Preservation**: A unitary operator satisfies $U^\\dagger U = \\hat{I}$. This guarantees that the geometric angles and distances between distinct quantum states are strictly preserved.
4. **Information Indestructibility**: Because distinct initial states remain distinct orthogonal vectors under unitary time evolution, the past can always be uniquely mapped from the future.`,
      firstPrinciples:
        `### Mathematical Foundations of Quantum Mechanics
1. **Conservation of Total Probability**: $\\sum_i P_i = 1$ at all points in time.
2. **No-Cloning Theorem**: It is mathematically impossible to create an identical copy of an arbitrary unknown quantum state ($|\\psi\\rangle |0\\rangle \\not\\to |\\psi\\rangle |\\psi\\rangle$).
3. **No-Deleting Theorem**: It is mathematically impossible to erase an unknown quantum state without transferring its information to the environment.`,
      mathematicalModel:
        `### 1. The Unitary Condition

$$U^\\dagger U = \\hat{I} \\quad \\implies \\quad \\langle \\psi(t) | \\psi(t) \\rangle = \\langle \\psi(0) | U^\\dagger U | \\psi(0) \\rangle = \\langle \\psi(0) | \\psi(0) \\rangle = 1$$

- **$U = e^{-i\\hat{H}t/\\hbar}$**: Quantum time evolution operator.
- **$U^\\dagger$**: Hermitian adjoint (conjugate transpose).
- **$\\hat{I}$**: Identity operator.

### 2. Von Neumann Entropy & Pure States:
$$S_{\\text{vN}} = -\\text{Tr}(\\rho \\ln \\rho)$$
For any isolated pure state evolving unitarily, $S_{\\text{vN}} = 0$ for all time.`,
      commonMisconceptions:
        `**MISCONCEPTION**: "Information is destroyed when an object falls into a black hole."
**CORRECTION**: Hawking's original 1974 calculation suggested information was erased, but modern quantum gravity (AdS/CFT correspondence and Page curve calculations) demonstrates that information leaks out through subtle quantum entanglement in Hawking radiation.
**WHY THE CONFUSION HAPPENS**: Black hole radiation appears thermal and random on the surface, masking deep quantum entanglement.

---

### If You Remember Only Five Things:
1. **Unitarity means total probability is 1**: Quantum probability can neither leak out nor be created.
2. **Microscopic information is conserved**: The microscopic history of the universe is deterministic and reversible.
3. **Unitary operators preserve inner products**: Distinct quantum states remain distinct forever under isolated evolution.
4. **No-Cloning & No-Deleting**: You can neither duplicate nor delete unknown quantum states.
5. **Black hole paradox resolved by entanglement**: Information is preserved in Hawking radiation over the complete Page curve.

---

### Questions to Test Understanding:
1. *Why does unitarity prevent two different initial quantum states from evolving into the exact same final state?*
2. *What is the difference between human practical irreversibility (shattering glass) and fundamental quantum irreversibility?*
3. *Why does the No-Cloning theorem prevent creating exact backups of quantum data?*`,
      example: "Unitary time evolution of a quantum spin state in a magnetic field.",
    },
  });

  // =========================================================================
  // 2. CHAPTER 2: ENERGY & TECHNOLOGY
  // =========================================================================
  const ch2 = await prisma.chapter.create({
    data: {
      slug: "energy-technology",
      title: "Energy & Technology",
      icon: "⚡",
      order: 2,
      description: "How we generate, store, move and use energy to power human civilization.",
      overview:
        "Energy is the fundamental currency of modern civilization. Everything from smartphones and electric vehicles to data centers and steel manufacturing depends on thermodynamics and electrical systems.",
    },
  });

  // CONCEPT 5: What Is Energy?
  const cWhatIsEnergy = await prisma.concept.create({
    data: {
      slug: "what-is-energy",
      title: "What Is Energy?",
      chapterId: ch2.id,
      difficulty: "FOUNDATION",
      order: 1,
      oneLiner:
        "The quantifiable capacity of a physical system to perform mechanical work, produce heat, or generate radiation.",
      whyItMatters:
        "Energy governs the physical performance limits of all industrial manufacturing, global shipping, computation, heating, and electric flight.",
      intuition:
        `### The Universal Accounting Balance
Imagine a parent giving a child 100 wooden building blocks. The child plays with them all day, hiding some in toy boxes, throwing some out the window, and stacking others. 

If the parent meticulously counts the blocks in the box, on the rug, and outside, the sum is always exactly **100 blocks**. 

Energy in physics is that exact accounting balance: it appears in different physical "rooms" (gravitational potential, kinetic velocity, chemical bonds, thermal vibrations), but the total ledger balance in an isolated system never changes.

### Analogy Boundary
Blocks are discrete tangible wooden objects. Energy is a continuous mathematical scalar property of physical configurations.`,
      howItWorks:
        `### Step-by-Step Causal Sequence: Work and Energy Transfer
1. **Force Applied**: An external force $\\mathbf{F}$ is exerted on a mass.
2. **Displacement ($d\\mathbf{r}$)**: The mass moves along a displacement vector.
3. **Mechanical Work Done ($W = \\int \\mathbf{F} \\cdot d\\mathbf{r}$)**: Mechanical work transfers energy from the agent to the mass.
4. **Kinetic Accumulation**: The work accelerates the mass, increasing kinetic energy ($E_k = \\frac{1}{2}mv^2$).
5. **Dissipative Losses**: Friction converts a fraction of kinetic energy into disorganized molecular vibrations (heat).`,
      firstPrinciples:
        `### The Fundamental Work-Energy Theorem
$$\\Delta K = W_{\\text{net}} = \\int \\mathbf{F}_{\\text{net}} \\cdot d\\mathbf{r}$$
The net work done on an object equals the change in its kinetic energy.`,
      mathematicalModel:
        `### 1. Mechanical Work & Kinetic Energy

$$W = \\int_{r_1}^{r_2} \\mathbf{F} \\cdot d\\mathbf{r} \\quad \\text{and} \\quad E_k = \\frac{1}{2}m v^2$$

- **$W$**: Work performed in Joules ($\\text{J}$).
- **$\\mathbf{F}$**: Vector force in Newtons ($\\text{N}$).
- **$m$**: Mass in $\\text{kg}$; **$v$**: Velocity in $\\text{m/s}$.

### 2. Numerical Example: Lifting a 10 kg Weight
Lift a $10\\text{ kg}$ barbell by $2\\text{ meters}$ vertically against gravity ($g = 9.81\\text{ m/s}^2$):
$$W = mgh = (10\\text{ kg}) \\times (9.81\\text{ m/s}^2) \\times (2\\text{ m}) = 196.2 \\text{ Joules}$$`,
      commonMisconceptions:
        `**MISCONCEPTION**: "Consuming energy causes it to disappear."
**CORRECTION**: Energy is never destroyed; it degrades from high-grade usable work into low-grade ambient heat (entropy increase).
**WHY THE CONFUSION HAPPENS**: We say "the battery is dead," meaning its electrochemical potential has reached equilibrium, not that energy ceased to exist.

---

### If You Remember Only Five Things:
1. **Energy is capacity to do work**: $W = \\mathbf{F} \\cdot d$.
2. **Total energy is strictly conserved**: First Law of Thermodynamics.
3. **Energy is a scalar quantity**: It has magnitude and units (Joules), but no direction in space.
4. **Forms change, total remains**: Potential, kinetic, chemical, and thermal energy exchange continuously.
5. **Degradation, not destruction**: Energy quality drops toward ambient heat through entropy.`,
      example: "Hydroelectric dam converting gravitational potential water energy into electrical grid power.",
    },
  });

  // CONCEPT 6: Electricity & Charge Flow
  const cElectricity = await prisma.concept.create({
    data: {
      slug: "electricity",
      title: "Electricity & Charge Flow",
      chapterId: ch2.id,
      difficulty: "CORE",
      order: 2,
      oneLiner:
        "The physical movement and electrostatic potential of electric charges (electrons and ions) through conductive materials.",
      whyItMatters:
        "Electricity is the primary medium for transporting energy cleanly and instantaneously across continental power networks.",
      intuition:
        `### The Water Pipe Mental Model
Imagine a closed water circuit with a circulating pump:
- **Voltage ($V$) is Water Pressure**: The pressure differential created by the pump.
- **Current ($I$) is Flow Rate**: The volume of water flowing past a point per second (Liters/second).
- **Resistance ($R$) is Pipe Constriction**: The narrowness of the pipe resisting water flow.

### Where This Mental Model Fails
Water molecules in a pipe move at several meters per second. In electrical circuits, individual electrons drift at a crawl (~millimeters per second), but the **electromagnetic wave propagates through the electric field at roughly $90\\%$ the speed of light**. When you flip a switch, the light turns on instantly because the electric field pushes all electrons in the wire simultaneously.`,
      howItWorks:
        `### Step-by-Step Causal Circuit Dynamics:
1. **Chemical Potential**: A battery separates positive and negative charges through electrochemical reactions, establishing an electrostatic potential difference (Voltage $V$).
2. **Field Propagation**: Closing the circuit creates an electric field ($\\mathbf{E} = -\\nabla V$) throughout the conductor at nearly light speed.
3. **Drift Velocity**: Conduction electrons experience a Lorentz force ($\\mathbf{F} = -e\\mathbf{E}$), causing a net drift velocity ($v_d$) through the copper crystal lattice.
4. **Joule Heating**: Electrons collide with vibrating metal ions in the lattice, dissipating energy as heat ($P = I^2 R$).`,
      firstPrinciples:
        `### Conservation of Electric Charge & Maxwell's Equations
1. **Charge Invariance**: The net electrical charge in any closed system is strictly conserved ($\\nabla \\cdot \\mathbf{J} + \\frac{\\partial \\rho}{\\partial t} = 0$).
2. **Ohm's Law as a Material Model**: In linear conductors, current density is directly proportional to electric field strength ($\\mathbf{J} = \\sigma \\mathbf{E}$).`,
      mathematicalModel:
        `### 1. Ohm's Law & Electrical Power

$$V = IR \\quad \\text{and} \\quad P = VI = I^2 R = \\frac{V^2}{R}$$

- **$V$**: Potential difference in Volts ($\\text{V} = \\text{J/C}$).
- **$I$**: Current in Amperes ($\\text{A} = \\text{C/s}$).
- **$R$**: Resistance in Ohms ($\\Omega = \\text{V/A}$).
- **$P$**: Power dissipation in Watts ($\\text{W} = \\text{J/s}$).

### 2. Numerical Example: High-Voltage Transmission Lines
Why do utility grids transmit power at $500,000\\text{ V}$ instead of $120\\text{ V}$?
To deliver $100\\text{ MW}$ ($10^8\\text{ W}$) across a line with $R = 10\\ \\Omega$:
- At $120\\text{ V}$: $I = P/V = 10^8 / 120 = 833,333\\text{ A}$. Line power loss $P_{\\text{loss}} = I^2 R = (8.33 \\times 10^5)^2 \\times 10 = 6.94 \\times 10^{12}\\text{ W}$ (*The wire vaporizes instantly*).
- At $500,000\\text{ V}$: $I = 10^8 / 500,000 = 200\\text{ A}$. Line power loss $P_{\\text{loss}} = (200)^2 \\times 10 = 400,000\\text{ W} = 0.4\\text{ MW}$ (*Only 0.4% transmission loss!*).`,
      commonMisconceptions:
        `**MISCONCEPTION**: "Electrons travel at the speed of light through the wire."
**CORRECTION**: Individual electron drift velocity is slower than a snail (~$0.1\\text{ mm/s}$); the electromagnetic energy travels in the fields surrounding the wire at nearly the speed of light.
**WHY THE CONFUSION HAPPENS**: Lights turn on instantaneously when a switch is flipped.

---

### If You Remember Only Five Things:
1. **Voltage is pressure, current is flow rate**: $V = IR$.
2. **Energy is carried in the electromagnetic field**: Poynting vector $\\mathbf{S} = \\mathbf{E} \\times \\mathbf{B}$.
3. **High voltage cuts line losses**: $P_{\\text{loss}} = I^2 R$, so stepping up voltage drops current and saves energy.
4. **Drift velocity is slow, signal is fast**: Field propagates at nearly $c$.
5. **Charge is strictly conserved**: Kirchhoff's Current Law $\\sum I_{\\text{in}} = \\sum I_{\\text{out}}$.`,
      example: "Continental high-voltage AC/DC power transmission grids.",
    },
  });

  // CONCEPT 7: Energy Density
  const cEnergyDensity = await prisma.concept.create({
    data: {
      slug: "energy-density",
      title: "Energy Density",
      chapterId: ch2.id,
      difficulty: "INTERMEDIATE",
      order: 3,
      oneLiner:
        "The quantity of usable energy stored per unit volume (volumetric energy density, Wh/L) or per unit mass (gravimetric specific energy, Wh/kg).",
      whyItMatters:
        "Energy density is the fundamental engineering bottleneck determining which transport sectors can be electrified (passenger cars vs. long-haul transoceanic flight).",
      intuition:
        `### What Should You Imagine?
Imagine planning a cross-country flight in a 4-seater airplane:
- **Liquid Jet Fuel**: Storing $1000\\text{ kWh}$ of energy requires $\\sim 80\\text{ kg}$ of kerosene fuel.
- **Lithium-Ion Battery**: Storing the same $1000\\text{ kWh}$ in current lithium batteries requires $\\sim 4000\\text{ kg}$ of battery pack!

The airplane simply cannot lift off the ground carrying that much mass. 

Gravimetric energy density dictates **what can fly**, while volumetric density dictates **what fits in your pocket** (smartphones).

### Why the Massive Difference Exists
Hydrocarbon fuel is composed of concentrated carbon-hydrogen covalent bonds that burn atmospheric oxygen ($O_2$), meaning the airplane does not need to carry the oxidant mass on board. A battery is a self-contained electrochemical cell carrying all heavy cathode and anode host crystal matrices.`,
      howItWorks:
        `### Step-by-Step Chemical vs. Electrochemical Mechanics
1. **Hydrocarbon Combustion**: Gasoline ($C_8H_{18}$) releases energy when strong $C=O$ and $O-H$ bonds form, breaking weaker $C-C$ and $C-H$ bonds. Specific energy $\\approx 12,000\\text{ Wh/kg}$.
2. **Lithium-Ion Intercalation**: Energy is stored by shuttling $Li^+$ ions between graphite and a heavy transition metal oxide lattice (e.g. $\\text{LiCoO}_2$). Specific energy $\\approx 250\\text{ Wh/kg}$.
3. **The Molecular Weight Penalty**: Lithium ions must be held inside heavy host crystal structures, imposing a severe gravimetric mass penalty.`,
      firstPrinciples:
        `### Theoretical Maximum Electrochemical Potential
$$\\text{Specific Energy} = \\frac{n F E_{\\text{cell}}}{M_{\\text{active}}}$$
- **$n$**: Electrons per reaction.
- **$F$**: Faraday constant ($96,485\\text{ C/mol}$).
- **$E_{\\text{cell}}$**: Cell voltage.
- **$M_{\\text{active}}$**: Molar mass of reactants.`,
      mathematicalModel:
        `### 1. Comparative Energy Density Table

| Storage Medium | Gravimetric Specific Energy | Volumetric Energy Density | Round-Trip Efficiency |
| :--- | :--- | :--- | :--- |
| **Kerosene / Jet Fuel** | $12,000 \\text{ Wh/kg}$ | $9,500 \\text{ Wh/L}$ | $\\sim 35\\%$ (Thermal engine) |
| **Gasoline** | $12,200 \\text{ Wh/kg}$ | $8,800 \\text{ Wh/L}$ | $\\sim 30\\%$ (Thermal engine) |
| **Hydrogen (Liquid, -253°C)** | $33,300 \\text{ Wh/kg}$ | $2,360 \\text{ Wh/L}$ | $\\sim 50\\%$ (Fuel cell) |
| **Lithium-Ion Battery (2024)** | $260 \\text{ Wh/kg}$ | $700 \\text{ Wh/L}$ | $\\sim 90\\%$ (Electric motor) |

### 2. Numerical Example: Electric Vehicle vs. Gas Car
- Gasoline car carrying $50\\text{ liters}$ of gas ($37\\text{ kg}$): Stores $450\\text{ kWh}$ of thermal energy. At $30\\%$ efficiency, delivers $135\\text{ kWh}$ of wheel work.
- Tesla Model S carrying $480\\text{ kg}$ battery pack: Stores $100\\text{ kWh}$ of electrical energy. At $90\\%$ efficiency, delivers $90\\text{ kWh}$ of wheel work.
*Electric motors are 3x more efficient, partially offsetting the battery mass penalty.*`,
      commonMisconceptions:
        `**MISCONCEPTION**: "Batteries will match jet fuel density in a few years with Moore's Law scaling."
**CORRECTION**: Moore's Law applies to semiconductor lithography, not chemistry. Chemical bonds and periodic table atomic weights impose hard thermodynamic ceilings.
**WHY THE CONFUSION HAPPENS**: People conflate computing exponential progress with chemical storage physics.

---

### If You Remember Only Five Things:
1. **Gravimetric vs. Volumetric**: Specific energy (Wh/kg) dictates weight; density (Wh/L) dictates size.
2. **Hydrocarbons are 45x denser than batteries**: Liquid fuels carry no oxidant mass and store energy in dense covalent bonds.
3. **Electric motor efficiency offsets battery weight**: Electric drives are ~90% efficient vs. ~30% for thermal combustion engines.
4. **Aviation is density-limited**: Long-haul commercial aircraft require high gravimetric specific energy.
5. **Periodic table limits chemistry**: Maximum cell voltage and molecular weight impose fundamental limits on battery capacity.`,
      example: "Commercial Boeing 777 jet fuel payload vs. electric battery weight constraints.",
    },
  });

  // =========================================================================
  // 3. CHAPTER 3: BIOLOGY & LIFE
  // =========================================================================
  const ch3 = await prisma.chapter.create({
    data: {
      slug: "biology-life",
      title: "Biology & Life",
      icon: "🧬",
      order: 3,
      description: "How living organisms maintain order, reproduce, and evolve across generations.",
      overview:
        "Biology is the study of matter organized to resist thermodynamic decay by processing information and energy across evolutionary timescales.",
    },
  });

  // CONCEPT 8: The Cell as the Unit of Life
  const cCell = await prisma.concept.create({
    data: {
      slug: "cells-and-living-order",
      title: "The Cell as the Unit of Life",
      chapterId: ch3.id,
      difficulty: "FOUNDATION",
      order: 1,
      oneLiner:
        "The fundamental membrane-bound structural and functional unit of all living organisms capable of autonomous metabolism and self-replication.",
      whyItMatters:
        "Understanding cellular compartmentalization, membrane potential, and molecular motors is the basis of all pharmacology, immunology, and bioengineering.",
      intuition:
        `### The Self-Maintaining Factory
Imagine a self-assembling chemical factory surrounded by a smart security barrier (the lipid membrane). 

The factory continuously intakes raw materials, burns energy currency (ATP), manufactures precision molecular tools (enzymes), repairs its own walls, and creates complete copies of itself.

### Analogy Boundary
A factory is designed by an external engineer. A biological cell is a self-organizing molecular system sculpted entirely by 3.8 billion years of natural selection.`,
      howItWorks:
        `### Step-by-Step Cellular Machinery
1. **Lipid Bilayer Compartmentalization**: Hydrophobic phospholipid tails self-assemble into a barrier, maintaining a separate internal chemical environment.
2. **Proton Gradient Charging**: Cellular respiration pumps protons ($H^+$) across the mitochondrial membrane, charging it like a chemical capacitor ($-140\\text{ mV}$).
3. **ATP Synthase Motor**: Protons flow back through the rotary motor protein ATP Synthase, generating ATP from ADP and phosphate.
4. **Enzymatic Catalysis**: Enzymes lower activation energy ($E_a$), driving metabolic reactions at biological temperatures.`,
      firstPrinciples:
        `### Cell Theory
1. All living organisms are composed of one or more cells.
2. The cell is the basic unit of structure and organization in organisms.
3. All cells arise from pre-existing cells via division.`,
      mathematicalModel:
        `### 1. Gibbs Free Energy of Cellular Reactions

$$\\Delta G = \\Delta H - T\\Delta S$$

- **$\\Delta G < 0$**: Spontaneous exergonic reaction (releases energy).
- **$\\Delta G > 0$**: Endergonic reaction (requires ATP coupling).

### 2. Electrochemical Membrane Potential (Nernst Equation):
$$V_{\\text{eq}} = \\frac{RT}{zF} \\ln\\left( \\frac{[\\text{Ion}]_{\\text{out}}}{[\\text{Ion}]_{\\text{in}}} \\right)$$`,
      commonMisconceptions:
        `**MISCONCEPTION**: "The cell cytoplasm is an open pool of watery soup."
**CORRECTION**: The cytoplasm is a densely crowded macromolecular gel packed with protein scaffolds and molecular motors moving on microtubule tracks.

---

### If You Remember Only Five Things:
1. **The cell is the atomic unit of biology**: Smallest entity exhibiting all properties of life.
2. **Membranes maintain non-equilibrium**: Lipid bilayers separate internal biochemistry from entropy decay.
3. **Proton gradients power ATP**: Mitochondria act as electrochemical capacitors.
4. **Enzymes accelerate kinetics**: Lower activation energy without altering chemical equilibrium.
5. **Information directed replication**: DNA directs protein synthesis via the genetic code.`,
      example: "Mitochondrial ATP synthase generating cellular energy currency.",
    },
  });

  // CONCEPT 9: DNA & The Genetic Code
  const cDNA = await prisma.concept.create({
    data: {
      slug: "dna-and-genetic-code",
      title: "DNA & The Genetic Code",
      chapterId: ch3.id,
      difficulty: "CORE",
      order: 2,
      oneLiner:
        "The molecular software of life: a double-helix polymer of nucleotide bases that encodes hereditary instructions for synthesizing proteins.",
      whyItMatters:
        "Deciphering DNA enables modern genomics, CRISPR gene editing, hereditary disease therapy, and synthetic biology.",
      intuition:
        `### The Digital Recipe Book
Think of DNA as a 3-billion-letter digital instruction manual written in a 4-character base-4 alphabet: **A, T, C, G**. 

Cellular machines read these letters in 3-letter words called **codons**. Each codon specifies one of 20 possible amino acid building blocks, folding into complex 3D molecular machines (proteins).`,
      howItWorks:
        `### The Central Dogma of Molecular Biology
$$\\text{DNA} \\xrightarrow{\\text{Transcription}} \\text{mRNA} \\xrightarrow{\\text{Translation}} \\text{Protein}$$
1. **Transcription**: RNA Polymerase reads a DNA gene template and transcribes a complementary messenger RNA (mRNA) strand.
2. **Ribosomal Translation**: Ribosomes read mRNA codons in triplets and recruit transfer RNA (tRNA) carrying corresponding amino acids.
3. **Protein Folding**: The linear amino acid chain folds into a precise 3D functional conformation governed by thermodynamic energy minimization.`,
      firstPrinciples:
        `### Information Invariance & Base Complementarity
- **Watson-Crick Base Pairing**: Adenine binds Thymine ($A=T$ with 2 hydrogen bonds); Cytosine binds Guanine ($C\\equiv G$ with 3 hydrogen bonds).
- **Template Replication**: Each separated single strand serves as an exact template for synthesizing a complementary strand.`,
      mathematicalModel:
        `### 1. Codon Combinatorics

$$4^3 = 64 \\text{ unique triplet codons} \\implies 20 \\text{ standard amino acids} + 3 \\text{ Stop signals}$$

- **Information Density**: DNA stores $2\\text{ bits}$ per base pair. The human genome contains $3.2 \\times 10^9 \\text{ bp} \\approx 800\\text{ MB}$ of digital genetic code.`,
      commonMisconceptions:
        `**MISCONCEPTION**: "One gene produces exactly one trait."
**CORRECTION**: Most traits are polygenic (governed by hundreds of interacting genes and environmental epigenetic factors).

---

### If You Remember Only Five Things:
1. **Base-4 digital storage**: DNA encodes information using A, T, C, G base pairs.
2. **Central Dogma**: Information flows from DNA to RNA to functional Protein.
3. **Triplet code redundancy**: 64 codons map to 20 amino acids, providing error resilience.
4. **Hydrogen bonding enables replication**: Complementary strands unzip and duplicate faithfully.
5. **Epigenetics modulates expression**: Chemical tags switch genes on and off without altering sequence.`,
      example: "CRISPR-Cas9 targeted genome editing.",
    },
  });

  // CONCEPT 10: How Life Maintains Order
  const cLifeOrder = await prisma.concept.create({
    data: {
      slug: "how-life-maintains-order",
      title: "How Life Maintains Order",
      chapterId: ch3.id,
      difficulty: "ADVANCED",
      order: 3,
      oneLiner:
        "How living organisms function as open non-equilibrium thermodynamic systems, continually importing low-entropy energy and exporting high-entropy heat to preserve internal biological order.",
      whyItMatters:
        "Provides the fundamental physical definition of life as a self-sustaining dissipative structure resisting thermodynamic equilibrium (death).",
      intuition:
        `### The Refrigerator Mental Model
A household refrigerator keeps its interior cool and orderly. It does not violate thermodynamics; it maintains a cold, organized interior by continuously consuming electrical power and exhausting diffuse, high-entropy thermal heat out the back into the kitchen.

A living organism is an open thermodynamic refrigerator: it maintains internal cellular order by consuming low-entropy chemical energy and radiating high-entropy heat to the universe.`,
      howItWorks:
        `### Step-by-Step Non-Equilibrium Thermodynamics:
1. **Solar Input**: Plants capture low-entropy visible photons ($T_{\\text{sun}} \\approx 5800\\text{ K}$) via photosynthesis.
2. **Metabolic Catabolism**: Herbivores consume plant carbohydrates, extracting chemical free energy to synthesize ATP.
3. **Entropy Export**: Biological work generates waste heat radiated as diffuse infrared photons ($T_{\\text{earth}} \\approx 300\\text{ K}$) into space.
4. **Net Universe Entropy Gain**: For every unit of internal order created, the organism exports multiple units of entropy to the surrounding environment.`,
      firstPrinciples:
        `### Non-Equilibrium Open System Thermodynamics (Prigogine)
$$\\frac{dS}{dt} = \\frac{d_i S}{dt} + \\frac{d_e S}{dt}$$
- **$d_i S / dt > 0$**: Internal entropy production from irreversible metabolic reactions.
- **$d_e S / dt < 0$**: Entropy flux exported to the external environment.
- **Steady State ($dS/dt = 0$)**: Occurs when $|d_e S / dt| = d_i S / dt$.`,
      mathematicalModel:
        `### 1. Entropy Balance Equation

$$\\Delta S_{\\text{total}} = \\Delta S_{\\text{organism}} + \\Delta S_{\\text{environment}} > 0$$

- **$\\Delta S_{\\text{organism}} < 0$** (Local decrease in biological entropy).
- **$\\Delta S_{\\text{environment}} \\gg 0$** (Vast increase in environmental entropy).`,
      commonMisconceptions:
        `**MISCONCEPTION**: "Life is a miracle that disobeys the Second Law of Thermodynamics."
**CORRECTION**: Life is an open dissipative structure that obeys thermodynamics completely by accelerating global entropy production.

---

### If You Remember Only Five Things:
1. **Life is an open thermodynamic system**: Continuous throughput of matter and energy.
2. **Order requires continuous work**: Equilibrium for an organism is biological death.
3. **Schrödinger's insight**: Life feeds on negative entropy by exporting thermal waste.
4. **Net universe entropy strictly increases**: Local biological order produces a larger external entropy gain.
5. **Dissipative structures**: Living cells self-organize far from thermodynamic equilibrium.`,
      example: "Photosynthetic biosphere converting solar photons into chemical order.",
    },
  });

  // =========================================================================
  // 4. CHAPTER 4: COMPLEX SYSTEMS & HUMAN BODY
  // =========================================================================
  const ch4 = await prisma.chapter.create({
    data: {
      slug: "complex-systems",
      title: "Complex Systems & Human Body",
      icon: "🕸️",
      order: 4,
      description: "How simple individual parts interact to produce unexpected collective behavior.",
      overview:
        "The world is full of interconnected networks where the collective macroscopic whole is qualitatively different from the sum of its isolated parts.",
    },
  });

  // CONCEPT 11: Feedback Loops & Cybernetics
  const cFeedback = await prisma.concept.create({
    data: {
      slug: "feedback-loops",
      title: "Feedback Loops & Cybernetics",
      chapterId: ch4.id,
      difficulty: "FOUNDATION",
      order: 1,
      oneLiner:
        "A circular causal mechanism where a system's output is routed back as an input, either stabilizing the system (negative feedback) or amplifying changes (positive feedback).",
      whyItMatters:
        "Feedback loops govern blood glucose regulation, climate tipping points, economic booms and busts, and algorithmic control systems.",
      intuition:
        `### Thermostat vs. Audio Screech
- **Negative Feedback (Stabilizer)**: A home thermostat. Room gets too cold $\\to$ heater turns on $\\to$ room warms $\\to$ heater turns off. Keeps system near setpoint.
- **Positive Feedback (Amplifier)**: A microphone held near a speaker. Whisper enters mic $\\to$ amplified through speaker $\\to$ re-enters mic $\\to$ deafening screech. Drives runaway exponential divergence.`,
      howItWorks:
        `### Step-by-Step Homeostatic Regulation (Blood Glucose):
1. **Disturbance**: Ingesting a meal raises blood glucose above $100\\text{ mg/dL}$.
2. **Sensor & Controller**: Pancreatic beta cells detect elevated glucose and secrete insulin.
3. **Actuator**: Insulin instructs liver and muscle cells to absorb glucose from the blood.
4. **Restoration**: Blood glucose drops back to baseline, shutting off insulin secretion.`,
      firstPrinciples:
        `### Closed-Loop Transfer Function (Black's Formula)
$$G(s) = \\frac{A}{1 + A\\beta}$$
- **$A$**: Open-loop system gain.
- **$\\beta$**: Feedback fraction.
- **$1 + A\\beta > 1$**: Negative feedback stabilizes output and dampens external noise.`,
      mathematicalModel:
        `### 1. First-Order Linear Feedback Differential Equation

$$\\frac{dx}{dt} = -k(x - x_0)$$

- Solution: $x(t) = x_0 + (x(0) - x_0)e^{-kt}$ (Exponential return to setpoint $x_0$).`,
      commonMisconceptions:
        `**MISCONCEPTION**: "Positive feedback is always good and negative feedback is bad."
**CORRECTION**: Negative feedback is essential for stability and life; uncontrolled positive feedback causes runaway crashes, panics, and cancer.

---

### If You Remember Only Five Things:
1. **Negative feedback stabilizes**: Dampens deviations to preserve steady-state homeostasis.
2. **Positive feedback amplifies**: Drives exponential growth or runaway divergence.
3. **Delays cause oscillations**: Time lag in feedback loops produces overshooting and instability.
4. **Homeostasis relies on negative loops**: Biological survival requires continuous error correction.
5. **Control theory is universal**: Applies to thermostats, physiology, economics, and robotics.`,
      example: "Thermostatic climate control and human insulin regulation.",
    },
  });

  // CONCEPT 12: Emergence
  const cEmergence = await prisma.concept.create({
    data: {
      slug: "emergence",
      title: "Emergence",
      chapterId: ch4.id,
      difficulty: "INTERMEDIATE",
      order: 2,
      oneLiner:
        "The spontaneous appearance of novel macroscopic behaviors and properties in a complex system that cannot be predicted by analyzing individual parts in isolation.",
      whyItMatters:
        "Explains how simple local rules create consciousness from neurons, market prices from traders, and flocking coordination from birds.",
      intuition:
        `### Wetness of Water
A single isolated water molecule ($H_2O$) is not wet. Wetness is an **emergent property** that only exists when billions of water molecules interact collectively at room temperature. 

No examination of a single molecule in a vacuum will ever reveal "wetness."`,
      howItWorks:
        `### Step-by-Step Emergence (Flocking Starlings / Boids):
1. **Rule 1 (Separation)**: Steer to avoid crowding local flockmates.
2. **Rule 2 (Alignment)**: Steer toward the average heading of local flockmates.
3. **Rule 3 (Cohesion)**: Steer toward the average position of local flockmates.
4. **Macroscopic Emergence**: Thousands of birds form breathtaking, fluid murmuration waves without any central leader or choreography.`,
      firstPrinciples:
        `### Anderson's Axiom: 'More Is Different' (Philip Anderson, 1972)
Reductionism (breaking things down to particles) does not imply constructionism (predicting the macroscopic behavior from particles). At each new level of scale, entirely new fundamental laws appear.`,
      mathematicalModel:
        `### 1. Non-Linear Interaction & Non-Additivity

$$\\Psi_{\\text{macro}}(\\mathbf{X}) \\neq \\sum_{i=1}^N \\psi_i(x_i)$$`,
      commonMisconceptions:
        `**MISCONCEPTION**: "Emergence requires a central leader or mysterious non-physical force."
**CORRECTION**: Emergence arises strictly from local, decentralized mathematical interactions between parts.

---

### If You Remember Only Five Things:
1. **More is different**: Whole is qualitatively different from the sum of parts.
2. **Decentralized coordination**: Complex patterns emerge without central leadership.
3. **Simple local rules create complexity**: Conway's Game of Life produces universal computation.
4. **Hierarchical scale breaks reductionism**: Higher-order systems require new conceptual laws.
5. **Examples are ubiquitous**: Consciousness, markets, traffic jams, and hurricanes.`,
      example: "Starling murmuration flocks and Conway's Game of Life.",
    },
  });

  // =========================================================================
  // 5. CHAPTER 5: SOCIETY, MONEY & MIND
  // =========================================================================
  const ch5 = await prisma.chapter.create({
    data: {
      slug: "society-money-mind",
      title: "Society, Money & Mind",
      icon: "🏛️",
      order: 5,
      description: "How incentives, institutions, exchange, and cognitive mechanics shape human life.",
      overview:
        "Human societies are decentralized networks governed by incentives, information asymmetry, institutional ledgers, and evolutionary cognitive architectures.",
    },
  });

  // CONCEPT 13: Incentives & Human Behavior
  const cIncentives = await prisma.concept.create({
    data: {
      slug: "needs-and-incentives",
      title: "Incentives & Human Behavior",
      chapterId: ch5.id,
      difficulty: "FOUNDATION",
      order: 1,
      oneLiner:
        "The structural rewards, costs, and psychological payoffs that motivate individuals to choose one course of action over another.",
      whyItMatters:
        "Every policy, corporate compensation plan, and social institution succeeds or fails based on whether its incentive architecture aligns with desired outcomes.",
      intuition:
        `### The Cobra Effect
A colonial government wanted to reduce the venomous cobra population in Delhi. They offered a cash bounty for every dead cobra brought in. 

Citizens realized they could breed cobras in their basements to collect endless bounties. When the government canceled the program, breeders released their worthless snakes, resulting in **more wild cobras than before**.

People respond to the actual incentives created, not the intended goal.`,
      howItWorks:
        `### Step-by-Step Incentive Dynamics:
1. **Payoff Gradient Established**: Rules assign rewards or penalties to actions.
2. **Strategic Optimization**: Agents alter behavior to maximize net payoff subject to constraints.
3. **Unintended Arbitrage**: Agents exploit discrepancies between the formal metric and real objective (Goodhart's Law).`,
      firstPrinciples:
        `### Expected Utility & Bounded Rationality
Agents maximize subjective expected utility $U = \\sum p_i u(x_i)$ under constraints of imperfect information.`,
      mathematicalModel:
        `### 1. Expected Utility & Payoff Optimization

$$U(\\mathbf{a}) = \\sum_{s \\in S} P(s | \\mathbf{a}) \\cdot u(s) - C(\\mathbf{a})$$`,
      commonMisconceptions:
        `**MISCONCEPTION**: "People act purely from direct financial selfishness."
**CORRECTION**: Incentives encompass social status, moral norms, belonging, and risk aversion.

---

### If You Remember Only Five Things:
1. **People respond to incentives**: Behavior follows payoffs, not intentions.
2. **Goodhart's Law**: When a measure becomes a target, it ceases to be a good measure.
3. **Cobra Effect**: Poorly designed incentives create perverse counterproductive outcomes.
4. **Second-order consequences matter**: Always ask "And then what happens?"
5. **Incentive design is governance**: Aligning payoffs with desired outcomes builds robust institutions.`,
      example: "Delhi cobra bounty program and Goodhart's Law.",
    },
  });

  // CONCEPT 14: Money & Mediums of Exchange
  const cMoney = await prisma.concept.create({
    data: {
      slug: "money-and-exchange",
      title: "Money & Mediums of Exchange",
      chapterId: ch5.id,
      difficulty: "CORE",
      order: 2,
      oneLiner:
        "A social coordination technology and shared ledger that functions as a medium of exchange, unit of account, and store of value.",
      whyItMatters:
        "Understanding money is required to understand banking, inflation, interest rates, capital allocation, and international trade.",
      intuition:
        `### The Double Coincidence of Wants
Without money, a dentist who wants bread must search for a baker who has a toothache and needs a filling. 

Money resolves this coordination friction: anyone can trade labor for a universally accepted token that any other participant accepts.`,
      howItWorks:
        `### Step-by-Step Monetary Ledger Evolution:
1. **Commodity Money**: Gold, salt, and shells with intrinsic utility.
2. **Representative Money**: Paper warehouse receipts backed 1:1 by gold vaults.
3. **Fiat Ledger**: State-issued currency accepted for tax settlements and legal tender.
4. **Digital Ledger**: Commercial bank electronic balances transferred via interbank clearing systems.`,
      firstPrinciples:
        `### Functions of Money
1. Medium of Exchange (Eliminates trade friction).
2. Unit of Account (Common pricing metric).
3. Store of Value (Transports purchasing power across time).`,
      mathematicalModel:
        `### 1. The Quantity Theory of Money (Equation of Exchange)

$$M \\cdot V = P \\cdot Y$$

- **$M$**: Money supply in circulation.
- **$V$**: Velocity of money (turnover rate).
- **$P$**: General price level (inflation index).
- **$Y$**: Real economic output (Real GDP).`,
      commonMisconceptions:
        `**MISCONCEPTION**: "Money must be backed by physical gold to have value."
**CORRECTION**: Fiat money derives value from collective institutional trust, legal tender enforceability, and sovereign tax liability.

---

### If You Remember Only Five Things:
1. **Money is a coordination ledger**: Solves the double coincidence of wants.
2. **Three core functions**: Medium of exchange, unit of account, store of value.
3. **Equation of exchange**: $M \\cdot V = P \\cdot Y$.
4. **Fiat is backed by state sovereignty**: Taxes establish baseline currency demand.
5. **Credit creation**: Commercial banks create new deposit money through loans.`,
      example: "Commercial banking fractional reserve credit expansion and central bank clearing.",
    },
  });

  // CONCEPT 15: The Demographic Transition Model
  const cDemo = await prisma.concept.create({
    data: {
      slug: "demographic-transition",
      title: "The Demographic Transition Model",
      chapterId: ch5.id,
      difficulty: "INTERMEDIATE",
      order: 3,
      oneLiner:
        "The historical transition from high birth and death rates to low birth and death rates as a society develops economically.",
      whyItMatters:
        "Explains global population growth trajectory, aging workforces, and the projected peak global population ceiling (~10.3 billion).",
      intuition:
        `### The 4-Stage Population Pipeline
1. **Stage 1 (Pre-Industrial)**: High birth rates + High death rates $\\implies$ Stable low population.
2. **Stage 2 (Sanitation & Medicine Boom)**: Death rates plunge, but birth rates remain high $\\implies$ **Massive population explosion**.
3. **Stage 3 (Urbanization & Education)**: Birth rates drop sharply as female education and urbanization rise $\\implies$ Growth slows.
4. **Stage 4 (Modern Equilibrium)**: Low birth rates + Low death rates $\\implies$ Population stabilizes and eventually ages.`,
      howItWorks:
        `### Step-by-Step Demographic Shift:
- **Mortality Decline**: Clean water, vaccines, and refrigeration reduce child mortality.
- **Lagged Fertility Response**: Cultural norms take 1–2 generations to adjust to higher child survival odds.
- **Economic Inversion**: Children transition from agricultural labor assets to urban education investment costs, reducing desired family size.`,
      firstPrinciples:
        `### Demographic Momentum & Logistic Dynamics
$$\\frac{dP}{dt} = r P \\left(1 - \\frac{P}{K}\\right)$$`,
      mathematicalModel:
        `### 1. Total Fertility Rate (TFR) Replacement Threshold

$$\\text{Replacement Level TFR} \\approx 2.1 \\text{ births per woman}$$

- **TFR $> 2.1$**: Growing population.
- **TFR $< 2.1$**: Aging, shrinking population (e.g. South Korea $\\approx 0.72$, Japan $\\approx 1.2$).`,
      commonMisconceptions:
        `**MISCONCEPTION**: "Human population will explode exponentially forever."
**CORRECTION**: Global fertility rates have dropped by over 50% since 1960. Global population is projected to peak in the late 21st century and stabilize or decline.

---

### If You Remember Only Five Things:
1. **Four distinct stages**: High equilibrium $\\to$ Death rate plunge $\\to$ Birth rate plunge $\\to$ Low equilibrium.
2. **Mortality drops before fertility**: The time lag causes the population surge.
3. **Urbanization drops birth rates**: Children become economic investments rather than farm hands.
4. **Replacement rate is 2.1**: Sub-replacement fertility drives population aging.
5. **Peak humanity is approaching**: Global population will peak this century, not grow infinitely.`,
      example: "South Korea demographic transition from 1960 to 2024.",
    },
  });

  // Connect Sources & Relationships cleanly
  const sSchroeder = await prisma.source.create({
    data: {
      title: "An Introduction to Thermal Physics",
      author: "Daniel V. Schroeder",
      type: "BOOK",
      description: "Foundational microstate multiplicity derivations and statistical thermodynamics.",
    },
  });

  await prisma.sourceConcept.create({
    data: {
      sourceId: sSchroeder.id,
      conceptId: cEntropy.id,
      relevance: "primary",
      contributionType: "mechanism",
      notes: "Chapters 2 & 3: Microstate multiplicity counting and Boltzmann entropy derivation.",
    },
  });

  const sFeynman = await prisma.source.create({
    data: {
      title: "The Feynman Lectures on Physics (Vol 1)",
      author: "Richard Feynman",
      type: "BOOK",
      description: "Conservation of energy and fundamental classical mechanics.",
    },
  });

  await prisma.sourceConcept.create({
    data: {
      sourceId: sFeynman.id,
      conceptId: cMatterEnergy.id,
      relevance: "primary",
      contributionType: "definition",
      notes: "Chapter 4: What is energy and conservation laws.",
    },
  });

  // Connections
  await prisma.connection.create({
    data: {
      sourceConceptId: cEntropy.id,
      targetConceptId: cLifeOrder.id,
      relationshipType: "DIRECT_PHYSICAL_CONNECTION",
      explanation:
        "Living organisms obey the Second Law of Thermodynamics by functioning as open systems that export entropy to maintain internal biological order.",
    },
  });

  await prisma.connection.create({
    data: {
      sourceConceptId: cEnergyDensity.id,
      targetConceptId: cElectricity.id,
      relationshipType: "APPLICATION",
      explanation:
        "Electrochemical energy density limits determine the feasibility of grid storage and transportation electrification.",
    },
  });

  await prisma.connection.create({
    data: {
      sourceConceptId: cEmergence.id,
      targetConceptId: cIncentives.id,
      relationshipType: "STRUCTURAL_ANALOGY",
      explanation:
        "Decentralized market prices emerge spontaneously from millions of individuals responding to local incentives.",
    },
  });

  // Questions
  await prisma.question.create({
    data: {
      question: "Why does time appear to move in only one direction?",
      chapterId: ch1.id,
      relatedConceptId: cEntropy.id,
      status: "EXPLORING",
      description: "Microscopic physical laws are time-reversible, yet the macroscopic universe exhibits a strict past-future arrow rooted in low-entropy initial Big Bang conditions.",
    },
  });

  await prisma.question.create({
    data: {
      question: "What physical limits prevent batteries from matching hydrocarbon energy density?",
      chapterId: ch2.id,
      relatedConceptId: cEnergyDensity.id,
      status: "EXPLORING",
      description: "Analyzing the molecular mass differences between self-contained intercalation batteries and open-atmosphere hydrocarbon combustion.",
    },
  });

  console.log("Successfully seeded all 15 master concepts to textbook standard!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
