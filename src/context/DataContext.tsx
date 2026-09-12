import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Facility, Review, FacilityWithStats } from '../types';
import { seedFacilities, seedReviews } from '../data/seedData';
import { haversineDistance } from '../utils/distance';

interface DataContextType {
  facilities: Facility[];
  reviews: Review[];
  facilitiesWithStats: FacilityWithStats[];
  addFacility: (facility: Facility) => void;
  addReview: (review: Review) => void;
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
  locationError: string | null;
  requestLocation: () => void;
}

const DataContext = createContext<DataContextType>({
  facilities: [],
  reviews: [],
  facilitiesWithStats: [],
  addFacility: () => {},
  addReview: () => {},
  userLocation: null,
  setUserLocation: () => {},
  locationError: null,
  requestLocation: () => {},
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    // Load from localStorage or use seed data
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
  }, []);

  const addFacility = (facility: Facility) => {
    const updated = [...facilities, facility];
    setFacilities(updated);
    localStorage.setItem('uoftflow_facilities', JSON.stringify(updated));
  };

  const addReview = (review: Review) => {
    const updated = [...reviews, review];
    setReviews(updated);
    localStorage.setItem('uoftflow_reviews', JSON.stringify(updated));
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
