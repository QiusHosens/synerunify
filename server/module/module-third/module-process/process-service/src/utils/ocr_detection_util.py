import json
import io
import tempfile
from pathlib import Path
from typing import Dict, Any, List
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
        
        # Generate output path
        if len(result_img_dict) == 1:
            # Single image: use source file name directly
            output_path = f"{base_output_path}/{source_file_name}{file_ext}"
        else:
            # Multiple images: append key to filename
            output_path = f"{base_output_path}/{source_file_name}_{key}{file_ext}"
        
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
    # result_data = {
    #     "results": [],
    #     "output_files": [],
    #     "error": None
    # }
    
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

            return {
                "path": uploaded_paths,
                "json": json.dumps(res.json, ensure_ascii=False, indent=4)
            }
            
            # # Add uploaded paths to output files list
            # result_data["output_files"].extend(uploaded_paths)
            #
            # # Save result information
            # result_info = {
            #     "result_index": res_idx + 1,
            #     "json": res.json if hasattr(res, 'json') else None,
            #     "output_files": uploaded_paths
            # }
            # result_data["results"].append(result_info)
            
        return None
        
    except Exception:
        import traceback
        # 暂时注释掉堆栈打印以避免接口服务端输出
        # traceback.print_exc()
        return None