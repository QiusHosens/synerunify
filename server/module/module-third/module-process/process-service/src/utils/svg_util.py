from PIL import Image
from pathlib import Path
from potrace import Bitmap

def convert_to_svg_potrace(input_path: str, output_path: str) -> bool:
    """
    Convert bitmap image to SVG using potracer library.
    
    Note: potracer works best with black and white images. 
    Color images will be automatically converted to grayscale and binarized.
    
    Args:
        input_path: Path to input image file
        output_path: Path to output SVG file
        
    Returns:
        True if conversion successful, False otherwise
    """
    try:
        # 1. Open image
        img = Image.open(input_path)

        # 2. Convert to grayscale (Potrace works with grayscale images)
        img_gray = img.convert('L')

        # 3. Create Bitmap object from PIL Image
        # potracer's Bitmap constructor accepts PIL Image directly
        # blacklevel: threshold for binarization (0.0 to 1.0)
        bitmap = Bitmap(img_gray, blacklevel=0.5)
        
        # 4. Trace bitmap to get path list
        path_list = bitmap.trace()
        
        # 5. Build SVG content from paths
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
        
        # 6. Build complete SVG document
        svg_content = f'<svg xmlns="http://www.w3.org/2000/svg" width="{img.width}" height="{img.height}">\n'
        for svg_path in svg_paths:
            svg_content += f'  <path d="{svg_path}" fill="black" stroke="none"/>\n'
        svg_content += '</svg>'

        # 7. Save as SVG file
        # Ensure output directory exists
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)

        print(f"Successfully converted: {input_path} -> {output_path}")
        return True

    except FileNotFoundError:
        print(f"Error: File not found: {input_path}")
        return False
    except AttributeError as e:
        print(f"Error: Potracer library API mismatch: {e}")
        print("Please check if potracer is correctly installed.")
        return False
    except Exception as e:
        print(f"Error occurred during conversion: {e}")
        import traceback
        traceback.print_exc()
        return False


def convert_image_bytes_to_svg(image_bytes: bytes, output_path: str) -> bool:
    """
    Convert image bytes to SVG using potracer library.
    
    Args:
        image_bytes: Image data as bytes
        output_path: Path to output SVG file
        
    Returns:
        True if conversion successful, False otherwise
    """
    try:
        from io import BytesIO
        
        # Open image from bytes
        img = Image.open(BytesIO(image_bytes))
        
        # Convert to grayscale
        img_gray = img.convert('L')
        
        # Create Bitmap from PIL Image
        bitmap = Bitmap(img_gray, blacklevel=0.5)
        
        # Trace bitmap to get path list
        path_list = bitmap.trace()
        
        # Build SVG content from paths
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
        return True
        
    except Exception as e:
        print(f"Error occurred during conversion: {e}")
        import traceback
        traceback.print_exc()
        return False

# Example usage:
if __name__ == "__main__":
    input_file = "../../samples/png/test.png"  # Replace with your file path
    output_file = "../../samples/svg/test.svg"
    convert_to_svg_potrace(input_file, output_file)