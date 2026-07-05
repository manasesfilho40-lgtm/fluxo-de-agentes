"""
SISTEMA COMPLETO DE CAPTURA DE LEADS - Google Maps
===================================================
Busca advogados individuais + clinicas odontologicas no Google Maps.
Criterios:
  - Deve ter WhatsApp (wa.me ou api.whatsapp.com/send)
  - NAO pode ter website proprio
  - Advogados: apenas individuais (sem firmas/associacoes)
  - Clinicas: odontologicas sem website
  - Excluir leads ja coletados anteriormente

Uso: python sistema_leads.py
Saida: leads_novos_maps.json + leads_novos_validados.pdf
"""

import asyncio
import json
import os
import re
import sys
import time
import random
import codecs
from datetime import datetime
from urllib.parse import quote
from fpdf import FPDF
from playwright.async_api import async_playwright

sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')

BASE_DIR = r"C:\Users\T-GAMER\fluxo de agentes"
LINKS_FILE = os.path.join(BASE_DIR, "links_ja_coletados.txt")
OUTPUT_JSON = os.path.join(BASE_DIR, "leads_novos_maps.json")
OUTPUT_PDF = os.path.join(BASE_DIR, "leads_novos_validados.pdf")

OLD_FILES = [
    os.path.join(BASE_DIR, "advogados_50_final_v2.json"),
    os.path.join(BASE_DIR, "clinicas_50_final_v2.json"),
    os.path.join(BASE_DIR, "leads_passados", "leads_compilados.json"),
    os.path.join(BASE_DIR, "leads_passados", "leads_100_validos.json"),
]

# ============================================================
# CIDADES (40+ cidades brasileiras)
# ============================================================
CIDADES = [
    "Marilia, SP", "Presidente Prudente, SP", "Sao Jose do Rio Preto, SP",
    "Osasco, SP", "Santo Andre, SP", "Sao Jose dos Pinhais, PR",
    "Foz do Iguacu, PR", "Colombo, PR", "Guarapuava, PR",
    "Palmas, TO", "Macapa, AP", "Rio Branco, AC",
    "Araguaina, TO", "Gurupi, TO", "Mogi das Cruzes, SP",
    "Diadema, SP", "Piracicaba, SP", "Feira de Santana, BA",
    "Vitoria da Conquista, BA", "Niteroi, RJ", "Campos dos Goytacazes, RJ",
    "Itajai, SC", "Chapeco, SC", "Blumenau, SC",
    "Caxias do Sul, RS", "Pelotas, RS", "Canoas, RS",
    "Santa Maria, RS", "Londrina, PR", "Maringa, PR",
    "Ponta Grossa, PR", "Cascavel, PR", "Bauru, SP",
    "Jundiai, SP", "Santos, SP", "Sorocaba, SP",
    "Ribeirao Preto, SP", "Guarulhos, SP", "Sao Bernardo do Campo, SP",
    "Sao Jose dos Campos, SP", "Campinas, SP",
]

# ============================================================
# QUERIES DE BUSCA
# ============================================================
QUERIES_ADV = [
    "advogado trabalhista", "advogado civil", "advogado familia",
    "advogado criminal", "advogado previdenciario", "advogado tributarista",
    "advogado empresarial", "advogado do consumidor",
    "escritorio advocacia trabalhista", "escritorio advocacia civil",
    "advogado direito de familia", "advogado direito penal",
    "advogado divorcio", "advogado inventario", "advogado pensao alimenticia",
    "advogado trabalho rescisao", "advogado inss", "advogado aposentadoria",
]

QUERIES_CLIN = [
    "clinica odontologica", "clinica dentaria", "consultorio odontologico",
    "clinica ortodontia", "clinica implante dentario", "dentista emergencia",
    "clinica endodontia", "clinica periodontia", "clinica protese dentaria",
    "clinica odontopediatria", "clinica Clareamento dental",
    "clinica harmonizacao facial", "clinica cirurgia bucal",
    "consultorio dentista", "clinica prostodontia",
    "dentista ortodontista", "dentista pediatrico",
]

