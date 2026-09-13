import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Facility, Review, FacilityWithStats, Report } from '../types';
import { seedFacilities, seedReviews } from '../data/seedData';
import { supabase } from '../lib/supabase';
import { filterReviews } from '../utils/contentFilter';
import { calculateDistance } from '../utils/distance';
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
  refreshData: () => Promise<void>;
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
  refreshData: async () => {},
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
    let supabaseLoaded = false;
    
    try {
      console.log('🔄 Attempting to load data from Supabase...');
      
      // Test Supabase connection first
      const { data: testData, error: testError } = await supabase
        .from('washrooms')
        .select('id')
        .limit(1);
      
      if (testError) {
        console.error('❌ Supabase connection failed:', testError.message);
        throw testError;
      }
      
      console.log('✅ Supabase connection successful');
      
      // Load washrooms from Supabase
      const { data: supabaseWashrooms, error: washroomsError } = await supabase
        .from('washrooms')
        .select('*')
        .order('created_at', { ascending: false });

      if (washroomsError) {
        console.error('❌ Failed to load washrooms from Supabase:', washroomsError.message);
        throw washroomsError;
      }

      console.log(`✅ Loaded ${supabaseWashrooms?.length || 0} washrooms from Supabase`);

      // Load fountains from Supabase
      const { data: supabaseFountains, error: fountainsError } = await supabase
        .from('fountains')
        .select('*')
        .order('created_at', { ascending: false });

      if (fountainsError) {
        console.error('❌ Failed to load fountains from Supabase:', fountainsError.message);
        throw fountainsError;
      }

      console.log(`✅ Loaded ${supabaseFountains?.length || 0} fountains from Supabase`);

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

      // Combine washrooms and fountains into facilities
      const allFacilities: Facility[] = [];
      
      if (supabaseWashrooms && supabaseWashrooms.length > 0) {
        allFacilities.push(...supabaseWashrooms.map(mapSupabaseWashroom));
        console.log('✅ Mapped washrooms');
      }
      
      if (supabaseFountains && supabaseFountains.length > 0) {
        allFacilities.push(...supabaseFountains.map(mapSupabaseFountain));
        console.log('✅ Mapped fountains');
      }
      
      if (allFacilities.length > 0) {
        setFacilities(allFacilities);
        supabaseLoaded = true;
        console.log(`✅ Set ${allFacilities.length} total facilities from Supabase`);
      }

      if (supabaseReviews && supabaseReviews.length > 0) {
        const mappedReviews = supabaseReviews.map(mapSupabaseReview);
        setReviews(mappedReviews);
        // Update localStorage with fresh Supabase data
        localStorage.setItem('uoftflow_reviews', JSON.stringify(mappedReviews));
        console.log('✅ Set reviews from Supabase and updated localStorage');
      }

      // Load reports from localStorage
      const storedReports = localStorage.getItem('uoftflow_reports');
      if (storedReports) {
        setReports(JSON.parse(storedReports));
      }

      if (supabaseLoaded) {
        console.log('🎉 Successfully loaded all data from Supabase!');
        setSupabaseConnected(true);
      }
    } catch (error) {
      console.warn('⚠️ Supabase not available, will use fallback data:', error);
      supabaseLoaded = false;
    }

    // Fallback to localStorage or seed data ONLY if Supabase failed
    if (!supabaseLoaded) {
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

      setSupabaseConnected(false);
    }

    setIsLoading(false);
  };

  const mapSupabaseWashroom = (row: any): Facility => ({
    id: row.id,
    type: 'toilet' as const,
    name: `${row.building} ${row.floor ? `Floor ${row.floor}` : ''} ${row.room ? `Room ${row.room}` : ''}`.trim(),
    building: row.building,
    buildingCode: row.building_code,
    floorNote: [row.floor ? `Floor ${row.floor}` : '', row.room ? `Room ${row.room}` : ''].filter(Boolean).join(', '),
    floor: row.floor,
    room: row.room,
    address: row.address || '',
    campus: row.campus || 'St. George',
    lat: row.lat,
    lng: row.lng,
    genderDesignation: row.gender_designation,
    accessible: row.accessible,
    hasFreeMenstrualProducts: row.free_menstrual_products,
    hasBabyChangeStation: row.baby_change_station,
    notes: row.notes,
    createdAt: row.created_at,
    createdBy: row.created_by,
  });

  const mapSupabaseFountain = (row: any): Facility => ({
    id: row.id,
    type: 'fountain' as const,
    name: row.name,
    building: row.building,
    floorNote: row.floor_note,
    address: row.address,
    campus: row.campus || 'St. George',
    lat: row.lat,
    lng: row.lng,
    accessible: false,
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
    hasToiletPaper: row.has_toilet_paper,
    hasSoap: row.has_soap,
    hasStallLock: row.has_stall_lock,
  });

  const addFacility = async (facility: Facility) => {
    // Update local state immediately for responsive UI
    const updated = [...facilities, facility];
    setFacilities(updated);
    localStorage.setItem('uoftflow_facilities', JSON.stringify(updated));

    // Try to save to Supabase if connected
    if (supabaseConnected) {
      try {
        console.log(`💾 Saving ${facility.type} to Supabase...`);
        
        if (facility.type === 'toilet') {
          // Save to washrooms table
          const { error } = await supabase.from('washrooms').insert({
            id: facility.id,
            campus: facility.campus,
            building: facility.building,
            building_code: facility.buildingCode,
            floor: facility.floor,
            room: facility.room,
            address: facility.address,
            lat: facility.lat,
            lng: facility.lng,
            gender_designation: facility.genderDesignation,
            accessible: facility.accessible,
            baby_change_station: facility.hasBabyChangeStation,
            free_menstrual_products: facility.hasFreeMenstrualProducts,
            notes: facility.notes,
            created_at: facility.createdAt,
            created_by: facility.createdBy,
          });
          
          if (error) {
            console.error('❌ Failed to save washroom to Supabase:', error.message);
          } else {
            console.log('✅ Washroom saved to Supabase successfully');
          }
        } else if (facility.type === 'fountain') {
          // Save to fountains table
          const { error } = await supabase.from('fountains').insert({
            id: facility.id,
            type: facility.type,
            name: facility.name,
            building: facility.building,
            floor_note: facility.floorNote,
            address: facility.address,
            campus: facility.campus,
            lat: facility.lat,
            lng: facility.lng,
            has_bottle_filler: facility.hasBottleFiller,
            has_chilled: facility.hasChilled,
            created_at: facility.createdAt,
            created_by: facility.createdBy,
          });
          
          if (error) {
            console.error('❌ Failed to save fountain to Supabase:', error.message);
          } else {
            console.log('✅ Fountain saved to Supabase successfully');
          }
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
    console.log('✅ Review added to localStorage');

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
        has_toilet_paper: review.hasToiletPaper,
        has_soap: review.hasSoap,
        has_stall_lock: review.hasStallLock,
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
        has_toilet_paper: review.hasToiletPaper,
        has_soap: review.hasSoap,
        has_stall_lock: review.hasStallLock,
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

  const requestLocation = useCallback(() => {
    console.log('📍 Requesting location...');
    if (!navigator.geolocation) {
      console.error('❌ Geolocation not supported');
      setLocationError('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log('✅ Location received:', pos.coords);
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationError(null);
      },
      (err) => {
        console.error('❌ Location error:', err);
        setLocationError(err.message || 'Unable to get location');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

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

    // Calculate distance ONLY if user location and facility coordinates are available
    // No logging here to avoid console spam when location is denied
    let distance: number | undefined;
    if (userLocation && f.lat && f.lng) {
      distance = calculateDistance(userLocation.lat, userLocation.lng, f.lat, f.lng);
    }

    return {
      ...f,
      avgRating,
      avgCleanliness,
      reviewCount: facilityReviews.length,
      distance,
    };
  });

  const refreshData = async () => {
    console.log('🔄 Forcing data refresh from Supabase...');
    // Clear localStorage
    localStorage.removeItem('uoftflow_facilities');
    localStorage.removeItem('uoftflow_reviews');
    localStorage.removeItem('uoftflow_reports');
    console.log('✅ Cleared localStorage');
    // Reload data
    await loadData();
  };

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
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
