/* =========================================================
   Anima — globe
   An orthographic globe rendered to canvas: rotates, drags, glows.

   Deliberately free of app state so it stays testable and ports to the
   native build unchanged. It knows about geometry and pixels, nothing else.

   Projection (orthographic, the view from infinitely far away):
     λ' = λ + rotation,  φ' = φ
     cos(c) = cos(φ)·cos(φ₀)·cos(λ') + sin(φ)·sin(φ₀)
     visible when cos(c) > 0 — i.e. the near hemisphere
     x = R·cos(φ)·sin(λ')
     y = R·(cos(φ₀)·sin(φ) − sin(φ₀)·cos(φ)·cos(λ'))
   ========================================================= */

window.Globe = (function () {
  'use strict';

  const RAD = Math.PI / 180;

  function create(canvas, opts) {
    const o = Object.assign({
      rings: [],
      markers: [],            // [{ id, lon, lat, color, empty, label }]
      lon: -29,               // opens on İstanbul — the studio's own longitude
      lat: 24,
      autoSpin: 4,            // degrees per second
      reduced: false,
      onFrame: null,          // (positions) => void, for the HTML marker overlay
      colors: {}
    }, opts || {});

    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, R = 0, cx = 0, cy = 0, dpr = 1;
    let rotLon = o.lon, rotLat = o.lat;
    let vLon = 0, vLat = 0;               // drag inertia
    let dragging = false, lastX = 0, lastY = 0, lastT = 0, movedAt = 0;
    let raf = 0, running = false, prevT = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);   // 2 is plenty; 3 just burns fill-rate
      W = rect.width; H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2; cy = H / 2;
      R = Math.min(W, H) / 2 - 14;
    }

    /* --- projection --- */
    function project(lon, lat) {
      const l = (lon + rotLon) * RAD, p = lat * RAD, p0 = rotLat * RAD;
      const cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
      if (cosc <= 0) return null;                        // far hemisphere
      return [
        cx + R * Math.cos(p) * Math.sin(l),
        cy - R * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l)),
        cosc                                             // 1 at the centre, 0 at the limb
      ];
    }

    /* --- painting --- */
    function sphere() {
      const c = o.colors;
      // Atmosphere: a ring of light just outside the limb. This one gradient
      // does most of the work of making a disc read as a planet.
      const halo = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.28);
      halo.addColorStop(0, c.atmoIn);
      halo.addColorStop(1, c.atmoOut);
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.28, 0, 7); ctx.fill();

      // Body with limb darkening, lit from the upper left.
      const body = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.06, cx, cy, R);
      body.addColorStop(0, c.faceLit);
      body.addColorStop(0.62, c.face);
      body.addColorStop(1, c.faceEdge);
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
    }

    function graticule() {
      ctx.strokeStyle = o.colors.grid;
      ctx.lineWidth = 0.6;
      // Parallels every 30°, meridians every 30° — a real coordinate grid,
      // which is what makes it read as an instrument rather than decoration.
      for (let lat = -60; lat <= 60; lat += 30) arcPath(lat, null);
      for (let lon = -180; lon < 180; lon += 30) arcPath(null, lon);
    }

    function arcPath(fixedLat, fixedLon) {
      ctx.beginPath();
      let pen = false;
      for (let t = -180; t <= 180; t += 3) {
        const lon = fixedLon == null ? t : fixedLon;
        const lat = fixedLat == null ? t / 2 : fixedLat;
        if (fixedLon != null && (lat < -90 || lat > 90)) continue;
        const p = project(lon, lat);
        if (!p) { pen = false; continue; }
        if (!pen) { ctx.moveTo(p[0], p[1]); pen = true; } else ctx.lineTo(p[0], p[1]);
      }
      ctx.stroke();
    }

    function land() {
      const c = o.colors;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      // Two passes: a wide soft stroke for bloom, then a crisp one on top.
      for (let pass = 0; pass < 2; pass++) {
        ctx.beginPath();
        for (const ring of o.rings) {
          let pen = false;
          for (let i = 0; i < ring.length; i++) {
            const p = project(ring[i][0], ring[i][1]);
            if (!p) { pen = false; continue; }
            if (!pen) { ctx.moveTo(p[0], p[1]); pen = true; } else ctx.lineTo(p[0], p[1]);
          }
        }
        if (pass === 0) {
          ctx.strokeStyle = c.landGlow; ctx.lineWidth = 3.2;
          ctx.shadowColor = c.landGlow; ctx.shadowBlur = 10;
        } else {
          ctx.strokeStyle = c.land; ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    }

    /** Great-circle arc between two points, lifted off the surface. */
    function link(a, b) {
      const steps = 48;
      ctx.beginPath();
      let pen = false;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const lon = a[0] + (b[0] - a[0]) * t;
        const lat = a[1] + (b[1] - a[1]) * t;
        const p = project(lon, lat);
        if (!p) { pen = false; continue; }
        // Bow the arc outward at the midpoint so it reads as an arc over the sphere.
        const lift = 1 + Math.sin(t * Math.PI) * 0.09;
        const x = cx + (p[0] - cx) * lift, y = cy + (p[1] - cy) * lift;
        if (!pen) { ctx.moveTo(x, y); pen = true; } else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    function links() {
      const pts = o.markers.filter(m => !m.empty);
      if (pts.length < 2) return;
      ctx.strokeStyle = o.colors.arc;
      ctx.lineWidth = 1;
      ctx.shadowColor = o.colors.arc; ctx.shadowBlur = 6;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          link([pts[i].lon, pts[i].lat], [pts[j].lon, pts[j].lat]);
        }
      }
      ctx.shadowBlur = 0;
    }

    function markers() {
      const out = [];
      o.markers.forEach(m => {
        const p = project(m.lon, m.lat);
        if (!p) { out.push({ id: m.id, visible: false }); return; }
        const depth = p[2];                       // fades toward the limb
        ctx.globalAlpha = 0.35 + depth * 0.65;
        ctx.beginPath();
        ctx.arc(p[0], p[1], m.empty ? 5 : 6, 0, 7);
        ctx.fillStyle = m.empty ? 'transparent' : m.color;
        ctx.strokeStyle = m.color;
        ctx.lineWidth = m.empty ? 1.6 : 1.2;
        if (m.empty) { ctx.setLineDash([3, 2.4]); } else { ctx.fill(); }
        ctx.shadowColor = m.color; ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.setLineDash([]); ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        out.push({ id: m.id, visible: true, x: p[0], y: p[1], depth });
      });
      return out;
    }

    function draw() {
      if (!W) resize();
      if (!W) return;
      ctx.clearRect(0, 0, W, H);
      sphere();
      graticule();
      land();
      links();
      const pos = markers();
      if (o.onFrame) o.onFrame(pos);
    }

    /* --- loop --- */
    function tick(t) {
      if (!running) return;
      const dt = prevT ? Math.min((t - prevT) / 1000, 0.05) : 0.016;
      prevT = t;

      if (!dragging) {
        if (Math.abs(vLon) > 0.01 || Math.abs(vLat) > 0.01) {
          rotLon += vLon * dt; rotLat += vLat * dt;
          vLon *= 0.94; vLat *= 0.94;                       // inertia decay
        } else if (!o.reduced && t - movedAt > 1400) {
          rotLon += o.autoSpin * dt;                        // idle drift
        }
        rotLat = Math.max(-60, Math.min(60, rotLat));
      }
      draw();
      raf = requestAnimationFrame(tick);
    }

    function start() {
      if (running) return;
      running = true; prevT = 0;
      raf = requestAnimationFrame(tick);
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    /* --- drag --- */
    function down(e) {
      dragging = true; vLon = 0; vLat = 0;
      const p = point(e); lastX = p.x; lastY = p.y; lastT = performance.now();
      canvas.setPointerCapture && e.pointerId != null && canvas.setPointerCapture(e.pointerId);
    }
    function move(e) {
      if (!dragging) return;
      const p = point(e), now = performance.now();
      const dx = p.x - lastX, dy = p.y - lastY;
      const dt = Math.max((now - lastT) / 1000, 0.001);
      const k = 0.35;
      rotLon += dx * k;
      rotLat = Math.max(-60, Math.min(60, rotLat + dy * k));
      vLon = o.reduced ? 0 : (dx * k) / dt;
      vLat = o.reduced ? 0 : (dy * k) / dt;
      lastX = p.x; lastY = p.y; lastT = now; movedAt = now;
      e.preventDefault();
    }
    function up() { dragging = false; movedAt = performance.now(); }
    function point(e) {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move, { passive: false });
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('pointerleave', up);

    return {
      start, stop, resize, draw,
      spinTo(lon, lat) { rotLon = -lon; if (lat != null) rotLat = lat; },
      setColors(c) { o.colors = c; },
      destroy() {
        stop();
        canvas.removeEventListener('pointerdown', down);
        canvas.removeEventListener('pointermove', move);
        canvas.removeEventListener('pointerup', up);
        canvas.removeEventListener('pointercancel', up);
        canvas.removeEventListener('pointerleave', up);
      }
    };
  }

  return { create };
})();
