import express from 'express';
import cors from 'cors';
import path from 'path';
import { rssRouter } from './routes/rss';
import { memoRouter } from './routes/memo';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

// API Routes
app.use('/api/rss', rssRouter);
app.use('/api/memo', memoRouter);

// Serve index.html for all other routes (SPA support)
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`MemoFee サーバーが http://localhost:${PORT} で起動しました`);
});