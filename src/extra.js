/* ===== 0.8: справочник Scopus, режим «Журнал», индекс Хирша из нескольких баз, идентификаторы автора, поиск публикаций в документе =====
   Только правила, без сети и без ИИ. Функции чистые — проверяются в evals/run.js. */

/* ---------- 1. Справочник Scopus (правка 3) ----------
   data.sc = { date, rows: [[название, 'ISSN EISSN', ID Scopus, статус, годы, исключён, послед. год, том, выпуск, причина, принят]] }
   статус: 1 — Active, 0 — Inactive, 2 — принят, но ещё не загружен (лист Accepted Titles). Собирается mkdata_scopus.py из публичного Scopus Source List. */
function loadSc(R, sc) {
  R.sc = sc.rows; R.scDate = sc.date || ''; R.scIssn = new Map(); R.scTitle = new Map();
  const put = (m, k, i) => { if (!k) return; const a = m.get(k); if (a) { if (a.indexOf(i) < 0) a.push(i); } else m.set(k, [i]); };
  sc.rows.forEach((r, i) => { String(r[1] || '').split(' ').forEach(x => put(R.scIssn, x, i)); put(R.scTitle, norm(r[0]), i); });
}
/* «2026; 2023-2024», «1996-ongoing» → [[2023, 2024], [2026, 2026], …] */
function parseCoverage(s) {
  const out = [];
  String(s || '').split(/[;,]/).forEach(p => { const m = p.trim().match(/^(\d{4})\s*(?:[-–—]\s*(\d{4}|ongoing|present|current|н\.?\s*в\.?))?$/i); if (!m) return; const a = +m[1], b = m[2] ? (/^\d{4}$/.test(m[2]) ? +m[2] : 9999) : a; out.push([Math.min(a, b), Math.max(a, b)]); });
  return out.sort((x, y) => x[0] - y[0]);
}
function scRec(i) {
  const r = REF.sc[i];
  return { title: r[0], issns: String(r[1] || '').split(' ').filter(Boolean), id: r[2] || null, status: r[3], cov: parseCoverage(r[4]), covText: r[4] || '', flag: !!r[5],
    disc: r[6] || r[9] ? { year: r[6] || null, vol: r[7] || '', iss: r[8] || '', reason: r[9] || '' } : null, acc: r[10] || '' };
}
const scHas = () => !!(REF && REF.sc);
/* Статус издания в Scopus на год публикации */
function scAt(sc, year) {
  const o = { inCov: null, afterDisc: false, notes: [] };
  if (!sc) return o;
  if (sc.status === 2) { o.notes.push(`журнал принят в Scopus${sc.acc ? ' ' + sc.acc : ''}, но ещё не загружен в базу — проверьте`); return o; }
  // у действующего журнала последние годы индексации — год выпуска списка: более поздняя статья ещё не могла попасть в список, это не «не индексировался»
  const listY = +(String(REF.scDate || '').match(/\d{4}/) || [])[0] || new Date().getFullYear(), lastEnd = sc.cov.length ? sc.cov[sc.cov.length - 1][1] : 0;
  if (year && sc.cov.length && sc.status === 1 && year > lastEnd && lastEnd >= listY - 1) { o.inCov = true; return o; }
  if (year && sc.cov.length) { o.inCov = sc.cov.some(([a, b]) => year >= a && year <= b); if (!o.inCov) o.notes.push(`проверьте: в ${year} году журнал в Scopus не индексировался (годы в Scopus: ${sc.covText})`); }
  if (sc.disc && sc.disc.year && year && year > sc.disc.year) { o.afterDisc = true; o.notes.push(`проверьте: статья вышла после последнего номера, проиндексированного Scopus (${scDiscText(sc.disc)})`); }
  return o;
}
const scDiscText = d => [d.year, d.vol ? 'том ' + d.vol : '', d.iss ? 'выпуск ' + d.iss : ''].filter(Boolean).join(', ');
function scStatusText(sc) {
  if (!sc) return '';
  if (sc.status === 2) return `принят в Scopus${sc.acc ? ' ' + sc.acc : ''}, ещё не загружен`;
  if (sc.disc || sc.flag) return 'исключён из Scopus' + (sc.disc && sc.disc.year ? ', последний номер — ' + scDiscText(sc.disc) : '') + (sc.disc && sc.disc.reason ? ' (' + scReason(sc.disc.reason) + ')' : '');
  return (sc.status === 1 ? 'индексируется' : 'не индексируется сейчас (Inactive)') + (sc.covText ? ', годы: ' + sc.covText : '');
}
const scReason = r => /change\s*policy/i.test(r) ? 'по смене политики журнала' : (/discontinu/i.test(r) ? 'из-за качества' : r);
const scLink = sc => sc && sc.id ? 'https://www.scopus.com/sourceid/' + sc.id : '';
function findSc(issns, title) {
  if (!scHas()) return [null, null];
  const hit = new Set(); (issns || []).map(normIssn).forEach(x => (REF.scIssn.get(x) || []).forEach(i => hit.add(i)));
  if (hit.size) return [scRec([...hit][0]), hit.size === 1 ? 'issn' : 'ambiguous'];
  const t = norm(title); if (!t) return [null, null];
  const a = REF.scTitle.get(t) || REF.scTitle.get(t.replace(/^the /, '')); if (!a) return [null, null];
  return [scRec(a[0]), a.length === 1 ? 'title' : 'ambiguous'];
}

/* ---------- 1а. CiteScore Scopus (0.9, правка 6) ----------
   data.cs = { year, subj: [тематика], rows: [[Scopus Source ID, 'ISSN EISSN', название (если нет в SCImago и списке Scopus), CiteScore, SNIP, тип, [[тематика, процентиль, квартиль, место, из скольких], …]]] }
   Тематики — наилучшая первой. Собирается mkdata_citescore.py из файла Elsevier. Это отдельный показатель: квартиль SCImago не заменяет.
   Elsevier разрешил показ в бесплатной открытой утилите при указании источника и ссылке — подпись CS_SRC и ссылка на Scopus у каждого значения. */
