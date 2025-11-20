from PIL import Image
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


def _rgb_to_hex(rgb):
    """将RGB颜色转换为十六进制格式"""
    return f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"


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
    
    Args:
        region_pixels: 区域像素数组 (N, 3) RGB格式
        
    Returns:
        RGB颜色元组 (R, G, B)
    """
    if len(region_pixels) == 0:
        return (0, 0, 0)
    
    # 计算平均颜色
    avg_color = np.mean(region_pixels, axis=0).astype(np.uint8)
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
    
    # 使用RETR_TREE检测所有轮廓（包括内部被包含的区域）
    contours, hierarchy = cv2.findContours(non_white_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    
    # 处理所有轮廓
    for i, contour in enumerate(contours):
        if cv2.contourArea(contour) < min_area:
            continue
        
        # 创建该轮廓的掩码
        contour_mask = np.zeros((h, w), dtype=np.uint8)
        cv2.fillPoly(contour_mask, [contour], 255)
        
        # 提取该轮廓区域的实际颜色
        contour_pixels = rgb_img[contour_mask > 0]
        if len(contour_pixels) == 0:
            continue
        
        # 计算主要颜色
        dominant_color = _get_dominant_color(contour_pixels)
        
        regions.append({
            'mask': contour_mask,
            'color': dominant_color,
            'contour': contour
        })
    
    return regions


def _find_color_regions_simple(img_array: np.ndarray, min_area: int = 100, color_tolerance: int = 30) -> list:
    """
    简单的颜色区域检测方法（不使用K-means）
    直接使用轮廓检测，能够识别被包含的内部区域
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
    
    # 处理所有轮廓
    for i, contour in enumerate(contours):
        if cv2.contourArea(contour) < min_area:
            continue
        
        # 创建该轮廓的掩码
        contour_mask = np.zeros((h, w), dtype=np.uint8)
        cv2.fillPoly(contour_mask, [contour], 255)
        
        # 提取该轮廓区域的实际颜色
        contour_pixels = rgb_img[contour_mask > 0]
        if len(contour_pixels) == 0:
            continue
        
        # 计算主要颜色
        dominant_color = _get_dominant_color(contour_pixels)
        
        regions.append({
            'mask': contour_mask,
            'color': dominant_color,
            'contour': contour
        })
    
    return regions


def _contour_to_svg_path(contour: np.ndarray) -> str:
    """
    将OpenCV轮廓转换为SVG路径字符串
    
    Args:
        contour: OpenCV轮廓点数组
        
    Returns:
        SVG路径字符串
    """
    if len(contour) < 3:
        return ""
    
    path_parts = []
    for i, point in enumerate(contour):
        x, y = point[0]
        if i == 0:
            path_parts.append(f"M {x},{y}")
        else:
            path_parts.append(f"L {x},{y}")
    path_parts.append("Z")
    
    return " ".join(path_parts)


