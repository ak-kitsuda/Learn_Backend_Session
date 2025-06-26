# セッション/クッキー認証 Todo 学習プロジェクト

## 概要

このプロジェクトは、初心者向けのバックエンド学習のための Web アプリケーションです。
セッション/クッキーベースの認証システムを実装し、JWT との違いを学習することを目的としています。

**📍 プロジェクト状況**: **✅ 完成！** セッション/クッキー認証 Todo アプリが完成しました

## 技術スタック

- **バックエンド**: Express.js + SQLite + express-session + bcrypt
- **フロントエンド**: Vue.js 3 (Composition API)
- **認証方式**: セッション/クッキー
- **開発環境**: Node.js + nodemon

## 学習目標

- セッション/クッキー認証の仕組みを理解する
- JWT との違いを明確に把握する
- 認証・認可システムの実装方法を習得する
- 実際の Todo アプリケーションを通して実践的に学習する
- フロントエンドとバックエンドの連携を理解する

## プロジェクト構成

```
web-learn/
├── .cursor/
│   └── rules/                    # 学習ガイド・ルール
│       ├── core-rules.mdc        # コアルール（常時適用）
│       ├── phase1-guide.mdc      # Phase1: バックエンド基盤構築 ✅
│       ├── phase2-guide.mdc      # Phase2: 認証システム実装 ✅
│       ├── phase3-guide.mdc      # Phase3: Todo機能実装 📍
│       ├── phase-step-management.mdc # ステップ管理ルール
│       ├── git-security-check.mdc     # セキュリティチェック
│       └── demo-code-guidelines.mdc  # デモコード管理
├── backend/                      # バックエンド ✅
│   ├── server.js                 # メインサーバー
│   ├── config/
│   │   └── database.js           # DB設定
│   ├── database/
│   │   ├── todo.db               # SQLite DB
│   │   └── sessions.db           # セッションストア
│   ├── scripts/
│   │   ├── create-users-table.js # ユーザーテーブル作成
│   │   └── check-tables.js       # テーブル確認
│   └── package.json
├── frontend/                     # フロントエンド ✅
│   ├── public/
│   ├── src/
│   │   ├── components/           # 再利用可能コンポーネント
│   │   ├── views/               # ページコンポーネント
│   │   ├── services/            # API通信サービス
│   │   ├── router/              # Vue Router設定
│   │   └── utils/               # ユーティリティ関数
│   └── package.json
└── README.md
```

## 学習フェーズ

### Phase1: バックエンド基盤構築 ✅ 完了

- ✅ Express.js サーバーセットアップ
- ✅ SQLite データベース接続
- ✅ 基本的なルーティング設定
- ✅ ミドルウェア設定（CORS、JSON 解析）

詳細: [Phase1 ガイド](.cursor/rules/phase1-guide.mdc)

### Phase2: 認証システム実装 ✅ 完了

- ✅ ユーザーテーブル作成（bcrypt 対応）
- ✅ パスワードハッシュ化（bcrypt + saltRounds: 10）
- ✅ セッション設定（express-session + SQLite store）
- ✅ 認証 API 実装（登録・ログイン・ログアウト・ユーザー情報取得）
- ✅ 認証ミドルウェア（requireAuth）

詳細: [Phase2 ガイド](.cursor/rules/phase2-guide.mdc)

### Phase3: Todo 機能実装 ✅ 完了

- ✅ Todo テーブル設計・作成
- ✅ Todo CRUD API 実装
- ✅ 認可システム実装（ユーザー所有権チェック）
- ✅ Vue.js フロントエンド基盤構築
- ✅ 認証状態管理（フロントエンド）
- ✅ レスポンシブデザイン実装
- ✅ 統合テスト・UI 改善

**実装された機能**:

- 認証されたユーザーのみ Todo 操作可能
- ユーザー別 Todo 管理（自分の Todo のみ表示・編集）
- 完全な CRUD 操作（作成・読取・更新・削除）
- RESTful API 設計
- フロントエンド・バックエンド連携
- リアルタイム UI 更新
- 優先度管理・期限設定
- レスポンシブデザイン（PC/タブレット/スマホ対応）

詳細: [Phase3 ガイド](.cursor/rules/phase3-guide.mdc)

## 🎯 プロジェクト完成！

**本プロジェクトは学習目標を達成し、完成しました！**

### 達成した学習目標 ✅

1. **セッション/クッキー認証の理解**: 完全に実装・理解完了
2. **認証・認可システムの習得**: 実際のアプリケーションで実践
3. **フルスタック開発体験**: バックエンド + フロントエンド連携
4. **セキュリティ意識の向上**: 入力検証・権限チェック・セッション管理
5. **実用的な Web アプリケーション**: 実際に使用可能な Todo アプリ完成

