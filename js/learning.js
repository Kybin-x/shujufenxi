/* ============================================================
   learning.js  —  学习页面专用 JS
   依赖：common.js（需先引入）

   各页面需在 HTML 的 <script> 中定义：
     window.QUIZ_DATA = {
       qz1: { exp: '解析文字' },
       qz2: { exp: '解析文字' },
       ...
     }
   ============================================================ */

/* ── 导航栏滚动高亮 ── */
(function initNavHighlight() {
  const secs = document.querySelectorAll('section[id]');
  const navs = document.querySelectorAll('.nav-item');
  if (!secs.length || !navs.length) return;
  window.addEventListener('scroll', () => {
    let cur = '';
    secs.forEach(s => { if (window.scrollY >= s.offsetTop - 130) cur = s.id; });
    navs.forEach(n => n.classList.toggle('active', n.getAttribute('href') === '#' + cur));
  });
})();

/* ── 综合测试 ── */
const _qzState = {};  // { qz1: true/false/null, ... }
const _qzDone = {};  // { qz1: true, ... }

/**
 * 选择选项（兼容 .qopt / .qz-opt 两套类名）
 * @param {HTMLElement} el   被点击的选项元素
 * @param {string}      qId  题目容器 id（如 'qz1'）
 * @param {boolean}     isOk 该选项是否正确
 */
function selOpt(el, qId, isOk) {
  if (_qzDone[qId]) return;
  // 兼容 .qopt 和 .qz-opt
  document.querySelectorAll('#' + qId + ' .qopt, #' + qId + ' .qz-opt').forEach(o => o.classList.remove('sel'));
  el.classList.add('sel');
  _qzState[qId] = isOk;
  // 兼容 .qsub 和 .qz-sub
  const btn = document.querySelector('#' + qId + ' .qsub') || document.querySelector('#' + qId + ' .qz-sub');
  if (btn) btn.disabled = false;
}

// 别名：module2_1 使用 sel(...)
function sel(el, qId, isOk) { selOpt(el, qId, isOk); }

/**
 * 提交答案
 * @param {string} qId 题目容器 id
 */
function submitQ(qId) {
  if (_qzDone[qId]) return;
  if (_qzState[qId] === undefined || _qzState[qId] === null) {
    // 未选择任何项时忽略
    return;
  }
  _qzDone[qId] = true;

  const ok = _qzState[qId];
  const data = (window.QUIZ_DATA || {})[qId] || {};

  // 锁定所有选项（兼容两套类名）
  document.querySelectorAll('#' + qId + ' .qopt, #' + qId + ' .qz-opt').forEach(o => {
    o.classList.add('locked');
    o.style.pointerEvents = 'none';
    if (o.classList.contains('sel')) o.classList.add(ok ? 'correct' : 'wrong');
  });

  // 显示反馈（兼容 .qfb 和 .qz-fb）
  const fb = document.getElementById(qId + '-fb');
  if (fb) {
    fb.innerHTML = '<strong>' + (ok ? '✅ 答对了！' : '❌ 答错了！') + '</strong>' + (data.exp || '');
    fb.className = (fb.className.includes('qz-fb') ? 'qz-fb' : 'qfb') + ' show ' + (ok ? 'ok' : 'no');
  }

  // 隐藏提交按钮
  const btn = document.querySelector('#' + qId + ' .qsub') || document.querySelector('#' + qId + ' .qz-sub');
  if (btn) btn.style.display = 'none';

  // 检查是否全部完成
  const total = Object.keys(window.QUIZ_DATA || {}).length || 5;
  if (Object.keys(_qzDone).length >= total) {
    setTimeout(showScore, 600);
  }
}

// 别名：module2_1 使用 sub(...)；module1_2 使用 submitQz(...)
function sub(qId) { submitQ(qId); }
function submitQz(qId) { submitQ(qId); }

/** 展示最终得分 */
function showScore() {
  const correct = Object.values(_qzState).filter(v => v === true).length;
  const total = Object.keys(_qzState).length;

  const numEl = document.getElementById('sc-num');
  const emEl = document.getElementById('sc-emoji');
  const msgEl = document.getElementById('sc-msg');
  const box = document.getElementById('qz-score');
  if (!box) return;

  if (numEl) numEl.textContent = correct + '/' + total;

  const pct = Math.round((correct / total) * 100);
  const map = [
    [100, '🏆', '满分！掌握非常扎实！'],
    [80, '🌟', '优秀！再巩固细节就完美！'],
    [60, '😊', '良好！继续加油！'],
    [0, '📖', '建议重新看一遍内容再来！']
  ];
  for (const [min, em, msg] of map) {
    if (pct >= min) {
      if (emEl) emEl.textContent = em;
      if (msgEl) msgEl.textContent = msg;
      break;
    }
  }
  box.classList.add('show');
  box.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// 兼容旧命名
function showFinalScore() { showScore(); }
function retryQz() { location.reload(); }

/* ── Tab 初始化：为激活的第一个 tab btn 设置背景色 ── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab-btn.active').forEach(btn => {
    btn.dataset.origColor = btn.style.color || '';
    const col = btn.style.color || 'var(--c1)';
    btn.style.background = col;
    btn.style.color = '#fff';
  });
});