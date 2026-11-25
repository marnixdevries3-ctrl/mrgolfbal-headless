// Stap-voor-stap bestelwizard voor /golfballen-bedrukken/ (NL) en /en/golfballen-bedrukken/ (EN).
// Vervangt de oude configurator met dropdowns: alles is klikbaar met grote kaarten,
// en de aanvraag (incl. alle keuzes) gaat in één keer mee met het formulier.

const W3F_KEY = '63fb5800-8156-4d0c-9bbb-b1cc16f16dff';

const BALLS = [
  { id:'pro-v1',  name:'Titleist Pro V1',  brand:'Titleist', img:'titleist-pro-v1-wit.webp',  href:'/products/titleist-pro-v1/',  badge:{nl:'Premium',en:'Premium'},
    t:{nl:'Dé bal op tour · zacht, veel controle',en:'The tour favourite · soft, lots of control'} },
  { id:'pro-v1x', name:'Titleist Pro V1x', brand:'Titleist', img:'titleist-pro-v1x-wit.webp', href:'/products/titleist-pro-v1x/', badge:{nl:'Premium',en:'Premium'},
    t:{nl:'Hogere vlucht · maximale spin',en:'Higher flight · maximum spin'} },
  { id:'avx',     name:'Titleist AVX',     brand:'Titleist', img:'titleist-avx-wit.webp',     href:'/products/titleist-avx/',     badge:null,
    t:{nl:'Zeer zacht · lage, rechte vlucht',en:'Very soft · low, straight flight'} },
  { id:'tour-soft',name:'Titleist Tour Soft',brand:'Titleist',img:'titleist-tour-soft-wit.webp',href:'',                           badge:null,
    t:{nl:'Zacht gevoel · goede prijs-kwaliteit',en:'Soft feel · great value'} },
  { id:'trufeel', name:'Titleist TruFeel', brand:'Titleist', img:'titleist-trufeel-wit.webp', href:'/products/titleist-trufeel/', badge:null,
    t:{nl:'Extra zacht · scherp geprijsde Titleist',en:'Extra soft · keenly priced Titleist'} },
  { id:'velocity',name:'Titleist Velocity',brand:'Titleist', img:'titleist-velocity-wit.webp',href:'/products/titleist-velocity/',badge:null,
    t:{nl:'Afstand · ook in matgroen en -oranje',en:'Distance · also matte green and orange'} },
  { id:'p-soft',  name:'Pinnacle Soft',    brand:'Pinnacle', img:'pinnacle-soft-wit.webp',    href:'/products/pinnacle-soft-met-bedrukking/', badge:{nl:'Voordelig',en:'Good value'},
    t:{nl:'Zacht · ideaal voor grote aantallen',en:'Soft · ideal for large quantities'} },
  { id:'p-rush',  name:'Pinnacle Rush',    brand:'Pinnacle', img:'pinnacle-rush-wit.webp',    href:'/products/pinnacle-rush-met-bedrukking/', badge:{nl:'Voordelig',en:'Good value'},
    t:{nl:'Stevig · extra afstand',en:'Firm · extra distance'} },
];

