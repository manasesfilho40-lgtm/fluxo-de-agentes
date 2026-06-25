"""
Fast Scraper - httpx + selectolax para diretórios estáticos
100x mais rápido que Playwright para sites sem JS
"""

import asyncio
import hashlib
import json
import os
import random
import sys
import time
from typing import Optional
from urllib.parse import urljoin, urlparse

import httpx
from selectolax.parser import HTMLParser

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cache import get_cache, set_cache

REAL_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Cache-Control": "max-age=0",
}

DIRECTORIOS = {
    "empresas": "https://www.empresas.com.br/busca?q={query}",
    "lista": "https://www.lista.com.br/busca?q={query}",
    "solutudo": "https://www.solutudo.com.br/busca?q={query}",
    "guiamais": "https://www.guiamais.com.br/busca?q={query}",
    "citygoog": "https://www.citygoog.com.br/busca?q={query}",
    "ibi7": "https://www.ibi7.com.br/busca?q={query}",
}

CACHE_TTL = 3600

_client: Optional[httpx.AsyncClient] = None


def get_client() -> httpx.AsyncClient:
    global _client
    if _client is None or _client.is_closed:
        _client = httpx.AsyncClient(
            headers=REAL_HEADERS,
            timeout=httpx.Timeout(15.0, connect=5.0),
            follow_redirects=True,
            limits=httpx.Limits(max_connections=20, max_keepalive_connections=10),
        )
    return _client


def _cache_key(url: str) -> str:
    return f"scrape:{hashlib.md5(url.encode()).hexdigest()}"


async def fetch(url: str, use_cache: bool = True) -> Optional[str]:
    if use_cache:
        cached = load_cache(url)
        if cached:
            return cached.get("html")

    await asyncio.sleep(random.uniform(0.5, 1.5))

    client = get_client()
    try:
        resp = await client.get(url)
        resp.raise_for_status()
        html = resp.text
        if use_cache:
            save_cache(url, {"html": html})
        return html
    except Exception as e:
        print(f"Erro ao buscar {url}: {e}")
        return None


async def fetch_json(url: str, use_cache: bool = True) -> Optional[dict]:
    html = await fetch(url, use_cache)
    if not html:
        return None
    try:
        return json.loads(html)
    except Exception:
        return None


def parse_empresas(html: str) -> list[dict]:
    tree = HTMLParser(html)
    results = []
    for card in tree.css(".empresa-item, .result-item, .listing-item, [class*='empresa'], [class*='result']"):
        try:
            nome = card.css_first("h2, h3, .nome, .title, [class*='nome'], [class*='title']")
            url_el = card.css_first("a[href]")
            telefone = card.css_first(".telefone, .phone, [class*='telefone'], [class*='phone']")
            endereco = card.css_first(".endereco, .address, [class*='endereco'], [class*='address']")

            if nome and url_el:
                results.append({
                    "nome": nome.text(strip=True),
                    "url": urljoin("https://www.empresas.com.br", url_el.attributes.get("href", "")),
                    "telefone": telefone.text(strip=True) if telefone else "",
                    "endereco": endereco.text(strip=True) if endereco else "",
                })
        except Exception:
            continue
    return results


def parse_lista(html: str) -> list[dict]:
    tree = HTMLParser(html)
    results = []
    for card in tree.css(".result-item, .listing-item, .company-item, [class*='result'], [class*='company']"):
        try:
            nome = card.css_first("h2, h3, .title, .nome, a[href]")
            url_el = card.css_first("a[href]")
            telefone = card.css_first(".phone, .telefone, [class*='phone'], [class*='telefone']")
            endereco = card.css_first(".address, .endereco, [class*='address'], [class*='endereco']")

            if nome and url_el:
                results.append({
                    "nome": nome.text(strip=True),
                    "url": urljoin("https://www.lista.com.br", url_el.attributes.get("href", "")),
                    "telefone": telefone.text(strip=True) if telefone else "",
                    "endereco": endereco.text(strip=True) if endereco else "",
                })
        except Exception:
            continue
    return results


