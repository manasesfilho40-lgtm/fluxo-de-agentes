import json
import re

# ============================================================
# LER DADOS EXISTENTES
# ============================================================
with open(r"C:\Users\THIAGO\Nova pasta\fluxo-de-agentes\dados\leads_expandido_20260625_1458.json", "r", encoding="utf-8") as f:
    data = json.load(f)

leads_com_site = data.get("leads_prioridade_dados", []) + data.get("leads_qualificados_dados", [])
rejeitados = data.get("rejeitados_resumo", [])

print(f"=== REPROCESSAMENTO DE LEADS ===")
print(f"Leads COM site (descartar): {len(leads_com_site)}")
print(f"Rejeitados analisar: {len(rejeitados)}")

# ============================================================
# CRITERIOS: lead SEM site = bom pra gente
# ============================================================
# URLs que NAO sao site proprio (sao redes sociais/mensageiros)
nao_site_patterns = [
    "wa.me/", "api.whatsapp.com", "instagram.com", "facebook.com",
    "fb.com", "linktr.ee", "bio.site", "linkbio.co", "bit.ly",
    "google.com/maps", "wixsite.com", "forms.", "formonline",
    "doctoralia.com.br", "zoop.pet", "p3w.com.br"
]

def eh_url_valida(url):
    """Verifica se URL e um site proprio real"""
    if not url:
        return False
    url_lower = url.lower()
    for pattern in nao_site_patterns:
        if pattern in url_lower:
            return False
    return "." in url and "http" in url

def eh_redes_sociais(url):
    """Verifica se URL e rede social/mensageiro"""
    if not url:
        return False
    url_lower = url.lower()
    for pattern in ["wa.me", "instagram.com", "facebook.com", "linktr.ee", "bio.site", "linkbio.co"]:
        if pattern in url_lower:
            return True
    return False

# ============================================================
# CLASSIFICAR REJEITADOS
# ============================================================
sem_site_puro = []          # Sem nenhum site/URL
so_redes_sociais = []       # Só WhatsApp/Instagram/Linktree
sem_site_com_cat = []       # Sem site mas tem categorias do Maps
rejeitados_outros = []      # Outros motivos (poucas avaliacoes, etc.)

for r in rejeitados:
    nome = r.get("nome", "Desconhecido")
    motivo = r.get("motivo", "")
    url = r.get("website_original")
    categorias = r.get("categorias", [])
    avaliacoes = r.get("avaliacoes", 0)
    
    # Classificar por motivo
    if url is None or "Sem site valido" in motivo:
        # Nenhum site - PERFEITO
        sem_site_puro.append(r)
    elif eh_redes_sociais(url):
        # Só redes sociais/mensageiro - OTIMO
        so_redes_sociais.append(r)
    elif "Segmento nao identificado" in motivo and categorias:
        # Bug do scraper - categorias corretas mas nao identificadas
        sem_site_com_cat.append(r)
    else:
        rejeitados_outros.append(r)

print(f"\n--- CLASSIFICACAO DOS REJEITADOS ---")
print(f"  Sem nenhum site (perfeito): {len(sem_site_puro)}")
print(f"  So redes sociais (otimo): {len(so_redes_sociais)}")
print(f"  Sem site + categorias corretas: {len(sem_site_com_cat)}")
print(f"  Outros motivos: {len(rejeitados_outros)}")

# ============================================================
# COMBINAR TODOS OS LEADS SEM SITE
# ============================================================
leads_sem_site = []

# 1. Sem nenhum site
for r in sem_site_puro:
    leads_sem_site.append({
        "nome": r["nome"],
        "url": None,
        "tem_site": False,
        "motivo_original": r.get("motivo", ""),
        "place_id": r.get("place_id", ""),
        "categorias": r.get("categorias", []),
        "avaliacoes": r.get("avaliacoes", 0),
        "tipo": "sem_site_puro",
        "prioridade": "ALTA"  # Sem site = venda facil
    })

# 2. So redes sociais (WhatsApp/Instagram)
for r in so_redes_sociais:
    leads_sem_site.append({
        "nome": r["nome"],
        "url": r.get("website_original"),
        "tem_site": False,
        "tipo_rede_social": r.get("website_original", ""),
        "motivo_original": r.get("motivo", ""),
        "place_id": r.get("place_id", ""),
        "categorias": r.get("categorias", []),
        "avaliacoes": r.get("avaliacoes", 0),
        "tipo": "so_redes_sociais",
        "prioridade": "ALTA"  # So tem Instagram/WhatsApp = precisa de site
    })

