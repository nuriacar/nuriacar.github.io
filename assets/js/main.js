/*
 * nuriacar.com — vanilla JS (IIFE'ler, bağımlılıksız)
 * 1) Tema değiştirme (localStorage + data-mode + SVG semboller)
 * 2) Mobil menü (hamburger, aria)
 * 3) Site içi arama (search.json, Türkçe karakter normalizasyonu)
 * 4) Başlık çapaları (içeriğe dokunmadan id + # link)
 */

/* ---------- 1) Tema ---------- */

(function () {
  'use strict';

  /* Ubuntu Mono'da ☀/☾ glifi yok — semboller SVG (currentColor) */
  var SUN = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><g stroke="currentColor" stroke-width="1.8" stroke-linecap="square"><line x1="12" y1="1.5" x2="12" y2="4.5"/><line x1="12" y1="19.5" x2="12" y2="22.5"/><line x1="1.5" y1="12" x2="4.5" y2="12"/><line x1="19.5" y1="12" x2="22.5" y2="12"/><line x1="4.6" y1="4.6" x2="6.7" y2="6.7"/><line x1="17.3" y1="17.3" x2="19.4" y2="19.4"/><line x1="19.4" y1="4.6" x2="17.3" y2="6.7"/><line x1="6.7" y1="17.3" x2="4.6" y2="19.4"/></g></svg>';
  var MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 13.2A8.4 8.4 0 1 1 10.8 3.6a6.8 6.8 0 0 0 9.6 9.6z" fill="currentColor"/></svg>';

  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function paint(mode) {
    btn.innerHTML = mode === 'light' ? MOON : SUN;
    btn.setAttribute('aria-label', mode === 'light' ? 'Karanlık temaya geç' : 'Aydınlık temaya geç');
  }

  paint(document.documentElement.getAttribute('data-mode') || 'dark');

  btn.addEventListener('click', function () {
    var root = document.documentElement;
    var mode = root.getAttribute('data-mode') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-mode', mode);
    paint(mode);
    try {
      localStorage.setItem('na-mode', mode);
    } catch (e) { /* yoksay */ }
    document.cookie = 'na-mode=' + mode + ';path=/;max-age=31536000;samesite=lax';
  });
})();

/* ---------- 2) Mobil menü (TDD: .nav.open) ---------- */

(function () {
  'use strict';

  var toggle = document.getElementById('nav-toggle');
  var nav = toggle ? toggle.closest('.nav') : null;
  var links = document.getElementById('nav-links');
  if (!toggle || !nav) return;

  function close() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  if (links) {
    links.addEventListener('click', function (e) {
      if (e.target && e.target.tagName === 'A') close();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) close();
  });
})();

/* ---------- 3) Arama ---------- */

