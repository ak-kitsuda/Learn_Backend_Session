// Express.jsを読み込み
const express = require('express');
const cors = require('cors');

// データベース接続を読み込み
const db = require('./config/database');

// Expressアプリケーションを作成
const app = express();

// サーバーが動くポート番号を設定
const PORT = 3000;

// ミドルウェアの設定
app.use(express.json());              // JSONデータを解析できるようにする
app.use(express.urlencoded({ extended: true })); // フォームデータを解析できるようにする
app.use(cors());                      // 異なるポート間の通信を許可（フロントエンド連携用）

// 最初のエンドポイント（APIの入り口）を作成
// GET /api/hello にアクセスした時の処理
app.get('/api/hello', (req, res) => {
  // JSONでレスポンスを返す
  res.json({ 
    message: 'Hello World!',
    timestamp: new Date().toISOString(),
    status: 'サーバーが正常に動作しています'
  });
});

// データベース接続テストエンドポイント
app.get('/api/db-test', (req, res) => {
  // SQLiteの現在時刻を取得するクエリを実行
  db.get('SELECT datetime("now") as current_time', (err, row) => {
    if (err) {
      // データベースエラーの場合
      console.error('データベースエラー:', err);
      res.status(500).json({ error: 'データベースエラーが発生しました' });
    } else {
      // 成功の場合
      res.json({ 
        message: 'データベース接続成功！',
        current_time: row.current_time,
        database_type: 'SQLite'
      });
    }
  });
});

// サーバーを起動
app.listen(PORT, () => {
  console.log(`🚀 サーバーがポート${PORT}で起動しました`);
  console.log(`📱 ブラウザで http://localhost:${PORT}/api/hello にアクセスしてください`);
  console.log(`🗄️  データベーステスト: http://localhost:${PORT}/api/db-test`);
}); 