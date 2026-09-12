import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Facility, FacilityType, GenderDesignation } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Check, Navigation, MapPin } from 'lucide-react';

export default function AddLocation() {
  const navigate = useNavigate();
  const { addFacility, userLocation, requestLocation } = useData();
  const { user, isAuthenticated } = useAuth();

  const [type, setType] = useState<FacilityType>('toilet');
  const [name, setName] = useState('');
  const [building, setBuilding] = useState('');
  const [floorNote, setFloorNote] = useState('');
  const [genderDesignation, setGenderDesignation] = useState<GenderDesignation>('All-gender');
  const [accessible, setAccessible] = useState(false);
  const [hasBottleFiller, setHasBottleFiller] = useState(false);
  const [hasChilled, setHasChilled] = useState(false);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-4xl mb-3">🔒</p>
        <p className="text-xl font-bold text-uoft-blue mb-2">Sign in required</p>
        <p className="text-gray-500 mb-4">You need to sign in to add a new location</p>
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
          <p className="text-6xl">🎉</p>
        </div>
        <p className="text-xl font-bold text-uoft-blue mb-2">Location added!</p>
        <p className="text-gray-500 mb-6">Thanks for helping grow the campus map</p>
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
              setName('');
              setBuilding('');
              setFloorNote('');
              setLat('');
              setLng('');
            }}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            Add Another
          </button>
        </div>
      </div>
    );
  }

  const useCurrentLocation = () => {
    if (!userLocation) {
      requestLocation();
      return;
    }
    setLat(userLocation.lat.toString());
    setLng(userLocation.lng.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !building || !floorNote) return;

    const facility: Facility = {
      id: uuidv4(),
      type,
      name,
      building,
      floorNote,
      genderDesignation: type === 'toilet' ? genderDesignation : undefined,
      accessible,
      lat: parseFloat(lat) || 43.6629,
      lng: parseFloat(lng) || -79.3956,
      hasBottleFiller: type === 'fountain' ? hasBottleFiller : undefined,
      hasChilled: type === 'fountain' ? hasChilled : undefined,
      createdAt: new Date().toISOString(),
      createdBy: user!.id,
    };

    addFacility(facility);
    setSubmitted(true);
  };

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
        <h1 className="text-2xl font-black text-uoft-blue mb-1">Add a New Location 📍</h1>
        <p className="text-sm text-gray-600 mb-6">
          Found a facility we don't have yet? Add it to help other students!
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type */}
          <div>
            <label className="block text-sm font-bold text-uoft-blue mb-2">
              Type <span className="text-bad-red">*</span>
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setType('toilet')}
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition-colors ${
                  type === 'toilet'
                    ? 'bg-uoft-blue text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🚰 Fountain
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-uoft-blue mb-1">
              Facility Name <span className="text-bad-red">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Main Floor Washroom"
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent"
              required
            />
          </div>

          {/* Building */}
          <div>
            <label className="block text-sm font-bold text-uoft-blue mb-1">
              Building <span className="text-bad-red">*</span>
            </label>
            <input
              type="text"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              placeholder="e.g., Robarts Library"
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent"
              required
            />
          </div>

          {/* Floor note */}
          <div>
            <label className="block text-sm font-bold text-uoft-blue mb-1">
              Floor & Location <span className="text-bad-red">*</span>
            </label>
            <input
              type="text"
              value={floorNote}
              onChange={(e) => setFloorNote(e.target.value)}
              placeholder="e.g., 3rd Floor, near east staircase"
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent"
              required
            />
          </div>

          {/* Gender designation (for toilets) */}
          {type === 'toilet' && (
            <div>
              <label className="block text-sm font-bold text-uoft-blue mb-2">
                Gender Designation <span className="text-bad-red">*</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {(["Men's", "Women's", 'All-gender'] as GenderDesignation[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGenderDesignation(g)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                      genderDesignation === g
                        ? 'bg-uoft-blue text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                <span className="text-sm font-semibold text-gray-700">🧴 Bottle filler</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasChilled}
                  onChange={(e) => setHasChilled(e.target.checked)}
                  className="w-5 h-5 rounded border-blue-200 text-uoft-blue focus:ring-amber-accent"
                />
                <span className="text-sm font-semibold text-gray-700">❄️ Chilled</span>
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
            <span className="text-sm font-semibold text-gray-700">♿ Wheelchair accessible</span>
          </label>

          {/* Location */}
          <div>
            <label className="block text-sm font-bold text-uoft-blue mb-1">
              Coordinates <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="Latitude"
                className="flex-1 px-3 py-2 rounded-xl border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50"
              />
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="Longitude"
                className="flex-1 px-3 py-2 rounded-xl border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50"
              />
            </div>
            <button
              type="button"
              onClick={useCurrentLocation}
              className="flex items-center gap-1 text-sm text-uoft-blue font-semibold hover:text-uoft-blue-light transition-colors"
            >
              <Navigation className="w-4 h-4" />
              Use my current location
              <MapPin className="w-3 h-3" />
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!name || !building || !floorNote}
            className="w-full py-3 bg-amber-accent text-uoft-blue-dark rounded-xl font-bold text-lg hover:bg-amber-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Add Location
          </button>
        </form>
      </div>
    </div>
  );
}
