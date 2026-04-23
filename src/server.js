const express = require('express');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/projects', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        order_no,
        business_name,
        project_title,
        supervising_agency,
        research_org,
        own_tech_field,
        research_period,
        researcher,
        total_budget_manwon,
        own_task_budget_manwon,
        cash_budget_manwon,
        in_kind_budget_manwon,
        success_status
      FROM rnd_projects
      ORDER BY order_no ASC
    `);

    res.json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '데이터를 불러오지 못했습니다.' });
  }
});

app.get('/api/summary', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        COUNT(*) AS total_projects,
        ROUND(SUM(total_budget_manwon), 2) AS total_budget,
        ROUND(SUM(own_task_budget_manwon), 2) AS own_budget,
        SUM(CASE WHEN success_status = 'O' THEN 1 ELSE 0 END) AS success_count
      FROM rnd_projects
    `);

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '요약 데이터를 불러오지 못했습니다.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
