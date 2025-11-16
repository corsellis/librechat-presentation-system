// McKinsey-Style PowerPoint Generator
// Professional presentation creation module

const PptxGenJS = require("pptxgenjs");

class McKinseyPresentation {
    constructor(config = {}) {
        // Initialize presentation
        this.pres = new PptxGenJS();
        this.pres.layout = 'LAYOUT_16x9';
        
        // Organisation configuration
        this.config = {
            organisation: config.organisation || "Your Organisation",
            tagline: config.tagline || "",
            primaryColor: config.primaryColor || "003A70",
            spelling: config.spelling || "UK", // UK or US
            ...config
        };
        
        // McKinsey colour palette
        this.colors = {
            mckinsey_blue: "003A70",
            accent_teal: "00B5A0",
            accent_gold: "FDB913",
            charcoal: "2D2D2D",
            slate: "58595B",
            light_grey: "D0D0CE",
            pearl: "F5F5F0",
            pure_white: "FFFFFF",
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
                color: this.colors.mckinsey_blue,
                fontFace: "Segoe UI Light"
            },
            sectionTitle: {
                fontSize: 28,
                color: this.colors.mckinsey_blue,
                fontFace: "Segoe UI Light"
            },
            slideTitle: {
                fontSize: 24,
                color: this.colors.mckinsey_blue,
                fontFace: "Segoe UI Light"
            },
            heading: {
                fontSize: 20,
                bold: true,
                color: this.colors.charcoal,
                fontFace: "Segoe UI Semibold"
            },
            subheading: {
                fontSize: 16,
                bold: true,
                color: this.colors.charcoal,
                fontFace: "Segoe UI Semibold"
            },
            body: {
                fontSize: 13,
                color: this.colors.slate,
                fontFace: "Segoe UI"
            },
            narrative: {
                fontSize: 14,
                color: this.colors.charcoal,
                fontFace: "Segoe UI",
                lineSpacing: 20
            },
            caption: {
                fontSize: 11,
                color: this.colors.slate,
                fontFace: "Segoe UI"
            },
            dataLarge: {
                fontSize: 32,
                color: this.colors.mckinsey_blue,
                fontFace: "Segoe UI Light"
            },
            dataSmall: {
                fontSize: 18,
                bold: true,
                color: this.colors.mckinsey_blue,
                fontFace: "Segoe UI Semibold"
            }
        };
        
