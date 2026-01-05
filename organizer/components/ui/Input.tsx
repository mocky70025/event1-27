'use client'

import { CSSProperties, ReactNode, ChangeEvent } from 'react'
import { colors, spacing, borderRadius, typography, transitions } from '@/styles/design-system'

interface InputProps {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'date' | 'time' | 'url'
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  required?: boolean
  variant?: 'default' | 'filled'
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  className?: string
  style?: CSSProperties
}

export default function Input({
  value,
  onChange,
  type = 'text',
  placeholder,
  label,
  error,
  disabled = false,
  required = false,
  variant = 'default',
  icon,
  iconPosition = 'left',
  fullWidth = true,
  className = '',
  style = {},
}: InputProps) {
  const hasError = !!error

  const containerStyle: CSSProperties = {
    width: fullWidth ? '100%' : 'auto',
    ...style,
  }

  const labelStyle: CSSProperties = {
    display: 'block',
    marginBottom: spacing[2],
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[700],
  }

  const inputWrapperStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  }

  const inputStyle: CSSProperties = {
    width: '100%',
    height: '44px',
    padding: icon
      ? iconPosition === 'left'
        ? `${spacing[2.5]} ${spacing[4]} ${spacing[2.5]} ${spacing[10]}`
        : `${spacing[2.5]} ${spacing[10]} ${spacing[2.5]} ${spacing[4]}`
      : `${spacing[2.5]} ${spacing[4]}`,
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.normal,
    color: colors.neutral[900],
    background: variant === 'filled' ? colors.neutral[50] : colors.neutral[0],
    border: `1px solid ${hasError ? colors.status.error.main : colors.neutral[300]}`,
    borderRadius: borderRadius.md,
    outline: 'none',
    transition: transitions.fast,
    boxSizing: 'border-box',
  }

  const iconStyle: CSSProperties = {
    position: 'absolute',
    [iconPosition === 'left' ? 'left' : 'right']: spacing[4],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.neutral[500],
    pointerEvents: 'none',
  }

  const errorStyle: CSSProperties = {
    marginTop: spacing[1.5],
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.sm,
    color: colors.status.error.main,
  }

  return (
    <div style={containerStyle} className={className}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: colors.status.error.main, marginLeft: spacing[1] }}>*</span>}
        </label>
      )}
      <div style={inputWrapperStyle}>
        {icon && <div style={iconStyle}>{icon}</div>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = hasError ? colors.status.error.main : colors.primary[500]
            e.target.style.boxShadow = `0 0 0 3px ${hasError ? colors.status.error.light : colors.primary[50]}`
          }}
          onBlur={(e) => {
            e.target.style.borderColor = hasError ? colors.status.error.main : colors.neutral[300]
            e.target.style.boxShadow = 'none'
          }}
        />
      </div>
      {error && <div style={errorStyle}>{error}</div>}
    </div>
  )
}

