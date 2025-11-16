// Marwyn-Style PowerPoint Generator
// Investment-focused presentation creation module
// Based on Marwyn Corporate 2022 Brand System

const PptxGenJS = require("pptxgenjs");

class MarwynPresentation {
    constructor(config = {}) {
        // Initialize presentation
        this.pres = new PptxGenJS();
        this.pres.layout = 'LAYOUT_16x9';
        
        // Organisation configuration
        this.config = {
            organisation: config.organisation || "Marwyn",
            tagline: config.tagline || "STRAIGHT TALKING, FORWARD THINKING INVESTMENT",
            primaryColor: config.primaryColor || "FF6C2C",
            spelling: config.spelling || "UK", // UK or US
            ...config
        };
        
        // Marwyn colour palette
        this.colors = {
            marwyn_orange: "FF6C2C",
            charcoal_dark: "292929",
            charcoal_mid: "292B29",
            slate_mid: "5F625F",
            pearl: "F2F2F2",
            pure_white: "FFFFFF",
            // Data visualization colors
            data_green: "70AD47",
            data_orange: "ED7D31",
            data_red: "C5504B",
            data_purple: "7030A0",
            data_navy: "244061"
        };
        
        // Typography standards
        this.typography = {
            title: {
                fontSize: 44,
                color: this.colors.charcoal_dark,
                fontFace: "Calibri"
            },
            sectionTitle: {
                fontSize: 32,
                color: this.colors.charcoal_dark,
                fontFace: "Calibri",
                bold: true
            },
            slideTitle: {
                fontSize: 28,
                color: this.colors.charcoal_dark,
                fontFace: "Calibri",
                bold: true
            },
            heading: {
                fontSize: 20,
                bold: true,
                color: this.colors.charcoal_dark,
                fontFace: "Calibri"
            },
            subheading: {
                fontSize: 18,
                bold: true,
                color: this.colors.charcoal_dark,
                fontFace: "Calibri"
            },
            body: {
                fontSize: 14,
                color: this.colors.charcoal_dark,
                fontFace: "Calibri"
            },
            tagline: {
                fontSize: 11,
                color: this.colors.marwyn_orange,
                fontFace: "Calibri Light",
                charSpacing: 2
            },
            caption: {
                fontSize: 11,
                color: this.colors.slate_mid,
                fontFace: "Calibri"
            },
            dataLarge: {
                fontSize: 36,
                color: this.colors.marwyn_orange,
                fontFace: "Calibri Light"
            },
            dataSmall: {
                fontSize: 20,
                bold: true,
                color: this.colors.charcoal_dark,
                fontFace: "Calibri"
            }
        };
        
        // Layout constants
        this.layout = {
            marginLeft: 0.75,
            marginRight: 0.75,
            marginTop: 0.75,
            marginBottom: 0.75,
            contentWidth: 12.83,
            contentHeight: 6.0
        };
    }
    
    // ============================================
    // UTILITY METHODS
    // ============================================
    
    addTagline(slide, position = "bottom") {
        const taglineText = this.config.tagline;
        
        if (position === "bottom") {
            slide.addText(taglineText, {
                x: 0.5,
                y: 6.8,
                w: 12.33,
                h: 0.3,
                fontSize: 11,
                color: this.colors.slate_mid,
                fontFace: "Calibri Light",
                align: "left",
                charSpacing: 2
            });
        } else if (position === "top") {
            slide.addText(taglineText, {
                x: 0.5,
                y: 0.2,
                w: 12.33,
                h: 0.3,
                fontSize: 11,
                color: this.colors.marwyn_orange,
                fontFace: "Calibri Light",
                align: "right",
                charSpacing: 2
            });
        }
    }
    
    // ============================================
    // SLIDE TEMPLATES
    // ============================================
    
