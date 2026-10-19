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
/* Страница целиком: каждая строка читается обеими моделями и берётся лучшая — на одной странице бывают
   и русские, и английские записи (eLibrary), а модель для всей страницы одна портила половину строк (0.7.11).
   Абзацы — по английскому прочтению: пустая строка между ними сохраняется (по ней делится список без номеров). */
async function readLines(w, cv, psm) {
  const res = {};
  for (const l of ['eng', 'rus']) { await w[l].setParameters({ tessedit_pageseg_mode: psm }); const { data } = await w[l].recognize(cv, {}, { text: true, blocks: true }); res[l] = data; }
  const paras = d => (d.blocks || []).flatMap(b => b.paragraphs || []);
  const E = paras(res.eng), R = (res.rus.lines || []);
  if (!E.length || !R.length) return res.rus.confidence > res.eng.confidence + 2 ? { text: res.rus.text, conf: res.rus.confidence } : { text: res.eng.text, conf: res.eng.confidence };
  const ov = (a, b) => Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0)) / Math.max(1, Math.min(a.y1 - a.y0, b.y1 - b.y0));
  const val = ln => (ln.confidence || 0) * (0.5 + 0.5 * ocrQuality(ln.text).ratio);
  const used = new Set(), out = []; let cs = 0, cn = 0;
  for (const p of E) {
    const lines = [];
    for (const le of p.lines || []) {
      let best = null, bo = 0.5; R.forEach((lr, k) => { const o = ov(le.bbox, lr.bbox); if (o > bo && !used.has(k)) { bo = o; best = k; } });
      let pick = le; if (best != null) { used.add(best); if (val(R[best]) > val(le)) pick = R[best]; }
      const t = pick.text.replace(/\s+$/, ''); if (t.trim()) { lines.push(t); cs += pick.confidence || 0; cn++; }
    }
    if (lines.length) out.push(lines.join('\n'));
  }
  return { text: out.join('\n\n'), conf: cn ? cs / cn : 0 };
}
/* Снимок увеличивается до ширины не меньше 2400 точек: мелкий текст иначе не читается.
   Затем предобработка (правка 4, 0.7.11): серый по минимуму каналов, растяжение контраста, повышение резкости, чёрно-белое по Otsu. */
async function toCanvas(blob, raw) {
  const bmp = await createImageBitmap(blob); const k = Math.min(4, Math.max(1, 2400 / bmp.width));
  const cv = document.createElement('canvas'); cv.width = Math.round(bmp.width * k); cv.height = Math.round(bmp.height * k);
  const cx = cv.getContext('2d', { willReadFrequently: true }); cx.fillStyle = '#fff'; cx.fillRect(0, 0, cv.width, cv.height); cx.imageSmoothingQuality = 'high'; cx.drawImage(bmp, 0, 0, cv.width, cv.height);
  if (!raw) preprocess(cx, cv.width, cv.height);
  return { cv, cx, small: bmp.width < 1200, width: bmp.width };
}
/* Синий и фиолетовый текст ссылок на светло-сером фоне (eLibrary) по яркости получается серым и тонет в фоне;
   по минимуму каналов (min(R,G,B)) он становится почти чёрным, а светлый фон остаётся светлым. */
function preprocess(cx, W, H) {
  const img = cx.getImageData(0, 0, W, H), d = img.data, n = W * H, g = new Float32Array(n);
  for (let i = 0, j = 0; i < n; i++, j += 4) g[i] = Math.min(d[j], d[j + 1], d[j + 2]);
  // растяжение контраста: 1 % самых тёмных — чёрное, 1 % самых светлых — белое
  const hist = new Uint32Array(256); for (let i = 0; i < n; i++) hist[g[i] | 0]++;
  let lo = 0, hi = 255, acc = 0; for (; lo < 255; lo++) { acc += hist[lo]; if (acc > n * 0.01) break; } acc = 0; for (; hi > 0; hi--) { acc += hist[hi]; if (acc > n * 0.01) break; }
  if (hi - lo > 20) { const s = 255 / (hi - lo); for (let i = 0; i < n; i++) g[i] = Math.max(0, Math.min(255, (g[i] - lo) * s)); }
  // резкость: изображение + 0,8 × (изображение − размытое 5×5)
  const b = boxBlur(g, W, H, 2), out = new Uint8ClampedArray(n); for (let i = 0; i < n; i++) out[i] = g[i] + 0.8 * (g[i] - b[i]);
  // порог Otsu
  hist.fill(0); for (let i = 0; i < n; i++) hist[out[i]]++;
  let sum = 0; for (let t = 0; t < 256; t++) sum += t * hist[t];
  let sB = 0, wB = 0, best = 0, th = 128; for (let t = 0; t < 256; t++) { wB += hist[t]; if (!wB) continue; const wF = n - wB; if (!wF) break; sB += t * hist[t]; const mB = sB / wB, mF = (sum - sB) / wF, v = wB * wF * (mB - mF) * (mB - mF); if (v > best) { best = v; th = t; } }
  // светлый текст на тёмном фоне — инвертировать: распознавателю нужен тёмный текст на светлом
  let dark = 0; for (let i = 0; i < n; i++) if (out[i] <= th) dark++; const inv = dark > n * 0.5;
  for (let i = 0, j = 0; i < n; i++, j += 4) { let v = out[i] <= th ? 0 : 255; if (inv) v = 255 - v; d[j] = d[j + 1] = d[j + 2] = v; d[j + 3] = 255; }
  cx.putImageData(img, 0, 0);
}
function boxBlur(src, W, H, r) {
  const tmp = new Float32Array(W * H), out = new Float32Array(W * H), k = 2 * r + 1;
  for (let y = 0; y < H; y++) { let s = 0; const o = y * W; for (let x = -r; x <= r; x++) s += src[o + Math.min(W - 1, Math.max(0, x))]; for (let x = 0; x < W; x++) { tmp[o + x] = s / k; s += src[o + Math.min(W - 1, x + r + 1)] - src[o + Math.max(0, x - r)]; } }
  for (let x = 0; x < W; x++) { let s = 0; for (let y = -r; y <= r; y++) s += tmp[Math.min(H - 1, Math.max(0, y)) * W + x]; for (let y = 0; y < H; y++) { out[y * W + x] = s / k; s += tmp[Math.min(H - 1, y + r + 1) * W + x] - tmp[Math.max(0, y - r) * W + x]; } }
  return out;
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
async function ocrImage(blob, raw) {
  const { cv, cx, small } = await toCanvas(blob, raw); const w = await getOcr(); const g = findGrid(cx, cv.width, cv.height);
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
    if (lines.length) { const text = lines.join('\n'); return { text, conf: nc ? Math.round(conf / nc) : 0, small, table: true, q: ocrQuality(text) }; }
  }
  const data = await readLines(w, cv, '3');
  return { text: data.text, conf: Math.round(data.conf), small, table: false, q: ocrQuality(data.text) };
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
