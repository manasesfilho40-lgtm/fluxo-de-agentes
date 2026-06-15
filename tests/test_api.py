"""
Testes basicos para o Fluxo de Agentes API v3.0
Execute: python -m pytest tests/test_api.py -v
"""

import pytest
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app, get_all_leads, load_json, save_json, DATA_DIR

try:
    from fastapi.testclient import TestClient
    client = TestClient(app)
except ImportError:
    client = None


# =============================================================================
# TESTES DE API BASICA
# =============================================================================

@pytest.mark.skipif(client is None, reason="TestClient nao disponivel")
class TestHealth:
    def test_health_check(self):
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "version" in data

    def test_api_info(self):
        response = client.get("/api/info")
        assert response.status_code == 200
        data = response.json()
        assert data["version"] == "3.0.0"
        assert "endpoints" in data

    def test_nvidia_models(self):
        response = client.get("/api/models/nvidia")
        assert response.status_code == 200
        data = response.json()
        assert len(data["models"]) > 0


# =============================================================================
# TESTES DE AUTENTICACAO
# =============================================================================

@pytest.mark.skipif(client is None, reason="TestClient nao disponivel")
class TestAuth:
    def test_login_success(self):
        response = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["user"] == "admin"

    def test_login_invalid(self):
        response = client.post("/api/auth/login", json={"username": "admin", "password": "wrong"})
        assert response.status_code == 401

    def test_auth_check(self):
        login = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
        token = login.json()["token"]
        response = client.get("/api/auth/check", headers={"Authorization": f"Bearer {token}"})
        assert response.status_code == 200
        assert response.json()["authenticated"] is True

    def test_auth_check_no_token(self):
        response = client.get("/api/auth/check")
        assert response.status_code == 200
        assert response.json()["authenticated"] is False


# =============================================================================
# TESTES DE LEADS
# =============================================================================

@pytest.mark.skipif(client is None, reason="TestClient nao disponivel")
class TestLeads:
    def test_get_leads(self):
        response = client.get("/api/leads")
        assert response.status_code == 200
        data = response.json()
        assert "leads" in data
        assert data["total"] > 0

    def test_leads_have_required_fields(self):
        response = client.get("/api/leads")
        leads = response.json()["leads"]
        for lead in leads:
            assert "nome" in lead
            assert "url" in lead
            assert "classificacao" in lead
            assert "score" in lead


# =============================================================================
# TESTES DE ANALISE
# =============================================================================

@pytest.mark.skipif(client is None, reason="TestClient nao disponivel")
class TestAnalise:
    def test_get_analise(self):
        response = client.get("/api/analise")
        assert response.status_code == 200
        data = response.json()
        assert "analise" in data

    def test_get_analise_by_name(self):
        response = client.get("/api/analise/CSCN")
        assert response.status_code in [200, 404]


# =============================================================================
# TESTES DE PIPELINE
# =============================================================================

@pytest.mark.skipif(client is None, reason="TestClient nao disponivel")
class TestPipeline:
    def test_invalid_agent(self):
        response = client.post("/api/pipeline/run", json={"agent": "invalid"})
        assert response.status_code == 400

    def test_list_runs(self):
        response = client.get("/api/pipeline/runs")
        assert response.status_code == 200
        assert "runs" in response.json()


# =============================================================================
# TESTES DE PROSPECTOR
# =============================================================================

@pytest.mark.skipif(client is None, reason="TestClient nao disponivel")
class TestProspector:
    def test_history(self):
        response = client.get("/api/prospector/history")
        assert response.status_code == 200


# =============================================================================
# TESTES DE UPLOAD
# =============================================================================

@pytest.mark.skipif(client is None, reason="TestClient nao disponivel")
class TestUpload:
    def test_list_uploads(self):
        response = client.get("/api/uploads")
        assert response.status_code == 200
        assert "files" in response.json()


# =============================================================================
# TESTES DE WEBSOCKET
# =============================================================================

@pytest.mark.skipif(client is None, reason="TestClient nao disponivel")
class TestWebSocket:
    def test_websocket_connect(self):
        with client.websocket_connect("/ws/chat") as ws:
            pass


# =============================================================================
# TESTES DE UTILITARIOS
# =============================================================================

class TestUtils:
    def test_get_all_leads_returns_list(self):
        leads = get_all_leads()
        assert isinstance(leads, list)
        assert len(leads) > 0

    def test_leads_unified_format(self):
        leads = get_all_leads()
        for lead in leads:
            assert "nome" in lead
            assert "score" in lead

    def test_save_and_load_json(self):
        test_file = "_test_temp.json"
        test_data = {"test": True, "value": 42}
        save_json(test_file, test_data)
        loaded = load_json(test_file)
        assert loaded == test_data
        os.remove(os.path.join(DATA_DIR, test_file))

    def test_load_nonexistent_returns_default(self):
        result = load_json("nonexistent_file_xyz.json", default=[])
        assert result == []


# =============================================================================
# TESTES DE FRONTEND
# =============================================================================

@pytest.mark.skipif(client is None, reason="TestClient nao disponivel")
class TestFrontend:
    def test_index_html_serves(self):
        response = client.get("/")
        assert response.status_code == 200
        assert "text/html" in response.headers.get("content-type", "")

    def test_index_html_contains_key_elements(self):
        response = client.get("/")
        html = response.text
        assert "Fluxo de Agentes" in html
        assert "loginOverlay" in html
        assert "agentsView" in html
        assert "prospectorView" in html
        assert "leadsView" in html
        assert "api/auth/login" in html


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
