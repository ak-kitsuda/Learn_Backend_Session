// Todoテーブル作成スクリプト - Phase3 Step1
const db = require('../config/database');

// TodoテーブルのSQL定義
const createTodosTableSQL = `
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT 0,
    priority INTEGER DEFAULT 1,
    due_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  )
`;

// テーブル作成実行
console.log('📋 Todoテーブルを作成しています...');

db.run(createTodosTableSQL, (err) => {
  if (err) {
    console.error('❌ Todoテーブル作成エラー:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Todoテーブルが正常に作成されました');
    
    // テーブル構造の確認
    db.all("PRAGMA table_info(todos)", (err, columns) => {
      if (err) {
        console.error('❌ テーブル構造取得エラー:', err.message);
      } else {
        console.log('\n📊 Todoテーブルの構造:');
        columns.forEach((col, index) => {
          const nullable = col.notnull ? 'NOT NULL' : 'NULL';
          const defaultVal = col.dflt_value !== null ? `DEFAULT ${col.dflt_value}` : '';
          const primaryKey = col.pk ? '(PRIMARY KEY)' : '';
          console.log(`   ${index + 1}. ${col.name}: ${col.type} ${nullable} ${defaultVal} ${primaryKey}`);
        });
      }
      
      // 外部キー制約の確認
      db.all("PRAGMA foreign_key_list(todos)", (err, foreignKeys) => {
        if (err) {
          console.error('❌ 外部キー制約確認エラー:', err.message);
        } else {
          console.log('\n🔗 外部キー制約:');
          if (foreignKeys.length === 0) {
            console.log('   外部キー制約が設定されていません');
          } else {
            foreignKeys.forEach((fk, index) => {
              console.log(`   ${index + 1}. ${fk.from} → ${fk.table}.${fk.to} (${fk.on_delete})`);
            });
          }
        }
        
        // 作成完了後の全テーブル確認
        db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
          if (err) {
            console.error('❌ テーブル一覧取得エラー:', err.message);
          } else {
            console.log('\n📋 データベース内の全テーブル:');
            tables.forEach((table, index) => {
              console.log(`   ${index + 1}. ${table.name}`);
            });
          }
          
          // データベース接続を閉じる
          db.close((err) => {
            if (err) {
              console.error('❌ データベース接続終了エラー:', err.message);
            } else {
              console.log('\n🔒 データベース接続を終了しました');
              console.log('🎉 Phase3 Step1: Todoテーブル作成完了！');
            }
            process.exit(0);
          });
        });
      });
    });
  }
}); 