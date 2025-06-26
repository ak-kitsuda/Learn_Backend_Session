// Vue Router 4.x設定
import { createRouter, createWebHistory } from 'vue-router'

// ページコンポーネントのインポート
import LoginPage from '@/views/LoginPage.vue'
import TodoListPage from '@/views/TodoListPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'

// ルート定義
const routes = [
  {
    path: '/',
    redirect: '/todos'  // ルートパスはTodo一覧にリダイレクト
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { 
      requiresAuth: false,  // 認証不要
      title: 'ログイン'
    }
  },
  {
    path: '/register',
    name: 'Register', 
    component: RegisterPage,
    meta: { 
      requiresAuth: false,  // 認証不要
      title: 'ユーザー登録'
    }
  },
  {
    path: '/todos',
    name: 'TodoList',
    component: TodoListPage,
    meta: { 
      requiresAuth: true,   // 認証必要
      title: 'Todo一覧'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/todos'  // 存在しないパスはTodo一覧にリダイレクト
  }
]

// ルーターインスタンスの作成
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// ナビゲーションガード（ページ遷移前の認証チェック）
router.beforeEach(async (to, from, next) => {
  // ページタイトルの設定
  if (to.meta.title) {
    document.title = `${to.meta.title} - Todo App`
  }

  // 認証が必要なページかチェック
  if (to.meta.requiresAuth) {
    // 認証状態の確認（後でauthServiceと連携）
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    
    if (!isAuthenticated) {
      // 未認証の場合はログインページにリダイレクト
      next({
        name: 'Login',
        query: { redirect: to.fullPath }  // ログイン後の遷移先を保存
      })
      return
    }
  }

  // 認証済みユーザーがログイン/登録ページにアクセスした場合
  if ((to.name === 'Login' || to.name === 'Register')) {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    if (isAuthenticated) {
      next({ name: 'TodoList' })  // Todo一覧にリダイレクト
      return
    }
  }

  next()  // 通常の遷移を実行
})

export default router 