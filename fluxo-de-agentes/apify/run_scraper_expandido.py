import os
import json
from apify_client import ApifyClient
from datetime import datetime
from collections import Counter

# Load environment
from dotenv import load_dotenv
env_path = os.path.join(os.path.dirname(__file__), "..", "config", ".env")
load_dotenv(env_path)

APIFY_TOKEN = os.getenv("APIFY_API_TOKEN")
if not APIFY_TOKEN:
    raise ValueError("APIFY_API_TOKEN nao encontrado no .env")

client = ApifyClient(APIFY_TOKEN)

# ============================================================
# NOVAS CIDADES (baseado na secao "proxima coleta" do LEADS_VALIDADOS.md)
# ============================================================
NOVAS_CIDADES = [
    "Salvador", "Florianopolis", "Joinville", "Blumenau",
    "Niteroi", "Campinas", "Santos", "Ribeirao Preto",
    "Uberlandia", "Juiz de Fora", "Feira de Santana",
    "Caxias do Sul", "Gramado", "Londrina", "Maringa", "Olinda"
]

# Montar search strings para ODONTOLOGIA e PET SHOP
search_strings = []

for cidade in NOVAS_CIDADES:
    # Odontologia
    search_strings.append(f"clinica odontologica {cidade}")
    search_strings.append(f"dentista {cidade}")
    search_strings.append(f"implante dental {cidade}")
    search_strings.append(f"ortodontia {cidade}")
    # Pet Shop
    search_strings.append(f"pet shop {cidade}")
    search_strings.append(f"banho e tosa {cidade}")

# Termos especificos adicionais
search_strings.extend([
    "pet shop delivery Salvador",
    "tosa higienica Florianopolis",
    "buscar e levar pet Joinville",
    "pet shop delivery Campinas",
    "tosa higienica Londrina",
    "pet shop delivery Ribeirao Preto",
])

print(f"=== SCRAPER EXPANDIDO ===")
print(f"Cidades: {len(NOVAS_CIDADES)}")
print(f"Termos de busca: {len(search_strings)}")
print(f"Max places por termo: 100")
print(f"Inicio: {datetime.now().strftime('%d/%m/%Y %H:%M')}")
print()

actor_input = {
    "searchStringsArray": search_strings,
    "maxPlacesPerSearch": 100,
    "language": "pt-BR",
    "country": "BR",
    "maxReviews": 0,
    "maxImages": 0,
    "skipClosed": True,
    "onlyOpenNow": False,
    "minRating": 3.5,
    "maxRating": 5,
    "minReviews": 30,
    "maxReviews": 10000,
    "exportFormat": "json",
    "includeWebsites": True,
    "includePhones": True,
    "includeEmails": False,
    "includeAddress": True,
    "includeOpeningHours": True,
}

print("Iniciando busca no Apify...")
run = client.actor("compass/crawler-google-places").call(run_input=actor_input)
print(f"Actor iniciado: {run['id']}")

dataset = client.dataset(run["defaultDatasetId"])
items = list(dataset.iterate_items())
print(f"Total de resultados brutos: {len(items)}")

# Debug: ver estrutura do primeiro item
if items:
    print(f"\nExemplo de estrutura:")
    print(json.dumps(items[0], indent=2, ensure_ascii=False)[:1500])

# ============================================================
# FUNCOES DE EXTRACAO E VALIDACAO
# ============================================================

def extrair_nome(place):
    return (place.get("name") or place.get("title") or 
            (place.get("displayName", {}).get("text") if isinstance(place.get("displayName"), dict) else place.get("displayName")) or
            "Sem nome")

def extrair_website(place):
    website = place.get("website") or place.get("url") or place.get("homepage")
    if website and "google.com/maps" in website:
        return None
    return website

def extrair_telefone(place):
    return (place.get("phone") or place.get("phoneNumber") or 
            place.get("internationalPhoneNumber") or place.get("formattedPhoneNumber") or "")

