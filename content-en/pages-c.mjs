export const PAGES_C = {
  'over-mark': {
    title: "About us — Mark Reynolds, PGA professional &amp; founder | MrGolfbal.nl",
    desc: "Meet Mark Reynolds: PGA golf professional, multiple winner of the Dutch PGA Order of Merit and founder of MrGolfbal.nl. Advice from a genuine pro.",
    crumb: "About us",
    he: "About us",
    hh1: "Mark Reynolds — <span>PGA professional</span> &amp; founder",
    hsub: "Behind MrGolfbal.nl stands a genuine golf professional. Mark combines original branded balls with advice that goes beyond printing: which ball suits which player, and what makes an impression on your guests.",
    hcta: "Get in touch with Mark",
    hhref: "/contact/",
    main: `
<section class="section"><div class="container"><div class="prose">
  <p class="lead">Mark Reynolds is a PGA golf professional and the founder of MrGolfbal.nl. With decades of experience on and around the course — both as a player and as a teacher — he knows better than anyone which golf ball suits which player, and how to get a logo onto that ball crisply and recognisably.</p>
  <h2>From Yorkshire to the Dutch fairways</h2>
  <p>Mark was born in 1978 in Maltby, Rotherham (England), and held a golf club for the first time at the age of five. He began his PGA training at sixteen under Simon Thornhill at Rotherham Golf Club and has been a PGA Golf Professional since 1995. In 2000 he moved from England to the Netherlands to teach, and in 2001 he started his own golf school. Since 2014 he has been attached to The International in Badhoevedorp near Amsterdam, where he still teaches and plays.</p>
  <h2>Achievements &amp; recognition</h2>
  <p>Mark won the Dutch PGA Order of Merit in 2005, 2009 and 2018, and became European champion with the European PGA Team Championship in 2019. In 2005 he won the PGA Cup with Great Britain &amp; Ireland against the United States. He played several editions of the KLM Open and was the best-placed Dutch player there in 2018. In total he has more than ten professional wins to his name.</p>
  <h2>Why a PGA pro behind your golf balls?</h2>
  <p>Because it makes all the difference. You don't just buy printed golf balls — you get advice from someone who knows the game inside out. From the choice between a <a href="/products/titleist-pro-v1/">Pro V1</a> and a <a href="/products/titleist-pro-v1x/">Pro V1x</a> to the right ball for a <a href="/toepassingen/golfballen-bedrijfsgolfdag/">company golf day</a>, Mark helps you make the right choice. Not sure? The <a href="/golfbalkiezer/">golf ball finder</a> points you in the right direction.</p>
  <h2>More than printing: golf shows &amp; golf trips</h2>
  <p>Mark is also a celebrated <a href="/golfshows/">golf show and trick-show performer</a> and accompanies <a href="/golftrips/">golf trips</a> as a PGA pro. He is bookable in the Netherlands, across Europe and beyond.</p>
  <h2>Personal contact</h2>
  <p>Questions about ball choice or your logo? Mark is reachable via <a href="/contact/">contact</a>, by phone (<a href="tel:+31627411925">+31 6 27 41 19 25</a>) and on <a href="https://wa.me/31627411925">WhatsApp</a>.</p>
</div></div></section>`
  },
  'contact': {
    title: "Contact — personal advice from Mark | MrGolfbal.nl",
    desc: "Get in touch with MrGolfbal.nl for personal advice on printing golf balls, your logo or a rush order — by email, phone or WhatsApp. We reply within 24 hours.",
    crumb: "Contact",
    he: "Contact",
    hh1: "Need personal advice? <span>Mark is here to help</span>",
    hsub: "Questions about printing golf balls, preparing your logo or a rush order? Feel free to get in touch — we usually reply within 24 hours.",
    hcta: "Send a WhatsApp",
    hhref: "https://wa.me/31627411925",
    main: `
<section class="section"><div class="container"><div class="grid grid-2" style="gap:2.5rem;align-items:start">
  <div>
    <div class="section-head"><p class="eyebrow">Direct contact</p><h2>How to reach us</h2></div>
    <div class="stack mt-1">
      <div class="feature"><h3>Email</h3><p><a href="mailto:info@mrgolfbal.nl">info@mrgolfbal.nl</a></p></div>
      <div class="feature"><h3>Phone</h3><p><a href="tel:+31627411925">+31 6 27 41 19 25</a></p></div>
      <div class="feature"><h3>WhatsApp</h3><p><a href="https://wa.me/31627411925">Chat directly with Mark</a> — handy for a quick word about your logo or order.</p></div>
      <div class="feature"><h3>What we help with</h3><p>Product choice, logo preparation, volume pricing/quotes and rush orders.</p></div>
    </div>
    <p class="muted mt-1">KVK 27326866</p>
  </div>
  <div><div class="section-head"><p class="eyebrow">Send a message</p><h2>Contact form</h2></div>
    <form class="mt-1" onsubmit="event.preventDefault();this.querySelector('.ok').style.display='block';">
      <div class="field"><label>Name</label><input required></div>
      <div class="field"><label>Subject</label><select><option>Quote request</option><option>Digital proof</option><option>Unprinted golf balls (large quantities)</option><option>Help with ordering</option><option>General question</option></select></div>
      <div class="field"><label>Email address</label><input type="email" required></div>
      <div class="field"><label>Message</label><textarea rows="5" required></textarea></div>
      <button class="btn btn--primary btn--lg" type="submit">Send message →</button>
      <p class="ok" style="display:none;color:var(--success);margin-top:1rem">Thank you! Your message has been sent (demo). In production, connect this form to your email/CRM.</p>
    </form>
  </div>
</div></div></section>`
  },
  'golfbalkiezer': {
    title: "Golf ball selector — which golf ball suits you? | MrGolfbal.nl",
    desc: "Take the golf ball selector and get up to 3 personalised recommendations for the right (printed) golf ball in just a few questions, based on goal, level and budget.",
    crumb: "Golf ball selector",
    he: "Selector",
    hh1: "Golf ball selector — <span>which ball suits you?</span>",
    hsub: "Answer a few short questions. You'll get up to three recommendations with explanations, based on goal, level and budget. Not sure? Mark is happy to help.",
    hcta: "Start the selector",
    hhref: "#kiezer",
    main: `
<section class="section" id="kiezer"><div class="container" style="max-width:820px">
  <form id="quiz" class="stack">
    <div class="feature"><h3>Who are the golf balls for?</h3><div class="pill-row">
      <label class="badge" style="cursor:pointer"><input type="radio" name="q1" value="My business" checked style="margin-right:.4rem">My business</label>
      <label class="badge" style="cursor:pointer"><input type="radio" name="q1" value="A golf club" style="margin-right:.4rem">A golf club</label>
      <label class="badge" style="cursor:pointer"><input type="radio" name="q1" value="A tournament/golf day" style="margin-right:.4rem">A tournament/golf day</label>
      <label class="badge" style="cursor:pointer"><input type="radio" name="q1" value="Myself or as a gift" style="margin-right:.4rem">Myself or as a gift</label>
    </div></div>
    <div class="feature"><h3>What will they be used for?</h3><div class="pill-row">
      <label class="badge" style="cursor:pointer"><input type="radio" name="q2" value="Corporate gift" checked style="margin-right:.4rem">Corporate gift</label>
      <label class="badge" style="cursor:pointer"><input type="radio" name="q2" value="Company golf day" style="margin-right:.4rem">Company golf day</label>
      <label class="badge" style="cursor:pointer"><input type="radio" name="q2" value="Tournament/competition" style="margin-right:.4rem">Tournament/competition</label>
      <label class="badge" style="cursor:pointer"><input type="radio" name="q2" value="My own game" style="margin-right:.4rem">My own game</label>
      <label class="badge" style="cursor:pointer"><input type="radio" name="q2" value="Personal gift" style="margin-right:.4rem">Personal gift</label>
    </div></div>
    <div class="feature"><h3>What's the golfers' level?</h3><div class="pill-row">
      <label class="badge" style="cursor:pointer"><input type="radio" name="q3" value="Beginner" checked style="margin-right:.4rem">Beginner</label>
      <label class="badge" style="cursor:pointer"><input type="radio" name="q3" value="Recreational" style="margin-right:.4rem">Recreational</label>
      <label class="badge" style="cursor:pointer"><input type="radio" name="q3" value="Advanced" style="margin-right:.4rem">Advanced</label>
      <label class="badge" style="cursor:pointer"><input type="radio" name="q3" value="Low handicap / (almost) pro" style="margin-right:.4rem">Low handicap / (almost) pro</label>
    </div></div>
    <div class="feature"><h3>What's your budget per ball?</h3><div class="pill-row">
      <label class="badge" style="cursor:pointer"><input type="radio" name="q4" value="Keenly priced" checked style="margin-right:.4rem">Keenly priced</label>
      <label class="badge" style="cursor:pointer"><input type="radio" name="q4" value="Mid-range" style="margin-right:.4rem">Mid-range</label>
      <label class="badge" style="cursor:pointer"><input type="radio" name="q4" value="Premium — quality first" style="margin-right:.4rem">Premium — quality first</label>
    </div></div>
    <div class="feature"><h3>What look are you after?</h3><div class="pill-row">
      <label class="badge" style="cursor:pointer"><input type="radio" name="q5" value="As premium as possible" checked style="margin-right:.4rem">As premium as possible</label>
      <label class="badge" style="cursor:pointer"><input type="radio" name="q5" value="Neutral / a good middle ground" style="margin-right:.4rem">Neutral / a good middle ground</label>
      <label class="badge" style="cursor:pointer"><input type="radio" name="q5" value="Mainly keenly priced" style="margin-right:.4rem">Mainly keenly priced</label>
    </div></div>
    <div class="feature"><h3>How many golf balls do you need?</h3><div class="pill-row">
      <label class="badge" style="cursor:pointer"><input type="radio" name="q6" value="144–288" checked style="margin-right:.4rem">144–288</label>
      <label class="badge" style="cursor:pointer"><input type="radio" name="q6" value="288–576" style="margin-right:.4rem">288–576</label>
      <label class="badge" style="cursor:pointer"><input type="radio" name="q6" value="576 or more" style="margin-right:.4rem">576 or more</label>
    </div></div>
    <div class="feature"><h3>Do you need printing?</h3><div class="pill-row">
      <label class="badge" style="cursor:pointer"><input type="radio" name="q7" value="Yes, with logo/text" checked style="margin-right:.4rem">Yes, with logo/text</label>
      <label class="badge" style="cursor:pointer"><input type="radio" name="q7" value="No, unprinted" style="margin-right:.4rem">No, unprinted</label>
    </div></div>
    <div class="feature"><h3>What delivery time do you need?</h3><div class="pill-row">
      <label class="badge" style="cursor:pointer"><input type="radio" name="q8" value="Plenty of time" checked style="margin-right:.4rem">Plenty of time</label>
      <label class="badge" style="cursor:pointer"><input type="radio" name="q8" value="Standard" style="margin-right:.4rem">Standard</label>
      <label class="badge" style="cursor:pointer"><input type="radio" name="q8" value="Urgent" style="margin-right:.4rem">Urgent</label>
    </div></div>
    <button class="btn btn--primary btn--lg" type="submit">Show my recommendations →</button>
  </form>
  <div id="result" style="margin-top:2rem"></div>
</div></section>
<script>
(function(){
  var P = {
    'Titleist Pro V1':{brand:'Titleist',href:'/products/titleist-pro-v1',blurb:'Tour ball: soft feel, penetrating flight, high greenside spin.',tags:{premium:3,laag:3,controle:3,cadeau:2}},
    'Titleist Pro V1x':{brand:'Titleist',href:'/products/titleist-pro-v1x',blurb:'Higher flight and more spin, with a slightly firmer feel.',tags:{premium:3,laag:3,controle:2,hoogte:3}},
    'Titleist AVX':{brand:'Titleist',href:'/products/titleist-avx',blurb:'Soft feel with a lower flight and spin.',tags:{premium:2,controle:2,laag:2}},
    'Titleist TruFeel':{brand:'Titleist',href:'/products/titleist-trufeel',blurb:'Extra soft and keenly priced; a great all-round branded ball.',tags:{recreatief:3,scherp:2,cadeau:2}},
    'Titleist Velocity':{brand:'Titleist',href:'/products/titleist-velocity',blurb:'Fast and long, high flight, low spin.',tags:{afstand:3,recreatief:2}},
    'Pinnacle Soft':{brand:'Pinnacle',href:'/products/pinnacle-soft-met-bedrukking',blurb:'Soft and keenly priced; a large printing surface.',tags:{scherp:3,recreatief:3,oplage:3,cadeau:2}},
    'Pinnacle Rush':{brand:'Pinnacle',href:'/products/pinnacle-rush-met-bedrukking',blurb:'Firm core built for distance; a pleasing tournament ball.',tags:{afstand:3,scherp:2,oplage:2}}
  };
  var MAP = {
    'Low handicap / (almost) pro':{laag:3,controle:2,premium:2}, 'Advanced':{controle:2,premium:1,hoogte:1},
    'Recreational':{recreatief:2,scherp:1}, 'Beginner':{recreatief:2,scherp:2,afstand:1},
    'Keenly priced':{scherp:3,oplage:1}, 'Mid-range':{recreatief:1}, 'Premium — quality first':{premium:3,controle:1},
    'As premium as possible':{premium:3}, 'Neutral / a good middle ground':{recreatief:1}, 'Mainly keenly priced':{scherp:3},
    '144–288':{}, '288–576':{oplage:1}, '576 or more':{oplage:3,scherp:1},
    'Corporate gift':{premium:2,cadeau:2}, 'Company golf day':{oplage:2,scherp:1}, 'Tournament/competition':{afstand:1,oplage:1},
    'My own game':{controle:1}, 'Personal gift':{cadeau:3,premium:1}
  };
  document.getElementById('quiz').addEventListener('submit',function(e){
    e.preventDefault();
    var fd=new FormData(e.target), boost={};
    for(var v of fd.values()){ var m=MAP[v]||{}; for(var k in m){ boost[k]=(boost[k]||0)+m[k]; } }
    var scores=Object.keys(P).map(function(name){
      var s=0,t=P[name].tags; for(var k in t){ s += (boost[k]||0)*t[k]; } return {name:name,score:s};
    }).sort(function(a,b){return b.score-a.score;});
    var top=scores.slice(0,3);
    var html='<div class="section-head"><p class="eyebrow">Our recommendation</p><h2>These golf balls suit you</h2></div><div class="grid grid-3" style="margin-top:1rem">';
    top.forEach(function(r,i){ var p=P[r.name];
      html+='<article class="card"><div class="card__body"><span class="card__brand">'+p.brand+(i===0?' · best match':'')+'</span><h3 class="card__title">'+r.name+'</h3><p class="card__meta">'+p.blurb+'</p><a class="btn btn--primary btn--block" href="'+p.href+'">View this model</a></div></article>';
    });
    html+='</div><p class="muted" style="margin-top:1rem">This advice is indicative, based on your answers and general ball characteristics. For a tailored recommendation: <a href="/contact/">ask Mark</a>.</p>';
    var el=document.getElementById('result'); el.innerHTML=html; el.scrollIntoView({behavior:'smooth'});
  });
})();
</script>`
  },
};
