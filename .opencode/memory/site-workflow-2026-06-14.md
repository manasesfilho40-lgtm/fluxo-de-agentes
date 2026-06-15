# Fluxo de Trabalho Multi-Agente - Sites de Clínicas

**Data:** 14/06/2026  
**Status:** ✅ Corrigido

---

## Problema Original

Os sites eram criados com aparência de "template" porque:
1. O `site-analyst` não existia como skill
2. O `site-builder` usava dados genéricos inventados
3. Não havia comunicação entre agentes

---

## Fluxo Corrigido

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│ lead        │────▶│ site-analyst │────▶│ site-builder │
│ (URL)       │     │ (analisa)    │     │ (cria site)  │
└─────────────┘     └──────────────┘     └──────────────┘
                           │
                           ▼
                    dados/analises/
                    {clinica}-analise.json
```

### Passo a Passo:

1. **site-hunter** → encontra clínica com URL
2. **site-analyst** → acessa site, extrai dados únicos → salva em `dados/analises/{nome}-analise.json`
3. **site-builder** → LÊ a análise ANTES de criar → cria site com dados REAIS

---

## Arquivos de Skill

| Agente | Skill | Status |
|--------|-------|--------|
| site-hunter | `.opencode/skills/site-hunter/SKILL.md` | ✅ OK |
| site-analyst | `.opencode/skills/site-analyst/SKILL.md` | ✅ NOVO |
| site-builder | `.opencode/skills/site-builder/SKILL.md` | ✅ Atualizado |

---

## Para Iniciar o Fluxo

```bash
# 1. Iniciar análise de uma clínica
/run site-analyst
# URL: https://www.clinodontocscn.com.br

# 2. Após análise, criar o site
/run site-builder
# Clínica: Clínica Odontológica CSCN
```

---

## Checklist de Uniqueness

Se um site for criado, verifique que:

- [ ] **Serviços** têm descrições únicas (não "Clareamento, Implantes, Ortodontia, Próteses" genérico)
- [ ] **Estatísticas** são reais ou removidas (não "12.000+ pacientes" inventado)
- [ ] **Equipe** tem nomes e CROs reais se disponíveis
- [ ] **Texto do Hero** não é o mesmo de outro site
- [ ] **Cores** não são apenas azul/laranja genérico
- [ ] **Endereço/telefone** estão corretos e no formato certo

---

## Como Testar

Abra dois sites criados e compare:

1. Se a única diferença for cor, está errado
2. Se os serviços forem "Clareamento, Implantes, Ortodontia, Próteses", está errado
3. Se os textos forem intercambiáveis ("Cuidado dental de confiança"), está errado

**Cada site deve ser único** baseado nos dados reais da clínica.