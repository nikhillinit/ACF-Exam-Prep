/**
 * Test Suite for Deviation Injection System
 *
 * Demonstrates how the system works with real examples
 */

import {
  injectDeviationAlerts,
  getDeviationsForArchetype,
  getDeviationByCode,
  getCriticalDeviations,
  validateDeviationDatabase
} from './deviationInjector.js';

// ============================================
// TEST 1: Validate Database Integrity
// ============================================
console.log('TEST 1: Database Validation');
console.log('='.repeat(50));
const validation = validateDeviationDatabase();
console.log('Valid:', validation.valid);
console.log('Total Deviations:', validation.total_deviations);
console.log('Unique Codes:', validation.unique_codes);
if (validation.errors.length > 0) {
  console.log('Errors:', validation.errors);
}
console.log('\n');

// ============================================
// TEST 2: Hazard Rate Default Detection
// ============================================
console.log('TEST 2: Hazard Rate Default (DEV-1.1.1)');
console.log('='.repeat(50));

const hazardRateProblem = {
  id: 'test-hazard-rate',
  archetype: 'A1-CapitalStructure',
  solution_steps: [
    {
      part: 'Step 1 - Calculate Survival Probability',
      prompt: 'What is the survival probability over time?',
      reasoning: 'With a hazard rate of 5% per year, survival decreases each year.',
      calculation: 'Survival(t) = (1 - 0.05)^t\nYear 1: 0.95\nYear 2: 0.9025',
      sanity_check: 'Survival probability decreases over time as expected'
    },
    {
      part: 'Step 2 - Expected Return on Debt',
      prompt: 'Calculate the expected return on debt considering default risk.',
      reasoning: 'We need to find the expected cash flows for each period weighted by survival probability, then calculate the IRR.',
      calculation: 'Expected CF Year 1 = 108 × 0.95 + 40 × 0.05 = 104.6\nExpected CF Year 2 = 108 × 0.9025 + 40 × 0.0975 = 101.37\nIRR of these cash flows = 5.2%',
      sanity_check: 'Expected return should be higher than risk-free rate but below promised yield'
    }
  ]
};

const enrichedHazard = injectDeviationAlerts(hazardRateProblem);
console.log('Step 1 has alert?', !!enrichedHazard.solution_steps[0].deviation_alert);
console.log('Step 2 has alert?', !!enrichedHazard.solution_steps[1].deviation_alert);
if (enrichedHazard.solution_steps[1].deviation_alert) {
  const alert = enrichedHazard.solution_steps[1].deviation_alert;
  console.log('Alert Code:', alert.code);
  console.log('Alert Name:', alert.name);
  console.log('Warning:', alert.warning);
  console.log('Time Impact:', alert.time_impact_minutes, 'minutes');
  console.log('Severity:', alert.severity);
}
console.log('Summary:', enrichedHazard.deviation_summary);
console.log('\n');

// ============================================
// TEST 3: Binary Default (Should NOT trigger DEV-1.1.1)
// ============================================
console.log('TEST 3: Binary Default (DEV-1.1.2)');
console.log('='.repeat(50));

const binaryDefaultProblem = {
  id: 'test-binary-default',
  archetype: 'A1-CapitalStructure',
  solution_steps: [
    {
      part: 'Step 1 - Expected Return',
      prompt: 'Calculate expected return for this 1-year bond.',
      reasoning: 'This is a one-year bond with a 10% probability of default at maturity.',
      calculation: 'Return if no default: 108/96 - 1 = 12.5%\nReturn in default: 40/96 - 1 = -58.3%\nE[r_D] = 0.90 × 0.125 + 0.10 × (-0.583) = 5.42%',
      sanity_check: 'Weighted average method is correct for binary default'
    }
  ]
};

const enrichedBinary = injectDeviationAlerts(binaryDefaultProblem);
console.log('Step 1 has alert?', !!enrichedBinary.solution_steps[0].deviation_alert);
if (enrichedBinary.solution_steps[0].deviation_alert) {
  console.log('Alert Code:', enrichedBinary.solution_steps[0].deviation_alert.code);
  console.log('Warning:', enrichedBinary.solution_steps[0].deviation_alert.warning);
}
console.log('\n');

// ============================================
// TEST 4: Tax Shield Discount Rate
// ============================================
console.log('TEST 4: Tax Shield Discount Rate (DEV-1.2.1)');
console.log('='.repeat(50));

const taxShieldProblem = {
  id: 'test-tax-shield',
  archetype: 'A1-CapitalStructure',
  solution_steps: [
    {
      part: 'Step 1 - PV of Tax Shields',
      prompt: 'What is the present value of interest tax shields?',
      reasoning: 'Tax shields exist as long as the firm pays interest. They have similar risk to debt payments.',
      calculation: 'Annual tax shield = τ × Interest = 0.25 × 8 = 2\nDiscount at r_D = 4%\nPV = 2 / 0.04 = 50',
      sanity_check: 'Tax shields should be discounted at the debt rate, not WACC or equity rate'
    }
  ]
};

const enrichedTaxShield = injectDeviationAlerts(taxShieldProblem);
console.log('Step 1 has alert?', !!enrichedTaxShield.solution_steps[0].deviation_alert);
if (enrichedTaxShield.solution_steps[0].deviation_alert) {
  const alert = enrichedTaxShield.solution_steps[0].deviation_alert;
  console.log('Alert Code:', alert.code);
  console.log('Warning:', alert.warning);
  console.log('Checkpoints:', alert.checkpoints);
}
console.log('\n');

// ============================================
// TEST 5: Equity Limited Liability
// ============================================
console.log('TEST 5: Equity Limited Liability (DEV-2.1.1)');
console.log('='.repeat(50));

