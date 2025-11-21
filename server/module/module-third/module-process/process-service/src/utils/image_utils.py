from rembg import remove
from PIL import Image
import io

def remove_background_ai(input_path, output_path):
    print(f"正在处理: {input_path}，请稍候...")
    
    try:
        # 1. 打开图片
        with open(input_path, 'rb') as i:
            input_image = i.read()

        # 2. 使用 rembg 移除背景
        # remove 函数接收字节流并返回处理后的字节流
        output_image = remove(input_image)

        # 3. 将结果保存为 PNG (必须是 PNG 才能支持透明通道)
        with open(output_path, 'wb') as o:
            o.write(output_image)
            
        print(f"成功！结果已保存至: {output_path}")
        
    except Exception as e:
        print(f"发生错误: {e}")

# 使用示例
# 确保你有一张名为 input.jpg 的图片在同一目录下
remove_background_ai("../../samples/png/test.png", "../../samples/png/test_out.png")