import { getOptimizedImageUrl } from "./get-optimized-image-url";

interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudflareImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  return getOptimizedImageUrl(src, { width, quality });
}