function loadCs(R, cs) {
  R.cs = cs.rows; R.csYear = cs.year; R.csSubj = cs.subj || []; R.csId = new Map(); R.csIssn = new Map();
  cs.rows.forEach((r, i) => { if (r[0]) R.csId.set(r[0], i); String(r[1] || '').split(' ').filter(Boolean).forEach(x => { const a = R.csIssn.get(x); if (a) a.push(i); else R.csIssn.set(x, [i]); }); });
}
const csHas = () => !!(REF && REF.cs);
const CS_TYPE = { j: 'журнал', k: 'книжная серия', p: 'труды конференций', d: 'отраслевой журнал' };
function csRec(i) {
  const r = REF.cs[i], subs = (r[6] || []).map(s => ({ name: REF.csSubj[s[0]] || '', pct: s[1], q: s[2], rank: s[3], of: s[4] }));
  return { sid: r[0], issns: String(r[1] || '').split(' ').filter(Boolean), title: r[2] || '', v: r[3], snip: r[4], type: r[5] || '', subs, best: subs[0] || null, q: subs[0] ? subs[0].q : null, year: REF.csYear };
}
/* Издание в справочнике CiteScore: по Scopus Source ID (он же Sourceid SCImago), иначе по ISSN — только если ISSN указывает на одно издание */
function findCs(sids, issns) {
  if (!csHas()) return null;
  for (const s of (sids || [])) { const i = s != null ? REF.csId.get(+s) : undefined; if (i != null) return csRec(i); }
  const hit = new Set(); (issns || []).map(normIssn).forEach(x => (REF.csIssn.get(x) || []).forEach(i => hit.add(i)));
  return hit.size === 1 ? csRec([...hit][0]) : null;
}
const csSrc = cs => `Scopus CiteScore ${cs ? cs.year : (REF && REF.csYear) || ''}, © Elsevier B.V.`;
const csLink = cs => cs && cs.sid ? 'https://www.scopus.com/sourceid/' + cs.sid : '';
/* Короткая запись для таблиц и выгрузки: «10,7 Q1» */
const csShort = cs => !cs ? '' : (cs.v != null ? fmtNum(cs.v) + ' ' : '') + (cs.q ? 'Q' + cs.q : 'без квартиля');

