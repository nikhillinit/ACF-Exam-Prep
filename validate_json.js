/**
 * JSON Validator for ACF Exam Prep v11 Schema
 * 
 * Run this in your ACF-Exam-Prep directory to validate your JSON files:
 * node validate_json.js
 */

const fs = require('fs');
const path = require('path');

// Paths to JSON files
const GUIDED_PATH = path.join(__dirname, 'public', 'source-materials', 'guided_examples_v11.json');
const MOCK_PATH = path.join(__dirname, 'public', 'source-materials', 'mock_questions_v11.json');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateGuidedExample(example, index) {
  const errors = [];
  const warnings = [];

  // Required fields
  if (!example.id) errors.push(`Missing 'id'`);
  if (!example.title) warnings.push(`Missing 'title'`);
  if (!example.content_type) errors.push(`Missing 'content_type'`);
  if (example.content_type !== 'guided') errors.push(`content_type should be 'guided', got '${example.content_type}'`);
  if (!example.primary_archetype && !example.archetype) warnings.push(`Missing 'primary_archetype' or 'archetype'`);
  if (!example.problem_intro && !example.problem_statement) warnings.push(`Missing 'problem_intro' or 'problem_statement'`);

  // Solution steps validation
  if (!example.solution_steps || example.solution_steps.length === 0) {
    warnings.push(`No solution_steps provided`);
  } else {
    example.solution_steps.forEach((step, stepIdx) => {
      if (!step.part && step.step_index === undefined) {
        warnings.push(`Step ${stepIdx}: Missing 'part' or 'step_index'`);
      }
      if (!step.calculation && !step.explanation) {
        warnings.push(`Step ${stepIdx}: Missing both 'calculation' and 'explanation'`);
      }
    });
  }

  return { errors, warnings };
}

function validateMockQuestion(example, index) {
  const errors = [];
  const warnings = [];

  // Required fields
  if (!example.id) errors.push(`Missing 'id'`);
  if (!example.title) warnings.push(`Missing 'title'`);
  if (!example.content_type) errors.push(`Missing 'content_type'`);
  if (example.content_type !== 'mock') errors.push(`content_type should be 'mock', got '${example.content_type}'`);
  if (!example.primary_archetype && !example.archetype) warnings.push(`Missing 'primary_archetype' or 'archetype'`);
  if (!example.problem_intro && !example.problem_statement) warnings.push(`Missing 'problem_intro' or 'problem_statement'`);

  // Problem parts validation
  if (!example.problem_parts || example.problem_parts.length === 0) {
    warnings.push(`No problem_parts provided (mock questions typically have multiple parts)`);
  } else {
    example.problem_parts.forEach((part, partIdx) => {
      if (!part.part_id) errors.push(`Part ${partIdx}: Missing 'part_id'`);
      if (!part.label) warnings.push(`Part ${partIdx}: Missing 'label'`);
      if (!part.text) errors.push(`Part ${partIdx}: Missing 'text'`);
    });
  }

  // Solution validation
  if (!example.solution) {
    warnings.push(`No solution provided`);
  } else {
    if (example.solution.available && !example.solution.content) {
      warnings.push(`Solution marked as available but no content provided`);
    }
  }

  return { errors, warnings };
}

function validateFile(filePath, contentType) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`Validating: ${filePath}`, 'cyan');
  log('='.repeat(60), 'cyan');

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    log(`✗ File not found!`, 'red');
    return { valid: false, count: 0 };
  }

  // Try to parse JSON
  let data;
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(fileContent);
  } catch (error) {
    log(`✗ Invalid JSON: ${error.message}`, 'red');
    return { valid: false, count: 0 };
  }

  // Check top-level structure
  if (!data.worked_examples) {
    log(`✗ Missing 'worked_examples' array at top level`, 'red');
    return { valid: false, count: 0 };
  }

  if (!Array.isArray(data.worked_examples)) {
    log(`✗ 'worked_examples' should be an array`, 'red');
    return { valid: false, count: 0 };
  }

  // Check schema version if metadata exists
  if (data.metadata) {
    if (data.metadata.schema_version) {
      if (data.metadata.schema_version !== '11.0') {
        log(`⚠ WARNING: Schema version is ${data.metadata.schema_version}, expected 11.0`, 'yellow');
      } else {
        log(`✓ Schema version: ${data.metadata.schema_version}`, 'green');
      }
    }
  }

  log(`✓ Valid JSON structure`, 'green');
  log(`✓ Found ${data.worked_examples.length} problems`, 'green');

  // Validate each problem
  let totalErrors = 0;
  let totalWarnings = 0;

  data.worked_examples.forEach((example, index) => {
    const result = contentType === 'guided' 
      ? validateGuidedExample(example, index)
      : validateMockQuestion(example, index);

    if (result.errors.length > 0 || result.warnings.length > 0) {
      log(`\nProblem #${index + 1}: ${example.id || 'NO ID'} - ${example.title || 'NO TITLE'}`, 'yellow');
      
      if (result.errors.length > 0) {
        result.errors.forEach(err => {
          log(`  ✗ ERROR: ${err}`, 'red');
          totalErrors++;
        });
      }

      if (result.warnings.length > 0) {
        result.warnings.forEach(warn => {
          log(`  ⚠ WARNING: ${warn}`, 'yellow');
          totalWarnings++;
        });
      }
    }
  });

  // Summary
  log(`\n${'='.repeat(60)}`, 'cyan');
  log('Summary:', 'cyan');
  log(`  Total Problems: ${data.worked_examples.length}`, 'blue');
  log(`  Errors: ${totalErrors}`, totalErrors > 0 ? 'red' : 'green');
  log(`  Warnings: ${totalWarnings}`, totalWarnings > 0 ? 'yellow' : 'green');
  
  if (totalErrors === 0 && totalWarnings === 0) {
    log(`  ✓ All problems are valid!`, 'green');
  }

  return { 
    valid: totalErrors === 0, 
    count: data.worked_examples.length,
    errors: totalErrors,
    warnings: totalWarnings
  };
}

// Main execution
log('\n' + '='.repeat(60), 'cyan');
log('ACF Exam Prep - JSON Validator (v11 Schema)', 'cyan');
log('='.repeat(60) + '\n', 'cyan');

const guidedResult = validateFile(GUIDED_PATH, 'guided');
const mockResult = validateFile(MOCK_PATH, 'mock');

// Final summary
log('\n' + '='.repeat(60), 'cyan');
log('FINAL SUMMARY', 'cyan');
log('='.repeat(60), 'cyan');
log(`Guided Examples: ${guidedResult.count} problems (${guidedResult.errors} errors, ${guidedResult.warnings} warnings)`, 
    guidedResult.valid ? 'green' : 'red');
log(`Mock Questions: ${mockResult.count} problems (${mockResult.errors} errors, ${mockResult.warnings} warnings)`, 
    mockResult.valid ? 'green' : 'red');
log(`Total: ${guidedResult.count + mockResult.count} problems`, 'blue');

if (guidedResult.valid && mockResult.valid) {
  log('\n✓ All JSON files are valid and ready to use!', 'green');
  process.exit(0);
} else {
  log('\n✗ Please fix errors before using the Problem Library', 'red');
  process.exit(1);
}
