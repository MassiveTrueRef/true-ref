'use client'

import { useEffect } from 'react'
import Button from '../components/ui/ButtonPill'

import './style.css'

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
      <h1>Design Library</h1>
      <h2>Buttons</h2>
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
