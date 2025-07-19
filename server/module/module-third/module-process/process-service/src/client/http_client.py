import requests

def upload_image(image_path, url='http://192.168.1.18:40050/process_image'):
    with open(image_path, 'rb') as image_file:
        files = {'image': image_file}
        response = requests.post(url, files=files)

    # Print raw response for debugging
    print("Status Code:", response.status_code)
    print("Response Headers:", response.headers)
    print("Raw Response:", response.text)

    if response.status_code == 200:
        print("识别结果:", response.json()['text'])
    else:
        print("错误:", response.json()['error'])

if __name__ == '__main__':
    image_path = 'unnamed.png'
    upload_image(image_path)