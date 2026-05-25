// ════════════════════════════════════════════════════════
// FILE: price.js
// محلل الأسهم — البورصة المصرية
// ════════════════════════════════════════════════════════

// يحتوي على: تقييم السعر (P/E + P/B + PEG) + نطاق السعر العادل
// لو عايز تعدل في معايير تقييم السعر — هنا

// ── Price Evaluation ─────────────────────────────────────────────────────
function evalPE(pe) {
  if(pe < 10) return {t:'رخيص جداً ✅', c:'great', s:40, fill:85, color:'var(--success)'};
  if(pe < 15) return {t:'مقبول ✅',      c:'good',  s:28, fill:65, color:'var(--accent2)'};
  if(pe < 20) return {t:'غالي نسبياً ⚠️',c:'warn',  s:16, fill:40, color:'var(--warn)'};
  return              {t:'غالي جداً ❌',  c:'bad',   s:5,  fill:15, color:'var(--danger)'};
}
function evalPB(pb) {
  if(pb < 1)   return {t:'فرصة استثنائية 🔥',c:'great',s:30, fill:95, color:'var(--success)'};
  if(pb < 1.5) return {t:'رخيص ✅',           c:'great',s:24, fill:75, color:'var(--success)'};
  if(pb < 3)   return {t:'مقبول ⚠️',          c:'warn', s:15, fill:45, color:'var(--accent2)'};
  return              {t:'غالي ❌',            c:'bad',  s:5,  fill:15, color:'var(--danger)'};
}
function evalPEG(peg) {
  if(peg <= 0) return {t:'لا ينطبق',     c:'empty', s:15, fill:50, color:'var(--muted)'};
  if(peg < 1)  return {t:'رخيص مع نمو ✅',c:'great', s:30, fill:90, color:'var(--success)'};
  if(peg < 2)  return {t:'مقبول ⚠️',     c:'warn',  s:18, fill:55, color:'var(--warn)'};
  return              {t:'غالي ❌',       c:'bad',   s:5,  fill:15, color:'var(--danger)'};
}

function setBar(fillId, pct, color) {
  const el = document.getElementById(fillId);
  if(el) { el.style.width = pct+'%'; el.style.background = color; }
}

