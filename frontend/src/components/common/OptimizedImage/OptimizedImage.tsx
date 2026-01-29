import { type ImgHTMLAttributes, useState } from "react";
import { cn } from "../../../utils/cn";

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Width in px (avoids layout shift) */
  width?: number;
  /** Height in px (avoids layout shift) */
  height?: number;
  /** Optional low-res placeholder while loading */
  placeholder?: string;
  /** Object fit: cover | contain */
  objectFit?: "cover" | "contain";
}

/**
 * Image with lazy loading, async decoding, and optional dimensions to avoid layout shift.
 * Use for dashboard/chart images or any img that benefits from optimization.
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  placeholder,
  objectFit = "cover",
  className,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <span className={cn("relative block overflow-hidden", className)}>
      {placeholder && !loaded && (
        <span
          className="absolute inset-0 animate-pulse bg-[var(--color-border)]"
          aria-hidden
        />
      )}
      <img
        src={src}
        alt={alt ?? ""}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        onLoad={() => setLoaded(true)}
        className={cn(
          loaded ? "opacity-100" : "opacity-0",
          "transition-opacity duration-200",
          objectFit === "cover" && "object-cover",
          objectFit === "contain" && "object-contain",
          width != null && height != null && "h-full w-full"
        )}
        style={
          width != null && height != null
            ? { aspectRatio: `${width} / ${height}` }
            : undefined
        }
        {...props}
      />
    </span>
  );
}
