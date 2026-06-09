/**
 * interactive.js — 课堂练习和小节测验的渲染、评分
 */

const matchStateMap = {};

// ========================================
// 渲染课堂练习
// ========================================
function renderExercise(type) {
  const container = document.getElementById('exercise' + type.charAt(0).toUpperCase() + type.slice(1));
  if (!container || container.dataset.rendered) return;
  container.dataset.rendered = '1';
  const questions = EXERCISE_DATA[type];

  questions.forEach((q, qi) => {
    const div = document.createElement('div');
    div.className = 'question-block';
    div.id = `ex_${type}_${qi}`;

    const bMap = { single:['badge-single','单选题'], multi:['badge-multi','多选题'], judge:['badge-judge','判断题'], match:['badge-match','连线题'] };
    const [bCls, bTxt] = bMap[q.type];
    let html = `<span class="question-type-badge ${bCls}">${bTxt}</span>
      <div class="question-text">Q${qi+1}. ${q.text}</div>`;

    if (q.type === 'single' || q.type === 'multi') {
      html += '<div class="options-list">';
      q.options.forEach((opt,oi) => {
        const itype = q.type==='multi'?'checkbox':'radio';
        html += `<label class="option-item" id="ex_${type}_${qi}_opt${oi}">
          <input type="${itype}" name="ex_${type}_${qi}" value="${oi}">
          <span class="option-label">${String.fromCharCode(65+oi)}. ${opt}</span></label>`;
      });
      html += '</div>';
    } else if (q.type === 'judge') {
      html += `<div class="options-list">
        <label class="option-item" id="ex_${type}_${qi}_optT"><input type="radio" name="ex_${type}_${qi}" value="true"><span class="option-label">✅ 正确</span></label>
        <label class="option-item" id="ex_${type}_${qi}_optF"><input type="radio" name="ex_${type}_${qi}" value="false"><span class="option-label">❌ 错误</span></label></div>`;
    } else if (q.type === 'match') {
      html += `<div class="match-container"><div class="match-col"><div class="match-col-title">概念/场景</div>`;
      q.left.forEach((l,li) => { html += `<div class="match-item left-item" id="ex_${type}_${qi}_L${li}">${l}</div>`; });
      html += '</div><div class="match-col"><div class="match-col-title">描述/类型</div>';
      q.right.forEach((r,ri) => { html += `<div class="match-item right-item" id="ex_${type}_${qi}_R${ri}">${r}</div>`; });
      html += '</div></div>';
    }

    if (q.type !== 'match') {
      html += `<button class="check-btn" data-ex-action="check" data-ex-type="${type}" data-ex-qi="${qi}">✔ 确认答案</button>`;
    } else {
      html += `<button class="check-btn" data-ex-action="match" data-ex-type="${type}" data-ex-qi="${qi}">✔ 检查连线</button>`;
    }
    html += `<div class="feedback-msg" id="ex_${type}_${qi}_fb"></div>`;
    div.innerHTML = html;
    container.appendChild(div);

    // 连线题事件
    if (q.type === 'match') {
      q.left.forEach((_,li) => {
        const el = document.getElementById(`ex_${type}_${qi}_L${li}`);
        if (el) el.addEventListener('click', () => selectMatchLeft(type, qi, li));
      });
      q.right.forEach((_,ri) => {
        const el = document.getElementById(`ex_${type}_${qi}_R${ri}`);
        if (el) el.addEventListener('click', () => selectMatchRight(type, qi, ri));
      });
    }
  });

  // 事件委托（确认按钮）
  container.addEventListener('click', (e) => {
    const btn = e.target;
    if (btn.dataset.exAction === 'check') {
      checkExercise(btn.dataset.exType, parseInt(btn.dataset.exQi));
    }
    if (btn.dataset.exAction === 'match') {
      checkMatch(btn.dataset.exType, parseInt(btn.dataset.exQi));
    }
  });
}

// ========================================
// 连线题交互
// ========================================
function selectMatchLeft(type, qi, li) {
  const key = `${type}_${qi}`;
  if (!matchStateMap[key]) matchStateMap[key] = { left:null, pairs:{} };
  matchStateMap[key].left = li;
  document.querySelectorAll(`[id^="ex_${type}_${qi}_L"]`).forEach(el => el.classList.remove('selected'));
  document.getElementById(`ex_${type}_${qi}_L${li}`)?.classList.add('selected');
}

function selectMatchRight(type, qi, ri) {
  const key = `${type}_${qi}`;
  if (!matchStateMap[key] || matchStateMap[key].left === null) return;
  const li = matchStateMap[key].left;
  matchStateMap[key].pairs[li] = ri;
  document.querySelectorAll(`[id^="ex_${type}_${qi}_R"]`).forEach(el => el.classList.remove('selected'));
  document.getElementById(`ex_${type}_${qi}_R${ri}`)?.classList.add('selected');
  document.querySelectorAll(`[id^="ex_${type}_${qi}_L"]`).forEach(el => el.classList.remove('selected'));
  matchStateMap[key].left = null;
  const lEl = document.getElementById(`ex_${type}_${qi}_L${li}`);
  if (lEl) lEl.style.opacity = '0.7';
}

