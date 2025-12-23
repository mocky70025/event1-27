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

  const fetchNotifications = async () => {
    try {
      const userId = userProfile.userId
      const userType = 'exhibitor'

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

  useEffect(() => {
    fetchNotifications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
            color: '#6C757D'
          }}>通知を読み込み中...</p>
        </div>
      </div>
    )
  }

  // ベルアイコン（SVGから）
  const BellIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill="white"/>
      <path d="M20 12C18.3431 12 17 13.3431 17 15V17.09C16.72 17.03 16.427 17 16.127 17C14.957 17 13.933 17.58 13.38 18.46C13.136 18.85 13 19.31 13 19.78V22.5C13 23.33 13.67 24 14.5 24H20.5C21.33 24 22 23.33 22 22.5V20C22 18.3431 20.6569 17 19 17H20V15C20 13.3431 18.6569 12 17 12H20Z" fill="#5DABA8"/>
      <path d="M26.5 21C26.7761 21 27 20.7761 27 20.5C27 20.2239 26.7761 20 26.5 20H25V18C25 16.8954 24.1046 16 23 16H22C21.4477 16 21 15.5523 21 15V13C21 12.4477 21.4477 12 22 12H24C25.6569 12 27 13.3431 27 15V20.5C27 20.7761 26.7761 21 26.5 21Z" fill="#5DABA8"/>
    </svg>
  )

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
        width: '100%',
        maxWidth: '393px',
        background: '#FFF5F0',
        minHeight: isDesktop ? 'auto' : '100vh',
        margin: '0 auto'
      }}>
        {/* ヘッダー */}
        <div style={{
          background: '#5DABA8',
          height: '64px',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          position: 'relative'
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
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5 13.5L7.5 9L10.5 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#FFFFFF',
            margin: 0,
            flex: 1,
            fontFamily: '"Noto Sans JP", sans-serif'
          }}>
            通知
          </h1>
        </div>

        <div style={{ padding: '24px 16px', maxWidth: '393px', margin: '0 auto' }}>
        {notifications.length === 0 ? (
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
              color: '#6C757D'
            }}>通知はありません</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {notifications.map((notification) => {
                return (
              <div
                key={notification.id}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
                style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                  padding: '16px',
                  cursor: notification.is_read ? 'default' : 'pointer',
                      border: '2px solid #FF8A5C',
                      position: 'relative',
                      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
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
                        border: '2px solid #FF8A5C',
                        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
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
                )
              })}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
