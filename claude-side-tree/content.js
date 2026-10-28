// Claude Side Tree: a panel on the right of claude.ai.
//
//  - the files this conversation touched, as a tree, flashing when Claude
//    reads, writes or edits one,
//  - how long the thread has been idle and roughly how big it is,
//  - hints for writing a prompt, from Anthropic's own prompting pages.
//
// Everything is read from the page that is already on screen. Nothing is sent
// anywhere, and the only thing stored is this panel's own state, under keys
// beginning "cst:" in the page's localStorage.
//
// What it can and cannot know: a tool call is recognised from the text the
// transcript shows, such as "Edit(src/app.ts)". So the tree is as good as that
// text. It never sees your filesystem, the real token count or the real cache.
(() => {
  'use strict';
  if (window.__cstLoaded) return;
  window.__cstLoaded = true;

  // --- the look, shared with the cc-combo mod ------------------------------

  const PALETTE = {
    dark: { accent: '#D97757', success: '#5FBF8F', warning: '#E5C07B', danger: '#E06C75', info: '#61AFEF', muted: '#8A8F98' },
    light: { accent: '#B8532F', success: '#1E7B4F', warning: '#8A5A00', danger: '#B42318', info: '#1E4FA3', muted: '#5B6270' },
  };

  const KINDS = {
    read: { color: 'info', glyph: '◦', label: 'czytany' },
    edit: { color: 'accent', glyph: '●', label: 'edytowany' },
    write: { color: 'success', glyph: '✚', label: 'utworzony' },
    mention: { color: 'muted', glyph: '·', label: 'wspomniany' },
  };

  // --- state ---------------------------------------------------------------

  const files = new Map(); // path -> { path, kind, kinds:Set, lastTs, count }
  let lastActivity = Date.now();
  let chars = 0;
  let convoKey = location.pathname;
  let collapsed = load('collapsed', '0') === '1';
  const showMentions = true; // mentions are always shown
  let tab = load('tab', 'files');
  let follow = load('follow', '1') === '1';
  let closedDirs = new Set((() => { try { return JSON.parse(load('closed', '[]')); } catch { return []; } })());
  let width = Math.min(460, Math.max(220, parseInt(load('width', '300'), 10) || 300));

  function load(k, d) { try { return localStorage.getItem('cst:' + k) ?? d; } catch { return d; } }
  function save(k, v) { try { localStorage.setItem('cst:' + k, String(v)); } catch { /* private mode */ } }

  // --- reading file names out of the transcript ----------------------------

  const VERB_KIND = {
    read: 'read', grep: 'read', glob: 'read', search: 'read', cat: 'read',
    write: 'write', create: 'write',
    edit: 'edit', multiedit: 'edit', update: 'edit', notebookedit: 'edit',
  };
  const CALL_RE = /\b(Read|Write|Edit|MultiEdit|Update|Create|NotebookEdit|Glob|Grep|Search)\s*\(\s*([^)\n]{1,240}?)\s*\)/g;
  // A path: either something with a separator, or a bare name with an extension.
  const PATH_RE = /(?:[A-Za-z]:)?[\w.@~+-]*(?:[\\/][\w.@+-]+)+|\b[\w@+-]+(?:\.[\w+-]+)*\.[A-Za-z][A-Za-z0-9]{0,7}\b/;
  // Endings that are almost always a domain or a version, not a file here.
  const NOT_FILES = new Set(['com', 'org', 'net', 'ai', 'io', 'co', 'gov', 'edu', 'pl', 'html5']);

  function cleanPath(raw) {
    if (!raw) return null;
    let p = raw.trim().replace(/^["'`<(]+|["'`>),.;:]+$/g, '');
    p = p.replace(/:\d+(?::\d+)?$/, ''); // file.ts:12:4
    if (!p || /^https?:\/\//i.test(p) || p.includes('://')) return null;
    p = p.replace(/\\/g, '/').replace(/\/{2,}/g, '/').replace(/^\.\//, '');
    if (p.length > 200 || p.length < 3) return null;
    if (!/[A-Za-z]/.test(p)) return null;
    const name = p.split('/').pop() || '';
    const ext = name.includes('.') ? name.split('.').pop().toLowerCase() : '';
    if (!p.includes('/')) {
      // A bare word: only a real-looking extension makes it a file.
      if (!ext || NOT_FILES.has(ext) || !/^[a-z][a-z0-9]{0,7}$/.test(ext)) return null;
      if (/^\d+$/.test(name.split('.')[0])) return null;
    }
    return p;
  }

  function touch(path, kind, ts) {
    if (!path) return false;
    let f = files.get(path);
    if (!f) {
      f = { path, kind, kinds: new Set(), lastTs: 0, count: 0 };
      files.set(path, f);
    }
    f.kinds.add(kind);
    // A file that was ever written or edited keeps that as its colour.
    const rank = { mention: 0, read: 1, edit: 2, write: 3 };
    if (rank[kind] >= rank[f.kind]) f.kind = kind;
    f.lastTs = ts;
    f.count++;
    return true;
  }

  // Pulls every file mention out of one lump of text. `live` means the text
  // just appeared, so what it finds is new activity worth flashing.
  function scanText(text, live) {
    if (!text || text.length > 400000) return false;
    let found = false;
    // A first scan of a conversation already on screen is history, not
    // activity: timestamp 0 means no flash and no "touched just now" mark.
    const ts = live ? Date.now() : 0;
    const inCall = new Set();
    let m;
    CALL_RE.lastIndex = 0;
    while ((m = CALL_RE.exec(text)) !== null) {
      const kind = VERB_KIND[m[1].toLowerCase()] || 'read';
      const hit = PATH_RE.exec(m[2]);
      const path = cleanPath(hit && hit[0]);
      if (!path) continue;
      inCall.add(path);
      const f = files.get(path);
      // Within a second the same call is the same event, not a new one.
      const isNew = !f || !f.kinds.has(kind) || ts - f.lastTs > 1200;
      if (touch(path, kind, isNew ? ts : (f ? f.lastTs : ts)) && isNew) found = true;
    }
    if (showMentions) {
      const words = text.match(new RegExp(PATH_RE.source, 'g')) || [];
      for (const w of words.slice(0, 400)) {
        const path = cleanPath(w);
        if (path && !inCall.has(path) && !files.has(path)) {
          touch(path, 'mention', 0);
          found = true;
        }
      }
    }
    // A tool call is activity however short it is; otherwise it takes a
    // sentence, so that the interface's own little updates do not count.
    if (live && (found || text.trim().length > 40)) lastActivity = Date.now();
    return found;
  }

  function root() {
    return document.querySelector('main') || document.body;
  }

  function fullScan() {
    const t = root().textContent || '';
    chars = t.length;
    scanText(t, false);
  }

  // --- the panel -----------------------------------------------------------

  const el = (tag, props = {}, kids = []) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
      else if (v !== null && v !== undefined) n.setAttribute(k, v);
    }
    for (const kid of [].concat(kids)) if (kid) n.appendChild(kid);
    return n;
  };

  function isLight() {
    const bg = getComputedStyle(document.body).backgroundColor || '';
    const m = bg.match(/\d+/g);
    if (m && m.length >= 3) return (+m[0] * 299 + +m[1] * 587 + +m[2] * 114) / 1000 > 140;
    return !window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  let ui = null;
  const rowEls = new Map();
  let lastSig = '';
  const seenTs = new Map();

  function build() {
    const rootEl = el('div', { id: 'cst-root' });
    const tabBtn = el('button', { class: 'cst-tab', title: 'Claude Side Tree', onclick: () => setCollapsed(false) }, [el('span', { text: '◧' })]);
    const meter = el('div', { class: 'cst-meter' });
    const tabs = el('nav', { class: 'cst-tabs' }, [
      el('button', { class: 'cst-tabbtn', 'data-tab': 'files', text: 'Pliki', onclick: () => setTab('files') }),
      el('button', { class: 'cst-tabbtn', 'data-tab': 'prompt', text: 'Podpowiedzi', onclick: () => setTab('prompt') }),
    ]);
    const body = el('div', { class: 'cst-body' });
    const grip = el('div', { class: 'cst-grip', title: 'Przeciagnij, by zmienic szerokosc' });
    const panel = el('aside', { class: 'cst-panel' }, [grip, meter, tabs, body]);
    rootEl.appendChild(tabBtn);
    rootEl.appendChild(panel);
    document.body.appendChild(rootEl);
    dragToResize(grip);
    return { rootEl, panel, meter, body, tabs };
  }

  function dragToResize(grip) {
    let startX = 0, startW = 0, dragging = false;
    grip.addEventListener('mousedown', e => { dragging = true; startX = e.clientX; startW = width; e.preventDefault(); });
    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      width = Math.min(460, Math.max(220, startW + (startX - e.clientX)));
      ui.rootEl.style.setProperty('--cst-w', width + 'px');
    });
    window.addEventListener('mouseup', () => { if (dragging) { dragging = false; save('width', width); } });
  }

  function setCollapsed(v) { collapsed = v; save('collapsed', v ? '1' : '0'); paint(); }
  function setTab(v) { tab = v; save('tab', v); paint(); }

  // --- the files tab -------------------------------------------------------

  function commonDir(paths) {
    if (paths.length === 0) return '';
    const split = paths.map(p => p.split('/').slice(0, -1));
    let pre = split[0];
    for (const parts of split.slice(1)) {
      let i = 0;
      while (i < pre.length && i < parts.length && pre[i] === parts[i]) i++;
      pre = pre.slice(0, i);
      if (pre.length === 0) break;
    }
    return pre.join('/');
  }

  function treeOf(paths, prefix) {
    const rootNode = { name: '', dirs: new Map(), files: [] };
    for (const p of paths) {
      const rel = prefix && p.startsWith(prefix + '/') ? p.slice(prefix.length + 1) : p;
      const parts = rel.split('/');
      let node = rootNode;
      for (const part of parts.slice(0, -1)) {
        if (!node.dirs.has(part)) node.dirs.set(part, { name: part, dirs: new Map(), files: [] });
        node = node.dirs.get(part);
      }
      node.files.push({ name: parts[parts.length - 1], path: p });
    }
    return rootNode;
  }

  // The last place in the transcript that names this file, preferring a tool
  // call such as "Edit(path)" over a plain mention. Paths are compared with
  // forward slashes, the way the tree stores them.
  function lastPlaceOf(path) {
    const walker = document.createTreeWalker(root(), NodeFilter.SHOW_TEXT);
    let call = null;
    let any = null;
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const el0 = n.parentElement;
      if (!el0 || el0.closest('#cst-root')) continue;
      const text = n.nodeValue.replace(/\\/g, '/');
      if (!text.includes(path)) continue;
      any = el0;
      CALL_RE.lastIndex = 0;
      let m;
      while ((m = CALL_RE.exec(text)) !== null) {
        if (m[2].replace(/\\/g, '/').includes(path)) { call = el0; break; }
      }
    }
    return call || any;
  }

  function jumpTo(path) {
    const target = lastPlaceOf(path);
    if (!target) return;
    target.scrollIntoView({ block: 'center' });
    target.classList.remove('cst-jump');
    void target.offsetWidth;
    target.classList.add('cst-jump');
    setTimeout(() => target.classList.remove('cst-jump'), 2000);
  }

  function rowsOf(node, depth, out, key = '') {
    for (const dir of [...node.dirs.values()].sort((a, b) => a.name.localeCompare(b.name))) {
      const dirKey = key + '/' + dir.name;
      out.push({ kind: 'dir', name: dir.name, depth, key: dirKey });
      rowsOf(dir, depth + 1, out, dirKey);
    }
    for (const f of node.files.sort((a, b) => a.name.localeCompare(b.name))) {
      out.push({ kind: 'file', name: f.name, path: f.path, depth });
    }
    return out;
  }

  function renderFiles(body) {
    const list = [...files.values()].filter(f => showMentions || f.kind !== 'mention');
    const paths = list.map(f => f.path);
    const sig = paths.slice().sort().join('|') + '#' + showMentions + '#' + [...closedDirs].sort().join('|');

    if (sig !== lastSig) {
      lastSig = sig;
      rowEls.clear();
      body.textContent = '';
      const bar = el('div', { class: 'cst-opts' }, [
        optBtn('podazaj', follow, (e) => {
          follow = !follow;
          save('follow', follow ? '1' : '0');
          // The bar is only rebuilt when the file list changes, so flip the look here.
          e.currentTarget.classList.toggle('cst-on', follow);
          if (follow) {
            let last = null;
            for (const f of files.values()) {
              const r = rowEls.get(f.path);
              if (r && f.lastTs && (!last || f.lastTs > last.ts)) last = { ts: f.lastTs, row: r };
            }
            if (last) last.row.scrollIntoView({ block: 'center' });
          }
        }),
        el('span', { class: 'cst-count', text: paths.length ? `${paths.length} plik(ow)` : '' }),
      ]);
      body.appendChild(bar);

      if (paths.length === 0) {
        body.appendChild(el('p', { class: 'cst-empty', text: 'Nic jeszcze nie widac. Drzewko zapelnia sie, gdy w rozmowie pojawi sie wywolanie na pliku, na przyklad Edit(src/app.ts).' }));
        return;
      }
      const prefix = commonDir(paths);
      if (prefix) body.appendChild(el('div', { class: 'cst-root-line', text: prefix, title: prefix }));
      const tree = el('div', { class: 'cst-tree' });
      let hideBelow = Infinity; // depth of a closed folder whose contents are skipped
      for (const row of rowsOf(treeOf(paths, prefix), 0, [])) {
        if (row.depth > hideBelow) continue;
        hideBelow = Infinity;
        if (row.kind === 'dir') {
          const closed = closedDirs.has(row.key);
          if (closed) hideBelow = row.depth;
          tree.appendChild(el('div', {
            class: 'cst-row cst-dir', style: `padding-left:${6 + row.depth * 12}px`,
          }, [
            // Only the triangle folds and unfolds the folder.
            el('span', {
              class: 'cst-glyph cst-fold', text: closed ? '▸' : '▾', title: closed ? 'Rozwin' : 'Zwin',
              onclick: () => {
                if (closedDirs.has(row.key)) closedDirs.delete(row.key); else closedDirs.add(row.key);
                save('closed', JSON.stringify([...closedDirs]));
                paint();
              },
            }),
            el('span', { class: 'cst-name', text: row.name }),
          ]));
        } else {
          const r = el('div', { class: 'cst-row cst-file', style: `padding-left:${6 + row.depth * 12}px`, title: row.path, onclick: () => jumpTo(row.path) }, [
            el('span', { class: 'cst-glyph' }),
            el('span', { class: 'cst-name', text: row.name }),
            el('span', { class: 'cst-badge' }),
          ]);
          rowEls.set(row.path, r);
          tree.appendChild(r);
        }
      }
      body.appendChild(tree);
    }

    // Always refresh what each row shows: colour, glyph, and a flash when the
    // file was touched since the last paint.
    const now = Date.now();
    let newest = null;
    for (const f of list) {
      const r = rowEls.get(f.path);
      if (!r) continue;
      const kind = KINDS[f.kind] || KINDS.read;
      r.setAttribute('data-kind', f.kind);
      r.querySelector('.cst-glyph').textContent = kind.glyph;
      r.querySelector('.cst-badge').textContent = f.count > 1 ? String(f.count) : '';
      r.title = `${f.path}\n${[...f.kinds].map(k => (KINDS[k] || {}).label || k).join(', ')}`;
      if (f.lastTs && seenTs.get(f.path) !== f.lastTs) {
        seenTs.set(f.path, f.lastTs);
        r.classList.remove('cst-flash');
        void r.offsetWidth; // restart the animation on a row that stayed
        r.classList.add('cst-flash');
        if (!newest || f.lastTs > newest.ts) newest = { ts: f.lastTs, row: r };
      }
      r.classList.toggle('cst-recent', !!f.lastTs && now - f.lastTs < 8000);
    }
    if (newest && follow) newest.row.scrollIntoView({ block: 'nearest' });
  }

  function optBtn(label, on, onclick) {
    return el('button', { class: 'cst-opt' + (on ? ' cst-on' : ''), text: label, onclick });
  }

  // --- the meter, in the spirit of cache-tax -------------------------------

  function fmtDur(ms) {
    const s = Math.round(ms / 1000);
    if (s < 60) return s + 's';
    const m = Math.round(s / 60);
    if (m < 60) return m + 'm';
    const h = Math.floor(m / 60);
    return `${h}h${String(m % 60).padStart(2, '0')}`;
  }

  // The last checklist in the transcript: "- [x] a", "☑ a", "✓ a" are done and
  // "- [ ] a", "☐ a" are open. Only what is written on the page counts, so a
  // thread without such a list shows no bar rather than an invented percent.
  const TASK_LINE = /^\s*(?:[-*]\s*)?(\[[xX ]\]|[☑✔✓✅☒☐□◻⬜])\s+\S/;
  const TASK_DONE = /^\s*(?:[-*]\s*)?(\[[xX]\]|[☑✔✓✅☒])/;
  let taskCache = { at: 0, value: null };

  function taskProgress() {
    const now = Date.now();
    if (now - taskCache.at < 1500) return taskCache.value;
    const lines = (root().innerText || '').split('\n');
    let run = [];
    let last = [];
    for (const line of lines) {
      if (TASK_LINE.test(line)) run.push(TASK_DONE.test(line));
      else if (line.trim() !== '') { if (run.length) last = run; run = []; }
    }
    if (run.length) last = run;
    const value = last.length >= 2 ? { done: last.filter(Boolean).length, total: last.length } : null;
    taskCache = { at: now, value };
    return value;
  }

  function renderMeter(meter) {
    const idle = Date.now() - lastActivity;
    const tok = Math.round(chars / 3.8);
    const state = idle < 5 * 60e3 ? ['swieze', 'success'] : idle < 60 * 60e3 ? ['moze byc zimne', 'warning'] : ['najpewniej zimne', 'danger'];
    meter.textContent = '';
    meter.title = 'Szacunki liczone z tego, co widac na stronie: wielkosc watku z dlugosci tekstu, a stan cache wylacznie z czasu bezczynnosci. Rozszerzenie nie widzi prawdziwego cache ani prawdziwej liczby tokenow.';
    meter.appendChild(el('span', { class: 'cst-dot', 'data-tone': state[1], text: '●' }));
    meter.appendChild(el('span', { class: 'cst-m-main', text: `watek ≈ ${tok > 1000 ? Math.round(tok / 1000) + 'k' : tok} tok` }));
    meter.appendChild(el('span', { class: 'cst-m-sub', text: `bezczynnosc ${fmtDur(idle)} · ${state[0]}` }));
    meter.appendChild(el('button', { class: 'cst-x', title: 'Zwin panel', text: '×', onclick: e => { e.stopPropagation(); setCollapsed(true); } }));
    const tp = taskProgress();
    if (tp) {
      const pct = Math.round((tp.done / tp.total) * 100);
      const bar = el('span', { class: 'cst-prog', title: 'Z ostatniej listy zadan widocznej w rozmowie (pola [x] / [ ], ☑ / ☐).' }, [
        el('span', { class: 'cst-prog-track' }, [el('span', { class: 'cst-prog-fill', style: `width:${pct}%` })]),
      ]);
      bar.title = `${tp.done}/${tp.total} · ${pct}%`;
      bar.setAttribute('data-done', tp.done === tp.total ? '1' : '0');
      meter.appendChild(bar);
    }
  }

  // --- the prompt tab ------------------------------------------------------
  // Write the prompt in the message box as usual. Each row below says what a
  // good prompt tends to contain and goes grey-to-green when your draft has it.
  // A row that is still missing shows why it helps, and a click puts an example
  // into the box. The ticks are guesses from your words, not a verdict.

  function composer() {
    const nodes = [...document.querySelectorAll('div[contenteditable="true"], textarea')];
    return nodes.find(n => n.offsetParent !== null && !n.closest('#cst-root')) || null;
  }

  function draftText() {
    const c = composer();
    if (!c) return '';
    return (c.value !== undefined ? c.value : c.innerText) || '';
  }

  function insertPrompt(text) {
    const c = composer();
    if (c && c.value !== undefined) {
      c.value = c.value ? c.value + '\n' + text : text;
      c.dispatchEvent(new Event('input', { bubbles: true }));
      c.focus();
      return 'wstawione';
    }
    if (c) {
      c.focus();
      const ok = document.execCommand && document.execCommand('insertText', false, text);
      if (ok) return 'wstawione';
    }
    navigator.clipboard?.writeText(text);
    return 'skopiowane';
  }

  function flashDone(node, how) {
    node.setAttribute('data-done', how);
    setTimeout(() => node.removeAttribute('data-done'), 1600);
  }

  let promptBoxes = null;

  function renderPrompt(body) {
    if (!promptBoxes) {
      body.textContent = '';
      body.appendChild(el('p', { class: 'cst-lead', text: 'Pisz prompt w polu wiadomosci. Tutaj widac, czego jeszcze w nim brakuje.' }));
      const checks = el('div', { class: 'cst-checks' });
      const rows = new Map();
      for (const p of CST_DOCS.patterns) {
        const r = el('button', { class: 'cst-check', title: 'Kliknij, by wstawic przyklad do pola', onclick: ev => {
          if (r.classList.contains('cst-ok')) return;
          flashDone(r, insertPrompt(p.example));
        } }, [
          el('span', { class: 'cst-tick', text: '○' }),
          el('span', { class: 'cst-check-text' }, [
            el('span', { class: 'cst-check-label', text: p.label }),
            el('span', { class: 'cst-check-hint', text: p.hint }),
          ]),
        ]);
        rows.set(p.id, r);
        checks.appendChild(r);
      }
      body.appendChild(checks);
      body.appendChild(el('p', { class: 'cst-note', text: 'Odhaczenia licze ze slow w Twoim tekscie, wiec to podpowiedz, a nie ocena.' }));

      const starters = el('div', { class: 'cst-starters' });
      starters.appendChild(el('h4', { text: 'Gotowe prompty' }));
      starters.appendChild(el('p', { class: 'cst-note', text: 'Kliknij, a trafi do pola wiadomosci.' }));
      for (const s of CST_DOCS.starters) {
        starters.appendChild(el('button', {
          class: 'cst-starter', title: s.text,
          onclick: ev => flashDone(ev.currentTarget, insertPrompt(s.text)),
        }, [el('span', { text: s.label })]));
      }
      body.appendChild(starters);

      const pr = el('details', { class: 'cst-principles' }, [el('summary', { text: 'Zasady z dokumentacji' })]);
      for (const [t, d] of CST_DOCS.principles) {
        pr.appendChild(el('div', { class: 'cst-principle' }, [el('b', { text: t }), el('span', { text: ' ' + d })]));
      }
      body.appendChild(pr);
      promptBoxes = rows;
    }
    // The checks are written without Polish diacritics, so the draft is
    // stripped of them before testing.
    const draft = draftText()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/ł/g, 'l').replace(/Ł/g, 'L');
    for (const p of CST_DOCS.patterns) {
      const row = promptBoxes.get(p.id);
      let ok = false;
      try { ok = draft.trim() ? !!p.test(draft) : false; } catch { ok = false; }
      row.classList.toggle('cst-ok', ok);
      row.querySelector('.cst-tick').textContent = ok ? '●' : '○';
    }
  }
  // --- painting ------------------------------------------------------------

  let painting = 0;
  function paint() {
    if (painting) return;
    // A timer, not requestAnimationFrame: a background tab never gets a frame,
    // and the panel has to be there the moment the tab comes forward.
    painting = setTimeout(() => {
      painting = 0;
      try { paintNow(); } catch (err) { console.warn('[side-tree]', err); }
    }, 60);
  }

  function paintNow() {
    if (!ui) ui = build();
    const light = isLight();
    const pal = PALETTE[light ? 'light' : 'dark'];
    for (const [k, v] of Object.entries(pal)) ui.rootEl.style.setProperty('--cst-' + k, v);
    ui.rootEl.style.setProperty('--cst-w', width + 'px');
    ui.rootEl.setAttribute('data-theme', light ? 'light' : 'dark');
    ui.rootEl.setAttribute('data-collapsed', collapsed ? '1' : '0');
    if (collapsed) return;
    for (const b of ui.tabs.querySelectorAll('.cst-tabbtn')) b.classList.toggle('cst-on', b.getAttribute('data-tab') === tab);
    renderMeter(ui.meter);
    if (tab !== ui.body.getAttribute('data-tab')) {
      ui.body.setAttribute('data-tab', tab);
      ui.body.textContent = '';
      lastSig = '';
      rowEls.clear();
      promptBoxes = null;
    }
    if (tab === 'files') renderFiles(ui.body);
    else renderPrompt(ui.body);
  }

  // --- watching the page ---------------------------------------------------

  function reset() {
    files.clear();
    rowEls.clear();
    seenTs.clear();
    lastSig = '';
    chars = 0;
    lastActivity = Date.now();
    if (ui) ui.body.textContent = '';
    fullScan();
    paint();
  }

  const observer = new MutationObserver(records => {
    try {
      let dirty = false;
      for (const rec of records) {
        if (rec.target && rec.target.closest && rec.target.closest('#cst-root')) continue;
        if (rec.type === 'characterData') {
          const parent = rec.target.parentElement;
          if (parent) dirty = scanText(parent.textContent, true) || dirty;
        }
        for (const node of rec.addedNodes) {
          if (node.nodeType === 3) dirty = scanText(node.textContent, true) || dirty;
          else if (node.nodeType === 1 && !node.closest('#cst-root')) {
            chars += (node.textContent || '').length;
            dirty = scanText(node.textContent, true) || dirty;
          }
        }
      }
      if (dirty) paint();
    } catch (err) { console.warn('[side-tree]', err); }
  });

  function start() {
    fullScan();
    paint();
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    // The idle figure moves on its own, and a flash has to fade.
    setInterval(() => { if (!collapsed) paint(); }, 1000);
    // claude.ai swaps conversations without reloading.
    setInterval(() => {
      if (location.pathname !== convoKey) { convoKey = location.pathname; reset(); }
    }, 1000);
    // The size estimate drifts as text streams in; re-measure now and then.
    setInterval(() => { chars = (root().textContent || '').length; }, 20000);
    // The checklist ticks while you type.
    document.addEventListener('input', () => { if (tab === 'prompt' && !collapsed) paint(); }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