function checkMatch(type, qi) {
  const q = EXERCISE_DATA[type][qi];
  const pairs = matchStateMap[`${type}_${qi}`]?.pairs || {};
  let correct = 0;
  q.left.forEach((_,li) => {
    const userAns = pairs[li], correctAns = q.answer[li];
    const lEl = document.getElementById(`ex_${type}_${qi}_L${li}`);
    const rEl = document.getElementById(`ex_${type}_${qi}_R${correctAns}`);
    if (userAns === correctAns) {
      correct++;
      if (lEl) lEl.className = 'match-item left-item matched-correct';
      if (rEl) rEl.className = 'match-item right-item matched-correct';
    } else {
      if (lEl) lEl.className = 'match-item left-item matched-wrong';
      if (userAns !== undefined) {
        const wEl = document.getElementById(`ex_${type}_${qi}_R${userAns}`);
        if (wEl) wEl.className = 'match-item right-item matched-wrong';
      }
    }
  });
  const fb = document.getElementById(`ex_${type}_${qi}_fb`);
  const isAll = correct === q.left.length;
  document.getElementById(`ex_${type}_${qi}`)?.classList.add(isAll ? 'correct' : 'wrong');
  fb.className = `feedback-msg ${isAll?'correct-fb':'wrong-fb'} show`;
  fb.innerHTML = isAll ? '🎉 连线全部正确！' : `❌ 有 ${q.left.length-correct} 条连线有误。`;
  const btn = document.querySelector(`[data-ex-action="match"][data-ex-type="${type}"][data-ex-qi="${qi}"]`);
  if (btn) btn.disabled = true;
}

// ========================================
// 练习题评分
// ========================================
function checkExercise(type, qi) {
  const q = EXERCISE_DATA[type][qi];
  const block = document.getElementById(`ex_${type}_${qi}`);
  const fb = document.getElementById(`ex_${type}_${qi}_fb`);
  const btn = document.querySelector(`[data-ex-action="check"][data-ex-type="${type}"][data-ex-qi="${qi}"]`);
  let isCorrect = false;

  if (q.type === 'single') {
    const checked = document.querySelector(`input[name="ex_${type}_${qi}"]:checked`);
    if (!checked) { fb.className='feedback-msg wrong-fb show'; fb.innerHTML='⚠️ 请先选择答案！'; return; }
    const val = parseInt(checked.value);
    isCorrect = val === q.answer;
    q.options.forEach((_,oi) => {
      const el = document.getElementById(`ex_${type}_${qi}_opt${oi}`);
      if (oi === q.answer) el?.classList.add('correct-ans');
      else if (oi === val && !isCorrect) el?.classList.add('wrong-ans');
    });
  } else if (q.type === 'multi') {
    const checked = [...document.querySelectorAll(`input[name="ex_${type}_${qi}"]:checked`)].map(i=>parseInt(i.value));
    const correct = Array.isArray(q.answer) ? q.answer : [q.answer];
    isCorrect = checked.length===correct.length && correct.every(a=>checked.includes(a));
    q.options.forEach((_,oi) => {
      const el = document.getElementById(`ex_${type}_${qi}_opt${oi}`);
      if (correct.includes(oi)) el?.classList.add('correct-ans');
      else if (checked.includes(oi)) el?.classList.add('wrong-ans');
    });
  } else if (q.type === 'judge') {
    const checked = document.querySelector(`input[name="ex_${type}_${qi}"]:checked`);
    if (!checked) { fb.className='feedback-msg wrong-fb show'; fb.innerHTML='⚠️ 请先选择正确或错误！'; return; }
    isCorrect = (checked.value==='true') === q.answer;
  }

  block?.classList.add(isCorrect ? 'correct' : 'wrong');
  fb.className = `feedback-msg ${isCorrect?'correct-fb':'wrong-fb'} show`;
  fb.innerHTML = isCorrect ? `🎉 回答正确！${q.explain}` : `❌ 回答有误。${q.explain}`;
  if (btn) btn.disabled = true;
}

