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
// 0.7.11, правка 4: вымышленный список eLibrary по виду настоящего (684 точки, Tahoma 11px, синие #00008f и фиолетовые #872a8f заголовки на #f5f5f5)
const ELIB_HTML = `<html><body style="margin:0;background:#fff">
<div style="width:684px;font:11px Tahoma,Arial,sans-serif;background:#f5f5f5;color:#000">
<table style="border-collapse:collapse;width:684px;font:11px Tahoma,Arial,sans-serif">
<tr><td style="width:18px;vertical-align:top;padding:3px 2px">1</td><td style="width:14px;vertical-align:top;padding:3px 2px"><input type="checkbox" style="margin:0;width:11px;height:11px"></td>
<td style="padding:3px 4px"><a style="color:#00008f;font-weight:bold;text-decoration:none">СИНТЕЗ НАНОСТРУКТУРИРОВАННЫХ ПОКРЫТИЙ НА ОСНОВЕ ОКСИДА ТИТАНА ДЛЯ ВЫМЫШЛЕННЫХ УСЛОВИЙ</a><br><i>Иванов И.И., Петрова М.С.</i><br>В сборнике: Материалы Всероссийской научной конференции «Вымышленные материалы». Москва, 2025. С. 26.</td><td style="width:30px;text-align:center;vertical-align:top;padding:3px">0</td></tr>
<tr><td style="vertical-align:top;padding:3px 2px">2</td><td style="vertical-align:top;padding:3px 2px"><input type="checkbox" style="margin:0;width:11px;height:11px"></td>
<td style="padding:3px 4px"><a style="color:#872a8f;font-weight:bold;text-decoration:none">THERMAL STABILITY OF LAYERED COMPOSITE COATINGS UNDER CYCLIC LOAD</a><br><i>Ivanov I.I., Smirnov A.V., Lebedev M.N.</i><br>Materials Letters. 2025. Т. 382. С. 137913.</td><td style="text-align:center;vertical-align:top;padding:3px">5</td></tr>
<tr><td style="vertical-align:top;padding:3px 2px">3</td><td style="vertical-align:top;padding:3px 2px"><input type="checkbox" style="margin:0;width:11px;height:11px"></td>
<td style="padding:3px 4px"><a style="color:#00008f;font-weight:bold;text-decoration:none">ВЫМЫШЛЕННЫЙ СОРБЕНТ ДЛЯ ОЧИСТКИ ХОЛОДНОЙ МОРСКОЙ ВОДЫ</a><br><i>Петрова М.С., Иванов И.И.</i><br>Журнал вымышленной физики. 2024. Т. 94. № 3. С. 210-218.</td><td style="text-align:center;vertical-align:top;padding:3px">2</td></tr>
<tr><td style="vertical-align:top;padding:3px 2px">4</td><td style="vertical-align:top;padding:3px 2px"><input type="checkbox" style="margin:0;width:11px;height:11px"></td>
<td style="padding:3px 4px"><a style="color:#00008f;font-weight:bold;text-decoration:none">СПОСОБ ПОЛУЧЕНИЯ ВЫМЫШЛЕННОГО ЗАЩИТНОГО ПОКРЫТИЯ</a><br><i>Иванов И.И., Петрова М.С.</i><br>Патент на изобретение RU 2814949 C1, 07.03.2024. Заявка № 2023121420 от 16.08.2023.</td><td style="text-align:center;vertical-align:top;padding:3px">0</td></tr>
</table></div></body></html>`;
const AID = { Sokolova: 'A1', Orlov: 'A2', Lebedev: 'A3' }, ANAME = { A1: 'Anna V. Sokolova', A2: 'Dmitry K. Orlov', A3: 'Mikhail N. Lebedev' };
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
  // 0.9, правка 3: поля ввода — на главной; на подстранице результата они скрыты. Перед вводом — «← Новый поиск», как сделал бы человек
  const HOME_SEL = /^#(author|org|ago|anew|list|go|jq|jy|jgo|file|dfile|afile|stop)\b/;
  // и на начальном экране «Что проверяем» (0.9) сначала выбрать нужный раздел — кнопкой, как человек
  const toHome = async sel => { if (typeof sel !== 'string' || !HOME_SEL.test(sel)) return;
    if (await pg.evaluate(() => document.body.dataset.view !== 'home').catch(() => false)) { await pg.click('#rback'); await pg.waitForFunction(() => document.body.dataset.view === 'home', null, { timeout: 5000 }); }
    const pane = await pg.evaluate(s => { const el = document.querySelector(s); const c = el && el.closest('#inp .col'); return c && !c.classList.contains('on') ? c.id : ''; }, sel.split(/[ :]/)[0]).catch(() => '');
    if (pane) await pg.click('#seg button[data-p="' + pane + '"]'); };
  // так же к таблицам и кнопкам результата — открыть нужную подстраницу (вкладку), как сделал бы человек
  const VIEW_SEL = [[/^#(outList|retry|xlsx|csv|copy)\b/, 'list'], [/^#(outAuthor|hx|acopy|axlsx|acsv)/, 'author'], [/^#(outJournal|jcopy|jxlsx|jcsv)\b/, 'journals']];
  const toView = async sel => { const m = typeof sel === 'string' && VIEW_SEL.find(([re]) => re.test(sel)); if (!m) return toHome(sel); if (await pg.evaluate(v => document.body.dataset.view !== v && viewHas(v), m[1]).catch(() => false)) { await pg.evaluate(v => setView(v), m[1]); } };
  for (const m of ['fill', 'click', 'press', 'setInputFiles', 'focus', 'check', 'uncheck']) { const f = pg[m].bind(pg); pg[m] = async (sel, ...a) => { await toView(sel); return f(sel, ...a); }; }
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
            : MODE === 'many' ? [OA('A1', ANAME.A1, { orcid: 'https://orcid.org/0000-0002-1825-0097', ids: { scopus: 'http://www.scopus.com/inward/authorDetails.url?authorID=57000000000&partnerID=MN8TOARS' }, display_name_alternatives: ['Соколова Анна Викторовна', 'A. V. Sokolova'], topics: [{ display_name: 'Seaweed Polymers', subfield: { display_name: 'Biomaterials' } }, { display_name: 'Oil Spill Response', subfield: { display_name: 'Pollution' } }], last_known_institutions: [{ id: 'https://openalex.org/I77', display_name: 'Вымышленный университет', country_code: 'RU' }] }), OA('A8', 'A. Sokolova'), OA('A9', 'Anastasia Sokolova'), OA('A10', 'Anna Sokolova', { works_count: 30 }), OA('A12', 'Anna Sokolov')]
            : MODE === 'single' ? [OA('A1', ANAME.A1), OA('A8', 'A. Sokolova')]
            : MODE === 'orgs' ? [OA('A1', ANAME.A1, { last_known_institutions: [{ display_name: 'Test University', country_code: 'RU' }] }), OA('A12', 'Anna Sokolova', { works_count: 30, last_known_institutions: [{ display_name: 'Other Institute of Physics', country_code: 'RU' }] })]
            : MODE === 'similar' ? [OA('A1', ANAME.A1, { orcid: 'https://orcid.org/0000-0002-1825-0097' }), OA('A11', 'Anna V. Sokolova', { works_count: 1 })] : [];
          return json(route, { results: r }); }
        if (/institutions\?filter=openalex:/.test(u)) return json(route, { results: [{ id: 'https://openalex.org/I77', display_name: 'Вымышленный университет', international: { display_name: { ru: 'Вымышленный университет (по-русски)' } } }] });
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
  const listState = () => pg.evaluate(() => ({ n: W.pubs.length, found: W.pubs.map(p => p.found), q: W.pubs.map(p => p.jv ? [p.jv.qY, p.jv.sjYear] : null) }));
  const auState = () => pg.evaluate(() => ({ loaded: !!(AU.prof && !AU.prof.err), n: AU.prof && AU.prof.js ? AU.prof.js.length : 0, how: AU.prof && AU.prof.how, cands: AU.cands ? AU.cands.length : null, msgs: AU.msgs, name: AU.prof && AU.prof.info && AU.prof.info[0] && AU.prof.info[0].name }));
  const out = [], T = (name, ok, got) => { const r = `${ok ? 'верно  ' : 'НЕВЕРНО'} — ${name}${ok ? '' : ': ' + JSON.stringify(got)}`; out.push(r); if (!ok) console.log('  (сразу) ' + r.slice(0, 1500)); };  // провал виден сразу, даже если прогон потом упадёт
  // 0.7.11: кеш ответов и прошлая проверка в браузере мешали бы подставным ответам между сценариями — в основном прогоне выключены
  await pg.addInitScript(() => { try { if (!sessionStorage.getItem('pc_keep')) { localStorage.setItem('pc_useCache', 'false'); localStorage.removeItem('pc_state'); } } catch (e) { } });
  await pg.goto(URL0);
  // 0.9: начальный экран «Что проверяем» — при открытии ни один раздел не выбран; кнопка открывает только свой раздел;
  // введённое при переключении сохраняется, точка — у раздела с введённым; Alt+3 — «Публикации» (ожидания записаны до прогона)
  { await pg.waitForFunction(() => typeof REF !== 'undefined' && REF, null, { timeout: 60000 });
    const st0 = await pg.evaluate(() => ({ btn: document.querySelectorAll('#seg button').length, open: [...document.querySelectorAll('#inp .col')].filter(c => c.offsetParent).length }));
    T('0.9 начальный экран: три кнопки, ни один раздел не открыт', st0.btn === 3 && st0.open === 0, st0);
    await pg.click('#seg button[data-p="secJ"]'); await pg.keyboard.type('Nature');
    const st1 = await pg.evaluate(() => ({ vis: [...document.querySelectorAll('#inp .col')].filter(c => c.offsetParent).map(c => c.id).join(), focus: document.activeElement.id }));
    await pg.click('#seg button[data-p="secA"]');
    const st2 = await pg.evaluate(() => ({ vis: [...document.querySelectorAll('#inp .col')].filter(c => c.offsetParent).map(c => c.id).join(), jq: document.getElementById('jq').value, dotJ: document.querySelector('#seg button[data-p="secJ"] .dot').classList.contains('on') }));
    await pg.keyboard.press('Alt+3'); const st3 = await pg.evaluate(() => [...document.querySelectorAll('#inp .col')].filter(c => c.offsetParent).map(c => c.id).join());
    T('0.9 начальный экран: «Журнал» — открыт только он, курсор в поле; «Автор» — журнал скрыт, введённое сохранилось, у «Журнала» точка; Alt+3 — «Публикации»', st1.vis === 'secJ' && st1.focus === 'jq' && st2.vis === 'secA' && st2.jq === 'Nature' && st2.dotJ && st3 === 'secL', [st1, st2, st3]);
    await pg.evaluate(() => { document.getElementById('jq').value = ''; }); await pg.reload(); await pg.waitForFunction(() => typeof REF !== 'undefined' && REF, null, { timeout: 60000 });
    { const n = await pg.evaluate(() => [...document.querySelectorAll('#inp .col')].filter(c => c.offsetParent).length); T('0.9 начальный экран: после нового открытия — снова ни один раздел не выбран', n === 0, n); } }
  // 1. только снимок списка
  const t0 = Date.now(); await pg.setInputFiles('#file', shot);
  await pg.waitForFunction(() => /распознан|не распознан/.test(document.getElementById('ocrmsg').textContent) && !BUSY, null, { timeout: 180000 });
  const ocrSec = Math.round((Date.now() - t0) / 1000);
  await pg.click('#go'); await pg.waitForFunction(() => /Готово|неполный/.test(document.getElementById('status').textContent) && !BUSY, null, { timeout: 60000 });
  let L = await listState(), a = await auState();
  T('снимок: 6 записей, 5 найдены, шестая «не найдена»', L.n === 6 && JSON.stringify(L.found) === '["ok","ok","ok","ok","ok","no"]', L);
  T('снимок: квартили на год публикации — Nature Q1 (2023), PRB Q1 (2022), Nano Letters Q1 (2019, справочник теперь с 2006)', JSON.stringify(L.q.slice(0, 3)) === '[[1,2023],[1,2022],[1,2019]]', L.q);
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
  // 0.9, правка 4: кнопки-наборы (ожидания: «Q1–Q2 или БС 1» — № 1, 2, 3, как при ручной отметке Q1, Q2 и БС 1; повторное нажатие снимает; годы не трогаются)
  { const man = await pg.evaluate(() => { setFlt('list', 'q', '1', true); setFlt('list', 'q', '2', true); setFlt('list', 'wl', '1', true); const r = listRows().map(x => x.i + 1).join(); const on = [...document.querySelectorAll('#outList button.preset')].map(b => b.classList.contains('on')); resetFlt('list'); return { r, on }; });
    await pg.evaluate(() => { FLT.list.yFrom = 2019; setPreset('list', 'q12'); }); const pr = await pg.evaluate(() => ({ r: listRows().map(x => x.i + 1).join(), q: FLT.list.q.slice().sort().join(), wl: FLT.list.wl.join(), y: FLT.list.yFrom, on: [...document.querySelectorAll('#outList button.preset')].map(b => b.classList.contains('on')) }));
    await pg.evaluate(() => setPreset('list', 'q12')); const off = await pg.evaluate(() => ({ q: FLT.list.q.length, wl: FLT.list.wl.length, y: FLT.list.yFrom }));
    T('0.9 наборы: «Q1–Q2 или БС 1» = ручная отметка; подсвечен и при ручной отметке; годы не тронуты; повторное нажатие снимает', man.r === '1,2,3' && man.on.join() === 'true,false' && pr.r === man.r && pr.q === '1,2' && pr.wl === '1' && pr.y === 2019 && pr.on.join() === 'true,false' && off.q === 0 && off.wl === 0 && off.y === 2019, { man, pr, off });
    await pg.evaluate(() => { setPreset('list', 'q1'); }); const q1 = await pg.evaluate(() => [FLT.list.q.join(), FLT.list.wl.join()].join('|')); T('0.9 наборы: «Q1 или БС 1» — Q1 и уровень 1', q1, '1|1'); await pg.evaluate(() => resetFlt('list')); }
  // 0.9, правка 6: CiteScore в таблице списка — отдельный столбец, ссылка на Scopus, подпись Elsevier в подсказке; квартиль SCImago подписан годом
  { const c = await pg.evaluate(() => { const tr = document.querySelectorAll('#outList table.t tr')[1]; const a = tr.children[6].querySelector('a.csv'); return { a: a ? [a.textContent, a.href, a.title] : null, q: tr.children[3].textContent }; });
    T('0.9 список: Nature — CiteScore «… Q1» со ссылкой на scopus.com/sourceid/21206 и подписью Elsevier; квартиль «Q1 в 2023», «сейчас (2025)»', !!c.a && /Q1$/.test(c.a[0]) && /sourceid\/21206$/.test(c.a[1]) && /© Elsevier B\.V\./.test(c.a[2]) && /Q1\s*в 2023/.test(c.q) && /сейчас \(2025\)/.test(c.q), c); }
  await pg.evaluate(() => { setFlt('au', 'q', '1', true); setFlt('au', 'wl', '1', true); }); T('автор: Q1 или БС 1 — 3 статьи из 4', await auRows() === 3, await auRows()); await pg.evaluate(() => resetFlt('au'));
  // 0.7.9: издание не в SCImago — индексация по Белому списку и ссылки, где посмотреть квартиль самому; полей для ручного ввода нет (ожидания записаны до прогона)
  { const c5 = await pg.evaluate(() => document.querySelectorAll('#outList table.t tr')[5].children[3].innerText);
    const c5i = await pg.evaluate(() => document.querySelectorAll('#outList table.t tr')[5].children[2].innerText);
    const c4 = await pg.evaluate(() => document.querySelectorAll('#outList table.t tr')[4].children[2].innerText);
    T('нет в SCImago: ссылки «есть ли в WoS», JCR, Scopus Sources и пометка «посмотрите сами»', /нет в SCImago/.test(c5) && /есть ли в WoS/.test(c5) && /JCR/.test(c5) && /Scopus Sources/.test(c5) && /посмотрите сами/.test(c5), c5);
    T('индексация по Белому списку у издания: WoS CC · Scopus · RSCI', /индексация: WoS CC (✓|—) · Scopus (✓|—) · RSCI (✓|—)/.test(c5i), c5i);
    T('издания нет в Белом списке: «индексация: нет данных»', /индексация: нет данных/.test(c4), c4);
    const inp = await pg.evaluate(() => document.querySelectorAll('#outList input[type=text], #outAuthor .plinks input').length); T('в таблицах нет полей для ручного ввода', inp === 0, inp);
    const h1 = await pg.evaluate(() => [...document.querySelectorAll('#outList table.t tr')[0].children].map(x => x.textContent.replace(/\s+/g, ' ')).join('|'));  // textContent: заголовки показываются заглавными (0.9)
    T('колонка называется «Импакт-фактор», с подписью SCImago', /Импакт-фактор\s*SCImago, цит\. на документ за 2 года/.test(h1) && !/Показатель/.test(h1), h1);
    const nl = await pg.evaluate(() => document.querySelectorAll('#outList table.t tr')[3].children[3].innerText);
    T('ссылка на издание в Scopus у изданий из SCImago', await pg.evaluate(() => [...document.querySelectorAll('#outList table.t tr')[1].children[3].querySelectorAll('a')].some(a => /scopus\.com\/sourceid\/\d+/.test(a.href))), nl); }
  // 2а. corresponding и ссылки
  const corr = await pg.evaluate(() => [...document.querySelectorAll('#outList table.t tr')].slice(1, 3).map(tr => tr.children[7].innerText.split('\n')[0]));
  T('авторы: первой строкой — крупная пометка «Corresponding — да» / «в базе не указан»', /Corresponding — да/.test(corr[0]) && /Corresponding — в базе не указан/.test(corr[1]), corr);
  const last = await pg.evaluate(() => document.querySelectorAll('#outList table.t tr')[2].children[7].innerText); T('справочно показан последний автор', /последний:\s*X\. Lebedev/.test(last), last);
  const dl = await pg.evaluate(() => [...document.querySelectorAll('#outList table.t tr')].slice(1, 6).map(tr => [...tr.children[1].querySelectorAll('a')].some(a => a.href === 'https://doi.org/' + a.textContent.trim())));
  T('DOI под статьёй — ссылка', dl.every(Boolean), dl);
  const rec = await pg.evaluate(() => [...document.querySelectorAll('#outList table.t tr')].slice(1, 6).map(tr => !!tr.children[1].querySelector('details.mini') && !/совпадение названия/.test(tr.children[1].innerText)));
  T('запись из списка свёрнута, процента совпадения нет', rec.every(Boolean), rec);
  const wlTxt = await pg.evaluate(() => document.querySelectorAll('#outList table.t tr')[5].children[4].innerText); T('ЖТФ 2024: уровень 2 (2023) и «сейчас уровень 1»', /уровень 2/.test(wlTxt) && /сейчас уровень 1/.test(wlTxt), wlTxt);
  // ===== 0.7: corresponding, фильтры, организация, дубли (ожидания записаны до прогона) =====
  const c07 = await pg.evaluate(() => [...document.querySelectorAll('#outList table.t tr')].slice(1, 3).map(tr => tr.children[7].innerText));
  T('0.7 список: у найденного автора — «Corresponding — да» (Nature) и «в базе не указан» (PRB), имя автора под пометкой', /Corresponding — да\s*\n\s*Anna V\. Sokolova/.test(c07[0]) && /Corresponding — в базе не указан/.test(c07[1]), c07);
  const corrCol = await pg.evaluate(() => [...document.querySelectorAll('#outAuthor table.t')].pop().rows[0].innerText);
  // 0.7.11, правка 3: столбец «Организация (сверка)» убран — ожидания записаны до прогона
  T('0.7.11 автор: колонка «Corresponding» есть, столбца «Организация» нет', /Corresponding/.test(corrCol) && !/Организация/.test(corrCol), corrCol);
  await pg.evaluate(() => setFlt('au', 'corr', 'yes', true)); T('0.7 автор: фильтр «corresponding — да» — 1 статья', await auRows() === 1, await auRows()); await pg.evaluate(() => resetFlt('au'));
  await pg.evaluate(() => setFlt('list', 'corr', 'yes', true)); sl = await shownList(); T('0.7 список: фильтр corresponding работает при найденном авторе — № 1', sl.join() === '1', sl); await pg.evaluate(() => resetFlt('list'));
  await pg.evaluate(() => setFltY('list', 'ifFrom', '20')); sl = await shownList(); const cnt20 = await pg.evaluate(() => document.querySelector('#outList .cnt').innerText);
  T('0.7 список: показатель от 20 — только Nature (№ 1), ненайденные по SCImago скрыты и посчитаны', sl.join() === '1' && /скрыто\s*\d/.test(cnt20), [sl, cnt20]); await pg.evaluate(() => resetFlt('list'));
  // 0.7.11, правка 1 и 3: поле организации открыто в блоке «Автор»; сверки по статьям и фильтра «Организация» нет (ожидания записаны до прогона)
  await toHome('#org');
  const orgVis = await pg.evaluate(() => { const o = document.getElementById('org'); return [!!o.offsetParent, !o.closest('details'), /однофамильцев/.test(document.querySelector('label[for=org]').innerText)]; });
  T('0.7.11 поле «Организация автора (чтобы отличить однофамильцев)» открыто рядом с ФИО', orgVis.every(Boolean), orgVis);
  await pg.fill('#org', 'Test University'); await pg.dispatchEvent('#org', 'change');
  const fOrg = await pg.evaluate(() => [...document.querySelectorAll('.fbar .gl')].map(x => x.textContent).join('|'));
  T('0.7.11 фильтра «Организация» нет ни над одной таблицей', !/Организация/i.test(fOrg), fOrg);
  const orgCell = await pg.evaluate(() => document.querySelectorAll('#outList table.t tr')[1].children[7].innerText); T('0.7.11 список: организация автора — фактом, без пометки сверки', /Test University/.test(orgCell) && !/совпадает|не уверена|другая организация/.test(orgCell), orgCell);
  await pg.fill('#org', ''); await pg.dispatchEvent('#org', 'change');
  // 4. автор по строке идентификаторов (ORCID)
  await pg.fill('#author', 'AAA-1234-2020/57000000000/0000-0002-1825-0097'); await pg.click('#ago'); await idle(); a = await auState();
  T('строка идентификаторов: найден по ORCID, 4 статьи', a.loaded && a.n === 4 && /ORCID 0000-0002-1825-0097/.test(a.how), a);
  const ext = await pg.evaluate(() => [...document.querySelectorAll('#outAuthor a')].map(x => x.href).filter(h => /scopus\.com|webofscience|orcid\.org/.test(h)).length); T('ссылки на профили ORCID, Scopus и WoS показаны', ext >= 3, ext);
  // 0.7: блок «Профили автора»
  // 0.7.10, правка 5: «Откуда взят» перенесено в подсказку (title) второй колонки
  const pl = await pg.evaluate(() => { const b = document.querySelector('#outAuthor .plinks'); if (!b) return null; const rows = [...b.querySelector('table.t').querySelectorAll('tr')].slice(1).map(tr => [tr.children[0].innerText, tr.children[1].innerText, tr.children[1].title]); return { rows, warn: /различаются/.test(b.innerText), search: [...b.querySelectorAll('a')].some(a => /scholar\.google\.com\/citations\?view_op=search_authors/.test(a.href)) }; });
  const plOk = pl && pl.rows.length === 4 && pl.rows.some(r => /Scopus/.test(r[0]) && /введено/.test(r[2]) && /из ORCID/.test(r[2])) && pl.rows.some(r => /Web of Science/.test(r[0]) && /из ORCID/.test(r[2])) && pl.rows.some(r => /OpenAlex/.test(r[0])) && !pl.warn;
  T('0.7 профили автора: ORCID, Scopus, WoS, OpenAlex с источниками в подсказке, без расхождений', plOk, pl);
  T('0.7.9 профили автора: строки «Поиск по имени (это не точный профиль…)» нет', !(await pg.evaluate(() => /не точный профиль/.test(document.getElementById('outAuthor').innerText))), 'есть');
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
  // 0.7.9: индекс Хирша — без ручного ввода: Scopus, WoS, РИНЦ — «утилита не получает» и ссылка; OpenAlex — 3 (ожидания записаны до прогона)
  // 0.7.11, правка 2: Хирш — заметной плашкой вверху блока «Автор», рядом с именем (ожидания записаны до прогона)
  { const hr = await pg.evaluate(() => { const b = document.querySelector('#outAuthor .auhead .hplate'); return b ? { txt: b.innerText, big: (b.querySelector('.hv') || {}).innerText, fs: parseFloat(getComputedStyle(b.querySelector('.hv')).fontSize), hrefs: [...b.querySelectorAll('a')].map(a => a.href), tips: [b.title].concat([...b.querySelectorAll('[title]')].map(x => x.title)), first: document.querySelector('#outAuthor h2').nextElementSibling === b.parentElement } : null; });
    T('0.7.11 / Хирш плашкой: крупно 3 (OpenAlex), ссылки Scopus · WoS · РИНЦ', hr && hr.big === '3' && hr.fs >= 24 && /OpenAlex/.test(hr.txt) && /Scopus/.test(hr.txt) && /WoS/.test(hr.txt) && /РИНЦ/.test(hr.txt) && /посмотреть/.test(hr.txt) && hr.hrefs.some(h => /authorId=57000000001/.test(h)) && hr.hrefs.some(h => /webofscience\.com\/wos\/author\/rid\/AAA-1234-2020/.test(h)), hr);
    T('0.7.11 / Хирш: плашка сразу под заголовком «Автор», подсказки про самоцитирование и Scopus без подписки', hr && hr.first && hr.tips.some(t => /без подписки/.test(t)) && hr.tips.some(t => /самоцитированием/.test(t)), hr && [hr.first, hr.tips]);
    await (await pg.$('#outAuthor .plinks')).screenshot({ path: B + '/evals/shot_hirsch.png' }); }
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
  const pln = await pg.evaluate(() => { const b = document.querySelector('#outAuthor .plinks'); return b ? { rows: [...b.querySelector('table.t').querySelectorAll('tr')].slice(1).map(tr => tr.children[0].innerText), links: [...document.querySelectorAll('#outAuthor .plinks a, #outAuthor .hplate a')].map(a => a.href) } : null; });
  T('профили автора: найден по ФИО без идентификаторов — OpenAlex, у Хирша ссылки-поиски (eLibrary), без строки «поиск по имени»', pln && pln.rows.join() === 'OpenAlex' && pln.links.some(h => /elibrary\.ru\/authors\.asp/.test(h)) && !pln.links.some(h => /researchgate/.test(h)), pln);
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
  // 0.7.9: строка кандидата — ФИО кириллицей, организация по-английски и по-русски, темы, ссылки ORCID · Scopus · OpenAlex (ожидания записаны до прогона)
  { const cr = await pg.evaluate(() => { const t = document.querySelector('#outAuthor table.cands'); if (!t) return null; const r = t.rows[1], r2 = t.rows[2]; return { txt: r.innerText, links: [...r.cells[6].querySelectorAll('a')].map(a => a.textContent + '=' + a.href), txt2: r2 ? r2.innerText : '', links2: r2 ? [...r2.cells[6].querySelectorAll('a')].map(a => a.textContent) : [] }; });
    await (await pg.$('#outAuthor')).screenshot({ path: B + '/evals/shot_cands.png' });
    T('кандидат: ФИО кириллицей, организация на двух языках, разделы науки по-русски', cr && /Соколова Анна Викторовна/.test(cr.txt) && /Вымышленный университет \(по-русски\)/.test(cr.txt) && /Биоматериалы/.test(cr.txt) && /Загрязнение окружающей среды/.test(cr.txt) && !/Seaweed Polymers/.test(cr.txt), cr);
    // 0.7.10, правка 2: английская тема OpenAlex — в подсказке при наведении
    { const tip = await pg.evaluate(() => { const t = document.querySelector('#outAuthor table.cands'); const sp = t ? t.rows[1].querySelectorAll('.topic') : []; return [...sp].map(x => [x.textContent.trim(), x.title]); });
      T('0.7.10 / у раздела науки подсказка с точной темой OpenAlex', tip.length >= 2 && tip[0][0] === 'Биоматериалы' && /Seaweed Polymers/.test(tip[0][1]), tip); }
    T('кандидат: ссылки ORCID · Scopus (профиль) · OpenAlex последней', cr && cr.links.length === 3 && /^ORCID=https:\/\/orcid\.org\/0000-0002-1825-0097/.test(cr.links[0]) && /^Scopus=.*authorId=57000000000/.test(cr.links[1]) && /^OpenAlex=/.test(cr.links[2]), cr && cr.links);
    T('кандидат без ORCID и Scopus ID: «Scopus: поиск по имени», нет кириллицы — так и сказано', cr && cr.links2.join('|') === 'Scopus: поиск по имени|OpenAlex' && /имени кириллицей в базе нет/.test(cr.txt2), cr && [cr.links2, cr.txt2.slice(0, 120)]); }
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
  const dup = await pg.evaluate(() => ({ d: W.dups.map(d => [d.a, d.b, d.why]), note: document.querySelectorAll('#outList table.t tr')[4].children[8].innerText }));
  T('0.7 дубли: запись № 4 повторяет № 1 — одна пара, пометка у записи', dup.d.length === 1 && dup.d[0][0] === 0 && dup.d[0][1] === 3 && /дубль записи № 1/.test(dup.note), dup);
  // 0.7.9: ненайденная статья — ближайшие варианты «Это она» и ссылки поиска; выбор варианта (ожидания записаны до прогона)
  await pg.fill('#list', PUBS.map((p, i) => `${i + 1}. ${p[0]} ${p[1]}. ${p[2]}. ${p[3]}. ${p[4]}`).join('\n')); await pg.click('#go'); await pg.waitForFunction(() => /Готово|неполный/.test(document.getElementById('status').textContent) && !BUSY, null, { timeout: 60000 });
  { const r6 = await pg.evaluate(() => { const tr = [...document.querySelectorAll('#outList table.t tr')][6]; return { txt: tr.innerText, btn: tr.querySelectorAll('button[onclick^="pickAlt(5,"]').length, gs: [...tr.querySelectorAll('a')].some(a => /scholar\.google\.com\/scholar\?q=/.test(a.href)), el: [...tr.querySelectorAll('a')].some(a => /elibrary\.ru/.test(a.href)) }; });
    T('не найдена: ближайший вариант с кнопкой «Это она», ссылки Google Scholar и eLibrary', r6.btn >= 1 && r6.gs && r6.el && /не найдена/.test(r6.txt), r6);
    await pg.click('button[onclick^="pickAlt(5,0)"]'); await idle();
    const p6 = await pg.evaluate(() => [W.pubs[5].found, W.pubs[5].notes.some(n => /вручную/.test(n))]); T('«Это она»: статья принята как выбранная вручную', p6[0] === 'ok' && p6[1], p6); }
  // 0.7.10, правка 3: раздела «Несколько авторов» на странице больше нет (ожидания записаны до прогона)
  { const g = await pg.evaluate(() => ({ el: ['grp', 'ggo', 'gcopy', 'gfile', 'outGroup'].filter(id => document.getElementById(id)), fn: ['runGroup', 'renderGroup', 'copyGroup'].filter(n => typeof window[n] === 'function'), h2: [...document.querySelectorAll('h2')].map(h => h.textContent.trim()) }));
    T('0.7.10 / раздел «Несколько авторов» убран целиком', g.el.length === 0 && g.fn.length === 0 && !g.h2.some(t => /Несколько авторов/i.test(t)), g); }
  // 0.9, правки 1 и 3 (вместо строки переходов 0.7.10): результат — на подстранице; вкладки в порядке Автор · Журналы · Публикации;
  // «← Новый поиск» — к вводу, введённое сохраняется; «Назад» браузера возвращает на подстраницу. Ожидания записаны до прогона.
  { await pg.evaluate(() => goTo('outList'));
    const v1 = await pg.evaluate(() => ({ view: document.body.dataset.view, hash: location.hash, tabs: [...document.querySelectorAll('#tabs a')].map(a => a.textContent.trim()), on: (document.querySelector('#tabs a.on') || {}).textContent, back: !!document.getElementById('rback') && getComputedStyle(document.getElementById('rback')).display !== 'none', homeHidden: !document.getElementById('list').offsetParent, acts: getComputedStyle(document.getElementById('listOut')).display !== 'none' && getComputedStyle(document.getElementById('auOut')).display === 'none' }));
    T('0.9 / подстраница «Публикации»: адрес #list, вкладки «Автор» и «Публикации 6» (автор первым), кнопка «← Новый поиск», ввод скрыт, кнопки выгрузки — только для списка', v1.view === 'list' && v1.hash === '#list' && /^Автор/.test(v1.tabs[0]) && /Публикации\s*6/.test(v1.tabs[v1.tabs.length - 1]) && /Публикации/.test(v1.on) && v1.back && v1.homeHidden && v1.acts, v1);
    const listVal = await pg.inputValue('#list').catch(() => null);
    await pg.click('#rback'); await pg.waitForFunction(() => document.body.dataset.view === 'home', null, { timeout: 5000 }).catch(() => { });
    const v2 = await pg.evaluate(() => ({ view: document.body.dataset.view, listVis: !!document.getElementById('list').offsetParent, kept: document.getElementById('list').value.length }));
    T('0.9 / «← Новый поиск»: главная, поле списка видно, введённое сохранилось', v2.view === 'home' && v2.listVis && v2.kept > 50, [v2, listVal && listVal.length]);
    await pg.goBack(); await pg.waitForFunction(() => document.body.dataset.view === 'list', null, { timeout: 5000 }).catch(() => { });
    T('0.9 / кнопка «Назад» браузера — снова подстраница «Публикации»', await pg.evaluate(() => document.body.dataset.view), 'list');
    await pg.click('#tabs a[href="#author"]'); await pg.waitForFunction(() => document.body.dataset.view === 'author', null, { timeout: 5000 }).catch(() => { });
    await pg.screenshot({ path: B + '/evals/shot_author.png', fullPage: true });
    T('0.9 / вкладка «Автор» открывает подстраницу автора', await pg.evaluate(() => [document.body.dataset.view, !!document.getElementById('outAuthor').offsetParent].join()), 'author,true'); }
  // 0.7.10, правка 4: «Найти другого автора» чистит автора, но не список публикаций
  await pg.fill('#author', '0000-0002-1825-0097'); await pg.click('#ago'); await idle();
  { const before = await pg.evaluate(() => ({ au: !!document.getElementById('outAuthor').innerHTML.trim(), list: W.pubs.length }));
    await pg.click('#anew'); await idle();
    const after = await pg.evaluate(() => ({ au: !!document.getElementById('outAuthor').innerHTML.trim(), field: document.getElementById('author').value, list: W.pubs.length, prof: !!AU.prof, nav: [...document.querySelectorAll('#tabs a')].map(a => a.textContent.trim()) }));
    T('0.7.10 / «Найти другого автора»: автор и поле очищены, список публикаций остался', before.au && before.list === 6 && !after.au && after.field === '' && !after.prof && after.list === 6 && !after.nav.some(t => /^Автор/.test(t)), [before, after]); }

  // ===== 0.7.11: удобство 1–11 и правки 1, 4 (ожидания записаны до прогона) =====
  const runL = async () => { await pg.click('#go'); await pg.waitForFunction(() => /Готово|неполный|Остановлено/.test(document.getElementById('status').textContent) && !BUSY, null, { timeout: 60000 }); };
  // 9. сортировка по заголовку: квартиль — Q1 сверху, без квартиля в конце; второй клик — обратно; третий — как было
  { await pg.evaluate(() => { resetFlt('list'); SORT.list = { k: '', dir: 0 }; renderList(); });
    const order = () => pg.evaluate(() => listRows().map(r => r.i + 1).join());
    await pg.evaluate(() => setSort('list', 'year')); const oy = await order();
    await pg.evaluate(() => setSort('list', 'year')); const oy2 = await order();
    await pg.evaluate(() => setSort('list', 'year')); const oy3 = await order();
    await pg.evaluate(() => setSort('list', 'if')); const oi = await order(); const arrow = await pg.evaluate(() => [...document.querySelectorAll('#outList th.sort')].map(t => t.innerText).join('|')); await pg.evaluate(() => { SORT.list = { k: '', dir: 0 }; renderList(); });
    T('0.7.11 сортировка: по году — новые сверху, второй клик — старые сверху, третий — исходный порядок', oy.split(',').slice(0, 2).join() === '4,5' && oy2.split(',')[0] === '3' && oy3 === '1,2,3,4,5,6', [oy, oy2, oy3]);
    T('0.7.11 сортировка: по импакт-фактору — Nature (64,8 в справочнике) первой, стрелка в заголовке', oi.split(',')[0] === '1' && /▼/.test(arrow), [oi, arrow]); }
  // 10. отметка «проверено»: строка подсвечена, сохраняется в браузере, попадает в выгрузку
  { await pg.check('#outList table.t tr:nth-child(2) .mk input'); const mk = await pg.evaluate(() => ({ cls: document.querySelector('#outList table.t tr:nth-child(2)').className, ls: Object.keys(JSON.parse(localStorage.getItem('pc_marks') || '{}')).length, h2: document.querySelector('#outList h2').innerText, tab: listTable()[1][1] }));
    T('0.7.11 «проверено»: строка подсвечена, отметка в браузере, «проверено 1» в заголовке, «да» в выгрузке', mk.cls === 'done' && mk.ls === 1 && /проверено 1/.test(mk.h2) && mk.tab === 'да', mk); }
  // 5. выгрузка файлом: Excel (.xlsx) и CSV
  { const [dl] = await Promise.all([pg.waitForEvent('download'), pg.click('#xlsx')]); const fx = B + '/evals/out.xlsx'; await dl.saveAs(fx); const buf = fs.readFileSync(fx), txt = buf.toString('utf8');
    T('0.7.11 «Скачать Excel»: файл .xlsx (zip), лист с заголовками и найденными статьями', /\.xlsx$/.test(dl.suggestedFilename()) && buf[0] === 0x50 && buf[1] === 0x4b && /xl\/worksheets\/sheet1\.xml/.test(txt) && /Найденная статья/.test(txt) && /Alginate sorbents/.test(txt), [dl.suggestedFilename(), buf.length]);
    const [dc] = await Promise.all([pg.waitForEvent('download'), pg.click('#csv')]); const fc = B + '/evals/out.csv'; await dc.saveAs(fc); const c = fs.readFileSync(fc, 'utf8');
    T('0.7.11 CSV: для русского Excel — BOM, разделитель «;», 7 строк (заголовок + 6)', c.charCodeAt(0) === 0xfeff && c.split('\r\n').length === 7 && c.split('\r\n')[0].split(';')[0] === '﻿№', [c.charCodeAt(0), c.split('\r\n').length]); }
  // 6. печать: кнопки и фильтры скрыты, свёрнутое развёрнуто на время печати
  { await pg.emulateMedia({ media: 'print' }); const pr = await pg.evaluate(() => { const sel = '#outList details:not([open]):not(.fhelp)'; const closed = document.querySelectorAll(sel).length; beforePrint(); const opened = document.querySelectorAll(sel).length; const r = { closed, opened, fbar: getComputedStyle(document.querySelector('.fbar')).display, btn: getComputedStyle(document.getElementById('xlsx')).display }; afterPrint(); r.after = document.querySelectorAll(sel).length; return r; }); await pg.emulateMedia({ media: 'screen' });
    T('0.7.11 печать: фильтры и кнопки не печатаются, свёрнутое раскрывается и потом сворачивается обратно', pr.closed > 0 && pr.opened === 0 && pr.after === pr.closed && pr.fbar === 'none' && pr.btn === 'none', pr); }
  // 4. «Остановить» и 3. «Повторить ненайденные»
  { await pg.evaluate(() => { window.__fw = findWork; let n = 0; findWork = async e => { if (++n === 2) STOP = true; return window.__fw(e); }; });
    await runL(); const st = await pg.evaluate(() => ({ s: document.getElementById('status').textContent, r: document.getElementById('retry').style.display, rt: document.getElementById('retry').textContent, notes: W.pubs.slice(2).map(p => p.notes.join()).join('|'), checked: W.works.filter(w => w !== undefined).length }));
    T('0.7.11 «Остановить»: проверены 2 из 6, остальные «не проверена — поиск остановлен», есть «Повторить ненайденные (4)»', /Остановлено: проверено 2 из 6/.test(st.s) && st.checked === 2 && st.r === '' && /\(4\)/.test(st.rt) && /остановлен/.test(st.notes), st);
    await pg.evaluate(() => { findWork = window.__fw; }); await pg.click('#retry'); await idle();
    const rt = await pg.evaluate(() => ({ s: document.getElementById('status').textContent, found: W.pubs.map(p => p.found).join(), r: document.getElementById('retry').textContent, vis: document.getElementById('retry').style.display }));
    T('0.7.11 «Повторить ненайденные»: доискались 5 из 6, вымышленная — снова «не найдена», кнопка осталась для неё одной', rt.found === 'ok,ok,ok,ok,ok,no' && /найдено 4 из 5|найдено 5 из 6|найдено 4 из 4|Повтор готов/.test(rt.s) && /\(1\)/.test(rt.r), rt); }
  // 2. кеш ответов: второй прогон того же списка — без запросов к Crossref и OpenAlex
  { await pg.evaluate(async () => { document.getElementById('useCache').checked = true; await cacheClear(); await cacheInfo(); }); await runL(); const h0 = hits.length; await runL();
    const cs = await pg.evaluate(() => document.getElementById('status').textContent); const net2 = hits.slice(h0).filter(u => /crossref|openalex/.test(u)).length;
    T('0.7.11 кеш: повторная проверка того же списка — 0 запросов к Crossref и OpenAlex, в строке состояния «Из кеша браузера»', net2 === 0 && /Из кеша браузера/.test(cs), [net2, cs]);
    await pg.evaluate(async () => { document.getElementById('useCache').checked = false; await cacheClear(); await cacheInfo(); }); }
  // 11. причина пометки «проверьте» — короткой фразой в строке
  { const r = await pg.evaluate(() => { const i = W.pubs.findIndex(p => p.notes.length); return i < 0 ? '' : document.querySelectorAll('#outList table.t tr')[i + 1].children[8].innerText; });
    T('0.7.11 примечания: короткие фразы в строке', r.length > 0 && r.split('\n')[0].length <= 70, r); }
  // 8. Ctrl+Enter в поле списка
  { await pg.fill('#list', '1. Sokolova A.V., Orlov D.K. Alginate sorbents for oil spill response in cold seawater. 2023. Nature.'); await pg.focus('#list'); await pg.keyboard.press('Control+Enter'); await idle(); await pg.waitForFunction(() => /Готово/.test(document.getElementById('status').textContent));
    T('0.7.11 Ctrl+Enter в поле списка запускает поиск', await pg.evaluate(() => W.pubs.length === 1 && W.pubs[0].found === 'ok'), await pg.evaluate(() => W.pubs.length)); }
  // правка 4: патент в списке не ищется
  { const h0 = hits.length; await pg.fill('#list', '1. Sokolova A.V., Orlov D.K. Alginate sorbents for oil spill response in cold seawater. 2023. Nature.\n2. Соколова А.В., Орлов Д.К. Способ получения вымышленного сорбента. Патент на изобретение RU 2814949 C1, 07.03.2024. Заявка № 2023121420 от 16.08.2023.'); await runL();
    const pt = await pg.evaluate(() => ({ f: W.pubs.map(p => p.found).join(), row: document.querySelectorAll('#outList table.t tr')[2].innerText, link: [...document.querySelectorAll('#outList table.t tr')[2].querySelectorAll('a')].map(a => a.href).join() }));
    T('0.7.11 патент: «патент — в Crossref и OpenAlex не ищется», запроса по нему нет, ссылка на Google Patents', pt.f === 'ok,patent' && /не ищется/.test(pt.row) && !hits.slice(h0).some(u => /Способ|%D0%A1%D0%BF%D0%BE%D1%81%D0%BE%D0%B1/.test(u)) && /patents\.google\.com\/patent\/RU2814949C1/.test(pt.link), pt); }
  // правка 1: организация помогает выбрать автора среди однофамильцев
  await pg.goto(URL0); MODE = 'orgs';  // без списка публикаций: иначе автор находится среди авторов статей списка, а не по ФИО
  await pg.fill('#author', 'Соколова Анна Викторовна'); await pg.click('#ago'); await idle(); a = await auState();
  T('0.7.11 организация не указана: два однофамильца с полным именем — выбор за человеком', !a.loaded && a.cands === 2, a);
  await pg.fill('#org', 'Other Institute of Physics'); await pg.dispatchEvent('#org', 'change');
  { const c = await pg.evaluate(() => ({ first: AU.cands[0].id, chip: document.querySelector('#outAuthor table.cands tr:nth-child(2)').innerText })); T('0.7.11 организация введена после поиска: совпавший кандидат поднялся первым, пометка «организация совпала»', c.first === 'A12' && /организация совпала/.test(c.chip), c); }
  await pg.fill('#org', 'Test University'); await pg.click('#ago'); await idle(); a = await auState();
  T('0.7.11 организация совпала ровно у одного с полным именем — выбран сам, «по ФИО и организации»', a.loaded && a.name === ANAME.A1 && /организации/.test(a.how), a);
  await pg.fill('#org', 'Вымышленный институт химии'); await pg.click('#ago'); await idle(); a = await auState();
  T('0.7.11 организация не совпала ни у кого: кандидаты не отброшены, сказано почему', !a.loaded && a.cands === 2 && a.msgs.some(m => /совпадений нет — возможно, автор сменил место работы/.test(m)), a);
  await pg.fill('#org', ''); await pg.dispatchEvent('#org', 'change'); await pg.click('#anew'); MODE = 'none';
  // 1. прошлая проверка: после перезагрузки страницы — «Продолжить», результат возвращается без запросов к базам
  { await pg.fill('#list', PUBS.slice(0, 3).map((p, i) => `${i + 1}. ${p[0]} ${p[1]}. ${p[2]}. ${p[3]}.`).join('\n')); await runL(); await pg.waitForTimeout(900);
    await pg.evaluate(() => sessionStorage.setItem('pc_keep', '1')); await pg.reload(); await pg.waitForFunction(() => REF && document.getElementById('resume').style.display !== 'none', null, { timeout: 30000 });
    const ban = await pg.evaluate(() => document.getElementById('resume').innerText); const h0 = hits.length;
    await pg.click('#resYes'); const rs = await pg.evaluate(() => ({ n: W.pubs ? W.pubs.length : 0, list: document.getElementById('list').value.split('\n').length, rows: document.querySelectorAll('#outList table.t tr').length - 1, mark: !!document.querySelector('#outList tr.done') }));
    T('0.7.11 прошлая проверка: после перезагрузки — «Продолжить прошлую проверку», 3 публикации и отметка «проверено» вернулись, к базам не обращались', /Продолжить прошлую проверку/.test(ban) && /публикаций в списке: 3/.test(ban) && rs.n === 3 && rs.rows === 3 && rs.mark && hits.length === h0, [ban, rs, hits.length - h0]);
    await pg.evaluate(() => sessionStorage.removeItem('pc_keep')); }
  // 7. снимок можно перетащить в любое место страницы
  { const b64 = fs.readFileSync(shot).toString('base64'); await pg.fill('#list', '');
    await pg.evaluate(async b64 => { const blob = await (await fetch('data:image/png;base64,' + b64)).blob(); const dt = new DataTransfer(); dt.items.add(new File([blob], 'list.png', { type: 'image/png' })); document.querySelector('#outList').dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true })); }, b64);
    await pg.waitForFunction(() => !BUSY && /распознан|не распознан|плохо/.test(document.getElementById('ocrmsg').textContent + document.getElementById('ocrwarn').textContent), null, { timeout: 180000 });
    T('0.7.11 снимок, брошенный на таблицу результатов, распознан в поле списка', await pg.evaluate(() => splitEntries(document.getElementById('list').value).length === 6), await pg.evaluate(() => document.getElementById('list').value.slice(0, 200))); }
  // правка 4: снимок с eLibrary — мелкий (684 точки), синие и фиолетовые заголовки на сером, сжатие JPEG; плюс заведомо нечитаемый снимок
  { const pe = await br.newPage({ viewport: { width: 684, height: 400 }, deviceScaleFactor: 1 }); await pe.setContent(ELIB_HTML); const fe = B + '/evals/elib.jpg'; await (await pe.$('div')).screenshot({ path: fe, type: 'jpeg', quality: 45 });
    await pe.setContent('<div style="width:420px;padding:4px;background:#d8d8d8;font:5px Arial;color:#9a9a9a;filter:blur(0.6px)">' + 'Ѫ ҂ ₰ ꙮ ≋ ⁂ ※ ⸎ ⌘ '.repeat(60) + '</div>'); const fg = B + '/evals/garbage.jpg'; await (await pe.$('div')).screenshot({ path: fg, type: 'jpeg', quality: 15 }); await pe.close();
    await pg.fill('#list', ''); await pg.setInputFiles('#file', fe); await pg.waitForFunction(() => !BUSY && /распознан|плохо/.test(document.getElementById('ocrmsg').textContent + document.getElementById('ocrwarn').textContent), null, { timeout: 180000 });
    const el = await pg.evaluate(() => { const t = document.getElementById('list').value, E = splitEntries(t); return { warn: document.getElementById('ocrwarn').innerText, msg: document.getElementById('ocrmsg').innerText, n: E.length, site: E[0] && E[0].site, pat: E.map(e => !!e.patent).join(), q1: E[0] && E[0].query, en: /THERMAL STABILITY OF LAYERED/.test(t), ru: /НАНОСТРУКТУРИРОВАННЫХ/.test(t) }; });
    console.log('  снимок eLibrary:', JSON.stringify(el).slice(0, 400));
    T('0.7.11 снимок eLibrary 684 точки: распознан без предупреждения, 4 записи, разбор eLibrary, четвёртая — патент', !el.warn && el.n === 4 && el.site === 'elibrary' && el.pat === 'false,false,false,true', el);
    T('0.7.11 снимок eLibrary: заголовки синим и фиолетовым прочитаны (русский и английский), в запрос записи 1 не попал сборник', el.en && el.ru && el.q1 && !/Материалы|конференции/.test(el.q1), el);
    await pg.fill('#list', ''); await pg.setInputFiles('#file', fg); await pg.waitForFunction(() => !BUSY && /распознан|плохо|не распознан/.test(document.getElementById('ocrmsg').textContent + document.getElementById('ocrwarn').textContent), null, { timeout: 180000 });
    const gb = await pg.evaluate(() => ({ warn: document.getElementById('ocrwarn').innerText, list: document.getElementById('list').value, btn: !!document.querySelector('#ocrwarn button') }));
    T('0.7.11 нечитаемый снимок: крупное «распознан плохо», в список ничего не вставлено, есть «Всё равно вставить»', /распознан плохо/.test(gb.warn) && gb.list.trim() === '' && gb.btn, gb);
    await pg.click('#ocrwarn button'); T('0.7.11 «Всё равно вставить» — текст вставлен, предупреждение убрано', await pg.evaluate(() => document.getElementById('ocrwarn').innerText === ''), await pg.evaluate(() => document.getElementById('list').value.length));
    await pg.fill('#list', ''); }
  // ===== 0.8: правки 1–6 (ожидания записаны до прогона; всё вымышлено, кроме названий и ISSN настоящих изданий) =====
  await pg.goto(URL0); MODE = 'none';
  // правка 1: организация не хранится между сеансами, «Найти другого автора» её очищает, «Продолжить прошлую проверку» её не возвращает
  { await pg.fill('#org', 'Test University'); await pg.dispatchEvent('#org', 'input'); await pg.dispatchEvent('#org', 'change');
    const ls = await pg.evaluate(() => localStorage.getItem('pc_org')); await pg.click('#anew'); const f1 = await pg.inputValue('#org');
    T('0.8 правка 1: организация не пишется в браузер, «Найти другого автора» очищает поле организации', ls === null && f1 === '', [ls, f1]);
    await pg.fill('#org', 'Test University'); await pg.fill('#list', '1. Sokolova A.V., Orlov D.K. Alginate sorbents for oil spill response in cold seawater. 2023. Nature.'); await runL(); await pg.waitForTimeout(900);
    await pg.evaluate(() => sessionStorage.setItem('pc_keep', '1')); await pg.reload(); await pg.waitForFunction(() => REF && document.getElementById('resume').style.display !== 'none', null, { timeout: 30000 });
    const f2 = await pg.inputValue('#org'); await pg.click('#resYes'); const f3 = await pg.inputValue('#org'); const st = await pg.evaluate(() => JSON.parse(localStorage.getItem('pc_state') || '{}').org);
    T('0.8 правка 1: после перезагрузки поле организации пустое, «Продолжить прошлую проверку» её не возвращает и не хранит', f2 === '' && f3 === '' && st === undefined, [f2, f3, st]);
    await pg.evaluate(() => sessionStorage.removeItem('pc_keep')); }
  // правка 3: справочник Scopus в строке списка (вымышленная строка списка источников подставлена в справочник страницы; Nature — настоящий ISSN)
  { await pg.evaluate(() => { loadSc(REF, { date: 'Sep 2026', rows: [['Nature', '00280836 14764687', 21206, 1, '1869-ongoing']] }); });
    await pg.fill('#list', '1. Sokolova A.V., Orlov D.K. Alginate sorbents for oil spill response in cold seawater. 2023. Nature. Q1. 64,8'); await runL();
    const r = await pg.evaluate(() => { const tr = document.querySelectorAll('#outList table.t tr')[1]; return { idx: tr.children[2].innerText, link: [...tr.children[2].querySelectorAll('a')].map(a => a.href).join(' '), q: tr.children[3].innerText, ifc: tr.children[5].innerText, tab: listTable()[0].indexOf('Scopus (список источников)') >= 0 }; });
    T('0.8 правка 3: у издания — «Scopus: индексируется» и ссылка на страницу издания в Scopus по ID; столбец Scopus в выгрузке', /Scopus: индексируется/.test(r.idx) && /scopus\.com\/sourceid\/21206/.test(r.link) && r.tab, r);
    T('0.8 правка 6: квартиль и импакт-фактор из списка — рядом с найденными («в списке: Q1», «в списке: 64,8»)', /в списке: Q1/.test(r.q) && /в списке: 64,8/.test(r.ifc), r);
    await pg.evaluate(() => { delete REF.sc; delete REF._ji; }); }
  // правки 2 и 4: прямые ссылки на профили и индекс Хирша из нескольких баз (реестр ORCID снова отвечает — выше он был отключён)
  await pg.unroute(/pub\.orcid\.org/); await pg.route(/pub\.orcid\.org/, route => { const u = decodeURIComponent(route.request().url()); hits.push(u);
    if (/\/external-identifiers/.test(u)) return json(route, { 'external-identifier': [{ 'external-id-type': 'Scopus Author ID', 'external-id-value': '57000000000' }, { 'external-id-type': 'ResearcherID', 'external-id-value': 'AAA-1234-2020' }] });
    json(route, { 'expanded-result': null, 'num-found': 0 }); });
  await pg.goto(URL0); MODE = 'many'; await pg.fill('#author', '0000-0002-1825-0097'); await pg.click('#ago'); await idle();
  { const hp = await pg.evaluate(() => { const p = document.querySelector('.hplate'); return { txt: p.innerText, links: [...p.querySelectorAll('a')].map(a => ({ h: a.href, t: a.title, x: a.textContent })) }; });
    const sc = hp.links.find(l => l.x === 'Scopus'), wos = hp.links.find(l => l.x === 'WoS'), rinc = hp.links.find(l => l.x === 'РИНЦ');
    T('0.8 правка 2: Scopus и WoS — прямые ссылки на профиль по идентификаторам из ORCID (источник в подсказке), РИНЦ — поиск', !!sc && /authorId=57000000000/.test(sc.h) && /из ORCID/.test(sc.t) && !!wos && /rid\/AAA-1234-2020/i.test(wos.h) && !!rinc && /elibrary\.ru\/authors\.asp/.test(rinc.h), hp.links);
    T('0.8 правка 4: без вставленных страниц — OpenAlex крупно с подписью, «Хирш не получен, посмотреть», поиск в интернете', /OpenAlex, свой расчёт/.test(hp.txt) && /Хирш не получен/.test(hp.txt) && hp.links.some(l => /yandex\.ru\/search/.test(l.h) && /%D0%B8%D0%BD%D0%B4%D0%B5%D0%BA%D1%81/.test(l.h)), hp); }
  { await pg.evaluate(() => hxToggle()); await pg.fill('#hxText', 'Соколова Анна Викторовна\nВымышленный университет\nSPIN-код: 1234-5678, AuthorID: 765432\nЧисло публикаций на elibrary.ru\t40\nИндекс Хирша по всем публикациям на elibrary.ru\t9\nИндекс Хирша по публикациям в РИНЦ\t7\nИндекс Хирша по ядру РИНЦ\t2'); await pg.click('#hxPanel button:has-text("Найти индекс Хирша")');
    const a1 = await pg.evaluate(() => ({ hv: document.querySelector('.hplate .hv').innerText, lab: document.querySelector('.hplate .hv').nextElementSibling.innerText, txt: document.querySelector('.hplate').innerText, panel: document.getElementById('hxPanel').innerText, saved: (JSON.parse(localStorage.getItem('pc_state') || '{}').AU || {}).hx }));
    T('0.8 правка 4: вставлена страница eLibrary — крупно 7 «РИНЦ», OpenAlex 3 рядом, РИНЦ больше не в «не получен»; значение сохраняется', a1.hv === '7' && /РИНЦ/.test(a1.lab) && /OpenAlex 3/.test(a1.txt) && !/РИНЦ[^\n]*Хирш не получен/.test(a1.txt.replace(/Scopus · WoS/, '')) && a1.saved && a1.saved.length === 1, a1);
    await pg.fill('#hxText', 'Sokolova, Anna V.\nAuthor ID: 57000000000\n56\nDocuments\n12\nh-index\nView h-graph'); await pg.click('#hxPanel button:has-text("Найти индекс Хирша")');
    await pg.fill('#hxText', 'Sokolova, Anna\nAuthor ID: 57000000009\n10\nDocuments\n14\nh-index'); await pg.click('#hxPanel button:has-text("Найти индекс Хирша")');
    const a2 = await pg.evaluate(() => ({ hv: document.querySelector('.hplate .hv').innerText, lab: document.querySelector('.hplate .hv').nextElementSibling.innerText, txt: document.querySelector('.auhead').innerText, tab: authorTable()[0][3] }));
    T('0.8 правка 4: два профиля Scopus (12 и 14) — крупно 14 «Scopus», «несколько профилей — проверьте», все значения в выгрузке', a2.hv === '14' && /Scopus/.test(a2.lab) && /несколько профилей/.test(a2.txt) && /РИНЦ: 7/.test(a2.tab) && /наибольший — 14 \(Scopus\)/.test(a2.tab), a2);
    await pg.fill('#hxText', 'Scopus author profile\nAuthor ID: 57000000000\nDocuments 56'); await pg.click('#hxPanel button:has-text("Найти индекс Хирша")');
    T('0.8 правка 4: страница без Хирша — «не найден на странице», значения не меняются', await pg.evaluate(() => /не найден/.test(document.getElementById('hxPanel').innerText) && AU.hx.length === 3), await pg.evaluate(() => document.getElementById('hxPanel').innerText.slice(0, 300)));
    await pg.unroute(/pub\.orcid\.org/); await pg.route(/pub\.orcid\.org/, r => r.abort());
    await pg.click('#anew'); T('0.8 правка 4: «Найти другого автора» убирает вставленные значения', await pg.evaluate(() => AU.hx.length === 0 && !document.querySelector('.hplate')), ''); }
  // правка 5: режим «Журнал» («Physical Review» с 0.8.1 однозначен — в списке Scopus есть журнал с таким названием, поэтому похожие — «Mater. Lett.»)
  { await pg.fill('#jq', 'Nature\n0028-0836\nMater. Lett.\nЖурнал вымышленных результатов несуществующих наук'); await pg.fill('#jy', '2023'); await pg.click('#jgo'); await pg.waitForFunction(() => /Готово/.test(document.getElementById('jstatus').textContent));
    // 0.9: журнал — строка-ведомость (.jsheet) вместо строки таблицы; текст берётся textContent (подписи показываются заглавными)
    const j = await pg.evaluate(() => { const tr = [...document.querySelectorAll('#outJournal .jsheet')].map(r => r.textContent); return { tr, nav: document.getElementById('tabs').textContent, st: document.getElementById('jstatus').textContent, view: document.body.dataset.view }; });
    T('0.8 правка 5: журналы — Nature по названию и по ISSN (Q1 на 2023, импакт-фактор, Белый список), похожие — выбор, вымышленный — «не найдено в справочниках»', j.tr.length === 4 && /Q1/.test(j.tr[0]) && /Квартиль SCImago 2023/.test(j.tr[0]) && /уровень/.test(j.tr[0]) && /Q1/.test(j.tr[1]) && /выберите/.test(j.tr[2]) && /не найдено в справочниках/.test(j.tr[3]) && /Журналы\s*4/.test(j.nav) && j.view === 'journals', j);
    // 0.9, правка 6: CiteScore у журнала — значение и квартиль, ссылка на страницу издания в Scopus, подпись Elsevier в подсказке (ожидания записаны до прогона: Nature — Scopus ID 21206)
    { const c = await pg.evaluate(() => { const a = document.querySelector('#outJournal .jsheet .cs a.csv'); return a ? { t: a.textContent, href: a.href, tip: a.title, line: a.closest('.cs').textContent } : null; });
      T('0.9 CiteScore у журнала: «CiteScore 2025», число и квартиль, ссылка scopus.com/sourceid/21206, в подсказке «© Elsevier B.V.»', !!c && /^\d+(,\d)? Q[1-4]$/.test(c.t) && /scopus\.com\/sourceid\/21206$/.test(c.href) && /Scopus CiteScore 2025, © Elsevier B\.V\./.test(c.tip) && /CiteScore 2025/.test(c.line) && /процентиль/.test(c.line), c); }
    await pg.click('#outJournal button:has-text("Это он")'); const p3 = await pg.evaluate(() => document.querySelectorAll('#outJournal .jsheet')[2].textContent);
    T('0.8 правка 5: «Это он» — выбранный журнал показан с квартилем и пометкой о неполном совпадении', /Materials Letters/.test(p3) && /Q\d/.test(p3) && /совпало не полностью/.test(p3), p3);
    // 0.9, правка 2: подсказки при вводе журнала (ожидания записаны до прогона)
    const sug = async q => { await pg.fill('#jq', ''); await pg.focus('#jq'); await pg.keyboard.type(q); await pg.waitForTimeout(400); return pg.evaluate(() => ({ vis: getComputedStyle(document.getElementById('jsug')).display !== 'none', items: [...document.querySelectorAll('#jsug .it')].map(d => d.textContent), none: (document.querySelector('#jsug .none') || {}).textContent || '' })); };
    let sg = await sug('journal of alloys');
    T('0.9 подсказки: начало названия — Journal of Alloys and Compounds с ISSN 0925-8388 и пометками', sg.vis && sg.items.some(t => /^Journal of Alloys and Compounds/.test(t) && /0925-8388/.test(t) && /SCImago Q1/.test(t) && /Scopus/.test(t)), sg);
    sg = await sug('alloys and comp'); T('0.9 подсказки: начало слова в середине названия — тоже находится', sg.items.some(t => /Journal of Alloys and Compounds/.test(t)), sg.items.slice(0, 3));
    sg = await sug('журнал технич'); T('0.9 подсказки: кириллица — Журнал технической физики', sg.items.some(t => /ЖУРНАЛ ТЕХНИЧЕСКОЙ ФИЗИКИ/i.test(t)), sg.items.slice(0, 3));
    sg = await sug('zzqxv'); T('0.9 подсказки: ничего не найдено — пояснение, поиск всё равно возможен', sg.vis && !sg.items.length && /нет названий/.test(sg.none), sg);
    sg = await sug('journal of alloys'); const first = sg.items[0] || ''; await pg.keyboard.press('ArrowDown'); await pg.keyboard.press('Enter');
    const jv = await pg.inputValue('#jq'); T('0.9 подсказки: стрелка вниз и Enter — в строку подставлены название и ISSN первого варианта, список закрыт', jv.trim() === first.replace(/ISSN (\d{4}-\d{3}[\dX]).*$/, '').trim() + ' ' + (first.match(/ISSN (\d{4}-\d{3}[\dX])/) || [])[1] && await pg.evaluate(() => getComputedStyle(document.getElementById('jsug')).display === 'none'), [jv, first]);
    const [dl] = await Promise.all([pg.waitForEvent('download'), pg.click('#jxlsx')]); T('0.8 правка 5: «Скачать Excel» для журналов', /^Журналы_.*\.xlsx$/.test(dl.suggestedFilename()), dl.suggestedFilename()); }
  // правка 6: документы — PDF с текстом (список в конце), PDF с таблицей, Word, скан
  { const pd = await br.newPage(); const fio = PUBS.slice(0, 3);
    await pd.setContent(`<body style="font:13px Times New Roman;margin:30px"><p><b>Вымышленный отчёт о работе</b></p><p>Раздел 1. Введение. В 2023 году выполнена работа по вымышленной теме.</p><p style="page-break-after:always">Текст отчёта без публикаций.</p><p><b>Список публикаций</b></p>${fio.map((p, i) => `<p>${i + 1}. ${p[0]} ${p[1]} // ${p[3]}. ${p[2]}. Vol. ${10 + i}. P. ${100 + i}-${110 + i}.${i === 0 ? ' Квартиль: Q1. Импакт-фактор: 64,8' : ''}</p>`).join('')}<p>Подпись ______________ Соколова А.В.</p></body>`);
    const f1 = B + '/evals/doc_list.pdf'; await pd.pdf({ path: f1, format: 'A4' });
    await pd.setContent(`<body style="font:12px Times New Roman;margin:20px"><p><b>2.3. Наиболее значимые научные публикации руководителя</b></p><style>td,th{border:1px solid #555;padding:4px}</style><table style="border-collapse:collapse"><tr><th>№</th><th>Авторы публикации</th><th>Название публикации</th><th>Год</th><th>Наименование издания</th><th>Импакт-фактор</th></tr>${PUBS.map((p, i) => `<tr><td>${i + 1}.</td><td>${p[0]}</td><td>${p[1]}</td><td>${p[2]}</td><td>${p[3]}</td><td>${p[4]}</td></tr>`).join('')}</table><p><b>2.4. Монографии</b></p><p>1. Sokolova A.V. Fictional monograph on sorbents. Moscow: Nauka, 2020. 300 p.</p></body>`);
    const f2 = B + '/evals/doc_table.pdf'; await pd.pdf({ path: f2, format: 'A4', landscape: true });
    const png = fs.readFileSync(shot).toString('base64'); await pd.setContent(`<body style="margin:0"><img src="data:image/png;base64,${png}" style="width:100%"></body>`); const f3 = B + '/evals/doc_scan.pdf'; await pd.pdf({ path: f3, format: 'A4', landscape: true }); await pd.close();
    const f4 = B + '/evals/doc.docx'; require('child_process').execFileSync('python3', ['-c', `import docx,sys
d=docx.Document(); d.add_paragraph('Вымышленная справка'); d.add_paragraph('Список научных трудов')
d.add_paragraph('Sokolova A.V., Orlov D.K. Alginate sorbents for oil spill response in cold seawater // Nature. 2023. Vol. 615. P. 100-110.', style='List Number')
d.add_paragraph('Orlov D.K., Sokolova A.V., Lebedev M.N. Thermal transport in layered oxide ceramics under cyclic load // Physical Review B. 2022. Vol. 105. P. 12345.', style='List Number')
d.save(sys.argv[1])`, f4]);
    const docRes = () => pg.evaluate(() => ({ box: document.getElementById('docOut').innerText, n: DOC ? DOC.recs.length : -1, recs: DOC ? DOC.recs.map(r => r.text) : [], scanned: DOC ? DOC.scanned : null }));
    const waitDoc = () => pg.waitForFunction(() => !BUSY && /найдено записей|не найдены|не прочитан/.test(document.getElementById('docOut').innerText), null, { timeout: 240000 });
    await pg.fill('#list', ''); await pg.setInputFiles('#dfile', f1); await waitDoc(); let d = await docRes();
    T('0.8 правка 6: PDF со списком в конце — 3 записи, раздел «Список публикаций», подпись и текст отчёта не попали', d.n === 3 && /Список публикаций/.test(d.box) && !d.recs.some(t => /Подпись|Введение/.test(t)), d);
    await pg.click('#docOut tr:nth-child(4) input[type=checkbox]'); await pg.click('#docOut button:has-text("Проверить отмеченные (2)")'); await pg.waitForFunction(() => /Готово|неполный/.test(document.getElementById('status').textContent) && !BUSY, null, { timeout: 60000 });
    const lr = await pg.evaluate(() => ({ n: W.pubs.length, f: W.pubs.map(p => p.found).join(), q: document.querySelectorAll('#outList table.t tr')[1].children[3].innerText, docGone: document.getElementById('docOut').style.display === 'none' }));
    T('0.8 правка 6: «Проверить отмеченные» — 2 записи проверены, у первой «в списке: Q1» рядом с найденным квартилем', lr.n === 2 && lr.f === 'ok,ok' && /в списке: Q1/.test(lr.q) && lr.docGone, lr);
    await pg.setInputFiles('#dfile', f2); await waitDoc(); d = await docRes();
    T('0.8 правка 6: PDF с таблицей публикаций — 6 строк таблицы, импакт-фактор из таблицы в записи, монография из раздела 2.4 не попала', d.n === 6 && /Alginate sorbents/.test(d.recs[0]) && /64,8/.test(d.recs[0]) && !d.recs.some(t => /monograph/.test(t)), d);
    await pg.click('#docOut button:has-text("Закрыть")');
    await pg.setInputFiles('#dfile', f4); await waitDoc(); d = await docRes();
    T('0.8 правка 6: Word с автонумерацией — 2 записи с номерами 1 и 2', d.n === 2 && /^1\. Sokolova/.test(d.recs[0]) && /^2\. Orlov/.test(d.recs[1]), d);
    await pg.click('#docOut button:has-text("Закрыть")');
    await pg.setInputFiles('#dfile', f3); await waitDoc(); d = await docRes();
    T('0.8 правка 6: скан в PDF — страница распознана как снимок, найдено 6 записей, пометка «сканы»', d.n === 6 && d.scanned && d.scanned.length === 1 && /скан/.test(d.box), d);
    await pg.click('#docOut button:has-text("Закрыть")');
    const tf = B + '/evals/doc_none.pdf'; { const pn = await br.newPage(); await pn.setContent('<p>Отчёт о командировке. Поездка прошла в 2024 году успешно, встречи проведены.</p>'); await pn.pdf({ path: tf }); await pn.close(); }
    await pg.setInputFiles('#dfile', tf); await waitDoc(); d = await docRes();
    T('0.8 правка 6: документ без публикаций — «публикации не найдены», предложено вставить текст', d.n === 0 && /публикации не найдены/.test(d.box) && /вставьте/i.test(d.box), d);
    await pg.click('#docOut button:has-text("Закрыть")'); await pg.fill('#list', ''); }
  await pg.screenshot({ path: B + '/evals/shot_list.png', fullPage: true });
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
  T('сайт: справочники загружены отдельным файлом, страница закрыта от поисковиков, «Что нового» есть', /Справочники: SCImago/.test(si.ref) && /noindex/.test(si.robots) && !si.btn && /^0\.\d/.test(si.ch), si);
  const ts = Date.now(); await ps.setInputFiles('#file', shot); await ps.waitForFunction(() => /распознан|не распознан/.test(document.getElementById('ocrmsg').textContent) && !BUSY, null, { timeout: 180000 });
  const sn = await ps.evaluate(() => [document.getElementById('ocrmsg').textContent, splitEntries(document.getElementById('list').value).length]);
  T('сайт: распознавание подгружается при первом снимке и читает список (6 записей)', /Снимок распознан/.test(sn[0]) && sn[1] === 6, sn); console.log(`Сайт: распознавание с загрузкой — ${Math.round((Date.now() - ts) / 1000)} с`);
  // 0.8: на сайте чтение PDF подгружается при первом документе (папка pdf/)
  { await ps.setInputFiles('#dfile', B + '/evals/doc_list.pdf'); await ps.waitForFunction(() => !BUSY && /найдено записей|не найдены|не прочитан/.test(document.getElementById('docOut').innerText), null, { timeout: 60000 });
    const sd = await ps.evaluate(() => ({ n: DOC ? DOC.recs.length : -1, box: document.getElementById('docOut').innerText.slice(0, 200) })); T('0.8 сайт: PDF читается (pdf.js подгружен из папки pdf/), 3 записи', sd.n === 3, sd); }
  T('сайт: полоса ошибок скрыта', await ps.evaluate(() => document.getElementById('pgerr').style.display === 'none'), 'видна');
  // справочник не загрузился: сообщение и «Повторить», кнопка «Проверить связь» работает (ожидания записаны до прогона)
  { const pf = await br.newPage({ viewport: { width: 1200, height: 800 } }); await pf.route(/data\/ref\.json/, r => r.fulfill({ status: 500, body: 'x' })); await pf.route(/crossref|openalex|orcid|journalrank/, r => r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{}' }));
    await pf.goto('http://localhost:8765/'); await pf.waitForFunction(() => /не загружены/.test(document.getElementById('refinfo').textContent), null, { timeout: 30000 });
    const st = await pf.evaluate(() => [document.getElementById('refinfo').innerText, document.getElementById('go').disabled, !!document.querySelector('#refinfo button')]);
    await pf.evaluate(() => { document.querySelector('details:has(#ping)').open = true; }); await pf.click('#ping'); await pf.waitForFunction(() => !document.getElementById('ping').disabled, null, { timeout: 30000 });
    const pr = await pf.evaluate(() => document.getElementById('pingres').innerText);
    T('сайт: справочник не загрузился — сообщение, «Повторить», поиск выключен, «Проверить связь» работает', /справочники не загружены/.test(st[0]) && st[1] === true && st[2] && /Crossref/.test(pr), [st, pr.slice(0, 120)]); await pf.close(); }
  T('сайт: без ошибок страницы', serr.length === 0, serr); srv.close();
  console.log('Ошибки страницы:', errs.length ? errs : 'нет'); console.log(`Распознавание списка: ${ocrSec} с`);
  out.forEach(x => console.log(x));
  console.log(`${idsOk ? 'верно  ' : 'НЕВЕРНО'} — снимок с идентификаторами распознан без ошибок` + (idsOk ? '' : ': ' + JSON.stringify(parsed)));
  console.log(`Итого: ${out.filter(x => x.startsWith('верно')).length + (idsOk ? 1 : 0)} из ${out.length + 1}`);
  await br.close();
})();
