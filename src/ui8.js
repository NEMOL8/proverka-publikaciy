/* ===== 0.8: экран — индекс Хирша со страницы профиля, режим «Журнал», загрузка документа ===== */

/* ----- Индекс Хирша со страницы профиля (правка 4) ----- */
let HXOPEN = false, HXMSG = '', HXLAST = null;
const hxFio = S => { const p = S.parsed || {}; if (p.name) return p.name; const i = S.prof && !S.prof.err && S.prof.info[0]; return i && i.name && !/^A\d+$/.test(i.name) ? i.name : ''; };
function hxToggle() { HXOPEN = !HXOPEN; renderAuthor(); if (HXOPEN) { const t = $('hxText'); if (t) { t.focus(); goTo('hxPanel'); } } }
function hxPanelHtml(S) {
  if (!HXOPEN && !(S.hx && S.hx.length)) return '';
  let h = `<div class="plinks" id="hxPanel"><b>Индекс Хирша со страницы профиля</b>`;
  if (S.hx && S.hx.length) h += '<table class="t" style="margin-top:6px"><tr><th style="width:18%">База</th><th style="width:10%">Хирш</th><th>Что ещё на странице</th><th style="width:14%"></th></tr>' + S.hx.map((x, i) => `<tr><td>${esc(H_BASE_NAME[x.base] || x.base)}${x.id ? '<div class="dim">профиль ' + esc(x.id) + '</div>' : ''}</td><td><b>${x.val}</b>${x.label ? '<div class="dim">' + esc(x.label) + '</div>' : ''}</td><td class="dim">${x.alts && x.alts.length ? x.alts.map(a => esc(a.label) + ': ' + a.v).join('; ') : ''}${x.nameOk === false ? ' ' + chip('check', 'фамилия автора на странице не найдена — тот ли профиль?') : ''}</td><td><button class="sec small" onclick="hxRemove(${i})">Убрать</button></td></tr>`).join('') + '</table>';
  if (HXOPEN) {
    h += `<p class="dim" style="margin:6px 0">Откройте профиль автора по ссылке (eLibrary, Scopus, Web of Science, Google Scholar), выделите страницу (Ctrl+A), скопируйте (Ctrl+C) и вставьте сюда — или вставьте снимок страницы (Ctrl+V в это поле) либо выберите его: <input type="file" id="hxFile" accept="image/*" onchange="hxImage([...this.files])">. Текст страницы никуда не отправляется — индекс Хирша находится на этом компьютере.</p>`
      + `<div class="row" style="align-items:flex-end"><div style="flex:4 1 360px"><textarea id="hxText" style="min-height:90px" placeholder="Текст страницы профиля автора"></textarea></div><div style="flex:1 1 180px"><label for="hxBase">База</label><select id="hxBase" style="width:100%;padding:6px;font:inherit"><option value="">узнать по странице</option><option value="rinc">РИНЦ (eLibrary)</option><option value="scopus">Scopus</option><option value="wos">Web of Science</option><option value="gs">Google Scholar</option></select><p style="margin:6px 0 0"><button onclick="hxAdd()">Найти индекс Хирша</button></p></div></div>`;
    if (HXMSG) h += `<p>${chip('check', 'проверьте')} ${esc(HXMSG)}${HXLAST && HXLAST.cands.length > 1 ? ' ' + HXLAST.cands.map(v => `<button class="sec small" onclick="hxPick(${v})">${v}</button>`).join(' ') : ''}</p>`;
  }
  return h + '</div>';
}
function hxAdd(text) {
  const S = AU; text = text != null ? text : ($('hxText') ? $('hxText').value : ''); if (!String(text).trim()) { HXMSG = 'вставьте текст страницы профиля'; renderAuthor(); return; }
  const r = parseHirschPage(text, ($('hxBase') && $('hxBase').value) || null, parseFIO(hxFio(S)));
  HXLAST = r.val == null && r.cands.length > 1 ? r : null;
  if (r.val == null) { HXMSG = r.err; renderAuthor(); if ($('hxText')) $('hxText').value = text; return; }
  hxPush(r); if ($('hxText')) $('hxText').value = '';
}
function hxPush(r) {
  const S = AU; S.hx = (S.hx || []).filter(x => !(x.base === r.base && (x.id || '') === (r.id || '')));
  S.hx.push({ base: r.base, val: r.val, label: r.label, alts: r.alts, id: r.id, nameOk: r.nameOk }); HXMSG = ''; HXLAST = null;
  renderAuthor(); updateNav(); saveState();
}
function hxPick(v) { if (!HXLAST) return; const r = Object.assign({}, HXLAST, { val: v, label: 'выбрано из нескольких чисел на странице' }); hxPush(r); }
function hxRemove(i) { AU.hx.splice(i, 1); renderAuthor(); saveState(); }
async function hxImage(files) {
  if (!files.length || BUSY) return; BUSY = true; HXMSG = 'Распознаю снимок страницы…'; renderAuthor();
  try { const r = await ocrImage(files[0]); BUSY = false; hxAdd(r.text); if (HXMSG) HXMSG += ` (снимок распознан с уверенностью ${r.conf} %)`; renderAuthor(); }
  catch (e) { BUSY = false; HXMSG = 'снимок не распознан: ' + (e.message || e); renderAuthor(); }
}

