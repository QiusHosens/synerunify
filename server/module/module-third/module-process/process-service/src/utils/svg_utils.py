from PIL import Image, ImageFilter, ImageEnhance
import numpy as np
from pathlib import Path

try:
    import cv2
    CV2_AVAILABLE = True
except ImportError:
    CV2_AVAILABLE = False
    print("Warning: OpenCV (cv2) is not installed. Install it for color region processing:")
    print("  pip install opencv-python")

try:
    from sklearn.cluster import KMeans
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    print("Warning: scikit-learn is not installed. Install it for color clustering:")
    print("  pip install scikit-learn")

# Global variable to store EDSR model
_EDSR_MODEL = None
_EDSR_MODEL_PATH = '../../models/EDSR_x4.pb'
_EDSR_AVAILABLE = False

# Check if dnn_superres is available
try:
    from cv2 import dnn_superres
    _EDSR_AVAILABLE = True
except ImportError:
    _EDSR_AVAILABLE = False


def _rgb_to_hex(rgb):
    """将RGB颜色转换为十六进制格式"""
    return f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"


def load_edsr_model() -> bool:
    """
    加载EDSR (Enhanced Deep Super-Resolution) 模型用于图片放大
    
    Returns:
        True if model loaded successfully, False otherwise
    """
    global _EDSR_MODEL, _EDSR_MODEL_PATH, _EDSR_AVAILABLE

    if not CV2_AVAILABLE:
        print("Error: OpenCV (cv2) is required to use EDSR model.")
        print("Please install it: pip install opencv-python")
        return False

    if not _EDSR_AVAILABLE:
        print("Error: OpenCV dnn_superres module is not available.")
        print("Please install OpenCV with contrib modules: pip install opencv-contrib-python")
        return False

    if _EDSR_MODEL_PATH is None:
        print("Error: EDSR model path is not set.")
        return False

    try:
        # Check if model file exists
        model_file = Path(_EDSR_MODEL_PATH)
        if not model_file.exists():
            print(f"Warning: EDSR model file not found: {_EDSR_MODEL_PATH}")
            print("Falling back to LANCZOS resampling.")
            return False

        # Create DnnSuperResImpl object
        _EDSR_MODEL = dnn_superres.DnnSuperResImpl_create()

        # Read model
        _EDSR_MODEL.readModel(str(model_file))

        # Set model type and scale (EDSR x4)
        _EDSR_MODEL.setModel("edsr", 4)

        print(f"Successfully loaded EDSR model from: {_EDSR_MODEL_PATH}")
        return True

    except Exception as e:
        print(f"Warning: Error loading EDSR model: {e}")
        print("Falling back to LANCZOS resampling.")
        return False


def upscale_image_with_edsr(image: Image.Image) -> Image.Image:
    """
    使用EDSR模型将图片放大4倍
    
    Args:
        image: PIL Image对象
        
    Returns:
        放大4倍后的PIL Image，如果EDSR不可用则使用LANCZOS重采样
    """
    global _EDSR_MODEL, _EDSR_MODEL_PATH

    if not CV2_AVAILABLE:
        print("Warning: OpenCV (cv2) is not available. Falling back to LANCZOS resampling.")
        width, height = image.size
        return image.resize((width * 4, height * 4), Image.Resampling.LANCZOS)

    # Load model if not already loaded
    if _EDSR_MODEL is None:
        if not load_edsr_model():
            print("Warning: EDSR model not loaded. Falling back to LANCZOS resampling.")
            width, height = image.size
            return image.resize((width * 4, height * 4), Image.Resampling.LANCZOS)

    try:
        # Convert PIL Image to numpy array (BGR format for OpenCV)
        img_array = np.array(image.convert('RGB'))
        img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)

        # Get original dimensions
        height, width = img_bgr.shape[:2]

        # Use dnn_superres upsample method
        upscaled_bgr = _EDSR_MODEL.upsample(img_bgr)

        # Convert BGR back to RGB
        upscaled_rgb = cv2.cvtColor(upscaled_bgr, cv2.COLOR_BGR2RGB)

        # Convert back to PIL Image
        upscaled_image = Image.fromarray(upscaled_rgb)

        print(f"Successfully upscaled image using EDSR: {width}x{height} -> {upscaled_image.width}x{upscaled_image.height}")
        return upscaled_image

    except Exception as e:
        print(f"Warning: Error during EDSR upscaling: {e}")
        print("Falling back to LANCZOS resampling.")
        width, height = image.size
        return image.resize((width * 4, height * 4), Image.Resampling.LANCZOS)


def _sharpen_image(img_array: np.ndarray, sharpen_factor: float = 2.0) -> np.ndarray:
    """
    锐化图片
    
    Args:
        img_array: RGB图像数组 (H, W, 3)
        sharpen_factor: 锐化因子，值越大锐化效果越强（默认2.0）
        
    Returns:
        锐化后的图像数组
    """
    # 转换为PIL Image
    img = Image.fromarray(img_array, mode='RGB')
    
    # 使用ImageEnhance.Sharpness进行锐化
    enhancer = ImageEnhance.Sharpness(img)
    img_sharpened = enhancer.enhance(sharpen_factor)
    
    # 可选：应用UnsharpMask滤镜进一步增强锐化效果
    img_sharpened = img_sharpened.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))
    
    # 转换回numpy数组
    return np.array(img_sharpened)


