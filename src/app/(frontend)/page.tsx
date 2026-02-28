import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import './styles.css'
import { Header } from './components/Header'

import config from '@/payload.config'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  return (
    <div className="hero">
      <Header />

      <div className="hero-content">
        <div className="hero-main">
          <h1>Real references for real artists</h1>
          <p className="subtitle">
            TrueRef is here to serve up monthly figure references for illustrators and photo
            editors—always free from retouching and never AI-generated.
          </p>
          <div className="cta-buttons">
            <a
              href={payloadConfig.routes.admin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Explore References
            </a>
            <a href="#features" className="btn btn-secondary">
              Learn More
            </a>
          </div>
        </div>
      </div>

      <div className="features-section" id="features">
        <h2>Why TrueRef</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Authentic</h3>
            <p>
              Real photographs with zero retouching. What you see is what you get—genuine,
              unpolished reference material.
            </p>
          </div>
          <div className="feature-card">
            <h3>Human-Created</h3>
            <p>
              Every reference pack is photographed with real people. Never AI-generated, always
              authentic human poses and expressions.
            </p>
          </div>
          <div className="feature-card">
            <h3>Regular Updates</h3>
            <p>
              New reference packs added every month. Stay inspired with fresh content for
              illustrators, concept artists, and photo editors.
            </p>
          </div>
        </div>
      </div>
      <div className="footer">
        <p>&copy; 2026 TrueRef. All rights reserved.</p>
      </div>
    </div>
  )
}
