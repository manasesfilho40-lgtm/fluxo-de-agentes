import asyncio
import json
import os
import re
import sys
import time
import random
import codecs
from datetime import datetime
from playwright.async_api import async_playwright

sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
BASE_DIR = r"C:\Users\T-GAMER\fluxo de agentes"
INPUT_FILE = os.path.join(BASE_DIR, "leads_novos_maps.json")
OUTPUT_FILE = os.path.join(BASE_DIR, "leads_novos_maps.json")

FIRM_KEYWORDS = ['&', 'advogados', 'advogadas', 'associad', 'sociedade', 'firma', 'escritorio', 'consultoria']

GENERIC_PATTERNS = [
    r'^advogad[oa]\s+(em|de|previd)',
    r'^escritorio',
    r'^\w+\s+advocacia\s*$',
    r'online no whatsapp$',
]

def is_firm(name):
    n = name.lower()
    if '&' in name: return True
    if re.search(r'\w+,\s*\w+\s+e\s+\w+', name): return True
    for kw in FIRM_KEYWORDS:
        if kw in n: return True
    return False

def is_generic(name):
    n = name.lower().strip()
    n_clean = re.sub(r'[^\w\s]', '', n).strip()
    for pat in GENERIC_PATTERNS:
        if re.search(pat, n_clean): return True
    if len(n_clean.split()) < 2 and 'dr' not in n_clean: return True
    return False

def sanitize(text):
    if not text: return "N/A"
    text = str(text)
    text = re.sub(r'[\u200d\u200c\u200b\u200e\u200f\ufe0f]', '', text)
    text = text.encode('latin-1', 'replace').decode('latin-1')
    return text


class LeadPDF:
    pass

# Importar gerador de PDF
sys.path.insert(0, BASE_DIR)
from gerar_pdf_leads import generate_pdf


async def check_link(page, link):
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


