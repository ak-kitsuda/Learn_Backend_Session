// SQLite3ライブラリを読み込み
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// データベースファイルのパスを設定
// __dirname は現在のファイル（database.js）があるディレクトリのパス
// '../database/todo.db' で一つ上のディレクトリのdatabaseフォルダを指定
const dbPath = path.join(__dirname, '../database/todo.db');

console.log('📁 データベースファイルパス:', dbPath);

// SQLiteデータベースに接続
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    // 接続エラーの場合
    console.error('❌ データベース接続エラー:', err.message);
  } else {
    // 接続成功の場合
    console.log('✅ SQLiteデータベースに接続しました');
  }
});

// 他のファイルから使用できるようにエクスポート
module.exports = db; 