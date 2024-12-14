import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { auth } from "twitter-api-sdk";
import axios, { AxiosError } from "axios";
import { format, toZonedTime } from "date-fns-tz";
import { formatISO, subWeeks } from "date-fns";

dotenv.config();
const app = express();
const port = 3000;

const timeZone = "Asia/Tokyo";

// // Twitter Client インスタンスの作成
// // Initialize auth client first
// const authClient = new auth.OAuth2User({
//   client_id: process.env.CLIENT_ID as string,
//   client_secret: process.env.CLIENT_SECRET as string,
//   callback: "YOUR-CALLBACK",
//   scopes: ["tweet.read", "users.read", "offline.access"],
// });

// Pass auth credentials to the library client
// const twitterClient = new Client(authClient);

// ルーティング
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/tweets/search/recent", async (req: Request, res: Response) => {
  console.log("ツイート検索API ⭐️");
  // console.log("クライアント情報: ", authClient);

  try {
    const baseUrl = process.env.TWITTER_API_BASE_URL;
    if (!baseUrl) {
      throw Error("base URL が設定されていません");
    }
    // Bearer トークンをヘッダーに追加
    const bearerToken = process.env.BEARER_TOKEN;
    if (!bearerToken) {
      throw Error("Bearer トークンが設定されていません");
    }
    const headers = {
      Authorization: `Bearer ${bearerToken}`, // 環境変数からトークンを取得
    };

    /*
    正しい形式: 2023-12-31T23:59:59Z
    日本時間:   2024-01-01T08:59:59+09:00
    */
    const isoNow = new Date().toISOString().replace(/\.\d{3}Z/, "Z");
    console.log("Twitter API 検索終了時刻 (現在時刻): ", isoNow);
    // const formatIsoNow = format(isoNow, "yyyy-MM-dd'T'HH:mm:ss");
    // console.log("フォーマット後ISO: ", formatIsoNow);

    // const now = toZonedTime(new Date(), timeZone);
    // const jstISONow = format(now, "yyyy-MM-dd'T'HH:mm:ssXXX", {
    //   timeZone,
    // });
    // console.log("エンコード前: ", jstISONow);
    // const encodedNow = encodeURIComponent(jstISONow);
    // console.log("エンコード後: ", encodedNow);

    // res.json({ message: "TEST" });

    // 1週間前のISO日時を取得
    // const oneWeekAgo = subWeeks(new Date(), 1);
    // const isoOneWeekAgo = formatISO(oneWeekAgo).replace(/\.\d{3}Z/, "Z");
    // console.log("1週間前の日時: ", isoOneWeekAgo);

    const oneWeekAgo = subWeeks(new Date(), 1)
      .toISOString()
      .replace(/\.\d{3}Z/, "Z");
    console.log("Twitter API 検索開始時刻 (1週間前): ", oneWeekAgo);

    // API リクエスト
    const searchTweets = await axios.get(`${baseUrl}/tweets/search/recent`, {
      headers,
      params: {
        query: "#tennis",
        // start_time, end_time: YYYY-MM-DDTHH:mm:ssZ (ISO 8601/RFC 3339) 形式
        start_time: oneWeekAgo,
        end_time: isoNow,
      },
    });
    // const searchTweets = await twitterClient.tweets.tweetsRecentSearch({
    //   query: "#tennis",
    // });
    console.log("ツイート検索結果.data.data: ", searchTweets?.data?.data);
    res.json(searchTweets?.data?.data);

    return;
  } catch (e: any) {
    console.log("エラー内容❗️: ", e);

    const limitReset = new Date(
      e?.response?.headers["x-rate-limit-reset"] * 1000
    );
    const jstLimitReset = toZonedTime(limitReset, timeZone);
    const jstISOLimitReset = format(jstLimitReset, "yyyy-MM-dd'T'HH:mm:ssXXX", {
      timeZone,
    });
    console.log("いつ復活するか: ", jstISOLimitReset);

    console.log(
      "1つの時間枠内で許可されている最大リクエスト数: ",
      e?.response?.headers["x-rate-limit-limit"]
    );
    console.log(
      "残リクエスト数: ",
      e?.response?.headers["x-rate-limit-remaining"]
    );

    // res.send(e);
    if (e instanceof AxiosError) {
      const err = {
        message: e.message,
        code: e.code,
        status: e.status,
      };
      res.json(err);
      return;
    }
    res.json(e);
    return;
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
