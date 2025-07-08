import os
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.common.exceptions import NoSuchElementException
import time

DOWNLOAD_FOLDER = "./public/assets/cards"

# --- 폴더 생성 ---
if not os.path.exists(DOWNLOAD_FOLDER):
    os.makedirs(DOWNLOAD_FOLDER)
    print(f"'{DOWNLOAD_FOLDER}' 폴더를 생성했습니다.")

# --- 웹 드라이버 설정 ---
try:
    print("웹 드라이버를 설정하는 중입니다...")
    service = Service(ChromeDriverManager().install())
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--log-level=3")
    driver = webdriver.Chrome(service=service, options=options)
    print("웹 드라이버 설정 완료.")
except Exception as e:
    print(f"웹 드라이버 설정 중 오류 발생: {e}")
    exit()

# --- 카드 목록 페이지로 이동 ---
try:
    print("RoyaleAPI 카드 목록 페이지로 이동합니다...")
    driver.get("https://royaleapi.com/cards")
    time.sleep(5)
    print("페이지 로딩 완료.")
except Exception as e:
    print(f"페이지 이동 중 오류 발생: {e}")
    driver.quit()
    exit()

# --- XPath를 사용하여 카드 이름 목록 추출 ---
card_names = []
print("XPath를 사용하여 카드 이름 목록을 추출합니다...")
i = 1
while True:
    try:
        xpath = f'//*[@id="page_content"]/div[3]/div[3]/div[2]/div[{i}]/a/img'
        img_element = driver.find_element(By.XPATH, xpath)
        img_src = img_element.get_attribute('src')
        card_id = os.path.basename(img_src).replace('.png', '')
        if card_id not in card_names:
            card_names.append(card_id)
        i += 1
    except NoSuchElementException:
        print(f"\n총 {len(card_names)}개의 고유한 카드를 찾았습니다. 목록 추출을 종료합니다.")
        break
    except Exception as e:
        print(f"카드 이름 추출 중 예상치 못한 오류 발생: {e}")
        break

# --- 이미지 다운로드 ---
def download_image(url, file_path):
    """지정된 URL에서 이미지를 다운로드하고 파일로 저장하는 함수"""
    
    # 브라우저처럼 보이기 위한 User-Agent 설정
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        # headers를 포함하여 요청 전송
        response = requests.get(url, headers=headers, stream=True)
        
        if response.status_code == 200:
            with open(file_path, 'wb') as f:
                f.write(response.content)
            print(f"다운로드 완료: {os.path.basename(file_path)}")
            return True
        else:
            return False
    except Exception as e:
        print(f"다운로드 중 오류 발생: {url}, 오류: {e}")
        return False

# --- 다운로드 실행 ---
if card_names:
    print("\n--- 카드 이미지 다운로드를 시작합니다 ---")
    download_count = 0
    for name in card_names:
        # 일반 카드
        base_url = f"https://cdns3.royaleapi.com/static/img/cards/{name}.png"
        base_path = os.path.join(DOWNLOAD_FOLDER, f"{name}.png")
        if download_image(base_url, base_path):
            download_count += 1

        # 진화 카드
        evo_url = f"https://cdns3.royaleapi.com/static/img/cards/{name}-ev1.png"
        evo_path = os.path.join(DOWNLOAD_FOLDER, f"{name}-ev1.png")
        if download_image(evo_url, evo_path):
            download_count += 1
            
    print(f"\n총 {download_count}개의 이미지를 성공적으로 다운로드했습니다.")
    print(f"이미지는 '{DOWNLOAD_FOLDER}' 폴더에 저장되었습니다.")
else:
    print("\n다운로드할 카드 목록을 찾지 못했습니다. 스크립트를 종료합니다.")