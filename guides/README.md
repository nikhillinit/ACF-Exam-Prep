# ACF Exam Archetype Quick Reference Guides

This directory contains comprehensive quick reference guides for all 10 ACF exam archetypes. Each guide synthesizes information from multiple sources (archetype signals, keyword mappings, tier definitions, worked examples) into a single, actionable reference document.

## 📚 Available Guides

### Tier 1 Archetypes (80% of Exam)

| Archetype | Name | Time | Points | Guide |
|-----------|------|------|--------|-------|
| **A1** | Capital Structure | 12 min | 15-25 | [A1-guide.md](./A1-guide.md) |
| **A2A** | Debt Overhang | 15 min | 20-30 | [A2A-guide.md](./A2A-guide.md) |
| **A2B** | Adverse Selection | 12 min | 15-20 | [A2B-guide.md](./A2B-guide.md) |
| **A3** | CAPM & Discount Rates | 10 min | 15-20 | [A3-guide.md](./A3-guide.md) |
| **A4** | Distress & Priority | 12 min | 15-20 | [A4-guide.md](./A4-guide.md) |
| **A5** | Payout Policy | 10 min | 12-18 | [A5-guide.md](./A5-guide.md) |
| **A6** | Risk Management | 10 min | 12-18 | [A6-guide.md](./A6-guide.md) |

**Tier 1 Total**: ~81 minutes, ~115-150 points

### Tier 2 Archetypes (20% of Exam)

| Archetype | Name | Time | Points | Guide |
|-----------|------|------|--------|-------|
| **A7** | Valuation Multiples | 8 min | 10-15 | [A7-guide.md](./A7-guide.md) |
| **A8** | Real Options | 10 min | 12-18 | [A8-guide.md](./A8-guide.md) |
| **A9** | Diversification | 8 min | 10-15 | [A9-guide.md](./A9-guide.md) |
| **A10** | Options Theory | 10 min | 12-18 | [A10-guide.md](./A10-guide.md) |

**Tier 2 Total**: ~36 minutes, ~44-66 points

---

## 📖 What Each Guide Contains

Each archetype guide includes:

1. **Overview** - Tier assignment, priority level, time budget, point value, exam weight
2. **Instant Recognition** - Keywords organized by strength (instant trigger, strong, moderate, weak)
3. **Strong Signal Combinations** - 95%+ confidence patterns
4. **Hybrid Patterns** - Common archetype combinations with solving sequences
5. **Resources** - Excel tab mappings, playbook slide references, time strategy
6. **Worked Examples** - Real problems with key insights and common mistakes
7. **5-Step Workflow** - IDENTIFY → EXTRACT → MAP → EXECUTE → CHECK

---

## 🎯 How to Use These Guides

### During Initial Study
1. Start with Tier 1 archetypes (80% of exam points)
2. Read one guide per study session
3. Practice recognition with keyword lists
4. Review worked examples and common mistakes

### During Review
1. Skim recognition keywords before exam
2. Review hybrid patterns for complex problems
3. Check 5-step workflow for each archetype
4. Verify resource mappings (Excel tabs, playbook slides)

### During Exam
1. Keep guides nearby for quick reference
2. Use keyword lists for rapid archetype identification
3. Follow 5-step workflow for systematic problem-solving
4. Check time allocations to stay on pace

---

## ⚡ Quick Access

### By Priority
- **Must Master** (Tier 1 HIGH): A1, A2A, A2B, A3, A4, A5, A6
- **Important** (Tier 2 MEDIUM): A7, A8, A9, A10

### By Time Investment
- **Quick Review** (8-10 min): A3, A5, A6, A7, A9
- **Standard** (12 min): A1, A2B, A4
- **Extended** (15 min): A2A

### By Point Value
- **High Value** (20-30 pts): A2A
- **Medium-High** (15-25 pts): A1, A2B, A3, A4
- **Medium** (12-18 pts): A5, A6, A8, A10
- **Lower** (10-15 pts): A7, A9

---

## 🔄 Regenerating Guides

These guides were auto-generated from the source data. To regenerate (e.g., after updating problem data):

```bash
# Regenerate all guides
for id in A1 A2A A2B A3 A4 A5 A6 A7 A8 A9 A10; do
  npm run archetype-guide -- "$id" --output "guides/${id}-guide.md"
done

# Regenerate single guide
npm run archetype-guide -- A1 --output guides/A1-guide.md
```

---

## 📊 Study Progress Tracker

Track your mastery as you work through each archetype:

- [ ] **A1** - Capital Structure (Tier 1)
- [ ] **A2A** - Debt Overhang (Tier 1)
- [ ] **A2B** - Adverse Selection (Tier 1)
- [ ] **A3** - CAPM & Discount Rates (Tier 1)
- [ ] **A4** - Distress & Priority (Tier 1)
- [ ] **A5** - Payout Policy (Tier 1)
- [ ] **A6** - Risk Management (Tier 1)
- [ ] **A7** - Valuation Multiples (Tier 2)
- [ ] **A8** - Real Options (Tier 2)
- [ ] **A9** - Diversification (Tier 2)
- [ ] **A10** - Options Theory (Tier 2)

**Mastery Criteria**:
- Recognize archetype from keywords in <30 seconds
- Recall Excel tab and playbook references
- Know 2-3 key insights and common mistakes
- Can execute 5-step workflow without reference

---

## 🎓 Exam Strategy Tips

### 80/20 Rule
Focus 80% of study time on Tier 1 archetypes (A1-A6) for 80% of exam points.

### Recognition Speed
Invest time in keyword memorization. Fast archetype recognition (sub-30s) creates time for careful execution.

### Hybrid Problems
Many exam questions combine multiple archetypes. Review hybrid patterns in each guide to identify solving sequences.

### Time Management
Use time allocations in guides as pacing targets. 1 point ≈ 1 minute, adjusted for archetype complexity.

### Resource Efficiency
Pre-mark Excel tabs and playbook slides for quick access during exam. Minimize time searching for resources.

---

**Generated**: 2025-11-25
**Source**: ACF Exam Prep CLI Tools
**Last Updated**: Check file timestamps for individual guide updates
