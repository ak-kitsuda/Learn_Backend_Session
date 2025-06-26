// 認証サービス
import api from './api';

export const authService = {
  // ログイン
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      return {
        success: true,
        data: response.data,
        user: response.data.user
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'ログインに失敗しました'
      };
    }
  },

  // ログアウト
  async logout() {
    try {
      const response = await api.post('/auth/logout');
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'ログアウトに失敗しました'
      };
    }
  },

  // ユーザー登録
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return {
        success: true,
        data: response.data,
        user: response.data.user
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'ユーザー登録に失敗しました'
      };
    }
  },

  // 認証状態確認
  async checkAuth() {
    try {
      const response = await api.get('/auth/me');
      return {
        success: true,
        user: response.data.user,
        authenticated: true
      };
    } catch (error) {
      return {
        success: false,
        authenticated: false,
        error: error.response?.data?.error
      };
    }
  }
}; 