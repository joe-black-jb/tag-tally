FROM python:3.12-slim

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係のファイルをコピー
COPY requirements.txt .

# 依存関係をインストール
RUN pip install --no-cache-dir -r requirements.txt

# fastapi 関連のライブラリをインストール
RUN pip install fastapi[all]

# アプリケーションコードをコピー
COPY . .

# ポートを公開 (必要に応じて変更)
EXPOSE 8000

# 実行コマンド (必要に応じて変更)
# CMD ["python", "main.py"]
CMD ["uvicorn", "main:app", "--reload"]