import json
import os
import re
from datetime import datetime
from fpdf import FPDF

BASE_DIR = r"C:\Users\T-GAMER\fluxo de agentes"
INPUT_FILE = os.path.join(BASE_DIR, "leads_novos_maps.json")
OUTPUT_PDF = os.path.join(BASE_DIR, "leads_novos_validados.pdf")

def sanitize(text):
    """Remove non-latin1 characters"""
    if not text:
        return "N/A"
    text = str(text)
    text = re.sub(r'[\u200d\u200c\u200b\u200e\u200f\ufe0f]', '', text)
    text = text.encode('latin-1', 'replace').decode('latin-1')
    return text

class LeadPDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 14)
        self.cell(0, 10, 'Leads Validados - Google Maps', 0, 1, 'C')
        self.set_font('Helvetica', '', 9)
        self.cell(0, 6, f'Gerado em: {datetime.now().strftime("%d/%m/%Y %H:%M")}', 0, 1, 'C')
        self.ln(4)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.cell(0, 10, f'Pagina {self.page_no()}/{{nb}}', 0, 0, 'C')

    def section_title(self, title):
        self.set_font('Helvetica', 'B', 12)
        self.set_fill_color(41, 128, 185)
        self.set_text_color(255, 255, 255)
        self.cell(0, 10, sanitize(f'  {title}'), 0, 1, 'L', True)
        self.set_text_color(0, 0, 0)
        self.ln(3)

    def lead_entry(self, idx, lead):
        self.set_font('Helvetica', 'B', 10)
        self.cell(0, 7, sanitize(f'{idx}. {lead.get("nome", "N/A")}'), 0, 1)
        self.set_font('Helvetica', '', 9)
        self.set_text_color(80, 80, 80)
        self.cell(0, 5, sanitize(f'   Tel: {lead.get("telefone", "N/A")}'), 0, 1)
        self.set_text_color(37, 211, 102)
        wa = lead.get('whatsapp_link', 'N/A')
        self.cell(0, 5, sanitize(f'   WhatsApp: {wa}'), 0, 1)
        self.set_text_color(41, 128, 185)
        ml = lead.get('link_maps', 'N/A')
        self.cell(0, 5, sanitize(f'   Maps: {ml}'), 0, 1)
        self.set_text_color(100, 100, 100)
        cid = lead.get('cidade', '')
        tip = lead.get('tipo', '')
        aval = lead.get('avaliacao', '')
        self.cell(0, 5, sanitize(f'   Cidade: {cid} | Tipo: {tip} | Aval: {aval}'), 0, 1)
        self.set_text_color(0, 0, 0)
        self.ln(2)


def generate_pdf(data):
    pdf = LeadPDF()
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=20)

    pdf.add_page()
    advogados = data.get('advogados', {})
    pdf.section_title(f'ADVOGADOS ({advogados.get("entregues", 0)} leads)')
    pdf.set_font('Helvetica', '', 9)
    pdf.cell(0, 5, sanitize(f'Coletados: {advogados.get("total_coletados", 0)} | Validados: {advogados.get("total_validados", 0)}'), 0, 1)
    pdf.ln(3)
    for i, lead in enumerate(advogados.get('leads', []), 1):
        if pdf.get_y() > 260:
            pdf.add_page()
        pdf.lead_entry(i, lead)

    pdf.add_page()
    clinicas = data.get('clinicas', {})
    pdf.section_title(f'CLINICAS ({clinicas.get("entregues", 0)} leads)')
    pdf.set_font('Helvetica', '', 9)
    pdf.cell(0, 5, sanitize(f'Coletadas: {clinicas.get("total_coletados", 0)} | Validadas: {clinicas.get("total_validados", 0)}'), 0, 1)
    pdf.ln(3)
    for i, lead in enumerate(clinicas.get('leads', []), 1):
        if pdf.get_y() > 260:
            pdf.add_page()
        pdf.lead_entry(i, lead)

    pdf.output(OUTPUT_PDF)
    print(f"PDF gerado: {OUTPUT_PDF}")
    print(f"  Advogados: {advogados.get('entregues', 0)}")
    print(f"  Clinicas: {clinicas.get('entregues', 0)}")

if __name__ == '__main__':
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    generate_pdf(data)
