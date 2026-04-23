# 휴비즈 ICT R&D 과제 진행 총괄표 (Node + MariaDB)

엑셀 스크린샷 형태의 데이터를 웹에서 바로 볼 수 있게 만든 프로젝트입니다.

## 1) 설치

```bash
npm install
cp .env.example .env
```

## 2) MariaDB 준비

MariaDB 실행 후 아래 SQL을 주입합니다.

```bash
mariadb -u root -p < db/init.sql
```

## 3) 서버 실행

```bash
npm start
```

브라우저: `http://localhost:3000`

## 포함 내용

- Node.js + Express API
- MariaDB 테이블/컬럼/샘플 데이터 입력 SQL
- 스프레드시트 느낌을 살린 반응형 테이블 UI
- 상단 통계 카드(과제 수, 총 연구비, 자사 과제비, 성공 건수)
