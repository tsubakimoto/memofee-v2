/**
 * サーバーからRSSフィードを取得する
 */
export async function fetchRssFeed(url) {
    try {
        const response = await fetch('/api/rss/fetch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const feed = await response.json();
        return feed;
    }
    catch (error) {
        console.error('RSS フィードの取得に失敗しました:', error);
        throw new Error(`RSS フィードの取得に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
}
/**
 * 日付文字列をフォーマットする
 */
export function formatDate(dateString) {
    if (!dateString)
        return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime()))
            return dateString;
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    catch (error) {
        return dateString;
    }
}
/**
 * URL が有効かどうかチェックする
 */
export function isValidUrl(urlString) {
    try {
        const url = new URL(urlString);
        return url.protocol === 'http:' || url.protocol === 'https:';
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=rss-parser.js.map