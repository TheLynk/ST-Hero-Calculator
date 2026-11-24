// ===== Preset depuis des captures d'écran (tout est calculé dans le navigateur) =====
const SA=/*SCANATLAS*/null;
const SHT=LANG_UI==='en'?{
  load:'Loading the text reader…',read:'Reading image',of:'of',noOcr:'The text reader (ocr.js) is missing. Put ocr.js next to the page (it is in the zip).',
  noAnchor:'No hero sheet found on this image (Info tab).',skillsOnly:'Abilities tab: skills read.',card:'Collection card: card level read.',done:'Done. Check the fields in orange, then click “Save”.',
  noImg:'No image found.',cls:'Class',lvl:'Level',fail:'Reading failed:',unsure:'to check'
}:{
  load:'Chargement du lecteur de texte…',read:'Lecture de l’image',of:'sur',noOcr:'Le lecteur de texte (ocr.js) est absent. Mettez ocr.js à côté de la page (il est dans le zip).',
  noAnchor:'Aucune fiche de héros trouvée sur cette image (onglet Infos).',skillsOnly:'Onglet Capacités : compétences lues.',card:'Carte de collection : niveau de la carte lu.',done:'Terminé. Vérifiez les champs en orange, puis cliquez sur « Enregistrer ».',
  noImg:'Aucune image trouvée.',cls:'Classe',lvl:'Niveau',fail:'Échec de la lecture :',unsure:'à vérifier'
};
let OCRW=null;
async function ocrGet(onp){
  if(OCRW) return OCRW;
  if(!window.STHC_OCR_DATA) await new Promise((ok,ko)=>{const s=document.createElement('script');s.src='ocr.js';s.onload=ok;s.onerror=()=>ko(new Error(SHT.noOcr));document.head.appendChild(s)});
  const O=window.STHC_OCR_DATA;
  // le moteur et la langue sont intégrés au worker : rien n'est téléchargé, fonctionne aussi en file://
  const shim=`(function(){var b=atob(${JSON.stringify(O.eng)}),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);var f=self.fetch;self.fetch=function(x,o){return String(x).indexOf('traineddata')>=0?Promise.resolve(new Response(u)):f(x,o)}})();\n`;
  const url=URL.createObjectURL(new Blob([shim,O.core,'\n;',O.worker],{type:'text/javascript'}));
  OCRW=await Tesseract.createWorker('eng',1,{workerPath:url,corePath:'core.js',langPath:'https://local.invalid/t',workerBlobURL:false,cacheMethod:'none',logger:m=>onp&&onp(m)});
  return OCRW;
}
const SH={};
function imgData(src){return new Promise((ok,ko)=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);ok(x.getImageData(0,0,c.width,c.height))};im.onerror=ko;im.src=src})}
async function shAtlases(){if(SH.items) return;[SH.items,SH.ui,SH.ench,SH.cls]=await Promise.all([imgData(AT.itemsImg),imgData(UA.uiImg),imgData(SA.img),imgData(AT.classesImg)]);SH.tpl={}}
// échantillonnage bilinéaire d'une ImageData
function pxl(I,x,y,o){const W=I.width,H=I.height,d=I.data;x=Math.max(0,Math.min(W-1.001,x));y=Math.max(0,Math.min(H-1.001,y));
  const x0=x|0,y0=y|0,fx=x-x0,fy=y-y0,i=(y0*W+x0)*4,j=i+W*4;
  for(let c=0;c<4;c++) o[c]=(d[i+c]*(1-fx)+d[i+4+c]*fx)*(1-fy)+(d[j+c]*(1-fx)+d[j+4+c]*fx)*fy; return o}
// grille N×N (moyenne de k×k points) centrée sur (cx,cy), côté S
function samp(I,cx,cy,S,N,k=3){const R=new Float32Array(N*N),G=new Float32Array(N*N),B=new Float32Array(N*N),A=new Float32Array(N*N),o=[0,0,0,0],c=S/N;
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){let r=0,g=0,b=0,a=0;
    for(let v=0;v<k;v++)for(let u=0;u<k;u++){pxl(I,cx-S/2+(i+(u+.5)/k)*c,cy-S/2+(j+(v+.5)/k)*c,o);const w=o[3]/255;r+=o[0]*w;g+=o[1]*w;b+=o[2]*w;a+=w}
    const n=j*N+i;R[n]=a?r/a:0;G[n]=a?g/a:0;B[n]=a?b/a:0;A[n]=a/(k*k)}
  return {R,G,B,A,N}}
