import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Client, auth } from "twitter-api-sdk";
import axios from "axios";

dotenv.config();
const app = express();
const port = 3000;

// Twitter Client インスタンスの作成
// Initialize auth client first
const authClient = new auth.OAuth2User({
  client_id: process.env.CLIENT_ID as string,
  client_secret: process.env.CLIENT_SECRET as string,
  callback: "YOUR-CALLBACK",
  scopes: ["tweet.read", "users.read", "offline.access"],
});

// Pass auth credentials to the library client
// const twitterClient = new Client(authClient);

// ルーティング
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/tweets/search/recent", async (req: Request, res: Response) => {
  console.log("ツイート検索API ⭐️");
  console.log("クライアント情報: ", authClient);

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
    const searchTweets = await axios.get(`${baseUrl}/tweets/search/recent`, {
      headers,
      params: {
        query: "#tennis",
      },
    });
    // const searchTweets = await twitterClient.tweets.tweetsRecentSearch({
    //   query: "#tennis",
    // });
    console.log("ツイート検索結果: ", searchTweets);
    res.send(searchTweets);
  } catch (e) {
    console.log("エラー内容❗️: ", e);
    res.send(e);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
