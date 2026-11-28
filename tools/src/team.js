// ===== Onglet « Équipe et quêtes » : simulation de combat (moteur : sim.js) =====
(()=>{
const S=window.STSIM; if(!S||!S.SD) return;
const SD=S.SD, EN=LANG_UI==='en', L=a=>Array.isArray(a)?(EN?a[1]||a[0]:a[0]||a[1]):(a||'');
const TT={fr:{tabHero:'Héros',tabTeam:'Équipe et quêtes',quest:'Quête',area:'Zone',diff:'Difficulté',boss:'Boss',normal:'Normal',flash:'Quêtes éclair',areas:'Zones',special:'Autres',
  mini:'Mini-boss',none:'Aucun',barrier:'Barrière élémentaire',champ:'Champion',noChamp:'Aucun champion',rank:'Rang',titan:'Âme de titan',lvl:'Niveau',skill:'Compétence de chef',
  aura:'Chant d’aura',booster:'Bonus de quête',heroes:'Héros (presets)',emptyP:'— vide —',pick:'— choisir un preset —',sims:'Simulations',run:'Simuler',
  bestTeam:'Meilleure équipe',bestChamp:'Meilleur champion',res:'Résultat',win:'Victoire',rounds:'Tours (moy.)',mhp:'PV du monstre',death:'Risque de mort',grade:'Note',
  dmg:'Dégâts / combat',noPreset:'Aucun preset enregistré. Créez vos héros dans l’onglet Héros (mode manuel → Mes héros).',needHero:'Choisissez au moins un héros.',
  busy:'Calcul…',party:'Équipe de',slots:'emplacements',chStats:'Corriger les stats (facultatif)',chHelp:'Si le calcul diffère de l’onglet Infos du jeu, entrez les vraies valeurs. Vide = calcul.',reinf:'Renforts (+)',fam:'Familier',qual:'Qualité',spirit:'Esprit',calc:'Calcul :',ovOn:'Stats corrigées à la main : elles remplacent le calcul.',savedC:'Chaque champion utilise son rang, son familier et son chant d’aura enregistrés (ou les valeurs par défaut).',el:'Élément',eva:'Esq.',crit:'Crit',thr:'Menace',
  topTeams:'Meilleures équipes parmi vos presets',topChamps:'Champions classés pour cette équipe',combos:'combinaisons testées',
  note:'Moteur repris du code du jeu (Quest.DoCombat), lu sans lancer le jeu. Note par héros, avec le visage du jeu : SSS = jamais mort, S < 15 %, A < 40 %, B < 60 %, C < 100 %, D = toujours mort. À vérifier avec la note affichée dans le jeu (A_VERIFIER.md, test 14).',
  prog:'PV du monstre retirés',shatter:'Barrière brisée',notShatter:'Barrière NON brisée : −80 % de dégâts',power:'Puissance d’élément'},
 en:{tabHero:'Hero',tabTeam:'Team & quests',quest:'Quest',area:'Area',diff:'Difficulty',boss:'Boss',normal:'Normal',flash:'Flash quests',areas:'Areas',special:'Other',
  mini:'Mini-boss',none:'None',barrier:'Elemental barrier',champ:'Champion',noChamp:'No champion',rank:'Rank',titan:'Titan soul',lvl:'Level',skill:'Leader skill',
  aura:'Aurasong',booster:'Quest booster',heroes:'Heroes (presets)',emptyP:'— empty —',pick:'— choose a preset —',sims:'Simulations',run:'Simulate',
  bestTeam:'Best team',bestChamp:'Best champion',res:'Result',win:'Win',rounds:'Rounds (avg.)',mhp:'Monster HP',death:'Death risk',grade:'Rating',
  dmg:'Damage / fight',noPreset:'No saved preset. Create your heroes in the Hero tab (manual mode → My heroes).',needHero:'Choose at least one hero.',
  busy:'Computing…',party:'Party of',slots:'slots',chStats:'Correct the stats (optional)',chHelp:'If the result differs from the game Info tab, enter the real values. Empty = computed.',reinf:'Reinforcements (+)',fam:'Familiar',qual:'Quality',spirit:'Spirit',calc:'Computed:',ovOn:'Stats corrected by hand: they replace the computed values.',savedC:'Each champion uses its saved rank, familiar and aurasong (or the defaults).',el:'Element',eva:'Eva.',crit:'Crit',thr:'Threat',
  topTeams:'Best teams among your presets',topChamps:'Champions ranked for this team',combos:'combinations tested',
  note:'Engine taken from the game code (Quest.DoCombat), read without running the game. Hero rating, with the game face: SSS = never dies, S < 15%, A < 40%, B < 60%, C < 100%, D = always dies. To check against the rating shown in game (A_VERIFIER.md, test 14).',
  prog:'Monster HP removed',shatter:'Barrier shattered',notShatter:'Barrier NOT shattered: −80% damage',power:'Element power'}}[EN?'en':'fr'];
const ELN={fire:['Feu','Fire'],water:['Eau','Water'],air:['Air','Air'],earth:['Terre','Earth'],light:['Lumière','Light'],dark:['Ténèbres','Dark']};
const GRADE=['D','C','B','A','S','SSS'];
const FACES=/*FACES*/null; // visages de note du jeu (icon_shop_face_D…SSS)
const face=(g,sz=28)=>`<span class="face">${FACES&&FACES[g]?`<img src="${FACES[g]}" width="${sz}" height="${sz}" alt="">`:''}<b class="grade g${g}">${GRADE[g]}</b></span>`;
const gOf=d=>d<=0?5:d<0.15?4:d<0.4?3:d<0.6?2:d<1?1:0;
const FAMG={fighter:'soldier,mercenary,barbarian,chieftain,knight,lord,ranger,warden,swordmaster,daimyo,berserker,jarl,darkknight,deathknight',rogue:'thief,trickster,monk,mastermonk,musketeer,conquistador,wanderer,pathfinder,ninja,sensei,dancer,acrobat,velite,praetorian'};
const famOf=g=>FAMG.fighter.split(',').includes(g)?'Fighter':FAMG.rogue.split(',').includes(g)?'Rogue':'Spellcaster';
const fmt=n=>Math.round(n).toLocaleString(EN?'en-US':'fr-FR'), pc=x=>(x*100).toFixed(x<0.1&&x>0?1:0).replace('.',EN?'.':',')+' %';
// ----- onglets -----
const main=document.querySelector('main');
const nav=document.createElement('nav');nav.className='tabs';nav.setAttribute('role','tablist');
nav.innerHTML=`<button type="button" role="tab" data-t="hero" class="on" aria-selected="true">${ui('power',20)} ${TT.tabHero}</button><button type="button" role="tab" data-t="team" aria-selected="false">${ui('defense',20)} ${TT.tabTeam}</button>`;
main.parentNode.insertBefore(nav,main);
const tm=document.createElement('main');tm.id='team';tm.hidden=true;main.parentNode.insertBefore(tm,main.nextSibling);
const st=document.createElement('style');st.textContent=`.tabs{display:flex;gap:6px;padding:0 16px;max-width:1400px;margin:8px auto 0}.tabs button{min-height:44px;padding:0 16px;border-radius:10px 10px 0 0;border:1px solid var(--line);border-bottom:0;background:var(--panel2);color:var(--mut);font:600 15px system-ui,sans-serif;cursor:pointer;display:inline-flex;gap:8px;align-items:center}.tabs button.on{background:var(--panel);color:var(--txt);border-color:var(--acc)}
#team .tgear{border:1px solid var(--line);border-radius:10px;padding:6px 10px 10px;margin:10px 0 0}#team .tgear legend{font-size:13px;color:var(--mut);padding:0 4px}#team .tgear select{margin-top:6px}#team .tgear .g2{display:grid;grid-template-columns:3fr 2fr;gap:6px}#team .tgear .g2b{display:grid;grid-template-columns:1fr 1fr;gap:6px}#team .tslot{display:grid;grid-template-columns:28px minmax(0,1fr);gap:8px;align-items:center;margin:6px 0}#team .tslot b{font-size:14px;color:var(--mut)}#team select,#team input[type=number]{width:100%}
#team .kpi{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin:8px 0 14px}#team .kpi div{background:var(--panel2);border:1px solid var(--line);border-radius:10px;padding:10px}#team .kpi span{display:block;font-size:12px;color:var(--mut)}#team .kpi b{font-size:22px}
#team .g5{color:#5cc28a}#team .g4{color:#9bd35c}#team .g3{color:#e6c34a}#team .g2{color:#f59e0b}#team .g1,#team .g0{color:var(--acc2)}#team .grade{font-weight:800}
#team .face{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}#team .face img{display:block}#team .bar{height:6px;border-radius:3px;background:var(--line);overflow:hidden}#team .bar i{display:block;height:100%;background:var(--acc)}
#team .row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}#team .row4{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}@media(max-width:600px){#team .row4{grid-template-columns:1fr 1fr}}`;
document.head.appendChild(st);
nav.addEventListener('click',e=>{const b=e.target.closest('button[data-t]');if(!b) return;const t=b.dataset.t;
  nav.querySelectorAll('button').forEach(x=>{const on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-selected',on)});
  main.hidden=t!=='hero';tm.hidden=t!=='team';if(t==='team') initTeam()});
// ----- héros d'un preset → combattant -----
function fighterFromPreset(p){
  const c=D.classes.find(x=>x.name===p.cls); if(!c||!p.man) return null;
  const keep={};SET_IDS.forEach(k=>keep[k]=$(k).value);const keepC={};SET_CHK.forEach(k=>keepC[k]=$(k).checked);const keepCls=$('cls').value;
  let R,ctx,picks;
  try{
    SET_IDS.forEach(k=>{if(p.set&&p.set[k]!=null) $(k).value=p.set[k]});SET_CHK.forEach(k=>{if(p.chk&&p.chk[k]!=null) $(k).checked=p.chk[k]});$('cls').value=D.classes.indexOf(c);
    ctx=makeCtx();
    picks=p.man.g.map(([i,e,s,q])=>{const it=ITEM[i];return makePick({...ctx,q:+q||ctx.q},i,it&&it.builtElem?null:(e||null),it&&it.builtSpirit?null:(s||null))});
    const fams=[...new Set(p.man.s.map(n=>FAMS.find(f=>f.tiers[0].name===n)).filter(Boolean))];
    R=evaluate(ctx,picks,fams);
  }catch(err){R=null}
  finally{SET_IDS.forEach(k=>$(k).value=keep[k]);SET_CHK.forEach(k=>$(k).checked=keepC[k]);$('cls').value=keepCls;makeCtx()}
  if(!R) return null;
  // compétences du jeu (sim.json) : innée selon la valeur d'élément, compétences choisies, esprits
  const uids=[];
  if(R.inn&&SD.innate[R.inn.fam]){const t=SD.innate[R.inn.fam].filter(x=>x[1]<=R.el).pop();if(t) uids.push(t[2])}
  for(const s of R.skills||[]) if(s.fam) uids.push(s.fam+s.tier);
  picks.forEach((pk,k)=>{if(R.off&&R.off[k]) return;const sp=pk.s&&pk.s.name&&ENCH[pk.s.name];if(sp&&sp.uid){const u='i_'+sp.uid+(pk.s.plus?'_plus':'');uids.push(u);if(pk.it.type==='Idol') uids.push(u)}});
  const sk=uids.map(u=>SD.skills[u]).filter(Boolean);
  const sum=k=>sk.reduce((a,s)=>a+(s[k]||0),0);
  const inn=sk.find(s=>s.dmgBuf), nin=sk.find(s=>s.critBuf&&!s.dmgBuf);
  const n=c.name, el=String(c.element||'').toLowerCase();
  return {name:p.name||nm(c),cname:nm(c),cls:n,family:c.family,gcls:(GM&&GM.alias&&GM.alias[n])||n.toLowerCase().replace(/\s/g,''),ic:c,
    atk:R.atk,def:R.def,hp:R.hp,crit:R.crit/100,cm:R.cm,eva:R.eva/100,aggro:R.threat,el:R.el,elem:el==='any'?'Any':el,
    aBr:R.aBr||1,dBr:R.dBr||1,card:ctx.card||1,
    bossA:(R.T.bossA||0)/100,bossD:1+((R.T.bossD||0)/100)/(R.dBr||1),shark:(R.T.shark||0)/100,dino:(R.T.dino||0)/100,
    maxEva:cn0('quest_evasion_max',0.75)+(n==='Pathfinder'?cn0('adventurer_pathfinder_innate_evasion_bonus',0.03):0),
    survive:Math.min(1,sum('survive')),regen:sum('regen'),champB:sum('championStatBonusMultiplier'),
    bers:inn?{atkBuf:inn.atkBuf||0,evaBuf:inn.evaBuf||0,th:String(inn.dmgBuf).split(',').map(Number)}:null,
    ninja:nin&&(n==='Ninja'||n==='Sensei')?{critBuf:nin.critBuf||0,evaBuf:nin.evaBuf||0}:null,
    dk:n==='Dark Knight'||n==='Death Knight'};
}
const cn0=(k,d)=>SD.cons[k]!=null?+SD.cons[k]:d;
// ----- champion -----
// stats du champion (Hero.GetUpgradeForStory, lu dans le code du jeu) :
// base du niveau + Σ améliorations de rang × stat d'histoire (× 1,5 avec l'âme de titan) ; au-delà du rang 11, chaque renforcement répète la dernière amélioration
// + familier et chant d'aura (objets enchantables, mêmes règles que les héros) ; élément = valeur du rang + éléments des objets
function champStats(u,lvl,rank,reinf,titan,gear){
  const c=SD.champs[u];if(!c) return null;
  const cur=a=>{const[v1,v40,v50,v100]=a;if(lvl<=40) return v1+(v40-v1)*Math.pow((lvl-1)/39,1.55);if(lvl<=50) return v40+(v50-v40)*(lvl-40)/10;return v50+(v100-v50)*(lvl-50)/50};
  const story=rank+(rank>=11?reinf:0);let pct=0,sk=1;
  for(let i=0;i<story-1;i++){const x=c.upg[Math.min(i,c.upg.length-1)];if(!x) continue;const m=/stat\+([\d.]+)/.exec(x);if(m) pct+=+m[1];if(/skl\+1/.test(x)&&i<c.upg.length) sk++}
  if(titan&&c.titan){const m=/stat\+([\d.]+)/.exec(c.titan);if(m) pct+=+m[1]}
  if(lvl>=100&&c.prg){const m=/stat\+([\d.]+)/.exec(c.prg);if(m) pct+=+m[1];if(/skl\+1/.test(c.prg)) sk++}
  sk=Math.min(titan?5:cn0('max_skill_level_non_titan',3),sk);
  const tm=titan?cn0('champion_titan_soul_story_stat_mult',1.5):1, st=c.st||[0,0,0,0,0];
  const base={hp:Math.round(cur(c.hp)+pct*st[0]*tm),atk:Math.round(cur(c.atk)+pct*st[1]*tm),def:Math.round(cur(c.def)+pct*st[2]*tm)};
  const elB=String(SD.cons.hero_element_rank_and_value||'').split(';').map(x=>x.split(',').map(Number)).filter(x=>x[0]<=story).pop();
  const Cap=x=>x?x[0].toUpperCase()+x.slice(1):x;
  const cls={name:'Champion',family:famOf(c.cls),element:Cap(c.el),crit:c.cr,critDmg:c.cm,eva:c.eva,threat:c.aggro,slots:[],skillUnlock:[]};
  const ctx={cls,lvl,maxT:16,base,card:1,trans:0,star:false,q:3,eT:16,goldWild:false,obj:'power',nSlots:0,innate:null,fams:[]};
  let R=null;
  try{const picks=(gear||[]).filter(g=>g&&g.i&&ITEM[g.i]).map(g=>{const it=ITEM[g.i];return makePick({...ctx,q:+g.q||3},g.i,it.builtElem?null:(g.e||null),it.builtSpirit?null:(g.s||null))});
    R=evaluate(ctx,picks,[])}catch(e){R=null}
  return {atk:Math.round(R?R.atk:base.atk),def:Math.round(R?R.def:base.def),hp:Math.round(R?R.hp:base.hp),eva:R?R.eva/100:c.eva,crit:R?R.crit/100:c.cr,cm:R?R.cm:c.cm,
    el:(elB?elB[1]:0)+(R?R.el:0),sk,story,base};
}
// ----- interface -----
let inited=false;
const QS=SD.quests, byFam={};QS.forEach(q=>(byFam[q.f]=byFam[q.f]||[]).push(q));
const famList=Object.keys(byFam);
const areaName=f=>L(SD.names[f]&&SD.names[f].area)||f;
function initTeam(){
  if(inited){refreshPresets();return} inited=true;
  const reg=famList.filter(f=>!byFam[f][0].fl&&f!=='goldcity'), fl=famList.filter(f=>byFam[f][0].fl), oth=famList.filter(f=>f==='goldcity');
  const og=(lab,arr)=>`<optgroup label="${esc(lab)}">${arr.map(f=>`<option value="${f}">${esc(areaName(f))}</option>`).join('')}</optgroup>`;
  const champOpts=`<option value="">${TT.noChamp}</option>`+Object.entries(SD.champs).map(([u,c])=>`<option value="${u}">${esc(L(c.n))}</option>`).join('');
  const boostOpts=`<option value="">${TT.none}</option>`+['si_atk1','si_atk2','si_atk3'].filter(u=>SD.mods[u]).map(u=>`<option value="${u}">${esc(L(SD.mods[u].n)||u)}</option>`).join('');
  const miniOpts=`<option value="">${TT.none}</option>`+['agile','huge','dire','wealthy','epic'].filter(u=>SD.mods[u]).map(u=>`<option value="${u}">${esc((L(SD.mods[u].n)||u).replace('{0}','').trim())}</option>`).join('');
  const QOPT=[[1,EN?'Normal':'Normale'],[1.25,EN?'Superior':'Supérieure'],[1.5,EN?'Flawless':'Impeccable'],[2,EN?'Epic':'Épique'],[3,EN?'Legendary':'Légendaire']];
  const enN=e=>EN?e.name:(e.fr||e.name);
  const eOpts=k=>`<option value="">—</option>`+D.enchants.filter(e=>e.kind===k).sort((a,b)=>b.tier-a.tier||enN(a).localeCompare(enN(b))).map(e=>`<option value="${esc(e.name)}">T${e.tier} ${esc(enN(e))}</option>`).join('');
  const gearRow=(id,lab,type)=>`<fieldset class="tgear"><legend>${lab}</legend><div class="g2"><select id="t${id}I" aria-label="${lab}"><option value="">${TT.none}</option>${D.items.filter(i=>i.type===type).sort((a,b)=>b.tier-a.tier).map(i=>`<option value="${esc(i.name)}">T${i.tier} ${esc(nm(i))}</option>`).join('')}</select><select id="t${id}Q" aria-label="${TT.qual}">${QOPT.map(([v,n])=>`<option value="${v}"${v===3?' selected':''}>${n}</option>`).join('')}</select></div>
    <div class="g2b"><select id="t${id}E" aria-label="${TT.el}"><option value="">${TT.el} —</option>${eOpts('element').replace('<option value="">—</option>','')}</select><select id="t${id}S" aria-label="${TT.spirit}"><option value="">${TT.spirit} —</option>${eOpts('spirit').replace('<option value="">—</option>','')}</select></div></fieldset>`;
  tm.innerHTML=`<aside class="card">
  <h2>${TT.quest}</h2>
  <label for="tArea">${TT.area}</label><select id="tArea">${og(TT.areas,reg)}${og(TT.flash,fl)}${og(TT.special,oth)}</select>
  <label for="tDiff">${TT.diff}</label><select id="tDiff"></select>
  <div class="seg" id="tKind"><button type="button" data-v="0" class="on">${TT.normal}</button><button type="button" data-v="1">${TT.boss}</button></div>
  <div class="row2"><div><label for="tMini">${TT.mini}</label><select id="tMini">${miniOpts}</select></div><div><label for="tBar">${TT.barrier}</label><select id="tBar"></select></div></div>
  <p class="note" id="tQinfo"></p>
  <h2 style="margin-top:18px">${TT.champ}</h2>
  <select id="tChamp">${champOpts}</select>
  <div class="row4"><div><label for="tCRank">${TT.rank}</label><select id="tCRank">${Array.from({length:11},(_,i)=>`<option value="${i+1}"${i===10?' selected':''}>${i+1}</option>`).join('')}</select></div>
  <div><label for="tCRe">${TT.reinf}</label><input id="tCRe" type="number" min="0" max="999" value="0"></div>
  <div><label for="tCLvl">${TT.lvl}</label><input id="tCLvl" type="number" min="1" max="100" value="50"></div><div><label class="chk" style="margin-top:28px"><input type="checkbox" id="tCTitan" checked> ${TT.titan}</label></div></div>
  ${gearRow('Fam',TT.fam,'Familiar')}${gearRow('Aur',TT.aura,'Aurasong')}
  <p class="note" id="tCInfo"></p>
  <details><summary>${TT.chStats}</summary><p class="note">${TT.chHelp}</p><div class="row4" style="grid-template-columns:repeat(auto-fit,minmax(78px,1fr))"><div><label for="tCHp">${EN?'HP':'PV'}</label><input id="tCHp" type="number" min="0"></div><div><label for="tCAtk">ATK</label><input id="tCAtk" type="number" min="0"></div><div><label for="tCDef">DEF</label><input id="tCDef" type="number" min="0"></div><div><label for="tCEva">${TT.eva} %</label><input id="tCEva" type="number" min="0" max="100"></div><div><label for="tCEl">${TT.el}</label><input id="tCEl" type="number" min="0"></div></div></details>
  <label for="tBoost" style="margin-top:8px">${TT.booster}</label><select id="tBoost">${boostOpts}</select>
  <h2 style="margin-top:18px">${TT.heroes}</h2><p class="note" id="tParty"></p><div id="tSlots"></div>
  <div class="row2"><div><label for="tN">${TT.sims}</label><select id="tN"><option>200</option><option selected>1000</option><option>5000</option></select></div><div style="display:flex;align-items:flex-end"><button type="button" class="fbtn acc" id="tRun" style="width:100%">${TT.run}</button></div></div>
  <div class="mtools" style="margin-top:8px"><button type="button" id="tBestT">${TT.bestTeam}</button><button type="button" id="tBestC">${TT.bestChamp}</button></div>
  </aside>
  <section class="right"><div class="card"><h2>${TT.res}</h2><div id="tRes"><p class="note">${TT.note}</p></div></div><div class="card" id="tExtra" hidden></div></section>`;
  const sel=id=>tm.querySelector('#'+id);
  sel('tArea').addEventListener('change',()=>{fillDiff();upd()});['tDiff','tMini','tBar','tBoost'].forEach(k=>sel(k).addEventListener('change',upd));
  sel('tKind').addEventListener('click',e=>{const b=e.target.closest('button');if(!b) return;sel('tKind').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));upd()});
  sel('tChamp').addEventListener('input',()=>{champLoad(sel('tChamp').value);champFill();upd()});CF.forEach(k=>{sel(k).addEventListener('input',()=>{champSave();champFill()});sel(k).addEventListener('change',()=>{champSave();champFill()})});
  sel('tRun').addEventListener('click',()=>go());sel('tBestT').addEventListener('click',bestTeam);sel('tBestC').addEventListener('click',bestChamp);
  fillDiff();champLoad(sel('tChamp').value);champFill();refreshPresets();upd();
}
const $t=id=>tm.querySelector('#'+id);
function curQuest(){const f=$t('tArea').value,d=+$t('tDiff').value,b=+$t('tKind').querySelector('.on').dataset.v;const L0=byFam[f]||[];return L0.find(q=>q.d===d&&q.b===b)||L0.find(q=>q.d===d)||L0[0]}
function fillDiff(){const f=$t('tArea').value,L0=byFam[f]||[],ds=[...new Set(L0.map(q=>q.d))].sort((a,b)=>a-b);
  $t('tDiff').innerHTML=ds.map(d=>`<option value="${d}">${esc(L(SD.txt.diff[d])||('T'+(d+1)))}</option>`).join('');$t('tDiff').value=ds[ds.length-1];
  const hasB=L0.some(q=>q.b);$t('tKind').hidden=!hasB;if(!hasB) $t('tKind').querySelectorAll('button').forEach((x,i)=>x.classList.toggle('on',i===0))}
const CSK='sthc:champstats';const cGet=()=>{try{return JSON.parse(localStorage.getItem(CSK))||{}}catch(e){return {}}};
const CF=['tCRank','tCRe','tCLvl','tCTitan','tFamI','tFamQ','tFamE','tFamS','tAurI','tAurQ','tAurE','tAurS','tCHp','tCAtk','tCDef','tCEva','tCEl'];
const fv=k=>{const e=$t(k);return e.type==='checkbox'?e.checked:e.value};
const CDEF={tCRank:'11',tCRe:'0',tCLvl:'50',tCTitan:true,tFamQ:'3',tAurQ:'3'};
function champLoad(u){const v=cGet()[u]||{};CF.forEach(k=>{const e=$t(k),x=v[k]!=null?v[k]:(CDEF[k]!=null?CDEF[k]:'');if(e.type==='checkbox') e.checked=!!x;else e.value=x})}
function champSave(){const u=$t('tChamp').value;if(!u) return;const a=cGet();a[u]={};CF.forEach(k=>{const x=fv(k);if(x!=='') a[u][k]=x});try{localStorage.setItem(CSK,JSON.stringify(a))}catch(e){}}
const gearOf=()=>['Fam','Aur'].map(x=>({i:$t('t'+x+'I').value,q:$t('t'+x+'Q').value,e:$t('t'+x+'E').value,s:$t('t'+x+'S').value}));
const cStats=u=>champStats(u,Math.max(1,Math.min(100,+$t('tCLvl').value||1)),+$t('tCRank').value,Math.max(0,+$t('tCRe').value||0),$t('tCTitan').checked,gearOf());
function champFill(){const u=$t('tChamp').value;const on=!!u;CF.forEach(k=>$t(k).disabled=!on);
  if(!on){$t('tCInfo').textContent='';return}
  const s=cStats(u),c=SD.champs[u];
  $t('tCAtk').placeholder=s.atk;$t('tCDef').placeholder=s.def;$t('tCHp').placeholder=s.hp;$t('tCEva').placeholder=Math.round(s.eva*100);$t('tCEl').placeholder=s.el;
  const m=SD.mods[c.sk[s.sk-1]];
  const am=auraMod();const ov=['tCHp','tCAtk','tCDef','tCEva','tCEl'].filter(k=>$t(k).value!=='');if(ov.length) tm.querySelector('#tCInfo+details').open=true;
  $t('tCInfo').innerHTML=`${ov.length?`<b class="g2">${TT.ovOn}</b><br>`:''}<b>${TT.calc}</b> ${EN?'HP':'PV'} ${fmt(s.hp)} · ATK ${fmt(s.atk)} · DEF ${fmt(s.def)} · ${TT.eva} ${Math.round(s.eva*100)} % · ${TT.el} ${fmt(s.el)}<br>${TT.skill} ${s.sk}/5${m?' · '+esc(L(m.n)||'')+' : '+modTxt(m):''}${am?'<br>'+esc(L(am.n)||'')+' : '+modTxt(am):''}`;}
const auraMod=()=>{const n=$t('tAurI').value;const g=n&&GM&&GM.items&&GM.items[n];const u=g&&g.uid;return u&&SD.mods[u]&&SD.mods[u].isAurastone?SD.mods[u]:null};
function modTxt(m){const o=[];const P=(k,l)=>{if(m[k]) o.push(`${m[k]>0?'+':''}${Math.round(m[k]*100)} % ${l}`)};
  P('atk','ATK');P('def','DEF');P('hp',EN?'HP':'PV');P('evasion',EN?'evasion':'esquive');P('critical','crit');P('critMult',EN?'crit dmg':'dégâts crit');
  if(m.regen) o.push(`+${m.regen} ${EN?'HP/round':'PV/tour'}`);if(m.barrierPowerMult&&m.barrierPowerMult!==1) o.push(`×${m.barrierPowerMult} ${TT.power}`);if(m.bossMult&&m.bossMult!==1) o.push(`×${m.bossMult} boss`);if(m.FlashQuestModMult&&m.FlashQuestModMult!==1) o.push(`×${m.FlashQuestModMult} ${EN?'flash':'éclair'}`);
  return o.join(', ')}
function refreshPresets(){const a=plist(),n=partySize();
  const opts=`<option value="">${TT.pick}</option>`+a.map((p,i)=>p?`<option value="${i}">${i+1}. ${esc(p.name||'?')} · ${esc(nm(D.classes.find(c=>c.name===p.cls))||p.cls)}</option>`:'').join('');
  const old=[...tm.querySelectorAll('.tslot select')].map(s=>s.value);
  $t('tSlots').innerHTML=a.some(Boolean)?Array.from({length:n},(_,k)=>`<div class="tslot"><b>${k+1}</b><select data-s="${k}" aria-label="${TT.heroes} ${k+1}">${opts}</select></div>`).join(''):`<p class="note">${TT.noPreset}</p>`;
  tm.querySelectorAll('.tslot select').forEach((s,k)=>{if(old[k]!=null) s.value=old[k]});}
function partySize(){const q=curQuest();return Math.max(1,(q?q.p:4)-($t('tChamp').value?1:0))}
function upd(){const q=curQuest();if(!q) return;
  const bel=q.el||[];$t('tBar').innerHTML=bel.length?bel.map(e=>`<option value="${e}">${esc(L(ELN[e])||e)}</option>`).join(''):`<option value="">${TT.none}</option>`;$t('tBar').disabled=!bel.length;
  $t('tMini').disabled=!!(q.b||q.fl||!q.mb);if($t('tMini').disabled) $t('tMini').value='';
  $t('tQinfo').innerHTML=`${esc(L(SD.names[q.f]&&(q.b?SD.names[q.f].boss:SD.names[q.f].mob)))} · ${EN?'HP':'PV'} ${fmt(q.hp)} · ${EN?'damage':'dégâts'} ${fmt(q.dmg)} (${EN?'area':'zone'} ${fmt(q.aoe)}, ${pc(q.ao)}) · ${EN?'target DEF':'DEF cible'} ${fmt(q.td)} · crit ${pc(q.cr)} ×${q.cm}${q.acc?` · ${EN?'accuracy':'précision'} ${pc(q.acc)}`:''}${q.bp?` · ${TT.barrier} ${fmt(q.bp)}`:''}`;
  $t('tParty').textContent=`${TT.party} ${q.p} ${TT.slots}${$t('tChamp').value?' (1 = '+TT.champ.toLowerCase()+')':''}.`;
  refreshPresets();}
function champFighter(){const u=$t('tChamp').value;if(!u) return null;const c=SD.champs[u];
  const s=cStats(u);
  const v=(id,d)=>{const x=$t(id).value;return x===''?d:+x};
  return {name:L(c.n),cname:TT.champ,cls:'champion',family:famOf(c.cls),gcls:c.cls,champ:u,hemma:u==='hemma',
    atk:v('tCAtk',s.atk),def:v('tCDef',s.def),hp:v('tCHp',s.hp),crit:c.cr,cm:c.cm,eva:v('tCEva',c.eva*100)/100,aggro:c.aggro,el:v('tCEl',0),elem:c.el,
    aBr:1,dBr:1,card:1,bossA:0,bossD:1,shark:0,dino:0,maxEva:cn0('quest_evasion_max',0.75),survive:0,regen:0,champB:0,leader:SD.mods[c.sk[s.sk-1]],aura:auraMod()}}
function setup(){const q=curQuest();const mods=[];const ch=champFighter();if(ch&&ch.leader) mods.push(ch.leader);if(ch&&ch.aura) mods.push(ch.aura);
  ['tBoost','tMini'].forEach(k=>{const u=$t(k).value;if(u&&SD.mods[u]) mods.push(SD.mods[u])});
  const party=[];if(ch) party.push(ch);
  const pre=plist();tm.querySelectorAll('.tslot select').forEach(s=>{if(s.value==='') return;const f=fighterFromPreset(pre[+s.value]);if(f) party.push(f)});
  return {q,mods,party,opts:{mini:!!$t('tMini').value,bel:$t('tBar').value||null,n:+$t('tN').value}}}
function go(){const {q,mods,party,opts}=setup();if(party.filter(h=>h.cls!=='champion').length<1){$t('tRes').innerHTML=`<p class="note">${TT.needHero}</p>`;return}
  const r=S.run(q,mods,party,opts);show(r,party,q,opts)}
function show(r,party,q,opts){
  const bar=x=>`<div class="bar"><i style="width:${Math.round(x*100)}%"></i></div>`;
  let pw=0;for(const h of party){if(h.elem===opts.bel) pw+=h.el;else if(h.elem==='Any'||h.elem==='all') pw+=Math.round(h.el*0.5)}pw=Math.round(pw*r.mi.bpm);
  const tot=r.dmg.reduce((a,b)=>a+b,0)||1;
  $t('tRes').innerHTML=`<div class="kpi"><div><span>${TT.win}</span><b>${pc(r.win)}</b>${bar(r.win)}</div><div><span>${TT.rounds}</span><b>${r.rounds?r.rounds.toFixed(1).replace('.',EN?'.':','):'—'}</b><span>${r.minR?r.minR+'–'+r.maxR:''}</span></div><div><span>${TT.mhp}</span><b>${fmt(r.mHp)}</b><span>${TT.prog} : ${pc(r.prog)}</span></div>${q.bp?`<div><span>${TT.barrier} (${esc(L(ELN[opts.bel])||'')})</span><b class="${pw>=q.bp?'g5':'g1'}">${fmt(pw)} / ${fmt(q.bp)}</b><span>${pw>=q.bp?TT.shatter:TT.notShatter}</span></div>`:''}</div>
  <div class="scroll"><table><thead><tr><th>${TT.heroes}</th><th class="n">ATK</th><th class="n">DEF</th><th class="n">${EN?'HP':'PV'}</th><th class="n">${TT.crit}</th><th class="n">${TT.eva}</th><th class="n">${TT.thr}</th><th class="n">${TT.dmg}</th><th class="n">${TT.death}</th><th>${TT.grade}</th></tr></thead><tbody>${party.map((h,k)=>`<tr><td>${h.ic?icoClass(h.ic,28):''} <b>${esc(h.name)}</b><div class="alt">${esc(h.cname)}</div></td><td class="n">${fmt(h.atk)}</td><td class="n">${fmt(h.def)}</td><td class="n">${fmt(h.hp)}</td><td class="n">${Math.round(h.crit*100)} %</td><td class="n">${Math.round(h.eva*100)} %</td><td class="n">${fmt(h.aggro)}</td><td class="n">${fmt(r.dmg[k])}<div class="alt">${pc(r.dmg[k]/tot)}</div></td><td class="n">${pc(r.death[k])}</td><td>${face(r.grade[k])}</td></tr>`).join('')}</tbody></table></div>
  <p class="note">${r.n} ${TT.sims.toLowerCase()}. ${TT.note}</p>`;}
// ----- recherches -----
const cmpR=(a,b)=>b.r.win-a.r.win||Math.max(...a.r.death)-Math.max(...b.r.death)||(a.r.win?a.r.rounds-b.r.rounds:b.r.prog-a.r.prog);
const rTxt=r=>r.win?r.rounds.toFixed(1).replace('.',EN?'.':','):'—';
function combos(arr,k){const out=[];const rec=(s,a)=>{if(a.length===k){out.push(a.slice());return}for(let i=s;i<arr.length;i++){a.push(arr[i]);rec(i+1,a);a.pop()}};rec(0,[]);return out}
async function bestTeam(){const {q,mods,opts}=setup();const pre=plist(),ids=pre.map((p,i)=>p?i:-1).filter(i=>i>=0);
  const F={};for(const i of ids){const f=fighterFromPreset(pre[i]);if(f) F[i]=f}
  const ch=champFighter(),k=Math.min(partySize(),Object.keys(F).length);if(!k){$t('tRes').innerHTML=`<p class="note">${TT.noPreset}</p>`;return}
  let C=combos(Object.keys(F).map(Number),k);if(C.length>3000) C=C.slice(0,3000);
  const box=$t('tExtra');box.hidden=false;box.innerHTML=`<h2>${TT.topTeams}</h2><p class="note">${TT.busy}</p>`;
  const res=[];const n=Math.min(300,opts.n);
  for(let i=0;i<C.length;i++){const party=(ch?[ch]:[]).concat(C[i].map(j=>({...F[j]})));const r=S.run(q,mods,party,{...opts,n});res.push({c:C[i],r,party});
    if(i%20===19){box.querySelector('.note').textContent=`${TT.busy} ${i+1}/${C.length}`;await new Promise(z=>setTimeout(z,0))}}
  res.sort(cmpR);
  box.innerHTML=`<h2>${TT.topTeams}</h2><p class="note">${C.length} ${TT.combos} · ${n} ${TT.sims.toLowerCase()}</p><div class="scroll"><table><thead><tr><th>#</th><th>${TT.heroes}</th><th class="n">${TT.win}</th><th class="n">${TT.rounds}</th><th class="n">${TT.prog}</th><th class="n">${TT.death} max</th></tr></thead><tbody>${res.slice(0,10).map((x,i)=>`<tr><td>${i+1}</td><td>${x.c.map(j=>esc(F[j].name)).join(' · ')}</td><td class="n">${pc(x.r.win)}</td><td class="n">${rTxt(x.r)}</td><td class="n">${pc(x.r.prog)}</td><td class="n">${face(gOf(Math.max(...x.r.death)),22)} ${pc(Math.max(...x.r.death))}</td></tr>`).join('')}</tbody></table></div>`;
  // place la meilleure équipe dans les emplacements
  const b=res[0];if(b) tm.querySelectorAll('.tslot select').forEach((s,j)=>s.value=b.c[j]!=null?String(b.c[j]):'');go();}
async function bestChamp(){const {q,opts}=setup();const pre=plist();const heroes=[];tm.querySelectorAll('.tslot select').forEach(s=>{if(s.value==='') return;const f=fighterFromPreset(pre[+s.value]);if(f) heroes.push(f)});
  if(!heroes.length){$t('tRes').innerHTML=`<p class="note">${TT.needHero}</p>`;return}
  const keep=$t('tChamp').value,box=$t('tExtra');box.hidden=false;box.innerHTML=`<h2>${TT.topChamps}</h2><p class="note">${TT.busy}</p>`;await new Promise(z=>setTimeout(z,0));
  const out=[];for(const u of Object.keys(SD.champs)){$t('tChamp').value=u;champLoad(u);const ch=champFighter();const mods=[ch.leader,ch.aura].filter(Boolean);
    ['tBoost','tMini'].forEach(k=>{const v=$t(k).value;if(v&&SD.mods[v]) mods.push(SD.mods[v])});
    const party=[ch].concat(heroes.slice(0,Math.max(1,q.p-1)).map(h=>({...h})));out.push({u,r:S.run(q,mods,party,{...opts,n:Math.min(1000,opts.n)})})}
  $t('tChamp').value=keep;champLoad(keep);champFill();
  out.sort(cmpR);
  box.innerHTML=`<h2>${TT.topChamps}</h2><p class="note">${TT.savedC}</p><div class="scroll"><table><thead><tr><th>#</th><th>${TT.champ}</th><th class="n">${TT.win}</th><th class="n">${TT.rounds}</th><th class="n">${TT.prog}</th><th class="n">${TT.death} max</th></tr></thead><tbody>${out.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(L(SD.champs[x.u].n))}</td><td class="n">${pc(x.r.win)}</td><td class="n">${rTxt(x.r)}</td><td class="n">${pc(x.r.prog)}</td><td class="n">${face(gOf(Math.max(...x.r.death)),22)} ${pc(Math.max(...x.r.death))}</td></tr>`).join('')}</tbody></table></div>`;}
window.STC_team={fighterFromPreset,champStats,setup,run:()=>go()};
})();
