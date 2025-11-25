#!/usr/bin/env node

/**
 * CLI Tool: Add Problem to JSON Database
 *
 * Converts markdown problem files to JSON and adds them to the guided examples database.
 *
 * Usage:
 *   node scripts/add-problem.js --input problem.md
 *   node scripts/add-problem.js --input problem.md --output guided_examples_v11.json
 *   node scripts/add-problem.js --input problem.md --validate --enrich
 */

const fs = require('fs');
const path = require('path');

// Import parser (using require for Node.js compatibility)
const { parseMarkdownProblem, validateProblem } = require('../src/utils/problemParser.js');

// Parse command-line arguments
const args = process.argv.slice(2);
const options = {
  input: null,
  output: null,
  validate: false,
  enrich: false,
  dryRun: false
};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg === '--input' && args[i + 1]) {
    options.input = args[i + 1];
    i++;
  } else if (arg === '--output' && args[i + 1]) {
    options.output = args[i + 1];
    i++;
  } else if (arg === '--validate') {
    options.validate = true;
  } else if (arg === '--enrich') {
    options.enrich = true;
  } else if (arg === '--dry-run') {
    options.dryRun = true;
  } else if (arg === '--help' || arg === '-h') {
    printHelp();
    process.exit(0);
  }
}

// Validate required arguments
if (!options.input) {
  console.error('❌ Error: --input argument is required\n');
  printHelp();
  process.exit(1);
}

// Set default output path
if (!options.output) {
  options.output = path.join(__dirname, '../public/source-materials/guided_examples_v11.json');
}

/**
 * Print help message
 */
function printHelp() {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║  Add Problem - Markdown to JSON Converter                ║
╚══════════════════════════════════════════════════════════╝

Usage:
  node scripts/add-problem.js [options]

Options:
  --input <file>      Path to markdown problem file (required)
  --output <file>     Path to output JSON file (default: guided_examples_v11.json)
  --validate          Run validation after conversion
  --enrich            Run deviation detection after conversion
  --dry-run           Show output without writing to file
  --help, -h          Show this help message

Examples:
  # Convert markdown to JSON and add to database
  node scripts/add-problem.js --input new-problem.md

  # Dry run (preview only)
  node scripts/add-problem.js --input new-problem.md --dry-run

  # Convert with validation
  node scripts/add-problem.js --input new-problem.md --validate

  # Convert, validate, and enrich with deviations
  node scripts/add-problem.js --input new-problem.md --validate --enrich

Markdown Format:
  ---
  archetype: A1-CapitalStructure
  difficulty: core
  time: 25
  ---

  # Problem Title
  Problem statement text...

  ## Part A
  Question for part A

  ### Solution
  **Reasoning:** Explanation...
  **Calculation:** Math work...
  **Answer:** Final answer

  ## Part B
  ...

  ## Key Insights
  - Insight 1
  - Insight 2

  ## Common Mistakes
  - Mistake 1
  - Mistake 2
`);
}

/**
 * Main execution
 */
async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  Problem Ingestion Tool                                  ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // Step 1: Read markdown file
  console.log(`📖 Reading markdown file: ${options.input}`);

  if (!fs.existsSync(options.input)) {
    console.error(`❌ Error: File not found: ${options.input}`);
    process.exit(1);
  }

  const markdownContent = fs.readFileSync(options.input, 'utf8');
  console.log(`✅ Read ${markdownContent.length} characters\n`);

  // Step 2: Parse markdown
  console.log('🔄 Parsing markdown to JSON...');

  let problem;
  try {
    problem = parseMarkdownProblem(markdownContent);
    console.log(`✅ Parsed problem: ${problem.id}`);
    console.log(`   Archetype: ${problem.archetype}`);
    console.log(`   Parts: ${problem.solution_steps.length}`);
    console.log(`   Time: ${problem.estimated_time_minutes} minutes\n`);
  } catch (error) {
    console.error(`❌ Error parsing markdown: ${error.message}`);
    process.exit(1);
  }

  // Step 3: Validate
  if (options.validate) {
    console.log('✅ Validating problem structure...');
    const validation = validateProblem(problem);

    if (!validation.valid) {
      console.error('❌ Validation failed:');
      validation.errors.forEach(err => console.error(`   - ${err}`));
      process.exit(1);
    }

    console.log('✅ Validation passed\n');
  }

  // Step 4: Enrich with deviations
  if (options.enrich) {
    console.log('🔄 Enriching with deviation detection...');

    try {
      const { injectDeviationAlerts } = require('../src/utils/deviationInjector.js');
      problem = injectDeviationAlerts(problem);

      const deviationCount = problem.deviation_summary?.total_deviations || 0;
      console.log(`✅ Detected ${deviationCount} deviation(s)\n`);
    } catch (error) {
      console.warn(`⚠️  Warning: Could not enrich with deviations: ${error.message}\n`);
    }
  }

  // Step 5: Add to JSON file
  if (options.dryRun) {
    console.log('🔍 Dry run - Preview of JSON output:\n');
    console.log(JSON.stringify(problem, null, 2));
    console.log('\n✅ Dry run complete. No files were modified.');
    return;
  }

  console.log(`📝 Adding problem to: ${options.output}`);

  // Read existing JSON
  let jsonData;
  if (fs.existsSync(options.output)) {
    jsonData = JSON.parse(fs.readFileSync(options.output, 'utf8'));
  } else {
    // Create new structure if file doesn't exist
    jsonData = {
      metadata: {
        schema_version: '11.0',
        description: 'ACF guided examples with structured solution steps',
        total_examples: 0,
        content_type: 'guided'
      },
      worked_examples: []
    };
  }

  // Check for duplicate ID
  const existingIndex = jsonData.worked_examples.findIndex(p => p.id === problem.id);

  if (existingIndex >= 0) {
    console.log(`⚠️  Problem with ID '${problem.id}' already exists. Replacing...`);
    jsonData.worked_examples[existingIndex] = problem;
  } else {
    jsonData.worked_examples.push(problem);
  }

  // Update metadata
  jsonData.metadata.total_examples = jsonData.worked_examples.length;
  jsonData.metadata.last_updated = new Date().toISOString();

  // Write to file
  fs.writeFileSync(options.output, JSON.stringify(jsonData, null, 2));

  console.log(`✅ Successfully added problem to database`);
  console.log(`   Total problems: ${jsonData.metadata.total_examples}`);
  console.log(`   File: ${options.output}\n`);

  // Summary
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  Summary                                                 ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`Problem ID:  ${problem.id}`);
  console.log(`Archetype:   ${problem.archetype}`);
  console.log(`Parts:       ${problem.solution_steps.length}`);
  console.log(`Time:        ${problem.estimated_time_minutes} minutes`);
  console.log(`Difficulty:  ${problem.difficulty}`);

  if (options.enrich && problem.deviation_summary) {
    console.log(`Deviations:  ${problem.deviation_summary.total_deviations}`);
  }

  console.log('\n✅ Done!\n');
}

// Run main function
main().catch(error => {
  console.error(`\n❌ Fatal error: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
});
