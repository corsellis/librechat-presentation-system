#!/bin/bash

# LibreChat Presentation System - Test Script
# Verifies installation and functionality

set -e

echo "═══════════════════════════════════════════════════════════"
echo "LibreChat Presentation System - Test Suite"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="${BASE_URL:-http://localhost:3080}"
API_ENDPOINT="$BASE_URL/api/presentations"

PASSED=0
FAILED=0

# Test function
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -n "Testing: $test_name... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        ((FAILED++))
        return 1
    fi
}

# Test with output
run_test_with_output() {
    local test_name="$1"
    local test_command="$2"
    
    echo "Testing: $test_name"
    
    local output
    output=$(eval "$test_command" 2>&1)
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}"
        echo "$output" | head -n 5
        echo ""
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        echo "$output"
        echo ""
        ((FAILED++))
        return 1
    fi
}

echo "═══════════════════════════════════════════════════════════"
echo "Phase 1: Environment Checks"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check if in LibreChat directory
run_test "LibreChat directory structure" "test -f package.json && grep -q librechat package.json"

# Check Node.js
run_test "Node.js installed" "command -v node"

# Check npm
run_test "npm installed" "command -v npm"

# Check pptxgenjs
run_test "pptxgenjs dependency" "npm list pptxgenjs"

# Check directory structure
run_test "presentation-system directory" "test -d api/presentation-system"
run_test "templates directory" "test -d api/presentation-system/templates"
run_test "generated directory" "test -d api/generated"

# Check files
run_test "McKinsey template" "test -f api/presentation-system/templates/McKinseyPresentation.js"
run_test "Marwyn template" "test -f api/presentation-system/templates/MarwynPresentation.js"
run_test "API routes" "test -f api/routes/presentations.js"

# Check .env
run_test ".env file exists" "test -f .env"

if [ -f .env ]; then
    if grep -q "ANTHROPIC_API_KEY" .env; then
        echo -e "${GREEN}✓${NC} ANTHROPIC_API_KEY found in .env"
        ((PASSED++))
    else
        echo -e "${YELLOW}!${NC} ANTHROPIC_API_KEY not found in .env (may cause issues)"
    fi
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Phase 2: API Endpoint Tests"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Health check
run_test_with_output "Health check endpoint" \
    "curl -s $API_ENDPOINT/health | jq -r '.status'"

# Templates list
run_test_with_output "Templates endpoint" \
    "curl -s $API_ENDPOINT/templates | jq -r '.templates[0].name'"

# List presentations
run_test "List presentations endpoint" \
    "curl -s $API_ENDPOINT/list | grep -q 'success'"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Phase 3: Presentation Generation Tests"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Test McKinsey presentation
echo "Generating test McKinsey presentation..."
MCKINSEY_RESPONSE=$(curl -s -X POST $API_ENDPOINT/generate \
    -H "Content-Type: application/json" \
    -d '{
        "type": "mckinsey",
        "config": {"organisation": "Test Co"},
        "slides": [
            {
                "method": "createTitleSlide",
                "params": ["System Test", "Verification", "Automated Test Suite"]
            },
            {
                "method": "createExecutiveSummary",
                "params": [
                    "Test Summary",
                    [
                        {"value": "100%", "label": "Test Coverage", "sublabel": "All systems"},
                        {"value": "✓", "label": "Status", "sublabel": "Operational", "highlight": true},
                        {"value": "5s", "label": "Generation Time", "sublabel": "Fast"}
                    ]
                ]
            }
        ]
    }')

if echo "$MCKINSEY_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC} - McKinsey presentation generated"
    MCKINSEY_FILE=$(echo "$MCKINSEY_RESPONSE" | jq -r '.filename')
    echo "  Filename: $MCKINSEY_FILE"
    ((PASSED++))
    
    # Test download
    if [ -n "$MCKINSEY_FILE" ]; then
        if curl -s --head $API_ENDPOINT/download/$MCKINSEY_FILE | grep -q "200 OK"; then
            echo -e "${GREEN}✓ PASS${NC} - Download endpoint working"
            ((PASSED++))
        else
            echo -e "${RED}✗ FAIL${NC} - Download endpoint failed"
            ((FAILED++))
        fi
    fi
else
    echo -e "${RED}✗ FAIL${NC} - McKinsey presentation generation failed"
    echo "$MCKINSEY_RESPONSE" | jq .
    ((FAILED++))
fi

echo ""

# Test Marwyn presentation
echo "Generating test Marwyn presentation..."
MARWYN_RESPONSE=$(curl -s -X POST $API_ENDPOINT/generate \
    -H "Content-Type: application/json" \
    -d '{
        "type": "marwyn",
        "config": {"organisation": "Test Fund", "spelling": "UK"},
        "slides": [
            {
                "method": "createTitleSlide",
                "params": ["Investment Test", "System Verification", "Automated Test"]
            },
            {
                "method": "createSectionSlide",
                "params": ["Test Section"]
            }
        ]
    }')

if echo "$MARWYN_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC} - Marwyn presentation generated"
    MARWYN_FILE=$(echo "$MARWYN_RESPONSE" | jq -r '.filename')
    echo "  Filename: $MARWYN_FILE"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} - Marwyn presentation generation failed"
    echo "$MARWYN_RESPONSE" | jq .
    ((FAILED++))
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Phase 4: Generated Files Verification"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check generated files exist
if [ -n "$MCKINSEY_FILE" ] && [ -f "api/generated/$MCKINSEY_FILE" ]; then
    FILE_SIZE=$(stat -f%z "api/generated/$MCKINSEY_FILE" 2>/dev/null || stat -c%s "api/generated/$MCKINSEY_FILE" 2>/dev/null)
    echo -e "${GREEN}✓ PASS${NC} - McKinsey file created (${FILE_SIZE} bytes)"
    ((PASSED++))
    
    # Verify it's a valid PPTX
    if file "api/generated/$MCKINSEY_FILE" | grep -q "Microsoft PowerPoint"; then
        echo -e "${GREEN}✓ PASS${NC} - Valid PowerPoint file"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} - Not a valid PowerPoint file"
        ((FAILED++))
    fi
else
    echo -e "${RED}✗ FAIL${NC} - McKinsey file not found on disk"
    ((FAILED++))
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Phase 5: Cleanup Tests"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Test file deletion
if [ -n "$MCKINSEY_FILE" ]; then
    DELETE_RESPONSE=$(curl -s -X DELETE $API_ENDPOINT/delete/$MCKINSEY_FILE)
    if echo "$DELETE_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC} - File deletion works"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} - File deletion failed"
        ((FAILED++))
    fi
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Test Summary"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo "Total:  $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}═══════════════════════════════════════════════════════════"
    echo -e "✓ ALL TESTS PASSED!"
    echo -e "═══════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "Your presentation system is fully operational."
    echo ""
    echo "Next steps:"
    echo "1. Test Claude integration in LibreChat UI"
    echo "2. Generate a real presentation"
    echo "3. Deploy to Railway if not already deployed"
    echo ""
    exit 0
else
    echo -e "${RED}═══════════════════════════════════════════════════════════"
    echo -e "✗ SOME TESTS FAILED"
    echo -e "═══════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "Please review the failures above and:"
    echo "1. Check file locations"
    echo "2. Verify API routes are registered"
    echo "3. Ensure LibreChat is running"
    echo "4. Review LIBRECHAT_MIGRATION_GUIDE.md for troubleshooting"
    echo ""
    exit 1
fi
