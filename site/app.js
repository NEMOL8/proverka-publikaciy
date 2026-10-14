const ORCID_BUILTIN = "", OA_BUILTIN = "SUElqXUhQuvtt1VFt7031j";
/* ===== Проверка публикаций: правила (без сети, без ИИ) ===== */
const VERSION = '0.7.4', VERSION_DATE = '14.10.2026';
/* Что нового — показывается на странице */
const CHANGES = [
  ['0.7.4', '14.10.2026', ['«Проверить связь» опрашивает все базы одновременно и показывает ответы по мере поступления; база, не ответившая за 12 секунд, помечается «не отвечает». Любой запрос к базе теперь ждёт ответа не дольше 20 секунд (раньше зависший сервер мог задерживать работу на минуты).']],
  ['0.7.3', '14.10.2026', ['Встроен ключ OpenAlex: дневной лимит поиска авторов в 10 раз больше (около 1000 поисков по ФИО в день вместо 100). Поле «Ключ OpenAlex» в настройках можно не заполнять; своё значение заменит встроенное только в этом браузере.', 'Убран скрытый блок итоговых выводов: утилита показывает только факты о публикациях и авторах.']],
  ['0.7.2', '14.10.2026', ['Оформление по брендбуку Инконсалт: бордовая шапка с логотипом и сетчатым узором, заголовки заглавными буквами (Circe ExtraBold), тёмные шапки таблиц. Фирменный красный — только тонкой линией под шапкой; цвета пометок не меняются.']],
  ['0.7.1', '14.10.2026', ['Оформление по брендбуку Инконсалт: шрифт Circe, фирменные серый, тёмно-коричневый и бежевый цвета. Логотипа, названия компании и красного нет (правило проекта).']],
  ['0.7', '13.10.2026', ['Блок «Профили автора»: все ссылки на найденного автора (ORCID, Scopus, Web of Science, eLibrary, OpenAlex) с пометкой, откуда взят идентификатор, и ссылки-поиски по ФИО (Google Scholar, ResearchGate, Semantic Scholar и др.); предупреждение, если идентификаторы из разных источников расходятся; «Скопировать ссылки».',
    'Corresponding author у каждой статьи: «да» / «нет» (и кто) / «в базе не указан» — отдельной колонкой в публикациях автора и пометкой в списке.',
    'Фильтры: corresponding author и показатель «от …» (цитирований на документ SCImago на год публикации).',
    'Организация автора в каждой статье и сверка с организацией из заявки.',
    'Возможные дубли в списке: одинаковый DOI, одинаковое название, препринт и журнальная версия, тезисы и статья.',
    'Несколько авторов сразу (раздел 3): сводная таблица по исполнителям и публикации каждого.',
    'Сайт: справочники и распознавание загружаются отдельно и кешируются браузером; короткая инструкция; «Что нового»; страница закрыта от поисковиков.']],
  ['0.6', '12.10.2026', ['Поиск автора по всем идентификаторам (ORCID, Scopus ID, ResearcherID через реестр ORCID) и по ФИО кириллицей и латиницей; похожие профили того же автора.']],
  ['0.5', '12.10.2026', ['Два режима: список публикаций и автор. Фильтры по квартилю, Белому списку и годам. Квартиль и уровень — на год публикации и сейчас.']],
];

/* Требования п. 4.4 КД (4 очередь). Меняются здесь. */
const KD = {
  years: 5,            // «за последние пять лет»
  v1pubs: 10, v3pubs: 5, v4pubs: 8,
  v2if: 10,            // импакт-фактор не ниже 10
  ifLow: 7, ifHigh: 13 // «цитирований на документ» SCImago: ниже ifLow — нет, от ifHigh — да, между — «проверьте»
};
const ST = { ok: 'ok', check: 'check', no: 'no', unk: 'unk' };
const ST_NAME = { ok: 'подтверждено', check: 'проверьте', no: 'не подтверждено', unk: 'не удалось проверить' };

/* ---------- текст ---------- */
const norm = s => String(s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/ё/g, 'е').replace(/&amp;/g, ' ').replace(/[^a-z0-9а-я]+/g, ' ').trim();
const normIssn = s => String(s || '').toUpperCase().replace(/[^0-9X]/g, '');
const fmtIssn = s => s.length === 8 ? s.slice(0, 4) + '-' + s.slice(4) : s;
const fmtNum = v => v == null ? '' : String(Math.round(v * 100) / 100).replace('.', ',');
function lev(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let p = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const c = [i]; let mn = i;
    for (let j = 1; j <= b.length; j++) { c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); if (c[j] < mn) mn = c[j]; }
    if (mn > max) return max + 1; p = c;
  }
  return p[b.length];
}

/* ---------- справочники ---------- */
let REF = null;
function loadRef(data) {
  const R = { sjYears: data.sjYears, sjYear: data.sjYears[data.sjYears.length - 1], wlDate: data.wlDate, sj: data.sj, wl: data.wl, notes: data.wlNotes, sjIssn: new Map(), wlIssn: new Map(), sjTitle: new Map(), wlTitle: new Map() };
  const put = (m, k, i) => { if (!k) return; const a = m.get(k); if (a) { if (a.indexOf(i) < 0) a.push(i); } else m.set(k, [i]); };
  data.sj.forEach((r, i) => { r[1].split(' ').forEach(x => put(R.sjIssn, x, i)); put(R.sjTitle, norm(r[0]), i); });
  data.wl.forEach((r, i) => { r[1].split(' ').forEach(x => put(R.wlIssn, x, i)); r[0].split(' | ').forEach(t => put(R.wlTitle, norm(t), i)); });
  REF = R; return R;
}
const SJ_TYPE = ['журнал', 'книжная серия', 'труды конференций', 'отраслевой журнал'];
function sjRec(i) {
  const r = REF.sj[i], hist = {}; let last = null;
  REF.sjYears.forEach((y, k) => { const q = r[5 + 2 * k], c = r[6 + 2 * k]; if (q != null || c != null) { hist[y] = { q: q || 0, cpd: c }; last = y; } });
  return { title: r[0], issns: r[1].split(' ').filter(Boolean), type: r[2], cats: r[3], sid: r[4], hist, last, q: hist[last].q, cpd: hist[last].cpd };
}
/* Данные SCImago на год публикации. Если года нет в выгрузках или издания в нём нет — ближайший год, с пометкой. */
function sjAt(sj, year) {
  const ys = Object.keys(sj.hist).map(Number); if (!year) return { y: sj.last, exact: false, why: 'год публикации неизвестен' };
  if (sj.hist[year]) return { y: year, exact: true };
  const y = ys.slice().sort((a, b) => Math.abs(a - year) - Math.abs(b - year) || b - a)[0];
  return { y, exact: false, why: year > REF.sjYear ? `данных SCImago за ${year} год ещё нет` : (year < REF.sjYears[0] ? `выгрузки SCImago за ${year} год нет в справочнике` : `в SCImago за ${year} год издания нет`) };
}
const ifStatus = c => c == null ? ST.unk : (c >= KD.ifHigh ? ST.ok : (c >= KD.ifLow ? ST.check : ST.no));
function wlRec(i) {
  const r = REF.wl[i]; const lv = { 2023: r[2], 2025: r[3], 2026: r[4] };
  return { title: r[0], issns: r[1].split(' ').filter(Boolean), levels: lv, state: r[5], notice: r[6] ? REF.notes[r[6] - 1] : '', disc: r[7], wos: !!(r[8] & 1), scopus: !!(r[8] & 2), rsci: !!(r[8] & 4) };
}
/* Поиск издания: сначала по ISSN, затем по точному названию. how: 'issn' | 'title' | 'ambiguous' | null */
function findJournal(issns, title) {
  const out = { sj: null, wl: null, sjHow: null, wlHow: null };
  const by = (mI, mT, rec) => {
    const hit = new Set(); (issns || []).map(normIssn).forEach(x => (mI.get(x) || []).forEach(i => hit.add(i)));
    if (hit.size === 1) return [rec([...hit][0]), 'issn'];
    if (hit.size > 1) return [rec([...hit][0]), 'ambiguous'];
    const t = norm(title); if (!t) return [null, null];
    let a = mT.get(t) || mT.get(t.replace(/^the /, '')) || mT.get(t.replace(/ and /g, ' '));
    if (!a) return [null, null];
    return [rec(a[0]), a.length === 1 ? 'title' : 'ambiguous'];
  };
  [out.sj, out.sjHow] = by(REF.sjIssn, REF.sjTitle, sjRec);
  [out.wl, out.wlHow] = by(REF.wlIssn, REF.wlTitle, wlRec);
  return out;
}

/* ---------- разбор списка из заявки ---------- */
const DOI_RE = /\b10\.\d{4,9}\/[^\s"<>]+/i;
function cleanDoi(d) { return d.replace(/[.,;)\]]+$/, '').toLowerCase(); }
/* Делит вставленный или распознанный текст на отдельные публикации */
function splitEntries(text) {
  const lines = String(text || '').replace(/\r/g, '').split('\n').map(l => l.replace(/[ \t ]+/g, ' ').trim());
  const numRe = /^(\d{1,2})\s*[.)]\s*(?=\S)/;
  const nums = lines.map(l => { const m = l.match(numRe); return m ? +m[1] : null; });
  // нумерованный список: начинаться может с любого номера, номера растут; пропуск одного-двух номеров допустим
  const seq = []; let last = null;
  nums.forEach((n, i) => { if (n == null) return; if (last == null || (n > last && n <= last + 3)) { seq.push(i); last = n; } });
  const hasYear = b => /\b(19[5-9]\d|20[0-4]\d)\b/.test(b.join(' ')) || DOI_RE.test(b.join(' '));
  let blocks = [];
  if (seq.length >= 2) {
    // текст до первого номера — заголовок таблицы, если в нём нет года
    const head = lines.slice(0, seq[0]).filter(Boolean); if (head.length && hasYear(head) && head.join(' ').length >= 40) blocks.push(head);
    seq.forEach((st, k) => blocks.push(lines.slice(st, k + 1 < seq.length ? seq[k + 1] : lines.length)));
    // строка без номера внутри записи, но похожая на отдельную запись (свой год), если номер потерялся: оставить внутри, так надёжнее
  } else {
    let cur = []; lines.forEach(l => { if (!l) { if (cur.length) blocks.push(cur); cur = []; } else cur.push(l); }); if (cur.length) blocks.push(cur);
    if (blocks.length <= 1) blocks = lines.filter(Boolean).map(l => [l]);
    // кусок без года и без DOI — продолжение предыдущей записи (перенос строки или лишняя пустая строка)
    const merged = []; blocks.forEach(b => { if (merged.length && !hasYear(b)) merged[merged.length - 1] = merged[merged.length - 1].concat(b); else merged.push(b); }); blocks = merged;
  }
  const out = blocks.map(b => parseEntry(b.filter(Boolean).join('\n'))).filter(e => e.query.length >= 12);
  // пропущенный номер: запись перед пропуском могла слиться с потерянной
  out.forEach((e, i) => { const nx = out[i + 1]; if (e.num != null && nx && nx.num != null && nx.num > e.num + 1) e.warn = `после № ${e.num} в списке нет № ${e.num + 1} — проверьте, не слились ли две записи в одну`; });
  return out;
}
function parseEntry(raw) {
  let t = raw.replace(/([a-zа-яё])-\n(?=[a-zа-яё])/gi, '$1').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  const e = { raw: t, num: null, doi: null, years: [], declIF: null, query: '' };
  let m = t.match(/^(\d{1,2})\s*[.)]\s*/); if (m) { e.num = +m[1]; t = t.slice(m[0].length); }
  m = t.match(DOI_RE); if (m) e.doi = cleanDoi(m[0]);
  let q = t.replace(/https?:\/\/\S+/g, ' ').replace(DOI_RE, ' ');
  // заявленный импакт-фактор: число с дробной частью в конце записи или после «IF / импакт-фактор»
  m = q.match(/(?:\bIF\b|импакт[\s-]*фактор)\s*[:=–—-]?\s*(\d{1,3}(?:[.,]\d{1,3})?)/i);
  if (m) { e.declIF = parseFloat(m[1].replace(',', '.')); q = q.replace(m[0], ' '); }
  else { m = q.match(/[\s|;,(]\(?(\d{1,3}[.,]\d{1,3})\)?\s*[|.]?\s*$/); if (m) { e.declIF = parseFloat(m[1].replace(',', '.')); q = q.slice(0, m.index); } }
  const now = new Date().getFullYear();
  e.years = [...new Set((q.match(/\b(?:19[5-9]\d|20[0-4]\d)\b/g) || []).map(Number).filter(y => y <= now + 1))];
  e.query = q.replace(/[|]/g, ' ').replace(/\s+/g, ' ').trim();
  return e;
}

/* ---------- сопоставление найденной статьи с записью ---------- */
/* Доля слов названия найденной статьи, которые есть в записи из заявки (с допуском на опечатку распознавания) */
function titleScore(foundTitle, entryText) {
  const ft = norm(foundTitle).split(' ').filter(w => w.length >= 3);
  if (ft.length < 2) return 0;
  const et = norm(entryText).split(' '); const set = new Set(et);
  let hit = 0;
  for (const w of ft) { if (set.has(w)) hit++; else if (w.length >= 6 && et.some(x => Math.abs(x.length - w.length) <= 1 && lev(x, w, 1) <= 1)) hit += 0.9; }
  return hit / ft.length;
}

