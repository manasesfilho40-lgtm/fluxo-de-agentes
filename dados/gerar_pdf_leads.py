# -*- coding: utf-8 -*-
import json
from fpdf import FPDF
from datetime import datetime

class LeadPDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 20)
        self.set_text_color(31, 78, 61)
        self.cell(0, 15, 'LEADS SEM SITE', 0, 1, 'C')
        self.set_font('Helvetica', '', 12)
        self.set_text_color(100, 100, 100)
        self.cell(0, 8, 'ODONTOLOGIA & PET SHOP', 0, 1, 'C')
        self.set_font('Helvetica', '', 9)
        self.cell(0, 6, 'Gerado em: ' + datetime.now().strftime("%d/%m/%Y %H:%M"), 0, 1, 'C')
        self.ln(5)
    
    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, 'Pagina ' + str(self.page_no()) + '/{nb}', 0, 0, 'C')
    
    def chapter_title(self, title, color):
        self.set_font('Helvetica', 'B', 14)
        self.set_fill_color(color[0], color[1], color[2])
        self.set_text_color(255, 255, 255)
        self.cell(0, 10, '  ' + title, 0, 1, 'L', fill=True)
        self.ln(3)
    
    def lead_entry(self, lead, index, fill_color=False):
        if self.get_y() > 250:
            self.add_page()
        
        if fill_color:
            self.set_fill_color(245, 245, 245)
        else:
            self.set_fill_color(255, 255, 255)
        
        self.set_font('Helvetica', 'B', 11)
        self.set_text_color(31, 78, 61)
        self.cell(10, 7, str(index) + '.')
        self.cell(0, 7, lead.get('nome', 'N/A'), 0, 1, 'L')
        
        self.set_font('Helvetica', '', 9)
        self.set_text_color(100, 100, 100)
        segmento = "Odontologia" if lead.get('segmento') == 'odontologia' else "Pet Shop"
        cidade = lead.get('cidade', 'N/A')
        estado = lead.get('estado', 'N/A')
        self.cell(0, 5, '   ' + segmento + ' | ' + cidade + ' - ' + estado, 0, 1, 'L')
        
        whatsapp = lead.get('whatsapp', 'N/A')
        telefone = lead.get('telefone', 'N/A')
        
        if whatsapp:
            whatsapp_link = 'https://wa.me/' + whatsapp
            self.set_font('Helvetica', 'B', 9)
            self.set_text_color(31, 78, 61)
            self.cell(0, 5, '   WhatsApp: ' + whatsapp, 0, 1, 'L')
            self.ln(4)
            self.set_font('Helvetica', '', 8)
            self.set_text_color(5, 99, 195)
            self.cell(0, 5, '   Link: ' + whatsapp_link, 0, 1, 'L')
        
        if telefone:
            self.ln(4)
            self.set_font('Helvetica', '', 9)
            self.set_text_color(60, 60, 60)
            self.cell(0, 5, '   Telefone: ' + telefone, 0, 1, 'L')
        
        maps_link = lead.get('maps_link', '')
        if not maps_link:
            place_id = lead.get('place_id', 'N/A')
            if place_id and place_id != 'N/A':
                maps_link = 'https://www.google.com/maps/place/?q=place_id:' + place_id
        
        if maps_link:
            self.ln(4)
            self.set_font('Helvetica', '', 8)
            self.set_text_color(5, 99, 195)
            self.cell(0, 5, '   Maps: ' + maps_link, 0, 1, 'L')
        
        self.ln(8)
        self.set_draw_color(200, 200, 200)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(3)

