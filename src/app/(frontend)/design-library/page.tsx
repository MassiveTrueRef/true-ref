'use client'

import { useEffect } from 'react'
import Button from '../components/ui/ButtonPill'

import './style.css'
import ButtonSocial from '../components/ui/ButtonSocial'
import SocialList from '../components/layout/SocialList'

function DesignLibrary() {
  useEffect(() => {
    // Add the 'loaded' class when the component mounts
    document.body.classList.add('loaded')

    // Optional: remove the class when the component unmounts
    return () => {
      document.body.classList.remove('loaded')
    }
  }, []) // Empty dependency array ensures it runs only once

  return (
    <div>
      <div className="library-nav">
        <h1>Design Library</h1>
        <a href="#buttons">Buttons</a>
      </div>
      <h2 id="buttons">Buttons</h2>
      <h3>Social Button</h3>
      <div className="batch white-bg">
        <ButtonSocial platform="bluesky" color="black"></ButtonSocial>
        <ButtonSocial platform="discord" color="black"></ButtonSocial>
        <ButtonSocial platform="instagram" color="black"></ButtonSocial>
        <ButtonSocial platform="pinterest" color="black"></ButtonSocial>
        <ButtonSocial platform="youtube" color="black"></ButtonSocial>
      </div>
      <h3>Default Social List</h3>
      <div className="batch">
        <SocialList></SocialList>
      </div>
      <h3>Custom Social List</h3>
      <div className="batch">
        <SocialList socials={['bluesky', 'discord', 'instagram']}></SocialList>
      </div>
      <h3>Pill Button</h3>
      <div className="batch">
        <Button>Primary Button</Button>
        <Button disabled>Primary Disabled</Button>
        <Button tag="a" href="#">
          With Href
        </Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="secondary" disabled>
          Secondary Disabled
        </Button>
        <Button loading>Loading</Button>
        <Button variant="secondary" loading>
          Loading
        </Button>
      </div>
    </div>
  )
}

export default DesignLibrary
