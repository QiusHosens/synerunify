import os
import shutil
import numpy as np
import pandas as pd
from sklearn.model_selection import KFold
from sklearn.metrics import mean_squared_error
from scipy.stats import pearsonr, spearmanr
import torch
import torch.nn as nn
import torch.optim as optimizer
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
from PIL import Image

# 设备配置
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 数据集类
class SCUTFBP5500Dataset(Dataset):
    def __init__(self, image_dir, labels_file, image_list=None, transform=None):
        self.image_dir = image_dir
        self.transform = transform
        # 读取标签
        self.labels_df = pd.read_csv(labels_file, sep=' ', header=None, names=['image', 'score'])
        if image_list is not None:
            self.labels_df = self.labels_df[self.labels_df['image'].isin(image_list)]
        self.images = self.labels_df['image'].values
        self.scores = self.labels_df['score'].values.astype(np.float32)

    def __len__(self):
        return len(self.images)

    def __getitem__(self, idx):
        img_path = os.path.join(self.image_dir, self.images[idx])
        image = Image.open(img_path).convert('RGB')
        score = self.scores[idx]
        if self.transform:
            image = self.transform(image)
        return image, score

# 数据转换
data_transforms = {
    'train': transforms.Compose([
        transforms.RandomResizedCrop(224),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ]),
    'val': transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ]),
}

# 模型定义
def get_model():
    model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, 1)  # 回归输出
    return model.to(device)

# 训练函数
def train_model(model, train_loader, val_loader, epochs=20, lr=0.001, model_dir='models_pth'):
    criterion = nn.MSELoss()
    optim = optimizer.Adam(model.parameters(), lr=lr)
    best_plcc = 0.0
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device).unsqueeze(1)
            optim.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optim.step()
            running_loss += loss.item()
        print(f'Epoch {epoch+1}/{epochs}, Loss: {running_loss / len(train_loader):.4f}')

        # 验证
        model.eval()
        preds, trues = [], []
        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs = inputs.to(device)
                outputs = model(inputs)
                preds.extend(outputs.cpu().numpy().flatten())
                trues.extend(labels.numpy())
        rmse = np.sqrt(mean_squared_error(trues, preds))
        plcc, _ = pearsonr(trues, preds)
        srcc, _ = spearmanr(trues, preds)
        print(f'Val RMSE: {rmse:.4f}, PLCC: {plcc:.4f}, SRCC: {srcc:.4f}')

        if plcc > best_plcc:
            best_plcc = plcc
            torch.save(model.state_dict(), os.path.join(model_dir, 'best_model.pth'))
            # 同时保存完整模型以便预测时使用
            torch.save(model, os.path.join(model_dir, 'best_model_full.pth'))
    return model

# 主函数
def main():
    # image_dir = 'C:\\Users\\zy\\.cache\\kagglehub\\datasets\\pranavchandane\\scut-fbp5500-v2-facial-beauty-scores\\versions\\2\\Images\\Images'  # 调整为你的路径
    # labels_file = 'C:\\Users\\zy\\.cache\\kagglehub\\datasets\\pranavchandane\\scut-fbp5500-v2-facial-beauty-scores\\labels.txt'  # 调整为你的路径
    image_dir = 'datasets/SCUT-FBP5500_v2/Images/'  # 调整为你的路径
    labels_file = 'datasets/SCUT-FBP5500_v2/train_test_files/All_labels.txt'  # 调整为你的路径
    batch_size = 32
    epochs = 20

    # 创建模型保存目录
    model_dir = 'models_pth'
    os.makedirs(model_dir, exist_ok=True)

    # 获取所有图像列表
    all_images = [f for f in os.listdir(image_dir) if f.endswith('.jpg')]

    # 5-fold交叉验证
    kf = KFold(n_splits=5, shuffle=True, random_state=42)
    fold = 1
    plccs, srccs = [], []
    for train_idx, test_idx in kf.split(all_images):
        print(f'Fold {fold}')
        train_images = [all_images[i] for i in train_idx]
        test_images = [all_images[i] for i in test_idx]

        train_dataset = SCUTFBP5500Dataset(image_dir, labels_file, train_images, data_transforms['train'])
        val_dataset = SCUTFBP5500Dataset(image_dir, labels_file, test_images, data_transforms['val'])

        train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
        val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)

        model = get_model()
        model = train_model(model, train_loader, val_loader, epochs=epochs, model_dir=model_dir)

        # 保存每个fold的最佳模型
        fold_model_path = os.path.join(model_dir, f'best_model_fold_{fold}.pth')
        fold_model_full_path = os.path.join(model_dir, f'best_model_full_fold_{fold}.pth')
        best_model_path = os.path.join(model_dir, 'best_model.pth')
        best_model_full_path = os.path.join(model_dir, 'best_model_full.pth')
        if os.path.exists(best_model_path):
            shutil.copy(best_model_path, fold_model_path)
        if os.path.exists(best_model_full_path):
            shutil.copy(best_model_full_path, fold_model_full_path)

        # 测试最佳模型
        model.load_state_dict(torch.load(best_model_path))
        model.eval()
        preds, trues = [], []
        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs = inputs.to(device)
                outputs = model(inputs)
                preds.extend(outputs.cpu().numpy().flatten())
                trues.extend(labels.numpy())
        plcc, _ = pearsonr(trues, preds)
        srcc, _ = spearmanr(trues, preds)
        plccs.append(plcc)
        srccs.append(srcc)
        fold += 1

    print(f'Average PLCC: {np.mean(plccs):.4f}, Average SRCC: {np.mean(srccs):.4f}')

    # 保存最终的平均性能模型（使用最佳fold的模型）
    best_fold_idx = np.argmax(plccs)
    final_model_path = os.path.join(model_dir, 'final_best_model.pth')
    final_model_full_path = os.path.join(model_dir, 'final_best_model_full.pth')
    fold_model_path = os.path.join(model_dir, f'best_model_fold_{best_fold_idx+1}.pth')
    fold_model_full_path = os.path.join(model_dir, f'best_model_full_fold_{best_fold_idx+1}.pth')
    if os.path.exists(fold_model_path):
        shutil.copy(fold_model_path, final_model_path)
        print(f'已保存最佳模型（Fold {best_fold_idx+1}）到 {final_model_path}')
    if os.path.exists(fold_model_full_path):
        shutil.copy(fold_model_full_path, final_model_full_path)
        print(f'已保存完整最佳模型（Fold {best_fold_idx+1}）到 {final_model_full_path}')

if __name__ == '__main__':
    main()