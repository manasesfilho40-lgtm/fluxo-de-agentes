---
name: site-builder
description: Reconstrói sites de empresas de QUALQUER SEGMENTO com design profissional e identidade visual única
---

# Skill: Site Builder

Esta skill fornece instruções detalhadas para o agente `site-builder` reconstruir sites de empresas de qualquer segmento com design profissional.

## Objetivo

Transformar sites desatualizados ou mal projetados em sites profissionais que:
- Transmitam confiança e credibilidade
- Sejam fáceis de navegar
- Convertam visitantes em clientes
- **NUNCA** pareçam "AI-generated" ou template genérico

---

## ⚠️ REGRA CRÍTICA: Usar Dados da Análise

**ANTES de criar qualquer arquivo, o builder DEVE:**

1. **Ler o arquivo de análise** em `dados/analises/{nome-empresa}-analise.json`
2. **Usar SOMENTE dados reais** extraídos pelo site-analyst
3. **NUNCA inventar** serviços, equipe, estatísticas ou textos

### Fluxo obrigatório:

```
1. Receber lead (nome + URL)
2. Verificar se existe análise em dados/analises/
3. Se NÃO existir → solicitar site-analyst primeiro
4. Se existir → ler análise e EXTRAIR dados únicos
5. Criar site com dados reais, não template
```

### O que FAZER com os dados da análise:

| Campo da Análise | Como Usar no Site |
|------------------|-------------------|
| `servicos[].nome` | Título do card de serviço |
| `servicos[].descricao` | Texto real, não genérico |
| `servicos[].indicacoes` | Lista de tags |
| `equipe[].nome` | Card da equipe |
| `equipe[].especialidade` | Subtítulo do card |
| `diferenciais` | Seção "Por que nos escolher" |
| `historia` | Página Sobre (parágrafos reais) |
| `tom_de_voz` | Guiar tom dos textos |
| `design_insights` | Adaptar design ao estilo da empresa |

### O que NUNCA FAZER:

```html
<!-- ❌ ERRADO - texto genérico template -->
<h3>Serviço</h3>
<p>Descrição genérica do serviço.</p>

<!-- ✅ CERTO - texto real baseado na análise -->
<h3>Almoço Executivo</h3>
<p>Buffet por quilo com mais de 30 opções de pratos quentes, saladas e sobremesas.
Tempero caseiro e ingredientes frescos.</p>
```

```html
<!-- ❌ ERRADO - estatísticas inventadas -->
<div>+12.000 Clientes Atendidos</div>

<!-- ✅ CERTO - se existir dado real, usar. Se não, REMOVER -->
<!-- Se não houver stat real, simplesmente não mostrar esta seção -->
```

---

## Design System Obrigatório

### Paleta de Cores

| Token | Hex | Uso |
|-------|-----|-----|
| `--cream` | `#F7F5F2` | Background suave, seções alternadas |
| `--ink` | `#1C1917` | Texto principal, títulos |
| `--ink-light` | `#44403C` | Texto secundário, parágrafos |
| `--sage` | `#5F6F52` | Acentos, links, destaques |
| `--sage-light` | `#7A8B6E` | Hover states |
| `--terracotta` | `#B87D5E` | Acentos quentes, CTAs alternativos |
| `--stone` | `#A8A29E` | Texto muted, bordas leves |
| `--border` | `#E7E5E4` | Bordas, separadores |
| `--white` | `#FFFFFF` | Cards, formulários |

**REGRAS DE COR:**
- NUNCA use mais de 3 cores principais
- NUNCA use gradients ou rainbow effects
- NUNCA use cores vibrantes (vermelho, azul neon, amarelo)
- Use a paleta acima como base — variações são permitidas apenas se sutis
- Para segmentos específicos (ex: restaurante), pode adaptar as cores para combinar com o tema

### Tipografia

| Uso | Fonte | Peso |
|-----|-------|------|
| Headings | Playfair Display | 400-600 |
| Body | Inter | 300-600 |

**REGRAS DE TIPOGRAFIA:**
- NUNCA use mais de 2 fontes
- Headings: Playfair Display (serif) — dá sofisticação
- Body: Inter (sans-serif) — dá clareza
- NUNCA use fontes infantis, decorativas ou manuscritas
- Tamanho mínimo do body: 16px (0.95rem)

### Espaçamento

```css
--section-padding: 128px 0;    /* Seções normais */
--section-padding-alt: 80px 0; /* Seções compactas */
--container-max: 1120px;
--gap-grid: 48px;              /* Grid 2 colunas */
--gap-grid-sm: 32px;           /* Grid 3 colunas */
--radius: 12px;                /* Bordas arredondadas */
--radius-lg: 20px;             /* Cards grandes */
```

### Sombras

