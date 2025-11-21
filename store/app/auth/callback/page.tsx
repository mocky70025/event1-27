'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getLineLoginCode, exchangeLineLoginCode } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // URLパラメータから認証コードを取得
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')
        
        if (error) {
          setErrorMessage(`認証エラー: ${error}`)
          setStatus('error')
          return
        }
        
        if (!code || !state) {
          setErrorMessage('認証コードが取得できませんでした')
          setStatus('error')
          return
        }
        
        // stateの検証（モード情報を含む）
        const savedState = sessionStorage.getItem('line_login_state')
        const savedMode = sessionStorage.getItem('line_login_mode') || 'login'
        
        // stateからモードを抽出（format: "mode_randomstring"）
        const stateMode = state.startsWith('login_') ? 'login' : state.startsWith('register_') ? 'register' : 'login'
        const stateRandom = state.replace(/^(login|register)_/, '')
        const savedStateRandom = savedState ? savedState.replace(/^(login|register)_/, '') : ''
        
        if (savedStateRandom !== stateRandom) {
          setErrorMessage('セキュリティ検証に失敗しました')
          setStatus('error')
          return
        }
        
        sessionStorage.removeItem('line_login_state')
        sessionStorage.removeItem('line_login_mode')
        
        // 認証コードをユーザー情報に交換
        const profile = await exchangeLineLoginCode(code)
        
        if (!profile) {
          setErrorMessage('ユーザー情報の取得に失敗しました')
          setStatus('error')
          return
        }
        
        // デバッグログ
        console.log('[LINE Login] User ID:', profile.userId)
        console.log('[LINE Login] Display Name:', profile.displayName)
        console.log('[LINE Login] App Type: store')
        console.log('[LINE Login] Mode:', savedMode)
        
        // store側の処理
        // 既存ユーザーかチェック
        const { data: existingUser } = await supabase
          .from('exhibitors')
          .select('*')
          .eq('line_user_id', profile.userId)
          .single()
        
        // セッションストレージにプロフィール情報を保存
        sessionStorage.setItem('line_profile', JSON.stringify(profile))
        
        // 新規登録モードの場合、既存ユーザーでも登録フォームを表示する
        // ただし、既に登録済みの場合は、登録フォームではなくホーム画面を表示
        if (savedMode === 'register' && !existingUser) {
          // 新規登録モードで、まだ登録していない場合
          sessionStorage.setItem('is_registered', 'false')
          console.log('[Callback] Register mode - new user, show registration form')
        } else if (savedMode === 'register' && existingUser) {
          // 新規登録モードだが、既に登録済みの場合
          sessionStorage.setItem('is_registered', 'true')
          console.log('[Callback] Register mode - existing user, show home')
        } else {
          // ログインモードの場合
          sessionStorage.setItem('is_registered', existingUser ? 'true' : 'false')
          console.log('[Callback] Login mode - is registered:', existingUser ? 'true' : 'false')
        }
        
        console.log('[Callback] Profile saved to sessionStorage:', profile)
        console.log('[Callback] Is registered:', sessionStorage.getItem('is_registered'))
        
        setStatus('success')
        
        // メインページにリダイレクト
        setTimeout(() => {
          console.log('[Callback] Redirecting to home page...')
          router.push('/')
        }, 1000)
      } catch (error) {
        console.error('Auth callback error:', error)
        setErrorMessage('認証処理中にエラーが発生しました')
        setStatus('error')
      }
    }
    
    handleCallback()
  }, [searchParams, router])

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  if (status === 'error') {
    return (
      <div style={{ background: '#F7F7F7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '24px' }}>
          <h1 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '20px',
            fontWeight: 700,
            color: '#000000',
            marginBottom: '16px'
          }}>
            認証エラー
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            color: '#666666',
            marginBottom: '24px'
          }}>
            {errorMessage}
          </p>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '12px 24px',
              background: '#06C755',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            トップに戻る
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#F7F7F7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid #E5E5E5',
          borderTopColor: '#06C755',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '16px',
          lineHeight: '150%',
          color: '#666666'
        }}>認証完了しました</p>
      </div>
    </div>
  )
}


