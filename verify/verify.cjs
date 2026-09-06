#!/usr/bin/env node
/* GRIDVILLE acceptance checks. Usage: node verify/verify.cjs <levels|engine|html|syntax|selftest> */
'use strict';

var fs = require('fs');
var path = require('path');
var cpSync = require('child_process').spawnSync;

var ROOT = path.resolve(__dirname, '..');
var LEVELS = require(path.join(ROOT, 'levels.js'));
var E = require(path.join(ROOT, 'engine.js'));

var failures = [];

function fail(msg) { failures.push(msg); }
function ok(cond, msg) { if (!cond) fail(msg); }

function finish(marker) {
  if (failures.length) {
    failures.forEach(function (f) { console.error('  FAIL: ' + f); });
    console.error(marker.replace('PASS', 'FAIL'));
    process.exit(1);
  }
  console.log(marker);
}

function norm(s) { return String(s).replace(/\s+/g, ' '); }

// ---------------- levels ----------------

function checkLevels() {
  var W = 500, H = 380;
  var ids = {};
  ok(Array.isArray(LEVELS) && LEVELS.length === 8, 'expected 8 levels, got ' + (LEVELS && LEVELS.length));

  LEVELS.forEach(function (lv, i) {
    var p = 'L' + (i + 1) + ' (' + lv.id + ')';
    ok(lv.id && !ids[lv.id], p + ': duplicate or missing id');
    ids[lv.id] = true;
    ok(lv.n === i + 1, p + ': n should be ' + (i + 1));
    ok(typeof lv.title === 'string' && lv.title.length > 2, p + ': title');
    ok(typeof lv.brief === 'string' && lv.brief.length > 20, p + ': brief too short');
    ok(typeof lv.concept === 'string' && lv.concept.length >= 3, p + ': concept');

    var t = lv.template || {};
    ok(Array.isArray(t.cols) && t.cols.length > 0 && t.cols.every(function (w) { return w > 0; }), p + ': cols weights');
    ok(Array.isArray(t.rows) && t.rows.length > 0 && t.rows.every(function (w) { return w > 0; }), p + ': rows weights');
    var gap = typeof t.gap === 'number' ? t.gap : 0;
    ok(gap >= 0, p + ': gap');

    ok(Array.isArray(lv.items) && lv.items.length > 0, p + ': items');
    var itemIds = {};
    var rects = [];
    lv.items.forEach(function (item) {
      ok(item.id && !itemIds[item.id], p + ': item id ' + item.id);
      itemIds[item.id] = true;
      ok(item.emoji && item.name, p + ': item ' + item.id + ' emoji/name');
      var c = item.lines && item.lines.c, r = item.lines && item.lines.r;
      ok(Array.isArray(c) && c.length === 2 && c[0] < c[1] && c[0] >= 1 && c[1] <= t.cols.length + 1,
        p + ': item ' + item.id + ' column lines ' + JSON.stringify(c));
      ok(Array.isArray(r) && r.length === 2 && r[0] < r[1] && r[0] >= 1 && r[1] <= t.rows.length + 1,
        p + ': item ' + item.id + ' row lines ' + JSON.stringify(r));
      if (c && r) {
        var g = typeof t.gap === 'number' ? { c: t.gap, r: t.gap } : { c: (t.gap && t.gap.c) || 0, r: (t.gap && t.gap.r) || 0 };
        var rect = E.rectFor(c, r, { cols: t.cols, rows: t.rows, gapC: g.c, gapR: g.r, W: W, H: H });
        ok(E.inBounds(rect, W, H), p + ': item ' + item.id + ' rect out of bounds ' + JSON.stringify(rect));
        rects.push({ id: item.id, rect: rect });
      }
    });

    // targets must tile the board without meaningful overlap
    for (var a = 0; a < rects.length; a++) {
      for (var b = a + 1; b < rects.length; b++) {
        ok(!E.overlaps(rects[a].rect, rects[b].rect, 2),
          p + ': targets overlap — ' + rects[a].id + ' vs ' + rects[b].id);
      }
    }

    // the layout must actually fill the board (no dead boards)
    var filled = rects.reduce(function (acc, x) { return acc + x.rect.w * x.rect.h; }, 0);
    ok(filled >= W * H * 0.85, p + ': targets cover only ' + Math.round(100 * filled / (W * H)) + '% of the board');

    ok(typeof lv.solution === 'string' && lv.solution.length > 10, p + ': solution');
    var sol = norm(lv.solution);
    (lv.requires || []).forEach(function (req) {
      ok(sol.indexOf(req) !== -1, p + ': solution missing required "' + req + '"');
    });

    (lv.asserts || []).forEach(function (as) {
      ok(as.on === 'board' || itemIds[as.on], p + ': assert on unknown target ' + as.on);
      ok(['>=', '!=', '=='].indexOf(as.op) !== -1, p + ': assert op ' + as.op);
      ok(as.prop && as.value !== undefined, p + ': assert prop/value');
    });

    var les = lv.lesson || {};
    ok(typeof les.learned === 'string' && les.learned.length > 60, p + ': lesson.learned too thin');
    ok(typeof les.wild === 'string' && les.wild.length > 20, p + ': lesson.wild too thin');
    ok(typeof les.tip === 'string' && les.tip.length > 20, p + ': lesson.tip too thin');

    ok(typeof lv.starter === 'string' && lv.starter.length > 5, p + ': starter');
  });

  finish('GRIDVILLE-G1-PASS');
}

