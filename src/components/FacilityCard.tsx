import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { FacilityWithStats } from '../types';
import RatingDisplay from './RatingDisplay';
import { formatDistance, estimateWalkingTime } from '../utils/distance';
import { MapPin, Accessibility, Droplets, Thermometer } from 'lucide-react';

interface FacilityCardProps {
  facility: FacilityWithStats;
}

export default memo(function FacilityCard({ facility }: FacilityCardProps) {
  const cleanlinessColor =
    facility.avgCleanliness >= 4
      ? 'bg-success'
      : facility.avgCleanliness >= 3
      ? 'bg-warning'
      : facility.avgCleanliness >= 2
      ? 'bg-warning'
      : 'bg-error';

  const cleanlinessWidth = (facility.avgCleanliness / 5) * 100;

  return (
    <Link
      to={`/facility/${facility.id}`}
      className="block card group hover:scale-[1.01]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              {facility.type === 'toilet' ? '🚻' : '🚰'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[var(--text-primary)] text-base truncate">
                {facility.name}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {facility.building} • {facility.floorNote}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {facility.genderDesignation && (
              <span className="badge bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                {facility.genderDesignation}
              </span>
            )}
            {facility.accessible && (
              <span className="badge badge-success">
                <Accessibility className="w-3 h-3" />
                Accessible
              </span>
            )}
            {facility.type === 'fountain' && facility.hasBottleFiller && (
              <span className="badge badge-info">
                <Droplets className="w-3 h-3" />
                Bottle filler
              </span>
            )}
            {facility.type === 'fountain' && facility.hasChilled && (
              <span className="badge badge-info">
                <Thermometer className="w-3 h-3" />
                Chilled
              </span>
            )}
          </div>

          {/* Cleanliness bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-[var(--text-secondary)] w-16">Clean</span>
            <div className="cleanliness-bar flex-1">
              <div
                className={`cleanliness-fill ${cleanlinessColor}`}
                style={{ width: `${cleanlinessWidth}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-[var(--text-primary)] w-8">
              {facility.avgCleanliness > 0 ? facility.avgCleanliness.toFixed(1) : '—'}
            </span>
          </div>
        </div>

        {/* Right side: rating and distance */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {facility.avgRating > 0 && (
            <RatingDisplay rating={facility.avgRating} type={facility.type} size="sm" />
          )}
          {facility.distance !== undefined && (
            <div className="text-right">
              <p className="text-base font-semibold text-uoft-blue">{formatDistance(facility.distance)}</p>
              <p className="text-xs text-[var(--text-secondary)]">{estimateWalkingTime(facility.distance)}</p>
            </div>
          )}
          <p className="text-xs text-[var(--text-tertiary)] mt-1">
            {facility.reviewCount} review{facility.reviewCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </Link>
  );
});
