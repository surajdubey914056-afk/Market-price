"""
Generates the exact VBSPU Mini Project Microsoft Word (.docx) report for:
Suraj Kumar Dubey (24001304056) & Shubham Gupta (24001304053)
Department of Information Technology, UNSIET, VBSPU, Jaunpur
"""
import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_margins(cell, top=60, bottom=60, left=80, right=80):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def build_docx():
    doc = Document()
    docx_path = os.path.join(os.path.dirname(__file__), "Market_Price_Prediction_UNSIET_VBSPU_Report.docx")
    logo_path = os.path.join(os.path.dirname(__file__), "images", "vbspu_logo.png")

    for s in doc.sections:
        s.top_margin = Inches(0.75)
        s.bottom_margin = Inches(0.75)
        s.left_margin = Inches(0.75)
        s.right_margin = Inches(0.75)

    # Style
    style_normal = doc.styles['Normal']
    style_normal.font.name = 'Times New Roman'
    style_normal.font.size = Pt(10)
    style_normal.paragraph_format.line_spacing = 1.2
    style_normal.paragraph_format.space_after = Pt(4)

    def add_header_footer(section, title_text="Market Price Prediction"):
        header = section.header
        p_hdr = header.paragraphs[0]
        p_hdr.text = title_text
        p_hdr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p_hdr.runs[0].font.name = 'Times New Roman'
        p_hdr.runs[0].font.size = Pt(9)
        p_hdr.runs[0].font.italic = True

        footer = section.footer
        p_ftr = footer.paragraphs[0]
        p_ftr.text = "IT, UNSIET, VBSPU, Jaunpur"
        p_ftr.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p_ftr.runs[0].font.name = 'Times New Roman'
        p_ftr.runs[0].font.size = Pt(9)

    add_header_footer(doc.sections[0])

    # PAGE 1: COVER
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(12)
    r = p.add_run("MINI PROJECT REPORT\nON\n\nMARKET PRICE PREDICTION FOR AGRICULTURAL PRODUCTS USING DEEP LEARNING AND ML\n\n")
    r.bold = True
    r.font.size = Pt(13)

    r_sub = p.add_run("Submitted in Partial Fulfillment for the Award of\nBACHELORS OF TECHNOLOGY\nIn\nINFORMATION TECHNOLOGY\n(BATCH: 2024-2028)\n\nBy\n")
    r_sub.font.size = Pt(10.5)

    r_au = p.add_run("Suraj Kumar Dubey (24001304056)\nShubham Gupta (24001304053)\n\n")
    r_au.bold = True
    r_au.font.size = Pt(11)

    r_gui = p.add_run("Under the Guidance of:-\nDr. Santosh Kumar Yadav\n(Assistant Professor, IT)\n\n")
    r_gui.font.size = Pt(10.5)

    if os.path.exists(logo_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.add_run().add_picture(logo_path, width=Inches(1.5))

    p_dep = doc.add_paragraph()
    p_dep.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_d = p_dep.add_run("DEPARTMENT OF INFORMATION TECHNOLOGY\nFACULTY OF ENGINEERING AND TECHNOLOGY\nUma Nath Singh of Engineering and Technology\nVEER BAHADUR SINGH\nPURVANCHAL UNIVERSITY, JAUNPUR(U.P)\n")
    r_d.bold = True
    r_d.font.size = Pt(10.5)

    # PAGE 2: DECLARATION
    doc.add_page_break()
    if os.path.exists(logo_path):
        p_img2 = doc.add_paragraph()
        p_img2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img2.add_run().add_picture(logo_path, width=Inches(1.1))

    p_d2 = doc.add_paragraph()
    p_d2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_d2 = p_d2.add_run("DEPARTMENT OF INFORMATION TECHNOLOGY\nFACULTY OF ENGINEERING AND TECHNOLOGY\n(Uma Nath Singh Institute of Engineering and Technology)\nVEER BAHADUR SINGH PURVANCHAL UNIVERSITY,\nJAUNPUR (U.P)\n\nDECLARATION\n")
    r_d2.bold = True
    r_d2.font.size = Pt(10.5)

    p_dtext = doc.add_paragraph()
    p_dtext.paragraph_format.space_before = Pt(12)
    p_dtext.paragraph_format.line_spacing = 1.3
    p_dtext.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_dtext.add_run("We hereby declare that the mini project report entitled “Market Price Prediction for Agricultural Products Using Deep Learning and Machine Learning” is a record of the original work carried out by us during the fifth semester of the Bachelor of Technology programme in Information Technology at Veer Bahadur Singh Purvanchal University, Jaunpur (U.P.), under the guidance of [Dr. Santosh Kumar Yadav].\n\nI submit this report in partial fulfillment of the requirements for the award of the degree of Bachelor of Technology in Information Technology. This is the first submission of this work for the award of a degree or diploma. All sources used in preparing the report have been acknowledged in the References section.\n\n\n\n")

    t_s = doc.add_table(rows=1, cols=2)
    t_s.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_s.rows[0].cells[0].paragraphs[0].add_run("Suraj Kumar Dubey\nUnv. Roll No. 24001304056").bold = True
    p_r = t_s.rows[0].cells[1].paragraphs[0]
    p_r.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_r.add_run("Shubham Gupta\nUnv. Roll No. 24001304053").bold = True

    # PAGE 3: TABLE OF CONTENTS
    doc.add_page_break()
    p_toc = doc.add_paragraph()
    p_toc.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_t = p_toc.add_run("TABLE OF CONTENTS\n")
    r_t.bold = True
    r_t.font.size = Pt(14)

    toc_items = [
        ("Declaration", "2"),
        ("Table of Contents", "3"),
        ("Chapter 1: Introduction", "4"),
        ("    1.1 Introduction and Background", "4"),
        ("    1.2 Objective and Need", "5"),
        ("    1.3 Feasibility Study", "5"),
        ("Chapter 2: Problem Definition", "6"),
        ("    2.1 Problem Definition and Formulation", "6"),
        ("    2.2 Aim and Objectives", "6"),
        ("    2.3 Scope of the Mini Project", "7"),
        ("Chapter 3: Proposed Design Methodology", "8"),
        ("    3.1 Proposed Solution and Block Diagram", "8"),
        ("    3.2 System Flowchart", "8"),
        ("    3.3 Working Principle", "9"),
        ("Chapter 4: Hardware and Software Requirements and Specifications", "10"),
        ("    4.1 Hardware Requirements and Component Specifications", "10"),
        ("    4.2 Software Requirements", "11"),
        ("Chapter 5: Mini Project Implementation", "12"),
        ("    5.1 System Architecture and Data Pipeline", "12"),
        ("    5.2 Database Assembly and Component Connections", "12"),
        ("    5.3 Agricultural Data Preprocessing & Seasonal Harmonics", "13"),
        ("    5.4 Prediction Logic and Source Code and Output", "14"),
        ("Chapter 6: Result and Discussion", "17"),
        ("    6.1 Prototype Setup and Observations", "17"),
        ("    6.2 Model Predictions and Evaluation Response", "17"),
        ("    6.4 Limitations and Challenges", "18"),
        ("    6.5 Conclusion and Future Work", "19"),
        ("Chapter 7: Applications of the Proposed Mini Project", "20"),
        ("    7.1 Merits and Advantages", "20"),
        ("    7.2 Applications in Mandis, Farms, and Small Agritech", "20"),
        ("    7.3 Potential for Smart Agro-Supply Chain & Arbitrage", "21"),
        ("References", "22"),
        ("    Appendix-A (List of Figures Used)", "22"),
        ("    Appendix-B (List of Tables Used)", "22")
    ]
    t_toc = doc.add_table(rows=len(toc_items) + 1, cols=2)
    t_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_toc.rows[0].cells[0].paragraphs[0].add_run("").bold = True
    t_toc.rows[0].cells[1].paragraphs[0].add_run("Page No.").bold = True
    t_toc.rows[0].cells[1].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT

    for i, (title, page) in enumerate(toc_items):
        r1 = t_toc.rows[i+1].cells[0].paragraphs[0].add_run(title)
        r2 = t_toc.rows[i+1].cells[1].paragraphs[0].add_run(page)
        t_toc.rows[i+1].cells[1].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT
        if title.startswith("Chapter") or title in ["Declaration", "Table of Contents", "References"]:
            r1.bold = True
            r2.bold = True

    # PAGE 4: CHAPTER 1
    doc.add_page_break()
    p_c1 = doc.add_paragraph()
    p_c1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_c1.add_run("CHAPTER - 1\nINTRODUCTION\n").bold = True
    p_c1.runs[0].font.size = Pt(13)

    p_11 = doc.add_paragraph()
    p_11.add_run("1.1 Introduction and Background\n").bold = True
    doc.add_paragraph("Agricultural wholesale prices fluctuate sharply across seasons, weather conditions, and regional market yards (APMC mandis). In traditional agricultural trade, farmers sell their produce at spot prices during harvest time without knowing future market trajectories. The market may experience bumper arrivals causing prices to collapse, or supply shortages causing sudden price spikes. Weather anomalies, transport logistics, storage availability, and rainfall patterns all influence how quickly crop market rates change.")
    doc.add_paragraph("The Market Price Prediction for Agricultural Products is an intelligent full-stack system that forecasts future commodity prices using deep learning, historical mandi records, and seasonal trends. A Bi-directional Long Short-Term Memory (Bi-LSTM) neural network and Random Forest ensemble analyze multi-year APMC mandi data across 16 major crops (such as Tomato, Onion, Potato, Wheat, Rice, and Cotton). When market variables change, the controller models price trajectories and provides farmers with actionable forward-looking intelligence.")
    doc.add_paragraph("Agricultural commodities move from rural farmlands to wholesale mandis and urban terminal markets through logistics corridors. Some produce is sold immediately at distress rates, some is held in cold storage, and a significant portion is lost to post-harvest shrinkage. A low-price spot market can coexist with high-price demand centers in neighboring states. The proposed platform bridges this geographical and predictive gap by placing real-time intelligence into the hands of farmers and traders.")

    # PAGE 5
    doc.add_page_break()
    p_12 = doc.add_paragraph()
    p_12.add_run("1.2 Objective and Need\n").bold = True
    doc.add_paragraph("The objective is to design a software system that forecasts commodity wholesale prices automatically, assists harvesting schedules, and computes interstate transport arbitrage. The controller must respond to seasonal cycles, account for monsoon shocks, and compute 95% expanding confidence bounds. The user can observe real-time predictions, accuracy metrics, and advisory verdicts through an interactive web portal.")
    doc.add_paragraph("This project demonstrates the connection between deep learning time-series models, agricultural economics, and practical trade decisions. It is intended to reduce distress selling by alerting farmers when holding produce in cold storage yields a higher net return than immediate liquidation. The amount of profit preserved depends on setup, storage rental costs, and actual market dynamics.")
    doc.add_paragraph("The intended user should be able to see three distinct states during operation: spot market distress risk, optimal harvest window with IoT telemetry, and profitable interstate arbitrage opportunities. Displaying both the predicted price and the statistical confidence band makes the risk visible.")

    p_13 = doc.add_paragraph()
    p_13.add_run("\n1.3 Feasibility Study\n").bold = True
    doc.add_paragraph("Technical feasibility. The system uses Python FastAPI for high-speed REST endpoints, Scikit-Learn and PyTorch/Bi-LSTM for neural forecasting, and a React 18 / Bootstrap 5 frontend. The design runs locally on standard laptops and serverlessly on cloud infrastructure (Vercel) without expensive GPU requirements.")
    doc.add_paragraph("Economic feasibility. The software leverages open-source libraries and public Agmarknet government agricultural data. The primary costs are hosting and development, keeping component count and maintenance overhead at zero.")
    doc.add_paragraph("Operational feasibility. The platform features an intuitive, sticky enterprise navigation bar, responsive sliders, real crop imagery, and 1-click CSV downloads. Routine operation requires only selecting a crop, state, and horizon.")

    # PAGE 6
    doc.add_page_break()
    p_c2 = doc.add_paragraph()
    p_c2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_c2.add_run("CHAPTER - 2\nPROBLEM DEFINITION\n").bold = True
    p_c2.runs[0].font.size = Pt(13)

    p_21 = doc.add_paragraph()
    p_21.add_run("2.1 Problem Definition and Formulation\n").bold = True
    doc.add_paragraph("The problem is to determine future wholesale mandi prices and recommend whether a farmer should sell on the spot market, hold produce in cold storage, or transport produce to another state. A static pricing board has no forward predictive capability. The proposed system adds that predictive feedback by evaluating multi-dimensional temporal inputs against trained neural ensemble weights.")
    doc.add_paragraph("The input is historical time-series auction data, daily arrivals, rainfall status, and diesel freight indices. Processing consists of seasonal harmonic encoding, Bi-LSTM sequential modeling, 95% confidence interval scaling, and net transport margin optimization. The output is a daily forecasted price trajectory, confidence intervals, and actionable strategic advisories.")
    doc.add_paragraph("The problem can be stated in terms of current spot rates, projected prices, and logistical friction. A low spot price with high future projection indicates holding produce. A large interstate price gap exceeding freight transit costs indicates profitable transport. The decision depends on both forecasted trajectories and real transport costs.")

    p_22 = doc.add_paragraph()
    p_22.add_run("\n2.2 Aim and Objectives\n").bold = True
    doc.add_paragraph("Aim. To develop an intelligent web-based agricultural price forecasting and market advisory platform.")
    doc.add_paragraph("• Collect and preprocess 6,840+ verified APMC mandi records across 16 commodities and 12 states.\n"
                      "• Implement a Bi-directional LSTM and Random Forest ensemble model achieving over 90% forecast accuracy.\n"
                      "• Integrate real-time soil moisture and crop maturity sensor telemetry for optimal harvest timing.\n"
                      "• Build an interstate transport arbitrage calculator to identify profitable interstate trade corridors.\n"
                      "• Deploy a responsive React web interface with real-time tickers, interactive Chart.js graphs, and SQLite database logging.")

    # PAGE 7
    doc.add_page_break()
    p_23 = doc.add_paragraph()
    p_23.add_run("2.3 Scope of the Mini Project\n").bold = True
    doc.add_paragraph("The project covers 16 major agricultural commodities (Tomato, Onion, Potato, Wheat, Paddy, Chickpea, Cotton, Soybean, Garlic, Chilli, etc.) across 60+ APMC mandis in 12 major states. It includes local server execution, cloud serverless deployment on Vercel, automated SQLite logging, and farmer threshold price alerts.")
    doc.add_paragraph("The model forecasts wholesale auction prices in INR per quintal (₹/Qtl) for horizons of 7, 15, 30, 60, and 90 days. High-frequency intra-day stock market trading and retail departmental pricing are outside the scope of this agricultural mandi benchmark prototype.")
    doc.add_paragraph("The project boundary starts at historical mandi arrivals and ends where the web platform presents actionable trade decisions to farmers and traders. The calibration applies to verified APMC benchmark transactions across India. Typical forecasting trials maintain consistent historical lag windows and seasonal harmonic parameters to ensure reliable predictions across consecutive harvest cycles.")
    doc.add_paragraph("The design assumes web browser access on standard client devices. It incorporates expanding 95% Gaussian confidence intervals to represent statistical uncertainty over longer time horizons. Capturing long-range macroeconomic trade embargoes or sudden currency devaluations would require external global economic data feeds.")

    # Save document
    doc.save(docx_path)
    print(f"Successfully generated Word document: {docx_path}")

if __name__ == "__main__":
    build_docx()
