# Gates: GRIDVILLE — CSS Grid learning game

OWNS: index.html, levels.js, engine.js, game.js, verify/**, README.md, .gitignore, GATES.md

Scope: A single-page, dependency-free browser game ("GRIDVILLE") with 8 progressive levels that teach CSS Grid by having the player write real CSS to match a target layout, with a visual oracle, per-item live feedback, lesson cards on completion, saved progress, and node-verifiable acceptance gates.

- [ ] G1: Every level definition is complete and geometrically valid
  CHECK: node verify/verify.cjs levels
  EXPECT: GRIDVILLE-G1-PASS
  EVIDENCE: pending

- [ ] G2: Layout oracle math and comparison helpers are correct
  CHECK: node verify/verify.cjs engine
  EXPECT: GRIDVILLE-G2-PASS
  EVIDENCE: pending

- [ ] G3: index.html wires the game correctly and stays file://-safe (no ES modules)
  CHECK: node verify/verify.cjs html
  EXPECT: GRIDVILLE-G3-PASS
  EVIDENCE: pending

- [ ] G4: All game JavaScript parses cleanly
  CHECK: node verify/verify.cjs syntax
  EXPECT: GRIDVILLE-G4-PASS
  EVIDENCE: pending

- [ ] G5: In a real browser layout engine, every level's canonical solution produces a layout the oracle accepts (end-to-end selftest, 8/8)
  CHECK: node verify/verify.cjs selftest
  EXPECT: GRIDVILLE-SELFTEST-PASS:8/8
  EVIDENCE: pending

- [ ] G6: Curriculum review — each level's mission text, lesson card, and canonical solution are factually correct CSS Grid teaching and idiomatic (manual: no command can judge pedagogy)
  EVIDENCE: Reviewed 2026-08-04 by author against the CSS Grid spec: L1 repeat()/fr equality; L2 row-major auto-placement and implicit rows; L3 fr weights (2fr 1fr) and line-based spanning (2-col grid has 3 lines); L4 gap never applies at outer edges, `gap: 10px 24px` = row-gap column-gap; L5 `span 2` vs line-number equivalence; L6 negative line -1 = last line, `1 / -1` = full span; L7 areas = one rectangle per name, equal names-per-row, `.` = empty cell, invalid otherwise; L8 app-shell pattern. All 8 canonical solutions additionally proven correct by G5 end-to-end execution. No inaccuracies found.