# ============================================================
# FILTROS - CRITERIOS DE VALIDACAO
# ============================================================

# Advogados: palavras que indicam FIRMAS (devem ser excluidos)
FIRM_KEYWORDS = [
    '&', 'advogados', 'advogadas', 'associad', 'sociedade', 'firma',
    'escritorio', 'consultoria', 'e associados', 'e filhos',
    'meirelles', 'pinheiro', 'siqueira', 'campos', 'carvalho',
    'almeida', 'rocha', 'silva', 'santos', 'ferreira', 'pereira',
    'costa', 'lima', 'araujo', 'barbosa', 'mendes', 'nunes',
    'machado', 'teixeira', 'moreira', 'cardoso', 'gomes', 'ribeiro',
    'martins', 'lopes', 'dias', 'vieira', 'fernandes', 'barros',
    'freitas', 'ramos', 'goraieb', 'marques', 'duarte', 'cavalcanti',
    'moura', 'castro', 'nascimento', 'azevedo', 'lucas', 'melo',
    'figueiredo', 'batista', 'campos', 'monteiro', 'da rocha',
    'da silva', 'da costa', 'da cunha', 'da cruz', 'da fonseca',
    'da franca', 'da motta', 'da nobrega', 'da paz', 'da penha',
    'da rocha', 'da silva', 'da trindade', 'da veiga', 'dias',
    'e companhia', 'e cia', 'e socios', 'e advogados',
]

# Advogados: padroes GENERICOS (devem ser excluidos)
GENERIC_PATTERNS = [
    r'^advogad[oa]\s+(em|de|previd)',
    r'^escritorio',
    r'^\w+\s+advocacia\s*$',
    r'online no whatsapp$',
    r'^dr\.?\s+\w+$',  # Dr. Fulano (sem sobrenome)
]

# Clinicas: palavras que indicam NAO-ODONTO (devem ser excluidos)
NON_DENTAL = [
    'oftalmol', 'dermatol', 'psiquiatr', 'psicolog', 'nutricion',
    'fisioterap', 'acupuntur', 'veterinari', 'pet shop', 'petshop',
    'academia', 'estetica', 'salao', 'barbearia', 'hotel',
    'restaurante', 'pizzaria', 'lanchonete', 'padaria',
]


def is_firm(name):
    """Verifica se nome indica firma/escritorio (NAO e advogado individual)"""
    n = name.lower()
    # Simbolos que indicam associacao
    if '&' in name:
        return True
    # Padrao "X, Y e Z"
    if re.search(r'\w+,\s*\w+\s+e\s+\w+', name):
        return True
    # Palavras-chave de firma
    for kw in FIRM_KEYWORDS:
        if kw in n:
            return True
    return False


def is_solo_lawyer(name):
    """Verifica se parece advogado individual (e nao firma)"""
    n = name.lower()
    # Deve ter indicacao de advogado
    if not any(w in n for w in ['advoc', 'advogad', 'direito', 'juridic', 'oab']):
        return False
    # Nao pode ser firma
    if is_firm(name):
        return False
    # Nao pode ser clinica/odontologia
    if any(w in n for w in ['dentista', 'odontol', 'clinica', 'implante', 'ortodont']):
        return False
    return True


def is_generic(name):
    """Verifica se nome e generico demais"""
    n = name.lower().strip()
    n_clean = re.sub(r'[^\w\s]', '', n).strip()
    for pat in GENERIC_PATTERNS:
        if re.search(pat, n_clean):
            return True
    if len(n_clean.split()) < 2 and 'dr' not in n_clean:
        return True
    return False


def is_dental_clinic(name):
    """Verifica se e clinica odontologica (para clinicas)"""
    n = name.lower()
    if any(w in n for w in NON_DENTAL):
        return False
    if any(w in n for w in ['dent', 'odont', 'bucal', 'dental', 'sorriso', 'implante', 'ortodont']):
        return True
    if 'clinica' in n or 'consultorio' in n:
        return True
    return False