// ---------------- engine ----------------

function approx(a, b, eps) { return Math.abs(a - b) <= (eps || 1e-9); }

function checkEngine() {
  var ts = E.trackSizes([1, 1, 1], 300, 0);
  ok(ts.length === 3 && approx(ts[0], 100) && approx(ts[1], 100) && approx(ts[2], 100), 'trackSizes 3x1fr/300 = 100 each, got ' + ts);
  ts = E.trackSizes([2, 1], 300, 0);
  ok(approx(ts[0], 200) && approx(ts[1], 100), 'trackSizes 2fr 1fr/300 = 200/100, got ' + ts);
  ts = E.trackSizes([1, 1], 300, 24);
  ok(approx(ts[0], 138) && approx(ts[1], 138), 'trackSizes with gap 24: (300-48)/2 = 138, got ' + ts);

  ok(approx(E.linePos([100, 100, 100], 0, 1), 0), 'linePos line1 = 0');
  ok(approx(E.linePos([100, 100, 100], 0, 3), 200), 'linePos line3 = 200');
  ok(approx(E.linePos([100, 100], 24, 2), 124), 'linePos line2 with gap = 124');

  var lv = { template: { cols: [1, 1], rows: [1, 1], gap: 24 }, items: [{ id: 'x', lines: { c: [2, 3], r: [1, 2] } }] };
  var rects = E.expectedRects(lv, 500, 400);
  ok(approx(rects.x.x, 262) && approx(rects.x.w, 238) && approx(rects.x.y, 0) && approx(rects.x.h, 188),
    'expectedRects 2x2 gap24: col2 starts 262 wide 238, got ' + JSON.stringify(rects.x));

  var m = { x: 10, y: 20, w: 100, h: 50 };
  ok(E.rectsMatch(m, { x: 10, y: 20, w: 100, h: 50 }), 'rectsMatch identical');
  ok(E.rectsMatch(m, { x: 15, y: 20, w: 100, h: 50 }), 'rectsMatch within 6px');
  ok(!E.rectsMatch(m, { x: 17, y: 20, w: 100, h: 50 }), 'rectsMatch rejects 7px drift');
  ok(!E.rectsMatch(m, { x: 10, y: 20, w: 110, h: 50 }), 'rectsMatch rejects width drift');

  ok(E.inBounds({ x: 0, y: 0, w: 100, h: 100 }, 100, 100), 'inBounds exact fit');
  ok(!E.inBounds({ x: 10, y: 0, w: 100, h: 100 }, 100, 100), 'inBounds rejects overflow beyond tolerance');
  ok(!E.inBounds({ x: 0, y: 0, w: 0, h: 100 }, 100, 100), 'inBounds rejects zero width');

  ok(E.overlaps({ x: 0, y: 0, w: 10, h: 10 }, { x: 5, y: 5, w: 10, h: 10 }), 'overlaps detects intersection');
  ok(!E.overlaps({ x: 0, y: 0, w: 10, h: 10 }, { x: 10, y: 0, w: 10, h: 10 }), 'overlaps: touching edges do not count');
  ok(!E.overlaps({ x: 0, y: 0, w: 10, h: 10 }, { x: 0, y: 0, w: 10, h: 10 }, 11), 'overlaps respects epsilon');

  ok(E.styleMatches('24px', { op: '>=', value: 12 }), 'styleMatches 24px >= 12');
  ok(!E.styleMatches('normal', { op: '>=', value: 12 }), 'styleMatches NaN fails >=');
  ok(!E.styleMatches('none', { op: '!=', value: 'none' }), 'styleMatches none != none is false');
  ok(E.styleMatches('  "a a"\n"b b" ', { op: '!=', value: 'none' }), 'styleMatches areas string != none');
  ok(E.styleMatches(' grid ', { op: '==', value: 'grid' }), 'styleMatches normalizes whitespace');

  finish('GRIDVILLE-G2-PASS');
}

