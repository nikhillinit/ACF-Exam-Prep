/**
 * Test Suite for ProblemViewer with Comparative Analysis
 *
 * Tests the progressive disclosure UI for comp analysis
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProblemViewer from './ProblemViewer';
import * as problemMatcher from '../../utils/problemMatcher';

// Mock the problemMatcher module
jest.mock('../../utils/problemMatcher');

// Mock fetch for problem data
global.fetch = jest.fn();

const mockProblems = [
  {
    id: 'problem-1',
    title: 'Bond Default with Multiple Tranches',
    archetype: 'A1-CapitalStructure',
    problem_text: 'Calculate expected returns for senior and junior debt...',
    deviations: ['DEV-1.2.1', 'DEV-4.1.1'],
    keywords: ['debt', 'default', 'senior', 'junior', 'tax shield'],
    solution_steps: [
      {
        part: 'Step 1',
        reasoning: 'Calculate expected return on senior debt',
        calculation: 'E[r_senior] = 4.2%'
      }
    ]
  },
  {
    id: 'problem-2',
    title: 'Bond Default with Hazard Rate',
    archetype: 'A1-CapitalStructure',
    problem_text: 'Calculate expected returns on debt...',
    deviations: ['DEV-1.1.1'],
    keywords: ['debt', 'default', 'YTM', 'CAPM'],
    solution_steps: []
  }
];

const mockCompAnalysis = {
  hasComp: true,
  closestComp: mockProblems[1],
  similarityScore: 0.85,
  divergenceAnalysis: {
    additionalDeviations: ['DEV-1.2.1', 'DEV-4.1.1'],
    missingDeviations: [],
    additionalConcepts: ['tax shield', 'senior', 'junior'],
    adaptationGuidance: [
      {
        type: 'additional_complexity',
        code: 'DEV-1.2.1',
        title: 'Your problem adds: Tax Shield Discount Rate',
        description: 'Unlike the comparable, your problem involves tax shields',
        adaptationSteps: [
          "Start with comp's approach: Calculate expected returns on debt",
          'Then add: Discount tax shields at r_D (debt rate)',
          'Verify: Tax shields exist only if debt is paid'
        ],
        timeImpact: 2.5,
        severity: 'high'
      },
      {
        type: 'additional_complexity',
        code: 'DEV-4.1.1',
        title: 'Your problem adds: Absolute Priority Rule Waterfall',
        description: 'Unlike the comparable, your problem involves multiple tranches',
        adaptationSteps: [
          "Start with comp's approach: Calculate expected debt returns",
          'Then add: Apply waterfall (Senior → Junior → Equity)',
          'Verify: Senior gets paid first, up to full amount'
        ],
        timeImpact: 2.5,
        severity: 'critical'
      }
    ]
  }
};

const mockNoCompAnalysis = {
  hasComp: false,
  closestComp: null,
  similarityScore: 0.45,
  divergenceAnalysis: null
};

describe('ProblemViewer with Comp Analysis', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock fetch responses
    fetch.mockImplementation((url) => {
      if (url.includes('guided_examples_v11.json')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ worked_examples: mockProblems })
        });
      }
      if (url.includes('mock_questions_v11.json')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ worked_examples: [] })
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ProblemViewer />
      </BrowserRouter>
    );
  };

  test('auto-computes comp analysis on problem load', async () => {
    // Mock the comparative analysis function
    problemMatcher.findClosestCompWithDivergenceAnalysis = jest.fn(() => mockCompAnalysis);

    renderComponent();

    // Wait for problems to load
    await waitFor(() => {
      expect(screen.getByText(/Bond Default with Multiple Tranches/i)).toBeInTheDocument();
    });

    // Verify comp analysis was computed
    await waitFor(() => {
      expect(problemMatcher.findClosestCompWithDivergenceAnalysis).toHaveBeenCalled();
    });
  });

  test('displays comp summary with divergences', async () => {
    problemMatcher.findClosestCompWithDivergenceAnalysis = jest.fn(() => mockCompAnalysis);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Bond Default with Multiple Tranches/i)).toBeInTheDocument();
    });

    // Check for comp summary card
    await waitFor(() => {
      expect(screen.getByText(/Similar to:/i)).toBeInTheDocument();
      expect(screen.getByText(/Bond Default with Hazard Rate/i)).toBeInTheDocument();
      expect(screen.getByText(/85%/i)).toBeInTheDocument();
    });

    // Check for divergences (using getAllByText since there are multiple instances)
    expect(screen.getAllByText(/Your problem adds:/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Tax Shield Discount Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Absolute Priority Rule Waterfall/i)).toBeInTheDocument();
  });

  test('shows guidance when View Guidance button clicked', async () => {
    problemMatcher.findClosestCompWithDivergenceAnalysis = jest.fn(() => mockCompAnalysis);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Bond Default with Multiple Tranches/i)).toBeInTheDocument();
    });

    // Click "View Guidance" button
    const viewGuidanceButton = await screen.findByText(/View.*Guidance/i);
    fireEvent.click(viewGuidanceButton);

    // Check for adaptive guidance panel
    await waitFor(() => {
      expect(screen.getByText(/How to Adapt from the Comparable/i)).toBeInTheDocument();
    });

    // Check for adaptation steps
    expect(screen.getByText(/Calculate expected returns on debt/i)).toBeInTheDocument();
    expect(screen.getByText(/Discount tax shields at r_D/i)).toBeInTheDocument();
  });

  test('shows solution when Show Solution clicked', async () => {
    problemMatcher.findClosestCompWithDivergenceAnalysis = jest.fn(() => mockCompAnalysis);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Bond Default with Multiple Tranches/i)).toBeInTheDocument();
    });

    // Click "Show Solution" button (there may be multiple, get the first one)
    const showSolutionButtons = await screen.findAllByText(/Show Solution/i);
    fireEvent.click(showSolutionButtons[0]);

    // Check for solution content
    await waitFor(() => {
      expect(screen.getByText(/Solution Steps/i)).toBeInTheDocument();
      expect(screen.getByText(/Calculate expected return on senior debt/i)).toBeInTheDocument();
    });
  });

  test('handles no comp found gracefully', async () => {
    problemMatcher.findClosestCompWithDivergenceAnalysis = jest.fn(() => mockNoCompAnalysis);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Bond Default with Multiple Tranches/i)).toBeInTheDocument();
    });

    // Check for "no comp found" message
    await waitFor(() => {
      expect(screen.getByText(/No close comparable found/i)).toBeInTheDocument();
      expect(screen.getByText(/45%/i)).toBeInTheDocument();
    });
  });

  test('hides comp summary when solution shown', async () => {
    problemMatcher.findClosestCompWithDivergenceAnalysis = jest.fn(() => mockCompAnalysis);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Bond Default with Multiple Tranches/i)).toBeInTheDocument();
    });

    // Verify comp summary is visible
    expect(screen.getByText(/Similar to:/i)).toBeInTheDocument();

    // Click "Show Solution" (get first button)
    const showSolutionButtons = await screen.findAllByText(/Show Solution/i);
    fireEvent.click(showSolutionButtons[0]);

    // Comp summary should be hidden when solution is shown
    await waitFor(() => {
      expect(screen.queryByText(/Similar to:/i)).not.toBeInTheDocument();
    });
  });

  test('recomputes comp analysis when navigating to different problem', async () => {
    problemMatcher.findClosestCompWithDivergenceAnalysis = jest.fn(() => mockCompAnalysis);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Bond Default with Multiple Tranches/i)).toBeInTheDocument();
    });

    // Verify initial call
    expect(problemMatcher.findClosestCompWithDivergenceAnalysis).toHaveBeenCalledTimes(1);

    // Navigate to next problem
    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);

    // Verify comp analysis was recomputed
    await waitFor(() => {
      expect(problemMatcher.findClosestCompWithDivergenceAnalysis).toHaveBeenCalledTimes(2);
    });
  });

  test('displays time impact for divergences', async () => {
    problemMatcher.findClosestCompWithDivergenceAnalysis = jest.fn(() => mockCompAnalysis);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Bond Default with Multiple Tranches/i)).toBeInTheDocument();
    });

    // Click "View Guidance"
    const viewGuidanceButton = await screen.findByText(/View.*Guidance/i);
    fireEvent.click(viewGuidanceButton);

    // Check for time impact (use getAllByText since there are multiple)
    await waitFor(() => {
      expect(screen.getAllByText(/2.5 minutes/i).length).toBeGreaterThan(0);
    });
  });

  test('shows severity indicators for divergences', async () => {
    problemMatcher.findClosestCompWithDivergenceAnalysis = jest.fn(() => mockCompAnalysis);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Bond Default with Multiple Tranches/i)).toBeInTheDocument();
    });

    // Click "View Guidance"
    const viewGuidanceButton = await screen.findByText(/View.*Guidance/i);
    fireEvent.click(viewGuidanceButton);

    // Check for critical severity indicator (should be displayed for DEV-4.1.1)
    await waitFor(() => {
      const elements = screen.getAllByText(/Absolute Priority Rule Waterfall/i);
      const guidanceElement = elements.find(el => el.closest('.guidance-item'));
      expect(guidanceElement).toBeDefined();
      const container = guidanceElement.closest('.guidance-item');
      expect(container.className).toMatch(/red-900/i); // critical uses red color
    });
  });
});
