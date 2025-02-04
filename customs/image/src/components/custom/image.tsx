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
