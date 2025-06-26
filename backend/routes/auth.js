// 認証関連ルート定義
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// ユーザー登録
router.post('/register', async (req, res) => {
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
router.post('/login', (req, res) => {
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
router.post('/logout', (req, res) => {
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
router.get('/me', requireAuth, (req, res) => {
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
        message: 'ユーザー情報取得成功',
        user: user
      });
    }
  );
});

module.exports = router; 