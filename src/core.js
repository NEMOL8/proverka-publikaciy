/* ===== Проверка публикаций: правила (без сети, без ИИ) ===== */
const VERSION = '0.7.11', VERSION_DATE = '19.10.2026';
/* Что нового — показывается на странице */
const CHANGES = [
  ['0.7.11', '19.10.2026', ['Организация автора — открытое поле рядом с ФИО: по ней выбирается нужный человек среди однофамильцев (совпала у одного с полным именем — выбран сам; у кандидатов пометка «организация совпала»). Сверка организации по каждой статье и фильтр «Организация» убраны; организация в статье показывается просто как факт.',
    'Индекс Хирша — заметной плашкой рядом с именем автора: крупно значение OpenAlex, рядом ссылки Scopus · WoS · РИНЦ.',
    'Снимки eLibrary: перед распознаванием снимок обрабатывается (синий и фиолетовый текст на сером становится чёрным, контраст, резкость), каждая строка читается русской и английской моделью; разбор списка eLibrary по настоящему виду страницы; «В сборнике: …» не попадает в поиск статьи; патенты помечаются «патент — не ищется». Плохо распознанный снимок не вставляется молча — крупное предупреждение и кнопка «Всё равно вставить».',
    'Шапка по брендбуку: графит с сетчатой сферой и красными орбитами, тонкая красная линия снизу; ссылки — бордовые.',
    'Удобство: прошлая проверка сохраняется в браузере («Продолжить прошлую проверку»); кеш ответов Crossref и OpenAlex на 14 дней; «Повторить ненайденные»; прогресс и «Остановить»; «Скачать Excel» и CSV; «Печать / PDF»; Ctrl+V и перетаскивание снимка в любое место; Ctrl+Enter; сортировка кликом по заголовку; отметка «проверено» в строке; причина пометки — короткой фразой.']],
  ['0.7.10', '16.10.2026', ['После «Найти публикации», «Найти автора» и выбора варианта страница сама переходит к результату; под шапкой — строка переходов со счётчиками, внизу справа — кнопка «К вводу».',
    'Основные темы автора показываются по-русски (раздел науки OpenAlex); точное английское название — в подсказке при наведении.',
    'Кнопка «Найти другого автора»: очищает поле и прежний результат, не трогая список публикаций.',
    'Раздел «Несколько авторов» убран — остались список публикаций и автор.',
    'Меньше текста и рамок: короткие подсказки, «Организация для сверки» — в «Дополнительно», индекс Хирша — одной строкой, сводка по квартилям — плашками.',
    'Снимок страницы с сайта (ORCID, Google Scholar, Scopus, eLibrary, Web of Science и других): элементы интерфейса — пагинация, кнопки, «Cited by», баннеры — больше не попадают в текст записи и не портят поиск.',
    'Оформление приведено к брендбуку: шрифт Verdana (замена Circe), прямые углы без скруглений, красный — только в крупных заголовках.']],
  ['0.7.9', '15.10.2026', ['Справочник SCImago — за 2006–2025 годы (был 2021–2025): квартиль и показатель на год публикации и для старых статей. Белого списка до 2023 года не было — у таких статей уровень 2023 года показан справочно.',
    'Поиск статей по списку: лучший вариант выбирается по названию, году, изданию и первому автору (из 10 вариантов вместо 4); если Crossref не нашёл — запасной поиск в OpenAlex; DOI узнаётся и с ошибками распознавания («1O.1016», пробелы); если DOI из списка не найден — поиск по тексту. Для спорных и ненайденных статей — до 3 ближайших вариантов с кнопкой «Это она» и ссылки на поиск в Google Scholar и eLibrary.',
    'Колонка «Показатель» переименована в «Импакт-фактор» (это по-прежнему «цитирований на документ за 2 года» SCImago — подпись под заголовком).',
    'Колонка «Авторы»: сверху крупная пометка «Corresponding — да / нет / в базе не указан».',
    'Если издания нет в SCImago — ссылки, где посмотреть квартиль самому: Scopus Sources (CiteScore), список WoS, JCR. У изданий из SCImago — ссылка на страницу издания в Scopus.',
    'Индекс Хирша Scopus, WoS, РИНЦ и квартиль WoS больше не вписываются вручную: где значение утилита не получает — ссылка на профиль или поиск и пометка «посмотрите сами».',
    'Выбор автора из найденных по ФИО: ФИО кириллицей (если оно есть в OpenAlex), организация на английском и русском, основные темы, ссылки ORCID · Scopus · OpenAlex.',
    'Фильтры — кнопками в два ряда; меньше пояснений и рамок; справка, «Что нового», «Что уходит в интернет» и настройки — одной строкой сверху; ключ OpenAlex спрятан в «Дополнительно».',
    'Сводка по нескольким авторам по умолчанию — за все годы. Из кода удалены остатки старого блока итоговых выводов.']],
  ['0.7.8', '14.10.2026', ['Убраны фирменный шрифт и логотип: страница использует системные шрифты, оформление (цвета, шапка) прежнее.']],
  ['0.7.7', '14.10.2026', ['Квартили не только SCImago: у издания показана индексация по Белому списку (WoS CC, Scopus, RSCI) — если издания нет в SCImago, сразу видно, в какой базе может быть квартиль. Для квартиля WoS (JCR) — ссылки для проверки и поле, чтобы вписать значение (открытого источника нет); вписанное попадает в «Скопировать таблицу».', 'Сайт: кнопки работают сразу, ход загрузки справочников виден в процентах, при сбое — понятное сообщение и кнопка «Повторить»; ошибки страницы показываются наверху.']],
  ['0.7.6', '14.10.2026', ['Подписи сделаны общими, без привязки к конкретным документам: у идентификаторов источник «введено», поле «Организация для сверки».']],
  ['0.7.5', '14.10.2026', ['В блоке «Профили автора» — индекс Хирша по базам: Scopus, Web of Science, РИНЦ — ссылка на профиль, где его видно, и поле, чтобы вписать значение (открытого доступа к этим значениям нет); OpenAlex — свой расчёт, справочно. Вписанные значения попадают в «Скопировать ссылки».']],
  ['0.7.4', '14.10.2026', ['«Проверить связь» опрашивает все базы одновременно и показывает ответы по мере поступления; база, не ответившая за 12 секунд, помечается «не отвечает». Любой запрос к базе теперь ждёт ответа не дольше 20 секунд (раньше зависший сервер мог задерживать работу на минуты).']],
  ['0.7.3', '14.10.2026', ['Встроен ключ OpenAlex: дневной лимит поиска авторов в 10 раз больше (около 1000 поисков по ФИО в день вместо 100). Поле «Ключ OpenAlex» в настройках можно не заполнять; своё значение заменит встроенное только в этом браузере.', 'Убран скрытый блок итоговых выводов: утилита показывает только факты о публикациях и авторах.']],
  ['0.7.2', '14.10.2026', ['Оформление по брендбуку Инконсалт: бордовая шапка с логотипом и сетчатым узором, заголовки заглавными буквами (Circe ExtraBold), тёмные шапки таблиц. Фирменный красный — только тонкой линией под шапкой; цвета пометок не меняются.']],
  ['0.7.1', '14.10.2026', ['Оформление по брендбуку Инконсалт: шрифт Circe, фирменные серый, тёмно-коричневый и бежевый цвета. Логотипа, названия компании и красного нет (правило проекта).']],
  ['0.7', '13.10.2026', ['Блок «Профили автора»: все ссылки на найденного автора (ORCID, Scopus, Web of Science, eLibrary, OpenAlex) с пометкой, откуда взят идентификатор, и ссылки-поиски по ФИО (Google Scholar, ResearchGate, Semantic Scholar и др.); предупреждение, если идентификаторы из разных источников расходятся; «Скопировать ссылки».',
    'Corresponding author у каждой статьи: «да» / «нет» (и кто) / «в базе не указан» — отдельной колонкой в публикациях автора и пометкой в списке.',
    'Фильтры: corresponding author и показатель «от …» (цитирований на документ SCImago на год публикации).',
    'Организация автора в каждой статье и сверка с указанной организацией.',
    'Возможные дубли в списке: одинаковый DOI, одинаковое название, препринт и журнальная версия, тезисы и статья.',
    'Несколько авторов сразу (раздел 3): сводная таблица по исполнителям и публикации каждого.',
    'Сайт: справочники и распознавание загружаются отдельно и кешируются браузером; короткая инструкция; «Что нового»; страница закрыта от поисковиков.']],
  ['0.6', '12.10.2026', ['Поиск автора по всем идентификаторам (ORCID, Scopus ID, ResearcherID через реестр ORCID) и по ФИО кириллицей и латиницей; похожие профили того же автора.']],
  ['0.5', '12.10.2026', ['Два режима: список публикаций и автор. Фильтры по квартилю, Белому списку и годам. Квартиль и уровень — на год публикации и сейчас.']],
];

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