def _remove_white_background(img_array: np.ndarray, white_threshold: int = 240) -> np.ndarray:
    """
    去除图片中的白色背景
    
    Args:
        img_array: RGB图像数组 (H, W, 3)
        white_threshold: RGB阈值，超过此值被认为是白色 (0-255)
        
    Returns:
        去除白色后的图像数组，白色区域变为透明（使用alpha通道）
    """
    # 创建alpha通道
    h, w = img_array.shape[:2]
    result = np.zeros((h, w, 4), dtype=np.uint8)
    
    # 判断白色区域
    white_mask = (img_array[:, :, 0] > white_threshold) & \
                 (img_array[:, :, 1] > white_threshold) & \
                 (img_array[:, :, 2] > white_threshold)
    
    # 非白色区域保留原色，alpha=255
    result[:, :, :3] = img_array
    result[:, :, 3] = np.where(white_mask, 0, 255)
    
    return result


def _get_dominant_color(region_pixels: np.ndarray) -> tuple:
    """
    获取区域的主要颜色
    - 如果平均颜色接近最深的颜色，使用最深的颜色
    - 如果平均颜色接近白色，使用白色
    - 否则使用平均颜色
    
    Args:
        region_pixels: 区域像素数组 (N, 3) RGB格式
        
    Returns:
        RGB颜色元组 (R, G, B)
    """
    if len(region_pixels) == 0:
        return (0, 0, 0)
    
    # 计算平均颜色
    avg_color = np.mean(region_pixels, axis=0).astype(np.uint8)
    
    # # 计算每个像素的亮度（灰度值）
    # # 使用标准亮度公式: 0.299*R + 0.587*G + 0.114*B
    # brightness = (region_pixels[:, 0] * 0.299 + 
    #               region_pixels[:, 1] * 0.587 + 
    #               region_pixels[:, 2] * 0.114)
    
    # # 找到最深的颜色（亮度最低的像素）
    # darkest_idx = np.argmin(brightness)
    # darkest_color = region_pixels[darkest_idx].astype(np.uint8)
    
    # # 找到最浅的颜色（亮度最高的像素，可能是白色）
    # lightest_idx = np.argmax(brightness)
    # lightest_color = region_pixels[lightest_idx].astype(np.uint8)
    
    # # 计算平均颜色的亮度
    # avg_brightness = (avg_color[0] * 0.299 + 
    #                   avg_color[1] * 0.587 + 
    #                   avg_color[2] * 0.114)
    
    # # 计算最深颜色的亮度
    # darkest_brightness = (darkest_color[0] * 0.299 + 
    #                       darkest_color[1] * 0.587 + 
    #                       darkest_color[2] * 0.114)
    
    # # 计算最浅颜色的亮度
    # lightest_brightness = (lightest_color[0] * 0.299 + 
    #                        lightest_color[1] * 0.587 + 
    #                        lightest_color[2] * 0.114)
    
    # # 计算颜色距离（使用欧氏距离）
    # def color_distance(c1, c2):
    #     return np.sqrt(np.sum((c1 - c2) ** 2))
    
    # # 计算平均颜色与最深颜色和最浅颜色的距离
    # dist_to_darkest = color_distance(avg_color, darkest_color)
    # dist_to_lightest = color_distance(avg_color, lightest_color)
    
    # # 判断平均颜色是否接近白色（RGB值都大于240）
    # is_near_white = (avg_color[0] > 240 and avg_color[1] > 240 and avg_color[2] > 240)
    
    # # 判断平均颜色是否接近最深颜色（距离小于阈值）
    # # 阈值设为30，可以根据需要调整
    # threshold = 30
    # is_near_darkest = dist_to_darkest < threshold
    
    # # 判断平均颜色是否接近最浅颜色（距离小于阈值）
    # is_near_lightest = dist_to_lightest < threshold
    
    # # 计算白色区域占比
    # # 白色阈值：RGB值都大于240的像素被认为是白色
    # white_threshold = 240
    # white_pixels = np.sum((region_pixels[:, 0] > white_threshold) & 
    #                       (region_pixels[:, 1] > white_threshold) & 
    #                       (region_pixels[:, 2] > white_threshold))
    # white_ratio = white_pixels / len(region_pixels) if len(region_pixels) > 0 else 0.0

    # print("--------------------------------")
    # print(f"avg_color: {avg_color}, darkest_color: {darkest_color}, lightest_color: {lightest_color}")
    # print(f"dist_to_darkest: {dist_to_darkest}, dist_to_lightest: {dist_to_lightest}")
    # print(f"is_near_white: {is_near_white}, is_near_darkest: {is_near_darkest}, is_near_lightest: {is_near_lightest}")
    # print(f"lightest_brightness: {lightest_brightness}, darkest_brightness: {darkest_brightness}")
    # print(f"white_ratio: {white_ratio:.2%} ({white_pixels}/{len(region_pixels)})")
    # print("--------------------------------")
    
    # # 根据条件选择颜色
    # # 如果白色占比很高（>50%），也使用白色
    # # if is_near_white or (is_near_lightest and lightest_brightness > 200):
    # if is_near_white or white_ratio > 0.7:
    #     # 接近白色，使用白色
    #     return (255, 255, 255)
    # elif is_near_darkest:
    #     # 接近最深颜色，使用最深的颜色
    #     return tuple(darkest_color)
    # else:
    #     # 否则使用平均颜色
    #     return tuple(avg_color)
    return tuple(avg_color)


