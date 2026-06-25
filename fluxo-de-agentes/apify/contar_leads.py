import json, os, glob

# 1) Check leads/ directory
print("=" * 60)
print("VERIFICANDO TODAS AS FONTES DE LEADS")
print("=" * 60)

total_geral = 0
todos_leads_sem_site = []

# leads/ directory
leads_dir = "../leads"
if os.path.isdir(leads_dir):
    for fn in os.listdir(leads_dir):
        if fn.endswith(".json"):
            filepath = os.path.join(leads_dir, fn)
            with open(filepath, "r", encoding="utf-8-sig") as f:
                data = json.load(f)
            leads = data if isinstance(data, list) else data.get("leads", [])
            total_geral += len(leads)
            
            # Find leads without website
            sem_site = [l for l in leads if not l.get("website") or l.get("website", "") == ""]
            has_phone = [l for l in sem_site if l.get("telefone") or l.get("phone") or l.get("whatsapp") or l.get("phone_unformatted")]
            print(f"{fn}: {len(leads)} total, {len(sem_site)} sem site, {len(has_phone)} sem site+telefone")
            todos_leads_sem_site.extend(has_phone)

# dados/ directory
dados_dir = "../dados"
for fn in os.listdir(dados_dir):
    if fn.endswith(".json") and "leads" in fn.lower():
        filepath = os.path.join(dados_dir, fn)
        with open(filepath, "r", encoding="utf-8-sig") as f:
            data = json.load(f)
        leads = data if isinstance(data, list) else data.get("leads", [])
        total_geral += len(leads)
        
        sem_site = [l for l in leads if not l.get("website") or l.get("website", "") == ""]
        has_phone = [l for l in sem_site if l.get("telefone") or l.get("phone") or l.get("whatsapp") or l.get("phone_unformatted")]
        print(f"dados/{fn}: {len(leads)} total, {len(sem_site)} sem site, {len(has_phone)} sem site+telefone")
        todos_leads_sem_site.extend(has_phone)

# Deduplicate by name+telefone
seen = set()
unicos = []
for l in todos_leads_sem_site:
    key = (l.get("nome", ""), l.get("telefone", "") or l.get("phone", "") or l.get("whatsapp", ""))
    if key not in seen:
        seen.add(key)
        unicos.append(l)

print()
print("=" * 60)
print(f"TOTAL GERAL (sem deduplicar): {len(todos_leads_sem_site)} leads sem site+telefone")
print(f"TOTAL UNICOS (deduplicados): {len(unicos)} leads sem site+telefone")
print("=" * 60)

# Breakdown
odonto = sum(1 for l in unicos if l.get("segmento") == "odontologia" or "odonto" in str(l.get("categorias", [])).lower() or "dentista" in str(l.get("categorias", [])).lower())
pet = sum(1 for l in unicos if l.get("segmento") == "pet_shop" or "pet" in str(l.get("categorias", [])).lower() or "banho" in str(l.get("categorias", [])).lower() or "tosa" in str(l.get("categorias", [])).lower())
print(f"Odonto: {odonto}")
print(f"Pet Shop: {pet}")
print(f"Outros: {len(unicos) - odonto - pet}")
