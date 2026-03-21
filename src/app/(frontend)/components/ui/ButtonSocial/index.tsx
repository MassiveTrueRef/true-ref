'use client'

import { useRef, useState } from 'react'
import './ButtonSocial.css'
import IconDiscord from './IconDiscord'
import IconInstagram from './IconInstagram'
import IconPinterest from './IconPinterest'
import IconBsky from './IconBluesky'
import IconYoutube from './IconYoutube'

const SOCIALS = {
  bluesky: {
    Icon: IconBsky,
    label: 'Bluesky',
  },
  discord: {
    Icon: IconDiscord,
    label: 'Discord',
  },
  instagram: {
    Icon: IconInstagram,
    label: 'Instagram',
  },
  pinterest: {
    Icon: IconPinterest,
    label: 'Pinterest',
  },
  youtube: {
    Icon: IconYoutube,
    label: 'YouTube',
  },
} as const

type Platform = keyof typeof SOCIALS

type SocialButtonProps = {
  platform: Platform
  href?: string
  size?: number
  color?: string
}

function ButtonSocial({ platform, href, size = 30, color = '#ffffff' }: SocialButtonProps) {
  const [hoverState, setHoverState] = useState<'idle' | 'hovered' | 'leave'>('idle')
  const leaveTimeout = useRef<NodeJS.Timeout | null>(null) // store the timeout

  const Component = 'a'

  const social = SOCIALS[platform]
  const { Icon, label } = social

  const classes = [
    `btn social`,
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

  return (
    <Component
      className={classes}
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      rel="noopener noreferrer"
      target="_blank"
      aria-label={`Visit TrueRef on ${label}`}
    >
      <span>
        <Icon size={size} color={color} />
      </span>
    </Component>
  )
}

export default ButtonSocial
