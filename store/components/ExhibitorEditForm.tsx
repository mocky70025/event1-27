'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import ImageUpload from './ImageUpload'

interface ExhibitorEditFormProps {
  exhibitorData: any
  userProfile: any
  onUpdateComplete: (updatedData: any) => void
  onCancel: () => void
}

export default function ExhibitorEditForm({
  exhibitorData,
  userProfile,
  onUpdateComplete,
  onCancel
}: ExhibitorEditFormProps) {
  const [formData, setFormData] = useState({
    name: exhibitorData.name || '',
    gender: exhibitorData.gender || '',
    age: exhibitorData.age || '',
    phone_number: exhibitorData.phone_number || '',
    email: exhibitorData.email || '',
    genre_category: exhibitorData.genre_category || '',
    genre_free_text: exhibitorData.genre_free_text || '',
  })

  const [imageUrls, setImageUrls] = useState({
    business_license_image_url: exhibitorData.business_license_image_url || '',
    vehicle_inspection_image_url: exhibitorData.vehicle_inspection_image_url || '',
    automobile_inspection_image_url: exhibitorData.automobile_inspection_image_url || '',
    pl_insurance_image_url: exhibitorData.pl_insurance_image_url || '',
    fire_equipment_layout_image_url: exhibitorData.fire_equipment_layout_image_url || '',
  })

  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (field: string, url: string) => {
    setImageUrls(prev => ({
      ...prev,
      [field]: url
    }))
  }

  const handleImageDelete = (field: string) => {
    setImageUrls(prev => ({
      ...prev,
      [field]: ''
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // バリデーション
      if (!formData.name.trim()) {
        alert('お名前を入力してください')
        return
      }
      if (!formData.gender) {
        alert('性別を選択してください')
        return
      }
      if (!formData.age || formData.age < 0 || formData.age > 99) {
        alert('年齢を正しく入力してください（0-99歳）')
        return
      }
      if (!formData.phone_number.trim()) {
        alert('電話番号を入力してください')
        return
      }
      if (!formData.email.trim()) {
        alert('メールアドレスを入力してください')
        return
      }

      // 更新データの準備
      const updateData = {
        ...formData,
        age: parseInt(formData.age),
        business_license_image_url: imageUrls.business_license_image_url || null,
        vehicle_inspection_image_url: imageUrls.vehicle_inspection_image_url || null,
        automobile_inspection_image_url: imageUrls.automobile_inspection_image_url || null,
        pl_insurance_image_url: imageUrls.pl_insurance_image_url || null,
        fire_equipment_layout_image_url: imageUrls.fire_equipment_layout_image_url || null,
        updated_at: new Date().toISOString()
      }

      // Supabaseで更新（認証タイプに応じて）
      const authType = userProfile.authType || 'line'
      let data, error

      if (authType === 'email') {
        const result = await supabase
          .from('exhibitors')
          .update(updateData)
          .eq('user_id', userProfile.userId)
          .select()
          .single()
        data = result.data
        error = result.error
      } else {
        const result = await supabase
          .from('exhibitors')
          .update(updateData)
          .eq('line_user_id', userProfile.userId)
          .select()
          .single()
        data = result.data
        error = result.error
      }

      if (error) {
        console.error('Update failed:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        
        let errorMessage = '不明なエラー'
        if (error instanceof Error) {
          errorMessage = error.message
        } else if (typeof error === 'object' && error !== null) {
          const errorObj = error as any
          if (errorObj.message) {
            errorMessage = String(errorObj.message)
          } else if (errorObj.details) {
            errorMessage = String(errorObj.details)
          } else if (errorObj.hint) {
            errorMessage = String(errorObj.hint)
          }
        }
        
        alert(`登録情報の更新に失敗しました。エラー: ${errorMessage}`)
        return
      }

      console.log('Update successful:', data)
      alert('登録情報を更新しました')
      onUpdateComplete(data)
    } catch (error) {
      console.error('Update failed:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      
      let errorMessage = '不明なエラー'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null) {
        const errorObj = error as any
        if (errorObj.message) {
          errorMessage = String(errorObj.message)
        } else if (errorObj.details) {
          errorMessage = String(errorObj.details)
        } else if (errorObj.hint) {
          errorMessage = String(errorObj.hint)
        } else {
          errorMessage = JSON.stringify(error)
        }
      }
      
      alert(`登録情報の更新に失敗しました。エラー: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

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
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0 16px'
        }}>
          <button
            onClick={onCancel}
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
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#FFFFFF',
            margin: 0,
            flex: 1,
            textAlign: 'center',
            fontFamily: '"Noto Sans JP", sans-serif'
          }}>
            プロフィール編集
          </h1>
          <div style={{ width: '32px' }}></div>
        </div>

        {/* フォーム */}
        <div style={{ padding: '24px 20px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* お名前 */}
                <div>
                  <label style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    お名前 <span style={{ color: '#FF3B30' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #E9ECEF',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontFamily: '"Noto Sans JP", sans-serif',
                      color: '#2C3E50',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* 性別 */}
                <div>
                  <label style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    性別 <span style={{ color: '#FF3B30' }}>*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #E9ECEF',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontFamily: '"Noto Sans JP", sans-serif',
                      color: '#2C3E50',
                      outline: 'none',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%236C757D' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 16px center',
                      paddingRight: '40px'
                    }}
                  >
                    <option value="">選択してください</option>
                    <option value="男">男</option>
                    <option value="女">女</option>
                    <option value="その他">その他</option>
                  </select>
                </div>

                {/* 年齢 */}
                <div>
                  <label style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    年齢 <span style={{ color: '#FF3B30' }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="0"
                    max="99"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #E9ECEF',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontFamily: '"Noto Sans JP", sans-serif',
                      color: '#2C3E50',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* 電話番号 */}
                <div>
                  <label style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    電話番号 <span style={{ color: '#FF3B30' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #E9ECEF',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontFamily: '"Noto Sans JP", sans-serif',
                      color: '#2C3E50',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* メールアドレス */}
                <div>
                  <label style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    メールアドレス <span style={{ color: '#FF3B30' }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #E9ECEF',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontFamily: '"Noto Sans JP", sans-serif',
                      color: '#2C3E50',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* ジャンル */}
                <div>
                  <label style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    ジャンル
                  </label>
                  <select
                    name="genre_category"
                    value={formData.genre_category}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #E9ECEF',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontFamily: '"Noto Sans JP", sans-serif',
                      color: '#2C3E50',
                      outline: 'none',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%236C757D' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 16px center',
                      paddingRight: '40px'
                    }}
                  >
                    <option value="">選択してください</option>
                    <option value="飲食">飲食</option>
                    <option value="物販">物販</option>
                    <option value="サービス">サービス</option>
                    <option value="その他">その他</option>
                  </select>
                </div>

                {/* ジャンル（自由回答） */}
                <div>
                  <label style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#2C3E50',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    ジャンル（自由回答）
                  </label>
                  <textarea
                    name="genre_free_text"
                    value={formData.genre_free_text}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="ジャンルの詳細を入力してください"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #E9ECEF',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontFamily: '"Noto Sans JP", sans-serif',
                      color: '#2C3E50',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* 画像アップロード */}
                <div>
                  <label style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#2C3E50',
                    marginBottom: '16px',
                    display: 'block'
                  }}>
                    登録書類
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <ImageUpload
                      label="営業許可証"
                      documentType="business_license"
                      userId={userProfile.userId}
                      currentImageUrl={imageUrls.business_license_image_url}
                      onUploadComplete={(url) => handleImageUpload('business_license_image_url', url)}
                      onUploadError={(error) => alert(error)}
                      onImageDelete={() => handleImageDelete('business_license_image_url')}
                    />

                    <ImageUpload
                      label="車検証"
                      documentType="vehicle_inspection"
                      userId={userProfile.userId}
                      currentImageUrl={imageUrls.vehicle_inspection_image_url}
                      onUploadComplete={(url) => handleImageUpload('vehicle_inspection_image_url', url)}
                      onUploadError={(error) => alert(error)}
                      onImageDelete={() => handleImageDelete('vehicle_inspection_image_url')}
                    />

                    <ImageUpload
                      label="自動車検査証"
                      documentType="automobile_inspection"
                      userId={userProfile.userId}
                      currentImageUrl={imageUrls.automobile_inspection_image_url}
                      onUploadComplete={(url) => handleImageUpload('automobile_inspection_image_url', url)}
                      onUploadError={(error) => alert(error)}
                      onImageDelete={() => handleImageDelete('automobile_inspection_image_url')}
                    />

                    <ImageUpload
                      label="PL保険"
                      documentType="pl_insurance"
                      userId={userProfile.userId}
                      currentImageUrl={imageUrls.pl_insurance_image_url}
                      onUploadComplete={(url) => handleImageUpload('pl_insurance_image_url', url)}
                      onUploadError={(error) => alert(error)}
                      onImageDelete={() => handleImageDelete('pl_insurance_image_url')}
                    />

                    <ImageUpload
                      label="火器類配置図"
                      documentType="fire_equipment_layout"
                      userId={userProfile.userId}
                      currentImageUrl={imageUrls.fire_equipment_layout_image_url}
                      onUploadComplete={(url) => handleImageUpload('fire_equipment_layout_image_url', url)}
                      onUploadError={(error) => alert(error)}
                      onImageDelete={() => handleImageDelete('fire_equipment_layout_image_url')}
                    />
                  </div>
                </div>
              </div>

              {/* ボタン */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                marginTop: '32px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={onCancel}
                  style={{
                    padding: '12px 24px',
                    border: '1px solid #E9ECEF',
                    borderRadius: '16px',
                    background: '#FFFFFF',
                    color: '#2C3E50',
                    fontSize: '16px',
                    fontWeight: 500,
                    fontFamily: '"Noto Sans JP", sans-serif',
                    cursor: 'pointer'
                  }}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '16px',
                    background: loading ? '#6C757D' : '#5DABA8',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: 500,
                    fontFamily: '"Noto Sans JP", sans-serif',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? '更新中...' : '更新'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