// modèle tiré d'un atlas : cellule (col,row) de taille cell
function tpl(key,I,idx,cols,cell,N,maskFn){const k=key+'|'+N;if(SH.tpl[k]) return SH.tpl[k];
  const x=(idx%cols)*cell,y=Math.floor(idx/cols)*cell,F=samp(I,x+cell/2,y+cell/2,cell,N,4),ids=[];
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const n=j*N+i;if(F.A[n]>0.6&&(!maskFn||maskFn(i/N,j/N))) ids.push(n)}
  const P={ids,F,ch:[],gray:null};
  const prep=arr=>{let m=0;for(const n of ids) m+=arr[n];m/=ids.length||1;const c=new Float32Array(ids.length);let s=0;ids.forEach((n,q)=>{c[q]=arr[n]-m;s+=c[q]*c[q]});return {c,s:Math.sqrt(s)||1}};
  P.ch=[prep(F.R),prep(F.G),prep(F.B)];const Gr=new Float32Array(N*N);for(let n=0;n<N*N;n++) Gr[n]=.299*F.R[n]+.587*F.G[n]+.114*F.B[n];P.gray=prep(Gr);
  return SH.tpl[k]=P}
function corr(P,arr,pc){let m=0;const ids=P.ids;for(const n of ids) m+=arr[n];m/=ids.length||1;let s=0,d=0;for(let q=0;q<ids.length;q++){const v=arr[ids[q]]-m;s+=pc.c[q]*v;d+=v*v}return s/(pc.s*(Math.sqrt(d)||1))}
function score(P,F,gray){if(P.ids.length<12) return -1;
  if(gray){if(!F.Gr){F.Gr=new Float32Array(F.R.length);for(let n=0;n<F.R.length;n++) F.Gr[n]=.299*F.R[n]+.587*F.G[n]+.114*F.B[n]}return corr(P,F.Gr,P.gray)}
  return (corr(P,F.R,P.ch[0])+corr(P,F.G,P.ch[1])+corr(P,F.B,P.ch[2]))/3}
// cherche le meilleur modèle autour de (cx,cy) avec petits décalages et changements d'échelle
function bestOf(I,cx,cy,S,cands,o){const N=o.N||20,offs=o.offs||[-.1,-.05,0,.05,.1],scs=o.scs||[.88,.94,1,1.06,1.12],best=new Map();
  for(const sc of scs)for(const dy of offs)for(const dx of offs){const F=samp(I,cx+dx*S,cy+dy*S,S*sc,N,2);
    for(const c of cands){const v=score(c.P,F,o.gray);const b=best.get(c);if(!b||v>b.v) best.set(c,{v,dx,dy,sc})}}
  return [...best.entries()].map(([c,b])=>({...c,...b})).sort((a,b)=>b.v-a.v)}
// ---- lecture du texte ----
// masque du texte : 'white' = blanc pur ; 'bright' = pixels les plus clairs (seuil d'Otsu) ; cut = coupe après un grand espace (bouton « + »)
function whiteMask(I,x0,y0,x1,y1,scale,pad=0,mode='white',cut=0){x0=Math.max(0,Math.floor(x0));y0=Math.max(0,Math.floor(y0));x1=Math.min(I.width,Math.ceil(x1));y1=Math.min(I.height,Math.ceil(y1));
  const w=Math.max(1,x1-x0),h=Math.max(1,y1-y0),W=Math.round(w*scale)+2*pad,H=Math.round(h*scale)+2*pad,c=document.createElement('canvas');c.width=W;c.height=H;
  const x=c.getContext('2d'),O=x.createImageData(W,H),o=[0,0,0,0],M=new Uint8Array(W*H);
  let thr=0;
  if(mode==='bright'){const hist=new Float64Array(256);for(let j=y0;j<y1;j++)for(let i=x0;i<x1;i++){const p=(j*I.width+i)*4;hist[Math.round(.299*I.data[p]+.587*I.data[p+1]+.114*I.data[p+2])]++}
    const tot=w*h;let sum=0;for(let t=0;t<256;t++) sum+=t*hist[t];let sB=0,wB=0,best=-1;
    for(let t=0;t<256;t++){wB+=hist[t];if(!wB) continue;const wF=tot-wB;if(!wF) break;sB+=t*hist[t];const mB=sB/wB,mF=(sum-sB)/wF,v=wB*wF*(mB-mF)*(mB-mF);if(v>best){best=v;thr=t}}
    thr=Math.max(thr,120)}
  for(let j=pad;j<H-pad;j++)for(let i=pad;i<W-pad;i++){pxl(I,x0+(i-pad)/scale,y0+(j-pad)/scale,o);
    if(mode==='bright') M[j*W+i]=(.299*o[0]+.587*o[1]+.114*o[2])>thr?1:0;
    else{const mn=Math.min(o[0],o[1],o[2]),mx=Math.max(o[0],o[1],o[2]);M[j*W+i]=mn>165&&mx-mn<70?1:0}}
  if(cut){const gap=cut*scale;let seen=false,run=0,stop=W;for(let i=0;i<W;i++){let ink=false;for(let j=0;j<H;j++) if(M[j*W+i]){ink=true;break}
      if(ink){if(seen&&run>=gap){stop=i;break}seen=true;run=0}else run++}
    for(let j=0;j<H;j++)for(let i=stop;i<W;i++) M[j*W+i]=0}
  for(let n=0;n<W*H;n++){const v=M[n]?0:255;O.data[n*4]=O.data[n*4+1]=O.data[n*4+2]=v;O.data[n*4+3]=255}
  x.putImageData(O,0,0);return c}
