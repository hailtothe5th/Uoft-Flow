import React from 'react';
import { FacilityType } from '../types';

interface RatingDisplayProps {
  rating: number;
  type: FacilityType;
  size?: 'sm' | 'md' | 'lg';
}

export default function RatingDisplay({ rating, type, size = 'md' }: RatingDisplayProps) {
  const emoji = type === 'toilet' ? '💩' : '💧';
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const maxStars = 5;

  const sizeClass = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
  }[size];

  const ratingText = type === 'toilet' 
    ? `${rating.toFixed(1)} out of 5 poop rating`
    : `${rating.toFixed(1)} out of 5 drop rating`;

  return (
    <div 
      className={`flex items-center gap-0.5 ${sizeClass}`}
      role="img"
      aria-label={ratingText}
    >
      {Array.from({ length: maxStars }, (_, i) => (
        <span
          key={i}
          className={i < fullStars ? '' : i === fullStars && hasHalf ? 'opacity-60' : 'opacity-20'}
          aria-hidden="true"
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}
