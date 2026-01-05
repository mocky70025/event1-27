'use client'

import { CSSProperties, ReactNode } from 'react'
import { colors, spacing, borderRadius, typography, shadows, transitions } from '@/styles/design-system'

interface ButtonProps {
  children: ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'text'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  className?: string
  style?: CSSProperties
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  icon,
  iconPosition = 'left',
  className = '',
  style = {},
}: ButtonProps) {
  const sizeStyles = {
    sm: {
      height: '36px',
      padding: `0 ${spacing[4]}`,
      fontSize: typography.fontSize.sm,
      gap: spacing[1.5],
    },
    md: {
      height: '44px',
      padding: `0 ${spacing[6]}`,
      fontSize: typography.fontSize.base,
      gap: spacing[2],
    },
    lg: {
      height: '52px',
      padding: `0 ${spacing[8]}`,
      fontSize: typography.fontSize.lg,
      gap: spacing[2.5],
    },
  }

  const variantStyles = {
    primary: {
      background: colors.primary[500],
      color: colors.neutral[0],
      border: 'none',
    },
    secondary: {
      background: colors.secondary[500],
      color: colors.neutral[0],
      border: 'none',
    },
    outline: {
      background: 'transparent',
      color: colors.primary[500],
      border: `2px solid ${colors.primary[500]}`,
    },
    ghost: {
      background: 'transparent',
      color: colors.neutral[700],
      border: 'none',
    },
    text: {
      background: 'transparent',
      color: colors.primary[500],
      border: 'none',
      padding: spacing[2],
    },
  }

  const baseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeight.semibold,
    borderRadius: borderRadius.md,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: transitions.normal,
    outline: 'none',
    textDecoration: 'none',
    boxSizing: 'border-box',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || loading ? 0.6 : 1,
    boxShadow: variant === 'primary' || variant === 'secondary' ? shadows.button : 'none',
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style,
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      style={baseStyle}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          const target = e.currentTarget
          if (variant === 'primary') {
            target.style.background = colors.primary[600]
            target.style.transform = 'translateY(-1px)'
            target.style.boxShadow = shadows.buttonHover
          } else if (variant === 'secondary') {
            target.style.background = colors.secondary[600]
            target.style.transform = 'translateY(-1px)'
            target.style.boxShadow = shadows.buttonHover
          } else if (variant === 'outline') {
            target.style.background = colors.primary[50]
            target.style.borderColor = colors.primary[600]
          } else if (variant === 'ghost') {
            target.style.background = colors.neutral[100]
          } else if (variant === 'text') {
            target.style.color = colors.primary[600]
            target.style.textDecoration = 'underline'
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          const target = e.currentTarget
          if (variant === 'primary') {
            target.style.background = colors.primary[500]
            target.style.transform = 'translateY(0)'
            target.style.boxShadow = shadows.button
          } else if (variant === 'secondary') {
            target.style.background = colors.secondary[500]
            target.style.transform = 'translateY(0)'
            target.style.boxShadow = shadows.button
          } else if (variant === 'outline') {
            target.style.background = 'transparent'
            target.style.borderColor = colors.primary[500]
          } else if (variant === 'ghost') {
            target.style.background = 'transparent'
          } else if (variant === 'text') {
            target.style.color = colors.primary[500]
            target.style.textDecoration = 'none'
          }
        }
      }}
    >
      {loading ? (
        <>
          <div
            style={{
              width: size === 'sm' ? '14px' : size === 'md' ? '16px' : '18px',
              height: size === 'sm' ? '14px' : size === 'md' ? '16px' : '18px',
              border: `2px solid ${variant === 'primary' || variant === 'secondary' ? colors.neutral[0] : colors.primary[500]}`,
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
            }}
          />
          <span>読み込み中...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
        </>
      )}
    </button>
  )
}

