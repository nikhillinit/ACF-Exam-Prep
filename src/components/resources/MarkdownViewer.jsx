import React, { useState, useEffect } from 'react';
import { loadMarkdownContent, parseMarkdownSections } from '../../utils/resourceLoader';

/**
 * MarkdownViewer Component
 * 
 * Displays markdown content with table of contents and section navigation
 */
const MarkdownViewer = ({ resource, onClose }) => {
  const [content, setContent] = useState('');
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    loadContent();
  }, [resource]);

  const loadContent = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await loadMarkdownContent(resource.id);
      if (result) {
        setContent(result.content);
        const parsedSections = parseMarkdownSections(result.content);
        setSections(parsedSections);
        if (parsedSections.length > 0) {
          setActiveSection(parsedSections[0].id);
        }
      } else {
        setError('Failed to load content');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Simple markdown to HTML converter (basic implementation)
  const renderMarkdown = (text) => {
    if (!text) return '';

    let html = text;

    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Code blocks
    html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Lists
    html = html.replace(/^\- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';

    return html;
  };

  return (
    <div className="markdown-viewer-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="markdown-viewer-container" style={{
        backgroundColor: '#ffffff',
        borderRadius: '0.5rem',
        maxWidth: '1200px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>{resource.title}</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
              {resource.description}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f1f5f9',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            ✕ Close
          </button>
        </div>

        {/* Content Area */}
        <div style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden'
        }}>
          {/* Table of Contents */}
          {sections.length > 0 && (
            <div style={{
              width: '250px',
              borderRight: '1px solid #e2e8f0',
              padding: '1.5rem',
              overflowY: 'auto',
              backgroundColor: '#f8fafc'
            }}>
              <h4 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', color: '#64748b' }}>
                Contents
              </h4>
              <nav>
                {sections.map((section, index) => (
                  <div
                    key={index}
                    onClick={() => scrollToSection(section.id)}
                    style={{
                      padding: '0.5rem',
                      paddingLeft: `${(section.level - 1) * 0.75}rem`,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      color: activeSection === section.id ? '#3b82f6' : '#475569',
                      fontWeight: activeSection === section.id ? '600' : '400',
                      borderLeft: activeSection === section.id ? '3px solid #3b82f6' : '3px solid transparent',
                      marginBottom: '0.25rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e0e7ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {section.title}
                  </div>
                ))}
              </nav>
            </div>
          )}

          {/* Main Content */}
          <div style={{
            flex: 1,
            padding: '2rem',
            overflowY: 'auto'
          }}>
            {loading && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                Loading content...
              </div>
            )}

            {error && (
              <div style={{
                padding: '1rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #ef4444',
                borderRadius: '0.375rem',
                color: '#991b1b'
              }}>
                Error: {error}
              </div>
            )}

            {!loading && !error && (
              <div className="markdown-content">
                {sections.length > 0 ? (
                  sections.map((section, index) => (
                    <div
                      key={index}
                      id={`section-${section.id}`}
                      style={{ marginBottom: '2rem' }}
                    >
                      {section.level === 1 && (
                        <h1 style={{ 
                          fontSize: '2rem', 
                          marginBottom: '1rem',
                          color: '#1e293b',
                          borderBottom: '2px solid #e2e8f0',
                          paddingBottom: '0.5rem'
                        }}>
                          {section.title}
                        </h1>
                      )}
                      {section.level === 2 && (
                        <h2 style={{ 
                          fontSize: '1.5rem', 
                          marginBottom: '0.75rem',
                          color: '#334155',
                          marginTop: '1.5rem'
                        }}>
                          {section.title}
                        </h2>
                      )}
                      {section.level === 3 && (
                        <h3 style={{ 
                          fontSize: '1.25rem', 
                          marginBottom: '0.5rem',
                          color: '#475569',
                          marginTop: '1rem'
                        }}>
                          {section.title}
                        </h3>
                      )}
                      <div
                        style={{
                          lineHeight: '1.7',
                          color: '#334155'
                        }}
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content) }}
                      />
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      lineHeight: '1.7',
                      color: '#334155'
                    }}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownViewer;
