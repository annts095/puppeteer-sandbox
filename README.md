# puppeteer-sandbox

## セットアップ

対象パッケージのインストール

```sh
npm ci
```

環境変数の指定

```
cp env.example .env
```

## 実行

```Sh
SRC_PAGE="遷移元ページ" TARGET_PATH="遷移先ページのパス" TARGET_DOMAIN="遷移先ページのドメイン" OUTPUT_FILE_TYPE="html|csv|json" node ./src/test.js
```

実行した結果が `/report` に配置される
