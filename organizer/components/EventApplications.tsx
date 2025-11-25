'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Application {
  id: string
  application_status: 'pending' | 'approved' | 'rejected'
  applied_at: string
  exhibitor: {
    id: string
    name: string
    email: string
    phone_number: string
  }
}

interface EventApplicationsProps {
  eventId: string
  eventName: string
  organizerId: string
  organizerEmail: string
  onBack: () => void
}

export default function EventApplications({ eventId, eventName, organizerId, organizerEmail, onBack }: EventApplicationsProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [isApplicationClosed, setIsApplicationClosed] = useState(false)
  const [closingApplication, setClosingApplication] = useState(false)

  useEffect(() => {
    fetchApplications()
    fetchEventStatus()
  }, [eventId])

  const fetchEventStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('is_application_closed')
        .eq('id', eventId)
        .single()

      if (error) throw error

      setIsApplicationClosed(data?.is_application_closed || false)
    } catch (error) {
      console.error('Failed to fetch event status:', error)
    }
  }

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('event_applications')
        .select(`
          id,
          application_status,
          applied_at,
          exhibitor:exhibitors(
            id,
            name,
            email,
            phone_number
          )
        `)
        .eq('event_id', eventId)
        .order('applied_at', { ascending: false })

      if (error) throw error

      // データを正しい型に変換
      const applicationsData = (data || []).map((app: any) => ({
        id: app.id,
        application_status: app.application_status,
        applied_at: app.applied_at,
        exhibitor: Array.isArray(app.exhibitor) ? app.exhibitor[0] : app.exhibitor
      }))

      setApplications(applicationsData)
    } catch (error) {
      console.error('Failed to fetch applications:', error)
      alert('申し込み一覧の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleApplicationApproval = async (applicationId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('event_applications')
        .update({ application_status: status })
        .eq('id', applicationId)

      if (error) throw error

      // データを再取得
      await fetchApplications()
      alert(status === 'approved' ? '申し込みを承認しました' : '申し込みを却下しました')
    } catch (error) {
      console.error('Failed to update application:', error)
      alert('更新に失敗しました')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: '#FFF9E6', text: '#B8860B' }
      case 'approved':
        return { bg: '#E6F7ED', text: '#06C755' }
      case 'rejected':
        return { bg: '#FFE6E6', text: '#FF3B30' }
      default:
        return { bg: '#F7F7F7', text: '#666666' }
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '審査中'
      case 'approved':
        return '承認済み'
      case 'rejected':
        return '却下'
      default:
        return '不明'
    }
  }

  const handleCloseApplication = async () => {
    if (!confirm('申し込みを締め切りますか？\n\n締め切ると、出店者情報がGoogleスプレッドシートにエクスポートされ、メールが送信されます。')) {
      return
    }

    setClosingApplication(true)
    try {
      const response = await fetch('/api/events/close-and-export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventId,
          organizerId,
          eventName,
          organizerEmail
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to close application')
      }

      const data = await response.json()
      
      alert(`申し込みを締め切りました。\n\n出店者数: ${data.applicationCount}名\nスプレッドシートURL: ${data.spreadsheetUrl}`)
      
      setIsApplicationClosed(true)
      await fetchApplications()
    } catch (error: any) {
      console.error('Failed to close application:', error)
      alert(`申し込みの締め切りに失敗しました: ${error.message}`)
    } finally {
      setClosingApplication(false)
    }
  }

  if (loading) {
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
          }}>申し込み一覧を読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#F7F7F7', minHeight: '100vh' }}>
      <div className="container mx-auto" style={{ padding: '9px 16px', maxWidth: '394px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingTop: '24px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'transparent',
              border: 'none',
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              lineHeight: '150%',
              color: '#06C755',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            ← 戻る
          </button>
          <h1 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '20px',
            fontWeight: 700,
            lineHeight: '120%',
            color: '#000000'
          }}>出店申し込み管理</h1>
          <div style={{ width: '60px' }}></div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <h2 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '18px',
            fontWeight: 700,
            lineHeight: '120%',
            color: '#000000',
            marginBottom: '8px'
          }}>{eventName}</h2>
          {isApplicationClosed && (
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              lineHeight: '120%',
              color: '#666666',
              padding: '8px 12px',
              background: '#FFF9E6',
              borderRadius: '8px',
              display: 'inline-block'
            }}>申し込みは締め切られています</p>
          )}
        </div>

        {!isApplicationClosed && applications.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <button
              onClick={handleCloseApplication}
              disabled={closingApplication}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: closingApplication ? '#CCCCCC' : '#FF3B30',
                color: '#FFFFFF',
                borderRadius: '8px',
                border: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: '19px',
                cursor: closingApplication ? 'not-allowed' : 'pointer'
              }}
            >
              {closingApplication ? '処理中...' : '申し込みを締め切る'}
            </button>
          </div>
        )}

        {applications.length === 0 ? (
          <div style={{
            background: '#FFFFFF',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            padding: '48px 24px',
            textAlign: 'center'
          }}>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              lineHeight: '150%',
              color: '#666666'
            }}>このイベントへの出店申し込みはありません</p>
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
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    padding: '24px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '18px',
                        fontWeight: 700,
                        lineHeight: '120%',
                        color: '#000000',
                        marginBottom: '8px'
                      }}>
                        {application.exhibitor.name}
                      </h3>
                      <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        lineHeight: '120%',
                        color: '#666666',
                        marginBottom: '4px'
                      }}>{application.exhibitor.email}</p>
                      <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        lineHeight: '120%',
                        color: '#666666'
                      }}>電話: {application.exhibitor.phone_number}</p>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      fontWeight: 500,
                      lineHeight: '120%',
                      background: statusColor.bg,
                      color: statusColor.text
                    }}>
                      {getStatusText(application.application_status)}
                    </span>
                  </div>

                  <div style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    lineHeight: '120%',
                    color: '#666666',
                    marginBottom: '16px'
                  }}>
                    <p>申し込み日: {formatDate(application.applied_at)}</p>
                  </div>

                  {application.application_status === 'pending' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleApplicationApproval(application.id, 'approved')}
                        style={{
                          flex: 1,
                          padding: '12px 16px',
                          background: '#06C755',
                          color: '#FFFFFF',
                          borderRadius: '8px',
                          border: 'none',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '16px',
                          fontWeight: 700,
                          lineHeight: '19px',
                          cursor: 'pointer'
                        }}
                      >
                        承認
                      </button>
                      <button
                        onClick={() => handleApplicationApproval(application.id, 'rejected')}
                        style={{
                          flex: 1,
                          padding: '12px 16px',
                          background: '#FF3B30',
                          color: '#FFFFFF',
                          borderRadius: '8px',
                          border: 'none',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '16px',
                          fontWeight: 700,
                          lineHeight: '19px',
                          cursor: 'pointer'
                        }}
                      >
                        却下
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
