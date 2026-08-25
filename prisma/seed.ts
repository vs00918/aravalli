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
  // 1. CHAPTERS
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

  const ch2 = await prisma.chapter.create({
    data: {
      slug: "energy-technology",
      title: "Energy & Technology",
      icon: "⚡",
      order: 2,
      description: "How humans harvest, transform, store, and utilize energy across machines and grids.",
      overview:
        "Energy is the fundamental currency of physical work. Every technological civilization is constrained by the energy density of its fuels, the efficiency of its engines, and the laws of electrodynamics.",
    },
  });

  const ch3 = await prisma.chapter.create({
    data: {
      slug: "biology-life",
      title: "Biology & Life",
      icon: "🧬",
      order: 3,
      description: "How physical matter organizes into self-replicating, adaptive living systems.",
      overview:
        "Biology is chemistry animated by information. From cellular membranes to genetic code, living systems maintain local thermodynamic order by consuming environmental free energy.",
    },
  });

  const ch4 = await prisma.chapter.create({
    data: {
      slug: "complex-systems",
      title: "Complex Systems & Human Body",
      icon: "🧠",
      order: 4,
      description: "Non-linear dynamics, feedback regulation, networks, and emergent phenomena.",
      overview:
        "Complex systems are networks of interacting parts where the collective whole exhibits properties that cannot be deduced from the individual components in isolation.",
    },
  });

  const ch5 = await prisma.chapter.create({
    data: {
      slug: "society-money-mind",
      title: "Society, Money & Mind",
      icon: "🏛️",
      order: 5,
      description: "How human incentives, exchange, institutions, and population dynamics shape collective life.",
      overview:
        "Human societies are vast decentralized networks shaped by incentives, information asymmetry, institutional rules, and demographic transitions.",
    },
  });

  // GOLD-STANDARD CONCEPT 1: Entropy
  const cEntropy = await prisma.concept.create({
    data: {
      slug: "entropy",
      title: "Entropy",
      chapterId: ch1.id,
      difficulty: "INTERMEDIATE",
      order: 3,
      oneLiner:
        "Entropy measures how many microscopic arrangements can produce the larger-scale state we observe. In an isolated system, processes naturally drift toward the macroscopic state that corresponds to the overwhelmingly largest number of accessible microscopic configurations.",
      whyItMatters:
        "Understanding entropy unlocks the physical foundation for heat engines, refrigeration, chemical equilibrium, data compression limits, and why time has a fixed forward direction.",
      intuition:
        `### 0. The Physical Puzzle: Why Does Gas Spread?
Imagine a glass partition dividing a sealed, rigid box into two equal halves. The left half is filled with gas; the right half is a complete vacuum.

When you slide the partition open, the gas molecules immediately rush across the boundary until they are evenly spread throughout the entire box.

Why does this happen? There is no attractive force pulling molecules into the empty half. No molecule "knows" the right side is empty. Every molecule simply continues colliding and bouncing according to basic mechanical laws.

Yet, you will never in human history see all the gas molecules spontaneously gather back into the left half of the box. Why is the process strictly irreversible?

### 1. The Mental Model: Distinguishable Coins & Shuffled Cards
Imagine a brand new deck of playing cards arranged in pristine numerical order by suit. There is only **1 exact sequence** that is considered "perfectly sorted."

However, there are roughly $8 \\times 10^{67}$ possible ways to shuffle the cards into an unsorted arrangement. If you drop the deck onto the floor, the cards will land in an unsorted state—not because of a mysterious destructive force, but simply because unsorted configurations overwhelmingly outnumber sorted ones by an unfathomable ratio.

### 2. Where This Mental Model Stops Being Accurate
Playing cards sitting on a floor are completely static; they have no thermal energy and do not collide with one another. Gas molecules, by contrast, are in constant, violent motion, undergoing roughly $10^9$ elastic collisions per second at room temperature. This constant thermal agitation causes the gas system to continuously explore different microscopic configurations at immense speed.`,
      example:
        `**Everyday Observation**: A drop of blue ink spreading in a glass of clear water.
- **Analogy Boundary**: The ink spreading looks continuous to the eye, but beneath the surface it is driven by trillions of random water molecule collisions (Brownian motion) pushing ink molecules into the overwhelmingly larger volume of clear water.`,
      howItWorks:
        `### 3. Step-by-Step Causal Mechanism: The 10-Particle Toy Model

To understand exactly why systems drift toward equilibrium, consider a simplified container divided into a Left side ($L$) and a Right side ($R$), containing just **10 distinguishable gas particles** labeled A through J.

- A **Microstate** is the exact list of which specific particles are in which half (e.g. Particles A, B, C in Left; D through J in Right).
- A **Macrostate** is the total number of particles on the Left side ($N_L$), regardless of their individual identities.

The total number of possible microstates for 10 particles is:
$$2^{10} = 1024 \\text{ total microstates}$$

Let us count the number of microstates (the multiplicity $\\Omega$) for each macrostate using the binomial coefficient $\\binom{10}{N_L}$:

| Macrostate ($N_L$) | Multiplicity $\\Omega = \\binom{10}{N_L}$ | Probability | Physical State Description |
| :--- | :--- | :--- | :--- |
| **10 Left, 0 Right** | $\\binom{10}{10} = 1$ | $1 / 1024 \\approx 0.10\\%$ | All particles in original corner |
| **9 Left, 1 Right** | $\\binom{10}{9} = 10$ | $10 / 1024 \\approx 0.98\\%$ | Highly unbalanced |
| **8 Left, 2 Right** | $\\binom{10}{8} = 45$ | $45 / 1024 \\approx 4.39\\%$ | Unbalanced |
| **7 Left, 3 Right** | $\\binom{10}{7} = 120$ | $120 / 1024 \\approx 11.72\\%$ | Slight fluctuation |
| **6 Left, 4 Right** | $\\binom{10}{6} = 210$ | $210 / 1024 \\approx 20.51\\%$ | Near equilibrium |
| **5 Left, 5 Right** | $\\binom{10}{5} = 252$ | $252 / 1024 \\approx 24.61\\%$ | **Equilibrium (Even Spread)** |

---

### The Causal Sequence:
1. **Initial Non-Equilibrium State**: All particles start in Left ($N_L = 10$). Multiplicity $\\Omega = 1$.
2. **Thermal Agitation**: Particles bounce randomly between halves. Every microstate is equally likely.
3. **Statistical Inevitability**: Because there are 252 microstates for $(5L, 5R)$ and only 1 microstate for $(10L, 0R)$, the system is **252 times more likely** to be found near equilibrium than in the corner.
4. **Scaling to Avogadro Scale ($N = 10^{23}$)**: For a real mole of gas, the multiplicity of the 50/50 macrostate is $\\sim 2^{10^{23}}$. The probability of observing even a $0.001\\%$ spontaneous fluctuation away from uniform density is less than 1 in $10^{10^{20}}$—a statistical impossibility over the age of the universe.

---

### What Changes Microscopically vs. Macroscopically:
- **What moves?** Individual gas molecules with thermal kinetic velocity $v_{\\text{rms}} = \\sqrt{3k_B T / m}$.
- **Why does it move?** Thermal kinetic energy.
- **What changes microscopically?** The system continuously changes its specific microstate every femtosecond.
- **What changes macroscopically?** Density and pressure equalize throughout the volume; macroscopic observable properties become static.
- **What remains conserved?** Total energy $E$, total volume $V$, and total particle number $N$.`,
      firstPrinciples:
        `### 4. Foundational Axioms of Statistical Mechanics

1. **The Fundamental Assumption of the Microcanonical Ensemble**:
   For an isolated system in equilibrium with fixed energy $E$, volume $V$, and particle number $N$, **all accessible microstates are equally probable**. The laws of physics do not favor any single microstate over another.
2. **Microscopic Reversibility vs. Macroscopic Irreversibility**:
   The underlying laws of motion (Newtonian mechanics, Maxwell's electrodynamics, Schrödinger's wave mechanics) are time-reversible. If you instantaneously reversed the velocity vector of every single particle, the system would reassemble into the left corner. However, because equilibrium microstates outnumber non-equilibrium microstates by factors of $10^{10^{23}}$, spontaneous reversal is statistically impossible.

### Epistemic Categorization:
- **LAW**: The Second Law of Thermodynamics (for an isolated system, $\\Delta S \\ge 0$).
- **STATISTICAL RESULT**: Multiplicity $\\Omega$ peaks overwhelmingly at uniform spatial and thermal distribution.
- **MODEL**: The ideal gas microcanonical ensemble.
- **INTERPRETATION**: The thermodynamic arrow of time (the universe evolves from a low-entropy initial state at the Big Bang toward higher entropy).`,
      mathematicalModel:
        `### 1. What Question Is the Equation Answering?
*"How do we mathematically quantify microstate multiplicity so that entropy behaves as an extensive, additive physical property?"*

---

### 2. Derivation: Why the Logarithm Appears

Consider two completely independent physical systems, System A and System B:
- System A has $\\Omega_A$ accessible microstates.
- System B has $\\Omega_B$ accessible microstates.

Because the two systems are independent, the total number of composite microstates for the combined system $(A+B)$ is multiplicative:
$$\\Omega_{AB} = \\Omega_A \\times \\Omega_B$$

However, in thermodynamics, we demand that extensive physical properties (like mass, volume, and total energy) are **additive**:
$$S_{AB} = S_A + S_B$$

The unique continuous mathematical function that converts multiplication into addition is the **natural logarithm**:
$$\\ln(\\Omega_A \\cdot \\Omega_B) = \\ln \\Omega_A + \\ln \\Omega_B$$

Therefore, Ludwig Boltzmann defined statistical entropy as:
$$S = k_B \\ln \\Omega$$

$$S_{AB} = k_B \\ln(\\Omega_A \\Omega_B) = k_B \\ln \\Omega_A + k_B \\ln \\Omega_B = S_A + S_B$$

---

### 3. Variable Definitions & Units

| Symbol | Definition | Physical Units | Role |
| :--- | :--- | :--- | :--- |
| **$S$** | Thermodynamic / Statistical Entropy | $\\text{J}/\\text{K}$ (Joules per Kelvin) | Quantifies extensive phase space volume |
| **$k_B$** | Boltzmann Constant | $1.380649 \\times 10^{-23} \\text{ J}/\\text{K}$ | Bridges microscopic energy ($k_B T$) to macroscopic temperature |
| **$\\Omega$** | Microstate Multiplicity | Dimensionless integer | Number of quantum/classical microstates for a given macrostate |

---

### 4. The Thermodynamic Relation (Clausius Definition)

In classical macroscopic thermodynamics, Rudolf Clausius defined the infinitesimal change in entropy during a reversible heat transfer as:

$$dS = \\frac{\\delta Q_{\\text{rev}}}{T}$$

- **$\\delta Q_{\\text{rev}}$**: Infinitesimal heat energy added reversibly to the system (Joules, $\\text{J}$).
- **$T$**: Absolute thermodynamic temperature (Kelvin, $\\text{K}$).

**Physical Interpretation**: Adding heat energy $\\delta Q$ to a cold system ($T$ small) increases its microstate multiplicity dramatically (large $dS$), whereas adding the same heat to a hot system ($T$ large) creates a much smaller proportional increase in multiplicity.

---

### 5. Worked Numerical Calculation: Isothermal Free Expansion

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

  // GOLD-STANDARD CONCEPT 2: Matter & Energy
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
        "Understanding mass-energy equivalence ($E = mc^2$) and the First Law of Thermodynamics is the foundational basis of all chemistry, particle physics, nuclear energy, and astrophysics.",
      intuition:
        `### 0. The Physical Puzzle
Before 1905, physics treated matter and energy as two completely separate universes:
- Matter was made of physical atoms that had mass and could never be created or destroyed (Lavoisier's Law).
- Energy was an invisible property (heat, motion, electricity) that was also separately conserved (Joule's First Law).

If mass and energy were separate, why did a radioactive radium salt continuously glow and release heat without any chemical reaction taking place? Where was the energy coming from?

### 1. The Mental Model: Condensed Ice & Steam
Think of mass and energy like ice and steam. They look completely different, feel different, and obey different immediate mechanics, but both are made of the exact same underlying chemical substance ($H_2O$) in different physical states.

Albert Einstein's Special Relativity revealed that mass is simply **extremely concentrated, localized energy**. Mass can be converted into free energy (heat and radiation), and energetic fields can condense into physical particles.

### 2. Where This Analogy Stops Being Accurate
Ice and steam are physical molecular arrangements. Mass and energy are fundamental relativistic invariants of spacetime itself governed by the energy-momentum four-vector.`,
      example:
        `**Everyday Observation**: A compressed mechanical clock spring.
- When you wind a mechanical watch spring, you do physical work on it. Because that elastic potential energy is stored in the atomic bonds, the wound watch actually gains a tiny, measurable relativistic mass increase $\\Delta m = E / c^2 \\approx 10^{-14}\\text{ grams}$.`,
      howItWorks:
        `### 3. Step-by-Step Mechanism: Nuclear Mass Defect

1. **The Starting Parts**: A helium-4 nucleus ($^4\\text{He}$) consists of 2 protons and 2 neutrons.
2. **Weighing Free Particles**:
   - Mass of 2 free protons $= 2 \\times 1.00728\\text{ u} = 2.01456\\text{ u}$.
   - Mass of 2 free neutrons $= 2 \\times 1.00866\\text{ u} = 2.01732\\text{ u}$.
   - Total mass of uncombined parts $= 4.03188\\text{ u}$.
3. **Weighing the Bound Helium Nucleus**: When protons and neutrons are bound together, the helium nucleus weighs only **$4.00151\\text{ u}$**.
4. **The Missing Mass Defect ($\\Delta m$)**:
   $$\\Delta m = 4.03188\\text{ u} - 4.00151\\text{ u} = 0.03037\\text{ u} \\approx 5.04 \\times 10^{-29} \\text{ kg}$$
5. **Energy Release**: The missing mass was converted into nuclear binding energy ($E = \\Delta m c^2 = 28.3\\text{ MeV}$) and radiated away as energetic gamma rays during nuclear fusion.

- **What moved?** Nucleons assembled under the Strong Nuclear Force.
- **What changed microscopically?** Potential energy in the nuclear field decreased.
- **What changed macroscopically?** Measurable rest mass decreased; thermal kinetic energy was released.
- **What was conserved?** Total relativistic mass-energy.`,
      firstPrinciples:
        `### 4. Conservation Laws & Emmy Noether's Theorem

1. **Emmy Noether's First Theorem (1915)**:
   Every continuous mathematical symmetry of the laws of physics corresponds to an exact conservation law.
   - **Time Translation Symmetry** (the laws of physics are identical today, tomorrow, and a billion years ago) $\\implies$ **Conservation of Energy**.
   - **Spatial Translation Symmetry** (physics is identical in London and on Mars) $\\implies$ **Conservation of Linear Momentum**.
2. **Relativistic Invariant Mass**:
   $$E^2 = (pc)^2 + (m_0 c^2)^2$$
   For a stationary particle ($p = 0$), this reduces to $E = m_0 c^2$.`,
      mathematicalModel:
        `### 1. The Mass-Energy Equivalence Equation

$$E = mc^2$$

- **$E$**: Energy in Joules ($\\text{J} = \\text{kg}\\cdot\\text{m}^2/\\text{s}^2$).
- **$m$**: Rest mass in kilograms ($\\text{kg}$).
- **$c$**: Speed of light in vacuum ($2.99792458 \\times 10^8 \\text{ m/s}$).

---

### 2. Numerical Calculation: Energy in 1 Gram of Matter
Convert $1\\text{ gram}$ ($10^{-3}\\text{ kg}$) of matter entirely into energy:
$$E = (10^{-3}\\text{ kg}) \\times (2.998 \\times 10^8 \\text{ m/s})^2 = 10^{-3} \\times 8.988 \\times 10^{16} \\approx 8.99 \\times 10^{13} \\text{ Joules}$$
$$E \\approx 25 \\text{ million kilowatt-hours (kWh)}$$
*This is equivalent to burning approximately 3 million liters of commercial gasoline.*

---

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
1. *Where did the kinetic energy go when a fast-moving car brakes to a complete stop?*
2. *Why does a hot cup of tea weigh an imperceptibly tiny amount more than the same cup of tea after cooling down?*
3. *Why does Noether's theorem connect time translation symmetry with energy conservation?*`,
    },
  });

  // GOLD-STANDARD CONCEPT 3: Energy Density
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
        "Energy density is the primary engineering bottleneck determining which transport sectors can be electrified (passenger cars vs. long-haul transoceanic flight).",
      intuition:
        `### 0. The Aviation Payload Paradox
Imagine designing a commercial airliner carrying 300 passengers from London to Singapore:
- **Jet Kerosene**: A Boeing 777 carries $\\sim 100,000\\text{ kg}$ of jet fuel, containing roughly $1.2 \\text{ million kWh}$ of chemical energy.
- **Lithium-Ion Battery Equivalent**: To store $1.2 \\text{ million kWh}$ with state-of-the-art lithium batteries ($250\\text{ Wh/kg}$), the battery pack would weigh **$4,800,000\\text{ kg}$ (4,800 metric tons)**!

The airplane weighs only $\\sim 150$ tons empty. A 4,800-ton airplane cannot physically lift off the ground.

Gravimetric energy density dictates **what can fly**, while volumetric density dictates **what fits in your pocket** (smartphones).

### 1. Why Hydrocarbons Are Uniquely Dense
Hydrocarbon fuel is composed of concentrated carbon-hydrogen covalent bonds that burn atmospheric oxygen ($O_2$), meaning the airplane does not need to carry the oxidant mass on board. A battery is a self-contained electrochemical cell carrying all heavy cathode and anode host crystal matrices.`,
      example:
        `**Everyday Observation**: A Tesla Model S battery pack weighing $\\sim 480\\text{ kg}$ stores $100\\text{ kWh}$, whereas $\\sim 8\\text{ kg}$ of gasoline contains the equivalent chemical energy.`,
      howItWorks:
        `### 3. Step-by-Step Chemical vs. Electrochemical Mechanics

1. **Hydrocarbon Combustion**: Gasoline ($C_8H_{18}$) releases energy when strong $C=O$ and $O-H$ bonds form, breaking weaker $C-C$ and $C-H$ bonds. Specific energy $\\approx 12,000\\text{ Wh/kg}$.
2. **Lithium-Ion Intercalation**: Energy is stored by shuttling $Li^+$ ions between graphite and a heavy transition metal oxide lattice (e.g. $\\text{LiCoO}_2$). Specific energy $\\approx 250\\text{ Wh/kg}$.
3. **The Molecular Weight Penalty**: Lithium ions must be held inside heavy host crystal structures, imposing a severe gravimetric mass penalty.`,
      firstPrinciples:
        `### 4. Theoretical Maximum Electrochemical Potential
$$\\text{Specific Energy} = \\frac{n F E_{\\text{cell}}}{M_{\\text{active}}}$$
- **$n$**: Electrons transferred per reaction.
- **$F$**: Faraday constant ($96,485\\text{ C/mol}$).
- **$E_{\\text{cell}}$**: Cell potential voltage (Volts).
- **$M_{\\text{active}}$**: Combined molar mass of active reactants ($\text{kg/mol}$).

The periodic table sets fundamental limits: Lithium is the lightest solid element ($M = 6.94\\text{ g/mol}$), but the host transition metal oxides ($Co, Ni, Mn$) add heavy structural mass.`,
      mathematicalModel:
        `### 1. Comparative Energy Density Table

| Storage Medium | Gravimetric Specific Energy | Volumetric Energy Density | Round-Trip Efficiency |
| :--- | :--- | :--- | :--- |
| **Kerosene / Jet Fuel** | $12,000 \\text{ Wh/kg}$ | $9,500 \\text{ Wh/L}$ | $\\sim 35\\%$ (Thermal engine) |
| **Gasoline** | $12,200 \\text{ Wh/kg}$ | $8,800 \\text{ Wh/L}$ | $\\sim 30\\%$ (Thermal engine) |
| **Hydrogen (Liquid, -253°C)** | $33,300 \\text{ Wh/kg}$ | $2,360 \\text{ Wh/L}$ | $\\sim 50\\%$ (Fuel cell) |
| **Lithium-Ion Battery (2024)** | $260 \\text{ Wh/kg}$ | $700 \\text{ Wh/L}$ | $\\sim 90\\%$ (Electric motor) |

---

### 2. Numerical Example: Electric Vehicle vs. Gasoline Car
- Gasoline car carrying $50\\text{ liters}$ of gas ($37\\text{ kg}$): Stores $450\\text{ kWh}$ of thermal energy. At $30\\%$ engine efficiency, delivers $135\\text{ kWh}$ of mechanical wheel work.
- Tesla Model S carrying $480\\text{ kg}$ battery pack: Stores $100\\text{ kWh}$ of electrical energy. At $90\\%$ motor efficiency, delivers $90\\text{ kWh}$ of mechanical wheel work.
*Electric motors are 3x more efficient than combustion engines, which partially offsets the heavy battery mass penalty for ground vehicles.*`,
      commonMisconceptions:
        `**MISCONCEPTION**: "Batteries will match jet fuel density in a few years with Moore's Law scaling."
**CORRECTION**: Moore's Law applies to semiconductor lithography, not chemistry. Chemical bond energies and periodic table atomic weights impose hard thermodynamic ceilings.
**WHY THE CONFUSION HAPPENS**: People conflate computing exponential progress with chemical storage physics.

---

### If You Remember Only Five Things:
1. **Gravimetric vs. Volumetric**: Specific energy (Wh/kg) dictates weight; density (Wh/L) dictates size.
2. **Hydrocarbons are 45x denser than batteries**: Liquid fuels carry no oxidant mass and store energy in dense covalent bonds.
3. **Electric motor efficiency offsets battery weight**: Electric drives are ~90% efficient vs. ~30% for thermal combustion engines.
4. **Aviation is density-limited**: Long-haul commercial aircraft require high gravimetric specific energy.
5. **Periodic table limits chemistry**: Maximum cell voltage and molecular weight impose fundamental limits on battery capacity.

---

### Questions to Test Understanding:
1. *Why can passenger cars be electrified today, but long-haul commercial flights cannot?*
2. *Why is liquid hydrogen volumetric density lower than gasoline despite having 3x higher gravimetric specific energy?*
3. *Why does drawing oxygen from ambient air give combustion fuels a massive weight advantage over batteries?*`,
    },
  });

  // GOLD-STANDARD CONCEPT 4: Incentives & Human Behavior
  const cIncentives = await prisma.concept.create({
    data: {
      slug: "needs-and-incentives",
      title: "Incentives & Human Behavior",
      chapterId: ch5.id,
      difficulty: "FOUNDATION",
      order: 1,
      oneLiner:
        "Incentives are the structural rewards, penalties, and psychological payoffs that alter the relative costs and benefits of choices, motivating individuals to adapt their behavior.",
      whyItMatters:
        "Every economic policy, corporate compensation plan, legal statute, and social institution succeeds or fails based on whether its incentive architecture aligns with desired outcomes.",
      intuition:
        `### 0. The Question / Puzzle
Why can rewarding the exact behavior you want sometimes make the ultimate outcome dramatically worse?

If a school pays teachers bonuses based on student test scores, why does real student learning frequently decline? If a hospital penalizes emergency rooms for patient wait times, why do patient mortality rates rise?

### 1. Build the Mental Model: The Cobra Effect
During British colonial rule in Delhi, the government wanted to eradicate venomous cobras. They established a cash bounty for every dead cobra delivered to government offices.

Initially, citizens hunted wild cobras and turned them in. But resourceful citizens soon realized a more lucrative strategy: **they began breeding cobras in their basements to collect steady bounties**.

When the government discovered the fraud and canceled the bounty program, the breeders released their worthless snakes into the streets, resulting in **more wild cobras than existed before the policy began**.

### 2. The Critical Distinctions:
- **Incentive**: An external change in payoffs (financial bounty, tax penalty, promotion).
- **Constraint**: Physical, legal, or financial limits on available actions (budget ceiling, 24 hours in a day).
- **Preference**: An internal subjective ranking of outcomes (taste for leisure, risk tolerance).
- **Intrinsic Motivation**: Engaging in an activity for its inherent satisfaction without external reward.
- **Social Norm**: Unwritten community expectations enforced by reputation and social approval.`,
      example:
        `**Real-World Metric Optimization**: A customer service department rewards employees solely on "Average Call Handling Time" (shorter calls = bonus). 
- *Employee Adaptation*: Workers hang up on complex customer issues after 90 seconds to preserve their metric, destroying customer satisfaction while achieving 100% bonus targets.`,
      howItWorks:
        `### 3. Step-by-Step Causal Chain: The Anatomy of Metric Gaming

\`\`\`
1. Institution Establishes Target Metric (M) intended as a proxy for Goal (G)
                ↓
2. Metric Changes Relative Payoffs of Available Actions
                ↓
3. Agents Discover Shortcuts that Maximize (M) without Improving (G)
                ↓
4. Agents Shift Cognitive & Physical Effort Toward the Metric Shortcut
                ↓
5. Measured Metric (M) Rises while Real Objective (G) Collapses
\`\`\`

---

### Goodhart's Law & Campbell's Law
- **Goodhart's Law**: *"When a measure becomes a target, it ceases to be a good measure."*
- **Campbell's Law**: *"The more any quantitative social indicator is used for social decision-making, the more subject it will be to corruption pressures and the more apt it will be to distort and corrupt the social processes it is intended to monitor."*`,
      firstPrinciples:
        `### 4. Axiomatic Foundations: Expected Utility & Bounded Rationality

1. **Choice Under Uncertainty (Expected Utility)**:
   Whenever humans choose between uncertain actions, they implicitly compare two factors:
   - How likely each outcome is ($P(x)$).
   - How valuable or painful that outcome would be ($u(x)$).
2. **Bounded Rationality (Herbert Simon)**:
   Humans do not possess infinite computing power, complete information, or perfect foresight. Instead of calculating a global optimum, individuals **satisfice**—they search locally for rules and behaviors that meet their immediate payoff thresholds within their cognitive and institutional constraints.`,
      mathematicalModel:
        `### 1. What Question Is the Equation Answering?
*"How do we mathematically quantify how a rational agent evaluates actions with uncertain outcomes?"*

---

### 2. The Expected Utility Equation (von Neumann–Morgenstern)

$$\\text{EU}(a) = \\sum_{s \\in S} P(s | a) \\cdot u(s) - C(a)$$

- **$\\text{EU}(a)$**: Expected utility of taking action $a$.
- **$P(s | a)$**: Probability that state $s$ occurs given action $a$ ($0 \\le P \\le 1$, with $\\sum P = 1$).
- **$u(s)$**: Subjective utility (satisfaction or payoff) of outcome state $s$.
- **$C(a)$**: Direct cost or effort required to execute action $a$.

---

### 3. Worked Numerical Decision Example: The Asymmetric Executive Bonus

Consider a hedge fund manager deciding between two investment strategies:
- **Strategy 1 (Safe Investment)**: $100\\%$ probability of making ₹50,000 profit for the fund.
  $$\\text{EU}(\\text{Safe}) = 1.0 \\times 50,000 = ₹50,000$$
- **Strategy 2 (Reckless Speculative Bet)**: 
  - $20\\%$ chance of making ₹500,000 profit.
  - $80\\%$ chance of losing ₹200,000 for the fund.
  $$\\text{Expected Fund Return} = (0.2 \\times 500,000) + (0.8 \\times -200,000) = 100,000 - 160,000 = -₹60,000 \\quad (\\text{Destructive!})$$

#### The Incentive Distortion (Moral Hazard):
Suppose the manager's contract pays a **$20\\%$ performance bonus on positive gains**, but the fund bears $100\\%$ of all losses:
- Manager's Personal Payoff on Strategy 1: $1.0 \\times (0.2 \\times 50,000) = ₹10,000$.
- Manager's Personal Payoff on Strategy 2: $(0.2 \\times 100,000) + (0.8 \\times 0) = ₹20,000$.

**Result**: The manager's personal expected utility on the destructive bet (₹20,000) is **double** that of the safe bet (₹10,000). The asymmetric incentive structure rationally induces the manager to bankrupt the company.

---

### 4. What the Equation Does NOT Tell Us:
- It assumes probabilities and utilities are known; in reality, humans suffer from **Prospect Theory biases** (loss aversion, overweighting small probabilities, and hyperbolic time discounting).`,
      commonMisconceptions:
        `**MISCONCEPTION**: "People act purely from direct monetary selfishness."
**CORRECTION**: Human incentives encompass social status, reputation, fairness norms, belonging, and risk avoidance.
**WHY THE CONFUSION HAPPENS**: Standard introductory economics textbooks simplify models to "Homo economicus."

---

**MISCONCEPTION**: "Offering higher monetary rewards always improves performance."
**CORRECTION**: Financial incentives can **crowd out intrinsic motivation** (the Titmuss blood donation paradox). When a fine was introduced for parents picking up children late from daycare, late pickups *increased* because parents treated the fine as a price that bought permission to be late, removing moral guilt.

---

### If You Remember Only Five Things:
1. **People respond to incentives, not intentions**: Behavior aligns with actual payoffs, not policy goals.
2. **Goodhart's Law**: When a metric becomes a target, it ceases to be a reliable metric.
3. **Cobra Effect**: Poorly designed incentives create perverse, counterproductive adaptations.
4. **Asymmetric payoffs induce moral hazard**: Rewarding upside while insulating from downside causes reckless risk-taking.
5. **Intrinsic motivation can be crowded out**: Adding financial rewards can destroy moral and social norms.

---

### Questions to Test Understanding:
1. *A software company rewards engineers based on the number of lines of code written. Predict two ways engineers will adapt without writing better software.*
2. *Why did late daycare pickups increase after a financial late fee was introduced?*
3. *How does bounded rationality differ from standard expected utility maximization?*`,
    },
  });

  // GOLD-STANDARD CONCEPT 5: Money & Mediums of Exchange
  const cMoney = await prisma.concept.create({
    data: {
      slug: "money-and-exchange",
      title: "Money & Mediums of Exchange",
      chapterId: ch5.id,
      difficulty: "CORE",
      order: 2,
      oneLiner:
        "Money is a social coordination technology and shared accounting ledger that functions as a universally accepted medium of exchange, a unit of account, and a store of value.",
      whyItMatters:
        "Understanding money is essential for understanding banking, inflation, interest rates, capital allocation, sovereign debt, and global trade networks.",
      intuition:
        `### 0. The Question / Puzzle
Why do 8 billion human beings willingly give away physical goods, wheat, cars, and 40 hours of hard weekly labor in exchange for rectangular pieces of colored paper or digital numbers displayed on a computer screen?

### 1. Build the Mental Model: The Double Coincidence of Wants
Imagine a world with direct barter:
- You are a dentist who needs a loaf of bread.
- You visit a baker, but the baker has perfect teeth and needs a shoemaker.
- You must find a shoemaker who has a toothache, fix their tooth in exchange for shoes, and then take the shoes to the baker to buy bread.

This friction is the **Double Coincidence of Wants**. Barter requires both parties to simultaneously desire what the other holds.

Money is the coordination technology that solves this problem: anyone can exchange goods or labor for a universally accepted token, knowing that every other network participant will accept it in the future.

### 2. The Three Core Functions of Money:
1. **Medium of Exchange**: Eliminates barter search friction.
2. **Unit of Account**: Provides a common denominator to compare the economic value of apples, houses, and legal services.
3. **Store of Value**: Transports purchasing power across time into the future.`,
      example:
        `**Everyday Observation**: Using a debit card or UPI to instantly transfer digital ledger balances to buy coffee across town without transporting physical commodities.`,
      howItWorks:
        `### 3. Step-by-Step Evolution of Monetary Ledgers

1. **Commodity Money**: Physical goods with intrinsic utility (gold, silver, salt, cowrie shells).
2. **Representative Money**: Paper warehouse deposit receipts backed 1:1 by gold in vault storage.
3. **Fiat Currency**: State-issued paper notes declared legal tender and accepted for sovereign tax obligations.
4. **Commercial Bank Deposits**: Digital electronic balances created through bank lending.
5. **Central Bank Digital Settlement Rails**: Instant gross settlement networks (Fedwire, RTGS, UPI).

---

### How Commercial Banks Actually Create Money: The Balance Sheet Mechanism

Popular belief assumes that banks take savings deposits from savers and lend those exact funds to borrowers. **This is factually incorrect.** 

According to central banks (Bank of England, Federal Reserve, Deutsche Bundesbank), **commercial banks create new money out of thin air when they make a loan**.

#### Worked Numerical Balance Sheet Example:
Suppose a commercial bank approves a **₹10,00,000 home loan** for a borrower:

\`\`\`
                     COMMERCIAL BANK BALANCE SHEET
───────────────────────────────────────────────────────────────────────
ASSETS (+ What the Bank Owns)        │ LIABILITIES (+ What the Bank Owes)
─────────────────────────────────────┼─────────────────────────────────
+₹10,00,000 (Loan Contract Receivable)│ +₹10,00,000 (New Customer Deposit Balance)
                                     │
\`\`\`

- **What happened?** The bank did NOT move cash out of a vault.
- The bank credited the customer's checking account with ₹10,00,000 (a new liability for the bank) in exchange for the signed loan contract (a new asset for the bank).
- **Result**: The broad money supply ($M_1$) in the economy has expanded by exactly ₹10,00,000. When the borrower repays the principal, that money is extinguished.

---

### Central Bank Base Money ($M_0$) vs. Commercial Bank Deposits ($M_1$)
- **Base Money ($M_0$)**: Physical cash plus central bank reserves (used strictly between commercial banks and the central bank for interbank settlement).
- **Broad Money ($M_1, M_2$)**: The digital commercial bank deposit balances used by everyday businesses and citizens for daily commerce.`,
      firstPrinciples:
        `### 4. Why Fiat Money Has Purchasing Power Without Commodity Backing

Why does a ₹500 or \$100 fiat bill have value if it cannot be redeemed for gold?
1. **Sovereign Tax Foundation (Chartalism)**: The sovereign government demands taxes payable strictly in its designated fiat token. If you do not pay, legal force ensues. This establishes a baseline national demand for the currency.
2. **Legal Tender Laws**: The state enforces contracts and debts in the national currency.
3. **Network Effects & Schelling Coordination**: Because everyone expects others to accept the currency tomorrow, it is individually rational to accept it today.`,
      mathematicalModel:
        `### 1. The Quantity Theory of Money (Equation of Exchange)

$$M \\cdot V = P \\cdot Y$$

- **$M$**: Total nominal money supply in circulation (currency units, e.g. ₹ or \$).
- **$V$**: Velocity of money (number of times an average unit of currency is spent per year).
- **$P$**: Aggregate price level index.
- **$Y$**: Real annual economic output (Real GDP).

---

### 2. Accounting Identity vs. Economic Theory:
- **As an Accounting Identity**: $M \\cdot V \\equiv P \\cdot Y$ is always 100% mathematically true by definition: Total Money Spent ($M \\cdot V$) must equal Total Nominal Value of Goods Purchased ($P \\cdot Y$).
- **As an Economic Theory (Monetarism)**: Milton Friedman asserted that velocity $V$ and output $Y$ are relatively stable in the long run, implying that sustained expansion of money supply $M$ must lead directly to proportional increases in price levels $P$ (inflation).

---

### 3. Worked Numerical Calculation: Why Velocity ($V$) Matters
Suppose an economy has:
- Money supply $M = ₹1,000\\text{ billion}$.
- Real output $Y = 100\\text{ million units of goods}$.
- Price per unit $P = ₹20,000$.
- Nominal GDP $= P \\cdot Y = ₹2,000\\text{ billion}$.

$$V = \\frac{P \\cdot Y}{M} = \\frac{2,000}{1,000} = 2.0 \\text{ turnovers per year}$$

#### What happens during a Financial Crisis (The Liquidity Trap)?
If the central bank doubles money supply to $M = ₹2,000\\text{ billion}$, but public panic causes velocity to collapse by half to $V = 1.0$:
$$P \\cdot Y = M \\cdot V = 2,000 \\times 1.0 = ₹2,000\\text{ billion}$$
*Total spending and price level remain completely flat because the drop in velocity fully neutralized the increase in money supply!*`,
      commonMisconceptions:
        `**MISCONCEPTION**: "Banks simply intermediate existing savings between depositors and borrowers."
**CORRECTION**: Commercial banks create new deposit money ex nihilo through double-entry balance sheet expansion whenever they extend loans.
**WHY THE CONFUSION HAPPENS**: Traditional simplified textbook fractional-reserve multiplier models imply lending is constrained strictly by preexisting deposits.

---

**MISCONCEPTION**: "Printing money automatically causes runaway inflation immediately."
**CORRECTION**: Inflation depends on the product $M \\cdot V$ relative to productive capacity $Y$. If money supply grows while velocity collapses (liquidity trap) or spare capacity exists, inflation may remain low.

---

### If You Remember Only Five Things:
1. **Money is a coordination ledger**: Solves the double coincidence of wants.
2. **Three core functions**: Medium of exchange, unit of account, store of value.
3. **Commercial banks create money through loans**: Expanding assets (loan) and liabilities (deposit) simultaneously.
4. **The Equation of Exchange**: $M \\cdot V = P \\cdot Y$ connects money, velocity, prices, and output.
5. **Fiat value rests on sovereign taxation & trust**: Taxes create fundamental baseline demand for national currency.

---

### Questions to Test Understanding:
1. *A commercial bank approves a ₹50 lakh business loan. What specific changes occur on the bank's balance sheet?*
2. *If the central bank doubles the money supply during a panic, why might inflation remain near zero?*
3. *Why can a fiat currency maintain purchasing power without being convertible into gold?*`,
    },
  });

  // Remaining Core Concepts (Chapters 1-4)
  const cAtoms = await prisma.concept.create({
    data: {
      slug: "atoms-and-subatomic-scale",
      title: "Atoms & The Subatomic Scale",
      chapterId: ch1.id,
      difficulty: "CORE",
      order: 2,
      oneLiner: "The fundamental microscopic building blocks of chemical matter, consisting of a dense nucleus of protons and neutrons surrounded by a quantum electron probability cloud.",
      whyItMatters: "The geometric structure of atomic electron shells determines all chemical bonding, electricity, materials science, pharmacology, and biological structures.",
      intuition: "Over 99.999% of an atom's volume is non-classical vacuum filled with quantum fields. Pauli exclusion prevents electrons from collapsing into the nucleus.",
      howItWorks: "Wave-particle duality and Schrödinger wave mechanics govern spatial probability distributions of electrons.",
      firstPrinciples: "Quantum Wave-Particle Duality and the Pauli Exclusion Principle.",
      mathematicalModel: "$$\\hat{H}\\psi = E\\psi$$",
      commonMisconceptions: "Electrons orbit the nucleus like miniature planets.",
      example: "Hydrogen 1s ground state wavefunction.",
    },
  });

  const cQuantum = await prisma.concept.create({
    data: {
      slug: "quantum-unitarity",
      title: "Quantum Unitarity & Information Conservation",
      chapterId: ch1.id,
      difficulty: "FRONTIER",
      order: 4,
      oneLiner: "The fundamental quantum mechanical law that total probability must always sum to exactly 1, meaning microscopic physical information is strictly conserved and never destroyed in the universe.",
      whyItMatters: "Unitarity guarantees microscopic reversibility and underlies the Black Hole Information Paradox.",
      intuition: "If you burn a diary, tracking every photon and smoke particle would allow running the quantum equations backward to reconstruct the exact text.",
      howItWorks: "Time evolution via unitary operators $U^\\dagger U = \\hat{I}$ preserves state inner products.",
      firstPrinciples: "Conservation of quantum probability and the No-Cloning theorem.",
      mathematicalModel: "$$U^\\dagger U = \\hat{I} \\quad \\text{and} \\quad S_{\\text{vN}} = -\\text{Tr}(\\rho \\ln \\rho)$$",
      commonMisconceptions: "Information is destroyed when matter falls into a black hole.",
      example: "Hawking radiation Page curve.",
    },
  });

  const cWhatIsEnergy = await prisma.concept.create({
    data: {
      slug: "what-is-energy",
      title: "What Is Energy?",
      chapterId: ch2.id,
      difficulty: "FOUNDATION",
      order: 1,
      oneLiner: "The quantifiable capacity of a physical system to perform mechanical work, produce heat, or generate radiation.",
      whyItMatters: "Energy governs the physical performance limits of all industrial manufacturing, global shipping, computation, heating, and electric flight.",
      intuition: "Universal block accounting balance that changes forms but remains constant in total sum.",
      howItWorks: "Mechanical work transfers energy between systems ($W = \\int \\mathbf{F} \\cdot d\\mathbf{r}$).",
      firstPrinciples: "First Law of Thermodynamics: Energy cannot be created or destroyed.",
      mathematicalModel: "$$W = \\int \\mathbf{F} \\cdot d\\mathbf{r} \\quad \\text{and} \\quad \\Delta U = Q - W$$",
      commonMisconceptions: "Consuming energy causes it to disappear.",
      example: "Hydroelectric dam power generation.",
    },
  });

  const cElectricity = await prisma.concept.create({
    data: {
      slug: "electricity",
      title: "Electricity & Charge Flow",
      chapterId: ch2.id,
      difficulty: "CORE",
      order: 2,
      oneLiner: "The physical movement and electrostatic potential of electric charges through conductive materials.",
      whyItMatters: "Electricity is the primary medium for transporting energy cleanly and instantaneously across continental power networks.",
      intuition: "Water pressure model: Voltage is pressure, Current is flow rate, Resistance is constriction.",
      howItWorks: "Electrons drift slowly while the electromagnetic field propagates through space at nearly light speed.",
      firstPrinciples: "Conservation of charge and Maxwell's equations.",
      mathematicalModel: "$$V = IR \\quad \\text{and} \\quad P = I^2 R$$",
      commonMisconceptions: "Electrons travel near the speed of light through copper wire.",
      example: "High-voltage continental transmission grids.",
    },
  });

  const cCell = await prisma.concept.create({
    data: {
      slug: "cells-and-living-order",
      title: "The Cell as the Unit of Life",
      chapterId: ch3.id,
      difficulty: "FOUNDATION",
      order: 1,
      oneLiner: "The fundamental membrane-bound structural and functional unit of all living organisms capable of autonomous metabolism and self-replication.",
      whyItMatters: "Understanding cellular mechanics is the foundation of all medicine, pharmacology, and bioengineering.",
      intuition: "Self-maintaining chemical factory with smart lipid bilayer security barriers.",
      howItWorks: "Lipid compartmentalization, proton gradient charging, and ATP synthase rotary motors.",
      firstPrinciples: "Cell Theory and non-equilibrium steady states.",
      mathematicalModel: "$$\\Delta G = \\Delta H - T\\Delta S$$",
      commonMisconceptions: "The cytoplasm is an open watery soup.",
      example: "Mitochondrial ATP synthase motor.",
    },
  });

  const cDNA = await prisma.concept.create({
    data: {
      slug: "dna-and-genetic-code",
      title: "DNA & The Genetic Code",
      chapterId: ch3.id,
      difficulty: "CORE",
      order: 2,
      oneLiner: "The molecular software of life: a double-helix polymer of nucleotide bases encoding hereditary instructions for synthesizing proteins.",
      whyItMatters: "Deciphering DNA enables modern genomics, CRISPR gene editing, and synthetic biology.",
      intuition: "Base-4 digital software instructions read in 3-letter triplet codons.",
      howItWorks: "Transcription into mRNA followed by ribosomal translation into 3D folded proteins.",
      firstPrinciples: "Watson-Crick base pairing and template-directed enzymatic replication.",
      mathematicalModel: "$$4^3 = 64 \\text{ codons encoding 20 standard amino acids}$$",
      commonMisconceptions: "One gene produces exactly one trait.",
      example: "CRISPR-Cas9 genome editing.",
    },
  });

  const cLifeOrder = await prisma.concept.create({
    data: {
      slug: "how-life-maintains-order",
      title: "How Life Maintains Order",
      chapterId: ch3.id,
      difficulty: "ADVANCED",
      order: 3,
      oneLiner: "How living organisms function as open non-equilibrium thermodynamic systems, continually importing low-entropy energy and exporting high-entropy heat to preserve internal biological order.",
      whyItMatters: "Provides the physical definition of life as a self-sustaining dissipative structure resisting thermodynamic equilibrium.",
      intuition: "Open thermodynamic refrigerator maintaining cold internal order by exhausting heat into the environment.",
      howItWorks: "Non-equilibrium open system thermodynamics: living systems export entropy faster than they produce it internally.",
      firstPrinciples: "Prigogine open-system thermodynamics: $dS/dt = d_i S/dt + d_e S/dt$.",
      mathematicalModel: "$$\\frac{dS}{dt} = \\frac{d_i S}{dt} + \\frac{d_e S}{dt}$$",
      commonMisconceptions: "Life violates the Second Law of Thermodynamics.",
      example: "Photosynthetic biosphere converting solar photons into chemical order.",
    },
  });

  const cFeedback = await prisma.concept.create({
    data: {
      slug: "feedback-loops",
      title: "Feedback Loops & Cybernetics",
      chapterId: ch4.id,
      difficulty: "FOUNDATION",
      order: 1,
      oneLiner: "A circular causal mechanism where a system's output is routed back as an input, either stabilizing the system (negative feedback) or amplifying changes (positive feedback).",
      whyItMatters: "Feedback loops govern blood glucose regulation, climate tipping points, economic booms and busts, and robotic control systems.",
      intuition: "Thermostat (stabilizing negative feedback) vs. audio microphone screech (runaway positive feedback).",
      howItWorks: "Sensors detect deviation from setpoint, triggering actuators to restore equilibrium.",
      firstPrinciples: "Cybernetics and closed-loop transfer functions.",
      mathematicalModel: "$$G(s) = \\frac{A}{1 + A\\beta}$$",
      commonMisconceptions: "Positive feedback is always good and negative feedback is bad.",
      example: "Human insulin and glucagon glucose regulation.",
    },
  });

  const cEmergence = await prisma.concept.create({
    data: {
      slug: "emergence",
      title: "Emergence",
      chapterId: ch4.id,
      difficulty: "INTERMEDIATE",
      order: 2,
      oneLiner: "The spontaneous appearance of novel macroscopic behaviors and properties in a complex system that cannot be predicted by analyzing individual parts in isolation.",
      whyItMatters: "Explains how simple local rules create consciousness from neurons, market prices from traders, and flocking from birds.",
      intuition: "A single water molecule is not wet; wetness emerges only from collective interaction.",
      howItWorks: "Local non-linear interaction rules producing spontaneous global self-organization.",
      firstPrinciples: "Anderson's Axiom: More is Different (1972).",
      mathematicalModel: "$$\\Psi_{\\text{macro}} \\neq \\sum_{i=1}^N \\psi_i$$",
      commonMisconceptions: "Emergence requires a central leader.",
      example: "Starling murmuration flocking and Conway's Game of Life.",
    },
  });

  const cDemo = await prisma.concept.create({
    data: {
      slug: "demographic-transition",
      title: "The Demographic Transition Model",
      chapterId: ch5.id,
      difficulty: "INTERMEDIATE",
      order: 3,
      oneLiner: "The historical transition from high birth and death rates to low birth and death rates as a society develops economically.",
      whyItMatters: "Explains global population growth trajectory, aging workforces, and the projected peak global population ceiling.",
      intuition: "4-stage pipeline: Pre-industrial $\\to$ Mortality decline boom $\\to$ Fertility response drop $\\to$ Modern aging equilibrium.",
      howItWorks: "Sanitation drops death rates before cultural norms adjust family size.",
      firstPrinciples: "Logistic population dynamics.",
      mathematicalModel: "$$\\frac{dP}{dt} = r P \\left(1 - \\frac{P}{K}\\right)$$",
      commonMisconceptions: "Human population will explode exponentially forever.",
      example: "South Korea demographic transition from 1960 to 2024.",
    },
  });

  // Sources
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
      sourceConceptId: cIncentives.id,
      targetConceptId: cEmergence.id,
      relationshipType: "STRUCTURAL_ANALOGY",
      explanation:
        "Selection in evolution resembles incentive-driven adaptation structurally, but the mechanism is different: organisms consciously respond to economic incentives, while natural selection operates through differential reproduction.",
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

  console.log("Successfully seeded all master concepts with 5 Gold-Standard nodes!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
