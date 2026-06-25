import os
import json
import time
from apify_client import ApifyClient
from datetime import datetime
from collections import Counter
from dotenv import load_dotenv

# Load environment
env_path = os.path.join(os.path.dirname(__file__), "..", "config", ".env")
load_dotenv(env_path)

APIFY_TOKEN = os.getenv("APIFY_API_TOKEN")
if not APIFY_TOKEN:
    raise ValueError("APIFY_API_TOKEN nao encontrado no .env")

client = ApifyClient(APIFY_TOKEN)

# ============================================================
# CIDADES EXPANDIDAS - TODAS as cidades do Brasil
# ============================================================
TODAS_CIDADES = [
    # Capitais e grandes cidades
    "Sao Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba",
    "Salvador", "Fortaleza", "Recife", "Porto Alegre",
    "Manaus", "Brasilia", "Belem", "Goiania",
    "Guarulhos", "Campinas", "Sao Luis", "Maceio",
    "Campo Grande", "Teresina", "Joao Pessoa", "Natal",
    "Cuiaba", "Aracaju", "Florianopolis", "Vitoria",
    # Cidades intermediarias
    "Santos", "Ribeirao Preto", "Uberlandia", "Juiz de Fora",
    "Joinville", "Blumenau", "Niteroi", "Feira de Santana",
    "Caxias do Sul", "Londrina", "Maringa", "Olinda",
    "Ananindeua", "Niteroi", "Sao Bernardo do Campo",
    "Santo Andre", "Osasco", "Jundiai", "Ribeirao Preto",
    "Uberlandia", "Contagem", "Betim", "Montes Claros",
    "Uberaba", "Governador Valadares", "Ipatinga",
    "Bauru", "Marilia", "Presidente Prudente", "Sao Jose do Rio Preto",
    "Sorocaba", "Piracicaba", "Franca", "Presidente Prudente",
    "Canoas", "Santa Maria", "Gravatai", "Novo Hamburgo",
    "Sao Leopoldo", "Pelotas", "Passo Fundo", "Caxias do Sul",
    "Florianopolis", "Joinville", "Blumenau", "Chapeco",
    "Criciuma", "Itajai", "Jaragua do Sul",
    "Natal", "Mossoro", "Parnamirim",
    "Joao Pessoa", "Campina Grande", "Sousa",
    "Sao Luis", "Imperatriz", "Timon",
    "Belem", "Ananindeua", "Maraba",
    "Manaus", "Parintins", "Itacoatiara",
    "Macapa", "Santana",
    "Rio Branco", "Cruzeiro do Sul",
    "Porto Velho", "Ji-Parana",
    "Boa Vista",
    "Teresina", "Parnaiba", "Picos",
    "Maceio", "Arapiraca", "Palmeira dos Indios",
    "Aracaju", "Nossa Senhora do Socorro", "Lagarto",
    "Vitoria", "Vila Velha", "Cariacica", "Serra",
    "Goiania", "Aparecida de Goiania", "Anapolis",
    "Cuiaba", "Varzea Grande", "Rondonopolis",
    "Campo Grande", "Dourados", "Tres Lagoas",
    "Brasilia", "Taguatinga", "Ceilandia", "Samambaia",
    "Guarulhos", "Sao Bernardo do Campo", "Santo Andre", "Osasco",
    "Sao Jose dos Campos", "Sao Jose dos Pinhais", "Colombo",
    "Londrina", "Maringa", "Cascavel", "Toledo",
    "Foz do Iguacu", "Ponta Grossa", "Guarapuava",
    "Caxias do Sul", "Pelotas", "Santa Maria", "Passo Fundo",
    "Novo Hamburgo", "Canoas", "Gravatai", "Sao Leopoldo",
    "Feira de Santana", "Vitoria da Conquista", "Ilheus", "Itabuna",
    "Juazeiro do Norte", "Crato", "Sobral", "Juazeiro",
    "Petrolina", "Caruaru", "Garanhuns",
    "Mossoro", "Parnamirim", "Caico",
    "Macapa", "Santana",
    "Rio Branco", "Cruzeiro do Sul",
    "Porto Velho", "Ji-Parana",
    "Boa Vista",
    "Teresina", "Parnaiba", "Picos",
    "Maceio", "Arapiraca", "Palmeira dos Indios",
    "Aracaju", "Nossa Senhora do Socorro", "Lagarto",
    "Vitoria", "Vila Velha", "Cariacica", "Serra",
    "Goiania", "Aparecida de Goiania", "Anapolis",
    "Cuiaba", "Varzea Grande", "Rondonopolis",
    "Campo Grande", "Dourados", "Tres Lagoas",
    "Brasilia", "Taguatinga", "Ceilandia", "Samambaia",
    "Guarulhos", "Sao Bernardo do Campo", "Santo Andre", "Osasco",
    "Sao Jose dos Campos", "Sao Jose dos Pinhais", "Colombo",
    "Londrina", "Maringa", "Cascavel", "Toledo",
    "Foz do Iguacu", "Ponta Grossa", "Guarapuava",
    "Caxias do Sul", "Pelotas", "Santa Maria", "Passo Fundo",
    "Novo Hamburgo", "Canoas", "Gravatai", "Sao Leopoldo",
    "Feira de Santana", "Vitoria da Conquista", "Ilheus", "Itabuna",
    "Juazeiro do Norte", "Crato", "Sobral", "Juazeiro",
    "Petrolina", "Caruaru", "Garanhuns",
    "Mossoro", "Parnamirim", "Caico",
]

