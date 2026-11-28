// ===== Onglet « Équipe et quêtes » : simulation de combat (moteur : sim.js) =====
(()=>{
const S=window.STSIM; if(!S||!S.SD) return;
const SD=S.SD, EN=LANG_UI==='en', L=a=>Array.isArray(a)?(EN?a[1]||a[0]:a[0]||a[1]):(a||'');
const TT={fr:{tabHero:'Héros',tabTeam:'Équipe et quêtes',tabChamps:'Champions',opTitle:'Meilleur équipement des champions',opHelp:'Pour chaque champion, l’outil cherche le meilleur familier et le meilleur chant d’aura, avec leur élément et leur esprit. Il utilise le rang, le niveau, les graines et la carte enregistrés.',opMode:'Objectif',opModes:['Puissance','Briseur de barrière','Rapide'],opModeH:['La plus grande puissance (compétence de chef et chant d’aura compris).','Le plus grand élément du champion, puis la plus grande puissance. Une affinité « tous éléments » (ex. Cyberdragon X) donne la moitié du bonus d’élément (+5 au lieu de +10) : l’outil propose alors une variante.','Le chant d’aura qui réduit le plus le temps de quête, puis la plus grande puissance.'],opQ:'Qualité des objets',opT:'Tier max des enchantements',opRun:'Calculer pour tous les champions',opNow:'Actuel',opBest:'Meilleur',opApply:'Appliquer',opApplied:'Équipement appliqué. Les stats du jeu enregistrées ne correspondent plus : entrez les nouvelles après l’avoir équipé.',opNone:'aucun',opTime:'temps de quête',opRest:'repos',opPow:'Puissance',powGame:'Puissance du jeu (enregistrée dans le preset)',powCalc:'Puissance calculée (pas de valeur du jeu dans le preset)',powTot:'Puissance totale des héros',opAlt:'Variante : un peu moins d’élément, plus de puissance',sfBtn:'Trouver les graines avec les stats du jeu',sfHelp:'L’outil déduit les graines des PV, de l’ATQ et de la DEF du jeu (entrés ci-dessus). Dans le jeu, le compteur s’affiche en utilisant une graine depuis l’inventaire (les champions y seront visibles avec la version 26.12.0, à venir).',sfOk:'Graines trouvées : ',sfExact:'Les stats correspondent exactement.',sfNear:'Écart restant : ',sfNone:'Entrez d’abord les PV, l’ATQ ou la DEF du jeu.',bkExp:'Exporter tout',bkImp:'Importer',bkHelp:'Sauvegarde dans un fichier : tous les champions, les presets de héros et les réglages. L’import remplace les données de ce navigateur.',bkOk:'Données exportées : ',bkKeys:' élément(s).',bkIn:'Import réussi. La page se recharge…',bkBad:'Fichier invalide.',bkAsk:'Remplacer les champions, les presets et les réglages de ce navigateur par ceux du fichier ?',editC:'Modifier ce champion',notSet:'non configuré (valeurs par défaut)',cHelp:'Configurez chaque champion une seule fois : rang, renforts, niveau, graines, familier et chant d’aura. L’outil enregistre tout dans ce navigateur, et le simulateur réutilise ces réglages.',savedAuto:'Enregistré automatiquement dans ce navigateur.',quest:'Quête',area:'Zone',diff:'Difficulté',boss:'Boss',normal:'Normal',flash:'Quêtes éclair',areas:'Zones',special:'Autres',
  mini:'Mini-boss',none:'Aucun',barrier:'Barrière élémentaire',champ:'Champion',noChamp:'Aucun champion',rank:'Rang',titan:'Âme de titan',lvl:'Niveau',skill:'Compétence de chef',
  aura:'Chant d’aura',booster:'Bonus de quête',heroes:'Héros (presets)',emptyP:'— vide —',pick:'— choisir un preset —',sims:'Simulations',run:'Simuler',
  bestTeam:'Meilleure équipe',bestChamp:'Meilleur champion',res:'Résultat',win:'Victoire',rounds:'Tours (moy.)',mhp:'PV du monstre',death:'Risque de mort',grade:'Note',
  dmg:'Dégâts / combat',noPreset:'Aucun preset enregistré. Créez vos héros dans l’onglet Héros (mode manuel → Mes héros).',needHero:'Choisissez au moins un héros.',
  busy:'Calcul…',party:'Équipe de',slots:'emplacements',chStats:'Corriger les stats (facultatif)',chHelp:'Si le calcul diffère de l’onglet Infos du jeu, entrez les vraies valeurs. Vide = calcul.',reinf:'Renforts (+)',fam:'Familier',qual:'Qualité',spirit:'Esprit',calc:'Calcul',card:'Carte de collection du champion (livre de collection)',cards:['Aucune','Commune (+5 %)','Rare (+10 %)','Mythique (+25 %)'],parag:'Âme de Parangon',cmpT:'Stats affichées dans le jeu (onglet Infos)',cmpH:'Entrez les valeurs du jeu : l’outil montre l’écart avec son calcul.',useG:'Le simulateur utilise les valeurs du jeu (sinon le calcul)',calcS:'Calcul',gameS:'Jeu',gap:'Écart',seeds:'Graines utilisées (+4 ATQ, +4 DEF, +1 PV par graine)',noEl:'aucun élément',noSp:'aucun esprit',ovOn:'Le simulateur utilise les stats du jeu entrées ci-dessous.',savedC:'Chaque champion utilise son rang, son familier et son chant d’aura enregistrés (ou les valeurs par défaut).',el:'Élément',eva:'Esq.',crit:'Crit',thr:'Menace',
  topTeams:'Meilleures équipes parmi vos presets',topChamps:'Champions classés pour cette équipe',combos:'combinaisons testées',
  note:'Moteur repris du code du jeu (Quest.DoCombat), lu sans lancer le jeu. Note par héros, avec le visage du jeu : SSS = jamais mort, S < 15 %, A < 40 %, B < 60 %, C < 100 %, D = toujours mort. À vérifier avec la note affichée dans le jeu (A_VERIFIER.md, test 14).',
  prog:'PV du monstre retirés',shatter:'Barrière brisée',fqTitle:'Quêtes éclair : calendrier',fqStart:'Début',fqTimer:'Minuteur',fqNow:'En cours',fqLeft:'reste',fqIn:'dans',fqHour:'Ou choisissez l’heure de début, à l’heure de chez vous',fqSync:'Régler l’heure avec le jeu (une seule fois)',fqSteps:['Dans le jeu, ouvrez la quête éclair en cours.','Lisez le temps restant sur son minuteur.','Entrez ce temps ci-dessous, puis cliquez sur « Régler ».'],fqH:'heures',fqM:'minutes',fqGo:'Régler',fqOk:'Heure réglée : les quêtes éclair commencent à {h} chez vous ({z}).',fqBad:'Entrez le temps restant (heures et minutes).',fqCur:'Réglage actuel : début à {h} chez vous ({z}).',fqNote:'Jours du mois : notes de version 12.0.0 (Kabam). Donjon Parangon et Nullysium : 1 week-end sur 2, dès le 14/11/2026 (information à confirmer). Touchez une quête pour la simuler. L’heure de début n’est pas dans les fichiers du jeu.',notShatter:'Barrière NON brisée : −80 % de dégâts',power:'Puissance d’élément'},
 en:{tabHero:'Hero',tabTeam:'Team & quests',tabChamps:'Champions',opTitle:'Best champion gear',opHelp:'For each champion, the tool looks for the best familiar and the best aurasong, with their element and spirit. It uses the saved rank, level, seeds and card.',opMode:'Goal',opModes:['Power','Barrier breaker','Fast'],opModeH:['The highest power (leader skill and aurasong included).','The highest champion element, then the highest power. An “all elements” affinity (e.g. Cyberdragon X) gives half the element bonus (+5 instead of +10): the tool then shows a variant.','The aurasong that cuts quest time the most, then the highest power.'],opQ:'Item quality',opT:'Max enchantment tier',opRun:'Compute for all champions',opNow:'Current',opBest:'Best',opApply:'Apply',opApplied:'Gear applied. The saved game stats no longer match: enter the new ones after you equip it.',opNone:'none',opTime:'quest time',opRest:'rest',opPow:'Power',powGame:'Game power (saved in the preset)',powCalc:'Computed power (no game value in the preset)',powTot:'Total hero power',opAlt:'Variant: a little less element, more power',sfBtn:'Find the seeds from the game stats',sfHelp:'The tool deduces the seeds from the game HP, ATK and DEF (entered above). In game, the counter shows when you use a seed from the inventory (champions will be listed with the upcoming version 26.12.0).',sfOk:'Seeds found: ',sfExact:'The stats match exactly.',sfNear:'Remaining gap: ',sfNone:'First enter the game HP, ATK or DEF.',bkExp:'Export all',bkImp:'Import',bkHelp:'Backup to a file: all champions, hero presets and settings. Import replaces the data of this browser.',bkOk:'Data exported: ',bkKeys:' item(s).',bkIn:'Import done. The page reloads…',bkBad:'Invalid file.',bkAsk:'Replace the champions, presets and settings of this browser with the ones in the file?',editC:'Edit this champion',notSet:'not set (default values)',cHelp:'Set each champion once: rank, reinforcements, level, seeds, familiar and aurasong. The tool saves everything in this browser, and the simulator reuses these settings.',savedAuto:'Saved automatically in this browser.',quest:'Quest',area:'Area',diff:'Difficulty',boss:'Boss',normal:'Normal',flash:'Flash quests',areas:'Areas',special:'Other',
  mini:'Mini-boss',none:'None',barrier:'Elemental barrier',champ:'Champion',noChamp:'No champion',rank:'Rank',titan:'Titan soul',lvl:'Level',skill:'Leader skill',
  aura:'Aurasong',booster:'Quest booster',heroes:'Heroes (presets)',emptyP:'— empty —',pick:'— choose a preset —',sims:'Simulations',run:'Simulate',
  bestTeam:'Best team',bestChamp:'Best champion',res:'Result',win:'Win',rounds:'Rounds (avg.)',mhp:'Monster HP',death:'Death risk',grade:'Rating',
  dmg:'Damage / fight',noPreset:'No saved preset. Create your heroes in the Hero tab (manual mode → My heroes).',needHero:'Choose at least one hero.',
  busy:'Computing…',party:'Party of',slots:'slots',chStats:'Correct the stats (optional)',chHelp:'If the result differs from the game Info tab, enter the real values. Empty = computed.',reinf:'Reinforcements (+)',fam:'Familiar',qual:'Quality',spirit:'Spirit',calc:'Computed',card:'Champion collection card (collection book)',cards:['None','Common (+5%)','Rare (+10%)','Mythic (+25%)'],parag:'Paragon soul',cmpT:'Stats shown in game (Info tab)',cmpH:'Enter the game values: the tool shows the gap with its result.',useG:'The simulator uses the game values (otherwise the computed ones)',calcS:'Computed',gameS:'Game',gap:'Gap',seeds:'Seeds used (+4 ATK, +4 DEF, +1 HP per seed)',noEl:'no element',noSp:'no spirit',ovOn:'The simulator uses the game stats entered below.',savedC:'Each champion uses its saved rank, familiar and aurasong (or the defaults).',el:'Element',eva:'Eva.',crit:'Crit',thr:'Threat',
  topTeams:'Best teams among your presets',topChamps:'Champions ranked for this team',combos:'combinations tested',
  note:'Engine taken from the game code (Quest.DoCombat), read without running the game. Hero rating, with the game face: SSS = never dies, S < 15%, A < 40%, B < 60%, C < 100%, D = always dies. To check against the rating shown in game (A_VERIFIER.md, test 14).',
  prog:'Monster HP removed',shatter:'Barrier shattered',fqTitle:'Flash quests: calendar',fqStart:'Start',fqTimer:'Timer',fqNow:'Live',fqLeft:'ends in',fqIn:'in',fqHour:'Or choose the start time, in your local time',fqSync:'Set the time from the game (once)',fqSteps:['In the game, open the current flash quest.','Read the time left on its timer.','Enter this time below, then click “Set”.'],fqH:'hours',fqM:'minutes',fqGo:'Set',fqOk:'Time set: flash quests start at {h} your time ({z}).',fqBad:'Enter the time left (hours and minutes).',fqCur:'Current setting: start at {h} your time ({z}).',fqNote:'Days of the month: version 12.0.0 release notes (Kabam). Paragon Dungeon and Nullysium: every other weekend, from 14/11/2026 (to be confirmed). Tap a quest to simulate it. The start time is not in the game files.',notShatter:'Barrier NOT shattered: −80% damage',power:'Element power'}}[EN?'en':'fr'];
const ELN={fire:['Feu','Fire'],water:['Eau','Water'],air:['Air','Air'],earth:['Terre','Earth'],light:['Lumière','Light'],dark:['Ténèbres','Dark']};
const GRADE=['D','C','B','A','S','SSS'];
const TA=/*TEAMATLAS*/null; // icônes du jeu : champions, compétences de chef, zones, âme de titan
const ta=(n,sz=32)=>{if(!TA) return '';const i=TA.i[n];if(i==null) return '';const c=TA.cols;return `<span class="ui" style="display:inline-block;flex:none;width:${sz}px;height:${sz}px;background-image:url(${TA.img});background-size:${c*sz}px auto;background-position:-${(i%c)*sz}px -${Math.floor(i/c)*sz}px" aria-hidden="true"></span>`};
const areaIco=(f,sz)=>ta('icon_global_questarea_'+f+'_small',sz)||ta('FQ'+f,sz)||ta('fq'+f,sz)||ta('FQ'+f[0].toUpperCase()+f.slice(1),sz)||ta('icon_global_flashquest',sz);
const FACES=/*FACES*/null; // visages de note du jeu (icon_shop_face_D…SSS)
const face=(g,sz=28)=>`<span class="face">${FACES&&FACES[g]?`<img src="${FACES[g]}" width="${sz}" height="${sz}" alt="">`:''}<b class="grade g${g}">${GRADE[g]}</b></span>`;
const gOf=d=>d<=0?5:d<0.15?4:d<0.4?3:d<0.6?2:d<1?1:0;
const FAMG={fighter:'soldier,mercenary,barbarian,chieftain,knight,lord,ranger,warden,swordmaster,daimyo,berserker,jarl,darkknight,deathknight',rogue:'thief,trickster,monk,mastermonk,musketeer,conquistador,wanderer,pathfinder,ninja,sensei,dancer,acrobat,velite,praetorian'};
const famOf=g=>FAMG.fighter.split(',').includes(g)?'Fighter':FAMG.rogue.split(',').includes(g)?'Rogue':'Spellcaster';
const fmt=n=>Math.round(n).toLocaleString(EN?'en-US':'fr-FR'), pc=x=>(x*100).toFixed(x<0.1&&x>0?1:0).replace('.',EN?'.':',')+' %';
// ----- onglets -----
const main=document.querySelector('main');
const nav=document.createElement('nav');nav.className='tabs';nav.setAttribute('role','tablist');
nav.innerHTML=`<button type="button" role="tab" data-t="hero" class="on" aria-selected="true">${ui('power',20)} ${TT.tabHero}</button><button type="button" role="tab" data-t="champs" aria-selected="false">${ta('championtitansoul',22)} ${TT.tabChamps}</button><button type="button" role="tab" data-t="team" aria-selected="false">${ui('defense',20)} ${TT.tabTeam}</button>`;
main.parentNode.insertBefore(nav,main);
const tm=document.createElement('main');tm.id='team';tm.className='tmx';tm.hidden=true;main.parentNode.insertBefore(tm,main.nextSibling);
const cm=document.createElement('main');cm.id='champs';cm.className='tmx';cm.hidden=true;main.parentNode.insertBefore(cm,tm.nextSibling);
const st=document.createElement('style');st.textContent=`.tabs{display:flex;gap:6px;padding:0 24px;max-width:1500px;margin:14px auto 0;border-bottom:1px solid var(--line);box-sizing:border-box}@media(max-width:900px){.tabs{padding:0 12px;margin-top:10px}.tabs button{padding:0 10px;font-size:14px;line-height:1.15}}.tabs~main{padding-top:14px}.tabs button{margin-bottom:-1px}.tabs button{min-height:44px;padding:0 16px;border-radius:10px 10px 0 0;border:1px solid var(--line);border-bottom:0;background:var(--panel2);color:var(--mut);font:600 15px system-ui,sans-serif;cursor:pointer;display:inline-flex;gap:8px;align-items:center}.tabs button.on{background:var(--panel);color:var(--txt);border-color:var(--acc)}
.tmx .tgear{border:1px solid var(--line);border-radius:10px;padding:6px 10px 10px;margin:10px 0 0}.tmx .tgear legend{font-size:13px;color:var(--mut);padding:0 4px}.tmx .ti{display:grid;grid-template-columns:38px minmax(0,1fr);gap:8px;align-items:center;margin-top:6px}.tmx .ti>span{display:flex;justify-content:center}.tmx .tit{display:flex;align-items:center;gap:6px;margin-top:30px;cursor:pointer}.tmx .lead{display:flex;gap:8px;align-items:center;margin-top:6px}.tmx .cstat{display:inline-flex;flex-wrap:wrap;gap:4px 10px;align-items:center;font-weight:600;color:var(--txt)}.tmx .cstat .ui{vertical-align:middle}.tmx .sr{position:absolute;left:-9999px}.tmx .fqt td{vertical-align:middle}.tmx .fqgo{display:flex;gap:8px;align-items:center;background:none;border:0;color:inherit;text-align:left;cursor:pointer;padding:2px 0;min-height:40px;font:inherit}.tmx .fqgo .alt{display:block}.tmx tr.fqon td{background:rgba(92,194,138,.10)}.tmx .fqh{display:grid;grid-template-columns:auto minmax(0,260px);gap:10px;align-items:center;margin-top:10px}@media(max-width:600px){.tmx .fqh{grid-template-columns:1fr}}.tmx .chk2{display:flex;flex-direction:column;gap:2px;margin-top:22px}.tmx .chk2 .tit{margin-top:0}.tmx .ccmp{margin-top:8px;width:100%}.tmx .clist{display:grid;gap:6px}.tmx .cbtn{display:flex;gap:10px;align-items:center;text-align:left;width:100%;min-height:56px;padding:8px 10px;border-radius:10px;border:1px solid var(--line);background:var(--panel2);color:var(--txt);cursor:pointer;font:inherit}.tmx .cbtn.on{border-color:var(--acc);box-shadow:0 0 0 1px var(--acc) inset}.tmx .cbtn .alt{display:block}.tmx .cbtn .cstat{font-weight:500;font-size:12px;gap:2px 8px}.tmx .ctitle{display:flex;gap:10px;align-items:center;font-size:18px}.tmx .cinfo{margin-top:12px}.tmx .fqsync{border:1px solid var(--line);border-radius:10px;padding:10px 12px;margin:12px 0 0}.tmx .fqsync ol{margin:6px 0 8px 18px;padding:0;font-size:14px;line-height:1.5}.tmx .fqin{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.tmx .fqin label{display:flex;align-items:center;gap:6px;font-size:14px}.tmx .fqin input{width:72px;min-height:40px}.tmx .fqin button{min-height:40px;padding:0 16px;border-radius:8px;border:1px solid var(--acc);background:var(--panel2);color:var(--acc);font-weight:600;cursor:pointer}.tmx .kpi span .ui{vertical-align:-4px;margin-right:2px}.tmx .bseg{display:flex;gap:8px}.tmx .bseg button{flex:0 0 auto;width:52px;height:48px;display:flex;align-items:center;justify-content:center;padding:0}.tmx .bseg button:not(.on){opacity:.55}.tmx .bseg button.on{opacity:1}.tmx .tmems{display:flex;flex-wrap:wrap;gap:4px 12px}.tmx .tmem{display:inline-flex;align-items:center;gap:5px;white-space:nowrap}.tmx th .ui{vertical-align:-4px}.tmx .tslot select{width:100%;min-width:0}.tmx .tpow{white-space:nowrap;font-size:14px;color:var(--acc)}.tmx .tptot{margin:4px 0 0}.tmx .tslot{display:grid;grid-template-columns:28px minmax(0,1fr) auto;gap:8px;align-items:center;margin:6px 0}.tmx .tslot b{font-size:14px;color:var(--mut)}.tmx select,.tmx input[type=number]{width:100%}
.tmx .kpi{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin:8px 0 14px}.tmx .kpi div{background:var(--panel2);border:1px solid var(--line);border-radius:10px;padding:10px}.tmx .kpi span{display:block;font-size:12px;color:var(--mut)}.tmx .kpi b{font-size:22px}
.tmx .tscroll{overflow-x:auto}.tmx .optab{width:100%;border-collapse:collapse;font-size:14px}.tmx .optab th,.tmx .optab td{padding:8px 6px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}.tmx .optab th{font-size:12px;color:var(--mut,#9aa)}.tmx .ope{display:flex;align-items:center;gap:6px;margin-top:3px}.tmx .ope>:first-child{flex:0 0 24px;width:24px;height:24px;overflow:hidden}.tmx .opg>span{display:flex;flex-direction:column}.tmx .optab tr.opalt td{border-top:0;background:rgba(255,255,255,.02)}.tmx .nw{white-space:nowrap}.tmx .cst{display:inline-flex;align-items:center;gap:3px;white-space:nowrap}.tmx .cpow{margin-right:4px;color:var(--acc)}.tmx .opg{display:flex;gap:6px;align-items:flex-start;margin-bottom:6px;font-size:13px;line-height:1.35}.tmx .optab .opAp{min-height:36px;padding:0 12px;border-radius:8px;border:1px solid var(--acc);background:var(--panel2);color:var(--acc);font-weight:600;cursor:pointer}.tmx .g5{color:#5cc28a}.tmx .g4{color:#9bd35c}.tmx .g3{color:#e6c34a}.tmx .g2{color:#f59e0b}.tmx .g1,.tmx .g0{color:var(--acc2)}.tmx .grade{font-weight:800}
.tmx .face{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}.tmx .face img{display:block}.tmx .bar{height:6px;border-radius:3px;background:var(--line);overflow:hidden}.tmx .bar i{display:block;height:100%;background:var(--acc)}
.tmx .row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}.tmx .row4{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}@media(max-width:600px){.tmx .row4{grid-template-columns:1fr 1fr}}`;
document.head.appendChild(st);
nav.addEventListener('click',e=>{const b=e.target.closest('button[data-t]');if(!b) return;const t=b.dataset.t;
  nav.querySelectorAll('button').forEach(x=>{const on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-selected',on)});
  main.hidden=t!=='hero';tm.hidden=t!=='team';cm.hidden=t!=='champs';if(t==='team') initTeam();if(t==='champs') initChamps()});
const goTab=t=>nav.querySelector(`button[data-t="${t}"]`).click();
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
  const gpw=+(p.game&&String(p.game.gPow||'').replace(/[^\d]/g,''))||0;
  return {pw:R.power,gpw,name:p.name||nm(c),cname:nm(c),cls:n,family:c.family,gcls:(GM&&GM.alias&&GM.alias[n])||n.toLowerCase().replace(/\s/g,''),ic:c,
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
function champStats(u,lvl,rank,reinf,titan,gear,seeds,par,card){
  const c=SD.champs[u];if(!c) return null;
  lvl=Math.max(1,Math.min(par?100:50,lvl)); // niveaux 51 à 100 : âme de Parangon (Hero.CanUseParagonSoul)
  // courbe de niveau du jeu (CharacterData.ScaleStatToLevel) en virgule fixe 16 bits : +1 %, 2 %, 3 %, 4 % de (niv. 40 − niv. 1) par niveau (2–9, 10–20, 21–30, 31–40),
  // puis +10 % de (niv. 50 − niv. 40) et +2 % de (niv. 100 − niv. 50) par niveau ; 0,01 est tronqué (0,0099945) → −0,055 %, visible sur Argon
  const FX=x=>Math.floor(x*65536)/65536, H=FX(0.01);
  const cur=a=>{const[v1,v40,v50,v100]=a;const X=v40-v1;let v=v1;for(let l=2;l<=lvl;l++) v+=l<=9?H*X:l<=20?2*H*X:l<=30?3*H*X:l<=40?4*H*X:l<=50?10*H*(v50-v40):2*H*((v100||v50)-v50);return Math.round(v)};
  const story=rank+(rank>=11?reinf:0);let pct=0,sk=1;
  for(let i=0;i<story-1;i++){const x=c.upg[Math.min(i,c.upg.length-1)];if(!x) continue;const m=/stat\+([\d.]+)/.exec(x);if(m) pct+=FX(+m[1]);if(/skl\+1/.test(x)&&i<c.upg.length) sk++}
  if(titan&&c.titan){const m=/stat\+([\d.]+)/.exec(c.titan);if(m) pct+=FX(+m[1])}
  // amélioration Parangon (upgPrgnlvl100) au niveau 100
  if(par&&lvl>=cn0('champion_paragon_soul_skill_unlock_level',100)&&c.prg){const m=/stat\+([\d.]+)/.exec(c.prg);if(m) pct+=+m[1];if(/skl\+1/.test(c.prg)) sk++}
  // Hero.GetCurrentActiveSkillUid : compétence = 1 + nombre de skl+1, sans limite liée à l'âme de titan
  sk=Math.min(5,sk);
  const tm=titan?cn0('champion_titan_soul_story_stat_mult',1.5):1, st=c.st||[0,0,0,0,0];
  // graines (Character.seedsAtk/Def/Hp, communes aux héros et aux champions) : +4 ATQ, +4 DEF, +1 PV par graine
  const sd=k=>Math.max(0,Math.min(80,+((seeds||{})[k])||0));
  // niveau (entier) + améliorations (virgule fixe, sans arrondi : Hero.get_SpecificAttack)
  const base={hp:cur(c.hp)+pct*st[0]*tm+sd('hp'),atk:cur(c.atk)+pct*st[1]*tm+4*sd('atk'),def:cur(c.def)+pct*st[2]*tm+4*sd('def')};
  const elB=String(SD.cons.hero_element_rank_and_value||'').split(';').map(x=>x.split(',').map(Number)).filter(x=>x[0]<=story).pop();
  const Cap=x=>x?x[0].toUpperCase()+x.slice(1):x;
  const cls={name:'Champion',family:famOf(c.cls),element:Cap(c.el),crit:c.cr,critDmg:c.cm,eva:c.eva,threat:c.aggro,slots:[],skillUnlock:[]};
  // carte de collection du champion (commune ×1,05, rare ×1,10, mythique ×1,25 : comme les héros) — Argon : écart de −9,1 % sur PV, ATQ et DEF sans la carte rare
  const ctx={cls,lvl,maxT:16,base,card:FX([1,1.05,1.10,1.25][+card||0]||1),trans:0,star:false,q:3,eT:16,goldWild:false,obj:'power',nSlots:0,innate:null,fams:[]};
  let R=null;
  try{const picks=(gear||[]).filter(g=>g&&g.i&&ITEM[g.i]).map(g=>{const it=ITEM[g.i];const pk=makePick({...ctx,q:+g.q||3},g.i,it.builtElem?null:(g.e||null),it.builtSpirit?null:(g.s||null));
      // stats de chaque objet arrondies à l'entier (Argon : Avatar + Lumière, 2 686,5 DEF → 2 687)
      pk.st={atk:Math.round(pk.st.atk),def_:Math.round(pk.st.def_),hp:Math.round(pk.st.hp)};return pk});
    R=evaluate(ctx,picks,[])}catch(e){R=null}
  return {lvl,atk:Math.round(R?R.atk:base.atk),def:Math.round(R?R.def:base.def),hp:Math.round(R?R.hp:base.hp),eva:R?R.eva/100:c.eva,crit:R?R.crit/100:c.cr,cm:R?R.cm:c.cm,
    el:(elB?elB[1]:0)+(R?R.el:0),sk,story,base};
}
// ----- interface -----
let inited=false;
const QS=SD.quests, byFam={};QS.forEach(q=>(byFam[q.f]=byFam[q.f]||[]).push(q));
const famList=Object.keys(byFam);
const areaName=f=>L(SD.names[f]&&SD.names[f].area)||f;
// ----- calendrier des quêtes éclair -----
// jour du mois : notes de version 12.0.0 (playshoptitans.com) ; niveau de départ = minLevel des données du jeu
const FQDAY={lcog:2,enchant:4,sigil:6,training:8,moon:10,gear:12,research:14,rune:16,repair:18,chest:20,ascension:22,key:24,fancygear:26,champion:28};
// quêtes du week-end, 1 week-end sur 2 (à confirmer) : Donjon Parangon dès le 14/11/2026, Nullysium le week-end suivant
const FQWE={paragondust:Date.UTC(2026,10,14),transcendence:Date.UTC(2026,10,21)};
const FQWE_LEN=2*864e5, DAY=864e5;
const FQH_KEY='sthc:fqhour';const fqHour=()=>{const v=+(localStorage.getItem(FQH_KEY)??0);return isNaN(v)?0:v};
const fqName=f=>{const n=SD.names[f]||{};return L(n.mob)||areaName(f)};
const fqLvl=f=>{const q=byFam[f]&&byFam[f][0];return q&&q.ul||null};
// prochaine fenêtre [début, fin] qui finit après t
function fqNext(f,t){const h=fqHour()*36e5;
  if(FQDAY[f]){const d=new Date(t);for(let k=-1;k<3;k++){const y=d.getUTCFullYear(),m=d.getUTCMonth()+k;const a=Date.UTC(y,m,FQDAY[f])+h;if(a+DAY>t) return [a,a+DAY]}}
  if(FQWE[f]){const p=14*DAY,a0=FQWE[f]+h;const n=Math.max(0,Math.ceil((t-a0-FQWE_LEN)/p));const a=a0+n*p;return [a,a+FQWE_LEN]}
  return null}
const dur=ms=>{ms=Math.max(0,ms);const d=Math.floor(ms/DAY),h=Math.floor(ms%DAY/36e5),m=Math.floor(ms%36e5/6e4),s=Math.floor(ms%6e4/1e3);return (d?d+(EN?'d ':' j '):'')+String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')};
const QOPT=[[1,EN?'Normal':'Normale'],[1.25,EN?'Superior':'Supérieure'],[1.5,EN?'Flawless':'Impeccable'],[2,EN?'Epic':'Épique'],[3,EN?'Legendary':'Légendaire']];
const enN=e=>EN?e.name:(e.fr||e.name);
const eList=k=>D.enchants.filter(e=>e.kind===k).sort((a,b)=>b.tier-a.tier||enN(a).localeCompare(enN(b))).map(e=>`<option value="${esc(e.name)}">${esc(enN(e))} · T${e.tier}${k==='element'?' · '+esc(EN?e.element:(ELFR[e.element]||e.element)):''}</option>`).join('');
const eOpts=k=>`<option value="">—</option>`+D.enchants.filter(e=>e.kind===k).sort((a,b)=>b.tier-a.tier||enN(a).localeCompare(enN(b))).map(e=>`<option value="${esc(e.name)}">T${e.tier} ${esc(enN(e))}</option>`).join('');
const gearRow=(id,lab,type)=>`<fieldset class="tgear"><legend>${lab}</legend>
    <div class="ti"><span id="t${id}Ii"></span><select id="t${id}I" aria-label="${lab}"><option value="">${TT.none}</option>${D.items.filter(i=>i.type===type).sort((a,b)=>b.tier-a.tier).map(i=>`<option value="${esc(i.name)}">${esc(nm(i))} · T${i.tier}</option>`).join('')}</select></div>
    <div class="ti"><span id="t${id}Qi"></span><select id="t${id}Q" aria-label="${TT.qual}">${QOPT.map(([v,n])=>`<option value="${v}"${v===3?' selected':''}>${n}</option>`).join('')}</select></div>
    <div class="ti"><span id="t${id}Ei"></span><select id="t${id}E" aria-label="${TT.el}"><option value="">— ${TT.noEl} —</option>${eList('element')}</select></div>
    <div class="ti"><span id="t${id}Si"></span><select id="t${id}S" aria-label="${TT.spirit}"><option value="">— ${TT.noSp} —</option>${eList('spirit')}</select></div></fieldset>`;
function initTeam(){
  if(inited){refreshPresets();tSum();return} inited=true;
  const reg=famList.filter(f=>!byFam[f][0].fl&&f!=='goldcity'), fl=famList.filter(f=>byFam[f][0].fl).sort((a,b)=>(FQDAY[a]||(FQWE[a]?40:99))-(FQDAY[b]||(FQWE[b]?40:99))||fqName(a).localeCompare(fqName(b))), oth=famList.filter(f=>f==='goldcity');
  const og=(lab,arr,fq)=>`<optgroup label="${esc(lab)}">${arr.map(f=>`<option value="${f}">${esc(fq?fqLabel(f):areaName(f))}</option>`).join('')}</optgroup>`;
  const fqLabel=f=>fqName(f)+(FQDAY[f]?` · ${EN?'day':'le'} ${FQDAY[f]}`:FQWE[f]?` · ${EN?'weekend':'week-end'}`:` · ${EN?'event':'événement'}`)+(fqLvl(f)?` · ${EN?'lvl':'niv.'} ${fqLvl(f)}`:'');
  const champOpts=`<option value="">${TT.noChamp}</option>`+Object.entries(SD.champs).map(([u,c])=>`<option value="${u}">${esc(L(c.n))}</option>`).join('');
  const miniOpts=`<option value="">${TT.none}</option>`+['agile','huge','dire','wealthy','epic'].filter(u=>SD.mods[u]).map(u=>`<option value="${u}">${esc((L(SD.mods[u].n)||u).replace('{0}','').trim())}</option>`).join('');
  tm.innerHTML=`<aside class="card">
  <h2>${TT.quest}</h2>
  <label for="tArea">${TT.area}</label><div class="ti"><span id="tAreaI"></span><select id="tArea">${og(TT.areas,reg)}${og(TT.flash,fl,1)}${og(TT.special,oth)}</select></div>
  <label for="tDiff">${TT.diff}</label><select id="tDiff"></select>
  <div class="seg" id="tKind"><button type="button" data-v="0" class="on">${TT.normal}</button><button type="button" data-v="1">${TT.boss}</button></div>
  <div class="row2"><div><label for="tMini">${TT.mini}</label><select id="tMini">${miniOpts}</select></div><div><label for="tBar">${TT.barrier}</label><select id="tBar"></select></div></div>
  <p class="note" id="tQinfo"></p>
  <h2 style="margin-top:18px">${TT.champ}</h2>
  <div class="ti"><span id="tChampI"></span><select id="tChamp" aria-label="${TT.champ}">${champOpts}</select></div>
  <div id="tCSum"></div><button type="button" class="fbtn" id="tCEdit" style="margin-top:8px">${TT.editC}</button>
  <label style="margin-top:8px" id="tBoostL">${TT.booster}</label><input type="hidden" id="tBoost" value=""><div class="seg bseg" id="tBoostSeg" role="group" aria-labelledby="tBoostL">${['si_atk1','si_atk2','si_atk3'].filter(u=>SD.mods[u]).map((u,i)=>{const t=esc(L(SD.mods[u].n)||u)+' : '+modTxt(SD.mods[u]).replace(/<[^>]+>/g,'');return `<button type="button" data-v="${u}" title="${t}" aria-label="${t}" aria-pressed="false">${ta('atkbooster'+(i+1),34)}</button>`}).join('')}</div>
  <h2 style="margin-top:18px">${TT.heroes}</h2><p class="note" id="tParty"></p><div id="tSlots"></div>
  <div class="row2"><div><label for="tN">${TT.sims}</label><select id="tN"><option>200</option><option selected>1000</option><option>5000</option></select></div><div style="display:flex;align-items:flex-end"><button type="button" class="fbtn acc" id="tRun" style="width:100%">${TT.run}</button></div></div>
  <div class="mtools" style="margin-top:8px"><button type="button" id="tBestT">${TT.bestTeam}</button><button type="button" id="tBestC">${TT.bestChamp}</button></div>
  </aside>
  <section class="right"><div class="card" id="tFq"></div><div class="card"><h2>${TT.res}</h2><div id="tRes"><p class="note">${TT.note}</p></div></div><div class="card" id="tExtra" hidden></div></section>`;
  const sel=id=>tm.querySelector('#'+id);
  sel('tArea').addEventListener('change',()=>{fillDiff();upd()});
  // bonus de quête : 3 boutons-icônes ; un 2e clic sur le bouton actif retire le bonus
  sel('tBoostSeg').addEventListener('click',e=>{const b=e.target.closest('button');if(!b) return;const v=sel('tBoost').value===b.dataset.v?'':b.dataset.v;sel('tBoost').value=v;sel('tBoostSeg').querySelectorAll('button').forEach(x=>{const on=x.dataset.v===v;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});upd()});['tDiff','tMini','tBar','tBoost'].forEach(k=>sel(k).addEventListener('change',upd));
  sel('tKind').addEventListener('click',e=>{const b=e.target.closest('button');if(!b) return;sel('tKind').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));upd()});
  sel('tChamp').addEventListener('input',()=>{tSum();upd()});sel('tCEdit').addEventListener('click',()=>{edU=sel('tChamp').value||edU;goTab('champs')});
  sel('tRun').addEventListener('click',()=>go());sel('tBestT').addEventListener('click',bestTeam);sel('tBestC').addEventListener('click',bestChamp);
  fqInit();fillDiff();tSum();refreshPresets();upd();
}
const $t=id=>document.getElementById(id);
function fqInit(){const box=$t('tFq');
  const draw=()=>{const t=Date.now();const L0=Object.keys(SD.names).filter(f=>FQDAY[f]||FQWE[f]).map(f=>{const w=fqNext(f,t);return {f,a:w[0],b:w[1]}}).sort((x,y)=>x.a-y.a);
    const fmtD=ms=>new Date(ms).toLocaleString(EN?'en-GB':'fr-FR',{weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
    box.querySelector('tbody').innerHTML=L0.slice(0,8).map(x=>{const on=x.a<=t;return `<tr class="${on?'fqon':''}"><td><button type="button" class="fqgo" data-f="${x.f}">${areaIco(x.f,26)}<span><b>${esc(fqName(x.f))}</b><span class="alt">${esc(areaName(x.f))}${fqLvl(x.f)?' · '+(EN?'lvl ':'niv. ')+fqLvl(x.f):''}</span></span></button></td><td>${on?`<b class="g5">${TT.fqNow}</b>`:fmtD(x.a)}</td><td class="n"><b>${on?TT.fqLeft+' '+dur(x.b-t):TT.fqIn+' '+dur(x.a-t)}</b></td></tr>`}).join('')};
  // heure UTC → heure locale du jour (suit l'heure d'été et d'hiver)
  const uDay=h=>{const t=new Date();return new Date(Date.UTC(t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate(),h))};
  const hrs=Array.from({length:24},(_,h)=>{const d=uDay(h);return `<option value="${h}">${d.toLocaleTimeString(EN?'en-GB':'fr-FR',{hour:'2-digit',minute:'2-digit'})}</option>`}).join('');
  // fuseau de l'appareil, ex. « Europe/Paris, UTC+1 »
  const tz=(()=>{let n='';try{n=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(x){}const o=-new Date().getTimezoneOffset(),hh=Math.floor(Math.abs(o)/60),mm=Math.abs(o)%60;return (n?n.replace(/_/g,' ')+', ':'')+'UTC'+(o<0?'−':'+')+hh+(mm?':'+String(mm).padStart(2,'0'):'')})();
  const locH=h=>uDay(h).toLocaleTimeString(EN?'en-GB':'fr-FR',{hour:'2-digit',minute:'2-digit'});
  box.innerHTML=`<h2 style="display:flex;gap:8px;align-items:center">${ta('icon_global_flashquest',26)} ${TT.fqTitle}</h2><div class="scroll"><table class="fqt"><thead><tr><th>${TT.quest}</th><th>${TT.fqStart}</th><th class="n">${TT.fqTimer}</th></tr></thead><tbody></tbody></table></div>
   <div class="fqsync"><b>${TT.fqSync}</b><ol>${TT.fqSteps.map(x=>`<li>${x}</li>`).join('')}</ol>
   <div class="fqin"><label><input type="number" id="tFqRh" min="0" max="47" inputmode="numeric" placeholder="7"> ${TT.fqH}</label><label><input type="number" id="tFqRm" min="0" max="59" inputmode="numeric" placeholder="38"> ${TT.fqM}</label><button type="button" id="tFqGo">${TT.fqGo}</button></div>
   <p class="note" id="tFqMsg" role="status"></p></div>
   <div class="fqh"><label for="tFqH">${TT.fqHour} · ${esc(tz)}</label><select id="tFqH">${hrs}</select></div><p class="note">${TT.fqNote}</p>`;
  const setH=h=>{try{localStorage.setItem(FQH_KEY,String(h))}catch(x){}$t('tFqH').value=String(h);draw()};
  $t('tFqMsg').textContent=TT.fqCur.replace('{h}',locH(fqHour())).replace('{z}',tz);
  $t('tFqH').value=String(fqHour());$t('tFqH').addEventListener('change',e=>{setH(+e.target.value);$t('tFqMsg').textContent=TT.fqCur.replace('{h}',locH(fqHour())).replace('{z}',tz)});
  // fin de la quête en cours = maintenant + temps restant ; les quêtes durent des jours entiers, donc l'heure de fin = l'heure de début
  $t('tFqGo').addEventListener('click',()=>{const h=+$t('tFqRh').value||0,m=+$t('tFqRm').value||0;if(!h&&!m){$t('tFqMsg').textContent=TT.fqBad;return}
    const end=Date.now()+(h*60+m)*6e4,hu=Math.round((end%DAY)/36e5)%24;setH(hu);$t('tFqMsg').textContent=TT.fqOk.replace('{h}',locH(hu)).replace('{z}',tz)});
  box.addEventListener('click',e=>{const b=e.target.closest('.fqgo');if(!b) return;$t('tArea').value=b.dataset.f;fillDiff();upd()});
  draw();clearInterval(window.__fqT);window.__fqT=setInterval(()=>{if(!tm.hidden) draw()},1000);}
function curQuest(){const f=$t('tArea').value,d=+$t('tDiff').value,b=+$t('tKind').querySelector('.on').dataset.v;const L0=byFam[f]||[];return L0.find(q=>q.d===d&&q.b===b)||L0.find(q=>q.d===d)||L0[0]}
function fillDiff(){const f=$t('tArea').value,L0=byFam[f]||[],ds=[...new Set(L0.map(q=>q.d))].sort((a,b)=>a-b);
  $t('tDiff').innerHTML=ds.map(d=>`<option value="${d}">${esc(L(SD.txt.diff[d])||('T'+(d+1)))}</option>`).join('');$t('tDiff').value=ds[ds.length-1];
  const hasB=L0.some(q=>q.b);$t('tKind').hidden=!hasB;if(!hasB) $t('tKind').querySelectorAll('button').forEach((x,i)=>x.classList.toggle('on',i===0))}
const CSK='sthc:champstats';const cGet=()=>{try{return JSON.parse(localStorage.getItem(CSK))||{}}catch(e){return {}}};
const CF=['tCRank','tCRe','tCLvl','tCTitan','tCPar','tCCard','tCUse','tCSa','tCSd','tCSh','tFamI','tFamQ','tFamE','tFamS','tAurI','tAurQ','tAurE','tAurS','tCHp','tCAtk','tCDef','tCEva','tCEl'];
const fv=k=>{const e=$t(k);return e.type==='checkbox'?e.checked:e.value};
const CDEF={tCCard:'0',tCPar:false,tCUse:true,tCSa:'0',tCSd:'0',tCSh:'0',tCRank:'11',tCRe:'0',tCLvl:'50',tCTitan:true,tFamQ:'3',tAurQ:'3'};
let edU=Object.keys(SD.champs)[0];
const cfg=u=>({...CDEF,...(cGet()[u]||{})});
const gearCfg=v=>['Fam','Aur'].map(x=>({i:v['t'+x+'I']||'',q:v['t'+x+'Q']||'3',e:v['t'+x+'E']||'',s:v['t'+x+'S']||''}));
// graines d'un champion déduites des stats du jeu : chaque stat dépend d'un seul type de graine (ATQ, DEF, PV), on teste 0 à 80
function seedFit(u){const v=cfg(u),g={atk:+v.tCAtk||0,def:+v.tCDef||0,hp:+v.tCHp||0};if(!g.atk&&!g.def&&!g.hp) return null;
  const sd={atk:+v.tCSa||0,def:+v.tCSd||0,hp:+v.tCSh||0},run=x=>champStats(u,Math.max(1,Math.min(100,+v.tCLvl||1)),+v.tCRank||11,Math.max(0,+v.tCRe||0),!!v.tCTitan,gearCfg(v),x,!!v.tCPar,v.tCCard);
  const out={...sd},gap={};for(const k of ['atk','def','hp']){if(!g[k]) continue;let best=null;
    for(let n=0;n<=80;n++){const d=run({...sd,[k]:n})[k]-g[k];if(!best||Math.abs(d)<Math.abs(best.d)||(Math.abs(d)===Math.abs(best.d)&&n>best.n)) best={n,d}}
    out[k]=best.n;gap[k]=best.d}
  return {s:out,gap}}
// ===== meilleur équipement d'un champion (familier + chant d'aura) =====
// puissance du jeu (Hero.get_Power → Character.CalculatePower) avec la compétence de chef du champion et son chant d'aura comme modificateurs
// vérifié sur Maladie : 35 516 (ATQ ×1,3, crit +10 %, esquive +15 %, dégâts crit +0,25)
function champPower(u,s,aMod,threatAdd){const c=SD.champs[u],m=SD.mods[c.sk[s.sk-1]]||{},a=aMod||{},g=k=>(+m[k]||0)+(+a[k]||0);
  const atk=s.atk*(1+g('atk')),def=s.def*(1+g('def')),hp=s.hp*(1+g('hp')),e=Math.min(0.75,s.eva+g('evasion')),cr=s.crit+g('critical'),cm=s.cm+g('critMult'),th=(c.aggro||0)+(threatAdd||0);
  const ap=atk*(1+cr*(cm-1))*0.8,dp=th*hp/(1-e)*0.025+th*def*0.008+hp/(1-e)*5+def*1.2;return Math.round(ap+dp)}
const auraModI=n=>{const g=n&&GM&&GM.items&&GM.items[n];const id=g&&g.uid;return id&&SD.mods[id]&&SD.mods[id].isAurastone?SD.mods[id]:null};
function bestGear(u,mode,q,maxT){const v=cfg(u),c=SD.champs[u],lvl=Math.max(1,Math.min(100,+v.tCLvl||1)),rank=+v.tCRank||11,re=Math.max(0,+v.tCRe||0),tit=!!v.tCTitan,par=!!v.tCPar,seeds={atk:v.tCSa,def:v.tCSd,hp:v.tCSh};
  const run=g=>champStats(u,lvl,rank,re,tit,g,seeds,par,v.tCCard),b0=run([]);if(!b0) return null;
  const Cap=x=>x?x[0].toUpperCase()+x.slice(1):x,cEl=Cap(c.el);
  const cls={name:'Champion',family:famOf(c.cls),element:cEl,crit:c.cr,critDmg:c.cm,eva:c.eva,threat:c.aggro,slots:[],skillUnlock:[]};
  const ctx={cls,lvl,maxT:16,base:b0.base,card:1,trans:0,star:false,q:+q,eT:16,goldWild:false,obj:'power',nSlots:0,innate:null,fams:[]};
  const els=D.enchants.filter(e=>e.kind==='element'&&e.tier<=maxT),best={};for(const e of els) if(!best[e.element]||e.tier>best[e.element].tier) best[e.element]=e;
  const elems=Object.values(best).sort((a,b)=>(b.element===cEl)-(a.element===cEl)),spir=D.enchants.filter(e=>e.kind==='spirit'&&e.tier<=maxT);
  // options distinctes d'un objet : même stats, même élément compté, même menace → une seule option
  const opts=it=>{const o=[],seen=new Set();for(const e of it.builtElem?[null]:[null,...elems]) for(const sp of it.builtSpirit?[null]:[null,...spir]){let pk;try{pk=makePick(ctx,it.name,e&&e.name,sp&&sp.name)}catch(x){continue}
      const x=pk.sfx||{},r={i:it.name,e:e?e.name:'',s:sp?sp.name:'',a:Math.round(pk.st.atk),d:Math.round(pk.st.def_),h:Math.round(pk.st.hp),ev:(pk.eva||0)+(x.eva||0)/100,el:pk.val||0,th:pk.s.threat||0,pa:(x.atkP||0)/100,pd:(x.defP||0)/100,ph:(x.hpP||0)/100,cr:(x.crit||0)/100};const k=[r.a,r.d,r.h,r.ev,r.el,r.th,r.pa,r.pd,r.ph,r.cr].join();if(!seen.has(k)){seen.add(k);o.push(r)}}return o};
  const fams=D.items.filter(i=>i.type==='Familiar').flatMap(opts);let aur=D.items.filter(i=>i.type==='Aurasong');
  if(mode===2){const tm=n=>{const m=auraModI(n);return m&&m.time?m.time:1};const mn=Math.min(...aur.map(i=>tm(i.name)));aur=aur.filter(i=>tm(i.name)===mn)}
  const aurs=aur.flatMap(opts),cf=b0.base&&(+[1,1.05,1.10,1.25][+v.tCCard||0]||1),elB=b0.el;
  // tri rapide (approché), puis calcul exact des meilleurs
  const fast=(f,a)=>{const am=auraModI(a.i),s={atk:(b0.base.atk+f.a+a.a)*cf*(1+f.pa+a.pa),def:(b0.base.def+f.d+a.d)*cf*(1+f.pd+a.pd),hp:(b0.base.hp+f.h+a.h)*cf*(1+f.ph+a.ph),eva:c.eva+f.ev+a.ev,crit:c.cr+f.cr+a.cr,cm:c.cm,sk:b0.sk};const p=champPower(u,s,am,f.th+a.th);return {p,el:elB+f.el+a.el}};
  const exact=(g,am,th)=>{const s=run(g);return s?{s,p:champPower(u,s,am,th),el:s.el}:null};
  // meilleurs candidats (tri rapide), puis calcul exact ; minEl : élément minimum exigé
  const pick=(sc,minEl)=>{const top=[];for(const f of fams) for(const a of aurs){const r=fast(f,a);if(minEl!=null&&r.el<minEl) continue;const x=sc(r);if(top.length<25||x>top[top.length-1].x){top.push({f,a,x});top.sort((p,q)=>q.x-p.x);if(top.length>25) top.pop()}}
    let res=null;for(const t of top){const g=[{i:t.f.i,q,e:t.f.e,s:t.f.s},{i:t.a.i,q,e:t.a.e,s:t.a.s}],r=exact(g,auraModI(t.a.i),t.f.th+t.a.th);if(!r||(minEl!=null&&r.el<minEl)) continue;const x=sc(r);if(!res||x>res.x) res={...r,x,g}}return res};
  const res=pick(r=>mode===1?r.el*1e7+r.p:r.p);
  // briseur de barrière : variante avec un peu moins d'élément (au plus −10) mais plus de puissance (ex. affinité « tous éléments », bonus d'élément ×0,5)
  let alt=null;if(mode===1&&res){const a2=pick(r=>r.p,res.el-10);if(a2&&a2.p>res.p&&a2.el<res.el) alt=a2}
  const cur=gearCfg(v),curS=run(cur),curTh=cur.reduce((n,g)=>{const e=g.s&&ENCH[g.s];return n+(e?(+e.threat||0):0)},0);
  if(curS&&v.tCUse){const o=(k,f)=>{if(v[k]!=null&&v[k]!=='') curS[f]=k==='tCEva'?+v[k]/100:+v[k]};o('tCHp','hp');o('tCAtk','atk');o('tCDef','def');o('tCEva','eva');o('tCEl','el')}
  return {best:res,alt,cur:curS?{s:curS,p:champPower(u,curS,auraModU(u),curTh),el:curS.el,g:cur}:null}}
const cfgStats=u=>{const v=cfg(u);return champStats(u,Math.max(1,Math.min(100,+v.tCLvl||1)),+v.tCRank||11,Math.max(0,+v.tCRe||0),!!v.tCTitan,gearCfg(v),{atk:v.tCSa,def:v.tCSd,hp:v.tCSh},!!v.tCPar,v.tCCard)};
const auraModU=u=>{const n=cfg(u).tAurI;const g=n&&GM&&GM.items&&GM.items[n];const id=g&&g.uid;return id&&SD.mods[id]&&SD.mods[id].isAurastone?SD.mods[id]:null};
const isSaved=u=>!!cGet()[u];
function champLoad(u){const v=cfg(u);CF.forEach(k=>{const e=$t(k),x=v[k]!=null?v[k]:'';if(e.type==='checkbox') e.checked=!!x;else e.value=x})}
function champSave(){const u=edU;if(!u) return;const a=cGet();a[u]={};CF.forEach(k=>{const x=fv(k);if(x!=='') a[u][k]=x});try{localStorage.setItem(CSK,JSON.stringify(a))}catch(e){}}
const QIC={'1':'q_common','1.25':'q_uncommon','1.5':'q_flawless','2':'q_epic','3':'q_legendary'};
function gearIcons(){for(const x of ['Fam','Aur']){const it=ITEM[$t('t'+x+'I').value];$t('t'+x+'Ii').innerHTML=it?icoItem(it,36):'';$t('t'+x+'Qi').innerHTML=ui(QIC[$t('t'+x+'Q').value]||'q_legendary',30);
  for(const k of ['E','S']){const e=ENCH[$t('t'+x+k).value];$t('t'+x+k+'i').innerHTML=e?icoItem(e,36):''}}}
// résumé d'un champion (stats calculées ou corrigées, compétence de chef, chant d'aura)
// puissance du champion avec sa config (valeurs du jeu si cochées), compétence de chef et chant d'aura compris
function cfgPower(u){const v=cfg(u),s={...cfgStats(u)};if(v.tCUse){const o=(k,f)=>{if(v[k]!=null&&v[k]!=='') s[f]=k==='tCEva'?+v[k]/100:+v[k]};o('tCHp','hp');o('tCAtk','atk');o('tCDef','def');o('tCEva','eva')}
  const th=gearCfg(v).reduce((n,g)=>{const e=g.s&&ENCH[g.s];return n+(e?(+e.threat||0):0)},0);return champPower(u,s,auraModU(u),th)}
function champSummary(u,big){const c=SD.champs[u],v=cfg(u),s=cfgStats(u),m=SD.mods[c.sk[s.sk-1]],am=auraModU(u);
  const o=k=>!!v.tCUse&&v[k]!=null&&v[k]!=='';const val=(k,d)=>o(k)?+v[k]:d;const ov=['tCHp','tCAtk','tCDef','tCEva','tCEl'].some(o);
  const gp=ov?maxGap(u):null;
  return `${ov&&!(gp!=null&&gp<1)?`<b class="g2">${TT.ovOn}</b><br>`:''}<span class="cstat"><span class="sr">${TT.calc} :</span><span class="cst cpow" title="${TT.opPow}">${ui('power',18)}<b>${fmt(cfgPower(u))}</b></span> <span class="cst">${ui('hp',18)}${fmt(val('tCHp',s.hp))}</span> <span class="cst">${ui('atk',18)}${fmt(val('tCAtk',s.atk))}</span> <span class="cst">${ui('defense',18)}${fmt(val('tCDef',s.def))}</span> <span class="cst">${ui('eva',18)}${Math.round(val('tCEva',s.eva*100))} %</span> <span class="cst">${ui('icon_global_element_'+c.el,18)}${fmt(val('tCEl',s.el))}</span></span>`+
   (big?`<div class="lead">${ta('icon_global_skill_hero_'+c.sk[s.sk-1],32)}<span>${TT.skill} ${s.sk}/5${m?' · <b>'+esc(L(m.n)||'')+'</b> : '+modTxt(m):''}</span></div>${am?`<div class="lead">${icoItem(ITEM[v.tAurI],32)}<span><b>${esc(L(am.n)||'')}</b> : ${modTxt(am)}</span></div>`:''}`:'')}
function champFill(){const u=edU;gearIcons();
  const s=cfgStats(u);
  $t('tCAtk').placeholder=s.atk;$t('tCDef').placeholder=s.def;$t('tCHp').placeholder=s.hp;$t('tCEva').placeholder=Math.round(s.eva*100);$t('tCEl').placeholder=s.el;
  $t('tCLvl').max=$t('tCPar').checked?100:50;
  $t('cCmp').innerHTML=cmpTable(u);
  $t('tCInfo').innerHTML=champSummary(u,true);$t('cTitle').innerHTML=`${ta('icon_global_'+u,40)} <span>${esc(L(SD.champs[u].n))}</span>`;cList()}
// écart entre le calcul et les stats du jeu (vert : moins de 1 %)
const CMPK=[['tCHp','hp',EN?'HP':'PV','hp'],['tCAtk','atk','ATK','atk'],['tCDef','def','DEF','defense'],['tCEva','eva',TT.eva,'eva'],['tCEl','el',TT.el,null]];
function cmpRows(u){const v=cfg(u),s=cfgStats(u);return CMPK.filter(([k])=>v[k]!=null&&v[k]!=='').map(([k,f,l,ic])=>{const g=+v[k],c=f==='eva'?Math.round(s.eva*100):s[f],d=g?(c-g)/g*100:(c?100:0);return {l,ic,f,g,c,d}})}
const maxGap=u=>{const r=cmpRows(u);return r.length?Math.max(...r.map(x=>Math.abs(x.d))):null};
function cmpTable(u){const r=cmpRows(u);if(!r.length) return '';const fx=x=>(x.d>=0?'+':'')+x.d.toFixed(1).replace('.',EN?'.':',')+' %';
  return `<table class="ccmp"><thead><tr><th></th><th class="n">${TT.calcS}</th><th class="n">${TT.gameS}</th><th class="n">${TT.gap}</th></tr></thead><tbody>${r.map(x=>`<tr><td>${x.ic?ui(x.ic,18):ui('icon_global_element_'+SD.champs[u].el,18)} ${x.l}</td><td class="n">${fmt(x.c)}${x.f==='eva'?' %':''}</td><td class="n">${fmt(x.g)}${x.f==='eva'?' %':''}</td><td class="n"><b class="${Math.abs(x.d)<1?'g5':Math.abs(x.d)<5?'g3':'g1'}">${fx(x)}</b></td></tr>`).join('')}</tbody></table>`}
function cList(){const box=$t('cList');if(!box) return;box.innerHTML=Object.keys(SD.champs).map(u=>{const v=cfg(u);return `<button type="button" class="cbtn${u===edU?' on':''}" data-u="${u}" aria-pressed="${u===edU}">${ta('icon_global_'+u,40)}<span><b>${esc(L(SD.champs[u].n))}</b><span class="alt">${isSaved(u)?`${TT.rank} ${v.tCRank}${+v.tCRe?' +'+v.tCRe:''} · ${TT.lvl} ${v.tCLvl}${+v.tCCard?' · '+TT.cards[+v.tCCard].replace(/ \(.*\)/,''):''}${v.tCTitan?' · '+TT.titan:''}${v.tCPar?' · '+TT.parag:''}`:TT.notSet}</span><span class="alt">${champSummary(u)}</span>${maxGap(u)!=null?`<span class="alt">${TT.gap} max : <b class="${maxGap(u)<1?'g5':maxGap(u)<5?'g3':'g1'}">${maxGap(u).toFixed(1).replace('.',EN?'.':',')} %</b></span>`:''}</span></button>`}).join('')}
let cInited=false;
function initChamps(){if(cInited){champLoad(edU);champFill();return} cInited=true;
  cm.innerHTML=`<aside class="card"><h2>${TT.tabChamps}</h2><p class="note">${TT.cHelp}</p><div class="mtools"><button type="button" id="cExp">${TT.bkExp}</button><label class="fbtn">${TT.bkImp}<input type="file" id="cImp" accept=".json,application/json" hidden></label></div><p class="note" style="margin:0 0 8px">${TT.bkHelp}</p><p id="cBkMsg" class="note" role="status" style="margin:0 0 8px"></p><div id="cList" class="clist"></div></aside>
  <section class="right"><div class="card"><h2 id="cTitle" class="ctitle"></h2>
  <div class="row2"><div><label for="tCRank">${TT.rank}</label><select id="tCRank">${Array.from({length:11},(_,i)=>`<option value="${i+1}"${i===10?' selected':''}>${i+1}</option>`).join('')}</select></div>
  <div><label for="tCRe">${TT.reinf}</label><input id="tCRe" type="number" min="0" max="999" value="0"></div>
  <div><label for="tCLvl">${TT.lvl}</label><input id="tCLvl" type="number" min="1" max="100" value="50"></div><div class="chk2"><label class="chk tit" for="tCTitan"><input type="checkbox" id="tCTitan" checked>${ta('championtitansoul',28)}<span>${TT.titan}</span></label><label class="chk tit" for="tCPar"><input type="checkbox" id="tCPar">${ui('paragonsoul',28)}<span>${TT.parag}</span></label></div></div>
  <label for="tCCard" style="margin-top:8px">${ui('icon_global_collection_book_small',20)} ${TT.card}</label><select id="tCCard">${TT.cards.map((n,i)=>`<option value="${i}">${n}</option>`).join('')}</select>
  <p class="note" style="margin:10px 0 0">${TT.seeds}</p><div class="row3"><div><label for="tCSa">${ui('seedattack1',20)} ATK</label><input id="tCSa" type="number" min="0" max="80" value="0"></div><div><label for="tCSd">${ui('seeddef1',20)} DEF</label><input id="tCSd" type="number" min="0" max="80" value="0"></div><div><label for="tCSh">${ui('seedhp1',20)} ${EN?'HP':'PV'}</label><input id="tCSh" type="number" min="0" max="80" value="0"></div></div>
  ${gearRow('Fam',TT.fam,'Familiar')}${gearRow('Aur',TT.aura,'Aurasong')}
  <div id="tCInfo" class="cinfo"></div>
  <fieldset class="tgear"><legend>${TT.cmpT}</legend><p class="note" style="margin:0 0 6px">${TT.cmpH}</p><div class="row4" style="grid-template-columns:repeat(auto-fit,minmax(78px,1fr))"><div><label for="tCHp">${ui('hp',18)} ${EN?'HP':'PV'}</label><input id="tCHp" type="number" min="0"></div><div><label for="tCAtk">${ui('atk',18)} ATK</label><input id="tCAtk" type="number" min="0"></div><div><label for="tCDef">${ui('defense',18)} DEF</label><input id="tCDef" type="number" min="0"></div><div><label for="tCEva">${ui('eva',18)} ${TT.eva} %</label><input id="tCEva" type="number" min="0" max="100"></div><div><label for="tCEl">${TT.el}</label><input id="tCEl" type="number" min="0"></div></div>
  <label class="chk" style="margin-top:8px" for="tCUse"><input type="checkbox" id="tCUse" checked> ${TT.useG}</label><div id="cCmp"></div><div class="mtools"><button type="button" id="cSeedFit">${ui('seedattack1',18)} ${TT.sfBtn}</button></div><p class="note" style="margin:0">${TT.sfHelp}</p><p id="cSeedMsg" class="note" role="status" style="margin:4px 0 0"></p></fieldset>
  <p class="note">${TT.savedAuto}</p></div>
  <div class="card"><h2>${TT.opTitle}</h2><p class="note">${TT.opHelp}</p>
  <label>${TT.opMode}</label><div class="seg" id="opMode" role="group">${TT.opModes.map((n,i)=>`<button type="button" data-m="${i}" class="${i?'':'on'}" aria-pressed="${!i}">${n}</button>`).join('')}</div><p class="note" id="opModeH" style="margin:6px 0 8px">${TT.opModeH[0]}</p>
  <div class="row2"><div><label for="opQ">${TT.opQ}</label><select id="opQ">${[['1','q_common'],['1.25','q_uncommon'],['1.5','q_flawless'],['2','q_epic'],['3','q_legendary']].map(([v],i)=>`<option value="${v}"${v==='3'?' selected':''}>${(EN?['Common','Uncommon','Flawless','Epic','Legendary']:['Commune','Peu commune','Sans défaut','Épique','Légendaire'])[i]}</option>`).join('')}</select></div>
  <div><label for="opT">${TT.opT}</label><select id="opT">${[16,15,14,13,12,11,10,9,8].map(t=>`<option value="${t}"${t===14?' selected':''}>T${t}</option>`).join('')}</select></div></div>
  <div class="mtools"><button type="button" id="opRun">${TT.opRun}</button></div><p id="opMsg" class="note" role="status"></p><div id="opOut"></div></div></section>`;
  // sauvegarde complète : toutes les clés sthc:* du navigateur (champions, presets de héros, réglages)
  // données du Google Sheet en cache : pas des réglages, trop gros pour la sauvegarde
  const BKSKIP=['sthc:sheet','sthc:meta'];
  const bkMsg=t=>{const e=$t('cBkMsg');if(e) e.textContent=t};
  $t('cExp').addEventListener('click',()=>{const d={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('sthc:')&&!BKSKIP.includes(k)) d[k]=localStorage.getItem(k)}
    const P=k=>{try{return JSON.parse(d[k])}catch(x){return null}};
    const j={tool:'ST Hero Calculator',version:'/*VERSTR*/',date:new Date().toISOString(),raw:true,data:d,presets:P('sthc:presets')||[],champions:P('sthc:champstats')||{}};
    const blob=new Blob([JSON.stringify(j,null,1)],{type:'application/json'}),url=URL.createObjectURL(blob),l=document.createElement('a');l.href=url;l.download='sthc-sauvegarde-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
    bkMsg(TT.bkOk+Object.keys(j.champions).length+' champion(s), '+(Array.isArray(j.presets)?j.presets.filter(Boolean).length:0)+' preset(s), '+Object.keys(d).length+TT.bkKeys)});
  $t('cImp').addEventListener('change',async e=>{const f=e.target.files[0];e.target.value='';if(!f) return;
    try{const j=JSON.parse(await f.text());let d=j&&j.data&&typeof j.data==='object'?j.data:null;
      if(!d){d={};if(Array.isArray(j.presets)) d['sthc:presets']=j.presets;else if(Array.isArray(j)) d['sthc:presets']=j;if(j.champions&&typeof j.champions==='object') d['sthc:champstats']=j.champions}
      const ks=Object.keys(d).filter(k=>k.startsWith('sthc:')&&!BKSKIP.includes(k));if(!ks.length) throw 0;if(!confirm(TT.bkAsk)) return;
      ks.forEach(k=>{const v=d[k];localStorage.setItem(k,j.raw&&typeof v==='string'?v:JSON.stringify(v))});bkMsg(TT.bkIn);setTimeout(()=>location.reload(),600)}
    catch(err){bkMsg(TT.bkBad)}});
  $t('cSeedFit').addEventListener('click',()=>{const u=edU,m=$t('cSeedMsg');if(!u) return;const r=seedFit(u);if(!r){m.textContent=TT.sfNone;return}
    $t('tCSa').value=r.s.atk;$t('tCSd').value=r.s.def;$t('tCSh').value=r.s.hp;champSave();champFill();
    const lab={atk:'ATK',def:'DEF',hp:EN?'HP':'PV'},gp=Object.keys(r.gap).filter(k=>r.gap[k]);
    m.textContent=TT.sfOk+`ATK ${r.s.atk}, DEF ${r.s.def}, ${lab.hp} ${r.s.hp}. `+(gp.length?TT.sfNear+gp.map(k=>`${lab[k]} ${r.gap[k]>0?'+':''}${r.gap[k]}`).join(', ')+'.':TT.sfExact)});
  let opM=0;
  $t('opMode').addEventListener('click',e=>{const b=e.target.closest('button');if(!b) return;opM=+b.dataset.m;$t('opMode').querySelectorAll('button').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)});$t('opModeH').textContent=TT.opModeH[opM]});
  const gTxt=g=>g.map(x=>x.i&&ITEM[x.i]?`<span class="opg">${icoItem(ITEM[x.i],28)}<span><b>${esc(nm(ITEM[x.i]))}</b>${x.e&&ENCH[x.e]?'<span class="ope">'+icoItem(ENCH[x.e],24)+'<span>'+esc(nm(ENCH[x.e]))+'</span></span>':''}${x.s&&ENCH[x.s]?'<span class="ope">'+icoItem(ENCH[x.s],24)+'<span>'+esc(nm(ENCH[x.s]))+'</span></span>':''}</span></span>`:`<span class="opg alt">${TT.opNone}</span>`).join('');
  let opRes={};
  $t('opRun').addEventListener('click',()=>{const m=$t('opMsg'),o=$t('opOut'),q=$t('opQ').value,t=+$t('opT').value;m.textContent=TT.busy;o.innerHTML='';
    setTimeout(()=>{const t0=performance.now();opRes={};const rows=Object.keys(SD.champs).map(u=>{const r=bestGear(u,opM,q,t);opRes[u]=r;if(!r||!r.best) return '';const b=r.best,c=r.cur,am=auraModI(b.g[1].i);
      const d=c?b.p-c.p:0;return `<tr><td>${ta('icon_global_'+u,36)}<br><b>${esc(L(SD.champs[u].n))}</b></td><td>${gTxt(b.g)}${am?`<div class="alt" style="font-size:12px">${modTxt(am)}</div>`:''}</td>
        <td><b>${fmt(b.p)}</b>${c?`<br><span class="alt">${TT.opNow} ${fmt(c.p)}</span><br><b class="${d>0?'g5':'g3'}">${d>0?'+':''}${fmt(d)}</b>`:''}</td><td><b>${fmt(b.el)}</b>${c?`<br><span class="alt">${TT.opNow} ${fmt(c.el)}</span>`:''}</td>
        <td>${fmt(b.s.hp)} / ${fmt(b.s.atk)} / ${fmt(b.s.def)}</td><td><button type="button" class="opAp" data-u="${u}">${TT.opApply}</button></td></tr>`+(r.alt?(()=>{const x=r.alt,ax=auraModI(x.g[1].i);return `<tr class="opalt"><td class="alt">${TT.opAlt}</td><td>${gTxt(x.g)}${ax?`<div class="alt" style="font-size:12px">${modTxt(ax)}</div>`:''}</td>
        <td><b>${fmt(x.p)}</b><br><b class="g5">+${fmt(x.p-b.p)}</b></td><td><b>${fmt(x.el)}</b><br><b class="g2">${fmt(x.el-b.el)}</b></td><td>${fmt(x.s.hp)} / ${fmt(x.s.atk)} / ${fmt(x.s.def)}</td><td><button type="button" class="opAp" data-u="${u}" data-alt="1">${TT.opApply}</button></td></tr>`})():'')}).join('');
      o.innerHTML=`<div class="tscroll"><table class="optab"><thead><tr><th>${TT.champ}</th><th>${TT.fam} · ${TT.aura}</th><th>${TT.opPow}</th><th>${TT.el}</th><th>${EN?'HP':'PV'} / ATK / DEF</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;
      m.textContent=`${TT.opModes[opM]} · ${(performance.now()-t0)/1000<1?'<1':Math.round((performance.now()-t0)/1000)} s`},30)});
  $t('opOut').addEventListener('click',e=>{const b=e.target.closest('.opAp');if(!b) return;const u=b.dataset.u,r=opRes[u];if(!r||!r.best) return;const a=cGet(),c={...(a[u]||{})};
    const [f,au]=(b.dataset.alt?r.alt:r.best).g;Object.assign(c,{tFamI:f.i,tFamQ:f.q,tFamE:f.e,tFamS:f.s,tAurI:au.i,tAurQ:au.q,tAurE:au.e,tAurS:au.s});a[u]=c;try{localStorage.setItem(CSK,JSON.stringify(a))}catch(x){}
    if(edU===u){champLoad(u);champFill()}else cList();b.textContent='✓';$t('opMsg').textContent=TT.opApplied});
  cm.querySelector('#cList').addEventListener('click',e=>{const b=e.target.closest('.cbtn');if(!b) return;edU=b.dataset.u;$t('cSeedMsg').textContent='';champLoad(edU);champFill()});
  CF.forEach(k=>{const e=$t(k);const f=()=>{champSave();champFill()};e.addEventListener('input',f);e.addEventListener('change',f)});
  champLoad(edU);champFill();}
function tSum(){const u=$t('tChamp').value;$t('tChampI').innerHTML=u?ta('icon_global_'+u,36):'';$t('tCSum').innerHTML=u?`<p class="note">${isSaved(u)?'':`<b class="g2">${TT.notSet}</b> · `}${TT.rank} ${cfg(u).tCRank}${+cfg(u).tCRe?' +'+cfg(u).tCRe:''} · ${TT.lvl} ${cfg(u).tCLvl}</p>`+champSummary(u,true):'';$t('tCEdit').hidden=!u}
function modTxt(m){const o=[];const P=(k,l)=>{if(m[k]) o.push(`${m[k]>0?'+':''}${Math.round(m[k]*100)} % ${l}`)};
  P('atk','ATK');P('def','DEF');P('hp',EN?'HP':'PV');P('evasion',EN?'evasion':'esquive');P('critical','crit');P('critMult',EN?'crit dmg':'dégâts crit');
  if(m.time&&m.time!==1) o.push(`−${Math.round((1-m.time)*100)} % ${TT.opTime}`);if(m.rest&&m.rest!==1) o.push(`−${Math.round((1-m.rest)*100)} % ${TT.opRest}`);if(m.xp) o.push(`+${Math.round(m.xp*100)} % XP`);if(m.regen) o.push(`+${m.regen} ${EN?'HP/round':'PV/tour'}`);if(m.barrierPowerMult&&m.barrierPowerMult!==1) o.push(`×${m.barrierPowerMult} ${TT.power}`);if(m.bossMult&&m.bossMult!==1) o.push(`×${m.bossMult} boss`);if(m.FlashQuestModMult&&m.FlashQuestModMult!==1) o.push(`×${m.FlashQuestModMult} ${EN?'flash':'éclair'}`);
  return o.map(x=>`<span class="nw">${x}</span>`).join(', ')}
function refreshPresets(){const a=plist(),n=partySize();
  const opts=`<option value="">${TT.pick}</option>`+a.map((p,i)=>p?`<option value="${i}">${i+1}. ${esc(p.name||'?')} · ${esc(nm(D.classes.find(c=>c.name===p.cls))||p.cls)}</option>`:'').join('');
  const old=[...tm.querySelectorAll('.tslot select')].map(s=>s.value);
  $t('tSlots').innerHTML=a.some(Boolean)?Array.from({length:n},(_,k)=>`<div class="tslot"><b>${k+1}</b><select data-s="${k}" aria-label="${TT.heroes} ${k+1}">${opts}</select><span class="tpow" data-s="${k}"></span></div>`).join('')+`<p class="note tptot" id="tPowTot"></p>`:`<p class="note">${TT.noPreset}</p>`;
  tm.querySelectorAll('.tslot select').forEach((s,k)=>{if(old[k]!=null) s.value=old[k];s.addEventListener('change',slotPow)});slotPow();}
// puissance de chaque membre : valeur du jeu enregistrée dans le preset, sinon le calcul (≈)
function slotPow(){const pre=plist();let tot=0,n=0;tm.querySelectorAll('.tslot select').forEach(s=>{const sp=tm.querySelector(`.tpow[data-s="${s.dataset.s}"]`);if(!sp) return;
    if(s.value===''){sp.innerHTML='';return}const p=pre[+s.value];if(!p){sp.innerHTML='';return}
    const g=+(p.game&&String(p.game.gPow||'').replace(/[^\d]/g,''))||0;let v=g,t=TT.powGame;if(!g){const f=fighterFromPreset(p);v=f&&f.pw?Math.round(f.pw):0;t=TT.powCalc}
    sp.innerHTML=v?`${ui('power',16)}<b>${g?'':'≈ '}${fmt(v)}</b>`:'';sp.title=t;if(v){tot+=v;n++}});
  const e=$t('tPowTot');if(e) e.innerHTML=n>1?`${TT.powTot} : ${ui('power',16)}<b>${fmt(tot)}</b>`:''}
function partySize(){const q=curQuest();return Math.max(1,(q?q.p:4)-($t('tChamp').value?1:0))}
function upd(){const q=curQuest();if(!q) return;$t('tAreaI').innerHTML=areaIco(q.f,36);
  const bel=q.el||[];$t('tBar').innerHTML=bel.length?bel.map(e=>`<option value="${e}">${esc(L(ELN[e])||e)}</option>`).join(''):`<option value="">${TT.none}</option>`;$t('tBar').disabled=!bel.length;
  $t('tMini').disabled=!!(q.b||q.fl||!q.mb);if($t('tMini').disabled) $t('tMini').value='';
  $t('tQinfo').innerHTML=`${esc(L(SD.names[q.f]&&(q.b?SD.names[q.f].boss:SD.names[q.f].mob)))} · ${EN?'HP':'PV'} ${fmt(q.hp)} · ${EN?'damage':'dégâts'} ${fmt(q.dmg)} (${EN?'area':'zone'} ${fmt(q.aoe)}, ${pc(q.ao)}) · ${EN?'target DEF':'DEF cible'} ${fmt(q.td)} · crit ${pc(q.cr)} ×${q.cm}${q.acc?` · ${EN?'accuracy':'précision'} ${pc(q.acc)}`:''}${q.bp?` · ${TT.barrier} ${fmt(q.bp)}`:''}`;
  $t('tParty').textContent=`${TT.party} ${q.p} ${TT.slots}${$t('tChamp').value?' (1 = '+TT.champ.toLowerCase()+')':''}.`;
  refreshPresets();}
function champFighter(u){u=u||$t('tChamp').value;if(!u) return null;const c=SD.champs[u],s=cfgStats(u),v=cfg(u);
  const val=(k,d)=>v.tCUse&&v[k]!=null&&v[k]!==''?+v[k]:d;
  return {pw:cfgPower(u),name:L(c.n),cname:TT.champ,cls:'champion',family:famOf(c.cls),gcls:c.cls,champ:u,hemma:u==='hemma',
    atk:val('tCAtk',s.atk),def:val('tCDef',s.def),hp:val('tCHp',s.hp),crit:s.crit,cm:s.cm,eva:val('tCEva',s.eva*100)/100,aggro:c.aggro,el:val('tCEl',s.el),elem:c.el,
    aBr:1,dBr:1,card:1,bossA:0,bossD:1,shark:0,dino:0,maxEva:cn0('quest_evasion_max',0.75),survive:0,regen:0,champB:0,leader:SD.mods[c.sk[s.sk-1]],aura:auraModU(u)}}
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
  $t('tRes').innerHTML=`<div class="kpi"><div><span>${ta('icon_global_trophy_s',18)} ${TT.win}</span><b>${pc(r.win)}</b>${bar(r.win)}</div><div><span>${ta('icon_global_clock',18)} ${TT.rounds}</span><b>${r.rounds?r.rounds.toFixed(1).replace('.',EN?'.':','):'—'}</b><span>${r.minR?r.minR+'–'+r.maxR:''}</span></div><div><span>${ta('icon_global_class_monster',18)} ${TT.mhp}</span><b>${fmt(r.mHp)}</b><span>${TT.prog} : ${pc(r.prog)}</span></div>${q.bp?`<div><span>${ta('icon_global_barrier_'+opts.bel,18)||ui('icon_global_element_'+opts.bel,18)} ${TT.barrier} (${esc(L(ELN[opts.bel])||'')})</span><b class="${pw>=q.bp?'g5':'g1'}">${fmt(pw)} / ${fmt(q.bp)}</b><span>${pw>=q.bp?TT.shatter:TT.notShatter}</span></div>`:''}</div>
  <div class="scroll"><table><thead><tr><th>${ta('icon_global_heroes',18)} ${TT.heroes}</th><th class="n">${ui('power',18)} ${TT.opPow}</th><th class="n">${ui('atk',18)} ATK</th><th class="n">${ui('defense',18)} DEF</th><th class="n">${ui('hp',18)} ${EN?'HP':'PV'}</th><th class="n">${ta('icon_global_critchance',18)} ${TT.crit}</th><th class="n">${ui('eva',18)} ${TT.eva}</th><th class="n">${ta('icon_tomb_modifier_hate',18)} ${TT.thr}</th><th class="n">${ta('icon_tomb_modifier_powerful',18)} ${TT.dmg}</th><th class="n">${ta('icon_global_health_risk_small',18)} ${TT.death}</th><th>${TT.grade}</th></tr></thead><tbody>${party.map((h,k)=>`<tr><td>${h.ic?icoClass(h.ic,28):h.champ?ta('icon_global_'+h.champ,28):''} <b>${esc(h.name)}</b><div class="alt">${esc(h.cname)}</div></td><td class="n" title="${h.gpw?TT.powGame:TT.powCalc}">${(h.gpw||h.pw)?`<b>${h.gpw?'':'≈ '}${fmt(Math.round(h.gpw||h.pw))}</b>`:'—'}</td><td class="n">${fmt(h.atk)}</td><td class="n">${fmt(h.def)}</td><td class="n">${fmt(h.hp)}</td><td class="n">${Math.round(h.crit*100)} %</td><td class="n">${Math.round(h.eva*100)} %</td><td class="n">${fmt(h.aggro)}</td><td class="n">${fmt(r.dmg[k])}<div class="alt">${pc(r.dmg[k]/tot)}</div></td><td class="n">${pc(r.death[k])}</td><td>${face(r.grade[k])}</td></tr>`).join('')}</tbody></table></div>
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
  box.innerHTML=`<h2>${TT.topTeams}</h2><p class="note">${C.length} ${TT.combos} · ${n} ${TT.sims.toLowerCase()}</p><div class="scroll"><table><thead><tr><th>#</th>${ch?`<th>${TT.champ}</th>`:''}<th>${ta('icon_global_heroes',18)} ${TT.heroes}</th><th class="n">${ta('icon_global_trophy_s',18)} ${TT.win}</th><th class="n">${ta('icon_global_clock',18)} ${TT.rounds}</th><th class="n">${ta('icon_global_class_monster',18)} ${TT.prog}</th><th class="n">${ta('icon_global_health_risk_small',18)} ${TT.death} max</th></tr></thead><tbody>${res.slice(0,10).map((x,i)=>`<tr><td>${i+1}</td>${ch?`<td><span class="tmem">${ta('icon_global_'+ch.champ,24)}${esc(ch.name)}</span></td>`:''}<td><span class="tmems">${x.c.map(j=>`<span class="tmem">${F[j].ic?icoClass(F[j].ic,24):''}${esc(F[j].name)}</span>`).join('')}</span></td><td class="n">${pc(x.r.win)}</td><td class="n">${rTxt(x.r)}</td><td class="n">${pc(x.r.prog)}</td><td class="n">${face(gOf(Math.max(...x.r.death)),22)} ${pc(Math.max(...x.r.death))}</td></tr>`).join('')}</tbody></table></div>`;
  // place la meilleure équipe dans les emplacements
  const b=res[0];if(b) tm.querySelectorAll('.tslot select').forEach((s,j)=>s.value=b.c[j]!=null?String(b.c[j]):'');slotPow();go();}
async function bestChamp(){const {q,opts}=setup();const pre=plist();const heroes=[];tm.querySelectorAll('.tslot select').forEach(s=>{if(s.value==='') return;const f=fighterFromPreset(pre[+s.value]);if(f) heroes.push(f)});
  if(!heroes.length){$t('tRes').innerHTML=`<p class="note">${TT.needHero}</p>`;return}
  const box=$t('tExtra');box.hidden=false;box.innerHTML=`<h2>${TT.topChamps}</h2><p class="note">${TT.busy}</p>`;await new Promise(z=>setTimeout(z,0));
  const out=[];for(const u of Object.keys(SD.champs)){const ch=champFighter(u);const mods=[ch.leader,ch.aura].filter(Boolean);
    ['tBoost','tMini'].forEach(k=>{const v=$t(k).value;if(v&&SD.mods[v]) mods.push(SD.mods[v])});
    const party=[ch].concat(heroes.slice(0,Math.max(1,q.p-1)).map(h=>({...h})));out.push({u,r:S.run(q,mods,party,{...opts,n:Math.min(1000,opts.n)})})}
  out.sort(cmpR);
  box.innerHTML=`<h2>${TT.topChamps}</h2><p class="note">${TT.savedC}</p><div class="scroll"><table><thead><tr><th>#</th><th>${TT.champ}</th><th class="n">${ta('icon_global_trophy_s',18)} ${TT.win}</th><th class="n">${ta('icon_global_clock',18)} ${TT.rounds}</th><th class="n">${ta('icon_global_class_monster',18)} ${TT.prog}</th><th class="n">${ta('icon_global_health_risk_small',18)} ${TT.death} max</th></tr></thead><tbody>${out.map((x,i)=>`<tr><td>${i+1}</td><td>${ta('icon_global_'+x.u,26)} ${esc(L(SD.champs[x.u].n))}</td><td class="n">${pc(x.r.win)}</td><td class="n">${rTxt(x.r)}</td><td class="n">${pc(x.r.prog)}</td><td class="n">${face(gOf(Math.max(...x.r.death)),22)} ${pc(Math.max(...x.r.death))}</td></tr>`).join('')}</tbody></table></div>`;}
window.STC_team={fighterFromPreset,champStats,bestGear,champPower,cfgStats,setup,run:()=>go()};
})();
