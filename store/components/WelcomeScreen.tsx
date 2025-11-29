'use client'

import { useState } from 'react'
import { getLineLoginUrl } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

type AuthMode = 'initial' | 'login' | 'register'
type LoginMethod = 'line' | 'email' | 'google'
type RegisterMethod = 'line' | 'email' | 'google'

// LINEアイコン（SVG）
const LineIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#FFFFFF"/>
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.127-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.63.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.058.9-.031.18-.099.495-.131.644-.039.18-.186.22-.43.13-1.155-.48-6.007-2.74-8.324-4.744C.907 16.884 0 13.653 0 10.314 0 4.943 5.385.572 12 .572s12 4.371 12 9.742" fill="#06C755"/>
  </svg>
)

// Googleアイコン（SVG）
const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

// メールアイコン（SVG）- 白背景用
const MailIcon = ({ color = '#FFFFFF' }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill={color}/>
  </svg>
)

export default function WelcomeScreen() {
  const [authMode, setAuthMode] = useState<AuthMode>('initial')
  const [loginMethod, setLoginMethod] = useState<LoginMethod | null>(null)
  const [registerMethod, setRegisterMethod] = useState<RegisterMethod | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  

  const handleLineLogin = () => {
    try {
      console.log('[WelcomeScreen] LINE Login button clicked')
      const loginUrl = getLineLoginUrl()
      console.log('[WelcomeScreen] LINE Login URL generated, redirecting to:', loginUrl.replace(/state=[^&]+/, 'state=***'))
      window.location.href = loginUrl
    } catch (error) {
      console.error('[WelcomeScreen] Error in handleLineLogin:', error)
      setError('LINEログインのURL生成に失敗しました。もう一度お試しください。')
    }
  }

  const handleGoogleLogin = async () => {
    try {
      console.log('[WelcomeScreen] Google Login button clicked')
      setLoading(true)
      setError('')

      const appUrl = (process.env.NEXT_PUBLIC_APP_URL || window.location.origin).replace(/\/$/, '')
      const redirectUrl = `${appUrl}/auth/callback`

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      })

      if (error) {
        console.error('[WelcomeScreen] Google Login error:', error)
        setError('Googleログインに失敗しました。もう一度お試しください。')
        setLoading(false)
      } else if (data.url) {
        // リダイレクトURLに遷移
        window.location.href = data.url
      }
    } catch (error) {
      console.error('[WelcomeScreen] Error in handleGoogleLogin:', error)
      setError('GoogleログインのURL生成に失敗しました。もう一度お試しください。')
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // セッションストレージに保存（既存のLINE Loginと同じ形式）
        sessionStorage.setItem('auth_type', 'email')
        sessionStorage.setItem('user_id', data.user.id)
        sessionStorage.setItem('user_email', data.user.email || '')
        
        // ページをリロードして認証状態を反映
        window.location.reload()
      }
    } catch (err: any) {
      console.error('Email login error:', err)
      setError(err.message || 'ログインに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (registerPassword !== registerPasswordConfirm) {
      setError('パスワードが一致しません')
      setLoading(false)
      return
    }

    if (registerPassword.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      setLoading(false)
      return
    }

    try {
      // メール確認用のリダイレクトURLを設定
      const appUrl = (process.env.NEXT_PUBLIC_APP_URL || window.location.origin).replace(/\/$/, '') // 末尾のスラッシュを削除
      const redirectUrl = `${appUrl}/auth/verify-email`
      console.log('[WelcomeScreen] Email registration - redirectUrl:', redirectUrl)
      console.log('[WelcomeScreen] Email registration - window.location.origin:', window.location.origin)
      console.log('[WelcomeScreen] Email registration - NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL)
      console.log('[WelcomeScreen] Email registration - email:', registerEmail)
      
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          emailRedirectTo: redirectUrl
        }
      })

      console.log('[WelcomeScreen] SignUp response:', {
        hasUser: !!data.user,
        userId: data.user?.id,
        email: data.user?.email,
        emailConfirmed: !!data.user?.email_confirmed_at,
        hasSession: !!data.session,
        error: error ? {
          message: error.message,
          status: error.status,
          name: error.name
        } : null
      })
      
      // メール送信の状態を確認
      if (data.user && !data.session) {
        console.log('[WelcomeScreen] ⚠️ Email confirmation required but no session - email should be sent')
        console.log('[WelcomeScreen] Check Supabase Dashboard > Authentication > Users to verify user creation')
        console.log('[WelcomeScreen] Check Supabase Dashboard > Authentication > Settings > Enable email confirmations')
      } else if (data.user && data.session) {
        console.log('[WelcomeScreen] ⚠️ Session exists - email confirmation may be disabled')
        console.log('[WelcomeScreen] Check Supabase Dashboard > Authentication > Settings > Enable email confirmations')
      }

      if (error) {
        console.error('[WelcomeScreen] SignUp error details:', {
          message: error.message,
          status: error.status,
          name: error.name,
          stack: error.stack
        })
        
        // 既存のメールアドレスの場合のエラーハンドリング
        if (error.message?.includes('already registered') || error.message?.includes('already exists') || error.status === 422) {
          setError('このメールアドレスは既に登録されています。ログイン画面からログインしてください。')
          setLoading(false)
          return
        }
        
        throw error
      }

      if (data.user) {
        console.log('[WelcomeScreen] User created successfully:', {
          id: data.user.id,
          email: data.user.email,
          emailConfirmed: !!data.user.email_confirmed_at,
          hasSession: !!data.session,
          createdAt: data.user.created_at
        })
        
        // セッションが存在する場合（メール確認が無効）、すぐに登録フォームに進める
        // セッションが存在しない場合（メール確認が必要）、メール確認待ち画面を表示
        if (data.session) {
          console.log('[WelcomeScreen] Session exists - email confirmation disabled, proceeding to registration')
          // セッションストレージに保存
          sessionStorage.setItem('auth_type', 'email')
          sessionStorage.setItem('user_id', data.user.id)
          sessionStorage.setItem('user_email', data.user.email || '')
          sessionStorage.setItem('email_confirmed', 'true') // メール確認が無効なのでtrueとして扱う
          
          // ページをリロードして認証状態を反映
          window.location.reload()
          return
        }
        
        // メール確認が必要な場合（data.sessionが存在しない）
        console.log('[WelcomeScreen] Email confirmation required - no session, showing email confirmation pending screen')
        
        // セッションをクリア（メール確認が必要な場合）
        await supabase.auth.signOut()
        
        // user_idを保存（メール確認後に使用するため）
        sessionStorage.setItem('auth_type', 'email')
        sessionStorage.setItem('user_id', data.user.id)
        sessionStorage.setItem('user_email', data.user.email || '')
        sessionStorage.setItem('email_confirmed', 'false') // メール確認が必要なのでfalse
        
        // メール確認待ち画面を表示するため、ページをリロード
        setError('')
        window.location.reload()
      } else {
        console.error('[WelcomeScreen] SignUp succeeded but no user data returned')
        setError('ユーザー登録に失敗しました。もう一度お試しください。')
      }
    } catch (err: any) {
      console.error('[WelcomeScreen] Email register error:', {
        message: err.message,
        status: err.status,
        name: err.name,
        stack: err.stack
      })
      
      // 既存のメールアドレスの場合のエラーハンドリング
      if (err.message?.includes('already registered') || err.message?.includes('already exists') || err.status === 422) {
        setError('このメールアドレスは既に登録されています。ログイン画面からログインしてください。')
      } else {
        setError(err.message || '登録に失敗しました')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      position: 'relative',
      width: '100%',
      maxWidth: '393px',
      minHeight: '852px',
      margin: '0 auto',
      background: '#FFFFFF'
    }}>
      {/* タイトル */}
      <div style={{
        position: 'absolute',
        width: '333px',
        height: '96px',
        left: '30px',
        top: '32px',
        fontFamily: "'Noto Sans JP', sans-serif",
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: '24px',
        lineHeight: '48px',
        textAlign: 'center',
        color: '#000000'
      }}>
        キッチンカー・屋台の<br />イベントを探すなら
      </div>

      {/* ロゴプレースホルダー */}
      <div style={{
        position: 'absolute',
        width: '256px',
        height: '256px',
        left: '69px',
        top: '160px',
        background: '#D9D9D9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          fontFamily: "'Noto Sans JP', sans-serif",
          fontStyle: 'normal',
          fontWeight: 700,
          fontSize: '32px',
          lineHeight: '48px',
          textAlign: 'center',
          color: '#000000'
        }}>
          将来的にロゴ
        </div>
      </div>

      {/* 初期画面：ログイン or 新規登録を選択 */}
      {authMode === 'initial' && (
        <>
          {/* ログインセクション */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '0px',
            left: '69px',
            top: '469px',
            border: '1px solid #000000'
          }} />
          <div style={{
            position: 'absolute',
            width: '72px',
            height: '16px',
            left: '161px',
            top: '461px',
            background: '#FFFFFF'
          }} />
          <div style={{
            position: 'absolute',
            width: '72px',
            height: '24px',
            left: '161px',
            top: '457px',
            fontFamily: "'Noto Sans JP', sans-serif",
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            color: '#000000'
          }}>
            ログイン
          </div>

          {/* LINEログインボタン */}
          <button
            onClick={handleLineLogin}
            disabled={loading}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px 24px',
              gap: '10px',
              position: 'absolute',
              width: '288px',
              height: '48px',
              left: '53px',
              top: '497px',
              background: '#06C755',
              borderRadius: '8px',
              border: 'none',
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              textAlign: 'center',
              color: '#FFFFFF',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            <LineIcon />
            <span>LINE</span>
          </button>

          {/* Googleログインボタン */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px 24px',
              gap: '10px',
              position: 'absolute',
              width: '288px',
              height: '48px',
              left: '53px',
              top: '561px',
              background: '#06C755',
              borderRadius: '8px',
              border: 'none',
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              textAlign: 'center',
              color: '#FFFFFF',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            <GoogleIcon />
            <span>Google</span>
          </button>

          {/* メールアドレスログインボタン */}
          <button
            onClick={() => setLoginMethod('email')}
            disabled={loading}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px 24px',
              gap: '10px',
              position: 'absolute',
              width: '288px',
              height: '48px',
              left: '53px',
              top: '625px',
              background: '#06C755',
              borderRadius: '8px',
              border: 'none',
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              textAlign: 'center',
              color: '#FFFFFF',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            <MailIcon />
            <span>メールアドレス</span>
          </button>

          {/* またはセパレーター */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '0px',
            left: '69px',
            top: '697px',
            border: '1px solid #000000'
          }} />
          <div style={{
            position: 'absolute',
            width: '64px',
            height: '16px',
            left: '165px',
            top: '689px',
            background: '#FFFFFF'
          }} />
          <div style={{
            position: 'absolute',
            width: '64px',
            height: '24px',
            left: '165px',
            top: '685px',
            fontFamily: "'Noto Sans JP', sans-serif",
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            color: '#000000'
          }}>
            または
          </div>

          {/* 新規登録ボタン */}
          <button
            onClick={() => setAuthMode('register')}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px 24px',
              gap: '10px',
              position: 'absolute',
              width: '288px',
              height: '48px',
              left: '53px',
              top: '725px',
              background: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: '8px',
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              textAlign: 'center',
              color: '#000000',
              cursor: 'pointer'
            }}
          >
            新規登録
          </button>
        </>
      )}

        {/* ログイン方法選択 */}
        {authMode === 'login' && !loginMethod && (
          <div style={{
            background: '#FFFFFF',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                lineHeight: '120%',
                color: '#000000'
              }}>
                ログイン
              </h2>
              <button
                onClick={() => {
                  setAuthMode('initial')
                  setLoginMethod(null)
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  color: '#06C755',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* LINEでログイン */}
              <button
                onClick={handleLineLogin}
                disabled={loading}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '16px 24px',
                  gap: '10px',
                  width: '100%',
                  height: '48px',
                  background: '#06C755',
                  borderRadius: '8px',
                  border: 'none',
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: '24px',
                  color: '#FFFFFF',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                <LineIcon />
                <span>LINEでログイン</span>
              </button>
              
              {/* Googleでログイン */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '16px 24px',
                  gap: '10px',
                  width: '100%',
                  height: '48px',
                  background: '#06C755',
                  borderRadius: '8px',
                  border: 'none',
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: '24px',
                  color: '#FFFFFF',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                <GoogleIcon />
                <span>{loading ? '読み込み中...' : 'Googleでログイン'}</span>
              </button>
              
              {/* メールアドレスでログイン */}
              {(
                <button
                  onClick={() => setLoginMethod('email')}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '16px 24px',
                    gap: '10px',
                    width: '100%',
                    height: '48px',
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E5E5E5',
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: '24px',
                    color: '#000000',
                    cursor: 'pointer'
                  }}
                >
                  <MailIcon color="#000000" />
                  <span>メールアドレスでログイン</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* メールアドレスでログイン */}
        {authMode === 'login' && loginMethod === 'email' && (
          <div style={{
            background: '#FFFFFF',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                lineHeight: '120%',
                color: '#000000'
              }}>
                メールアドレスでログイン
              </h2>
              <button
                onClick={() => {
                  setLoginMethod(null)
                  setError('')
                  setEmail('')
                  setPassword('')
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  color: '#06C755',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            {error && (
              <div style={{
                padding: '12px',
                background: '#FFEBEE',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: '#C62828'
                }}>
                  {error}
                </p>
              </div>
            )}
            <form onSubmit={handleEmailLogin}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '120%',
                  color: '#000000',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="your@example.com"
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '120%',
                  color: '#000000',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  パスワード
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="パスワードを入力"
                />
              </div>
              <div style={{ marginBottom: '24px', textAlign: 'right' }}>
                <a
                  href="/auth/reset-password"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    color: '#06C755',
                    textDecoration: 'none'
                  }}
                >
                  パスワードを忘れた場合
                </a>
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  background: loading ? '#CCCCCC' : '#06C755',
                  borderRadius: '8px',
                  border: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'ログイン中...' : 'ログイン'}
              </button>
            </form>
          </div>
        )}

        {/* 新規登録方法選択 */}
        {authMode === 'register' && !registerMethod && (
          <div style={{
            background: '#FFFFFF',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                lineHeight: '120%',
                color: '#000000'
              }}>
                新規登録
              </h2>
              <button
                onClick={() => {
                  setAuthMode('initial')
                  setRegisterMethod(null)
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  color: '#06C755',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* LINEで新規登録 */}
              <button
                onClick={handleLineLogin}
                disabled={loading}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '16px 24px',
                  gap: '10px',
                  width: '100%',
                  height: '48px',
                  background: '#06C755',
                  borderRadius: '8px',
                  border: 'none',
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: '24px',
                  color: '#FFFFFF',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                <LineIcon />
                <span>LINEで新規登録</span>
              </button>
              
              {/* Googleで新規登録 */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '16px 24px',
                  gap: '10px',
                  width: '100%',
                  height: '48px',
                  background: '#06C755',
                  borderRadius: '8px',
                  border: 'none',
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: '24px',
                  color: '#FFFFFF',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                <GoogleIcon />
                <span>{loading ? '読み込み中...' : 'Googleで新規登録'}</span>
              </button>
              
              {/* メールアドレスで新規登録 */}
              {(
                <button
                  onClick={() => setRegisterMethod('email')}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '16px 24px',
                    gap: '10px',
                    width: '100%',
                    height: '48px',
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E5E5E5',
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: '24px',
                    color: '#000000',
                    cursor: 'pointer'
                  }}
                >
                  <MailIcon color="#000000" />
                  <span>メールアドレスで新規登録</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* メールアドレスで新規登録 */}
        {authMode === 'register' && registerMethod === 'email' && (
          <div style={{
            background: '#FFFFFF',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                lineHeight: '120%',
                color: '#000000'
              }}>
                新規登録
              </h2>
              <button
                onClick={() => {
                  setRegisterMethod(null)
                  setError('')
                  setRegisterEmail('')
                  setRegisterPassword('')
                  setRegisterPasswordConfirm('')
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  color: '#06C755',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            {error && (
              <div style={{
                padding: '12px',
                background: '#FFEBEE',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: '#C62828'
                }}>
                  {error}
                </p>
              </div>
            )}
            <form onSubmit={handleEmailRegister}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '120%',
                  color: '#000000',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="your@example.com"
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '120%',
                  color: '#000000',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  パスワード（6文字以上）
                </label>
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="パスワードを入力"
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '120%',
                  color: '#000000',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  パスワード（確認）
                </label>
                <input
                  type="password"
                  value={registerPasswordConfirm}
                  onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="パスワードを再入力"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  background: loading ? '#CCCCCC' : '#06C755',
                  borderRadius: '8px',
                  border: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '登録中...' : '登録する'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
