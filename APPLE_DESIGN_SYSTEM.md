# UofT Flow - Apple Design System Implementation

## 🎨 Design Philosophy

This implementation combines **official University of Toronto brand colors** with **Apple's design fundamentals** to create a clean, modern, and accessible interface.

---

## 🎯 Official UofT Brand Colors

### Primary Colors
- **UofT Blue (PMS 655)**: `#1E3765` - The official primary brand color
- **UofT Blue Light**: `#2A4A7F` - Lighter variant for hover states
- **UofT Blue Dark**: `#142647` - Darker variant for emphasis
- **Boundless Blue**: `#007FA3` - Secondary accent color
- **Boundless Blue Light**: `#00A5CC` - Lighter accent variant

### Semantic Colors
- **Success**: `#34C759` (Apple Green)
- **Warning**: `#FF9500` (Apple Orange)
- **Error**: `#FF3B30` (Apple Red)
- **Info**: `#007AFF` (Apple Blue)

### Neutral Colors
- **UofT White**: `#FFFFFF`
- **UofT Gray**: `#6E6E73`
- **UofT Light Gray**: `#F5F5F7`

---

## 🍎 Apple Design Fundamentals Applied

### 1. **Clean & Minimal Interface**
- Generous whitespace and breathing room
- Simple, focused layouts
- Content-first approach
- No unnecessary decorations

### 2. **Typography**
- **System Font Stack**: `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif`
- **Font Weights**: Carefully balanced (400, 500, 600)
- **Letter Spacing**: Tight tracking for headings (-0.02em)
- **Line Heights**: Optimized for readability

### 3. **Subtle Animations**
- **Duration**: 0.2s - 0.3s for most transitions
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` - Apple's signature easing
- **Transform**: Subtle scale effects on hover (1.02x)
- **Purpose**: Every animation serves a purpose

### 4. **Rounded Corners**
- **Cards**: 16px border radius
- **Buttons**: 12px border radius
- **Inputs**: 12px border radius
- **Badges**: 20px border radius (pill shape)
- **Icons**: 12px border radius

### 5. **Shadows & Depth**
- **Small**: `0 1px 3px rgba(0, 0, 0, 0.04)` - Subtle elevation
- **Medium**: `0 4px 12px rgba(0, 0, 0, 0.08)` - Card hover
- **Large**: `0 8px 24px rgba(0, 0, 0, 0.12)` - Modals
- **Hover**: `0 12px 32px rgba(0, 0, 0, 0.16)` - Interactive elements

### 6. **Color System**
- **Light Mode**: Clean whites and subtle grays
- **Dark Mode**: True blacks (`#000000`) with careful contrast
- **Glassmorphism**: Frosted glass effects for overlays
- **Semantic Colors**: Consistent meaning across the app

### 7. **Spacing System**
- **Base Unit**: 4px
- **Common Spacings**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
- **Padding**: Generous (24px for cards, 16-24px for buttons)
- **Margins**: Consistent vertical rhythm

### 8. **Interactive States**
- **Hover**: Subtle scale (1.02x) + shadow increase
- **Active**: Scale down (0.98x) for tactile feedback
- **Focus**: 2px outline with boundless blue
- **Disabled**: 50% opacity

---

## 🎨 Component Examples

### Header
```tsx
<header className="glass sticky top-0 z-50 border-b border-[var(--border-primary)]">
  <!-- Frosted glass effect -->
  <!-- Clean navigation with UofT Blue active states -->
  <!-- Boundless Blue for accent buttons -->
</header>
```

### Cards
```tsx
<div className="card group hover:scale-[1.01]">
  <!-- 16px border radius -->
  <!-- Subtle shadow -->
  <!-- Smooth hover animation -->
  <!-- Icon containers with rounded backgrounds -->
</div>
```

### Buttons
```tsx
<button className="btn btn-primary">
  <!-- 12px border radius -->
  <!-- UofT Blue background -->
  <!-- Hover: scale(1.02) + lighter blue -->
  <!-- Active: scale(0.98) -->
</button>
```

### Inputs
```tsx
<input className="input" />
<!-- 12px border radius -->
<!-- 1.5px border -->
<!-- Focus: boundless blue border + subtle glow -->
```

---

## 🌓 Dark Mode

### Design Principles
- **True Black**: `#000000` background for OLED displays
- **Elevated Surfaces**: `#1C1C1E` for cards
- **Subtle Borders**: `rgba(255, 255, 255, 0.08)` for separation
- **Text Hierarchy**: Carefully balanced grays for readability
- **Shadows**: Deeper, more pronounced shadows

### Color Mapping
```css
:root.dark {
  --bg-primary: #000000;
  --bg-secondary: #1C1C1E;
  --bg-tertiary: #2C2C2E;
  --text-primary: #F5F5F7;
  --text-secondary: #A1A1A6;
  --text-tertiary: #6E6E73;
}
```

