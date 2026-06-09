/**
 * exam.js — 综合测验模块（登录、计时、评分、报告）
 */

const STORAGE_KEY = 'exam_chart_v1';
let examState = { studentId:'', studentName:'', round:0, timerInterval:null, timeLeft:1800, startTime:0 };

// ========================================
// 存储操作
// ========================================
function getStorage() { try { const d=localStorage.getItem(STORAGE_KEY); return d?JSON.parse(d):{}; } catch{return;} }
function saveStorage(data) { try { localStorage.setItem(STORAGE_KEY,JSON.stringify(data)); } catch{} }

function checkAttempts(id) {
  const store = getStorage();
  const records = store[id] || [];
  return { used: records.length, records, remaining: 3 - records.length };
}

// ========================================
// 开始测验
// ========================================
function startExam() {
  const id = document.getElementById('studentId').value.trim();
  const name = document.getElementById('studentName').value.trim();
  const errEl = document.getElementById('loginError');
  if (!id) { errEl.textContent = '⚠️ 请输入学号！'; return; }
  if (!name) { errEl.textContent = '⚠️ 请输入姓名！'; return; }

  const { used, records, remaining } = checkAttempts(id);
  if (remaining <= 0) {
    errEl.textContent = '⚠️ 已用完3次机会！';
    showHistoryOnly(id, name, records);
    return;
  }

  examState = { studentId:id, studentName:name, round:used+1, timerInterval:null, timeLeft:1800, startTime:Date.now() };

  document.getElementById('loginCard').style.display = 'none';
  document.getElementById('examArea').style.display = 'block';
  document.getElementById('examStudent').textContent = `${name}（${id}）`;
  document.getElementById('examRound').textContent = examState.round;
  //document.getElementById('headerAttempts').textContent = `剩余次数：${remaining}次`;
  document.getElementById('attemptsInfo').textContent = `第 ${examState.round} 次作答，还剩 ${remaining-1} 次机会。`;

  renderExamQuestions();
  startTimer();
}

// ========================================
// 计时器
// ========================================
function startTimer() {
  updateTimerDisplay();
  examState.timerInterval = setInterval(() => {
    examState.timeLeft--;
    updateTimerDisplay();
    if (examState.timeLeft <= 0) {
      clearInterval(examState.timerInterval);
      alert('⏰ 时间到！自动提交。');
      submitExam();
    }
  }, 1000);
}
function updateTimerDisplay() {
  const m = Math.floor(examState.timeLeft/60), s = examState.timeLeft%60;
  const el = document.getElementById('examTimer');
  el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  el.classList.toggle('warning', examState.timeLeft <= 300);
}

// ========================================
// 渲染20道题
// ========================================
function renderExamQuestions() {
  const area = document.getElementById('questionArea');
  let html = '';
  EXAM_QUESTIONS.forEach((q,qi) => {
    const bMap = {single:['single','单选'],multi:['multi','多选'],judge:['judge','判断']};
    const [bCls,bTxt] = bMap[q.type];
    html += `<div class="question-block" id="eqb_${qi}">
      <div class="q-header"><div class="q-num">${qi+1}</div><span class="q-badge ${bCls}">${bTxt}</span><div class="q-score">${q.score}分</div></div>
      <div class="question-text">Q${qi+1}. ${q.text}</div>`;
    if (q.type==='judge') {
      html += `<div class="options-list">
        <label class="option-item" id="eq${qi}_T" onclick="examSelect(${qi})"><input type="radio" name="eq_${qi}" value="T"><span class="option-label">✅ 正确</span></label>
        <label class="option-item" id="eq${qi}_F" onclick="examSelect(${qi})"><input type="radio" name="eq_${qi}" value="F"><span class="option-label">❌ 错误</span></label></div>`;
    } else {
      html += '<div class="options-list">';
      q.options.forEach((opt,oi) => {
        const itype = q.type==='multi'?'checkbox':'radio';
        html += `<label class="option-item" id="eq${qi}_${oi}" onclick="examSelect(${qi})"><input type="${itype}" name="eq_${qi}" value="${oi}"><span class="option-label">${String.fromCharCode(65+oi)}. ${opt}</span></label>`;
      });
      html += '</div>';
    }
    html += '</div>';
  });
  area.innerHTML = html;
}

function examSelect(qi) {
  document.getElementById('eqb_'+qi)?.classList.add('answered');
  const answeredCount = EXAM_QUESTIONS.filter((_,i) => {
    return document.querySelector(`input[name="eq_${i}"]:checked`);
  }).length;
  document.getElementById('examProgressFill').style.width = Math.round(answeredCount/EXAM_QUESTIONS.length*100)+'%';
}

