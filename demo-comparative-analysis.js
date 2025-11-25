/**
 * Demonstration of Comparative Deviation Analysis Engine
 *
 * This script demonstrates the three new functions:
 * 1. inferCompApproach() - Infers high-level approach from archetype
 * 2. generateAdaptationGuidance() - Creates step-by-step adaptation guidance
 * 3. findClosestCompWithDivergenceAnalysis() - Full comparative analysis
 */

import {
  inferCompApproach,
  generateAdaptationGuidance,
  findClosestCompWithDivergenceAnalysis
} from './src/utils/problemMatcher.js';

console.log('='.repeat(60));
console.log('COMPARATIVE DEVIATION ANALYSIS ENGINE - DEMO');
console.log('='.repeat(60));

// ========================================
// TEST 1: inferCompApproach()
// ========================================
console.log('\n\n--- TEST 1: inferCompApproach() ---\n');

const compProblems = [
  { archetype: 'A1-CapitalStructure', deviations: ['DEV-1.1.1'] },
  { archetype: 'A3-CAPM', deviations: ['DEV-3.1.1'] },
  { archetype: 'A10-Options', deviations: ['DEV-10.1.1'] },
  { archetype: 'UNKNOWN-ARCHETYPE', deviations: [] }
];

compProblems.forEach(comp => {
  const approach = inferCompApproach(comp);
  console.log(`Archetype: ${comp.archetype}`);
  console.log(`Approach:  ${approach}`);
  console.log();
});

// ========================================
// TEST 2: generateAdaptationGuidance()
// ========================================
console.log('\n--- TEST 2: generateAdaptationGuidance() ---\n');

const guidanceInput = {
  additionalDeviations: ['DEV-1.2.1', 'DEV-4.1.1'],
  missingDeviations: ['DEV-1.1.1'],
  additionalConcepts: ['tax shield', 'senior', 'junior'],
  targetProblem: { archetype: 'A1-CapitalStructure' },
  compProblem: { archetype: 'A1-CapitalStructure' }
};

console.log('Input:');
console.log('  Additional Deviations:', guidanceInput.additionalDeviations);
console.log('  Missing Deviations:', guidanceInput.missingDeviations);
console.log('  Additional Concepts:', guidanceInput.additionalConcepts);
console.log();

const guidance = generateAdaptationGuidance(guidanceInput);

console.log(`Generated ${guidance.length} guidance items:\n`);

guidance.forEach((item, index) => {
  console.log(`${index + 1}. ${item.title}`);
  console.log(`   Type: ${item.type}`);
  console.log(`   Severity: ${item.severity}`);
  console.log(`   Time Impact: ${item.timeImpact} minutes`);
  console.log(`   Steps:`);
  item.adaptationSteps.forEach((step, i) => {
    console.log(`      ${i + 1}. ${step.substring(0, 80)}${step.length > 80 ? '...' : ''}`);
  });
  console.log();
});

// ========================================
// TEST 3: findClosestCompWithDivergenceAnalysis()
// ========================================
console.log('\n--- TEST 3: findClosestCompWithDivergenceAnalysis() ---\n');

const targetProblem = {
  id: 'target-problem',
  archetype: 'A1-CapitalStructure',
  deviations: ['DEV-1.1.1', 'DEV-1.2.1', 'DEV-4.1.1'],
  keywords: ['debt', 'default', 'tax shield', 'senior', 'junior', 'YTM']
};

const problemLibrary = [
  {
    id: 'comp1-basic-default',
    archetype: 'A1-CapitalStructure',
    deviations: ['DEV-1.1.1'],
    keywords: ['debt', 'default', 'YTM', 'CAPM']
  },
  {
    id: 'comp2-with-tax-shields',
    archetype: 'A1-CapitalStructure',
    deviations: ['DEV-1.1.1', 'DEV-1.2.1'],
    keywords: ['debt', 'default', 'tax shield', 'YTM']
  },
  {
    id: 'comp3-different-archetype',
    archetype: 'A3-CAPM',
    deviations: ['DEV-3.1.1'],
    keywords: ['beta', 'CAPM', 'discount rate']
  }
];

console.log('Target Problem:');
console.log('  ID:', targetProblem.id);
console.log('  Archetype:', targetProblem.archetype);
console.log('  Deviations:', targetProblem.deviations);
console.log('  Keywords:', targetProblem.keywords);
console.log();

console.log('Problem Library:');
problemLibrary.forEach(prob => {
  console.log(`  - ${prob.id} (${prob.archetype})`);
});
console.log();

const result = findClosestCompWithDivergenceAnalysis(targetProblem, problemLibrary);

console.log('Analysis Result:');
console.log('  Has Comparable:', result.hasComp);
console.log('  Similarity Score:', (result.similarityScore * 100).toFixed(1) + '%');
console.log('  Closest Comp:', result.closestComp?.id || 'None');
console.log();

console.log('Divergence Analysis:');
console.log('  Additional Deviations:', result.divergenceAnalysis.additionalDeviations);
console.log('  Missing Deviations:', result.divergenceAnalysis.missingDeviations);
console.log('  Additional Concepts:', result.divergenceAnalysis.additionalConcepts);
console.log();

if (result.divergenceAnalysis.adaptationGuidance.length > 0) {
  console.log(`Adaptation Guidance (${result.divergenceAnalysis.adaptationGuidance.length} items):\n`);

  result.divergenceAnalysis.adaptationGuidance.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.title}`);
    console.log(`     Type: ${item.type}`);
    console.log(`     Severity: ${item.severity}`);
    console.log(`     Time Impact: ${item.timeImpact} minutes`);
    console.log();
  });
}

// ========================================
// TEST 4: Edge Cases
// ========================================
console.log('\n--- TEST 4: Edge Cases ---\n');

// No match found
const unmatchedTarget = {
  id: 'unmatched',
  archetype: 'B99-NonExistent',
  deviations: ['DEV-99.99.99'],
  keywords: ['unknown', 'keywords']
};

const noMatchResult = findClosestCompWithDivergenceAnalysis(unmatchedTarget, problemLibrary);
console.log('No Match Test:');
console.log('  Has Comparable:', noMatchResult.hasComp);
console.log('  Similarity Score:', (noMatchResult.similarityScore * 100).toFixed(1) + '%');
console.log();

// Empty library
const emptyLibraryResult = findClosestCompWithDivergenceAnalysis(targetProblem, []);
console.log('Empty Library Test:');
console.log('  Has Comparable:', emptyLibraryResult.hasComp);
console.log('  Closest Comp:', emptyLibraryResult.closestComp);
console.log();

// Perfect match
const perfectMatchTarget = {
  id: 'perfect-match',
  archetype: 'A1-CapitalStructure',
  deviations: ['DEV-1.1.1'],
  keywords: ['debt', 'default', 'YTM', 'CAPM']
};

const perfectMatchResult = findClosestCompWithDivergenceAnalysis(perfectMatchTarget, problemLibrary);
console.log('Perfect Match Test:');
console.log('  Has Comparable:', perfectMatchResult.hasComp);
console.log('  Similarity Score:', (perfectMatchResult.similarityScore * 100).toFixed(1) + '%');
console.log('  Closest Comp:', perfectMatchResult.closestComp?.id);
console.log('  Additional Deviations:', perfectMatchResult.divergenceAnalysis.additionalDeviations);
console.log('  Missing Deviations:', perfectMatchResult.divergenceAnalysis.missingDeviations);
console.log();

console.log('='.repeat(60));
console.log('DEMO COMPLETE');
console.log('='.repeat(60));
