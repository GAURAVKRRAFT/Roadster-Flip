(()=>{'use strict';
const H=480,GY=372,GYC=GY-9,TAU=Math.PI*2,DT=1/120,MAXP=320;
const cv=document.getElementById('c'),g=cv.getContext('2d',{alpha:false});
let W=270,HOME=70,q=1,fa=16,isT=matchMedia('(pointer:coarse)').matches,bc,bx,night=0,nt=0,ni=0,bg,c1,c2,S,mode='title',paused=false,board=[],best=0,muted=false,AC,jg,jf,nb,ready=false,vg;
const sw=new Map(),P=[],K={},T={j:0,l:0,r:0},gp={j:0,l:0,r:0},ptr=new Set();
const R=(a,b)=>a+Math.random()*(b-a),mod=(a,n)=>((a%n)+n)%n,cl=(v,a,b)=>v<a?a:v>b?b:v,wrap=a=>mod(a+Math.PI,TAU)-Math.PI;
try{best=+localStorage.getItem('rf_best')||0;muted=localStorage.getItem('rf_mute')==='1'}catch(e){}
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const lerp=(a,b,t)=>a+(b-a)*t;
/* ---------- baked layers (perf) ---------- */
function city(w,hmin,hmax,col,lit){const c=mk(w,80),s=c.getContext('2d');s.fillStyle=col;
 for(let x=6;x<w-30;){const bw=R(10,26)|0,bh=R(hmin,hmax)|0;s.fillRect(x,80-bh,bw,bh);
  if(bh>40&&Math.random()<.5)s.fillRect(x+bw/2|0,80-bh-8,2,8);
  if(lit)for(let i=0;i<bw*bh/60;i++){s.fillStyle=Math.random()<.5?'#ffb86b':'#7fe8ff';s.globalAlpha=R(.3,.8);s.fillRect(x+2+(R(0,bw-4)|0),80-bh+3+(R(0,bh-6)|0),1,1)}
  s.globalAlpha=1;s.fillStyle=col;x+=bw+(R(1,6)|0)}return c}
function bake(){bg=mk(W,H);const s=bg.getContext('2d');
 const st=['#140a33','#2b1260','#4f1d78','#862a7c','#c3406f','#ee6a5c','#ff9a5a','#ffc46b'];
 for(let i=0;i<8;i++){s.fillStyle=st[i];s.fillRect(0,i*38,W,38)}
 for(let i=1;i<8;i++){s.fillStyle=st[i];for(let x=0;x<W;x++)s.fillRect(x,i*38-3+(x&1)*2,1,1)}
 s.fillStyle='#fff';for(let i=0;i<W/3;i++){s.globalAlpha=R(.3,.9);s.fillRect(R(0,W)|0,R(0,110)|0,1,1)}s.globalAlpha=1;
 const cx=W/2|0,gr=s.createRadialGradient(cx,262,20,cx,262,110);gr.addColorStop(0,'rgba(255,170,90,.45)');gr.addColorStop(1,'rgba(255,170,90,0)');s.fillStyle=gr;s.fillRect(0,140,W,160);
 for(let y=-46;y<46;y++){if(y>8&&mod(y,9)>5)continue;const w=Math.sqrt(2116-y*y);s.fillStyle=y<-10?'#fff0a0':y<22?'#ffb35a':'#ff6f7f';s.fillRect(cx-w,262+y,w*2,1)}
 for(let y=300;y<H;y+=4){const t=(y-300)/180;s.fillStyle=`rgb(${lerp(110,40,t)|0},${lerp(52,28,t)|0},${lerp(104,64,t)|0})`;s.fillRect(0,y,W,4)}
 s.fillStyle='#43305a';s.fillRect(0,345,W,H-345);s.fillStyle='#4f3a68';s.fillRect(0,345,W,8);s.fillStyle='#ff5a7a';s.fillRect(0,353,W,1);
 s.fillStyle='#d8434f';s.fillRect(0,336,W,3);s.fillStyle='#ff8a8a';s.fillRect(0,336,W,1);
 for(let i=0;i<7;i++){s.fillStyle=`rgba(255,160,100,${.09-i*.01})`;s.fillRect(cx-40-i*8,356+i*14,80+i*16,6)}
 c1=city(W+80,12,38,'#4a1f66',0);c2=city(W+80,22,64,'#2b1042',1)}
function fit(){W=Math.round(cl(H*innerWidth/innerHeight,270,560));cv.width=W;cv.height=H;g.imageSmoothingEnabled=false;HOME=Math.round(W*.26);bc=mk(W>>2,H>>2);bx=bc.getContext('2d');bake();vg=mk(W,H);{const s=vg.getContext('2d'),r=s.createRadialGradient(W/2,H*.52,H*.26,W/2,H*.52,H*.8);r.addColorStop(0,'rgba(8,0,20,0)');r.addColorStop(1,'rgba(8,0,20,.75)');s.fillStyle=r;s.fillRect(0,0,W,H)}}
/* ---------- audio ---------- */
function audio(){if(AC)return;try{AC=new(window.AudioContext||window.webkitAudioContext)();
 const b=AC.createBuffer(1,AC.sampleRate,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;nb=b;
 const s=AC.createBufferSource();s.buffer=b;s.loop=true;jf=AC.createBiquadFilter();jf.type='bandpass';jf.frequency.value=500;jg=AC.createGain();jg.gain.value=0;s.connect(jf);jf.connect(jg);jg.connect(AC.destination);s.start()}catch(e){AC=null}}
function beep(f1,f2,d,t='square',v=.07){if(!AC||muted)return;const o=AC.createOscillator(),n=AC.createGain(),a=AC.currentTime;o.type=t;o.frequency.setValueAtTime(f1,a);o.frequency.exponentialRampToValueAtTime(f2,a+d);n.gain.setValueAtTime(v,a);n.gain.exponentialRampToValueAtTime(.001,a+d);o.connect(n);n.connect(AC.destination);o.start(a);o.stop(a+d)}
function boom(){if(!AC||muted)return;const s=AC.createBufferSource(),n=AC.createGain(),f=AC.createBiquadFilter();s.buffer=nb;f.type='lowpass';f.frequency.value=900;n.gain.setValueAtTime(.35,AC.currentTime);n.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.7);s.connect(f);f.connect(n);n.connect(AC.destination);s.start();beep(160,30,.6,'sawtooth',.2)}
function tn(f,d,t,v,w){const o=AC.createOscillator(),n=AC.createGain();o.type=t;o.frequency.value=f;n.gain.setValueAtTime(v,w);n.gain.exponentialRampToValueAtTime(.001,w+d);o.connect(n);n.connect(AC.destination);o.start(w);o.stop(w+d)}
function music(){if(!AC||muted||paused||mode==='dead')return;const a=AC.currentTime;if(nt<a)nt=a+.05;
 while(nt<a+.25){const i=ni++,b=[55,55,65.4,49][(i>>4)&3];if(i%2===0)tn(b,.16,'sawtooth',.045,nt);tn(b*[4,6,8,6][i&3]*(i&8?1.5:1),.1,'square',.018,nt);if(i%4===0)tn(150,.1,'sine',.12,nt);nt+=.13}}
/* ---------- state ---------- */
function reset(){S={bc:0,zm:0,cam:0,tr:[],tt:0,x:HOME,cy:GYC,vx:0,vy:0,a:0,av:0,th:0,sq:0,wr:0,air:100,dist:0,score:0,rot:0,up:false,at:0,inv:0,mult:1,obs:[],pk:[],so:260,sp:500,msg:'',mt:0,md:1,mc:'#fff',shake:0,speed:140,ts:1,t:0,flash:0,sl:Array.from({length:14},()=>({x:R(0,W),y:R(40,330),l:R(14,40)})),cl:Array.from({length:6},()=>({x:R(0,W),y:R(20,200),w:R(40,100)}))}}
function lb(){try{return JSON.parse(localStorage.getItem('rf_board'))||[]}catch(e){return[]}}
function lbAdd(v){const t=lb().concat(v).sort((a,b)=>b-a).slice(0,10);try{localStorage.setItem('rf_board',JSON.stringify(t))}catch(e){}return t}
function api(){board=lb();fetch('/api/scores').then(r=>r.json()).then(b=>board=b).catch(()=>{})}
function start(){if(!ready)return;audio();if(AC&&AC.state==='suspended')AC.resume();reset();mode='play';paused=false}
function pop(m,c,d=1.2){S.msg=m;S.mc=c;S.mt=S.md=d}
function boost(){if(mode!=='play'||S.bc>0||S.air<12)return;S.bc=.45;S.air-=12;S.th=1;S.vx+=Math.sin(S.a)*230;S.vy-=Math.cos(S.a)*230;S.zm=1;S.shake=Math.max(S.shake,.25);beep(220,880,.25,'sawtooth',.1);navigator.vibrate&&navigator.vibrate(20);for(let i=0;i<20;i++){const a=i/20*TAU;add(S.x,S.cy,Math.cos(a)*120,Math.sin(a)*120,.35,'#7fe8ff',2,0,1)}}
function dive(){if(mode!=='play'||!S.up)return;S.vy+=320;S.av*=.4;S.zm=.6;beep(300,90,.2,'sawtooth',.08);for(let i=0;i<8;i++)add(S.x+R(-14,14),S.cy+8,R(-30,30),R(-80,-20),.3,'#fff',1.5,0,1)}
function add(x,y,vx,vy,l,c,s,gv=90,ad=0){if(P.length<(q?MAXP:90))P.push({x,y,vx,vy,l,c,s,gv,ad})}
function crash(){navigator.vibrate&&navigator.vibrate(90);mode='dead';S.ts=.3;S.shake=.7;S.flash=1;boom();
 for(let i=0;i<46;i++)add(S.x,S.cy,R(-130,130),R(-170,40),R(.5,1.4),['#fff','#ffb347','#ff5a5a','#ecdff0'][i&3],R(1,3.5),260,i&1);
 const sc=S.score|0;if(sc>best){best=sc;try{localStorage.setItem('rf_best',best)}catch(e){}}
 fetch('/api/score',{method:'POST',body:JSON.stringify({score:sc})}).then(r=>r.json()).then(b=>board=b).catch(()=>{board=lbAdd(sc)})}
/* ---------- input ---------- */
const L=()=>K.ArrowLeft||K.KeyA||T.l||gp.l,Rr=()=>K.ArrowRight||K.KeyD||T.r||gp.r,J=()=>K.Space||K.ArrowUp||K.KeyW||T.j||ptr.size||gp.j;
function togglePause(){if(mode==='play')paused=!paused}
function setMute(){muted=!muted;document.getElementById('bm').classList.toggle('off',muted);try{localStorage.setItem('rf_mute',muted?1:0)}catch(e){}}
addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();K[e.code]=1;if(!e.repeat){if(e.code==='ShiftLeft'||e.code==='ShiftRight'||e.code==='KeyB')boost();else if(e.code==='ArrowDown'||e.code==='KeyS')dive()}
 if((e.code==='Space'||e.code==='Enter')&&mode!=='play')start();else if(e.code==='KeyP'||e.code==='Escape')togglePause();else if(e.code==='KeyM')setMute()});
