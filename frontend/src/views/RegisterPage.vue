<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-card">
        <!-- ヘッダー -->
        <div class="register-header">
          <h1 class="register-title">✨ 新規登録</h1>
          <p class="register-subtitle">Todo Appを始めましょう</p>
        </div>

        <!-- 登録フォーム -->
        <form @submit.prevent="handleRegister" class="register-form">
          <!-- ユーザー名入力 -->
          <div class="form-group">
            <label for="username" class="form-label">ユーザー名</label>
            <input
              id="username"
              v-model="registerForm.username"
              type="text"
              class="form-input"
              placeholder="ユーザー名を入力（3文字以上）"
              required
              :disabled="loading"
            />
          </div>

          <!-- メールアドレス入力 -->
          <div class="form-group">
            <label for="email" class="form-label">メールアドレス</label>
            <input
              id="email"
              v-model="registerForm.email"
              type="email"
              class="form-input"
              placeholder="メールアドレスを入力"
              required
              :disabled="loading"
            />
          </div>

          <!-- パスワード入力 -->
          <div class="form-group">
            <label for="password" class="form-label">パスワード</label>
            <input
              id="password"
              v-model="registerForm.password"
              type="password"
              class="form-input"
              placeholder="パスワードを入力（6文字以上）"
              required
              :disabled="loading"
            />
          </div>

          <!-- パスワード確認入力 -->
          <div class="form-group">
            <label for="confirmPassword" class="form-label">パスワード確認</label>
            <input
              id="confirmPassword"
              v-model="registerForm.confirmPassword"
              type="password"
              class="form-input"
              placeholder="パスワードを再入力"
              required
              :disabled="loading"
            />
          </div>

          <!-- エラーメッセージ -->
          <div v-if="errorMessage" class="error-message">
            ❌ {{ errorMessage }}
          </div>

          <!-- 成功メッセージ -->
          <div v-if="successMessage" class="success-message">
            ✅ {{ successMessage }}
          </div>

          <!-- 登録ボタン -->
          <button
            type="submit"
            class="register-button"
            :disabled="loading"
          >
            <span v-if="loading">🔄 登録中...</span>
            <span v-else>✨ 新規登録</span>
          </button>
        </form>

        <!-- ログインリンク -->
        <div class="login-link">
          <p>既にアカウントをお持ちの方は</p>
          <router-link to="/login" class="login-button">
            🚀 ログイン
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth'

// Vue Router
const router = useRouter()

// リアクティブデータ
const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// 登録処理
const handleRegister = async () => {
  // バリデーション
  if (!registerForm.value.username.trim()) {
    errorMessage.value = 'ユーザー名を入力してください'
    return
  }
  
  if (registerForm.value.username.trim().length < 3) {
    errorMessage.value = 'ユーザー名は3文字以上で入力してください'
    return
  }

  if (!registerForm.value.email.trim()) {
    errorMessage.value = 'メールアドレスを入力してください'
    return
  }

  // メールアドレスの形式チェック
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(registerForm.value.email.trim())) {
    errorMessage.value = '有効なメールアドレスを入力してください'
    return
  }

  if (!registerForm.value.password.trim()) {
    errorMessage.value = 'パスワードを入力してください'
    return
  }
  
  if (registerForm.value.password.length < 6) {
    errorMessage.value = 'パスワードは6文字以上で入力してください'
    return
  }

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    errorMessage.value = 'パスワードが一致しません'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const result = await authService.register({
      username: registerForm.value.username.trim(),
      email: registerForm.value.email.trim(),
      password: registerForm.value.password
    })

    if (result.success) {
      // 認証状態とユーザー情報をローカルストレージに保存
      localStorage.setItem('isAuthenticated', 'true')
      if (result.user) {
        localStorage.setItem('user', JSON.stringify(result.user))
      }
      
      successMessage.value = 'ユーザー登録が完了しました！Todo一覧ページに移動します...'
      
      setTimeout(() => {
        router.replace('/todos')
      }, 2000)
    } else {
      errorMessage.value = result.error
    }
  } catch (error) {
    errorMessage.value = 'ユーザー登録に失敗しました。しばらく経ってから再度お試しください。'
    console.error('登録エラー:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 400px;
}

.register-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  text-align: center;
}

.register-header {
  margin-bottom: 30px;
}

.register-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
}

.register-subtitle {
  color: #666;
  margin: 0;
  font-size: 1rem;
}

.register-form {
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

.success-message {
  background-color: #f0fff4;
  color: #38a169;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.register-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
  margin-bottom: 20px;
}

.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.register-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.login-link {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e1e5e9;
}

.login-link p {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 0.9rem;
}

.login-button {
  display: inline-block;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #f7fafc;
}

/* レスポンシブ対応 */
@media (max-width: 480px) {
  .register-card {
    padding: 30px 20px;
  }
  
  .register-title {
    font-size: 1.5rem;
  }
}
</style> 