/**
 * RSS フィードアイテムの型定義
 */
export interface FeedItem {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    guid: string;
}
/**
 * RSS フィードの型定義
 */
export interface Feed {
    id: string;
    url: string;
    title: string;
    description: string;
    items: FeedItem[];
    lastUpdated: string;
}
/**
 * メモの型定義
 */
export interface Memo {
    id: string;
    feedId: string;
    itemGuid: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}
/**
 * アプリケーションの状態
 */
export interface AppState {
    feeds: Feed[];
    memos: Memo[];
    selectedItem: {
        feedId: string;
        itemGuid: string;
    } | null;
}
