import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'
import configPromise from '@/payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import { Header } from '../components/Header'
import '../styles.css'
export const dynamic = 'force-dynamic'

// export async function generateStaticParams() {
//   const payload = await getPayload({ config: configPromise })
//   const pages = await payload.find({
//     collection: 'pages',
//     draft: false,
//     limit: 1000,
//   })

//   return pages.docs?.map(({ slug }) => ({ slug })) || []
// }

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const page = result.docs?.[0] || null

  if (!page) {
    return notFound()
  }

  return (
    <div className="page-container">
      <Header />
      <div className="page-content hero-content">
        <div className="hero-main" style={{ textAlign: 'left', padding: '2rem' }}>
          <h1>{page.title}</h1>
          <div className="rich-text">{page.content && <RichText data={page.content} />}</div>
        </div>
      </div>
    </div>
  )
}
