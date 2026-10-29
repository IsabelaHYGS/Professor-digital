/* ================= ACESSIBILIDADE v39 ================= */
const A11Y_KEY='PD_ACCESSIBILITY_V39';
const A11Y_CLASSES=['a11y-large','a11y-xl','a11y-spacing','a11y-contrast','a11y-grayscale','a11y-nocolor','a11y-focus','a11y-reduced-motion','a11y-dyslexia'];
function getA11y(){try{return JSON.parse(localStorage.getItem(A11Y_KEY)||'{}')}catch(e){return {}}}
function saveA11y(o){try{localStorage.setItem(A11Y_KEY,JSON.stringify(o))}catch(e){}}
function applyA11y(){
  const o=getA11y();
  A11Y_CLASSES.forEach(c=>document.body.classList.remove(c));
  if(o.size==='large')document.body.classList.add('a11y-large');
  if(o.size==='xl')document.body.classList.add('a11y-xl');
  if(o.spacing)document.body.classList.add('a11y-spacing');
  if(o.contrast)document.body.classList.add('a11y-contrast');
  if(o.grayscale)document.body.classList.add('a11y-grayscale');
  if(o.nocolor)document.body.classList.add('a11y-nocolor');
  if(o.focus)document.body.classList.add('a11y-focus');
  if(o['reduced-motion'])document.body.classList.add('a11y-reduced-motion');
  if(o.dyslexia)document.body.classList.add('a11y-dyslexia');
  document.querySelectorAll('[data-a11y]').forEach(b=>{
    const k=b.dataset.a11y; let on=false;
    if(k==='normal')on=!o.size||o.size==='normal';
    else if(k==='large')on=o.size==='large'; else if(k==='xl')on=o.size==='xl';
    else on=!!o[k] || (k==='reduced'&&o['reduced-motion']);
    b.classList.toggle('on',on); b.setAttribute('aria-pressed',String(on));
  });
}
function setA11y(type,val){const o=getA11y();o[type]=val;saveA11y(o);applyA11y();}
function toggleA11y(key){const o=getA11y();o[key]=!o[key];saveA11y(o);applyA11y();}
function resetA11y(){try{localStorage.removeItem(A11Y_KEY)}catch(e){};window.speechSynthesis?.cancel();applyA11y();}
function toggleAccessibility(force){const p=document.getElementById('a11yPanel'),b=document.getElementById('a11yToggle');if(!p||!b)return;const open=force===undefined?!p.classList.contains('open'):!!force;p.classList.toggle('open',open);p.setAttribute('aria-hidden',String(!open));b.setAttribute('aria-expanded',String(open));if(open)setTimeout(()=>p.querySelector('button')?.focus(),30)}
function a11yText(){
  const app=document.getElementById('app');
  if(!app)return '';
  const visibleModal=[...document.querySelectorAll('.map-modal.open,.afk-modal.open,.draw-modal.open,.slides-modal.open,.pres-overlay.open')].pop();
  const root=visibleModal||app;
  return (root.innerText||'').replace(/\s+/g,' ').trim();
}
function a11ySpeak(){
  if(!('speechSynthesis' in window)){const s=document.getElementById('a11ySpeechStatus');if(s)s.textContent='Este navegador não oferece leitura em voz alta.';return}
  const text=a11yText(); if(!text)return;
  window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text);u.lang='pt-BR';u.rate=.95;u.pitch=1;
  u.onstart=()=>{const s=document.getElementById('a11ySpeechStatus');if(s)s.textContent='🔊 Lendo o conteúdo visível...'};
  u.onend=()=>{const s=document.getElementById('a11ySpeechStatus');if(s)s.textContent='Leitura concluída.'};
  window.speechSynthesis.speak(u);
}
function a11yStopSpeak(){if('speechSynthesis' in window)window.speechSynthesis.cancel();const s=document.getElementById('a11ySpeechStatus');if(s)s.textContent='Leitura interrompida.'}

document.getElementById('a11yToggle')?.addEventListener('click',()=>toggleAccessibility());
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById('a11yPanel')?.classList.contains('open'))toggleAccessibility(false)});
applyA11y();
