/* =========================================================
   Anima — constellation
   Pure computation: builds the symbol/archetype graph from a
   dream series, lays it out, and derives readings from it.
   No DOM, no randomness — same series always yields the same map.
   ========================================================= */

window.MAP = (function () {

  const MIN_DREAMS = 3;   // below this, a "pattern" is just noise
  const MAX_NODES  = 18;  // beyond this the map stops being readable

  /* ---------- graph ---------- */

  /**
   * @param {Array} dreams
   * @param {Function} archName  id -> display name (language-bound)
   * @returns {{nodes:Array, links:Array, dreamCount:number}}
   */
  function build(dreams, archName) {
    const counts = new Map();   // key -> {key, kind, id, label, n, dreams:Set}
    const bump = (key, kind, id, label, dreamId) => {
      let e = counts.get(key);
      if (!e) { e = { key, kind, id, label, n: 0, dreams: new Set() }; counts.set(key, e); }
      e.n++; e.dreams.add(dreamId);
    };

    dreams.forEach(d => {
      (d.archetypes || []).forEach(id => {
        const label = archName(id);
        if (label) bump('a:' + id, 'arch', id, label, d.id);
      });
      (d.symbols || []).forEach(s => {
        const label = String(s).trim();
        if (label) bump('s:' + label.toLocaleLowerCase(), 'sym', label, label, d.id);
      });
    });

    let nodes = Array.from(counts.values())
      .sort((a, b) => b.n - a.n || a.label.localeCompare(b.label))
      .slice(0, MAX_NODES);

    const keep = new Set(nodes.map(n => n.key));

    // Co-occurrence: two nodes are linked when they appear in the same dream.
    const pairs = new Map();
    dreams.forEach(d => {
      const present = nodes.filter(n => n.dreams.has(d.id)).map(n => n.key);
      for (let i = 0; i < present.length; i++) {
        for (let j = i + 1; j < present.length; j++) {
          const k = present[i] < present[j] ? present[i] + '|' + present[j] : present[j] + '|' + present[i];
          pairs.set(k, (pairs.get(k) || 0) + 1);
        }
      }
    });

    const links = Array.from(pairs.entries())
      .map(([k, w]) => { const [a, b] = k.split('|'); return { source: a, target: b, w }; })
      .filter(l => keep.has(l.source) && keep.has(l.target))
      .sort((a, b) => b.w - a.w);

    const degree = new Map();
    links.forEach(l => {
      degree.set(l.source, (degree.get(l.source) || 0) + l.w);
      degree.set(l.target, (degree.get(l.target) || 0) + l.w);
    });
    nodes.forEach(n => { n.degree = degree.get(n.key) || 0; n.dreamIds = Array.from(n.dreams); delete n.dreams; });

    return { nodes, links, dreamCount: dreams.length };
  }

  /* ---------- layout ---------- */

  /**
   * Deterministic force-directed layout. Positions are written onto the
   * nodes as x/y inside a [0,w] x [0,h] box.
   */
  function layout(graph, w, h, iterations) {
    const { nodes, links } = graph;
    const n = nodes.length;
    if (!n) return graph;

    const index = new Map(nodes.map((d, i) => [d.key, i]));
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.34;

    // Seed on a circle — deterministic, and already free of overlaps.
    nodes.forEach((d, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      // Heavier nodes start nearer the centre; they belong there.
      const pull = 1 - Math.min(d.n, 6) / 12;
      d.x = cx + Math.cos(a) * R * pull;
      d.y = cy + Math.sin(a) * R * pull;
      d.vx = 0; d.vy = 0;
    });

    if (n === 1) { nodes[0].x = cx; nodes[0].y = cy; return graph; }

    const iters = iterations || 300;
    const kRep = R * R * 0.9;
    const maxW = links.length ? links[0].w : 1;

    for (let it = 0; it < iters; it++) {
      const t = 1 - it / iters;            // cooling
      const step = 0.9 * t + 0.05;

      // repulsion
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const a = nodes[i], b = nodes[j];
          let dx = a.x - b.x, dy = a.y - b.y;
          let d2 = dx * dx + dy * dy;
          if (d2 < 1) { dx = ((i % 7) - 3) || 1; dy = ((j % 5) - 2) || 1; d2 = dx * dx + dy * dy; }
          const f = kRep / d2;
          const d = Math.sqrt(d2);
          const fx = (dx / d) * f, fy = (dy / d) * f;
          a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
        }
      }

      // attraction along links
      links.forEach(l => {
        const a = nodes[index.get(l.source)], b = nodes[index.get(l.target)];
        if (!a || !b) return;
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const rest = R * 0.55;
        const f = (d - rest) * 0.055 * (0.45 + 0.55 * (l.w / maxW));
        const fx = (dx / d) * f, fy = (dy / d) * f;
        a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
      });

      // gravity toward centre keeps the map from drifting off-canvas
      nodes.forEach(d => { d.vx += (cx - d.x) * 0.020; d.vy += (cy - d.y) * 0.020; });

      // integrate
      nodes.forEach(d => {
        const sp = Math.hypot(d.vx, d.vy);
        const cap = R * 0.30;
        if (sp > cap) { d.vx = d.vx / sp * cap; d.vy = d.vy / sp * cap; }
        d.x += d.vx * step; d.y += d.vy * step;
        d.vx *= 0.82; d.vy *= 0.82;
      });
    }

    // Fit to box with a margin that accounts for node radius + label.
    const pad = 30;
    const xs = nodes.map(d => d.x), ys = nodes.map(d => d.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const sx = (maxX - minX) > 1 ? (w - pad * 2) / (maxX - minX) : 1;
    const sy = (maxY - minY) > 1 ? (h - pad * 2) / (maxY - minY) : 1;
    const s = Math.min(sx, sy, 1.6);
    nodes.forEach(d => {
      d.x = pad + (d.x - minX) * s + ((w - pad * 2) - (maxX - minX) * s) / 2;
      d.y = pad + (d.y - minY) * s + ((h - pad * 2) - (maxY - minY) * s) / 2;
      delete d.vx; delete d.vy;
    });

    return graph;
  }

  /* ---------- readings ---------- */

  /**
   * Derives observations from the series. Every item is phrased as a
   * hypothesis with a question — never a verdict. Rules only fire when
   * there is enough data to support them.
   *
   * @returns {{ready:boolean, need:number, items:Array<{key,title,text,ask}>}}
   */
  function analyze(dreams, graph, ctx) {
    const { L, moodById, archById } = ctx;
    const n = dreams.length;
    if (n < MIN_DREAMS) return { ready: false, need: MIN_DREAMS - n, items: [] };

    const items = [];
    const nodeByKey = new Map(graph.nodes.map(d => [d.key, d]));
    const pct = x => Math.round(x * 100);

    /* dominant archetype */
    const archNodes = graph.nodes.filter(d => d.kind === 'arch').sort((a, b) => b.n - a.n);
    if (archNodes.length) {
      const top = archNodes[0];
      const share = top.n / n;
      const second = archNodes[1];
      if (top.n >= 2 && share >= 0.34 && (!second || top.n > second.n)) {
        const a = archById(top.id);
        items.push({
          key: 'dominant', kind: 'arch', ref: top.id,
          title: ctx.s('anDominant', top.label, pct(share)),
          text: a ? L(a).body : '',
          ask: a ? L(a).ask : ''
        });
      }
    }

    /* strongest bond */
    const strong = graph.links.filter(l => l.w >= 2)[0];
    if (strong) {
      const a = nodeByKey.get(strong.source), b = nodeByKey.get(strong.target);
      if (a && b) items.push({
        key: 'bond', kind: 'pair', ref: [a, b],
        title: ctx.s('anBond', a.label, b.label, strong.w),
        text: ctx.s('anBondText'), ask: ctx.s('anBondAsk', a.label, b.label)
      });
    }

    /* hub — the image everything else is organised around */
    const hub = graph.nodes.slice().sort((a, b) => b.degree - a.degree)[0];
    if (hub && hub.degree >= 4 && graph.nodes.length >= 5) {
      items.push({
        key: 'hub', kind: hub.kind, ref: hub.id,
        title: ctx.s('anHub', hub.label),
        text: ctx.s('anHubText'), ask: ctx.s('anHubAsk', hub.label)
      });
    }

    /* solitary images */
    const lone = graph.nodes.filter(d => d.degree === 0 && d.n >= 2);
    if (lone.length) items.push({
      key: 'lone', kind: 'list', ref: lone.map(d => d.label),
      title: ctx.s('anLone', lone.map(d => d.label).join(', ')),
      text: ctx.s('anLoneText'), ask: ctx.s('anLoneAsk')
    });

    /* affective tone on waking */
    const vals = dreams.map(d => moodById(d.mood)).filter(Boolean).map(m => m.v);
    if (vals.length >= 3) {
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      const tone = avg <= -0.6 ? 'dark' : avg >= 0.6 ? 'light' : 'mixed';
      items.push({
        key: 'tone', kind: 'tone', ref: tone,
        title: ctx.s('anTone_' + tone),
        text: ctx.s('anToneText_' + tone), ask: ctx.s('anToneAsk')
      });
    }

    /* recurrence */
    const rec = dreams.filter(d => d.recurring).length;
    if (rec >= 2 && rec / n >= 0.3) items.push({
      key: 'recurring', kind: 'plain', ref: null,
      title: ctx.s('anRecurring', pct(rec / n)),
      text: ctx.s('anRecurringText'), ask: ctx.s('anRecurringAsk')
    });

    /* lucidity */
    const luc = dreams.filter(d => d.lucid).length;
    if (luc >= 2 && luc / n >= 0.25) items.push({
      key: 'lucid', kind: 'plain', ref: null,
      title: ctx.s('anLucid', pct(luc / n)),
      text: ctx.s('anLucidText'), ask: ctx.s('anLucidAsk')
    });

    /* an archetype conspicuously never named */
    if (n >= 6 && archNodes.length >= 2) {
      const named = new Set(archNodes.map(d => d.id));
      if (!named.has('shadow')) {
        const a = archById('shadow');
        items.push({
          key: 'noshadow', kind: 'arch', ref: 'shadow',
          title: ctx.s('anNoShadow'), text: ctx.s('anNoShadowText'),
          ask: a ? L(a).ask : ''
        });
      }
    }

    return { ready: true, need: 0, items };
  }

  return { build, layout, analyze, MIN_DREAMS, MAX_NODES };
})();
