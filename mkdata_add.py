# Добавляет в готовый справочник data/ref.json годы SCImago из выгрузок (без пересборки Белого списка).
#   python3 mkdata_add.py "scimagojr 2006.csv" "scimagojr 2007.csv" ...
# Годы, которые уже есть в справочнике, заменяются данными из выгрузки. Название, тип и категории издания берутся из самого позднего года.
import sys,csv,json,re,os
B=os.path.dirname(os.path.abspath(__file__)); P=B+'/data/ref.json'
f=lambda s: float(s.replace(',','.')) if s.strip() not in ('','-') else None
TY={'journal':0,'book series':1,'conference and proceedings':2,'trade journal':3}
d=json.load(open(P,encoding='utf-8')); oldY=d['sjYears']
J={}  # sid -> {iss, h:{y:(q,c)}, meta:(y,title,type,cats)}
for r in d['sj']:
    j=J.setdefault(r[4],{'iss':[x for x in r[1].split(' ') if x],'h':{},'meta':None})
    for k,y in enumerate(oldY):
        q,c=r[5+2*k],r[6+2*k]
        if q is not None or c is not None: j['h'][y]=(q,c)
    j['meta']=(max(j['h']) if j['h'] else 0,r[0],r[2],r[3])
newY=[]
for p in sys.argv[1:]:
    rows=list(csv.reader(open(p,encoding='utf-8-sig'),delimiter=';')); h=rows[0]; ix={}
    for i,k in enumerate(h): ix.setdefault(k,i)
    y=int(re.search(r'Total Docs\. \((\d{4})\)',' '.join(h)).group(1)); newY.append(y)
    for r in rows[1:]:
        if len(r)<len(h)-2: continue
        sid=int(r[ix['Sourceid']]); j=J.setdefault(sid,{'iss':[],'h':{},'meta':None})
        for x in r[ix['Issn']].split(','):
            x=x.strip().upper()
            if x not in ('','-') and x not in j['iss']: j['iss'].append(x)
        q=r[ix['SJR Best Quartile']]; q=int(q[1]) if q.startswith('Q') else 0
        c=f(r[ix['Citations / Doc. (2years)']]); j['h'][y]=(q,round(c,2) if c is not None else None)
        if not j['meta'] or y>=j['meta'][0]: j['meta']=(y,r[ix['Title']],TY.get(r[ix['Type']],0),r[ix['Categories']])
years=sorted(set(oldY)|set(newY)); sj=[]
for sid,j in J.items():
    hist=[]
    for y in years: hist+=list(j['h'][y]) if y in j['h'] else [None,None]
    m=j['meta']; sj.append([m[1],' '.join(j['iss']),m[2],'',sid]+hist)  # категории на странице не используются — не храним (экономия 5 МБ)
d['sjYears']=years; d['sj']=sj
json.dump(d,open(P,'w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
print(P,round(os.path.getsize(P)/1e6,2),'МБ; SCImago',years[0],'–',years[-1],len(sj),'изданий; добавлены годы',sorted(newY))
