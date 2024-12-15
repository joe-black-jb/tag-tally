from fastapi import FastAPI, HTTPException
import requests
from bs4 import BeautifulSoup
import re
import json
from fastapi.middleware.cors import CORSMiddleware
from urllib.parse import quote

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

"""togetter をスクレイピングする
Parameters:
    date: str = 日付
    year: str = 年
Returns:
    _type_: _description_
"""
@app.get("/search")
def sample(year: str = None, date: str = None, hashtag: str = None):
    year_date = year + "_" + date
    url = f"https://togetter.com/search?q={hashtag}&t=q"
    # URLをエンコード
    encoded_url = quote(url, safe=":/?&=")
    response = requests.get(encoded_url)

    # 詳細ページURLの取得
    urls = get_detail_page_url(year_date, response)
    if not urls:
        error_message = "詳細ページURLが見つかりませんでした"
        raise HTTPException(status_code=500, detail=error_message)

    done = False
    count = 0
    iterate_limit = 100
    all_post_data = []
    while done == False:
        # 100 を超えたら強制ストップ
        if count >= iterate_limit:
            done = True
        page = count + 1

        # 投稿データの取得
        page_str = str(page)
        url = urls[0] + "?page=" + page_str
        done, post_data = get_post_data(url, page_str, hashtag)
        if done:
            done = True
            break
        if post_data and len(post_data) > 0:
            all_post_data += post_data
        # 最後に count をインクリメント
        count += 1

    return {"Result": "OK", "data": all_post_data}

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
                        urls.append(href)
    else:
        error_message = "投稿データが見つかりませんでした。"
        raise HTTPException(status_code=500, detail=error_message)

    return urls

def get_post_data(url, page, hashtag):
    hashtag = "#" + hashtag
    # url にアクセスし HTML を取得
    response = requests.get(url)

    # パースし、変数にデータを格納
    html = response.content
    soup = BeautifulSoup(html, "html.parser")
    """
    https://togetter.com/li/2440784?page=5 にアクセスし
    <script type="application/ld+json"> の "url": "" ココを見る
    => page=8 とか指定したのに url に page がついていなければリダイレクトした証拠なので終わり
    """
    # script タグの処理
    script_tags = soup.find_all("script", {"type": "application/ld+json"})
    # 取得した JSON をリストに格納
    all_json_data = []
    for script in script_tags:
        json_content = script.string
        if json_content:
            try:
                parsed_json = json.loads(json_content)
                all_json_data.append(parsed_json)
            except json.JSONDecodeError as e:
                print(f"JSON パースに失敗しました: {e}")

    if all_json_data and len(all_json_data) > 0:
        json_data = all_json_data[0]
        if json_data["url"]:
            # 正規表現で ?page=3 の部分を抽出
            page_pattern = r"page=\d{1}"
            page_match = re.search(page_pattern, json_data["url"])

            # ?page={num} の部分がなく、page パラメータが 2 以上の場合、リダイレクトされているので処理を終了する
            if not page_match and int(page) >= 2 :
                return True, []


    # <section class="entry_main tweet_box"> を取得
    section_element = soup.find("section", class_="entry_main tweet_box")
    if not section_element:
        raise HTTPException(status_code=500, detail="投稿一覧データを取得できませんでした")

    # section タグから div class="entry_main tweet_box" を全て取得
    div_elements = section_element.find_all("div", class_="list_box type_tweet impl_profile")

    post_data_list = []
    for div in div_elements:
        post_data = {}
        text = div.get_text(strip=True)

        # 2024-09-24 11:00:04 の部分を個別に取得する
        date_pattern = r"\d{4}-\d{2}-\d{2}"
        time_pattern = r"\d{2}:\d{2}:\d{2}"
        date_match = re.search(date_pattern, text)
        time_match = re.search(time_pattern, text)
        date_result = date_match.group()
        time_result = time_match.group()
        post_data["date"] = date_result
        post_data["time"] = time_result

        # span タグを取得
        span_element = div.find("span")
        account_name_text = span_element.get_text(strip=True)
        post_data["account"] = account_name_text

        # p class="tweet" を取得
        tweet_paragraph = div.find("p", class_="tweet")
        tweet_text = tweet_paragraph.get_text(strip=True)
        post_data["text"] = tweet_text
        post_data_list.append(post_data)

    return False, post_data_list
