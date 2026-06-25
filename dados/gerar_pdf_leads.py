# -*- coding: utf-8 -*-
import json
from fpdf import FPDF
from datetime import datetime

class LeadPDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 20)
        self.set_text_color(41, 128, 185)
        self.cell(0, 15, 'Leads - Sites Feios', ln=True, align='C')
        self.set_font('Helvetica', '', 10)
        self.set_text_color(100, 100, 100)
        self.cell(0, 8, f'Gerado em: {datetime.now().strftime("%d/%m/%Y %H:%M")}', ln=True, align='C')
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Pagina {self.page_no()}/{{nb}}', align='C')

    def chapter_title(self, title):
        self.set_font('Helvetica', 'B', 14)
        self.set_fill_color(41, 128, 185)
        self.set_text_color(255, 255, 255)
        self.cell(0, 10, f'  {title}', ln=True, fill=True)
        self.ln(3)

    def lead_entry(self, lead, index):
        # Verificar se precisa de nova página
        if self.get_y() > 230:
            self.add_page()

        # Fundo cinza claro para cada lead
        self.set_fill_color(245, 245, 245)
        y_start = self.get_y()
        
        # Número e Nome
        self.set_font('Helvetica', 'B', 12)
        self.set_text_color(44, 62, 80)
        score_color = (231, 76, 60) if lead.get('score_visual', 5) <= 3 else (241, 196, 15)
        self.set_text_color(*score_color)
        self.cell(10, 8, f'{index}.')
        self.set_text_color(44, 62, 80)
        self.cell(0, 8, lead.get('nome', 'N/A'), ln=True)
        
        # Segmento e Score
        self.set_font('Helvetica', '', 10)
        self.set_text_color(100, 100, 100)
        score = lead.get('score_visual', 'N/A')
        classificacao = lead.get('classificacao', 'N/A').upper()
        self.cell(0, 6, f"Segmento: {lead.get('segmento', 'N/A').replace('_', ' ').title()} | Score: {score}/10 ({classificacao})", ln=True)
        
        # URL
        self.set_font('Helvetica', 'B', 9)
        self.set_text_color(41, 128, 185)
        url = lead.get('url', 'N/A')
        self.cell(0, 6, f"URL: {url}", ln=True)
        
        # Contato
        self.set_font('Helvetica', '', 9)
        self.set_text_color(60, 60, 60)
        telefone = lead.get('telefone', 'N/A')
        whatsapp = lead.get('whatsapp', 'N/A')
        email = lead.get('email', 'N/A')
        self.cell(0, 5, f"Tel: {telefone} | WhatsApp: {whatsapp} | Email: {email}", ln=True)
        
        # Endereço
        endereco = lead.get('endereco', 'N/A')
        cidade = lead.get('cidade', 'N/A')
        estado = lead.get('estado', 'N/A')
        self.cell(0, 5, f"Endereco: {endereco}", ln=True)
        self.cell(0, 5, f"Cidade: {cidade} - {estado}", ln=True)
        
        # Problemas
        self.set_font('Helvetica', 'B', 9)
        self.set_text_color(192, 57, 43)
        problemas = lead.get('problemas_principais', [])
        if problemas:
            self.cell(0, 6, "Problemas Principais:", ln=True)
            self.set_font('Helvetica', '', 8)
            self.set_text_color(80, 80, 80)
            for prob in problemas[:5]:  # Limitar a 5 problemas
                self.cell(10, 4, '')
                self.cell(0, 4, f"- {prob}", ln=True)
        
        # Observações
        observacoes = lead.get('observacoes', '')
        if observacoes:
            self.set_font('Helvetica', 'I', 8)
            self.set_text_color(100, 100, 100)
            self.multi_cell(0, 4, f"Obs: {observacoes}")
        
        # Linha separadora
        self.ln(3)
        self.set_draw_color(200, 200, 200)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(5)

def main():
    # Carregar leads
    with open('leads.json', 'r', encoding='utf-8') as f:
        leads = json.load(f)
    
    # Criar PDF
    pdf = LeadPDF()
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin= 15)
    
    # Página de capa
    pdf.add_page()
    pdf.set_font('Helvetica', 'B', 28)
    pdf.set_text_color(41, 128, 185)
    pdf.ln(40)
    pdf.cell(0, 15, 'RELATORIO DE LEADS', ln=True, align='C')
    pdf.set_font('Helvetica', '', 16)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 10, 'Sites Feios - Oportunidades de Redesign', ln=True, align='C')
    pdf.ln(20)
    
    # Estatísticas
    pdf.set_font('Helvetica', 'B', 12)
    pdf.set_text_color(44, 62, 80)
    total = len(leads)
    feios = sum(1 for l in leads if l.get('classificacao') == 'feio')
    ruins = sum(1 for l in leads if l.get('classificacao') == 'ruim')
    medios = sum(1 for l in leads if l.get('classificacao') == 'medio')
    
    pdf.cell(0, 8, f'Total de Leads: {total}', ln=True, align='C')
    pdf.set_text_color(231, 76, 60)
    pdf.cell(0, 8, f'Sites Feios (Score 1-2): {feios}', ln=True, align='C')
    pdf.set_text_color(241, 196, 15)
    pdf.cell(0, 8, f'Sites Ruins (Score 3-4): {ruins}', ln=True, align='C')
    pdf.set_text_color(46, 204, 113)
    pdf.cell(0, 8, f'Sites Medios (Score 5-6): {medios}', ln=True, align='C')
    
    pdf.ln(20)
    pdf.set_font('Helvetica', '', 10)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 8, 'Segmentos:', ln=True, align='C')
    segmentos = set(l.get('segmento', '').replace('_', ' ').title() for l in leads)
    pdf.cell(0, 6, ' | '.join(sorted(segmentos)), ln=True, align='C')
    
    # Lista de leads
    pdf.add_page()
    pdf.chapter_title('Lista Completa de Leads')
    
    for i, lead in enumerate(leads, 1):
        pdf.lead_entry(lead, i)
    
    # Salvar
    output_path = 'leads_sites_feios.pdf'
    pdf.output(output_path)
    print(f"PDF gerado com sucesso: {output_path}")
    print(f"Total de leads: {len(leads)}")

if __name__ == '__main__':
    main()
