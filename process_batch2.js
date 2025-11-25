/**
 * Batch 2 Processing Script: Problems 57-112
 * Processes indices 56-111 from guided_examples_v11.json
 */

const fs = require('fs');
const path = require('path');

// Import the deviation injector
const { injectDeviationAlerts } = require('./src/utils/deviationInjector.js');

console.log('Starting Batch 2 processing (Problems 57-112)...\n');

// Read the source file
const sourcePath = path.join(__dirname, 'public', 'source-materials', 'guided_examples_v11.json');
const outputPath = path.join(__dirname, 'public', 'source-materials', 'batch2_enriched.json');

console.log(`Reading from: ${sourcePath}`);

let data;
try {
  const rawData = fs.readFileSync(sourcePath, 'utf8');
  data = JSON.parse(rawData);
} catch (error) {
  console.error('Error reading source file:', error.message);
  process.exit(1);
}

if (!data.worked_examples || !Array.isArray(data.worked_examples)) {
  console.error('Invalid data structure: expected worked_examples array');
  process.exit(1);
}

console.log(`Total problems in source: ${data.worked_examples.length}`);

// Extract batch 2: indices 56-111 (problems 57-112)
const batch = data.worked_examples.slice(56, 112);
console.log(`Extracted batch 2: ${batch.length} problems (indices 56-111)\n`);

// Process each problem
console.log('Processing problems with deviation detection...');
const startTime = Date.now();

const enrichedProblems = batch.map((problem, index) => {
  const problemNumber = 57 + index;
  process.stdout.write(`\rProcessing problem ${problemNumber}/112...`);

  try {
    return injectDeviationAlerts(problem);
  } catch (error) {
    console.error(`\nError processing problem ${problemNumber}:`, error.message);
    return problem; // Return original if processing fails
  }
});

console.log('\n\nProcessing complete!');

// Collect statistics
const stats = {
  processed: enrichedProblems.length,
  withDeviations: 0,
  totalTimeImpact: 0,
  deviationsByCode: {},
  severityCounts: { critical: 0, high: 0, medium: 0, low: 0 },
  problemsWithMultipleDeviations: 0
};

enrichedProblems.forEach((problem, index) => {
  if (problem.deviation_summary && problem.deviation_summary.total_deviations > 0) {
    stats.withDeviations++;
    stats.totalTimeImpact += problem.deviation_summary.total_time_impact_minutes || 0;

    // Count by severity
    const sevDist = problem.deviation_summary.severity_distribution;
    if (sevDist) {
      stats.severityCounts.critical += sevDist.critical || 0;
      stats.severityCounts.high += sevDist.high || 0;
      stats.severityCounts.medium += sevDist.medium || 0;
      stats.severityCounts.low += sevDist.low || 0;
    }

    // Count deviation codes
    problem.deviation_summary.deviation_codes.forEach(code => {
      stats.deviationsByCode[code] = (stats.deviationsByCode[code] || 0) + 1;
    });

    // Track problems with multiple deviations
    if (problem.deviation_summary.total_deviations > 1) {
      stats.problemsWithMultipleDeviations++;
    }
  }
});

const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);

// Save enriched batch
console.log(`\nSaving enriched batch to: ${outputPath}`);
try {
  fs.writeFileSync(
    outputPath,
    JSON.stringify({ worked_examples: enrichedProblems }, null, 2),
    'utf8'
  );
  console.log('✓ Batch 2 saved successfully!\n');
} catch (error) {
  console.error('Error saving output file:', error.message);
  process.exit(1);
}

// Display summary
console.log('═════════════════════════════════════════════════════');
console.log('BATCH 2 PROCESSING SUMMARY');
console.log('═════════════════════════════════════════════════════');
console.log(`Problems processed:              ${stats.processed}`);
console.log(`Problems with deviations:        ${stats.withDeviations} (${((stats.withDeviations/stats.processed)*100).toFixed(1)}%)`);
console.log(`Problems with 2+ deviations:     ${stats.problemsWithMultipleDeviations}`);
console.log(`Total time impact:               ${stats.totalTimeImpact.toFixed(1)} minutes`);
console.log(`Average time impact per problem: ${(stats.totalTimeImpact/stats.processed).toFixed(1)} minutes`);
console.log(`Processing time:                 ${processingTime} seconds`);
console.log('');
console.log('Severity Distribution:');
console.log(`  Critical: ${stats.severityCounts.critical}`);
console.log(`  High:     ${stats.severityCounts.high}`);
console.log(`  Medium:   ${stats.severityCounts.medium}`);
console.log(`  Low:      ${stats.severityCounts.low}`);
console.log('');

// Show top 10 most common deviations
const sortedDeviations = Object.entries(stats.deviationsByCode)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);

if (sortedDeviations.length > 0) {
  console.log('Top Deviation Codes Found:');
  sortedDeviations.forEach(([code, count]) => {
    console.log(`  ${code}: ${count} occurrences`);
  });
}
console.log('═════════════════════════════════════════════════════');

// Output JSON summary for programmatic use
const jsonSummary = {
  processed: stats.processed,
  withDeviations: stats.withDeviations,
  totalTimeImpact: Math.round(stats.totalTimeImpact * 10) / 10
};
console.log('\nJSON Summary:');
console.log(JSON.stringify(jsonSummary, null, 2));