/* ---------- фамилия руководителя ---------- */
const TR = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'i', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' };
const translit = s => String(s).toLowerCase().split('').map(c => TR[c] != null ? TR[c] : c).join('');
/* Приводит разные способы записи одной фамилии латиницей к одному виду */
function canonName(s) {
  let t = String(s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();
  if (/[а-яё]/.test(t)) t = translit(t);
  return t.replace(/[^a-z]/g, '').replace(/iy(?=[aeuo])/g, 'i').replace(/shch|sch/g, 'S').replace(/tch|ch/g, 'C').replace(/sh/g, 'X').replace(/zh/g, 'Z').replace(/kh/g, 'h').replace(/ts|tz|cz/g, 'c').replace(/ks/g, 'x')
    .replace(/[jy]u|iu/g, 'u').replace(/[jy]a|ia/g, 'a').replace(/[jy]o|io/g, 'o').replace(/[jy]e|ie/g, 'e').replace(/[jy]/g, 'i').replace(/ii+/g, 'i').replace(/w/g, 'v').replace(/ff$/, 'v').replace(/(.)\1+/g, '$1');
}
function leaderVariants(input) { return String(input || '').split(/[,;\/]+/).map(s => s.trim().split(/\s+/)[0]).filter(s => s && s.length >= 2).map(canonName).filter(Boolean); }
function sameSurname(family, variants) {
  const c = canonName(family); if (!c) return false;
  return variants.some(v => v === c || (Math.min(v.length, c.length) >= 5 && lev(v, c, 1) <= 1));
}
/* Позиция руководителя среди авторов: first | last | middle | none | unknown */
function authorPosition(authors, variants) {
  if (!variants.length) return { pos: 'unknown', why: 'фамилия руководителя не указана' };
  if (!authors || !authors.length) return { pos: 'unknown', why: 'в базе нет списка авторов' };
  const idx = authors.map((a, i) => sameSurname(a.family || a.name || '', variants) ? i : -1).filter(i => i >= 0);
  if (!idx.length) return { pos: 'none', n: authors.length };
  const i = idx[0];
  return { pos: i === 0 ? 'first' : (i === authors.length - 1 ? 'last' : 'middle'), index: i + 1, n: authors.length, name: [authors[i].given, authors[i].family].filter(Boolean).join(' ') };
}

/* ---------- Белый список на год публикации ----------
   Уровни заданы на отдельные годы (2023, 2025, 2026); на год публикации берётся последний уровень, заданный не позже этого года.
   cur — текущий уровень (последний заданный), с учётом исключения. */
function wlAt(wl, year) {
  const ys = Object.keys(wl.levels).map(Number).filter(y => wl.levels[y]).sort((a, b) => a - b);
  const last = ys.length ? wl.levels[ys[ys.length - 1]] : 0;
  const o = { lv: 0, y: null, exact: true, excluded: false, ambiguous: false, cur: wl.state === 2 ? 0 : last, curExcl: wl.state === 2 };
  if (!ys.length) { o.exact = false; return o; }
  const y = year || ys[ys.length - 1]; let pick = ys.filter(v => v <= y).pop();
  if (pick == null) { pick = ys[0]; o.exact = false; }
  o.lv = wl.levels[pick]; o.y = pick;
  if (wl.state === 2) { const dy = +(String(wl.disc).match(/(\d{4})$/) || [])[1]; if (dy && year) { if (year > dy) { o.excluded = true; } else if (year === dy) o.ambiguous = true; } else if (!year) o.excluded = true; }
  return o;
}
/* Фильтр строк таблицы. r: {qY — квартиль на год публикации (0 — нет), wl — уровень БС на год (0/null — нет), excl, y — год,
   corr — 'yes'|'no'|'unk'|null (автор corresponding), cpd — показатель SCImago на год публикации, org — 'yes'|'check'|'no'|'unk'|null}.
   flt: {q: ['1'..'4','none'], wl: ['1'..'4','none','excl'], yFrom, yTo, corr: ['yes','no','unk'], ifFrom, org: [...]}.
   Квартиль и Белый список — «или» между собой; годы, corresponding, показатель и организация — дополнительные условия «и». */
function passFilter(r, flt) {
  if (flt.yFrom && !(r.y >= flt.yFrom)) return false;
  if (flt.yTo && !(r.y <= flt.yTo)) return false;
  if (flt.corr && flt.corr.length && flt.corr.indexOf(r.corr || 'unk') < 0) return false;
  if (flt.ifFrom && !(r.cpd != null && r.cpd >= flt.ifFrom)) return false;
  if (flt.org && flt.org.length && flt.org.indexOf(r.org || 'unk') < 0) return false;
  const q = flt.q || [], w = flt.wl || [];
  // статья не найдена — под условия о квартиле, уровне, corresponding и организации не подходит
  if (r.qY === undefined && r.wl === undefined && (q.length || w.length || (flt.corr && flt.corr.length) || (flt.org && flt.org.length))) return false;
  if (!q.length && !w.length) return true;
  const qOk = q.some(v => v === 'none' ? !r.qY : r.qY === +v);
  const wOk = w.some(v => v === 'excl' ? !!r.excl : (r.excl ? false : (v === 'none' ? !r.wl : r.wl === +v)));
  return qOk || wOk;
}
/* Автор — corresponding? authors: [{id, corr}] из OpenAlex; ids — профили автора.
   'yes' — отмечен он; 'no' — отмечен другой; 'unk' — в базе никто не отмечен; null — данных об авторах нет */
function corrOf(authors, ids) {
  if (!authors || !ids || !ids.length) return null;
  const c = authors.filter(a => a.corr); if (!c.length) return 'unk';
  return c.some(a => ids.indexOf(a.id) >= 0) ? 'yes' : 'no';
}

/* ---------- организация ----------
   Сверка организации автора в статье (OpenAlex: institutions, raw_affiliation_strings) с организацией из заявки.
   Слова приводятся к одному виду: кириллица — в латиницу, общие слова («университет», «государственный», «federal») отбрасываются,
   частые переводные слова («московский» — «moscow», «технологический» — «technological») сводятся к одному понятию. */
const ORG_STOP = new Set('university universitet universiteta institute institut instituta federal federalnoe federalnyi federalnogo state gosudarstvennyi gosudarstvennogo gosudarstvennoe national natsionalnyi natsionalnogo research issledovatelskii issledovatelskogo nauchno nauchnyi nauchnogo scientific science of the and for in at on named imeni im after center centre tsentr school shkola higher vysshaia vysshego autonomous avtonomnoe budgetary biudzhetnoe biudzhetnoi educational obrazovatelnoe obrazovatelnoi obrazovaniia uchrezhdenie uchrezhdeniia institution organization organizatsiia faculty fakultet department kafedra otdel branch filial ltd llc fgaou fgbou fgbun fgbu fgau ano ooo ao pao vo dpo'.split(' '));
const ORG_CONCEPT = [['moskov', 'moscow', 'moskva', 'moskvy'], ['peterburg', 'petersburg', 'spb'], ['ross', 'russia'], ['sibir', 'siberia'], ['akadem', 'academ'], ['tekhnolog', 'technolog'], ['tekhnich', 'technical', 'techni'], ['politekhn', 'polytechn'], ['meditsin', 'medic'], ['pedagog', 'pedagog'], ['fiz', 'physic', 'physical'], ['khim', 'chemi', 'chemical'], ['matemat', 'mathemat'], ['biolog', 'biolog'], ['ekonom', 'econom'], ['agrar', 'agricult'], ['gorn', 'mining'], ['iadern', 'nuclear'], ['aviats', 'aviation'], ['aerokosm', 'aerospace'], ['kosm', 'space'], ['inzhener', 'engineer'], ['priborostr', 'instrument'], ['energet', 'energ'], ['neft', 'petrol', 'oil'], ['lesn', 'forest'], ['morsk', 'marine', 'maritime'], ['veterinar', 'veterinar'], ['iuzhn', 'southern', 'south'], ['severn', 'northern', 'north'], ['dalnevostoch', 'far eastern', 'far east'], ['ural', 'ural'], ['volg', 'volga'], ['kavkaz', 'caucas'], ['sirius', 'sirius']];
function orgTokens(s) {
  let t = String(s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/ё/g, 'е');
  t = t.split('').map(c => TR[c] != null ? TR[c] : c).join('').replace(/[^a-z0-9]+/g, ' ');
  t = t.replace(/far eastern|far east/g, 'dalnevostoch');
  const out = [];
  for (let w of t.split(' ')) {
    if (!w || w.length < 3 || ORG_STOP.has(w) || /^\d+$/.test(w)) continue;
    const c = ORG_CONCEPT.find(g => g.some(p => w.startsWith(p)));
    out.push(c ? '#' + c[0] : w);
  }
  return [...new Set(out)];
}
const orgTokEq = (a, b) => { if (a === b) return true; if (a[0] === '#' || b[0] === '#') return false; const n = Math.min(a.length, b.length); if (n < 4) return false; let k = 0; while (k < n && a[k] === b[k]) k++; return k >= Math.max(4, n - 1) || (n >= 7 && lev(a, b, 1) <= 1); };
/* Результат: {st:'yes'|'check'|'no'|'unk', name} — st 'unk', если в статье организация не указана */
function orgMatch(insts, input) {
  const names = (insts || []).filter(Boolean); if (!names.length) return { st: 'unk' };
  const it = orgTokens(input); if (!it.length) return { st: null };
  let best = null;
  for (const n of names) {
    const nt = orgTokens(n); if (!nt.length) continue;
    const a = it.filter(x => nt.some(y => orgTokEq(x, y))).length, b = nt.filter(y => it.some(x => orgTokEq(x, y))).length;
    const st = a === it.length && b === nt.length ? 'yes' : (a || b ? 'check' : 'no');
    const rank = { yes: 3, check: 2, no: 1 }[st]; if (!best || rank > best.rank) best = { st, name: n, rank };
  }
  if (!best) return { st: 'check', name: names[0] };
  // нет общих слов, но названия на разных языках — перевод мог не распознаться: «проверьте», а не «другая»
  if (best.st === 'no' && isCyr(input) !== isCyr(best.name)) best.st = 'check';
  return { st: best.st, name: best.name };
}

/* ---------- возможные дубли в списке ----------
   pubs — результаты judgePub. Возвращает [{a, b, why}] — индексы записей и причина. Сама утилита ничего не исключает. */
const PREPRINT_RE = /arxiv|biorxiv|medrxiv|chemrxiv|research square|ssrn|preprints|techrxiv|engrxiv|psyarxiv|osf preprints/i;
function isPreprint(w) { return !!w && (w.type === 'posted-content' || w.type === 'preprint' || PREPRINT_RE.test(w.journal || '') || /^10\.48550\/arxiv/.test(w.doi || '') || /^10\.1101\//.test(w.doi || '') && /rxiv/i.test(w.journal || '')); }
const isProc = w => !!w && (w.type === 'proceedings-article' || /proceedings|conference|symposium|congress|abstracts|тезис|конференц|материалы/i.test(w.journal || ''));
function findDuplicates(pubs) {
  const out = [], txt = p => p.work ? p.work.title : p.entry.query, doi = p => (p.work && p.work.doi) || p.entry.doi || '';
  const sim = (x, y) => { const a = txt(x), b = txt(y); if (!a || !b) return 0; return Math.min(titleScore(a, b), titleScore(b, a)); };
  // для пары «препринт или доклад — статья»: название одной почти целиком входит в название другой (полная статья часто называется длиннее)
  const words = t => norm(t).split(' ').filter(w => w.length >= 3).length;
  const cont = (x, y) => { const a = txt(x), b = txt(y); if (!a || !b) return 0; const [sh, lo] = words(a) <= words(b) ? [a, b] : [b, a]; return words(sh) >= 4 ? titleScore(sh, lo) : sim(x, y); };
  for (let i = 0; i < pubs.length; i++) for (let j = i + 1; j < pubs.length; j++) {
    const a = pubs[i], b = pubs[j];
    if (doi(a) && doi(a) === doi(b)) { out.push({ a: i, b: j, why: 'одинаковый DOI' }); continue; }
    if (!a.work || !b.work) { if (!a.work && !b.work && sim(a, b) >= 0.9 && norm(a.entry.query).length > 30) out.push({ a: i, b: j, why: 'записи почти совпадают' }); continue; }
    const s = sim(a, b);
    if (isPreprint(a.work) !== isPreprint(b.work) && (s >= 0.75 || cont(a, b) >= 0.85)) { out.push({ a: i, b: j, why: 'препринт и журнальная версия одной работы' }); continue; }
    if (isProc(a.work) !== isProc(b.work) && (s >= 0.75 || cont(a, b) >= 0.85)) { out.push({ a: i, b: j, why: 'доклад (тезисы) и статья с почти тем же названием' }); continue; }
    if (s >= 0.9) out.push({ a: i, b: j, why: 'одинаковое название при разных DOI' });
  }
  return out;
}

/* ---------- оценка издания ----------
   year — год публикации; live — ответ сайта Белого списка {found, levels, state, disc} или null; oaCpd — показатель OpenAlex или null */
function journalVerdict(j, year, live, oaCpd) {
  const o = { qual: ST.unk, qualWhy: [], ifSt: ST.unk, ifWhy: '', notes: [] };
  const sj = j.sj, wl = j.wl;
  if (j.sjHow === 'ambiguous') o.notes.push('в SCImago несколько изданий с таким ISSN или названием — взято первое, проверьте');
  if (j.wlHow === 'ambiguous') o.notes.push('в Белом списке несколько изданий с таким ISSN или названием — взято первое, проверьте');
  if (j.sjHow === 'title' || j.wlHow === 'title') o.notes.push('издание найдено по названию, а не по ISSN');
  let sjOk = null, wlOk = null, at = null;
  if (sj) {
    at = sjAt(sj, year); const hy = sj.hist[at.y], hl = sj.hist[sj.last]; o.sjYear = at.y; o.sjExact = at.exact; o.qY = hy.q; o.qL = hl.q; o.yL = sj.last;
    o.hist = Object.keys(sj.hist).map(y => `${y}: ${sj.hist[y].q ? 'Q' + sj.hist[y].q : '—'}`).join(', ');
    const okY = hy.q ? hy.q <= 2 : null, okL = hl.q ? hl.q <= 2 : null;
    o.qualWhy.push(`SCImago ${at.y}${at.exact ? ' (год публикации)' : ''}: ${hy.q ? 'Q' + hy.q : 'квартиль не присвоен'}` + (at.y !== sj.last ? `; ${sj.last}: ${hl.q ? 'Q' + hl.q : 'квартиль не присвоен'}` : ''));
    if (!at.exact) o.notes.push(`${at.why} — взят ${at.y} год`);
    if (sj.last < REF.sjYear) o.notes.push(`в SCImago издание есть только до ${sj.last} года`);
    // квартиль на год публикации и за последний год: совпадают — берём, расходятся — «проверьте»
    const both = [okY, okL].filter(v => v !== null);
    if (!both.length) sjOk = null; else if (both.every(v => v)) sjOk = true; else if (both.some(v => v)) { sjOk = 'maybe'; o.notes.push(`квартиль издания менялся (${o.hist}): на ${at.y} год — ${hy.q ? 'Q' + hy.q : 'нет'}, на ${sj.last} — ${hl.q ? 'Q' + hl.q : 'нет'}; проверьте, какой год учитывать`); } else sjOk = false;
    if (sj.type) o.notes.push(`в SCImago тип издания — ${SJ_TYPE[sj.type]}`);
  } else o.qualWhy.push('в SCImago не найдено');
  // Белый список: встроенный справочник и, если получен, ответ сайта
  const lvStr = lv => { const e = Object.entries(lv).filter(([, v]) => v); return e.length ? e.map(([y, v]) => `уровень ${v} (${y})`).join(', ') : 'уровень не указан'; };
  const wlEval = (levels, state) => { const lv = Object.values(levels).filter(Boolean); const any1 = lv.some(v => v === 1), all1 = lv.length > 0 && lv.every(v => v === 1); return { ok: all1 && state !== 2 ? true : (any1 ? 'maybe' : false), any1, all1 }; };
  if (wl) {
    const e = wlEval(wl.levels, wl.state); wlOk = e.ok;
    o.qualWhy.push('Белый список: ' + lvStr(wl.levels) + (wl.state === 2 ? `, исключён ${wl.disc}` : ''));
    if (wl.state === 2) o.notes.push('издание исключено из Белого списка ' + wl.disc + ' — учитывается ли статья, зависит от даты публикации');
    else if (e.any1 && !e.all1) o.notes.push('уровень издания в Белом списке менялся — проверьте уровень на год публикации');
    if (wl.state === 1 && wl.notice) o.notes.push('примечание Белого списка: ' + wl.notice);
  } else o.qualWhy.push('в Белом списке не найдено');
  if (live) {
    o.wlLive = true;
    const a = wl ? JSON.stringify([wl.levels[2023] || 0, wl.levels[2025] || 0, wl.levels[2026] || 0, wl.state === 2]) : 'нет';
    const b = live.found ? JSON.stringify([live.levels[2023] || 0, live.levels[2025] || 0, live.levels[2026] || 0, live.state === 2]) : 'нет';
    if (a !== b) {
      o.wlDiff = true;
      o.qualWhy.push('сайт Белого списка сейчас: ' + (live.found ? lvStr(live.levels) + (live.state === 2 ? `, исключён ${live.disc || ''}` : '') : 'издания нет'));
      o.notes.push(`сайт Белого списка отвечает иначе, чем справочник от ${REF.wlDate} — показаны оба значения, проверьте`);
      const lo = live.found ? wlEval(live.levels, live.state).ok : false; if ((lo || false) !== (wlOk || false)) wlOk = 'maybe';
    } else o.qualWhy.push('сайт Белого списка: совпадает со справочником');
  }
  if (sjOk === true || wlOk === true) o.qual = ST.ok;
  else if (sjOk === 'maybe' || wlOk === 'maybe') o.qual = ST.check;
  else if (!sj && !wl && !(live && live.found)) o.qual = ST.unk;
  else if (sj && sjOk === null && !wl) o.qual = ST.check;
  else o.qual = ST.no;
  // показатель вместо импакт-фактора: год публикации и последний год
  if (sj) {
    const cy = sj.hist[at.y].cpd, cl = sj.hist[sj.last].cpd; o.cpd = cy != null ? cy : cl; o.cpdLast = cl;
    const sy = ifStatus(cy), sl = ifStatus(cl); o.ifSt = sy === sl || sl === ST.unk ? sy : (sy === ST.unk ? sl : ST.check);
    o.ifWhy = `«цитирований на документ за 2 года» SCImago: ${at.y} — ${cy != null ? fmtNum(cy) : 'нет'}` + (at.y !== sj.last ? `, ${sj.last} — ${cl != null ? fmtNum(cl) : 'нет'}` : '');
    if (sy !== sl && sy !== ST.unk && sl !== ST.unk) o.notes.push(`показатель издания в ${at.y} и ${sj.last} годах по разные стороны порога — сверьте импакт-фактор на сайте журнала`);
    else if (o.ifSt === ST.check) o.ifWhy += ` (близко к порогу ${KD.v2if}: сверьте импакт-фактор на сайте журнала)`;
  } else o.ifWhy = 'издания нет в SCImago — показатель неизвестен';
  if (oaCpd != null) {
    o.oaCpd = oaCpd; o.ifWhy += `; OpenAlex (сейчас) — ${fmtNum(oaCpd)}`; const so = ifStatus(oaCpd);
    if (o.ifSt === ST.unk) o.ifSt = so === ST.no ? ST.no : ST.check;
    else if (so !== o.ifSt && o.ifSt !== ST.check) { o.ifSt = ST.check; o.notes.push(`показатели SCImago и OpenAlex по разные стороны порога — сверьте импакт-фактор на сайте журнала`); }
  }
  return o;
}

/* ---------- оценка одной публикации ----------
   entry — запись из заявки; work — найденная статья {doi,title,authors[],journal,issns[],year,type,score,via,corr}
   opt: {leader, yearFrom, yearTo} */
const TYPE_OK = { 'journal-article': 'статья', article: 'статья', review: 'обзор' };
const TYPE_RU = { 'proceedings-article': 'доклад в трудах конференции', 'book-chapter': 'глава книги', 'posted-content': 'препринт', preprint: 'препринт', book: 'книга', dataset: 'набор данных', editorial: 'редакционная статья', letter: 'письмо', erratum: 'исправление', 'peer-review': 'рецензия', dissertation: 'диссертация', monograph: 'монография', 'report': 'отчёт', paratext: 'служебная страница журнала' };
function judgePub(entry, work, opt) {
  const r = { entry, work, found: ST.unk, notes: entry.warn ? [entry.warn] : [], notesKD: [], year: ST.unk, type: ST.unk, qual: ST.unk, ifSt: ST.unk, author: ST.unk, j: null, jv: null, pos: null, counts: ST.unk, v2: ST.unk };
  if (!work) { r.found = work === null ? ST.no : ST.unk; r.notes.push(work === null ? 'в открытой базе не найдено — проверьте вручную (возможно, издание не передаёт данные в Crossref или запись распознана с ошибками)' : 'запрос не выполнен'); return r; }
  // найдено ли именно то
  if (work.via === 'doi') r.found = ST.ok;
  else { r.found = work.score >= 0.85 ? ST.ok : (work.score >= 0.6 ? ST.check : ST.no); if (r.found === ST.check) r.notes.push('название найденной статьи совпадает с записью не полностью — убедитесь, что это та же статья'); }
  if (r.found === ST.no) { r.notes.push('ближайшая найденная статья не похожа на запись — проверьте вручную'); r.work = null; r.near = work; return r; }
  // год
  if (work.year) {
    r.year = work.year >= opt.yearFrom && work.year <= opt.yearTo ? ST.ok : ST.no;
    if (entry.years.length && entry.years.indexOf(work.year) < 0) {
      const near = entry.years.some(y => Math.abs(y - work.year) === 1);
      r.yearDiff = true; r.notes.push(`год в списке (${entry.years.join(', ')}) не совпадает с годом в базе (${work.year})` + (near ? ' — разница в один год бывает между выходом онлайн и в номере' : ''));
      if (near && entry.years.some(y => y >= opt.yearFrom && y <= opt.yearTo) !== (r.year === ST.ok)) r.year = ST.check;
    }
  }
  // тип
  if (work.type) { if (TYPE_OK[work.type]) { r.type = ST.ok; r.typeName = TYPE_OK[work.type]; } else { r.type = ST.no; r.typeName = TYPE_RU[work.type] || work.type; r.notesKD.push(`тип публикации в базе — ${r.typeName}; КД требует article или review`); } }
  // издание
  r.j = findJournal(work.issns, work.journal); r.jv = journalVerdict(r.j, work.year, work.wlLive || null, work.oaCpd != null ? work.oaCpd : null);
  r.qual = r.jv.qual; r.ifSt = r.jv.ifSt; r.notes.push(...r.jv.notes);
  if (entry.declIF != null) {
    r.declIF = entry.declIF;
    if (r.jv.cpd != null) { const d = Math.abs(entry.declIF - r.jv.cpd), big = d > Math.max(1.5, 0.35 * r.jv.cpd); r.ifDiff = big; if (big) r.notes.push(`импакт-фактор из списка ${fmtNum(entry.declIF)} заметно отличается от показателя SCImago ${fmtNum(r.jv.cpd)} — это разные показатели, сверьте на сайте журнала`);
      if (entry.declIF >= KD.v2if && r.jv.ifSt === ST.no) r.notesKD.push(`в заявке импакт-фактор не ниже ${KD.v2if}, а по SCImago издание до порога не доходит`); }
  }
  // автор
  r.pos = authorPosition(work.authors, opt.leader);
  // corresponding author: по разметке OpenAlex; руководитель узнаётся по фамилии или по найденному профилю автора
  if (work.oaAuthors) { const ca = work.oaAuthors.filter(a => a.corr); work.corr = ca.length ? { known: true, leader: ca.some(a => (opt.leaderIds && opt.leaderIds.indexOf(a.id) >= 0) || sameSurname(String(a.name || '').trim().split(/\s+/).pop(), opt.leader)), names: ca.map(a => a.name).filter(Boolean) } : { known: false }; }
  const corr = work.corr; // {known:bool, leader:bool|null}
  if (r.pos.pos === 'first') r.author = ST.ok;
  else if (corr && corr.known && corr.leader === true) { r.author = ST.ok; r.corrLeader = true; }
  else if (r.pos.pos === 'unknown') r.author = ST.unk;
  else if (r.pos.pos === 'none') { r.author = ST.check; r.notesKD.push('фамилия руководителя среди авторов не найдена — проверьте написание фамилии латиницей'); }
  else if (corr && corr.known && corr.leader === false) r.author = ST.no;
  else r.author = ST.check;
  // годится ли для подсчёта «публикаций Q1–Q2 за 5 лет»
  const parts = [r.found, r.year, r.type, r.qual];
  r.counts = parts.includes(ST.no) ? ST.no : (parts.includes(ST.check) || parts.includes(ST.unk) ? ST.check : ST.ok);
  if (r.pos.pos === 'none' && r.counts === ST.ok) r.counts = ST.check;
  // годится ли для Варианта 2
  const p2 = [r.found, r.year, r.type, r.ifSt, r.author];
  r.v2 = p2.includes(ST.no) ? ST.no : (p2.includes(ST.check) || p2.includes(ST.unk) ? ST.check : ST.ok);
  return r;
}

/* ---------- итог по вариантам ----------
   pubs — результаты judgePub; profile — {ok, check, total, source} или null; decl — заявлено в п. 1.6 (число или null) */
function judgeVariants(pubs, profile, decl) {
  const lOk = pubs.filter(p => p.counts === ST.ok).length, lCheck = pubs.filter(p => p.counts === ST.check).length;
  const out = { listOk: lOk, listCheck: lCheck, v: {} };
  const need = { 1: KD.v1pubs, 3: KD.v3pubs, 4: KD.v4pubs };
  const best = Math.max(lOk, profile ? profile.ok : 0);
  for (const n of [1, 3, 4]) {
    const N = need[n]; let st, why;
    if (best >= N) { st = ST.ok; why = `подтверждено ${best} при требуемых ${N}` + (lOk >= N ? ' (по списку из заявки)' : ` (по профилю автора: ${profile.source})`); }
    else if (profile) { st = ST.check; const pot = profile.ok + profile.check; why = `по профилю автора (${profile.source}) подтверждено ${profile.ok}` + (profile.check ? `, ещё ${profile.check} под вопросом` : '') + `, по списку из заявки — ${lOk}; требуется ${N}. Открытые базы бывают неполными — проверьте вручную` + (pot < N ? ' (найдено меньше требуемого)' : ''); }
    else { st = ST.check; why = `по списку из заявки подтверждено ${lOk}` + (lCheck ? `, ещё ${lCheck} под вопросом` : '') + ` при требуемых ${N}; в списке п. 2.3 не более 10 публикаций, и они не обязаны быть за 5 лет — профиль автора в открытой базе не найден`; }
    if (decl != null && decl < N) why += `; в п. 1.6 заявлено ${decl} — меньше требуемых ${N}`;
    out.v[n] = { st, why, need: N };
  }
  out.v[1].extra = 'Индекс Хирша (без самоцитирования) в открытых базах не проверяется — сверьте в профиле автора Scopus, WoS или РИНЦ.';
  out.v[3].extra = 'Завершённый проект от 20 млн руб. проверяется по подтверждающему документу в заявке.';
  out.v[4].extra = 'Возраст и бюджет проверяет утилита «Проверка заявок 2.1».';
  // Вариант 2
  const c2 = pubs.filter(p => p.v2 === ST.ok), m2 = pubs.filter(p => p.v2 === ST.check);
  const num = p => '№ ' + (p.entry.num || pubs.indexOf(p) + 1);
  if (c2.length) out.v[2] = { st: ST.ok, why: `есть статья (${c2.map(num).join(', ')}) в издании с показателем не ниже ${KD.ifHigh} по SCImago, руководитель — первый (corresponding) автор` };
  else if (m2.length) out.v[2] = { st: ST.check, why: `возможные статьи: ${m2.map(num).join(', ')} — по каждой указано, что проверить` };
  else if (!pubs.length) out.v[2] = { st: ST.unk, why: 'список публикаций пуст' };
  else out.v[2] = { st: ST.no, why: `в списке нет статьи за 5 лет в издании с показателем от ${KD.ifLow} и выше, где руководитель — первый (corresponding) автор` };
  if (profile && profile.v2 && profile.v2.length && out.v[2].st !== ST.ok) { out.v[2].st = ST.check; out.v[2].why += `; среди всех статей автора за период есть ${profile.v2.length} в изданиях с показателем от ${KD.ifLow}, где он первый или corresponding автор — см. список всех публикаций`; }
  out.v[2].extra = `Показатель SCImago считается по Scopus и не равен импакт-фактору WoS; порог КД — ${KD.v2if}.`;
  if (decl != null) {
    out.decl = decl;
    if (profile) out.declNote = profile.ok >= decl ? `заявленное число ${decl} подтверждается профилем автора (найдено ${profile.ok})` : `заявлено ${decl}, в профиле автора (${profile.source}) подтверждено ${profile.ok}` + (profile.check ? ` и ещё ${profile.check} под вопросом` : '') + ' — проверьте';
    else out.declNote = `заявлено ${decl}; по списку подтверждено ${lOk} — полную сверку даёт только профиль автора (ORCID)`;
  }
  return out;
}

/* ---------- сведения об авторе, введённые человеком ----------
   Разбирает строку вида «ResearcherID / Scopus ID / ORCID» или ФИО; значения узнаются по виду, а не по порядку. */
function orcidValid(o) { const d = String(o).replace(/-/g, ''); if (!/^\d{15}[\dX]$/.test(d)) return false; let t = 0; for (let i = 0; i < 15; i++) t = (t + +d[i]) * 2; const c = (12 - t % 11) % 11; return (c === 10 ? 'X' : String(c)) === d[15]; }
function parseAuthorInput(text) {
  let t = String(text || '').replace(/[‐-―−]/g, '-'); const o = { orcid: '', orcidBad: '', scopus: '', rid: '', spin: '', rinc: '', name: '' };
  const cut = m => { t = t.replace(m, ' '); };
  // РИНЦ AuthorID — только число сразу после подписи, иначе его не отличить от других чисел
  let m = t.match(/(?:Author\s*ID|РИНЦ)\s*[:№]?\s*(\d{3,8})(?![\d-])/i); if (m) { o.rinc = m[1]; cut(m[0]); }
  m = t.toUpperCase().match(/\d{4}-\d{4}-\d{4}-\d{3}[\dX]/); if (m) { if (orcidValid(m[0])) o.orcid = m[0]; else o.orcidBad = m[0]; t = t.replace(new RegExp(m[0], 'i'), ' '); }
  t = t.replace(/Web\s*of\s*Science|Researcher\s*ID|WoS/gi, ' ');  // подпись бывает приклеена к значению: «ResearcherIDF-1234-2016»
  m = t.match(/(?<![A-Za-z])[A-Z]{1,3}-\d{4}-\d{4}(?![\d-])/); if (m) { o.rid = m[0]; cut(m[0]); }
  m = t.match(/(?<![\d-])\d{4}-\d{4}(?![\d-])/); if (m) { o.spin = m[0]; cut(m[0]); }   // SPIN-код РИНЦ
  m = t.match(/(?<!\d)\d{10,11}(?!\d)/); if (m) { o.scopus = m[0]; cut(m[0]); }
  t = t.replace(/https?:\/\/\S+/g, ' ').replace(/Scopus\s*ID|Scopus|SPIN-код\s*автора|SPIN-код|SPIN|Author\s*ID|ORCID|РИНЦ|AuthorID|при наличии/gi, ' ').replace(/(?<![A-Za-z])ID(?![A-Za-z])/g, ' ').replace(/(^|\s)в(?=\s|$)/g, ' ')
    .replace(/[0-9\/\\:;|()\[\]«»"]+/g, ' ').replace(/\s+/g, ' ').replace(/^[\s,.-]+|[\s,-]+$/g, '');
  if (/[a-zа-яё]{2}/i.test(t)) o.name = t;
  return o;
}

/* ---------- ФИО ----------
   Возвращает варианты прочтения: {sur, given, patr, ini}. Кириллица — «Фамилия Имя Отчество» (или «Имя Отчество Фамилия»);
   латиница из двух-трёх слов — оба порядка, первым — более длинное слово как фамилия. */
const isCyr = s => /[а-яё]/i.test(s);
function parseFIO(name) {
  const raw = String(name || '').replace(/,/g, ' ').trim(); if (!raw) return [];
  const toks = raw.split(/\s+/), full = [], ini = [];
  toks.forEach(tk => { if (/^([A-Za-zА-Яа-яЁё]\.?){1,3}$/.test(tk) && (tk.indexOf('.') >= 0 || tk.length <= 2) && !(tk.length >= 2 && !tk.includes('.') && /[a-zа-яё]/.test(tk.slice(1)))) tk.replace(/\./g, '').split('').forEach(c => ini.push(c)); else full.push(tk.replace(/\.$/, '')); });
  if (!full.length) return [];
  if (ini.length) { const sur = full.slice().sort((a, b) => b.length - a.length)[0], given = full.filter(x => x !== sur)[0] || ''; return [{ sur, given, patr: given ? ini[0] : (ini[1] || ''), ini: given ? given[0] : ini[0] }]; }
  const patrLike = w => /(вич|вна|ична|чна|ич|ovich|evich|ovna|evna|ichna)$/i.test(w);
  const mk = (sur, rest) => ({ sur, given: rest[0] || '', patr: rest[1] || '', ini: rest[0] ? rest[0][0] : '' });
  if (full.length === 1) return [mk(full[0], [])];
  if (isCyr(raw)) {
    if (full.length >= 3 && patrLike(full[1]) && !patrLike(full[2])) return [mk(full[2], [full[0], full[1]])];
    if (full.length >= 3) return [mk(full[0], full.slice(1))];
    return [mk(full[0], [full[1]]), mk(full[1], [full[0]])];
  }
  const a = mk(full[full.length - 1], full.slice(0, -1)), b = mk(full[0], full.slice(1));
  return a.sur.length >= b.sur.length ? [a, b] : [b, a];
}
/* Совпадает ли имя кандидата (как в базе: «Anna V. Sokolova») с прочтением ФИО.
   Фамилия — строго (с учётом разных транслитераций); имя — полностью, если оно есть с обеих сторон, иначе по первой букве. */
function nameMatch(candName, f) {
  const tk = String(candName || '').replace(/[.,]/g, ' ').split(/\s+/).filter(Boolean); if (!tk.length || !f || !f.sur) return false;
  const cs = canonName(f.sur); if (!cs) return false;
  for (const si of [tk.length - 1, 0]) {
    if (canonName(tk[si]) !== cs) continue;
    const rest = tk.filter((_, i) => i !== si); if (!rest.length) return true;
    const g = rest[0], gc = canonName(g);
    if (f.given && g.length >= 2) { const fc = canonName(f.given); if (gc === fc) return true; continue; }
    const fi = f.given ? canonName(f.given)[0] : (f.ini ? canonName(f.ini)[0] : ''); if (!fi) return true;
    if (gc[0] === fi) return true;
  }
  return false;
}
/* Варианты написания кириллического слова латиницей — для поиска в базах */
function translitVariants(w) {
  if (!isCyr(w)) return [w];
  const base = translit(w.toLowerCase()), cap = s => s.charAt(0).toUpperCase() + s.slice(1), out = new Set([base]);
  const alts = [[/kh/g, 'h'], [/yu/g, 'iu'], [/ya/g, 'ia'], [/shch/g, 'sch'], [/ts/g, 'tc'], [/iy$|yy$/g, 'y'], [/iy$/g, 'ii'], [/zh/g, 'j'], [/(^|[aeiou])e/g, '$1ye']];
  alts.forEach(([re, to]) => { const v = base.replace(re, to); if (v !== base) out.add(v); });
  return [...out].map(cap);
}

/* ---------- профиль автора ----------
   Кто из авторов найденных статей — руководитель. pubs — результаты judgePub (нужны work.oaAuthors).
   Если фамилия задана — все профили OpenAlex с этой фамилией; если нет — автор, общий для большинства статей. */
function detectLeader(works, variants) {
  const tally = new Map(); let n = 0;
  for (const w of works) { if (!w || !w.oaAuthors) continue; n++; const seen = new Set(); for (const a of w.oaAuthors) { if (!a.id || seen.has(a.id)) continue; seen.add(a.id); const t = tally.get(a.id) || { id: a.id, name: a.name, orcid: a.orcid || '', count: 0 }; t.count++; if (a.orcid) t.orcid = a.orcid; tally.set(a.id, t); } }
  const all = [...tally.values()].sort((a, b) => b.count - a.count);
  const sur = a => String(a.name || '').trim().split(/\s+/).pop();
  if (variants.length) { const c = all.filter(a => sameSurname(sur(a), variants)); return { works: n, cands: c, chosen: c, how: 'surname' }; }
  if (!all.length) return { works: n, cands: [], chosen: [], how: 'none' };
  const top = all[0], tie = all.filter(a => a.count === top.count);
  if (n >= 2 && top.count >= Math.max(2, Math.ceil(n * 0.6))) {
    // один и тот же человек может быть разбит в базе на несколько профилей — берём все профили с той же фамилией
    const same = tie.filter(a => sameSurname(sur(a), [canonName(sur(top))]));
    if (same.length === tie.length) { const v = [canonName(sur(top))]; return { works: n, cands: all.slice(0, 6), chosen: all.filter(a => sameSurname(sur(a), v)), how: 'auto', surname: sur(top) }; }
  }
  return { works: n, cands: all.slice(0, 6), chosen: [], how: 'unclear' };
}
/* Оценка статьи из профиля автора. ids — профили руководителя в OpenAlex (для места среди авторов) */
function judgeProfileWork(w, ids) { const r = judgeProfileWork0(w); r.ifSt = r.jv.ifSt;
  if (w.authors && w.authors.length && ids && ids.length) { const i = w.authors.findIndex(a => ids.indexOf(a.id) >= 0); r.first = i === 0; r.corr = w.authors.some(a => a.corr && ids.indexOf(a.id) >= 0); r.corrKnown = w.authors.some(a => a.corr); r.pos = i < 0 ? '' : (i === 0 ? 'первый' : (i === w.authors.length - 1 ? 'последний' : (i + 1) + '-й') + ' из ' + w.authors.length);
    r.corrSt = corrOf(w.authors, ids); r.corrNames = w.authors.filter(a => a.corr && ids.indexOf(a.id) < 0).map(a => a.name).filter(Boolean); r.me = i >= 0 ? w.authors[i] : null; }
  return r; }
/* Организации автора в статье: названия, распознанные базой, иначе строки из статьи */
const instNames = me => !me ? [] : ((me.inst && me.inst.length) ? me.inst.map(x => x.name) : (me.raw || []));
function judgeProfileWork0(w) { const j = findJournal(w.issns, w.journal); const jv = journalVerdict(j, w.year, null, null); return { w, j, jv, st: jv.qual === ST.ok ? ST.ok : (jv.qual === ST.no ? ST.no : ST.check) }; }

if (typeof module !== 'undefined') module.exports = { instNames, CHANGES, corrOf, orgMatch, orgTokens, findDuplicates, isPreprint, VERSION, KD, ST, ST_NAME, norm, normIssn, lev, loadRef, findJournal, splitEntries, parseEntry, titleScore, canonName, leaderVariants, sameSurname, authorPosition, journalVerdict, sjAt, detectLeader, parseAuthorInput, orcidValid, wlAt, passFilter, parseFIO, nameMatch, translitVariants, judgePub, judgeVariants, judgeProfileWork, cleanDoi, fmtNum, fmtIssn };

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

/* ===== Распознавание снимка списка (Tesseract внутри страницы, сеть не используется) ===== */
let _ocr = null;
function embedded(id) { const el = document.getElementById(id); if (!el) return null; const bin = atob(el.textContent.trim()); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }
/* Две сборки: одна страница со всем внутри (распознавание встроено) и сайт (файлы распознавания в папке ocr/, загружаются при первом снимке и кешируются браузером) */
const SITE_OCR = () => typeof window !== 'undefined' && window.PC_SITE === true;
const ocrAvailable = () => SITE_OCR() || (typeof Tesseract !== 'undefined' && !!document.getElementById('ocr-core'));
function loadScript(src) { return new Promise((ok, bad) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => bad(new Error('не загрузился ' + src)); document.head.appendChild(s); }); }
/* Два распознавателя — русский и английский. Смешанная модель путает латиницу с кириллицей («Nature» → «Машге»),
   поэтому каждый фрагмент читается обоими и берётся более уверенный результат. */
async function getOcr() {
  if (_ocr) return _ocr;
  if (SITE_OCR()) {
    const base = new URL('ocr/', location.href).href;
    if (typeof Tesseract === 'undefined') await loadScript(base + 'tesseract.min.js?v=' + VERSION);
    const mk = l => Tesseract.createWorker(l, 1, { workerPath: base + 'worker.min.js', corePath: base, langPath: base.replace(/\/$/, ''), gzip: true, errorHandler: e => console.warn('OCR:', e) });
    _ocr = { eng: await mk('eng'), rus: await mk('rus') };
    return _ocr;
  }
  const dec = new TextDecoder();
  const pre = 'const __L = {rus: "' + document.getElementById('ocr-rus').textContent.trim() + '", eng: "' + document.getElementById('ocr-eng').textContent.trim() + '"};\n' +
    'self.fetch = function (u, o) { const m = String(u && u.url || u).match(/(rus|eng)\\.traineddata/); if (m) { const bin = atob(__L[m[1]]); const a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return Promise.resolve(new Response(a, { status: 200 })); } return Promise.reject(new Error("offline")); };\n';
  const src = pre + dec.decode(embedded('ocr-core')) + '\n;self.TesseractCore = (typeof TesseractCoreWASM !== "undefined") ? TesseractCoreWASM : TesseractCore;\n' + dec.decode(embedded('ocr-worker'));
  const url = URL.createObjectURL(new Blob([src], { type: 'application/javascript' }));
  const mk = l => Tesseract.createWorker(l, 1, { workerPath: url, workerBlobURL: false, langPath: 'https://offline.invalid', cacheMethod: 'none', gzip: true, errorHandler: e => console.warn('OCR:', e) });
  _ocr = { eng: await mk('eng'), rus: await mk('rus') };
  return _ocr;
}
async function readBoth(w, cv, psm) {
  const out = [];
  for (const l of ['eng', 'rus']) { await w[l].setParameters({ tessedit_pageseg_mode: psm }); const { data } = await w[l].recognize(cv); out.push({ text: data.text, conf: data.confidence }); }
  return out[1].conf > out[0].conf + 2 ? out[1] : out[0];
}
/* Снимок увеличивается до ширины не меньше 2400 точек: мелкий текст иначе не читается */
async function toCanvas(blob) {
  const bmp = await createImageBitmap(blob); const k = Math.min(4, Math.max(1, 2400 / bmp.width));
  const cv = document.createElement('canvas'); cv.width = Math.round(bmp.width * k); cv.height = Math.round(bmp.height * k);
  const cx = cv.getContext('2d', { willReadFrequently: true }); cx.fillStyle = '#fff'; cx.fillRect(0, 0, cv.width, cv.height); cx.imageSmoothingQuality = 'high'; cx.drawImage(bmp, 0, 0, cv.width, cv.height);
  return { cv, cx, small: bmp.width < 900 };
}
/* Ищет линии таблицы: длинные непрерывные тёмные отрезки. Возвращает границы строк и столбцов или null. */
function findGrid(cx, W, H) {
  const d = cx.getImageData(0, 0, W, H).data; let T = 205; const dark = (x, y) => { const i = (y * W + x) * 4; return d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11 < T; };
  const group = a => { const g = []; a.forEach(v => { const l = g[g.length - 1]; if (l && v - l[1] <= 3) l[1] = v; else g.push([v, v]); }); return g; };
  const hs = []; for (let y = 0; y < H; y++) { let run = 0, best = 0, gap = 0; for (let x = 0; x < W; x++) { if (dark(x, y)) { run += gap + 1; gap = 0; if (run > best) best = run; } else if (run && gap < 2) gap++; else { run = 0; gap = 0; } } if (best >= W * 0.5) hs.push(y); }
  const hl = group(hs); if (hl.length < 3) return null;
  const top = hl[0][0], bot = hl[hl.length - 1][1], vs = [];
  for (let x = 0; x < W; x++) { let run = 0, best = 0, gap = 0; for (let y = top; y <= bot; y++) { if (dark(x, y)) { run += gap + 1; gap = 0; if (run > best) best = run; } else if (run && gap < 2) gap++; else { run = 0; gap = 0; } } if (best >= (bot - top) * 0.6) vs.push(x); }
  const vl = group(vs); if (vl.length < 2) return null;
  const spans = l => l.slice(0, -1).map((a, i) => [a[1] + 1, l[i + 1][0] - 1]).filter(s => s[1] - s[0] > 12);
  T = 150; return { rows: spans(hl), cols: spans(vl), dark };
}
async function ocrImage(blob) {
  const { cv, cx, small } = await toCanvas(blob); const w = await getOcr(); const g = findGrid(cx, cv.width, cv.height);
  if (g && g.rows.length >= 1 && g.cols.length >= 3) {
    // таблица: каждая ячейка читается отдельно, строка таблицы становится одной строкой текста
    const lines = []; let conf = 0, nc = 0, seq = 0;
    for (const [y0, y1] of g.rows) {
      const cells = [];
      for (const [x0, x1] of g.cols) {
        const m = 4, cw = x1 - x0 - 2 * m, ch = y1 - y0 - 2 * m; if (cw < 6 || ch < 6) { cells.push(''); continue; }
        let ink = 0; for (let y = y0 + m; y < y1 - m; y += 2) for (let x = x0 + m; x < x1 - m; x += 2) if (g.dark(x, y)) ink++;
        if (ink < 8) { cells.push(''); continue; }
        const c = document.createElement('canvas'), pad = 14; c.width = cw + 2 * pad; c.height = ch + 2 * pad; const c2 = c.getContext('2d'); c2.fillStyle = '#fff'; c2.fillRect(0, 0, c.width, c.height); c2.drawImage(cv, x0 + m, y0 + m, cw, ch, pad, pad, cw, ch);
        const data = await readBoth(w, c, '6'); const t = data.text.replace(/-\n(?=[a-zа-яё])/gi, '').replace(/\s+/g, ' ').trim(); cells.push(t); if (t) { conf += data.conf; nc++; }
      }
      const rest = cells.slice(1).filter(Boolean).join(' | '); if (!rest) continue;
      let first = cells[0]; const narrow = g.cols[0][1] - g.cols[0][0] < cv.width * 0.08;
      if (/^\d{1,2}\s*[.)]?$/.test(first)) { seq = parseInt(first); first = seq + '.'; }
      else if (narrow && seq > 0 && !/[a-zа-яё]{2}/i.test(first)) { seq++; first = seq + '.'; } // номер не прочитан — продолжаем нумерацию
      else if (narrow && seq === 0 && lines.length && !/[a-zа-яё]{2}/i.test(first)) { seq = 1; first = '1.'; }
      lines.push((first ? first + ' ' : '') + rest);
    }
    if (lines.length) return { text: lines.join('\n'), conf: nc ? Math.round(conf / nc) : 0, small, table: true };
  }
  const data = await readBoth(w, cv, '3');
  return { text: data.text, conf: Math.round(data.conf), small, table: false };
}

/* Снимок с идентификаторами автора: нужны только латиница и цифры, поэтому читается английской моделью, ячейки таблицы — по отдельности */
async function ocrIds(blob) {
  const { cv, cx } = await toCanvas(blob); const w = await getOcr(); const g = findGrid(cx, cv.width, cv.height); const parts = [];
  const read = async (c, psm) => { await w.eng.setParameters({ tessedit_pageseg_mode: psm }); const { data } = await w.eng.recognize(c); return data.text; };
  if (g && g.rows.length && g.cols.length >= 2) {
    for (const [y0, y1] of g.rows) for (const [x0, x1] of g.cols) {
      const m = 4, cw = x1 - x0 - 2 * m, ch = y1 - y0 - 2 * m; if (cw < 6 || ch < 6) continue;
      const c = document.createElement('canvas'), pad = 14; c.width = cw + 2 * pad; c.height = ch + 2 * pad; const c2 = c.getContext('2d'); c2.fillStyle = '#fff'; c2.fillRect(0, 0, c.width, c.height); c2.drawImage(cv, x0 + m, y0 + m, cw, ch, pad, pad, cw, ch);
      parts.push(await read(c, '6'));
    }
  }
  parts.push(await read(cv, '6')); parts.push(await read(cv, '11'));
  return parts.join('\n');
}

/* ===== Экран ===== */
const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const chip = (st, text) => `<span class="chip ${st}">${esc(text || ST_NAME[st])}</span>`;
let LAST = null, BUSY = false;

async function init() {
  $('ver').textContent = `версия ${VERSION} от ${VERSION_DATE}`;
  $('changes').innerHTML = CHANGES.map(c => `<p><b>${c[0]}</b> <span class="dim">${c[1]}</span></p><ul>${c[2].map(x => '<li>' + esc(x) + '</li>').join('')}</ul>`).join('');
  const btns = ['go', 'ago', 'ggo'];
  try {
    const el = $('ref-data'); let data;
    if (el) data = JSON.parse(el.textContent);
    else { btns.forEach(b => $(b).disabled = true); $('refinfo').textContent = 'Загружаю справочники SCImago и Белого списка (около 8 МБ, один раз — дальше из кеша браузера)…'; const r = await fetch('data/ref.json?v=' + VERSION); if (!r.ok) throw new Error('ответ ' + r.status); data = await r.json(); }
    loadRef(data);
  } catch (e) { $('refinfo').innerHTML = chip('unk', 'справочники не загружены') + ' ' + esc(e.message || e) + '. Обновите страницу.'; return; }
  btns.forEach(b => $(b).disabled = false);
  const now = new Date().getFullYear();
  FLT.grp.yFrom = now - KD.years; FLT.grp.yTo = now - 1;
  $('refinfo').textContent = `Справочники: SCImago за ${REF.sjYears[0]}–${REF.sjYear} годы (${REF.sj.length} изданий), Белый список на ${REF.wlDate} (${REF.wl.length} изданий).`;
  $('file').addEventListener('change', e => addImages([...e.target.files]));
  $('afile').addEventListener('change', e => authorImage([...e.target.files]));
  $('gfile').addEventListener('change', e => groupImage([...e.target.files]));
  document.addEventListener('paste', e => { const im = [...(e.clipboardData ? e.clipboardData.items : [])].filter(i => i.type.startsWith('image/')).map(i => i.getAsFile()); if (!im.length) return; e.preventDefault(); if (document.activeElement === $('author')) authorImage(im); else if (document.activeElement === $('grp')) groupImage(im); else addImages(im); });
  const dz = $('drop'); ['dragover', 'dragenter'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('on'); })); ['dragleave', 'drop'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('on'); }));
  dz.addEventListener('drop', e => addImages([...e.dataTransfer.files].filter(f => f.type.startsWith('image/'))));
  $('go').addEventListener('click', runList); $('ago').addEventListener('click', runAuthor); $('ggo').addEventListener('click', runGroup); $('ping').addEventListener('click', ping); $('self').addEventListener('click', selfCheck); $('copy').addEventListener('click', copyList); $('acopy').addEventListener('click', copyAuthor); $('gcopy').addEventListener('click', copyGroup);
  $('list').addEventListener('input', countEntries); $('author').addEventListener('input', showParsed); $('grp').addEventListener('input', countGroup);
  $('author').addEventListener('keydown', e => { if (e.key === 'Enter') runAuthor(); });
  $('org').addEventListener('change', () => { renderList(); renderAuthor(); renderGroup(); });
  try { $('oaKey').value = localStorage.getItem('pc_oaKey') || ''; $('orcidToken').value = localStorage.getItem('pc_orcidToken') || ''; $('org').value = localStorage.getItem('pc_org') || ''; } catch (e) { }
  if (OA_BUILTIN) { $('oaKey').placeholder = 'встроенный ключ уже подключён — поле можно не заполнять'; }
  if (ORCID_BUILTIN) { $('orcidToken').placeholder = 'встроенный токен уже подключён — поле можно не заполнять'; $('orcidNote').textContent = 'В эту сборку встроен токен ORCID. Своё значение в поле заменит его только в этом браузере.'; }
  $('org').addEventListener('input', () => { try { localStorage.setItem('pc_org', $('org').value); } catch (e) { } });
  if (!ocrAvailable()) { $('drop').innerHTML = 'Распознавание снимков в эту сборку не включено — вставьте список текстом.'; $('afile').style.display = 'none'; $('gfile').style.display = 'none'; }
}
const W = { entries: null, works: [], pubs: [], netDown: '', auto: null, dups: [] };
const newS = () => ({ prof: null, cands: null, orcCands: null, similar: null, msgs: [], parsed: null, orcIds: null });
let AU = newS();
const G = { items: [] };
const stOf = k => k < 0 ? AU : G.items[k].S;
function showParsed() {
  const p = parseAuthorInput($('author').value), c = [];
  if (p.name) c.push('имя: <b>' + esc(p.name) + '</b>'); if (p.orcid) c.push('ORCID: <b>' + p.orcid + '</b>'); if (p.orcidBad) c.push(chip('check', 'ORCID с ошибкой') + ' ' + p.orcidBad + ' — контрольная цифра не сходится, сверьте с источником');
  if (p.scopus) c.push('Scopus ID: <b>' + p.scopus + '</b>'); if (p.rid) c.push('WoS ResearcherID: <b>' + p.rid + '</b>'); if (p.spin) c.push('SPIN-код РИНЦ: <b>' + p.spin + '</b>'); if (p.rinc) c.push('РИНЦ AuthorID: <b>' + p.rinc + '</b>');
  if (p.name) { const f = parseFIO(p.name)[0]; if (f) c.push('фамилия: <b>' + esc(f.sur) + '</b>' + (isCyr(f.sur) ? ' (латиницей: ' + esc(translitVariants(f.sur).slice(0, 3).join(', ')) + '…)' : '')); }
  $('aparsed').innerHTML = c.length ? 'Распознано — ' + c.join('; ') + '.' : '';
}
async function authorImage(files) {
  if (!files.length || BUSY) return; BUSY = true;
  try {
    $('aparsed').textContent = 'Распознаю снимок…'; const text = await ocrIds(files[0]);
    // из снимка берутся только идентификаторы; имя остаётся тем, что введено в поле
    const best = { orcid: '', orcidBad: '', scopus: '', rid: '' };
    for (const part of text.split('\n')) { const q = parseAuthorInput(part.replace(/\s+/g, '')); for (const k of ['orcid', 'scopus', 'rid']) if (!best[k] && q[k]) best[k] = q[k]; if (!best.orcidBad && q.orcidBad) best.orcidBad = q.orcidBad; }
    const name = parseAuthorInput($('author').value).name, ids = [best.rid, best.scopus, best.orcid || best.orcidBad].filter(Boolean);
    if (!ids.length) $('aparsed').textContent = 'На снимке идентификаторы не распознаны — введите их вручную.';
    else { $('author').value = (name ? name + ' ' : '') + ids.join('/'); showParsed(); $('aparsed').innerHTML += ' <b>Сверьте цифры со снимком</b> — распознавание путает похожие знаки.'; }
  } catch (e) { $('aparsed').textContent = 'Снимок не распознан: ' + (e.message || e); }
  BUSY = false;
}
function countEntries() { const n = splitEntries($('list').value).length; $('cnt').textContent = n ? `Публикаций в списке: ${n}. Каждая должна начинаться с номера («1.») или отделяться пустой строкой.` : ''; }
async function addImages(files) {
  if (!files.length || BUSY) return; BUSY = true;
  try {
    for (let i = 0; i < files.length; i++) {
      $('ocrmsg').textContent = `Распознаю снимок ${i + 1} из ${files.length}… (первый раз — до минуты)`;
      const r = await ocrImage(files[i]);
      $('list').value = ($('list').value.trim() ? $('list').value.trim() + '\n' : '') + r.text.trim() + '\n';
      $('ocrmsg').innerHTML = `Снимок распознан${r.table ? ' как таблица' : ''} (уверенность ${r.conf} %). <b>Сверьте текст со снимком и поправьте ошибки</b> — особенно названия статей, годы и DOI.` + (r.small ? ' Снимок мелкий: лучше сделать его крупнее или вставить текст.' : '');
    }
  } catch (e) { $('ocrmsg').textContent = 'Снимок не распознан: ' + (e.message || e) + '. Вставьте список текстом.'; }
  BUSY = false; countEntries();
}
const PING_NAMES = ['Crossref (поиск статей)', 'Сайт Белого списка (свежие уровни изданий)', 'Реестр ORCID (поиск автора по Scopus ID, ResearcherID и имени)', 'OpenAlex (тип статьи, corresponding author, профиль автора)'];
async function ping() {
  if ($('ping').disabled) return; $('ping').disabled = true; applyNet();
  const rows = PING_NAMES.map(n => ({ name: n, wait: true }));
  const draw = () => { $('pingres').innerHTML = rows.map(x => x.wait ? `${chip('n', 'проверяю…')} ${esc(x.name)}` : `${chip(x.ok ? 'ok' : 'unk', x.ok ? 'отвечает' : 'не отвечает')} ${esc(x.name)}${x.ok ? `, ${x.ms} мс` : ' — ' + esc(x.msg)}`).join('<br>'); };
  draw();
  const r = await pingAll((i, x) => { rows[i] = x; draw(); });
  draw(); $('ping').disabled = false;
  $('pingres').innerHTML += (r[0].ok ? '' : '<br>Без Crossref проверка статей невозможна. Проверьте интернет, VPN или прокси; если сайт закрыт в вашей сети — сообщите об этом.') + (r[0].ok && !r[3].ok ? '<br>Без OpenAlex утилита работает, но не знает corresponding author и организации, не отличает обзор от статьи; профиль автора берётся из Crossref (неполный).' : '') + (!r[1].ok ? '<br>Сайт Белого списка не отвечает — уровни берутся из справочника внутри страницы.' : '');
}
function applyNet() { NET.useORCID = $('useORCID').checked; NET.orcidOff = ''; NET.orcidToken = $('orcidToken').value.trim() || ORCID_BUILTIN; try { localStorage.setItem('pc_orcidToken', $('orcidToken').value.trim()); } catch (e) { } NET.useOA = $('useOA').checked; NET.oaOff = ''; NET.useWL = $('useWL').checked; NET.wlOff = ''; NET.wlCache.clear(); NET.oaKey = $('oaKey').value.trim() || OA_BUILTIN; try { localStorage.setItem('pc_oaKey', $('oaKey').value.trim()); } catch (e) { } }

