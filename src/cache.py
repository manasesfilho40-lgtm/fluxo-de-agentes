"""
Cache system com Redis (opcional) + fallback em memória
"""

import hashlib
import json
import os
import time
from typing import Any, Optional

try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False

_memory_cache: dict = {}
_memory_ttl: dict = {}

_redis_client: Optional[redis.Redis] = None


def get_redis_client() -> Optional[redis.Redis]:
    global _redis_client
    if not REDIS_AVAILABLE:
        return None
    if _redis_client is None:
        try:
            url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
            _redis_client = redis.from_url(url, decode_responses=True)
            _redis_client.ping()
        except Exception:
            _redis_client = None
    return _redis_client


def cache_key(prefix: str, *args) -> str:
    raw = f"{prefix}:{':'.join(str(a) for a in args)}"
    return hashlib.md5(raw.encode()).hexdigest()


def get_cache(key: str) -> Optional[Any]:
    client = get_redis_client()
    if client:
        try:
            data = client.get(key)
            if data:
                return json.loads(data)
        except Exception:
            pass

    if key in _memory_cache:
        if time.time() < _memory_ttl.get(key, 0):
            return _memory_cache[key]
        else:
            _memory_cache.pop(key, None)
            _memory_ttl.pop(key, None)
    return None


def set_cache(key: str, value: Any, ttl: int = 3600):
    client = get_redis_client()
    if client:
        try:
            client.setex(key, ttl, json.dumps(value, ensure_ascii=False))
            return
        except Exception:
            pass

    _memory_cache[key] = value
    _memory_ttl[key] = time.time() + ttl


def delete_cache(key: str):
    client = get_redis_client()
    if client:
        try:
            client.delete(key)
        except Exception:
            pass
    _memory_cache.pop(key, None)
    _memory_ttl.pop(key, None)


def clear_cache_pattern(pattern: str):
    client = get_redis_client()
    if client:
        try:
            for key in client.scan_iter(match=pattern):
                client.delete(key)
        except Exception:
            pass
    keys_to_del = [k for k in _memory_cache if pattern.replace("*", "") in k]
    for k in keys_to_del:
        _memory_cache.pop(k, None)
        _memory_ttl.pop(k, None)


async def cached_llm_call(provider, prompt: str, model_key: str = None, ttl: int = 3600) -> str:
    key = cache_key("llm", provider.name, model_key or "default", hashlib.md5(prompt.encode()).hexdigest()[:16])

    cached = get_cache(key)
    if cached:
        return cached

    result = await provider.chat(prompt, model_key=model_key) if hasattr(provider, 'chat') and model_key else await provider.chat(prompt)

    set_cache(key, result, ttl)
    return result


def cached_scrape(key: str, ttl: int = 3600):
    def decorator(func):
        async def wrapper(*args, **kwargs):
            cache_k = cache_key("scrape", key, *args)
            cached = get_cache(cache_k)
            if cached:
                return cached
            result = await func(*args, **kwargs)
            set_cache(cache_k, result, ttl)
            return result
        return wrapper
    return decorator