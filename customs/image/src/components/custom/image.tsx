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
          "rounded-md shadow-black/5 shadow-none group relative overflow-hidden bg-zinc-50 dark:bg-content2",
          !isLoaded &&
            !hasError &&
            "before:opacity-100 before:absolute before:inset-0 before:z-10 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-zinc-100/50 before:to-transparent",
          !isLoaded &&
            !hasError &&
            "after:opacity-100 after:absolute after:inset-0 after:-z-10 after:bg-zinc-50 after:rounded-md",
          !width && !height ? "max-w-full h-auto" : "overflow-hidden",
          classNames?.base
        )}
        style={{
          width: width,
          height: height,
        }}
      >
        {!isLoaded && (
          <NextImage
            alt={alt}
            src={src}
            fill={!(width && height)}
            width={width}
            height={height}
            style={{
              height: height,
            }}
            className={cn(
              "absolute inset-0 z-0 w-full h-full object-cover",
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
            // src={hasError ? "/placeholder.png" : src || "/placeholder.png"}
            src={src}
            fill={!(width && height)}
            width={width}
            height={height}
            style={{
              height: height,
            }}
            className={cn(
              "!relative z-10 shadow-black/5 data-[loaded=true]:opacity-100 shadow-none opacity-0 transition-transform-opacity motion-reduce:transition-none !duration-300 rounded-md",
              className,
              classNames?.img
            )}
            data-loaded={isLoaded}
            fetchPriority="low"
            decoding="async"
            loading={loading}
            loader={imageLoader}
            onLoad={() => setIsLoaded(true)}
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
