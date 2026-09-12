import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Review, Condition } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Check } from 'lucide-react';

export default function SubmitReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedFacility = searchParams.get('facility') || '';

  const { facilities, addReview } = useData();
  const { user, isAuthenticated } = useAuth();

  const [facilityId, setFacilityId] = useState(preselectedFacility);
  const [overallRating, setOverallRating] = useState(0);
  const [cleanlinessRating, setCleanlinessRating] = useState(0);
  const [condition, setCondition] = useState<Condition>('Good');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-4xl mb-3">🔒</p>
        <p className="text-xl font-bold text-uoft-blue mb-2">Sign in required</p>
        <p className="text-gray-500 mb-4">You need to sign in to submit a review</p>
        <Link
          to="/auth"
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
        <p className="text-xl font-bold text-uoft-blue mb-2">Review submitted!</p>
        <p className="text-gray-500 mb-6">Thanks for helping keep campus facilities rated</p>
        <div className="flex gap-3 justify-center">
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
            }}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            Write Another
          </button>
        </div>
      </div>
    );
  }

  const selectedFacility = facilities.find((f) => f.id === facilityId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityId || overallRating === 0 || cleanlinessRating === 0) return;

    const review: Review = {
      id: uuidv4(),
      facilityId,
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

  const emoji = selectedFacility?.type === 'fountain' ? '💧' : '💩';

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-uoft-blue font-semibold mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-white rounded-2xl p-6 card-shadow border border-blue-100">
        <h1 className="text-2xl font-black text-uoft-blue mb-1">Write a Review</h1>
        <p className="text-sm text-gray-500 mb-6">Share your experience to help fellow students</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Facility selection */}
          <div>
            <label className="block text-sm font-bold text-uoft-blue mb-1">
              Facility <span className="text-bad-red">*</span>
            </label>
            <select
              value={facilityId}
              onChange={(e) => setFacilityId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent"
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

          {/* Overall rating */}
          <div>
            <label className="block text-sm font-bold text-uoft-blue mb-2">
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
            <p className="text-xs text-gray-400 mt-1">
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
            <label className="block text-sm font-bold text-uoft-blue mb-2">
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
            <p className="text-xs text-gray-400 mt-1">
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
            <label className="block text-sm font-bold text-uoft-blue mb-1">
              Condition <span className="text-bad-red">*</span>
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as Condition)}
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent"
            >
              <option value="Excellent">✨ Excellent</option>
              <option value="Good">👍 Good</option>
              <option value="Needs attention">⚠️ Needs attention</option>
              <option value="Out of order">🚫 Out of order</option>
            </select>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-bold text-uoft-blue mb-1">
              Comment <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share any details about your experience..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-400 text-right">{comment.length}/500</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!facilityId || overallRating === 0 || cleanlinessRating === 0}
            className="w-full py-3 bg-amber-accent text-uoft-blue-dark rounded-xl font-bold text-lg hover:bg-amber-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
