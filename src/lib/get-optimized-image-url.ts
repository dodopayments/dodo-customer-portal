interface ImageOptimizationOptions {
  width?: number;
  quality?: number;
  format?: "auto" | "webp" | "avif" | "json";
  fit?: "scale-down" | "contain" | "cover" | "crop" | "pad";
}

const DEFAULT_OPTIONS: ImageOptimizationOptions = {
  quality: 75,
  format: "auto",
  fit: "scale-down",
};

/**
 * Generates a Cloudflare Image Resizing URL for any image source.
 * Works with local images (/path) and external URLs (https://...).
 */
export function getOptimizedImageUrl(
  src: string,
  options: ImageOptimizationOptions = {}
): string {
  // Skip in development (CF Image Resizing not available locally)
  if (process.env.NODE_ENV !== "production") {
    return src;
  }

  // Skip SVGs - they don't need raster optimization
  if (src.endsWith(".svg")) {
    if (src.startsWith("http://") || src.startsWith("https://")) {
      return src;
    }
    return src.startsWith("/") ? src : `/${src}`;
  }

  // Skip data URLs
  if (src.startsWith("data:")) {
    return src;
  }

  // Filter out undefined values before merging with defaults
  const cleanOptions = Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined)
  );
  const { width, quality, format, fit } = {
    ...DEFAULT_OPTIONS,
    ...cleanOptions,
  };

  // Build CF Image Resizing params
  const params = [
    width && `width=${width}`,
    `quality=${quality}`,
    `format=${format}`,
    fit && `fit=${fit}`,
  ]
    .filter(Boolean)
    .join(",");

  // External URLs - proxy through CF Image Resizing
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return `/cdn-cgi/image/${params}/${src}`;
  }

  // Local images
  if (src.startsWith("/")) {
    return `/cdn-cgi/image/${params}${src}`;
  }

  return src;
}
