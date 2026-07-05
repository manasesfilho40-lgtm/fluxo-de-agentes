import asyncio
import json
import os
import re
import sys
import time
import random
import codecs
import aiohttp
from datetime import datetime
from urllib.parse import quote
from playwright.async_api import async_playwright

sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')

BASE_DIR = r"C:\Users\T-GAMER\fluxo de agentes"
LINKS_FILE = os.path.join(BASE_DIR, "links_ja_coletados.txt")
OLD_FILES = [
    os.path.join(BASE_DIR, "advogados_50_final_v2.json"),
    os.path.join(BASE_DIR, "clinicas_50_final_v2.json"),
    os.path.join(BASE_DIR, "leads_passados\\leads_compilados.json"),
    os.path.join(BASE_DIR, "leads_passados\\leads_100_validos.json"),
]

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


def load_seen():
    if os.path.exists(LINKS_FILE):
        with open(LINKS_FILE, 'r', encoding='utf-8') as f:
            return set(l.strip() for l in f if l.strip())
    return set()

def save_seen(link):
    with open(LINKS_FILE, 'a', encoding='utf-8') as f:
        f.write(link + '\n')

def load_old():
    names, phones, maps = set(), set(), set()
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
                m = it.get("link_maps") or it.get("maps_link") or ""
                if m: maps.add(m.strip())
        except: pass
    return names, phones, maps

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


async def maps_search(page, search_term, city, seen):
    """Busca rapida no Maps, retorna lista de leads"""
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
                if not href or href in seen: continue
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
            except: continue
    except: pass
    return results


async def detail_lead(page, lead, old_n, old_p, old_m):
    """Detalha um lead: abre Maps, extrai WhatsApp/site. Retorna lead validado ou None"""
    nome = lead.get('nome', '')
    link = lead.get('link_maps', '')
    if nome.strip().lower() in old_n: return None
    if link in old_m: return None
    try:
        await page.goto(link, timeout=12000)
        await page.wait_for_timeout(1500)
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
    except: pass
    return None


def _save_progress(val_adv, val_clin, raw_adv_count, raw_clin_count):
    """Salva progresso parcial"""
    output = {
        "data_geracao": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "advogados": {"total_coletados": raw_adv_count, "total_validados": len(val_adv), "entregues": len(val_adv), "leads": val_adv[:50]},
        "clinicas": {"total_coletados": raw_clin_count, "total_validados": len(val_clin), "entregues": len(val_clin), "leads": val_clin[:50]},
    }
    out_path = os.path.join(BASE_DIR, "leads_novos_maps.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)


async def main():
    start = time.time()
    print("=" * 60, flush=True)
    print("  BUSCA DE LEADS v5 - Rapida", flush=True)
    print(f"  {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}", flush=True)
    print("=" * 60, flush=True)

    seen = load_seen()
    old_n, old_p, old_m = load_old()
    print(f"Vistos: {len(seen)} | Antigos: {len(old_n)} nomes", flush=True)

    cities = CIDADES[:]
    random.shuffle(cities)

    # Montar tasks embaralhadas
    tasks_adv = [(q, c) for c in cities for q in QUERIES_ADV]
    tasks_clin = [(q, c) for c in cities for q in QUERIES_CLIN]
    random.shuffle(tasks_adv)
    random.shuffle(tasks_clin)

    val_adv = []
    val_clin = []
    raw_adv = []
    raw_clin = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=['--no-sandbox', '--disable-dev-shm-usage'])

        # === ADVOGADOS ===
        print("\n--- ADVOGADOS ---", flush=True)
        ctx = await browser.new_context(viewport={"width": 1920, "height": 1080},
            user_agent=f"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{120+random.randint(0,5)}.0.0.0 Safari/537.36")
        page = await ctx.new_page()

        for st, city in tasks_adv:
            if len(raw_adv) >= 250: break
            results = await maps_search(page, st, city, seen)
            raw_adv.extend(results)
            if results:
                print(f"  [BUSCA] {st} {city} -> {len(results)} novos (total: {len(raw_adv)})", flush=True)
            await page.wait_for_timeout(300)

        print(f"\n  Bruto adv: {len(raw_adv)}", flush=True)
        print(f"  Detalhando...", flush=True)

        for lead in raw_adv:
            if len(val_adv) >= 55: break
            v = await detail_lead(page, lead, old_n, old_p, old_m)
            if v:
                old_p.add(v['whatsapp_number'])
                old_m.add(v['link_maps'])
                old_n.add(v['nome'].strip().lower())
                val_adv.append(v)
                print(f"    ADV OK {len(val_adv)}/55 {v['nome'][:40]}", flush=True)
                # Salvar progresso imediatamente
                _save_progress(val_adv, val_clin, len(raw_adv), len(raw_clin))
            await page.wait_for_timeout(300)

        await page.close()
        await ctx.close()

        # === CLINICAS ===
        print("\n--- CLINICAS ---", flush=True)
        ctx2 = await browser.new_context(viewport={"width": 1920, "height": 1080},
            user_agent=f"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{120+random.randint(0,5)}.0.0.0 Safari/537.36")
        page2 = await ctx2.new_page()

        raw_clin = []
        for st, city in tasks_clin:
            if len(raw_clin) >= 250: break
            results = await maps_search(page2, st, city, seen)
            raw_clin.extend(results)
            if results:
                print(f"  [BUSCA] {st} {city} -> {len(results)} novos (total: {len(raw_clin)})", flush=True)
            await page2.wait_for_timeout(300)

        print(f"\n  Bruto clin: {len(raw_clin)}", flush=True)
        print(f"  Detalhando...", flush=True)

        for lead in raw_clin:
            if len(val_clin) >= 55: break
            v = await detail_lead(page2, lead, old_n, old_p, old_m)
            if v:
                old_p.add(v['whatsapp_number'])
                old_m.add(v['link_maps'])
                old_n.add(v['nome'].strip().lower())
                val_clin.append(v)
                print(f"    CLIN OK {len(val_clin)}/55 {v['nome'][:40]}", flush=True)
                # Salvar progresso imediatamente
                _save_progress(val_adv, val_clin, len(raw_adv), len(raw_clin))
            await page2.wait_for_timeout(300)

        await page2.close()
        await ctx2.close()
        await browser.close()

    val_adv = val_adv[:50]
    val_clin = val_clin[:50]

    print(f"\n  FINAL: {len(val_adv)} adv | {len(val_clin)} clin", flush=True)

    output = {
        "data_geracao": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "advogados": {"total_coletados": len(val_adv), "total_validados": len(val_adv), "entregues": len(val_adv), "leads": val_adv},
        "clinicas": {"total_coletados": len(val_clin), "total_validados": len(val_clin), "entregues": len(val_clin), "leads": val_clin},
    }

    out_path = os.path.join(BASE_DIR, "leads_novos_maps.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    elapsed = time.time() - start
    print(f"\n  Salvo: {out_path}", flush=True)
    print(f"  Tempo: {elapsed/60:.1f} min", flush=True)
    print("=" * 60, flush=True)


if __name__ == '__main__':
    asyncio.run(main())
