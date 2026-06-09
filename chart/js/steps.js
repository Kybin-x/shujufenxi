/**
 * steps.js — Excel步骤卡片的渲染和导航
 */

const stepsCurrent = {};

function renderSteps(type) {
  const container = document.getElementById('steps' + type.charAt(0).toUpperCase() + type.slice(1));
  if (!container || container.dataset.rendered) return;
  container.dataset.rendered = '1';
  const steps = STEPS_DATA[type];
  if (!steps) return;
  stepsCurrent[type] = 0;

  let navHtml = steps.map((s,i) =>
    `<button class="step-nav-btn ${i===0?'active':''}" data-type="${type}" data-idx="${i}">${i+1}</button>`
  ).join('');

  let contentHtml = steps.map((s,i) => `
    <div class="step-card ${i===0?'active':''}" data-step-type="${type}" data-step-idx="${i}">
      <div class="step-card-header">
        <div class="step-number">${s.icon}</div>
        <div><h4>${s.title}</h4><p>${s.subtitle}</p></div>
      </div>
      <div class="step-content">
        <div class="step-desc">${s.desc}</div>
        <div class="step-mock">${s.mock}</div>
        <div class="step-tips">${s.tip}</div>
      </div>
    </div>`).join('');

  container.innerHTML = `
    <div class="steps-nav">${navHtml}</div>
    <div class="steps-content">${contentHtml}</div>
    <div class="steps-footer">
      <button class="step-prev-btn" data-step-action="prev" data-step-type="${type}">◀ 上一步</button>
      <span class="step-counter" data-step-counter="${type}">1 / ${steps.length}</span>
      <button class="step-next-btn" data-step-action="next" data-step-type="${type}">下一步 ▶</button>
    </div>`;

  // 事件委托
  container.addEventListener('click', (e) => {
    const btn = e.target;
    // 步骤导航按钮
    if (btn.classList.contains('step-nav-btn')) {
      goToStep(type, parseInt(btn.dataset.idx));
    }
    // 上一步 / 下一步
    if (btn.dataset.stepAction === 'prev') goToStep(type, stepsCurrent[type] - 1);
    if (btn.dataset.stepAction === 'next') goToStep(type, stepsCurrent[type] + 1);
  });
}

function goToStep(type, idx) {
  const steps = STEPS_DATA[type];
  if (idx < 0 || idx >= steps.length) return;
  stepsCurrent[type] = idx;

  document.querySelectorAll(`[data-step-type="${type}"].step-nav-btn`).forEach((b,i) => b.classList.toggle('active', i===idx));
  document.querySelectorAll(`[data-step-type="${type}"][data-step-idx].step-card`).forEach((c,i) => c.classList.toggle('active', i===idx));

  const counter = document.querySelector(`[data-step-counter="${type}"]`);
  if (counter) counter.textContent = `${idx+1} / ${steps.length}`;
}
