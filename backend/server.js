// Express.jsを読み込み
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

// データベース接続を読み込み
const db = require('./config/database');

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

// 認証ミドルウェア
const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: '認証が必要です' });
  }
};

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

// 認証API
// ユーザー登録
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // 入力検証
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'ユーザー名、メールアドレス、パスワードは必須です' });
    }
    
    // パスワードの長さチェック
    if (password.length < 6) {
      return res.status(400).json({ error: 'パスワードは6文字以上である必要があります' });
    }
    
    // パスワードをハッシュ化
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // データベースにユーザーを保存
    db.run(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function(err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(400).json({ error: 'ユーザー名またはメールアドレスが既に使用されています' });
          }
          console.error('ユーザー登録エラー:', err);
          return res.status(500).json({ error: 'ユーザー登録に失敗しました' });
        }
        
        // セッションにユーザーIDを保存
        req.session.userId = this.lastID;
        req.session.username = username;
        
        res.status(201).json({
          message: 'ユーザー登録が完了しました',
          user: {
            id: this.lastID,
            username: username,
            email: email
          }
        });
      }
    );
  } catch (error) {
    console.error('ユーザー登録エラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// ログイン
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // 入力検証
  if (!username || !password) {
    return res.status(400).json({ error: 'ユーザー名とパスワードは必須です' });
  }
  
  // データベースからユーザーを検索
  db.get(
    'SELECT id, username, email, password_hash FROM users WHERE username = ?',
    [username],
    async (err, user) => {
      if (err) {
        console.error('ログインエラー:', err);
        return res.status(500).json({ error: 'サーバーエラーが発生しました' });
      }
      
      if (!user) {
        return res.status(401).json({ error: 'ユーザー名またはパスワードが間違っています' });
      }
      
      try {
        // パスワードを検証
        const isValid = await bcrypt.compare(password, user.password_hash);
        
        if (!isValid) {
          return res.status(401).json({ error: 'ユーザー名またはパスワードが間違っています' });
        }
        
        // セッションにユーザー情報を保存
        req.session.userId = user.id;
        req.session.username = user.username;
        
        res.json({
          message: 'ログインしました',
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        });
      } catch (error) {
        console.error('パスワード検証エラー:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
      }
    }
  );
});

// ログアウト
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('ログアウトエラー:', err);
      return res.status(500).json({ error: 'ログアウトに失敗しました' });
    }
    
    res.clearCookie('connect.sid'); // セッションクッキーを削除
    res.json({ message: 'ログアウトしました' });
  });
});

// 現在のユーザー情報取得
app.get('/api/auth/me', requireAuth, (req, res) => {
  // セッションからユーザーIDを取得してデータベースから情報を取得
  db.get(
    'SELECT id, username, email, created_at FROM users WHERE id = ?',
    [req.session.userId],
    (err, user) => {
      if (err) {
        console.error('ユーザー情報取得エラー:', err);
        return res.status(500).json({ error: 'サーバーエラーが発生しました' });
      }
      
      if (!user) {
        return res.status(404).json({ error: 'ユーザーが見つかりません' });
      }
      
      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.created_at
        }
      });
    }
  );
});

// サーバーを起動
app.listen(PORT, () => {
  console.log(`🚀 サーバーがポート${PORT}で起動しました`);
  console.log(`📱 ブラウザで http://localhost:${PORT}/api/hello にアクセスしてください`);
  console.log(`🗄️  データベーステスト: http://localhost:${PORT}/api/db-test`);
}); 