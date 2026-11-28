# icônes de l'onglet « Équipe et quêtes » (champions, compétences de chef, zones de quête, âme de titan), extraites du paquet UI du jeu (lecture seule)
# usage : teamatlas.py <ui_assets_all_*.bundle> <sim.json> <sortie teamatlas.json>
import UnityPy,sys,io,base64,json,math
from PIL import Image
bundle,simf,out=sys.argv[1:4]
SD=json.load(open(simf,encoding='utf-8'))
want=['championtitansoul','icon_global_questarea_flashquest_bg','icon_global_flashquest']
for u,c in SD['champs'].items():
    want.append('icon_global_'+u)
    want+=['icon_global_skill_hero_'+s for s in c['sk'] if s]
for f in sorted(set(q['f'] for q in SD['quests'])): want+=['icon_global_questarea_'+f+'_small','FQ'+f,'fq'+f]
want.append('FQparagondust')
env=UnityPy.load(bundle);got={};ws=set(want)
for o in env.objects:
    if o.type.name=='Sprite':
        n=o.peek_name()
        if n in ws and n not in got:
            im=o.read().image.convert('RGBA');im.thumbnail((48,48),Image.LANCZOS);got[n]=im
keys=[n for n in want if n in got];cols=16;cell=48
A=Image.new('RGBA',(cols*cell,math.ceil(len(keys)/cols)*cell),(0,0,0,0));idx={}
for i,k in enumerate(keys):
    im=got[k];A.paste(im,((i%cols)*cell+(cell-im.width)//2,(i//cols)*cell+(cell-im.height)//2),im);idx[k]=i
b=io.BytesIO();A.save(b,'WEBP',quality=85,method=6)
json.dump({'i':idx,'cols':cols,'img':'data:image/webp;base64,'+base64.b64encode(b.getvalue()).decode()},open(out,'w'))
print(len(keys),'icônes',len(b.getvalue())//1024,'Ko · manquantes :',[n for n in want if n not in got])
