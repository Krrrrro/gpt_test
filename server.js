const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');
const { customAlphabet } = require('nanoid');

const app = express();
const PORT = process.env.PORT || 3000;
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

const DATA_DIR = path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const VIDEO_DB = path.join(DATA_DIR, 'videos.json');

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    try {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      cb(null, UPLOAD_DIR);
    } catch (error) {
      cb(error);
    }
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '.mp4');
    cb(null, `${Date.now()}-${nanoid()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('video/')) {
      return cb(new Error('동영상 파일만 업로드할 수 있습니다.'));
    }
    cb(null, true);
  },
  limits: { fileSize: 300 * 1024 * 1024 }, // 300MB
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOAD_DIR));

async function readVideos() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(VIDEO_DB, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(VIDEO_DB, '[]', 'utf-8');
      return [];
    }
    throw error;
  }
}

async function saveVideos(videos) {
  await fs.writeFile(VIDEO_DB, JSON.stringify(videos, null, 2), 'utf-8');
}

app.get('/api/videos', async (_req, res, next) => {
  try {
    const videos = await readVideos();
    const sorted = videos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sorted);
  } catch (error) {
    next(error);
  }
});

app.get('/api/videos/:id', async (req, res, next) => {
  try {
    const videos = await readVideos();
    const video = videos.find((v) => v.id === req.params.id);
    if (!video) {
      return res.status(404).json({ message: '영상을 찾을 수 없습니다.' });
    }
    res.json(video);
  } catch (error) {
    next(error);
  }
});

app.post('/api/upload', upload.single('videoFile'), async (req, res, next) => {
  try {
    const { title, description, uploader } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: '동영상 파일이 필요합니다.' });
    }
    if (!title || !uploader) {
      return res.status(400).json({ message: '제목과 업로더는 필수입니다.' });
    }

    const videos = await readVideos();
    const newVideo = {
      id: nanoid(),
      title: title.trim(),
      description: description?.trim() || '',
      uploader: uploader.trim(),
      views: 0,
      createdAt: new Date().toISOString(),
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
      url: `/uploads/${req.file.filename}`,
      thumbnail: '/thumbnail-default.svg',
    };

    videos.push(newVideo);
    await saveVideos(videos);

    res.status(201).json(newVideo);
  } catch (error) {
    next(error);
  }
});

app.post('/api/videos/:id/view', async (req, res, next) => {
  try {
    const videos = await readVideos();
    const index = videos.findIndex((v) => v.id === req.params.id);
    if (index < 0) {
      return res.status(404).json({ message: '영상을 찾을 수 없습니다.' });
    }

    videos[index].views += 1;
    await saveVideos(videos);
    res.json({ views: videos[index].views });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  const message = error.message || '서버 오류가 발생했습니다.';
  res.status(500).json({ message });
});

app.listen(PORT, () => {
  console.log(`YouTube clone server is running on http://localhost:${PORT}`);
});
