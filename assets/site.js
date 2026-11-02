// Blinqx Financial Services – gedeelde scripts (taal, navigatie, doelgroepfilter)
var LANGS=['nl','en'];
function currentLang(){
  var q=new URLSearchParams(location.search).get('lang');
  if(LANGS.indexOf(q)!==-1) return q;
  if(location.hash==='#en') return 'en';
  return 'nl';
}
function withLang(href,l){
  if(href.charAt(0)==='#') return href;
  var parts=href.split('#'), base=parts[0], hash=parts[1]?'#'+parts[1]:'';
  var qi=base.indexOf('?'), path=qi===-1?base:base.slice(0,qi), qs=new URLSearchParams(qi===-1?'':base.slice(qi+1));
  if(l==='en') qs.set('lang','en'); else qs.delete('lang');
  var s=qs.toString();
  return path+(s?'?'+s:'')+hash;
}
function setLang(l){
  var d=document.documentElement;
  d.setAttribute('data-lang',l); d.setAttribute('lang',l);
  document.getElementById('btn-nl').setAttribute('aria-pressed',String(l==='nl'));
  document.getElementById('btn-en').setAttribute('aria-pressed',String(l==='en'));
  document.querySelectorAll('a[data-nav]').forEach(function(a){
    if(!a.dataset.base) a.dataset.base=a.getAttribute('href');
    a.setAttribute('href',withLang(a.dataset.base,l));
  });
  document.querySelectorAll('[data-nl][data-en]').forEach(function(o){o.textContent=o.getAttribute('data-'+l);});
  document.querySelectorAll('[data-ph-nl]').forEach(function(t){t.setAttribute('placeholder',t.getAttribute('data-ph-'+l));});
  var ce=document.getElementById('cerr'); if(ce) ce.textContent='';
  var hash=location.hash==='#en'||location.hash==='#nl'?'':location.hash;
  try{history.replaceState(null,'',withLang(location.pathname.split('/').pop()+location.search+hash,l));}catch(e){}
}
function setFilter(f){
  var row=document.getElementById('pillrow'); if(!row) return;
  row.querySelectorAll('.pill').forEach(function(p){p.setAttribute('aria-pressed',String(p.getAttribute('data-filter')===f));});
  var visible=0;
  document.querySelectorAll('#servicesGrid .service-card').forEach(function(c){
    var show=f==='all'||(c.getAttribute('data-tags')||'').split(' ').indexOf(f)!==-1;
    c.hidden=!show; if(show) visible++;
  });
  var e=document.getElementById('emptyState'); if(e) e.style.display=visible===0?'block':'none';
}
(function init(){
  var page=document.body.getAttribute('data-page');
  document.querySelectorAll('a[data-nav][data-key]').forEach(function(a){
    if(a.getAttribute('data-key')===page) a.setAttribute('aria-current','page');
  });
  var mb=document.getElementById('menuBtn'), mm=document.getElementById('siteMenu');
  if(mb&&mm){
    var setMenu=function(open){mm.hidden=!open;mb.setAttribute('aria-expanded',String(open));};
    mb.addEventListener('click',function(e){e.stopPropagation();setMenu(mm.hidden);});
    mm.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setMenu(false);});});
    document.addEventListener('click',function(e){if(!mm.hidden&&!mm.contains(e.target))setMenu(false);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!mm.hidden){setMenu(false);mb.focus();}});
  }
  if(document.getElementById('contactform')) document.querySelectorAll('a[data-form]').forEach(function(x){x.setAttribute('href','#contactform');});
  setLang(currentLang());
  var dg=new URLSearchParams(location.search).get('doelgroep');
  var valid=['banken','verzekeraars','kredietbemiddelaars','serviceproviders','pensioen','partners','vastgoed'];
  if(document.getElementById('pillrow')){
    setFilter(valid.indexOf(dg)!==-1?dg:'all');
    if(valid.indexOf(dg)!==-1){var s=document.getElementById('services'); if(s) setTimeout(function(){s.scrollIntoView();},0);}
  }
})();

// Contactformulier: opent e-mailprogramma met ingevuld bericht (geen externe dienst)
(function(){
  var f=document.getElementById('contactform'); if(!f) return;
  var TO='jeroen.oversteegen@blinqx.tech,igor.driessen@blinqx.tech';
  var T={nl:{miss:'Vul nog in: ',email:'een geldig e-mailadres',akkoord:'akkoord met de privacyverklaring',ok:'Uw e-mailprogramma wordt geopend. Verstuur het bericht om uw aanvraag af te ronden.',
             f:{bericht:'uw bericht',naam:'naam',organisatie:'organisatie'}},
         en:{miss:'Please complete: ',email:'a valid e-mail address',akkoord:'agreement with the privacy statement',ok:'Your e-mail program is opening. Send the message to complete your request.',
             f:{bericht:'your message',naam:'name',organisatie:'organisation'}}};
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var l=document.documentElement.getAttribute('data-lang')||'nl', t=T[l], el=f.elements, err=document.getElementById('cerr'), miss=[];
    ['bericht','naam','organisatie','email'].forEach(function(n){el[n].removeAttribute('aria-invalid');});
    ['bericht','naam','organisatie'].forEach(function(n){ if(!el[n].value.trim()){miss.push(t.f[n]);el[n].setAttribute('aria-invalid','true');} });
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.email.value.trim())){miss.push(t.email);el.email.setAttribute('aria-invalid','true');}
    if(!el.akkoord.checked) miss.push(t.akkoord);
    if(miss.length){err.className='cerr';err.textContent=t.miss+miss.join(', ')+'.';var first=f.querySelector('[aria-invalid="true"]');if(first)first.focus();return;}
    var body=['Contactaanvraag via financial-services.blinqx.tech','',
      'Bericht:',el.bericht.value.trim(),'',
      'Doelgroep: '+el.doelgroep.value,'Dienst: '+el.dienst.value,'',
      'Naam: '+el.naam.value.trim(),'Organisatie: '+el.organisatie.value.trim(),'E-mail: '+el.email.value.trim(),'Telefoon: '+(el.telefoon.value.trim()||'-'),
      'Taal: '+l.toUpperCase(),'Akkoord privacyverklaring: ja'].join('\n');
    var subj='Contactaanvraag Blinqx Financial Services – '+el.dienst.value+' – '+el.organisatie.value.trim();
    window.location.href='mailto:'+TO+'?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(body);
    err.className='cerr ok'; err.textContent=t.ok;
  });
})();