def eh_url_valida(url):
    if not url:
        return False
    url_lower = url.lower()
    rejected = ["google.com/maps", "instagram.com", "facebook.com", "fb.com",
                "api.whatsapp.com", "wa.me", "bit.ly", "bio.site", "linktr.ee",
                "linkbio.co", "zoop.pet", "p3w.com.br", "doctoralia.com.br",
                "wixsite.com", "forms.", "formonline"]
    for r in rejected:
        if r in url_lower:
            return False
    return "." in url and "http" in url

def extrair_cidade_estado(place):
    cidade = place.get("city") or ""
    estado = place.get("state") or ""
    if not cidade or not estado:
        endereco = place.get("address") or place.get("fullAddress") or place.get("formattedAddress") or ""
        if endereco:
            import re
            match = re.search(r",\s*([A-Za-zÀ-ÿ\s]+)\s*-\s*([A-Z]{2})\s*,", endereco)
            if match:
                if not cidade:
                    cidade = match.group(1).strip()
                if not estado:
                    estado = match.group(2).strip()
    return cidade, estado

def detectar_segmento(place):
    categories = place.get("categories", []) or []
    categories_str = " ".join(categories) if isinstance(categories, list) else str(categories)
    cat_lower = categories_str.lower()
    if any(x in cat_lower for x in ["dentist", "dental_clinic", "dental clinic", "orthodontist", "endodontist",
                                     "periodontist", "oral surgeon", "implantologist", "odontologia",
                                     "clinic odontologica", "consultorio odontologico"]):
        return "odontologia"
    if any(x in cat_lower for x in ["pet_store", "pet_groomer", "pet shop", "grooming", "pet_care",
                                     "pet supply store", "animal_groomer", "banho", "tosa"]):
        return "pet_shop"
    return "desconhecido"

def validar_odontologia(place):
    categories = place.get("categories", []) or []
    categories_str = " ".join(categories) if isinstance(categories, list) else str(categories)
    reviews = place.get("numberOfReviews", 0) or place.get("reviewsCount", 0) or place.get("reviewCount", 0) or 0
    if reviews < 40:
        return False, f"Menos de 40 avaliacoes ({reviews})"
    cat_lower = categories_str.lower()
    cats_validas = ["dentist", "dental_clinic", "dental clinic", "clinica odontologica",
                    "consultorio odontologico", "orthodontist", "endodontist", "periodontist",
                    "oral surgeon", "implantologist", "odontologia", "clinica odontológica"]
    if not any(cat in cat_lower for cat in cats_validas):
        return False, f"Categoria invalida: {categories_str}"
    if any(x in cat_lower for x in ["hospital", "clinica geral", "general clinic", "medical clinic", "physician"]):
        return False, "Clinica geral / hospital"
    return True, "Qualificado"

def validar_petshop(place):
    categories = place.get("categories", []) or []
    categories_str = " ".join(categories) if isinstance(categories, list) else str(categories)
    reviews = place.get("numberOfReviews", 0) or place.get("reviewsCount", 0) or place.get("reviewCount", 0) or 0
    if reviews < 30:
        return False, f"Menos de 30 avaliacoes ({reviews})"
    cat_lower = categories_str.lower()
    cats_validas = ["pet_store", "pet store", "pet_groomer", "pet groomer", "pet shop",
                    "banho e tosa", "grooming", "animal_groomer", "pet_care", "pet supply store", "banho", "tosa"]
    if not any(cat in cat_lower for cat in cats_validas):
        return False, f"Categoria invalida: {categories_str}"
    if any(x in cat_lower for x in ["veterinarian", "veterinary", "clinica veterinaria",
                                    "animal hospital", "veterinario", "veterinary_care", "hospital veterin"]):
        return False, "E clinica veterinaria"
    if "pet_store" in cat_lower and "pet_groomer" not in cat_lower and "grooming" not in cat_lower and "banho" not in cat_lower and "tosa" not in cat_lower:
        return True, "Qualificado (verificar banho/tosa no site)"
    return True, "Qualificado"