def parse_solutudo(html: str) -> list[dict]:
    tree = HTMLParser(html)
    results = []
    for card in tree.css(".establishment-card, .result-item, [class*='establishment'], [class*='result']"):
        try:
            nome = card.css_first("h2, h3, .name, .title, a[href]")
            url_el = card.css_first("a[href]")
            telefone = card.css_first(".phone, [class*='phone']")
            endereco = card.css_first(".address, [class*='address']")

            if nome and url_el:
                results.append({
                    "nome": nome.text(strip=True),
                    "url": urljoin("https://www.solutudo.com.br", url_el.attributes.get("href", "")),
                    "telefone": telefone.text(strip=True) if telefone else "",
                    "endereco": endereco.text(strip=True) if endereco else "",
                })
        except Exception:
            continue
    return results


PARSERS = {
    "empresas": parse_empresas,
    "lista": parse_lista,
    "solutudo": parse_solutudo,
    "guiamais": parse_lista,
    "citygoog": parse_lista,
    "ibi7": parse_lista,
}


async def search_directory(diretorio: str, query: str) -> list[dict]:
    url_template = DIRECTORIOS.get(diretorio)
    if not url_template:
        return []

    url = url_template.format(query=query.replace(" ", "+"))
    html = await fetch(url)
    if not html:
        return []

    parser = PARSERS.get(diretorio, parse_lista)
    return parser(html)


async def search_all_directories(query: str, max_per_dir: int = 10) -> list[dict]:
    tasks = [search_directory(dir_name, query) for dir_name in DIRECTORIOS]
    all_results = await asyncio.gather(*tasks, return_exceptions=True)

    leads = []
    for i, result in enumerate(all_results):
        if isinstance(result, list):
            leads.extend(result[:max_per_dir])
        elif isinstance(result, Exception):
            print(f"Erro no diretório {list(DIRECTORIOS.keys())[i]}: {result}")

    seen = set()
    unique = []
    for lead in leads:
        key = lead.get("url", "").lower()
        if key and key not in seen:
            seen.add(key)
            unique.append(lead)
    return unique


async def extract_site_info(url: str) -> dict:
    html = await fetch(url, use_cache=True)
    if not html:
        return {"url": url, "erro": "Falha ao buscar"}

    tree = HTMLParser(html)

    title = tree.css_first("title")
    meta_desc = tree.css_first('meta[name="description"]')
    h1 = tree.css_first("h1")

    whatsapp = ""
    for a in tree.css('a[href*="wa.me"], a[href*="whatsapp"]'):
        href = a.attributes.get("href", "")
        if "wa.me" in href:
            whatsapp = href.split("wa.me/")[-1].split("?")[0]
            break

    emails = []
    for a in tree.css('a[href^="mailto:"]'):
        emails.append(a.attributes.get("href", "").replace("mailto:", ""))

    phones = []
    for el in tree.css('[class*="phone"], [class*="telefone"], [class*="whatsapp"], a[href^="tel:"]'):
        text = el.text(strip=True)
        href = el.attributes.get("href", "")
        if text:
            phones.append(text)
        elif href.startswith("tel:"):
            phones.append(href.replace("tel:", ""))

    return {
        "url": url,
        "title": title.text(strip=True) if title else "",
        "description": meta_desc.attributes.get("content", "") if meta_desc else "",
        "h1": h1.text(strip=True) if h1 else "",
        "whatsapp": whatsapp,
        "emails": list(set(emails)),
        "phones": list(set(phones)),
        "html_size": len(html),
    }


async def batch_extract_sites(urls: list[str], concurrency: int = 10) -> list[dict]:
    semaphore = asyncio.Semaphore(concurrency)

    async def extract_one(url):
        async with semaphore:
            return await extract_site_info(url)

    return await asyncio.gather(*[extract_one(u) for u in urls])


async def close_client():
    global _client
    if _client and not _client.is_closed:
        await _client.aclose()
        _client = None