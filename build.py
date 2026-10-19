import base64, os, sys, re, shutil, json
# Сборка: dist/Проверка_публикаций_<версия>.html — одна страница со всем внутри (работает и без сервера);
#         dist/site/ — сайт: страница + справочники и распознавание отдельными файлами (для Netlify).
B=os.path.dirname(os.path.abspath(__file__))+'/'; N=B+'node_modules/'
def js(p): return open(p,encoding='utf-8').read().replace('</script','<\\/script')
def b64(p): return base64.b64encode(open(p,'rb').read()).decode()
ocr='--no-ocr' not in sys.argv
ver=re.search(r"VERSION = '([^']+)'",open(B+'src/core.js',encoding='utf-8').read()).group(1)
# токен ORCID /read-public: если рядом лежит orcid_token.txt — встраивается в страницу (решение Германа 14.10.2026; токен виден в коде страницы).
# Сам файл в исходники и в текст проекта не входит.
TOK=open(B+'orcid_token.txt',encoding='utf-8').read().strip() if os.path.exists(B+'orcid_token.txt') else ''
if TOK and not re.fullmatch(r'[0-9a-fA-F-]{20,64}',TOK): sys.exit('orcid_token.txt: токен не похож на токен ORCID')
OAK=open(B+'openalex_key.txt',encoding='utf-8').read().strip() if os.path.exists(B+'openalex_key.txt') else ''
if OAK and not re.fullmatch(r'[A-Za-z0-9_-]{8,128}',OAK): sys.exit('openalex_key.txt: ключ не похож на ключ OpenAlex')
app='const ORCID_BUILTIN = '+json.dumps(TOK)+', OA_BUILTIN = '+json.dumps(OAK)+';\n'+''.join(js(B+'src/'+f)+'\n' for f in ['subfields.js','core.js','net.js','ocr.js','store.js','ui.js'])
print('токен ORCID:', 'встроен' if TOK else 'нет', '; ключ OpenAlex:', 'встроен' if OAK else 'нет')
tpl=open(B+'src/template.html',encoding='utf-8').read()
# Шрифт Circe и логотип убраны 14.10.2026 (репозиторий открытый, лицензия шрифта) — системные шрифты
FW=[]
import urllib.parse
NET='"data:image/svg+xml,'+urllib.parse.quote(open(B+'fonts/net.svg',encoding='utf-8').read())+'"'
tpl=tpl.replace('/*NET*/',NET)
ff=lambda src: '' if not FW else '<style>'+''.join(f"@font-face{{font-family:'Circe';src:url({src(n)}) format('woff2');font-weight:{w};font-style:normal;font-display:swap}}" for n,w in FW)+'</style>'
if os.path.isdir(B+'dist'): shutil.rmtree(B+'dist')
os.makedirs(B+'dist/site/data'); os.makedirs(B+'dist/site/ocr'); os.makedirs(B+'dist/site/fonts')
# 1. одна страница
out='<script type="application/json" id="ref-data">'+open(B+'data/ref.json',encoding='utf-8').read().replace('</','<\\/')+'</script>\n'
if ocr:
    out+=f'<script>{js(N+"tesseract.js/dist/tesseract.min.js")}</script>\n'
    out+=f'<script type="application/octet-stream" id="ocr-core">{b64(N+"tesseract.js-core/tesseract-core-simd-lstm.wasm.js")}</script>\n'
    out+=f'<script type="application/octet-stream" id="ocr-worker">{b64(N+"tesseract.js/dist/worker.min.js")}</script>\n'
    for l in ('rus','eng'): out+=f'<script type="application/octet-stream" id="ocr-{l}">{b64(N+"@tesseract.js-data/"+l+"/4.0.0_best_int/"+l+".traineddata.gz")}</script>\n'
out+=f'<script>\n{app}</script>'
dst=B+'dist/Проверка_публикаций_'+ver+'.html'; open(dst,'w',encoding='utf-8').write(tpl.replace('/*FONTS*/',ff(lambda n:'data:font/woff2;base64,'+b64(B+'fonts/'+n+'.woff2'))).replace('/*LIBS*/',out)); print(dst, round(os.path.getsize(dst)/1e6,1),'МБ')
# 2. сайт
S=B+'dist/site/'
open(S+'app.js','w',encoding='utf-8').write(app)
page=tpl.replace('/*FONTS*/',ff(lambda n:'fonts/'+n+'.woff2')).replace('/*LIBS*/',f'<script>window.PC_SITE = true;</script>\n<script src="app.js?v={ver}"></script>')
open(S+'index.html','w',encoding='utf-8').write(page)
shutil.copy(B+'data/ref.json',S+'data/ref.json')
for n,_ in FW: shutil.copy(B+'fonts/'+n+'.woff2',S+'fonts/'+n+'.woff2')
for f in ['tesseract.min.js','worker.min.js']: shutil.copy(N+'tesseract.js/dist/'+f,S+'ocr/'+f)
# ядро распознавания: worker сам выбирает вариант по возможностям браузера (с SIMD или без), модель — только LSTM
for f in ['tesseract-core-simd-lstm.wasm.js','tesseract-core-lstm.wasm.js']: shutil.copy(N+'tesseract.js-core/'+f,S+'ocr/'+f)
for l in ('rus','eng'): shutil.copy(N+'@tesseract.js-data/'+l+'/4.0.0_best_int/'+l+'.traineddata.gz',S+'ocr/'+l+'.traineddata.gz')
open(S+'.nojekyll','w').write('')  # GitHub Pages: отдавать файлы как есть
open(S+'robots.txt','w').write('User-agent: *\nDisallow: /\n')
open(S+'_headers','w').write('/*\n  X-Robots-Tag: noindex, nofollow\n  Referrer-Policy: no-referrer\n/index.html\n  Cache-Control: no-cache\n/\n  Cache-Control: no-cache\n/data/*\n  Cache-Control: public, max-age=86400\n/fonts/*\n  Cache-Control: public, max-age=31536000\n/ocr/*\n  Cache-Control: public, max-age=31536000, immutable\n')
tot=sum(os.path.getsize(os.path.join(d,f)) for d,_,fs in os.walk(S) for f in fs)
print(S, 'index.html', round(os.path.getsize(S+'index.html')/1e3),'КБ; всего', round(tot/1e6,1),'МБ')