    createTitleSlide(lineOne, lineTwo, subtitle = "") {
        const slide = this.pres.addSlide();
        
        // Title (two lines)
        slide.addText(lineOne, {
            x: this.layout.marginLeft,
            y: 2.5,
            w: this.layout.contentWidth,
            h: 0.6,
            ...this.typography.title,
            align: "left"
        });
        
        slide.addText(lineTwo, {
            x: this.layout.marginLeft,
            y: 3.2,
            w: this.layout.contentWidth,
            h: 0.6,
            ...this.typography.title,
            align: "left"
        });
        
        // Subtitle
        if (subtitle) {
            slide.addText(subtitle, {
                x: this.layout.marginLeft,
                y: 4.2,
                w: this.layout.contentWidth,
                h: 0.4,
                ...this.typography.subheading,
                align: "left"
            });
        }
        
        // Tagline
        this.addTagline(slide, "bottom");
        
        return slide;
    }
    
    createSectionSlide(sectionTitle) {
        const slide = this.pres.addSlide();
        
        // Section title - large and centered
        slide.addText(sectionTitle, {
            x: 1,
            y: 3,
            w: 11.33,
            h: 1.5,
            ...this.typography.sectionTitle,
            align: "left",
            valign: "middle"
        });
        
        // Tagline at top
        this.addTagline(slide, "top");
        
        return slide;
    }
    
    createExecutiveSummary(title, metrics) {
        const slide = this.pres.addSlide();
        
        // Title
        slide.addText(title, {
            x: this.layout.marginLeft,
            y: this.layout.marginTop,
            w: this.layout.contentWidth,
            h: 0.5,
            ...this.typography.slideTitle
        });
        
        // Three metric cards
        const cardWidth = 3.8;
        const cardHeight = 1.8;
        const gap = 0.3;
        const startY = 2.0;
        
        metrics.forEach((metric, index) => {
            const x = this.layout.marginLeft + (index * (cardWidth + gap));
            
            // Card background
            slide.addShape(this.pres.ShapeType.rect, {
                x: x,
                y: startY,
                w: cardWidth,
                h: cardHeight,
                fill: { color: this.colors.pearl },
                line: { type: 'none' }
            });
            
            // Metric value
            slide.addText(metric.value, {
                x: x,
                y: startY + 0.3,
                w: cardWidth,
                h: 0.6,
                ...this.typography.dataLarge,
                align: "center",
                color: metric.highlight ? this.colors.marwyn_orange : this.colors.charcoal_dark
            });
            
            // Metric label
            slide.addText(metric.label, {
                x: x,
                y: startY + 1.0,
                w: cardWidth,
                h: 0.3,
                ...this.typography.heading,
                align: "center"
            });
            
            // Sublabel
            if (metric.sublabel) {
                slide.addText(metric.sublabel, {
                    x: x,
                    y: startY + 1.35,
                    w: cardWidth,
                    h: 0.25,
                    ...this.typography.caption,
                    align: "center"
                });
            }
        });
        
        this.addTagline(slide, "bottom");
        
        return slide;
    }
    
    createTableSlide(title, headers, rows) {
        const slide = this.pres.addSlide();
        
        // Title
        slide.addText(title, {
            x: this.layout.marginLeft,
            y: this.layout.marginTop,
            w: this.layout.contentWidth,
            h: 0.5,
            ...this.typography.slideTitle
        });
        
        // Prepare table data
        const tableData = [headers, ...rows];
        
        // Add table
        slide.addTable(tableData, {
            x: this.layout.marginLeft,
            y: 1.5,
            w: this.layout.contentWidth,
            h: 4.0,
            fontSize: 12,
            fontFace: "Calibri",
            border: { pt: 0.5, color: this.colors.pearl },
            fill: { color: this.colors.pure_white },
            color: this.colors.charcoal_dark,
            rowH: 0.4,
            valign: 'middle',
            align: 'left',
            autoPage: false,
            autoPageRepeatHeader: true,
            autoPageLineWeight: 0
        });
        
        this.addTagline(slide, "bottom");
        
        return slide;
    }
    
