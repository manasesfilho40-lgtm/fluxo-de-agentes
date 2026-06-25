import json
import re
from datetime import datetime

with open(r"C:\Users\T-GAMER\fluxo de agentes\dados\leads.json", "r", encoding="utf-8") as f:
    data = json.load(f)

leads_prioridade = data.get("leads_prioridade", [])
leads_qualificados = data.get("leads_qualificados", [])

def extrair_nome(place):
    """Extrai nome do title ou name"""
    return (place.get("title") or 
            place.get("name") or 
            place.get("displayName", {}).get("text") if isinstance(place.get("displayName"), dict) else place.get("displayName") or
            "Sem nome")

def extrair_website(place):
    """Extrai website real (não Google Maps, não social, não forms)"""
    website = place.get("website") or place.get("url") or place.get("homepage")
    if website and "google.com/maps" in website:
        return None
    return website

def eh_url_valida(url):
    """Verifica se é URL de site próprio decente"""
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
    # Deve ter domínio próprio
    return "." in url and "http" in url

def extrair_cidade_estado(place):
    """Extrai cidade e estado dos campos estruturados"""
    cidade = place.get("city") or ""
    estado = place.get("state") or ""
    
    # Se veio nome do estado por extenso, pegar sigla
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
    
    # Tentar do endereço se não tiver
    if not cidade or not estado:
        endereco = place.get("address") or place.get("fullAddress") or place.get("formattedAddress") or ""
        if endereco:
            # Padrão: "Rua X, 123 - Bairro, Cidade - UF, CEP, Brasil"
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
    
    # Red flag: veterinário
    if any(x in cat_lower for x in ["veterinarian", "veterinary", "clinica veterinaria", "animal hospital", 
                                    "veterinario", "veterinary_care", "hospital veterin"]):
        return False, "É clínica veterinária"
    
    # Verificar se só loja de produtos
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

# Re-processar os dados brutos do Apify (precisa dos dados originais)
# Vamos usar o que já temos no leads.json mas extrair melhor

def processar_lead_existente(lead):
    """Tenta melhorar um lead já processado"""
    # Tentar extrair nome da URL
    url = lead.get("url", "")
    if lead.get("nome") in ["Sem nome", "None", None, "null"]:
        if url:
            # Extrair do domínio
            dominio = url.replace("https://", "").replace("http://", "").split("/")[0]
            dominio = dominio.replace("www.", "")
            partes = dominio.split(".")
            if len(partes) >= 2:
                nome_base = partes[0]
                # Capitalizar
                lead["nome"] = nome_base.replace("-", " ").replace("_", " ").title()
            else:
                lead["nome"] = "Nome não identificado"
    
    # Corrigir cidade/estado
    if lead.get("cidade") == "Brasil" or not lead.get("cidade"):
        endereco = lead.get("endereco", "")
        if endereco:
            match = re.search(r",\s*([A-Za-zÀ-ÿ\s]+)\s*-\s*([A-Z]{2})\s*,", endereco)
            if match:
                lead["cidade"] = match.group(1).strip()
                lead["estado"] = match.group(2).strip()
    
    return lead

def eh_vet_red_flag(lead):
    """Verifica se é clínica veterinária"""
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

# Processar todos
todos_leads = leads_prioridade + leads_qualificados
leads_limpos = []
leads_rejeitados_limpeza = []

for lead in todos_leads:
    lead = processar_lead_existente(lead)
    
    # Validar URL
    url = lead.get("url", "")
    if not eh_url_valida(url):
        lead["url_original_maps"] = url
        lead["url"] = ""
        lead["observacoes"] = (lead.get("observacoes", "") + " | URL inválida (social/forms/aggregator)").strip(" |")
    
    # Red flags
    red_flags = []
    if lead["segmento"] == "pet_shop":
        if eh_vet_red_flag(lead):
            red_flags.append("clinica_veterinaria")
        if not tem_banho_tosa(lead):
            red_flags.append("sem_banho_tosa_nas_categorias")
    if not lead.get("url"):
        red_flags.append("sem_site_proprio_valido")
    
    if red_flags:
        lead["score_validacao"] = "rejeitado"
        lead["red_flags"] = red_flags
        leads_rejeitados_limpeza.append(lead)
    else:
        leads_limpos.append(lead)

# Separar por score
leads_prioridade_final = [l for l in leads_limpos if l["score_validacao"] == "prioridade"]
leads_qualificados_final = [l for l in leads_limpos if l["score_validacao"] == "qualificado"]

# Estatísticas
print(f"=== LIMPEZA MELHORADA ===")
print(f"Total processados: {len(todos_leads)}")
print(f"Leads válidos (prioridade): {len(leads_prioridade_final)}")
print(f"Leads válidos (qualificados): {len(leads_qualificados_final)}")
print(f"Leads rejeitados na limpeza: {len(leads_rejeitados_limpeza)}")

for seg in ["odontologia", "pet_shop"]:
    p = sum(1 for l in leads_prioridade_final if l["segmento"] == seg)
    q = sum(1 for l in leads_qualificados_final if l["segmento"] == seg)
    r = sum(1 for l in leads_rejeitados_limpeza if l["segmento"] == seg)
    print(f"  {seg}: Prioridade={p}, Qualificado={q}, Rejeitado={r}")

# Por cidade
from collections import Counter
cidades = Counter([f"{l['cidade']}/{l['estado']}" for l in leads_prioridade_final + leads_qualificados_final if l['cidade']])
print(f"\n--- TOP CIDADES ---")
for cidade, count in cidades.most_common(15):
    print(f"  {cidade}: {count}")

# Salvar
resultado_limpo = {
    "campanha": "apify-google-maps-odontologia-petshop",
    "data_geracao": datetime.now().isoformat(),
    "total_leads": len(leads_prioridade_final) + len(leads_qualificados_final),
    "leads_prioridade": len(leads_prioridade_final),
    "leads_qualificados": len(leads_qualificados_final),
    "leads_rejeitados": len(leads_rejeitados_limpeza),
    "nichos": ["odontologia", "pet_shop"],
    "leads_prioridade": leads_prioridade_final,
    "leads_qualificados": leads_qualificados_final,
    "rejeitados_limpeza": leads_rejeitados_limpeza
}

output_path = r"C:\Users\T-GAMER\fluxo de agentes\dados\leads_limpos.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(resultado_limpo, f, ensure_ascii=False, indent=2)

print(f"\nSalvo em: {output_path}")

# Mostrar exemplos finais
print(f"\n--- PRIORIDADE ---")
for lead in leads_prioridade_final:
    flags = lead.get("red_flags", [])
    flag_str = f" [{','.join(flags)}]" if flags else ""
    print(f"  {lead['nome']} | {lead['segmento']} | {lead['avaliacoes']} aval. | {lead['cidade']}/{lead['estado']} | {lead['url']}{flag_str}")

print(f"\n--- QUALIFICADOS ---")
for lead in leads_qualificados_final:
    print(f"  {lead['nome']} | {lead['segmento']} | {lead['avaliacoes']} aval. | {lead['cidade']}/{lead['estado']} | {lead['url']}")