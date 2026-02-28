# Mini YouTube Clone (업로더 포함)

간단한 유튜브 클론코딩 예제입니다.

## 기능

- 영상 업로드 (파일 + 제목 + 설명 + 업로더)
- 업로드된 영상 목록 표시
- 영상 재생 및 조회수 증가
- 로컬 JSON 저장소(`data/videos.json`) 기반 메타데이터 관리

## 실행 방법

```bash
npm install
npm start
```

브라우저에서 `http://localhost:3000` 접속.

## API

- `GET /api/videos` : 영상 목록 조회
- `GET /api/videos/:id` : 단일 영상 조회
- `POST /api/upload` : 영상 업로드 (`multipart/form-data`, 필드명 `videoFile`)
- `POST /api/videos/:id/view` : 조회수 증가

## 폴더 구조

- `public/` : 프론트엔드 정적 파일
- `uploads/` : 업로드된 동영상 파일
- `data/videos.json` : 영상 메타데이터 DB
- `server.js` : Express API 서버
