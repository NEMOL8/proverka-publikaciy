/* ===== 0.9: подсказки при вводе журнала (правка 2), источники данных ===== */

/* ----- Подсказки при вводе журнала. Только встроенные справочники (SCImago, Белый список, Scopus, CiteScore), без интернета.
   Совпадение — по началу названия или по началу любого слова («alloys» → Journal of Alloys and Compounds), кириллица тоже.
   Сначала названия, которые начинаются с введённого, потом остальные; внутри — по алфавиту. Подсказка только помогает ввести:
   если вариант не выбран, поиск работает как обычно. Функция suggestJournals — чистая, проверяется в evals/run.js. */
function suggestJournals(q, max) {
  max = max || 12; const nq = norm(q); if (nq.length < 2 || !REF) return [];
  if (/^\d{4}\s*-?\s*\d{0,3}[\dxх]?$/i.test(String(q).trim())) return [];  // ISSN подсказкой не нужен
  const J = jIndex(), hits = [];
  for (let id = 0; id < J.list.length; id++) { const x = J.list[id]; const r = x.nn.startsWith(nq) ? 0 : ((' ' + x.nn).indexOf(' ' + nq) >= 0 ? 1 : -1); if (r >= 0) hits.push([r, x]); }
  const rec = { sj: sjRec, wl: wlRec, sc: scRec, cs: csRec }, seen = new Set(), out = [];
  const title = x => x.k === 'sj' ? REF.sj[x.i][0] : (x.k === 'wl' ? REF.wl[x.i][0].split(' | ')[0] : (x.k === 'sc' ? REF.sc[x.i][0] : REF.cs[x.i][2]));
  hits.sort((a, b) => a[0] - b[0] || (a[1].nn < b[1].nn ? -1 : a[1].nn > b[1].nn ? 1 : 0));
  for (const [r, x] of hits) {
    if (out.length >= max) break;
    const rc = rec[x.k](x.i), e = journalEntity(rc.issns, { k: x.k, rec: rc }); if (seen.has(e.key)) continue; seen.add(e.key);
    const wa = e.wl ? wlAt(e.wl, null) : null;
    out.push({ title: title(x), e, issn: e.issns[0] ? fmtIssn(e.issns[0]) : '', marks: [e.sj ? 'SCImago ' + (e.sj.q ? 'Q' + e.sj.q : 'без квартиля') : '', e.wl ? (wa.excluded || wa.curExcl ? 'БС исключён' : (wa.cur ? 'БС ' + wa.cur : 'БС без уровня')) : '', e.sc ? (e.sc.disc || e.sc.flag ? 'Scopus исключён' : 'Scopus') : (e.cs ? 'Scopus' : '')].filter(Boolean) });
  }
  return out;
}
const JSUG = { items: [], on: -1, line: null };
function jsugLine() { const t = $('jq'), v = t.value, p = t.selectionStart, a = v.lastIndexOf('\n', p - 1) + 1, b = v.indexOf('\n', p); return { a, b: b < 0 ? v.length : b, text: v.slice(a, b < 0 ? v.length : b) }; }
function jsugHide() { const b = $('jsug'); b.style.display = 'none'; b.innerHTML = ''; JSUG.items = []; JSUG.on = -1; }
function jsugShow() {
  if (!REF) return; const L = jsugLine(); JSUG.line = L; const q = L.text.trim();
  if (q.length < 2) { jsugHide(); return; }
  JSUG.items = suggestJournals(q, 12); JSUG.on = -1; const b = $('jsug');
  if (!JSUG.items.length) { if (/^\d/.test(q)) { jsugHide(); return; } b.innerHTML = '<div class="none">В справочниках нет названий, начинающихся так. Можно искать и так — с опечатками и сокращениями — или по ISSN.</div>'; b.style.display = 'block'; return; }
  b.innerHTML = JSUG.items.map((x, i) => `<div class="it" role="option" data-i="${i}" onmousedown="event.preventDefault();jsugPick(${i})"><div>${esc(x.title)}</div><div class="m">${esc([x.issn ? 'ISSN ' + x.issn : 'ISSN нет'].concat(x.marks).join(' · '))}</div></div>`).join('');
  b.style.display = 'block';
}
function jsugMark() { [...$('jsug').querySelectorAll('.it')].forEach((d, i) => { d.classList.toggle('on', i === JSUG.on); if (i === JSUG.on) d.scrollIntoView({ block: 'nearest' }); }); }
/* Выбор подставляет в текущую строку название и ISSN — поиск по ISSN надёжнее */
function jsugPick(i) {
  const x = JSUG.items[i], L = JSUG.line || jsugLine(); if (!x) return; const t = $('jq'), v = t.value, ins = x.title + (x.issn ? ' ' + x.issn : '');
  t.value = v.slice(0, L.a) + ins + v.slice(L.b); const p = L.a + ins.length; t.focus(); t.setSelectionRange(p, p); jsugHide(); saveState(true);
}
function initJsug() {
  const t = $('jq'); if (!t) return; let tm = null;
  t.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(jsugShow, 120); });
  t.addEventListener('keydown', e => {
    if ($('jsug').style.display !== 'block' || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowDown' && JSUG.items.length) { e.preventDefault(); JSUG.on = (JSUG.on + 1) % JSUG.items.length; jsugMark(); }
    else if (e.key === 'ArrowUp' && JSUG.items.length) { e.preventDefault(); JSUG.on = JSUG.on <= 0 ? JSUG.items.length - 1 : JSUG.on - 1; jsugMark(); }
    else if (e.key === 'Enter' && JSUG.on >= 0) { e.preventDefault(); jsugPick(JSUG.on); }
    else if (e.key === 'Escape') { e.preventDefault(); jsugHide(); }
  });
  t.addEventListener('blur', () => setTimeout(jsugHide, 150));
}