/* ----- Режим «Журнал» (правка 5): название или ISSN → квартиль, импакт-фактор, Белый список, Scopus ----- */
const JR = { rows: [], year: null };
function runJournals() {
  if (!REF) return; const lines = $('jq').value.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 300);
  JR.year = +$('jy').value || null; if (JR.year && (JR.year < 1990 || JR.year > 2100)) JR.year = null;
  $('jstatus').textContent = lines.length ? 'Ищу в справочниках…' : 'Впишите название журнала или ISSN — по одному в строке.';
  setTimeout(() => { JR.rows = lines.map(q => { const res = findJournalQuery(q); return { q, res, pick: res.sure ? res.hits.indexOf(res.sure) : null }; });
    const n = JR.rows.filter(r => r.pick != null).length; $('jstatus').textContent = lines.length ? `Готово: определено ${n} из ${lines.length}` + (n < lines.length ? '; для остальных выберите вариант или уточните запрос (лучше — ISSN).' : '.') : '';
    renderJournals(); updateNav(); goTo('outJournal'); saveState(true); }, 20);
}
function pickJournal(r, k) { JR.rows[r].pick = k; renderJournals(); saveState(true); }
const qS = q => q ? 'Q' + q : 'без квартиля';
function catsHtml(cats) { if (!cats) return ''; return `<details class="mini"><summary>квартили по разделам (${REF.sjYear})</summary><span class="dim">${cats.split(';').map(s => esc(s.trim())).join('<br>')}</span></details>`; }
/* 0.9, правка 5: журнал — строка-ведомость. Крупно: квартиль SCImago, импакт-фактор, уровень Белого списка; рядом «сейчас»;
   квартиль по годам — плашками «год Q»; индексация; строка CiteScore Scopus (правка 6); ссылки и примечания. */
