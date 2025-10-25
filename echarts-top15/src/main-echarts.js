// main-echarts.js
import { createTop15Chart } from "./echarts/buildChart.js";
import { enableScrollTrigger, disableScrollTrigger, toggleScrollTrigger, isScrollTriggerAvailable } from './scroll/scrolltrigger-echarts.js';

/**
 * Main application entry point
 */
class ColoradoCitiesChart {
  constructor() {
    this.chart = null;
    this.data = null;
    this.scrollTrigger = null;
    this.init();
  }

  async init() {
    try {
      // Load and transform data
      await this.loadData();
      
      // Check if ScrollTrigger is enabled and wait for it to load
      const isScrollTriggerEnabled = document.body.classList.contains('scrolltrigger-enabled') || 
                                    window.location.search.includes('scrolltrigger=true');
      
      if (isScrollTriggerEnabled) {
        console.log('ScrollTrigger enabled - waiting for GSAP/ScrollTrigger to load...');
        await this.waitForScrollTrigger();
      }
      
      // Create chart
      this.createChart();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Initialize ScrollTrigger if enabled
      this.initScrollTrigger();
      
      console.log('Colorado Cities Chart initialized successfully');
    } catch (error) {
      console.error('Failed to initialize chart:', error);
      this.showError('Failed to load chart data. Please refresh the page.');
    }
  }

  async loadData() {
    try {
      const response = await fetch('/data/colorado-cities-enriched.geojson');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const geojson = await response.json();
      this.data = this.transformData(geojson);
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
      // Fallback to mock data for development
      this.data = this.getMockData();
    }
  }

  transformData(geojson) {
    // Extract features and transform to chart data
    const features = geojson.features || [];
    const rows = features.map(feature => {
      const props = feature.properties;
      return {
        geoid: props.GEOID,
        name: props.NAME,
        pop: props.pop,
        density: props.density || null
      };
    });

    // Sort by population descending and take top 15
    const sorted = rows
      .sort((a, b) => b.pop - a.pop)
      .slice(0, 15);

    // Extract arrays for chart
    const labels = sorted.map(row => row.name);
    const values = sorted.map(row => row.pop);
    const densities = sorted.map(row => row.density);
    const geoids = sorted.map(row => row.geoid);

    return {
      labels,
      values,
      densities,
      geoids,
      rows: sorted
    };
  }

  getMockData() {
    // Mock data for development/testing
    const mockRows = [
      { geoid: '08031', name: 'Denver', pop: 715522, density: 4689.2 },
      { geoid: '08035', name: 'Colorado Springs', pop: 478961, density: 2356.8 },
      { geoid: '08069', name: 'Aurora', pop: 386261, density: 1892.3 },
      { geoid: '08013', name: 'Boulder', pop: 108250, density: 3987.1 },
      { geoid: '08014', name: 'Broomfield', pop: 74112, density: 1235.2 },
      { geoid: '08041', name: 'Fort Collins', pop: 169810, density: 2847.6 },
      { geoid: '08001', name: 'Arvada', pop: 124402, density: 2156.8 },
      { geoid: '08077', name: 'Lakewood', pop: 155984, density: 3124.7 },
      { geoid: '08053', name: 'Thornton', pop: 141867, density: 2847.3 },
      { geoid: '08015', name: 'Westminster', pop: 116317, density: 2896.4 },
      { geoid: '08019', name: 'Centennial', pop: 108418, density: 2847.6 },
      { geoid: '08025', name: 'Greeley', pop: 108795, density: 2156.8 },
      { geoid: '08039', name: 'Grand Junction', pop: 65158, density: 1235.2 },
      { geoid: '08045', name: 'Loveland', pop: 76001, density: 1892.3 },
      { geoid: '08051', name: 'Pueblo', pop: 111876, density: 2156.8 }
    ];

    return {
      labels: mockRows.map(row => row.name),
      values: mockRows.map(row => row.pop),
      densities: mockRows.map(row => row.density),
      geoids: mockRows.map(row => row.geoid),
      rows: mockRows
    };
  }

  createChart() {
    const el = document.getElementById('echarts-container');
    if (!el) {
      throw new Error('Chart container element not found');
    }

    this.chart = createTop15Chart(el, this.data);
  }

  setupEventListeners() {
    // Chart selection events
    window.addEventListener('chart:selection', (event) => {
      const { geoids } = event.detail;
      console.log('Selected cities:', geoids);
    });
  }

  showError(message) {
    const container = document.querySelector('.chart-container');
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #dc3545;">
          <h3>Error</h3>
          <p>${message}</p>
          <button onclick="location.reload()" class="btn">Retry</button>
        </div>
      `;
    }
  }

  /**
   * Wait for ScrollTrigger to be available
   */
  async waitForScrollTrigger() {
    return new Promise((resolve) => {
      const checkScrollTrigger = () => {
        if (isScrollTriggerAvailable()) {
          console.log('ScrollTrigger is now available');
          resolve();
        } else {
          console.log('Waiting for ScrollTrigger...');
          setTimeout(checkScrollTrigger, 100);
        }
      };
      checkScrollTrigger();
    });
  }

  /**
   * Initialize ScrollTrigger if enabled
   */
  initScrollTrigger() {
    // Check if ScrollTrigger should be enabled
    const isEnabled = document.body.classList.contains('scrolltrigger-enabled') || 
                     window.location.search.includes('scrolltrigger=true');
    
    if (isEnabled && this.chart) {
      // ScrollTrigger should already be available since we waited for it
      if (isScrollTriggerAvailable()) {
        // Add a small delay to ensure chart is fully rendered
        setTimeout(() => {
          this.scrollTrigger = enableScrollTrigger(this.chart, this.data, {
            trigger: '.pin-section',
            start: 'top top', // Start when chart top hits viewport top
            end: '+=1000', // Total scroll distance (bars animate in first 60%, hold remaining 40%)
            scrub: 1,
            pin: true, // Pin the chart during animation
            markers: false // Set to true for debugging
          });
          console.log('ScrollTrigger enabled for chart with pinning');
        }, 100);
      } else {
        console.warn('ScrollTrigger not available despite waiting');
      }
    }
  }

  /**
   * Toggle ScrollTrigger scrubbing
   * @param {boolean} enabled - Whether to enable scrubbing
   */
  toggleScrollTriggerScrubbing(enabled) {
    if (!this.chart) return;
    
    if (enabled) {
      this.scrollTrigger = enableScrollTrigger(this.chart, this.data);
      console.log('ScrollTrigger scrubbing enabled');
    } else {
      disableScrollTrigger(this.chart);
      this.scrollTrigger = null;
      console.log('ScrollTrigger scrubbing disabled');
    }
  }
}

// Initialize the application when DOM is loaded
let chartApp = null;

document.addEventListener('DOMContentLoaded', () => {
  chartApp = new ColoradoCitiesChart();
});

// Global functions for ScrollTrigger control
window.toggleScrollTrigger = (enabled) => {
  if (chartApp) {
    chartApp.toggleScrollTriggerScrubbing(enabled);
  }
};

window.enableScrollTrigger = () => {
  if (chartApp) {
    chartApp.toggleScrollTriggerScrubbing(true);
  }
};

window.disableScrollTrigger = () => {
  if (chartApp) {
    chartApp.toggleScrollTriggerScrubbing(false);
  }
};

window.isScrollTriggerAvailable = isScrollTriggerAvailable;
