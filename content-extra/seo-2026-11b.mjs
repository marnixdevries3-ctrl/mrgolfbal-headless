// SEO-ronde nov 2026 (deel 2): FAQ hoofdpagina + nieuwe kennisbankartikelen die naar
// /golfballen-bedrukken/ linken (interne kracht naar de hoofdpagina).

export const HUB_FAQ = {
  nl: [
    ['Wat is de minimale afname bij het bedrukken van golfballen?', 'De minimale afname is 144 golfballen, bijvoorbeeld 12 dozijn. Grotere aantallen zijn voordeliger per bal dankzij de staffelkorting.'],
    ['Kan ik één golfbal of een paar golfballen laten bedrukken?', 'Nee, bedrukken start bij 144 golfballen. Bij kleinere aantallen wegen de voorbereiding, drukproef en insteltijd niet op tegen de prijs. Zoek je iets voor één golfer, vraag Mark dan naar een gezamenlijke bestelling met clubgenoten of collega\'s.'],
    ['Wat kost golfballen bedrukken?', 'De prijs hangt af van het model (Pinnacle is voordeliger, een Titleist Pro V1 is premium), het aantal, het aantal drukkleuren en één of twee zijden. Je ontvangt bij elke aanvraag een offerte op maat met de exacte prijs per bal. Lees ook <a href="/kennisbank/wat-kost-golfballen-bedrukken/">wat kost golfballen bedrukken</a>.'],
    ['Krijg ik eerst een drukproef te zien?', 'Ja, altijd en gratis. Je ontvangt een digitale drukproef van je logo of tekst op de bal. Productie start pas na jouw akkoord.'],
    ['Hoe lang duurt het bedrukken van golfballen?', 'Reken op 5 tot 15 werkdagen na goedkeuring van de drukproef. Heb je een vaste datum, zoals een golfdag of kerstmoment? Vermeld die bij je aanvraag.'],
    ['Welke golfballen kan ik laten bedrukken?', 'Originele Titleist-ballen (Pro V1, Pro V1x, AVX, Tour Soft, TruFeel en Velocity) en Pinnacle-ballen (Soft en Rush). Twijfel je? De <a href="/golfbalkiezer/">golfbalkiezer</a> of Mark helpt je kiezen.'],
    ['Welke golfbal is het beste om te laten bedrukken?', 'Voor een premium relatiegeschenk kies je een Titleist Pro V1 of Pro V1x. Voor grote groepen en golfdagen is een Pinnacle Soft of Titleist TruFeel de slimme keuze: zacht, vergevingsgezind en scherp geprijsd.'],
    ['Hoe lever ik mijn logo aan?', 'Bij voorkeur als vectorbestand (EPS, AI, PDF of SVG). Een PNG of JPG kan ook; Mark kijkt dan of het scherp genoeg wordt en helpt zo nodig met de opmaak.'],
    ['In hoeveel kleuren kan ik laten drukken?', 'In 1 tot 5 spotkleuren. Geef je huisstijlkleuren door als Pantone (PMS) voor een exacte match.'],
    ['Kan ik aan twee kanten van de golfbal laten drukken?', 'Ja. Standaard drukken we één zijde; een tweede zijde, bijvoorbeeld een sponsorlogo of naam, is op aanvraag mogelijk.'],
    ['Kan ik gewoon spelen met bedrukte golfballen?', 'Ja. Het zijn originele merkballen met een professionele opdruk die gemaakt is om gespeeld te worden.'],
    ['Kan ik bedrukte golfballen retourneren?', 'Nee, bedrukte golfballen zijn maatwerk en kunnen niet retour. Daarom keur je altijd eerst de drukproef goed.'],
  ],
  en: [
    ['What is the minimum order for printed golf balls?', 'The minimum order is 144 golf balls, for example 12 dozen. Larger quantities are better value per ball thanks to tiered discounts.'],
    ['Can I have one or a few golf balls printed?', 'No, printing starts at 144 golf balls. For smaller quantities, the preparation, proof and set-up time outweigh the price. Looking for something for one golfer? Ask Mark about a joint order with club members or colleagues.'],
    ['How much does it cost to print golf balls?', 'The price depends on the model (Pinnacle is better value, a Titleist Pro V1 is premium), the quantity, the number of print colours and one or two sides. Every request gets a tailored quote with the exact price per ball. Also read <a href="/kennisbank/wat-kost-golfballen-bedrukken/">how much printing golf balls costs</a>.'],
    ['Do I see a print proof first?', 'Yes, always and free. You receive a digital proof of your logo or text on the ball. Production only starts once you approve it.'],
    ['How long does printing golf balls take?', 'Allow 5 to 15 working days after approval of the proof. Got a fixed date, such as a golf day or a Christmas gift moment? Mention it in your request.'],
    ['Which golf balls can I have printed?', 'Original Titleist balls (Pro V1, Pro V1x, AVX, Tour Soft, TruFeel and Velocity) and Pinnacle balls (Soft and Rush). Not sure? The <a href="/golfbalkiezer/">golf ball finder</a> or Mark will help you choose.'],
    ['Which golf ball is best to have printed?', 'For a premium corporate gift choose a Titleist Pro V1 or Pro V1x. For large groups and golf days a Pinnacle Soft or Titleist TruFeel is the smart choice: soft, forgiving and keenly priced.'],
    ['How do I supply my logo?', 'Ideally as a vector file (EPS, AI, PDF or SVG). A PNG or JPG is fine too; Mark will check whether it comes out sharp enough and help with the artwork if needed.'],
    ['How many colours can be printed?', '1 to 5 spot colours. Supply your brand colours as Pantone (PMS) values for an exact match.'],
    ['Can both sides of the ball be printed?', 'Yes. We print one side as standard; a second side, for example a sponsor logo or a name, is available on request.'],
    ['Can I play with printed golf balls?', 'Yes. They are original brand balls with a professional print that is made to be played.'],
    ['Can I return printed golf balls?', 'No, printed golf balls are made to order and cannot be returned. That is why you always approve the proof first.'],
  ]
};

