/**
 * Custom image loader for Cloudflare Pages
 * Uses Cloudflare's Image Resizing service when available
 * Falls back to the original URL if not on Cloudflare
 */

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
  // SVGs don't support image transformations - serve directly
  if (src.endsWith(".svg")) {
    return src.startsWith("/") ? src : `/${src}`;
  }

  const params = [`width=${width}`, `quality=${quality || 75}`, "format=auto"];

  // External URLs - use Cloudflare Image Resizing
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return `/cdn-cgi/image/${params.join(",")}/${src}`;
  }

  // Local images - use Cloudflare Image Resizing
  if (src.startsWith("/")) {
    return `/cdn-cgi/image/${params.join(",")}${src}`;
  }

  // Fallback: return as-is
  return src;
}
