/* Archana's Magic Spoon - concept demo, standalone static build */
(function () {
  'use strict';

  /* --- product tile expand/collapse --- */
  document.querySelectorAll('.ptile-top').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var detail = btn.parentElement.querySelector('.ptile-detail');
      if (!detail) return;
      var open = detail.hasAttribute('hidden') ? false : true;
      if (open) { detail.setAttribute('hidden', ''); btn.setAttribute('aria-expanded', 'false'); }
      else { detail.removeAttribute('hidden'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* --- choice rows (single-select pill groups) --- */
  function selectChoice(row, value) {
    row.querySelectorAll('.choice-btn').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-value') === value ? 'true' : 'false');
    });
  }
  function choiceValue(row) {
    var b = row.querySelector('.choice-btn[aria-pressed="true"]');
    return b ? b.getAttribute('data-value') : null;
  }

  /* --- menu page: category filter --- */
  var menuRow = document.querySelector('.choice-row[data-choice="menu-cat"]');
  var menuGrid = document.getElementById('menuGrid');
  if (menuRow && menuGrid) {
    menuRow.addEventListener('click', function (e) {
      var b = e.target.closest('.choice-btn'); if (!b) return;
      selectChoice(menuRow, b.getAttribute('data-value'));
      var cat = choiceValue(menuRow);
      menuGrid.querySelectorAll('.ptile').forEach(function (t) {
        t.style.display = (cat === 'All' || t.getAttribute('data-cat') === cat) ? '' : 'none';
      });
    });
  }

  /* --- home page: menu preview filter (max 6 rows) --- */
  var homeRow = document.querySelector('.choice-row[data-choice="home-cat"]');
  var homeRows = document.getElementById('homeMenuRows');
  if (homeRow && homeRows) {
    var applyHome = function () {
      var cat = choiceValue(homeRow);
      var shown = 0;
      homeRows.querySelectorAll('.ams-menurow').forEach(function (r) {
        var ok = (cat === 'All' || r.getAttribute('data-cat') === cat) && shown < 6;
        r.style.display = ok ? '' : 'none';
        if (ok) shown++;
      });
    };
    homeRow.addEventListener('click', function (e) {
      var b = e.target.closest('.choice-btn'); if (!b) return;
      selectChoice(homeRow, b.getAttribute('data-value'));
      applyHome();
    });
    applyHome();
  }

  /* --- cake studio: live estimate --- */
  var studio = document.querySelector('.choice-row[data-choice="occasion"]');
  if (studio) {
    var sizePrices = { '0.5 kg': 499, '1 kg': 899, '2 kg': 1699 };
    var occasionExtra = { 'Birthday': 0, 'Anniversary': 300, 'Wedding': 1500, 'Just because': 0 };
    var rows = {
      occasion: document.querySelector('.choice-row[data-choice="occasion"]'),
      size: document.querySelector('.choice-row[data-choice="size"]'),
      flavour: document.querySelector('.choice-row[data-choice="flavour"]')
    };
    var msgInput = document.getElementById('cakeMessage');
    var lineEl = document.getElementById('summaryLine');
    var priceEl = document.getElementById('summaryPrice');
    var update = function () {
      var size = choiceValue(rows.size), flavour = choiceValue(rows.flavour), occasion = choiceValue(rows.occasion);
      var msg = msgInput.value.trim();
      var estimate = (sizePrices[size] || 0) + (occasionExtra[occasion] || 0);
      lineEl.textContent = size + ' ' + flavour + ' · ' + occasion + (msg ? ' · "' + msg + '"' : '');
      priceEl.textContent = '₹' + estimate.toLocaleString('en-IN');
    };
    Object.keys(rows).forEach(function (k) {
      rows[k].addEventListener('click', function (e) {
        var b = e.target.closest('.choice-btn'); if (!b) return;
        selectChoice(rows[k], b.getAttribute('data-value'));
        update();
      });
    });
    msgInput.addEventListener('input', update);
    update();
  }

  /* --- Guilt-Free Goodies intro (plays once per session, skippable, reduced-motion safe) --- */
  var intro = document.getElementById('gfgIntro');
  if (intro) {
    var wrap = document.getElementById('gfgHeroWrap');
    var below = document.getElementById('gfgBelow');
    var live = document.getElementById('gfgIntroLive');
    var played = false;
    try { played = sessionStorage.getItem('gfgIntroPlayed') === '1'; } catch (e) {}
    var reduced = false;
    try { reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

    var finish = function () {
      intro.remove();
      wrap.classList.remove('is-covered');
      below.removeAttribute('hidden');
      document.body.classList.remove('intro-active');
      try { sessionStorage.setItem('gfgIntroPlayed', '1'); } catch (e) {}
    };

    if (played || reduced) {
      finish();
    } else {
      var ready = false;
      var startTimers = function () {
        if (ready) return;
        ready = true;
        live.removeAttribute('hidden');
        setTimeout(function () { intro.classList.add('is-outro'); }, 3350);
        setTimeout(finish, 3950);
      };
      var img = new Image();
      img.onload = startTimers;
      img.onerror = startTimers;
      img.src = 'gfg-cookie.png';
      setTimeout(startTimers, 1500);
      intro.addEventListener('click', finish);
      intro.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); finish(); } });
    }
  }
})();
