import asyncio, json, os, re, sys, time, random, codecs
from datetime import datetime
from urllib.parse import quote
from playwright.async_api import async_playwright

sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
BASE_DIR = r"C:\Users\T-GAMER\fluxo de agentes"
OUTPUT_FILE = os.path.join(BASE_DIR, "leads_novos_maps.json")

with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
    data = json.load(f)
val_adv = data['advogados']['leads']
val_clin = data['clinicas']['leads']

old_n = set()
old_p = set()
for v in val_adv + val_clin:
    old_n.add(v['nome'].strip().lower())
    p = re.sub(r'\D', '', v.get('whatsapp_number', ''))
    if p: old_p.add(p)

for fp in ['advogados_50_final_v2.json', 'clinicas_50_final_v2.json']:
    fp2 = os.path.join(BASE_DIR, fp)
    if os.path.exists(fp2):
        with open(fp2, 'r', encoding='utf-8') as f:
            d = json.load(f)
        items = d if isinstance(d, list) else d.get('leads', [])
        for it in items:
            n = (it.get('nome') or '').strip().lower()
            if n: old_n.add(n)
            p = re.sub(r'\D', '', it.get('telefone', '') or it.get('whatsapp', ''))
            if p and len(p) >= 10: old_p.add(p)

print(f"Adv: {len(val_adv)} | Clin: {len(val_clin)}", flush=True)

def find_wa(text):
    for pat in [r'(https?://api\.whatsapp\.com/send\?phone=\d+)', r'(https?://wa\.me/\d+)']:
        m = re.search(pat, text)
        if m:
            return m.group(1) if m.group(1).startswith('http') else 'https://' + m.group(1)
    return None

def wa_number(link):
    m = re.search(r'(\d{10,13})', link)
    return m.group(1) if m else None

def norm_phone(p):
    d = re.sub(r'\D', '', p)
    return d if len(d) >= 10 else None

JS_GET_LINKS = "() => Array.from(document.querySelectorAll('a[href]')).map(a=>({h:a.href,t:a.innerText}))"

async def main():
    global val_clin
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=['--no-sandbox'])
        ctx = await browser.new_context(viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
        page = await ctx.new_page()

        queries = [
            ('clinica odontologica', 'Chapeco, SC'),
            ('clinica dentaria', 'Pelotas, RS'),
            ('consultorio odontologico', 'Macapa, AP'),
            ('dentista', 'Rio Branco, AC'),
            ('clinica ortodontia', 'Gurupi, TO'),
            ('clinica implante dentario', 'Araguaina, TO'),
            ('dentista emergencia', 'Palmas, TO'),
            ('clinica protese dentaria', 'Porto Nacional, TO'),
        ]

        for st, city in queries:
            if len(val_clin) >= 50: break
            query = f"{st} em {city}"
            url = f"https://www.google.com/maps/search/{quote(query)}"
            try:
                await page.goto(url, timeout=15000)
                await page.wait_for_timeout(2000)
                for _ in range(3):
                    await page.evaluate("window.scrollBy(0, 600)")
                    await page.wait_for_timeout(400)
                cards = await page.query_selector_all('div.Nv2PK')
                for card in cards[:12]:
                    if len(val_clin) >= 50: break
                    try:
                        el = await card.query_selector('a.hfpxzc')
                        href = await el.get_attribute('href') if el else None
                        if not href: continue
                        await page.goto(href, timeout=10000)
                        await page.wait_for_timeout(1200)
                        nome_el = await page.query_selector('h1')
                        nome = await nome_el.inner_text() if nome_el else ''
                        if nome.strip().lower() in old_n: continue
                        content = await page.content()
                        text = await page.evaluate("() => document.body.innerText")
                        phones = re.findall(r'\(\d{2}\)\s*9\d{4}[\s-]?\d{4}', text)
                        phones += re.findall(r'\(\d{2}\)\s*\d{4,5}[\s-]?\d{4}', text)
                        wa = find_wa(content) or find_wa(text)
                        links_page = await page.evaluate(JS_GET_LINKS)
                        has_site = False
                        wa_found = []
                        for lp in links_page:
                            h, t = lp.get('h', ''), lp.get('t', '')
                            if 'wa.me' in h or 'whatsapp.com' in h or 'whatsapp' in t.lower():
                                wa_found.append(h)
                            elif 'http' in h and 'google' not in h and 'gstatic' not in h and 'maps' not in h:
                                has_site = True
                        if not wa and wa_found: wa = wa_found[0]
                        if not wa:
                            btns = await page.query_selector_all('[data-item-id*="whatsapp"], [aria-label*="WhatsApp"]')
                            for b in btns:
                                try:
                                    bh = await b.get_attribute('href')
                                    if bh and ('wa.me' in bh or 'whatsapp' in bh):
                                        wa = bh; break
                                except: pass
                        phone = norm_phone(phones[0]) if phones else None
                        wan = wa_number(wa) if wa else None
                        if wa and not has_site:
                            cp = wan or phone
                            if cp and cp not in old_p:
                                old_p.add(cp)
                                old_n.add(nome.strip().lower())
                                val_clin.append({
                                    'nome': nome,
                                    'telefone': f"({phone[:2]}) {phone[2:7]}-{phone[7:]}" if phone and len(phone) >= 11 else phone,
                                    'whatsapp_link': wa if wa.startswith('http') else f'https://{wa}',
                                    'whatsapp_number': wan or phone,
                                    'cidade': city, 'tipo': 'clinica', 'avaliacao': '',
                                    'link_maps': href, 'tem_site': False,
                                })
                                print(f"  CLIN OK {len(val_clin)}/50 {nome[:40]}", flush=True)
                    except: pass
                    await page.wait_for_timeout(300)
            except: pass
            await page.wait_for_timeout(300)

        await browser.close()

    val_clin = val_clin[:50]
    data['clinicas'] = {'total_coletados': len(val_clin), 'total_validados': len(val_clin), 'entregues': len(val_clin), 'leads': val_clin}
    data['data_geracao'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"\nFinal: Adv {len(val_adv)} | Clin {len(val_clin)}", flush=True)

asyncio.run(main())
