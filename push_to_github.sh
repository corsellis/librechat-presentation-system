#!/bin/bash

# GitHub Push Script for LibreChat Presentation System
# Run this after creating your GitHub repository

echo "📦 LibreChat Presentation System - GitHub Push"
echo "============================================"
echo ""

# Navigate to the presentation directory
cd "/Users/jamescorsellis/src/librechat presentation"

# Get the GitHub repository URL from user
echo "Please enter your GitHub repository URL:"
echo "Example: https://github.com/YOUR_USERNAME/librechat-presentation-system.git"
echo ""
read -p "GitHub URL: " GITHUB_URL

# Validate URL
if [ -z "$GITHUB_URL" ]; then
    echo "❌ Error: No URL provided"
    exit 1
fi

echo ""
echo "Adding remote origin..."
git remote add origin "$GITHUB_URL"

echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Success! Your presentation system is now on GitHub!"
echo ""
echo "Repository URL: $GITHUB_URL"
echo ""
echo "Next steps:"
echo "1. Go to your GitHub repository"
echo "2. Verify all files are uploaded"
echo "3. Add collaborators if needed (Settings → Manage access)"
echo "4. Consider adding a license file"
echo ""
echo "For Railway deployment:"
echo "1. Connect Railway to this GitHub repository"
echo "2. Railway will auto-deploy on every push"
echo ""
