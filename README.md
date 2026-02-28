# YouTube Clone (검색/추천/플레이어/업로더)

유튜브 스타일 UI와 핵심 기능을 담은 클론코딩 프로젝트입니다.

## 구현 기능

- 유튜브 스타일 레이아웃 (상단 검색바, 좌측 내비, 메인 피드, 플레이어, 우측 추천)
- 동영상 업로드 (파일 + 제목 + 설명 + 업로더)
- 동영상 검색 (제목/설명/업로더 기준)
- 추천 동영상 목록 (간단한 제목 키워드 유사도 기반)
- 플레이어 재생 및 조회수 증가
- 로컬 JSON DB(`data/videos.json`) 기반 메타데이터 저장
- 백엔드 연결이 없을 때 데모 데이터 fallback

## 실행

```bash
npm install
npm start
```

접속: `http://localhost:3000`

## API

- `GET /api/videos` : 전체 목록 조회
- `GET /api/videos?q=검색어` : 검색 결과 조회
- `GET /api/videos/:id` : 단일 영상 조회
- `GET /api/videos/:id/recommendations` : 추천 영상 조회
- `POST /api/upload` : 동영상 업로드 (`multipart/form-data`, 필드명: `videoFile`)
- `POST /api/videos/:id/view` : 조회수 증가

## 구조

- `server.js` : Express API 서버
- `public/index.html` : 메인 UI
- `public/styles.css` : 유튜브 스타일 디자인
- `public/script.js` : 검색/추천/플레이어/업로드 프론트 로직
- `data/videos.json` : 메타데이터 저장소
- `uploads/` : 업로드된 영상 파일 저장
