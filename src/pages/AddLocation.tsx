import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Facility, FacilityType, GenderDesignation } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Check, MapPin } from 'lucide-react';

export default function AddLocation() {
  const navigate = useNavigate();
  const { addFacility } = useData();
  const { user, isAuthenticated } = useAuth();

  const [type, setType] = useState<FacilityType>('toilet');
  const [name, setName] = useState('');
  const [building, setBuilding] = useState('');
  const [buildingCode, setBuildingCode] = useState('');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');
  const [floorNote, setFloorNote] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [genderDesignation, setGenderDesignation] = useState<GenderDesignation>('All-gender');
  const [accessible, setAccessible] = useState(false);
  const [hasBottleFiller, setHasBottleFiller] = useState(false);
  const [hasChilled, setHasChilled] = useState(false);
  const [hasFreeMenstrualProducts, setHasFreeMenstrualProducts] = useState(false);
  const [hasBabyChangeStation, setHasBabyChangeStation] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-4xl mb-3">🔒</p>
        <p className="text-xl font-bold text-uoft-blue mb-2">Sign in required</p>
        <p className="text-gray-500 mb-4">You need to sign in to add a new location</p>
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
              setAddress('');
            }}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            Add Another
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !building || !address) return;

    const facility: Facility = {
      id: uuidv4(),
      type,
      name,
      building,
      buildingCode: buildingCode || undefined,
      floor: floor || undefined,
      room: room || undefined,
      floorNote: floorNote || [floor ? `Floor ${floor}` : '', room ? `Room ${room}` : ''].filter(Boolean).join(', '),
      address,
      notes: notes || undefined,
      campus: 'St. George',
      genderDesignation: type === 'toilet' ? genderDesignation : undefined,
      accessible,
      hasBottleFiller: type === 'fountain' ? hasBottleFiller : undefined,
      hasChilled: type === 'fountain' ? hasChilled : undefined,
      hasFreeMenstrualProducts: type === 'toilet' ? hasFreeMenstrualProducts : undefined,
      hasBabyChangeStation: type === 'toilet' ? hasBabyChangeStation : undefined,
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

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 card-shadow border border-blue-100 dark:border-slate-700">
        <h1 className="text-2xl font-black text-uoft-blue dark:text-white mb-1">Add a New Location 📍</h1>
        <p className="text-sm text-gray-600 dark:text-slate-300 mb-6">
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

          {/* Building Code */}
          <div>
            <label className="block text-sm font-bold text-uoft-blue mb-1">
              Building Code <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={buildingCode}
              onChange={(e) => setBuildingCode(e.target.value)}
              placeholder="e.g., RL"
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent"
            />
          </div>

          {/* Floor */}
          <div>
            <label className="block text-sm font-bold text-uoft-blue mb-1">
              Floor <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              placeholder="e.g., 3"
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent"
            />
          </div>

          {/* Room */}
          <div>
            <label className="block text-sm font-bold text-uoft-blue mb-1">
              Room <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g., 3005"
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent"
            />
          </div>

          {/* Floor note */}
          <div>
            <label className="block text-sm font-bold text-uoft-blue mb-1">
              Floor & Location <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={floorNote}
              onChange={(e) => setFloorNote(e.target.value)}
              placeholder="e.g., near east staircase"
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent"
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

          {/* Toilet options */}
          {type === 'toilet' && (
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasFreeMenstrualProducts}
                  onChange={(e) => setHasFreeMenstrualProducts(e.target.checked)}
                  className="w-5 h-5 rounded border-blue-200 text-uoft-blue focus:ring-amber-accent"
                />
                <span className="text-sm font-semibold text-gray-700">🩸 Free menstrual products</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasBabyChangeStation}
                  onChange={(e) => setHasBabyChangeStation(e.target.checked)}
                  className="w-5 h-5 rounded border-blue-200 text-uoft-blue focus:ring-amber-accent"
                />
                <span className="text-sm font-semibold text-gray-700">👶 Baby change station</span>
              </label>
            </div>
          )}

          {/* Accessible */}          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={accessible}
              onChange={(e) => setAccessible(e.target.checked)}
              className="w-5 h-5 rounded border-blue-200 text-uoft-blue focus:ring-amber-accent"
            />
            <span className="text-sm font-semibold text-gray-700">♿ Wheelchair accessible</span>
          </label>

          {/* Address */}
          <div>
            <label className="block text-sm font-bold text-uoft-blue mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., 130 St. George St, Toronto, ON M5S 1A5"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-bold text-uoft-blue mb-1">
              Notes <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information about this facility..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-accent/50 focus:border-amber-accent resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!name || !building || !address}
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
