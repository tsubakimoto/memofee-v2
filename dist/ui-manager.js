import { getAppState, addFeed, saveMemo, getMemoByItem, deleteMemo } from './storage.js';
import { fetchRssFeed, formatDate, isValidUrl } from './rss-parser.js';
/**
 * UI 管理クラス
 */
export class UIManager {
    appState;
    // DOM 要素
    rssUrlInput;
    addRssBtn;
    feedList;
    selectedItemInfo;
    memoTextarea;
    saveMemoBtn;
    clearMemoBtn;
    constructor() {
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
    getElement(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            throw new Error(`要素が見つかりません: ${selector}`);
        }
        return element;
    }
    /**
     * イベントリスナーを初期化する
     */
    initializeEventListeners() {
        // RSS 追加ボタン
        this.addRssBtn.addEventListener('click', () => this.handleAddRss());
        // RSS URL 入力でエンターキー
        this.rssUrlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAddRss();
            }
        });
        // メモ保存ボタン
        this.saveMemoBtn.addEventListener('click', () => this.handleSaveMemo());
        // メモクリアボタン
        this.clearMemoBtn.addEventListener('click', () => this.handleClearMemo());
        // メモテキストエリアの変更
        this.memoTextarea.addEventListener('input', () => this.updateMemoButtons());
    }
    /**
     * RSS フィード追加を処理する
     */
    async handleAddRss() {
        const url = this.rssUrlInput.value.trim();
        if (!url) {
            alert('RSS フィード URL を入力してください。');
            return;
        }
        if (!isValidUrl(url)) {
            alert('有効な URL を入力してください。');
            return;
        }
        this.setLoading(true);
        try {
            const feed = await fetchRssFeed(url);
            addFeed(feed);
            this.appState = getAppState();
            this.updateFeedDisplay();
            this.rssUrlInput.value = '';
            alert('RSS フィードを追加しました。');
        }
        catch (error) {
            console.error('RSS フィード追加エラー:', error);
            alert(error instanceof Error ? error.message : 'RSS フィードの追加に失敗しました。');
        }
        finally {
            this.setLoading(false);
        }
    }
    /**
     * ローディング状態を設定する
     */
    setLoading(loading) {
        this.addRssBtn.disabled = loading;
        this.rssUrlInput.disabled = loading;
        if (loading) {
            this.addRssBtn.textContent = '追加中...';
        }
        else {
            this.addRssBtn.textContent = 'RSS 追加';
        }
    }
    /**
     * フィード表示を更新する
     */
    updateFeedDisplay() {
        if (this.appState.feeds.length === 0) {
            this.feedList.innerHTML = `
        <div class="no-feeds">
          RSS フィードが登録されていません。<br>
          上部の入力欄から RSS URL を登録してください。
        </div>
      `;
            return;
        }
        this.feedList.innerHTML = '';
        for (const feed of this.appState.feeds) {
            const feedElement = this.createFeedElement(feed);
            this.feedList.appendChild(feedElement);
        }
    }
    /**
     * フィード要素を作成する
     */
    createFeedElement(feed) {
        const feedDiv = document.createElement('div');
        feedDiv.className = 'feed-item';
        const headerDiv = document.createElement('div');
        headerDiv.className = 'feed-header';
        headerDiv.innerHTML = `<div class="feed-title">${this.escapeHtml(feed.title)}</div>`;
        const articlesDiv = document.createElement('div');
        articlesDiv.className = 'feed-articles';
        for (const item of feed.items) {
            const articleDiv = this.createArticleElement(feed.id, item);
            articlesDiv.appendChild(articleDiv);
        }
        feedDiv.appendChild(headerDiv);
        feedDiv.appendChild(articlesDiv);
        return feedDiv;
    }
    /**
     * 記事要素を作成する
     */
    createArticleElement(feedId, item) {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'article-item';
        articleDiv.dataset.feedId = feedId;
        articleDiv.dataset.itemGuid = item.guid;
        const titleLink = document.createElement('a');
        titleLink.className = 'article-title';
        titleLink.href = item.link;
        titleLink.target = '_blank';
        titleLink.rel = 'noopener noreferrer';
        titleLink.textContent = item.title;
        const dateDiv = document.createElement('div');
        dateDiv.className = 'article-date';
        dateDiv.textContent = formatDate(item.pubDate);
        articleDiv.appendChild(titleLink);
        articleDiv.appendChild(dateDiv);
        // クリックイベント
        articleDiv.addEventListener('click', (e) => {
            // リンククリックの場合は選択処理をスキップ
            if (e.target === titleLink) {
                return;
            }
            this.selectArticle(feedId, item);
        });
        return articleDiv;
    }
    /**
     * 記事を選択する
     */
    selectArticle(feedId, item) {
        // 以前の選択を解除
        const previousSelected = this.feedList.querySelector('.article-item.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        // 新しい選択を設定
        const articleElement = this.feedList.querySelector(`[data-feed-id="${feedId}"][data-item-guid="${item.guid}"]`);
        if (articleElement) {
            articleElement.classList.add('selected');
        }
        // 状態を更新
        this.appState.selectedItem = { feedId, itemGuid: item.guid };
        // メモエリアを更新
        this.updateMemoArea(feedId, item);
    }
    /**
     * メモエリアを更新する
     */
    updateMemoArea(feedId, item) {
        const feed = this.appState.feeds.find(f => f.id === feedId);
        if (!feed)
            return;
        // 選択されたアイテム情報を表示
        this.selectedItemInfo.innerHTML = `
      <strong>${this.escapeHtml(item.title)}</strong><br>
      <small>フィード: ${this.escapeHtml(feed.title)}</small>
    `;
        // 既存のメモを読み込み
        const existingMemo = getMemoByItem(feedId, item.guid);
        this.memoTextarea.value = existingMemo ? existingMemo.content : '';
        // UI を有効化
        this.memoTextarea.disabled = false;
        this.updateMemoButtons();
    }
    /**
     * メモボタンの状態を更新する
     */
    updateMemoButtons() {
        const hasSelection = this.appState.selectedItem !== null;
        const hasContent = this.memoTextarea.value.trim() !== '';
        this.saveMemoBtn.disabled = !hasSelection;
        this.clearMemoBtn.disabled = !hasSelection || !hasContent;
    }
    /**
     * メモ保存を処理する
     */
    handleSaveMemo() {
        if (!this.appState.selectedItem)
            return;
        const content = this.memoTextarea.value.trim();
        const { feedId, itemGuid } = this.appState.selectedItem;
        if (!content) {
            // 空の場合はメモを削除
            deleteMemo(feedId, itemGuid);
            alert('メモを削除しました。');
        }
        else {
            // メモを保存
            const memo = {
                id: `${feedId}_${itemGuid}`,
                feedId,
                itemGuid,
                content,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            saveMemo(memo);
            alert('メモを保存しました。');
        }
        this.updateMemoButtons();
    }
    /**
     * メモクリアを処理する
     */
    handleClearMemo() {
        this.memoTextarea.value = '';
        this.updateMemoButtons();
        this.memoTextarea.focus();
    }
    /**
     * HTML エスケープ
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
//# sourceMappingURL=ui-manager.js.map