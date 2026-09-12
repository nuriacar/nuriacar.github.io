/*
 * nuriacar.com — vanilla JS (IIFE'ler, bağımlılıksız)
 * 1) Tema değiştirme (localStorage + data-mode)
 * 2) Mobil menü (hamburger, aria)
 * 3) Site içi arama (search.json, Türkçe karakter normalizasyonu)
 * 4) Başlık çapaları (içeriğe dokunmadan id + # link)
 */

/* ---------- 1) Tema ---------- */

(function () {
  'use strict';

  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  btn.addEventListener('click', function () {
    var root = document.documentElement;
    var mode = root.getAttribute('data-mode') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-mode', mode);
    try {
      localStorage.setItem('na-mode', mode);
    } catch (e) { /* yoksay */ }
    document.cookie = 'na-mode=' + mode + ';path=/;max-age=31536000;samesite=lax';
  });
})();

/* ---------- 2) Mobil menü ---------- */

(function () {
  'use strict';

  var toggle = document.getElementById('nav-toggle');
  var menu = document.getElementById('nav-mobile');
  if (!toggle || !menu) return;

  function close() {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) close();
  });
})();

/* ---------- 3) Arama ---------- */

(function () {
  'use strict';

  var input = document.getElementById('search-input');
  var box = document.getElementById('search-results');
  if (!input || !box) return;

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
    if (!q) { box.classList.remove('is-open'); return; }
    if (!results.length) {
      var e = document.createElement('div');
      e.className = 'search__empty';
      e.textContent = 'sonuç yok';
      box.appendChild(e);
      box.classList.add('is-open');
      return;
    }
    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      var a = document.createElement('a');
      a.className = 'search__result';
      a.setAttribute('role', 'option');
      a.href = r.url;
      var t = document.createElement('div');
      t.className = 'search__result-title';
      t.textContent = r.title;
      var m = document.createElement('div');
      m.className = 'search__result-meta';
      var tp = (r.topics || []).map(topicTitle).join(' · ');
      m.textContent = (r.date || '') + (tp ? ' · ' + tp : '');
      a.appendChild(t);
      a.appendChild(m);
      box.appendChild(a);
    }
    box.classList.add('is-open');
  }

  function select(dir) {
    var items = box.querySelectorAll('.search__result');
    if (!items.length) return;
    if (sel >= 0) items[sel].classList.remove('is-selected');
    sel = (sel + dir + items.length) % items.length;
    items[sel].classList.add('is-selected');
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
      box.classList.remove('is-open');
      input.blur();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      select(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      select(-1);
    } else if (e.key === 'Enter' && sel >= 0) {
      var items = box.querySelectorAll('.search__result');
      if (items[sel]) window.location.href = items[sel].href;
    }
  });

  document.addEventListener('click', function (e) {
    if (!box.contains(e.target) && e.target !== input) box.classList.remove('is-open');
  });
})();

/* ---------- 4) TR [ EN ⇣ ] bağlaştırma ---------- */

(function () {
  'use strict';

  var heads = Array.prototype.slice.call(
    document.querySelectorAll('.content h1, .content h2, .content h3, .content h4, .content h5, .content h6')
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
    h.classList.add('lang');
    next.classList.add('lang');
    h.innerHTML = 'TR [ <a class="lang-jump" href="#' + next.id + '">EN ⇣</a> ]';
    next.innerHTML = 'EN [ <a class="lang-jump" href="#' + h.id + '">TR ⇡</a> ]';
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

  document.querySelectorAll('article .content h2, article .content h3, article .content h4').forEach(function (h) {
    if (h.id) return;
    if (h.classList.contains('lang')) return;
    var base = slugify(h.textContent);
    if (!base) return;
    var id = base, n = 2;
    while (used[id]) { id = base + '-' + n; n++; }
    used[id] = true;
    h.id = id;
  });
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
