# Anima — Rüya Defteri

A Jungian dream notebook for **[Jungian Studies İstanbul](https://jungianstudiesistanbul.com)**.
Mobile-first web app, opened by QR code. No install, no account, no server.

**Live:** https://anima-ruya-defteri.vercel.app (primary) · https://laqostine.github.io/anima-ruya-defteri/ (mirror)
**QR card:** [`qr/anima-qr-kart-A6.pdf`](qr/anima-qr-kart-A6.pdf) (print-ready A6)

---

## What it does

| Screen | Purpose |
|---|---|
| **Rüyalar** | The notebook — dated entries, search across text, symbols and archetypes |
| **Yeni** | Five-step capture: the dream → waking feeling → archetypes → symbols → amplification |
| **Semboller** | Lexicon of 12 archetypes + 36 dream symbols, each with a Jungian reading and a question to sit with. Shows how often each appears in *your* dreams |
| **Desenler › Özet** | Stat tiles + frequency charts — what recurs across the series |
| **Desenler › Harita** | Constellation map of symbols and archetypes, plus a general reading derived from it |
| **Rehber** | Short method: record → context → amplify → wait. Includes the compensation principle and an explicit clinical limit |

**Capture is staged on purpose.** The dream text comes first, alone, with nothing else on screen — that is the part that decays within minutes of waking. Tagging and reflection are asked for only after the record is safe.

## Design decisions worth knowing

- **Night theme is the default.** People write in this app at 4am in a dark bedroom. The light theme is a faithful match to the studio's cream/ink brand and is used when the system asks for it, or on demand.
- **Turkish first, English available.** Full string parity; the lexicon is bilingual.
- **Local-only storage.** Entries live in `localStorage` — dream material is intimate, and nothing here is worth the liability of a server. JSON export/import covers backup and device migration. This is stated plainly in-app.
- **Works offline.** A service worker caches the shell and fonts, so the notebook opens with no signal.
- **Charts are single-hue horizontal bars, direct-labeled**, never color-as-meaning. The mark palette passes CVD separation and ≥3:1 against both surfaces.
- **Content is framed as interpretive, never diagnostic** — the guide names the limit and points to working with an analyst.


## The map and the reading

`Desenler › Harita` draws every tagged symbol and archetype as a node; two nodes are joined when they appear in the same dream, and the line thickens with how often. Layout is a deterministic force simulation — the same series always produces the same map, so it is stable to return to. Archetypes are circles, symbols are diamonds: the kind reads without relying on hue. Labels are placed greedily and skipped on collision; every node names itself on tap and opens its lexicon entry.

Below it, **Genel okuma** derives observations from the graph — a dominant archetype, the strongest bond, the hub, images standing alone, affective tone, recurrence and lucidity rates. Three rules govern it:

1. **Nothing fires below three dreams.** The section says how many more are needed and stays shut.
2. **A tie is not dominance.** If two archetypes lead equally, no dominance claim is made.
3. **Every item ends in a question, never a verdict.** The app observes; the dreamer interprets.

A `dtable` of the strongest bonds sits underneath as the accessible, non-visual reading of the same data.


## Collective norms — where the numbers come from

`Desenler › Harita` has two layers. **Sen** is your own co-occurrence graph. **Kolektif** is the typical dream landscape drawn from published prevalence data:

> Nielsen, T. A., Zadra, A. L., Simard, V., Saucier, S., Stenstrom, P., Smith, C., & Kuiken, D. (2003). *The Typical Dreams of Canadian University Students.* Dreaming, 13(4), 211–235. n = 1181, Typical Dreams Questionnaire, 55 items.

All 55 themes and their prevalences live in `assets/js/norms.js`, transcribed from the paper's Table 2, with each theme mapped onto Anima's own lexicon where a defensible mapping exists. The collective layer means an empty notebook still opens onto something true rather than a blank canvas, and each of your symbols carries its population prevalence in the lexicon sheet.

**The app states the caveat wherever the numbers appear**: `p` is *lifetime* prevalence — the share of people who report ever having had that dream, not the share of dreams — and the sample is Canadian undergraduates, not Turkish adults. A reading only calls a theme "standing out" when your rate runs ≥1.6× the norm on at least two occurrences.


## Dream atlas — the world map layer

`Desenler › Harita` has three layers: **Sen** (your own graph), **Kolektif** (typical-dream prevalence as a constellation), **Dünya** (a real world map of where that data exists).

The Dünya layer is a **rotating orthographic globe** — real 3D, not a CSS trick. `assets/js/globe.js` projects raw lon/lat at runtime (`cos c > 0` culls the far hemisphere), so countries genuinely disappear around the limb and come back. It drags with inertia, drifts slowly when idle, and **opens centred on İstanbul** — the studio's own longitude.

Rendering is a deliberate hybrid: **canvas** paints the sphere, graticule, glowing coastlines and great-circle arcs (`shadowBlur` gives cheap bloom that SVG filters cannot match when animated), while the country markers stay **real HTML buttons** repositioned every frame. That keeps focus rings, `aria-label`s and 44px hit areas that a canvas could never provide — and they hide themselves when their point rotates out of view.

Geometry is generated, not hand-drawn: `scripts/mkworld.js` pulls Natural Earth 110m, drops Antarctica, quantises to 0.1° and decimates to ~2,350 points, emitting `assets/js/worldmap.js` (~10 KB gzipped, zero runtime dependencies). Regenerate rather than hand-edit.

**The neon is confined to the observatory.** Rüyalar, Yeni and Rehber stay papery, serif and quiet. The map is the one screen where the app looks outward at the collective, so it is the one screen that looks like an instrument — and that contrast is what gives it charge. In light mode the globe stays a night object resting on a cream page rather than inverting into something garish.

Motion respects `prefers-reduced-motion` completely: no auto-rotation, no inertia, no pulse — static but still draggable. The render loop is gated by an `IntersectionObserver` and torn down on navigation, so it never burns frames off-screen.

Markers sit on real projected centroids and are graded by how much a study actually documents:

| Layer | Country | Study |
|---|---|---|
| Full table | Canada | Nielsen et al. (2003), n = 1181, all 55 themes |
| Partial | Germany | Schredl, Ciric, Götz & Wittmann (2004), top 10 |
| Partial | Hong Kong / China | Yu (2008), top 5 |
| Historic | Japan, United States | Griffith, Miyagi & Tago (1958), n = 473, 34 themes |
| **No data** | **Turkey** | **none exists** |

**Turkey is deliberately empty and says so.** There is no published lifetime-prevalence study on a Turkish sample; Turkish dream research uses different instruments (e.g. the Dream Themes Scale) whose scores are not comparable. Rather than interpolate a plausible-looking number, the map marks the gap in the brand's accent colour, labels it, and names it as a research opportunity for the studio. The same rule governs the whole file: nothing is estimated, interpolated, or filled in.

Below the map, a picker compares any theme measured in two or more countries on one shared 0–100 axis — the payoff a world map actually earns.

## Sample notebook

Settings → **Örnek defter** loads ten example dreams written to exercise the most prevalent themes, for trying the app or demonstrating it on a table. They are honestly marked, not disguised as records:

- every entry carries `demo: true` and shows an "Örnek" badge
- a standing notice sits above the dream list while any are loaded
- one tap removes exactly the samples; real entries are matched by the same flag and never touched
- **backups exclude them** — an export contains only real entries

## Accessibility

Verified on the live build: contrast on the night theme is 17.0 : 1 (body), 9.1 : 1 (secondary), 4.7 : 1 (muted) — all above WCAG AA. Every control is ≥44px, focus rings are visible, the sheet traps focus and restores it on close, toasts announce via `aria-live`, and `prefers-reduced-motion` disables all animation. No horizontal scroll at 320px.

## Structure

```
index.html              markup shell + tab bar + sheet/toast roots
assets/css/style.css    tokens (both themes) and every component
assets/js/lexicon.js    archetypes, symbols, moods, amplification prompts (tr/en)
assets/js/i18n.js       UI strings + long-form guide content
assets/js/constellation.js  graph build, force layout, reading rules (pure, no DOM)
assets/js/norms.js      Nielsen et al. (2003) prevalence table + comparison
assets/js/sample.js     the ten sample dreams (tr/en)
assets/js/atlas.js      per-country studies (and Turkey's documented absence)
assets/js/worldmap.js   GENERATED lon/lat rings — see scripts/mkworld.js
assets/js/globe.js      orthographic globe: projection, render, drag (no app state)
assets/js/app.js        store, hash router, views, capture flow
sw.js                   offline shell
qr/                     QR code + printable A6 card
```

No build step, no dependencies. Edit and reload.

## Deploying

```bash
vercel deploy --prod --yes    # primary host
git push origin main          # GitHub Pages mirror redeploys automatically
```

A Cloudflare Pages project (`anima-ruya-defteri`) also exists as a mirror:

```bash
wrangler pages deploy . --project-name=anima-ruya-defteri
```

> **Note:** `*.pages.dev` is DNS-blocked on Turkish ISPs and is unreachable for the actual audience. The Cloudflare deploy is only useful once a custom domain is attached. GitHub Pages is the working host today.

### Moving to the studio's own domain (recommended)

Point a subdomain at the site — e.g. `ruya.jungianstudiesistanbul.com` — then regenerate the QR so the printed card carries the branded URL:

```bash
node scripts/mkqr.js https://ruya.jungianstudiesistanbul.com/
```

The card, SVG, PNG and print PDF are all rebuilt from that one argument.

## Next step: native app

The web build is deliberately the same information architecture a React Native / Expo port would use — five tabs, the same capture stages, the same lexicon module. `assets/js/lexicon.js` and `assets/js/i18n.js` are plain data and port across unchanged.

---

Content draws on Jung's *Collected Works* (esp. CW 8, CW 9i, CW 12) and standard analytical-psychology teaching material. It is reflective material, not diagnosis or treatment.
