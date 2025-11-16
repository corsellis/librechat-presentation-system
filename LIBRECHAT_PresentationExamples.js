// Presentation Examples - McKinsey Style
// Ready-to-use templates for common presentation types

const PptxGenJS = require("pptxgenjs");
const McKinseyPresentation = require("./McKinseyPresentation");

// ============================================
// EXAMPLE 1: INVESTMENT PROPOSAL
// ============================================

async function createInvestmentProposal(config) {
    const pres = new McKinseyPresentation({
        organisation: config.organisation || "Investment Fund",
        spelling: config.spelling || "UK"
    });
    
    // Title Slide
    pres.createTitleSlide(
        "Investment Proposal",
        config.investmentName || "Target Company Acquisition",
        `${config.amount || "Â£10M"} Investment Opportunity`
    );
    
    // Executive Summary
    pres.createExecutiveSummary("Executive Summary", [
        {
            value: config.amount || "Â£10M",
            label: "Investment Size",
            sublabel: "Equity stake"
        },
        {
            value: config.targetReturn || "25%",
            label: "Target IRR",
            sublabel: "5-year horizon",
            highlight: true
        },
        {
            value: config.timeline || "Q2 2024",
            label: "Close Date",
            sublabel: "Subject to DD"
        }
    ]);
    
    // Investment Thesis
    const thesisBoxes = [
        {
            title: "Market Opportunity",
            content: config.marketOpp || "â€¢ Growing market at 15% CAGR\nâ€¢ Fragmented competition\nâ€¢ Clear consolidation play",
            color: pres.colors.mckinsey_blue
        },
        {
            title: "Company Strengths",
            content: config.strengths || "â€¢ Market leader position\nâ€¢ Strong management team\nâ€¢ Proprietary technology\nâ€¢ Recurring revenue model",
            color: pres.colors.accent_teal
        },
        {
            title: "Value Creation",
            content: config.valueCreation || "â€¢ Operational improvements\nâ€¢ Geographic expansion\nâ€¢ Strategic acquisitions\nâ€¢ Digital transformation",
            color: pres.colors.accent_gold
        }
    ];
    
    pres.createFrameworkSlide("Investment Thesis", thesisBoxes);
    
    // Financial Overview Table
    const financialHeaders = ["Metric", "2022A", "2023A", "2024F", "2025F", "2026F"];
    const financialData = config.financials || [
        ["Revenue (Â£M)", "50", "65", "85", "110", "140"],
        ["EBITDA (Â£M)", "10", "14", "20", "28", "38"],
        ["EBITDA Margin", "20%", "22%", "24%", "25%", "27%"],
        ["Cash Flow (Â£M)", "8", "11", "16", "23", "32"]
    ];
    
    pres.createTableSlide("Financial Overview", financialHeaders, financialData);
    
    // Risk Assessment
    const riskHeaders = ["Risk Factor", "Impact", "Likelihood", "Mitigation"];
    const riskData = config.risks || [
        ["Market downturn", { value: "High", color: pres.colors.data_red }, "Medium", "Diversified revenue streams"],
        ["Competition", { value: "Medium", color: pres.colors.data_orange }, "High", "Strong differentiation"],
        ["Execution", { value: "Medium", color: pres.colors.data_orange }, "Low", "Experienced team"],
        ["Regulatory", { value: "Low", color: pres.colors.data_green }, "Low", "Compliance framework"]
    ];
    
    pres.createTableSlide("Risk Assessment", riskHeaders, riskData);
    
    // Timeline
    const timeline = config.timeline || [
        { period: "Month 1", title: "DUE DILIGENCE", color: pres.colors.mckinsey_blue },
        { period: "Month 2", title: "NEGOTIATION", color: pres.colors.accent_teal },
        { period: "Month 3", title: "DOCUMENTATION", color: pres.colors.accent_gold },
        { period: "Month 4", title: "CLOSING", color: pres.colors.data_green }
    ];
    
    pres.createTimeline("Transaction Timeline", timeline);
    
    // Key Messages
    const messages = config.keyMessages || [
        "Compelling investment opportunity with 25% target IRR",
        "Strong market position in growing sector",
        "Clear value creation plan identified",
        "Experienced management team in place",
        "Risks identified and mitigation strategies defined"
    ];
    
    pres.createKeyMessages(messages);
    
    // Save
    const filename = `${config.organisation}_Investment_Proposal.pptx`;
    await pres.save(filename);
    return filename;
}

// ============================================
// EXAMPLE 2: QUARTERLY BUSINESS REVIEW
// ============================================

