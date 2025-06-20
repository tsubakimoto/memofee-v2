import { Router } from 'express';
import * as fs from 'fs/promises';
import path from 'path';
import type { Memo } from '../../shared/types';

const router = Router();
const MEMO_DATA_DIR = path.join(__dirname, '../../../data');
const MEMO_FILE = path.join(MEMO_DATA_DIR, 'memos.json');

/**
 * すべてのメモを取得するエンドポイント
 */
router.get('/', async (_req, res) => {
  try {
    const memos = await loadMemos();
    res.json(memos);
  } catch (error) {
    console.error('メモの読み込みに失敗しました:', error);
    res.status(500).json({ error: 'メモの読み込みに失敗しました' });
  }
});

/**
 * 特定のメモを取得するエンドポイント
 */
router.get('/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const memos = await loadMemos();
    const memo = memos.find(m => m.itemId === itemId);
    
    if (!memo) {
      return res.status(404).json({ error: 'メモが見つかりません' });
    }
    
    return res.json(memo);
  } catch (error) {
    console.error('メモの読み込みに失敗しました:', error);
    return res.status(500).json({ error: 'メモの読み込みに失敗しました' });
  }
});

/**
 * メモを保存するエンドポイント
 */
router.post('/', async (req, res) => {
  try {
    const { itemId, content } = req.body;
    
    if (!itemId || typeof itemId !== 'string') {
      return res.status(400).json({ error: 'アイテム ID が指定されていません' });
    }
    
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'メモの内容が指定されていません' });
    }
    
    const memos = await loadMemos();
    const existingMemoIndex = memos.findIndex(m => m.itemId === itemId);
    
    const memo: Memo = {
      itemId,
      content,
      createdAt: existingMemoIndex === -1 ? new Date().toISOString() : memos[existingMemoIndex].createdAt,
      updatedAt: new Date().toISOString()
    };
    
    if (existingMemoIndex === -1) {
      memos.push(memo);
    } else {
      memos[existingMemoIndex] = memo;
    }
    
    await saveMemos(memos);
    return res.json(memo);
  } catch (error) {
    console.error('メモの保存に失敗しました:', error);
    return res.status(500).json({ error: 'メモの保存に失敗しました' });
  }
});

/**
 * メモを削除するエンドポイント
 */
router.delete('/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const memos = await loadMemos();
    const filteredMemos = memos.filter(m => m.itemId !== itemId);
    
    if (filteredMemos.length === memos.length) {
      return res.status(404).json({ error: 'メモが見つかりません' });
    }
    
    await saveMemos(filteredMemos);
    return res.json({ message: 'メモを削除しました' });
  } catch (error) {
    console.error('メモの削除に失敗しました:', error);
    return res.status(500).json({ error: 'メモの削除に失敗しました' });
  }
});

/**
 * メモデータを読み込む
 */
async function loadMemos(): Promise<Memo[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(MEMO_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // ファイルが存在しない場合は空配列を返す
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * メモデータを保存する
 */
async function saveMemos(memos: Memo[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(MEMO_FILE, JSON.stringify(memos, null, 2), 'utf-8');
}

/**
 * データディレクトリが存在することを確認する
 */
async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(MEMO_DATA_DIR);
  } catch {
    await fs.mkdir(MEMO_DATA_DIR, { recursive: true });
  }
}

export { router as memoRouter };