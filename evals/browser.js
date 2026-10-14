// Прогон страницы в браузере: снимок вымышленного списка → распознавание → проверка на подставных ответах баз.
// Запуск: LANG=C.UTF-8 node evals/browser.js
const { chromium } = require('playwright-core'); const fs = require('fs'), path = require('path'); const B = path.join(__dirname, '..');
const PUBS = [ // всё вымышлено, кроме названий изданий
  ['Sokolova A.V., Orlov D.K.', 'Alginate sorbents for oil spill response in cold seawater', 2023, 'Nature', '64,8', ['0028-0836'], 'journal-article', ['Sokolova', 'Orlov']],
  ['Orlov D.K., Sokolova A.V., Lebedev M.N.', 'Thermal transport in layered oxide ceramics under cyclic load', 2022, 'Physical Review B', '12,5', ['2469-9950'], 'journal-article', ['Orlov', 'Sokolova', 'Lebedev']],
  ['Sokolova A.V.', 'Biodegradation kinetics of brown algae polymers', 2019, 'Nano Letters', '9,6', ['1530-6984'], 'journal-article', ['Sokolova']],
  ['Sokolova A.V., Lebedev M.N.', 'Field trials of floating sorbent booms', 2024, 'Proceedings of the Coastal Engineering Conference', '', [], 'proceedings-article', ['Sokolova', 'Lebedev']],
  ['Соколова А.В., Орлов Д.К.', 'Модель переноса тепла в пористых сорбентах', 2024, 'Журнал технической физики', '', ['0044-4642'], 'journal-article', ['Sokolova', 'Orlov']],
  ['Sokolova A.V., Orlov D.K.', 'Imaginary paper that no database knows about', 2025, 'Journal of Nonexistent Results', '15,0', null, null, null],
];
const AID = { Sokolova: 'A1', Orlov: 'A2', Lebedev: 'A3' }, ANAME = { A1: 'Anna V. Sokolova', A2: 'Dmitry K. Orlov', A3: 'Mikhail N. Lebedev' };
// ожидания записаны до прогона: [найдена, в счёт, Вариант 2]; профиль за 2021–2025: Nature и PRB — да, ЖТФ — проверьте
const WANT = [['ok', 'ok', 'ok'], ['ok', 'ok', 'no'], ['ok', 'no', 'no'], ['ok', 'no', 'no'], ['ok', 'check', 'check'], ['no', 'unk', 'unk']];
const WANT_PROFILE = { ok: 2, check: 1, total: 3, all: 4 };
(async () => {
  const br = await chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium') && fs.statSync('/opt/pw-browsers/chromium').isFile() ? '/opt/pw-browsers/chromium' : undefined });
  const pg0 = await br.newPage({ viewport: { width: 1100, height: 600 } });
  await pg0.setContent(`<body style="font:13px Times New Roman;margin:10px"><b>2.3. Наиболее значимые научные публикации руководителя</b><style>td,th{border:1px solid #555;padding:4px}</style><table style="border-collapse:collapse;font:13px Times New Roman"><tr><th>№</th><th>Авторы публикации</th><th>Название публикации</th><th>Год</th><th>Наименование издания</th><th>Импакт-фактор</th></tr>${PUBS.map((p, i) => `<tr><td>${i + 1}.</td><td>${p[0]}</td><td>${p[1]}</td><td>${p[2]}</td><td>${p[3]}</td><td>${p[4]}</td></tr>`).join('')}</table></body>`);
  const shot = B + '/evals/list.png'; await (await pg0.$('body')).screenshot({ path: shot });
  const pg = await br.newPage({ viewport: { width: 1500, height: 1000 } }); const errs = []; pg.on('pageerror', e => { errs.push(String(e)); console.log('PAGEERR', String(e).slice(0, 300)); }); const hits = [];
  const json = (route, b, st) => route.fulfill({ status: st || 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(b) });
  const INST = { 0: 'Test University', 1: 'Other Institute of Physics', 4: 'Test University' };  // у Nano Letters (2) организация не указана
  const ash = (p, i) => p[7].map(f => ({ author: { id: 'https://openalex.org/' + AID[f], display_name: ANAME[AID[f]], orcid: null }, is_corresponding: i === 0 && f === 'Sokolova', institutions: INST[i] ? [{ id: 'https://openalex.org/I' + i, display_name: INST[i], country_code: 'RU' }] : [], raw_affiliation_strings: INST[i] ? [INST[i]] : [] }));
  let MODE = 'two'; const orcAuth = [];  // что отвечает поиск авторов OpenAlex по имени
  const OA = (id, name, extra) => Object.assign({ id: 'https://openalex.org/' + id, display_name: name, orcid: null, works_count: 4, summary_stats: { h_index: 3 }, last_known_institutions: [{ display_name: 'Вымышленный университет', country_code: 'RU' }] }, extra || {});
  const mock = async () => {
    await pg.route(/pub\.orcid\.org/, route => { const u = decodeURIComponent(route.request().url()); hits.push(u); orcAuth.push(route.request().headers()['authorization'] || '');
      if (/\/v3\.0\/0000-0002-1825-0097\/external-identifiers/.test(u)) return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ 'external-identifier': [{ 'external-id-type': 'Scopus Author ID', 'external-id-value': '57000000000' }, { 'external-id-type': 'ResearcherID', 'external-id-value': 'AAA-1234-2020' }] }) }); const one = { 'orcid-id': '0000-0002-1825-0097', 'given-names': 'Anna', 'family-names': 'Sokolova', 'institution-name': ['Вымышленный университет'] };
      const hit = /external-id-reference:"(6700000001|F-1234-2016)"/.test(u) || /orcid:0000-0002-1825-0097/.test(u) || /family-name:Sokolova/.test(u);
      route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ 'expanded-result': hit ? [one] : null, 'num-found': hit ? 1 : 0 }) }); });
    await pg.route(/journalrank\.rcsi\.science/, route => { const i = (route.request().url().match(/record-sources\/([^/]+)/) || [])[1]; const lv = { '0028-0836': [1, null], '2469-9950': [1, null], '1530-6984': [1, null], '0044-4642': [2, 1] }[i]; json(route, lv ? { id: 1, title: ['X'], issn: [i], level_2023: lv[0], level_2025: lv[1], level_2026: null, state: null } : {}, lv ? 200 : 404); });
    await pg.route(/api\.crossref\.org|api\.openalex\.org/, route => {
      const u = decodeURIComponent(route.request().url()); hits.push(u);
      if (/openalex/.test(u)) {
        if (/authors\?search=/.test(u)) { const r = MODE === 'two' ? [OA('A1', ANAME.A1), OA('A8', 'A. Sokolova', { works_count: 90, last_known_institutions: [] })]
            : MODE === 'many' ? [OA('A1', ANAME.A1, { orcid: 'https://orcid.org/0000-0002-1825-0097' }), OA('A8', 'A. Sokolova'), OA('A9', 'Anastasia Sokolova'), OA('A10', 'Anna Sokolova', { works_count: 30 }), OA('A12', 'Anna Sokolov')]
            : MODE === 'single' ? [OA('A1', ANAME.A1), OA('A8', 'A. Sokolova')]
            : MODE === 'similar' ? [OA('A1', ANAME.A1, { orcid: 'https://orcid.org/0000-0002-1825-0097' }), OA('A11', 'Anna V. Sokolova', { works_count: 1 })] : [];
          return json(route, { results: r }); }
        if (/authors\/https:\/\/orcid\.org\/0000-0002-1825-0097/.test(u)) return json(route, { id: 'https://openalex.org/A1', display_name: ANAME.A1, orcid: 'https://orcid.org/0000-0002-1825-0097', works_count: 4, summary_stats: { h_index: 3 }, last_known_institutions: [{ display_name: 'Вымышленный университет' }] });
        if (/filter=scopus:57000000000/.test(u)) return json(route, { results: [{ id: 'https://openalex.org/A1', display_name: ANAME.A1, orcid: null, works_count: 4, last_known_institutions: [] }] });
        let m = u.match(/authors\/(A\d+)/); if (m) return json(route, { id: m[1], display_name: ANAME[m[1]], orcid: null, works_count: 4, summary_stats: { h_index: 3 }, last_known_institutions: [{ display_name: 'Вымышленный университет' }] });
        m = u.match(/filter=author\.id:([A\d|]+)/); if (m) { const ids = m[1].split('|'); return json(route, { meta: { next_cursor: null }, results: PUBS.map((p, i) => [p, i]).filter(([p]) => p[6] === 'journal-article' && p[7].some(f => ids.includes(AID[f]))).map(([p, i]) => ({ doi: 'https://doi.org/10.5555/t' + i, title: p[1], publication_year: p[2], type: 'article', primary_location: { source: { display_name: p[3], issn: p[5], type: 'journal' } }, authorships: ash(p, i), id: 'https://openalex.org/W' + i })) }); }
        m = u.match(/works\/https:\/\/doi\.org\/10\.5555\/t(\d)/); if (m) return json(route, { id: 'W' + m[1], type: 'article', authorships: ash(PUBS[+m[1]], +m[1]), primary_location: null });
        return json(route, { results: [] });
      }
      const q = (u.match(/query\.bibliographic=([^&]*)/) || [])[1] || ''; const nq = q.toLowerCase();
      const hit = PUBS.filter(p => p[6]).map((p, i) => [p, i, p[1].toLowerCase().split(' ').filter(w => nq.includes(w.slice(0, 5))).length / p[1].split(' ').length]).sort((a, b) => b[2] - a[2])[0];
      const it = ([p, i]) => ({ DOI: '10.5555/t' + i, title: [p[1]], 'container-title': [p[3]], ISSN: p[5], issued: { 'date-parts': [[p[2]]] }, type: p[6], author: p[7].map((f, k) => ({ given: 'X.', family: f, sequence: k ? 'additional' : 'first' })) });
      json(route, { status: 'ok', message: { items: hit ? [it(hit)] : [] } });
    });
  };
  await mock();
  const URL0 = 'file://' + B + '/dist/' + encodeURIComponent(fs.readdirSync(B + '/dist').filter(f => f.endsWith('.html'))[0]);
  const idle = () => pg.waitForFunction(() => !BUSY, null, { timeout: 60000 });
  const listState = () => pg.evaluate(() => ({ n: W.pubs.length, found: W.pubs.map(p => p.found), q: W.pubs.map(p => p.jv ? [p.jv.qY, p.jv.sjYear] : null), kd: W.pubs.map(p => [p.found, p.counts, p.v2]) }));
  const auState = () => pg.evaluate(() => ({ loaded: !!(AU.prof && !AU.prof.err), n: AU.prof && AU.prof.js ? AU.prof.js.length : 0, how: AU.prof && AU.prof.how, cands: AU.cands ? AU.cands.length : null, msgs: AU.msgs, name: AU.prof && AU.prof.info && AU.prof.info[0] && AU.prof.info[0].name }));
  const out = [], T = (name, ok, got) => out.push(`${ok ? 'верно  ' : 'НЕВЕРНО'} — ${name}${ok ? '' : ': ' + JSON.stringify(got)}`);
  await pg.goto(URL0);
  // 1. только снимок списка
  const t0 = Date.now(); await pg.setInputFiles('#file', shot);
  await pg.waitForFunction(() => /распознан|не распознан/.test(document.getElementById('ocrmsg').textContent) && !BUSY, null, { timeout: 180000 });
  const ocrSec = Math.round((Date.now() - t0) / 1000);
  await pg.click('#go'); await pg.waitForFunction(() => /Готово|неполный/.test(document.getElementById('status').textContent) && !BUSY, null, { timeout: 60000 });
  let L = await listState(), a = await auState();
  T('снимок: 6 записей, 5 найдены, шестая «не найдена»', L.n === 6 && JSON.stringify(L.found) === '["ok","ok","ok","ok","ok","no"]', L);
  T('снимок: квартили Nature Q1 (2023), PRB Q1 (2022), Nano Letters Q1 (взят 2021)', JSON.stringify(L.q.slice(0, 3)) === '[[1,2023],[1,2022],[1,2021]]', L.q);
  T('снимок: общий автор списка найден сам, показаны все его 4 статьи', a.loaded && a.n === 4 && a.name === 'Anna V. Sokolova', a);
  const links = await pg.evaluate(() => [...document.querySelectorAll('#outAuthor > table.t tr')].slice(1).map(tr => (tr.querySelector('td:nth-child(2) a') || {}).href || ''));
  T('у каждой публикации автора есть ссылка', links.length === 4 && links.every(h => /^https:\/\/doi\.org\/10\.5555\/t\d$/.test(h)), links);
  const kdTxt = await pg.evaluate(() => { const t = document.body.innerText + document.getElementById('changes').textContent + document.title; return [/\bКД\b|конкурсн|Вариант [1-4]|в счёт/i.test(t), !!document.getElementById('kdOn')]; });
  T('на странице нет упоминаний заявок', !/заявк|п\. 1\.6/i.test(await pg.evaluate(() => document.body.innerText + document.getElementById('changes').textContent + document.getElementById('author').placeholder + document.getElementById('org').placeholder)), 'есть');
  T('на странице нет упоминаний КД, вариантов и блока проверки по КД', !kdTxt[0] && !kdTxt[1], kdTxt);
  await pg.screenshot({ path: B + '/evals/shot_ocr.png', fullPage: true });
  if (process.env.VARIANTS) {  // макеты оформления: подключить CSS вариантов и снять верх страницы и таблицу
    for (const v of process.env.VARIANTS.split(',')) {
      await pg.evaluate(css => { let el = document.getElementById('vcss'); if (!el) { el = document.createElement('style'); el.id = 'vcss'; document.head.appendChild(el); } el.textContent = css; document.querySelectorAll('.card:has(>h2)').forEach((c, i) => c.classList.toggle('alt', i % 2 === 0)); }, fs.readFileSync(process.env.VDIR + '/v' + v + '.css', 'utf8'));
      await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(300);
      await pg.screenshot({ path: process.env.VDIR + '/top_' + v + '.png', clip: { x: 0, y: 0, width: 1500, height: 820 } });
      const y = await pg.evaluate(() => document.getElementById('outList').getBoundingClientRect().top + scrollY);
      await pg.screenshot({ path: process.env.VDIR + '/tab_' + v + '.png', clip: { x: 0, y: y - 10, width: 1500, height: 560 }, fullPage: true });
    }
    await br.close(); process.exit(0);
  }
  // 2. фильтры (ожидания: список — Nature Q1/БС1, PRB Q1/БС1, Nano Letters Q1/БС1 (2019 → уровень 2023), доклад — без квартиля и вне БС, ЖТФ 2024 — нет в SCImago, БС ур. 2 (сейчас 1), шестая не найдена)
  const shownList = () => pg.evaluate(() => listRows().map(r => r.i + 1));
  const auRows = () => pg.locator('#outAuthor > table.t tr').count().then(n => n - 1);  // таблица публикаций; таблица профилей лежит в .plinks
  await pg.evaluate(() => { FLT.au.yFrom = 2021; renderAuthor(); }); T('автор: годы с 2021 — 3 статьи', await auRows() === 3, await auRows()); await pg.evaluate(() => resetFlt('au'));
  await pg.evaluate(() => { setFlt('list', 'q', '1', true); }); let sl = await shownList(); T('список: только Q1 — № 1, 2, 3', sl.join() === '1,2,3', sl);
  await pg.evaluate(() => { setFlt('list', 'q', '1', false); setFlt('list', 'wl', '2', true); }); sl = await shownList(); T('список: БС уровень 2 на год публикации — ЖТФ 2024 (№ 5)', sl.join() === '5', sl);
  await pg.evaluate(() => { setFlt('list', 'wl', '2', false); setFlt('list', 'wl', '1', true); }); sl = await shownList(); T('список: БС уровень 1 — № 1, 2, 3 (ЖТФ 2024 ещё уровня 2)', sl.join() === '1,2,3', sl);
  await pg.evaluate(() => { setFlt('list', 'q', 'none', true); }); sl = await shownList(); T('список: БС 1 или без квартиля — № 1, 2, 3, 4, 5', sl.join() === '1,2,3,4,5', sl);
  const cnt = await pg.evaluate(() => document.querySelector('#outList .cnt').innerText); T('список: счётчик «показано 5 из 6»', /5\s+из 6/.test(cnt), cnt);
  await pg.evaluate(() => resetFlt('list')); sl = await shownList(); T('список: сброс фильтра — все 6', sl.length === 6, sl);
  await pg.evaluate(() => { setFlt('au', 'q', '1', true); setFlt('au', 'wl', '1', true); }); T('автор: Q1 или БС 1 — 3 статьи из 4', await auRows() === 3, await auRows()); await pg.evaluate(() => resetFlt('au'));
  // 2а. corresponding и ссылки
  const corr = await pg.evaluate(() => [...document.querySelectorAll('#outList table.t tr')].slice(1, 3).map(tr => tr.children[6].innerText.split('\n')[0]));
  T('corresponding: отмечен в базе — имя; не отмечен — «в базе не указан», без подстановки', /Anna V\. Sokolova/.test(corr[0]) && /не указан/.test(corr[1]), corr);
  const last = await pg.evaluate(() => document.querySelectorAll('#outList table.t tr')[2].children[6].innerText); T('справочно показан последний автор', /последний:\s*X\. Lebedev/.test(last), last);
  const dl = await pg.evaluate(() => [...document.querySelectorAll('#outList table.t tr')].slice(1, 6).map(tr => [...tr.children[1].querySelectorAll('a')].some(a => a.textContent.trim() === a.href)));
  T('адрес DOI под статьёй — ссылка', dl.every(Boolean), dl);
  const wlTxt = await pg.evaluate(() => document.querySelectorAll('#outList table.t tr')[5].children[4].innerText); T('ЖТФ 2024: уровень 2 (2023) и «сейчас уровень 1»', /уровень 2/.test(wlTxt) && /сейчас уровень 1/.test(wlTxt), wlTxt);
  // ===== 0.7: corresponding, фильтры, организация, дубли (ожидания записаны до прогона) =====
  const c07 = await pg.evaluate(() => [...document.querySelectorAll('#outList table.t tr')].slice(1, 3).map(tr => tr.children[6].innerText));
  T('0.7 список: у найденного автора — corresponding «да» (Nature) и «в базе не указан» (PRB)', /corresponding:\s*да/.test(c07[0]) && /corresponding:\s*в базе не указан/.test(c07[1]), c07);
  const corrCol = await pg.evaluate(() => [...document.querySelectorAll('#outAuthor table.t')].pop().rows[0].innerText);
  T('0.7 автор: отдельная колонка «Corresponding» и «Организация»', /Corresponding/.test(corrCol) && /Организация/.test(corrCol), corrCol);
  await pg.evaluate(() => setFlt('au', 'corr', 'yes', true)); T('0.7 автор: фильтр «corresponding — да» — 1 статья', await auRows() === 1, await auRows()); await pg.evaluate(() => resetFlt('au'));
  await pg.evaluate(() => setFlt('list', 'corr', 'yes', true)); sl = await shownList(); T('0.7 список: фильтр corresponding работает при найденном авторе — № 1', sl.join() === '1', sl); await pg.evaluate(() => resetFlt('list'));
  await pg.evaluate(() => setFltY('list', 'ifFrom', '20')); sl = await shownList(); const cnt20 = await pg.evaluate(() => document.querySelector('#outList .cnt').innerText);
  T('0.7 список: показатель от 20 — только Nature (№ 1), ненайденные по SCImago скрыты и посчитаны', sl.join() === '1' && /скрыто\s*\d/.test(cnt20), [sl, cnt20]); await pg.evaluate(() => resetFlt('list'));
  await pg.fill('#org', 'Test University'); await pg.dispatchEvent('#org', 'change');
  const orgN = async v => { await pg.evaluate(v => { resetFlt('au'); setFlt('au', 'org', v, true); }, v); return auRows(); };
  const o1 = await orgN('yes'), o2 = await orgN('no'), o3 = await orgN('unk'); await pg.evaluate(() => resetFlt('au'));
  T('0.7 организация: совпадает — 2 статьи, другая — 1, не указана — 1', o1 === 2 && o2 === 1 && o3 === 1, [o1, o2, o3]);
  const orgCell = await pg.evaluate(() => document.querySelectorAll('#outList table.t tr')[1].children[6].innerText); T('0.7 список: организация автора и «совпадает»', /Test University/.test(orgCell) && /совпадает/.test(orgCell), orgCell);
  await pg.fill('#org', ''); await pg.dispatchEvent('#org', 'change');
  // 4. автор по строке идентификаторов (ORCID)
  await pg.fill('#author', 'AAA-1234-2020/57000000000/0000-0002-1825-0097'); await pg.click('#ago'); await idle(); a = await auState();
  T('строка идентификаторов: найден по ORCID, 4 статьи', a.loaded && a.n === 4 && /ORCID 0000-0002-1825-0097/.test(a.how), a);
  const ext = await pg.evaluate(() => [...document.querySelectorAll('#outAuthor a')].map(x => x.href).filter(h => /scopus\.com|webofscience|orcid\.org/.test(h)).length); T('ссылки на профили ORCID, Scopus и WoS показаны', ext >= 3, ext);
  // 0.7: блок «Профили автора»
  const pl = await pg.evaluate(() => { const b = document.querySelector('#outAuthor .plinks'); if (!b) return null; const rows = [...b.querySelector('table.t').querySelectorAll('tr')].slice(1).map(tr => [tr.children[0].innerText, tr.children[1].innerText, tr.children[2].innerText]); return { rows, warn: /различаются/.test(b.innerText), search: [...b.querySelectorAll('a')].some(a => /scholar\.google\.com\/citations\?view_op=search_authors/.test(a.href)) }; });
  const plOk = pl && pl.rows.length === 4 && pl.rows.some(r => /Scopus/.test(r[0]) && /введено/.test(r[2]) && /из ORCID/.test(r[2])) && pl.rows.some(r => /Web of Science/.test(r[0]) && /из ORCID/.test(r[2])) && pl.rows.some(r => /OpenAlex/.test(r[0])) && !pl.warn && pl.search;
  T('0.7 профили автора: ORCID, Scopus, WoS, OpenAlex с источниками, без расхождений, есть поиск в Google Scholar', plOk, pl);
  await pg.fill('#author', 'AAA-1234-2020/57000000001/0000-0002-1825-0097'); await pg.click('#ago'); await idle();
  const plw = await pg.evaluate(() => (document.querySelector('#outAuthor .plinks') || {}).innerText || '');
  T('0.7 профили автора: Scopus ID в заявке и в ORCID разные — предупреждение', /Scopus: идентификаторы различаются/.test(plw), plw.slice(0, 300));
  // токен ORCID: встроенный подставляется, если поле пустое; введённый в поле — важнее (ожидания записаны до прогона)
  { const bt = await pg.evaluate(() => ORCID_BUILTIN); const last = orcAuth[orcAuth.length - 1] || '';
    T('токен ORCID: ' + (bt ? 'встроенный уходит в запросы реестра' : 'не встроен — запросы без токена'), bt ? last === 'Bearer ' + bt : last === '', [bt, last]);
    await pg.evaluate(() => { document.getElementById('orcidToken').value = 'own-token-0000'; applyNet(); }); T('токен ORCID: значение из поля важнее встроенного', await pg.evaluate(() => NET.orcidToken) === 'own-token-0000', await pg.evaluate(() => NET.orcidToken));
    await pg.evaluate(() => { document.getElementById('orcidToken').value = ''; applyNet(); try { localStorage.removeItem('pc_orcidToken'); } catch (e) { } }); }
  { const ok = await pg.evaluate(() => OA_BUILTIN); const oaU = hits.filter(u => /api\.openalex\.org/.test(u)).pop() || '';
    T('ключ OpenAlex: ' + (ok ? 'встроенный уходит в запросы' : 'не встроен — запросы без ключа'), ok ? oaU.includes('api_key=' + ok) : !/api_key=/.test(oaU), [ok, oaU.slice(0, 160)]); }
  // 0.7.5: индекс Хирша по базам (ожидания записаны до прогона): строки Scopus, WoS, РИНЦ, OpenAlex; Scopus — ссылка на профиль 57000000000; OpenAlex — 3; вписанное значение сохраняется
  { const hr = await pg.evaluate(() => { const t = [...document.querySelectorAll('#outAuthor .plinks table.t')].pop(); return t ? [...t.rows].slice(1).map(r => [r.cells[0].innerText.trim(), r.cells[1].innerText.trim(), [...r.cells[2].querySelectorAll('a')].map(a => a.href).join(' ')]) : null; });
    T('Хирш: строки Scopus, WoS, РИНЦ, OpenAlex; Scopus — ссылка на профиль из заявки; OpenAlex — 3', hr && hr.map(r => r[0]).join('|') === 'Scopus|Web of Science|РИНЦ (eLibrary)|OpenAlex' && /authorId=57000000001/.test(hr[0][2]) && /webofscience\.com\/wos\/author\/rid\/AAA-1234-2020/.test(hr[1][2]) && hr[3][1] === '3', hr);
    await pg.evaluate(() => setHirsch(-1, 'scopus', '15'));
    await (await pg.$('#outAuthor .plinks')).screenshot({ path: B + '/evals/shot_hirsch.png' });
    const kept = await pg.evaluate(() => [...document.querySelectorAll('#outAuthor .plinks input')][0].value); T('Хирш: вписанное значение Scopus сохраняется после перерисовки', kept === '15', kept); }
  // 5. ORCID с ошибкой + Scopus ID
  await pg.fill('#author', '0000-0002-1825-0098 57000000000'); await pg.click('#ago'); await idle(); a = await auState();
  T('ORCID с ошибкой отмечен, автор найден по Scopus ID', a.loaded && /Scopus ID/.test(a.how) && a.msgs.some(m => /ошибк/.test(m)), a);
  // 6. фамилия при найденном списке
  await pg.fill('#author', 'Соколова Анна Викторовна'); await pg.click('#ago'); await idle(); a = await auState();
  T('ФИО при найденном списке: автор взят из статей списка', a.loaded && a.n === 4 && /из списка/.test(a.how), a);
  // 7. снимок с идентификаторами
  const pg1 = await br.newPage({ viewport: { width: 1100, height: 300 } });
  await pg1.setContent('<body style="font:15px Times New Roman;margin:10px"><b>1.6. Наукометрические показатели</b><style>td{border:1px solid #333;padding:5px}</style><table style="border-collapse:collapse;font:15px Times New Roman"><tr><td><i>WoS ResearcherID/Scopus ID/РИНЦ AuthorID (при наличии)</i></td><td>AAA-1234-2020/57000000000/0000-0002-1825-0097</td></tr><tr><td>Индекс Хирша по WoS/Scopus/РИНЦ</td><td>17</td></tr></table></body>');
  const shot2 = B + '/evals/ids.png'; await (await pg1.$('body')).screenshot({ path: shot2 }); await pg1.close();
  await pg.setInputFiles('#afile', shot2); await pg.waitForFunction(() => !BUSY && /Сверьте|не распознан/.test(document.getElementById('aparsed').textContent), null, { timeout: 120000 });
  await pg.screenshot({ path: B + '/evals/shot_ids.png' });
  const parsed = await pg.evaluate(() => parseAuthorInput(document.getElementById('author').value)); const idsOk = parsed.orcid === '0000-0002-1825-0097' && parsed.scopus === '57000000000' && parsed.rid === 'AAA-1234-2020';
  // 8. только ФИО, без списка
  await pg.goto(URL0); await pg.fill('#author', 'Соколова Анна'); await pg.click('#ago'); await idle(); a = await auState();
  T('только ФИО: показаны кандидаты, сам не выбирает', !a.loaded && a.cands === 2, a);
  await pg.click('button[onclick^="pickAuthor(\'A1\')"]'); await idle(); a = await auState(); T('после выбора кандидата: 4 статьи', a.loaded && a.n === 4, a);
  const pln = await pg.evaluate(() => { const b = document.querySelector('#outAuthor .plinks'); return b ? { rows: [...b.querySelector('table.t').querySelectorAll('tr')].slice(1).map(tr => tr.children[0].innerText), links: [...b.querySelectorAll('a')].map(a => a.href) } : null; });
  T('0.7 профили автора: найден по ФИО без идентификаторов — OpenAlex и ссылки-поиски', pln && pln.rows.join() === 'OpenAlex' && pln.links.some(h => /researchgate\.net\/search\/researcher/.test(h)) && pln.links.some(h => /elibrary\.ru\/authors\.asp/.test(h)), pln);
  // 8а. пустая строка внутри записи и список не с 1 (случай Германа 09.10.2026, вымышленный)
  await pg.fill('#list', '7. Sokolova A.V., Orlov D.K. (2023) Alginate sorbents for oil spill response in cold\n\nseawater. Nature 615, 1-9\n\n8. Orlov D.K., Sokolova A.V., Lebedev M.N. (2022) Thermal transport in layered oxide ceramics under cyclic load. Physical Review B');
  const sp = await pg.evaluate(() => splitEntries(document.getElementById('list').value).map(e => e.num)); T('пустая строка внутри записи, список с № 7: две записи, 7 и 8', sp.join() === '7,8', sp);
  // 8б. поиск автора по ФИО и идентификаторам (ожидания записаны до прогона)
  await pg.goto(URL0); MODE = 'similar';
  await pg.fill('#author', 'C-1234-2014/6700000001/1234-5678'); await pg.click('#ago'); await idle(); a = await auState();
  T('«ResearcherID/Scopus ID/SPIN»: Scopus ID → реестр ORCID → автор', a.loaded && /реестр ORCID/.test(a.how) && a.n === 4, a);
  let sim = await pg.evaluate(() => (AU.similar || []).map(x => x.id)); T('после точного поиска предложен похожий профиль того же имени', sim.join() === 'A11', sim);
  await pg.click('button[onclick^="addProfile(\'A11\')"]'); await idle(); let ids = await pg.evaluate(() => AU.prof.ids); T('«Добавить его публикации»: профилей два', ids.join() === 'A1,A11', ids);
  await pg.fill('#author', 'Scopus ID: 56200000000 Web of Science ResearcherIDF-1234-2016 SPIN-код автора:1234-5678'); await pg.click('#ago'); await idle(); a = await auState();
  T('подпись приклеена к ResearcherID: найден через реестр ORCID по ResearcherID', a.loaded && /ResearcherID F-1234-2016/.test(a.how), a);
  await pg.fill('#author', 'WoS IQR-1234-2023/ Scopus ID: 7800000001/в РИНЦ AuthorID: 123456'); await pg.click('#ago'); await idle(); a = await auState();
  const elib = await pg.evaluate(() => [...document.querySelectorAll('#outAuthor a')].some(x => /author_profile\.asp\?authorid=123456/.test(x.href)));
  T('строка без ORCID и ФИО, нигде не найдена: сообщения и ссылка на профиль РИНЦ', !a.loaded && a.msgs.some(m => /не привязан/.test(m)) && elib, [a, elib]);
  MODE = 'many'; await pg.fill('#author', 'Соколова Анна Викторовна'); await pg.click('#ago'); await idle(); a = await auState();
  const cand = await pg.evaluate(() => (AU.cands || []).map(x => x.id));
  T('ФИО кириллицей, несколько тёзок: выбор, первым — совпавший по имени и отчеству, чужие имена отсеяны', !a.loaded && cand[0] === 'A1' && cand.indexOf('A9') < 0 && cand.indexOf('A12') < 0, cand);
  const qs = await pg.evaluate(() => NET.log.map(x => decodeURIComponent(x.url)).filter(u => /authors\?search=/.test(u)).map(u => u.match(/search=([^&]*)/)[1]));
  T('по кириллическому ФИО искали и латиницей, и кириллицей', qs.some(q => /Anna Sokolova/.test(q)) && qs.some(q => /Анна Соколова/.test(q)), qs);
  MODE = 'single'; await pg.fill('#author', 'Соколова Анна Викторовна'); await pg.click('#ago'); await idle(); a = await auState();
  T('ФИО кириллицей, единственный с полным именем и отчеством: найден сам', a.loaded && /единственный/.test(a.how), a);
  MODE = 'many'; await pg.fill('#author', 'Sokolova A.V.'); await pg.click('#ago'); await idle(); a = await auState();
  T('ФИО латиницей с инициалами: выбор, сам не выбирает', !a.loaded && a.cands >= 2, a);
  await pg.unroute(/pub\.orcid\.org/); await pg.route(/pub\.orcid\.org/, r => r.abort()); MODE = 'none';
  await pg.fill('#author', 'C-1234-2014/6700000001/1234-5678 Соколова Анна'); await pg.click('#ago'); await idle(); a = await auState();
  T('реестр ORCID недоступен: причина показана, поиск пошёл по ФИО', !a.loaded && a.msgs.some(m => /не отвечает/.test(m)) && a.msgs.some(m => /по ФИО не найдено/.test(m)), a);
  // 0.7: дубли и групповой режим
  await pg.goto(URL0); MODE = 'none';
  await pg.fill('#list', PUBS.slice(0, 3).map((p, i) => `${i + 1}. ${p[0]} ${p[1]}. ${p[2]}. ${p[3]}.`).join('\n') + `\n4. ${PUBS[0][0]} ${PUBS[0][1]}. ${PUBS[0][2]}. ${PUBS[0][3]}, vol. 615.`);
  await pg.click('#go'); await pg.waitForFunction(() => /Готово|неполный/.test(document.getElementById('status').textContent) && !BUSY, null, { timeout: 60000 });
  const dup = await pg.evaluate(() => ({ d: W.dups.map(d => [d.a, d.b, d.why]), note: document.querySelectorAll('#outList table.t tr')[4].children[7].innerText }));
  T('0.7 дубли: запись № 4 повторяет № 1 — одна пара, пометка у записи', dup.d.length === 1 && dup.d[0][0] === 0 && dup.d[0][1] === 3 && /дубль записи № 1/.test(dup.note), dup);
  await pg.fill('#grp', '1. 0000-0002-1825-0097\n2. Несуществующий Автор Тестович'); await pg.click('#ggo'); await idle();
  const gr = await pg.evaluate(() => ({ st: G.items.map(it => grpState(it.S)), rows: [...document.querySelectorAll('#outGroup > table.t tr')].slice(1).map(tr => [...tr.children].map(td => td.innerText.trim())), det: document.querySelectorAll('#outGroup details.gitem').length }));
  T('0.7 группа: первый найден, второй — нет; за 2021–2025 у первого 3 публикации, Q1 — 2', JSON.stringify(gr.st) === '["found","none"]' && gr.rows[0][3] === '3' && gr.rows[0][4] === '2' && /не найден/.test(gr.rows[1][2]) && gr.det === 2, gr);
  await pg.screenshot({ path: B + '/evals/shot_group.png', fullPage: true });
  // 0.7.4: «Проверить связь» не зависает, если одна база молчит (ожидания записаны до прогона)
  await pg.unroute(/journalrank\.rcsi\.science/); await pg.route(/journalrank\.rcsi\.science/, () => { /* не отвечаем никогда */ });
  { const t = Date.now(); await pg.evaluate(() => { document.querySelector('details:has(#ping)').open = true; }); await pg.click('#ping');
    const mid = await pg.evaluate(() => document.getElementById('pingres').innerText);
    await pg.waitForFunction(() => !document.getElementById('ping').disabled, null, { timeout: 30000 }); const dt = Date.now() - t; const txt = await pg.evaluate(() => document.getElementById('pingres').innerText);
    T('проверка связи: зависший сайт Белого списка — итог за 12–16 с, он «не отвечает», остальные «отвечает»', dt < 16000 && /не отвечает Сайт Белого списка/.test(txt) && (txt.match(/отвечает Crossref|отвечает Реестр|отвечает OpenAlex/g) || []).length === 3, [dt, txt]);
    T('проверка связи: пока ждём, видно «проверяю…» по каждой базе', /проверяю/.test(mid), mid); }
  // 9. нет связи
  await pg.unroute(/api\.crossref\.org|api\.openalex\.org/); await pg.unroute(/journalrank\.rcsi\.science/); await pg.route(/api\.crossref\.org|api\.openalex\.org|journalrank/, r => r.abort()); MODE = 'two';
  await pg.fill('#list', PUBS.map((p, i) => `${i + 1}. ${p[0]} ${p[1]}. ${p[2]}. ${p[3]}. ${p[4]}`).join('\n')); await pg.click('#go'); await pg.waitForFunction(() => /Готово|неполный/.test(document.getElementById('status').textContent) && !BUSY, null, { timeout: 60000 });
  const st9 = await pg.textContent('#status'), f9 = (await listState()).found; T('без связи: «поиск неполный», статьи «не проверены», а не «не найдены»', /неполный/.test(st9) && f9.every(x => x === 'unk'), [st9, f9]);
  await pg.fill('#author', 'Соколова'); await pg.click('#ago'); await idle(); a = await auState(); T('без связи: поиск автора сообщает об ошибке', !a.loaded && a.msgs.some(m => /не выполнен/.test(m)), a);
  // ===== сайт: страница + справочники и распознавание отдельными файлами =====
  const http = require('http'), SITE = B + '/dist/site'; const MT = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.gz': 'application/gzip', '.wasm': 'application/wasm', '.txt': 'text/plain' };
  const srv = http.createServer((q, r) => { let f = decodeURIComponent(q.url.split('?')[0]); if (f.endsWith('/')) f += 'index.html'; const fp = path.join(SITE, f); if (!fp.startsWith(SITE) || !fs.existsSync(fp)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': MT[path.extname(fp)] || 'application/octet-stream' }); fs.createReadStream(fp).pipe(r); });
  await new Promise(ok => srv.listen(8765, ok));
  const ps = await br.newPage({ viewport: { width: 1400, height: 900 } }); const serr = []; ps.on('pageerror', e => serr.push(String(e)));
  await ps.goto('http://localhost:8765/'); await ps.waitForFunction(() => /Справочники:|не загружены/.test(document.getElementById('refinfo').textContent), null, { timeout: 30000 });
  const si = await ps.evaluate(() => ({ ref: document.getElementById('refinfo').textContent, robots: (document.querySelector('meta[name=robots]') || {}).content, btn: document.getElementById('go').disabled, ch: document.getElementById('changes').textContent.slice(0, 40) }));
  T('сайт: справочники загружены отдельным файлом, страница закрыта от поисковиков, «Что нового» есть', /Справочники: SCImago/.test(si.ref) && /noindex/.test(si.robots) && !si.btn && /0\.7/.test(si.ch), si);
  const ts = Date.now(); await ps.setInputFiles('#file', shot); await ps.waitForFunction(() => /распознан|не распознан/.test(document.getElementById('ocrmsg').textContent) && !BUSY, null, { timeout: 180000 });
  const sn = await ps.evaluate(() => [document.getElementById('ocrmsg').textContent, splitEntries(document.getElementById('list').value).length]);
  T('сайт: распознавание подгружается при первом снимке и читает список (6 записей)', /Снимок распознан/.test(sn[0]) && sn[1] === 6, sn); console.log(`Сайт: распознавание с загрузкой — ${Math.round((Date.now() - ts) / 1000)} с`);
  T('сайт: без ошибок страницы', serr.length === 0, serr); srv.close();
  console.log('Ошибки страницы:', errs.length ? errs : 'нет'); console.log(`Распознавание списка: ${ocrSec} с`);
  out.forEach(x => console.log(x));
  console.log(`${idsOk ? 'верно  ' : 'НЕВЕРНО'} — снимок с идентификаторами распознан без ошибок` + (idsOk ? '' : ': ' + JSON.stringify(parsed)));
  console.log(`Итого: ${out.filter(x => x.startsWith('верно')).length + (idsOk ? 1 : 0)} из ${out.length + 1}`);
  await br.close();
})();
