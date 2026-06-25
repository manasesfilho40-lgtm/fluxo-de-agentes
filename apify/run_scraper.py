import os
import json
import asyncio
from apify_client import ApifyClient
from datetime import datetime

# Carregar token do .env
from dotenv import load_dotenv
load_dotenv(r"C:\Users\T-GAMER\fluxo de agentes\config\.env")

APIFY_TOKEN = os.getenv("APIFY_API_TOKEN")
if not APIFY_TOKEN:
    raise ValueError("APIFY_API_TOKEN nao encontrado no .env")

client = ApifyClient(APIFY_TOKEN)

# Configurar input do actor compass/crawler-google-places
actor_input = {
    "searchStringsArray": [
        # Odontologia - SP
        "clinica odontologica Sao Paulo",
        "dentista Sao Paulo",
        "implante dental Sao Paulo",
        "ortodontia Sao Paulo",
        # Odontologia - RJ
        "clinica odontologica Rio de Janeiro",
        "dentista Rio de Janeiro",
        # Odontologia - MG
        "clinica odontologica Belo Horizonte",
        "dentista Belo Horizonte",
        # Odontologia - PR
        "clinica odontologica Curitiba",
        "dentista Curitiba",
        # Pet Shop - SP
        "pet shop Sao Paulo",
        "banho e tosa Sao Paulo",
        "pet shop delivery Sao Paulo",
        # Pet Shop - RJ
        "pet shop Rio de Janeiro",
        "banho e tosa Rio de Janeiro",
        # Pet Shop - MG
        "pet shop Belo Horizonte",
        "banho e tosa Belo Horizonte",
        # Pet Shop - PR
        "pet shop Curitiba",
        "banho e tosa Curitiba",
        # Outras capitais
        "clinica odontologica Salvador",
        "clinica odontologica Porto Alegre",
        "clinica odontologica Recife",
        "clinica odontologica Fortaleza",
        "clinica odontologica Goiania",
        "pet shop Salvador",
        "banho e tosa Porto Alegre",
        "pet shop Recife",
        "pet shop Fortaleza",
        "pet shop Goiania",
    ],
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

print(f"Iniciando busca com {len(actor_input['searchStringsArray'])} termos...")
print(f"Max places por termo: {actor_input['maxPlacesPerSearch']}")

# Rodar o actor
run = client.actor("compass/crawler-google-places").call(run_input=actor_input)
print(f"Actor iniciado: {run['id']}")

# Aguardar conclusao e baixar resultados
dataset = client.dataset(run["defaultDatasetId"])
items = list(dataset.iterate_items())

print(f"Total de resultados brutos: {len(items)}")

# Filtrar por criterios especificos
def validar_odontologia(place):
    """Valida se e clinica odontologica qualificada"""
    categories = place.get("categories", []) or []
    categories_str = " ".join(categories) if isinstance(categories, list) else str(categories)
    reviews = place.get("numberOfReviews", 0) or place.get("reviewsCount", 0) or 0
    
    # Criterios obrigatorios
    if reviews < 40:
        return False, f"Menos de 40 avaliacoes ({reviews})"
    
    cat_lower = categories_str.lower()
    categorias_validas = ["dentist", "dental_clinic", "dental clinic", "clinica odontologica", "consultorio odontologico", "orthodontist", "endodontist"]
    if not any(cat in cat_lower for cat in categorias_validas):
        return False, f"Categoria invalida: {categories_str}"
    
    # Red flags
    if any(x in cat_lower for x in ["hospital", "clinica geral", "general clinic", "medical clinic"]):
        return False, "Clinica geral / hospital"
    
    return True, "Qualificado"

def validar_petshop(place):
    """Valida se e pet shop banho/tosa qualificado"""
    categories = place.get("categories", []) or []
    categories_str = " ".join(categories) if isinstance(categories, list) else str(categories)
    reviews = place.get("numberOfReviews", 0) or place.get("reviewsCount", 0) or 0
    
    if reviews < 30:
        return False, f"Menos de 30 avaliacoes ({reviews})"
    
    cat_lower = categories_str.lower()
    categorias_validas = ["pet_store", "pet store", "pet_groomer", "pet groomer", "pet shop", "banho e tosa", "grooming", "animal_groomer", "pet_care"]
    if not any(cat in cat_lower for cat in categorias_validas):
        return False, f"Categoria invalida: {categories_str}"
    
    # Red flags
    if any(x in cat_lower for x in ["veterinarian", "veterinary", "clinica veterinaria", "animal hospital", "veterinario"]):
        return False, "E clinica veterinaria"
    
    # Verificar se tem servico de banho/tosa (pet_groomer indica servico)
    if "pet_store" in cat_lower and "pet_groomer" not in cat_lower and "grooming" not in cat_lower:
        return True, "Qualificado (verificar se tem banho/tosa no site)"
    
    return True, "Qualificado"

def detectar_segmento(place):
    """Detecta se e odontologia ou pet shop"""
    categories = place.get("categories", []) or []
    categories_str = " ".join(categories) if isinstance(categories, list) else str(categories)
    cat_lower = categories_str.lower()
    
    if any(x in cat_lower for x in ["dentist", "dental_clinic", "dental clinic", "orthodontist", "endodontist"]):
        return "odontologia"
    if any(x in cat_lower for x in ["pet_store", "pet_groomer", "pet shop", "grooming", "pet_care"]):
        return "pet_shop"
    return "desconhecido"

def detectar_bonus_prioridade(place, segmento):
    """Detecta sinais de bonus de prioridade"""
    sinais = []
    
    if segmento == "odontologia":
        # Heuristica: muitas avaliacoes pode indicar multi-dentistas
        reviews = place.get("numberOfReviews", 0) or place.get("reviewsCount", 0) or 0
        if reviews > 100:
            sinais.append("Possivel multi-dentistas (100+ avaliacoes)")
        # Verificar se nome sugere multi-dentistas
        name = place.get("name", "").lower()
        if any(x in name for x in ["clinica", "centro", "instituto", "group", "associados", "&"]):
            sinais.append("Nome sugere multi-dentistas")
    
    elif segmento == "pet_shop":
        # Marcar para verificacao manual de delivery
        sinais.append("Verificar se tem delivery/buscar-levar no site")
        name = place.get("name", "").lower()
        if any(x in name for x in ["delivery", "delivery", "mobil", "movel", "buscar", "levar"]):
            sinais.append("Nome sugere delivery/movel")
    
    return sinais

# Processar e classificar
leads_qualificados = []
leads_prioridade = []
leads_rejeitados = []

for place in items:
    # Pular se nao tem site
    website = place.get("website", "") or place.get("url", "")
    if not website:
        leads_rejeitados.append({
            "nome": place.get("name"),
            "motivo": "Sem site",
            "place_id": place.get("placeId") or place.get("cid")
        })
        continue
    
    segmento = detectar_segmento(place)
    
    if segmento == "odontologia":
        valido, motivo = validar_odontologia(place)
    elif segmento == "pet_shop":
        valido, motivo = validar_petshop(place)
    else:
        leads_rejeitados.append({
            "nome": place.get("name"),
            "motivo": f"Segmento nao identificado: {segmento}",
            "place_id": place.get("placeId") or place.get("cid")
        })
        continue
    
    if not valido:
        leads_rejeitados.append({
            "nome": place.get("name"),
            "motivo": motivo,
            "place_id": place.get("placeId") or place.get("cid"),
            "avaliacoes": place.get("numberOfReviews", 0) or place.get("reviewsCount", 0),
            "categoria": place.get("categories", [])
        })
        continue
    
    # Lead valido - construir objeto
    reviews = place.get("numberOfReviews", 0) or place.get("reviewsCount", 0) or 0
    phone = place.get("phone", "") or place.get("phoneNumber", "") or ""
    
    lead = {
        "nome": place.get("name"),
        "segmento": segmento,
        "url": website,
        "telefone": phone,
        "whatsapp": phone.replace(" ", "").replace("-", "").replace("(", "").replace(")", "").replace("+", ""),
        "email": "",
        "cidade": place.get("city", "") or place.get("address", "").split(",")[-2].strip() if "," in place.get("address", "") else "",
        "estado": "",
        "endereco": place.get("address", "") or place.get("fullAddress", ""),
        "avaliacoes": reviews,
        "categoria_oficial": place.get("categories", []),
        "rating": place.get("rating", 0) or place.get("totalScore", 0),
        "place_id": place.get("placeId") or place.get("cid"),
        "latitude": place.get("location", {}).get("lat") if place.get("location") else (place.get("latitude") if place.get("latitude") else None),
        "longitude": place.get("location", {}).get("lng") if place.get("location") else (place.get("longitude") if place.get("longitude") else None),
        "horario_funcionamento": place.get("openingHours", {}),
        "score_validacao": "qualificado",
        "sinais_dor": detectar_bonus_prioridade(place, segmento),
        "observacoes": motivo
    }
    
    # Extrair estado do endereco
    addr = lead["endereco"]
    if addr and "," in addr:
        parts = [p.strip() for p in addr.split(",")]
        # Procurar UF (2 letras)
        for part in parts:
            if len(part) == 2 and part.isupper():
                lead["estado"] = part
                break
    
    # Verificar prioridade
    sinais_str = str(lead["sinais_dor"])
    if "multi-dentistas" in sinais_str or segmento == "pet_shop":
        lead["score_validacao"] = "prioridade"
        leads_prioridade.append(lead)
    else:
        leads_qualificados.append(lead)

# Salvar resultado
resultado = {
    "campanha": "apify-google-maps-odontologia-petshop",
    "data_geracao": datetime.now().isoformat(),
    "total_leads": len(leads_qualificados) + len(leads_prioridade),
    "leads_prioridade": len(leads_prioridade),
    "leads_qualificados": len(leads_qualificados),
    "leads_rejeitados": len(leads_rejeitados),
    "nichos": ["odontologia", "pet_shop"],
    "leads_prioridade": leads_prioridade,
    "leads_qualificados": leads_qualificados,
    "rejeitados_resumo": leads_rejeitados[:50]
}

output_path = r"C:\Users\T-GAMER\fluxo de agentes\dados\leads.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(resultado, f, ensure_ascii=False, indent=2)

print(f"\n=== RESULTADO ===")
print(f"Leads PRIORIDADE: {len(leads_prioridade)}")
print(f"Leads QUALIFICADOS: {len(leads_qualificados)}")
print(f"Leads REJEITADOS: {len(leads_rejeitados)}")
print(f"Total validos: {len(leads_qualificados) + len(leads_prioridade)}")
print(f"Salvo em: {output_path}")

# Mostrar exemplos de prioridade
print(f"\n--- EXEMPLOS PRIORIDADE ---")
for lead in leads_prioridade[:10]:
    print(f"  {lead['nome']} | {lead['segmento']} | {lead['avaliacoes']} aval. | {lead['cidade']}/{lead['estado']} | {lead['url']}")

print(f"\n--- EXEMPLOS QUALIFICADOS ---")
for lead in leads_qualificados[:10]:
    print(f"  {lead['nome']} | {lead['segmento']} | {lead['avaliacoes']} aval. | {lead['cidade']}/{lead['estado']} | {lead['url']}")

# Resumo por cidade
from collections import Counter
cidades_prioridade = Counter([f"{l['cidade']}/{l['estado']}" for l in leads_prioridade if l['cidade']])
cidades_qualificados = Counter([f"{l['cidade']}/{l['estado']}" for l in leads_qualificados if l['cidade']])

print(f"\n--- DISTRIBUICAO POR CIDADE (PRIORIDADE) ---")
for cidade, count in cidades_prioridade.most_common(10):
    print(f"  {cidade}: {count}")

print(f"\n--- DISTRIBUICAO POR CIDADE (QUALIFICADOS) ---")
for cidade, count in cidades_qualificados.most_common(10):
    print(f"  {cidade}: {count}")