import asyncio, json, re, random
from urllib.parse import quote
from playwright.async_api import async_playwright

async def main():
    with open(r"C:\Users\T-GAMER\fluxo de agentes\leads_novos_maps.json", "r", encoding="utf-8-sig") as f:
        data = json.load(f)

    existing_names = set(l["nome"].strip().lower() for l in data["advogados"]["leads"])
    existing_phones = set()
    for l in data["advogados"]["leads"] + data["clinicas"]["leads"]:
        p = re.sub(r"\D", "", l.get("whatsapp_number", ""))
        if p: existing_phones.add(p)

    FIRM_KW = ["&", "advogados", "advogadas", "associad", "sociedade", "firma", "escritorio", "consultoria"]

    def is_firm(name):
        n = name.lower()
        if "&" in name: return True
        for kw in FIRM_KW:
            if kw in n: return True
        return False

    def is_solo(name):
        n = name.lower()
        if not any(w in n for w in ["advoc", "advogad", "direito", "juridic", "oab"]): return False
        if is_firm(name): return False
        if any(w in n for w in ["dentista", "odontol", "clinica", "implante"]): return False
        return True

    new_adv = []
    cities = ["Aracaju, SE", "Feira de Santana, BA", "Maceio, AL", "Teresina, PI", "Natal, RN"]
    random.shuffle(cities)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=["--no-sandbox"])
        ctx = await browser.new_context(viewport={"width": 1920, "height": 1080},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        page = await ctx.new_page()

        for city in cities:
            if len(new_adv) >= 5: break
            query = f"advogado familiar em {city}"
            url = f"https://www.google.com/maps/search/{quote(query)}"
            try:
                await page.goto(url, timeout=15000)
                await page.wait_for_timeout(2500)
                for _ in range(3):
                    await page.evaluate("window.scrollBy(0, 600)")
                    await page.wait_for_timeout(400)
                cards = await page.query_selector_all("div.Nv2PK")
                for card in cards[:8]:
                    if len(new_adv) >= 5: break
                    try:
                        el = await card.query_selector("a.hfpxzc")
                        href = await el.get_attribute("href") if el else None
                        if not href: continue
                        nel = await card.query_selector("div.qBF1Pd")
                        name = await nel.inner_text() if nel else ""
                        if not name or name.strip().lower() in existing_names: continue
                        if not is_solo(name): continue
                        await page.goto(href, timeout=10000)
                        await page.wait_for_timeout(1500)
                        h1 = await page.query_selector("h1")
                        real_name = await h1.inner_text() if h1 else name
                        if real_name.strip().lower() in existing_names: continue
                        if not is_solo(real_name): continue
                        content = await page.content()
                        text = await page.evaluate("() => document.body.innerText")

                        wa = None
                        for pat in [r"(https?://api\.whatsapp\.com/send\?phone=\d+)", r"(https?://wa\.me/\d+)"]:
                            m = re.search(pat, content)
                            if m:
                                wa = m.group(1) if m.group(1).startswith("http") else "https://" + m.group(1)
                                break
                        if not wa:
                            lps = await page.evaluate("() => Array.from(document.querySelectorAll('a[href]')).map(a=>a.href)")
                            for h in lps:
                                if "wa.me" in h or "whatsapp.com" in h: wa = h; break
                        if not wa: continue

                        has_site = False
                        lps = await page.evaluate("() => Array.from(document.querySelectorAll('a[href]')).map(a=>a.href)")
                        for h in lps:
                            if "http" in h and "google" not in h and "gstatic" not in h and "maps" not in h:
                                has_site = True; break
                        if has_site: continue

                        phones = re.findall(r"\(\d{2}\)\s*9\d{4}[\s-]?\d{4}", text)
                        phone = phones[0] if phones else ""
                        wan = re.search(r"(\d{10,13})", wa)
                        wan = wan.group(1) if wan else None
                        cp = wan or re.sub(r"\D", "", phone)
                        if cp in existing_phones: continue
                        existing_phones.add(cp)
                        existing_names.add(real_name.strip().lower())

                        new_adv.append({
                            "nome": real_name, "telefone": phone,
                            "whatsapp_link": wa if wa.startswith("http") else f"https://{wa}",
                            "whatsapp_number": wan or phone, "cidade": city,
                            "tipo": "advogado", "avaliacao": "", "link_maps": href, "tem_site": False
                        })
                        print(f"  OK {len(new_adv)}: {real_name[:50]}")
                    except:
                        pass
                    await page.wait_for_timeout(300)
            except:
                pass
            await page.wait_for_timeout(300)
        await browser.close()

    data["advogados"]["leads"].extend(new_adv[:3])
    data["advogados"]["leads"] = data["advogados"]["leads"][:50]
    data["advogados"]["total_validados"] = len(data["advogados"]["leads"])
    data["advogados"]["entregues"] = len(data["advogados"]["leads"])

    with open(r"C:\Users\T-GAMER\fluxo de agentes\leads_novos_maps.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"FINAL: {len(data['advogados']['leads'])} adv | {len(data['clinicas']['leads'])} clin")

asyncio.run(main())