// ========================================
// 提交答卷
// ========================================
function submitExam() {
  if (examState.timerInterval) clearInterval(examState.timerInterval);

  let totalScore=0, correctCount=0, wrongCount=0;
  const topicScores={}, topicMax={};

  EXAM_QUESTIONS.forEach((q,qi) => {
    if (!topicScores[q.topic]) { topicScores[q.topic]=0; topicMax[q.topic]=0; }
    topicMax[q.topic] += q.score;

    let isCorrect=false, gotPartial=false;

    if (q.type==='single') {
      const ck = document.querySelector(`input[name="eq_${qi}"]:checked`);
      if (ck) {
        isCorrect = parseInt(ck.value)===q.answer;
        if (isCorrect) document.getElementById(`eq${qi}_${q.answer}`)?.classList.add('correct-ans');
        else {
          document.getElementById(`eq${qi}_${ck.value}`)?.classList.add('wrong-ans');
          document.getElementById(`eq${qi}_${q.answer}`)?.classList.add('correct-ans');
        }
      }
    } else if (q.type==='multi') {
      const ck = [...document.querySelectorAll(`input[name="eq_${qi}"]:checked`)].map(i=>parseInt(i.value));
      const ans = Array.isArray(q.answer)?q.answer:[q.answer];
      isCorrect = ck.length===ans.length && ans.every(a=>ck.includes(a));
      if (!isCorrect && q.partial && ck.length>0) {
        const wrongPicks = ck.filter(c=>!ans.includes(c));
        const correctPicks = ck.filter(c=>ans.includes(c));
        if (wrongPicks.length===0 && correctPicks.length>0) { gotPartial=true; totalScore+=q.partial; }
      }
      ans.forEach(a=>document.getElementById(`eq${qi}_${a}`)?.classList.add('correct-ans'));
      ck.forEach(a=>{ if(!ans.includes(a)) document.getElementById(`eq${qi}_${a}`)?.classList.add('wrong-ans'); });
    } else if (q.type==='judge') {
      const ck = document.querySelector(`input[name="eq_${qi}"]:checked`);
      if (ck) {
        isCorrect = (ck.value==='T')===q.answer;
        document.getElementById(`eq${qi}_${q.answer?'T':'F'}`)?.classList.add('correct-ans');
        if (!isCorrect) document.getElementById(`eq${qi}_${ck.value==='T'?'T':'F'}`)?.classList.add('wrong-ans');
      }
    }

    if (isCorrect) { correctCount++; totalScore+=q.score; topicScores[q.topic]+=q.score; document.getElementById('eqb_'+qi)?.classList.add('correct'); }
    else if (!gotPartial) { wrongCount++; document.getElementById('eqb_'+qi)?.classList.add('wrong'); }
    else { topicScores[q.topic]+=q.partial; document.getElementById('eqb_'+qi)?.classList.add('wrong'); }
  });

  totalScore = Math.min(100, totalScore);
  const elapsed = Math.round((Date.now()-examState.startTime)/60000);

  // 保存
  const store = getStorage();
  if (!store[examState.studentId]) store[examState.studentId]=[];
  store[examState.studentId].push({
    round:examState.round, score:totalScore, correct:correctCount, wrong:wrongCount,
    time:elapsed, date:new Date().toLocaleString('zh-CN'),
    topics:{...topicScores}, maxTopics:{...topicMax}
  });
  saveStorage(store);

  showExamResult(totalScore, correctCount, wrongCount, elapsed, topicScores, topicMax);
  const btn = document.getElementById('submitExamBtn');
  if (btn) { btn.disabled=true; btn.textContent='✅ 已提交'; }
}

