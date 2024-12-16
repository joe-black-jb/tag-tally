import json
from main import search_post_data

# リクエストのパスに応じて実行する関数を変更する
def route_request(event, context):
    print("ルーター起動⭐️")
    # print("event: ", event)
    # print("context: ", context)
    # リクエストパスの取得
    path = event['requestContext']['http']['path']
    query = event["queryStringParameters"]
    print(query)

    # パスに応じて処理を分岐
    if path == "/search":
        # year, date, hashtag を抽出し search_post_date に渡す
        if not query:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Query Not Found'})
            }
        hashtag = query["hashtag"]
        year = query["year"]
        date = query["date"]
        # return "search route"
        return search_post_data(year, date, hashtag)
    # elif path == "/other-endpoint":
    #     return other_endpoint(event, context)
    else:
        return {
            'statusCode': 404,
            'body': json.dumps({'message': 'Not Found'})
        }


def lambda_handler(event, context):
    print("Handler ⭐️")
    print(event)
    print(context)
    return route_request(event, context)