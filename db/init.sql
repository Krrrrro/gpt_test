CREATE DATABASE IF NOT EXISTS hubiz_rnd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hubiz_rnd;

DROP TABLE IF EXISTS rnd_projects;

CREATE TABLE rnd_projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_no INT NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  project_title TEXT NOT NULL,
  supervising_agency VARCHAR(255) NOT NULL,
  research_org TEXT NOT NULL,
  own_tech_field TEXT NOT NULL,
  research_period VARCHAR(120) NOT NULL,
  researcher VARCHAR(120) NOT NULL,
  total_budget_manwon DECIMAL(12,2) NOT NULL,
  own_task_budget_manwon DECIMAL(12,2) NOT NULL,
  cash_budget_manwon DECIMAL(12,2) NOT NULL,
  in_kind_budget_manwon DECIMAL(12,2) NOT NULL,
  success_status ENUM('O', 'X') NOT NULL DEFAULT 'O',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO rnd_projects (
  order_no, business_name, project_title, supervising_agency, research_org, own_tech_field,
  research_period, researcher, total_budget_manwon, own_task_budget_manwon,
  cash_budget_manwon, in_kind_budget_manwon, success_status
) VALUES
(1, '지역특화(국립)산업육성사업', '국내 최초 IPv6 상용망 스마트폰 LTE망을 활용한 IPAM 기반 지능형 다차원 3D 감시 및 시설 모니터링 SW 플랫폼 개발', '산업통상자원부', '주관: ㈜휴비즈ICT\n참여: 스콜정보통신', '인빌딩(병원) 3D 장비 및 시설 모니터링', '2016.03.01 ~ 2017.02.28 (12개월)', '설창환', 187.00, 112.00, 89.88, 22.32, 'O'),
(2, 'ICT 융합실증확산지원 사업', 'CSF 고도화를 위한 3D모니터링 SW 실증확산', '미래창조과학부', '주관: (재)포항테크노파크 경북SW융합센터\n참여: ㈜휴비즈ICT, ㈜H-에이텍, 한국정보통신기술협회', '중소 제조업 설비 3D모니터링', '2016.06.01 ~ 2017.05.31 (12개월)', '박송연', 1200.00, 610.00, 460.00, 150.00, 'O'),
(3, '중소기업융·복합기술개발사업', '전력선통신과 3D 모델링 엔진을 이용한 히트트레이싱 시스템 감시 제어 장치 개발', '지방중소기업청', '주관: ㈜솔루윅스\n참여: ㈜휴비즈아이씨티', '히트트레이싱 시스템 감시 제어', '2015.12.01 ~ 2017.11.30 (24개월)', '송기홍', 956.00, 289.00, 217.50, 72.40, 'O'),
(4, '문화기술연구개발사업', '통합형 3D 무대 시뮬레이션 시스템 개발', '문화체육관광부', '주관: ㈜휴비즈아이씨티\n참여: ㈜Hient.co, ㈜SOONent', '시뮬레이션 저작 도구 개발', '2017.06.01 ~ 2019.12.31 (33개월)', '이인설', 2537.00, 1097.00, 846.39, 250.71, 'O'),
(5, '에너지기술개발사업', 'AI 기반 압연공정 시뮬레이터를 이용한 에너지 최적화 운용 기술개발', '산자부(에너지기술평가원)', '주관: (재)포항산업과학연구원\n참여: ㈜퍼플데이터, ㈜휴비즈아이씨티', '압연 공정 3D 시뮬레이션 시스템 개발', '2017.12.01 ~ 2020.11.30 (36개월)', '이진희', 3038.00, 1135.00, 966.10, 168.90, 'O'),
(6, '경북형 스마트공장(시범공장)사업', 'CPS를 활용한 제조공정 모니터링 및 제어', '(재)경북테크노파크', '주관: 인탑스㈜\n참여: ㈜휴비즈아이씨티', '사출제조업 CPS시스템', '2019.09.01 ~ 2020.08.31 (12개월)', '조광현', 1279.00, 457.00, 340.00, 117.00, 'O');
