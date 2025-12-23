'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { type LineProfile } from '@/lib/auth'
import OrganizerEditForm from './OrganizerEditForm'

interface OrganizerProfileProps {
  userProfile: LineProfile
  onBack?: () => void
}

interface OrganizerData {
  id: string
  company_name: string
  name: string
  gender: string
  age: number
  phone_number: string
  email: string
  line_user_id: string
  is_approved: boolean
  created_at: string
  updated_at: string
}

export default function OrganizerProfile({ userProfile, onBack }: OrganizerProfileProps) {
  const [organizerData, setOrganizerData] = useState<OrganizerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // 画面サイズを検出
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  useEffect(() => {
    if (userProfile?.userId) {
      fetchOrganizerData()
    }
  }, [userProfile])

  const fetchOrganizerData = async () => {
    try {
      if (!userProfile?.userId) {
        console.error('[OrganizerProfile] No userProfile.userId')
        setLoading(false)
        return
      }

      console.log('[OrganizerProfile] Fetching organizer data for userId:', userProfile.userId)

      const authType = (userProfile as any).authType || 'line'
      let data, error

      if (authType === 'email') {
        const result = await supabase
          .from('organizers')
          .select('*')
          .eq('user_id', userProfile.userId)
          .single()
        data = result.data
        error = result.error
      } else {
        const result = await supabase
          .from('organizers')
          .select('*')
          .eq('line_user_id', userProfile.userId)
          .single()
        data = result.data
        error = result.error
      }

      console.log('[OrganizerProfile] Fetch result:', { data, error })

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('[OrganizerProfile] No organizer found')
          setOrganizerData(null)
        } else {
          throw error
        }
      } else {
        setOrganizerData(data)
      }
    } catch (error) {
      console.error('[OrganizerProfile] Failed to fetch organizer data:', error)
      alert('プロフィール情報の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateComplete = (updatedData: OrganizerData) => {
    setOrganizerData(updatedData)
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div style={{ 
        position: 'relative',
        width: '100%',
        maxWidth: isDesktop ? '600px' : '393px',
        minHeight: '852px',
        margin: '0 auto',
        background: '#E8F5F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #E5E5E5',
            borderTopColor: '#FF8A5C',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: '16px',
            lineHeight: '150%',
            color: '#666666'
          }}>プロフィールを読み込み中...</p>
        </div>
      </div>
    )
  }

  if (isEditing && organizerData) {
    return (
      <OrganizerEditForm
        organizerData={organizerData}
        userProfile={userProfile}
        onUpdateComplete={handleUpdateComplete}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <div style={{ 
      position: 'relative',
      width: '100%',
      maxWidth: isDesktop ? '600px' : '393px',
      minHeight: '852px',
      margin: '0 auto',
      background: '#E8F5F5'
    }}>
      {/* ヘッダー */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: '#FF8A5C',
        color: '#FFFFFF',
        padding: '16px',
        textAlign: 'center',
        fontFamily: '"Noto Sans JP", sans-serif',
        fontSize: '18px',
        fontWeight: 700,
        lineHeight: '120%',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        maxWidth: isDesktop ? '1000px' : '393px',
        margin: '0 auto',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '64px'
      }}>
          <button
          onClick={() => {
            if (onBack) {
              onBack()
            } else if (typeof window !== 'undefined' && window.history.length > 1) {
              window.history.back()
            }
          }}
          style={{
            position: 'absolute',
            left: '16px',
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19L9 12L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        主催者プロフィール確認
      </div>

      <div style={{ paddingTop: '64px', paddingBottom: '24px' }}>
        <div style={{ 
          padding: isDesktop ? '20px 32px' : '0 20px',
          maxWidth: isDesktop ? '600px' : '353px',
          margin: '0 auto'
        }}>
          {!organizerData ? (
            <div style={{
              background: '#FFFFFF',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
              borderRadius: '16px',
              padding: '24px',
              marginTop: '24px',
              textAlign: 'center'
            }}>
              <p style={{
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '16px',
                lineHeight: '150%',
                color: '#6C757D'
              }}>登録情報が見つかりませんでした</p>
            </div>
          ) : (
            <div style={{
              background: '#FFFFFF',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
              borderRadius: '16px',
              padding: '24px',
              marginTop: '24px'
            }}>
              <h2 style={{
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                lineHeight: '120%',
                color: '#2C3E50',
                marginBottom: '24px',
                textAlign: 'center'
              }}>
                主催者プロフィール確認
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '120%',
                    color: '#6C757D',
                    marginBottom: '8px',
                    marginTop: 0
                  }}>会社名</p>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '150%',
                    color: '#2C3E50',
                    margin: 0
                  }}>{organizerData.company_name}</p>
                </div>

                <div>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '120%',
                    color: '#6C757D',
                    marginBottom: '8px',
                    marginTop: 0,
                    marginLeft: 0,
                    marginRight: 0
                  }}>お名前</p>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '150%',
                    color: '#2C3E50',
                    margin: 0
                  }}>{organizerData.name}</p>
                </div>

                <div>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '120%',
                    color: '#6C757D',
                    marginBottom: '8px',
                    marginTop: 0,
                    marginLeft: 0,
                    marginRight: 0
                  }}>性別</p>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '150%',
                    color: '#2C3E50',
                    margin: 0
                  }}>{organizerData.gender === '男' ? '男性' : organizerData.gender === '女' ? '女性' : 'その他'}</p>
                </div>

                <div>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '120%',
                    color: '#6C757D',
                    marginBottom: '8px',
                    marginTop: 0,
                    marginLeft: 0,
                    marginRight: 0
                  }}>年齢</p>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '150%',
                    color: '#2C3E50',
                    margin: 0
                  }}>{organizerData.age}歳</p>
                </div>

                <div>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '120%',
                    color: '#6C757D',
                    marginBottom: '8px',
                    marginTop: 0,
                    marginLeft: 0,
                    marginRight: 0
                  }}>電話番号</p>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '150%',
                    color: '#2C3E50',
                    margin: 0
                  }}>{organizerData.phone_number}</p>
                </div>

                <div>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '120%',
                    color: '#6C757D',
                    marginBottom: '8px',
                    marginTop: 0,
                    marginLeft: 0,
                    marginRight: 0
                  }}>メールアドレス</p>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '150%',
                    color: '#2C3E50',
                    margin: 0
                  }}>{organizerData.email}</p>
                </div>

                <div>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '120%',
                    color: '#6C757D',
                    marginBottom: '8px',
                    marginTop: 0,
                    marginLeft: 0,
                    marginRight: 0
                  }}>承認状態</p>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '150%',
                    color: organizerData.is_approved ? '#FF8A5C' : '#B8860B',
                    margin: 0
                  }}>{organizerData.is_approved ? '承認済み' : '承認待ち'}</p>
                </div>

                <div>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '120%',
                    color: '#6C757D',
                    marginBottom: '8px',
                    marginTop: 0,
                    marginLeft: 0,
                    marginRight: 0
                  }}>登録日時</p>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '150%',
                    color: '#2C3E50',
                    margin: 0
                  }}>
                    {new Date(organizerData.created_at).toLocaleString('ja-JP')}
                  </p>
                </div>

                <div>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '120%',
                    color: '#6C757D',
                    marginBottom: '8px',
                    marginTop: 0,
                    marginLeft: 0,
                    marginRight: 0
                  }}>最終更新日時</p>
                  <p style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '150%',
                    color: '#2C3E50',
                    margin: 0
                  }}>
                    {new Date(organizerData.updated_at).toLocaleString('ja-JP')}
                  </p>
                </div>
              </div>

              {/* プロフィール編集ボタン */}
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  background: '#FF8A5C',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  border: 'none',
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: '120%',
                  cursor: 'pointer',
                  marginTop: '32px',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
                }}
              >
                プロフィール編集
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

