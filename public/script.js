const videoGrid = document.getElementById('videoGrid');
const recommendList = document.getElementById('recommendList');
const playerPanel = document.getElementById('playerPanel');
const uploadForm = document.getElementById('uploadForm');
const uploadStatus = document.getElementById('uploadStatus');
const searchInput = document.getElementById('searchInput');
const searchForm = document.getElementById('searchForm');
const feedTitle = document.getElementById('feedTitle');

let videos = [];
let currentVideoId = null;

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatViews(views) {
  return `${views.toLocaleString('ko-KR')}회`;
}

function getThumb(video) {
  return video.thumbnail || '/thumbnail-default.svg';
}

function seedFallback() {
  const now = new Date();
  videos = [
    { id: 'demo1', title: '서울 브이로그 하루 루틴', uploader: 'Krrrrro', views: 12034, description: '브이로그 데모 영상', createdAt: now.toISOString(), url: '', thumbnail: '/thumbnail-default.svg' },
    { id: 'demo2', title: '자바스크립트 클론코딩 라이브', uploader: 'DevTube', views: 8831, description: '코딩 데모 영상', createdAt: now.toISOString(), url: '', thumbnail: '/thumbnail-default.svg' },
    { id: 'demo3', title: '집중 공부 음악 1시간', uploader: 'LoFi Korea', views: 451102, description: '집중용 플레이리스트', createdAt: now.toISOString(), url: '', thumbnail: '/thumbnail-default.svg' },
  ];
}

function renderFeed(list = videos) {
  if (!list.length) {
    videoGrid.innerHTML = '<p class="empty-text">검색 결과가 없습니다.</p>';
    return;
  }

  videoGrid.innerHTML = list.map((video) => `
    <article class="video-card" data-id="${video.id}">
      <img class="video-thumb" src="${getThumb(video)}" alt="${video.title} 썸네일" />
      <div class="video-body">
        <h3 class="video-title">${video.title}</h3>
        <p class="video-sub">${video.uploader} · 조회수 ${formatViews(video.views)} · ${formatDate(video.createdAt)}</p>
      </div>
    </article>
  `).join('');
}

function recommendationsFor(video) {
  const words = new Set(video.title.toLowerCase().split(/\s+/).filter(Boolean));
  const related = videos
    .filter((v) => v.id !== video.id)
    .map((v) => {
      const score = v.title.toLowerCase().split(/\s+/).filter((w) => words.has(w)).length;
      return { ...v, score };
    })
    .sort((a, b) => b.score - a.score || b.views - a.views)
    .slice(0, 8);

  return related.length ? related : videos.filter((v) => v.id !== video.id).slice(0, 8);
}

function renderRecommendations(video) {
  const recs = recommendationsFor(video);
  if (!recs.length) {
    recommendList.innerHTML = '<p class="empty-text">추천할 영상이 없습니다.</p>';
    return;
  }

  recommendList.innerHTML = recs.map((v) => `
    <article class="recommend-item" data-id="${v.id}">
      <img src="${getThumb(v)}" alt="${v.title} 썸네일" />
      <div class="meta">
        <strong>${v.title}</strong>
        <p class="video-sub">${v.uploader}<br/>조회수 ${formatViews(v.views)}</p>
      </div>
    </article>
  `).join('');
}

async function playVideo(video) {
  currentVideoId = video.id;

  if (video.url) {
    await fetch(`/api/videos/${video.id}/view`, { method: 'POST' }).catch(() => undefined);
    const target = videos.find((v) => v.id === video.id);
    if (target) target.views += 1;
  }

  playerPanel.innerHTML = video.url
    ? `
      <video controls autoplay src="${video.url}"></video>
      <h2>${video.title}</h2>
      <p class="player-meta">${video.uploader} · 조회수 ${formatViews(video.views)} · ${formatDate(video.createdAt)}</p>
      <p>${video.description || '설명이 없습니다.'}</p>
    `
    : `
      <img class="video-thumb" src="${getThumb(video)}" alt="${video.title} 썸네일" />
      <h2>${video.title}</h2>
      <p class="player-meta">${video.uploader} · 조회수 ${formatViews(video.views)} · ${formatDate(video.createdAt)}</p>
      <p>${video.description || '설명이 없습니다.'}</p>
      <p class="empty-text">데모 데이터입니다. 실제 동영상 재생은 업로드된 파일에서 동작합니다.</p>
    `;

  renderRecommendations(video);
  renderFeed(filterVideos(searchInput.value.trim()));
}

function filterVideos(query) {
  if (!query) return videos;
  const q = query.toLowerCase();
  return videos.filter((v) => `${v.title} ${v.description || ''} ${v.uploader}`.toLowerCase().includes(q));
}

async function loadVideos() {
  try {
    const res = await fetch('/api/videos');
    if (!res.ok) throw new Error('목록 조회 실패');
    videos = await res.json();
    if (!videos.length) seedFallback();
  } catch (_error) {
    seedFallback();
  }

  const initial = videos[0];
  renderFeed(videos);
  if (initial) playVideo(initial);
}

videoGrid.addEventListener('click', (event) => {
  const card = event.target.closest('.video-card');
  if (!card) return;
  const target = videos.find((v) => v.id === card.dataset.id);
  if (target) playVideo(target);
});

recommendList.addEventListener('click', (event) => {
  const item = event.target.closest('.recommend-item');
  if (!item) return;
  const target = videos.find((v) => v.id === item.dataset.id);
  if (target) playVideo(target);
});

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  const filtered = filterVideos(query);
  feedTitle.textContent = query ? `검색 결과: ${query}` : '추천 동영상';
  renderFeed(filtered);
});

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  uploadStatus.textContent = '업로드 중...';

  const formData = new FormData(uploadForm);

  try {
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || '업로드 실패');

    uploadStatus.textContent = '업로드 완료!';
    uploadForm.reset();
    videos.unshift(data);
    renderFeed(filterVideos(searchInput.value.trim()));
    playVideo(data);
  } catch (error) {
    uploadStatus.textContent = error.message;
  }
});

loadVideos();
