/**
 * localStorage のキー定数
 */
const STORAGE_KEYS = {
    FEEDS: 'memofee_feeds',
    MEMOS: 'memofee_memos'
};
/**
 * localStorage からデータを取得する
 */
function getStorageData(key, defaultValue) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    }
    catch (error) {
        console.error(`Error reading from localStorage key "${key}":`, error);
        return defaultValue;
    }
}
/**
 * localStorage にデータを保存する
 */
function setStorageData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    }
    catch (error) {
        console.error(`Error writing to localStorage key "${key}":`, error);
        throw new Error('データの保存に失敗しました');
    }
}
/**
 * フィード一覧を取得する
 */
export function getFeeds() {
    return getStorageData(STORAGE_KEYS.FEEDS, []);
}
/**
 * フィード一覧を保存する
 */
export function saveFeeds(feeds) {
    setStorageData(STORAGE_KEYS.FEEDS, feeds);
}
/**
 * フィードを追加する
 */
export function addFeed(feed) {
    const feeds = getFeeds();
    const existingIndex = feeds.findIndex(f => f.url === feed.url);
    if (existingIndex >= 0) {
        // 既存のフィードを更新
        feeds[existingIndex] = feed;
    }
    else {
        // 新しいフィードを追加
        feeds.push(feed);
    }
    saveFeeds(feeds);
}
/**
 * フィードを削除する
 */
export function removeFeed(feedId) {
    const feeds = getFeeds();
    const filteredFeeds = feeds.filter(f => f.id !== feedId);
    saveFeeds(filteredFeeds);
    // 関連するメモも削除
    const memos = getMemos();
    const filteredMemos = memos.filter(m => m.feedId !== feedId);
    saveMemos(filteredMemos);
}
/**
 * メモ一覧を取得する
 */
export function getMemos() {
    return getStorageData(STORAGE_KEYS.MEMOS, []);
}
/**
 * メモ一覧を保存する
 */
export function saveMemos(memos) {
    setStorageData(STORAGE_KEYS.MEMOS, memos);
}
/**
 * メモを保存する
 */
export function saveMemo(memo) {
    const memos = getMemos();
    const existingIndex = memos.findIndex(m => m.feedId === memo.feedId && m.itemGuid === memo.itemGuid);
    if (existingIndex >= 0) {
        // 既存のメモを更新
        memos[existingIndex] = { ...memo, updatedAt: new Date().toISOString() };
    }
    else {
        // 新しいメモを追加
        memos.push(memo);
    }
    saveMemos(memos);
}
/**
 * 特定のフィードアイテムのメモを取得する
 */
export function getMemoByItem(feedId, itemGuid) {
    const memos = getMemos();
    return memos.find(m => m.feedId === feedId && m.itemGuid === itemGuid) || null;
}
/**
 * メモを削除する
 */
export function deleteMemo(feedId, itemGuid) {
    const memos = getMemos();
    const filteredMemos = memos.filter(m => !(m.feedId === feedId && m.itemGuid === itemGuid));
    saveMemos(filteredMemos);
}
/**
 * アプリケーションの状態を取得する
 */
export function getAppState() {
    return {
        feeds: getFeeds(),
        memos: getMemos(),
        selectedItem: null
    };
}
//# sourceMappingURL=storage.js.map