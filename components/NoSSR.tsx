'use client'

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

interface NoSSRProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

function NoSSRContent({ children }: NoSSRProps) {
  return <>{children}</>
}

const NoSSR = dynamic(() => Promise.resolve(NoSSRContent), {
  ssr: false
})

export default NoSSR
