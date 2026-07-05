import asyncio, json, re
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

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=["--no-sandbox"])
        ctx = await browser.new_context(viewport={"width": 1920, "height": 1080}, user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        page = await ctx.new_page()
        url = "https://www.google.com/maps/search/" + quote("advogado trabalhista em Joao Pessoa, PB")
        await page.goto(url, timeout=15000)
        await page.wait_for_timeout(2500)
        for _ in range(3):
            await page.evaluate("window.scrollBy(0, 600)")
            await page.wait_for_timeout(400)
        cards = await page.query_selector_all("div.Nv2PK")
        for card in cards[:10]:
            try:
                el = await card.query_selector("a.hfpxzc")
                href = await el.get_attribute("href") if el else None
                if not href: continue
                nel = await card.query_selector("div.qBF1Pd")
                name = await nel.inner_text() if nel else ""
                if not name or name.strip().lower() in existing_names: continue
                n = name.lower()
                if not any(w in n for w in ["advoc", "advogad", "direito"]): continue
                if "&" in name or any(w in n for w in ["advogados", "advogadas", "associad", "sociedade"]): continue
                await page.goto(href, timeout=10000)
                await page.wait_for_timeout(1500)
                h1 = await page.query_selector("h1")
                rn = await h1.inner_text() if h1 else name
                if rn.strip().lower() in existing_names: continue
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
                        if "wa.me" in h or "whatsapp.com" in h:
                            wa = h
                            break
                if not wa:
                    continue
                has_site = False
                lps2 = await page.evaluate("() => Array.from(document.querySelectorAll('a[href]')).map(a=>a.href)")
                for h in lps2:
                    if "http" in h and "google" not in h and "gstatic" not in h and "maps" not in h:
                        has_site = True
                        break
                if has_site:
                    continue
                phones = re.findall(r"\(\d{2}\)\s*9\d{4}[\s-]?\d{4}", text)
                phone = phones[0] if phones else ""
                wan = re.search(r"(\d{10,13})", wa)
                wan = wan.group(1) if wan else None
                cp = wan or re.sub(r"\D", "", phone)
                if cp in existing_phones:
                    continue
                data["advogados"]["leads"].append({
                    "nome": rn, "telefone": phone,
                    "whatsapp_link": wa if wa.startswith("http") else f"https://{wa}",
                    "whatsapp_number": wan or phone, "cidade": "Joao Pessoa, PB",
                    "tipo": "advogado", "avaliacao": "", "link_maps": href, "tem_site": False
                })
                print(f"OK: {rn}")
                break
            except:
                pass
            await page.wait_for_timeout(300)
        await browser.close()

    data["advogados"]["total_validados"] = len(data["advogados"]["leads"])
    data["advogados"]["entregues"] = len(data["advogados"]["leads"])
    with open(r"C:\Users\T-GAMER\fluxo de agentes\leads_novos_maps.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"FINAL: {len(data['advogados']['leads'])} adv | {len(data['clinicas']['leads'])} clin")

asyncio.run(main())
