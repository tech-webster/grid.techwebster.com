/* GRIDVILLE game logic. Depends on levels.js (GRIDVILLE_LEVELS) and engine.js (GridEngine). */
(function () {
  'use strict';

  var LEVELS = window.GRIDVILLE_LEVELS;
  var E = window.GridEngine;
  var PALETTE = ['#ffd166', '#06d6a0', '#118ab2', '#ef476f', '#8338ec', '#fb5607', '#3a86ff', '#ffbe0b', '#2ec4b6', '#e71d36'];
  var SAVE_KEY = 'gridville-v1';

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
      cell.innerHTML = '<span class="emoji">' + item.emoji + '</span><span class="name">' + item.name + '</span>';
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
    el.editor.focus();
  }

  function applyAndValidate(soft) {
    el.playerStyle.textContent = el.editor.value;
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
    el.modalTitle.textContent = level.n === LEVELS.length ? '\uD83C\uDFC6 City complete — ' + level.title : '\u2728 ' + level.title + ' built!';
    el.modalStars.textContent = '\u2B50'.repeat(stars) + '\u2606'.repeat(3 - stars);
    el.modalLearned.textContent = level.lesson.learned;
    el.modalWild.textContent = level.lesson.wild;
    el.modalTip.textContent = level.lesson.tip;
    el.btnNext.textContent = level.n === LEVELS.length ? 'Build the city again \u21BB' : 'Next level \u2192';
    el.modal.classList.add('open');
  }

  function onNext() {
    el.modal.classList.remove('open');
    loadLevel(current + 1 < LEVELS.length ? current + 1 : 0);
  }

  function updateHintLock() {
    var locked = (state.fails[LEVELS[current].id] || 0) < 2;
    el.hintBox.classList.toggle('locked', locked);
    if (locked) el.hintBox.open = false;
    el.hintSummary.textContent = locked
      ? '\uD83D\uDCA1 Hint \u2014 unlocks after 2 failed checks'
      : '\uD83D\uDCA1 Show me how';
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
      b.innerHTML = '<b>' + level.n + '</b>' + (stars ? '<i>' + '\u2B50'.repeat(stars) + '</i>' : '');
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
  });
  el.hintSummary.addEventListener('click', function (e) {
    if (el.hintBox.classList.contains('locked')) e.preventDefault();
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
