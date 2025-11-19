from PIL import Image, ImageFilter, ImageEnhance
from pathlib import Path
import numpy as np

try:
    import cv2
    CV2_AVAILABLE = True
except ImportError:
    CV2_AVAILABLE = False
    print("Warning: OpenCV (cv2) is not installed. Install it for better contour detection:")
    print("  pip install opencv-python")

try:
    import matplotlib.pyplot as plt
    MATPLOTLIB_AVAILABLE = True
except ImportError:
    MATPLOTLIB_AVAILABLE = False
    print("Warning: matplotlib is not installed. Install it to use image display functions:")
    print("  pip install matplotlib")

try:
    from potrace import Bitmap as PotraceBitmap
    POTRACE_BITMAP_AVAILABLE = True
except ImportError:
    POTRACE_BITMAP_AVAILABLE = False
    print("Warning: potrace library is not installed. Install it to use Bitmap conversion:")
    print("  pip install pypotrace")

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

def _binary_image_to_svg_paths(binary_array: np.ndarray, threshold: int = 127) -> list:
    """
    Convert binary image array to SVG paths using contour detection.
    
    Args:
        binary_array: Binary image as numpy array (0-255 grayscale)
        threshold: Threshold value for binarization (0-255)
        
    Returns:
        List of SVG path strings
    """
    if CV2_AVAILABLE:
        # Use OpenCV for better contour detection
        # Invert: white (255) becomes 0, black (0) becomes 255 for contour detection
        binary = (binary_array < threshold).astype(np.uint8) * 255
        
        # Apply Gaussian blur to reduce noise
        blurred = cv2.GaussianBlur(binary, (5, 5), 0)
        
        # Find contours
        contours, _ = cv2.findContours(blurred, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        svg_paths = []
        for contour in contours:
            if len(contour) < 3:  # Skip contours with too few points
                continue
            
            # Build SVG path from contour points
            path_data = "M "
            for i, point in enumerate(contour):
                x, y = point[0]
                if i == 0:
                    path_data += f"{x},{y} "
                else:
                    path_data += f"L {x},{y} "
            path_data += "Z"
            svg_paths.append(path_data)
        
        return svg_paths
    else:
        # Fallback: Simple pixel-based approach without OpenCV
        # This is less accurate but doesn't require OpenCV
        svg_paths = []
        height, width = binary_array.shape
        
        # Simple approach: convert black regions to rectangles
        # This is a basic implementation - for better results, use OpenCV
        visited = np.zeros_like(binary_array, dtype=bool)
        
        for y in range(height):
            for x in range(width):
                if binary_array[y, x] < threshold and not visited[y, x]:
                    # Find connected black region
                    region_points = []
                    stack = [(x, y)]
                    
                    while stack:
                        cx, cy = stack.pop()
                        if (cx < 0 or cx >= width or cy < 0 or cy >= height or 
                            visited[cy, cx] or binary_array[cy, cx] >= threshold):
                            continue
                        
                        visited[cy, cx] = True
                        region_points.append((cx, cy))
                        
                        # Check neighbors
                        stack.extend([(cx+1, cy), (cx-1, cy), (cx, cy+1), (cx, cy-1)])
                    
                    if len(region_points) > 2:
                        # Create path from region points
                        path_data = "M "
                        for px, py in region_points:
                            path_data += f"{px},{py} "
                        path_data += "Z"
                        svg_paths.append(path_data)
        
        return svg_paths


def load_edsr_model() -> bool:
    """
    Load EDSR (Enhanced Deep Super-Resolution) model for image upscaling.
    
    Uses the global variable _EDSR_MODEL_PATH for the model file path.
    
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
        print("Error: EDSR model path is not set. Please set _EDSR_MODEL_PATH global variable.")
        return False
    
    try:
        # Check if model file exists
        model_file = Path(_EDSR_MODEL_PATH)
        if not model_file.exists():
            print(f"Error: EDSR model file not found: {_EDSR_MODEL_PATH}")
            print("Please ensure the EDSR_x4.pb file exists in the specified path.")
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
        print(f"Error loading EDSR model: {e}")
        import traceback
        traceback.print_exc()
        return False


def upscale_image_with_edsr(image: Image.Image) -> Image.Image:
    """
    Upscale image 4x using EDSR (Enhanced Deep Super-Resolution) model.
    
    Uses the global variable _EDSR_MODEL_PATH for the model file path.
    
    Args:
        image: PIL Image object to upscale
        
    Returns:
        Upscaled PIL Image (4x larger), or original image if upscaling fails
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
        
        # Use dnn_superres upsample method (simpler and more reliable)
        upscaled_bgr = _EDSR_MODEL.upsample(img_bgr)
        
        # Convert BGR back to RGB
        upscaled_rgb = cv2.cvtColor(upscaled_bgr, cv2.COLOR_BGR2RGB)
        
        # Convert back to PIL Image
        upscaled_image = Image.fromarray(upscaled_rgb)
        
        print(f"Successfully upscaled image using EDSR: {width}x{height} -> {upscaled_image.width}x{upscaled_image.height}")
        return upscaled_image
        
    except Exception as e:
        print(f"Error during EDSR upscaling: {e}")
        print("Falling back to LANCZOS resampling.")
        import traceback
        traceback.print_exc()
        width, height = image.size
        return image.resize((width * 4, height * 4), Image.Resampling.LANCZOS)


def upscale_image_from_path(input_path: str, output_path: str = None) -> Image.Image:
    """
    Upscale image from file path using EDSR model.
    
    Uses the global variable _EDSR_MODEL_PATH for the model file path.
    
    Args:
        input_path: Path to input image file
        output_path: Optional path to save upscaled image. If None, image is not saved.
        
    Returns:
        Upscaled PIL Image, or None if loading fails
    """
    try:
        # Load image
        img = Image.open(input_path)
        
        # Upscale using EDSR
        upscaled = upscale_image_with_edsr(img)
        
        # Save if output path is provided
        if output_path is not None:
            output_file = Path(output_path)
            output_file.parent.mkdir(parents=True, exist_ok=True)
            upscaled.save(output_path)
            print(f"Saved upscaled image to: {output_path}")
        
        return upscaled
        
    except FileNotFoundError:
        print(f"Error: File not found: {input_path}")
        return None
    except Exception as e:
        print(f"Error upscaling image: {e}")
        import traceback
        traceback.print_exc()
        return None


def convert_to_svg_with_bitmap(input_path: str, output_path: str, blacklevel: float = 0.5, scale_down: bool = True, use_edsr: bool = False) -> bool:
    """
    Convert bitmap image to SVG using potrace Bitmap library.
    
    This method first enlarges the image 4x using high-quality LANCZOS resampling or EDSR model,
    enhances sharpness, then optionally scales back down to original size for better quality,
    and finally uses potrace Bitmap for high-quality vectorization with curve smoothing.
    
    Uses the global variable _EDSR_MODEL_PATH for the EDSR model file path when use_edsr=True.
    
    Args:
        input_path: Path to input image file
        output_path: Path to output SVG file
        blacklevel: Threshold for binarization (0.0 to 1.0, default: 0.5)
                    Lower values = more black pixels, Higher values = more white pixels
        scale_down: If True, scale back down to original size after enhancement (default: True)
                    This improves quality by processing at higher resolution then scaling down
        use_edsr: If True, use EDSR model for upscaling instead of LANCZOS (default: False)
        
    Returns:
        True if conversion successful, False otherwise
    """
    if not POTRACE_BITMAP_AVAILABLE:
        print("Error: potrace Bitmap library is not available.")
        print("Please install it: pip install pypotrace")
        return False
    
    try:
        # 1. Open image
        img = Image.open(input_path)
        width, height = img.size
        
        # 2. Enlarge image 4x using EDSR model or high-quality resampling
        if use_edsr:
            img_enlarged = upscale_image_with_edsr(img)
        else:
            img_enlarged = img.resize((width * 4, height * 4), Image.Resampling.LANCZOS)
        
        # 3. Enhance sharpness to improve image quality
        enhancer = ImageEnhance.Sharpness(img_enlarged)
        img_sharp = enhancer.enhance(2.0)  # Enhance sharpness by 2x
        
        # 4. Optionally apply unsharp mask filter for better quality
        img_enhanced = img_sharp.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))
        
        # 5. Scale back down to original size if requested (improves quality)
        if scale_down:
            img_final = img_enhanced.resize((width, height), Image.Resampling.LANCZOS)
        else:
            img_final = img_enhanced
        
        # 6. Convert to grayscale
        img_gray = img_final.convert('L')
        
        # 7. Create Bitmap object from PIL Image
        # potrace Bitmap constructor accepts PIL Image directly
        bitmap = PotraceBitmap(img_gray, blacklevel=blacklevel)
        
        # 8. Trace bitmap to get path list
        path_list = bitmap.trace()
        
        # 9. Build SVG content from paths
        svg_paths = []
        for path in path_list:
            start_point = path.start_point
            svg_path = f"M{start_point.x},{start_point.y} "
            
            for segment in path:
                if segment.is_corner:
                    # Corner segment: straight line
                    c = segment.c
                    end_point = segment.end_point
                    svg_path += f"L{c.x},{c.y} L{end_point.x},{end_point.y} "
                else:
                    # Curve segment: Bezier curve
                    c1 = segment.c1
                    c2 = segment.c2
                    end_point = segment.end_point
                    svg_path += f"C{c1.x},{c1.y} {c2.x},{c2.y} {end_point.x},{end_point.y} "
            
            svg_path += "z"  # Close path
            svg_paths.append(svg_path)
        
        # 10. Build complete SVG document
        # Use final image dimensions for SVG
        svg_content = f'<svg xmlns="http://www.w3.org/2000/svg" width="{img_final.width}" height="{img_final.height}">\n'
        for svg_path in svg_paths:
            svg_content += f'  <path d="{svg_path}" fill="black" stroke="none"/>\n'
        svg_content += '</svg>'
        
        # 11. Save as SVG file
        # Ensure output directory exists
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)
        
        scale_info = "scaled down" if scale_down else "kept enlarged"
        print(f"Successfully converted using Bitmap (4x enlarged, enhanced, {scale_info}): {input_path} -> {output_path}")
        print(f"Original size: {img.width}x{img.height}, Final size: {img_final.width}x{img_final.height}")
        print(f"Found {len(svg_paths)} paths")
        return True
        
    except FileNotFoundError:
        print(f"Error: File not found: {input_path}")
        return False
    except AttributeError as e:
        print(f"Error: Potrace Bitmap library API mismatch: {e}")
        print("Please check if pypotrace is correctly installed.")
        return False
    except Exception as e:
        print(f"Error occurred during conversion: {e}")
        import traceback
        traceback.print_exc()
        return False