function grayCanvas(I,scale){const W=Math.round(I.width*scale),H=Math.round(I.height*scale),c=document.createElement('canvas');c.width=W;c.height=H;
  const t=document.createElement('canvas');t.width=I.width;t.height=I.height;t.getContext('2d').putImageData(I,0,0);const x=c.getContext('2d');x.filter='grayscale(1)';x.drawImage(t,0,0,W,H);return c}
function words(data,scale){const out=[];for(const b of data.blocks||[])for(const p of b.paragraphs)for(const l of p.lines)for(const w of l.words){const t=w.text.trim();if(!t) continue;
  const x0=w.bbox.x0/scale,y0=w.bbox.y0/scale,x1=w.bbox.x1/scale,y1=w.bbox.y1/scale;out.push({t,c:w.confidence,x0,y0,x1,y1,h:y1-y0,yc:(y0+y1)/2})}return out}
async function ocrAll(W,c,psm){await W.setParameters({tessedit_pageseg_mode:String(psm),tessedit_char_whitelist:''});const r=await W.recognize(c,{},{blocks:true,text:true});return r.data}
async function ocrLine(W,I,box,wl,scaleTo=56,mode='white',cut=0){const h=box[3]-box[1],sc=Math.max(1,scaleTo/h),c=whiteMask(I,box[0],box[1],box[2],box[3],sc,16,mode,cut);
  await W.setParameters({tessedit_pageseg_mode:'7',tessedit_char_whitelist:wl||''});const r=await W.recognize(c,{},{text:true});let t=(r.data.text||'').trim();
  if(wl&&/^[\d,.]+$/.test(wl)) t=fix17(c,t);return {t,c:r.data.confidence}}
// le modèle confond parfois 7 et 1 dans la police du jeu : un « 1 » est étroit, un « 7 » est aussi large que les autres chiffres
function fix17(c,t){const W=c.width,H=c.height,d=c.getContext('2d').getImageData(0,0,W,H).data,runs=[];let cur=null;
  for(let i=0;i<W;i++){let y0=-1,y1=-1;for(let j=0;j<H;j++) if(d[(j*W+i)*4]<128){if(y0<0) y0=j;y1=j}
    if(y0>=0){if(!cur){cur={x0:i,x1:i,y0,y1};runs.push(cur)}else{cur.x1=i;cur.y0=Math.min(cur.y0,y0);cur.y1=Math.max(cur.y1,y1)}}else cur=null}
  const mh=Math.max(0,...runs.map(r=>r.y1-r.y0)),tall=runs.filter(r=>r.y1-r.y0>=.7*mh),dg=t.replace(/[^\d]/g,'').split('');
  if(!dg.length||tall.length!==dg.length) return t;
  const ws=tall.map(r=>r.x1-r.x0+1),oth=ws.filter((w,i)=>dg[i]!=='1'&&dg[i]!=='7').sort((a,b)=>a-b);if(!oth.length) return t;
  const med=oth[oth.length>>1];dg.forEach((x,i)=>{if(x==='1'&&ws[i]>=.75*med) dg[i]='7';else if(x==='7'&&ws[i]<.55*med) dg[i]='1'});
  let k=0;return t.replace(/\d/g,()=>dg[k++])}
const numOf=s=>{const d=String(s).replace(/[Oo]/g,'0').replace(/[^\d]/g,'');return d?+d:null};
function lev(a,b){const m=a.length,n=b.length,d=Array.from({length:m+1},(_,i)=>[i]);for(let j=1;j<=n;j++) d[0][j]=j;
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++) d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[m][n]}
const norm=s=>String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z]/g,'');
function classByName(t){const q=norm(t);if(q.length<3) return null;let best=null;
  for(const c of D.classes){const pa=SA.paragon&&SA.paragon[c.uid]||[];for(const [n,para] of [[c.name,0],[c.fr,0],[pa[0],1],[pa[1],1]]){if(!n) continue;const k=norm(n);let d=lev(q,k);
    if(q.includes(k)) d=Math.min(d,(q.length-k.length)*0.3); const r=d/Math.max(k.length,1);if(!best||r<best.r) best={c,r,para}}}
  return best&&best.r<=0.34?best:null}
