/* ===== Запросы в открытые базы (Crossref, OpenAlex) ===== */
const NET = { orcid: 'https://pub.orcid.org', orcidToken: '', useORCID: true, crossref: 'https://api.crossref.org', openalex: 'https://api.openalex.org', wl: 'https://journalrank.rcsi.science/api', oaKey: '', useOA: true, useWL: true, wlCache: new Map(), srcCache: new Map(), log: [], fetch: null, pause: 120, timeout: 20000 };
const sleep = ms => new Promise(r => setTimeout(r, ms));
/* Запрос с ограничением времени: если база не ответила за ms, запрос обрывается и считается «нет связи» (раньше браузер мог ждать минутами) */
async function tfetch(url, opts, ms) {
  const f = NET.fetch || fetch; ms = ms || NET.timeout;
  const ac = typeof AbortController !== 'undefined' ? new AbortController() : null; let timer;
  const to = new Promise((_, bad) => { timer = setTimeout(() => { if (ac) ac.abort(); const e = new Error('нет ответа за ' + Math.round(ms / 1000) + ' с'); e.timeout = true; bad(e); }, ms); });
  try { return await Promise.race([f(url, Object.assign({}, opts || {}, ac ? { signal: ac.signal } : {})), to]); } finally { clearTimeout(timer); }
}
async function getJson(url, tries, ms) {
  tries = tries || 2;
  for (let k = 0; k < tries; k++) {
    let res;
    try { res = await tfetch(url, { headers: { Accept: 'application/json' } }, ms); }
    catch (e) { NET.log.push({ url, err: String(e.message || e) }); if (k + 1 < tries) { await sleep(800); continue; } const er = new Error(e.timeout ? e.message : 'нет связи'); er.kind = 'net'; throw er; }
    NET.log.push({ url, status: res.status });
    if (res.status === 404) return null;
    if (res.status === 429 || res.status >= 500) { if (k + 1 < tries) { await sleep(2500); continue; } const er = new Error(res.status === 429 ? 'база ограничила число запросов' : 'база временно недоступна (' + res.status + ')'); er.kind = 'limit'; throw er; }
    if (!res.ok) { const er = new Error('ответ базы ' + res.status); er.kind = res.status === 401 || res.status === 403 ? 'auth' : 'http'; throw er; }
    return res.json();
  }
}
const crYear = m => { for (const k of ['issued', 'published', 'published-print', 'published-online']) { const y = m[k] && m[k]['date-parts'] && m[k]['date-parts'][0] && m[k]['date-parts'][0][0]; if (y) return y; } return null; };
function crWork(m, via) {
  return { via, source: 'Crossref', doi: (m.DOI || '').toLowerCase(), title: (m.title || [])[0] || '', journal: (m['container-title'] || [])[0] || '', issns: m.ISSN || [], year: crYear(m), type: m.type || '',
    authors: (m.author || []).map(a => ({ given: a.given || '', family: a.family || '', name: a.name || '', orcid: (a.ORCID || '').replace(/^https?:\/\/orcid\.org\//, '') })) };
}
const CR_SELECT = 'DOI,title,author,container-title,ISSN,issued,type';
/* Поиск статьи: по DOI, если он есть в записи, иначе по тексту записи. null — не найдено. */
async function findWork(entry) {
  if (entry.doi) { const j = await getJson(`${NET.crossref}/works/${encodeURIComponent(entry.doi)}`); if (j && j.message) return crWork(j.message, 'doi'); }
  const j = await getJson(`${NET.crossref}/works?rows=4&select=${CR_SELECT}&query.bibliographic=${encodeURIComponent(entry.query.slice(0, 400))}`);
  const items = (j && j.message && j.message.items) || []; let best = null;
  for (const m of items) { const w = crWork(m, 'search'); w.score = titleScore(w.title, entry.query); if (w.title && (!best || w.score > best.score)) best = w; }
  return best;
}
const oaParam = () => NET.oaKey ? '&api_key=' + encodeURIComponent(NET.oaKey) : '';
/* Дополнение из OpenAlex: тип (article / review) и corresponding author. Ошибки не мешают основной проверке. */
async function enrichOA(work, leaderVars) {
  if (!NET.useOA || !work || !work.doi) return;
  let j; try { j = await getJson(`${NET.openalex}/works/https://doi.org/${work.doi}?select=id,type,authorships,primary_location${oaParam()}`, 1); } catch (e) { work.oaErr = e.message; if (e.kind === 'auth' || e.kind === 'limit' || e.kind === 'net') NET.useOA = false, NET.oaOff = e.message; return; }
  if (!j) return;
  work.oa = true;
  if (j.type === 'review' && work.type === 'journal-article') work.type = 'review';
  const au = j.authorships || [], corr = au.filter(a => a.is_corresponding);
  work.oaAuthors = au.map(oaShip);
  if (corr.length) work.corr = { known: true, leader: corr.some(a => sameSurname(String((a.author && a.author.display_name) || a.raw_author_name || '').trim().split(/\s+/).pop(), leaderVars)), names: corr.map(a => a.author && a.author.display_name).filter(Boolean) };
  else work.corr = { known: false };
  const src = j.primary_location && j.primary_location.source;
  if (src && src.issn && !work.issns.length) work.issns = src.issn;
  // показатель издания из OpenAlex — второй источник рядом с SCImago
  if (src && src.id) {
    const sid = String(src.id).split('/').pop();
    if (!NET.srcCache.has(sid)) { try { const sj = await getJson(`${NET.openalex}/sources/${sid}?select=id,summary_stats${oaParam()}`, 1); NET.srcCache.set(sid, sj && sj.summary_stats && typeof sj.summary_stats['2yr_mean_citedness'] === 'number' ? sj.summary_stats['2yr_mean_citedness'] : null); } catch (e) { NET.srcCache.set(sid, null); } }
    work.oaCpd = NET.srcCache.get(sid);
  }
}
/* Сайт Белого списка: уровень по ISSN. Если сайт не отвечает странице — отключается до конца проверки, остаётся справочник. */
async function enrichWL(work) {
  if (!NET.useWL || !work || !work.issns || !work.issns.length) return;
  const key = work.issns.map(normIssn).sort().join(' ');
  if (!NET.wlCache.has(key)) {
    let rec = { found: false };
    try {
      for (const x of work.issns) { const j = await getJson(`${NET.wl}/record-sources/${fmtIssn(normIssn(x))}/level`, 1); if (j && (j.id != null || j.title)) { rec = { found: true, levels: { 2023: j.level_2023 || 0, 2025: j.level_2025 || 0, 2026: j.level_2026 || 0 }, state: j.state === 'discontinued' ? 2 : (j.state === 'warning' ? 1 : 0), disc: j.datediscontinued || j.date_discontinued || '', notice: j.notice || '' }; break; } }
    } catch (e) { NET.useWL = false; NET.wlOff = e.message; return; }
    NET.wlCache.set(key, rec);
  }
  work.wlLive = NET.wlCache.get(key);
}
/* Автор статьи из OpenAlex: профиль, имя, ORCID, corresponding, организации (как распознаны базой; если не распознаны — как указаны в статье) */
const oaShip = a => ({ id: a.author && a.author.id ? String(a.author.id).split('/').pop() : '', name: (a.author && a.author.display_name) || a.raw_author_name || '', orcid: a.author && a.author.orcid ? String(a.author.orcid).replace(/^https?:\/\/orcid\.org\//, '') : '', corr: !!a.is_corresponding,
  inst: (a.institutions || []).map(x => ({ name: x.display_name || '', id: x.id ? String(x.id).split('/').pop() : '', ror: x.ror || '', cc: x.country_code || '' })).filter(x => x.name), raw: (a.raw_affiliation_strings || []).filter(Boolean) });
const cleanOrcid = s => { const m = String(s || '').toUpperCase().match(/\d{4}-?\d{4}-?\d{4}-?\d{3}[\dX]/); if (!m) return ''; const d = m[0].replace(/-/g, ''); return d.replace(/(.{4})(?=.)/g, '$1-'); };
/* Профили авторов в OpenAlex */
const OA_AUTHOR = 'id,ids,display_name,display_name_alternatives,orcid,works_count,cited_by_count,summary_stats,last_known_institutions';
const oaAuthor = a => ({ id: String(a.id).split('/').pop(), name: a.display_name || '', orcid: a.orcid ? String(a.orcid).replace(/^https?:\/\/orcid\.org\//, '') : '', works: a.works_count, cited: a.cited_by_count, h: a.summary_stats && a.summary_stats.h_index != null ? a.summary_stats.h_index : null, inst: (a.last_known_institutions || []).map(x => x.display_name).filter(Boolean).join('; '), country: (a.last_known_institutions || []).map(x => x.country_code).filter(Boolean).join(' '), alt: a.display_name_alternatives || [], scopus: a.ids && a.ids.scopus ? (String(a.ids.scopus).match(/(\d{6,})(?!.*\d{6,})/) || [])[1] || '' : '' });
async function authorInfo(ids) {
  const out = [];
  for (const id of ids.slice(0, 8)) { try { const j = await getJson(`${NET.openalex}/authors/${id}?select=${OA_AUTHOR}${oaParam()}`, 1); if (j) out.push(oaAuthor(j)); } catch (e) { } }
  return out;
}
/* Поиск автора по имени */
async function searchAuthors(name) {
  const j = await getJson(`${NET.openalex}/authors?search=${encodeURIComponent(name)}&per-page=10&select=${OA_AUTHOR}${oaParam()}`, 1);
  return ((j && j.results) || []).map(oaAuthor);
}
/* Точный поиск автора по ORCID. null — в базе нет. */
async function authorByOrcid(orcid) {
  const j = await getJson(`${NET.openalex}/authors/https://orcid.org/${orcid}?select=${OA_AUTHOR}${oaParam()}`, 1);
  return j && j.id ? oaAuthor(j) : null;
}
/* Реестр ORCID: поиск ORCID по внешнему идентификатору (Scopus ID, ResearcherID) или по имени.
   Возвращает {list:[{orcid,name,inst}], err}. Если реестр не отвечает странице — отключается до конца сеанса, поиск идёт дальше. */
async function orcidSearch(q, ms) {
  if (!NET.useORCID) return { list: [], err: NET.orcidOff || 'реестр ORCID отключён' };
  const url = `${NET.orcid}/v3.0/expanded-search/?q=${encodeURIComponent(q)}&rows=10`, h = { Accept: 'application/json' };
  if (NET.orcidToken) h.Authorization = 'Bearer ' + NET.orcidToken;
  let res; try { res = await tfetch(url, { headers: h }, ms); } catch (e) { NET.log.push({ url, err: String(e.message || e) }); NET.useORCID = false; NET.orcidOff = 'реестр ORCID не отвечает этой странице (' + (e.timeout ? e.message : 'нет связи или запрет запросов с чужих страниц') + ')'; return { list: [], err: NET.orcidOff }; }
  NET.log.push({ url, status: res.status });
  if (res.status === 401 || res.status === 403) { NET.useORCID = false; NET.orcidOff = 'реестр ORCID требует токен (поле «Токен ORCID» в настройках)'; return { list: [], err: NET.orcidOff }; }
  if (!res.ok) return { list: [], err: 'реестр ORCID ответил ' + res.status };
  const j = await res.json(), r = (j && j['expanded-result']) || [];
  return { list: r.map(x => ({ orcid: x['orcid-id'], name: [x['given-names'], x['family-names']].filter(Boolean).join(' '), inst: (x['institution-name'] || []).slice(0, 3).join('; ') })) };
}
/* Идентификаторы, привязанные к записи ORCID (Scopus Author ID, ResearcherID и др.). Реестр официально требует токен /read-public;
   без него пробуем так же. Возвращает {list:[{type, value, url}], err}. */
async function orcidExternalIds(orcid) {
  if (!NET.useORCID) return { list: [], err: NET.orcidOff || 'реестр ORCID отключён' };
  const url = `${NET.orcid}/v3.0/${orcid}/external-identifiers`, h = { Accept: 'application/json' };
  if (NET.orcidToken) h.Authorization = 'Bearer ' + NET.orcidToken;
  let res; try { res = await tfetch(url, { headers: h }); } catch (e) { NET.log.push({ url, err: String(e.message || e) }); return { list: [], err: 'реестр ORCID не отвечает этой странице' + (e.timeout ? ' (' + e.message + ')' : '') }; }
  NET.log.push({ url, status: res.status });
  if (res.status === 401 || res.status === 403) return { list: [], err: 'реестр ORCID требует токен (поле «Токен ORCID» в настройках)' };
  if (res.status === 404) return { list: [], err: 'запись ORCID не найдена' };
  if (!res.ok) return { list: [], err: 'реестр ORCID ответил ' + res.status };
  const j = await res.json(), r = (j && j['external-identifier']) || [];
  return { list: r.map(x => ({ type: x['external-id-type'] || '', value: String(x['external-id-value'] || '').trim(), url: x['external-id-url'] && x['external-id-url'].value || '' })).filter(x => x.value) };
}
/* Поиск автора по Scopus ID. База может такой поиск не поддерживать — тогда {err}. */
async function authorByScopus(sid) {
  try { const j = await getJson(`${NET.openalex}/authors?filter=scopus:${sid}&per-page=5&select=${OA_AUTHOR}${oaParam()}`, 1); return { list: ((j && j.results) || []).map(oaAuthor) }; }
  catch (e) { return { list: [], err: e.message }; }
}
/* Все статьи и обзоры автора (за все годы). who: {ids:[профили OpenAlex]} или {orcid}. Сначала OpenAlex, по ORCID запасной путь — Crossref. */
async function authorWorks(who, yearFrom) {
  if (typeof who === 'string') who = { orcid: who };
  const orcid = who.orcid || '';
  const out = { works: [], source: '', partial: false, err: '', capped: false };
  if (NET.useOA) {
    try {
      let cursor = '*', n = 0;
      while (cursor && n < 10) {
        const f = who.ids && who.ids.length ? 'author.id:' + who.ids.join('|') : 'author.orcid:' + orcid;
        const j = await getJson(`${NET.openalex}/works?filter=${f},type:article|review&sort=publication_year:desc&per-page=200&cursor=${encodeURIComponent(cursor)}&select=id,doi,title,publication_year,type,primary_location,authorships${oaParam()}`, 1);
        if (!j) break;
        for (const w of j.results || []) { const s = w.primary_location && w.primary_location.source; out.works.push({ oaId: w.id ? String(w.id).split('/').pop() : '', doi: (w.doi || '').replace(/^https?:\/\/doi\.org\//, '').toLowerCase(), title: w.title || '', year: w.publication_year, type: w.type, journal: s ? s.display_name : '', issns: s && s.issn ? s.issn : [], srcType: s ? s.type : '', authors: (w.authorships || []).map(oaShip) }); }
        cursor = j.meta && j.meta.next_cursor && (j.results || []).length ? j.meta.next_cursor : null; n++;
      }
      out.capped = !!cursor; out.source = 'OpenAlex'; return out;
    } catch (e) { out.err = 'OpenAlex: ' + e.message; out.works = []; }
  }
  if (!orcid) { const er = new Error(out.err || 'OpenAlex выключен, а без ORCID профиль взять негде'); throw er; }
  const j = await getJson(`${NET.crossref}/works?filter=orcid:${orcid},type:journal-article&rows=1000&select=${CR_SELECT}`);
  const items = (j && j.message && j.message.items) || [];
  out.works = items.map(m => { const w = crWork(m, 'orcid'); return { doi: w.doi, title: w.title, year: w.year, type: w.type, journal: w.journal, issns: w.issns }; });
  out.source = 'Crossref'; out.partial = true; return out;
}
/* Проверка связи: по одному короткому запросу в каждую базу, все одновременно, не дольше 12 с каждая.
   onEach(i, результат) вызывается по мере ответов; итог — в прежнем порядке: Crossref, Белый список, ORCID, OpenAlex */
const PING_MS = 12000;
async function pingAll(onEach) {
  const res = [];
  const one = async (i, name, url, ok) => { const t = Date.now(); let r; try { const j = await getJson(url, 1, PING_MS); r = { name, ok: !!(j && ok(j)), ms: Date.now() - t, msg: j && ok(j) ? 'отвечает' : 'ответ не того вида' }; } catch (e) { r = { name, ok: false, ms: Date.now() - t, msg: e.message }; } res[i] = r; if (onEach) onEach(i, r); };
  const orc = async () => { const t = Date.now(); const r = await orcidSearch('orcid:0000-0002-1825-0097', PING_MS); res[2] = { name: 'Реестр ORCID (поиск автора по Scopus ID, ResearcherID и имени)', ok: !r.err && r.list.length > 0, ms: Date.now() - t, msg: r.err || (r.list.length ? 'отвечает' : 'ответ не того вида') }; NET.useORCID = true; NET.orcidOff = ''; if (onEach) onEach(2, res[2]); };
  await Promise.all([
    one(0, 'Crossref (поиск статей)', `${NET.crossref}/works?rows=1&select=DOI,title&query.bibliographic=nature`, j => j.message && Array.isArray(j.message.items)),
    one(1, 'Сайт Белого списка (свежие уровни изданий)', `${NET.wl}/record-sources/0028-0836/level`, j => j.id != null || !!j.title),
    orc(),
    one(3, 'OpenAlex (тип статьи, corresponding author, профиль автора)', `${NET.openalex}/works?per-page=1&select=id${oaParam()}`, j => Array.isArray(j.results)),
  ]);
  return res;
}
/* ---------- Самопроверка: известные публикации с заранее записанными ответами ---------- */
const SELF = [
  { how: 'doi', q: '10.1126/science.1102896', doi: '10.1126/science.1102896', year: 2004, first: 'Novoselov', journal: 'Science' },
  { how: 'doi', q: '10.1038/s41586-021-03819-2', doi: '10.1038/s41586-021-03819-2', year: 2021, first: 'Jumper', journal: 'Nature', corr: 'Jumper' },
  { how: 'doi', q: '10.1103/PhysRevLett.116.061102', doi: '10.1103/physrevlett.116.061102', year: 2016, first: 'Abbott', journal: 'Physical Review Letters' },
  { how: 'doi', q: '10.1038/nmat1849', doi: '10.1038/nmat1849', year: 2007, first: 'Geim', journal: 'Nature Materials' },
  { how: 'doi', q: '10.1038/nature14539', doi: '10.1038/nature14539', year: 2015, first: 'LeCun', journal: 'Nature' },
  { how: 'doi', q: '10.1103/PhysRevB.54.11169', doi: '10.1103/physrevb.54.11169', year: 1996, first: 'Kresse', journal: 'Physical Review B' },
  { how: 'doi', q: '10.1103/PhysRevLett.77.3865', doi: '10.1103/physrevlett.77.3865', year: 1996, first: 'Perdew', journal: 'Physical Review Letters' },
  { how: 'doi', q: '10.1056/NEJMoa2034577', doi: '10.1056/nejmoa2034577', year: 2020, first: 'Polack', journal: 'New England Journal of Medicine' },
  { how: 'текст', q: 'Jumper J., Evans R., Pritzel A. et al. Highly accurate protein structure prediction with AlphaFold. Nature. 2021', doi: '10.1038/s41586-021-03819-2', year: 2021, first: 'Jumper', journal: 'Nature' },
  { how: 'текст', q: 'Novoselov K.S., Geim A.K., Morozov S.V. Electric field effect in atomically thin carbon films. Science. 2004', doi: '10.1126/science.1102896', year: 2004, first: 'Novoselov', journal: 'Science' },
  { how: 'текст', q: 'LeCun Y., Bengio Y., Hinton G. Deep learning. Nature. 2015', doi: '10.1038/nature14539', year: 2015, first: 'LeCun', journal: 'Nature' },
  { how: 'текст', q: 'Perdew J.P., Burke K., Ernzerhof M. Generalized gradient approximation made simple. Physical Review Letters. 1996', doi: '10.1103/physrevlett.77.3865', year: 1996, first: 'Perdew', journal: 'Physical Review Letters' },
];
async function runSelfCheck(onStep) {
  const out = [];
  for (let i = 0; i < SELF.length; i++) {
    const c = SELF[i]; if (onStep) onStep(i, SELF.length); const r = { c, checks: [], ok: false, err: '' };
    try {
      const e = parseEntry(c.q); if (c.how === 'doi') e.doi = c.doi; else e.doi = null;
      const w = await findWork(e);
      if (!w) r.err = 'не найдена';
      else {
        const j = findJournal(w.issns, w.journal); const jt = j.sj ? j.sj.title : w.journal;
        r.got = { doi: w.doi, year: w.year, first: w.authors[0] ? w.authors[0].family : '', journal: jt };
        r.checks = [['DOI', w.doi === c.doi], ['год', w.year === c.year], ['первый автор', sameSurname(r.got.first, [canonName(c.first)])], ['издание', norm(jt) === norm(c.journal)], ['издание найдено в SCImago по ISSN', j.sjHow === 'issn']];
        r.ok = r.checks.every(x => x[1]);
        // corresponding author — справочно, в итог не входит: зависит от того, разметила ли его база
        if (c.corr) { await enrichOA(w, []); const names = (w.oaAuthors || []).filter(x => x.corr).map(x => x.name); r.soft = ['corresponding (справочно)', names.some(n => sameSurname(n.trim().split(/\s+/).pop(), [canonName(c.corr)])), names.join(', ') || 'в базе не указан']; }
      }
    } catch (er) { r.err = er.message; }
    out.push(r); await sleep(NET.pause);
  }
  return out;
}
if (typeof module !== 'undefined') module.exports = { tfetch, PING_MS, oaShip, orcidExternalIds, NET, getJson, crWork, findWork, enrichOA, enrichWL, authorInfo, searchAuthors, authorByOrcid, authorByScopus, orcidSearch, runSelfCheck, SELF, authorWorks, cleanOrcid, pingAll };
