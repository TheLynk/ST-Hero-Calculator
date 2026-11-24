import UnityPy,sys,os,math,io,base64,json
from PIL import Image
bundle,names,out=sys.argv[1],open(sys.argv[2]).read().split(','),sys.argv[3]
want=set(names); got={}
env=UnityPy.load(bundle)
for o in env.objects:
    if o.type.name=='Sprite':
        n=o.peek_name()
        if n in want and n not in got:
            im=o.read().image.convert('RGBA'); im.thumbnail((48,48),Image.LANCZOS); got[n]=im
keys=[n for n in names if n in got]; cols=20; cell=48
A=Image.new('RGBA',(cols*cell,math.ceil(len(keys)/cols)*cell),(0,0,0,0)); idx={}
for i,k in enumerate(keys):
    im=got[k]; A.paste(im,((i%cols)*cell+(cell-im.width)//2,(i//cols)*cell+(cell-im.height)//2),im); idx[k]=i
b=io.BytesIO(); A.save(b,'WEBP',quality=85,method=6)
json.dump({'ui':idx,'uiCols':cols,'uiImg':'data:image/webp;base64,'+base64.b64encode(b.getvalue()).decode()},open(out,'w'))
print(len(keys),len(b.getvalue())//1024,'KB',[n for n in names if n not in got])