---

## ♿ Accessibility Features

### Color Contrast
- **Normal Mode**: WCAG AA compliant (4.5:1 ratio)
- **High Contrast Mode**: WCAG AAA compliant (7:1 ratio)
- **Focus Indicators**: 2px boundless blue outline
- **Interactive Elements**: Clear visual feedback

### Typography
- **System Fonts**: Native rendering for each platform
- **Font Sizes**: Scalable (14px, 16px, 18px options)
- **Line Heights**: Optimized for readability
- **Letter Spacing**: Tight for headings, normal for body

### Motion
- **Reduced Motion**: Respects user preferences
- **Smooth Transitions**: 0.2s - 0.3s duration
- **Purposeful Animations**: Every motion serves a function
- **No Flashing**: No rapid or jarring animations

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Adaptations
- **Mobile**: Stacked layouts, larger touch targets
- **Tablet**: Balanced layouts, optimized spacing
- **Desktop**: Multi-column layouts, hover effects

---

## 🎯 Key Design Decisions

### Why UofT Blue?
- Official brand color (PMS 655)
- Conveys trust and stability
- Strong contrast with white
- Recognizable to UofT community

### Why Boundless Blue?
- Secondary UofT brand color
- Energetic and modern
- Great for accent elements
- Complements UofT Blue

### Why Apple Design?
- Clean and timeless
- Excellent accessibility
- Familiar to users
- Focus on content
- Smooth interactions

### Why System Fonts?
- Native look and feel
- Better performance
- Consistent with OS
- No font loading delays
- Better accessibility

---

## 🚀 Performance Optimizations

### CSS
- **CSS Variables**: Efficient theming
- **Minimal Selectors**: Fast rendering
- **Hardware Acceleration**: Transform and opacity
- **Lazy Loading**: Components load on demand

### Animations
- **GPU Accelerated**: Transform and opacity only
- **Short Duration**: 0.2s - 0.3s
- **Purposeful**: No unnecessary motion
- **Reduced Motion**: Respects user preferences

### Images
- **SVG Icons**: Scalable and lightweight
- **Optimized Formats**: Modern image formats
- **Lazy Loading**: Images load when needed
- **CDN**: Fast delivery

---

## 📊 Design Tokens

### Colors
```css
--color-uoft-blue: #1E3765;
--color-boundless-blue: #007FA3;
--color-success: #34C759;
--color-warning: #FF9500;
--color-error: #FF3B30;
```

### Spacing
```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
```

### Border Radius
```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
```

### Shadows
```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
```

---

## 🎨 Usage Guidelines

### When to Use UofT Blue
- Primary buttons
- Active navigation states
- Brand elements
- Important headings

### When to Use Boundless Blue
- Accent buttons
- Links
- Focus indicators
- Secondary actions

### When to Use Semantic Colors
- **Success**: Positive feedback, completed actions
- **Warning**: Caution, attention needed
- **Error**: Errors, destructive actions
- **Info**: Informational messages

---

## 🔄 Migration Notes

### From Previous Design
- Replaced custom colors with official UofT colors
- Removed Nunito font in favor of system fonts
- Increased border radius for softer appearance
- Added more whitespace for breathing room
- Implemented Apple-style animations
- Improved dark mode with true blacks

### Breaking Changes
- Color variables renamed
- Font family changed to system fonts
- Border radius increased
- Shadow system updated
- Spacing system refined

---

## 📚 Resources

### UofT Brand Guidelines
- [Official Brand Guidelines](https://brand.utoronto.ca/guidelines/)
- [Color Palette](https://www.brandcolorcode.com/university-of-toronto)

### Apple Design Resources
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [SF Symbols](https://developer.apple.com/sf-symbols/)
- [Design Resources](https://developer.apple.com/design/resources/)

---

## ✅ Checklist

- [x] Official UofT colors implemented
- [x] Apple design fundamentals applied
- [x] System fonts configured
- [x] Dark mode with true blacks
- [x] Accessibility features (WCAG AA/AAA)
- [x] Responsive design
- [x] Smooth animations
- [x] Consistent spacing
- [x] Proper shadows and depth
- [x] Interactive states
- [x] Focus indicators
- [x] Reduced motion support
- [x] High contrast mode
- [x] Performance optimized

---

## 🎉 Result

A clean, modern, and accessible interface that combines the official University of Toronto brand identity with Apple's design excellence. The result is a professional, trustworthy, and delightful user experience that feels native to both UofT and Apple ecosystems.

**Key Achievements:**
- ✅ Official UofT brand colors
- ✅ Apple-style design system
- ✅ Excellent accessibility
- ✅ Smooth performance
- ✅ Beautiful dark mode
- ✅ Responsive design
- ✅ Consistent interactions
- ✅ Professional appearance