def detectar_bonus_prioridade(place, segmento):
    sinais = []
    name = extrair_nome(place).lower()
    if segmento == "odontologia":
        reviews = place.get("numberOfReviews", 0) or place.get("reviewsCount", 0) or 0
        if reviews > 100:
            sinais.append("Possivel multi-dentistas (100+ avaliacoes)")
        if any(x in name for x in ["clinica", "centro", "instituto", "group", "associados", "&", "associadas", "odonto", "dental", "sorriso"]):
            sinais.append("Nome sugere multi-dentistas")
    elif segmento == "pet_shop":
        sinais.append("Verificar se tem delivery/buscar-levar no site")
        if any(x in name for x in ["delivery", "mobil", "movel", "buscar", "levar", "domicilio", "express"]):
            sinais.append("Nome sugere delivery/movel")
    return sinais

# ============================================================
# PROCESSAR E CLASSIFICAR
# ============================================================
leads_prioridade = []
leads_qualificados = []
leads_rejeitados = []

for place in items:
    nome = extrair_nome(place)
    website = extrair_website(place)

    if not website or not eh_url_valida(website):
        leads_rejeitados.append({
            "nome": nome,
            "motivo": "Sem site valido" if not website else f"URL rejeitada: {website}",
            "place_id": place.get("placeId") or place.get("cid"),
            "website_original": website
        })
        continue

    segmento = detectar_segmento(place)

    if segmento == "odontologia":
        valido, motivo = validar_odontologia(place)
    elif segmento == "pet_shop":
        valido, motivo = validar_petshop(place)
    else:
        leads_rejeitados.append({
            "nome": nome,
            "motivo": f"Segmento nao identificado",
            "place_id": place.get("placeId") or place.get("cid"),
            "categorias": place.get("categories", [])
        })
        continue

    if not valido:
        reviews = place.get("numberOfReviews", 0) or place.get("reviewsCount", 0) or 0
        leads_rejeitados.append({
            "nome": nome,
            "motivo": motivo,
            "place_id": place.get("placeId") or place.get("cid"),
            "avaliacoes": reviews,
            "categorias": place.get("categories", [])
        })
        continue

    reviews = place.get("numberOfReviews", 0) or place.get("reviewsCount", 0) or place.get("reviewCount", 0) or 0
    phone = extrair_telefone(place)
    endereco = place.get("address") or place.get("fullAddress") or place.get("formattedAddress") or ""
    cidade, estado = extrair_cidade_estado(place)

    lead = {
        "nome": nome,
        "segmento": segmento,
        "url": website,
        "telefone": phone,
        "whatsapp": phone.replace(" ", "").replace("-", "").replace("(", "").replace(")", "").replace("+", "").replace(".", ""),
        "cidade": cidade,
        "estado": estado,
        "endereco": endereco,
        "avaliacoes": reviews,
        "categoria_oficial": place.get("categories", []),
        "rating": place.get("rating", 0) or place.get("totalScore", 0),
        "place_id": place.get("placeId") or place.get("cid"),
        "latitude": place.get("location", {}).get("lat") if place.get("location") else None,
        "longitude": place.get("location", {}).get("lng") if place.get("location") else None,
        "horario_funcionamento": place.get("openingHours", []),
        "sinais_dor": detectar_bonus_prioridade(place, segmento),
        "observacoes": motivo,
        "data_coleta": datetime.now().isoformat()
    }

    sinais_str = str(lead["sinais_dor"])
    if ("multi-dentistas" in sinais_str and segmento == "odontologia") or segmento == "pet_shop":
        lead["score_validacao"] = "prioridade"
        leads_prioridade.append(lead)
    else:
        lead["score_validacao"] = "qualificado"
        leads_qualificados.append(lead)

# ============================================================
# SALVAR RESULTADOS
# ============================================================
timestamp = datetime.now().strftime("%Y%m%d_%H%M")