### 次のステップの提案

**JWT 認証との比較学習**を行いたい場合は、同じ Todo アプリを JWT で実装することで、
セッション認証との違いを具体的に体験できます。

## 使用方法

### 開発環境セットアップ

```bash
# プロジェクトのクローン
git clone <repository-url>
cd web-learn

# バックエンドの起動 ✅
cd backend
npm install
npm run dev    # または npm start

# バックエンドAPI確認
curl http://localhost:3000/api/hello
curl http://localhost:3000/api/db-test

# 認証API確認（Phase2完了）
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# フロントエンドの起動 ✅
cd frontend
npm install
npm run serve   # Vue CLI開発サーバー
```

### 🔧 実装された Todo 機能

**認証されたユーザーのみ利用可能な Todo API**:

```bash
# Todo一覧取得
curl -X GET http://localhost:3000/api/todos -b cookies.txt

# Todo作成
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"初めてのTodo","description":"Phase3の学習"}' \
  -b cookies.txt

# Todo更新
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"完了したTodo","completed":true}' \
  -b cookies.txt

# Todo削除
curl -X DELETE http://localhost:3000/api/todos/1 -b cookies.txt
```

## 学習のポイント

- **段階的学習**: 各フェーズを確実に完了してから次に進む
- **理論と実践**: 「なぜ？」を理解してからコード作成
- **エラー体験**: 意図的にエラーを起こして学習
- **動作確認**: 各ステップで必ず動作確認

### 🎯 習得できた技術・知識

1. **認証 vs 認可の理解**

   - 認証: 「あなたは誰ですか？」（ログイン）
   - 認可: 「あなたにこの操作の権限はありますか？」（所有者チェック）

2. **RESTful API 設計**

   - HTTP メソッドの適切な使い分け
   - ステータスコードの意味と使い分け
   - エンドポイントの命名規則

3. **データベース設計**

   - 外部キー制約の理解
   - リレーショナルデータベースの基本
   - データ整合性の保証

4. **セキュリティ意識**

   - ユーザー入力の検証
   - SQL インジェクション対策
   - 権限チェックの重要性

5. **フロントエンド・バックエンド連携**

   - API 通信の実装
   - 認証状態の管理
   - エラーハンドリング

6. **Vue.js 3 の実践的活用**
   - Composition API
   - Vue Router
   - コンポーネント設計

## 参考リンク

- [Express.js 公式ドキュメント](https://expressjs.com/)
- [SQLite 公式ドキュメント](https://sqlite.org/docs.html)
- [Vue.js 公式ドキュメント](https://vuejs.org/)

## ライセンス

このプロジェクトは学習目的で作成されています。

## 進捗状況

- [x] プロジェクト設計・学習ガイド作成
- [x] **Phase1**: バックエンド基盤構築完了
  - [x] Express.js サーバー構築
  - [x] SQLite データベース接続
  - [x] 基本的な API エンドポイント
- [x] **Phase2**: 認証システム実装完了
  - [x] ユーザーテーブル作成
  - [x] パスワードハッシュ化（bcrypt）
  - [x] セッション管理（express-session）
  - [x] 認証 API（登録・ログイン・ログアウト）
  - [x] 認証ミドルウェア
- [x] **Phase3**: Todo 機能実装 ✅ **完了**
  - [x] Todo テーブル設計・作成
  - [x] Todo CRUD API 実装
  - [x] 認可システム（所有者チェック）
  - [x] Vue.js フロントエンド基盤
  - [x] 認証状態管理
  - [x] レスポンシブデザイン
  - [x] 統合テスト・UI 改善

## 🎉 プロジェクト完成！

**セッション/クッキーベース認証の Todo アプリケーションが完成しました！**

---

## 📈 実装状況

**✅ 完成した機能**:

### バックエンド

- Express.js サーバー（ポート 3000）
- SQLite データベース連携
- ユーザー登録・ログインシステム
- セッション/クッキー認証
- bcrypt パスワードハッシュ化
- 認証 API（4 つのエンドポイント）
- Todo CRUD API（認証・認可付き）
- ユーザー別データ管理

### フロントエンド

- Vue.js 3 + Composition API
- Vue Router による SPA
- 認証状態管理
- レスポンシブデザイン
- リアルタイム UI 更新
- エラーハンドリング

### 統合機能

- 完全な Web アプリケーション
- セッションベース認証システム
- ユーザー専用 Todo 管理
- セキュアな API 通信
