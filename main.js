// ════════════════════════════════════════════════════════
// FILE: main.js
// محلل الأسهم — البورصة المصرية
// ════════════════════════════════════════════════════════

// يحتوي على: التنقل بين التبويبات + تهيئة الصفحة
// لو عايز تضيف تبويب جديد — هنا

// ── Tabs ──────────────────────────────────────────────────────────────────
function switchTab(name) {
  document.querySelectorAll('.tab').forEach((t,i)=>{ t.classList.toggle('active', ['evaluate','compare','scenario','price','guide'][i]===name); });
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
}

function resetForm() {
  document.querySelectorAll('.criteria-input').forEach(i=>i.value='');
  ['s-name','s-price'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('s-sector').value='';
  recalculate();
}


// ── Init ──────────────────────────────────────────────────────────────────
buildRows();
buildGuide();
loadCompare();
buildCompareTable();
