# Vercelデプロイ手順書

このプロジェクトは3つの独立したNext.jsアプリケーション（`store`、`organizer`、`admin`）で構成されています。それぞれを別々のVercelプロジェクトとしてデプロイします。

## 前提条件

- Vercelアカウントを持っていること
- GitHub/GitLab/Bitbucketにリポジトリをプッシュ済みであること
- Supabaseプロジェクトが本番環境で利用可能であること

## デプロイ手順

### 1. Storeアプリ（出店者向け）のデプロイ

1. [Vercel Dashboard](https://vercel.com/dashboard)にログイン
2. 「Add New...」→「Project」を選択
3. リポジトリを選択（またはインポート）
4. プロジェクト設定：
   - **Framework Preset**: Next.js
   - **Root Directory**: `store`
   - **Build Command**: `npm run build`（自動検出されるはず）
   - **Output Directory**: `.next`（自動検出されるはず）
   - **Install Command**: `npm install`

5. 環境変数を設定：
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   LINE_CHANNEL_ID=your_line_channel_id
   LINE_CHANNEL_SECRET=your_line_channel_secret
   OPENAIAPI=your_openai_api_key
   ```

6. 「Deploy」をクリック

### 2. Organizerアプリ（主催者向け）のデプロイ

1. 再度「Add New...」→「Project」を選択
2. 同じリポジトリを選択
3. プロジェクト設定：
   - **Framework Preset**: Next.js
   - **Root Directory**: `organizer`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. 環境変数を設定：
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   LINE_CHANNEL_ID=your_line_channel_id
   LINE_CHANNEL_SECRET=your_line_channel_secret
   ```

5. 「Deploy」をクリック

### 3. Adminアプリ（管理者向け）のデプロイ

1. 再度「Add New...」→「Project」を選択
2. 同じリポジトリを選択
3. プロジェクト設定：
   - **Framework Preset**: Next.js
   - **Root Directory**: `admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. 環境変数を設定：
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

5. 「Deploy」をクリック

## デプロイ後の設定（重要）

リダイレクトURLの設定が必要な外部サービスは以下の3つです：

1. **Supabase** - 認証のリダイレクトURL
2. **LINE Developers** - LINEログインのコールバックURL
3. **Google Cloud Console** - Google OAuthのリダイレクトURL（Supabase経由）

### 1. Supabase認証リダイレクトURLの設定

各アプリのデプロイが完了したら、Supabaseの認証設定でリダイレクトURLを追加する必要があります。

1. [Supabase Dashboard](https://app.supabase.com/)にログイン
2. プロジェクトを選択
3. 左側メニュー → **「Authentication」** → **「URL Configuration」**

4. **「Site URL」**を設定：
   - 最も一般的なアプリ（通常は**Storeアプリ**）のURLを設定
   - 例: `https://your-store-app.vercel.app`
   - このURLは、メール確認やパスワードリセットなどのデフォルトのリダイレクト先として使用されます

5. **「Redirect URLs」**セクションに以下を追加：
   ```
   https://your-store-app.vercel.app/auth/callback
   https://your-organizer-app.vercel.app/auth/callback
   https://your-store-app.vercel.app/*
   https://your-organizer-app.vercel.app/*
   ```
   （`your-store-app`と`your-organizer-app`は実際のVercelのプロジェクト名に置き換えてください）
   
   **注意**: ワイルドカード（`*`）を使用することで、各アプリ内の任意のパスへのリダイレクトを許可できます。本番環境では、セキュリティのため具体的なパスを指定することも推奨されます。

6. **「保存」**をクリック

### 2. LINE DevelopersのコールバックURL設定

LINEログインを使用している場合、LINE Developersの設定でコールバックURLを追加する必要があります。

**重要**: 開発環境用の`localhost`のURLが設定されている場合は、本番環境用のURLに**追加**するか、**置き換え**してください。

1. [LINE Developers Console](https://developers.line.biz/console/)にログイン
2. 各チャネル（Store用、Organizer用）を選択
3. **「LINE Login」**タブ → **「LINE Login設定」**
4. **「コールバックURL」**を確認・更新：
   - **既存のlocalhostのURLを削除または残す**（開発環境で使用する場合）
   - **以下を追加**：
     - Store用チャネル:
       ```
       https://your-store-app.vercel.app/api/auth/line/callback
       ```
     - Organizer用チャネル:
       ```
       https://your-organizer-app.vercel.app/api/auth/line/callback
       ```
   - **注意**: 複数のコールバックURLを設定できます。開発環境と本番環境の両方を使用する場合は、両方を追加してください。
5. **「更新」**をクリック

### 3. Google OAuth設定（使用している場合）

Googleログインを使用している場合、Google Cloud ConsoleでリダイレクトURLを設定する必要があります。

**重要**: Google OAuthのリダイレクトURLはSupabase経由なので、SupabaseのURLを設定します。`localhost`のURLは不要です。

1. [Google Cloud Console](https://console.cloud.google.com/)にログイン
2. プロジェクトを選択
3. **「APIとサービス」** → **「認証情報」**
4. OAuth 2.0 クライアント IDを選択
5. **「承認済みのリダイレクト URI」**を確認：
   - 既にSupabaseのURLが設定されている場合は変更不要
   - 設定されていない場合は以下を追加：
     ```
     https://your-supabase-project.supabase.co/auth/v1/callback
     ```
   - **注意**: `localhost`のURLは開発環境でのみ使用する場合は残しておいても問題ありませんが、本番環境ではSupabaseのURLのみで動作します。

## デプロイ後の確認事項

### 1. ビルドエラーの確認
各デプロイのログを確認し、ビルドエラーがないか確認してください。

### 2. 環境変数の確認
Vercelのプロジェクト設定 → Environment Variables で、すべての環境変数が正しく設定されているか確認してください。

### 3. 動作確認
各アプリのURLにアクセスして、以下を確認：
- ✅ ログインページが表示される
- ✅ Supabase認証が動作する（Googleログイン、メール/パスワードログイン）
- ✅ LINEログインが動作する（設定した場合）
- ✅ データの取得・表示が正常に動作する

### 4. カスタムドメインの設定（オプション）
必要に応じて、各アプリにカスタムドメインを設定できます：
- Store: `store.yourdomain.com`
- Organizer: `organizer.yourdomain.com`
- Admin: `admin.yourdomain.com`

**注意**: カスタムドメインを設定した場合は、上記のリダイレクトURLもカスタムドメインに更新してください。

## トラブルシューティング

### ビルドエラーが発生する場合

1. **環境変数が設定されていない**
   - Vercelのプロジェクト設定で環境変数を確認
   - `.env.local`の内容をVercelの環境変数にコピー

2. **TypeScriptエラー**
   - ローカルで`npm run build`を実行してエラーを確認
   - エラーを修正してから再デプロイ

3. **依存関係のエラー**
   - `package.json`の依存関係を確認
   - `package-lock.json`をコミットしているか確認

### 本番環境で動作しない場合

1. **SupabaseのRLSポリシー**
   - 本番環境のSupabaseでRLSポリシーが正しく設定されているか確認
   - `supabase/add_*.sql`ファイルを実行してポリシーを適用

2. **認証リダイレクトURL**
   - Supabaseの認証設定で、VercelのURLをリダイレクトURLに追加しているか確認
   - 例: `https://your-store-app.vercel.app/auth/callback`
   - 設定後、ブラウザのキャッシュをクリアして再試行

3. **LINEログインが動作しない**
   - LINE DevelopersのコールバックURLが正しく設定されているか確認
   - チャネルIDとシークレットが正しく設定されているか確認
   - Vercelの環境変数`LINE_CHANNEL_ID`と`LINE_CHANNEL_SECRET`を確認

4. **CORS設定**
   - Supabaseの設定で、VercelのURLを許可リストに追加

## 注意事項

⚠️ **セキュリティ**
- `SUPABASE_SERVICE_ROLE_KEY`は機密情報です。GitHubにコミットしないでください
- 環境変数はVercelのダッシュボードで管理し、`.env.local`は`.gitignore`に含まれていることを確認

⚠️ **本番環境のSupabase**
- 本番環境では、開発環境とは別のSupabaseプロジェクトを使用することを推奨
- データベースのマイグレーション（`supabase/schema.sql`など）を本番環境に適用

## 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-to-prod)