(function () {
  'use strict';

  var input = document.getElementById('search-input');
  var box = document.getElementById('search-results');
  var dd = box ? box.closest('.dropdown') : null;
  if (!input || !box || !dd) return;

  var TR_MAP = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'â': 'a', 'î': 'i', 'û': 'u', 'İ': 'i' };

  function norm(s) {
    s = String(s || '');
    return s.replace(/[çğışöüâîûİ]/g, function (c) { return TR_MAP[c] || c; })
           .toLowerCase()
           .replace(/\s+/g, ' ')
           .trim();
  }

  var INDEX = null;

  function load(fn) {
    if (INDEX) return fn();
    var x = new XMLHttpRequest();
    x.open('GET', '/search.json', true);
    x.onload = function () {
      try { INDEX = JSON.parse(x.responseText); } catch (e) { INDEX = []; }
      fn();
    };
    x.onerror = function () { INDEX = []; fn(); };
    x.send();
  }

  function score(item, q) {
    var t = norm(item.title);
    var x = norm(item.text);
    var s = 0;
    if (t.indexOf(q) !== -1) s += 10;
    if (t.indexOf(q) === 0) s += 5;
    var parts = q.split(' ');
    for (var i = 0; i < parts.length; i++) {
      if (parts[i] && x.indexOf(parts[i]) !== -1) s += 1;
      if (parts[i] && t.indexOf(parts[i]) !== -1) s += 3;
    }
    return s;
  }

  function topics() {
    var el = document.getElementById('na-topics-data');
    if (el) {
      try { return JSON.parse(el.textContent); } catch (e) { }
    }
    return {};
  }

  function topicTitle(slug) {
    return topics()[slug] || slug;
  }

  var sel = -1;

  function render(results, q) {
    box.innerHTML = '';
    sel = -1;
    if (!q) { dd.classList.remove('open'); return; }
    if (!results.length) {
      var e = document.createElement('div');
      e.className = 'empty';
      e.textContent = 'sonuç yok';
      box.appendChild(e);
      dd.classList.add('open');
      return;
    }
    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      var a = document.createElement('a');
      a.setAttribute('role', 'option');
      a.href = r.url;
      var t = document.createElement('strong');
      t.textContent = r.title;
      var m = document.createElement('div');
      m.className = 'card__meta';
      var tp = (r.topics || []).map(topicTitle).join(' · ');
      m.textContent = (r.date || '') + (tp ? ' · ' + tp : '');
      a.appendChild(t);
      a.appendChild(m);
      box.appendChild(a);
    }
    dd.classList.add('open');
  }

  function select(dir) {
    var items = box.querySelectorAll('a');
    if (!items.length) return;
    if (sel >= 0) items[sel].removeAttribute('aria-selected');
    sel = (sel + dir + items.length) % items.length;
    items[sel].setAttribute('aria-selected', 'true');
  }

  var timer = null;

  input.addEventListener('input', function () {
    var q = norm(input.value);
    clearTimeout(timer);
    timer = setTimeout(function () {
      load(function () {
        if (!q) return render([], '');
        var out = [];
        for (var i = 0; i < INDEX.length; i++) {
          var s = score(INDEX[i], q);
          if (s > 0) { INDEX[i]._s = s; out.push(INDEX[i]); }
        }
        out.sort(function (a, b) { return b._s - a._s; });
        render(out.slice(0, 8), q);
      });
    }, 120);
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      dd.classList.remove('open');
      input.blur();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      select(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      select(-1);
    } else if (e.key === 'Enter' && sel >= 0) {
      var items = box.querySelectorAll('a');
      if (items[sel]) window.location.href = items[sel].href;
    }
  });

  document.addEventListener('click', function (e) {
    if (!dd.contains(e.target)) dd.classList.remove('open');
  });
})();

/* ---------- 4) TR [ EN ⇣ ] bağlaştırma ---------- */

(function () {
  'use strict';

  var heads = Array.prototype.slice.call(
    document.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6')
  );

  heads.forEach(function (h, i) {
    var txt = (h.textContent || '').replace(/\s+/g, ' ').trim();
    if (txt !== 'TR [ EN ⇣ ]') return;

    var next = null;
    for (var j = i + 1; j < heads.length; j++) {
      if ((heads[j].textContent || '').replace(/\s+/g, ' ').trim() === 'EN') {
        next = heads[j];
        break;
      }
    }
    if (!next) return;

    if (!next.id) next.id = 'en-bolum-' + i;
    if (!h.id) h.id = 'tr-bolum-' + i;
    h.classList.add('chip');
    next.classList.add('chip');
    h.innerHTML = 'TR [ <a href="#' + next.id + '">EN ⇣</a> ]';
    next.innerHTML = 'EN [ <a href="#' + h.id + '">TR ⇡</a> ]';
  });
})();

/* ---------- 5) Başlık çapaları (ID atama — görünür # link yok) ---------- */

(function () {
  'use strict';

  var TR = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u' };

  function slugify(s) {
    return String(s || '')
      .replace(/[çğıöşüÇĞİÖŞÜ]/g, function (c) { return TR[c.toLowerCase()] || ''; })
      .toLowerCase()
      .replace(/[^a-z0-9\u0400-\u04FF]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);
  }

  var used = {};

  document.querySelectorAll('main article h2, main article h3, main article h4').forEach(function (h) {
    if (h.id) return;
    if (h.classList.contains('chip')) return;
    var base = slugify(h.textContent);
    if (!base) return;
    var id = base, n = 2;
    while (used[id]) { id = base + '-' + n; n++; }
    used[id] = true;
    h.id = id;
  });
})();

