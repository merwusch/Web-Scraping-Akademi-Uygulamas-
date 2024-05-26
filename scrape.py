from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import json
import sys


service = Service("./chromedriver.exe")
options = Options()
options.add_experimental_option("detach",True)
options.add_argument("--headless=new")
keyword = sys.argv[1]

class Tez:
    def __init__(self, yayin_id, yayin_adi, yazarlar, yayin_turu, tarih, keyword, url):
        self.yayin_id = yayin_id
        self.yayin_adi = yayin_adi
        self.yazarlar = yazarlar
        self.yayin_turu = yayin_turu
        self.tarih = tarih
        self.keyword = keyword
        self.url = url
    def __str__(self):
        return f"Yayın ID: {self.yayin_id}\nYayın Adı: {self.yayin_adi}\nYazarlar: {self.yazarlar}\nYayın Türü: {self.yayin_turu}\nTarih: {self.tarih}\nKeyword: {self.keyword}\nUrl: {self.url}\n"
    def to_json(self):
        return json.dumps(self, default=lambda o: o.__dict__)

driver = webdriver.Chrome(service=service, options=options)
driver.maximize_window()
driver.implicitly_wait(3)
driver.get("https://tez.yok.gov.tr/UlusalTezMerkezi/")
driver.find_element(By.ID, "neden").send_keys(keyword)
driver.find_element(By.NAME,"kaydet").click()


tez_id = driver.find_elements(By.XPATH, '//*[@id="div1"]/table/tbody/tr/td[2]/span')
yazar = driver.find_elements(By.XPATH, '//*[@id="div1"]/table/tbody/tr/td[3]')
yil = driver.find_elements(By.XPATH, '//*[@id="div1"]/table/tbody/tr/td[4]')
tez_adi = driver.find_elements(By.XPATH, '//*[@id="div1"]/table/tbody/tr/td[5]/span')
tez_turu = driver.find_elements(By.XPATH, '//*[@id="div1"]/table/tbody/tr/td[6]')
tez_url =[]



hatali =[]
sonuc_sayisi = 10


i=0
while i < (sonuc_sayisi+len(hatali)):
    wait = WebDriverWait(driver, 3)
    element = wait.until(EC.element_to_be_clickable((By.XPATH, f'//*[@id="div1"]/table/tbody/tr[{i+1}]/td[2]/span')))
    element.click()
    time.sleep(0.5)
    
    try:
        tez_url.append(driver.find_element(By.XPATH, "//*[@id=\"dialog-modal\"]/p/table/tbody/tr[2]/td[2]/a").get_attribute("href"))
        driver.find_element(By.XPATH, "//*[@id=\"dialog-modal\"]/p/table/tbody/tr[2]/td[2]/a/img").click()
    except : 
        hatali.append(i)
        tez_url.append("Hatalı")
        pass
    driver.find_element(By.XPATH, "/html/body/div[3]/div[1]/a/span").click()
    i+=1


tezler = []
j=0
while j < (sonuc_sayisi + len(hatali)):
    if j in hatali:
        j+=1
        continue
    
    tezler.append(Tez(tez_id[j].text, tez_adi[j].text, yazar[j].text, tez_turu[j].text, yil[j].text, keyword, tez_url[j]).to_json())
    j+=1

js = json.dumps(tezler)
print(js)
driver.quit()