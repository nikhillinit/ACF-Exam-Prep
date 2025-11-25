/**
 * Markdown Formatter
 *
 * Formats synthesized archetype data into clean, readable markdown.
 */

class MarkdownFormatter {
  /**
   * Format complete archetype guide as markdown
   * @param {Object} guideData - Synthesized guide data
   * @returns {string} Formatted markdown
   */
  format(guideData) {
    const sections = [
      this.formatHeader(guideData.header),
      this.formatRecognition(guideData.recognition, guideData.header),
      this.formatResources(guideData.resources),
      this.formatExamples(guideData.examples),
      this.formatWorkflow(guideData.workflow),
      this.formatFooter(guideData.metadata)
    ];

    return sections.join('\n\n---\n\n');
  }

  /**
   * Format header section
   */
  formatHeader(header) {
    return `# ${header.id}: ${header.name} - Quick Reference Guide

## Overview
**Tier**: ${header.tier} (${header.priority} Priority) | **Time Budget**: ${header.timeAllocation} min | **Points**: ${header.pointValue} | **Exam Weight**: ${header.examWeight}`;
  }

  /**
   * Format recognition section
   */
  formatRecognition(recognition, header) {
    const { keywordsByStrength, strongSignals, hybridPatterns } = recognition;

    let output = '## Instant Recognition\n\n';

    // Keywords by strength
    output += '### INSTANT TRIGGER Keywords (Weight: 4+)\n';
    if (keywordsByStrength.INSTANT_TRIGGER.length > 0) {
      keywordsByStrength.INSTANT_TRIGGER.forEach(kw => {
        output += `- ${kw.keyword}\n`;
      });
    } else {
      output += '- None for this archetype\n';
    }

    output += '\n### STRONG Keywords (Weight: 3+)\n';
    if (keywordsByStrength.STRONG.length > 0) {
      keywordsByStrength.STRONG.forEach(kw => {
        output += `- ${kw.keyword}\n`;
      });
    } else {
      output += '- None for this archetype\n';
    }

    output += '\n### MODERATE Keywords (Weight: 2+)\n';
    if (keywordsByStrength.MODERATE.length > 0) {
      keywordsByStrength.MODERATE.forEach(kw => {
        output += `- ${kw.keyword}\n`;
      });
    } else {
      output += '- None for this archetype\n';
    }

    output += '\n### WEAK Keywords (Weight: 1)\n';
    if (keywordsByStrength.WEAK.length > 0) {
      const weakKeywords = keywordsByStrength.WEAK.slice(0, 10); // Limit to 10
      weakKeywords.forEach(kw => {
        output += `- ${kw.keyword}\n`;
      });
      if (keywordsByStrength.WEAK.length > 10) {
        output += `- ... and ${keywordsByStrength.WEAK.length - 10} more\n`;
      }
    } else {
      output += '- None for this archetype\n';
    }

    // Strong signal combinations
    if (strongSignals.length > 0) {
      output += '\n### Strong Signal Combinations (95%+ Confidence)\n';
      strongSignals.forEach((signal, idx) => {
        output += `${idx + 1}. ${signal.description}\n`;
      });
    }

    // Hybrid patterns
    if (hybridPatterns.length > 0) {
      output += '\n## Hybrid Patterns\n';
      hybridPatterns.forEach(pattern => {
        output += `- **${pattern.combination}**: ${pattern.description}\n`;
        output += `  - Frequency: ${pattern.frequency}\n`;
        output += `  - Sequence: ${pattern.sequence}\n\n`;
      });
    }

    return output;
  }

  /**
   * Format resources section
   */
  formatResources(resources) {
    let output = '## Resources\n\n';

    output += '### Excel Template\n';
    output += `- **Tab**: ${resources.excelTab}\n`;
    output += '- **Color Code**: \n';
    output += '  - BLUE cells = Your inputs\n';
    output += '  - YELLOW highlights = Key outputs\n';
    output += '  - BLACK = Auto-calculated formulas\n\n';

    if (resources.playbookSlides && resources.playbookSlides.length > 0) {
      output += '### Playbook Reference\n';
      output += `- **Slides**: ${resources.playbookSlides.join(', ')}\n\n`;
    }

    output += '### Time Strategy\n';
    output += `- **Allocation**: ${resources.timeStrategy.allocation} minutes\n`;
    output += `- **Buffer**: +${resources.timeStrategy.buffer} min for verification\n`;
    output += `- **Rule**: ${resources.timeStrategy.rule}\n`;

    return output;
  }

  /**
   * Format examples section
   */
  formatExamples(examples) {
    if (!examples || examples.length === 0) {
      return '## Worked Examples\n\nNo examples available for this archetype.';
    }

    let output = '## Worked Examples\n\n';

    examples.forEach((example, idx) => {
      output += `### Example ${idx + 1}: ${example.id}\n`;
      output += `**Problem**: ${example.problemText}\n\n`;

      if (example.keyInsights && example.keyInsights.length > 0) {
        output += '**Key Insights**:\n';
        example.keyInsights.forEach(insight => {
          output += `- ${insight}\n`;
        });
        output += '\n';
      }

      if (example.commonMistakes && example.commonMistakes.length > 0) {
        output += '**Common Mistakes**:\n';
        example.commonMistakes.forEach(mistake => {
          output += `- ${mistake}\n`;
        });
        output += '\n';
      }

      if (example.solutionApproach && example.solutionApproach.length > 0) {
        output += '**Solution Approach**:\n';
        example.solutionApproach.forEach(step => {
          output += `${step.stepNumber}. ${step.title}\n`;
          if (step.summary) {
            output += `   ${step.summary}\n`;
          }
        });
        output += '\n';
      }
    });

    return output;
  }

  /**
   * Format workflow section (5-step)
   */
  formatWorkflow(workflow) {
    let output = '## 5-Step Workflow\n\n';

    const steps = [
      { name: 'IDENTIFY', data: workflow.identify },
      { name: 'EXTRACT', data: workflow.extract },
      { name: 'MAP', data: workflow.map },
      { name: 'EXECUTE', data: workflow.execute },
      { name: 'CHECK', data: workflow.check }
    ];

    steps.forEach(step => {
      output += `### ${step.name} (${step.data.time})\n`;
      step.data.tasks.forEach(task => {
        output += `- ${task}\n`;
      });
      output += '\n';
    });

    return output;
  }

  /**
   * Format footer with metadata
   */
  formatFooter(metadata) {
    return `---\nGenerated: ${metadata.generatedAt} | Source: ${metadata.sources.join(', ')}`;
  }
}

module.exports = new MarkdownFormatter();
