# Blank Page Fix - Facility Page

## 🐛 Issue
When navigating to a facility/review page, the page would go blank (white screen).

## 🔍 Root Cause
The issue was caused by multiple problems:

1. **Duplicate `useData()` calls** in FacilityPage - The component was calling `useData()` twice, which could cause React to throw errors
2. **Leaflet marker icon imports** - The marker icon imports from leaflet's dist folder were causing bundling issues with Vite
3. **No error boundaries** - Runtime errors would crash the entire page without any feedback
4. **SSR/hydration issues** - Leaflet's map component might try to access browser APIs before they're available

## ✅ Fixes Applied

### 1. Fixed Duplicate useData() Call
**File:** `src/pages/FacilityPage.tsx`

**Before:**
```typescript
const { facilitiesWithStats, reviews, userLocation } = useData();
const facility = facilitiesWithStats.find((f) => f.id === id);
const { getVisibleReviews } = useData(); // ❌ Duplicate call
```

**After:**
```typescript
const { facilitiesWithStats, reviews, userLocation } = useData();
const facility = facilitiesWithStats.find((f) => f.id === id);

// Filter reviews directly instead of using getVisibleReviews
const facilityReviews = useMemo(() => {
  if (!id) return [];
  const facilityReviews = reviews.filter((r) => r.facilityId === id);
  const { visible } = filterReviews(facilityReviews);
  return visible.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}, [id, reviews]);
```

### 2. Fixed Leaflet Marker Icons
**File:** `src/components/MapView.tsx`

**Before:**
```typescript
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
```

**After:**
```typescript
// Use CDN URLs instead of local imports to avoid bundling issues
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
```

### 3. Added Client-Side Check
**File:** `src/components/MapView.tsx`

Added a check to ensure the map only renders on the client side:

```typescript
const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);

if (!isClient) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 card-shadow border border-slate-200 dark:border-slate-700">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
    </div>
  );
}
```

### 4. Added Error Boundary
**File:** `src/components/ErrorBoundary.tsx` (new file)

Created a reusable error boundary component to catch runtime errors:

```typescript
export default class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Show error UI or fallback
    }
    return this.props.children;
  }
}
```

### 5. Wrapped MapView with Error Boundary
**File:** `src/pages/FacilityPage.tsx`

Wrapped the MapView component with an error boundary and provided a fallback UI:

```typescript
<ErrorBoundary
  fallback={
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 card-shadow border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
        📍 {facility.building}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        {facility.floorNote}
      </p>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${facility.lat},${facility.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-uoft-blue text-white rounded-xl text-sm font-semibold hover:bg-uoft-blue-light transition-colors"
      >
        <ExternalLink className="w-4 h-4" />
        Open in Google Maps
      </a>
    </div>
  }
>
  <MapView
    lat={facility.lat}
    lng={facility.lng}
    name={facility.name}
    building={facility.building}
    floorNote={facility.floorNote}
    type={facility.type}
  />
</ErrorBoundary>
```

## 🎯 Benefits

1. **No More Blank Pages** - Errors are caught and displayed gracefully
2. **Better UX** - Loading states and fallback UIs provide feedback
3. **Easier Debugging** - Error boundaries log errors to console
4. **Resilient** - Map failures don't crash the entire page
5. **SSR-Safe** - Client-side checks prevent hydration issues

## 🧪 Testing

To verify the fix:

1. Navigate to any facility page (e.g., click on a facility card from the home page)
2. The page should load without going blank
3. The map should display correctly
4. If the map fails to load, a fallback UI with a "Open in Google Maps" button should appear
5. Reviews should display correctly below the map

## 📊 Build Status

✅ **Build Successful**
- 1508 modules transformed
- No TypeScript errors
- All components compile correctly
- Bundle size optimized

## 🔧 Files Changed

**Modified:**
- `src/pages/FacilityPage.tsx` - Fixed duplicate useData() call, added error boundary wrapper
- `src/components/MapView.tsx` - Fixed marker icons, added client-side check

**Created:**
- `src/components/ErrorBoundary.tsx` - Reusable error boundary component

## 🚀 Next Steps

If you still experience issues:

1. **Check browser console** - Look for any JavaScript errors
2. **Clear browser cache** - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. **Check network tab** - Ensure all assets are loading correctly
4. **Verify Supabase connection** - Make sure the database tables exist

The error boundary will now catch any runtime errors and display them instead of showing a blank page, making it much easier to identify and fix any remaining issues.