const T = {
  nl: {
    eye:'Golfballen bedrukken in 5 stappen', h:'Stel je bedrukte golfballen samen',
    lead:'Klik je keuzes aan — het kost je ongeveer een minuut. Je betaalt niets online: je ontvangt eerst een gratis digitale drukproef met offerte, en we drukken pas na jouw akkoord.',
    steps:['Golfbal','Aantal','Bedrukking','Ontwerp','Versturen'],
    s1:'Welke golfbal wil je laten bedrukken?', all:'Alle', unsure:'Weet ik nog niet', unsureT:'Mark (PGA-pro) adviseert de beste bal voor jouw doel en budget', finder:'Of doe de golfbalkiezer →', info:'Meer info',
    s2:'Hoeveel golfballen?', s2n:'Minimaal 144 golfballen (12 dozijn). Hoe meer ballen, hoe lager de prijs per bal.', other:'Ander aantal', dozen:'dozijn', balls:'golfballen', popular:'Meest gekozen',
    s3:'Wat wil je op de bal?', types:[['logo','Logo','Bedrijfs-, club- of toernooilogo'],['tekst','Naam of tekst','Naam, initialen, nummer of korte tekst'],['ontwerp','Eigen ontwerp','Je hebt al een ontwerp klaar'],['foto','Foto of afbeelding','We zetten hem om naar een strak drukontwerp']],
    colors:'Hoeveel kleuren?', colorOpts:['1 kleur','2–3 kleuren','4–5 kleuren','Weet ik niet'], sides:'Hoeveel zijden?', sideOpts:['Eén zijde','Twee zijden'],
    s4:'Lever je ontwerp aan', upload:'Klik of sleep je bestand hierheen', uploadT:'EPS, AI, PDF of SVG werkt het best · PNG/JPG kan ook', text:'Tekst of naam op de bal', textPh:'Bijv. Familie de Vries of J. Jansen', later:'Ik stuur mijn ontwerp later', laterT:'Mail het naar info@mrgolfbal.nl of stuur het via WhatsApp.',
    s5:'Waar mogen we de drukproef naartoe sturen?', naam:'Naam', mail:'E-mailadres', tel:'Telefoon', bedrijf:'Bedrijf of club (optioneel)', datum:'Gewenste leverdatum (optioneel)', msg:'Opmerking (optioneel)', msgPh:'Bijv. kleur van het logo, gelegenheid of vragen',
    send:'Vraag gratis drukproef & offerte aan', sendNote:'Gratis en vrijblijvend · reactie meestal binnen 24 uur · productie pas na jouw akkoord',
    next:'Volgende', back:'Terug', sum:'Jouw keuze', sBal:'Golfbal', sAantal:'Aantal', sDruk:'Bedrukking', sLever:'Levertijd', lever:'5–15 werkdagen na akkoord', none:'—',
    prev:'Voorbeeld (indicatief)', your:'JOUW', logo:'LOGO', subject:'Nieuwe drukproef-aanvraag via MrGolfbal.nl', thanks:'https://mrgolfbal.nl/bedankt/', advice:'Advies van Mark',
    req:'Vul je naam en een geldig e-mailadres in.'
  },
  en: {
    eye:'Golf ball printing in 5 steps', h:'Build your printed golf balls',
    lead:'Just click your choices — it takes about a minute. Nothing to pay online: you first receive a free digital proof with a quote, and we only print after you approve.',
    steps:['Golf ball','Quantity','Print','Design','Send'],
    s1:'Which golf ball do you want printed?', all:'All', unsure:'Not sure yet', unsureT:'Mark (PGA pro) recommends the best ball for your goal and budget', finder:'Or take the golf ball finder →', info:'More info',
    s2:'How many golf balls?', s2n:'Minimum 144 golf balls (12 dozen). The more balls, the lower the price per ball.', other:'Other quantity', dozen:'dozen', balls:'golf balls', popular:'Most chosen',
    s3:'What goes on the ball?', types:[['logo','Logo','Company, club or tournament logo'],['tekst','Name or text','Name, initials, number or short text'],['ontwerp','Own design','You already have a design ready'],['foto','Photo or image','We turn it into a crisp print design']],
    colors:'How many colours?', colorOpts:['1 colour','2–3 colours','4–5 colours','Not sure'], sides:'How many sides?', sideOpts:['One side','Two sides'],
    s4:'Send us your design', upload:'Click or drop your file here', uploadT:'EPS, AI, PDF or SVG works best · PNG/JPG also fine', text:'Text or name on the ball', textPh:'E.g. The Smith Family or J. Smith', later:'I will send my design later', laterT:'Email it to info@mrgolfbal.nl or send it via WhatsApp.',
    s5:'Where should we send the proof?', naam:'Name', mail:'Email address', tel:'Phone', bedrijf:'Company or club (optional)', datum:'Preferred delivery date (optional)', msg:'Comments (optional)', msgPh:'E.g. logo colour, occasion or questions',
    send:'Request free proof & quote', sendNote:'Free, no obligation · reply usually within 24 hours · production only after you approve',
    next:'Next', back:'Back', sum:'Your choice', sBal:'Golf ball', sAantal:'Quantity', sDruk:'Print', sLever:'Lead time', lever:'5–15 working days after approval', none:'—',
    prev:'Preview (indicative)', your:'YOUR', logo:'LOGO', subject:'New proof request via MrGolfbal.nl (EN)', thanks:'https://mrgolfbal.nl/en/bedankt/', advice:'Advice from Mark',
    req:'Please enter your name and a valid email address.'
  }
};

