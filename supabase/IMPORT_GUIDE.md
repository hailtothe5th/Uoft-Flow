# Supabase Data Import Guide

This guide explains how to import the seed data (19 facilities and 48 reviews) into your Supabase database.

## Option 1: SQL Import (Recommended)

The SQL file contains everything you need: table creation, security policies, and all seed data.

### Steps:

1. **Open Supabase Dashboard**
   - Go to your Supabase project: https://supabase.com/dashboard/project/wzjvdwgocqzgdrxjvfir

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar

3. **Run the SQL File**
   - Copy the entire contents of `supabase/complete_setup_with_seed_data.sql`
   - Paste it into the SQL Editor
   - Click "Run" or press Ctrl+Enter (Cmd+Enter on Mac)

4. **Verify the Import**
   - You should see "Success. No rows returned"
   - Run these verification queries:
   ```sql
   SELECT COUNT(*) as facility_count FROM public.facilities;  -- Should return 19
   SELECT COUNT(*) as review_count FROM public.reviews;        -- Should return 48
   ```

### What the SQL File Does:

- ✅ Drops existing tables (for clean re-install)
- ✅ Creates `profiles`, `facilities`, and `reviews` tables
- ✅ Creates indexes for better performance
- ✅ Enables Row Level Security (RLS)
- ✅ Creates security policies for authenticated users
- ✅ Inserts 19 facilities across 8 UofT buildings
- ✅ Inserts 48 realistic reviews
- ✅ Creates auto-profile trigger for new users
- ✅ Applies security fixes for SECURITY DEFINER functions

---

## Option 2: CSV Import

If you prefer to use CSV files, you'll need to create the tables first, then import the data.

### Step 1: Create Tables

Run this SQL in the SQL Editor first:

```sql
-- Create facilities table
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

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  facility_id TEXT NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  cleanliness_rating INTEGER NOT NULL CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  condition TEXT NOT NULL CHECK (condition IN ('Excellent', 'Good', 'Needs attention', 'Out of order')),
  comment TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  report_count INTEGER DEFAULT 0
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Step 2: Import CSV Files

**For Facilities:**
1. Go to "Table Editor" in Supabase
2. Click on the `facilities` table
3. Click the "Import data" button (or use the three-dot menu)
4. Select "Import from CSV"
5. Upload `supabase/facilities.csv`
6. Make sure "First row is header" is checked
7. Click "Import"

**For Reviews:**
1. Go to "Table Editor" in Supabase
2. Click on the `reviews` table
3. Click the "Import data" button
4. Select "Import from CSV"
5. Upload `supabase/reviews.csv`
6. Make sure "First row is header" is checked
7. Click "Import"

### Step 3: Enable Security

After importing, run this SQL to enable security:

```sql
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "facilities_select" ON public.facilities FOR SELECT USING (true);
CREATE POLICY "facilities_insert" ON public.facilities FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "reviews_select" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON public.reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "reviews_delete" ON public.reviews FOR DELETE USING (auth.uid()::text = user_id);
```

---

## Verification

After importing, verify the data:

```sql
-- Check facility count
SELECT COUNT(*) FROM public.facilities;  -- Should return 19

-- Check review count
SELECT COUNT(*) FROM public.reviews;     -- Should return 48

-- View sample facilities
SELECT id, name, building, type FROM public.facilities LIMIT 5;

-- View sample reviews
SELECT id, facility_id, user_name, overall_rating, comment FROM public.reviews LIMIT 5;

-- Check reviews per facility
SELECT f.name, COUNT(r.id) as review_count 
FROM public.facilities f 
LEFT JOIN public.reviews r ON f.id = r.facility_id 
GROUP BY f.id, f.name 
ORDER BY review_count DESC;
```

---

## Icon Setup

The app icon has been moved to `public/images/icon.svg` and the HTML has been updated to reference it:

```html
<link rel="icon" href="images/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="images/icon.svg">
```

### Converting to ICO (Optional)

If you need an `.ico` file for older browser support:

1. Use an online converter like:
   - https://convertio.co/svg-ico/
   - https://image.online-convert.com/convert-to-ico
   - https://icoconvert.com/

2. Upload `public/images/icon.svg`

3. Download the `.ico` file

4. Save it as `public/images/icon.ico`

5. Update `index.html`:
   ```html
   <link rel="icon" href="images/icon.ico" type="image/x-icon">
   ```

**Note:** Modern browsers (Chrome, Firefox, Safari, Edge) fully support SVG favicons, so the `.ico` conversion is optional.

---

## Troubleshooting

### Issue: "relation already exists"
**Solution:** The SQL file includes `DROP TABLE IF EXISTS` statements, so re-running it should work fine.

### Issue: "permission denied"
**Solution:** Make sure you're running the SQL as a user with proper permissions (usually the default postgres user).

### Issue: CSV import fails
**Solution:** 
- Make sure the tables exist before importing
- Check that column names match exactly
- Ensure boolean values are `true`/`false` (not `TRUE`/`FALSE`)
- Empty gender_designation should be blank (not NULL)

### Issue: Reviews don't show up in app
**Solution:**
- Check browser console for connection errors
- Verify the database status indicator shows "Connected to Supabase"
- Refresh the page after importing data

---

## Data Summary

### Facilities (19 total)
- **Robarts Library**: 2 toilets, 1 fountain
- **Sidney Smith Hall**: 2 toilets, 1 fountain
- **Bahen Centre**: 2 toilets, 1 fountain
- **Gerstein Science Library**: 1 toilet, 1 fountain
- **Myhal Centre**: 1 toilet, 1 fountain
- **Hart House**: 1 toilet, 1 fountain
- **Medical Sciences**: 1 toilet, 1 fountain
- **Koffler House**: 1 toilet, 1 fountain

### Reviews (48 total)
- Average rating: 4.0 stars
- Rating distribution:
  - 5 stars: ~35%
  - 4 stars: ~40%
  - 3 stars: ~20%
  - 2 stars: ~5%
- All reviews are from realistic student usernames
- Comments cover various conditions and experiences

---

## Next Steps

1. ✅ Import data using SQL or CSV
2. ✅ Verify data in Supabase
3. ✅ Refresh your app
4. ✅ Check that database status shows "Connected to Supabase"
5. ✅ Test adding a new review
6. ✅ Verify the review appears in Supabase

Your app is now fully connected to Supabase with realistic seed data! 🎉
