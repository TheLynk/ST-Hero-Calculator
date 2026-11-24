# données du jeu (indépendantes du Google Sheet) : noms FR, images, croissance des stats, familles de compétences
import json,sys,os
gd,atlas,out=sys.argv[1:4]
EN=json.load(open(f'{gd}/loc_en.json'))['texts']; FR=json.load(open(f'{gd}/loc_fr.json'))['texts']
GI=json.load(open(f'{gd}/004_shortsword.json')); S=json.load(open(f'{gd}/008_p_cleave1.json')); G=json.load(open(f'{gd}/027_soldier.json'))
AT=json.load(open(atlas))
items={}
for u in GI:
    n=EN.get(u+'_name')
    if n and n.strip() not in items:
        e={'uid':u,'fr':FR.get(u+'_name',n)}
        if u in AT['items']: e['img']=AT['items'][u]
        items[n.strip()]=e
skills={}
for u in S:
    n=EN.get('skill_'+u+'_name')
    if n and n.strip() not in skills: skills[n.strip()]={'fam':S[u]['family'],'fr':FR.get('skill_'+u+'_name',n)}
classes={}
for u,g in G.items():
    classes[u]={'fr':FR.get('class_'+u+'_name'),'icon':AT['classes'].get(u),
      'grow':{k:[g[k],g['max'+k.capitalize()+'40'],g['max'+k.capitalize()+'50'],g['max'+k.capitalize()+'100']] for k in ('hp','atk','def')}}
GM={'items':items,'skills':skills,'classes':classes,
    'alias':{'Samurai':'swordmaster','Grandmaster':'mastermonk','Arch Druid':'archdruid','Spellblade':'redmage','Fateweaver':'timekeeper','Dark Knight':'darkknight','Death Knight':'deathknight'},
    'typeFr':{EN[k]:FR.get(k) for k in EN if k.startswith('item_type_') and FR.get(k)},
    'art':{"Kiku-Ichimonji":"Muramonji's Style","Backfire Hammer":"Bagginbak's Temper","Lone Wolf Cowl":"Savard's Aloofness","Thinkin' Cap":"Central Thinking","Rock Stompers":"Urist's Sturdiness","Torc of Peace":"Myrthee's Left Hook"}}
json.dump(GM,open(out,'w'),ensure_ascii=False,separators=(',',':'))
print(len(items),len(skills),len(classes),os.path.getsize(out)//1024,'KB')