// ---- repère : la ligne ESQ (valeur en %) et les valeurs alignées au-dessus ----
function findAnchor(ws){const nums=ws.filter(w=>/^[\d.,]+$/.test(w.t)&&numOf(w.t)!=null);let best=null;
  // le haut des chiffres est aligné (les virgules allongent le bas des boîtes) ; le pas des lignes est essayé à partir de chaque valeur au-dessus
  for(const P of ws){if(!/^[\dOo]{1,2}\s?%$/.test(P.t)) continue;const band=nums.filter(w=>w.x1>=P.x1-6*P.h&&w.x1<=P.x1+P.h);
    const steps=[];for(const w of band){const dy=P.y0-w.y0;for(const k of [1,2,3]) if(dy>0){const s0=dy/k;if(s0>1.6*P.h&&s0<4*P.h) steps.push(s0)}}
    for(const s0 of steps){const rows={};let sk=0,kk=0;
      for(const w of band){if(w.x1<P.x1-2.2*s0||w.x1>P.x1+0.3*s0) continue;const dy=P.y0-w.y0,k=Math.round(dy/s0);
        if([3,2,1,-1].includes(k)&&Math.abs(dy/s0-k)<0.15&&!rows[k]){rows[k]=w;sk+=k*dy;kk+=k*k}}
      const n=Object.keys(rows).length;if(n>=2&&(!best||n>best.n)) best={P,rows,n,s:sk/kk}}}
  return best}
