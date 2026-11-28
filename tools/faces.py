# visages de note de quête (icon_shop_face_*) extraits du paquet UI du jeu (lecture seule)
# usage : faces.py <ui_assets_all_*.bundle> <sortie faces.json>
import UnityPy,sys,io,base64,json
from PIL import Image
env=UnityPy.load(sys.argv[1]);want=['icon_shop_face_'+x for x in ('D','C','B','A','S','SSS')];got={}
for o in env.objects:
    if o.type.name=='Sprite' and o.peek_name() in want and o.peek_name() not in got:
        im=o.read().image.convert('RGBA');im.thumbnail((64,64),Image.LANCZOS);b=io.BytesIO();im.save(b,'WEBP',quality=90,method=6)
        got[o.peek_name()]='data:image/webp;base64,'+base64.b64encode(b.getvalue()).decode()
json.dump([got[n] for n in want],open(sys.argv[2],'w'))
print(len(got),'visages')
