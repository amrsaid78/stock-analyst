// ════════════════════════════════════════════════════════
// FILE: guide.js
// محلل الأسهم — البورصة المصرية
// ════════════════════════════════════════════════════════

// يحتوي على: بناء صفحة الـ 20 نقطة المرجعية
// لو عايز تعدل في شرح أي نقطة — هنا

// ── Guide page ────────────────────────────────────────────────────────────
function buildGuide() {
  const grid = document.getElementById('guide-grid');
  CRITERIA.forEach(c => {
    const levelClass = c.level;
    const levelLabel = {b:'مبتدئ',m:'متوسط',p:'محترف'}[c.level];
    const div = document.createElement('div');
    div.className = `guide-card ${c.level}`;
    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div class="guide-num">${String(c.num).padStart(2,'0')}</div>
        <span class="badge badge-${c.level==='b'?'beginner':c.level==='m'?'mid':'pro'}">${levelLabel}</span>
      </div>
      <div class="guide-title">${c.label}</div>
      <div class="guide-desc">${c.desc}<br><span style="color:var(--muted);font-size:11px">${c.bench}</span></div>
      <div class="guide-formula">${c.formula}</div>
    `;
    grid.appendChild(div);
  });
}
