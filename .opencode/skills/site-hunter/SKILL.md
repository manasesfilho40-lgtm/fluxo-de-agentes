---
name: site-hunter
description: Busca e valida leads qualificados em Clinicas Odontologicas e Pet Shops
---

# Skill: Site Hunter - Nichos: Odontologia & Pet Shop

## OBJETIVO PRINCIPAL
Encontrar e validar leads de alta qualidade nos nichos de Clinicas Odontologicas e Pet Shops (banho e tosa), aplicando criterios rigorosos de filtragem.

---

## 1. Critérios de Validação de Lead (OBRIGATÓRIO)

### 1.1 Clinicas Odontologicas

| Critério | Detalhe | Status |
|----------|---------|--------|
| Avaliações | 40+ avaliacoes no Google Maps | Obrigatorio |
| Categoria | Exatamente "Clínica odontológica" ou "Dentista" | Obrigatorio |
| Red Flag | Clinicas gerais (nao odontologicas) - descartar | Bloqueado |
| Bonus de Prioridade | 2+ dentistas no mesmo local (agenda complexa = dor maior) | Prioridade Alta |

**Explicacao do Bonus:** 2+ dentistas no mesmo local significa agenda mais complexa de gerenciar = dor maior. Isso indica que o negocio tem volume e complexidade suficientes para justificar uma solucao de agendamento/automacao.

### 1.2 Pet Shops (Banho e Tosa)

| Critério | Detalhe | Status |
|----------|---------|--------|
| Avaliações | 30+ avaliacoes no Google Maps | Obrigatorio |
| Categoria | Exatamente "Pet shop" ou "Banho e tosa" | Obrigatorio |
| Red Flag | Clinicas veterinarias (nichos separados, ticket mais alto) | Bloqueado |
| Red Flag | Apenas loja de produtos sem servico de banho/tosa | Bloqueado |
| Bonus de Prioridade | Oferece delivery/buscar e levar (ja tem operacao logistica) | Prioridade Alta |

**Explicacao do Bonus:** Se oferece delivery/buscar e levar, significa que ja tem operacao logistica. A agenda e o proximo gargalo obvio. Isso indica maturidade operacional e propensao a investir em solucoes de eficiencia.

---

## 2. Fontes de Busca (DIRETÓRIOS BRASILEIROS)

**IMPORTANTE:** NÃO use Google Maps/Search diretamente - BLOQUEIAM BOTS. Use os diretorios abaixo.

### 2.1 Diretorios Recomendados

| Diretorio | URL de Busca |
|-----------|--------------|
| empresas.com.br | https://www.empresas.com.br/busca?q=[TIPO]+[CIDADE] |
| lista.com.br | https://www.lista.com.br/busca?q=[TIPO]+[CIDADE] |
| solutudo.com.br | https://www.solutudo.com.br/busca?q=[TIPO]+[CIDADE] |
| guiamais.com.br | https://www.guiamais.com.br/busca?q=[TIPO]+[CIDADE] |
| citygoog.com.br | https://www.citygoog.com.br/busca?q=[TIPO]+[CIDADE] |
| ibi7.com.br | https://www.ibi7.com.br/busca?q=[TIPO]+[CIDADE] |

### 2.2 Strings de Busca por Nicho

**Clínicas Odontologicas:**
- "clinica odontologica" + [cidade]
- "dentista" + [cidade]
- "implante dental" + [cidade]
- "ortodontia" + [cidade]
- "endodontia" + [cidade]

**Pet Shops (Banho e Tosa):**
- "pet shop" + [cidade]
- "banho e tosa" + [cidade]
- "tosa higienica" + [cidade]
- "pet shop delivery" + [cidade]
- "buscar e levar pet" + [cidade]

---

## 3. Cidades Prioritarias

Comece por capitais e cidades grandes (ordem de prioridade):

| Regiao | Cidades |
|--------|---------|
| SP | Sao Paulo, Campinas, Santos, Ribeirao Preto |
| RJ | Rio de Janeiro, Niteroi, Campos dos Goytacazes |
| MG | Belo Horizonte, Uberlandia, Juiz de Fora |
| BA | Salvador, Feira de Santana |
| RS | Porto Alegre, Caxias do Sul, Gramado |
| PR | Curitiba, Londrina, Maringa |
| SC | Florianopolis, Joinville, Blumenau |
| PE | Recife, Olinda |
| CE | Fortaleza |
| GO | Goiania |

---

## 4. Processo de Validação de Lead

### 4.1 Coleta de Dados

Para cada empresa encontrada, colete:

