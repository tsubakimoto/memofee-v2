import type { Feed, FeedItem, AppState } from '../shared/types';
import { getAppState, addFeed } from './storage';
import { fetchRssFeed, formatDate, isValidUrl } from './rss-parser';
import { saveMemo, getMemoByItemId, deleteMemo } from './memo-api';

/**
 * UI 管理クラス
 */
export class UIManager {
  private appState: AppState;
  
  // DOM 要素
  private rssUrlInput: HTMLInputElement;
  private addRssBtn: HTMLButtonElement;
  private feedList: HTMLElement;
  private selectedItemInfo: HTMLElement;
  private memoTextarea: HTMLTextAreaElement;
  private saveMemoBtn: HTMLButtonElement;
  private clearMemoBtn: HTMLButtonElement;

  constructor() {
    this.appState = getAppState();
    
    // DOM 要素を取得
    this.rssUrlInput = this.getElement('#rss-url-input') as HTMLInputElement;
    this.addRssBtn = this.getElement('#add-rss-btn') as HTMLButtonElement;
    this.feedList = this.getElement('#feed-list');
    this.selectedItemInfo = this.getElement('#selected-item-info');
    this.memoTextarea = this.getElement('#memo-textarea') as HTMLTextAreaElement;
    this.saveMemoBtn = this.getElement('#save-memo-btn') as HTMLButtonElement;
    this.clearMemoBtn = this.getElement('#clear-memo-btn') as HTMLButtonElement;
    
    this.initializeEventListeners();
    this.updateFeedDisplay();
  }