    createFrameworkSlide(title, boxes) {
        const slide = this.pres.addSlide();
        
        // Title
        slide.addText(title, {
            x: this.layout.marginLeft,
            y: this.layout.marginTop,
            w: this.layout.contentWidth,
            h: 0.5,
            ...this.typography.slideTitle
        });
        
        // Three framework boxes
        const boxWidth = 3.8;
        const boxHeight = 3.5;
        const gap = 0.4;
        const startY = 1.8;
        
        boxes.forEach((box, index) => {
            const x = this.layout.marginLeft + (index * (boxWidth + gap));
            
            // Box with colored top bar
            slide.addShape(this.pres.ShapeType.rect, {
                x: x,
                y: startY,
                w: boxWidth,
                h: 0.4,
                fill: { color: box.color || this.colors.marwyn_orange },
                line: { type: 'none' }
            });
            
            slide.addShape(this.pres.ShapeType.rect, {
                x: x,
                y: startY + 0.4,
                w: boxWidth,
                h: boxHeight - 0.4,
                fill: { color: this.colors.pearl },
                line: { type: 'none' }
            });
            
            // Box title
            slide.addText(box.title, {
                x: x + 0.2,
                y: startY + 0.6,
                w: boxWidth - 0.4,
                h: 0.4,
                ...this.typography.heading,
                bold: true,
                align: "left"
            });
            
            // Box content
            slide.addText(box.content, {
                x: x + 0.2,
                y: startY + 1.1,
                w: boxWidth - 0.4,
                h: boxHeight - 1.3,
                ...this.typography.body,
                align: "left",
                valign: "top"
            });
        });
        
        this.addTagline(slide, "bottom");
        
        return slide;
    }
    
    createNumberedFramework(title, items, closingStat = "") {
        const slide = this.pres.addSlide();
        
        // Title
        slide.addText(title, {
            x: this.layout.marginLeft,
            y: this.layout.marginTop,
            w: this.layout.contentWidth,
            h: 0.5,
            ...this.typography.slideTitle
        });
        
        // Numbered items (typically 4)
        const startY = 1.8;
        const itemHeight = 1.0;
        
        items.forEach((item, index) => {
            const y = startY + (index * itemHeight);
            
            // Number circle
            slide.addShape(this.pres.ShapeType.ellipse, {
                x: this.layout.marginLeft,
                y: y,
                w: 0.5,
                h: 0.5,
                fill: { color: this.colors.marwyn_orange },
                line: { type: 'none' }
            });
            
            slide.addText((index + 1).toString().padStart(2, '0'), {
                x: this.layout.marginLeft,
                y: y,
                w: 0.5,
                h: 0.5,
                fontSize: 16,
                color: this.colors.pure_white,
                fontFace: "Calibri",
                bold: true,
                align: "center",
                valign: "middle"
            });
            
            // Item header
            slide.addText(item.header, {
                x: this.layout.marginLeft + 0.7,
                y: y,
                w: 11.4,
                h: 0.3,
                ...this.typography.heading
            });
            
            // Item content
            slide.addText(item.content, {
                x: this.layout.marginLeft + 0.7,
                y: y + 0.35,
                w: 11.4,
                h: 0.6,
                ...this.typography.body
            });
        });
        
        // Closing statistic if provided
        if (closingStat) {
            slide.addText(closingStat, {
                x: this.layout.marginLeft,
                y: 6.0,
                w: this.layout.contentWidth,
                h: 0.5,
                fontSize: 16,
                color: this.colors.marwyn_orange,
                fontFace: "Calibri",
                bold: true,
                align: "center"
            });
        }
        
        this.addTagline(slide, "bottom");
        
        return slide;
    }
    
