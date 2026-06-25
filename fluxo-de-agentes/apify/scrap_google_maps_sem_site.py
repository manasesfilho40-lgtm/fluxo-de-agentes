import asyncio
import json
import os
import re
import random
from datetime import datetime
from playwright.async_api import async_playwright

# ============================================================
# CIDADES PARA BUSCAR
# ============================================================
CIDADES = [
    # Grandes cidades
    ("Sao Paulo", -23.5505, -46.6333),
    ("Rio de Janeiro", -22.9068, -43.1729),
    ("Belo Horizonte", -19.9167, -43.9345),
    ("Curitiba", -25.4284, -49.2733),
    ("Salvador", -12.9714, -38.5124),
    ("Fortaleza", -3.7172, -38.5433),
    ("Recife", -8.0476, -34.877),
    ("Porto Alegre", -30.0346, -51.2177),
    ("Brasilia", -15.7975, -47.8919),
    ("Manaus", -3.119, -60.0217),
    ("Goiania", -16.6869, -49.2648),
    ("Belem", -1.4558, -48.5024),
    ("Guarulhos", -23.4538, -46.5333),
    ("Campinas", -22.9099, -47.0626),
    # Cidades medias
    ("Sao Luis", -2.5297, -44.2825),
    ("Maceio", -9.6658, -35.7353),
    ("Campo Grande", -20.4697, -54.6201),
    ("Teresina", -5.0892, -42.8019),
    ("Joao Pessoa", -7.1195, -34.845),
    ("Natal", -5.7945, -35.211),
    ("Cuiaba", -15.6014, -56.0979),
    ("Aracaju", -10.9091, -37.0677),
    ("Florianopolis", -27.5954, -48.548),
    ("Vitoria", -20.3155, -40.3128),
    # Interior
    ("Santos", -23.9608, -46.3336),
    ("Ribeirao Preto", -21.1767, -47.8208),
    ("Uberlandia", -18.9186, -48.2772),
    ("Juiz de Fora", -21.7595, -43.3496),
    ("Joinville", -26.3045, -48.8487),
    ("Blumenau", -26.9194, -49.0661),
    ("Niteroi", -22.8833, -43.1036),
    ("Feira de Santana", -12.2664, -38.9663),
    ("Londrina", -23.3045, -51.1696),
    ("Maringa", -23.4205, -51.9333),
    ("Bauru", -22.3147, -49.0606),
    ("Sorocaba", -23.5208, -47.4588),
    ("Sao Jose dos Campos", -23.1791, -45.8872),
]

BUSCAS = [
    "pet shop banho e tosa",
    "clinica odontologica",
    "dentista",
    "pet shop delivery",
    "tosa higienica",
]

# Output
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "dados")
os.makedirs(OUTPUT_DIR, exist_ok=True)

async def buscar_no_maps(page, busca, lat, lng, cidade):
    """Busca no Google Maps e retorna os resultados"""
    url = f"https://www.google.com/maps/search/{busca.replace(' ', '+')}+{cidade.replace(' ', '+')}/@{lat},{lng},13z"
    
    try:
        await page.goto(url, wait_until="networkidle", timeout=30000)
        await asyncio.sleep(random.uniform(2, 4))
        
        # Scroll no feed para carregar mais resultados
        feed = await page.query_selector('[role="feed"]')
        if feed:
            for _ in range(5):  # Scroll 5 vezes
                await feed.evaluate("el => el.scrollTop = el.scrollHeight")
                await asyncio.sleep(random.uniform(1.5, 3))
        
        # Extrair dados do HTML
        html = await page.content()
        
        # Encontrar nomes
        name_patterns = [
            r'class="[^"]*qBF1Pd[^"]*"[^>]*>([^<]+)<',
            r'class="[^"]*fontHeadlineSmall[^"]*"[^>]*>([^<]+)<',
            r'aria-label="([^"]+)"[^>]*class="[^"]*fontHeadline',
        ]
        
        names = set()
        for pattern in name_patterns:
            for match in re.finditer(pattern, html):
                name = match.group(1).strip()
                if len(name) > 3 and len(name) < 200 and "estrela" not in name.lower():
                    names.add(name)
        
        # Encontrar telefones
        phones = set()
        for match in re.finditer(r'\(\d{2}\)\s*\d{4,5}-?\d{4}', html):
            phones.add(match.group(0))
        
        # Encontrar enderecos
        addresses = set()
        for match in re.finditer(r'(?:Rua|Av\.|Avenida|Al\.|Alameda|Trav\.|Travessa|R\.|Pça\.|Praça|Rod\.|Rodovia)[^<]{10,100}', html):
            addr = match.group(0).strip()
            if len(addr) < 150:
                addresses.add(addr)
        
        # Montar resultados
        results = []
        names_list = list(names)
        phones_list = list(phones)
        
        for i, name in enumerate(names_list):
            phone = phones_list[i] if i < len(phones_list) else ""
            results.append({
                "nome": name,
                "telefone": phone,
                "cidade": cidade,
                "busca": busca,
            })
        
        return results
        
    except Exception as e:
        print(f"  ERRO busca '{busca}' em {cidade}: {e}")
        return []

