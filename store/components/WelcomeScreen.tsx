'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Button from './ui/Button'
import Input from './ui/Input'
import Card from './ui/Card'
import { colors, spacing, typography, borderRadius, shadows } from '../styles/design-system'

export default function WelcomeScreen() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) throw error
        setEmailSent(true)
      } else {
        if (password !== confirmPassword) {
          setError('パスワードが一致しません')
          setLoading(false)
          return
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) throw error
        setEmailSent(true)
      }
    } catch (error: any) {
      setError(error.message || 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      setError(error.message || 'Googleログインに失敗しました')
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing[6],
        background: 'radial-gradient(at 40% 20%, rgba(16, 185, 129, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(168, 85, 247, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(59, 130, 246, 0.1) 0px, transparent 50%)',
      }}>
        <Card 
          variant="glass"
          padding={12}
          style={{
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
            animation: 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            background: colors.primary[50],
            borderRadius: borderRadius.full,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: `0 auto ${spacing[6]}`,
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                fill={colors.primary[500]}
              />
            </svg>
          </div>

          <h2 style={{
            fontFamily: typography.fontFamily.display,
            fontSize: typography.fontSize['3xl'],
            fontWeight: typography.fontWeight.bold,
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: spacing[4],
          }}>
            メールを確認してください
          </h2>

          <p style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize.base,
            color: colors.neutral[600],
            lineHeight: typography.lineHeight.relaxed,
            marginBottom: spacing[8],
          }}>
            <strong>{email}</strong> にログインリンクを送信しました。
            <br />
            メール内のリンクをクリックしてログインしてください。
          </p>

          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              setEmailSent(false)
              setEmail('')
              setPassword('')
              setConfirmPassword('')
            }}
          >
            戻る
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing[6],
      background: 'radial-gradient(at 40% 20%, rgba(16, 185, 129, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(168, 85, 247, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(59, 130, 246, 0.1) 0px, transparent 50%)',
    }}>
      <Card
        variant="glass"
        padding={12}
        style={{
          maxWidth: '480px',
          width: '100%',
          animation: 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* ロゴ・タイトル */}
        <div style={{ textAlign: 'center', marginBottom: spacing[10] }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            borderRadius: borderRadius.xl,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: `0 auto ${spacing[6]}`,
            boxShadow: shadows.glow,
            animation: 'float 3s ease-in-out infinite',
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                fill="white"
                opacity="0.9"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 style={{
            fontFamily: typography.fontFamily.display,
            fontSize: typography.fontSize['4xl'],
            fontWeight: typography.fontWeight.bold,
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: spacing[3],
            letterSpacing: typography.letterSpacing.tight,
          }}>
            デミセル
          </h1>

          <p style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize.lg,
            color: colors.neutral[600],
            fontWeight: typography.fontWeight.medium,
          }}>
            出店者向けプラットフォーム
          </p>
        </div>

        {/* タブ切り替え */}
        <div style={{
          display: 'flex',
          gap: spacing[2],
          background: colors.neutral[100],
          padding: spacing[1],
          borderRadius: borderRadius.lg,
          marginBottom: spacing[8],
        }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: `${spacing[3]} ${spacing[4]}`,
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: isLogin ? colors.neutral[900] : colors.neutral[500],
              background: isLogin ? colors.neutral[0] : 'transparent',
              border: 'none',
              borderRadius: borderRadius.md,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: isLogin ? shadows.subtle : 'none',
            }}
          >
            ログイン
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: `${spacing[3]} ${spacing[4]}`,
              fontFamily: typography.fontFamily.japanese,
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: !isLogin ? colors.neutral[900] : colors.neutral[500],
              background: !isLogin ? colors.neutral[0] : 'transparent',
              border: 'none',
              borderRadius: borderRadius.md,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: !isLogin ? shadows.subtle : 'none',
            }}
          >
            新規登録
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleEmailAuth}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[5] }}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              label="メールアドレス"
              required
              leftIcon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                    fill="currentColor"
                  />
                </svg>
              }
            />

            {!isLogin && (
              <>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  label="パスワード"
                  required
                  leftIcon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z"
                        fill="currentColor"
                      />
                    </svg>
                  }
                />

                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  label="パスワード（確認）"
                  required
                  leftIcon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z"
                        fill="currentColor"
                      />
                    </svg>
                  }
                />
              </>
            )}

            {error && (
              <div style={{
                padding: spacing[4],
                background: colors.status.error.light,
                border: `1px solid ${colors.status.error.main}`,
                borderRadius: borderRadius.md,
                fontFamily: typography.fontFamily.japanese,
                fontSize: typography.fontSize.sm,
                color: colors.status.error.dark,
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                    fill="currentColor"
                  />
                </svg>
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              fullWidth
              loading={loading}
            >
              {isLogin ? 'ログインリンクを送信' : '新規登録'}
            </Button>
          </div>
        </form>

        {/* 区切り線 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[4],
          margin: `${spacing[8]} 0`,
        }}>
          <div style={{ flex: 1, height: '1px', background: colors.neutral[200] }} />
          <span style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize.sm,
            color: colors.neutral[500],
            fontWeight: typography.fontWeight.medium,
          }}>
            または
          </span>
          <div style={{ flex: 1, height: '1px', background: colors.neutral[200] }} />
        </div>

        {/* Googleログイン */}
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={handleGoogleLogin}
          disabled={loading}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          }
        >
          Googleでログイン
        </Button>

        {/* フッター */}
        <p style={{
          marginTop: spacing[8],
          textAlign: 'center',
          fontFamily: typography.fontFamily.japanese,
          fontSize: typography.fontSize.sm,
          color: colors.neutral[500],
          lineHeight: typography.lineHeight.relaxed,
        }}>
          ログインすることで、
          <a href="#" style={{ color: colors.primary[600], fontWeight: typography.fontWeight.semibold }}>利用規約</a>
          および
          <a href="#" style={{ color: colors.primary[600], fontWeight: typography.fontWeight.semibold }}>プライバシーポリシー</a>
          に同意したものとみなされます。
        </p>
      </Card>
    </div>
  )
}