// ---------------- html ----------------

function checkHtml() {
  var html = fs.readFileSync(path.join(ROOT, 'play/index.html'), 'utf8');
  ok(/<title>[^<]*GRIDVILLE/i.test(html), 'title must mention GRIDVILLE');
  ok(html.indexOf('name="viewport"') !== -1, 'viewport meta required');
  ok(html.indexOf('id="board"') !== -1, '#board required');
  ok(html.indexOf('id="ghost"') !== -1, '#ghost required');
  ok(html.indexOf('id="editor"') !== -1, '#editor required');
  ok(html.indexOf('id="level-strip"') !== -1, '#level-strip required');
  ok(html.indexOf('id="modal"') !== -1, '#modal required');
  ok(html.indexOf('id="player-style"') !== -1, '#player-style required');
  ok(html.indexOf('type="module"') === -1, 'no ES modules — page must work from file://');
  var iLevels = html.indexOf('src="../levels.js"');
  var iEngine = html.indexOf('src="../engine.js"');
  var iGame = html.indexOf('src="../game.js"');
  ok(iLevels !== -1 && iEngine !== -1 && iGame !== -1, 'all three scripts referenced');
  ok(iLevels < iEngine && iEngine < iGame, 'script order must be levels, engine, game');
  ok(!/TODO|FIXME|lorem ipsum|placeholder text/i.test(html), 'no TODO/placeholder markers');
  finish('GRIDVILLE-G3-PASS');
}

// ---------------- syntax ----------------

function checkSyntax() {
  ['levels.js', 'engine.js', 'game.js', 'landing.js'].forEach(function (f) {
    var r = cpSync(process.execPath, ['--check', path.join(ROOT, f)], { encoding: 'utf8' });
    ok(r.status === 0, f + ' does not parse: ' + (r.stderr || '').slice(0, 300));
  });
  finish('GRIDVILLE-G4-PASS');
}

// ---------------- selftest (real browser layout) ----------------

function findChrome() {
  var candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'
  ];
  for (var i = 0; i < candidates.length; i++) {
    if (fs.existsSync(candidates[i])) return candidates[i];
  }
  return null;
}

function checkSelftest() {
  var chrome = findChrome();
  if (!chrome) {
    fail('no Chrome/Chromium found — install Google Chrome to run the end-to-end gate');
    finish('GRIDVILLE-SELFTEST-PASS:8/8');
    return;
  }
  var url = 'file://' + path.join(ROOT, 'play/index.html') + '?selftest=1';
  var r = cpSync(chrome, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--virtual-time-budget=8000', '--dump-dom', url
  ], { encoding: 'utf8', timeout: 60000, maxBuffer: 20 * 1024 * 1024 });

  ok(r.status === 0, 'headless chrome exited ' + r.status);
  var dom = r.stdout || '';
  var m = dom.match(/GRIDVILLE-SELFTEST-(PASS|FAIL)[^<]*/);
  ok(!!m, 'selftest marker not found in DOM (scripts did not run?)');
  if (m) {
    ok(m[0].indexOf('GRIDVILLE-SELFTEST-PASS:8/8') === 0,
      'selftest did not pass 8/8: ' + m[0].slice(0, 600));
  }
  finish('GRIDVILLE-SELFTEST-PASS:8/8');
}

// ---------------- main ----------------

var cmd = process.argv[2];
var cmds = {
  levels: checkLevels,
  engine: checkEngine,
  html: checkHtml,
  syntax: checkSyntax,
  selftest: checkSelftest
};
if (!cmds[cmd]) {
  console.error('usage: node verify/verify.cjs <' + Object.keys(cmds).join('|') + '>');
  process.exit(2);
}
cmds[cmd]();
