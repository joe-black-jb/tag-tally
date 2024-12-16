# FROM python:3.12-slim
FROM public.ecr.aws/lambda/python:3.12

# 作業ディレクトリを設定
# WORKDIR /app

# 依存関係のファイルをコピー
# COPY requirements.txt .
COPY requirements.txt ${LAMBDA_TASK_ROOT}

# 依存関係をインストール
RUN pip install --no-cache-dir -r requirements.txt

# fastapi 関連のライブラリをインストール
RUN pip install fastapi[all]

# アプリケーションコードをコピー
# COPY . .
COPY . ${LAMBDA_TASK_ROOT}

# ポートを公開 (必要に応じて変更)
# EXPOSE 8000

# 実行コマンド (必要に応じて変更)
# CMD ["python", "main.py"]
# CMD ["uvicorn", "main:app", "--reload"]
CMD ["lambda.lambda_handler"]