/* ---------- 2. Режим «Журнал» (правка 5): название или ISSN → издание по справочникам SCImago, Белого списка и Scopus ---------- */
const ISSN_Q = /\b(\d{4})\s*[-–]?\s*(\d{3}[\dXxХх])\b/g;
const ABBR = { j: 'journal', zh: 'zhurnal', 'вузов': 'высших учебных заведений', 'вуз': 'высших учебных заведений', 'ран': 'российской академии наук', 'мгу': 'московского университета', 'спбгу': 'санкт петербургского университета' };  // остальные сокращения («Phys.», «Rev.», «Compd.») узнаются как начало слова
function jqTokens(s) {
  const raw = String(s || '').replace(/[«»"“”]/g, ' ');
  return norm(isCyr(raw) ? raw : raw).split(' ').filter(t => t && !/^(the|of|and|for|in|on|и|в|по|для|на)$/.test(t)).flatMap(t => (ABBR[t] || t).split(' '));
}
/* совпадение слов: 1 — то же слово; 0,9 — сокращение (начало слова, от 3 букв) или опечатка в одну букву; 0 — нет */
const jqTokEq = (a, b) => a === b ? 1 : ((a.length >= 3 && b.startsWith(a)) || (b.length >= 3 && a.startsWith(b)) || (Math.min(a.length, b.length) >= 5 && lev(a, b, 1) <= 1) ? 0.9 : (abbrOf(a, b) || abbrOf(b, a) ? 0.85 : 0));
/* сокращение без части букв: «compd» — «compounds», «mater» — «materials» (первые три буквы совпадают, остальные идут по порядку) */
function abbrOf(a, b) { if (a.length < 4 || a.length > 6 || a.length > b.length - 2 || a.slice(0, 3) !== b.slice(0, 3)) return false; let j = 3; for (let i = 3; i < a.length; i++) { j = b.indexOf(a[i], j); if (j < 0) return false; j++; } return true; }
/* Похожесть названий: доля совпавших слов (с допуском на опечатку и сокращения), кириллица сравнивается и в латинице */
function titleSim(q, t) {
  const A = jqTokens(q), B0 = jqTokens(t); if (!A.length || !B0.length) return 0;
  const tr = x => isCyr(x) ? translit(x) : x; return tokSim(A.map(tr), B0.map(tr));
}
/* Указатель названий всех трёх справочников: слова (кириллица — в латинице) и первые три буквы слова → записи */
function jIndex() {
  if (REF._ji) return REF._ji; const list = [], pre = new Map();
  const addT = (k, i, t) => { const toks = jqTokens(t).map(x => isCyr(x) ? translit(x) : x), id = list.length; list.push({ k, i, nn: norm(t), toks }); new Set(toks.map(x => x.slice(0, 3))).forEach(p => { let a = pre.get(p); if (!a) pre.set(p, a = []); a.push(id); }); };
  REF.sj.forEach((r, i) => addT('sj', i, r[0])); REF.wl.forEach((r, i) => r[0].split(' | ').forEach(t => addT('wl', i, t))); if (scHas()) REF.sc.forEach((r, i) => addT('sc', i, r[0]));
  if (csHas()) REF.cs.forEach((r, i) => { if (r[2]) addT('cs', i, r[2]); });  // у CiteScore название хранится, только если его нет в других справочниках
  return (REF._ji = { list, pre });
}
function tokSim(A, B) { if (!A.length || !B.length) return 0; const used = new Set(), seq = []; let m = 0; A.forEach(a => { let k = B.findIndex((b, i) => !used.has(i) && a === b); if (k < 0) k = B.findIndex((b, i) => !used.has(i) && jqTokEq(a, b)); if (k >= 0) { used.add(k); seq.push(k); m += jqTokEq(a, B[k]); } }); const ordered = seq.every((k, i) => !i || k > seq[i - 1]); return 2 * m / (A.length + B.length) * (ordered ? 1 : 0.92); }
/* Издание по всем трём справочникам: собрать записи, связанные общими ISSN */
function journalEntity(issns, seed) {
  const e = { sj: null, wl: null, sc: null, cs: null, issns: new Set(), notes: [] };
  (issns || []).map(normIssn).filter(Boolean).forEach(x => e.issns.add(x));
  if (seed) e[seed.k] = seed.rec;
  for (let pass = 0; pass < 2; pass++) {
    [e.sj, e.wl, e.sc, e.cs].filter(Boolean).forEach(r => r.issns.forEach(x => e.issns.add(normIssn(x))));
    const is = [...e.issns];
    if (!e.sj) { const h = new Set(); is.forEach(x => (REF.sjIssn.get(x) || []).forEach(i => h.add(i))); if (h.size) { e.sj = sjRec([...h][0]); if (h.size > 1) e.notes.push('в SCImago несколько изданий с этим ISSN — взято первое, проверьте'); } }
    if (!e.wl) { const h = new Set(); is.forEach(x => (REF.wlIssn.get(x) || []).forEach(i => h.add(i))); if (h.size) { e.wl = wlRec([...h][0]); if (h.size > 1) e.notes.push('в Белом списке несколько изданий с этим ISSN — взято первое, проверьте'); } }
    if (!e.sc && scHas()) { const h = new Set(); is.forEach(x => (REF.scIssn.get(x) || []).forEach(i => h.add(i))); if (h.size) e.sc = scRec([...h][0]); }
    if (!e.cs) e.cs = findCs([e.sj && e.sj.sid, e.sc && e.sc.id], is);
  }
  e.issns = [...e.issns]; e.title = (e.sj && e.sj.title) || (e.wl && e.wl.title.split(' | ')[0]) || (e.sc && e.sc.title) || (e.cs && e.cs.title) || '';
  e.key = e.issns.slice().sort().join(' ') || norm(e.title);
  return e;
}
/* Одна строка запроса → {issns, hits: [{e, score, how}], sure} */
function findJournalQuery(q) {
  q = String(q || '').trim(); const out = { q, issns: [], hits: [], sure: null, notes: [] }; if (!q) return out;
  let m; ISSN_Q.lastIndex = 0; while ((m = ISSN_Q.exec(q))) out.issns.push((m[1] + m[2]).toUpperCase().replace(/[ХХх]/g, 'X'));
  const title = q.replace(ISSN_Q, ' ').replace(/\b(issn|eissn|e-issn|p-issn)\b\s*:?/gi, ' ').replace(/\s+/g, ' ').trim();
  const seen = new Map(), add = (e, score, how) => { const o = seen.get(e.key); if (!o || o.score < score) seen.set(e.key, { e, score, how }); };
  if (out.issns.length) {
    const e = journalEntity(out.issns); if (e.sj || e.wl || e.sc || e.cs) add(e, 1, 'issn');
    if (title.length >= 3 && (e.sj || e.wl || e.sc || e.cs)) { const s = Math.max(e.sj ? titleSim(title, e.sj.title) : 0, e.wl ? Math.max(...e.wl.title.split(' | ').map(t => titleSim(title, t))) : 0, e.sc ? titleSim(title, e.sc.title) : 0); if (s < 0.6) out.notes.push(`по ISSN найдено «${e.title}», а название в запросе другое — проверьте`); }
  }
  if (!seen.size && title.length >= 2) {
    const J = jIndex(), qt = jqTokens(title).map(x => isCyr(x) ? translit(x) : x), nt = norm(title), cnt = new Map();
    new Set(qt.map(x => x.slice(0, 3))).forEach(pf => (J.pre.get(pf) || []).forEach(id => cnt.set(id, (cnt.get(id) || 0) + 1)));
    const need = Math.max(1, Math.ceil(new Set(qt.map(x => x.slice(0, 3))).size * 0.5));
    cnt.forEach((c, id) => { if (c < need) return; const x = J.list[id]; const sc = x.nn === nt ? 1 : Math.min(0.99, tokSim(qt, x.toks)); if (sc < 0.6) return; const rec = { sj: sjRec, wl: wlRec, sc: scRec, cs: csRec }[x.k](x.i); add(journalEntity(rec.issns, { k: x.k, rec }), sc, sc === 1 ? 'title' : 'similar'); });
  }
  out.hits = [...seen.values()].sort((a, b) => b.score - a.score || ((b.e.sj ? 1 : 0) - (a.e.sj ? 1 : 0))).slice(0, 8);
  const top = out.hits[0];
  // уверенно: по ISSN; или лучшее совпадение названия от 0,85 и заметно лучше следующего (на 0,1)
  if (top && top.how === 'title' && out.hits.filter(h => h.how === 'title').length === 1) out.sure = top;  // название совпало точно и только у одного
  else if (top && (top.how === 'issn' || (top.score >= 0.85 && !(out.hits[1] && out.hits[1].score > top.score - 0.1)))) out.sure = top;
  if (top && top.how === 'issn' && out.hits.filter(h => h.how === 'issn').length > 1) out.sure = null;
  return out;
}
/* Сведения об издании на год (год необязателен) — для показа и выгрузки */
function journalFacts(e, year) {
  const f = { title: e.title, issns: e.issns.map(fmtIssn), notes: e.notes.slice() };
  if (e.sj) { const jv = journalVerdict({ sj: e.sj, wl: null, sjHow: 'issn', wlHow: null }, year || null, null, null); Object.assign(f, { q: jv.qY, qYear: jv.sjYear, qExact: year ? jv.sjExact : true, qNow: jv.qL, qNowYear: jv.yL, cpd: jv.cpd, cpdNow: jv.cpdLast, hist: Object.keys(e.sj.hist).map(y => [+y, e.sj.hist[y].q, e.sj.hist[y].cpd]), cats: e.sj.cats, sid: e.sj.sid, type: e.sj.type }); if (year && !jv.sjExact) f.notes.push(jv.notes.find(n => /взят/.test(n)) || ''); }
  if (e.wl) { const a = wlAt(e.wl, year || null); Object.assign(f, { wlLv: a.excluded ? 'excl' : a.lv, wlYear: a.y, wlNow: a.curExcl ? 'excl' : a.cur, wlDisc: e.wl.disc, idx: { wos: e.wl.wos, scopus: e.wl.scopus, rsci: e.wl.rsci } }); if (e.wl.state === 1 && e.wl.notice) f.notes.push('примечание Белого списка: ' + e.wl.notice); }
  if (e.sc) { f.sc = scStatusText(e.sc); f.scId = e.sc.id; if (year) f.notes.push(...scAt(e.sc, year).notes); }
  if (e.cs) f.cs = e.cs;
  if (!e.sj && (e.sc || e.cs)) f.notes.push('в Scopus есть, квартиля SCImago нет' + (e.cs && e.cs.q ? ' — есть квартиль по CiteScore ' + e.cs.year : ''));
  f.notes = f.notes.filter(Boolean);
  return f;
}

/* ---------- 3. Идентификаторы автора из записи ORCID (правка 2): тип идентификатора и ссылки профиля ---------- */
function idFromOrcidItem(x) {
  const t = String(x.type || '').toLowerCase(), v = String(x.value || '').trim(), u = String(x.url || '');
  const fromUrl = s => { let m;
    if ((m = s.match(/elibrary\.ru\/author_profile\.asp\?(?:[^#]*&)?authorid=(\d+)/i))) return { b: 'rinc', v: m[1] };
    if ((m = s.match(/scopus\.com\/(?:authid\/detail\.uri|inward\/authorDetails\.url)\?(?:[^#]*&)?author[Ii][Dd]=(\d{6,})/))) return { b: 'scopus', v: m[1] };
    if ((m = s.match(/(?:webofscience\.com\/wos\/author\/rid|publons\.com\/researcher|researcherid\.com\/rid)\/([A-Z]{1,3}-\d{4}-\d{4})/i))) return { b: 'rid', v: m[1].toUpperCase() };
    return null; };
  if (/scopus/.test(t) && /^\d{6,}$/.test(v)) return { b: 'scopus', v };
  if (/researcher\s*id|researcherid|wos|web of science|publons/.test(t) && /^[A-Z]{1,3}-\d{4}-\d{4}$/i.test(v)) return { b: 'rid', v: v.toUpperCase() };
  if (/spin/.test(t) && /^\d{4}-?\d{4}$/.test(v)) return { b: 'spin', v: v.replace(/^(\d{4})-?(\d{4})$/, '$1-$2') };
  if (/elibrary|rinc|ринц|science\s*index|author\s*id.*(рос|rus)/.test(t) && /^\d{3,9}$/.test(v)) return { b: 'rinc', v };
  return fromUrl(u) || fromUrl(v);
}
/* Все идентификаторы с источниками; расхождения — «проверьте» */
function collectAuthorIds(parsed, info, orcList) {
  const ids = [], add = (b, v, src) => { v = String(v || '').trim(); if (!v) return; if (b === 'rid' || b === 'orcid') v = v.toUpperCase(); const o = ids.find(x => x.b === b && x.v === v); if (o) { if (o.src.indexOf(src) < 0) o.src.push(src); } else ids.push({ b, v, src: [src] }); };
  const p = parsed || {};
  add('orcid', p.orcid, 'введено'); add('scopus', p.scopus, 'введено'); add('rid', p.rid, 'введено'); add('rinc', p.rinc, 'введено'); add('spin', p.spin, 'введено');
  (info || []).forEach(a => { add('orcid', a.orcid, 'из OpenAlex'); add('scopus', a.scopus, 'из OpenAlex'); if (a.id) add('openalex', a.id, 'из OpenAlex'); });
  (orcList || []).forEach(x => { const r = idFromOrcidItem(x); if (r) add(r.b, r.v, 'из ORCID'); });
  const order = ['orcid', 'scopus', 'rid', 'rinc', 'spin', 'openalex']; ids.sort((a, b) => order.indexOf(a.b) - order.indexOf(b.b));
  const NM = { orcid: 'ORCID', scopus: 'Scopus', rid: 'Web of Science (ResearcherID)', rinc: 'eLibrary (РИНЦ AuthorID)', spin: 'eLibrary (SPIN-код)' }, warns = [];
  for (const b of ['orcid', 'scopus', 'rid', 'rinc', 'spin']) { const vs = ids.filter(x => x.b === b); if (vs.length > 1) warns.push(`${NM[b]}: идентификаторы различаются — ${vs.map(x => x.v + ' (' + x.src.join(', ') + ')').join(' и ')}. У автора бывает несколько профилей, но проверьте`); }
  return { ids, warns };
}

/* ---------- 4. Индекс Хирша со страницы профиля (правка 4) ----------
   Человек копирует страницу профиля автора (eLibrary, Scopus, Web of Science, Google Scholar) и вставляет её — утилита находит на ней индекс Хирша.
   Возвращает {base, val, label, alts: [{v, label}], cands, id, nameOk, err} */
const H_BASE_NAME = { openalex: 'OpenAlex', scopus: 'Scopus', wos: 'Web of Science', rinc: 'РИНЦ', gs: 'Google Scholar' };
function detectProfileBase(t) {
  if (/elibrary|ринц|science index|spin[-\s]?код|authorid/i.test(t)) return 'rinc';
  if (/i10[-\s]?index|i10-индекс|google\s*(scholar|академия)/i.test(t)) return 'gs';
  if (/web of science|researcherid|publons|clarivate/i.test(t)) return 'wos';
  if (/scopus|documents by author|author\s*id\s*:?\s*\d{8,}|h-graph|view h-graph|elsevier/i.test(t)) return 'scopus';
  return null;
}
function parseHirschPage(text, base, fios) {
  const t = String(text || '').replace(/\r/g, '').replace(/[ \t ]+/g, ' ');
  const o = { base: base || detectProfileBase(t), val: null, label: '', alts: [], cands: [], id: '', nameOk: null, err: '' };
  const num = s => { const v = parseInt(s, 10); return v >= 0 && v <= 300 ? v : null; };
  let m;
  if (o.base === 'rinc') {
    const R = [[/индекс\s+хирша\s+по\s+публикациям\s+в\s+ринц/i, 'по публикациям в РИНЦ'], [/индекс\s+хирша\s+по\s+всем\s+публикациям(?:\s+на\s+elibrary\.ru)?/i, 'по всем публикациям на elibrary.ru'], [/индекс\s+хирша\s+по\s+ядру\s+ринц/i, 'по ядру РИНЦ'], [/индекс\s+хирша\s+без\s+(?:учета|учёта)\s+самоцитирований/i, 'без самоцитирований'], [/индекс\s+хирша/i, '']];
    const found = [];
    R.forEach(([re, lab]) => { const g = new RegExp(re.source + '[^\\n\\d]{0,40}?[:\\s]\\s*(\\d{1,3})(?!\\d)', 'gi'); let mm; while ((mm = g.exec(t))) { const v = num(mm[1]); if (v != null && !found.some(f => f.idx === mm.index)) found.push({ v, label: lab, idx: mm.index }); } });
    // самый общий шаблон «индекс Хирша» ловит и строки с уточнением — оставить уточнённые
    const spec = found.filter(f => f.label), gen = found.filter(f => !f.label && !spec.some(s => s.idx === f.idx));
    const all = spec.concat(gen);
    const main = all.find(f => f.label === 'по публикациям в РИНЦ') || all.find(f => f.label === 'по всем публикациям на elibrary.ru') || all.find(f => !f.label) || all[0];
    if (main) { o.val = main.v; o.label = main.label; o.alts = all.filter(f => f !== main).map(f => ({ v: f.v, label: f.label || 'индекс Хирша' })); }
    if ((m = t.match(/author\s*id\s*:?\s*(\d{3,9})/i))) o.id = m[1]; else if ((m = t.match(/authorid=(\d{3,9})/i))) o.id = m[1];
    if ((m = t.match(/spin[-\s]?код\s*:?\s*(\d{4}-?\d{4})/i))) o.spin = m[1];
  } else if (o.base) {
    const lab = o.base === 'gs' ? /(?:h-index|индекс\s+хирша)/i : /h-?\s?index/i;
    const L = t.split('\n').map(s => s.trim());
    const cands = [];
    L.forEach((l, i) => {
      const mm = l.match(lab); if (!mm) return;
      const rest = l.slice(mm.index + mm[0].length), head = l.slice(0, mm.index);
      if (o.base === 'gs') { const g = rest.match(/^\s*(\d{1,3})(?:\s+(\d{1,3}))?/) || (!rest.trim() && (L[i + 1] || '').match(/^(\d{1,3})(?:\s+(\d{1,3}))?/)); if (g) { cands.push(num(g[1])); if (g[2] != null) o.alts.push({ v: num(g[2]), label: 'за последние 5 лет' }); } return; }
      // «h-index: 12» — число после подписи; иначе (Scopus, WoS: «12 h-index» или число строкой выше) — число перед подписью, а если его нет — после
      const colon = rest.match(/^\s*[:=]\s*(\d{1,3})\b/);
      const before = head.match(/(\d{1,3})\s*$/) || (!head.trim() && (L[i - 1] || '').match(/^(\d{1,3})$/));
      const after = rest.match(/^\s*(\d{1,3})\b/) || (!rest.trim() && (L[i + 1] || '').match(/^(\d{1,3})$/));
      const v = colon || before || after; if (v) cands.push(num(v[1]));
    });
    o.cands = [...new Set(cands.filter(v => v != null))];
    if (o.cands.length === 1) o.val = o.cands[0];
    if (o.base === 'scopus' && ((m = t.match(/author\s*id\s*:?\s*(\d{8,})/i)) || (m = t.match(/authorId=(\d{8,})/)))) o.id = m[1];
    if (o.base === 'wos' && (m = t.match(/\b([A-Z]{1,3}-\d{4}-\d{4})\b/))) o.id = m[1];
  }
  if (!o.base) o.err = 'не удалось понять, с какой базы страница — выберите базу';
  else if (o.val == null && o.cands.length > 1) o.err = 'на странице несколько чисел рядом с «h-index»: ' + o.cands.join(', ') + ' — проверьте и выберите';
  else if (o.val == null) o.err = 'индекс Хирша на странице не найден';
  if (fios && fios.length) { const low = norm(t), lowL = translit(low); o.nameOk = fios.some(f => translitVariants(f.sur).some(s => low.includes(norm(s)) || lowL.includes(norm(s))) || low.includes(norm(f.sur))); }
  return o;
}
/* Все полученные значения → наибольшее с подписью базы, остальные рядом; несколько разных значений одной базы — «проверьте» */
function hirschSummary(oaVals, pasted) {
  const vals = []; (oaVals || []).forEach(v => { if (v.h != null) vals.push({ base: 'openalex', v: v.h, src: 'OpenAlex, свой расчёт', id: v.id }); });
  (pasted || []).forEach(p => { if (p.val != null) vals.push({ base: p.base, v: p.val, src: 'со страницы профиля' + (p.label ? ', ' + p.label : ''), id: p.id || '', nameOk: p.nameOk }); });
  const warns = [];
  ['openalex', 'scopus', 'wos', 'rinc', 'gs'].forEach(b => { const vs = vals.filter(x => x.base === b); const u = [...new Set(vs.map(x => x.v))]; if (u.length > 1) warns.push(`${H_BASE_NAME[b]}: несколько значений (${vs.map(x => x.v + (x.id ? ' — профиль ' + x.id : '')).join(', ')}) — ${b === 'scopus' ? 'в Scopus несколько профилей автора' : 'несколько профилей'}, взято наибольшее; проверьте`); });
  vals.filter(x => x.nameOk === false).forEach(x => warns.push(`на странице ${H_BASE_NAME[x.base]} не найдена фамилия автора — проверьте, тот ли это профиль`));
  const best = vals.slice().sort((a, b) => b.v - a.v)[0] || null;
  const perBase = {}; vals.forEach(x => { if (!perBase[x.base] || perBase[x.base].v < x.v) perBase[x.base] = x; });
  return { vals, best, perBase, warns };
}

/* ---------- 5. Публикации в документе (правка 6) ----------
   pages: [[строка]], строка — текст или {cells: [{t, x}]} (ячейки таблицы; x — положение по горизонтали или номер столбца).
   Возвращает {records: [{text, page}], heading, pages, total, note} */
const DOC_HEAD = /^(?:\d+(?:\.\d+)*\.?\s*)?(?:(?:список|перечень)\s+(?:основных\s+|наиболее\s+значимых\s+|научных\s+|опубликованных\s+)*(?:научных\s+)?(?:публикаций|трудов|статей|работ)|(?:наиболее\s+значимые\s+|основные\s+|научные\s+|избранные\s+)*(?:научные\s+)?публикации|научные\s+труды|список\s+(?:использованной\s+)?литературы|литература|библиография|references|bibliography|(?:selected\s+|list\s+of\s+)?publications)(?![a-zа-яё])/i;
const DOC_HDR_COL = { auth: /автор/i, title: /названи|title|наименование\s+публикации|наименование\s+статьи/i, year: /^год|год\s+(?:публикации|издания)|year/i, jour: /издани|журнал|journal|source|источник/i, q: /квартил|quartile/i, ifc: /импакт|impact|\bif\b/i, doi: /doi/i, num: /^(?:№|n|no\.?|#)\s*(?:п\/п)?$/i };
const REC_START = /^\s*(?:\[(\d{1,3})\]|(\d{1,3})\s*[.)](?!\d))\s*(?=\S)/;
const AUTH_START = /^[A-ZА-ЯЁ][a-zа-яё'’-]+,?\s+[A-ZА-ЯЁ]\.\s?(?:[A-ZА-ЯЁ]\.)?(?:,|\s)/;
const lineText = l => typeof l === 'string' ? l : (l.cells || []).map(c => c.t).join('\t');
function recSignals(s) {
  let n = 0; if (DOI_RE.test(s)) n += 2;
  if (/\b(?:19[5-9]\d|20[0-4]\d)\b/.test(s)) n++;
  if (/(?:^|[\s.,;(])(?:Т\.|т\.|Vol\.?|V\.|№|No\.|N\s?\d|С\.|с\.|P\.|pp?\.|стр\.|Iss\.|Issue)\s*\d/.test(s)) n++;
  if (/\bISSN\b/i.test(s)) n++;
  if (/journal|журнал|вестник|известия|proceedings|letters|review|transactions|materials|science|доклады|труды|сборник|conference|конференц/i.test(s)) n++;
  return n;
}
/* Таблица из PDF: blk — строки с координатами {cells: [{t, x, w}], y, h}, первая — заголовок таблицы.
   Границы столбцов — просветы по горизонтали, где нет текста ни в одной строке; строка таблицы — от номера в первом столбце.
   Текст ячейки выровнен по верху (у номера на той же высоте есть текст других столбцов) — относится к строке, начатой выше;
   выровнен по середине — к ближайшему по высоте номеру. */
function geomTable(blk) {
  const it = []; blk.forEach((b, li) => { if (typeof b.l === 'string') return; b.l.cells.forEach(c => it.push({ t: c.t, x: c.x, w: c.w || c.t.length * (b.l.h || 10) * 0.5, y: b.l.y, h: b.l.h || 10, page: b.page, li })); });
  if (!it.length) return [];
  const x0 = Math.min(...it.map(i => i.x)), x1 = Math.max(...it.map(i => i.x + i.w)), W = Math.ceil(x1 - x0) + 2, cov = new Uint8Array(W);
  it.forEach(i => { for (let k = Math.floor(i.x - x0); k < Math.ceil(i.x + i.w - x0) && k < W; k++) if (k >= 0) cov[k] = 1; });
  const cols = []; let st = 0, gap = 0; const minGap = Math.max(3, (it[0].h || 10) * 0.35);
  for (let k = 0; k < W; k++) { if (cov[k]) { if (gap >= minGap && k - gap > st) { cols.push([x0 + st, x0 + k - gap]); st = k; } gap = 0; } else gap++; }
  cols.push([x0 + st, x1]);
  const colOf = i => { const c = i.x + Math.min(i.w, 20) / 2; let k = cols.findIndex(([a, b]) => c >= a - 1 && c <= b + 1); if (k < 0) k = cols.reduce((m, [a], q) => Math.abs(a - i.x) < Math.abs(cols[m][0] - i.x) ? q : m, 0); return k; };
  // ключи столбцов по заголовку (первая строка блока и её перенос — строки до первой строки с номером)
  it.forEach(i => { i.col = colOf(i); });
  const isNum = i => /^\d{1,3}\s*[.)]?$/.test(i.t.trim());
  const anchors = it.filter(i => i.col === 0 && isNum(i) && i.li > 0); if (!anchors.length) return [];
  const a0 = anchors[0], hy = blk[0].l.y;
  // строки между заголовком и первым номером: ближе к заголовку — перенос заголовка, ближе к номеру — начало первой строки таблицы
  const isHead = i => i.li === 0 || (i.li < a0.li && i.page === a0.page && Math.abs(i.y - hy) < Math.abs(i.y - a0.y));
  const head = cols.map((c, k) => it.filter(i => i.col === k && isHead(i)).sort((x, y) => y.y - x.y || x.x - y.x).map(i => i.t).join(' '));
  const keys = head.map((h, k) => { for (const key of Object.keys(DOC_HDR_COL)) if (DOC_HDR_COL[key].test(h.trim())) return key; return 'c' + k; });
  const body = it.filter(i => !isHead(i) && anchors.indexOf(i) < 0);
  // два способа отнести текст к строке: «по верху» и «по середине»; берётся тот, при котором ячейки лучше ложатся на номер строки
  const assign = mode => { const rows = anchors.map(a => ({ a, items: [] }));
    body.forEach(i => { const same = rows.filter(r => r.a.page === i.page); let r;
      if (mode === 'top') { r = same.filter(q => q.a.y >= i.y - i.h * 0.5).pop() || rows.filter(q => q.a.page < i.page).pop() || same[0]; }
      else r = same.slice().sort((p, q) => Math.abs(p.a.y - i.y) - Math.abs(q.a.y - i.y))[0] || rows[rows.length - 1];
      if (r) r.items.push(i); });
    let cost = 0; rows.forEach(r => { const by = {}; r.items.forEach(i => { if (i.page === r.a.page) (by[i.col] = by[i.col] || []).push(i.y); }); Object.values(by).forEach(ys => { const t = Math.max(...ys), m = (t + Math.min(...ys)) / 2; cost += Math.abs((mode === 'top' ? t : m) - r.a.y); }); });
    return { rows, cost }; };
  const T = assign('top'), M = assign('mid'), best = M.cost < T.cost ? M : T;
  return best.rows.map(r => { const o = { num: parseInt(r.a.t, 10), c: {}, page: r.a.page }; r.items.sort((a, b) => a.page - b.page || b.y - a.y || a.x - b.x).forEach(i => { const k = keys[i.col]; (o.c[k] = o.c[k] || []).push(i.t); }); return o; });
}
function findDocRecords(pages) {
  const P = (pages || []).map(pg => (pg || []).map(l => typeof l === 'string' ? l.replace(/\s+$/, '') : l));
  // колонтитулы: одна и та же строка (без цифр) в начале или конце многих страниц; голые номера страниц
  const rep = new Map(); if (P.length >= 3) P.forEach(pg => { const ends = pg.filter(l => lineText(l).trim()).slice(0, 2).concat(pg.filter(l => lineText(l).trim()).slice(-2)); new Set(ends.map(l => lineText(l).replace(/\d+/g, '#').trim())).forEach(k => rep.set(k, (rep.get(k) || 0) + 1)); });
  const isJunk = l => { const s = lineText(l).trim(); if (!s) return false; if (/^(?:подпись|м\.\s?п\.|руководитель\s+проекта\s*_|исполнитель\s*_|дата\s*_)/i.test(s) || /_{4,}/.test(s)) return true; if (/^(?:[-–—]?\s*\d{1,4}\s*[-–—]?|стр\.?\s*\d+(?:\s*из\s*\d+)?|page\s*\d+(?:\s*of\s*\d+)?|\d+\s*\/\s*\d+)$/i.test(s)) return true; const k = s.replace(/\d+/g, '#'); return P.length >= 3 && (rep.get(k) || 0) >= Math.max(3, Math.ceil(P.length * 0.5)); };
  const L = []; P.forEach((pg, pi) => pg.forEach(l => { if (!isJunk(l)) L.push({ l, page: pi + 1 }); }));
  // разделы со списком публикаций
  const isHead = s => s.length <= 140 && DOC_HEAD.test(s.trim()) && !(recSignals(s) >= 2 && /\b(19|20)\d{2}\b/.test(s));
  const isEnd = s => { const t = s.trim(); return t.length <= 120 && /^\d+\.\d+(?:\.\d+)*\.?\s+\S/.test(t) && !/\b(19[5-9]\d|20[0-4]\d)\b/.test(t) && !DOC_HEAD.test(t.replace(/^\d+(?:\.\d+)*\.?\s*/, '')); };
  const spans = []; let cur = null, heading = '';
  L.forEach((x, i) => { const s = lineText(x.l); if (isHead(s)) { if (cur) spans.push(cur); cur = [i + 1, L.length]; heading = heading || s.trim(); } else if (cur && isEnd(s)) { cur[1] = i; spans.push(cur); cur = null; } });
  if (cur) spans.push(cur);
  let use = spans.filter(([a, b]) => b > a).flatMap(([a, b]) => L.slice(a, b));
  const fromSections = use.length > 0; if (!fromSections) use = L;
  // таблица: строка-заголовок с названиями столбцов
  const recs = []; let cols = null, row = null, blank = false;
  const flushRow = () => { if (!row) return; const g = k => (row.c[k] || []).join(' ').replace(/\s+/g, ' ').trim(); const order = ['auth', 'title', 'year', 'jour', 'doi'];
    const parts = order.map(g).filter(Boolean); const other = Object.keys(row.c).filter(k => order.concat(['num', 'q', 'ifc']).indexOf(k) < 0).map(g).filter(Boolean);
    let text = parts.concat(other).join('. ').replace(/\.\s*\./g, '.'); const q = g('q'), ifc = g('ifc');
    if (q && /Q?\s*[1-4]/i.test(q)) text += '. Квартиль: ' + (q.match(/Q\s*[1-4]/i) ? q.match(/Q\s*[1-4]/i)[0].replace(/\s/g, '').toUpperCase() : 'Q' + q.match(/[1-4]/)[0]);
    if (ifc && /\d/.test(ifc)) text += '. ' + ifc.match(/\d{1,3}(?:[.,]\d{1,3})?/)[0];
    recs.push({ text: (row.num != null ? row.num + '. ' : '') + text, page: row.page, tbl: true, num: row.num != null }); row = null; };
  const hdrHits = l => { const hits = {}; l.cells.forEach((c, k) => { for (const key of Object.keys(DOC_HDR_COL)) if (DOC_HDR_COL[key].test(c.t.trim()) && !(key in hits)) { hits[key] = k; break; } }); return Object.keys(hits).filter(k => k !== 'num').length >= 2 && l.cells.every(c => c.t.length < 60) ? hits : null; };
  for (let ui = 0; ui < use.length; ui++) {
    const x = use[ui], l = x.l;
    // таблица из PDF (у строк есть координаты): столбцы — по просветам между текстом, строки таблицы — по номерам в первом столбце
    if (typeof l !== 'string' && l.y != null && l.cells && l.cells.length >= 2 && hdrHits(l)) {
      flushRow(); let j = ui + 1; const blk = [x];
      for (; j < use.length; j++) { const y = use[j]; if (typeof y.l === 'string') { if (!y.l.trim()) { blk.push(y); continue; } if (isEnd(y.l) || isHead(y.l)) break; } else if (isEnd(lineText(y.l)) || isHead(lineText(y.l))) break; blk.push(y); }
      geomTable(blk).forEach(r => { row = r; flushRow(); }); ui = j - 1; continue;
    }
    if (typeof l !== 'string' && l.y == null && l.cells && l.cells.length >= 2) {
      const hits = hdrHits(l);
      if (hits) { flushRow(); cols = l.cells.map((c, k) => ({ x: c.x, key: Object.keys(hits).find(h => hits[h] === k) || 'c' + k })); continue; }
      if (cols) {
        const cellsOf = l.cells.map(c => { let best = 0, bd = Infinity; cols.forEach((cc, k) => { const d = Math.abs(cc.x - c.x); if (d < bd) { bd = d; best = k; } }); return { key: cols[best].key, t: c.t.trim(), k: best }; });
        const first = cellsOf.find(c => c.k === 0); const nm = first && first.t.match(/^(\d{1,3})\s*[.)]?$/);
        if (nm || l.row || (!row && cellsOf.some(c => c.t))) { flushRow(); row = { num: nm ? +nm[1] : null, c: {}, page: x.page }; }
        cellsOf.forEach(c => { if (!c.t || (nm && c === first)) return; (row.c[c.key] = row.c[c.key] || []).push(c.t); });
        continue;
      }
    }
    if (cols && row) flushRow();
    const s = lineText(l).replace(/\t+/g, ' ').trim();
    if (!s) { blank = true; continue; }
    // новый номер — только следующий по порядку (или 1 — список начался заново); «11. P. 101» в середине записи — продолжение
    const rn = s.match(REC_START), rv = rn ? +(rn[1] || rn[2]) : null, lastN = (recs.filter(r => r.num && r.n != null).pop() || {}).n;
    const seqOk = rn && (lastN == null || rv === 1 || (rv > lastN && rv <= lastN + 3));
    if (seqOk || (!recs.length && !cols)) { recs.push({ text: s, page: x.page, num: !!seqOk, n: seqOk ? rv : null }); }
    else if (recs.length && !recs.some(r => r.num) && (blank || (AUTH_START.test(s) && /(?:\.|\d)$/.test(recs[recs.length - 1].text) && /\b(19[5-9]\d|20[0-4]\d)\b/.test(recs[recs.length - 1].text)))) recs.push({ text: s, page: x.page, num: false });
    else if (recs.length) recs[recs.length - 1].text += (/-$/.test(recs[recs.length - 1].text) && /^[a-zа-яё]/.test(s) ? '' : ' ') + s;
    blank = false;
  }
  flushRow();
  const hasNum = recs.some(r => r.num !== false && REC_START.test(r.text));
  let out = recs.map(r => ({ text: r.text.replace(/([a-zа-яё])-\s(?=[a-zа-яё])/g, '$1').replace(/\s+/g, ' ').trim(), page: r.page, tbl: r.tbl }))
    // в разделе со списком нумерованная запись с годом — публикация; строка таблицы (в том числе распознанной со скана: ячейки через « | ») — тоже
    .filter(r => r.text.length >= 30 && /\b(19[5-9]\d|20[0-4]\d)\b/.test(r.text) && (r.tbl || (fromSections && REC_START.test(r.text)) || (REC_START.test(r.text) && / \| [^|]+ \| /.test(r.text)) || (recSignals(r.text) >= 2 && (!hasNum || REC_START.test(r.text) || !fromSections))));
  // нумерация в документе сохраняется: «1.» … — запись начинается с номера
  out = out.map((r, i) => ({ text: REC_START.test(r.text) ? r.text : (i + 1) + '. ' + r.text, page: r.page }));
  const pgs = [...new Set(out.map(r => r.page))];
  return { records: out, heading: fromSections ? heading : '', pages: pgs, total: P.length, fromSections };
}
/* Квартиль, указанный в самом документе или списке («Q1», «Квартиль: Q2») */
function declQuartile(t) { const m = String(t || '').match(/(?:^|[\s(.,;|])(?:квартиль\s*:?\s*)?Q\s?([1-4])(?!\w|\.\d)/i); return m ? +m[1] : null; }

if (typeof module !== 'undefined') module.exports = { loadCs, findCs, csRec, csShort, loadSc, parseCoverage, scAt, findSc, findJournalQuery, journalFacts, titleSim, idFromOrcidItem, collectAuthorIds, parseHirschPage, hirschSummary, findDocRecords, declQuartile };
