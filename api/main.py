from fastapi import FastAPI, HTTPException
import requests
from bs4 import BeautifulSoup
import re

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

"""togetter をスクレイピングする
Parameters:
    date: str = 日付
Returns:
    _type_: _description_
"""
@app.get("/search")
def sample(date: str = None, year: str = None):
    print("date⭐️: " ,date)
    year_date = year + "_" + date
    url = f"https://togetter.com/search?q=%23mgtorg{year}&t=q"
    response = requests.get(url)

    # 詳細ページURLの取得
    urls = get_detail_page_url(year_date, response)
    if not urls:
        error_message = "詳細ページURLが見つかりませんでした"
        raise HTTPException(status_code=500, detail=error_message)

    # 投稿データの取得
    post_data = get_post_data(urls[0])

    return {"Result": "OK", "url": urls[0]}

def get_detail_page_url(year_date, response):
    html = response.content

    # HTMLファイルを解析
    soup = BeautifulSoup(html, "html.parser")

    # <ul class="simple_list"> を取得
    ul_element = soup.find("ul", class_="simple_list")
    # raise 確認用▼
    # ul_element = None

    urls = []
    if ul_element:
        # <li> タグを全て取得
        li_elements = ul_element.find_all("li")

        # 各 <li> タグの内容を出力
        for li in li_elements:
            text = li.get_text(strip=True)
            if text:
                # 正規表現を用いて yyyy_MMdd 箇所を取得する
                pattern = r"\d{4}_\d{4}"
                match = re.search(pattern, text)
                if match:
                    result = match.group()
                    if result and result == year_date:
                        print("===============")
                        print(text)  # テキスト部分を取得して表示
                        # a タグの内容を取得
                        a_tag = soup.find('a', href=True, class_="thumb")
                        print("aタグ: ", a_tag)
                        href = a_tag["href"]
                        print(href)
                        # print(result)
                        urls.append(href)
    else:
        error_message = "指定されたクラス名の <ul> 要素が見つかりません。"
        raise HTTPException(status_code=500, detail=error_message)

    return urls

def get_post_data(url):
    print("URL: ", url)
    ##### ① url にアクセスし HTML を取得
    response = requests.get(url)

    ##### ② パースし、変数にデータを格納
    html = response.content
    soup = BeautifulSoup(html, "html.parser")
    # print("soup ⭐️: ", soup)
    # section 配下の div を一覧取得
    # <section class="entry_main tweet_box"> を取得
    section_element = soup.find("section", class_="entry_main tweet_box")
    if not section_element:
        raise HTTPException(status_code=500, detail="投稿一覧データを取得できませんでした")
    # section_element = soup.find("section")
    print("sectionタグ⭐️: ", section_element)

    ##### ③ 次のページにアクセス

    ##### ④ パースし、変数にデータを格納

    ##### ⑤ url にアクセスし、リダイレクトされたら処理を終了する

    return "Done"