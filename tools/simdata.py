# données de combat extraites des fichiers du jeu (lecture seule) : quêtes, modificateurs, champions, compétences, constantes
# usage : simdata.py <dossier des tables du jeu (json)> <sortie sim.json>
import json,sys,os
gd,out=sys.argv[1:3]
L=lambda n:json.load(open(os.path.join(gd,n+'.json'),encoding='utf-8'))
Q,M,H,S,C=L('quests'),L('qmodifiers'),L('heroes'),L('skills'),L('constants')
TF=L('texts_fr');TF=TF.get('texts',TF);TE=L('texts_en');TE=TE.get('texts',TE)
f=lambda v:float(v) if v not in (None,'') else 0
def nm(k):return [TF.get(k) or TE.get(k) or '',TE.get(k) or '']
quests=[];names={}
for u,q in Q.items():
    fam=q['family']
    if fam=='titantower': continue
    flash=u.startswith('FQ')
    if fam not in names:
        if flash: names[fam]={'area':(lambda a:['Donjon Parangon',a[1]] if len(a[0])>40 else a)(nm('fq_'+fam+'_name')),'mob':nm('fq_monster_'+fam+'_name'),'boss':nm('fq_monster_'+fam+'_name')}
        else:
            area=nm(fam+'_name') if TE.get(fam+'_name') else nm('clean_name_'+fam)
            names[fam]={'area':area,'mob':nm(fam+'_monster_name') if TE.get(fam+'_monster_name') else nm(fam+'_mob_name'),'boss':nm(fam+'_boss_name')}
    quests.append({'u':u,'f':fam,'d':q['difficultyLvl'],'b':1 if q['isBoss'] else 0,'fl':1 if flash else 0,'p':q.get('party',0),
      'hp':q.get('monsterHp',0),'dmg':q.get('dmg',0),'aoe':q.get('aoe',0),'ao':f(q.get('aoeOdds')),'cr':f(q.get('crit')),'cm':f(q.get('critMult')),'td':q.get('tdef',0),
      'dr':f(q.get('dmgRed')),'acc':f(q.get('accuracy')),'po':f(q.get('poise')),'bp':q.get('barrierPower',0),'el':(q['element'] or '').split(',') if q['element'] else [],
      'mb':f(q.get('miniboss')),'ul':q.get('minLevel') or q.get('unlockLevel',0)})
MK=['time','rest','xp','atk','def','hp','hpAbs','shieldHp','evasion','critical','critMult','aggro','regen','atkClass','hpClass','evasionClass','criticalClass','classes','barrierPowerMult','bossMult','FlashQuestModMult','randomAttackBonus','hpConsumption','atkFromAdvMult','hpReceived','mHp','mDmg','mDmgPerRound','mCrit','mCritMult','mAoe','mAoeOdds','mEva','duration','isAurastone','modifierProvider']
mods={}
for u,m in M.items():
    if not(u.endswith(tuple('12345')) and 'leader' in u or u.endswith('aura') or u.startswith('si_atk') or m.get('isMiniBoss')): continue
    mods[u]={k:m[k] for k in MK if k in m and m[k] not in (None,0,'0','1' if k in('barrierPowerMult','bossMult','FlashQuestModMult') else '§',False,'')}
    for k,v in mods[u].items():
        if isinstance(v,str) and k not in ('atkClass','hpClass','evasionClass','criticalClass','classes','modifierProvider'): mods[u][k]=float(v)
    k2=('atkbooster'+u[-1]+'_name') if u.startswith('si_atk') else ('hero_skill_'+u+'_name') if 'leader' in u else (u+'_name') if TE.get(u+'_name') else ('miniboss_'+u)
    n=nm(k2) if TE.get(k2) else None
    if n: mods[u]['n']=n
champs={}
for u,h in H.items():
    if h.get('isTempHero'): continue
    champs[u]={'n':nm(u+'_name'),'cls':h['class'],'el':h['element'],
      'hp':[h['hp'],h['maxHp40'],h['maxHp50'],h['maxHp100']],'atk':[h['atk'],h['maxAtk40'],h['maxAtk50'],h['maxAtk100']],'def':[h['def'],h['maxDef40'],h['maxDef50'],h['maxDef100']],
      'eva':f(h['evasion']),'aggro':h['aggro'],'cr':f(h['critical']),'cm':f(h['critMult']),
      'upg':[h.get('upg%02d'%i) for i in range(1,12)],'titan':h.get('upgTitan'),'prg':h.get('upgPrgnlvl100'),
      'sk':[h.get('skill%d'%i) for i in range(1,6)],'st':[h.get('storyHp',0),h.get('storyAtk',0),h.get('storyDef',0),f(h.get('storyEva')),f(h.get('storyCrit'))],'dm':h.get('dragonMult')}
SK=['atkBuf','evaBuf','critBuf','dmgBuf','monsAtkBuf','monsDmgBuf','survive','regen','startHpRatio','championStatBonusMultiplier','elements']
skills={}
for u,s in S.items():
    d={k:s[k] for k in SK if s.get(k) not in (None,0,'0','')}
    if any(k!='elements' for k in d): skills[u]={k:(v if k in('dmgBuf','monsDmgBuf') else float(v)) for k,v in d.items()}
inn={}
for u,s in S.items():
    if s['family'].startswith('c_') and s.get('tier'): inn.setdefault(s['family'],[]).append([s['tier'],s.get('elements') or 0,u])
for v in inn.values(): v.sort()
CK=['quest_def_low_def_mult','quest_def_even_def_mult','quest_def_high_def_mult','quest_def_high_def_mult_curve','quest_def_target_range_effect','quest_evasion_max','adventurer_pathfinder_innate_evasion_bonus','adventurer_conquistador_crit_bonus','adventurer_conquistador_crit_max_stacks','adventurer_sensei_innate_buff_cooldown','quest_darkknight_kill_threshold','monster_anger_threshold','monster_anger_increase_per_round','elemental_barrier_damage_reduction','all_element_barrier_effectiveness','adventurer_shieldhp_regen_turn_count','quest_rating_S_death_chance_threshold','quest_rating_A_death_chance_threshold','quest_rating_B_death_chance_threshold','quest_rating_C_death_chance_threshold','quest_outlook_simulation_amount','quest_chronomancer_redos','hemma_max_attack_multiplier','attack_mult_hemma','character_power_dragon_invasion_curve','quest_event_dragon_dragon_count','quest_event_dragon_adventurer_max','dragon_avg_mult','hero_element_rank_and_value','champion_titan_soul_story_stat_mult','max_skill_level_non_titan']
cons={k:C[k] for k in CK if k in C}
txt={'diff':[nm('quest_setup_difficulty_'+x+'_short') for x in ('easy','medium','hard','extreme')]}
json.dump({'quests':quests,'names':names,'mods':mods,'champs':champs,'skills':skills,'innate':inn,'cons':cons,'txt':txt},open(out,'w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
print(len(quests),'quêtes',len(mods),'modificateurs',len(champs),'champions',len(skills),'compétences',os.path.getsize(out)//1024,'Ko')
