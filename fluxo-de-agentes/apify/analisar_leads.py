import json, os

segmentos = {}

# Check leads/ directory
for fn in os.listdir("../leads"):
    if fn.endswith(".json"):
        filepath = os.path.join("../leads", fn)
        with open(filepath, "r", encoding="utf-8-sig") as f:
            data = json.load(f)
        leads = data if isinstance(data, list) else data.get("leads", [])
        for l in leads:
            seg = l.get("segmento", "desconhecido")
            if seg not in segmentos:
                segmentos[seg] = {"total": 0, "comTelefone": 0, "arquivo": fn}
            segmentos[seg]["total"] += 1
            if l.get("telefone") or l.get("whatsapp"):
                segmentos[seg]["comTelefone"] += 1

# Check dados/ leads files
for fn in os.listdir("../dados"):
    if fn.endswith(".json") and "sem_site" in fn.lower():
        filepath = os.path.join("../dados", fn)
        with open(filepath, "r", encoding="utf-8-sig") as f:
            data = json.load(f)
        leads = data if isinstance(data, list) else data.get("leads", [])
        for l in leads:
            seg = l.get("segmento", "desconhecido")
            if seg not in segmentos:
                segmentos[seg] = {"total": 0, "comTelefone": 0, "arquivo": f"dados/{fn}"}
            segmentos[seg]["total"] += 1
            if l.get("telefone") or l.get("whatsapp"):
                segmentos[seg]["comTelefone"] += 1

print("=" * 60)
print("DISTRIBUICAO DE SEGMENTOS")
print("=" * 60)
for seg, info in sorted(segmentos.items(), key=lambda x: -x[1]["total"]):
    print(f"  {seg}: {info['total']} total, {info['comTelefone']} c/telefone")

print()
print("=" * 60)
print("FILTRANDO: Odontologia + Pet Shop (sem site + com telefone)")
print("=" * 60)

# Collect all leads that are odonto or pet, without site, with phone
todos = []
seen = set()

# From leads/
for fn in os.listdir("../leads"):
    if fn.endswith(".json"):
        filepath = os.path.join("../leads", fn)
        with open(filepath, "r", encoding="utf-8-sig") as f:
            data = json.load(f)
        leads = data if isinstance(data, list) else data.get("leads", [])
        for l in leads:
            seg = l.get("segmento", "")
            if seg in ("odontologia", "pet_shop", "pet shop", "banho e tosa"):
                tel = l.get("telefone", "") or l.get("whatsapp", "")
                if tel:
                    key = (l.get("nome", ""), tel)
                    if key not in seen:
                        seen.add(key)
                        todos.append(l)

# From dados/ sem_site files
for fn in os.listdir("../dados"):
    if fn.endswith(".json") and "sem_site" in fn.lower():
        filepath = os.path.join("../dados", fn)
        with open(filepath, "r", encoding="utf-8-sig") as f:
            data = json.load(f)
        leads = data if isinstance(data, list) else data.get("leads", [])
        for l in leads:
            seg = l.get("segmento", "")
            tel = l.get("telefone", "") or l.get("whatsapp", "")
            if tel:
                # Check if it's odonto/pet based on segmento or categorias
                cats = str(l.get("categorias", [])).lower()
                is_odonto = seg in ("odontologia",) or "odonto" in cats or "dentista" in cats
                is_pet = seg in ("pet_shop", "pet shop", "banho e tosa") or "pet" in cats or "banho" in cats or "tosa" in cats
                if is_odonto or is_pet:
                    key = (l.get("nome", ""), tel)
                    if key not in seen:
                        seen.add(key)
                        todos.append(l)

odonto = [l for l in todos if l.get("segmento") in ("odontologia",)]
pet = [l for l in todos if l.get("segmento") in ("pet_shop", "pet shop", "banho e tosa")]

print(f"  Odontologia: {len(odonto)} leads")
print(f"  Pet Shop: {len(pet)} leads")
print(f"  TOTAL: {len(todos)} leads")
print()

if len(todos) > 0:
    print("TOP LEADS POR AVALIACOES:")
    for l in sorted(todos, key=lambda x: x.get("avaliacoes", 0) or 0, reverse=True)[:30]:
        seg = "OD" if l.get("segmento") == "odontologia" else "PT"
        tel = l.get("whatsapp", "") or l.get("telefone", "")
        nome = l.get("nome", "?")[:55]
        aval = l.get("avaliacoes", 0)
        nota = l.get("nota") or l.get("rating", "?")
        cid = l.get("cidade", "?")
        est = l.get("estado", "?")
        print(f"  {seg} {nome} | {aval} aval | {nota}* | {cid}/{est} | {tel}")
