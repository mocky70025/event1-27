'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type AuthMode = 'initial' | 'login' | 'register'
type LoginMethod = 'line' | 'email' | 'google'
type RegisterMethod = 'line' | 'email' | 'google'

// Googleアイコン（SVG）
const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

// メールアイコン（SVG）- 黒背景用
const MailIcon = ({ color = '#000000' }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill={color}/>
  </svg>
)

// Facebookアイコン（SVG）
const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="white"/>
  </svg>
)

// Twitterアイコン（SVG）
const TwitterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" fill="white"/>
  </svg>
)

export default function WelcomeScreen() {
  const [authMode, setAuthMode] = useState<AuthMode>('register') // デフォルトを新規登録に
  const [loginMethod, setLoginMethod] = useState<LoginMethod | null>(null)
  const [registerMethod, setRegisterMethod] = useState<RegisterMethod | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  
  // デバッグ用: 状態変化を監視
  useEffect(() => {
    console.log('[WelcomeScreen] State changed - authMode:', authMode, 'registerMethod:', registerMethod, 'loginMethod:', loginMethod)
  }, [authMode, registerMethod, loginMethod])

  // アニメーション状態の管理はhandleNavigateToRegister/Login内で行う

  const handleNavigateToRegister = () => {
    if (isAnimating) return // アニメーション中は無効化
    setIsAnimating(true)
    setSlideDirection('right')
    // 状態をクリア
    setLoginMethod(null)
    setRegisterMethod(null)
    setError('')
    // アニメーション完了後に状態を変更
    setTimeout(() => {
      setAuthMode('register')
      setIsAnimating(false)
      setSlideDirection(null)
    }, 300) // アニメーション時間に合わせる
  }

  const handleNavigateToLogin = () => {
    if (isAnimating) return // アニメーション中は無効化
    setIsAnimating(true)
    setSlideDirection('left')
    // 状態をクリア
    setLoginMethod(null)
    setRegisterMethod(null)
    setError('')
    // アニメーション完了後に状態を変更
    setTimeout(() => {
      setAuthMode('initial')
      setIsAnimating(false)
      setSlideDirection(null)
    }, 300) // アニメーション時間に合わせる
  }

  const handleGoogleLogin = async () => {
    try {
      console.log('[WelcomeScreen] Google Login button clicked')
      setLoading(true)
      setError('')

      const appUrl = (process.env.NEXT_PUBLIC_ORGANIZER_URL || window.location.origin).replace(/\/$/, '')
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
        sessionStorage.setItem('auth_type', 'email')
        sessionStorage.setItem('user_id', data.user.id)
        sessionStorage.setItem('user_email', data.user.email || '')
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

    if (registerPassword.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      setLoading(false)
      return
    }

    try {
      const appUrl = (process.env.NEXT_PUBLIC_ORGANIZER_URL || window.location.origin).replace(/\/$/, '')
      const redirectUrl = `${appUrl}/auth/verify-email`
      
      console.log('[WelcomeScreen] Email registration - redirectUrl:', redirectUrl)
      
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          emailRedirectTo: redirectUrl
        }
      })

      if (error) {
        if (error.message?.includes('already registered') || error.message?.includes('already exists') || error.status === 422) {
          setError('このメールアドレスは既に登録されています。ログイン画面からログインしてください。')
          setLoading(false)
          return
        }
        throw error
      }

      if (data.user) {
        sessionStorage.setItem('auth_type', 'email')
        sessionStorage.setItem('user_id', data.user.id)
        sessionStorage.setItem('user_email', data.user.email || '')
        sessionStorage.setItem('email_confirmed', data.session ? 'true' : 'false')
        
        if (!data.session) {
          window.location.reload()
          return
        }
        
        window.location.reload()
      } else {
        setError('ユーザー登録に失敗しました。もう一度お試しください。')
      }
    } catch (err: any) {
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
        width: '343px',
        height: '96px',
        left: '25px',
        top: '32px',
        fontFamily: '"Noto Sans JP", sans-serif',
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: '24px',
        lineHeight: '48px',
        textAlign: 'center',
        color: '#000000'
      }}>
        イベントに呼びたい<br />キッチンカー・屋台を探すなら
      </div>

      {/* ロゴプレースホルダー */}
      <div style={{
        position: 'absolute',
        width: '256px',
        height: '256px',
        left: '69px',
        top: '144px',
        background: '#D9D9D9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          fontFamily: '"Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          fontSize: '32px',
          lineHeight: '48px',
          textAlign: 'center',
          color: '#000000'
        }}>
          将来のロゴ
        </div>
      </div>

      {/* タブ形式のヘッダー */}
      {!loginMethod && !registerMethod && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}>
          {/* タブヘッダー */}
          <div style={{
            position: 'absolute',
            top: '420px',
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            gap: '0px'
          }}>
            {/* ログインタブ */}
            <button
              type="button"
              onClick={() => setAuthMode('initial')}
              style={{
                position: 'relative',
                padding: '12px 24px',
                background: 'transparent',
                border: 'none',
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: '24px',
                color: authMode === 'initial' ? '#000000' : '#999999',
                cursor: 'pointer'
              }}
            >
              ログイン
              {authMode === 'initial' && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: '#4285F4' // 青いアンダーライン
                }} />
              )}
            </button>

            {/* 新規登録タブ */}
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              style={{
                position: 'relative',
                padding: '12px 24px',
                background: 'transparent',
                border: 'none',
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: '24px',
                color: authMode === 'register' ? '#000000' : '#999999',
                cursor: 'pointer'
              }}
            >
              新規登録
              {authMode === 'register' && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: '#4285F4' // 青いアンダーライン
                }} />
              )}
            </button>
          </div>

          {/* ログイン画面 */}
          {authMode === 'initial' && (
            <div style={{
              position: 'absolute',
              top: '480px',
              left: 0,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}>
              {/* Facebookボタン（Google認証にマッピング） */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: '16px 24px',
                  width: '288px',
                  height: '56px',
                  background: '#1877F2', // Facebookの濃い青色
                  borderRadius: '8px',
                  border: 'none',
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: '24px',
                  color: '#FFFFFF',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  position: 'relative'
                }}
              >
                <div style={{ position: 'absolute', left: '16px' }}>
                  <FacebookIcon />
                </div>
                <span style={{ width: '100%', textAlign: 'center' }}>Facebookで登録</span>
              </button>

              {/* Twitterボタン（メールアドレス認証にマッピング） */}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login')
                  setLoginMethod('email')
                }}
                disabled={loading}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: '16px 24px',
                  width: '288px',
                  height: '56px',
                  background: '#1DA1F2', // Twitterの明るい水色
                  borderRadius: '8px',
                  border: 'none',
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: '24px',
                  color: '#FFFFFF',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  position: 'relative'
                }}
              >
                <div style={{ position: 'absolute', left: '16px' }}>
                  <TwitterIcon />
                </div>
                <span style={{ width: '100%', textAlign: 'center' }}>Twitterで登録</span>
              </button>

              {/* メールアドレスボタン */}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login')
                  setLoginMethod('email')
                }}
                disabled={loading}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: '16px 24px',
                  width: '288px',
                  height: '56px',
                  background: '#06C755', // 緑色
                  borderRadius: '8px',
                  border: 'none',
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: '24px',
                  color: '#FFFFFF',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  position: 'relative'
                }}
              >
                <div style={{ position: 'absolute', left: '16px' }}>
                  <MailIcon color="#FFFFFF" />
                </div>
                <span style={{ width: '100%', textAlign: 'center' }}>メールアドレスで登録</span>
              </button>
            </div>
          )}

          {/* 新規登録画面 */}
          {authMode === 'register' && (
            <div style={{
              position: 'absolute',
              top: '480px',
              left: 0,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}>
              {/* Facebookボタン（Google認証にマッピング） */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: '16px 24px',
                  width: '288px',
                  height: '56px',
                  background: '#1877F2', // Facebookの濃い青色
                  borderRadius: '8px',
                  border: 'none',
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: '24px',
                  color: '#FFFFFF',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  position: 'relative'
                }}
              >
                <div style={{ position: 'absolute', left: '16px' }}>
                  <FacebookIcon />
                </div>
                <span style={{ width: '100%', textAlign: 'center' }}>Facebookで登録</span>
              </button>

              {/* Twitterボタン（メールアドレス認証にマッピング） */}
              <button
                type="button"
                onClick={() => {
                  setRegisterMethod('email')
                }}
                disabled={loading}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: '16px 24px',
                  width: '288px',
                  height: '56px',
                  background: '#1DA1F2', // Twitterの明るい水色
                  borderRadius: '8px',
                  border: 'none',
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: '24px',
                  color: '#FFFFFF',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  position: 'relative'
                }}
              >
                <div style={{ position: 'absolute', left: '16px' }}>
                  <TwitterIcon />
                </div>
                <span style={{ width: '100%', textAlign: 'center' }}>Twitterで登録</span>
              </button>

              {/* メールアドレスボタン */}
              <button
                type="button"
                onClick={() => {
                  setRegisterMethod('email')
                }}
                disabled={loading}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: '16px 24px',
                  width: '288px',
                  height: '56px',
                  background: '#06C755', // 緑色
                  borderRadius: '8px',
                  border: 'none',
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: '24px',
                  color: '#FFFFFF',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  position: 'relative'
                }}
              >
                <div style={{ position: 'absolute', left: '16px' }}>
                  <MailIcon color="#FFFFFF" />
                </div>
                <span style={{ width: '100%', textAlign: 'center' }}>メールアドレスで登録</span>
              </button>
            </div>
          )}

          {/* 利用規約フッター */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '14px',
              lineHeight: '20px',
              color: '#4285F4',
              cursor: 'pointer'
            }}>
              利用規約と個人情報保護方針に
            </span>
            <span style={{
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '14px',
              lineHeight: '20px',
              color: '#000000'
            }}>
              同意の上ご利用ください。
            </span>
          </div>
        </div>
      )}

      {/* ログイン方法選択 */}
      {authMode === 'login' && !loginMethod && (
        <>
          {/* ログインセクション */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '0px',
            left: '69px',
            top: '427.5px',
            border: '1px solid #06C755'
          }} />
          <div style={{
            position: 'absolute',
            width: '72px',
            height: '16px',
            left: '161px',
            top: '420px',
            background: '#FFFFFF'
          }} />
          <div style={{
            position: 'absolute',
            width: '72px',
            height: '24px',
            left: '161px',
            top: '416px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            color: '#000000'
          }}>
            ログイン
          </div>

          {/* Googleログインボタン */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '16px 24px',
              position: 'absolute',
              width: '287px',
              height: '47px',
              left: '53.5px',
              top: '456px',
              background: '#FFFFFF',
              borderRadius: '7.5px',
              border: '1px solid #E5E5E5',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              color: '#000000',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              zIndex: 100,
              pointerEvents: loading ? 'none' : 'auto'
            }}
          >
            <div style={{ position: 'absolute', left: '16px' }}>
              <GoogleIcon />
            </div>
            <span style={{ width: '100%', textAlign: 'center' }}>Google</span>
          </button>

          {/* メールアドレスログインボタン */}
          <button
            type="button"
            onClick={() => setLoginMethod('email')}
            disabled={loading}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '16px 24px',
              position: 'absolute',
              width: '287px',
              height: '47px',
              left: '53.5px',
              top: '520.5px',
              background: '#FFFFFF',
              borderRadius: '7.5px',
              border: '1px solid #E5E5E5',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              color: '#000000',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              zIndex: 100,
              pointerEvents: loading ? 'none' : 'auto'
            }}
          >
            <div style={{ position: 'absolute', left: '16px' }}>
              <MailIcon color="#000000" />
            </div>
            <span style={{ width: '100%', textAlign: 'center' }}>メールアドレス</span>
          </button>

          {/* またはセパレーター */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '0px',
            left: '69px',
            top: '655.5px',
            border: '1px solid #06C755',
            zIndex: 1
          }} />
          <div style={{
            position: 'absolute',
            width: '64px',
            height: '16px',
            left: '165px',
            top: '648px',
            background: '#FFFFFF',
            zIndex: 2
          }} />
          <div style={{
            position: 'absolute',
            width: '64px',
            height: '24px',
            left: '165px',
            top: '644px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            color: '#000000',
            zIndex: 2
          }}>
            または
          </div>

          {/* 新規登録ボタン */}
          <button
            type="button"
            onClick={() => setAuthMode('initial')}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px 24px',
              gap: '10px',
              position: 'absolute',
              width: '287px',
              height: '47px',
              left: '53.5px',
              top: '684.5px',
              background: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: '7.5px',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              textAlign: 'center',
              color: '#000000',
              cursor: 'pointer',
              zIndex: 100,
              pointerEvents: 'auto'
            }}
          >
            新規登録
          </button>
        </>
      )}

      {/* メールアドレスでログイン */}
      {authMode === 'login' && loginMethod === 'email' && (
        <form onSubmit={handleEmailLogin}>
          {/* ログインセクション */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '0px',
            left: '69px',
            top: '427.5px',
            border: '1px solid #06C755'
          }} />
          <div style={{
            position: 'absolute',
            width: '72px',
            height: '16px',
            left: '161px',
            top: '420px',
            background: '#FFFFFF'
          }} />
          <div style={{
            position: 'absolute',
            width: '72px',
            height: '24px',
            left: '161px',
            top: '416px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            color: '#000000'
          }}>
            ログイン
          </div>

          {/* メールアドレス入力フィールド */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '12px 16px',
              gap: '10px',
              position: 'absolute',
              width: '288px',
              height: '48px',
              left: '53px',
              top: '456px',
              background: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: '8px',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',
              color: email ? '#000000' : '#999999'
            }}
            placeholder="メールアドレス"
          />

          {/* パスワード入力フィールド */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '12px 16px',
              gap: '10px',
              position: 'absolute',
              width: '288px',
              height: '48px',
              left: '53px',
              top: '520px',
              background: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: '8px',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',
              color: password ? '#000000' : '#999999'
            }}
            placeholder="パスワード"
          />

          {/* ログインボタン */}
          <button
            type="submit"
            disabled={loading}
            style={{
              boxSizing: 'border-box',
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
              top: '584px',
              background: loading ? '#CCCCCC' : '#06C755',
              border: '1px solid #E5E5E5',
              borderRadius: '8px',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              textAlign: 'center',
              color: '#FFFFFF',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>

          {/* またはセパレーター */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '0px',
            left: '69px',
            top: '655.5px',
            border: '1px solid #06C755'
          }} />
          <div style={{
            position: 'absolute',
            width: '64px',
            height: '16px',
            left: '165px',
            top: '648px',
            background: '#FFFFFF'
          }} />
          <div style={{
            position: 'absolute',
            width: '64px',
            height: '24px',
            left: '165px',
            top: '644px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            color: '#000000'
          }}>
            または
          </div>

          {/* 別の方法でログインボタン */}
          <button
            type="button"
            onClick={() => {
              setAuthMode('login')
              setLoginMethod(null)
              setError('')
              setEmail('')
              setPassword('')
            }}
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px 24px',
              gap: '10px',
              position: 'absolute',
              width: '287px',
              height: '47px',
              left: '53.5px',
              top: '684px',
              background: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: '7.5px',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              textAlign: 'center',
              color: '#000000',
              cursor: 'pointer'
            }}
          >
            別の方法でログイン
          </button>

          {/* エラーメッセージ */}
          {error && (
            <div style={{
              position: 'absolute',
              top: '750px',
              left: '53px',
              width: '288px',
              padding: '12px',
              background: '#FFEBEE',
              borderRadius: '8px'
            }}>
              <p style={{
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '14px',
                color: '#C62828',
                margin: 0
              }}>
                {error}
              </p>
            </div>
          )}
        </form>
      )}

      {/* 新規登録方法選択 */}
      {(authMode === 'register' || (isAnimating && slideDirection === 'right')) && !registerMethod && !loginMethod && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: slideDirection === 'left' && isAnimating ? 'translateX(100%)' : slideDirection === 'right' && isAnimating && authMode !== 'register' ? 'translateX(100%)' : slideDirection === 'right' && isAnimating && authMode === 'register' ? 'translateX(0)' : authMode === 'register' ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out',
          pointerEvents: isAnimating && slideDirection === 'left' ? 'none' : 'auto',
          zIndex: authMode === 'register' ? 10 : isAnimating ? 5 : 1
        }}>
          {/* 新規登録セクション */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '0px',
            left: '69px',
            top: '427.5px',
            border: '1px solid #06C755'
          }} />
          <div style={{
            position: 'absolute',
            width: '72px',
            height: '16px',
            left: '161px',
            top: '420px',
            background: '#FFFFFF'
          }} />
          <div style={{
            position: 'absolute',
            width: '72px',
            height: '24px',
            left: '161px',
            top: '416px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            color: '#000000'
          }}>
            新規登録
          </div>

          {/* Googleログインボタン */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '16px 24px',
              position: 'absolute',
              width: '287px',
              height: '47px',
              left: '53.5px',
              top: '456px',
              background: '#FFFFFF',
              borderRadius: '7.5px',
              border: '1px solid #E5E5E5',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              color: '#000000',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              zIndex: 100,
              pointerEvents: loading ? 'none' : 'auto'
            }}
          >
            <div style={{ position: 'absolute', left: '16px' }}>
              <GoogleIcon />
            </div>
            <span style={{ width: '100%', textAlign: 'center' }}>Google</span>
          </button>

          {/* メールアドレス新規登録ボタン */}
          <button
            type="button"
            onClick={() => {
              console.log('[WelcomeScreen] Email REGISTRATION button clicked (register method selection)')
              console.log('[WelcomeScreen] Current state - authMode:', authMode, 'registerMethod:', registerMethod)
              setRegisterMethod('email')
              console.log('[WelcomeScreen] After setRegisterMethod - registerMethod should be email')
            }}
            disabled={loading}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '16px 24px',
              position: 'absolute',
              width: '287px',
              height: '47px',
              left: '53.5px',
              top: '520.5px',
              background: '#FFFFFF',
              borderRadius: '7.5px',
              border: '1px solid #E5E5E5',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              color: '#000000',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              zIndex: 150,
              pointerEvents: loading ? 'none' : 'auto'
            }}
          >
            <div style={{ position: 'absolute', left: '16px' }}>
              <MailIcon color="#000000" />
            </div>
            <span style={{ width: '100%', textAlign: 'center' }}>メールアドレス</span>
          </button>

          {/* またはセパレーター */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '0px',
            left: '69px',
            top: '591.5px',
            border: '1px solid #06C755',
            zIndex: 1
          }} />
          <div style={{
            position: 'absolute',
            width: '64px',
            height: '16px',
            left: '165px',
            top: '584px',
            background: '#FFFFFF',
            zIndex: 2
          }} />
          <div style={{
            position: 'absolute',
            width: '64px',
            height: '24px',
            left: '165px',
            top: '580px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            color: '#000000',
            zIndex: 2
          }}>
            または
          </div>

          {/* ログインボタン */}
          <button
            type="button"
            onClick={handleNavigateToLogin}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px 24px',
              gap: '10px',
              position: 'absolute',
              width: '287px',
              height: '47px',
              left: '53.5px',
              top: '620.5px',
              background: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: '7.5px',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '24px',
              textAlign: 'center',
              color: '#000000',
              cursor: 'pointer',
              zIndex: 100,
              pointerEvents: 'auto'
            }}
          >
            ログイン
          </button>
        </div>
      )}

      {/* メールアドレスで新規登録 */}
      {authMode === 'register' && registerMethod === 'email' && (
        <>
          {/* タイトル */}
          <div style={{
            position: 'absolute',
            width: '343px',
            height: '96px',
            left: '25px',
            top: '32px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: '48px',
            textAlign: 'center',
            color: '#000000'
          }}>
            イベントに呼びたい<br />キッチンカー・屋台を探すなら
          </div>

          {/* ロゴプレースホルダー */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '256px',
            left: '69px',
            top: '144px',
            background: '#D9D9D9'
          }} />
          <div style={{
            position: 'absolute',
            width: '192px',
            height: '48px',
            left: '101px',
            top: '248px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '32px',
            lineHeight: '48px',
            textAlign: 'center',
            color: '#000000'
          }}>
            将来のロゴ
          </div>

          {/* 新規登録セパレーター */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '0px',
            left: '69px',
            top: '427.5px',
            border: '1px solid #06C755'
          }} />
          <div style={{
            position: 'absolute',
            width: '72px',
            height: '16px',
            left: '161px',
            top: '420px',
            background: '#FFFFFF'
          }} />
          <div style={{
            position: 'absolute',
            width: '72px',
            height: '24px',
            left: '161px',
            top: '416px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            color: '#000000'
          }}>
            新規登録
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div style={{
              position: 'absolute',
              width: '288px',
              left: '53px',
              top: '440px',
              padding: '8px',
              background: '#FFEBEE',
              borderRadius: '8px',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '14px',
              color: '#C62828',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* メールアドレス入力フィールド */}
          <form onSubmit={handleEmailRegister}>
            <input
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '12px 16px',
                gap: '10px',
                position: 'absolute',
                width: '288px',
                height: '48px',
                left: '53px',
                top: '456px',
                background: '#FFFFFF',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                fontFamily: '"Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                color: registerEmail ? '#000000' : '#999999'
              }}
              placeholder="メールアドレス"
            />

            {/* パスワード入力フィールド */}
            <input
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
              minLength={6}
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '12px 16px',
                gap: '10px',
                position: 'absolute',
                width: '288px',
                height: '48px',
                left: '53px',
                top: '520px',
                background: '#FFFFFF',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                fontFamily: '"Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                color: registerPassword ? '#000000' : '#999999'
              }}
              placeholder="パスワード"
            />

            {/* 新規登録ボタン */}
            <button
              type="submit"
              disabled={loading}
              style={{
                boxSizing: 'border-box',
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
                top: '584px',
                background: loading ? '#CCCCCC' : '#06C755',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                fontFamily: '"Noto Sans JP", sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '24px',
                textAlign: 'center',
                color: '#FFFFFF',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? '登録中...' : '新規登録'}
            </button>
          </form>

          {/* またはセパレーター */}
          <div style={{
            position: 'absolute',
            width: '256px',
            height: '0px',
            left: '69px',
            top: '655.5px',
            border: '1px solid #06C755'
          }} />
          <div style={{
            position: 'absolute',
            width: '64px',
            height: '16px',
            left: '165px',
            top: '648px',
            background: '#FFFFFF'
          }} />
          <div style={{
            position: 'absolute',
            width: '64px',
            height: '24px',
            left: '165px',
            top: '644px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            color: '#000000'
          }}>
            または
          </div>

          {/* 別の方法で新規登録ボタン */}
          <button
            onClick={() => {
              setRegisterMethod(null)
              setError('')
              setRegisterEmail('')
              setRegisterPassword('')
              setRegisterPasswordConfirm('')
            }}
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px 24px',
              gap: '10px',
              position: 'absolute',
              width: '287px',
              height: '47px',
              left: '53.5px',
              top: '684px',
              background: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: '7.5px',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '24px',
              textAlign: 'center',
              color: '#000000',
              cursor: 'pointer'
            }}
          >
            別の方法で新規登録
          </button>
        </>
      )}
    </div>
  )
}
