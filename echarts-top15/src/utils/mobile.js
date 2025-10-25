/**
 * Mobile scroll and animation configuration utilities
 */

/**
 * Check if device is mobile
 * @returns {boolean} True if mobile device
 */
export function isMobile() {
  return window.innerWidth <= 480;
}

/**
 * Toggle mobile scroll functionality
 * @param {boolean} enabled - Whether to enable mobile scroll
 */
export function toggleMobileScroll(enabled) {
  const container = document.querySelector('.chart-container');
  if (!container) return;
  
  if (enabled) {
    container.classList.remove('no-horizontal-mobile-scroll');
  } else {
    container.classList.add('no-horizontal-mobile-scroll');
  }
  
  // Update scroll indicator visibility
  updateScrollIndicator();
}

/**
 * Update scroll indicator visibility
 */
export function updateScrollIndicator() {
  const container = document.querySelector('.chart-container');
  const indicator = document.querySelector('.scroll-indicator');
  
  if (!container || !indicator) {
    console.log('Container or indicator not found');
    return;
  }
  
  // Only show indicator on mobile devices with mobile scroll enabled
  const isMobileDevice = isMobile();
  const isDisabled = container.classList.contains('no-horizontal-mobile-scroll');
  
  console.log('Scroll indicator debug:', {
    isMobileDevice,
    isDisabled,
    containerClasses: container.className
  });
  
  // Hide indicator if:
  // - Not on mobile device
  // - Mobile scroll is disabled
  if (!isMobileDevice || isDisabled) {
    indicator.classList.add('hidden');
    console.log('Hiding scroll indicator');
    return;
  }
  
  // Check if content is scrollable
  const isScrollable = container.scrollWidth > container.clientWidth;
  
  if (isScrollable) {
    indicator.classList.remove('hidden');
    console.log('Showing scroll indicator');
  } else {
    indicator.classList.add('hidden');
    console.log('Hiding scroll indicator - not scrollable');
  }
}

/**
 * Initialize mobile features
 */
export function initMobileFeatures() {
  // Immediately hide scroll indicator on initialization
  updateScrollIndicator();
  
  // Mobile scroll is enabled by default on mobile devices
  // Only disable if explicitly requested
  
  // Listen for scroll events to update indicator
  const container = document.querySelector('.chart-container');
  if (container) {
    container.addEventListener('scroll', () => {
      updateScrollIndicator();
    });
  }
  
  // Listen for resize events
  window.addEventListener('resize', () => {
    updateScrollIndicator();
  });
}

/**
 * Check if mobile scroll is disabled via CSS class
 * @returns {boolean} True if mobile scroll is disabled
 */
export function isMobileScrollDisabled() {
  const container = document.querySelector('.chart-container');
  return container && container.classList.contains('no-horizontal-mobile-scroll');
}
