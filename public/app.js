const tbody = document.querySelector('#project-body');
const rowTemplate = document.querySelector('#row-template');
const stats = document.querySelector('#stats');

const numberFormat = new Intl.NumberFormat('ko-KR');

function card(label, value) {
  return `<article class="stat"><p class="label">${label}</p><p class="value">${value}</p></article>`;
}

function renderRow(item) {
  const node = rowTemplate.content.firstElementChild.cloneNode(true);

  node.querySelectorAll('[data-key]').forEach((cell) => {
    const key = cell.dataset.key;
    let value = item[key] ?? '-';

    if ([
      'total_budget_manwon',
      'own_task_budget_manwon',
      'cash_budget_manwon',
      'in_kind_budget_manwon'
    ].includes(key)) {
      value = numberFormat.format(value);
    }

    cell.textContent = value;
  });

  return node;
}

async function load() {
  const [projectRes, summaryRes] = await Promise.all([
    fetch('/api/projects'),
    fetch('/api/summary')
  ]);

  const projectJson = await projectRes.json();
  const summary = await summaryRes.json();

  stats.innerHTML = [
    card('총 과제 수', `${summary.total_projects}건`),
    card('총 연구비', `${numberFormat.format(summary.total_budget)}만원`),
    card('자사 과제비', `${numberFormat.format(summary.own_budget)}만원`),
    card('성공 과제', `${summary.success_count}건`)
  ].join('');

  tbody.innerHTML = '';
  projectJson.data.forEach((item) => tbody.appendChild(renderRow(item)));
}

load().catch((error) => {
  console.error(error);
  stats.innerHTML = card('오류', '데이터 로드 실패');
});
