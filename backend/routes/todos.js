// Todo関連ルート定義
const express = require('express');
const TodoController = require('../controllers/todoController');
const { requireAuth, checkTodoOwnership } = require('../middleware/auth');

const router = express.Router();

// 全てのTodoルートで認証が必要
router.use(requireAuth);

// Todo CRUD API定義

// GET /api/todos - Todo一覧取得
router.get('/', TodoController.getAllTodos);

// POST /api/todos - Todo作成
router.post('/', TodoController.createTodo);

// GET /api/todos/:id - Todo詳細取得（認証・認可必須）
router.get('/:id', checkTodoOwnership, TodoController.getTodoById);

// PUT /api/todos/:id - Todo更新（認証・認可必須）
router.put('/:id', checkTodoOwnership, TodoController.updateTodo);

// DELETE /api/todos/:id - Todo削除（認証・認可必須）
router.delete('/:id', checkTodoOwnership, TodoController.deleteTodo);

// PATCH /api/todos/:id/toggle - Todo完了状態切り替え（認証・認可必須）
router.patch('/:id/toggle', checkTodoOwnership, TodoController.toggleTodoComplete);

module.exports = router; 