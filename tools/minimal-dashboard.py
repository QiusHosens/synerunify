import time
import requests
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import os
import urllib.parse
import re

# 配置
# URL = "https://mui.com/store/previews/minimal-dashboard/"
URL = "https://minimals.cc/auth/amplify/sign-in"
USERNAME = "demo@minimals.cc"
PASSWORD = "@2Minimal"
DRIVER_PATH = "C:/Users/zy/AppData/Local/Google/Chrome/Application/chromedriver-win64/chromedriver.exe"
DOWNLOAD_DIR = "downloaded_images"

# 创建下载目录
if not os.path.exists(DOWNLOAD_DIR):
    os.makedirs(DOWNLOAD_DIR)

# 初始化 WebDriver
service = Service(DRIVER_PATH)
driver = webdriver.Chrome(service=service)

def login():
    """模拟登录网站"""
    driver.get(URL)
    time.sleep(5)

    try:
        # 输入用户名和密码
        # username_field = WebDriverWait(driver, 10).until(
        #     EC.presence_of_element_located((By.CSS_SELECTOR, "input[name='email']"))
        # )
        # password_field = WebDriverWait(driver, 10).until(
        #     EC.presence_of_element_located((By.CSS_SELECTOR, "input[name='password']"))
        # )
        submit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))
        )

        # username_field.send_keys(USERNAME)
        # password_field.send_keys(PASSWORD)
        submit_button.click()
        time.sleep(10)  # 等待登录完成
        print("登录成功")
    except Exception as e:
        print(f"登录失败: {e}")

# def download_images():
#     """下载页面中的图片"""
#     soup = BeautifulSoup(driver.page_source, "html.parser")
#     img_tags = soup.find_all("img")
#
#     print(f"找到 {len(img_tags)} 张图片，开始下载...")
#
#     for idx, img in enumerate(img_tags):
#         img_url = img.get("src")
#         if not img_url:
#             continue
#
#         if img_url.startswith("/"):
#             img_url = "https://mui.com" + img_url
#
#         try:
#             response = requests.get(img_url, stream=True)
#             if response.status_code == 200:
#                 img_name = f"image_{idx}.jpg"
#                 img_path = os.path.join(DOWNLOAD_DIR, img_name)
#                 with open(img_path, "wb") as f:
#                     f.write(response.content)
#                 print(f"已下载: {img_name}")
#             else:
#                 print(f"无法下载: {img_url}, 状态码: {response.status_code}")
#         except Exception as e:
#             print(f"下载 {img_url} 时出错: {e}")