addEventListener('keyup',e=>K[e.code]=0);
addEventListener('blur',()=>{if(mode==='play')paused=true;for(const k in K)K[k]=0;ptr.clear()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='play')paused=true});
addEventListener('contextmenu',e=>e.preventDefault());
[['bl','l'],['bj','j'],['br','r']].forEach(([id,k])=>{const b=document.getElementById(id);
 b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);T[k]=1;b.classList.add('on');if(mode!=='play')start();else if(paused)paused=false});
 ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>b.addEventListener(ev,()=>{T[k]=0;b.classList.remove('on')}))});
[['bb',boost],['bd',dive]].forEach(([id,f])=>{const b=document.getElementById(id);b.addEventListener('pointerdown',e=>{e.preventDefault();audio();if(mode!=='play')start();else if(paused)paused=false;else f()})});
document.getElementById('bp').onclick=togglePause;document.getElementById('bm').onclick=()=>{audio();setMute()};
cv.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')document.body.classList.add('touch');cv.setPointerCapture(e.pointerId);
 if(mode!=='play')start();else if(paused)paused=false;else{ptr.add(e.pointerId);sw.set(e.pointerId,{x:e.clientX,y:e.clientY,d:0})}});
cv.addEventListener('pointermove',e=>{const m=sw.get(e.pointerId);if(!m||m.d||mode!=='play')return;const dx=e.clientX-m.x,dy=e.clientY-m.y,t=Math.max(26,innerHeight*.045);
 if(Math.abs(dx)>t&&Math.abs(dx)>Math.abs(dy)){m.d=1;if(S.up)S.av=cl(S.av+(dx>0?6:-6),-8,8);else S.vy-=120}else if(dy<-t){m.d=1;boost()}else if(dy>t){m.d=1;dive()}});
