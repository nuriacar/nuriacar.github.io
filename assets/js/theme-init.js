/* Pre-paint tema ilklendirici — harici, bloklayan, head'de CSS'ten önce yüklenir.
 * Sıra: localStorage → cookie → sistem tercihi → dark. */
(function () {
  var m = null;
  try { m = localStorage.getItem('na-mode'); } catch (e) { }
  if (m !== 'light' && m !== 'dark') {
    var cm = document.cookie.match(/(?:^|;\s*)na-mode=(light|dark)/);
    if (cm) m = cm[1];
  }
  if (m !== 'light' && m !== 'dark') {
    m = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  document.documentElement.setAttribute('data-mode', m);
})();