function runPriceEval() {
  const price  = parseFloat(document.getElementById('pv-price').value)  || 0;
  const eps    = parseFloat(document.getElementById('pv-eps').value)    || 0;
  const book   = parseFloat(document.getElementById('pv-book').value)   || 0;
  const growth = parseFloat(document.getElementById('pv-growth').value) || 0;
  const name   = document.getElementById('pv-name').value || 'السهم';

  if(!price || !eps || !book) {
    document.getElementById('pv-results').style.display = 'none';
    document.getElementById('pv-empty').style.display = 'block';
    return;
  }
  document.getElementById('pv-results').style.display = 'block';
  document.getElementById('pv-empty').style.display = 'none';

  const pe  = price / eps;
  const pb  = price / book;
  const peg = growth > 0 ? pe / growth : 0;

  // Eval each
  const peR  = evalPE(pe);
  const pbR  = evalPB(pb);
  const pegR = evalPEG(peg);

  // Display values
  document.getElementById('pv-pe-val').textContent  = pe.toFixed(1)  + 'x';
  document.getElementById('pv-pb-val').textContent  = pb.toFixed(2)  + 'x';
  document.getElementById('pv-peg-val').textContent = peg > 0 ? peg.toFixed(2) : 'N/A';

  // Result badges
  const peRes = document.getElementById('pv-pe-res');
  peRes.textContent = peR.t; peRes.className = 'criteria-result res-'+peR.c;
  const pbRes = document.getElementById('pv-pb-res');
  pbRes.textContent = pbR.t; pbRes.className = 'criteria-result res-'+pbR.c;
  const pegRes = document.getElementById('pv-peg-res');
  pegRes.textContent = pegR.t; pegRes.className = 'criteria-result res-'+pegR.c;

  // Bars
  setBar('pv-pe-fill',  peR.fill,  peR.color);
  setBar('pv-pb-fill',  pbR.fill,  pbR.color);
  setBar('pv-peg-fill', pegR.fill, pegR.color);

  // Total score
  const totalScore = peR.s + pbR.s + pegR.s;

  // Verdict
  let verdict, vDesc, vBg, vBorder, vColor;
  if(totalScore >= 80) {
    verdict='رخيص جداً — فرصة دخول قوية 🔥'; vDesc='السعر الحالي أقل من قيمته الحقيقية بشكل واضح';
    vBg='rgba(16,185,129,.08)'; vBorder='rgba(16,185,129,.3)'; vColor='var(--success)';
  } else if(totalScore >= 60) {
    verdict='بسعره العادل — دخول مقبول ✅'; vDesc='السعر معقول ومناسب للشراء على المدى المتوسط';
    vBg='rgba(59,130,246,.08)'; vBorder='rgba(59,130,246,.3)'; vColor='var(--accent2)';
  } else if(totalScore >= 35) {
    verdict='غالي نسبياً — انتظر تراجع ⚠️'; vDesc='السعر أعلى من المتوسط — ممكن تنتظر فرصة أفضل';
    vBg='rgba(245,158,11,.08)'; vBorder='rgba(245,158,11,.3)'; vColor='var(--warn)';
  } else {
    verdict='غالي جداً — تجنب دلوقتي ❌'; vDesc='السعر مبالغ فيه مقارنة بالأرباح والأصول';
    vBg='rgba(239,68,68,.08)'; vBorder='rgba(239,68,68,.3)'; vColor='var(--danger)';
  }

  const vc = document.getElementById('pv-verdict-card');
  vc.style.background = vBg; vc.style.borderColor = vBorder;
  document.getElementById('pv-stock-label').textContent = name;
  document.getElementById('pv-stock-label').style.color = vColor;
  document.getElementById('pv-verdict-text').textContent = verdict;
  document.getElementById('pv-verdict-text').style.color = vColor;
  document.getElementById('pv-verdict-desc').textContent = vDesc;
  document.getElementById('pv-score-big').textContent = totalScore;
  document.getElementById('pv-score-big').style.color = vColor;

  // Breakdown
  const bd = document.getElementById('pv-breakdown');
  bd.innerHTML = [
    {label:'P/E (40%)', val:peR.s+'/40', color:peR.color},
    {label:'P/B (30%)', val:pbR.s+'/30', color:pbR.color},
    {label:'PEG (30%)', val:pegR.s+'/30', color:pegR.color},
  ].map(b=>`
    <div style="text-align:center;background:rgba(255,255,255,.04);border-radius:10px;padding:10px;">
      <div style="font-size:18px;font-weight:900;font-family:'IBM Plex Mono',monospace;color:${b.color}">${b.val}</div>
      <div style="font-size:10px;color:rgba(255,255,255,.5);margin-top:3px">${b.label}</div>
    </div>`).join('');

  // Fair value range
  const fairLow  = (eps * 10).toFixed(2);   // P/E = 10
  const fairMid  = (eps * 15).toFixed(2);   // P/E = 15
  const fairHigh = (eps * 20).toFixed(2);   // P/E = 20
  const fairPB   = (book * 1.5).toFixed(2); // P/B = 1.5

  document.getElementById('pv-fair-low').textContent  = fairLow + ' ج';
  document.getElementById('pv-fair-high').textContent = fairHigh + ' ج';

  // Needle position
  const midFair = parseFloat(fairMid);
  const ratio = price / midFair;
  const needlePct = Math.min(Math.max((ratio / 2) * 100, 2), 98);
  document.getElementById('pv-needle').style.left = needlePct + '%';

  // Ranges
  document.getElementById('pv-ranges').innerHTML = `
    <div style="background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);border-radius:8px;padding:10px;text-align:center;">
      <div style="font-size:10px;color:var(--muted);margin-bottom:3px">رخيص (P/E أقل من 10)</div>
      <div style="font-size:14px;font-weight:700;color:var(--success);font-family:'IBM Plex Mono',monospace;">أقل من ${fairLow} ج</div>
    </div>
    <div style="background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);border-radius:8px;padding:10px;text-align:center;">
      <div style="font-size:10px;color:var(--muted);margin-bottom:3px">عادل (P/E 10-15)</div>
      <div style="font-size:14px;font-weight:700;color:var(--accent2);font-family:'IBM Plex Mono',monospace;">${fairLow} – ${fairMid} ج</div>
    </div>
    <div style="background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.2);border-radius:8px;padding:10px;text-align:center;">
      <div style="font-size:10px;color:var(--muted);margin-bottom:3px">غالي نسبياً (P/E 15-20)</div>
      <div style="font-size:14px;font-weight:700;color:var(--warn);font-family:'IBM Plex Mono',monospace;">${fairMid} – ${fairHigh} ج</div>
    </div>
    <div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:8px;padding:10px;text-align:center;">
      <div style="font-size:10px;color:var(--muted);margin-bottom:3px">غالي جداً (P/E أكتر من 20)</div>
      <div style="font-size:14px;font-weight:700;color:var(--danger);font-family:'IBM Plex Mono',monospace;">أكتر من ${fairHigh} ج</div>
    </div>
    ${book>0?`<div style="background:rgba(0,212,170,.08);border:1px solid rgba(0,212,170,.2);border-radius:8px;padding:10px;text-align:center;">
      <div style="font-size:10px;color:var(--muted);margin-bottom:3px">رخيص حسب P/B (أقل من 1.5)</div>
      <div style="font-size:14px;font-weight:700;color:var(--accent);font-family:'IBM Plex Mono',monospace;">أقل من ${fairPB} ج</div>
    </div>`:''}
  `;
}
