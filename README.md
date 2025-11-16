# McKinsey & Marwyn Presentation System for LibreChat
## Complete Implementation Package

**Version:** 1.0  
**Last Updated:** November 2025  
**Status:** Production Ready  

---

## 📋 What's Included

This package contains everything you need to replicate the McKinsey and Marwyn presentation generation system on your Railway-hosted LibreChat instance:

### Core Files
- ✅ `LIBRECHAT_McKinseyPresentation.js` - Full McKinsey template class
- ✅ `LIBRECHAT_MarwynPresentation.js` - Full Marwyn template class
- ✅ `LIBRECHAT_PresentationExamples.js` - Ready-to-use example templates
- ✅ `LIBRECHAT_API_Integration.js` - Complete Express.js routes
- ✅ `LIBRECHAT_Claude_System_Prompt.txt` - Claude configuration
- ✅ `LIBRECHAT_setup.sh` - Automated setup script
- ✅ `LIBRECHAT_MIGRATION_GUIDE.md` - Detailed instructions
- ✅ `README.md` - This file

---

## 🚀 Quick Start (5 Minutes)

### Option A: Automated Setup

```bash
# 1. Navigate to your LibreChat directory
cd /path/to/librechat

# 2. Copy all LIBRECHAT_* files to your LibreChat root

# 3. Run setup script
chmod +x LIBRECHAT_setup.sh
./LIBRECHAT_setup.sh

# 4. Follow prompts

# 5. Restart LibreChat
npm run restart
```

### Option B: Manual Setup

```bash
# 1. Create directory structure
mkdir -p api/presentation-system/templates
mkdir -p api/generated

# 2. Install dependency
npm install pptxgenjs

# 3. Copy files:
cp LIBRECHAT_McKinseyPresentation.js api/presentation-system/templates/McKinseyPresentation.js
cp LIBRECHAT_MarwynPresentation.js api/presentation-system/templates/MarwynPresentation.js
cp LIBRECHAT_API_Integration.js api/routes/presentations.js

# 4. Register routes in api/server/index.js:
# Add: const presentationRoutes = require('./routes/presentations');
# Add: app.use('/api/presentations', presentationRoutes);

# 5. Update .env
echo "ANTHROPIC_API_KEY=your-key-here" >> .env

# 6. Restart
npm run restart
```

---

## 📖 Complete Setup Guide

### 1. Prerequisites

Before you begin, ensure you have:
- ✅ LibreChat installed and running
- ✅ Node.js 18+ 
- ✅ Railway account (for deployment)
- ✅ Anthropic API key
- ✅ Git repository for your LibreChat instance

### 2. File Placement

Copy files to these exact locations:

```
librechat/
├── api/
│   ├── presentation-system/
│   │   ├── templates/
│   │   │   ├── McKinseyPresentation.js    ← LIBRECHAT_McKinseyPresentation.js
│   │   │   └── MarwynPresentation.js      ← LIBRECHAT_MarwynPresentation.js
│   │   └── config/
│   │       └── claude-prompt.txt          ← LIBRECHAT_Claude_System_Prompt.txt
│   ├── routes/
│   │   └── presentations.js               ← LIBRECHAT_API_Integration.js
│   └── generated/                         ← Auto-created for presentations
├── .env                                   ← Add API keys here
└── librechat.yaml                         ← Configure Claude endpoint
```

### 3. Dependencies

Add to `package.json` dependencies:
```json
{
  "dependencies": {
    "pptxgenjs": "^3.12.0"
  }
}
```

Run: `npm install`

### 4. Register API Routes

In `api/server/index.js`, add:

```javascript
// Import presentation routes
const presentationRoutes = require('./routes/presentations');

// Register routes (after other route definitions)
app.use('/api/presentations', presentationRoutes);
```

### 5. Environment Variables

Add to `.env`:

```bash
# Claude API
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Presentation System
PRESENTATION_OUTPUT_DIR=/app/api/generated
PRESENTATION_MAX_FILE_AGE_DAYS=7
```

### 6. Configure Claude Endpoint

Update `librechat.yaml`:

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
      modelDisplayLabel: "Claude"
      
      # Load system prompt
      systemMessageFile: "api/presentation-system/config/claude-prompt.txt"
```

### 7. Test Installation

```bash
# Health check
curl http://localhost:3080/api/presentations/health

# Should return:
# {
#   "success": true,
#   "status": "healthy",
#   "presentationCount": 0
# }

# List available templates
curl http://localhost:3080/api/presentations/templates

# Create test presentation
curl -X POST http://localhost:3080/api/presentations/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "mckinsey",
    "config": {"organisation": "Test Co"},
    "slides": [
      {
        "method": "createTitleSlide",
        "params": ["Test", "Presentation", "System Check"]
      }
    ]
  }'
