/* ===== Удобство (0.7.11): прошлая проверка в браузере, отметки «проверено», сортировка, выгрузка файлом, печать =====
   Всё хранится только в этом браузере (localStorage); в интернет ничего не уходит. */
const LS = {
  get(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { } },
};

/* ----- 1. Не терять работу: состояние сохраняется после каждого действия ----- */
function stateNow(withProfile) {
  const au = Object.assign({}, AU);
  if (au.prof && !au.prof.err) au.prof = withProfile ? { aw: au.prof.aw, ids: au.prof.ids, how: au.prof.how, info: au.prof.info } : null;
  return { v: 1, t: Date.now(), list: $('list').value, author: $('author').value, org: $('org').value,
    W: W.entries ? { entries: W.entries, works: W.works.map(w => w === undefined ? '__u' : w), netDown: W.netDown, auto: W.auto, numbered: W.numbered, stopped: !!W.stopped } : null,
    AU: au.prof || au.cands || au.orcCands || au.parsed ? au : null, FLT, SORT };
}
let _saveT = null;
function saveState(soon) {
  if (soon) { clearTimeout(_saveT); _saveT = setTimeout(() => saveState(), 800); return; }
  if (RESTORE_PENDING) return;  // пока человек не решил, продолжать ли прошлую — не затирать её
  if (!LS.set('pc_state', stateNow(true))) LS.set('pc_state', Object.assign(stateNow(false), { profDropped: true }));
}
let RESTORE_PENDING = false;
function offerRestore() {
  const st = LS.get('pc_state'); if (!st || (!st.W && !st.AU)) return;
  const d = new Date(st.t), when = d.toLocaleDateString('ru-RU') + ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const what = [st.W ? 'публикаций в списке: ' + st.W.entries.length : '', st.AU && st.AU.prof && st.AU.prof.info ? 'автор ' + ((st.AU.prof.info[0] || {}).name || '') : (st.author ? 'автор «' + st.author + '»' : '')].filter(Boolean).join(', ');
  RESTORE_PENDING = true;
  const b = $('resume'); b.style.display = 'flex';
  b.innerHTML = `<b>Прошлая проверка от ${esc(when)}</b><span class="dim">${esc(what)}</span><button id="resYes">Продолжить прошлую проверку</button><button id="resNo" class="sec">Начать заново</button>`;
  $('resYes').onclick = () => { RESTORE_PENDING = false; b.style.display = 'none'; restoreState(st); };
  $('resNo').onclick = () => { RESTORE_PENDING = false; b.style.display = 'none'; LS.del('pc_state'); };
}
function restoreState(st) {
  $('list').value = st.list || ''; $('author').value = st.author || ''; if (st.org != null) $('org').value = st.org; countEntries(); showParsed();
  if (st.FLT) { FLT.list = Object.assign(FLT0(), st.FLT.list); FLT.au = Object.assign(FLT0(), st.FLT.au); }
  if (st.SORT) Object.assign(SORT, st.SORT);
  AU = newS();
  if (st.AU) { AU = Object.assign(newS(), st.AU); if (AU.prof && !AU.prof.err && AU.prof.aw) AU.prof.js = AU.prof.aw.works.map(w => judgeProfileWork(w, AU.prof.ids)); }
  if (st.profDropped && $('author').value.trim()) AU.msgs = (AU.msgs || []).concat(['публикации автора не поместились в память браузера — нажмите «Найти автора» (ответы баз возьмутся из кеша)']);
  if (st.W) { W.entries = st.W.entries; W.works = st.W.works.map(w => w === '__u' ? undefined : w); W.netDown = st.W.netDown; W.auto = st.W.auto; W.numbered = st.W.numbered; W.stopped = st.W.stopped; rejudge(); }
  renderAll(); retryVis(); goTo(W.entries ? 'outList' : 'outAuthor');
}

/* ----- 10. Отметка «проверено» по строке ----- */
let MARKS = LS.get('pc_marks') || {};
const markKeyL = p => 'L:' + ((p.work && p.work.doi) || norm(p.entry.raw).slice(0, 90));
const markKeyA = x => 'A:' + (x.w.doi || x.w.oaId || norm(x.w.title).slice(0, 90));
function setMark(k, on) { if (on) MARKS[k] = Date.now(); else delete MARKS[k]; LS.set('pc_marks', MARKS); renderAll(); }
const markBox = k => `<label class="mk noprint" title="отметка для себя — сохраняется в этом браузере"><input type="checkbox" ${MARKS[k] ? 'checked' : ''} onchange="setMark('${esc(k).replace(/'/g, '&#39;')}',this.checked)">проверено</label>`;

