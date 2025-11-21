# Vercel環境変数設定手順（詳細版）

## 概要

4つのVercelプロジェクトを順番に作成し、環境変数を正確に設定します。

---

## プロジェクト1: store-web（出店者アプリ - Web環境）

### ステップ1: プロジェクト作成

1. Vercel Dashboard（https://vercel.com/dashboard）にアクセス
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリ `tomorrow-event-platform` を選択（または検索）
4. プロジェクト設定画面で以下を設定：
   - **Project Name**: `tomorrow-store-web`
   - **Root Directory**: `store` を選択（ドロップダウンから選択）
   - **Framework Preset**: `Next.js`（自動検出されるはず）
   - **Build Command**: `npm run build`（自動検出）
   - **Output Directory**: `.next`（自動検出）
   - **Install Command**: `npm install`（自動検出）

5. 「Deploy」をクリック（この時点では環境変数は設定しません）

### ステップ2: 初回デプロイ完了を待つ

1. デプロイが完了するまで待機（1-2分）
2. デプロイ完了後、生成されたURLを確認
   - 例: `https://tomorrow-store-web-xxxxx.vercel.app`
   - または: `https://tomorrow-store-web.vercel.app`（カスタムドメインの場合）

### ステップ3: 環境変数を設定

1. プロジェクトの「Settings」タブをクリック
2. 左メニューから「Environment Variables」を選択
3. 以下の環境変数を1つずつ追加：

#### 環境変数1: NEXT_PUBLIC_SUPABASE_URL
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://xszkbfwqtwpsfnwdfjak.supabase.co`
- **Environment**: すべての環境（Production, Preview, Development）にチェック
- 「Add」をクリック

#### 環境変数2: NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzemtiZndxdHdwc2Zud2RmamFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODQ4MTUsImV4cCI6MjA3ODk2MDgxNX0.cwNetSFLWu4A8VY7-B6MjriD-8KI9L4NXIE1rxvf95Q`
- **Environment**: すべての環境（Production, Preview, Development）にチェック
- 「Add」をクリック

#### 環境変数3: NEXT_PUBLIC_APP_URL
- **Key**: `NEXT_PUBLIC_APP_URL`
- **Value**: ステップ2で確認した実際のURL（例: `https://tomorrow-store-web.vercel.app`）
- **Environment**: すべての環境（Production, Preview, Development）にチェック
- 「Add」をクリック

### ステップ4: 再デプロイ

1. 「Deployments」タブに戻る
2. 最新のデプロイメントの右側にある「...」メニューをクリック
3. 「Redeploy」を選択
4. 「Redeploy」をクリックして再デプロイを実行

### ステップ5: 動作確認

1. デプロイ完了後、URLにアクセス
2. メール認証のログイン/新規登録が表示されることを確認
3. LINE認証のボタンが表示されないことを確認

---

## プロジェクト2: store-liff（出店者アプリ - LIFF環境）

### ステップ1: プロジェクト作成

1. Vercel Dashboardにアクセス
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリ `tomorrow-event-platform` を選択
4. プロジェクト設定画面で以下を設定：
   - **Project Name**: `tomorrow-store-liff`
   - **Root Directory**: `store` を選択
   - **Framework Preset**: `Next.js`（自動検出）
   - **Build Command**: `npm run build`（自動検出）
   - **Output Directory**: `.next`（自動検出）
   - **Install Command**: `npm install`（自動検出）

5. 「Deploy」をクリック

### ステップ2: 初回デプロイ完了を待つ

1. デプロイが完了するまで待機
2. 生成されたURLを確認
   - 例: `https://tomorrow-store-liff-xxxxx.vercel.app`

### ステップ3: 環境変数を設定

1. プロジェクトの「Settings」タブをクリック
2. 「Environment Variables」を選択
3. 以下の環境変数を追加：

#### 環境変数1: NEXT_PUBLIC_SUPABASE_URL
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://xszkbfwqtwpsfnwdfjak.supabase.co`
- **Environment**: すべての環境にチェック
- 「Add」をクリック

#### 環境変数2: NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzemtiZndxdHdwc2Zud2RmamFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODQ4MTUsImV4cCI6MjA3ODk2MDgxNX0.cwNetSFLWu4A8VY7-B6MjriD-8KI9L4NXIE1rxvf95Q`
- **Environment**: すべての環境にチェック
- 「Add」をクリック