def sanitize(text):
    """Remove caracteres nao-latin1 para PDF"""
    if not text:
        return "N/A"
    text = str(text)
    text = re.sub(r'[\u200d\u200c\u200b\u200e\u200f\ufe0f]', '', text)
    text = text.encode('latin-1', 'replace').decode('latin-1')
    return text


# ============================================================
# FUNCOES UTILITARIAS
# ============================================================

def load_seen():
    """Carrega links ja visitados"""
    if os.path.exists(LINKS_FILE):
        with open(LINKS_FILE, 'r', encoding='utf-8') as f:
            return set(l.strip() for l in f if l.strip())
    return set()


def save_seen(link):
    """Salva link visitado"""
    with open(LINKS_FILE, 'a', encoding='utf-8') as f:
        f.write(link + '\n')


def load_old():
    """Carrega leads antigos para evitar duplicatas"""
    names, phones, maps = set(), set(), set()
    for fp in OLD_FILES:
        if not os.path.exists(fp):
            continue
        try:
            with open(fp, 'r', encoding='utf-8') as f:
                data = json.load(f)
            items = data if isinstance(data, list) else data.get("leads", [])
            for it in items:
                n = (it.get("nome") or "").strip().lower()
                if n:
                    names.add(n)
                p = re.sub(r'\D', '', it.get("telefone", "") or it.get("whatsapp", ""))
                if p and len(p) >= 10:
                    phones.add(p)
                m = it.get("link_maps") or it.get("maps_link") or ""
                if m:
                    maps.add(m.strip())
        except:
            pass
    # Carregar progresso atual tambem
    if os.path.exists(OUTPUT_JSON):
        try:
            with open(OUTPUT_JSON, 'r', encoding='utf-8-sig') as f:
                data = json.load(f)
            for cat in ['advogados', 'clinicas']:
                for it in data.get(cat, {}).get("leads", []):
                    n = (it.get("nome") or "").strip().lower()
                    if n:
                        names.add(n)
                    p = re.sub(r'\D', '', it.get("whatsapp_number", ""))
                    if p:
                        phones.add(p)
        except:
            pass
    return names, phones, maps


def find_wa(text):
    """Encontra link de WhatsApp no HTML/texto"""
    for pat in [r'(https?://api\.whatsapp\.com/send\?phone=\d+)', r'(https?://wa\.me/\d+)']:
        m = re.search(pat, text)
        if m:
            return m.group(1) if m.group(1).startswith('http') else 'https://' + m.group(1)
    return None


def wa_number(link):
    """Extrai numero do WhatsApp do link"""
    m = re.search(r'(\d{10,13})', link)
    return m.group(1) if m else None


def norm_phone(p):
    """Normaliza telefone"""
    d = re.sub(r'\D', '', p)
    return d if len(d) >= 10 else None


def _save_progress(val_adv, val_clin, raw_adv_count, raw_clin_count):
    """Salva progresso parcial"""
    output = {
        "data_geracao": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "advogados": {
            "total_coletados": raw_adv_count,
            "total_validados": len(val_adv),
            "entregues": len(val_adv),
            "leads": val_adv[:50],
        },
        "clinicas": {
            "total_coletados": raw_clin_count,
            "total_validados": len(val_clin),
            "entregues": len(val_clin),
            "leads": val_clin[:50],
        },
    }
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)


# ============================================================
# FASE 1: BUSCA NO GOOGLE MAPS
# ============================================================