def convert_image_bytes_to_svg_with_bitmap(image_bytes: bytes, output_path: str, blacklevel: float = 0.5, scale_down: bool = True, use_edsr: bool = False) -> bool:
    """
    Convert image bytes to SVG using potrace Bitmap library.
    
    This method first enlarges the image 4x using high-quality LANCZOS resampling or EDSR model,
    enhances sharpness, then optionally scales back down to original size for better quality,
    and finally uses potrace Bitmap for vectorization.
    
    Uses the global variable _EDSR_MODEL_PATH for the EDSR model file path when use_edsr=True.
    
    Args:
        image_bytes: Image data as bytes
        output_path: Path to output SVG file
        blacklevel: Threshold for binarization (0.0 to 1.0, default: 0.5)
        scale_down: If True, scale back down to original size after enhancement (default: True)
        use_edsr: If True, use EDSR model for upscaling instead of LANCZOS (default: False)
        
    Returns:
        True if conversion successful, False otherwise
    """
    if not POTRACE_BITMAP_AVAILABLE:
        print("Error: potrace Bitmap library is not available.")
        print("Please install it: pip install pypotrace")
        return False
    
    try:
        from io import BytesIO
        
        # 1. Open image from bytes
        img = Image.open(BytesIO(image_bytes))
        width, height = img.size
        
        # 2. Enlarge image 4x using EDSR model or high-quality resampling
        if use_edsr:
            img_enlarged = upscale_image_with_edsr(img)
        else:
            img_enlarged = img.resize((width * 4, height * 4), Image.Resampling.LANCZOS)
        
        # 3. Enhance sharpness to improve image quality
        enhancer = ImageEnhance.Sharpness(img_enlarged)
        img_sharp = enhancer.enhance(2.0)  # Enhance sharpness by 2x
        
        # 4. Optionally apply unsharp mask filter for better quality
        img_enhanced = img_sharp.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))
        
        # 5. Scale back down to original size if requested (improves quality)
        if scale_down:
            img_final = img_enhanced.resize((width, height), Image.Resampling.LANCZOS)
        else:
            img_final = img_enhanced
        
        # 6. Convert to grayscale
        img_gray = img_final.convert('L')
        
        # 7. Create Bitmap from PIL Image
        bitmap = PotraceBitmap(img_gray, blacklevel=blacklevel)
        
        # 8. Trace bitmap to get path list
        path_list = bitmap.trace()
        
        # 9. Build SVG content from paths
        svg_paths = []
        for path in path_list:
            start_point = path.start_point
            svg_path = f"M{start_point.x},{start_point.y} "
            
            for segment in path:
                if segment.is_corner:
                    c = segment.c
                    end_point = segment.end_point
                    svg_path += f"L{c.x},{c.y} L{end_point.x},{end_point.y} "
                else:
                    c1 = segment.c1
                    c2 = segment.c2
                    end_point = segment.end_point
                    svg_path += f"C{c1.x},{c1.y} {c2.x},{c2.y} {end_point.x},{end_point.y} "
            
            svg_path += "z"
            svg_paths.append(svg_path)
        
        # 10. Build complete SVG document
        # Use final image dimensions for SVG
        svg_content = f'<svg xmlns="http://www.w3.org/2000/svg" width="{img_final.width}" height="{img_final.height}">\n'
        for svg_path in svg_paths:
            svg_content += f'  <path d="{svg_path}" fill="black" stroke="none"/>\n'
        svg_content += '</svg>'
        
        # 11. Save SVG
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)
        
        scale_info = "scaled down" if scale_down else "kept enlarged"
        print(f"Successfully converted image bytes to SVG using Bitmap (4x enlarged, enhanced, {scale_info}): {output_path}")
        print(f"Original size: {img.width}x{img.height}, Final size: {img_final.width}x{img_final.height}")
        print(f"Found {len(svg_paths)} paths")
        return True
        
    except Exception as e:
        print(f"Error occurred during conversion: {e}")
        import traceback
        traceback.print_exc()
        return False


