# Problem Creation Guide

Complete guide for adding new ACF exam problems to the platform using the automated markdown-to-JSON conversion system.

---

## Quick Start

### **1. Generate a Template**

```bash
node scripts/generate-template.js --type Q1 --output my-problem.md
```

### **2. Edit the Markdown File**

Open `my-problem.md` and fill in your problem details.

### **3. Convert to JSON**

```bash
node scripts/add-problem.js --input my-problem.md --validate --enrich
```

**Done!** Your problem is now in the database.

---

## Detailed Workflow

### **Step 1: Choose Question Type**

| Type | Duration | Focus | When to Use |
|------|----------|-------|-------------|
| **Q1** | 15-20 min | Single concept, straightforward | Testing fundamental understanding |
| **Q2** | 25-30 min | State-contingent, multi-step | Decision-making under uncertainty |
| **Q3** | 35-40 min | Hybrid, multiple deviations | Complex integrated problems |
| **Q4** | 45+ min | Comprehensive, strategic | Real options, full valuations |

### **Step 2: Select Archetype**

**Primary Archetypes:**
- `A1-CapitalStructure` - Tax shields, APV, WACC
- `A2-MultiState` - State-contingent outcomes
- `A2A-DebtOverhang` - Underinvestment problem
- `A2B-AdverseSelection` - Signaling, screening
- `A3-CAPM` - Cost of capital, beta
- `A4-Distress` - Priority, waterfall
- `A5-Payout` - Dividends, repurchases
- `A6-Priority` - Absolute priority rule
- `C1-RealOptions` - Flexibility valuation

**Hybrid Archetypes (for Q3/Q4):**
- `A1-CapitalStructure,A4-Distress`
- `A2-MultiState,A3-CAPM`
- etc.

### **Step 3: Generate Template**

```bash
# Q1 with default archetype
node scripts/generate-template.js --type Q1

# Q2 with specific archetype
node scripts/generate-template.js --type Q2 --archetype A2A-DebtOverhang

# Custom output filename
node scripts/generate-template.js --type Q3 --output hal-corp-problem.md
```

This creates a markdown file with the correct structure.

---

## Markdown Format

### **Frontmatter (Required)**

```markdown
---
archetype: A1-CapitalStructure
difficulty: core
time: 25
---
```

**Fields:**
- `archetype`: Primary archetype code (required)
- `difficulty`: `core`, `advanced`, or `exam-level` (required)
- `time`: Estimated minutes (required)

### **Problem Statement**

```markdown
# Problem Title

Background and context for the problem...

**Given Information:**
- Parameter 1: Value
- Parameter 2: Value
- Parameter 3: Value

**Corporate tax rate:** 30%
```

### **Parts with Solutions**

```markdown
## Part A

Question text for part A.

### Solution

**Reasoning:** Explain the conceptual approach. Why this method?

**Calculation:** Show mathematical work step-by-step.
```
Example:
NPV = CF0 + CF1/(1+r) + CF2/(1+r)^2
    = -100 + 30/1.10 + 30/1.10^2
    = -47.94
```

**Answer:** Final answer with units

## Part B

[Repeat for each part...]
```

### **Additional Sections (Optional but Recommended)**

```markdown
## Key Insights

- Key takeaway #1
- Important distinction
- Exam trap to watch for

## Common Mistakes

- Common error #1
- Using wrong approach
- Forgetting to account for X
```

---

## CLI Tools Reference

### **1. Generate Template**

```bash
node scripts/generate-template.js [options]
```

**Options:**
- `--type <Q1-Q4>` - Question type (required)
- `--archetype <code>` - Archetype code (optional)
- `--output <file>` - Output filename (default: Q1-new.md)
- `--list` - List available templates

**Examples:**
```bash
# Generate Q1 template
node scripts/generate-template.js --type Q1

# List all templates
node scripts/generate-template.js --list
```

---

### **2. Add Single Problem**

```bash
node scripts/add-problem.js [options]
```

**Options:**
- `--input <file>` - Markdown file path (required)
- `--output <file>` - JSON output file (default: guided_examples_v11.json)
- `--validate` - Run validation
- `--enrich` - Auto-detect deviations
- `--dry-run` - Preview without writing

**Examples:**
```bash
# Basic conversion
node scripts/add-problem.js --input my-problem.md

# With validation and enrichment
node scripts/add-problem.js --input my-problem.md --validate --enrich

# Preview only (no file changes)
node scripts/add-problem.js --input my-problem.md --dry-run
```

---

### **3. Batch Import**

```bash
node scripts/batch-import.js [options]
```

**Options:**
- `--dir <directory>` - Directory with markdown files (required)
- `--output <file>` - JSON output file (default: guided_examples_v11.json)
- `--validate` - Validate all problems (default: true)
- `--enrich` - Auto-detect deviations for all
- `--dry-run` - Preview without writing

**Examples:**
```bash
# Import all files from directory
node scripts/batch-import.js --dir ./new-problems

# Import with enrichment
node scripts/batch-import.js --dir ./new-problems --enrich

# Preview only
node scripts/batch-import.js --dir ./new-problems --dry-run
```

---

## Validation

Problems are automatically validated for:
- ✅ Required fields (id, problem_text, archetype, solution_steps)
- ✅ Solution step structure (part, prompt)
- ✅ Valid archetype codes
- ✅ JSON schema compliance

