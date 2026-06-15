---
name: site-analyst
description: Analisa sites de empresas e extrai dados únicos para personalização
---

# Skill: Site Analyst

Esta skill fornece instruções para o agente `site-analyst` analisar sites de empresas de qualquer segmento e extrair informações que tornam o rebuild único.

## Objetivo

Antes de criar um site novo, o analista DEVE extrair do site atual:
- **Conteúdo real** (serviços específicos, equipe, história)
- **Dados únicos** (telefone, endereço, CNPJ, diferenciais)
- **Personalidade da marca** (tom de voz, valores, diferenciais)
- **Estrutura de conteúdo** (o que é importante para aquela empresa)

## Fluxo de Trabalho

### 1. Receber lead com URL

Leia o lead com URL do site atual:
```json
{
  "nome": "Nome da Empresa",
  "segmento": "Tipo de negócio",
  "url": "https://site.com.br"
}
```

### 2. Acessar e analisar o site

Use WebFetch ou Playwright para acessar:
- Homepage (extrair proposta, serviços destacados, CTAs)
- Página "Sobre" ou equivalente (história, equipe, valores)
- Página de serviços/produtos (lista completa)
- Página de contato (endereço, telefones, horários)

### 3. Extrair dados estruturados

Crie um relatório com ESTES campos:

```json
{
  "empresa": {
    "nome": "Nome oficial da empresa",
    "segmento": "Tipo de negócio",
    "endereco": "Endereço completo",
    "telefone": "(XX) XXXX-XXXX",
    "whatsapp": "55XXXXXXXXXXX (sem traços)",
    "email": "contato@email.com",
    "horarios": "Seg-Sex: 9h-18h",
    "cnpj": "XX.XXX.XXX/XXXX-XX"
  },
  "diferenciais": [
    "Descrição curta de 2-3 diferenciais únicos"
  ],
  "servicos": [
    {
      "nome": "Nome do serviço ou produto",
      "descricao": "2-3 linhas únicas",
      "indicacoes": ["indicação 1", "indicação 2"]
    }
  ],
  "equipe": [
    {
      "nome": "Nome do profissional",
      "cargo": "Cargo ou especialidade"
    }
  ],
  "historia": "3-4 parágrafos da história real",
  "infraestrutura": ["Descrição de recursos/equipamentos"],
  "tom_de_voz": "profissional|amigável|técnico|acessível|luxuoso|descontraído",
  "palavras_chave": ["termo1", "termo2", "termo3"]
}
```

### 4. Gerar insights de design

Com base na análise, sugira:
- **Tom visual**: moderno, tradicional, minimalista, acolhedor, luxuoso, divertido
- **Cores predominantes no site atual**: extrair hex codes se possível
- **O que funciona bem**: elementos que devem ser mantidos
- **O que não funciona**: problemas de UX/UI identificados

### 5. Output final

Salvar em `dados/analises/{nome-empresa}-analise.json`

## Regras de Extração

### SEMPRE extrair:
- Nome fantasia e razão social
- Endereço completo com bairro e CEP
- Telefone(s) com DDD
- WhatsApp (formato: 55XXXXXXXXXXX)
- Lista real de serviços/produtos
- Horários de funcionamento

### NUNCA inventar:
- Dados de contato (se não encontrar, marcar como "NÃO ENCONTRADO")
- Nomes de profissionais (se não encontrar, usar "Equipe especializada")
- Serviços que não existem no site
- Estatísticas inventadas

### Se site for inacessível:
- Marcar como `erro: "site_indisponivel"`
- Usar dados básicos do leads.json apenas
- NÃO prosseguir com rebuild até ter dados reais

## Integração com Site-Builder

O output do analyst é OBRIGATORIAMENTE usado pelo site-builder. O builder DEVE:

1. **Ler o arquivo de análise** antes de criar qualquer coisa
2. **Usar os dados reais** extraídos - não inventar nada
3. **Manter a consistência** com o que a empresa já comunica
4. **Personalizar textos** baseados no tom de voz identificado

## Checklist de Qualidade

- [ ] Nome oficial da empresa ✓
- [ ] Endereço completo com bairro/cidade ✓
- [ ] Telefone(s) com DDD ✓
- [ ] WhatsApp no formato correto (55XXXXXXXXXXX) ✓
- [ ] Lista de serviços com descrições reais (não genéricas) ✓
- [ ] Informações da equipe (mesmo que parciais) ✓
- [ ] História da empresa (se disponível) ✓
- [ ] Horários de funcionamento ✓
- [ ] Tom de voz identificado ✓
- [ ] Insights de design anotados ✓

---

## Exemplo de Output Completo

```json
{
  "empresa": {
    "nome": "Restaurante Sabor da Terra",
    "segmento": "Restaurante",
    "endereco": "Rua das Flores, 123 - Centro, São Paulo - SP",
    "telefone": "(11) 3456-7890",
    "whatsapp": "5511987654321",
    "email": "contato@sabordaterra.com.br",
    "horarios": "Seg-Sex: 11h-15h, Sáb: 11h-16h",
    "cnpj": "12.345.678/0001-90"
  },
  "diferenciais": [
    "Cozinha regional com ingredientes orgânicos",
    "Espaço kid para famílias",
    "Entrega própria na região"
  ],
  "servicos": [
    {
      "nome": "Almoço Executivo",
      "descricao": "Buffet por quilo com mais de 30 opções de pratos quentes, saladas e sobremesas. Tempero caseiro e ingredientes frescos.",
      "indicacoes": ["Almoço de trabalho", "Reuniões de negócios"]
    },
    {
      "nome": "Eventos e Festas",
      "descricao": "Espaço para até 80 pessoas com cardápio personalizado. Ideal para aniversários, formaturas e confraternizações.",
      "indicacoes": ["Aniversários", "Formaturas", "Confraternizações"]
    }
  ],
  "equipe": [
    {
      "nome": "Chef Maria Santos",
      "cargo": "Proprietária e Chef Executiva"
    }
  ],
  "historia": "Fundado em 2018 pela Chef Maria Santos, o Restaurante Sabor da Terra nasceu do sonho de trazer a comida caseira mineira para o centro de São Paulo. Com receitas passadas de geração em geração, o restaurante rapidamente se tornou referência em comida típica na região.",
  "infraestrutura": [
    "Cozinha industrial completa",
    "Salão principal com 60 lugares",
    "Área externa com 20 lugares",
    "Estacionamento para 15 carros"
  ],
  "tom_de_voz": "acolhedor",
  "palavras_chave": ["restaurante mineiro São Paulo", "comida caseira centro SP", "almorço por quilo"],
  "design_insights": {
    "tom_visual": "rústico e acolhedor",
    "cores_detectadas": ["#8B4513", "#F5DEB3", "#228B22"],
    "funciona_bem": ["Fotos dos pratos reais", "Cardápio visível", "WhatsApp prominently displayed"],
    "nao_funciona": ["Site não responsivo", "Formulário quebrado", "Mapa não carrega"]
  }
}
```