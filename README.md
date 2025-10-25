# Colorado Cities Bar Chart - Multi-Implementation Project

This repository contains multiple implementations of an interactive bar chart visualization for Colorado's top 15 cities by population, each using different charting libraries and approaches.

## Project Structure

```
echarts-bar-chart-poc/
├── data/                           # Shared data source
│   └── colorado-cities-enriched.geojson
├── specs/                          # Shared project specifications
│   ├── scrolltrigger-animation.spec.yml
│   ├── scrolltrigger-build.yml
│   └── speckit.build.yml
├── reference/                      # Chart.js reference implementation
│   └── chartjs-bar-chart-poc/
└── echarts-top15/                  # Apache ECharts implementation
    ├── docs/                       # Complete documentation
    └── src/                        # Source code
```

## Implementations

### 1. Chart.js Implementation (Reference)
- **Location**: `reference/chartjs-bar-chart-poc/`
- **Library**: Chart.js
- **Features**: ScrollTrigger animations, mobile responsive
- **Status**: Complete reference implementation

### 2. Apache ECharts Implementation
- **Location**: `echarts-top15/`
- **Library**: Apache ECharts
- **Features**: ScrollTrigger animations, mobile responsive, 45° rotated labels
- **Status**: Complete implementation

## Shared Resources

### Data Source
- **File**: `data/colorado-cities-enriched.geojson`
- **Content**: Top 15 Colorado cities with population and density data
- **Format**: GeoJSON with properties: `GEOID`, `NAME`, `pop`, `density`

### Specifications
- **Location**: `specs/`
- **Content**: Project requirements, build specifications, animation specs
- **Usage**: Shared across all implementations

## Quick Start

### ECharts Implementation
```bash
cd echarts-top15
npm install
npm run dev
```

### Chart.js Implementation (Reference)
```bash
cd reference/chartjs-bar-chart-poc
npm install
npm run dev
```

## Features

Both implementations include:
- **Interactive Bar Chart**: Top 15 Colorado cities by population
- **ScrollTrigger Animation**: Smooth scroll-driven bar growth
- **Mobile Responsive**: Horizontal scrolling on mobile devices
- **Selection System**: Click to toggle city selection
- **Density Visualization**: Color ramp based on population density

## Documentation

- **ECharts**: See `docs/echarts/` for complete ECharts documentation
- **Chart.js**: See `docs/chartjs/` for Chart.js reference documentation
- **Specifications**: See `specs/` for project requirements and build specifications

## Development

Each implementation is self-contained with its own:
- Package dependencies
- Build configuration
- Development server
- Documentation

## License

MIT License - see individual project directories for details.
