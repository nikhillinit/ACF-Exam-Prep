// src/components/ArchetypeAnalysisPanel.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Shared analysis panel for detectArchetype() results.
 *
 * This component displays the results of archetype detection including:
 * - Confidence score and matched keywords
 * - Alternative archetype suggestions
 * - Quick guide with approach and concepts
 * - Key formulas
 * - Excel tab reference
 * - Next steps
 * - Optional Guided Practice CTA (hybrid-aware)
 *
 * Props:
 * @param {object} analysis - Result from detectArchetype()
 *   - archetype: string
 *   - confidence: number (0-100)
 *   - matchedKeywords: string[]
 *   - alternativeArchetypes: { archetype: string, matchCount: number }[]
 *   - guidance: { quickGuide: string, formulas: string[], excelTab: string }
 *   - message: string (for error/no-detection cases)
 * @param {boolean} showPracticeCta - Whether to show "Open Guided Practice" button
 * @param {number} minConfidenceForPractice - Minimum confidence to enable practice CTA
 * @param {function} buildPracticePath - Function to build practice route (hybrid-aware)
 */

const ArchetypeAnalysisPanel = ({
  analysis,
  showPracticeCta = false,
  minConfidenceForPractice = 70,
  buildPracticePath, // Required when showPracticeCta is true
}) => {
  if (!analysis) return null;

  // Handle 0-confidence / "Unknown" case
  if (analysis.confidence === 0) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="bg-yellow-900/20 rounded-lg border border-yellow-500/30 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="text-lg font-bold text-yellow-400 mb-2">
                No Archetype Detected
              </h3>
              {analysis.message && (
                <p className="text-slate-300 text-sm mb-3">{analysis.message}</p>
              )}
              <p className="text-slate-400 text-xs">
                <strong>Tip:</strong> Try including more specific keywords like
                {' '}
                &quot;debt&quot;, &quot;WACC&quot;, &quot;states&quot;,
                &quot;CAPM&quot;, &quot;dividend&quot;, &quot;option&quot;, etc.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    archetype,
    confidence,
    matchedKeywords = [],
    alternativeArchetypes = [],
    guidance,
  } = analysis;

  const hasGuidance = Boolean(guidance);
  const formulas = hasGuidance && guidance.formulas ? guidance.formulas : [];
  const excelTab = hasGuidance && guidance.excelTab ? guidance.excelTab : null;

  // Build practice path if function provided
  const practicePath =
    typeof buildPracticePath === 'function' ? buildPracticePath(archetype) : null;

  const canShowPracticeCta =
    showPracticeCta &&
    confidence >= minConfidenceForPractice &&
    practicePath; // only if mapping succeeded

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Archetype Detection Card */}
      <div className="bg-blue-900/20 rounded-lg border border-blue-500/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-blue-400">
            📊 Detected Archetype
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Confidence:</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    confidence >= 70
                      ? 'bg-green-500'
                      : confidence >= 50
                      ? 'bg-yellow-500'
                      : 'bg-orange-500'
                  }`}
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <span
                className={`text-sm font-bold ${
                  confidence >= 70
                    ? 'text-green-400'
                    : confidence >= 50
                    ? 'text-yellow-400'
                    : 'text-orange-400'
                }`}
              >
                {confidence}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg font-mono text-lg font-bold">
            {archetype}
          </span>
        </div>

        {/* Matched Keywords */}
        {matchedKeywords.length > 0 && (
          <div>
            <p className="text-xs text-slate-400 mb-2">Detected keywords:</p>
            <div className="flex flex-wrap gap-2">
              {matchedKeywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded text-xs font-mono"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Alternative Archetypes */}
        {alternativeArchetypes && alternativeArchetypes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-400 mb-2">Could also be:</p>
            <div className="flex flex-wrap gap-2">
              {alternativeArchetypes.map((alt, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-slate-700 text-slate-400 rounded text-xs"
                >
                  {alt.archetype} ({alt.matchCount} matches)
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Guide */}
      {hasGuidance && guidance.quickGuide && (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-xl font-bold text-purple-400 mb-4">
            💡 Quick Guide
          </h3>
          <div className="prose prose-invert max-w-none">
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
              {guidance.quickGuide}
            </pre>
          </div>
        </div>
      )}

      {/* Key Formulas */}
      {hasGuidance && formulas.length > 0 && (
        <div className="bg-yellow-900/20 rounded-lg border border-yellow-500/30 p-6">
          <h3 className="text-lg font-bold text-yellow-400 mb-3">
            📐 Key Formulas
          </h3>
          <div className="space-y-2">
            {formulas.map((formula, idx) => (
              <div
                key={idx}
                className="bg-slate-900/50 rounded p-3 font-mono text-sm text-yellow-300"
              >
                {formula}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Excel Reference */}
      {hasGuidance && excelTab && (
        <div className="bg-green-900/20 rounded-lg border border-green-500/30 p-6">
          <h3 className="text-lg font-bold text-green-400 mb-3">
            📊 Excel Reference
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-slate-300">Open Excel tab:</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded font-mono">
              {excelTab}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            This tab contains pre-built templates and formulas for this archetype.
          </p>
        </div>
      )}

      {/* Next Steps + optional Guided Practice CTA */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/30 p-6">
        <h3 className="text-lg font-bold text-purple-400 mb-3">
          🎯 Next Steps
        </h3>
        <ol className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-purple-400 font-bold">1.</span>
            <span>Review the Quick Guide above to understand the approach.</span>
          </li>
          {excelTab && (
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">2.</span>
              <span>
                Open the Excel tab:{' '}
                <code className="text-green-300">{excelTab}</code>
              </span>
            </li>
          )}
          <li className="flex items-start gap-2">
            <span className="text-purple-400 font-bold">
              {excelTab ? '3.' : '2.'}
            </span>
            <span>Extract the key parameters from your problem.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 font-bold">
              {excelTab ? '4.' : '3.'}
            </span>
            <span>Work through the problem using the suggested approach.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 font-bold">
              {excelTab ? '5.' : '4.'}
            </span>
            <span>
              Check your answer against the common mistakes listed in the guide.
            </span>
          </li>
        </ol>

        {canShowPracticeCta && (
          <div className="mt-6">
            <Link to={practicePath}>
              <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-all">
                💡 Open Guided Practice for {archetype}
              </button>
            </Link>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Enabled because confidence is {confidence}%, which is at or above
              the {minConfidenceForPractice}% practice threshold.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchetypeAnalysisPanel;
