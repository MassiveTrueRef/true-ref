'use client'

import './ButtonSocial.css'
import { useRef, useState } from 'react'
import IconDiscord from './IconDiscord'
import IconInstagram from './IconInstagram'
import IconPinterest from './IconPinterest'
import IconBsky from './IconBluesky'
import IconYoutube from './IconYoutube'

const SOCIALS = {
  bluesky: {
    Icon: IconBsky,
    label: 'Bluesky',
    url: 'https://bsky.app/profile/trueref.bsky.social',
  },
  discord: {
    Icon: IconDiscord,
    label: 'Discord',
    url: 'https://discord.gg/r6eCnamBTy',
  },
  instagram: {
    Icon: IconInstagram,
    label: 'Instagram',
    url: 'https://www.instagram.com/AbbeyMarieEsparza/',
  },
  pinterest: {
    Icon: IconPinterest,
    label: 'Pinterest',
    url: 'https://www.pinterest.com/trueref/',
  },
  youtube: {
    Icon: IconYoutube,
    label: 'YouTube',
    url: 'https://www.youtube.com/@TrueReference',
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
      href={href ? href : SOCIALS[platform].url}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      rel="noopener noreferrer"
      target="_blank"
      aria-label={`Visit TrueRef on ${label} (opens in a new tab)`}
    >
      <span aria-hidden="true">
        <Icon size={size} color={color} />
      </span>
    </Component>
  )
}

export default ButtonSocial
