"""
MinIO 工具模块
提供 MinIO 文件上传、下载等操作的封装
"""
import os
import io
from pathlib import Path
from typing import Tuple
from minio import Minio
from minio.error import S3Error

# MinIO 配置（可以从环境变量读取）
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "your-minio-endpoint:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "your-access-key")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "your-secret-key")
MINIO_SECURE = os.getenv("MINIO_SECURE", "false").lower() == "true"

# 初始化 MinIO 客户端
minio_client = Minio(
    MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=MINIO_SECURE
)


def parse_minio_path(minio_path: str) -> Tuple[str, str]:
    """
    解析 MinIO 路径，返回 bucket 和 object_name
    
    Args:
        minio_path: MinIO 路径，格式为 "bucket/object/path" 或 "s3://bucket/object/path"
        
    Returns:
        (bucket, object_name) 元组
        
    Raises:
        ValueError: 如果路径格式无效
    """
    # 移除 s3:// 前缀（如果存在）
    path = minio_path.replace("s3://", "").lstrip("/")
    
    # 分割路径
    parts = path.split("/", 1)
    if len(parts) == 1:
        raise ValueError(f"Invalid MinIO path format: {minio_path}")
    
    bucket = parts[0]
    object_name = parts[1]
    return bucket, object_name


def download_from_minio(minio_path: str) -> Tuple[bytes, str]:
    """
    从 MinIO 下载文件
    
    Args:
        minio_path: MinIO 路径，格式为 "bucket/object/path" 或 "s3://bucket/object/path"
        
    Returns:
        (文件字节数据, 文件扩展名) 元组
        
    Raises:
        Exception: 如果下载失败
    """
    bucket, object_name = parse_minio_path(minio_path)
    
    try:
        response = minio_client.get_object(bucket, object_name)
        file_data = response.read()
        response.close()
        response.release_conn()
        
        # 获取文件扩展名
        file_ext = Path(object_name).suffix.lower()
        
        return file_data, file_ext
    except S3Error as e:
        raise Exception(f"Failed to download file from MinIO: {str(e)}")


def upload_to_minio(file_data: bytes, minio_path: str, content_type: str = "application/octet-stream"):
    """
    上传文件到 MinIO
    
    Args:
        file_data: 文件字节数据
        minio_path: MinIO 路径，格式为 "bucket/object/path" 或 "s3://bucket/object/path"
        content_type: 内容类型，默认为 "application/octet-stream"
        
    Raises:
        Exception: 如果上传失败
    """
    bucket, object_name = parse_minio_path(minio_path)
    
    try:
        # 确保 bucket 存在
        if not minio_client.bucket_exists(bucket):
            minio_client.make_bucket(bucket)
        
        # 上传文件
        file_stream = io.BytesIO(file_data)
        minio_client.put_object(
            bucket,
            object_name,
            file_stream,
            length=len(file_data),
            content_type=content_type
        )
    except S3Error as e:
        raise Exception(f"Failed to upload file to MinIO: {str(e)}")


def check_bucket_exists(bucket_name: str) -> bool:
    """
    检查 bucket 是否存在
    
    Args:
        bucket_name: bucket 名称
        
    Returns:
        如果 bucket 存在返回 True，否则返回 False
    """
    try:
        return minio_client.bucket_exists(bucket_name)
    except S3Error:
        return False


def create_bucket(bucket_name: str):
    """
    创建 bucket
    
    Args:
        bucket_name: bucket 名称
        
    Raises:
        Exception: 如果创建失败
    """
    try:
        if not minio_client.bucket_exists(bucket_name):
            minio_client.make_bucket(bucket_name)
    except S3Error as e:
        raise Exception(f"Failed to create bucket: {str(e)}")


def delete_object(minio_path: str):
    """
    删除 MinIO 中的对象
    
    Args:
        minio_path: MinIO 路径，格式为 "bucket/object/path" 或 "s3://bucket/object/path"
        
    Raises:
        Exception: 如果删除失败
    """
    bucket, object_name = parse_minio_path(minio_path)
    
    try:
        minio_client.remove_object(bucket, object_name)
    except S3Error as e:
        raise Exception(f"Failed to delete object: {str(e)}")


def list_objects(bucket_name: str, prefix: str = "") -> list:
    """
    列出 bucket 中的对象
    
    Args:
        bucket_name: bucket 名称
        prefix: 对象名前缀（可选）
        
    Returns:
        对象名称列表
        
    Raises:
        Exception: 如果列出失败
    """
    try:
        objects = minio_client.list_objects(bucket_name, prefix=prefix, recursive=True)
        return [obj.object_name for obj in objects]
    except S3Error as e:
        raise Exception(f"Failed to list objects: {str(e)}")

