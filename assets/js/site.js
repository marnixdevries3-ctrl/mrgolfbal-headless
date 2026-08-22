/* =============================================================================
 * site.js — gedeeld gedrag voor alle pagina's
 *  1) Scroll-golfbal: rolt links→rechts, valt in de hole, Mark laat de club
 *     vallen (micdrop) onderaan de pagina.
 *  2) Scroll-reveal (.reveal → .in)
 *  3) Configurator: foto ↔ tekst wederzijds uitsluiten
 *  4) WhatsApp: overal vooringevulde tekst
 * =========================================================================== */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 4) WhatsApp vooringevulde tekst (vangt ook oude wa.link-links) ---- */
  var WA = 'https://wa.me/31627411925?text=' + encodeURIComponent('Hallo mark, ik heb een vraag over MrGolfbal');
  document.querySelectorAll('a[href*="wa.link"],a[href*="wa.me"],a[href*="whatsapp"]').forEach(function (a) { a.href = WA; });

  /* ---- 2) scroll reveal (auto op blokken + expliciete .reveal) ---- */
  if (!reduce) document.querySelectorAll('.feature, .usecase, .step').forEach(function (el) { el.classList.add('reveal'); });
  var revs = document.querySelectorAll('.reveal');
  if (revs.length && 'IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revs.forEach(function (el) { io.observe(el); });
  } else { revs.forEach(function (el) { el.classList.add('in'); }); }

  /* ---- 3) configurator: foto ↔ tekst ---- */
  var druk = document.getElementById('druktype');
  if (druk) {
    var tekstRow = document.getElementById('tekstRow');
    var uploadRow = document.getElementById('uploadRow');
    var apply = function () {
      var v = druk.value;
      var isFoto = /foto|afbeelding/i.test(v);
      var isTekst = /naam|tekst/i.test(v);
      if (tekstRow) tekstRow.style.display = isFoto ? 'none' : '';
      if (uploadRow) uploadRow.style.display = isTekst ? 'none' : '';
    };
    druk.addEventListener('change', apply); apply();
  }

  /* ---- 5) tekstrotator in de hero (.rot met data-words="a,b,c") ---- */
  document.querySelectorAll('.rot[data-words]').forEach(function (el) {
    var words = (el.getAttribute('data-words') || '').split(',').map(function (w) { return w.trim(); }).filter(Boolean);
    if (words.length < 2) return;
    var i = 0;
    el.textContent = words[0];
    if (reduce) return;
    setInterval(function () {
      el.classList.add('out');
      setTimeout(function () {
        i = (i + 1) % words.length;
        el.textContent = words[i];
        el.classList.remove('out');
      }, 300);
    }, 2400);
  });

  /* ---- 6) WhatsApp: op desktop een scanbare QR tonen i.p.v. openen ---- */
  var isDesktop = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var openQr = null;
  function closeQr() { if (openQr) { openQr.hidden = true; openQr = null; } }
  document.querySelectorAll('.wa-wrap').forEach(function (wrap) {
    var link = wrap.querySelector('[data-wa]');
    var qr = wrap.querySelector('.wa-qr');
    if (!link || !qr) return;
    link.addEventListener('click', function (e) {
      if (!isDesktop) return;              // mobiel: gewoon WhatsApp openen
      e.preventDefault();
      var show = qr.hidden;
      closeQr();
      if (show) { qr.hidden = false; openQr = qr; }
    });
  });
  document.addEventListener('click', function (e) {
    if (openQr && !e.target.closest('.wa-wrap')) closeQr();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeQr(); });
})();