['pointerup','pointercancel'].forEach(ev=>cv.addEventListener(ev,e=>{ptr.delete(e.pointerId);sw.delete(e.pointerId)}));
addEventListener('touchstart',()=>{isT=true;document.body.classList.add('touch')},{passive:true});
addEventListener('resize',fit);
let gpS=0,gx=0,gy=0;function poll(){const p=(navigator.getGamepads&&navigator.getGamepads()[0]);if(!p){gp.j=gp.l=gp.r=0;return}
 const b=i=>p.buttons[i]&&p.buttons[i].pressed;gp.j=b(0)||b(7)||b(5)?1:0;gp.l=p.axes[0]<-.4||b(14)||b(4)?1:0;gp.r=p.axes[0]>.4||b(15)||b(6)?1:0;
 const s=b(9);if(s&&!gpS){mode==='play'?togglePause():start()}gpS=s;{const x=b(2),y=b(1);if(x&&!gx&&mode==='play')boost();if(y&&!gy&&mode==='play')dive();gx=x;gy=y}if(b(0)&&mode!=='play')start()}
/* ---------- simulation (fixed 120 Hz) ---------- */
function step(dt){S.t+=dt;S.shake=Math.max(0,S.shake-dt*1.6);S.flash=Math.max(0,S.flash-dt*3);S.sq*=1-9*dt;S.mt-=dt;S.bc-=dt;S.zm*=1-6*dt;S.cam+=(cl((GYC-S.cy)*.28,0,70)-S.cam)*Math.min(1,6*dt);S.tt-=dt;if(S.tt<=0){S.tt=.03;S.tr.push({x:S.x,y:S.cy,a:S.a});if(S.tr.length>6)S.tr.shift()}
 const sd=dt*S.ts;
 if(mode==='title'){S.dist+=90*dt;S.wr+=dt*20}
 if(mode==='dead'){S.ts=Math.min(.45,S.ts+dt*.05);S.speed*=1-2.2*dt;S.dist+=S.speed*sd}
 if(mode==='play'){
  S.speed=140+Math.min(S.dist/28,170);S.dist+=S.speed*dt;S.score+=S.speed*dt*.04;
  const jet=J()&&S.air>0;S.th+=((jet?1:0)-S.th)*Math.min(1,(jet?9:7)*dt);
  const f=560*S.th;S.vx+=Math.sin(S.a)*f*dt;S.vy-=Math.cos(S.a)*f*dt;S.air=Math.max(0,S.air-24*S.th*dt);
  S.vy+=400*dt;S.vy*=1-.15*dt;S.vx*=1-1.6*dt;S.vx+=(HOME-S.x)*3.2*dt;
  if(S.up){const inp=(Rr()?1:0)-(L()?1:0);S.av+=inp*20*dt;
   if(!inp){S.av*=1-dt;if(S.cy>GYC-45&&S.vy>0){S.av+=-wrap(S.a)*14*dt;S.av*=1-4*dt}}
   S.av=cl(S.av,-8,8);S.rot+=S.av*dt;S.at+=dt;if(Math.abs(wrap(S.a))>2){S.inv+=dt;S.score+=30*dt}}
  S.a+=S.av*dt;S.cy+=S.vy*dt;S.x+=S.vx*dt;S.wr+=dt*(S.up?4:S.speed/5);
  if(S.cy<34){S.cy=34;S.vy=Math.max(0,S.vy)}
  if(S.cy>=GYC){
   if(S.up){const a=wrap(S.a);if(Math.abs(a)>.85){S.cy=GYC;crash();return}
    S.sq=cl(S.vy/320,0,1);S.shake=Math.max(S.shake,S.vy/1600);
    const n=Math.floor(Math.abs(S.rot)/TAU+.3);
    if(n){S.mult=Math.min(5,S.mult+1);const pf=Math.abs(a)<.15;S.score+=(200*n*n+(pf?100:0))*S.mult;
     pop((n===1?'FLIP':n===2?'DOUBLE FLIP':n===3?'TRIPLE FLIP':n+'X FLIP')+(pf?' PERFECT':'')+' x'+S.mult,pf?'#7fe8ff':'#fff',1.5);beep(440,1100,.3)}
    else if(S.at>.5)S.mult=1;
    if(S.inv>.3){S.score+=S.inv*120;if(!n)pop('HANG TIME!','#ffb347')}
    for(let i=0;i<14;i++)add(S.x+R(-16,16),GY,R(-60,40),R(-40,-5),R(.3,.7),'#e8c9e8',R(1,3),60);
    beep(110,45,.18,'sawtooth',.12);navigator.vibrate&&navigator.vibrate(12);S.a=a;S.up=false;S.rot=0;S.at=0;S.inv=0}
   S.cy=GYC;S.vy=0;S.av=0;S.a-=S.a*Math.min(1,16*dt);S.air=Math.min(100,S.air+9*dt);
   if(Math.random()<dt*30)add(S.x-22,GY,-R(30,70),-R(5,20),.4,'#c9a8d8',R(1,2),20)}
  else S.up=true;
  if(S.th>.1)for(let k=0;k<2;k++){const o=k?13:-13,c=Math.cos(S.a),s=Math.sin(S.a);if(Math.random()<dt*140)add(S.x+o*c-10*-s,S.cy+o*s+10*c,-S.speed*.2+R(-15,15)-s*60,60*c+R(-10,20),R(.2,.5),Math.random()<.5?'#7fe8ff':'#fff',R(1,2),120,1)}
  S.so-=S.speed*dt;if(S.so<=0){const k=Math.random(),o=k<.4?{w:60,h:36,t:0}:k<.75?{w:40,h:17,t:1}:{w:9,h:22,t:2};o.x=W+30;S.obs.push(o);S.so=R(220,380)*(S.speed/140)}
  S.sp-=S.speed*dt;if(S.sp<=0){const n=3+(R(0,3)|0),b=R(230,320);for(let i=0;i<n;i++)S.pk.push({x:W+20+i*20,y:b-Math.sin(i/(n-1)*Math.PI)*45,ph:i});S.sp=R(420,700)}
  const c=Math.abs(Math.cos(S.a)),s=Math.abs(Math.sin(S.a)),hw=(21*c+9*s)*.85,hh=(21*s+9*c)*.85;
  for(const o of S.obs){o.x-=S.speed*dt;const ov=Math.abs(S.x-(o.x+o.w/2))<hw+o.w/2;
   if(ov&&S.cy+hh>GY-o.h){crash();return}
   if(ov&&!o.nm&&S.up&&S.cy+hh>GY-o.h-12){o.nm=1;S.score+=25*S.mult;pop('NEAR MISS +'+25*S.mult,'#ffe27a',.9)}}
  for(const p of S.pk){p.x-=S.speed*dt;const dx=S.x-p.x,dy=S.cy-p.y,d=Math.hypot(dx,dy);
   if(d<40){p.x+=dx/d*160*dt;p.y+=dy/d*160*dt}
   if(d<16){p.g=1;S.air=Math.min(100,S.air+30);S.score+=50;beep(660,1320,.12,'square',.06);for(let i=0;i<8;i++)add(p.x,p.y,R(-60,60),R(-60,60),.4,'#7fe8ff',2,0,1)}}
  S.obs=S.obs.filter(o=>o.x>-80);S.pk=S.pk.filter(p=>p.x>-20&&!p.g)}
 for(const q of S.sl){q.x-=S.speed*(1.6+S.th)*dt;if(q.x+q.l<0){q.x=W+R(0,60);q.y=R(40,330)}}
 for(const q of S.cl){q.x-=S.speed*.03*dt;if(q.x+q.w<0)q.x=W}
 for(let i=P.length-1;i>=0;i--){const p=P[i];p.x+=(p.vx-(mode==='play'?S.speed*.55:0))*sd;p.y+=p.vy*sd;p.vy+=p.gv*sd;p.l-=sd;if(p.l<=0){P[i]=P[P.length-1];P.pop()}}}
