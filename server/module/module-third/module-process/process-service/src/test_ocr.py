import requests

url = "http://localhost:8080/parse_document"
payload = {
    "source_file": "synerunify/2025/11/11/invoice.jpg",
    "output_dir": "synerunify/detection/2025/11/11",
}
try:
    response = requests.post(url, json=payload, timeout=10)
    response.raise_for_status()
except requests.RequestException as exc:
    print("Request failed:", exc)
else:
    print("Status Code:", response.status_code)
    print("Response Headers:", response.headers)
    print("Raw Response:", response.text)