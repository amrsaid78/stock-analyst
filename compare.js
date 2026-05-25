// ════════════════════════════════════════════════════════
// FILE: compare.js
// محلل الأسهم — البورصة المصرية
// ════════════════════════════════════════════════════════

// يحتوي على: جدول المقارنة + حفظ البيانات في localStorage
// لو عايز تعدل في المقارنة أو الحفظ — هنا

// ── Compare page ──────────────────────────────────────────────────────────
let compareStocks = [];

function saveToCompare() {
  const name = document.getElementById('s-name').value || 'سهم جديد';
  const sector = document.getElementById('s-sector').value;
  const vals = {};
  CRITERIA.forEach(c => {
    vals[c.id] = document.getElementById('inp-'+c.id).value;
  });
  const score = parseInt(document.getElementById('score-num').textContent)||0;
  const verdict = document.getElementById('score-verdict').textContent;
  if(compareStocks.length>=4) compareStocks.shift();
  compareStocks.push({name, sector, vals, score, verdict});
  buildCompareTable();
  switchTab('compare');
}

function buildCompareTable() {
  const grid = document.getElementById('compare-grid');
  const cols = Math.max(compareStocks.length, 1);
  grid.style.gridTemplateColumns = `200px repeat(${cols},1fr)`;
  let html = `<div class="cg-header label-col">البيان</div>`;
  compareStocks.forEach(s => html+=`<div class="cg-header">${s.name}<br><small style="color:var(--muted);font-weight:400">${s.sector||''}</small></div>`);

  CRITERIA.forEach(c => {
    html += `<div class="cg-label">${c.num}. ${c.label}</div>`;
    compareStocks.forEach(s => {
      const raw = s.vals[c.id];
      let cell = `<div class="cg-input-cell"><span style="font-size:12px;font-family:'IBM Plex Mono',monospace;color:var(--accent)">${raw||'—'}</span></div>`;
      if(raw!=='' && raw!==undefined) {
        if(c.select) {
          // select type — pass raw value directly to eval
          const r = c.eval(raw);
          if(r.c !== 'empty') cell = `<div class="cg-result-cell"><span class="criteria-result res-${r.c}" style="font-size:11px">${r.t}</span></div>`;
        } else {
          const v = c.text ? raw : parseFloat(raw);
          if(!isNaN(v) || c.text) { const r=c.eval(v); cell=`<div class="cg-result-cell"><span class="criteria-result res-${r.c}" style="font-size:11px">${r.t}</span></div>`; }
        }
      }
      html += cell;
    });
  });

  // Score row
  html += `<div class="cg-label" style="font-weight:700;color:var(--text)">الدرجة الكلية</div>`;
  compareStocks.forEach(s => {
    const color = s.score>=80?'var(--success)':s.score>=60?'var(--accent2)':s.score>=40?'var(--warn)':'var(--danger)';
    html+=`<div class="cg-score-cell" style="color:${color}">${s.score}</div>`;
  });
  html += `<div class="cg-label" style="font-weight:700;color:var(--text)">الحكم</div>`;
  compareStocks.forEach(s => html+=`<div class="cg-verdict-cell">${s.verdict}</div>`);

  grid.innerHTML = html;
}

function clearCompare() { compareStocks=[]; buildCompareTable(); }

// ── LocalStorage persistence ─────────────────────────────────────────────
const STORE_KEY = 'egypt_stocks_compare';
function saveCompare() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(compareStocks)); } catch(e){}
}
function loadCompare() {
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if(saved) { compareStocks = JSON.parse(saved); }
  } catch(e){}
}
const _origSave = saveToCompare;
function saveToCompare() {
  const name = document.getElementById('s-name').value || 'سهم جديد';
  const sector = document.getElementById('s-sector').value;
  const vals = {};
  CRITERIA.forEach(c => { vals[c.id] = document.getElementById('inp-'+c.id).value; });
  const score = parseInt(document.getElementById('score-num').textContent)||0;
  const verdict = document.getElementById('score-verdict').textContent;
  if(compareStocks.length>=4) compareStocks.shift();
  compareStocks.push({name, sector, vals, score, verdict});
  saveCompare();
  buildCompareTable();
  switchTab('compare');
}
const _origClear = clearCompare;
function clearCompare() { compareStocks=[]; saveCompare(); buildCompareTable(); }
