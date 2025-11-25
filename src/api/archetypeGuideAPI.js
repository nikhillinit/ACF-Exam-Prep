/**
 * Archetype Guide API
 *
 * Express API endpoint to serve archetype guides via HTTP
 */

const synthesizer = require('../cli/synthesizers/archetypeSynthesizer');
const markdownFormatter = require('../cli/formatters/markdownFormatter');

/**
 * Setup archetype guide routes
 * @param {Express.Application} app - Express app
 */
function setupArchetypeGuideRoutes(app) {
  // Get guide for specific archetype
  app.get('/api/archetype-guide/:archetypeId', async (req, res) => {
    try {
      const { archetypeId } = req.params;
      const includeExamples = req.query.examples !== 'false';
      const maxExamples = parseInt(req.query.maxExamples) || 3;
      const format = req.query.format || 'json';

      // Synthesize the guide
      const guideData = await synthesizer.synthesize(archetypeId.toUpperCase(), {
        includeExamples,
        maxExamples
      });

      // Return appropriate format
      if (format === 'markdown') {
        const markdown = markdownFormatter.format(guideData);
        res.type('text/markdown').send(markdown);
      } else {
        res.json(guideData);
      }
    } catch (error) {
      res.status(404).json({
        error: error.message,
        archetypeId: req.params.archetypeId
      });
    }
  });

  // Get list of all available archetypes
  app.get('/api/archetypes', async (req, res) => {
    try {
      const dataLoader = require('../cli/utils/dataLoader');
      const archetypes = await dataLoader.getAllArchetypes();

      res.json({
        archetypes: archetypes.map(a => ({
          id: a.id,
          name: a.name,
          tier: a.tier,
          priority: a.priority,
          timeAllocation: a.timeAllocation,
          pointValue: a.pointValue
        }))
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}

module.exports = { setupArchetypeGuideRoutes };
