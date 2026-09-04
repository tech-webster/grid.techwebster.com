/* GRIDVILLE level data. Pure data — no DOM. Loadable in browser (window) and node (module.exports). */
(function (root) {
  'use strict';

  var LEVELS = [
    {
      id: 'main-street',
      n: 1,
      title: 'Main Street',
      concept: 'display: grid & grid-template-columns',
      brief: 'Three shops must stand side by side along Main Street, sharing the width equally. Make the street a grid and carve it into three equal columns.',
      template: { cols: [1, 1, 1], rows: [1], gap: 0 },
      items: [
        { id: 'bakery', emoji: '\uD83C\uDF5E', name: 'Bakery', lines: { c: [1, 2], r: [1, 2] } },
        { id: 'cafe', emoji: '\u2615', name: 'Café', lines: { c: [2, 3], r: [1, 2] } },
        { id: 'diner', emoji: '\uD83C\uDF5F', name: 'Diner', lines: { c: [3, 4], r: [1, 2] } }
      ],
      starter: '.board {\n  /* Make me a grid with 3 equal columns */\n}\n',
      solution: '.board {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}',
      requires: ['display', 'grid-template-columns'],
      asserts: [],
      lesson: {
        learned: 'display: grid turns the direct children of an element into grid items. grid-template-columns defines the columns ("tracks"): repeat(3, 1fr) is shorthand for 1fr 1fr 1fr — three tracks that each take one equal fraction (fr) of the free space.',
        wild: 'In the wild: pricing-card rows, image galleries, nav bars — anywhere you need equal columns.',
        tip: 'Tip: 1fr means "one fraction of the space left over". Three 1fr columns are always perfectly equal, no matter the screen width.'
      }
    },
    {
      id: 'two-by-two',
      n: 2,
      title: 'Two by Two',
      concept: 'grid-template-rows & auto-placement',
      brief: 'Four new homes need building plots in a 2×2 block. Define both the columns and the rows, and let the grid place the houses automatically.',
      template: { cols: [1, 1], rows: [1, 1], gap: 0 },
      items: [
        { id: 'house1', emoji: '\uD83C\uDFE0', name: 'Oak House', lines: { c: [1, 2], r: [1, 2] } },
        { id: 'house2', emoji: '\uD83C\uDFE1', name: 'Elm House', lines: { c: [2, 3], r: [1, 2] } },
        { id: 'house3', emoji: '\uD83C\uDFE2', name: 'Ivy House', lines: { c: [1, 2], r: [2, 3] } },
        { id: 'house4', emoji: '\uD83C\uDFE3', name: 'Fern House', lines: { c: [2, 3], r: [2, 3] } }
      ],
      starter: '.board {\n  /* 2 equal columns AND 2 equal rows */\n}\n',
      solution: '.board {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  grid-template-rows: repeat(2, 1fr);\n}',
      requires: ['grid-template-rows'],
      asserts: [],
      lesson: {
        learned: 'grid-template-rows works exactly like grid-template-columns but for rows. Items with no explicit placement are auto-placed row by row, left to right — like reading order.',
        wild: 'In the wild: bento grids, photo walls, dashboards made of equal tiles.',
        tip: 'Tip: if an item overflows your explicit rows, the grid quietly creates implicit rows. Define rows explicitly when the shape matters.'
      }
    },
    {
      id: 'the-heights',
      n: 3,
      title: 'The Heights',
      concept: 'fr proportions & spanning rows',
      brief: 'A slim tower owns the left side — twice as wide as the park next to it — and stretches the full height. The park and the café share the right column.',
      template: { cols: [2, 1], rows: [1, 1], gap: 0 },
      items: [
        { id: 'tower', emoji: '\uD83C\uDFEC', name: 'Tower', lines: { c: [1, 2], r: [1, 3] } },
        { id: 'park', emoji: '\uD83C\uDF33', name: 'Park', lines: { c: [2, 3], r: [1, 2] } },
        { id: 'cafe', emoji: '\u2615', name: 'Café', lines: { c: [2, 3], r: [2, 3] } }
      ],
      starter: '.board {\n  /* Columns in a 2:1 ratio, two rows, and the tower spanning both rows */\n}\n\n#tower {\n}\n',
      solution: '.board {\n  display: grid;\n  grid-template-columns: 2fr 1fr;\n  grid-template-rows: repeat(2, 1fr);\n}\n#tower {\n  grid-row: 1 / 3;\n}',
      requires: ['2fr', 'grid-template-rows', 'grid-row'],
      asserts: [],
      lesson: {
        learned: 'fr values are weights: 2fr 1fr splits space so the first column gets two shares for every one share of the second. An item can stretch across tracks with grid-row: 1 / 3 — "start at line 1, end at line 3".',
        wild: 'In the wild: content + sidebar layouts (the classic 2fr 1fr blog shell).',
        tip: 'Tip: grid lines are numbered, not tracks. A 2-column grid has 3 lines. 1 / 3 spans tracks 1 and 2.'
      }
    },
    {
      id: 'alley-ways',
      n: 4,
      title: 'Alley Ways',
      concept: 'gap',
      brief: 'Market kiosks are crammed together! Give the block some breathing room: a 2×2 arrangement with a real 24px gap between the kiosks.',
      template: { cols: [1, 1], rows: [1, 1], gap: 24 },
      items: [
        { id: 'kiosk1', emoji: '\uD83C\uDFAA', name: 'Tickets', lines: { c: [1, 2], r: [1, 2] } },
        { id: 'kiosk2', emoji: '\uD83C\uDF2D', name: 'Hot Dogs', lines: { c: [2, 3], r: [1, 2] } },
        { id: 'kiosk3', emoji: '\uD83C\uDF66', name: 'Ice Cream', lines: { c: [1, 2], r: [2, 3] } },
        { id: 'kiosk4', emoji: '\uD83C\uDFAB', name: 'Souvenirs', lines: { c: [2, 3], r: [2, 3] } }
      ],
      starter: '.board {\n  /* A 2x2 grid... with personal space */\n}\n',
      solution: '.board {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  grid-template-rows: repeat(2, 1fr);\n  gap: 24px;\n}',
      requires: ['gap'],
      asserts: [
        { on: 'board', prop: 'columnGap', op: '>=', value: 12 },
        { on: 'board', prop: 'rowGap', op: '>=', value: 12 }
      ],
      lesson: {
        learned: 'gap puts space between tracks — never at the outer edges, and it never doubles up where two gaps would meet. You can also write row-gap and column-gap separately.',
        wild: 'In the wild: card grids and button groups. Before gap existed, people faked it with margins and fought the doubled edges.',
        tip: 'Tip: gap: 24px sets both directions. gap: 10px 24px means 10px rows, 24px columns.'
      }
    },
    {
      id: 'grand-hotel',
      n: 5,
      title: 'The Grand Hotel',
      concept: 'spanning columns',
      brief: 'The Grand Hotel is too proud for one plot — it takes the whole first row, both columns. The bookshop and the flower stall split the row below.',
      template: { cols: [1, 1], rows: [1, 1], gap: 0 },
      items: [
        { id: 'hotel', emoji: '\uD83C\uDFE8', name: 'Grand Hotel', lines: { c: [1, 3], r: [1, 2] } },
        { id: 'bookshop', emoji: '\uD83D\uDCDA', name: 'Bookshop', lines: { c: [1, 2], r: [2, 3] } },
        { id: 'flowers', emoji: '\uD83C\uDF37', name: 'Flowers', lines: { c: [2, 3], r: [2, 3] } }
      ],
      starter: '.board {\n  /* 2 columns, 2 rows */\n}\n\n#hotel {\n  /* take BOTH columns of row 1 */\n}\n',
      solution: '.board {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  grid-template-rows: repeat(2, 1fr);\n}\n#hotel {\n  grid-column: span 2;\n}',
      requires: ['grid-column', 'span'],
      asserts: [],
      lesson: {
        learned: 'grid-column: span 2 makes an item stretch across two column tracks without naming line numbers. The remaining items auto-flow around what it leaves behind.',
        wild: 'In the wild: a featured card that spans a full row of a product grid.',
        tip: 'Tip: span 2 says "however wide 2 tracks are here". Line numbers (1 / 3) pin the item to exact tracks. Both are valid — pick per situation.'
      }
    },
    {
      id: 'skyline-lines',
      n: 6,
      title: 'Skyline Lines',
      concept: 'grid lines & negative line numbers',
      brief: 'The council demands an exact skyline: a big 2×2 tower block, two shops stacked in the last column, and a plaza across the ENTIRE bottom row.',
      template: { cols: [1, 1, 1], rows: [1, 1, 1], gap: 0 },
      items: [
        { id: 'towera', emoji: '\uD83D\uDDFC', name: 'Tower A', lines: { c: [1, 3], r: [1, 3] } },
        { id: 'towerb', emoji: '\uD83C\uDFEC', name: 'Tower B', lines: { c: [3, 4], r: [1, 2] } },
        { id: 'cinema', emoji: '\uD83C\uDFAC', name: 'Cinema', lines: { c: [3, 4], r: [2, 3] } },
        { id: 'plaza', emoji: '\u26BD', name: 'Plaza', lines: { c: [1, 4], r: [3, 4] } }
      ],
      starter: '.board {\n  /* 3 columns, 3 rows */\n}\n\n#towera { /* columns 1 to 3, rows 1 to 3 */ }\n#towerb { }\n#cinema { }\n#plaza  { /* the full bottom row — think NEGATIVE */ }\n',
      solution: '.board {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: repeat(3, 1fr);\n}\n#towera { grid-column: 1 / 3; grid-row: 1 / 3; }\n#towerb { grid-column: 3 / 4; grid-row: 1 / 2; }\n#cinema { grid-column: 3 / 4; grid-row: 2 / 3; }\n#plaza  { grid-column: 1 / -1; grid-row: 3 / 4; }',
      requires: ['grid-column', 'grid-row', '-1'],
      asserts: [],
      lesson: {
        learned: 'Explicit placement uses track lines: grid-column: 3 / 4 starts at line 3, ends at line 4. Negative numbers count from the END: -1 is the last line, so 1 / -1 always means "all the way across".',
        wild: 'In the wild: full-bleed hero sections that ignore the page\'s content margins.',
        tip: 'Tip: grid-column: 1 / -1 is the idiomatic "span every column". It keeps working when you add columns later.'
      }
    },
    {
      id: 'city-blocks',
      n: 7,
      title: 'City Blocks',
      concept: 'grid-template-areas',
      brief: 'Time to zone the city like a map: park on top-left, market down the right side, school and plaza in the middle, homes and factories along the bottom. Name the zones!',
      template: { cols: [1, 1, 1], rows: [1, 1, 1], gap: 0 },
      items: [
        { id: 'park', emoji: '\uD83C\uDF33', name: 'Park', lines: { c: [1, 3], r: [1, 2] } },
        { id: 'market', emoji: '\uD83C\uDFEA', name: 'Market', lines: { c: [3, 4], r: [1, 3] } },
        { id: 'school', emoji: '\uD83C\uDFEB', name: 'School', lines: { c: [1, 2], r: [2, 3] } },
        { id: 'plaza', emoji: '\u26FD', name: 'Plaza', lines: { c: [2, 3], r: [2, 3] } },
        { id: 'homes', emoji: '\uD83C\uDFD8', name: 'Homes', lines: { c: [1, 3], r: [3, 4] } },
        { id: 'factory', emoji: '\uD83C\uDFED', name: 'Factory', lines: { c: [3, 4], r: [3, 4] } }
      ],
      starter: '.board {\n  /* 3 columns, 3 rows, and a map made of NAMES:\n     "park  park   market"\n     "school plaza market"\n     "homes homes  factory" */\n}\n\n#park    { }\n#market  { }\n#school  { }\n#plaza   { }\n#homes   { }\n#factory { }\n',
      solution: '.board {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: repeat(3, 1fr);\n  grid-template-areas:\n    "park park market"\n    "school plaza market"\n    "homes homes factory";\n}\n#park    { grid-area: park; }\n#market  { grid-area: market; }\n#school  { grid-area: school; }\n#plaza   { grid-area: plaza; }\n#homes   { grid-area: homes; }\n#factory { grid-area: factory; }',
      requires: ['grid-template-areas', 'grid-area'],
      asserts: [
        { on: 'board', prop: 'grid-template-areas', op: '!=', value: 'none' }
      ],
      lesson: {
        learned: 'grid-template-areas draws the layout as a picture: each quoted string is a row, each name a cell, and every occurrence of a name becomes one rectangle. Assign an item with grid-area: name. A . marks an empty cell.',
        wild: 'In the wild: whole page layouts — header / sidebar / main / footer — readable at a glance.',
        tip: 'Tip: every row string must have the same number of names, and each name must form a single rectangle, or the whole declaration is invalid.'
      }
    },
    {
      id: 'town-square',
      n: 8,
      title: 'Town Square (Boss)',
      concept: 'The full app-shell layout',
      brief: 'Final challenge: build the town square — a header across the top, navigation on the left, the main square in the middle (twice as wide), an aside on the right, and a footer across the bottom. Use named areas and a 16px gap.',
      template: { cols: [1, 2, 1], rows: [1, 2, 1], gap: 16 },
      items: [
        { id: 'header', emoji: '\uD83C\uDFDB', name: 'Header', lines: { c: [1, 4], r: [1, 2] } },
        { id: 'nav', emoji: '\uD83E\uDDED', name: 'Nav', lines: { c: [1, 2], r: [2, 3] } },
        { id: 'main', emoji: '\uD83C\uDFD7', name: 'Main', lines: { c: [2, 3], r: [2, 3] } },
        { id: 'aside', emoji: '\uD83D\uDCA1', name: 'Aside', lines: { c: [3, 4], r: [2, 3] } },
        { id: 'footer', emoji: '\uD83C\uDF61', name: 'Footer', lines: { c: [1, 4], r: [3, 4] } }
      ],
      starter: '.board {\n  /* The app shell: areas + gap + a 1fr 2fr 1fr middle row of columns */\n}\n\n#header { }\n#nav    { }\n#main   { }\n#aside  { }\n#footer { }\n',
      solution: '.board {\n  display: grid;\n  gap: 16px;\n  grid-template-columns: 1fr 2fr 1fr;\n  grid-template-rows: 1fr 2fr 1fr;\n  grid-template-areas:\n    "header header header"\n    "nav main aside"\n    "footer footer footer";\n}\n#header { grid-area: header; }\n#nav    { grid-area: nav; }\n#main   { grid-area: main; }\n#aside  { grid-area: aside; }\n#footer { grid-area: footer; }',
      requires: ['grid-template-areas', 'gap'],
      asserts: [],
      lesson: {
        learned: 'You just built the app shell: the layout behind nearly every dashboard and website. Named areas + fr weights + gap is the whole recipe — and it reads like the design it produces.',
        wild: 'In the wild: this exact pattern (with different names) powers Gmail, Stripe dashboards, and most admin UIs.',
        tip: 'Tip: pair areas with a media query that redefines grid-template-areas — the same markup becomes a mobile layout by rewriting one declaration.'
      }
    }
  ];

  root.GRIDVILLE_LEVELS = LEVELS;
  if (typeof module !== 'undefined' && module.exports) module.exports = LEVELS;
})(typeof window !== 'undefined' ? window : globalThis);
