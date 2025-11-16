const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const PptxGenJS = require('pptxgenjs');

// Ensure generated directory exists
const GENERATED_DIR = path.join(__dirname, 'generated');
fs.mkdir(GENERATED_DIR, { recursive: true }).catch(console.error);

// Simple McKinsey presentation class
class McKinseyPresentation {
  constructor(config = {}) {
    this.pres = new PptxGenJS();
    this.config = {
      organisation: config.organisation || 'Organisation',
      spelling: config.spelling || 'UK'
    };
    
    // McKinsey brand colors
    this.colors = {
      primary: '003A70',    // McKinsey Blue
      secondary: '0076A8',  // Light Blue
      accent: '00A8E1',     // Bright Blue
      text: '333333',       // Dark Gray
      lightGray: 'F0F0F0'
    };
    
    // Configure presentation
    this.pres.author = 'LibreChat Presentation System';
    this.pres.company = this.config.organisation;
    this.pres.subject = 'McKinsey Presentation';
  }
  
  createTitleSlide(title, subtitle, author) {
    const slide = this.pres.addSlide();
    slide.background = { color: this.colors.primary };
    
    slide.addText(title || 'Title', {
      x: 1, y: 2, w: 8, h: 1.5,
      fontSize: 36, bold: true, color: 'FFFFFF',
      align: 'center'
    });
    
    slide.addText(subtitle || 'Subtitle', {
      x: 1, y: 3.5, w: 8, h: 1,
      fontSize: 24, color: 'FFFFFF',
      align: 'center'
    });
    
    slide.addText(author || 'Author', {
      x: 1, y: 5, w: 8, h: 0.5,
      fontSize: 18, color: 'FFFFFF',
      align: 'center'
    });
    
    return slide;
  }
  
  createExecutiveSummary(title, metrics) {
    const slide = this.pres.addSlide();
    
    slide.addText(title || 'Executive Summary', {
      x: 0.5, y: 0.5, w: 9, h: 0.7,
      fontSize: 24, bold: true, color: this.colors.primary
    });
    
    if (Array.isArray(metrics)) {
      metrics.forEach((metric, index) => {
        const x = 0.5 + (index * 3);
        const y = 2;
        
        slide.addText(metric.value || '0', {
          x, y, w: 2.5, h: 0.8,
          fontSize: 32, bold: true, 
          color: metric.highlight ? this.colors.accent : this.colors.primary,
          align: 'center'
        });
        
        slide.addText(metric.label || 'Metric', {
          x, y: y + 0.8, w: 2.5, h: 0.5,
          fontSize: 14, bold: true, color: this.colors.text,
          align: 'center'
        });
        
        if (metric.sublabel) {
          slide.addText(metric.sublabel, {
            x, y: y + 1.3, w: 2.5, h: 0.4,
            fontSize: 12, color: '666666',
            align: 'center'
          });
        }
      });
    }
    
    return slide;
  }
  
  createKeyMessages(title, messages) {
    const slide = this.pres.addSlide();
    
    slide.addText(title || 'Key Messages', {
      x: 0.5, y: 0.5, w: 9, h: 0.7,
      fontSize: 24, bold: true, color: this.colors.primary
    });
    
    if (Array.isArray(messages)) {
      messages.forEach((message, index) => {
        slide.addText(`• ${message}`, {
          x: 1, y: 2 + (index * 1), w: 8, h: 0.8,
          fontSize: 18, color: this.colors.text
        });
      });
    }
    
    return slide;
  }
  
  // Add stub methods for other slide types
  createDataTable() { return this.createTitleSlide('Data Table', 'Not implemented', ''); }
  createFrameworkSlide() { return this.createTitleSlide('Framework', 'Not implemented', ''); }
  createTimeline() { return this.createTitleSlide('Timeline', 'Not implemented', ''); }
  createNextSteps() { return this.createTitleSlide('Next Steps', 'Not implemented', ''); }
  
  async save() {
    const filename = `mckinsey_${this.config.organisation.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pptx`;
    const filepath = path.join(GENERATED_DIR, filename);
    await this.pres.writeFile({ fileName: filepath });
    return filename;
  }
}

// Simple Marwyn presentation class
class MarwynPresentation extends McKinseyPresentation {
  constructor(config = {}) {
    super(config);
    
    // Marwyn brand colors
    this.colors = {
      primary: 'FF6900',    // Marwyn Orange
      secondary: '2C3E50',  // Dark Blue/Gray
      accent: 'FF8C42',     // Light Orange
      text: '333333',       // Dark Gray
      lightGray: 'F5F5F5'
    };
    
    this.pres.company = config.organisation || 'Marwyn';
    this.pres.subject = 'Marwyn Investment Presentation';
  }
  
  createSectionDivider() { return this.createTitleSlide('Section', 'Divider', ''); }
  createNumberedFramework() { return this.createTitleSlide('Framework', 'Numbered', ''); }
  createInvestmentCase() { return this.createTitleSlide('Investment Case', 'Details', ''); }
  createPortfolioOverview() { return this.createTitleSlide('Portfolio', 'Overview', ''); }
  
  async save() {
    const filename = `marwyn_${this.config.organisation.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pptx`;
    const filepath = path.join(GENERATED_DIR, filename);
    await this.pres.writeFile({ fileName: filepath });
    return filename;
  }
}

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
      try {
        presentation[method].apply(presentation, params || []);
      } catch (err) {
        console.error(`Error in ${method}:`, err);
      }
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
