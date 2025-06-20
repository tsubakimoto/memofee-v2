import type { Feed } from '../shared/types';
/**
 * サーバーからRSSフィードを取得する
 */
export declare function fetchRssFeed(url: string): Promise<Feed>;
/**
 * 日付文字列をフォーマットする
 */
export declare function formatDate(dateString: string): string;
/**
 * URL が有効かどうかチェックする
 */
export declare function isValidUrl(urlString: string): boolean;