const auIds = () => AU.prof && !AU.prof.err ? AU.prof.ids : [];
function curOpt() { return { leader: [], leaderIds: auIds(), yearFrom: -1e9, yearTo: 1e9 }; }
function rejudge() { const opt = curOpt(); W.opt = opt; W.pubs = W.entries.map((e, i) => { const p = judgePub(e, W.works[i], opt); if (W.works[i] === undefined) p.notes = ['запрос не выполнен: ' + W.netDown]; return p; }); W.dups = findDuplicates(W.pubs); }
function renderAll() { renderList(); renderAuthor(); renderGroup(); }

/* ----- Режим 1: список публикаций ----- */
async function runList() {
  if (BUSY) return;
  const entries = splitEntries($('list').value);
  if (!entries.length) { $('status').textContent = 'Список пуст: вставьте текст или снимок.'; return; }
  BUSY = true; $('go').disabled = true; applyNet(); NET.log = [];
  const works = []; let netDown = '';
  for (let i = 0; i < entries.length; i++) {
    $('status').textContent = `Ищу публикацию ${i + 1} из ${entries.length}…`;
    let work;
    if (netDown) work = undefined;
    else { try { work = await findWork(entries[i]); if (work && (work.via === 'doi' || work.score >= 0.6)) { if (work.doi) await enrichOA(work, []); await enrichWL(work); } } catch (e) { work = undefined; netDown = e.message; } }
    works.push(work); await sleep(NET.pause);
  }
  W.entries = entries; W.works = works; W.netDown = netDown; W.auto = null; W.numbered = entries.some(e => e.num != null);
  // если автор ещё не выбран, а у статей списка есть общий автор — показать его публикации сразу
  if (!netDown && !AU.prof && !$('author').value.trim()) { const det = detectLeader(works, []); if (det.how === 'auto') { W.auto = det.chosen[0].name; AU = newS(); await loadProfile(AU, det.chosen.map(a => a.id), 'общий автор статей из списка — проверьте, что это нужный человек'); await fetchOrcidIds(AU); } }
  rejudge(); renderAll(); BUSY = false; $('go').disabled = false;
  $('status').textContent = netDown ? 'Поиск неполный: ' + netDown + '. Нажмите «Проверить связь».' : 'Готово.';
}
const nchip = t => `<span class="chip n">${esc(t)}</span>`;
const qChip = q => q ? nchip('Q' + q) : chip('unk', 'нет квартиля');
const lnk = (u, t) => `<a target="_blank" rel="noopener" href="${esc(u)}">${esc(t || u)}</a>`;
/* Номер записи: из списка; если список нумерованный, а у записи номера нет — прочерк */
const numOf = (e, i) => e.num != null ? e.num : (W.numbered ? '—' : i + 1);

