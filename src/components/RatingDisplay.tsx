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

  return (
    <div className={`flex items-center gap-0.5 ${sizeClass}`}>
      {Array.from({ length: maxStars }, (_, i) => (
        <span
          key={i}
          className={i < fullStars ? '' : i === fullStars && hasHalf ? 'opacity-60' : 'opacity-20'}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}
