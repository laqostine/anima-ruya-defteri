/* Generates assets/js/worldmap.js — raw lon/lat rings for the runtime globe.
   Usage: node scripts/mkworld.js      (needs: npm i topojson-client d3-geo world-atlas)
   The globe projects these itself, so nothing here may be pre-projected. */
const topo = require('topojson-client');
const { geoCentroid } = require('d3-geo');
const world = require('./world-110m.json');

const land = topo.feature(world, world.objects.land);
const countries = topo.feature(world, world.objects.countries);

const geoms = land.type === 'FeatureCollection' ? land.features.map(f => f.geometry) : [land.geometry];
const rings = [];
geoms.forEach(g => {
  const polys = g.type === 'MultiPolygon' ? g.coordinates : [g.coordinates];
  polys.forEach(poly => {
    const outer = poly[0];
    const lats = outer.map(p => p[1]);
    if (Math.max(...lats) < -60) return;              // Antarctica carries no data here
    // Two reductions, both invisible at globe scale:
    //  - quantise to 0.1 degree (~11 km)
    //  - drop points closer than MIN_STEP degrees to the last kept one,
    //    keeping the ring's extremes so coastlines don't lose their shape.
    const MIN_STEP = 0.9;
    const q = [];
    let last = null;
    outer.forEach(([lon, lat], i) => {
      const a = Math.round(lon * 10) / 10, b = Math.round(lat * 10) / 10;
      if (last) {
        const dx = a - last[0], dy = b - last[1];
        const isLast = i === outer.length - 1;
        if (!isLast && (dx * dx + dy * dy) < MIN_STEP * MIN_STEP) return;
      }
      q.push([a, b]); last = [a, b];
    });
    if (q.length >= 8) rings.push(q);
  });
});

const WANT = { 124: 'CA', 276: 'DE', 156: 'CN', 392: 'JP', 840: 'US', 792: 'TR' };
const at = {};
countries.features.forEach(f => {
  const iso = WANT[+f.id];
  if (!iso) return;
  const c = geoCentroid(f);
  at[iso] = [Math.round(c[0] * 10) / 10, Math.round(c[1] * 10) / 10];
});
at.HK = [114.2, 22.3];   // not a feature at 110m — the city's own coordinates

const out = `/* GENERATED — do not hand-edit. Run scripts/mkworld.js instead.
   Source: world-atlas@2 countries-110m (Natural Earth, public domain).
   Raw [lon, lat] rings, quantised to 0.1 degree. Antarctica removed.
   The globe projects these at runtime, so they must stay unprojected. */
window.WORLD = {
  rings: ${JSON.stringify(rings)},
  at: ${JSON.stringify(at)}
};
`;
require('fs').writeFileSync('/Users/bera/Documents/GitHub/placenta/assets/js/worldmap.js', out);
const pts = rings.reduce((a, r) => a + r.length, 0);
console.log('rings:', rings.length, '| points:', pts, '| bytes:', out.length);
