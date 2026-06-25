# -*- coding: utf-8 -*-
import json
from fpdf import FPDF
from datetime import datetime

class LeadPDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 20)
        self.set_text_color(95, 111, 82)
        self.cell(0, 15, 'Leads - Empresas SEM Site', new_x="LMARGIN", new_y="NEXT", align='C')
        self.set_font('Helvetica', '', 10)
        self.set_text_color(100, 100, 100)
        self.cell(0, 8, f'Gerado em: {datetime.now().strftime("%d/%m/%Y %H:%M")}', new_x="LMARGIN", new_y="NEXT", align='C')
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Pagina {self.page_no()}/{{nb}}', align='C')

    def chapter_title(self, title):
        self.set_font('Helvetica', 'B', 14)
        self.set_fill_color(95, 111, 82)
        self.set_text_color(255, 255, 255)
        self.cell(0, 10, f'  {title}', new_x="LMARGIN", new_y="NEXT", fill=True)
        self.ln(3)

    def lead_entry(self, lead, index):
        if self.get_y() > 220:
            self.add_page()

        self.set_fill_color(245, 245, 245)
        
        # Number and Name
        self.set_font('Helvetica', 'B', 12)
        self.set_text_color(95, 111, 82)
        self.cell(10, 8, f'{index}.')
        self.set_text_color(28, 25, 23)
        self.cell(0, 8, lead.get('nome', 'N/A'), new_x="LMARGIN", new_y="NEXT")
        
        # Segment
        self.set_font('Helvetica', '', 10)
        self.set_text_color(100, 100, 100)
        segmento = lead.get('segmento', 'N/A')
        self.cell(0, 6, f"Segmento: {segmento}", new_x="LMARGIN", new_y="NEXT")
        
        # Contact
        self.set_font('Helvetica', 'B', 9)
        self.set_text_color(95, 111, 82)
        telefone = lead.get('telefone', 'N/A')
        whatsapp = lead.get('whatsapp', 'N/A')
        if whatsapp and whatsapp != 'N/A':
            self.cell(0, 6, f"Telefone: {telefone} | WhatsApp: {whatsapp}", new_x="LMARGIN", new_y="NEXT")
        else:
            self.cell(0, 6, f"Telefone: {telefone}", new_x="LMARGIN", new_y="NEXT")
        
        # Address
        self.set_font('Helvetica', '', 9)
        self.set_text_color(60, 60, 60)
        endereco = lead.get('endereco', 'N/A')
        cidade = lead.get('cidade', 'N/A')
        estado = lead.get('estado', 'N/A')
        self.cell(0, 5, f"Endereco: {endereco}", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 5, f"Cidade: {cidade} - {estado}", new_x="LMARGIN", new_y="NEXT")
        
        # CNPJ
        cnpj = lead.get('cnpj', '')
        if cnpj:
            self.cell(0, 5, f"CNPJ: {cnpj}", new_x="LMARGIN", new_y="NEXT")
        
        # Reason for needing a site
        motivo = lead.get('motivo_site', '')
        if motivo:
            self.set_font('Helvetica', 'B', 9)
            self.set_text_color(184, 125, 94)
            self.cell(0, 6, "Por que precisa de site:", new_x="LMARGIN", new_y="NEXT")
            self.set_font('Helvetica', '', 8)
            self.set_text_color(80, 80, 80)
            self.multi_cell(0, 4, f'"{motivo}"')
        
        # Separator
        self.ln(3)
        self.set_draw_color(200, 200, 200)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(5)

def main():
    with open('leads.json', 'r', encoding='utf-8') as f:
        leads = json.load(f)
    
    pdf = LeadPDF()
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Cover page
    pdf.add_page()
    pdf.set_font('Helvetica', 'B', 28)
    pdf.set_text_color(95, 111, 82)
    pdf.ln(40)
    pdf.cell(0, 15, 'RELATORIO DE LEADS', new_x="LMARGIN", new_y="NEXT", align='C')
    pdf.set_font('Helvetica', '', 16)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 10, 'Empresas SEM Site - Oportunidades de Venda', new_x="LMARGIN", new_y="NEXT", align='C')
    pdf.ln(20)
    
    # Stats
    pdf.set_font('Helvetica', 'B', 12)
    pdf.set_text_color(28, 25, 23)
    total = len(leads)
    com_whatsapp = sum(1 for l in leads if l.get('whatsapp'))
    
    pdf.cell(0, 8, f'Total de Leads: {total}', new_x="LMARGIN", new_y="NEXT", align='C')
    pdf.set_text_color(95, 111, 82)
    pdf.cell(0, 8, f'Com WhatsApp: {com_whatsapp}', new_x="LMARGIN", new_y="NEXT", align='C')
    pdf.set_text_color(184, 125, 94)
    pdf.cell(0, 8, f'Somente Telefone: {total - com_whatsapp}', new_x="LMARGIN", new_y="NEXT", align='C')
    
    pdf.ln(20)
    pdf.set_font('Helvetica', '', 10)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 8, 'Segmentos:', new_x="LMARGIN", new_y="NEXT", align='C')
    segmentos = set(l.get('segmento', '') for l in leads)
    pdf.cell(0, 6, ' | '.join(sorted(segmentos)), new_x="LMARGIN", new_y="NEXT", align='C')
    
    # Lead list
    pdf.add_page()
    pdf.chapter_title('Lista Completa de Leads')
    
    for i, lead in enumerate(leads, 1):
        pdf.lead_entry(lead, i)
    
    # Save
    output_path = 'leads_sem_site.pdf'
    pdf.output(output_path)
    print(f"PDF gerado com sucesso: {output_path}")
    print(f"Total de leads: {len(leads)}")

if __name__ == '__main__':
    main()
