// ════════════════════════════════════════════════════════
// FILE: evaluate.js
// محلل الأسهم — البورصة المصرية
// ════════════════════════════════════════════════════════

// يحتوي على: بناء صفوف التقييم + حساب الدرجة الكلية
// لو عايز تعدل في طريقة التقييم أو الدرجات — هنا

// ── Build evaluate page rows ──────────────────────────────────────────────
function buildRows() {
  ['b','m','p'].forEach(lvl => {
    const container = document.getElementById({b:'beginner-rows',m:'mid-rows',p:'pro-rows'}[lvl]);
    const numClass = {b:'num-b',m:'num-m',p:'num-p'}[lvl];
    CRITERIA.filter(c=>c.level===lvl).forEach(c => {
      const row = document.createElement('div');
      row.className = 'criteria-row';
      const inputEl = c.select
        ? `<select class="criteria-input" id="inp-${c.id}" onchange="recalculate()" style="cursor:pointer">
            ${c.select.map(o=>`<option value="${o.v}">${o.l}</option>`).join('')}
           </select>`
        : `<input class="criteria-input" id="inp-${c.id}" type="${c.text?'text':'number'}"
            placeholder="${c.placeholder}" step="any" oninput="recalculate()" />`;
      row.innerHTML = `
        <div class="criteria-label">
          <div class="criteria-num ${numClass}">${c.num}</div>
          ${c.label}
        </div>
        ${inputEl}
        <div class="criteria-bench">${c.bench}</div>
        <div class="criteria-result res-empty" id="res-${c.id}">—</div>
      `;
      container.appendChild(row);
    });
  });
}

// ── Recalculate score ─────────────────────────────────────────────────────
function recalculate() {
  let totalScore=0, bScore=0, mScore=0, pScore=0;
  let filled=0;
  CRITERIA.forEach(c => {
    const inp = document.getElementById('inp-'+c.id);
    const res = document.getElementById('res-'+c.id);
    const raw = inp.tagName==='SELECT' ? inp.value : inp.value.trim();
    if(raw==='') { res.className='criteria-result res-empty'; res.textContent='—'; return; }
    const v = c.text ? raw : parseFloat(raw);
    if(!c.text && isNaN(v)) return;
    const result = c.eval(v);
    res.className = 'criteria-result res-'+result.c;
    res.textContent = result.t;
    totalScore += result.s;
    if(c.level==='b') bScore+=result.s;
    if(c.level==='m') mScore+=result.s;
    if(c.level==='p') pScore+=result.s;
    filled++;
  });

  // Update score panel
  document.getElementById('score-num').textContent = totalScore;
  document.getElementById('sc-b').textContent = bScore;
  document.getElementById('sc-m').textContent = mScore;
  document.getElementById('sc-p').textContent = pScore;

  // Arc
  const arc = document.getElementById('score-arc');
  const pct = Math.min(totalScore/100, 1);
  arc.style.strokeDashoffset = 239 - (239*pct);
  const colors = totalScore>=80?'var(--success)':totalScore>=60?'var(--accent2)':totalScore>=40?'var(--warn)':'var(--danger)';
  arc.style.stroke = colors;

  // Verdict
  const v = document.getElementById('score-verdict');
  const d = document.getElementById('score-desc');
  if(filled===0){ v.textContent='أدخل البيانات'; d.textContent='سيظهر التقييم تلقائياً'; return; }
  if(totalScore>=80){ v.textContent='شراء قوي ✅'; v.style.color='var(--success)'; d.textContent='السهم ممتاز في معظم المعايير'; }
  else if(totalScore>=60){ v.textContent='شراء بحذر ✅'; v.style.color='var(--accent2)'; d.textContent='جيد مع بعض التحفظات'; }
  else if(totalScore>=40){ v.textContent='انتظار ⚠️'; v.style.color='var(--warn)'; d.textContent='في نقاط ضعف تحتاج مراجعة'; }
  else { v.textContent='تجنب ❌'; v.style.color='var(--danger)'; d.textContent='نقاط ضعف كثيرة — ابحث عن بديل'; }
}
