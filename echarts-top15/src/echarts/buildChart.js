// buildChart.js
import * as echarts from "echarts";
import { primaryColor, gridLineColor, textColor, fontFamily, formatK, comma, makeDensityRamp } from "./theme.js";

export function createTop15Chart(el, { labels, values, densities = [], geoids = [] } = {}){
  const chart = echarts.init(el, null, { renderer: 'canvas' });

  const hasDensity = Array.isArray(densities) && densities.length === values.length;
  const colorFor = hasDensity ? makeDensityRamp(densities) : () => primaryColor;

  const maxVal = Math.max(...values);
  const axisMax = Math.ceil(maxVal * 1.1);

  const selected = new Set();

  function updateSelectionPayload(){
    const chosen = [];
    for (let i=0;i<labels.length;i++){
      if (selected.has(i)) chosen.push(geoids[i]);
    }
    const ev = new CustomEvent('chart:selection', { detail: { geoids: chosen }});
    window.dispatchEvent(ev);
  }

  const option = {
    backgroundColor: '#fff',
    animation: true,
    animationDuration: 900,
    animationEasing: 'quartOut',
    grid: { left: 80, right: 24, top: 24, bottom: 60, containLabel: true },
    textStyle: { color: textColor, fontFamily },
    tooltip: {
      trigger: 'axis', axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const p = params[0];
        const idx = p.dataIndex;
        const parts = [`${p.name}: ${comma(p.value)}`];
        if (hasDensity) parts.push(`density: ${comma(densities[idx])}`);
        return parts.join('<br/>');
      }
    },
    // Vertical bars: categories on x-axis, values on y-axis
    xAxis: {
      type: 'category', data: labels,
      axisLabel: { 
        interval: 0,
        rotate: 45,
        margin: 12
      }
    },
    yAxis: {
      type: 'value', min: 0, max: axisMax,
      axisLabel: { formatter: (val)=> formatK(val) },
      splitLine: { show: true, lineStyle: { color: gridLineColor } }
    },
    series: [{
      type: 'bar', data: values,
      itemStyle: {
        color: (p)=> colorFor(hasDensity ? densities[p.dataIndex] : values[p.dataIndex]),
        opacity: 1
      },
      emphasis: { focus: 'series' },
      universalTransition: true,
      animationDuration: 900,
      animationEasing: 'quartOut'
    }]
  };

  chart.setOption(option);

  chart.on('click', (params)=>{
    const idx = params.dataIndex;
    if (selected.has(idx)) selected.delete(idx); else selected.add(idx);
    const dimColor = '#d1d5db';
    chart.setOption({
      series: [{
        itemStyle: {
          color: (p)=> selected.size === 0 || selected.has(p.dataIndex)
            ? colorFor(hasDensity ? densities[p.dataIndex] : values[p.dataIndex])
            : dimColor
        }
      }]
    });
    updateSelectionPayload();
  });

  function updateValues(newValues, disableAnimation = false){
    if (disableAnimation) {
      // Disable animations for smooth scrubbing - use most efficient update method
      chart.setOption({ 
        series: [{ 
          data: newValues,
          animation: false,
          animationDuration: 0,
          animationEasing: 'linear'
        }] 
      }, { 
        notMerge: false, 
        lazyUpdate: true,
        silent: true // Prevent any event triggers during scrubbing
      });
    } else {
      chart.setOption({ yAxis: { max: axisMax }, series: [{ data: newValues }] });
    }
  }

  function resize(){ chart.resize(); }
  window.addEventListener('resize', resize);

  return { chart, updateValues, axisMax, destroy(){ window.removeEventListener('resize', resize); chart.dispose(); } };
}
