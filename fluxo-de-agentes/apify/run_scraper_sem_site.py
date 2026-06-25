import os
import json
import time
from apify_client import ApifyClient
from datetime import datetime
from collections import Counter
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), "..", "config", ".env")
load_dotenv(env_path)

APIFY_TOKEN = os.getenv("APIFY_API_TOKEN")
if not APIFY_TOKEN:
    raise ValueError("APIFY_API_TOKEN nao encontrado")

client = ApifyClient(APIFY_TOKEN)

# ============================================================
# CIDADES - batches pequenos para evitar rate limit
# ============================================================
CIDADES = [
    "Sao Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba",
    "Salvador", "Fortaleza", "Recife", "Porto Alegre",
    "Goiania", "Manaus", "Brasilia", "Belem",
    "Campinas", "Florianopolis", "Vitoria", "Natal",
    "Joao Pessoa", "Maceio", "Aracaju", "Cuiaba",
    "Campo Grande", "Sao Luis", "Teresina", "Ribeirao Preto",
    "Uberlandia", "Juiz de Fora", "Joinville", "Blumenau",
    "Niteroi", "Feira de Santana", "Caxias do Sul", "Londrina",
    "Maringa", "Olinda", "Santos", "Bauru",
    "Sorocaba", "Piracicaba", "Sao Jose do Rio Preto", "Presidente Prudente",
    "Canoas", "Santa Maria", "Pelotas", "Passo Fundo",
    "Chapeco", "Criciuma", "Itajai", "Chapeco",
    "Mossoro", "Petrolina", "Caruaru", "Campina Grande",
    "Sobral", "Juazeiro", "Vitoria da Conquista",
    "Governador Valadares", "Ipatinga", "Uberaba", "Montes Claros",
    "Anapolis", "Aparecida de Goiania", "Varzea Grande", "Rondonopolis",
    "Dourados", "Tres Lagoas", "Cascavel", "Ponta Grossa",
    "Foz do Iguacu", "Guarapuava",
]

# Montar 1 batch por cidade com 2 termos (pet shop + odonto)
# Cada batch = 1 cidade, 2 termos = 100 places por termo
batches = []
for cidade in CIDADES:
    batches.append([
        f"pet shop banho e tosa {cidade}",
        f"clinica odontologica {cidade}"
    ])

print(f"=== SCRAPER SEM SITE - FOCO EM WHATSAPP ===")
print(f"Cidades: {len(CIDADES)}")
print(f"Batches: {len(batches)} (1 por cidade)")
print(f"Inicio: {datetime.now().strftime('%d/%m/%Y %H:%M')}")
print()

# ============================================================
# URL REJECTION PATTERNS
# ============================================================
nao_site_patterns = [
    "wa.me/", "api.whatsapp.com", "instagram.com", "facebook.com",
    "fb.com", "linktr.ee", "bio.site", "linkbio.co", "bit.ly",
    "google.com/maps", "wixsite.com", "forms.", "formonline",
    "doctoralia.com.br", "zoop.pet", "p3w.com.br"
]

def eh_site_proprio(url):
    """Retorna True se for site proprio REAL (nao rede social)"""
    if not url:
        return False
    url_lower = url.lower()
    for pattern in nao_site_patterns:
        if pattern in url_lower:
            return False
    return "." in url and "http" in url

def extrair_nome(place):
    return (place.get("name") or place.get("title") or
            (place.get("displayName", {}).get("text") if isinstance(place.get("displayName"), dict) else place.get("displayName")) or
            "Sem nome")

def extrair_telefone(place):
    return (place.get("phone") or place.get("phoneNumber") or
            place.get("internationalPhoneNumber") or place.get("formattedPhoneNumber") or "")

def extrair_cidade_estado(place):
    cidade = place.get("city") or ""
    estado = place.get("state") or ""
    if not cidade or not estado:
        endereco = place.get("address") or place.get("fullAddress") or ""
        if endereco:
            import re
            match = re.search(r",\s*([A-Za-zÀ-ÿ\s]+)\s*-\s*([A-Z]{2})\s*,", endereco)
            if match:
                if not cidade: cidade = match.group(1).strip()
                if not estado: estado = match.group(2).strip()
    return cidade, estado

def detectar_segmento(place):
    categories = place.get("categories", []) or []
    categories_str = " ".join(categories).lower() if isinstance(categories, list) else str(categories).lower()
    if any(x in categories_str for x in ["dentist", "dental", "odontol", "orthodont", "endodont", "oral surgeon"]):
        return "odontologia"
    if any(x in categories_str for x in ["pet", "groom", "banho", "tosa"]):
        return "pet_shop"
    return "desconhecido"

def extrair_whatsapp_from_url(url):
    """Extrai numero de WhatsApp de URLs wa.me"""
    if not url:
        return ""
    import re
    match = re.search(r'wa\.me/(\d+)', url)
    if match:
        return match.group(1)
    return ""

# ============================================================
# EXECUTAR BATCHES
# ============================================================
todos_leads = []
leads_vistos = set()
erros = []
total_brutos = 0

