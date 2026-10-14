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
