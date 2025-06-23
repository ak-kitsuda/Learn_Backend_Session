# セッション/クッキー認証 Todo 学習プロジェクト

## 概要

このプロジェクトは、初心者向けのバックエンド学習のための Web アプリケーションです。
セッション/クッキーベースの認証システムを実装し、JWT との違いを学習することを目的としています。

## 技術スタック

- **バックエンド**: Express.js + SQLite
- **フロントエンド**: Vue.js
- **認証方式**: セッション/クッキー

## 学習目標

- セッション/クッキー認証の仕組みを理解する
- JWT との違いを明確に把握する
- 実際の Todo アプリケーションを通して実践的に学習する

## プロジェクト構成

```
web-learn/
├── .cursor/
│   └── rules/                    # 学習ガイド
│       ├── overview.mdc          # プロジェクト概要
│       ├── phase1-guide.mdc      # Phase1: バックエンド基盤構築
│       └── project-management.mdc # 進行管理ルール
├── backend/                      # バックエンド（予定）
│   ├── src/
│   ├── database/
│   └── package.json
├── frontend/                     # フロントエンド（予定）
│   ├── src/
│   └── package.json
└── README.md
```

## 学習フェーズ

### Phase1: バックエンド基盤構築 【現在】

- Express.js サーバーセットアップ
- SQLite データベース接続
- 基本的なルーティング設定
- ミドルウェア設定

詳細: [Phase1 ガイド](.cursor/rules/phase1-guide.mdc)

### Phase2: 認証システム実装 【次】

- ユーザーモデル作成
- パスワードハッシュ化（bcrypt）
- セッション設定（express-session）
- セッションストア（SQLite）
- 認証ミドルウェア

### Phase3: Todo 機能実装

- Todo モデル作成
- CRUD API 実装
- 認可チェック（ユーザー所有権）
- エラーハンドリング

### Phase4: フロントエンド実装

- Vue.js プロジェクトセットアップ
- 認証コンポーネント
- Todo コンポーネント
- API 通信

### Phase5: セキュリティ・最適化

- CORS 設定
- セキュリティヘッダー
- バリデーション強化
- エラーメッセージ最適化

## 使用方法

### 開発環境セットアップ

```bash
# プロジェクトのクローン
git clone <repository-url>
cd web-learn

# バックエンドのセットアップ（Phase1完了後）
cd backend
npm install
npm run dev

# フロントエンドのセットアップ（Phase4完了後）
cd frontend
npm install
npm run serve
```

## 学習のポイント

- **段階的学習**: 各フェーズを確実に完了してから次に進む
- **理論と実践**: 「なぜ？」を理解してからコード作成
- **エラー体験**: 意図的にエラーを起こして学習
- **動作確認**: 各ステップで必ず動作確認

## 参考リンク

- [Express.js 公式ドキュメント](https://expressjs.com/)
- [SQLite 公式ドキュメント](https://sqlite.org/docs.html)
- [Vue.js 公式ドキュメント](https://vuejs.org/)

## ライセンス

このプロジェクトは学習目的で作成されています。

## 進捗状況

- [x] プロジェクト設計
- [x] 学習ガイド作成（Phase1）
- [ ] Phase1 実装
- [ ] Phase2 実装
- [ ] Phase3 実装
- [ ] Phase4 実装
- [ ] Phase5 実装