for i, batch in enumerate(batches):
    cidade = CIDADES[i]
    print(f"[{i+1}/{len(batches)}] {cidade}...", end=" ", flush=True)

    actor_input = {
        "searchStringsArray": batch,
        "maxPlacesPerSearch": 100,
        "language": "pt-BR",
        "country": "BR",
        "maxReviews": 0,
        "maxImages": 0,
        "skipClosed": True,
        "onlyOpenNow": False,
        "minRating": 3.5,
        "maxRating": 5,
        "minReviews": 20,
        "maxReviews": 10000,
        "exportFormat": "json",
        "includeWebsites": True,
        "includePhones": True,
        "includeEmails": False,
        "includeAddress": True,
        "includeOpeningHours": True,
    }

    try:
        run = client.actor("compass/crawler-google-places").call(run_input=actor_input)
        dataset = client.dataset(run["defaultDatasetId"])
        items = list(dataset.iterate_items())
        total_brutos += len(items)

        batch_leads = 0
        for place in items:
            place_id = place.get("placeId") or place.get("cid")
            if place_id in leads_vistos:
                continue
            leads_vistos.add(place_id)

            # CRITERIO 1: NÃO pode ter site proprio
            website = place.get("website") or place.get("url") or place.get("homepage")
            if website and "google.com/maps" in website:
                website = None
            if eh_site_proprio(website):
                continue  # PULA - tem site proprio

            # CRITERIO 2: DEVE ter telefone/WhatsApp
            phone = extrair_telefone(place)
            if not phone or len(phone.replace(" ","").replace("-","").replace("(","").replace(")","").replace("+","")) < 8:
                continue  # PULA - sem telefone

            nome = extrair_nome(place)
            segmento = detectar_segmento(place)
            reviews = place.get("numberOfReviews", 0) or place.get("reviewsCount", 0) or place.get("reviewCount", 0) or 0
            endereco = place.get("address") or place.get("fullAddress") or place.get("formattedAddress") or ""
            cidade_extra, estado = extrair_cidade_estado(place)
            rating = place.get("rating", 0) or place.get("totalScore", 0)
            categorias = place.get("categories", [])

            # Normalizar telefone para WhatsApp
            whatsapp = phone.replace(" ", "").replace("-", "").replace("(", "").replace(")", "").replace("+", "").replace(".", "")
            if whatsapp.startswith("55"):
                whatsapp_fmt = f"+{whatsapp}"
            elif whatsapp.startswith("9") or whatsapp.startswith("3"):
                whatsapp_fmt = f"+55{whatsapp}"
            else:
                whatsapp_fmt = f"+55{whatsapp}"

            lead = {
                "nome": nome,
                "segmento": segmento,
                "website": website,  # Pode ser None ou rede social
                "tem_site": eh_site_proprio(website),
                "telefone": phone,
                "whatsapp": whatsapp_fmt,
                "cidade": cidade_extra or cidade,
                "estado": estado,
                "endereco": endereco,
                "avaliacoes": reviews,
                "categorias": categorias,
                "rating": rating,
                "place_id": place_id,
                "data_coleta": datetime.now().isoformat()
            }
            todos_leads.append(lead)
            batch_leads += 1

        print(f"{len(items)} brutos, {batch_leads} sem site com WhatsApp")

    except Exception as e:
        err_msg = str(e)
        print(f"ERRO: {err_msg[:60]}")
        erros.append({"cidade": cidade, "erro": err_msg})
        if "Monthly usage" in err_msg or "rate limit" in err_msg.lower():
            print("  Limite atingido! Parando...")
            break

    # Pausa entre batches
    if i < len(batches) - 1:
        time.sleep(3)

# ============================================================
# SALVAR RESULTADO
# ============================================================
timestamp = datetime.now().strftime("%Y%m%d_%H%M")
output_dir = os.path.join(os.path.dirname(__file__), "..", "dados")
os.makedirs(output_dir, exist_ok=True)

# Separar por segmento
leads_odonto = [l for l in todos_leads if l["segmento"] == "odontologia"]
leads_pet = [l for l in todos_leads if l["segmento"] == "pet_shop"]
leads_outros = [l for l in todos_leads if l["segmento"] == "desconhecido"]

resultado = {
    "campanha": "leads-sem-site-com-whatsapp",
    "data_geracao": datetime.now().isoformat(),
    "total_brutos": total_brutos,
    "total_leads": len(todos_leads),
    "odonto": len(leads_odonto),
    "pet_shop": len(leads_pet),
    "outros": len(leads_outros),
    "erros": erros,
    "leads": sorted(todos_leads, key=lambda x: x.get("avaliacoes", 0), reverse=True)
}

output_path = os.path.join(output_dir, f"leads_sem_site_{timestamp}.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(resultado, f, ensure_ascii=False, indent=2)

main_path = os.path.join(output_dir, "leads_sem_site.json")
with open(main_path, "w", encoding="utf-8") as f:
    json.dump(resultado, f, ensure_ascii=False, indent=2)

# ============================================================
# RELATORIO
# ============================================================
print(f"\n{'='*60}")
print(f"  RELATORIO FINAL")
print(f"{'='*60}")
print(f"  Brutos totais: {total_brutos}")
print(f"  Leads SEM site COM WhatsApp: {len(todos_leads)}")
print(f"    Odontologia: {len(leads_odonto)}")
print(f"    Pet Shop: {len(leads_pet)}")
print(f"    Outros: {len(leads_outros)}")
print(f"  Erros: {len(erros)}")

cidades_count = Counter(f"{l['cidade']}/{l['estado']}" for l in todos_leads if l['cidade'])
print(f"\n--- POR CIDADE (Top 20) ---")
for cidade, count in cidades_count.most_common(20):
    print(f"  {cidade}: {count}")

print(f"\n--- TOP 20 POR AVALIACOES ---")
for lead in sorted(todos_leads, key=lambda x: x.get("avaliacoes", 0), reverse=True)[:20]:
    print(f"  {lead['nome']} | {lead['segmento']} | {lead['avaliacoes']} aval. | {lead['rating']}⭐ | {lead['cidade']}/{lead['estado']} | WA: {lead['whatsapp']}")

print(f"\n  Arquivo: {output_path}")
print(f"{'='*60}")
