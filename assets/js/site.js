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

/* ---- 7) foto-galerij: verberg de sectie als de foto's er (nog) niet zijn ----
   Lazy-loaded afbeeldingen onder de vouw vuren geen error, daarom pollen we
   actief de eerste afbeelding van een 'pending' galerij. */
(function () {
  function hideSection(el) { var s = el.closest('section'); if (s) s.style.display = 'none'; }
  function tidy() {
    document.querySelectorAll('.ballgallery').forEach(function (g) {
      if (!g.querySelector('figure')) hideSection(g);
    });
  }
  document.querySelectorAll('section[data-gallery-pending] .ballgallery').forEach(function (g) {
    var first = g.querySelector('img');
    if (!first) { hideSection(g); return; }
    var probe = new Image();
    probe.onerror = function () { hideSection(g); };
    probe.src = first.getAttribute('src');
  });
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (t && t.tagName === 'IMG' && t.closest && t.closest('.ballgallery')) setTimeout(tidy, 0);
  }, true);
  window.addEventListener('load', function () { setTimeout(tidy, 80); });
})();

/* ---- 8) mobiel menu (hamburger) ---- */
(function () {
  var btn = document.querySelector('.nav-toggle');
  var panel = document.getElementById('mobnav');
  if (!btn || !panel) return;
  function setOpen(open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.classList.toggle('is-open', open);
    panel.hidden = !open;
  }
  setOpen(false);
  btn.addEventListener('click', function () {
    setOpen(btn.getAttribute('aria-expanded') !== 'true');
  });
  panel.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 1080) setOpen(false); });
})();

/* ---- 9) sticky CTA: verschijnt zodra de hero uit beeld is ---- */
(function () {
  var bar = document.querySelector('[data-sticky-cta]');
  if (!bar) return;
  bar.hidden = false;
  var anchor = document.querySelector('.loc-hero, .ts-hero, .pillar-hero, .hero');
  function update() {
    var past = anchor ? anchor.getBoundingClientRect().bottom < 0 : window.scrollY > 500;
    // niet tonen als de bezoeker al onderaan bij de footer-CTA is
    var nearEnd = (window.innerHeight + window.scrollY) > (document.body.scrollHeight - 260);
    bar.classList.toggle('is-in', past && !nearEnd);
  }
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();

/* ---- 10) taalswitcher: uitklapmenu met vlaggen ---- */
(function () {
  var wrap = document.querySelector('[data-lang-switch]');
  if (!wrap) return;
  var btn = wrap.querySelector('.lang-switch__btn');
  var menu = wrap.querySelector('.lang-switch__menu');
  if (!btn || !menu) return;
  function setOpen(open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.hidden = !open;
    if (open) wrap.setAttribute('data-open', ''); else wrap.removeAttribute('data-open');
  }
  setOpen(false);
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(btn.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('[data-lang-switch]')) setOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
})();

/* ---- 11) Algarve AM AM: jaartal rolt na juli door naar de volgende editie ----
   De pagina is statisch, dus zonder deze regel zou het jaartal blijven staan op
   het moment van bouwen. Zo klopt het ook zonder nieuwe build. */
(function () {
  var els = document.querySelectorAll('[data-amam-year]');
  if (!els.length) return;
  var d = new Date();
  var year = d.getFullYear() + (d.getMonth() >= 7 ? 1 : 0);   // vanaf augustus: volgend jaar
  els.forEach(function (el) { el.textContent = String(year); });
})();

/* ---- 12) topbar: hoogte doorgeven en de USP-balk laten schuiven ----
   De header staat op mobiel vast bovenaan; de body krijgt dezelfde hoogte als
   padding zodat er niets onder verdwijnt. De USP's schuiven door zodat je ze
   allemaal ziet, ook als ze niet naast elkaar passen. */
(function () {
  var top = document.querySelector('.site-top');
  if (top) {
    var setH = function () {
      document.documentElement.style.setProperty('--site-top-h', top.offsetHeight + 'px');
    };
    setH();
    window.addEventListener('resize', setH);
    if (window.ResizeObserver) new ResizeObserver(setH).observe(top);
  }

  var m = document.querySelector('[data-marquee]');
  if (!m) return;
  var list = m.querySelector('.topbar-usps');
  if (!list) return;
  var start = function () {
    if (m.hasAttribute('data-running')) return;
    if (list.scrollWidth <= m.clientWidth + 4) return;   // past gewoon: niet animeren
    var items = Array.prototype.slice.call(list.children);
    items.forEach(function (li) { list.appendChild(li.cloneNode(true)); });  // tweede set voor een naadloze lus
    var half = list.scrollWidth / 2;
    m.style.setProperty('--usp-half', half + 'px');
    m.style.setProperty('--usp-dur', Math.max(18, Math.round(half / 28)) + 's');
    m.setAttribute('data-running', '');
  };
  start();
  window.addEventListener('resize', function () {
    if (!m.hasAttribute('data-running')) start();
  });
})();