/* ---------- снимок страницы сайта: отделяем текст публикаций от элементов интерфейса ----------
   Снимок списка публикаций с любого сайта даёт вперемешку с текстом статей пагинацию, кнопки, счётчики и баннеры.
   Правила — только регулярные выражения (ИИ не используется): непонятное не выбрасывается, а остаётся в записи. */
const UI_RE = [
  /^(page|страница)\s*\d+\s*(of|из)\s*\d+$/i, /^\d+\s*[-–—]\s*\d+\s+of\s+[\d\s,]+$/i, /^\d+\s+of\s+[\d\s,]+$/i,
  /^(items|rows|results|documents)\s+per\s+page\b/i, /^показывать\s+по\b/i, /^(next|previous|prev|first|last|назад|далее|вперёд|вперед|ещё|еще)$/i,
  /^[‹›«»<>→←⟩⟨|·•]+$/, /^\.{3}$/, /^…$/,
  /^(sort\s+by|sorted\s+by|сортировать\s+по|сортировка|date\s+range|диапазон\s+дат|results\s+per\s+page|refine\s+by)\b/i, /^(sort|filter|filters|фильтр|фильтры|уточнить)\s*:?$/i,
  /^(show\s+more(\s+detail)?|read\s+more|view\s+all|view\s+abstract|load\s+more|export(\s+all)?|download|share|print|copy|save|add\s+to\s+(library|list)|select\s+all|create\s+citation\s+report|analyze\s+results)\b[.:\s]*$/i,
  /^(подробнее|показать\s+ещё|показать\s+еще|скачать|поделиться|экспорт|печать|выбрать\s+все|сохранить|добавить\s+в\s+список|в\s+избранное)\b[.:\s]*$/i,
  /^(cited\s+by|times\s+cited|цитировано|цитируется|цитирований|число\s+цитирований)\s*[:\s]*[\d\s,]*$/i,
  /^(цитировать|похожие\s+статьи|все\s+версии\s+статьи(\s*\(\d+\))?|related\s+articles|all\s+\d+\s+versions|cite)$/i,
  /^(похожие\s+запросы|related\s+searches)$/i,
  /^(source|источник)\s*:/i, /^preferred\s+source(\s*\(of\s*\d+\))?/i,
  /^(cookie|cookies|accept(\s+all)?|sign\s+in|log\s+in|войти|регистрация|подписаться|принять)\b/i,
  /^(общее\s+число\s+публикаций|число\s+публикаций|индекс\s+хирша)\s*[:\s]*[\d\s,]*$/i,
  /^(название|соавторы|журнал|год|тип\s+публикации|документы|documents|authors|title|year|source\s+title)$/i,
];
/* Связка кнопок в одной строке («Export all Download Select all», «☆ Сохранить 99 Цитировать Цитировано: 12 Похожие статьи»):
   если после удаления кнопочных слов, чисел и значков почти ничего не осталось — это элемент интерфейса, а не текст статьи */
