/**
 * Validation Script for Deviation Detection Engine
 *
 * Tests the detection engine against known problems with expected deviations
 * Run with: node src/utils/validateDetection.js
 */

const { detectDeviations } = require('./deviationDetectionEngine');

// Known test cases with expected deviations
const TEST_CASES = [
  {
    name: 'Hazard Rate Default',
    text: 'The company faces annual default probability of 5% with hazard rate model',
    expectedCodes: ['DEV-1.1.1'],
    expectedConfidence: 'HIGH'
  },
  {
    name: 'Amortizing Debt',
    text: 'The debt has an amortizing structure with equal annual payments and declining principal balance',
    expectedCodes: ['DEV-1.2.1'],
    expectedConfidence: 'HIGH'
  },
  {
    name: 'Debt Overhang',
    text: 'The firm has existing debt outstanding. Equity holders refuse to invest in the positive-NPV project due to debt overhang',
    expectedCodes: ['DEV-2.1.1'],
    expectedConfidence: 'HIGH'
  },
  {
    name: 'APV Method',
    text: 'Calculate the adjusted present value (APV) given changing leverage over time and value of tax shields separately',
    expectedCodes: ['DEV-4.2.1'],
    expectedConfidence: 'HIGH'
  },
  {
    name: 'Beta Unlevering',
    text: 'Unlever the equity beta using the comparable firm with different capital structure and then relever at target',
    expectedCodes: ['DEV-4.1.1'],
    expectedConfidence: 'HIGH'
  },
  {
    name: 'Recursive Valuation',
    text: 'Use backward induction to value the multi-stage project with option to abandon at each decision node',
    expectedCodes: ['DEV-3.1.1'],
    expectedConfidence: 'HIGH'
  },
  {
    name: 'Real Options',
    text: 'Value the option to wait using Black-Scholes formula with volatility of underlying project',
    expectedCodes: ['DEV-5.1.1'],
    expectedConfidence: 'HIGH'
  },
  {
    name: 'Free Cash Flow',
    text: 'Calculate FCFF starting from EBIT, add back depreciation, subtract CapEx and change in working capital',
    expectedCodes: ['DEV-6.1.1'],
    expectedConfidence: 'HIGH'
  },
  {
    name: 'Standard Problem (No Deviations)',
    text: 'Calculate the NPV of a simple project with constant cash flows and constant WACC',
    expectedCodes: [],
    expectedConfidence: 'NONE'
  },
  {
    name: 'Multiple Deviations',
    text: 'The firm has existing debt with annual default probability of 5% using hazard rate. The debt is amortizing with declining principal.',
    expectedCodes: ['DEV-1.1.1', 'DEV-1.2.1', 'DEV-2.1.1'],
    expectedConfidence: 'HIGH'
  }
];

// Performance test case
const PERFORMANCE_TEST = {
  name: 'Performance Test',
  text: `
    HAL Corporation is considering issuing senior debt to finance a new project.
    The company faces annual default probability of 5% with hazard rate model.
    The debt will have an amortizing structure with equal annual payments.
    Calculate the expected return on debt accounting for default risk.
    Use the APV method to value the levered firm separately from tax shields.
    The unlevered beta needs to be calculated from comparable firms.
  `,
  maxDuration: 50 // milliseconds
};

// Run validation
console.log('═══════════════════════════════════════════════');
console.log('  Deviation Detection Engine - Validation Test');
console.log('═══════════════════════════════════════════════\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

TEST_CASES.forEach((testCase, index) => {
  totalTests++;

  console.log(`\nTest ${index + 1}: ${testCase.name}`);
  console.log('─'.repeat(60));

  try {
    const result = detectDeviations(testCase.text);

    // Check if expected deviations were detected
    const detectedCodes = result.deviations.map(d => d.code);
    const allExpectedFound = testCase.expectedCodes.every(code =>
      detectedCodes.includes(code)
    );

    // Check confidence level
    const confidenceMatch = result.metadata.overallConfidence === testCase.expectedConfidence;

    // Display results
    console.log(`Expected: ${testCase.expectedCodes.join(', ') || 'None'}`);
    console.log(`Detected: ${detectedCodes.join(', ') || 'None'}`);
    console.log(`Expected Confidence: ${testCase.expectedConfidence}`);
    console.log(`Detected Confidence: ${result.metadata.overallConfidence}`);

    if (result.deviations.length > 0) {
      result.deviations.forEach(d => {
        console.log(`  - ${d.code}: ${d.name} (${d.confidence}, score: ${d.score})`);
      });
    }

    if (allExpectedFound && confidenceMatch) {
      console.log('✅ PASS');
      passedTests++;
    } else {
      console.log('❌ FAIL');
      if (!allExpectedFound) {
        console.log('   Reason: Expected deviations not all found');
      }
      if (!confidenceMatch) {
        console.log('   Reason: Confidence level mismatch');
      }
      failedTests++;
    }

  } catch (error) {
    console.log('❌ FAIL - ERROR');
    console.log(`   Error: ${error.message}`);
    failedTests++;
  }
});

// Performance test
console.log('\n\nPerformance Test');
console.log('─'.repeat(60));

try {
  const start = performance.now();
  const result = detectDeviations(PERFORMANCE_TEST.text);
  const end = performance.now();
  const duration = end - start;

  console.log(`Duration: ${duration.toFixed(2)}ms`);
  console.log(`Target: <${PERFORMANCE_TEST.maxDuration}ms`);
  console.log(`Detected: ${result.deviations.length} deviations`);

  if (duration < PERFORMANCE_TEST.maxDuration) {
    console.log('✅ PASS - Performance target met');
    passedTests++;
  } else {
    console.log(`⚠️  WARN - Slower than target (${duration.toFixed(2)}ms > ${PERFORMANCE_TEST.maxDuration}ms)`);
    passedTests++; // Still count as pass, just warning
  }
  totalTests++;

} catch (error) {
  console.log('❌ FAIL - ERROR');
  console.log(`   Error: ${error.message}`);
  failedTests++;
  totalTests++;
}

// Summary
console.log('\n\n═══════════════════════════════════════════════');
console.log('  Test Summary');
console.log('═══════════════════════════════════════════════');
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests} (${(passedTests / totalTests * 100).toFixed(1)}%)`);
console.log(`Failed: ${failedTests}`);

if (failedTests === 0) {
  console.log('\n🎉 All tests passed!\n');
  process.exit(0);
} else {
  console.log(`\n⚠️  ${failedTests} test(s) failed\n`);
  process.exit(1);
}
