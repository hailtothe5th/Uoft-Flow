-- UofT Flow Database Setup
-- Copy EVERYTHING below this line and paste into Supabase SQL Editor

DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.facilities CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.facilities (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('toilet', 'fountain')),
  name TEXT NOT NULL,
  building TEXT NOT NULL,
  floor_note TEXT NOT NULL,
  address TEXT NOT NULL,
  gender_designation TEXT CHECK (gender_designation IS NULL OR gender_designation IN ('Men''s', 'Women''s', 'All-gender')),
  accessible BOOLEAN DEFAULT FALSE,
  has_bottle_filler BOOLEAN DEFAULT FALSE,
  has_chilled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT NOT NULL
);

CREATE TABLE public.reviews (
  id TEXT PRIMARY KEY,
  facility_id TEXT NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  cleanliness_rating INTEGER NOT NULL CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  condition TEXT NOT NULL CHECK (condition IN ('Excellent', 'Good', 'Needs attention', 'Out of order')),
  comment TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  report_count INTEGER DEFAULT 0,
  -- Toilet-specific amenities (only populated for toilet reviews)
  has_toilet_paper BOOLEAN,
  has_soap BOOLEAN,
  has_stall_lock BOOLEAN
);

CREATE INDEX idx_facilities_type ON public.facilities(type);
CREATE INDEX idx_facilities_building ON public.facilities(building);
CREATE INDEX idx_reviews_facility_id ON public.reviews(facility_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_created_at ON public.reviews(created_at DESC);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.facilities FORCE ROW LEVEL SECURITY;
ALTER TABLE public.reviews FORCE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "facilities_select" ON public.facilities FOR SELECT USING (true);
CREATE POLICY "facilities_insert" ON public.facilities FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "reviews_select" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON public.reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "reviews_delete" ON public.reviews FOR DELETE USING (auth.uid()::text = user_id);

INSERT INTO public.facilities (id, type, name, building, floor_note, address, gender_designation, accessible, has_bottle_filler, has_chilled, created_by) VALUES
('robarts-m-1', 'toilet', 'Robarts Library Main Floor Washroom', 'Robarts Library', '1st Floor, near main entrance', '130 St George St, Toronto, ON M5S 1A5', 'All-gender', true, false, false, 'seed'),
('robarts-m-5', 'toilet', 'Robarts 5th Floor Washroom', 'Robarts Library', '5th Floor, east wing', '130 St George St, Toronto, ON M5S 1A5', 'Men''s', false, false, false, 'seed'),
('robarts-f-1', 'fountain', 'Robarts 1st Floor Fountain', 'Robarts Library', '1st Floor, near staircase', '130 St George St, Toronto, ON M5S 1A5', NULL, true, true, true, 'seed'),
('ss-101-m', 'toilet', 'Sidney Smith Hall 1081 Washroom', 'Sidney Smith Hall', '1st Floor, Room 1081 area', '100 St George St, Toronto, ON M5S 3G4', 'Women''s', true, false, false, 'seed'),
('ss-3089-m', 'toilet', 'Sidney Smith 3rd Floor Washroom', 'Sidney Smith Hall', '3rd Floor, near lecture halls', '100 St George St, Toronto, ON M5S 3G4', 'Men''s', false, false, false, 'seed'),
('ss-fountain', 'fountain', 'Sidney Smith Hall Fountain', 'Sidney Smith Hall', '2nd Floor, main corridor', '100 St George St, Toronto, ON M5S 3G4', NULL, false, false, true, 'seed'),
('bahen-m-1', 'toilet', 'Bahen Centre 2nd Floor Washroom', 'Bahen Centre', '2nd Floor, east side', '40 St George St, Toronto, ON M5S 2E4', 'All-gender', true, false, false, 'seed'),
('bahen-m-4', 'toilet', 'Bahen Centre 4th Floor Washroom', 'Bahen Centre', '4th Floor, near CS labs', '40 St George St, Toronto, ON M5S 2E4', 'All-gender', true, false, false, 'seed'),
('bahen-fountain', 'fountain', 'Bahen Centre Lobby Fountain', 'Bahen Centre', 'Ground Floor, main lobby', '40 St George St, Toronto, ON M5S 2E4', NULL, true, true, true, 'seed'),
('gerstein-m', 'toilet', 'Gerstein Library Washroom', 'Gerstein Science Information Centre', '2nd Floor, north side', '9 King''s College Circle, Toronto, ON M5S 1A8', 'Women''s', true, false, false, 'seed'),
('gerstein-fountain', 'fountain', 'Gerstein Library Fountain', 'Gerstein Science Information Centre', '1st Floor, near reading room', '9 King''s College Circle, Toronto, ON M5S 1A8', NULL, true, true, false, 'seed'),
('myhal-m', 'toilet', 'Myhal Centre 3rd Floor Washroom', 'Myhal Centre for Engineering Innovation', '3rd Floor, near atrium', '55 St George St, Toronto, ON M5S 1A4', 'All-gender', true, false, false, 'seed'),
('myhal-fountain', 'fountain', 'Myhal Centre Fountain', 'Myhal Centre for Engineering Innovation', '1st Floor, main entrance', '55 St George St, Toronto, ON M5S 1A4', NULL, true, true, true, 'seed'),
('harthouse-m', 'toilet', 'Hart House Ground Floor Washroom', 'Hart House', 'Ground Floor, near Great Hall', '7 Hart House Circle, Toronto, ON M5S 3H4', 'Men''s', true, false, false, 'seed'),
('harthouse-f', 'fountain', 'Hart House Fountain', 'Hart House', 'Ground Floor, corridor', '7 Hart House Circle, Toronto, ON M5S 3H4', NULL, false, false, false, 'seed'),
('medsci-m', 'toilet', 'Medical Sciences 2nd Floor Washroom', 'Medical Sciences Building', '2nd Floor, east corridor', '1 King''s College Circle, Toronto, ON M5S 1A8', 'Women''s', true, false, false, 'seed'),
('medsci-fountain', 'fountain', 'Medical Sciences Fountain', 'Medical Sciences Building', '1st Floor, main hallway', '1 King''s College Circle, Toronto, ON M5S 1A8', NULL, true, true, true, 'seed'),
('koffler-m', 'toilet', 'Koffler Student Services Centre Washroom', 'Koffler House', '2nd Floor, near food court', '214 College St, Toronto, ON M5T 2Z9', 'All-gender', true, false, false, 'seed'),
('koffler-fountain', 'fountain', 'Koffler House Fountain', 'Koffler House', '1st Floor, main lobby', '214 College St, Toronto, ON M5T 2Z9', NULL, true, true, true, 'seed');

INSERT INTO public.reviews (id, facility_id, user_id, user_name, overall_rating, cleanliness_rating, condition, comment, created_at) VALUES
('r1', 'robarts-m-1', 'seed1', 'StudyGrinder', 4, 4, 'Good', 'Pretty clean, always stocked. Gets busy during exam season.', '2026-03-01 14:30:00'),
('r2', 'robarts-m-1', 'seed2', 'CampusWalker', 5, 5, 'Excellent', 'Spotless! Best all-gender option on campus.', '2026-03-05 09:15:00'),
('r3', 'robarts-m-1', 'seed3', 'BioMajor22', 3, 3, 'Needs attention', 'Was a bit messy today, hopefully they clean it soon.', '2026-03-10 16:45:00'),
('r4', 'robarts-m-5', 'seed1', 'StudyGrinder', 3, 2, 'Needs attention', 'Not the cleanest. Smells a bit.', '2026-02-28 11:00:00'),
('r5', 'robarts-m-5', 'seed4', 'NightOwl', 4, 4, 'Good', 'Usually fine during the day. Gets rough late at night.', '2026-03-08 22:00:00'),
('r6', 'robarts-f-1', 'seed2', 'CampusWalker', 5, 5, 'Excellent', 'Cold water, bottle filler works great!', '2026-03-02 10:00:00'),
('r7', 'ss-101-m', 'seed3', 'BioMajor22', 4, 4, 'Good', 'Clean and well-maintained. Good for between classes.', '2026-03-04 13:20:00'),
('r8', 'ss-3089-m', 'seed4', 'NightOwl', 2, 2, 'Needs attention', 'Pretty rough condition. Avoid if you can.', '2026-03-06 15:30:00'),
('r9', 'ss-3089-m', 'seed1', 'StudyGrinder', 3, 3, 'Good', 'Meh, it works. Not amazing.', '2026-03-09 10:00:00'),
('r10', 'bahen-m-1', 'seed2', 'CampusWalker', 5, 5, 'Excellent', 'Modern, clean, always stocked. Love the all-gender setup!', '2026-03-03 11:45:00'),
('r11', 'bahen-m-4', 'seed5', 'CS_student', 4, 4, 'Good', 'Good spot if you are in the CS labs. Clean most days.', '2026-03-07 14:00:00'),
('r12', 'bahen-fountain', 'seed3', 'BioMajor22', 5, 5, 'Excellent', 'Best fountain on campus! Cold and fast.', '2026-03-01 09:30:00'),
('r13', 'gerstein-m', 'seed4', 'NightOwl', 3, 3, 'Good', 'Average. Gets the job done.', '2026-03-05 16:00:00'),
('r14', 'myhal-m', 'seed5', 'CS_student', 5, 5, 'Excellent', 'Brand new building, everything is clean and modern!', '2026-03-02 13:00:00'),
('r15', 'myhal-fountain', 'seed2', 'CampusWalker', 4, 4, 'Good', 'Nice bottle filler. Water is cold.', '2026-03-06 10:30:00'),
('r16', 'harthouse-m', 'seed1', 'StudyGrinder', 4, 4, 'Good', 'Nice washroom, historic building vibes. Clean.', '2026-03-04 12:00:00'),
('r17', 'medsci-m', 'seed3', 'BioMajor22', 4, 4, 'Good', 'Clean and well-maintained. Good between lectures.', '2026-03-08 09:00:00'),
('r18', 'medsci-fountain', 'seed4', 'NightOwl', 3, 3, 'Good', 'Works fine, nothing special.', '2026-03-09 14:30:00'),
('r19', 'koffler-m', 'seed5', 'CS_student', 3, 3, 'Needs attention', 'Gets messy during lunch rush. Try before noon.', '2026-03-07 12:30:00'),
('r20', 'koffler-fountain', 'seed2', 'CampusWalker', 4, 4, 'Good', 'Reliable fountain, always works.', '2026-03-03 15:00:00'),
('r21', 'robarts-m-1', 'seed6', 'BookWorm99', 5, 5, 'Excellent', 'Always my go-to washroom when studying at Robarts. Impeccably clean!', '2026-03-12 10:15:00'),
('r22', 'robarts-m-1', 'seed7', 'EngineeringKid', 4, 4, 'Good', 'Very convenient location. Clean most of the time.', '2026-03-15 14:20:00'),
('r23', 'robarts-m-5', 'seed8', 'LateNightStudier', 3, 2, 'Needs attention', 'Wasn''t great at 2am. Understandable but could be better.', '2026-03-18 02:30:00'),
('r24', 'robarts-f-1', 'seed9', 'HydrationHero', 5, 5, 'Excellent', 'Love the bottle filler! Water is always cold and refreshing.', '2026-03-20 11:45:00'),
('r25', 'ss-101-m', 'seed10', 'PolySciMajor', 4, 4, 'Good', 'Solid washroom. Nothing fancy but does the job well.', '2026-03-14 09:30:00'),
('r26', 'ss-101-m', 'seed11', 'CampusVisitor', 5, 5, 'Excellent', 'Surprisingly clean! Was impressed.', '2026-03-22 16:00:00'),
('r27', 'ss-3089-m', 'seed12', 'PhilosophyPhD', 2, 2, 'Needs attention', 'Really needs more frequent cleaning. Not great.', '2026-03-25 13:15:00'),
('r28', 'ss-fountain', 'seed13', 'ThirstyStudent', 4, 4, 'Good', 'Works well, good water pressure.', '2026-03-19 10:00:00'),
('r29', 'bahen-m-1', 'seed14', 'MathMajor', 5, 5, 'Excellent', 'Best washroom in Bahen hands down. Always clean!', '2026-03-16 15:30:00'),
('r30', 'bahen-m-1', 'seed15', 'StatsNerd', 4, 4, 'Good', 'Very clean and modern. Appreciate the all-gender option.', '2026-03-21 11:20:00'),
('r31', 'bahen-m-4', 'seed16', 'CodeMonkey', 4, 4, 'Good', 'Convenient for CS labs. Usually clean.', '2026-03-24 14:45:00'),
('r32', 'bahen-fountain', 'seed17', 'WaterLover', 5, 5, 'Excellent', 'Perfect fountain! Cold water and bottle filler works great.', '2026-03-17 09:15:00'),
('r33', 'gerstein-m', 'seed18', 'MedStudent', 4, 4, 'Good', 'Good washroom for science library. Clean and quiet.', '2026-03-23 16:30:00'),
('r34', 'gerstein-m', 'seed19', 'ResearchAssistant', 3, 3, 'Good', 'Decent. Could be a bit cleaner but acceptable.', '2026-03-26 10:45:00'),
('r35', 'gerstein-fountain', 'seed20', 'LabTech', 4, 4, 'Good', 'Reliable fountain in a good location.', '2026-03-28 13:00:00'),
('r36', 'myhal-m', 'seed21', 'MechEng', 5, 5, 'Excellent', 'New building means everything is pristine. Love it!', '2026-03-27 11:30:00'),
('r37', 'myhal-m', 'seed22', 'CivilEng', 5, 5, 'Excellent', 'Best washroom facilities on campus. Modern and spotless.', '2026-03-29 15:15:00'),
('r38', 'myhal-fountain', 'seed23', 'ElectricalEng', 5, 5, 'Excellent', 'Excellent bottle filler! Very convenient.', '2026-03-30 09:45:00'),
('r39', 'harthouse-m', 'seed24', 'HistoryBuff', 4, 4, 'Good', 'Nice washroom in a beautiful historic building. Well maintained.', '2026-03-31 14:00:00'),
('r40', 'harthouse-m', 'seed25', 'ArtStudent', 5, 5, 'Excellent', 'Impressed with how clean it is given the age of the building.', '2026-04-02 10:30:00'),
('r41', 'harthouse-f', 'seed26', 'MusicMajor', 3, 3, 'Good', 'Works fine but nothing special. Average fountain.', '2026-04-03 16:45:00'),
('r42', 'medsci-m', 'seed27', 'NursingStudent', 4, 4, 'Good', 'Clean washroom, good location for med students.', '2026-04-01 11:15:00'),
('r43', 'medsci-m', 'seed28', 'PreMed', 3, 3, 'Needs attention', 'Gets busy and messy around lunch time. Avoid 12-1pm.', '2026-04-04 13:30:00'),
('r44', 'medsci-fountain', 'seed29', 'PharmacyStudent', 4, 4, 'Good', 'Good fountain, convenient location in the building.', '2026-04-05 09:00:00'),
('r45', 'koffler-m', 'seed30', 'InternationalStudent', 4, 4, 'Good', 'Clean and accessible. Good location near food court.', '2026-04-06 15:45:00'),
('r46', 'koffler-m', 'seed31', 'FirstYear', 5, 5, 'Excellent', 'Very clean washroom! Always well-stocked.', '2026-04-08 10:00:00'),
('r47', 'koffler-fountain', 'seed32', 'CommuterStudent', 4, 4, 'Good', 'Reliable fountain, use it often.', '2026-04-09 14:30:00'),
('r48', 'koffler-fountain', 'seed33', 'StudentUnion', 4, 4, 'Good', 'Good fountain in a busy area. Works well.', '2026-04-10 11:00:00');

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
