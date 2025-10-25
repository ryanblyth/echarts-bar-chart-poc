# ScrollTrigger Quick Reference - ECharts Implementation

## Quick Start

### Enable ScrollTrigger
```html
<!-- Method 1: Body class -->
<body class="scrolltrigger-enabled">

<!-- Method 2: URL parameter -->
http://localhost:5173/?scrolltrigger=true
```

### Basic Usage
```javascript
// Check if available
if (window.isScrollTriggerAvailable()) {
  console.log('ScrollTrigger ready');
}

// Enable/disable
window.enableScrollTrigger();
window.disableScrollTrigger();
window.toggleScrollTrigger(true);
```

## Configuration Options

### ScrollTrigger Settings
```javascript
const options = {
  trigger: '.pin-section',     // Element to trigger on
  start: 'top top',           // When to start animation
  end: '+=1000',              // Total scroll distance
  scrub: 0.1,                 // Smooth scrubbing (0.1 = very smooth)
  pin: true,                  // Pin element during scroll
  markers: false              // Show debug markers
};
```

### Animation Timing
- **0-60% scroll**: Bars grow from 0 to full height
- **60-100% scroll**: Bars stay at full height (pinned)
- **Smooth scrubbing**: `scrub: 0.1` for fluid movement

## Mobile Configuration

### Horizontal Scroll (≤480px)
```javascript
// Enable horizontal scroll (default on mobile)
toggleMobileScroll(true);

// Disable horizontal scroll
toggleMobileScroll(false);

// Check if disabled
isMobileScrollDisabled();
```

### Mobile Detection
```javascript
import { isMobile } from './utils/mobile.js';

if (isMobile()) {
  console.log('Mobile device detected');
}
```

## Event Handling

### Chart Selection
```javascript
window.addEventListener('chart:selection', (event) => {
  const { geoids } = event.detail;
  console.log('Selected cities:', geoids);
});
```

### ScrollTrigger Lifecycle
```javascript
const scrollTrigger = ScrollTrigger.create({
  trigger: '.pin-section',
  onUpdate: (self) => {
    console.log('Progress:', self.progress);
  },
  onComplete: () => {
    console.log('Animation complete');
  }
});
```

## CSS Classes

### ScrollTrigger States
```css
.scrolltrigger-enabled .chart-container {
  /* Chart ready for ScrollTrigger */
}

.scrolltrigger-enabled .chart-container.pinned {
  /* Chart is pinned during scroll */
}

.scrolltrigger-debug .chart-container::before {
  /* Debug indicator */
  content: "ScrollTrigger Active";
}
```

### Mobile Scroll States
```css
.chart-container {
  /* Default: horizontal scroll on mobile */
}

.chart-container.no-horizontal-mobile-scroll {
  /* Disabled: normal responsive behavior */
}
```

## Performance Tips

### Smooth Animation
```javascript
// Disable ECharts animations during scroll
chartApi.updateValues(newValues, true); // true = disable animations
```

### Mobile Optimization
```css
.chart-container {
  -webkit-overflow-scrolling: touch; /* Momentum scrolling */
  overflow-x: auto;                   /* Horizontal scroll */
  overflow-y: hidden;                 /* Prevent vertical scroll */
}
```

## Debugging

### Enable Debug Mode
```html
<body class="scrolltrigger-enabled scrolltrigger-debug">
```

### Console Debugging
```javascript
// Check ScrollTrigger status
console.log('ScrollTrigger available:', window.isScrollTriggerAvailable());

// Check mobile scroll status
console.log('Mobile scroll disabled:', isMobileScrollDisabled());

// Check device type
console.log('Is mobile:', isMobile());
```

### Common Issues

**Animation not smooth:**
- Reduce `scrub` value: `scrub: 0.1`
- Check for conflicting CSS animations
- Verify `silent: true` in chart updates

**Mobile scroll not working:**
- Check device width: `window.innerWidth <= 480`
- Verify CSS class: `.no-horizontal-mobile-scroll`
- Test on actual device, not browser dev tools

**ScrollTrigger not loading:**
- Check network tab for GSAP/ScrollTrigger loading
- Verify body class: `scrolltrigger-enabled`
- Check console for JavaScript errors

## API Reference

### Global Functions
```javascript
window.enableScrollTrigger()     // Enable ScrollTrigger
window.disableScrollTrigger()    // Disable ScrollTrigger  
window.toggleScrollTrigger(bool) // Toggle ScrollTrigger
window.isScrollTriggerAvailable() // Check availability
```

### Mobile Utilities
```javascript
import { 
  isMobile, 
  toggleMobileScroll, 
  updateScrollIndicator,
  isMobileScrollDisabled 
} from './utils/mobile.js';
```

### Chart API
```javascript
const chartApi = createTop15Chart(container, data);

chartApi.updateValues(newValues, disableAnimation);
chartApi.axisMax;  // Fixed axis maximum
chartApi.destroy(); // Cleanup
```
