const videoList = document.getElementById('videoList');
const playerPanel = document.getElementById('playerPanel');
const uploadForm = document.getElementById('uploadForm');
const uploadStatus = document.getElementById('uploadStatus');

let videos = [];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function renderVideoList() {
  if (!videos.length) {
    videoList.innerHTML = '<p class="empty-text">업로드된 영상이 없습니다.</p>';
    return;
  }

  videoList.innerHTML = videos
    .map(
      (video) => `
      <article class="video-item" data-id="${video.id}">
        <h3>${video.title}</h3>
        <p>${video.uploader} · 조회수 ${video.views}회 · ${formatDate(video.createdAt)}</p>
      </article>
    `
    )
    .join('');
}

async function playVideo(video) {
  await fetch(`/api/videos/${video.id}/view`, { method: 'POST' });

  playerPanel.innerHTML = `
    <video controls autoplay src="${video.url}"></video>
    <h2 class="player-title">${video.title}</h2>
    <p class="player-meta">${video.uploader} · 조회수 ${video.views + 1}회 · ${formatDate(video.createdAt)}</p>
    <p>${video.description || '설명이 없습니다.'}</p>
  `;

  const target = videos.find((v) => v.id === video.id);
  if (target) {
    target.views += 1;
  }
  renderVideoList();
}

async function fetchVideos() {
  const res = await fetch('/api/videos');
  videos = await res.json();
  renderVideoList();
}

videoList.addEventListener('click', (event) => {
  const item = event.target.closest('.video-item');
  if (!item) return;
  const video = videos.find((v) => v.id === item.dataset.id);
  if (video) {
    playVideo(video);
  }
});

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  uploadStatus.textContent = '업로드 중...';

  const formData = new FormData(uploadForm);

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || '업로드에 실패했습니다.');
    }

    uploadStatus.textContent = '업로드 완료!';
    uploadForm.reset();
    await fetchVideos();
    await playVideo(data);
  } catch (error) {
    uploadStatus.textContent = error.message;
  }
});

fetchVideos();
