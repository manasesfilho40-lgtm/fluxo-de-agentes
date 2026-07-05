import asyncio, json, os, re, sys, time, random, codecs
from datetime import datetime
from urllib.parse import quote
from playwright.async_api import async_playwright

sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
BASE_DIR = r"C:\Users\T-GAMER\fluxo de agentes"
OUTPUT_FILE = os.path.join(BASE_DIR, "leads_novos_maps.json")
LINKS_FILE = os.path.join(BASE_DIR, "links_ja_coletados.txt")

FIRM_KW = ['&', 'advogados', 'advogadas', 'associad', 'sociedade', 'firma', 'escritorio', 'consultoria']

def is_firm(name):
    n = name.lower()
    if '&' in name: return True
    if re.search(r'\w+,\s*\w+\s+e\s+\w+', name): return True
    for kw in FIRM_KW:
        if kw in n: return True
    return False

def is_solo_lawyer(name):
    """Verifica se parece advogado individual"""
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

async def main():
    print("=== BUSCAR 10 ADVOGADOS INDIVIDUAIS ===", flush=True)

    with open(OUTPUT_FILE, 'r', encoding='utf-8-sig') as f:
        data = json.load(f)

    existing_names = set(l['nome'].strip().lower() for l in data['advogados']['leads'])
    existing_phones = set()
    for l in data['advogados']['leads'] + data['clinicas']['leads']:
        p = re.sub(r'\D', '', l.get('whatsapp_number', ''))
        if p: existing_phones.add(p)

    print(f"Existentes: {len(existing_names)} nomes, {len(existing_phones)} phones", flush=True)
    print(f"Faltam: {50 - len(data['advogados']['leads'])} advogados", flush=True)

    # Cidades para buscar
    cities = [
        "Marilia, SP", "Presidente Prudente, SP", "Sao Jose do Rio Preto, SP",
        "Piracicaba, SP", "Bauru, SP", "Sorocaba, SP", "Jundiai, SP",
        "Santos, SP", "Ribeirao Preto, SP", "Campinas, SP",
        "Chapeco, SC", "Itajai, SC", "Cascavel, PR",
        "Guarapuava, PR", "Foz do Iguacu, PR",
        "Palmas, TO", "Gurupi, TO", "Araguaina, TO",
        "Macapa, AP", "Rio Branco, AC",
        "Mogi das Cruzes, SP", "Diadema, SP",
    ]
    random.shuffle(cities)

    queries = [
        "advogado trabalhista", "advogado civil", "advogado familia",
        "advogado criminal", "advogado previdenciario", "advogado tributarista",
        "advogado empresarial", "advogado do consumidor",
    ]

    new_adv = []
    old_n = set(existing_names)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=['--no-sandbox'])
        ctx = await browser.new_context(viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
        page = await ctx.new_page()

        for city in cities:
            if len(new_adv) >= 15:
                break
            for q in queries:
                if len(new_adv) >= 15:
                    break
                query = f"{q} em {city}"
                url = f"https://www.google.com/maps/search/{quote(query)}"
                try:
                    await page.goto(url, timeout=15000)
                    await page.wait_for_timeout(2000)
                    for _ in range(3):
                        await page.evaluate("window.scrollBy(0, 600)")
                        await page.wait_for_timeout(400)
                    cards = await page.query_selector_all('div.Nv2PK')
                    for card in cards[:10]:
                        if len(new_adv) >= 15:
                            break
                        try:
                            el = await card.query_selector('a.hfpxzc')
                            href = await el.get_attribute('href') if el else None
                            if not href: continue
                            nel = await card.query_selector('div.qBF1Pd')
                            name = await nel.inner_text() if nel else ''
                            if not name or name.strip().lower() in old_n: continue
                            if not is_solo_lawyer(name): continue
                            # Abrir e verificar
                            await page.goto(href, timeout=10000)
                            await page.wait_for_timeout(1200)
                            h1 = await page.query_selector('h1')
                            real_name = await h1.inner_text() if h1 else name
                            if real_name.strip().lower() in old_n: continue
                            if not is_solo_lawyer(real_name): continue
                            content = await page.content()
                            text = await page.evaluate("() => document.body.innerText")
                            # WhatsApp
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
                            if not wa: continue
                            # Site
                            has_site = False
                            lps = await page.evaluate("() => Array.from(document.querySelectorAll('a[href]')).map(a=>a.href)")
                            for h in lps:
                                if 'http' in h and 'google' not in h and 'gstatic' not in h and 'maps' not in h:
                                    has_site = True; break
                            if has_site: continue
                            # Telefone
                            phones = re.findall(r'\(\d{2}\)\s*9\d{4}[\s-]?\d{4}', text)
                            phone = phones[0] if phones else ''
                            wan = re.search(r'(\d{10,13})', wa)
                            wan = wan.group(1) if wan else None
                            cp = wan or re.sub(r'\D', '', phone)
                            if cp in existing_phones: continue
                            existing_phones.add(cp)
                            old_n.add(real_name.strip().lower())
                            new_adv.append({
                                'nome': real_name,
                                'telefone': phone,
                                'whatsapp_link': wa if wa.startswith('http') else f'https://{wa}',
                                'whatsapp_number': wan or phone,
                                'cidade': city,
                                'tipo': 'advogado',
                                'avaliacao': '',
                                'link_maps': href,
                                'tem_site': False,
                            })
                            print(f"  OK {len(new_adv)}/15 {real_name[:45]}", flush=True)
                        except: pass
                        await page.wait_for_timeout(300)
                except: pass
                await page.wait_for_timeout(300)

        await browser.close()

    # Adicionar ao data
    data['advogados']['leads'].extend(new_adv[:10])
    data['advogados']['leads'] = data['advogados']['leads'][:50]
    data['advogados']['total_validados'] = len(data['advogados']['leads'])
    data['advogados']['entregues'] = len(data['advogados']['leads'])
    data['data_geracao'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\nFINAL: {len(data['advogados']['leads'])} adv | {len(data['clinicas']['leads'])} clin", flush=True)

    # Gerar PDF
    sys.path.insert(0, BASE_DIR)
    from gerar_pdf_leads import generate_pdf
    generate_pdf(data)

asyncio.run(main())