# Remove duplicatas mantendo ordem
seen = set()
CIDADES = []
for c in TODAS_CIDADES:
    if c not in seen:
        seen.add(c)
        CIDADES.append(c)

print(f"Total de cidades unicas: {len(CIDADES)}")

# ============================================================
# BATCHES DE BUSCA - 10 termos por batch para evitar rate limit
# ============================================================
def criar_batches_pet_shop(cidades, batch_size=10):
    """Cria batches de busca para pet shop"""
    batches = []
    termos = ["pet shop", "banho e tosa"]
    batch = []
    for cidade in cidades:
        for termo in termos:
            batch.append(f"{termo} {cidade}")
            if len(batch) >= batch_size:
                batches.append(batch)
                batch = []
    if batch:
        batches.append(batch)
    return batches

def criar_batches_odonto(cidades, batch_size=10):
    """Cria batches de busca para odontologia"""
    batches = []
    termos = ["clinica odontologica", "dentista"]
    batch = []
    for cidade in cidades:
        for termo in termos:
            batch.append(f"{termo} {cidade}")
            if len(batch) >= batch_size:
                batches.append(batch)
                batch = []
    if batch:
        batches.append(batch)
    return batches

batches_pet = criar_batches_pet_shop(CIDADES, batch_size=10)
batches_odonto = criar_batches_odonto(CIDADES, batch_size=10)

print(f"Batches Pet Shop: {len(batches_pet)}")
print(f"Batches Odontologia: {len(batches_odonto)}")
print(f"Total de batches: {len(batches_pet) + len(batches_odonto)}")
print()

# ============================================================
# FUNCOES DE VALIDACAO
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
# EXECUTAR BATCHES
# ============================================================
todos_leads = []
leads_vistos = set()  # Para deduplicar por place_id
erros = []

for i, batch in enumerate(batches_pet + batches_odonto):
    batch_num = i + 1
    total_batches = len(batches_pet) + len(batches_odonto)
    tipo = "PET SHOP" if i < len(batches_pet) else "ODONTO"
    
    print(f"\n{'='*60}")
    print(f"  BATCH {batch_num}/{total_batches} - {tipo}")
    print(f"  Termos: {len(batch)}")
    print(f"  Primeiro: {batch[0]}")
    print(f"{'='*60}")
    
    actor_input = {
        "searchStringsArray": batch,
        "maxPlacesPerSearch": 50,
        "language": "pt-BR",
        "country": "BR",
        "maxReviews": 0,
        "maxImages": 0,
        "skipClosed": True,
        "onlyOpenNow": False,
        "minRating": 3.5,
        "maxRating": 5,
        "minReviews": 20,  # Reduzido para pegar mais leads
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
        
        print(f"  Resultados brutos: {len(items)}")
        
        # Processar resultados
        batch_leads = 0
        for place in items:
            place_id = place.get("placeId") or place.get("cid")
            
            # Deduplicar
            if place_id in leads_vistos:
                continue
            leads_vistos.add(place_id)
            
            nome = extrair_nome(place)
            website = extrair_website(place)
            
            if not website or not eh_url_valida(website):
                continue
            
            segmento = detectar_segmento(place)
            
            if segmento == "odontologia":
                valido, motivo = validar_odontologia(place)
            elif segmento == "pet_shop":
                valido, motivo = validar_petshop(place)
            else:
                continue
            
            if not valido:
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
                "place_id": place_id,
                "sinais_dor": detectar_bonus_prioridade(place, segmento),
                "observacoes": motivo,
                "data_coleta": datetime.now().isoformat()
            }
            
            sinais_str = str(lead["sinais_dor"])
            if ("multi-dentistas" in sinais_str and segmento == "odontologia") or segmento == "pet_shop":
                lead["score_validacao"] = "prioridade"
            else:
                lead["score_validacao"] = "qualificado"
            
            todos_leads.append(lead)
            batch_leads += 1
        
        print(f"  Leads validados neste batch: {batch_leads}")
        print(f"  Total acumulado: {len(todos_leads)}")
        
    except Exception as e:
        print(f"  ERRO: {e}")
        erros.append({"batch": batch_num, "erro": str(e)})
    
    # Pausa entre batches para evitar rate limit
    if batch_num < total_batches:
        print(f"  Pausa de 5 segundos...")
        time.sleep(5)

