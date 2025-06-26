// Todoコントローラー - ビジネスロジック処理
const TodoModel = require('../models/todoModel');

// バリデーション関数
const validateTodoInput = (data) => {
  const errors = [];
  
  if (!data.title || data.title.trim().length === 0) {
    errors.push('タイトルは必須です');
  }
  
  if (data.title && data.title.length > 100) {
    errors.push('タイトルは100文字以内で入力してください');
  }
  
  if (data.description && data.description.length > 500) {
    errors.push('説明は500文字以内で入力してください');
  }
  
  if (data.priority && ![1, 2, 3].includes(Number(data.priority))) {
    errors.push('優先度は1（低）、2（中）、3（高）のいずれかを指定してください');
  }
  
  return errors;
};

class TodoController {
  // Todo一覧取得
  static getAllTodos(req, res) {
    const userId = req.session.userId;
    
    TodoModel.getAllByUserId(userId, (err, todos) => {
      if (err) {
        console.error('Todo一覧取得エラー:', err);
        return res.status(500).json({ error: 'サーバーエラーが発生しました' });
      }
      
      res.json({ 
        message: 'Todo一覧取得成功',
        todos: todos || [],
        count: todos ? todos.length : 0
      });
    });
  }

  // Todo詳細取得
  static getTodoById(req, res) {
    const todoId = req.params.id;
    
    TodoModel.getById(todoId, (err, todo) => {
      if (err) {
        console.error('Todo取得エラー:', err);
        return res.status(500).json({ error: 'サーバーエラーが発生しました' });
      }
      
      if (!todo) {
        return res.status(404).json({ error: 'Todoが見つかりません' });
      }
      
      res.json({ 
        message: 'Todo取得成功',
        todo 
      });
    });
  }

  // Todo作成
  static createTodo(req, res) {
    const userId = req.session.userId;
    const { title, description, priority, due_date } = req.body;
    
    // バリデーション
    const errors = validateTodoInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'バリデーションエラー',
        details: errors 
      });
    }
    
    const todoData = {
      user_id: userId,
      title: title.trim(),
      description: description ? description.trim() : null,
      priority: Number(priority) || 1,
      due_date: due_date || null
    };
    
    TodoModel.create(todoData, (err, todo) => {
      if (err) {
        console.error('Todo作成エラー:', err);
        return res.status(500).json({ error: 'Todo作成に失敗しました' });
      }
      
      res.status(201).json({ 
        message: 'Todo作成成功',
        todo 
      });
    });
  }

  // Todo更新
  static updateTodo(req, res) {
    const todoId = req.params.id;
    const { title, description, completed, priority, due_date } = req.body;
    
    // バリデーション
    const errors = validateTodoInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'バリデーションエラー',
        details: errors 
      });
    }
    
    const updateData = {
      title: title.trim(),
      description: description ? description.trim() : null,
      completed: completed !== undefined ? Boolean(completed) : false,
      priority: Number(priority) || 1,
      due_date: due_date || null
    };
    
    TodoModel.update(todoId, updateData, (err, todo) => {
      if (err) {
        console.error('Todo更新エラー:', err);
        return res.status(500).json({ error: 'Todo更新に失敗しました' });
      }
      
      res.json({ 
        message: 'Todo更新成功',
        todo 
      });
    });
  }

  // Todo削除
  static deleteTodo(req, res) {
    const todoId = req.params.id;
    
    TodoModel.delete(todoId, (err, result) => {
      if (err) {
        console.error('Todo削除エラー:', err);
        return res.status(500).json({ error: 'Todo削除に失敗しました' });
      }
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Todoが見つかりません' });
      }
      
      res.json({ 
        message: 'Todo削除成功',
        deletedId: result.deletedId
      });
    });
  }

  // Todo完了状態切り替え
  static toggleTodoComplete(req, res) {
    const todoId = req.params.id;
    
    TodoModel.toggleComplete(todoId, (err, todo) => {
      if (err) {
        console.error('Todo完了状態切り替えエラー:', err);
        return res.status(500).json({ error: '完了状態の切り替えに失敗しました' });
      }
      
      res.json({ 
        message: 'Todo完了状態切り替え成功',
        todo 
      });
    });
  }
}

module.exports = TodoController; 