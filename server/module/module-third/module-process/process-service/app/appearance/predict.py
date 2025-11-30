import os
import numpy as np
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import argparse
from pathlib import Path
from typing import Optional, Tuple
from ultralytics import YOLO

# 设备配置
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 模型定义（与train.py中保持一致）
def get_model():
    model = models.resnet18(weights=None)  # 预测时不需要预训练权重
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, 1)  # 回归输出
    return model.to(device)

# 数据预处理（与验证集保持一致）
data_transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

def load_model(model_path, use_full_model=None):
    """
    加载模型
    
    Args:
        model_path: 模型文件路径
        use_full_model: 是否使用完整模型（True/False/None）
                       None表示自动检测模型类型
    
    Returns:
        加载好的模型
    """
    # 自动检测模型类型：如果文件名包含"full"或"full_model"，则尝试加载完整模型
    if use_full_model is None:
        use_full_model = 'full' in model_path.lower()
    
    try:
        if use_full_model:
            # 加载完整模型（需要设置weights_only=False以支持PyTorch 2.6+）
            model = torch.load(model_path, map_location=device, weights_only=False)
            model.eval()
        else:
            # 加载state_dict
            model = get_model()
            state_dict = torch.load(model_path, map_location=device, weights_only=False)
            model.load_state_dict(state_dict)
            model.eval()
    except Exception as e:
        # 如果加载失败，尝试另一种方式
        if use_full_model:
            # 尝试作为state_dict加载
            print(f'尝试作为完整模型加载失败，改为state_dict方式加载...')
            model = get_model()
            state_dict = torch.load(model_path, map_location=device, weights_only=False)
            model.load_state_dict(state_dict)
            model.eval()
        else:
            # 尝试作为完整模型加载
            print(f'尝试作为state_dict加载失败，改为完整模型方式加载...')
            model = torch.load(model_path, map_location=device, weights_only=False)
            model.eval()
    
    return model

# 全局人脸检测模型缓存
_face_detector: Optional[YOLO] = None
_face_detector_path: Optional[str] = None

def get_face_detector(face_model_path: Optional[str] = None) -> YOLO:
    """
    获取人脸检测模型（单例模式）
    
    Args:
        face_model_path: 人脸检测模型路径，如果为None则使用默认路径
    
    Returns:
        YOLO人脸检测模型
    """
    global _face_detector, _face_detector_path
    
    # 默认人脸检测模型路径
    if face_model_path is None:
        # 从appearance目录查找模型文件
        appearance_dir = Path(__file__).parent
        default_face_model = appearance_dir / "models" / "yolov11l-face.pt"
        face_model_path = str(default_face_model)
    
    # 如果模型已加载且路径相同，直接返回
    if _face_detector is not None and _face_detector_path == face_model_path:
        return _face_detector
    
    # 检查模型文件是否存在
    if not os.path.exists(face_model_path):
        raise FileNotFoundError(f"人脸检测模型文件不存在: {face_model_path}")
    
    try:
        # 加载YOLO人脸检测模型
        _face_detector = YOLO(face_model_path)
        _face_detector_path = face_model_path
        return _face_detector
    except Exception as e:
        raise RuntimeError(f"加载人脸检测模型失败: {str(e)}")

def detect_face(image: Image.Image, face_model_path: Optional[str] = None, conf_threshold: float = 0.5) -> Optional[Tuple[int, int, int, int]]:
    """
    检测图片中的人脸
    
    Args:
        image: PIL Image对象
        face_model_path: 人脸检测模型路径（可选）
        conf_threshold: 置信度阈值
    
    Returns:
        如果检测到人脸，返回 (x1, y1, x2, y2) 边界框坐标；否则返回None
        如果检测到多个人脸，返回最大的人脸区域
    """
    try:
        # 获取人脸检测模型
        face_detector = get_face_detector(face_model_path)
        
        # 将PIL Image转换为numpy数组
        img_array = np.array(image)
        
        # 执行人脸检测
        results = face_detector.predict(img_array, conf=conf_threshold, verbose=False)
        
        # 处理检测结果
        if len(results) > 0 and len(results[0].boxes) > 0:
            boxes = results[0].boxes
            
            # 如果检测到多个人脸，选择面积最大的
            max_area = 0
            best_box = None
            
            for box in boxes:
                # 获取边界框坐标
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                area = (x2 - x1) * (y2 - y1)
                
                if area > max_area:
                    max_area = area
                    best_box = (int(x1), int(y1), int(x2), int(y2))
            
            if best_box:
                return best_box
        
        return None
    except Exception as e:
        print(f"人脸检测失败: {e}")
        return None

def crop_face_region(image: Image.Image, bbox: Tuple[int, int, int, int], padding: float = 0.1) -> Image.Image:
    """
    根据边界框裁剪人脸区域
    
    Args:
        image: 原始图片
        bbox: 边界框坐标 (x1, y1, x2, y2)
        padding: 边界扩展比例（默认10%）
    
    Returns:
        裁剪后的人脸图片
    """
    x1, y1, x2, y2 = bbox
    width, height = image.size
    
    # 计算边界框的宽度和高度
    bbox_width = x2 - x1
    bbox_height = y2 - y1
    
    # 添加padding
    padding_x = int(bbox_width * padding)
    padding_y = int(bbox_height * padding)
    
    # 计算裁剪区域，确保不超出图片边界
    crop_x1 = max(0, x1 - padding_x)
    crop_y1 = max(0, y1 - padding_y)
    crop_x2 = min(width, x2 + padding_x)
    crop_y2 = min(height, y2 + padding_y)
    
    # 裁剪图片
    face_image = image.crop((crop_x1, crop_y1, crop_x2, crop_y2))
    
    return face_image

