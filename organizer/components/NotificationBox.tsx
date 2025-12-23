'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Notification {
  id: string
  notification_type: string
  title: string
  message: string
  related_event_id?: string
  related_application_id?: string
  is_read: boolean
  created_at: string
  events?: {
    event_name: string
  }
}

interface NotificationBoxProps {
  userProfile: any
  onBack: () => void
  onUnreadCountChange?: (count: number) => void
}

export default function NotificationBox({ userProfile, onBack, onUnreadCountChange }: NotificationBoxProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
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
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const userId = userProfile.userId
      const userType = 'organizer'

      const { data, error } = await supabase
        .from('notifications')
        .select(`
          id,
          notification_type,
          title,
          message,
          related_event_id,
          related_application_id,
          is_read,
          created_at,
          events(event_name)
        `)
        .eq('user_id', userId)
        .eq('user_type', userType)
        .order('created_at', { ascending: false })

      if (error) throw error

      const notificationsData = (data || []).map((notif: any) => ({
        ...notif,
        events: Array.isArray(notif.events) ? notif.events[0] : notif.events
      }))

      setNotifications(notificationsData)
      const unread = notificationsData.filter((n: Notification) => !n.is_read).length
      setUnreadCount(unread)
      onUnreadCountChange?.(unread)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      alert('通知の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

      if (error) throw error

      // ローカル状態を更新
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      )
      setUnreadCount(prev => {
        const newCount = Math.max(0, prev - 1)
        onUnreadCountChange?.(newCount)
        return newCount
      })
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return '昨日'
    } else if (days < 7) {
      return `${days}日前`
    } else {
      return date.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })
    }
  }

  // ベルアイコン（オレンジ色で主催者アプリ用）
  const BellIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25-2.5 7.5-2.5 7.5h19S19 14.25 19 9c0-3.87-3.13-7-7-7zm0 20c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z" fill="#FF8A5C"/>
    </svg>
  )

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        width: '100%',
        background: '#E8F5F5',
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
            borderTopColor: '#FF8A5C',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: '16px',
            lineHeight: '150%',
            color: '#6C757D'
          }}>通知を読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      width: '100%',
      background: '#E8F5F5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: isDesktop ? '40px 20px' : 0
    }}>
      <div style={{
        width: '100%',
        maxWidth: isDesktop ? '1000px' : '393px',
        background: '#E8F5F5',
        minHeight: isDesktop ? 'auto' : '100vh',
        margin: '0 auto'
      }}>
        {/* ヘッダー */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: '#FF8A5C',
          height: '64px',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: isDesktop ? '1000px' : '393px',
          margin: '0 auto',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
        }}>
          <button
            onClick={onBack}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '20px',
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
          <h1 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#FFFFFF',
            margin: 0,
            flex: 1,
            textAlign: 'center',
            fontFamily: '"Noto Sans JP", sans-serif',
            lineHeight: '120%'
          }}>
            通知
          </h1>
          {/* 右側のスペース（戻るボタンとバランスを取る） */}
          <div style={{ width: '24px', height: '24px' }}></div>
        </div>

        <div style={{ 
          paddingTop: '88px', // ヘッダーの高さ(64px) + 余白(24px)
          paddingBottom: '24px',
          paddingLeft: '16px',
          paddingRight: '16px',
          maxWidth: isDesktop ? '600px' : '361px', 
          margin: '0 auto' 
        }}>
          {notifications.length === 0 ? (
            <div style={{
              background: '#FFFFFF',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
              borderRadius: '16px',
              padding: '48px 24px',
              textAlign: 'center'
            }}>
              <p style={{
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '16px',
                lineHeight: '150%',
                color: '#6C757D'
              }}>通知はありません</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '16px',
                    cursor: notification.is_read ? 'default' : 'pointer',
                    border: notification.is_read ? '1px solid #E9ECEF' : '2px solid #FF8A5C',
                    position: 'relative',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    {/* ベルアイコン */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: notification.is_read ? '1px solid #E9ECEF' : '2px solid #FF8A5C',
                      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
                    }}>
                      <BellIcon />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: 700,
                          lineHeight: '150%',
                          color: '#2C3E50',
                          margin: 0,
                          fontFamily: '"Noto Sans JP", sans-serif',
                          wordBreak: 'break-word'
                        }}>
                          {notification.title}
                        </h3>
                        {!notification.is_read && (
                          <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#FF8A5C',
                            flexShrink: 0,
                            marginTop: '6px',
                            marginLeft: '8px'
                          }}></span>
                        )}
                      </div>
                      <p style={{
                        fontSize: '14px',
                        lineHeight: '150%',
                        color: '#2C3E50',
                        margin: '0 0 8px 0',
                        fontFamily: '"Noto Sans JP", sans-serif',
                        wordBreak: 'break-word'
                      }}>
                        {notification.message}
                      </p>
                      {notification.events && (
                        <p style={{
                          fontSize: '12px',
                          lineHeight: '120%',
                          color: '#6C757D',
                          margin: '0 0 8px 0',
                          fontFamily: '"Noto Sans JP", sans-serif'
                        }}>
                          イベント: {notification.events.event_name}
                        </p>
                      )}
                      <p style={{
                        fontSize: '12px',
                        lineHeight: '120%',
                        color: '#6C757D',
                        margin: 0,
                        fontFamily: '"Noto Sans JP", sans-serif'
                      }}>
                        {formatDate(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

