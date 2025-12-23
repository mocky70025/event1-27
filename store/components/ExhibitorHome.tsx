'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface ExhibitorHomeProps {
  userProfile: any
  onNavigate: (view: 'events' | 'profile' | 'applications' | 'notifications') => void
}

interface ExhibitorData {
  id: string
  name: string
  gender: string
  age: number
  phone_number: string
  email: string
  genre_category?: string
  genre_free_text?: string
  address_prefecture?: string
  address_city?: string
  address_town?: string
  address_address?: string
}

export default function ExhibitorHome({ userProfile, onNavigate }: ExhibitorHomeProps) {
  const [exhibitorData, setExhibitorData] = useState<ExhibitorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState('')
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

  // 現在の日付を取得
  useEffect(() => {
    const now = new Date()
    const day = now.getDate()
    setCurrentDate(`${day}日`)
  }, [])

  useEffect(() => {
    fetchExhibitorData()
  }, [userProfile])

  const fetchExhibitorData = async () => {
    try {
      const authType = userProfile.authType || 'line'
      let data, error

      if (authType === 'email' || authType === 'google') {
        const result = await supabase
          .from('exhibitors')
          .select('*')
          .eq('user_id', userProfile.userId)
          .single()
        data = result.data
        error = result.error
      } else {
        const result = await supabase
          .from('exhibitors')
          .select('*')
          .eq('line_user_id', userProfile.userId)
          .single()
        data = result.data
        error = result.error
      }

      if (error) throw error
      setExhibitorData(data)
    } catch (error) {
      console.error('Failed to fetch exhibitor data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFullAddress = () => {
    if (!exhibitorData) return ''
    const parts = [
      exhibitorData.address_prefecture,
      exhibitorData.address_city,
      exhibitorData.address_town,
      exhibitorData.address_address
    ].filter(Boolean)
    return parts.join('')
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        background: '#FFF5F0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ color: '#5DABA8', fontSize: '16px' }}>読み込み中...</div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#FFF5F0',
      paddingBottom: '100px'
    }}>
      {/* ヘッダー */}
      <div style={{
        width: '100%',
        height: '64px',
        background: '#5DABA8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: '20px',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '0.02em'
          }}>
            デミセル
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: '16px',
            fontWeight: 700,
            color: '#FFFFFF'
          }}>
            {currentDate}
          </div>
          <div style={{
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: '16px',
            fontWeight: 700,
            color: '#FFFFFF'
          }}>
            マイページ
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{
        width: '100%',
        maxWidth: '393px',
        margin: '0 auto',
        padding: '16px'
      }}>
        {/* プロフィール情報カード */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '16px',
          border: '1px solid #E9ECEF'
        }}>
          <div style={{
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: '20px',
            fontWeight: 700,
            color: '#2C3E50',
            marginBottom: '16px'
          }}>
            プロフィール情報
          </div>
          
          {exhibitorData && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div>
                <div style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#6C757D',
                  marginBottom: '4px'
                }}>
                  氏名
                </div>
                <div style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#2C3E50'
                }}>
                  {exhibitorData.name || '未設定'}
                </div>
              </div>
              
              <div>
                <div style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#6C757D',
                  marginBottom: '4px'
                }}>
                  住所
                </div>
                <div style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#2C3E50'
                }}>
                  {getFullAddress() || '未設定'}
                </div>
              </div>
              
              <div>
                <div style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#6C757D',
                  marginBottom: '4px'
                }}>
                  電話番号
                </div>
                <div style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#2C3E50'
                }}>
                  {exhibitorData.phone_number || '未設定'}
                </div>
              </div>
              
              <div>
                <div style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#6C757D',
                  marginBottom: '4px'
                }}>
                  メールアドレス
                </div>
                <div style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#2C3E50'
                }}>
                  {exhibitorData.email || '未設定'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* アクションボタン */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <button
            onClick={() => onNavigate('profile')}
            style={{
              width: '100%',
              background: '#FFFFFF',
              border: '1px solid #E9ECEF',
              borderRadius: '8px',
              padding: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div style={{
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 400,
              color: '#2C3E50'
            }}>
              プロフィール編集
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8 12L12 16L16 12" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-90 12 12)"/>
            </svg>
          </button>

          <button
            onClick={() => onNavigate('applications')}
            style={{
              width: '100%',
              background: '#FFFFFF',
              border: '1px solid #E9ECEF',
              borderRadius: '8px',
              padding: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div style={{
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 400,
              color: '#2C3E50'
            }}>
              申し込み履歴
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8 12L12 16L16 12" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-90 12 12)"/>
            </svg>
          </button>

          <button
            onClick={() => onNavigate('events')}
            style={{
              width: '100%',
              background: '#FFFFFF',
              border: '1px solid #E9ECEF',
              borderRadius: '8px',
              padding: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div style={{
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              fontWeight: 400,
              color: '#2C3E50'
            }}>
              イベント検索
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8 12L12 16L16 12" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-90 12 12)"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

