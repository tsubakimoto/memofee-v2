import type { Feed, Memo, AppState } from './types.js';
/**
 * フィード一覧を取得する
 */
export declare function getFeeds(): Feed[];
/**
 * フィード一覧を保存する
 */
export declare function saveFeeds(feeds: Feed[]): void;
/**
 * フィードを追加する
 */
export declare function addFeed(feed: Feed): void;
/**
 * フィードを削除する
 */
export declare function removeFeed(feedId: string): void;
/**
 * メモ一覧を取得する
 */
export declare function getMemos(): Memo[];
/**
 * メモ一覧を保存する
 */
export declare function saveMemos(memos: Memo[]): void;
/**
 * メモを保存する
 */
export declare function saveMemo(memo: Memo): void;
/**
 * 特定のフィードアイテムのメモを取得する
 */
export declare function getMemoByItem(feedId: string, itemGuid: string): Memo | null;
/**
 * メモを削除する
 */
export declare function deleteMemo(feedId: string, itemGuid: string): void;
/**
 * アプリケーションの状態を取得する
 */
export declare function getAppState(): AppState;
