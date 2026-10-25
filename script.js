const CROP={Rice:{n:120,p:60,k:40,sow:'Jun–Jul (Kharif)',har:'Oct–Nov',d:'120–150 days'},Cotton:{n:120,p:60,k:60,sow:'Jun–Jul',har:'Nov–Jan',d:'160–180 days'},Wheat:{n:120,p:60,k:40,sow:'Nov (Rabi)',har:'Mar–Apr',d:'110–130 days'},Maize:{n:150,p:75,k:50,sow:'Jun–Jul or Oct–Nov',har:'Sep–Oct or Feb–Mar',d:'90–110 days'},Groundnut:{n:25,p:50,k:75,sow:'Jun–Jul or Oct–Nov',har:'Oct–Nov or Feb–Mar',d:'100–120 days'},Chilli:{n:120,p:60,k:60,sow:'Jun–Aug or Dec–Jan',har:'Dec–Mar',d:'150–180 days'},Tomato:{n:120,p:80,k:60,sow:'Jun–Jul or Oct–Nov',har:'Sep–Oct or Feb–Mar',d:'100–140 days'},Sugarcane:{n:250,p:100,k:120,sow:'Jan–Mar',har:'12–18 months later',d:'12–18 months'}};
const CROPS=Object.keys(CROP);
const KB=[
{c:'Rice',t:'Disease',x:'Blast shows spindle-shaped spots with grey centres on leaves. Avoid excess nitrogen, grow resistant varieties and spray tricyclazole at 0.6 g per litre at the first symptoms.'},
{c:'Rice',t:'Fertilizer',x:'Apply nitrogen in three splits: basal, active tillering and panicle initiation. A common recommendation is 120 kg N, 60 kg P2O5 and 40 kg K2O per hectare; adjust using a soil test.'},
{c:'Rice',t:'Pest',x:'Brown planthopper builds up with excess nitrogen and dense planting. Drain the field briefly, avoid broad-spectrum sprays that kill natural enemies and spray only when the threshold is crossed.'},
{c:'Cotton',t:'Pest',x:'Pink bollworm damages bolls and lint. Set pheromone traps at 5 per acre, destroy crop residue after harvest, avoid late sowing and follow the refuge crop guidelines.'},
{c:'Cotton',t:'Fertilizer',x:'Split nitrogen into 3 doses at sowing, square formation and flowering. Potassium at flowering improves boll retention and fibre quality. Follow the soil test recommendation.'},
{c:'Wheat',t:'Irrigation',x:'Irrigate at crown root initiation 20 to 25 days after sowing, then at tillering, jointing, flowering, milking and dough stages. Missing the first irrigation cuts yield sharply.'},
{c:'Wheat',t:'Disease',x:'Yellow rust appears as yellow stripes on leaves in cool humid weather. Scout weekly and spray propiconazole at 0.1 percent at first appearance.'},
{c:'Maize',t:'Pest',x:'Fall armyworm leaves ragged holes and sawdust-like frass in the whorl. Scout early, apply neem seed kernel extract at 5 percent or emamectin benzoate into the whorl.'},
{c:'Groundnut',t:'Soil',x:'Groundnut prefers well-drained sandy loam. Apply gypsum at 500 kg per hectare at flowering so pods get enough calcium and fill well.'},
{c:'Chilli',t:'Disease',x:'Leaf curl is a virus spread by whiteflies and thrips. Remove infected plants, hang yellow sticky traps, grow a maize border and control the insects early.'},
{c:'Tomato',t:'Disease',x:'Early blight causes dark rings on older leaves. Rotate crops, stake plants for airflow, remove infected leaves and spray mancozeb at 2.5 g per litre.'},
{c:'Sugarcane',t:'Irrigation',x:'Sugarcane needs roughly 1800 to 2500 mm of water over the crop cycle. Drip irrigation can save about 40 percent water and the formative phase is the most critical.'},
{c:'General',t:'Soil',x:'Red soils are often low in nitrogen, phosphorus and organic matter. Add farmyard manure at 5 to 10 tonnes per hectare and grow green manure such as sunhemp.'},
{c:'General',t:'Soil testing',x:'Collect samples from 6 to 8 spots at 15 cm depth, mix and quarter them, then test pH, EC, nitrogen, phosphorus and potassium every two to three years for a Soil Health Card.'},
{c:'General',t:'Season',x:'Kharif crops such as rice, cotton, maize and groundnut are sown June to July with the monsoon. Rabi crops such as wheat, chickpea and sorghum are sown October to December.'},
{c:'General',t:'Organic',x:'Neem oil at 5 ml per litre, jeevamrutha and vermicompost reduce chemical input. Use them as part of integrated pest management, not as a single fix.'}];
const STOP=new Set('a an the is are was were be to of in on for and or my me i how what when which do does can should it this that with at by from as about have has had get use using plants plant crop please'.split(' '));
const SYN={insects:'pest',insect:'pest',bug:'pest',bugs:'pest',worm:'pest',worms:'pest',fertiliser:'fertilizer',urea:'fertilizer',nutrient:'fertilizer',manure:'fertilizer',water:'irrigation',watering:'irrigation',irrigate:'irrigation',spots:'disease',spot:'disease',fungus:'disease',fungal:'disease',blight:'disease',virus:'disease',rust:'disease',blast:'disease',damaged:'damage',damages:'damage',holes:'damage',sow:'season',sowing:'season',sown:'season',rabi:'season',kharif:'season'};
const tok=t=>t.toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w&&!STOP.has(w)).map(w=>SYN[w]||w.replace(/(ing|ed|s)$/,''));
const docs=KB.map(d=>tok(d.c+' '+d.t+' '+d.c+' '+d.x)),df={};
docs.forEach(t=>new Set(t).forEach(w=>df[w]=(df[w]||0)+1));
const N=KB.length,idf=w=>Math.log((N+1)/((df[w]||0)+1))+1;
const vec=t=>{const m={};t.forEach(w=>m[w]=(m[w]||0)+1);let n=0;for(const w in m){m[w]*=idf(w);n+=m[w]**2}return{m,n:Math.sqrt(n)||1}};
const V=docs.map(vec),cos=(a,b)=>{let s=0;for(const w in a.m)if(b.m[w])s+=a.m[w]*b.m[w];return s/(a.n*b.n)};
function search(q){const qc=CROPS.find(c=>q.toLowerCase().includes(c.toLowerCase()))||$('#mc').value||'';const qv=vec(tok(q));
 return{qc,hits:KB.map((d,i)=>{let s=cos(qv,V[i]);if(qc&&d.c===qc)s+=.12;return{d,s}}).sort((a,b)=>b.s-a.s).slice(0,3).filter(x=>x.s>.12)}}
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ls={g(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch{return d}},s(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
function toast(m){const t=$('#toast');t.textContent=m;t.style.opacity=1;setTimeout(()=>t.style.opacity=0,1800)}
function go(id){['home','ask','tools','lib'].forEach(s=>$('#'+s).hidden=s!==id);$$('nav button').forEach(b=>b.setAttribute('aria-selected',b.dataset.go===id));scrollTo(0,0);if(id==='lib')renderSaved()}
$$('[data-go]').forEach(b=>b.onclick=()=>{go(b.dataset.go);if(b.dataset.q)send(b.dataset.q)});
// profile
CROPS.forEach(c=>{[$('#mc'),$('#fc'),$('#cc')].forEach(s=>s.insertAdjacentHTML('beforeend','<option>'+c+'</option>'))});
$('#nm').value=ls.g('nm','');$('#mc').value=ls.g('mc','Rice');$('#fc').value=$('#cc').value=$('#mc').value;
const nm=()=>$('#nm').value.trim()||'Farmer',h=new Date().getHours(),mo=new Date().getMonth();
function hi(){$('#hi').textContent=(h<12?'Good morning, ':h<17?'Good afternoon, ':'Good evening, ')+nm()}
hi();$('#nm').oninput=()=>{ls.s('nm',$('#nm').value);hi()};
$('#mc').onchange=()=>{ls.s('mc',$('#mc').value);$('#fc').value=$('#cc').value=$('#mc').value;cal();fert(true)};
$('#date').textContent=new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
$('#ses').textContent=mo>=5&&mo<=8?'Kharif season: sow rice, cotton, maize, groundnut.':mo>=9||mo<=1?'Rabi season: sow wheat, chickpea, sorghum, groundnut.':'Summer season: plan irrigation and prepare land for Kharif.';
$('#wa').onclick=()=>{go('ask');send('Disease control in '+$('#mc').value)};
$('#pr').innerHTML=[['Paddy',2300],['Cotton',7000],['Maize',2200],['Chilli (dry)',15000],['Tomato',2000]].map(p=>'<div class="price"><span>'+p[0]+'</span><b>₹'+p[1].toLocaleString('en-IN')+'</b></div>').join('');
// chat
['Cotton bolls are damaged','Fertilizer for rice','Wheat leaves have yellow stripes','Worms in maize whorl','How to test my soil?'].forEach(s=>{const b=document.createElement('button');b.className='chip';b.textContent=s;b.onclick=()=>send(s);$('#sug').append(b)});
function bot(q){const r=search(q);if(!r.hits.length)return{html:'I could not find a close match. Add the crop name and what you see, such as spots, holes or wilting.',text:''};
 const top=r.hits[0].s,cf=top>=.45?'High':top>=.28?'Medium':'Low';
 const acts=r.hits.flatMap(x=>x.d.x.split(/(?<=\.)\s+/).slice(0,2)).slice(0,4);
 const text=acts.join(' ');
 let html='<span class="tag">Confidence: '+cf+'</span>'+(r.qc?' <span class="tag">'+esc(r.qc)+'</span>':'')+'<ul>'+acts.map(a=>'<li>'+esc(a)+'</li>').join('')+'</ul>'+(cf==='Low'?'<div class="mut">Weak match. Rephrase with the crop name or check with a local agriculture officer.</div>':'');
 html+='<details><summary>Sources ('+r.hits.length+')</summary>'+r.hits.map(x=>{const p=Math.min(99,Math.round(x.s*100));return'<div style="margin-top:6px"><b>'+esc(x.d.c+' · '+x.d.t)+'</b> <span class="mut">'+p+'% similar</span><div class="bar"><i style="width:'+p+'%"></i></div></div>'}).join('')+'</details>';
 return{html,text}}
function add(cls,html){const d=document.createElement('div');d.className='m '+cls;d.innerHTML=html;$('#chat').append(d);d.scrollIntoView({block:'end',behavior:'smooth'});return d}
function send(q){q=(q||$('#q').value).trim();if(!q)return toast('Type a question first');go('ask');$('#q').value='';add('u',esc(q));
 const r=bot(q),d=add('b',r.html);
 if(r.text){const a=document.createElement('div');a.style.marginTop='8px';a.innerHTML='<button class="btn s o">🔊 Listen</button> <button class="btn s o">⭐ Save</button>';d.append(a);
  const [l,s]=a.querySelectorAll('button');
  l.onclick=()=>{if(!window.speechSynthesis)return toast('Speech not supported');speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(r.text);u.lang='en-IN';speechSynthesis.speak(u)};
  s.onclick=()=>{const v=ls.g('sv',[]);v.unshift({q,t:r.text});ls.s('sv',v.slice(0,20));toast('Saved to Library')}}}
$('#snd').onclick=()=>send();$('#q').onkeydown=e=>{if(e.key==='Enter')send()};
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
$('#mic').onclick=()=>{if(!SR)return toast('Voice input is not supported here');const r=new SR();r.lang='en-IN';r.onstart=()=>toast('Listening…');r.onresult=e=>send(e.results[0][0].transcript);r.onerror=()=>toast('Could not hear you, try again');r.start()};
// tools
function fert(quiet){const c=CROP[$('#fc').value],a=+$('#fa').value;if(!(a>0)){if(!quiet)toast('Enter area in acres');return}
 const ha=a*.4047,N=c.n*ha,P=c.p*ha,K=c.k*ha,dap=P/.46,mop=K/.6,ur=Math.max(0,N-dap*.18)/.46,f=x=>Math.round(x);
 $('#fr').innerHTML='<div class="res"><div><b>'+f(ur)+' kg</b>Urea<br><span class="mut">'+Math.ceil(ur/50)+' bags</span></div><div><b>'+f(dap)+' kg</b>DAP<br><span class="mut">'+Math.ceil(dap/50)+' bags</span></div><div><b>'+f(mop)+' kg</b>MOP<br><span class="mut">'+Math.ceil(mop/50)+' bags</span></div></div><p class="mut">For '+a+' acre of '+esc($('#fc').value)+' at '+c.n+':'+c.p+':'+c.k+' kg N:P2O5:K2O per hectare. Apply urea in 3 splits. Indicative only; follow your soil test.</p>'}
$('#fb').onclick=()=>fert();
function cal(){const c=CROP[$('#cc').value];$('#cr').innerHTML=[['Sowing',c.sow],['Harvest',c.har],['Duration',c.d]].map(r=>'<div class="price"><span>'+r[0]+'</span><b>'+r[1]+'</b></div>').join('')}
$('#cc').onchange=cal;cal();
// library
function kb(f=''){f=f.toLowerCase();$('#kl').innerHTML=KB.filter(d=>(d.c+d.t+d.x).toLowerCase().includes(f)).map(d=>'<div class="card"><span class="tag">'+esc(d.c)+'</span> <span class="tag">'+esc(d.t)+'</span><p style="margin:8px 0 0">'+esc(d.x)+'</p></div>').join('')||'<div class="card">No entries match.</div>'}
kb();$('#kf').oninput=e=>kb(e.target.value);
function renderSaved(){const v=ls.g('sv',[]);$('#sv').innerHTML=v.length?v.map((x,i)=>'<div class="card"><b>'+esc(x.q)+'</b><p>'+esc(x.t)+'</p><button class="btn s o" data-i="'+i+'">Remove</button></div>').join(''):'<div class="card">Nothing saved yet. Tap ⭐ Save under any answer.</div>';
 $$('#sv [data-i]').forEach(b=>b.onclick=()=>{const v=ls.g('sv',[]);v.splice(+b.dataset.i,1);ls.s('sv',v);renderSaved()})}
$$('.seg button').forEach(b=>b.onclick=()=>{$$('.seg button').forEach(x=>x.classList.toggle('o',x!==b));['kb','sv','ab'].forEach(id=>$('#'+id).hidden=id!==b.dataset.s)});
