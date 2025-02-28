# ベースイメージ
FROM python:3.11

# 作業ディレクトリを作成
WORKDIR /app

# 依存パッケージのコピー
COPY app/requirements.txt /app/

# 依存パッケージのインストール
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションのコードをコピー
COPY app/ /app/

# Pythonスクリプトを実行
CMD ["python", "main.py"]
