import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Facility, Review, FacilityWithStats, Report } from '../types';
import { seedFacilities, seedReviews } from '../data/seedData';
import { haversineDistance } from '../utils/distance';
import { supabase } from '../lib/supabase';
import { filterReviews } from '../utils/contentFilter';
import { useAuth } from './AuthContext';

interface DataContextType {
  facilities: Facility[];
  reviews: Review[];
  facilitiesWithStats: FacilityWithStats[];
  reports: Report[];
  addFacility: (facility: Facility) => Promise<void>;
  addReview: (review: Review) => Promise<void>;
  addReport: (report: Report) => Promise<void>;
  getVisibleReviews: (facilityId: string) => Review[];
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
  reports: [],
  addFacility: async () => {},
  addReview: async () => {},
  addReport: async () => {},
  getVisibleReviews: () => [],
  userLocation: null,
  setUserLocation: () => {},
  locationError: null,
  requestLocation: () => {},
  isLoading: true,
  supabaseConnected: false,
});

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
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
      console.log('🔄 Attempting to load data from Supabase...');
      
      // Test Supabase connection first
      const { data: testData, error: testError } = await supabase
        .from('facilities')
        .select('id')
        .limit(1);
      
      if (testError) {
        console.error('❌ Supabase connection failed:', testError.message);
        console.error('Error details:', testError);
        throw testError;
      }
      
      console.log('✅ Supabase connection successful');
      
      // Load facilities from Supabase
      const { data: supabaseFacilities, error: facilitiesError } = await supabase
        .from('facilities')
        .select('*')
        .order('created_at', { ascending: false });

      if (facilitiesError) {
        console.error('❌ Failed to load facilities from Supabase:', facilitiesError.message);
        throw facilitiesError;
      }

      console.log(`✅ Loaded ${supabaseFacilities?.length || 0} facilities from Supabase`);

      // Load reviews from Supabase
      const { data: supabaseReviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (reviewsError) {
        console.error('❌ Failed to load reviews from Supabase:', reviewsError.message);
        throw reviewsError;
      }

      console.log(`✅ Loaded ${supabaseReviews?.length || 0} reviews from Supabase`);

      // Set data from Supabase
      if (supabaseFacilities && supabaseFacilities.length > 0) {
        setFacilities(supabaseFacilities.map(mapSupabaseFacility));
        setSupabaseConnected(true);
      } else {
        // Fallback to localStorage or seed data
        const storedFacilities = localStorage.getItem('uoftflow_facilities');
        if (storedFacilities) {
          setFacilities(JSON.parse(storedFacilities));
        } else {
          setFacilities(seedFacilities);
          localStorage.setItem('uoftflow_facilities', JSON.stringify(seedFacilities));
        }
      }

      if (supabaseReviews && supabaseReviews.length > 0) {
        setReviews(supabaseReviews.map(mapSupabaseReview));
      }

      setSupabaseConnected(supabaseAvailable);
      
      if (supabaseAvailable) {
        console.log('🎉 Successfully loaded all data from Supabase!');
      }

      // Load reports from localStorage
      const storedReports = localStorage.getItem('uoftflow_reports');
      if (storedReports) {
        setReports(JSON.parse(storedReports));
      }
    } catch (error) {
      console.warn('⚠️ Supabase not available, using fallback data:', error);
      supabaseAvailable = false;
    }

    // Fallback to localStorage or seed data if Supabase is not available
    if (!supabaseAvailable) {
      console.log('📦 Loading from localStorage or seed data...');
      
      const storedFacilities = localStorage.getItem('uoftflow_facilities');
      if (storedFacilities) {
        setFacilities(JSON.parse(storedFacilities));
        console.log('✅ Loaded facilities from localStorage');
      } else {
        setFacilities(seedFacilities);
        localStorage.setItem('uoftflow_facilities', JSON.stringify(seedFacilities));
        console.log('✅ Loaded seed facilities');
      }

      const storedReviews = localStorage.getItem('uoftflow_reviews');
      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
        console.log('✅ Loaded reviews from localStorage');
      } else {
        setReviews(seedReviews);
        localStorage.setItem('uoftflow_reviews', JSON.stringify(seedReviews));
        console.log('✅ Loaded seed reviews');
      }

      // Load reports from localStorage
      const storedReports = localStorage.getItem('uoftflow_reports');
      if (storedReports) {
        setReports(JSON.parse(storedReports));
      }
    }

    // Load reports from localStorage
    const storedReports = localStorage.getItem('uoftflow_reports');
    if (storedReports) {
      setReports(JSON.parse(storedReports));
    }

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
    // Update local state immediately for responsive UI
    const updated = [...facilities, facility];
    setFacilities(updated);
    localStorage.setItem('uoftflow_facilities', JSON.stringify(updated));

    // Try to save to Supabase if connected
    if (supabaseConnected) {
      try {
        console.log('💾 Saving facility to Supabase...');
        const { error } = await supabase.from('facilities').insert({
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
        
        if (error) {
          console.error('❌ Failed to save facility to Supabase:', error.message);
        } else {
          console.log('✅ Facility saved to Supabase successfully');
        }
      } catch (error) {
        console.error('❌ Error saving facility to Supabase:', error);
      }
    } else {
      console.log('⚠️ Supabase not connected, facility saved to localStorage only');
    }
  };

  const addReview = async (review: Review) => {
    console.log('🔍 addReview called with:', review);
    console.log('🔍 User object:', user);
    console.log('🔍 isAuthenticated:', isAuthenticated);
    
    // Update local state immediately for responsive UI
    const updated = [...reviews, review];
    setReviews(updated);
    localStorage.setItem('uoftflow_reviews', JSON.stringify(updated));

    // Check if user is actually authenticated
    const response = await supabase.auth.getSession();
    const session = response?.data?.session ?? null;
    console.log('🔍 Supabase session:', session);
    console.log('🔍 Supabase user:', session?.user);

    if (!session?.user) {
      console.error('❌ No active Supabase session. Please sign in again.');
      alert('You are not signed in. Please sign in and try again.');
      return;
    }

    try {
      console.log('💾 Saving review to Supabase...');
      console.log('💾 Data being sent:', {
        id: review.id,
        facility_id: review.facilityId,
        user_id: session.user.id,
        user_name: review.userName,
        overall_rating: review.overallRating,
        cleanliness_rating: review.cleanlinessRating,
        condition: review.condition,
        comment: review.comment,
        created_at: review.createdAt,
      });
      
      const result = await supabase.from('reviews').insert({
        id: review.id,
        facility_id: review.facilityId,
        user_id: session.user.id,
        user_name: review.userName,
        overall_rating: review.overallRating,
        cleanliness_rating: review.cleanlinessRating,
        condition: review.condition,
        comment: review.comment,
        created_at: review.createdAt,
      }).select();
      
      const { data, error } = result;

      console.log('💾 Supabase response - data:', data);
      console.log('💾 Supabase response - error:', error);
      
      if (error) {
        console.error('❌ Failed to save review to Supabase:', error);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error details:', error.details);
        console.error('❌ Error hint:', error.hint);
        
        if (error.code === '23505') {
          alert('This review already exists. Please refresh the page.');
        } else if (error.code === '42501' || error.message.includes('row-level security')) {
          alert('Permission denied. The database security policies may need to be updated.');
        } else if (error.code === '42P01') {
          alert('Database table does not exist. Please run the schema SQL first.');
        } else {
          alert(`Failed to save review: ${error.message}\n\nCheck browser console for details.`);
        }
      } else {
        console.log('✅ Review saved to Supabase successfully!');
        console.log('✅ Saved review:', data);
      }
    } catch (error: any) {
      console.error('❌ Exception while saving review:', error);
      console.error('❌ Error stack:', error.stack);
      alert(`Error saving review: ${error.message || 'Unknown error'}\n\nCheck browser console for details.`);
    }
  };

  const addReport = async (report: Report) => {
    const updated = [...reports, report];
    setReports(updated);
    localStorage.setItem('uoftflow_reports', JSON.stringify(updated));

    // Update the review's report count
    const review = reviews.find(r => r.id === report.reviewId);
    if (review) {
      const updatedReviews = reviews.map(r => 
        r.id === report.reviewId 
          ? { ...r, reportCount: (r.reportCount || 0) + 1 }
          : r
      );
      setReviews(updatedReviews);
      localStorage.setItem('uoftflow_reviews', JSON.stringify(updatedReviews));
    }

    // Try to save to Supabase if user is authenticated
    if (isAuthenticated) {
      try {
        console.log('💾 Saving report to Supabase...');
        const { error } = await supabase.from('reports').insert({
          id: report.id,
          review_id: report.reviewId,
          reporter_id: report.reporterId,
          reporter_name: report.reporterName,
          reason: report.reason,
          description: report.description,
          status: report.status,
          created_at: report.createdAt,
        });
        
        if (error) {
          console.error('❌ Failed to save report to Supabase:', error.message);
          alert(`Failed to save report: ${error.message}`);
        } else {
          console.log('✅ Report saved to Supabase successfully');
        }
      } catch (error: any) {
        console.error('❌ Error saving report to Supabase:', error);
        alert(`Error saving report: ${error.message || 'Unknown error'}`);
      }
    } else {
      console.log('⚠️ User not authenticated, report saved to localStorage only');
    }
  };

  const getVisibleReviews = (facilityId: string): Review[] => {
    const facilityReviews = reviews.filter(r => r.facilityId === facilityId);
    const { visible } = filterReviews(facilityReviews);
    return visible;
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
        reports,
        addFacility,
        addReview,
        addReport,
        getVisibleReviews,
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