/* ----- 9. Сортировка кликом по заголовку ----- */
const SORT = { list: { k: '', dir: 0 }, au: { k: '', dir: 0 } };
const SORT_FIRST = { year: -1, q: 1, wl: 1, if: -1 };  // первый клик: годы и импакт-фактор — по убыванию, квартиль и уровень — Q1 и 1 сверху
function setSort(id, k) { const s = SORT[id]; if (s.k !== k) { s.k = k; s.dir = SORT_FIRST[k]; } else if (s.dir === SORT_FIRST[k]) s.dir = -s.dir; else { s.k = ''; s.dir = 0; } id === 'list' ? renderList() : renderAuthor(); saveState(true); }
function sortTh(id, k, html, style) { const s = SORT[id], on = s.k === k; return `<th class="sort"${style ? ` style="${style}"` : ''} onclick="setSort('${id}','${k}')" title="сортировать — клик; ещё клик — обратно; третий — как было">${html}${on ? ` <span class="arr">${s.dir > 0 ? '▲' : '▼'}</span>` : ''}</th>`; }
/* значения для сортировки; пустое — всегда в конце */
function sortRows(rows, id, keyOf) {
  const s = SORT[id]; if (!s.k) return rows;
  const val = r => { const k = keyOf(r); const v = { year: k.y, q: k.qY || null, wl: k.excl ? null : (k.wl || null), if: k.cpd }[s.k]; return v == null || v === 0 ? null : v; };
  return rows.map((r, i) => ({ r, i, v: val(r) })).sort((a, b) => a.v == null && b.v == null ? a.i - b.i : a.v == null ? 1 : b.v == null ? -1 : (a.v - b.v) * s.dir || a.i - b.i).map(x => x.r);
}

/* ----- 5. Выгрузка файлом: Excel (.xlsx без сторонних библиотек) и CSV для русского Excel ----- */
function download(name, blob) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); }
const today = () => new Date().toISOString().slice(0, 10);
const cellTxt = v => v == null ? '' : (typeof v === 'number' && !Number.isInteger(v) ? fmtNum(v) : String(v));
function csvBlob(rows) {
  const q = v => { const t = cellTxt(v).replace(/\r?\n/g, ' '); return /[";\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t; };
  return new Blob(['﻿' + rows.map(r => r.map(q).join(';')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
}
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = u => { let c = 0xFFFFFFFF; for (let i = 0; i < u.length; i++) c = CRC[(c ^ u[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
/* zip без сжатия: несколько файлов XML — этого достаточно для .xlsx */
function zipStore(files) {
  const enc = new TextEncoder(), parts = [], cen = []; let off = 0;
  const u16 = v => [v & 255, (v >>> 8) & 255], u32 = v => [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255];
  for (const [name, text] of files) {
    const nm = enc.encode(name), data = enc.encode(text), crc = crc32(data);
    const head = [...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(nm.length), ...u16(0)];
    parts.push(new Uint8Array([...u32(0x04034b50), ...head]), nm, data);
    cen.push(new Uint8Array([...u32(0x02014b50), ...u16(20), ...head, ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(off)]), nm);
    off += 30 + nm.length + data.length;
  }
  const cs = cen.reduce((s, x) => s + x.length, 0);
  return new Blob(parts.concat(cen, [new Uint8Array([...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(files.length), ...u16(files.length), ...u32(cs), ...u32(off), ...u16(0)])]), { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}
function xlsxBlob(sheet, rows) {
  const x = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');
  const col = i => { let s = ''; i++; while (i) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = (i - m - 1) / 26; } return s; };
  const ncol = Math.max(1, ...rows.map(r => r.length));
  const width = i => Math.min(60, Math.max(8, ...rows.slice(0, 200).map(r => cellTxt(r[i]).length * 0.9)));
  const body = rows.map((r, ri) => `<row r="${ri + 1}">` + r.map((v, ci) => { const ref = col(ci) + (ri + 1), st = ri === 0 ? ' s="1"' : '';
    if (typeof v === 'number' && isFinite(v)) return `<c r="${ref}"${st}><v>${v}</v></c>`;
    const t = cellTxt(v); return t ? `<c r="${ref}" t="inlineStr"${st}><is><t xml:space="preserve">${x(t)}</t></is></c>` : ''; }).join('') + '</row>').join('');
  const ws = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${Array.from({ length: ncol }, (_, i) => `<col min="${i + 1}" max="${i + 1}" width="${Math.round(width(i))}" customWidth="1"/>`).join('')}</cols><sheetData>${body}</sheetData><autoFilter ref="A1:${col(ncol - 1)}${Math.max(1, rows.length)}"/></worksheet>`;
  return zipStore([
    ['[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'],
    ['_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
    ['xl/workbook.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${x(sheet.slice(0, 31))}" sheetId="1" r:id="rId1"/></sheets><definedNames><definedName name="_xlnm._FilterDatabase" localSheetId="0" hidden="1">'${x(sheet.slice(0, 31))}'!$A$1:$${col(ncol - 1)}$${Math.max(1, rows.length)}</definedName></definedNames></workbook>`],
    ['xl/_rels/workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'],
    ['xl/worksheets/sheet1.xml', ws],
    ['xl/styles.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs></styleSheet>'],
  ]);
}

/* ----- 6. Печать / PDF: свёрнутое разворачивается, кнопки и фильтры скрыты (стили @media print) ----- */
let _printOpened = [];
function beforePrint() { _printOpened = [...document.querySelectorAll('#outList details:not([open]), #outAuthor details:not([open])')].filter(d => !d.classList.contains('fhelp')); _printOpened.forEach(d => { d.open = true; }); }
function afterPrint() { _printOpened.forEach(d => { d.open = false; }); _printOpened = []; }
function printPage() { beforePrint(); window.print(); }
window.addEventListener('beforeprint', () => { if (!_printOpened.length) beforePrint(); });
window.addEventListener('afterprint', afterPrint);