/* ---------- NIEUWE KENNISBANKARTIKELEN ---------- */
export const KB_NEW = [
{ slug:'wat-kost-golfballen-bedrukken', cat:'techniek',
  nl:{
  title:'Wat kost golfballen bedrukken? Alle prijsfactoren uitgelegd',
  desc:'Wat kost golfballen bedrukken met je logo? Zo bepalen model, aantal, kleuren en zijden de prijs per bal — en zo vergelijk je offertes eerlijk. Uitleg van een PGA-pro.',
  h1:'Wat kost golfballen bedrukken?',
  body:`<p class="lead">De prijs van bedrukte golfballen hangt af van vier dingen: welke bal je kiest, hoeveel je er bestelt, hoeveel kleuren je logo heeft en of je één of twee zijden laat bedrukken. Hieronder lees je per factor wat het doet met je prijs per bal, en hoe je offertes eerlijk vergelijkt.</p>
<h2>1. Het model golfbal: de grootste factor</h2>
<p>Het grootste deel van de prijs zit in de bal zelf, niet in de opdruk. Een tweelaagse bal zoals de <a href="/products/pinnacle-soft-met-bedrukking/">Pinnacle Soft</a> of <a href="/products/pinnacle-rush-met-bedrukking/">Pinnacle Rush</a> is een stuk voordeliger dan een meerlaagse tourbal met urethaan mantel, zoals de <a href="/products/titleist-pro-v1/">Titleist Pro V1</a>. Daartussen zitten modellen als de <a href="/products/titleist-trufeel/">TruFeel</a>, <a href="/products/titleist-velocity/">Velocity</a> en <a href="/products/titleist-avx/">AVX</a>.</p>
<p>In de markt zie je daardoor grote verschillen. Aanbieders van onbekende merkballen adverteren met prijzen onder de euro per bal. Voor een originele merkbal betaal je meer, en een Pro V1 kost bedrukt een veelvoud daarvan. Vergelijk dus nooit alleen de prijs per bal, maar altijd de prijs per bal <em>van hetzelfde model</em>.</p>
<h2>2. Het aantal: hoe meer, hoe lager per bal</h2>
<p>Bedrukken vraagt voorbereiding: een drukproef, het klaarzetten van de drukvorm en het afstellen van de kleur. Die kosten zijn vrijwel gelijk of je nu 144 of 1.200 ballen bestelt. Bij een grotere oplage worden ze over meer ballen verdeeld, daardoor daalt de prijs per bal. Daarom werken we met een staffel: 144, 288, 576 en meer.</p>
<p>Twijfel je tussen twee aantallen? Vraag beide op in je offerte. Soms is het verschil per bal zo groot dat een extra dozijn voor de clubshop of het volgende event bijna niets extra kost.</p>
<h2>3. Aantal drukkleuren</h2>
<p>Wij drukken in 1 tot 5 spotkleuren. Elke kleur is een aparte drukgang. Een logo in één kleur is dus voordeliger dan een logo in vier kleuren. Een tip die vaak geld bespaart: veel logo's hebben ook een éénkleurige variant die op een kleine golfbal juist rustiger en scherper oogt.</p>
<h2>4. Eén of twee zijden</h2>
<p>Standaard bedrukken we één zijde. Een tweede zijde, bijvoorbeeld een sponsorlogo, een naam of een datum, is een extra drukgang en dus een meerprijs. Voor toernooien met sponsors kan dat goed de moeite waard zijn: de sponsor betaalt mee, en de bal krijgt twee functies.</p>
<h2>Waar je op let bij het vergelijken van offertes</h2>
<ul>
<li><strong>Origineel merk of niet?</strong> Staat er "golfbal wit" of "two piece" zonder merk, dan vergelijk je appels met peren.</li>
<li><strong>Zit de drukproef erbij?</strong> Bij ons altijd gratis, en je betaalt pas na akkoord.</li>
<li><strong>Zijn instel- of drukkosten inbegrepen?</strong> Een lage prijs per bal plus losse instelkosten kan uiteindelijk duurder uitvallen.</li>
<li><strong>Verzendkosten en levertijd.</strong> Reken op 5 tot 15 werkdagen na akkoord. Een lagere prijs met een te late levering is voor een golfdag geen besparing.</li>
<li><strong>Advies.</strong> De goedkoopste bal is niet altijd de beste keuze voor je doelgroep. Een PGA-pro die meedenkt, voorkomt dat je 500 ballen bestelt die niemand graag speelt.</li>
</ul>
<h2>Zo krijg je de scherpste prijs per bal</h2>
<ol>
<li>Kies het model dat bij je ontvangers past, niet automatisch het duurste. Voor een gemengde groep op een golfdag is een <a href="/pinnacle-golfballen-bedrukken/">Pinnacle</a> of TruFeel vaak de slimste keuze.</li>
<li>Gebruik een éénkleurige versie van je logo als dat kan.</li>
<li>Bestel in één keer voor meerdere momenten (golfdag, kerst en klantbezoeken).</li>
<li>Vraag op tijd aan, zodat je niet hoeft te haasten.</li>
</ol>
<p>Je exacte prijs zie je in je offerte op maat. Stel in een minuut je bestelling samen in de <a href="/golfballen-bedrukken/#configurator">bestelwizard voor golfballen bedrukken</a>: je kiest model, aantal en bedrukking, en ontvangt eerst een gratis drukproef met prijs.</p>`,
  faq:[
    ['Wat kost het om golfballen te laten bedrukken?', 'Dat hangt af van het model, het aantal, het aantal kleuren en het aantal zijden. Je ontvangt bij elke aanvraag een offerte op maat met de exacte prijs per bal.'],
    ['Waarom is een Pro V1 bedrukt zoveel duurder dan een Pinnacle?', 'De prijs zit vooral in de bal zelf. Een Pro V1 is een meerlaagse tourbal met urethaan mantel; een Pinnacle is een eenvoudiger tweelaagse bal.'],
    ['Zijn er instelkosten?', 'Je offerte toont de totaalprijs inclusief bedrukking, zodat je niet voor verrassingen komt.'],
    ['Wordt het goedkoper als ik meer bestel?', 'Ja. De voorbereiding van het drukken wordt over meer ballen verdeeld, dus de prijs per bal daalt bij een grotere oplage.'],
    ['Is meer kleuren duurder?', 'Ja, elke kleur is een aparte drukgang. Een logo in één kleur is het voordeligst.'],
    ['Betaal ik voor de drukproef?', 'Nee, de digitale drukproef is gratis. Je betaalt pas na akkoord, op factuur.'],
  ]},
  en:{
  title:'How much does printing golf balls cost? Every price factor explained',
  desc:'How much does printing golf balls with your logo cost? How model, quantity, colours and sides set the price per ball — and how to compare quotes fairly. Explained by a PGA pro.',
  h1:'How much does printing golf balls cost?',
  body:`<p class="lead">The price of printed golf balls depends on four things: which ball you choose, how many you order, how many colours your logo has and whether you print one or two sides. Below you will find what each factor does to your price per ball, and how to compare quotes fairly.</p>
<h2>1. The golf ball model: the biggest factor</h2>
<p>Most of the price is in the ball itself, not the print. A two-piece ball such as the <a href="/products/pinnacle-soft-met-bedrukking/">Pinnacle Soft</a> or <a href="/products/pinnacle-rush-met-bedrukking/">Pinnacle Rush</a> is considerably cheaper than a multi-layer tour ball with a urethane cover, such as the <a href="/products/titleist-pro-v1/">Titleist Pro V1</a>. In between sit models like the <a href="/products/titleist-trufeel/">TruFeel</a>, <a href="/products/titleist-velocity/">Velocity</a> and <a href="/products/titleist-avx/">AVX</a>.</p>
<p>That is why prices on the market vary so much. Suppliers of unbranded balls advertise prices under one euro per ball. An original brand ball costs more, and a printed Pro V1 costs several times that. So never compare the price per ball alone — always compare the price per ball <em>for the same model</em>.</p>
<h2>2. Quantity: the more you order, the less per ball</h2>
<p>Printing involves preparation: a proof, setting up the print plate and matching the colour. Those costs are almost the same whether you order 144 or 1,200 balls. With a larger run they are spread over more balls, so the price per ball drops. That is why we work with tiers: 144, 288, 576 and more.</p>
<p>Torn between two quantities? Ask for both in your quote. Sometimes the difference per ball is so large that an extra dozen for the pro shop or the next event costs next to nothing.</p>
<h2>3. Number of print colours</h2>
<p>We print in 1 to 5 spot colours. Every colour is a separate print run, so a one-colour logo is cheaper than a four-colour logo. A tip that often saves money: many logos have a one-colour version that actually looks calmer and sharper on a small golf ball.</p>
<h2>4. One or two sides</h2>
<p>We print one side as standard. A second side, for example a sponsor logo, a name or a date, is an extra print run and therefore costs extra. For tournaments with sponsors it can be well worth it: the sponsor contributes, and the ball does two jobs.</p>
<h2>What to check when comparing quotes</h2>
<ul>
<li><strong>Original brand or not?</strong> If it says "white golf ball" or "two piece" without a brand, you are comparing apples with oranges.</li>
<li><strong>Is the proof included?</strong> With us it is always free, and you only pay after approval.</li>
<li><strong>Are set-up or print costs included?</strong> A low price per ball plus separate set-up costs can end up more expensive.</li>
<li><strong>Shipping and lead time.</strong> Allow 5 to 15 working days after approval. A lower price with late delivery is no saving for a golf day.</li>
<li><strong>Advice.</strong> The cheapest ball is not always the best choice for your audience. A PGA pro who thinks along stops you ordering 500 balls nobody enjoys playing.</li>
</ul>
<h2>How to get the sharpest price per ball</h2>
<ol>
<li>Choose the model that suits your recipients, not automatically the most expensive one. For a mixed group at a golf day, a <a href="/pinnacle-golfballen-bedrukken/">Pinnacle</a> or TruFeel is often the smartest choice.</li>
<li>Use a one-colour version of your logo if you can.</li>
<li>Order once for several moments (golf day, Christmas and client visits).</li>
<li>Request in good time so you are never in a rush.</li>
</ol>
<p>You see your exact price in your tailored quote. Build your order in a minute with the <a href="/golfballen-bedrukken/#configurator">golf ball printing order wizard</a>: choose model, quantity and print, and receive a free proof with price first.</p>`,
  faq:[
    ['How much does it cost to have golf balls printed?', 'It depends on the model, the quantity, the number of colours and the number of sides. Every request gets a tailored quote with the exact price per ball.'],
    ['Why is a printed Pro V1 so much more expensive than a Pinnacle?', 'The price is mainly in the ball itself. A Pro V1 is a multi-layer tour ball with a urethane cover; a Pinnacle is a simpler two-piece ball.'],
    ['Are there set-up costs?', 'Your quote shows the total price including printing, so there are no surprises.'],
    ['Does it get cheaper if I order more?', 'Yes. The print preparation is spread over more balls, so the price per ball drops with a larger run.'],
    ['Are more colours more expensive?', 'Yes, every colour is a separate print run. A one-colour logo is the best value.'],
    ['Do I pay for the proof?', 'No, the digital proof is free. You only pay after approval, by invoice.'],
  ]}
},
{ slug:'bedrukte-golfballen-als-kerstgeschenk', cat:'toepassingen',
  nl:{
  title:'Bedrukte golfballen als kerstgeschenk voor relaties',
  desc:'Golfballen met je logo als kerstgeschenk voor klanten en personeel: welke bal, hoeveel, wanneer bestellen en hoe je het persoonlijk maakt. Plan je kerstbestelling op tijd.',
  h1:'Bedrukte golfballen als kerstgeschenk',
  body:`<p class="lead">Een kerstpakket wordt opgegeten en vergeten. Golfballen met je logo gaan in de tas en komen het hele voorjaar mee de baan op. Voor klanten, relaties en personeel die golfen is het een kerstgeschenk dat écht gebruikt wordt — als je het goed plant.</p>
<h2>Waarom golfballen werken als kerstgeschenk</h2>
<p>Golfers gebruiken ballen, verliezen ze en hebben er dus altijd nieuwe nodig. Een dozijn originele merkballen met jouw logo is daarom geen hebbeding dat in een la verdwijnt, maar iets dat bij de eerste ronde van het nieuwe seizoen tevoorschijn komt. En elke keer dat iemand de bal op de tee legt, ziet hij jouw naam. Bovendien past het geschenk bij het moment: in januari en februari kijken golfers vooruit naar het nieuwe seizoen.</p>
<h2>Wanneer bestel je voor kerst?</h2>
<p>Reken op 5 tot 15 werkdagen na goedkeuring van de drukproef. Daar komt de tijd bij die jij nodig hebt om de drukproef te bekijken en eventueel intern af te stemmen. Wil je de ballen vóór de kerstdagen uitdelen of versturen, vraag dan je drukproef <strong>uiterlijk eind november of begin december</strong> aan. Hoe eerder, hoe meer rust je hebt om ook de verzending naar je relaties te regelen.</p>
<p>Ben je later? Neem dan direct <a href="/contact/">contact</a> op met Mark. Dan kijken we samen wat er nog haalbaar is en welke datum realistisch is, in plaats van je iets te beloven dat niet lukt.</p>
<h2>Welke bal kies je voor een kerstgeschenk?</h2>
<ul>
<li><strong>Voor je belangrijkste relaties:</strong> een <a href="/products/titleist-pro-v1/">Titleist Pro V1</a> of <a href="/products/titleist-pro-v1x/">Pro V1x</a>. De bal die golfers zelf het liefst spelen; een geschenk met status.</li>
<li><strong>Voor een brede groep klanten of personeel:</strong> een <a href="/products/titleist-trufeel/">Titleist TruFeel</a> of <a href="/products/pinnacle-soft-met-bedrukking/">Pinnacle Soft</a>. Zacht, prettig voor elk niveau en scherp geprijsd bij grotere aantallen.</li>
<li><strong>Twijfel je?</strong> Doe de <a href="/golfbalkiezer/">golfbalkiezer</a> of laat Mark adviseren.</li>
</ul>
<h2>Hoeveel heb je nodig?</h2>
<p>Bedrukken start bij 144 golfballen, oftewel 12 dozijn. Geef je per relatie een dozijn, dan heb je met 144 ballen geschenken voor 12 relaties. Met 288 ballen kun je 24 relaties een dozijn geven, of 48 relaties een half dozijn. Tip: bestel er meteen een paar dozijn bij voor nieuwe klanten in het voorjaar of voor je eigen golfdag. Een grotere oplage is per bal voordeliger.</p>
<h2>Maak het persoonlijk</h2>
<p>Een logo is mooi; een logo met een kleine extra is beter. Denk aan het jaartal ("Seizoen 2027"), een korte boodschap op de tweede zijde, of een persoonlijk kaartje in de doos. Wil je per relatie een naam op de bal, overleg dat dan vooraf: elke aparte opdruk telt als eigen drukgang. Bekijk ook de mogelijkheden op <a href="/golfballen-personaliseren/">golfballen personaliseren</a>.</p>
<h2>Zo regel je het in vijf minuten</h2>
<ol>
<li>Kies je bal en aantal in de <a href="/golfballen-bedrukken/#configurator">bestelwizard voor golfballen bedrukken</a>.</li>
<li>Upload je logo, bij voorkeur als EPS, AI, PDF of SVG.</li>
<li>Vermeld je gewenste leverdatum en de gelegenheid (kerstgeschenk).</li>
<li>Je ontvangt een gratis digitale drukproef met offerte.</li>
<li>Na jouw akkoord gaan de ballen in productie.</li>
</ol>
<p>Meer over zakelijke geschenken lees je bij <a href="/toepassingen/golfballen-relatiegeschenk/">golfballen als relatiegeschenk</a> en <a href="/golfballen-bedrukken-voor-bedrijven/">golfballen bedrukken voor bedrijven</a>.</p>`,
  faq:[
    ['Wanneer moet ik bestellen voor kerst?', 'Vraag je drukproef uiterlijk eind november of begin december aan. De levertijd is 5 tot 15 werkdagen na akkoord op de drukproef.'],
    ['Wat is de minimale afname?', '144 golfballen, oftewel 12 dozijn. Daarmee geef je bijvoorbeeld 12 relaties elk een dozijn.'],
    ['Welke golfbal is het mooiste kerstgeschenk?', 'Voor belangrijke relaties een Titleist Pro V1 of Pro V1x; voor een brede groep een TruFeel of Pinnacle Soft.'],
    ['Kan ik een jaartal of kerstboodschap toevoegen?', 'Ja, bijvoorbeeld op de tweede zijde van de bal. Je ziet het eerst in de gratis drukproef.'],
    ['Kan ik per relatie een andere naam laten drukken?', 'Dat kan in overleg. Elke aparte opdruk telt als eigen drukgang, dus stem het vooraf af met Mark.'],
    ['Ben ik te laat voor kerst?', 'Neem direct contact op met Mark. We zeggen je eerlijk welke leverdatum nog haalbaar is.'],
  ]},
  en:{
  title:'Printed golf balls as a Christmas gift for clients',
  desc:'Golf balls with your logo as a Christmas gift for clients and staff: which ball, how many, when to order and how to make it personal. Plan your Christmas order in time.',
  h1:'Printed golf balls as a Christmas gift',
  body:`<p class="lead">A Christmas hamper gets eaten and forgotten. Golf balls with your logo go in the bag and come out on the course all spring. For clients, business contacts and staff who play golf, it is a Christmas gift that actually gets used — if you plan it well.</p>
<h2>Why golf balls work as a Christmas gift</h2>
<p>Golfers use balls, lose them and always need new ones. A dozen original brand balls with your logo is therefore not a gadget that disappears into a drawer, but something that comes out in the first round of the new season. And every time someone tees it up, they see your name. The gift also suits the moment: in January and February, golfers are looking ahead to the new season.</p>
<h2>When should you order for Christmas?</h2>
<p>Allow 5 to 15 working days after approval of the proof. Add the time you need to review the proof and perhaps agree it internally. If you want to hand out or ship the balls before the holidays, request your proof <strong>by the end of November or early December</strong>. The earlier you start, the more time you have to arrange shipping to your contacts.</p>
<p>Running late? Get in <a href="/contact/">touch</a> with Mark straight away. We will look together at what is still feasible and which date is realistic, rather than promising something that won't work out.</p>
<h2>Which ball for a Christmas gift?</h2>
<ul>
<li><strong>For your most important clients:</strong> a <a href="/products/titleist-pro-v1/">Titleist Pro V1</a> or <a href="/products/titleist-pro-v1x/">Pro V1x</a>. The ball golfers most like to play themselves; a gift with status.</li>
<li><strong>For a broad group of clients or staff:</strong> a <a href="/products/titleist-trufeel/">Titleist TruFeel</a> or <a href="/products/pinnacle-soft-met-bedrukking/">Pinnacle Soft</a>. Soft, pleasant for every level and keenly priced in larger quantities.</li>
<li><strong>Not sure?</strong> Take the <a href="/golfbalkiezer/">golf ball finder</a> or ask Mark.</li>
</ul>
<h2>How many do you need?</h2>
<p>Printing starts at 144 golf balls, or 12 dozen. Give each contact a dozen and 144 balls covers 12 gifts. With 288 balls you can give 24 contacts a dozen, or 48 contacts half a dozen. Tip: order a few extra dozen for new clients in spring or for your own golf day. A larger run is better value per ball.</p>
<h2>Make it personal</h2>
<p>A logo is nice; a logo with a small extra is better. Think of the year ("Season 2027"), a short message on the second side, or a personal card in the box. Want a different name per contact? Discuss it in advance: every separate print counts as its own run. Also see the options for <a href="/golfballen-personaliseren/">personalised golf balls</a>.</p>
<h2>Sorted in five minutes</h2>
<ol>
<li>Choose your ball and quantity in the <a href="/golfballen-bedrukken/#configurator">golf ball printing order wizard</a>.</li>
<li>Upload your logo, ideally as EPS, AI, PDF or SVG.</li>
<li>Mention your preferred delivery date and the occasion (Christmas gift).</li>
<li>You receive a free digital proof with a quote.</li>
<li>Once you approve, the balls go into production.</li>
</ol>
<p>Read more about business gifts in <a href="/toepassingen/golfballen-relatiegeschenk/">golf balls as a corporate gift</a> and <a href="/golfballen-bedrukken-voor-bedrijven/">golf balls printed for companies</a>.</p>`,
  faq:[
    ['When should I order for Christmas?', 'Request your proof by the end of November or early December. The lead time is 5 to 15 working days after you approve the proof.'],
    ['What is the minimum order?', '144 golf balls, or 12 dozen. That gives, for example, 12 contacts a dozen each.'],
    ['Which golf ball makes the best Christmas gift?', 'For key clients a Titleist Pro V1 or Pro V1x; for a broad group a TruFeel or Pinnacle Soft.'],
    ['Can I add a year or a Christmas message?', 'Yes, for example on the second side of the ball. You see it first in the free proof.'],
    ['Can I print a different name for each contact?', 'That is possible by arrangement. Every separate print counts as its own run, so agree it with Mark in advance.'],
    ['Am I too late for Christmas?', 'Contact Mark straight away. We will tell you honestly which delivery date is still feasible.'],
  ]}
},
];