/* ---------- drawing ---------- */
function tx(s,x,y,c='#ffe9a8',z=8,al='center'){g.font=z+"px 'Press Start 2P',monospace";g.textAlign=al;g.fillStyle='#1d0a2e';g.fillText(s,x+1,y+1);g.fillStyle=c;g.fillText(s,x,y)}
function glow(x,y,r,c,a){const q=g.globalAlpha;g.globalCompositeOperation='lighter';g.globalAlpha=a*q;g.fillStyle=c;g.beginPath();g.arc(x,y,r,0,TAU);g.fill();g.globalAlpha=q;g.globalCompositeOperation='source-over'}
const PA=[[-23,4],[-23,-1],[-15,-4],[-7,-8],[6,-8],[15,-3],[23,-1],[23,4]],PB=[[-23,-1],[-15,-4],[-7,-8],[6,-8],[15,-3],[23,-1],[23,0],[-23,0]];
function poly(a){g.moveTo(a[0][0],a[0][1]);for(let i=1;i<a.length;i++)g.lineTo(a[i][0],a[i][1])}
function car(px,py,pa,al){const hov=mode==='title'?Math.sin(S.t*2)*1.5:0;
 g.save();g.globalAlpha=al;g.translate(px|0,(py+hov)|0);g.rotate(pa);g.scale(1+S.sq*.05,1-S.sq*.1);
 if(S.th>.05)for(const o of[-13,13]){const l=6+S.th*16+Math.random()*5;
  glow(o,12,12*S.th+4,'#4fd8ff',.35*S.th);g.fillStyle='rgba(79,216,255,.85)';g.beginPath();g.moveTo(o-4,9);g.lineTo(o+4,9);g.lineTo(o,9+l);g.fill();
  g.fillStyle='#fff';g.beginPath();g.moveTo(o-2,9);g.lineTo(o+2,9);g.lineTo(o,9+l*.55);g.fill()}
 g.fillStyle='#2a2038';g.fillRect(-16,8,6,3);g.fillRect(10,8,6,3);
 g.fillStyle='#b7a6ca';g.beginPath();poly(PA);g.fill();
 g.fillStyle='#f3e9f7';g.beginPath();poly(PB);g.fill();
 g.fillStyle='#35255a';g.beginPath();g.moveTo(-14,-3.5);g.lineTo(-6,-7);g.lineTo(5,-7);g.lineTo(12,-3.5);g.fill();
 g.fillStyle='#7a66a8';g.fillRect(-4,-6,2,2);g.fillRect(0,-6,5,1);
 g.fillStyle='#8a78a0';g.fillRect(-23,2,46,1);g.fillStyle='#6d5a86';g.fillRect(-1,-3,1,6);
 g.fillStyle='#ff2d4a';g.fillRect(-24,-1,2,4);glow(-24,0,6,'#ff2d4a',.5);
 g.fillStyle='#fff6c0';g.fillRect(21,-1,3,2);glow(25,0,5,'#fff6c0',.25);g.globalCompositeOperation='lighter';g.fillStyle=`rgba(255,240,190,${.05+night*.12})`;g.beginPath();g.moveTo(24,0);g.lineTo(80,-16);g.lineTo(80,14);g.fill();g.globalCompositeOperation='source-over';
 for(const o of[-13,13]){g.fillStyle='#241838';g.beginPath();g.arc(o,3,7,Math.PI,0);g.fill();g.fillStyle='#15101f';g.beginPath();g.arc(o,4,5,0,TAU);g.fill();
  g.fillStyle='#d7d0e6';g.beginPath();g.arc(o,4,3,0,TAU);g.fill();g.strokeStyle='#6d5a86';g.lineWidth=1;g.beginPath();for(let k=0;k<3;k++){const q=S.wr+k*TAU/3;g.moveTo(o,4);g.lineTo(o+Math.cos(q)*3,4+Math.sin(q)*3)}g.stroke()}
 g.restore()}