#### 環境変数3: NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID
- **Key**: `NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID`
- **Value**: `2008516155`（出店者用のLINE LoginチャネルID）
- **Environment**: すべての環境にチェック
- 「Add」をクリック

#### 環境変数4: LINE_LOGIN_CHANNEL_SECRET
- **Key**: `LINE_LOGIN_CHANNEL_SECRET`
- **Value**: `4b6ca4be9c0ae7e856bb4db72c777876`（出店者用のLINE Loginチャネルシークレット）
- **Environment**: すべての環境にチェック
- **注意**: この変数は `NEXT_PUBLIC_` プレフィックスがないため、サーバーサイドでのみ使用されます
- 「Add」をクリック

#### 環境変数5: NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI
- **Key**: `NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI`
- **Value**: ステップ2で確認したURL + `/auth/callback`（例: `https://tomorrow-store-liff.vercel.app/auth/callback`）
- **Environment**: すべての環境にチェック
- 「Add」をクリック

#### 環境変数6: NEXT_PUBLIC_APP_URL
- **Key**: `NEXT_PUBLIC_APP_URL`
- **Value**: ステップ2で確認した実際のURL（例: `https://tomorrow-store-liff.vercel.app`）
- **Environment**: すべての環境にチェック
- 「Add」をクリック

### ステップ4: LINE Developers Console設定

1. LINE Developers Console（https://developers.line.biz/console/）にアクセス
2. 出店者用のLINE Loginチャネル（チャネルID: `2008516155`）を選択
3. 「LINE Login」タブをクリック
4. 「Callback URL」セクションで以下を追加：
   ```
   https://tomorrow-store-liff.vercel.app/auth/callback
   ```
   （実際のURLに置き換えてください）
5. 「Update」をクリック
6. 「LIFF」タブをクリック
7. 既存のLIFFアプリを編集するか、新規作成：
   - **LIFF app name**: `出店者アプリ`
   - **Size**: `Full`
   - **Endpoint URL**: `https://tomorrow-store-liff.vercel.app`（実際のURL）
   - **Scope**: `profile openid email` にチェック
8. 「Save」をクリック

### ステップ5: 再デプロイ

1. Vercel Dashboardに戻る
2. 「Deployments」タブを選択
3. 最新のデプロイメントを「Redeploy」

### ステップ6: 動作確認

1. LINE Developers ConsoleでLIFFアプリのURLをコピー
2. LINEアプリでURLを開く
3. LINE認証のログイン/新規登録が表示されることを確認
4. メール認証のボタンが表示されないことを確認

---

## プロジェクト3: organizer-web（主催者アプリ - Web環境）

### ステップ1: プロジェクト作成

1. Vercel Dashboardにアクセス
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリ `tomorrow-event-platform` を選択
4. プロジェクト設定画面で以下を設定：
   - **Project Name**: `tomorrow-organizer-web`
   - **Root Directory**: `organizer` を選択
   - **Framework Preset**: `Next.js`（自動検出）
   - **Build Command**: `npm run build`（自動検出）
   - **Output Directory**: `.next`（自動検出）
   - **Install Command**: `npm install`（自動検出）

5. 「Deploy」をクリック

### ステップ2: 初回デプロイ完了を待つ

1. デプロイが完了するまで待機
2. 生成されたURLを確認
   - 例: `https://tomorrow-organizer-web-xxxxx.vercel.app`

### ステップ3: 環境変数を設定

1. プロジェクトの「Settings」タブをクリック
2. 「Environment Variables」を選択
3. 以下の環境変数を追加：

#### 環境変数1: NEXT_PUBLIC_SUPABASE_URL
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://xszkbfwqtwpsfnwdfjak.supabase.co`
- **Environment**: すべての環境にチェック
- 「Add」をクリック

#### 環境変数2: NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzemtiZndxdHdwc2Zud2RmamFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODQ4MTUsImV4cCI6MjA3ODk2MDgxNX0.cwNetSFLWu4A8VY7-B6MjriD-8KI9L4NXIE1rxvf95Q`
- **Environment**: すべての環境にチェック
- 「Add」をクリック

#### 環境変数3: NEXT_PUBLIC_APP_URL
- **Key**: `NEXT_PUBLIC_APP_URL`
- **Value**: ステップ2で確認した実際のURL（例: `https://tomorrow-organizer-web.vercel.app`）
- **Environment**: すべての環境にチェック
- 「Add」をクリック

### ステップ4: 再デプロイ

1. 「Deployments」タブに戻る
2. 最新のデプロイメントを「Redeploy」