```json
{
  "nome": "Nome da Empresa",
  "segmento": "odontologia ou pet_shop",
  "url": "https://site.com.br",
  "telefone": "(XX) XXXXX-XXXX",
  "whatsapp": "(XX) XXXXX-XXXX",
  "cidade": "Cidade",
  "estado": "UF",
  "avaliacoes": 45,
  "categoria": "Clínica odontológica ou Pet shop ou Banho e tosa",
  "num_dentistas": 3,
  "tem_delivery": false,
  "score_validacao": "qualificado ou prioridade ou rejeitado",
  "problemas_principais": [
    "Site antigo",
    "Sem sistema de agendamento online",
    "Sem chatbot WhatsApp"
  ],
  "observacoes": "Observacoes adicionais sobre o lead"
}
```

### 4.2 Classificacao de Score

| Score | Condicao | Acao |
|-------|----------|------|
| REJEITADO | Nao atende minimo de avaliacoes, categoria errada, ou red flag | Descartar |
| QUALIFICADO | Atende todos os criterios obrigatorios | Manter para prospecao |
| PRIORIDADE | Atende criterios obrigatorios + bonus de prioridade | Priorizar na prospecao |

---

## 5. Red Flags (Rejeição Automatica)

### Clinicas Odontologicas:
- Menos de 40 avaliacoes
- Categoria nao e "Clínica odontológica" ou "Dentista"
- E clinica geral (nao odontologica)
- Site inativo ou sem presenca online

### Pet Shops:
- Menos de 30 avaliacoes
- Categoria nao e "Pet shop" ou "Banho e tosa"
- E clinica veterinaria (nichos separados)
- E apenas loja de produtos sem servico de banho/tosa
- Site inativo ou sem presenca online

---

## 6. Bonus de Prioridade (Sinais de Dor)

| Nicho | Sinal de Dor | Por que e importante |
|-------|-------------|---------------------|
| Odontologia | 2+ dentistas no mesmo local | Agenda complexa = maior necessidade de gestao |
| Pet Shop | Oferece delivery/buscar e levar | Operacao logistica madura = proximo gargalo e agenda |

---

## 7. Informacoes para Coletar

Para cada lead validado, colete:

```json
{
  "nome": "Nome da Empresa",
  "segmento": "odontologia ou pet_shop",
  "sub_segmento": "implantes ou ortodontia ou banho_tosa ou tosa_higienica",
  "url": "https://site.com.br",
  "telefone": "(XX) XXXXX-XXXX",
  "whatsapp": "(XX) XXXXX-XXXX",
  "email": "contato@empresa.com.br",
  "cidade": "Cidade",
  "estado": "UF",
  "avaliacoes": 45,
  "categoria_oficial": "Clínica odontológica",
  "num_dentistas": 3,
  "tem_delivery": true,
  "tem_buscar_levar": true,
  "servicos_oferecidos": ["banho", "tosa", "hospedagem"],
  "score_validacao": "prioridade",
  "sinais_dor": [
    "Multiplos dentistas com agenda complexa",
    "Nao tem sistema de agendamento online"
  ],
  "potencial_receita": "alto ou medio ou baixo",
  "observacoes": "Qualquer observacao relevante"
}
```

---

## 8. Como Acessar Sites sem Ser Bloqueado

Use webfetch com headers de navegador real:

```
headers: {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
  "Accept-Encoding": "gzip, deflate, br",
  "Connection": "keep-alive",
  "Upgrade-Insecure-Requests": "1",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Cache-Control": "max-age=0"
}
```

**Para sites que exigem JavaScript:** Use o agente web (Playwright) com modo stealth.

---

## 9. Output Final

O agente deve SEMPRE salvar o resultado em leads.json no diretorio do projeto.

Formato do arquivo:

```json
{
  "campanha": "site-hunter-odontologia-petshop",
  "data_geracao": "2026-06-24",
  "total_leads": 150,
  "leads_prioridade": 45,
  "leads_qualificados": 95,
  "leads_rejeitados": 10,
  "nichos": ["odontologia", "pet_shop"],
  "leads": [
    {
      "nome": "...",
      "segmento": "odontologia",
      "score_validacao": "prioridade"
    }
  ]
}
```

---

## 10. Dicas de Eficiencia

- Use site:empresas.com.br "clínica odontológica" "[CIDADE]" para Odontologia
- Use site:lista.com.br "pet shop" "[CIDADE]" para Pet Shops
- Use site:solutudo.com.br "banho e tosa" "[CIDADE]" para Pet Shops
- Adicione delay aleatorio entre requisicoes (2-5 segundos)
- Verifique se o site da empresa esta ativo antes de classificar
- Anote o telefone sempre que encontrar (sera usado pelo prospector)
- **NÃO acesse google.com/maps ou google.com/search diretamente**

---

## 11. Limites Eticos

- Nao acesse sites que bloqueiam bots
- Nao faca scraping agressivo
- Respeite robots.txt
- Nao colete dados pessoais sensiveis
- Use dados apenas para fins de prospecao B2B
