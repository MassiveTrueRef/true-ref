'use client'
import { useRowLabel } from '@payloadcms/ui'

export const RowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ label?: string }>()
  return data?.label || `Link ${String(rowNumber + 1).padStart(2, '0')}`
}
