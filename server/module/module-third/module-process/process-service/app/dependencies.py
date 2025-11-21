"""
公共依赖模块
提供可复用的依赖项，如数据库连接等
"""
from typing import Generator
from minio import Minio
from minio.error import S3Error

from app.core.config import settings


def get_minio_client() -> Minio:
    """
    获取 MinIO 客户端实例
    
    Returns:
        MinIO 客户端实例
    """
    return Minio(
        settings.MINIO_ENDPOINT,
        access_key=settings.MINIO_ACCESS_KEY,
        secret_key=settings.MINIO_SECRET_KEY,
        secure=settings.MINIO_SECURE
    )

