/* =========================================================
   Anima — collective norms
   Lifetime prevalence of typical dream themes.

   SOURCE
   Nielsen, T. A., Zadra, A. L., Simard, V., Saucier, S., Stenstrom, P.,
   Smith, C., & Kuiken, D. (2003). "The Typical Dreams of Canadian
   University Students." Dreaming, 13(4), 211–235.
   n = 1181 (28.9% men, 71.1% women), mean age 19.8.
   Instrument: Typical Dreams Questionnaire, 55 items.
   https://dreamscience.ca/en/documents/publications/_2003_Nielsen_Reprint_D_13_211-235_TDQ.pdf

   READ THIS BEFORE USING THE NUMBERS
   `p` is *lifetime* prevalence — the share of people who report ever
   having had that dream. It is NOT the share of dreams containing the
   theme, and the sample is Canadian undergraduates, not Turkish adults.
   So these figures anchor "which themes are common in general"; they do
   not predict any individual's notebook. The UI must say so.

   `maps` links a theme to Anima's own lexicon: symbol names (as they
   appear in lexicon.js, by language) and/or archetype ids. Themes with
   no defensible mapping are still listed — they populate the collective
   map on their own.
   ========================================================= */

window.NORMS = (function () {

  const CITATION = {
    tr: 'Nielsen ve ark. (2003), Dreaming 13(4) — 1181 üniversite öğrencisi, Tipik Rüyalar Anketi.',
    en: 'Nielsen et al. (2003), Dreaming 13(4) — 1181 university students, Typical Dreams Questionnaire.'
  };

  /* rank, p (% total), men, women, tr label, en label, mapped symbols (tr), archetype ids */
  const T = [
    [ 1, 81.5, 77.7, 83.1, 'Kovalanmak',                    'Being chased',                 ['Kovalanmak'],            ['shadow']],
    [ 2, 76.5, 85.0, 73.0, 'Cinsel deneyim',                'Sexual experiences',           [],                        ['anima', 'animus']],
    [ 3, 73.8, 73.0, 74.0, 'Düşmek',                        'Falling',                      ['Düşmek'],                []],
    [ 4, 67.1, 56.9, 71.3, 'Okul, öğretmen, ders',          'School, teachers, studying',   ['Sınav'],                 ['persona']],
    [ 5, 59.5, 54.5, 61.5, 'Geç kalmak',                    'Arriving too late',            [],                        ['persona']],
    [ 6, 57.7, 53.4, 59.5, 'Düşmenin eşiğinde olmak',       'On the verge of falling',      ['Düşmek'],                []],
    [ 7, 53.5, 54.5, 53.1, 'Tekrar tekrar denemek',         'Trying again and again',       ['Labirent'],              []],
    [ 8, 54.1, 43.1, 58.6, 'Yaşayan birini ölü görmek',     'A living person as dead',      ['Ölüm'],                  []],
    [ 9, 48.3, 58.1, 44.4, 'Uçmak',                         'Flying',                       ['Uçmak'],                 []],
    [10, 48.3, 44.3, 49.9, 'Odada bir varlık hissetmek',    'Sensing a presence',           ['Yabancı', 'Karanlık figür'], ['shadow']],
    [11, 45.0, 37.2, 48.1, 'Sınavda kalmak',                'Failing an examination',       ['Sınav'],                 ['persona']],
    [12, 42.4, 39.9, 43.5, 'Saldırıya uğramak',             'Being physically attacked',    ['Kovalanmak'],            ['shadow']],
    [13, 40.7, 32.3, 44.2, 'Korkudan donup kalmak',         'Frozen with fright',           [],                        []],
    [14, 38.4, 36.7, 39.0, 'Ölü birini canlı görmek',       'A dead person as alive',       ['Ölüm'],                  []],
    [15, 36.7, 33.1, 38.2, 'Yeniden çocuk olmak',           'Being a child again',          [],                        ['child']],
    [16, 34.5, 35.8, 34.0, 'Öldürülmek',                    'Being killed',                 ['Ölüm'],                  ['shadow']],
    [17, 33.8, 25.5, 37.1, 'Böcek ya da örümcek',           'Insects or spiders',           ['Hayvan'],                []],
    [18, 34.3, 29.0, 36.4, 'Yüzmek',                        'Swimming',                     ['Su', 'Deniz / Okyanus'], []],
    [19, 32.6, 37.5, 30.6, 'Çıplak olmak',                  'Being nude',                   ['Çıplaklık'],             ['persona']],
    [20, 32.5, 30.8, 33.2, 'Uygunsuz giyinmiş olmak',       'Inappropriately dressed',      ['Çıplaklık'],             ['persona']],
    [21, 32.3, 30.8, 33.0, 'Evde yeni bir oda bulmak',      'Discovering a new room',       ['Ev'],                    ['self']],
    [22, 32.0, 29.3, 33.1, 'Aracın kontrolünü kaybetmek',   'Losing control of a vehicle',  ['Araç / Araba'],          []],
    [23, 30.7, 28.7, 31.4, 'Lezzetli yemekler',             'Eating delicious foods',       [],                        ['mother']],
    [24, 27.2, 25.2, 28.0, 'Yarı uyanık felç olmak',        'Half awake and paralysed',     [],                        []],
    [25, 25.7, 34.0, 22.3, 'Para bulmak',                   'Finding money',                ['Hazine / Mücevher'],     []],
    [26, 27.3, 22.6, 29.3, 'Yangın',                        'Fire',                         ['Ateş'],                  []],
    [27, 24.9, 39.3, 19.0, 'Sihirli güçlere sahip olmak',   'Having magical powers',        [],                        ['hero', 'sage']],
    [28, 24.4, 36.4, 19.5, 'Üstün bilgi ya da zihin gücü',  'Superior knowledge',           [],                        ['sage']],
    [29, 24.2, 21.1, 25.5, 'Boğulmak, nefes alamamak',      'Being smothered',              [],                        ['mother']],
    [30, 24.3, 36.1, 19.5, 'Birini öldürmek',               'Killing someone',              ['Ölüm'],                  ['shadow']],
    [31, 23.8, 22.6, 24.3, 'Kendini ölü görmek',            'Seeing yourself as dead',      ['Ölüm'],                  ['self']],
    [32, 24.0, 22.9, 24.5, 'Kilitli kalmak',                'Being locked up',              ['Mağara'],                []],
    [33, 23.5, 22.6, 23.8, 'Çok yakında bir yüz',           'A face very close to you',     ['Yabancı'],               ['shadow']],
    [34, 22.1, 16.4, 24.4, 'Yılan',                         'Snakes',                       ['Yılan'],                 []],
    [35, 21.4, 19.4, 22.3, 'Bağlı, hareket edememek',       'Being tied, unable to move',   [],                        []],
    [36, 17.7, 17.3, 17.9, 'Kasırga ya da şiddetli rüzgâr', 'Tornadoes or strong winds',    ['Fırtına'],               []],
    [37, 19.2, 13.8, 21.4, 'Tuvalet bulamamak',             'Unable to find a toilet',      [],                        []],
    [38, 18.8, 16.7, 19.6, 'Diş dökülmesi',                 'Teeth falling out',            ['Diş dökülmesi'],         []],
    [39, 20.0, 20.2, 19.9, 'Deliler ya da akıl hastaları',  'Lunatics or insane people',    [],                        ['shadow']],
    [40, 16.9, 21.4, 15.1, 'Sinemada olmak',                'Being at a movie',             [],                        []],
    [41, 16.8, 22.3, 14.5, 'Yarı hayvan yarı insan yaratık','Part animal, part human',      ['Hayvan'],                ['trickster']],
    [42, 15.9, 19.6, 14.4, 'Vahşi hayvanlar',               'Wild, violent beasts',         ['Hayvan'],                ['shadow']],
    [43, 15.9, 15.8, 16.0, 'Kendini aynada görmek',         'Seeing yourself in a mirror',  ['Ayna'],                  ['self']],
    [44, 12.4, 11.7, 12.7, 'Bir melek görmek',              'Seeing an angel',              [],                        ['sage']],
    [45, 12.3, 18.2,  9.9, 'Başka bir gezegene gitmek',     'Travelling to another planet', [],                        []],
    [46, 12.4, 12.9, 12.1, 'Sel ya da dev dalga',           'Floods or tidal waves',        ['Deniz / Okyanus', 'Su'], ['mother']],
    [47, 12.8, 15.8, 11.5, 'Uçağın düşmesi',                'Seeing a flying object crash', [],                        []],
    [48, 11.9,  9.4, 12.9, 'Karşı cinsten olmak',           'Being the opposite sex',       [],                        ['anima', 'animus']],
    [49, 11.2, 13.2, 10.4, 'Tanrı ile karşılaşmak',         'Encountering God',             [],                        ['self']],
    [50, 10.8, 12.6, 10.0, 'Deprem',                        'Earthquakes',                  [],                        []],
    [51,  9.5, 16.4,  6.7, 'Dünya dışı varlıklar',          'Extra-terrestrials',           ['Yabancı'],               []],
    [52,  8.0, 11.1,  6.8, 'Hayvan olmak',                  'Being an animal',              ['Hayvan'],                []],
    [53,  7.7, 12.0,  6.0, 'UFO görmek',                    'Seeing a UFO',                 [],                        []],
    [54,  5.1,  1.8,  6.4, 'Kürtaj',                        'Someone having an abortion',   [],                        []],
    [55,  3.5,  5.0,  2.9, 'Nesne olmak',                   'Being an object',              [],                        []]
  ];

  const THEMES = T.map(r => ({
    rank: r[0], p: r[1], men: r[2], women: r[3],
    tr: r[4], en: r[5], symbols: r[6], archetypes: r[7]
  }));

  /* ---------- lookups ---------- */

  const bySymbol = new Map();   // symbol name in EITHER language (lowercased) -> best theme
  const byArch   = new Map();   // archetype id -> best theme

  // `symbols` above are written with Turkish lexicon names; register the
  // English name of the same entry too, so a notebook kept in either
  // language compares against the norms.
  const aliases = nameTr => {
    const out = [nameTr];
    const lex = (window.LEX && window.LEX.SYMBOLS) || [];
    const hit = lex.find(s => s.tr.name === nameTr);
    if (hit && hit.en.name !== nameTr) out.push(hit.en.name);
    return out;
  };

  THEMES.forEach(th => {
    th.symbols.forEach(s => {
      aliases(s).forEach(name => {
        const k = name.toLocaleLowerCase('tr');
        const cur = bySymbol.get(k);
        if (!cur || th.p > cur.p) bySymbol.set(k, th);
      });
    });
    th.archetypes.forEach(a => {
      const cur = byArch.get(a);
      if (!cur || th.p > cur.p) byArch.set(a, th);
    });
  });

  /** Prevalence for one of the user's tags, or null when unmapped. */
  function forSymbol(nameTr) {
    return nameTr ? (bySymbol.get(String(nameTr).toLocaleLowerCase('tr')) || null) : null;
  }
  function forArchetype(id) { return byArch.get(id) || null; }

  /**
   * The collective map: the typical dream landscape as a graph, so a new
   * notebook has something true to show before it has anything of its own.
   * Edges join themes that share a mapped image — the only co-occurrence
   * the source data licenses us to draw.
   */
  function collectiveGraph(lang, topN) {
    const items = THEMES.slice(0, topN || 18);
    const nodes = items.map(th => ({
      key: 't:' + th.rank, kind: 'norm', id: String(th.rank),
      label: th[lang] || th.en, n: Math.round(th.p), p: th.p, rank: th.rank,
      degree: 0, dreamIds: []
    }));
    const byKey = new Map(nodes.map(n => [n.key, n]));

    const links = [];
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i], b = items[j];
        const shared = a.symbols.filter(s => b.symbols.includes(s)).length
                     + a.archetypes.filter(x => b.archetypes.includes(x)).length;
        if (shared) links.push({ source: 't:' + a.rank, target: 't:' + b.rank, w: shared });
      }
    }
    links.sort((x, y) => y.w - x.w);
    links.forEach(l => {
      const a = byKey.get(l.source), b = byKey.get(l.target);
      if (a) a.degree += l.w;
      if (b) b.degree += l.w;
    });
    return { nodes, links, dreamCount: 0, collective: true };
  }

  /**
   * Where the dreamer departs from the population. Only themes we can map
   * are comparable, and a single occurrence is never called a deviation.
   */
  function compare(dreams, lang) {
    const n = dreams.length;
    if (n < 3) return [];
    const count = new Map();
    dreams.forEach(d => {
      const seen = new Set();
      (d.symbols || []).forEach(s => {
        const th = forSymbol(s);
        if (th && !seen.has(th.rank)) { seen.add(th.rank); count.set(th.rank, (count.get(th.rank) || 0) + 1); }
      });
      (d.archetypes || []).forEach(a => {
        const th = forArchetype(a);
        if (th && !seen.has(th.rank)) { seen.add(th.rank); count.set(th.rank, (count.get(th.rank) || 0) + 1); }
      });
    });

    const out = [];
    count.forEach((c, rank) => {
      const th = THEMES.find(x => x.rank === rank);
      if (!th || c < 2) return;
      const mine = c / n * 100;
      out.push({ theme: th, label: th[lang] || th.en, count: c, mine, norm: th.p, ratio: mine / th.p });
    });
    return out.sort((a, b) => b.ratio - a.ratio);
  }

  /** Demo notebook, generated from the norms — labelled as a sample, never as a record. */
  function sampleDreams(lang, now) {
    const S = window.SAMPLE_DREAMS[lang] || window.SAMPLE_DREAMS.tr;
    return S.map((d, i) => {
      const dt = new Date(now);
      dt.setDate(dt.getDate() - d.ago);
      dt.setHours(7, 5 + i * 3, 0, 0);
      return {
        id: 'demo-' + i, demo: true, date: dt.toISOString(),
        title: d.title, body: d.body, mood: d.mood, clarity: d.clarity,
        lucid: !!d.lucid, recurring: !!d.recurring,
        archetypes: d.archetypes, symbols: d.symbols, answers: []
      };
    });
  }

  return { THEMES, CITATION, forSymbol, forArchetype, collectiveGraph, compare, sampleDreams };
})();
