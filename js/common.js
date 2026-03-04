/* ============================================================
   common.js  —  全局公共 JS 工具函数
   学习页面 + 闯关游戏均引入此文件
   ============================================================ */

/* ── 折叠面板 ──
   支持两种体结构：
     A) id="acc-xxx" body_id="acc-xxx-b"   (1_3 / 2_1)
     B) id="acc-xxx" body_id="acc-xxx-body" (1_2)
   也支持 .acc-wrap > .acc-body 结构（无需 body id）
*/
function toggleAcc(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const body = document.getElementById(id + '-b')
    || document.getElementById(id + '-body')
    || el.querySelector('.acc-b, .acc-body');
  el.classList.toggle('open');
  if (body) body.classList.toggle('open');
}

/* ── 标签页 ──
   用法 A (1_2/1_3)：switchTab('tab-id', btn, 'var(--c1)')
   用法 B (1_1)：switchTab('market', btn)  → 找 id="tab-market"
*/
function switchTab(id, btn, color) {
  const container = btn.closest('.card, .tab-container, .tab-wrap') || btn.parentElement.parentElement;
  container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  container.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.remove('active');
    b.style.background = 'transparent';
    b.style.color = b.dataset.origColor || '';
  });
  // 兼容两种 panel ID 约定
  const panel = document.getElementById(id) || document.getElementById('tab-' + id);
  if (panel) panel.classList.add('active');
  btn.classList.add('active');
  const col = color || btn.style.color || 'var(--c1)';
  btn.style.background = col;
  btn.style.color = '#fff';
}

/* ── 即时测验（Mini Quiz） ──
   用法：<button class="mo" onclick="mq(this, true, 'mq0', '✅ 正确！…')">
   别名：miniCheck 兼容 module1_1 旧调用
*/
function mq(btn, ok, id, msg) {
  const wrap = btn.parentElement;
  if (wrap.querySelector('.correct, .wrong')) return;
  wrap.querySelectorAll('.mo, .mini-opt').forEach(b => b.style.pointerEvents = 'none');
  btn.classList.add(ok ? 'correct' : 'wrong');
  const fb = document.getElementById(id);
  if (!fb) return;
  fb.textContent = msg;
  fb.className = (fb.className.includes('mfb') ? 'mfb' : 'mini-fb') + ' show ' + (ok ? 'ok' : 'no');
}

// 兼容 module1_1 旧函数名
function miniCheck(btn, ok, id, msg) { mq(btn, ok, id, msg); }

/* ── 滚动入场动画 ── */
(function initReveal() {
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    }),
    { threshold: 0.07 }
  );
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ── 平滑滚动 ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});