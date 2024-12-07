import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import api from "../api/axiosConfig";

const SearchPosts = () => {
  const [tagName, setTagName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleChangeTagName = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setTagName(e.target.value);
  };

  const handleChangeStartDate = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setStartDate(e.target.value);
    console.log("入力された開始日: ", e.target.value);
    console.log("型: ", typeof e.target.value);
  };

  const handleChangeEndDate = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEndDate(e.target.value);
  };

  const handleClickSearch = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = {
      tagName,
      startDate,
      endDate,
    };
    console.log("検索するパラメータ: ", params);

    // https://api.twitter.com/2/tweets/search/recent?query=#example&start_time=2023-01-01T00:00:00Z&end_time=2023-12-31T23:59:59Z
    const tweets = await api.get("/tweets/search/recent", {
      params: {
        query: "#example",
        start_time: "2023-01-01T00:00:00Z",
        end_time: "2023-12-31T23:59:59Z",
      },
    });
    console.log("tweets: ", tweets);
  };

  return (
    <>
      <div className="mb-4">
        <div>タグ名</div>
        <Input type="text" value={tagName} onChange={handleChangeTagName} />
      </div>
      <div className="mb-4">
        <div>開始日</div>
        <Input type="date" value={startDate} onChange={handleChangeStartDate} />
      </div>
      <div className="mb-4">
        <div>終了日</div>
        <Input type="date" value={endDate} onChange={handleChangeEndDate} />
      </div>
      <div>
        <Button title="検索" onClick={handleClickSearch} />
      </div>
    </>
  );
};

export default SearchPosts;
