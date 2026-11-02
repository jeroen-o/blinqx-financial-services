// Blinqx Financial Services – gedeelde scripts (taal, navigatie, doelgroepfilter)
var LANGS=['nl','en'];
function currentLang(){
  var q=new URLSearchParams(location.search).get('lang');
  if(LANGS.indexOf(q)!==-1) return q;
  if(location.hash==='#en') return 'en';
  return 'nl';
}
function withLang(href,l){
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
  document.querySelectorAll('.menu-panel a').forEach(function(a){
    a.addEventListener('click',function(){var m=a.closest('details'); if(m) m.open=false;});
  });
  setLang(currentLang());
  var dg=new URLSearchParams(location.search).get('doelgroep');
  var valid=['banken','verzekeraars','kredietbemiddelaars','serviceproviders','pensioen','partners','vastgoed'];
  if(document.getElementById('pillrow')){
    setFilter(valid.indexOf(dg)!==-1?dg:'all');
    if(valid.indexOf(dg)!==-1){var s=document.getElementById('services'); if(s) setTimeout(function(){s.scrollIntoView();},0);}
  }
})();