async function createQuarterlyReview(config) {
    const pres = new McKinseyPresentation({
        organisation: config.organisation || "Your Company",
        spelling: config.spelling || "UK"
    });
    
    // Title Slide
    pres.createTitleSlide(
        "Quarterly Business",
        "Review",
        `${config.quarter || "Q4 2024"} Performance & Outlook`
    );
    
    // Performance Dashboard
    pres.createExecutiveSummary("Q4 Performance Highlights", [
        {
            value: config.revenue || "Â£25.5M",
            label: "Revenue",
            sublabel: "+12% vs PY"
        },
        {
            value: config.ebitda || "Â£5.2M",
            label: "EBITDA",
            sublabel: "20.4% margin",
            highlight: true
        },
        {
            value: config.nps || "72",
            label: "NPS Score",
            sublabel: "+8 points"
        }
    ]);
    
    // Performance vs Plan
    const performanceHeaders = ["Metric", "Actual", "Plan", "Variance", "Prior Year"];
    const performanceData = config.performance || [
        ["Revenue", "Â£25.5M", "Â£24.0M", { value: "+6%", color: pres.colors.data_green }, "Â£22.8M"],
        ["Gross Margin", "42%", "40%", { value: "+2pp", color: pres.colors.data_green }, "39%"],
        ["EBITDA", "Â£5.2M", "Â£5.0M", { value: "+4%", color: pres.colors.data_green }, "Â£4.3M"],
        ["Headcount", "245", "250", { value: "-2%", color: pres.colors.data_orange }, "220"]
    ];
    
    pres.createTableSlide("Performance vs Plan", performanceHeaders, performanceData);
    
    // Key Achievements
    const achievements = [
        {
            title: "Revenue Growth",
            content: "â€¢ Exceeded plan by 6%\nâ€¢ New product line success\nâ€¢ Geographic expansion\nâ€¢ Key account wins",
            color: pres.colors.data_green
        },
        {
            title: "Operational Excellence",
            content: "â€¢ Margin improvement +2pp\nâ€¢ Cost reduction programme\nâ€¢ Process automation\nâ€¢ Quality metrics improved",
            color: pres.colors.accent_teal
        },
        {
            title: "Strategic Progress",
            content: "â€¢ Digital transformation 60% complete\nâ€¢ Partnership agreements signed\nâ€¢ New market entry\nâ€¢ Team capability built",
            color: pres.colors.mckinsey_blue
        }
    ];
    
    pres.createFrameworkSlide("Key Achievements", achievements);
    
    // Next Quarter Priorities
    const priorities = config.priorities || [
        { period: "Immediate", title: "SALES PIPELINE", details: "Close Â£8M deals" },
        { period: "Month 1", title: "PRODUCT LAUNCH", details: "Version 2.0 release" },
        { period: "Quarter", title: "COST OPTIMISATION", details: "Â£500k savings" },
        { period: "Ongoing", title: "TALENT", details: "Key hires" }
    ];
    
    pres.createTimeline("Q1 2025 Priorities", priorities);
    
    // Key Messages
    const messages = [
        "Strong Q4 performance exceeded expectations",
        "Full year targets achieved across all metrics",
        "Strategic initiatives progressing on schedule",
        "Pipeline robust for continued growth",
        "Team engaged and capability growing"
    ];
    
    pres.createKeyMessages(messages);
    
    // Save
    const filename = `${config.organisation}_QBR_${config.quarter || "Q4_2024"}.pptx`;
    await pres.save(filename);
    return filename;
}

// ============================================
// EXAMPLE 3: STRATEGY PRESENTATION
// ============================================

