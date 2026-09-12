export type FacilityType = 'toilet' | 'fountain';
export type GenderDesignation = "Men's" | "Women's" | 'All-gender';
export type Condition = 'Excellent' | 'Good' | 'Needs attention' | 'Out of order';

export interface Facility {
  id: string;
  type: FacilityType;
  name: string;
  building: string;
  floorNote: string;
  genderDesignation?: GenderDesignation;
  accessible: boolean;
  lat: number;
  lng: number;
  hasBottleFiller?: boolean;
  hasChilled?: boolean;
  createdAt: string;
  createdBy: string;
}

export interface Review {
  id: string;
  facilityId: string;
  userId: string;
  userName: string;
  overallRating: number; // 1-5
  cleanlinessRating: number; // 1-5
  condition: Condition;
  comment: string;
  createdAt: string;
}

export interface FacilityWithStats extends Facility {
  avgRating: number;
  avgCleanliness: number;
  reviewCount: number;
  distance?: number;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
}

export type SortOption = 'distance' | 'cleanliness' | 'rating';
export type FilterType = 'all' | 'toilet' | 'fountain';