/* ---------- 6) Lightbox: .box--media görselleri — TDD modal deseni ---------- */

(function () {
  'use strict';

  var modal = document.getElementById('lightbox');
  if (!modal) return;
  var img = document.getElementById('lightbox__img');
  var photos = Array.prototype.slice.call(document.querySelectorAll('.box img:not(a img)'));
  if (!photos.length) return;
  var idx = -1;

  function show(i) {
    idx = (i + photos.length) % photos.length;
    img.src = photos[idx].src;
    img.alt = photos[idx].alt;
  }

  photos.forEach(function (photo, i) {
    photo.style.cursor = 'zoom-in';
    photo.addEventListener('click', function () {
      show(i);
      modal.hidden = false;
    });
  });

  modal.addEventListener('click', function (e) {
    if (e.target.closest('.btn')) return;
    modal.hidden = true;
  });

  document.getElementById('lightbox__prev').addEventListener('click', function () { show(idx - 1); });
  document.getElementById('lightbox__next').addEventListener('click', function () { show(idx + 1); });

  document.addEventListener('keydown', function (e) {
    if (modal.hidden) return;
    if (e.key === 'Escape') { modal.hidden = true; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
  });
})();

/* ---------- 7) Kod bloklarına kopyala: shell'de KOMUT BAŞINA düğme ----------
 * Shell ailesi bloklar: her copy tek komutu alır — \ devam satırları
 * birleşik, yorum (#) satırları hariç. Diğer diller: blok başına tek
 * düğme, birebir kopya. Butonlar .highlight katmanında satır hizalı;
 * konum CSSOM ile (inline style attr CSP'ye takılır). */

(function () {
  'use strict';

  var COPY = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 8V4a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h4" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
  var TICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2"/></svg>';

  var SHELL = /^(sh|bash|shell|zsh|console|terminal)$/;

  function arm(btn, getText) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var text = getText();
      function done() {
        btn.innerHTML = TICK;
        btn.setAttribute('aria-label', 'Kopyalandı');
        setTimeout(function () {
          btn.innerHTML = COPY;
          btn.setAttribute('aria-label', 'Kopyala');
        }, 1200);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (err) { /* yoksay */ }
        document.body.removeChild(ta);
        done();
      }
    });
  }

  function plainCopy(btn, pre) {
    var code = pre.querySelector('code') || pre;
    arm(btn, function () { return code.textContent; });
  }

  function commandUnits(raw) {
    var lines = raw.split('\n');
    var units = [];
    var buf = null;
    var startLine = 0;
    for (var i = 0; i < lines.length; i++) {
      var ln = lines[i];
      var isComment = /^\s*#/.test(ln);
      var isBlank = !ln.trim();
      if (buf === null) {
        if (isComment || isBlank) continue;
        buf = [ln];
        startLine = i;
      } else {
        buf.push(ln);
      }
      var joined = buf.join('\n');
      if (!/\\\s*$/.test(ln)) {
        var text = joined
          .replace(/\\\s*\n\s*/g, ' ')
          .split('\n')
          .filter(function (l) { return !/^\s*#/.test(l); })
          .join('\n')
          .replace(/^\s+|\s+$/g, '');
        if (text) units.push({ line: startLine, text: text });
        buf = null;
      }
    }
    return units;
  }

  function shellButtons(pre) {
    var code = pre.querySelector('code') || pre;
    var host = pre.closest('.highlight') || pre;
    var cs = getComputedStyle(pre);
    var lineH = parseFloat(cs.lineHeight) || 28;
    var padTop = parseFloat(cs.paddingTop) || 0;
    var preTop = pre.offsetTop;
    var btnH = 24;
    /* content-visibility: ekran dışı blokta innerText BOŞ döner
       (Chrome) — textContent düzen-bağımsızdır, hep doğrudur */
    var units = commandUnits(code.textContent);
    units.forEach(function (u) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn--copy';
      btn.setAttribute('aria-label', 'Komutu kopyala');
      btn.title = 'Komutu kopyala';
      btn.innerHTML = COPY;
      btn.dataset.cmd = u.text;
      var y = preTop + padTop + u.line * lineH + (lineH - btnH) / 2;
      btn.style.top = y + 'px';
      host.appendChild(btn);
      arm(btn, function () { return u.text; });
    });
    return units.length;
  }

  document.querySelectorAll('main pre').forEach(function (pre) {
    var wrap = pre.closest('[class*="language-"]');
    var langMatch = wrap ? (wrap.className.match(/language-([\w-]+)/) || []) : [];
    var lang = langMatch[1] || '';
    if (SHELL.test(lang)) {
      var n = shellButtons(pre);
      if (n === 0) return;
      return;
    }
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn--copy';
    btn.setAttribute('aria-label', 'Kodu kopyala');
    btn.title = 'Kopyala';
    btn.innerHTML = COPY;
    pre.appendChild(btn);
    plainCopy(btn, pre);
  });
})();

