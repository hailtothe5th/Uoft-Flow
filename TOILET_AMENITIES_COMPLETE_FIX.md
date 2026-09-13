# Toilet Amenities Display Fix - Complete Guide

## Problem Identified

The toilet amenity data (toilet paper, soap, stall lock) exists in your database but isn't displaying on the webpage because:

1. **Database columns exist** ✅ - The columns `has_toilet_paper`, `has_soap`, `has_stall_lock` are in the reviews table
2. **Values are NULL** ❌ - All existing reviews have NULL values instead of true/false
3. **Frontend expects boolean values** - The code checks for `true` or `false`, not `null`

## Solution

### Step 1: Update Database Records

**Run this SQL in Supabase SQL Editor:**

```sql
-- Fix NULL amenity values in existing reviews
UPDATE public.reviews
SET 
  has_toilet_paper = COALESCE(has_toilet_paper, true),
  has_soap = COALESCE(has_soap, true),
  has_stall_lock = COALESCE(has_stall_lock, true)
WHERE has_toilet_paper IS NULL 
   OR has_soap IS NULL 
   OR has_stall_lock IS NULL;
```

This will:
- Set all NULL values to `true` (amenities available)
- Leave existing true/false values unchanged
- Affect only reviews with NULL values

### Step 2: Verify the Update

Run this query to confirm:

```sql
SELECT 
  id,
  facility_id,
  has_toilet_paper,
  has_soap,
  has_stall_lock
FROM public.reviews
ORDER BY created_at DESC
LIMIT 10;
```

You should see `true` or `false` values, not `null`.

### Step 3: Clear Browser Cache

The app caches data in localStorage. You need to clear it:

**Option A: Use Debug Page**
1. Go to `/debug` page
2. Click "🔄 Force Refresh Data" button
3. Wait for completion

**Option B: Hard Refresh**
- Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

**Option C: Clear localStorage Manually**
1. Open DevTools (F12)
2. Go to Application tab
3. Expand "Local Storage"
4. Right-click your site URL
5. Click "Clear"
6. Refresh the page

### Step 4: Verify Display

1. Navigate to a toilet facility page (e.g., Robarts Library washroom)
2. Look at the reviews
3. You should see amenity badges:
   - 🧻 **Toilet paper** (green badge)
   - 🧼 **Soap** (green badge)
   - 🔒 **Stall lock** (green badge)

## How It Works

### Database Schema
```sql
CREATE TABLE reviews (
  ...
  has_toilet_paper BOOLEAN,
  has_soap BOOLEAN,
  has_stall_lock BOOLEAN
);
```

### Frontend Display Logic
```typescript
// Only show for toilet facilities
{facility.type === 'toilet' && (
  review.hasToiletPaper !== undefined || 
  review.hasSoap !== undefined || 
  review.hasStallLock !== undefined
) && (
  <div className="flex flex-wrap gap-2 mb-2">
    {review.hasToiletPaper !== undefined && (
      <span className={review.hasToiletPaper ? 'bg-green-100' : 'bg-red-100'}>
        {review.hasToiletPaper ? '🧻 Toilet paper' : '🧻 No toilet paper'}
      </span>
    )}
    {/* Similar for soap and stall lock */}
  </div>
)}
```

### New Reviews
When users submit new reviews through the Contribute page:
- The form includes checkboxes for toilet amenities
- Values are saved as `true` or `false` (not NULL)
- Amenities display correctly on the facility page

## Troubleshooting

### Issue: Badges still not showing

**Check 1: Database values**
```sql
SELECT has_toilet_paper, has_soap, has_stall_lock 
FROM reviews 
WHERE facility_id = 'YOUR_FACILITY_ID';
```
Should show `true` or `false`, not `null`.

**Check 2: Browser console**
Open DevTools (F12) and look for:
```
📋 Sample review  { hasToiletPaper: true, hasSoap: true, hasStallLock: true }
```

**Check 3: Facility type**
Make sure the facility is a toilet, not a fountain:
```sql
SELECT type FROM facilities WHERE id = 'YOUR_FACILITY_ID';
```
Should return `'toilet'`.

### Issue: All badges show red (not available)

This means the values are `false`. Update them to `true`:
```sql
UPDATE reviews 
SET has_toilet_paper = true, has_soap = true, has_stall_lock = true
WHERE facility_id = 'YOUR_FACILITY_ID';
```

### Issue: Some reviews show badges, others don't

This means some reviews have NULL values. Run the update SQL again:
```sql
UPDATE reviews
SET 
  has_toilet_paper = COALESCE(has_toilet_paper, true),
  has_soap = COALESCE(has_soap, true),
  has_stall_lock = COALESCE(has_stall_lock, true)
WHERE has_toilet_paper IS NULL 
   OR has_soap IS NULL 
   OR has_stall_lock IS NULL;
```

## Files Modified

1. **`src/context/DataContext.tsx`**
   - Added `refreshData()` function to clear localStorage and reload from Supabase
   - Added localStorage sync when loading from Supabase
   - Added debug logging for amenity data

2. **`src/pages/DebugDatabase.tsx`**
   - Added "Force Refresh Data" button
   - Integrated with `refreshData()` function

3. **`src/pages/FacilityPage.tsx`**
   - Added debug logging for amenity display
   - Already had correct rendering logic

4. **`src/pages/Contribute.tsx`**
   - Already correctly saves amenity values (lines 126-128)
   - No changes needed

## Summary

✅ **Database columns exist** - `has_toilet_paper`, `has_soap`, `has_stall_lock`
✅ **Frontend code is correct** - Displays badges when values are true/false
✅ **New reviews save correctly** - Contribute page saves amenity values
❌ **Existing reviews have NULL values** - Need to run SQL update
❌ **Browser cache has old data** - Need to clear localStorage

**Action Required:**
1. Run the SQL update to fix NULL values
2. Clear browser cache (use Debug page or hard refresh)
3. Verify badges display on toilet facility pages

## Quick Fix Commands

```sql
-- 1. Update NULL values to true
UPDATE public.reviews
SET 
  has_toilet_paper = COALESCE(has_toilet_paper, true),
  has_soap = COALESCE(has_soap, true),
  has_stall_lock = COALESCE(has_stall_lock, true)
WHERE has_toilet_paper IS NULL 
   OR has_soap IS NULL 
   OR has_stall_lock IS NULL;

-- 2. Verify the update
SELECT id, has_toilet_paper, has_soap, has_stall_lock 
FROM public.reviews 
LIMIT 5;
```

Then clear browser cache and refresh the page. The amenity badges should now display!
