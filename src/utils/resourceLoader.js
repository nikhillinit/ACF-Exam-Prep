/**
 * resourceLoader.js
 * 
 * Utility for loading and managing resources from the public/source-materials folder
 * Handles markdown guides, PDF mock exams, and JSON data files
 */

import resourceRegistry from '../data/resourceRegistry.json';

/**
 * Load the resource registry
 */
export async function getResourceRegistry() {
  try {
    // In production, this would fetch from the public folder
    // For now, we're importing directly
    return resourceRegistry;
  } catch (error) {
    console.error('Error loading resource registry:', error);
    return null;
  }
}

/**
 * Get all resources of a specific type
 */
export function getResourcesByType(type) {
  const registry = resourceRegistry;
  
  switch (type) {
    case 'markdown':
      return registry.markdown_guides || [];
    case 'pdf':
      return registry.pdf_resources || [];
    case 'json':
      return registry.json_data || [];
    default:
      return [];
  }
}

/**
 * Get resources for a specific archetype
 */
export function getResourcesByArchetype(archetype) {
  const registry = resourceRegistry;
  const archetypeData = registry.archetype_resources[archetype];
  
  if (!archetypeData) return null;
  
  const resources = {
    archetype: archetype,
    title: archetypeData.title,
    markdown_guides: [],
    worked_examples: [],
    mock_exams: []
  };
  
  // Find markdown guides
  archetypeData.markdown_guides?.forEach(id => {
    const guide = registry.markdown_guides.find(g => g.id === id);
    if (guide) resources.markdown_guides.push(guide);
  });
  
  // Find worked examples
  archetypeData.worked_examples?.forEach(id => {
    const examples = registry.json_data.find(j => j.id === id);
    if (examples) resources.worked_examples.push(examples);
  });
  
  // Find mock exams
  archetypeData.mock_exams?.forEach(id => {
    const exam = registry.pdf_resources.find(p => p.id === id);
    if (exam) resources.mock_exams.push(exam);
  });
  
  return resources;
}

/**
 * Get resources by category
 */
export function getResourcesByCategory(category) {
  const registry = resourceRegistry;
  const categoryData = registry.resource_categories[category];
  
  if (!categoryData) return null;
  
  const resources = {
    category: category,
    title: categoryData.title,
    description: categoryData.description,
    items: []
  };
  
  // Collect all resources in this category
  categoryData.resources?.forEach(id => {
    // Check in all resource types
    let resource = registry.markdown_guides.find(r => r.id === id);
    if (!resource) resource = registry.pdf_resources.find(r => r.id === id);
    if (!resource) resource = registry.json_data.find(r => r.id === id);
    
    if (resource) resources.items.push(resource);
  });
  
  return resources;
}

/**
 * Search resources by keyword
 */
export function searchResources(keyword) {
  const registry = resourceRegistry;
  const searchTerm = keyword.toLowerCase();
  const results = [];
  
  // Search markdown guides
  registry.markdown_guides?.forEach(guide => {
    const searchText = JSON.stringify(guide).toLowerCase();
    if (searchText.includes(searchTerm)) {
      results.push({ ...guide, resource_type: 'markdown' });
    }
  });
  
  // Search PDF resources
  registry.pdf_resources?.forEach(pdf => {
    const searchText = JSON.stringify(pdf).toLowerCase();
    if (searchText.includes(searchTerm)) {
      results.push({ ...pdf, resource_type: 'pdf' });
    }
  });
  
  // Search JSON data
  registry.json_data?.forEach(json => {
    const searchText = JSON.stringify(json).toLowerCase();
    if (searchText.includes(searchTerm)) {
      results.push({ ...json, resource_type: 'json' });
    }
  });
  
  return results;
}

/**
 * Load markdown content from a file
 */
export async function loadMarkdownContent(resourceId) {
  try {
    const resource = resourceRegistry.markdown_guides.find(g => g.id === resourceId);
    if (!resource) {
      throw new Error(`Markdown resource not found: ${resourceId}`);
    }
    
    const response = await fetch(resource.path);
    if (!response.ok) {
      throw new Error(`Failed to load markdown: ${response.statusText}`);
    }
    
    const content = await response.text();
    return {
      resource: resource,
      content: content
    };
  } catch (error) {
    console.error('Error loading markdown:', error);
    return null;
  }
}

/**
 * Load JSON data from a file
 */
