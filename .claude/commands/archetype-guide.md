Generate a comprehensive quick reference guide for an ACF exam archetype.

This command synthesizes information from multiple sources (archetype signals, keyword mappings, tier definitions, worked examples) into a single, actionable reference document.

Usage: node src/cli/archetype-guide.js <archetype-id> [options]

Arguments:
  <archetype-id>  - Required. One of: A1, A2A, A2B, A3, A4, A5, A6, A7, A8, A9, A10

Options:
  --no-examples         - Exclude worked examples from the guide
  --max-examples <n>    - Limit number of examples (default: 3)
  --format <type>       - Output format: markdown (default) or json
  --output <file>       - Save to file instead of printing to console

Examples:
  node src/cli/archetype-guide.js A1
  node src/cli/archetype-guide.js A2A --output guides/A2A-guide.md
  node src/cli/archetype-guide.js A3 --no-examples
  node src/cli/archetype-guide.js A1 --max-examples 5 --format json

Archetype Reference:
  A1   - Capital Structure (Tier 1, 15-25 pts)
  A2A  - Debt Overhang (Tier 1, 20-30 pts)
  A2B  - Adverse Selection (Tier 1)
  A3   - CAPM (Tier 1, 12-18 pts)
  A4   - Distress & Priority (Tier 1, 15-20 pts)
  A5   - Payout Policy (Tier 1)
  A6   - Risk Management (Tier 1)
  A7   - Valuation Multiples (Tier 2)
  A8   - Real Options (Tier 2)
  A9   - Diversification (Tier 2)
  A10  - Options Theory (Tier 2)

Output includes:
  - Archetype overview (tier, priority, time allocation, points)
  - Recognition keywords by strength (instant trigger, strong, moderate, weak)
  - Strong signal combinations (95%+ confidence patterns)
  - Hybrid patterns (common archetype combinations)
  - Resource mapping (Excel tabs, playbook slides, time strategy)
  - Worked examples with key insights and common mistakes
  - 5-step workflow (IDENTIFY → EXTRACT → MAP → EXECUTE → CHECK)
