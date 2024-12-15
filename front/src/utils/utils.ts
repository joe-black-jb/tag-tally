import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { PostData } from "../types/types";

export const handleExportToExcel = (data: PostData[], fileName: string) => {
  // データをワークシート形式に変換
  const worksheet = XLSX.utils.json_to_sheet(data);

  // ワークブックを作成
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "TwitterData");

  // バッファをエクセルファイルとして生成
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // エクセルファイルをローカルに保存
  const fileBlob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });
  // saveAs(fileBlob, "twitter_data.xlsx");
  saveAs(fileBlob, fileName);
};
