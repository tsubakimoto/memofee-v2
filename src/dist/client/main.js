import { UIManager } from './ui-manager';
/**
 * アプリケーションのメインエントリーポイント
 */
function initializeApp() {
    try {
        // localStorage が利用可能かチェック
        if (!window.localStorage) {
            throw new Error('このアプリケーションを使用するには localStorage が必要です。');
        }
        // UI マネージャーを初期化
        new UIManager();
        console.log('MemoFee アプリケーションが正常に初期化されました。');
    }
    catch (error) {
        console.error('アプリケーションの初期化に失敗しました:', error);
        alert("\u30A2\u30D7\u30EA\u30B1\u30FC\u30B7\u30E7\u30F3\u306E\u521D\u671F\u5316\u306B\u5931\u6557\u3057\u307E\u3057\u305F: ".concat(error instanceof Error ? error.message : '不明なエラー'));
    }
}
// DOM が読み込まれた後にアプリケーションを初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
}
else {
    initializeApp();
}