// ========================================
// 显示成绩报告
// ========================================
function showExamResult(score, correct, wrong, time, topicScores, topicMax) {
  document.getElementById('examArea').style.display='none';
  const panel = document.getElementById('resultPanel');
  panel.classList.add('show');

  const emojis = score>=90?'🏆':score>=80?'🎉':score>=70?'😊':score>=60?'👍':'💪';
  const msgs = score>=90?'太棒了！完全掌握！':score>=80?'非常优秀！':score>=70?'良好！':score>=60?'及格了！':'需要继续加油！';

  document.getElementById('resultEmoji').textContent=emojis;
  document.getElementById('resultScore').innerHTML=score+'<span>分</span>';
  document.getElementById('resultMsg').textContent=msgs;
  document.getElementById('resultId').textContent=examState.studentId;
  document.getElementById('resultName').textContent=examState.studentName;
  document.getElementById('resultRound').textContent=examState.round;
  document.getElementById('rCorrect').textContent=correct+'题';
  document.getElementById('rWrong').textContent=wrong+'题';
  document.getElementById('rTime').textContent=time+'分钟';
  document.getElementById('rRate').textContent=score+'%';

  // 知识点分析
  const topicGrid = document.getElementById('topicGrid');
  topicGrid.innerHTML='';
  const weakTopics=[];
  Object.keys(topicScores).forEach(topic => {
    const pct = Math.round(topicScores[topic]/topicMax[topic]*100);
    const cls = pct>=80?'good':pct>=50?'mid':'bad';
    if (pct<60) weakTopics.push(topic);
    topicGrid.innerHTML+=`<div class="topic-item ${cls}"><div class="topic-dot"></div><span class="topic-name">${topic}</span><span class="topic-score">${topicScores[topic]}/${topicMax[topic]}分 (${pct}%)</span></div>`;
  });

  // 建议
  const sugBox = document.getElementById('suggestionBox');
  let sugHtml='<h4>📌 个性化学习建议</h4><ul>';
  if (weakTopics.length>0) sugHtml+=`<li><strong>薄弱知识点：</strong>${weakTopics.join('、')}，建议重点复习。</li>`;
  else sugHtml+='<li>🎉 各知识点表现均衡，继续保持！</li>';
  if (wrong>=8) sugHtml+='<li><strong>错题较多：</strong>建议回顾全部7种图表的定义和适用场景。</li>';
  if (time>35) sugHtml+=`<li><strong>答题速度：</strong>用时${time}分钟，建议提高速度。</li>`;
  if (score<60) sugHtml+='<li><strong>整体建议：</strong>建议从柱状图和饼图开始重新学习。</li>';
  sugHtml+='</ul>';
  sugBox.innerHTML=sugHtml;

  // 历史记录
  renderExamHistory();

  // 重试按钮
  const remaining = 3 - getStorage()[examState.studentId].length;
  const retryBtn = document.getElementById('retryBtn');
  if (remaining<=0) { retryBtn.disabled=true; retryBtn.textContent='❌ 已达最大次数'; }
  else { retryBtn.disabled=false; retryBtn.textContent=`🔄 重新作答（剩余${remaining}次）`; }

  window.scrollTo({top:0,behavior:'smooth'});
}

// ========================================
// 历史成绩
// ========================================
function renderExamHistory() {
  const store = getStorage();
  const records = store[examState.studentId]||[];
  const list = document.getElementById('historyList');
  list.innerHTML='';
  [...records].reverse().forEach(r => {
    const isCurrent = r.round===examState.round;
    list.innerHTML+=`<div class="history-item ${isCurrent?'current':''}">
      <div class="round">第${r.round}次</div>
      <div><div style="font-weight:600">得分：${r.score}分</div><div class="h-date">${r.date} · 用时${r.time}分钟 · 对${r.correct}题错${r.wrong}题</div></div>
      <div class="h-score">${r.score}分</div></div>`;
  });
}

// ========================================
// 重新作答
// ========================================
function retryExam() {
  document.getElementById('resultPanel').classList.remove('show');
  document.getElementById('loginCard').style.display='block';
  document.getElementById('examArea').style.display='none';
  document.getElementById('studentId').value=examState.studentId;
  document.getElementById('studentName').value=examState.studentName;
  const btn = document.getElementById('submitExamBtn');
  if (btn) { btn.disabled=false; btn.textContent='📤 提交答卷'; }
}

function showHistoryOnly(id, name, records) {
  document.getElementById('loginCard').style.display='none';
  document.getElementById('examArea').style.display='none';
  const panel = document.getElementById('resultPanel');
  panel.classList.add('show');
  document.getElementById('resultEmoji').textContent='📚';
  document.getElementById('resultScore').innerHTML=(records.length>0?records[records.length-1].score:'—')+'<span>分</span>';
  document.getElementById('resultMsg').textContent='已用完3次机会，请查看历史成绩。';
  document.getElementById('resultId').textContent=id;
  document.getElementById('resultName').textContent=name;
  document.getElementById('resultRound').textContent=records.length;

  examState.studentId=id;
  examState.studentName=name;
  renderExamHistory();

  document.getElementById('retryBtn').disabled=true;
  document.getElementById('retryBtn').textContent='❌ 已达最大次数';
  const btn = document.getElementById('submitExamBtn');
  if (btn) { btn.disabled=true; btn.textContent='✅ 已提交'; }
}