/* ----- Квартиль и Белый список на год публикации, рядом текущее ----- */
function quartText(jv, sj, short) {
  if (!sj) return chip('unk', 'нет в SCImago');
  let h = `${qChip(jv.qY)} <span class="dim">${jv.sjYear}${jv.sjExact ? '' : ' (за год публикации данных нет)'}</span>`;
  if (jv.yL !== jv.sjYear && jv.qL !== jv.qY) h += `<br>${chip('check', 'сейчас ' + (jv.qL ? 'Q' + jv.qL : 'без квартиля'))} <span class="dim">${jv.yL}</span>`;
  if (!short) h += `<br><span class="dim">${esc(jv.hist)}</span>`;
  return h + ` <span class="dim">${lnk(`https://www.scimagojr.com/journalsearch.php?q=${sj.sid}&tip=sid`, 'SCImago')}</span>`;
}
function wlText(wl, year, short) {
  if (!wl) return nchip('нет в списке');
  const a = wlAt(wl, year); let h;
  if (a.excluded) h = chip('check', 'исключён ' + wl.disc);
  else if (a.ambiguous) h = chip('check', (a.lv ? 'уровень ' + a.lv : 'без уровня') + ', исключён в год публикации');
  else h = nchip(a.lv ? 'уровень ' + a.lv : 'без уровня') + (a.y ? ` <span class="dim">${a.y}${a.exact ? '' : ' (более ранних данных нет)'}</span>` : '');
  if (!a.excluded && (a.curExcl || a.cur !== a.lv)) h += `<br>${chip('check', a.curExcl ? 'сейчас исключён ' + wl.disc : 'сейчас ' + (a.cur ? 'уровень ' + a.cur : 'без уровня'))}`;
  if (!short) h += '<br><span class="dim">' + Object.entries(wl.levels).filter(x => x[1]).map(x => `${x[0]}: ${x[1]}`).join(', ') + `; справочник от ${REF.wlDate}</span>`;
  return h + ` <span class="dim">${lnk(`https://journalrank.rcsi.science/api/record-sources/${fmtIssn(wl.issns[0] || '')}/level`, 'запись')}</span>`;
}
function wlCell(p) { return wlText(p.j.wl, p.work.year) + (p.jv.wlLive ? `<br><span class="dim">${p.jv.wlDiff ? 'сайт отвечает иначе — см. примечания' : 'сайт подтверждает'}</span>` : ''); }
function ifCell(p) {
  const jv = p.jv; let h = jv.cpd != null ? `<b>${fmtNum(jv.cpd)}</b> <span class="dim">SCImago ${jv.sjYear}</span>` + (jv.yL !== jv.sjYear && jv.cpdLast != null ? `<br><b>${fmtNum(jv.cpdLast)}</b> <span class="dim">SCImago ${jv.yL}</span>` : '') : chip('unk', 'нет в SCImago');
  if (jv.oaCpd != null) h += `<br><b>${fmtNum(jv.oaCpd)}</b> <span class="dim">OpenAlex, сейчас</span>`;
  if (p.declIF != null) h += `<br><b>${fmtNum(p.declIF)}</b> <span class="dim">в списке</span>`;
  return h + '<br><span class="dim">цитирований на документ за 2 года; это не импакт-фактор WoS</span>';
}
/* Corresponding — как отмечено в базе; если не отмечен, никого не подставляем, а справочно даём первого и последнего */
const aName = a => a ? ([a.given, a.family].filter(Boolean).join(' ') || a.name || '') : '';
function corrText(w) {
  const c = w.corr;
  if (!w.oa) return chip('unk', 'нет данных') + ' <span class="dim">(OpenAlex не ответил по этой статье)</span>';
  if (!c || !c.known) return chip('unk', 'в базе не указан');
  return '<b>' + esc(c.names.join(', ') || 'отмечен, имя не указано') + '</b> <span class="dim">по данным OpenAlex</span>';
}
/* Найденный автор в статье из списка: corresponding ли он и от какой организации */
const CORR_T = { yes: 'да', no: 'нет', unk: 'в базе не указан' };
const corrChip = (st, others) => st === 'yes' ? chip('ok', 'да') : (st === 'no' ? chip('n', 'нет') + (others && others.length ? ` <span class="dim">— ${esc(others.join(', '))}</span>` : '') : (st === 'unk' ? chip('unk', 'в базе не указан') : chip('unk', 'нет данных')));
const ORG_T = { yes: 'совпадает', check: 'не уверена — проверьте', no: 'другая организация', unk: 'в базе не указана' };
const ORG_C = { yes: 'ok', check: 'check', no: 'n', unk: 'unk' };
function orgOf(me) { const names = instNames(me), inp = $('org').value.trim(); const m = inp ? orgMatch(names, inp) : { st: names.length ? null : 'unk' }; return { names, st: m.st }; }
function orgHtml(o) { return (o.names.length ? esc(o.names.slice(0, 3).join('; ')) : '') + (o.st ? ' ' + chip(ORG_C[o.st], o.names.length || o.st !== 'unk' ? ORG_T[o.st] : 'в базе не указана') : ''); }
function listMe(w) { const ids = auIds(); if (!ids.length || !w.oaAuthors) return null; return { me: w.oaAuthors.find(a => ids.indexOf(a.id) >= 0) || null, corr: corrOf(w.oaAuthors, ids), others: w.oaAuthors.filter(a => a.corr && ids.indexOf(a.id) < 0).map(a => a.name) }; }
function authorsCell(p) {
  const w = p.work, a = w.authors || [], f = aName(a[0]), l = a.length > 1 ? aName(a[a.length - 1]) : '';
  let h = '';
  const m = listMe(w);
  if (m) { const nm = (AU.prof.info[0] || {}).name || 'найденный автор'; h += `<span class="dim">${esc(nm)} — corresponding:</span> ${m.me ? corrChip(m.corr, []) : chip('check', 'автора нет среди авторов статьи в OpenAlex')}`; if (m.me) h += `<br><span class="dim">организация:</span> ${orgHtml(orgOf(m.me))}`; h += '<br>'; }
  else if (AU.prof && !AU.prof.err && w.oa === undefined) h += `<span class="dim">corresponding найденного автора: </span>${chip('unk', 'нет данных')}<br>`;
  return h + `<span class="dim">corresponding:</span> ${corrText(w)}<br><span class="dim">первый:</span> ${f ? esc(f) : chip('unk', 'нет данных')}` + (l ? `<br><span class="dim">последний:</span> ${esc(l)}` : '') + `<br><span class="dim">всего авторов: ${a.length || '?'}</span>`;
}

