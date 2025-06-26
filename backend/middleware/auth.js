// 認証関連ミドルウェア
const db = require('../config/database');

// 認証チェックミドルウェア
const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: '認証が必要です' });
  }
};

// Todo所有者チェックミドルウェア（認可）
const checkTodoOwnership = async (req, res, next) => {
  try {
    const todoId = req.params.id;
    const userId = req.session.userId;
    
    db.get(
      'SELECT user_id FROM todos WHERE id = ?',
      [todoId],
      (err, todo) => {
        if (err) {
          console.error('認可チェックエラー:', err);
          return res.status(500).json({ error: 'サーバーエラーが発生しました' });
        }
        
        if (!todo) {
          return res.status(404).json({ error: 'Todoが見つかりません' });
        }
        
        if (todo.user_id !== userId) {
          return res.status(403).json({ 
            error: 'このTodoにアクセスする権限がありません' 
          });
        }
        
        // 認可OK、次の処理へ
        next();
      }
    );
  } catch (error) {
    console.error('認可チェックエラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};

module.exports = {
  requireAuth,
  checkTodoOwnership
}; 