const big = (v, sub, cls) => `<div class="jbig${cls ? ' ' + cls : ''}">${v}</div>${sub ? `<div class="dim">${sub}</div>` : ''}`;
function idxDots(wl, sc, year) {
  const d = (n, on, t) => `<span class="${on ? 'on' : 'off'}" title="${esc(t || '')}">${on ? '●' : '○'} ${n}</span>`;
  const sct = sc ? scStatusText(sc) : '';
  return `<span class="idx dim">${wl ? d('WoS CC', wl.wos, 'по данным Белого списка') + ' &nbsp;' : ''}${d('Scopus' + (sc && sc.covText ? ' ' + esc(sc.covText) : ''), !!(sc ? sc.status === 1 : wl && wl.scopus), sc ? 'Scopus Source List ' + REF.scDate + ': ' + sct : 'по данным Белого списка')}${wl ? ' &nbsp;' + d('RSCI', wl.rsci, 'по данным Белого списка') : ''}</span>`;
}
function journalSheet(e, year, head, notes) {
  const f = journalFacts(e, year), sj = e.sj, wl = e.wl, is = f.issns.join(' · ');
  let h = `<div class="jsheet">${head || ''}<div class="jtop"><div><div class="jname">${esc(f.title)}</div>`
    + (wl && sj && norm(wl.title.split(' | ')[0]) !== norm(sj.title) ? `<div class="dim">в Белом списке: ${esc(wl.title.split(' | ')[0])}</div>` : '')
    + `<div class="jmeta">${is ? 'ISSN ' + esc(is) : 'ISSN нет'}${sj && sj.type ? ' · ' + SJ_TYPE[sj.type] : (!sj && e.cs && CS_TYPE[e.cs.type] && e.cs.type !== 'j' ? ' · ' + CS_TYPE[e.cs.type] : '')}</div></div><div>${idxDots(wl, e.sc, year || null)}</div></div>`;
  h += '<div class="jgrid">';
  if (sj) {
    const nowDiff = f.qNowYear !== f.qYear;
    h += `<div><div class="cap">Квартиль SCImago ${f.qYear}</div>${big(f.q ? 'Q' + f.q : '—', (year && !f.qExact ? `за ${year} данных нет — взят ${f.qYear}` : '') + (nowDiff ? `${year && !f.qExact ? '<br>' : ''}сейчас (${f.qNowYear}): ${f.qNow !== f.q ? chip('check', qS(f.qNow)) : qS(f.qNow)}` : (year ? '' : 'сейчас')))}</div>`;
    h += `<div><div class="cap">Импакт-фактор</div>${f.cpd != null ? big(fmtNum(f.cpd), `цит. на документ SCImago, ${f.qYear}` + (nowDiff && f.cpdNow != null ? `<br>сейчас (${f.qNowYear}): ${fmtNum(f.cpdNow)}` : '')) : big('—', 'нет данных', 't')}</div>`;
  } else h += `<div><div class="cap">Квартиль SCImago</div>${big(chip('unk', 'нет в SCImago'), e.sc || e.cs ? 'в Scopus есть, квартиля SCImago нет' : '', 't')}</div><div><div class="cap">Импакт-фактор</div>${big('—', 'нет в SCImago', 't')}</div>`;
  if (wl) { const a = wlAt(wl, year || null); h += `<div><div class="cap">Белый список${year ? ' ' + year : ''}</div>${a.excluded ? big(chip('check', 'исключён ' + wl.disc), '', 't') : big(a.lv || '—', (a.lv ? 'уровень' : 'без уровня') + (a.y ? ` (${a.y})` : '') + (!a.excluded && (a.curExcl || a.cur !== a.lv) ? '<br>' + chip('check', a.curExcl ? 'сейчас исключён ' + wl.disc : 'сейчас ' + (a.cur ? 'уровень ' + a.cur : 'без уровня')) : ''))}</div>`; }
  else h += `<div><div class="cap">Белый список</div>${big('нет', 'нет в списке', 't')}</div>`;
  h += `<div><div class="cap">Квартиль SCImago по годам</div>${sj ? yearChips(sj, year || null, 6) + (Object.keys(sj.hist).length > 6 ? `<details class="mini"><summary>все годы</summary>${yearChips(sj, year || null, 0)}</details>` : '') + catsHtml(f.cats) : '<span class="dim">нет данных</span>'}</div>`;
  h += '</div>' + csLine(e.cs, sj ? f.qNow : null);
  const links = [sj ? lnk(`https://www.scimagojr.com/journalsearch.php?q=${sj.sid}&tip=sid`, 'SCImago') : lnk('https://www.scimagojr.com/journalsearch.php?q=' + encodeURIComponent(f.title), 'SCImago: поиск'), e.sc && e.sc.id ? lnk(scLink(e.sc), 'Scopus') : (sj ? lnk(scopusSource(sj.sid), 'Scopus') : lnk('https://www.scopus.com/sources.uri', 'Scopus Sources')), wl ? `<span title="справочник от ${REF.wlDate}">${wlLink(wl)} Белого списка</span>` : '', f.issns[0] ? lnk('https://mjl.clarivate.com/search-results?issn=' + f.issns[0], 'есть ли в WoS') : '', lnk('https://jcr.clarivate.com/', 'JCR')].filter(Boolean).join(' · ');
  const nh = notesHtml(notes || []);
  h += `<div class="jfoot"><span class="dim">${links}</span>${e.sc ? `<span class="dim">Scopus: ${esc(scStatusText(e.sc))}</span>` : ''}${nh ? `<span>${chip('check', 'примечания')} ${nh}</span>` : ''}</div>`;
  return { f, html: h + '</div>' };
}
function renderJournals() {
  const el = $('outJournal'); if (!el) return;
  if (!JR.rows.length) { el.innerHTML = ''; $('jOut').style.display = 'none'; return; }
  let h = `<h2>Журналы (${JR.rows.length})${JR.year ? ` <span class="sub">· на ${JR.year} год</span>` : ''}</h2>`;
  JR.rows.forEach((r, ri) => {
    const res = r.res, qh = `<div class="cap" style="margin-bottom:6px">Запрос: <span style="text-transform:none;letter-spacing:0;color:var(--ink)">${esc(r.q)}</span>${r.pick != null && res.hits.length > 1 ? ` &nbsp;<button class="linkbtn" style="font-size:12px" onclick="pickJournal(${ri},null)">другие варианты (${res.hits.length - 1})</button>` : ''}</div>`;
    if (r.pick != null) { const hit = res.hits[r.pick], c0 = journalFacts(hit.e, JR.year); const notes = res.notes.concat(c0.notes).concat(hit.how === 'similar' ? [`название совпало не полностью (${Math.round(hit.score * 100)} %) — убедитесь, что это тот журнал`] : []).concat(hit.how === 'title' && !res.issns.length ? ['найден по названию — надёжнее сверить по ISSN'] : []);
      h += journalSheet(hit.e, JR.year, qh, notes).html; return; }
    if (!res.hits.length) { h += `<div class="jsheet">${qh}${chip('unk', 'не найдено в справочниках')} <span class="dim">В SCImago${scHas() ? ', списке источников Scopus' : ''}${csHas() ? ', CiteScore' : ''} и Белом списке (от ${REF.wlDate}) такого издания нет. Это не значит, что журнал нигде не индексируется: проверьте написание или впишите ISSN. Поиск: ${lnk('https://www.scimagojr.com/journalsearch.php?q=' + encodeURIComponent(r.q), 'SCImago')} · ${lnk('https://journalrank.rcsi.science/ru/record-sources/?s=' + encodeURIComponent(r.q), 'Белый список')} · ${lnk('https://mjl.clarivate.com/search-results?search=' + encodeURIComponent(r.q), 'WoS')}</span></div>`; return; }
    h += `<div class="jsheet">${qh}${chip('check', 'выберите')} <span class="dim">Однозначно определить журнал нельзя — похожие издания:</span>` + res.hits.map((x, k) => `<div style="margin-top:6px"><button class="sec small" onclick="pickJournal(${ri},${k})">Это он</button> <b>${esc(x.e.title)}</b> <span class="dim">${[x.e.issns.map(fmtIssn).join(', '), x.e.sj ? 'SCImago ' + qS(x.e.sj.q) : 'нет в SCImago', x.e.wl ? 'Белый список' : '', x.e.sc || x.e.cs ? 'Scopus' : '', x.how === 'issn' ? 'по ISSN' : 'совпадение ' + Math.round(x.score * 100) + ' %'].filter(Boolean).map(esc).join(' · ')}</span></div>`).join('') + (res.notes.length ? `<div class="dim">${res.notes.map(esc).join('; ')}</div>` : '') + '</div>';
  });
  el.innerHTML = h; $('jOut').style.display = '';
}
function journalTable() {
  const y = JR.year, L = [['Запрос', 'Издание', 'ISSN', 'Квартиль SCImago' + (y ? ' (' + y + ')' : ''), 'Год квартиля', 'Квартиль сейчас (' + REF.sjYear + ')', 'Импакт-фактор (SCImago, цит. на документ за 2 года)', 'Белый список' + (y ? ' (' + y + ')' : ''), 'Индексация (Белый список)', 'Scopus (список источников)'].concat(csHead()).concat(['Ссылка SCImago', 'Примечания'])];
  JR.rows.forEach(r => {
    if (r.pick == null) { L.push([r.q, r.res.hits.length ? 'не выбран: ' + r.res.hits.map(x => x.e.title).join('; ') : 'не найдено в справочниках']); return; }
    const hit = r.res.hits[r.pick], e = hit.e, f = journalFacts(e, y);
    L.push([r.q, f.title, f.issns.join(', '), e.sj ? qS(f.q) : 'нет в SCImago', e.sj ? f.qYear : '', e.sj ? qS(f.qNow) : '', e.sj && f.cpd != null ? Math.round(f.cpd * 100) / 100 : '', wlS(e.wl, y || null), idxS(e.wl), scS(e.sc, y || null)].concat(csCols(e.cs)).concat([e.sj ? `https://www.scimagojr.com/journalsearch.php?q=${e.sj.sid}&tip=sid` : '', r.res.notes.concat(f.notes).join('; ')]));
  });
  return L;
}
function copyJournals() { if (JR.rows.length) toClip(journalTable().map(r => tsvRow(r.map(cellTxt))).join('\n'), 'jstatus'); }
function exportJournals(kind) { if (!JR.rows.length) return; const t = journalTable(), nm = 'Журналы_' + today(); download(nm + '.' + kind, kind === 'xlsx' ? xlsxBlob('Журналы', t) : csvBlob(t)); $('jstatus').textContent = 'Файл ' + nm + '.' + kind + ' сохранён в папку загрузок.'; }

