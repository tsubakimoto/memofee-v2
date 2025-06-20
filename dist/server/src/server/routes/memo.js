"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoRouter = void 0;
const express_1 = require("express");
const fs = __importStar(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
exports.memoRouter = router;
const MEMO_DATA_DIR = path_1.default.join(__dirname, '../../../data');
const MEMO_FILE = path_1.default.join(MEMO_DATA_DIR, 'memos.json');
/**
 * すべてのメモを取得するエンドポイント
 */
router.get('/', async (_req, res) => {
    try {
        const memos = await loadMemos();
        res.json(memos);
    }
    catch (error) {
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
    }
    catch (error) {
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
        const memo = {
            itemId,
            content,
            createdAt: existingMemoIndex === -1 ? new Date().toISOString() : memos[existingMemoIndex].createdAt,
            updatedAt: new Date().toISOString()
        };
        if (existingMemoIndex === -1) {
            memos.push(memo);
        }
        else {
            memos[existingMemoIndex] = memo;
        }
        await saveMemos(memos);
        return res.json(memo);
    }
    catch (error) {
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
    }
    catch (error) {
        console.error('メモの削除に失敗しました:', error);
        return res.status(500).json({ error: 'メモの削除に失敗しました' });
    }
});
/**
 * メモデータを読み込む
 */
async function loadMemos() {
    try {
        await ensureDataDir();
        const data = await fs.readFile(MEMO_FILE, 'utf-8');
        return JSON.parse(data);
    }
    catch (error) {
        // ファイルが存在しない場合は空配列を返す
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}
/**
 * メモデータを保存する
 */
async function saveMemos(memos) {
    await ensureDataDir();
    await fs.writeFile(MEMO_FILE, JSON.stringify(memos, null, 2), 'utf-8');
}
/**
 * データディレクトリが存在することを確認する
 */
async function ensureDataDir() {
    try {
        await fs.access(MEMO_DATA_DIR);
    }
    catch {
        await fs.mkdir(MEMO_DATA_DIR, { recursive: true });
    }
}
//# sourceMappingURL=memo.js.map