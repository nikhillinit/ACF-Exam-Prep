#!/usr/bin/env node

/**
 * Problem Analysis CLI Tool
 *
 * Autonomously analyzes exam problems to detect archetypes, deviations,
 * and generate solution approaches with confidence scores.
 *
 * Usage: node src/cli/analyze-problem.js <problem-file> [options]
 *        node src/cli/analyze-problem.js --text "problem text" [options]
 */

const fs = require('fs').promises;
const path = require('path');
const problemAnalyzer = require('./utils/problemAnalyzer');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    process.exit(0);
  }

  const options = {
    problemText: null,
    problemFile: null,
    includeCalculations: true,
    includeExamples: true,
    includeDeviations: true,
    format: 'markdown',
    output: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--text' && args[i + 1]) {
      options.problemText = args[i + 1];
      i++;
    } else if (arg === '--no-calculations') {
      options.includeCalculations = false;
    } else if (arg === '--no-examples') {
      options.includeExamples = false;
    } else if (arg === '--no-deviations') {
      options.includeDeviations = false;
    } else if (arg === '--format' && args[i + 1]) {
      options.format = args[i + 1];
      i++;
    } else if (arg === '--output' && args[i + 1]) {
      options.output = args[i + 1];
      i++;
    } else if (!arg.startsWith('--') && !options.problemFile) {
      options.problemFile = arg;
    }
  }

  return options;
}

function showHelp() {
  console.log(`
ACF Problem Analyzer - Autonomous Analysis with Confidence Scoring
===================================================================

Analyzes exam problems to detect archetypes, identify deviations,
and generate solution approaches with calculations.

Usage:
  node src/cli/analyze-problem.js <problem-file> [options]
  node src/cli/analyze-problem.js --text "problem text..." [options]

Arguments:
  problem-file    Path to file containing problem text
  --text "..."    Problem text as string (alternative to file)

Options:
  --no-calculations   Exclude calculation suggestions
  --no-examples       Exclude similar worked examples
  --no-deviations     Skip deviation detection
  --format <type>     Output format: markdown (default), json
  --output <file>     Save to file instead of stdout
  -h, --help         Show this help message

Examples:
  # Analyze from file
  node src/cli/analyze-problem.js problem.txt

  # Analyze text directly
  node src/cli/analyze-problem.js --text "Firm L issues a bond..."

  # JSON output
  node src/cli/analyze-problem.js problem.txt --format json

  # Save to file
  node src/cli/analyze-problem.js problem.txt --output analysis.md

Output Includes:
  - Archetype detection with confidence scores (0-100%)
  - Detected deviations and warnings
  - Recommended solution approach (5-step workflow)
  - Suggested calculations and formulas
  - Resource mappings (Excel tabs, playbook slides)
  - Similar worked examples
  - Time allocation adjustments
`);
}