/* ----- Фильтры ----- */
const FLT0 = () => ({ q: [], wl: [], yFrom: 0, yTo: 0, corr: [], ifFrom: 0, org: [] });
const FLT = { list: FLT0(), au: FLT0(), grp: FLT0() };
function rowKey(year, j, jv) { if (!j) return { y: year }; const a = j.wl ? wlAt(j.wl, year) : null; return { y: year, qY: j.sj ? (jv.qY || 0) : 0, wl: a ? (a.excluded ? 0 : a.lv) : null, excl: !!(a && a.excluded), cpd: jv && jv.cpd != null ? jv.cpd : null }; }
const profKey = x => Object.assign(rowKey(x.w.year, x.j, x.jv), { corr: x.corrSt || 'unk', org: $('org').value.trim() ? orgOf(x.me).st : null });
function listKey(p) { if (!p.work) return {}; const k = rowKey(p.work.year, p.j, p.jv), m = listMe(p.work); k.corr = m && m.me ? m.corr : 'unk'; k.org = m && m.me && $('org').value.trim() ? orgOf(m.me).st : 'unk'; return k; }
const reFlt = id => id === 'list' ? renderList() : (id === 'au' ? renderAuthor() : renderGroup());
function filterBar(id, shown, total, noCpd) {
  const f = FLT[id], corrOff = id === 'list' && !auIds().length, orgOn = !!$('org').value.trim();
  const cb = (grp, v, t, dis) => `<label class="fl"><input type="checkbox" ${f[grp].indexOf(v) >= 0 ? 'checked' : ''} ${dis ? 'disabled' : ''} onchange="setFlt('${id}','${grp}','${v}',this.checked)"> ${t}</label>`;
  const active = f.q.length || f.wl.length || f.yFrom || f.yTo || f.corr.length || f.ifFrom || f.org.length;
  return `<div class="fbar noprint"><b>Фильтр:</b> квартиль ${['1', '2', '3', '4'].map(v => cb('q', v, 'Q' + v)).join('')}${cb('q', 'none', 'без квартиля')}<span class="sep">или</span> Белый список ${['1', '2', '3', '4'].map(v => cb('wl', v, 'ур. ' + v)).join('')}${cb('wl', 'none', 'нет')}${cb('wl', 'excl', 'исключён')}<br><span class="sep" style="margin-left:0">и</span> годы с <input type="number" class="yr" value="${f.yFrom || ''}" placeholder="все" onchange="setFltY('${id}','yFrom',this.value)"> по <input type="number" class="yr" value="${f.yTo || ''}" placeholder="все" onchange="setFltY('${id}','yTo',this.value)">
  <span class="sep">и</span> автор corresponding: ${cb('corr', 'yes', 'да', corrOff)}${cb('corr', 'no', 'нет', corrOff)}${cb('corr', 'unk', 'в базе не указан', corrOff)}
  <span class="sep">и</span> показатель от <input type="number" step="0.1" min="0" class="yr" value="${f.ifFrom || ''}" placeholder="любой" onchange="setFltY('${id}','ifFrom',this.value)">
  ${orgOn ? `<span class="sep">и</span> организация: ${cb('org', 'yes', 'совпадает')}${cb('org', 'check', 'проверьте')}${cb('org', 'no', 'другая')}${cb('org', 'unk', 'не указана')}` : ''}
  <span class="cnt">показано <b>${shown}</b> из ${total}${f.ifFrom && noCpd ? `; без показателя (нет в SCImago) скрыто ${noCpd}` : ''}</span>${active ? ` <button class="sec small" onclick="resetFlt('${id}')">сбросить</button>` : ''}
  <div class="dim">Квартиль, уровень и показатель — на год публикации; показатель — «цитирований на документ за 2 года» SCImago, это не импакт-фактор WoS. Отмеченные квартили и уровни объединяются через «или» («Q1» + «ур. 1» — статьи, у которых Q1 или 1 уровень); остальные условия добавляются через «и».${corrOff ? ' Фильтр corresponding в этой таблице заработает, когда автор найден (раздел 2).' : ''}</div></div>`;
}
function setFlt(id, grp, v, on) { const a = FLT[id][grp], i = a.indexOf(v); if (on && i < 0) a.push(v); if (!on && i >= 0) a.splice(i, 1); reFlt(id); }
function setFltY(id, k, v) { FLT[id][k] = k === 'ifFrom' ? (parseFloat(String(v).replace(',', '.')) || 0) : (+v || 0); reFlt(id); }
function resetFlt(id) { FLT[id] = FLT0(); reFlt(id); }
const listFlt = () => auIds().length ? FLT.list : Object.assign({}, FLT.list, { corr: [] });
const listRows = () => W.pubs.map((p, i) => ({ p, i })).filter(({ p }) => passFilter(listKey(p), listFlt()));
const noCpdHidden = (keys, f) => f.ifFrom ? keys.filter(k => k.cpd == null && passFilter(k, Object.assign({}, f, { ifFrom: 0 }))).length : 0;

