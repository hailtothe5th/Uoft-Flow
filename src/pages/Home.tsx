import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import FacilityCard from '../components/FacilityCard';
import { FilterType, SortOption, GenderDesignation } from '../types';
import { MapPin, Navigation, ArrowUpDown, Filter, Search } from 'lucide-react';

export default function Home() {
  const { facilitiesWithStats, userLocation, locationError, requestLocation } = useData();
  const { isAuthenticated } = useAuth();

  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('distance');
  const [genderFilter, setGenderFilter] = useState<GenderDesignation | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!userLocation && !locationError) {
      requestLocation();
    }
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = [...facilitiesWithStats];

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter((f) => f.type === filterType);
    }

    // Filter by gender (only for toilets)
    if (genderFilter) {
      result = result.filter((f) => f.genderDesignation === genderFilter);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.building.toLowerCase().includes(q) ||
          f.floorNote.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'distance') {
      result.sort((a, b) => {
        if (a.distance === undefined && b.distance === undefined) return 0;
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      });
    } else if (sortBy === 'cleanliness') {
      result.sort((a, b) => b.avgCleanliness - a.avgCleanliness);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.avgRating - a.avgRating);
    }

    return result;
  }, [facilitiesWithStats, filterType, sortBy, genderFilter, searchQuery]);

  const nearestFacility = filteredAndSorted[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Location status */}
      <div className="mb-4">
        {userLocation ? (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-xl">
            <Navigation className="w-4 h-4" />
            <span>Location detected — showing nearest facilities</span>
          </div>
        ) : locationError ? (
          <div className="flex items-center justify-between gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-xl">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location unavailable — sorted alphabetically
            </span>
            <button
              onClick={requestLocation}
              className="px-2 py-1 bg-amber-accent text-uoft-blue-dark rounded-lg text-xs font-bold hover:bg-amber-light transition-colors"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-xl">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-uoft-blue rounded-full animate-spin" />
            <span>Detecting your location...</span>
          </div>
        )}
      </div>

      {/* Nearest facility highlight */}
      {nearestFacility && userLocation && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-uoft-blue mb-2 flex items-center gap-1">
            <span className="text-lg">📍</span> Nearest to you
          </h2>
          <FacilityCard facility={nearestFacility} />
        </div>
      )}

      {/* Search and filters */}
      <div className="mb-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search buildings, floors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-1 transition-colors ${
              showFilters
                ? 'bg-uoft-blue text-white border-uoft-blue'
                : 'bg-white border-blue-200 text-uoft-blue hover:bg-blue-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-xl p-4 border border-blue-100 card-shadow space-y-3">
            {/* Type filter */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Type</label>
              <div className="flex gap-2 mt-1">
                {[
                  { value: 'all', label: 'All', emoji: '🏛️' },
                  { value: 'toilet', label: 'Toilets', emoji: '🚻' },
                  { value: 'fountain', label: 'Fountains', emoji: '🚰' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFilterType(opt.value as FilterType)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                      filterType === opt.value
                        ? 'bg-uoft-blue text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {opt.emoji} {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender filter (only for toilets) */}
            {(filterType === 'all' || filterType === 'toilet') && (
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Gender Designation
                </label>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {[
                    { value: '', label: 'Any' },
                    { value: "Men's", label: "Men's" },
                    { value: "Women's", label: "Women's" },
                    { value: 'All-gender', label: 'All-gender' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setGenderFilter(opt.value as GenderDesignation | '')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                        genderFilter === opt.value
                          ? 'bg-uoft-blue text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sort */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Sort by
              </label>
              <div className="flex gap-2 mt-1">
                {[
                  { value: 'distance', label: '📏 Distance' },
                  { value: 'cleanliness', label: '✨ Cleanliness' },
                  { value: 'rating', label: '⭐ Rating' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value as SortOption)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                      sortBy === opt.value
                        ? 'bg-amber-accent text-uoft-blue-dark'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick sort buttons */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-400" />
          <div className="flex gap-1">
            {[
              { value: 'distance', label: 'Distance' },
              { value: 'cleanliness', label: 'Cleanliness' },
              { value: 'rating', label: 'Rating' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value as SortOption)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  sortBy === opt.value
                    ? 'bg-uoft-blue text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-400 ml-auto">
            {filteredAndSorted.length} facilit{filteredAndSorted.length !== 1 ? 'ies' : 'y'}
          </span>
        </div>
      </div>

      {/* Facility list */}
      <div className="space-y-3">
        {filteredAndSorted.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500 font-semibold">No facilities found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          filteredAndSorted.map((f) => <FacilityCard key={f.id} facility={f} />)
        )}
      </div>

      {/* Add CTA */}
      <div className="mt-8 text-center bg-white rounded-2xl p-6 card-shadow border border-blue-100">
        <p className="text-2xl mb-2">🚻</p>
        {isAuthenticated ? (
          <>
            <p className="font-bold text-uoft-blue">Help your fellow students!</p>
            <p className="text-sm text-gray-500 mb-3">
              Add a review or a new location to the campus map
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                to="/submit"
                className="inline-flex items-center gap-1 px-4 py-2 bg-amber-accent text-uoft-blue-dark rounded-xl font-bold text-sm hover:bg-amber-light transition-colors"
              >
                ✍️ Write a Review
              </Link>
              <Link
                to="/add"
                className="inline-flex items-center gap-1 px-4 py-2 bg-uoft-blue text-white rounded-xl font-bold text-sm hover:bg-uoft-blue-light transition-colors"
              >
                📍 Add a Location
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="font-bold text-uoft-blue">Know a facility we're missing?</p>
            <p className="text-sm text-gray-500 mb-3">
              Sign in to add new locations and leave reviews
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-1 px-4 py-2 bg-amber-accent text-uoft-blue-dark rounded-xl font-bold text-sm hover:bg-amber-light transition-colors"
            >
              Sign in to contribute
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