**Manual Validation:**
```bash
node validate_json.js
```

---

## Deviation Enrichment

Automatic deviation detection adds:
- `deviation_alert` to solution steps
- `detected_deviations` array to problem
- `deviation_summary` with time impact and severity

**60+ deviation patterns** are automatically detected including:
- Hazard rate default modeling
- Amortizing debt structure
- Debt overhang problem
- Tax shield adjustments
- And many more...

---

## JSON Output Format

The system generates JSON matching this schema:

```json
{
  "id": "problem-identifier",
  "problem_text": "Full problem statement...",
  "archetype": "A1-CapitalStructure",
  "difficulty": "core",
  "estimated_time_minutes": 25,
  "solution_steps": [
    {
      "part": "A",
      "prompt": "Question text",
      "reasoning": "Conceptual explanation",
      "calculation": "Mathematical work",
      "sanity_check": "Verification",
      "step_index": 0,
      "deviation_alert": {
        "code": "DEV-X.Y.Z",
        "name": "Deviation Name",
        "warning": "Alert message",
        "checkpoints": [...],
        "severity": "high"
      }
    }
  ],
  "key_insights": ["Insight 1", "Insight 2"],
  "common_mistakes": ["Mistake 1", "Mistake 2"],
  "detected_deviations": ["DEV-1.1.1", "DEV-1.2.1"],
  "deviation_summary": {
    "total_deviations": 2,
    "total_time_impact_minutes": 7.5,
    "severity_distribution": {
      "critical": 0,
      "high": 2,
      "medium": 0,
      "low": 0
    }
  }
}
```

---

## Best Practices

### **Problem Writing**

1. **Clear Context** - Provide enough background without overwhelming
2. **Realistic Numbers** - Use plausible values for financial parameters
3. **Progressive Difficulty** - Parts should build on each other
4. **Explicit Instructions** - Be clear about what to calculate

### **Solution Steps**

1. **Reasoning First** - Always explain the approach before calculations
2. **Show Work** - Include intermediate steps, not just final answers
3. **Sanity Checks** - Verify results make economic sense
4. **Units Matter** - Always include units (%, $M, years)

### **Archetype Selection**

1. **Primary First** - Choose the dominant concept being tested
2. **Hybrids for Q3/Q4** - Use multiple archetypes for complex problems
3. **Consistent Naming** - Use standard archetype codes

---

## Common Issues

### **Problem: ID Already Exists**

```
⚠️ Problem with ID 'my-problem' already exists. Replacing...
```

**Solution:** Either:
- Use a different filename
- Accept the replacement
- Manually edit the ID in frontmatter

### **Problem: Validation Failed**

```
❌ Validation failed:
  - Step 0: Missing prompt
```

**Solution:** Ensure each Part has:
- Part label (## Part A)
- Question text
- Solution section (### Solution)

### **Problem: Deviation Detection Fails**

```
⚠️ Warning: Could not enrich with deviations: [error]
```

**Solution:**
- Check that `deviationInjector.js` exists
- Run without `--enrich` flag
- Add deviations manually later

---

## Examples

### **Example 1: Simple Q1 Problem**

**Input (markdown):**
```markdown
---
archetype: A1-CapitalStructure
difficulty: core
time: 20
---

# HAL Corporation Tax Shield

HAL issues $100M debt at 5% coupon. Tax rate = 30%.

## Part A

Calculate annual tax shield.

### Solution

**Reasoning:** Tax shield = Interest × Tax rate

**Calculation:** TS = (100M × 0.05) × 0.30 = $1.5M

**Answer:** $1.5 million per year
```

**Command:**
```bash
node scripts/add-problem.js --input hal-tax-shield.md --validate
```

**Result:** Problem added with ID `hal-corporation-tax-shield`

---

### **Example 2: Q2 Multi-State Problem**

See `templates/Q2-template.md` for full structure.

**Command:**
```bash
node scripts/generate-template.js --type Q2 --output my-q2.md
# Edit my-q2.md...
node scripts/add-problem.js --input my-q2.md --validate --enrich
```

---

### **Example 3: Batch Import**

```bash
# Create directory with 10 markdown files
mkdir new-batch

# Copy template 10 times and edit each
for i in {1..10}; do
  node scripts/generate-template.js --type Q1 --output new-batch/problem-$i.md
done

# Edit all files...

# Import all at once
node scripts/batch-import.js --dir new-batch --enrich
```

**Result:** 10 problems added with deviation detection

---

## Troubleshooting

### Enable Verbose Output

Add console.log statements to parser:
```javascript
console.log('Parsed problem:', problem);
```

### Check JSON Structure

Use `--dry-run` to preview output:
```bash
node scripts/add-problem.js --input test.md --dry-run
```

### Validate JSON Manually

```bash
node validate_json.js
```

---

## Summary

**Workflow:**
1. Generate template → 2. Edit markdown → 3. Convert to JSON → 4. Validate

**Key Files:**
- Templates: `templates/Q1-Q4-template.md`
- Parser: `src/utils/problemParser.js`
- CLI Tools: `scripts/add-problem.js`, `scripts/batch-import.js`
- Output: `public/source-materials/guided_examples_v11.json`

**Support:**
- Run `--help` on any CLI tool
- Check `templates/` for examples
- See existing problems in `guided_examples_v11.json`

---

**Happy problem creating! 🎉**
