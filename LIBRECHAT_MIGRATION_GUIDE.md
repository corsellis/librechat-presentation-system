# McKinsey & Marwyn Presentation System
## Migration Guide for Railway-Hosted LibreChat

## Overview

This guide helps you replicate the complete McKinsey and Marwyn presentation generation system from Claude.ai Projects to your Railway-hosted LibreChat instance.

**What You're Getting:**
- McKinsey-style presentations (blue/teal, minimalist, board-ready)
- Marwyn-branded presentations (orange, investment-focused)
- Template system for common slide types
- Automatic presentation generation via Claude API

## Architecture

```
LibreChat (Railway)
├── Backend (Node.js/Express)
│   ├── Presentation API endpoint
│   ├── PptxGenJS library
│   └── Template modules
├── Claude API Integration
│   └── Custom system prompts
└── File Storage
    └── Generated presentations
```

## Prerequisites

- Railway account with LibreChat deployed
- Node.js environment (LibreChat already has this)
- Claude API key (from Anthropic Console)
- Access to LibreChat backend code

## Migration Steps

### 1. Install Dependencies

Add to your LibreChat `package.json`:

```json
{
  "dependencies": {
    "pptxgenjs": "^3.12.0"
  }
}
```

Run:
```bash
npm install
```

### 2. File Structure

Create this directory structure in your LibreChat backend:

```
/api
  /presentation-system
    /templates
      - McKinseyPresentation.js
      - MarwynPresentation.js
      - PRESENTATION_EXAMPLES.js
    /utils
      - presentationHelper.js
    /config
      - brandConfig.js
  /routes
    - presentations.js
  /generated
    - [presentations stored here]
```

### 3. Core Files to Add

I'll generate the complete file set you need. These are production-ready modules.

---

## File: McKinseyPresentation.js

See LIBRECHAT_McKinseyPresentation.js (generated separately)

---

## File: MarwynPresentation.js

See LIBRECHAT_MarwynPresentation.js (generated separately)

---

## File: presentations.js (API Route)

```javascript
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const McKinseyPresentation = require('../presentation-system/templates/McKinseyPresentation');
const MarwynPresentation = require('../presentation-system/templates/MarwynPresentation');

// Generate presentation endpoint
router.post('/generate', async (req, res) => {
    try {
        const { type, config, slides } = req.body;
        
        // Select presentation class
        const PresentationClass = type === 'marwyn' ? MarwynPresentation : McKinseyPresentation;
        
        // Create presentation
        const pres = new PresentationClass(config);
        
        // Build slides based on provided data
        for (const slide of slides) {
            const method = slide.method;
            const params = slide.params;
            
            if (typeof pres[method] === 'function') {
                pres[method](...params);
            }
        }
        
        // Generate filename
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `${type}_presentation_${timestamp}.pptx`;
        const filepath = path.join(__dirname, '../generated', filename);
        
        // Save presentation
        await pres.pres.writeFile({ fileName: filepath });
        
        // Return download URL
        res.json({
            success: true,
            filename,
            downloadUrl: `/api/presentations/download/${filename}`
        });
        
    } catch (error) {
        console.error('Presentation generation error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Download endpoint
router.get('/download/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(__dirname, '../generated', filename);
        
        // Check if file exists
        await fs.access(filepath);
        
        // Send file
        res.download(filepath, filename, (err) => {
            if (err) {
                console.error('Download error:', err);
                res.status(500).send('Error downloading file');
            }
        });
        
    } catch (error) {
        res.status(404).send('File not found');
    }
});

// List generated presentations
router.get('/list', async (req, res) => {
    try {
        const dir = path.join(__dirname, '../generated');
        const files = await fs.readdir(dir);
        
        const presentations = files
            .filter(f => f.endsWith('.pptx'))
            .map(f => ({
                filename: f,
                downloadUrl: `/api/presentations/download/${f}`
            }));
        
        res.json({ presentations });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
```

---

## File: Claude API System Prompt

Save as `/api/presentation-system/config/claude-presentation-prompt.txt`:

```
You are an expert presentation designer creating McKinsey-style and Marwyn-style board presentations.

AVAILABLE TEMPLATES:
1. McKinsey Style: Deep blue (#003A70), teal (#00B5A0), minimalist, analytical
2. Marwyn Style: Orange (#FF6C2C), charcoal (#292929), investment-focused

CAPABILITIES:
- Generate complete presentations via LibreChat API
- Create title slides, executive summaries, data tables, frameworks, timelines
- Follow UK English spelling by default
- Use plain English, no jargon

STANDARD STRUCTURE:
1. Title Slide
2. Executive Summary (3 metrics)
3. Content Slides (frameworks, tables, data)
4. Key Messages
5. Next Steps

OUTPUT FORMAT:
When user requests a presentation, generate a structured API call:

```json
{
  "endpoint": "/api/presentations/generate",
  "method": "POST",
  "body": {
    "type": "mckinsey" | "marwyn",
    "config": {
      "organisation": "Company Name",
      "spelling": "UK"
    },
    "slides": [
      {
        "method": "createTitleSlide",
        "params": ["Line 1", "Line 2", "Subtitle"]
      },
      {
        "method": "createExecutiveSummary",
        "params": ["Title", [
          { "value": "£10M", "label": "Metric", "sublabel": "Context" }
        ]]
      }
    ]
  }
}
```

Then execute the API call and provide user with download link.
```

