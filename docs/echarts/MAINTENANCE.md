# Maintenance Guide - ECharts Implementation

## Project Overview

This ECharts implementation provides an interactive bar chart with ScrollTrigger animations for Colorado's top 15 cities by population. The project uses modern web technologies and follows responsive design principles.

## Architecture

### Core Technologies
- **Apache ECharts**: Chart rendering and interaction
- **GSAP ScrollTrigger**: Scroll-driven animations
- **Vite**: Build tool and development server
- **Vanilla JavaScript**: No framework dependencies

### Key Components
- `src/echarts/buildChart.js`: ECharts configuration and setup
- `src/scroll/scrolltrigger-echarts.js`: ScrollTrigger integration
- `src/utils/mobile.js`: Mobile responsive utilities
- `src/main-echarts.js`: Main application logic

## Dependencies

### Production Dependencies
```json
{
  "echarts": "^5.x.x"  // Chart library
}
```

### Development Dependencies
```json
{
  "vite": "^7.x.x"     // Build tool
}
```

### Optional Dependencies
```json
{
  "gsap": "^3.12.x"    // Animation library (loaded via CDN)
}
```

## Data Management

### Data Source
- **File**: `data/colorado-cities-enriched.geojson`
- **Format**: GeoJSON with population and density data
- **Processing**: Sorted by population, top 15 cities

### Data Structure
```javascript
{
  labels: ['Denver', 'Colorado Springs', ...],
  values: [715522, 478961, ...],
  densities: [4689.2, 2356.8, ...],
  geoids: ['08031', '08035', ...]
}
```

## Performance Monitoring

### Key Metrics
- **Chart render time**: < 100ms
- **ScrollTrigger setup**: < 50ms
- **Mobile scroll**: 60fps on modern devices
- **Bundle size**: ~1.1MB total (374KB gzipped)

### Performance Tools
```javascript
// Performance monitoring
const startTime = performance.now();
// ... chart operations
const endTime = performance.now();
console.log(`Chart render time: ${endTime - startTime}ms`);
```

## Browser Compatibility

### Supported Browsers
- **Chrome**: 80+ (full support)
- **Firefox**: 75+ (full support)
- **Safari**: 13+ (full support)
- **Edge**: 80+ (full support)
- **Mobile**: iOS 13+, Android 8+

### Feature Detection
```javascript
// Check for required features
const hasIntersectionObserver = 'IntersectionObserver' in window;
const hasResizeObserver = 'ResizeObserver' in window;
const hasTouchEvents = 'ontouchstart' in window;
```

## Common Issues & Solutions

### ScrollTrigger Not Loading
**Symptoms**: No scroll animation, console errors
**Solutions**:
1. Check network tab for GSAP/ScrollTrigger loading
2. Verify body class: `scrolltrigger-enabled`
3. Check console for JavaScript errors
4. Test with `?scrolltrigger=true` URL parameter

### Mobile Scroll Issues
**Symptoms**: Horizontal scroll not working on mobile
**Solutions**:
1. Check device width: `window.innerWidth <= 480`
2. Verify CSS: `overflow-x: auto` on `.chart-container`
3. Test on actual device, not browser dev tools
4. Check for conflicting CSS animations

### Chart Rendering Problems
**Symptoms**: Chart not displaying or errors
**Solutions**:
1. Verify container element: `#echarts-container`
2. Check data format and loading
3. Inspect console for ECharts errors
4. Test with mock data

### Performance Issues
**Symptoms**: Jerky animation, slow scrolling
**Solutions**:
1. Reduce `scrub` value: `scrub: 0.1`
2. Disable ECharts animations: `chartApi.updateValues(values, true)`
3. Check for conflicting CSS animations
4. Test on different devices

## Maintenance Tasks

### Regular Updates

#### Monthly
- [ ] Check for ECharts updates
- [ ] Review browser compatibility
- [ ] Test on latest mobile devices
- [ ] Update dependencies if needed

#### Quarterly
- [ ] Performance audit
- [ ] Accessibility review
- [ ] Security scan
- [ ] Documentation review

#### Annually
- [ ] Major dependency updates
- [ ] Browser support review
- [ ] Performance optimization
- [ ] Feature enhancement planning

### Code Quality

#### Linting
```bash
# Check for linting errors
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

#### Testing
```bash
# Run tests
npm test

# Test on multiple devices
npm run test:mobile
```

#### Performance
```bash
# Build and analyze bundle
npm run build
npm run analyze

# Test performance
npm run perf:test
```

## Deployment

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
```bash
# Development
NODE_ENV=development

# Production
NODE_ENV=production
```

### CDN Configuration
```html
<!-- GSAP CDN (conditional loading) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
```

## Monitoring & Analytics

### Error Tracking
```javascript
// Global error handler
window.addEventListener('error', (event) => {
  console.error('Chart error:', event.error);
  // Send to analytics service
});

// ScrollTrigger error handling
if (typeof ScrollTrigger === 'undefined') {
  console.warn('ScrollTrigger not available, using fallback');
}
```

### Performance Monitoring
```javascript
// Chart render performance
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.name.includes('echarts')) {
      console.log('Chart performance:', entry.duration);
    }
  });
});
observer.observe({ entryTypes: ['measure'] });
```

## Security Considerations

### Data Security
- No sensitive data in client-side code
- GeoJSON data is public information
- No authentication required

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;">
```

## Backup & Recovery

### Data Backup
- Source data: `data/colorado-cities-enriched.geojson`
- Configuration: `package.json`, `vite.config.js`
- Documentation: All `.md` files

### Recovery Procedures
1. Restore from version control
2. Reinstall dependencies: `npm install`
3. Rebuild project: `npm run build`
4. Test functionality

## Troubleshooting Checklist

### Before Reporting Issues
- [ ] Check browser console for errors
- [ ] Test on different devices/browsers
- [ ] Verify data loading
- [ ] Check network connectivity
- [ ] Test with/without ScrollTrigger

### Debug Information
```javascript
// Collect debug information
const debugInfo = {
  userAgent: navigator.userAgent,
  screenSize: `${window.innerWidth}x${window.innerHeight}`,
  scrollTriggerAvailable: window.isScrollTriggerAvailable(),
  mobileDevice: isMobile(),
  chartRendered: !!document.querySelector('#echarts-container canvas')
};
console.log('Debug info:', debugInfo);
```

## Support & Resources

### Documentation
- [ECharts Documentation](https://echarts.apache.org/en/option.html)
- [GSAP ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [Vite Documentation](https://vitejs.dev/guide/)

### Community
- ECharts GitHub Issues
- GSAP Community Forum
- Stack Overflow (echarts, scrolltrigger tags)

### Internal Resources
- Project README
- ScrollTrigger Quick Reference
- Timing Guide
- This Maintenance Guide
