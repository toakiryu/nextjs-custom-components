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

必要なパッケージをインストール

```bash
npm i clsx tailwind-merge
```

コンポーネントの作成

> /src/lib/utils.ts

```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## 3. カスタムコンポーネントの作成

カスタム画像ローダーの作成

> /src/components/custom/image/loader.ts

```ts
"use client";

import { ImageLoaderProps } from "next/image";

const imageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  // ローカル画像を変換APIに渡す
  return `/api/image/loader?src=${src}&w=${width}&q=${quality || 75}`;
};

export default imageLoader;
```

カスタム画像コンポーネントの作成
`next/image` を拡張およびカスタムしたコンポーネントです。

>/src/components/custom/image.tsx

```tsx
"use client";

import React, { SyntheticEvent, useState } from "react";
import NextImage, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import imageLoader from "./image/loader";

export interface CustomImageProps
  extends Omit<
      React.ImgHTMLAttributes<HTMLImageElement>,
      "height" | "width" | "loading" | "ref" | "alt" | "src" | "srcSet"
    >,
    ImageProps {
  classNames?: {
    base?: string;
    placeholder?: string;
    img?: string;
  };
  rounded?: "sm" | "md" | "lg" | "xl" | string;
}

const Image = React.forwardRef<HTMLImageElement, CustomImageProps>(
  (
    {
      alt = "image",
      src,
      width,
      height,
      className,
      classNames,
      loading = "eager",
      rounded = "6px",
      ...props
    },
    ref
  ) => {
    const [lowResLoaded, setLowResLoaded] = useState(false);

    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const loadError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
      console.error("Image failed to load:", src, e);
      setHasError(true);
    };

    return (
      <div
        ref={ref}
        className={cn(
          `shadow-black/5 shadow-none group relative overflow-hidden`,
          !isLoaded &&
            !hasError &&
            "before:opacity-100 before:absolute before:inset-0 before:z-10 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-zinc-100/50 before:to-transparent",
          !isLoaded &&
            !hasError &&
            `after:opacity-100 after:absolute after:inset-0 after:-z-10 after:bg-zinc-50 after:backdrop-blur-sm`,
          classNames?.base
        )}
        style={{
          maxWidth: width || "fit-content",
          height: height,
          borderRadius: rounded,
        }}
        suppressHydrationWarning
      >
        {!isLoaded && (
          <NextImage
            alt={alt}
            src={src}
            fill
            className={cn(
              "absolute inset-0 z-0 max-w-full h-auto object-cover",
              className,
              classNames?.img
            )}
            fetchPriority="low"
            decoding="async"
            loading={loading}
            loader={() =>
              imageLoader({
                src: src as string,
                width: 1,
                quality: 1,
              })
            }
            onLoad={() => setLowResLoaded(true)}
          />
        )}
        {lowResLoaded && (
          <NextImage
            alt={alt}
            src={src}
            fill
            className={cn(
              "!relative z-10 max-w-full h-auto shadow-black/5 opacity-0 data-[loaded=true]:opacity-100 blur-md data-[loaded=true]:blur-none shadow-none transition-transform-opacity motion-reduce:transition-none transition-all duration-300 ease-in-out object-cover",
              className,
              classNames?.img
            )}
            data-loaded={isLoaded}
            fetchPriority="low"
            decoding="async"
            loading={loading}
            loader={imageLoader}
            onLoad={() => setTimeout(() => setIsLoaded(true), 100)}
            onError={(e) => loadError(e)}
            {...props}
          />
        )}
      </div>
    );
  }
);
Image.displayName = "Image";

export default Image;
```

## 4. 画像変換APIの作成

画像のサイズやクオリティーを変換して取得を可能にするためのAPIです。

> /src/app/api/image/loader/route.ts

```ts
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const src = searchParams.get("src");
    const width = parseInt(searchParams.get("w") || "0", 10);
    const quality = parseInt(searchParams.get("q") || "75", 10);

    if (!src) {
      return NextResponse.json({ error: "Image not found" }, { status: 400 });
    }

    let imageBuffer: Buffer;

    if (src.startsWith("http")) {
      // 外部URLの画像を取得
      const response = await fetch(src, { cache: "no-store" });
      if (!response.ok) {
        return NextResponse.json(
          { error: "Failed to fetch image" },
          { status: 500 }
        );
      }
      imageBuffer = Buffer.from(await response.arrayBuffer());
    } else {
      // `public/` 内の画像を処理
      const imagePath = path.join(process.cwd(), "public", src);
      if (!fs.existsSync(imagePath)) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
      }
      imageBuffer = fs.readFileSync(imagePath);
    }

    // sharp で画像を変換
    let image = sharp(imageBuffer);
    if (width > 0) {
      image = image.resize({ width });
    }
    image = image.webp({ quality });

    const transformedImage = await image.toBuffer();

    return new NextResponse(transformedImage, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}
```
