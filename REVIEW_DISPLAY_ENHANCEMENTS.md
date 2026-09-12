# Review Display Enhancements

## Overview
Enhanced the review display on facility pages to show more contextual information including gender designation and relative time ago.

## Changes Made

### 1. Added Gender Designation Badge
**Location:** FacilityPage.tsx - Review display section

**What it shows:**
- Purple badge displaying the facility's gender designation (Men's, Women's, or All-gender)
- Only appears if the facility has a gender designation set
- Positioned alongside the rating and condition badges

**Example:**
```
💩💩💩💩  👍 Good  All-gender
```

**Implementation:**
```tsx
{facility.genderDesignation && (
  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
    {facility.genderDesignation}
  </span>
)}
```

### 2. Added "Time Ago" Display
**Location:** FacilityPage.tsx - Review header section

**What it shows:**
- Relative time instead of full date (e.g., "2 days ago", "1 week ago")
- More user-friendly and easier to understand at a glance
- Automatically updates based on current time

**Examples:**
- "just now" (less than 1 minute)
- "5 minutes ago"
- "2 hours ago"
- "3 days ago"
- "2 weeks ago"
- "1 month ago"
- "1 year ago"

**Implementation:**
Created new utility function `src/utils/timeAgo.ts` that calculates the relative time from a given date to now.

```tsx
<p className="text-xs text-gray-400 dark:text-slate-500">
  {getTimeAgo(review.createdAt)}
</p>
```

## Files Modified

1. **src/pages/FacilityPage.tsx**
   - Imported `getTimeAgo` utility
   - Added gender designation badge in review display
   - Replaced full date with "time ago" display
   - Added `flex-wrap` to badge container for better mobile layout

2. **src/utils/timeAgo.ts** (NEW)
   - Created utility function to calculate relative time
   - Handles all time ranges from seconds to years
   - Returns human-readable strings

## Visual Improvements

### Before
```
[Avatar] StudyGrinder
         Mar 1, 2026

💩💩💩💩  👍 Good
Cleanliness: 4/5

[Toilet amenities...]

"Pretty clean, always stocked..."
```

### After
```
[Avatar] StudyGrinder
         2 days ago

💩💩💩💩  👍 Good  All-gender
Cleanliness: 4/5

[Toilet amenities...]

"Pretty clean, always stocked..."
```

## Benefits

1. **Better Context:** Users can immediately see the facility's gender designation
2. **Time Awareness:** "Time ago" is more intuitive than full dates
3. **Mobile Friendly:** Badges wrap properly on small screens
4. **Consistent Design:** Uses the same badge styling as other elements
5. **Accessibility:** Color contrast meets WCAG standards

## Technical Details

### Time Ago Calculation
The `getTimeAgo` function handles:
- Seconds (< 1 minute): "just now"
- Minutes (< 1 hour): "X minutes ago"
- Hours (< 1 day): "X hours ago"
- Days (< 1 week): "X days ago"
- Weeks (< 1 month): "X weeks ago"
- Months (< 1 year): "X months ago"
- Years: "X years ago"

### Gender Designation Display
- Only shows if `facility.genderDesignation` exists
- Uses purple color scheme to distinguish from other badges
- Responsive and wraps with other badges on mobile

## Testing

- ✅ Build successful
- ✅ TypeScript compilation passed
- ✅ Gender designation displays correctly
- ✅ Time ago calculates correctly
- ✅ Mobile responsive layout works
- ✅ Dark mode colors work correctly

## Future Enhancements

Potential improvements:
- Add tooltip showing exact date on hover
- Show "Updated X ago" if review was edited
- Add filter by time range (e.g., "Last week", "Last month")
- Show review age in different formats based on user preference
