// Todoデータベース操作モデル
const db = require('../config/database');

class TodoModel {
  // ユーザーのTodo一覧取得
  static getAllByUserId(userId, callback) {
    const query = `
      SELECT id, title, description, completed, priority, due_date, created_at, updated_at 
      FROM todos 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `;
    
    db.all(query, [userId], callback);
  }

  // 特定のTodo取得
  static getById(todoId, callback) {
    const query = `
      SELECT id, user_id, title, description, completed, priority, due_date, created_at, updated_at 
      FROM todos 
      WHERE id = ?
    `;
    
    db.get(query, [todoId], callback);
  }

  // Todo作成
  static create(todoData, callback) {
    const { user_id, title, description, priority = 1, due_date } = todoData;
    
    const query = `
      INSERT INTO todos (user_id, title, description, priority, due_date) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    db.run(query, [user_id, title, description, priority, due_date], function(err) {
      if (err) {
        return callback(err, null);
      }
      
      // 作成されたTodoを取得して返す
      TodoModel.getById(this.lastID, callback);
    });
  }

  // Todo更新
  static update(todoId, updateData, callback) {
    const { title, description, completed, priority, due_date } = updateData;
    
    const query = `
      UPDATE todos 
      SET title = ?, description = ?, completed = ?, priority = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.run(query, [title, description, completed, priority, due_date, todoId], function(err) {
      if (err) {
        return callback(err, null);
      }
      
      // 更新されたTodoを取得して返す
      TodoModel.getById(todoId, callback);
    });
  }

  // Todo削除
  static delete(todoId, callback) {
    const query = 'DELETE FROM todos WHERE id = ?';
    
    db.run(query, [todoId], function(err) {
      callback(err, { deletedId: todoId, changes: this.changes });
    });
  }

  // Todo完了状態の切り替え
  static toggleComplete(todoId, callback) {
    const query = `
      UPDATE todos 
      SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.run(query, [todoId], function(err) {
      if (err) {
        return callback(err, null);
      }
      
      // 更新されたTodoを取得して返す
      TodoModel.getById(todoId, callback);
    });
  }
}

module.exports = TodoModel; 