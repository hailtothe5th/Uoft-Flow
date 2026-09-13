import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { FacilityWithStats } from '../types';
import RatingDisplay from './RatingDisplay';
import { MapPin, Accessibility, Droplets, Thermometer, Navigation } from 'lucide-react';
import { formatDistance, estimateWalkingTime } from '../utils/distance';

interface FacilityCardProps {
  facility: FacilityWithStats;
}

export default memo(function FacilityCard({ facility }: FacilityCardProps) {
  const cleanlinessColor =
    facility.avgCleanliness >= 4
      ? 'bg-clean-green'
      : facility.avgCleanliness >= 3
      ? 'bg-warn-orange'
      : facility.avgCleanliness >= 2
      ? 'bg-warn-orange'
      : 'bg-bad-red';

  const cleanlinessWidth = (facility.avgCleanliness / 5) * 100;

  return (
    <Link
      to={`/facility/${facility.id}`}
      className="block bg-white dark:bg-slate-800 rounded-3xl p-5 card-shadow card-shadow-hover transition-all duration-300 border border-blue-100/50 dark:border-slate-700 group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
              {facility.type === 'toilet' ? '🚻' : '🚰'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-uoft-blue dark:text-white text-base sm:text-lg truncate group-hover:text-boundless-blue dark:group-hover:text-boundless-blue-light transition-colors">
                {facility.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{facility.building} • {facility.floorNote}</span>
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {facility.campus && (
              <span className="tag bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-700/50">
                🎓 {facility.campus}
              </span>
            )}
            {facility.genderDesignation && (
              <span className="tag bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 text-uoft-blue dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50">
                {facility.genderDesignation}
              </span>
            )}
            {facility.accessible && (
              <span className="tag bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40 text-green-700 dark:text-green-300 border border-green-200/50 dark:border-green-700/50">
                <Accessibility className="w-3.5 h-3.5" />
                Accessible
              </span>
            )}
            {facility.type === 'fountain' && facility.hasBottleFiller && (
              <span className="tag bg-gradient-to-r from-cyan-50 to-cyan-100 dark:from-cyan-900/40 dark:to-cyan-800/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200/50 dark:border-cyan-700/50">
                <Droplets className="w-3.5 h-3.5" />
                Bottle filler
              </span>
            )}
            {facility.type === 'fountain' && facility.hasChilled && (
              <span className="tag bg-gradient-to-r from-sky-50 to-sky-100 dark:from-sky-900/40 dark:to-sky-800/40 text-sky-700 dark:text-sky-300 border border-sky-200/50 dark:border-sky-700/50">
                <Thermometer className="w-3.5 h-3.5" />
                Chilled
              </span>
            )}
            {facility.type === 'toilet' && facility.hasFreeMenstrualProducts && (
              <span className="tag bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/40 dark:to-pink-800/40 text-pink-700 dark:text-pink-300 border border-pink-200/50 dark:border-pink-700/50">
                🩸 Free menstrual products
              </span>
            )}
            {facility.type === 'toilet' && facility.hasBabyChangeStation && (
              <span className="tag bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/40 dark:to-amber-800/40 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-700/50">
                👶 Baby change station
              </span>
            )}
          </div>

          {/* Cleanliness bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 dark:text-slate-400 font-semibold w-16">Clean</span>
            <div className="cleanliness-bar flex-1">
              <div
                className={`cleanliness-fill ${cleanlinessColor}`}
                style={{ width: `${cleanlinessWidth}%` }}
              />
            </div>
            <span className="text-sm font-bold text-gray-700 dark:text-slate-200 w-10 text-right">
              {facility.avgCleanliness > 0 ? facility.avgCleanliness.toFixed(1) : '—'}
            </span>
          </div>
        </div>

        {/* Right side: rating, distance, and review count */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {facility.avgRating > 0 && (
            <div className="group-hover:scale-105 transition-transform duration-300">
              <RatingDisplay rating={facility.avgRating} type={facility.type} size="sm" />
            </div>
          )}
          {facility.distance !== undefined && (
            <div className="flex items-center gap-1.5 text-sm text-uoft-blue dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">
              <Navigation className="w-3.5 h-3.5" />
              <span className="font-bold">{formatDistance(facility.distance)}</span>
              <span className="text-xs text-gray-500 dark:text-slate-400">
                {estimateWalkingTime(facility.distance)}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400 mt-1">
            <span className="font-semibold">{facility.reviewCount}</span>
            <span>review{facility.reviewCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </Link>
  );
});
