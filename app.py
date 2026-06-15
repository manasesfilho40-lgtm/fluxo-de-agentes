"""
Fluxo de Agentes - Aplicacao Completa v3.1
Backend FastAPI + Frontend integrado com multiplas IAs + Pipeline de Agentes
"""

import os
import json
import asyncio
import uuid
import hmac
import smtplib
import io
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse, Response
from PIL import Image, ImageDraw
from pydantic import BaseModel, Field
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "dados")
ANALISES_DIR = os.path.join(DATA_DIR, "analises")
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
TRACKING_DIR = os.path.join(DATA_DIR, "tracking")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(ANALISES_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(TRACKING_DIR, exist_ok=True)

load_dotenv()

# =============================================================================
# MODELOS DE DADOS
# =============================================================================

class Message(BaseModel):
    role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    model: str = "nvidia"
    history: List[Message] = []
    stream: bool = False

class ChatResponse(BaseModel):
    response: str
    model: str
    timestamp: str
    tokens_used: Optional[int] = None

class AgentRequest(BaseModel):
    task: str
    agent_type: str = "general"
    model: str = "nvidia"

class AgentTask(BaseModel):
    id: str
    status: str
    result: Optional[str] = None
    error: Optional[str] = None
    created_at: str

class PipelineRequest(BaseModel):
    agent: str  # site-hunter, site-analyst, site-builder, prospector
    params: Optional[Dict[str, Any]] = {}

class ProspectorRequest(BaseModel):
    clinica_nome: str
    clinica_url: str
    clinica_email: Optional[str] = ""
    clinica_telefone: Optional[str] = ""
    clinica_whatsapp: Optional[str] = ""
    clinica_endereco: Optional[str] = ""
    clinica_servicos: Optional[str] = ""
    clinica_equipe: Optional[str] = ""
    clinica_diferenciais: Optional[str] = ""
    canal: str = "email"  # email, whatsapp, both
    mensagem_personalizada: Optional[str] = ""

class LoginRequest(BaseModel):
    username: str
    password: str

# =============================================================================
# LLM PROVIDERS
# =============================================================================

class LLMProvider:
    def __init__(self):
        self.name = "base"

    async def chat(self, message: str, history: List[Message] = None) -> str:
        raise NotImplementedError

class GeminiProvider(LLMProvider):
    def __init__(self):
        super().__init__()
        self.name = "gemini"
        try:
            import google.generativeai as genai
            api_key = os.getenv("GOOGLE_API_KEY")
            if not api_key:
                self.model = None
                return
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash')
        except ImportError:
            self.model = None

    async def chat(self, message: str, history: List[Message] = None) -> str:
        if not self.model:
            return "Gemini nao configurado. Verifique GOOGLE_API_KEY."
        try:
            chat_history = []
            if history:
                for msg in history:
                    role = "user" if msg.role == "user" else "model"
                    chat_history.append({"role": role, "parts": [msg.content]})
            chat = self.model.start_chat(history=chat_history)
            response = chat.send_message(message)
            return response.text
        except Exception as e:
            return f"Erro no Gemini: {str(e)}"

class OpenAIProvider(LLMProvider):
    def __init__(self):
        super().__init__()
        self.name = "openai"
        try:
            from openai import AsyncOpenAI
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                self.client = None
                return
            self.client = AsyncOpenAI(api_key=api_key)
        except ImportError:
            self.client = None

    async def chat(self, message: str, history: List[Message] = None) -> str:
        if not self.client:
            return "OpenAI nao configurado. Verifique OPENAI_API_KEY."
        try:
            messages = []
            if history:
                for msg in history:
                    messages.append({"role": msg.role, "content": msg.content})
            messages.append({"role": "user", "content": message})
            response = await self.client.chat.completions.create(
                model="gpt-4.1-mini", messages=messages
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Erro na OpenAI: {str(e)}"

class AnthropicProvider(LLMProvider):
    def __init__(self):
        super().__init__()
        self.name = "anthropic"
        try:
            import anthropic
            api_key = os.getenv("ANTHROPIC_API_KEY")
            if not api_key:
                self.client = None
                return
            self.client = anthropic.AsyncAnthropic(api_key=api_key)
        except ImportError:
            self.client = None

    async def chat(self, message: str, history: List[Message] = None) -> str:
        if not self.client:
            return "Claude nao configurado. Verifique ANTHROPIC_API_KEY."
        try:
            messages = []
            if history:
                for msg in history:
                    if msg.role in ["user", "assistant"]:
                        messages.append({"role": msg.role, "content": msg.content})
            messages.append({"role": "user", "content": message})
            response = await self.client.messages.create(
                model="claude-sonnet-4-20250514", max_tokens=4096, messages=messages
            )
            return response.content[0].text
        except Exception as e:
            return f"Erro no Claude: {str(e)}"

class NVIDIAProvider(LLMProvider):
    MODELS = {
        "nvidia-nemotron-ultra": "nvidia/nemotron-ultra-253b-v1",
        "nvidia-nemotron-super": "nvidia/llama-3.3-nemotron-super-49b-v1",
        "nvidia-nemotron-70b": "nvidia/llama-3.1-nemotron-70b-instruct",
        "meta-llama-405b": "meta/llama-3.1-405b-instruct",
        "meta-llama-maverick": "meta/llama-4-maverick-17b-128e-instruct",
        "mistral-large": "mistralai/mistral-large-3-675b-instruct-2512",
        "mistral-small": "mistralai/magistral-small-2506",
        "qwen3-coder": "qwen/qwen3-coder-480b-a35b-instruct",
        "qwen3.5": "qwen/qwen3.5-397b-a17b",
        "deepseek-r1": "deepseek-ai/deepseek-r1",
        "deepseek-v3": "deepseek-ai/deepseek-v3-0324",
        "minimax-m3": "minimaxai/minimax-m3",
        "minimax-m27": "minimaxai/minimax-m2.7",
    }

    def __init__(self):
        super().__init__()
        self.name = "nvidia"
        try:
            from openai import AsyncOpenAI
            api_key = os.getenv("NVIDIA_API_KEY")
            if not api_key:
                self.client = None
                return
            self.client = AsyncOpenAI(
                base_url="https://integrate.api.nvidia.com/v1", api_key=api_key
            )
        except ImportError:
            self.client = None

    def get_model_id(self, model_key: str) -> str:
        return self.MODELS.get(model_key, self.MODELS["nvidia-nemotron-70b"])

    async def chat(self, message: str, history: List[Message] = None, model_key: str = None) -> str:
        if not self.client:
            return "NVIDIA AI nao configurado. Verifique NVIDIA_API_KEY."
        try:
            model_id = self.get_model_id(model_key) if model_key else self.MODELS["nvidia-nemotron-70b"]
            messages = []
            if history:
                for msg in history:
                    if msg.role in ["user", "assistant"]:
                        messages.append({"role": msg.role, "content": msg.content})
            messages.append({"role": "user", "content": message})
            response = await self.client.chat.completions.create(
                model=model_id, messages=messages, temperature=0.5, max_tokens=4096
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Erro na NVIDIA AI: {str(e)}"

_provider_cache: Dict[str, LLMProvider] = {}

def get_provider(model: str) -> LLMProvider:
    nvidia_models = list(NVIDIAProvider.MODELS.keys())
    if model in nvidia_models or model.startswith(("nvidia/", "meta/", "mistralai/", "qwen/", "deepseek-ai/", "moonshotai/")):
        if "nvidia" not in _provider_cache:
            _provider_cache["nvidia"] = NVIDIAProvider()
        return _provider_cache["nvidia"]
    if model not in _provider_cache:
        if model == "gemini":
            _provider_cache[model] = GeminiProvider()
        elif model == "openai":
            _provider_cache[model] = OpenAIProvider()
        elif model == "anthropic":
            _provider_cache[model] = AnthropicProvider()
        else:
            _provider_cache["nvidia"] = NVIDIAProvider()
            return _provider_cache["nvidia"]
    return _provider_cache[model]

# =============================================================================
# SISTEMA DE AGENTES
# =============================================================================

class AgentSystem:
    def __init__(self):
        self.tasks: Dict[str, AgentTask] = {}
        self._background_tasks: set = set()
        self.agents = {
            "general": "Agente generalista para tarefas diversas",
            "web": "Agente de navegacao web e scraping",
            "code": "Agente de programacao e analise de codigo",
            "analysis": "Agente de analise de dados e relatorios",
            "sales": "Agente de prospeccao e vendas",
            "marketing": "Agente de marketing digital"
        }
        self.pipeline_runs: List[Dict] = []

    async def create_task(self, task: str, agent_type: str, model: str) -> AgentTask:
        task_id = str(uuid.uuid4())
        agent_task = AgentTask(id=task_id, status="pending", created_at=datetime.now().isoformat())
        self.tasks[task_id] = agent_task
        task_coro = asyncio.create_task(self._execute_task(task_id, task, agent_type, model))
        self._background_tasks.add(task_coro)
        task_coro.add_done_callback(self._background_tasks.discard)
        return agent_task

    async def _execute_task(self, task_id: str, task_desc: str, agent_type: str, model: str):
        agent_task = self.tasks[task_id]
        agent_task.status = "running"
        try:
            prompts = {
                "general": f"Execute a seguinte tarefa de forma completa e detalhada:\n\n{task_desc}",
                "web": f"Analise e execute a seguinte tarefa web. Forneça um resumo detalhado dos resultados:\n\n{task_desc}",
                "code": f"Analise, reveja ou escreva codigo para a seguinte solicitacao. Forneça o codigo completo com explicacoes:\n\n{task_desc}",
                "analysis": f"Analise os seguintes dados/informacoes e forneça insights detalhados:\n\n{task_desc}",
                "sales": f"Como especialista em vendas, prospecte e analise o seguinte lead/cliente:\n\n{task_desc}",
                "marketing": f"Como especialista em marketing digital, crie uma estrategia para:\n\n{task_desc}"
            }
            prompt = prompts.get(agent_type, prompts["general"])
            provider = get_provider(model)
            result = await provider.chat(prompt)
            agent_task.status = "completed"
            agent_task.result = result
        except Exception as e:
            agent_task.status = "error"
            agent_task.error = str(e)

    def get_task(self, task_id: str) -> Optional[AgentTask]:
        return self.tasks.get(task_id)

agent_system = AgentSystem()

# =============================================================================
# UTILITARIOS
# =============================================================================

def load_json(filename: str, default=None):
    path = os.path.join(DATA_DIR, filename)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return default if default is not None else []

def save_json(filename: str, data):
    path = os.path.join(DATA_DIR, filename)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def get_all_leads():
    leads = load_json("leads.json", [])
    leads_root = load_json("leads-root.json", [])
    urls_existentes = {l.get("url") for l in leads}
    for lr in leads_root:
        if lr.get("url") not in urls_existentes:
            lead_unificado = {
                "nome": lr.get("nome", ""),
                "url": lr.get("url", ""),
                "telefone": lr.get("telefone", lr.get("telefone_paraizo", "")),
                "whatsapp": lr.get("whatsapp", ""),
                "email": lr.get("email", ""),
                "cidade": lr.get("cidade", ""),
                "estado": lr.get("estado", ""),
                "endereco": lr.get("endereco", lr.get("endereco_paraizo", "")),
                "classificacao": lr.get("classificacao", "medio"),
                "score": lr.get("score_visual", 5),
                "motivo": ", ".join(lr.get("problemas_principais", [])),
                "tema_wordpress": lr.get("tema_wordpress", ""),
                "observacoes": lr.get("observacoes", ""),
                "data_coleta": lr.get("data_coleta", datetime.now().strftime("%Y-%m-%d"))
            }
            leads.append(lead_unificado)
    return leads

def send_email_smtp(to_email: str, subject: str, html_body: str) -> Dict:
    gmail_email = os.getenv("GMAIL_EMAIL")
    gmail_password = os.getenv("GMAIL_APP_PASSWORD")
    gmail_name = os.getenv("GMAIL_FROM_NAME", "Fluxo de Agentes")

    if not gmail_email or not gmail_password:
        return {"success": False, "error": "GMAIL_EMAIL e GMAIL_APP_PASSWORD nao configurados"}

    try:
        msg = MIMEMultipart("alternative")
        msg["From"] = f"{gmail_name} <{gmail_email}>"
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(html_body, "html", "utf-8"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(gmail_email, gmail_password)
            server.sendmail(gmail_email, to_email, msg.as_string())

        return {"success": True, "message": "Email enviado com sucesso"}
    except Exception as e:
        return {"success": False, "error": str(e)}

def log_envio(envio: Dict):
    envios = load_json("envios.json", {"data": datetime.now().strftime("%Y-%m-%d"), "envios": [], "resumo": {}})
    envios["envios"].append(envio)
    total = len(envios["envios"])
    emails = sum(1 for e in envios["envios"] if e.get("canal") == "email")
    whats = sum(1 for e in envios["envios"] if e.get("canal") == "whatsapp")
    envios["resumo"] = {"total_envios": total, "emails_enviados": emails, "whatsapps_enviados": whats}
    save_json("envios.json", envios)

# =============================================================================
# TRACKING PIXEL - EMAIL OPEN TRACKING
# =============================================================================

def get_tracking_pixel() -> bytes:
    img = Image.new("RGBA", (1, 1), (0, 0, 0, 0))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()

def log_tracking_open(tracking_id: str, clinica_nome: str = ""):
    log_path = os.path.join(TRACKING_DIR, f"{tracking_id}.json")
    data = {
        "tracking_id": tracking_id,
        "clinica_nome": clinica_nome,
        "opened_at": datetime.now().isoformat(),
        "opened": True
    }
    with open(log_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    envios = load_json("envios.json", {"envios": [], "resumo": {}})
    for envio in envios.get("envios", []):
        if envio.get("tracking_id") == tracking_id:
            envio["abriu"] = True
            envio["data_abertura"] = datetime.now().isoformat()
            break
    save_json("envios.json", envios)

# =============================================================================
# DEEP PERSONALIZATION - UTILITARIOS
# =============================================================================

def get_analise_completa(clinica_nome: str) -> Optional[Dict]:
    analise = load_json("analise.json", None)
    if not analise:
        return None
    for site in analise.get("sites_analisados", []):
        if clinica_nome.lower() in site.get("nome", "").lower():
            return site
    return None

def gerar_email_personalizado(clinica_nome: str, clinica_url: str, analise_site: Optional[Dict], extras: Dict = None) -> Dict:
    problemas_texto = ""
    problemas_lista = []
    if analise_site:
        for p in analise_site.get("problemas", [])[:3]:
            desc = p.get("descricao", "")
            cat = p.get("categoria", "Geral")
            problemas_lista.append(f"{cat}: {desc}")
        if problemas_lista:
            problemas_texto = "\n".join([f"  - {p}" for p in problemas_lista])

    if not problemas_texto:
        problemas_texto = "  - Design que pode estar afastando pacientes\n  - Falta de recursos modernos de conversao\n  - Experiencia mobile pode estar comprometida"

    servicos = extras.get("clinica_servicos", "") if extras else ""
    equipe = extras.get("clinica_equipe", "") if extras else ""
    diferenciais = extras.get("clinica_diferenciais", "") if extras else ""
    endereco = extras.get("clinica_endereco", "") if extras else ""

    trecho_personalizado = ""
    if servicos:
        trecho_personalizado += f"\nVi que voces trabalham com {servicos}, e isso merece um site a altura."
    if equipe:
        trecho_personalizado += f"\nA equipe {equipe} merece uma apresentacao online que reflita a qualidade do trabalho."
    if endereco:
        trecho_personalizado += f"\nCom a clinica localizada em {endereco}, um site otimizado ajuda pacientes a encontrarem voces."
    if diferenciais:
        trecho_personalizado += f"\nOs diferenciais ({diferenciais}) precisam ficar claros no site."

    sender_name = os.getenv("GMAIL_FROM_NAME", "Fluxo de Agentes")
    assunto = f"{clinica_nome} - Seu site esta afastando clientes"
    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #e57032;">Analise do site da {clinica_nome}</h2>
    <p>Ola,</p>
    <p>Sou especialista em criacao de sites profissionais. Analisei o site da <strong>{clinica_nome}</strong> e identifiquei alguns pontos que podem estar afetando a impressao dos seus clientes:</p>
    <div style="background: #fff3cd; padding: 12px; border-radius: 8px; margin: 16px 0;">
    <strong>Problemas identificados:</strong>
    <ul>{"".join([f"<li>{p}</li>" for p in problemas_lista]) if problemas_lista else "<li>Design que pode estar afastando clientes</li><li>Falta de recursos modernos de conversao</li>"}</ul>
    </div>
    <p>Isso pode estar fazendo seus clientes escolherem outros fornecedores.{trecho_personalizado}</p>
    <p>Criei uma previa de como ficaria o site da <strong>{clinica_nome}</strong> com:</p>
    <ul>
    <li>Design moderno e profissional</li>
    <li>100% responsivo (funciona perfeitamente no celular)</li>
    <li>Botao de WhatsApp flutuante</li>
    <li>Carregamento rapido</li>
    <li>Foco em converter visitantes em clientes</li>
    </ul>
    <p>Posso enviar mais detalhes ou agendar uma conversa rapida de 15 minutos?</p>
    <p>Atenciosamente,<br><strong>{sender_name}</strong></p>
    </body>
    </html>
    """
    return {"assunto": assunto, "html": html_body}

def gerar_whatsapp_personalizado(clinica_nome: str, clinica_url: str, analise_site: Optional[Dict], extras: Dict = None) -> str:
    problemas_curto = ""
    if analise_site:
        progs = analise_site.get("problemas", [])[:2]
        if progs:
            problemas_curto = " e ".join([p.get("categoria", "problema") for p in progs])

    servicos = extras.get("clinica_servicos", "") if extras else ""
    endereco = extras.get("clinica_endereco", "") if extras else ""

    msg = f"""Oi! Sou especialista em criacao de sites profissionais."""

    if problemas_curto:
        msg += f"\n\nAnalisei o site da {clinica_nome} e identifiquei problemas em: {problemas_curto}."
    else:
        msg += f"\n\nAnalisei o site da {clinica_nome} e identifiquei que pode nao estar funcionando bem no celular."

    if servicos:
        msg += f"\n\nVi que voces trabalham com {servicos}."
    if endereco:
        msg += f"\n\nCom a empresa em {endereco}, um site responsivo ajuda clientes a encontrarem voces."

    msg += f"\n\nCriei uma previa de como ficaria com um design moderno e responsivo."
    msg += f"\n\nPosso mostrar mais detalhes? e so responder aqui!"

    return msg

# =============================================================================
# FASTAPI APP
# =============================================================================

app = FastAPI(
    title="Fluxo de Agentes API",
    description="API para chat com IA e pipeline de agentes inteligentes",
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://127.0.0.1:8000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# =============================================================================
# AUTH (simples com token)
# =============================================================================

USER_DB = {
    "admin": {"password": os.getenv("ADMIN_PASSWORD", "admin123"), "name": "Administrador"},
    "user": {"password": os.getenv("USER_PASSWORD", "user123"), "name": "Usuario"}
}

_tokens: Dict[str, Dict] = {}

@app.post("/api/auth/login")
async def login(req: LoginRequest):
    user = USER_DB.get(req.username)
    if not user or not hmac.compare_digest(user["password"], req.password):
        raise HTTPException(status_code=401, detail="Credenciais invalidas")
    token = str(uuid.uuid4())
    _tokens[token] = {"username": req.username, "created_at": datetime.now()}
    return {"token": token, "user": req.username, "name": user["name"]}

@app.post("/api/auth/logout")
async def logout(request: Request):
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    _tokens.pop(token, None)
    return {"message": "Logout realizado"}

@app.get("/api/auth/check")
async def auth_check(request: Request):
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    token_data = _tokens.get(token)
    if not token_data:
        return {"authenticated": False}
    if datetime.now() - token_data["created_at"] > timedelta(hours=24):
        _tokens.pop(token, None)
        return {"authenticated": False}
    username = token_data["username"]
    return {"authenticated": True, "user": username, "name": USER_DB.get(username, {}).get("name", "")}

# =============================================================================
# ENDPOINTS API - CHAT
# =============================================================================

@app.get("/api/info")
async def root():
    return {
        "message": "Fluxo de Agentes API",
        "version": "3.0.0",
        "status": "online",
        "models": ["nvidia (gratuito)", "gemini (gratuito)", "openai", "anthropic"],
        "endpoints": {
            "chat": "POST /api/chat",
            "agents": "POST /api/agents",
            "pipeline": "POST /api/pipeline/run",
            "leads": "GET /api/leads",
            "prospector": "POST /api/prospector/send",
            "health": "GET /api/health"
        }
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        provider = get_provider(request.model)
        if isinstance(provider, NVIDIAProvider):
            response = await provider.chat(request.message, request.history, model_key=request.model)
        else:
            response = await provider.chat(request.message, request.history)
        return ChatResponse(response=response, model=request.model, timestamp=datetime.now().isoformat())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/agents")
async def create_agent_task(request: AgentRequest):
    try:
        task = await agent_system.create_task(task=request.task, agent_type=request.agent_type, model=request.model)
        return task
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/agents/{task_id}")
async def get_agent_task(task_id: str):
    task = agent_system.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Tarefa nao encontrada")
    return task

@app.get("/api/agents")
async def list_agents():
    tasks_list = []
    for t in agent_system.tasks.values():
        tasks_list.append(t.dict() if hasattr(t, 'dict') else t.__dict__)
    return {
        "agents": agent_system.agents,
        "active_tasks": len(agent_system.tasks),
        "tasks": tasks_list[-20:]
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "3.0.0",
        "models_available": ["nvidia (gratuito)", "gemini (gratuito)", "openai", "anthropic"]
    }

@app.get("/api/models/nvidia")
async def list_nvidia_models():
    return {
        "models": [
            {"id": k, "name": v.split("/")[-1].replace("-", " ").title(), "full_id": v}
            for k, v in NVIDIAProvider.MODELS.items()
        ]
    }

# =============================================================================
# PIPELINE - INTEGRACAO COM OPENCODE AGENTS
# =============================================================================

@app.post("/api/pipeline/run")
async def run_pipeline(req: PipelineRequest):
    agent = req.agent
    valid_agents = ["site-hunter", "site-analyst", "site-builder", "prospector"]
    if agent not in valid_agents:
        raise HTTPException(status_code=400, detail=f"Agente invalido. Use: {valid_agents}")

    run_id = str(uuid.uuid4())
    run = {
        "id": run_id,
        "agent": agent,
        "status": "running",
        "started_at": datetime.now().isoformat(),
        "completed_at": None,
        "result": None,
        "error": None,
        "params": req.params
    }
    agent_system.pipeline_runs.append(run)

    task = asyncio.create_task(_execute_pipeline(run_id, agent, req.params))
    agent_system._background_tasks.add(task)
    task.add_done_callback(agent_system._background_tasks.discard)

    return {"run_id": run_id, "agent": agent, "status": "running"}

async def _execute_pipeline(run_id: str, agent: str, params: Dict):
    run = next((r for r in agent_system.pipeline_runs if r["id"] == run_id), None)
    if not run:
        return

    try:
        if agent == "site-hunter":
            result = await _run_site_hunter(params)
        elif agent == "site-analyst":
            result = await _run_site_analyst(params)
        elif agent == "site-builder":
            result = await _run_site_builder(params)
        elif agent == "prospector":
            result = await _run_prospector(params)
        else:
            result = {"error": "Agente desconhecido"}

        run["status"] = "completed"
        run["completed_at"] = datetime.now().isoformat()
        run["result"] = result
    except Exception as e:
        run["status"] = "error"
        run["completed_at"] = datetime.now().isoformat()
        run["error"] = str(e)

async def _run_site_hunter(params: Dict):
    leads = get_all_leads()
    return {
        "message": "Busca de leads concluida",
        "total_leads": len(leads),
        "leads": leads,
        "arquivos": ["dados/leads.json", "dados/leads-root.json"]
    }

async def _run_site_analyst(params: Dict):
    analise = load_json("analise.json", None)
    if not analise:
        return {"error": "Nenhuma analise encontrada. Execute o site-analyst primeiro."}
    leads = get_all_leads()
    return {
        "message": "Analise de sites concluida",
        "total_analisados": analise.get("total_sites", 0),
        "analise": analise,
        "resumo": analise.get("resumo", {})
    }

async def _run_site_builder(params: Dict):
    clinica = params.get("clinica", "")
    sites_dir = os.path.join(BASE_DIR, "sites-gerados")
    os.makedirs(sites_dir, exist_ok=True)
    return {
        "message": f"Construcao do site para {clinica} iniciada",
        "output_dir": sites_dir,
        "status": "Em construcao - use o agente site-builder do OpenCode para completar"
    }

async def _run_prospector(params: Dict):
    envios = load_json("envios.json", {"envios": [], "resumo": {}})
    return {
        "message": "Status do prospector",
        "total_envios": len(envios.get("envios", [])),
        "resumo": envios.get("resumo", {}),
        "envios_recentes": envios.get("envios", [])[-5:]
    }

@app.get("/api/pipeline/runs")
async def list_pipeline_runs():
    return {"runs": agent_system.pipeline_runs[-20:]}

@app.get("/api/pipeline/runs/{run_id}")
async def get_pipeline_run(run_id: str):
    run = next((r for r in agent_system.pipeline_runs if r["id"] == run_id), None)
    if not run:
        raise HTTPException(status_code=404, detail="Run nao encontrada")
    return run

# =============================================================================
# LEADS
# =============================================================================

@app.get("/api/leads")
async def get_leads():
    leads = get_all_leads()
    return {"leads": leads, "total": len(leads)}

@app.get("/api/leads/by-url")
async def get_lead_by_url(url: str):
    leads = get_all_leads()
    for lead in leads:
        if lead.get("url") == url:
            return lead
    raise HTTPException(status_code=404, detail="Lead nao encontrado")

@app.get("/api/leads/{lead_index}")
async def get_lead(lead_index: int):
    leads = get_all_leads()
    if lead_index < 0 or lead_index >= len(leads):
        raise HTTPException(status_code=404, detail="Lead nao encontrado")
    return leads[lead_index]

@app.get("/api/analise")
async def get_analise():
    analise = load_json("analise.json", None)
    if not analise:
        return {"analise": None, "message": "Nenhuma analise encontrada"}
    return {"analise": analise}

@app.get("/api/analise/{nome_clinica}")
async def get_analise_clinica(nome_clinica: str):
    path = os.path.join(ANALISES_DIR, f"{nome_clinica}-analise.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return {"analise": json.load(f)}
    analise = load_json("analise.json", None)
    if analise:
        for site in analise.get("sites_analisados", []):
            if nome_clinica.lower() in site.get("nome", "").lower():
                return {"analise": site}
    raise HTTPException(status_code=404, detail="Analise nao encontrada")

# =============================================================================
# PROSPECTOR - ENVIO DE EMAIL/WHATSAPP COM PERSONALIZACAO PROFUNDA
# =============================================================================

@app.post("/api/prospector/send")
async def send_prospection(req: ProspectorRequest):
    analise_site = get_analise_completa(req.clinica_nome)
    extras = {
        "clinica_endereco": req.clinica_endereco or "",
        "clinica_servicos": req.clinica_servicos or "",
        "clinica_equipe": req.clinica_equipe or "",
        "clinica_diferenciais": req.clinica_diferenciais or "",
    }
    results = []
    tracking_id = str(uuid.uuid4())[:12]

    if req.canal in ["email", "both"] and req.clinica_email:
        email_data = gerar_email_personalizado(req.clinica_nome, req.clinica_url, analise_site, extras)
        assunto = email_data["assunto"]
        html_body = email_data["html"]

        tracking_pixel_url = f"{req.clinica_url}/../tracking" if req.clinica_url else ""
        pixel_tag = ""
        if tracking_id:
            pixel_tag = f'<img src="http://localhost:8000/api/tracking/pixel/{tracking_id}" width="1" height="1" style="display:none" />'
            html_body = html_body.replace("</body>", f"{pixel_tag}</body>")

        if req.mensagem_personalizada:
            assunto = req.mensagem_personalizada.split("\n")[0] if "\n" in req.mensagem_personalizada else assunto
            html_body = f"<html><body style='font-family:Arial,sans-serif;line-height:1.6;color:#333'><p>{req.mensagem_personalizada.replace(chr(10), '<br>')}</p>{pixel_tag}</body></html>"

        email_result = send_email_smtp(req.clinica_email, assunto, html_body)
        log_envio({
            "nome": req.clinica_nome,
            "email": req.clinica_email,
            "canal": "email",
            "status": "enviado" if email_result["success"] else "erro",
            "erro": email_result.get("error"),
            "data_envio": datetime.now().isoformat(),
            "tracking_id": tracking_id,
            "abriu": False
        })
        results.append({"canal": "email", "resultado": email_result, "tracking_id": tracking_id})

    if req.canal in ["whatsapp", "both"] and (req.clinica_whatsapp or req.clinica_telefone):
        telefone = req.clinica_whatsapp or req.clinica_telefone
        msg_whatsapp = req.mensagem_personalizada or gerar_whatsapp_personalizado(req.clinica_nome, req.clinica_url, analise_site, extras)
        log_envio({
            "nome": req.clinica_nome,
            "telefone": telefone,
            "canal": "whatsapp",
            "status": "preparado",
            "mensagem": msg_whatsapp,
            "data_envio": datetime.now().isoformat()
        })
        results.append({
            "canal": "whatsapp",
            "resultado": {
                "success": True,
                "message": "Mensagem preparada. Use o Playwright para enviar via WhatsApp Web.",
                "telefone": telefone,
                "mensagem": msg_whatsapp
            }
        })

    return {"results": results, "clinica": req.clinica_nome}

@app.get("/api/prospector/history")
async def prospector_history():
    envios = load_json("envios.json", {"envios": [], "resumo": {}})
    return envios

@app.post("/api/prospector/generate")
async def generate_prospection_message(req: ProspectorRequest):
    analise_site = get_analise_completa(req.clinica_nome)
    extras = {
        "clinica_endereco": req.clinica_endereco or "",
        "clinica_servicos": req.clinica_servicos or "",
        "clinica_equipe": req.clinica_equipe or "",
        "clinica_diferenciais": req.clinica_diferenciais or "",
    }

    if req.mensagem_personalizada:
        email_data = gerar_email_personalizado(req.clinica_nome, req.clinica_url, analise_site, extras)
        whatsapp_msg = gerar_whatsapp_personalizado(req.clinica_nome, req.clinica_url, analise_site, extras)
        return {
            "email_assunto": email_data["assunto"],
            "email_html": email_data["html"],
            "whatsapp": whatsapp_msg,
            "clinica": req.clinica_nome
        }

    email_data = gerar_email_personalizado(req.clinica_nome, req.clinica_url, analise_site, extras)
    whatsapp_msg = gerar_whatsapp_personalizado(req.clinica_nome, req.clinica_url, analise_site, extras)
    return {
        "email_assunto": email_data["assunto"],
        "email_html": email_data["html"],
        "whatsapp": whatsapp_msg,
        "clinica": req.clinica_nome
    }

# =============================================================================
# TRACKING - ENDPOINTS DE RASTREAMENTO
# =============================================================================

@app.get("/api/tracking/pixel/{tracking_id}")
async def tracking_pixel(tracking_id: str):
    log_tracking_open(tracking_id)
    pixel = get_tracking_pixel()
    return Response(content=pixel, media_type="image/png", headers={
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
    })

@app.get("/api/tracking/status/{tracking_id}")
async def tracking_status(tracking_id: str):
    log_path = os.path.join(TRACKING_DIR, f"{tracking_id}.json")
    if os.path.exists(log_path):
        with open(log_path, "r", encoding="utf-8") as f:
            return json.load(f)
    envios = load_json("envios.json", {"envios": []})
    for envio in envios.get("envios", []):
        if envio.get("tracking_id") == tracking_id:
            return {
                "tracking_id": tracking_id,
                "clinica_nome": envio.get("nome", ""),
                "opened": envio.get("abriu", False),
                "opened_at": envio.get("data_abertura"),
                "sent_at": envio.get("data_envio")
            }
    raise HTTPException(status_code=404, detail="Tracking ID nao encontrado")

# =============================================================================
# UPLOAD DE ARQUIVOS
# =============================================================================

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    allowed_types = [".txt", ".json", ".csv", ".md", ".html", ".css", ".js", ".png", ".jpg", ".jpeg", ".gif", ".pdf"]
    ext = os.path.splitext(file.filename)[1].lower()

    if ext not in allowed_types:
        raise HTTPException(status_code=400, detail=f"Tipo de arquivo nao permitido: {ext}")

    file_id = str(uuid.uuid4())[:8]
    safe_name = f"{file_id}_{file.filename}"
    file_path = os.path.join(UPLOADS_DIR, safe_name)

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    return {
        "success": True,
        "file_id": file_id,
        "filename": file.filename,
        "saved_as": safe_name,
        "size": len(content),
        "type": ext,
        "path": f"/uploads/{safe_name}"
    }

@app.get("/api/uploads")
async def list_uploads():
    files = []
    if os.path.exists(UPLOADS_DIR):
        for f in os.listdir(UPLOADS_DIR):
            path = os.path.join(UPLOADS_DIR, f)
            files.append({
                "name": f,
                "size": os.path.getsize(path),
                "modified": datetime.fromtimestamp(os.path.getmtime(path)).isoformat()
            })
    return {"files": files}

# =============================================================================
# AUDIO - STUB (processamento via LLM)
# =============================================================================

@app.post("/api/audio/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    content = await audio.read()
    if len(content) < 100:
        raise HTTPException(status_code=400, detail="Arquivo de audio invalido ou muito pequeno")

    provider = get_provider("nvidia")
    result = await provider.chat(
        "Transcreva o seguinte audio (simulado - funcionalidade requer integracao com Whisper): "
        "O usuario enviou um arquivo de audio com " + str(len(content)) + " bytes. "
        "Retorne uma mensagem indicando que a transcricao de audio sera disponivel em breve."
    )
    return {"transcription": result, "audio_size": len(content)}

# =============================================================================
# WEBSOCKET
# =============================================================================

connected_clients = []

@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            message = data.get("message", "")
            model = data.get("model", "nvidia")
            provider = get_provider(model)
            if isinstance(provider, NVIDIAProvider):
                response = await provider.chat(message, model_key=model)
            else:
                response = await provider.chat(message)
            await websocket.send_json({
                "type": "message",
                "response": response,
                "model": model,
                "timestamp": datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        if websocket in connected_clients:
            connected_clients.remove(websocket)
    except Exception as e:
        if websocket in connected_clients:
            connected_clients.remove(websocket)
        try:
            if websocket.client_state.name == "CONNECTED":
                await websocket.send_json({"type": "error", "error": str(e)})
        except Exception:
            pass

# =============================================================================
# SERVIR FRONTEND
# =============================================================================

@app.get("/")
async def serve_root():
    html_path = os.path.join(BASE_DIR, "index.html")
    if os.path.exists(html_path):
        with open(html_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return {"message": "Frontend nao encontrado"}

@app.get("/index.html")
async def serve_index():
    html_path = os.path.join(BASE_DIR, "index.html")
    if os.path.exists(html_path):
        with open(html_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return {"message": "Frontend nao encontrado"}

@app.get("/{path:path}")
async def serve_static(path: str):
    static_path = os.path.realpath(os.path.join(BASE_DIR, path))
    if not static_path.startswith(os.path.realpath(BASE_DIR)):
        return HTMLResponse(content="Acesso negado", status_code=403)
    if os.path.exists(static_path) and os.path.isfile(static_path):
        return FileResponse(static_path)
    html_path = os.path.join(BASE_DIR, "index.html")
    if os.path.exists(html_path):
        with open(html_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return {"message": "Arquivo nao encontrado"}

if __name__ == "__main__":
    import uvicorn
    print("==> Fluxo de Agentes API v3.0.0")
    print("==> API: http://localhost:8000")
    print("==> WebSocket: ws://localhost:8000/ws/chat")
    uvicorn.run(app, host="0.0.0.0", port=8000)
