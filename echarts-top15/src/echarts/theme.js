// theme.js
export const primaryColor = "#3B82F6"; // Tailwind blue-500
export const gridLineColor = "#e5e7eb";
export const textColor = "#111827";
export const fontFamily = 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji"';

export function comma(x){
  const n = Number(x ?? 0);
  return n.toLocaleString('en-US');
}

export function formatK(n){
  const v = Number(n ?? 0);
  if (v >= 1_000_000) return (v/1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1) + 'M';
  if (v >= 1_000) return (v/1_000).toFixed(v % 1_000 === 0 ? 0 : 1) + 'K';
  return String(v);
}

export function makeDensityRamp(values){
  if (!values || values.length === 0) return () => primaryColor;
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return () => primaryColor;
  // simple blue (low) -> red (high) ramp
  return (v)=>{
    const t = Math.max(0, Math.min(1, (v - min) / (max - min)));
    const r = Math.round(59 + (239-59)*t);   // from #3B82F6 (59,130,246) to #EF4444 (239,68,68)
    const g = Math.round(130 + (68-130)*t);
    const b = Math.round(246 + (68-246)*t);
    return `rgb(${r}, ${g}, ${b})`;
  }
}
