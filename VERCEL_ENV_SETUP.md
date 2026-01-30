# Vercel環境変数設定ガイド

Vercelにデプロイする際に必要な環境変数の設定方法です。

## 必須環境変数

### すべてのアプリ（store, organizer, admin）に共通

1. **`NEXT_PUBLIC_SUPABASE_URL`**
   - SupabaseプロジェクトのURL
   - 例: `https://xxxxx.supabase.co`

2. **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**
   - Supabaseの匿名キー（anon public key）
   - Supabase Dashboard → Project Settings → API から取得

3. **`NEXT_PUBLIC_APP_URL`** ⚠️ **重要**
   - VercelにデプロイしたアプリのURL
   - 例: `https://your-app-name.vercel.app`
   - またはカスタムドメイン: `https://yourdomain.com`
   - **この変数がないと、認証のリダイレクトが正しく動作しません**

### organizerアプリのみ

4. **`ADMIN_EMAILS`** (オプション)
   - 管理者のメールアドレス（カンマ区切り）
   - 例: `admin@example.com,admin2@example.com`

5. **`NEXT_PUBLIC_ADMIN_EMAILS`** (オプション)
   - クライアントサイドで使用する管理者メールアドレス
   - 通常は`ADMIN_EMAILS`と同じ値

### LINE Loginを使用する場合（store, organizer）

6. **`LINE_CHANNEL_ID`**
   - LINE Developers Consoleで取得したChannel ID

7. **`LINE_CHANNEL_SECRET`**
   - LINE Developers Consoleで取得したChannel Secret

## Vercelでの設定手順

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. プロジェクトを選択
3. 「Settings」タブ → 「Environment Variables」を選択
4. 各環境変数を追加：
   - **Key**: 環境変数名（例: `NEXT_PUBLIC_APP_URL`）
   - **Value**: 値（例: `https://your-app-name.vercel.app`）
   - **Environment**: 適用環境を選択（Production, Preview, Development）
5. 「Save」をクリック
6. **再デプロイを実行**（重要）

## SupabaseのリダイレクトURL設定

Vercelにデプロイした後、Supabaseの認証設定でリダイレクトURLを追加する必要があります。

1. [Supabase Dashboard](https://app.supabase.com) にアクセス
2. プロジェクトを選択
3. 「Authentication」→ 「URL Configuration」を開く
4. 「Redirect URLs」に以下を追加：
   - `https://your-app-name.vercel.app/auth/callback`
   - `https://your-app-name.vercel.app/**`（ワイルドカード）
5. 「Site URL」もVercelのURLに変更：
   - `https://your-app-name.vercel.app`

## 確認事項

- [ ] すべての必須環境変数が設定されている
- [ ] `NEXT_PUBLIC_APP_URL`が正しいVercelのURLに設定されている
- [ ] SupabaseのリダイレクトURLにVercelのURLが追加されている
- [ ] 再デプロイが完了している

## トラブルシューティング

### 認証が動作しない場合

1. **`NEXT_PUBLIC_APP_URL`が設定されているか確認**
   - Vercel Dashboard → Settings → Environment Variables で確認
   - 値が正しいVercelのURLになっているか確認

2. **SupabaseのリダイレクトURLを確認**
   - Supabase Dashboard → Authentication → URL Configuration
   - VercelのURLが追加されているか確認

3. **環境変数の適用環境を確認**
   - Production環境にデプロイしている場合は、Production環境に環境変数が設定されているか確認

4. **再デプロイを実行**
   - 環境変数を追加・変更した後は、必ず再デプロイが必要です

### ビルドエラーが発生する場合

- 環境変数が正しく設定されているか確認
- `.env.local`ファイルがGitにコミットされていないか確認（`.gitignore`に追加されているはず）