/* ---------- 8) Jenerik etkileşim: modal / accordion / dropdown ---------- */

(function () {
  'use strict';

  /* Modal: [data-modal-open="id"] açar; [data-modal-close], ESC, backdrop kapatır */
  function closeModal(m) {
    if (!m) return;
    m.hidden = true;
    document.removeEventListener('keydown', escHandler);
  }
  function escHandler(e) {
    if (e.key === 'Escape') {
      closeModal(document.querySelector('.modal:not([hidden])'));
    }
  }
  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-modal-open]');
    if (opener) {
      var m = document.getElementById(opener.getAttribute('data-modal-open'));
      if (!m) return;
      m.hidden = false;
      document.addEventListener('keydown', escHandler);
      return;
    }
    if (e.target.closest('[data-modal-close]')) {
      closeModal(e.target.closest('.modal'));
      return;
    }
    if (e.target.classList && e.target.classList.contains('modal__backdrop-close')) {
      closeModal(e.target.closest('.modal'));
    }
  });

  /* Native accordion (<details>): derin bağlantı gelirse (#harf vb.)
     ilgili kapalı bloğu aç */
  if (location.hash) {
    var t = document.getElementById(location.hash.slice(1));
    if (t && t.tagName === 'DETAILS') t.open = true;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var el = document.getElementById(a.getAttribute('href').slice(1));
    if (el && el.tagName === 'DETAILS') el.open = true;
  });

  /* Dropdown: tetikleyici toggle, dışarı tıklama kapat */
  document.querySelectorAll('.dropdown').forEach(function (dd) {
    var trigger = dd.querySelector('[data-dropdown-toggle]') || dd.querySelector('button');
    if (!trigger) return;
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      dd.classList.toggle('open');
    });
  });
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.dropdown.open').forEach(function (dd) {
      if (!dd.contains(e.target)) dd.classList.remove('open');
    });
  });
})();

/* ---------- 9) Canlı simülasyonlar: Conway Life + Go (index hero) ---------- */

