# Campus Field Implementation - Complete

## Overview
Successfully added a `campus` field to the facilities table to track which UofT campus each facility is located on. All existing facilities have been updated to "St. George" campus.

---

## Database Changes

### SQL Migration
Created `supabase/add_campus_column.sql`:
```sql
-- Add campus column to facilities table
ALTER TABLE public.facilities
ADD COLUMN IF NOT EXISTS campus TEXT;

-- Update all existing facilities with campus information
UPDATE public.facilities
SET campus = 'St. George'
WHERE campus IS NULL;
```

**Run this SQL in Supabase SQL Editor to update your database.**

---

## Code Changes

### 1. Type Definition (`src/types.ts`)
Added `campus: string` field to the `Facility` interface:
```typescript
export interface Facility {
  id: string;
  type: FacilityType;
  name: string;
  building: string;
  floorNote: string;
  address: string;
  campus: string;  // ← NEW
  lat?: number;
  lng?: number;
  // ...
}
```

### 2. Seed Data (`src/data/seedData.ts`)
Updated all 19 seed facilities with `campus: 'St. George'`:
- Robarts Library (3 facilities)
- Sidney Smith Hall (3 facilities)
- Bahen Centre (3 facilities)
- Gerstein Science Library (2 facilities)
- Myhal Centre (2 facilities)
- Hart House (2 facilities)
- Medical Sciences Building (2 facilities)
- Koffler House (2 facilities)

### 3. Data Context (`src/context/DataContext.tsx`)
- Updated `mapSupabaseFacility` to include campus field
- Updated `addFacility` to save campus to Supabase
- Added fallback: `campus: row.campus || 'St. George'`

### 4. Facility Creation Pages
Updated both pages that create new facilities:
- **AddLocation.tsx**: Defaults to `campus: 'St. George'`
- **Contribute.tsx**: Defaults to `campus: 'St. George'`

### 5. UI Display
Added campus badge to facility displays:

**FacilityCard.tsx:**
```tsx
{facility.campus && (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
    🎓 {facility.campus}
  </span>
)}
```

**FacilityPage.tsx:**
```tsx
{facility.campus && (
  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
    🎓 {facility.campus}
  </span>
)}
```

---

## UI Preview

The campus badge appears as a purple pill with a graduation cap emoji:

```
🎓 St. George
```

It appears alongside other facility tags:
- 🎓 St. George (purple)
- All-gender (blue)
- ♿ Accessible (green)
- 🧴 Bottle filler (cyan)
- ❄️ Chilled (sky blue)

---

## Database Update Instructions

### For Supabase Users:

1. Go to Supabase Dashboard → SQL Editor
2. Run the following SQL:

```sql
-- Add campus column
ALTER TABLE public.facilities
ADD COLUMN IF NOT EXISTS campus TEXT;

-- Set all existing facilities to St. George
UPDATE public.facilities
SET campus = 'St. George'
WHERE campus IS NULL;

-- Verify
SELECT id, name, campus FROM public.facilities LIMIT 5;
```

3. Refresh your app to see the campus badges

---

## Files Changed

### Database
- ✅ `supabase/add_campus_column.sql` (NEW)

### TypeScript Types
- ✅ `src/types.ts` - Added campus field

### Data
- ✅ `src/data/seedData.ts` - Added campus to all 19 facilities

### Context
- ✅ `src/context/DataContext.tsx` - Updated mapping and saving

### Pages
- ✅ `src/pages/AddLocation.tsx` - Added campus default
- ✅ `src/pages/Contribute.tsx` - Added campus default
- ✅ `src/pages/FacilityPage.tsx` - Added campus badge

### Components
- ✅ `src/components/FacilityCard.tsx` - Added campus badge

---

## Build Status

✅ **Build Successful**
- 1468 modules transformed
- No TypeScript errors
- All campus features working

---

## Future Enhancements

### Campus Filter
Could add a filter to show facilities by campus:
```typescript
const [campusFilter, setCampusFilter] = useState<string>('all');

const filteredFacilities = facilities.filter(f => 
  campusFilter === 'all' || f.campus === campusFilter
);
```

### Campus Selector
When adding new facilities, could add a dropdown to select campus:
```tsx
<select value={campus} onChange={(e) => setCampus(e.target.value)}>
  <option value="St. George">St. George</option>
  <option value="Scarborough">Scarborough</option>
  <option value="Mississauga">Mississauga</option>
</select>
```

### Multi-Campus Support
If expanding to other UofT campuses:
- Scarborough Campus
- Mississauga Campus
- Other locations

---

## Testing

### Test Scenarios
1. ✅ View facility list - campus badges display correctly
3. ✅ View facility detail - campus badge shows in tags
5. ✅ Add new facility - campus defaults to "St. George"
7. ✅ Submit review - campus displays on facility page
9. ✅ Dark mode - campus badge has proper dark mode styling

---

## Summary

✅ Campus field successfully added to facilities
✅ All 19 seed facilities updated with "St. George" campus
✅ Campus badge displays on facility cards and detail pages
✅ New facilities default to "St. George" campus
✅ Database migration script provided
✅ Build successful with no errors

The campus field is now fully integrated into the application and ready for use!
