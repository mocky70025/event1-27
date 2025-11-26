-- adminアプリがeventsテーブルを更新できるようにするRLSポリシーの確認と修正
-- SupabaseのSQL Editorで実行してください

-- eventsテーブルのRLSポリシーを確認
-- 現在のポリシーを確認
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'events';

-- UPDATEポリシーが正しく設定されているか確認
-- もし問題があれば、以下のポリシーを再作成

-- UPDATEポリシーを削除して再作成
DROP POLICY IF EXISTS "Allow public update on events" ON events;

CREATE POLICY "Allow public update on events" ON events
    FOR UPDATE 
    USING (true)
    WITH CHECK (true);

-- SELECTポリシーも確認（UPDATE後の確認用）
DROP POLICY IF EXISTS "Allow public select on events" ON events;

CREATE POLICY "Allow public select on events" ON events
    FOR SELECT 
    USING (true);

