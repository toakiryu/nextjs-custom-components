# セットアップ方法

## 1. Tailwindcss アニメーションの設定

以下のキーと値を追加してください。

> tailwind.config.ts

```ts
export default {
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          "0%": { left: "-100%" },
          "100%": { left: "100%" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite linear",
      },
    },
  },
} satisfies Config;
```

## 2. CNコンポーネントの追加

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

## 3. カスタムコンポーネントの作成

1. カスタム画像ローダーの作成

> /src/components/custom/image/loader.ts

このファイルをコピーして追加してください。

2. カスタム画像コンポーネントの作成
`next/image` を拡張およびカスタムしたコンポーネントです。

>/src/components/custom/image.tsx

このファイルをコピーして追加してください。

## 4. 画像変換APIの作成

画像のサイズやクオリティーを変換して取得を可能にするためのAPIです。

> /src/app/api/image/loader/route.ts

このファイルをコピーして追加してください。
