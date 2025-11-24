from ultralytics import YOLO

def main():
    # 1. 加载模型
    # 'yolo11n.pt' 是 Nano 版本，速度最快但精度稍低。
    # 如果显存足够，可以换成 'yolo11s.pt' (Small), 'yolo11m.pt' (Medium) 等
    model = YOLO('yolo11n.pt')

    # 2. 开始训练
    # data: 指向刚才下载的数据集中的 data.yaml 文件路径
    # epochs: 训练轮数 (建议从 50 或 100 开始)
    # imgsz: 图片大小 (通常为 640)
    # device: 设置为 0 使用 GPU，或者是 'cpu'
    results = model.train(
        data='./fire-1/data.yaml',  # ⚠️ 记得修改这里的路径
        epochs=100,
        imgsz=640,
        batch=16,
        name='yolo11_custom_training' # 训练结果保存的文件夹名称
    )

    # 3. 训练完成后的验证 (在验证集上测试)
    metrics = model.val()
    print(f"mAP50: {metrics.box.map50}")

if __name__ == '__main__':
    main()