# Workflow Completo - Prospecção, Análise e Rebuild de Sites

## Fluxo de 5 Etapas

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           PIPELINE DE SERVIÇOS                                      │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  SITE-HUNTER │───▶│ SITE-ANALYST │───▶│ SITE-BUILDER │───▶│  PROSPECTOR  │      │
│  │              │    │              │    │              │    │              │      │
│  │  Encontrar   │    │  Analisar    │    │  Recriar     │    │  Enviar      │      │
│  │  Leads       │    │  Problemas    │    │  Site        │    │  Proposta    │      │
│  └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                   │                   │                   │              │
│         ▼                   ▼                   ▼                   ▼              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │ leads.json   │    │ analise.json │    │ {empresa}/   │    │ envios.json  │      │
│  │              │    │              │    │              │    │              │      │
│  │ 20-50 leads  │    │ Score 0-10   │    │ 5-6 páginas  │    │ Rastreamento │      │
│  │ por nicho    │    │ Problemas    │    │ Design único │    │ Follow-up    │      │
│  └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. SITE-HUNTER - Encontrar Leads

### Nichos Suportados

| Nicho | Termos de Busca | Score Target |
|-------|----------------|--------------|
| **Advogados** | "escritório advocacia" + cidade | 0-5 |
| **Dentistas** | "clínica odontológica" + cidade | 0-5 |
| **Imobiliárias** | "imobiliária" + cidade | 0-5 |
| **Energia Solar** | "empresa energia solar" + cidade | 0-5 |
| **Contabilidades** | "escritório contabilidade" + cidade | 0-5 |
| **Clínicas Estética** | "clínica estética" + cidade | 0-5 |
| **Reformas** | "empresa reformas" + cidade | 0-5 |

### Fontes de Busca

```
1. Google Maps
   "https://www.google.com/maps/search/[TERMO]+[CIDADE]"

2. Google Search
   "[TERMO]" + "[CIDADE]" + "site oficial"

3. Diretórios Brasileiros
   - empresas.com.br
   - lista.com.br
   - solutudo.com.br
   - guidamais.com.br
```

### Critérios de Classificação

| Score | Significado | Ação |
|-------|-------------|------|
| 0-2 | Site quebrado/inútil | PRIORIDADE ALTA |
| 3-4 | Design muito ruim | PRIORIDADE ALTA |
| 5-6 | Funcional mas feio | PRIORIDADE MÉDIA |
| 7-8 | Aceitável | IGNORAR |
| 9-10 | Excelente | IGNORAR |

### Output: leads.json

```json
[
  {
    "id": "uuid",
    "nome": "Nome da Empresa",
    "segmento": "advocacia|odontologia|imobiliaria|energia_solar|contabilidade|estetica|reformas",
    "url": "https://site.com.br",
    "telefone": "(XX) XXXX-XXXX",
    "whatsapp": "55XXXXXXXXXXX",
    "email": "contato@site.com.br",
    "endereco": "Rua X, 123 - Bairro, Cidade - UF",
    "cidade": "São Paulo",
    "estado": "SP",
    "score_visual": 3,
    "problemas_encontrados": [
      "Layout quebrado",
      "Cores ruins",
      "Sem WhatsApp"
    ],
    "data_encontro": "2026-06-16"
  }
]
```

---

## 2. SITE-ANALYST - Analisar Problemas

### Análise por Nicho

#### **ADVOCACIA**
| Aspecto | O que verificar |
|---------|-----------------|
| Autoridade | Anos de experiência, OAB, casos famosos |
| Áreas | Civil, criminal, trabalhista, família, etc. |
| Trust | Depoimentos, cases, publicações |
| CTAs | Consulta gratuita, telefone visível |

#### **ODONTOLOGIA**
| Aspecto | O que verificar |
|---------|-----------------|
| Tratamentos | Implantes, ortodontia, estética, etc. |
| Equipe | Dentistas, especialidades, CRO |
| Resultados | Antes/depois, avaliações |
| Agendamento | WhatsApp, formulário, telefone |