```css
--shadow: 0 1px 2px rgba(0,0,0,.04), 0 1px 3px rgba(0,0,0,.06);
--shadow-md: 0 2px 6px rgba(0,0,0,.06), 0 4px 12px rgba(0,0,0,.04);
--shadow-lg: 0 4px 12px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.06);
```

**REGRAS DE SOMBRA:**
- NUNCA use sombras coloridas (ex: glow azul, sombra rosa)
- NUNCA use sombras exageradas (scale > 1.05, shadow muito longa)
- Sombras sutis apenas para elevar cards levemente

---

## Estrutura de Páginas

Cada site DEVE ter estas páginas (adaptadas ao segmento):

### 1. `index.html` — Home
- **Hero**: grid 5fr/7fr, título Playfair italic com accent sage, CTA WhatsApp ou botão principal
- **Sobre**: grid 2 colunas, stats relevantes ao segmento
- **Serviços/Produtos**: accordion pattern (um item aberto por vez)
- **Abordagem/Processo**: numbered steps (01, 02, 03, 04)
- **Depoimentos**: seção escura (background ink), cards com quote Playfair italic
- **Contato**: grid 2 colunas, formulário + info cards
- **Footer**: 3 colunas (brand, navegação, contato)

### 2. `servicos.html` — Serviços/Produtos
- Hero compacto
- Lista de serviços com `service-detail` pattern
- Cada serviço: header com número + tags, grid 2 colunas (descrição + lista)

### 3. `sobre.html` — Sobre
- Hero compacto
- História (grid 2 colunas)
- Equipe (grid 3 colunas, cards com foto grayscale → color no hover)
- Valores (grid 3 colunas, feature cards)
- Infraestrutura (grid 2 colunas)

### 4. `contato.html` — Contato
- Hero compacto
- Grid 2 colunas: info cards + formulário
- Mapa (Google Maps embed)

---

## Componentes Padrão

### Navbar
```html
<nav class="navbar" id="navbar">
  <div class="navbar__inner">
    <a href="index.html" class="navbar__logo">Nome da Empresa</a>
    <ul class="navbar__links">
      <li><a href="#about">Sobre</a></li>
      <li><a href="#services">Serviços</a></li>
      <!-- mais links -->
    </ul>
    <a href="https://wa.me/55XXXXXXXXXXX" class="btn btn--outline">Fale Conosco</a>
  </div>
</nav>
```
- Efeito scroll: adiciona `.scrolled` quando scrollY > 40px
- Fundo transparente → branco com blur no scroll

### Hero
```html
<section class="hero">
  <div class="container">
    <div class="hero__grid">
      <div>
        <span class="hero__tag">Tag da seção</span>
        <h1>Título com <em>accent</em></h1>
        <p>Descrição</p>
        <div class="hero__actions">
          <a href="..." class="btn btn--dark">CTA Principal</a>
          <a href="..." class="btn btn--outline">CTA Secundário</a>
        </div>
      </div>
      <div class="hero__img-wrap">
        <img src="..." class="hero__img">
        <div class="hero__card">Citação ou destaque</div>
      </div>
    </div>
  </div>
</section>
```

### Accordion
```html
<div class="accordion__item">
  <button class="accordion__header" onclick="toggleAccordion(this)">
    <h3>Título</h3>
    <span class="accordion__icon">+</span>
  </button>
  <div class="accordion__body">
    <div class="accordion__content">
      <p>Conteúdo</p>
      <div class="accordion__tags">
        <span class="accordion__tag">Tag</span>
      </div>
    </div>
  </div>
</div>
```

### Steps (Processo)
```html
<div class="steps">
  <div class="step">
    <span class="step__number">01</span>
    <div>
      <h3>Título</h3>
      <p>Descrição</p>
    </div>
  </div>
</div>
```

### Team Card
```html
<div class="team-card">
  <div class="team-card__img">
    <img src="..." alt="Nome">
  </div>
  <div class="team-card__info">
    <h3>Nome</h3>
    <p>Cargo ou especialidade</p>
  </div>
</div>
```

### WhatsApp Float
```html
<a href="https://wa.me/55XXXXXXXXXXX" class="whatsapp" target="_blank">
  <svg viewBox="0 0 24 24"><!-- path do WhatsApp --></svg>
</a>
```
- Posição: fixo, bottom 32px, right 32px
- Cor: #25D366
- Hover: scale(1.1)

---

## Regras Absolutas (NÃO FAZER)

### ❌ NUNCA faça:

1. **Cores demais**
   - NUNCA use gradients em textos ou backgrounds
   - NUNCA use rainbow effects
   - NUNCA use mais de 3 cores por seção

2. **Componentes genéricos**
   - NUNCA faça 5 cards idênticos empilhados
   - NUNCA use grid 3 colunas com cards iguais
   - NUNCA use "feature grid" sem variação visual

