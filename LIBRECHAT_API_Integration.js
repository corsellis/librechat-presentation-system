// LibreChat Presentation API Integration
// Complete Express.js routes for presentation generation

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const McKinseyPresentation = require('../presentation-system/templates/McKinseyPresentation');
const MarwynPresentation = require('../presentation-system/templates/MarwynPresentation');

// Ensure generated directory exists
const GENERATED_DIR = path.join(__dirname, '../generated');
fs.mkdir(GENERATED_DIR, { recursive: true }).catch(console.error);

// ============================================
// PRESENTATION GENERATION ENDPOINT
// ============================================

router.post('/generate', async (req, res) => {
    try {
        const { type, config, slides } = req.body;
        
        // Validation
        if (!type || !slides || !Array.isArray(slides)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid request. Required: type, slides[]'
            });
        }
        
        // Select presentation class
        const PresentationClass = type === 'marwyn' ? MarwynPresentation : McKinseyPresentation;
        
        // Create presentation instance
        const pres = new PresentationClass(config || {});
        
        // Build slides based on provided data
        let slideCount = 0;
        for (const slide of slides) {
            const method = slide.method;
            const params = slide.params || [];
            
            if (typeof pres[method] === 'function') {
                try {
                    pres[method](...params);
                    slideCount++;
                } catch (err) {
                    console.error(`Error creating slide with method ${method}:`, err);
                    return res.status(400).json({
                        success: false,
                        error: `Failed to create slide using method: ${method}`,
                        details: err.message
                    });
                }
            } else {
                return res.status(400).json({
                    success: false,
                    error: `Unknown slide method: ${method}`
                });
            }
        }
        
        // Generate filename
        const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const safeName = (config?.organisation || type).replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `${type}_${safeName}_${timestamp}.pptx`;
        const filepath = path.join(GENERATED_DIR, filename);
        
        // Save presentation
        await pres.pres.writeFile({ fileName: filepath });
        
        // Return success with download URL
        res.json({
            success: true,
            filename,
            slideCount,
            downloadUrl: `/api/presentations/download/${filename}`,
            message: `Presentation created successfully with ${slideCount} slides`
        });
        
    } catch (error) {
        console.error('Presentation generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: error.message
        });
    }
});

// ============================================
// DOWNLOAD ENDPOINT
// ============================================

router.get('/download/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        
        // Security: Only allow .pptx files and prevent directory traversal
        if (!filename.endsWith('.pptx') || filename.includes('..')) {
            return res.status(400).send('Invalid filename');
        }
        
        const filepath = path.join(GENERATED_DIR, filename);
        
        // Check if file exists
        try {
            await fs.access(filepath);
        } catch {
            return res.status(404).send('File not found');
        }
        
        // Set headers for download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        // Send file
        res.sendFile(filepath, (err) => {
            if (err) {
                console.error('Download error:', err);
                if (!res.headersSent) {
                    res.status(500).send('Error downloading file');
                }
            }
        });
        
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).send('Error processing download');
    }
});

// ============================================
// LIST PRESENTATIONS ENDPOINT
// ============================================

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
        
        // Sort by most recent first
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
            error: error.message 
        });
    }
});

// ============================================
// DELETE ENDPOINT
// ============================================

router.delete('/delete/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        
        // Security: Only allow .pptx files and prevent directory traversal
        if (!filename.endsWith('.pptx') || filename.includes('..')) {
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
        if (error.code === 'ENOENT') {
            res.status(404).json({
                success: false,
                error: 'File not found'
            });
        } else {
            console.error('Delete error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
});

// ============================================
// CLEANUP OLD FILES
// ============================================

async function cleanupOldFiles(maxAgeDays = 7) {
    try {
        const files = await fs.readdir(GENERATED_DIR);
        const now = Date.now();
        const maxAge = maxAgeDays * 24 * 60 * 60 * 1000; // Convert days to milliseconds
        
        let deletedCount = 0;
        
        for (const file of files) {
            if (file.endsWith('.pptx')) {
                const filepath = path.join(GENERATED_DIR, file);
                const stats = await fs.stat(filepath);
                const age = now - stats.mtime.getTime();
                
                if (age > maxAge) {
                    await fs.unlink(filepath);
                    deletedCount++;
                    console.log(`Deleted old presentation: ${file}`);
                }
            }
        }
        
        return deletedCount;
        
    } catch (error) {
        console.error('Cleanup error:', error);
        return 0;
    }
}

// Cleanup endpoint (can be called manually or via cron)
router.post('/cleanup', async (req, res) => {
    try {
        const maxAgeDays = req.body.maxAgeDays || 7;
        const deletedCount = await cleanupOldFiles(maxAgeDays);
        
        res.json({
            success: true,
            deletedCount,
            message: `Cleaned up ${deletedCount} old presentations`
        });
        
    } catch (error) {
        console.error('Cleanup endpoint error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================
// HEALTH CHECK
// ============================================

router.get('/health', async (req, res) => {
    try {
        // Check if generated directory is accessible
        await fs.access(GENERATED_DIR);
        
        // Count presentations
        const files = await fs.readdir(GENERATED_DIR);
        const presentationCount = files.filter(f => f.endsWith('.pptx')).length;
        
        res.json({
            success: true,
            status: 'healthy',
            generatedDir: GENERATED_DIR,
            presentationCount,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 'unhealthy',
            error: error.message
        });
    }
});

// ============================================
// TEMPLATE INFORMATION
// ============================================

router.get('/templates', (req, res) => {
    res.json({
        success: true,
        templates: [
            {
                name: 'McKinsey',
                type: 'mckinsey',
                description: 'Professional McKinsey-style presentations with blue/teal color scheme',
                methods: [
                    'createTitleSlide',
                    'createExecutiveSummary',
                    'createTableSlide',
                    'createFrameworkSlide',
                    'createTimeline',
                    'createKeyMessages',
                    'createNextSteps'
                ]
            },
            {
                name: 'Marwyn',
                type: 'marwyn',
                description: 'Investment-focused presentations with orange/charcoal branding',
                methods: [
                    'createTitleSlide',
                    'createSectionSlide',
                    'createExecutiveSummary',
                    'createTableSlide',
                    'createFrameworkSlide',
                    'createNumberedFramework',
                    'createTimeline',
                    'createCaseStudy',
                    'createKeyMessages',
                    'createNextSteps'
                ]
            }
        ]
    });
});

// ============================================
// ERROR HANDLER
// ============================================

router.use((err, req, res, next) => {
    console.error('Presentation API error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = router;