  /**
   * DOM 要素を安全に取得する
   */
  private getElement(selector: string): HTMLElement {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) {
      throw new Error(`要素が見つかりません: ${selector}`);
    }
    return element;
  }

  /**
   * イベントリスナーを初期化する
   */
  private initializeEventListeners(): void {
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
  private async handleAddRss(): Promise<void> {
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
    } catch (error) {
      console.error('RSS フィード追加エラー:', error);
      alert(error instanceof Error ? error.message : 'RSS フィードの追加に失敗しました。');
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * ローディング状態を設定する
   */
  private setLoading(loading: boolean): void {
    this.addRssBtn.disabled = loading;
    this.rssUrlInput.disabled = loading;
    
    if (loading) {
      this.addRssBtn.textContent = '追加中...';
    } else {
      this.addRssBtn.textContent = 'RSS 追加';
    }
  }

  /**
   * フィード表示を更新する
   */
  private updateFeedDisplay(): void {
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
  private createFeedElement(feed: Feed): HTMLElement {
    const feedDiv = document.createElement('div');
    feedDiv.className = 'feed-item';
    
    const headerDiv = document.createElement('div');
    headerDiv.className = 'feed-header';
    headerDiv.innerHTML = `<div class="feed-title">${this.escapeHtml(feed.title)}</div>`;
    
    const itemsDiv = document.createElement('div');
    itemsDiv.className = 'feed-items';
    
    for (const item of feed.items) {
      const itemElement = this.createFeedItemElement(feed, item);
      itemsDiv.appendChild(itemElement);
    }
    
    feedDiv.appendChild(headerDiv);
    feedDiv.appendChild(itemsDiv);
    
    return feedDiv;
  }

  /**
   * フィードアイテム要素を作成する
   */
  private createFeedItemElement(feed: Feed, item: FeedItem): HTMLElement {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'feed-item-entry';
    itemDiv.setAttribute('data-feed-id', feed.id);
    itemDiv.setAttribute('data-item-guid', item.guid);
    
    const titleLink = document.createElement('a');
    titleLink.href = item.link;
    titleLink.target = '_blank';
    titleLink.className = 'item-title-link';
    titleLink.textContent = item.title;
    
    const dateSpan = document.createElement('span');
    dateSpan.className = 'item-date';
    dateSpan.textContent = formatDate(item.pubDate);
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'item-title';
    titleDiv.appendChild(titleLink);
    
    const metaDiv = document.createElement('div');
    metaDiv.className = 'item-meta';
    metaDiv.appendChild(dateSpan);
    
    const descDiv = document.createElement('div');
    descDiv.className = 'item-description';
    descDiv.textContent = item.description;
    
    itemDiv.appendChild(titleDiv);
    itemDiv.appendChild(metaDiv);
    itemDiv.appendChild(descDiv);
    
    // アイテム選択イベント
    itemDiv.addEventListener('click', (e) => {
      // リンククリックの場合は選択処理をスキップ
      if ((e.target as HTMLElement).tagName === 'A') {
        return;
      }
      this.selectFeedItem(feed.id, item.guid, item.title);
    });
    
    return itemDiv;
  }

  /**
   * フィードアイテムを選択する
   */
  private async selectFeedItem(feedId: string, itemGuid: string, itemTitle: string): Promise<void> {
    // 既存の選択を解除
    const prevSelected = this.feedList.querySelector('.feed-item-entry.selected');
    if (prevSelected) {
      prevSelected.classList.remove('selected');
    }
    
    // 新しいアイテムを選択
    const itemElement = this.feedList.querySelector(
      `[data-feed-id="${feedId}"][data-item-guid="${itemGuid}"]`
    );
    if (itemElement) {
      itemElement.classList.add('selected');
    }
    
    // 選択アイテム情報を更新
    this.selectedItemInfo.textContent = `選択中: ${itemTitle}`;
    
    // 状態を更新
    this.appState.selectedItem = { feedId, itemGuid };
    
    // メモを読み込み
    try {
      const memo = await getMemoByItemId(feedId, itemGuid);
      this.memoTextarea.value = memo ? memo.content : '';
    } catch (error) {
      console.error('メモの読み込みに失敗しました:', error);
      this.memoTextarea.value = '';
    }
    
    // メモエリアを有効化
    this.memoTextarea.disabled = false;
    this.updateMemoButtons();
  }

  /**
   * メモを保存する
   */
  private async handleSaveMemo(): Promise<void> {
    if (!this.appState.selectedItem) return;
    
    const content = this.memoTextarea.value.trim();
    
    if (!content) {
      alert('メモの内容を入力してください。');
      return;
    }
    
    this.saveMemoBtn.disabled = true;
    this.saveMemoBtn.textContent = '保存中...';
    
    try {
      await saveMemo(
        this.appState.selectedItem.feedId,
        this.appState.selectedItem.itemGuid,
        content
      );
      
      alert('メモを保存しました。');
      this.updateMemoButtons();
    } catch (error) {
      console.error('メモ保存エラー:', error);
      alert(error instanceof Error ? error.message : 'メモの保存に失敗しました。');
    } finally {
      this.saveMemoBtn.disabled = false;
      this.saveMemoBtn.textContent = '保存';
    }
  }

  /**
   * メモをクリアする
   */
  private async handleClearMemo(): Promise<void> {
    if (!this.appState.selectedItem) return;
    
    if (!confirm('メモを削除しますか？この操作は取り消せません。')) {
      return;
    }
    
    this.clearMemoBtn.disabled = true;
    this.clearMemoBtn.textContent = '削除中...';
    
    try {
      await deleteMemo(
        this.appState.selectedItem.feedId,
        this.appState.selectedItem.itemGuid
      );
      
      this.memoTextarea.value = '';
      this.updateMemoButtons();
      alert('メモを削除しました。');
    } catch (error) {
      console.error('メモ削除エラー:', error);
      alert(error instanceof Error ? error.message : 'メモの削除に失敗しました。');
    } finally {
      this.clearMemoBtn.disabled = false;
      this.clearMemoBtn.textContent = 'クリア';
    }
  }

  /**
   * メモボタンの状態を更新する
   */
  private updateMemoButtons(): void {
    const hasContent = this.memoTextarea.value.trim().length > 0;
    const hasSelection = this.appState.selectedItem !== null;
    
    this.saveMemoBtn.disabled = !hasSelection || !hasContent;
    this.clearMemoBtn.disabled = !hasSelection || !hasContent;
  }

  /**
   * HTML エスケープ
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}