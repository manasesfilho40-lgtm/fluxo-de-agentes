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

# Filtrar leads sem site E com WhatsApp
leads_sem_site_com_whatsapp = []
for lead in todos_leads:
    red_flags = lead.get('red_flags', [])
    whatsapp = lead.get('whatsapp', '')
    segmento = lead.get('segmento', '')
    
    if ('sem_site_proprio_valido' in red_flags and 
        whatsapp and whatsapp.strip() and 
        segmento in ['odontologia', 'pet_shop']):
        leads_sem_site_com_whatsapp.append(lead)

# Ordenar por segmento
leads_sem_site_com_whatsapp.sort(key=lambda x: x.get('segmento', ''))

# Imprimir resultados
print("=" * 80)
print("LEADS SEM SITE COM WHATSAPP - ODONTOLOGIA E PET SHOP")
print("=" * 80)
print(f"Total: {len(leads_sem_site_com_whatsapp)} leads")
print()

for i, lead in enumerate(leads_sem_site_com_whatsapp, 1):
    nome = lead.get('nome', 'N/A')
    segmento = lead.get('segmento', 'N/A')
    whatsapp = lead.get('whatsapp', 'N/A')
    telefone = lead.get('telefone', 'N/A')
    endereco = lead.get('endereco', 'N/A')
    cidade = lead.get('cidade', 'N/A')
    estado = lead.get('estado', 'N/A')
    place_id = lead.get('place_id', 'N/A')
    url_original = lead.get('url_original_maps', '')
    
    # Criar link do WhatsApp
    if whatsapp:
        whatsapp_link = f"https://wa.me/{whatsapp}"
    else:
        whatsapp_link = "N/A"
    
    # Criar link do Google Maps
    if place_id and place_id != 'N/A':
        maps_link = f"https://www.google.com/maps/place/?q=place_id:{place_id}"
    elif url_original:
        maps_link = url_original
    else:
        maps_link = "N/A"
    
    print(f"{i}. {nome} ({segmento.upper()})")
    print(f"   WhatsApp: {whatsapp}")
    print(f"   Link WhatsApp: {whatsapp_link}")
    print(f"   Telefone: {telefone}")
    print(f"   Endereço: {endereco}")
    print(f"   Cidade: {cidade} - {estado}")
    print(f"   Link Maps: {maps_link}")
    print("-" * 80)

print()
print("RESUMO POR SEGMENTO:")
odontologia = sum(1 for l in leads_sem_site_com_whatsapp if l.get('segmento') == 'odontologia')
pet_shop = sum(1 for l in leads_sem_site_com_whatsapp if l.get('segmento') == 'pet_shop')
print(f"  Clínicas Odontológicas: {odontologia}")
print(f"  Pet Shops: {pet_shop}")