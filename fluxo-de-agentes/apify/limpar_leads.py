import json
import re
from datetime import datetime

# Carregar leads atuais
with open(r"C:\Users\T-GAMER\fluxo de agentes\dados\leads.json", "r", encoding="utf-8") as f:
    data = json.load(f)

leads_prioridade = data.get("leads_prioridade", [])
leads_qualificados = data.get("leads_qualificados", [])

def extrair_nome_do_endereco_ou_url(lead):
    """Tenta extrair nome do endereco ou URL"""
    # Do endereco
    endereco = lead.get("endereco", "")
    if endereco:
        # Padrao: "Nome da Rua, Numero - Bairro, Cidade - UF"
        # Tentar pegar o que vem antes do primeiro " - " ou ","
        partes = endereco.split(" - ")
        if len(partes) > 1:
            primeira_parte = partes[0]
            # Se tem numero no inicio, pode ser o nome
            if not primeira_parte[0].isdigit():
                return primeira_parte.strip()
    
    # Da URL
    url = lead.get("url", "")
    if url and "google.com/maps" not in url:
        # Extrair dominio
        dominio = url.replace("https://", "").replace("http://", "").split("/")[0]
        # Remover www
        dominio = dominio.replace("www.", "")
        # Capitalizar primeira letra de cada parte
        partes = dominio.split(".")
        if len(partes) >= 2:
            return partes[0].capitalize()
    
    return "Nome nao identificado"

def extrair_estado_do_endereco(endereco):
    """Extrai UF do endereco"""
    if not endereco:
        return ""
    # Procurar padrao: ", UF, " ou " - UF, " ou " UF, "
    padroes = [
        r",\s*([A-Z]{2}),\s*\d{5}",  # , PE, 52051
        r",\s*([A-Z]{2})\s*$",       # , PE no final
        r"-\s*([A-Z]{2}),",          # - PE,
        r"\s([A-Z]{2})\s*\d{5}",     # PE 52051
    ]
    for padrao in padroes:
        match = re.search(padrao, endereco)
        if match:
            return match.group(1)
    return ""

def extrair_cidade_do_endereco(endereco):
    """Extrai cidade do endereco"""
    if not endereco:
        return ""
    # Procurar padrao: "Cidade - UF" ou "Cidade, UF"
    padroes = [
        r"([A-Za-z\s]+)\s*-\s*[A-Z]{2}\s*,",  # Cidade - UF,
        r"([A-Za-z\s]+),\s*[A-Z]{2}\s*\d{5}",  # Cidade, UF 12345
        r"([A-Za-z\s]+),\s*[A-Z]{2}\s*$",      # Cidade, UF no final
    ]
    for padrao in padroes:
        match = re.search(padrao, endereco)
        if match:
            return match.group(1).strip()
    return ""

def eh_url_valida(url):
    """Verifica se e uma URL de site real (nao Google Maps, Instagram, WhatsApp, etc)"""
    if not url:
        return False
    url_lower = url.lower()
    # Rejeitar URLs conhecidas que nao sao sites proprios
    rejected = [
        "google.com/maps",
        "instagram.com",
        "api.whatsapp.com",
        "bit.ly",
        "bio.site",
        "wa.me",
        "linktr.ee",
        "linkbio.co",
    ]
    for r in rejected:
        if r in url_lower:
            return False
    # Aceitar se tem dominio proprio
    return True

def eh_veterinaria(categorias):
    """Verifica se e clinica veterinaria"""
    if not categorias:
        return False
    cat_str = " ".join(categorias).lower()
    vet_keywords = ["veterin", "veterinary", "animal hospital", "hospital veterin", "clinica veterin"]
    return any(kw in cat_str for kw in vet_keywords)

def tem_banho_tosa(categorias):
    if not categorias:
        return False
    cat_str = " ".join(categorias).lower()
    banho_keywords = ["banho", "tosa", "grooming", "pet_groomer"]
    return any(kw in cat_str for kw in banho_keywords)

# Processar todos os leads
todos_leads = leads_prioridade + leads_qualificados
leads_limpos = []
leads_rejeitados_limpeza = []

