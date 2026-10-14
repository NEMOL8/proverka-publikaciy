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
  const now = new Date().getFullYear();
  FLT.grp.yFrom = now - KD.years; FLT.grp.yTo = now - 1;
  // кнопки и поля работают сразу; поиск включается, когда загружены справочники
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
  await loadData();
}
/* Справочники: в одной странице — внутри, на сайте — файл data/ref.json (около 8 МБ) с показом хода загрузки и ограничением по времени */
async function loadData() {
  const btns = ['go', 'ago', 'ggo'];
  try {
    const el = $('ref-data'); let data;
    if (el) data = JSON.parse(el.textContent);
    else {
      btns.forEach(b => $(b).disabled = true);
      const info = t => { $('refinfo').textContent = t; };
      info('Загружаю справочники SCImago и Белого списка (около 8 МБ, один раз — дальше из кеша браузера)…');
      const r = await tfetch('data/ref.json?v=' + VERSION, {}, 120000); if (!r.ok) throw new Error('сайт ответил ' + r.status);
      const total = +r.headers.get('content-length') || 0;
      if (r.body && r.body.getReader) {
        const rd = r.body.getReader(), parts = []; let got = 0;
        for (;;) { const { done, value } = await rd.read(); if (done) break; parts.push(value); got += value.length; info(`Загружаю справочники: ${Math.round(got / 1e6 * 10) / 10} МБ${total ? ' из ' + Math.round(total / 1e6 * 10) / 10 : ''}…`); }
        const all = new Uint8Array(got); let o = 0; parts.forEach(p => { all.set(p, o); o += p.length; }); data = JSON.parse(new TextDecoder().decode(all));
      } else data = await r.json();
    }
    loadRef(data);
  } catch (e) { $('refinfo').innerHTML = chip('unk', 'справочники не загружены') + ' ' + esc(e.message || e) + '. Поиск статей не работает, «Проверить связь» работает. <button class="sec small" onclick="loadData()">Повторить</button>'; return; }
  btns.forEach(b => $(b).disabled = false);
  $('refinfo').textContent = `Справочники: SCImago за ${REF.sjYears[0]}–${REF.sjYear} годы (${REF.sj.length} изданий), Белый список на ${REF.wlDate} (${REF.wl.length} изданий).`;
}
const W = { entries: null, works: [], pubs: [], netDown: '', auto: null, dups: [] };
const newS = () => ({ prof: null, cands: null, orcCands: null, similar: null, msgs: [], parsed: null, orcIds: null, hirsch: {} });
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
  if (BUSY || !REF) return;
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
/* Индексация издания по данным Белого списка (WoS Core Collection, Scopus, RSCI) */
function idxText(wl) {
  if (!wl) return '<span class="dim">индексация: нет данных (издания нет в Белом списке)</span>';
  const f = (n, v) => `${n} — ${v ? '<b>да</b>' : 'нет'}`;
  return `<span class="dim">индексация (по Белому списку): ${f('WoS CC', wl.wos)}, ${f('Scopus', wl.scopus)}, ${f('RSCI', wl.rsci)}</span>`;
}
/* Квартиль WoS (JCR): открытого источника нет — ссылка для проверки и поле, куда вписать значение; хранится по ISSN до перезагрузки страницы */
const JCRQ = {};
const issnKey = issns => (issns || []).map(normIssn).filter(Boolean).sort().join(' ');
function jcrField(issns) {
  const k = issnKey(issns); if (!k) return '';
  const v = JCRQ[k] || '', is = fmtIssn(k.split(' ')[0]);
  return `<br><span class="dim">WoS (JCR):</span> <input type="text" class="yr q" value="${esc(v)}" placeholder="вписать" onchange="setJcr('${k}',this.value)"> <span class="dim">${lnk('https://mjl.clarivate.com/search-results?issn=' + is, 'есть ли в WoS')} · ${lnk('https://jcr.clarivate.com/', 'JCR')} (квартиль — только по подписке)</span>`;
}
function setJcr(k, v) { v = String(v || '').trim(); if (v) JCRQ[k] = v; else delete JCRQ[k]; renderList(); renderAuthor(); renderGroup(); }
function quartText(jv, sj, short, wl, issns) {
  if (!sj) return chip('unk', 'нет в SCImago') + (wl !== undefined ? '<br>' + idxText(wl) : '') + (issns ? jcrField(issns) : '');
  let h = `${qChip(jv.qY)} <span class="dim">${jv.sjYear}${jv.sjExact ? '' : ' (за год публикации данных нет)'}</span>`;
  if (jv.yL !== jv.sjYear && jv.qL !== jv.qY) h += `<br>${chip('check', 'сейчас ' + (jv.qL ? 'Q' + jv.qL : 'без квартиля'))} <span class="dim">${jv.yL}</span>`;
  if (!short) h += `<br><span class="dim">${esc(jv.hist)}</span>`;
  return h + ` <span class="dim">${lnk(`https://www.scimagojr.com/journalsearch.php?q=${sj.sid}&tip=sid`, 'SCImago')}</span>` + (issns ? jcrField(issns) : '');
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
    const jc = `<b>${esc(w.journal || 'издание не указано')}</b>` + (w.issns.length ? '<br><span class="dim">ISSN ' + w.issns.map(x => esc(fmtIssn(normIssn(x)))).join(', ') + '</span>' : '') + (p.j.sj ? '<br>' + idxText(p.j.wl) : '');
    h += `<tr><td>${numOf(e, i)}</td><td>${c1}</td><td>${jc}</td><td>${quartText(p.jv, p.j.sj, false, p.j.wl, w.issns)}</td><td>${wlCell(p)}</td><td>${ifCell(p)}</td><td>${authorsCell(p)}</td><td>${nh}</td></tr>`;
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
  if (BUSY || !REF) return; BUSY = true; $('ago').disabled = true; applyNet(); W.auto = null; AU = newS();
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
  add('orcid', p.orcid, 'введено'); add('scopus', p.scopus, 'введено'); add('rid', p.rid, 'введено'); add('rinc', p.rinc, 'введено'); add('spin', p.spin, 'введено');
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
  h += hirschHtml(S, k, L);
  return h + ` <p style="margin:6px 0 0"><button class="sec small" onclick="copyLinks(${k})">Скопировать ссылки</button></p></div>`;
}
/* ----- Индекс Хирша по базам. Scopus, WoS и РИНЦ открытых интерфейсов не дают — значение смотрится в профиле по ссылке и вписывается вручную;
   OpenAlex считает свой Хирш (по своей базе, с самоцитированием) — показывается справочно. ----- */
