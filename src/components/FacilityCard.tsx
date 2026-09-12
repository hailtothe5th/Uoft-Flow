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
      ? 'bg-clean-green'
      : facility.avgCleanliness >= 3
      ? 'bg-amber-accent'
      : facility.avgCleanliness >= 2
      ? 'bg-warn-orange'
      : 'bg-bad-red';

  const cleanlinessWidth = (facility.avgCleanliness / 5) * 100;

  return (
    <Link
      to={`/facility/${facility.id}`}
      className="block bg-white rounded-2xl p-4 card-shadow card-shadow-hover transition-all duration-200 border border-blue-100/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{facility.type === 'toilet' ? '🚻' : '🚰'}</span>
            <h3 className="font-bold text-uoft-blue text-sm sm:text-base truncate">
              {facility.name}
            </h3>
          </div>
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {facility.building} • {facility.floorNote}
          </p>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            {facility.genderDesignation && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-uoft-blue">
                {facility.genderDesignation}
              </span>
            )}
            {facility.accessible && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                <Accessibility className="w-3 h-3" />
                Accessible
              </span>
            )}
            {facility.type === 'fountain' && facility.hasBottleFiller && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700">
                <Droplets className="w-3 h-3" />
                Bottle filler
              </span>
            )}
            {facility.type === 'fountain' && facility.hasChilled && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700">
                <Thermometer className="w-3 h-3" />
                Chilled
              </span>
            )}
          </div>

          {/* Cleanliness bar */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium w-16">Clean</span>
            <div className="cleanliness-bar flex-1">
              <div
                className={`cleanliness-fill ${cleanlinessColor}`}
                style={{ width: `${cleanlinessWidth}%` }}
              />
            </div>
            <span className="text-xs font-bold text-gray-600 w-8">
              {facility.avgCleanliness > 0 ? facility.avgCleanliness.toFixed(1) : '—'}
            </span>
          </div>
        </div>

        {/* Right side: rating and distance */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          {facility.avgRating > 0 && (
            <RatingDisplay rating={facility.avgRating} type={facility.type} size="sm" />
          )}
          {facility.distance !== undefined && (
            <div className="text-right">
              <p className="text-sm font-bold text-uoft-blue">{formatDistance(facility.distance)}</p>
              <p className="text-xs text-gray-400">{estimateWalkingTime(facility.distance)}</p>
            </div>
          )}
          <p className="text-xs text-gray-400 mt-1">
            {facility.reviewCount} review{facility.reviewCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </Link>
  );
});
