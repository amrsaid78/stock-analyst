// ════════════════════════════════════════════════════════
// FILE: scenario.js
// محلل الأسهم — البورصة المصرية
// ════════════════════════════════════════════════════════

// يحتوي على: حاسبة السيناريوهات + السلايدرات
// لو عايز تعدل في حسابات العائد — هنا

// ── Scenario Calculator ──────────────────────────────────────────────────
let currentYear = 1;

function syncInput(key) {
  document.getElementById('in-'+key).value = document.getElementById('sl-'+key).value;
}
function syncSlider(key) {
  const v = parseFloat(document.getElementById('in-'+key).value)||0;
  document.getElementById('sl-'+key).value = v;
}
function setYear(y) {
  currentYear = y;
  ['1','2','3','5'].forEach(n => document.getElementById('yr'+n).classList.toggle('active', parseInt(n)===y));
  runScenario();
}

function fmt(n) {
  if(n>=1e9) return (n/1e9).toFixed(2)+'B';
  if(n>=1e6) return (n/1e6).toFixed(2)+'M';
  if(n>=1e3) return (n/1e3).toFixed(1)+'K';
  return n.toFixed(2);
}
function fmtJ(n) { return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,',') + ' ج'; }

function calcFV(principal, ratePercent, divPercent, years) {
  const r = ratePercent/100;
  const d = divPercent/100;
  let val = principal;
  let totalDiv = 0;
  for(let i=0;i<years;i++) {
    totalDiv += val * d;  // dividend on current value
    val = val * (1+r);
  }
  return { finalVal: val, totalDiv, total: val+totalDiv, profit: val+totalDiv-principal, pct: ((val+totalDiv-principal)/principal)*100 };
}

function runScenario() {
  const buyPrice = parseFloat(document.getElementById('sc-buy').value)||0;
  const qty = parseFloat(document.getElementById('sc-qty').value)||0;
  const divPct = parseFloat(document.getElementById('sc-div').value)||0;
  const name = document.getElementById('sc-name').value||'السهم';
  const principal = buyPrice * qty;

  if(!buyPrice || !qty) {
    document.getElementById('sc-results-card').style.display='none';
    document.getElementById('sc-empty').style.display='block';
    return;
  }
  document.getElementById('sc-results-card').style.display='block';
  document.getElementById('sc-empty').style.display='none';
  document.getElementById('sc-results-title').textContent = 'نتائج السيناريوهات — ' + name;
  document.getElementById('sc-invest-badge').textContent = 'رأس المال: ' + fmtJ(principal);

  const scenarios = [
    { key:'cons', label:'متحفظ 🐢', color:'var(--success)',  bg:'rgba(16,185,129,.08)',  border:'rgba(16,185,129,.25)' },
    { key:'base', label:'متوسط 🚶', color:'var(--accent2)', bg:'rgba(59,130,246,.08)',  border:'rgba(59,130,246,.25)' },
    { key:'bull', label:'متفائل 🚀',color:'var(--warn)',    bg:'rgba(245,158,11,.08)', border:'rgba(245,158,11,.25)' },
    { key:'bear', label:'سلبي 📉',   color:'var(--danger)',  bg:'rgba(239,68,68,.08)',   border:'rgba(239,68,68,.25)' },
  ];

  const rates = {};
  scenarios.forEach(s => rates[s.key] = parseFloat(document.getElementById('in-'+s.key).value)||0);

  const yr = currentYear;
  const results = {};
  scenarios.forEach(s => { results[s.key] = calcFV(principal, rates[s.key], divPct, yr); });

  // Cards
  const cardsEl = document.getElementById('sc-cards');
  cardsEl.innerHTML = scenarios.map(s => {
    const r = results[s.key];
    const isPos = r.profit >= 0;
    return `<div class="sc-result-card" style="background:${s.bg};border:1px solid ${s.border}">
      <div style="font-size:12px;font-weight:700;color:${s.color}">${s.label}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:2px">نمو ${rates[s.key]}% سنوياً</div>
      <div class="sc-val" style="color:${s.color}">${fmtJ(r.total)}</div>
      <div class="sc-profit" style="color:${isPos?'var(--success)':'var(--danger)'}">
        ${isPos?'+ ':'- '}${fmtJ(Math.abs(r.profit))}
      </div>
      <div class="sc-label">${isPos?'ربح':'خسارة'} ${Math.abs(r.pct).toFixed(1)}%</div>
      ${divPct>0?`<div style="font-size:10px;color:var(--muted);margin-top:4px">منها توزيعات ${fmtJ(r.totalDiv)}</div>`:''}
    </div>`;
  }).join('');

  // Bars
  const maxVal = Math.max(...scenarios.map(s=>results[s.key].total));
  const barsEl = document.getElementById('sc-bars');
  document.getElementById('bar-year-label').textContent = yr===1?'سنة':yr===2?'سنتين':yr+' سنوات';
  barsEl.innerHTML = scenarios.map(s => {
    const r = results[s.key];
    const widthPct = Math.max((r.total/maxVal)*100, 3);
    return `<div class="sc-bar-row">
      <div class="sc-bar-label" style="color:${s.color};font-weight:700">${s.label}</div>
      <div class="sc-bar-track">
        <div class="sc-bar-fill" style="width:${widthPct}%;background:${s.color}">
          <span class="sc-bar-num">${fmtJ(r.total)}</span>
        </div>
      </div>
    </div>`;
  }).join('');

  // Full table (all years)
  const years = [1,2,3,5];
  const table = document.getElementById('sc-table');
  const headers = ['السنة', ...scenarios.map(s=>`<span style="color:${s.color}">${s.label}</span>`)];
  let thtml = `<thead><tr>${headers.map(h=>`<th class="sc-table">${h}</th>`).join('')}</tr></thead><tbody>`;

  // Row for initial investment
  thtml += `<tr><td style="color:var(--muted);font-weight:600">البداية</td>`;
  scenarios.forEach(() => { thtml += `<td style="font-family:'IBM Plex Mono',monospace;font-weight:700">${fmtJ(principal)}</td>`; });
  thtml += '</tr>';

  years.forEach(y => {
    const isActive = y===yr;
    thtml += `<tr style="${isActive?'background:rgba(0,212,170,.06);':''}" onclick="setYear(${y})" style="cursor:pointer">`;
    thtml += `<td style="font-weight:${isActive?700:400};color:${isActive?'var(--accent)':'var(--text)'}">`;
    thtml += y===1?'بعد سنة':y===2?'بعد سنتين':`بعد ${y} سنوات`;
    thtml += '</td>';
    scenarios.forEach(s => {
      const r = calcFV(principal, rates[s.key], divPct, y);
      const isPos = r.profit>=0;
      thtml += `<td>
        <div style="font-family:'IBM Plex Mono',monospace;font-weight:700">${fmtJ(r.total)}</div>
        <div style="font-size:10px;color:${isPos?'var(--success)':'var(--danger)'}">${isPos?'+':''}${r.pct.toFixed(1)}%</div>
      </td>`;
    });
    thtml += '</tr>';
  });
  thtml += '</tbody>';
  table.innerHTML = thtml;
}