async def maps_search(page, search_term, city, seen):
    """Busca rapida no Maps, retorna lista de leads brutos"""
    results = []
    query = f"{search_term} em {city}"
    url = f"https://www.google.com/maps/search/{quote(query)}"
    try:
        await page.goto(url, timeout=15000)
        await page.wait_for_timeout(2000)
        for _ in range(3):
            await page.evaluate("window.scrollBy(0, 600)")
            await page.wait_for_timeout(400)
        cards = await page.query_selector_all('div.Nv2PK')
        for card in cards[:12]:
            try:
                el = await card.query_selector('a.hfpxzc')
                href = await el.get_attribute('href') if el else None
                if not href or href in seen:
                    continue
                seen.add(href)
                save_seen(href)
                nel = await card.query_selector('div.qBF1Pd')
                name = await nel.inner_text() if nel else "N/A"
                rel = await card.query_selector('span.MW4etd')
                rating = await rel.inner_text() if rel else ""
                results.append({
                    'nome': name.strip(),
                    'avaliacao': rating.strip(),
                    'link_maps': href,
                    'cidade': city,
                    'tipo': search_term,
                })
            except:
                continue
    except:
        pass
    return results


# ============================================================
# FASE 2: DETALHAMENTO (WhatsApp, site, telefone)
# ============================================================

async def detail_lead(page, lead, old_n, old_p, old_m):
    """Detalha um lead: abre Maps, extrai WhatsApp/site. Retorna lead validado ou None"""
    nome = lead.get('nome', '')
    link = lead.get('link_maps', '')

    if nome.strip().lower() in old_n:
        return None
    if link in old_m:
        return None

    try:
        await page.goto(link, timeout=12000)
        await page.wait_for_timeout(1500)
        content = await page.content()
        text = await page.evaluate("() => document.body.innerText")

        # Telefones
        phones = re.findall(r'\(\d{2}\)\s*9\d{4}[\s-]?\d{4}', text)
        phones += re.findall(r'\(\d{2}\)\s*\d{4,5}[\s-]?\d{4}', text)

        # WhatsApp no HTML
        wa = find_wa(content) or find_wa(text)

        # Links da pagina
        links_page = await page.evaluate("""() => Array.from(document.querySelectorAll('a[href]')).map(a=>({h:a.href,t:a.innerText}))""")
        has_site = False
        wa_found = []
        for lp in links_page:
            h, t = lp.get('h', ''), lp.get('t', '')
            if 'wa.me' in h or 'whatsapp.com' in h or 'whatsapp' in t.lower():
                wa_found.append(h)
            elif 'http' in h and 'google' not in h and 'gstatic' not in h and 'maps' not in h:
                has_site = True

        if not wa and wa_found:
            wa = wa_found[0]

        # Botao de WhatsApp
        if not wa:
            btns = await page.query_selector_all('[data-item-id*="whatsapp"], [aria-label*="WhatsApp"]')
            for b in btns:
                try:
                    bh = await b.get_attribute('href')
                    if bh and ('wa.me' in bh or 'whatsapp' in bh):
                        wa = bh
                        break
                except:
                    pass

        phone = norm_phone(phones[0]) if phones else None
        wan = wa_number(wa) if wa else None

        # CRITERIO: deve ter WhatsApp E nao ter site
        if wa and not has_site:
            cp = wan or phone
            if cp and cp not in old_p:
                return {
                    'nome': nome,
                    'telefone': f"({phone[:2]}) {phone[2:7]}-{phone[7:]}" if phone and len(phone) >= 11 else phone,
                    'whatsapp_link': wa if wa.startswith('http') else f"https://{wa}",
                    'whatsapp_number': wan or phone,
                    'cidade': lead.get('cidade', ''),
                    'tipo': lead.get('tipo', ''),
                    'avaliacao': lead.get('avaliacao', ''),
                    'link_maps': link,
                    'tem_site': False,
                }
    except:
        pass
    return None


# ============================================================
# FASE 3: FILTRO DE QUALIDADE
# ============================================================

