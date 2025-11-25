/**
 * Simple Express Server for Archetype Guide API
 *
 * Run with: node server.js
 * API available at: http://localhost:3001/api/archetype-guide/:archetypeId
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { setupArchetypeGuideRoutes } = require('./src/api/archetypeGuideAPI');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow requests from React dev server (port 3000)
app.use(express.json());

// Setup API routes
setupArchetypeGuideRoutes(app);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ACF Archetype Guide API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ ACF Archetype Guide API running on http://localhost:${PORT}`);
  console.log(`✓ Available endpoints:`);
  console.log(`  - GET /api/archetypes - List all archetypes`);
  console.log(`  - GET /api/archetype-guide/:id - Get guide for archetype`);
  console.log(`  - Example: http://localhost:${PORT}/api/archetype-guide/A1`);
});