async function analyse(file,W,say){
  const bmp=await createImageBitmap(file),cv=document.createElement('canvas');cv.width=bmp.width;cv.height=bmp.height;const cx=cv.getContext('2d',{willReadFrequently:true});cx.drawImage(bmp,0,0);
  const I=cx.getImageData(0,0,cv.width,cv.height),R={unsure:new Set(),gear:[],skills:null};
  let A=null,ws=[];
  for(const mult of [1,2]){const sc=Math.min(3,Math.max(1,1400/I.height))*mult;if(I.width*I.height*sc*sc>4.2e7) break;
    const m=whiteMask(I,0,0,I.width,I.height,sc);ws=words(await ocrAll(W,m,11),sc);window.STC_ws=ws;A=findAnchor(ws);if(A) break}
  if(!A){const sc=Math.min(3,Math.max(1,1400/I.height));const wg=words(await ocrAll(W,grayCanvas(I,sc),11),sc),all=ws.concat(wg);
    return analyseCard(all,R)||await analyseSkills(I,W,R,all)}
  R.dbgA=[A.s,A.P.x1,A.P.yc,A.P.t,Object.entries(A.rows).map(([k,w])=>k+':'+w.t+'@'+w.x1.toFixed(0)+','+w.yc.toFixed(0))];const s=A.s,xE=A.P.x1,yE=A.P.y0+A.P.h/2,xR=xE-0.806*s,yPV=yE-3*s;
  // valeurs du héros
  const rowVal=async(k,key,box)=>{let v=A.rows[k]?numOf(A.rows[k].t):null;
    const r=await ocrLine(W,I,box,'0123456789,.',56,'white',.24*s);const v2=numOf(r.t),tk=A.rows[k];
    (R.dbgV=R.dbgV||[]).push([key,tk&&tk.t,tk&&Math.round(tk.c),r.t,Math.round(r.c)]);
    // 2 lectures : on garde la plus longue ; à longueur égale, la lecture ciblée (corrigée 1/7) ; si elles diffèrent, champ à vérifier
    if(v2!=null&&(v==null||String(v2).length>=String(v).length)) v=v2;
    if(v==null||!tk&&r.c<60||(v2!=null&&tk&&v2!==numOf(tk.t))) R.unsure.add(key);R[key]=v};
  await rowVal(3,'hp',[xR-2.9*s,yPV-.42*s,xE+.12*s,yPV+.42*s]);
  await rowVal(2,'atk',[xR-2.9*s,yPV+.58*s,xE+.12*s,yPV+1.42*s]);
  await rowVal(1,'def',[xR-2.9*s,yPV+1.58*s,xE+.12*s,yPV+2.42*s]);
  R.eva=numOf(A.P.t)||0;
  await rowVal(-1,'el',[xR-2.9*s,yPV+3.58*s,xE+.12*s,yPV+4.42*s]);
  if(R.el==null&&ws.some(w=>/L[EÉ]M[EÉ]NT/i.test(w.t))){R.el=0}
  {const r=await ocrLine(W,I,[xR-3.8*s,yPV-1.95*s,xR+1.4*s,yPV-.78*s],'0123456789,.',70);R.power=numOf(r.t);if(R.power==null||r.c<60) R.unsure.add('power')}
  {const bx=[xR-4.35*s,yPV-6.15*s,xR-3.45*s,yPV-5.45*s];let r=await ocrLine(W,I,bx,'0123456789',60);if(!numOf(r.t)||r.c<60) r=await ocrLine(W,I,bx,'0123456789',60,'bright');const v=numOf(r.t);R.lvl=v&&v<=100?v:null;if(!R.lvl||r.c<60) R.unsure.add('lvl')}
  {const r=await ocrLine(W,I,[xR-1.85*s,yPV-5.75*s,xR+3.6*s,yPV-4.85*s],'',56);const t=r.t.replace(/[^\p{L}\p{N} _-]/gu,'').trim();if(r.c>55&&/^[\w -]{2,24}$/.test(t)) R.name=t}
  {const r=await ocrLine(W,I,[xR-3.15*s,yPV-2.8*s,xR+4.3*s,yPV-1.92*s],'',56,'bright');const ws2=r.t.split(/\s+/);let m=null;
    for(let a=0;a<ws2.length;a++)for(let b=a+1;b<=Math.min(ws2.length,a+3);b++){const x=classByName(ws2.slice(a,b).join(''));if(x&&(!m||x.r<m.r)) m=x}R.dbgCls=[r.t,r.c,m&&m.r];
    if(m){R.cls=m.c;R.para=m.para;if(m.r>0.15) R.unsure.add('cls');if(m.para) R.unsure.add('lvl')}}
  if(!R.cls){const ic=D.classes.filter(c=>c.icon!=null).map(c=>({c,P:tpl('cls:'+c.name,SH.cls,c.icon,Object.keys(AT.classes).length,48,16)}));
    const b=bestOf(I,xR-3.47*s,yPV-2.36*s,.66*s,ic,{N:16});if(b[0]&&b[0].v>.55){R.cls=b[0].c;R.unsure.add('cls')}}
  const cls=R.cls||makeCtx().cls; if(!R.cls) R.unsure.add('cls');
  // équipement : 6 cases (2 lignes × 3 colonnes), même ordre que les emplacements de la classe
  for(let i=0;i<cls.slots.length&&i<6;i++){const col=i%3,row=i/3|0,x0=xR+(1.418+col*2.934)*s,y0=yPV+(-1.870+row*3.276)*s;say&&say(`${i+1}/6`);
    const icx=x0+1.222*s,icy=y0+1.418*s,S=1.956*s;
    // case vide : fond presque uni (texte « Équiper »)
    {const F=samp(I,icx,icy-.12*s,1.4*s,20,1),L=[];for(let n=0;n<F.R.length;n++) L.push(.299*F.R[n]+.587*F.G[n]+.114*F.B[n]);L.sort((x,y)=>x-y);
      const ct=L[Math.floor(L.length*.95)]-L[Math.floor(L.length*.05)];(R.dbgSd=R.dbgSd||[]).push(Math.round(ct));if(ct<58){R.gear[i]=null;R.empty=(R.empty||0)+1;continue}}
    const mask=(u,v)=>v<.86&&!(u>.84&&v<.42);
    const cands=D.items.filter(x=>cls.slots[i].includes(x.type)&&x.img!=null).map(it=>({it,P:tpl('it:'+it.name,SH.items,it.img,AT.itemCols,64,20,mask)}));
    const b0=bestOf(I,icx,icy,S,cands,{N:20});
    // 2e passe plus fine sur les 8 meilleurs
    const fine=[];for(const c of b0.slice(0,8)){const P=tpl('it:'+c.it.name,SH.items,c.it.img,AT.itemCols,64,30,mask);
      const r=bestOf(I,icx+c.dx*S,icy+c.dy*S,S*c.sc,[{it:c.it,P}],{N:30,offs:[-.04,-.02,0,.02,.04],scs:[.96,1,1.04]})[0];
      fine.push({...r,dx:c.dx+r.dx*c.sc,dy:c.dy+r.dy*c.sc,sc:c.sc*r.sc})}
    const b=fine.sort((x,y)=>y.v-x.v);(R.dbgIt=R.dbgIt||[]).push(b.slice(0,3).map(x=>x.it.name+':'+x.v.toFixed(3)).join(' '));if(!b[0]||b[0].v<.4){R.unsure.add('it'+i);R.gear[i]=null;continue}const g={it:b[0].it,v:b[0].v};
    if(!b[0]||b[0].v<.55||(b[1]&&b[0].v-b[1].v<.03)) R.unsure.add('it'+i);
    g.q=quality(I,icx+b[0].dx*S,icy+b[0].dy*S,S*b[0].sc,b[0].P,x0,y0,s);if(g.q.unsure) R.unsure.add('q'+i);
    // élément (losange en haut à droite) et esprit (petit carré)
    const it=g.it;
    // en haut à droite : losange d'élément puis carré d'esprit ; sans élément, l'esprit monte à la place du losange
    const sin=(u,v)=>u>.16&&u<.84&&v>.16&&v<.84;
    const ec=D.enchants.filter(e=>e.kind==='element'&&SA.ench[e.name]!=null).map(e=>({e,P:tpl('en:'+e.name,SH.ench,SA.ench[e.name],SA.cols,SA.cell,16)}));
    const sc=D.enchants.filter(e=>e.kind==='spirit'&&SA.ench[e.name]!=null).map(e=>({e,P:tpl('sp:'+e.name,SH.ench,SA.ench[e.name],SA.cols,SA.cell,20,sin)}));
    const so={N:20,gray:true,offs:[-.12,-.06,0,.06,.12],scs:[.85,.95,1.05,1.15]};
    const eb=bestOf(I,x0+2.36*s,y0+.15*s,.74*s,ec,{N:16,offs:[-.15,-.1,-.05,0,.05,.1,.15],scs:[.85,.95,1.05,1.15]});
    const st=bestOf(I,x0+2.33*s,y0+.22*s,.6*s,sc,so), sb=bestOf(I,x0+2.396*s,y0+.905*s,.6*s,sc,so);
    (R.dbgEn=R.dbgEn||[]).push([eb[0].e.name+':'+eb[0].v.toFixed(2),st[0].e.name+':'+st[0].v.toFixed(2),sb[0].e.name+':'+sb[0].v.toFixed(2)].join(' '));
    let E=null,Sp=null,eU=false,sU=false;
    if(st[0].v>.72&&st[0].v>eb[0].v+.03){Sp=st[0];sU=st[0].v<.78||st[1]&&st[0].v-st[1].v<.02}
    else{if(eb[0].v>.55){E=eb[0];eU=eb[0].v<.65||eb[1]&&eb[0].v-eb[1].v<.02}else eU=eb[0].v>.45;
      if(sb[0].v>.68){Sp=sb[0];sU=sb[0].v<.76||sb[1]&&sb[0].v-sb[1].v<.02}else sU=sb[0].v>.6}
    if(it&&!it.builtElem){g.e=E&&E.e;if(eU) R.unsure.add('e'+i)}
    if(it&&!it.builtSpirit){g.s=Sp&&Sp.e;if(sU) R.unsure.add('s'+i)}
    R.gear[i]=g}
  // compétences : rangée d'icônes sous le héros (à gauche de la fiche)
  R.skills=skillRow(I,cls,xR-14.87*s,yPV+6.12*s,s,R);
  R.kind='info';return R}