function obs(o){const x=o.x|0,y=GY;
 if(o.t===0){g.fillStyle='#cfc3d6';g.fillRect(x,y-o.h,o.w-14,o.h-7);g.fillStyle='#a99bbd';g.fillRect(x,y-o.h,o.w-14,2);
  g.fillStyle='#4a3a6a';g.fillRect(x+8,y-o.h+7,26,14);g.fillStyle='#ffe9a8';g.fillRect(x+10,y-o.h+10,10,1);g.fillRect(x+10,y-o.h+13,16,1);
  g.fillStyle='#b9acce';g.fillRect(x+o.w-14,y-o.h+12,14,o.h-19);g.fillStyle='#35255a';g.fillRect(x+o.w-9,y-o.h+14,8,8);
  g.fillStyle='#6d5a86';g.fillRect(x,y-9,o.w,3);g.fillStyle='#ff2d4a';g.fillRect(x,y-14,2,4);}
 else if(o.t===1){g.fillStyle='#6f5f89';g.fillRect(x,y-o.h+5,o.w,o.h-9);g.fillStyle='#8e7ea8';g.fillRect(x+9,y-o.h,22,7);g.fillStyle='#2c1f48';g.fillRect(x+12,y-o.h+2,16,4);
  g.fillStyle='#ff2d4a';g.fillRect(x,y-10,2,3);g.fillStyle='#ffe27a';g.fillRect(x+o.w-2,y-10,2,3)}
 else{g.fillStyle='#fff';g.fillRect(x,y-o.h,o.w,o.h);g.fillStyle='#e23c4d';for(let i=2;i<o.h;i+=8)g.fillRect(x,y-o.h+i,o.w,4)}
 if(o.t<2)for(const wx of o.t?[9,o.w-9]:[10,o.w-24]){g.fillStyle='#1d1530';g.beginPath();g.arc(x+wx,y-4,5,0,TAU);g.fill();g.fillStyle='#8a7aa0';g.fillRect(x+wx-1,y-5,2,2)}}
