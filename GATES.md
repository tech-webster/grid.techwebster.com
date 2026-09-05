# Gates: GRIDVILLE — CSS Grid learning game

OWNS: index.html, levels.js, engine.js, game.js, verify/**, README.md, .gitignore, GATES.md

Scope: A single-page, dependency-free browser game ("GRIDVILLE") with 8 progressive levels that teach CSS Grid by having the player write real CSS to match a target layout, with a visual oracle, per-item live feedback, lesson cards on completion, saved progress, and node-verifiable acceptance gates.

- [x] G1: Every level definition is complete and geometrically valid
  CHECK: node verify/verify.cjs levels
  EXPECT: GRIDVILLE-G1-PASS
  EVIDENCE: automatic-evidence=v1; definition-sha256=37356384d550809d07f81f88a95c036d6f7241819876ea68fa8cfd150e0ba6db; exit=0; EXPECT=matched; output-sha256=652d6994cc68a3126152abb1f560e61a97f3c216b9a8c596e7aaa52206ec52f6; output-bytes=18; shell=/bin/sh; cwd=/Users/ashirbadpanigrahi/Desktop/TechWebster/grid.techwebster.com; path=6b14023d4ede/32 entries

- [x] G2: Layout oracle math and comparison helpers are correct
  CHECK: node verify/verify.cjs engine
  EXPECT: GRIDVILLE-G2-PASS
  EVIDENCE: automatic-evidence=v1; definition-sha256=814663e6225a77fb0817bc5a420045c5006e14c678837d4eef572ca1cdf5aa4c; exit=0; EXPECT=matched; output-sha256=cb0df56dce6c1ea1c39cfeae9f128cd0e450861687db673d69c5a607a0898630; output-bytes=18; shell=/bin/sh; cwd=/Users/ashirbadpanigrahi/Desktop/TechWebster/grid.techwebster.com; path=6b14023d4ede/32 entries

- [x] G3: index.html wires the game correctly and stays file://-safe (no ES modules)
  CHECK: node verify/verify.cjs html
  EXPECT: GRIDVILLE-G3-PASS
  EVIDENCE: automatic-evidence=v1; definition-sha256=8c5cdbdbbb1d3be42d9949874ae656ef333f19af74e40732fd99f395e87f0cf9; exit=0; EXPECT=matched; output-sha256=10d0935c7f5e516778ac6c9bc1e787d3d21727c8363077d296a06d51774a70e6; output-bytes=18; shell=/bin/sh; cwd=/Users/ashirbadpanigrahi/Desktop/TechWebster/grid.techwebster.com; path=6b14023d4ede/32 entries

- [x] G4: All game JavaScript parses cleanly
  CHECK: node verify/verify.cjs syntax
  EXPECT: GRIDVILLE-G4-PASS
  EVIDENCE: automatic-evidence=v1; definition-sha256=9098fa6e9d2f9e012f2cf56cf3a6fc14911734ec07b5ccc92bd60546f10a4f5c; exit=0; EXPECT=matched; output-sha256=31a0092a6b5498af1b99d19475031c6eee6c68b1a0e0816dcc81b4ea74eda4c1; output-bytes=18; shell=/bin/sh; cwd=/Users/ashirbadpanigrahi/Desktop/TechWebster/grid.techwebster.com; path=6b14023d4ede/32 entries

- [x] G5: In a real browser layout engine, every level's canonical solution produces a layout the oracle accepts (end-to-end selftest, 8/8)
  CHECK: node verify/verify.cjs selftest
  EXPECT: GRIDVILLE-SELFTEST-PASS:8/8
  EVIDENCE: automatic-evidence=v1; definition-sha256=ddd5362b7aa68f37223915a98650c7f943ecf0943b6722f8bea8c9d11f97f88b; exit=0; EXPECT=matched; output-sha256=2a452045445d1f454b3bfde300b16495be2d8d6e31328423555d6ebbc01d9f46; output-bytes=28; shell=/bin/sh; cwd=/Users/ashirbadpanigrahi/Desktop/TechWebster/grid.techwebster.com; path=6b14023d4ede/32 entries

- [x] G6: Curriculum review — each level's mission text, lesson card, and canonical solution are factually correct CSS Grid teaching and idiomatic (manual: no command can judge pedagogy)
  EVIDENCE: Reviewed 2026-09-05 by author against the CSS Grid spec: L1 repeat()/fr equality; L2 row-major auto-placement and implicit rows; L3 fr weights (2fr 1fr) and line-based spanning (2-col grid has 3 lines); L4 gap never applies at outer edges, `gap: 10px 24px` = row-gap column-gap; L5 `span 2` vs line-number equivalence; L6 negative line -1 = last line, `1 / -1` = full span; L7 areas = one rectangle per name, equal names-per-row, `.` = empty cell, invalid otherwise; L8 app-shell pattern. All 8 canonical solutions additionally proven correct by G5 end-to-end execution. No inaccuracies found.