// qualité : couleur du contour et du halo autour de l'objet
function quality(I,cx,cy,S,P,x0,y0,s){const N=P.F.N,F=samp(I,cx,cy,S,N,2),inM=new Uint8Array(N*N);for(let n=0;n<N*N;n++) inM[n]=P.F.A[n]>0.25?1:0;
  let r=0,g=0,b=0,n=0;
  for(let j=1;j<N-1;j++)for(let i=1;i<N-1;i++){const q=j*N+i;if(inM[q]) continue;if(j/N>.84||(i/N>.82&&j/N<.45)) continue;
    let near=false;for(let v=-1;v<=1&&!near;v++)for(let u=-1;u<=1;u++) if(inM[(j+v)*N+i+u]){near=true;break}
    if(!near) continue;r+=F.R[q];g+=F.G[q];b+=F.B[q];n++}
  const o=[0,0,0,0],bg=[0,0,0];for(const [u,v] of [[.12,1.1],[.12,1.6],[2.5,1.75]]){pxl(I,x0+u*s,y0+v*s,o);bg[0]+=o[0]/3;bg[1]+=o[1]/3;bg[2]+=o[2]/3}
  if(!n) return {q:'1',unsure:true};
  const d=[r/n-bg[0],g/n-bg[1],b/n-bg[2]],mx=Math.max(...d),mn=Math.min(...d),mag=Math.hypot(...d);
  let h=0;const c=mx-mn;if(c>0){if(mx===d[0]) h=((d[1]-d[2])/c)%6;else if(mx===d[1]) h=(d[2]-d[0])/c+2;else h=(d[0]-d[1])/c+4;h=(h*60+360)%360}
  const res={d,mag:Math.round(mag),h:Math.round(h)};
  if(mag<42) return {...res,q:'1',unsure:mag>34};
  const q=h<95||h>=345?'3':h<170?'1.25':h<250?'1.5':'2';
  return {...res,q,unsure:mag<55||(h>85&&h<105)}}
// couleur du cadre d'une compétence : rose = innée, bleu-vert = rare, or = épique, cuivre = commune
function frameRarity(I,cx,cy,S){let r=0,g=0,b=0,n=0;const o=[0,0,0,0];
  for(const d of [.41,.44,.47])for(let t=-.4;t<=.4;t+=.04)for(const [u,v] of [[t,-d],[t,d],[-d,t],[d,t]]){pxl(I,cx+u*S,cy+v*S,o);r+=o[0];g+=o[1];b+=o[2];n++}
  r/=n;g/=n;b/=n;return b>r-5?'Rare':b-g>15?'Innate':g-b>24?'Epic':'Common'}
