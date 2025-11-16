const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

// Import presentation classes
const McKinseyPresentation = require('./LIBRECHAT_McKinseyPresentation');
const MarwynPresentation = require('./LIBRECHAT_MarwynPresentation');

// Ensure generated directory exists
const GENERATED_DIR = path.join(__dirname, 'generated');
fs.mkdir(GENERATED_DIR, { recursive: true }).catch(console.error);

// Generate presentation endpoint
router.post('/generate', async (req, res) => {
  try {
    const { type, config, slides } = req.body;
    
    if (!type || !slides || !Array.isArray(slides)) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: type and slides array'
      });
    }

    let presentation;
    
    // Create presentation instance based on type
    if (type === 'mckinsey') {
      presentation = new McKinseyPresentation(config || {});
    } else if (type === 'marwyn') {
      presentation = new MarwynPresentation(config || {});
    } else {
      return res.status(400).json({
        success: false,
        error: `Unknown presentation type: ${type}`
      });
    }

    // Generate slides
    for (const slide of slides) {
      const { method, params } = slide;
      
      if (!method || !presentation[method]) {
        console.warn(`Unknown method: ${method}`);
        continue;
      }
      
      // Call the method with params
      presentation[method].apply(presentation, params || []);
    }

    // Save presentation
    const filename = await presentation.save();
    const filepath = path.join(GENERATED_DIR, filename);
    
    // Get file stats
    const stats = await fs.stat(filepath);
    
    res.json({
      success: true,
      filename,
      slideCount: presentation.pres.slides.length,
      size: stats.size,
      downloadUrl: `/api/presentations/download/${filename}`
    });
    
  } catch (error) {
    console.error('Presentation generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate presentation'
    });
  }
});

// Download presentation endpoint
router.get('/download/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validate filename (prevent directory traversal)
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid filename'
      });
    }
    
    const filepath = path.join(GENERATED_DIR, filename);
    
    // Check if file exists
    await fs.access(filepath);
    
    // Set headers for download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Stream file to response
    const stream = require('fs').createReadStream(filepath);
    stream.pipe(res);
    
  } catch (error) {
    console.error('Download error:', error);
    res.status(404).json({
      success: false,
      error: 'File not found'
    });
  }
});

// List presentations endpoint
router.get('/list', async (req, res) => {
  try {
    const files = await fs.readdir(GENERATED_DIR);
    const presentations = [];
    
    for (const file of files) {
      if (file.endsWith('.pptx')) {
        const filepath = path.join(GENERATED_DIR, file);
        const stats = await fs.stat(filepath);
        
        presentations.push({
          filename: file,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          downloadUrl: `/api/presentations/download/${file}`
        });
      }
    }
    
    // Sort by modified date (newest first)
    presentations.sort((a, b) => b.modified - a.modified);
    
    res.json({
      success: true,
      count: presentations.length,
      presentations
    });
    
  } catch (error) {
    console.error('List error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list presentations'
    });
  }
});

// Delete presentation endpoint
router.delete('/delete/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validate filename
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid filename'
      });
    }
    
    const filepath = path.join(GENERATED_DIR, filename);
    
    // Delete file
    await fs.unlink(filepath);
    
    res.json({
      success: true,
      message: `Deleted ${filename}`
    });
    
  } catch (error) {
    console.error('Delete error:', error);
    res.status(404).json({
      success: false,
      error: 'File not found or could not be deleted'
    });
  }
});

// Cleanup old files endpoint
router.post('/cleanup', async (req, res) => {
  try {
    const { maxAgeDays = 7 } = req.body;
    const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
    const now = Date.now();
    
    const files = await fs.readdir(GENERATED_DIR);
    let deletedCount = 0;
    
    for (const file of files) {
      if (file.endsWith('.pptx')) {
        const filepath = path.join(GENERATED_DIR, file);
        const stats = await fs.stat(filepath);
        
        if (now - stats.mtimeMs > maxAgeMs) {
          await fs.unlink(filepath);
          deletedCount++;
        }
      }
    }
    
    res.json({
      success: true,
      deletedCount,
      message: `Deleted ${deletedCount} files older than ${maxAgeDays} days`
    });
    
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cleanup old files'
    });
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const files = await fs.readdir(GENERATED_DIR);
    const presentationCount = files.filter(f => f.endsWith('.pptx')).length;
    
    res.json({
      success: true,
      status: 'healthy',
      presentationCount
    });
  } catch (error) {
    res.json({
      success: true,
      status: 'healthy',
      presentationCount: 0
    });
  }
});

// Get available templates
router.get('/templates', (req, res) => {
  res.json({
    success: true,
    templates: [
      {
        name: 'McKinsey',
        type: 'mckinsey',
        description: 'Professional consulting-style presentations with blue theme',
        methods: [
          'createTitleSlide',
          'createExecutiveSummary',
          'createDataTable',
          'createFrameworkSlide',
          'createTimeline',
          'createKeyMessages',
          'createNextSteps'
        ]
      },
      {
        name: 'Marwyn',
        type: 'marwyn',
        description: 'Investment-focused presentations with orange theme',
        methods: [
          'createTitleSlide',
          'createExecutiveSummary',
          'createSectionDivider',
          'createDataTable',
          'createFrameworkSlide',
          'createNumberedFramework',
          'createTimeline',
          'createKeyMessages',
          'createNextSteps',
          'createInvestmentCase',
          'createPortfolioOverview'
        ]
      }
    ]
  });
});

module.exports = router;