function render(){
 g.save();if(S.shake>0)g.translate((Math.random()-.5)*S.shake*12|0,(Math.random()-.5)*S.shake*12|0);
 if(S.zm>.01){g.translate(W/2,H/2);g.scale(1+S.zm*.05,1+S.zm*.05);g.translate(-W/2,-H/2)}g.translate(0,S.cam|0);g.fillStyle='#140a33';g.fillRect(0,-90,W,92);g.drawImage(bg,0,0);night=Math.min(.45,S.dist/22000);g.fillStyle=`rgba(18,6,56,${night})`;g.fillRect(0,0,W,345);g.fillStyle='rgba(255,210,230,.22)';for(const q of S.cl)g.fillRect(q.x|0,q.y|0,q.w|0,2);
 const w2=c1.width;let o=-mod(S.dist*.05,w2)|0;g.drawImage(c1,o,238);g.drawImage(c1,o+w2,238);
 o=-mod(S.dist*.12,w2)|0;g.drawImage(c2,o,262);g.drawImage(c2,o+w2,262);g.fillStyle='#2b1042';g.fillRect(0,340,W,0);
 g.fillStyle='#7a3a60';for(let i=0;i<W/24+2;i++)g.fillRect(mod(i*24-S.dist*.9,W+24)-12,339,3,9);
 for(let i=0;i<W/160+2;i++){const x=mod(i*160-S.dist*.6,W+160)-30;g.fillStyle='#2a1440';g.fillRect(x,250,3,88);g.fillRect(x-3,248,8,2);g.fillStyle='#fff7d0';g.fillRect(x-5,250,8,2);glow(x-1,252,18,'#ffd89a',.22+night*.3)}
 g.fillStyle='#e8d5f0';for(let i=0;i<W/56+2;i++)g.fillRect(mod(i*56-S.dist,W+56)-20,434,26,2);
 const alt=cl((GYC-S.cy)/140,0,1);g.fillStyle='rgba(0,0,0,.3)';g.fillRect(S.x-22*(1-alt*.5),GY+1,44*(1-alt*.5),3);
 if(S.th>.1&&alt<1){g.globalAlpha=.25*S.th*(1-alt);g.fillStyle='#7fe8ff';g.fillRect(S.x-30,GY-1,60,3);g.globalAlpha=1}
 for(const p of S.pk){const b=Math.sin(S.t*6+p.ph)*1.5;glow(p.x,p.y+b,10,'#7fe8ff',.3);g.fillStyle='#2a7fa0';g.beginPath();g.arc(p.x,p.y+b,7,0,TAU);g.fill();g.fillStyle='#7fe8ff';g.beginPath();g.arc(p.x,p.y+b,5,0,TAU);g.fill();g.fillStyle='#fff';g.fillRect(p.x-2,p.y+b-3,2,2)}
 S.obs.forEach(obs);if(mode==='play'&&(S.th>.25||Math.abs(S.av)>3))for(let i=0;i<S.tr.length;i++){const t=S.tr[i];car(t.x,t.y,t.a,.05+i*.02)}if(mode!=='dead'){g.save();g.beginPath();g.rect(0,GY+2,W,H);g.clip();g.translate(0,2*GY+3);g.scale(1,-1);car(S.x,S.cy,S.a,.16);g.restore();car(S.x,S.cy,S.a,1)}
 for(const p of P){if(p.ad){g.globalCompositeOperation='lighter'}g.globalAlpha=cl(p.l*3,0,1);g.fillStyle=p.c;g.fillRect(p.x|0,p.y|0,p.s,p.s);g.globalCompositeOperation='source-over'}g.globalAlpha=1;
 if(mode==='play'&&(S.speed>190||S.th>.3)){g.fillStyle='rgba(255,255,255,.18)';for(const q of S.sl)g.fillRect(q.x|0,q.y|0,q.l*(1+S.th),1)}
 if(S.flash>0){g.fillStyle=`rgba(255,255,255,${S.flash*.6})`;g.fillRect(0,-90,W,H+180)}
 g.restore();if(q){bx.drawImage(cv,0,0,W>>2,H>>2);g.save();g.imageSmoothingEnabled=true;g.globalCompositeOperation='lighter';g.globalAlpha=.2;g.drawImage(bc,0,0,W,H);g.restore()}g.globalAlpha=Math.min(1,.6+Math.max(0,S.speed-140)/330+Math.max(0,S.bc)*.4);g.drawImage(vg,0,0);g.globalAlpha=1;hud()}
