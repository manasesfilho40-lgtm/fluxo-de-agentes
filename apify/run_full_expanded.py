import os
import json
import re
from apify_client import ApifyClient
from datetime import datetime
from dotenv import load_dotenv

load_dotenv(r"C:\Users\T-GAMER\fluxo de agentes\config\.env")

APIFY_TOKEN = os.getenv("APIFY_API_TOKEN")
if not APIFY_TOKEN:
    raise ValueError("APIFY_API_TOKEN não encontrado no .env")

client = ApifyClient(APIFY_TOKEN)

# Configuração expandida para 100+ leads
actor_input = {
    "searchStringsArray": [
        # === ODONTOLOGIA - São Paulo ===
        "clinica odontologica Sao Paulo",
        "dentista Sao Paulo",
        "implante dental Sao Paulo",
        "ortodontia Sao Paulo",
        "endodontia Sao Paulo",
        "periodontia Sao Paulo",
        "clinica dental Sao Paulo",
        "odontologia estetica Sao Paulo",
        "dentista 24 horas Sao Paulo",
        
        # === ODONTOLOGIA - Rio de Janeiro ===
        "clinica odontologica Rio de Janeiro",
        "dentista Rio de Janeiro",
        "implante dental Rio de Janeiro",
        "ortodontia Rio de Janeiro",
        
        # === ODONTOLOGIA - Belo Horizonte ===
        "clinica odontologica Belo Horizonte",
        "dentista Belo Horizonte",
        "implante dental Belo Horizonte",
        "ortodontia Belo Horizonte",
        
        # === ODONTOLOGIA - Curitiba ===
        "clinica odontologica Curitiba",
        "dentista Curitiba",
        "implante dental Curitiba",
        "ortodontia Curitiba",
        
        # === ODONTOLOGIA - Porto Alegre ===
        "clinica odontologica Porto Alegre",
        "dentista Porto Alegre",
        "implante dental Porto Alegre",
        "ortodontia Porto Alegre",
        
        # === ODONTOLOGIA - Salvador ===
        "clinica odontologica Salvador",
        "dentista Salvador",
        "ortodontia Salvador",
        
        # === ODONTOLOGIA - Recife ===
        "clinica odontologica Recife",
        "dentista Recife",
        "ortodontia Recife",
        
        # === ODONTOLOGIA - Fortaleza ===
        "clinica odontologica Fortaleza",
        "dentista Fortaleza",
        "ortodontia Fortaleza",
        
        # === ODONTOLOGIA - Goiânia ===
        "clinica odontologica Goiania",
        "dentista Goiania",
        "ortodontia Goiania",
        
        # === ODONTOLOGIA - Florianópolis ===
        "clinica odontologica Florianopolis",
        "dentista Florianopolis",
        
        # === ODONTOLOGIA - Campinas ===
        "clinica odontologica Campinas",
        "dentista Campinas",
        
        # === PET SHOP - São Paulo ===
        "pet shop Sao Paulo",
        "banho e tosa Sao Paulo",
        "pet shop delivery Sao Paulo",
        "tosa higienica Sao Paulo",
        "buscar e levar pet Sao Paulo",
        
        # === PET SHOP - Rio de Janeiro ===
        "pet shop Rio de Janeiro",
        "banho e tosa Rio de Janeiro",
        "pet shop delivery Rio de Janeiro",
        "tosa higienica Rio de Janeiro",
        
        # === PET SHOP - Belo Horizonte ===
        "pet shop Belo Horizonte",
        "banho e tosa Belo Horizonte",
        "pet shop delivery Belo Horizonte",
        
        # === PET SHOP - Curitiba ===
        "pet shop Curitiba",
        "banho e tosa Curitiba",
        "pet shop delivery Curitiba",
        "tosa higienica Curitiba",
        
        # === PET SHOP - Porto Alegre ===
        "pet shop Porto Alegre",
        "banho e tosa Porto Alegre",
        "pet shop delivery Porto Alegre",
        "tosa higienica Porto Alegre",
        
        # === PET SHOP - Salvador ===
        "pet shop Salvador",
        "banho e tosa Salvador",
        "pet shop delivery Salvador",
        
        # === PET SHOP - Recife ===
        "pet shop Recife",
        "banho e tosa Recife",
        "pet shop delivery Recife",
        
        # === PET SHOP - Fortaleza ===
        "pet shop Fortaleza",
        "banho e tosa Fortaleza",
        "pet shop delivery Fortaleza",
        
        # === PET SHOP - Goiânia ===
        "pet shop Goiania",
        "banho e tosa Goiania",
        "pet shop delivery Goiania",
        
        # === PET SHOP - Florianópolis ===
        "pet shop Florianopolis",
        "banho e tosa Florianopolis",
        
        # === PET SHOP - Campinas ===
        "pet shop Campinas",
        "banho e tosa Campinas",
        
        # === PET SHOP - Santos ===
        "pet shop Santos",
        "banho e tosa Santos",
        
        # === PET SHOP - Niterói ===
        "pet shop Niteroi",
        "banho e tosa Niteroi",
        
        # === PET SHOP - Joinville ===
        "pet shop Joinville",
        "banho e tosa Joinville",
        
        # === PET SHOP - Blumenau ===
        "pet shop Blumenau",
        "banho e tosa Blumenau",
        
        # === PET SHOP - Londrina ===
        "pet shop Londrina",
        "banho e tosa Londrina",
        
        # === PET SHOP - Maringá ===
        "pet shop Maringa",
        "banho e tosa Maringa",
    ],
    "maxPlacesPerSearch": 50,
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

# ===== PROCESSAMENTO =====

def extrair_nome(place):
    return (place.get("title") or 
            place.get("name") or 
            place.get("displayName", {}).get("text") if isinstance(place.get("displayName"), dict) else place.get("displayName") or
            "Sem nome")

def extrair_website(place):
    website = place.get("website") or place.get("url") or place.get("homepage")
    if website and "google.com/maps" in website:
        return None
    return website

def eh_url_valida(url):
    if not url:
        return False
    url_lower = url.lower()
    rejected_patterns = [
        "google.com/maps",
        "instagram.com",
        "facebook.com",
        "fb.com",
        "api.whatsapp.com",
        "wa.me",
        "bit.ly",
        "bio.site",
        "linktr.ee",
        "linkbio.co",
        "zoop.pet",
        "p3w.com.br",
        "doctoralia.com.br",
        "wixsite.com",
        "forms.",
        "formonline",
    ]
    for r in rejected_patterns:
        if r in url_lower:
            return False
    return "." in url and "http" in url

def extrair_cidade_estado(place):
    cidade = place.get("city") or ""
    estado = place.get("state") or ""
    
    estados_map = {
        "paraná": "PR", "santa catarina": "SC", "rio grande do sul": "RS",
        "são paulo": "SP", "rio de janeiro": "RJ", "minas gerais": "MG",
        "bahia": "BA", "goiás": "GO", "distrito federal": "DF",
        "pernambuco": "PE", "ceará": "CE", "fortaleza": "CE",
        "curitiba": "PR", "porto alegre": "RS", "salvador": "BA", "goiânia": "GO"
    }
    
    if not estado and cidade:
        cidade_lower = cidade.lower().strip()
        estado = estados_map.get(cidade_lower, "")
    
    if not cidade or not estado:
        endereco = place.get("address") or place.get("fullAddress") or place.get("formattedAddress") or ""
        if endereco:
            match = re.search(r",\s*([A-Za-zÀ-ÿ\s]+)\s*-\s*([A-Z]{2})\s*,", endereco)
            if match:
                if not cidade:
                    cidade = match.group(1).strip()
                if not estado:
                    estado = match.group(2).strip()
    
    return cidade, estado

def validar_odontologia(place):
    categories = place.get("categories", []) or []
    categories_str = " ".join(categories) if isinstance(categories, list) else str(categories)
    reviews = place.get("reviewsCount", 0) or place.get("reviewCount", 0) or 0
    
    if reviews < 40:
        return False, f"Menos de 40 avaliações ({reviews})"
    
    cat_lower = categories_str.lower()
    categorias_validas = ["dentist", "dental_clinic", "dental clinic", "clinica odontologica", "consultorio odontologico", 
                          "orthodontist", "endodontist", "periodontist", "oral surgeon", "implantologist",
                          "odontologia", "clinica odontológica"]
    if not any(cat in cat_lower for cat in categorias_validas):
        return False, f"Categoria inválida: {categories_str}"
    
    if any(x in cat_lower for x in ["hospital", "clinica geral", "general clinic", "medical clinic", "physician"]):
        return False, "Clínica geral / hospital"
    
    return True, "Qualificado"

def validar_petshop(place):
    categories = place.get("categories", []) or []
    categories_str = " ".join(categories) if isinstance(categories, list) else str(categories)
    reviews = place.get("reviewsCount", 0) or place.get("reviewCount", 0) or 0
    
    if reviews < 30:
        return False, f"Menos de 30 avaliações ({reviews})"
    
    cat_lower = categories_str.lower()
    categorias_validas = ["pet_store", "pet store", "pet_groomer", "pet groomer", "pet shop", "banho e tosa", 
                          "grooming", "animal_groomer", "pet_care", "pet supply store", "banho", "tosa"]
    if not any(cat in cat_lower for cat in categorias_validas):
        return False, f"Categoria inválida: {categories_str}"
    
    if any(x in cat_lower for x in ["veterinarian", "veterinary", "clinica veterinaria", "animal hospital", 
                                    "veterinario", "veterinary_care", "hospital veterin"]):
        return False, "É clínica veterinária"
    
    if "pet_store" in cat_lower and "pet_groomer" not in cat_lower and "grooming" not in cat_lower and "banho" not in cat_lower and "tosa" not in cat_lower:
        return True, "Qualificado (verificar se tem banho/tosa no site)"
    
    return True, "Qualificado"

def detectar_segmento(place):
    categories = place.get("categories", []) or []
    categories_str = " ".join(categories) if isinstance(categories, list) else str(categories)
    cat_lower = categories_str.lower()
    
    if any(x in cat_lower for x in ["dentist", "dental_clinic", "dental clinic", "orthodontist", "endodontist", 
                                     "periodontist", "oral surgeon", "implantologist", "odontologia"]):
        return "odontologia"
    if any(x in cat_lower for x in ["pet_store", "pet_groomer", "pet shop", "grooming", "pet_care", 
                                     "pet supply store", "animal_groomer", "banho", "tosa"]):
        return "pet_shop"
    return "desconhecido"

def detectar_bonus_prioridade(place, segmento):
    sinais = []
    name = extrair_nome(place).lower()
    
    if segmento == "odontologia":
        reviews = place.get("reviewsCount", 0) or place.get("reviewCount", 0) or 0
        if reviews > 100:
            sinais.append("Possível multi-dentistas (100+ avaliações)")
        if any(x in name for x in ["clinica", "centro", "instituto", "group", "associados", "&", "associadas", "odonto", "dental", "sorriso"]):
            sinais.append("Nome sugere multi-dentistas")
    
    elif segmento == "pet_shop":
        sinais.append("Verificar se tem delivery/buscar-levar no site")
        if any(x in name for x in ["delivery", "mobil", "movel", "buscar", "levar", "domicilio", "delivery", "express"]):
            sinais.append("Nome sugere delivery/móvel")
    
    return sinais

# Processar
leads_prioridade = []
leads_qualificados = []
leads_rejeitados = []

for place in items:
    nome = extrair_nome(place)
    website = extrair_website(place)
    
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
            "motivo": f"Segmento não identificado: {segmento}",
            "place_id": place.get("placeId") or place.get("cid"),
            "categorias": place.get("categories", [])
        })
        continue
    
    if not valido:
        reviews = place.get("reviewsCount", 0) or place.get("reviewCount", 0) or 0
        leads_rejeitados.append({
            "nome": nome,
            "motivo": motivo,
            "place_id": place.get("placeId") or place.get("cid"),
            "avaliacoes": reviews,
            "categoria": place.get("categories", [])
        })
        continue
    
    # Lead válido
    reviews = place.get("reviewsCount", 0) or place.get("reviewCount", 0) or 0
    phone = place.get("phone") or place.get("phoneNumber") or place.get("internationalPhoneNumber") or place.get("formattedPhoneNumber") or ""
    endereco = place.get("address") or place.get("fullAddress") or place.get("formattedAddress") or ""
    cidade, estado = extrair_cidade_estado(place)
    
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

