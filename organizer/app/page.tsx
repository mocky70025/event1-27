'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { type LineProfile } from '@/lib/auth'
import WelcomeScreen from '@/components/WelcomeScreen'
import RegistrationForm from '@/components/RegistrationForm'
import EventManagement from '@/components/EventManagement'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Home() {
  const [userProfile, setUserProfile] = useState<LineProfile | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // セッションストレージからプロフィール情報を取得（LINE Loginコールバック後）
        const savedProfile = sessionStorage.getItem('line_profile')
        const savedIsRegistered = sessionStorage.getItem('is_registered')
        
        console.log('[Home] Saved profile from sessionStorage:', savedProfile)
        console.log('[Home] Is registered from sessionStorage:', savedIsRegistered)
        
        if (savedProfile) {
          try {
            const profile = JSON.parse(savedProfile) as LineProfile
            console.log('[LINE Login] User ID from session:', profile.userId)
            console.log('[LINE Login] Display Name:', profile.displayName)
            setUserProfile(profile)
            setIsRegistered(savedIsRegistered === 'true')
            console.log('[Home] User profile set:', { userId: profile.userId, isRegistered: savedIsRegistered === 'true' })
          } catch (error) {
            console.error('[Home] Failed to parse profile from sessionStorage:', error)
          }
        } else {
          console.log('[Home] No profile found in sessionStorage')
        }
      } catch (error) {
        console.error('[Auth] Initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!userProfile) {
    return <WelcomeScreen />
  }

  if (!isRegistered) {
    return <RegistrationForm userProfile={userProfile} onRegistrationComplete={() => setIsRegistered(true)} />
  }

  return <EventManagement userProfile={userProfile} />
}