    createTimeline(title, phases) {
        const slide = this.pres.addSlide();
        
        // Title
        slide.addText(title, {
            x: this.layout.marginLeft,
            y: this.layout.marginTop,
            w: this.layout.contentWidth,
            h: 0.5,
            ...this.typography.slideTitle
        });
        
        // Timeline phases
        const phaseCount = phases.length;
        const phaseWidth = (this.layout.contentWidth - ((phaseCount - 1) * 0.3)) / phaseCount;
        const startY = 2.5;
        
        phases.forEach((phase, index) => {
            const x = this.layout.marginLeft + (index * (phaseWidth + 0.3));
            
            // Phase box
            slide.addShape(this.pres.ShapeType.rect, {
                x: x,
                y: startY,
                w: phaseWidth,
                h: 2.5,
                fill: { color: this.colors.pearl },
                line: { pt: 2, color: this.colors.marwyn_orange }
            });
            
            // Period
            slide.addText(phase.period, {
                x: x,
                y: startY + 0.2,
                w: phaseWidth,
                h: 0.3,
                ...this.typography.caption,
                color: this.colors.marwyn_orange,
                align: "center",
                bold: true
            });
            
            // Phase title
            slide.addText(phase.title, {
                x: x + 0.1,
                y: startY + 0.6,
                w: phaseWidth - 0.2,
                h: 0.4,
                ...this.typography.heading,
                align: "center"
            });
            
            // Details
            if (phase.details) {
                slide.addText(phase.details, {
                    x: x + 0.1,
                    y: startY + 1.1,
                    w: phaseWidth - 0.2,
                    h: 1.2,
                    ...this.typography.body,
                    align: "left",
                    valign: "top"
                });
            }
        });
        
        this.addTagline(slide, "bottom");
        
        return slide;
    }
    
    createCaseStudy(title, caseData) {
        const slide = this.pres.addSlide();
        
        // Title
        slide.addText(title, {
            x: this.layout.marginLeft,
            y: this.layout.marginTop,
            w: this.layout.contentWidth,
            h: 0.5,
            ...this.typography.slideTitle
        });
        
        // Company name
        slide.addText(caseData.company, {
            x: this.layout.marginLeft,
            y: 1.5,
            w: this.layout.contentWidth,
            h: 0.5,
            fontSize: 28,
            color: this.colors.marwyn_orange,
            fontFace: "Calibri",
            bold: true
        });
        
        // Timeline bar
        const timelineY = 2.3;
        slide.addShape(this.pres.ShapeType.rect, {
            x: this.layout.marginLeft,
            y: timelineY,
            w: this.layout.contentWidth,
            h: 0.05,
            fill: { color: this.colors.marwyn_orange },
            line: { type: 'none' }
        });
        
        // Entry details
        slide.addText("Entry", {
            x: this.layout.marginLeft,
            y: timelineY + 0.2,
            w: 4,
            h: 0.3,
            ...this.typography.caption,
            color: this.colors.slate_mid
        });
        
        slide.addText(caseData.entry.date, {
            x: this.layout.marginLeft,
            y: timelineY + 0.5,
            w: 4,
            h: 0.3,
            ...this.typography.body,
            bold: true
        });
        
        slide.addText(caseData.entry.value, {
            x: this.layout.marginLeft,
            y: timelineY + 0.85,
            w: 4,
            h: 0.35,
            fontSize: 20,
            color: this.colors.charcoal_dark,
            fontFace: "Calibri",
            bold: true
        });
        
        // Exit details
        slide.addText("Exit", {
            x: this.layout.marginLeft + 8.83,
            y: timelineY + 0.2,
            w: 4,
            h: 0.3,
            ...this.typography.caption,
            color: this.colors.slate_mid,
            align: "right"
        });
        
        slide.addText(caseData.exit.date, {
            x: this.layout.marginLeft + 8.83,
            y: timelineY + 0.5,
            w: 4,
            h: 0.3,
            ...this.typography.body,
            bold: true,
            align: "right"
        });
        
        slide.addText(caseData.exit.value, {
            x: this.layout.marginLeft + 8.83,
            y: timelineY + 0.85,
            w: 4,
            h: 0.35,
            fontSize: 20,
            color: this.colors.data_green,
            fontFace: "Calibri",
            bold: true,
            align: "right"
        });
        
        // Return multiple
        slide.addText(caseData.return, {
            x: 5,
            y: timelineY + 0.5,
            w: 3.33,
            h: 0.7,
            fontSize: 32,
            color: this.colors.marwyn_orange,
            fontFace: "Calibri Light",
            align: "center",
            valign: "middle"
        });
        
        // Achievements
        slide.addText("Key Achievements", {
            x: this.layout.marginLeft,
            y: 4.0,
            w: this.layout.contentWidth,
            h: 0.3,
            ...this.typography.heading
        });
        
        const achievements = caseData.achievements.join('\n');
        slide.addText(achievements, {
            x: this.layout.marginLeft,
            y: 4.4,
            w: this.layout.contentWidth,
            h: 1.8,
            ...this.typography.body
        });
        
        this.addTagline(slide, "bottom");
        
        return slide;
    }
    
