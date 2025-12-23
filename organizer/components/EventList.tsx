'use client'

import { useState } from 'react'
import { supabase, type Event } from '@/lib/supabase'

interface EventListProps {
  events: Event[]
  onEventUpdated: () => void
  onEdit?: (event: Event) => void
  onViewApplications?: (event: Event) => void
}

export default function EventList({ events, onEventUpdated, onEdit, onViewApplications }: EventListProps) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (eventId: string) => {
    if (!confirm('このイベントを削除しますか？')) return

    setDeleting(eventId)
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) throw error

      onEventUpdated()
    } catch (error) {
      console.error('Failed to delete event:', error)
      alert('イベントの削除に失敗しました。')
    } finally {
      setDeleting(null)
    }
  }

  if (events.length === 0) {
    return (
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E9ECEF',
        padding: '48px 24px',
        textAlign: 'center'
      }}>
        <p style={{
          fontFamily: '"Noto Sans JP", sans-serif',
          fontSize: '16px',
          lineHeight: '150%',
          color: '#6C757D'
        }}>掲載中のイベントはありません</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {events.map((event) => {
        return (
          <div
            key={event.id}
            onClick={() => {
              // クリック時に詳細を表示する場合はここで処理
              // 現在はクリックしても何もしない（SVGデザインに合わせてシンプルに）
            }}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E9ECEF',
              borderRadius: '0',
              padding: '12px',
              display: 'flex',
              gap: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F8F9FA'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF'
            }}
          >
            {/* 左側: 画像 */}
            <div style={{
              width: '160px',
              height: '139px',
              background: '#E9ECEF',
              borderRadius: '0',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {event.main_image_url ? (
                <img
                  src={event.main_image_url}
                  alt={event.event_name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: '#E9ECEF'
                }} />
              )}
            </div>
            
            {/* 右側: タイトルと説明 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 style={{
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: '150%',
                color: '#2C3E50',
                margin: 0
              }}>
                {event.event_name}
              </h3>
              
              <p style={{
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '16px',
                lineHeight: '150%',
                color: '#6C757D',
                margin: 0
              }}>
                {event.lead_text || 'イベントの説明がここに表示されます'}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