async function formatMarkdown(analysis) {
  const { problemText, analysis: detection, approach, calculations, similarExamples, confidence } = analysis;

  let output = '# Autonomous Problem Analysis Report\n\n';

  // Problem preview
  output += '## Problem\n\n';
  output += `${problemText}\n\n`;

  // Archetype detection
  output += '## Archetype Detection\n\n';
  output += `### Primary Archetype: **${approach.archetype.name}** (${approach.archetype.id})\n`;
  output += `- **Confidence**: ${approach.archetype.confidence}%\n`;
  output += `- **Tier**: ${approach.archetype.tier} (${approach.archetype.tier === 1 ? 'HIGH' : 'MEDIUM'} Priority)\n`;
  output += `- **Raw Score**: ${detection.archetypes.primary.rawScore}\n\n`;

  output += '### Matched Keywords:\n';
  detection.archetypes.primary.matchedKeywords.forEach(kw => {
    output += `- **${kw.keyword}** (weight: ${kw.weight})\n`;
  });
  output += '\n';

  if (detection.archetypes.isHybrid) {
    output += '### Hybrid Detection: YES ⚠️\n';
    output += `**Combination**: ${detection.archetypes.hybridCombination}\n\n`;
    output += '**Solving Sequence**:\n';
    output += `${approach.hybridHandling.solvingSequence}\n\n`;
  }

  // Secondary archetypes
  if (detection.archetypes.secondary.length > 0) {
    output += '### Secondary Candidates:\n';
    detection.archetypes.secondary.forEach(arch => {
      output += `- ${arch.id} - ${arch.archetype?.name}: ${Math.round(arch.confidence)}% confidence\n`;
    });
    output += '\n';
  }

  // Deviations
  if (detection.deviations && detection.deviations.total > 0) {
    output += '## Detected Deviations ⚠️\n\n';
    output += `**Total**: ${detection.deviations.total}\n`;
    output += `**Time Impact**: +${detection.deviations.totalTimeImpact} minutes\n\n`;

    detection.deviations.deviations.forEach(dev => {
      output += `### ${dev.name}\n`;
      output += `- **Code**: ${dev.code}\n`;
      output += `- **Severity**: ${dev.severity}\n`;
      output += `- **Time Impact**: +${dev.timeImpact} min\n`;
      output += `- **Description**: ${dev.description}\n`;
      if (dev.guidance) {
        output += `- **Guidance**: ${dev.guidance}\n`;
      }
      output += '\n';
    });
  }

  // Solution approach
  output += '## Recommended Solution Approach\n\n';
  output += '### Time Allocation\n';
  output += `- **Base Time**: ${approach.timeAllocation.base} minutes\n`;
  if (approach.timeAllocation.deviationAdjustment > 0) {
    output += `- **Deviation Adjustment**: +${approach.timeAllocation.deviationAdjustment} minutes\n`;
  }
  output += `- **Recommended Total**: ${approach.timeAllocation.recommended} minutes\n\n`;

  output += '### Resources\n';
  output += `- **Excel Tab**: ${approach.resources.excelTab || 'N/A'}\n`;
  if (approach.resources.playbookSlides.length > 0) {
    output += `- **Playbook Slides**: ${approach.resources.playbookSlides.join(', ')}\n`;
  }
  output += '\n';

  // Workflow
  output += '### 5-Step Workflow\n\n';
  Object.entries(approach.workflow).forEach(([key, step]) => {
    const stepNum = key.replace('step', '').replace('_', ' ').toUpperCase();
    output += `#### ${stepNum} (${step.time})\n`;
    output += `**Action**: ${step.action}\n\n`;
    output += '**Checklist**:\n';
    step.checklist.forEach(item => {
      output += `- [ ] ${item}\n`;
    });
    output += '\n';
  });

  // Calculations
  if (calculations && calculations.steps) {
    output += '## Suggested Calculations\n\n';
    output += '### Step-by-Step:\n';
    calculations.steps.forEach(step => {
      output += `${step}\n`;
    });
    output += '\n';

    if (calculations.formulas) {
      output += '### Key Formulas:\n';
      calculations.formulas.forEach(formula => {
        output += `- ${formula}\n`;
      });
      output += '\n';
    }
  }

  // Similar examples
  if (similarExamples.length > 0) {
    output += '## Similar Worked Examples\n\n';
    similarExamples.forEach((ex, idx) => {
      output += `### ${idx + 1}. ${ex.id}\n`;
      output += `${ex.problemText}\n\n`;

      if (ex.keyInsights && ex.keyInsights.length > 0) {
        output += '**Key Insights**:\n';
        ex.keyInsights.slice(0, 2).forEach(insight => {
          output += `- ${insight}\n`;
        });
        output += '\n';
      }
    });
  }

  // Warnings
  if (approach.warnings.length > 0) {
    output += '## Warnings & Pitfalls ⚠️\n\n';
    approach.warnings.forEach(warning => {
      output += `### [${warning.severity}] ${warning.message}\n`;
      if (warning.guidance) {
        output += `${warning.guidance}\n`;
      }
      output += '\n';
    });
  }

  output += '---\n';
  output += `**Analysis Date**: ${analysis.metadata.analyzedAt}\n`;
  output += `**Analysis Version**: ${analysis.metadata.analysisVersion}\n`;
  output += `**Overall Confidence**: ${Math.round(confidence)}%\n`;

  return output;
}

async function main() {
  try {
    const options = parseArgs();

    // Get problem text
    let problemText;
    if (options.problemText) {
      problemText = options.problemText;
    } else if (options.problemFile) {
      const filePath = path.resolve(options.problemFile);
      problemText = await fs.readFile(filePath, 'utf-8');
    } else {
      console.error('Error: Must provide either --text or a problem file');
      process.exit(1);
    }

    console.error('Analyzing problem...');

    // Run analysis
    const analysis = await problemAnalyzer.analyzeProblem(problemText, options);

    console.error(`✓ Analysis complete! Confidence: ${Math.round(analysis.confidence)}%`);

    // Format output
    let output;
    if (options.format === 'json') {
      output = JSON.stringify(analysis, null, 2);
    } else {
      output = await formatMarkdown(analysis);
    }

    // Write to file or stdout
    if (options.output) {
      const outputPath = path.resolve(options.output);
      const outputDir = path.dirname(outputPath);
      await fs.mkdir(outputDir, { recursive: true });
      await fs.writeFile(outputPath, output, 'utf-8');
      console.error(`✓ Analysis saved to: ${outputPath}`);
    } else {
      console.log(output);
    }
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
