import os
import json
from apify_client import ApifyClient
from datetime import datetime

from dotenv import load_dotenv
load_dotenv(r"C:\Users\T-GAMER\fluxo de agentes\config\.env")

APIFY_TOKEN = os.getenv("APIFY_API_TOKEN")
if not APIFY_TOKEN:
    raise ValueError("APIFY_API_TOKEN nao encontrado no .env")

client = ApifyClient(APIFY_TOKEN)

actor_input = {
    "searchStringsArray": [
        "clinica odontologica Sao Paulo",
        "dentista Sao Paulo",
        "implante dental Sao Paulo",
        "ortodontia Sao Paulo",
        "clinica odontologica Rio de Janeiro",
        "dentista Rio de Janeiro",
        "clinica odontologica Belo Horizonte",
        "dentista Belo Horizonte",
        "clinica odontologica Curitiba",
        "dentista Curitiba",
        "pet shop Sao Paulo",
        "banho e tosa Sao Paulo",
        "pet shop delivery Sao Paulo",
        "pet shop Rio de Janeiro",
        "banho e tosa Rio de Janeiro",
        "pet shop Belo Horizonte",
        "banho e tosa Belo Horizonte",
        "pet shop Curitiba",
        "banho e tosa Curitiba",
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

run = client.actor("compass/crawler-google-places").call(run_input=actor_input)
print(f"Actor iniciado: {run['id']}")

dataset = client.dataset(run["defaultDatasetId"])
items = list(dataset.iterate_items())

print(f"Total de resultados brutos: {len(items)}")

# Debug: ver estrutura do primeiro item
if items:
    print(f"\nExemplo de estrutura:")
    print(json.dumps(items[0], indent=2, ensure_ascii=False)[:2000])

def extrair_nome(place):
    """Extrai nome do lugar"""
    return (place.get("name") or 
            place.get("title") or 
            place.get("displayName", {}).get("text") if isinstance(place.get("displayName"), dict) else place.get("displayName") or
            "Sem nome")

def extrair_website(place):
    """Extrai website real (nao URL do Google Maps)"""
    website = place.get("website") or place.get("url") or place.get("homepage")
    # Se for URL do Google Maps, ignorar
    if website and "google.com/maps" in website:
        return None
    return website

def extrair_telefone(place):
    """Extrai telefone"""
    return (place.get("phone") or 
            place.get("phoneNumber") or 
            place.get("internationalPhoneNumber") or 
            place.get("formattedPhoneNumber") or "")

def extrair_cidade_estado(endereco):
    """Extrai cidade e estado do endereco"""
    if not endereco:
        return "", ""
    partes = [p.strip() for p in endereco.split(",")]
    cidade = ""
    estado = ""
    # Procurar UF (2 letras maiusculas)
    for parte in partes:
        if len(parte) == 2 and parte.isupper() and parte.isalpha():
            estado = parte
            break
    # Cidade costuma ser a penultima ou antepenultima parte
    for i in range(len(partes) - 1, -1, -1):
        parte = partes[i]
        if parte and len(parte) > 2 and not parte.isdigit() and " " not in parte[:10] and parte != estado:
            # Verificar se nao e cep, bairro generico, etc
            if not any(x in parte.lower() for x in ["cep", "bairro", "rua", "av.", "avenida", "rodovia", "br-", "km"]):
                cidade = parte
                break
    return cidade, estado

def validar_odontologia(place):
    categories = place.get("categories", []) or []
    categories_str = " ".join(categories) if isinstance(categories, list) else str(categories)
    reviews = place.get("numberOfReviews", 0) or place.get("reviewsCount", 0) or place.get("reviewCount", 0) or 0
    
    if reviews < 40:
        return False, f"Menos de 40 avaliacoes ({reviews})"
    
    cat_lower = categories_str.lower()
    categorias_validas = ["dentist", "dental_clinic", "dental clinic", "clinica odontologica", "consultorio odontologico", "orthodontist", "endodontist", "periodontist", "oral surgeon"]
    if not any(cat in cat_lower for cat in categorias_validas):
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
    categorias_validas = ["pet_store", "pet store", "pet_groomer", "pet groomer", "pet shop", "banho e tosa", "grooming", "animal_groomer", "pet_care", "pet supply store"]
    if not any(cat in cat_lower for cat in categorias_validas):
        return False, f"Categoria invalida: {categories_str}"
    
    # Red flag: veterinario
    if any(x in cat_lower for x in ["veterinarian", "veterinary", "clinica veterinaria", "animal hospital", "veterinario", "veterinary_care"]):
        return False, "E clinica veterinaria"
    
    # Verificar se so loja de produtos (pet_store sem groomer)
    if "pet_store" in cat_lower and "pet_groomer" not in cat_lower and "grooming" not in cat_lower and "banho" not in cat_lower:
        return True, "Qualificado (verificar se tem banho/tosa no site)"
    
    return True, "Qualificado"

def detectar_segmento(place):
    categories = place.get("categories", []) or []
    categories_str = " ".join(categories) if isinstance(categories, list) else str(categories)
    cat_lower = categories_str.lower()
    
    if any(x in cat_lower for x in ["dentist", "dental_clinic", "dental clinic", "orthodontist", "endodontist", "periodontist", "oral surgeon"]):
        return "odontologia"
    if any(x in cat_lower for x in ["pet_store", "pet_groomer", "pet shop", "grooming", "pet_care", "pet supply store", "animal_groomer"]):
        return "pet_shop"
    return "desconhecido"

def detectar_bonus_prioridade(place, segmento):
    sinais = []
    name = extrair_nome(place).lower()
    
    if segmento == "odontologia":
        reviews = place.get("numberOfReviews", 0) or place.get("reviewsCount", 0) or 0
        if reviews > 100:
            sinais.append("Possivel multi-dentistas (100+ avaliacoes)")
        if any(x in name for x in ["clinica", "centro", "instituto", "group", "associados", "&", "associadas", "odonto", "dental"]):
            sinais.append("Nome sugere multi-dentistas")
    
    elif segmento == "pet_shop":
        sinais.append("Verificar se tem delivery/buscar-levar no site")
        if any(x in name for x in ["delivery", "mobil", "movel", "buscar", "levar", "domicilio", "delivery"]):
            sinais.append("Nome sugere delivery/movel")
    
    return sinais

# Processar e classificar
leads_qualificados = []
leads_prioridade = []
leads_rejeitados = []

for place in items:
    nome = extrair_nome(place)
    website = extrair_website(place)
    
    # Pular se nao tem site real
    if not website:
        leads_rejeitados.append({
            "nome": nome,
            "motivo": "Sem site real",
            "place_id": place.get("placeId") or place.get("cid"),
            "website_original": place.get("website") or place.get("url")
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
            "motivo": f"Segmento nao identificado: {segmento}",
            "place_id": place.get("placeId") or place.get("cid"),
            "categorias": place.get("categories", [])
        })
        continue
    
    if not valido:
        reviews = place.get("numberOfReviews", 0) or place.get("reviewsCount", 0) or place.get("reviewCount", 0) or 0
        leads_rejeitados.append({
            "nome": nome,
            "motivo": motivo,
            "place_id": place.get("placeId") or place.get("cid"),
            "avaliacoes": reviews,
            "categoria": place.get("categories", [])
        })
        continue
    
    # Lead valido
    reviews = place.get("numberOfReviews", 0) or place.get("reviewsCount", 0) or place.get("reviewCount", 0) or 0
    phone = extrair_telefone(place)
    endereco = place.get("address") or place.get("fullAddress") or place.get("formattedAddress") or ""
    cidade, estado = extrair_cidade_estado(endereco)
    
    # Tentar extrair cidade/estado do address_components se disponivel
    if not cidade and place.get("addressComponents"):
        for comp in place["addressComponents"]:
            if "locality" in comp.get("types", []):
                cidade = comp.get("longName", "")
            if "administrative_area_level_1" in comp.get("types", []):
                estado = comp.get("shortName", "")
    
    lead = {
        "nome": nome,
        "segmento": segmento,
        "url": website,
        "telefone": phone,
        "whatsapp": phone.replace(" ", "").replace("-", "").replace("(", "").replace(")", "").replace("+", "").replace(".", ""),
        "email": "",
        "cidade": cidade,
        "estado": estado,
        "endereco": endereco,
        "avaliacoes": reviews,
        "categoria_oficial": place.get("categories", []),
        "rating": place.get("rating", 0) or place.get("totalScore", 0),
        "place_id": place.get("placeId") or place.get("cid"),
        "latitude": place.get("location", {}).get("lat") if place.get("location") else (place.get("latitude") if place.get("latitude") else None),
        "longitude": place.get("location", {}).get("lng") if place.get("location") else (place.get("longitude") if place.get("longitude") else None),
        "horario_funcionamento": place.get("openingHours", []),
        "score_validacao": "qualificado",
        "sinais_dor": detectar_bonus_prioridade(place, segmento),
        "observacoes": motivo
    }
    
    # Verificar prioridade
    sinais_str = str(lead["sinais_dor"])
    if ("multi-dentistas" in sinais_str and segmento == "odontologia") or segmento == "pet_shop":
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

# Mostrar exemplos
print(f"\n--- EXEMPLOS PRIORIDADE ---")
for lead in leads_prioridade[:15]:
    print(f"  {lead['nome']} | {lead['segmento']} | {lead['avaliacoes']} aval. | {lead['cidade']}/{lead['estado']} | {lead['url']}")

print(f"\n--- EXEMPLOS QUALIFICADOS ---")
for lead in leads_qualificados[:15]:
    print(f"  {lead['nome']} | {lead['segmento']} | {lead['avaliacoes']} aval. | {lead['cidade']}/{lead['estado']} | {lead['url']}")

# Resumo por segmento
print(f"\n--- POR SEGMENTO ---")
print(f"  Odontologia Prioridade: {sum(1 for l in leads_prioridade if l['segmento']=='odontologia')}")
print(f"  Odontologia Qualificado: {sum(1 for l in leads_qualificados if l['segmento']=='odontologia')}")
print(f"  Pet Shop Prioridade: {sum(1 for l in leads_prioridade if l['segmento']=='pet_shop')}")
print(f"  Pet Shop Qualificado: {sum(1 for l in leads_qualificados if l['segmento']=='pet_shop')}")

# Resumo por cidade
from collections import Counter
todas_cidades = []
for lead in leads_prioridade + leads_qualificados:
    if lead['cidade']:
        todas_cidades.append(f"{lead['cidade']}/{lead['estado']}")

cidades_count = Counter(todas_cidades)
print(f"\n--- DISTRIBUICAO POR CIDADE ---")
for cidade, count in cidades_count.most_common(15):
    print(f"  {cidade}: {count}")