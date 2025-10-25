# Colorado Top 15 Cities - ECharts Implementation

An interactive bar chart visualization of Colorado's top 15 cities by population, built with Apache ECharts and enhanced with GSAP ScrollTrigger animations.

## Features

- **Interactive Bar Chart**: Top 15 Colorado cities by population with 45° rotated labels
- **ScrollTrigger Animation**: Smooth scroll-driven bar growth animation
- **Mobile Responsive**: Horizontal scrolling on mobile devices (≤480px)
- **Selection System**: Click to toggle city selection with custom events
- **Density Visualization**: Optional color ramp based on population density
- **Accessibility**: Keyboard navigation and screen reader support

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd echarts-top15

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server

```bash
# Local development
npm run dev

# Network access (for mobile testing)
npm run dev -- --host
```

Access at:
- **Local**: http://localhost:5173/
- **Network**: http://[YOUR_IP]:5173/ (for mobile testing)

## Project Structure

```
echarts-top15/
# Note: data/ is shared at parent level
# ../data/colorado-cities-enriched.geojson
├── src/
│   ├── echarts/
│   │   ├── buildChart.js                   # ECharts configuration
│   │   └── theme.js                        # Colors, formatting, utilities
│   ├── scroll/
│   │   └── scrolltrigger-echarts.js       # ScrollTrigger integration
│   ├── utils/
│   │   └── mobile.js                       # Mobile scroll utilities
│   ├── main-echarts.js                     # Main application logic
│   └── styles.css                          # Responsive styles
# Note: specs/ is shared at parent level
# ../specs/ (project specifications)
├── index.html                              # Entry point
└── package.json                            # Dependencies
```

## Core Components

### 1. Chart Builder (`src/echarts/buildChart.js`)

Creates and configures the ECharts bar chart with:
- **Vertical orientation**: Categories on x-axis, values on y-axis
- **45° rotated labels**: Better readability for city names
- **K-format ticks**: Population values formatted as "715K", "1.2M"
- **Selection system**: Click to toggle with dimming effect
- **Smooth animations**: 900ms quartOut easing
- **Responsive design**: Auto-resize on window changes

```javascript
const chartApi = createTop15Chart(container, {
  labels: ['Denver', 'Colorado Springs', ...],
  values: [715522, 478961, ...],
  densities: [4689.2, 2356.8, ...],
  geoids: ['08031', '08035', ...]
});
```

### 2. ScrollTrigger Integration (`src/scroll/scrolltrigger-echarts.js`)

Provides scroll-driven animations:
- **Pin section**: Chart pins during scroll
- **Bar growth**: Bars animate from 0 to full height
- **Timing**: Animation completes at 60% scroll, holds for remaining 40%
- **Smooth scrubbing**: Optimized for continuous, fluid movement
- **Fallback support**: IntersectionObserver when GSAP unavailable

```javascript
// Enable ScrollTrigger
const scrollTrigger = enableScrollTrigger(chartApi, data, {
  trigger: '.pin-section',
  start: 'top top',
  end: '+=1000',
  scrub: 0.1,
  pin: true
});
```

### 3. Mobile Responsive (`src/utils/mobile.js`)

Handles mobile-specific features:
- **Device detection**: Automatically detects mobile devices (≤480px)
- **Horizontal scrolling**: Native mobile scroll behavior
- **Scroll indicators**: Visual cues for scrollable content
- **Touch optimization**: Momentum scrolling with `-webkit-overflow-scrolling: touch`

```javascript
// Initialize mobile features
initMobileFeatures();

// Toggle mobile scroll
toggleMobileScroll(true);  // Enable
toggleMobileScroll(false); // Disable
```

## Configuration

### ScrollTrigger Activation

Enable ScrollTrigger animations via:

**URL Parameter:**
```
http://localhost:5173/?scrolltrigger=true
```

**Body Class:**
```html
<body class="scrolltrigger-enabled">
```

**Programmatic:**
```javascript
// Enable
window.enableScrollTrigger();

// Disable  
window.disableScrollTrigger();

// Toggle
window.toggleScrollTrigger(true);
```

### Mobile Scroll Control

**CSS Class Toggle:**
```javascript
// Disable horizontal scroll
document.querySelector('.chart-container').classList.add('no-horizontal-mobile-scroll');

// Enable horizontal scroll
document.querySelector('.chart-container').classList.remove('no-horizontal-mobile-scroll');
```

