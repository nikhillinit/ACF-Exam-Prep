# Excel Integration Guide

## Template Overview

The `Corporate_Finance_Templates.xlsx` workbook contains 11 worksheets, each corresponding to a specific archetype or calculation type.

## Worksheet Index

| Sheet Name | Archetype | Purpose | Key Features |
|------------|-----------|---------|--------------|
| 1_Capital_Structure | A1 | Debt valuation, tax shields | Multi-bond support, amortizing debt |
| 2_Multi_State_Project | A2A/A2B | Project NPV, wealth transfers | State probabilities, debt overhang |
| 3_CAPM_Discount_Rates | A3 | Beta calculations, WACC | Lever/unlever formulas |
| 4_Distress_Risk_Shift | A4 | Priority waterfall | Senior/junior payoffs |
| 5_Gordon_Growth | A5 | Stock valuation | Dividend discount model |
| 6_Payout_Policy | A5 | Div vs repurchase | Shareholder effects |
| 7_Risk_Management | A6 | Hedging analysis | Derivatives payoffs |
| 8_Sensitivity_Analysis | Various | What-if scenarios | Tornado charts |
| 9_Inflation_Indexed | Specialized | Real vs nominal | Indexation formulas |
| 10_Options_Valuation | A10 | Option pricing | Binomial trees |
| 11_Reference_Tables | Support | Constants, formulas | Tax rates, rf, market premium |

## Color Coding System

- **BLUE cells**: User inputs (you fill these)
- **BLACK cells**: Formulas (auto-calculate)
- **YELLOW highlights**: Key outputs (your answers)
- **GRAY cells**: Headers/labels
- **RED text**: Warnings or important notes

## Usage Workflow

### 1. Problem to Template Mapping

After reconnaissance identifies the archetype:

```
Problem Keywords → Archetype ID → Excel Tab
Example: "default", "coupon" → A1 → Sheet 1
```

### 2. Input Population

Systematic approach:
1. Read template header notes (first 3 rows)
2. Locate all BLUE input cells
3. Enter values from problem
4. Verify units (millions, decimals, percentages)
5. Check for "N/A" or blank cells that need values

### 3. Formula Verification

Before trusting outputs:
- Spot-check 2-3 intermediate calculations
- Verify expected return formulas
- Check survival/default probabilities sum to 1
- Ensure discount rates are reasonable (typically 3-15%)

### 4. Output Extraction

Key outputs are typically:
- A1: E[r_D], Tax Shield NPV, Debt Value
- A2A: Project NPV, Wealth Transfer Effect
- A2B: NPV with/without asymmetric info
- A3: Unlevered β, Re-levered β, WACC
- A4: Payoff waterfall, Recovery rates

### 5. Modifications for Variants

#### Multi-Bond Problems
Sheet 1 supports up to 3 bond tranches:
- Use rows 19-21 for Bond 1
- Use rows 22-24 for Bond 2
- Use rows 25-27 for Bond 3
- Template auto-calculates blended E[r_D]

#### Amortizing Debt
Sheet 1 has dedicated section (rows 30-40):
- Enter principal payment schedule
- Interest calculated on declining balance
- Tax shields adjust period-by-period

#### Off-Par Bonds
Use built-in Price-to-Yield calculator (B35-B40):
1. Enter coupon, face value, maturity
2. Enter market price
3. Template solves for YTM
4. Use this YTM as "Promised Yield" input

## Common Pitfalls

### Mistake 1: Wrong Discount Rate
**Error**: Using rf instead of E[r_D] for tax shields
**Fix**: Check assumption checklist (A1: "Discount TS at E[r_D]? Usually YES")
**Location**: Sheet 1, cells F34-F43

### Mistake 2: Merged Cells
**Error**: Can't enter multiple bond data
**Fix**: Unmerge cells B19-B27 if they're merged
**Prevention**: Use multi-bond template version

### Mistake 3: Circular Reference
**Error**: Formula error due to circular logic
**Fix**: 
- Enable iterative calculation (File → Options → Formulas)
- Or break circular link manually

### Mistake 4: Formula Points to Empty Cell
**Error**: "#VALUE!" or wrong calculation
**Fix**: Run formula audit:
```bash
python3 recalc.py Corporate_Finance_Templates.xlsx 30
```
Fix any errors reported

## Integration with Reconnaissance System

The React app reads Excel metadata:

```javascript
// Example: Archetype scanner identifies A1
{
  "archetype": "A1",
  "excelTab": "1_Capital_Structure",
  "inputCells": ["B19", "B20", "B21", "B23"],
  "outputCells": ["B35", "B55", "B70"]
}
```

Future enhancement: Direct Excel COM integration for auto-population

## Validation Checklist

Before submitting exam answer:

- [ ] All BLUE cells populated?
- [ ] No #VALUE!, #REF!, or #DIV/0! errors?
- [ ] Outputs have reasonable magnitudes?
- [ ] Sign checks pass? (E[r_D] < Promised Yield)
- [ ] Formula audit passed? (if available)
- [ ] Results copied to exam paper correctly?

## Offline Usage

For exams without computer access:
1. Print relevant worksheets beforehand
2. Use calculator to manually compute
3. Follow template logic structure
4. Reference "Manual Calculation Notes" in each sheet (Row 5)

## Version Control

When updating templates:
1. Save new version with date: `Templates_2024-12-15.xlsx`
2. Update `.env` file path
3. Re-validate with test problems
4. Document changes in version notes (Sheet 11)