/* ----- Загрузка документа (правка 6): PDF или Word → найденные записи → обычная проверка списка. Документ никуда не отправляется. ----- */
let DOC = null;
const SITE_PDF = () => typeof window !== 'undefined' && window.PC_SITE === true;
async function getPdf() {
  if (typeof pdfjsLib === 'undefined') { if (SITE_PDF()) await loadScript(new URL('pdf/pdf.min.js?v=' + VERSION, location.href).href); else throw new Error('чтение PDF в эту сборку не включено'); }
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    if (SITE_PDF()) pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdf/pdf.worker.min.js?v=' + VERSION, location.href).href;
    else pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(new Blob([new TextDecoder().decode(embedded('pdf-worker'))], { type: 'application/javascript' }));
  }
  return pdfjsLib;
}
/* Строки страницы PDF по координатам текста; большой промежуток по горизонтали — граница ячейки таблицы */
function pdfLines(items) {
  const it = items.filter(i => i.str && i.str.trim()).map(i => ({ s: i.str, x: i.transform[4], y: i.transform[5], w: i.width || 0, h: Math.abs(i.transform[3]) || i.height || 10 })).sort((a, b) => b.y - a.y || a.x - b.x);
  const lines = []; it.forEach(i => { const l = lines[lines.length - 1]; if (l && Math.abs(l.y - i.y) <= Math.max(2, l.h * 0.5)) l.items.push(i); else lines.push({ y: i.y, h: i.h, items: [i] }); });
  const out = []; let prevY = null, prevH = 10;
  lines.forEach(l => {
    // отдельные куски текста с промежутком больше 0,6 высоты шрифта — разные ячейки (просвет между словами меньше)
    l.items.sort((a, b) => a.x - b.x); const cells = []; let cur = null, end = 0;
    l.items.forEach(i => { const gap = i.x - end; if (!cur || gap > l.h * 0.6) { cur = { t: i.s, x: i.x, w: i.w }; cells.push(cur); } else { cur.t += (gap > l.h * 0.12 && !/\s$/.test(cur.t) && !/^\s/.test(i.s) ? ' ' : '') + i.s; cur.w = i.x + i.w - cur.x; } end = i.x + i.w; });
    if (prevY != null && prevY - l.y > Math.max(l.h, prevH) * 2.1) out.push('');
    cells.forEach(c => { c.t = c.t.replace(/\s+/g, ' ').trim(); });
    out.push({ cells, y: l.y, h: l.h }); prevY = l.y; prevH = l.h;
  });
  return out;
}
async function readPdf(buf, msg) {
  const lib = await getPdf(); const doc = await lib.getDocument({ data: buf, isEvalSupported: false, disableFontFace: true, useSystemFonts: false }).promise;
  const pages = [], scanned = [];
  for (let n = 1; n <= doc.numPages; n++) {
    msg(`Читаю страницу ${n} из ${doc.numPages}…`);
    const pg = await doc.getPage(n), tc = await pg.getTextContent(), chars = tc.items.reduce((s, i) => s + (i.str || '').trim().length, 0);
    if (chars >= 30) { pages.push(pdfLines(tc.items)); continue; }
    // страница без текста — скан: распознать как снимок
    if (!ocrAvailable()) { pages.push([]); scanned.push(n); continue; }
    msg(`Страница ${n} из ${doc.numPages} — скан, распознаю (первый раз — до минуты)…`);
    const vp = pg.getViewport({ scale: 2 }), cv = document.createElement('canvas'); cv.width = Math.round(vp.width); cv.height = Math.round(vp.height);
    await pg.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise;
    const blob = await new Promise(ok => cv.toBlob(ok, 'image/png')); const r = await ocrImage(blob);
    pages.push(r.text.split('\n')); scanned.push(n);
  }
  return { pages, scanned };
}
/* .docx — архив zip: word/document.xml распаковывается встроенным в браузер распаковщиком */
async function unzipEntry(buf, name) {
  const u = new Uint8Array(buf), dv = new DataView(buf); let e = -1;
  for (let i = u.length - 22; i >= Math.max(0, u.length - 65557); i--) if (dv.getUint32(i, true) === 0x06054b50) { e = i; break; }
  if (e < 0) throw new Error('файл не похож на .docx');
  let p = dv.getUint32(e + 16, true); const n = dv.getUint16(e + 10, true), dec = new TextDecoder();
  for (let k = 0; k < n; k++) {
    const method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true), fl = dv.getUint16(p + 28, true), xl = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true), off = dv.getUint32(p + 42, true);
    const fn = dec.decode(u.subarray(p + 46, p + 46 + fl));
    if (fn === name) { const lfl = dv.getUint16(off + 26, true), lxl = dv.getUint16(off + 28, true), data = u.subarray(off + 30 + lfl + lxl, off + 30 + lfl + lxl + csize);
      if (method === 0) return dec.decode(data);
      if (typeof DecompressionStream === 'undefined') throw new Error('браузер не умеет распаковывать .docx — сохраните документ как PDF');
      const st = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw')); return await new Response(st).text(); }
    p += 46 + fl + xl + cl;
  }
  throw new Error('в файле нет word/document.xml — это не документ Word');
}
function docxPages(xml) {
  const d = new DOMParser().parseFromString(xml, 'application/xml'), W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
  const body = d.getElementsByTagNameNS(W, 'body')[0]; if (!body) throw new Error('документ Word не прочитан');
  const pages = [[]], cnt = {}, add = l => pages[pages.length - 1].push(l);
  const ptext = p => { let t = ''; const walk = n => { for (const c of n.childNodes) { if (c.namespaceURI === W) { if (c.localName === 't') t += c.textContent; else if (c.localName === 'tab') t += '\t'; else if (c.localName === 'br' && c.getAttributeNS(W, 'type') !== 'page') t += ' '; else walk(c); } } }; walk(p); return t; };
  const brk = p => p.getElementsByTagNameNS(W, 'lastRenderedPageBreak').length || [...p.getElementsByTagNameNS(W, 'br')].some(b => b.getAttributeNS(W, 'type') === 'page');
  for (const el of body.children) {
    if (el.localName === 'p') {
      if (brk(el) && pages[pages.length - 1].length) pages.push([]);
      let t = ptext(el).replace(/\s+$/, ''); const np = el.getElementsByTagNameNS(W, 'numPr')[0], ps = el.getElementsByTagNameNS(W, 'pStyle')[0], psv = ps ? ps.getAttributeNS(W, 'val') : '';
      // нумерация стилем абзаца («Нумерованный список», List Number) — номера в тексте тоже нет
      if (!np && /list\s*number|listnumber|нумерован/i.test(psv) && t.trim()) { cnt.st = (cnt.st || 0) + 1; if (!/^\s*\d{1,3}\s*[.)]/.test(t)) t = cnt.st + '. ' + t.trim(); }
      // автонумерация Word: номера в тексте нет — ставим сами
      if (np && t.trim()) { const v = tag => { const x = np.getElementsByTagNameNS(W, tag)[0]; return x ? x.getAttributeNS(W, 'val') : '0'; }, k = v('numId') + ':' + v('ilvl'); cnt[k] = (cnt[k] || 0) + 1; if (!/^\s*\d{1,3}\s*[.)]/.test(t)) t = cnt[k] + '. ' + t.trim(); }
      add(t);
    } else if (el.localName === 'tbl') {
      for (const tr of el.getElementsByTagNameNS(W, 'tr')) { if (tr.parentNode !== el) continue; const cells = [...tr.childNodes].filter(c => c.localName === 'tc').map((tc, i) => ({ t: [...tc.getElementsByTagNameNS(W, 'p')].map(ptext).join(' ').replace(/\s+/g, ' ').trim(), x: i })); add({ cells, row: true }); }
      add('');
    }
  }
  return pages;
}
async function readDocument(files) {
  const f = files[0]; if (!f || BUSY) return; BUSY = true; const box = $('docOut'), msg = t => { box.innerHTML = `<p class="dim">${esc(t)}</p>`; }; box.style.display = '';
  try {
    const nm = f.name.toLowerCase(), buf = await f.arrayBuffer(); let pages, scanned = [];
    if (/\.pdf$/.test(nm) || f.type === 'application/pdf') ({ pages, scanned } = await readPdf(buf, msg));
    else if (/\.docx$/.test(nm)) { msg('Читаю документ Word…'); pages = docxPages(await unzipEntry(buf, 'word/document.xml')); }
    else if (/\.doc$/.test(nm)) throw new Error('старый формат .doc не читается — сохраните документ как .docx или PDF');
    else throw new Error('нужен файл PDF или Word (.docx)');
    const r = findDocRecords(pages); DOC = { name: f.name, recs: r.records.map(x => ({ text: x.text, page: x.page, on: true })), heading: r.heading, total: r.total, scanned, word: /\.docx$/.test(nm) };
    renderDoc();
  } catch (e) { box.innerHTML = `<p>${chip('unk', 'не прочитан')} ${esc(e.message || String(e))}. Можно скопировать список из документа и вставить его в поле ниже текстом.</p>`; }
  BUSY = false;
}
function renderDoc() {
  const box = $('docOut'); if (!DOC) { box.style.display = 'none'; box.innerHTML = ''; return; }
  const n = DOC.recs.length, on = DOC.recs.filter(r => r.on).length, pg = [...new Set(DOC.recs.map(r => r.page))];
  let h = `<div class="docbox"><b>Документ «${esc(DOC.name)}»</b> `;
  if (!n) h += `<p>${chip('unk', 'публикации не найдены')} В документе не нашлось записей, похожих на публикации${DOC.scanned.length ? ' (страницы-сканы распознаны с изображения: ' + DOC.scanned.join(', ') + ')' : ''}. Скопируйте нужный кусок текста и вставьте его в поле списка ниже.</p>`;
  else {
    h += `<span class="dim">найдено записей: <b>${n}</b>${DOC.word ? '' : ', на страницах ' + esc(pg.join(', '))}${DOC.total && !DOC.word ? ' из ' + DOC.total : ''}; ${DOC.heading ? 'раздел «' + esc(DOC.heading.slice(0, 80)) + '»' : 'раздел со списком публикаций не найден — записи искались по всему документу'}.</span>`;
    h += `<p>${chip('check', 'проверьте')} Сложная вёрстка (две колонки, таблицы-картинки) и плохие сканы читаются не полностью — проверьте, все ли записи найдены и нет ли лишних. Уберите флажок у лишних, поправьте текст при необходимости.${DOC.scanned.length ? ' Страницы ' + DOC.scanned.join(', ') + ' — сканы, распознаны с изображения: сверьте текст.' : ''}</p>`;
    h += '<table class="t"><tr><th style="width:6%"></th><th style="width:8%">Стр.</th><th>Запись</th></tr>' + DOC.recs.map((r, i) => `<tr${r.on ? '' : ' style="opacity:.5"'}><td><input type="checkbox" ${r.on ? 'checked' : ''} onchange="docOn(${i},this.checked)"></td><td class="dim">${DOC.word ? '' : r.page}</td><td><textarea style="min-height:44px;font-size:12.5px" oninput="docEdit(${i},this.value)">${esc(r.text)}</textarea></td></tr>`).join('') + '</table>';
    h += `<p><button onclick="docRun()">Проверить отмеченные (${on})</button> <button class="sec" onclick="docAdd()">Только перенести в поле списка</button> <button class="sec" onclick="docClose()">Закрыть</button></p>`;
  }
  if (!n) h += `<p><button class="sec" onclick="docClose()">Закрыть</button></p>`;
  box.innerHTML = h + '</div>'; box.style.display = '';
}
function docOn(i, v) { DOC.recs[i].on = v; renderDoc(); }
function docEdit(i, v) { DOC.recs[i].text = v; }
/* в поле списка — сплошная нумерация 1, 2, 3…: в документе номера могут начинаться заново в каждом разделе */
function docText() { return DOC.recs.filter(r => r.on && r.text.trim()).map((r, k) => (k + 1) + '. ' + r.text.replace(/\s+/g, ' ').trim().replace(/^(?:\[\d{1,3}\]|\d{1,3}\s*[.)])\s*/, '')).join('\n'); }
function docAdd() { if (!DOC) return; $('list').value = docText() + '\n'; countEntries(); DOC = null; renderDoc(); saveState(true); goTo('inp'); }
function docRun() { if (!DOC) return; $('list').value = docText() + '\n'; countEntries(); DOC = null; renderDoc(); runList(); }
function docClose() { DOC = null; renderDoc(); }
