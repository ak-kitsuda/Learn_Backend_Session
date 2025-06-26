// Express.jsを読み込み
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

// データベース接続を読み込み
const db = require('./config/database');

// ルートファイルを読み込み
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

// Expressアプリケーションを作成
const app = express();

// サーバーが動くポート番号を設定
const PORT = 3000;

// セッション設定
app.use(session({
  store: new SQLiteStore({ 
    db: 'sessions.db',
    dir: './database'
  }),
  secret: 'your-learning-session-secret-key-2024', // 学習用のシークレットキー
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24時間
    httpOnly: true,
    secure: false // 開発環境ではfalse（本番環境ではtrue）
  }
}));

// ミドルウェアの設定
app.use(express.json());              // JSONデータを解析できるようにする
app.use(express.urlencoded({ extended: true })); // フォームデータを解析できるようにする
app.use(cors({
  origin: 'http://localhost:8080', // フロントエンドのURL
  credentials: true // セッションクッキーを送信するために必要
}));

// ルートの設定
app.use('/api/auth', authRoutes);     // 認証関連API
app.use('/api/todos', todoRoutes);    // Todo関連API

// 基本的なエンドポイント（APIの入り口）
app.get('/api/hello', (req, res) => {
  res.json({ 
    message: 'Hello World!',
    timestamp: new Date().toISOString(),
    status: 'サーバーが正常に動作しています'
  });
});

// データベース接続テストエンドポイント
app.get('/api/db-test', (req, res) => {
  db.get('SELECT datetime("now") as current_time', (err, row) => {
    if (err) {
      console.error('データベースエラー:', err);
      res.status(500).json({ error: 'データベースエラーが発生しました' });
    } else {
      res.json({ 
        message: 'データベース接続成功！',
        current_time: row.current_time,
        database_type: 'SQLite'
      });
    }
  });
});

// サーバーを指定ポートで起動
app.listen(PORT, () => {
  console.log(`🚀 サーバーがポート${PORT}で起動しました`);
  console.log(`📄 API Documentation:`);
  console.log(`   基本API: http://localhost:${PORT}/api/hello`);
  console.log(`   DB接続: http://localhost:${PORT}/api/db-test`);
  console.log(`   認証API: http://localhost:${PORT}/api/auth/*`);
  console.log(`   TodoAPI: http://localhost:${PORT}/api/todos/*`);
  console.log(`🔧 開発モードで動作中...`);
}); 