# ============================================================
# RELATORIO FINAL
# ============================================================
print(f"\n{'='*60}")
print(f"  RELATORIO FINAL - COLETA EM MASSA")
print(f"{'='*60}")
print(f"  Data: {datetime.now().strftime('%d/%m/%Y %H:%M')}")
print(f"  Cidades buscadas: {len(CIDADES)}")
print(f"  Batches executados: {len(batches_pet) + len(batches_odonto)}")
print(f"  Erros: {len(erros)}")
print(f"  Total leads validados: {len(todos_leads)}")

# Por segmento
leads_prioridade = [l for l in todos_leads if l["score_validacao"] == "prioridade"]
leads_qualificados = [l for l in todos_leads if l["score_validacao"] == "qualificado"]

print(f"\n--- POR SEGMENTO ---")
print(f"  Odontologia Prioridade: {sum(1 for l in leads_prioridade if l['segmento']=='odontologia')}")
print(f"  Odontologia Qualificado: {sum(1 for l in leads_qualificados if l['segmento']=='odontologia')}")
print(f"  Pet Shop Prioridade: {sum(1 for l in leads_prioridade if l['segmento']=='pet_shop')}")
print(f"  Pet Shop Qualificado: {sum(1 for l in leads_qualificados if l['segmento']=='pet_shop')}")

# Por cidade
todas_cidades = []
for lead in todos_leads:
    if lead['cidade']:
        todas_cidades.append(f"{lead['cidade']}/{lead['estado']}")
cidades_count = Counter(todas_cidades)
print(f"\n--- DISTRIBUICAO POR CIDADE (Top 30) ---")
for cidade, count in cidades_count.most_common(30):
    print(f"  {cidade}: {count}")

# Top leads
print(f"\n--- TOP 20 LEADS POR AVALIACOES ---")
for lead in sorted(todos_leads, key=lambda x: x.get("avaliacoes", 0), reverse=True)[:20]:
    print(f"  {lead['nome']} | {lead['segmento']} | {lead['avaliacoes']} aval. | {lead['rating']}⭐ | {lead['cidade']}/{lead['estado']}")

# Salvar resultado
timestamp = datetime.now().strftime("%Y%m%d_%H%M")
resultado = {
    "campanha": "apify-coleta-massa",
    "data_geracao": datetime.now().isoformat(),
    "total_cidades": len(CIDADES),
    "total_batches": len(batches_pet) + len(batches_odonto),
    "erros": erros,
    "total_leads": len(todos_leads),
    "leads_prioridade": len(leads_prioridade),
    "leads_qualificados": len(leads_qualificados),
    "leads_dados": todos_leads
}

output_dir = os.path.join(os.path.dirname(__file__), "..", "dados")
os.makedirs(output_dir, exist_ok=True)

output_path = os.path.join(output_dir, f"leads_massa_{timestamp}.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(resultado, f, ensure_ascii=False, indent=2)

# Salvar tambem como leads.json principal
main_path = os.path.join(output_dir, "leads.json")
with open(main_path, "w", encoding="utf-8") as f:
    json.dump(resultado, f, ensure_ascii=False, indent=2)

print(f"\n  Arquivo salvo: {output_path}")
print(f"  Arquivo principal: {main_path}")
print(f"\n{'='*60}")
print(f"  FIM DA COLETA")
print(f"{'='*60}")
