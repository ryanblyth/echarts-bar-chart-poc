// scrolltrigger-echarts.js (optional)
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Store original data for animation
let originalData = null;

/**
 * Initialize ScrollTrigger for chart scrubbing
 * @param {Object} chartApi - ECharts chart API
 * @param {Object} data - Chart data
 * @param {Object} options - ScrollTrigger options
 */
export function initScrollTrigger(chartApi, data, options = {}) {
  // Check if GSAP and ScrollTrigger are available
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not available. Using fallback animation.');
    return initFallbackAnimation(chartApi);
  }
  
  // Store original data
  if (!originalData) {
    originalData = [...data.values];
  }
  
  // Store the max Y-axis value to keep it fixed
  const maxYValue = chartApi.axisMax || Math.max(...originalData) * 1.1;
  
  // Set initial state (bars at 0) - disable animations for smooth start
  chartApi.updateValues(originalData.map(() => 0), true);
  
  // Set up ScrollTrigger with pinning - optimized for smoothness
  const scrollTrigger = ScrollTrigger.create({
    trigger: options.trigger || '.pin-section',
    start: options.start || 'top top',
    end: options.end || '+=1000',
    scrub: options.scrub !== false ? 0.1 : false, // Smoother scrubbing with lower value
    pin: options.pin !== false ? true : false, // Enable pinning by default
    refreshPriority: -1, // Higher priority for smoother updates
    onUpdate: (self) => {
      // Use custom easing to reach 100% faster and then hold
      // Animation reaches 100% at 60% of scroll, then holds for remaining 40%
      const rawProgress = self.progress;
      const animationProgress = Math.min(rawProgress / 0.6, 1);
      
      // Update bar heights based on animation progress - use smooth interpolation
      const scaledValues = originalData.map(val => val * animationProgress);
      chartApi.updateValues(scaledValues, true); // Disable ECharts animations for smooth scrubbing
    },
    onComplete: () => {
      // Ensure full bar height when complete
      chartApi.updateValues([...originalData]);
    }
  });
  
  return scrollTrigger;
}

/**
 * Fallback animation using IntersectionObserver
 * @param {Object} chartApi - ECharts chart API
 */
function initFallbackAnimation(chartApi) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Trigger a one-time grow animation
        if (originalData) {
          chartApi.updateValues([...originalData]);
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  const chartContainer = document.querySelector('.pin-section');
  if (chartContainer) {
    observer.observe(chartContainer);
  }
  
  return observer;
}

/**
 * Enable ScrollTrigger scrubbing
 * @param {Object} chartApi - ECharts chart API
 * @param {Object} data - Chart data
 * @param {Object} options - ScrollTrigger configuration
 */
export function enableScrollTrigger(chartApi, data, options = {}) {
  const defaultOptions = {
    trigger: '.pin-section',
    start: 'top top',
    end: '+=1000',
    scrub: 1,
    pin: true,
    ...options
  };
  
  return initScrollTrigger(chartApi, data, defaultOptions);
}

/**
 * Disable ScrollTrigger scrubbing
 * @param {Object} chartApi - ECharts chart API
 */
export function disableScrollTrigger(chartApi) {
  // Restore original data if it exists
  if (originalData) {
    chartApi.updateValues([...originalData]);
  }
  
  // Kill any existing ScrollTrigger instances
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.trigger === document.querySelector('.pin-section')) {
        trigger.kill();
      }
    });
  }
}

/**
 * Check if ScrollTrigger is available
 * @returns {boolean} True if GSAP and ScrollTrigger are loaded
 */
export function isScrollTriggerAvailable() {
  return typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
}

/**
 * Toggle ScrollTrigger scrubbing
 * @param {Object} chartApi - ECharts chart API
 * @param {Object} data - Chart data
 * @param {boolean} enabled - Whether to enable scrubbing
 * @param {Object} options - ScrollTrigger options
 */
export function toggleScrollTrigger(chartApi, data, enabled, options = {}) {
  if (enabled) {
    return enableScrollTrigger(chartApi, data, options);
  } else {
    disableScrollTrigger(chartApi);
    return null;
  }
}
