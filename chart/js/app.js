/**
 * app.js — 全局初始化、Tab切换、进度条、事件绑定
 */

// ========================================
// 状态
// ========================================
const tabVisited = { bar: true };
const chartTypeMap = {
  bar:'bar', line:'line', pie:'pie', hbar:'hbar',
  scatter:'scatter', radar:'radar', bubble:'bubble'
};

// ========================================
// Tab 切换
// ========================================
function switchTab(name) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-'+name)?.classList.add('active');
  document.querySelector(`.tab-btn[data-tab="${name}"]`)?.classList.add('active');

  if (!tabVisited[name]) { tabVisited[name]=true; updateProgress(); }

  // 初始化图表
  setTimeout(() => {
    if (name==='bar') { initChart('bar'); updateBarChart('monthly'); }
    if (name==='line') { initChart('line'); updateLineChart('trend'); }
    if (name==='pie') { initChart('pie'); updatePieChart('basic'); }
    if (name==='hbar') { initChart('hbar'); updateHbarChart('rank'); }
    if (name==='scatter') { initChart('scatter'); updateScatterChart('adSales'); }
    if (name==='radar') { initChart('radar'); updateRadarChart('shop'); }
    if (name==='bubble') { initChart('bubble'); updateBubbleChart('market'); }
  }, 100);

  // 渲染练习和测验
  if (EXERCISE_DATA[name]) renderExercise(name);
  if (QUIZ_DATA[name]) renderQuiz(name);
  if (STEPS_DATA[name]) renderSteps(name);
}

// ========================================
// 进度条
// ========================================
function updateProgress() {
  const pct = Math.round(Object.keys(tabVisited).length / 8 * 100);
  document.getElementById('progressFill').style.width = pct+'%';
  document.getElementById('progressText').textContent = pct+'%';
}

// ========================================
// 图表按钮事件委托
// ========================================
function bindChartBtns() {
  document.querySelectorAll('.chart-controls').forEach(group => {
    const chartName = group.dataset.chart;
    group.addEventListener('click', (e) => {
      const btn = e.target.closest('.chart-btn');
      if (!btn) return;
      const mode = btn.dataset.mode;
      switch(chartName) {
        case 'bar': updateBarChart(mode, btn); break;
        case 'line': updateLineChart(mode, btn); break;
        case 'pie': updatePieChart(mode, btn); break;
        case 'hbar': updateHbarChart(mode, btn); break;
        case 'scatter': updateScatterChart(mode, btn); break;
        case 'radar': updateRadarChart(mode, btn); break;
        case 'bubble': updateBubbleChart(mode, btn); break;
      }
    });
  });
}

// ========================================
// 初始化
// ========================================
window.addEventListener('DOMContentLoaded', () => {
  // Tab 切换事件
  document.getElementById('tabNav').addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (btn) switchTab(btn.dataset.tab);
  });

  // 图表按钮
  bindChartBtns();

  // 总测验事件
  document.getElementById('startExamBtn')?.addEventListener('click', startExam);
  document.getElementById('submitExamBtn')?.addEventListener('click', submitExam);
  document.getElementById('retryBtn')?.addEventListener('click', retryExam);
  document.getElementById('homeBtn')?.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

  // 初始进度
  updateProgress();
});