#### **IMOBILIÁRIA**
| Aspecto | O que verificar |
|---------|-----------------|
| Imóveis | Em destaque, filtros funcionais |
| Corretores | CRECI, fotos, especialidades |
| Cobertura | Bairros atendidos |
| Contato | Formulário, WhatsApp |

#### **ENERGIA SOLAR**
| Aspecto | O que verificar |
|---------|-----------------|
| Economia | Simulador, calculadora |
| Processo | Etapas claras de instalação |
| Portfólio | Projetos realizados |
| Orçamento | Formulário de cotação |

#### **CONTABILIDADE**
| Aspecto | O que verificar |
|---------|-----------------|
| Serviços | Fiscal, pessoal, balanço, etc. |
| Nichos | MEI, pequenas empresas, clínicas |
| Diferenciais | Preço, atendimento, tecnologia |
| CTAs | Diagnóstico gratuito |

#### **CLÍNICAS ESTÉTICA**
| Aspecto | O que verificar |
|---------|-----------------|
| Procedimentos | Facial, corporal, cabelos |
| Resultados | Fotos antes/depois |
| Equipe | Esteticistas, especializações |
| Agendamento | WhatsApp proeminente |

#### **REFORMAS**
| Aspecto | O que verificar |
|---------|-----------------|
| Portfólio | Fotos de projetos |
| Serviços | Reformas residenciais, comerciais |
| Processo | Etapas do trabalho |
| Orçamento | Formulário simples |

### Output: analise.json

```json
{
  "data_analise": "2026-06-16",
  "total_sites": 20,
  "segmento": "advocacia",
  "sites_analisados": [
    {
      "id": "uuid",
      "nome": "Escritório XPTO",
      "url": "https://site.com.br",
      "score": 3,
      "problemas": [
        {
          "categoria": "Visual",
          "severidade": "alta",
          "descricao": "Cores que não combinam (verde + roxo)"
        },
        {
          "categoria": "UX",
          "severidade": "alta",
          "descricao": "Sem botão de WhatsApp"
        }
      ],
      "melhorias_sugeridas": [
        "Nova paleta de cores profissional",
        "Adicionar WhatsApp flutuante",
        "Criar seção de áreas de atuação"
      ],
      "dados_extraidos": {
        "advogados": ["Dr. João Silva - OAB/SP 123456"],
        "areas": ["Direito Civil", "Trabalhista"],
        "telefone": "(11) 3333-4444"
      }
    }
  ]
}
```

---

## 3. SITE-BUILDER - Recriar Sites

### Estrutura de Referências por Nicho

#### **ADVOGADOS** - Referências: Clio, FindLaw

```
┌─────────────────────────────────────────────────────────────┐
│  HERO (Escuro, autoridade)                                  │
│  ┌─────────────────────────┬───────────────────────────┐    │
│  │ "Mais de 20 anos        │  [Estátua da Justiça]     │    │
│  │ defendendo seus         │                           │    │
│  │ direitos"              │  "Autoridade e experiência"│    │
│  │                        │                           │    │
│  │ [Fale com um Advogado] │  95% casos ganhos        │    │
│  └─────────────────────────┴───────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│  RESULTADOS (Números grandes)                               │
│  ┌───────────┬───────────┬───────────┬───────────┐        │
│  │  20+      │  5.000+   │  98%      │  R$50Mi+  │        │
│  │  Anos     │  Casos    │  Clientes │  Recuperados│       │
│  └───────────┴───────────┴───────────┴───────────┘        │
├─────────────────────────────────────────────────────────────┤
│  ÁREAS DE ATUAÇÃO (Cards numerados)                        │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┐        │
│  │   01    │   02    │   03    │   04    │   05    │        │
│  │  Civil  │Trabalho │ Família │  Penal  │Consumidor│       │
│  └─────────┴─────────┴─────────┴─────────┴─────────┘        │
├─────────────────────────────────────────────────────────────┤
│  DEPOIMENTOS (Fundo escuro, aspas grandes)                  │
│  ┌─────────────────────────────────────────────────┐        │
│  │  "Excelente atendimento..."                      │        │
│  │  — Maria S., São Paulo                          │        │
│  └─────────────────────────────────────────────────┘        │
├─────────────────────────────────────────────────────────────┤
│  CTA FINAL (Consulta gratuita)                              │
│  "Converse com um advogado sem compromisso"                 │
│  [Agendar Consulta Gratuita]                                │
└─────────────────────────────────────────────────────────────┘
```

