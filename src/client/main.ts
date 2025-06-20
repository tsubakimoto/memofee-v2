import { UIManager } from './ui-manager';

/**
 * アプリケーションのメインエントリーポイント
 */
function initializeApp(): void {
  try {
    // localStorage が利用可能かチェック
    if (!window.localStorage) {
      throw new Error('このアプリケーションを使用するには localStorage が必要です。');
    }
    
    // UI マネージャーを初期化
    new UIManager();
    
    console.log('MemoFee アプリケーションが正常に初期化されました。');
  } catch (error) {
    console.error('アプリケーションの初期化に失敗しました:', error);
    alert(`アプリケーションの初期化に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
  }
}

// DOM が読み込まれた後にアプリケーションを初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}