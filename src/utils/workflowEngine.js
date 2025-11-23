import tierDefinitions from '../data/tier-definitions.json';

/**
 * Generates 5-step workflow guide for a problem
 */
export const generateWorkflow = (archetypes, problemText) => {
  const workflow = tierDefinitions.workflowSteps.map(step => ({
    ...step,
    status: 'pending'
  }));

  // Customize IDENTIFY step
  workflow[0].guidance = `Identified: ${archetypes.map(a => a.id).join(', ')}`;
  
  // Customize MAP step
  const hasExcel = archetypes.some(a => a.excelTab);
  workflow[2].guidance = hasExcel 
    ? `Use Excel tabs: ${archetypes.filter(a => a.excelTab).map(a => a.excelTab).join(', ')}`
    : 'Use Playbook for conceptual answer (3-5 bullets)';

  return workflow;
};

/**
 * Validates workflow completion
 */
export const validateWorkflow = (completedSteps) => {
  const required = ['IDENTIFY', 'EXTRACT', 'MAP', 'EXECUTE', 'CHECK'];
  return required.every(step => completedSteps.includes(step));
};
