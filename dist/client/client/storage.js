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
}
/**
 * メモ一覧を取得する（後方互換性のため、サーバーから取得せずローカルストレージを使用）
 */
export function getMemos() {
    return getStorageData(STORAGE_KEYS.MEMOS, []);
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