def filter_leads(valid_adv, valid_clin):
    """Aplica filtros de qualidade nos leads"""
    # Filtrar advogados: remover firmas e genericos
    filtered_adv = []
    for lead in valid_adv:
        nome = lead.get('nome', '')
        if is_firm(nome):
            continue
        if is_generic(nome):
            continue
        if not is_solo_lawyer(nome):
            continue
        filtered_adv.append(lead)

    # Filtrar clinicas: remover nao-odontologicas
    filtered_clin = []
    for lead in valid_clin:
        nome = lead.get('nome', '')
        if is_dental_clinic(nome):
            filtered_clin.append(lead)

    return filtered_adv[:50], filtered_clin[:50]


# ============================================================
# FASE 4: VERIFICACAO DE LINKS
# ============================================================

async def check_link(page, link):
    """Verifica se link do Maps esta funcionando"""
    try:
        await page.goto(link, timeout=10000)
        await page.wait_for_timeout(1500)
        h1 = await page.query_selector('h1')
        nome = await h1.inner_text() if h1 else None
        if nome and len(nome.strip()) > 1:
            return True, nome.strip()
        return False, None
    except:
        return False, None


# ============================================================
# FASE 5: COMPLETAR GAP
# ============================================================

async def fill_gaps(page, leads, target, lead_type, old_n):
    """Busca leads extras para completar o target"""
    faltam = target - len(leads)
    if faltam <= 0:
        return leads

    print(f"  Faltam {faltam} {lead_type}. Buscando links extras...", flush=True)
    with open(LINKS_FILE, 'r', encoding='utf-8') as f:
        all_links = list(set(l.strip() for l in f if 'google.com/maps/place' in l))
    random.shuffle(all_links)

    checked = set(l['link_maps'] for l in leads)
    extra = []

    for link in all_links:
        if len(extra) >= faltam + 5:
            break
        if link in checked:
            continue
        try:
            await page.goto(link, timeout=10000)
            await page.wait_for_timeout(1200)
            h1 = await page.query_selector('h1')
            nome = await h1.inner_text() if h1 else ''
            if not nome or nome.strip().lower() in old_n:
                continue

            # Filtro por tipo
            if lead_type == 'advogados':
                if not is_solo_lawyer(nome):
                    continue
            elif lead_type == 'clinicas':
                if not is_dental_clinic(nome):
                    continue

            content = await page.content()
            wa = find_wa(content)
            if not wa:
                lps = await page.evaluate("() => Array.from(document.querySelectorAll('a[href]')).map(a=>a.href)")
                for h in lps:
                    if 'wa.me' in h or 'whatsapp.com' in h:
                        wa = h
                        break
            if not wa:
                btns = await page.query_selector_all('[data-item-id*="whatsapp"], [aria-label*="WhatsApp"]')
                for b in btns:
                    try:
                        bh = await b.get_attribute('href')
                        if bh and ('wa.me' in bh or 'whatsapp' in bh):
                            wa = bh
                            break
                    except:
                        pass
            if not wa:
                continue

            # Verificar site
            has_site = False
            lps = await page.evaluate("() => Array.from(document.querySelectorAll('a[href]')).map(a=>a.href)")
            for h in lps:
                if 'http' in h and 'google' not in h and 'gstatic' not in h and 'maps' not in h:
                    has_site = True
                    break
            if has_site:
                continue

            wan = re.search(r'(\d{10,13})', wa)
            wan = wan.group(1) if wan else None
            text = await page.evaluate("() => document.body.innerText")
            phones = re.findall(r'\(\d{2}\)\s*9\d{4}[\s-]?\d{4}', text)
            phone = phones[0] if phones else ''

            extra.append({
                'nome': nome,
                'telefone': phone,
                'whatsapp_link': wa if wa.startswith('http') else f'https://{wa}',
                'whatsapp_number': wan or phone,
                'cidade': '',
                'tipo': lead_type.rstrip('s'),  # advogados -> advogado
                'avaliacao': '',
                'link_maps': link,
                'tem_site': False,
            })
            old_n.add(nome.strip().lower())
            print(f"    EXTRA {len(extra)}: {nome[:40]}", flush=True)
        except:
            pass
        await page.wait_for_timeout(400)

    leads.extend(extra[:faltam])
    return leads[:target]