3. **Animações desnecessárias**
   - NUNCA use fade-in em tudo
   - NUNCA use slide de todos os lados
   - NUNCA use parallax exagerado
   - NUNCA use animações que atrasem o conteúdo

4. **Botões e CTAs**
   - NUNCA coloque mais de 2 CTAs por seção
   - NUNCA use botões com cores diferentes em sequência
   - NUNCA use "Clique aqui" como texto de botão

5. **Fontes**
   - NUNCA misture mais de 2 tipos de fonte
   - NUNCA use fontes manuscritas ou decorativas
   - NUNCA use tamanhos de fonte inconsistentes

6. **Ícones**
   - NUNCA use ícones demais (máximo 1 por seção)
   - NUNCA use ícones coloridos diferentes
   - NUNCA substitua texto por ícones quando o texto for melhor

7. **Hover effects**
   - NUNCA use scale > 1.05
   - NUNCA use sombras coloridas no hover
   - NUNCA use transições > 0.3s

8. **Copy**
   - NUNCA use Lorem ipsum
   - NUNCA use textos genéricos ("Somos a melhor empresa")
   - NUNCA use jargão excessivo sem explicação

9. **Layout**
   - NUNCA faça navbar com mais de 6 links
   - NUNCA use sidebar em sites de empresas
   - NUNCA use layout de blog para página de serviço

10. **Imagens**
    - NUNCA use imagens pixelizadas ou de baixa qualidade
    - NUNCA use imagens genéricas de estoque óbvias
    - NUNCA use mais de 1 imagem por seção sem necessidade

---

## Regras de Conteúdo

### Texto do Hero
- Máximo 2 linhas de título
- Subtítulo com máximo 3 linhas
- 1-2 CTAs no máximo

### Texto de Serviços
- Cada serviço: 2-3 parágrafos curtos (máx 3 linhas cada)
- Lista de indicações/procedimentos (5-8 itens)
- Tags para keywords

### Texto de Sobre
- História: 3 parágrafos curtos
- Stats: 3-4 números impactantes
- Equipe: 1 foto + nome + cargo

### Texto de Contato
- Endereço completo
- Telefone(s)
- WhatsApp (link direto)
- Horário de atendimento
- Formulário simples (nome, telefone, email, mensagem)

### Conteúdo Original
- Use o conteúdo do site original como base
- Reescreva em tom profissional mas acessível
- Mantenha dados reais (endereço, telefone)
- NUNCA invente dados que não existem

---

## Output Esperado

Para cada empresa, o agente DEVE criar:

```
empresa-nome/
├── index.html
├── servicos.html
├── sobre.html
├── contato.html
└── assets/
    └── css/
        └── style.css   (design system completo)
```

### Checklist de Qualidade

Antes de entregar, verifique:

- [ ] Navbar funciona com scroll effect
- [ ] Accordion de serviços abre/fecha corretamente
- [ ] WhatsApp float aparece em todas as páginas (se aplicável)
- [ ] Formulário tem todos os campos obrigatórios
- [ ] Links entre páginas estão corretos
- [ ] Responsivo em mobile (testar em 375px)
- [ ] Fontes Playfair Display e Inter carregam
- [ ] Paleta está dentro do design system
- [ ] Nenhum dos "NÃO FAZER" está presente
- [ ] Conteúdo é original (não Lorem ipsum)
- [ ] Dados de contato estão corretos

---

## Fluxo de Trabalho

1. **Receber lead** → ler `leads.json` ou dados do usuário
2. **Scraping** → extrair conteúdo do site atual
3. **Planejar** → definir paleta, estrutura, conteúdo
4. **Criar CSS** → design system completo
5. **Criar HTMLs** → todas as páginas
6. **Verificar** → checklist de qualidade
7. **Entregar** → pastas com arquivos prontos

---

## Dicas de Implementação

### Imagens
- Use SOMENTE imagens existentes no site original da empresa
- NUNCA baixe imagens de bancos gratuitos (Unsplash, Pexels)
- NUNCA gere imagens com IA
- Se faltar imagem, deixe espaço minimalista

### WhatsApp
- Formato: `https://wa.me/55XXXXXXXXXXX`
- Sem traços, sem parênteses, sem espaços
- Mensagem pré-definida: `?text=Olá! Gostaria de saber mais.`

### Google Maps
- Embed: `https://www.google.com/maps/embed?pb=...`
- Busque o endereço no Google Maps → Compartilhar → Incorporar

### Fonts
- Google Fonts: `https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Inter:wght@300;400;500;600&display=swap`

### Formulário
- Use `action="#"` para formulário estático
- Adicione `required` nos campos obrigatórios
- Style com `.form-input` do design system