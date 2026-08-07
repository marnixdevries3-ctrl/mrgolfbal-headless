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

  /* ---- 1) scroll-golfbal + micdrop ---- */
  if (reduce) return;
  var wrap = document.createElement('div');
  wrap.className = 'golf-progress';
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML =
    '<div class="fairway"></div>' +
    '<div class="gp-pop">Raak! ⛳</div>' +
    '<div class="gp-mark swing">' +
      '<svg viewBox="0 0 40 34" width="34" height="29" preserveAspectRatio="xMinYMax meet">' +
        '<circle cx="9" cy="6.5" r="3.5" fill="#072943"/>' +
        '<line x1="9" y1="10" x2="10" y2="22" stroke="#072943" stroke-width="3" stroke-linecap="round"/>' +
        '<line x1="10" y1="22" x2="6" y2="32" stroke="#072943" stroke-width="3" stroke-linecap="round"/>' +
        '<line x1="10" y1="22" x2="15" y2="32" stroke="#072943" stroke-width="3" stroke-linecap="round"/>' +
        '<g class="club">' +
          '<line x1="10" y1="13" x2="20" y2="19" stroke="#072943" stroke-width="2.5" stroke-linecap="round"/>' +
          '<line x1="20" y1="19" x2="33" y2="29" stroke="#53c2fe" stroke-width="2.5" stroke-linecap="round"/>' +
          '<line x1="33" y1="29" x2="38" y2="29" stroke="#53c2fe" stroke-width="3" stroke-linecap="round"/>' +
        '</g>' +
      '</svg>' +
    '</div>' +
    '<div class="gp-ball"></div>' +
    '<div class="gp-hole"></div>' +
    '<div class="gp-flag wave"></div>';
  var header = document.querySelector('.site-header');
  if (header) header.appendChild(wrap); else document.body.appendChild(wrap);

  var ball = wrap.querySelector('.gp-ball');
  var mark = wrap.querySelector('.gp-mark');
  var flag = wrap.querySelector('.gp-flag');
  var pop = wrap.querySelector('.gp-pop');
  var sunk = false, atTop = true;
  var START = 46;

  function replaySwing() {
    mark.classList.remove('swing'); void mark.offsetWidth; mark.classList.add('swing');
  }

  function onScroll() {
    var h = document.documentElement;
    var max = (h.scrollHeight - h.clientHeight) || 1;
    var p = Math.min(1, Math.max(0, (h.scrollTop || window.pageYOffset) / max));
    var endX = window.innerWidth - (window.innerWidth < 640 ? 96 : 120);
    ball.style.left = (START + p * (endX - START)) + 'px';

    if (p > 0.985 && !sunk) {
      sunk = true;
      ball.classList.add('sink');
      flag.classList.remove('wave');
      setTimeout(function () { pop.classList.add('show'); }, 220);
    } else if (p < 0.9 && sunk) {
      sunk = false;
      ball.classList.remove('sink');
      pop.classList.remove('show');
      flag.classList.add('wave');
    }
    // Mark slaat opnieuw af zodra je weer bovenaan komt
    if (p < 0.03) { if (!atTop) { atTop = true; replaySwing(); } }
    else { atTop = false; }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
