# Ezoic Ad Integration Guide

## Overview

This document explains how the EMI Calculator integrates with Ezoic for ad monetization while maintaining a good user experience.

## Ad Placement Strategy

We've implemented a non-intrusive ad strategy with the following placements:

1. **Top of Page** (ID: 101) - Above the main content
2. **Between Sections** (ID: 104) - Between major content sections
3. **Bottom of Page** (ID: 103) - After all content

## Implementation Details

### HTML Structure

Each ad container follows this structure:

```html
<!-- Ezoic - [placement_name] - [placement_name] -->
<div id="ezoic-pub-ad-placeholder-[id]" class="ad-container ad-container-horizontal"></div>
<!-- End Ezoic - [placement_name] -->
```

### CSS Styling

Ad containers are styled in `styles/ads.css` with:

- Responsive sizing
- Loading states
- Mobile optimizations
- Fallback handling

### JavaScript Management

The `js/ad-manager.js` script provides:

- Ad container initialization
- Responsive behavior handling
- Ad blocker detection
- Ad refresh functionality

## Responsive Behavior

Ads automatically adjust to different screen sizes:

- **Desktop**: 728x90 (leaderboard)
- **Tablet**: 468x60 (banner)
- **Mobile**: 320x50 (mobile banner)

## User Experience Considerations

1. **Loading States**: Subtle loading indicators prevent layout shifts
2. **Mobile Optimization**: Smaller ad sizes on mobile devices
3. **Ad Blocker Handling**: Graceful fallback when ads are blocked
4. **Performance**: Minimal impact on page load times

## Testing

To preview ad placements without actual ads loading:

1. Open `ad-preview.html` to see placeholder representations
2. Test on different devices to verify responsive behavior

## Integration with Ezoic

To complete the Ezoic integration:

1. Sign up for an Ezoic account
2. Add your site to Ezoic
3. Install Ezoic integration code
4. Configure the ad placeholders in Ezoic dashboard
5. Set up placeholder IDs (101, 103, 104) to match our implementation

## Maintenance

When making changes to the application:

1. Preserve the ad container structure
2. Call `refreshAds()` after dynamic content changes
3. Test ad placements on different devices
4. Monitor ad performance in Ezoic dashboard