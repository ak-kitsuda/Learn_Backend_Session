<template>
  <div class="todo-page">
    <!-- ヘッダー -->
    <header class="todo-header">
      <div class="header-content">
        <h1 class="app-title">📝 Todo App</h1>
        <div class="user-info">
          <span class="welcome-text">こんにちは！</span>
          <button @click="handleLogout" class="logout-button">
            🚪 ログアウト
          </button>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="todo-main">
      <div class="todo-container">
        <!-- Todo作成フォーム -->
        <div class="create-todo-section">
          <h2 class="section-title">✨ 新しいTodoを作成</h2>
          <form @submit.prevent="handleCreateTodo" class="create-form">
            <div class="form-row">
              <div class="form-group flex-1">
                <input
                  v-model="newTodo.title"
                  type="text"
                  class="form-input"
                  placeholder="Todoのタイトルを入力..."
                  required
                  :disabled="loading"
                />
              </div>
              <div class="form-group">
                <select
                  v-model="newTodo.priority"
                  class="form-select"
                  :disabled="loading"
                >
                  <option value="1">🟢 低</option>
                  <option value="2">🟡 中</option>
                  <option value="3">🔴 高</option>
                </select>
              </div>
              <button
                type="submit"
                class="create-button"
                :disabled="loading || !newTodo.title.trim()"
              >
                <span v-if="loading">🔄</span>
                <span v-else>➕</span>
              </button>
            </div>
            <div class="form-group">
              <textarea
                v-model="newTodo.description"
                class="form-textarea"
                placeholder="詳細な説明（任意）"
                rows="2"
                :disabled="loading"
              ></textarea>
            </div>
          </form>
        </div>

        <!-- エラーメッセージ -->
        <div v-if="errorMessage" class="error-message">
          ❌ {{ errorMessage }}
        </div>

        <!-- Todo統計 -->
        <div class="todo-stats">
          <div class="stat-item">
            <span class="stat-number">{{ todos.length }}</span>
            <span class="stat-label">総数</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ completedCount }}</span>
            <span class="stat-label">完了</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ pendingCount }}</span>
            <span class="stat-label">未完了</span>
          </div>
        </div>

        <!-- Todo一覧 -->
        <div class="todo-list-section">
          <h2 class="section-title">📋 Todo一覧</h2>
          
          <!-- ローディング表示 -->
          <div v-if="loading && todos.length === 0" class="loading-message">
            🔄 読み込み中...
          </div>

          <!-- Todo項目なし -->
          <div v-else-if="todos.length === 0" class="empty-message">
            <p>📝 まだTodoがありません</p>
            <p>上のフォームから新しいTodoを作成してみましょう！</p>
          </div>

          <!-- Todo項目一覧 -->
          <div v-else class="todo-list">
            <div
              v-for="todo in sortedTodos"
              :key="todo.id"
              class="todo-item"
              :class="{ 'completed': todo.completed }"
            >
              <!-- Todo内容 -->
              <div class="todo-content">
                <div class="todo-header-row">
                  <button
                    @click="toggleTodo(todo.id)"
                    class="toggle-button"
                    :disabled="loading"
                  >
                    <span v-if="todo.completed">✅</span>
                    <span v-else>⭕</span>
                  </button>
                  <h3 class="todo-title" :class="{ 'completed': todo.completed }">
                    {{ todo.title }}
                  </h3>
                  <div class="todo-priority">
                    <span v-if="todo.priority === 1">🟢</span>
                    <span v-else-if="todo.priority === 2">🟡</span>
                    <span v-else-if="todo.priority === 3">🔴</span>
                  </div>
                </div>
                <p v-if="todo.description" class="todo-description">
                  {{ todo.description }}
                </p>
                <div class="todo-meta">
                  <span class="todo-date">
                    作成: {{ formatDate(todo.created_at) }}
                  </span>
                  <span v-if="todo.updated_at !== todo.created_at" class="todo-date">
                    更新: {{ formatDate(todo.updated_at) }}
                  </span>
                </div>
              </div>

              <!-- Todo操作ボタン -->
              <div class="todo-actions">
                <button
                  @click="deleteTodo(todo.id)"
                  class="delete-button"
                  :disabled="loading"
                  title="削除"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { todoService } from '@/services/todo'
import { authService } from '@/services/auth'

// Vue Router
const router = useRouter()

// リアクティブデータ
const todos = ref([])
const newTodo = ref({
  title: '',
  description: '',
  priority: 2
})
const loading = ref(false)
const errorMessage = ref('')

// 算出プロパティ
const sortedTodos = computed(() => {
  return [...todos.value].sort((a, b) => {
    // 完了状態で並び替え（未完了が上）
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    // 優先度で並び替え（高い優先度が上）
    if (a.priority !== b.priority) {
      return b.priority - a.priority
    }
    // 作成日で並び替え（新しいものが上）
    return new Date(b.created_at) - new Date(a.created_at)
  })
})

