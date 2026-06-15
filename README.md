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
# Instalar dependencias
pip install -r backend/requirements.txt

# Configurar variaveis de ambiente
copy .env.example .env
# Edite .env com suas chaves

# Iniciar servidor
python app.py
```

Acesse: http://localhost:8000

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
