# セッション/クッキー認証 Todo 学習プロジェクト

## 概要

このプロジェクトは、初心者向けのバックエンド学習のための Web アプリケーションです。
セッション/クッキーベースの認証システムを実装し、JWT との違いを学習することを目的としています。

**📍 現在の進捗**: Phase2 完了 → **Phase3 開始**

## 技術スタック

- **バックエンド**: Express.js + SQLite + express-session + bcrypt
- **フロントエンド**: Vue.js (Phase3 で実装予定)
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
├── frontend/                     # フロントエンド（Phase3で実装予定）
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   └── services/
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

### Phase3: Todo 機能実装 📍 現在

- **ステップ 1**: Todo テーブル設計・作成
- **ステップ 2**: Todo CRUD API 実装
- **ステップ 3**: 認可システム実装（ユーザー所有権チェック）
- **ステップ 4**: Vue.js フロントエンド基盤構築
- **ステップ 5**: 認証状態管理（フロントエンド）

**主な機能**:

- 認証されたユーザーのみ Todo 操作可能
- ユーザー別 Todo 管理（自分の Todo のみ表示・編集）
- 完全な CRUD 操作（作成・読取・更新・削除）
- RESTful API 設計
- フロントエンド・バックエンド連携

詳細: [Phase3 ガイド](.cursor/rules/phase3-guide.mdc)

### Phase4: UI/UX 改善・機能拡張

- レスポンシブデザイン実装
- Todo 検索・フィルタリング機能
- ファイルアップロード機能
- メール通知システム

### Phase5: セキュリティ・デプロイメント

- CSRF 対策強化
- Rate Limiting 実装
- Docker 化
- 本番環境デプロイ

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

# フロントエンドの起動（Phase3で実装予定）
cd frontend
npm install
npm run dev    # Vite開発サーバー
```

### 🔧 Phase3 での新機能

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

### 🎯 Phase3 での学習ポイント

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
- [ ] **Phase3**: Todo 機能実装 📍 **現在進行中**
  - [ ] Todo テーブル設計・作成
  - [ ] Todo CRUD API 実装
  - [ ] 認可システム（所有者チェック）
  - [ ] Vue.js フロントエンド基盤
  - [ ] 認証状態管理
- [ ] **Phase4**: UI/UX 改善・機能拡張
- [ ] **Phase5**: セキュリティ・デプロイメント

---

## 📈 実装状況

**✅ 完了した機能**:

- Express.js サーバー（ポート 3000）
- SQLite データベース連携
- ユーザー登録・ログインシステム
- セッション/クッキー認証
- bcrypt パスワードハッシュ化
- 認証 API（4 つのエンドポイント）

**🚀 Phase3 で実装予定**:

- Todo テーブルとリレーション
- 認証必須の Todo CRUD API
- ユーザー別データ管理
- Vue.js フロントエンド
- 完全な Web アプリケーション
