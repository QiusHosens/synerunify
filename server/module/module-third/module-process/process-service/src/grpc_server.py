import grpc
from concurrent import futures
import image_service_pb2
import image_service_pb2_grpc
from PIL import Image
import pytesseract
import io

class ImageService(image_service_pb2_grpc.ImageServiceServicer):
    def UploadImage(self, request_iterator, context):
        image_data = b""
        filename = ""
        image_type = ""

        for request in request_iterator:
            if request.HasField('info'):
                filename = request.info.filename
                image_type = request.info.image_type
            elif request.HasField('chunk'):
                image_data += request.chunk

        try:
            img = Image.open(io.BytesIO(image_data))
            text = pytesseract.image_to_string(img, lang='eng+chi_sim', config='--oem 3 --psm 6')
            return image_service_pb2.ImageResponse(text=text)
        except Exception as e:
            return image_service_pb2.ImageResponse(error=str(e))

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    image_service_pb2_grpc.add_ImageServiceServicer_to_server(ImageService(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()