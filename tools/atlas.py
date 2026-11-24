import json,math,sys,os,base64,io
from PIL import Image
gd,thumbs,outjson=sys.argv[1:4]
items=json.load(open(gd+'/004_shortsword.json')); classes=json.load(open(gd+'/027_soldier.json'))
def atlas(keys,cell,cols):
    rows=math.ceil(len(keys)/cols); A=Image.new('RGBA',(cols*cell,rows*cell),(0,0,0,0)); idx={}
    for i,k in enumerate(keys):
        im=Image.open(f'{thumbs}/{k}.png'); A.paste(im,((i%cols)*cell+(cell-im.width)//2,(i//cols)*cell+(cell-im.height)//2),im); idx[k]=i
    b=io.BytesIO(); A.save(b,'WEBP',quality=80,method=6); return idx,b.getvalue()
ik=[u for u in items if os.path.exists(f'{thumbs}/{u}.png')]
ii,ib=atlas(ik,64,40)
cm={}
for c in classes:
    for k in (f'icon_global_class_{c}_128',f'icon_global_class_{c}'):
        if os.path.exists(f'{thumbs}/{k}.png'): cm[c]=k;break
ci,cb=atlas(list(cm.values()),48,len(cm))
json.dump({'items':ii,'itemCols':40,'classes':{c:ci[k] for c,k in cm.items()},
  'itemsImg':'data:image/webp;base64,'+base64.b64encode(ib).decode(),'classesImg':'data:image/webp;base64,'+base64.b64encode(cb).decode()},open(outjson,'w'))
print(len(ii),len(ib)//1024,'KB',len(cm),len(cb)//1024,'KB',[c for c in classes if c not in cm])
