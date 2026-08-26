const compareTable = (lang='nl') => lang==='en' ? `
<div style="overflow-x:auto;margin-top:1.5rem"><table class="staffel">
<thead><tr><th>Model</th><th>Feel</th><th>Ball flight</th><th>Spin</th><th>Suited to</th></tr></thead><tbody>
<tr><td><strong>Titleist Pro V1</strong></td><td>Soft</td><td>Penetrating</td><td>High</td><td>Low/mid handicap, premium gift</td></tr>
<tr><td><strong>Titleist Pro V1x</strong></td><td>Firmer</td><td>Higher</td><td>Very high</td><td>Height and control</td></tr>
<tr><td><strong>Titleist TruFeel</strong></td><td>Extra soft</td><td>Mid</td><td>Mid</td><td>Recreational, budget business</td></tr>
<tr><td><strong>Pinnacle Soft</strong></td><td>Soft</td><td>Mid-high</td><td>Lower</td><td>Golf days, large runs</td></tr>
<tr><td><strong>Pinnacle Rush</strong></td><td>Firm</td><td>High</td><td>Lower</td><td>Distance, tournaments</td></tr>
</tbody></table></div>` : `
<div style="overflow-x:auto;margin-top:1.5rem"><table class="staffel">
<thead><tr><th>Model</th><th>Gevoel</th><th>Balvlucht</th><th>Spin</th><th>Geschikt voor</th></tr></thead><tbody>
<tr><td><strong>Titleist Pro V1</strong></td><td>Zacht</td><td>Penetrerend</td><td>Hoog</td><td>Lage/midden handicap, premium cadeau</td></tr>
<tr><td><strong>Titleist Pro V1x</strong></td><td>Steviger</td><td>Hoger</td><td>Zeer hoog</td><td>Hoogte en controle</td></tr>
<tr><td><strong>Titleist TruFeel</strong></td><td>Extra zacht</td><td>Midden</td><td>Midden</td><td>Recreatief, prijsbewust zakelijk</td></tr>
<tr><td><strong>Pinnacle Soft</strong></td><td>Zacht</td><td>Midden-hoog</td><td>Lager</td><td>Golfdagen, grote oplages</td></tr>
<tr><td><strong>Pinnacle Rush</strong></td><td>Stevig</td><td>Hoog</td><td>Lager</td><td>Afstand, toernooien</td></tr>
</tbody></table></div>`;

