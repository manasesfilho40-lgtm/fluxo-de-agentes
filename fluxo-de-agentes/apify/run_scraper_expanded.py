import os
import json
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

# Salvar raw data para debug
with open(r"C:\Users\T-GAMER\fluxo de agentes\dados\raw_apify_results.json", "w", encoding="utf-8") as f:
    json.dump(items, f, ensure_ascii=False, indent=2)

print("Raw data salvo em dados/raw_apify_results.json")