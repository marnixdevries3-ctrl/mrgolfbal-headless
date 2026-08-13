/* site.js — WhatsApp-tekst, scroll-reveal, configurator (geen animatie meer) */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var WA = 'https://wa.me/31627411925?text=' + encodeURIComponent('Hallo mark, ik heb een vraag over MrGolfbal');
  document.querySelectorAll('a[href*="wa.link"],a[href*="wa.me"],a[href*="whatsapp"]').forEach(function (a) { a.href = WA; });

  if (!reduce) document.querySelectorAll('.feature, .usecase, .step').forEach(function (el) { el.classList.add('reveal'); });
  var revs = document.querySelectorAll('.reveal');
  if (revs.length && 'IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revs.forEach(function (el) { io.observe(el); });
  } else { revs.forEach(function (el) { el.classList.add('in'); }); }

  var druk = document.getElementById('druktype');
  if (druk) {
    var tekstRow = document.getElementById('tekstRow');
    var uploadRow = document.getElementById('uploadRow');
    var apply = function () {
      var v = druk.value;
      if (tekstRow) tekstRow.style.display = /foto|afbeelding/i.test(v) ? 'none' : '';
      if (uploadRow) uploadRow.style.display = /naam|tekst/i.test(v) ? 'none' : '';
    };
    druk.addEventListener('change', apply); apply();
  }
})();