function dupNotes(i) { return (W.dups || []).filter(d => d.a === i || d.b === i).map(d => { const o = d.a === i ? d.b : d.a; return `возможный дубль записи № ${numOf(W.pubs[o].entry, o)}: ${d.why}`; }); }
function renderList() {
  if (!W.entries) { $('outList').innerHTML = ''; return; }
  const pubs = W.pubs, rows = listRows(); let h = `<h2>Публикации из списка (${pubs.length})</h2><p class="dim">Квартиль и уровень Белого списка — на год публикации; если сейчас они другие, это показано рядом.</p>`;
  if (W.dups.length) h += `<p>${chip('check', 'проверьте')} Возможных дублей в списке: <b>${W.dups.length}</b> — ${W.dups.map(d => `№ ${numOf(pubs[d.a].entry, d.a)} и № ${numOf(pubs[d.b].entry, d.b)} (${esc(d.why)})`).join('; ')}. Утилита ничего не исключает — решите сами.</p>`;
  h += filterBar('list', rows.length, pubs.length, noCpdHidden(pubs.map(listKey), listFlt()));
  h += `<table class="t pubs"><tr><th style="width:3%">№</th><th style="width:24%">Публикация</th><th style="width:13%">Издание</th><th style="width:11%">Квартиль</th><th style="width:11%">Белый список</th><th style="width:10%">Показатель</th><th style="width:15%">Авторы</th><th>Примечания</th></tr>`;
  rows.forEach(({ p, i }) => {
    const w = p.work, e = p.entry, notes = p.notes.concat(dupNotes(i));
    const nh = notes.map(n => /^возможный дубль/.test(n) ? chip('check', 'дубль?') + ' ' + esc(n) : esc(n)).join('<br>');
    let c1 = `<span class="dim">${esc(e.raw.length > 200 ? e.raw.slice(0, 200) + '…' : e.raw)}</span><br>`;
    if (!w) { h += `<tr><td>${numOf(e, i)}</td><td>${c1}${chip('unk', p.found === 'no' ? 'не найдена' : 'не проверена')}${p.near ? ` <span class="dim">ближайшая: «${esc(p.near.title)}»</span>` : ''}</td><td colspan="5" class="dim">Статья не найдена в открытой базе — квартиль и остальное по ней не определены.</td><td>${nh}</td></tr>`; return; }
    const url = 'https://doi.org/' + w.doi;
    c1 += `${p.found === 'ok' ? nchip(w.via === 'doi' ? 'найдена по DOI' : 'найдена') : chip('check', 'похожая')} ${lnk(url, w.title)}<br>${nchip(w.year || 'год ?')} ${p.typeName ? nchip(p.typeName) : ''}` + (w.via !== 'doi' ? ` <span class="dim">совпадение названия ${Math.round(w.score * 100)} %</span>` : '') + `<br>${lnk(url)}`;
    const jc = `<b>${esc(w.journal || 'издание не указано')}</b>` + (w.issns.length ? '<br><span class="dim">ISSN ' + w.issns.map(x => esc(fmtIssn(normIssn(x)))).join(', ') + '</span>' : '');
    h += `<tr><td>${numOf(e, i)}</td><td>${c1}</td><td>${jc}</td><td>${quartText(p.jv, p.j.sj)}</td><td>${wlCell(p)}</td><td>${ifCell(p)}</td><td>${authorsCell(p)}</td><td>${nh}</td></tr>`;
  });
  if (!rows.length) h += `<tr><td colspan="8" class="dim">Под фильтр не подходит ни одна статья.</td></tr>`;
  h += `</table><p class="dim">Запросов в интернет: ${NET.log.length}.${NET.oaOff ? ' OpenAlex отключился: ' + esc(NET.oaOff) + '.' : ''}${NET.wlOff ? ' Сайт Белого списка не ответил (' + esc(NET.wlOff) + ') — уровни взяты из справочника от ' + REF.wlDate + '.' : ''}</p>`;
  $('outList').innerHTML = h; $('copy').style.display = '';
}

/* ----- Режим 2: автор. S — состояние поиска одного автора (раздел 2 или строка группы) ----- */
async function loadProfile(S, ids, how, st) {
  if (st) st('Загружаю публикации автора…');
  try { const aw = await authorWorks({ ids }, 0); const js = aw.works.map(w => judgeProfileWork(w, ids)); const info = await authorInfo(ids); S.prof = { aw, js, ids, how, info: info.length ? info : ids.map(id => ({ id, name: id })) }; S.cands = null; }
  catch (e) { S.prof = { err: 'публикации автора не загружены: ' + e.message }; }
}
/* Идентификаторы, привязанные к записи ORCID найденного автора (Scopus ID, ResearcherID) — для блока «Профили автора» */
async function fetchOrcidIds(S) {
  const orcid = (S.parsed && S.parsed.orcid) || (S.prof && !S.prof.err ? (S.prof.info.find(a => a.orcid) || {}).orcid : '');
  if (!orcid) { S.orcIds = null; return; }
  if (S.orcIds && S.orcIds.orcid === orcid) return;
  const r = await orcidExternalIds(orcid); S.orcIds = { orcid, list: r.list, err: r.err };
}
/* ----- Поиск автора: идентификаторы → реестр ORCID → статьи списка → ФИО (латиница и кириллица) ----- */
const fioOK = (name, alt, fios) => fios.some(f => [name].concat(alt || []).some(n => nameMatch(n, f)));
async function byOrcid(S, orcid, how, st) { const a = await authorByOrcid(orcid); if (a) { await loadProfile(S, [a.id], how, st); return a; } S.msgs.push(`ORCID ${orcid} в OpenAlex не найден — у автора нет статей, известных базе, или профиль не связан с ORCID`); return null; }
async function searchAuthor(S, input, st) {
  st = st || (() => { }); const p = parseAuthorInput(input); S.parsed = p;
  const fios = parseFIO(p.name);
  if (!p.orcid && !p.scopus && !p.rid && !fios.length) { S.msgs.push(p.orcidBad ? 'ORCID записан с ошибкой, других сведений нет' : (p.spin || p.rinc ? 'по SPIN-коду и AuthorID РИНЦ в открытых базах поиска нет — добавьте ФИО (можно кириллицей)' : 'укажите ФИО, ORCID, Scopus ID или ResearcherID')); return; }
  let found = null;
  try {
    if (p.orcidBad) S.msgs.push(`ORCID ${p.orcidBad} записан с ошибкой (контрольная цифра не сходится) — по нему не искали`);
    // 1. ORCID — точно
    if (p.orcid) { st('Ищу автора по ORCID…'); found = await byOrcid(S, p.orcid, 'по ORCID ' + p.orcid, st); }
    // 2. Scopus ID в OpenAlex (известен базе лишь у немногих авторов)
    if (!found && p.scopus) { st('Ищу автора по Scopus ID в OpenAlex…'); const r = await authorByScopus(p.scopus); if (r.list.length === 1) { await loadProfile(S, [r.list[0].id], 'по Scopus ID ' + p.scopus + ' (OpenAlex)', st); found = r.list[0]; } else if (r.list.length > 1) S.msgs.push('по Scopus ID в OpenAlex несколько профилей'); }
    // 3. Scopus ID и ResearcherID в реестре ORCID: найден ORCID → точный поиск
    for (const [lab, id] of [['Scopus ID', p.scopus], ['ResearcherID', p.rid]]) {
      if (found || !id) continue; st(`Ищу ${lab} в реестре ORCID…`);
      const r = await orcidSearch(`external-id-reference:"${id}"`);
      if (r.err) { S.msgs.push(`поиск ${lab} в реестре ORCID не выполнен: ${r.err}`); continue; }
      if (r.list.length === 1) found = await byOrcid(S, r.list[0].orcid, `по ${lab} ${id}: реестр ORCID → ORCID ${r.list[0].orcid} → OpenAlex`, st);
      else if (r.list.length > 1) S.msgs.push(`${lab} ${id} привязан в реестре ORCID к нескольким записям — выберите по имени`);
      else S.msgs.push(`${lab} ${id} не привязан ни к одной записи в реестре ORCID`);
    }
    if (p.scopus && !found && !S.msgs.some(m => /Scopus ID/.test(m) && /OpenAlex/.test(m))) S.msgs.push('OpenAlex знает Scopus ID лишь у немногих авторов');
    // 4. ФИО среди авторов статей из списка — точно, если список найден
    if (!found && fios.length && W.entries) {
      const det = detectLeader(W.works, [...new Set(fios.map(f => canonName(f.sur)))]); const ch = det.chosen.filter(a => fioOK(a.name, [], fios));
      if (ch.length) { await loadProfile(S, ch.map(a => a.id), 'по ФИО среди авторов статей из списка', st); found = ch[0]; }
    }
    // 5. ФИО в OpenAlex и реестре ORCID, латиницей и кириллицей
    if (!found && fios.length) { st('Ищу автора по ФИО…'); const pick = await nameSearch(S, fios); if (pick) { await loadProfile(S, [pick.id], pick.how, st); found = pick; } }
    // проверка: идентификатор и введённое ФИО указывают на одного человека
    if (found && S.prof && !S.prof.err && fios.length) { const inf = S.prof.info[0] || {}; if (!fioOK(inf.name || found.name, inf.alt || found.alt, fios)) S.msgs.push(`найден «${inf.name || found.name}», а введено «${p.name}» — проверьте, тот ли это человек`); }
    // другие профили того же человека в OpenAlex (база иногда делит автора на несколько)
    if (S.prof && !S.prof.err) await findSimilar(S);
  } catch (e) { S.msgs.push('поиск не выполнен: ' + e.message); }
  try { await fetchOrcidIds(S); } catch (e) { }
}
async function runAuthor() {
  if (BUSY) return; BUSY = true; $('ago').disabled = true; applyNet(); W.auto = null; AU = newS();
  await searchAuthor(AU, $('author').value, t => { $('astatus').textContent = t; });
  if (W.entries) rejudge();
  BUSY = false; $('ago').disabled = false; $('astatus').textContent = ''; renderAll();
}
/* Поиск по ФИО. Возвращает автора, если он определён однозначно, иначе заполняет S.cands для выбора. */
async function nameSearch(S, fios) {
  const qs = new Set(), oq = new Set();
  for (const f of fios.slice(0, 2)) {
    const surs = translitVariants(f.sur).slice(0, 4), g = f.given ? translitVariants(f.given)[0] : (f.ini ? (isCyr(f.ini) ? translit(f.ini.toLowerCase()).toUpperCase() : f.ini) : '');
    surs.forEach(sv => qs.add((g ? g + ' ' : '') + sv)); if (isCyr(f.sur)) qs.add([f.given, f.sur].filter(Boolean).join(' '));
    oq.add(`family-name:${surs[0]}` + (g && g.length > 1 ? ` AND given-names:${g}` : ''));
  }
  const oa = new Map();
  for (const q of [...qs].slice(0, 6)) { try { (await searchAuthors(q)).forEach(a => { if (!oa.has(a.id)) oa.set(a.id, a); }); } catch (e) { S.msgs.push('поиск в OpenAlex не выполнен: ' + e.message); break; } }
  const strict = [...oa.values()].filter(a => fioOK(a.name, a.alt, fios));
  let orc = []; for (const q of oq) { const r = await orcidSearch(q); if (r.err) { S.msgs.push('поиск по имени в реестре ORCID: ' + r.err); break; } orc = orc.concat(r.list.filter(x => fioOK(x.name, [], fios))); }
  const fullGiven = a => fios.some(f => f.given && [a.name].concat(a.alt || []).some(n => { const t = n.replace(/\./g, ' ').split(/\s+/).filter(Boolean); return t.some(x => x.length > 1 && canonName(x) === canonName(f.given)); }));
  const patr = a => fios.some(f => f.patr && [a.name].concat(a.alt || []).some(n => n.replace(/\./g, ' ').split(/\s+/).some(x => x.length === 1 && canonName(x)[0] === canonName(f.patr)[0])));
  strict.forEach(a => { a.fullGiven = fullGiven(a); a.patr = patr(a); a.inOrcid = !!(a.orcid && orc.some(o => o.orcid === a.orcid)); a.ru = /\bRU\b/.test(a.country || ''); a.score = (a.fullGiven ? 4 : 0) + (a.patr ? 3 : 0) + (a.inOrcid ? 2 : 0) + (a.ru ? 1 : 0) + Math.min(2, Math.log10((a.works || 0) + 1)); });
  strict.sort((a, b) => b.score - a.score);
  const orcOnly = orc.filter(o => !strict.some(a => a.orcid === o.orcid)).filter((o, i, arr) => arr.findIndex(x => x.orcid === o.orcid) === i);
  // однозначно: ровно один кандидат с полным совпадением имени и (отчеством или подтверждением в реестре ORCID)
  const sure = strict.filter(a => a.fullGiven && (a.patr || a.inOrcid));
  if (sure.length === 1 && strict.filter(a => a.fullGiven).length === 1) { sure[0].how = 'по ФИО: единственный подходящий профиль' + (sure[0].patr ? ', совпадает инициал отчества' : '') + (sure[0].inOrcid ? ', подтверждён реестром ORCID' : ''); return sure[0]; }
  S.cands = strict.slice(0, 12); S.orcCands = orcOnly.slice(0, 8);
  if (!strict.length && !orcOnly.length) S.msgs.push(`по ФИО не найдено (искали: ${[...qs].slice(0, 6).join('; ')})`);
  return null;
}
async function findSimilar(S) {
  const inf = S.prof.info[0]; if (!inf) return; const fios = parseFIO(inf.name); let list = [];
  try { list = await searchAuthors(inf.name); } catch (e) { return; }
  S.similar = list.filter(a => S.prof.ids.indexOf(a.id) < 0 && fioOK(a.name, a.alt, fios) && (!a.orcid || !inf.orcid || a.orcid === inf.orcid)).slice(0, 6);
}
async function afterPick(k) { const S = stOf(k); if (S.prof && !S.prof.err) { await findSimilar(S); try { await fetchOrcidIds(S); } catch (e) { } } if (k < 0 && W.entries) rejudge(); BUSY = false; renderAll(); }
async function addProfile(id, k) { k = k == null ? -1 : k; if (BUSY) return; BUSY = true; const S = stOf(k); const ids = S.prof.ids.concat([id]); await loadProfile(S, ids, S.prof.how + '; добавлен профиль ' + id); S.similar = (S.similar || []).filter(a => a.id !== id); if (k < 0 && W.entries) rejudge(); BUSY = false; renderAll(); }
async function pickOrcid(orcid, k) { k = k == null ? -1 : k; if (BUSY) return; BUSY = true; const S = stOf(k); S.msgs = []; await byOrcid(S, orcid, 'выбран вручную: ORCID ' + orcid); await afterPick(k); }
async function pickAuthor(id, k) { k = k == null ? -1 : k; if (BUSY) return; BUSY = true; const S = stOf(k); await loadProfile(S, [id], 'выбран вручную из найденных по имени'); await afterPick(k); }