function pn(x,y,w,h,c='#7fe8ff'){const a=g.globalAlpha;g.save();g.globalAlpha=a*.55;g.fillStyle='#10051f';g.fillRect(x,y,w,h);g.globalAlpha=a*.9;g.strokeStyle=c;g.lineWidth=1;g.strokeRect(x+.5,y+.5,w-1,h-1);g.fillStyle=c;g.fillRect(x,y,6,1);g.fillRect(x,y,1,6);g.fillRect(x+w-6,y+h-1,6,1);g.fillRect(x+w-1,y+h-6,1,6);g.restore()}
function hud(){
 if(mode!=='title'){const lo=S.air<25&&Math.sin(S.t*14)>0;pn(2,4,80,48);pn(W/2-50,6,100,58,'#ffe9a8');g.fillStyle='#1d0a2e';g.fillRect(6,10,74,10);
  for(let i=0;i<10;i++){g.fillStyle=S.air>i*10+5?(lo?'#ff5a5a':S.air<25?'#ff9a5a':'#7fe8ff'):'#3a2a4a';g.fillRect(8+i*7,12,6,6)}
  tx('AIR',6,32,'#7fe8ff',6,'left');tx('BEST '+best,6,46,'#c9a8ff',6,'left');
  tx(String(S.score|0).padStart(6,'0'),W/2,28,'#ffe9a8',12);if(S.mult>1)tx('x'+S.mult,W/2,44,'#7fe8ff',8);tx((S.speed*.6|0)+' MPH',W/2,58,'#ff9a5a',6);
  if(S.mt>0){const e=S.md-S.mt,z=8+Math.max(0,.2-e)*40;g.globalAlpha=cl(S.mt*4,0,1);tx(S.msg,W/2,110-e*8,S.mc,z|0);g.globalAlpha=1}}
 const tc=isT;

 if(mode==='title'){const e=Math.min(1,S.t*1.5),ee=1-(1-e)*(1-e),cx=W/2,y0=104-(1-ee)*28,gc='hsl('+(35+155*(.5+.5*Math.sin(S.t*1.5))|0)+',95%,75%)';
  g.fillStyle='rgba(6,1,16,'+.5*ee+')';g.fillRect(0,0,W,H);glow(cx,y0+16,100,'#ff5a8a',.16+.05*Math.sin(S.t*3));
  g.fillStyle='#000';g.fillRect(0,0,W,22*ee);g.fillRect(0,H-22*ee,W,22*ee);g.globalAlpha=ee;
  for(const[t,y,c]of[['ROADSTER',y0,'#ffe9a8'],['FLIP',y0+34,'#7fe8ff']]){tx(t,cx-2,y+1,'#ff2d7a',22);tx(t,cx+2,y-1,'#4fd8ff',22);tx(t,cx,y,c,22)}
  pn(cx-96,180,192,70);[tc?'HOLD SCREEN OR JET TO FLY':'HOLD SPACE TO FLY',tc?'SWIPE LEFT/RIGHT TO FLIP':'ARROWS FLIP  SHIFT BOOST',tc?'SWIPE UP BOOST  DOWN DIVE':'S / DOWN TO DIVE','LAND ON YOUR WHEELS'].forEach((t,i)=>tx(t,cx,196+i*15,'#fff',7));
  g.globalAlpha=ee*(.7+.3*Math.sin(S.t*5));pn(cx-74,266,148,28,'#ffe9a8');tx(tc?'TAP TO START':'PRESS SPACE',cx,285,'#ffe9a8',8);g.globalAlpha=ee;
  tx('BEST '+best,cx,318,'#c9a8ff',7);tx('MADE BY',cx,H-52,'#8a6aa8',6);tx('GAURAV MOHAPATRA',cx,H-36,gc,9);tx('P PAUSE  M MUTE',cx,H-8,'#8a6aa8',6);g.globalAlpha=1}

 if(mode==='dead'){g.fillStyle='rgba(8,2,20,.6)';g.fillRect(0,118,W,156);pn(W/2-90,124,180,144,'#ff5a7a');tx('CRASHED!',W/2,150,'#ff5a7a',16);tx('SCORE '+(S.score|0),W/2,182,'#fff',9);if(S.score>=best&&best>0)tx('NEW BEST!',W/2,198,'#ffe27a',7);
  board.slice(0,3).forEach((b,i)=>tx((i+1)+'. '+b,W/2,222+i*14,'#c9a8ff',7));
  if(S.t>.8&&Math.sin(S.t*5)>0)tx(tc?'TAP TO RETRY':'SPACE TO RETRY',W/2,290,'#ffe9a8',8);tx('MADE BY GAURAV MOHAPATRA',W/2,H-10,'#8a6aa8',6)}
 if(paused){g.fillStyle='rgba(10,4,25,.6)';g.fillRect(0,0,W,H);tx('PAUSED',W/2,230,'#fff',14);tx(tc?'TAP TO RESUME':'P TO RESUME',W/2,255,'#ffe9a8',7);tx('MADE BY GAURAV MOHAPATRA',W/2,H-14,'#c9a8ff',6)}}
