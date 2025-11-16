const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Import presentation routes (simplified version)
const presentationRoutes = require('./presentations');

// Mount presentation routes
app.use('/api/presentations', presentationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'LibreChat Presentation System',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'LibreChat Presentation System',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      presentations: {
        generate: 'POST /api/presentations/generate',
        list: 'GET /api/presentations/list',
        download: 'GET /api/presentations/download/:filename',
        delete: 'DELETE /api/presentations/delete/:filename',
        templates: 'GET /api/presentations/templates'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Create required directories
async function setupDirectories() {
  const dirs = ['./generated', './templates'];
  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
      console.log(`✅ Directory created/verified: ${dir}`);
    } catch (error) {
      console.error(`Error creating directory ${dir}:`, error);
    }
  }
}

// Start server
async function startServer() {
  await setupDirectories();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`
    ╔══════════════════════════════════════════════╗
    ║   LibreChat Presentation System Started     ║
    ╠══════════════════════════════════════════════╣
    ║   Port: ${PORT}                              
    ║   Environment: ${process.env.NODE_ENV || 'development'}
    ║   Health Check: http://localhost:${PORT}/health
    ║   API Base: http://localhost:${PORT}/api/presentations
    ╚══════════════════════════════════════════════╝
    `);
  });
}

startServer().catch(console.error);

module.exports = app;
