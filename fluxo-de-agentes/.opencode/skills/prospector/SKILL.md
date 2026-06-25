# Skill: Prospector - Personalização Profunda de Prospecção

## Contexto

O Prospector é responsável por enviar mensagens personalizadas por email e WhatsApp para donos de empresas de qualquer segmento, oferecendo redesign de sites.

## Funcionalidades

### 1. Personalização Profunda

Cada mensagem é gerada usando **todos os dados disponíveis**:

- **Análise do site**: problemas específicos, categorias, severidade
- **Dados da empresa**: nome, URL, telefone, email
- **Dados adicionais**: endereço, serviços, equipe, diferenciais

### 2. Tracking de Abertura (Email)

O sistema inclui pixel tracking invisível:

- Pixel 1x1 PNG transparente inserido no email
- Registro de abertura em `dados/tracking/{id}.json`
- Status consultável via `GET /api/tracking/status/{id}`
- Dados atualizados em `dados/envios.json`

### 3. Geração Automática de Mensagens

Use `POST /api/prospector/generate` para gerar mensagens personalizadas:

```json
{
  "empresa_nome": "Restaurante Sabor da Terra",
  "empresa_url": "https://sabordaterra.com.br",
  "empresa_endereco": "Rua X, 123 - Centro, São Paulo",
  "empresa_servicos": "almço executivo, eventos, delivery",
  "empresa_equipe": "Chef Maria Santos",
  "empresa_diferenciais": "cozinha orgânica, espaço kid",
  "empresa_segmento": "restaurante"
}
```

### 4. Envio com Rastreamento

Use `POST /api/prospector/send` para enviar:

```json
{
  "empresa_nome": "Restaurante Sabor da Terra",
  "empresa_url": "https://sabordaterra.com.br",
  "empresa_email": "contato@sabordaterra.com.br",
  "empresa_whatsapp": "+5511999999999",
  "canal": "both",
  "empresa_endereco": "Rua X, 123",
  "empresa_servicos": "almço executivo",
  "empresa_equipe": "Chef Maria",
  "empresa_diferenciais": "orgânico",
  "empresa_segmento": "restaurante"
}
```

## Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/prospector/generate` | Gera email + WhatsApp personalizados |
| POST | `/api/prospector/send` | Envia mensagem (email/whatsapp/both) |
| GET | `/api/prospector/history` | Histórico de envios |
| GET | `/api/tracking/pixel/{id}` | Pixel de tracking (1x1 PNG) |
| GET | `/api/tracking/status/{id}` | Status de abertura do email |

## Template de Email (Personalizado)

O email é gerado automaticamente com:

1. **Assunto**: "{Nome} - Seu site está afastando clientes"
2. **Corpo**: Lista de problemas específicos + dados da empresa + CTA
3. **Pixel tracking**: Invisível no final do email

## Template de WhatsApp (Curto)

Mensagem curta mencionando:
- Categoria dos problemas encontrados
- Serviços que a empresa trabalha
- Localização
- CTA simples

## Regras

- Máximo 1 email por contato (sem follow-up)
- Sem social proof ou depoimentos
- Personalizar SEMPRE com dados reais da análise
- Enviar entre 8h e 18h
- Usar dados de `dados/analise.json` para personalização

## Arquivos de Dados

- `dados/leads.json` — Lista de empresas
- `dados/analise.json` — Análise detalhada de cada site
- `dados/envios.json` — Log de todos os envios
- `dados/tracking/{id}.json` — Logs de abertura por tracking ID