# ===== LIMPEZA PÓS-PROCESSAMENTO =====

def eh_vet_red_flag(lead):
    cats = lead.get("categoria_oficial", [])
    if not cats:
        return False
    cat_str = " ".join(cats).lower()
    vet_kw = ["veterin", "veterinary", "animal hospital", "hospital veterin", "clinica veterin"]
    return any(kw in cat_str for kw in vet_kw)

def tem_banho_tosa(lead):
    cats = lead.get("categoria_oficial", [])
    if not cats:
        return False
    cat_str = " ".join(cats).lower()
    banho_kw = ["banho", "tosa", "grooming", "pet_groomer"]
    return any(kw in cat_str for kw in banho_kw)

# Aplicar limpeza
def limpar_leads(leads_list):
    limpos = []
    rejeitados = []
    for lead in leads_list:
        red_flags = []
        if lead["segmento"] == "pet_shop":
            if eh_vet_red_flag(lead):
                red_flags.append("clinica_veterinaria")
            if not tem_banho_tosa(lead):
                red_flags.append("sem_banho_tosa_nas_categorias")
        if not lead.get("url") or not eh_url_valida(lead.get("url", "")):
            red_flags.append("sem_site_proprio_valido")
        
        if red_flags:
            lead["score_validacao"] = "rejeitado"
            lead["red_flags"] = red_flags
            rejeitados.append(lead)
        else:
            limpos.append(lead)
    return limpos, rejeitados

