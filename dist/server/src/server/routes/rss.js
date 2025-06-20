"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rssRouter = void 0;
const express_1 = require("express");
const rss_parser_1 = __importDefault(require("rss-parser"));
const router = (0, express_1.Router)();
exports.rssRouter = router;
const parser = new rss_parser_1.default({
    customFields: {
        item: ['guid']
    }
});
/**
 * RSS フィードを取得してパースするエンドポイント
 */
router.post('/fetch', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url || typeof url !== 'string') {
            return res.status(400).json({
                error: 'RSS フィード URL が指定されていません'
            });
        }
        if (!isValidUrl(url)) {
            return res.status(400).json({
                error: '有効な URL を指定してください'
            });
        }
        console.log(`RSS フィードを取得中: ${url}`);
        // RSS フィードを取得してパース
        const feed = await parser.parseURL(url);
        // 独自の Feed 形式に変換
        const transformedFeed = {
            id: generateFeedId(url),
            url,
            title: feed.title || '無題のフィード',
            description: feed.description || '',
            items: feed.items.map(transformRssItem),
            lastUpdated: new Date().toISOString()
        };
        console.log(`RSS フィードを正常に取得しました: ${transformedFeed.title} (${transformedFeed.items.length} 件)`);
        return res.json(transformedFeed);
    }
    catch (error) {
        console.error('RSS フィードの取得に失敗しました:', error);
        const errorMessage = error instanceof Error ? error.message : '不明なエラー';
        return res.status(500).json({
            error: `RSS フィードの取得に失敗しました: ${errorMessage}`
        });
    }
});
/**
 * RSS アイテムを独自の FeedItem 形式に変換する
 */
function transformRssItem(item) {
    return {
        title: item.title || '無題',
        link: item.link || '',
        description: stripHtml(item.contentSnippet || item.content || ''),
        pubDate: item.pubDate || item.isoDate || '',
        guid: item.guid || item.link || `${item.title}_${item.pubDate}`
    };
}
/**
 * HTML タグを除去する
 */
function stripHtml(html) {
    if (!html)
        return '';
    return html.replace(/<[^>]*>/g, '').trim();
}
/**
 * URL からフィード ID を生成する
 */
function generateFeedId(url) {
    return Buffer.from(url).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
}
/**
 * URL が有効かどうかチェックする
 */
function isValidUrl(urlString) {
    try {
        const url = new URL(urlString);
        return url.protocol === 'http:' || url.protocol === 'https:';
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=rss.js.map