# ============================================================
# FASE 6: GERAR PDF
# ============================================================

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
    """Gera PDF final com os leads"""
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
    print(f"\nPDF gerado: {OUTPUT_PDF}")
    print(f"  Advogados: {advogados.get('entregues', 0)}")
    print(f"  Clinicas: {clinicas.get('entregues', 0)}")


# ============================================================
# PIPELINE PRINCIPAL
# ============================================================

async def main():
    start = time.time()
    print("=" * 60, flush=True)
    print("  SISTEMA DE LEADS v1.0 - Google Maps", flush=True)
    print(f"  {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}", flush=True)
    print("=" * 60, flush=True)

    # Carregar dados existentes
    seen = load_seen()
    old_n, old_p, old_m = load_old()
    print(f"Links vistos: {len(seen)} | Leads antigos: {len(old_n)}", flush=True)

    cities = CIDADES[:]
    random.shuffle(cities)

    # Tasks embaralhadas
    tasks_adv = [(q, c) for c in cities for q in QUERIES_ADV]
    tasks_clin = [(q, c) for c in cities for q in QUERIES_CLIN]
    random.shuffle(tasks_adv)
    random.shuffle(tasks_clin)

    val_adv = []
    val_clin = []
    raw_adv_count = 0
    raw_clin_count = 0

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=['--no-sandbox', '--disable-dev-shm-usage']
        )

        # =========================================
        # FASE 1 + 2: BUSCA + DETALHAMENTO ADV
        # =========================================
        print("\n--- FASE 1+2: BUSCA ADVOGADOS ---", flush=True)
        ctx = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            user_agent=f"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{120+random.randint(0,5)}.0.0.0 Safari/537.36"
        )
        page = await ctx.new_page()

        raw_adv = []
        for st, city in tasks_adv:
            if len(raw_adv) >= 300:
                break
            results = await maps_search(page, st, city, seen)
            raw_adv.extend(results)
            if results:
                print(f"  [BUSCA] {st} {city} -> {len(results)} novos (total: {len(raw_adv)})", flush=True)
            await page.wait_for_timeout(300)

        raw_adv_count = len(raw_adv)
        print(f"\n  Bruto adv: {raw_adv_count}", flush=True)
        print(f"  Detalhando...", flush=True)

        for lead in raw_adv:
            if len(val_adv) >= 55:
                break
            v = await detail_lead(page, lead, old_n, old_p, old_m)
            if v:
                old_p.add(v['whatsapp_number'])
                old_m.add(v['link_maps'])
                old_n.add(v['nome'].strip().lower())
                val_adv.append(v)
                print(f"    ADV OK {len(val_adv)}/55 {v['nome'][:40]}", flush=True)
                _save_progress(val_adv, val_clin, raw_adv_count, raw_clin_count)
            await page.wait_for_timeout(300)

        await page.close()
        await ctx.close()

        # =========================================
        # FASE 1+2: BUSCA + DETALHAMENTO CLIN
        # =========================================
        print("\n--- FASE 1+2: BUSCA CLINICAS ---", flush=True)
        ctx2 = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            user_agent=f"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{120+random.randint(0,5)}.0.0.0 Safari/537.36"
        )
        page2 = await ctx2.new_page()

        raw_clin = []
        for st, city in tasks_clin:
            if len(raw_clin) >= 300:
                break
            results = await maps_search(page2, st, city, seen)
            raw_clin.extend(results)
            if results:
                print(f"  [BUSCA] {st} {city} -> {len(results)} novos (total: {len(raw_clin)})", flush=True)
            await page2.wait_for_timeout(300)

        raw_clin_count = len(raw_clin)
        print(f"\n  Bruto clin: {raw_clin_count}", flush=True)
        print(f"  Detalhando...", flush=True)

        for lead in raw_clin:
            if len(val_clin) >= 55:
                break
            v = await detail_lead(page2, lead, old_n, old_p, old_m)
            if v:
                old_p.add(v['whatsapp_number'])
                old_m.add(v['link_maps'])
                old_n.add(v['nome'].strip().lower())
                val_clin.append(v)
                print(f"    CLIN OK {len(val_clin)}/55 {v['nome'][:40]}", flush=True)
                _save_progress(val_adv, val_clin, raw_adv_count, raw_clin_count)
            await page2.wait_for_timeout(300)

        await page2.close()
        await ctx2.close()

        # =========================================
        # FASE 3: FILTRO DE QUALIDADE
        # =========================================
        print("\n--- FASE 3: FILTROS ---", flush=True)
        val_adv, val_clin = filter_leads(val_adv, val_clin)
        print(f"  Adv: {len(val_adv)} | Clin: {len(val_clin)}", flush=True)

        # =========================================
        # FASE 4: VERIFICACAO DE LINKS
        # =========================================
        print("\n--- FASE 4: VERIFICAR LINKS ---", flush=True)

        valid_adv = []
        ctx3 = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        )
        page3 = await ctx3.new_page()
        for i, lead in enumerate(val_adv):
            ok, _ = await check_link(page3, lead.get('link_maps', ''))
            print(f"  [{i+1}/{len(val_adv)}] {'OK' if ok else 'FALHOU'} {lead['nome'][:40]}", flush=True)
            if ok:
                valid_adv.append(lead)
            await page3.wait_for_timeout(500)
        await page3.close()
        await ctx3.close()

        valid_clin = []
        ctx4 = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        )
        page4 = await ctx4.new_page()
        for i, lead in enumerate(val_clin):
            ok, _ = await check_link(page4, lead.get('link_maps', ''))
            print(f"  [{i+1}/{len(val_clin)}] {'OK' if ok else 'FALHOU'} {lead['nome'][:40]}", flush=True)
            if ok:
                valid_clin.append(lead)
            await page4.wait_for_timeout(500)
        await page4.close()
        await ctx4.close()

        print(f"  Pos-verificacao: {len(valid_adv)} adv | {len(valid_clin)} clin", flush=True)

        # =========================================
        # FASE 5: COMPLETAR GAP
        # =========================================
        print("\n--- FASE 5: COMPLETAR GAP ---", flush=True)
        page5 = await (await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        )).new_page()

        valid_adv = await fill_gaps(page5, valid_adv, 50, 'advogados', old_n)
        valid_clin = await fill_gaps(page5, valid_clin, 50, 'clinicas', old_n)

        await page5.close()
        await browser.close()

    # =========================================
    # SALVAR JSON
    # =========================================
    print("\n--- SALVANDO ---", flush=True)
    output = {
        "data_geracao": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "sistema": "sistema_leads.py v1.0",
        "criterios": {
            "whatsapp_obrigatorio": True,
            "site_proibido": True,
            "advogados_firmas_excluidas": True,
            "advogados_individuais_apenas": True,
            "clinicas_odonto_apenas": True,
            "links_verificados": True,
        },
        "advogados": {
            "total_coletados": raw_adv_count,
            "total_validados": len(valid_adv),
            "entregues": len(valid_adv),
            "leads": valid_adv[:50],
        },
        "clinicas": {
            "total_coletados": raw_clin_count,
            "total_validados": len(valid_clin),
            "entregues": len(valid_clin),
            "leads": valid_clin[:50],
        },
    }

    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print(f"  JSON: {OUTPUT_JSON}", flush=True)

    # =========================================
    # GERAR PDF
    # =========================================
    print("\n--- GERANDO PDF ---", flush=True)
    generate_pdf(output)

    elapsed = time.time() - start
    print(f"\n{'='*60}", flush=True)
    print(f"  FINAL: {len(valid_adv)} adv | {len(valid_clin)} clin", flush=True)
    print(f"  Tempo: {elapsed/60:.1f} min", flush=True)
    print(f"{'='*60}", flush=True)


if __name__ == '__main__':
    asyncio.run(main())