def predict_single_image(model, image_path, use_face_detection: bool = True, face_model_path: Optional[str] = None):
    """
    对单张图片进行预测
    
    Args:
        model: 加载好的模型
        image_path: 图片路径
        use_face_detection: 是否使用人脸检测（默认True）
        face_model_path: 人脸检测模型路径（可选）
    
    Returns:
        预测的分数
    """
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"图片文件不存在: {image_path}")
    
    # 加载图片
    image = Image.open(image_path).convert('RGB')
    
    # 如果启用人脸检测，先检测人脸并裁剪
    if use_face_detection:
        bbox = detect_face(image, face_model_path=face_model_path)
        if bbox:
            # 裁剪人脸区域
            image = crop_face_region(image, bbox)
        else:
            print("警告: 未检测到人脸，使用整张图片进行预测")
    
    # 预处理图片
    image_tensor = data_transform(image).unsqueeze(0).to(device)
    
    # 预测
    model.eval()
    with torch.no_grad():
        output = model(image_tensor)
        score = output.cpu().item()
    
    return score

def predict_batch(model, image_dir, image_list=None, use_face_detection: bool = True, face_model_path: Optional[str] = None):
    """
    批量预测图片
    
    Args:
        model: 加载好的模型
        image_dir: 图片目录
        image_list: 图片列表（如果为None，则预测目录下所有jpg图片）
        use_face_detection: 是否使用人脸检测（默认True）
        face_model_path: 人脸检测模型路径（可选）
    
    Returns:
        预测结果字典 {图片名: 分数}
    """
    if image_list is None:
        image_list = [f for f in os.listdir(image_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
    
    results = {}
    model.eval()
    
    for img_name in image_list:
        img_path = os.path.join(image_dir, img_name)
        if os.path.exists(img_path):
            try:
                score = predict_single_image(model, img_path, use_face_detection=use_face_detection, face_model_path=face_model_path)
                results[img_name] = score
                print(f'{img_name}: {score:.4f}')
            except Exception as e:
                print(f'预测 {img_name} 时出错: {e}')
        else:
            print(f'图片不存在: {img_path}')
    
    return results

def main():
    # parser = argparse.ArgumentParser(description='使用训练好的模型进行预测')
    # parser.add_argument('--model', type=str, default='final_best_model_full.pth',
    #                     help='模型文件路径（默认: final_best_model_full.pth）')
    # parser.add_argument('--image', type=str, default=None,
    #                     help='单张图片路径')
    # parser.add_argument('--image_dir', type=str, default=None,
    #                     help='图片目录路径（批量预测）')
    # parser.add_argument('--use_full_model', action='store_true',
    #                     help='强制使用完整模型文件（默认自动检测）')
    # parser.add_argument('--use_state_dict', action='store_true',
    #                     help='强制使用state_dict方式加载（默认自动检测）')
    #
    # args = parser.parse_args()
    args = {
        'model': 'models_pth/final_best_model_full.pth',
        'image': None,  # 'SCUT-FBP/SCUT-FBP-1.jpg'
        'image_dir': 'datasets/SCUT-FBP',
        'use_full_model': None,
        'use_state_dict': None
    }
    
    # 检查模型文件是否存在
    if not os.path.exists(args['model']):
        print(f'错误: 模型文件不存在: {args["model"]}')
        print('请先运行train.py训练模型，或指定正确的模型路径')
        return
    
    # 加载模型
    print(f'正在加载模型: {args["model"]}')
    try:
        # 如果用户明确指定了加载方式，使用指定方式；否则自动检测
        if args.get('use_state_dict'):
            use_full_model = False
        elif args.get('use_full_model'):
            use_full_model = True
        else:
            use_full_model = None  # 自动检测
        
        model = load_model(args['model'], use_full_model=use_full_model)
        print('模型加载成功！')
    except Exception as e:
        print(f'模型加载失败: {e}')
        import traceback
        traceback.print_exc()
        return
    
    # 进行预测
    if args.get('image'):
        # 单张图片预测
        print(f'\n正在预测图片: {args["image"]}')
        score = predict_single_image(model, args['image'])
        print(f'预测分数: {score:.4f}')
    elif args.get('image_dir'):
        # 批量预测
        print(f'\n正在批量预测目录: {args["image_dir"]}')
        results = predict_batch(model, args['image_dir'])
        print(f'\n共预测 {len(results)} 张图片')
        if results:
            scores = list(results.values())
            print(f'平均分数: {np.mean(scores):.4f}')
            print(f'最高分数: {np.max(scores):.4f}')
            print(f'最低分数: {np.min(scores):.4f}')
    else:
        print('请指定 image 或 image_dir 参数')

if __name__ == '__main__':
    main()