for lead in todos_leads:
    # Corrigir nome
    if not lead.get("nome") or lead["nome"] == "None" or lead["nome"] == "null":
        lead["nome"] = extrair_nome_do_endereco_ou_url(lead)
    
    # Corrigir estado
    if not lead.get("estado"):
        lead["estado"] = extrair_estado_do_endereco(lead.get("endereco", ""))
    
    # Corrigir cidade
    if not lead.get("cidade"):
        lead["cidade"] = extrair_cidade_do_endereco(lead.get("endereco", ""))
    
    # Verificar se URL e valida
    url_original = lead.get("url", "")
    if not eh_url_valida(url_original):
        lead["url_original_maps"] = url_original
        lead["url"] = ""
        lead["observacoes"] = (lead.get("observacoes", "") + " | URL do Google Maps - site nao identificado").strip(" |")
    
    # Verificar se e veterinaria (red flag para pet_shop)
    if lead["segmento"] == "pet_shop" and eh_veterinaria(lead.get("categoria_oficial", [])):
        lead["red_flag_veterinaria"] = True
        lead["observacoes"] = (lead.get("observacoes", "") + " | RED FLAG: Clinica veterinaria detectada nas categorias").strip(" |")
    
    # Verificar se pet shop tem banho/tosa
    if lead["segmento"] == "pet_shop":
        tem_servico = tem_banho_tosa(lead.get("categoria_oficial", []))
        if not tem_servico:
            lead["red_flag_sem_servico"] = True
            lead["observacoes"] = (lead.get("observacoes", "") + " | RED FLAG: Nao tem banho/tosa nas categorias").strip(" |")
    
    # Classificar score final
    red_flags = []
    if lead.get("red_flag_veterinaria"):
        red_flags.append("clinica_veterinaria")
    if lead.get("red_flag_sem_servico"):
        red_flags.append("sem_banho_tosa")
    if not lead.get("url"):
        red_flags.append("sem_site_proprio")
    
    if red_flags:
        lead["score_validacao"] = "rejeitado"
        lead["red_flags"] = red_flags
        leads_rejeitados_limpeza.append(lead)
    elif lead["score_validacao"] == "prioridade":
        leads_limpos.append(lead)
    else:
        leads_limpos.append(lead)

# Separar por score
leads_prioridade_final = [l for l in leads_limpos if l["score_validacao"] == "prioridade"]
leads_qualificados_final = [l for l in leads_limpos if l["score_validacao"] == "qualificado"]

# Estatisticas
print(f"=== LIMPEZA CONCLUIDA ===")
print(f"Total processados: {len(todos_leads)}")
print(f"Leads validos (prioridade): {len(leads_prioridade_final)}")
print(f"Leads validos (qualificados): {len(leads_qualificados_final)}")
print(f"Leads rejeitados na limpeza: {len(leads_rejeitados_limpeza)}")

# Por segmento
for seg in ["odontologia", "pet_shop"]:
    p = sum(1 for l in leads_prioridade_final if l["segmento"] == seg)
    q = sum(1 for l in leads_qualificados_final if l["segmento"] == seg)
    r = sum(1 for l in leads_rejeitados_limpeza if l["segmento"] == seg)
    print(f"  {seg}: Prioridade={p}, Qualificado={q}, Rejeitado={r}")

# Por cidade
from collections import Counter
cidades = Counter([f"{l['cidade']}/{l['estado']}" for l in leads_prioridade_final + leads_qualificados_final if l['cidade']])
print(f"\n--- TOP CIDADES ---")
for cidade, count in cidades.most_common(10):
    print(f"  {cidade}: {count}")

# Com site proprio
com_site = sum(1 for l in leads_prioridade_final + leads_qualificados_final if l.get("url"))
sem_site = sum(1 for l in leads_prioridade_final + leads_qualificados_final if not l.get("url"))
print(f"\nCom site proprio: {com_site}")
print(f"Sem site proprio (so Maps): {sem_site}")

# Salvar resultado limpo
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
print(f"\n--- EXEMPLOS PRIORIDADE (LIMPOS) ---")
for lead in leads_prioridade_final[:10]:
    site = lead.get("url") or "SEM SITE PROPRIO"
    flags = lead.get("red_flags", [])
    flag_str = f" [{','.join(flags)}]" if flags else ""
    print(f"  {lead['nome']} | {lead['segmento']} | {lead['avaliacoes']} aval. | {lead['cidade']}/{lead['estado']} | {site}{flag_str}")

print(f"\n--- EXEMPLOS QUALIFICADOS (LIMPOS) ---")
for lead in leads_qualificados_final[:10]:
    site = lead.get("url") or "SEM SITE PROPRIO"
    print(f"  {lead['nome']} | {lead['segmento']} | {lead['avaliacoes']} aval. | {lead['cidade']}/{lead['estado']} | {site}")