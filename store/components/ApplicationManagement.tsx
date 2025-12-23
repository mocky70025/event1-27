'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Application {
  id: string
  application_status: 'pending' | 'approved' | 'rejected'
  applied_at: string
  event: {
    id: string
    event_name: string
    event_start_date: string
    event_end_date: string
    venue_name: string
    main_image_url?: string
  }
}

interface ApplicationManagementProps {
  userProfile: any
  onBack: () => void
}

export default function ApplicationManagement({ userProfile, onBack }: ApplicationManagementProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
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
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      // 出店者情報を取得（認証タイプに応じて）
      const authType = userProfile.authType || 'line'
      let exhibitor

      if (authType === 'email') {
        const { data } = await supabase
          .from('exhibitors')
          .select('id')
          .eq('user_id', userProfile.userId)
          .single()
        exhibitor = data
      } else {
        const { data } = await supabase
          .from('exhibitors')
          .select('id')
          .eq('line_user_id', userProfile.userId)
          .single()
        exhibitor = data
      }

      if (!exhibitor) {
        alert('出店者登録が完了していません。')
        return
      }

      // 申し込み一覧を取得
      const { data, error } = await supabase
        .from('event_applications')
        .select(`
          id,
          application_status,
          applied_at,
          event:events(
            id,
            event_name,
            event_start_date,
            event_end_date,
            venue_name,
            main_image_url
          )
        `)
        .eq('exhibitor_id', exhibitor.id)
        .order('applied_at', { ascending: false })

      if (error) throw error
      
      // データを正しい型に変換
      const applications = (data || []).map((app: any) => ({
        id: app.id,
        application_status: app.application_status,
        applied_at: app.applied_at,
        event: Array.isArray(app.event) ? app.event[0] : app.event
      }))
      
      setApplications(applications)
    } catch (error) {
      console.error('Failed to fetch applications:', error)
      alert('申し込み一覧の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: '#FFF4E6', text: '#FF8A5C', border: '#FF8A5C' }
      case 'approved':
        return { bg: '#E6F7ED', text: '#5DABA8', border: '#5DABA8' }
      case 'rejected':
        return { bg: '#FFE6E6', text: '#FF3B30', border: '#FF3B30' }
      default:
        return { bg: '#F7F7F7', text: '#6C757D', border: '#E9ECEF' }
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '承認待ち'
      case 'approved':
        return '承認済み'
      case 'rejected':
        return '却下'
      default:
        return '不明'
    }
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        width: '100%',
        background: '#FFF5F0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isDesktop ? '40px 20px' : 0
      }}>
        <div style={{ 
          textAlign: 'center',
          maxWidth: '393px',
          width: '100%',
          margin: '0 auto'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #E5E5E5',
            borderTopColor: '#5DABA8',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: '16px',
            lineHeight: '150%',
            color: '#2C3E50'
          }}>申し込み一覧を読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      width: '100%',
      background: '#FFF5F0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: isDesktop ? '40px 20px' : 0
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '393px',
        background: '#FFF5F0',
        minHeight: isDesktop ? 'auto' : '852px',
        margin: '0 auto'
      }}>
      {/* ヘッダー */}
      <div style={{
        background: '#5DABA8',
        height: '64px',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
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
            <path d="M18.5 34.5199V31.5199L30.5 26.2358V29.6875L22.2841 32.9858L22.3949 32.8068V33.233L22.2841 33.054L30.5 36.3523V39.804L18.5 34.5199Z" transform="translate(-18.5 -26.2358) scale(0.6)" fill="#FFFFFF"/>
            <path d="M15 18L9 12L15 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 style={{
          fontSize: '18px',
          fontWeight: 600,
          fontFamily: '"Noto Sans JP", sans-serif',
          color: '#FFFFFF',
          margin: 0,
          flex: 1,
          textAlign: 'center'
        }}>
          申し込み履歴
        </h1>
        <div style={{ width: '32px' }}></div>
      </div>

      <div style={{ padding: '16px' }}>
        {applications.length === 0 ? (
          <div style={{
            background: '#FFFFFF',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center'
          }}>
            <p style={{
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '16px',
              lineHeight: '150%',
              color: '#2C3E50',
              marginBottom: '8px'
            }}>申し込み履歴がありません</p>
            <p style={{
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '14px',
              lineHeight: '120%',
              color: '#6C757D',
              marginTop: '8px'
            }}>イベント一覧から出店申し込みを行ってください</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {applications.map((application) => {
              const statusColor = getStatusColor(application.application_status)
              return (
                <div
                  key={application.id}
                  style={{
                    background: '#FFFFFF',
                    border: `2px solid ${statusColor.border}`,
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '16px',
                    padding: '16px',
                    position: 'relative'
                  }}
                >
                  {/* ステータスバッジ */}
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 600,
                    lineHeight: '120%',
                    background: statusColor.bg,
                    color: statusColor.text
                  }}>
                    {getStatusText(application.application_status)}
                  </span>
                  
                  {application.event.main_image_url && (
                    <div style={{ marginBottom: '16px' }}>
                      <img
                        src={application.event.main_image_url}
                        alt={application.event.event_name}
                        style={{
                          width: '100%',
                          height: '160px',
                          objectFit: 'cover',
                          borderRadius: '12px',
                          background: '#F7F7F7'
                        }}
                      />
                    </div>
                  )}

                  <div style={{ marginTop: '8px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      fontFamily: '"Noto Sans JP", sans-serif',
                      lineHeight: '150%',
                      color: '#2C3E50',
                      marginBottom: '12px',
                      marginTop: statusColor.bg !== '#F7F7F7' ? '0' : '0'
                    }}>
                      {application.event.event_name}
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M9 11L11 13L15 9" stroke="#6C757D" strokeWidth="2" strokeLinecap="round"/>
                          <rect x="3" y="5" width="18" height="14" rx="2" stroke="#6C757D" strokeWidth="2"/>
                        </svg>
                        <span style={{
                          fontSize: '14px',
                          fontFamily: '"Noto Sans JP", sans-serif',
                          color: '#6C757D',
                          lineHeight: '150%'
                        }}>
                          申込日: {new Date(application.applied_at).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#6C757D"/>
                        </svg>
                        <span style={{
                          fontSize: '14px',
                          fontFamily: '"Noto Sans JP", sans-serif',
                          color: '#6C757D',
                          lineHeight: '150%'
                        }}>
                          {application.event.venue_name}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="#6C757D" strokeWidth="2"/>
                          <path d="M12 6V12L16 14" stroke="#6C757D" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span style={{
                          fontSize: '14px',
                          fontFamily: '"Noto Sans JP", sans-serif',
                          color: '#6C757D',
                          lineHeight: '150%'
                        }}>
                          {new Date(application.event.event_start_date).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })} - {new Date(application.event.event_end_date).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '16px',
                      borderTop: '1px solid #E9ECEF'
                    }}>
                      <span style={{
                        fontSize: '14px',
                        fontFamily: '"Noto Sans JP", sans-serif',
                        color: '#5DABA8',
                        fontWeight: 600,
                        lineHeight: '150%'
                      }}>
                        詳細を見る
                      </span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6" stroke="#5DABA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
