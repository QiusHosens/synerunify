import grpc
import image_service_pb2
import image_service_pb2_grpc
import os

def read_image_chunks(image_path, chunk_size=1024*1024):  # 每块 1MB
    filename = os.path.basename(image_path)
    image_type = os.path.splitext(filename)[1][1:]  # 提取扩展名，如 "png"

    yield image_service_pb2.ImageChunk(
        info=image_service_pb2.ImageInfo(filename=filename, image_type=image_type)
    )

    with open(image_path, 'rb') as f:
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break
            yield image_service_pb2.ImageChunk(chunk=chunk)

def upload_image(stub, image_path):
    response = stub.UploadImage(read_image_chunks(image_path))
    if response.error:
        print("错误:", response.error)
    else:
        print("识别结果:", response.text)

def main():
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = image_service_pb2_grpc.ImageServiceStub(channel)
        upload_image(stub, 'sample_image.png')

if __name__ == '__main__':
    main()