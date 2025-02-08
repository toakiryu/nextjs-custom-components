# セットアップ方法

## 1. CNコンポーネントの追加

1. 必要なパッケージをインストール

```bash
npm i clsx tailwind-merge autoprefixer
```

2. コンポーネントの作成

> /src/lib/utils.ts

このファイルをコピーして追加してください。

3. `config` の更新

プラグインに `autoprefixer` を追加してください。

```js
const config = {
  plugins: {
    autoprefixer: {},
  },
};
```

## 2. カスタムコンポーネントの作成

> /src/components/custom/link.tsx

このファイルをコピーして追加してください。