const BTN_WORDS = /(show\s+more(\s+detail)?|read\s+more|view\s+all|view\s+abstract|load\s+more|export(\s+all)?|download|share|print|copy|save|add\s+to\s+(library|list)|select\s+all|full\s+text|get\s+pdf|pdf|html|cited\s+by|times\s+cited|cite|related\s+articles|all\s+versions|versions?\s+of\s+this\s+article|подробнее|показать\s+(ещё|еще)|скачать|поделиться|экспорт|печать|выбрать\s+все|сохранить|цитировать|цитировано|цитирований|похожие\s+статьи|все\s+версии\s+статьи|похожие\s+запросы|полный\s+текст|назад|далее)/gi;
function isBtnRow(t) {
  const rest = String(t).replace(BTN_WORDS, ' ').replace(/[\d\s:;()\[\]☆★✓·•|,.\-–—]+/g, ' ').trim();
  return rest.length <= 3;
}
/* Строка «интерфейсная», если совпала с правилом или если она короткая, без признаков названия статьи и повторяется в тексте */
function isUiLine(l, repeats) {
  const t = String(l || '').trim(); if (!t) return false;
  if (DOI_RE.test(t) || findDoi(t)) return false;
  if (UI_RE.some(re => re.test(t))) return true;
  if (BTN_WORDS.test(t.toLowerCase()) && isBtnRow(t)) { BTN_WORDS.lastIndex = 0; return true; }
  BTN_WORDS.lastIndex = 0;
  const words = t.split(/\s+/);
  if (words.length <= 3 && !/\b(19[5-9]\d|20[0-4]\d)\b/.test(t)) {
    const long = words.filter(w => w.replace(/[^A-Za-zА-Яа-яЁё]/g, '').length >= 4).length;
    if (!long) return true;                                          // «‹ 2 ›», «PDF», «1 of 5»
    if (repeats && repeats.get(t.toLowerCase()) >= 3) return true;   // один и тот же текст в нескольких местах — кнопка, а не статья
  }
  return false;
}
/* ---------- eLibrary (РИНЦ), список публикаций — по настоящему виду страницы (правка 4, 0.7.11) ----------
   Карточка: номер, флажок, НАЗВАНИЕ ЗАГЛАВНЫМИ (ссылка), ниже курсивом авторы, ниже источник:
   «В сборнике: … Москва, 2025. С. 26.» или «Materials Letters. 2025. Т. 382. С. 137913.»; справа отдельной колонкой — число цитирований. */
