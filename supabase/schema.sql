-- UofT Flow — Supabase Database Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query → Run
--
-- This creates all tables, indexes, RLS policies, and triggers needed by UofT Flow.
-- Safe to re-run (uses IF NOT EXISTS and ON CONFLICT DO NOTHING).

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
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('toilet', 'fountain')),
  name TEXT NOT NULL,
  building TEXT NOT NULL,
  floor_note TEXT NOT NULL,
  gender_designation TEXT CHECK (gender_designation IS NULL OR gender_designation IN ('Men''s', 'Women''s', 'All-gender')),
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
  id TEXT PRIMARY KEY,
  facility_id TEXT NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  cleanliness_rating INTEGER NOT NULL CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  condition TEXT NOT NULL CHECK (condition IN ('Excellent', 'Good', 'Needs attention', 'Out of order')),
  comment TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. INDEXES (for fast queries)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_facilities_type ON public.facilities(type);
CREATE INDEX IF NOT EXISTS idx_facilities_building ON public.facilities(building);
CREATE INDEX IF NOT EXISTS idx_reviews_facility_id ON public.reviews(facility_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS) — CRITICAL FOR SECURITY
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Force RLS even for table owners (defense in depth)
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.facilities FORCE ROW LEVEL SECURITY;
ALTER TABLE public.reviews FORCE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts on re-run
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "facilities_select" ON public.facilities;
DROP POLICY IF EXISTS "facilities_insert" ON public.facilities;
DROP POLICY IF EXISTS "reviews_select" ON public.reviews;
DROP POLICY IF EXISTS "reviews_insert" ON public.reviews;
DROP POLICY IF EXISTS "reviews_delete" ON public.reviews;

-- PROFILES: public read, users can only insert/update their own
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- FACILITIES: public read, authenticated insert
CREATE POLICY "facilities_select" ON public.facilities
  FOR SELECT USING (true);

CREATE POLICY "facilities_insert" ON public.facilities
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- REVIEWS: public read, authenticated insert, authors can delete their own
CREATE POLICY "reviews_select" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "reviews_insert" ON public.reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "reviews_delete" ON public.reviews
  FOR DELETE USING (auth.uid()::text = user_id);

-- ============================================
-- 6. SEED DATA — Pre-populate with UofT St. George facilities
-- ============================================
INSERT INTO public.facilities (id, type, name, building, floor_note, gender_designation, accessible, lat, lng, has_bottle_filler, has_chilled, created_by) VALUES
  ('robarts-m-1', 'toilet', 'Robarts Library Main Floor Washroom', 'Robarts Library', '1st Floor, near main entrance', 'All-gender', true, 43.6650, -79.3974, false, false, 'seed'),
  ('robarts-m-5', 'toilet', 'Robarts 5th Floor Washroom', 'Robarts Library', '5th Floor, east wing', 'Men''s', false, 43.6651, -79.3972, false, false, 'seed'),
  ('robarts-f-1', 'fountain', 'Robarts 1st Floor Fountain', 'Robarts Library', '1st Floor, near staircase', NULL, true, 43.6649, -79.3975, true, true, 'seed'),
  ('ss-101-m', 'toilet', 'Sidney Smith Hall 1081 Washroom', 'Sidney Smith Hall', '1st Floor, Room 1081 area', 'Women''s', true, 43.6612, -79.3962, false, false, 'seed'),
  ('ss-3089-m', 'toilet', 'Sidney Smith 3rd Floor Washroom', 'Sidney Smith Hall', '3rd Floor, near lecture halls', 'Men''s', false, 43.6613, -79.3960, false, false, 'seed'),
  ('ss-fountain', 'fountain', 'Sidney Smith Hall Fountain', 'Sidney Smith Hall', '2nd Floor, main corridor', NULL, false, 43.6611, -79.3963, false, true, 'seed'),
  ('bahen-m-1', 'toilet', 'Bahen Centre 2nd Floor Washroom', 'Bahen Centre', '2nd Floor, east side', 'All-gender', true, 43.6597, -79.3973, false, false, 'seed'),
  ('bahen-m-4', 'toilet', 'Bahen Centre 4th Floor Washroom', 'Bahen Centre', '4th Floor, near CS labs', 'All-gender', true, 43.6598, -79.3972, false, false, 'seed'),
  ('bahen-fountain', 'fountain', 'Bahen Centre Lobby Fountain', 'Bahen Centre', 'Ground Floor, main lobby', NULL, true, 43.6596, -79.3974, true, true, 'seed'),
  ('gerstein-m', 'toilet', 'Gerstein Library Washroom', 'Gerstein Science Information Centre', '2nd Floor, north side', 'Women''s', true, 43.6635, -79.3942, false, false, 'seed'),
  ('gerstein-fountain', 'fountain', 'Gerstein Library Fountain', 'Gerstein Science Information Centre', '1st Floor, near reading room', NULL, true, 43.6634, -79.3943, true, false, 'seed'),
  ('myhal-m', 'toilet', 'Myhal Centre 3rd Floor Washroom', 'Myhal Centre for Engineering Innovation', '3rd Floor, near atrium', 'All-gender', true, 43.6600, -79.3935, false, false, 'seed'),
  ('myhal-fountain', 'fountain', 'Myhal Centre Fountain', 'Myhal Centre for Engineering Innovation', '1st Floor, main entrance', NULL, true, 43.6599, -79.3936, true, true, 'seed'),
  ('harthouse-m', 'toilet', 'Hart House Ground Floor Washroom', 'Hart House', 'Ground Floor, near Great Hall', 'Men''s', true, 43.6645, -79.3915, false, false, 'seed'),
  ('harthouse-f', 'fountain', 'Hart House Fountain', 'Hart House', 'Ground Floor, corridor', NULL, false, 43.6644, -79.3916, false, false, 'seed'),
  ('medsci-m', 'toilet', 'Medical Sciences 2nd Floor Washroom', 'Medical Sciences Building', '2nd Floor, east corridor', 'Women''s', true, 43.6620, -79.3930, false, false, 'seed'),
  ('medsci-fountain', 'fountain', 'Medical Sciences Fountain', 'Medical Sciences Building', '1st Floor, main hallway', NULL, true, 43.6619, -79.3931, true, true, 'seed'),
  ('koffler-m', 'toilet', 'Koffler Student Services Centre Washroom', 'Koffler House', '2nd Floor, near food court', 'All-gender', true, 43.6605, -79.3955, false, false, 'seed'),
  ('koffler-fountain', 'fountain', 'Koffler House Fountain', 'Koffler House', '1st Floor, main lobby', NULL, true, 43.6604, -79.3956, true, true, 'seed')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. SEED REVIEWS
