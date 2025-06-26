// Todoサービス
import api from './api';

export const todoService = {
  // Todo一覧取得
  async getTodos() {
    try {
      const response = await api.get('/todos');
      return {
        success: true,
        todos: response.data.todos || [],
        count: response.data.count || 0
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Todo一覧の取得に失敗しました'
      };
    }
  },

  // Todo詳細取得
  async getTodo(id) {
    try {
      const response = await api.get(`/todos/${id}`);
      return {
        success: true,
        todo: response.data.todo
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Todoの取得に失敗しました'
      };
    }
  },

  // Todo作成
  async createTodo(todoData) {
    try {
      const response = await api.post('/todos', todoData);
      return {
        success: true,
        todo: response.data.todo,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Todoの作成に失敗しました',
        details: error.response?.data?.details
      };
    }
  },

  // Todo更新
  async updateTodo(id, todoData) {
    try {
      const response = await api.put(`/todos/${id}`, todoData);
      return {
        success: true,
        todo: response.data.todo,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Todoの更新に失敗しました',
        details: error.response?.data?.details
      };
    }
  },

  // Todo削除
  async deleteTodo(id) {
    try {
      const response = await api.delete(`/todos/${id}`);
      return {
        success: true,
        message: response.data.message,
        deletedId: response.data.deletedId
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Todoの削除に失敗しました'
      };
    }
  },

  // Todo完了状態切り替え
  async toggleTodo(id) {
    try {
      const response = await api.patch(`/todos/${id}/toggle`);
      return {
        success: true,
        todo: response.data.todo,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || '完了状態の切り替えに失敗しました'
      };
    }
  }
}; 