def download_images(base_dir="downloaded_images"):
    # 创建基础目录和子目录
    svg_dir = os.path.join(base_dir, "svg")
    png_dir = os.path.join(base_dir, "png")
    url_dir = os.path.join(base_dir, "url")

    for directory in [svg_dir, png_dir, url_dir]:
        if not os.path.exists(directory):
            os.makedirs(directory)

    # 设置请求头，模拟浏览器访问
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        downloaded_count = 0
        downloaded_urls = set()  # 避免重复下载

        # 获取所有网络请求
        # performance_logs = driver.get_log('performance')
        #
        # for entry in performance_logs:
        #     message = eval(entry['message'])['message']
        #     if 'Network.requestWillBeSent' in message['method']:
        #         request_url = message['params'].get('request', {}).get('url', '')
        #         if request_url.startswith('http'):
        #             downloaded_urls.add(request_url)
        #
        # print(f"urls: {downloaded_urls}")

        # 解析HTML
        soup = BeautifulSoup(driver.page_source, "html.parser")

        span = soup.find('span', class_='css-raduy6')

        if span and span.get('style'):
            style = span['style']
            # 解析style
            style_dict = dict(item.split(':') for item in style.split(';') if ':' in item)
            mask = style_dict.get('mask') or style_dict.get('-webkit-mask')

            if mask:
                print(f"找到的span: {span}")
                print(f"完整Style: {style}")
                print(f"Mask值: {mask.strip()}")
            else:
                print("该span的style中没有mask属性")
        else:
            print("未找到符合条件的span元素或该span没有style属性")

        # 查找所有有style属性的元素
        elements_with_style = soup.find_all(lambda tag: tag.get('style'))
        for element in elements_with_style:
            style = element.get('style')  # 获取style属性值
        if style and 'mask' in style.lower():  # 检查是否包含mask
            # 简单解析style字符串
            style_dict = {}
            for prop in style.split(';'):
                if ':' in prop:
                    key, value = prop.split(':', 1)
                    style_dict[key.strip()] = value.strip()

            # 获取mask属性
            mask_value = style_dict.get('mask') or style_dict.get('-webkit-mask')
            if mask_value:
                print(f"元素: {element.name}")
                print(f"完整Style: {style}")
                print(f"Mask值: {mask_value}")
                print("---")

        # 1. 下载img标签中的图片
        img_tags = soup.find_all('img')
        for img in img_tags:
            img_url = img.get('src')
            if not img_url:
                continue

            if not img_url.startswith('http'):
                img_url = urllib.parse.urljoin(URL, img_url)

            if img_url.lower().endswith('.svg') and img_url not in downloaded_urls:
                downloaded_count += download_file(img_url, svg_dir, headers, downloaded_urls)
            elif img_url.lower().endswith('.png') and img_url not in downloaded_urls:
                downloaded_count += download_file(img_url, png_dir, headers, downloaded_urls)

        # 2. 下载SVG标签
        svg_tags = soup.find_all('svg')
        for i, svg in enumerate(svg_tags):
            try:
                svg_name = f"svg_image_{i}.svg"
                save_path = os.path.join(svg_dir, svg_name)
                with open(save_path, 'w', encoding='utf-8') as f:
                    f.write(str(svg))
                print(f"下载成功: {svg_name} (存储到svg目录)")
                downloaded_count += 1
            except Exception as e:
                print(f"下载SVG失败: {str(e)}")

        # 3. 查找并下载CSS中的图片
        # 检查内联style
        for element in soup.find_all(style=True):
            style_content = element['style']
            urls = extract_urls_from_css(style_content)
            for css_url in urls:
                full_url = urllib.parse.urljoin(URL, css_url)
                if full_url not in downloaded_urls:
                    if css_url.lower().endswith('.svg'):
                        downloaded_count += download_file(full_url, url_dir, headers, downloaded_urls, "url/svg")
                    elif css_url.lower().endswith('.png'):
                        downloaded_count += download_file(full_url, url_dir, headers, downloaded_urls, "url/png")

        # 检查<link>标签中的CSS文件
        css_links = soup.find_all('link', rel='stylesheet')
        for link in css_links:
            css_url = link.get('href')
            if not css_url:
                continue
            if not css_url.startswith('http'):
                css_url = urllib.parse.urljoin(URL, css_url)

            try:
                css_response = requests.get(css_url, headers=headers)
                css_response.raise_for_status()
                css_content = css_response.text
                urls = extract_urls_from_css(css_content)

                for css_img_url in urls:
                    full_img_url = urllib.parse.urljoin(css_url, css_img_url)
                    if full_img_url not in downloaded_urls:
                        if css_img_url.lower().endswith('.svg'):
                            downloaded_count += download_file(full_img_url, url_dir, headers, downloaded_urls, "url/svg")
                        elif css_img_url.lower().endswith('.png'):
                            downloaded_count += download_file(full_img_url, url_dir, headers, downloaded_urls, "url/png")

            except Exception as e:
                print(f"处理CSS文件失败 {css_url}: {str(e)}")

        print(f"\n共下载 {downloaded_count} 个图片文件")

    except Exception as e:
        print(f"爬取网页失败: {str(e)}")

def extract_urls_from_css(css_content):
    """从CSS内容中提取url()中的图片地址"""
    pattern = r'url\(["\']?(.*?)["\']?\)'
    urls = re.findall(pattern, css_content)
    return [url.strip() for url in urls if url.strip()]

def download_file(file_url, save_dir, headers, downloaded_urls, sub_dir=None):
    """下载单个文件并返回是否成功（1或0）"""
    try:
        response = requests.get(file_url, headers=headers)
        response.raise_for_status()

        file_name = os.path.basename(urllib.parse.urlparse(file_url).path)
        if not file_name:
            file_name = f"image_{len(downloaded_urls)}" + (".svg" if file_url.lower().endswith('.svg') else ".png")

        # 如果有子目录，则创建并使用
        if sub_dir:
            save_dir = os.path.join(save_dir, sub_dir)
            if not os.path.exists(save_dir):
                os.makedirs(save_dir)

        save_path = os.path.join(save_dir, file_name)
        with open(save_path, 'wb') as f:
            f.write(response.content)

        print(f"下载成功: {file_name} (存储到{sub_dir or save_dir.split('/')[-1]}目录)")
        downloaded_urls.add(file_url)
        return 1

    except Exception as e:
        print(f"下载文件失败 {file_url}: {str(e)}")
        return 0

def main():
    try:
        login()
        download_images()
    finally:
        driver.quit()

if __name__ == "__main__":
    main()