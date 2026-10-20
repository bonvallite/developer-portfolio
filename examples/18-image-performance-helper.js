// Generic responsive image markup helper for trusted, local media paths.
export function imageProps(src, alt, width, height) {
  if (!src.startsWith("/") || src.startsWith("//")) throw Error("Use local image paths");
  if (!(width > 0 && height > 0)) throw Error("Dimensions required");
  return { src, alt: String(alt), width, height, loading: "lazy", decoding: "async" };
}
