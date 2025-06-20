import type { Feed, ClientMemo, AppState } from '../shared/types';
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
 * メモ一覧を取得する（後方互換性のため、サーバーから取得せずローカルストレージを使用）
 */
export declare function getMemos(): ClientMemo[];
/**
 * アプリケーションの状態を取得する
 */
export declare function getAppState(): AppState;