/* ----- Профили автора: все ссылки, откуда взят идентификатор, расхождения ----- */
const BASES = {
  orcid: { name: 'ORCID', url: v => 'https://orcid.org/' + v },
  scopus: { name: 'Scopus', url: v => 'https://www.scopus.com/authid/detail.uri?authorId=' + v, note: 'откроется при подписке организации или после входа' },
  rid: { name: 'Web of Science (ResearcherID)', url: v => 'https://www.webofscience.com/wos/author/rid/' + v, note: 'нужен доступ к Web of Science' },
  rinc: { name: 'eLibrary (РИНЦ AuthorID)', url: v => 'https://elibrary.ru/author_profile.asp?authorid=' + v },
  spin: { name: 'eLibrary (SPIN-код)', url: () => 'https://elibrary.ru/authors.asp', note: 'прямой ссылки по SPIN-коду нет — поиск в разделе «Авторы»' },
  openalex: { name: 'OpenAlex', url: v => 'https://openalex.org/' + v },
};
function profileLinks(S) {
  const ids = [], add = (b, v, src) => { v = String(v || '').trim(); if (!v) return; if (b === 'rid' || b === 'orcid') v = v.toUpperCase(); const o = ids.find(x => x.b === b && x.v === v); if (o) { if (o.src.indexOf(src) < 0) o.src.push(src); } else ids.push({ b, v, src: [src] }); };
  const p = S.parsed || {};
  add('orcid', p.orcid, 'из заявки'); add('scopus', p.scopus, 'из заявки'); add('rid', p.rid, 'из заявки'); add('rinc', p.rinc, 'из заявки'); add('spin', p.spin, 'из заявки');
  const prof = S.prof && !S.prof.err ? S.prof : null;
  if (prof) prof.info.forEach(a => { add('orcid', a.orcid, 'из OpenAlex'); add('scopus', a.scopus, 'из OpenAlex'); add('openalex', a.id, 'из OpenAlex'); });
  if (S.orcIds) S.orcIds.list.forEach(x => { const t = x.type.toLowerCase(); if (/scopus/.test(t)) add('scopus', x.value, 'из ORCID'); else if (/researcher\s*id|researcherid|wos|web of science/.test(t)) add('rid', x.value, 'из ORCID'); else if (/elibrary|rinc|ринц/.test(t)) add('rinc', x.value, 'из ORCID'); });
  const order = ['orcid', 'scopus', 'rid', 'rinc', 'spin', 'openalex']; ids.sort((a, b) => order.indexOf(a.b) - order.indexOf(b.b));
  const warns = [];
  for (const b of ['orcid', 'scopus', 'rid', 'rinc']) { const vs = ids.filter(x => x.b === b); if (vs.length > 1) warns.push(`${BASES[b].name}: идентификаторы различаются — ${vs.map(x => x.v + ' (' + x.src.join(', ') + ')').join(' и ')}. У автора бывает несколько профилей, но проверьте`); }
  // ссылки-поиски по имени
  const lat = prof && prof.info[0] && prof.info[0].name && !/^A\d+$/.test(prof.info[0].name) ? prof.info[0].name : (p.name && !isCyr(p.name) ? p.name : (p.name ? (() => { const f = parseFIO(p.name)[0]; return f ? [f.given ? translitVariants(f.given)[0] : '', translitVariants(f.sur)[0]].filter(Boolean).join(' ') : ''; })() : ''));
  const cyr = p.name && isCyr(p.name) ? p.name : '';
  const e = encodeURIComponent, sr = [];
  if (lat) {
    sr.push({ b: 'Google Scholar', u: 'https://scholar.google.com/citations?view_op=search_authors&mauthors=' + e(lat), q: lat });
    sr.push({ b: 'ResearchGate', u: 'https://www.researchgate.net/search/researcher?q=' + e(lat), q: lat });
    sr.push({ b: 'Semantic Scholar', u: 'https://www.semanticscholar.org/search?q=' + e(lat), q: lat });
    if (!ids.some(x => x.b === 'orcid')) sr.push({ b: 'ORCID', u: 'https://orcid.org/orcid-search/search?searchQuery=' + e(lat), q: lat });
    if (!ids.some(x => x.b === 'scopus')) sr.push({ b: 'Scopus', u: 'https://www.scopus.com/freelookup/form/author.uri', q: lat, manual: true });
    if (!ids.some(x => x.b === 'rid')) sr.push({ b: 'Web of Science', u: 'https://www.webofscience.com/wos/author/search', q: lat, manual: true });
  }
  if ((cyr || lat) && !ids.some(x => x.b === 'rinc')) sr.push({ b: 'eLibrary', u: 'https://elibrary.ru/authors.asp', q: cyr || lat, manual: true });
  return { ids, warns, sr, orcErr: S.orcIds && S.orcIds.err ? S.orcIds.err : '' };
}
function profileLinksHtml(S, k) {
  const L = profileLinks(S); if (!L.ids.length && !L.sr.length) return '';
  let h = `<div class="plinks"><b>Профили автора</b>`;
  if (L.warns.length) h += `<p>${chip('check', 'проверьте')} ${L.warns.map(esc).join('; ')}.</p>`;
  if (L.ids.length) h += '<table class="t"><tr><th style="width:24%">База</th><th style="width:22%">Идентификатор</th><th style="width:18%">Откуда взят</th><th>Ссылка</th></tr>' + L.ids.map(x => { const B = BASES[x.b]; return `<tr><td>${esc(B.name)}</td><td>${esc(x.v)}</td><td class="dim">${esc(x.src.join(', '))}</td><td>${lnk(B.url(x.v))}${B.note ? ' <span class="dim">— ' + esc(B.note) + '</span>' : ''}</td></tr>`; }).join('') + '</table>';
  if (L.sr.length) h += `<p class="dim" style="margin-bottom:0">Поиск по имени (это не точный профиль — найдите нужного человека сами): ${L.sr.map(x => lnk(x.u, x.b) + (x.manual ? ' (форма поиска, ввести «' + esc(x.q) + '»)' : '')).join(' · ')}</p>`;
  if (L.orcErr) h += `<p class="dim" style="margin-bottom:0">Идентификаторы из записи ORCID не получены: ${esc(L.orcErr)}.</p>`;
  return h + ` <p style="margin:6px 0 0"><button class="sec small" onclick="copyLinks(${k})">Скопировать ссылки</button></p></div>`;
}
function copyLinks(k) {
  const S = stOf(k), L = profileLinks(S), out = [];
  L.ids.forEach(x => out.push(tsvRow([BASES[x.b].name, x.v, x.src.join(', '), BASES[x.b].url(x.v)])));
  L.sr.forEach(x => out.push(tsvRow([x.b + ' — поиск по имени', x.q, '', x.u])));
  if (L.warns.length) out.push(tsvRow(['Проверьте', L.warns.join('; ')]));
  toClip(out.join('\n'), k < 0 ? 'astatus' : 'gstatus');
}

