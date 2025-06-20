var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { getAppState, addFeed } from './storage';
import { fetchRssFeed, formatDate, isValidUrl } from './rss-parser';
import { saveMemo, getMemoByItemId, deleteMemo } from './memo-api';
/**
 * UI 管理クラス
 */
var UIManager = /** @class */ (function () {
    function UIManager() {
        this.appState = getAppState();
        // DOM 要素を取得
        this.rssUrlInput = this.getElement('#rss-url-input');
        this.addRssBtn = this.getElement('#add-rss-btn');
        this.feedList = this.getElement('#feed-list');
        this.selectedItemInfo = this.getElement('#selected-item-info');
        this.memoTextarea = this.getElement('#memo-textarea');
        this.saveMemoBtn = this.getElement('#save-memo-btn');
        this.clearMemoBtn = this.getElement('#clear-memo-btn');
        this.initializeEventListeners();
        this.updateFeedDisplay();
    }
    /**
     * DOM 要素を安全に取得する
     */
    UIManager.prototype.getElement = function (selector) {
        var element = document.querySelector(selector);
        if (!element) {
            throw new Error("\u8981\u7D20\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093: ".concat(selector));
        }
        return element;
    };
    /**
     * イベントリスナーを初期化する
     */
    UIManager.prototype.initializeEventListeners = function () {
        var _this = this;
        // RSS 追加ボタン
        this.addRssBtn.addEventListener('click', function () { return _this.handleAddRss(); });
        // RSS URL 入力でエンターキー
        this.rssUrlInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                _this.handleAddRss();
            }
        });
        // メモ保存ボタン
        this.saveMemoBtn.addEventListener('click', function () { return _this.handleSaveMemo(); });
        // メモクリアボタン
        this.clearMemoBtn.addEventListener('click', function () { return _this.handleClearMemo(); });
        // メモテキストエリアの変更
        this.memoTextarea.addEventListener('input', function () { return _this.updateMemoButtons(); });
    };
    /**
     * RSS フィード追加を処理する
     */
    UIManager.prototype.handleAddRss = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, feed, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.rssUrlInput.value.trim();
                        if (!url) {
                            alert('RSS フィード URL を入力してください。');
                            return [2 /*return*/];
                        }
                        if (!isValidUrl(url)) {
                            alert('有効な URL を入力してください。');
                            return [2 /*return*/];
                        }
                        this.setLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, fetchRssFeed(url)];
                    case 2:
                        feed = _a.sent();
                        addFeed(feed);
                        this.appState = getAppState();
                        this.updateFeedDisplay();
                        this.rssUrlInput.value = '';
                        alert('RSS フィードを追加しました。');
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        console.error('RSS フィード追加エラー:', error_1);
                        alert(error_1 instanceof Error ? error_1.message : 'RSS フィードの追加に失敗しました。');
                        return [3 /*break*/, 5];
                    case 4:
                        this.setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * ローディング状態を設定する
     */
    UIManager.prototype.setLoading = function (loading) {
        this.addRssBtn.disabled = loading;
        this.rssUrlInput.disabled = loading;
        if (loading) {
            this.addRssBtn.textContent = '追加中...';
        }
        else {
            this.addRssBtn.textContent = 'RSS 追加';
        }
    };
    /**
     * フィード表示を更新する
     */
    UIManager.prototype.updateFeedDisplay = function () {
        if (this.appState.feeds.length === 0) {
            this.feedList.innerHTML = "\n        <div class=\"no-feeds\">\n          RSS \u30D5\u30A3\u30FC\u30C9\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002<br>\n          \u4E0A\u90E8\u306E\u5165\u529B\u6B04\u304B\u3089 RSS URL \u3092\u767B\u9332\u3057\u3066\u304F\u3060\u3055\u3044\u3002\n        </div>\n      ";
            return;
        }
        this.feedList.innerHTML = '';
        for (var _i = 0, _a = this.appState.feeds; _i < _a.length; _i++) {
            var feed = _a[_i];
            var feedElement = this.createFeedElement(feed);
            this.feedList.appendChild(feedElement);
        }
    };
    /**
     * フィード要素を作成する
     */
    UIManager.prototype.createFeedElement = function (feed) {
        var feedDiv = document.createElement('div');
        feedDiv.className = 'feed-item';
        var headerDiv = document.createElement('div');
        headerDiv.className = 'feed-header';
        headerDiv.innerHTML = "<div class=\"feed-title\">".concat(this.escapeHtml(feed.title), "</div>");
        var itemsDiv = document.createElement('div');
        itemsDiv.className = 'feed-items';
        for (var _i = 0, _a = feed.items; _i < _a.length; _i++) {
            var item = _a[_i];
            var itemElement = this.createFeedItemElement(feed, item);
            itemsDiv.appendChild(itemElement);
        }
        feedDiv.appendChild(headerDiv);
        feedDiv.appendChild(itemsDiv);
        return feedDiv;
    };
    /**
     * フィードアイテム要素を作成する
     */
    UIManager.prototype.createFeedItemElement = function (feed, item) {
        var _this = this;
        var itemDiv = document.createElement('div');
        itemDiv.className = 'feed-item-entry';
        itemDiv.setAttribute('data-feed-id', feed.id);
        itemDiv.setAttribute('data-item-guid', item.guid);
        var titleLink = document.createElement('a');
        titleLink.href = item.link;
        titleLink.target = '_blank';
        titleLink.className = 'item-title-link';
        titleLink.textContent = item.title;
        var dateSpan = document.createElement('span');
        dateSpan.className = 'item-date';
        dateSpan.textContent = formatDate(item.pubDate);
        var titleDiv = document.createElement('div');
        titleDiv.className = 'item-title';
        titleDiv.appendChild(titleLink);
        var metaDiv = document.createElement('div');
        metaDiv.className = 'item-meta';
        metaDiv.appendChild(dateSpan);
        var descDiv = document.createElement('div');
        descDiv.className = 'item-description';
        descDiv.textContent = item.description;
        itemDiv.appendChild(titleDiv);
        itemDiv.appendChild(metaDiv);
        itemDiv.appendChild(descDiv);
        // アイテム選択イベント
        itemDiv.addEventListener('click', function (e) {
            // リンククリックの場合は選択処理をスキップ
            if (e.target.tagName === 'A') {
                return;
            }
            _this.selectFeedItem(feed.id, item.guid, item.title);
        });
        return itemDiv;
    };
    /**
     * フィードアイテムを選択する
     */
    UIManager.prototype.selectFeedItem = function (feedId, itemGuid, itemTitle) {
        return __awaiter(this, void 0, void 0, function () {
            var prevSelected, itemElement, memo, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prevSelected = this.feedList.querySelector('.feed-item-entry.selected');
                        if (prevSelected) {
                            prevSelected.classList.remove('selected');
                        }
                        itemElement = this.feedList.querySelector("[data-feed-id=\"".concat(feedId, "\"][data-item-guid=\"").concat(itemGuid, "\"]"));
                        if (itemElement) {
                            itemElement.classList.add('selected');
                        }
                        // 選択アイテム情報を更新
                        this.selectedItemInfo.textContent = "\u9078\u629E\u4E2D: ".concat(itemTitle);
                        // 状態を更新
                        this.appState.selectedItem = { feedId: feedId, itemGuid: itemGuid };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, getMemoByItemId(feedId, itemGuid)];
                    case 2:
                        memo = _a.sent();
                        this.memoTextarea.value = memo ? memo.content : '';
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error('メモの読み込みに失敗しました:', error_2);
                        this.memoTextarea.value = '';
                        return [3 /*break*/, 4];
                    case 4:
                        // メモエリアを有効化
                        this.memoTextarea.disabled = false;
                        this.updateMemoButtons();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * メモを保存する
     */
    UIManager.prototype.handleSaveMemo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var content, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.appState.selectedItem)
                            return [2 /*return*/];
                        content = this.memoTextarea.value.trim();
                        if (!content) {
                            alert('メモの内容を入力してください。');
                            return [2 /*return*/];
                        }
                        this.saveMemoBtn.disabled = true;
                        this.saveMemoBtn.textContent = '保存中...';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, saveMemo(this.appState.selectedItem.feedId, this.appState.selectedItem.itemGuid, content)];
                    case 2:
                        _a.sent();
                        alert('メモを保存しました。');
                        this.updateMemoButtons();
                        return [3 /*break*/, 5];
                    case 3:
                        error_3 = _a.sent();
                        console.error('メモ保存エラー:', error_3);
                        alert(error_3 instanceof Error ? error_3.message : 'メモの保存に失敗しました。');
                        return [3 /*break*/, 5];
                    case 4:
                        this.saveMemoBtn.disabled = false;
                        this.saveMemoBtn.textContent = '保存';
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * メモをクリアする
     */
    UIManager.prototype.handleClearMemo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.appState.selectedItem)
                            return [2 /*return*/];
                        if (!confirm('メモを削除しますか？この操作は取り消せません。')) {
                            return [2 /*return*/];
                        }
                        this.clearMemoBtn.disabled = true;
                        this.clearMemoBtn.textContent = '削除中...';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, deleteMemo(this.appState.selectedItem.feedId, this.appState.selectedItem.itemGuid)];
                    case 2:
                        _a.sent();
                        this.memoTextarea.value = '';
                        this.updateMemoButtons();
                        alert('メモを削除しました。');
                        return [3 /*break*/, 5];
                    case 3:
                        error_4 = _a.sent();
                        console.error('メモ削除エラー:', error_4);
                        alert(error_4 instanceof Error ? error_4.message : 'メモの削除に失敗しました。');
                        return [3 /*break*/, 5];
                    case 4:
                        this.clearMemoBtn.disabled = false;
                        this.clearMemoBtn.textContent = 'クリア';
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * メモボタンの状態を更新する
     */
    UIManager.prototype.updateMemoButtons = function () {
        var hasContent = this.memoTextarea.value.trim().length > 0;
        var hasSelection = this.appState.selectedItem !== null;
        this.saveMemoBtn.disabled = !hasSelection || !hasContent;
        this.clearMemoBtn.disabled = !hasSelection || !hasContent;
    };
    /**
     * HTML エスケープ
     */
    UIManager.prototype.escapeHtml = function (text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };
    return UIManager;
}());
export { UIManager };
