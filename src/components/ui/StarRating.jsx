import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

const StarRating = ({ rating, totalStars = 5, size = 'h-5 w-5', className, showValue = true }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={cn(size, "text-yellow-400 fill-yellow-400")} />
        ))}
        {halfStar && <StarHalf key="half" className={cn(size, "text-yellow-400 fill-yellow-400")} />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={cn(size, "text-gray-300 dark:text-gray-600")} />
        ))}
      </div>
      {showValue && <span className="font-bold text-sm text-muted-foreground">{rating.toFixed(1)}</span>}
    </div>
  );
};

export default StarRating;