async function createStrategyPresentation(config) {
    const pres = new McKinseyPresentation({
        organisation: config.organisation || "Your Company",
        spelling: config.spelling || "UK"
    });
    
    // Title Slide
    pres.createTitleSlide(
        "Strategic Plan",
        "2025-2028",
        "Accelerating Growth Through Innovation"
    );
    
    // Strategic Objectives
    pres.createExecutiveSummary("Strategic Objectives", [
        {
            value: "Â£100M",
            label: "Revenue Target",
            sublabel: "By 2028"
        },
        {
            value: "25%",
            label: "EBITDA Margin",
            sublabel: "Industry leading",
            highlight: true
        },
        {
            value: "#1",
            label: "Market Position",
            sublabel: "In key segments"
        }
    ]);
    
    // Market Analysis
    const marketHeaders = ["Segment", "Market Size", "Growth Rate", "Our Share", "Opportunity"];
    const marketData = [
        ["Enterprise", "Â£500M", "8%", "12%", { value: "High", color: pres.colors.data_green }],
        ["Mid-Market", "Â£300M", "12%", "8%", { value: "High", color: pres.colors.data_green }],
        ["SMB", "Â£200M", "15%", "3%", { value: "Medium", color: pres.colors.data_orange }],
        ["Public Sector", "Â£150M", "5%", "2%", { value: "Low", color: pres.colors.data_red }]
    ];
    
    pres.createTableSlide("Market Opportunity Analysis", marketHeaders, marketData);
    
    // Strategic Pillars
    const pillars = [
        {
            title: "Customer Excellence",
            content: "â€¢ Enhance customer experience\nâ€¢ Expand service portfolio\nâ€¢ Deepen relationships\nâ€¢ Improve retention to 95%",
            color: pres.colors.mckinsey_blue
        },
        {
            title: "Operational Efficiency",
            content: "â€¢ Automate core processes\nâ€¢ Optimise cost structure\nâ€¢ Improve margins by 5pp\nâ€¢ Scale infrastructure",
            color: pres.colors.accent_teal
        },
        {
            title: "Innovation & Growth",
            content: "â€¢ Launch 3 new products\nâ€¢ Enter 2 new markets\nâ€¢ Strategic partnerships\nâ€¢ Digital transformation",
            color: pres.colors.accent_gold
        }
    ];
    
    pres.createFrameworkSlide("Strategic Pillars", pillars);
    
    // Financial Projections
    const projectionHeaders = ["Metric", "2024A", "2025F", "2026F", "2027F", "2028F"];
    const projectionData = [
        ["Revenue (Â£M)", "40", "52", "68", "85", "100"],
        ["Growth %", "15%", "30%", "31%", "25%", "18%"],
        ["EBITDA (Â£M)", "8", "11", "15", "20", "25"],
        ["EBITDA %", "20%", "21%", "22%", "24%", "25%"],
        ["Headcount", "200", "250", "320", "380", "420"]
    ];
    
    pres.createTableSlide("Financial Projections", projectionHeaders, projectionData);
    
    // Implementation Roadmap
    const roadmap = [
        { period: "2025", title: "FOUNDATION", details: "Systems & capabilities" },
        { period: "2026", title: "EXPANSION", details: "New markets & products" },
        { period: "2027", title: "SCALE", details: "Accelerate growth" },
        { period: "2028", title: "LEADERSHIP", details: "Market position" }
    ];
    
    pres.createTimeline("Implementation Roadmap", roadmap);
    
    // Investment Requirements
    const investmentHeaders = ["Category", "2025", "2026", "2027", "2028", "Total"];
    const investmentData = [
        ["Technology", "Â£2M", "Â£3M", "Â£2M", "Â£1M", "Â£8M"],
        ["People", "Â£1M", "Â£2M", "Â£2M", "Â£1M", "Â£6M"],
        ["Marketing", "Â£1M", "Â£1M", "Â£2M", "Â£2M", "Â£6M"],
        ["Operations", "Â£1M", "Â£1M", "Â£1M", "Â£2M", "Â£5M"],
        [{ value: "Total", bold: true }, "Â£5M", "Â£7M", "Â£7M", "Â£6M", { value: "Â£25M", bold: true }]
    ];
    
    pres.createTableSlide("Investment Requirements", investmentHeaders, investmentData);
    
    // Key Messages
    const messages = [
        "Clear path to Â£100M revenue by 2028",
        "Strategy builds on core strengths",
        "Investment required but self-funding by 2026",
        "Risks identified with mitigation plans",
        "Board approval requested to proceed"
    ];
    
    pres.createKeyMessages(messages);
    
    // Save
    const filename = `${config.organisation}_Strategy_2025-2028.pptx`;
    await pres.save(filename);
    return filename;
}

// ============================================
// USAGE EXAMPLES
// ============================================

// Example 1: Quick Investment Proposal
async function example1() {
    await createInvestmentProposal({
        organisation: "ABC Capital",
        investmentName: "TechCo Acquisition",
        amount: "Â£15M",
        targetReturn: "30%",
        spelling: "UK"
    });
}

// Example 2: Quarterly Review with Custom Data
async function example2() {
    await createQuarterlyReview({
        organisation: "XYZ Limited",
        quarter: "Q1 2025",
        revenue: "Â£32.4M",
        ebitda: "Â£7.1M",
        nps: "78",
        spelling: "UK",
        performance: [
            ["Revenue", "Â£32.4M", "Â£30.0M", { value: "+8%", color: "#70AD47" }, "Â£28.1M"],
            ["EBITDA", "Â£7.1M", "Â£6.5M", { value: "+9%", color: "#70AD47" }, "Â£5.8M"]
        ]
    });
}

// Example 3: Strategy Presentation
async function example3() {
    await createStrategyPresentation({
        organisation: "Global Corp",
        spelling: "US"
    });
}

// Export functions for use
module.exports = {
    createInvestmentProposal,
    createQuarterlyReview,
    createStrategyPresentation
};

// Run examples if executed directly
if (require.main === module) {
    console.log("Creating example presentations...");
    Promise.all([example1(), example2(), example3()])
        .then(() => console.log("All presentations created successfully!"))
        .catch(err => console.error("Error:", err));
}
