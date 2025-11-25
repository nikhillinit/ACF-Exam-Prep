#!/usr/bin/env node

/**
 * Template Generator
 *
 * Generates markdown templates for ACF exam problems
 *
 * Usage:
 *   node scripts/generate-template.js --type Q1
 *   node scripts/generate-template.js --type Q2 --archetype A2A --output my-problem.md
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const options = {
  type: null,
  archetype: null,
  output: null,
  list: false
};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg === '--type' && args[i + 1]) {
    options.type = args[i + 1].toUpperCase();
    i++;
  } else if (arg === '--archetype' && args[i + 1]) {
    options.archetype = args[i + 1];
    i++;
  } else if (arg === '--output' && args[i + 1]) {
    options.output = args[i + 1];
    i++;
  } else if (arg === '--list') {
    options.list = true;
  } else if (arg === '--help' || arg === '-h') {
    printHelp();
    process.exit(0);
  }
}

function printHelp() {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║  Template Generator                                      ║
╚══════════════════════════════════════════════════════════╝

Usage:
  node scripts/generate-template.js [options]

Options:
  --type <Q1-Q4>        Question type (required unless --list)
  --archetype <code>    Archetype code (optional)
  --output <file>       Output filename (default: Q1-new.md)
  --list                List available templates
  --help, -h            Show this help message

Question Types:
  Q1 - Foundational concept (20 min, single archetype)
  Q2 - Multi-state problem (30 min, state-contingent)
  Q3 - Hybrid problem (40 min, multiple archetypes)
  Q4 - Comprehensive problem (45+ min, real options/valuation)

Examples:
  # Generate Q1 template
  node scripts/generate-template.js --type Q1

  # Generate Q2 with specific archetype
  node scripts/generate-template.js --type Q2 --archetype A2A-DebtOverhang

  # Generate with custom filename
  node scripts/generate-template.js --type Q3 --output my-new-problem.md
`);
}

function listTemplates() {
  console.log(`
Available Templates:
────────────────────────────────────────────────────────

Q1 - Foundational Concept Application (15-20 min)
  Archetypes: A1, A3, A4, A5, A6, B2
  Focus: Single concept, straightforward calculation
  Deviations: 1-2
  Example: Tax shield valuation, Beta unlevering

Q2 - Multi-Step with State Contingency (25-30 min)
  Archetypes: A2, A2A, A2B, C1
  Focus: State-contingent outcomes, decision-making
  Deviations: 2-3
  Example: Debt overhang, Asset substitution

Q3 - Complex Hybrid Problem (35-40 min)
  Archetypes: A1+A4, A2+A3, A1+A5
  Focus: Multiple archetypes, several deviations
  Deviations: 3-4
  Example: Capital structure with distress

Q4 - Comprehensive Application (45+ min)
  Archetypes: C1, C2, full valuation
  Focus: Real options, strategic flexibility
  Deviations: Various
  Example: Valuation with flexibility, M&A
`);
}

function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  Problem Template Generator                              ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  if (options.list) {
    listTemplates();
    return;
  }

  if (!options.type) {
    console.error('❌ Error: --type is required\n');
    printHelp();
    process.exit(1);
  }

  if (!['Q1', 'Q2', 'Q3', 'Q4'].includes(options.type)) {
    console.error(`❌ Error: Invalid type '${options.type}'. Must be Q1, Q2, Q3, or Q4\n`);
    process.exit(1);
  }

  // Set default output filename
  if (!options.output) {
    options.output = `${options.type}-new.md`;
  }

  // Copy template file
  const templateSource = path.join(__dirname, `../templates/${options.type}-template.md`);

  if (!fs.existsSync(templateSource)) {
    console.error(`❌ Error: Template file not found: ${templateSource}`);
    process.exit(1);
  }

  let content = fs.readFileSync(templateSource, 'utf8');

  // Replace archetype if specified
  if (options.archetype) {
    content = content.replace(/archetype: [^\n]+/, `archetype: ${options.archetype}`);
  }

  // Write to output file
  fs.writeFileSync(options.output, content);

  console.log(`✅ Template generated: ${options.output}`);
  console.log(`   Type: ${options.type}`);
  if (options.archetype) {
    console.log(`   Archetype: ${options.archetype}`);
  }
  console.log('\n📝 Next steps:');
  console.log('   1. Open the template in your editor');
  console.log('   2. Replace [placeholder text] with your content');
  console.log('   3. Fill in problem statement and solutions');
  console.log('   4. Run: node scripts/add-problem.js --input ' + options.output);
  console.log('\n✅ Done!\n');
}

main();
