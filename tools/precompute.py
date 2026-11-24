# pré-calcule les meilleurs builds pour les réglages par défaut (toutes les classes)
import sys,json,re
from playwright.sync_api import sync_playwright
from concurrent.futures import ThreadPoolExecutor
page,out,version=sys.argv[1:4]
D=None
VER=[]
def job(arg):
    wi,chunk=arg
    res={}
    import os
    pf=f'{out}.part{wi}'
    if os.path.exists(pf): res=json.load(open(pf))
    with sync_playwright() as p:
        b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox']);pg=b.new_page()
        pg.goto('file://'+page); pg.wait_for_function("document.getElementById('busy').textContent===''",timeout=600000)
        pg.evaluate("localStorage.clear()")
        done={tuple(v['_t']) for v in res.values() if '_t' in v}
        for cls,obj,lvl in chunk:
            if (cls,obj,lvl) in done: continue
            pg.evaluate("o=>{const e=document.getElementById('obj');e.value=o;e.dispatchEvent(new Event('input'))}",obj); pg.fill('#lvl',str(lvl)); pg.evaluate(f"STC_pick({json.dumps(cls)})")
            pg.wait_for_timeout(80); pg.wait_for_function("document.getElementById('busy').textContent===''",timeout=600000)
            r=pg.evaluate("STC_last()"); VER[:]=[r['version']]; r['build']['_t']=[cls,obj,lvl]; res[r['key']]=r['build']; json.dump(res,open(pf,'w'))
            print(cls,obj,lvl,flush=True)
        b.close()
    return res
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox']);pg=b.new_page();pg.goto('file://'+page)
    classes=pg.evaluate("STC.D.classes.map(c=>[c.name,c.promoted])"); b.close()
tasks=[(c,o,l) for c,pr in classes for o in ('power','threat') for l in ([50,100] if pr else [40,50])]
N=int(sys.argv[4]) if len(sys.argv)>4 else 4
chunks=[(i,tasks[i::N]) for i in range(N)]
builds={}
with ThreadPoolExecutor(N) as ex:
    for r in ex.map(job,chunks): builds.update({k:{x:y for x,y in v.items() if x!='_t'} for k,v in r.items()})
version=VER[0] if VER else version
json.dump({'version':version,'builds':builds},open(out,'w'),separators=(',',':'))
print('builds',len(builds))
