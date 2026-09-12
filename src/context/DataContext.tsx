import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Facility, Review, FacilityWithStats } from '../types';
import { seedFacilities, seedReviews } from '../data/seedData';
import { haversineDistance } from '../utils/distance';
import { supabase } from '../lib/supabase';

interface DataContextType {
  facilities: Facility[];
  reviews: Review[];
  facilitiesWithStats: FacilityWithStats[];
  addFacility: (facility: Facility) => Promise<void>;
  addReview: (review: Review) => Promise<void>;
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
  locationError: string | null;
  requestLocation: () => void;
  isLoading: boolean;
  supabaseConnected: boolean;
}

const DataContext = createContext<DataContextType>({
  facilities: [],
  reviews: [],
  facilitiesWithStats: [],
  addFacility: async () => {},
  addReview: async () => {},
  userLocation: null,
  setUserLocation: () => {},
  locationError: null,
  requestLocation: () => {},
  isLoading: true,
  supabaseConnected: false,
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseConnected, setSupabaseConnected] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    let supabaseAvailable = false;

    try {
      // Try to load from Supabase
      const { data: supabaseFacilities, error: facilitiesError } = await supabase
        .from('facilities')
        .select('*');

      const { data: supabaseReviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('*');

      // Check if tables exist (404 = table not found)
      if (facilitiesError?.code === '42P01' || facilitiesError?.message?.includes('does not exist')) {
        console.warn('Supabase tables not found. Run supabase/schema.sql in your Supabase SQL Editor.');
        supabaseAvailable = false;
      } else if (!facilitiesError && supabaseFacilities) {
        supabaseAvailable = true;
        setFacilities(supabaseFacilities.map(mapSupabaseFacility));
      }

      if (!reviewsError && supabaseReviews) {
        setReviews(supabaseReviews.map(mapSupabaseReview));
      }
    } catch (error) {
      console.warn('Failed to load from Supabase:', error);
      supabaseAvailable = false;
    }

    // Fallback to localStorage or seed data if Supabase unavailable
    if (!supabaseAvailable) {
      const storedFacilities = localStorage.getItem('uoftflow_facilities');
      const storedReviews = localStorage.getItem('uoftflow_reviews');

      if (storedFacilities) {
        setFacilities(JSON.parse(storedFacilities));
      } else {
        setFacilities(seedFacilities);
        localStorage.setItem('uoftflow_facilities', JSON.stringify(seedFacilities));
      }

      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      } else {
        setReviews(seedReviews);
        localStorage.setItem('uoftflow_reviews', JSON.stringify(seedReviews));
      }
    }

    setSupabaseConnected(supabaseAvailable);
    setIsLoading(false);
  };

  const mapSupabaseFacility = (row: any): Facility => ({
    id: row.id,
    type: row.type,
    name: row.name,
    building: row.building,
    floorNote: row.floor_note,
    genderDesignation: row.gender_designation,
    accessible: row.accessible,
    lat: row.lat,
    lng: row.lng,
    hasBottleFiller: row.has_bottle_filler,
    hasChilled: row.has_chilled,
    createdAt: row.created_at,
    createdBy: row.created_by,
  });

  const mapSupabaseReview = (row: any): Review => ({
    id: row.id,
    facilityId: row.facility_id,
    userId: row.user_id,
    userName: row.user_name,
    overallRating: row.overall_rating,
    cleanlinessRating: row.cleanliness_rating,
    condition: row.condition,
    comment: row.comment,
    createdAt: row.created_at,
  });

  const addFacility = async (facility: Facility) => {
    const updated = [...facilities, facility];
    setFacilities(updated);
    localStorage.setItem('uoftflow_facilities', JSON.stringify(updated));

    // Try to save to Supabase
    try {
      await supabase.from('facilities').insert({
        id: facility.id,
        type: facility.type,
        name: facility.name,
        building: facility.building,
        floor_note: facility.floorNote,
        gender_designation: facility.genderDesignation,
        accessible: facility.accessible,
        lat: facility.lat,
        lng: facility.lng,
        has_bottle_filler: facility.hasBottleFiller,
        has_chilled: facility.hasChilled,
        created_at: facility.createdAt,
        created_by: facility.createdBy,
      });
    } catch (error) {
      console.warn('Failed to save facility to Supabase:', error);
    }
  };

  const addReview = async (review: Review) => {
    const updated = [...reviews, review];
    setReviews(updated);
    localStorage.setItem('uoftflow_reviews', JSON.stringify(updated));

    // Try to save to Supabase
    try {
      await supabase.from('reviews').insert({
        id: review.id,
        facility_id: review.facilityId,
        user_id: review.userId,
        user_name: review.userName,
        overall_rating: review.overallRating,
        cleanliness_rating: review.cleanlinessRating,
        condition: review.condition,
        comment: review.comment,
        created_at: review.createdAt,
      });
    } catch (error) {
      console.warn('Failed to save review to Supabase:', error);
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationError(null);
      },
      (err) => {
        setLocationError(err.message || 'Unable to get location');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Compute facilities with stats
  const facilitiesWithStats: FacilityWithStats[] = facilities.map((f) => {
    const facilityReviews = reviews.filter((r) => r.facilityId === f.id);
    const avgRating =
      facilityReviews.length > 0
        ? facilityReviews.reduce((sum, r) => sum + r.overallRating, 0) / facilityReviews.length
        : 0;
    const avgCleanliness =
      facilityReviews.length > 0
        ? facilityReviews.reduce((sum, r) => sum + r.cleanlinessRating, 0) / facilityReviews.length
        : 0;
    const distance = userLocation
      ? haversineDistance(userLocation.lat, userLocation.lng, f.lat, f.lng)
      : undefined;

    return {
      ...f,
      avgRating,
      avgCleanliness,
      reviewCount: facilityReviews.length,
      distance,
    };
  });

  return (
    <DataContext.Provider
      value={{
        facilities,
        reviews,
        facilitiesWithStats,
        addFacility,
        addReview,
        userLocation,
        setUserLocation,
        locationError,
        requestLocation,
        isLoading,
        supabaseConnected,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
