import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({ rating, size = 14, className }: { rating: number; size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${rating} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={i + 1 <= Math.round(rating) ? "fill-star text-star" : "text-border fill-border"}
        />
      ))}
    </span>
  );
}
