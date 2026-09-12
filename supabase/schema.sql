-- UofT Flow Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. FACILITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('toilet', 'fountain')),
  name TEXT NOT NULL,
  building TEXT NOT NULL,
  floor_note TEXT NOT NULL,
  gender_designation TEXT CHECK (gender_designation IN ('Men''s', 'Women''s', 'All-gender')),
  accessible BOOLEAN DEFAULT FALSE,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  has_bottle_filler BOOLEAN DEFAULT FALSE,
  has_chilled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT NOT NULL
);

-- ============================================
-- 3. REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  cleanliness_rating INTEGER NOT NULL CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  condition TEXT NOT NULL CHECK (condition IN ('Excellent', 'Good', 'Needs attention', 'Out of order')),
  comment TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_facilities_type ON public.facilities(type);
CREATE INDEX IF NOT EXISTS idx_facilities_building ON public.facilities(building);
CREATE INDEX IF NOT EXISTS idx_reviews_facility_id ON public.reviews(facility_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, authenticated insert, users can update their own
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Facilities: public read, authenticated insert
CREATE POLICY "Facilities are viewable by everyone" ON public.facilities
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert facilities" ON public.facilities
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Reviews: public read, authenticated insert, authors can delete their own
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own reviews" ON public.reviews
  FOR DELETE USING (auth.uid()::text = user_id);

-- ============================================
-- 6. SEED DATA (Optional)
-- ============================================
-- You can insert the seed facilities and reviews from the app's seedData.ts
-- Or run the app once and it will populate localStorage as a fallback

-- Example seed insert (uncomment to use):
-- INSERT INTO public.facilities (id, type, name, building, floor_note, gender_designation, accessible, lat, lng, created_by)
-- VALUES 
--   ('robarts-m-1', 'toilet', 'Robarts Library Main Floor Washroom', 'Robarts Library', '1st Floor, near main entrance', 'All-gender', true, 43.6650, -79.3974, 'seed'),
--   ('robarts-f-1', 'fountain', 'Robarts 1st Floor Fountain', 'Robarts Library', '1st Floor, near staircase', NULL, true, 43.6649, -79.3975, 'seed');

-- ============================================
-- 7. AUTO-CREATE PROFILE ON SIGNUP (Trigger)
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
