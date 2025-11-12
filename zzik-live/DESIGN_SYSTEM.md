# 🎨 ZZIK LIVE Design System - Nano-Level Specification

## 📋 Table of Contents
1. [Color System](#color-system)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Shadow System](#shadow-system)
5. [Animation System](#animation-system)
6. [Component Architecture](#component-architecture)
7. [Technical Stack](#technical-stack)
8. [Implementation Guide](#implementation-guide)

---

## 1. Color System

### Background Gradients

#### Main Gradient (Map Background)
```css
background: linear-gradient(135deg, 
  #3B4C85 0%,      /* Deep Blue (top-left) */
  #5B4D9E 25%,     /* Blue-Purple transition */
  #7B4FA8 50%,     /* Medium Purple (center) */
  #9852B5 75%,     /* Bright Purple */
  #A855C2 100%     /* Pink-Purple (bottom-right) */
);
```

#### Secondary Spotlight Overlay
```css
background: radial-gradient(
  circle at 30% 20%,
  rgba(59, 76, 133, 0.8),  /* Blue spotlight */
  transparent 50%
);
```

### Location Pin Colors

#### Blue Pin (Default)
```css
background: linear-gradient(135deg, 
  #4A9FE8 0%,    /* Light Blue */
  #5B7FDB 50%,   /* Medium Blue */
  #6B5FCC 100%   /* Blue-Purple */
);
border: 4px solid rgba(255, 255, 255, 0.95);
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
```

#### Purple Pin (Active/Selected)
```css
background: linear-gradient(135deg, 
  #7B6FDB 0%,    /* Medium Purple */
  #8B5FCC 50%,   /* Deep Purple */
  #9B4FBD 100%   /* Dark Purple */
);
```

### Drawer Colors

```css
/* Drawer background with blur */
background: linear-gradient(180deg,
  rgba(59, 76, 133, 0.95) 0%,   /* Blue (top) */
  rgba(107, 79, 168, 0.95) 100% /* Purple (bottom) */
);
backdrop-filter: blur(40px);
-webkit-backdrop-filter: blur(40px);
```

### Photo Card Colors

#### Featured Card Overlay
```css
/* Bottom gradient overlay */
background: linear-gradient(180deg,
  rgba(0, 0, 0, 0) 0%,
  rgba(0, 0, 0, 0.2) 40%,
  rgba(0, 0, 0, 0.6) 100%
);
```

#### Small Card Background
```css
background: linear-gradient(135deg,
  #7B6FDB 0%,    /* Medium Purple */
  #D946EF 100%   /* Pink */
);
```

### UI Element Colors

| Element | Color | Opacity |
|---------|-------|---------|
| Status Bar Text | `#FFFFFF` | 95% |
| Map View Button BG | `rgba(255, 255, 255, 0.2)` | 20% |
| Map View Button Text | `#FFFFFF` | 90% |
| Profile Icon BG | `rgba(255, 255, 255, 0.9)` | 90% |
| Nearby Counter BG | `rgba(59, 76, 133, 0.8)` | 80% |
| Drag Handle | `rgba(255, 255, 255, 0.3)` | 30% |
| Switch Button BG | `linear-gradient(to right, #6366F1, #A855F7)` | 100% |

---

## 2. Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 
             'SF Pro Display', 'SF Pro Text', 
             'Helvetica Neue', Helvetica, Arial, 
             sans-serif;
```

### Type Scale

#### Status Bar (10:09)
```css
font-size: 15px;
font-weight: 600;
letter-spacing: -0.3px;
color: rgba(255, 255, 255, 0.95);
```

#### Map View Button
```css
font-size: 14px;
font-weight: 600;
letter-spacing: -0.2px;
color: rgba(255, 255, 255, 0.9);
```

#### Nearby Counter - Number
```css
font-size: 40px;
font-weight: 700;
letter-spacing: -1px;
line-height: 1;
color: #FFFFFF;
```

#### Nearby Counter - Label
```css
font-size: 13px;
font-weight: 500;
letter-spacing: 0.2px;
color: rgba(255, 255, 255, 0.7);
```

#### Location Title (Brooklyn Bridge Park)
```css
font-size: 20px;
font-weight: 700;
letter-spacing: -0.5px;
color: #FFFFFF;
```

#### Location Category (Park)
```css
font-size: 13px;
font-weight: 500;
letter-spacing: 0.1px;
color: rgba(255, 255, 255, 0.6);
```

#### View Count (1.5K Views)
```css
font-size: 13px;
font-weight: 600;
letter-spacing: -0.1px;
color: rgba(255, 255, 255, 0.95);
```

#### Switch Button
```css
font-size: 18px;
font-weight: 700;
letter-spacing: -0.3px;
color: #FFFFFF;
```

---

## 3. Spacing & Layout

### 8pt Grid System

```css
/* Base unit: 8px */
--spacing-1: 4px;   /* 0.5x */
--spacing-2: 8px;   /* 1x - base unit */
--spacing-3: 12px;  /* 1.5x */
--spacing-4: 16px;  /* 2x */
--spacing-5: 20px;  /* 2.5x */
--spacing-6: 24px;  /* 3x */
--spacing-8: 32px;  /* 4x */
--spacing-12: 48px; /* 6x */
--spacing-16: 64px; /* 8x */
```

### Component Spacing

#### Status Bar
```css
padding: 12px 24px; /* spacing-3 spacing-6 */
height: 44px;
```

#### Map Header
```css
padding: 12px 24px; /* spacing-3 spacing-6 */
gap: 12px; /* spacing-3 */
```

#### Nearby Counter
```css
padding: 12px 16px; /* spacing-3 spacing-4 */
margin-bottom: 24px; /* spacing-6 */
border-radius: 16px; /* spacing-4 */
```

#### Bottom Drawer
```css
padding: 32px 24px 96px; /* spacing-8 spacing-6 spacing-12 */
border-radius: 24px 24px 0 0; /* spacing-6 */
```

#### Featured Photo Card
```css
margin-bottom: 16px; /* spacing-4 */
border-radius: 24px; /* spacing-6 */
padding: 16px; /* spacing-4 */
```

#### Small Photo Card
```css
border-radius: 20px; /* spacing-5 */
padding: 12px; /* spacing-3 */
gap: 12px; /* spacing-3 */
```

#### Switch Button
```css
padding: 16px 48px; /* spacing-4 spacing-12 */
border-radius: 999px; /* fully rounded */
margin-bottom: 24px; /* spacing-6 */
```

### Layout Dimensions

| Component | Width | Height | Aspect Ratio |
|-----------|-------|--------|--------------|
| Location Pin | 56px (14x spacing) | 70px (with pointer) | - |
| Nearby Counter | auto | auto | - |
| Featured Card | 100% container | auto | 16:9 |
| Small Card | 50% - gap | auto | 1:1 |
| Drawer Handle | 48px (6x spacing) | 6px | - |
| Switch Button | auto (min 120px) | 56px (7x spacing) | - |

---

## 4. Shadow System

### Location Pin Shadows

```css
/* Multi-layer shadow for depth */
.location-pin {
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.15),        /* Base shadow */
    0 8px 24px rgba(75, 85, 185, 0.3),     /* Colored glow */
    0 0 60px rgba(75, 85, 185, 0.2);       /* Extended glow */
}

/* Outer glow effect */
.pin-glow {
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.3);
  filter: blur(20px);
}
```

### UI Element Shadows

#### Nearby Counter
```css
box-shadow: 
  0 4px 16px rgba(0, 0, 0, 0.2),
  inset 0 1px 0 rgba(255, 255, 255, 0.1); /* Inner highlight */
```

#### Bottom Drawer
```css
box-shadow: 
  0 -4px 24px rgba(0, 0, 0, 0.15),
  0 -8px 48px rgba(0, 0, 0, 0.1),
  inset 0 1px 0 rgba(255, 255, 255, 0.1);
```

#### Featured Photo Card
```css
box-shadow: 
  0 8px 32px rgba(0, 0, 0, 0.25),
  0 4px 16px rgba(0, 0, 0, 0.15);
```

#### Switch Button
```css
box-shadow: 
  0 8px 32px rgba(107, 79, 232, 0.4),  /* Purple glow */
  0 4px 16px rgba(0, 0, 0, 0.2);       /* Base shadow */
```

---

## 5. Animation System

### Pin Pulse Animation

```css
@keyframes pin-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.pin-pulse {
  animation: pin-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Pin Hover Animation

```css
@keyframes pin-hover {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-4px) scale(1.05);
  }
}

.pin-hover {
  animation: pin-hover 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Glow Pulse Effect

```css
@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

.glow-pulse {
  animation: glow-pulse 2s ease-in-out infinite;
}
```

### Drawer Drag Animation

```css
/* Smooth height transition with spring physics */
.drawer-drag {
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Card Hover

```css
.card-hover {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  transform: scale(1.02);
}
```

### Timing Functions

| Animation Type | Easing Function | Duration |
|----------------|-----------------|----------|
| Pin Pulse | `cubic-bezier(0.4, 0, 0.6, 1)` | 2s |
| Pin Hover | `cubic-bezier(0.4, 0, 0.6, 1)` | 3s |
| Glow Pulse | `ease-in-out` | 2s |
| Drawer Drag | `cubic-bezier(0.4, 0, 0.2, 1)` | 0.3s |
| Card Hover | `cubic-bezier(0.4, 0, 0.2, 1)` | 0.2s |
| Button Tap | `cubic-bezier(0.4, 0, 0.2, 1)` | 0.15s |

---

## 6. Component Architecture

### Location Pin Structure

```
📍 Location Pin Component
├── 🔵 Outer Glow Layer
│   ├── Size: 96px × 96px (w-24 h-24)
│   ├── Position: Absolute, centered on pin
│   ├── Background: rgba(255, 255, 255, 0.3)
│   ├── Filter: blur(80px)
│   └── Animation: Pulse (opacity 0.3 → 0.6 → 0.3)
│
├── ⭕ Pulse Ring
│   ├── Size: 64px × 64px (w-16 h-16)
│   ├── Position: Absolute, centered
│   ├── Border: 2px solid white
│   ├── Animation: Scale 1 → 1.5, Opacity 0.5 → 0
│   └── Duration: 2s infinite
│
├── 🎯 Pin Container
│   ├── Size: 56px × 56px (w-14 h-14)
│   ├── Transform: -translate-x-1/2 -translate-y-full
│   │
│   ├── 💎 Pin Circle
│   │   ├── Border-radius: 50% (rounded-full)
│   │   ├── Background: Linear gradient (blue → purple)
│   │   ├── Border: 4px solid rgba(255, 255, 255, 0.95)
│   │   ├── Box-shadow: Multi-layer with colored glow
│   │   └── Content: Photo thumbnail (object-cover)
│   │
│   └── 📐 Pin Pointer
│       ├── Position: Absolute, bottom center
│       ├── Size: 0 (CSS triangle)
│       ├── Border: 8px transparent + 8px colored top
│       └── Color: Matches pin gradient end color
│
└── ✨ Interaction States
    ├── Hover: Scale 1.1, translateY -4px
    ├── Tap: Scale 0.95
    └── Selected: Gradient shift, border color change
```

### Bottom Drawer Structure

```
📱 Bottom Drawer Component
├── 🎚️ Drag Handle
│   ├── Size: 48px × 6px (w-12 h-1.5)
│   ├── Position: Absolute top-3 left-1/2 -translate-x-1/2
│   ├── Background: rgba(255, 255, 255, 0.3)
│   └── Border-radius: 9999px (fully rounded)
│
├── 📄 Content Container
│   ├── Padding: 32px 24px 96px
│   ├── Overflow: auto (scroll)
│   │
│   ├── 📍 Location Header
│   │   ├── Title: 20px, 700 weight, -0.5px letter-spacing
│   │   ├── Category: 13px, 500 weight, 60% opacity
│   │   ├── Distance: 13px, 500 weight, 60% opacity
│   │   └── Like Button: Heart icon, top-right
│   │
│   ├── 🖼️ Featured Card (Large)
│   │   ├── Aspect Ratio: 16:9
│   │   ├── Border Radius: 24px (spacing-6)
│   │   ├── Margin Bottom: 16px (spacing-4)
│   │   │
│   │   ├── 📸 Image/Gradient Layer
│   │   │   └── Background: Gradient placeholder or image
│   │   │
│   │   ├── 🌅 Bottom Gradient Overlay
│   │   │   ├── Position: Absolute inset-0
│   │   │   └── Gradient: Transparent → black/60
│   │   │
│   │   ├── 👁️ Info Section (Bottom)
│   │   │   ├── Position: Absolute bottom-4 left-4 right-4
│   │   │   ├── Background: rgba(0, 0, 0, 0.4) + blur(16px)
│   │   │   ├── Padding: 12px 16px
│   │   │   ├── Border Radius: 12px
│   │   │   └── Content:
│   │   │       ├── Eye icon + "1.5K Views"
│   │   │       └── Heart icon + like count
│   │   │
│   │   └── 📍 Location Icon (Top-right)
│   │       ├── Size: 48px × 48px (w-12 h-12)
│   │       ├── Background: rgba(255, 255, 255, 0.2) + blur
│   │       └── Icon: MapPin, 24px, white
│   │
│   └── 🎴 Small Cards Grid
│       ├── Layout: Grid 2 columns
│       ├── Gap: 12px (spacing-3)
│       │
│       └── Card (Each)
│           ├── Aspect Ratio: 1:1 (square)
│           ├── Border Radius: 20px (spacing-5)
│           ├── Background: Purple-pink gradient
│           │
│           └── Info Overlay (Bottom)
│               ├── Background: rgba(0, 0, 0, 0.4) + blur
│               ├── Padding: 8px 12px
│               └── Content: Eye + views, Heart + likes
│
└── 🔘 Switch Button
    ├── Position: Absolute bottom-6 left-1/2 -translate-x-1/2
    ├── Padding: 16px 48px (spacing-4 spacing-12)
    ├── Background: Linear gradient (blue-500 → purple-500)
    ├── Border Radius: 9999px (fully rounded)
    ├── Font: 18px, 700 weight, white
    └── Shadow: Purple glow + base shadow
```

### Nearby Counter Structure

```
📊 Nearby Counter Component
├── Container
│   ├── Position: Absolute bottom-48% left-6
│   ├── Background: rgba(59, 76, 133, 0.8) + blur(40px)
│   ├── Padding: 12px 16px (spacing-3 spacing-4)
│   ├── Border Radius: 16px (spacing-4)
│   └── Border: 1px solid rgba(255, 255, 255, 0.2)
│
├── Number Display
│   ├── Font Size: 40px
│   ├── Font Weight: 700
│   ├── Letter Spacing: -1px
│   ├── Line Height: 1
│   └── Color: #FFFFFF
│
└── Label
    ├── Font Size: 13px
    ├── Font Weight: 500
    ├── Letter Spacing: 0.2px
    └── Color: rgba(255, 255, 255, 0.7)
```

---

## 7. Technical Stack

### Core Technologies

#### Frontend Framework
```json
{
  "name": "Next.js",
  "version": "^14.2.0",
  "features": [
    "React Server Components",
    "App Router",
    "Image Optimization",
    "API Routes"
  ],
  "reason": "Production-ready, SEO-friendly, optimal performance"
}
```

#### Map Library
```json
{
  "primary": {
    "name": "Mapbox GL JS",
    "version": "^3.0.0",
    "features": [
      "Vector tile rendering",
      "Custom styling",
      "WebGL performance",
      "3D terrain support"
    ],
    "pricing": "Free tier: 50k loads/month"
  },
  "wrapper": {
    "name": "react-map-gl",
    "version": "^7.1.0",
    "reason": "React hooks integration, easier state management"
  }
}
```

#### Animation Library
```json
{
  "primary": {
    "name": "Framer Motion",
    "version": "^11.0.0",
    "features": [
      "Declarative animations",
      "Drag gestures",
      "Layout animations",
      "Spring physics",
      "SVG path animations"
    ]
  },
  "gestures": {
    "name": "@use-gesture/react",
    "version": "^10.3.0",
    "features": [
      "Drag handling",
      "Pinch/zoom",
      "Wheel gestures",
      "Touch support"
    ]
  }
}
```

#### State Management
```json
{
  "name": "Zustand",
  "version": "^4.5.0",
  "stores": [
    "mapViewStore (center, zoom, bearing)",
    "selectedLocationStore (active pin)",
    "drawerHeightStore (drawer state)",
    "userLocationStore (GPS coordinates)"
  ],
  "reason": "Lightweight, hooks-based, minimal boilerplate"
}
```

#### Styling
```json
{
  "framework": "Tailwind CSS v4",
  "version": "^4.0.0",
  "features": [
    "@theme directive",
    "CSS variables",
    "Custom design tokens",
    "JIT compiler"
  ]
}
```

#### Icons
```json
{
  "name": "Lucide React",
  "version": "^0.300.0",
  "icons_used": [
    "MapPin", "Camera", "Home", "User",
    "Eye", "Heart", "Navigation", "Upload"
  ]
}
```

### Supporting Libraries

```json
{
  "geolocation": "navigator.geolocation API",
  "image_optimization": "next/image",
  "fonts": "next/font (Google Fonts)",
  "analytics": "Vercel Analytics (optional)",
  "testing": {
    "unit": "Jest + React Testing Library",
    "e2e": "Playwright"
  }
}
```

---

## 8. Implementation Guide

### Install Dependencies

```bash
npm install next@latest react@latest react-dom@latest
npm install framer-motion@^11.0.0
npm install mapbox-gl@^3.0.0 react-map-gl@^7.1.0
npm install @use-gesture/react@^10.3.0
npm install zustand@^4.5.0
npm install lucide-react@^0.300.0
npm install -D @types/mapbox-gl tailwindcss@latest
```

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_access_token
NEXT_PUBLIC_API_URL=https://api.zzik-live.com
```

### Mapbox Configuration

```typescript
// lib/mapbox-config.ts
export const MAP_CONFIG = {
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN!,
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [-74.006, 40.7128] as [number, number], // NYC
  zoom: 13,
  pitch: 0,
  bearing: 0,
  minZoom: 10,
  maxZoom: 18,
};

export const CUSTOM_MAP_STYLE = {
  version: 8,
  name: 'ZZIK LIVE Custom',
  sources: {
    'mapbox-streets': {
      type: 'vector',
      url: 'mapbox://mapbox.mapbox-streets-v8'
    }
  },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': 'rgba(59, 76, 133, 0.8)',
      }
    },
    {
      id: 'building-outline',
      type: 'line',
      source: 'mapbox-streets',
      'source-layer': 'building',
      paint: {
        'line-color': 'rgba(255, 255, 255, 0.2)',
        'line-width': 1,
      }
    }
  ]
};
```

### Performance Optimization

#### Image Optimization
```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['your-cdn.com', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

#### Marker Clustering
```typescript
// hooks/useMarkerCluster.ts
import { useMemo } from 'react';

export function useMarkerCluster(
  pins: LocationPin[],
  options = { radius: 60, maxZoom: 15 }
) {
  return useMemo(() => {
    // Implement clustering logic
    // Group nearby pins into clusters
    return clusteredPins;
  }, [pins, options]);
}
```

#### Lazy Loading
```typescript
// components/PhotoCard.tsx
import Image from 'next/image';

<Image
  src={photo.imageUrl}
  alt="Location photo"
  width={400}
  height={400}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Accessibility

```typescript
// components/LocationPin.tsx
<motion.button
  role="button"
  aria-label={`View ${location.name} details`}
  aria-pressed={isSelected}
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick();
    }
  }}
>
  {/* Pin content */}
</motion.button>
```

### Responsive Breakpoints

```css
/* tailwind.config.js */
module.exports = {
  theme: {
    screens: {
      'xs': '375px',   /* iPhone SE */
      'sm': '640px',   /* Small tablets */
      'md': '768px',   /* Tablets */
      'lg': '1024px',  /* Small laptops */
      'xl': '1280px',  /* Desktops */
      '2xl': '1536px', /* Large screens */
    },
  },
};
```

---

## 📝 Notes

- All measurements follow the 8pt grid system
- Colors use RGBA for opacity control
- Animations use cubic-bezier for natural motion
- Shadows use multiple layers for depth
- Typography scales use negative letter-spacing for tighter headings
- Components are modular and reusable
- Performance optimized with lazy loading and clustering
- Accessibility features included (ARIA labels, keyboard navigation)

---

## 🔗 References

- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/)
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [React Map GL Documentation](https://visgl.github.io/react-map-gl/)

---

**Version:** 1.0.0  
**Last Updated:** 2025-11-12  
**Author:** GenSpark AI Developer
