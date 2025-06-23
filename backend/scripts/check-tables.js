// データベーステーブル確認スクリプト
const db = require('../config/database');

console.log('📋 データベースのテーブル一覧を確認しています...');

// テーブル一覧を取得
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
  if (err) {
    console.error('❌ テーブル一覧取得エラー:', err.message);
    process.exit(1);
  } else {
    console.log('📊 存在するテーブル:');
    if (tables.length === 0) {
      console.log('   テーブルが存在しません');
    } else {
      tables.forEach((table, index) => {
        console.log(`   ${index + 1}. ${table.name}`);
      });
    }
    
    // usersテーブルが存在する場合、構造を表示
    const usersTable = tables.find(table => table.name === 'users');
    if (usersTable) {
      console.log('\n✅ usersテーブルが存在します');
      
      // テーブル構造の詳細確認
      db.all("PRAGMA table_info(users)", (err, columns) => {
        if (err) {
          console.error('❌ usersテーブル構造取得エラー:', err.message);
        } else {
          console.log('📋 usersテーブルの構造:');
          columns.forEach(col => {
            const nullable = col.notnull ? 'NOT NULL' : 'NULL';
            const defaultVal = col.dflt_value ? `DEFAULT ${col.dflt_value}` : '';
            const primaryKey = col.pk ? '(PRIMARY KEY)' : '';
            console.log(`   - ${col.name}: ${col.type} ${nullable} ${defaultVal} ${primaryKey}`);
          });
        }
        
        // データベース接続を閉じる
        db.close((err) => {
          if (err) {
            console.error('❌ データベース接続終了エラー:', err.message);
          } else {
            console.log('\n🔒 データベース接続を終了しました');
          }
          process.exit(0);
        });
      });
    } else {
      console.log('\n❌ usersテーブルが存在しません');
      
      // データベース接続を閉じる
      db.close((err) => {
        if (err) {
          console.error('❌ データベース接続終了エラー:', err.message);
        }
        process.exit(1);
      });
    }
  }
}); 