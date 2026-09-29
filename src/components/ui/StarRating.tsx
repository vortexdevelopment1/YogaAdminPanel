// Star rating visual component displaying 1 to 5 filled and unfilled stars

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({ rating, size = "sm" }: StarRatingProps) {
  const roundedRating = Math.round(rating);
  const sizeClasses =
    size === "lg"
      ? "w-5 h-5"
      : size === "md"
      ? "w-4 h-4"
      : "w-3.5 h-3.5";

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= roundedRating;
        return (
          <Star
            key={star}
            className={`${sizeClasses} ${
              isFilled
                ? "fill-[#E0B45A] text-[#E0B45A]"
                : "fill-transparent text-sand/80"
            }`}
          />
        );
      })}
    </div>
  );
}
