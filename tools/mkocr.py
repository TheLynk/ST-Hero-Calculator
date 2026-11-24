import json,base64,sys
# usage : mkocr.py <sortie ocr.js> [dossier node_modules]
# avant : npm i tesseract.js@7 tesseract.js-core@6 @tesseract.js-data/eng
N=(sys.argv[2] if len(sys.argv)>2 else 'node_modules').rstrip('/')+'/'
lib=open(N+'tesseract.js/dist/tesseract.min.js').read()
core=open(N+'tesseract.js-core/tesseract-core-simd-lstm.wasm.js').read()
core_ns=open(N+'tesseract.js-core/tesseract-core-lstm.wasm.js').read()
wk=open(N+'tesseract.js/dist/worker.min.js').read()
eng=base64.b64encode(open(N+'@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz','rb').read()).decode()
out=sys.argv[1]
with open(out,'w') as f:
  f.write('/* ST Hero Calculator - moteur de lecture de texte (Tesseract.js, Apache-2.0). Chargé seulement pour la lecture des captures. */\n')
  f.write(lib.replace('//# sourceMappingURL=tesseract.min.js.map',''))
  f.write('\n;window.STHC_OCR_DATA={core:'+json.dumps(core)+',worker:'+json.dumps(wk.replace('//# sourceMappingURL=worker.min.js.map',''))+',eng:"'+eng+'"};\n')
