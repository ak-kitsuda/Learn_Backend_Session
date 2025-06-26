// API通信サービス
import axios from 'axios';

// Axiosインスタンスの作成
const api = axios.create({
  baseURL: 'http://localhost:3000/api',  // バックエンドAPIのベースURL
  timeout: 10000,                       // 10秒でタイムアウト
  withCredentials: true                 // セッションクッキーを含める
});

// リクエストインターセプター（送信前の処理）
api.interceptors.request.use(
  config => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// レスポンスインターセプター（受信後の処理）
api.interceptors.response.use(
  response => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('❌ Response Error:', error.response?.status, error.response?.data);
    
    // 認証エラーの場合はログインページにリダイレクト
    if (error.response?.status === 401) {
      // ここでVue Routerによるリダイレクトを実装（後で追加）
      console.warn('🔐 認証が必要です');
    }
    
    return Promise.reject(error);
  }
);

export default api; 