/* ----- Источники данных: в «Источники данных» на главной и строкой внизу подстраницы ----- */
function sourcesList() {
  if (!REF) return [];
  return [`Квартиль и импакт-фактор («цитирований на документ за 2 года») — SCImago Journal & Country Rank, ${REF.sjYears[0]}–${REF.sjYear}.`,
    `Белый список — справочник на ${REF.wlDate}; свежий уровень — с сайта Белого списка (journalrank.rcsi.science).`,
    scHas() ? `Индексация в Scopus — Scopus Source List, ${REF.scDate}.` : '',
    csHas() ? `CiteScore, процентиль и квартиль Scopus — ${csSrc(null)}; ссылка у каждого значения ведёт на страницу издания в Scopus.` : '',
    'Статьи — Crossref и OpenAlex; авторы — OpenAlex и реестр ORCID; corresponding author и организации — OpenAlex.'].filter(Boolean);
}
function renderSources() {
  const L = sourcesList(); if ($('srcList')) $('srcList').innerHTML = L.map(x => '<li>' + esc(x) + '</li>').join('');
  if ($('srcFoot')) $('srcFoot').innerHTML = L.length ? '<div class="cap" style="margin-bottom:4px">Источники данных</div><ul style="margin:0">' + L.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '';
}

/* ----- Начальный экран «Что проверяем» (0.9): три кнопки, под ними только выбранный раздел.
   При каждом открытии страницы ни один раздел не выбран (Герман, 26.10.2026). В пределах захода «← Новый поиск»
   возвращает к тому разделу, из которого искали. Введённое при переключении не теряется; точка — в разделе уже что-то введено. */
let PANE = '';
function openPane(id, focus) {
  if (!$(id)) return; PANE = id;
  document.querySelectorAll('#inp .col').forEach(c => c.classList.toggle('on', c.id === id));
  document.querySelectorAll('#seg button').forEach(b => { const on = b.dataset.p === id; b.classList.toggle('on', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
  updDots();
  if (focus) { const f = { secA: 'author', secJ: 'jq', secL: 'list' }[id]; if ($(f)) $(f).focus(); }
}
function updDots() {
  const has = { secA: !!($('author').value.trim() || $('org').value.trim()), secJ: !!$('jq').value.trim(), secL: !!($('list').value.trim() || (typeof DOC !== 'undefined' && DOC)) };
  document.querySelectorAll('#seg button').forEach(b => { const d = b.querySelector('.dot'); if (d) d.classList.toggle('on', !!has[b.dataset.p] && b.dataset.p !== PANE); });
}
function initPanes() {
  $('seg').addEventListener('click', e => { const b = e.target.closest('button'); if (b) openPane(b.dataset.p, true); });
  document.addEventListener('keydown', e => { if (e.altKey && !e.ctrlKey && !e.metaKey && ['1', '2', '3'].indexOf(e.key) >= 0) { e.preventDefault(); if (document.body.dataset.view !== 'home') setView('home'); openPane(['secA', 'secJ', 'secL'][+e.key - 1], true); } });
  ['author', 'org', 'jq', 'list'].forEach(id => $(id).addEventListener('input', updDots));
}
