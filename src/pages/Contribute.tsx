import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Review, Facility, FacilityType, GenderDesignation, Condition } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Check, MapPin } from 'lucide-react';

type Mode = 'review-existing' | 'add-new';

export default function Contribute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedFacility = searchParams.get('facility') || '';

  const { facilities, addReview, addFacility } = useData();
  const { user, isAuthenticated } = useAuth();

  // Mode selection
  const [mode, setMode] = useState<Mode>(preselectedFacility ? 'review-existing' : 'review-existing');

  // Review form state
  const [facilityId, setFacilityId] = useState(preselectedFacility);
  const [overallRating, setOverallRating] = useState(0);
  const [cleanlinessRating, setCleanlinessRating] = useState(0);
  const [condition, setCondition] = useState<Condition>('Good');
  const [comment, setComment] = useState('');

  // New facility form state
  const [type, setType] = useState<FacilityType>('toilet');
  const [name, setName] = useState('');
  const [building, setBuilding] = useState('');
  const [floorNote, setFloorNote] = useState('');
  const [address, setAddress] = useState('');
  const [genderDesignation, setGenderDesignation] = useState<GenderDesignation>('All-gender');
  const [accessible, setAccessible] = useState(false);
  const [hasBottleFiller, setHasBottleFiller] = useState(false);
  const [hasChilled, setHasChilled] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [newlyCreatedFacilityId, setNewlyCreatedFacilityId] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-4xl mb-3">🔒</p>
        <p className="text-xl font-bold text-uoft-blue dark:text-white mb-2">Sign in required</p>
        <p className="text-gray-500 dark:text-slate-400 mb-4">You need to sign in to contribute</p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-accent text-uoft-blue-dark rounded-xl font-bold hover:bg-amber-light transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="float-animation inline-block mb-4">
          <p className="text-6xl">✅</p>
        </div>
        <p className="text-xl font-bold text-uoft-blue dark:text-white mb-2">
          {mode === 'add-new' ? 'Location added and reviewed!' : 'Review submitted!'}
        </p>
        <p className="text-gray-500 dark:text-slate-400 mb-6">
          Thanks for helping keep campus facilities rated
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            to="/"
            className="px-6 py-3 bg-uoft-blue text-white rounded-xl font-bold hover:bg-uoft-blue-light transition-colors"
          >
            Browse Facilities
          </Link>
          <button
            onClick={() => {
              setSubmitted(false);
              setOverallRating(0);
              setCleanlinessRating(0);
              setComment('');
              setName('');
              setBuilding('');
              setFloorNote('');
              setAddress('');
              setFacilityId('');
              setNewlyCreatedFacilityId(null);
            }}
            className="px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            Contribute Again
          </button>
        </div>
      </div>
    );
  }

  const selectedFacility = facilities.find((f) => f.id === (newlyCreatedFacilityId || facilityId));
  const emoji = selectedFacility?.type === 'fountain' ? '💧' : '💩';

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (overallRating === 0 || cleanlinessRating === 0) return;

    const targetFacilityId = newlyCreatedFacilityId || facilityId;
    if (!targetFacilityId) return;

    const review: Review = {
      id: uuidv4(),
      facilityId: targetFacilityId,
      userId: user!.id,
      userName: user!.displayName,
      overallRating,
      cleanlinessRating,
      condition,
      comment,
      createdAt: new Date().toISOString(),
    };

    addReview(review);
    setSubmitted(true);
  };

  const handleFacilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !building || !floorNote || !address) return;

    const facility: Facility = {
      id: uuidv4(),
      type,
      name,
      building,
      floorNote,
      address,
      genderDesignation: type === 'toilet' ? genderDesignation : undefined,
      accessible,
      hasBottleFiller: type === 'fountain' ? hasBottleFiller : undefined,
      hasChilled: type === 'fountain' ? hasChilled : undefined,
      createdAt: new Date().toISOString(),
      createdBy: user!.id,
    };

    addFacility(facility);
    setNewlyCreatedFacilityId(facility.id);
    setFacilityId(facility.id);
    // Switch to review mode for the newly created facility
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400 hover:text-uoft-blue dark:hover:text-white font-semibold mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 card-shadow border border-blue-100 dark:border-slate-700">
        <h1 className="text-2xl font-black text-uoft-blue dark:text-white mb-1">Contribute 🎉</h1>
        <p className="text-sm text-gray-600 dark:text-slate-300 mb-6">
          Help your fellow students by adding new facilities or reviewing existing ones
        </p>

        {/* Mode Selection */}
        {!newlyCreatedFacilityId && (
          <div className="mb-6">
            <label className="block text-sm font-bold text-uoft-blue dark:text-white mb-2">
              What would you like to do?
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMode('review-existing')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-colors ${
                  mode === 'review-existing'
                    ? 'bg-uoft-blue text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                ✍️ Review Existing
              </button>
              <button
                type="button"
                onClick={() => setMode('add-new')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-colors ${
                  mode === 'add-new'
                    ? 'bg-uoft-blue text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                📍 Add New + Review
              </button>
            </div>
          </div>
        )}

        {/* Add New Facility Form */}
        {mode === 'add-new' && !newlyCreatedFacilityId && (
          <form onSubmit={handleFacilitySubmit} className="space-y-5 mb-6">
            <div className="border-b border-gray-200 dark:border-slate-700 pb-4 mb-4">
              <h2 className="text-lg font-bold text-uoft-blue dark:text-white mb-1">
                Step 1: Add New Facility
              </h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Fill in the facility details below
              </p>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-bold text-uoft-blue dark:text-white mb-2">
                Type <span className="text-bad-red">*</span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setType('toilet')}
                  className={`flex-1 py-3 rounded-xl font-bold text-lg transition-colors ${
                    type === 'toilet'
                      ? 'bg-uoft-blue text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  🚻 Toilet
                </button>
                <button
                  type="button"
                  onClick={() => setType('fountain')}
                  className={`flex-1 py-3 rounded-xl font-bold text-lg transition-colors ${
                    type === 'fountain'
                      ? 'bg-uoft-blue text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  🚰 Fountain
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-uoft-blue dark:text-white mb-1">
                Facility Name <span className="text-bad-red">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Main Floor Washroom"
                className="w-full px-4 py-3 rounded-xl border border-blue-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent"
                required
              />
            </div>

            {/* Building */}
            <div>
              <label className="block text-sm font-bold text-uoft-blue dark:text-white mb-1">
                Building <span className="text-bad-red">*</span>
              </label>
              <input
                type="text"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                placeholder="e.g., Robarts Library"
                className="w-full px-4 py-3 rounded-xl border border-blue-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent"
                required
              />
            </div>

            {/* Floor note */}
            <div>
              <label className="block text-sm font-bold text-uoft-blue dark:text-white mb-1">
                Floor & Location <span className="text-bad-red">*</span>
              </label>
              <input
                type="text"
                value={floorNote}
                onChange={(e) => setFloorNote(e.target.value)}
                placeholder="e.g., 3rd Floor, near east staircase"
                className="w-full px-4 py-3 rounded-xl border border-blue-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-bold text-uoft-blue dark:text-white mb-1">
                Address <span className="text-bad-red">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g., 130 St. George St, Toronto, ON M5S 1A5"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-blue-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent"
                  required
                />
              </div>
            </div>

            {/* Gender designation (for toilets) */}
            {type === 'toilet' && (
              <div>
                <label className="block text-sm font-bold text-uoft-blue dark:text-white mb-2">
                  Gender Designation <span className="text-bad-red">*</span>
                </label>
                <div className="flex gap-2 flex-wrap">
                  {(["Men's", "Women's", 'All-gender'] as GenderDesignation[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGenderDesignation(g)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        genderDesignation === g
                          ? 'bg-uoft-blue text-white'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fountain options */}
            {type === 'fountain' && (
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasBottleFiller}
                    onChange={(e) => setHasBottleFiller(e.target.checked)}
                    className="w-5 h-5 rounded border-blue-200 text-uoft-blue focus:ring-amber-accent"
                  />
                  <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                    🧴 Bottle filler
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasChilled}
                    onChange={(e) => setHasChilled(e.target.checked)}
                    className="w-5 h-5 rounded border-blue-200 text-uoft-blue focus:ring-amber-accent"
                  />
                  <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                    ❄️ Chilled
                  </span>
                </label>
              </div>
            )}

            {/* Accessible */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={accessible}
                onChange={(e) => setAccessible(e.target.checked)}
                className="w-5 h-5 rounded border-blue-200 text-uoft-blue focus:ring-amber-accent"
              />
              <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                ♿ Wheelchair accessible
              </span>
            </label>

            {/* Submit Facility */}
            <button
              type="submit"
              disabled={!name || !building || !floorNote || !address}
              className="w-full py-3 bg-amber-accent text-uoft-blue-dark rounded-xl font-bold text-lg hover:bg-amber-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Add Facility & Continue to Review
            </button>
          </form>
        )}

        {/* Review Form */}
        {(mode === 'review-existing' || newlyCreatedFacilityId) && (
          <form onSubmit={handleReviewSubmit} className="space-y-6">
            {newlyCreatedFacilityId && (
              <div className="border-b border-gray-200 dark:border-slate-700 pb-4 mb-4">
                <h2 className="text-lg font-bold text-uoft-blue dark:text-white mb-1">
                  Step 2: Review Your New Facility
                </h2>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Now rate the facility you just added
                </p>
              </div>
            )}

            {/* Facility selection (only for existing facilities) */}
            {mode === 'review-existing' && !newlyCreatedFacilityId && (
              <div>
                <label className="block text-sm font-bold text-uoft-blue dark:text-white mb-1">
                  Facility <span className="text-bad-red">*</span>
                </label>
                <select
                  value={facilityId}
                  onChange={(e) => setFacilityId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent"
                  required
                >
                  <option value="">Select a facility...</option>
                  {facilities
                    .sort((a, b) => a.building.localeCompare(b.building))
                    .map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.type === 'toilet' ? '🚻' : '🚰'} {f.name} — {f.building}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Show selected facility info */}
            {selectedFacility && (
              <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
                <p className="text-sm font-semibold text-uoft-blue dark:text-white">
                  {selectedFacility.type === 'toilet' ? '🚻' : '🚰'} {selectedFacility.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-slate-400">
                  {selectedFacility.building} • {selectedFacility.floorNote}
                </p>
              </div>
            )}

            {/* Overall rating */}
            <div>
              <label className="block text-sm font-bold text-uoft-blue dark:text-white mb-2">
                Overall Rating <span className="text-bad-red">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setOverallRating(star)}
                    className={`text-4xl transition-transform hover:scale-110 ${
                      star <= overallRating ? '' : 'opacity-25 grayscale'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                {overallRating === 0
                  ? 'Tap to rate'
                  : overallRating === 1
                  ? 'Terrible 😢'
                  : overallRating === 2
                  ? 'Below average 😕'
                  : overallRating === 3
                  ? 'Okay 😐'
                  : overallRating === 4
                  ? 'Good 😊'
                  : 'Excellent! 🎉'}
              </p>
            </div>

            {/* Cleanliness rating */}
            <div>
              <label className="block text-sm font-bold text-uoft-blue dark:text-white mb-2">
                Cleanliness Rating <span className="text-bad-red">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setCleanlinessRating(star)}
                    className={`text-4xl transition-transform hover:scale-110 ${
                      star <= cleanlinessRating ? '' : 'opacity-25 grayscale'
                    }`}
                  >
                    ✨
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                {cleanlinessRating === 0
                  ? 'Tap to rate'
                  : cleanlinessRating <= 2
                  ? 'Not very clean'
                  : cleanlinessRating === 3
                  ? 'Acceptable'
                  : cleanlinessRating === 4
                  ? 'Pretty clean'
                  : 'Sparkling! ✨'}
              </p>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-bold text-uoft-blue dark:text-white mb-1">
                Condition <span className="text-bad-red">*</span>
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as Condition)}
                className="w-full px-4 py-3 rounded-xl border border-blue-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent"
              >
                <option value="Excellent">✨ Excellent</option>
                <option value="Good">👍 Good</option>
                <option value="Needs attention">⚠️ Needs attention</option>
                <option value="Out of order">🚫 Out of order</option>
              </select>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-bold text-uoft-blue dark:text-white mb-1">
                Comment <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share any details about your experience..."
                rows={3}
                maxLength={500}
                className="w-full px-4 py-3 rounded-xl border border-blue-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent resize-none"
              />
              <p className="text-xs text-gray-400 dark:text-slate-500 text-right">{comment.length}/500</p>
            </div>

            {/* Submit Review */}
            <button
              type="submit"
              disabled={
                overallRating === 0 ||
                cleanlinessRating === 0 ||
                (mode === 'review-existing' && !facilityId)
              }
              className="w-full py-3 bg-amber-accent text-uoft-blue-dark rounded-xl font-bold text-lg hover:bg-amber-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Submit Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