# 3. Sem site + categorias corretas (bug do scraper)
for r in sem_site_com_cat:
    leads_sem_site.append({
        "nome": r["nome"],
        "url": None,
        "tem_site": False,
        "motivo_original": r.get("motivo", ""),
        "place_id": r.get("place_id", ""),
        "categorias": r.get("categorias", []),
        "avaliacoes": r.get("avaliacoes", 0),
        "tipo": "sem_site_com_categoria",
        "prioridade": "MEDIA"  # Categorias corretas mas precisa verificar avaliacoes
    })

# 4. Poucas avaliacoes (ainda sem site)
for r in rejeitados_outros:
    if r.get("avaliacoes", 0) > 0:
        leads_sem_site.append({
            "nome": r["nome"],
            "url": r.get("website_original"),
            "tem_site": False if not r.get("website_original") or eh_redes_sociais(r.get("website_original", "")) else True,
            "motivo_original": r.get("motivo", ""),
            "place_id": r.get("place_id", ""),
            "categorias": r.get("categorias", []),
            "avaliacoes": r.get("avaliacoes", 0),
            "tipo": "poucas_avaliacoes",
            "prioridade": "BAIXA"
        })

print(f"\n--- TOTAL LEADS SEM SITE ---")
print(f"  Total: {len(leads_sem_site)}")
print(f"  Alta prioridade (sem site puro + redes sociais): {sum(1 for l in leads_sem_site if l['prioridade'] == 'ALTA')}")
print(f"  Media prioridade (com categorias): {sum(1 for l in leads_sem_site if l['prioridade'] == 'MEDIA')}")
print(f"  Baixa prioridade (poucas avaliacoes): {sum(1 for l in leads_sem_site if l['prioridade'] == 'BAIXA')}")

# ============================================================
# LISTAR TODOS OS LEADS SEM SITE
# ============================================================
print(f"\n{'='*80}")
print(f"  LEADS SEM SITE - PRONTOS PARA PROSPECCAO")
print(f"{'='*80}")

print(f"\n--- ALTA PRIORIDADE: Sem nenhum site ---")
for i, lead in enumerate([l for l in leads_sem_site if l['tipo'] == 'sem_site_puro'], 1):
    cats = ", ".join(lead.get("categorias", []))
    print(f"  {i}. {lead['nome']}")
    print(f"     Categorias: {cats}")
    print(f"     Place ID: {lead['place_id']}")
    print()

print(f"\n--- ALTA PRIORIDADE: So WhatsApp/Instagram (sem site proprio) ---")
for i, lead in enumerate([l for l in leads_sem_site if l['tipo'] == 'so_redes_sociais'], 1):
    cats = ", ".join(lead.get("categorias", []))
    rede = lead.get("tipo_rede_social", "")
    print(f"  {i}. {lead['nome']}")
    print(f"     Rede social: {rede}")
    print(f"     Categorias: {cats}")
    print(f"     Place ID: {lead['place_id']}")
    print()

print(f"\n--- MEDIA PRIORIDADE: Sem site + categorias corretas ---")
for i, lead in enumerate([l for l in leads_sem_site if l['tipo'] == 'sem_site_com_categoria'], 1):
    cats = ", ".join(lead.get("categorias", []))
    print(f"  {i}. {lead['nome']}")
    print(f"     Categorias: {cats}")
    print(f"     Place ID: {lead['place_id']}")
    print()

print(f"\n--- BAIXA PRIORIDADE: Poucas avaliacoes ---")
for i, lead in enumerate([l for l in leads_sem_site if l['tipo'] == 'poucas_avaliacoes'], 1):
    cats = ", ".join(lead.get("categorias", []))
    print(f"  {i}. {lead['nome']} ({lead['avaliacoes']} aval.)")
    print(f"     Categorias: {cats}")
    print(f"     Place ID: {lead['place_id']}")
    print()

# ============================================================
# SALVAR RESULTADO
# ============================================================
resultado = {
    "campanha": "leads-sem-site-reprocessados",
    "data_geracao": "2026-06-25",
    "total_leads_sem_site": len(leads_sem_site),
    "alta_prioridade": sum(1 for l in leads_sem_site if l['prioridade'] == 'ALTA'),
    "media_prioridade": sum(1 for l in leads_sem_site if l['prioridade'] == 'MEDIA'),
    "baixa_prioridade": sum(1 for l in leads_sem_site if l['prioridade'] == 'BAIXA'),
    "leads_sem_site": leads_sem_site,
    "leads_com_site_descartados": len(leads_com_site)
}

output_path = r"C:\Users\THIAGO\Nova pasta\fluxo-de-agentes\dados\leads_sem_site.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(resultado, f, ensure_ascii=False, indent=2)

print(f"\nSalvo em: {output_path}")
print(f"\n{'='*80}")
print(f"  RESUMO: Leads COM site = {len(leads_com_site)} (DESCARTADOS)")
print(f"          Leads SEM site = {len(leads_sem_site)} (VALIDADOS)")
print(f"{'='*80}")
