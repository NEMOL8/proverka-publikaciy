# Справочник CiteScore (0.9, правка 6): из файла Elsevier «CiteScore <год> annual values» (CiteScore_2025.xlsx)
# добавляет в data/ref.json раздел cs — CiteScore, SNIP, процентиль, квартиль и место по каждой тематике Scopus.
# Запуск: python3 mkdata_citescore.py CiteScore_2025.xlsx        (год берётся из имени файла или названия листа)
# Сам файл Elsevier в репозиторий не кладётся (.gitignore) — только выжимка в data/ref.json.
# Elsevier Helpdesk (26.10.2026): в бесплатной некоммерческой открытой утилите можно, если указан источник и стоит ссылка —
# поэтому у каждого значения на странице: подпись «Scopus CiteScore <год>, © Elsevier B.V.» и ссылка на страницу издания в Scopus.
# Столбцы ищутся по смыслу названия: при новом виде файла скрипт напишет, какого столбца не нашёл.
import sys, os, re, json
import openpyxl
B = os.path.dirname(os.path.abspath(__file__))
if len(sys.argv) < 2: sys.exit('укажите файл CiteScore_<год>.xlsx')
src = sys.argv[1]
wb = openpyxl.load_workbook(src, read_only=True, data_only=True)
ws = wb.worksheets[0]
m = re.search(r'(20\d{2})', os.path.basename(src)) or re.search(r'(20\d{2})', ws.title)
if not m: sys.exit('год CiteScore не найден ни в имени файла, ни в названии листа')
year = int(m.group(1))
it = ws.iter_rows(values_only=True)
head = [str(c or '').strip() for c in next(it)]
def col(*pats, name='', need=True):
    for p in pats:
        for i, h in enumerate(head):
            if re.search(p, h, re.I): return i
    if need: sys.exit(f'не найден столбец «{name or pats[0]}». Заголовки: {head}')
    return None
cI = col(r'scopus source id', r'source\s*id', name='Scopus Source ID'); cT = col(r'^title', name='Title')
cCS = col(r'^citescore$', name='CiteScore'); cSN = col(r'^snip', name='SNIP', need=False)
cSub = col(r'sub-?subject area$', r'subject area$', name='Scopus Sub-Subject Area'); cPct = col(r'^percentile', name='Percentile')
cR = col(r'^rank$', name='RANK'); cOf = col(r'rank out of', name='Rank Out Of'); cQ = col(r'^quartile', name='Quartile')
cTy = col(r'^type$', name='Type', need=False); cP = col(r'print\s*issn', name='Print ISSN'); cE = col(r'e-?issn', name='E-ISSN')
def iss(v):
    if v is None: return ''
    s = re.sub(r'[^0-9X]', '', str(v).upper())
    return s.zfill(8) if 0 < len(s) <= 8 else ''   # Excel теряет ведущие нули: 930334 → 00930334
def num(v):
    try: return float(v)
    except (TypeError, ValueError): return None
subj, sidx, out, bad = [], {}, {}, 0
for r in it:
    if not r or r[cI] is None: continue
    sid = int(r[cI]); s = str(r[cSub] or '').strip(); pct = int(r[cPct]); q = int(r[cQ])
    # квартиль в файле — по процентилю (75–99 Q1, 50–74 Q2, 25–49 Q3, 0–24 Q4); если когда-нибудь разойдётся — сообщить
    if q != (1 if pct >= 75 else 2 if pct >= 50 else 3 if pct >= 25 else 4): bad += 1
    if s not in sidx: sidx[s] = len(subj); subj.append(s)
    rec = out.get(sid)
    if rec is None:
        isn = ' '.join(x for x in dict.fromkeys([iss(r[cP]), iss(r[cE])]) if x)
        cs = num(r[cCS]); sn = num(r[cSN]) if cSN is not None else None
        rec = out[sid] = [sid, isn, str(r[cT] or '').strip(), cs, sn, str(r[cTy] or '') if cTy is not None else '', []]
    rec[6].append([sidx[s], pct, q, int(r[cR]), int(r[cOf])])
p = os.environ.get('REF_JSON') or B + '/data/ref.json'; d = json.load(open(p, encoding='utf-8'))
# название храним только у изданий, которых нет ни в SCImago, ни в списке источников Scopus (у остальных оно уже есть) — справочник меньше
known = {r[4] for r in d.get('sj', [])} | {r[2] for r in d.get('sc', {}).get('rows', []) if r[2]}
for rec in out.values():
    rec[6].sort(key=lambda x: (-x[1], x[3]))   # наилучшая тематика — первой
    if rec[0] in known: rec[2] = ''
d['cs'] = {'year': year, 'subj': subj, 'rows': list(out.values())}
json.dump(d, open(p, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(p, round(os.path.getsize(p) / 1e6, 2), 'МБ; CiteScore', year, '— изданий', len(out), '; тематик', len(subj), '; строк, где квартиль не по процентилю:', bad)
