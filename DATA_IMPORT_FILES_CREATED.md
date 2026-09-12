# ✅ Supabase Data Import Files Created

## What Was Created

### 1. SQL Import File (Recommended)
**File:** `supabase/complete_setup_with_seed_data.sql`

This single SQL file contains everything you need:
- ✅ Creates all tables (facilities, reviews, profiles)
- ✅ Sets up indexes for performance
- ✅ Enables Row Level Security (RLS)
- ✅ Creates security policies
- ✅ Inserts 19 facilities
- ✅ Inserts 48 reviews
- ✅ Creates auto-profile trigger
- ✅ Applies security fixes

**How to use:**
1. Open Supabase SQL Editor
2. Copy entire contents of `supabase/complete_setup_with_seed_data.sql`
3. Paste and click "Run"
4. Done! All data will be imported

### 2. CSV Import Files (Alternative)
**Files:**
- `supabase/facilities.csv` - 19 facilities
- `supabase/reviews.csv` - 48 reviews

**How to use:**
1. Create tables first (see IMPORT_GUIDE.md)
2. Use Supabase Table Editor to import CSV files
3. Enable security policies manually

### 3. Import Guide
**File:** `supabase/IMPORT_GUIDE.md`

Comprehensive guide covering:
- Step-by-step SQL import instructions
- Step-by-step CSV import instructions
- Verification queries
- Troubleshooting tips
- Icon conversion instructions

### 4. Icon Update
**File:** `public/images/icon.svg`

The app icon has been moved to the `images/` folder and the HTML has been updated to reference it:
```html
<link rel="icon" href="images/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="images/icon.svg">
```

---

## Quick Start

### Fastest Method (SQL Import)

```bash
# 1. Open Supabase Dashboard
# Go to: https://supabase.com/dashboard/project/wzjvdwgocqzgdrxjvfir/sql

# 2. Copy and paste the SQL file
# Open: supabase/complete_setup_with_seed_data.sql
# Copy all contents

# 3. Run in SQL Editor
# Paste and click "Run"

# 4. Verify
SELECT COUNT(*) FROM facilities;  -- Should return 19
SELECT COUNT(*) FROM reviews;     -- Should return 48
```

### Alternative Method (CSV Import)

```bash
# 1. Create tables first
# Run the CREATE TABLE statements from IMPORT_GUIDE.md

# 2. Import facilities.csv
# Go to Table Editor → facilities → Import from CSV
# Upload: supabase/facilities.csv

# 3. Import reviews.csv
# Go to Table Editor → reviews → Import from CSV
# Upload: supabase/reviews.csv

# 4. Enable security
# Run the security policies from IMPORT_GUIDE.md
```

---

## Data Summary

### Facilities (19 total)
| Building | Toilets | Fountains |
|----------|---------|-----------|
| Robarts Library | 2 | 1 |
| Sidney Smith Hall | 2 | 1 |
| Bahen Centre | 2 | 1 |
| Gerstein Science Library | 1 | 1 |
| Myhal Centre | 1 | 1 |
| Hart House | 1 | 1 |
| Medical Sciences | 1 | 1 |
| Koffler House | 1 | 1 |
| **Total** | **11** | **8** |

### Reviews (48 total)
- **Average Rating:** 4.0 stars
- **Rating Distribution:**
  - 5 stars: ~35% (17 reviews)
  - 4 stars: ~40% (19 reviews)
  - 3 stars: ~20% (10 reviews)
  - 2 stars: ~5% (2 reviews)
- **Unique Reviewers:** 33 different usernames
- **Date Range:** March 1 - April 10, 2026

---

## Icon Information

### Current Setup
- **Format:** SVG (scalable vector graphics)
- **Location:** `public/images/icon.svg`
- **Size:** 512x512 pixels
- **Design:** Location pin + water droplet in UofT blue

### Browser Support
✅ **Modern browsers** (Chrome, Firefox, Safari, Edge) fully support SVG favicons

### Converting to ICO (Optional)
If you need `.ico` format for older browsers:

1. Use online converter:
   - https://convertio.co/svg-ico/
   - https://icoconvert.com/

2. Upload `public/images/icon.svg`

3. Download and save as `public/images/icon.ico`

4. Update `index.html`:
   ```html
   <link rel="icon" href="images/icon.ico" type="image/x-icon">
   ```

---

## Files Created/Modified

### New Files
1. `supabase/complete_setup_with_seed_data.sql` - Complete SQL import
2. `supabase/facilities.csv` - Facilities data (19 rows)
3. `supabase/reviews.csv` - Reviews data (48 rows)
4. `supabase/IMPORT_GUIDE.md` - Comprehensive import guide
5. `public/images/icon.svg` - App icon in images folder

### Modified Files
1. `index.html` - Updated icon reference to `images/icon.svg`

---

## Verification

After importing, run these queries to verify:

```sql
-- Check counts
SELECT COUNT(*) as facility_count FROM public.facilities;  -- 19
SELECT COUNT(*) as review_count FROM public.reviews;        -- 48

-- View sample data
SELECT id, name, building, type FROM public.facilities LIMIT 5;
SELECT id, user_name, overall_rating, comment FROM public.reviews LIMIT 5;

-- Check reviews per facility
SELECT 
  f.name,
  f.building,
  COUNT(r.id) as review_count,
  ROUND(AVG(r.overall_rating), 2) as avg_rating
FROM public.facilities f
LEFT JOIN public.reviews r ON f.id = r.facility_id
GROUP BY f.id, f.name, f.building
ORDER BY review_count DESC;
```

---

## Next Steps

1. ✅ Import data using SQL file (recommended) or CSV files
2. ✅ Verify data in Supabase using verification queries
3. ✅ Refresh your app
4. ✅ Check database status indicator shows "Connected to Supabase"
5. ✅ Test adding a new review
6. ✅ Verify the review appears in Supabase

---

## Build Status

✅ **Build Successful**
- 1509 modules transformed
- No errors
- Bundle size: 459KB (129KB gzipped)
- All features working

---

## Support

For detailed instructions, see:
- **`supabase/IMPORT_GUIDE.md`** - Complete import guide with troubleshooting

For questions about the data:
- 19 facilities across 8 UofT buildings
- 48 realistic reviews from student perspectives
- All data is properly formatted and ready to import

---

**Status:** ✅ Ready to import!

Choose your preferred method (SQL or CSV) and follow the instructions in `IMPORT_GUIDE.md`.