```

---

## 🎯 Usage Examples

### Example 1: Simple Request

**User says:**  
"Create a McKinsey presentation about AI strategy"

**Claude generates presentation with:**
- Title slide
- Executive summary
- Strategic framework
- Implementation timeline
- Key messages
- Next steps

**User receives:**  
Download link to `.pptx` file

### Example 2: Complex Request

**User says:**  
"Create a Marwyn investment memo for Project Atlas. £90M LBO at £1.70/share. Target IRR 25%. Include Zegona exit strategy. Use UK spelling."

**Claude generates:**
- Branded title slide
- Executive summary with key metrics
- Investment thesis framework
- Financial projections table
- Deal structure diagram
- Risk mitigation measures
- Implementation timeline
- Next steps with owners

### Example 3: API Call Structure

What Claude generates behind the scenes:

```json
{
  "type": "marwyn",
  "config": {
    "organisation": "Marwyn",
    "spelling": "UK"
  },
  "slides": [
    {
      "method": "createTitleSlide",
      "params": [
        "Project Atlas",
        "Investment Recommendation",
        "Board Meeting - January 2026"
      ]
    },
    {
      "method": "createExecutiveSummary",
      "params": [
        "Investment Opportunity",
        [
          { "value": "£90M", "label": "Investment Size", "sublabel": "Senior debt" },
          { "value": "25%", "label": "Target IRR", "sublabel": "5-year", "highlight": true },
          { "value": "£1.70", "label": "Offer Price", "sublabel": "Per share" }
        ]
      ]
    }
  ]
}
```

---

## 🔧 Railway Deployment

### 1. Prepare for Deployment

```bash
# Ensure all files are committed
git add .
git commit -m "Add presentation system"
git push origin main
```

### 2. Railway Configuration

In Railway dashboard:

**Environment Variables:**
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
PRESENTATION_OUTPUT_DIR=/app/api/generated
PRESENTATION_MAX_FILE_AGE_DAYS=7
NODE_ENV=production
```

**Build Settings:**
- Build Command: `npm install`
- Start Command: `npm run backend`

### 3. Auto-Deploy

Railway auto-deploys on git push. Monitor deployment:
```bash
railway logs --tail
```

### 4. Verify Deployment

```bash
curl https://your-app.railway.app/api/presentations/health
```

---

## 📚 API Reference

### Endpoints

#### Generate Presentation
```http
POST /api/presentations/generate
Content-Type: application/json

{
  "type": "mckinsey" | "marwyn",
  "config": {
    "organisation": "Company Name",
    "spelling": "UK" | "US"
  },
  "slides": [ /* slide definitions */ ]
}

Response:
{
  "success": true,
  "filename": "mckinsey_Company_Name_20250112.pptx",
  "slideCount": 12,
  "downloadUrl": "/api/presentations/download/mckinsey_Company_Name_20250112.pptx"
}
```

#### Download Presentation
```http
GET /api/presentations/download/:filename

Response: Binary .pptx file
```

#### List Presentations
```http
GET /api/presentations/list

Response:
{
  "success": true,
  "count": 5,
  "presentations": [
    {
      "filename": "mckinsey_Project_20250112.pptx",
      "size": 1048576,
      "created": "2025-01-12T10:30:00.000Z",
      "downloadUrl": "/api/presentations/download/..."
    }
  ]
}
```

#### Delete Presentation
```http
DELETE /api/presentations/delete/:filename

Response:
{
  "success": true,
  "message": "Deleted filename.pptx"
}
```

#### Cleanup Old Files
```http
POST /api/presentations/cleanup
Content-Type: application/json

{
  "maxAgeDays": 7
}

Response:
{
  "success": true,
  "deletedCount": 3
}
```

#### Health Check
```http
GET /api/presentations/health

Response:
{
  "success": true,
  "status": "healthy",
  "presentationCount": 5
}
```

#### Template Information
```http
GET /api/presentations/templates

Response:
{
  "templates": [
    {
      "name": "McKinsey",
      "type": "mckinsey",
      "description": "...",
      "methods": ["createTitleSlide", ...]
    }
  ]
}
```

---

## 🎨 Customization

### Adding New Slide Types

Edit `McKinseyPresentation.js` or `MarwynPresentation.js`:

```javascript
createCustomSlide(title, content) {
    const slide = this.pres.addSlide();
    
    // Your custom slide logic here
    
    return slide;
}
```

### Changing Brand Colors

In presentation class constructor:

```javascript
this.colors = {
    primary: "YOUR_HEX",
    secondary: "YOUR_HEX",
    // ...
};
```

