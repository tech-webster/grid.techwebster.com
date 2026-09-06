/* GRIDVILLE game logic. Depends on levels.js (GRIDVILLE_LEVELS) and engine.js (GridEngine). */
(function () {
  'use strict';

  var LEVELS = window.GRIDVILLE_LEVELS;
  var E = window.GridEngine;
  var PALETTE = ['#ffd166', '#06d6a0', '#118ab2', '#ef476f', '#8338ec', '#fb5607', '#3a86ff', '#ffbe0b', '#2ec4b6', '#e71d36'];
  var SAVE_KEY = 'gridville-v1';

  function svgInner(paths) {
    return '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';
  }
  var ICON_PATHS = {
    shop: '<path d="M5 12L7 5h18l2 7"/><path d="M6 12h20v13H6z"/><path d="M13 25v-6h6v6"/>',
    cup: '<path d="M8 12h13v7a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z"/><path d="M21 14h2a3 3 0 0 1 0 6h-2"/><path d="M11 8c0-2 2-2 2-4M16 8c0-2 2-2 2-4"/>',
    burger: '<path d="M7 13a9 6 0 0 1 18 0"/><path d="M6 13h20"/><path d="M6 18h20"/><path d="M7 18c0 4 4 7 9 7s9-3 9-7"/>',
    house: '<path d="M6 16l10-9 10 9"/><path d="M9 15v10h14V15"/><path d="M14 25v-6h4v6"/>',
    tower: '<rect x="11" y="4" width="10" height="24"/><path d="M14 8h1M17 8h1M14 12h1M17 12h1M14 16h1M17 16h1M14 20h4"/>',
    tree: '<circle cx="16" cy="12" r="7"/><path d="M16 19v9M12 28h8"/>',
    ticket: '<path d="M6 11h20v5a2 2 0 0 0 0 4v5H6v-5a2 2 0 0 0 0-4z"/><path d="M20 11v14" stroke-dasharray="2 2"/>',
    hotdog: '<path d="M5 21c2 2 6 3 11 3s9-1 11-3l-2-3c-2 2-5 3-9 3s-7-1-9-3z"/><path d="M8 16c3-2 13-2 16 0"/><path d="M12 14c1-1 2-1 2-1M17 13c1 0 2 0 3 1"/>',
    cone: '<path d="M10 14h12l-6 14z"/><path d="M10 14c0-4 3-7 6-7s6 3 6 7"/><path d="M13 18l3 3M19 18l-3 3"/>',
    gift: '<rect x="8" y="13" width="16" height="13"/><path d="M6 9h20v4H6zM16 9v17"/><path d="M16 9c-4 0-6-2-6-4a2 2 0 0 1 4 0M16 9c4 0 6-2 6-4a2 2 0 0 0-4 0"/>',
    hotel: '<rect x="7" y="6" width="18" height="20"/><path d="M7 12h18"/><path d="M11 9h2M15 9h2M19 9h2"/><path d="M13 26v-6h6v6"/>',
    book: '<path d="M8 5h11a3 3 0 0 1 3 3v18H11a3 3 0 0 1-3-3z"/><path d="M8 23a3 3 0 0 1 3-3h11"/>',
    flower: '<circle cx="16" cy="12" r="2.5"/><circle cx="16" cy="6" r="2.5"/><circle cx="22" cy="12" r="2.5"/><circle cx="16" cy="18" r="2.5"/><circle cx="10" cy="12" r="2.5"/><path d="M16 20v8"/>',
    building: '<rect x="9" y="7" width="14" height="19"/><path d="M9 12h14M14 12v14M19 12v14M9 17h14M9 22h14"/>',
    film: '<rect x="6" y="9" width="20" height="14"/><path d="M11 9v14M21 9v14"/><path d="M6 13h5M6 19h5M21 13h5M21 19h5"/>',
    plaza: '<circle cx="16" cy="16" r="9"/><circle cx="16" cy="16" r="4"/><circle cx="16" cy="16" r="1" fill="currentColor"/>',
    school: '<path d="M5 16l9-7 9 7"/><path d="M8 15v10h12V15"/><path d="M14 9V3h7l-2 3 2 3h-7"/>',
    houses: '<path d="M3 15l6-5 6 5M5 14v9h8v-9"/><path d="M17 18l6-5 6 5M19 17v9h7v-9"/>',
    factory: '<path d="M5 26V14l6 4v-4l6 4v-4l6 5v7z"/><path d="M7 14V8h3v5"/><path d="M12 26v-4h4v4"/>',
    bank: '<path d="M4 12l12-7 12 7"/><path d="M8 12v10M13 12v10M19 12v10M24 12v10"/><path d="M5 25h22"/>',
    compass: '<circle cx="16" cy="16" r="10"/><path d="M20 12l-3 5-5 3 3-5z"/>',
    crane: '<path d="M11 28V6M5 6h20"/><path d="M11 6l-6 5M25 6v6h-6"/><path d="M19 12v5M17 19h4"/>',
    bulb: '<circle cx="16" cy="13" r="6"/><path d="M13 20h6M14 23h4M15 26h2"/>',
    torii: '<path d="M4 8h24M7 11h18"/><path d="M10 11v15M22 11v15"/><path d="M10 18h12"/>'
  };
  var ICON_BY_ID = {
    bakery: 'shop', cafe: 'cup', diner: 'burger',
    house1: 'house', house2: 'house', house3: 'house', house4: 'house',
    tower: 'tower', park: 'tree',
    kiosk1: 'ticket', kiosk2: 'hotdog', kiosk3: 'cone', kiosk4: 'gift',
    hotel: 'hotel', bookshop: 'book', flowers: 'flower',
    towera: 'tower', towerb: 'building', cinema: 'film', plaza: 'plaza',
    market: 'shop', school: 'school', homes: 'houses', factory: 'factory',
    header: 'bank', nav: 'compass', main: 'crane', aside: 'bulb', footer: 'torii'
  };
  var STAR_ON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"/></svg>';
  var STAR_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"/></svg>';
  var BULB_SM = svgInner(ICON_PATHS.bulb);

  function picFor(item) {
    var key = ICON_BY_ID[item.id];
    if (key && ICON_PATHS[key]) return svgInner(ICON_PATHS[key]);
    return '<span class="emoji">' + item.emoji + '</span>';
  }

  var state = loadState();
  var current = 0;
  var lastResult = null;

  var el = {
    strip: document.getElementById('level-strip'),
    progress: document.getElementById('progress'),
    board: document.getElementById('board'),
    ghost: document.getElementById('ghost'),
    mission: document.getElementById('mission'),
    concept: document.getElementById('concept'),
    editor: document.getElementById('editor'),
    feedback: document.getElementById('feedback'),
    playerStyle: document.getElementById('player-style'),
    hintPre: document.getElementById('hint-pre'),
    hintBox: document.getElementById('hintbox'),
    hintSummary: document.getElementById('hint-summary'),
    modal: document.getElementById('modal'),
    modalTitle: document.getElementById('modal-title'),
    modalStars: document.getElementById('modal-stars'),
    modalLearned: document.getElementById('modal-learned'),
    modalWild: document.getElementById('modal-wild'),
    modalTip: document.getElementById('modal-tip'),
    btnNext: document.getElementById('btn-next'),
    confetti: document.getElementById('confetti')
  };

  function loadState() {
    try {
      var raw = localStorage.getItem(SAVE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* file:// or private mode — fall through */ }
    return { code: {}, stars: {}, fails: {} };
  }
  function saveState() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { /* non-fatal */ }
  }

  // Player CSS runs in a global <style> tag, so a stray `body { ... }` or
  // `#modal { ... }` rule would break page chrome. Drop any rule whose
  // selector targets page chrome or the universal selector. All canonical
  // solutions only use `.board` and zone ids, so legit CSS is unaffected.
  var PAGE_CHROME_RE = /(^|[^a-z0-9_-])(body(?![a-z0-9_-])|html(?![a-z0-9_-])|head(?![a-z0-9_-])|#modal|#editor|#confetti|#ghost|#level-strip|#progress|#feedback|#hintbox|#hint-summary|#hint-pre|#player-style|#btn-check|#btn-reset|#btn-next|#btn-stay|#level-label|#app|\.pill|\.panel|\.topbar|\.modal-card|\.gz|\.ghost-layer|\.lesson|\.btnrow|\.stage|\.board-wrap|\*)/i;
  var BARE_ELEMENT_RE = /(^|[\s,>+~])(div|span|header|footer|nav|main|aside|section|article|button|textarea|input|details|summary|p|h1|h2|h3|ul|li|body|html|head|style)(?![a-z0-9_-])/i;

  function sanitizePlayerCSS(css) {
    var out = [];
    var parts = String(css).split('}');
    for (var i = 0; i < parts.length; i++) {
      var chunk = parts[i];
      var brace = chunk.indexOf('{');
      if (brace === -1) continue; // trailing text or empty — drop
      var selector = chunk.slice(0, brace);
      var body = chunk.slice(brace + 1);
      var selTrim = selector.replace(/\/\*[\s\S]*?\*\//g, '').trim();
      if (!selTrim) continue;
      if (/^@/.test(selTrim)) continue; // no at-rules needed for grid solutions
      if (PAGE_CHROME_RE.test(selTrim) || BARE_ELEMENT_RE.test(selTrim)) continue;
      out.push(selector + '{' + body + '}');
    }
    return out.join('\n');
  }

  // ---------- board building ----------

  function buildBoardInto(board, ghost, level) {
    board.innerHTML = '';
    if (ghost) {
      ghost.className = 'ghost-layer';
      ghost.id = 'ghost';
      board.appendChild(ghost);
    }
    level.items.forEach(function (item, i) {
      var cell = document.createElement('div');
      cell.className = 'cell';
      cell.id = item.id;
      cell.dataset.id = item.id;
      cell.style.background = PALETTE[i % PALETTE.length];
      cell.innerHTML = picFor(item) + '<span class="name">' + item.name + '</span>';
      board.appendChild(cell);
    });
    if (ghost) renderGhost(ghost, level, board);
  }

  function renderGhost(ghost, level, board) {
    var rects = E.expectedRects(level, board.clientWidth, board.clientHeight);
    ghost.innerHTML = '';
    level.items.forEach(function (item) {
      var z = document.createElement('div');
      z.className = 'gz';
      z.dataset.id = item.id;
      var r = rects[item.id];
      z.style.left = r.x + 'px';
      z.style.top = r.y + 'px';
      z.style.width = r.w + 'px';
      z.style.height = r.h + 'px';
      z.innerHTML = '<span>' + item.name + '</span>';
      ghost.appendChild(z);
    });
  }

  // ---------- validation ----------

  function validate(level, board) {
    var problems = [];
    var display = getComputedStyle(board).display;
    if (display !== 'grid' && display !== 'inline-grid') {
      problems.push('The board is not a grid yet — set display: grid.');
    }
    var cells = {};
    Array.prototype.forEach.call(board.querySelectorAll('.cell'), function (c) {
      cells[c.dataset.id] = c;
      if (getComputedStyle(c).position !== 'static') {
        problems.push('Build with grid, not absolute positioning (' + c.dataset.id + ').');
      }
    });
    level.items.forEach(function (item) {
      if (!cells[item.id]) problems.push('Missing zone: ' + item.name + '.');
    });

    var itemOk = {};
    var matched = 0;
    if (display === 'grid' || display === 'inline-grid') {
      var W = board.clientWidth, H = board.clientHeight;
      var originX = board.getBoundingClientRect().left + board.clientLeft;
      var originY = board.getBoundingClientRect().top + board.clientTop;
      var expected = E.expectedRects(level, W, H);
      level.items.forEach(function (item) {
        var c = cells[item.id];
        if (!c) { itemOk[item.id] = false; return; }
        var b = c.getBoundingClientRect();
        var actual = { x: b.left - originX, y: b.top - originY, w: b.width, h: b.height };
        var ok = E.rectsMatch(actual, expected[item.id]);
        itemOk[item.id] = ok;
        if (ok) matched++;
      });
      if (matched < level.items.length) {
        problems.push(matched + ' of ' + level.items.length + ' zones match the dashed outline.');
      }
    } else {
      level.items.forEach(function (item) { itemOk[item.id] = false; });
    }

    (level.asserts || []).forEach(function (a) {
      var target = a.on === 'board' ? board : cells[a.on];
      if (!target) { problems.push('Zone missing for check: ' + a.prop); return; }
      var v = getComputedStyle(target)[a.prop];
      if (!E.styleMatches(v, a)) {
        problems.push('Style check failed: ' + a.prop + ' ' + a.op + ' ' + a.value + ' (got ' + v + ').');
      }
    });

    return { pass: problems.length === 0, itemOk: itemOk, problems: problems };
  }

  function paintFeedback(result) {
    Object.keys(result.itemOk).forEach(function (id) {
      var gz = el.ghost.querySelector('.gz[data-id="' + id + '"]');
      var cell = el.board.querySelector('.cell[data-id="' + id + '"]');
      if (gz) gz.classList.toggle('ok', result.itemOk[id]);
      if (cell) cell.classList.toggle('ok', result.itemOk[id]);
    });
  }

  // ---------- level lifecycle ----------

  function loadLevel(i) {
    current = i;
    state.currentLevel = i;
    saveState();
    var level = LEVELS[i];
    buildBoardInto(el.board, el.ghost, level);
    el.mission.textContent = level.brief;
    el.concept.textContent = 'Level ' + level.n + ' — ' + level.concept;
    el.editor.value = state.code[level.id] != null ? state.code[level.id] : level.starter;
    el.hintPre.textContent = level.solution;
    el.hintBox.open = false;
    updateHintLock();
    el.feedback.textContent = 'Match every dashed zone, then press Check.';
    document.getElementById('level-label').textContent = level.n + '. ' + level.title;
    applyAndValidate(true);
    renderStrip();
    focusEditor(true);
  }

  // Autofocusing the editor on touch devices pops the virtual keyboard and
  // scrolls the board out of view, so only do it for fine-pointer devices.
  function focusEditor(onlyFinePointer) {
    if (onlyFinePointer && window.matchMedia && !window.matchMedia('(pointer:fine)').matches) return;
    try { el.editor.focus({ preventScroll: true }); }
    catch (e) { el.editor.focus(); }
  }

  function applyAndValidate(soft) {
    el.playerStyle.textContent = sanitizePlayerCSS(el.editor.value);
    var result = validate(LEVELS[current], el.board);
    paintFeedback(result);
    lastResult = result;
    if (soft && !result.pass) {
      var n = countOk(result);
      el.feedback.textContent = n === 0
        ? 'Nothing lines up yet — make the board a grid first.'
        : n + ' of ' + LEVELS[current].items.length + ' zones in place. Keep going!';
    } else if (!result.pass) {
      el.feedback.textContent = '✗ ' + result.problems[0];
      el.board.classList.remove('shake');
      void el.board.offsetWidth; // restart animation
      el.board.classList.add('shake');
    }
    saveCode();
    return result;
  }

  function countOk(result) {
    return Object.keys(result.itemOk).filter(function (k) { return result.itemOk[k]; }).length;
  }

  function saveCode() {
    state.code[LEVELS[current].id] = el.editor.value;
    saveState();
  }

  function onCheck() {
    var level = LEVELS[current];
    var result = applyAndValidate(false);
    if (result.pass) return win(level);
    state.fails[level.id] = (state.fails[level.id] || 0) + 1;
    saveState();
    updateHintLock();
  }

  function starsFor(level) {
    var fails = state.fails[level.id] || 0;
    return fails === 0 ? 3 : fails <= 2 ? 2 : 1;
  }

  function win(level) {
    var stars = starsFor(level);
    state.stars[level.id] = Math.max(state.stars[level.id] || 0, stars);
    saveState();
    renderStrip();
    confettiBurst();
    el.feedback.textContent = 'All ' + level.items.length + ' zones match — nicely built!';
    el.modalTitle.textContent = level.n === LEVELS.length ? '\uD83C\uDFC6 City complete — ' + level.title : '\u2728 ' + level.title + ' built!';
    el.modalStars.innerHTML = STAR_ON.repeat(stars) + STAR_OFF.repeat(3 - stars);
    el.modalLearned.textContent = level.lesson.learned;
    el.modalWild.textContent = level.lesson.wild;
    el.modalTip.textContent = level.lesson.tip;
    el.btnNext.textContent = level.n === LEVELS.length ? 'Build the city again \u21BB' : 'Next level \u2192';
    el.modal.classList.add('open');
    try { el.btnNext.focus({ preventScroll: true }); }
    catch (e) { el.btnNext.focus(); }
  }

  function onNext() {
    el.modal.classList.remove('open');
    loadLevel(current + 1 < LEVELS.length ? current + 1 : 0);
  }

  function updateHintLock() {
    var locked = (state.fails[LEVELS[current].id] || 0) < 2;
    el.hintBox.classList.toggle('locked', locked);
    if (locked) el.hintBox.open = false;
    el.hintSummary.innerHTML = BULB_SM + (locked
      ? ' Hint \u2014 unlocks after 2 failed checks'
      : ' Show me how');
  }

  function renderStrip() {
    el.strip.innerHTML = '';
    var done = 0, starSum = 0;
    LEVELS.forEach(function (level, i) {
      var stars = state.stars[level.id] || 0;
      if (stars) done++;
      starSum += stars;
      var b = document.createElement('button');
      b.className = 'pill' + (i === current ? ' current' : '') + (stars ? ' done' : '');
      b.innerHTML = '<b>' + level.n + '</b>' + (stars ? '<i>' + STAR_ON.repeat(stars) + '</i>' : '');
      b.title = level.title;
      b.addEventListener('click', function () { el.modal.classList.remove('open'); loadLevel(i); });
      el.strip.appendChild(b);
    });
    el.progress.textContent = done + '/' + LEVELS.length + ' built \u00B7 ' + starSum + ' stars';
  }

  // ---------- confetti ----------

  function confettiBurst() {
    for (var i = 0; i < 60; i++) {
      var p = document.createElement('i');
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = PALETTE[i % PALETTE.length];
      p.style.animationDuration = (1.8 + Math.random() * 1.4) + 's';
      p.style.animationDelay = (Math.random() * 0.5) + 's';
      p.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      el.confetti.appendChild(p);
    }
    setTimeout(function () { el.confetti.innerHTML = ''; }, 3400);
  }

  // ---------- wiring ----------

  var debounceTimer = null;
  el.editor.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () { applyAndValidate(true); }, 350);
  });
  el.editor.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      var s = this.selectionStart;
      this.value = this.value.slice(0, s) + '  ' + this.value.slice(this.selectionEnd);
      this.selectionStart = this.selectionEnd = s + 2;
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); onCheck(); }
  });
  document.getElementById('btn-check').addEventListener('click', onCheck);
  document.getElementById('btn-reset').addEventListener('click', function () {
    el.editor.value = LEVELS[current].starter;
    applyAndValidate(true);
  });
  el.btnNext.addEventListener('click', onNext);
  document.getElementById('btn-stay').addEventListener('click', function () {
    el.modal.classList.remove('open');
    focusEditor(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && el.modal.classList.contains('open')) {
      el.modal.classList.remove('open');
      focusEditor(false);
    }
  });
  el.hintBox.addEventListener('toggle', function () {
    if (el.hintBox.classList.contains('locked') && el.hintBox.open) el.hintBox.open = false;
  });

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      renderGhost(el.ghost, LEVELS[current], el.board);
      applyAndValidate(true);
    }, 150);
  });

  // ---------- selftest (headless end-to-end gate: ?selftest=1) ----------

  function runSelftest() {
    var stage = document.createElement('div');
    stage.id = 'selftest-stage';
    document.body.appendChild(stage);
    var board = document.createElement('div');
    board.className = 'board';
    board.style.position = 'fixed';
    board.style.left = '-9999px';
    board.style.width = '500px';
    board.style.height = '380px';
    stage.appendChild(board);
    var styleEl = document.createElement('style');
    document.head.appendChild(styleEl);

    var results = [];
    for (var i = 0; i < LEVELS.length; i++) {
      var level = LEVELS[i];
      buildBoardInto(board, null, level);
      styleEl.textContent = level.solution;
      // style + layout are computed synchronously when getBoundingClientRect is called
      var r = validate(level, board);
      results.push({ id: level.id, pass: r.pass, problems: r.problems });
    }
    styleEl.textContent = '';
    var passed = results.filter(function (r) { return r.pass; }).length;
    var out = document.createElement('div');
    out.id = 'selftest-result';
    out.textContent = passed === LEVELS.length
      ? 'GRIDVILLE-SELFTEST-PASS:' + passed + '/' + LEVELS.length
      : 'GRIDVILLE-SELFTEST-FAIL ' + passed + '/' + LEVELS.length + ' :: ' +
        results.filter(function (r) { return !r.pass; })
          .map(function (r) { return r.id + ': ' + r.problems.join(' | '); }).join(' ;; ');
    document.body.appendChild(out);
    document.title = out.textContent.slice(0, 60);
  }

  var params = new URLSearchParams(location.search);
  if (/\bselftest=1\b/.test(location.search)) {
    runSelftest();
  } else if (params.get('demo')) {
    // scripted demo state for screenshots: ?demo=<level#>&code=<css>
    var demoIdx = Math.min(Math.max(parseInt(params.get('demo'), 10) - 1, 0), LEVELS.length - 1);
    loadLevel(demoIdx);
    if (params.get('code')) {
      el.editor.value = decodeURIComponent(params.get('code'));
    } else {
      el.editor.value = LEVELS[current].solution;
    }
    var demoResult = applyAndValidate(false);
    if (demoResult.pass) win(LEVELS[current]);
  } else if (params.get('level')) {
    loadLevel(Math.min(Math.max(parseInt(params.get('level'), 10) - 1, 0), LEVELS.length - 1));
  } else {
    loadLevel(Math.min(state.currentLevel || 0, LEVELS.length - 1));
  }
})();
