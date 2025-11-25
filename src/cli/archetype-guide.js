#!/usr/bin/env node

/**
 * Archetype Guide CLI Tool
 *
 * Generates comprehensive quick reference guides for ACF exam archetypes.
 *
 * Usage: node src/cli/archetype-guide.js <archetype-id> [options]
 *
 * Examples:
 *   node src/cli/archetype-guide.js A1
 *   node src/cli/archetype-guide.js A2A --no-examples
 *   node src/cli/archetype-guide.js A3 --output guides/A3-guide.md
 */

const fs = require('fs').promises;
const path = require('path');
const synthesizer = require('./synthesizers/archetypeSynthesizer');
const markdownFormatter = require('./formatters/markdownFormatter');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    process.exit(0);
  }

  const archetypeId = args[0].toUpperCase();
  const options = {
    includeExamples: true,
    maxExamples: 3,
    format: 'markdown',
    output: null
  };

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--no-examples') {
      options.includeExamples = false;
    } else if (arg === '--max-examples' && args[i + 1]) {
      options.maxExamples = parseInt(args[i + 1], 10);
      i++;
    } else if (arg === '--format' && args[i + 1]) {
      options.format = args[i + 1];
      i++;
    } else if (arg === '--output' && args[i + 1]) {
      options.output = args[i + 1];
      i++;
    }
  }

  return { archetypeId, options };
}

function showHelp() {
  console.log(`
ACF Archetype Guide Generator
==============================

Generate comprehensive quick reference guides for exam archetypes.

Usage:
  node src/cli/archetype-guide.js <archetype-id> [options]

Arguments:
  archetype-id    Archetype ID (A1, A2A, A2B, A3, A4, A5, A6, A7, A8, A9, A10)

Options:
  --no-examples         Exclude worked examples from guide
  --max-examples <n>    Maximum number of examples to include (default: 3)
  --format <type>       Output format: markdown (default), json
  --output <file>       Save to file instead of stdout
  -h, --help           Show this help message

Examples:
  node src/cli/archetype-guide.js A1
  node src/cli/archetype-guide.js A2A --no-examples
  node src/cli/archetype-guide.js A3 --output guides/A3-guide.md
  node src/cli/archetype-guide.js A1 --max-examples 5

Supported Archetypes:
  A1   - Capital Structure
  A2A  - Debt Overhang
  A2B  - Adverse Selection
  A3   - CAPM
  A4   - Distress & Priority
  A5   - Payout Policy
  A6   - Risk Management
  A7   - Valuation Multiples
  A8   - Real Options
  A9   - Diversification
  A10  - Options Theory
`);
}

async function main() {
  try {
    const { archetypeId, options } = parseArgs();

    console.error(`Generating guide for archetype ${archetypeId}...`);

    // Synthesize the guide
    const guideData = await synthesizer.synthesize(archetypeId, options);

    // Format output
    let output;
    if (options.format === 'json') {
      output = JSON.stringify(guideData, null, 2);
    } else {
      output = markdownFormatter.format(guideData);
    }

    // Write to file or stdout
    if (options.output) {
      const outputPath = path.resolve(options.output);
      const outputDir = path.dirname(outputPath);

      // Ensure output directory exists
      await fs.mkdir(outputDir, { recursive: true });

      await fs.writeFile(outputPath, output, 'utf-8');
      console.error(`✓ Guide saved to: ${outputPath}`);
    } else {
      console.log(output);
    }

    console.error(`✓ Guide generation complete!`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { main, parseArgs };
