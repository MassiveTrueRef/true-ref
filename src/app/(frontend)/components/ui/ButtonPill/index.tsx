'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import './ButtonPill.css'

type ButtonProps = {
  tag?: 'button' | 'a' | 'link'
  variant?: 'primary' | 'secondary'
  href?: string
  disabled?: boolean
  loading?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  rel?: string
  target?: string
  children: React.ReactNode
}

function Button({
  tag = 'button',
  variant = 'primary',
  href,
  disabled = false,
  loading = false,
  onClick,
  rel,
  target,
  children,
}: ButtonProps) {
  const [hoverState, setHoverState] = useState<'idle' | 'hovered' | 'leave'>('idle')
  const leaveTimeout = useRef<NodeJS.Timeout | null>(null) // store the timeout

  const Component = tag

  const classes = [
    `btn`,
    `btn--${variant}`,
    loading ? 'btn--loading' : '',
    hoverState === 'hovered' ? 'hovered' : '',
    hoverState === 'leave' ? 'hover-leave' : '',
  ].join(' ')

  const handleMouseEnter = () => {
    // Clear any pending leave timeout if the user hovers again
    if (leaveTimeout.current) {
      clearTimeout(leaveTimeout.current)
      leaveTimeout.current = null
    }
    setHoverState('hovered')
  }

  const handleMouseLeave = () => {
    setHoverState('leave')

    // Reset to idle after leave animation completes
    leaveTimeout.current = setTimeout(() => {
      setHoverState('idle')
      leaveTimeout.current = null
    }, 1600) // match leaveUp duration
  }

  if (tag === 'link' && href) {
    return (
      <Link
        href={href}
        className={classes}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        rel={rel}
        target={target}
      >
        {loading && <span className="spinner"></span>}
        <span>{children}</span>
      </Link>
    )
  }

  return (
    <Component
      className={classes}
      href={tag === 'a' ? href : undefined}
      disabled={tag === 'button' ? disabled || loading : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      rel={tag === 'a' ? rel : undefined}
      target={tag === 'a' ? target : undefined}
    >
      {loading && <span className="spinner"></span>}
      <span>{children}</span>
    </Component>
  )
}

export default Button
