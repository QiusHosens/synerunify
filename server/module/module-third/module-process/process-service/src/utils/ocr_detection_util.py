import base64
import gzip
import json
import io
import random
import time
from pathlib import Path
from typing import Dict, List
import numpy as np
from PIL import Image

from paddleocr import PaddleOCR
from src.utils.minio_util import (
    download_from_minio,
    upload_to_minio,
    parse_minio_path
)

# 初始化 PaddleOCR
ocr = PaddleOCR(
    use_doc_orientation_classify=False, # 通过 use_doc_orientation_classify 参数指定不使用文档方向分类模型
    use_doc_unwarping=False, # 通过 use_doc_unwarping 参数指定不使用文本图像矫正模型
    use_textline_orientation=False, # 通过 use_textline_orientation 参数指定不使用文本行方向分类模型
)


def _image_to_bytes(img: Image.Image, format: str = "PNG") -> bytes:
    """
    Convert PIL Image to bytes
    
    Args:
        img: PIL Image object
        format: Image format (PNG, JPEG, etc.)
        
    Returns:
        Image bytes data
    """
    img_bytes = io.BytesIO()
    img.save(img_bytes, format=format)
    img_bytes.seek(0)
    return img_bytes.read()


def upload_result_images_to_minio(
    result_img_dict: Dict[str, Image.Image],
    base_output_path: str,
    source_file_name: str,
    image_format: str = "PNG"
) -> List[str]:
    """
    Upload OCR result images directly to MinIO
    
    Args:
        result_img_dict: Dictionary of image results from res.img property
        base_output_path: Base MinIO output directory path
        source_file_name: Source file name (without extension) for naming output files
        image_format: Image format (PNG, JPEG, etc.)
        
    Returns:
        List of uploaded MinIO paths
    """
    uploaded_paths = []
    
    # Determine file extension based on format
    ext_map = {
        "PNG": ".png",
        "JPEG": ".jpg",
        "JPG": ".jpg"
    }
    file_ext = ext_map.get(image_format.upper(), ".png")
    content_type = f"image/{image_format.lower()}"
    
    for key, img in result_img_dict.items():
        # Convert PIL Image to bytes
        img_bytes = _image_to_bytes(img, format=image_format)

        # 获取当前时间戳（整数形式）
        timestamp = str(int(time.time()))

        # 生成一个 4 位随机数（你可以调整范围）
        random_num = str(random.randint(1000, 9999))

        # 拼接成字符串
        result = timestamp + random_num
        # Generate output path
        if len(result_img_dict) == 1:
            # Single image: use source file name directly
            output_path = f"{base_output_path}/{source_file_name}_{result}{file_ext}"
        else:
            # Multiple images: append key to filename
            output_path = f"{base_output_path}/{source_file_name}_{result}_{key}{file_ext}"
        
        # Upload to MinIO
        upload_to_minio(img_bytes, output_path, content_type)
        uploaded_paths.append(output_path)
    
    return uploaded_paths


def parse_document(source_file: str, output_dir: str) -> dict[str, list[str] | str] | None:
    """
    解析文档（发票）并进行 OCR 识别
    
    Args:
        source_file: MinIO 源文件路径，格式为 "bucket/object/path" 或 "s3://bucket/object/path"
        output_dir: MinIO 输出目录路径，格式同上
        
    Returns:
        包含识别结果的字典，包括：
        - results: OCR 识别结果列表
        - output_files: 输出文件路径列表
        - error: 错误信息（如果有）
    """
    ocr = PaddleOCR(
        use_doc_orientation_classify=False, # 通过 use_doc_orientation_classify 参数指定不使用文档方向分类模型
        use_doc_unwarping=False, # 通过 use_doc_unwarping 参数指定不使用文本图像矫正模型
        use_textline_orientation=False, # 通过 use_textline_orientation 参数指定不使用文本行方向分类模型
    )
    
    try:
        print('parse document start')
        # 从 MinIO 下载源文件
        file_data, file_ext = download_from_minio(source_file)

        print('download file')
        # Parse source file path to get file name
        _, source_object = parse_minio_path(source_file)
        source_file_name = Path(source_object).stem
        
        # Convert bytes to numpy array for PaddleOCR
        # PaddleOCR predict only accepts file path (str) or numpy.ndarray
        img = Image.open(io.BytesIO(file_data))
        # Convert to RGB
        rgb_image = img.convert('RGB')
        # Convert PIL Image to numpy array
        img_array = np.array(rgb_image)

        print('convert file')
        # Perform OCR prediction
        result = ocr.predict(img_array)

        print('ocr predict result')
        
        # Process each OCR result
        for res in result:
            res.print()
            # Get image dictionary from result
            result_img_dict = res.img

            print('res img')
            
            # Upload images directly to MinIO
            uploaded_paths = upload_result_images_to_minio(
                result_img_dict=result_img_dict,
                base_output_path=output_dir,
                source_file_name=source_file_name,
                image_format="PNG"
            )

            json_str = json.dumps(res.json, separators=(',', ':'), ensure_ascii=False, indent=4)
            json_bytes = json_str.encode('utf-8')

            # gzip compress
            compressed_bytes = gzip.compress(json_bytes)

            compressed_str = base64.b64encode(compressed_bytes).decode('utf-8')

            print(f"Minified JSON size: {len(json_bytes)} bytes")
            print(f"Gzipped size: {len(compressed_bytes)} bytes")
            print(f"Gzipped base64 size: {len(compressed_str)} bytes")
            print(f"Compression ratio: {len(json_bytes) / len(compressed_bytes):.2f}x")

            return {
                "path": uploaded_paths[0],
                "json": compressed_str
            }
            
        return None
        
    except Exception:
        import traceback
        # 暂时注释掉堆栈打印以避免接口服务端输出
        # traceback.print_exc()
        return None