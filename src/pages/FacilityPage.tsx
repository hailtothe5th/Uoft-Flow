import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import RatingDisplay from '../components/RatingDisplay';
import { formatDistance, estimateWalkingTime } from '../utils/distance';
import {
  ArrowLeft,
  MapPin,
  Accessibility,
  Droplets,
  Thermometer,
  ExternalLink,
  Clock,
} from 'lucide-react';

export default function FacilityPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { facilitiesWithStats, reviews, userLocation } = useData();

  const facility = facilitiesWithStats.find((f) => f.id === id);
  const facilityReviews = useMemo(
    () => reviews.filter((r) => r.facilityId === id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [reviews, id]
  );

  if (!facility) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-4xl mb-3">🤷</p>
        <p className="text-xl font-bold text-uoft-blue dark:text-white mb-2">Facility not found</p>
        <Link to="/" className="text-amber-accent font-semibold hover:underline">
          ← Back to facilities
        </Link>
      </div>
    );
  }

  const cleanlinessColor =
    facility.avgCleanliness >= 4
      ? 'text-clean-green'
      : facility.avgCleanliness >= 3
      ? 'text-amber-accent'
      : facility.avgCleanliness >= 2
      ? 'text-warn-orange'
      : 'text-bad-red';

  const cleanlinessBarColor =
    facility.avgCleanliness >= 4
      ? 'bg-clean-green'
      : facility.avgCleanliness >= 3
      ? 'bg-amber-accent'
      : facility.avgCleanliness >= 2
      ? 'bg-warn-orange'
      : 'bg-bad-red';

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${facility.lat},${facility.lng}`;

  const conditionEmoji = (condition: string) => {
    switch (condition) {
      case 'Excellent': return '✨';
      case 'Good': return '👍';
      case 'Needs attention': return '⚠️';
      case 'Out of order': return '🚫';
      default: return '❓';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400 hover:text-uoft-blue dark:hover:text-white font-semibold mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Facility header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 card-shadow border border-blue-100 dark:border-slate-700 mb-6">
        <div className="flex items-start gap-4">
          <span className="text-5xl">{facility.type === 'toilet' ? '🚻' : '🚰'}</span>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-black text-uoft-blue dark:text-white mb-1">{facility.name}</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {facility.building} • {facility.floorNote}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {facility.genderDesignation && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-uoft-blue dark:text-blue-300">
                  {facility.genderDesignation}
                </span>
              )}
              {facility.accessible && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                  <Accessibility className="w-3 h-3" />
                  Accessible
                </span>
              )}
              {facility.type === 'fountain' && facility.hasBottleFiller && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300">
                  <Droplets className="w-3 h-3" />
                  Bottle filler
                </span>
              )}
              {facility.type === 'fountain' && facility.hasChilled && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300">
                  <Thermometer className="w-3 h-3" />
                  Chilled
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-slate-700 rounded-xl">
            <p className="text-xs text-gray-500 dark:text-slate-400 font-semibold mb-1">Overall Rating</p>
            {facility.avgRating > 0 ? (
              <RatingDisplay rating={facility.avgRating} type={facility.type} size="md" />
            ) : (
              <p className="text-lg text-gray-400 dark:text-slate-500">—</p>
            )}
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-slate-700 rounded-xl">
            <p className="text-xs text-gray-500 dark:text-slate-400 font-semibold mb-1">Cleanliness</p>
            <p className={`text-2xl font-black ${cleanlinessColor}`}>
              {facility.avgCleanliness > 0 ? facility.avgCleanliness.toFixed(1) : '—'}
              <span className="text-sm text-gray-400 dark:text-slate-500">/5</span>
            </p>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-slate-700 rounded-xl">
            <p className="text-xs text-gray-500 dark:text-slate-400 font-semibold mb-1">Reviews</p>
            <p className="text-2xl font-black text-uoft-blue dark:text-white">{facility.reviewCount}</p>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-slate-700 rounded-xl">
            <p className="text-xs text-gray-500 dark:text-slate-400 font-semibold mb-1">Distance</p>
            {facility.distance !== undefined ? (
              <>
                <p className="text-lg font-black text-uoft-blue dark:text-white">
                  {formatDistance(facility.distance)}
                </p>
                <p className="text-xs text-gray-400 dark:text-slate-500">{estimateWalkingTime(facility.distance)}</p>
              </>
            ) : (
              <p className="text-lg text-gray-400 dark:text-slate-500">—</p>
            )}
          </div>
        </div>

        {/* Cleanliness bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-gray-500 dark:text-slate-400">Cleanliness Score</span>
            <span className={`text-xs font-bold ${cleanlinessColor}`}>
              {facility.avgCleanliness > 0 ? `${((facility.avgCleanliness / 5) * 100).toFixed(0)}%` : 'No data'}
            </span>
          </div>
          <div className="cleanliness-bar">
            <div
              className={`cleanliness-fill ${cleanlinessBarColor}`}
              style={{ width: `${(facility.avgCleanliness / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Google Maps link */}
        <div className="mt-4">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-uoft-blue dark:bg-slate-700 text-white rounded-xl text-sm font-semibold hover:bg-uoft-blue-light dark:hover:bg-slate-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open in Google Maps
          </a>
        </div>
      </div>

      {/* Write review CTA */}
      <div className="mb-6">
        <Link
          to={`/submit?facility=${id}`}
          className="block w-full bg-amber-accent text-uoft-blue-dark rounded-2xl p-4 text-center font-bold hover:bg-amber-light transition-colors card-shadow"
        >
          ✍️ Write a Review
        </Link>
      </div>

      {/* Reviews */}
      <div>
        <h2 className="text-lg font-black text-uoft-blue dark:text-white mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Reviews ({facilityReviews.length})
        </h2>

        {facilityReviews.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center card-shadow border border-blue-100 dark:border-slate-700">
            <p className="text-3xl mb-2">📝</p>
            <p className="text-gray-500 dark:text-slate-400 font-semibold">No reviews yet</p>
            <p className="text-sm text-gray-400 dark:text-slate-500">Be the first to review this facility!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {facilityReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 card-shadow border border-blue-100 dark:border-slate-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-uoft-blue dark:bg-slate-700 flex items-center justify-center text-white text-sm font-bold">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-uoft-blue dark:text-white">{review.userName}</p>
                        <p className="text-xs text-gray-400 dark:text-slate-500">
                          {new Date(review.createdAt).toLocaleDateString('en-CA', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      <RatingDisplay
                        rating={review.overallRating}
                        type={facility.type}
                        size="sm"
                      />
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        review.condition === 'Excellent' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                        review.condition === 'Good' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                        review.condition === 'Needs attention' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      }`}>
                        {conditionEmoji(review.condition)} {review.condition}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 mb-2">
                      <span>Cleanliness: <strong>{review.cleanlinessRating}/5</strong></span>
                    </div>

                    {review.comment && (
                      <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
