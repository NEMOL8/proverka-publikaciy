# Справочник Scopus (0.8, правка 3): из публичного «Scopus Source List» (scopus.com/sources → Download the Scopus source titles list)
# добавляет в data/ref.json раздел sc — индексируется ли издание в Scopus, годы индексации, исключение и причина, принятые журналы.
# Запуск: python3 mkdata_scopus.py ext_list_Sep_2026.xlsx           (дата списка берётся из имени файла; можно указать вторым аргументом: "Sep 2026")
# Книги (Scopus_book_list) пока не включаются — вопрос не решён (размер справочника).
# Столбцы ищутся по смыслу названия, а не по номеру: при новом виде файла скрипт напишет, какого столбца не нашёл.
import sys, os, re, json
import openpyxl
B = os.path.dirname(os.path.abspath(__file__))
if len(sys.argv) < 2: sys.exit('укажите файл ext_list_*.xlsx')
src = sys.argv[1]
m = re.search(r'([A-Za-z]{3})[_ -]?(\d{4})', os.path.basename(src)); date = sys.argv[2] if len(sys.argv) > 2 else (m.group(1) + ' ' + m.group(2) if m else '')
wb = openpyxl.load_workbook(src, read_only=True, data_only=True)
def sheet(*pats):
    for ws in wb.worksheets:
        if any(re.search(p, ws.title, re.I) for p in pats): return ws
    return None
def rows(ws):
    it = ws.iter_rows(values_only=True); head = None
    for r in it:  # строка заголовков — первая, где есть ячейка ровно «ISSN» (выше бывают строки «Status…», «Notice…»)
        if r and any(isinstance(c, str) and c.strip().upper() == 'ISSN' for c in r): head = [str(c or '').strip() for c in r]; break
    return head, it
def col(head, *pats, need=True, name=''):
    for p in pats:
        for i, h in enumerate(head):
            if re.search(p, h, re.I): return i
    if need: sys.exit(f'в листе не найден столбец «{name or pats[0]}». Заголовки: {head}')
    return None
iss = lambda v: re.sub(r'[^0-9X]', '', str(v or '').upper())
txt = lambda v: str(v).strip() if v is not None else ''
def num(v):
    try: return int(float(v))
    except (TypeError, ValueError): return None

out = {}; by_issn = {}
ws = sheet(r'^scopus sources', r'sources') or wb.worksheets[0]
head, it = rows(ws)
cI = col(head, r'^sourcerecord id', r'source\s*id', r'scopus\s*id', name='Sourcerecord ID'); cT = col(head, r'^source title', r'title', name='Source Title')
cP = col(head, r'^issn$', r'print.?issn', r'^issn', name='ISSN'); cE = col(head, r'^eissn', r'e-?issn', name='EISSN', need=False)
cA = col(head, r'active or inactive', r'active', name='Active or Inactive'); cC = col(head, r'^coverage', r'coverage', name='Coverage')
cD = col(head, r'discontinued', name='Titles Discontinued by Scopus', need=False)
for r in it:
    if not r or r[cT] is None: continue
    sid = num(r[cI]); isn = ' '.join(x for x in [iss(r[cP]), iss(r[cE]) if cE is not None else ''] if len(x) == 8)
    act = 1 if re.match(r'active', txt(r[cA]), re.I) else 0
    rec = [txt(r[cT]), isn, sid, act, txt(r[cC]), 1 if cD is not None and txt(r[cD]) else 0, None, '', '', '', '']
    key = sid or (isn + '|' + txt(r[cT])); out[key] = rec
    for x in isn.split(): by_issn.setdefault(x, key)
n_src = len(out)
ws = sheet(r'discontinued')
n_disc = 0
if ws is not None:
    head, it = rows(ws)
    dI = col(head, r'^sourcerecord id', r'source\s*id', name='Sourcerecord ID', need=False); dT = col(head, r'title', name='Title'); dP = col(head, r'^issn', name='ISSN', need=False); dE = col(head, r'e-?issn', name='EISSN', need=False)
    dY = col(head, r'year', name='год последнего номера', need=False); dV = col(head, r'vol', name='том', need=False); dS = col(head, r'issue', name='выпуск', need=False)
    dR = col(head, r'indexation change', r'reason', r'discontinu.*(due|for)', name='причина', need=False)
    for r in it:
        if not r or r[dT] is None: continue
        isn = [x for x in [iss(r[dP]) if dP is not None else '', iss(r[dE]) if dE is not None else ''] if len(x) == 8]
        sid = num(r[dI]) if dI is not None else None
        key = sid if sid in out else next((by_issn[x] for x in isn if x in by_issn), None)
        if key is None: key = ' '.join(isn) + '|' + txt(r[dT]); out[key] = [txt(r[dT]), ' '.join(isn), None, 0, '', 1, None, '', '', '', '']
        rec = out[key]; rec[5] = 1
        if dY is not None: rec[6] = num(r[dY])
        if dV is not None: rec[7] = txt(r[dV])
        if dS is not None: rec[8] = txt(r[dS])
        if dR is not None: rec[9] = txt(r[dR])
        n_disc += 1
ws = sheet(r'accepted')
n_acc = 0
if ws is not None:
    head, it = rows(ws)
    aT = col(head, r'title', name='Title'); aP = col(head, r'^issn', name='ISSN', need=False); aE = col(head, r'e-?issn', name='EISSN', need=False); aD = col(head, r'date|accept', name='дата принятия', need=False)
    for r in it:
        if not r or r[aT] is None: continue
        isn = [x for x in [iss(r[aP]) if aP is not None else '', iss(r[aE]) if aE is not None else ''] if len(x) == 8]
        if any(x in by_issn for x in isn): continue  # уже загружен
        d = r[aD] if aD is not None else ''; d = d.strftime('%d.%m.%Y') if hasattr(d, 'strftime') else txt(d)
        out[' '.join(isn) + '|' + txt(r[aT])] = [txt(r[aT]), ' '.join(isn), None, 2, '', 0, None, '', '', '', d]; n_acc += 1
# хвостовые пустые поля не храним
rowsout = []
for rec in out.values():
    while len(rec) > 5 and rec[-1] in ('', None, 0): rec.pop()
    rowsout.append(rec)
p = os.environ.get('REF_JSON') or B + '/data/ref.json'; d = json.load(open(p, encoding='utf-8'))
d['sc'] = {'date': date, 'rows': rowsout}
json.dump(d, open(p, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(p, round(os.path.getsize(p) / 1e6, 2), 'МБ; Scopus', date, '— изданий', n_src, '; исключённых', n_disc, '; принятых, ещё не загруженных', n_acc)
