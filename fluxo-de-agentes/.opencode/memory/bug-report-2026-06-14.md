# Análise de Bugs - Fluxo de Agentes
**Data:** 14/06/2026

## BUGS CRÍTICOS

### 1. Shadowing de variável em `app.py:286` e `backend/main.py:278`
```python
task = asyncio.create_task(self._execute_task(task_id, task, agent_type, model))
```
**Problema:** O parâmetro `task` (string) é sobrescrito pelo resultado de `create_task` (coroutine), perdendo a referência original.
**Correção:** Renomear para `task_desc`:
```python
task_coro = asyncio.create_task(self._execute_task(task_id, task_desc, agent_type, model))
```

### 2. Modelo padrão inconsistente no WebSocket (`app.py:466`)
```python
model = data.get("model", "gemini")  # Mas o padrão do app é "nvidia"
```
**Problema:** WebSocket usa "gemini" como default, mas o app usa "nvidia".
**Correção:** Mudar para `"nvidia"`.

### 3. Falta de validação de entrada
- Em `Message.role` o Pydantic aceita `system` mas o pattern só permite `user|assistant`
- Não há validação de tamanho máximo de mensagem

---

## BUGS MÉDIOS

### 4. Histórico duplicado sem deduplicação
- `saveConversation` adiciona sempre sem verificar se já existe
- `loadConversations` usa `slice(-5)` mas não mostra título se for muito curto

### 5. ID inconsistente em conversas
- `saveConversation` usa `Date.now()` como ID
- `loadConversation` busca por `id`
- Não há proteção contra colisões

### 6. Links quebrados na sidebar (index.html)
- Nav items têm `href="#"` com `onclick="alert()"` - funcionalidade fake

---

## BUGS MENORES

### 7. Memory leak potencial em `_background_tasks`
- Tasks concluídas são removidas via callback, mas se callback falhar, acumula

### 8. CORS permite todas origens (`*`)
- Segurança comprometida em produção

### 9.，都没有 NVIDIA_API_KEY no .env.example
- Usuário não sabe que precisa configurar

---

## CORREÇÕES APLICADAS
- Bug de shadowing em app.py ❌ (precisa correção)
- Bug de shadowing em backend/main.py ❌ (precisa correção)
- Modelo default no WebSocket ❌ (precisa correção)