(function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Tema değişince canvas renkleri yeniden okunur — cache init'te bir kez
     yapılmamalı; data-mode değişiminde refresh kancaları tetiklenir. */
  var simRefresh = [];

  /* --- Conway Game of Life --- */
  (function () {
    var canvas = document.getElementById('life');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var cellSize = 8;
    var cols, rows, grid, age;
    var gen = 0;
    var interval = 150;
    var timer;

    function restartLoop(ms) {
      interval = ms;
      clearInterval(timer);
      timer = setInterval(loop, interval);
    }

    function resize() {
      canvas.style.width = '97%';
      canvas.style.height = 'auto';
      canvas.style.aspectRatio = '1 / 1';
      /* Retina: canvas'ı cihaz pikselinde rasterle — yoksa tarayıcı 2x
         upscale eder ve hücreler flu görünür */
      var dpr = Math.max(1, window.devicePixelRatio || 1);
      var r = canvas.getBoundingClientRect();
      canvas.width = Math.floor(r.width * dpr);
      canvas.height = Math.floor(r.height * dpr);
      cellSize = 8 * dpr;
      cols = Math.floor(canvas.width / cellSize);
      rows = Math.floor(canvas.height / cellSize);
    }

    function makeGrid() {
      return new Uint8Array(cols * rows);
    }

    function idx(x, y) {
      return y * cols + x;
    }

    function randomize() {
      grid = makeGrid();
      age = makeGrid();
      for (var i = 0; i < grid.length; i++) {
        grid[i] = Math.random() < 0.3 ? 1 : 0;
        age[i] = grid[i] ? 1 : 0;
      }
      gen = 0;
    }

    function seedGliders() {
      var patterns = [
        [[0,1],[1,2],[2,0],[2,1],[2,2]],
        [[0,0],[0,1],[0,2],[1,0],[2,1]],
        [[0,2],[1,0],[1,2],[2,1],[2,2]],
        [[0,1],[1,2],[2,0],[2,1],[2,2]],
        [[0,0],[1,0],[1,1],[2,1],[2,2]],
        [[0,1],[0,2],[1,0],[1,1],[2,2]]
      ];
      for (var p = 0; p < patterns.length; p++) {
        var ox = 5 + Math.floor(Math.random() * (cols - 15));
        var oy = 5 + Math.floor(Math.random() * (rows - 15));
        for (var c = 0; c < patterns[p].length; c++) {
          var x = ox + patterns[p][c][0];
          var y = oy + patterns[p][c][1];
          if (x >= 0 && x < cols && y >= 0 && y < rows) {
            grid[idx(x, y)] = 1;
            age[idx(x, y)] = 1;
          }
        }
      }
    }

    function neighbors(x, y) {
      var n = 0;
      for (var dy = -1; dy <= 1; dy++) {
        for (var dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          var nx = (x + dx + cols) % cols;
          var ny = (y + dy + rows) % rows;
          n += grid[idx(nx, ny)];
        }
      }
      return n;
    }

    function step() {
      var next = makeGrid();
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          var i = idx(x, y);
          var n = neighbors(x, y);
          if (grid[i]) {
            next[i] = (n === 2 || n === 3) ? 1 : 0;
          } else {
            next[i] = (n === 3) ? 1 : 0;
          }
          if (next[i]) {
            age[i] = Math.min((age[i] || 0) + 1, 20);
          } else {
            age[i] = 0;
          }
        }
      }
      grid = next;
      gen++;
    }

    var cachedAccent, cachedAccentBright;

    function cacheColors() {
      var cs = getComputedStyle(document.documentElement);
      cachedAccent = cs.getPropertyValue('--accent').trim();
      cachedAccentBright = cs.getPropertyValue('--accent-bright').trim();
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          var i = idx(x, y);
          if (grid[i]) {
            var a = age[i] || 1;
            var alpha = Math.min(0.3 + (a / 20) * 0.7, 1.0);
            ctx.fillStyle = a > 5 ? cachedAccentBright : cachedAccent;
            ctx.globalAlpha = alpha;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
          }
        }
      }
      ctx.globalAlpha = 1.0;
    }

    function updateInfo() {
      var pop = 0;
      for (var i = 0; i < grid.length; i++) pop += grid[i];
      var genEl = document.getElementById('gen');
      var popEl = document.getElementById('pop');
      if (genEl) genEl.textContent = 'GEN ' + gen;
      if (popEl) popEl.textContent = 'POP ' + pop;
    }

    function resetCheck() {
      var pop = 0;
      for (var i = 0; i < grid.length; i++) pop += grid[i];
      if (pop === 0) {
        randomize();
        seedGliders();
      }
      if (gen > 0 && gen % 30 === 0) {
        seedGliders();
      }
    }

    function loop() {
      step();
      draw();
      updateInfo();
      resetCheck();
    }

    function reset() {
      resize();
      randomize();
      seedGliders();
      draw();
      updateInfo();
    }

    cacheColors();
    reset();

    simRefresh.push(function () { cacheColors(); draw(); });

    if (!reduced) timer = setInterval(loop, interval);

    document.getElementById('life-reset').addEventListener('click', reset);

    var speedBtns = document.querySelectorAll('.life-speed');
    speedBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        speedBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        if (!reduced) restartLoop(parseInt(btn.getAttribute('data-ms'), 10));
      });
    });

    window.addEventListener('resize', function () {
      clearInterval(timer);
      reset();
      if (!reduced) timer = setInterval(loop, interval);
    });
  })();

  /* --- Go simülasyonu --- */
  (function () {
    var canvas = document.getElementById('go-board');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    var SIZE = 19;
    var EMPTY = 0, BLACK = 1, WHITE = 2;
    var board, moveCount;
    var interval = 150;
    var timer;
    var cellPx, padPx;
    var capturedByBlack = 0;
    var capturedByWhite = 0;
    var koPoint = null;

    function init() {
      board = [];
      for (var i = 0; i < SIZE * SIZE; i++) board[i] = EMPTY;
      moveCount = 0;
      capturedByBlack = 0;
      capturedByWhite = 0;
      koPoint = null;
    }

    function at(x, y) {
      if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return -1;
      return board[y * SIZE + x];
    }

    function set(x, y, v) {
      board[y * SIZE + x] = v;
    }

    function neighbors(x, y) {
      var n = [];
      if (x > 0) n.push([x - 1, y]);
      if (x < SIZE - 1) n.push([x + 1, y]);
      if (y > 0) n.push([x, y - 1]);
      if (y < SIZE - 1) n.push([x, y + 1]);
      return n;
    }

    function getGroup(sx, sy) {
      var color = at(sx, sy);
      if (color === EMPTY) return { stones: [], liberties: 0 };
      var visited = {};
      var stones = [];
      var libs = {};
      var stack = [[sx, sy]];
      while (stack.length) {
        var p = stack.pop();
        var k = p[0] + ',' + p[1];
        if (visited[k]) continue;
        visited[k] = true;
        if (at(p[0], p[1]) !== color) continue;
        stones.push(p);
        var nb = neighbors(p[0], p[1]);
        for (var i = 0; i < nb.length; i++) {
          var v = at(nb[i][0], nb[i][1]);
          if (v === EMPTY) {
            libs[nb[i][0] + ',' + nb[i][1]] = true;
          } else if (v === color && !visited[nb[i][0] + ',' + nb[i][1]]) {
            stack.push(nb[i]);
          }
        }
      }
      var libCount = 0;
      for (var l in libs) libCount++;
      return { stones: stones, liberties: libCount };
    }

    function removeGroup(stones) {
      for (var i = 0; i < stones.length; i++) {
        set(stones[i][0], stones[i][1], EMPTY);
      }
    }

    function isLegal(x, y, color) {
      if (at(x, y) !== EMPTY) return false;
      if (koPoint && koPoint[0] === x && koPoint[1] === y) return false;

      set(x, y, color);
      var opp = color === BLACK ? WHITE : BLACK;
      var captured = [];

      var nb = neighbors(x, y);
      for (var i = 0; i < nb.length; i++) {
        if (at(nb[i][0], nb[i][1]) === opp) {
          var g = getGroup(nb[i][0], nb[i][1]);
          if (g.liberties === 0) {
            for (var j = 0; j < g.stones.length; j++) {
              captured.push(g.stones[j]);
            }
          }
        }
      }

      if (captured.length === 0) {
        var own = getGroup(x, y);
        if (own.liberties === 0) {
          set(x, y, EMPTY);
          return false;
        }
      }

      set(x, y, EMPTY);
      return true;
    }

    function playMove(x, y, color) {
      set(x, y, color);
      var opp = color === BLACK ? WHITE : BLACK;
      var totalCap = 0;
      var capturedStones = [];

      var nb = neighbors(x, y);
      for (var i = 0; i < nb.length; i++) {
        if (at(nb[i][0], nb[i][1]) === opp) {
          var g = getGroup(nb[i][0], nb[i][1]);
          if (g.liberties === 0) {
            totalCap += g.stones.length;
            for (var j = 0; j < g.stones.length; j++) {
              capturedStones.push(g.stones[j]);
            }
            removeGroup(g.stones);
          }
        }
      }

      if (totalCap === 1 && capturedStones.length === 1) {
        koPoint = capturedStones[0];
      } else {
        koPoint = null;
      }

      if (color === BLACK) capturedByBlack += totalCap;
      else capturedByWhite += totalCap;

      moveCount++;
      return totalCap;
    }

    function scoreMove(x, y, color) {
      var opp = color === BLACK ? WHITE : BLACK;
      var s = 0;

      var nb = neighbors(x, y);
      for (var i = 0; i < nb.length; i++) {
        var v = at(nb[i][0], nb[i][1]);
        if (v === opp) {
          var g = getGroup(nb[i][0], nb[i][1]);
          if (g.liberties === 1) s += g.stones.length * 10;
          else if (g.liberties === 2) s += g.stones.length * 3;
          else s += 1;
        } else if (v === EMPTY) {
          s += 2;
        }
      }

      var edgeDist = Math.min(x, y, SIZE - 1 - x, SIZE - 1 - y);
      if (edgeDist < 3) s -= (3 - edgeDist);
      if (edgeDist >= 3 && edgeDist <= 5) s += 1;

      return s + Math.random() * 3;
    }

    function pickMove(color) {
      var best = null;
      var bestScore = -Infinity;
      for (var y = 0; y < SIZE; y++) {
        for (var x = 0; x < SIZE; x++) {
          if (!isLegal(x, y, color)) continue;
          var s = scoreMove(x, y, color);
          if (s > bestScore) {
            bestScore = s;
            best = [x, y];
          }
        }
      }

      if (bestScore < 0.3) return null;
      return best;
    }

    var cachedAccentDark, cachedStoneBlack, cachedStoneWhite;

    function cacheColors() {
      var cs = getComputedStyle(document.documentElement);
      cachedAccentDark = cs.getPropertyValue('--accent-dark').trim();
      /* Taşlar mutlak oyun nesneleri: mod-yüzey tokenı (bg-dark/text-dim)
         light modda renk sırasını ters çeviriyordu — sabit paletten.
         Charcoal: her iki modda görünür (base03 dark zemininde kaybolur) */
      cachedStoneBlack = cs.getPropertyValue('--c-charcoal').trim();
      cachedStoneWhite = cs.getPropertyValue('--c-cool-gray').trim();
    }

    function resize() {
      canvas.style.width = '97%';
      canvas.style.height = 'auto';
      canvas.style.aspectRatio = '1 / 1';
      /* Retina: cihaz pikselinde rasterle — ızgara çizgileri keskin kalsın */
      var dpr = Math.max(1, window.devicePixelRatio || 1);
      var r = canvas.getBoundingClientRect();
      var sz = Math.floor(r.width * dpr);
      canvas.width = sz;
      canvas.height = sz;
      cellPx = sz / SIZE;
      padPx = cellPx * 0.5;
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = cachedAccentDark;
      ctx.lineWidth = 1;

      for (var i = 0; i < SIZE; i++) {
        var pos = padPx + i * cellPx;
        ctx.beginPath();
        ctx.moveTo(padPx, pos);
        ctx.lineTo(padPx + (SIZE - 1) * cellPx, pos);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos, padPx);
        ctx.lineTo(pos, padPx + (SIZE - 1) * cellPx);
        ctx.stroke();
      }

      var stars = [
        [3,3],[3,9],[3,15],
        [9,3],[9,9],[9,15],
        [15,3],[15,9],[15,15]
      ];
      var dotR = Math.max(2, cellPx * 0.12);
      ctx.fillStyle = cachedAccentDark;
      for (var s = 0; s < stars.length; s++) {
        ctx.beginPath();
        ctx.arc(padPx + stars[s][0] * cellPx, padPx + stars[s][1] * cellPx, dotR, 0, Math.PI * 2);
        ctx.fill();
      }

      var stoneR = Math.max(2, cellPx * 0.42);
      for (var y = 0; y < SIZE; y++) {
        for (var x = 0; x < SIZE; x++) {
          var v = at(x, y);
          if (v === EMPTY) continue;
          var cx = padPx + x * cellPx;
          var cy = padPx + y * cellPx;

          ctx.beginPath();
          ctx.arc(cx, cy, stoneR, 0, Math.PI * 2);
          if (v === BLACK) {
            ctx.fillStyle = cachedStoneBlack;
          } else {
            ctx.fillStyle = cachedStoneWhite;
          }
          ctx.fill();
          ctx.strokeStyle = cachedAccentDark;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    function updateInfo() {
      var moveEl = document.getElementById('go-move');
      var blackEl = document.getElementById('go-black');
      var whiteEl = document.getElementById('go-white');
      if (moveEl) moveEl.textContent = 'MOVE ' + moveCount;
      if (blackEl) blackEl.textContent = 'B ' + capturedByBlack;
      if (whiteEl) whiteEl.textContent = 'W ' + capturedByWhite;
    }

    function step() {
      var color = moveCount % 2 === 0 ? BLACK : WHITE;
      var move = pickMove(color);
      if (!move) return false;
      playMove(move[0], move[1], color);
      return true;
    }

    var passCount = 0;
    var maxMoves = SIZE * SIZE * 2;

    function loop() {
      if (moveCount >= maxMoves) {
        reset();
        return;
      }
      var ok = step();
      if (!ok) {
        passCount++;
        if (passCount >= 2) {
          clearInterval(timer);
          setTimeout(reset, 2000);
          return;
        }
      } else {
        passCount = 0;
      }
      draw();
      updateInfo();
    }

    function reset() {
      clearInterval(timer);
      resize();
      init();
      passCount = 0;
      draw();
      updateInfo();
      if (!reduced) timer = setInterval(loop, interval);
    }

    function restartLoop(ms) {
      interval = ms;
      clearInterval(timer);
      timer = setInterval(loop, interval);
    }

    cacheColors();
    resize();
    init();

    simRefresh.push(function () { cacheColors(); draw(); });

    if (reduced) {
      for (var i = 0; i < 80; i++) {
        if (!step()) break;
      }
      draw();
      updateInfo();
    } else {
      draw();
      updateInfo();
      timer = setInterval(loop, interval);
    }

    document.getElementById('go-reset').addEventListener('click', reset);

    var speedBtns = document.querySelectorAll('.go-speed');
    speedBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        speedBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        if (!reduced) restartLoop(parseInt(btn.getAttribute('data-ms'), 10));
      });
    });

    window.addEventListener('resize', function () {
      clearInterval(timer);
      resize();
      draw();
      if (!reduced) timer = setInterval(loop, interval);
    });
  })();

  /* Tema/aksan değişimi → canvas renkleri yeniden okunur ve yeniden çizilir */
  if (window.MutationObserver && simRefresh.length) {
    new MutationObserver(function () {
      simRefresh.forEach(function (fn) { fn(); });
    }).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-mode', 'data-accent']
    });
  }
})();

/* ---------- Dış linkler yeni sekmede ----------
   Farklı domaine giden her <a> target="_blank" + rel="noopener noreferrer" alır.
   site.url ile karşılaştırma; şema farkı (http/https) ve www hariç tutulur. */

(function () {
  'use strict';

  var host = (location.hostname || '').replace(/^www\./, '');

  var links = document.getElementsByTagName('a');
  for (var i = 0; i < links.length; i++) {
    var a = links[i];
    var href = a.getAttribute('href');
    if (!href) continue;
    if (href.charAt(0) === '#' || href.charAt(0) === '/') continue;
    if (a.target) continue; // yazarın açık tercihi ezilmez
    try {
      var u = new URL(href, location.href);
      var uh = (u.hostname || '').replace(/^www\./, '');
      if (uh && uh !== host) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
    } catch (e) { /* geçersiz href — dokunma */ }
  }
})();
