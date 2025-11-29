import os
import numpy as np
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import argparse

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

def predict_single_image(model, image_path):
    """
    对单张图片进行预测
    
    Args:
        model: 加载好的模型
        image_path: 图片路径
    
    Returns:
        预测的分数
    """
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"图片文件不存在: {image_path}")
    
    # 加载和预处理图片
    image = Image.open(image_path).convert('RGB')
    image_tensor = data_transform(image).unsqueeze(0).to(device)
    
    # 预测
    model.eval()
    with torch.no_grad():
        output = model(image_tensor)
        score = output.cpu().item()
    
    return score

def predict_batch(model, image_dir, image_list=None):
    """
    批量预测图片
    
    Args:
        model: 加载好的模型
        image_dir: 图片目录
        image_list: 图片列表（如果为None，则预测目录下所有jpg图片）
    
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
                score = predict_single_image(model, img_path)
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

