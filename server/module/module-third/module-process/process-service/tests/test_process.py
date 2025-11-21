"""
处理相关的测试
"""
import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root():
    """测试根路径"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()


def test_health_check():
    """测试健康检查端点"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_process_image_path_missing_file_path():
    """测试 process_image_path 缺少 file_path 参数"""
    response = client.post(
        "/process/process_image_path",
        json={}
    )
    assert response.status_code == 422  # Validation error


def test_parse_document_missing_params():
    """测试 parse_document 缺少必需参数"""
    response = client.post(
        "/process/parse_document",
        json={}
    )
    assert response.status_code == 422  # Validation error

