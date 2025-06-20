/**
 * RSS フィードを取得してパースする
 */
export async function fetchRssFeed(url) {
    try {
        // CORS の問題を回避するため、CORS プロキシを使用
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
        // パースエラーをチェック
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
            throw new Error('XML の解析に失敗しました');
        }
        return parseRssXml(xmlDoc, url);
    }
    catch (error) {
        console.error('RSS フィードの取得に失敗しました:', error);
        throw new Error(`RSS フィードの取得に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
}
/**
 * XML ドキュメントから RSS フィードを解析する
 */
function parseRssXml(xmlDoc, url) {
    const channel = xmlDoc.querySelector('channel');
    if (!channel) {
        throw new Error('有効な RSS フィードではありません');
    }
    // フィード情報を取得
    const title = getTextContent(channel, 'title') || '無題のフィード';
    const description = getTextContent(channel, 'description') || '';
    // アイテムを取得
    const itemElements = channel.querySelectorAll('item');
    const items = Array.from(itemElements).map(parseRssItem);
    return {
        id: generateFeedId(url),
        url,
        title,
        description,
        items,
        lastUpdated: new Date().toISOString()
    };
}
/**
 * RSS アイテムを解析する
 */
function parseRssItem(itemElement) {
    const title = getTextContent(itemElement, 'title') || '無題';
    const link = getTextContent(itemElement, 'link') || '';
    const description = getTextContent(itemElement, 'description') || '';
    const pubDate = getTextContent(itemElement, 'pubDate') || '';
    // GUID を取得（なければリンクを使用）
    let guid = getTextContent(itemElement, 'guid');
    if (!guid) {
        guid = link || `${title}_${pubDate}`;
    }
    return {
        title,
        link,
        description: stripHtml(description),
        pubDate,
        guid
    };
}
/**
 * 要素からテキストコンテンツを安全に取得する
 */
function getTextContent(parent, tagName) {
    const element = parent.querySelector(tagName);
    return element ? element.textContent?.trim() || null : null;
}
/**
 * HTML タグを除去する
 */
function stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
}
/**
 * URL からフィード ID を生成する
 */
function generateFeedId(url) {
    return btoa(url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
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