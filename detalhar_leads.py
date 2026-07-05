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
LINKS_FILE = os.path.join(BASE_DIR, "links_ja_coletados.txt")
OUTPUT_FILE = os.path.join(BASE_DIR, "leads_novos_maps.json")
OLD_FILES = [
    os.path.join(BASE_DIR, "advogados_50_final_v2.json"),
    os.path.join(BASE_DIR, "clinicas_50_final_v2.json"),
    os.path.join(BASE_DIR, "leads_passados\\leads_compilados.json"),
    os.path.join(BASE_DIR, "leads_passados\\leads_100_validos.json"),
]

WORKERS = 5

def load_old():
    names, phones = set(), set()
    # Arquivos antigos
    for fp in OLD_FILES:
        if not os.path.exists(fp): continue
        try:
            with open(fp, 'r', encoding='utf-8') as f:
                data = json.load(f)
            items = data if isinstance(data, list) else data.get("leads", [])
            for it in items:
                n = (it.get("nome") or "").strip().lower()
                if n: names.add(n)
                p = re.sub(r'\D', '', it.get("telefone", "") or it.get("whatsapp", ""))
                if p and len(p) >= 10: phones.add(p)
        except: pass
    # Progresso da sessao
    if os.path.exists(OUTPUT_FILE):
        try:
            with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
            for cat in ['advogados', 'clinicas']:
                for it in data.get(cat, {}).get("leads", []):
                    n = (it.get("nome") or "").strip().lower()
                    if n: names.add(n)
                    p = re.sub(r'\D', '', it.get("whatsapp_number", ""))
                    if p: phones.add(p)
        except: pass
    return names, phones

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


async def detail_worker(browser, worker_id, links_chunk, old_n, old_p, validated, lock, max_val):
    ctx = await browser.new_context(viewport={"width": 1920, "height": 1080},
        user_agent=f"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{120+random.randint(0,5)}.0.0.0 Safari/537.36")
    page = await ctx.new_page()

    for link in links_chunk:
        async with lock:
            if len(validated) >= max_val:
                break

        try:
            await page.goto(link, timeout=10000)
            await page.wait_for_timeout(1200)

            # Pegar nome do Maps
            nome_el = await page.query_selector('h1')
            nome = await nome_el.inner_text() if nome_el else ""

            async with lock:
                if nome.strip().lower() in old_n:
                    continue

            content = await page.content()
            text = await page.evaluate("() => document.body.innerText")

            phones = re.findall(r'\(\d{2}\)\s*9\d{4}[\s-]?\d{4}', text)
            phones += re.findall(r'\(\d{2}\)\s*\d{4,5}[\s-]?\d{4}', text)

            wa = find_wa(content) or find_wa(text)

            links_page = await page.evaluate("""() => Array.from(document.querySelectorAll('a[href]')).map(a=>({h:a.href,t:a.innerText}))""")
            has_site = False
            wa_found = []
            for lp in links_page:
                h, t = lp.get('h',''), lp.get('t','')
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
                async with lock:
                    if cp and cp not in old_p and len(validated) < max_val:
                        old_p.add(cp)
                        old_n.add(nome.strip().lower())
                        # Detectar tipo
                        tipo = "advogado" if any(w in nome.lower() for w in ['advoc', 'advogad', 'direito']) else "clinica"
                        validated.append({
                            'nome': nome,
                            'telefone': f"({phone[:2]}) {phone[2:7]}-{phone[7:]}" if phone and len(phone) >= 11 else phone,
                            'whatsapp_link': wa if wa.startswith('http') else f'https://{wa}',
                            'whatsapp_number': wan or phone,
                            'cidade': '',
                            'tipo': tipo,
                            'avaliacao': '',
                            'link_maps': link,
                            'tem_site': False,
                        })
                        print(f"  [W{worker_id}] OK {len(validated)}/{max_val} {tipo[:4]} {nome[:40]}", flush=True)
        except: pass
        await page.wait_for_timeout(200 + random.randint(0, 200))

    await page.close()
    await ctx.close()


async def main():
    start = time.time()
    print("=" * 60, flush=True)
    print("  DETALHADOR PARALELO DE LEADS", flush=True)
    print(f"  {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}", flush=True)
    print("=" * 60, flush=True)

    # Carregar links do Maps
    with open(LINKS_FILE, 'r', encoding='utf-8') as f:
        all_links = [l.strip() for l in f if l.strip()]
    maps_links = list(set(l for l in all_links if 'google.com/maps/place' in l))
    random.shuffle(maps_links)
    print(f"Links do Maps: {len(maps_links)}", flush=True)

    old_n, old_p = load_old()
    print(f"Antigos: {len(old_n)} nomes, {len(old_p)} telefones", flush=True)

    # Carregar progresso atual
    validated = []
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        val_adv = data.get('advogados', {}).get('leads', [])
        val_clin = data.get('clinicas', {}).get('leads', [])
        validated = val_adv + val_clin
        print(f"Progresso anterior: {len(val_adv)} adv + {len(val_clin)} clin", flush=True)

    TARGET = 110  # 55 de cada
    remaining = max(0, TARGET - len(validated))
    print(f"Faltam: {remaining} leads", flush=True)

    if remaining <= 0:
        print("Ja temos leads suficientes!", flush=True)
    else:
        # Dividir links entre workers
        links_per_worker = max(1, len(maps_links) // WORKERS)
        chunks = [maps_links[i:i+links_per_worker] for i in range(0, len(maps_links), links_per_worker)]
        chunks = [c for c in chunks if c][:WORKERS]

        lock = asyncio.Lock()

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True, args=['--no-sandbox', '--disable-dev-shm-usage'])
            print(f"\nIniciando {len(chunks)} workers...", flush=True)

            jobs = [detail_worker(browser, i, c, old_n, old_p, validated, lock, TARGET) for i, c in enumerate(chunks)]
            await asyncio.gather(*jobs)
            await browser.close()

    # Separar e salvar
    val_adv = [v for v in validated if v.get('tipo') == 'advogado'][:50]
    val_clin = [v for v in validated if v.get('tipo') == 'clinica'][:50]

    output = {
        "data_geracao": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "advogados": {"total_coletados": len(val_adv), "total_validados": len(val_adv), "entregues": len(val_adv), "leads": val_adv},
        "clinicas": {"total_coletados": len(val_clin), "total_validados": len(val_clin), "entregues": len(val_clin), "leads": val_clin},
    }

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    elapsed = time.time() - start
    print(f"\n  Adv: {len(val_adv)} | Clin: {len(val_clin)}", flush=True)
    print(f"  Salvo: {OUTPUT_FILE}", flush=True)
    print(f"  Tempo: {elapsed/60:.1f} min", flush=True)
    print("=" * 60, flush=True)


if __name__ == '__main__':
    asyncio.run(main())
