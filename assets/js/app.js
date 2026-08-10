/* =========================================================
   Anima — application
   Local-first. No account, no network, no telemetry.
   ========================================================= */
(function () {
  'use strict';

  const { ARCHETYPES, SYMBOLS, MOODS, PROMPTS } = window.LEX;
  const KEY = 'anima.v1';
  const DRAFT_KEY = 'anima.draft.v1';
  const STEPS = ['stepDream', 'stepWaking', 'stepArchetypes', 'stepSymbols', 'stepReflect'];

  /* ---------------- state ---------------- */
  let state = load();
  let lastDeleted = null;
  let draft = null;
  let step = 0;
  let sheetReturnFocus = null;

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY));
      if (raw && Array.isArray(raw.dreams)) {
        return { dreams: raw.dreams, lang: raw.lang || detectLang(), theme: raw.theme || 'system' };
      }
    } catch (_) { /* fall through to defaults */ }
    return { dreams: [], lang: detectLang(), theme: 'system' };
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (_) { toast(t('importFailed')); }
  }
  function detectLang() {
    return (navigator.language || 'tr').toLowerCase().startsWith('tr') ? 'tr' : 'en';
  }

  /* ---------------- i18n helpers ---------------- */
  function t(key, ...args) {
    const v = window.STRINGS[state.lang][key];
    return typeof v === 'function' ? v(...args) : (v == null ? key : v);
  }
  const L = obj => obj[state.lang] || obj.en;

  function applyStaticStrings() {
    document.documentElement.lang = state.lang;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel)); });
  }

  /* ---------------- theme ---------------- */
  const mql = window.matchMedia('(prefers-color-scheme: light)');
  function applyTheme() {
    const resolved = state.theme === 'system' ? (mql.matches ? 'light' : 'dark') : state.theme;
    document.documentElement.dataset.theme = resolved;
  }
  mql.addEventListener('change', () => { if (state.theme === 'system') applyTheme(); });

  /* ---------------- small utils ---------------- */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function uid() {
    return 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function icon(paths, cls) {
    return `<svg class="${cls || ''}" viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
  }
  const I = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    info:  '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
    x:     '<path d="M18 6 6 18M6 6l12 12"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    back:  '<path d="M15 18 9 12l6-6"/>',
    plus:  '<path d="M12 5v14M5 12h14"/>',
    pen:   '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
    lock:  '<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>',
    moon:  '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>'
  };

  function fmtDate(iso) {
    const d = new Date(iso);
    const now = new Date();
    const day = x => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
    const diff = Math.round((day(now) - day(d)) / 86400000);
    if (diff === 0) return t('today');
    if (diff === 1) return t('yesterday');
    return d.toLocaleDateString(state.lang === 'tr' ? 'tr-TR' : 'en-GB',
      { day: 'numeric', month: 'long', year: d.getFullYear() === now.getFullYear() ? undefined : 'numeric' });
  }
  function fmtLong(iso) {
    return new Date(iso).toLocaleDateString(state.lang === 'tr' ? 'tr-TR' : 'en-GB',
      { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  function toLocalInput(iso) {
    const d = new Date(iso);
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  function archById(id) { return ARCHETYPES.find(a => a.id === id); }
  function symByName(name) {
    const n = name.toLocaleLowerCase(state.lang);
    return SYMBOLS.find(s => L(s).name.toLocaleLowerCase(state.lang) === n
      || s.tr.name.toLocaleLowerCase('tr') === n || s.en.name.toLowerCase() === n);
  }
  function moodById(id) { return MOODS.find(m => m.id === id); }

  function promptsFor(id) {
    // Deterministic per dream so the questions never shuffle under the user.
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    const out = [], used = new Set();
    for (let k = 0; out.length < 3; k++) {
      const i = (h + k * 7) % PROMPTS.length;
      if (!used.has(i)) { used.add(i); out.push({ i, q: PROMPTS[i] }); }
    }
    return out;
  }

  /* ---------------- toasts ---------------- */
  function toast(text, opts = {}) {
    const host = $('#toasts');
    const el = document.createElement('div');
    el.className = 'toast' + (opts.danger ? ' toast--danger' : '');
    el.innerHTML = `<span class="toast__text">${esc(text)}</span>`;
    if (opts.action) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'toast__action'; b.textContent = opts.action.label;
      b.addEventListener('click', () => { opts.action.run(); dismiss(); });
      el.appendChild(b);
    }
    host.appendChild(el);
    let timer = setTimeout(dismiss, opts.action ? 6000 : 3200);
    function dismiss() {
      clearTimeout(timer);
      if (!el.isConnected) return;
      el.classList.add('is-out');
      setTimeout(() => el.remove(), 170);
    }
    return dismiss;
  }

  /* ---------------- sheet ---------------- */
  function openSheet(title, html, onMount) {
    sheetReturnFocus = document.activeElement;
    const root = $('#sheetRoot');
    $('#sheetTitle').textContent = title;
    $('#sheetBody').innerHTML = html;
    root.hidden = false;
    document.body.style.overflow = 'hidden';
    if (onMount) onMount($('#sheetBody'));
    const first = $('#sheetBody').querySelector('button, [href], input, textarea, select') || $('#sheetClose');
    first.focus({ preventScroll: true });
    document.addEventListener('keydown', sheetKeys);
  }
  function closeSheet() {
    const root = $('#sheetRoot');
    if (root.hidden) return;
    root.hidden = true;
    $('#sheetBody').innerHTML = '';
    document.body.style.overflow = '';
    document.removeEventListener('keydown', sheetKeys);
    if (sheetReturnFocus && sheetReturnFocus.isConnected) sheetReturnFocus.focus({ preventScroll: true });
    sheetReturnFocus = null;
  }
  function sheetKeys(e) {
    if (e.key === 'Escape') { e.preventDefault(); closeSheet(); return; }
    if (e.key !== 'Tab') return;
    const f = $$('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])', $('#sheet'))
      .filter(el => !el.disabled && el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  $('#scrim').addEventListener('click', closeSheet);
  $('#sheetClose').addEventListener('click', closeSheet);

  /* ---------------- router ---------------- */
  function route() {
    const raw = location.hash.replace(/^#\/?/, '') || 'dreams';
    const [name, arg] = raw.split('/');
    return { name, arg: arg ? decodeURIComponent(arg) : null };
  }
  function go(hash) { location.hash = hash; }

  function render() {
    closeSheet();
    const r = route();
    const main = $('#main');
    const views = {
      dreams: viewDreams, new: viewCapture, edit: viewCapture, dream: viewDream,
      symbols: viewLexicon, patterns: viewPatterns, about: viewAbout
    };
    const fn = views[r.name] || viewDreams;
    main.innerHTML = `<div class="view">${fn(r.arg)}</div>`;
    (mounts[r.name] || function () {})(main, r.arg);

    $$('.tab').forEach(tab => {
      const on = tab.dataset.tab === r.name
        || (r.name === 'dream' && tab.dataset.tab === 'dreams')
        || (r.name === 'edit' && tab.dataset.tab === 'new');
      if (on) tab.setAttribute('aria-current', 'page'); else tab.removeAttribute('aria-current');
    });
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }

  /* =========================================================
     VIEW · Dreams
     ========================================================= */
  let query = '';

  function matches(d, q) {
    if (!q) return true;
    const n = q.toLocaleLowerCase(state.lang);
    const hay = [
      d.title, d.body,
      ...(d.symbols || []),
      ...(d.archetypes || []).map(id => { const a = archById(id); return a ? L(a).name : ''; }),
      ...(d.answers || []).map(a => a.text)
    ].join(' ').toLocaleLowerCase(state.lang);
    return hay.includes(n);
  }

  function sorted() {
    return state.dreams.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  function viewDreams() {
    const all = sorted();
    const list = all.filter(d => matches(d, query));

    if (!all.length) {
      return `
        <div class="page-head">
          <h1 class="page-title">${esc(t('dreamsTitle'))}</h1>
          <p class="page-sub">${esc(t('dreamsSub'))}</p>
        </div>
        <div class="empty">
          <div class="empty__art">${icon('<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18a4.5 4.5 0 0 1 0-9a4.5 4.5 0 0 0 0-9Z"/>')}</div>
          <h2 class="empty__title">${esc(t('emptyTitle'))}</h2>
          <p class="empty__text">${esc(t('emptyText'))}</p>
          <a class="btn btn--primary" href="#/new">${icon(I.plus)}${esc(t('emptyCta'))}</a>
        </div>`;
    }

    const cards = list.map((d, i) => dreamCard(d, i)).join('');
    return `
      <div class="page-head">
        <h1 class="page-title">${esc(t('dreamsTitle'))}</h1>
        <p class="page-sub">${esc(t('dreamsSub'))}</p>
      </div>
      <div class="searchbar">
        <label class="sr-only" for="q">${esc(t('searchPlaceholder'))}</label>
        ${icon(I.search)}
        <input class="input" id="q" type="search" inputmode="search"
               placeholder="${esc(t('searchPlaceholder'))}" value="${esc(query)}">
      </div>
      <p class="section__title" aria-live="polite">${esc(t('resultCount', list.length))}</p>
      ${list.length ? `<div class="dream-list">${cards}</div>` : `
        <div class="empty">
          <h2 class="empty__title">${esc(t('noResultsTitle'))}</h2>
          <p class="empty__text">${esc(t('noResultsText'))}</p>
          <button class="btn btn--ghost" id="clearQ" type="button">${esc(t('clearSearch'))}</button>
        </div>`}
      ${footer()}`;
  }

  function dreamCard(d, i) {
    const mood = moodById(d.mood);
    const chips = []
      .concat(d.lucid ? [`<span class="chip"><span class="chip__dot" style="color:var(--primary)"></span>${esc(t('lucid'))}</span>`] : [])
      .concat(d.recurring ? [`<span class="chip">${esc(t('recurring'))}</span>`] : [])
      .concat(mood ? [`<span class="chip chip--mood">${esc(L(mood) || mood[state.lang])}</span>`] : [])
      .concat((d.archetypes || []).slice(0, 2).map(id => {
        const a = archById(id); return a ? `<span class="chip chip--arch">${esc(L(a).name)}</span>` : '';
      }));
    return `
      <a class="dream-card${d.lucid ? ' is-lucid' : ''}" href="#/dream/${encodeURIComponent(d.id)}" style="--i:${Math.min(i, 12)}">
        <div class="dream-card__top">
          <h2 class="dream-card__title">${esc(d.title || t('untitled'))}</h2>
          <time class="dream-card__date" datetime="${esc(d.date)}">${esc(fmtDate(d.date))}</time>
        </div>
        <p class="dream-card__excerpt">${esc(d.body)}</p>
        ${chips.length ? `<div class="dream-card__meta">${chips.join('')}</div>` : ''}
      </a>`;
  }

  /* =========================================================
     VIEW · Dream reader
     ========================================================= */
  function viewDream(id) {
    const d = state.dreams.find(x => x.id === id);
    if (!d) return `<div class="empty"><h2 class="empty__title">${esc(t('noResultsTitle'))}</h2>
      <a class="btn btn--ghost" href="#/dreams">${esc(t('back'))}</a></div>`;

    const mood = moodById(d.mood);
    const meta = [];
    if (mood) meta.push(esc(mood[state.lang]));
    if (d.clarity) meta.push(`${d.clarity}/5 ${esc(t('clarityShort'))}`);
    if (d.lucid) meta.push(esc(t('lucid')));
    if (d.recurring) meta.push(esc(t('recurring')));

    const archs = (d.archetypes || []).map(idx => {
      const a = archById(idx);
      return a ? `<button class="chip chip--arch" type="button" data-arch="${esc(a.id)}">${esc(L(a).name)}</button>` : '';
    }).join('');
    const syms = (d.symbols || []).map(s =>
      `<button class="chip chip--sym" type="button" data-sym="${esc(s)}">${esc(s)}</button>`).join('');
    const answers = (d.answers || []).filter(a => a.text && a.text.trim()).map(a => `
      <div class="qa">
        <p class="qa__q">${esc(L(PROMPTS[a.i] || { tr: '', en: '' }))}</p>
        <p class="qa__a">${esc(a.text)}</p>
      </div>`).join('');

    return `
      <button class="iconbtn" id="backBtn" type="button" aria-label="${esc(t('back'))}" style="margin:-4px 0 8px -10px">${icon(I.back)}</button>
      <article class="reader">
        <p class="reader__date">${esc(fmtLong(d.date))}${meta.length ? ' · ' + meta.join(' · ') : ''}</p>
        <h1 class="reader__title">${esc(d.title || t('untitled'))}</h1>
        <div class="reader__body">${esc(d.body)}</div>

        ${archs ? `<div class="section" style="margin-top:var(--sp-6)">
          <h2 class="section__title">${esc(t('readerArch'))}</h2>
          <div class="chipset">${archs}</div></div>` : ''}

        ${syms ? `<div class="section">
          <h2 class="section__title">${esc(t('readerSym'))}</h2>
          <div class="chipset">${syms}</div></div>` : ''}

        ${answers ? `<div class="section">
          <h2 class="section__title">${esc(t('readerReflect'))}</h2>${answers}</div>` : ''}
      </article>

      <div class="btn-row" style="margin-top:var(--sp-6)">
        <a class="btn btn--ghost" href="#/edit/${encodeURIComponent(d.id)}">${icon(I.pen)}${esc(t('edit'))}</a>
        <button class="btn btn--danger" id="delBtn" type="button">${icon(I.trash)}${esc(t('delete'))}</button>
      </div>
      ${footer()}`;
  }

  /* =========================================================
     VIEW · Capture / edit
     ========================================================= */
  function blankDraft() {
    return {
      id: uid(), date: new Date().toISOString(), title: '', body: '',
      mood: '', clarity: 3, lucid: false, recurring: false,
      archetypes: [], symbols: [], answers: [], created: Date.now()
    };
  }

  function viewCapture(editId) {
    if (!draft) {
      if (editId) {
        const src = state.dreams.find(x => x.id === editId);
        draft = src ? JSON.parse(JSON.stringify(src)) : blankDraft();
      } else {
        let stored = null;
        try { stored = JSON.parse(localStorage.getItem(DRAFT_KEY)); } catch (_) {}
        if (stored && stored.body) { draft = stored; setTimeout(() => toast(t('draftRestored')), 350); }
        else draft = blankDraft();
      }
      step = 0;
    }
    const isEdit = !!editId;
    const qs = promptsFor(draft.id);

    const panels = [stepBodyPanel(), stepWakingPanel(), stepArchPanel(), stepSymPanel(), stepReflectPanel(qs)];
    const last = step === STEPS.length - 1;

    return `
      <div class="page-head">
        <h1 class="page-title">${esc(isEdit ? t('editTitle') : t('captureTitle'))}</h1>
      </div>
      <div class="stepper">
        <div class="stepper__bar" role="progressbar" aria-valuemin="1" aria-valuemax="${STEPS.length}"
             aria-valuenow="${step + 1}" aria-label="${esc(t('step', step + 1, STEPS.length))}">
          ${STEPS.map((_, i) => `<div class="stepper__seg ${i < step ? 'is-done' : i === step ? 'is-active' : ''}"><span></span></div>`).join('')}
        </div>
        <div class="stepper__meta">
          <h2 class="stepper__name">${esc(t(STEPS[step]))}</h2>
          <span class="stepper__count">${esc(t('step', step + 1, STEPS.length))}</span>
        </div>
      </div>
      <form id="capture" novalidate>${panels[step]}</form>
      <div class="step-nav">
        ${step > 0 ? `<button class="btn btn--ghost" id="prevStep" type="button" aria-label="${esc(t('back'))}">${icon(I.back)}</button>` : ''}
        <button class="btn btn--primary" id="nextStep" type="button">
          ${last ? icon(I.check) : ''}${esc(last ? t('save') : t('next'))}
        </button>
      </div>`;
  }

  function stepBodyPanel() {
    return `
      <div class="field">
        <label class="label" for="fDate">${esc(t('fieldWhen'))}</label>
        <input class="input" id="fDate" type="datetime-local" value="${esc(toLocalInput(draft.date))}">
      </div>
      <div class="field">
        <label class="label" for="fBody">${esc(t('fieldBody'))}<span class="req" aria-hidden="true">*</span></label>
        <textarea class="textarea" id="fBody" required aria-describedby="bodyHint"
          placeholder="${esc(t('bodyPlaceholder'))}">${esc(draft.body)}</textarea>
        <p class="hint" id="bodyHint">${esc(t('bodyHint'))}</p>
        <div id="bodyErr" role="alert"></div>
      </div>
      <div class="field">
        <label class="label" for="fTitle">${esc(t('fieldTitle'))}</label>
        <input class="input" id="fTitle" type="text" value="${esc(draft.title)}"
          placeholder="${esc(t('titlePlaceholder'))}" maxlength="80">
      </div>`;
  }

  function stepWakingPanel() {
    const moods = MOODS.map(m => `
      <button class="chip-opt" type="button" data-mood="${esc(m.id)}" aria-pressed="${draft.mood === m.id}">
        ${icon(I.check, 'chip-opt__check')}${esc(m[state.lang])}
      </button>`).join('');
    const scale = [1, 2, 3, 4, 5].map(n =>
      `<button type="button" data-clarity="${n}" aria-pressed="${draft.clarity === n}" aria-label="${n} / 5">${n}</button>`).join('');
    return `
      <div class="field">
        <p class="label" id="moodLbl">${esc(t('fieldMood'))}</p>
        <div class="chipset" role="group" aria-labelledby="moodLbl">${moods}</div>
        <p class="hint">${esc(t('moodHint'))}</p>
      </div>
      <div class="field">
        <p class="label" id="clarityLbl">${esc(t('fieldClarity'))}</p>
        <div class="scale" role="group" aria-labelledby="clarityLbl">${scale}</div>
        <p class="hint">${esc(t('clarityHint'))}</p>
      </div>
      <hr class="divider">
      <div class="switch-row">
        <div class="switch-row__text">
          <div class="switch-row__label" id="lucidLbl">${esc(t('lucidLabel'))}</div>
          <div class="switch-row__hint">${esc(t('lucidHint'))}</div>
        </div>
        <button class="switch" type="button" role="switch" data-flag="lucid"
          aria-checked="${!!draft.lucid}" aria-labelledby="lucidLbl"></button>
      </div>
      <div class="switch-row">
        <div class="switch-row__text">
          <div class="switch-row__label" id="recLbl">${esc(t('recurringLabel'))}</div>
          <div class="switch-row__hint">${esc(t('recurringHint'))}</div>
        </div>
        <button class="switch" type="button" role="switch" data-flag="recurring"
          aria-checked="${!!draft.recurring}" aria-labelledby="recLbl"></button>
      </div>`;
  }

  function stepArchPanel() {
    const chips = ARCHETYPES.map(a => `
      <span class="chip-opt" role="button" tabindex="0" data-arch-toggle="${esc(a.id)}"
            aria-pressed="${draft.archetypes.includes(a.id)}">
        ${icon(I.check, 'chip-opt__check')}${esc(L(a).name)}
        <button class="chip-opt__info" type="button" data-arch-info="${esc(a.id)}"
          aria-label="${esc(L(a).name)} — ${esc(t('askYourself'))}">${icon(I.info)}</button>
      </span>`).join('');
    return `
      <div class="field">
        <p class="label" id="archLbl">${esc(t('fieldArch'))}</p>
        <div class="chipset" role="group" aria-labelledby="archLbl">${chips}</div>
        <p class="hint">${esc(t('archHint'))}</p>
      </div>`;
  }

  function stepSymPanel() {
    const chosen = draft.symbols.map(s => `
      <span class="tag">${esc(s)}
        <button type="button" data-rmsym="${esc(s)}" aria-label="${esc(s)} — ${esc(t('close'))}">${icon(I.x)}</button>
      </span>`).join('');
    const pool = SYMBOLS.filter(s => !draft.symbols.includes(L(s).name)).slice(0, 14);
    const sugg = pool.map(s => `<button type="button" data-addsym="${esc(L(s).name)}">${esc(L(s).name)}</button>`).join('');
    return `
      <div class="field">
        <label class="label" for="symIn">${esc(t('fieldSym'))}</label>
        <div class="tagbox" id="tagbox">
          ${chosen}
          <input id="symIn" type="text" autocomplete="off" list="symList"
            placeholder="${esc(t('symPlaceholder'))}" aria-describedby="symHint">
        </div>
        <datalist id="symList">${SYMBOLS.map(s => `<option value="${esc(L(s).name)}"></option>`).join('')}</datalist>
        <p class="hint" id="symHint">${esc(t('symHint'))}</p>
      </div>
      <div class="field">
        <p class="section__title">${esc(t('symSuggest'))}</p>
        <div class="suggest">${sugg}</div>
      </div>`;
  }

  function stepReflectPanel(qs) {
    const blocks = qs.map(({ i, q }, n) => {
      const cur = (draft.answers.find(a => a.i === i) || {}).text || '';
      return `
        <div class="field">
          <label class="label" for="ans${n}">${esc(L(q))}</label>
          <textarea class="textarea" id="ans${n}" data-ans="${i}" style="min-height:110px"
            placeholder="${esc(t('answerPlaceholder'))}">${esc(cur)}</textarea>
        </div>`;
    }).join('');
    return `<p class="hint" style="margin-bottom:var(--sp-5)">${esc(t('reflectHint'))}</p>${blocks}`;
  }

  function persistDraft() {
    if (route().name === 'new') {
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch (_) {}
    }
  }

  function collectStep(root) {
    switch (step) {
      case 0: {
        const dt = $('#fDate', root); const body = $('#fBody', root); const title = $('#fTitle', root);
        if (dt && dt.value) draft.date = new Date(dt.value).toISOString();
        if (body) draft.body = body.value;
        if (title) draft.title = title.value.trim();
        break;
      }
      case 4: {
        $$('[data-ans]', root).forEach(ta => {
          const i = Number(ta.dataset.ans);
          const rest = draft.answers.filter(a => a.i !== i);
          if (ta.value.trim()) rest.push({ i, text: ta.value.trim() });
          draft.answers = rest;
        });
        break;
      }
    }
    persistDraft();
  }

  function autoTitle(body) {
    // A title is a handle, not a summary — the opening line is already right below it.
    const line = body.trim().split(/\n/)[0].trim().replace(/[.,;:!?…]+$/, '');
    if (!line) return '';
    let out = '';
    for (const w of line.split(/\s+/)) {
      if (out && (out.length + w.length + 1) > 38) break;
      out = out ? out + ' ' + w : w;
      if (out.length >= 30) break;
    }
    return out.length < line.length ? out + '…' : out;
  }

  function commit() {
    if (!draft.title) draft.title = autoTitle(draft.body);
    const idx = state.dreams.findIndex(d => d.id === draft.id);
    const isEdit = idx >= 0;
    if (isEdit) state.dreams[idx] = draft; else state.dreams.push(draft);
    save();
    localStorage.removeItem(DRAFT_KEY);
    const id = draft.id;
    draft = null; step = 0;
    go(`/dream/${encodeURIComponent(id)}`);
    setTimeout(() => toast(t(isEdit ? 'updatedToast' : 'savedToast')), 200);
  }

  /* =========================================================
     VIEW · Lexicon
     ========================================================= */
  let lexTab = 'arch';
  let lexQuery = '';

  function archCount(id) { return state.dreams.filter(d => (d.archetypes || []).includes(id)).length; }
  function symCount(name) {
    const n = name.toLocaleLowerCase(state.lang);
    return state.dreams.filter(d => (d.symbols || []).some(s => s.toLocaleLowerCase(state.lang) === n)).length;
  }

  function viewLexicon() {
    const q = lexQuery.toLocaleLowerCase(state.lang);
    const arch = ARCHETYPES.filter(a => !q || L(a).name.toLocaleLowerCase(state.lang).includes(q) || L(a).gloss.toLocaleLowerCase(state.lang).includes(q));
    const sym  = SYMBOLS.filter(s => !q || L(s).name.toLocaleLowerCase(state.lang).includes(q) || L(s).gloss.toLocaleLowerCase(state.lang).includes(q));
    const items = lexTab === 'arch'
      ? arch.map(a => lexRow('arch', a.id, a.glyph, L(a).name, L(a).gloss, archCount(a.id)))
      : sym.map(s => lexRow('sym', s.id, L(s).name.charAt(0).toLocaleUpperCase(state.lang), L(s).name, L(s).gloss, symCount(L(s).name)));

    return `
      <div class="page-head">
        <h1 class="page-title">${esc(t('symbolsTitle'))}</h1>
        <p class="page-sub" style="max-width:38ch">${esc(t('symbolsSub'))}</p>
      </div>
      <div class="segmented" role="group" style="margin-bottom:var(--sp-4)">
        <button type="button" data-lextab="arch" aria-pressed="${lexTab === 'arch'}">${esc(t('tabArch'))}</button>
        <button type="button" data-lextab="sym" aria-pressed="${lexTab === 'sym'}">${esc(t('tabSym'))}</button>
      </div>
      <div class="searchbar">
        <label class="sr-only" for="lq">${esc(t('searchLexicon'))}</label>
        ${icon(I.search)}
        <input class="input" id="lq" type="search" placeholder="${esc(t('searchLexicon'))}" value="${esc(lexQuery)}">
      </div>
      ${items.length ? `<div class="lex-list">${items.join('')}</div>` : `
        <div class="empty"><h2 class="empty__title">${esc(t('noResultsTitle'))}</h2>
        <p class="empty__text">${esc(t('noResultsText'))}</p></div>`}
      ${footer()}`;
  }

  function lexRow(kind, id, glyph, name, gloss, count) {
    return `
      <button class="lex-item${kind === 'sym' ? ' lex-item--sym' : ''}" type="button" data-lex="${kind}:${esc(id)}">
        <span class="lex-item__glyph" aria-hidden="true">${esc(glyph)}</span>
        <span style="min-width:0">
          <span class="lex-item__name">${esc(name)}</span>
          <span class="lex-item__gloss" style="display:block">${esc(gloss)}</span>
        </span>
        ${count ? `<span class="lex-item__count">${count}${esc(t('times') === '×' ? '×' : ' ' + t('times'))}</span>` : '<span></span>'}
      </button>`;
  }

  function openLexEntry(kind, id) {
    const isArch = kind === 'arch';
    const entry = isArch ? archById(id) : SYMBOLS.find(s => s.id === id);
    if (!entry) return;
    const c = L(entry);
    const name = c.name;
    const count = isArch ? archCount(id) : symCount(name);
    const ask = isArch ? c.ask : null;

    const html = `
      <div class="prose">
        <p style="color:var(--ink-3);font-size:13px;letter-spacing:.03em;margin-bottom:var(--sp-3)">${esc(c.gloss)}</p>
        <p>${esc(c.body)}</p>
        ${ask ? `<h4>${esc(t('askYourself'))}</h4><blockquote class="quote">${esc(ask)}</blockquote>` : ''}
        ${count ? `<h4>${esc(t('inYourDreams', count))}</h4>
          <button class="btn btn--ghost btn--block" type="button" data-findlex="${esc(name)}">${esc(t('seeDreams'))}</button>` : ''}
      </div>`;
    openSheet(name, html, body => {
      const b = $('[data-findlex]', body);
      if (b) b.addEventListener('click', () => {
        query = b.dataset.findlex; closeSheet(); go('/dreams');
        if (route().name === 'dreams') render();
      });
    });
  }

  /* =========================================================
     VIEW · Patterns
     ========================================================= */
  function streak() {
    if (!state.dreams.length) return 0;
    const days = new Set(state.dreams.map(d => new Date(d.date).toDateString()));
    let n = 0; const cur = new Date();
    if (!days.has(cur.toDateString())) cur.setDate(cur.getDate() - 1); // today may not be logged yet
    while (days.has(cur.toDateString())) { n++; cur.setDate(cur.getDate() - 1); }
    return n;
  }

  function tally(fn) {
    const map = new Map();
    state.dreams.forEach(d => fn(d).forEach(k => map.set(k, (map.get(k) || 0) + 1)));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }

  function bars(rows, color) {
    if (!rows.length) return '';
    const max = rows[0][1];
    return `<div class="bars">${rows.map(([label, n], i) => `
      <div class="bar" style="--w:${Math.round(n / max * 100)}%;--i:${i};--c:${color}">
        <span class="bar__track" aria-hidden="true"></span>
        <span class="bar__fill" aria-hidden="true"></span>
        <span class="bar__cap" aria-hidden="true"></span>
        <span class="bar__label"><span>${esc(label)}</span></span>
        <span class="bar__value">${n}</span>
      </div>`).join('')}</div>`;
  }

  function viewPatterns() {
    const total = state.dreams.length;
    if (total < 1) {
      return `
        <div class="page-head"><h1 class="page-title">${esc(t('patternsTitle'))}</h1></div>
        <div class="empty">
          <div class="empty__art">${icon('<path d="M4 19V10M10 19V5M16 19v-6M22 19H2"/>')}</div>
          <h2 class="empty__title">${esc(t('patternsEmptyTitle'))}</h2>
          <p class="empty__text">${esc(t('patternsEmptyText'))}</p>
          <a class="btn btn--primary" href="#/new">${icon(I.plus)}${esc(t('emptyCta'))}</a>
        </div>`;
    }

    const now = Date.now();
    const last30 = state.dreams.filter(d => now - new Date(d.date) < 30 * 86400000).length;
    const clarities = state.dreams.map(d => d.clarity).filter(Boolean);
    const avgClarity = clarities.length ? (clarities.reduce((a, b) => a + b, 0) / clarities.length) : 0;
    const lucidPct = Math.round(state.dreams.filter(d => d.lucid).length / total * 100);

    const archRows = tally(d => (d.archetypes || []))
      .map(([id, n]) => { const a = archById(id); return a ? [L(a).name, n] : null; })
      .filter(Boolean).slice(0, 8);
    const symRows = tally(d => (d.symbols || [])).slice(0, 8);
    const moodRows = tally(d => d.mood ? [d.mood] : [])
      .map(([id, n]) => { const m = moodById(id); return m ? [m[state.lang], n] : null; })
      .filter(Boolean);

    const tiles = [
      [total, '', t('statTotal')],
      [last30, '', t('statMonth')],
      [streak(), '', t('statStreak')],
      [avgClarity ? avgClarity.toFixed(1) : '—', avgClarity ? '/5' : '', t('statClarity')],
      [lucidPct, '%', t('statLucid')]
    ].map(([v, suf, label]) => `
      <div class="tile">
        <div class="tile__value">${esc(String(v))}${suf ? `<small>${esc(suf)}</small>` : ''}</div>
        <div class="tile__label">${esc(label)}</div>
      </div>`).join('');

    return `
      <div class="page-head">
        <h1 class="page-title">${esc(t('patternsTitle'))}</h1>
        <p class="page-sub" style="max-width:36ch">${esc(t('patternsSub'))}</p>
      </div>
      <div class="section"><div class="tiles">${tiles}</div></div>
      ${archRows.length ? `<div class="section">
        <h2 class="section__title">${esc(t('topArch'))}</h2>${bars(archRows, 'var(--chart-1)')}</div>` : ''}
      ${symRows.length ? `<div class="section">
        <h2 class="section__title">${esc(t('topSym'))}</h2>${bars(symRows, 'var(--chart-3)')}</div>` : ''}
      ${moodRows.length ? `<div class="section">
        <h2 class="section__title">${esc(t('moodDist'))}</h2>${bars(moodRows, 'var(--chart-2)')}</div>` : ''}
      ${footer()}`;
  }

  /* =========================================================
     VIEW · Guide
     ========================================================= */
  function viewAbout() {
    const sections = (window.GUIDE[state.lang] || window.GUIDE.en).map(s => `
      <section class="section">
        <h2 class="section__title">${esc(s.h)}</h2>
        <div class="prose">
          ${(s.p || []).map(p => `<p>${p}</p>`).join('')}
          ${s.list ? `<ul>${s.list.map(li => `<li>${li}</li>`).join('')}</ul>` : ''}
        </div>
      </section>`).join('');
    return `
      <div class="page-head">
        <h1 class="page-title">${esc(t('aboutTitle'))}</h1>
        <p class="page-sub">${esc(t('aboutSub'))}</p>
      </div>
      <blockquote class="quote">
        ${state.lang === 'tr'
          ? 'Rüya, psişenin en derin ve gizli köşelerine açılan küçük ve gizli bir kapıdır.'
          : 'The dream is a little hidden door in the innermost and most secret recesses of the psyche.'}
        <cite>C. G. Jung, CW 10, §304</cite>
      </blockquote>
      ${sections}
      <div class="privacy-note" style="margin-top:var(--sp-5)">
        ${icon(I.lock)}<span>${esc(t('privacyNote'))}</span>
      </div>
      ${footer()}`;
  }

  function footer() {
    return `<p class="footer-note">Anima · <a href="https://jungianstudiesistanbul.com" target="_blank" rel="noopener">${esc(t('visitSite'))}</a></p>`;
  }

  /* =========================================================
     Settings sheet
     ========================================================= */
  function openSettings() {
    const html = `
      <div class="field">
        <p class="label">${esc(t('theme'))}</p>
        <div class="segmented" role="group" aria-label="${esc(t('theme'))}">
          ${[['system', 'themeSystem'], ['light', 'themeLight'], ['dark', 'themeDark']].map(([v, k]) =>
            `<button type="button" data-theme="${v}" aria-pressed="${state.theme === v}">${esc(t(k))}</button>`).join('')}
        </div>
      </div>
      <div class="field">
        <p class="label">${esc(t('language'))}</p>
        <div class="segmented" role="group" aria-label="${esc(t('language'))}">
          <button type="button" data-lang="tr" aria-pressed="${state.lang === 'tr'}">Türkçe</button>
          <button type="button" data-lang="en" aria-pressed="${state.lang === 'en'}">English</button>
        </div>
      </div>
      <hr class="divider">
      <div class="field">
        <p class="label">${esc(t('dataTitle'))}</p>
        <div style="display:flex;flex-direction:column;gap:var(--sp-2)">
          <button class="btn btn--ghost btn--block" type="button" id="doExport">${esc(t('exportBtn'))}</button>
          <button class="btn btn--ghost btn--block" type="button" id="doImport">${esc(t('importBtn'))}</button>
          <input type="file" id="fileIn" accept="application/json,.json" hidden>
          <button class="btn btn--danger btn--block" type="button" id="doWipe">${esc(t('wipeBtn'))}</button>
        </div>
      </div>
      <div class="privacy-note">${icon(I.lock)}<span>${esc(t('privacyNote'))}</span></div>
      <hr class="divider">
      <div class="prose">
        <h4>${esc(t('aboutApp'))}</h4>
        <p>${esc(t('aboutAppText'))}</p>
        <p><a href="https://jungianstudiesistanbul.com" target="_blank" rel="noopener">${esc(t('visitSite'))}</a></p>
      </div>`;

    openSheet(t('settingsTitle'), html, body => {
      $$('[data-theme]', body).forEach(b => b.addEventListener('click', () => {
        state.theme = b.dataset.theme; save(); applyTheme();
        $$('[data-theme]', body).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      }));
      $$('[data-lang]', body).forEach(b => b.addEventListener('click', () => {
        if (state.lang === b.dataset.lang) return;
        state.lang = b.dataset.lang; save(); applyStaticStrings(); closeSheet(); render();
      }));
      $('#doExport', body).addEventListener('click', doExport);
      $('#doImport', body).addEventListener('click', () => $('#fileIn', body).click());
      $('#fileIn', body).addEventListener('change', e => doImport(e.target.files[0]));
      $('#doWipe', body).addEventListener('click', confirmWipe);
    });
  }

  function doExport() {
    const payload = { app: 'anima', version: 1, exported: new Date().toISOString(), dreams: state.dreams };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `anima-yedek-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast(t('exported'));
  }

  function doImport(file) {
    if (!file) return;
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const data = JSON.parse(fr.result);
        const incoming = Array.isArray(data) ? data : data.dreams;
        if (!Array.isArray(incoming)) throw new Error('shape');
        const known = new Set(state.dreams.map(d => d.id));
        let added = 0;
        incoming.forEach(d => {
          if (!d || typeof d.body !== 'string' || known.has(d.id)) return;
          state.dreams.push(Object.assign(blankDraft(), d, { id: d.id || uid() }));
          added++;
        });
        save(); closeSheet(); render();
        toast(t('imported', added));
      } catch (_) { toast(t('importFailed'), { danger: true }); }
    };
    fr.readAsText(file);
  }

  function confirmWipe() {
    openSheet(t('confirmWipeTitle'), `
      <div class="prose"><p>${esc(t('confirmWipeText'))}</p></div>
      <div style="display:flex;flex-direction:column;gap:var(--sp-2);margin-top:var(--sp-4)">
        <button class="btn btn--danger btn--block" type="button" id="yesWipe">${esc(t('wipeConfirmBtn'))}</button>
        <button class="btn btn--ghost btn--block" type="button" id="noWipe">${esc(t('cancel'))}</button>
      </div>`, body => {
      $('#noWipe', body).addEventListener('click', closeSheet);
      $('#yesWipe', body).addEventListener('click', () => {
        state.dreams = []; save(); localStorage.removeItem(DRAFT_KEY);
        closeSheet(); go('/dreams'); render(); toast(t('wiped'), { danger: true });
      });
    });
  }

  function confirmDelete(id) {
    openSheet(t('confirmDeleteTitle'), `
      <div class="prose"><p>${esc(t('confirmDeleteText'))}</p></div>
      <div style="display:flex;flex-direction:column;gap:var(--sp-2);margin-top:var(--sp-4)">
        <button class="btn btn--danger btn--block" type="button" id="yesDel">${esc(t('delete'))}</button>
        <button class="btn btn--ghost btn--block" type="button" id="noDel">${esc(t('cancel'))}</button>
      </div>`, body => {
      $('#noDel', body).addEventListener('click', closeSheet);
      $('#yesDel', body).addEventListener('click', () => {
        const i = state.dreams.findIndex(d => d.id === id);
        if (i < 0) return closeSheet();
        lastDeleted = { dream: state.dreams[i], index: i };
        state.dreams.splice(i, 1); save();
        closeSheet(); go('/dreams'); render();
        toast(t('deleted'), {
          danger: true,
          action: { label: t('undo'), run: () => {
            if (!lastDeleted) return;
            state.dreams.splice(lastDeleted.index, 0, lastDeleted.dream);
            lastDeleted = null; save(); render();
          } }
        });
      });
    });
  }

  /* =========================================================
     Mount handlers (event wiring per view)
     ========================================================= */
  const mounts = {
    dreams(root) {
      const q = $('#q', root);
      if (q) {
        let tmr;
        q.addEventListener('input', () => {
          clearTimeout(tmr);
          tmr = setTimeout(() => {
            query = q.value;
            const pos = q.selectionStart;
            render();
            const nq = $('#q');
            if (nq) { nq.focus(); nq.setSelectionRange(pos, pos); }
          }, 220);
        });
      }
      const c = $('#clearQ', root);
      if (c) c.addEventListener('click', () => { query = ''; render(); });
    },

    dream(root, id) {
      const back = $('#backBtn', root), del = $('#delBtn', root);
      if (!back || !del) return; // dream not found — nothing to wire
      back.addEventListener('click', () => history.length > 1 ? history.back() : go('/dreams'));
      del.addEventListener('click', () => confirmDelete(id));
      $$('[data-arch]', root).forEach(b => b.addEventListener('click', () => openLexEntry('arch', b.dataset.arch)));
      $$('[data-sym]', root).forEach(b => b.addEventListener('click', () => {
        const s = symByName(b.dataset.sym);
        if (s) openLexEntry('sym', s.id);
        else { query = b.dataset.sym; go('/dreams'); }
      }));
    },

    new(root) { mountCapture(root); },
    edit(root) { mountCapture(root); },

    symbols(root) {
      $$('[data-lextab]', root).forEach(b => b.addEventListener('click', () => { lexTab = b.dataset.lextab; render(); }));
      const lq = $('#lq', root);
      let tmr;
      lq.addEventListener('input', () => {
        clearTimeout(tmr);
        tmr = setTimeout(() => {
          lexQuery = lq.value; const pos = lq.selectionStart; render();
          const n = $('#lq'); if (n) { n.focus(); n.setSelectionRange(pos, pos); }
        }, 220);
      });
      $$('[data-lex]', root).forEach(b => b.addEventListener('click', () => {
        const [kind, id] = b.dataset.lex.split(':');
        openLexEntry(kind, id);
      }));
    }
  };

  function mountCapture(root) {
    const form = $('#capture', root);

    // step 1
    const body = $('#fBody', form);
    if (body) {
      body.addEventListener('input', () => { draft.body = body.value; persistDraft(); });
      if (!body.value) body.focus({ preventScroll: true });
    }

    // step 2
    $$('[data-mood]', form).forEach(b => b.addEventListener('click', () => {
      draft.mood = draft.mood === b.dataset.mood ? '' : b.dataset.mood;
      $$('[data-mood]', form).forEach(x => x.setAttribute('aria-pressed', String(x.dataset.mood === draft.mood)));
      persistDraft();
    }));
    $$('[data-clarity]', form).forEach(b => b.addEventListener('click', () => {
      draft.clarity = Number(b.dataset.clarity);
      $$('[data-clarity]', form).forEach(x => x.setAttribute('aria-pressed', String(Number(x.dataset.clarity) === draft.clarity)));
      persistDraft();
    }));
    $$('[data-flag]', form).forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.flag;
      draft[k] = !draft[k];
      b.setAttribute('aria-checked', String(draft[k]));
      persistDraft();
    }));

    // step 3
    const toggleArch = el => {
      const id = el.dataset.archToggle;
      const i = draft.archetypes.indexOf(id);
      if (i >= 0) draft.archetypes.splice(i, 1); else draft.archetypes.push(id);
      el.setAttribute('aria-pressed', String(i < 0));
      persistDraft();
    };
    $$('[data-arch-toggle]', form).forEach(el => {
      el.addEventListener('click', e => { if (e.target.closest('[data-arch-info]')) return; toggleArch(el); });
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleArch(el); }
      });
    });
    $$('[data-arch-info]', form).forEach(b => b.addEventListener('click', e => {
      e.stopPropagation(); openLexEntry('arch', b.dataset.archInfo);
    }));

    // step 4
    const symIn = $('#symIn', form);
    if (symIn) {
      const addSym = raw => {
        const v = raw.trim().replace(/\s+/g, ' ');
        if (!v) return;
        const known = symByName(v);
        const value = known ? L(known).name : v;
        if (!draft.symbols.some(s => s.toLocaleLowerCase(state.lang) === value.toLocaleLowerCase(state.lang))) {
          draft.symbols.push(value);
        }
        persistDraft(); render();
        setTimeout(() => { const el = $('#symIn'); if (el) el.focus(); }, 0);
      };
      symIn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSym(symIn.value); symIn.value = ''; }
        else if (e.key === 'Backspace' && !symIn.value && draft.symbols.length) {
          draft.symbols.pop(); persistDraft(); render();
          setTimeout(() => { const el = $('#symIn'); if (el) el.focus(); }, 0);
        }
      });
      // Deferred: re-rendering inside a blur dispatch tears out the node being blurred.
      symIn.addEventListener('blur', () => {
        const pending = symIn.value.trim();
        if (!pending) return;
        symIn.value = '';
        setTimeout(() => addSym(pending), 0);
      });
      $$('[data-rmsym]', form).forEach(b => b.addEventListener('click', () => {
        draft.symbols = draft.symbols.filter(s => s !== b.dataset.rmsym);
        persistDraft(); render();
      }));
      $$('[data-addsym]', form).forEach(b => b.addEventListener('click', () => addSym(b.dataset.addsym)));
    }

    // step 5
    $$('[data-ans]', form).forEach(ta => ta.addEventListener('input', () => { collectStep(form); }));

    // navigation
    const prev = $('#prevStep', root);
    if (prev) prev.addEventListener('click', () => { collectStep(form); step--; render(); });

    $('#nextStep', root).addEventListener('click', () => {
      collectStep(form);
      if (step === 0 && draft.body.trim().length < 3) {
        const err = $('#bodyErr', form);
        err.innerHTML = `<p class="err">${icon(I.alert)}<span>${esc(t('bodyRequired'))}</span></p>`;
        const b = $('#fBody', form);
        b.setAttribute('aria-invalid', 'true');
        b.focus();
        return;
      }
      if (step < STEPS.length - 1) { step++; render(); }
      else commit();
    });

    form.addEventListener('submit', e => e.preventDefault());
  }

  /* =========================================================
     Boot
     ========================================================= */
  $('#btnSettings').addEventListener('click', openSettings);

  window.addEventListener('hashchange', () => {
    const r = route();
    if (r.name !== 'new' && r.name !== 'edit') { draft = null; step = 0; }
    render();
  });

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      $('#appbar').classList.toggle('is-scrolled', window.scrollY > 4);
      ticking = false;
    });
  }, { passive: true });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }

  applyTheme();
  applyStaticStrings();
  if (!location.hash) location.replace('#/dreams');
  render();
})();
