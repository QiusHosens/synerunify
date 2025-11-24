from ultralytics import YOLO

# 加载刚才训练好的最佳模型
model = YOLO('runs/detect/yolo11_custom_training/weights/best.pt')

# 对一张从未见过的图片进行预测
# save=True 会将结果图片保存在 runs/detect/predict 文件夹中
results = model.predict(source='path/to/test/image.jpg', save=True, conf=0.5)

# 如果你想直接处理结果
for result in results:
    boxes = result.boxes  # 获取边界框坐标
    print(f"检测到的目标数量: {len(boxes)}")