import type { ClientMemo } from '../shared/types';
/**
 * すべてのメモを取得する
 */
export declare function getAllMemos(): Promise<ClientMemo[]>;
/**
 * 特定のアイテムのメモを取得する
 */
export declare function getMemoByItemId(feedId: string, itemGuid: string): Promise<ClientMemo | null>;
/**
 * メモを保存する
 */
export declare function saveMemo(feedId: string, itemGuid: string, content: string): Promise<ClientMemo>;
/**
 * メモを削除する
 */
export declare function deleteMemo(feedId: string, itemGuid: string): Promise<void>;
