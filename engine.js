/* GRIDVILLE layout oracle — pure math, no DOM. Shared by the game and the node verifier. */
(function (root) {
  'use strict';

  var TOL = 6; // px tolerance for rect comparison

  // fr-weighted track sizes for a total pixel size and gap
  function trackSizes(weights, total, gap) {
    var sum = weights.reduce(function (a, b) { return a + b; }, 0);
    var unit = (total - gap * (weights.length - 1)) / sum;
    return weights.map(function (w) { return w * unit; });
  }

  // px offset of grid line `line` (1-indexed) given track sizes and gap
  function linePos(sizes, gap, line) {
    var pos = 0;
    for (var i = 0; i < line - 1; i++) {
      pos += sizes[i] + (i < sizes.length - 1 ? gap : 0); // no gap after the last track
    }
    return pos;
  }

  function normalizeGap(gap) {
    if (typeof gap === 'number') return { c: gap, r: gap };
    return { c: (gap && gap.c) || 0, r: (gap && gap.r) || 0 };
  }

  // Expected px rect for 1-indexed grid lines [start, end)
  // End line e: end of track e-2. linePos(e) is the start of track e-1 = end of
  // track e-2 + gap, so subtract the gap for interior end lines.
  function rectFor(c, r, t) {
    var cs = trackSizes(t.cols, t.W, t.gapC);
    var rs = trackSizes(t.rows, t.H, t.gapR);
    function endPos(line, sizes, gap) {
      return linePos(sizes, gap, line) - (line <= sizes.length ? gap : 0);
    }
    var x1 = linePos(cs, t.gapC, c[0]), x2 = endPos(c[1], cs, t.gapC);
    var y1 = linePos(rs, t.gapR, r[0]), y2 = endPos(r[1], rs, t.gapR);
    return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
  }

  // All expected rects for a level, scaled to a W x H board
  function expectedRects(level, W, H) {
    var g = normalizeGap(level.template.gap);
    var t = {
      cols: level.template.cols, rows: level.template.rows,
      gapC: g.c, gapR: g.r, W: W, H: H
    };
    var out = {};
    level.items.forEach(function (item) {
      out[item.id] = rectFor(item.lines.c, item.lines.r, t);
    });
    return out;
  }

  function rectsMatch(a, b, tol) {
    tol = tol || TOL;
    return ['x', 'y', 'w', 'h'].every(function (k) {
      return Math.abs(a[k] - b[k]) <= tol;
    });
  }

  function inBounds(r, W, H, tol) {
    tol = tol || TOL;
    return r.x >= -tol && r.y >= -tol &&
      r.x + r.w <= W + tol && r.y + r.h <= H + tol &&
      r.w > 0 && r.h > 0;
  }

  // true if two rects overlap by more than a sliver
  function overlaps(a, b, eps) {
    eps = eps || 1;
    var ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
    var oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
    return ox > eps && oy > eps;
  }

  function norm(s) {
    return String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
  }

  // runtime style assertion: computed style value vs expectation
  function styleMatches(computed, assert) {
    if (assert.op === '>=') return parseFloat(computed) >= assert.value;
    if (assert.op === '!=') return norm(computed) !== norm(assert.value);
    if (assert.op === '==') return norm(computed) === norm(assert.value);
    return false;
  }

  root.GridEngine = {
    TOL: TOL,
    trackSizes: trackSizes,
    linePos: linePos,
    rectFor: rectFor,
    expectedRects: expectedRects,
    rectsMatch: rectsMatch,
    inBounds: inBounds,
    overlaps: overlaps,
    styleMatches: styleMatches,
    norm: norm
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.GridEngine;
})(typeof window !== 'undefined' ? window : globalThis);