const SKIN=(u,v)=>u>.14&&u<.86&&v>.14&&v<.86&&!(u>.58&&v>.66);
function skCands(fams){return fams.filter(f=>UA.ui['icon_global_skill_'+f.tiers[0].fam]!=null).map(f=>({f,P:tpl('sk:'+f.tiers[0].fam,SH.ui,UA.ui['icon_global_skill_'+f.tiers[0].fam],UA.uiCols,48,16,SKIN)}))}
// lit les icônes 2 à 6 d'une rangée : chaque icône est recalée sur la précédente
function readSkills(I,x,y,S,step,fams,R,minV){const cands=skCands(fams),out=[];R.dbgSk=R.dbgSk||[];
  for(let k=1;k<=5;k++){x+=step;
    const b=bestOf(I,x,y,S,cands,{N:16,gray:true,offs:[-.1,-.05,0,.05,.1],scs:[.94,1,1.06]});
    const rar=b[0]?frameRarity(I,x+b[0].dx*S,y+b[0].dy*S,S*b[0].sc):'Common';
    const top=b.length?b[0].v:0,pick=b.find(c=>c.f.tiers[0].rarity===rar&&c.v>top-.08)||b[0];
    R.dbgSk.push(rar+' '+b.slice(0,3).map(c=>c.f.tiers[0].name+'('+c.f.tiers[0].rarity+'):'+c.v.toFixed(2)).join(' '));
    if(!pick||pick.v<minV||rar==='Innate') break;
    if(pick.v<minV+.1||pick.f.tiers[0].rarity!==rar) R.unsure.add('sk'+out.length);
    out.push(pick.f.tiers[0].name);x+=pick.dx*S;y+=pick.dy*S}
  return out}
function skillRow(I,cls,ex,ey,s,R){const S=1.52*s,step=1.81*s;
  const inner=(u,v)=>u>.14&&u<.86&&v>.14&&v<.86&&!(u>.58&&v>.66);
  const innate=FAMS.filter(f=>f.type==='Innate');
  const icand=innate.filter(f=>UA.ui['icon_global_skill_'+f.tiers[0].fam]!=null).map(f=>({f,P:tpl('sk:'+f.tiers[0].fam,SH.ui,UA.ui['icon_global_skill_'+f.tiers[0].fam],UA.uiCols,48,16,inner)}));
  const own=icand.filter(c=>c.f.tiers.some(t=>eligible(t,cls)));
  // cherche la première icône (compétence innée) autour de la position prévue
  let first=null;
  for(let dy=-.5;dy<=.5;dy+=.1)for(let dx=-2.5;dx<=2.5;dx+=.1){const F=samp(I,ex+dx*s,ey+dy*s,S,16,2);for(const c of (own.length?own:icand)){const v=score(c.P,F,true);if(!first||v>first.v) first={v,x:ex+dx*s,y:ey+dy*s}}}
  if(!first||first.v<.45){R.unsure.add('sk');return null}
  return readSkills(I,first.x,first.y,S,step,FAMS.filter(f=>f.type==='Hero'&&f.tiers.some(t=>eligible(t,cls))),R,.55)}
// carte de collection : « +5 % / +10 % / +25 % bonus » donne le niveau de la carte
function analyseCard(ws,R){if(!ws.some(w=>/^collection$/i.test(norm(w.t)))) return null;
  const b=ws.find(w=>/^\+?(5|10|25)\s?%$/.test(w.t));if(!b) return null;
  R.card={'5':1,'10':2,'25':3}[b.t.replace(/[^\d]/g,'')];
  for(const w of ws){const m=classByName(w.t);if(m&&m.r<.2){R.cls=m.c;break}}
  R.kind='card';return R}
// onglet Capacités : repère = le mot de l'onglet « Capacités » (taille du texte = échelle), puis recherche de la 1re icône
async function analyseSkills(I,W,R,ws){const isTab=w=>/^(capacit|abilit|skill)/.test(norm(w.t))&&w.h>4;
  const tab=ws.find(isTab);if(!tab) return null;
  const d0=16.4*tab.h,tx=(tab.x0+tab.x1)/2,ty=tab.yc;
  const inner=(u,v)=>u>.14&&u<.86&&v>.14&&v<.86&&!(u>.58&&v>.66);
  const icand=FAMS.filter(f=>f.type==='Innate'&&UA.ui['icon_global_skill_'+f.tiers[0].fam]!=null).map(f=>({f,P:tpl('sk:'+f.tiers[0].fam,SH.ui,UA.ui['icon_global_skill_'+f.tiers[0].fam],UA.uiCols,48,16,inner)}));
  let first=null;
  for(const k of [.85,.92,1,1.08,1.16]){const d=d0*k;for(let dy=-.06;dy<=.061;dy+=.02)for(let dx=-.1;dx<=.101;dx+=.02){const x=tx-1.334*d+dx*d,y=ty+.232*d+dy*d,F=samp(I,x,y,.246*d,16,2);
    for(const c of icand){const v=score(c.P,F,true);if(!first||v>first.v) first={v,x,y,d,c}}}}
  if(!first||first.v<.5) return null;
  const d=first.d,cls=R.cls||makeCtx().cls;
  const out=readSkills(I,first.x,first.y,.246*d,.331*d,FAMS.filter(f=>f.type==='Hero'&&(f.tiers.some(t=>eligible(t,cls))||!first.c.f.tiers.some(t=>eligible(t,cls)))),R,.55);
  R.innate=first.c.f;R.skills=out;R.kind='skills';return out.length?R:null}
