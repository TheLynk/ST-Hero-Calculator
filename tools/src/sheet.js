// ===== Téléchargement et lecture du Google Sheet officiel (sans serveur) =====
const SHEET_ID='1WLa7X8h3O0-aGKxeAlCL7bnN8-FhGd3t7pz2RCzSg8c';
const SHEETS=[['Home',0],['Heroes',0],['Hero Levels',0],['Skills',0],['Enchantments',0],['Blueprints',1]];
let gvizN=0;
function gviz(sheet,headers){ // JSONP : Google autorise ce format depuis une page locale
  return new Promise((ok,ko)=>{
    const cb='__gv'+(++gvizN)+'_'+Date.now(), s=document.createElement('script');
    const t=setTimeout(()=>{cleanup();ko(new Error('délai dépassé : '+sheet))},60000);
    function cleanup(){clearTimeout(t);delete window[cb];s.remove()}
    window[cb]=r=>{cleanup();
      if(!r||r.status!=='ok'){ko(new Error('réponse invalide : '+sheet));return}
      const rows=r.table.rows.map(x=>(x.c||[]).map(c=>c==null?null:(c.v!=null?c.v:(c.f!=null?c.f:null))));
      ok({rows,labels:r.table.cols.map(c=>c.label)})};
    s.onerror=()=>{cleanup();ko(new Error('réseau : '+sheet))};
    s.src=`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json;responseHandler:${cb}&headers=${headers}&sheet=${encodeURIComponent(sheet)}&_=${Date.now()}`;
    document.head.appendChild(s);
  });
}
function sheetVersionOf(rows){
  const v=[];for(const r of rows) for(const c of r) if(typeof c==='string'&&/^(client|spreadsheet): v[\d.]+$/.test(c.trim())) v.push(c.trim());
  return v.join(' · ');
}
async function downloadSheet(progress){
  const T={};let i=0;
  for(const [n,h] of SHEETS){progress&&progress(++i,SHEETS.length,n);T[n]=await gviz(n,h)}
  return T;
}
// ----- extraction (même logique que tools/extract.py) -----
function clean(v){if(v==null) return null;if(typeof v==='string'){v=v.trim();if(v==='---'||v===''||v==='#REF!') return null}return v}
function num(v){v=clean(v);if(v==null) return 0;if(typeof v==='number') return v;const s=String(v).replace(/,(?=\d{3}\b)/g,'');const m=s.match(/-?\d+(?:\.\d+)?/);if(!m) return 0;return /^\s*-?[\d.]+\s*%/.test(s)?parseFloat(m[0])/100:parseFloat(m[0])}
function titleCase(s){return s.toLowerCase().replace(/(^|[\s(\-'])([a-z])/g,(m,a,b)=>a+b.toUpperCase())}
function extractSheet(T,GM){
  const H=T['Heroes'].rows, fams={1:'Fighter',9:'Rogue',17:'Spellcaster'}, classes=[];
  const at=(r,k)=>r&&k<r.length?r[k]:null;
  for(let i=0;i<H.length;i++){const r=H[i];
    for(const g of [1,9,17]){
      if(at(r,g+2)!=='Prerequisite') continue;
      const raw=String(at(r,g)).replace(/\n/g,' ').trim(), m=raw.match(/^(.+?)\s*\((.+?) Class Promotion\)/);
      const c={name:titleCase((m?m[1]:raw).trim()),family:fams[g],promoted:!!m,baseClass:m?titleCase(m[2].trim()):null,prereq:clean(at(r,g+3)),
        hp:num(at(r,g+5)),atk:num(at(H[i+1],g+5)),def_:num(at(H[i+2],g+5)),eva:num(at(H[i+3],g+5)),
        crit:num(at(H[i+1],g+3)),critDmg:num(at(H[i+2],g+3)),threat:num(at(H[i+3],g+3)),
        element:clean(at(H[i+2],g+6)),slots:[[],[],[],[],[],[]],skillUnlock:[]};
      let j=i+5;
      while(j<H.length){const rr=H[j];
        if(at(rr,g+2)==='Prerequisite') break;
        if(at(rr,g)!=null&&String(at(rr,g)).startsWith('Equipment')) break;
        const vals=[0,1,2,3,4,5,6].map(k=>clean(at(rr,g+k)));
        if(vals.every(v=>v==null)){ if(j+1<H.length&&at(H[j+1],g+2)==='Prerequisite') break; j++; if(j-i>14) break; continue }
        for(let k=0;k<6;k++) if(vals[k]) c.slots[k].push(String(vals[k]));
        if(vals[6]) c.skillUnlock.push(Math.round(num(vals[6])));
        j++; if(j-i>14) break;
      }
      classes.push(c);
    }
  }
  const levels=T['Hero Levels'].rows.slice(1).filter(r=>clean(r[0])!=null&&num(r[0])>0).map(r=>({level:Math.round(num(r[0])),paragon:clean(r[1])==='Yes',maxTier:Math.round(num(r[3]))}));
  const skills=[];
  for(const r of T['Skills'].rows.slice(1)){
    if(!clean(r[0])||[null,'Type'].includes(clean(r[1]))) continue;
    skills.push({name:String(r[0]).trim(),type:clean(r[1]),tier:clean(r[2])!=null?Math.round(num(r[2])):null,rarity:clean(r[3]),req:num(r[4]),effect:clean(r[5])||'',classes:clean(r[6])||'',promo:clean(r[7])==='Yes'});
  }
  const elemVal={},EL=['Fire','Water','Air','Earth','Light','Dark','Gold'];
  for(const r of T['Enchantments'].rows.slice(1)) if(clean(r[1])==='Element'){
    const vals=[2,3,4,5,6,7,8].map(k=>num(r[k]));let k=0;for(let q=1;q<7;q++) if(vals[q]>vals[k]) k=q;
    elemVal[String(r[0]).trim()]=[EL[k],vals[k]];
  }
  const B=T['Blueprints'], L=B.labels, ix=n=>L.indexOf(n), cA=ix('ATK'), ti=ix('Transcendence Upgrade 1'), si=ix('Starforged Milestone 1');
  const src=u=>{u=u||'';if(/Pack|Offer|Pass|Pact|Festival|Neighborhood|Book|Event/.test(u)) return 'premium';if(u.includes('Chest')) return 'chest';return 'craft'};
  const items=[],enchants=[];
  for(const r of B.rows){
    if(!clean(r[0])) continue;
    const d={name:String(r[0]).trim(),type:clean(r[1]),unlock:clean(r[2]),tier:Math.round(num(r[5])),
      atk:num(r[cA]),def_:num(r[cA+1]),hp:num(r[cA+2]),eva:num(r[cA+3]),crit:num(r[cA+4]),
      elemAff:clean(r[cA+7]),spiritAff:clean(r[cA+8]),builtElem:clean(r[cA+9]),builtSpirit:clean(r[cA+10])};
    if(d.type==='Enchantment'){
      const e={name:d.name,tier:d.tier,unlock:d.unlock,atk:d.atk,def_:d.def_,hp:d.hp,source:src(d.unlock)};
      if(elemVal[d.name]) Object.assign(e,{kind:'element',element:elemVal[d.name][0],value:elemVal[d.name][1]}); else e.kind='spirit';
      enchants.push(e); continue;
    }
    const tr=[];
    for(let k=0;k<3;k++){const s=String(clean(r[ti+2*k])||'');let m;
      if(m=s.match(/^(ATK|DEF|HP|CRIT|EVA|Mana Shield) \+(\d+(?:\.\d+)?)(%?)/)) tr.push({stat:m[1],v:parseFloat(m[2])});
      else if(m=s.match(/^\+(\d+)% Base ATK, DEF and HP/)) tr.push({stat:'BASE',v:parseFloat(m[1])}); else tr.push(null)}
    let star=0;for(let k=0;k<5;k++){const m=String(clean(r[si+2*k])||'').match(/^\+(\d+)% Base ATK, DEF and HP/);if(m) star=parseFloat(m[1])}
    Object.assign(d,{source:src(d.unlock),tr,star});
    items.push(d);
  }
  // esprits : compétence liée et menace
  const ensk=skills.filter(s=>s.type==='Enchantment');
  const thr=t=>{const m=String(t||'').match(/\+(\d+) Threat/);return m?+m[1]:0};
  for(const e of enchants) if(e.kind==='spirit'){
    let w=e.name.split(' ')[0]; if(e.name==='Tomb-Bound Spirit') w='Tomb-Born'; if(e.name==="Mundra's Spirit") w="Mundra's";
    const b=ensk.find(s=>s.name.split(' ')[0]===w&&!s.name.endsWith('+')), p=ensk.find(s=>s.name.split(' ')[0]===w&&s.name.endsWith('+'));
    e.skill=b?b.name:null; e.effect=b?b.effect:''; e.effectPlus=p?p.effect:e.effect; e.threat=thr(e.effect); e.threatPlus=thr(e.effectPlus);
  }
  const arts={};for(const s of skills) if(s.type==='Artifact') arts[s.name]=s.effect;
  const D={classes,levels,skills:skills.filter(s=>s.type==='Hero'||s.type==='Innate'),items,enchants,sheetVersion:sheetVersionOf(T['Home'].rows)};
  for(const i of items) if(GM.art[i.name]){i.art=GM.art[i.name];i.artEffect=arts[i.art]||''}
  for(const c of classes){const u=GM.alias[c.name]||c.name.toLowerCase().replace(/ /g,''), g=GM.classes[u]; if(g) c.grow=g.grow; else c.missingGame=true}
  return D;
}
// signature des données de calcul (sans noms, images ni traductions)
function dataVersion(D){
  const s=JSON.stringify(D,(k,v)=>['fr','img','icon','uid','fam','typeFr','sheetVersion','relic'].includes(k)?undefined:v);
  let h1=0x811c9dc5,h2=0x1b873593;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);h1=Math.imul(h1^c,16777619);h2=Math.imul(h2^c,2246822519)}
  return ((h1>>>0).toString(16).padStart(8,'0')+(h2>>>0).toString(16).padStart(8,'0')).slice(0,12);
}
function enrich(D,GM){ // noms FR, images (données du jeu)
  for(const i of D.items.concat(D.enchants)){const g=GM.items[i.name];if(g){i.uid=g.uid;i.fr=g.fr;if(g.img!=null) i.img=g.img;if(g.relic) i.relic=1}}
  for(const c of D.classes){const u=GM.alias[c.name]||c.name.toLowerCase().replace(/ /g,''),g=GM.classes[u];if(g){c.uid=u;c.fr=g.fr||c.name;if(g.icon!=null) c.icon=g.icon}}
  for(const s of D.skills){const g=GM.skills[s.name];if(g){s.fam=g.fam;s.fr=g.fr}}
  D.typeFr=GM.typeFr; return D;
}