async def main():
    start = time.time()
    print("=" * 60, flush=True)
    print("  LIMPEZA + VERIFICACAO", flush=True)
    print(f"  {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}", flush=True)
    print("=" * 60, flush=True)

    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    val_adv = data['advogados']['leads']
    val_clin = data['clinicas']['leads']
    print(f"Entrada: {len(val_adv)} adv | {len(val_clin)} clin", flush=True)

    # === FILTRAR ADVOGADOS ===
    print("\n--- Filtrar advogados ---", flush=True)
    filtered_adv = []
    for lead in val_adv:
        nome = lead.get('nome', '')
        if is_firm(nome):
            print(f"  REMOVER (firma): {nome}", flush=True)
        elif is_generic(nome):
            print(f"  REMOVER (generico): {nome}", flush=True)
        else:
            filtered_adv.append(lead)
    print(f"Adv: {len(val_adv)} -> {len(filtered_adv)}", flush=True)

    # === VERIFICAR LINKS ===
    print("\n--- Verificar links do Maps ---", flush=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=['--no-sandbox'])

        # Verificar advogados
        valid_adv = []
        ctx = await browser.new_context(viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
        page = await ctx.new_page()
        for i, lead in enumerate(filtered_adv):
            ok, nome_real = await check_link(page, lead.get('link_maps', ''))
            print(f"  [{i+1}/{len(filtered_adv)}] {'OK' if ok else 'FALHOU'} {lead['nome'][:40]}", flush=True)
            if ok:
                if nome_real: lead['nome_maps'] = nome_real
                valid_adv.append(lead)
            await page.wait_for_timeout(500)
        await page.close()
        await ctx.close()

        # Verificar clinicas
        valid_clin = []
        ctx2 = await browser.new_context(viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
        page2 = await ctx2.new_page()
        for i, lead in enumerate(val_clin):
            ok, nome_real = await check_link(page2, lead.get('link_maps', ''))
            print(f"  [{i+1}/{len(val_clin)}] {'OK' if ok else 'FALHOU'} {lead['nome'][:40]}", flush=True)
            if ok:
                if nome_real: lead['nome_maps'] = nome_real
                valid_clin.append(lead)
            await page2.wait_for_timeout(500)
        await page2.close()
        await ctx2.close()
        await browser.close()

    print(f"\nPos-verificacao: {len(valid_adv)} adv | {len(valid_clin)} clin", flush=True)

    # === COMPLETAR SE FALTAM ===
    if len(valid_adv) < 50:
        faltam = 50 - len(valid_adv)
        print(f"\nFaltam {faltam} advogados. Buscando links extras...", flush=True)
        with open(os.path.join(BASE_DIR, "links_ja_coletados.txt"), 'r', encoding='utf-8') as f:
            all_links = list(set(l.strip() for l in f if 'google.com/maps/place' in l))
        random.shuffle(all_links)
        checked = set(l['link_maps'] for l in valid_adv) | set(l['link_maps'] for l in filtered_adv)
        old_n = set(l['nome'].strip().lower() for l in valid_adv)

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True, args=['--no-sandbox'])
            ctx = await browser.new_context(viewport={'width': 1920, 'height': 1080},
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
            page = await ctx.new_page()
            extra = []
            for link in all_links:
                if len(extra) >= faltam + 5: break
                if link in checked: continue
                try:
                    await page.goto(link, timeout=10000)
                    await page.wait_for_timeout(1200)
                    h1 = await page.query_selector('h1')
                    nome = await h1.inner_text() if h1 else ''
                    if not nome or nome.strip().lower() in old_n: continue
                    if is_firm(nome) or is_generic(nome): continue
                    content = await page.content()
                    wa = None
                    for pat in [r'(https?://api\.whatsapp\.com/send\?phone=\d+)', r'(https?://wa\.me/\d+)']:
                        m = re.search(pat, content)
                        if m:
                            wa = m.group(1) if m.group(1).startswith('http') else 'https://' + m.group(1)
                            break
                    if not wa:
                        lps = await page.evaluate("() => Array.from(document.querySelectorAll('a[href]')).map(a=>a.href)")
                        for h in lps:
                            if 'wa.me' in h or 'whatsapp.com' in h: wa = h; break
                    if not wa:
                        btns = await page.query_selector_all('[data-item-id*="whatsapp"], [aria-label*="WhatsApp"]')
                        for b in btns:
                            try:
                                bh = await b.get_attribute('href')
                                if bh and ('wa.me' in bh or 'whatsapp' in bh): wa = bh; break
                            except: pass
                    has_site = False
                    if not wa: continue
                    wan = re.search(r'(\d{10,13})', wa)
                    wan = wan.group(1) if wan else None
                    phones = re.findall(r'\(\d{2}\)\s*9\d{4}[\s-]?\d{4}', await page.evaluate("() => document.body.innerText"))
                    phone = phones[0] if phones else ''
                    extra.append({
                        'nome': nome, 'telefone': phone,
                        'whatsapp_link': wa if wa.startswith('http') else f'https://{wa}',
                        'whatsapp_number': wan or phone, 'cidade': '', 'tipo': 'advogado',
                        'avaliacao': '', 'link_maps': link, 'tem_site': False,
                    })
                    old_n.add(nome.strip().lower())
                    print(f"  EXTRA ADV {len(extra)}: {nome[:40]}", flush=True)
                except: pass
                await page.wait_for_timeout(400)
            await browser.close()
        valid_adv.extend(extra[:faltam])

    if len(valid_clin) < 50:
        faltam = 50 - len(valid_clin)
        print(f"\nFaltam {faltam} clinicas. Buscando links extras...", flush=True)
        with open(os.path.join(BASE_DIR, "links_ja_coletados.txt"), 'r', encoding='utf-8') as f:
            all_links = list(set(l.strip() for l in f if 'google.com/maps/place' in l))
        random.shuffle(all_links)
        checked = set(l['link_maps'] for l in valid_clin) | set(l['link_maps'] for l in val_clin)
        old_n = set(l['nome'].strip().lower() for l in valid_clin)

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True, args=['--no-sandbox'])
            ctx = await browser.new_context(viewport={'width': 1920, 'height': 1080},
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
            page = await ctx.new_page()
            extra = []
            for link in all_links:
                if len(extra) >= faltam + 5: break
                if link in checked: continue
                try:
                    await page.goto(link, timeout=10000)
                    await page.wait_for_timeout(1200)
                    h1 = await page.query_selector('h1')
                    nome = await h1.inner_text() if h1 else ''
                    if not nome or nome.strip().lower() in old_n: continue
                    content = await page.content()
                    wa = None
                    for pat in [r'(https?://api\.whatsapp\.com/send\?phone=\d+)', r'(https?://wa\.me/\d+)']:
                        m = re.search(pat, content)
                        if m:
                            wa = m.group(1) if m.group(1).startswith('http') else 'https://' + m.group(1)
                            break
                    if not wa:
                        lps = await page.evaluate("() => Array.from(document.querySelectorAll('a[href]')).map(a=>a.href)")
                        for h in lps:
                            if 'wa.me' in h or 'whatsapp.com' in h: wa = h; break
                    if not wa:
                        btns = await page.query_selector_all('[data-item-id*="whatsapp"], [aria-label*="WhatsApp"]')
                        for b in btns:
                            try:
                                bh = await b.get_attribute('href')
                                if bh and ('wa.me' in bh or 'whatsapp' in bh): wa = bh; break
                            except: pass
                    has_site = False
                    if not wa: continue
                    wan = re.search(r'(\d{10,13})', wa)
                    wan = wan.group(1) if wan else None
                    phones = re.findall(r'\(\d{2}\)\s*9\d{4}[\s-]?\d{4}', await page.evaluate("() => document.body.innerText"))
                    phone = phones[0] if phones else ''
                    extra.append({
                        'nome': nome, 'telefone': phone,
                        'whatsapp_link': wa if wa.startswith('http') else f'https://{wa}',
                        'whatsapp_number': wan or phone, 'cidade': '', 'tipo': 'clinica',
                        'avaliacao': '', 'link_maps': link, 'tem_site': False,
                    })
                    old_n.add(nome.strip().lower())
                    print(f"  EXTRA CLIN {len(extra)}: {nome[:40]}", flush=True)
                except: pass
                await page.wait_for_timeout(400)
            await browser.close()
        valid_clin.extend(extra[:faltam])

    valid_adv = valid_adv[:50]
    valid_clin = valid_clin[:50]

    # Salvar
    data['advogados'] = {'total_coletados': len(valid_adv), 'total_validados': len(valid_adv), 'entregues': len(valid_adv), 'leads': valid_adv}
    data['clinicas'] = {'total_coletados': len(valid_clin), 'total_validados': len(valid_clin), 'entregues': len(valid_clin), 'leads': valid_clin}
    data['data_geracao'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("\n--- Gerando PDF ---", flush=True)
    generate_pdf(data)

    elapsed = time.time() - start
    print(f"\nFINAL: {len(valid_adv)} adv | {len(valid_clin)} clin", flush=True)
    print(f"Tempo: {elapsed/60:.1f} min", flush=True)
    print("=" * 60, flush=True)


if __name__ == '__main__':
    asyncio.run(main())
