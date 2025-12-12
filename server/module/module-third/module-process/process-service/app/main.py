"""
FastAPI 应用入口
"""
import logging
import sys
from pathlib import Path

# 确保项目根目录在 Python 路径中
_project_root = Path(__file__).parent.parent.resolve()
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.routers import process, convert, video, appearance

# 创建 FastAPI 应用实例
app = FastAPI(
    title="Process Service API",
    description="文档处理和OCR识别服务",
    version="1.0.0"
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应该限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(process.router)
app.include_router(convert.router)
app.include_router(video.router)
app.include_router(appearance.router)

# 静态文件服务（用于视频流展示页面）
static_dir = Path(__file__).parent.parent / "static"
if static_dir.exists():
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")


@app.get("/")
async def root():
    """根路径"""
    return {
        "message": "Process Service API",
        "version": "1.0.0",
        "endpoints": {
            "video_stream": "/static/video_stream.html",
            "video_api": "/video/stream",
            "video_detect": "/video/detect_frame",
            "video_classes": "/video/classes"
        }
    }


@app.get("/health")
async def health_check():
    """健康检查端点"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.FLASK_PORT,
        reload=settings.FLASK_DEBUG
    )

