# Сборка встроенных справочников:
#   python3 mkdata.py journalrank_ДАТА.json scimagojr_2021.csv scimagojr_2022.csv ... (выгрузки SCImago за любые годы)
import sys,csv,json,re,os
B=os.path.dirname(os.path.abspath(__file__))
f=lambda s: float(s.replace(',','.')) if s.strip() not in ('','-') else None
TY={'journal':0,'book series':1,'conference and proceedings':2,'trade journal':3}
per={}
for p in sys.argv[2:]:
    rows=list(csv.reader(open(p,encoding='utf-8-sig'),delimiter=';')); h=rows[0]; ix={}
    for i,k in enumerate(h): ix.setdefault(k,i)
    y=int(re.search(r'Total Docs\. \((\d{4})\)',' '.join(h)).group(1)); per[y]=(rows[1:],ix)
years=sorted(per); J={}
for y in years:
    rows,ix=per[y]
    for r in rows:
        sid=int(r[ix['Sourceid']]); j=J.setdefault(sid,{'iss':[],'h':{}})
        for x in r[ix['Issn']].split(','):
            x=x.strip().upper()
            if x not in ('','-') and x not in j['iss']: j['iss'].append(x)
        q=r[ix['SJR Best Quartile']]; q=int(q[1]) if q.startswith('Q') else 0
        j['h'][y]=(q,f(r[ix['Citations / Doc. (2years)']]))
        j.update(title=r[ix['Title']],type=TY.get(r[ix['Type']],0),cats=r[ix['Categories']])  # берётся из последнего года, где издание есть
sj=[]
for sid,j in J.items():
    hist=[]
    for y in years: hist+=list(j['h'][y]) if y in j['h'] else [None,None]
    sj.append([j['title'],' '.join(j['iss']),j['type'],j['cats'],sid]+hist)
d=json.load(open(sys.argv[1],encoding='utf-8'))
m=re.search(r'(\d\d)_(\d\d)_(\d{4})',os.path.basename(sys.argv[1])); wldate='.'.join(m.groups()) if m else ''
notes=[]; nid={}; wl=[]; ST={None:0,'warning':1,'discontinued':2}
for r in d:
    n=r.get('notice'); k=0
    if n:
        if n not in nid: notes.append(n); nid[n]=len(notes)
        k=nid[n]
    fl=(1 if r['wos_cc'].get('value') else 0)|(2 if r['scopus'].get('value') else 0)|(4 if r['rsci'].get('value') else 0)
    wl.append([' | '.join(r['title']),' '.join(x.replace('-','').upper() for x in r['issns']),r.get('level_2023') or 0,r.get('level_2025') or 0,r.get('level_2026') or 0,ST[r.get('state')],k,r.get('date_discontinued') or '',fl])
out={'sjYears':years,'wlDate':wldate,'sj':sj,'wl':wl,'wlNotes':notes}
p=B+'/data/ref.json'; json.dump(out,open(p,'w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
print(p,round(os.path.getsize(p)/1e6,2),'МБ; SCImago',years,len(sj),'изданий; Белый список',wldate,len(wl))
# сколько изданий пересекали границу Q2/Q3 за эти годы
ch=sum(1 for j in J.values() if len({(q<=2) for q,_ in j['h'].values() if q})>1); al=sum(1 for j in J.values() if any(q for q,_ in j['h'].values()))
print('изданий с квартилем:',al,'; пересекали границу Q2/Q3:',ch, f'({round(100*ch/al,1)} %)')
ch2=sum(1 for j in J.values() if len({(c>=10) for _,c in j['h'].values() if c is not None})>1); print('пересекали порог 10 по «цитирований на документ»:',ch2)
