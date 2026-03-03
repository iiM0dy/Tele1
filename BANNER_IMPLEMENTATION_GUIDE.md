# Banner Implementation Guide

## Overview
The banner system now supports separate images for desktop and mobile screens. The mobile image field is optional - if not provided, the desktop image will be used on mobile devices.

## Recommended Image Resolutions

### Desktop/Large Screens
- **Resolution**: 1920x800px
- **Aspect Ratio**: 21:9 (Cinematic widescreen)
- **Format**: JPG or WebP
- **File Size**: Keep under 500KB for optimal loading
- **Use Case**: Displays on tablets (landscape) and desktop screens (md breakpoint and above)

### Mobile/Small Screens
- **Resolution**: 750x1334px
- **Aspect Ratio**: 9:16 (Vertical/Portrait)
- **Format**: JPG or WebP
- **File Size**: Keep under 300KB for optimal loading
- **Use Case**: Displays on mobile phones and small tablets (below md breakpoint)
- **Note**: This field is OPTIONAL - if left empty, the desktop image will be used

## Implementation Details

### Admin Panel
The banner modal (`app/admin/(dashboard)/banners/BannerModal.tsx`) includes:
- Desktop image input (required) with resolution guidance
- Mobile image input (optional) with resolution guidance
- Live preview for both images showing correct aspect ratios
- Desktop preview: 21:9 aspect ratio
- Mobile preview: 9:16 aspect ratio (centered, smaller display)

### Frontend Display
Both hero components now support responsive images:

1. **HeroSlideshow** (`components/home/HeroSlideshow.tsx`)
   - Shows desktop image on screens ≥768px (md breakpoint)
   - Shows mobile image (or fallback to desktop) on screens <768px
   - Maintains smooth transitions and animations

2. **HeroBanner** (`components/home/HeroBanner.tsx`)
   - Same responsive behavior as HeroSlideshow
   - Optimized for single banner display

### Database Schema
The `Banner` model in Prisma includes:
```prisma
model Banner {
  image       String   // Required - Desktop image
  mobileImage String?  // Optional - Mobile image
  // ... other fields
}
```

## Best Practices

### Image Optimization
1. Use WebP format when possible for better compression
2. Compress images before uploading (use tools like TinyPNG, Squoosh)
3. Ensure images are properly sized - don't upload 4K images and rely on browser scaling

### Design Guidelines
1. **Desktop banners**: Design with horizontal composition in mind
   - Place key elements in the center
   - Text should be readable at various screen widths
   
2. **Mobile banners**: Design with vertical composition in mind
   - Place key elements in the center vertically
   - Ensure text is large enough for mobile screens
   - Consider touch-friendly button sizes

### Content Strategy
1. Always provide a desktop image (required)
2. Provide a mobile image when:
   - Desktop image has horizontal text that would be too small on mobile
   - Desktop composition doesn't work well in portrait orientation
   - You want to show different content/messaging on mobile
3. Skip mobile image when:
   - Desktop image works well on mobile (simple, centered composition)
   - You want to maintain consistent branding across all devices

## Testing
Test your banners on:
- Desktop browsers (Chrome, Firefox, Safari)
- Mobile devices (iOS Safari, Android Chrome)
- Tablet devices in both orientations
- Different screen sizes using browser dev tools

## Technical Notes
- Images are loaded using Next.js Image component for optimization
- Priority loading is enabled for the first banner
- Responsive images use CSS `hidden` and `block` classes with `md:` breakpoint
- Fallback: If mobile image is not provided, desktop image is used automatically
