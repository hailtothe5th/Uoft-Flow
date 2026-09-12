# Combined Contribute Page & Dark Mode Fixes

## Overview
Successfully merged the review and add location functionality into a single unified page, and fixed dark mode dropdown visibility issues.

## Changes Made

### 1. New Combined Contribute Page (`/contribute`)
**File:** `src/pages/Contribute.tsx`

**Features:**
- **Two modes in one page:**
  - **Review Existing:** Select from existing facilities and write a review
  - **Add New + Review:** Add a new facility and immediately review it in a two-step process

- **Smart workflow:**
  - When adding a new facility, after submission, the form automatically transitions to the review step for that newly created facility
  - Pre-selection support via URL parameter: `/contribute?facility=xxx`
  - Seamless two-step process for adding and reviewing new facilities

- **User experience:**
  - Clear mode selection buttons at the top
  - Visual feedback showing which step you're on (Step 1: Add Facility, Step 2: Review)
  - All review features preserved (ratings, cleanliness, condition, comments)
  - All facility creation features preserved (type, name, building, floor, address, accessibility options)

### 2. Updated Routes
**File:** `src/App.tsx`

- Removed separate routes: `/submit` and `/add`
- Added unified route: `/contribute`
- Lazy-loaded Contribute component for performance

### 3. Updated Navigation
**File:** `src/components/Header.tsx`

- Simplified "Add" dropdown menu
- Changed from dropdown with two options to single "Contribute" button
- Cleaner, more intuitive navigation

### 4. Updated Home Page CTA
**File:** `src/pages/Home.tsx`

- Updated call-to-action to link to `/contribute`
- Simplified from two buttons to single "Contribute Now" button

### 5. Updated Facility Page
**File:** `src/pages/FacilityPage.tsx`

- Updated "Write a Review" button to link to `/contribute?facility=${id}`
- Maintains pre-selection functionality

### 6. Fixed Dark Mode Dropdown Visibility
**File:** `src/index.css`

**Added CSS rules:**
```css
/* Dark mode select/dropdown fixes */
:root.dark select,
:root.dark option {
  background-color: var(--bg-card);
  color: var(--text-primary);
}

:root.dark select {
  background-color: var(--bg-elevated);
  color: var(--text-primary);
  border-color: var(--border-secondary);
}

:root.dark select option {
  background-color: var(--bg-elevated);
  color: var(--text-primary);
}

:root.dark select option:hover,
:root.dark select option:checked {
  background-color: var(--color-uoft-blue);
  color: white;
}
```

**Result:**
- Dropdown text is now clearly visible in dark mode
- Proper contrast between text and background
- Selected items highlighted with UofT blue
- Hover states work correctly

### 7. Removed Unused Code
**File:** `src/context/DataContext.tsx`

- Removed unused import: `haversineDistance` from `../utils/distance`
- Cleaned up code that was no longer needed after coordinate removal

## User Flow

### Review Existing Facility
1. User clicks "Contribute" in header or CTA
2. Selects "Review Existing" mode (default)
3. Chooses facility from dropdown
4. Fills out review form (ratings, condition, comment)
5. Submits review
6. Success message with options to browse or contribute again

### Add New Facility + Review
1. User clicks "Contribute"
2. Selects "Add New + Review" mode
3. Fills out facility details (Step 1)
4. Clicks "Add Facility & Continue to Review"
5. Facility is created and saved
6. Form automatically transitions to review step (Step 2)
7. User reviews the newly created facility
8. Submits review
9. Success message with options to browse or contribute again

## Technical Details

### State Management
- Mode state: `'review-existing' | 'add-new'`
- Newly created facility ID tracked in state
- Automatic transition from facility creation to review
- All form states properly reset after submission

### Styling
- Consistent with existing design system
- Dark mode support throughout
- Responsive design for all screen sizes
- Proper focus states and accessibility

### Performance
- Lazy-loaded component
- No unnecessary re-renders
- Efficient state updates

## Files Modified
1. `src/pages/Contribute.tsx` (new)
2. `src/App.tsx`
3. `src/components/Header.tsx`
4. `src/pages/Home.tsx`
5. `src/pages/FacilityPage.tsx`
6. `src/index.css`
7. `src/context/DataContext.tsx`

## Testing Checklist
- [x] Review existing facility works
- [x] Add new facility works
- [x] Add new facility + review workflow works
- [x] Pre-selection via URL parameter works
- [x] Dark mode dropdown text is visible
- [x] Navigation links updated
- [x] Build succeeds without errors
- [x] All routes work correctly

## Benefits
1. **Better UX:** Single page for all contributions, less navigation
2. **Smoother workflow:** Add and review in one seamless process
3. **Cleaner code:** Removed duplicate logic between two pages
4. **Better dark mode:** Fixed visibility issues with dropdowns
5. **Easier maintenance:** One page to maintain instead of two