---

## File: LibreChat Integration

Update your `librechat.yaml`:

```yaml
version: 1.0.9

endpoints:
  custom:
    - name: "Claude Presentations"
      apiKey: "${ANTHROPIC_API_KEY}"
      baseURL: "https://api.anthropic.com/v1"
      models:
        default: ["claude-sonnet-4-20250514"]
      titleConvo: true
      titleModel: "claude-sonnet-4-20250514"
      summarize: false
      summaryModel: "claude-sonnet-4-20250514"
      forcePrompt: false
      modelDisplayLabel: "Claude"
      
      # Custom system prompt for presentations
      addParams:
        system: |
          You are an expert presentation designer creating McKinsey-style and Marwyn-style presentations.
          
          You have access to a presentation generation API at /api/presentations/generate
          
          When users request presentations:
          1. Understand their requirements
          2. Build the presentation structure
          3. Call the API with proper JSON
          4. Provide download link
          
          See /api/presentation-system/config/claude-presentation-prompt.txt for full instructions.
```

---

## Railway Deployment

### Environment Variables

Add to Railway:

```bash
# Claude API
ANTHROPIC_API_KEY=sk-ant-xxx

# Presentation System
PRESENTATION_OUTPUT_DIR=/app/api/generated
PRESENTATION_MAX_FILE_AGE_DAYS=7

# LibreChat Config
CONFIG_PATH=/app/librechat.yaml
```

### Build Configuration

In `package.json`, add scripts:

```json
{
  "scripts": {
    "postinstall": "mkdir -p api/generated",
    "clean:presentations": "find api/generated -name '*.pptx' -mtime +7 -delete"
  }
}
```

### File Cleanup Cron

Add to your Railway service:

```bash
# Clean old presentations daily
0 0 * * * cd /app && npm run clean:presentations
```

---

## Usage in LibreChat

Once deployed, users can request presentations:

**Example User Request:**
```
Create a McKinsey presentation for Project Atlas. 
Target audience: Board
Key message: Recommend proceeding with £90M LBO at £1.70/share
Use UK spelling.
```

**Claude Will:**
1. Understand requirements
2. Structure the presentation
3. Call `/api/presentations/generate`
4. Return download link

**User Gets:**
```
I've created your Project Atlas presentation.

Download: [Project_Atlas_Board_Presentation.pptx]

The presentation includes:
- Title slide with Project Atlas branding
- Executive summary with key metrics
- Investment thesis framework
- Financial overview
- Recommendation slide
```

---

## Testing

### 1. Test Presentation Generation Directly

```bash
curl -X POST http://localhost:3080/api/presentations/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "mckinsey",
    "config": {"organisation": "Test Co"},
    "slides": [
      {
        "method": "createTitleSlide",
        "params": ["Test", "Presentation", "Generated via API"]
      }
    ]
  }'
```

### 2. Test via LibreChat UI

1. Start chat with Claude endpoint
2. Request: "Create a test McKinsey presentation"
3. Verify Claude generates proper API call
4. Check download link works

---

## File Generation Reference

All the actual implementation files are generated in separate files:

1. `LIBRECHAT_McKinseyPresentation.js` - Full McKinsey class
2. `LIBRECHAT_MarwynPresentation.js` - Full Marwyn class
3. `LIBRECHAT_PresentationExamples.js` - Ready-to-use templates
4. `LIBRECHAT_API_Integration.js` - Complete API route code

---

## Troubleshooting

### Issue: PptxGenJS not found
**Solution:** Run `npm install pptxgenjs` in your LibreChat backend

### Issue: File permissions
**Solution:** Ensure `api/generated` directory is writable:
```bash
chmod 755 api/generated
```

### Issue: Claude not calling API
**Solution:** Verify system prompt is loaded in `librechat.yaml`

### Issue: Downloads not working
**Solution:** Check Railway static file serving configuration

---

## Advanced: Custom Templates

To add custom slide templates:

1. Edit `McKinseyPresentation.js` or `MarwynPresentation.js`
2. Add new method (e.g., `createCustomSlide()`)
3. Update Claude system prompt to include new capability
4. Redeploy to Railway

---

## Cost Estimation

**Claude API Usage:**
- ~5K tokens per presentation generation
- At $3 per million input tokens
- = $0.015 per presentation

**Railway Hosting:**
- Starter: $5/month
- Hobby: $20/month (recommended)

**Total:** ~$20-25/month for unlimited presentations

---

## Next Steps

1. ✅ Review this guide
2. ✅ Generate implementation files (next prompts)
3. ✅ Add files to your LibreChat repo
4. ✅ Update environment variables on Railway
5. ✅ Deploy and test
6. ✅ Create first presentation

---

## Support

For issues specific to:
- **LibreChat:** https://github.com/danny-avila/LibreChat/issues
- **PptxGenJS:** https://gitbrent.github.io/PptxGenJS/
- **This System:** Reference the generated files

---

**Ready to generate the implementation files?**

Say "yes" and I'll create:
1. Complete McKinseyPresentation.js
2. Complete MarwynPresentation.js  
3. Complete API integration code
4. Example presentation templates
5. Deployment scripts
