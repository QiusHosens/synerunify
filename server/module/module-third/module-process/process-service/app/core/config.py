"""
配置管理模块
从环境变量加载配置
"""
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    """应用配置"""
    
    # 项目根目录
    PROJECT_ROOT: Path = Path(__file__).resolve().parent.parent.parent
    
    # Flask/FastAPI 配置
    FLASK_PORT: int = 8080
    FLASK_DEBUG: bool = False
    
    # MinIO 配置
    MINIO_ENDPOINT: str = "192.168.1.18:9000"
    MINIO_ACCESS_KEY: str = "synerunify"
    MINIO_SECRET_KEY: str = "synerunify"
    MINIO_SECURE: bool = False
    MINIO_BUCKET: Optional[str] = None  # 可选的 MinIO bucket 名称
    
    # gRPC 配置
    GRPC_PORT: int = 50051
    
    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parent.parent.parent / ".env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"  # 忽略未定义的额外字段
    )


# 全局配置实例
settings = Settings()

