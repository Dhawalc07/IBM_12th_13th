"""
Script: generate_pdf.py
Purpose: Converts PROJECT_DOCUMENTATION.md into a high-quality, professional PDF document.
Uses: ReportLab 5.0.1
Output: RuralHealth_OS_Project_Documentation.pdf
"""

import os
import re
import html
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable, Preformatted
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

# Define custom Canvas for dynamic "Page X of Y" and running headers
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super().showPage()
        super().save()

    def draw_header_footer(self, page_count):
        # Skip header and footer on the cover / title page
        if self._pageNumber == 1:
            return

        self.saveState()
        
        # Header
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#475569"))
        self.drawString(44, 11 * 72 - 34, "RuralHealth OS: Climate-Triangulated Surveillance & Resource Allocation")
        self.drawRightString(8.5 * 72 - 44, 11 * 72 - 34, "PROJECT MANUAL & SPECIFICATION")
        
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(44, 11 * 72 - 38, 8.5 * 72 - 44, 11 * 72 - 38)

        # Footer
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(44, 30, "CONFIDENTIAL — DISTRICT HEALTH SURVEILLANCE & EPIDEMIOLOGICAL FORESIGHT")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(8.5 * 72 - 44, 30, page_str)
        
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(44, 40, 8.5 * 72 - 44, 40)

        self.restoreState()


def clean_latex(text: str) -> str:
    """Simplifies LaTeX formulas into clean, readable text representation for ReportLab."""
    t = text
    t = t.replace(r"\mathbf{", "").replace(r"\text{", "")
    t = t.replace(r"\pm", "±").replace(r"^{\circ}", "°").replace(r"^\circ", "°")
    t = t.replace(r"\le", "≤").replace(r"\ge", "≥")
    t = t.replace(r"\%", "%")
    t = re.sub(r"\$([^\$]+)\$", r"\1", t)
    t = t.replace(r"\text", "")
    t = t.replace("{", "").replace("}", "")
    return t


def sanitize_code_text(text: str) -> str:
    """Converts Unicode tree and box-drawing symbols into clean ASCII for Type 1 fonts."""
    t = text
    t = t.replace("├──", "|--")
    t = t.replace("└──", "\\--")
    t = t.replace("│", "|")
    t = t.replace("──", "--")
    t = t.replace("•", "-")
    return t


def format_inline_markdown(raw_text: str) -> str:
    """Converts inline markdown formatting (**bold**, *italic*, `code`, [link]) to ReportLab XML tags."""
    # 1. Clean LaTeX formulas
    cleaned = clean_latex(raw_text)

    # 2. Escape HTML entities WITHOUT quote escaping so quotes render naturally
    escaped = html.escape(cleaned, quote=False)

    # 3. Convert bold: **text** -> <b>text</b>
    escaped = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", escaped)

    # 4. Convert italic: *text* or _text_ -> <i>text</i>
    escaped = re.sub(r"(?<!\*)\*([^\*]+?)\*(?!\*)", r"<i>\1</i>", escaped)

    # 5. Convert inline code: `code` -> font Courier
    escaped = re.sub(
        r"`([^`]+?)`",
        r'<font face="Courier" color="#0369A1"><b>\1</b></font>',
        escaped
    )

    # 6. Convert markdown links: [text](url) -> <u>text</u>
    escaped = re.sub(
        r"\[([^\]]+)\]\(([^\)]+)\)",
        r'<font color="#2563EB"><u>\1</u></font>',
        escaped
    )

    # Clean up any leftover symbols
    escaped = escaped.replace("🧠", "[AI Foresight]")
    escaped = escaped.replace("⚡", "[Vitals]")
    escaped = escaped.replace("🤖", "[Predict]")

    return escaped


