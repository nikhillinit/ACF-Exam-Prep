# Comparative Deviation Analysis System
## Documentation Navigation Guide

**Version**: 1.0
**Last Updated**: 2025-01-25
**Status**: Complete ✅

---

## Quick Navigation

### I want to...

**...understand what this system does**
→ Start with [System Overview](#system-overview) below

**...use comp analysis in my component**
→ Go to [Integration Guide](guides/integrating-comp-analysis.md)

**...understand the API functions**
→ Go to [API Reference](api/comparative-analysis-api.md)

**...understand the architecture**
→ Go to [Architecture Guide](architecture/comparative-analysis.md)

**...debug a problem**
→ Go to [Troubleshooting Guide](troubleshooting/comp-analysis.md)

**...understand design decisions**
→ Go to [Design Decisions](DESIGN_DECISIONS.md)

**...see everything in one place**
→ Go to [Complete Documentation](comparative-analysis/README.md)

---

## System Overview

### What It Does

The Comparative Deviation Analysis System automatically:

1. **Finds** the most similar problem from your library (hybrid similarity scoring)
2. **Highlights** where your problem differs (additional/missing deviations, new concepts)
3. **Guides** you step-by-step on how to adapt the comparable's approach

### Why It Matters

**For Students**:
- "I've seen something like this before, but what's different?"
- Connects new problems to known solutions
- Provides scaffolded learning before showing full solution

**For Instructors**:
- Identifies which problems need more worked examples
- Shows problem coverage gaps
- Helps students build problem-solving intuition

**For Developers**:
- Offline-first (works without internet)
- Auto-runs (no user action needed)
- Fast (~10ms for 224 problems)
- Leverages existing data (DEVIATION_DATABASE)

### Key Innovation

**Progressive Disclosure**: Three levels of help

```
Level 1 (Automatic)
┌─────────────────────────────────────┐
│ 🔍 Similar to: "Problem X" (85%)   │
│ Your problem adds: Tax Shields      │
│ [View Guidance] [Show Solution]    │
└─────────────────────────────────────┘

Level 2 (Optional) - Click "View Guidance"
┌─────────────────────────────────────┐
│ 📋 How to Adapt:                   │
│ 1. Start with comp's approach      │
│ 2. Then add: Discount at r_D       │
│ 3. Verify: Tax shields if paid     │
└─────────────────────────────────────┘

Level 3 (Override) - Click "Show Solution"
┌─────────────────────────────────────┐
│ 📝 Complete Solution                │
│ [Full worked solution steps...]    │
└─────────────────────────────────────┘
```

---

## Documentation Map

### Core Documentation (Start Here)

| Document | Purpose | Time to Read | Audience |
|----------|---------|--------------|----------|
| **[Complete Documentation](comparative-analysis/README.md)** | All-in-one reference | 20 min | Everyone |
| **[Architecture Guide](architecture/comparative-analysis.md)** | System design, components, data flow | 30 min | Developers, Architects |
| **[API Reference](api/comparative-analysis-api.md)** | Function signatures, examples | 15 min | Developers |
| **[Integration Guide](guides/integrating-comp-analysis.md)** | How to add to components | 25 min | Frontend Devs |

### Supporting Documentation

| Document | Purpose | Time to Read | Audience |
|----------|---------|--------------|----------|
| **[Troubleshooting Guide](troubleshooting/comp-analysis.md)** | Debugging, common issues | 20 min | Developers, Support |
| **[Design Decisions](DESIGN_DECISIONS.md)** | Rationale for choices | 15 min | Architects, PMs |
| **[Design Document](plans/2025-01-25-comparative-deviation-analysis.md)** | Original design spec | 25 min | Historical reference |

### Code & Tests

| File | Purpose | LOC |
|------|---------|-----|
| **[problemMatcher.js](../src/utils/problemMatcher.js)** | Core engine (backend) | 740 |
| **[ProblemViewer.jsx](../src/components/practice/ProblemViewer.jsx)** | Primary UI integration | 530 |
| **[ReconView.jsx](../src/components/reconnaissance/ReconView.jsx)** | Secondary UI (paste text) | 290 |
| **[problemMatcher.test.js](../src/utils/problemMatcher.test.js)** | Backend tests (100% coverage) | 330 |
| **[ProblemViewer.test.jsx](../src/components/practice/ProblemViewer.test.jsx)** | Frontend tests (95% coverage) | 305 |

---

## Documentation Structure

### 1. Architecture Guide

**File**: `docs/architecture/comparative-analysis.md`

**Sections**:
- Executive Summary
- System Overview (diagrams, boundaries)
- Architectural Components (engine, UI, data)
- Data Flow (sequence diagrams)
- Integration Architecture
- Performance Architecture
- Design Patterns
- Technology Stack

**Use this when**:
- You need to understand how the system works
- You're reviewing the architecture
- You're planning extensions
- You're evaluating the design

**Key Diagrams**:
- High-level architecture diagram
- Data flow sequence diagram
- Component interaction diagram

---

### 2. API Reference

**File**: `docs/api/comparative-analysis-api.md`

**Sections**:
- Core Functions (detailed docs for each)
- Helper Functions
- Data Structures (with TypeScript definitions)
- Usage Examples (6 real-world scenarios)
- Error Handling
- Performance Tips

**Use this when**:
- You need function signatures
- You want to see code examples
- You're implementing integration
- You need parameter details

**Key Functions**:
```javascript
findClosestCompWithDivergenceAnalysis(targetProblem, problemLibrary, threshold?)
generateAdaptationGuidance({ additionalDeviations, missingDeviations, ... })
inferCompApproach(compProblem)
calculateSimilarity(problem1, problem2)
```

---

### 3. Integration Guide

**File**: `docs/guides/integrating-comp-analysis.md`

**Sections**:
- Quick Start (5-minute minimal integration)
- Integration Patterns (4 common patterns)
- UI Components (reusable components)
- Customization (thresholds, filters, guidance)
- Extension Patterns (add deviations, archetypes)
- Testing Integration
- Common Scenarios (exam prep, recommendations, analytics)

**Use this when**:
- You're adding comp analysis to a new component
- You want to customize behavior
- You need reusable UI components
- You're extending the system

**Key Patterns**:
- Auto-compute on problem change
- On-demand analysis (user-triggered)
- Pasted text analysis
- Progressive disclosure UI

---

### 4. Troubleshooting Guide

**File**: `docs/troubleshooting/comp-analysis.md`

**Sections**:
- Quick Diagnostics (decision tree)
- Common Issues (5 major issues with solutions)
- Debugging Techniques (4 debugging methods)
- Performance Issues (optimization strategies)
- Data Quality Issues (audit scripts)
- UI Integration Issues
- FAQ (6 common questions)

**Use this when**:
- Something isn't working
- Similarity scores are unexpected
- Performance is slow
- Guidance isn't generating
- You need to debug

**Key Techniques**:
- Similarity breakdown analysis
- Feature extraction validation
- Divergence analysis tracing
- End-to-end tracing

---

### 5. Design Decisions

**File**: `docs/DESIGN_DECISIONS.md`

**Sections**:
- Comparative Analysis System (6 key decisions)
- Deviation Injection System
- Data Architecture
- UI/UX Patterns
- Future Decisions to Make

**Use this when**:
- You want to understand "why"
- You're proposing changes
- You're reviewing architecture
- You need historical context

**Key Decisions**:
- Why 70% similarity threshold?
- Why progressive disclosure?
- Why step-level guidance?
- Why leverage DEVIATION_DATABASE?
- Why 40/35/25 weighting?

---

## Learning Paths

### Path 1: I'm a New Developer

**Goal**: Understand and integrate comp analysis

1. **Start**: [Complete Documentation](comparative-analysis/README.md) - Overview section (5 min)
2. **Next**: [Integration Guide](guides/integrating-comp-analysis.md) - Quick Start (5 min)
3. **Try It**: Implement minimal integration in test component (15 min)
4. **Understand**: [Architecture Guide](architecture/comparative-analysis.md) - System Overview (10 min)
5. **Deep Dive**: [API Reference](api/comparative-analysis-api.md) - Core Functions (15 min)
6. **Troubleshoot**: [Troubleshooting Guide](troubleshooting/comp-analysis.md) - As needed

**Total**: ~50 minutes to productivity

---

### Path 2: I'm an Architect/Reviewer

**Goal**: Evaluate design and architecture

1. **Start**: [Complete Documentation](comparative-analysis/README.md) - Full read (20 min)
2. **Design**: [Design Decisions](DESIGN_DECISIONS.md) - All sections (15 min)
3. **Architecture**: [Architecture Guide](architecture/comparative-analysis.md) - Full read (30 min)
4. **Code**: Review [problemMatcher.js](../src/utils/problemMatcher.js) (15 min)
5. **Tests**: Review test coverage reports (10 min)

**Total**: ~90 minutes to comprehensive understanding

---

### Path 3: I'm Troubleshooting an Issue

**Goal**: Fix specific problem quickly

1. **Start**: [Troubleshooting Guide](troubleshooting/comp-analysis.md) - Decision tree (2 min)
2. **Identify**: Find matching issue in Common Issues (5 min)
3. **Debug**: Use relevant debugging technique (10 min)
4. **Understand**: [API Reference](api/comparative-analysis-api.md) - Relevant function (5 min)
5. **Test**: Verify fix with unit tests (10 min)

**Total**: ~30 minutes to resolution

---

### Path 4: I'm Extending the System

**Goal**: Add new deviation or archetype

1. **Understand**: [Architecture Guide](architecture/comparative-analysis.md) - Components (15 min)
2. **Learn**: [Integration Guide](guides/integrating-comp-analysis.md) - Extension Patterns (10 min)
3. **Reference**: [API Reference](api/comparative-analysis-api.md) - Data Structures (5 min)
4. **Implement**: Follow extension guide steps (20 min)
5. **Test**: Write unit tests for new functionality (20 min)

**Total**: ~70 minutes to extension

---

## Document Standards

### Formatting Conventions

**Code Blocks**:
```javascript
// Always specify language for syntax highlighting
function example() {
  return 'code here';
}
```

**File References**:
- Use absolute paths: `src/utils/problemMatcher.js`
- Include line numbers when relevant: `problemMatcher.js:209-211`

**Cross-References**:
- Use relative links: `[Architecture Guide](../architecture/comparative-analysis.md)`
- Include section anchors: `[System Overview](#system-overview)`

**Diagrams**:
- ASCII art for simple diagrams
- Mermaid syntax for complex flows (if supported)
- Detailed textual descriptions as fallback

**Tables**:
- Use for structured comparisons
- Include headers
- Align columns for readability

---

## Maintenance Schedule

### Quarterly Review (Every 3 Months)

**Check**:
- [ ] Are all links working?
- [ ] Are code examples still accurate?
- [ ] Have new decisions been documented?
- [ ] Are performance numbers current?
- [ ] Are new features documented?

### On Major Changes

**Update**:
- [ ] Architecture diagrams if components change
- [ ] API reference if function signatures change
- [ ] Integration guide if patterns change
- [ ] Troubleshooting guide if new issues found
- [ ] Design decisions if key choices made

### On Bug Fixes

**Add**:
- [ ] New issue to Troubleshooting Guide
- [ ] Debugging technique if novel
- [ ] FAQ entry if question repeats

---

## Documentation Metrics

### Completeness

| Category | Status | Coverage |
|----------|--------|----------|
| **Architecture** | ✅ Complete | 100% |
| **API Reference** | ✅ Complete | 100% |
| **Integration** | ✅ Complete | 100% |
| **Troubleshooting** | ✅ Complete | 100% |
| **Design Decisions** | ✅ Complete | 100% |
| **Code Comments** | ✅ Complete | 95% |
| **Test Coverage** | ✅ Complete | 98% |

### Quality Indicators

- **Code Examples**: 20+ complete examples across docs
- **Diagrams**: 5 architectural diagrams
- **Cross-References**: 50+ internal links
- **External References**: Links to original design, tests, code
- **Search Terms**: Optimized for common queries
- **Accessibility**: Clear headings, tables, lists for screen readers

---

## Contributing to Documentation

### Adding New Sections

1. Identify gap in existing docs
2. Choose appropriate document (or create new)
3. Follow formatting standards above
4. Add cross-references to related docs
5. Update this navigation guide
6. Review for accuracy and clarity

### Improving Existing Sections

1. Note inaccuracy or unclear explanation
2. Propose specific improvement
3. Update relevant document(s)
4. Update "Last Updated" date
5. Increment version if major change

### Documentation Philosophy

**Principles**:
- **Clarity over Brevity**: Explain thoroughly, examples help
- **Progressive Disclosure**: Overview → Details → Edge Cases
- **Multiple Perspectives**: Developers, Users, Architects
- **Practical Focus**: Real examples, common scenarios
- **Maintenance-Friendly**: Clear structure, easy to update

---

## FAQ

### Q: Which document should I read first?

**A**: Depends on your goal:
- **Overview**: [Complete Documentation](comparative-analysis/README.md)
- **Implementation**: [Integration Guide](guides/integrating-comp-analysis.md)
- **Understanding**: [Architecture Guide](architecture/comparative-analysis.md)
- **Debugging**: [Troubleshooting Guide](troubleshooting/comp-analysis.md)

### Q: How do I find a specific function?

**A**: [API Reference](api/comparative-analysis-api.md) has alphabetical index and search-friendly headers.

### Q: Where are the code examples?

**A**: Every document has examples:
- **API Reference**: 6 usage examples
- **Integration Guide**: 7 integration patterns + 3 scenarios
- **Troubleshooting**: Debug code snippets throughout

### Q: Is there a quick reference card?

**A**: [Complete Documentation](comparative-analysis/README.md) has:
- Quick start (5 min integration)
- Common use cases
- Troubleshooting checklist
- Performance table

### Q: How do I report documentation issues?

**A**:
1. Note which document and section
2. Describe inaccuracy or confusion
3. Suggest improvement if possible
4. Submit via GitHub issues or direct contact

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-25 | Complete documentation suite created:<br>- Architecture Guide<br>- API Reference<br>- Integration Guide<br>- Troubleshooting Guide<br>- Design Decisions<br>- Complete Documentation<br>- Navigation Guide (this doc) |

---

## Next Steps

### If You're New
1. Read [Complete Documentation](comparative-analysis/README.md) overview (10 min)
2. Try [Integration Guide](guides/integrating-comp-analysis.md) quick start (5 min)
3. Explore [API Reference](api/comparative-analysis-api.md) as needed

### If You're Experienced
1. Review [Architecture Guide](architecture/comparative-analysis.md) for deep understanding
2. Check [Design Decisions](DESIGN_DECISIONS.md) for rationale
3. Extend using [Integration Guide](guides/integrating-comp-analysis.md) patterns

### If You're Stuck
1. Start with [Troubleshooting Guide](troubleshooting/comp-analysis.md) decision tree
2. Use debugging techniques section
3. Check FAQ for common questions

---

**Happy Coding!**

For questions, issues, or contributions, see the support section in [Complete Documentation](comparative-analysis/README.md).

---

**Document Version**: 1.0
**Last Updated**: 2025-01-25
**Maintained By**: ACF Exam Prep Development Team
