/* =========================================================
   Anima — dream atlas
   Where typical-dream prevalence has actually been measured.

   Every figure below is LIFETIME prevalence from a published study in the
   Typical Dreams Questionnaire lineage (Griffith 1958 → Nielsen 2003 →
   national adaptations). Nothing here is estimated, interpolated, or
   filled in. A country with no study is shown as a gap, not a guess.

   SOURCES
   CA  Nielsen, Zadra, Simard, Saucier, Stenstrom, Smith & Kuiken (2003).
       The Typical Dreams of Canadian University Students. Dreaming 13(4),
       211–235. n = 1181. All 55 themes — see norms.js.
   DE  Schredl, Ciric, Götz & Wittmann (2004). German student sample,
       ten most prevalent themes.
   HK  Yu, C. K.-C. (2008). Typical Dreams Experienced by Chinese People.
       Hong Kong / Chinese sample, five most prevalent themes.
   JP  Griffith, Miyagi & Tago (1958). The Universality of Typical Dreams:
   US  Japanese vs. Americans. American Anthropologist 60(6). n = 473,
       34 themes. Historic; only the combined attack/pursuit figure is
       reported here because that is what is reliably attested.
   TR  No published lifetime-prevalence study. Deliberately empty.
   ========================================================= */

window.ATLAS = (function () {

  /* depth: how much of the theme list a study actually documents */
  const COUNTRIES = [
    {
      iso: 'CA', depth: 'full', n: 1181, year: 2003,
      tr: 'Kanada', en: 'Canada',
      cite: 'Nielsen, Zadra, Simard, Saucier, Stenstrom, Smith & Kuiken (2003), Dreaming 13(4), 211–235.',
      themes: [
        ['chased', 81.5], ['sexual', 76.5], ['falling', 73.8], ['school', 67.1],
        ['late', 59.5], ['verge', 57.7], ['aliveDead', 54.1], ['trying', 53.5],
        ['flying', 48.3], ['presence', 48.3], ['exam', 45.0], ['attacked', 42.4]
      ]
    },
    {
      iso: 'DE', depth: 'partial', n: null, year: 2004,
      tr: 'Almanya', en: 'Germany',
      cite: 'Schredl, Ciric, Götz & Wittmann (2004) — on yaygın tema.',
      citeEn: 'Schredl, Ciric, Götz & Wittmann (2004) — ten most prevalent themes.',
      themes: [
        ['school', 89], ['chased', 89], ['sexual', 87], ['falling', 74],
        ['late', 69], ['aliveDead', 68], ['flying', 64], ['exam', 61],
        ['verge', 57], ['frozen', 56]
      ]
    },
    {
      iso: 'HK', depth: 'partial', n: null, year: 2008,
      tr: 'Hong Kong / Çin', en: 'Hong Kong / China',
      cite: 'Yu, C. K.-C. (2008), Typical Dreams Experienced by Chinese People — beş yaygın tema.',
      citeEn: 'Yu, C. K.-C. (2008), Typical Dreams Experienced by Chinese People — five most prevalent themes.',
      themes: [
        ['school', 95], ['chased', 92], ['falling', 87], ['late', 81], ['exam', 79]
      ]
    },
    {
      iso: 'JP', depth: 'historic', n: 473, year: 1958,
      tr: 'Japonya', en: 'Japan',
      cite: 'Griffith, Miyagi & Tago (1958), American Anthropologist 60(6) — 34 tema, Japon ve Amerikalı öğrenciler birlikte.',
      citeEn: 'Griffith, Miyagi & Tago (1958), American Anthropologist 60(6) — 34 themes, Japanese and American students together.',
      themes: [['chased', 77.2]],
      noteTr: 'Japon katılımcılar Amerikalılara göre daha çok yangın, daha az çıplaklık ve daha çok kovalanma rüyası bildirdi. Çalışma iki örneklemi birlikte raporladığı için tek tek ülke oranları sınırlıdır.',
      noteEn: 'Japanese participants reported more fire, less nudity and more pursuit than Americans. The study reports the two samples together, so per-country figures are limited.'
    },
    {
      iso: 'US', depth: 'historic', n: 473, year: 1958,
      tr: 'Amerika Birleşik Devletleri', en: 'United States',
      cite: 'Griffith, Miyagi & Tago (1958), American Anthropologist 60(6) — 34 tema.',
      citeEn: 'Griffith, Miyagi & Tago (1958), American Anthropologist 60(6) — 34 themes.',
      themes: [['chased', 77.2]],
      noteTr: 'Bu, saldırı ve kovalanma maddelerinin birleşik oranıdır; 1958 örnekleminin tamamı için verilmiştir.',
      noteEn: 'This is the combined attack/pursuit figure, reported for the whole 1958 sample.'
    },
    {
      iso: 'TR', depth: 'none', n: null, year: null,
      tr: 'Türkiye', en: 'Turkey',
      themes: [],
      noteTr: 'Türkiye örneklemiyle yapılmış, yayımlanmış bir yaşam boyu yaygınlık çalışması bulunmuyor. Türkçe rüya araştırmaları farklı ölçekler kullanıyor (ör. Rüya Temaları Ölçeği), bu yüzden buradaki oranlarla karşılaştırılamaz. Haritadaki bu boşluk uydurulmadı — gerçekten boş.',
      noteEn: 'No published lifetime-prevalence study exists for a Turkish sample. Turkish dream research uses different instruments (e.g. the Dream Themes Scale), which are not comparable with the figures here. This gap on the map is not invented — it is genuinely empty.'
    }
  ];

  /* theme keys → display names, tied back to the norms table by rank */
  const THEME_LABELS = {
    chased:    { tr: 'Kovalanmak',              en: 'Being chased',        rank: 1 },
    sexual:    { tr: 'Cinsel deneyim',          en: 'Sexual experiences',  rank: 2 },
    falling:   { tr: 'Düşmek',                  en: 'Falling',             rank: 3 },
    school:    { tr: 'Okul, öğretmen, ders',    en: 'School, teachers',    rank: 4 },
    late:      { tr: 'Geç kalmak',              en: 'Arriving too late',   rank: 5 },
    verge:     { tr: 'Düşmenin eşiğinde olmak', en: 'On the verge of falling', rank: 6 },
    trying:    { tr: 'Tekrar tekrar denemek',   en: 'Trying again and again',  rank: 7 },
    aliveDead: { tr: 'Yaşayan birini ölü görmek', en: 'A living person as dead', rank: 8 },
    flying:    { tr: 'Uçmak',                   en: 'Flying',              rank: 9 },
    presence:  { tr: 'Odada bir varlık hissetmek', en: 'Sensing a presence', rank: 10 },
    exam:      { tr: 'Sınavda kalmak',          en: 'Failing an examination',  rank: 11 },
    attacked:  { tr: 'Saldırıya uğramak',       en: 'Being physically attacked', rank: 12 },
    frozen:    { tr: 'Korkudan donup kalmak',   en: 'Frozen with fright',  rank: 13 }
  };

  const byIso = new Map(COUNTRIES.map(c => [c.iso, c]));

  function get(iso) { return byIso.get(iso) || null; }
  function value(iso, theme) {
    const c = byIso.get(iso);
    if (!c) return null;
    const hit = c.themes.find(t => t[0] === theme);
    return hit ? hit[1] : null;
  }

  /** Themes measured in at least two countries — the only ones worth comparing. */
  function comparable() {
    return Object.keys(THEME_LABELS).filter(k =>
      COUNTRIES.filter(c => c.themes.some(t => t[0] === k)).length >= 2);
  }

  /** One theme across every country that measured it, highest first. */
  function series(theme) {
    return COUNTRIES
      .map(c => ({ country: c, v: value(c.iso, theme) }))
      .filter(r => r.v != null)
      .sort((a, b) => b.v - a.v);
  }

  return { COUNTRIES, THEME_LABELS, get, value, comparable, series };
})();