**Paleta**: Azul escuro (#1E3A5F) + Dourado (#C9A227) + Branco
**Fontes**: Playfair Display (títulos) + Inter (corpo)
**CTAs**: "Fale com um Advogado", "Solicite Consulta"

#### **DENTISTAS** - Referências: Nuffield Dental, Mayo Clinic

```
┌─────────────────────────────────────────────────────────────┐
│  HERO (Sorriso bonito, clareza)                             │
│  ┌─────────────────────────┬───────────────────────────┐    │
│  │ "Seu sorriso merece     │  [Foto equipe + clínica]   │    │
│  │ o melhor cuidado"       │                           │    │
│  │                        │  ★★★★★ 4.9 (500+ avaliações)│    │
│  │ [Agende Avaliação]     │                           │    │
│  └─────────────────────────┴───────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│  ANTES E DEPOIS (Slider/Carrossel)                         │
│  ┌───────────────────────────────────────────────┐          │
│  │     [Antes] ◀ ─────────── ▶ [Depois]         │          │
│  │     "Clareamento dental em 2 sessões"         │          │
│  └───────────────────────────────────────────────┘          │
├─────────────────────────────────────────────────────────────┤
│  EQUIPE (Cards com foto)                                    │
│  ┌───────────┬───────────┬───────────┐                     │
│  │  [Foto]   │  [Foto]   │  [Foto]   │                     │
│  │  Dra. Ana │  Dr. João │  Dra. Lu  │                     │
│  │  Ortodontia│  Implantes│  Estética │                     │
│  └───────────┴───────────┴───────────┘                     │
├─────────────────────────────────────────────────────────────┤
│  TRATAMENTOS (Grid 2x4)                                     │
│  ┌─────────┬─────────┬─────────┬─────────┐                 │
│  │ Limpeza │ Clareame│ Implantes│ Ortodont│                 │
│  └─────────┴─────────┴─────────┴─────────┘                 │
│  ┌─────────┬─────────┬─────────┬─────────┐                 │
│  │ Protese │  Canal  │ Cirurgia│ Emergência│                 │
│  └─────────┴─────────┴─────────┴─────────┘                 │
├─────────────────────────────────────────────────────────────┤
│  AVALIAÇÕES (Google reviews)                                │
│  [★★★★★] "Atendimento excepcional..."                       │
│  [★★★★★] "Profissionalismo máximo..."                      │
├─────────────────────────────────────────────────────────────┤
│  AGENDAMENTO WHATSAPP                                       │
│  [Agendar pelo WhatsApp]                                     │
└─────────────────────────────────────────────────────────────┘
```

**Paleta**: Azul (#3B82F6) + Verde (#10B981) + Branco
**Fontes**: Playfair Display + Inter
**CTAs**: "Agende Avaliação Gratuita", "Fale pelo WhatsApp"

#### **IMOBILIÁRIAS** - Referências: Compass, Sotheby's

```
┌─────────────────────────────────────────────────────────────┐
│  HERO (Busca proeminente)                                   │
│  ┌─────────────────────────────────────────────────┐        │
│  │  🔍  "Buscar imóvel..."                         │        │
│  │  ┌────────┐ ┌────────┐ ┌────────┐              │        │
│  │  │ Alugar │ │ Comprar│ │ Lançamen│              │        │
│  │  └────────┘ └────────┘ └────────┘              │        │
│  │                                                  │        │
│  │  ┌─────────────────────────────┐ ┌─────────┐   │        │
│  │  │ Todas as cidades          ▼ │ │ Buscar  │   │        │
│  │  └─────────────────────────────┘ └─────────┘   │        │
│  └─────────────────────────────────────────────────┘        │
├─────────────────────────────────────────────────────────────┤
│  IMÓVEIS EM DESTAQUE (Grid 3 colunas)                       │
│  ┌───────────┬───────────┬───────────┐                     │
│  │  [Foto]   │  [Foto]   │  [Foto]   │                     │
│  │  Apt 2D   │  Casa     │  Cobertura│                     │
│  │  R$500mil │  R$1.2Mi  │  R$800mil │                     │
│  │  Vila Mad │  Brooklin │  Paulista │                     │
│  └───────────┴───────────┴───────────┘                     │
├─────────────────────────────────────────────────────────────┤
│  CORRETORES (Cards horizontais)                             │
│  ┌───────────────────────────────────────────────┐          │
│  │  [Foto]  João Silva - CRECI 12345            │          │
│  │          Especialista Brooklin/Morumbi         │          │
│  │          [WhatsApp] [Ligar]                    │          │
│  └───────────────────────────────────────────────┘          │
├─────────────────────────────────────────────────────────────┤
│  BAIRROS (Mapa ou tags)                                     │
│  [Brooklin] [Morumbi] [Itaim] [Paulista] [Moema]            │
├─────────────────────────────────────────────────────────────┤
│  FORMULÁRIO (Contato)                                       │
│  "Encontrar seu imóvel ideal"                              │
│  [Nome] [Tel] [Email] [Tipo interesse ▼] [Enviar]          │
└─────────────────────────────────────────────────────────────┘
```

**Paleta**: Neutro (#1C1917) + Terracota (#B87D5E) + Branco
**Fontes**: Playfair Display + Inter
**CTAs**: "Buscar Imóveis", "Agendar Visita", "Falar com Corretor"

#### **ENERGIA SOLAR** - Referências: Sunrun, Tesla Energy

```
┌─────────────────────────────────────────────────────────────┐
│  HERO (Economia em destaque)                               │
│  ┌─────────────────────────┬───────────────────────────┐   │
│  │ "Economize até 90%      │  [Casa com painéis]       │   │
│  │ na conta de luz"        │                           │   │
│  │                        │  ┌─────────────────────┐  │   │
│  │ [Solicite Orçamento]   │  │ Economy: R$400/mês  │  │   │
│  │ [Simule sua Economia]  │  │ ROI: 3 anos         │  │   │
│  └─────────────────────────┴───────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  SIMULADOR (Interativo)                                    │
│  ┌─────────────────────────────────────────────┐           │
│  │  Conta média: [R$ 500        ▼]             │           │
│  │  Tipo:         [Residencial  ▼]             │           │
│  │  ─────────────────────────────────          │           │
│  │  Economia mensal: R$ 450                    │           │
│  │  Economia anual: R$ 5.400                    │           │
│  │  [Solicitar Orçamento]                       │           │
│  └─────────────────────────────────────────────┘           │
├─────────────────────────────────────────────────────────────┤
│  COMO FUNCIONA (Passos numerados)                          │
│  ┌─────────┬─────────┬─────────┬─────────┐              │
│  │   01    │   02    │   03    │   04    │              │
│  │ Análise │ Projeto │Instalação│ Licença │              │
│  │  Gratuita│ Personal│ em 7 dias│ Aprovada│              │
│  └─────────┴─────────┴─────────┴─────────┘              │
├─────────────────────────────────────────────────────────────┤
│  PROJETOS REALIZADOS (Galeria)                             │
│  [Foto 1] [Foto 2] [Foto 3] [Foto 4]                      │
│  "Sistema 8kWp - Casa em Alphaville"                       │
├─────────────────────────────────────────────────────────────┤
│  FORMULÁRIO (Orçamento)                                    │
│  [Nome] [Tel] [Email] [Cidade] [Enviar]                    │
└─────────────────────────────────────────────────────────────┘
```

**Paleta**: Verde (#059669) + Amarelo (#FBBF24) + Branco
**Fontes**: Playfair Display + Inter
**CTAs**: "Solicite Orçamento Grátis", "Simule sua Economia"

#### **CONTABILIDADE** - Referências: Bench, Pilot

```
┌─────────────────────────────────────────────────────────────┐
│  HERO (Simplicidade e confiança)                            │
│  ┌─────────────────────────┬───────────────────────────┐    │
│  │ "Sua contabilidade      │  [Escritório moderno]     │    │
│  │ simplificada"           │                           │    │
│  │                        │  +200 empresas atendidas  │    │
│  │ [Solicite Diagnóstico] │                           │    │
│  └─────────────────────────┴───────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│  SERVIÇOS (Grid 2x3)                                       │
│  ┌─────────────┬─────────────┬─────────────┐              │
│  │  CONTABILIDADE  │  FOLHA      │  FISCAL     │              │
│  │  Geral         │  Pagamento  │             │              │
│  └─────────────┴─────────────┴─────────────┘              │
│  ┌─────────────┬─────────────┬─────────────┐              │
│  │  APURAÇÃO   │  LEGALIZAÇÃO│  CONSULTORIA │              │
│  │  IRPJ/CSLL  │  Empresas   │  Tributária  │              │
│  └─────────────┴─────────────┴─────────────┘              │
├─────────────────────────────────────────────────────────────┤
│  NICHOS ATENDIDOS (Tags/Badges)                            │
│  [MEI] [Startups] [Médicos] [Advogados] [E-commerce]      │
├─────────────────────────────────────────────────────────────┤
│  BENEFÍCIOS (Ícones + texto)                               │
│  ✓ Economia de tempo                ✓ Redução de custos    │
│  ✓ Conformidade fiscal              ✓ Suporte especializado│
├─────────────────────────────────────────────────────────────┤
│  DEPOIMENTOS (Cards pequenos)                              │
│  ┌─────────────────────────────────────────────┐           │
│  │ "Finalmente uma contabilidade que entende   │           │
│  │  nosso negócio de tecnologia..."            │           │
│  │  — CEO, Startup de SP                       │           │
│  └─────────────────────────────────────────────┘           │
├─────────────────────────────────────────────────────────────┤
│  CTA FINAL                                                  │
│  "Receba um diagnóstico gratuito do seu negócio"           │
│  [Solicitar Diagnóstico Grátis]                            │
└─────────────────────────────────────────────────────────────┘
```

**Paleta**: Azul (#1E3A5F) + Verde (#10B981) + Branco
**Fontes**: Playfair Display + Inter
**CTAs**: "Solicite Diagnóstico Gratuito", "Conheça Nossos Planos"

#### **CLÍNICAS ESTÉTICA** - Referências: Ideal Image

```
┌─────────────────────────────────────────────────────────────┐
│  HERO (Beleza e resultados)                                 │
│  ┌─────────────────────────┬───────────────────────────┐    │
│  │ "Realce sua beleza     │  [Modelo/Carrossel]       │    │
│  │ natural"               │                           │    │
│  │                        │  ★★★★★ 4.8 (800+ avaliações)│   │
│  │ [Agende Avaliação]     │                           │    │
│  └─────────────────────────┴───────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│  ANTES E DEPOIS (Antes/Depois)                             │
│  ┌─────────────────────────────────────────────┐           │
│  │     [Antes] ◀ ─────────── ▶ [Depois]       │           │
│  │     "Botox - 1 sessão"                     │           │
│  └─────────────────────────────────────────────┘           │
├─────────────────────────────────────────────────────────────┤
│  PROCEDIMENTOS (Grid 3x3)                                  │
│  ┌─────────┬─────────┬─────────┐                          │
│  │Botox    │Preenchim│Limpeza   │                          │
│  └─────────┴─────────┴─────────┘                          │
│  ┌─────────┬─────────┬─────────┐                          │
│  │Peeling  │ Depilação│Massagem │                          │
│  └─────────┴─────────┴─────────┘                          │
├─────────────────────────────────────────────────────────────┤
│  AVALIAÇÕES (Reviews)                                      │
│  ★★★★★ "Resultados incríveis..."                          │
│  ★★★★★ "Ambiente impecável..."                            │
├─────────────────────────────────────────────────────────────┤
│  EQUIPE (Cards)                                            │
│  ┌───────────┬───────────┬───────────┐                    │
│  │  [Foto]   │  [Foto]   │  [Foto]   │                    │
│  │  Ana      │  Maria    │  Paula    │                    │
│  │  Estetic. │  Dermato. │  Estetic. │                    │
│  └───────────┴───────────┴───────────┘                    │
├─────────────────────────────────────────────────────────────┤
│  AGENDAMENTO WHATSAPP                                      │
│  [Agendar pelo WhatsApp]                                   │
└─────────────────────────────────────────────────────────────┘
```

**Paleta**: Rosa (#EC4899) + Pink (#F472B6) + Branco
**Fontes**: Playfair Display + Inter
**CTAs**: "Agende Avaliação Gratuita", "Veja Resultados"

#### **REFORMAS** - Referências: Houzz

```
┌─────────────────────────────────────────────────────────────┐
│  HERO (Portfólio em destaque)                               │
│  ┌─────────────────────────┬───────────────────────────┐  │
│  │ "Transforme sua casa    │  [Foto projeto impactante] │  │
│  │ em um novo lar"         │                           │  │
│  │                         │  150+ projetos             │  │
│  │ [Solicite Orçamento]    │                           │  │
│  │ [Veja Projetos]         │                           │  │
│  └─────────────────────────┴───────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  PORTFÓLIO (Grid Masonry/Galeria)                          │
│  ┌───────────┬───────────────┬───────────┐                │
│  │  [Foto]   │   [Foto]      │  [Foto]   │                │
│  │  Cozinha  │   Living      │  Banheiro │                │
│  └───────────┴───────────────┴───────────┘                │
│  ┌───────────────────┬───────────────┬───────────┐        │
│  │      [Foto]       │   [Foto]      │  [Foto]   │        │
│  │   Área Externa    │   Quarto      │   Escrit. │        │
│  └───────────────────┴───────────────┴───────────┘        │
├─────────────────────────────────────────────────────────────┤
│  COMO FUNCIONA (Passos)                                    │
│  ┌─────────┬─────────┬─────────┬─────────┐              │
│  │   01    │   02    │   03    │   04    │              │
│  │ Orçamento│  Projeto│  Execução│  Entrega│              │
│  │  Grátis │  Personal│  Cuidado│  Garantia│              │
│  └─────────┴─────────┴─────────┴─────────┘              │
├─────────────────────────────────────────────────────────────┤
│  SERVIÇOS (Lista)                                          │
│  • Reformas residenciais                                   │
│  • Reformas comerciais                                      │
│  • Projetos de iluminação                                  │
│  • Móveis planejados                                       │
├─────────────────────────────────────────────────────────────┤
│  DEPOIMENTOS (Cards)                                       │
│  ┌─────────────────────────────────────────────┐           │
│  │ "Reformaram nossa casa em 30 dias.         │           │
│  │  Trabalho impecável!"                       │           │
│  │  — Família Silva, Alphaville                │           │
│  └─────────────────────────────────────────────┘           │
├─────────────────────────────────────────────────────────────┤
│  ORÇAMENTO RÁPIDO                                          │
│  [Tipo reforma ▼] [Nome] [Tel] [WhatsApp] [Enviar]       │
└─────────────────────────────────────────────────────────────┘
```

**Paleta**: Marrom (#92400E) + Laranja (#D97706) + Branco
**Fontes**: Playfair Display + Inter
**CTAs**: "Solicite Orçamento Gratuito", "Veja Projetos Realizados"

---

### Design System Base (Adaptável por Nicho)

```css
:root {
  /* Cores Base */
  --cream: #F7F5F2;
  --ink: #1C1917;
  --ink-light: #44403C;
  --sage: #5F6F52;
  --sage-light: #7A8B6E;
  --terracotta: #B87D5E;
  --stone: #A8A29E;
  --border: #E7E5E4;
  --white: #FFFFFF;
  
  /* Adaptações por nicho */
  --accent-justice: #C9A227;    /* Advogados */
  --accent-blue: #3B82F6;        /* Dentistas */
  --accent-green: #059669;       /* Energia Solar */
  --accent-pink: #EC4899;        /* Estética */
  --accent-brown: #92400E;       /* Reformas */
}

/* Tipografia */
font-family: 'Playfair Display', Georgia, serif; /* Títulos */
font-family: 'Inter', system-ui, sans-serif;      /* Corpo */

/* Espaçamento */
--section-padding: 128px 0;
--container-max: 1120px;
--radius: 12px;
```

---

## 4. PROSPECTOR - Enviar Propostas

### Template de Email Personalizado

```html
Assunto: [NOME DA EMPRESA] - Problemas no site que estão afastando clientes

Olá,

Sou especialista em [NICHO] e analisei o site da [NOME DA EMPRESA].

Encontrei alguns pontos que podem estar prejudicando sua imagem:

❌ [PROBLEMA 1]
❌ [PROBLEMA 2]
❌ [PROBLEMA 3]

Esses problemas fazem com que potenciais clientes dudem da qualidade dos seus serviços.

Criei uma prévia de como ficaria o site da [NOME DA EMPRESA] com um design profissional:
🔗 [LINK DO SITE CRIADO]

O que inclui:
✨ Design moderno e profissional
📱 100% responsivo
💬 Botão de WhatsApp
🚀 Carregamento rápido
🎯 Foco em converter visitantes em clientes

Posso enviar mais detalhes ou agendar uma conversa rápida de 15 minutos?

Atenciosamente,
[SEU NOME]
```

### Template WhatsApp

```
Olá! 👋

Sou especialista em [NICHO].

Analisei o site da [NOME DA EMPRESA] e identifiquei pontos que podem estar afastando clientes.

Vi que vocês trabalham com [SERVIÇOS]. Com um site profissional, mais clientes encontrariam vocês.

Criei uma prévia do redesign. Posso mostrar mais detalhes? 😊
```

---

## 5. REGISTRO - Rastreamento

### Output: envios.json

```json
{
  "data_envio": "2026-06-16",
  "total_envios": 15,
  "envios": [
    {
      "id": "uuid",
      "empresa": "Empresa XPTO",
      "canal": "email",
      "email": "contato@empresa.com",
      "telefone": "5511999999999",
      "site_criado": "sites/empresa-xpto/",
      "status": "pendente",
      "tracking_id": "abc123",
      "abriu_email": false,
      "data_abertura": null
    }
  ]
}
```

---

## Checklist de Qualidade por Nicho

### ADVOGADOS
- [ ] OAB visible no footer
- [ ] Anos de experiência destacados
- [ ] Áreas de atuação numeradas
- [ ] Depoimentos com nome real
- [ ] CTA: Consulta gratuita

### DENTISTAS
- [ ] CRO dos dentistas visível
- [ ] Seção antes/depois
- [ ] Avaliações Google visíveis
- [ ] WhatsApp flutuante
- [ ] CTA: Agendar avaliação

### IMOBILIÁRIAS
- [ ] CRECI dos corretores
- [ ] Busca de imóveis funcional
- [ ] Imóveis em destaque
- [ ] Fotos profissionais
- [ ] CTA: Agendar visita

### ENERGIA SOLAR
- [ ] Simulador de economia
- [ ] Processo de instalação claro
- [ ] Garantia destacada
- [ ] Projetos realizados
- [ ] CTA: Solicitar orçamento

### CONTABILIDADE
- [ ] Serviços claros
- [ ] Nichos atendidos destacados
- [ ] Diferenciais claros
- [ ] Depoimentos de clientes
- [ ] CTA: Diagnóstico gratuito

### CLÍNICAS ESTÉTICA
- [ ] Antes/depois visível
- [ ] Procedimentos listados
- [ ] Equipe com fotos
- [ ] Avaliações destacadas
- [ ] CTA: Agendar pelo WhatsApp

### REFORMAS
- [ ] Portfólio com fotos
- [ ] Processo claro
- [ ] Tipos de reforma
- [ ] Depoimentos com endereço
- [ ] CTA: Solicitar orçamento