const completedCount = computed(() => {
  return todos.value.filter(todo => todo.completed).length
})

const pendingCount = computed(() => {
  return todos.value.filter(todo => !todo.completed).length
})

// ライフサイクル
onMounted(async () => {
  await loadTodos()
})

// メソッド
const loadTodos = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const result = await todoService.getTodos()
    if (result.success) {
      todos.value = result.todos
    } else {
      errorMessage.value = result.error
    }
  } catch (error) {
    errorMessage.value = 'Todo一覧の読み込みに失敗しました'
    console.error('Todo読み込みエラー:', error)
  } finally {
    loading.value = false
  }
}

const handleCreateTodo = async () => {
  if (!newTodo.value.title.trim()) return

  loading.value = true
  errorMessage.value = ''

  try {
    const result = await todoService.createTodo({
      title: newTodo.value.title.trim(),
      description: newTodo.value.description.trim() || null,
      priority: parseInt(newTodo.value.priority)
    })

    if (result.success) {
      todos.value.unshift(result.todo)
      resetForm()
      console.log('✅ Todo作成成功:', result.todo)
    } else {
      errorMessage.value = result.error
    }
  } catch (error) {
    errorMessage.value = 'Todoの作成に失敗しました'
    console.error('Todo作成エラー:', error)
  } finally {
    loading.value = false
  }
}

const toggleTodo = async (todoId) => {
  loading.value = true

  try {
    const result = await todoService.toggleTodo(todoId)
    if (result.success) {
      const index = todos.value.findIndex(todo => todo.id === todoId)
      if (index !== -1) {
        todos.value[index] = result.todo
      }
      console.log('✅ Todo状態更新成功:', result.todo)
    } else {
      errorMessage.value = result.error
    }
  } catch (error) {
    errorMessage.value = 'Todo状態の更新に失敗しました'
    console.error('Todo更新エラー:', error)
  } finally {
    loading.value = false
  }
}

const deleteTodo = async (todoId) => {
  if (!confirm('このTodoを削除してもよろしいですか？')) {
    return
  }

  loading.value = true

  try {
    const result = await todoService.deleteTodo(todoId)
    if (result.success) {
      todos.value = todos.value.filter(todo => todo.id !== todoId)
      console.log('✅ Todo削除成功:', result.deletedId)
    } else {
      errorMessage.value = result.error
    }
  } catch (error) {
    errorMessage.value = 'Todoの削除に失敗しました'
    console.error('Todo削除エラー:', error)
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  if (!confirm('ログアウトしますか？')) {
    return
  }

  try {
    const result = await authService.logout()
    if (result.success) {
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('user')
      router.push('/login')
    } else {
      errorMessage.value = result.error
    }
  } catch (error) {
    console.error('ログアウトエラー:', error)
    // エラーでもローカル状態をクリア
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    router.push('/login')
  }
}

const resetForm = () => {
  newTodo.value = {
    title: '',
    description: '',
    priority: 2
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.todo-page {
  min-height: 100vh;
  background-color: #f7fafc;
}

.todo-header {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.welcome-text {
  color: #666;
  font-size: 0.9rem;
}

.logout-button {
  padding: 8px 16px;
  background-color: #e53e3e;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #c53030;
}

.todo-main {
  padding: 2rem 0;
}

.todo-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.create-todo-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 16px 0;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.flex-1 {
  flex: 1;
}

.form-input, .form-select, .form-textarea {
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-textarea {
  resize: vertical;
  min-height: 60px;
}

.create-button {
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: transform 0.2s ease;
}

.create-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.create-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  background-color: #fed7d7;
  color: #c53030;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.todo-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  justify-content: center;
}

.stat-item {
  background: white;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 80px;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.todo-list-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading-message, .empty-message {
  text-align: center;
  padding: 40px;
  color: #666;
}

.empty-message p {
  margin: 8px 0;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  transition: all 0.3s ease;
}

.todo-item.completed {
  opacity: 0.7;
  border-left-color: #48bb78;
}

.todo-content {
  flex: 1;
}

.todo-header-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.toggle-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.toggle-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.todo-title {
  flex: 1;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.todo-title.completed {
  text-decoration: line-through;
  color: #666;
}

.todo-priority {
  font-size: 1.2rem;
}

.todo-description {
  color: #666;
  margin: 8px 0;
  line-height: 1.5;
}

.todo-meta {
  display: flex;
  gap: 16px;
  font-size: 0.8rem;
  color: #999;
}

.todo-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.delete-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #fed7d7;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .form-row {
    flex-direction: column;
  }

  .todo-stats {
    flex-wrap: wrap;
  }

  .todo-item {
    flex-direction: column;
    align-items: stretch;
  }

  .todo-header-row {
    flex-wrap: wrap;
  }
}
</style> 