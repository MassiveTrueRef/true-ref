import React from 'react'
import './styles.css'

export const metadata = {
  description: 'Create beautiful, interactive reference guides and documentation',
  title: 'TrueRef - Reference Guides Made Simple',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
