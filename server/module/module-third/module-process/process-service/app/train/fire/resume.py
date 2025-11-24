from ultralytics import YOLO

# 1. 加载上次训练中断时保存的 last.pt 文件
# 确保路径正确指向你上次训练的文件夹
checkpoint_path = 'runs/detect/yolo11_custom_training/weights/last.pt'
model = YOLO(checkpoint_path)  # 加载模型和配置信息

# 2. 调用 .train() 方法，并设置 resume=True
# 训练将从上次停止的那个 epoch 自动继续！
results = model.train(
    data='./fire-1/data.yaml',  # 路径通常不变，但最好写上
    epochs=100,                              # 目标总 epoch 数量不变
    resume=True,                             # 关键参数！
)