# Fluxo de Agentes

Sistema completo de agentes inteligentes para prospeccao de clinicas odontologicas.

## Estrutura

```
fluxo-de-agentes/
├── app.py                 # Backend FastAPI v3.0
├── index.html             # Frontend completo
├── .env.example           # Template de configuracao
├── opencode.json          # Configuracao dos agentes OpenCode
├── dados/
│   ├── leads.json         # 13 leads consolidados
│   ├── analise.json       # Analise de 10 sites
│   └── analises/          # Analises individuais por clinica
├── uploads/               # Arquivos enviados
├── tests/
│   └── test_api.py        # Testes basicos
└── .opencode/             # Agentes e skills do OpenCode
```

## Como Rodar

```bash
# 1. Clonar o repositorio
git clone https://github.com/manasesfilho40-lgtm/fluxo-de-agentes.git
cd fluxo-de-agentes

# 2. Instalar dependencias
pip install -r backend/requirements.txt

# 3. Configurar variaveis de ambiente
copy .env.example .env
# 4. Edite .env com suas chaves de API (veja abaixo)

# 5. Iniciar servidor
python app.py
```

Acesse: http://localhost:8000

## Configuracao das Chaves de API

Edite o arquivo `.env` e adicione suas chaves:

### NVIDIA AI (Gratuito - Recomendado)
1. Acesse: https://org.ngc.nvidia.com/setup/personal-keys
2. Crie uma API key
3. Adicione no `.env`: `NVIDIA_API_KEY=nvapi-sua_chave_aqui`

### Google Gemini (Gratuito - Opcional)
1. Acesse: https://aistudio.google.com/app/u/1/apikey
2. Crie uma API key
3. Adicione no `.env`: `GOOGLE_API_KEY=sua_chave_aqui`

### Modelos Disponiveis
- **NVIDIA**: Nemotron 70B, Llama, Mistral, DeepSeek, MiniMax, Qwen
- **Google**: Gemini 2.0 Flash
- **OpenAI**: GPT-4 (requer pagamento)
- **Anthropic**: Claude (requer pagamento)

## Funcionalidades

- **Chat IA**: Multi-modelo (NVIDIA, Gemini, OpenAI, Claude)
- **Pipeline de Agentes**: Site Hunter, Site Analyst, Site Builder, Prospector
- **Dashboard**: Monitoramento em tempo real das execucoes
- **Prospeccao**: Envio de emails e WhatsApp personalizados
- **Upload**: Anexo de arquivos no chat
- **Audio**: Gravacao e transcricao de audio
- **Auth**: Login com token de autenticacao
- **Leads**: Gerenciamento consolidado de leads

## Credenciais Padrao

- Usuario: `admin`
- Senha: `admin123`

## Troubleshooting

| Problema | Solucao |
|----------|---------|
| `Erro 403 - Authorization failed` | Verifique se a `NVIDIA_API_KEY` no `.env` está correta e reinicie o servidor |
| Modelo nao responde | Troque para outro modelo no dropdown (Gemini é gratuito e alternativa) |

## Licenca

Projeto privado - uso pessoal e colaborativo.