const ELIB_SRC = /^(В\s+сборнике|В\s+книге|В\s+журнале|В\s+монографии)\s*:|\b(19|20)\d{2}\.\s*(Т\.|№|С\.)\s*\d|Патент\s+на\s+(изобретение|полезную\s+модель)/i;
/* Строка заглавными: не меньше трёх слов из букв и почти все буквы — прописные */
function isCapsLine(l) {
  const t = String(l || '').replace(/^\d{1,3}\s*[.)]?\s*/, ''); const letters = t.replace(/[^A-Za-zА-Яа-яЁё]/g, '');
  if (letters.length < 12 || t.split(/\s+/).filter(w => /[A-Za-zА-Яа-яЁё]{2}/.test(w)).length < 3) return false;
  return letters.replace(/[^A-ZА-ЯЁ]/g, '').length / letters.length >= 0.85;
}
function isElibList(text) {
  const L = String(text || '').split('\n').map(l => l.trim()).filter(Boolean);
  const src = L.filter(l => ELIB_SRC.test(l)).length, caps = L.filter(isCapsLine).length;
  return src >= 2 && caps >= Math.max(1, Math.ceil(src * 0.5));
}
function splitElib(L) {
  const blocks = []; let cur = null, num = null;
  const push = () => { if (cur && cur.length) blocks.push((num != null ? num + '. ' : '') + cur.join('\n')); cur = null; num = null; };
  for (let i = 0; i < L.length; i++) {
    let l = L[i];
    if (isCapsLine(l) && !(cur && cur.length && isCapsLine(cur[cur.length - 1]) && !ELIB_SRC.test(cur.join(' ')) && !/^\d{1,3}\s*[.)]?\s/.test(l))) {
      push();
      const m = l.match(/^(\d{1,3})\s*[.)]?\s+/); if (m) { num = +m[1]; l = l.slice(m[0].length); }
      l = l.replace(/^[☐□■▢☑✓|\[\]!]{1,3}\s*(?=[A-ZА-ЯЁ])/, '');  // флажок слева от названия (распознаётся как «|!», «[]»)
      l = l.replace(/\s+\d{1,4}$/, '');                       // число цитирований из правой колонки
      cur = [l]; continue;
    }
    if (!cur) continue;                                      // до первой карточки — шапка страницы
    if (/^\d{1,4}$/.test(l)) continue;                       // число цитирований отдельной строкой
    // продолжение названия на следующей строке — тоже заглавными
    cur.push(isCapsLine(l) ? l.replace(/\s+\d{1,4}$/, '') : l);
  }
  push();
  return blocks.map(b => [b]).filter(b => b[0].length >= 25);
}
/* Признаки конкретных сайтов. Список расширяемый: если признаков нет, работает общая разбивка. */
function detectSite(text) {
  const t = String(text || '');
  if (/CONTRIBUTORS\s*:/i.test(t) && /(Source\s*:|Preferred\s+source)/i.test(t)) return 'orcid';
  if (/(Цитировать|Все\s+версии\s+статьи|versions\s+of\s+this\s+article|Cited\s+by\s+\d+)/i.test(t) && /^.+\s[—–-]\s.*(19|20)\d{2}\s*[—–-]\s*\S+/m.test(t)) return 'scholar';
  if (/(Общее\s+число\s+публикаций|Число\s+цитирований|elibrary|РИНЦ)/i.test(t) && /(Соавторы|Журнал)/i.test(t)) return 'elibrary';
  if (isElibList(t)) return 'elibrary';
  if (/^By\s*:/im.test(t) && /(Times\s+Cited|Create\s+Citation\s+Report)/i.test(t)) return 'wos';
  if (/(View\s+abstract|Cited\s+by|Documents)/i.test(t) && /\d+\s*[-–—]\s*\d+\s+of\s+[\d\s,]+/i.test(t)) return 'scopus';
  return null;
}
/* Разбивка по карточкам конкретного сайта. Возвращает массив блоков строк или null, если признаки не подтвердились. */
function splitBySite(lines, site) {
  const L = lines.filter(Boolean), blocks = []; let cur = null;
  const push = () => { if (cur && cur.length) blocks.push(cur); cur = null; };
  if (site === 'orcid') {
    // карточка ORCID «Works»: заголовок, под ним «ГГГГ[-ММ] | Тип» или «Журнал / ГГГГ[-ММ] | Тип»
    const meta = /^(?:.+\/\s*)?(19|20)\d{2}(-\d{2})?\s*\|\s*\S+/;
    for (let i = 0; i < L.length; i++) {
      if (meta.test(L[i]) && i > 0) { const head = cur && cur.length ? cur.pop() : L[i - 1]; push(); cur = [head, L[i]]; continue; }
      if (!cur) cur = []; cur.push(L[i]);
    }
    push();
    return blocks.filter(b => b.length >= 2);
  }
  if (site === 'scholar') {
    // карточка Google Scholar: заголовок, строка «Авторы — Журнал, год — сайт», сниппет (с «…»), подвал
    const auth = /^.+\s[—–-]\s.*(19|20)\d{2}/;
    for (let i = 0; i < L.length; i++) {
      if (auth.test(L[i]) && i > 0) { const head = cur && cur.length ? cur.pop() : L[i - 1]; push(); cur = [head, L[i]]; continue; }
      if (!cur) continue;                                       // до первой карточки — шапка страницы
      if (/^[….]/.test(L[i])) continue;                         // сниппет в запись не входит
      cur.push(L[i]);
    }
    push();
    return blocks.filter(b => b.length >= 2);
  }
  if (site === 'elibrary' && isElibList(L.join('\n'))) return splitElib(L);
  if (site === 'scopus' || site === 'wos' || site === 'elibrary') {
    // карточка: заголовок, затем авторы и издание; строка с годом закрывает карточку
    const yr = /\b(19[5-9]\d|20[0-4]\d)\b/;
    for (let i = 0; i < L.length; i++) {
      if (!cur) { cur = [L[i]]; if (yr.test(L[i]) && L[i].split(/\s+/).length > 6) push(); continue; }
      cur.push(L[i]);
      if (yr.test(L[i])) push();
    }
    push();
    return blocks.filter(b => b.join(' ').length >= 25);
  }
  return null;
}
/* Текст снимка с известного сайта → записи. null, если сайт не узнан. */
function splitSiteEntries(text) {
  let lines = String(text || '').replace(/\r/g, '').split('\n').map(l => l.replace(/\s+/g, ' ').trim());
  const site = detectSite(lines.join('\n'));
  if (!site) return null;
  const rel = lines.findIndex(l => /^(похожие\s+запросы|related\s+searches)$/i.test(l));
  if (rel >= 0) lines = lines.slice(0, rel);                    // блок подсказок в конце страницы — целиком
  const repeats = new Map(); lines.forEach(l => { const k = l.toLowerCase(); if (k) repeats.set(k, (repeats.get(k) || 0) + 1); });
  lines = lines.filter(l => !isUiLine(l, repeats));
  const blocks = splitBySite(lines, site);
  if (!blocks || !blocks.length) return null;
  const out = blocks.map(b => parseEntry(b.join('\n'))).filter(e => e.query.length >= 12);
  if (!out.length) return null;
  out.forEach(e => { e.site = site; });
  return out;
}
/* Делит вставленный или распознанный текст на отдельные публикации */
function splitEntries(text) {
  const site = splitSiteEntries(text); if (site) return site;
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
const PATENT_RE = /Патент\s+на\s+(изобретение|полезную\s+модель)|(^|[\s(])RU\s?\d{6,7}\s?[CU]\d\b|Заявка\s*№\s*\d{6,}/i;
function parseEntry(raw) {
  let t = raw.replace(/([a-zа-яё])-\n(?=[a-zа-яё])/gi, '$1').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  const e = { raw: t, num: null, doi: null, years: [], declIF: null, query: '' };
  let m = t.match(/^(\d{1,2})\s*[.)]\s*/); if (m) { e.num = +m[1]; t = t.slice(m[0].length); }
  const dd = findDoi(t); if (dd) { e.doi = dd.doi; t = t.replace(dd.raw, ' '); }
  let q = t.replace(/https?:\/\/\S+/g, ' ').replace(DOI_RE, ' ').replace(/\bdoi\s*:\s*/gi, ' ');
  // заявленный импакт-фактор: число с дробной частью в конце записи или после «IF / импакт-фактор»
  m = q.match(/(?:\bIF\b|импакт[\s-]*фактор)\s*[:=–—-]?\s*(\d{1,3}(?:[.,]\d{1,3})?)/i);
  if (m) { e.declIF = parseFloat(m[1].replace(',', '.')); q = q.replace(m[0], ' '); }
  else { m = q.match(/[\s|;,(]\(?(\d{1,3}[.,]\d{1,3})\)?\s*[|.]?\s*$/); if (m) { e.declIF = parseFloat(m[1].replace(',', '.')); q = q.slice(0, m.index); } }
  const now = new Date().getFullYear();
  e.years = [...new Set((q.match(/\b(?:19[5-9]\d|20[0-4]\d)\b/g) || []).map(Number).filter(y => y <= now + 1))];
  // патент или заявка на патент — не статья: в Crossref и OpenAlex не ищется (правка 4)
  m = t.match(PATENT_RE); if (m) { e.patent = true; const n = t.match(/(?:\bRU|ВО|BO|РУ|В\/О)\s?(\d{6,7})\s?([CUСИ]\d)\b/i); if (n) e.patentNo = 'RU' + n[1] + n[2].toUpperCase().replace('С', 'C').replace('И', 'U'); }
  // «В сборнике: …», «В книге: …», «В журнале: …» — дальше издание, а не название: в запрос идёт название (и год),
  // иначе Crossref находит сам сборник, а не статью
  m = q.match(/(^|\s)В\s+(сборнике|книге|журнале|монографии)\s*:/i);
  if (m && m.index > 15) { e.container = q.slice(m.index + m[0].length).replace(/\s+/g, ' ').trim(); q = q.slice(0, m.index) + (e.years.length ? ' ' + e.years.join(' ') : ''); }
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

/* DOI в тексте записи, в том числе с ошибками распознавания: «1O.1016», «10. 1016 / j.x», «doi: 10.1016/ j.x», «https://doi.org/10…».
   Возвращает {doi, raw} — найденный DOI и кусок текста, который он занимал, или null */
function findDoi(t) {
  t = String(t || '');
  const m = t.match(/(?:https?:\/\/(?:dx\.)?doi\.org\/\s*|\bdoi\s*[:.]?\s*)?\b1[0Oo]\s?\.\s?(\d[\dOoIl]{3,8})\s?\/\s?([^\s"<>]+)/i);
  if (!m) return null;
  const pre = m[1].replace(/[Oo]/g, '0').replace(/[Il]/g, '1');
  return { doi: cleanDoi('10.' + pre + '/' + m[2]), raw: m[0] };
}
/* Насколько найденная статья подходит к записи списка: название (главное) + год, первый автор, издание.
   Год рядом (±1) — без штрафа, другой год — штраф; совпали фамилия первого автора или издание — небольшая прибавка. От 0 до 1. */
function matchScore(w, entry) {
  const t = titleScore(w.title, entry.query); let s = t;
  if (w.year && entry.years && entry.years.length) { if (entry.years.indexOf(w.year) >= 0) s += 0.06; else if (!entry.years.some(y => Math.abs(y - w.year) === 1)) s -= 0.2; }
  const fam = w.authors && w.authors[0] ? (w.authors[0].family || String(w.authors[0].name || '').trim().split(/\s+/).pop()) : '';
  if (fam && fam.length >= 3) { const et = norm(entry.query).split(' '); const c = canonName(fam); if (c && et.some(x => x.length >= 3 && canonName(x) === c)) s += 0.04; }
  if (w.journal) { const jw = norm(w.journal).split(' ').filter(x => x.length >= 4); if (jw.length && jw.every(x => norm(entry.query).split(' ').indexOf(x) >= 0)) s += 0.04; }
  return { score: Math.max(0, Math.min(1, s)), title: t };
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
const ORG_STOP = new Set('university universitet universiteta institute institut instituta federal federalnoe federalnyi federalnogo state gosudarstvennyi gosudarstvennogo gosudarstvennoe national natsionalnyi natsionalnogo research issledovatelskii issledovatelskogo nauchno nauchnyi nauchnogo scientific science of the and for in at on named imeni im after center centre tsentr school shkola higher vysshaia vysshego autonomous avtonomnoe budgetary biudzhetnoe biudzhetnoi educational obrazovatelnoe obrazovatelnoi obrazovaniia uchrezhdenie uchrezhdeniia institution organization organizatsiia faculty fakultet department kafedra otdel branch filial ltd llc fgaou fgbou fgbun fgbu fgau ano ooo ao pao vo dpo nitu niu'.split(' '));
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

/* Совпадение организации кандидата с введённой — для выбора автора среди однофамильцев (правка 1, 0.7.11).
   'yes' — названия совпали; 'part' — есть общие значимые слова; 'no' — общих слов нет; 'unk' — у кандидата организация не указана; null — организация не введена */
function orgHit(names, input) {
  if (!orgTokens(input).length) return null;
  names = (names || []).map(x => String(x || '').trim()).filter(Boolean); if (!names.length) return 'unk';
  const it = orgTokens(input); let best = 'no';
  for (const n of names) {
    const nt = orgTokens(n); if (!nt.length) continue;
    const a = it.filter(x => nt.some(y => orgTokEq(x, y))).length, b = nt.filter(y => it.some(x => orgTokEq(x, y))).length;
    if (a === it.length && b === nt.length) return 'yes';
    // аббревиатура и полное название («МИСИС» и «National University of Science and Technology MISIS»): все слова введённого есть в названии
    if (a === it.length && it.some(x => x[0] !== '#')) return 'yes';
    if (a || b) best = 'part';
  }
  return best;
}
/* Авторы статей из списка с нужной фамилией (detectLeader): если указана организация, оставить тех, у кого она совпала хотя бы в одной статье.
   Если не совпала ни у кого — не отбрасывать никого. Возвращает {list, hit}. */
function leaderByOrg(works, cands, input) {
  if (!orgTokens(input).length || !cands.length) return { list: cands, hit: null };
  const names = id => { const out = []; (works || []).forEach(w => (w && w.oaAuthors || []).forEach(a => { if (a.id === id) out.push(...instNames(a)); })); return out; };
  const r = cands.map(c => ({ c, st: orgHit(names(c.id), input) }));
  const yes = r.filter(x => x.st === 'yes'), part = r.filter(x => x.st === 'part');
  if (yes.length) return { list: yes.map(x => x.c), hit: 'yes' };
  if (part.length) return { list: part.map(x => x.c), hit: 'part' };
  return { list: cands, hit: 'none' };
}
/* Качество распознанного снимка: доля читаемых слов (из 4+ букв одного алфавита). Мусор вроде «О*® ОУ © ОЕ5ТСМ» — низкая доля. */
function ocrQuality(text) {
  const toks = String(text || '').split(/\s+/).map(t => t.replace(/^[«"“(\[]+|[»"”)\].,;:!?]+$/g, '')).filter(Boolean);
  if (!toks.length) return { words: 0, ratio: 0 };
  const ok = toks.filter(t => /^([A-Za-z][A-Za-z'’-]{3,}|[А-Яа-яЁё][А-Яа-яЁё-]{3,})$/.test(t)).length;
  return { words: toks.length, good: ok, ratio: Math.round(ok / toks.length * 100) / 100 };
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

/* ---------- данные издания на год публикации ----------
   Только факты: квартиль и показатель SCImago на год публикации и последний год, уровень Белого списка, расхождения со сайтом.
   year — год публикации; live — ответ сайта Белого списка {found, levels, state, disc} или null; oaCpd — показатель OpenAlex или null */
function journalVerdict(j, year, live, oaCpd) {
  const o = { notes: [] };
  const sj = j.sj, wl = j.wl;
  if (j.sjHow === 'ambiguous') o.notes.push('в SCImago несколько изданий с таким ISSN или названием — взято первое, проверьте');
  if (j.wlHow === 'ambiguous') o.notes.push('в Белом списке несколько изданий с таким ISSN или названием — взято первое, проверьте');
  if (j.sjHow === 'title' || j.wlHow === 'title') o.notes.push('издание найдено по названию, а не по ISSN');
  if (sj) {
    const at = sjAt(sj, year), hy = sj.hist[at.y], hl = sj.hist[sj.last];
    o.sjYear = at.y; o.sjExact = at.exact; o.qY = hy.q; o.qL = hl.q; o.yL = sj.last;
    o.hist = Object.keys(sj.hist).map(y => `${y}: ${sj.hist[y].q ? 'Q' + sj.hist[y].q : '—'}`).join(', ');
    if (!at.exact) o.notes.push(`${at.why} — взят ${at.y} год`);
    if (sj.last < REF.sjYear) o.notes.push(`в SCImago издание есть только до ${sj.last} года`);
    if (sj.type) o.notes.push(`в SCImago тип издания — ${SJ_TYPE[sj.type]}`);
    o.cpd = hy.cpd != null ? hy.cpd : hl.cpd; o.cpdLast = hl.cpd;
  }
  const lvStr = lv => { const e = Object.entries(lv).filter(([, v]) => v); return e.length ? e.map(([y, v]) => `уровень ${v} (${y})`).join(', ') : 'уровень не указан'; };
  if (wl) {
    if (wl.state === 2) o.notes.push('издание исключено из Белого списка ' + wl.disc + ' — учитывается ли статья, зависит от даты публикации');
    if (wl.state === 1 && wl.notice) o.notes.push('примечание Белого списка: ' + wl.notice);
  }
  if (live) {
    o.wlLive = true;
    const a = wl ? JSON.stringify([wl.levels[2023] || 0, wl.levels[2025] || 0, wl.levels[2026] || 0, wl.state === 2]) : 'нет';
    const b = live.found ? JSON.stringify([live.levels[2023] || 0, live.levels[2025] || 0, live.levels[2026] || 0, live.state === 2]) : 'нет';
    if (a !== b) { o.wlDiff = true; o.notes.push(`сайт Белого списка отвечает иначе, чем справочник от ${REF.wlDate}: на сайте — ` + (live.found ? lvStr(live.levels) + (live.state === 2 ? `, исключён ${live.disc || ''}` : '') : 'издания нет') + '; проверьте'); }
  }
  if (oaCpd != null) o.oaCpd = oaCpd;
  return o;
}

/* ---------- одна публикация из списка ----------
   entry — запись из списка; work — найденная статья {doi,title,authors[],journal,issns[],year,type,score,via,oaAuthors}
   opt: {leaderIds — профили найденного автора в OpenAlex} */
const TYPE_OK = { 'journal-article': 'статья', article: 'статья', review: 'обзор' };
const TYPE_RU = { 'proceedings-article': 'доклад в трудах конференции', 'book-chapter': 'глава книги', 'posted-content': 'препринт', preprint: 'препринт', book: 'книга', dataset: 'набор данных', editorial: 'редакционная статья', letter: 'письмо', erratum: 'исправление', 'peer-review': 'рецензия', dissertation: 'диссертация', monograph: 'монография', 'report': 'отчёт', paratext: 'служебная страница журнала' };
/* Пороги совпадения найденной статьи с записью: от FOUND_OK — найдена, от FOUND_NEAR — похожая (проверьте), ниже — не найдена */
const FOUND_OK = 0.85, FOUND_NEAR = 0.6;
function judgePub(entry, work, opt) {
  opt = opt || {};
  const r = { entry, work, found: ST.unk, notes: entry.warn ? [entry.warn] : [], j: null, jv: null };
  if (entry.patent) { r.found = 'patent'; r.work = null; r.notes.push('патент — в Crossref и OpenAlex не ищется'); return r; }
  if (!work) { r.found = work === null ? ST.no : ST.unk; r.notes.push(work === null ? 'в открытых базах (Crossref, OpenAlex) не найдено — проверьте вручную по ссылкам поиска' : 'запрос не выполнен'); return r; }
  if (work.via === 'doi' || work.via === 'manual') r.found = ST.ok;
  else { r.found = work.score >= FOUND_OK ? ST.ok : (work.score >= FOUND_NEAR ? ST.check : ST.no); if (r.found === ST.check) r.notes.push('найденная статья совпадает с записью не полностью — убедитесь, что это та же статья, или выберите из вариантов'); }
  if (work.via === 'manual') r.notes.push('статья выбрана вручную из вариантов');
  if (work.doiMiss) r.notes.push(`DOI из списка (${work.doiMiss}) в Crossref не найден — статья найдена по тексту записи; проверьте DOI`);
  if (r.found === ST.no) { r.notes.push('ближайшая найденная статья не похожа на запись — выберите из вариантов или проверьте вручную'); r.work = null; r.near = work; return r; }
  if (work.year && entry.years.length && entry.years.indexOf(work.year) < 0) {
    const near = entry.years.some(y => Math.abs(y - work.year) === 1);
    r.yearDiff = true; r.notes.push(`год в списке (${entry.years.join(', ')}) не совпадает с годом в базе (${work.year})` + (near ? ' — разница в один год бывает между выходом онлайн и в номере' : ''));
  }
  if (work.type) r.typeName = TYPE_OK[work.type] || TYPE_RU[work.type] || work.type;
  r.j = findJournal(work.issns, work.journal); r.jv = journalVerdict(r.j, work.year, work.wlLive || null, work.oaCpd != null ? work.oaCpd : null);
  r.notes.push(...r.jv.notes);
  if (entry.declIF != null) {
    r.declIF = entry.declIF;
    if (r.jv.cpd != null) { const d = Math.abs(entry.declIF - r.jv.cpd), big = d > Math.max(1.5, 0.35 * r.jv.cpd); r.ifDiff = big; if (big) r.notes.push(`в списке ${fmtNum(entry.declIF)}, а «цитирований на документ» SCImago ${fmtNum(r.jv.cpd)} — это разные показатели (в списке обычно импакт-фактор WoS), сверьте на сайте журнала`); }
  }
  // corresponding author — как размечено в OpenAlex; найденный автор узнаётся по профилю
  if (work.oaAuthors) { const ca = work.oaAuthors.filter(a => a.corr); work.corr = ca.length ? { known: true, names: ca.map(a => a.name).filter(Boolean) } : { known: false }; }
  return r;
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
function judgeProfileWork(w, ids) { const r = judgeProfileWork0(w);
  if (w.authors && w.authors.length && ids && ids.length) { const i = w.authors.findIndex(a => ids.indexOf(a.id) >= 0); r.first = i === 0; r.corr = w.authors.some(a => a.corr && ids.indexOf(a.id) >= 0); r.corrKnown = w.authors.some(a => a.corr); r.pos = i < 0 ? '' : (i === 0 ? 'первый' : (i === w.authors.length - 1 ? 'последний' : (i + 1) + '-й') + ' из ' + w.authors.length);
    r.corrSt = corrOf(w.authors, ids); r.corrNames = w.authors.filter(a => a.corr && ids.indexOf(a.id) < 0).map(a => a.name).filter(Boolean); r.me = i >= 0 ? w.authors[i] : null; }
  return r; }
/* Организации автора в статье: названия, распознанные базой, иначе строки из статьи */
const instNames = me => !me ? [] : ((me.inst && me.inst.length) ? me.inst.map(x => x.name) : (me.raw || []));
function judgeProfileWork0(w) { const j = findJournal(w.issns, w.journal); const jv = journalVerdict(j, w.year, null, null); return { w, j, jv }; }

if (typeof module !== 'undefined') module.exports = { orgHit, leaderByOrg, ocrQuality, isElibList, isCapsLine, splitSiteEntries, detectSite, isUiLine, instNames, CHANGES, corrOf, orgMatch, orgTokens, findDuplicates, isPreprint, VERSION, ST, ST_NAME, norm, normIssn, lev, loadRef, findJournal, splitEntries, parseEntry, titleScore, canonName, leaderVariants, sameSurname, authorPosition, journalVerdict, sjAt, detectLeader, parseAuthorInput, orcidValid, wlAt, passFilter, parseFIO, nameMatch, translitVariants, judgePub, judgeProfileWork, matchScore, findDoi, FOUND_OK, FOUND_NEAR, cleanDoi, fmtNum, fmtIssn };