def _find_color_regions(img_array: np.ndarray, min_area: int = 100, color_tolerance: int = 30) -> list:
    """
    识别图片中的不同颜色区域
    
    Args:
        img_array: RGBA图像数组 (H, W, 4)
        min_area: 最小区域面积，小于此值的区域将被忽略
        color_tolerance: 颜色容差，用于合并相似颜色的区域
        
    Returns:
        区域列表，每个区域包含：
        - mask: 区域的二值掩码
        - color: 区域的主要颜色 (R, G, B)
        - contour: 区域的轮廓点
    """
    if not CV2_AVAILABLE:
        raise ImportError("OpenCV is required for color region detection")
    
    regions = []
    h, w = img_array.shape[:2]
    
    # 创建非白色区域的掩码
    alpha_channel = img_array[:, :, 3]
    non_white_mask = (alpha_channel > 0).astype(np.uint8) * 255
    
    if np.sum(non_white_mask) == 0:
        return regions
    
    # 提取RGB通道
    rgb_img = img_array[:, :, :3]
    
    # 改进策略：先检测所有轮廓（包括内部被包含的区域），然后对每个轮廓单独计算颜色
    # 这样可以更准确地识别被包含的区域（如圆形内的星星）
    # 内孔中可能包含独立区域，需要单独处理
    
    # 使用RETR_TREE检测所有轮廓（包括内部被包含的区域）
    contours, hierarchy = cv2.findContours(non_white_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    
    if hierarchy is None or len(contours) == 0:
        return regions
    
    # 处理所有轮廓，考虑外圆和内孔的关系
    # 内孔中可能包含独立区域，不能直接排除
    processed_indices = set()  # 记录已处理的轮廓索引
    
    for i, contour in enumerate(contours):
        if cv2.contourArea(contour) < min_area:
            continue
        
        if i in processed_indices:
            continue
        
        # 检查是否有子轮廓（内孔）
        child_idx = hierarchy[0][i][2]
        has_children = child_idx >= 0
        
        # 创建该轮廓的掩码
        contour_mask = np.zeros((h, w), dtype=np.uint8)
        cv2.fillPoly(contour_mask, [contour], 255)
        
        # 收集子轮廓（内孔），判断哪些是真正的孔，哪些是独立区域
        holes = []  # 真正的内孔（需要排除的）
        
        if has_children:
            current_child = child_idx
            while current_child >= 0:
                child_contour = contours[current_child]
                if cv2.contourArea(child_contour) >= min_area:
                    # 检查内孔内部是否有颜色内容
                    child_mask = np.zeros((h, w), dtype=np.uint8)
                    cv2.fillPoly(child_mask, [child_contour], 255)
                    child_pixels = rgb_img[child_mask > 0]
                    
                    if len(child_pixels) > 0:
                        # 检查内孔内部是否有非白色内容
                        avg_color = np.mean(child_pixels, axis=0)
                        # 如果平均颜色不是白色（RGB值都小于240），说明是独立区域，不排除
                        is_white = (avg_color[0] > 240 and avg_color[1] > 240 and avg_color[2] > 240)
                        
                        if is_white:
                            # 这是真正的内孔，需要排除
                            cv2.fillPoly(contour_mask, [child_contour], 0)
                            holes.append(child_contour)
                        # 如果不是白色，说明是独立区域，不排除，稍后会单独处理
                    else:
                        # 没有像素，可能是真正的孔
                        cv2.fillPoly(contour_mask, [child_contour], 0)
                        holes.append(child_contour)
                
                # 移动到下一个同级子轮廓
                current_child = hierarchy[0][current_child][0]
        
        # 提取该轮廓区域的实际颜色（排除真正的内孔区域）
        contour_pixels = rgb_img[contour_mask > 0]
        if len(contour_pixels) > 0:
            # 计算主要颜色
            dominant_color = _get_dominant_color(contour_pixels)
            
            regions.append({
                'mask': contour_mask,
                'color': dominant_color,
                'contour': contour,
                'holes': holes  # 真正的内孔列表
            })
            
            processed_indices.add(i)
        
        # 处理内孔中的独立区域（递归处理子轮廓）
        if has_children:
            current_child = child_idx
            while current_child >= 0:
                if current_child not in processed_indices:
                    child_contour = contours[current_child]
                    child_mask = np.zeros((h, w), dtype=np.uint8)
                    cv2.fillPoly(child_mask, [child_contour], 255)
                    
                    # 检查是否有子轮廓（嵌套的内孔）
                    child_child_idx = hierarchy[0][current_child][2]
                    child_holes = []
                    if child_child_idx >= 0:
                        current_grandchild = child_child_idx
                        while current_grandchild >= 0:
                            grandchild_contour = contours[current_grandchild]
                            if cv2.contourArea(grandchild_contour) >= min_area:
                                cv2.fillPoly(child_mask, [grandchild_contour], 0)
                                child_holes.append(grandchild_contour)
                            current_grandchild = hierarchy[0][current_grandchild][0]
                    
                    child_pixels = rgb_img[child_mask > 0]
                    if len(child_pixels) > 0:
                        child_color = _get_dominant_color(child_pixels)
                        regions.append({
                            'mask': child_mask,
                            'color': child_color,
                            'contour': child_contour,
                            'holes': child_holes
                        })
                        processed_indices.add(current_child)
                
                current_child = hierarchy[0][current_child][0]
    
    return regions


def _find_color_regions_simple(img_array: np.ndarray, min_area: int = 100, color_tolerance: int = 30) -> list:
    """
    简单的颜色区域检测方法（不使用K-means）
    直接使用轮廓检测，能够识别被包含的内部区域
    处理外圆和内孔的情况
    """
    if not CV2_AVAILABLE:
        raise ImportError("OpenCV is required for color region detection")
    
    regions = []
    h, w = img_array.shape[:2]
    
    # 创建非白色区域的掩码
    alpha_channel = img_array[:, :, 3]
    non_white_mask = (alpha_channel > 0).astype(np.uint8) * 255
    
    # 提取RGB通道
    rgb_img = img_array[:, :, :3]
    
    # 使用RETR_TREE检测所有轮廓（包括内部被包含的区域）
    contours, hierarchy = cv2.findContours(non_white_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    
    if hierarchy is None or len(contours) == 0:
        return regions
    
    # 处理所有轮廓，考虑外圆和内孔的关系
    # 内孔中可能包含独立区域，不能直接排除
    processed_indices = set()  # 记录已处理的轮廓索引
    
    for i, contour in enumerate(contours):
        if cv2.contourArea(contour) < min_area:
            continue
        
        if i in processed_indices:
            continue
        
        # 检查是否有子轮廓（内孔）
        child_idx = hierarchy[0][i][2]
        has_children = child_idx >= 0
        
        # 创建该轮廓的掩码
        contour_mask = np.zeros((h, w), dtype=np.uint8)
        cv2.fillPoly(contour_mask, [contour], 255)
        
        # 收集子轮廓（内孔），判断哪些是真正的孔，哪些是独立区域
        holes = []  # 真正的内孔（需要排除的）
        
        if has_children:
            current_child = child_idx
            while current_child >= 0:
                child_contour = contours[current_child]
                if cv2.contourArea(child_contour) >= min_area:
                    # 检查内孔内部是否有颜色内容
                    child_mask = np.zeros((h, w), dtype=np.uint8)
                    cv2.fillPoly(child_mask, [child_contour], 255)
                    child_pixels = rgb_img[child_mask > 0]
                    
                    if len(child_pixels) > 0:
                        # 检查内孔内部是否有非白色内容
                        avg_color = np.mean(child_pixels, axis=0)
                        # 如果平均颜色不是白色（RGB值都小于240），说明是独立区域，不排除
                        is_white = (avg_color[0] > 240 and avg_color[1] > 240 and avg_color[2] > 240)
                        
                        if is_white:
                            # 这是真正的内孔，需要排除
                            cv2.fillPoly(contour_mask, [child_contour], 0)
                            holes.append(child_contour)
                        # 如果不是白色，说明是独立区域，不排除，稍后会单独处理
                    else:
                        # 没有像素，可能是真正的孔
                        cv2.fillPoly(contour_mask, [child_contour], 0)
                        holes.append(child_contour)
                
                # 移动到下一个同级子轮廓
                current_child = hierarchy[0][current_child][0]
        
        # 提取该轮廓区域的实际颜色（排除真正的内孔区域）
        contour_pixels = rgb_img[contour_mask > 0]
        if len(contour_pixels) > 0:
            # 计算主要颜色
            dominant_color = _get_dominant_color(contour_pixels)
            
            regions.append({
                'mask': contour_mask,
                'color': dominant_color,
                'contour': contour,
                'holes': holes  # 真正的内孔列表
            })
            
            processed_indices.add(i)
        
        # 处理内孔中的独立区域（递归处理子轮廓）
        if has_children:
            current_child = child_idx
            while current_child >= 0:
                if current_child not in processed_indices:
                    child_contour = contours[current_child]
                    child_mask = np.zeros((h, w), dtype=np.uint8)
                    cv2.fillPoly(child_mask, [child_contour], 255)
                    
                    # 检查是否有子轮廓（嵌套的内孔）
                    child_child_idx = hierarchy[0][current_child][2]
                    child_holes = []
                    if child_child_idx >= 0:
                        current_grandchild = child_child_idx
                        while current_grandchild >= 0:
                            grandchild_contour = contours[current_grandchild]
                            if cv2.contourArea(grandchild_contour) >= min_area:
                                cv2.fillPoly(child_mask, [grandchild_contour], 0)
                                child_holes.append(grandchild_contour)
                            current_grandchild = hierarchy[0][current_grandchild][0]
                    
                    child_pixels = rgb_img[child_mask > 0]
                    if len(child_pixels) > 0:
                        child_color = _get_dominant_color(child_pixels)
                        regions.append({
                            'mask': child_mask,
                            'color': child_color,
                            'contour': child_contour,
                            'holes': child_holes
                        })
                        processed_indices.add(current_child)
                
                current_child = hierarchy[0][current_child][0]
    
    return regions


def _contour_to_svg_path(contour: np.ndarray, holes: list = None, scale: float = 1.0) -> str:
    """
    将OpenCV轮廓转换为SVG路径字符串，支持内孔
    
    Args:
        contour: OpenCV轮廓点数组（外轮廓）
        holes: 内孔轮廓列表（可选）
        scale: 缩放因子，用于缩小或放大坐标（默认1.0）
        
    Returns:
        SVG路径字符串，包含外轮廓和内孔
    """
    if len(contour) < 3:
        return ""
    
    path_parts = []
    
    # 添加外轮廓
    for i, point in enumerate(contour):
        x, y = point[0]
        x_scaled = x * scale
        y_scaled = y * scale
        if i == 0:
            path_parts.append(f"M {x_scaled},{y_scaled}")
        else:
            path_parts.append(f"L {x_scaled},{y_scaled}")
    path_parts.append("Z")
    
    # 添加内孔（如果有）
    if holes:
        for hole in holes:
            if len(hole) < 3:
                continue
            for i, point in enumerate(hole):
                x, y = point[0]
                x_scaled = x * scale
                y_scaled = y * scale
                if i == 0:
                    path_parts.append(f"M {x_scaled},{y_scaled}")
                else:
                    path_parts.append(f"L {x_scaled},{y_scaled}")
            path_parts.append("Z")
    
    return " ".join(path_parts)


def process_image_and_generate_svg(
    input_path: str,
    output_path: str,
    white_threshold: int = 240,
    min_area: int = 100,
    stroke_width: int = 2,
    sharpen_factor: float = 2.0
) -> bool:
    """
    处理图片并生成SVG：
    1. 锐化图片
    2. 去掉图片白色背景
    3. 对图片中有色部分分别描边
    4. 对于每个部分，根据其颜色进行染色，染成单色
    5. 根据以上结果生成SVG图片
    
    Args:
        input_path: 输入图片路径
        output_path: 输出SVG文件路径
        white_threshold: 白色阈值 (0-255)，超过此值被认为是白色
        min_area: 最小区域面积，小于此值的区域将被忽略
        stroke_width: 描边宽度（像素）
        sharpen_factor: 锐化因子，值越大锐化效果越强（默认2.0）
        
    Returns:
        True if successful, False otherwise
    """
    if not CV2_AVAILABLE:
        print("Error: OpenCV (cv2) is required for this function.")
        print("Please install it: pip install opencv-python")
        return False
    
    try:
        # 1. 加载图片
        img = Image.open(input_path)
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        original_w, original_h = img.size
        
        # 2. 使用EDSR放大4倍
        img_upscaled = upscale_image_with_edsr(img)
        
        # 3. 转换为numpy数组并锐化
        img_array = np.array(img_upscaled)
        img_array = _sharpen_image(img_array, sharpen_factor)
        
        # 记录放大后的尺寸
        h, w = img_array.shape[:2]
        
        # 4. 去除白色背景
        img_rgba = _remove_white_background(img_array, white_threshold)
        
        # 5. 识别颜色区域
        regions = _find_color_regions(img_rgba, min_area)
        
        if len(regions) == 0:
            print("Warning: No color regions found in the image")
            return False
        
        # 6. 生成SVG内容
        # 按轮廓面积排序，先绘制大的（外部）轮廓，再绘制小的（内部）轮廓
        # 这样可以确保内部区域显示在外部区域之上
        regions_sorted = sorted(regions, key=lambda r: cv2.contourArea(r['contour']), reverse=True)
        
        # 缩小4倍（因为之前用EDSR放大了4倍）
        scale_factor = 0.25
        svg_w = int(w * scale_factor)
        svg_h = int(h * scale_factor)
        svg_stroke_width = stroke_width * scale_factor
        
        svg_paths = []
        for region in regions_sorted:
            contour = region['contour']
            color = region['color']
            color_hex = _rgb_to_hex(color)
            
            # 将轮廓转换为SVG路径（包含外轮廓和内孔），坐标缩小4倍
            holes = region.get('holes', [])
            path_data = _contour_to_svg_path(contour, holes, scale_factor)
            if path_data:
                svg_paths.append({
                    'path': path_data,
                    'fill': color_hex,
                    'stroke': color_hex,
                    'stroke_width': svg_stroke_width,
                    'has_holes': len(holes) > 0
                })
        
        # 7. 构建完整的SVG文档
        svg_content = f'<svg xmlns="http://www.w3.org/2000/svg" width="{svg_w}" height="{svg_h}">\n'
        
        for svg_path_info in svg_paths:
            svg_content += f'  <path d="{svg_path_info["path"]}" '
            svg_content += f'fill="{svg_path_info["fill"]}" '
            svg_content += f'stroke="{svg_path_info["stroke"]}" '
            svg_content += f'stroke-width="{svg_path_info["stroke_width"]}" '
            # 如果有内孔，使用evenodd填充规则
            if svg_path_info.get('has_holes', False):
                svg_content += f'fill-rule="evenodd" '
            svg_content += f'stroke-linejoin="round" stroke-linecap="round"/>\n'
        
        svg_content += '</svg>'
        
        # 6. 保存SVG文件
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)
        
        print(f"Successfully processed image and generated SVG: {input_path} -> {output_path}")
        print(f"Original size: {original_w}x{original_h}, Upscaled size: {w}x{h}, SVG size: {svg_w}x{svg_h}")
        print(f"Found {len(svg_paths)} color regions")
        return True
        
    except FileNotFoundError:
        print(f"Error: File not found: {input_path}")
        return False
    except Exception as e:
        print(f"Error occurred during processing: {e}")
        import traceback
        traceback.print_exc()
        return False


def process_image_bytes_and_generate_svg(
    image_bytes: bytes,
    output_path: str,
    white_threshold: int = 240,
    min_area: int = 100,
    stroke_width: int = 2,
    sharpen_factor: float = 2.0
) -> bool:
    """
    处理图片字节数据并生成SVG（功能同process_image_and_generate_svg）
    
    Args:
        image_bytes: 图片字节数据
        output_path: 输出SVG文件路径
        white_threshold: 白色阈值 (0-255)
        min_area: 最小区域面积
        stroke_width: 描边宽度（像素）
        sharpen_factor: 锐化因子，值越大锐化效果越强（默认2.0）
        
    Returns:
        True if successful, False otherwise
    """
    if not CV2_AVAILABLE:
        print("Error: OpenCV (cv2) is required for this function.")
        print("Please install it: pip install opencv-python")
        return False
    
    try:
        from io import BytesIO
        
        # 从字节数据加载图片
        img = Image.open(BytesIO(image_bytes))
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        original_w, original_h = img.size
        
        # 使用EDSR放大4倍
        img_upscaled = upscale_image_with_edsr(img)
        
        # 转换为numpy数组并锐化
        img_array = np.array(img_upscaled)
        img_array = _sharpen_image(img_array, sharpen_factor)
        
        # 记录放大后的尺寸
        h, w = img_array.shape[:2]
        
        # 去除白色背景
        img_rgba = _remove_white_background(img_array, white_threshold)
        
        # 识别颜色区域
        regions = _find_color_regions(img_rgba, min_area)
        
        if len(regions) == 0:
            print("Warning: No color regions found in the image")
            return False
        
        # 生成SVG内容
        # 按轮廓面积排序，先绘制大的（外部）轮廓，再绘制小的（内部）轮廓
        regions_sorted = sorted(regions, key=lambda r: cv2.contourArea(r['contour']), reverse=True)
        
        # 缩小4倍（因为之前用EDSR放大了4倍）
        scale_factor = 0.25
        svg_w = int(w * scale_factor)
        svg_h = int(h * scale_factor)
        svg_stroke_width = stroke_width * scale_factor
        
        svg_paths = []
        for region in regions_sorted:
            contour = region['contour']
            color = region['color']
            color_hex = _rgb_to_hex(color)
            
            holes = region.get('holes', [])  # 获取内孔列表
            # 将轮廓转换为SVG路径（包含外轮廓和内孔），坐标缩小4倍
            path_data = _contour_to_svg_path(contour, holes, scale_factor)
            if path_data:
                svg_paths.append({
                    'path': path_data,
                    'fill': color_hex,
                    'stroke': color_hex,
                    'stroke_width': svg_stroke_width,
                    'has_holes': len(holes) > 0
                })
        
        # 构建SVG文档
        svg_content = f'<svg xmlns="http://www.w3.org/2000/svg" width="{svg_w}" height="{svg_h}">\n'
        
        for svg_path_info in svg_paths:
            svg_content += f'  <path d="{svg_path_info["path"]}" '
            svg_content += f'fill="{svg_path_info["fill"]}" '
            svg_content += f'stroke="{svg_path_info["stroke"]}" '
            svg_content += f'stroke-width="{svg_path_info["stroke_width"]}" '
            # 如果有内孔，使用evenodd填充规则
            if svg_path_info.get('has_holes', False):
                svg_content += f'fill-rule="evenodd" '
            svg_content += f'stroke-linejoin="round" stroke-linecap="round"/>\n'
        
        svg_content += '</svg>'
        
        # 保存SVG文件
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)
        
        print(f"Successfully processed image bytes and generated SVG: {output_path}")
        print(f"Original size: {original_w}x{original_h}, Upscaled size: {w}x{h}, SVG size: {svg_w}x{svg_h}")
        print(f"Found {len(svg_paths)} color regions")
        return True
        
    except Exception as e:
        print(f"Error occurred during processing: {e}")
        import traceback
        traceback.print_exc()
        return False


