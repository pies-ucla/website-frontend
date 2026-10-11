"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import styles from "./LoadingImage.module.css";

// next/image that shows a shimmer placeholder until the image has loaded, then fades it in.
// The shimmer is drawn as the img's own background, so it doesn't change the layout
const LoadingImage = ({ alt, className = "", onLoad, onError, ...props }: ImageProps) => {
  // remember which src finished loading so the shimmer comes back when src changes (e.g. the carousel)
  const [loadedSrc, setLoadedSrc] = useState<ImageProps["src"] | null>(null);
  const loaded = loadedSrc === props.src;

  return (
    <Image
      {...props}
      alt={alt}
      className={`${className} ${loaded ? styles.loaded : styles.loading}`}
      onLoad={(e) => {
        setLoadedSrc(props.src);
        onLoad?.(e);
      }}
      onError={(e) => {
        setLoadedSrc(props.src);
        onError?.(e);
      }}
    />
  );
};

export default LoadingImage;