def convert_to_svg_potrace(input_path: str, output_path: str, threshold: int = 127) -> bool:
    """
    Convert bitmap image to SVG by binarizing and detecting contours.
    
    Note: Works best with black and white images. 
    Color images will be automatically converted to grayscale and binarized.
    
    Args:
        input_path: Path to input image file
        output_path: Path to output SVG file
        threshold: Threshold value for binarization (0-255, default: 127)
        
    Returns:
        True if conversion successful, False otherwise
    """
    try:
        # 1. Open image
        img = Image.open(input_path)

        # 2. Convert to grayscale
        img_gray = img.convert('L')
        
        # 3. Convert to numpy array
        img_array = np.array(img_gray)
        
        # 4. Convert binary image to SVG paths
        svg_paths = _binary_image_to_svg_paths(img_array, threshold)
        
        # 5. Build complete SVG document
        svg_content = f'<svg xmlns="http://www.w3.org/2000/svg" width="{img.width}" height="{img.height}">\n'
        for svg_path in svg_paths:
            svg_content += f'  <path d="{svg_path}" fill="black" stroke="none"/>\n'
        svg_content += '</svg>'

        # 6. Save as SVG file
        # Ensure output directory exists
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)

        print(f"Successfully converted: {input_path} -> {output_path}")
        print(f"Found {len(svg_paths)} contours")
        return True

    except FileNotFoundError:
        print(f"Error: File not found: {input_path}")
        return False
    except Exception as e:
        print(f"Error occurred during conversion: {e}")
        import traceback
        traceback.print_exc()
        return False