export const PAGES_A = {
 'titleist-golfballen-bedrukken': {
  title: "Print Titleist golf balls with your logo | MrGolfbal.nl",
  desc: "Print Titleist golf balls with your logo or text — Pro V1, Pro V1x, TruFeel and AVX. Genuine balls, a digital proof up front, from 144 units.",
  crumb: "Print Titleist golf balls",
  he: "Print Titleist",
  hh1: "Print Titleist golf balls with your <span>logo or text</span>",
  hsub: "Have genuine Titleist golf balls printed with your company or club logo. From the tour ball Pro V1 to the soft TruFeel — always a digital proof first.",
  main: `
<section class="section"><div class="container" style="max-width:920px">
 <p class="lead">Titleist is the most played ball brand on tour. A printed Titleist gives your corporate gift or club ball genuine status. We print exclusively on genuine Titleist balls and show you a digital proof before production begins.</p>
</div></section>
<section class="section section--sky"><div class="container"><div class="section-head"><p class="eyebrow">Models</p><h2>Which Titleist would you like printed?</h2></div>
 <div class="grid grid-4" style="margin-top:1.5rem">
  <article class="card"><div class="card__media"><div class="ballshot" style="border-radius:0"><div class="ball" style="width:52%"><span class="logo-print" style="font-size:.8rem">LOGO</span></div></div></div><div class="card__body"><span class="card__brand">Titleist</span><h3 class="card__title">Pro V1 — printed</h3><p class="card__meta">Tour level, soft feel, high green spin.</p><div class="card__price" data-shopify-handle="titleist-pro-v1">Price on request</div><a class="btn btn--primary btn--block" href="/products/titleist-pro-v1">View &amp; print</a></div></article>
  <article class="card"><div class="card__media"><div class="ballshot" style="border-radius:0"><div class="ball" style="width:52%"><span class="logo-print" style="font-size:.8rem">LOGO</span></div></div></div><div class="card__body"><span class="card__brand">Titleist</span><h3 class="card__title">Pro V1x — printed</h3><p class="card__meta">Higher flight, firmer feel, extra spin.</p><div class="card__price" data-shopify-handle="titleist-pro-v1x">Price on request</div><a class="btn btn--primary btn--block" href="/products/titleist-pro-v1x">View &amp; print</a></div></article>
  <article class="card"><div class="card__media"><div class="ballshot" style="border-radius:0"><div class="ball" style="width:52%"><span class="logo-print" style="font-size:.8rem">LOGO</span></div></div></div><div class="card__body"><span class="card__brand">Titleist</span><h3 class="card__title">TruFeel — printed</h3><p class="card__meta">Extra soft and keenly priced.</p><div class="card__price" data-shopify-handle="titleist-trufeel-met-bedrukking">Price on request</div><a class="btn btn--primary btn--block" href="/products/titleist-trufeel">View &amp; print</a></div></article>
  <article class="card"><div class="card__media"><div class="ballshot" style="border-radius:0"><div class="ball" style="width:52%"><span class="logo-print" style="font-size:.8rem">LOGO</span></div></div></div><div class="card__body"><span class="card__brand">Titleist</span><h3 class="card__title">AVX — printed</h3><p class="card__meta">Soft feel, lower flight and spin.</p><div class="card__price" data-shopify-handle="titleist-avx-met-bedrukking">Price on request</div><a class="btn btn--primary btn--block" href="/products/titleist-avx">View &amp; print</a></div></article>
 </div></div></section>
<section class="section"><div class="container"><div class="section-head"><p class="eyebrow">Comparison</p><h2>Compare Titleist models</h2><p class="lead">Choose based on feel and target audience. Not sure? Mark is happy to advise.</p></div>${compareTable('en')}
 <p class="muted" style="font-size:.85rem;margin-top:.8rem">Ball characteristics based on manufacturer information and practical experience.</p></div></section>
<section class="section section--sky"><div class="container"><div class="grid grid-3">
 <div class="feature"><h3>From 144 golf balls</h3><p>Minimum order 144 units; volume discount on larger quantities.</p></div>
 <div class="feature"><h3>Digital proof</h3><p>Always a proof first. Production starts once you approve.</p></div>
 <div class="feature"><h3>Delivery 5–15 working days</h3><p>After approval of the proof.</p></div>
</div></div></section>`
 },
 'pinnacle-golfballen-bedrukken': {
  title: "Print Pinnacle golf balls (Soft &amp; Rush) | MrGolfbal.nl",
  desc: "Print Pinnacle golf balls with your logo — Pinnacle Soft and Pinnacle Rush. Keenly priced, large print area, ideal for golf days and large runs.",
  crumb: "Print Pinnacle golf balls",
  he: "Print Pinnacle",
  hh1: "Print Pinnacle golf balls with your <span>logo</span>",
  hsub: "Pinnacle Soft and Rush are keenly priced and perfect for golf days, tournaments and large runs featuring your company logo.",
  main: `
<section class="section"><div class="container" style="max-width:920px"><p class="lead">Pinnacle offers outstanding value for money and a large, even surface that lends itself well to printing. Ideal when you need plenty of golf balls with your logo without compromising on brand quality.</p></div></section>
<section class="section section--sky"><div class="container"><div class="section-head"><p class="eyebrow">Models</p><h2>Pinnacle Soft vs. Pinnacle Rush</h2></div>
 <div class="grid grid-2" style="margin-top:1.5rem">
  <div class="feature"><span class="badge">Pinnacle</span><h3 style="margin-top:.6rem">Pinnacle Soft</h3><p>A soft feel and a pleasant touch around the greens. Popular for golf days and corporate gifts at a keen price.</p><a class="btn btn--primary" href="/products/pinnacle-soft-met-bedrukking">View &amp; print</a></div>
  <div class="feature"><span class="badge">Pinnacle</span><h3 style="margin-top:.6rem">Pinnacle Rush</h3><p>A firm core built for extra distance. A great tournament ball that looks smart with your logo on it.</p><a class="btn btn--primary" href="/products/pinnacle-rush-met-bedrukking">View &amp; print</a></div>
 </div></div></section>
<section class="section"><div class="container"><div class="section-head"><p class="eyebrow">Differences</p><h2>Which Pinnacle suits your goal?</h2></div>
 <div style="overflow-x:auto;margin-top:1.5rem"><table class="staffel"><thead><tr><th>Model</th><th>Feel</th><th>Focus</th><th>Ideal for</th></tr></thead><tbody>
 <tr><td><strong>Pinnacle Soft</strong></td><td>Soft</td><td>Feel &amp; control</td><td>Golf days, gifts, large runs</td></tr>
 <tr><td><strong>Pinnacle Rush</strong></td><td>Firm</td><td>Distance</td><td>Tournaments, longer hitters</td></tr>
 </tbody></table></div></div></section>`
 },
 'golfballen-bedrukken-voor-bedrijven': {
  title: "Print golf balls for businesses with a company logo | MrGolfbal.nl",
  desc: "Printed golf balls with your company logo as a corporate gift, for the company golf day or sponsorship. Genuine Titleist &amp; Pinnacle, volume discount, tailored quote.",
  crumb: "For businesses",
  he: "For businesses",
  hh1: "Print golf balls with your <span>company logo</span>",
  hsub: "A corporate gift that genuinely gets used. Have genuine golf balls printed with your company logo for the golf day, sponsorship or as a business gift.",
  hcta: "Request a quote",
  hhref: "#offerte",
  main: `
<section class="section"><div class="container"><div class="section-head"><p class="eyebrow">Business</p><h2>Printed golf balls for every business purpose</h2></div>
 <div class="grid grid-3" style="margin-top:1.5rem">
  <div class="feature"><h3>Corporate gift</h3><p>A lasting, practical gift for golfing clients and business relations.</p></div>
  <div class="feature"><h3>Company golf day</h3><p>Provide participants with balls bearing your logo — recognisable and smart.</p></div>
  <div class="feature"><h3>Sponsorship &amp; promotion</h3><p>Your sponsor logo on the ball at events, clinics and networking gatherings.</p></div>
  <div class="feature"><h3>Staff gift</h3><p>A sporty thank-you for employees who golf.</p></div>
  <div class="feature"><h3>Large runs</h3><p>Volume discount on larger quantities; repeat orders easily arranged.</p></div>
  <div class="feature"><h3>Quote &amp; planning</h3><p>Professional handling with a quote and delivery on an agreed date.</p></div>
 </div></div></section>
<section class="section section--sky" id="offerte"><div class="container" style="max-width:820px">
 <div class="section-head"><p class="eyebrow">Tailored quote</p><h2>Request a business quote</h2><p class="lead">Fill in your details — Mark usually responds within 24 hours with a proposal and proof planning.</p></div>
 <form class="mt-1" onsubmit="event.preventDefault();this.querySelector('.ok').style.display='block';">
  <div class="grid grid-2"><div class="field"><label>Company name</label><input required></div><div class="field"><label>Name</label><input required></div></div>
  <div class="grid grid-2"><div class="field"><label>Email address</label><input type="email" required></div><div class="field"><label>Phone</label><input></div></div>
  <div class="grid grid-2"><div class="field"><label>Preferred brand</label><select><option>Titleist</option><option>Pinnacle</option><option>Not sure yet</option></select></div><div class="field"><label>Preferred model</label><input placeholder="E.g. Pro V1"></div></div>
  <div class="grid grid-2"><div class="field"><label>Quantity (boxes or balls)</label><input placeholder="E.g. 288"></div><div class="field"><label>Preferred delivery date</label><input type="date"></div></div>
  <div class="field"><label>Upload logo</label><input type="file" accept=".eps,.ai,.pdf,.png,.jpg"></div>
  <div class="field"><label>Printing &amp; notes</label><textarea rows="3" placeholder="1–2 or 3–5 colours, one/two sides, any specifics"></textarea></div>
  <button class="btn btn--primary btn--lg" type="submit">Send quote request →</button>
  <p class="ok" style="display:none;color:var(--success);margin-top:1rem">Thank you! Your request has been sent (demo). Connect this form to your email/CRM in production.</p>
 </form>
</div></section>`
 },
};