// ========================================
// 渲染小节测验
// ========================================
function renderQuiz(type) {
  const container = document.getElementById('quiz' + type.charAt(0).toUpperCase() + type.slice(1));
  if (!container || container.dataset.rendered) return;
  container.dataset.rendered = '1';
  const nameMap = {bar:'柱状图',line:'折线图',pie:'饼图',hbar:'条形图',scatter:'散点图',radar:'雷达图',bubble:'气泡图'};
  const questions = QUIZ_DATA[type];
  let html = `<div class="quiz-header"><h3>📝 小节测验 · ${nameMap[type]}</h3><div class="quiz-score-display" id="${type}QuizScore">答题中...</div></div>`;

  questions.forEach((q,qi) => {
    const bMap = {single:['badge-single','单选'],multi:['badge-multi','多选'],judge:['badge-judge','判断']};
    const [bCls,bTxt] = bMap[q.type];
    html += `<div class="question-block" id="quiz_${type}_${qi}">
      <span class="question-type-badge ${bCls}">${bTxt}</span>
      <div class="question-text">Q${qi+1}. ${q.text}</div><div class="options-list">`;
    if (q.type === 'judge') {
      html += `<label class="option-item" id="quiz_${type}_${qi}_optT"><input type="radio" name="quiz_${type}_${qi}" value="true"><span class="option-label">✅ 正确</span></label>
               <label class="option-item" id="quiz_${type}_${qi}_optF"><input type="radio" name="quiz_${type}_${qi}" value="false"><span class="option-label">❌ 错误</span></label>`;
    } else {
      q.options.forEach((opt,oi) => {
        const itype = q.type==='multi'?'checkbox':'radio';
        html += `<label class="option-item" id="quiz_${type}_${qi}_opt${oi}"><input type="${itype}" name="quiz_${type}_${qi}" value="${oi}"><span class="option-label">${String.fromCharCode(65+oi)}. ${opt}</span></label>`;
      });
    }
    html += '</div></div>';
  });

  html += `<button class="quiz-submit-btn" data-quiz-submit="${type}">📤 提交测验</button>
  <div class="quiz-result" id="${type}QuizResult">
    <div class="result-emoji" id="${type}ResultEmoji">🎉</div>
    <div class="result-score" id="${type}ResultScore">0分</div>
    <div class="result-msg" id="${type}ResultMsg"></div>
    <div class="result-detail">
      <div class="result-stat">答对<strong id="${type}ResultCorrect">0</strong></div>
      <div class="result-stat">答错<strong id="${type}ResultWrong">0</strong></div>
      <div class="result-stat">正确率<strong id="${type}ResultRate">0%</strong></div>
    </div>
    <button class="retry-quiz-btn" data-quiz-retry="${type}">🔄 重新作答</button>
  </div>`;
  container.innerHTML = html;

  // 提交按钮
  const submitBtn = container.querySelector(`[data-quiz-submit="${type}"]`);
  if (submitBtn) submitBtn.addEventListener('click', () => submitQuiz(type));

  // 重试按钮
  const retryBtn = container.querySelector(`[data-quiz-retry="${type}"]`);
  if (retryBtn) retryBtn.addEventListener('click', () => {
    container.dataset.rendered = '';
    renderQuiz(type);
  });
}

function submitQuiz(type) {
  const questions = QUIZ_DATA[type];
  let correct = 0;
  questions.forEach((q,qi) => {
    let isCorrect = false;
    if (q.type === 'single') {
      const checked = document.querySelector(`input[name="quiz_${type}_${qi}"]:checked`);
      if (checked) isCorrect = parseInt(checked.value) === q.answer;
    } else if (q.type === 'multi') {
      const checked = [...document.querySelectorAll(`input[name="quiz_${type}_${qi}"]:checked`)].map(i=>parseInt(i.value));
      const ans = Array.isArray(q.answer)?q.answer:[q.answer];
      isCorrect = checked.length===ans.length && ans.every(a=>checked.includes(a));
    } else if (q.type === 'judge') {
      const checked = document.querySelector(`input[name="quiz_${type}_${qi}"]:checked`);
      if (checked) isCorrect = (checked.value==='true') === q.answer;
    }
    if (isCorrect) correct++;
    document.getElementById(`quiz_${type}_${qi}`)?.classList.add(isCorrect?'correct':'wrong');
    if (q.type==='judge') {
      document.getElementById(`quiz_${type}_${qi}_opt${q.answer?'T':'F'}`)?.classList.add('correct-ans');
    } else {
      const ans = Array.isArray(q.answer)?q.answer:[q.answer];
      ans.forEach(a => document.getElementById(`quiz_${type}_${qi}_opt${a}`)?.classList.add('correct-ans'));
    }
  });
  const score = Math.round(correct/questions.length*100);
  const emojis = score>=90?'🏆':score>=70?'🎉':score>=60?'😊':'💪';
  const msgs = score>=90?'优秀！':score>=70?'良好！':score>=60?'及格！':'需加油！';
  document.getElementById(`${type}ResultEmoji`).textContent = emojis;
  document.getElementById(`${type}ResultScore`).textContent = score+'分';
  document.getElementById(`${type}ResultMsg`).textContent = msgs;
  document.getElementById(`${type}ResultCorrect`).textContent = correct+'题';
  document.getElementById(`${type}ResultWrong`).textContent = (questions.length-correct)+'题';
  document.getElementById(`${type}ResultRate`).textContent = score+'%';
  document.getElementById(`${type}QuizScore`).textContent = score+'分';
  document.getElementById(`${type}QuizResult`).classList.add('show');
  const btn = document.querySelector(`[data-quiz-submit="${type}"]`);
  if (btn) { btn.disabled = true; btn.textContent = '✅ 已提交'; }
}
