/**
 * すべてのメモを取得する
 */
export async function getAllMemos() {
    try {
        const response = await fetch('/api/memo');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const memos = await response.json();
        return memos.map(convertToClientMemo);
    }
    catch (error) {
        console.error('メモの取得に失敗しました:', error);
        return [];
    }
}
/**
 * 特定のアイテムのメモを取得する
 */
export async function getMemoByItemId(feedId, itemGuid) {
    try {
        const itemId = createItemId(feedId, itemGuid);
        const response = await fetch(`/api/memo/${encodeURIComponent(itemId)}`);
        if (response.status === 404) {
            return null;
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const memo = await response.json();
        return convertToClientMemo(memo);
    }
    catch (error) {
        console.error('メモの取得に失敗しました:', error);
        return null;
    }
}
/**
 * メモを保存する
 */
export async function saveMemo(feedId, itemGuid, content) {
    try {
        const itemId = createItemId(feedId, itemGuid);
        const response = await fetch('/api/memo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemId, content }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const memo = await response.json();
        return convertToClientMemo(memo);
    }
    catch (error) {
        console.error('メモの保存に失敗しました:', error);
        throw new Error(`メモの保存に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
}
/**
 * メモを削除する
 */
export async function deleteMemo(feedId, itemGuid) {
    try {
        const itemId = createItemId(feedId, itemGuid);
        const response = await fetch(`/api/memo/${encodeURIComponent(itemId)}`, {
            method: 'DELETE',
        });
        if (!response.ok && response.status !== 404) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
    }
    catch (error) {
        console.error('メモの削除に失敗しました:', error);
        throw new Error(`メモの削除に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
}
/**
 * アイテム ID を作成する
 */
function createItemId(feedId, itemGuid) {
    return `${feedId}:${itemGuid}`;
}
/**
 * サーバーサイドのメモをクライアントサイドの形式に変換する
 */
function convertToClientMemo(memo) {
    const [feedId, itemGuid] = memo.itemId.split(':', 2);
    return {
        id: memo.itemId,
        feedId,
        itemGuid,
        content: memo.content,
        createdAt: memo.createdAt,
        updatedAt: memo.updatedAt
    };
}
//# sourceMappingURL=memo-api.js.map