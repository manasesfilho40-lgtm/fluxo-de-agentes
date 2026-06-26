---
name: project-manager
description: Lista todos os sites feitos e briefings do fluxo de agentes
---

# Skill: Project Manager

Lista e organiza todos os projetos de sites e briefings do fluxo de agentes.

## Estrutura de Pastas

```
fluxo de agentes/
├── dados/
│   ├── leads/           → Leads qualificados
│   ├── analises/        → Análises de sites (site-analyst output)
│   └── briefings/       → Briefings de clientes
├── sites/               → Sites finalizados/reconstruídos
└── templates/            → Templates de sites
```

## Comandos

### Listar Sites

Lista todos os sites feitos:
- Nome do projeto
- Status (em andamento, finalizados)
- Data de criação
- Tecnologias usadas

### Listar Briefings

Lista todos os briefings:
- Cliente
- Segmento
- Data
- Status do projeto

### Listar Leads

Lista leads com:
- Nome da empresa
- Segmento
- URL do site atual
- Status (analisado, em projeto, finalizados)

## Output Formato

```
📁 SITES RECRIADOS
├── dental-clinic (Concluído - 25/06/2026)
├── pet-shop-clinic (Em andamento)
└── clinica-odontologica (Concluído - 24/06/2026)

📋 BRIEFINGS
├── Clínica XYZ (Odontológica - 25/06/2026) ✓
├── Pet Shop ABC (Pet Shop - 24/06/2026) ✓
└── Restaurante 123 (Alimentação - 23/06/2026) Pendente

👥 LEADS
├── Empresa A (https://empresa-a.com.br) - Analisado
├── Empresa B (https://empresa-b.com.br) - Em projeto
└── Empresa C (https://empresa-c.com.br) - Novo
```