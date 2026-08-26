/**
 * Banking Current Affairs — Presentation Normalization & Display Formatters
 * Pure functions for clean typography, LaTeX symbol normalization, and taxonomy display.
 */

/**
 * Normalizes raw text by stripping stray markdown artifacts, LaTeX tokens, and duplicated bullets.
 */
export function normalizePresentationText(text: string): string {
  if (!text) return "";

  let cleaned = text;

  // 1. Strip leading duplicated bullet characters (e.g. "•Policy Repo Rate", "* CRAR", "• CRAR")
  cleaned = cleaned.replace(/^[•\-\*]\s*/, "");

  // 2. Normalize common LaTeX math expressions to clean Unicode
  cleaned = cleaned
    .replace(/\$Q_1\$/g, "Q₁")
    .replace(/\$Q_2\$/g, "Q₂")
    .replace(/\$Q_3\$/g, "Q₃")
    .replace(/\$Q_4\$/g, "Q₄")
    .replace(/\$\\ge\s*(\d+)\$/g, "≥ $1")
    .replace(/\$\\ge\$/g, "≥")
    .replace(/\\ge\b/g, "≥")
    .replace(/\$\\le\s*(\d+)\$/g, "≤ $1")
    .replace(/\$\\le\$/g, "≤")
    .replace(/\\le\b/g, "≤")
    .replace(/\$\\to\$/g, "→")
    .replace(/\\to\b/g, "→")
    .replace(/\$\\pm\$/g, "±")
    .replace(/\\pm\b/g, "±")
    .replace(/\$\\approx\$/g, "≈")
    .replace(/\\approx\b/g, "≈")
    .replace(/\\%/g, "%");

  // 3. Remove remaining single-dollar LaTeX wrappers around simple terms e.g. "$5.25%$" -> "5.25%"
  cleaned = cleaned.replace(/\$([^$]+)\$/g, "$1");

  // 4. Clean stray backslashes before common punctuation
  cleaned = cleaned.replace(/\\([#*_`~])/g, "$1");

  return cleaned.trim();
}

/**
 * Maps institution and category IDs to clean human-readable study labels.
 * Never emits ugly internal strings like "OTHER / Banking & Regulation".
 */
export function formatTopicCategory(institution: string, category: string): string {
  const categoryNames: Record<string, string> = {
    BANKING_REGULATION: "Banking & Regulation",
    MONETARY_POLICY: "Monetary Policy",
    CAPITAL_MARKETS: "Capital Markets & SEBI",
    GOVERNMENT_SCHEMES: "Government Schemes",
    MACRO_ECONOMY: "Economy & Fiscal",
    DIGITAL_PAYMENTS: "Digital Payments & UPI",
    APPOINTMENTS: "Appointments",
    INSURANCE_SECTOR: "Insurance & IRDAI",
    PENSION_SYSTEMS: "Pensions & PFRDA",
    REPORTS_AND_INDICES: "Reports & Indices",
    DEFENCE_AND_SCIENCE: "Defence & Science",
    SPORTS_AND_AWARDS: "Sports & Awards",
    NATIONAL_AND_STATES: "National & States",
    INTERNATIONAL_AFFAIRS: "International Affairs"
  };

  const catLabel = categoryNames[category] || category.replace(/_/g, " ");

  // If institution is unclassified / generic / international body, show only the category
  if (!institution || institution === "OTHER" || institution === "INTERNATIONAL_BODIES") {
    return catLabel;
  }

  // If institution is specific (RBI, SEBI, IRDAI, PFRDA, NPCI, etc.), show "INSTITUTION · CATEGORY"
  return `${institution} · ${catLabel}`;
}

/**
 * Formats event date vs batch window accurately without implying fake exact dates.
 */
export function formatTopicDate(
  initialEventDate: string,
  chronologicalMonth: string,
  chronologicalWeek?: string
): string {
  // If the event has an exact date (not just 1st of month default)
  if (initialEventDate && !initialEventDate.endsWith("-01")) {
    return initialEventDate;
  }

  // Otherwise format as Month Week range (e.g. "Aug 2026 · Week 1–2")
  const [year, monthNum] = chronologicalMonth.split("-");
  const monthNames: Record<string, string> = {
    "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
    "05": "May", "06": "Jun", "07": "Jul", "08": "Aug",
    "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
  };
  const mName = monthNames[monthNum] || chronologicalMonth;

  if (chronologicalWeek && chronologicalWeek.includes("week-")) {
    const wNum = chronologicalWeek.replace("week-", "Week ").replace("-", "–");
    return `${mName} ${year} · ${wNum}`;
  }

  return `${mName} ${year}`;
}

/**
 * Returns a single clean, subtle contextual category label for reader surfaces.
 */
export function formatCleanCategory(category: string): string {
  const categoryNames: Record<string, string> = {
    BANKING_REGULATION: "Banking & Regulation",
    MONETARY_POLICY: "Monetary Policy",
    CAPITAL_MARKETS: "Capital Markets",
    GOVERNMENT_SCHEMES: "Government Schemes",
    MACRO_ECONOMY: "Economy & Fiscal",
    DIGITAL_PAYMENTS: "Digital Payments",
    APPOINTMENTS: "Appointments",
    INSURANCE_SECTOR: "Insurance",
    PENSION_SYSTEMS: "Pensions",
    REPORTS_AND_INDICES: "Reports & Indices",
    DEFENCE_AND_SCIENCE: "Defence & Science",
    SPORTS_AND_AWARDS: "Sports & Awards",
    NATIONAL_AND_STATES: "National & States",
    INTERNATIONAL_AFFAIRS: "International Affairs"
  };

  return categoryNames[category] || category.replace(/_/g, " ");
}
