import Image, { type ImageProps } from "next/image";

import { asset } from "@/core/config/base-path";

// next/image does not prepend basePath to unoptimized static-export sources, so every local
// image path is resolved through asset() here. Drop-in replacement for next/image.
export function AssetImage({ src, alt, ...props }: ImageProps) {
  const resolved = typeof src === "string" ? asset(src) : src;
  return <Image src={resolved} alt={alt} {...props} />;
}