def build_pdf(markdown_path: str, output_pdf_path: str):
    print(f"Reading markdown file: {markdown_path}...")
    with open(markdown_path, "r", encoding="utf-8") as f:
        md_text = f.read()

    lines = md_text.splitlines()

    # Document setup: Letter with 44pt margins (usable width = 524 pt)
    page_width, page_height = letter
    doc = SimpleDocTemplate(
        output_pdf_path,
        pagesize=letter,
        leftMargin=44,
        rightMargin=44,
        topMargin=46,
        bottomMargin=46
    )
    usable_width = page_width - doc.leftMargin - doc.rightMargin  # 524 pt

    # Base Styles
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "CoverTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=28,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=8
    )

    subtitle_style = ParagraphStyle(
        "CoverSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=11.5,
        leading=15.5,
        textColor=colors.HexColor("#0F766E"),
        spaceAfter=14
    )

    meta_label = ParagraphStyle(
        "MetaLabel",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#475569")
    )
    
    meta_val = ParagraphStyle(
        "MetaVal",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0F172A")
    )

    h1_style = ParagraphStyle(
        "SectionH1",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=16.5,
        textColor=colors.HexColor("#0F172A"),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        "SubSectionH2",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor("#1E3A8A"),
        spaceBefore=11,
        spaceAfter=5,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        "SubSubH3",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#0F766E"),
        spaceBefore=8,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        "BodyTextCustom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.8,
        leading=12.6,
        textColor=colors.HexColor("#1E293B"),
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        "BulletCustom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#1E293B"),
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=3
    )

    code_block_style = ParagraphStyle(
        "CodeText",
        parent=styles["Normal"],
        fontName="Courier",
        fontSize=6.8,
        leading=8.6,
        textColor=colors.HexColor("#0F172A")
    )

    th_style = ParagraphStyle(
        "TableHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#FFFFFF")
    )

    td_style = ParagraphStyle(
        "TableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#1E293B")
    )

    story = []

    # =========================================================================
    # COVER PAGE / TITLE BLOCK
    # =========================================================================
    story.append(Spacer(1, 15))
    
    # Top Tag badge
    top_badge_data = [[
        Paragraph("<font color='#0F766E'><b>OFFICIAL SYSTEM SPECIFICATION &amp; EXECUTION MANUAL</b></font>", td_style),
        Paragraph("<font color='#64748B'><b>RELEASE v2.0-STABLE</b></font>", ParagraphStyle("RightBadge", parent=td_style, alignment=2))
    ]]
    top_badge_table = Table(top_badge_data, colWidths=[360, 164])
    top_badge_table.setStyle(TableStyle([
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('LINEBELOW', (0, 0), (-1, -1), 1.5, colors.HexColor("#0D9488")),
    ]))
    story.append(top_badge_table)
    story.append(Spacer(1, 16))

    # Main Titles
    story.append(Paragraph("RuralHealth OS", title_style))
    story.append(Paragraph("Climate-Triangulated Rural Health Surveillance, Outbreak Foresight &amp; Dynamic Resource Allocation System", subtitle_style))
    story.append(Spacer(1, 6))

    # Executive Overview Box
    desc_p = Paragraph(
        "A comprehensive production documentation and execution guide for district epidemiological surveillance, "
        "2-week machine learning disease forecasting (Malaria &amp; Diarrhea), real-time GIS spatial tracking across 50 rural villages, "
        "and end-to-end hospital operations management.",
        body_style
    )
    desc_table = Table([[desc_p]], colWidths=[usable_width])
    desc_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F1F5F9")),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 9),
        ('LINELEFT', (0, 0), (-1, -1), 3.5, colors.HexColor("#0D9488")),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
    ]))
    story.append(desc_table)
    story.append(Spacer(1, 14))

    # System Metadata Matrix
    meta_data = [
        [
            Paragraph("System Architecture", meta_label),
            Paragraph("Modular Monolith (FastAPI + Scikit-Learn + Leaflet.js SPA)", meta_val),
            Paragraph("Coverage Scope", meta_label),
            Paragraph("50 Villages, 5 Blocks, 145,045 Rural Population", meta_val),
        ],
        [
            Paragraph("Predictive Horizon", meta_label),
            Paragraph("14-Day Advance Early Warning (Malaria &amp; Diarrhea)", meta_val),
            Paragraph("Surveillance Data", meta_label),
            Paragraph("5,200 Longitudinal Climate-Health Records (104 Weeks)", meta_val),
        ],
        [
            Paragraph("Backend Framework", meta_label),
            Paragraph("FastAPI 0.115, SQLAlchemy 2.0, Pydantic v2", meta_val),
            Paragraph("ML Accuracy", meta_label),
            Paragraph("85.5% Outbreak Classification, 0.75 R² Malaria Regressor", meta_val),
        ],
        [
            Paragraph("Primary Database", meta_label),
            Paragraph("SQLite 3 (Development) / PostgreSQL (Production)", meta_val),
            Paragraph("Documentation Date", meta_label),
            Paragraph("September 2026 (Production Release v2.0)", meta_val),
        ],
    ]
    meta_table = Table(meta_data, colWidths=[110, 160, 100, 154])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 16))

    # Document Index / Table of Contents Preview
    story.append(Paragraph("<b>DOCUMENT SECTION INDEX</b>", h2_style))
    toc_data = [
        [
            Paragraph("<b>1. Executive Summary &amp; Vision</b><br/>"
                      "<font color='#64748B'>Clinical foresight, early warning &amp; value proposition</font>", td_style),
            Paragraph("<b>7. Setup &amp; Execution Guide</b><br/>"
                      "<font color='#64748B'>Step-by-step installation, virtualenv &amp; startup</font>", td_style),
        ],
        [
            Paragraph("<b>2. System Architecture</b><br/>"
                      "<font color='#64748B'>Presentation, API routing, ML engine &amp; ORM layer</font>", td_style),
            Paragraph("<b>8. Frontend User Guide</b><br/>"
                      "<font color='#64748B'>GIS map, simulator, triage assist &amp; equipment dispatch</font>", td_style),
        ],
        [
            Paragraph("<b>3. Project Structure</b><br/>"
                      "<font color='#64748B'>Complete repository organization &amp; component breakdown</font>", td_style),
            Paragraph("<b>9. Production &amp; Deployment</b><br/>"
                      "<font color='#64748B'>Environment variables, security &amp; Gunicorn setup</font>", td_style),
        ],
        [
            Paragraph("<b>4. Dataset &amp; Features Specification</b><br/>"
                      "<font color='#64748B'>Spatial infrastructure, meteorology &amp; forecast targets</font>", td_style),
            Paragraph("<b>10. Troubleshooting &amp; FAQs</b><br/>"
                      "<font color='#64748B'>Offline fallback, custom retraining &amp; HMIS gap filling</font>", td_style),
        ],
        [
            Paragraph("<b>5. Machine Learning Pipeline</b><br/>"
                      "<font color='#64748B'>Multi-task Random Forest ensemble &amp; feature importance</font>", td_style),
            Paragraph("<b>11. Verification &amp; Test Suite</b><br/>"
                      "<font color='#64748B'>Automated validation tests across core endpoints</font>", td_style),
        ],
        [
            Paragraph("<b>6. Complete API Reference</b><br/>"
                      "<font color='#64748B'>Surveillance telemetry, ML inference &amp; hospital CRUD</font>", td_style),
            Paragraph("<b>Appendix: Operational Reference</b><br/>"
                      "<font color='#64748B'>Data dictionary &amp; subcentre inventory matrices</font>", td_style),
        ]
    ]
    toc_table = Table(toc_data, colWidths=[260, 264])
    toc_table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#FFFFFF")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(toc_table)

    story.append(PageBreak())

    # =========================================================================
    # PARSE DOCUMENT BODY
    # =========================================================================
    i = 0
    while i < len(lines):
        if lines[i].startswith("## 1."):
            break
        i += 1

    in_code_block = False
    code_lang = ""
    code_lines = []

    in_table = False
    table_lines = []

    def flush_code_block():
        nonlocal code_lines, code_lang
        if not code_lines:
            return
        
        raw_code = "\n".join(code_lines)
        code_lines = []

        sanitized = sanitize_code_text(raw_code)

        max_line_len = max(len(l) for l in sanitized.splitlines()) if sanitized else 0
        font_size = 6.2 if max_line_len > 72 else 6.8
        leading = font_size * 1.25

        c_style = ParagraphStyle(
            f"CodeCustom_{font_size}",
            parent=code_block_style,
            fontSize=font_size,
            leading=leading
        )

        escaped_code = html.escape(sanitized, quote=False)
        pre = Preformatted(escaped_code, c_style)
        
        code_wrapper = Table([[pre]], colWidths=[usable_width])
        code_wrapper.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ('LEFTPADDING', (0, 0), (-1, -1), 7),
            ('RIGHTPADDING', (0, 0), (-1, -1), 7),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ]))
        story.append(Spacer(1, 4))
        story.append(code_wrapper)
        story.append(Spacer(1, 6))

    def flush_table():
        nonlocal table_lines
        if not table_lines:
            return
        
        raw_rows = []
        for tl in table_lines:
            s = tl.strip()
            if s.startswith("|"):
                s = s[1:]
            if s.endswith("|"):
                s = s[:-1]
            cells = [c.strip() for c in s.split("|")]
            raw_rows.append(cells)
        table_lines = []

        if len(raw_rows) < 2:
            return

        header_cells = raw_rows[0]
        data_rows = raw_rows[2:] if len(raw_rows) > 1 and all(set(c).issubset({'-', ':', ' '}) for c in raw_rows[1]) else raw_rows[1:]

        num_cols = len(header_cells)
        if num_cols == 4:
            col_widths = [115, 150, 115, 144]
        elif num_cols == 3:
            col_widths = [65, 175, 284]
        else:
            col_widths = [usable_width / num_cols] * num_cols

        formatted_table_data = []
        hdr_row = [Paragraph(format_inline_markdown(c), th_style) for c in header_cells]
        formatted_table_data.append(hdr_row)

        for row in data_rows:
            padded = row + [""] * (num_cols - len(row))
            data_cells = [Paragraph(format_inline_markdown(padded[idx]), td_style) for idx in range(num_cols)]
            formatted_table_data.append(data_cells)

        tbl = Table(formatted_table_data, colWidths=col_widths)
        t_style = [
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1E293B")),
            ('TOPPADDING', (0, 0), (-1, 0), 5),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 5),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 1), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 4),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]
        for r_idx in range(1, len(formatted_table_data)):
            bg = colors.HexColor("#F8FAFC") if r_idx % 2 == 1 else colors.HexColor("#FFFFFF")
            t_style.append(('BACKGROUND', (0, r_idx), (-1, r_idx), bg))

        tbl.setStyle(TableStyle(t_style))
        story.append(Spacer(1, 4))
        story.append(tbl)
        story.append(Spacer(1, 6))

    # Explicit page breaks to guarantee immaculate layout hierarchy
    page_break_sections = {
        "## 3. Project Structure",
        "## 6. Complete API Reference",
        "### 3. Patient & Resource Management Endpoints",
        "## 7. Step-by-Step Setup & Execution Guide",
        "## 8. Frontend User Guide & Operational Workflows",
        "## 9. Production Configuration & Deployment",
        "## 10. Troubleshooting & FAQs"
    }

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Check code fence
        if stripped.startswith("```"):
            if in_code_block:
                in_code_block = False
                flush_code_block()
            else:
                if in_table:
                    in_table = False
                    flush_table()
                in_code_block = True
                code_lang = stripped[3:].strip()
                code_lines = []
            i += 1
            continue

        if in_code_block:
            code_lines.append(line)
            i += 1
            continue

        # Check table
        if stripped.startswith("|") and "|" in stripped[1:]:
            if not in_table:
                in_table = True
                table_lines = []
            table_lines.append(stripped)
            i += 1
            continue
        elif in_table:
            in_table = False
            flush_table()

        # Blank line
        if not stripped:
            i += 1
            continue

        # Horizontal Rule
        if stripped in ["---", "***", "___"]:
            story.append(Spacer(1, 4))
            story.append(HRFlowable(width="100%", thickness=0.75, color=colors.HexColor("#E2E8F0"), spaceBefore=4, spaceAfter=6))
            i += 1
            continue

        # Page break check
        if stripped in page_break_sections:
            story.append(PageBreak())

        # Headings
        if stripped.startswith("## "):
            heading_text = format_inline_markdown(stripped[3:])
            story.append(Spacer(1, 6))
            story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0D9488"), spaceBefore=6, spaceAfter=4))
            story.append(Paragraph(heading_text, h1_style))
            i += 1
            continue

        if stripped.startswith("### "):
            heading_text = format_inline_markdown(stripped[4:])
            story.append(Paragraph(heading_text, h2_style))
            i += 1
            continue

        if stripped.startswith("#### "):
            heading_text = format_inline_markdown(stripped[5:])
            story.append(Paragraph(heading_text, h3_style))
            i += 1
            continue

        # Unordered list
        if stripped.startswith("- ") or stripped.startswith("* "):
            item_text = format_inline_markdown(stripped[2:])
            bullet_p = Paragraph(f"&bull;&nbsp;&nbsp;{item_text}", bullet_style)
            story.append(bullet_p)
            i += 1
            continue

        # Ordered list
        m_ord = re.match(r"^(\d+)\.\s+(.*)", stripped)
        if m_ord:
            num = m_ord.group(1)
            item_text = format_inline_markdown(m_ord.group(2))
            ord_p = Paragraph(f"<b>{num}.</b>&nbsp;&nbsp;{item_text}", bullet_style)
            story.append(ord_p)
            i += 1
            continue

        # Regular paragraph
        p_text = format_inline_markdown(stripped)
        story.append(Paragraph(p_text, body_style))
        i += 1

    if in_code_block:
        flush_code_block()
    if in_table:
        flush_table()

    print("Building PDF with ReportLab NumberedCanvas...")
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF Successfully Generated: {output_pdf_path}")
    print(f"File Size: {os.path.getsize(output_pdf_path)} bytes")


if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    workspace_root = os.path.dirname(current_dir) if os.path.basename(current_dir) == "backend" else current_dir
    md_file = os.path.join(workspace_root, "PROJECT_DOCUMENTATION.md")
    out_pdf = os.path.join(workspace_root, "RuralHealth_OS_Project_Documentation.pdf")
    
    build_pdf(md_file, out_pdf)
