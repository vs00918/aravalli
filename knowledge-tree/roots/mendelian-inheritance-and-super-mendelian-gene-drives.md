# Mendelian Inheritance vs. Super-Mendelian Gene Drive Mechanics

> **Axiomatic Kernel (Population Genetics)**: Under standard Mendelian inheritance, sexually reproducing diploid organisms transmit any specific heterozygous allele to exactly $50\%$ of their progeny. A CRISPR Gene Drive bypasses Mendelian segregation by converting heterozygous alleles into homozygous copies in the germline, achieving $>99\%$ inheritance and forcing an engineered trait through an entire wild population.

---

## 1. The Mathematical & Molecular Invariant

```mermaid
graph TD
    subgraph Classical Mendelian Inheritance [50% Allele Segregation]
        Parent1["Heterozygous Parent (A / a)"] -->|Standard Meiosis| Gamete1["50% Gametes Carry 'A'"]
        Parent1 -->|Standard Meiosis| Gamete2["50% Gametes Carry 'a'"]
        Gamete1 --> Dilution["Engineered Trait Dilutes in Wild Population"]
    end

    subgraph CRISPR Super-Mendelian Gene Drive [>99% Active Homology Repair]
        DriveParent["Gene Drive Heterozygote (Drive / Wild)"] -->|CRISPR-Cas9 Endonuclease Cut| WildCut["Cuts Target Site on Wild Chromosome"]
        WildCut -->|Homology-Directed Repair (HDR)| CopyPaste["Cell Copies Drive Construct into Cut Site"]
        CopyPaste --> Homozygous["Converts to Homozygote (Drive / Drive)"]
        Homozygous --> SuperInheritance[">99.5% Progeny Inherit Engineered Trait"]
    end
```

### The Population Genetics Mathematical Invariant
* **Hardy-Weinberg Equilibrium**: Under neutral selection, allele frequencies $p$ and $q$ remain constant ($p^2 + 2pq + q^2 = 1$). A fitness-reducing modification will naturally be purged by natural selection.
* **Gene Drive Bias ($d$)**: With a CRISPR endonuclease cutting the homologous wild chromosome in germline cells, the inheritance probability $P$ shifts from $0.5$ to:
\[
P = 0.5 + 0.5 \cdot e_c
\]
where $e_c$ is the homing endonuclease cleavage and repair efficiency ($e_c \approx 0.95-0.99$).
* Even if the payload slightly reduces organism fitness, the mathematical drive overcomes natural selection pressure, sweeping through wild populations in $10-20\text{ generations}$.

---

## 2. Tree Linkages
- **Trunk**: [[ecological-engineering-biocatalytic-cascades-and-irreversibility]], [[emergence-reductionism-and-informational-biology]]
- **Branches**: [[crispr-cas9-gene-drives-and-vector-parasitology]]
- **Leaves**: [[kurzgesagt-crispr-gene-drives-malaria]]