async def verificar_site(page, nome, cidade):
    """Clica em um resultado e verifica se tem site"""
    try:
        # Buscar pelo nome no Maps
        search_url = f"https://www.google.com/maps/search/{nome.replace(' ', '+')}+{cidade.replace(' ', '+')}"
        await page.goto(search_url, wait_until="networkidle", timeout=20000)
        await asyncio.sleep(random.uniform(2, 3))
        
        # Clicar no primeiro resultado
        first_result = await page.query_selector('[role="feed"] a[href*="/maps/place/"]')
        if first_result:
            await first_result.click()
            await asyncio.sleep(random.uniform(2, 3))
            
            # Verificar se tem link de site
            html = await page.content()
            
            # Procurar por links que NÃO sejam do Google Maps
            website_patterns = [
                r'href="(https?://(?!google\.com|goo\.gl|maps\.google)[^"]+)"',
                r'data-item-id="[^"]*website[^"]*"',
                r'"Website".*?href="(https?://[^"]+)"',
            ]
            
            has_website = False
            website_url = ""
            
            for pattern in website_patterns:
                match = re.search(pattern, html)
                if match:
                    has_website = True
                    website_url = match.group(1) if match.lastindex else ""
                    break
            
            # Procurar por horarios
            horarios = ""
            hours_match = re.search(r'(Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo).*?(Fechado|Aberto|\d{2}:\d{2})', html)
            if hours_match:
                horarios = "Encontrado"
            
            return has_website, website_url, horarios
        
        return False, "", ""
        
    except Exception as e:
        print(f"  ERRO ao verificar site de {nome}: {e}")
        return False, "", ""

async def main():
    print(f"{'='*60}")
    print(f"  GOOGLE MAPS SCRAPER - LEADS SEM SITE")
    print(f"  Data: {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    print(f"  Cidades: {len(CIDADES)}")
    print(f"  Buscas: {len(BUSCAS)}")
    print(f"{'='*60}")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=[
                '--no-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage',
            ]
        )
        
        context = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            locale="pt-BR",
        )
        
        page = await context.new_page()
        
        todos_leads = []
        leads_vistos = set()
        
        # Fase 1: Coletar nomes e telefones de varios bairros
        print(f"\n--- FASE 1: Coletando nomes e telefones ---")
        
        for cidade, lat, lng in CIDADES:
            for busca in BUSCAS:
                print(f"  Buscando: {busca} em {cidade}...")
                resultados = await buscar_no_maps(page, busca, lat, lng, cidade)
                
                for r in resultados:
                    key = f"{r['nome']}_{r['cidade']}"
                    if key not in leads_vistos:
                        leads_vistos.add(key)
                        r["tem_site"] = None  # Ainda nao verificado
                        r["url_site"] = ""
                        todos_leads.append(r)
                
                print(f"    Encontrados: {len(resultados)} | Total unicos: {len(todos_leads)}")
                
                # Pausa para evitar deteccao
                await asyncio.sleep(random.uniform(3, 6))
        
        print(f"\n--- FASE 1 COMPLETA: {len(todos_leads)} leads coletados ---")
        
        # Fase 2: Verificar site para cada lead (limitado a 200 para nao demorar muito)
        print(f"\n--- FASE 2: Verificando presenca de site ---")
        
        verificados = 0
        max_verificar = min(len(todos_leads), 200)
        
        for lead in todos_leads[:max_verificar]:
            tem_site, url, horarios = await verificar_site(page, lead["nome"], lead["cidade"])
            lead["tem_site"] = tem_site
            lead["url_site"] = url
            lead["horarios"] = horarios
            verificados += 1
            
            status = "✅ COM site" if tem_site else "❌ SEM site"
            print(f"  [{verificados}/{max_verificar}] {lead['nome'][:50]} - {status}")
            
            await asyncio.sleep(random.uniform(2, 4))
        
        # Separar leads sem site
        leads_sem_site = [l for l in todos_leads if l["tem_site"] == False]
        leads_com_site = [l for l in todos_leads if l["tem_site"] == True]
        leads_nao_verificados = [l for l in todos_leads if l["tem_site"] is None]
        
        print(f"\n{'='*60}")
        print(f"  RELATORIO FINAL")
        print(f"{'='*60}")
        print(f"  Total coletados: {len(todos_leads)}")
        print(f"  Verificados: {verificados}")
        print(f"  COM site: {len(leads_com_site)}")
        print(f"  SEM site: {len(leads_sem_site)}")
        print(f"  Nao verificados: {len(leads_nao_verificados)}")
        
        # Por cidade
        from collections import Counter
        cidades_sem_site = Counter(l["cidade"] for l in leads_sem_site)
        print(f"\n--- LEADS SEM SITE POR CIDADE ---")
        for cidade, count in cidades_sem_site.most_common(30):
            print(f"  {cidade}: {count}")
        
        # Salvar resultado
        timestamp = datetime.now().strftime("%Y%m%d_%H%M")
        resultado = {
            "campanha": "google-maps-leads-sem-site",
            "data_geracao": datetime.now().isoformat(),
            "total_coletados": len(todos_leads),
            "total_sem_site": len(leads_sem_site),
            "total_com_site": len(leads_com_site),
            "total_nao_verificados": len(leads_nao_verificados),
            "leads_sem_site": leads_sem_site,
            "leads_com_site": leads_com_site[:50],
            "leads_nao_verificados": leads_nao_verificados[:50],
        }
        
        output_path = os.path.join(OUTPUT_DIR, f"leads_sem_site_{timestamp}.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(resultado, f, ensure_ascii=False, indent=2)
        
        print(f"\n  Arquivo salvo: {output_path}")
        
        # Listar leads sem site
        print(f"\n--- TOP 30 LEADS SEM SITE ---")
        for i, lead in enumerate(leads_sem_site[:30], 1):
            print(f"  {i}. {lead['nome'][:60]} | {lead['telefone']} | {lead['cidade']} | {lead['busca']}")
        
        await browser.close()
    
    print(f"\n{'='*60}")
    print(f"  FIM")
    print(f"{'='*60}")

if __name__ == "__main__":
    asyncio.run(main())