leads_prioridade_limpos, rejeitados_prioridade = limpar_leads(leads_prioridade)
leads_qualificados_limpos, rejeitados_qualificados = limpar_leads(leads_qualificados)

todos_rejeitados = leads_rejeitados + rejeitados_prioridade + rejeitados_qualificados

# Salvar resultado final
resultado = {
    "campanha": "apify-google-maps-odontologia-petshop-expanded",
    "data_geracao": datetime.now().isoformat(),
    "total_leads": len(leads_prioridade_limpos) + len(leads_qualificados_limpos),
    "leads_prioridade": len(leads_prioridade_limpos),
    "leads_qualificados": len(leads_qualificados_limpos),
    "leads_rejeitados": len(todos_rejeitados),
    "nichos": ["odontologia", "pet_shop"],
    "leads_prioridade": leads_prioridade_limpos,
    "leads_qualificados": leads_qualificados_limpos,
    "rejeitados": todos_rejeitados[:100]
}

output_path = r"C:\Users\T-GAMER\fluxo de agentes\dados\leads.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(resultado, f, ensure_ascii=False, indent=2)

print(f"\n=== RESULTADO FINAL ===")
print(f"Leads PRIORIDADE: {len(leads_prioridade_limpos)}")
print(f"Leads QUALIFICADOS: {len(leads_qualificados_limpos)}")
print(f"Leads REJEITADOS: {len(todos_rejeitados)}")
print(f"Total válidos: {len(leads_prioridade_limpos) + len(leads_qualificados_limpos)}")
print(f"Salvo em: {output_path}")

for seg in ["odontologia", "pet_shop"]:
    p = sum(1 for l in leads_prioridade_limpos if l["segmento"] == seg)
    q = sum(1 for l in leads_qualificados_limpos if l["segmento"] == seg)
    print(f"  {seg}: Prioridade={p}, Qualificado={q}")

from collections import Counter
cidades = Counter([f"{l['cidade']}/{l['estado']}" for l in leads_prioridade_limpos + leads_qualificados_limpos if l['cidade']])
print(f"\n--- CIDADES ---")
for cidade, count in cidades.most_common(20):
    print(f"  {cidade}: {count}")

print(f"\n--- PRIORIDADE ---")
for lead in leads_prioridade_limpos[:20]:
    print(f"  {lead['nome']} | {lead['segmento']} | {lead['avaliacoes']} aval. | {lead['cidade']}/{lead['estado']} | {lead['url']}")

print(f"\n--- QUALIFICADOS ---")
for lead in leads_qualificados_limpos[:20]:
    print(f"  {lead['nome']} | {lead['segmento']} | {lead['avaliacoes']} aval. | {lead['cidade']}/{lead['estado']} | {lead['url']}")