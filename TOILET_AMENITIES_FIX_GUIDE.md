# Toilet Amenities Display Fix

## Issue
Toilet amenity data (toilet paper, soap, stall lock) exists in the database but wasn't displaying on the webpage.

## Root Cause
The app was loading old data from localStorage that didn't have the amenity fields, instead of the fresh data from Supabase.

## Solution

### 1. Force Update localStorage
Added code to update localStorage with fresh Supabase data whenever reviews are loaded:

```typescript
if (supabaseReviews && supabaseReviews.length > 0) {
  const mappedReviews = supabaseReviews.map(mapSupabaseReview);
  setReviews(mappedReviews);
  // Update localStorage with fresh Supabase data
  localStorage.setItem('uoftflow_reviews', JSON.stringify(mappedReviews));
}
```

### 2. Added Refresh Data Function
Created a `refreshData()` function in DataContext that:
- Clears all localStorage data
- Reloads fresh data from Supabase
- Updates localStorage with the fresh data

### 3. Added Debug Button
Added a "Force Refresh Data" button to the DebugDatabase page that:
- Clears old cached data
- Forces a reload from Supabase
- Shows progress in the debug log

## How to Fix Your Data

### Option 1: Use the Debug Button (Recommended)
1. Go to `/debug` page
2. Click "🔄 Force Refresh Data" button
3. Wait for the refresh to complete
4. Navigate to a facility page - amenities should now display

### Option 2: Clear Browser Storage Manually
1. Open browser DevTools (F12)
2. Go to Application tab
3. Clear Local Storage for your site
4. Refresh the page
5. Navigate to a facility page

### Option 3: Hard Refresh
1. Press Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
2. This forces a hard refresh and clears cached data

## Verification

After refreshing, check the browser console (F12) for these messages:

```
📋 Sample review data: { ... hasToiletPaper: true, hasSoap: true, hasStallLock: true ... }
📋 Toilet amenities in first review: { hasToiletPaper: true, hasSoap: true, hasStallLock: true }
✅ Updated localStorage with Supabase review data
```

Then navigate to a facility page and check for:
```
📋 Facility reviews loaded: X
📋 First review amenities: { hasToiletPaper: true, hasSoap: true, hasStallLock: true }
🚻 Rendering review amenities: { isToilet: true, hasAmenityData: true, ... }
```

## Expected Display

When viewing a toilet facility, each review should show amenity badges:

- 🧻 Toilet paper (green if available, red if not)
- 🧼 Soap (green if available, red if not)
- 🔒 Stall lock (green if available, red if not)

## Files Modified

1. `src/context/DataContext.tsx`
   - Added `refreshData()` function
   - Added localStorage update when loading from Supabase
   - Added debug logging

2. `src/pages/DebugDatabase.tsx`
   - Added "Force Refresh Data" button
   - Added refresh progress logging

3. `src/pages/FacilityPage.tsx`
   - Added debug logging for amenity data

## Testing Checklist

- [ ] Navigate to `/debug` page
- [ ] Click "Force Refresh Data" button
- [ ] Check console for refresh logs
- [ ] Navigate to a toilet facility
- [ ] Verify amenity badges display on reviews
- [ ] Check console for amenity data logs
- [ ] Verify green/red badges show correct status

## Notes

- The amenity data only displays for toilet facilities (not fountains)
- Reviews without amenity data won't show the badges
- New reviews submitted through the app will automatically include amenity data
- The refresh only needs to be done once to update localStorage