// fusionne plusieurs captures et remplit le mode manuel
function shotApply(list){
  const info=list.find(r=>r.kind==='info'),sk=list.find(r=>r.kind==='skills'),cd=list.find(r=>r.kind==='card');
  const R=info||{unsure:new Set(),gear:[]};if(sk&&sk.skills&&sk.skills.length){if(!R.skills||sk.skills.length>=R.skills.length){R.skills=sk.skills;[...R.unsure].filter(k=>/^sk/.test(k)).forEach(k=>R.unsure.delete(k));sk.unsure.forEach(k=>R.unsure.add(k))}}
  if(cd){$('cardLv').value=cd.card;if(!R.cls&&cd.cls) R.cls=cd.cls}
  if(R.cls){const c=R.cls;curBase=c.promoted?D.classes.find(x=>x.evo===c)||c:c;evolved=!!c.promoted}
  if(R.lvl) $('lvl').value=R.para&&R.lvl<=50?100:R.lvl;
  const gv={gPow:R.power,gHp:R.hp,gAtk:R.atk,gDef:R.def,gEva:R.eva,gEl:R.el};for(const k in gv) if(gv[k]!=null) $(k).value=gv[k];
  if(R.name&&!$('pName').value) $('pName').value=R.name;
  setClass();
  const ctx=makeCtx(),cls=ctx.cls;
  if(!man||manClass!==cls.name) manualReset();
  man=JSON.parse(JSON.stringify(man||{g:[],s:[]}));
  if(R.gear.length) man.g=cls.slots.map((_,i)=>{const g=R.gear[i],old=man.g[i]||['','','',String(ctx.q)];if(!g||!g.it) return old;
    return [g.it.name,g.it.builtElem?'':(g.e?g.e.name:''),g.it.builtSpirit?'':(g.s?g.s.name:''),g.q?g.q.q:String(ctx.q)]});
  if(R.skills) man.s=R.skills.slice(0,ctx.nSlots);
  man.edited=true;manClass=cls.name;$('manual').open=true;renderManual();
  // champs à vérifier en orange
  document.querySelectorAll('.unsure').forEach(e=>e.classList.remove('unsure'));
  const mark=el=>{if(el){el.classList.add('unsure');el.title=SHT.unsure}};
  for(const k of R.unsure){let m;
    if(m=/^(it|q|e|s)(\d)$/.exec(k)) mark(document.querySelector(`#mGear select[data-k="${m[1]}"][data-i="${m[2]}"]`));
    else if(m=/^sk(\d)$/.exec(k)) mark(document.querySelector(`#mSkills select[data-i="${m[1]}"]`));
    else if(k==='sk') document.querySelectorAll('#mSkills select').forEach(mark);
    else if(k==='cls') mark($('clsName'));
    else mark($({power:'gPow',hp:'gHp',atk:'gAtk',def:'gDef',el:'gEl',lvl:'lvl'}[k]));}
  return R}
async function shotRun(files){
  files=[...files].filter(f=>/^image\//.test(f.type));if(!files.length){pmsg(SHT.noImg);return}
  const btn=$('pShot');btn.classList.add('busy');
  try{pmsg(SHT.load);await shAtlases();const W=await ocrGet();const out=[];
    for(let i=0;i<files.length;i++){const say=x=>pmsg(`${SHT.read} ${i+1} ${SHT.of} ${files.length}… ${x||''}`);say();
      const r=await analyse(files[i],W,say);if(r) out.push(r)}
    if(!out.length){pmsg(SHT.noAnchor);return}
    window.STC_shotRaw=out;const R=shotApply(out);window.STC_shot=R;
    pmsg((out.some(r=>r.kind==='card')?SHT.card+' ':'')+(out.every(r=>r.kind==='skills')?SHT.skillsOnly+' ':'')+SHT.done)}
  catch(e){console.error(e);pmsg(SHT.fail+' '+(e&&e.message||e))}
  finally{btn.classList.remove('busy')}}
$('pShotIn').addEventListener('change',e=>{shotRun(e.target.files);e.target.value=''});
{const z=document.querySelector('.preset');
  z.addEventListener('dragover',e=>{e.preventDefault();z.classList.add('drop')});
  z.addEventListener('dragleave',()=>z.classList.remove('drop'));
  z.addEventListener('drop',e=>{e.preventDefault();z.classList.remove('drop');shotRun(e.dataTransfer.files)});
  document.addEventListener('paste',e=>{if(!$('manual').open) return;const f=[...(e.clipboardData&&e.clipboardData.files||[])];if(f.length){e.preventDefault();shotRun(f)}});}
window.STC_shotRun=shotRun;
