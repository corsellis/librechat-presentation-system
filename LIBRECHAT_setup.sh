#!/bin/bash

# LibreChat Presentation System - Setup Script
# Run this script to set up the presentation system in your LibreChat installation

set -e

echo "==============================================="
echo "LibreChat Presentation System Setup"
echo "==============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the LibreChat directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found${NC}"
    echo "Please run this script from your LibreChat root directory"
    exit 1
fi

echo -e "${GREEN}✓${NC} Found LibreChat installation"
echo ""

# Create directory structure
echo "Creating directory structure..."
mkdir -p api/presentation-system/templates
mkdir -p api/presentation-system/config
mkdir -p api/generated
echo -e "${GREEN}✓${NC} Directories created"
echo ""

# Install dependencies
echo "Installing dependencies..."
if npm list pptxgenjs > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} pptxgenjs already installed"
else
    npm install pptxgenjs
    echo -e "${GREEN}✓${NC} Installed pptxgenjs"
fi
echo ""

# Copy template files
echo "Would you like to copy the presentation template files? (y/n)"
read -r response
if [ "$response" = "y" ]; then
    echo "Please place the following files in the specified locations:"
    echo "  - LIBRECHAT_McKinseyPresentation.js → api/presentation-system/templates/McKinseyPresentation.js"
    echo "  - LIBRECHAT_MarwynPresentation.js → api/presentation-system/templates/MarwynPresentation.js"
    echo "  - LIBRECHAT_API_Integration.js → api/routes/presentations.js"
    echo ""
    echo "Press Enter when files are in place..."
    read -r
fi

# Check if files exist
MISSING_FILES=0

if [ ! -f "api/presentation-system/templates/McKinseyPresentation.js" ]; then
    echo -e "${RED}✗${NC} Missing: api/presentation-system/templates/McKinseyPresentation.js"
    MISSING_FILES=1
fi

if [ ! -f "api/presentation-system/templates/MarwynPresentation.js" ]; then
    echo -e "${RED}✗${NC} Missing: api/presentation-system/templates/MarwynPresentation.js"
    MISSING_FILES=1
fi

if [ ! -f "api/routes/presentations.js" ]; then
    echo -e "${RED}✗${NC} Missing: api/routes/presentations.js"
    MISSING_FILES=1
fi

if [ $MISSING_FILES -eq 1 ]; then
    echo ""
    echo -e "${YELLOW}Some files are missing. Please copy them and run this script again.${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} All template files in place"
echo ""

# Update main app.js to include presentation routes
echo "Updating app.js to include presentation routes..."

if grep -q "presentations.js" api/server/index.js 2>/dev/null || grep -q "presentations.js" api/app.js 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Presentation routes already configured"
else
    echo ""
    echo -e "${YELLOW}Please manually add the following line to your api/server/index.js or api/app.js:${NC}"
    echo ""
    echo "const presentationRoutes = require('./routes/presentations');"
    echo "app.use('/api/presentations', presentationRoutes);"
    echo ""
    echo "Add it after other route definitions."
    echo ""
    echo "Press Enter when complete..."
    read -r
fi

# Set up environment variables
echo ""
echo "Checking environment variables..."

if [ -f ".env" ]; then
    if grep -q "ANTHROPIC_API_KEY" .env; then
        echo -e "${GREEN}✓${NC} ANTHROPIC_API_KEY found in .env"
    else
        echo -e "${YELLOW}!${NC} ANTHROPIC_API_KEY not found in .env"
        echo "Please add your Anthropic API key to .env:"
        echo "ANTHROPIC_API_KEY=sk-ant-your-key-here"
    fi
    
    if grep -q "PRESENTATION_OUTPUT_DIR" .env; then
        echo -e "${GREEN}✓${NC} PRESENTATION_OUTPUT_DIR configured"
    else
        echo "Adding PRESENTATION_OUTPUT_DIR to .env..."
        echo "" >> .env
        echo "# Presentation System" >> .env
        echo "PRESENTATION_OUTPUT_DIR=/app/api/generated" >> .env
        echo "PRESENTATION_MAX_FILE_AGE_DAYS=7" >> .env
    fi
else
    echo -e "${RED}✗${NC} .env file not found"
    echo "Please create a .env file with the required variables"
fi

echo ""
echo "==============================================="
echo "Setup Summary"
echo "==============================================="
echo ""
echo -e "${GREEN}✓${NC} Directory structure created"
echo -e "${GREEN}✓${NC} Dependencies installed"
echo -e "${GREEN}✓${NC} Template files in place"
echo ""
echo "Next steps:"
echo "1. Ensure API routes are registered in app.js"
echo "2. Add ANTHROPIC_API_KEY to .env file"
echo "3. Update librechat.yaml with Claude configuration"
echo "4. Restart LibreChat"
echo "5. Test with: curl http://localhost:3080/api/presentations/health"
echo ""
echo "For Railway deployment:"
echo "- Push changes to git"
echo "- Railway will auto-deploy"
echo "- Add environment variables in Railway dashboard"
echo ""
echo "==============================================="
echo "Setup complete!"
echo "==============================================="