def main():
    with open('leads_limpos.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    leads_prioridade = data.get('leads_prioridade', [])
    leads_rejeitados = data.get('rejeitados_limpeza', [])
    todos_leads = leads_prioridade + leads_rejeitados
    
    leads_originais = []
    for lead in todos_leads:
        red_flags = lead.get('red_flags', [])
        whatsapp = lead.get('whatsapp', '')
        segmento = lead.get('segmento', '')
        
        if ('sem_site_proprio_valido' in red_flags and 
            whatsapp and whatsapp.strip() and 
            segmento in ['odontologia', 'pet_shop']):
            leads_originais.append(lead)
    
    novos_leads = [
        {"nome": "Moretto Clinica Odontologica", "segmento": "odontologia", "cidade": "Sao Paulo", "estado": "SP", "telefone": "+55 11 3384-3244", "whatsapp": "5511994449755", "whatsapp_link": "https://api.whatsapp.com/send?phone=5511994449755", "maps_link": "https://www.google.com/maps/search/?api=1&query=Moretto%20Cl%C3%ADnica%20Odontol%C3%B3gica&query_place_id=ChIJAY6ZAzRfzpQRXSo3BV8ualM"},
        {"nome": "Dentz Clinica Odontologica", "segmento": "odontologia", "cidade": "Sao Paulo", "estado": "SP", "telefone": "+55 11 94604-6000", "whatsapp": "5511946046000", "whatsapp_link": "https://api.whatsapp.com/send?phone=5511946046000&text=Ol%C3%A1,%20quero%20agendar%20uma%20avalia%C3%A7%C3%A3o!", "maps_link": "https://www.google.com/maps/search/?api=1&query=Dentz%20Cl%C3%ADnica%20Odontol%C3%B3gica&query_place_id=ChIJa3Oiki5bzpQRFSt7T7FSUCc"},
        {"nome": "Clinica Jardim Novo Horizonte", "segmento": "odontologia", "cidade": "Sao Paulo", "estado": "SP", "telefone": "+55 11 5938-8967", "whatsapp": "551159388967", "whatsapp_link": "https://wa.me/551159388967", "maps_link": "https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica%20Jardim%20Novo%20Horizonte&query_place_id=ChIJ6146NbpJzpQRJKtfbqK3OCM"},
        {"nome": "Dentista Oriel Odontologia Modernna", "segmento": "odontologia", "cidade": "Sao Paulo", "estado": "SP", "telefone": "+55 11 98500-5666", "whatsapp": "5511985005666", "whatsapp_link": "https://wa.me/5511985005666?text=Ol%C3%A1%2C%20vim%20pelo%20google%20e%20quero%20saber%20mais", "maps_link": "https://www.google.com/maps/search/?api=1&query=Dentista%20Ori%C3%A9l%20Odontologia%20Modernna%20I%20Clinica%20Odontol%C3%B3gica%20em%20Cidade%20Dutra%20Interlagos&query_place_id=ChIJ18HtAaZPzpQRvL2MXaXf2x0"},
        {"nome": "Clinica Odontologica Hoffmann Pires", "segmento": "odontologia", "cidade": "Sao Paulo", "estado": "SP", "telefone": "+55 11 91585-8959", "whatsapp": "5511915858959", "whatsapp_link": "https://wa.me/5511915858959", "maps_link": "https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica%20Odontol%C3%B3gica%20Hoffmann%20Pires&query_place_id=ChIJ0cxopGJRzpQRiwJGzkk4zf8"},
        {"nome": "DentGold Clinica Odontologica - Jabaquara", "segmento": "odontologia", "cidade": "Sao Paulo", "estado": "SP", "telefone": "+55 11 2667-2823", "whatsapp": "5511989762024", "whatsapp_link": "https://api.whatsapp.com/send?phone=5511989762024&text=Ol%C3%A1!", "maps_link": "https://www.google.com/maps/search/?api=1&query=DentGold%20Cl%C3%ADnica%20Odontol%C3%B3gica%20-%20Jabaquara&query_place_id=ChIJufWFzdtazpQRmp1awT-3OY0"},
        {"nome": "CQB ODONTOLOGIA", "segmento": "odontologia", "cidade": "Sao Paulo", "estado": "SP", "telefone": "+55 11 94072-3340", "whatsapp": "5511940723340", "whatsapp_link": "https://api.whatsapp.com/send/?phone=5511940723340&text=Ol%C3%A1%2C+Gostaria+de+agendar+uma+consulta%21&type=phone_number&app_absent=0", "maps_link": "https://www.google.com/maps/search/?api=1&query=CQB%20ODONTOLOGIA&query_place_id=ChIJASnriCRRzpQRnlwoh5wOqmM"},
        {"nome": "Dra Priscila Galhasso - Clinica Odontologica Galhasso", "segmento": "odontologia", "cidade": "Sao Paulo", "estado": "SP", "telefone": "+55 11 93470-7944", "whatsapp": "5511934707944", "whatsapp_link": "https://api.whatsapp.com/send?phone=5511934707944&text=Ol%C3%A1,%20Venho%20do%20google%20e%20estou%20interessado(a)%20em%20seus%20servi%C3%A7os", "maps_link": "https://www.google.com/maps/search/?api=1&query=Dra%20Priscila%20Galhasso%20-%20Cl%C3%ADnica%20Odontologica%20Galhasso&query_place_id=ChIJHyXN1r_3zpQR5cY095dD7bQ"},
        {"nome": "Clinica Odontologica DNTBRAS", "segmento": "odontologia", "cidade": "Juiz de Fora", "estado": "MG", "telefone": "+55 32 99882-9667", "whatsapp": "5532998628476", "whatsapp_link": "https://wa.me/5532998628476", "maps_link": "https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica%20Odontol%C3%B3gica%20DNTBRAS&query_place_id=ChIJqfimO4OdmAARkpbCe5VWyq4"},
        {"nome": "Odontologia Jobim", "segmento": "odontologia", "cidade": "Juiz de Fora", "estado": "MG", "telefone": "+55 32 99858-4597", "whatsapp": "5532998584597", "whatsapp_link": "https://wa.me/5532998584597", "maps_link": "https://www.google.com/maps/search/?api=1&query=Odontologia%20Jobim&query_place_id=ChIJAZ50rW6bmAARkLGf4KrEuCY"},
        {"nome": "Kharisma Odontologia - Reabilitacao Oral com Dr. Gabriel David", "segmento": "odontologia", "cidade": "Juiz de Fora", "estado": "MG", "telefone": "+55 32 3015-2913", "whatsapp": "5532998211868", "whatsapp_link": "https://wa.me/5532998211868?text=Ol%C3%A1%2C%20vi%20voc%C3%AAs%20no%20Google%20e%20quero%20saber%20mais%20sobre%20implantes%20dent%C3%A1rios.", "maps_link": "https://www.google.com/maps/search/?api=1&query=Kh%C3%A1risma%20Odontologia%20%7C%20Reabilita%C3%A7%C3%A3o%20Oral%20com%20Dr.%20Gabriel%20David&query_place_id=ChIJNzb6LnibmAARv_UJkrrWrBU"},
        {"nome": "Clinica Medica e Odontologica Santa Rosa", "segmento": "odontologia", "cidade": "Montes Claros", "estado": "MG", "telefone": "+55 38 99903-5439", "whatsapp": "5538999035439", "whatsapp_link": "https://wa.me/5538999035439", "maps_link": "https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica%20M%C3%A9dica%20e%20Odontol%C3%B3gica%20%7C%20Santa%20Rosa&query_place_id=ChIJuw5afQBVqwARIlPwwmMYkcw"},
        {"nome": "OdontoMontes", "segmento": "odontologia", "cidade": "Montes Claros", "estado": "MG", "telefone": "+55 38 3015-1002", "whatsapp": "553899606242", "whatsapp_link": "http://api.whatsapp.com/send/?phone=553899606242&text=Ol%C3%A1,+vi+seu+an%C3%BAncio+no+google+e+tenho+interesse!&type=phone_number&app_absent=0", "maps_link": "https://www.google.com/maps/search/?api=1&query=OdontoMontes&query_place_id=ChIJgQFvIkhVqwAR1MEaEa0mfYE"},
        {"nome": "Consultorio Odontologico Dra Lorena Rocha Unidade 2", "segmento": "odontologia", "cidade": "Montes Claros", "estado": "MG", "telefone": "+55 38 98405-6942", "whatsapp": "5538984056942", "whatsapp_link": "https://wa.me/5538984056942", "maps_link": "https://www.google.com/maps/search/?api=1&query=Consult%C3%B3rio%20Odontol%C3%B3gico%20Dra%20Lorena%20Rocha%20Unidade%202&query_place_id=ChIJKZBxjhpVqwAR53oB4UP3LPw"},
        {"nome": "Clinica Caiafa - Dra Luisa Caiafa", "segmento": "odontologia", "cidade": "Juiz de Fora", "estado": "MG", "telefone": "+55 32 3026-4165", "whatsapp": "", "whatsapp_link": "", "maps_link": ""}
    ]
    
    todos_leads_final = leads_originais + novos_leads
    
    total = len(todos_leads_final)
    odontologia = sum(1 for l in todos_leads_final if l.get('segmento') == 'odontologia')
    pet_shop = sum(1 for l in todos_leads_final if l.get('segmento') == 'pet_shop')
    
    pdf = LeadPDF()
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    pdf.add_page()
    pdf.ln(30)
    
    pdf.set_font('Helvetica', 'B', 28)
    pdf.set_text_color(31, 78, 61)
    pdf.cell(0, 15, 'RELATORIO DE LEADS', 0, 1, 'C')
    
    pdf.ln(10)
    pdf.set_font('Helvetica', '', 16)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 10, 'Empresas SEM Site + WhatsApp + Maps', 0, 1, 'C')
    
    pdf.ln(20)
    
    pdf.set_fill_color(232, 245, 233)
    
    pdf.set_font('Helvetica', 'B', 14)
    pdf.set_text_color(31, 78, 61)
    pdf.cell(60, 12, 'TOTAL', 1, 0, 'C', fill=True)
    pdf.cell(60, 12, 'ODONTOLOGIA', 1, 0, 'C', fill=True)
    pdf.cell(60, 12, 'PET SHOP', 1, 1, 'C', fill=True)
    
    pdf.set_font('Helvetica', 'B', 20)
    pdf.cell(60, 15, str(total), 1, 0, 'C', fill=True)
    pdf.cell(60, 15, str(odontologia), 1, 0, 'C', fill=True)
    pdf.cell(60, 15, str(pet_shop), 1, 1, 'C', fill=True)
    
    pdf.ln(30)
    pdf.set_font('Helvetica', '', 10)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 6, 'Segmentos:', 0, 1, 'C')
    pdf.set_font('Helvetica', '', 9)
    pdf.cell(0, 5, 'Clinicas Odontologicas | Pet Shops', 0, 1, 'C')
    
    pdf.add_page()
    pdf.chapter_title('LISTA COMPLETA DE LEADS', (31, 78, 61))
    
    for i, lead in enumerate(todos_leads_final, 1):
        pdf.lead_entry(lead, i, i % 2 == 0)
    
    pdf.add_page()
    pdf.chapter_title('RESUMO POR CIDADE', (95, 111, 82))
    
    por_cidade = {}
    for lead in todos_leads_final:
        cidade = lead.get('cidade', 'N/A') + ' - ' + lead.get('estado', 'N/A')
        if cidade not in por_cidade:
            por_cidade[cidade] = {'odontologia': 0, 'pet_shop': 0, 'total': 0}
        segmento = lead.get('segmento', '')
        if segmento in ['odontologia', 'pet_shop']:
            por_cidade[cidade][segmento] += 1
            por_cidade[cidade]['total'] += 1
    
    cidades_ordenadas = sorted(por_cidade.items(), key=lambda x: x[1]['total'], reverse=True)
    
    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(60, 60, 60)
    pdf.cell(80, 8, 'CIDADE', 1, 0, 'C')
    pdf.cell(35, 8, 'ODONTOLOGIA', 1, 0, 'C')
    pdf.cell(35, 8, 'PET SHOP', 1, 0, 'C')
    pdf.cell(35, 8, 'TOTAL', 1, 1, 'C')
    
    pdf.set_font('Helvetica', '', 9)
    for cidade, dados in cidades_ordenadas:
        fill = (int(pdf.get_y()) / 10) % 2 == 0
        if fill:
            pdf.set_fill_color(245, 245, 245)
        else:
            pdf.set_fill_color(255, 255, 255)
        
        pdf.cell(80, 7, cidade, 1, 0, 'C', fill=True)
        pdf.cell(35, 7, str(dados['odontologia']), 1, 0, 'C', fill=True)
        pdf.cell(35, 7, str(dados['pet_shop']), 1, 0, 'C', fill=True)
        pdf.cell(35, 7, str(dados['total']), 1, 1, 'C', fill=True)
    
    output_path = 'leads_sem_site_whatsapp.pdf'
    pdf.output(output_path)
    print('PDF gerado com sucesso: ' + output_path)
    print('Total: ' + str(total) + ' | Odontologia: ' + str(odontologia) + ' | Pet Shop: ' + str(pet_shop))

if __name__ == '__main__':
    main()