const equityProblem = {
  id: 'test-equity-liability',
  archetype: 'A2-MultiState',
  solution_steps: [
    {
      part: 'Step 1 - Equity Value in Each State',
      prompt: 'Calculate equity value in good and bad states.',
      reasoning: 'Equity holders have limited liability, so equity value cannot be negative.',
      calculation: 'Good state: V = 150, D = 100 → Equity = max(0, 150-100) = 50\nBad state: V = 80, D = 100 → Equity = max(0, 80-100) = 0',
      sanity_check: 'In bad state, firm value is less than debt, so equity = 0'
    }
  ]
};

const enrichedEquity = injectDeviationAlerts(equityProblem);
console.log('Step 1 has alert?', !!enrichedEquity.solution_steps[0].deviation_alert);
if (enrichedEquity.solution_steps[0].deviation_alert) {
  const alert = enrichedEquity.solution_steps[0].deviation_alert;
  console.log('Alert Code:', alert.code);
  console.log('Warning:', alert.warning);
  console.log('Severity:', alert.severity);
}
console.log('\n');

// ============================================
// TEST 6: Debt Overhang Detection
// ============================================
console.log('TEST 6: Debt Overhang (DEV-2.2.1)');
console.log('='.repeat(50));

const overhangProblem = {
  id: 'test-debt-overhang',
  archetype: 'A2-MultiState',
  solution_steps: [
    {
      part: 'Step 1 - Check for Underinvestment',
      prompt: 'Will equity holders invest in this new project?',
      reasoning: 'Even though the project has positive NPV for the firm, we need to check if equity holders benefit.',
      calculation: 'NPV of project to firm = +15\nChange in equity value = +8\nInvestment required = 10\nSince ΔEquity (8) < Investment (10), equity rejects the project',
      sanity_check: 'This is debt overhang - positive NPV project rejected due to wealth transfer to debt'
    }
  ]
};

const enrichedOverhang = injectDeviationAlerts(overhangProblem);
console.log('Step 1 has alert?', !!enrichedOverhang.solution_steps[0].deviation_alert);
if (enrichedOverhang.solution_steps[0].deviation_alert) {
  const alert = enrichedOverhang.solution_steps[0].deviation_alert;
  console.log('Alert Code:', alert.code);
  console.log('Warning:', alert.warning);
  console.log('Time Impact:', alert.time_impact_minutes, 'minutes');
}
console.log('\n');

// ============================================
// TEST 7: Query Functions
// ============================================
console.log('TEST 7: Query Functions');
console.log('='.repeat(50));

// Get all deviations for A1
const a1Deviations = getDeviationsForArchetype('A1-CapitalStructure');
console.log('A1 Deviations:', a1Deviations.length);
console.log('A1 Codes:', a1Deviations.map(d => d.code));

// Get specific deviation
const dev111 = getDeviationByCode('DEV-1.1.1');
console.log('\nDEV-1.1.1 Details:');
console.log('Name:', dev111.name);
console.log('Severity:', dev111.severity);
console.log('Time Impact:', dev111.time_impact_minutes);

// Get all critical deviations
const criticalDevs = getCriticalDeviations();
console.log('\nCritical Deviations:', criticalDevs.length);
console.log('Critical Codes:', criticalDevs.map(d => d.code));
console.log('\n');

// ============================================
// TEST 8: Real Problem from Database
// ============================================
console.log('TEST 8: Real Problem (Hazard Rate from guided_problem_solving)');
console.log('='.repeat(50));

// Simulate the actual problem structure from guided_problem_solving_COMPLETE.json
const realProblem = {
  id: 'a1-bond-default-expected-return-and-beta',
  archetype: 'A1-CapitalStructure',
  problem_text: 'Firm L issues a 1-year coupon bond with face value $100 and an 8% annual coupon...',
  solution_steps: [
    {
      part: 'Step 4 - Expected Return on Debt',
      prompt: 'Incorporate default to find the expected return E[r_D].',
      reasoning: 'Expected return must weight the returns in the good state (no default) and bad state (default) by their probabilities. Returns are always computed as (payoff − price)/price.',
      calculation: 'Return if no default:\n r_good = 108 / 96 − 1 = 0.125 = 12.5%.\n\nReturn in default:\n r_default = 40 / 96 − 1 = −0.5833 (≈ −58.33%).\n\nExpected return:\n E[r_D] = 0.90 * r_good + 0.10 * r_default\n ≈ 0.90 * 0.125 + 0.10 * (−0.5833)\n = 0.1125 − 0.0583\n ≈ 0.0542 = 5.42%.\nSo the expected return on the bond is about 5.4%.',
      sanity_check: 'The expected return must lie between the good and default returns (12.5% and −58.3%), and given a 10% default probability, it should be much closer to 12.5%. A value around 5–6% is plausible and, importantly, above the risk-free rate of 3% (so this debt has positive beta).'
    }
  ]
};

const enrichedReal = injectDeviationAlerts(realProblem);
console.log('Problem:', enrichedReal.id);
console.log('Has alert on Step 4?', !!enrichedReal.solution_steps[0].deviation_alert);

// Note: This is a binary default (1-year, single event), so DEV-1.1.1 should NOT trigger
// DEV-1.1.2 might trigger as a positive confirmation
if (enrichedReal.solution_steps[0].deviation_alert) {
  const alert = enrichedReal.solution_steps[0].deviation_alert;
  console.log('Alert Code:', alert.code);
  console.log('Expected: DEV-1.1.2 (Binary Default - Weighted Average is CORRECT)');
}
console.log('\n');

console.log('All tests complete!');
