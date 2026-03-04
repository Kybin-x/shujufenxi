/* ============================================================
   game.js  —  闯关游戏核心引擎
   依赖：common.js（需先引入）
   
   各页面需通过独立的 questions/mX_Y_questions.js 提供：
     window.Q = [ { type, text, opts, ans, exp }, ... ]
   
   各页面需在 HTML 内联 <script> 中定义（可选覆盖）：
     window.GAME_CONFIG = {
       title: '章节名称',        // 用于结果页显示
       sC_label: '单选',
       mC_label: '多选',
       jC_label: '判断',
     }
   ============================================================ */

/* ── 星空动画 ── */
(function initStars() {
  const c = document.getElementById('stars');
  if (!c) return;
  const ctx = c.getContext('2d');
  let stars = [];

  function resize() {
    c.width  = window.innerWidth;
    c.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < 160; i++) {
      stars.push({
        x:  Math.random() * c.width,
        y:  Math.random() * c.height,
        r:  Math.random() * 1.4 + 0.3,
        a:  Math.random(),
        sp: Math.random() * 0.35 + 0.1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    stars.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.a})`;
      ctx.fill();
      p.a += p.sp * 0.01;
      if (p.a > 1)  p.sp = -Math.abs(p.sp);
      if (p.a < .1) p.sp =  Math.abs(p.sp);
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

/* ── 游戏状态 ── */
let G = {
  name: '', id: '',
  cur: 0, score: 0,
  sC: 0, mC: 0, jC: 0,
  combo: 0,
  sel: new Set()
};

/* ── 开始游戏 ── */
function startGame() {
  const idEl   = document.getElementById('iId');
  const nameEl = document.getElementById('iName');
  if (!idEl || !nameEl) return;

  G.id   = idEl.value.trim();
  G.name = nameEl.value.trim();
  if (!G.id)   { alert('请输入学号！'); return; }
  if (!G.name) { alert('请输入姓名！'); return; }

  // 重置状态
  G.cur = 0; G.score = 0; G.sC = 0; G.mC = 0; G.jC = 0; G.combo = 0;

  // 更新界面
  const hName = document.getElementById('hName');
  const hId   = document.getElementById('hId');
  const avt   = document.getElementById('avt');
  const scV   = document.getElementById('scV');
  if (hName) hName.textContent = G.name;
  if (hId)   hId.textContent   = '学号: ' + G.id;
  if (avt)   avt.textContent   = G.name[0];
  if (scV)   scV.textContent   = '0';

  buildDots();
  showScr('sGame');
  renderQ();
}

/* ── 题号圆点 ── */
function buildDots() {
  const row = document.getElementById('sdots');
  if (!row) return;
  row.innerHTML = '';
  (window.Q || []).forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'sdot' + (i === 0 ? ' cur' : '');
    d.id = 'dot' + i;
    d.textContent = i + 1;
    row.appendChild(d);
  });
}

function updDot(i, res) {
  const d = document.getElementById('dot' + i);
  if (!d) return;
  d.classList.remove('cur');
  d.classList.add(res === 'ok' ? 'done' : 'wdot');
  d.textContent = res === 'ok' ? '✓' : '✗';
  const next = document.getElementById('dot' + (i + 1));
  if (next) next.classList.add('cur');
}

/* ── 进度条 ── */
function updPg() {
  const Q = window.Q || [];
  const pct = Math.round((G.cur / Q.length) * 100);
  const fill = document.getElementById('pgFill');
  const txt  = document.getElementById('pgTxt');
  const pctEl = document.getElementById('pgPct');
  if (fill)  fill.style.width = pct + '%';
  if (txt)   txt.textContent  = `第 ${G.cur + 1} 题 / 共 ${Q.length} 题`;
  if (pctEl) pctEl.textContent = pct + '%';
}

/* ── 渲染题目 ── */
function renderQ() {
  updPg();
  G.sel.clear();

  const Q = window.Q || [];
  const q = Q[G.cur];
  const card = document.getElementById('qcard');
  if (!card || !q) return;

  const isM = q.type === 'multi';
  const tMap = { single: ['🔵 单选题', 's'], multi: ['🟢 多选题', 'm'], judge: ['🩷 判断题', 'j'] };
  const [tLabel, tCls] = tMap[q.type] || ['题', 's'];

  // 知识点提示（由题目 note 字段提供，可选）
  const noteHtml = q.note ? `<div class="qnote">📌 ${q.note}</div>` : '';

  const optsHtml = q.opts.map((o, i) => `
    <div class="opt" id="gopt${i}" onclick="selOpt_g(${i})">
      <div class="okey">${['A','B','C','D','E'][i]}</div>
      <div class="otxt">${o.replace(/^[A-E]\.\s*/, '')}</div>
    </div>`).join('');

  card.innerHTML = `
    <div class="qtype-badge ${tCls}">${tLabel} · 第 ${G.cur + 1} 题</div>
    <div class="qtxt">${q.text}</div>
    ${noteHtml}
    ${isM ? '<div class="qhint">💡 多选题——请选出所有正确答案后再提交</div>' : ''}
    <div class="opts" id="gopts">${optsHtml}</div>
    <button class="sub-btn" id="gsbtn" onclick="submitA()" disabled>确认提交</button>
    <div class="fb" id="gfb"></div>
    <button class="next-btn" id="gnbtn" onclick="nextQ()">
      ${G.cur + 1 < Q.length ? '继续下一题 →' : '查看最终成绩 🏆'}
    </button>`;

  // 重置动画
  card.style.animation = 'none';
  requestAnimationFrame(() => { card.style.animation = 'qSlide .4s cubic-bezier(.4,0,.2,1) both'; });
}

/* ── 选择选项（游戏版） ── */
function selOpt_g(i) {
  const Q = window.Q || [];
  const q = Q[G.cur];
  const el = document.getElementById('gopt' + i);
  if (!el || el.classList.contains('locked')) return;

  if (q.type === 'single' || q.type === 'judge') {
    G.sel.clear();
    q.opts.forEach((_, j) => {
      const o = document.getElementById('gopt' + j);
      if (o) o.classList.remove('sel');
    });
    G.sel.add(i);
    el.classList.add('sel');
  } else {
    if (G.sel.has(i)) {
      G.sel.delete(i);
      el.classList.remove('sel');
    } else {
      G.sel.add(i);
      el.classList.add('sel');
    }
  }
  const btn = document.getElementById('gsbtn');
  if (btn) btn.disabled = (G.sel.size === 0);
}

/* ── 提交答案 ── */
function submitA() {
  const Q = window.Q || [];
  const q = Q[G.cur];
  const chosen  = [...G.sel].sort();
  const correct = [...q.ans].sort();
  const ok = JSON.stringify(chosen) === JSON.stringify(correct);

  // 锁定所有选项
  q.opts.forEach((_, i) => {
    const el = document.getElementById('gopt' + i);
    if (!el) return;
    el.classList.add('locked');
    el.onclick = null;
  });
  // 标记正确答案
  q.ans.forEach(i => {
    const el = document.getElementById('gopt' + i);
    if (el) { el.classList.add('show-c'); }
  });
  // 标记已选
  chosen.forEach(i => {
    const el = document.getElementById('gopt' + i);
    if (!el) return;
    if (q.ans.includes(i)) { el.classList.add('correct'); el.classList.remove('show-c'); }
    else el.classList.add('wrong');
  });

  // 得分 & 统计
  if (ok) {
    G.score++;
    G.combo++;
    if (q.type === 'single') G.sC++;
    else if (q.type === 'multi') G.mC++;
    else G.jC++;
    const scV = document.getElementById('scV');
    if (scV) scV.textContent = G.score;
    updDot(G.cur, 'ok');
    spawnP(['⭐','✨','🎉','💫']);
    if (G.combo >= 3) showCombo(G.combo);
  } else {
    G.combo = 0;
    updDot(G.cur, 'no');
  }

  // 显示反馈
  const fb = document.getElementById('gfb');
  if (fb) {
    fb.innerHTML = `
      <div class="fb-hd ${ok ? 'ok' : 'no'}">${ok ? '🎯 回答正确！+1分' : '💔 回答错误'}</div>
      ${q.exp}
      <div class="fb-ans">
        <span style="color:var(--gold);font-weight:700;">正确答案：</span>
        ${q.ans.map(i => `<span class="ak">${['A','B','C','D','E'][i]}</span>`).join(' ')}
      </div>`;
    fb.className = 'fb show ' + (ok ? 'cfb' : 'wfb');
  }

  const sbtn = document.getElementById('gsbtn');
  const nbtn = document.getElementById('gnbtn');
  if (sbtn) sbtn.style.display = 'none';
  if (nbtn) nbtn.classList.add('show');
  G.sel.clear();
}

/* ── 下一题 ── */
function nextQ() {
  G.cur++;
  const Q = window.Q || [];
  if (G.cur >= Q.length) showResult();
  else { renderQ(); updPg(); }
}

/* ── 展示结果 ── */
function showResult() {
  showScr('sResult');
  const Q = window.Q || [];
  const pct = Math.round((G.score / Q.length) * 100);

  const el = {
    bigSc:  document.getElementById('bigSc'),
    sb1:    document.getElementById('sb1'),
    sb2:    document.getElementById('sb2'),
    sb3:    document.getElementById('sb3'),
    rNm:    document.getElementById('rNm'),
    rGrade: document.getElementById('res-grade') || document.getElementById('rGrade'),
    rAch:   document.getElementById('res-ach')   || document.getElementById('rAch'),
    rIcon:  document.getElementById('res-icon')  || document.getElementById('rIcon'),
    rFw:    document.getElementById('res-fw')    || document.getElementById('rFw'),
  };

  if (el.bigSc) el.bigSc.textContent = G.score;
  if (el.sb1)   el.sb1.textContent   = G.sC;
  if (el.sb2)   el.sb2.textContent   = G.mC;
  if (el.sb3)   el.sb3.textContent   = G.jC;
  if (el.rNm)   el.rNm.textContent   = `同学：${G.name}（学号：${G.id}）`;

  let em, grade, ach, bg;
  if (pct >= 95) {
    em = '🏆🌟🥇'; grade = '知识王者';
    bg = 'linear-gradient(135deg,#FFD700,#FFA500)';
    ach = `太厉害了！${G.name}同学，以近满分的成绩完成全部题目！知识掌握非常扎实，继续保持！🎊`;
  } else if (pct >= 80) {
    em = '🥈⭐✨'; grade = '学习精英';
    bg = 'linear-gradient(135deg,#00D4FF,#7C3AED)';
    ach = `很棒！${G.name}同学，得分${G.score}/${Q.length}，知识掌握相当扎实。把错题再复习一遍，满分就在眼前！`;
  } else if (pct >= 60) {
    em = '🥉📚💡'; grade = '进步之星';
    bg = 'linear-gradient(135deg,#00E5CC,#0D9488)';
    ach = `加油，${G.name}同学！得分${G.score}/${Q.length}，基础已掌握。建议重点复习错题涉及的知识点，再来挑战！`;
  } else {
    em = '📖🔁💪'; grade = '勇于挑战者';
    bg = 'linear-gradient(135deg,#FF6B9D,#C026D3)';
    ach = `勇气可嘉，${G.name}同学！得分${G.score}/${Q.length}。建议重新学习内容后再来挑战，相信你下次一定大有进步！`;
  }

  if (el.rIcon)  { el.rIcon.style.background = bg; el.rIcon.textContent = em.split('')[0]; }
  if (el.rGrade) el.rGrade.textContent = grade + ' · 闯关完成！';
  if (el.rAch)   el.rAch.textContent   = ach;
  if (el.rFw)    el.rFw.textContent    = em;

  setTimeout(() => spawnP(['🎉','⭐','🏆','✨','🎊','💫','🌟'], 28), 300);
}

/* ── 切换屏幕 ── */
function showScr(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}

/* ── 重来 ── */
function retry() {
  showScr('sLogin');
  const idEl   = document.getElementById('iId');
  const nameEl = document.getElementById('iName');
  if (idEl)   idEl.value   = '';
  if (nameEl) nameEl.value = '';
}

/* ── 粒子特效 ── */
function spawnP(emojis, n = 12) {
  for (let i = 0; i < n; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = 'ptc';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.left = Math.random() * 100 + 'vw';
      p.style.top  = Math.random() * 60 + 20 + 'vh';
      p.style.animationDuration = (1.5 + Math.random()) + 's';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 2500);
    }, i * 80);
  }
}

/* ── 连续正确彩蛋 ── */
function showCombo(n) {
  const t = document.getElementById('comboT');
  if (!t) return;
  const msgs = { 3: '🔥 三连正确！', 4: '🔥🔥 四连！超厉害！', 5: '🔥🔥🔥 五连！无敌！' };
  t.textContent = n <= 5 ? (msgs[n] || `🔥×${n} 连续正确！`) : `🔥×${n} 连续正确！传奇！`;
  t.style.display = 'block';
  t.style.animation = 'none';
  requestAnimationFrame(() => { t.style.animation = 'comboIn 2.2s ease forwards'; });
  setTimeout(() => { t.style.display = 'none'; }, 2300);
}

/* ── Enter 键快捷启动 ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const login = document.getElementById('sLogin');
    if (login && login.classList.contains('active')) startGame();
  }
});
