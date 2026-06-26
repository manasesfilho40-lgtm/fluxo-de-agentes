# -*- coding: utf-8 -*-
import json

# Carregar leads limpos
with open('leads_limpos.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Leads de prioridade (sem site próprio válido)
leads_prioridade = data.get('leads_prioridade', [])

# Leads rejeitados na limpeza
leads_rejeitados = data.get('rejeitados_limpeza', [])

# Combinar todos os leads
todos_leads = leads_prioridade + leads_rejeitados

# Filtrar por segmento: odontologia e pet_shop
leads_filtrados = []
for lead in todos_leads:
    segmento = lead.get('segmento', '')
    if segmento in ['odontologia', 'pet_shop']:
        leads_filtrados.append(lead)

# Filtrar leads com whatsapp
leads_com_whatsapp = []
for lead in leads_filtrados:
    whatsapp = lead.get('whatsapp', '')
    if whatsapp and whatsapp.strip():
        leads_com_whatsapp.append(lead)

# Filtrar leads sem site próprio válido
leads_sem_site = []
for lead in leads_filtrados:
    red_flags = lead.get('red_flags', [])
    if 'sem_site_proprio_valido' in red_flags:
        leads_sem_site.append(lead)

# Filtrar leads sem site E com whatsapp
leads_sem_site_com_whatsapp = []
for lead in leads_filtrados:
    red_flags = lead.get('red_flags', [])
    whatsapp = lead.get('whatsapp', '')
    if 'sem_site_proprio_valido' in red_flags and whatsapp and whatsapp.strip():
        leads_sem_site_com_whatsapp.append(lead)

# Contar por segmento
odontologia_total = sum(1 for l in leads_filtrados if l.get('segmento') == 'odontologia')
pet_shop_total = sum(1 for l in leads_filtrados if l.get('segmento') == 'pet_shop')

odontologia_com_whatsapp = sum(1 for l in leads_com_whatsapp if l.get('segmento') == 'odontologia')
pet_shop_com_whatsapp = sum(1 for l in leads_com_whatsapp if l.get('segmento') == 'pet_shop')

odontologia_sem_site = sum(1 for l in leads_sem_site if l.get('segmento') == 'odontologia')
pet_shop_sem_site = sum(1 for l in leads_sem_site if l.get('segmento') == 'pet_shop')

odontologia_sem_site_com_whatsapp = sum(1 for l in leads_sem_site_com_whatsapp if l.get('segmento') == 'odontologia')
pet_shop_sem_site_com_whatsapp = sum(1 for l in leads_sem_site_com_whatsapp if l.get('segmento') == 'pet_shop')

# Imprimir resultados
print("=" * 60)
print("RESUMO DE LEADS - ODONTOLOGIA E PET SHOP")
print("=" * 60)
print(f"Total de leads (odontologia + pet_shop): {len(leads_filtrados)}")
print(f"  - Odontologia: {odontologia_total}")
print(f"  - Pet Shop: {pet_shop_total}")
print()
print(f"Leads com WhatsApp: {len(leads_com_whatsapp)}")
print(f"  - Odontologia: {odontologia_com_whatsapp}")
print(f"  - Pet Shop: {pet_shop_com_whatsapp}")
print()
print(f"Leads sem site próprio válido: {len(leads_sem_site)}")
print(f"  - Odontologia: {odontologia_sem_site}")
print(f"  - Pet Shop: {pet_shop_sem_site}")
print()
print(f"Leads SEM site E COM WhatsApp: {len(leads_sem_site_com_whatsapp)}")
print(f"  - Odontologia: {odontologia_sem_site_com_whatsapp}")
print(f"  - Pet Shop: {pet_shop_sem_site_com_whatsapp}")
print("=" * 60)