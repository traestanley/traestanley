const ORDER = [...CLIPS].sort((a,b)=>a.start-b.start || "V2V1A1A2".indexOf(a.track)-"V2V1A1A2".indexOf(b.track));
const $ = s=>document.querySelector(s);
const monitor=$("#monitor"), insp=$("#insp"), ph=$("#ph"), tcEl=$("#tc");
let cur=null, t=0, playing=false, raf=0, last=0;

const tc = s => { const f=Math.floor(s*FPS); const p=n=>String(n).padStart(2,"0");
  return `${p(Math.floor(f/(FPS*3600)))}:${p(Math.floor(f/(FPS*60))%60)}:${p(Math.floor(f/FPS)%60)}:${p(f%FPS)}`; };
const pct = s => (s/LEN*100)+"%";

// ruler
for(let s=0;s<LEN;s+=10){ const sp=document.createElement("span"); sp.style.left=pct(s); sp.textContent=tc(s).slice(3,8); $("#ruler").appendChild(sp); }

// scenes + clips
const sceneHTML=c=>c.scene.replace('class="scene','data-id="'+c.id+'" class="scene');
CLIPS.forEach(c=>{
  monitor.insertAdjacentHTML("beforeend", sceneHTML(c));
  const b=document.createElement("button");
  b.className="clip"+(c.wave?" wave":"")+(c.img?" thumb":"");
  b.style.cssText=`left:${pct(c.start)};width:calc(${pct(c.dur)} - 2px);--k:${KIND[c.kind].color}`;
  b.dataset.id=c.id; b.setAttribute("aria-label",`${KIND[c.kind].label}: ${c.name}`);
  b.innerHTML=(c.img?`<img src="${c.img}" alt="">`:"")+`<span>${c.name}</span>`;
  b.onclick=()=>{ stop(); select(c.id,true); };
  document.querySelector(`.lane[data-track="${c.track}"]`).appendChild(b);
});

// nav + plain lists
[["Essays","essay1","essay"],["Notes","note1","note"],["Work","film1","film"],["About","about","me"]].forEach(([l,id,k])=>{
  const b=document.createElement("button"); b.textContent=l; b.dataset.go=id; b.style.setProperty("--k",KIND[k].color); $("#nav").appendChild(b);
});
const li=(c)=>c.url&&c.kind==="essay"?`<li><a href="${c.url}">${c.title}</a></li>`:`<li><button data-go="${c.id}">${c.title}</button>${c.soon?' <span class="tag">Coming soon</span>':''}</li>`;
$("#list-a").innerHTML=CLIPS.filter(c=>c.kind==="essay").map(li).join("");
$("#list-b").innerHTML=CLIPS.filter(c=>c.kind==="film").map(li).join("")+`<li><a href="https://www.audion.energy" target="_blank" rel="noopener">More at audion.energy ↗︎</a></li>`;