        // Layout constants
        this.layout = {
            marginLeft: 0.5,
            marginRight: 0.5,
            marginTop: 0.2,
            headerHeight: 0.7,
            footerHeight: 0.3,
            contentStart: 1.0,
            contentWidth: 9.0,
            columnGap: 0.3
        };
    }
    
    // Helper methods
    addHeaderLine(slide) {
        slide.addShape(this.pres.shapes.LINE, {
            x: this.layout.marginLeft,
            y: this.layout.headerHeight,
            w: this.layout.contentWidth,
            h: 0,
            line: { color: this.colors.light_grey, width: 0.5 }
        });
    }
    
    addPageNumber(slide, number) {
        slide.addText(`${number}`, {
            x: 9.3, y: 5.3, w: 0.4, h: 0.2,
            fontSize: 9,
            color: this.colors.light_grey,
            fontFace: "Segoe UI",
            align: "right"
        });
    }
    
    addEdgeAccent(slide, isPrimary = true) {
        slide.addShape(this.pres.shapes.RECTANGLE, {
            x: 0, y: 0, w: 0.15, h: 5.625,
            fill: { color: isPrimary ? this.colors.mckinsey_blue : this.colors.accent_teal }
        });
    }
    
    // Create title slide
    createTitleSlide(title1, title2, subtitle) {
        let slide = this.pres.addSlide();
        slide.background = { color: this.colors.pure_white };
        this.addEdgeAccent(slide);
        
        // Secondary accent
        slide.addShape(this.pres.shapes.RECTANGLE, {
            x: 0.25, y: 0, w: 0.02, h: 5.625,
            fill: { color: this.colors.accent_teal }
        });
        
        // Title lines
        slide.addText(title1, {
            x: 1.2, y: 1.8, w: 7, h: 0.6,
            ...this.typography.title
        });
        
        slide.addText(title2, {
            x: 1.2, y: 2.4, w: 7, h: 0.6,
            ...this.typography.title
        });
        
        // Divider
        slide.addShape(this.pres.shapes.LINE, {
            x: 1.2, y: 3.2, w: 3, h: 0,
            line: { color: this.colors.accent_teal, width: 1.5 }
        });
        
        // Subtitle
        slide.addText(subtitle, {
            x: 1.2, y: 3.4, w: 7, h: 0.4,
            fontSize: 18,
            color: this.colors.slate,
            fontFace: "Segoe UI"
        });
        
        // Organisation name
        slide.addText(this.config.organisation.toUpperCase(), {
            x: 1.2, y: 4.3, w: 4, h: 0.3,
            fontSize: 11,
            color: this.colors.slate,
            fontFace: "Segoe UI",
            letterSpacing: 2
        });
        
        return slide;
    }
    
    // Create content slide
    createContentSlide(title) {
        let slide = this.pres.addSlide();
        slide.background = { color: this.colors.pure_white };
        this.addHeaderLine(slide);
        
        slide.addText(title, {
            x: this.layout.marginLeft,
            y: this.layout.marginTop,
            w: 8,
            h: 0.5,
            ...this.typography.sectionTitle
        });
        
        return slide;
    }
    
    // Create executive summary with metric cards
    createExecutiveSummary(title, metrics = []) {
        let slide = this.createContentSlide(title);
        
        // Add up to 3 metric cards
        const cardWidth = 2.5;
        const cardHeight = 1.5;
        const startX = 1;
        const spacing = 2.75;
        
        metrics.slice(0, 3).forEach((metric, i) => {
            const x = startX + (i * spacing);
            
            // Card background
            slide.addShape(this.pres.shapes.RECTANGLE, {
                x: x, y: 1.2, w: cardWidth, h: cardHeight,
                fill: { color: this.colors.pearl }
            });
            
            // Top accent
            slide.addShape(this.pres.shapes.RECTANGLE, {
                x: x, y: 1.2, w: cardWidth, h: 0.03,
                fill: { color: metric.highlight ? this.colors.accent_gold : this.colors.accent_teal }
            });
            
            // Value
            slide.addText(metric.value, {
                x: x, y: 1.5, w: cardWidth, h: 0.6,
                ...this.typography.dataLarge,
                align: "center"
            });
            
            // Label
            slide.addText(metric.label, {
                x: x, y: 2.1, w: cardWidth, h: 0.3,
                fontSize: 14,
                bold: true,
                color: this.colors.charcoal,
                fontFace: "Segoe UI Semibold",
                align: "center"
            });
            
            // Sublabel
            if (metric.sublabel) {
                slide.addText(metric.sublabel, {
                    x: x, y: 2.4, w: cardWidth, h: 0.3,
                    ...this.typography.caption,
                    align: "center"
                });
            }
        });
        
        return slide;
    }
    
    // Create data table
    createTableSlide(title, headers, data, options = {}) {
        let slide = this.createContentSlide(title);
        
        const defaultOptions = {
            startY: 1.2,
            headerColor: this.colors.mckinsey_blue,
            zebraStripe: true,
            fontSize: 10,
            rowHeight: 0.3
        };
        
        const opts = { ...defaultOptions, ...options };
        
        // Calculate column widths
        const tableWidth = 8.5;
        const colWidth = tableWidth / headers.length;
        
        // Header row
        slide.addShape(this.pres.shapes.RECTANGLE, {
            x: this.layout.marginLeft,
            y: opts.startY,
            w: tableWidth,
            h: opts.rowHeight,
            fill: { color: opts.headerColor }
        });
        
        headers.forEach((header, i) => {
            slide.addText(header, {
                x: this.layout.marginLeft + (i * colWidth),
                y: opts.startY + 0.05,
                w: colWidth,
                h: opts.rowHeight - 0.1,
                fontSize: opts.fontSize,
                color: this.colors.pure_white,
                fontFace: "Segoe UI Semibold",
                align: "center"
            });
        });
        
        // Data rows
        data.forEach((row, rowIndex) => {
            const rowY = opts.startY + opts.rowHeight * (rowIndex + 1);
            const bgColor = opts.zebraStripe && rowIndex % 2 === 0 ? 
                this.colors.pearl : this.colors.pure_white;
            
            slide.addShape(this.pres.shapes.RECTANGLE, {
                x: this.layout.marginLeft,
                y: rowY,
                w: tableWidth,
                h: opts.rowHeight,
                fill: { color: bgColor }
            });
            
            row.forEach((cell, cellIndex) => {
                // Handle cell objects or plain values
                const value = typeof cell === 'object' ? cell.value : cell;
                const color = typeof cell === 'object' && cell.color ? 
                    cell.color : this.colors.charcoal;
                const bold = typeof cell === 'object' && cell.bold ? true : false;
                
                slide.addText(String(value), {
                    x: this.layout.marginLeft + (cellIndex * colWidth),
                    y: rowY + 0.05,
                    w: colWidth,
                    h: opts.rowHeight - 0.1,
                    fontSize: opts.fontSize,
                    bold: bold,
                    color: color,
                    fontFace: bold ? "Segoe UI Semibold" : "Segoe UI",
                    align: "center"
                });
            });
        });
        
        return slide;
    }
    
    // Create three-box framework slide
    createFrameworkSlide(title, boxes) {
        let slide = this.createContentSlide(title);
        
        const boxWidth = 2.8;
        const boxHeight = 2.8;
        const startX = 0.5;
        const spacing = 3.1;
        
        boxes.forEach((box, i) => {
            const x = startX + (i * spacing);
            
            // Box container
            slide.addShape(this.pres.shapes.RECTANGLE, {
                x: x, y: 1.5, w: boxWidth, h: boxHeight,
                fill: { color: this.colors.pure_white },
                line: { color: this.colors.light_grey, width: 1 }
            });
            
            // Top accent
            slide.addShape(this.pres.shapes.RECTANGLE, {
                x: x, y: 1.5, w: boxWidth, h: 0.05,
                fill: { color: box.color || this.colors.mckinsey_blue }
            });
            
            // Title
            slide.addText(box.title, {
                x: x + 0.2, y: 1.7, w: boxWidth - 0.4, h: 0.4,
                fontSize: 16,
                bold: true,
                color: box.color || this.colors.mckinsey_blue,
                fontFace: "Segoe UI Semibold"
            });
            
            // Content
            slide.addText(box.content, {
                x: x + 0.2, y: 2.1, w: boxWidth - 0.4, h: 2,
                fontSize: 12,
                color: this.colors.charcoal,
                fontFace: "Segoe UI"
            });
        });
        
        return slide;
    }
    
    // Create key messages slide
    createKeyMessages(messages) {
        let slide = this.pres.addSlide();
        slide.background = { color: this.colors.mckinsey_blue };
        
        // Accent decoration
        for (let i = 0; i < 5; i++) {
            slide.addShape(this.pres.shapes.RECTANGLE, {
                x: 8.5 + (i * 0.3), y: 0, w: 0.02, h: 5.625,
                fill: { 
                    color: this.colors.accent_teal,
                    transparency: 50 - (i * 10)
                }
            });
        }
        
        slide.addText("Key Messages", {
            x: 1, y: 0.8, w: 6, h: 0.5,
            fontSize: 36,
            color: this.colors.accent_teal,
            fontFace: "Segoe UI Light"
        });
        
        messages.forEach((message, i) => {
            const y = 1.8 + (i * 0.6);
            
            // Number
            slide.addText(`${i + 1}`, {
                x: 1, y: y, w: 0.5, h: 0.5,
                fontSize: 24,
                color: this.colors.accent_gold,
                fontFace: "Segoe UI Light",
                align: "center"
            });
            
            // Message
            slide.addText(message, {
                x: 1.6, y: y + 0.05, w: 6, h: 0.4,
                fontSize: 18,
                color: this.colors.pure_white,
                fontFace: "Segoe UI"
            });
        });
        
        return slide;
    }
    
    // Create timeline slide
    createTimeline(title, phases) {
        let slide = this.createContentSlide(title);
        
        const phaseWidth = 2.2;
        const startX = 0.7;
        
        phases.forEach((phase, i) => {
            const x = startX + (i * 2.3);
            
            // Timeline dot
            slide.addShape(this.pres.shapes.OVAL, {
                x: x + 1, y: 1.3, w: 0.2, h: 0.2,
                fill: { color: phase.color || this.colors.mckinsey_blue }
            });
            
            // Connecting line
            if (i < phases.length - 1) {
                slide.addShape(this.pres.shapes.LINE, {
                    x: x + 1.2, y: 1.4, w: 2.1, h: 0,
                    line: { color: this.colors.light_grey, width: 1 }
                });
            }
            
            // Phase label
            slide.addText(phase.period, {
                x: x, y: 1, w: phaseWidth, h: 0.25,
                fontSize: 11,
                color: this.colors.slate,
                fontFace: "Segoe UI",
                align: "center"
            });
            
            // Phase title
            slide.addText(phase.title, {
                x: x, y: 1.6, w: phaseWidth, h: 0.3,
                fontSize: 11,
                bold: true,
                color: phase.color || this.colors.mckinsey_blue,
                fontFace: "Segoe UI Semibold",
                align: "center"
            });
            
            // Phase details (if provided)
            if (phase.details) {
                slide.addText(phase.details, {
                    x: x, y: 2, w: phaseWidth, h: 1,
                    fontSize: 9,
                    color: this.colors.slate,
                    fontFace: "Segoe UI",
                    align: "center",
                    valign: "top"
                });
            }
        });
        
        return slide;
    }
    
    // Save presentation
    async save(filename) {
        const path = `/mnt/user-data/outputs/${filename}`;
        await this.pres.writeFile({ fileName: path });
        return path;
    }
}

// Export for use
module.exports = McKinseyPresentation;