resultado = {
    "campanha": "apify-expandido-novas-cidades",
    "data_geracao": datetime.now().isoformat(),
    "cidades_buscadas": NOVAS_CIDADES,
    "total_resultados_brutos": len(items),
    "total_leads": len(leads_prioridade) + len(leads_qualificados),
    "leads_prioridade": len(leads_prioridade),
    "leads_qualificados": len(leads_qualificados),
    "leads_rejeitados": len(leads_rejeitados),
    "leads_prioridade_dados": leads_prioridade,
    "leads_qualificados_dados": leads_qualificados,
    "rejeitados_resumo": leads_rejeitados[:100]
}

output_dir = os.path.join(os.path.dirname(__file__), "..", "dados")
os.makedirs(output_dir, exist_ok=True)

output_path = os.path.join(output_dir, f"leads_expandido_{timestamp}.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(resultado, f, ensure_ascii=False, indent=2)

# Salvar tambem como leads.json principal
main_path = os.path.join(output_dir, "leads.json")
with open(main_path, "w", encoding="utf-8") as f:
    json.dump(resultado, f, ensure_ascii=False, indent=2)

# ============================================================
# RELATORIO
# ============================================================
print(f"\n{'='*60}")
print(f"  RELATORIO - COLETA EXPANDIDA")
print(f"{'='*60}")
print(f"  Data: {datetime.now().strftime('%d/%m/%Y %H:%M')}")
print(f"  Cidades buscadas: {len(NOVAS_CIDADES)}")
print(f"  Termos de busca: {len(search_strings)}")
print(f"  Resultados brutos: {len(items)}")
print(f"  Leads PRIORIDADE: {len(leads_prioridade)}")
print(f"  Leads QUALIFICADOS: {len(leads_qualificados)}")
print(f"  Leads REJEITADOS: {len(leads_rejeitados)}")
print(f"  Total validos: {len(leads_prioridade) + len(leads_qualificados)}")
print(f"  Arquivo: {output_path}")

# Por segmento
print(f"\n--- POR SEGMENTO ---")
print(f"  Odontologia Prioridade: {sum(1 for l in leads_prioridade if l['segmento']=='odontologia')}")
print(f"  Odontologia Qualificado: {sum(1 for l in leads_qualificados if l['segmento']=='odontologia')}")
print(f"  Pet Shop Prioridade: {sum(1 for l in leads_prioridade if l['segmento']=='pet_shop')}")
print(f"  Pet Shop Qualificado: {sum(1 for l in leads_qualificados if l['segmento']=='pet_shop')}")

# Por cidade
todas_cidades = []
for lead in leads_prioridade + leads_qualificados:
    if lead['cidade']:
        todas_cidades.append(f"{lead['cidade']}/{lead['estado']}")
cidades_count = Counter(todas_cidades)
print(f"\n--- DISTRIBUICAO POR CIDADE ---")
for cidade, count in cidades_count.most_common(20):
    print(f"  {cidade}: {count}")

# Top leads
print(f"\n--- TOP LEADS PRIORIDADE ---")
for lead in sorted(leads_prioridade, key=lambda x: x.get("avaliacoes", 0), reverse=True)[:20]:
    print(f"  {lead['nome']} | {lead['segmento']} | {lead['avaliacoes']} aval. | {lead['rating']}⭐ | {lead['cidade']}/{lead['estado']} | {lead['url']}")

print(f"\n--- TOP LEADS QUALIFICADOS (Odonto) ---")
for lead in sorted([l for l in leads_qualificados if l['segmento']=='odontologia'], key=lambda x: x.get("avaliacoes", 0), reverse=True)[:20]:
    print(f"  {lead['nome']} | {lead['avaliacoes']} aval. | {lead['rating']}⭐ | {lead['cidade']}/{lead['estado']} | {lead['url']}")

print(f"\n--- TOP LEADS QUALIFICADOS (Pet Shop) ---")
for lead in sorted([l for l in leads_qualificados if l['segmento']=='pet_shop'], key=lambda x: x.get("avaliacoes", 0), reverse=True)[:20]:
    print(f"  {lead['nome']} | {lead['avaliacoes']} aval. | {lead['rating']}⭐ | {lead['cidade']}/{lead['estado']} | {lead['url']}")

print(f"\n{'='*60}")
print(f"  FIM DA COLETA")
print(f"{'='*60}")
