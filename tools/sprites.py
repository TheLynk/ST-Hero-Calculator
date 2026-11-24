import UnityPy,os,json,math,sys,gc
from PIL import Image
bundle,gd,out=sys.argv[1:4]
items=json.load(open(gd+'/004_shortsword.json')); classes=json.load(open(gd+'/027_soldier.json'))
want=set(items)|{f'icon_global_class_{c}_128' for c in classes}|{f'icon_global_class_{c}' for c in classes}
env=UnityPy.load(bundle); n=0
for o in env.objects:
    if o.type.name!='Sprite': continue
    nm=o.peek_name()
    if nm not in want or os.path.exists(f'{out}/{nm}.png'): continue
    try:
        im=o.read().image.convert('RGBA'); cell=48 if nm.startswith('icon_global_class') else 64
        im.thumbnail((cell,cell),Image.LANCZOS); im.save(f'{out}/{nm}.png'); n+=1
    except Exception as e: print('err',nm,e)
    if n%200==0: gc.collect()
print('saved',n)