def show_processed_image(
    input_path: str,
    white_threshold: int = 240,
    min_area: int = 100,
    window_title: str = "Processed Image",
    sharpen_factor: float = 2.0
) -> bool:
    """
    显示处理后的图片（用于调试和预览）
    显示所有处理步骤的结果：
    1. 原始图片
    2. 锐化后的图片
    3. 去除白色背景后的图片
    4. 轮廓检测结果（显示所有轮廓）
    5. 最终处理结果（每个区域用单色填充）
    
    Args:
        input_path: 输入图片路径
        white_threshold: 白色阈值 (0-255)
        min_area: 最小区域面积
        window_title: 窗口标题
        sharpen_factor: 锐化因子，值越大锐化效果越强（默认2.0）
        
    Returns:
        True if successful, False otherwise
    """
    if not CV2_AVAILABLE:
        print("Error: OpenCV (cv2) is required for this function.")
        print("Please install it: pip install opencv-python")
        return False
    
    try:
        import matplotlib.pyplot as plt
        
        # 步骤1: 加载原始图片
        img = Image.open(input_path)
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        original_w, original_h = img.size
        
        # 步骤2: 使用EDSR放大4倍
        img_upscaled = upscale_image_with_edsr(img)
        
        # 步骤3: 锐化图片
        img_array = np.array(img_upscaled)
        img_sharpened = _sharpen_image(img_array, sharpen_factor)
        
        h, w = img_sharpened.shape[:2]
        
        # 步骤4: 去除白色背景
        img_rgba = _remove_white_background(img_sharpened, white_threshold)
        img_no_white = img_rgba[:, :, :3].copy()
        # 将透明区域显示为黑色背景
        alpha_channel = img_rgba[:, :, 3]
        img_no_white[alpha_channel == 0] = [0, 0, 0]
        
        # 步骤4: 识别颜色区域
        regions = _find_color_regions(img_rgba, min_area)
        
        # 创建轮廓检测结果图像（显示所有轮廓）
        contour_img = img_sharpened.copy()
        for region in regions:
            contour = region['contour']
            color = region['color']
            # 绘制轮廓
            cv2.drawContours(contour_img, [contour], -1, tuple(map(int, color)), 2)
        
        # 步骤5: 创建最终结果图像（每个区域用单色填充）
        result_img = np.zeros_like(img_sharpened)
        for region in regions:
            mask = region['mask']
            color = region['color']
            result_img[mask > 0] = color
        
        # 创建2x3的子图显示所有步骤
        fig, axes = plt.subplots(2, 3, figsize=(24, 16))
        fig.suptitle(window_title, fontsize=16, fontweight='bold')
        
        # 步骤1: 原始图片
        axes[0, 0].imshow(img)
        axes[0, 0].set_title(f'步骤1: 原始图片 ({original_w}x{original_h})', fontsize=14, fontweight='bold')
        axes[0, 0].axis('off')
        
        # 步骤2: EDSR放大4倍后的图片
        axes[0, 1].imshow(img_upscaled)
        axes[0, 1].set_title(f'步骤2: EDSR放大4倍 ({img_upscaled.width}x{img_upscaled.height})', fontsize=14, fontweight='bold')
        axes[0, 1].axis('off')
        
        # 步骤3: 锐化后的图片
        axes[0, 2].imshow(img_sharpened)
        axes[0, 2].set_title(f'步骤3: 锐化处理 (锐化因子={sharpen_factor})', fontsize=14, fontweight='bold')
        axes[0, 2].axis('off')
        
        # 步骤4: 去除白色背景后的图片
        axes[1, 0].imshow(img_no_white)
        axes[1, 0].set_title(f'步骤4: 去除白色背景 (阈值={white_threshold})', fontsize=14, fontweight='bold')
        axes[1, 0].axis('off')
        
        # 步骤5: 轮廓检测结果
        axes[1, 1].imshow(contour_img)
        axes[1, 1].set_title(f'步骤5: 轮廓检测结果 (检测到 {len(regions)} 个区域)', fontsize=14, fontweight='bold')
        axes[1, 1].axis('off')
        
        # 步骤6: 最终处理结果（单色填充）
        axes[1, 2].imshow(result_img)
        axes[1, 2].set_title(f'步骤6: 最终结果 (每个区域单色填充)', fontsize=14, fontweight='bold')
        axes[1, 2].axis('off')
        
        plt.tight_layout()
        plt.show()
        
        # 打印详细信息
        print(f"\n处理完成: {input_path}")
        print(f"  原始图片尺寸: {original_w}x{original_h}")
        print(f"  放大后尺寸: {w}x{h}")
        print(f"  白色阈值: {white_threshold}")
        print(f"  最小区域面积: {min_area}")
        print(f"  检测到的区域数量: {len(regions)}")
        if len(regions) > 0:
            print(f"  区域颜色信息:")
            for i, region in enumerate(regions[:10]):  # 只显示前10个区域
                color = region['color']
                area = cv2.contourArea(region['contour'])
                color_hex = _rgb_to_hex(color)
                print(f"    区域 {i+1}: RGB{color}, {color_hex}, 面积={area:.0f}")
            if len(regions) > 10:
                print(f"    ... 还有 {len(regions) - 10} 个区域")
        
        return True
        
    except ImportError:
        print("Error: matplotlib is required for image display.")
        print("Please install it: pip install matplotlib")
        return False
    except Exception as e:
        print(f"Error occurred during display: {e}")
        import traceback
        traceback.print_exc()
        return False


