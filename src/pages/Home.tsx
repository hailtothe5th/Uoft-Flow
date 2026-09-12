import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import FacilityCard from '../components/FacilityCard';
import SetupBanner from '../components/SetupBanner';
import { FilterType, SortOption, GenderDesignation } from '../types';
import { ArrowUpDown, Filter, Search } from 'lucide-react';

export default function Home() {
  const { facilitiesWithStats, supabaseConnected, isLoading } = useData();
  const { isAuthenticated } = useAuth();

  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('cleanliness');
  const [genderFilter, setGenderFilter] = useState<GenderDesignation | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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
          f.floorNote.toLowerCase().includes(q) ||
          f.address.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'cleanliness') {
      result.sort((a, b) => b.avgCleanliness - a.avgCleanliness);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.avgRating - a.avgRating);
    }

    return result;
  }, [facilitiesWithStats, filterType, sortBy, genderFilter, searchQuery]);

  const topFacility = filteredAndSorted[0];

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Setup banner */}
      {!isLoading && !supabaseConnected && <SetupBanner />}

      {/* Top rated facility */}
      {topFacility && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-uoft-blue dark:text-white mb-2 flex items-center gap-1">
            <span className="text-lg">⭐</span> Top Rated Facility
          </h2>
          <FacilityCard facility={topFacility} />
        </div>
      )}

      {/* Search and filters */}
      <div className="mb-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search buildings, floors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent"
              aria-label="Search facilities"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-1 transition-colors ${
              showFilters
                ? 'bg-uoft-blue dark:bg-slate-800 text-white border-uoft-blue dark:border-slate-700'
                : 'bg-white dark:bg-slate-800 border-blue-200 dark:border-slate-700 text-uoft-blue dark:text-white hover:bg-blue-50 dark:hover:bg-slate-700'
            }`}
            aria-expanded={showFilters}
            aria-controls="filters-panel"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div id="filters-panel" className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-blue-100 dark:border-slate-700 card-shadow space-y-3">
            {/* Type filter */}
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Type</label>
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
                        ? 'bg-uoft-blue dark:bg-slate-700 text-white'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
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
                <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">
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
                          ? 'bg-uoft-blue dark:bg-slate-700 text-white'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
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
              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                Sort by
              </label>
              <div className="flex gap-2 mt-1">
                {[
                  { value: 'cleanliness', label: '✨ Cleanliness' },
                  { value: 'rating', label: '⭐ Rating' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value as SortOption)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                      sortBy === opt.value
                        ? 'bg-amber-accent text-uoft-blue-dark'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
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
      <div className="space-y-3">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-4 card-shadow border border-blue-100 dark:border-slate-700 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
                  <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded w-full" />
                </div>
              </div>
            </div>
          ))
        ) : filteredAndSorted.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl card-shadow border border-blue-100 dark:border-slate-700">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg font-bold text-uoft-blue dark:text-white mb-2">No facilities found</p>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
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
                className="px-4 py-2 bg-uoft-blue dark:bg-slate-700 text-white rounded-xl text-sm font-semibold hover:bg-uoft-blue-light dark:hover:bg-slate-600 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          filteredAndSorted.map((f) => <FacilityCard key={f.id} facility={f} />)
        )}
      </div>

      {/* Add CTA */}
      <div className="mt-8 text-center bg-white dark:bg-slate-800 rounded-2xl p-6 card-shadow border border-blue-100 dark:border-slate-700">
        <p className="text-2xl mb-2">🚻</p>
        {isAuthenticated ? (
          <>
            <p className="font-bold text-uoft-blue dark:text-white">Help your fellow students!</p>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">
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
                className="inline-flex items-center gap-1 px-4 py-2 bg-uoft-blue dark:bg-slate-700 text-white rounded-xl font-bold text-sm hover:bg-uoft-blue-light dark:hover:bg-slate-600 transition-colors"
              >
                📍 Add a Location
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="font-bold text-uoft-blue dark:text-white">Know a facility we're missing?</p>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">
              Sign in to add new locations and leave reviews
            </p>
            <Link
              to="/login"
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
