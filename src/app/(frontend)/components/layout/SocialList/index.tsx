'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'motion/react'
import ButtonSocial from '../../ui/ButtonSocial'
import './SocialList.css'

type SocialListProps = {
  size?: number
  socials?: Array<'bluesky' | 'discord' | 'instagram' | 'pinterest' | 'youtube'>
  className?: string
}

const SOCIAL_LINKS = {
  bluesky: '#',
  discord: '#',
  instagram: '#',
  youtube: '#',
  pinterest: '#',
}

// const followEase = cubicBezier(0, 0, 0.58, 1)

function SocialList({
  size = 25,
  socials = ['instagram', 'youtube', 'pinterest'],
  className,
}: SocialListProps) {
  const containerRef = useRef<HTMLUListElement>(null)
  const [nearestIndex, setNearestIndex] = useState<number | null>(null)
  const buttonPositions = useRef<Array<{ x: number; y: number }>>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const buttons = containerRef.current.querySelectorAll('li')

      buttonPositions.current = Array.from(buttons).map((button) => {
        const rect = button.getBoundingClientRect()
        return {
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top,
        }
      })
    }

    updatePositions()
    window.addEventListener('resize', updatePositions)
    return () => window.removeEventListener('resize', updatePositions)
  }, [socials])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLUListElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    setMousePos({ x: mouseX, y: mouseY })

    let nearest = 0
    let nearestDist = Infinity

    buttonPositions.current.forEach((pos, index) => {
      const dist = Math.sqrt(Math.pow(mouseX - pos.x, 2) + Math.pow(mouseY - pos.y, 2))

      if (dist < nearestDist) {
        nearestDist = dist
        nearest = index
      }
    })

    setNearestIndex(nearest)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setNearestIndex(null)
    setMousePos({ x: 0, y: 0 })
  }, [])

  const classes = ['social-list', className].filter(Boolean).join(' ')

  return (
    <ul
      ref={containerRef}
      className={classes}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {socials.map((platform, index) => {
        const pos = buttonPositions.current[index] || { x: 0, y: 0 }

        return (
          <motion.li
            key={platform}
            animate={{
              x: nearestIndex === index ? (mousePos.x - pos.x) * 0.3 : 0,
              y: nearestIndex === index ? (mousePos.y - pos.y) * 0.3 : 0,
            }}
            // transition={{
            //   ease: followEase,
            //   duration: 0.4,
            // }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 40,
            }}
          >
            <ButtonSocial platform={platform} href={SOCIAL_LINKS[platform]} size={size} />
          </motion.li>
        )
      })}
    </ul>
  )
}

export default SocialList
