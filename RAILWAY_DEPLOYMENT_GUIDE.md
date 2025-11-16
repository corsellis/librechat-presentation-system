# Railway Deployment Guide - Step by Step

**SECURITY FIRST:** Your API key was exposed. Please rotate it immediately at:
https://console.anthropic.com/settings/keys

---

## Prerequisites

- [ ] Railway account (sign up at railway.app)
- [ ] Git repository with LibreChat code
- [ ] NEW Anthropic API key (after rotation)
- [ ] Railway CLI installed (optional but recommended)

---

## Option 1: Deploy via Railway Web Dashboard (Easiest)

### Step 1: Push Code to GitHub

```bash
# In your LibreChat directory
git add .
git commit -m "Add presentation system"
git push origin main
```

### Step 2: Connect Railway to GitHub

1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your LibreChat repository
5. Railway will auto-detect Node.js and start building

### Step 3: Set Environment Variables

In Railway dashboard, go to Variables tab and add:

```
ANTHROPIC_API_KEY=your-NEW-key-here
PRESENTATION_OUTPUT_DIR=/app/api/generated
PRESENTATION_MAX_FILE_AGE_DAYS=7
NODE_ENV=production

# Your existing LibreChat variables
MONGO_URI=...
SESSION_EXPIRY=...
# etc.
```

### Step 4: Verify Deployment

Once deployed, Railway gives you a URL like: `your-app.railway.app`

Test:
```bash
curl https://your-app.railway.app/api/presentations/health
```

Should return: `{"success": true, "status": "healthy"}`

---

## Option 2: Deploy via Railway CLI (More Control)

### Step 1: Install Railway CLI

```bash
# macOS
brew install railway

# or npm
npm install -g @railway/cli
```

### Step 2: Login to Railway

```bash
railway login
```

### Step 3: Initialize Railway Project

```bash
# In your LibreChat directory
railway init
```

### Step 4: Set Environment Variables

```bash
# Set variables
railway variables set ANTHROPIC_API_KEY="your-NEW-key-here"
railway variables set PRESENTATION_OUTPUT_DIR="/app/api/generated"
railway variables set PRESENTATION_MAX_FILE_AGE_DAYS="7"
railway variables set NODE_ENV="production"
```

### Step 5: Deploy

```bash
# Deploy current code
railway up

# Or link to GitHub for auto-deploy
railway link
```

### Step 6: Get Deployment URL

```bash
railway domain
```

---

## Post-Deployment Checklist

Once deployed, verify:

### 1. Health Check
```bash
curl https://your-app.railway.app/api/presentations/health
```

Expected:
```json
{
  "success": true,
  "status": "healthy",
  "presentationCount": 0
}
```

### 2. Templates Endpoint
```bash
curl https://your-app.railway.app/api/presentations/templates
```

Should return list of available templates.

### 3. Test Generation
```bash
curl -X POST https://your-app.railway.app/api/presentations/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "mckinsey",
    "config": {"organisation": "Test"},
    "slides": [
      {
        "method": "createTitleSlide",
        "params": ["Test", "Production", "Railway Deployment"]
      }
    ]
  }'
```

### 4. Test Claude Integration

In LibreChat:
1. Select Claude Presentations endpoint
2. Say: "Create a test presentation"
3. Verify you get a download link

---

## Monitoring & Maintenance

### View Logs
```bash
# Via CLI
railway logs

# Or in web dashboard:
# Projects → Your App → Deployments → View Logs
```

### Monitor Usage

Check Railway dashboard for:
- Memory usage
- CPU usage
- Network bandwidth
- Disk usage

### Cleanup Old Files

Set up a cron job in Railway:
1. Add to `package.json`:
```json
{
  "scripts": {
    "cleanup": "curl -X POST http://localhost:3080/api/presentations/cleanup"
  }
}
```

2. Use Railway Cron plugin or external service

---

## Troubleshooting

### Issue: Build Fails

**Check:**
- All files are committed to git
- `package.json` includes `pptxgenjs`
- No syntax errors in code

**Solution:**
```bash
# Test locally first
npm install
npm run backend

# Then push
git push origin main
```

### Issue: "Module not found" Error

