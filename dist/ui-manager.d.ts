/**
 * UI 管理クラス
 */
export declare class UIManager {
    private appState;
    private rssUrlInput;
    private addRssBtn;
    private feedList;
    private selectedItemInfo;
    private memoTextarea;
    private saveMemoBtn;
    private clearMemoBtn;
    constructor();
    /**
     * DOM 要素を安全に取得する
     */
    private getElement;
    /**
     * イベントリスナーを初期化する
     */
    private initializeEventListeners;
    /**
     * RSS フィード追加を処理する
     */
    private handleAddRss;
    /**
     * ローディング状態を設定する
     */
    private setLoading;
    /**
     * フィード表示を更新する
     */
    private updateFeedDisplay;
    /**
     * フィード要素を作成する
     */
    private createFeedElement;
    /**
     * 記事要素を作成する
     */
    private createArticleElement;
    /**
     * 記事を選択する
     */
    private selectArticle;
    /**
     * メモエリアを更新する
     */
    private updateMemoArea;
    /**
     * メモボタンの状態を更新する
     */
    private updateMemoButtons;
    /**
     * メモ保存を処理する
     */
    private handleSaveMemo;
    /**
     * メモクリアを処理する
     */
    private handleClearMemo;
    /**
     * HTML エスケープ
     */
    private escapeHtml;
}