def convert_image_bytes_to_svg(image_bytes: bytes, output_path: str, threshold: int = 127) -> bool:
    """
    Convert image bytes to SVG by binarizing and detecting contours.
    
    Args:
        image_bytes: Image data as bytes
        output_path: Path to output SVG file
        threshold: Threshold value for binarization (0-255, default: 127)
        
    Returns:
        True if conversion successful, False otherwise
    """
    try:
        from io import BytesIO
        
        # Open image from bytes
        img = Image.open(BytesIO(image_bytes))
        
        # Convert to grayscale
        img_gray = img.convert('L')
        
        # Convert to numpy array
        img_array = np.array(img_gray)
        
        # Convert binary image to SVG paths
        svg_paths = _binary_image_to_svg_paths(img_array, threshold)
        
        # Build complete SVG document
        svg_content = f'<svg xmlns="http://www.w3.org/2000/svg" width="{img.width}" height="{img.height}">\n'
        for svg_path in svg_paths:
            svg_content += f'  <path d="{svg_path}" fill="black" stroke="none"/>\n'
        svg_content += '</svg>'
        
        # Save SVG
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)
        
        print(f"Successfully converted image bytes to: {output_path}")
        print(f"Found {len(svg_paths)} contours")
        return True
        
    except Exception as e:
        print(f"Error occurred during conversion: {e}")
        import traceback
        traceback.print_exc()
        return False


