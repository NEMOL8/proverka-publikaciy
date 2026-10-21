// Контрольные кейсы правил. Ожидания записаны до прогона: по общеизвестным сведениям об изданиях и решениям Германа.
// Запуск: node evals/run.js
const fs = require('fs'), path = require('path'); const B = path.join(__dirname, '..');
const src = fs.readFileSync(B + '/src/core.js', 'utf8').replace(/if \(typeof module[^\n]*\n?$/m, '') + fs.readFileSync(B + '/src/net.js', 'utf8').replace(/if \(typeof module[^\n]*\n?$/m, '') + fs.readFileSync(B + '/src/extra.js', 'utf8').replace(/if \(typeof module[^\n]*\n?$/m, '');
const A = new Function(src + '\nreturn {loadSc,parseCoverage,scAt,findSc,findJournalQuery,journalFacts,titleSim,idFromOrcidItem,collectAuthorIds,parseHirschPage,hirschSummary,findDocRecords,declQuartile,orgHit,leaderByOrg,ocrQuality,isElibList,CACHE,cacheKey,judgePub,getJson,tfetch,PING_MS,corrOf,orgMatch,findDuplicates,instNames,oaShip,orcidExternalIds,ST,matchScore,findDoi,FOUND_OK,oaWork,oaSearchWorks,instRu,loadRef,findJournal,splitEntries,splitSiteEntries,detectSite,isUiLine,parseEntry,titleScore,canonName,leaderVariants,sameSurname,authorPosition,journalVerdict,judgePub,judgeProfileWork,detectLeader,parseAuthorInput,orcidValid,wlAt,passFilter,parseFIO,nameMatch,translitVariants,NET,crWork,findWork,enrichOA,enrichWL,authorInfo,searchAuthors,authorByOrcid,authorByScopus,orcidSearch,runSelfCheck,SELF,authorWorks,cleanOrcid,pingAll};')();
const DATA = JSON.parse(fs.readFileSync(B + '/data/ref.json', 'utf8'));
// вымышленные издания для кейсов «квартиль по годам»: история задана за 2021–2025, более ранние годы справочника — пусто
const fake = (t, issn, h) => DATA.sj.push([t, issn, 0, '', 900000 + DATA.sj.length, ...Array(2 * (DATA.sjYears.length - 5)).fill(null), ...h]);
fake('Test A', '99900001', [2, 5, 2, 5, 3, 5, 3, 5, 3, 5]);            // Q2 → Q3
fake('Test B', '99900002', [3, 5, 3, 5, 2, 5, 1, 5, 1, 5]);            // Q3 → Q1
fake('Test C', '99900003', [1, 5, 1, 5, null, null, null, null, null, null]); // есть только в 2021–2022
fake('Test D', '99900004', [1, 14, 1, 12, 1, 9, 1, 7, 1, 6]);          // показатель упал ниже порога
fake('Test E', '99900005', [4, 1, 4, 1, 4, 1, 4, 1, 4, 1]);            // всегда Q4
A.loadRef(DATA);
const { ST } = A; let pass = 0, fail = 0; const fails = [];
const eq = (name, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want); ok ? pass++ : (fail++, fails.push(`${name}: получено ${JSON.stringify(got)}, ожидалось ${JSON.stringify(want)}`)); };
const jv = (issn, title) => A.journalVerdict(A.findJournal(issn ? [issn] : [], title));


/* --- 0.7.10, правка 6: снимок страницы сайта — элементы интерфейса не попадают в запись.
   Снимки вымышленные, составлены по обычному виду страниц этих баз. Ожидания записаны до прогона. --- */
{
  const ORCID_SHOT = `Works (2)
Sort
Синтез наноструктурированных покрытий на основе оксида титана
Вестник вымышленного университета / 2021-05 | Journal article
DOI: 10.1234/vym.2021.05.014
CONTRIBUTORS: Иванов И. И.; Петрова М. С.
Source: Вымышленный университет
Preferred source (of 2)
Thermal stability of layered composite coatings
Journal of Fictional Materials / 2019 | Journal article
CONTRIBUTORS: Ivanov I.; Smirnov A.
Source: Crossref`;
  const SCHOLAR_SHOT = `Статьи
Синтез тонких плёнок методом магнетронного распыления
ИИ Иванов, МС Петрова — Вестник вымышленного университета, 2021 — vym.example.ru
… в работе рассмотрен синтез тонких плёнок оксида титана …
☆ Сохранить 99 Цитировать Цитировано: 12 Похожие статьи Все версии статьи (3)
Layered composite coatings for extreme conditions
A Ivanov, M Petrova — Journal of Fictional Materials, 2019 — fict.example.org
… coatings were tested under cyclic load …
☆ Сохранить Цитировать Цитировано: 4 Похожие статьи Все версии статьи (2)
Похожие запросы
тонкие плёнки синтез
магнетронное распыление`;
  const SCOPUS_SHOT = `Documents
1-2 of 2
Sort by: Date (newest)
Export all Download Select all
Synthesis of nanostructured titanium oxide coatings
Ivanov, I., Petrova, M.
Journal of Fictional Materials, 2021, 14(3), pp. 211-220
Cited by 12
View abstract
Thermal stability of layered composite coatings
Ivanov, I., Smirnov, A.
Fictional Surface Science, 2019, 8(1), pp. 15-24
Cited by 4
View abstract`;
  const ELIB_SHOT = `Общее число публикаций: 2
Число цитирований: 16
Название
Соавторы
Журнал
Год
Синтез наноструктурированных покрытий оксида титана
Иванов И.И., Петрова М.С.
Вестник вымышленного университета
2021
Термическая стойкость слоистых композитных покрытий
Иванов И.И., Смирнов А.В.
Вымышленный journal материалов
2019`;
  const WOS_SHOT = `Author Records
Create Citation Report
1 - 2 of 2
Synthesis of nanostructured titanium oxide coatings
By: Ivanov, I; Petrova, M
JOURNAL OF FICTIONAL MATERIALS, 2021, Volume 14, Issue 3, Pages 211-220
Times Cited: 12
View Abstract
Thermal stability of layered composite coatings
By: Ivanov, I; Smirnov, A
FICTIONAL SURFACE SCIENCE, 2019, Volume 8, Issue 1, Pages 15-24
Times Cited: 4
View Abstract`;
  eq('0.7.10 / снимок узнан: ORCID, Scholar, Scopus, eLibrary, WoS', [ORCID_SHOT, SCHOLAR_SHOT, SCOPUS_SHOT, ELIB_SHOT, WOS_SHOT].map(A.detectSite), ['orcid', 'scholar', 'scopus', 'elibrary', 'wos']);
  const n = t => A.splitEntries(t).length, q = t => A.splitEntries(t).map(e => e.query).join(' | '), yr = t => A.splitEntries(t).map(e => e.years[0]);
  eq('0.7.10 / ORCID: две записи, годы, DOI', [n(ORCID_SHOT), yr(ORCID_SHOT), A.splitEntries(ORCID_SHOT)[0].doi], [2, [2021, 2019], '10.1234/vym.2021.05.014']);
  eq('0.7.10 / ORCID: «Source» и «Preferred source» в запись не попали', /Preferred source|Source:/i.test(q(ORCID_SHOT)), false);
  eq('0.7.10 / Google Scholar: две записи и годы', [n(SCHOLAR_SHOT), yr(SCHOLAR_SHOT)], [2, [2021, 2019]]);
  eq('0.7.10 / Google Scholar: «Цитировано», «Похожие статьи» и блок «Похожие запросы» выброшены', /Цитировано|Похожие статьи|Все версии|Похожие запросы|магнетронное распыление$/.test(q(SCHOLAR_SHOT)), false);
  eq('0.7.10 / Scopus: две записи, годы, без «Cited by» и «View abstract»', [n(SCOPUS_SHOT), yr(SCOPUS_SHOT), /Cited by|View abstract|Export all|1-2 of 2/i.test(q(SCOPUS_SHOT))], [2, [2021, 2019], false]);
  eq('0.7.10 / eLibrary: две записи, годы, без заголовков колонок и счётчиков', [n(ELIB_SHOT), yr(ELIB_SHOT), /Общее число публикаций|Число цитирований|^Соавторы$/m.test(q(ELIB_SHOT))], [2, [2021, 2019], false]);
  eq('0.7.10 / WoS: две записи, годы, без «Times Cited» и «Create Citation Report»', [n(WOS_SHOT), yr(WOS_SHOT), /Times Cited|Create Citation Report|View Abstract/i.test(q(WOS_SHOT))], [2, [2021, 2019], false]);
  eq('0.7.10 / в записи осталось название статьи', [/Синтез наноструктурированных покрытий/.test(q(ORCID_SHOT)), /Layered composite coatings/.test(q(SCHOLAR_SHOT)), /Synthesis of nanostructured/.test(q(SCOPUS_SHOT))], [true, true, true]);
  // обычный список из заявки не должен попасть под разборщики сайтов
  const PLAIN = `1. Иванов И.И., Петрова М.С. Синтез тонких плёнок оксида титана. Вестник университета. 2021. DOI 10.1234/a.2021.1
2. Ivanov I., Smirnov A. Thermal stability of layered composites. Journal of Materials. 2019.`;
  eq('0.7.10 / обычный список заявки: сайт не определяется, разбор прежний', [A.detectSite(PLAIN), n(PLAIN)], [null, 2]);
  eq('0.7.10 / строка со статьёй интерфейсной не считается', [A.isUiLine('Cited by 12'), A.isUiLine('Next'), A.isUiLine('Страница 2 из 7'), A.isUiLine('Синтез тонких плёнок методом магнетронного распыления'), A.isUiLine('DOI: 10.1234/vym.2021.05.014')], [true, true, true, false, false]);
}


/* --- 0.7.11. Ожидания записаны до прогона; все данные вымышленные --- */
{
  // правка 1: организация для выбора автора
  const MIS = 'National University of Science and Technology MISIS';
  eq('0.7.11 / организация: «НИТУ МИСИС» и английское название — совпала', A.orgHit([MIS], 'НИТУ МИСИС'), 'yes');
  eq('0.7.11 / организация: русское название (из OpenAlex) и русский ввод — совпала', A.orgHit(['Test University', 'Национальный исследовательский технологический университет «МИСИС»'], 'НИТУ «МИСИС»'), 'yes');
  eq('0.7.11 / организация: только общее слово-понятие («Московский») — частично, а не «совпала»', A.orgHit(['Moscow Institute of Physics and Technology'], 'Московский'), 'part');
  eq('0.7.11 / организация: общих слов нет — «нет»', A.orgHit(['Other Institute of Physics'], 'Test University'), 'no');
  eq('0.7.11 / организация: у кандидата не указана — «не указана»', A.orgHit([], 'НИТУ МИСИС'), 'unk');
  eq('0.7.11 / организация: не введена — не учитывается', A.orgHit(['Test University'], '  '), null);
  const wk = [{ oaAuthors: [{ id: 'A1', name: 'Anna Sokolova', inst: [{ name: 'Test University' }] }, { id: 'A9', name: 'A. Sokolova', inst: [{ name: 'Other Institute of Physics' }] }] }];
  const cs = [{ id: 'A1', name: 'Anna Sokolova' }, { id: 'A9', name: 'A. Sokolova' }];
  eq('0.7.11 / однофамильцы среди авторов статей: организация оставляет одного', (r => [r.hit, r.list.map(x => x.id)])(A.leaderByOrg(wk, cs, 'Test University')), ['yes', ['A1']]);
  eq('0.7.11 / однофамильцы: организация ни у кого не совпала — никого не отбрасываем', (r => [r.hit, r.list.length])(A.leaderByOrg(wk, cs, 'Вымышленный институт химии')), ['none', 2]);
  eq('0.7.11 / однофамильцы: организация не указана — список как был', (r => [r.hit, r.list.length])(A.leaderByOrg(wk, cs, '')), [null, 2]);
  // правка 4: список eLibrary в настоящем виде (текст, как его даёт распознавание: номер, флажок, НАЗВАНИЕ, авторы, источник, число цитирований справа)
  const EL = `Публикации автора
1 |! СИНТЕЗ НАНОСТРУКТУРИРОВАННЫХ ПОКРЫТИЙ НА ОСНОВЕ ОКСИДА ТИТАНА 0
Иванов И.И., Петрова М.С.
В сборнике: Материалы Всероссийской научной конференции «Вымышленные материалы». Москва, 2025. С. 26.
2 THERMAL STABILITY OF LAYERED COMPOSITE COATINGS UNDER CYCLIC 5
LOAD
Ivanov I.I., Smirnov A.V.
Materials Letters. 2025. Т. 382. С. 137913.
3 ВЫМЫШЛЕННЫЙ СОРБЕНТ ДЛЯ ОЧИСТКИ ХОЛОДНОЙ МОРСКОЙ ВОДЫ
2
Петрова М.С., Иванов И.И.
Журнал вымышленной физики. 2024. Т. 94. № 3. С. 210-218.
4 СПОСОБ ПОЛУЧЕНИЯ ВЫМЫШЛЕННОГО ЗАЩИТНОГО ПОКРЫТИЯ
Иванов И.И., Петрова М.С.
Патент на изобретение ВО 2814949 С1, 07.03.2024. Заявка № 2023121420 от 16.08.2023.`;
  const E = A.splitEntries(EL);
  eq('0.7.11 / eLibrary: узнан по виду списка, 4 записи с номерами 1–4', [A.detectSite(EL), E.length, E.map(e => e.num)], ['elibrary', 4, [1, 2, 3, 4]]);
  eq('0.7.11 / eLibrary: название с переносом склеено, число цитирований справа и флажок в запись не попали', [/UNDER CYCLIC LOAD/.test(E[1].query), /^\|!|\s0 Иванов|COATINGS UNDER CYCLIC 5/.test(E[0].query + E[1].query), /ВОДЫ 2 Петрова/.test(E[2].query)], [true, false, false]);
  eq('0.7.11 / «В сборнике:» — в запрос идёт название статьи и год, сборник отдельно', [/^СИНТЕЗ НАНОСТРУКТУРИРОВАННЫХ/.test(E[0].query), /Материалы|конференции/.test(E[0].query), /2025$/.test(E[0].query), /^Материалы Всероссийской/.test(E[0].container || '')], [true, false, true, true]);
  eq('0.7.11 / патент: распознан (номер и с ошибками распознавания «ВО … С1»), статьи — нет', [E.map(e => !!e.patent), E[3].patentNo], [[false, false, false, true], 'RU2814949C1']);
  eq('0.7.11 / патент на полезную модель в обычном списке', (e => [e.patent, e.patentNo])(A.parseEntry('5. Иванов И.И. Вымышленное устройство. Патент на полезную модель RU 225524 U1, 2024.')), [true, 'RU225524U1']);
  eq('0.7.11 / патент: в базах не ищется, пометка «патент», не «не найдена»', (r => [r.found, r.work, r.notes.some(n => /патент — в Crossref и OpenAlex не ищется/.test(n))])(A.judgePub(E[3], undefined, {})), ['patent', null, true]);
  eq('0.7.11 / «В сборнике:» и в обычном нумерованном списке', (e => [/конференции/.test(e.query), /Вымышленный доклад о покрытиях/.test(e.query)])(A.splitEntries('1. Иванов И.И. Вымышленный доклад о покрытиях // В сборнике: Труды конференции «Покрытия». 2023. С. 5.\n2. Петрова М.С. Другая статья. Вестник. 2022.')[0]), [false, true]);
  const GOST = `1. Иванов И.И., Петрова М.С. Синтез тонких плёнок оксида титана // Вестник вымышленного университета. 2021. Т. 5. № 2. С. 10–20.
2. Петрова М.С. Термическая стойкость покрытий // Журнал вымышленной физики. 2022. Т. 94. С. 210–218.`;
  eq('0.7.11 / обычный список по ГОСТ («2021. Т. 5. С. 10») за eLibrary не принимается', [A.detectSite(GOST), A.splitEntries(GOST).length], [null, 2]);
  eq('0.7.11 / качество распознавания: мусор — низкая доля читаемых слов, обычный список — высокая', [A.ocrQuality('О*® ОУ О © О” ©О” ©0» ОЕ5ТСМ АМО ©О').ratio < 0.35, A.ocrQuality(GOST).ratio >= 0.35], [true, true]);
  // удобство 2: ключ кеша без ключа OpenAlex
  eq('0.7.11 / кеш: ключ OpenAlex в адрес-ключ кеша не попадает', A.cacheKey('https://api.openalex.org/works?search=x&api_key=SECRET&per-page=5'), 'https://api.openalex.org/works?search=x&per-page=5');
}

// --- издания (0.7.9: только факты, без выводов «да/нет»): [кейс, ISSN, название, квартиль за последний год, найдено в SCImago, найдено в Белом списке]
const fj = (issn, title) => A.findJournal(issn ? [issn] : [], title);
[['Nature', '0028-0836', 'Nature', 1, true, true],
 ['Physical Review B', '2469-9950', 'Physical Review B', 1, true, true],
 ['ЖТФ: в SCImago нет, в Белом списке есть', '0044-4642', 'Журнал технической физики', undefined, false, true],
 ['Издания нет в справочниках', '9999-9999', 'Вестник вымышленного университета', undefined, false, false],
 ['ISSN без дефиса', '00280836', '', 1, true, true],
].forEach(([n, i, t, q, inSj, inWl]) => { const v = jv(i, t), j = fj(i, t); eq('издание / ' + n, [v.qL, !!j.sj, !!j.wl], [q, inSj, inWl]); });
eq('издание / поиск по названию без ISSN — с пометкой', [!!fj('', 'Physical Review Letters').sj, jv('', 'Physical Review Letters').notes.some(x => /по названию/.test(x))], [true, true]);
eq('издание / Nature: импакт-фактор SCImago больше 10', jv('0028-0836', 'Nature').cpd > 10, true);
eq('издание / нет выводов «подходит / не подходит»', ['qual', 'ifSt', 'qualWhy', 'ifWhy'].filter(k => k in jv('0028-0836', 'Nature')), []);
eq('издание / примечание об исключении', jv('2211-3835', '').notes.some(x => /исключено из Белого списка/.test(x)), true);

// --- уровень Белого списка на год публикации (ожидания по решению Германа 12.10.2026)
{ const W1 = (l23, l25, l26, st, disc) => ({ levels: { 2023: l23, 2025: l25, 2026: l26 }, state: st || 0, disc: disc || '' });
  const at = (w, y) => { const r = A.wlAt(w, y); return [r.lv, r.y, r.exact, r.excluded, r.cur]; };
  eq('БС на год / 2024 → уровень 2023', at(W1(2, 1, 0), 2024), [2, 2023, true, false, 1]);
  eq('БС на год / 2025 → уровень 2025', at(W1(2, 1, 0), 2025), [1, 2025, true, false, 1]);
  eq('БС на год / 2021 → уровень 2023 с пометкой', at(W1(2, 1, 0), 2021), [2, 2023, false, false, 1]);
  eq('БС на год / 2026, уровня 2026 нет → уровень 2025', at(W1(3, 2, 0), 2026), [2, 2025, true, false, 2]);
  eq('БС на год / исключён в 2024, статья 2023 → уровень', at(W1(1, 0, 0, 2, '11.07.2024'), 2023), [1, 2023, true, false, 0]);
  eq('БС на год / исключён в 2024, статья 2025 → исключён', at(W1(1, 0, 0, 2, '11.07.2024'), 2025)[3], true);
  eq('БС на год / исключён в 2024, статья 2024 → под вопросом', A.wlAt(W1(1, 0, 0, 2, '11.07.2024'), 2024).ambiguous, true); }
// --- фильтры (решение Германа: квартиль и БС — «или», годы — «и»)
{ const R = (qY, wlLv, y, excl) => ({ qY, wl: wlLv, y, excl });
  const f = (rows, flt) => rows.filter(r => A.passFilter(r, flt)).length;
  const rows = [R(1, 0, 2022), R(2, 1, 2023), R(3, 1, 2024), R(4, 0, 2025), R(0, 2, 2021), R(1, 1, 2020), R(null, null, 2023), R(2, 1, 2024, true)];
  eq('фильтр / ничего не выбрано — все', f(rows, { q: [], wl: [] }), 8);
  eq('фильтр / Q1 или БС 1 (пример Германа)', f(rows, { q: ['1'], wl: ['1'] }), 4);
  eq('фильтр / только Q1', f(rows, { q: ['1'], wl: [] }), 2);
  eq('фильтр / только БС 1', f(rows, { q: [], wl: ['1'] }), 3);
  eq('фильтр / Q1 или БС 1, годы 2022–2024', f(rows, { q: ['1'], wl: ['1'], yFrom: 2022, yTo: 2024 }), 3);
  eq('фильтр / без квартиля', f(rows, { q: ['none'], wl: [] }), 2);
  eq('фильтр / нет в Белом списке', f(rows, { q: [], wl: ['none'] }), 3);
  eq('фильтр / исключён', f(rows, { q: [], wl: ['excl'] }), 1);
  eq('фильтр / статья без найденных данных не проходит выбранный фильтр', A.passFilter(R(undefined, undefined, undefined), { q: ['1'], wl: [] }), false); }

// --- квартиль по годам (0.7.9: справочник SCImago 2006–2025; на год публикации и сейчас — факты)
const jy = (issn, y, live, oa) => A.journalVerdict(A.findJournal([issn], ''), y, live || null, oa == null ? null : oa);
eq('годы / Q2→Q3: на 2021 — Q2, сейчас Q3', [jy('9990-0001', 2021).qY, jy('9990-0001', 2021).qL], [2, 3]);
eq('годы / Q3→Q1: на 2024 — Q1', jy('9990-0002', 2024).qY, 1);
eq('годы / издание только до 2022, статья 2024: взят 2022 с пометкой', [jy('9990-0003', 2024).sjYear, jy('9990-0003', 2024).notes.some(x => /только до 2022/.test(x))], [2022, true]);
eq('годы / статья 2026, данных за год ещё нет: взят 2025 с пометкой', [jy('0028-0836', 2026).sjYear, jy('0028-0836', 2026).sjExact], [2025, false]);
eq('годы / статья 2019: год теперь есть в справочнике', [jy('0028-0836', 2019).sjYear, jy('0028-0836', 2019).sjExact, jy('0028-0836', 2019).qY], [2019, true, 1]);
eq('годы / статья 2004: выгрузки нет — взят 2006 с пометкой', [jy('0028-0836', 2004).sjYear, jy('0028-0836', 2004).sjExact, jy('0028-0836', 2004).notes.some(x => /2004/.test(x))], [2006, false, true]);
eq('годы / справочник SCImago начинается с 2006', DATA.sjYears[0], 2006);
eq('годы / показатель на год публикации 14, сейчас 6', [jy('9990-0004', 2021).cpd, jy('9990-0004', 2021).cpdLast], [14, 6]);
eq('годы / Technical Physics 2021: Q3', jy('1063-7842', 2021).qY, 3);
// --- сайт Белого списка против справочника: расхождение показывается, а не решается
const LV = (a, b, c, st) => ({ found: true, levels: { 2023: a, 2025: b, 2026: c }, state: st || 0, disc: '' });
eq('сайт БС / совпадает со справочником', jy('0028-0836', 2023, LV(1, 0, 0)).wlDiff, undefined);
eq('сайт БС / издания на сайте нет — расхождение показано', [jy('0028-0836', 2023, { found: false }).wlDiff, jy('0028-0836', 2023, { found: false }).notes.some(x => /издания нет; проверьте/.test(x))], [true, true]);
eq('сайт БС / в справочнике нет, на сайте уровень 1 — расхождение', jy('9990-0005', 2023, LV(1, 1, 0)).wlDiff, true);
eq('сайт БС / ЖТФ: на сайте исключён — расхождение', jy('0044-4642', 2024, LV(2, 1, 0, 2)).wlDiff, true);
eq('OpenAlex / показатель OpenAlex передаётся рядом с SCImago', jy('2469-9950', 2023, null, 15).oaCpd, 15);

// --- разбор списка
const L1 = `1. Ivanov I.I., Petrov P.P. Thermal conductivity of layered
oxide ceramics under cyclic load. 2023. Journal of Applied
Ceramics. 4,7
2. Petrov P.P., Ivanov I.I. Sorption of oil products by alginate gels // Marine Chemistry, 2022, vol. 15, p. 100-110. DOI: 10.1234/mc.2022.0155. IF 11.2
3) Сидоров С.С., Иванов И.И. Модель переноса тепла в пористых средах. Журнал технической физики. 2021. Т. 91. № 4.`;
const e1 = A.splitEntries(L1);
eq('разбор / число записей (нумерация «3)» после «2.»)', e1.length, 3);
eq('разбор / перенос строк склеен', /layered oxide ceramics/.test(e1[0].query), true);
eq('разбор / ИФ в конце', e1[0].declIF, 4.7);
eq('разбор / год', e1[0].years, [2023]);
eq('разбор / DOI', e1[1].doi, '10.1234/mc.2022.0155');
eq('разбор / ИФ после «IF»', e1[1].declIF, 11.2);
eq('разбор / ИФ не взят из тома и страниц', e1[2] && e1[2].declIF, null);
eq('разбор / без номеров — по пустым строкам', A.splitEntries('Ivanov I. First long enough title here 2022\nJournal One\n\nPetrov P. Second long enough title 2023 Journal Two').length, 2);
eq('разбор / без номеров и пустых строк — по строкам', A.splitEntries('Ivanov I. First long enough title here 2022\nPetrov P. Second long enough title 2023').length, 2);
eq('разбор / мусорные короткие строки отброшены', A.splitEntries('№\nАвторы\n1. Ivanov I. A reasonably long title of paper 2022').length, 1);

// --- разбор списка: случаи, найденные на настоящих данных 09.10.2026 (в вымышленном виде)
{ const sp = t => A.splitEntries(t).map(e => [e.num, e.years]);
  const L8 = `7. Orlov D.K., Sokolova A.V. (2015) Sorbents for cold seawater. Marine Chemistry 12, 1-10

8. Sokolova A.V., Lebedev M.N. (1999) Toxicity of alginate gels and

floating booms on the coastal sediments, head samples, and thoracic layers 44, 139-146

9. Lebedev M.N. (2004) Effects of a chronic exposure of brown algae. Arch Environ 47, 471-478`;
  eq('разбор / пустая строка внутри записи, список начинается с 7: три записи', sp(L8), [[7, [2015]], [8, [1999]], [9, [2004]]]);
  eq('разбор / вторая половина записи приклеена к ней', /floating booms/.test(A.splitEntries(L8)[1].query), true);
  eq('разбор / потерянный номер в середине: 1, 2, 4', A.splitEntries('1. Ivanov I. First long enough title 2021\n2. Petrov P. Second long enough title 2022\nSidorov S. Third long enough title lost number 2023\n4. Kim K. Fourth long enough title 2024').map(e => e.num), [1, 2, 4]);
  eq('разбор / потерянный номер: третья запись не потерялась, а приклеилась ко второй', /Third/.test(A.splitEntries('1. Ivanov I. First long enough title 2021\n2. Petrov P. Second long enough title 2022\nSidorov S. Third long enough title lost number 2023\n4. Kim K. Fourth long enough title 2024')[1].query), true);
  eq('разбор / пропущенный номер отмечен у предыдущей записи', /нет № 3/.test(A.splitEntries('1. Ivanov I. First long enough title 2021\n2. Petrov P. Second long enough title 2022\nSidorov S. Third long enough title lost number 2023\n4. Kim K. Fourth long enough title 2024')[1].warn || ''), true);
  eq('разбор / номер 3 пропущен совсем: 1, 2, 4, 5 — четыре записи', A.splitEntries('1. Ivanov I. First long enough title 2021\n2. Petrov P. Second long enough title 2022\n4. Kim K. Fourth long enough title 2024\n5. Lee L. Fifth long enough title 2025').map(e => e.num), [1, 2, 4, 5]);
  eq('разбор / без номеров, запись перенесена на две строки через пустую', sp('Ivanov I. (2021) A long enough first title about sorbents and\n\nthe second half without any year at all\n\nPetrov P. (2022) Second long enough title here'), [[null, [2021]], [null, [2022]]]);
  eq('разбор / номер тома в начале строки не принимается за номер записи', A.splitEntries('1. Ivanov I. (2021) First long enough title. Journal\n47. 471-478\n2. Petrov P. (2022) Second long enough title').length, 2); }

// --- фамилии
[['Иващенко', 'Ivashchenko', true], ['Иващенко', 'Ivaschenko', true], ['Иващенко', 'Ivashenko', true], ['Юрьев', 'Yuriev', true], ['Юрьев', 'Iurev', true],
 ['Щербаков', 'Shcherbakov', true], ['Щербаков', 'Scherbakov', true], ['Хохлов', 'Khokhlov', true], ['Хохлов', 'Hohlov', true], ['Новосёлов', 'Novoselov', true],
 ['Цветков', 'Tsvetkov', true], ['Яковлев', 'Iakovlev', true], ['Яковлев', 'Jakowlew', true], ['Чайковский', 'Tchaikovsky', true], ['Müller', 'Muller', true],
 ['Петров', 'Popov', false], ['Иванов', 'Ivanenko', false], ['Ли', 'Liu', false], ['Ким', 'Kim', true],
].forEach(([a, b, w]) => eq(`фамилия / ${a} — ${b}`, A.sameSurname(b, A.leaderVariants(a)), w));
const AU = [{ given: 'P.', family: 'Petrov' }, { given: 'I.', family: 'Ivanov' }, { given: 'S.', family: 'Sidorov' }];
eq('автор / первый', A.authorPosition(AU, A.leaderVariants('Петров')).pos, 'first');
eq('автор / в середине', A.authorPosition(AU, A.leaderVariants('Иванов')).pos, 'middle');
eq('автор / последний', A.authorPosition(AU, A.leaderVariants('Сидоров')).pos, 'last');
eq('автор / нет среди авторов', A.authorPosition(AU, A.leaderVariants('Кузнецов')).pos, 'none');
eq('автор / фамилия не задана', A.authorPosition(AU, []).pos, 'unknown');
eq('автор / два написания через запятую', A.authorPosition(AU, A.leaderVariants('Сидорофф, Sidorov')).pos, 'last');

// --- сопоставление названия
eq('название / точное', A.titleScore('Thermal conductivity of layered oxide ceramics', e1[0].query) >= 0.85, true);
eq('название / с ошибками распознавания', A.titleScore('Thermal conductivity of layered oxide ceramics', 'Ivanov Therma1 conductivity of 1ayered oxide ceramics 2023') >= 0.6, true);
eq('название / другая статья', A.titleScore('Magnetic ordering in frustrated spin chains', e1[0].query) < 0.6, true);

// --- одна публикация (0.7.9: факты и пометки, без «в счёт» и вариантов)
const opt = { leaderIds: [] };
const W = o => Object.assign({ via: 'search', score: 1, doi: '10.1/x', title: 'T', journal: 'Nature', issns: ['0028-0836'], year: 2023, type: 'journal-article', authors: AU }, o);
const E = o => Object.assign({ raw: '', num: 1, doi: null, years: [2023], declIF: null, query: 'q' }, o);
let p = A.judgePub(E(), W(), opt);
eq('публикация / найдена, издание и квартиль', [p.found, p.jv.qY, p.typeName], ['ok', 1, 'статья']);
p = A.judgePub(E(), W({ type: 'proceedings-article' }), opt); eq('публикация / доклад: тип назван, без вывода', [p.found, p.typeName], ['ok', 'доклад в трудах конференции']);
p = A.judgePub(E(), W({ score: 0.7 }), opt); eq('публикация / неполное совпадение: проверьте', p.found, 'check');
p = A.judgePub(E(), W({ score: 0.3 }), opt); eq('публикация / чужая статья: не найдено, ближайшая сохранена', [p.found, p.work, !!p.near], ['no', null, true]);
p = A.judgePub(E(), null, opt); eq('публикация / не найдено в базе: «не найдено»', p.found, 'no');
p = A.judgePub(E(), W({ score: 0.3, via: 'doi' }), opt); eq('публикация / найдено по DOI: название не сверяется', p.found, 'ok');
p = A.judgePub(E(), W({ score: 0.3, via: 'manual' }), opt); eq('публикация / выбрана вручную из вариантов: найдено, с пометкой', [p.found, p.notes.some(x => /вручную/.test(x))], ['ok', true]);
p = A.judgePub(E(), W({ doiMiss: '10.9/broken' }), opt); eq('публикация / DOI из списка не найден — пометка', p.notes.some(x => /10\.9\/broken/.test(x)), true);
p = A.judgePub(E({ years: [2018] }), W({ year: 2023 }), opt); eq('публикация / год в списке не совпадает: отмечено', p.yearDiff, true);
p = A.judgePub(E({ declIF: 12.5 }), W({ issns: ['2469-9950'], journal: 'Physical Review B' }), opt); eq('публикация / ИФ из списка заметно больше показателя SCImago — отмечено', p.ifDiff, true);
p = A.judgePub(E(), W({ issns: ['9999-9999'], journal: 'Вестник вымышленного университета' }), opt); eq('публикация / издания нет в справочниках: найдена, без квартиля', [p.found, !!p.j.sj, !!p.j.wl], ['ok', false, false]);
eq('публикация / нет полей старой проверки по КД', ['counts', 'v2', 'author', 'notesKD', 'qual', 'ifSt'].filter(k => k in A.judgePub(E(), W(), opt)), []);
eq('профиль / статья в Q4: квартиль показан, вывода нет', [A.judgeProfileWork({ issns: ['0033-2836'], journal: '' }).jv.qL, 'st' in A.judgeProfileWork({ issns: ['0033-2836'], journal: '' })], [4, false]);

// --- 0.7.9: DOI с ошибками распознавания и выбор лучшего варианта (ожидания записаны до прогона)
eq('DOI / буква O вместо нуля и пробел после «/»', A.findDoi('Title. 2023. doi: 1O.1016/ j.cej.2023.01.005.').doi, '10.1016/j.cej.2023.01.005');
eq('DOI / пробелы вокруг точки', A.findDoi('DOI 10. 1038/s41586-021-03819-2').doi, '10.1038/s41586-021-03819-2');
eq('DOI / ссылкой, скобка в конце отрезана', A.findDoi('(https://doi.org/10.1103/PhysRevB.54.11169)').doi, '10.1103/physrevb.54.11169');
eq('DOI / нет DOI — null', A.findDoi('Ivanov I. Title. 2023. Vol. 10, pp. 1016-1020'), null);
eq('DOI / запись со сломанным DOI разобрана, DOI не попал в текст запроса', [A.parseEntry('1. Ivanov I. Long enough title here. 2023. doi: 1O.1016/ j.cej.2023.01.005').doi, /1016/.test(A.parseEntry('1. Ivanov I. Long enough title here. 2023. doi: 1O.1016/ j.cej.2023.01.005').query)], ['10.1016/j.cej.2023.01.005', false]);
{ const en = A.parseEntry('Petrov P. Thermal conductivity of layered oxide ceramics. 2023. Journal of Applied Ceramics');
  const w1 = { title: 'Thermal conductivity of layered oxide ceramics', year: 2015, journal: 'Other Journal', authors: [{ family: 'Smith' }] }, w2 = { title: 'Thermal conductivity of layered oxide ceramics', year: 2023, journal: 'Journal of Applied Ceramics', authors: [{ family: 'Petrov' }] };
  eq('выбор варианта / одинаковые названия: выше тот, где совпали год, первый автор и издание', A.matchScore(w2, en).score > A.matchScore(w1, en).score, true);
  eq('выбор варианта / год далеко — ниже порога «найдена»', A.matchScore(w1, en).score < A.FOUND_OK, true);
  eq('выбор варианта / всё совпало — «найдена»', A.matchScore(w2, en).score >= A.FOUND_OK, true); }

// --- поиск автора по статьям из списка (ожидания записаны до прогона)
const OA = (...au) => ({ oaAuthors: au.map(x => ({ id: x[0], name: x[1], orcid: x[2] || '', corr: !!x[3] })) });
let dl = A.detectLeader([OA(['A1', 'Petr Petrov'], ['A2', 'Ivan Ivanov']), OA(['A2', 'Ivan Ivanov'], ['A1', 'Petr Petrov']), OA(['A9', 'P. Petrov'], ['A3', 'S. Sidorov'])], A.leaderVariants('Петров'));
eq('автор / по фамилии: оба профиля однофамильца-руководителя', [dl.how, dl.chosen.map(x => x.id).sort()], ['surname', ['A1', 'A9']]);
dl = A.detectLeader([OA(['A1', 'Petr Petrov'], ['A2', 'Ivan Ivanov']), OA(['A1', 'Petr Petrov'], ['A3', 'S. Sidorov']), OA(['A4', 'K. Kim'], ['A1', 'Petr Petrov'])], []);
eq('автор / фамилия не задана: общий автор всех статей', [dl.how, dl.surname, dl.chosen.map(x => x.id)], ['auto', 'Petrov', ['A1']]);
dl = A.detectLeader([OA(['A1', 'Petr Petrov'], ['A2', 'Ivan Ivanov']), OA(['A2', 'Ivan Ivanov'], ['A1', 'Petr Petrov'])], []);
eq('автор / фамилия не задана, два постоянных соавтора: не выбирать', [dl.how, dl.chosen.length], ['unclear', 0]);
dl = A.detectLeader([OA(['A1', 'Petr Petrov'])], []); eq('автор / одна статья: не выбирать', dl.how, 'unclear');
dl = A.detectLeader([null, {}], A.leaderVariants('Петров')); eq('автор / нет данных OpenAlex: пусто', [dl.works, dl.chosen.length], [0, 0]);
dl = A.detectLeader([OA(['A1', 'Petr Petrov']), OA(['A1', 'Petr Petrov']), OA(['A1', 'Petr Petrov']), OA(['A7', 'J. Smith']), OA(['A8', 'J. Doe'])], []);
eq('автор / общий автор в 3 из 5 статей: выбран', [dl.how, dl.chosen.map(x => x.id)], ['auto', ['A1']]);
{ const mkW = au => ({ via: 'doi', doi: '10.1/x', title: 'T', journal: 'Nature', issns: ['0028-0836'], year: 2023, type: 'journal-article', authors: [{ family: 'Ivanov' }, { family: 'Petrov' }], oaAuthors: au });
  const e0 = { raw: '', num: 1, doi: null, years: [2023], declIF: null, query: 'q' };
  const pc = A.judgePub(e0, mkW([{ id: 'A2', name: 'I. Ivanov', corr: false }, { id: 'A5', name: 'Pyotr Petroff-Vodkin', corr: true }]), { leaderIds: ['A5'] });
  eq('автор / corresponding из OpenAlex: кто отмечен', [pc.work.corr.known, pc.work.corr.names], [true, ['Pyotr Petroff-Vodkin']]);
  eq('автор / corresponding не размечен: «не указан», никто не подставлен', A.judgePub(e0, mkW([{ id: 'A2', name: 'I. Ivanov', corr: false }, { id: 'A5', name: 'P. Petrov', corr: false }]), {}).work.corr.known, false); }
{ const pw = A.judgeProfileWork({ issns: ['0028-0836'], journal: '', year: 2023, authors: [{ id: 'A1', corr: false }, { id: 'A5', corr: true }] }, ['A5']);
  eq('профиль / место автора и corresponding', [pw.first, pw.corr, pw.corrSt], [false, true, 'yes']);
  const pw2 = A.judgeProfileWork({ issns: ['2469-9950'], journal: '', year: 2023, authors: [{ id: 'A5', corr: false }] }, ['A5']); eq('профиль / первый автор', pw2.first, true); }

// --- сведения об авторе, введённые человеком (все значения вымышлены; 0000-0002-1825-0097 — учебный ORCID из документации)
const PA = A.parseAuthorInput;
eq('ввод автора / строка из п. 1.6: три значения узнаны по виду', PA('AAA-1234-2020/57000000000/0000-0002-1825-0097'), { orcid: '0000-0002-1825-0097', orcidBad: '', scopus: '57000000000', rid: 'AAA-1234-2020', spin: '', rinc: '', name: '' });
eq('ввод автора / другой порядок и пробелы', PA('0000-0002-1825-0097 / AAA-1234-2020 / 57000000000'), { orcid: '0000-0002-1825-0097', orcidBad: '', scopus: '57000000000', rid: 'AAA-1234-2020', spin: '', rinc: '', name: '' });
eq('ввод автора / только ФИО', PA('Соколова Анна Викторовна'), { orcid: '', orcidBad: '', scopus: '', rid: '', spin: '', rinc: '', name: 'Соколова Анна Викторовна' });
eq('ввод автора / ФИО и Scopus ID с подписью', PA('Sokolova A.V., Scopus ID: 57000000000'), { orcid: '', orcidBad: '', scopus: '57000000000', rid: '', spin: '', rinc: '', name: 'Sokolova A.V.' });
eq('ввод автора / ORCID ссылкой', PA('https://orcid.org/0000-0002-1825-0097').orcid, '0000-0002-1825-0097');
eq('ввод автора / ORCID с ошибкой в цифре не принимается за верный', [PA('0000-0002-1825-0098').orcid, PA('0000-0002-1825-0098').orcidBad], ['', '0000-0002-1825-0098']);
eq('ввод автора / длинное тире из Word', PA('0000–0002–1825–0097').orcid, '0000-0002-1825-0097');
eq('ввод автора / пусто', PA('  '), { orcid: '', orcidBad: '', scopus: '', rid: '', spin: '', rinc: '', name: '' });
eq('ввод автора / подписи граф не становятся именем', PA('WoS ResearcherID/Scopus ID/РИНЦ AuthorID: AAA-1234-2020/57000000000').name, '');
eq('ORCID / контрольная цифра X', A.orcidValid('0000-0002-1694-233X'), true);
{ const pk = A.judgePub({ raw: '', num: 1, doi: null, years: [2023], declIF: null, query: 'q' }, { via: 'doi', doi: '10.1/x', title: 'T', journal: 'Nature', issns: ['0028-0836'], year: 2023, type: 'proceedings-article', authors: [{ family: 'Smith' }] }, {});
  eq('без КД / в пометках нет требований КД и «руководителя»', pk.notes.some(x => /КД|руководител|заявк/.test(x)), false); }

// --- строки идентификаторов из настоящих заявок 12.10.2026 (значения вымышлены, вид сохранён)
eq('ввод автора / «ResearcherID/Scopus ID/SPIN» без подписей', PA('C-1234-2014/6700000001/1234-5678'), { orcid: '', orcidBad: '', scopus: '6700000001', rid: 'C-1234-2014', spin: '1234-5678', rinc: '', name: '' });
eq('ввод автора / «WoS …/ Scopus ID: …/в РИНЦ AuthorID: …»', PA('WoS IQR-1234-2023/ Scopus ID: 7800000001/в РИНЦ AuthorID: 123456'), { orcid: '', orcidBad: '', scopus: '7800000001', rid: 'IQR-1234-2023', spin: '', rinc: '123456', name: '' });
eq('ввод автора / подпись приклеена к ResearcherID, SPIN с подписью', PA('Scopus ID: 56200000000 Web of Science ResearcherIDF-1234-2016 SPIN-код автора:1234-5678'), { orcid: '', orcidBad: '', scopus: '56200000000', rid: 'F-1234-2016', spin: '1234-5678', rinc: '', name: '' });
eq('ввод автора / ФИО и ORCID вместе', PA('Соколова Анна Викторовна, 0000-0002-1825-0097'), { orcid: '0000-0002-1825-0097', orcidBad: '', scopus: '', rid: '', spin: '', rinc: '', name: 'Соколова Анна Викторовна' });
eq('ввод автора / ORCID не принимается за SPIN', PA('0000-0002-1825-0097').spin, '');
eq('ввод автора / фамилия с «ид» внутри не портится', PA('Davidova A.V.').name, 'Davidova A.V.');
// --- ФИО
const PF = A.parseFIO;
eq('ФИО / кириллица: фамилия, имя, отчество', [PF('Соколова Анна Викторовна').map(x => [x.sur, x.given, x.patr])], [[['Соколова', 'Анна', 'Викторовна']]]);
eq('ФИО / латиница с инициалами после фамилии', PF('Sokolova A.V.').map(x => [x.sur, x.ini]), [['Sokolova', 'A']]);
eq('ФИО / латиница с инициалами перед фамилией', PF('A.V. Sokolova').map(x => [x.sur, x.ini]), [['Sokolova', 'A']]);
eq('ФИО / «Имя И. Фамилия» (как в OpenAlex)', PF('Anna V. Sokolova').map(x => [x.sur, x.given, x.patr]), [['Sokolova', 'Anna', 'V']]);
eq('ФИО / кириллица с инициалами', PF('Соколова А.В.').map(x => [x.sur, x.ini]), [['Соколова', 'А']]);
eq('ФИО / латиница «Имя Фамилия»: оба порядка', PF('Anna Sokolova').map(x => x.sur), ['Sokolova', 'Anna']);
eq('ФИО / латиница «Фамилия Имя»: оба порядка', PF('Sokolova Anna').map(x => x.sur), ['Sokolova', 'Anna']);
const NM = (cand, fio) => PF(fio).some(f => A.nameMatch(cand, f));
[['Anna V. Sokolova', 'Соколова Анна Викторовна', true], ['A. Sokolova', 'Соколова Анна Викторовна', true], ['Anastasia Sokolova', 'Соколова Анна Викторовна', false],
 ['Anna Sokolov', 'Соколова Анна', false], ['Iurii Iurev', 'Юрьев Юрий', true], ['Yury Yuryev', 'Юрьев Юрий', true], ['Kseniya Shcherbakova', 'Щербакова Ксения', true],
 ['Ksenia Scherbakova', 'Щербакова Ксения', true], ['Mikhail Khokhlov', 'Хохлов Михаил', true], ['Mikhail Khokhlov', 'Khokhlov M.', true], ['Maria Khokhlova', 'Khokhlov M.', false],
 ['Anna Sokolova', 'Anna Sokolova', true], ['Sokolova Anna', 'Anna Sokolova', true], ['Анна Викторовна Соколова', 'Соколова Анна', true], ['Sergey Petrov', 'Соколова Анна', false],
].forEach(([c, f, w]) => eq(`ФИО / «${c}» — «${f}»`, NM(c, f), w));
eq('транслит / несколько написаний фамилии', A.translitVariants('Юрьев').slice(0, 4).every(Boolean) && A.translitVariants('Юрьев').indexOf('Yurev') >= 0 && A.translitVariants('Юрьев').indexOf('Iurev') >= 0, true);

// --- сеть на подставных ответах (вид ответов — по документации Crossref и OpenAlex)
(async () => {
  const N = A.NET; N.pause = 0; let calls = [];
  const res = (status, body) => ({ status, ok: status >= 200 && status < 300, json: async () => body });
  const crItem = (doi, title, o) => Object.assign({ DOI: doi, title: [title], 'container-title': ['Nature'], ISSN: ['0028-0836', '1476-4687'], issued: { 'date-parts': [[2023, 5, 1]] }, type: 'journal-article', author: [{ given: 'Petr', family: 'Petrov', sequence: 'first', ORCID: 'http://orcid.org/0000-0000-0000-0001' }, { given: 'Ivan', family: 'Ivanov', sequence: 'additional' }] }, o);
  N.fetch = async u => { calls.push(u); if (/works\/10/.test(u)) return res(200, { status: 'ok', message: crItem('10.1234/MC.2022.0155', 'Sorption of oil products by alginate gels') }); return res(200, { message: { items: [crItem('10.1/a', 'Something entirely different about magnets'), crItem('10.1/b', 'Thermal conductivity of layered oxide ceramics under cyclic load')] } }); };
  let w = await A.findWork(e1[1]); eq('сеть / по DOI', [w.via, w.doi, w.year, w.authors[0].family], ['doi', '10.1234/mc.2022.0155', 2023, 'Petrov']);
  w = await A.findWork(e1[0]); eq('сеть / поиск выбирает похожую статью, а не первую', [w.doi, w.score >= 0.85], ['10.1/b', true]);
  eq('сеть / в запрос уходит только текст записи', /query\.bibliographic=/.test(calls[1]) && !/mailto|orcid/.test(calls[1]), true);
  N.fetch = async () => res(200, { message: { items: [] } }); eq('сеть / пустой ответ — не найдено', await A.findWork(e1[0]), null);
  // 0.7.9: DOI из списка не найден — поиск по тексту; Crossref пуст — запасной поиск в OpenAlex; варианты (ожидания записаны до прогона)
  calls = []; N.fetch = async u => { calls.push(decodeURIComponent(u)); if (/works\/10/.test(u)) return res(404, {}); return res(200, { message: { items: [crItem('10.1234/mc.2022.0155', 'Sorption of oil products by alginate gels', { issued: { 'date-parts': [[2022]] } })] } }); };
  w = await A.findWork(e1[1]); eq('сеть / DOI из списка не найден (404) — найдено по тексту, DOI отмечен', [w.via, w.doi, w.doiMiss], ['search', '10.1234/mc.2022.0155', '10.1234/mc.2022.0155']);
  const oaHit = { id: 'https://openalex.org/W9', doi: 'https://doi.org/10.7/oa', title: 'Thermal conductivity of layered oxide ceramics under cyclic load', publication_year: 2023, type: 'article', primary_location: { source: { display_name: 'Journal of Applied Ceramics', issn: ['1234-5679'], type: 'journal' } }, authorships: [{ author: { id: 'https://openalex.org/A1', display_name: 'Ivan Ivanov' }, is_corresponding: true, institutions: [] }] };
  calls = []; N.useOA = true; N.fetch = async u => { calls.push(decodeURIComponent(u)); return /openalex/.test(u) ? res(200, { results: [oaHit] }) : res(200, { message: { items: [] } }); };
  w = await A.findWork(e1[0]); eq('сеть / Crossref не нашёл — запасной поиск в OpenAlex', [w && w.source, w && w.doi, w && w.corr.known, w && w.score >= A.FOUND_OK, calls.some(u => /api\.openalex\.org\/works\?search=/.test(u))], ['OpenAlex', '10.7/oa', true, true, true]);
  N.fetch = async u => /openalex/.test(u) ? res(200, { results: [] }) : res(200, { message: { items: [crItem('10.1/old', 'Thermal conductivity of layered oxide ceramics under cyclic load', { issued: { 'date-parts': [[2012]] }, author: [{ family: 'Smith' }] }), crItem('10.1/new', 'Thermal conductivity of layered oxide ceramics under cyclic load', { issued: { 'date-parts': [[2023]] }, author: [{ family: 'Ivanov' }] })] } });
  w = await A.findWork(e1[0]); eq('сеть / одинаковые названия: выбран вариант с годом и автором из записи, другой — в вариантах', [w.doi, w.alts.map(x => x.doi)], ['10.1/new', ['10.1/old']]);
  calls = []; N.fetch = async u => { calls.push(decodeURIComponent(u)); return /,topics/.test(u) ? res(400, {}) : res(200, { results: [{ id: 'https://openalex.org/A5', display_name: 'Anna Sokolova', works_count: 3 }] }); };
  let sa0 = await A.searchAuthors('Anna Sokolova'); eq('сеть / OpenAlex не принял поле topics — поиск автора без него', [sa0.length, calls.length], [1, 2]);
  N.fetch = async () => res(200, { results: [{ id: 'https://openalex.org/I77', display_name: 'Test University', international: { display_name: { ru: 'Тестовый университет', en: 'Test University' } } }] });
  eq('сеть / русские названия организаций одним запросом', await A.instRu(['I77', 'I77']), { I77: 'Тестовый университет' });
  N.fetch = async () => res(200, { results: [{ id: 'https://openalex.org/A5', display_name: 'Anna Sokolova', display_name_alternatives: ['Соколова Анна Викторовна'], topics: [{ display_name: 'Seaweed Polymers', subfield: { display_name: 'Biomaterials' } }, { display_name: 'Oil Spill Response', subfield: { display_name: 'Pollution' } }], last_known_institutions: [{ id: 'https://openalex.org/I77', display_name: 'Test University' }] }] });
  sa0 = await A.searchAuthors('Anna Sokolova'); eq('0.7.10 / у кандидата темы с разделом науки и организация с идентификатором', [sa0[0].topics, sa0[0].instIds, sa0[0].alt], [[{ name: 'Seaweed Polymers', sub: 'Biomaterials' }, { name: 'Oil Spill Response', sub: 'Pollution' }], ['I77'], ['Соколова Анна Викторовна']]);
  let n = 0; N.fetch = async () => (++n === 1 ? res(429, {}) : res(200, { message: { items: [crItem('10.1/b', 'Thermal conductivity of layered oxide ceramics under cyclic load')] } }));
  const t0 = Date.now(); w = await A.findWork(e1[0]); eq('сеть / после отказа 429 повтор', [w && w.doi, n, Date.now() - t0 >= 2000], ['10.1/b', 2, true]);
  N.fetch = async () => { throw new Error('Failed to fetch'); }; let er = null; try { await A.findWork(e1[0]); } catch (e) { er = e.kind; } eq('сеть / нет связи — ошибка, а не «не найдено»', er, 'net');
  // OpenAlex
  const oaW = { id: 'W1', type: 'review', authorships: [{ author_position: 'first', is_corresponding: false, author: { display_name: 'Ivan Ivanov' } }, { author_position: 'last', is_corresponding: true, author: { display_name: 'Petr P. Petrov' } }], primary_location: { source: { issn: ['0028-0836'] } } };
  N.useOA = true; N.fetch = async () => res(200, oaW); w = A.crWork(crItem('10.1/c', 'X'), 'doi'); await A.enrichOA(w, []);
  eq('сеть / OpenAlex: обзор и corresponding', [w.type, w.corr.known, w.corr.names], ['review', true, ['Petr P. Petrov']]);
  N.fetch = async () => res(200, Object.assign({}, oaW, { authorships: oaW.authorships.map(a => Object.assign({}, a, { is_corresponding: false })) })); w = A.crWork(crItem('10.1/c', 'X'), 'doi'); await A.enrichOA(w, A.leaderVariants('Петров'));
  eq('сеть / OpenAlex: corresponding не размечен — «нет данных», а не «не он»', w.corr.known, false);
  N.fetch = async () => res(401, {}); w = A.crWork(crItem('10.1/c', 'X'), 'doi'); await A.enrichOA(w, []); eq('сеть / OpenAlex требует ключ: отключается, проверка идёт дальше', [N.useOA, !!N.oaOff], [false, true]);
  // профиль автора
  N.useOA = true; let pg = 0; N.fetch = async u => { pg++; return res(200, pg === 1 ? { meta: { next_cursor: 'abc' }, results: [{ doi: 'https://doi.org/10.1/a', title: 'A', publication_year: 2023, type: 'article', primary_location: { source: { display_name: 'Nature', issn: ['0028-0836'], type: 'journal' } } }] } : { meta: { next_cursor: null }, results: [] }); };
  let aw = await A.authorWorks('0000-0002-1825-0097', 2021); eq('сеть / профиль по ORCID из OpenAlex', [aw.source, aw.works.length, aw.works[0].doi, aw.partial], ['OpenAlex', 1, '10.1/a', false]);
  N.fetch = async u => /openalex/.test(u) ? res(403, {}) : res(200, { message: { items: [crItem('10.1/z', 'Z')] } }); aw = await A.authorWorks('0000-0002-1825-0097', 2021);
  eq('сеть / профиль: OpenAlex недоступен — Crossref с пометкой «неполно»', [aw.source, aw.works.length, aw.partial], ['Crossref', 1, true]);
  // сайт Белого списка
  N.useWL = true; N.wlCache.clear(); N.fetch = async u => /record-sources\/0028-0836\/level/.test(u) ? res(200, { id: 1, title: ['NATURE'], issn: ['0028-0836'], level_2023: 1, level_2025: null, level_2026: null, state: null, datediscontinued: null }) : res(404, {});
  w = A.crWork(crItem('10.1/c', 'X'), 'doi'); await A.enrichWL(w); eq('сеть / сайт БС: уровень по ISSN', [w.wlLive.found, w.wlLive.levels[2023], w.wlLive.state], [true, 1, 0]);
  N.wlCache.clear(); N.fetch = async () => res(404, {}); w = A.crWork(crItem('10.1/c', 'X'), 'doi'); await A.enrichWL(w); eq('сеть / сайт БС: 404 — издания нет', w.wlLive.found, false);
  N.wlCache.clear(); N.fetch = async () => { throw new TypeError('Failed to fetch'); }; w = A.crWork(crItem('10.1/c', 'X'), 'doi'); await A.enrichWL(w); eq('сеть / сайт БС не отвечает: отключается, остаётся справочник', [N.useWL, w.wlLive], [false, undefined]);
  // показатель издания из OpenAlex
  N.useOA = true; N.srcCache.clear(); N.fetch = async u => /sources\//.test(u) ? res(200, { id: 'S1', summary_stats: { '2yr_mean_citedness': 17.5 } }) : res(200, { id: 'W1', type: 'article', authorships: [], primary_location: { source: { id: 'https://openalex.org/S1', issn: ['0028-0836'] } } });
  w = A.crWork(crItem('10.1/c', 'X'), 'doi'); await A.enrichOA(w, []); eq('сеть / OpenAlex: показатель издания', w.oaCpd, 17.5);
  // самопроверка: ответы правильные — всё верно; ответы чужие — расхождения видны
  const selfItem = c => crItem(c.doi, c.how === 'doi' ? 'T' : c.q.split('. ').slice(-3)[0], { ISSN: A.findJournal([], c.journal).sj.issns, 'container-title': [c.journal], issued: { 'date-parts': [[c.year]] }, author: [{ family: c.first }] });
  N.fetch = async u => { const d = decodeURIComponent(u); const c = A.SELF.find(c => c.how === 'doi' ? d.toLowerCase().includes('works/' + c.doi) : d.includes(c.q.slice(0, 40))); return /works\/10/.test(d) ? res(200, { message: selfItem(c) }) : res(200, { message: { items: [selfItem(c)] } }); };
  let sc = await A.runSelfCheck(); eq('самопроверка / верные ответы баз', sc.filter(r => r.ok).length, A.SELF.length);
  N.fetch = async u => /works\/10/.test(u) ? res(200, { message: crItem('10.9/wrong', 'Wrong', { issued: { 'date-parts': [[1990]] } }) }) : res(200, { message: { items: [] } });
  sc = await A.runSelfCheck(); eq('самопроверка / неверные ответы баз не проходят', sc.filter(r => r.ok).length, 0);
  // все публикации автора по профилям OpenAlex
  N.useOA = true; let urls = []; N.fetch = async u => { urls.push(decodeURIComponent(u)); return res(200, { meta: { next_cursor: null }, results: [{ doi: 'https://doi.org/10.1/A', title: 'A', publication_year: 2019, type: 'article', primary_location: { source: { display_name: 'Nature', issn: ['0028-0836'] } }, authorships: [{ author: { id: 'https://openalex.org/A1' }, is_corresponding: true }] }] }); };
  aw = await A.authorWorks({ ids: ['A1', 'A9'] }, 2021);
  eq('сеть / публикации по профилям: запрос по двум профилям, все годы', [/filter=author\.id:A1\|A9,type:article\|review/.test(urls[0]), /from_publication_date/.test(urls[0]), aw.works[0].year, aw.works[0].doi, aw.works[0].authors[0]], [true, false, 2019, '10.1/a', { id: 'A1', name: '', orcid: '', corr: true, inst: [], raw: [] }]);
  N.fetch = async () => res(200, { meta: { next_cursor: 'more' }, results: [{ doi: null, title: 'A', publication_year: 2020, type: 'article', primary_location: null, authorships: [] }] }); aw = await A.authorWorks({ ids: ['A1'] }, 2021);
  eq('сеть / публикации: больше 2000 — помечено, что список обрезан', [aw.capped, aw.works.length], [true, 10]);
  N.useOA = false; er = null; try { await A.authorWorks({ ids: ['A1'] }, 2021); } catch (e) { er = 'err'; } eq('сеть / OpenAlex выключен и ORCID нет: ошибка, а не пустой список', er, 'err'); N.useOA = true;
  N.fetch = async u => res(200, { results: [{ id: 'https://openalex.org/A77', display_name: 'Petr Petrov', orcid: 'https://orcid.org/0000-0002-1825-0097', works_count: 40, last_known_institutions: [{ display_name: 'Test University' }] }] });
  const sa = await A.searchAuthors('Петров П.П.'); eq('сеть / поиск автора по имени', [sa[0].id, sa[0].orcid, sa[0].inst, sa[0].works], ['A77', '0000-0002-1825-0097', 'Test University', 40]);
  // поиск автора по ORCID и Scopus ID
  const oaA = { id: 'https://openalex.org/A77', display_name: 'Anna Sokolova', orcid: 'https://orcid.org/0000-0002-1825-0097', works_count: 40, cited_by_count: 900, summary_stats: { h_index: 17 }, last_known_institutions: [{ display_name: 'Test University' }] };
  urls = []; N.fetch = async u => { urls.push(decodeURIComponent(u)); return res(200, oaA); }; let ao = await A.authorByOrcid('0000-0002-1825-0097');
  eq('сеть / автор по ORCID', [/authors\/https:\/\/orcid\.org\/0000-0002-1825-0097/.test(urls[0]), ao.id, ao.h, ao.works, ao.inst], [true, 'A77', 17, 40, 'Test University']);
  N.fetch = async () => res(404, {}); eq('сеть / ORCID нет в базе: «не найден», а не ошибка', await A.authorByOrcid('0000-0002-1825-0097'), null);
  urls = []; N.fetch = async u => { urls.push(decodeURIComponent(u)); return res(200, { results: [oaA] }); }; let as = await A.authorByScopus('57000000000');
  eq('сеть / автор по Scopus ID', [/filter=scopus:57000000000/.test(urls[0]), as.list[0].id, as.err], [true, 'A77', undefined]);
  N.useOA = true; N.fetch = async () => res(400, {}); as = await A.authorByScopus('57000000000'); eq('сеть / база не умеет искать по Scopus ID: сообщение, поиск идёт дальше', [as.list.length, !!as.err, N.useOA], [0, true, true]);
  // реестр ORCID
  urls = []; N.orcidOff = ''; N.useORCID = true; N.fetch = async u => { urls.push(decodeURIComponent(u)); return res(200, { 'expanded-result': [{ 'orcid-id': '0000-0002-1825-0097', 'given-names': 'Anna', 'family-names': 'Sokolova', 'institution-name': ['Test University'] }], 'num-found': 1 }); };
  let os = await A.orcidSearch('external-id-reference:"6700000001"');
  eq('сеть / реестр ORCID: поиск по внешнему идентификатору', [/pub\.orcid\.org\/v3\.0\/expanded-search\/\?q=external-id-reference:"6700000001"/.test(urls[0]), os.list[0].orcid, os.list[0].name, os.list[0].inst], [true, '0000-0002-1825-0097', 'Anna Sokolova', 'Test University']);
  N.fetch = async () => res(200, { 'expanded-result': null, 'num-found': 0 }); os = await A.orcidSearch('x'); eq('сеть / реестр ORCID: пусто', [os.list.length, os.err], [0, undefined]);
  N.fetch = async () => { throw new TypeError('Failed to fetch'); }; os = await A.orcidSearch('x'); eq('сеть / реестр ORCID не отвечает странице: сообщение, без падения', [os.list.length, !!os.err, N.useORCID], [0, true, false]); N.useORCID = true;
  N.fetch = async () => res(401, {}); os = await A.orcidSearch('x'); eq('сеть / реестр ORCID требует токен: сообщение об этом', /токен/.test(os.err || ''), true); N.useORCID = true;
  eq('ORCID / из ссылки', A.cleanOrcid('https://orcid.org/0000-0002-1825-0097'), '0000-0002-1825-0097'); eq('ORCID / мусор', A.cleanOrcid('Scopus ID 57200000000'), '');

  // ===== версия 0.7 (ожидания записаны до прогона) =====
  // фильтры: corresponding, показатель «от», организация; квартиль/БС — «или», остальное — «и»
  const PF = A.passFilter, F = o => Object.assign({ q: [], wl: [], yFrom: 0, yTo: 0, corr: [], ifFrom: 0, org: [] }, o);
  const R = o => Object.assign({ y: 2023, qY: 1, wl: 1, excl: false, corr: 'yes', cpd: 12, org: 'yes' }, o);
  eq('0.7 фильтр / Q1 или БС1 + corresponding + от 10: подходит', PF(R({}), F({ q: ['1'], wl: ['1'], corr: ['yes'], ifFrom: 10 })), true);
  eq('0.7 фильтр / автор не corresponding — не подходит', PF(R({ corr: 'no' }), F({ q: ['1'], wl: ['1'], corr: ['yes'], ifFrom: 10 })), false);
  eq('0.7 фильтр / показатель неизвестен при «от 10» — не подходит', PF(R({ cpd: null }), F({ ifFrom: 10 })), false);
  eq('0.7 фильтр / показатель 9,99 при «от 10» — не подходит', PF(R({ cpd: 9.99 }), F({ ifFrom: 10 })), false);
  eq('0.7 фильтр / показатель ровно 10 при «от 10» — подходит', PF(R({ cpd: 10 }), F({ ifFrom: 10 })), true);
  eq('0.7 фильтр / Q3, но БС 1 и corresponding не указан — подходит под «Q1 или БС1» и «не указан»', PF(R({ qY: 3, corr: 'unk' }), F({ q: ['1'], wl: ['1'], corr: ['unk'] })), true);
  eq('0.7 фильтр / ненайденная статья при фильтре corresponding — не подходит', PF({}, F({ corr: ['unk'] })), false);
  eq('0.7 фильтр / ненайденная статья без фильтров — показывается', PF({}, F({})), true);
  eq('0.7 фильтр / организация «проверьте» при «совпадает» — не подходит', PF(R({ org: 'check' }), F({ org: ['yes'] })), false);
  // corresponding по профилям автора
  eq('0.7 corresponding / отмечен автор', A.corrOf([{ id: 'A1', corr: true }, { id: 'A2' }], ['A1']), 'yes');
  eq('0.7 corresponding / отмечен другой', A.corrOf([{ id: 'A2', corr: true }, { id: 'A1' }], ['A1']), 'no');
  eq('0.7 corresponding / никто не отмечен', A.corrOf([{ id: 'A1' }, { id: 'A2' }], ['A1']), 'unk');
  eq('0.7 corresponding / нет данных об авторах', A.corrOf(null, ['A1']), null);
  { const r = A.judgeProfileWork({ year: 2023, issns: ['0028-0836'], journal: 'Nature', authors: [{ id: 'A2', name: 'B. Second', corr: true }, { id: 'A1', name: 'A. First', inst: [{ name: 'Test U' }] }] }, ['A1']);
    eq('0.7 corresponding / в публикациях автора: «нет» и кто', [r.corrSt, r.corrNames, A.instNames(r.me)], ['no', ['B. Second'], ['Test U']]); }
  eq('0.7 организация / нераспознанная — строка из статьи', A.instNames({ inst: [], raw: ['Lab 5, Test University, Moscow'] }), ['Lab 5, Test University, Moscow']);
  // организация: совпадает / проверьте / другая / не указана
  const OM = (n, a, b) => A.orgMatch(n, a).st === b;
  eq('0.7 организация / Новосибирский гос. университет = Novosibirsk State University', OM(['Novosibirsk State University'], 'Новосибирский государственный университет', 'yes'), true);
  eq('0.7 организация / НГУ и НГТУ — «проверьте», не «совпадает»', OM(['Novosibirsk State Technical University'], 'Новосибирский государственный университет', 'check'), true);
  eq('0.7 организация / Казанский федеральный = Kazan Federal University', OM(['Kazan Federal University'], 'Казанский федеральный университет', 'yes'), true);
  eq('0.7 организация / «Сириус» = Sirius University of Science and Technology', OM(['Sirius University of Science and Technology'], 'Научно-технологический университет «Сириус»', 'yes'), true);
  eq('0.7 организация / МГУ полным названием = Lomonosov Moscow State University', OM(['Lomonosov Moscow State University'], 'Московский государственный университет имени М.В. Ломоносова', 'yes'), true);
  eq('0.7 организация / сокращение МГУ — «проверьте», не «другая»', OM(['Lomonosov Moscow State University'], 'МГУ', 'check'), true);
  eq('0.7 организация / обе латиницей, общих слов нет — «другая»', OM(['Tomsk Polytechnic University'], 'Kazan Federal University', 'no'), true);
  eq('0.7 организация / разные языки, общих слов нет — «проверьте»', OM(['Tomsk Polytechnic University'], 'Казанский федеральный университет', 'check'), true);
  eq('0.7 организация / у автора две организации, одна совпадает — «совпадает»', OM(['Tomsk Polytechnic University', 'Kazan Federal University'], 'Kazan Federal University', 'yes'), true);
  eq('0.7 организация / в статье не указана', OM([], 'Kazan Federal University', 'unk'), true);
  // дубли
  const PB = (q, w, doi) => ({ entry: { query: q, doi: doi || null }, work: w });
  const WK = (doi, title, type, journal) => ({ doi, title, type: type || 'journal-article', journal: journal || 'Nature' });
  const dd = A.findDuplicates([
    PB('a', WK('10.1/x', 'Alginate sorbents for oil spill response in cold seawater')),
    PB('b', WK('10.1/x', 'Alginate sorbents for oil spill response in cold seawater')),
    PB('c', WK('10.1/y', 'Thermal transport in layered oxide ceramics under cyclic load')),
    PB('d', WK('10.1/z', 'Thermal transport in layered oxide ceramics under cyclic load')),
    PB('e', WK('10.48550/arxiv.2301.00001', 'Biodegradation kinetics of brown algae polymers', 'posted-content', 'arXiv')),
    PB('f', WK('10.1/w', 'Biodegradation kinetics of brown algae polymers in seawater')),
    PB('g', WK('10.1/p', 'Field trials of floating sorbent booms', 'proceedings-article', 'Proceedings of the Coastal Engineering Conference')),
    PB('h', WK('10.1/q', 'Field trials of floating sorbent booms in the Barents Sea')),
    PB('i', WK('10.1/r', 'Alginate sorbents for oil spill response in warm freshwater')),
    PB('Sokolova A.V. Imaginary paper that no database knows about. Journal of Nonexistent Results 2025', null),
    PB('Sokolova A.V. Imaginary paper that no database knows about. Journal of Nonexistent Results, 2025', null),
  ]).map(d => [d.a, d.b, d.why]);
  eq('0.7 дубли / одинаковый DOI', dd.some(d => d[0] === 0 && d[1] === 1 && /DOI/.test(d[2])), true);
  eq('0.7 дубли / одинаковое название при разных DOI', dd.some(d => d[0] === 2 && d[1] === 3 && /название/.test(d[2])), true);
  eq('0.7 дубли / препринт и журнальная версия', dd.some(d => d[0] === 4 && d[1] === 5 && /препринт/.test(d[2])), true);
  eq('0.7 дубли / доклад и статья', dd.some(d => d[0] === 6 && d[1] === 7 && /доклад/.test(d[2])), true);
  eq('0.7 дубли / похожие, но разные статьи — не дубль', dd.some(d => d[0] === 8 || d[1] === 8), false);
  eq('0.7 дубли / две ненайденные почти одинаковые записи', dd.some(d => d[0] === 9 && d[1] === 10), true);
  eq('0.7 дубли / всего пар', dd.length, 5);
  // OpenAlex: организации автора в статье, Scopus ID в профиле автора
  const sh = A.oaShip({ author: { id: 'https://openalex.org/A1', display_name: 'Anna Sokolova' }, is_corresponding: true, institutions: [{ id: 'https://openalex.org/I1', display_name: 'Test University', ror: 'https://ror.org/0abc', country_code: 'RU' }], raw_affiliation_strings: ['Lab 5, Test University'] });
  eq('0.7 сеть / организации автора в статье', [sh.id, sh.corr, sh.inst[0].name, sh.inst[0].id, sh.raw[0]], ['A1', true, 'Test University', 'I1', 'Lab 5, Test University']);
  N.useOA = true; N.fetch = async () => res(200, Object.assign({}, oaA, { ids: { openalex: 'https://openalex.org/A77', scopus: 'http://www.scopus.com/inward/authorDetails.url?authorID=57000000000&partnerID=MN8TOARS' } }));
  ao = await A.authorByOrcid('0000-0002-1825-0097'); eq('0.7 сеть / Scopus ID из профиля OpenAlex', ao.scopus, '57000000000');
  // реестр ORCID: идентификаторы записи
  urls = []; N.useORCID = true; N.fetch = async u => { urls.push(decodeURIComponent(u)); return res(200, { 'external-identifier': [{ 'external-id-type': 'Scopus Author ID', 'external-id-value': '57000000000', 'external-id-url': { value: 'http://www.scopus.com/inward/authorDetails.url?authorID=57000000000' } }, { 'external-id-type': 'ResearcherID', 'external-id-value': 'F-1234-2016', 'external-id-url': null }] }); };
  let ox = await A.orcidExternalIds('0000-0002-1825-0097');
  eq('0.7 сеть / идентификаторы записи ORCID', [/pub\.orcid\.org\/v3\.0\/0000-0002-1825-0097\/external-identifiers/.test(urls[0]), ox.list.map(x => x.type + '=' + x.value).join(';'), ox.err], [true, 'Scopus Author ID=57000000000;ResearcherID=F-1234-2016', undefined]);
  N.fetch = async () => res(401, {}); ox = await A.orcidExternalIds('0000-0002-1825-0097'); eq('0.7 сеть / запись ORCID требует токен — сообщение', [ox.list.length, /токен/.test(ox.err || '')], [0, true]);
  N.fetch = async () => { throw new TypeError('Failed to fetch'); }; ox = await A.orcidExternalIds('0000-0002-1825-0097'); eq('0.7 сеть / реестр не отвечает — сообщение, без падения', [ox.list.length, !!ox.err], [0, true]); N.useORCID = true;

  // ===== 0.7.4: ограничение времени запросов (ожидания записаны до прогона) =====
  { const hang = () => new Promise(() => { });
    N.fetch = hang; let t = Date.now(), er = null; try { await A.tfetch('https://x', {}, 300); } catch (e) { er = e; }
    eq('0.7.4 / зависший сервер: запрос обрывается по времени', [!!(er && er.timeout), /нет ответа за 0 с|нет ответа/.test(er && er.message), Date.now() - t < 1500], [true, true, true]);
    t = Date.now(); er = null; try { await A.getJson('https://x', 1, 300); } catch (e) { er = e; }
    eq('0.7.4 / getJson: зависание — ошибка «нет ответа», вид net', [er && er.kind, /нет ответа/.test(er && er.message), Date.now() - t < 1500], ['net', true, true]);
    N.useORCID = true; N.orcidOff = ''; t = Date.now(); let o = await A.orcidSearch('x', 300);
    eq('0.7.4 / реестр ORCID завис: сообщение, без зависания', [o.list.length, /нет ответа/.test(o.err || ''), Date.now() - t < 1500], [0, true, true]); N.useORCID = true; N.orcidOff = '';
    // проверка связи: Белый список висит, остальные отвечают — итог не дольше PING_MS + 2 с, порядок прежний
    N.fetch = async u => /journalrank|rcsi/.test(u) ? hang() : (/orcid/.test(u) ? res(200, { 'expanded-result': [{ 'orcid-id': '0000-0002-1825-0097' }] }) : (/openalex/.test(u) ? res(200, { results: [] }) : res(200, { message: { items: [] } })));
    const seen = []; t = Date.now(); const pr = await A.pingAll((i, r) => seen.push(i)); const dt = Date.now() - t;
    eq('0.7.4 / проверка связи: базы опрашиваются одновременно, зависшая не держит остальных', [pr.map(r => r.ok).join(), seen.indexOf(1) === 3, dt < A.PING_MS + 2000, dt >= A.PING_MS - 200], ['true,false,true,true', true, true, true]); }
  /* ===== 0.8: правки 2–6. Всё вымышлено, кроме названий и ISSN настоящих изданий (Nature, Physical Review B, Журнал технической физики). Ожидания записаны до прогона. ===== */
  {
    // --- правка 3: справочник Scopus (вымышленные строки в том виде, как их собирает mkdata_scopus.py; Nature — настоящий ISSN)
    DATA.sc = { date: 'Sep 2026', rows: [
      ['Nature', '00280836 14764687', 21206, 1, '1869-ongoing'],
      ['Vymyshlennyi Zhurnal Fiziki', '12345679 2345678X', 99000001, 1, '2026; 2019-2024'],
      ['Journal of Fictional Results', '34567890', 99000002, 0, '2015-2020', 1, 2020, '12', '4', 'Discontinuation'],
      ['Novyi Vymyshlennyi Vestnik', '56789012', null, 2, '', 0, null, '', '', '', '01.08.2026']] };
    A.loadRef(DATA);
    eq('0.8 Scopus / годы индексации разбираются', A.parseCoverage('2026; 2019-2024'), [[2019, 2024], [2026, 2026]]);
    eq('0.8 Scopus / «ongoing» — по сей день', A.parseCoverage('2010-ongoing'), [[2010, 9999]]);
    const sc1 = A.findSc(['2345-678X'])[0];
    eq('0.8 Scopus / по EISSN найден, год внутри годов индексации — без пометок', [sc1 && sc1.id, A.scAt(sc1, 2022).inCov, A.scAt(sc1, 2022).notes.length], [99000001, true, 0]);
    eq('0.8 Scopus / год вне годов индексации — «проверьте: не индексировался»', (a => [a.inCov, /не индексировался/.test(a.notes[0] || '')])(A.scAt(sc1, 2025)), [false, true]);
    const sc2 = A.findSc(['3456-7890'])[0];
    eq('0.8 Scopus / исключён: статья позже последнего номера — «проверьте»', (a => [a.afterDisc, /после последнего номера/.test(a.notes.join()), /2020, том 12, выпуск 4/.test(a.notes.join())])(A.scAt(sc2, 2022)), [true, true, true]);
    eq('0.8 Scopus / принят, ещё не загружен', (a => /принят в Scopus 01\.08\.2026/.test(a.notes[0] || ''))(A.scAt(A.findSc(['5678-9012'])[0], 2026)), true);
    { const r = A.judgePub(A.parseEntry('1. Ivanov I.I. Fictional paper on sorbents in cold water. Vymyshlennyi Zhurnal Fiziki. 2025.'), { doi: '10.5555/f1', title: 'Fictional paper on sorbents in cold water', journal: 'Vymyshlennyi Zhurnal Fiziki', issns: ['12345679'], year: 2025, type: 'journal-article', via: 'doi', score: 1 }, {});
      eq('0.8 Scopus / в строке списка: нет в SCImago, но есть в Scopus; год вне индексации', [!!r.jv.sc, r.notes.some(n => /в Scopus есть, квартиля SCImago нет/.test(n)), r.notes.some(n => /не индексировался/.test(n))], [true, true, true]); }
    // --- правка 6: заявленный квартиль и импакт-фактор
    { const e = A.parseEntry('1. Ivanov I.I. Title of a fictional paper about things. Fictional Journal. 2023. Квартиль: Q1. 5,2');
      eq('0.8 / квартиль и импакт-фактор из записи — отдельно, в запрос не идут', [e.declQ, e.declIF, /Q1|Квартиль/.test(e.query)], [1, 5.2, false]); }
    eq('0.8 / «Q2» внутри DOI или слова — не квартиль', [A.parseEntry('1. Ivanov I.I. Fictional paper. Journal. 2023. DOI: 10.5555/Q2.2023.1').declQ, A.parseEntry('1. Ivanov I.I. Fictional HQ2 paper title here. Journal. 2023.').declQ], [undefined, undefined]);
    // --- правка 5: режим «Журнал»
    { const r = A.findJournalQuery('0028-0836'); eq('0.8 журнал / по ISSN — Nature сразу, Q1, есть и в Scopus, и в Белом списке', [r.sure && r.sure.e.title, r.sure && A.journalFacts(r.sure.e).q, !!(r.sure && r.sure.e.sc), !!(r.sure && r.sure.e.wl)], ['Nature', 1, true, true]); }
    { const r = A.findJournalQuery('Nature'); eq('0.8 журнал / по точному названию — выбран сам', r.sure && r.sure.e.issns.indexOf('00280836') >= 0, true); }
    { const r = A.findJournalQuery('Physical Reviw B'); eq('0.8 журнал / название с опечаткой — Physical Review B', r.sure && r.sure.e.sj && r.sure.e.sj.title, 'Physical Review B'); }
    { const r = A.findJournalQuery('Physical Review'); eq('0.8 журнал / несколько похожих (Physical Review A, B, …) — выбор за человеком', [r.sure, r.hits.filter(h => /^Physical Review [A-E]$/.test(h.e.title)).length >= 2], [null, true]); }
    { const r = A.findJournalQuery('Журнал вымышленных результатов несуществующих наук'); eq('0.8 журнал / нет в справочниках — пусто', [r.hits.length, r.sure], [0, null]); }
    { const w = DATA.wl.find(x => !x[1].split(' ').some(i => (DATA.sj.some(s => s[1].split(' ').indexOf(i) >= 0)))); const r = A.findJournalQuery(w[1].split(' ')[0]);
      eq('0.8 журнал / есть в Белом списке, нет в SCImago', [!!(r.sure && r.sure.e.wl), !!(r.sure && r.sure.e.sj)], [true, false]); }
    { const r = A.findJournalQuery('Vymyshlennyi Zhurnal Fiziki'); const f = r.sure && A.journalFacts(r.sure.e, 2025);
      eq('0.8 журнал / есть в Scopus, нет в SCImago: «в Scopus есть, квартиля SCImago нет», год вне индексации', [!!f, f && f.notes.some(n => /в Scopus есть, квартиля SCImago нет/.test(n)), f && f.notes.some(n => /не индексировался/.test(n)), f && f.scId], [true, true, true, 99000001]); }
    { const r = A.findJournalQuery('Журнал технической физики'); eq('0.8 журнал / русское название из Белого списка', !!(r.sure && r.sure.e.wl), true); }
    { const r = A.findJournalQuery('0028-0836'); const f = A.journalFacts(r.sure.e, 2023); eq('0.8 журнал / год указан — квартиль на этот год', [f.qYear, f.q], [2023, 1]); }
    { const r = A.findJournalQuery('Nature 1234-5679'); eq('0.8 журнал / ISSN другого издания, а название Nature — «проверьте»', r.notes.some(n => /название в запросе другое/.test(n)), true); }
    // --- правка 2: идентификаторы автора из OpenAlex и ORCID
    const ci = (info, orc) => A.collectAuthorIds({}, info, orc);
    eq('0.8 ids / Scopus ID только в OpenAlex', (r => [r.ids.filter(x => x.b === 'scopus').map(x => x.v + ':' + x.src.join('+')), r.warns.length])(ci([{ id: 'A1', scopus: '57000000001' }], [])), [['57000000001:из OpenAlex'], 0]);
    eq('0.8 ids / Scopus ID только в ORCID', (r => r.ids.filter(x => x.b === 'scopus').map(x => x.v + ':' + x.src.join('+')))(ci([{ id: 'A1' }], [{ type: 'Scopus Author ID', value: '57000000001' }])), ['57000000001:из ORCID']);
    eq('0.8 ids / в обоих совпадает — один идентификатор, два источника', (r => [r.ids.filter(x => x.b === 'scopus').map(x => x.src.join('+')), r.warns.length])(ci([{ id: 'A1', scopus: '57000000001' }], [{ type: 'Scopus Author ID', value: '57000000001' }])), [['из OpenAlex+из ORCID'], 0]);
    eq('0.8 ids / в обоих расходится — оба и «проверьте»', (r => [r.ids.filter(x => x.b === 'scopus').length, /различаются/.test(r.warns[0] || '')])(ci([{ id: 'A1', scopus: '57000000001' }], [{ type: 'Scopus Author ID', value: '57000000002' }])), [2, true]);
    eq('0.8 ids / нигде нет — Scopus ID нет', ci([{ id: 'A1' }], []).ids.filter(x => x.b === 'scopus').length, 0);
    eq('0.8 ids / РИНЦ по ссылке профиля в ORCID, SPIN по типу, ResearcherID по ссылке Publons', [A.idFromOrcidItem({ type: 'url:eLibrary', value: 'https://www.elibrary.ru/author_profile.asp?id=1&authorid=654321' }), A.idFromOrcidItem({ type: 'SPIN-код', value: '12345678' }), A.idFromOrcidItem({ type: 'Other', value: 'x', url: 'https://publons.com/researcher/AAB-1234-2019/' })], [{ b: 'rinc', v: '654321' }, { b: 'spin', v: '1234-5678' }, { b: 'rid', v: 'AAB-1234-2019' }]);
    // --- правка 4: индекс Хирша со страницы профиля
    const F = A.parseFIO('Иванов Иван');
    const ELIB = 'Иванов Иван Иванович\nВымышленный университет\nSPIN-код: 1234-5678, AuthorID: 765432\nЧисло публикаций на elibrary.ru\t120\nЧисло цитирований из публикаций на elibrary.ru\t900\nИндекс Хирша по всем публикациям на elibrary.ru\t18\nИндекс Хирша по публикациям в РИНЦ\t15\nИндекс Хирша по ядру РИНЦ\t6\n';
    eq('0.8 Хирш / eLibrary: «по публикациям в РИНЦ» — основное, остальные рядом, AuthorID, фамилия на месте', (h => [h.base, h.val, h.label, h.alts.map(a => a.v).sort((a, b) => a - b), h.id, h.nameOk])(A.parseHirschPage(ELIB, null, F)), ['rinc', 15, 'по публикациям в РИНЦ', [6, 18], '765432', true]);
    const SCOP = 'Ivanov, Ivan I.\nVymyshlennyi University, Moscow\nAuthor ID: 57000000001\n1,234\nCitations by 1,100 documents\n56\nDocuments\n12\nh-index\nView h-graph';
    eq('0.8 Хирш / Scopus: число над подписью, Author ID', (h => [h.base, h.val, h.id, h.nameOk])(A.parseHirschPage(SCOP, null, F)), ['scopus', 12, '57000000001', true]);
    eq('0.8 Хирш / Web of Science: «H-Index: 9», ResearcherID', (h => [h.base, h.val, h.id])(A.parseHirschPage('Ivanov, Ivan\nWeb of Science ResearcherID: AAA-1234-2020\nH-Index: 9\nPublications 40')), ['wos', 9, 'AAA-1234-2020']);
    eq('0.8 Хирш / Google Scholar: за всё время, за 5 лет — рядом', (h => [h.base, h.val, h.alts.map(a => a.v)])(A.parseHirschPage('Ivan Ivanov\nGoogle Scholar\nAll Since 2021\nCitations 2500 1200\nh-index 25 18\ni10-index 40 30')), ['gs', 25, [18]]);
    eq('0.8 Хирш / два разных числа у «h-index» — не выбирает, «проверьте»', (h => [h.val, h.cands, /несколько/.test(h.err)])(A.parseHirschPage('Scopus\nh-index 12\nh-index 14')), [null, [12, 14], true]);
    eq('0.8 Хирш / вставленная страница без Хирша — «не найден на странице»', (h => [h.val, /не найден/.test(h.err)])(A.parseHirschPage('Scopus author profile\nAuthor ID: 57000000001\nDocuments 56')), [null, true]);
    eq('0.8 Хирш / на странице другая фамилия — «проверьте, тот ли профиль»', A.parseHirschPage(SCOP, null, A.parseFIO('Петров Пётр')).nameOk, false);
    eq('0.8 Хирш / база не узнана — просит выбрать', /с какой базы/.test(A.parseHirschPage('some text h-index 5').err), true);
    const hs1 = A.hirschSummary([{ h: 10, id: 'A1' }], [A.parseHirschPage(ELIB, null, F)]);
    eq('0.8 Хирш / OpenAlex 10 и РИНЦ 15 — наибольший РИНЦ, OpenAlex рядом', [hs1.best.base, hs1.best.v, hs1.perBase.openalex.v, hs1.warns.length], ['rinc', 15, 10, 0]);
    eq('0.8 Хирш / OpenAlex 20 больше РИНЦ 15 — наибольший OpenAlex', (s => [s.best.base, s.best.v])(A.hirschSummary([{ h: 20, id: 'A1' }], [A.parseHirschPage(ELIB, null, F)])), ['openalex', 20]);
    eq('0.8 Хирш / только OpenAlex', (s => [s.best.base, s.vals.length])(A.hirschSummary([{ h: 7, id: 'A1' }], [])), ['openalex', 1]);
    { const s = A.hirschSummary([{ h: 7, id: 'A1' }], [{ base: 'scopus', val: 12, id: '57000000001' }, { base: 'scopus', val: 14, id: '57000000002' }]);
      eq('0.8 Хирш / два профиля Scopus с разным Хиршем — наибольший 14, «несколько профилей — проверьте»', [s.best.base, s.best.v, s.best.id, /несколько профилей/.test(s.warns.join())], ['scopus', 14, '57000000002', true]); }
    // --- правка 6: публикации в документе
    { const pages = [
        ['Вымышленный институт — отчёт', 'Раздел 1. Введение', 'Текст про что-то 2023 года без публикаций.', '1'],
        ['Вымышленный институт — отчёт', 'Ещё текст отчёта.', '2'],
        ['Вымышленный институт — отчёт', 'Список публикаций', '1. Sokolova A.V., Orlov D.K. Alginate sorbents for oil spill response in cold seawater // Nature. 2023. Vol. 615. P. 100-110. DOI: 10.5555/t0', '2. Orlov D.K., Sokolova A.V. Thermal transport in layered oxide ceramics under', '3'],
        ['Вымышленный институт — отчёт', 'cyclic load // Physical Review B. 2022. Vol. 105. P. 12345.', '3. Соколова А.В. Модель переноса тепла в пористых сорбентах // Журнал технической физики. 2024. Т. 94, № 3. С. 210–218.', 'Подпись ______ Соколова А.В.', '4']];
      const r = A.findDocRecords(pages);
      eq('0.8 документ / список в конце: 3 записи, раздел найден, колонтитулы и подпись отброшены, запись через перенос страницы склеена',
        [r.records.length, r.heading, r.pages, r.records.some(x => /Вымышленный институт|Подпись/.test(x.text)), /under cyclic load/.test((r.records[1] || {}).text || ''), (r.records[1] || {}).page], [3, 'Список публикаций', [3, 4], false, true, 3]); }
    { const C = (a) => ({ cells: a.map(([t, x]) => ({ t, x })) });
      const pages = [['Прочее 2021 года.', '2.3. Наиболее значимые научные публикации',
        C([['№', 50], ['Авторы', 120], ['Название', 260], ['Год', 400], ['Издание', 460], ['Импакт-фактор', 560], ['Квартиль', 640]]),
        C([['1.', 50], ['Sokolova A.V., Orlov D.K.', 120], ['Alginate sorbents for oil spill', 260], ['2023', 400], ['Nature', 460], ['64,8', 560], ['Q1', 640]]),
        C([['Lebedev M.N.', 122], ['response in cold seawater', 262]]),
        C([['2.', 50], ['Orlov D.K.', 120], ['Thermal transport in layered ceramics', 260], ['2022', 400], ['Physical Review B', 460], ['3,9', 560], ['Q1', 640]]),
        '2.4. Монографии', '1. Sokolova A.V. Fictional monograph on sorbents. Moscow: Nauka, 2020. 300 p.']];
      const r = A.findDocRecords(pages), e1 = r.records[0] ? A.parseEntry(r.records[0].text) : {};
      eq('0.8 документ / таблица публикаций: 2 строки, перенос внутри ячейки склеен, монография из другого раздела не попала', [r.records.length, /oil spill response in cold seawater/.test((r.records[0] || {}).text || ''), r.records.some(x => /monograph/.test(x.text))], [2, true, false]);
      eq('0.8 документ / из таблицы — квартиль и импакт-фактор, указанные в документе', [e1.declQ, e1.declIF, e1.num], [1, 64.8, 1]); }
    { const R = a => ({ cells: a.map((t, x) => ({ t, x })), row: true });
      const r = A.findDocRecords([[R(['Авторы', 'Название', 'Год', 'Журнал']), R(['Ivanov I.I.', 'Fictional study of sorbents', '2019', 'Journal of Fictional Results']), R(['Petrov P.P.', 'Another fictional study', '2021', 'Fictional Materials Letters'])]]);
      eq('0.8 документ / таблица Word без столбца номеров — каждая строка таблицы отдельная запись, номера проставлены', [r.records.length, (r.records[1] || {}).text && r.records[1].text.slice(0, 3)], [2, '2. ']); }
    // таблица из PDF с координатами: ячейки выровнены по верху (как в Word), перенос внутри ячеек; номер «11.» внутри записи — не новая запись
    { const Lg = (y, cells) => ({ y, h: 10, cells: cells.map(([t, x]) => ({ t, x, w: t.length * 5 })) });
      const r = A.findDocRecords([[ 'Наиболее значимые публикации', Lg(700, [['№', 40], ['Авторы', 70], ['Название', 220], ['Год', 420], ['Журнал', 460]]),
        Lg(680, [['1.', 40], ['Ivanov I.I.,', 70], ['Fictional sorbents for', 220], ['2021', 420], ['Fictional', 460]]), Lg(668, [['Petrov P.P.', 70], ['cold seawater', 220], ['Materials Letters', 460]]),
        Lg(650, [['2.', 40], ['Smirnov A.A.', 70], ['Fictional ceramics', 220], ['2022', 420], ['Physical Review B', 460]]), '2.4. Монографии', '1. Ivanov I.I. Fictional monograph. Moscow, 2020. 200 p.']]);
      eq('0.8 документ / таблица PDF по верху: продолжения строк — к своей записи', [r.records.length, (r.records[0] || {}).text, /monograph/.test(r.records.map(x => x.text).join())], [2, '1. Ivanov I.I., Petrov P.P.. Fictional sorbents for cold seawater. 2021. Fictional Materials Letters'.replace('..', '.'), false]); }
    { const r = A.findDocRecords([['Список публикаций', '1. Ivanov I.I. Fictional paper one // Fictional Journal. 2021. Vol.', '11. P. 1-10.', '2. Petrov P.P. Fictional paper two // Fictional Journal. 2022. Vol. 3. P. 5-9.']]);
      eq('0.8 документ / «11. P. 1-10.» в начале строки — продолжение записи 1, а не запись 11', [r.records.length, /Vol\. 11\. P\. 1-10/.test((r.records[0] || {}).text || '')], [2, true]); }
    eq('0.8 документ / без публикаций — ничего не найдено', A.findDocRecords([['Отчёт о командировке', 'Поездка прошла в 2024 году успешно.']]).records.length, 0);
    { const r = A.findDocRecords([['References', 'Ivanov I.I., Petrov P.P. Fictional study of sorbents. Journal of Fictional Results. 2019. Vol. 3. P. 1-10.', 'Smirnov A.A. Another fictional study of things in', 'cold water. Fictional Materials Letters. 2021. Vol. 5. P. 20-30.']]);
      eq('0.8 документ / список без номеров: записи по фамилии в начале строки, перенос склеен', [r.records.length, /things in cold water/.test((r.records[1] || {}).text || '')], [2, true]); }
  }
  console.log(`Пройдено ${pass} из ${pass + fail}`); fails.forEach(f => console.log('  НЕ ПРОЙДЕНО — ' + f)); process.exit(fail ? 1 : 0);
})();
