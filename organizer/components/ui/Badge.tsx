'use client'

import { CSSProperties, ReactNode } from 'react'
import { colors, spacing, borderRadius, typography } from '@/styles/design-system'

interface BadgeProps {
  children: ReactNode
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  size?: 'sm' | 'md'
  className?: string
  style?: CSSProperties
}

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  style = {},
}: BadgeProps) {
  const variantColors = {
    success: {
      bg: colors.status.success.light,
      text: colors.status.success.dark,
    },
    warning: {
      bg: colors.status.warning.light,
      text: colors.status.warning.dark,
    },
    error: {
      bg: colors.status.error.light,
      text: colors.status.error.dark,
    },
    info: {
      bg: colors.status.info.light,
      text: colors.status.info.dark,
    },
    neutral: {
      bg: colors.neutral[100],
      text: colors.neutral[700],
    },
  }

  const sizeStyles = {
    sm: {
      padding: `${spacing[0.5]} ${spacing[2]}`,
      fontSize: typography.fontSize.xs,
    },
    md: {
      padding: `${spacing[1]} ${spacing[2.5]}`,
      fontSize: typography.fontSize.sm,
    },
  }

  const variantColor = variantColors[variant]

  const badgeStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.primary,
    background: variantColor.bg,
    color: variantColor.text,
    whiteSpace: 'nowrap',
    ...sizeStyles[size],
    ...style,
  }

  return (
    <span className={className} style={badgeStyle}>
      {children}
    </span>
  )
}

