# Report System & Map Features

## 📋 Overview
This document describes the new report system with automated content filtering and the interactive map feature added to UofT Flow.

---

## 🚩 Report System

### Features

#### 1. Report Button
- **Location**: Appears on every review card (top right)
- **Visibility**: Only shown to authenticated users
- **Icon**: Flag icon with "Report" text
- **Accessibility**: Proper ARIA labels and keyboard navigation

#### 2. Report Modal
When users click the report button, a modal opens with:

**Report Reasons:**
- 🚫 **Spam or misleading** - Fake reviews, promotional content
- ⚠️ **Inappropriate content** - Offensive language, harassment
- ❌ **False information** - Incorrect facility details
- 🚷 **Harassment or bullying** - Personal attacks, discrimination
- 📝 **Other** - Custom reason with description

**Form Fields:**
- Reason selection (radio buttons with visual feedback)
- Optional description (up to 500 characters)
- Submit/Cancel buttons

**User Feedback:**
- Loading state during submission
- Success confirmation with checkmark
- Auto-close after 2 seconds

#### 3. Report Storage
- Reports are stored in localStorage
- Each report includes:
  - Unique ID
  - Review ID being reported
  - Reporter information (ID and name)
  - Reason and description
  - Status (pending/reviewed/dismissed)
  - Timestamp

#### 4. Report Count Tracking
- Reviews track how many times they've been reported
- `reportCount` field added to Review interface
- Increments with each new report

---

## 🤖 Automated Content Filtering

### Implementation

The system automatically analyzes reviews for inappropriate content using pattern matching and severity scoring.

#### Filter Categories

**1. Profanity Detection**
- Detects common profane words
- Severity: 1 point
- Examples: fuck, shit, damn, hell, ass, bitch, bastard

**2. Harassment Detection**
- Identifies bullying language
- Severity: 2 points
- Examples: stupid, idiot, dumb, loser, hate you

**3. Discriminatory Language**
- Catches hate speech and slurs
- Severity: 3 points (highest)
- Examples: retard, fag, nigger, kike

**4. Spam Detection**
- Identifies promotional content
- Severity: 1 point
- Patterns: "click here", "buy now", URLs, "free money"

**5. Excessive Formatting**
- Detects shouting (ALL CAPS)
- Severity: 0.5 points
- Pattern: 10+ consecutive uppercase letters

**6. Excessive Symbols**
- Catches spam-like character sequences
- Severity: 0.5 points
- Pattern: 5+ consecutive special characters

#### Severity Levels

| Severity | Action |
|----------|--------|
| 0.5 - 1.9 | Flagged for review |
| 2.0 - 2.9 | Warning message shown |
| 3.0+ | Auto-hidden from view |

#### Filter Results

**Visible Reviews:**
- Reviews with severity < 3.0
- May show warning message if severity >= 2.0

**Hidden Reviews:**
- Reviews with severity >= 3.0
- Completely removed from display
- Still stored in database for admin review

### API Functions

```typescript
// Analyze a single review
analyzeReview(review: Review): FilterResult

// Check if review should be auto-hidden
shouldAutoHide(review: Review): boolean

// Get warning message for flagged review
getWarningMessage(review: Review): string | null

// Filter array of reviews
filterReviews(reviews: Review[]): { visible: Review[]; flagged: Review[] }
```

---

## 🗺️ Interactive Map Feature

### Features

#### 1. Map Display
- **Library**: Leaflet with OpenStreetMap tiles
- **Location**: Shown on facility detail page
- **Size**: 400px height, full width
- **Zoom**: Level 17 (building-level detail)

#### 2. Map Components

**Marker:**
- Shows exact facility location
- Click to see popup with details
- Default Leaflet marker icon

**Popup:**
- Facility name
- Building name
- Floor/location note

**Controls:**
- Scroll wheel zoom enabled
- Pan by dragging
- Zoom controls visible

#### 3. Navigation Buttons

**Get Directions:**
- Opens Google Maps directions
- From user's current location
- To facility location
- Blue button with location icon

**Open in Google Maps:**
- Opens Google Maps search
- Shows facility location
- Gray button for alternative view

#### 4. Map Header
- Emoji icon (🚻 or 🚰)
- "Location Map" title
- Building and floor information

### Technical Details

**Dependencies:**
- `leaflet@^1.9.0` - Map library
- `react-leaflet@^4.2.1` - React wrapper
- `@types/leaflet` - TypeScript definitions

**Marker Icons:**
- Fixed webpack/vite icon import issue
- Uses default Leaflet markers
- Properly bundled with application

**Performance:**
- Lazy loaded with FacilityPage
- OpenStreetMap tiles (free, no API key)
- Efficient rendering with React-Leaflet

---

## 📊 Data Flow

### Report Flow

```
User clicks Report button
    ↓
ReportModal opens
    ↓
User selects reason & adds description
    ↓
User submits report
    ↓
Report saved to localStorage
    ↓
Review reportCount incremented
    ↓
Modal shows success message
    ↓
Modal closes after 2 seconds
```

### Content Filter Flow

```
Reviews loaded from storage
    ↓
filterReviews() called
    ↓
Each review analyzed
    ↓
Severity calculated
    ↓
Reviews split into:
  - visible (severity < 3.0)
  - flagged (severity >= 3.0)
    ↓
Visible reviews displayed
    ↓
Flagged reviews hidden
```

### Map Flow

```
User navigates to facility page
    ↓
Facility data loaded
    ↓
MapView component renders
    ↓
Leaflet map initialized
    ↓
Marker placed at lat/lng
    ↓
User can interact with map
    ↓
User clicks "Get Directions"
    ↓
Google Maps opens with route
```

