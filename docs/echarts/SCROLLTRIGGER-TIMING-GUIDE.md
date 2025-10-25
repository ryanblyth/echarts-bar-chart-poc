# ScrollTrigger Timing Guide - ECharts Implementation

## Animation Timing Overview

The ScrollTrigger animation uses a **60/40 split** for optimal user experience:

- **0-60% scroll**: Bars grow from 0 to full height
- **60-100% scroll**: Bars stay at full height (pinned section)

## Timing Configuration

### ScrollTrigger Settings
```javascript
const scrollTrigger = ScrollTrigger.create({
  trigger: '.pin-section',
  start: 'top top',        // Start when section hits viewport top
  end: '+=1000',           // Total scroll distance (1000px)
  scrub: 0.1,              // Smooth scrubbing (0.1 = very smooth)
  pin: true,               // Pin section during animation
});
```

### Animation Progress Calculation
```javascript
onUpdate: (self) => {
  const rawProgress = self.progress;           // 0 to 1
  const animationProgress = Math.min(rawProgress / 0.6, 1); // 0 to 1, caps at 60%
  
  // Update bar heights
  const scaledValues = originalData.map(val => val * animationProgress);
  chartApi.updateValues(scaledValues, true);
}
```

## Timing Breakdown

### Phase 1: Bar Growth (0-60% scroll)
```
Scroll Progress: 0% → 60%
Animation: 0% → 100% (full bar height)
Duration: ~600px of scroll
```

### Phase 2: Hold State (60-100% scroll)
```
Scroll Progress: 60% → 100%
Animation: 100% (bars stay at full height)
Duration: ~400px of scroll
```

## Customizing Timing

### Adjust Animation Speed
```javascript
// Faster animation (40% scroll)
const animationProgress = Math.min(rawProgress / 0.4, 1);

// Slower animation (80% scroll)  
const animationProgress = Math.min(rawProgress / 0.8, 1);
```

### Adjust Total Distance
```javascript
// Shorter scroll distance
end: '+=800',   // 800px total

// Longer scroll distance
end: '+=1200',  // 1200px total
```

### Adjust Scrubbing Smoothness
```javascript
// Smoother (more responsive)
scrub: 0.05,

// Less smooth (more lag)
scrub: 0.5,

// No scrubbing (jump to position)
scrub: false
```

## Mobile Timing

### Horizontal Scroll Timing
On mobile (≤480px), the timing adapts to horizontal scroll:

```css
.chart-container {
  overflow-x: auto;        /* Horizontal scroll */
  overflow-y: hidden;     /* Prevent vertical scroll */
  -webkit-overflow-scrolling: touch; /* Momentum */
}
```

### Mobile Scroll Distance
```javascript
// Chart width determines scroll distance
.chart-container #echarts-container {
  width: 480px;           /* Fixed width for horizontal scroll */
  min-width: 480px;       /* Minimum width */
}
```

## Performance Considerations

### Smooth Scrubbing
```javascript
// Disable ECharts animations during scroll
chartApi.updateValues(scaledValues, true); // true = disable animations

// Use efficient update method
chart.setOption({
  series: [{ data: scaledValues }]
}, { 
  notMerge: false,
  lazyUpdate: true,
  silent: true  // Prevent event triggers
});
```

### ScrollTrigger Optimization
```javascript
const scrollTrigger = ScrollTrigger.create({
  trigger: '.pin-section',
  start: 'top top',
  end: '+=1000',
  scrub: 0.1,              // Smooth scrubbing
  refreshPriority: -1,     // Higher priority updates
  pin: true,
  onUpdate: (self) => {
    // Efficient progress calculation
    const animationProgress = Math.min(self.progress / 0.6, 1);
    const scaledValues = originalData.map(val => val * animationProgress);
    chartApi.updateValues(scaledValues, true);
  }
});
```

## Debugging Timing

### Progress Monitoring
```javascript
onUpdate: (self) => {
  console.log('Scroll progress:', self.progress);
  console.log('Animation progress:', Math.min(self.progress / 0.6, 1));
  console.log('Bar heights:', scaledValues);
}
```

### Visual Debugging
```html
<!-- Enable debug markers -->
<body class="scrolltrigger-enabled scrolltrigger-debug">
```

### Timing Validation
```javascript
// Check if timing is working correctly
const validateTiming = () => {
  const progress = ScrollTrigger.getById('echarts-top15-pin')?.progress;
  console.log('Current progress:', progress);
  
  if (progress < 0.6) {
    console.log('Phase 1: Bar growth');
  } else {
    console.log('Phase 2: Hold state');
  }
};
```

## Common Timing Issues

### Animation Too Fast
**Problem**: Bars reach full height too quickly
**Solution**: Increase animation phase
```javascript
const animationProgress = Math.min(rawProgress / 0.8, 1); // 80% scroll
```

### Animation Too Slow  
**Problem**: Bars don't reach full height
**Solution**: Decrease animation phase
```javascript
const animationProgress = Math.min(rawProgress / 0.4, 1); // 40% scroll
```

### Jerky Animation
**Problem**: Animation stutters or jumps
**Solution**: 
1. Reduce scrub value: `scrub: 0.1`
2. Disable ECharts animations: `chartApi.updateValues(values, true)`
3. Check for conflicting CSS animations

### Mobile Scroll Issues
**Problem**: Horizontal scroll not working
**Solution**:
1. Check device width: `window.innerWidth <= 480`
2. Verify CSS: `overflow-x: auto`
3. Test on actual device

## Advanced Timing

### Custom Easing
```javascript
// Custom easing function
const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

const animationProgress = easeInOutCubic(Math.min(rawProgress / 0.6, 1));
```

### Multi-Phase Animation
```javascript
onUpdate: (self) => {
  const progress = self.progress;
  
  if (progress < 0.3) {
    // Phase 1: Slow start
    const phase1Progress = progress / 0.3;
    const animationProgress = phase1Progress * 0.3;
  } else if (progress < 0.8) {
    // Phase 2: Fast growth
    const phase2Progress = (progress - 0.3) / 0.5;
    const animationProgress = 0.3 + (phase2Progress * 0.7);
  } else {
    // Phase 3: Hold
    const animationProgress = 1;
  }
}
```

### Responsive Timing
```javascript
// Adjust timing based on screen size
const getTimingConfig = () => {
  if (window.innerWidth <= 480) {
    return { end: '+=600', animationPhase: 0.7 }; // Mobile
  } else {
    return { end: '+=1000', animationPhase: 0.6 }; // Desktop
  }
};
```