/* ---------- loop ---------- */
let last=0,acc=0;
function frame(n){requestAnimationFrame(frame);const dt=Math.min(.05,(n-last)/1000||0);last=n;poll();fa+=(dt*1000-fa)*.03;if(fa>26)q=0;else if(fa<19)q=1;
 if(!paused){acc+=dt;while(acc>=DT){step(DT);acc-=DT}}else acc=0;
 if(AC&&jg){const v=muted||paused||mode!=='play'?0:S.th*.12;jg.gain.setTargetAtTime(v,AC.currentTime,.04);jf.frequency.setTargetAtTime(400+S.th*700,AC.currentTime,.05)}
 music();render()}
fit();reset();api();document.getElementById('bm').classList.toggle('off',muted);
if(document.fonts)document.fonts.load("8px 'Press Start 2P'");
requestAnimationFrame(frame);
{const ld=document.getElementById('ld'),lf=document.getElementById('ldf'),lp=document.getElementById('ldp'),lt=document.getElementById('ldt'),tips=['HOLD JET TO CLIMB','FLIP IN THE AIR FOR COMBOS','LAND ON YOUR WHEELS','ORBS REFILL YOUR AIR','NEAR MISSES SCORE BIG','DIVE TO STICK LANDINGS'],t0=performance.now();let fo=0,lv=0;
(document.fonts?document.fonts.load("8px 'Press Start 2P'"):Promise.resolve()).catch(()=>{}).then(()=>{fo=1});setTimeout(()=>{fo=1},4000);
(function tick(){const e=performance.now()-t0;lv+=(Math.min(fo?1:.7,e/2800)-lv)*.1;lf.style.width=(lv*100).toFixed(1)+'%';lp.textContent=Math.min(99,lv*100|0)+'%';lt.textContent=tips[e/1300%tips.length|0];
 if(lv>.985&&fo){lf.style.width='100%';lp.textContent='100%';ld.classList.add('out');ready=true;S.t=0;setTimeout(()=>ld.remove(),800);return}requestAnimationFrame(tick)})()}
})();
