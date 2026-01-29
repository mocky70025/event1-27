-- チャット関連テーブルとカラムの削除スクリプト
-- SupabaseのSQL Editorで実行してください

-- ============================================
-- 1. chat_messagesテーブルのRLSポリシーを削除
-- ============================================
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- chat_messagesテーブルに関連するすべてのポリシーを削除
    FOR policy_record IN
        SELECT policyname, tablename
        FROM pg_policies
        WHERE tablename = 'chat_messages'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_record.policyname, policy_record.tablename);
        RAISE NOTICE '削除されたポリシー: % on %', policy_record.policyname, policy_record.tablename;
    END LOOP;
END $$;

-- ============================================
-- 2. chat_messagesテーブルを削除
-- ============================================
DROP TABLE IF EXISTS chat_messages CASCADE;

-- ============================================
-- 3. event_applicationsテーブルからchat_room_idカラムを削除
-- ============================================
DO $$
BEGIN
    -- カラムが存在する場合のみ削除
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'event_applications'
        AND column_name = 'chat_room_id'
    ) THEN
        ALTER TABLE event_applications DROP COLUMN chat_room_id;
        RAISE NOTICE 'chat_room_idカラムを削除しました';
    ELSE
        RAISE NOTICE 'chat_room_idカラムは存在しません';
    END IF;
END $$;

-- ============================================
-- 4. 削除結果の確認
-- ============================================
-- chat_messagesテーブルが存在しないことを確認
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.tables 
            WHERE table_name = 'chat_messages'
        ) THEN 'chat_messagesテーブルはまだ存在します'
        ELSE 'chat_messagesテーブルは削除されました'
    END AS chat_messages_status;

-- event_applicationsテーブルのカラム一覧を確認（chat_room_idが含まれていないことを確認）
SELECT 
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'event_applications'
ORDER BY ordinal_position;