-- ============================================
INSERT INTO public.reviews (id, facility_id, user_id, user_name, overall_rating, cleanliness_rating, condition, comment, created_at) VALUES
  ('r1', 'robarts-m-1', 'seed1', 'StudyGrinder', 4, 4, 'Good', 'Pretty clean, always stocked. Gets busy during exam season.', '2026-03-01T14:30:00Z'),
  ('r2', 'robarts-m-1', 'seed2', 'CampusWalker', 5, 5, 'Excellent', 'Spotless! Best all-gender option on campus.', '2026-03-05T09:15:00Z'),
  ('r3', 'robarts-m-1', 'seed3', 'BioMajor22', 3, 3, 'Needs attention', 'Was a bit messy today, hopefully they clean it soon.', '2026-03-10T16:45:00Z'),
  ('r4', 'robarts-m-5', 'seed1', 'StudyGrinder', 3, 2, 'Needs attention', 'Not the cleanest. Smells a bit.', '2026-02-28T11:00:00Z'),
  ('r5', 'robarts-m-5', 'seed4', 'NightOwl', 4, 4, 'Good', 'Usually fine during the day. Gets rough late at night.', '2026-03-08T22:00:00Z'),
  ('r6', 'robarts-f-1', 'seed2', 'CampusWalker', 5, 5, 'Excellent', 'Cold water, bottle filler works great!', '2026-03-02T10:00:00Z'),
  ('r7', 'ss-101-m', 'seed3', 'BioMajor22', 4, 4, 'Good', 'Clean and well-maintained. Good for between classes.', '2026-03-04T13:20:00Z'),
  ('r8', 'ss-3089-m', 'seed4', 'NightOwl', 2, 2, 'Needs attention', 'Pretty rough condition. Avoid if you can.', '2026-03-06T15:30:00Z'),
  ('r9', 'ss-3089-m', 'seed1', 'StudyGrinder', 3, 3, 'Good', 'Meh, it works. Not amazing.', '2026-03-09T10:00:00Z'),
  ('r10', 'bahen-m-1', 'seed2', 'CampusWalker', 5, 5, 'Excellent', 'Modern, clean, always stocked. Love the all-gender setup!', '2026-03-03T11:45:00Z'),
  ('r11', 'bahen-m-4', 'seed5', 'CS_student', 4, 4, 'Good', 'Good spot if you are in the CS labs. Clean most days.', '2026-03-07T14:00:00Z'),
  ('r12', 'bahen-fountain', 'seed3', 'BioMajor22', 5, 5, 'Excellent', 'Best fountain on campus! Cold and fast.', '2026-03-01T09:30:00Z'),
  ('r13', 'gerstein-m', 'seed4', 'NightOwl', 3, 3, 'Good', 'Average. Gets the job done.', '2026-03-05T16:00:00Z'),
  ('r14', 'myhal-m', 'seed5', 'CS_student', 5, 5, 'Excellent', 'Brand new building, everything is clean and modern!', '2026-03-02T13:00:00Z'),
  ('r15', 'myhal-fountain', 'seed2', 'CampusWalker', 4, 4, 'Good', 'Nice bottle filler. Water is cold.', '2026-03-06T10:30:00Z'),
  ('r16', 'harthouse-m', 'seed1', 'StudyGrinder', 4, 4, 'Good', 'Nice washroom, historic building vibes. Clean.', '2026-03-04T12:00:00Z'),
  ('r17', 'medsci-m', 'seed3', 'BioMajor22', 4, 4, 'Good', 'Clean and well-maintained. Good between lectures.', '2026-03-08T09:00:00Z'),
  ('r18', 'medsci-fountain', 'seed4', 'NightOwl', 3, 3, 'Good', 'Works fine, nothing special.', '2026-03-09T14:30:00Z'),
  ('r19', 'koffler-m', 'seed5', 'CS_student', 3, 3, 'Needs attention', 'Gets messy during lunch rush. Try before noon.', '2026-03-07T12:30:00Z'),
  ('r20', 'koffler-fountain', 'seed2', 'CampusWalker', 4, 4, 'Good', 'Reliable fountain, always works.', '2026-03-03T15:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. AUTO-CREATE PROFILE ON SIGNUP (Trigger)
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- DONE! Verify by running:
-- SELECT COUNT(*) FROM public.facilities;  -- should return 19
-- SELECT COUNT(*) FROM public.reviews;     -- should return 20
-- ============================================