    createKeyMessages(title, messages) {
        const slide = this.pres.addSlide();
        
        // Title
        slide.addText(title, {
            x: this.layout.marginLeft,
            y: this.layout.marginTop,
            w: this.layout.contentWidth,
            h: 0.5,
            ...this.typography.slideTitle
        });
        
        // Messages as numbered list
        const startY = 1.8;
        const itemHeight = 1.2;
        
        messages.forEach((message, index) => {
            const y = startY + (index * itemHeight);
            
            // Number
            slide.addText(`${index + 1}.`, {
                x: this.layout.marginLeft,
                y: y,
                w: 0.5,
                h: 0.4,
                fontSize: 20,
                color: this.colors.marwyn_orange,
                fontFace: "Calibri",
                bold: true
            });
            
            // Message
            slide.addText(message, {
                x: this.layout.marginLeft + 0.6,
                y: y,
                w: 11.7,
                h: 1.0,
                ...this.typography.body,
                align: "left",
                valign: "top"
            });
        });
        
        this.addTagline(slide, "bottom");
        
        return slide;
    }
    
    createNextSteps(title, steps) {
        const slide = this.pres.addSlide();
        
        // Title
        slide.addText(title, {
            x: this.layout.marginLeft,
            y: this.layout.marginTop,
            w: this.layout.contentWidth,
            h: 0.5,
            ...this.typography.slideTitle
        });
        
        // Steps timeline
        const startY = 2.0;
        const stepHeight = 0.9;
        
        steps.forEach((step, index) => {
            const y = startY + (index * stepHeight);
            
            // Phase bar
            slide.addShape(this.pres.ShapeType.rect, {
                x: this.layout.marginLeft,
                y: y,
                w: 3,
                h: 0.6,
                fill: { color: this.colors.marwyn_orange },
                line: { type: 'none' }
            });
            
            slide.addText(step.phase, {
                x: this.layout.marginLeft + 0.2,
                y: y,
                w: 2.6,
                h: 0.6,
                fontSize: 14,
                color: this.colors.pure_white,
                fontFace: "Calibri",
                bold: true,
                align: "left",
                valign: "middle"
            });
            
            // Action description
            slide.addText(step.action, {
                x: this.layout.marginLeft + 3.3,
                y: y,
                w: 6.5,
                h: 0.6,
                ...this.typography.body,
                valign: "middle"
            });
            
            // Owner & timing
            const meta = `${step.owner} | ${step.timing}`;
            slide.addText(meta, {
                x: this.layout.marginLeft + 10,
                y: y,
                w: 2.8,
                h: 0.6,
                ...this.typography.caption,
                color: this.colors.slate_mid,
                align: "right",
                valign: "middle"
            });
        });
        
        this.addTagline(slide, "bottom");
        
        return slide;
    }
}

module.exports = MarwynPresentation;
