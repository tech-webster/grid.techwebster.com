/* The displayed fractions and rendered grid always share one animation state. */
(function () {
  'use strict';
  window.addEventListener('hashchange', function () {
    if (location.hash === '#play') location.replace('play/' + location.search + location.hash);
  });
  if (location.hash === '#play' || /[?&](level|demo|selftest)=/.test(location.search)) {
    location.replace('play/' + location.search + location.hash);
    return;
  }
  var board = document.getElementById('preview-board');
  var code = document.getElementById('preview-columns');
  var button = document.getElementById('preview-toggle');
  var reduced = matchMedia('(prefers-reduced-motion: reduce)');
  var paused = reduced.matches;
  var elapsed = 0, previous = null;
  button.hidden = false;
  function label() {
    button.textContent = paused ? 'Play animation' : 'Pause animation';
    button.setAttribute('aria-pressed', String(paused));
  }
  button.addEventListener('click', function () { paused = !paused; previous = null; label(); });
  reduced.addEventListener('change', function () { paused = reduced.matches; previous = null; label(); });
  document.addEventListener('visibilitychange', function () { previous = null; });
  function frame(now) {
    if (!paused && !document.hidden) {
      if (previous !== null) elapsed += Math.min(now - previous, 64);
      previous = now;
      var phase = elapsed % 8000;
      var weight = phase < 1500 ? 1 : phase < 3500 ? 1 + (phase - 1500) / 2000 : phase < 5500 ? 2 : phase < 7500 ? 2 - (phase - 5500) / 2000 : 1;
      var columns = Number(weight.toFixed(2)) + 'fr 1fr 1fr';
      board.style.gridTemplateColumns = columns;
      code.textContent = columns;
    } else previous = null;
    requestAnimationFrame(frame);
  }
  label(); requestAnimationFrame(frame);
})();