def show_processed_image_from_bytes(
    image_bytes: bytes,
    white_threshold: int = 240,
    min_area: int = 100,
    window_title: str = "Processed Image",
    sharpen_factor: float = 2.0
) -> bool:
    """
    从字节数据显示处理后的图片（用于调试和预览）
    显示所有处理步骤的结果：
    1. 原始图片
    2. 锐化后的图片
    3. 去除白色背景后的图片
    4. 轮廓检测结果（显示所有轮廓）
    5. 最终处理结果（每个区域用单色填充）
    
    Args:
        image_bytes: 图片字节数据
        white_threshold: 白色阈值 (0-255)
        min_area: 最小区域面积
        window_title: 窗口标题
        sharpen_factor: 锐化因子，值越大锐化效果越强（默认2.0）
        
    Returns:
        True if successful, False otherwise
    """
    if not CV2_AVAILABLE:
        print("Error: OpenCV (cv2) is required for this function.")
        print("Please install it: pip install opencv-python")
        return False
    
    try:
        from io import BytesIO
        import matplotlib.pyplot as plt
        
        # 步骤1: 从字节数据加载原始图片
        img = Image.open(BytesIO(image_bytes))
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        original_w, original_h = img.size
        
        # 步骤2: 使用EDSR放大4倍
        img_upscaled = upscale_image_with_edsr(img)
        
        # 步骤3: 锐化图片
        img_array = np.array(img_upscaled)
        img_sharpened = _sharpen_image(img_array, sharpen_factor)
        
        h, w = img_sharpened.shape[:2]
        
        # 步骤4: 去除白色背景
        img_rgba = _remove_white_background(img_sharpened, white_threshold)
        img_no_white = img_rgba[:, :, :3].copy()
        # 将透明区域显示为黑色背景
        alpha_channel = img_rgba[:, :, 3]
        img_no_white[alpha_channel == 0] = [0, 0, 0]
        
        # 步骤4: 识别颜色区域
        regions = _find_color_regions(img_rgba, min_area)
        
        # 创建轮廓检测结果图像（显示所有轮廓）
        contour_img = img_sharpened.copy()
        for region in regions:
            contour = region['contour']
            color = region['color']
            # 绘制轮廓
            cv2.drawContours(contour_img, [contour], -1, tuple(map(int, color)), 2)
        
        # 步骤6: 创建最终结果图像（每个区域用单色填充）
        result_img = np.zeros_like(img_sharpened)
        for region in regions:
            mask = region['mask']
            color = region['color']
            result_img[mask > 0] = color
        
        # 创建2x3的子图显示所有步骤
        fig, axes = plt.subplots(2, 3, figsize=(24, 16))
        fig.suptitle(window_title, fontsize=16, fontweight='bold')
        
        # 步骤1: 原始图片
        axes[0, 0].imshow(img)
        axes[0, 0].set_title(f'步骤1: 原始图片 ({original_w}x{original_h})', fontsize=14, fontweight='bold')
        axes[0, 0].axis('off')
        
        # 步骤2: EDSR放大4倍后的图片
        axes[0, 1].imshow(img_upscaled)
        axes[0, 1].set_title(f'步骤2: EDSR放大4倍 ({img_upscaled.width}x{img_upscaled.height})', fontsize=14, fontweight='bold')
        axes[0, 1].axis('off')
        
        # 步骤3: 锐化后的图片
        axes[0, 2].imshow(img_sharpened)
        axes[0, 2].set_title(f'步骤3: 锐化处理 (锐化因子={sharpen_factor})', fontsize=14, fontweight='bold')
        axes[0, 2].axis('off')
        
        # 步骤4: 去除白色背景后的图片
        axes[1, 0].imshow(img_no_white)
        axes[1, 0].set_title(f'步骤4: 去除白色背景 (阈值={white_threshold})', fontsize=14, fontweight='bold')
        axes[1, 0].axis('off')
        
        # 步骤5: 轮廓检测结果
        axes[1, 1].imshow(contour_img)
        axes[1, 1].set_title(f'步骤5: 轮廓检测结果 (检测到 {len(regions)} 个区域)', fontsize=14, fontweight='bold')
        axes[1, 1].axis('off')
        
        # 步骤6: 最终处理结果（单色填充）
        axes[1, 2].imshow(result_img)
        axes[1, 2].set_title(f'步骤6: 最终结果 (每个区域单色填充)', fontsize=14, fontweight='bold')
        axes[1, 2].axis('off')
        
        plt.tight_layout()
        plt.show()
        
        # 打印详细信息
        print(f"\n处理完成: (从字节数据)")
        print(f"  原始图片尺寸: {original_w}x{original_h}")
        print(f"  放大后尺寸: {w}x{h}")
        print(f"  白色阈值: {white_threshold}")
        print(f"  最小区域面积: {min_area}")
        print(f"  检测到的区域数量: {len(regions)}")
        if len(regions) > 0:
            print(f"  区域颜色信息:")
            for i, region in enumerate(regions[:10]):  # 只显示前10个区域
                color = region['color']
                area = cv2.contourArea(region['contour'])
                color_hex = _rgb_to_hex(color)
                print(f"    区域 {i+1}: RGB{color}, {color_hex}, 面积={area:.0f}")
            if len(regions) > 10:
                print(f"    ... 还有 {len(regions) - 10} 个区域")
        
        return True
        
    except ImportError:
        print("Error: matplotlib is required for image display.")
        print("Please install it: pip install matplotlib")
        return False
    except Exception as e:
        print(f"Error occurred during display: {e}")
        import traceback
        traceback.print_exc()
        return False


# 示例用法
if __name__ == "__main__":
    input_file = "../../samples/png/test.png"
    output_file = "../../samples/svg/test_processed.svg"
    
    # 处理图片并生成SVG
    process_image_and_generate_svg(
        input_file,
        output_file,
        white_threshold=240,
        min_area=0,
        stroke_width=2
    )
    
    # 显示处理结果（可选）
    show_processed_image(input_file, min_area=1)

