export type FacilityType = 'toilet' | 'fountain';
export type GenderDesignation = "Men's" | "Women's" | 'All-gender';
export type Condition = 'Excellent' | 'Good' | 'Needs attention' | 'Out of order';
export type ReportReason = 'spam' | 'inappropriate' | 'false-info' | 'harassment' | 'other';
export type ReportStatus = 'pending' | 'reviewed' | 'dismissed';

export interface Facility {
  id: string;
  type: FacilityType;
  name: string;
  building: string;
  floorNote: string;
  address: string;
  genderDesignation?: GenderDesignation;
  accessible: boolean;
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
  reportCount?: number;
  // Toilet-specific amenities (optional, only for toilets)
  hasToiletPaper?: boolean;
  hasSoap?: boolean;
  hasStallLock?: boolean;
}

export interface Report {
  id: string;
  reviewId: string;
  reporterId: string;
  reporterName: string;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  createdAt: string;
}

export interface FacilityWithStats extends Facility {
  avgRating: number;
  avgCleanliness: number;
  reviewCount: number;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
}

export type SortOption = 'cleanliness' | 'rating';
export type FilterType = 'all' | 'toilet' | 'fountain';