**Programmatic:**
```javascript
import { toggleMobileScroll } from './utils/mobile.js';

toggleMobileScroll(false); // Disable horizontal scroll
toggleMobileScroll(true);  // Enable horizontal scroll
```

## Data Format

### Input Data Structure

```javascript
{
  labels: ['Denver', 'Colorado Springs', 'Aurora', ...],
  values: [715522, 478961, 386261, ...],
  densities: [4689.2, 2356.8, 1892.3, ...],
  geoids: ['08031', '08035', '08069', ...]
}
```

### GeoJSON Source

The application loads data from `data/colorado-cities-enriched.geojson`:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "GEOID": "08031",
        "NAME": "Denver", 
        "pop": 715522,
        "density": 4689.2
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-104.9903, 39.7392]
      }
    }
  ]
}
```

## Events

### Chart Selection Events

Listen for city selection changes:

```javascript
window.addEventListener('chart:selection', (event) => {
  const { geoids } = event.detail;
  console.log('Selected cities:', geoids);
  // Handle selection: ['08031', '08035', ...]
});
```

### ScrollTrigger Events

```javascript
// Check if ScrollTrigger is available
if (window.isScrollTriggerAvailable()) {
  console.log('ScrollTrigger ready');
}
```

## Styling

### CSS Custom Properties

```css
:root {
  --chart-height: 60vh;  /* Desktop chart height */
}

@media (max-width: 480px) {
  :root {
    --chart-height: 70vh;  /* Mobile chart height */
  }
}
```

### Mobile Breakpoints

- **Desktop**: `> 480px` - Vertical scrolling with ScrollTrigger
- **Mobile**: `≤ 480px` - Horizontal scrolling with touch support

### Scroll Indicators

The scroll indicator appears automatically on mobile when content is scrollable:

```css
.scroll-indicator {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.55);
  color: white;
  /* ... additional styling */
}
```

## Performance

### Optimizations

1. **Smooth Scrubbing**: Disabled ECharts animations during scroll
2. **Efficient Updates**: Only updates series data, not full chart
3. **Lazy Loading**: GSAP/ScrollTrigger loaded conditionally
4. **Touch Optimization**: Native momentum scrolling on mobile

### Bundle Size

- **ECharts**: ~1.1MB (gzipped: ~374KB)
- **GSAP + ScrollTrigger**: ~115KB (gzipped: ~45KB)
- **Application**: ~0.5KB (gzipped: ~0.3KB)

## Browser Support

- **Modern browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Mobile**: iOS Safari 13+, Chrome Mobile 80+
- **Features**: ES6 modules, CSS Grid, IntersectionObserver

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build         # Build for production  
npm run preview       # Preview production build
```

### Debugging

**ScrollTrigger Debug:**
```html
<body class="scrolltrigger-enabled scrolltrigger-debug">
```

**Console Logging:**
```javascript
// Enable debug logging
localStorage.setItem('debug', 'echarts-scrolltrigger');
```

## Troubleshooting

### Common Issues

**ScrollTrigger not working:**
- Check if GSAP/ScrollTrigger loaded: `window.isScrollTriggerAvailable()`
- Verify body class: `scrolltrigger-enabled`
- Check console for loading errors

**Mobile scroll not working:**
- Verify device width: `window.innerWidth <= 480`
- Check CSS class: `.no-horizontal-mobile-scroll`
- Test touch scrolling: `-webkit-overflow-scrolling: touch`

**Chart not rendering:**
- Verify container element: `#echarts-container`
- Check data format and loading
- Inspect console for ECharts errors

### Performance Issues

**Smooth scrolling:**
- Reduce `scrub` value: `scrub: 0.1` (default)
- Check for conflicting animations
- Verify `silent: true` in chart updates

**Mobile performance:**
- Test on actual devices, not just browser dev tools
- Check for memory leaks in scroll listeners
- Verify touch event handling

## Documentation

- **Quick Reference**: [SCROLLTRIGGER-QUICK-REF.md](./SCROLLTRIGGER-QUICK-REF.md) (ECharts-specific)
- **Timing Guide**: [SCROLLTRIGGER-TIMING-GUIDE.md](./SCROLLTRIGGER-TIMING-GUIDE.md) (ECharts-specific)
- **Maintenance**: [MAINTENANCE.md](./MAINTENANCE.md)
- **Shared Documentation**: [../specs/](../specs/) (Common ScrollTrigger guides)

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on desktop and mobile
5. Submit a pull request

## Support

For issues and questions:
- Check the troubleshooting section
- Review browser console for errors
- Test with different data sets
- Verify mobile device compatibility
