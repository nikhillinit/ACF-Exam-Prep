#!/usr/bin/env node

/**
 * CLI Tool: Batch Import Problems
 *
 * Processes multiple markdown files and imports them into the JSON database.
 *
 * Usage:
 *   node scripts/batch-import.js --dir ./new-problems
 *   node scripts/batch-import.js --dir ./new-problems --validate --enrich
 */

const fs = require('fs');
const path = require('path');

// Import parser
const { parseMarkdownProblem, validateProblem } = require('../src/utils/problemParser.js');

// Parse command-line arguments
const args = process.argv.slice(2);
const options = {
  dir: null,
  output: null,
  validate: true, // Default to true for batch operations
  enrich: false,
  dryRun: false
};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg === '--dir' && args[i + 1]) {
    options.dir = args[i + 1];
    i++;
  } else if (arg === '--output' && args[i + 1]) {
    options.output = args[i + 1];
    i++;
  } else if (arg === '--validate') {
    options.validate = true;
  } else if (arg === '--no-validate') {
    options.validate = false;
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
if (!options.dir) {
  console.error('❌ Error: --dir argument is required\n');
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
║  Batch Import - Process Multiple Markdown Files          ║
╚══════════════════════════════════════════════════════════╝

Usage:
  node scripts/batch-import.js [options]

Options:
  --dir <directory>   Directory containing markdown files (required)
  --output <file>     Path to output JSON file (default: guided_examples_v11.json)
  --validate          Validate each problem (default: true)
  --no-validate       Skip validation
  --enrich            Run deviation detection for each problem
  --dry-run           Show results without writing to file
  --help, -h          Show this help message

Examples:
  # Import all markdown files from directory
  node scripts/batch-import.js --dir ./new-problems

  # Import with enrichment
  node scripts/batch-import.js --dir ./new-problems --enrich

  # Dry run (preview only)
  node scripts/batch-import.js --dir ./new-problems --dry-run
`);
}

/**
 * Find all markdown files in directory
 */
function findMarkdownFiles(directory) {
  const files = [];

  function traverse(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.markdown'))) {
        files.push(fullPath);
      }
    }
  }

  traverse(directory);
  return files;
}

/**
 * Main execution
 */
async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  Batch Problem Import Tool                               ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // Step 1: Find markdown files
  console.log(`📁 Scanning directory: ${options.dir}`);

  if (!fs.existsSync(options.dir)) {
    console.error(`❌ Error: Directory not found: ${options.dir}`);
    process.exit(1);
  }

  const markdownFiles = findMarkdownFiles(options.dir);

  if (markdownFiles.length === 0) {
    console.log('⚠️  No markdown files found in directory');
    process.exit(0);
  }

  console.log(`✅ Found ${markdownFiles.length} markdown file(s)\n`);

  // Step 2: Process each file
  console.log('🔄 Processing files...\n');

  const results = {
    success: [],
    failed: [],
    skipped: []
  };

  for (const filePath of markdownFiles) {
    const filename = path.basename(filePath);
    process.stdout.write(`  📄 ${filename}... `);

    try {
      // Read and parse
      const content = fs.readFileSync(filePath, 'utf8');
      const problem = parseMarkdownProblem(content);

      // Validate if requested
      if (options.validate) {
        const validation = validateProblem(problem);
        if (!validation.valid) {
          console.log('❌ Validation failed');
          results.failed.push({
            file: filename,
            error: validation.errors.join('; ')
          });
          continue;
        }
      }

      // Enrich if requested
      if (options.enrich) {
        try {
          const { injectDeviationAlerts } = require('../src/utils/deviationInjector.js');
          const enriched = injectDeviationAlerts(problem);
          results.success.push({
            file: filename,
            problem: enriched,
            deviations: enriched.deviation_summary?.total_deviations || 0
          });
        } catch (error) {
          console.log('⚠️  Parsed but enrichment failed');
          results.success.push({
            file: filename,
            problem,
            deviations: 0
          });
        }
      } else {
        results.success.push({
          file: filename,
          problem,
          deviations: 0
        });
      }

      console.log('✅');
    } catch (error) {
      console.log(`❌ ${error.message}`);
      results.failed.push({
        file: filename,
        error: error.message
      });
    }
  }

  console.log('');

  // Step 3: Summary
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  Processing Summary                                      ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`✅ Success: ${results.success.length}`);
  console.log(`❌ Failed:  ${results.failed.length}`);
  console.log(`⚠️  Skipped: ${results.skipped.length}\n`);

  if (results.failed.length > 0) {
    console.log('Failed files:');
    results.failed.forEach(({ file, error }) => {
      console.log(`  ❌ ${file}: ${error}`);
    });
    console.log('');
  }

  if (results.success.length === 0) {
    console.log('⚠️  No problems to import');
    process.exit(1);
  }

  // Step 4: Add to JSON file
  if (options.dryRun) {
    console.log('🔍 Dry run - Problems that would be imported:');
    results.success.forEach(({ problem }) => {
      console.log(`  • ${problem.id} (${problem.archetype})`);
    });
    console.log('\n✅ Dry run complete. No files were modified.');
    return;
  }

  console.log(`📝 Adding ${results.success.length} problem(s) to: ${options.output}`);

  // Read existing JSON
  let jsonData;
  if (fs.existsSync(options.output)) {
    jsonData = JSON.parse(fs.readFileSync(options.output, 'utf8'));
  } else {
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

  // Add all problems
  let added = 0;
  let replaced = 0;

  results.success.forEach(({ problem }) => {
    const existingIndex = jsonData.worked_examples.findIndex(p => p.id === problem.id);

    if (existingIndex >= 0) {
      jsonData.worked_examples[existingIndex] = problem;
      replaced++;
    } else {
      jsonData.worked_examples.push(problem);
      added++;
    }
  });

  // Update metadata
  jsonData.metadata.total_examples = jsonData.worked_examples.length;
  jsonData.metadata.last_updated = new Date().toISOString();

  // Write to file
  fs.writeFileSync(options.output, JSON.stringify(jsonData, null, 2));

  console.log(`✅ Successfully updated database`);
  console.log(`   Added:    ${added} new problem(s)`);
  console.log(`   Replaced: ${replaced} existing problem(s)`);
  console.log(`   Total:    ${jsonData.metadata.total_examples} problem(s)\n`);

  // Step 5: Deviation statistics (if enriched)
  if (options.enrich) {
    const totalDeviations = results.success.reduce((sum, r) => sum + r.deviations, 0);
    const avgDeviations = (totalDeviations / results.success.length).toFixed(1);

    console.log('📊 Deviation Statistics:');
    console.log(`   Total detected: ${totalDeviations}`);
    console.log(`   Average per problem: ${avgDeviations}\n`);
  }

  console.log('✅ Batch import complete!\n');
}

// Run main function
main().catch(error => {
  console.error(`\n❌ Fatal error: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
});
