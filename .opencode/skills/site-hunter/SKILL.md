---
name: site-hunter
description: Busca sites de empresas com design ruim via Google Maps e diretórios, tira screenshots e classifica visualmente a qualidade do design
---

# Skill: Site Hunter

Esta skill fornece instruções detalhadas para o agente `site-hunter` encontrar e classificar sites de empresas de qualquer segmento.

## Como Usar

Quando o agente `site-hunter` for acionado, ele deve seguir estas instruções:

### 1. Fontes de Busca

#### Google Maps
```
"https://www.google.com/maps/search/[TIPO_EMPRESA]+[CIDADE]"
```

#### Google Search
```
"[TIPO_EMPRESA]" + "[CIDADE]" + "site oficial"
"[SEGMENTO]" + "[CIDADE]"
```

#### Diretórios Brasileiros
- `google.com/maps`
- `empresas.com.br`
- `lista.com.br`
- `solutudo.com.br`
- `guiamais.com.br`

### 2. Segmentos para Buscar

O agente pode buscar empresas de QUALQUER segmento. Exemplos:

| Segmento | Exemplos de Busca |
|----------|-------------------|
| Saúde | Clínicas, consultórios, laboratórios, farmácias |
| Educação | Escolas, cursos, treinamentos, academias |
| Serviços | Escritórios, advocacia, contabilidade, arquitetura |
| Comércio | Lojas, varejo, atacado, e-commerces |
| Alimentação | Restaurantes, lanchonetes, padarias, pizzarias |
| Beleza | Salões, barbearias, estéticas, spas |
| Automotivo | Oficinas, concessionárias, lava-jatos |
| Imobiliário | Imobiliárias, incorporadoras, construtoras |
| Tecnologia | Empresas de software, TI, suporte |
| Qualquer outro | O usuário define o segmento |

### 3. Cidades para Buscar

Comece por capitais e cidades grandes:

| Estado | Cidades |
|--------|---------|
| SP | São Paulo, Campinas, Santos, Ribeirão Preto |
| RJ | Rio de Janeiro, Niterói, Campos dos Goytacazes |
| MG | Belo Horizonte, Uberlândia, Juiz de Fora |
| BA | Salvador, Feira de Santana |
| RS | Porto Alegre, Caxias do Sul, Gramado |
| PR | Curitiba, Londrina, Maringá |
| SC | Florianópolis, Joinville, Blumenau |
| PE | Recife, Olinda |
| CE | Fortaleza |
| GO | Goiânia |

### 4. Critérios de Classificação

#### Score 1-2 (Feio)
- Layout completamente quebrado
- Cores horríveis (combinações sem harmonia)
- Fontes ilegíveis ou infantis
- Imagens pixelizadas ou genéricas
- Não funciona no celular
- Sem informações de contato

#### Score 3-4 (Ruim)
- Design antigo (parece site de 2010)
- Cores ruins mas não quebradas
- Pouca informação
- Sem botão de WhatsApp ou CTA
- Layout confuso

#### Score 5-6 (Médio)
- Design ok mas sem graça
- Funcional mas não atrai
- Falta profissionalismo
- Poderia ser muito melhor

#### Score 7-8 (Bom)
- Design profissional
- Responsivo
- Boas cores
- Poucas melhorias necessárias

#### Score 9-10 (Excelente)
- Design moderno e profissional
- Perfeito em mobile
- Excelente conversão
- Não precisa de renovação

### 5. Informações para Coletar

Para cada empresa, colete:

```json
{
  "nome": "Nome da Empresa",
  "segmento": "Tipo de negócio (ex: restaurante, clínica, loja)",
  "url": "https://site.com.br",
  "telefone": "(XX) XXXXX-XXXX",
  "cidade": "Cidade",
  "estado": "UF",
  "score_visual": 3,
  "classificacao": "feio",
  "problemas_principais": [
    "Layout antigo",
    "Não responsivo",
    "Sem WhatsApp"
  ],
  "observacoes": "Observações adicionais"
}
```

### 6. Output Final

O agente deve SEMPRE salvar o resultado em `leads.json` no diretório do projeto.

### 7. Dicas de Busca

- Use `site:empresas.com.br "[SEGMENTO]" "[CIDADE]"` para encontrar empresas em diretórios
- Busque "[segmento] [rua/bairro]" para encontrar empresas específicas
- Verifique se o site da empresa está ativo antes de classificar
- Anote o telefone sempre que encontrar (será usado pelo prospector)

### 8. Limites Éticos

- Não acesse sites que bloqueiam bots
- Não faça scraping agressivo
- Respeite robots.txt
- Não colete dados pessoais sensíveis
- Use dados apenas para fins de prospecção B2B