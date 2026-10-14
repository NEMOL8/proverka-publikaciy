// Контрольные кейсы правил. Ожидания записаны до прогона: по тексту КД и по общеизвестным сведениям об изданиях.
// Запуск: node evals/run.js
const fs = require('fs'), path = require('path'); const B = path.join(__dirname, '..');
const src = fs.readFileSync(B + '/src/core.js', 'utf8').replace(/if \(typeof module[^\n]*\n?$/m, '') + fs.readFileSync(B + '/src/net.js', 'utf8').replace(/if \(typeof module[^\n]*\n?$/m, '');
const A = new Function(src + '\nreturn {getJson,tfetch,PING_MS,corrOf,orgMatch,findDuplicates,instNames,oaShip,orcidExternalIds,KD,ST,loadRef,findJournal,splitEntries,parseEntry,titleScore,canonName,leaderVariants,sameSurname,authorPosition,journalVerdict,judgePub,judgeVariants,judgeProfileWork,detectLeader,parseAuthorInput,orcidValid,wlAt,passFilter,parseFIO,nameMatch,translitVariants,NET,crWork,findWork,enrichOA,enrichWL,authorInfo,searchAuthors,authorByOrcid,authorByScopus,orcidSearch,runSelfCheck,SELF,authorWorks,cleanOrcid,pingAll};')();
const DATA = JSON.parse(fs.readFileSync(B + '/data/ref.json', 'utf8'));
// вымышленные издания для кейсов «квартиль по годам» (годы справочника: 2021–2025)
const fake = (t, issn, h) => DATA.sj.push([t, issn, 0, '', 900000 + DATA.sj.length, ...h]);
fake('Test A', '99900001', [2, 5, 2, 5, 3, 5, 3, 5, 3, 5]);            // Q2 → Q3
fake('Test B', '99900002', [3, 5, 3, 5, 2, 5, 1, 5, 1, 5]);            // Q3 → Q1
fake('Test C', '99900003', [1, 5, 1, 5, null, null, null, null, null, null]); // есть только в 2021–2022
fake('Test D', '99900004', [1, 14, 1, 12, 1, 9, 1, 7, 1, 6]);          // показатель упал ниже порога
fake('Test E', '99900005', [4, 1, 4, 1, 4, 1, 4, 1, 4, 1]);            // всегда Q4
A.loadRef(DATA);
const { ST } = A; let pass = 0, fail = 0; const fails = [];
const eq = (name, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want); ok ? pass++ : (fail++, fails.push(`${name}: получено ${JSON.stringify(got)}, ожидалось ${JSON.stringify(want)}`)); };
const jv = (issn, title) => A.journalVerdict(A.findJournal(issn ? [issn] : [], title));

// --- издания: [название кейса, ISSN, название, ожидаемый Q1–Q2/БС1, ожидаемый показатель ≥10]
[['Nature', '0028-0836', 'Nature', 'ok', 'ok'],
 ['Physical Review B: Q1, показатель низкий', '2469-9950', 'Physical Review B', 'ok', 'no'],
 ['Advanced Materials', '0935-9648', 'Advanced Materials', 'ok', 'ok'],
 ['Nano Letters: показатель около порога', '1530-6984', 'Nano Letters', 'ok', 'check'],
 ['Журнал Q4', '0033-2836', 'Psychoanalytic Review', 'no', 'no'],
 ['ЖТФ: уровень Белого списка менялся 2→1', '0044-4642', 'Журнал технической физики', 'check', 'unk'],
 ['Исключён из Белого списка, но Q1 SCImago', '2211-3835', 'Acta Pharmaceutica Sinica B', 'ok', 'ok'],
 ['Издания нет в справочниках', '9999-9999', 'Вестник вымышленного университета', 'unk', 'unk'],
 ['Поиск по названию без ISSN', '', 'Physical Review Letters', 'ok', 'check'],
 ['ISSN без дефиса и в нижнем регистре', '0028083x'.replace('x', '6'), '', 'ok', 'ok'],
].forEach(([n, i, t, q, f]) => { const v = jv(i, t); eq('издание / ' + n + ' / Q1–Q2', v.qual, q); eq('издание / ' + n + ' / показатель', v.ifSt, f); });
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

// --- квартиль по годам (ожидания: совпадает за год публикации и последний год — берём; расходится — «проверьте»)
const jy = (issn, y, live, oa) => A.journalVerdict(A.findJournal([issn], ''), y, live || null, oa == null ? null : oa);
eq('годы / Q2→Q3, статья 2021: проверьте', jy('9990-0001', 2021).qual, 'check');
eq('годы / Q2→Q3, статья 2025: нет', jy('9990-0001', 2025).qual, 'no');
eq('годы / Q3→Q1, статья 2021: проверьте', jy('9990-0002', 2021).qual, 'check');
eq('годы / Q3→Q1, статья 2024: да', jy('9990-0002', 2024).qual, 'ok');
eq('годы / издание только до 2022, статья 2024: да с пометкой', [jy('9990-0003', 2024).qual, jy('9990-0003', 2024).notes.some(x => /только до 2022/.test(x))], ['ok', true]);
eq('годы / статья 2026, данных за год ещё нет: взят 2025 с пометкой', [jy('0028-0836', 2026).qual, jy('0028-0836', 2026).sjYear, jy('0028-0836', 2026).sjExact], ['ok', 2025, false]);
eq('годы / статья 2019, выгрузки нет: взят 2021 с пометкой', [jy('0028-0836', 2019).sjYear, jy('0028-0836', 2019).notes.some(x => /2019/.test(x))], [2021, true]);
eq('годы / показатель 14 в год публикации и 6 сейчас: проверьте', jy('9990-0004', 2021).ifSt, 'check');
eq('годы / показатель 6 в год публикации и сейчас: нет', jy('9990-0004', 2025).ifSt, 'no');
eq('годы / Nano Letters 2021 (11,5) и 2025 (8,7): проверьте', jy('1530-6984', 2021).ifSt, 'check');
eq('годы / Technical Physics 2021: Q3, нет', jy('1063-7842', 2021).qual, 'no');
// --- сайт Белого списка против справочника
const LV = (a, b, c, st) => ({ found: true, levels: { 2023: a, 2025: b, 2026: c }, state: st || 0, disc: '' });
eq('сайт БС / совпадает со справочником', [jy('0028-0836', 2023, LV(1, 0, 0)).wlDiff, jy('0028-0836', 2023, LV(1, 0, 0)).qual], [undefined, 'ok']);
eq('сайт БС / издания на сайте нет, но Q1 SCImago: да, расхождение показано', [jy('0028-0836', 2023, { found: false }).qual, jy('0028-0836', 2023, { found: false }).wlDiff], ['ok', true]);
eq('сайт БС / Q4, в справочнике нет, на сайте уровень 1: проверьте, а не «нет»', jy('9990-0005', 2023, LV(1, 1, 0)).qual, 'check');
eq('сайт БС / Q4, в справочнике нет, на сайте уровень 3: нет', jy('9990-0005', 2023, LV(3, 3, 0)).qual, 'no');
eq('сайт БС / ЖТФ: на сайте теперь исключён: проверьте', jy('0044-4642', 2024, LV(2, 1, 0, 2)).qual, 'check');
// --- второй показатель (OpenAlex)
eq('OpenAlex / PRB: SCImago 3,6, OpenAlex 15 — проверьте', jy('2469-9950', 2023, null, 15).ifSt, 'check');
eq('OpenAlex / Nature: оба выше порога — да', jy('0028-0836', 2023, null, 20).ifSt, 'ok');
eq('OpenAlex / издания нет в SCImago, OpenAlex 3 — нет', jy('0044-4642', 2023, null, 3).ifSt, 'no');
eq('OpenAlex / издания нет в SCImago, OpenAlex 15 — проверьте (один источник)', jy('0044-4642', 2023, null, 15).ifSt, 'check');

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

// --- оценка публикации
const opt = { leader: A.leaderVariants('Петров'), yearFrom: 2021, yearTo: 2026 };
const W = o => Object.assign({ via: 'search', score: 1, doi: '10.1/x', title: 'T', journal: 'Nature', issns: ['0028-0836'], year: 2023, type: 'journal-article', authors: AU }, o);
const E = o => Object.assign({ raw: '', num: 1, doi: null, years: [2023], declIF: null, query: 'q' }, o);
let p = A.judgePub(E(), W(), opt);
eq('публикация / Nature, первый автор: идёт в счёт', p.counts, 'ok'); eq('публикация / Nature, первый автор: Вариант 2', p.v2, 'ok');
p = A.judgePub(E(), W({ year: 2019 }), opt); eq('публикация / старше 5 лет: не в счёт', p.counts, 'no'); eq('публикация / старше 5 лет: не Вариант 2', p.v2, 'no');
p = A.judgePub(E(), W({ type: 'proceedings-article' }), opt); eq('публикация / доклад конференции: не в счёт', p.counts, 'no');
p = A.judgePub(E(), W({ type: 'review' }), opt); eq('публикация / обзор: в счёт', p.counts, 'ok');
p = A.judgePub(E(), W({ issns: ['2469-9950'], journal: 'Physical Review B' }), opt); eq('публикация / PRB: в счёт', p.counts, 'ok'); eq('публикация / PRB: не Вариант 2', p.v2, 'no');
p = A.judgePub(E(), W({ authors: [AU[1], AU[0], AU[2]] }), opt); eq('публикация / руководитель не первый, данных о corresponding нет: проверьте', p.v2, 'check'); eq('публикация / не первый автор: в счёт всё равно', p.counts, 'ok');
p = A.judgePub(E(), W({ authors: [AU[1], AU[0], AU[2]], corr: { known: true, leader: true } }), opt); eq('публикация / не первый, но corresponding: Вариант 2', p.v2, 'ok');
p = A.judgePub(E(), W({ authors: [AU[1], AU[0], AU[2]], corr: { known: true, leader: false } }), opt); eq('публикация / не первый и corresponding другой: нет', p.v2, 'no');
p = A.judgePub(E(), W({ score: 0.7 }), opt); eq('публикация / неполное совпадение названия: проверьте', p.counts, 'check');
p = A.judgePub(E(), W({ score: 0.3 }), opt); eq('публикация / чужая статья: не найдено', p.found, 'no'); eq('публикация / чужая статья не оценивается', p.work, null);
p = A.judgePub(E(), null, opt); eq('публикация / не найдено в базе: не «не соответствует», а «не найдено»', [p.found, p.counts], ['no', 'unk']);
p = A.judgePub(E(), W({ score: 0.3, via: 'doi' }), opt); eq('публикация / найдено по DOI: название не сверяется', p.found, 'ok');
p = A.judgePub(E({ years: [2021] }), W({ year: 2020 }), opt); eq('публикация / год на границе, в заявке 2021, в базе 2020: проверьте', p.year, 'check');
p = A.judgePub(E({ years: [2018] }), W({ year: 2023 }), opt); eq('публикация / год в заявке не совпадает: отмечено', p.yearDiff, true);
p = A.judgePub(E({ declIF: 64.8 }), W(), opt); eq('публикация / заявленный ИФ рядом с показателем или отмечен', typeof p.ifDiff, 'boolean');
p = A.judgePub(E({ declIF: 12.5 }), W({ issns: ['2469-9950'], journal: 'Physical Review B' }), opt); eq('публикация / завышенный ИФ для PRB отмечен', p.ifDiff, true);
p = A.judgePub(E(), W({ issns: ['9999-9999'], journal: 'Вестник вымышленного университета' }), opt); eq('публикация / издания нет в справочниках: проверьте, а не «нет»', p.counts, 'check');
p = A.judgePub(E(), W({ authors: [{ family: 'Smith' }] }), opt); eq('публикация / руководителя нет среди авторов: проверьте', p.counts, 'check');
p = A.judgePub(E(), W(), { leader: [], yearFrom: 2021, yearTo: 2026 }); eq('публикация / фамилия не указана: издание считается, Вариант 2 под вопросом', [p.counts, p.v2], ['ok', 'check']);

// --- варианты
const mk = (n, o) => Array.from({ length: n }, (_, i) => A.judgePub(E({ num: i + 1 }), W(o), opt));
let v = A.judgeVariants(mk(10), null, 12); eq('варианты / 10 подтверждённых в списке', [v.v[1].st, v.v[3].st, v.v[4].st, v.v[2].st], ['ok', 'ok', 'ok', 'ok']);
v = A.judgeVariants(mk(6, { issns: ['2469-9950'], journal: 'Physical Review B' }), null, 12); eq('варианты / 6 в списке, профиля нет', [v.v[1].st, v.v[3].st, v.v[4].st, v.v[2].st], ['check', 'ok', 'check', 'no']);
v = A.judgeVariants(mk(6, { issns: ['2469-9950'] }), { ok: 11, check: 0, total: 14, source: 'OpenAlex' }, 12); eq('варианты / 6 в списке, 11 в профиле', [v.v[1].st, v.v[4].st], ['ok', 'ok']);
v = A.judgeVariants(mk(3, { issns: ['2469-9950'] }), { ok: 4, check: 1, total: 9, source: 'OpenAlex' }, 12); eq('варианты / профиль меньше заявленного: проверьте, а не «нет»', [v.v[1].st, v.v[3].st, v.v[4].st], ['check', 'check', 'check']);
eq('варианты / расхождение с п. 1.6 названо', /заявлено 12/.test(v.declNote), true);
v = A.judgeVariants(mk(4), null, 4); eq('варианты / в п. 1.6 заявлено меньше порога — названо', /меньше требуемых 5/.test(v.v[3].why), true);
v = A.judgeVariants([], null, null); eq('варианты / пустой список', v.v[2].st, 'unk');
eq('профиль / статья в Q4', A.judgeProfileWork({ issns: ['0033-2836'], journal: '' }).st, 'no');
eq('профиль / статья без издания', A.judgeProfileWork({ issns: [], journal: '' }).st, 'check');

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
{ const o2 = { leader: A.leaderVariants('Петров'), leaderIds: ['A5'], yearFrom: 2021, yearTo: 2025 };
  const mkW = au => ({ via: 'doi', doi: '10.1/x', title: 'T', journal: 'Nature', issns: ['0028-0836'], year: 2023, type: 'journal-article', authors: [{ family: 'Ivanov' }, { family: 'Petrov' }], oaAuthors: au });
  const e0 = { raw: '', num: 1, doi: null, years: [2023], declIF: null, query: 'q' };
  eq('автор / corresponding по профилю, хотя имя в базе записано иначе', A.judgePub(e0, mkW([{ id: 'A2', name: 'I. Ivanov', corr: false }, { id: 'A5', name: 'Pyotr Petroff-Vodkin', corr: true }]), o2).v2, 'ok');
  eq('автор / corresponding — другой человек', A.judgePub(e0, mkW([{ id: 'A2', name: 'I. Ivanov', corr: true }, { id: 'A5', name: 'P. Petrov', corr: false }]), o2).v2, 'no');
  eq('автор / corresponding не размечен: проверьте', A.judgePub(e0, mkW([{ id: 'A2', name: 'I. Ivanov', corr: false }, { id: 'A5', name: 'P. Petrov', corr: false }]), o2).v2, 'check'); }
{ const pw = A.judgeProfileWork({ issns: ['0028-0836'], journal: '', year: 2023, authors: [{ id: 'A1', corr: false }, { id: 'A5', corr: true }] }, ['A5']);
  eq('профиль / место автора и corresponding', [pw.st, pw.first, pw.corr, pw.ifSt], ['ok', false, true, 'ok']);
  const pw2 = A.judgeProfileWork({ issns: ['2469-9950'], journal: '', year: 2023, authors: [{ id: 'A5', corr: false }] }, ['A5']); eq('профиль / первый автор, показатель низкий', [pw2.first, pw2.ifSt], [true, 'no']); }
{ const pubs0 = Array.from({ length: 3 }, (_, i) => A.judgePub({ raw: '', num: i + 1, doi: null, years: [2023], declIF: null, query: 'q' }, { via: 'doi', doi: '10.1/x', title: 'T', journal: 'Physical Review B', issns: ['2469-9950'], year: 2023, type: 'journal-article', authors: [{ family: 'Petrov' }] }, { leader: A.leaderVariants('Петров'), yearFrom: 2021, yearTo: 2025 }));
  eq('варианты / Вариант 2: в списке нет, в профиле есть кандидат — проверьте', A.judgeVariants(pubs0, { ok: 3, check: 0, total: 3, source: 'OpenAlex', v2: [{}] }, null).v[2].st, 'check');
  eq('варианты / Вариант 2: нет ни в списке, ни в профиле — не подтверждено', A.judgeVariants(pubs0, { ok: 3, check: 0, total: 3, source: 'OpenAlex', v2: [] }, null).v[2].st, 'no'); }

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
{ const pk = A.judgePub({ raw: '', num: 1, doi: null, years: [2023], declIF: null, query: 'q' }, { via: 'doi', doi: '10.1/x', title: 'T', journal: 'Nature', issns: ['0028-0836'], year: 2023, type: 'proceedings-article', authors: [{ family: 'Smith' }] }, { leader: A.leaderVariants('Петров'), yearFrom: 2021, yearTo: 2025 });
  eq('без КД / замечания о требованиях КД лежат отдельно от фактов', [pk.notes.some(x => /КД|руководител/.test(x)), pk.notesKD.length], [false, 2]); }

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
  let n = 0; N.fetch = async () => (++n === 1 ? res(429, {}) : res(200, { message: { items: [crItem('10.1/b', 'Thermal conductivity of layered oxide ceramics under cyclic load')] } }));
  const t0 = Date.now(); w = await A.findWork(e1[0]); eq('сеть / после отказа 429 повтор', [w && w.doi, n, Date.now() - t0 >= 2000], ['10.1/b', 2, true]);
  N.fetch = async () => { throw new Error('Failed to fetch'); }; let er = null; try { await A.findWork(e1[0]); } catch (e) { er = e.kind; } eq('сеть / нет связи — ошибка, а не «не найдено»', er, 'net');
  // OpenAlex
  const oaW = { id: 'W1', type: 'review', authorships: [{ author_position: 'first', is_corresponding: false, author: { display_name: 'Ivan Ivanov' } }, { author_position: 'last', is_corresponding: true, author: { display_name: 'Petr P. Petrov' } }], primary_location: { source: { issn: ['0028-0836'] } } };
  N.useOA = true; N.fetch = async () => res(200, oaW); w = A.crWork(crItem('10.1/c', 'X'), 'doi'); await A.enrichOA(w, A.leaderVariants('Петров'));
  eq('сеть / OpenAlex: обзор и corresponding', [w.type, w.corr.known, w.corr.leader], ['review', true, true]);
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
  console.log(`Пройдено ${pass} из ${pass + fail}`); fails.forEach(f => console.log('  НЕ ПРОЙДЕНО — ' + f)); process.exit(fail ? 1 : 0);
})();
