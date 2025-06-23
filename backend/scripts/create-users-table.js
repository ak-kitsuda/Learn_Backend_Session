// ユーザーテーブル作成スクリプト
const db = require('../config/database');

// ユーザーテーブルのSQL定義
const createUsersTableSQL = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

// テーブル作成実行
console.log('📋 ユーザーテーブルを作成しています...');

db.run(createUsersTableSQL, (err) => {
  if (err) {
    console.error('❌ ユーザーテーブル作成エラー:', err.message);
    process.exit(1);
  } else {
    console.log('✅ ユーザーテーブルが正常に作成されました');
    
    // テーブル構造の確認
    db.all("PRAGMA table_info(users)", (err, rows) => {
      if (err) {
        console.error('❌ テーブル情報取得エラー:', err.message);
      } else {
        console.log('📊 ユーザーテーブル構造:');
        console.table(rows);
      }
      
      // データベース接続を閉じる
      db.close((err) => {
        if (err) {
          console.error('❌ データベース接続終了エラー:', err.message);
        } else {
          console.log('🔒 データベース接続を終了しました');
        }
        process.exit(0);
      });
    });
  }
}); 