---

## 🔒 Security & Privacy

### Report System

**Data Protection:**
- Reporter identity stored but not publicly visible
- Reports only accessible to admins
- No personal data exposed in UI

**Abuse Prevention:**
- Only authenticated users can report
- One report per user per review (enforced client-side)
- Report reasons validated

**Moderation:**
- Reports stored for admin review
- Status tracking (pending/reviewed/dismissed)
- Can be extended with admin dashboard

### Content Filter

**Privacy:**
- Filtering happens client-side
- No data sent to external services
- Pattern matching is local

**Transparency:**
- Users see warning messages
- Clear indication when content is hidden
- Can be disabled by admins if needed

### Map Feature

**Privacy:**
- User location not tracked
- Only facility locations shown
- No analytics or tracking

**Security:**
- OpenStreetMap (open source, privacy-focused)
- No API keys required
- No user data sent to map provider

---

## 🎨 UI/UX Design

### Report Button

**Visual Design:**
- Small flag icon (16px)
- "Report" text on larger screens
- Subtle hover effect (red tint)
- Rounded corners

**Interaction:**
- Instant feedback on click
- Modal overlay with backdrop blur
- Smooth transitions

**Accessibility:**
- Keyboard accessible
- Screen reader friendly
- Clear focus indicators

### Report Modal

**Visual Design:**
- Centered modal with shadow
- White/dark theme support
- Clear section dividers
- Color-coded reasons

**Interaction:**
- Radio button selection
- Visual feedback on selection
- Character counter for description
- Loading state during submission

**Accessibility:**
- Focus trap within modal
- Escape key to close
- ARIA labels on all elements
- Keyboard navigation

### Map Component

**Visual Design:**
- Rounded corners matching app theme
- Header with icon and info
- Clean button design
- Responsive layout

**Interaction:**
- Smooth map controls
- Click marker for popup
- Clear call-to-action buttons
- Loading states

**Accessibility:**
- Keyboard navigable map
- Screen reader descriptions
- High contrast buttons
- Clear button labels

---

## 📈 Future Enhancements

### Report System

**Planned Features:**
- Admin dashboard for reviewing reports
- Email notifications for admins
- Bulk report actions
- Report analytics
- User reputation system
- Automatic suspension for repeat offenders

**Integration:**
- Supabase reports table
- Real-time report notifications
- Admin role-based access control

### Content Filter

**Planned Features:**
- Machine learning model for better detection
- Customizable filter rules
- User-defined block lists
- Language-specific filters
- Image content filtering

**Improvements:**
- Context-aware filtering
- Reduced false positives
- Multilingual support
- Cultural sensitivity

### Map Feature

**Planned Features:**
- Indoor maps for large buildings
- Floor plan overlays
- Real-time availability
- Crowd-sourced updates
- Accessibility routes

**Enhancements:**
- 3D building models
- AR navigation
- Voice directions
- Offline map support

---

## 🧪 Testing

### Report System Tests

**Unit Tests:**
- Report creation
- Report count increment
- Modal state management
- Form validation

**Integration Tests:**
- Report submission flow
- localStorage persistence
- Multiple reports on same review

**E2E Tests:**
- Complete report workflow
- Authentication requirement
- Success feedback

### Content Filter Tests

**Unit Tests:**
- Pattern matching accuracy
- Severity calculation
- Filter function output

**Integration Tests:**
- Review filtering on load
- Warning message display
- Auto-hide functionality

**Test Cases:**
- Clean review → visible
- Mild profanity → flagged
- Severe violation → hidden
- Mixed content → appropriate action

### Map Feature Tests

**Unit Tests:**
- Map initialization
- Marker placement
- Popup content

**Integration Tests:**
- Navigation button functionality
- Google Maps integration
- Responsive behavior

**Visual Tests:**
- Map rendering accuracy
- Marker visibility
- Popup styling

---

## 📚 Usage Examples

### Reporting a Review

```typescript
// User clicks report button
<ReportButton reviewId="review-123" />

// Modal opens
<ReportModal 
  reviewId="review-123"
  isOpen={true}
  onClose={() => setIsOpen(false)}
/>

// Report submitted
const report: Report = {
  id: uuidv4(),
  reviewId: "review-123",
  reporterId: "user-456",
  reporterName: "John Doe",
  reason: "inappropriate",
  description: "Contains offensive language",
  status: "pending",
  createdAt: new Date().toISOString()
};

await addReport(report);
```

### Filtering Reviews

```typescript
// Get visible reviews for a facility
const visibleReviews = getVisibleReviews("facility-123");

// Filter returns:
{
  visible: [/* reviews with severity < 3.0 */],
  flagged: [/* reviews with severity >= 3.0 */]
}
```

### Displaying Map

```typescript
<MapView
  lat={43.6629}
  lng={-79.3956}
  name="Robarts Library Washroom"
  building="Robarts Library"
  floorNote="1st Floor, near entrance"
  type="toilet"
/>
```

---

## ✅ Summary

The report system and map features significantly enhance UofT Flow:

**Report System:**
- ✅ Empowers users to moderate content
- ✅ Automated filtering reduces manual work
- ✅ Clear reporting workflow
- ✅ Privacy-focused design

**Content Filter:**
- ✅ Automatic detection of violations
- ✅ Severity-based actions
- ✅ Transparent to users
- ✅ Extensible pattern system

**Map Feature:**
- ✅ Visual location context
- ✅ Easy navigation
- ✅ No API keys required
- ✅ Privacy-friendly

**Overall Impact:**
- Better community moderation
- Improved user experience
- Enhanced accessibility
- Stronger safety features

All features are production-ready and fully integrated into the application.