function renderInsp(c){
  if(c.kind==="essay" && c.url && !c.act.some(a=>a[1]===c.url)) c.act=[["Read the essay",c.url],...c.act];
  const k=KIND[c.kind];
  insp.style.setProperty("--k",k.color);
  insp.innerHTML=`<div class="kind mono"><i></i>${k.label}${c.soon?' <span class="tag">Coming soon</span>':''}</div>
    <h2>${c.title}</h2><p class="desc">${c.desc}</p>
    <dl>${[["In / Out",tc(c.start)+" – "+tc(c.start+c.dur)],...c.meta].map(([a,b])=>`<dt class="mono">${a}</dt><dd>${b}</dd>`).join("")}</dl>
    ${c.act.length?`<div class="act">${c.act.map(([l,go],i)=>/^(#|http)/.test(go)?`<a ${i?'class="sec"':''} href="${go}"${go.startsWith("http")?' target="_blank" rel="noopener"':''}>${l}</a>`:`<button ${i?'class="sec"':''} data-go="${go}">${l}</button>`).join("")}</div>`:""}`;
  $("#i-count").textContent=(ORDER.indexOf(c)+1)+" / "+ORDER.length;
}
function select(id,movePlayhead){
  const c=CLIPS.find(x=>x.id===id); if(!c||c===cur) { if(c&&movePlayhead) setT(c.start); return; }
  cur=c;
  const pl=monitor.querySelector(".scene.is-playing"); // stop a playing video before switching
  if(pl){ pl.outerHTML=sceneHTML(CLIPS.find(x=>x.id===pl.dataset.id)); monitor.classList.remove("is-playing"); }
  monitor.querySelectorAll(".scene").forEach(s=>s.classList.toggle("on",s.dataset.id===id)); monitor.classList.toggle("light",c.kind==="essay");
  document.querySelectorAll(".clip").forEach(b=>b.classList.toggle("on",b.dataset.id===id));
  $("#o-c").textContent=c.name; $("#o-a").textContent=c.kind==="essay"||c.kind==="note"?"♪ "+c.track:"● "+c.track;
  renderInsp(c);
  if(movePlayhead) setT(c.start);
  const el=document.querySelector(`.clip[data-id="${id}"]`), sc=$(".tl-scroll");
  if(el){ const hw=document.querySelector(".heads").offsetWidth, r=el.offsetLeft+hw; if(r<sc.scrollLeft+hw||r>sc.scrollLeft+sc.clientWidth-80) sc.scrollTo({left:Math.max(0,r-hw-24),behavior:"smooth"}); }
}
function setT(s){ t=Math.max(0,Math.min(LEN-0.001,s)); ph.style.left=pct(t); tcEl.textContent=tc(t); }
function step(d){ stop(); const i=cur?ORDER.indexOf(cur):-1; const n=ORDER[(i+d+ORDER.length)%ORDER.length]; select(n.id,true); }
function clipAt(s){ // most recently started clip under the playhead, video tracks win ties
  return ORDER.filter(c=>s>=c.start&&s<c.start+c.dur).sort((a,b)=>b.start-a.start)[0]; }

const SPEED=4; // tour plays the 2-minute sequence in 30 seconds
function tick(now){ if(!playing) return; t+= (now-last)/1000*SPEED; last=now;
  if(t>=LEN){ stop(); select("contact",true); return; }
  setT(t); const c=clipAt(t); if(c) select(c.id,false); raf=requestAnimationFrame(tick); }
function play(){ if(matchMedia("(prefers-reduced-motion: reduce)").matches){ step(1); return; }
  if(t>=LEN-1) setT(0); playing=true; document.body.classList.add("playing"); $("#play").textContent="❚❚ PAUSE"; last=performance.now(); raf=requestAnimationFrame(tick); }
function stop(){ playing=false; cancelAnimationFrame(raf); document.body.classList.remove("playing"); $("#play").textContent="▶ PLAY TOUR"; }

$("#play").onclick=()=>playing?stop():play();
$("#prev").onclick=()=>step(-1); $("#next").onclick=()=>step(1);
$("#ruler").onclick=e=>{ stop(); const r=e.currentTarget.getBoundingClientRect(); setT((e.clientX-r.left)/r.width*LEN); const c=clipAt(t); if(c) select(c.id,false); };
document.addEventListener("click",e=>{ const g=e.target.closest("[data-go]"); if(!g) return; e.preventDefault(); const go=g.dataset.go;
  if(go==="copy"){ const txt="hello@traestanley.com"; const done=()=>{g.textContent="Copied";setTimeout(()=>g.textContent="Copy email",1500)};
    try{ navigator.clipboard.writeText(txt).then(done,()=>{}); }catch(_){} return; }
  stop(); select(go,true); if(g.closest(".plain")) window.scrollTo({top:0,behavior:"smooth"}); });
// play a YouTube video inside the monitor
document.addEventListener("click",e=>{ const b=e.target.closest("[data-play]"); if(!b) return; stop();
  const sc=b.closest(".scene"), c=CLIPS.find(x=>x.id===sc.dataset.id);
  sc.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${b.dataset.play}?autoplay=1&rel=0&playsinline=1" title="${c.title.replace(/"/g,"")}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  sc.classList.add("is-playing"); monitor.classList.add("is-playing"); });
document.addEventListener("keydown",e=>{ if(e.target.closest("input,textarea")) return;
  if(e.key==="ArrowRight"){e.preventDefault();step(1)} else if(e.key==="ArrowLeft"){e.preventDefault();step(-1)}
  else if(e.key===" "&&!e.target.closest("button,a")){e.preventDefault(); playing?stop():play();} });

select("title",true);
