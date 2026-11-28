// ===== Simulateur de combat de quête =====
// Règles reprises du code du jeu (Quest.DoCombat, lu de façon statique) : voir A_VERIFIER.md
const SIM=(()=>{
const SD=/*SIMDATA*/null;
const CS=SD?SD.cons:{};
const cn=(k,d)=>CS[k]!=null?+CS[k]:d;
const curvePts=s=>String(s||'').split(';').filter(Boolean).map(p=>p.split(',').map(Number));
const curve=(pts,x)=>{if(!pts.length)return 0;if(x<=pts[0][0])return pts[0][1];for(let i=1;i<pts.length;i++)if(x<=pts[i][0]){const[a,b]=pts[i-1],[c,d]=pts[i];return b+(d-b)*(x-a)/(c-a)}return pts[pts.length-1][1]};
const HDC=curvePts(CS.quest_def_high_def_mult_curve||'0,50;1,30;5,25');
function rng(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
// multiplicateur de dégâts reçus selon la DEF (Quest.CheckDamageWithDefense)
function defMult(def,td,crit){
  const x=cn('quest_def_even_def_mult',1)+(td-def)/(td*cn('quest_def_target_range_effect',2));
  const hi=cn('quest_def_high_def_mult',0.5),lo=cn('quest_def_low_def_mult',2);
  if(crit) return Math.min(lo,Math.max(1,x));
  if(x<hi) return curve(HDC,hi-x)/100;
  return Math.min(lo,Math.max(hi,x));
}
const FAMC={fighter:'Fighter',rogue:'Rogue',spellcaster:'Spellcaster'};
const inCls=(list,h)=>!list||String(list).split(',').some(c=>FAMC[c.trim()]?FAMC[c.trim()]===h.family:c.trim()===h.gcls);
// modificateurs (Quest.ApplyModifier) : valeurs additives, × effet (Mercenaire), × quête éclair (Bjorn), × boss (Ashley, ATQ et DEF)
function buildMods(q,mods,party,opts){
  const mi={mHp:1,mDmg:1,mPR:0,mCrit:1,mCM:1,mAoe:1,mAoeO:1,mEva:0,rab:0,bpm:1,hpCons:0,afam:0};
  for(const h of party) Object.assign(h,{hpCons:0,aM:1,dM:1,hM:1,hA:0,sM:1,eB:0,cB:0,cmB:0,agM:1,rg:0});
  for(const m of mods){if(!m) continue;
    const champ=m.modifierProvider==='champion'&&!m.isAurastone;
    const fm=q.fl&&!m.isAurastone?(m.FlashQuestModMult||1):1, bm=(q.b||opts.mini)&&!m.isAurastone?(m.bossMult||1):1;
    mi.mHp+=m.mHp||0;mi.mDmg+=m.mDmg||0;mi.mPR+=m.mDmgPerRound||0;mi.mCrit+=m.mCrit||0;mi.mCM+=m.mCritMult||0;mi.mAoe+=m.mAoe||0;mi.mAoeO+=m.mAoeOdds||0;mi.mEva+=m.mEva||0;
    if(m.barrierPowerMult) mi.bpm*=m.barrierPowerMult; mi.rab+=m.randomAttackBonus||0; mi.hpCons+=m.hpConsumption||0; mi.afam+=m.atkFromAdvMult||0;
    for(const h of party){
      if(m.classes&&!inCls(m.classes,h)) continue;
      const e=(champ?1+(h.champB||0):1)*fm;
      if(m.atk&&inCls(m.atkClass,h)) h.aM+=m.atk*e*bm;
      if(m.def) h.dM+=m.def*e*bm;
      if(m.hp&&inCls(m.hpClass,h)) h.hM+=m.hp*e;
      if(m.hpAbs) h.hA+=m.hpAbs*e;
      if(m.shieldHp) h.sM+=m.shieldHp*e;
      if(m.evasion&&inCls(m.evasionClass,h)) h.eB+=m.evasion*e;
      if(m.critical&&inCls(m.criticalClass,h)) h.cB+=m.critical*e;
      if(m.critMult) h.cmB+=m.critMult*e;
      if(m.aggro) h.agM+=m.aggro;
      if(m.regen) h.rg+=m.regen*e;
      if(m.hpConsumption) h.hpCons=(h.hpCons||0)+m.hpConsumption;
    }
  }
  return mi;
}
// une simulation complète (Quest.DoCombat)
function fight(q,mi,party,R,opts){
  const isB=!!(q.b||opts.mini);
  const mMax=Math.round(q.hp*mi.mHp);let mHp=mMax;
  const H=party.map(h=>{const hp=Math.round((h.hp+h.hA)*h.hM*(h.startHp||1));return{h,hp,max:Math.round((h.hp+h.hA)*h.hM),sh:Math.round((h.shield||0)*h.sM),shMax:Math.round((h.shield||0)*h.sM),hit:false,surv:false,lord:false,dance:false,rah:0,rnh:0,conq:0,dmg:0,absorbed:0,dead:false}});
  const alive=()=>H.filter(x=>!x.dead);
  const evaOf=(x,round)=>{const h=x.h;if(round===1&&h.cls==='Daimyo') return 1;
    let e=h.eva+h.eB-(q.acc||0);
    if(h.bers) e+=h.bers.evaBuf*bersN(x); if(h.ninja&&!x.hit) e+=h.ninja.evaBuf;
    return Math.min(e,h.maxEva)};
  const bersN=x=>{const r=x.hp/x.max;return x.h.bers.th.filter(t=>r<=t).length};
  const tdef=q.td;
  let round=1,maxR=600;
  const angerT=cn('monster_anger_threshold',500),angerI=cn('monster_anger_increase_per_round',2);
  const hitHero=(x,dmg,crit,aoe,ev,dm,orig)=>{
    if(ev){const c=x.h.cls;if(c==='Dancer'||c==='Acrobat') x.dance=true;return}
    let d=Math.max(1,Math.round(dm*dmg));
    if(!x.surv&&x.hp+x.sh-d<1&&x.h.survive>0&&R()<x.h.survive){x.surv=true;d=x.hp-1+x.sh}
    if(round>angerT) d=Math.min(x.hp+x.sh,(round-angerT)*angerI*d);
    if(x.sh>0){const a=Math.min(x.sh,d);x.sh-=a;d-=a}
    x.rnh=0;x.hp-=d;if(!x.hit) x.rah=0;x.hit=true;
    if(x.hp<=0){x.hp=0;x.dead=true}
  };
  const lordSave=(x,dmg,dm)=>{if(x.h.cls==='Lord'||x.hp-Math.max(1,Math.round(dm*dmg))>0) return null;
    return H.find(y=>y.h.cls==='Lord'&&!y.dead&&!y.lord)||null};
  for(;round<=maxR;round++){
    for(const x of alive()) x.rnh++;
    // --- attaque du monstre ---
    const al=alive(); if(!al.length) break;
    const grow=1+round*mi.mPR;
    if(al.length>1&&R()<=q.ao*mi.mAoeO){
      for(const x of al){ if(x.dead) continue;
        const dmg=Math.round(q.aoe*mi.mAoe*grow); let ev=R()<Math.max(0,evaOf(x,round));
        const dm=defMult(x.h.def*x.h.dM*(isB?x.h.bossD:1),tdef,false);
        const L=lordSave(x,dmg,dm); let t=x; if(L){L.lord=true;t=L;ev=false}
        hitHero(t,dmg,false,true,ev,dm,x);
      }
    } else {
      let tot=0;for(const x of al) tot+=Math.max(0,x.h.aggro*x.h.agM);
      let r=R()*tot,x=al[al.length-1];for(const y of al){r-=Math.max(0,y.h.aggro*y.h.agM);if(r<0){x=y;break}}
      let ev=R()<Math.max(0,evaOf(x,round));
      const crit=R()<q.cr*mi.mCrit;
      let dmg=q.dmg*mi.mDmg*grow; if(crit) dmg*=q.cm*mi.mCM; dmg=Math.round(dmg);
      const dm=defMult(x.h.def*x.h.dM*(isB?x.h.bossD:1),tdef,crit);
      const L=lordSave(x,dmg,dm); let t=x; if(L){L.lord=true;t=L;ev=false}
      hitHero(t,dmg,crit,false,ev,dm,x);
    }
    // --- Hemma : absorbe des PV des alliés ---
    const hem=H.find(x=>x.h.hemma&&!x.dead);
    if(hem) for(const y of alive()){ if(y===hem||!y.h.hpCons) continue; const a=Math.round(y.max*y.h.hpCons); if(a<y.hp){y.hp-=a;hem.absorbed+=a;hem.h.hemN=(hem.h.hemN||0)+1;const g=Math.min(a,hem.max-hem.hp);hem.hp+=g}}
    // --- barrière élémentaire ---
    let shattered=true;
    if(q.bp>0&&opts.bel){let pw=0;for(const x of alive()){const h=x.h;if(h.elem===opts.bel) pw+=h.el;else if(h.elem==='all'||h.elem==='Any') pw+=Math.round(h.el*cn('all_element_barrier_effectiveness',0.5))}
      shattered=Math.round(pw*mi.bpm)>=q.bp}
    // --- attaques des héros ---
    for(const x of H){ if(x.dead||mHp<=0) continue; const h=x.h;
      const mEv=mi.mEva>0&&R()<Math.min(mi.mEva,cn('quest_evasion_max',0.75));
      let crit;
      if(round===1&&(h.cls==='Samurai'||h.cls==='Daimyo')) crit=true;
      else if(x.dance) crit=true;
      else if(mEv) crit=false;
      else {let c=h.crit+h.cB-(q.po||0); if(h.ninja&&!x.hit) c+=h.ninja.critBuf; crit=R()<Math.max(0,c)}
      // ATQ de combat (Character.GetBattleAttack) : bonus conditionnels ajoutés au % d'ATQ
      let cond=0; if(isB) cond+=h.bossA; if(round===1) cond+=h.dino; if(mHp/mMax<0.5) cond+=h.shark; if(h.bers) cond+=h.bers.atkBuf*bersN(x);
      const atk=(h.atk+(h.hemma?x.absorbed*h.aBr*(h.card||1):0))*(h.aBr+cond)/h.aBr; // Hemma : PV absorbés ajoutés à l'ATQ de base
      const rb=mi.rab>0?R()*mi.rab:0;
      let d=atk*(h.aM*(1+rb));
      if(crit){let m=h.cm+h.cmB+(h.cls==='Conquistador'?cn('adventurer_conquistador_crit_bonus',0.25)*x.conq:0); if(m>1) d*=m;
        if(h.cls==='Conquistador') x.conq=Math.min(x.conq+1,cn('adventurer_conquistador_crit_max_stacks',4))}
      else x.conq=0;
      d=Math.max(1,Math.round(d))*(1-(q.dr||0));
      const ign=round===1&&(h.cls==='Samurai'||h.cls==='Daimyo');
      if(!mEv&&!shattered&&!ign&&q.bp>0) d=d*(1-cn('elemental_barrier_damage_reduction',0.8));
      d=Math.max(1,Math.round(d));
      x.rah++; if(h.cls==='Sensei'&&x.rah>=cn('adventurer_sensei_innate_buff_cooldown',2)) x.hit=false;
      x.dance=false;
      if(!mEv){mHp-=d;x.dmg+=d; if(h.dk&&mHp>0&&mHp/mMax<=cn('quest_darkknight_kill_threshold',0.1)){x.dmg+=mHp;mHp=0}}
    }
    if(mHp<=0) return {win:true,rounds:round,H};
    if(!alive().length) return {win:false,rounds:round,H};
    // --- fin du tour : régénération et bouclier ---
    for(const x of alive()){ const g=(x.h.rg||0)+(x.h.regen||0); if(g>0&&x.hp<x.max) x.hp=Math.min(x.max,x.hp+g);
      if(x.shMax>0&&x.rnh>=cn('adventurer_shieldhp_regen_turn_count',3)&&x.sh<x.shMax) x.sh=x.shMax }
  }
  return {win:false,rounds:round,H,timeout:true};
}
// N simulations ; renvoie taux de victoire, risque de mort par héros, tours, note
function run(q,mods,party,opts={}){
  const N=opts.n||1000, R=rng(opts.seed||12345);
  const mi=buildMods(q,mods,party,opts);
  let win=0,rounds=0,maxR=0,minR=1e9,prog=0; const death=party.map(()=>0), dmg=party.map(()=>0);
  const redo=party.some(h=>h.cls==='Chronomancer'||h.cls==='Fateweaver');
  for(let i=0;i<N;i++){
    let r=fight(q,mi,party,R,opts);
    if(!r.win&&redo) r=fight(q,mi,party,R,opts);
    if(r.win){win++;rounds+=r.rounds;maxR=Math.max(maxR,r.rounds);minR=Math.min(minR,r.rounds)}
    let tot=0;r.H.forEach((x,k)=>{if(x.dead)death[k]++;dmg[k]+=x.dmg;tot+=x.dmg});prog+=Math.min(1,tot/Math.round(q.hp*mi.mHp));
  }
  const w=win/N;
  return {n:N,win:w,prog:prog/N,death:death.map(d=>d/N),grade:death.map(d=>grade(d/N)),dmg:dmg.map(d=>d/N),rounds:win?rounds/win:0,minR:win?minR:0,maxR,mHp:Math.round(q.hp*mi.mHp),mi};
}
// note d'un héros (QuestUtils.GetQuestRating) : selon son risque de mort
function grade(d){if(d<=0)return 5;if(d<cn('quest_rating_A_death_chance_threshold',0.15))return 4;if(d<cn('quest_rating_B_death_chance_threshold',0.4))return 3;if(d<cn('quest_rating_C_death_chance_threshold',0.6))return 2;if(d<1)return 1;return 0}
return {SD,run,defMult,buildMods,fight,rng};
})();
window.STSIM=SIM;