def process_image_and_generate_svg(
    input_path: str,
    output_path: str,
    white_threshold: int = 240,
    min_area: int = 100,
    stroke_width: int = 2
) -> bool:
    """
    处理图片并生成SVG：
    1. 去掉图片白色背景
    2. 对图片中有色部分分别描边
    3. 对于每个部分，根据其颜色进行染色，染成单色
    4. 根据以上结果生成SVG图片
    
    Args:
        input_path: 输入图片路径
        output_path: 输出SVG文件路径
        white_threshold: 白色阈值 (0-255)，超过此值被认为是白色
        min_area: 最小区域面积，小于此值的区域将被忽略
        stroke_width: 描边宽度（像素）
        
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
        
        img_array = np.array(img)
        h, w = img_array.shape[:2]
        
        # 2. 去除白色背景
        img_rgba = _remove_white_background(img_array, white_threshold)
        
        # 3. 识别颜色区域
        regions = _find_color_regions(img_rgba, min_area)
        
        if len(regions) == 0:
            print("Warning: No color regions found in the image")
            return False
        
        # 4. 生成SVG内容
        # 按轮廓面积排序，先绘制大的（外部）轮廓，再绘制小的（内部）轮廓
        # 这样可以确保内部区域显示在外部区域之上
        regions_sorted = sorted(regions, key=lambda r: cv2.contourArea(r['contour']), reverse=True)
        
        svg_paths = []
        for region in regions_sorted:
            contour = region['contour']
            color = region['color']
            color_hex = _rgb_to_hex(color)
            
            # 将轮廓转换为SVG路径
            path_data = _contour_to_svg_path(contour)
            if path_data:
                svg_paths.append({
                    'path': path_data,
                    'fill': color_hex,
                    'stroke': color_hex,
                    'stroke_width': stroke_width
                })
        
        # 5. 构建完整的SVG文档
        svg_content = f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}">\n'
        
        for svg_path_info in svg_paths:
            svg_content += f'  <path d="{svg_path_info["path"]}" '
            svg_content += f'fill="{svg_path_info["fill"]}" '
            svg_content += f'stroke="{svg_path_info["stroke"]}" '
            svg_content += f'stroke-width="{svg_path_info["stroke_width"]}" '
            svg_content += f'stroke-linejoin="round" stroke-linecap="round"/>\n'
        
        svg_content += '</svg>'
        
        # 6. 保存SVG文件
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)
        
        print(f"Successfully processed image and generated SVG: {input_path} -> {output_path}")
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
    stroke_width: int = 2
) -> bool:
    """
    处理图片字节数据并生成SVG（功能同process_image_and_generate_svg）
    
    Args:
        image_bytes: 图片字节数据
        output_path: 输出SVG文件路径
        white_threshold: 白色阈值 (0-255)
        min_area: 最小区域面积
        stroke_width: 描边宽度（像素）
        
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
        
        img_array = np.array(img)
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
        
        svg_paths = []
        for region in regions_sorted:
            contour = region['contour']
            color = region['color']
            color_hex = _rgb_to_hex(color)
            
            path_data = _contour_to_svg_path(contour)
            if path_data:
                svg_paths.append({
                    'path': path_data,
                    'fill': color_hex,
                    'stroke': color_hex,
                    'stroke_width': stroke_width
                })
        
        # 构建SVG文档
        svg_content = f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}">\n'
        
        for svg_path_info in svg_paths:
            svg_content += f'  <path d="{svg_path_info["path"]}" '
            svg_content += f'fill="{svg_path_info["fill"]}" '
            svg_content += f'stroke="{svg_path_info["stroke"]}" '
            svg_content += f'stroke-width="{svg_path_info["stroke_width"]}" '
            svg_content += f'stroke-linejoin="round" stroke-linecap="round"/>\n'
        
        svg_content += '</svg>'
        
        # 保存SVG文件
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)
        
        print(f"Successfully processed image bytes and generated SVG: {output_path}")
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
    window_title: str = "Processed Image"
) -> bool:
    """
    显示处理后的图片（用于调试和预览）
    显示所有处理步骤的结果：
    1. 原始图片
    2. 去除白色背景后的图片
    3. 轮廓检测结果（显示所有轮廓）
    4. 最终处理结果（每个区域用单色填充）
    
    Args:
        input_path: 输入图片路径
        white_threshold: 白色阈值 (0-255)
        min_area: 最小区域面积
        window_title: 窗口标题
        
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
        
        img_array = np.array(img)
        h, w = img_array.shape[:2]
        
        # 步骤2: 去除白色背景
        img_rgba = _remove_white_background(img_array, white_threshold)
        img_no_white = img_rgba[:, :, :3].copy()
        # 将透明区域显示为黑色背景
        alpha_channel = img_rgba[:, :, 3]
        img_no_white[alpha_channel == 0] = [0, 0, 0]
        
        # 步骤3: 识别颜色区域
        regions = _find_color_regions(img_rgba, min_area)
        
        # 创建轮廓检测结果图像（显示所有轮廓）
        contour_img = img_array.copy()
        for region in regions:
            contour = region['contour']
            color = region['color']
            # 绘制轮廓
            cv2.drawContours(contour_img, [contour], -1, tuple(map(int, color)), 2)
        
        # 步骤4: 创建最终结果图像（每个区域用单色填充）
        result_img = np.zeros_like(img_array)
        for region in regions:
            mask = region['mask']
            color = region['color']
            result_img[mask > 0] = color
        
        # 创建2x2的子图显示所有步骤
        fig, axes = plt.subplots(2, 2, figsize=(16, 16))
        fig.suptitle(window_title, fontsize=16, fontweight='bold')
        
        # 步骤1: 原始图片
        axes[0, 0].imshow(img)
        axes[0, 0].set_title('步骤1: 原始图片', fontsize=14, fontweight='bold')
        axes[0, 0].axis('off')
        
        # 步骤2: 去除白色背景后的图片
        axes[0, 1].imshow(img_no_white)
        axes[0, 1].set_title(f'步骤2: 去除白色背景 (阈值={white_threshold})', fontsize=14, fontweight='bold')
        axes[0, 1].axis('off')
        
        # 步骤3: 轮廓检测结果
        axes[1, 0].imshow(contour_img)
        axes[1, 0].set_title(f'步骤3: 轮廓检测结果 (检测到 {len(regions)} 个区域)', fontsize=14, fontweight='bold')
        axes[1, 0].axis('off')
        
        # 步骤4: 最终处理结果（单色填充）
        axes[1, 1].imshow(result_img)
        axes[1, 1].set_title(f'步骤4: 最终结果 (每个区域单色填充)', fontsize=14, fontweight='bold')
        axes[1, 1].axis('off')
        
        plt.tight_layout()
        plt.show()
        
        # 打印详细信息
        print(f"\n处理完成: {input_path}")
        print(f"  原始图片尺寸: {w}x{h}")
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
    window_title: str = "Processed Image"
) -> bool:
    """
    从字节数据显示处理后的图片（用于调试和预览）
    显示所有处理步骤的结果：
    1. 原始图片
    2. 去除白色背景后的图片
    3. 轮廓检测结果（显示所有轮廓）
    4. 最终处理结果（每个区域用单色填充）
    
    Args:
        image_bytes: 图片字节数据
        white_threshold: 白色阈值 (0-255)
        min_area: 最小区域面积
        window_title: 窗口标题
        
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
        
        img_array = np.array(img)
        h, w = img_array.shape[:2]
        
        # 步骤2: 去除白色背景
        img_rgba = _remove_white_background(img_array, white_threshold)
        img_no_white = img_rgba[:, :, :3].copy()
        # 将透明区域显示为黑色背景
        alpha_channel = img_rgba[:, :, 3]
        img_no_white[alpha_channel == 0] = [0, 0, 0]
        
        # 步骤3: 识别颜色区域
        regions = _find_color_regions(img_rgba, min_area)
        
        # 创建轮廓检测结果图像（显示所有轮廓）
        contour_img = img_array.copy()
        for region in regions:
            contour = region['contour']
            color = region['color']
            # 绘制轮廓
            cv2.drawContours(contour_img, [contour], -1, tuple(map(int, color)), 2)
        
        # 步骤4: 创建最终结果图像（每个区域用单色填充）
        result_img = np.zeros_like(img_array)
        for region in regions:
            mask = region['mask']
            color = region['color']
            result_img[mask > 0] = color
        
        # 创建2x2的子图显示所有步骤
        fig, axes = plt.subplots(2, 2, figsize=(16, 16))
        fig.suptitle(window_title, fontsize=16, fontweight='bold')
        
        # 步骤1: 原始图片
        axes[0, 0].imshow(img)
        axes[0, 0].set_title('步骤1: 原始图片', fontsize=14, fontweight='bold')
        axes[0, 0].axis('off')
        
        # 步骤2: 去除白色背景后的图片
        axes[0, 1].imshow(img_no_white)
        axes[0, 1].set_title(f'步骤2: 去除白色背景 (阈值={white_threshold})', fontsize=14, fontweight='bold')
        axes[0, 1].axis('off')
        
        # 步骤3: 轮廓检测结果
        axes[1, 0].imshow(contour_img)
        axes[1, 0].set_title(f'步骤3: 轮廓检测结果 (检测到 {len(regions)} 个区域)', fontsize=14, fontweight='bold')
        axes[1, 0].axis('off')
        
        # 步骤4: 最终处理结果（单色填充）
        axes[1, 1].imshow(result_img)
        axes[1, 1].set_title(f'步骤4: 最终结果 (每个区域单色填充)', fontsize=14, fontweight='bold')
        axes[1, 1].axis('off')
        
        plt.tight_layout()
        plt.show()
        
        # 打印详细信息
        print(f"\n处理完成: (从字节数据)")
        print(f"  原始图片尺寸: {w}x{h}")
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

