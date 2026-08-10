const topo = require('topojson-client');
const { geoPath, geoNaturalEarth1 } = require('d3-geo');
const world = require('./world-110m.json');

const W = 800, H = 400;
const land = topo.feature(world, world.objects.land);
const countries = topo.feature(world, world.objects.countries);

// Antarctica carries no data here and eats a fifth of the canvas — drop it
// before projecting so the fit uses the inhabited world.
const keep = poly => Math.max(...poly[0].map(pt => pt[1])) > -60;
const geoms = land.type === 'FeatureCollection' ? land.features.map(f => f.geometry) : [land.geometry];
geoms.forEach(g => {
  if (g.type === 'MultiPolygon') g.coordinates = g.coordinates.filter(keep);
  else if (g.type === 'Polygon' && !keep(g.coordinates)) g.coordinates = [];
});

const proj = geoNaturalEarth1().fitExtent([[4, 4], [W - 4, H - 4]], land);
const path = geoPath(proj);

// The map is scenery behind the data — whole-pixel coordinates are plenty
// at phone size and roughly halve the payload.
const round = d => d.replace(/-?\d+\.?\d*/g, n => Math.round(parseFloat(n)).toString())
                    .replace(/([ML])(-?\d+),(-?\d+)(?=[ML]|Z|$)/g, '$1$2,$3');

// One combined land path — the base map is scenery, not data.
const landPath = round(path(land));

// Centroids for the countries that carry data, so markers sit on real geography.
const WANT = {
  124: 'CA', 276: 'DE', 156: 'CN', 392: 'JP', 840: 'US', 792: 'TR',
  826: 'GB', 250: 'FR', 356: 'IN', 76: 'BR'
};
const centroids = {};
countries.features.forEach(f => {
  const iso = WANT[+f.id];
  if (!iso) return;
  const c = path.centroid(f);
  if (c && isFinite(c[0])) centroids[iso] = [Math.round(c[0] * 10) / 10, Math.round(c[1] * 10) / 10];
});
// Hong Kong is not a feature at 110m resolution — project the point directly.
const hk = proj([114.17, 22.32]);
centroids.HK = [Math.round(hk[0] * 10) / 10, Math.round(hk[1] * 10) / 10];

// A graticule-free, low-noise version: drop the tiniest islands so the
// silhouette stays clean at phone size.
const parts = landPath.split('M').filter(Boolean)
  .map(p => 'M' + p)
  .filter(p => p.length > 90);

const out = `/* Generated from world-atlas@2 countries-110m (Natural Earth, public domain)
   Projection: Natural Earth I, fitted to a ${W}x${H} viewBox.
   Built with: scripts/mkworld.js — regenerate rather than hand-edit. */
window.WORLD = {
  w: ${W}, h: ${H},
  land: ${JSON.stringify(parts.join(''))},
  at: ${JSON.stringify(centroids)}
};
`;
require('fs').writeFileSync('/Users/bera/Documents/GitHub/placenta/assets/js/worldmap.js', out);
console.log('land path chars:', parts.join('').length, '| subpaths:', parts.length);
console.log('centroids:', JSON.stringify(centroids));
