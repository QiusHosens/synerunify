import base64
import gzip
import json

import requests

url = "http://localhost:8080/parse_document"
# payload = {
#     "source_file": "synerunify/2025/11/invoice.png",
#     "output_dir": "synerunify/detection/2025/11",
# }
payload = {
    "source_file": "synerunify/2025/11/11/invoice.jpg",
    "output_dir": "synerunify/detection/2025/11/11",
}
try:
    response = requests.post(url, json=payload, timeout=10000)
    response.raise_for_status()
except requests.RequestException as exc:
    print("Request failed:", exc)
else:
    print("Status Code:", response.status_code)
    print("Response Headers:", response.headers)
    text = response.text
    print("Raw Response:", response.text)
    #
    result = json.loads(text)
    json = result['data']['json']
    compressed_bytes = base64.b64decode(json)
    # decompress
    decompressed = gzip.decompress(compressed_bytes).decode('utf-8')
    print("decompressed:", decompressed)