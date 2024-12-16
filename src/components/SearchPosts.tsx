import { useState } from "react";

import Input from "./Input";
import Button from "./Button";
import api from "../api/axiosConfig";
import { PostData, PostSearchParams } from "../types/types";
import { handleExportToExcel } from "../utils/utils";

const SearchPosts = () => {
  const [tagName, setTagName] = useState<string>("");
  const [postDate, setPostDate] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [hashtagErrorMessage, setHashtagErrorMessage] = useState<string>("");
  const [dateErrorMessage, setDateErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [fetchingData, setFetchingData] = useState<boolean>(false);

  const handleChangeTagName = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setTagName(e.target.value);
  };

  const handleChangePostDate = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPostDate(e.target.value);
    console.log("入力された開始日: ", e.target.value);
    console.log("型: ", typeof e.target.value);
  };

  const handleClickSearch = async () => {
    setSuccessMessage("");
    setErrorMessage("");
    try {
      if (!tagName) {
        setHashtagErrorMessage("ハッシュタグ名を入力してください");
        return;
      }
      setHashtagErrorMessage("");
      if (!postDate) {
        setDateErrorMessage("投稿日を入力してください");
        return;
      }
      setDateErrorMessage("");

      const splitDate = postDate.split("-");
      if (splitDate && splitDate.length >= 3) {
        console.log({ splitDate });
        const year = splitDate[0];
        const date = `${splitDate[1]}${splitDate[2]}`;
        const params: PostSearchParams = {
          hashtag: tagName,
          year,
          date,
        };
        setFetchingData(true);
        const response = await api.get("/search", {
          params,
        });
        const postData = response.data?.data as PostData[];
        console.log("postData: ", postData);
        if (!postData || (postData && postData.length === 0)) {
          setSuccessMessage("");
          setErrorMessage("データの取得に失敗しました");
          return;
        }
        // エクセルファイルの出力
        const fileName = `data_${year}_${date}.xlsx`;
        handleExportToExcel(postData, fileName);
        setFetchingData(false);
      }
      setSuccessMessage("データの取得に成功しました");
      setErrorMessage("");
      setFetchingData(false);
    } catch {
      // if (e instanceof AxiosError) {
      //   const message = e.response?.data?.detail;
      //   if (message) {
      //     setErrorMessage(message);
      //     return;
      //   }
      // }
      setSuccessMessage("");
      setErrorMessage("データの取得に失敗しました");
      setFetchingData(false);
      return;
    }
  };

  return (
    <>
      <div className="mb-4">
        <div>ハッシュタグ</div>
        <Input
          type="text"
          value={tagName}
          placeholder="#ハッシュタグ名"
          onChange={handleChangeTagName}
        />
        {hashtagErrorMessage && (
          <div className="text-red-500">{hashtagErrorMessage}</div>
        )}
      </div>
      <div className="mb-4">
        <div>投稿日</div>
        <Input type="date" value={postDate} onChange={handleChangePostDate} />
        {dateErrorMessage && (
          <div className="text-red-500">{dateErrorMessage}</div>
        )}
      </div>
      <div className="mt-8">
        <Button title="ダウンロード" onClick={handleClickSearch} />
      </div>
      {fetchingData && <div className="mt-4">データを取得中...</div>}
      {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
      {successMessage && (
        <div className="text-green-500 mt-4">{successMessage}</div>
      )}
    </>
  );
};

export default SearchPosts;
