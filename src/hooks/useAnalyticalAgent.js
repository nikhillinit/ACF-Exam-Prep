/**
 * useAnalyticalAgent Hook
 *
 * React hook for accessing the analytical agent functionality.
 * Provides state management, caching, and error handling for problem analysis.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import problemAnalyzer from '../utils/analyticalAgent/problemAnalyzer';

/**
 * Generate cache key for a problem
 */
const getCacheKey = (problemText) => {
  // Simple hash function for cache key
  let hash = 0;
  for (let i = 0; i < problemText.length; i++) {
    const char = problemText.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `analysis_${hash}`;
};

/**
 * Load cached analysis from localStorage
 */
const loadFromCache = (cacheKey) => {
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Check if cache is less than 24 hours old
      const cacheAge = Date.now() - new Date(parsed.cachedAt).getTime();
      if (cacheAge < 24 * 60 * 60 * 1000) {
        return parsed.data;
      }
    }
  } catch (e) {
    console.warn('Failed to load from cache:', e);
  }
  return null;
};

/**
 * Save analysis to localStorage
 */
const saveToCache = (cacheKey, data) => {
  try {
    localStorage.setItem(cacheKey, JSON.stringify({
      data,
      cachedAt: new Date().toISOString()
    }));
  } catch (e) {
    console.warn('Failed to save to cache:', e);
  }
};

/**
 * Custom hook for analytical agent
 */
export const useAnalyticalAgent = (options = {}) => {
  const {
    enableCache = true,
    includeCalculations = true,
    includeExamples = true,
    includeDeviations = true
  } = options;

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Track ongoing analysis to prevent duplicate requests
  const abortControllerRef = useRef(null);

  /**
   * Analyze a problem
   */
  const analyzeProblem = useCallback(async (problemText) => {
    if (!problemText || problemText.trim().length === 0) {
      setError('Problem text cannot be empty');
      return null;
    }

    // Cancel any ongoing analysis
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setLoading(true);
    setError(null);

    try {
      // Check cache first
      if (enableCache) {
        const cacheKey = getCacheKey(problemText);
        const cached = loadFromCache(cacheKey);
        if (cached) {
          setAnalysis(cached);
          setLoading(false);
          return cached;
        }
      }

      // Check if aborted before starting analysis
      if (signal.aborted) {
        throw new Error('Analysis cancelled');
      }

      // Run analysis
      const result = await problemAnalyzer.analyzeProblem(problemText, {
        includeCalculations,
        includeExamples,
        includeDeviations
      });

      // Check if aborted after analysis
      if (signal.aborted) {
        throw new Error('Analysis cancelled');
      }

      // Save to cache
      if (enableCache) {
        const cacheKey = getCacheKey(problemText);
        saveToCache(cacheKey, result);
      }

      setAnalysis(result);
      setLoading(false);
      return result;

    } catch (err) {
      if (err.message !== 'Analysis cancelled') {
        console.error('Analysis error:', err);
        setError(err.message);
      }
      setLoading(false);
      return null;
    }
  }, [enableCache, includeCalculations, includeExamples, includeDeviations]);

  /**
   * Clear current analysis
   */
  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  /**
   * Clear cache for a specific problem
   */
  const clearCache = useCallback((problemText) => {
    try {
      const cacheKey = getCacheKey(problemText);
      localStorage.removeItem(cacheKey);
    } catch (e) {
      console.warn('Failed to clear cache:', e);
    }
  }, []);

  /**
   * Clear all analysis cache
   */
  const clearAllCache = useCallback(() => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('analysis_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn('Failed to clear all cache:', e);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    analysis,
    loading,
    error,
    analyzeProblem,
    clearAnalysis,
    clearCache,
    clearAllCache
  };
};

/**
 * Hook for batch analysis (parallelized)
 */
export const useBatchAnalyticalAgent = (options = {}) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });

  /**
   * Analyze multiple problems in parallel
   */
  const analyzeProblems = useCallback(async (problemTexts, maxConcurrency = 3) => {
    if (!problemTexts || problemTexts.length === 0) {
      setError('No problems to analyze');
      return [];
    }

    setLoading(true);
    setError(null);
    setProgress({ completed: 0, total: problemTexts.length });
    setResults([]);

    const allResults = [];
    const chunks = [];

    // Split into chunks for controlled parallelization
    for (let i = 0; i < problemTexts.length; i += maxConcurrency) {
      chunks.push(problemTexts.slice(i, i + maxConcurrency));
    }

    try {
      for (const chunk of chunks) {
        const chunkPromises = chunk.map(text =>
          problemAnalyzer.analyzeProblem(text, options)
            .catch(err => ({ error: err.message, problemText: text }))
        );

        const chunkResults = await Promise.all(chunkPromises);
        allResults.push(...chunkResults);

        setProgress({ completed: allResults.length, total: problemTexts.length });
        setResults([...allResults]);
      }

      setLoading(false);
      return allResults;

    } catch (err) {
      console.error('Batch analysis error:', err);
      setError(err.message);
      setLoading(false);
      return allResults;
    }
  }, [options]);

  return {
    results,
    loading,
    error,
    progress,
    analyzeProblems
  };
};

export default useAnalyticalAgent;