export const wizardBlock = (lang = 'nl') => {
  const u = T[lang], p = lang === 'en' ? '/en' : '';
  const qty = [[144,'12'],[288,'24'],[576,'48'],[1200,'100']];
  const ballCards = BALLS.map(b => `
      <button type="button" class="wz-ball" data-brand="${b.brand}" data-val="${b.name}" aria-pressed="false">
        ${b.badge ? `<span class="wz-badge">${b.badge[lang]}</span>` : ''}
        <img src="/assets/img/products/${b.img}" width="160" height="160" loading="lazy" decoding="async" alt="${b.name} ${lang==='en'?'golf ball':'golfbal'}">
        <strong>${b.name}</strong><span>${b.t[lang]}</span>
      </button>`).join('');
  return `
<section class="section" id="configurator">
  <div class="container">
    <div class="section-head"><p class="eyebrow">${u.eye}</p><h2>${u.h}</h2><p class="lead">${u.lead}</p></div>
    <form class="wz" id="wz" data-action="https://api.web3forms.com/submit" method="POST" enctype="multipart/form-data" data-thanks="${u.thanks}" novalidate>
      <input type="hidden" name="access_key" value="${W3F_KEY}">
      <input type="hidden" name="subject" value="${u.subject}">
      <input type="hidden" name="from_name" value="MrGolfbal.nl">
      <input type="hidden" name="redirect" value="${u.thanks}">
      <input type="checkbox" name="botcheck" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true">
      <input type="text" name="website" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true">
      <input type="hidden" name="Golfbal" id="f-bal"><input type="hidden" name="Aantal" id="f-aantal">
      <input type="hidden" name="Bedrukking" id="f-druk"><input type="hidden" name="Kleuren" id="f-kleur"><input type="hidden" name="Zijden" id="f-zijde">
      <input type="hidden" name="Ontwerp" id="f-ontwerp"><input type="hidden" name="Taal" value="${lang}">

      <ol class="wz-steps" aria-label="Stappen">${u.steps.map((s,i)=>`<li><button type="button" class="wz-stepbtn${i===0?' is-active':''}" data-go="${i}"><span>${i+1}</span>${s}</button></li>`).join('')}</ol>

      <div class="wz-layout">
        <div class="wz-main">
          <!-- STAP 1 -->
          <fieldset class="wz-panel is-active" data-step="0">
            <legend>${u.s1}</legend>
            <div class="wz-filter" role="group"><button type="button" class="wz-chip is-on" data-filter="all">${u.all}</button><button type="button" class="wz-chip" data-filter="Titleist">Titleist</button><button type="button" class="wz-chip" data-filter="Pinnacle">Pinnacle</button></div>
            <div class="wz-balls">${ballCards}
              <button type="button" class="wz-ball wz-ball--unsure" data-brand="all" data-val="${u.unsure} — ${u.advice}" aria-pressed="false"><span class="wz-q">?</span><strong>${u.unsure}</strong><span>${u.unsureT}</span></button>
            </div>
            <p class="wz-note"><a href="${p}/golfbalkiezer/">${u.finder}</a></p>
          </fieldset>
          <!-- STAP 2 -->
          <fieldset class="wz-panel" data-step="1">
            <legend>${u.s2}</legend>
            <div class="wz-opts wz-opts--4">${qty.map(([n,dz],i)=>`<button type="button" class="wz-opt" data-qty="${n}" aria-pressed="false"><strong>${n.toLocaleString('nl-NL')}</strong><span>${u.balls} · ${dz} ${u.dozen}</span></button>`).join('')}</div>
            <label class="wz-other">${u.other}: <input type="number" id="wz-qty" min="144" step="12" inputmode="numeric" placeholder="${lang==='en'?'e.g.':'bijv.'} 432"></label>
            <p class="wz-note">${u.s2n}</p>
          </fieldset>
          <!-- STAP 3 -->
          <fieldset class="wz-panel" data-step="2">
            <legend>${u.s3}</legend>
            <div class="wz-opts wz-opts--4">${u.types.map(([k,h,t])=>`<button type="button" class="wz-opt" data-type="${k}" data-val="${h}" aria-pressed="false"><strong>${h}</strong><span>${t}</span></button>`).join('')}</div>
            <div class="wz-sub"><h3>${u.colors}</h3><div class="wz-filter">${u.colorOpts.map(c=>`<button type="button" class="wz-chip" data-color="${c}">${c}</button>`).join('')}</div></div>
            <div class="wz-sub"><h3>${u.sides}</h3><div class="wz-filter">${u.sideOpts.map((c,i)=>`<button type="button" class="wz-chip${i===0?' is-on':''}" data-side="${c}">${c}</button>`).join('')}</div></div>
          </fieldset>
          <!-- STAP 4 -->
          <fieldset class="wz-panel" data-step="3">
            <legend>${u.s4}</legend>
            <div class="wz-textrow field"><label for="wz-tekst">${u.text}</label><input type="text" id="wz-tekst" name="Tekst op bal" maxlength="40" placeholder="${u.textPh}"></div>
            <label class="dropzone wz-upload" for="wz-file">
              <svg class="dz-ico" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M5 20h14"/></svg>
              <strong id="wz-filetxt">${u.upload}</strong><span class="muted">${u.uploadT}</span>
              <input type="file" id="wz-file" name="attachment" accept=".eps,.ai,.pdf,.svg,.png,.jpg,.jpeg">
            </label>
            <button type="button" class="wz-chip wz-later" id="wz-later">${u.later}</button>
            <p class="wz-note">${u.laterT}</p>
          </fieldset>
          <!-- STAP 5 -->
          <fieldset class="wz-panel" data-step="4">
            <legend>${u.s5}</legend>
            <div class="form-grid">
              <div class="field"><label for="wz-naam">${u.naam} *</label><input id="wz-naam" name="name" autocomplete="name" required></div>
              <div class="field"><label for="wz-mail">${u.mail} *</label><input id="wz-mail" type="email" name="email" autocomplete="email" required></div>
              <div class="field"><label for="wz-tel">${u.tel}</label><input id="wz-tel" type="tel" name="telefoon" autocomplete="tel"></div>
              <div class="field"><label for="wz-bedrijf">${u.bedrijf}</label><input id="wz-bedrijf" name="bedrijf" autocomplete="organization"></div>
              <div class="field"><label for="wz-datum">${u.datum}</label><input id="wz-datum" type="date" name="leverdatum"></div>
              <div class="field full"><label for="wz-msg">${u.msg}</label><textarea id="wz-msg" name="message" rows="3" placeholder="${u.msgPh}"></textarea></div>
            </div>
            <p class="wz-err" id="wz-err" hidden>${u.req}</p>
            <button class="btn btn--primary btn--xl btn--block" type="submit">${u.send} →</button>
            <p class="wz-note" style="text-align:center">${u.sendNote}</p>
          </fieldset>

          <div class="wz-nav"><button type="button" class="btn btn--ghost" id="wz-back">← ${u.back}</button><button type="button" class="btn btn--primary" id="wz-next">${u.next} →</button></div>
        </div>

        <aside class="wz-side">
          <div class="ballshot"><div class="ball"><span class="logo-print" id="wz-prev">${u.your}<br><span>${u.logo}</span></span></div></div>
          <p class="wz-note" style="text-align:center;margin-top:.4rem">${u.prev}</p>
          <h3>${u.sum}</h3>
          <dl class="wz-sum">
            <dt>${u.sBal}</dt><dd id="s-bal">${u.none}</dd>
            <dt>${u.sAantal}</dt><dd id="s-aantal">${u.none}</dd>
            <dt>${u.sDruk}</dt><dd id="s-druk">${u.none}</dd>
            <dt>${u.sLever}</dt><dd>${u.lever}</dd>
          </dl>
        </aside>
      </div>
    </form>
  </div>
</section>
<script>
(function(){
  var f=document.getElementById('wz'); if(!f) return;
  var L=${JSON.stringify({name:lang==='en'?'YOUR NAME':'JOUW NAAM',your:u.your,logo:u.logo,balls:u.balls,none:u.none,later:u.later,choose:u.upload})};
  var $=function(s,r){return (r||f).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||f).querySelectorAll(s))};
  var panels=$$('.wz-panel'), stepbtns=$$('.wz-stepbtn'), cur=0;
  var st={bal:'',aantal:0,type:'',typeVal:'',kleur:'',zijde:$('[data-side].is-on').dataset.side,tekst:'',ontwerp:''};
  function pick(list,el){ list.forEach(function(b){ b.classList.remove('is-on'); b.setAttribute('aria-pressed','false'); }); el.classList.add('is-on'); el.setAttribute('aria-pressed','true'); }
  function done(i){ return i===0?!!st.bal : i===1?st.aantal>=144 : i===2?!!st.type : i===3?true : false; }
  function go(i){ cur=Math.max(0,Math.min(panels.length-1,i));
    panels.forEach(function(p,n){ p.classList.toggle('is-active',n===cur); });
    stepbtns.forEach(function(b,n){ b.classList.toggle('is-active',n===cur); b.classList.toggle('is-done',n<cur&&done(n)); });
    $('#wz-back').style.visibility=cur===0?'hidden':'visible'; $('#wz-next').style.display=cur===panels.length-1?'none':'';
    $('#wz-next').disabled=!done(cur);
    var tr=$('.wz-textrow'), up=$('.wz-upload'); if(tr&&up){ tr.style.display=(st.type==='tekst'||!st.type)?'':'none'; up.style.display=st.type==='tekst'?'none':''; }
    var top=f.getBoundingClientRect().top+window.scrollY-90; if(window.scrollY>top) window.scrollTo({top:top,behavior:'smooth'});
  }
  function render(){
    $('#s-bal').textContent=st.bal||L.none;
    $('#s-aantal').textContent=st.aantal?st.aantal.toLocaleString('nl-NL')+' '+L.balls:L.none;
    $('#s-druk').textContent=st.typeVal?[st.typeVal,st.kleur,st.zijde].filter(Boolean).join(' · '):L.none;
    $('#wz-prev').innerHTML=st.tekst?st.tekst.replace(/[<>&]/g,'').toUpperCase():(st.type==='tekst'?L.name:L.your+'<br><span>'+L.logo+'</span>');
    $('#f-bal').value=st.bal; $('#f-aantal').value=st.aantal||''; $('#f-druk').value=st.typeVal; $('#f-kleur').value=st.kleur; $('#f-zijde').value=st.zijde; $('#f-ontwerp').value=st.ontwerp;
    $('#wz-next').disabled=!done(cur);
  }
  var auto=function(){ setTimeout(function(){ go(cur+1); },260); };
  $$('.wz-ball').forEach(function(b){ b.addEventListener('click',function(){ pick($$('.wz-ball'),b); st.bal=b.dataset.val; render(); auto(); }); });
  $$('[data-filter]').forEach(function(b){ b.addEventListener('click',function(){ pick($$('[data-filter]'),b); var v=b.dataset.filter; $$('.wz-ball').forEach(function(c){ c.hidden=!(v==='all'||c.dataset.brand===v||c.dataset.brand==='all'); }); }); });
  $$('[data-qty]').forEach(function(b){ b.addEventListener('click',function(){ pick($$('[data-qty]'),b); $('#wz-qty').value=''; st.aantal=+b.dataset.qty; render(); auto(); }); });
  $('#wz-qty').addEventListener('input',function(e){ $$('[data-qty]').forEach(function(x){x.classList.remove('is-on');}); st.aantal=parseInt(e.target.value,10)||0; render(); });
  $$('[data-type]').forEach(function(b){ b.addEventListener('click',function(){ pick($$('[data-type]'),b); st.type=b.dataset.type; st.typeVal=b.dataset.val; render(); }); });
  $$('[data-color]').forEach(function(b){ b.addEventListener('click',function(){ pick($$('[data-color]'),b); st.kleur=b.dataset.color; render(); }); });
  $$('[data-side]').forEach(function(b){ b.addEventListener('click',function(){ pick($$('[data-side]'),b); st.zijde=b.dataset.side; render(); }); });
  $('#wz-tekst').addEventListener('input',function(e){ st.tekst=e.target.value; render(); });
  $('#wz-file').addEventListener('change',function(e){ var fl=e.target.files[0]; if(fl){ $('#wz-filetxt').textContent='✓ '+fl.name; st.ontwerp='Bestand geüpload: '+fl.name; $('#wz-later').classList.remove('is-on'); render(); } });
  $('#wz-later').addEventListener('click',function(){ this.classList.toggle('is-on'); st.ontwerp=this.classList.contains('is-on')?L.later:''; render(); });
  $('#wz-next').addEventListener('click',function(){ if(done(cur)) go(cur+1); });
  $('#wz-back').addEventListener('click',function(){ go(cur-1); });
  stepbtns.forEach(function(b,i){ b.addEventListener('click',function(){ for(var n=0;n<i;n++){ if(!done(n)) return go(n); } go(i); }); });
  f.addEventListener('submit',function(e){
    var ok=$('#wz-naam').value.trim() && /.+@.+\\..+/.test($('#wz-mail').value);
    if(!ok){ e.preventDefault(); $('#wz-err').hidden=false; return; }
  });
  try{ var pre=new URLSearchParams(location.search).get('bal'); if(pre){ var m=$$('.wz-ball').filter(function(b){return b.dataset.val===pre;})[0]; if(m){ pick($$('.wz-ball'),m); st.bal=pre; render(); go(1); return; } } }catch(e){}
  go(0); render();
})();
</script>`;
};
