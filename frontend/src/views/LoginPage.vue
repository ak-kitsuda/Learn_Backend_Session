<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <!-- ヘッダー -->
        <div class="login-header">
          <h1 class="login-title">📝 Todo App</h1>
          <p class="login-subtitle">ログインして始めましょう</p>
        </div>

        <!-- ログインフォーム -->
        <form @submit.prevent="handleLogin" class="login-form">
          <!-- ユーザー名入力 -->
          <div class="form-group">
            <label for="username" class="form-label">ユーザー名</label>
            <input
              id="username"
              v-model="loginForm.username"
              type="text"
              class="form-input"
              placeholder="ユーザー名を入力"
              required
              :disabled="loading"
            />
          </div>

          <!-- パスワード入力 -->
          <div class="form-group">
            <label for="password" class="form-label">パスワード</label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              class="form-input"
              placeholder="パスワードを入力"
              required
              :disabled="loading"
            />
          </div>

          <!-- エラーメッセージ -->
          <div v-if="errorMessage" class="error-message">
            ❌ {{ errorMessage }}
          </div>

          <!-- ログインボタン -->
          <button
            type="submit"
            class="login-button"
            :disabled="loading"
          >
            <span v-if="loading">🔄 ログイン中...</span>
            <span v-else>🚀 ログイン</span>
          </button>
        </form>

        <!-- 登録リンク -->
        <div class="register-link">
          <p>アカウントをお持ちでない方は</p>
          <router-link to="/register" class="register-button">
            ✨ 新規登録
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '@/services/auth'

// Vue Router
const router = useRouter()
const route = useRoute()

// リアクティブデータ
const loginForm = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// ログイン処理
const handleLogin = async () => {
  if (!loginForm.value.username.trim() || !loginForm.value.password.trim()) {
    errorMessage.value = 'ユーザー名とパスワードを入力してください'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const result = await authService.login({
      username: loginForm.value.username.trim(),
      password: loginForm.value.password.trim()
    })

    if (result.success) {
      // 認証状態とユーザー情報をローカルストレージに保存
      localStorage.setItem('isAuthenticated', 'true')
      if (result.user) {
        localStorage.setItem('user', JSON.stringify(result.user))
      }
      
      successMessage.value = 'ログインしました！Todo一覧ページに移動します...'
      
      setTimeout(() => {
        // リダイレクト先を確認
        const redirectPath = route.query.redirect || '/todos'
        // クエリパラメータをクリアするために replace を使用
        router.replace(redirectPath)
      }, 1500)
    } else {
      errorMessage.value = result.error
    }
  } catch (error) {
    errorMessage.value = 'ログインに失敗しました。しばらく経ってから再度お試しください。'
    console.error('ログインエラー:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  text-align: center;
}

.login-header {
  margin-bottom: 30px;
}

.login-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
}

.login-subtitle {
  color: #666;
  margin: 0;
  font-size: 1rem;
}

.login-form {
  text-align: left;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  background-color: #fee;
  color: #c53030;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.login-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
  margin-bottom: 20px;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.register-link {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e1e5e9;
}

.register-link p {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 0.9rem;
}

.register-button {
  display: inline-block;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.register-button:hover {
  background-color: #f7fafc;
}

/* レスポンシブ対応 */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }
  
  .login-title {
    font-size: 1.5rem;
  }
}
</style> 