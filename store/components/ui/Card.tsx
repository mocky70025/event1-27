'use client'

import { CSSProperties, ReactNode } from 'react'
import { colors, borderRadius, shadows, spacing, transitions } from '@/styles/design-system'

interface CardProps {
  children: ReactNode
  elevated?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  onClick?: () => void
  hoverable?: boolean
  className?: string
  style?: CSSProperties
}

export default function Card({
  children,
  elevated = false,
  padding = 'md',
  onClick,
  hoverable = false,
  className = '',
  style = {},
}: CardProps) {
  const paddingStyles = {
    none: '0',
    sm: spacing[4],
    md: spacing[6],
    lg: spacing[8],
  }

  const baseStyle: CSSProperties = {
    background: colors.neutral[0],
    borderRadius: borderRadius.lg,
    boxShadow: elevated ? shadows.cardHover : shadows.card,
    padding: paddingStyles[padding],
    transition: transitions.normal,
    cursor: onClick || hoverable ? 'pointer' : 'default',
    ...style,
  }

  return (
    <div
      className={className}
      style={baseStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick || hoverable) {
          e.currentTarget.style.boxShadow = shadows.xl
          e.currentTarget.style.transform = 'translateY(-2px)'
        }
      }}
      onMouseLeave={(e) => {
        if (onClick || hoverable) {
          e.currentTarget.style.boxShadow = elevated ? shadows.cardHover : shadows.card
          e.currentTarget.style.transform = 'translateY(0)'
        }
      }}
    >
      {children}
    </div>
  )
}