export async function loadJSONData(resourceId) {
  try {
    const resource = resourceRegistry.json_data.find(j => j.id === resourceId);
    if (!resource) {
      throw new Error(`JSON resource not found: ${resourceId}`);
    }
    
    const response = await fetch(resource.path);
    if (!response.ok) {
      throw new Error(`Failed to load JSON: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      resource: resource,
      data: data
    };
  } catch (error) {
    console.error('Error loading JSON:', error);
    return null;
  }
}

/**
 * Get PDF resource info (PDFs are opened in new tab or embedded)
 */
export function getPDFResource(resourceId) {
  const resource = resourceRegistry.pdf_resources.find(p => p.id === resourceId);
  if (!resource) {
    console.error(`PDF resource not found: ${resourceId}`);
    return null;
  }
  
  return resource;
}

/**
 * Open PDF in new tab
 */
export function openPDFInNewTab(resourceId) {
  const resource = getPDFResource(resourceId);
  if (resource) {
    window.open(resource.path, '_blank');
  }
}

/**
 * Get resource by ID (any type)
 */
export function getResourceById(resourceId) {
  const registry = resourceRegistry;
  
  // Check markdown guides
  let resource = registry.markdown_guides.find(r => r.id === resourceId);
  if (resource) return { ...resource, resource_type: 'markdown' };
  
  // Check PDF resources
  resource = registry.pdf_resources.find(r => r.id === resourceId);
  if (resource) return { ...resource, resource_type: 'pdf' };
  
  // Check JSON data
  resource = registry.json_data.find(r => r.id === resourceId);
  if (resource) return { ...resource, resource_type: 'json' };
  
  return null;
}

/**
 * Get recommended resources for a stuck point
 */
export function getRecommendedResources(stuckPoint, archetype = null) {
  const recommendations = [];
  
  // Map stuck points to resource types
  const stuckPointMap = {
    'dont_know_where_to_start': ['conceptual_learning', 'practice_problems'],
    'dont_know_formula': ['quick_reference', 'conceptual_learning'],
    'cant_identify_archetype': ['conceptual_learning'],
    'need_practice': ['practice_problems', 'exam_simulation'],
    'need_exam_prep': ['exam_simulation'],
    'understand_concept': ['conceptual_learning'],
    'see_examples': ['practice_problems']
  };
  
  const categories = stuckPointMap[stuckPoint] || ['conceptual_learning'];
  
  categories.forEach(category => {
    const categoryResources = getResourcesByCategory(category);
    if (categoryResources) {
      recommendations.push(categoryResources);
    }
  });
  
  // If archetype is specified, prioritize archetype-specific resources
  if (archetype) {
    const archetypeResources = getResourcesByArchetype(archetype);
    if (archetypeResources) {
      recommendations.unshift({
        category: 'archetype_specific',
        title: `Resources for ${archetypeResources.title}`,
        description: `Targeted resources for ${archetype} problems`,
        items: [
          ...archetypeResources.markdown_guides,
          ...archetypeResources.worked_examples
        ]
      });
    }
  }
  
  return recommendations;
}

/**
 * Parse markdown content into sections
 */
export function parseMarkdownSections(markdownContent) {
  const sections = [];
  const lines = markdownContent.split('\n');
  
  let currentSection = null;
  let currentContent = [];
  
  lines.forEach(line => {
    // Check for headers (# or ##)
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headerMatch) {
      // Save previous section if exists
      if (currentSection) {
        sections.push({
          ...currentSection,
          content: currentContent.join('\n').trim()
        });
      }
      
      // Start new section
      const level = headerMatch[1].length;
      const title = headerMatch[2];
      currentSection = {
        level: level,
        title: title,
        id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      };
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  });
  
  // Save last section
  if (currentSection) {
    sections.push({
      ...currentSection,
      content: currentContent.join('\n').trim()
    });
  }
  
  return sections;
}

/**
 * Extract topics from markdown content
 */
export function extractTopicsFromMarkdown(markdownContent) {
  const topics = [];
  const lines = markdownContent.split('\n');
  
  lines.forEach(line => {
    // Extract level 2 headers as topics
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      topics.push(match[1]);
    }
  });
  
  return topics;
}

export default {
  getResourceRegistry,
  getResourcesByType,
  getResourcesByArchetype,
  getResourcesByCategory,
  searchResources,
  loadMarkdownContent,
  loadJSONData,
  getPDFResource,
  openPDFInNewTab,
  getResourceById,
  getRecommendedResources,
  parseMarkdownSections,
  extractTopicsFromMarkdown
};
