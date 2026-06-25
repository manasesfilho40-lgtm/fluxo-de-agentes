import json

with open('../dados/leads_sem_site.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

leads = data['leads']

# Filter: no website AND has phone/whatsapp
clean = []
for l in leads:
    has_site = l.get('website') and l['website'] != '' and l['website'] is not None
    has_phone = l.get('whatsapp') or l.get('telefone')
    if not has_site and has_phone:
        clean.append(l)

print(f"Leads limpos (sem site + com telefone): {len(clean)}")
print()

odonto = [l for l in clean if l.get('segmento') == 'odontologia']
pet = [l for l in clean if l.get('segmento') == 'pet_shop']
outros = [l for l in clean if l.get('segmento') not in ('odontologia', 'pet_shop')]

print(f"Odonto: {len(odonto)}")
print(f"Pet: {len(pet)}")
print(f"Outros: {len(outros)}")

# Generate markdown
lines = []
lines.append("# LEADS VALIDADOS - Sem Site + Com WhatsApp\n")
lines.append("**Atualizado:** 25/06/2026")
lines.append(f"**Total:** {len(clean)} leads ({len(odonto)} odonto + {len(pet)} pet + {len(outros)} outros)")
lines.append("**Criterio:** SEM site + COM WhatsApp/telefone + Pet Shop ou Odontologia\n")
lines.append("---\n")

def phone_clean(p):
    """Remove +55 and spaces from phone"""
    if not p:
        return ''
    p = p.replace('+55', '').replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
    if not p.startswith('55'):
        p = '55' + p
    return p

def maps_link(place_id):
    return f"https://www.google.com/maps/place/?q=place_id:{place_id}"

def wa_link(whatsapp, nome):
    if not whatsapp:
        return ''
    num = phone_clean(whatsapp)
    return f"https://wa.me/{num}"

def stars(rating):
    if not rating:
        return '—'
    return str(rating)

# ODONTO
lines.append(f"## 🦷 ODONTOLOGIA ({len(odonto)} leads)\n")
lines.append("| # | Nome | Cidade | Aval | ⭐ | Maps | WhatsApp |")
lines.append("|---|------|--------|------|-----|------|----------|")
for i, l in enumerate(sorted(odonto, key=lambda x: x.get('avaliacoes', 0) or 0, reverse=True), 1):
    nome = l['nome'][:55]
    cid = f"{l.get('cidade', '?')}/{l.get('estado', '?')}"
    aval = l.get('avaliacoes', 0) or 0
    rat = stars(l.get('rating'))
    mid = l.get('place_id', '')
    ml = f"[📍 Maps]({maps_link(mid)})" if mid else '—'
    tel = l.get('whatsapp') or l.get('telefone', '')
    num = phone_clean(tel)
    wl = f"[💬 WhatsApp](https://wa.me/{num})" if num else '—'
    lines.append(f"| {i} | **{nome}** | {cid} | {aval} | {rat} | {ml} | {wl} |")

lines.append("")

# PET SHOP
lines.append(f"## 🐾 PET SHOP / BANHO E TOSA ({len(pet)} leads)\n")
lines.append("| # | Nome | Cidade | Aval | ⭐ | Maps | WhatsApp |")
lines.append("|---|------|--------|------|-----|------|----------|")
for i, l in enumerate(sorted(pet, key=lambda x: x.get('avaliacoes', 0) or 0, reverse=True), 1):
    nome = l['nome'][:55]
    cid = f"{l.get('cidade', '?')}/{l.get('estado', '?')}"
    aval = l.get('avaliacoes', 0) or 0
    rat = stars(l.get('rating'))
    mid = l.get('place_id', '')
    ml = f"[📍 Maps]({maps_link(mid)})" if mid else '—'
    tel = l.get('whatsapp') or l.get('telefone', '')
    num = phone_clean(tel)
    wl = f"[💬 WhatsApp](https://wa.me/{num})" if num else '—'
    lines.append(f"| {i} | **{nome}** | {cid} | {aval} | {rat} | {ml} | {wl} |")

lines.append("")

# OUTROS
if outros:
    lines.append(f"## ❓ OUTROS ({len(outros)} leads)\n")
    lines.append("| # | Nome | Cidade | Aval | ⭐ | Maps | WhatsApp |")
    lines.append("|---|------|--------|------|-----|------|----------|")
    for i, l in enumerate(sorted(outros, key=lambda x: x.get('avaliacoes', 0) or 0, reverse=True), 1):
        nome = l['nome'][:55]
        cid = f"{l.get('cidade', '?')}/{l.get('estado', '?')}"
        aval = l.get('avaliacoes', 0) or 0
        rat = stars(l.get('rating'))
        mid = l.get('place_id', '')
        ml = f"[📍 Maps]({maps_link(mid)})" if mid else '—'
        tel = l.get('whatsapp') or l.get('telefone', '')
        num = phone_clean(tel)
        wl = f"[💬 WhatsApp](https://wa.me/{num})" if num else '—'
        lines.append(f"| {i} | **{nome}** | {cid} | {aval} | {rat} | {ml} | {wl} |")

lines.append("")
lines.append("---\n")

# Top 10 quick access
all_clean = sorted(clean, key=lambda x: x.get('avaliacoes', 0) or 0, reverse=True)
lines.append("## 📞 TOP 10 - ACESSO RAPIDO\n")
lines.append("| # | Nome | Aval | WhatsApp direto | Maps |")
lines.append("|---|------|------|-----------------|------|")
for i, l in enumerate(all_clean[:10], 1):
    nome = l['nome'][:45]
    aval = l.get('avaliacoes', 0) or 0
    tel = l.get('whatsapp') or l.get('telefone', '')
    num = phone_clean(tel)
    wl = f"[💬 wa.me/{num[-4:]}](https://wa.me/{num})" if num else '—'
    mid = l.get('place_id', '')
    ml = f"[Maps]({maps_link(mid)})" if mid else '—'
    lines.append(f"| {i} | **{nome}** | {aval} | {wl} | {ml} |")

md = '\n'.join(lines)
print(f"\nMarkdown gerado: {len(lines)} linhas")

with open('../dados/LEADS_VALIDADOS.md', 'w', encoding='utf-8') as f:
    f.write(md)

print("Salvo em: dados/LEADS_VALIDADOS.md")
