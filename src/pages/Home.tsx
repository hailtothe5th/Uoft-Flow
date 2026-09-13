import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import FacilityCard from '../components/FacilityCard';
import { FilterType, SortOption, GenderDesignation } from '../types';
import { ArrowUpDown, Filter, Search } from 'lucide-react';

export default function Home() {
  const { facilitiesWithStats, isLoading, requestLocation } = useData();
  const { isAuthenticated } = useAuth();

  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('cleanliness');
  const [genderFilter, setGenderFilter] = useState<GenderDesignation | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // New amenity and accessibility filters
  const [hasFreeMenstrualProducts, setHasFreeMenstrualProducts] = useState(false);
  const [hasBabyChangeStation, setHasBabyChangeStation] = useState(false);
  const [campusFilter, setCampusFilter] = useState<string>('');
  const [isAccessible, setIsAccessible] = useState(false);

  // Request location permission when page loads
  useEffect(() => {
    console.log('🏠 Home page loaded, requesting location...');
    requestLocation();
  }, [requestLocation]);

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

    // Filter by campus
    if (campusFilter) {
      result = result.filter((f) => f.campus === campusFilter);
    }

    // Filter by accessibility
    if (isAccessible) {
      result = result.filter((f) => f.accessible === true);
    }

    // Filter by free menstrual products (only for toilets)
    if (hasFreeMenstrualProducts) {
      result = result.filter((f) => f.hasFreeMenstrualProducts === true);
    }

    // Filter by baby change station (only for toilets)
    if (hasBabyChangeStation) {
      result = result.filter((f) => f.hasBabyChangeStation === true);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.building.toLowerCase().includes(q) ||
          f.floorNote.toLowerCase().includes(q) ||
          f.address.toLowerCase().includes(q)
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
  }, [facilitiesWithStats, filterType, sortBy, genderFilter, searchQuery, campusFilter, isAccessible, hasFreeMenstrualProducts, hasBabyChangeStation]);

  const topFacility = filteredAndSorted[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fade-in">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-uoft-blue to-uoft-blue-light dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black mb-2">
                Find Facilities
              </h1>
              <p className="text-blue-100 dark:text-slate-300 text-sm sm:text-base">
                Discover clean, accessible washrooms and water fountains on campus
              </p>
            </div>
            <div className="text-5xl sm:text-6xl animate-float">
              🚻
            </div>
          </div>
        </div>
      </div>

      {/* Top rated facility */}
      {topFacility && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">⭐</span>
            <h2 className="text-lg font-bold text-uoft-blue dark:text-white">
              Top Rated Facility
            </h2>
          </div>
          <FacilityCard facility={topFacility} />
        </div>
      )}

      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search buildings, floors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-enhanced w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base"
              aria-label="Search facilities"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-5 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 ${
              showFilters
                ? 'bg-uoft-blue dark:bg-slate-800 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-slate-800 text-uoft-blue dark:text-white hover:bg-uoft-blue/10 dark:hover:bg-slate-700 shadow-md'
            }`}
            aria-expanded={showFilters}
            aria-controls="filters-panel"
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {showFilters && (
          <div id="filters-panel" className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-blue-100 dark:border-slate-700 card-shadow animate-fade-in space-y-5">
            {/* Type filter */}
            <div>
              <label className="text-sm font-bold text-uoft-blue dark:text-white uppercase tracking-wide mb-2 block">
                Type
              </label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: 'all', label: 'All', emoji: '🏛️' },
                  { value: 'toilet', label: 'Toilets', emoji: '🚻' },
                  { value: 'fountain', label: 'Fountains', emoji: '🚰' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFilterType(opt.value as FilterType)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      filterType === opt.value
                        ? 'bg-uoft-blue dark:bg-slate-700 text-white shadow-md scale-105'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 hover:scale-105'
                    }`}
                  >
                    <span className="mr-1.5">{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender filter (only for toilets) */}
            {(filterType === 'all' || filterType === 'toilet') && (
              <div>
                <label className="text-sm font-bold text-uoft-blue dark:text-white uppercase tracking-wide mb-2 block">
                  Gender Designation
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: '', label: 'Any' },
                    { value: "Men's", label: "Men's" },
                    { value: "Women's", label: "Women's" },
                    { value: 'All-gender', label: 'All-gender' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setGenderFilter(opt.value as GenderDesignation | '')}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        genderFilter === opt.value
                          ? 'bg-uoft-blue dark:bg-slate-700 text-white shadow-md scale-105'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 hover:scale-105'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Campus filter */}
            <div>
              <label className="text-sm font-bold text-uoft-blue dark:text-white uppercase tracking-wide mb-2 block">
                Campus
              </label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: '', label: 'All Campuses' },
                  { value: 'St. George', label: 'St. George' },
                  { value: 'Scarborough', label: 'Scarborough' },
                  { value: 'Mississauga', label: 'Mississauga' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setCampusFilter(opt.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      campusFilter === opt.value
                        ? 'bg-uoft-blue dark:bg-slate-700 text-white shadow-md scale-105'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 hover:scale-105'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessibility filter */}
            <div>
              <label className="text-sm font-bold text-uoft-blue dark:text-white uppercase tracking-wide mb-3 block">
                Accessibility & Amenities
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-300 group">
                  <input
                    type="checkbox"
                    checked={isAccessible}
                    onChange={(e) => setIsAccessible(e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-uoft-blue text-uoft-blue focus:ring-2 focus:ring-uoft-blue/50 transition-all"
                  />
                  <span className="text-sm font-semibold text-gray-700 dark:text-slate-300 group-hover:text-uoft-blue dark:group-hover:text-boundless-blue-light transition-colors">
                    ♿ Accessible
                  </span>
                </label>

                {(filterType === 'all' || filterType === 'toilet') && (
                  <>
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-300 group">
                      <input
                        type="checkbox"
                        checked={hasFreeMenstrualProducts}
                        onChange={(e) => setHasFreeMenstrualProducts(e.target.checked)}
                        className="w-5 h-5 rounded border-2 border-uoft-blue text-uoft-blue focus:ring-2 focus:ring-uoft-blue/50 transition-all"
                      />
                      <span className="text-sm font-semibold text-gray-700 dark:text-slate-300 group-hover:text-uoft-blue dark:group-hover:text-boundless-blue-light transition-colors">
                        🩸 Free menstrual products
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-300 group">
                      <input
                        type="checkbox"
                        checked={hasBabyChangeStation}
                        onChange={(e) => setHasBabyChangeStation(e.target.checked)}
                        className="w-5 h-5 rounded border-2 border-uoft-blue text-uoft-blue focus:ring-2 focus:ring-uoft-blue/50 transition-all"
                      />
                      <span className="text-sm font-semibold text-gray-700 dark:text-slate-300 group-hover:text-uoft-blue dark:group-hover:text-boundless-blue-light transition-colors">
                        👶 Baby change station
                      </span>
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Clear filters button */}
            {(filterType !== 'all' || genderFilter || campusFilter || isAccessible || hasFreeMenstrualProducts || hasBabyChangeStation) && (
              <button
                onClick={() => {
                  setFilterType('all');
                  setGenderFilter('');
                  setCampusFilter('');
                  setIsAccessible(false);
                  setHasFreeMenstrualProducts(false);
                  setHasBabyChangeStation(false);
                }}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 text-gray-700 dark:text-slate-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                ✨ Clear All Filters
              </button>
            )}

            {/* Sort */}
            <div>
              <label className="text-sm font-bold text-uoft-blue dark:text-white uppercase tracking-wide mb-2 block">
                Sort by
              </label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: 'distance', label: '📍 Distance' },
                  { value: 'cleanliness', label: '✨ Cleanliness' },
                  { value: 'rating', label: '⭐ Rating' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value as SortOption)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      sortBy === opt.value
                        ? 'bg-gradient-to-r from-amber-accent to-amber-light text-uoft-blue-dark shadow-md scale-105'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 hover:scale-105'
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
          <ArrowUpDown className="w-4 h-4 text-gray-400 dark:text-slate-500" />
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
                    ? 'bg-uoft-blue dark:bg-slate-800 text-white'
                    : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-400 dark:text-slate-500 ml-auto">
            {filteredAndSorted.length} facilit{filteredAndSorted.length !== 1 ? 'ies' : 'y'}
          </span>
        </div>
      </div>

      {/* Facility list */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-5 card-shadow border border-blue-100 dark:border-slate-700 skeleton">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gray-200 dark:bg-slate-700 rounded-2xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full" />
                </div>
              </div>
            </div>
          ))
        ) : filteredAndSorted.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl card-shadow border border-blue-100 dark:border-slate-700 animate-fade-in">
            <p className="text-6xl mb-4 animate-float">🔍</p>
            <p className="text-xl font-bold text-uoft-blue dark:text-white mb-2">No facilities found</p>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : "Try adjusting your filters or search terms"}
            </p>
            {(searchQuery || filterType !== 'all' || genderFilter) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                  setGenderFilter('');
                }}
                className="px-6 py-3 bg-gradient-to-r from-uoft-blue to-uoft-blue-light dark:from-slate-700 dark:to-slate-600 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all duration-300"
              >
                ✨ Clear all filters
              </button>
            )}
          </div>
        ) : (
          filteredAndSorted.map((facility, index) => (
            <div key={facility.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <FacilityCard facility={facility} />
            </div>
          ))
        )}
      </div>

      {/* Add CTA */}
      <div className="mt-10 text-center bg-gradient-to-br from-uoft-blue to-uoft-blue-light dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 shadow-2xl">
        <p className="text-4xl mb-3 animate-float">🚻</p>
        {isAuthenticated ? (
          <>
            <p className="text-xl font-bold text-white mb-2">Help your fellow students!</p>
            <p className="text-sm text-blue-100 dark:text-slate-300 mb-5">
              Add a review or a new location to the campus map
            </p>
            <Link
              to="/contribute"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-accent to-amber-light text-uoft-blue-dark rounded-2xl font-bold text-base hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              ✍️ Contribute Now
            </Link>
          </>
        ) : (
          <>
            <p className="text-xl font-bold text-white mb-2">Know a facility we're missing?</p>
            <p className="text-sm text-blue-100 dark:text-slate-300 mb-5">
              Sign in to add new locations and leave reviews
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-accent to-amber-light text-uoft-blue-dark rounded-2xl font-bold text-base hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Sign in to contribute
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