### ステップ5: 動作確認

1. デプロイ完了後、URLにアクセス
2. メール認証のログイン/新規登録が表示されることを確認
3. LINE認証のボタンが表示されないことを確認

---

## プロジェクト4: admin（運営管理ダッシュボード）

### ステップ1: プロジェクト作成

1. Vercel Dashboardにアクセス
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリ `tomorrow-event-platform` を選択
4. プロジェクト設定画面で以下を設定：
   - **Project Name**: `tomorrow-admin`
   - **Root Directory**: `admin` を選択
   - **Framework Preset**: `Next.js`（自動検出）
   - **Build Command**: `npm run build`（自動検出）
   - **Output Directory**: `.next`（自動検出）
   - **Install Command**: `npm install`（自動検出）

5. 「Deploy」をクリック

### ステップ2: 初回デプロイ完了を待つ

1. デプロイが完了するまで待機
2. 生成されたURLを確認
   - 例: `https://tomorrow-admin-xxxxx.vercel.app`

### ステップ3: 環境変数を設定

1. プロジェクトの「Settings」タブをクリック
2. 「Environment Variables」を選択
3. 以下の環境変数を追加：

#### 環境変数1: NEXT_PUBLIC_SUPABASE_URL
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://xszkbfwqtwpsfnwdfjak.supabase.co`
- **Environment**: すべての環境にチェック
- 「Add」をクリック

#### 環境変数2: NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzemtiZndxdHdwc2Zud2RmamFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODQ4MTUsImV4cCI6MjA3ODk2MDgxNX0.cwNetSFLWu4A8VY7-B6MjriD-8KI9L4NXIE1rxvf95Q`
- **Environment**: すべての環境にチェック
- 「Add」をクリック

#### 環境変数3: NEXT_PUBLIC_APP_URL
- **Key**: `NEXT_PUBLIC_APP_URL`
- **Value**: ステップ2で確認した実際のURL（例: `https://tomorrow-admin.vercel.app`）
- **Environment**: すべての環境にチェック
- 「Add」をクリック

### ステップ4: 再デプロイ

1. 「Deployments」タブに戻る
2. 最新のデプロイメントを「Redeploy」

### ステップ5: 動作確認

1. デプロイ完了後、URLにアクセス
2. 運営管理ダッシュボードが表示されることを確認
3. 主催者とイベントの一覧が表示されることを確認

---

## 環境変数の確認方法

### Vercel Dashboardで確認

1. 各プロジェクトの「Settings」→「Environment Variables」を開く
2. 設定した環境変数がすべて表示されていることを確認

### ビルドログで確認

1. 「Deployments」タブを開く
2. 最新のデプロイメントをクリック
3. 「Build Logs」を確認
4. 環境変数が正しく読み込まれているか確認（エラーがないことを確認）

---

## トラブルシューティング

### 環境変数が反映されない場合

1. **再デプロイを実行**: 環境変数を追加/変更した後は必ず再デプロイが必要
2. **環境の確認**: 環境変数の「Environment」で「Production」「Preview」「Development」すべてにチェックが入っているか確認
3. **スペルミスの確認**: 環境変数のキー名が正確か確認（大文字小文字も含む）

### URLが正しく設定されていない場合

1. **実際のURLを確認**: Vercel Dashboardの「Settings」→「Domains」で実際のURLを確認
2. **環境変数を更新**: `NEXT_PUBLIC_APP_URL` と `NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI` を実際のURLに更新
3. **再デプロイ**: 更新後、必ず再デプロイを実行

### LINE Loginが動作しない場合（store-liff）

1. **Callback URLの確認**: LINE Developers ConsoleのCallback URLが正しく設定されているか確認
2. **環境変数の確認**: `NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI` がCallback URLと一致しているか確認
3. **チャネルID/シークレットの確認**: 環境変数の `NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID` と `LINE_LOGIN_CHANNEL_SECRET` が正しいか確認

---

## まとめ

4つのプロジェクトの環境変数設定を完了しました：

1. **store-web**: Supabase設定 + `NEXT_PUBLIC_APP_URL`
2. **store-liff**: Supabase設定 + LINE Login設定 + `NEXT_PUBLIC_APP_URL`
3. **organizer-web**: Supabase設定 + `NEXT_PUBLIC_APP_URL`
4. **admin**: Supabase設定 + `NEXT_PUBLIC_APP_URL`

各プロジェクトの環境変数を設定後、必ず再デプロイを実行してください。