**Solution:**
```bash
# In package.json, ensure:
{
  "dependencies": {
    "pptxgenjs": "^3.12.0"
  }
}

# Commit and push
git add package.json
git commit -m "Add pptxgenjs dependency"
git push
```

### Issue: API Key Not Working

**Check:**
1. Key is correctly set in Railway variables
2. No extra spaces or quotes
3. Key is valid (test at console.anthropic.com)

### Issue: Download Links 404

**Check:**
1. `/api/generated` directory exists and is writable
2. Files are actually being created
3. Routes are registered in `api/server/index.js`

---

## Cost Management

### Railway Pricing (as of Nov 2025)

**Starter (Free):**
- $5 credit per month
- Good for testing

**Hobby ($5/month):**
- 512MB RAM
- 1GB storage
- Good for light use

**Pro ($20/month):**
- 8GB RAM
- 100GB storage
- Recommended for production

### Claude API Costs

- ~$0.015 per presentation
- ~$5-10/month typical usage
- Set spending limits at console.anthropic.com

---

## Security Best Practices

### 1. Rotate API Keys Immediately

After this deployment, go to:
https://console.anthropic.com/settings/keys

1. Create new key
2. Update Railway variables
3. Delete old key

### 2. Never Hardcode Keys

✅ Good:
```javascript
const apiKey = process.env.ANTHROPIC_API_KEY;
```

❌ Bad:
```javascript
const apiKey = "sk-ant-api03-...";
```

### 3. Use Railway Secrets

For sensitive data:
```bash
railway variables set --secret DATABASE_PASSWORD="..."
```

### 4. Enable Railway 2FA

In Railway account settings, enable two-factor authentication.

### 5. Review Access Logs

Regularly check Railway logs for suspicious activity.

---

## Scaling Considerations

### If You Get Heavy Usage

1. **Upgrade Railway Plan**
   - More RAM for concurrent requests
   - More storage for generated files

2. **Add Caching**
   - Cache frequently generated presentations
   - Use Redis for session storage

3. **Optimize File Storage**
   - Move generated files to S3/R2
   - Reduce local storage usage

4. **Load Balancing**
   - Railway Pro supports multiple instances
   - Use Railway's built-in load balancing

---

## Backup Strategy

### Code Backup
- Primary: GitHub repository
- Secondary: Local backups

### Generated Files
- Auto-deleted after 7 days
- No backup needed (regenerate as needed)

### Configuration
- Export Railway environment variables
- Store in secure location (password manager)

---

## Next Steps After Deployment

1. **Test Thoroughly**
   - Generate multiple presentations
   - Test all slide types
   - Verify downloads work

2. **Share with Team**
   - Provide Railway URL
   - Train on presentation system
   - Gather feedback

3. **Monitor Performance**
   - Check logs daily initially
   - Monitor costs weekly
   - Review usage monthly

4. **Iterate**
   - Add custom templates
   - Optimize based on usage
   - Update dependencies

---

## Emergency Rollback

If something goes wrong:

### Via Railway Dashboard
1. Go to Deployments
2. Find previous working deployment
3. Click "Rollback"

### Via CLI
```bash
# List deployments
railway deployments

# Rollback to specific deployment
railway rollback <deployment-id>
```

---

## Getting Help

**Railway:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

**LibreChat:**
- Docs: https://docs.librechat.ai
- GitHub: https://github.com/danny-avila/LibreChat/issues

**Claude API:**
- Docs: https://docs.anthropic.com
- Support: support@anthropic.com

---

## Deployment Checklist

Before going live:

- [ ] API key rotated (OLD key deleted)
- [ ] All files committed to git
- [ ] Railway project created
- [ ] Environment variables set (NEW key)
- [ ] Code deployed successfully
- [ ] Health check passes
- [ ] Test presentation generated
- [ ] Download works
- [ ] Claude integration tested
- [ ] Team trained
- [ ] Monitoring set up
- [ ] Backup strategy in place

---

## You're Ready to Deploy!

Follow Option 1 (Web Dashboard) if you're new to Railway.
Follow Option 2 (CLI) if you want more control.

**Most Important:**
1. Rotate your API key FIRST
2. Use the NEW key in Railway
3. Delete the OLD key

Questions? Check the troubleshooting section or Railway docs.

Good luck! 🚀