### Creating New Templates

1. Duplicate `McKinseyPresentation.js`
2. Update colors and typography
3. Register in `api/routes/presentations.js`
4. Update Claude system prompt

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'pptxgenjs'"
**Solution:** Run `npm install pptxgenjs`

### Issue: "Route not found"
**Solution:** Ensure routes are registered in `api/server/index.js`

### Issue: "Permission denied on generated folder"
**Solution:** `chmod 755 api/generated`

### Issue: "Claude not generating presentations"
**Solution:** 
1. Check `librechat.yaml` has correct system prompt path
2. Verify `ANTHROPIC_API_KEY` in `.env`
3. Restart LibreChat

### Issue: "Download link returns 404"
**Solution:** Check file was created in `api/generated/`

### Issue: "Railway deployment fails"
**Solution:**
1. Check Railway logs
2. Verify all dependencies in `package.json`
3. Ensure environment variables set

---

## 📊 Performance & Limits

**Generation Time:**  
- Simple presentation (5 slides): ~2 seconds
- Complex presentation (20 slides): ~5 seconds

**File Sizes:**
- Typical: 50-200 KB
- With images: 500 KB - 2 MB

**Concurrent Requests:**
- Node.js handles multiple concurrent generations
- No special configuration needed

**Storage:**
- Auto-cleanup after 7 days
- Manual cleanup via `/cleanup` endpoint
- Railway: 1 GB storage included

---

## 💰 Cost Estimation

**Claude API:**
- ~5K tokens per presentation
- $3 per million input tokens
- = $0.015 per presentation

**Railway Hosting:**
- Hobby: $20/month (recommended)
- Includes: 512 MB RAM, 1 GB storage

**Total:** ~$20-25/month for unlimited presentations

---

## 🔐 Security

**API Security:**
- No authentication required by default
- Add middleware if needed:

```javascript
// In api/routes/presentations.js
router.use((req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.PRESENTATION_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
});
```

**File Security:**
- Generated files stored in dedicated directory
- Filename validation prevents directory traversal
- Auto-cleanup prevents disk filling

---

## 📝 Best Practices

1. **Use descriptive file names** in config.organisation
2. **Run cleanup regularly** via cron or manual endpoint
3. **Monitor disk usage** if generating many presentations
4. **Test locally** before deploying to Railway
5. **Back up templates** if customizing heavily
6. **Use UK spelling** for consistency (unless US audience)
7. **Keep slides focused** - one message per slide
8. **Include sources** for all data
9. **Add clear next steps** with owners and dates

---

## 🆘 Support Resources

**LibreChat:**
- Docs: https://docs.librechat.ai
- Issues: https://github.com/danny-avila/LibreChat/issues

**PptxGenJS:**
- Docs: https://gitbrent.github.io/PptxGenJS/
- Examples: https://gitbrent.github.io/PptxGenJS/docs/usage-pres-create/

**Railway:**
- Docs: https://docs.railway.app
- Community: https://discord.gg/railway

**Claude API:**
- Docs: https://docs.anthropic.com
- Console: https://console.anthropic.com

---

## 📅 Maintenance

### Weekly
- Check disk usage
- Review generated presentations
- Monitor API usage

### Monthly
- Update dependencies: `npm update`
- Review and delete old presentations
- Check Railway usage/costs

### Quarterly
- Update Claude API to latest model
- Review and optimize slide templates
- Backup customizations

---

## 🎉 Success Checklist

Before going live, verify:

- [ ] All files in correct locations
- [ ] Dependencies installed
- [ ] Routes registered in app.js
- [ ] Environment variables set
- [ ] Health check returns success
- [ ] Test presentation generated successfully
- [ ] Download link works
- [ ] Claude can generate presentations
- [ ] Railway deployment successful
- [ ] Production health check passes

---

## 🚦 What's Next?

1. **Test thoroughly** in development
2. **Deploy to Railway**
3. **Create first presentation** via LibreChat
4. **Share with team**
5. **Gather feedback**
6. **Iterate on templates**

---

## 📄 License

This implementation package is provided as-is for use with LibreChat.

PptxGenJS is MIT licensed.  
LibreChat is MIT licensed.

---

## 🙏 Acknowledgments

- Built on PptxGenJS by Brent Ely
- Integrated with LibreChat by Danny Avila
- McKinsey style inspired by management consulting best practices
- Marwyn branding from Marwyn Investment Management

---

**Package Version:** 1.0  
**Last Updated:** November 2025  
**Tested With:** LibreChat v0.7.x, Node.js 18.x, Railway

---

For questions or issues with this package, refer to the LIBRECHAT_MIGRATION_GUIDE.md for detailed technical information.
