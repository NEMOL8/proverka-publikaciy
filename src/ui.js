/* ===== Экран ===== */
const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const chip = (st, text) => `<span class="chip ${st}">${esc(text || ST_NAME[st])}</span>`;
let LAST = null, BUSY = false;

/* Ошибки на странице показываются наверху — по снимку экрана видно, что сломалось */
window.addEventListener('error', e => showErr((e.message || 'ошибка') + (e.filename ? ' (' + String(e.filename).split('/').pop() + ':' + e.lineno + ')' : '')));
window.addEventListener('unhandledrejection', e => showErr('ошибка: ' + ((e.reason && e.reason.message) || e.reason)));
function showErr(t) { const b = document.getElementById('pgerr'); if (!b) return; b.style.display = ''; b.textContent = 'Ошибка на странице — пришлите снимок этой строки: ' + t; }
async function init() {
  $('ver').textContent = `версия ${VERSION} от ${VERSION_DATE}`;
  $('changes').innerHTML = CHANGES.map(c => `<p><b>${c[0]}</b> <span class="dim">${c[1]}</span></p><ul>${c[2].map(x => '<li>' + esc(x) + '</li>').join('')}</ul>`).join('');
  // кнопки и поля работают сразу; поиск включается, когда загружены справочники
  $('file').addEventListener('change', e => addImages([...e.target.files]));
  $('stop').addEventListener('click', () => { STOP = true; $('stop').disabled = true; $('status').textContent = 'Останавливаю после текущей публикации…'; });
  $('retry').addEventListener('click', retryMissing); $('xlsx').addEventListener('click', () => exportList('xlsx')); $('csv').addEventListener('click', () => exportList('csv'));
  $('axlsx').addEventListener('click', () => exportAuthor('xlsx')); $('acsv').addEventListener('click', () => exportAuthor('csv'));
  $('cacheClear').addEventListener('click', async () => { await cacheClear(); cacheInfo(); }); $('useCache').addEventListener('change', () => { LS.set('pc_useCache', $('useCache').checked); cacheInfo(); });
  // Ctrl+Enter в поле списка — найти публикации (удобство 8)
  $('list').addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); runList(); } });
  $('afile').addEventListener('change', e => authorImage([...e.target.files]));
  // 0.8: документ PDF или Word (правка 6), режим «Журнал» (правка 5)
  $('dfile').addEventListener('change', e => { readDocument([...e.target.files]); e.target.value = ''; });
  $('jgo').addEventListener('click', runJournals); $('jcopy').addEventListener('click', copyJournals); $('jxlsx').addEventListener('click', () => exportJournals('xlsx')); $('jcsv').addEventListener('click', () => exportJournals('csv'));
  $('jq').addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); runJournals(); } });
  document.addEventListener('paste', e => { const im = [...(e.clipboardData ? e.clipboardData.items : [])].filter(i => i.type.startsWith('image/')).map(i => i.getAsFile()); if (!im.length) return; e.preventDefault(); if (document.activeElement === $('author')) authorImage(im); else if (document.activeElement && document.activeElement.id === 'hxText') hxImage(im); else addImages(im); });
  // снимок можно перетащить в любое место страницы (удобство 7); на поле автора — снимок с идентификаторами
  const hasFiles = e => e.dataTransfer && [...(e.dataTransfer.types || [])].indexOf('Files') >= 0; let dragN = 0;
  document.addEventListener('dragenter', e => { if (!hasFiles(e)) return; e.preventDefault(); dragN++; document.body.classList.add('dragging'); });
  document.addEventListener('dragover', e => { if (hasFiles(e)) e.preventDefault(); });
  document.addEventListener('dragleave', e => { if (!hasFiles(e)) return; if (--dragN <= 0) { dragN = 0; document.body.classList.remove('dragging'); } });
  document.addEventListener('drop', e => { if (!hasFiles(e)) return; e.preventDefault(); dragN = 0; document.body.classList.remove('dragging'); const docs = [...e.dataTransfer.files].filter(f => /\.(pdf|docx?)$/i.test(f.name) || f.type === 'application/pdf'); if (docs.length) { readDocument(docs); return; } const im = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/')); if (!im.length) return; if (e.target && e.target.closest && e.target.closest('#author')) authorImage(im); else addImages(im); });
  $('go').addEventListener('click', runList); $('ago').addEventListener('click', runAuthor); $('anew').addEventListener('click', resetAuthor); $('ping').addEventListener('click', ping); $('self').addEventListener('click', selfCheck); $('copy').addEventListener('click', copyList); $('acopy').addEventListener('click', copyAuthor);
  $('list').addEventListener('input', () => { countEntries(); saveState(true); }); $('author').addEventListener('input', () => { showParsed(); saveState(true); });
  $('author').addEventListener('keydown', e => { if (e.key === 'Enter') runAuthor(); });
  // организация помогает выбрать автора: если кандидаты уже показаны — пересортировать их
  $('org').addEventListener('change', () => { if (AU.cands && !(AU.prof && !AU.prof.err)) { rankCands(AU); renderAuthor(); } saveState(true); });
  // 0.9, правка 3: подстраницы результата (#author, #journals, #list) — кнопки «Назад» и «Вперёд» браузера работают
  window.addEventListener('hashchange', () => { applyView(viewFromHash()); window.scrollTo(0, 0); });
  // строка состояния поиска видна и на подстранице результата
  [['status', 'statusR'], ['astatus', 'astatusR'], ['jstatus', 'jstatusR']].forEach(([a, b]) => { const m = () => { $(b).innerHTML = $(a).innerHTML; }; new MutationObserver(m).observe($(a), { childList: true, characterData: true, subtree: true }); });
  initJsug();
  try { $('oaKey').value = localStorage.getItem('pc_oaKey') || ''; $('orcidToken').value = localStorage.getItem('pc_orcidToken') || ''; } catch (e) { }
  if (OA_BUILTIN) { $('oaKey').placeholder = 'встроенный ключ уже подключён — поле можно не заполнять'; }
  if (ORCID_BUILTIN) { $('orcidToken').placeholder = 'встроенный токен уже подключён — поле можно не заполнять'; $('orcidNote').textContent = 'В эту сборку встроен токен ORCID. Своё значение в поле заменит его только в этом браузере.'; }
  // правка 1 (0.8): организация не хранится между сеансами — прежнее сохранённое значение удаляется
  try { localStorage.removeItem('pc_org'); } catch (e) { }
  if (!ocrAvailable()) { $('drop').innerHTML = 'Распознавание снимков в эту сборку не включено — вставьте список текстом.'; $('afile').style.display = 'none'; }
  try { const uc = LS.get('pc_useCache'); if (uc === false) $('useCache').checked = false; } catch (e) { }
  updateNav();
  await loadData();
  if (REF) { offerRestore(); setTimeout(() => { try { jIndex(); } catch (e) { } }, 300); }  // указатель названий для подсказок — заранее
  applyView(viewFromHash());
  cacheInfo();
}
async function cacheInfo() { CACHE.on = $('useCache').checked && typeof indexedDB !== 'undefined'; const n = CACHE.on ? await cacheCount() : 0; $('cacheInfo').textContent = CACHE.on ? (n ? `в кеше ответов: ${n}` : 'кеш пуст') : 'кеш не используется'; }
/* Справочники: в одной странице — внутри, на сайте — файл data/ref.json (около 8 МБ) с показом хода загрузки и ограничением по времени */
async function loadData() {
  const btns = ['go', 'ago', 'jgo'];
  try {
    const el = $('ref-data'); let data;
    if (el) data = JSON.parse(el.textContent);
    else {
      btns.forEach(b => $(b).disabled = true);
      const info = t => { $('refinfo').textContent = t; };
      info('Загружаю справочники SCImago и Белого списка (около 4 МБ, один раз — дальше из кеша браузера)…');
      const r = await tfetch('data/ref.json?v=' + VERSION, {}, 120000); if (!r.ok) throw new Error('сайт ответил ' + r.status);
      const total = r.headers.get('content-encoding') ? 0 : (+r.headers.get('content-length') || 0);  // сжатый ответ: длина дана в сжатом виде — итог не показываем
      if (r.body && r.body.getReader) {
        const rd = r.body.getReader(), parts = []; let got = 0;
        for (;;) { const { done, value } = await rd.read(); if (done) break; parts.push(value); got += value.length; info(`Загружаю справочники: ${Math.round(got / 1e6 * 10) / 10} МБ${total ? ' из ' + Math.round(total / 1e6 * 10) / 10 : ''}…`); }
        const all = new Uint8Array(got); let o = 0; parts.forEach(p => { all.set(p, o); o += p.length; }); data = JSON.parse(new TextDecoder().decode(all));
      } else data = await r.json();
    }
    loadRef(data);
  } catch (e) { $('refinfo').innerHTML = chip('unk', 'справочники не загружены') + ' ' + esc(e.message || e) + '. Поиск статей не работает, «Проверить связь» работает. <button class="sec small" onclick="loadData()">Повторить</button>'; return; }
  btns.forEach(b => $(b).disabled = false);
  $('refinfo').textContent = `Справочники: SCImago за ${REF.sjYears[0]}–${REF.sjYear} годы (${REF.sj.length} изданий), Белый список на ${REF.wlDate} (${REF.wl.length} изданий)${scHas() ? `, список источников Scopus ${REF.scDate} (${REF.sc.length} изданий)` : ''}${csHas() ? `, CiteScore Scopus ${REF.csYear} (${REF.cs.length} изданий)` : ''}.`;
  if (scHas()) $('jsc').textContent = ', список источников Scopus' + (csHas() ? ', CiteScore' : '');
  renderSources();
}
const W = { entries: null, works: [], pubs: [], netDown: '', auto: null, dups: [] };
const newS = () => ({ prof: null, cands: null, orcCands: null, similar: null, msgs: [], parsed: null, orcIds: null, hx: [] });
let AU = newS();
const stOf = () => AU;
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
/* Плохо распознанный снимок не вставляется молча: показывается крупная пометка, текст можно вставить кнопкой (правка 4, 0.7.11) */
const OCR_MIN_CONF = 60, OCR_MIN_RATIO = 0.35;
const ocrBad = r => r.conf < OCR_MIN_CONF || (r.q && r.q.words >= 8 && r.q.ratio < OCR_MIN_RATIO);
let PENDING_OCR = '';
function addText(t) { $('list').value = ($('list').value.trim() ? $('list').value.trim() + '\n' : '') + String(t).trim() + '\n'; countEntries(); saveState(true); }
function insertPending() { if (PENDING_OCR) addText(PENDING_OCR); PENDING_OCR = ''; $('ocrwarn').innerHTML = ''; $('ocrmsg').innerHTML += ' <b>Плохо распознанный текст вставлен — исправьте его по снимку.</b>'; }
async function addImages(files) {
  if (!files.length || BUSY) return; BUSY = true; $('ocrwarn').innerHTML = ''; PENDING_OCR = '';
  try {
    for (let i = 0; i < files.length; i++) {
      $('ocrmsg').textContent = `Распознаю снимок ${i + 1} из ${files.length}… (первый раз — до минуты)`;
      const r = await ocrImage(files[i]);
      if (ocrBad(r)) {
        PENDING_OCR += (PENDING_OCR ? '\n' : '') + r.text.trim();
        $('ocrmsg').textContent = '';
        $('ocrwarn').innerHTML = `<div class="ocrwarn"><b>Снимок распознан плохо (уверенность ${r.conf} %${r.q && r.q.words ? ', читаемых слов ' + Math.round(r.q.ratio * 100) + ' %' : ''})</b> — текст в список не вставлен, чтобы не искать мусор. Увеличьте снимок (страницу в браузере — Ctrl и «+») или скопируйте текст со страницы${r.small ? '; снимок мелкий — нужна ширина от 1200 точек' : ''}. <button class="sec small" onclick="insertPending()">Всё равно вставить распознанный текст</button></div>`;
        continue;
      }
      addText(r.text);
      $('ocrmsg').innerHTML = `Снимок распознан${r.table ? ' как таблица' : ''} (уверенность ${r.conf} %). <b>Сверьте текст со снимком и поправьте ошибки</b> — особенно названия статей, годы и DOI.` + (r.small ? ' Снимок мелкий (уже 1200 точек): лучше сделать его крупнее или вставить текст.' : '');
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
function curOpt() { return { leaderIds: auIds() }; }
function rejudge() { const opt = curOpt(); W.opt = opt; W.pubs = W.entries.map((e, i) => { const p = judgePub(e, W.works[i], opt); if (W.works[i] === undefined && !e.patent) p.notes = [W.netDown ? 'запрос не выполнен: ' + W.netDown : (W.stopped ? 'не проверена — поиск остановлен; нажмите «Повторить ненайденные»' : 'не проверена')]; return p; }); W.dups = findDuplicates(W.pubs); }
function renderAll() { renderList(); renderAuthor(); renderJournals(); updateNav(); if (W.entries) retryVis(); }

/* Правка 2: раздел науки по-русски (справочник subfields.js); точная тема OpenAlex — в подсказке */
function topicsHtml(a) {
  const ts = a.topics || []; if (!ts.length) return '<span class="dim">нет данных</span>';
  const by = new Map();
  ts.forEach(t => { const sub = (t && (t.sub || t.name)) || String(t || ''); if (!sub) return; const o = by.get(sub) || []; const nm = t && t.name ? t.name : String(t || ''); if (nm && nm !== sub) o.push(nm); by.set(sub, o); });
  const out = [...by.entries()].slice(0, 3);
  if (!out.length) return '<span class="dim">нет данных</span>';
  return out.map(([sub, names]) => `<span class="topic" title="${esc('OpenAlex: ' + (names.length ? names.join('; ') : sub))}">${esc(subRu(sub))}</span>`).join('');
}
/* Правка 5: длинное примечание — коротким словом с подсказкой, полный текст под «подробнее» */
const NOTE_SHORT = [[/^возможный дубль/, 'возможный дубль'], [/не совпадает с годом в базе/, 'год не совпадает'], [/совпадает с записью не полностью/, 'совпадение неполное'],
  [/DOI из списка/, 'DOI не найден'], [/несколько изданий с таким ISSN/, 'издание неоднозначно'], [/издание найдено по названию/, 'найдено по названию'],
  [/исключено из Белого списка/, 'исключено из Белого списка'], [/сайт Белого списка отвечает иначе/, 'сайт БС отвечает иначе'], [/это разные показатели/, 'импакт-фактор расходится'],
  [/не найдено — проверьте вручную/, 'не найдена'], [/ближайшая найденная статья не похожа/, 'варианты не подошли'], [/в SCImago издание есть только до/, 'в SCImago данных за год нет'],
  [/взят \d{4} год/, 'взят ближайший год'], [/в списке нет №/, 'пропущен номер в списке'], [/поиск остановлен/, 'не проверена — остановлено'], [/^патент/, 'патент — не ищется'],
  [/в SCImago тип издания/, 'в SCImago не журнал'], [/статья выбрана вручную/, 'выбрана вручную'], [/примечание Белого списка/, 'примечание Белого списка']];
/* Удобство 11: причина пометки — короткой фразой прямо в строке; полный текст — в подсказке и под «подробнее» */
function notesHtml(notes) {
  if (!notes.length) return '';
  const shorts = [], longs = [];
  notes.forEach(n => {
    const m = NOTE_SHORT.find(x => x[0].test(n)), dub = /^возможный дубль/.test(n);
    if (!m || n.length <= 60) { if (!m && n.length > 60) { shorts.push(`<span title="${esc(n)}">${esc(n.slice(0, 50))}…</span>`); longs.push(n); return; } shorts.push(dub ? chip('check', 'дубль?') + ' ' + esc(n) : esc(n)); return; }
    shorts.push(`<span title="${esc(n)}">${dub ? chip('check', 'дубль?') + ' ' : ''}${esc(m ? m[1] : n.slice(0, 50) + '…')}</span>`); longs.push(n);
  });
  return shorts.join('<br>') + (longs.length ? `<details class="mini"><summary>подробнее</summary><span class="dim">${longs.map(esc).join('<br>')}</span></details>` : '');
}

/* ----- 0.9, правки 1 и 3: подстраницы результата и вкладки ----- */
/* Результат открывается на своей подстранице (#author, #journals, #list); «← Новый поиск» — к вводу, введённое сохраняется */
const VIEWS = ['author', 'journals', 'list'];
const VIEW_OF = { outList: 'list', vList: 'list', outAuthor: 'author', vAuthor: 'author', auWorks: 'author', hxPanel: 'author', outJournal: 'journals', vJournal: 'journals' };
const viewFromHash = () => { const h = String(location.hash || '').replace(/^#/, ''); return VIEWS.indexOf(h) >= 0 ? h : 'home'; };
const viewHas = v => v === 'list' ? !!W.entries : (v === 'author' ? !!(AU.prof || AU.cands || AU.orcCands || (AU.msgs && AU.msgs.length) || AU.parsed) : (v === 'journals' ? JR.rows.length > 0 : true));
function applyView(v) { if (v !== 'home' && !viewHas(v)) v = 'home'; document.body.dataset.view = v; updateNav(); }
function setView(v) { if (v !== 'home' && !viewHas(v)) v = 'home'; if (viewFromHash() !== v) location.hash = v === 'home' ? '' : v; applyView(v); }
/* После действия страница сама показывает свой результат; id элемента → подстраница, на ней — прокрутка к элементу */
function goTo(id) {
  const v = VIEW_OF[id] || 'home', was = document.body.dataset.view; setView(v);
  const el = $(id); if (!el) return;
  if (id === 'outList' || id === 'outAuthor' || id === 'outJournal' || (v === 'home' && was !== 'home')) { window.scrollTo(0, 0); return; }
  try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { el.scrollIntoView(); }
}
/* Вкладки подстраницы — в порядке разделов: Автор · Журналы · Публикации; появляются, когда есть что показать */
function navItems() {
  const out = [];
  if (viewHas('author')) out.push({ v: 'author', t: 'Автор', n: AU.prof && !AU.prof.err ? AU.prof.js.length : null });
  if (JR.rows.length) out.push({ v: 'journals', t: 'Журналы', n: JR.rows.length });
  if (W.entries) out.push({ v: 'list', t: 'Публикации', n: W.pubs.length });
  return out;
}
function updateNav() {
  const b = $('tabs'); if (!b) return; const cur = document.body.dataset.view;
  b.innerHTML = navItems().map(x => `<a href="#${x.v}"${x.v === cur ? ' class="on"' : ''}>${esc(x.t)}${x.n != null ? '<b>' + x.n + '</b>' : ''}</a>`).join('');
}
function navScroll() { }

/* ----- Режим 1: список публикаций ----- */
/* Удобство 4: прогресс «обработано 12 из 30» и «Остановить»; удобство 2: ответы из кеша браузера; патенты не ищутся */
let STOP = false;
const progHtml = (i, n, what) => `${what} ${i} из ${n} <span class="prog"><span style="width:${n ? Math.round(i / n * 100) : 0}%"></span></span>`;
async function findOne(entry) {
  const work = await findWork(entry);
  if (work && (work.via === 'doi' || work.score >= FOUND_NEAR)) { if (work.doi) await enrichOA(work, []); await enrichWL(work); }
  return work;
}
const cacheNote = () => CACHE.hits ? ` Из кеша браузера: ${CACHE.hits} ответ${CACHE.hits % 10 === 1 && CACHE.hits % 100 !== 11 ? '' : (CACHE.hits % 10 >= 2 && CACHE.hits % 10 <= 4 && (CACHE.hits % 100 < 10 || CACHE.hits % 100 >= 20) ? 'а' : 'ов')} баз (сохранены с ${new Date(CACHE.oldest).toLocaleDateString('ru-RU')}; свежие — «Связь и настройки» → «Очистить кеш»).` : '';
async function runList() {
  if (BUSY || !REF) return;
  const entries = splitEntries($('list').value);
  if (!entries.length) { $('status').textContent = 'Список пуст: вставьте текст или снимок.'; return; }
  BUSY = true; STOP = false; $('go').disabled = true; $('stop').style.display = ''; $('stop').disabled = false; $('retry').style.display = 'none'; applyNet(); NET.log = []; CACHE.hits = 0; CACHE.oldest = 0; goTo('status');
  const works = []; let netDown = '', done = 0;
  for (let i = 0; i < entries.length; i++) {
    $('status').innerHTML = progHtml(i, entries.length, 'Обработано');
    let work; const m0 = CACHE.miss;
    if (netDown || STOP || entries[i].patent) work = undefined;
    else { try { work = await findOne(entries[i]); done++; } catch (e) { work = undefined; netDown = e.message; } }
    works.push(work); if (work !== undefined && (!CACHE.on || CACHE.miss > m0)) await sleep(NET.pause);
  }
  W.entries = entries; W.works = works; W.netDown = netDown; W.stopped = STOP; W.auto = null; W.numbered = entries.some(e => e.num != null);
  // если автор ещё не выбран, а у статей списка есть общий автор — показать его публикации сразу
  if (!netDown && !STOP && !AU.prof && !$('author').value.trim()) await autoLeader(works);
  rejudge(); renderAll(); BUSY = false; $('go').disabled = false; $('stop').style.display = 'none'; goTo('outList');
  $('status').textContent = (netDown ? 'Поиск неполный: ' + netDown + '. Нажмите «Проверить связь».' : (STOP ? `Остановлено: проверено ${done} из ${entries.length}. «Повторить ненайденные» доищет остальные.` : 'Готово.')) + cacheNote();
  retryVis(); saveState();
}
/* Общий автор статей списка. Если явного нет, а указана организация — автор, у которого она совпала (правка 1) */
async function autoLeader(works) {
  const det = detectLeader(works, []); let chosen = det.how === 'auto' ? det.chosen : null, how = 'общий автор статей из списка — проверьте, что это нужный человек';
  const org = $('org').value.trim();
  if (!chosen && org && det.works >= 2) { const big = det.cands.filter(a => a.count >= Math.max(2, Math.ceil(det.works * 0.6))); const r = leaderByOrg(works, big, org); if (r.hit === 'yes' && r.list.length === 1) { chosen = r.list; how = 'общий автор статей из списка, у которого совпала организация — проверьте, что это нужный человек'; } }
  if (!chosen) return;
  W.auto = chosen[0].name; AU = newS(); await loadProfile(AU, chosen.map(a => a.id), how); await fetchOrcidIds(AU);
}
/* Удобство 3: повторить поиск только для ненайденных (и не проверенных), без кеша — свежим запросом */
const missIdx = () => W.entries && W.pubs ? W.pubs.map((p, i) => i).filter(i => !W.entries[i].patent && (W.works[i] === undefined || W.works[i] === null || W.pubs[i].found === 'no')) : [];
function retryVis() { const n = missIdx().length; $('retry').style.display = n && !BUSY ? '' : 'none'; $('retry').textContent = `Повторить ненайденные (${n})`; }
async function retryMissing() {
  if (BUSY) return; const idx = missIdx(); if (!idx.length) return;
  BUSY = true; STOP = false; $('go').disabled = true; $('retry').style.display = 'none'; $('stop').style.display = ''; $('stop').disabled = false; applyNet(); NET.noCache = true; let netDown = '', k = 0;
  for (const i of idx) {
    $('status').innerHTML = progHtml(k++, idx.length, 'Повторно обработано');
    if (STOP || netDown) break;
    try { const w = await findOne(W.entries[i]); if (w !== undefined) W.works[i] = w; } catch (e) { netDown = e.message; }
    await sleep(NET.pause);
  }
  NET.noCache = false; W.netDown = netDown; W.stopped = STOP;
  rejudge(); renderAll(); BUSY = false; $('go').disabled = false; $('stop').style.display = 'none';
  const left = missIdx().length; $('status').textContent = netDown ? 'Повтор неполный: ' + netDown + '.' : `Повтор готов: найдено ${idx.length - left} из ${idx.length}.`;
  retryVis(); saveState(); goTo('outList');
}
const nchip = t => `<span class="chip n">${esc(t)}</span>`;
const qChip = (q, big) => q ? `<span class="chip n${big ? ' cbig' : ''}">Q${q}</span>` : chip('unk', 'нет квартиля');
const lnk = (u, t) => `<a target="_blank" rel="noopener" href="${esc(u)}">${esc(t || u)}</a>`;
/* Номер записи: из списка; если список нумерованный, а у записи номера нет — прочерк */
const numOf = (e, i) => e.num != null ? e.num : (W.numbered ? '—' : i + 1);

/* ----- Квартиль и Белый список на год публикации, рядом текущее ----- */
/* Индексация издания по данным Белого списка (WoS Core Collection, Scopus, RSCI) */
function idxText(wl, sc, year) {
  const f = (n, v) => `${n} ${v ? '✓' : '—'}`;
  let h = !wl ? '<span class="dim">индексация: нет данных (издания нет в Белом списке)</span>' : `<span class="dim" title="по данным Белого списка">индексация: ${f('WoS CC', wl.wos)} · ${f('Scopus', wl.scopus)} · ${f('RSCI', wl.rsci)}</span>`;
  return h + scText(sc, year);
}
/* Строка о Scopus по списку источников Scopus (0.8, правка 3): индексируется ли, годы, исключён, принят */
function scText(sc, year) {
  if (!scHas()) return '';
  if (!sc) return `<div class="dim" title="Scopus Source List, ${esc(REF.scDate)}">в списке источников Scopus нет</div>`;
  const a = scAt(sc, year), bad = a.inCov === false || a.afterDisc || sc.status === 2 || sc.disc || sc.flag;
  return `<div class="dim" title="Scopus Source List, ${esc(REF.scDate)}">${bad ? chip('check', 'Scopus') : 'Scopus:'} ${esc(scStatusText(sc))}${a.inCov === false ? ' — <b>в ' + year + ' году не индексировался</b>' : ''}${a.afterDisc ? ' — <b>статья позже последнего номера</b>' : ''}${sc.id ? ' · ' + lnk(scLink(sc), 'страница в Scopus') : ''}</div>`;
}
/* Где посмотреть квартиль самому: открытого источника квартиля WoS (JCR) и CiteScore нет */
const firstIssn = issns => { const x = (issns || []).map(normIssn).filter(Boolean)[0]; return x ? fmtIssn(x) : ''; };
const scopusSource = sid => 'https://www.scopus.com/sourceid/' + sid;
function extLinks(issns) {
  const is = firstIssn(issns);
  return [is ? lnk('https://mjl.clarivate.com/search-results?issn=' + is, 'есть ли в WoS') : '', lnk('https://jcr.clarivate.com/', 'JCR'), lnk('https://www.scopus.com/sources.uri', 'Scopus Sources')].filter(Boolean).join(' · ') + (is ? ` (ISSN ${is})` : '');
}
function quartText(jv, sj, short, wl, issns) {
  if (!sj) return chip('unk', 'нет в SCImago') + (jv && jv.sc ? `<div class="dim">в Scopus есть, квартиля SCImago нет${jv.sc.id ? ' · ' + lnk(scLink(jv.sc), 'Scopus') : ''}</div>` : '') + (short ? '' : `<div class="dim">квартиль WoS${jv && jv.cs ? '' : ' и CiteScore'} утилита не получает — посмотрите сами: ${extLinks(issns)}</div>`);
  // 0.9: у каждого значения — год: «Q1 в 2021» (год публикации) и «Q1 сейчас (2025)»
  const qq = q => q ? `<span class="q">Q${q}</span>` : chip('unk', 'без квартиля');
  let h = `<div class="qc">${qq(jv.qY)} <span class="dim">в ${jv.sjYear}${jv.sjExact ? '' : ' — за год публикации данных нет'}</span>`;
  if (jv.yL !== jv.sjYear) h += `<br>${jv.qL !== jv.qY ? chip('check', jv.qL ? 'Q' + jv.qL : 'без квартиля') : qq(jv.qL)} <span class="dim">сейчас (${jv.yL})</span>`;
  else h += ` <span class="dim">(сейчас)</span>`;
  h += '</div>';
  if (!short) h += `<details class="mini"><summary>по годам</summary>${yearChips(sj, jv.sjYear, 0)}</details>`;
  return h + `<div class="dim">${lnk(`https://www.scimagojr.com/journalsearch.php?q=${sj.sid}&tip=sid`, 'SCImago')} · ${lnk(scopusSource(sj.sid), 'Scopus')}${short ? '' : ' · ' + extLinks(issns).split(' · ')[0]}</div>`;
}
/* Квартиль SCImago по годам — плашками «2021 Q1»; год публикации обведён. last — сколько последних лет (0 — все) */
function yearChips(sj, mark, last) {
  if (!sj || !sj.hist) return '';
  let ys = Object.keys(sj.hist).map(Number).sort((a, b) => a - b); if (last) ys = ys.slice(-last);
  return '<div class="yrs">' + ys.map(y => `<span class="yq${y === mark ? ' pub' : ''}" title="${esc('SCImago ' + y + (sj.hist[y].cpd != null ? ', импакт-фактор ' + fmtNum(sj.hist[y].cpd) : ''))}"><span class="y">${y}</span><b>${sj.hist[y].q ? 'Q' + sj.hist[y].q : '—'}</b></span>`).join('') + '</div>';
}
/* CiteScore Scopus (0.9, правка 6): число — ссылка на страницу издания в Scopus, подпись Elsevier — в подсказке.
   Отдельный показатель за последний год («сейчас»); квартиль SCImago не заменяет. */
const csTip = cs => csSrc(cs) + '. Квартиль — наилучший по тематикам Scopus' + (cs.best ? ` (${cs.best.name}, ${cs.best.pct}-й процентиль)` : '') + '. Нажмите — страница издания в Scopus.';
function csCell(cs) {
  if (!csHas()) return '';
  if (!cs) return `<span class="dim" title="${esc('нет в справочнике ' + csSrc(null))}">—</span>`;
  return `<a class="csv" target="_blank" rel="noopener" href="${esc(csLink(cs))}" title="${esc(csTip(cs))}">${esc(csShort(cs))}</a>` + (cs.best ? `<div class="dim">${esc(cs.best.name)} · ${cs.best.pct}-й процентиль</div>` : '');
}
const csSubsHtml = cs => `<table>${cs.subs.map(x => `<tr><td>${esc(x.name)}</td><td class="n">Q${x.q}</td><td class="n" title="процентиль">${x.pct}</td><td class="n" title="место в тематике">${x.rank} из ${x.of}</td></tr>`).join('')}</table>`;
/* Строка CiteScore под основными числами журнала */
function csLine(cs, sjQ) {
  if (!csHas()) return '';
  if (!cs) return `<div class="cs"><span class="cap">Scopus · CiteScore ${REF.csYear}</span> &nbsp;<span class="dim">нет в справочнике CiteScore</span></div>`;
  const b = cs.best, more = cs.subs.length - 1;
  return `<div class="cs"><span class="cap">Scopus · CiteScore ${cs.year}</span> &nbsp;<a class="csv" target="_blank" rel="noopener" href="${esc(csLink(cs))}" title="${esc(csTip(cs))}">${esc(csShort(cs))}</a>`
    + (b ? ` &nbsp;${esc(b.name)} · ${b.pct}-й процентиль · ${b.rank} из ${b.of}` : '')
    + (more > 0 ? `<details class="mini"><summary>ещё ${more} ${more === 1 ? 'тематика' : (more < 5 ? 'тематики' : 'тематик')}</summary>${csSubsHtml(cs)}</details>` : '')
    + (cs.snip != null ? ` &nbsp;· SNIP <span class="mono">${fmtNum(Math.round(cs.snip * 1000) / 1000)}</span>` : '')
    + (sjQ && cs.q && sjQ !== cs.q ? ` &nbsp;· <span title="квартиль SCImago и квартиль по CiteScore считаются по-разному — это не ошибка">у SCImago Q${sjQ} — другой показатель</span>` : '') + '</div>';
}
function wlText(wl, year, short) {
  if (!wl) return nchip('нет в списке');
  const a = wlAt(wl, year), before = year && year < 2023; let h;
  if (a.excluded) h = chip('check', 'исключён ' + wl.disc);
  else if (a.ambiguous) h = chip('check', (a.lv ? 'уровень ' + a.lv : 'без уровня') + ', исключён в год публикации');
  else h = nchip(a.lv ? 'уровень ' + a.lv : 'без уровня') + (a.y ? ` <span class="dim">${a.y}${a.exact || before ? '' : ' (более ранних данных нет)'}</span>` : '');
  if (before && !a.excluded) h += `<div class="dim">Белого списка до 2023 г. не было; уровень ${a.y || 2023} г. — справочно</div>`;
  if (!a.excluded && (a.curExcl || a.cur !== a.lv)) h += `<br>${chip('check', a.curExcl ? 'сейчас исключён ' + wl.disc : 'сейчас ' + (a.cur ? 'уровень ' + a.cur : 'без уровня'))}`;
  const lv = Object.entries(wl.levels).filter(x => x[1]);
  if (!short && new Set(lv.map(x => x[1])).size > 1) h += '<div class="dim">по годам: ' + lv.map(x => `${x[0]} — ${x[1]}`).join(', ') + '</div>';
  return h + (short ? `<div class="dim">${wlLink(wl)}</div>` : '');
}
const wlLink = wl => lnk(`https://journalrank.rcsi.science/api/record-sources/${fmtIssn(wl.issns[0] || '')}/level`, 'запись');
function wlCell(p) { const wl = p.j.wl; return wlText(wl, p.work.year) + (wl ? `<div class="dim" title="справочник от ${REF.wlDate}">${wlLink(wl)}${p.jv.wlLive ? ' · ' + (p.jv.wlDiff ? 'сайт отвечает иначе — см. примечания' : 'сайт ✓') : ''}</div>` : (p.jv.wlLive && p.jv.wlDiff ? '<div class="dim">сайт отвечает иначе — см. примечания</div>' : '')); }
/* «Импакт-фактор» — это «цитирований на документ за 2 года» SCImago на год публикации; рядом текущий, OpenAlex и значение из списка */
function ifCell(p) {
  const jv = p.jv; let h = jv.cpd != null ? `<span class="big">${fmtNum(jv.cpd)}</span> <span class="dim">${jv.sjYear}</span>` + (jv.yL !== jv.sjYear && jv.cpdLast != null ? `<div class="dim">сейчас ${fmtNum(jv.cpdLast)} (${jv.yL})</div>` : '') : chip('unk', 'нет в SCImago');
  if (jv.oaCpd != null) h += `<div class="dim">OpenAlex, сейчас: ${fmtNum(jv.oaCpd)}</div>`;
  if (p.declIF != null) h += `<div class="dim">в списке: ${fmtNum(p.declIF)}</div>`;
  return h;
}
/* Corresponding — как отмечено в базе; если не отмечен, никого не подставляем */
const aName = a => a ? ([a.given, a.family].filter(Boolean).join(' ') || a.name || '') : '';
function corrArticle(w) {
  const c = w.corr;
  if (!w.oa) return chip('unk', 'corresponding: нет данных') + ' <span class="dim">(OpenAlex не ответил по этой статье)</span>';
  if (!c || !c.known) return chip('unk cbig', 'Corresponding: в базе не указан');
  return '<span class="dim">Corresponding:</span> <b>' + esc(c.names.join(', ') || 'отмечен, имя не указано') + '</b> <span class="dim">(OpenAlex)</span>';
}
/* Найденный автор в статье: corresponding ли он и от какой организации */
const CORR_T = { yes: 'да', no: 'нет', unk: 'в базе не указан' };
const CORR_C = { yes: 'ok', no: 'no', unk: 'unk' };
const corrBig = st => chip((CORR_C[st] || 'unk') + ' cbig', 'Corresponding — ' + (CORR_T[st] || 'нет данных'));
const corrChip = (st, others) => st === 'yes' ? chip('ok', 'да') : (st === 'no' ? chip('no', 'нет') + (others && others.length ? ` <span class="dim">— ${esc(others.join(', '))}</span>` : '') : (st === 'unk' ? chip('unk', 'в базе не указан') : chip('unk', 'нет данных')));
/* Организация автора в статье — только как факт; сверка по каждой статье убрана (правка 3, 0.7.11) */
const orgNames = me => instNames(me).slice(0, 3);
function listMe(w) { const ids = auIds(); if (!ids.length || !w.oaAuthors) return null; return { me: w.oaAuthors.find(a => ids.indexOf(a.id) >= 0) || null, corr: corrOf(w.oaAuthors, ids), others: w.oaAuthors.filter(a => a.corr && ids.indexOf(a.id) < 0).map(a => a.name) }; }
function authorsCell(p) {
  const w = p.work, a = w.authors || [], f = aName(a[0]), l = a.length > 1 ? aName(a[a.length - 1]) : '';
  const m = listMe(w), nm = AU.prof && !AU.prof.err ? ((AU.prof.info[0] || {}).name || 'найденный автор') : ''; let h = '';
  if (m && m.me) {
    h += corrBig(m.corr) + `<div><b>${esc(nm)}</b></div>`;
    const on = orgNames(m.me); h += `<div class="dim">${on.length ? esc(on.join('; ')) : 'организация в базе не указана'}</div>`;
    if (m.corr === 'no' && m.others.length) h += `<div class="dim">corresponding: ${esc(m.others.join(', '))}</div>`;
  } else if (m) h += chip('check', 'автора нет среди авторов статьи в OpenAlex') + `<div class="dim">${esc(nm)}</div><div>${corrArticle(w)}</div>`;
  else if (nm && w.oa === undefined) h += chip('unk cbig', 'Corresponding — нет данных') + `<div class="dim">${esc(nm)}: OpenAlex не ответил по этой статье</div>`;
  else h += corrArticle(w);
  return h + `<div class="dim">первый: ${f ? esc(f) : 'нет данных'}${l ? ' · последний: ' + esc(l) : ''} · всего: ${a.length || '?'}</div>`;
}

/* ----- Фильтры ----- */
const FLT0 = () => ({ q: [], wl: [], yFrom: 0, yTo: 0, corr: [], ifFrom: 0, org: [] });
const FLT = { list: FLT0(), au: FLT0() };
function rowKey(year, j, jv) { if (!j) return { y: year }; const a = j.wl ? wlAt(j.wl, year) : null; return { y: year, qY: j.sj ? (jv.qY || 0) : 0, wl: a ? (a.excluded ? 0 : a.lv) : null, excl: !!(a && a.excluded), cpd: jv && jv.cpd != null ? jv.cpd : null }; }
const profKey = x => Object.assign(rowKey(x.w.year, x.j, x.jv), { corr: x.corrSt || 'unk' });
function listKey(p) { if (!p.work) return {}; const k = rowKey(p.work.year, p.j, p.jv), m = listMe(p.work); k.corr = m && m.me ? m.corr : 'unk'; return k; }
const reFlt = id => id === 'list' ? renderList() : renderAuthor();
function filterBar(id, shown, total, noCpd) {
  const f = FLT[id], corrOff = id === 'list' && !auIds().length;
  const pill = (grp, v, t, dis) => `<label class="pill${f[grp].indexOf(v) >= 0 ? ' on' : ''}${dis ? ' off' : ''}"${dis ? ' title="заработает, когда найден автор (раздел 2)"' : ''}><input type="checkbox" ${f[grp].indexOf(v) >= 0 ? 'checked' : ''} ${dis ? 'disabled' : ''} onchange="setFlt('${id}','${grp}','${v}',this.checked)">${t}</label>`;
  const num = (k, ph, step) => `<input type="number" class="yr"${step ? ` step="${step}" min="0"` : ''} value="${f[k] || ''}" placeholder="${ph}" onchange="setFltY('${id}','${k}',this.value)">`;
  const active = f.q.length || f.wl.length || f.yFrom || f.yTo || f.corr.length || f.ifFrom;
  const pre = (k, t) => `<button class="preset${presetOn(f, k) ? ' on' : ''}" onclick="setPreset('${id}','${k}')" title="квартиль SCImago и уровень Белого списка — на год публикации; CiteScore не учитывается. Ещё нажатие — снять">${t}</button>`;
  return `<div class="fbar noprint"><div class="fr"><span class="grp"><span class="gl">Наборы</span>${pre('q12', 'Q1–Q2 или БС 1')}${pre('q1', 'Q1 или БС 1')}</span></div><div class="fr"><span class="grp"><span class="gl">Квартиль</span>${['1', '2', '3', '4'].map(v => pill('q', v, 'Q' + v)).join('')}${pill('q', 'none', 'нет')}</span><span class="or">или</span><span class="grp"><span class="gl">Белый список</span>${['1', '2', '3', '4'].map(v => pill('wl', v, v)).join('')}${pill('wl', 'none', 'нет')}${pill('wl', 'excl', 'исключён')}</span>`
    + `<span class="fright"><span class="cnt">Показано <b>${shown}</b> из ${total}${f.ifFrom && noCpd ? ` · без импакт-фактора (нет в SCImago) скрыто ${noCpd}` : ''}</span>${active ? `<button class="linkbtn" onclick="resetFlt('${id}')">Сбросить</button>` : ''}<details class="fhelp"><summary title="Как работает фильтр">?</summary><div>Квартиль, уровень и импакт-фактор — на год публикации. Отмеченные квартили и уровни объединяются через «или» («Q1» + «1» — статьи, у которых Q1 или 1 уровень Белого списка); годы, импакт-фактор и corresponding — дополнительные условия «и». Импакт-фактор здесь — «цитирований на документ за 2 года» SCImago, это не импакт-фактор WoS.${corrOff ? ' Фильтр corresponding в этой таблице заработает, когда найден автор (раздел 2).' : ''}</div></details></span></div>`
    + `<div class="fr"><span class="grp"><span class="gl">Годы</span>${num('yFrom', 'с')} – ${num('yTo', 'по')}</span><span class="grp"><span class="gl">Импакт-фактор от</span>${num('ifFrom', 'любой', '0.1')}</span><span class="grp"><span class="gl">Corresponding</span>${pill('corr', 'yes', 'да', corrOff)}${pill('corr', 'no', 'нет', corrOff)}${pill('corr', 'unk', 'не указан', corrOff)}</span>`
    + `</div></div>`;
}
/* 0.9, правка 4: кнопки-наборы фильтра. Выставляют только квартиль и уровень Белого списка (они объединяются через «или»);
   годы, импакт-фактор и corresponding не трогают. Кнопка подсвечена, когда фильтр совпадает с набором — в том числе выставленный вручную. */
const PRESETS = { q12: { q: ['1', '2'], wl: ['1'] }, q1: { q: ['1'], wl: ['1'] } };
const sameSet = (a, b) => a.length === b.length && a.every(x => b.indexOf(x) >= 0);
const presetOn = (f, k) => sameSet(f.q, PRESETS[k].q) && sameSet(f.wl, PRESETS[k].wl);
function setPreset(id, k) { const f = FLT[id]; if (presetOn(f, k)) { f.q = []; f.wl = []; } else { f.q = PRESETS[k].q.slice(); f.wl = PRESETS[k].wl.slice(); } reFlt(id); saveState(true); }
function setFlt(id, grp, v, on) { const a = FLT[id][grp], i = a.indexOf(v); if (on && i < 0) a.push(v); if (!on && i >= 0) a.splice(i, 1); reFlt(id); saveState(true); }
function setFltY(id, k, v) { FLT[id][k] = k === 'ifFrom' ? (parseFloat(String(v).replace(',', '.')) || 0) : (+v || 0); reFlt(id); saveState(true); }
function resetFlt(id) { FLT[id] = FLT0(); reFlt(id); saveState(true); }
const listFlt = () => auIds().length ? FLT.list : Object.assign({}, FLT.list, { corr: [] });
const listRows = () => sortRows(W.pubs.map((p, i) => ({ p, i })).filter(({ p }) => passFilter(listKey(p), listFlt())), 'list', r => listKey(r.p));
const noCpdHidden = (keys, f) => f.ifFrom ? keys.filter(k => k.cpd == null && passFilter(k, Object.assign({}, f, { ifFrom: 0 }))).length : 0;

/* ----- Варианты для спорных и ненайденных статей: выбирает человек ----- */
function altList(i) { const w0 = W.works[i], p = W.pubs[i]; if (!w0 || !p) return []; if (!p.work) return [w0].concat(w0.alts || []); return p.found === 'check' || w0.via === 'manual' ? (w0.alts || []) : []; }
function altsHtml(i) {
  const L = altList(i); if (!L.length) return '';
  return `<div class="alts"><span class="dim">${W.pubs[i].work ? 'другие варианты' : 'ближайшие варианты'} — если это она, нажмите:</span>` + L.map((w, k) => `<div><button class="sec small" onclick="pickAlt(${i},${k})">Это она</button> ${w.doi ? lnk('https://doi.org/' + w.doi, w.title) : esc(w.title)} <span class="dim">${[w.year, w.journal, w.source === 'OpenAlex' ? 'OpenAlex' : ''].filter(Boolean).map(esc).join(' · ')}</span></div>`).join('') + '</div>';
}
async function pickAlt(i, k) {
  if (BUSY) return; const L = altList(i), c = L[k]; if (!c) return; BUSY = true; applyNet();
  const w0 = W.works[i], rest = [w0].concat(w0.alts || []).filter(x => x !== c);
  const nw = Object.assign({}, c, { via: 'manual', alts: rest.slice(0, 3) }); delete nw.doiMiss;
  try { if (nw.doi) await enrichOA(nw, []); await enrichWL(nw); } catch (e) { }
  W.works[i] = nw; rejudge(); BUSY = false; renderAll(); retryVis(); saveState();
}
/* Поискать статью самому: Google Scholar — с текстом записи, eLibrary — форма поиска */
function searchLinks(e) {
  const q = e.query.replace(/\s+/g, ' ').slice(0, 250);
  return `<div class="dim">поискать самому: ${lnk('https://scholar.google.com/scholar?q=' + encodeURIComponent(q), 'Google Scholar')} · ${lnk('https://elibrary.ru/querybox.asp', 'eLibrary')} (форма поиска — вставьте название)</div>`;
}
const recordHtml = e => `<details class="mini"><summary>запись из списка</summary><span class="dim">${esc(e.raw)}</span></details>`;

function dupNotes(i) { return (W.dups || []).filter(d => d.a === i || d.b === i).map(d => { const o = d.a === i ? d.b : d.a; return `возможный дубль записи № ${numOf(W.pubs[o].entry, o)}: ${d.why}`; }); }
const TH_CS = () => `CiteScore<div class="sub">Scopus ${REF.csYear}, сейчас</div>`;
const TH_Q = 'Квартиль SCImago<div class="sub">на год публикации и сейчас</div>', TH_WL = 'Белый список<div class="sub">на год публикации</div>', TH_IF = 'Импакт-фактор<div class="sub">SCImago, цит. на документ за 2 года</div>';
const patentLink = e => e.patentNo ? lnk('https://patents.google.com/patent/' + e.patentNo, 'патент ' + e.patentNo.replace(/^RU(\d+)/, 'RU $1 ')) : '';
const doneCnt = (keys) => keys.filter(k => MARKS[k]).length;
function renderList() {
  if (!W.entries) { $('outList').innerHTML = ''; $('listOut').style.display = 'none'; return; }
  const pubs = W.pubs, rows = listRows(), dn = doneCnt(pubs.map(markKeyL)); let h = `<h2>Публикации из списка (${pubs.length})${dn ? ` <span class="sub">· проверено ${dn}</span>` : ''}</h2>`;
  if (W.dups.length) h += `<p>${chip('check', 'проверьте')} Возможных дублей в списке: <b>${W.dups.length}</b> — ${W.dups.map(d => `№ ${numOf(pubs[d.a].entry, d.a)} и № ${numOf(pubs[d.b].entry, d.b)} (${esc(d.why)})`).join('; ')}. Утилита ничего не исключает — решите сами.</p>`;
  h += filterBar('list', rows.length, pubs.length, noCpdHidden(pubs.map(listKey), listFlt()));
  const cs = csHas(), nc = cs ? 9 : 8;
  h += `<table class="t pubs"><tr><th style="width:7%">№</th>${sortTh('list', 'year', 'Публикация<div class="sub">сортировка по году</div>', 'width:20%')}<th style="width:12%">Издание</th>${sortTh('list', 'q', TH_Q, 'width:11%')}${sortTh('list', 'wl', TH_WL, 'width:10%')}${sortTh('list', 'if', TH_IF, 'width:9%')}${cs ? `<th style="width:9%">${TH_CS()}</th>` : ''}<th style="width:13%">Авторы</th><th>Примечания</th></tr>`;
  rows.forEach(({ p, i }) => {
    const w = p.work, e = p.entry, notes = p.notes.concat(dupNotes(i)), mk = markKeyL(p), tr = MARKS[mk] ? '<tr class="done">' : '<tr>';
    const nh = notesHtml(notes), num = `<td>${numOf(e, i)}${markBox(mk)}</td>`;
    if (p.found === 'patent') { h += `${tr}${num}<td><span class="dim">${esc(e.raw.length > 220 ? e.raw.slice(0, 220) + '…' : e.raw)}</span><br>${nchip('патент')}${recordHtml(e)}</td><td colspan="${nc - 3}" class="dim">Патент — в Crossref и OpenAlex не ищется, квартиля и импакт-фактора у него нет.${e.patentNo ? ' Посмотреть: ' + patentLink(e) + '.' : ''}</td><td class="notes">${nh}</td></tr>`; return; }
    if (!w) { h += `${tr}${num}<td><span class="dim">${esc(e.raw.length > 220 ? e.raw.slice(0, 220) + '…' : e.raw)}</span><br>${chip('unk', p.found === 'no' ? 'не найдена' : 'не проверена')}${altsHtml(i)}${p.found === 'no' ? searchLinks(e) : ''}</td><td colspan="${nc - 3}" class="dim">${p.found === 'no' ? 'Статья не найдена в открытых базах — квартиль и остальное по ней не определены. Это не значит, что её нет.' : 'Поиск по этой записи не выполнялся.'}</td><td class="notes">${nh}</td></tr>`; return; }
    const url = w.doi ? 'https://doi.org/' + w.doi : (w.oaId ? 'https://openalex.org/' + w.oaId : '');
    let c1 = (url ? lnk(url, w.title) : esc(w.title)).replace('<a ', '<a class="ttl" ') + `<div class="dim">${[w.year || 'год ?', p.typeName, w.doi ? 'DOI ' + lnk(url, w.doi) : 'DOI нет', w.source === 'OpenAlex' ? 'найдена в OpenAlex' : ''].filter(Boolean).join(' · ')}</div>`;
    // удобство 11: причина «проверьте» прямо в пометке
    if (p.found === 'check') c1 += chip('check', `похожая (совпадение ${Math.round((w.score || 0) * 100)} %) — проверьте`);
    c1 += altsHtml(i) + recordHtml(e);
    const jc = `<b>${esc(w.journal || 'издание не указано')}</b>` + (w.issns.length ? '<div class="dim">ISSN ' + w.issns.map(x => esc(fmtIssn(normIssn(x)))).join(', ') + '</div>' : '') + '<div>' + idxText(p.j.wl, p.j.sc, w.year) + '</div>';
    h += `${tr}${num}<td>${c1}</td><td>${jc}</td><td>${quartText(p.jv, p.j.sj, false, p.j.wl, w.issns)}${p.declQ ? `<div class="dim" title="квартиль, указанный в списке или документе — для сравнения">в списке: Q${p.declQ}</div>` : ''}</td><td>${wlCell(p)}</td><td>${ifCell(p)}</td>${cs ? `<td>${csCell(p.j.cs)}</td>` : ''}<td>${authorsCell(p)}</td><td class="notes">${nh}</td></tr>`;
  });
  if (!rows.length) h += `<tr><td colspan="${nc}" class="dim">Под фильтр не подходит ни одна статья.</td></tr>`;
  h += '</table>';
  const probs = [NET.oaOff ? 'OpenAlex отключился: ' + esc(NET.oaOff) + ' — corresponding и организации не определены' : '', NET.wlOff ? 'сайт Белого списка не ответил (' + esc(NET.wlOff) + ') — уровни взяты из справочника от ' + REF.wlDate : ''].filter(Boolean);
  if (probs.length) h += `<p class="dim">${probs.join('. ')}.</p>`;
  $('outList').innerHTML = h; $('listOut').style.display = '';
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
      const det = detectLeader(W.works, [...new Set(fios.map(f => canonName(f.sur)))]); let ch = det.chosen.filter(a => fioOK(a.name, [], fios)), how = 'по ФИО среди авторов статей из списка';
      // однофамильцы среди авторов статей: организация оставляет того, у кого она совпала (правка 1)
      const org = $('org').value.trim();
      if (ch.length && org) { const r = leaderByOrg(W.works, ch, org); if (r.hit === 'none') S.msgs.push(ORG_NONE); else if (r.list.length < ch.length) { ch = r.list; how += ', совпала организация'; } }
      if (ch.length) { await loadProfile(S, ch.map(a => a.id), how, st); found = ch[0]; }
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
const ORG_NONE = 'по указанной организации совпадений нет — возможно, автор сменил место работы или база её не знает';
async function runAuthor() {
  if (BUSY || !REF) return; BUSY = true; $('ago').disabled = true; applyNet(); W.auto = null; AU = newS();
  $('outAuthor').innerHTML = ''; $('auOut').style.display = 'none'; updateNav(); goTo('astatus');  // прежний результат убирается сразу
  CACHE.hits = 0; CACHE.oldest = 0; await searchAuthor(AU, $('author').value, t => { $('astatus').textContent = t; });
  if (W.entries) rejudge();
  BUSY = false; $('ago').disabled = false; $('astatus').textContent = cacheNote().trim(); renderAll(); goTo('outAuthor'); saveState();
}
/* Правка 4 (0.7.10): перейти к следующему автору — поля ФИО и организации и результаты очищаются (организация — с 0.8), список публикаций не трогается */
function resetAuthor() {
  if (BUSY) return;
  AU = newS(); W.auto = null; FLT.au = FLT0();
  $('author').value = ''; $('org').value = ''; $('aparsed').textContent = ''; $('astatus').textContent = '';
  $('outAuthor').innerHTML = ''; $('auOut').style.display = 'none';
  if (W.entries) { rejudge(); renderList(); }
  updateNav(); goTo('inp'); $('author').focus(); saveState();
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
  strict.forEach(a => { a.fullGiven = fullGiven(a); a.patr = patr(a); a.inOrcid = !!(a.orcid && orc.some(o => o.orcid === a.orcid)); a.ru = /\bRU\b/.test(a.country || ''); });
  // русские названия организаций нужны до сортировки: организацию вводят по-русски (правка 1)
  if (strict.length) { const ru = await instRu([].concat(...strict.slice(0, 40).map(a => a.instIds || []))); strict.forEach(a => { a.instRu = [...new Set((a.instIds || []).map(id => ru[id]).filter(Boolean))].join('; '); }); }
  const org = $('org').value.trim(); rankList(strict, org);
  const orcOnly = orc.filter(o => !strict.some(a => a.orcid === o.orcid)).filter((o, i, arr) => arr.findIndex(x => x.orcid === o.orcid) === i);
  const orgAny = strict.some(a => a.org === 'yes' || a.org === 'part');
  if (org && strict.length && !orgAny) S.msgs.push(ORG_NONE);
  // однозначно по организации: ровно один кандидат с полным именем, у которого совпала организация
  if (org) { const oy = strict.filter(a => a.fullGiven && a.org === 'yes'); if (oy.length === 1) { oy[0].how = 'по ФИО и организации: единственный профиль с полным именем, у которого совпала организация' + (oy[0].patr ? ', совпадает инициал отчества' : ''); return oy[0]; } }
  // однозначно: ровно один кандидат с полным совпадением имени и (отчеством или подтверждением в реестре ORCID);
  // но если организация указана и у него не совпала, а у другого совпала — пусть выберет человек
  const sure = strict.filter(a => a.fullGiven && (a.patr || a.inOrcid));
  if (sure.length === 1 && strict.filter(a => a.fullGiven).length === 1 && !(org && sure[0].org !== 'yes' && orgAny)) { sure[0].how = 'по ФИО: единственный подходящий профиль' + (sure[0].patr ? ', совпадает инициал отчества' : '') + (sure[0].inOrcid ? ', подтверждён реестром ORCID' : ''); return sure[0]; }
  S.cands = strict.slice(0, 12); S.orcCands = orcOnly.slice(0, 8);
  if (!strict.length && !orcOnly.length) S.msgs.push(`по ФИО не найдено (искали: ${[...qs].slice(0, 6).join('; ')})`);
  return null;
}
/* Вес кандидата: полное имя 4, совпала организация 4 (частично 2), инициал отчества 3, запись в реестре ORCID 2, Россия 1, число работ до 2 */
const splitNames = t => String(t || '').split(/;\s*/).filter(Boolean);
function rankList(list, org) {
  list.forEach(a => { a.org = orgHit(splitNames(a.inst).concat(splitNames(a.instRu)), org); a.score = (a.fullGiven ? 4 : 0) + (a.org === 'yes' ? 4 : (a.org === 'part' ? 2 : 0)) + (a.patr ? 3 : 0) + (a.inOrcid ? 2 : 0) + (a.ru ? 1 : 0) + Math.min(2, Math.log10((a.works || 0) + 1)); });
  return list.sort((a, b) => b.score - a.score);
}
function rankCands(S) { const org = $('org').value.trim(); rankList(S.cands || [], org); S.msgs = (S.msgs || []).filter(m => m !== ORG_NONE); if (org && (S.cands || []).length && !S.cands.some(a => a.org === 'yes' || a.org === 'part')) S.msgs.push(ORG_NONE); }
async function findSimilar(S) {
  const inf = S.prof.info[0]; if (!inf) return; const fios = parseFIO(inf.name); let list = [];
  try { list = await searchAuthors(inf.name); } catch (e) { return; }
  S.similar = list.filter(a => S.prof.ids.indexOf(a.id) < 0 && fioOK(a.name, a.alt, fios) && (!a.orcid || !inf.orcid || a.orcid === inf.orcid)).slice(0, 6);
}
async function afterPick(k) { const S = stOf(k); if (S.prof && !S.prof.err) { await findSimilar(S); try { await fetchOrcidIds(S); } catch (e) { } } if (W.entries) rejudge(); BUSY = false; renderAll(); goTo('outAuthor'); saveState(); }
async function addProfile(id, k) { k = k == null ? -1 : k; if (BUSY) return; BUSY = true; const S = stOf(k); const ids = S.prof.ids.concat([id]); await loadProfile(S, ids, S.prof.how + '; добавлен профиль ' + id); S.similar = (S.similar || []).filter(a => a.id !== id); if (W.entries) rejudge(); BUSY = false; renderAll(); goTo('outAuthor'); saveState(); }
async function pickOrcid(orcid, k) { k = k == null ? -1 : k; if (BUSY) return; BUSY = true; const S = stOf(k); S.msgs = []; await byOrcid(S, orcid, 'выбран вручную: ORCID ' + orcid); await afterPick(k); }
async function pickAuthor(id, k) { k = k == null ? -1 : k; if (BUSY) return; BUSY = true; const S = stOf(k); await loadProfile(S, [id], 'выбран вручную из найденных по имени'); await afterPick(k); }

/* Ссылки у кандидата: ORCID и Scopus — если идентификатор известен, иначе поиск в Scopus по имени; OpenAlex — последней */
function scopusNameUrl(name) { const t = String(name || '').replace(/[.,]/g, ' ').split(/\s+/).filter(Boolean); if (!t.length) return 'https://www.scopus.com/freelookup/form/author.uri'; const last = t[t.length - 1], first = t.length > 1 ? t[0] : ''; return 'https://www.scopus.com/results/authorNamesList.uri?origin=searchauthorlookup&src=al&st1=' + encodeURIComponent(last) + (first ? '&st2=' + encodeURIComponent(first) : ''); }
function candLinks(a) { return [a.orcid ? lnk('https://orcid.org/' + a.orcid, 'ORCID') : '', a.scopus ? lnk('https://www.scopus.com/authid/detail.uri?authorId=' + a.scopus, 'Scopus') : lnk(scopusNameUrl(a.name), 'Scopus: поиск по имени'), lnk('https://openalex.org/' + a.id, 'OpenAlex')].filter(Boolean).join(' · '); }
/* ----- Профили автора: все ссылки, откуда взят идентификатор, расхождения ----- */
const BASES = {
  orcid: { name: 'ORCID', url: v => 'https://orcid.org/' + v },
  scopus: { name: 'Scopus', url: v => 'https://www.scopus.com/authid/detail.uri?authorId=' + v, note: 'открывается и без подписки (ограниченный просмотр)' },
  rid: { name: 'Web of Science (ResearcherID)', url: v => 'https://www.webofscience.com/wos/author/rid/' + v, note: 'нужен доступ к Web of Science' },
  rinc: { name: 'eLibrary (РИНЦ AuthorID)', url: v => 'https://elibrary.ru/author_profile.asp?authorid=' + v },
  spin: { name: 'eLibrary (SPIN-код)', url: () => 'https://elibrary.ru/authors.asp', note: 'прямой ссылки по SPIN-коду нет — поиск в разделе «Авторы»' },
  openalex: { name: 'OpenAlex', url: v => 'https://openalex.org/' + v },
};
function profileLinks(S) {
  const p = S.parsed || {}, prof = S.prof && !S.prof.err ? S.prof : null;
  // идентификаторы: введённые, из OpenAlex и из записи ORCID (тип идентификатора и ссылки профиля) — правка 2 (0.8)
  const { ids, warns } = collectAuthorIds(p, prof ? prof.info : [], S.orcIds ? S.orcIds.list : []);
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
  const L = profileLinks(S); if (!L.ids.length && !(S.prof && !S.prof.err)) return '';
  let h = `<div class="plinks"><b>Профили автора</b>`;
  if (L.warns.length) h += `<p>${chip('check', 'проверьте')} ${L.warns.map(esc).join('; ')}.</p>`;
  if (L.ids.length) h += '<table class="t"><tr><th style="width:26%">База</th><th style="width:26%">Идентификатор</th><th>Ссылка</th></tr>' + L.ids.map(x => { const B = BASES[x.b]; return `<tr><td>${esc(B.name)}</td><td title="откуда взят: ${esc(x.src.join(', '))}">${esc(x.v)}</td><td>${lnk(B.url(x.v))}${B.note ? ' <span class="dim">— ' + esc(B.note) + '</span>' : ''}</td></tr>`; }).join('') + '</table>';
  if (L.orcErr) h += `<p class="dim" style="margin-bottom:0">Идентификаторы из записи ORCID не получены: ${esc(L.orcErr)}.</p>`;
  if (!(S.prof && !S.prof.err)) h += hirschHtml(S, k, L);   // без найденного профиля — прежней строкой, с найденным — плашкой вверху
  return h + ` <p style="margin:6px 0 0"><button class="sec small" onclick="copyLinks(${k})">Скопировать ссылки</button></p></div>`;
}
/* ----- Индекс Хирша по базам. Scopus, WoS и РИНЦ открытых интерфейсов не дают — утилита значение не получает, даёт ссылку, где его посмотреть;
   OpenAlex считает свой Хирш (по своей базе, с самоцитированием) — показывается справочно. ----- */
const H_BASES = [['scopus', 'Scopus', 'scopus'], ['wos', 'Web of Science', 'rid'], ['rinc', 'РИНЦ (eLibrary)', 'rinc']];
const H_NOTE = { scopus: 'h-индекс виден в профиле и без подписки (рядом с числом документов)', wos: 'нужен доступ к Web of Science', rinc: '' };
function hirschLink(L, idb) { const xs = L.ids.filter(i => i.b === idb); if (xs.length) return { u: BASES[idb].url(xs[0].v), t: 'профиль ' + xs[0].v + ' (' + xs[0].src.join(', ') + ')', all: xs.map(x => ({ u: BASES[idb].url(x.v), t: 'профиль ' + x.v, src: x.src.join(', ') })) }; const s = L.sr.find(i => i.b === ({ scopus: 'Scopus', rid: 'Web of Science', rinc: 'eLibrary' })[idb]); return s ? { u: s.u, t: 'поиск автора', q: s.manual ? s.q : '' } : null; }
/* Индекс Хирша (правка 4, 0.8): крупно — наибольшее из полученных значений с подписью базы, остальные рядом.
   OpenAlex — автоматически; РИНЦ, Scopus, WoS, Google Scholar — со вставленной страницы профиля. Где не получено — ссылка посмотреть. */
function hirschPlate(S, L) {
  const prof = S.prof, sum = hirschSummary(prof.info.filter(a => a.h != null).map(a => ({ h: a.h, id: a.id })), S.hx || []), b = sum.best;
  const bname = x => H_BASE_NAME[x.base] + (x.base === 'openalex' ? ', свой расчёт' : '');
  const others = sum.vals.filter(x => x !== b).map(x => `<span title="${esc(x.src + (x.id ? ' — ' + x.id : ''))}">${esc(H_BASE_NAME[x.base])} <b>${x.v}</b></span>`);
  const miss = H_BASES.filter(([key]) => !sum.perBase[key]).map(([key, name, idb]) => { const l = hirschLink(L, idb), nm = { scopus: 'Scopus', wos: 'WoS', rinc: 'РИНЦ' }[key];
    if (!l) return `<span class="dim" title="профиля нет">${nm}</span>`;
    if (l.all && l.all.length > 1) return nm + ': ' + l.all.map((x, i) => `<a target="_blank" rel="noopener" href="${esc(x.u)}" title="${esc(x.t + ' (' + x.src + ')' + (H_NOTE[key] ? ' — ' + H_NOTE[key] : ''))}">профиль ${i + 1}</a>`).join(', ');
    return `<a target="_blank" rel="noopener" href="${esc(l.u)}" title="${esc((l.q ? 'форма поиска автора: ' + l.q : l.t) + (H_NOTE[key] ? ' — ' + H_NOTE[key] : ''))}">${nm}</a>`; });
  const fio = hxFio(S), e = encodeURIComponent((fio || '') + ' индекс Хирша');
  return `<div class="hplate" title="Базы считают индекс Хирша по разным наборам статей, поэтому значения расходятся; крупно — наибольшее из полученных, с подписью базы. OpenAlex считает по своей базе и с самоцитированием."><div class="hl">Индекс<br>Хирша</div>`
    + `<div><div class="hv">${b ? b.v : '—'}</div><div class="dim" style="font-size:11px">${b ? esc(bname(b)) : 'нет данных'}</div></div>`
    + `<div class="hs">${others.length ? '<div>' + others.join(' · ') + '</div>' : ''}`
    + (miss.length ? `<div>${miss.join(' · ')} — Хирш не получен, посмотреть</div>` : '')
    + `<div class="dim" style="font-size:11px">${fio ? `поиск в интернете: ${lnk('https://yandex.ru/search/?text=' + e, 'Яндекс')} · ${lnk('https://www.google.com/search?q=' + e, 'Google')} · ` : ''}<button class="linkbtn" style="font-size:11px" onclick="hxToggle()">вставить страницу профиля</button></div></div></div>`
    + (sum.warns.length ? `<div style="flex-basis:100%">${chip('check', 'проверьте')} ${sum.warns.map(esc).join('; ')}.</div>` : '');
}
/* Правка 5 (0.7.10): индекс Хирша одной строкой — остаётся, когда профиль не найден */
function hirschHtml(S, k, L) {
  const prof = S.prof && !S.prof.err ? S.prof : null; if (!prof && !L.ids.length) return '';
  const parts = H_BASES.map(([key, name, idb]) => {
    const l = hirschLink(L, idb);
    return `${esc(name)} — ` + (l ? lnk(l.u, l.q ? 'форма поиска' : 'посмотреть') + (H_NOTE[key] ? ` <span class="dim" title="${esc(H_NOTE[key])}">?</span>` : '') : '<span class="dim">профиля нет</span>');
  });
  const oa = prof ? prof.info.filter(a => a.h != null) : [];
  parts.push(`OpenAlex ${oa.length ? '<b>' + oa.map(a => a.h).join(', ') + '</b>' : '<span class="dim">нет данных</span>'} <span class="dim" title="считается по базе OpenAlex и с самоцитированием — с Scopus, WoS и РИНЦ не совпадает">(свой расчёт)</span>`);
  return `<div class="hline"><b>Индекс Хирша</b> <span class="dim" title="Scopus, WoS и РИНЦ открытых источников не дают — утилита значение не получает, откройте и посмотрите сами">(посмотрите сами)</span>: ${parts.join(' · ')}</div>`;
}
function copyLinks(k) {
  const S = stOf(k), L = profileLinks(S), out = [];
  L.ids.forEach(x => out.push(tsvRow([BASES[x.b].name, x.v, x.src.join(', '), BASES[x.b].url(x.v)])));
  L.sr.forEach(x => out.push(tsvRow([x.b + ' — поиск по имени', x.q, '', x.u])));
  if (L.warns.length) out.push(tsvRow(['Проверьте', L.warns.join('; ')]));
  if (S.prof && !S.prof.err) S.prof.info.filter(a => a.h != null).forEach(a => out.push(tsvRow(['Индекс Хирша OpenAlex (свой расчёт)', a.h, a.id, 'https://openalex.org/' + a.id])));
  (S.hx || []).filter(x => x.val != null).forEach(x => out.push(tsvRow(['Индекс Хирша ' + H_BASE_NAME[x.base] + ' (со страницы профиля' + (x.label ? ', ' + x.label : '') + ')', x.val, x.id || '', ''])));
  toClip(out.join('\n'), 'astatus');
}

const wLink = w => w.doi ? 'https://doi.org/' + w.doi : (w.oaId ? 'https://openalex.org/' + w.oaId : '');
const profRows = (S, fid) => sortRows(S.prof.js.filter(x => passFilter(profKey(x), FLT[fid])), fid, profKey);
function aRows() { return profRows(AU, 'au'); }
/* Тело раздела об одном авторе: сообщения, профили, выбор кандидата, таблица публикаций */
function authorBody(S, k, fid, withFilter) {
  const prof = S.prof, kk = k < 0 ? '' : ',' + k; let h = '';
  if (prof && !prof.err) {
    // шапка автора: имя, организация, число работ — и рядом плашка индекса Хирша
    h += `<div class="auhead"><div class="auname">${prof.info.map(a => `<div class="nm">${esc(a.name)}</div><div class="dim">${[a.inst ? esc(a.inst) : '', a.works != null ? 'работ в базе: ' + a.works : ''].filter(Boolean).join(' · ')}</div>`).join('')}`
      + `<div class="dim" style="margin-top:4px" title="Профиль собран базой автоматически: возможны чужие статьи и пропуски">Как найден: ${esc(prof.how)}.${prof.info.length > 1 ? ' Профилей несколько — публикации собраны со всех, проверьте, что это один человек.' : ''}</div></div>${hirschPlate(S, profileLinks(S))}</div>`;
  }
  if (S.msgs.length) h += `<p>${chip('check', 'обратите внимание')} ${S.msgs.map(esc).join('; ')}.</p>`;
  h += profileLinksHtml(S, k);
  if (prof && !prof.err) h += hxPanelHtml(S);
  if (prof && prof.err) h += `<p>${chip('unk', 'не загружено')} ${esc(prof.err)}</p>`;
  else if (prof) {
    const all = prof.js, rows = profRows(S, fid), cnt = q => rows.filter(x => x.j.sj && x.jv.qY === q).length, wl1 = rows.filter(x => rowKey(x.w.year, x.j, x.jv).wl === 1).length, cy = rows.filter(x => x.corrSt === 'yes').length;
    h += `<p>Источник — ${prof.aw.source}. Статей и обзоров за все годы: <b>${all.length}</b>.` + (prof.aw.capped ? ' Показаны первые 2000 — список обрезан.' : '') + '</p>';
    if (k < 0 && W.entries) { const miss = W.pubs.filter(p => p.work && p.work.doi && TYPE_OK[p.work.type] && !all.some(x => x.w.doi === p.work.doi)); if (miss.length) h += `<p>${chip('check', 'проверьте')} В профиле автора нет ${miss.length} из найденных статей списка (№ ${miss.map(p => numOf(p.entry, W.pubs.indexOf(p))).join(', ')}): профиль в базе неполный либо это другой автор.</p>`; }
    if (withFilter) h += filterBar(fid, rows.length, all.length, noCpdHidden(all.map(profKey), FLT[fid]));
    h += `<div class="sum" title="по показанным строкам; квартиль и уровень — на год публикации">${[['Q1', cnt(1)], ['Q2', cnt(2)], ['Q3', cnt(3)], ['Q4', cnt(4)], ['без квартиля', rows.filter(x => !x.j.sj || !x.jv.qY).length], ['БС 1', wl1], ['corresponding', cy]].map(([t, n]) => `<span class="sb"><b>${n}</b> ${t}</span>`).join('')}</div>`;
    const listed = new Set(W.entries ? W.pubs.filter(p => p.work).map(p => p.work.doi) : []), dn = doneCnt(all.map(markKeyA));
    if (dn) h += `<p class="dim">Отмечено «проверено»: ${dn} из ${all.length}.</p>`;
    if (!all.length) h += '<p class="dim">Статей нет. Это не значит, что их нет вообще: профиль в базе может быть пустым.</p>';
    else if (!rows.length) h += '<p class="dim">Под фильтр не подходит ни одна статья.</p>';
    else h += `<table class="t pubs"><tr>${sortTh(fid, 'year', 'Год', 'width:7%')}<th>Статья и ссылка</th><th style="width:15%">Издание</th>${sortTh(fid, 'q', 'Квартиль<div class="sub">SCImago</div>', 'width:12%')}${sortTh(fid, 'wl', 'Белый список', 'width:11%')}${sortTh(fid, 'if', 'Импакт-фактор<div class="sub">SCImago</div>', 'width:8%')}${csHas() ? `<th style="width:9%">${TH_CS()}</th>` : ''}<th style="width:8%">Место автора</th><th style="width:11%">Corresponding</th></tr>` + rows.map(x => {
      const url = wLink(x.w), mk = markKeyA(x);
      return `<tr${MARKS[mk] ? ' class="done"' : ''}><td>${x.w.year || ''}${markBox(mk)}</td><td>${esc(x.w.title)}${k < 0 && listed.has(x.w.doi) && x.w.doi ? ' ' + nchip('в списке') : ''}${x.w.type === 'review' ? ' <span class="dim">обзор</span>' : ''}<br>${url ? lnk(url) : chip('unk', 'ссылки нет')}</td><td>${esc(x.w.journal)}</td><td>${quartText(x.jv, x.j.sj, true, x.j.wl)}</td><td>${wlText(x.j.wl, x.w.year, true)}</td><td class="mono">${x.jv.cpd != null ? fmtNum(x.jv.cpd) : ''}</td>${csHas() ? `<td>${csCell(x.j.cs)}</td>` : ''}<td class="dim">${esc(x.pos || '')}</td><td>${corrChip(x.corrSt, x.corrNames)}</td></tr>`;
    }).join('') + '</table>';
  } else if (S.cands || S.orcCands) {
    const c = S.cands || [], o = S.orcCands || [];
    if (c.length || o.length) {
      h += `<p>${chip('check', 'выберите')} По ФИО однозначно определить автора нельзя — выберите нужного. Сверху — лучше совпавшие: имя полностью, организация, инициал отчества, запись в реестре ORCID.${$('org').value.trim() ? '' : ' Укажите организацию автора — это поможет отличить однофамильцев.'}</p>`;
      if (c.length) h += `<table class="t cands"><tr><th style="width:19%">Имя</th><th style="width:23%">Организация</th><th style="width:20%">Разделы науки<div class="sub">OpenAlex, наведите — тема</div></th><th style="width:6%">Работ</th><th style="width:6%">Хирш<div class="sub">OpenAlex</div></th><th style="width:11%">Совпадения</th><th style="width:15%"></th></tr>` + c.map(a => { const cyr = (a.alt || []).filter(isCyr).sort((x, y) => y.length - x.length)[0];
        return `<tr><td><b>${esc(a.name)}</b><div>${cyr ? esc(cyr) : '<span class="dim">имени кириллицей в базе нет</span>'}</div></td><td>${a.inst ? esc(a.inst) + '<div>' + (a.instRu ? esc(a.instRu) : '<span class="dim">русского названия в базе нет</span>') + '</div>' : '<span class="dim">не указана</span>'}</td><td>${topicsHtml(a)}</td><td>${a.works}</td><td>${a.h != null ? a.h : ''}</td><td>${[a.fullGiven && nchip('имя'), a.org === 'yes' && chip('ok', 'организация совпала'), a.org === 'part' && nchip('организация — частично'), a.patr && nchip('отчество'), a.inOrcid && nchip('в ORCID'), a.ru && nchip('Россия')].filter(Boolean).join(' ')}</td><td><button class="sec" onclick="pickAuthor('${a.id}'${kk})">Это он</button><div class="dim">${candLinks(a)}</div></td></tr>`; }).join('') + '</table>';
      if (o.length) h += `<p class="dim">Найдены в реестре ORCID (в OpenAlex по имени не нашлись):</p><table class="t"><tr><th>Имя в ORCID</th><th style="width:36%">Организации</th><th style="width:18%">ORCID</th><th style="width:15%"></th></tr>` + o.map(a => `<tr><td>${esc(a.name)}</td><td>${esc(a.inst)}</td><td>${lnk('https://orcid.org/' + a.orcid, a.orcid)}</td><td><button class="sec" onclick="pickOrcid('${a.orcid}'${kk})">Это он</button><div class="dim">${lnk(scopusNameUrl(a.name), 'Scopus: поиск по имени')}</div></td></tr>`).join('') + '</table>';
      h += '<p class="dim">Надёжнее всего — ORCID или поиск по статьям из списка: тогда автор определяется без выбора.</p>';
    } else h += `<p>${chip('unk', 'не найден')} По этим сведениям автор в открытых базах не найден. Попробуйте ORCID или сначала найдите публикации из списка.</p>`;
  }
  if (prof && !prof.err && S.similar && S.similar.length) h += `<p>${chip('check', 'проверьте')} В OpenAlex есть ещё профили с тем же именем — база иногда делит одного автора на несколько. Если это он, добавьте его публикации:</p><table class="t"><tr><th>Имя</th><th style="width:30%">Организация</th><th style="width:8%">Работ</th><th style="width:22%"></th></tr>` + S.similar.map(a => `<tr><td>${esc(a.name)}</td><td>${esc(a.inst)}</td><td>${a.works}</td><td><button class="sec" onclick="addProfile('${a.id}'${kk})">Добавить его публикации</button> ${lnk('https://openalex.org/' + a.id, 'профиль')}</td></tr>`).join('') + '</table>';
  return h;
}
function renderAuthor() {
  const S = AU;
  if (!S.prof && !S.cands && !S.orcCands && !S.msgs.length && !S.parsed) { $('outAuthor').innerHTML = ''; $('auOut').style.display = 'none'; return; }
  $('outAuthor').innerHTML = '<h2>Автор <button class="linkbtn noprint" style="margin-left:14px;text-transform:none;letter-spacing:0" onclick="resetAuthor()">Найти другого автора</button></h2>' + authorBody(S, -1, 'au', true).replace('<p>Источник —', '<h2 id="auWorks">Все публикации автора</h2><p>Источник —');
  $('auOut').style.display = S.prof && !S.prof.err ? '' : 'none';
}

/* ----- Копирование ----- */
const tsvRow = a => a.map(x => String(x == null ? '' : x).replace(/[\t\n]/g, ' ')).join('\t');
const wlS = (wl, year) => { if (!wl) return 'нет'; const a = wlAt(wl, year); return (a.excluded ? 'исключён ' + wl.disc : (a.lv ? a.lv + ' (' + a.y + ')' : 'без уровня')) + (!a.excluded && (a.curExcl || a.cur !== a.lv) ? '; сейчас ' + (a.curExcl ? 'исключён' : a.cur || 'без уровня') : ''); };
const idxS = wl => !wl ? 'нет данных' : ['WoS CC', 'Scopus', 'RSCI'].filter((n, i) => [wl.wos, wl.scopus, wl.rsci][i]).join(', ') || 'ни в одной';
const scS = (sc, year) => !scHas() ? '' : (!sc ? 'нет в списке источников Scopus' : scStatusText(sc) + (scAt(sc, year).inCov === false ? '; в ' + year + ' г. не индексировался' : '') + (scAt(sc, year).afterDisc ? '; статья позже последнего номера' : ''));
const corrS = w => !w.oa ? 'нет данных' : (!w.corr || !w.corr.known ? 'в базе не указан' : w.corr.names.join(', '));
const orgS = me => orgNames(me).join('; ');
const markS = k => MARKS[k] ? 'да' : '';
/* CiteScore в выгрузке (0.9): значение, квартиль, тематика и столбец «Источник» — условие Elsevier (указание источника и ссылка) */
const csHead = () => csHas() ? ['CiteScore (Scopus ' + REF.csYear + ', сейчас)', 'Квартиль по CiteScore (наилучший)', 'Тематика Scopus (процентиль)', 'Источник CiteScore'] : [];
const csCols = cs => !csHas() ? [] : (!cs ? ['', '', '', ''] : [cs.v != null ? cs.v : '', cs.q ? 'Q' + cs.q : '', cs.best ? cs.best.name + ' (' + cs.best.pct + ')' : '', csSrc(cs) + ' — ' + csLink(cs)]);
/* Таблица для копирования и выгрузки файлом: числа — числами (Excel сам покажет их по-русски) */
function listTable() {
  const ids = auIds().length; const L = [['№', 'Проверено', 'Найденная статья', 'Ссылка', 'Год', 'Тип', 'Издание', 'ISSN', 'Квартиль (год публикации)', 'Квартиль сейчас (' + REF.sjYear + ')', 'Индексация (Белый список)', 'Белый список (год публикации)', 'Импакт-фактор (SCImago, цит. на документ за 2 года)', 'Импакт-фактор в списке', 'Квартиль в списке', 'Scopus (список источников)'].concat(csHead()).concat(['Corresponding (OpenAlex)']).concat(ids ? ['Найденный автор — corresponding', 'Организация автора'] : []).concat(['Первый автор', 'Последний автор', 'Примечания', 'Запись из списка'])];
  listRows().forEach(({ p, i }) => { const w = p.work, jv = p.jv || {}, a = w ? w.authors : [], m = w ? listMe(w) : null, num = numOf(p.entry, i);
    L.push([typeof num === 'number' ? num : String(num), markS(markKeyL(p)), w ? w.title : (p.found === 'patent' ? 'патент — не ищется' : (p.found === 'no' ? 'не найдена' : 'не проверена')), w ? wLink(w) : (p.entry.patentNo ? 'https://patents.google.com/patent/' + p.entry.patentNo : ''), w ? w.year : '', w ? p.typeName : (p.found === 'patent' ? 'патент' : ''), w ? w.journal : '', w ? w.issns.join(', ') : '', w && p.j.sj ? (jv.qY ? 'Q' + jv.qY : 'нет') + ' (' + jv.sjYear + ')' : '', w && p.j.sj && jv.qL ? 'Q' + jv.qL : '', w ? idxS(p.j.wl) : '', w ? wlS(p.j.wl, w.year) : '', w && jv.cpd != null ? Math.round(jv.cpd * 100) / 100 : '', p.declIF != null ? p.declIF : '', p.declQ ? 'Q' + p.declQ : '', w ? scS(p.j.sc, w.year) : ''].concat(csCols(w ? p.j.cs : null)).concat([w ? corrS(w) : '']).concat(ids ? [m && m.me ? CORR_T[m.corr] : 'нет данных', m && m.me ? orgS(m.me) : ''] : []).concat([aName(a[0]), a.length > 1 ? aName(a[a.length - 1]) : '', p.notes.concat(dupNotes(i)).join('; '), p.entry.raw])); });
  return L;
}
function copyList() { if (!W.entries) return; toClip(listTable().map(r => tsvRow(r.map(cellTxt))).join('\n'), 'status'); }
function exportList(kind) { if (!W.entries) return; const t = listTable(), nm = 'Публикации_из_списка_' + today(); download(nm + '.' + kind, kind === 'xlsx' ? xlsxBlob('Публикации из списка', t) : csvBlob(t)); $('status').textContent = 'Файл ' + nm + '.' + kind + ' сохранён в папку загрузок.'; }
const profHead = () => ['Год', 'Проверено', 'Статья', 'Ссылка', 'Издание', 'Квартиль (год публикации)', 'Квартиль сейчас (' + REF.sjYear + ')', 'Белый список (год публикации)', 'Импакт-фактор (SCImago)'].concat(csHead()).concat(['Место автора', 'Corresponding', 'Организация автора в статье']);
const profLine = x => [x.w.year, markS(markKeyA(x)), x.w.title, wLink(x.w), x.w.journal, x.j.sj ? (x.jv.qY ? 'Q' + x.jv.qY : 'нет') + ' (' + x.jv.sjYear + ')' : '', x.j.sj && x.jv.qL ? 'Q' + x.jv.qL : '', wlS(x.j.wl, x.w.year), x.jv.cpd != null ? Math.round(x.jv.cpd * 100) / 100 : ''].concat(csCols(x.j.cs)).concat([x.pos || '', x.corrSt ? CORR_T[x.corrSt] + (x.corrSt === 'no' && x.corrNames.length ? ' (' + x.corrNames.join(', ') + ')' : '') : 'нет данных', orgS(x.me)]);
function authorTable() { const sum = hirschSummary(AU.prof.info.filter(a => a.h != null).map(a => ({ h: a.h, id: a.id })), AU.hx || []); const hs = sum.vals.map(x => H_BASE_NAME[x.base] + (x.base === 'openalex' ? ' (свой расчёт)' : '') + ': ' + x.v).join('; '); return [['Автор', AU.prof.info.map(a => a.name).join('; '), AU.prof.info.map(a => 'https://openalex.org/' + a.id).join(' '), hs ? 'Индекс Хирша — ' + hs + (sum.best ? '; наибольший — ' + sum.best.v + ' (' + H_BASE_NAME[sum.best.base] + ')' : '') : ''], profHead()].concat(aRows().map(profLine)); }
function copyAuthor() { if (!AU.prof || AU.prof.err) return; toClip(authorTable().map(r => tsvRow(r.map(cellTxt))).join('\n'), 'astatus'); }
function exportAuthor(kind) { if (!AU.prof || AU.prof.err) return; const t = authorTable(), nm = 'Публикации_автора_' + today(); download(nm + '.' + kind, kind === 'xlsx' ? xlsxBlob('Публикации автора', t) : csvBlob(t)); $('astatus').textContent = 'Файл ' + nm + '.' + kind + ' сохранён в папку загрузок.'; }
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
