import { Star } from 'lucide-react';
import type { Ability } from '../../types';

interface StarRatingProps {
  value: Ability;
  className?: string;
}

export function StarRating({ value, className = '' }: StarRatingProps) {
  const fullStars = Math.floor(value);
  const hasHalfStar = value - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
          size={16}
        />
      ))}
      {hasHalfStar && (
        <div className="relative w-4 h-4">
          <Star
            className="w-4 h-4 text-yellow-400"
            size={16}
          />
          <div className="absolute inset-0 overflow-hidden w-2">
            <Star
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
              size={16}
            />
          </div>
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-300"
          size={16}
        />
      ))}
    </div>
  );
}

