/**
 * Problem Parser - Converts Markdown to JSON
 *
 * Parses structured markdown files containing ACF exam problems
 * and converts them into the JSON schema used by the platform.
 *
 * Markdown Format:
 * ---
 * archetype: A1-CapitalStructure
 * difficulty: core
 * time: 25
 * ---
 *
 * # Problem Statement
 * ...
 *
 * ## Part A
 * Question text
 *
 * ### Solution
 * **Reasoning:** ...
 * **Calculation:** ...
 * **Answer:** ...
 */

/**
 * Parse frontmatter (YAML-style metadata at top of markdown)
 * @private
 */
const parseFrontmatter = (content) => {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content };
  }

  const frontmatterText = match[1];
  const remainingContent = content.slice(match[0].length);

  const frontmatter = {};
  frontmatterText.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      frontmatter[key.trim()] = value;
    }
  });

  return { frontmatter, content: remainingContent };
};

/**
 * Generate kebab-case ID from title
 * @private
 */
const generateId = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
};

/**
 * Extract problem statement (everything before first ## Part heading)
 * @private
 */
const extractProblemStatement = (content) => {
  // Extract title if present
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : 'Untitled Problem';

  // Find first ## Part or end of document
  const partMatch = content.match(/^##\s+Part\s+[A-Z]/m);

  if (partMatch) {
    const problemEnd = content.indexOf(partMatch[0]);
    const problemText = content.substring(0, problemEnd).trim();

    // Remove title line if present
    const textWithoutTitle = titleMatch
      ? problemText.replace(/^#\s+.+$/m, '').trim()
      : problemText;

    return { title, problemText: textWithoutTitle };
  }

  // No parts found, entire content is problem statement
  return { title, problemText: content.trim() };
};

/**
 * Parse a single solution step from markdown
 * @private
 */
const parseSolutionStep = (solutionText, partLabel, partPrompt, stepIndex) => {
  const step = {
    part: partLabel,
    prompt: partPrompt,
    reasoning: '',
    calculation: '',
    sanity_check: '',
    step_index: stepIndex,
    calculation_latex: null
  };

  // Extract reasoning
  const reasoningMatch = solutionText.match(/\*\*Reasoning:\*\*\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/i);
  if (reasoningMatch) {
    step.reasoning = reasoningMatch[1].trim();
  }

  // Extract calculation
  const calculationMatch = solutionText.match(/\*\*Calculation:\*\*\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/i);
  if (calculationMatch) {
    step.calculation = calculationMatch[1].trim();
  }

  // Extract answer/sanity check
  const answerMatch = solutionText.match(/\*\*Answer:\*\*\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/i);
  if (answerMatch) {
    step.sanity_check = `Answer: ${answerMatch[1].trim()}`;
  }

  // If no structured format, use entire text as reasoning
  if (!step.reasoning && !step.calculation) {
    step.reasoning = solutionText.trim();
  }

  return step;
};

/**
 * Parse all parts (A, B, C, D, etc.) from content
 * @private
 */
const parseParts = (content) => {
  const parts = [];
  const partRegex = /^##\s+Part\s+([A-Z])\s*$/gm;

  let match;
  const partPositions = [];

  // Find all part headers
  while ((match = partRegex.exec(content)) !== null) {
    partPositions.push({
      label: match[1],
      start: match.index,
      headerEnd: match.index + match[0].length
    });
  }

  // Extract content for each part
  partPositions.forEach((part, index) => {
    const nextPartStart = index < partPositions.length - 1
      ? partPositions[index + 1].start
      : content.length;

    const partContent = content.substring(part.headerEnd, nextPartStart).trim();

    // Split into prompt and solution
    const solutionMatch = partContent.match(/^###\s+Solution\s*$/m);

    if (solutionMatch) {
      const solutionStart = partContent.indexOf(solutionMatch[0]);
      const prompt = partContent.substring(0, solutionStart).trim();
      const solution = partContent.substring(solutionStart + solutionMatch[0].length).trim();

      const step = parseSolutionStep(solution, part.label, prompt, parts.length);
      parts.push(step);
    } else {
      // No solution section, entire content is prompt
      parts.push({
        part: part.label,
        prompt: partContent.trim(),
        reasoning: '',
        calculation: '',
        sanity_check: '',
        step_index: parts.length,
        calculation_latex: null
      });
    }
  });

  return parts;
};

/**
 * Extract key insights (if present)
 * @private
 */
const extractKeyInsights = (content) => {
  const insightsMatch = content.match(/^##\s+Key\s+Insights?\s*$(.+?)(?=^##|\Z)/ims);

  if (!insightsMatch) return [];

  const insightsText = insightsMatch[1].trim();
  const insights = [];

  // Parse bullet points
  const bulletRegex = /^[-*]\s+(.+)$/gm;
  let match;

  while ((match = bulletRegex.exec(insightsText)) !== null) {
    insights.push(match[1].trim());
  }

  return insights;
};

/**
 * Extract common mistakes (if present)
 * @private
 */
const extractCommonMistakes = (content) => {
  const mistakesMatch = content.match(/^##\s+Common\s+Mistakes?\s*$(.+?)(?=^##|\Z)/ims);

  if (!mistakesMatch) return [];

  const mistakesText = mistakesMatch[1].trim();
  const mistakes = [];

  // Parse bullet points
  const bulletRegex = /^[-*]\s+(.+)$/gm;
  let match;

  while ((match = bulletRegex.exec(mistakesText)) !== null) {
    mistakes.push(match[1].trim());
  }

  return mistakes;
};

/**
 * Main parsing function
 * Converts markdown content to JSON problem object
 *
 * @param {string} markdownContent - Full markdown file content
 * @param {object} options - Optional overrides
 * @returns {object} JSON problem object
 */
export const parseMarkdownProblem = (markdownContent, options = {}) => {
  // Parse frontmatter
  const { frontmatter, content } = parseFrontmatter(markdownContent);

  // Extract problem statement and title
  const { title, problemText } = extractProblemStatement(content);

  // Parse solution parts
  const solutionSteps = parseParts(content);

  // Extract additional sections
  const keyInsights = extractKeyInsights(content);
  const commonMistakes = extractCommonMistakes(content);

  // Build problem object matching schema
  const problem = {
    id: options.id || generateId(title),
    problem_text: problemText,
    problem_intro: problemText, // Same as problem_text for compatibility
    archetype: frontmatter.archetype || options.archetype || 'Unknown',
    primary_archetype: frontmatter.archetype || options.archetype || 'Unknown',
    content_type: options.contentType || 'guided',
    difficulty: frontmatter.difficulty || options.difficulty || 'core',
    estimated_time_minutes: parseInt(frontmatter.time) || options.time || 25,
    solution_steps: solutionSteps,
    key_insights: keyInsights,
    common_mistakes: commonMistakes,
    learning_graph: {
      prerequisite_ids: [],
      next_step_ids: [],
      variant_ids: []
    }
  };

  return problem;
};

/**
 * Validate problem object against schema
 * @param {object} problem - Problem object to validate
 * @returns {object} { valid: boolean, errors: array }
 */
export const validateProblem = (problem) => {
  const errors = [];

  // Required fields
  if (!problem.id) errors.push('Missing required field: id');
  if (!problem.problem_text) errors.push('Missing required field: problem_text');
  if (!problem.archetype) errors.push('Missing required field: archetype');
  if (!problem.solution_steps || problem.solution_steps.length === 0) {
    errors.push('Missing required field: solution_steps (must have at least one step)');
  }

  // Validate solution steps
  problem.solution_steps?.forEach((step, index) => {
    if (!step.part) errors.push(`Step ${index}: Missing part label`);
    if (!step.prompt) errors.push(`Step ${index}: Missing prompt`);
  });

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Parse multiple markdown files (batch processing)
 * @param {array} markdownFiles - Array of {filename, content} objects
 * @returns {array} Array of parsed problem objects
 */
export const parseBatch = (markdownFiles) => {
  const problems = [];
  const errors = [];

  markdownFiles.forEach((file, index) => {
    try {
      const problem = parseMarkdownProblem(file.content, {
        id: file.id || `problem-${index + 1}`
      });

      const validation = validateProblem(problem);
      if (validation.valid) {
        problems.push(problem);
      } else {
        errors.push({
          filename: file.filename,
          errors: validation.errors
        });
      }
    } catch (error) {
      errors.push({
        filename: file.filename,
        errors: [error.message]
      });
    }
  });

  return { problems, errors };
};

// Default export
export default {
  parseMarkdownProblem,
  validateProblem,
  parseBatch
};