def show_binary_comparison(input_path: str, threshold: int = 127, window_title: str = "Image Comparison"):
    """
    Display original image and binary image side by side in a popup window.
    
    Args:
        input_path: Path to input image file
        threshold: Threshold value for binarization (0-255, default: 127)
        window_title: Title of the display window
        
    Returns:
        True if display successful, False otherwise
    """
    if not MATPLOTLIB_AVAILABLE:
        print("Error: matplotlib is not available. Please install it:")
        print("  pip install matplotlib")
        return False
    
    try:
        # 1. Open original image
        img_original = Image.open(input_path)
        
        # 2. Enlarge image 4x and enhance sharpness
        width, height = img_original.size
        img_enlarged = img_original.resize((width * 4, height * 4), Image.Resampling.LANCZOS)
        
        # 3. Enhance sharpness
        enhancer = ImageEnhance.Sharpness(img_enlarged)
        img_sharp = enhancer.enhance(2.0)  # Enhance sharpness by 2x
        
        # 4. Convert to grayscale
        img_gray = img_sharp.convert('L')
        
        # 5. Convert to numpy array and binarize
        img_array = np.array(img_gray)
        binary_array = (img_array < threshold).astype(np.uint8) * 255
        
        # 6. Convert binary array back to PIL Image for display
        img_binary = Image.fromarray(binary_array, mode='L')
        
        # 7. Create figure with two subplots side by side
        fig, axes = plt.subplots(1, 2, figsize=(16, 8))
        fig.suptitle(window_title, fontsize=14)
        
        # 8. Display original image on the left
        axes[0].imshow(img_sharp, cmap='gray' if img_sharp.mode == 'L' else None)
        axes[0].set_title('Original Image (4x enlarged & sharpened)', fontsize=12)
        axes[0].axis('off')
        
        # 9. Display binary image on the right
        axes[1].imshow(img_binary, cmap='gray')
        axes[1].set_title(f'Binary Image (threshold={threshold}, 4x enlarged)', fontsize=12)
        axes[1].axis('off')
        
        # 10. Adjust layout and show
        plt.tight_layout()
        plt.show()
        
        print(f"Displayed image comparison: {input_path}")
        return True
        
    except FileNotFoundError:
        print(f"Error: File not found: {input_path}")
        return False
    except Exception as e:
        print(f"Error occurred during display: {e}")
        import traceback
        traceback.print_exc()
        return False


def show_binary_comparison_from_bytes(image_bytes: bytes, threshold: int = 127, window_title: str = "Image Comparison"):
    """
    Display original image and binary image side by side from image bytes.
    
    Args:
        image_bytes: Image data as bytes
        threshold: Threshold value for binarization (0-255, default: 127)
        window_title: Title of the display window
        
    Returns:
        True if display successful, False otherwise
    """
    if not MATPLOTLIB_AVAILABLE:
        print("Error: matplotlib is not available. Please install it:")
        print("  pip install matplotlib")
        return False
    
    try:
        from io import BytesIO
        
        # 1. Open image from bytes
        img_original = Image.open(BytesIO(image_bytes))
        
        # 2. Enlarge image 4x and enhance sharpness
        width, height = img_original.size
        img_enlarged = img_original.resize((width * 4, height * 4), Image.Resampling.LANCZOS)
        
        # 3. Enhance sharpness
        enhancer = ImageEnhance.Sharpness(img_enlarged)
        img_sharp = enhancer.enhance(2.0)  # Enhance sharpness by 2x
        
        # 4. Convert to grayscale
        img_gray = img_sharp.convert('L')
        
        # 5. Convert to numpy array and binarize
        img_array = np.array(img_gray)
        binary_array = (img_array < threshold).astype(np.uint8) * 255
        
        # 6. Convert binary array back to PIL Image for display
        img_binary = Image.fromarray(binary_array, mode='L')
        
        # 7. Create figure with two subplots side by side
        fig, axes = plt.subplots(1, 2, figsize=(16, 8))
        fig.suptitle(window_title, fontsize=14)
        
        # 8. Display original image on the left
        axes[0].imshow(img_sharp, cmap='gray' if img_sharp.mode == 'L' else None)
        axes[0].set_title('Original Image (4x enlarged & sharpened)', fontsize=12)
        axes[0].axis('off')
        
        # 9. Display binary image on the right
        axes[1].imshow(img_binary, cmap='gray')
        axes[1].set_title(f'Binary Image (threshold={threshold}, 4x enlarged)', fontsize=12)
        axes[1].axis('off')
        
        # 10. Adjust layout and show
        plt.tight_layout()
        plt.show()
        
        print("Displayed image comparison from bytes")
        return True
        
    except Exception as e:
        print(f"Error occurred during display: {e}")
        import traceback
        traceback.print_exc()
        return False

# Example usage:
if __name__ == "__main__":
    input_file = "../../samples/png/test.png"  # Replace with your file path
    output_file = "../../samples/svg/test.svg"
    
    # Convert to SVG
    # convert_to_svg_potrace(input_file, output_file)

    convert_to_svg_with_bitmap(input_file, output_file)
    
    # Display comparison (optional)
    show_binary_comparison(input_file, threshold=127)