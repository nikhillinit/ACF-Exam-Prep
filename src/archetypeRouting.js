// src/utils/archetypeRouting.js

/**
 * Hybrid-aware archetype routing helpers.
 *
 * Goals:
 * - Handle labels like:
 *     "A1-CapitalStructure"
 *     "A1-CapitalStructure + A2A-DebtOverhang"
 *     "A1 + A2A"
 * - Map them to a single "primary" slug for your /practice/:slug route.
 *
 * You control the slugs in ARCHETYPE_SLUGS below.
 */

// Matches A1, A2, A2A, A2B, A10, etc.
const ARCHETYPE_CODE_REGEX = /A\d{1,2}[A-Z]?/gi;

/**
 * Canonical mapping from short codes to practice slugs.
 *
 * Adjust these to match your actual practice routes.
 * Right now they mirror your staticGuidance keys / archetype names.
 */
export const ARCHETYPE_SLUGS = {
  A1: 'A1-CapitalStructure',
  A2: 'A2-MultiState',          // You can later split into A2A/A2B if desired
  A2A: 'A2A-DebtOverhang',      // Example — add when you create A2A pages
  A2B: 'A2B-AdverseSelection',  // Example
  A3: 'A3-CAPM',
  A4: 'A4-Payout',
  A5: 'A5-RealOptions',
  A6: 'A6-RiskManagement',
  A7: 'A7-Multiples',
  A8: 'A8-RealOptionsAdvanced',
  A9: 'A9-Diversification',
  A10: 'A10-Options'
};

/**
 * Extract all archetype codes from a raw label.
 *
 * Examples:
 *  "A1-CapitalStructure"                -> ["A1"]
 *  "A1-CapitalStructure + A2A-Overhang" -> ["A1", "A2A"]
 *  "A1 + A2A"                           -> ["A1", "A2A"]
 */
export function extractArchetypeCodes(rawLabel = '') {
  if (!rawLabel) return [];

  const matches = rawLabel.toUpperCase().match(ARCHETYPE_CODE_REGEX);
  if (!matches) return [];

  // Deduplicate while preserving order
  const seen = new Set();
  const codes = [];
  for (const m of matches) {
    const code = m.toUpperCase();
    if (!seen.has(code)) {
      seen.add(code);
      codes.push(code);
    }
  }
  return codes;
}

/**
 * Return the "primary" archetype code for routing.
 *
 * By default, this is just the first code we find.
 * If you ever want custom priority (e.g., A1 > A2A), this is the spot.
 */
export function getPrimaryArchetypeCode(rawLabel = '') {
  const codes = extractArchetypeCodes(rawLabel);
  if (codes.length === 0) return null;

  // Simple rule: first code wins.
  // You could add smarter tie-breaking here if needed.
  return codes[0];
}

/**
 * Map a raw label to a practice slug.
 *
 * - Returns null if it can't find a code.
 * - Uses ARCHETYPE_SLUGS as the source of truth.
 */
export function buildPracticeSlug(rawLabel = '') {
  const primaryCode = getPrimaryArchetypeCode(rawLabel);
  if (!primaryCode) return null;

  // If you haven't added the code to ARCHETYPE_SLUGS yet,
  // fall back to the code itself as a slug.
  return ARCHETYPE_SLUGS[primaryCode] || primaryCode;
}

/**
 * Build the actual /practice/:slug?mode=instant path.
 */
export function buildPracticePath(rawLabel = '') {
  const slug = buildPracticeSlug(rawLabel);
  if (!slug) return null;

  return `/practice/${encodeURIComponent(slug)}?mode=instant`;
}
