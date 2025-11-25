import React, { useState, useEffect } from 'react';
import {
  getResourcesByType,
  getResourcesByArchetype,
  getResourcesByCategory,
  searchResources,
  openPDFInNewTab
} from '../../utils/resourceLoader';
import MarkdownViewer from './MarkdownViewer';

/**
 * ResourceBrowser Component
 * 
 * Displays and manages all available resources from the source-materials folder
 * Allows filtering by type, archetype, category, and search
 */
const ResourceBrowser = ({ initialArchetype = null, initialCategory = null }) => {
  const [viewMode, setViewMode] = useState('category'); // 'category', 'archetype', 'type', 'search'
  const [selectedArchetype, setSelectedArchetype] = useState(initialArchetype);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showViewer, setShowViewer] = useState(false);

  // Load resources based on current view mode
  useEffect(() => {
    loadResources();
  }, [viewMode, selectedArchetype, selectedCategory, selectedType, searchQuery]);

  const loadResources = () => {
    let loadedResources = [];

    switch (viewMode) {
      case 'archetype':
        if (selectedArchetype) {
          const archetypeData = getResourcesByArchetype(selectedArchetype);
          if (archetypeData) {
            loadedResources = [
              ...archetypeData.markdown_guides,
              ...archetypeData.worked_examples,
              ...archetypeData.mock_exams
            ];
          }
        }
        break;

      case 'category':
        if (selectedCategory) {
          const categoryData = getResourcesByCategory(selectedCategory);
          if (categoryData) {
            loadedResources = categoryData.items;
          }
        }
        break;

      case 'type':
        if (selectedType === 'all') {
          loadedResources = [
            ...getResourcesByType('markdown'),
            ...getResourcesByType('pdf'),
            ...getResourcesByType('json')
          ];
        } else {
          loadedResources = getResourcesByType(selectedType);
        }
        break;

      case 'search':
        if (searchQuery.trim()) {
          loadedResources = searchResources(searchQuery);
        }
        break;

      default:
        // Default to showing all resources by category
        const conceptual = getResourcesByCategory('conceptual_learning');
        if (conceptual) loadedResources = conceptual.items;
    }

    setResources(loadedResources);
  };

  const handleResourceClick = (resource) => {
    setSelectedResource(resource);
    
    if (resource.type === 'mock_exam' || resource.resource_type === 'pdf') {
      // Open PDF in new tab
      openPDFInNewTab(resource.id);
    } else if (resource.type === 'conceptual_guide' || resource.resource_type === 'markdown') {
      // Show markdown viewer
      setShowViewer(true);
    } else if (resource.resource_type === 'json') {
      // For JSON resources, could show a preview or navigate to Practice tab
      alert('This resource is used by the Practice tab. Navigate there to see worked examples.');
    }
  };

  const getResourceIcon = (resource) => {
    const type = resource.type || resource.resource_type;
    switch (type) {
      case 'conceptual_guide':
      case 'markdown':
        return '📖';
      case 'mock_exam':
      case 'pdf':
        return '📄';
      case 'worked_examples':
      case 'json':
        return '💡';
      default:
        return '📁';
    }
  };

  const getResourceTypeLabel = (resource) => {
    const type = resource.type || resource.resource_type;
    switch (type) {
      case 'conceptual_guide':
        return 'Conceptual Guide';
      case 'markdown':
        return 'Markdown Guide';
      case 'mock_exam':
        return 'Mock Exam';
      case 'pdf':
        return 'PDF Document';
      case 'worked_examples':
        return 'Worked Examples';
      case 'json':
        return 'Data File';
      default:
        return 'Resource';
    }
  };

  return (
    <div className="resource-browser">
      {/* Header */}
      <div className="resource-browser-header" style={{
        marginBottom: '2rem',
        padding: '1.5rem',
        backgroundColor: '#f8fafc',
        borderRadius: '0.5rem',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{ marginBottom: '0.5rem' }}>📚 Resource Library</h2>
        <p style={{ color: '#64748b', margin: 0 }}>
          Access conceptual guides, mock exams, and worked examples
        </p>
      </div>

      {/* View Mode Selector */}
      <div className="view-mode-selector" style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setViewMode('category')}
          className={`btn ${viewMode === 'category' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.5rem 1rem' }}
        >
          📂 By Category
        </button>
        <button
          onClick={() => setViewMode('archetype')}
          className={`btn ${viewMode === 'archetype' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.5rem 1rem' }}
        >
          🏷️ By Archetype
        </button>
        <button
          onClick={() => setViewMode('type')}
          className={`btn ${viewMode === 'type' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.5rem 1rem' }}
        >
          📋 By Type
        </button>
        <button
          onClick={() => setViewMode('search')}
          className={`btn ${viewMode === 'search' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.5rem 1rem' }}
        >
          🔍 Search
        </button>
      </div>

      {/* Filters based on view mode */}
      <div className="resource-filters" style={{ marginBottom: '1.5rem' }}>
        {viewMode === 'category' && (
          <div>
            <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
              Select Category:
            </label>
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #cbd5e1',
                width: '100%',
                maxWidth: '400px'
              }}
            >
              <option value="">Choose a category...</option>
              <option value="conceptual_learning">Conceptual Learning</option>
              <option value="practice_problems">Practice Problems</option>
              <option value="exam_simulation">Exam Simulation</option>
              <option value="quick_reference">Quick Reference</option>
            </select>
          </div>
        )}

        {viewMode === 'archetype' && (
          <div>
            <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
              Select Archetype:
            </label>
            <select
              value={selectedArchetype || ''}
              onChange={(e) => setSelectedArchetype(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #cbd5e1',
                width: '100%',
                maxWidth: '400px'
              }}
            >
              <option value="">Choose an archetype...</option>
              <option value="A1">A1: Capital Structure & Tax Shields</option>
              <option value="A2">A2: Multi-State Project & Financing</option>
              <option value="A3">A3: CAPM, Beta & Discount Rates</option>
              <option value="A4">A4: Distress & Priority</option>
            </select>
          </div>
        )}

        {viewMode === 'type' && (
          <div>
            <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
              Select Resource Type:
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #cbd5e1',
                width: '100%',
                maxWidth: '400px'
              }}
            >
              <option value="all">All Types</option>
              <option value="markdown">Markdown Guides</option>
              <option value="pdf">PDF Documents</option>
              <option value="json">Data Files</option>
            </select>
          </div>
        )}

        {viewMode === 'search' && (
          <div>
            <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
              Search Resources:
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter keywords (e.g., 'tax shields', 'CAPM', 'debt overhang')..."
              style={{
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #cbd5e1',
                width: '100%',
                maxWidth: '600px'
              }}
            />
          </div>
        )}
      </div>

      {/* Resource List */}
      <div className="resource-list">
        {resources.length === 0 ? (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            color: '#64748b',
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem',
            border: '1px dashed #cbd5e1'
          }}>
            <p>No resources found. Try selecting a different filter or search term.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {resources.map((resource, index) => (
              <div
                key={resource.id || index}
                className="resource-card"
                onClick={() => handleResourceClick(resource)}
                style={{
                  padding: '1.5rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  ':hover': {
                    borderColor: '#3b82f6',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ fontSize: '2rem' }}>
                    {getResourceIcon(resource)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ marginBottom: '0.5rem', color: '#1e293b' }}>
                      {resource.title}
                    </h4>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {getResourceTypeLabel(resource)}
                    </div>
                    <p style={{
                      fontSize: '0.9rem',
                      color: '#475569',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      {resource.description}
                    </p>
                    {resource.archetypes && resource.archetypes.length > 0 && (
                      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {resource.archetypes.map(arch => (
                          <span
                            key={arch}
                            style={{
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.5rem',
                              backgroundColor: '#e0e7ff',
                              color: '#3730a3',
                              borderRadius: '0.25rem',
                              fontWeight: '500'
                            }}
                          >
                            {arch}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Markdown Viewer Modal */}
      {showViewer && selectedResource && (
        <MarkdownViewer
          resource={selectedResource}
          onClose={() => {
            setShowViewer(false);
            setSelectedResource(null);
          }}
        />
      )}
    </div>
  );
};

export default ResourceBrowser;