const H_BASES = [['scopus', 'Scopus', 'scopus'], ['wos', 'Web of Science', 'rid'], ['rinc', 'РИНЦ (eLibrary)', 'rinc']];
function hirschLink(L, idb) { const x = L.ids.find(i => i.b === idb); if (x) return { u: BASES[idb].url(x.v), t: 'профиль ' + x.v }; const s = L.sr.find(i => i.b === ({ scopus: 'Scopus', rid: 'Web of Science', rinc: 'eLibrary' })[idb]); return s ? { u: s.u, t: 'поиск автора', q: s.q } : null; }
function hirschHtml(S, k, L) {
  const prof = S.prof && !S.prof.err ? S.prof : null; if (!prof && !L.ids.length) return '';
  let h = '<p style="margin:10px 0 4px"><b>Индекс Хирша</b></p><table class="t"><tr><th style="width:24%">База</th><th style="width:22%">Значение</th><th>Где посмотреть</th></tr>';
  for (const [key, name, idb] of H_BASES) {
    const l = hirschLink(L, idb), v = S.hirsch[key] || '';
    h += `<tr><td>${esc(name)}</td><td><input type="text" class="yr" value="${esc(v)}" placeholder="вписать" onchange="setHirsch(${k},'${key}',this.value)"> <span class="dim">${v ? 'вписано вручную' : ''}</span></td><td>${l ? lnk(l.u, l.t) + (l.q ? ' <span class="dim">(ввести «' + esc(l.q) + '»)</span>' : '') : '<span class="dim">идентификатора нет</span>'} <span class="dim">— открытого доступа к значению нет, посмотрите в профиле${key === 'scopus' ? ' (нужна подписка или вход)' : (key === 'wos' ? ' (нужен доступ к Web of Science)' : '')}</span></td></tr>`;
  }
  const oa = prof ? prof.info.filter(a => a.h != null) : [];
  h += `<tr><td>OpenAlex</td><td>${oa.length ? oa.map(a => '<b>' + a.h + '</b>' + (oa.length > 1 ? ' <span class="dim">(' + esc(a.id) + ')</span>' : '')).join(', ') : chip('unk', 'нет данных')}</td><td>${prof ? prof.info.map(a => lnk('https://openalex.org/' + a.id, 'профиль ' + a.id)).join(', ') : ''} <span class="dim">— свой расчёт OpenAlex по своей базе и с самоцитированием; с Scopus, WoS и РИНЦ не совпадает, для сверки не годится</span></td></tr></table>`;
  return h;
}
function setHirsch(k, key, v) { const S = stOf(k); v = String(v || '').trim(); if (v) S.hirsch[key] = v; else delete S.hirsch[key]; k < 0 ? renderAuthor() : renderGroup(); }
function copyLinks(k) {
  const S = stOf(k), L = profileLinks(S), out = [];
  L.ids.forEach(x => out.push(tsvRow([BASES[x.b].name, x.v, x.src.join(', '), BASES[x.b].url(x.v)])));
  L.sr.forEach(x => out.push(tsvRow([x.b + ' — поиск по имени', x.q, '', x.u])));
  if (L.warns.length) out.push(tsvRow(['Проверьте', L.warns.join('; ')]));
  H_BASES.forEach(([key, name]) => { if (S.hirsch[key]) out.push(tsvRow(['Индекс Хирша ' + name, S.hirsch[key], 'вписано вручную'])); });
  if (S.prof && !S.prof.err) S.prof.info.filter(a => a.h != null).forEach(a => out.push(tsvRow(['Индекс Хирша OpenAlex (свой расчёт)', a.h, a.id, 'https://openalex.org/' + a.id])));
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
    else h += `<table class="t"><tr><th style="width:5%">Год</th><th>Статья и ссылка</th><th style="width:14%">Издание</th><th style="width:11%">Квартиль</th><th style="width:11%">Белый список</th><th style="width:6%">Показатель</th><th style="width:9%">Место автора</th><th style="width:10%">Corresponding</th><th style="width:13%">Организация${orgOn ? ' (сверка)' : ''}</th></tr>` + rows.map(x => {
      const url = wLink(x.w);
      return `<tr><td>${x.w.year || ''}</td><td>${esc(x.w.title)}${k < 0 && listed.has(x.w.doi) && x.w.doi ? ' ' + nchip('в списке') : ''}${x.w.type === 'review' ? ' <span class="dim">обзор</span>' : ''}<br>${url ? lnk(url) : chip('unk', 'ссылки нет')}</td><td>${esc(x.w.journal)}</td><td>${quartText(x.jv, x.j.sj, true, x.j.wl)}</td><td>${wlText(x.j.wl, x.w.year, true)}</td><td>${x.jv.cpd != null ? fmtNum(x.jv.cpd) : ''}</td><td class="dim">${esc(x.pos || '')}</td><td>${corrChip(x.corrSt, x.corrNames)}</td><td class="dim">${orgHtml(orgOf(x.me))}</td></tr>`;
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
  if (BUSY || !REF) return; const lines = grpLines(); if (!lines.length) { $('gstatus').textContent = 'Введите авторов — по одному на строку.'; return; }
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
const idxS = wl => !wl ? 'нет данных' : ['WoS CC', 'Scopus', 'RSCI'].filter((n, i) => [wl.wos, wl.scopus, wl.rsci][i]).join(', ') || 'ни в одной';
const corrS = w => !w.oa ? 'нет данных' : (!w.corr || !w.corr.known ? 'в базе не указан' : w.corr.names.join(', '));
const orgS = me => { const o = orgOf(me); return o.names.join('; ') + (o.st && $('org').value.trim() ? ' [' + ORG_T[o.st] + ']' : ''); };
function copyList() {
  if (!W.entries) return; const ids = auIds().length; const L = [tsvRow(['№', 'Найденная статья', 'Ссылка', 'Год', 'Тип', 'Издание', 'ISSN', 'Квартиль (год публикации)', 'Квартиль сейчас (' + REF.sjYear + ')', 'Квартиль WoS (JCR), вписано', 'Индексация (Белый список)', 'Белый список (год публикации)', 'Цит. на документ SCImago', 'Импакт-фактор в списке', 'Corresponding (OpenAlex)'].concat(ids ? ['Найденный автор — corresponding', 'Организация автора'] : []).concat(['Первый автор', 'Последний автор', 'Примечания']))];
  listRows().forEach(({ p, i }) => { const w = p.work, jv = p.jv || {}, a = w ? w.authors : [], m = w ? listMe(w) : null; L.push(tsvRow([numOf(p.entry, i), w ? w.title : 'не найдена', w ? 'https://doi.org/' + w.doi : '', w ? w.year : '', w ? p.typeName : '', w ? w.journal : '', w ? w.issns.join(', ') : '', w && p.j.sj ? (jv.qY ? 'Q' + jv.qY : 'нет') + ' (' + jv.sjYear + ')' : '', w && p.j.sj && jv.qL ? 'Q' + jv.qL : '', w ? JCRQ[issnKey(w.issns)] || '' : '', w ? idxS(p.j.wl) : '', w ? wlS(p.j.wl, w.year) : '', w && jv.cpd != null ? fmtNum(jv.cpd) : '', p.declIF != null ? fmtNum(p.declIF) : '', w ? corrS(w) : ''].concat(ids ? [m && m.me ? CORR_T[m.corr] : 'нет данных', m && m.me ? orgS(m.me) : ''] : []).concat([aName(a[0]), a.length > 1 ? aName(a[a.length - 1]) : '', p.notes.concat(dupNotes(i)).join('; ')]))); });
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