const wLink = w => w.doi ? 'https://doi.org/' + w.doi : (w.oaId ? 'https://openalex.org/' + w.oaId : '');
const profRows = (S, fid) => S.prof.js.filter(x => passFilter(profKey(x), FLT[fid]));
function aRows() { return profRows(AU, 'au'); }
/* Тело раздела об одном авторе: сообщения, профили, выбор кандидата, таблица публикаций */
function authorBody(S, k, fid, withFilter) {
  const prof = S.prof, kk = k < 0 ? '' : ',' + k; let h = '';
  if (S.msgs.length) h += `<p>${chip('check', 'обратите внимание')} ${S.msgs.map(esc).join('; ')}.</p>`;
  h += profileLinksHtml(S, k);
  if (prof && prof.err) h += `<p>${chip('unk', 'не загружено')} ${esc(prof.err)}</p>`;
  else if (prof) {
    h += `<p>${prof.info.map(a => `<b>${esc(a.name)}</b>${a.inst ? ', ' + esc(a.inst) : ''}${a.works != null ? ', работ в базе: ' + a.works : ''}${a.h != null ? ', индекс Хирша по OpenAlex: ' + a.h : ''}`).join('<br>')}</p>`;
    h += `<p class="dim">Как найден: ${esc(prof.how)}.${prof.info.length > 1 ? ' В базе несколько профилей с этой фамилией — публикации собраны со всех; проверьте, что это один человек.' : ''} Профиль собран базой автоматически: возможны чужие статьи и пропуски. Индекс Хирша OpenAlex считается по своей базе и с самоцитированием — с WoS, Scopus и РИНЦ он не совпадает.</p>`;
    const all = prof.js, rows = profRows(S, fid), cnt = q => rows.filter(x => x.j.sj && x.jv.qY === q).length, wl1 = rows.filter(x => rowKey(x.w.year, x.j, x.jv).wl === 1).length, cy = rows.filter(x => x.corrSt === 'yes').length;
    h += `<p>Источник — ${prof.aw.source}. Статей и обзоров за все годы: <b>${all.length}</b>.` + (prof.aw.capped ? ' Показаны первые 2000 — список обрезан.' : '') + '</p>';
    if (k < 0 && W.entries) { const miss = W.pubs.filter(p => p.work && p.work.doi && TYPE_OK[p.work.type] && !all.some(x => x.w.doi === p.work.doi)); if (miss.length) h += `<p>${chip('check', 'проверьте')} В профиле автора нет ${miss.length} из найденных статей списка (№ ${miss.map(p => numOf(p.entry, W.pubs.indexOf(p))).join(', ')}): профиль в базе неполный либо это другой автор.</p>`; }
    if (withFilter) h += filterBar(fid, rows.length, all.length, noCpdHidden(all.map(profKey), FLT[fid]));
    h += `<p>${withFilter ? 'Среди показанных' : 'По фильтру группы'} — по квартилю SCImago на год публикации: Q1 — <b>${cnt(1)}</b>, Q2 — <b>${cnt(2)}</b>, Q3 — ${cnt(3)}, Q4 — ${cnt(4)}, без квартиля или не в SCImago — ${rows.filter(x => !x.j.sj || !x.jv.qY).length}. 1 уровень Белого списка на год публикации: <b>${wl1}</b>. Автор — corresponding: <b>${cy}</b>.</p>`;
    const listed = new Set(W.entries ? W.pubs.filter(p => p.work).map(p => p.work.doi) : []), orgOn = !!$('org').value.trim();
    if (!all.length) h += '<p class="dim">Статей нет. Это не значит, что их нет вообще: профиль в базе может быть пустым.</p>';
    else if (!rows.length) h += '<p class="dim">Под фильтр не подходит ни одна статья.</p>';
    else h += `<table class="t"><tr><th style="width:5%">Год</th><th>Статья и ссылка</th><th style="width:14%">Издание</th><th style="width:11%">Квартиль</th><th style="width:11%">Белый список</th><th style="width:6%">Показатель</th><th style="width:9%">Место автора</th><th style="width:10%">Corresponding</th><th style="width:13%">Организация${orgOn ? ' (сверка с заявкой)' : ''}</th></tr>` + rows.map(x => {
      const url = wLink(x.w);
      return `<tr><td>${x.w.year || ''}</td><td>${esc(x.w.title)}${k < 0 && listed.has(x.w.doi) && x.w.doi ? ' ' + nchip('в списке') : ''}${x.w.type === 'review' ? ' <span class="dim">обзор</span>' : ''}<br>${url ? lnk(url) : chip('unk', 'ссылки нет')}</td><td>${esc(x.w.journal)}</td><td>${quartText(x.jv, x.j.sj, true)}</td><td>${wlText(x.j.wl, x.w.year, true)}</td><td>${x.jv.cpd != null ? fmtNum(x.jv.cpd) : ''}</td><td class="dim">${esc(x.pos || '')}</td><td>${corrChip(x.corrSt, x.corrNames)}</td><td class="dim">${orgHtml(orgOf(x.me))}</td></tr>`;
    }).join('') + '</table>';
  } else if (S.cands || S.orcCands) {
    const c = S.cands || [], o = S.orcCands || [];
    if (c.length || o.length) {
      h += `<p>${chip('check', 'выберите')} По ФИО однозначно определить автора нельзя — выберите нужного. Сверху — лучше совпавшие: имя полностью, инициал отчества, запись в реестре ORCID.</p>`;
      if (c.length) h += `<table class="t"><tr><th>Имя в OpenAlex</th><th style="width:26%">Организация</th><th style="width:15%">ORCID</th><th style="width:6%">Работ</th><th style="width:5%">Хирш</th><th style="width:16%">Совпадения</th><th style="width:15%"></th></tr>` + c.map(a => `<tr><td>${esc(a.name)}</td><td>${esc(a.inst)}</td><td>${a.orcid ? lnk('https://orcid.org/' + a.orcid, a.orcid) : ''}</td><td>${a.works}</td><td>${a.h != null ? a.h : ''}</td><td>${[a.fullGiven && nchip('имя'), a.patr && nchip('отчество'), a.inOrcid && nchip('в ORCID'), a.ru && nchip('Россия')].filter(Boolean).join(' ')}</td><td><button class="sec" onclick="pickAuthor('${a.id}'${kk})">Это он</button> ${lnk('https://openalex.org/' + a.id, 'профиль')}</td></tr>`).join('') + '</table>';
      if (o.length) h += `<p class="dim">Найдены в реестре ORCID (в OpenAlex по имени не нашлись):</p><table class="t"><tr><th>Имя в ORCID</th><th style="width:36%">Организации</th><th style="width:18%">ORCID</th><th style="width:15%"></th></tr>` + o.map(a => `<tr><td>${esc(a.name)}</td><td>${esc(a.inst)}</td><td>${lnk('https://orcid.org/' + a.orcid, a.orcid)}</td><td><button class="sec" onclick="pickOrcid('${a.orcid}'${kk})">Это он</button></td></tr>`).join('') + '</table>';
      h += '<p class="dim">Надёжнее всего — ORCID или поиск по статьям из списка: тогда автор определяется без выбора.</p>';
    } else h += `<p>${chip('unk', 'не найден')} По этим сведениям автор в открытых базах не найден. Попробуйте ORCID или сначала найдите публикации из списка.</p>`;
  }
  if (prof && !prof.err && S.similar && S.similar.length) h += `<p>${chip('check', 'проверьте')} В OpenAlex есть ещё профили с тем же именем — база иногда делит одного автора на несколько. Если это он, добавьте его публикации:</p><table class="t"><tr><th>Имя</th><th style="width:30%">Организация</th><th style="width:8%">Работ</th><th style="width:22%"></th></tr>` + S.similar.map(a => `<tr><td>${esc(a.name)}</td><td>${esc(a.inst)}</td><td>${a.works}</td><td><button class="sec" onclick="addProfile('${a.id}'${kk})">Добавить его публикации</button> ${lnk('https://openalex.org/' + a.id, 'профиль')}</td></tr>`).join('') + '</table>';
  return h;
}
function renderAuthor() {
  const S = AU;
  if (!S.prof && !S.cands && !S.orcCands && !S.msgs.length && !S.parsed) { $('outAuthor').innerHTML = ''; $('acopy').style.display = 'none'; return; }
  $('outAuthor').innerHTML = '<h2>Автор</h2>' + authorBody(S, -1, 'au', true).replace('<p>Источник —', '<h2>Все публикации автора</h2><p>Источник —');
  $('acopy').style.display = S.prof && !S.prof.err ? '' : 'none';
}

/* ----- Режим 3: несколько авторов ----- */
const grpLines = () => $('grp').value.split('\n').map(l => l.replace(/^\s*\d{1,2}\s*[.)]\s*/, '').replace(/\s*\|\s*/g, ' ').trim()).filter(l => l.length >= 3).slice(0, 30);
function countGroup() { const n = grpLines().length; $('gcnt').textContent = n ? `Авторов: ${n}${n >= 30 ? ' (не больше 30 за раз)' : ''}.` : ''; }
async function groupImage(files) {
  if (!files.length || BUSY) return; BUSY = true;
  try { $('gstatus').textContent = 'Распознаю снимок…'; const r = await ocrImage(files[0]); $('grp').value = ($('grp').value.trim() ? $('grp').value.trim() + '\n' : '') + r.text.trim() + '\n'; $('gstatus').innerHTML = '<b>Сверьте текст со снимком</b>: оставьте по одному автору на строку (ФИО и, если есть, идентификаторы), лишнее удалите.'; }
  catch (e) { $('gstatus').textContent = 'Снимок не распознан: ' + (e.message || e); }
  BUSY = false; countGroup();
}
async function runGroup() {
  if (BUSY) return; const lines = grpLines(); if (!lines.length) { $('gstatus').textContent = 'Введите авторов — по одному на строку.'; return; }
  BUSY = true; $('ggo').disabled = true; applyNet(); G.items = lines.map(input => ({ input, S: newS() }));
  for (let k = 0; k < G.items.length; k++) { const it = G.items[k]; await searchAuthor(it.S, it.input, t => { $('gstatus').textContent = `Автор ${k + 1} из ${G.items.length}: ${t}`; }); renderGroup(); await sleep(NET.pause); }
  BUSY = false; $('ggo').disabled = false; $('gstatus').textContent = 'Готово.'; renderGroup();
}
function grpState(S) { if (S.prof && !S.prof.err) return 'found'; if (S.prof && S.prof.err) return 'err'; if ((S.cands && S.cands.length) || (S.orcCands && S.orcCands.length)) return 'pick'; return 'none'; }
function renderGroup() {
  if (!G.items.length) { $('outGroup').innerHTML = ''; $('gcopy').style.display = 'none'; return; }
  const f = FLT.grp, all = [];
  G.items.forEach(it => { if (grpState(it.S) === 'found') it.S.prof.js.forEach(x => all.push(profKey(x))); });
  let h = `<h2>Несколько авторов (${G.items.length})</h2>` + filterBar('grp', all.filter(k => passFilter(k, f)).length, all.length, noCpdHidden(all, f)).replace('показано', 'публикаций всех авторов: показано');
  h += '<table class="t"><tr><th style="width:3%">№</th><th style="width:19%">Введено</th><th style="width:20%">Найден</th><th style="width:7%">Публикаций</th><th style="width:5%">Q1</th><th style="width:5%">Q2</th><th style="width:6%">БС 1</th><th style="width:9%">Corresponding</th><th>Что проверить</th></tr>';
  G.items.forEach((it, k) => {
    const S = it.S, st = grpState(S); let found = '', nums = '<td colspan="5" class="dim">—</td>', chk = [];
    if (st === 'found') {
      const rows = profRows(S, 'grp'), inf = S.prof.info[0] || {};
      found = `<a href="#g${k}">${esc(inf.name)}</a>${inf.inst ? '<br><span class="dim">' + esc(inf.inst) + '</span>' : ''}`;
      nums = `<td><b>${rows.length}</b></td><td>${rows.filter(x => x.j.sj && x.jv.qY === 1).length}</td><td>${rows.filter(x => x.j.sj && x.jv.qY === 2).length}</td><td>${rows.filter(x => rowKey(x.w.year, x.j, x.jv).wl === 1).length}</td><td>${rows.filter(x => x.corrSt === 'yes').length}</td>`;
      if (S.prof.info.length > 1) chk.push('собрано из нескольких профилей');
      if (S.similar && S.similar.length) chk.push('есть похожие профили');
      if (profileLinks(S).warns.length) chk.push('идентификаторы расходятся');
      if (!/ORCID|Scopus ID|ResearcherID/.test(S.prof.how)) chk.push('найден по ФИО — проверьте, тот ли человек');
    } else if (st === 'pick') { found = chip('check', 'выберите из кандидатов') + ` <a href="#g${k}">ниже</a>`; }
    else if (st === 'err') { found = chip('unk', 'не загружено'); }
    else found = chip('unk', 'не найден');
    chk = chk.concat(S.msgs);
    h += `<tr><td>${k + 1}</td><td>${esc(it.input)}</td><td>${found}</td>${nums}<td class="dim">${chk.map(esc).join('; ')}</td></tr>`;
  });
  h += `</table><p class="dim">Число публикаций, Q1, Q2, БС 1 и corresponding — по фильтру выше (по умолчанию — последние пять лет). Квартиль и уровень — на год публикации.</p>`;
  G.items.forEach((it, k) => { const inf = it.S.prof && !it.S.prof.err ? it.S.prof.info[0] : null; h += `<details id="g${k}" class="gitem"><summary>${k + 1}. ${esc(inf ? inf.name : it.input)}</summary>${authorBody(it.S, k, 'grp', false)}</details>`; });
  const open = [...document.querySelectorAll('#outGroup details[open]')].map(d => d.id);
  $('outGroup').innerHTML = h; open.forEach(id => { const d = $(id); if (d) d.open = true; });
  $('gcopy').style.display = '';
}

/* ----- Копирование ----- */
const tsvRow = a => a.map(x => String(x == null ? '' : x).replace(/[\t\n]/g, ' ')).join('\t');
const wlS = (wl, year) => { if (!wl) return 'нет'; const a = wlAt(wl, year); return (a.excluded ? 'исключён ' + wl.disc : (a.lv ? a.lv + ' (' + a.y + ')' : 'без уровня')) + (!a.excluded && (a.curExcl || a.cur !== a.lv) ? '; сейчас ' + (a.curExcl ? 'исключён' : a.cur || 'без уровня') : ''); };
const corrS = w => !w.oa ? 'нет данных' : (!w.corr || !w.corr.known ? 'в базе не указан' : w.corr.names.join(', '));
const orgS = me => { const o = orgOf(me); return o.names.join('; ') + (o.st && $('org').value.trim() ? ' [' + ORG_T[o.st] + ']' : ''); };
function copyList() {
  if (!W.entries) return; const ids = auIds().length; const L = [tsvRow(['№', 'Найденная статья', 'Ссылка', 'Год', 'Тип', 'Издание', 'ISSN', 'Квартиль (год публикации)', 'Квартиль сейчас (' + REF.sjYear + ')', 'Белый список (год публикации)', 'Цит. на документ SCImago', 'Импакт-фактор в списке', 'Corresponding (OpenAlex)'].concat(ids ? ['Найденный автор — corresponding', 'Организация автора'] : []).concat(['Первый автор', 'Последний автор', 'Примечания']))];
  listRows().forEach(({ p, i }) => { const w = p.work, jv = p.jv || {}, a = w ? w.authors : [], m = w ? listMe(w) : null; L.push(tsvRow([numOf(p.entry, i), w ? w.title : 'не найдена', w ? 'https://doi.org/' + w.doi : '', w ? w.year : '', w ? p.typeName : '', w ? w.journal : '', w ? w.issns.join(', ') : '', w && p.j.sj ? (jv.qY ? 'Q' + jv.qY : 'нет') + ' (' + jv.sjYear + ')' : '', w && p.j.sj && jv.qL ? 'Q' + jv.qL : '', w ? wlS(p.j.wl, w.year) : '', w && jv.cpd != null ? fmtNum(jv.cpd) : '', p.declIF != null ? fmtNum(p.declIF) : '', w ? corrS(w) : ''].concat(ids ? [m && m.me ? CORR_T[m.corr] : 'нет данных', m && m.me ? orgS(m.me) : ''] : []).concat([aName(a[0]), a.length > 1 ? aName(a[a.length - 1]) : '', p.notes.concat(dupNotes(i)).join('; ')]))); });
  toClip(L.join('\n'), 'status');
}
const profHead = () => ['Год', 'Статья', 'Ссылка', 'Издание', 'Квартиль (год публикации)', 'Квартиль сейчас (' + REF.sjYear + ')', 'Белый список (год публикации)', 'Цит. на документ', 'Место автора', 'Corresponding', 'Организация'];
const profLine = x => [x.w.year, x.w.title, wLink(x.w), x.w.journal, x.j.sj ? (x.jv.qY ? 'Q' + x.jv.qY : 'нет') + ' (' + x.jv.sjYear + ')' : '', x.j.sj && x.jv.qL ? 'Q' + x.jv.qL : '', wlS(x.j.wl, x.w.year), x.jv.cpd != null ? fmtNum(x.jv.cpd) : '', x.pos || '', x.corrSt ? CORR_T[x.corrSt] + (x.corrSt === 'no' && x.corrNames.length ? ' (' + x.corrNames.join(', ') + ')' : '') : 'нет данных', orgS(x.me)];
function copyAuthor() {
  if (!AU.prof || AU.prof.err) return; const L = [tsvRow(['Автор', AU.prof.info.map(a => a.name).join('; '), AU.prof.info.map(a => 'https://openalex.org/' + a.id).join(' ')]), tsvRow(profHead())];
  aRows().forEach(x => L.push(tsvRow(profLine(x))));
  toClip(L.join('\n'), 'astatus');
}
function copyGroup() {
  const L = [tsvRow(['№', 'Введено', 'Автор', 'Профиль OpenAlex'].concat(profHead()))];
  G.items.forEach((it, k) => { const S = it.S; if (grpState(S) !== 'found') { L.push(tsvRow([k + 1, it.input, grpState(S) === 'pick' ? 'выберите из кандидатов' : 'не найден'])); return; } const inf = S.prof.info[0] || {}; profRows(S, 'grp').forEach(x => L.push(tsvRow([k + 1, it.input, inf.name, 'https://openalex.org/' + inf.id].concat(profLine(x))))); });
  toClip(L.join('\n'), 'gstatus');
}
function toClip(t, where) {
  const done = () => { $(where).textContent = 'Скопировано — вставьте в таблицу.'; };
  const fb = () => { const a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); done(); } catch (e) { } a.remove(); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, fb); else fb();
}
async function selfCheck() {
  if (BUSY) return; BUSY = true; applyNet(); const el = $('selfres');
  const rs = await runSelfCheck((i, n) => { el.textContent = `Проверяю ${i + 1} из ${n}…`; }); BUSY = false;
  const ok = rs.filter(r => r.ok).length;
  el.innerHTML = `<p><b>Самопроверка: верно ${ok} из ${rs.length}.</b> Это известные статьи с заранее записанными ответами; так видно, правильно ли утилита находит и разбирает публикации на этом компьютере.</p><table class="t"><tr><th style="width:8%">Поиск</th><th>Что искали</th><th style="width:12%">Итог</th><th style="width:38%">Подробности</th></tr>` +
    rs.map(r => `<tr><td>по ${r.c.how === 'doi' ? 'DOI' : 'тексту'}</td><td class="dim">${esc(r.c.q)}</td><td>${chip(r.ok ? 'ok' : (r.err ? 'unk' : 'no'), r.ok ? 'верно' : (r.err ? 'не выполнено' : 'расхождение'))}</td><td class="dim">${r.err ? esc(r.err) : r.checks.map(c => `${esc(c[0])}: ${c[1] ? 'да' : '<b>нет</b>'}`).join('; ') + (r.soft ? `; ${esc(r.soft[0])}: ${r.soft[1] ? 'да' : 'нет'} (${esc(r.soft[2])})` : '') + (r.ok ? '' : `<br>получено: ${esc(JSON.stringify(r.got))}`)}</td></tr>`).join('') + '</table>';
}
document.addEventListener('DOMContentLoaded', init);

